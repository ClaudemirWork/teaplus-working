'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function InteractionPage() {
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  const activities = [
    {
      id: 'sharing',
      title: 'Compartilhamento',
      description: 'Simulações interativas para aprender a compartilhar',
      icon: '🤝',
      progress: 0,
      href: '/sharing'
    },
    {
      id: 'teamwork',
      title: 'Trabalho em Equipe',
      description: 'Quebra-cabeças cooperativos e atividades em grupo',
      icon: '🧩',
      progress: 0,
      href: '/teamwork'
    },
    {
      id: 'making-friends',
      title: 'Fazendo Amigos',
      description: 'Histórias sociais interativas sobre amizade',
      icon: '👫',
      progress: 0,
      href: '/making-friends'
    },
    {
      id: 'turn-taking',
      title: 'Revezamento',
      description: 'Jogos de turnos para praticar esperar a vez',
      icon: '🔄',
      progress: 0,
      href: '/turn-taking'
    },
    {
      id: 'emotion-mirror',
      title: 'Espelho de Emoções',
      description: 'Reconhecer e interpretar emoções através de expressões faciais',
      icon: '🌟',
      progress: 0,
      href: '/emotion-mirror'
    },
    {
      id: 'turn-challenge',
      title: 'Desafio do Turno',
      description: 'Trabalhar em equipe e aprender a dividir tarefas colaborativamente',
      icon: '🤝',
      progress: 0,
      href: '/turn-challenge'
    },
    {
      id: 'friendship-academy',
      title: 'Academia de Amizades',
      description: 'Fazer e manter amizades, respeitando diferenças individuais',
      icon: '👫',
      progress: 0,
      href: '/friendship-academy'
    },
    {
      id: 'care-mission',
      title: 'Missão Cuidado',
      description: 'Demonstrar cuidado e ajudar quando necessário através de cenários empáticos',
      icon: '🤗',
      progress: 0,
      href: '/care-mission'
    }
  ];

  const isCompleted = (activityId: string) => completedActivities.includes(activityId);

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
          
          <Link href="/interaction" className="flex items-center space-x-3 p-3 rounded-lg bg-green-100 text-green-800">
            <span className="text-xl">🤝</span>
            <span className="font-medium">Interação Social</span>
          </Link>
          
          <Link href="/emotion-regulation" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">❤️</span>
            <span className="font-medium text-gray-700">Regulação Emocional</span>
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
              <span className="text-4xl">🤝</span>
              <h1 className="text-3xl font-bold text-gray-800">Interação Social</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Desenvolva habilidades essenciais para interações sociais positivas e construtivas
            </p>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <Link
                    href={activity.href}
                    className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 rounded-2xl hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Jogar Agora
                  </Link>
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
              Este módulo é baseado em evidências científicas de <strong>Análise do Comportamento Aplicada (ABA)</strong>, 
              <strong> Treino de Habilidades Sociais</strong> e <strong>Teoria da Mente</strong>. 
              As atividades foram desenvolvidas seguindo protocolos validados para desenvolvimento 
              de competências sociais em pessoas com TEA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}