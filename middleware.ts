// Copie e cole este código completo no seu arquivo middleware.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { pathname } = req.nextUrl

  // Esta parte cria um cliente do Supabase de forma segura no servidor
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

  // Pega a sessão do usuário para saber se ele está logado
  const { data: { session } } = await supabase.auth.getSession()

  // Se o usuário NÃO estiver logado...
  if (!session) {
    const publicRoutes = ['/login', '/signup', '/']
    // E tentar acessar uma página protegida...
    if (!publicRoutes.includes(pathname)) {
      // ...nós o enviamos para a tela de login.
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res
  }

  // Se o usuário ESTIVER LOGADO...
  // Precisamos verificar se ele já completou o onboarding.
  // Buscamos no banco de dados se a "condição primária" foi preenchida.
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('primary_condition')
    .eq('user_id', session.user.id)
    .single()

  // Se "primary_condition" existir, o onboarding está completo.
  const isOnboardingComplete = userProfile?.primary_condition;

  const onboardingPath = '/profileselection';

  // Se o onboarding ESTÁ COMPLETO...
  if (isOnboardingComplete) {
    // ...e ele tentar acessar a página de onboarding...
    if (pathname.startsWith(onboardingPath)) {
      // ...nós o redirecionamos para a página principal do app (que criaremos no próximo passo).
      return NextResponse.redirect(new URL('/home', req.url));
    }
  } 
  // Se o onboarding NÃO ESTÁ COMPLETO...
  else {
    // ...e ele NÃO estiver na página de onboarding...
    if (!pathname.startsWith(onboardingPath)) {
       // ...nós o FORÇAMOS a ir para a página de onboarding.
      return NextResponse.redirect(new URL(onboardingPath, req.url));
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
