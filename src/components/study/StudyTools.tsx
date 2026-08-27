import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StudyFlashcard } from '../../types';
import { StorageService } from '../../services/storageService';
import {
  Calculator,
  Timer,
  Layers,
  Plus,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  BookOpen,
} from 'lucide-react';

interface CourseEntry {
  id: string;
  code: string;
  units: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

const GRADE_POINTS: Record<string, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
};

export const StudyTools: React.FC = () => {
  const { currentUser } = useAuth();
  const { success, info } = useToast();

  const [activeTool, setActiveTool] = useState<'gpa' | 'pomodoro' | 'flashcards'>('gpa');

  // GPA Calculator State
  const [courses, setCourses] = useState<CourseEntry[]>([
    { id: '1', code: 'GST 111', units: 2, grade: 'A' },
    { id: '2', code: 'MAT 101', units: 3, grade: 'A' },
    { id: '3', code: 'CHM 101', units: 3, grade: 'B' },
    { id: '4', code: 'PHY 101', units: 3, grade: 'B' },
    { id: '5', code: 'BIO 101', units: 3, grade: 'A' },
  ]);

  const [currentCgpa, setCurrentCgpa] = useState<string>('4.20');
  const [completedUnits, setCompletedUnits] = useState<string>('60');
  const [targetCgpa, setTargetCgpa] = useState<string>('4.50');
  const [remainingUnits, setRemainingUnits] = useState<string>('60');

  // Calculate Semester GPA
  const totalUnits = courses.reduce((acc, c) => acc + (Number(c.units) || 0), 0);
  const totalPoints = courses.reduce((acc, c) => acc + (Number(c.units) || 0) * (GRADE_POINTS[c.grade] || 0), 0);
  const semesterGpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00';

  const addCourseRow = () => {
    setCourses((prev) => [
      ...prev,
      { id: Date.now().toString(), code: '', units: 2, grade: 'A' },
    ]);
  };

  const removeCourseRow = (id: string) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseEntry, value: any) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<'study' | 'short_break' | 'long_break'>('study');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (timerMode === 'study') {
        setCompletedSessions((prev) => prev + 1);
        success('Great focus session completed! Take a 5-minute break.');
        setTimerMode('short_break');
        setTimeLeft(5 * 60);
      } else {
        info('Break ended! Ready to dive back into study?');
        setTimerMode('study');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerMode]);

  const handleTimerModeChange = (mode: 'study' | 'short_break' | 'long_break') => {
    setTimerMode(mode);
    setIsRunning(false);
    if (mode === 'study') setTimeLeft(25 * 60);
    else if (mode === 'short_break') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Flashcards State
  const [flashcards, setFlashcards] = useState<StudyFlashcard[]>([
    {
      id: 'fc-1',
      question: 'What is the standard UNIOSUN grading scale threshold for a First Class degree?',
      answer: 'A Cumulative Grade Point Average (CGPA) of 4.50 to 5.00 on the 5-point scale.',
      courseCode: 'Academic Handbook',
    },
    {
      id: 'fc-2',
      question: 'How is Quality Point calculated in university course scoring?',
      answer: 'Quality Point = Course Credit Unit multiplied by the Grade Point Value (A=5, B=4, C=3, D=2, E=1, F=0).',
      courseCode: 'GST 111',
    },
    {
      id: 'fc-3',
      question: 'What is the primary formula for Newton’s Second Law of Motion?',
      answer: 'Force (F) = mass (m) × acceleration (a), or F = dp/dt (rate of change of momentum).',
      courseCode: 'PHY 101',
    },
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newCardQuestion, setNewCardQuestion] = useState('');
  const [newCardAnswer, setNewCardAnswer] = useState('');
  const [newCardCourse, setNewCardCourse] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardQuestion.trim() || !newCardAnswer.trim()) return;

    const newCard: StudyFlashcard = {
      id: `card-${Date.now()}`,
      question: newCardQuestion.trim(),
      answer: newCardAnswer.trim(),
      courseCode: newCardCourse.trim().toUpperCase() || 'General',
    };

    setFlashcards((prev) => [...prev, newCard]);
    setNewCardQuestion('');
    setNewCardAnswer('');
    setNewCardCourse('');
    setShowAddCard(false);
    success('New flashcard created!');
  };

  // Target CGPA math
  const cCgpa = parseFloat(currentCgpa) || 0;
  const cUnits = parseFloat(completedUnits) || 0;
  const tCgpa = parseFloat(targetCgpa) || 0;
  const rUnits = parseFloat(remainingUnits) || 0;

  const neededGpa =
    rUnits > 0
      ? (((tCgpa * (cUnits + rUnits)) - (cCgpa * cUnits)) / rUnits).toFixed(2)
      : '0.00';

  return (
    <div className="space-y-6">
      {/* Tool switcher tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTool('gpa')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTool === 'gpa'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>5.0 GPA & CGPA Calculator</span>
        </button>

        <button
          onClick={() => setActiveTool('pomodoro')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTool === 'pomodoro'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>Focus Pomodoro Timer</span>
        </button>

        <button
          onClick={() => setActiveTool('flashcards')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTool === 'flashcards'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Interactive Flashcards</span>
        </button>
      </div>

      {/* GPA CALCULATOR TAB */}
      {activeTool === 'gpa' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Course Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Semester GPA Calculator (5.0 Scale)
                </h3>
                <p className="text-xs text-slate-500">Standard Nigerian University grading protocol</p>
              </div>

              <button
                onClick={addCourseRow}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Course
              </button>
            </div>

            {/* Courses Rows */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                <span className="col-span-5 sm:col-span-6">Course Code</span>
                <span className="col-span-3 sm:col-span-3">Units</span>
                <span className="col-span-3 sm:col-span-2">Grade</span>
                <span className="col-span-1 text-right"></span>
              </div>

              {courses.map((course) => (
                <div
                  key={course.id}
                  className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-2xl border border-slate-150"
                >
                  <div className="col-span-5 sm:col-span-6">
                    <input
                      type="text"
                      value={course.code}
                      onChange={(e) => updateCourse(course.id, 'code', e.target.value.toUpperCase())}
                      placeholder="e.g. GST 111"
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 uppercase focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-3">
                    <select
                      value={course.units}
                      onChange={(e) => updateCourse(course.id, 'units', Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:border-indigo-500 outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((u) => (
                        <option key={u} value={u}>
                          {u} Unit{u > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <select
                      value={course.grade}
                      onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-black text-indigo-700 focus:border-indigo-500 outline-none"
                    >
                      <option value="A">A (5.0)</option>
                      <option value="B">B (4.0)</option>
                      <option value="C">C (3.0)</option>
                      <option value="D">D (2.0)</option>
                      <option value="E">E (1.0)</option>
                      <option value="F">F (0.0)</option>
                    </select>
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => removeCourseRow(course.id)}
                      disabled={courses.length <= 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Result Bar */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
              <div>
                <span className="text-xs text-indigo-900 font-bold block">
                  Total Registered Units: {totalUnits} • Points: {totalPoints}
                </span>
                <span className="text-[11px] text-indigo-700">
                  {Number(semesterGpa) >= 4.5 ? 'First Class Standing' : Number(semesterGpa) >= 3.5 ? 'Second Class Upper' : 'Good Academic Standing'}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 block uppercase">Semester GPA</span>
                <span className="text-2xl font-black text-indigo-700 font-mono">{semesterGpa}</span>
              </div>
            </div>
          </div>

          {/* Target CGPA Projector Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-black text-slate-900">Target CGPA Planner</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calculate the minimum GPA you must achieve in remaining semesters to graduate with your desired honors class.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Current CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5.0"
                  value={currentCgpa}
                  onChange={(e) => setCurrentCgpa(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Total Units Completed</label>
                <input
                  type="number"
                  value={completedUnits}
                  onChange={(e) => setCompletedUnits(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Degree CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5.0"
                  value={targetCgpa}
                  onChange={(e) => setTargetCgpa(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Units Remaining to Graduate</label>
                <input
                  type="number"
                  value={remainingUnits}
                  onChange={(e) => setRemainingUnits(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Target Output Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1 mt-4">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">
                Required Average GPA
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-amber-400 font-mono">
                  {neededGpa}
                </span>
                <span className="text-xs text-slate-300">
                  {Number(neededGpa) > 5.0 ? 'Exceeds 5.0 max' : Number(neededGpa) <= 0 ? 'Target achieved' : 'Realistic Target'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POMODORO TIMER TAB */}
      {activeTool === 'pomodoro' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-xs text-center space-y-6">
          {/* Mode Selector */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-2xl gap-1">
            <button
              onClick={() => handleTimerModeChange('study')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timerMode === 'study' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Focus Session (25m)
            </button>
            <button
              onClick={() => handleTimerModeChange('short_break')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timerMode === 'short_break' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Short Break (5m)
            </button>
            <button
              onClick={() => handleTimerModeChange('long_break')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timerMode === 'long_break' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Long Break (15m)
            </button>
          </div>

          {/* Clock Display */}
          <div className="py-6">
            <div className="text-6xl sm:text-7xl font-black text-slate-900 font-mono tracking-tight">
              {formatTimer(timeLeft)}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {timerMode === 'study' ? 'Deep concentration sprint' : 'Rest your eyes and hydrate'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
            </button>

            <button
              onClick={() => handleTimerModeChange(timerMode)}
              className="p-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Streak Tracker */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 py-2.5 rounded-2xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{completedSessions} Pomodoro sessions completed today</span>
          </div>
        </div>
      )}

      {/* FLASHCARDS TAB */}
      {activeTool === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Study Revision Flashcards</h3>
              <p className="text-xs text-slate-500">
                Card {currentCardIndex + 1} of {flashcards.length}
              </p>
            </div>

            <button
              onClick={() => setShowAddCard(true)}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Card
            </button>
          </div>

          {/* Flashcard Card Container */}
          {flashcards.length > 0 && (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full min-h-[260px] bg-white rounded-3xl border-2 border-slate-200 hover:border-indigo-400 p-8 shadow-md flex flex-col justify-between cursor-pointer transition-all select-none"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {flashcards[currentCardIndex].courseCode || 'Study Card'}
                </span>
                <span>{isFlipped ? 'Answer' : 'Question (Tap to flip)'}</span>
              </div>

              <div className="my-auto py-6 text-center">
                <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
                  {isFlipped
                    ? flashcards[currentCardIndex].answer
                    : flashcards[currentCardIndex].question}
                </p>
              </div>

              <div className="text-center text-[11px] text-slate-400 font-semibold">
                Tap card to reveal {isFlipped ? 'question' : 'answer'}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Create Flashcard Modal */}
          {showAddCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h4 className="text-sm font-black text-slate-900">Create Study Flashcard</h4>
                  <button onClick={() => setShowAddCard(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddCard} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Course Code</label>
                    <input
                      type="text"
                      value={newCardCourse}
                      onChange={(e) => setNewCardCourse(e.target.value)}
                      placeholder="e.g. GST 111"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Question / Prompt *</label>
                    <textarea
                      value={newCardQuestion}
                      onChange={(e) => setNewCardQuestion(e.target.value)}
                      placeholder="Enter the question or concept to test..."
                      required
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Answer / Explanation *</label>
                    <textarea
                      value={newCardAnswer}
                      onChange={(e) => setNewCardAnswer(e.target.value)}
                      placeholder="Enter the concise answer or solution..."
                      required
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCard(false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                    >
                      Save Card
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
