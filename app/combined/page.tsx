// Copie e cole este código completo no seu arquivo app/combined/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
// NOVO: Importando o cliente Supabase e tipos necessários
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

// NOVO: Definindo a estrutura do nosso perfil de usuário
type UserProfile = {
  name: string;
  avatar: string;
  primary_condition: string;
  // Adicione outros campos que você queira usar no futuro
};

// NOVO: Mapeamento de IDs de avatar para seus emojis
const AVATAR_EMOJIS: { [key: string]: string } = {
  star: '⭐',
  rocket: '🚀',
  unicorn: '🦄',
  dragon: '🐉',
  robot: '🤖',
  cat: '🐱',
  dog: '🐶',
  lion: '🦁',
  fox: '🦊',
  headphone: '🎧',
  joystick: '🎮',
  compass: '🧭',
  shield: '🛡️'
};


export default function CombinedDashboard() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const router = useRouter();

  // NOVO: Estados para guardar os dados do usuário e o status de carregamento
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // NOVO: Criando o cliente Supabase
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  // NOVO: Efeito que busca os dados do usuário ao carregar a página
  useEffect(() => {
    const fetchUserData = async () => {
      // 1. Pega a sessão do usuário logado
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        
        // 2. Com o ID do usuário, busca o perfil na tabela user_profiles
        const { data: userProfile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil:', error);
        } else {
          setProfile(userProfile);
        }
      } else {
          // Se não houver sessão, redireciona para o login
          router.push('/login');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [supabase, router]);
  
  // O conteúdo dos módulos permanece o mesmo por enquanto
  const combinedModules = { /* ... seu objeto combinedModules completo aqui ... */ };

  // Componente de Card, sem alterações
  const ModuleCard = ({ moduleKey, module }: { moduleKey: string, module: any }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* ... seu código do ModuleCard completo aqui ... */}
    </div>
  );

  // NOVO: Tela de carregamento enquanto buscamos os dados
  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation">
              <ChevronLeft size={20} />
              <span className="text-sm sm:text-base">Página Inicial</span>
            </Link>
            
            {/* ALTERADO: Agora o cabeçalho usa os dados do perfil */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {profile && (
                <>
                  <div className="px-3 sm:px-4 py-2 rounded-full bg-purple-500 text-white font-medium flex items-center space-x-2">
                    <span>{AVATAR_EMOJIS[profile.avatar] || '👤'}</span>
                    <span className="text-sm sm:text-base">{profile.primary_condition.replace('_', ' + ')}</span>
                  </div>
                  <div className="text-sm text-gray-800 font-medium hidden sm:block">
                    Olá, {profile.name}!
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* O restante do seu código da main (conteúdo principal) pode ser colado aqui */}
      {/* Para garantir, vou colocar uma representação do seu conteúdo principal */}
      <main className="p-4 sm:p-6">
        {/* ... todo o seu conteúdo de 'main' vai aqui ... */}
      </main>
    </div>
  );
}

// Para facilitar, cole abaixo o seu código completo para "combinedModules", "ModuleCard" e o conteúdo de "main"

const combinedModules = {
    essential_skills: {
      icon: '🎯',
      title: 'Habilidades Essenciais',
      description: 'Competencias fundamentais que integram comunicacao e foco',
      color: '#8E44AD',
      activities: [ { name: 'Jogo do Semaforo Integrado', path: '/traffic-light-game', description: 'Autocontrole com comunicacao social', available: true }, { name: 'Trabalho em Equipe Focado', path: '/teamwork', description: 'Colaboracao com atencao sustentada', available: true }, { name: 'Revezamento Consciente', path: '/turn-taking', description: 'Alternancia social e autorregulacao', available: true }, { name: 'Respiracao e Calma Social', path: '/breathing-techniques', description: 'Tecnicas de calma em contexto social', available: true }, { name: 'Escolha Consciente', path: '/conscious-choice', description: 'Tomada de decisao social', available: true }, { name: 'Autorregulacao Global', path: '/emotion-regulation', description: 'Controle emocional e atencional integrado', available: true } ]
    },
    focused_communication: {
      icon: '🗣️',
      title: 'Comunicacao Focada',
      description: 'Habilidades de comunicacao com atencao sustentada',
      color: '#3498DB',
      activities: [ { name: 'Dialogo Focado', path: '/dialogue-scenes', description: 'Conversas com manutencao de atencao', available: true }, { name: 'Escuta Ativa Sustentada', path: '/active-listening', description: 'Audicao atenta prolongada', available: true }, { name: 'Expressao Organizada', path: '/non-verbal-expressions', description: 'Comunicacao estruturada e clara', available: true }, { name: 'Conversa Estruturada', path: '/conversation-starters', description: 'Dialogos com roteiro flexivel', available: true }, { name: 'Narrativa Sequencial', path: '/sequential-narrative', description: 'Contar historias de forma organizada', available: true } ]
    },
    social_attention: {
      icon: '🧠',
      title: 'Atencao Social',
      description: 'Foco direcionado em contextos e interacoes sociais',
      color: '#27AE60',
      activities: [ { name: 'Atencao Social Sustentada', path: '/attention-sustained', description: 'Foco prolongado em interacoes', available: true }, { name: 'Foco em Interacoes', path: '/interaction', description: 'Concentracao em dinamicas sociais', available: true }, { name: 'Processamento Social', path: '/social-cues-detector', description: 'Analise rapida de contextos sociais', available: true }, { name: 'Multitarefa Social', path: '/multitask-challenge', description: 'Gestao de multiplas pistas sociais', available: true }, { name: 'Rastreamento Visual Social', path: '/visual-focus', description: 'Seguimento de sinais nao-verbais', available: true } ]
    },
    organized_interaction: {
      icon: '📋',
      title: 'Interacao Organizada',
      description: 'Estruturacao de relacionamentos e atividades sociais',
      color: '#E74C3C',
      activities: [ { name: 'Planejamento Social', path: '/social-context', description: 'Organizacao de encontros e atividades', available: true }, { name: 'Agenda de Relacionamentos', path: '/making-friends', description: 'Gestao de contatos sociais', available: true }, { name: 'Rotinas Sociais', path: '/social-routines', description: 'Estruturas para interacoes regulares', available: true }, { name: 'Gestao de Compromissos', path: '/time-management', description: 'Organizacao de obrigacoes sociais', available: true }, { name: 'Priorizacao Social', path: '/task-prioritization', description: 'Hierarquizacao de relacionamentos', available: true } ]
    },
  };

const ModuleCard = ({ moduleKey, module }: { moduleKey: string, module: any }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0" style={{ backgroundColor: `${module.color}20` }} >
            {module.icon}
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{module.title}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{module.activities.length} atividades integradas</p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">{module.description}</p>
        <button onClick={() => setSelectedModule(selectedModule === moduleKey ? null : moduleKey)} className="w-full py-3 sm:py-2 px-4 rounded-lg font-medium transition-colors text-white min-h-[48px] touch-manipulation" style={{ backgroundColor: module.color }} >
          {selectedModule === moduleKey ? 'Ocultar Atividades' : 'Ver Atividades'}
        </button>
        {selectedModule === moduleKey && (
          <div className="mt-4 space-y-3 sm:space-y-2">
            {module.activities.map((activity: any, index: number) => (
              <div key={index} className="block p-4 sm:p-3 rounded-lg border bg-green-50 border-green-200 cursor-pointer hover:bg-green-100 active:bg-green-200 transition-colors min-h-[60px] sm:min-h-[auto] touch-manipulation" onClick={() => router.push(activity.path)} >
                <div className="flex items-center justify-between">
                  <div className="flex-grow min-w-0 pr-2">
                    <div className="font-medium text-gray-800 text-sm sm:text-base">{activity.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">{activity.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
