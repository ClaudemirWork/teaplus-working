import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Cria uma resposta para o cliente.
  const res = NextResponse.next();
  // Cria uma instância do cliente Supabase para o middleware,
  // permitindo a interação com o Supabase de forma segura.
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresca a sessão do usuário. Isso é crucial para manter a autenticação.
  const { data: { session } } = await supabase.auth.getSession();
  
  const { pathname } = req.nextUrl;
  
  // Define rotas que não requerem autenticação.
  const publicRoutes = ['/', '/login', '/signup'];

  // Se o usuário não tem uma sessão, mas tenta acessar uma rota protegida,
  // redireciona para a página de login.
  if (!session && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // Se o usuário tem uma sessão e tenta acessar uma rota pública,
  // redireciona para a página de seleção de perfil para verificar o status.
  if (session && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/profileselection', req.url));
  }
  
  // Permite que o usuário continue se a lógica acima não se aplicar.
  return res;
}

export const config = {
  // O matcher define quais rotas o middleware irá interceptar.
  // A regex garante que ele não intercepta chamadas de API, arquivos estáticos, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
