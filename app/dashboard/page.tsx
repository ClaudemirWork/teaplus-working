// Cole este código completo dentro de app/dashboard/page.tsx

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// Importando os componentes e funções que já existem
import DashboardCharts from '@/components/charts/DashboardCharts';
import { fetchAllSessions } from './dashboardUtils';

// Tipos e Constantes que vamos usar na página
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
  
  // Estados para guardar todos os dados que a página precisa
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inicializa o cliente do Supabase
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  // Efeito que busca todos os dados quando a página carrega
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Busca o perfil do usuário E as sessões de atividades ao mesmo tempo
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
        // Se não estiver logado, volta para a tela de login
        router.push('/login');
      }
      setLoading(false);
    };

    fetchAllData();
  }, [supabase, router]);
  
  // Mostra uma mensagem de "carregando" enquanto busca os dados
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
      {/* Header Personalizado */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">
                TeaPlus
            </h1>
            
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
          
          {/* Bloco de Boas-Vindas */}
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

          {/* O motor de gráficos, agora integrado e alimentado com os dados */}
          <DashboardCharts sessions={sessions} />

        </div>
      </main>
    </div>
  );
}
