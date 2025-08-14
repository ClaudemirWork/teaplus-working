import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Função para determinar a rota de destino com base na condição do usuário.
const getAppRoute = (condition: string) => {
  switch (condition) {
    case 'TEA':
      return '/tea';
    case 'TDAH':
      return '/tdah';
    case 'TEA_TDAH':
      return '/combined';
    default:
      return '/tea'; // Rota padrão
  }
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = req.nextUrl;
  
  const publicRoutes = ['/', '/login', '/signup'];
  
  // Se o usuário está em uma rota pública e não está logado, permite.
  if (publicRoutes.includes(pathname) && !session) {
    return res;
  }

  // Se o usuário está logado e tenta acessar uma rota pública, redireciona.
  if (publicRoutes.includes(pathname) && session) {
    // Redireciona para a página de seleção de perfil, onde a lógica de
    // verificação completa acontecerá.
    return NextResponse.redirect(new URL('/profileselection', req.url));
  }

  // Se não houver sessão e a rota não for pública, redireciona para o login.
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // --- Lógica de verificação de perfil para rotas protegidas ---
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('primary_condition, avatar')
    .eq('user_id', session.user.id)
    .single();

  // Se o perfil não for encontrado ou estiver incompleto
  if (error || !profile || !profile.primary_condition || !profile.avatar) {
    // Se o usuário já está no onboarding, permite.
    if (pathname === '/profileselection') {
      return res;
    }
    // Caso contrário, redireciona para o onboarding.
    return NextResponse.redirect(new URL('/profileselection', req.url));
  }

  // Se o perfil está completo e o usuário tenta acessar o onboarding,
  // redireciona para a página correta.
  if (pathname === '/profileselection') {
    const redirectTo = getAppRoute(profile.primary_condition);
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }
  
  // Permite o acesso se o usuário está logado, com perfil completo e na rota correta.
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
