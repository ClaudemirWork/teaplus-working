// Cole este código completo em app/dashboard/dashboardUtils.ts

// IMPORTANTE: A lógica de conexão com o Supabase agora está diretamente aqui.
import { createBrowserClient } from '@supabase/ssr';

// Esta função cria a conexão. Ela substitui a necessidade de importar o arquivo.
const createClient = () => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// A função que busca as sessões agora usa a conexão criada aqui mesmo.
export async function fetchUserSessions(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('sessoes')
    .select('*')
    .eq('user_id', userId) 
    .order('data_fim', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar sessoes do usuário:', error);
    return [];
  }
  
  return data || [];
}
