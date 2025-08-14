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
    'regulacao_emocional': { name: 'Regulação Emocional', icon: <Zap size={24} />, color: 'text-yellow-600' },
    'comunicacao': { name: 'Comunicação', icon: <MessageCircle size={24} />, color: 'text-blue-600' },
    'foco_atencao': { name: 'Foco e Atenção', icon: <BrainCircuit size={24} />, color: 'text-green-600' },
    'habilidades_sociais': { name: 'Habilidades Sociais', icon: <Users size={24} />, color: 'text-purple-600' },
    'rotina_diaria': { name: 'Rotina Diária', icon: <CheckCircle size={24} />, color: 'text-indigo-600' },
    'independencia': { name: 'Independência', icon: <Star size={24} />, color: 'text-pink-600' },
    'gestao_ansiedade': { name: 'Gestão de Ansiedade', icon: <Award size={24} />, color: 'text-red-600' },
    'coordenacao_motora': { name: 'Coordenação Motora', icon: <BarChart2 size={24} />, color: 'text-orange-600' },
};

// ================================================================
// MAPA ESTRATÉGICO EXPANDIDO PARA FOCO E ATENÇÃO
// ================================================================
const ACTIVITY_TO_OBJECTIVE_MAP: { [key: string]: { objectives: string[], path: string, phase: number } } = {
    // --- Foco e Atenção ---
    'Atenção Sustentada': { objectives: ['foco_atencao'], path: '/attention-sustained', phase: 1 },
    'Foco Seletivo': { objectives: ['foco_atencao'], path: '/attention-selective', phase: 1 },
    'Stop-Go': { objectives: ['foco_atencao', 'regulacao_emocional'], path: '/stop-go', phase: 1 },
    'Atenção Dividida': { objectives: ['foco_atencao'], path: '/divided-attention', phase: 2 },
    'Foco Auditivo': { objectives: ['foco_atencao'], path: '/auditory-focus', phase: 2 },
    'Atenção Rítmica': { objectives: ['foco_atencao'], path: '/rhythm-attention', phase: 2 },
    'Desafio Multitarefa': { objectives: ['foco_atencao'], path: '/multitask-challenge', phase: 3 },
    'Memória Sequencial Visual': { objectives: ['foco_atencao'], path: '/visual-memory-sequence', phase: 3 },
    'Digit Span': { objectives: ['foco_atencao'], path: '/digit-span', phase: 3 },
    'Dual N-Back': { objectives: ['foco_atencao'], path: '/dual-n-back', phase: 3 },
    'Labirinto Mental': { objectives: ['foco_atencao'], path: '/mental-maze', phase: 3 },
    'Padrões Visuais': { objectives: ['foco_atencao'], path: '/visual-patterns', phase: 2 },
    'Controle Inibitório': { objectives: ['foco_atencao', 'regulacao_emocional'], path: '/inhibitory-control', phase: 1 },

    // --- Outras Atividades Mapeadas ---
    'Respiração e Calma': { objectives: ['regulacao_emocional', 'gestao_ansiedade'], path: '/breathing-techniques', phase: 1 },
    'Iniciando Conversas': { objectives: ['comunicacao', 'habilidades_sociais'], path: '/conversation-starters', phase: 1 },
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
    const totalActivities = sessions.length;
    const totalXP = totalActivities * 10;
    return { totalActivities, totalXP, achievements: 0, socialLevel: 1 };
  }, [sessions]);
  
  const activitiesForSelectedObjective = useMemo(() => {
    if (!viewingObjective) return [];
    // Por enquanto, mostraremos todas as fases para testar
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
                <div className="border-t pt-5 space-y-3">
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
              
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
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

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200"><MessageSquareText className="text-blue-600 mb-2" size={32}/><span className="font-semibold text-gray-700">Chat IA</span></button>
                    <button className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200"><FileText className="text-green-600 mb-2" size={32}/><span className="font-semibold text-gray-700">Relatórios</span></button>
                    <button className="flex flex-col items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors duration-200"><Library className="text-yellow-600 mb-2" size={32}/><span className="font-semibold text-gray-700">Biblioteca</span></button>
                    <button className="flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"><Settings className="text-gray-600 mb-2" size={32}/><span className="font-semibold text-gray-700">Configurações</span></button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
