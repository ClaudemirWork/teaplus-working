// Cole este código em app/dashboard/dashboardUtils.ts

// A importação do createClient pode variar dependendo da sua estrutura
// Usando o caminho relativo a partir da raiz do 'app' que é mais estável.
import { createClient } from '@/utils/supabaseClient';

// O resto do arquivo permanece o mesmo
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
