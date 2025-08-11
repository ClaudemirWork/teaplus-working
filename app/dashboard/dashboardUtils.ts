import { createClient } from '../utils/supabaseClient'

export interface SessionData {
  id: number
  atividade_nome: string
  pontuacao_final: number
  data_fim: string
  detalhes: any
  paciente_id: number
}

export async function fetchAllSessions() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('sessoes')
    .select('*')
    .order('data_fim', { ascending: false })
  
  if (error) {
    console.error('Erro:', error)
    return []
  }
  
  return data || []
}

export function calculateMetrics(sessions: SessionData[]) {
  const totalSessions = sessions.length
  
  const sessionsByActivity = sessions.reduce((acc, session) => {
    if (!acc[session.atividade_nome]) {
      acc[session.atividade_nome] = []
    }
    acc[session.atividade_nome].push(session)
    return acc
  }, {} as Record<string, SessionData[]>)
  
  return {
    totalSessions,
    sessionsByActivity
  }
}
