import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      cookies: {
        name: 'teaplus-auth',
        lifetime: 60 * 60 * 24 * 7, // 7 days
        domain: undefined,
        path: '/',
        sameSite: 'lax',
      },
    }
  );
}
