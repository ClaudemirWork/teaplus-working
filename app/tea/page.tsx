'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { LucideMenu, LucideUser, LucideTarget } from 'lucide-react';

// =========================================
// TIPOS ESSENCIAIS
// =========================================
type Profile = {
  name: string;
  avatar: string;
  therapeutic_objectives: string[];
};

// =========================================
// RASCUNHO DA PÁGINA INICIAL DO TEA
// =========================================
export default function TeaPage() {
  const router = useRouter();
  // Corrigindo: Usamos createClientComponentClient para Next.js 13+
  const supabase = createClientComponentClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }
        
        // Buscar os dados do perfil do usuário logado.
        const { data: userProfile, error } = await supabase
          .from('user_profiles')
          .select('name, avatar, therapeutic_objectives')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) {
          console.error('Erro ao buscar o perfil:', error);
          router.push('/profileselection'); // Redireciona se o perfil não for encontrado
          return;
        }

        setProfile(userProfile);
        
      } catch (error) {
        console.error('Erro ao buscar o perfil:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [supabase, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 text-center">
        <p className="text-xl font-semibold mb-4">Perfil não encontrado.</p>
        <p className="text-gray-600 mb-6">Você será redirecionado para a seleção de perfil.</p>
        <button
          onClick={() => router.push('/profileselection')}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Ir para Seleção de Perfil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="p-4 bg-white shadow-sm flex justify-between items-center">
        <button className="text-gray-600">
          <LucideMenu size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">TeaPlus</h1>
          <p className="text-xs text-gray-500">Bem-vindo, {profile.name}!</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <LucideUser size={18} />
        </div>
      </header>
      
      <main className="p-4 space-y-8">
        {/* Seção de Objetivos Terapêuticos */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center text-blue-600 mb-4">
            <LucideTarget size={20} className="mr-2" />
            <h2 className="text-xl font-semibold">Seus Objetivos</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.therapeutic_objectives.map((objective, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {objective}
              </span>
            ))}
          </div>
        </section>

        {/* Seção de Atividades (a ser implementada) */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Atividades Recomendadas</h2>
          <p className="text-gray-600">
            Esta seção irá exibir as 92 atividades, filtradas de forma inteligente
            com base nos seus objetivos selecionados.
          </p>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-gray-500 italic">
            // Aqui é onde a lógica de recomendação será implementada.
            // Para cada `objective` no `profile.therapeutic_objectives`,
            // você buscaria as `atividades` correspondentes e as renderizaria.
          </div>
        </section>
      </main>
    </div>
  );
}

