'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
// NOVOS ÍCONES
import { BarChart2, Award, Users, Star, CheckCircle, Trophy, Sparkles } from 'lucide-react';

// Importando os componentes que já existem
import DashboardCharts from '@/components/charts/DashboardCharts';
import { fetchAllSessions } from './dashboardUtils';

// Tipos e Constantes
type UserProfile = {
  name: string;
  avatar: string;
  primary_condition: string;
};

const AVATAR_EMOJIS: { [key: string]: string } = {
  star: '⭐', rocket: '🚀', unicorn: '🦄', dragon: '🐉',
  robot: '🤖', cat: '🐱', dog: '🐶', lion: '🦁',
  fox: '🦊', headphone: '🎧', joystick: '🎮', compass: '🧭', shield: '🛡️'
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
          supabase.from('user_profiles').select('name, avatar, primary_condition').eq('user_id', session.user.id).single(),
          fetchAllSessions()
        ]);

        if (profileResponse.error) {
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
                <p className="text-gray-600">Carregando seu dashboard...</p>
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
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{profile.name}</p>
                    <p className="text-xs text-gray-500">{profile.primary_condition.replace('_', ' + ')}</p>
                  </div>
                   <div className="text-4xl bg-gray-200 p-2 rounded-full">{AVATAR_EMOJIS[profile.avatar] || '👤'}</div>
                </div>
            )}
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          
          {profile && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    Olá, {profile.name.split(' ')[0]}!
                </h2>
                <p className="text-gray-600 mt-1">
                    Acompanhe aqui a sua jornada de desenvolvimento e progresso.
                </p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4"><BarChart2 size={24} /></div>
              <div><p className="text-sm text-gray-500">Atividades Totais</p><p className="text-2xl font-bold text-gray-800">0</p></div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center">
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full mr-4"><Award size={24} /></div>
              <div><p className="text-sm text-gray-500">Conquistas</p><p className="text-2xl font-bold text-gray-800">0</p></div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center">
              <div className="bg-green-100 text-green-600 p-3 rounded-full mr-4"><Users size={24} /></div>
              <div><p className="text-sm text-gray-500">Nível Social</p><p className="text-2xl font-bold text-gray-800">1</p></div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full mr-4"><Star size={24} /></div>
              <div><p className="text-sm text-gray-500">Pontos XP</p><p className="text-2xl font-bold text-gray-800">0</p></div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* NOVA SEÇÃO: ATIVIDADES E CONQUISTAS */}
          {/* ================================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Coluna da Esquerda: Atividades de Hoje */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Atividades de Hoje</h3>
              <div className="space-y-4">
                {/* Item de atividade de exemplo 1 */}
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="text-green-500 mr-4" size={24} />
                  <div className="flex-grow">
                    <p className="font-medium text-gray-700">Respiração 4-7-8</p>
                    <p className="text-xs text-gray-500">Técnica de regulação</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">Completo</span>
                </div>
                {/* Item de atividade de exemplo 2 */}
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-300">
                  <div className="w-6 h-6 rounded-full border-2 border-blue-500 mr-4"></div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-700">Conversa Inicial</p>
                    <p className="text-xs text-gray-500">Habilidade social</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Começar</button>
                </div>
                 {/* Item de atividade de exemplo 3 */}
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-400 mr-4"></div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-400">Mindfulness 5-4-3-2-1</p>
                    <p className="text-xs text-gray-400">Técnica sensorial</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-400">Bloqueado</span>
                </div>
              </div>
            </div>

            {/* Coluna da Direita: Conquistas Recentes */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Conquistas Recentes</h3>
              <div className="space-y-4">
                {/* Conquista de exemplo 1 */}
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🏆</div>
                  <div>
                    <p className="font-bold text-gray-800">Conversador</p>
                    <p className="text-sm text-gray-600">Completou 5 atividades de conversação</p>
                  </div>
                </div>
                {/* Conquista de exemplo 2 */}
                <div className="flex items-center">
                  <div className="text-3xl mr-4">❤️</div>
                  <div>
                    <p className="font-bold text-gray-800">Empático</p>
                    <p className="text-sm text-gray-600">Demonstrou empatia em situações difíceis</p>
                  </div>
                </div>
                {/* Conquista de exemplo 3 */}
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🔥</div>
                  <div>
                    <p className="font-bold text-gray-800">Persistente</p>
                    <p className="text-sm text-gray-600">7 dias consecutivos de atividades</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <DashboardCharts sessions={sessions} />

        </div>
      </main>
    </div>
  );
}
