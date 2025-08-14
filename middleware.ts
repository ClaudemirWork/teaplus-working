// Copie e cole este código completo no seu arquivo middleware.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { pathname } = req.nextUrl

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Se o usuário NÃO ESTÁ LOGADO
  if (!session) {
    // Se ele tentar acessar qualquer página interna, redireciona para o login.
    // A página inicial '/' é pública.
    if (pathname.startsWith('/home') || pathname.startsWith('/profileselection')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return res;
  }

  // Se o usuário ESTÁ LOGADO
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('primary_condition')
    .eq('user_id', session.user.id)
    .single()

  const onboardingComplete = !!userProfile?.primary_condition;

  // REGRA ESPECIAL: Se o usuário logado chegar na página inicial...
  if (pathname === '/') {
    // ... o enviamos para o lugar certo.
    if (onboardingComplete) {
      return NextResponse.redirect(new URL('/home', req.url)); // Vai para o app
    } else {
      return NextResponse.redirect(new URL('/profileselection', req.url)); // Vai para o onboarding
    }
  }

  // Se o onboarding NÃO está completo, força o usuário a ir para lá,
  // a menos que ele já esteja na página de onboarding ou login.
  if (!onboardingComplete && !pathname.startsWith('/profileselection') && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/profileselection', req.url));
  }

  // Se o onboarding ESTÁ completo, impede o usuário de acessar o onboarding novamente.
  if (onboardingComplete && pathname.startsWith('/profileselection')) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
