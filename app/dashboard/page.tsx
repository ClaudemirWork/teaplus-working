'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { startOfWeek, isAfter, isValid } from 'date-fns';
import { BarChart2, Award, Users, Star, CheckCircle, Zap, MessageCircle, BrainCircuit, PlayCircle, Target, MessageSquareText, FileText, Library, Settings, ArrowLeft } from 'lucide-react';

import { fetchUserSessions } from './dashboardUtils';

// Tipos e Constantes
type UserProfile = {
  name: string | null;
  avatar: string | null;
  primary_condition: string | null;
  therapeutic_objectives: string[] | null;
};

type Session = {
    id: number;
    atividade_nome: string;
    pontuacao_final: number;
    data_fim: string;
};

const AVATAR_EMOJIS: { [key: string]: string } = {
  star: '⭐', rocket: '🚀', unicorn: '🦄', dragon: '🐉',
  robot: '🤖', cat: '🐱', dog: '🐶', lion: '🦁',
  fox: '🦊', headphone: '🎧', joystick: '🎮', compass: '🧭', shield: '🛡️'
};

const OBJECTIVE_DETAILS: { [key: string]: { name: string; icon: React.ReactNode; color: string } } = {
    'regulacao_emocional': { name: 'Regulação Emocional', icon: '🧘', color: 'text-yellow-600' },
    'comunicacao': { name: 'Comunicação', icon: '💬', color: 'text-blue-600' },
    'foco_atencao': { name: 'Foco e Atenção', icon: '🎯', color: 'text-green-600' },
    'habilidades_sociais': { name: 'Habilidades Sociais', icon: '👥', color: 'text-purple-600' },
    'rotina_diaria': { name: 'Rotina Diária', icon: '📅', color: 'text-indigo-600' },
    'independencia': { name: 'Independência', icon: '🦋', color: 'text-pink-600' },
    'gestao_ansiedade': { name: 'Gestão de Ansiedade', icon: '🧘', color: 'text-red-600' },
    'coordenacao_motora': { name: 'Coordenação Motora', icon: '🤸', color: 'text-orange-600' },
};

// Mapeamento de Atividades para Objetivos (nosso "livro de receitas")
const ACTIVITY_TO_OBJECTIVE_MAP: { [key: string]: { objectives: string[], path: string } } = {
    'Jogo do Semáforo': { objectives: ['regulacao_emocional', 'foco_atencao'], path: '/traffic-light-game' },
    'Respiração e Calma': { objectives: ['regulacao_emocional', 'gestao_ansiedade'], path: '/breathing-techniques' },
    'Diálogo Focado': { objectives: ['comunicacao', 'foco_atencao'], path: '/dialogue-scenes' },
    'Iniciando Conversas': { objectives: ['comunicacao', 'habilidades_sociais'], path: '/conversation-starters' },
    'Atenção Sustentada': { objectives: ['foco_atencao'], path: '/attention-sustained' },
    'Contato Visual': { objectives: ['habilidades_sociais'], path: '/eye-contact' },
    'Rotinas Diárias': { objectives: ['rotina_diaria'], path: '/daily-routine-builder' },
    // Este mapa precisa ser expandido com todas as 92 atividades
};


