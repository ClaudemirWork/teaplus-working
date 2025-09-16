// utils/supabaseClient.ts

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Define os tipos para as variáveis de ambiente para garantir que não sejam undefined
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
