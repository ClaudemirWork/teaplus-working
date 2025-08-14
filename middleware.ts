// Importa o cliente de Supabase para middleware.
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
  
  // Cria uma instância do cliente Supabase para o middleware.
  // Isso nos permite interagir com o Supabase de forma segura.
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresca a sessão do usuário. Isso é crucial para manter a autenticação
  // entre as requisições e garantir que a sessão esteja sempre atualizada.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  const { pathname } = req.nextUrl;
  
  // Define rotas que não requerem autenticação.
  const publicRoutes = ['/', '/login', '/signup'];
  
  // Se o usuário tentar acessar uma rota pública, permite.
  if (publicRoutes.includes(pathname)) {
    return res;
  }

  // Se não houver sessão, o usuário não está logado. Redireciona para o login.
  if (!session) {
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // --- LÓGICA DE VERIFICAÇÃO DE PERFIL APRIMORADA ---
  
  // Se o usuário está logado, verifica se o perfil está completo.
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('primary_condition, therapeutic_objectives, avatar')
    .eq('user_id', session.user.id)
    .single();

  // Verifica se há um erro ao buscar o perfil ou se o perfil não existe.
  if (error || !profile) {
    console.error('Erro ao buscar perfil no middleware:', error);
    // Se o perfil não for encontrado, redireciona para a seleção de perfil.
    // Isso garante que o onboarding seja feito.
    if (pathname !== '/profileselection') {
      return NextResponse.redirect(new URL('/profileselection', req.url));
    }
  } else if (!profile.avatar || !profile.primary_condition || profile.therapeutic_objectives?.length === 0) {
    // Se o perfil existe mas está incompleto (por exemplo, falta o avatar),
    // redireciona para a seleção de perfil.
    if (pathname !== '/profileselection') {
      return NextResponse.redirect(new URL('/profileselection', req.url));
    }
  }
  
  // Se o perfil estiver completo e o usuário estiver na página de profileselection,
  // significa que ele já terminou o onboarding e pode ser redirecionado para a
  // sua página personalizada.
  if (profile && profile.avatar && pathname === '/profileselection') {
    const redirectTo = getAppRoute(profile.primary_condition);
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }
  
  // Se o usuário está logado e o perfil está completo, permite que ele acesse a página.
  return res;
}

export const config = {
  // O matcher define quais rotas o middleware irá interceptar.
  // A regex garante que ele não intercepta chamadas de API, arquivos estáticos, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
