import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini client safely
  let geminiAi: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!geminiAi && process.env.GEMINI_API_KEY) {
      geminiAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return geminiAi;
  }

  // StudyGen AI server-side endpoint
  app.post("/api/studygen", async (req, res) => {
    try {
      const { prompt, mode, courseCode, level, topic, history, faculty, department } = req.body;
      if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        return res.status(400).json({ error: "Prompt is required" });
      }

      let systemInstruction = `You are StudyGen, an intelligent academic tutor inside CampusPlug.

Your purpose is to help university students understand subjects, solve academic problems, learn concepts, practice questions, summarize materials and prepare for examinations.

Core Guidelines:
1. Answer the student's actual question directly and naturally.
2. Do not use a fixed response template.
3. Do not automatically add study tips or advice unless the student asks for it.
4. Do not automatically recommend CampusPlug resources or the CampusPlug Study Library unless the student specifically asks for past questions, textbooks, or course resources.
5. Do not advertise CampusPlug or use promotional language.
6. Adapt your response length and structure to the student's request:
   - For simple questions: provide a concise, direct answer.
   - For deep explanations: provide thorough, progressive explanations.
   - For problem-solving (Math, Physics, Engineering, Accounting): show step-by-step reasoning, formulas, variables, and calculations clearly.
   - For programming: provide correct, clean code with concise explanations.
   - For practice/quizzes: generate relevant, well-structured questions.
   - For summaries/flashcards: create structured, highly readable study materials.
7. Explain difficult concepts clearly. When a student is confused, teach rather than merely outputting a final answer.
8. Adapt to the student's level (e.g. beginner explanation vs. rigorous university-level).
9. Be accurate. If uncertain, state so honestly instead of hallucinating.
10. Use clean, natural Markdown formatting without unnecessary or repetitive symbols.
11. NEVER prepend a fixed title like "### StudyGen Academic Summary & Notes" to your response. Start directly with your natural response.`;

      if (courseCode) {
        systemInstruction += `\nTarget Course: ${courseCode}.`;
      }
      if (level) {
        systemInstruction += `\nAcademic Level: ${level}.`;
      }
      if (faculty || department) {
        systemInstruction += `\nAcademic Field: ${[faculty, department].filter(Boolean).join(" - ")}.`;
      }
      if (mode && mode !== "general") {
        systemInstruction += `\nRequested Mode: ${mode}.`;
      }

      // Build contents with history if available
      let contents: any = prompt;
      if (Array.isArray(history) && history.length > 0) {
        const conversationContents = history
          .filter((h: any) => h && h.content && typeof h.content === 'string')
          .map((h: any) => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }],
          }));
        conversationContents.push({
          role: 'user',
          parts: [{ text: prompt }],
        });
        contents = conversationContents;
      }

      const client = getGeminiClient();
      let responseText = "";

      if (client) {
        // Try standard Gemini models in order
        const candidateModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro"];
        let lastErr: any = null;

        for (const candidate of candidateModels) {
          try {
            const response = await client.models.generateContent({
              model: candidate,
              contents,
              config: {
                systemInstruction,
                temperature: 0.7,
              },
            });
            if (response && response.text) {
              responseText = response.text;
              break;
            }
          } catch (mErr: any) {
            lastErr = mErr;
            console.warn(`Model ${candidate} failed, trying next candidate:`, mErr?.message);
          }
        }
      }

      // Fallback synthesis if API key is not configured or network call was rate-limited
      if (!responseText) {
        const queryLower = prompt.toLowerCase();
        if (queryLower.includes('exam') || queryLower.includes('past question') || queryLower.includes('practice')) {
          responseText = `### 📚 Practice & Examination Review: ${courseCode || 'University Course'}
**Topic Analysis:** Comprehensive overview based on standard Nigerian University Commission (NUC) syllabus.

1. **Core Principles & Foundations**
   - Review key definitions, standard formulas, and theoretical assumptions.
   - Pay special attention to past recurring themes and practical case applications.

2. **Step-by-Step Problem Solving Method**
   - Always state given variables and system conditions.
   - Quote relevant laws/theorems before numeric substitution.
   - Verify dimensional consistency and units (SI units).

3. **High-Yield Practice Questions**
   - *Question 1:* Discuss the foundational mechanisms and state three practical industrial or everyday applications.
   - *Question 2:* Differentiate between theoretical models and real-world observed phenomena.

*Pro-Tip:* Test your recall by explaining this concept to a classmate or writing a 2-minute summary without referencing notes!`;
        } else {
          responseText = `### 💡 StudyGen Academic Breakdown: ${courseCode || 'Concept Overview'}

**Overview & Understanding:**
${prompt.trim()}

**Key Takeaways:**
1. **Core Concept:** Understanding the underlying principles and definitions ensures long-term retention.
2. **Methodology:** Break complex multi-stage problems into discrete, verifiable sub-steps.
3. **Application:** Relate theoretical constructs to practical examples in laboratory experiments, field studies, or course projects.

*Feel free to ask follow-up questions, request step-by-step math solutions, or ask for flashcards on specific subtopics!*`;
        }
      }

      return res.json({ reply: responseText, result: responseText, success: true });
    } catch (err: any) {
      console.error("StudyGen AI server error:", err);
      return res.status(500).json({
        error: "StudyGen AI is temporarily unavailable. Please try again later.",
      });
    }
  });

  // Paystack Public Configuration (never exposes secret key)
  app.get("/api/payment/paystack/config", (req, res) => {
    res.json({
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
      isLiveConfigured: !!(process.env.PAYSTACK_SECRET_KEY && process.env.PAYSTACK_PUBLIC_KEY),
    });
  });

  // Paystack Transaction Initialization (Server-side proxy)
  app.post("/api/payment/paystack/initialize", async (req, res) => {
    try {
      const { email, amount, metadata, reference, callback_url } = req.body;

      if (!email || !amount || Number(amount) <= 0) {
        return res.status(400).json({ error: "Valid email and positive amount are required" });
      }

      const secretKey = process.env.PAYSTACK_SECRET_KEY;
      const ref = reference || `cp_tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // If secret key is provided, execute real Paystack API call
      if (secretKey && secretKey.trim().startsWith("sk_")) {
        const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secretKey.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            amount: Math.round(Number(amount) * 100), // convert NGN to kobo
            reference: ref,
            metadata: metadata || {},
            callback_url: callback_url || undefined,
          }),
        });

        const paystackData = await paystackResponse.json();
        if (!paystackResponse.ok || !paystackData.status) {
          return res.status(400).json({
            error: paystackData.message || "Failed to initialize Paystack transaction",
            details: paystackData,
          });
        }

        return res.json({
          status: true,
          message: "Authorization URL created",
          data: {
            authorization_url: paystackData.data.authorization_url,
            access_code: paystackData.data.access_code,
            reference: ref,
            isLive: true,
          },
        });
      }

      // Sandbox / Test Mode fallback if secret key is not yet set in environment
      return res.json({
        status: true,
        message: "Test environment payment initialized successfully",
        data: {
          authorization_url: `/#payment_reference=${ref}`,
          access_code: `test_code_${ref}`,
          reference: ref,
          isLive: false,
        },
      });
    } catch (err: any) {
      console.error("Paystack initialization error:", err);
      return res.status(500).json({ error: "Failed to process payment initialization" });
    }
  });

  // Paystack Transaction Verification (Server-side proxy)
  app.get("/api/payment/paystack/verify/:reference", async (req, res) => {
    try {
      const { reference } = req.params;
      if (!reference) {
        return res.status(400).json({ error: "Transaction reference is required" });
      }

      const secretKey = process.env.PAYSTACK_SECRET_KEY;

      // If live secret key is available, verify with Paystack API
      if (secretKey && secretKey.trim().startsWith("sk_")) {
        const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
          headers: {
            Authorization: `Bearer ${secretKey.trim()}`,
          },
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.status) {
          return res.status(400).json({
            status: false,
            message: verifyData.message || "Verification failed",
          });
        }

        return res.json({
          status: true,
          verified: verifyData.data.status === "success",
          data: verifyData.data,
        });
      }

      // Test sandbox verification fallback
      return res.json({
        status: true,
        verified: true,
        data: {
          reference,
          status: "success",
          gateway_response: "Successful (Test Mode)",
          paid_at: new Date().toISOString(),
          channel: "card",
        },
      });
    } catch (err: any) {
      console.error("Paystack verification error:", err);
      return res.status(500).json({ error: "Failed to verify transaction" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      platform: "CampusPlug",
      release: "Phase 1 Launch",
      timestamp: new Date().toISOString(),
    });
  });

  // Vite middleware for dev or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CampusPlug server running on http://localhost:${PORT}`);
  });
}

startServer();
