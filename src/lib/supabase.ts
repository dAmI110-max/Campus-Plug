import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Access environment variables safely with Vite
const metaEnv = (import.meta as any).env || {};
const supabaseUrl: string = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey.length > 10 &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

// Singleton Supabase client instance
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
};

// Export direct client or fallback
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Upload an image (avatar, product photo, accommodation) to Supabase Storage
 */
export async function uploadImageToSupabase(
  file: File | Blob,
  bucket: 'avatars' | 'listings' | 'accommodations' = 'listings',
  filePath?: string
): Promise<{ url: string | null; error: string | null }> {
  const client = getSupabase();
  if (!client) {
    return { url: null, error: 'Supabase storage is not configured' };
  }

  try {
    const ext = file.type.split('/')[1] || 'jpg';
    const fileName = filePath || `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { data, error: uploadError } = await client.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data: publicUrlData } = client.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Image upload failed' };
  }
}
