/**
 * Browser helpers for Supabase public URLs (read-only).
 * Uploads must go through authenticated /api/upload/sign — never write with the anon key.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { API_BASE_URL } from '@/lib/apiConfig';

declare global {
  interface Window {
    __VIET_RUNTIME_CONFIG__?: {
      supabaseUrl?: string;
      supabaseAnonKey?: string;
    };
  }
}

export type SupabasePublicConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

let resolvedConfig: SupabasePublicConfig | null = null;

export function readSupabasePublicConfig(): SupabasePublicConfig {
  if (resolvedConfig) return resolvedConfig;
  const runtime =
    typeof window !== 'undefined' ? window.__VIET_RUNTIME_CONFIG__ : undefined;
  return {
    supabaseUrl: (
      import.meta.env.VITE_SUPABASE_URL ||
      runtime?.supabaseUrl ||
      ''
    ).trim(),
    supabaseAnonKey: (
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      runtime?.supabaseAnonKey ||
      ''
    ).trim(),
  };
}

let cachedClient: SupabaseClient | null = null;
let clientInitPromise: Promise<SupabaseClient | null> | null = null;

function createSupabaseClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey);
}

/** Lazy read-only Supabase client (optional; uploads use signed URLs via the API). */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (cachedClient) return cachedClient;
  if (!clientInitPromise) {
    clientInitPromise = (async () => {
      let { supabaseUrl, supabaseAnonKey } = readSupabasePublicConfig();

      if (!supabaseUrl || !supabaseAnonKey) {
        try {
          const res = await fetch(`${API_BASE_URL}/client-config`);
          if (res.ok) {
            const data = (await res.json()) as Partial<SupabasePublicConfig>;
            supabaseUrl = (data.supabaseUrl || supabaseUrl).trim();
            supabaseAnonKey = (data.supabaseAnonKey || supabaseAnonKey).trim();
          }
        } catch {
          /* non-fatal */
        }
      }

      if (supabaseUrl && supabaseAnonKey) {
        resolvedConfig = { supabaseUrl, supabaseAnonKey };
        cachedClient = createSupabaseClient(supabaseUrl, supabaseAnonKey);
      }
      return cachedClient;
    })();
  }
  return clientInitPromise;
}

/** @deprecated Prefer getSupabase() — may be null when only runtime config exists. */
export const supabase = (() => {
  const { supabaseUrl, supabaseAnonKey } = readSupabasePublicConfig();
  return supabaseUrl && supabaseAnonKey
    ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
    : null;
})();

/** Bucket for video files (hero, vibe-at-viet). Must be public for reads. */
export const VIDEOS_BUCKET = 'videos';

/** Bucket for images (carousel, gallery, events, faculty, etc.). Must be public for reads. */
export const IMAGES_BUCKET = 'images';

function publicBaseUrl(): string {
  const { supabaseUrl } = readSupabasePublicConfig();
  return supabaseUrl;
}

export function getVideosPublicUrl(path: string): string {
  const supabaseUrl = publicBaseUrl();
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/${VIDEOS_BUCKET}/${path}`;
}

export function getImagesPublicUrl(path: string): string {
  const supabaseUrl = publicBaseUrl();
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/${IMAGES_BUCKET}/${path}`;
}
