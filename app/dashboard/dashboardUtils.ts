// Cole este código em app/dashboard/dashboardUtils.ts

// A importação do createClient pode variar dependendo da sua estrutura
// Se o arquivo supabaseClient estiver na pasta 'utils' na raiz, este caminho está correto.
import { createClient } from '../../utils/supabaseClient';

// A função agora recebe o ID do usuário como um argumento
export async function fetchUserSessions(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('sessoes')
    .select('*')
    // A MÁGICA ACONTECE AQUI: Filtra as sessões para pegar apenas as do usuário logado
    .eq('user_id', userId) 
    .order('data_fim', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar sessoes do usuário:', error);
    return [];
  }
  
  return data || [];
}
