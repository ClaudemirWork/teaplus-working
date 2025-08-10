"use client";

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // A correção está neste objeto de configuração que passamos para a função
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Esta função ensina o Supabase a LER um cookie
          const matches = document.cookie.match(new RegExp(
            '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
          ));
          return matches ? decodeURIComponent(matches[1]) : undefined;
        },
        set(name: string, value: string, options: { maxAge: number }) {
          // Esta função ensina o Supabase a GRAVAR um cookie
          const newOptions: any = { ...options, path: '/', sameSite: 'lax' };
          if (newOptions.maxAge) {
            newOptions.expires = new Date(Date.now() + newOptions.maxAge * 1000);
          }
          document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + Object.entries(newOptions).reduce((acc, [key, value]) => acc + `; ${key}=${value}`, '');
        },
        remove(name: string) {
          // Esta função ensina o Supabase a REMOVER um cookie
          document.cookie = encodeURIComponent(name) + '=; path=/; max-age=-1';
        },
      },
    }
  );
}