export default function DashboardPage() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingObjective, setViewingObjective] = useState<string | null>(null);

  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const [profileResponse, sessionsResponse] = await Promise.all([
          supabase.from('user_profiles').select('name, avatar, primary_condition, therapeutic_objectives').eq('user_id', session.user.id).single(),
          fetchUserSessions(session.user.id)
        ]);

        if (profileResponse.error && profileResponse.error.code !== 'PGRST116') {
          console.error('Erro ao buscar perfil:', profileResponse.error);
        } else {
          setProfile(profileResponse.data);
        }
        
        setSessions(sessionsResponse as any);

      } else {
        router.push('/login');
      }
      setLoading(false);
    };

    fetchAllData();
  }, [supabase, router]);

  const dashboardData = useMemo(() => {
    // ... (cálculos de kpiData, weeklyProgress, etc.) ...
    return { totalActivities: sessions.length, totalXP: sessions.length * 10 };
  }, [sessions]);
  
  const activitiesForSelectedObjective = useMemo(() => {
    if (!viewingObjective) return [];
    return Object.entries(ACTIVITY_TO_OBJECTIVE_MAP)
      .filter(([_, value]) => value.objectives.includes(viewingObjective))
      .map(([key, value]) => ({ name: key, path: value.path }));
  }, [viewingObjective]);

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">A carregar o seu dashboard...</p>
            </div>
        </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white rounded-xl shadow-md p-4 mt-4 mx-4 sm:mx-6">
         <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">TeaPlus</h1>
                {profile && (
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="font-semibold text-gray-800">{profile.name || 'Usuário'}</p>
                            <p className="text-xs text-gray-500">{profile.primary_condition?.replace('_', ' + ') || 'Condição'}</p>
                        </div>
                    </div>
                )}
            </div>
         </div>
      </header>

      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          
          {viewingObjective ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 fade-in">
                <button onClick={() => setViewingObjective(null)} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-6">
                    <ArrowLeft className="mr-2" size={20}/>
                    <span>Voltar</span>
                </button>
                <h2 className="text-3xl font-bold text-gray-800 mb-5 flex items-center">
                    <span className="text-4xl mr-4">{OBJECTIVE_DETAILS[viewingObjective]?.icon}</span>
                    {OBJECTIVE_DETAILS[viewingObjective]?.name}
                </h2>
                <div className="space-y-3">
                    {activitiesForSelectedObjective.length > 0 ? activitiesForSelectedObjective.map(activity => (
                        <div key={activity.name} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors">
                            <p className="font-medium text-gray-700">{activity.name}</p>
                            <button onClick={() => router.push(activity.path)} className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors">
                                Iniciar
                            </button>
                        </div>
                    )) : <p className="text-gray-500">Nenhuma atividade encontrada para este objetivo ainda.</p>}
                </div>
            </div>
          ) : (
            <div className="fade-in">
              {profile && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex items-center space-x-6">
                    <div className="text-6xl">{AVATAR_EMOJIS[profile.avatar || ''] || '👤'}</div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Olá, {profile.name?.split(' ')[0] || 'Usuário'}!</h2>
                        <p className="text-gray-600 mt-1">Pronto para a sua jornada de desenvolvimento de hoje?</p>
                    </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-lg text-center"><p className="text-sm text-gray-500">Atividades Totais</p><p className="text-3xl font-bold text-gray-800">{dashboardData.totalActivities}</p></div>
                <div className="bg-white p-4 rounded-xl shadow-lg text-center"><p className="text-sm text-gray-500">Conquistas</p><p className="text-3xl font-bold text-gray-800">0</p></div>
                <div className="bg-white p-4 rounded-xl shadow-lg text-center"><p className="text-sm text-gray-500">Nível Social</p><p className="text-3xl font-bold text-gray-800">1</p></div>
                <div className="bg-white p-4 rounded-xl shadow-lg text-center"><p className="text-sm text-gray-500">Pontos XP</p><p className="text-3xl font-bold text-gray-800">{dashboardData.totalXP}</p></div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Os Seus Próximos Marcos</h3>
                <div className="space-y-2">
                  {profile?.therapeutic_objectives?.map((objectiveId) => {
                    const details = OBJECTIVE_DETAILS[objectiveId];
                    if (!details) return null;
                    return (
                      <div key={objectiveId} onClick={() => setViewingObjective(objectiveId)} className="p-4 rounded-xl group bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-3xl">{details.icon}</span>
                                <div className="ml-4">
                                    <p className={`font-bold text-lg ${details.color} group-hover:underline`}>{details.name}</p>
                                    <p className="text-xs text-gray-500">0% concluído</p>
                                </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-gray-800 transition-colors duration-200"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full" style={{ width: `0%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
