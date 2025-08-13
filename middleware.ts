import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Rotas públicas (não precisam de login)
  const publicRoutes = ['/login', '/signup', '/']
  
  // Se está numa rota pública, deixa passar
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }
  
  // Para outras rotas, verifica se tem token básico
  const accessToken = req.cookies.get('sb-access-token')?.value
  
  // Se não tem token e tenta acessar área protegida → vai para login
  if (!accessToken && pathname.startsWith('/profileselection')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
