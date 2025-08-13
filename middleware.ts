// middleware.ts - CRIAR NA RAIZ DO PROJETO
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verificar sessão
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Rotas que não precisam de autenticação
  const publicRoutes = ['/login', '/signup', '/']
  
  // Rotas que sempre precisam verificar perfil
  const protectedRoutes = ['/profileselection', '/tea', '/tdah', '/combined']

  // Se está em rota pública e não está logado - OK
  if (publicRoutes.includes(pathname) && !session) {
    return res
  }

  // Se não está logado e tenta acessar rota protegida - vai para login
  if (!session && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Se está logado, verificar se tem perfil completo
  if (session) {
    try {
      // Buscar perfil do usuário
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      // Se está na página de login/signup e já está logado
      if (['/login', '/signup'].includes(pathname)) {
        if (profile && profile.therapeutic_objectives && profile.avatar) {
          // Tem perfil completo - vai para app baseado na condição
          const redirectTo = getAppRoute(profile.primary_condition)
          return NextResponse.redirect(new URL(redirectTo, req.url))
        } else {
          // Não tem perfil - vai para onboarding
          return NextResponse.redirect(new URL('/profileselection', req.url))
        }
      }

      // Se está tentando acessar onboarding mas já tem perfil completo
      if (pathname === '/profileselection' && profile && profile.therapeutic_objectives && profile.avatar) {
        const redirectTo = getAppRoute(profile.primary_condition)
        return NextResponse.redirect(new URL(redirectTo, req.url))
      }

      // Se está tentando acessar app mas não tem perfil completo
      if (['/tea', '/tdah', '/combined'].some(route => pathname.startsWith(route))) {
        if (!profile || !profile.therapeutic_objectives || !profile.avatar) {
          return NextResponse.redirect(new URL('/profileselection', req.url))
        }
      }

    } catch (error) {
      console.error('Erro ao verificar perfil:', error)
      // Em caso de erro, permite continuar mas pode redirecionar para onboarding
      if (['/tea', '/tdah', '/combined'].some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/profileselection', req.url))
      }
    }
  }

  return res
}

// Função para determinar rota baseada na condição
function getAppRoute(condition: string) {
  switch (condition) {
    case 'TEA':
      return '/tea'
    case 'TDAH':
      return '/tdah'
    case 'TEA_TDAH':
      return '/combined'
    default:
      return '/tea' // default fallback
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
