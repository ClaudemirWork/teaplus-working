'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { BarChart2, Award, Users, Star, CheckCircle, Zap, MessageCircle, BrainCircuit, PlayCircle, Target, MessageSquareText, FileText, Library, Settings } from 'lucide-react';

import { fetchUserSessions } from './dashboardUtils';

// Tipos e Constantes
type UserProfile = {
  name: string | null;
  avatar: string | null;
  primary_condition: string | null;
  therapeutic_objectives: string[] | null;
};

const AVATAR_EMOJIS: { [key: string]: string } = {
  star: '⭐', rocket: '🚀', unicorn: '🦄', dragon: '🐉',
  robot: '🤖', cat: '🐱', dog: '🐶', lion: '🦁',
  fox: '🦊', headphone: '🎧', joystick: '🎮', compass: '🧭', shield: '🛡️'
};

const OBJECTIVE_DETAILS: { [key: string]: { name: string; icon: React.ReactNode; color: string } } = {
    'regulacao_emocional': { name: 'Regulação Emocional', icon: <Zap size={24} />, color: 'text-yellow-500' },
    'comunicacao': { name: 'Comunicação', icon: <MessageCircle size={24} />, color: 'text-blue-500' },
    'foco_atencao': { name: 'Foco e Atenção', icon: <BrainCircuit size={24} />, color: 'text-green-500' },
    'habilidades_sociais': { name: 'Habilidades Sociais', icon: <Users size={24} />, color: 'text-purple-500' },
    'rotina_diaria': { name: 'Rotina Diária', icon: <CheckCircle size={24} />, color: 'text-indigo-500' },
    'independencia': { name: 'Independência', icon: <Star size={24} />, color: 'text-pink-500' },
    'gestao_ansiedade': { name: 'Gestão de Ansiedade', icon: <Award size={24} />, color: 'text-red-500' },
    'coordenacao_motora': { name: 'Coordenação Motora', icon: <BarChart2 size={24} />, color: 'text-orange-500' },
};

export default function DashboardPage() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
         <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">TeaPlus</h1>
                {profile && (
                    <div className="text-right">
                        <p className="font-semibold text-gray-800">{profile.name || 'Usuário'}</p>
                        <p className="text-xs text-gray-500">{profile.primary_condition?.replace('_', ' + ') || 'Condição'}</p>
                    </div>
                )}
            </div>
         </div>
      </header>

      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          
          {profile && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center space-x-6">
                <div className="text-6xl bg-gray-200 p-3 rounded-full">
                    {AVATAR_EMOJIS[profile.avatar || ''] || '👤'}
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                        Olá, {profile.name?.split(' ')[0] || 'Usuário'}!
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Acompanhe aqui a sua jornada de desenvolvimento e progresso.
                    </p>
                </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center"><div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4"><BarChart2 size={24} /></div><div><p className="text-sm text-gray-500">Atividades Totais</p><p className="text-2xl font-bold text-gray-800">0</p></div></div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center"><div className="bg-yellow-100 text-yellow-600 p-3 rounded-full mr-4"><Award size={24} /></div><div><p className="text-sm text-gray-500">Conquistas</p><p className="text-2xl font-bold text-gray-800">0</p></div></div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center"><div className="bg-green-100 text-green-600 p-3 rounded-full mr-4"><Users size={24} /></div><div><p className="text-sm text-gray-500">Nível Social</p><p className="text-2xl font-bold text-gray-800">1</p></div></div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center"><div className="bg-purple-100 text-purple-600 p-3 rounded-full mr-4"><Star size={24} /></div><div><p className="text-sm text-gray-500">Pontos XP</p><p className="text-2xl font-bold text-gray-800">0</p></div></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <div className="flex justify-between items-center mb-2"><h3 className="text-lg font-bold text-gray-800 flex items-center"><Target className="mr-2 text-indigo-500"/> Meta Semanal</h3><span className="text-sm font-semibold text-gray-600">63% de 75 atividades</span></div>
            <div className="w-full bg-gray-200 rounded-full h-4"><div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full" style={{ width: `63%` }}></div></div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Próximos Marcos</h3>
            <div className="space-y-5">
              {profile?.therapeutic_objectives?.map((objectiveId) => {
                const details = OBJECTIVE_DETAILS[objectiveId];
                const progress = Math.floor(Math.random() * (85 - 40 + 1)) + 40; // Progresso de exemplo
                if (!details) return null;

                return (
                  <div key={objectiveId}>
                    <div className="flex items-center justify-between mb-1">
                      <div className={`flex items-center font-semibold ${details.color}`}>
                        {details.icon}
                        <span className="ml-2">{details.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-600">{progress}% concluído</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className={`bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200"><MessageSquareText className="text-blue-600 mb-2" size={32}/><span className="font-semibold text-gray-700">Chat IA</span></button>
                <button className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200"><FileText className="text-green-600 mb-2" size={32}/><span className="font-semibold text-gray-700">Relatórios</span></button>
                <button className="flex flex-col items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors duration-200"><Library className="text-yellow-600 mb-2" size={32}/><span className="font-semibold text-gray-700">Biblioteca</span></button>
                <button className="flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"><Settings className="text-gray-600 mb-2" size={32}/><span className="font-semibold text-gray-700">Configurações</span></button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
