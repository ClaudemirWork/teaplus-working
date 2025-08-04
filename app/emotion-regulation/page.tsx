'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmotionRegulationPage() {
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const router = useRouter();

  const activities = [
    {
      id: 'emotion-thermometer',
      title: 'Termômetro de Emoções',
      description: 'Identificação visual do nível das suas emoções',
      icon: '🌡️',
      progress: 0,
      href: '/emotion-thermometer'
    },
    {
      id: 'breathing-techniques',
      title: 'Técnicas de Respiração',
      description: 'Exercícios guiados para controle emocional',
      icon: '🫁',
      progress: 0,
      href: '/breathing-techniques'
    },
    {
      id: 'calming-strategies',
      title: 'Estratégias de Calma',
      description: 'Caixa de ferramentas digitais para se acalmar',
      icon: '🧘',
      progress: 0,
      href: '/calming-strategies'
    },
    {
      id: 'emotion-diary',
      title: 'Diário Emocional',
      description: 'Registro e reflexão sobre suas emoções diárias',
      icon: '📓',
      progress: 0,
      href: '/emotion-diary'
    },
    {
      id: 'traffic-light-game',
      title: 'Jogo do Semáforo',
      description: 'Pare, pense e aja - controle de impulsos',
      icon: '🚦',
      progress: 0,
      href: '/traffic-light-game'
    },
    {
      id: 'reflection-diary',
      title: 'Diário de Reflexão Guiada',
      description: 'Pensar antes de agir, desenvolvimento do autocontrole',
      icon: '📔',
      progress: 0,
      href: '/reflection-diary'
    },
    {
      id: 'assertiveness-training',
      title: 'Treino de Assertividade',
      description: 'Defender opiniões, dizer não, expressar necessidades',
      icon: '💪',
      progress: 0,
      href: '/assertiveness-training'
    },
    {
      id: 'frustration-management',
      title: 'Lidando com Frustrações',
      description: 'Lidar com críticas e gerenciar sentimentos de raiva',
      icon: '😤',
      progress: 0,
      href: '/frustration-management'
    }
  ];

  const handleNavigation = (href: string) => {
    console.log('Navegando para:', href);
    try {
      router.push(href);
    } catch (error) {
      console.log('Erro com router, usando window.location');
      window.location.href = href;
    }
  };

  const isCompleted = (activityId: string) => completedActivities.includes(activityId);

  const getButtonText = (activityId: string) => {
    switch(activityId) {
      case 'emotion-thermometer': return 'Identificar Emoção';
      case 'breathing-techniques': return 'Iniciar Respiração';
      case 'calming-strategies': return 'Abrir Caixa de Calma';
      case 'emotion-diary': return 'Escrever no Diário';
      case 'traffic-light-game': return 'Jogar Semáforo';
      case 'reflection-diary': return 'Refletir e Escrever';
      case 'assertiveness-training': return 'Treinar Assertividade';
      case 'frustration-management': return 'Gerenciar Frustrações';
      default: return 'Iniciar Atividade';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">☀️</span>
            <span className="text-xl font-bold text-gray-800">TeaPlus</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">🏠</span>
            <span className="font-medium text-gray-700">Dashboard</span>
          </Link>
          
          <Link href="/communication" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">💬</span>
            <span className="font-medium text-gray-700">Comunicação Social</span>
          </Link>
          
          <Link href="/interaction" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">🤝</span>
            <span className="font-medium text-gray-700">Interação Social</span>
          </Link>
          
          <Link href="/emotion-regulation" className="flex items-center space-x-3 p-3 rounded-lg bg-red-100 text-red-800">
            <span className="text-xl">❤️</span>
            <span className="font-medium">Regulação Emocional</span>
          </Link>
          
          <Link href="/social-signals" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">👁️</span>
            <span className="font-medium text-gray-700">Sinais Sociais</span>
          </Link>
          
          <Link href="/bibliography" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">📚</span>
            <span className="font-medium text-gray-700">Bibliografia</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-4xl">❤️</span>
              <h1 className="text-3xl font-bold text-gray-800">Regulação Emocional</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Desenvolva habilidades para reconhecer, compreender e gerenciar suas emoções
            </p>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Card Header with Icon */}
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{activity.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {activity.description}
                  </p>
                </div>
                
                {/* Progress Section */}
                <div className="px-6 pb-4">
                  <div className="bg-gray-100 rounded-full p-3 mb-4">
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-600">
                        Progresso: {activity.progress}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={() => handleNavigation(activity.href)}
                    className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 rounded-2xl hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
                  >
                    {getButtonText(activity.id)}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Scientific Foundation */}
          <div className="mt-8 bg-white rounded-3xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🧠</span>
              Base Científica
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Este módulo é baseado em evidências científicas de <strong>Terapia Cognitivo-Comportamental (TCC)</strong>, 
              <strong> Inteligência Emocional</strong> e <strong>Mindfulness</strong>. 
              As atividades foram desenvolvidas seguindo protocolos validados para desenvolvimento 
              de autorregulação emocional em pessoas com TEA e TDAH.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}