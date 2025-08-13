'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ExternalLink } from 'lucide-react';

export default function TeaDashboard() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ MÓDULOS PRINCIPAIS - ARRAYS NA ORDEM ORIGINAL (como TDAH/Combined)
  const mainModules = {
    communication: {
      icon: '🗣️',
      title: 'Comunicação Social',
      description: 'Desenvolva habilidades essenciais de comunicação e interação',
      color: '#4A90E2',
      activities: [
        { name: 'Comunicação Aumentativa e Alternativa (CAA)', path: '/caa', description: 'Expresse necessidades e emoções com símbolos visuais' },
        { name: 'Contato Visual Progressivo', path: '/eye-contact', description: 'Pratique o contato visual de forma gradual' },
        { name: 'Expressões Faciais', path: '/facial-expressions', description: 'Reconheça e interprete emoções' },
        { name: 'Tom de Voz', path: '/tone-of-voice', description: 'Exercícios de entonação' },
        { name: 'Escuta Ativa', path: '/active-listening', description: 'Desenvolva habilidades de escuta' },
        { name: 'Iniciar Conversas', path: '/conversation-starters', description: 'Técnicas para começar diálogos' },
        { name: 'Diálogo em Cenas', path: '/dialogue-scenes', description: 'Role-play digital interativo' }
      ]
    },
    social_interaction: {
      icon: '🤝',
      title: 'Interação Social',
      description: 'Pratique interações sociais significativas e trabalho em equipe',
      color: '#7ED321',
      activities: [
        { name: 'Trabalho em Equipe', path: '/teamwork', description: 'Colaboração e cooperação' },
        { name: 'Revezamento', path: '/turn-taking', description: 'Prática de alternância social' },
        { name: 'Compartilhamento', path: '/sharing', description: 'Habilidades de compartilhar' },
        { name: 'Fazer Amigos', path: '/making-friends', description: 'Estratégias para novas amizades' },
        { name: 'Academia da Amizade', path: '/friendship-academy', description: 'Curso completo de amizade' }
      ]
    },
    social_skills: {
      icon: '👁️',
      title: 'Habilidades Sociais',
      description: 'Interprete pistas sociais, linguagem corporal e contextos',
      color: '#9B59B6',
      activities: [
        { name: 'Linguagem Corporal', path: '/body-language', description: 'Interpretação de gestos e posturas' },
        { name: 'Pistas Sociais', path: '/social-clues', description: 'Reconhecimento de sinais sociais' },
        { name: 'Contexto Social', path: '/social-context', description: 'Compreensão de situações sociais' },
        { name: 'Detector de Pistas', path: '/social-cues-detector', description: 'Jogo de identificação social' },
        { name: 'Expressões Não-Verbais', path: '/non-verbal-expressions', description: 'Comunicação sem palavras' },
        { name: 'Escolha Consciente', path: '/conscious-choice', description: 'Aprenda a discutir sem brigar e negociar soluções construtivas' },
        { name: 'Missões Sociais', path: '/social-missions', description: 'Desenvolva responsabilidade através de compromissos e cuidado ambiental' },
        { name: 'Oficina do Perdão', path: '/forgiveness-workshop', description: 'Pratique como pedir e aceitar desculpas em situações de conflito' }
      ]
    },
    emotional_regulation: {
      icon: '❤️',
      title: 'Regulação Emocional',
      description: 'Gerencie emoções de forma saudável e desenvolva autocontrole',
      color: '#E74C3C',
      activities: [
        { name: 'Termômetro de Emoções', path: '/emotion-thermometer', description: 'Identificação visual do nível das suas emoções' },
        { name: 'Técnicas de Respiração', path: '/breathing-techniques', description: 'Exercícios guiados para controle emocional' },
        { name: 'Estratégias de Calma', path: '/calming-strategies', description: 'Caixa de ferramentas digitais para se acalmar' },
        { name: 'Diário Emocional', path: '/emotion-diary', description: 'Registro e reflexão sobre suas emoções diárias' },
        { name: 'Espelho de Emoções', path: '/emotion-mirror', description: 'Reflexão e autoconhecimento' },
        { name: 'Jogo do Semáforo', path: '/traffic-light-game?origem=tea', description: 'Para, pensa e age - controle de impulsos' },
        { name: 'Diário de Reflexão Guiada', path: '/reflection-diary', description: 'Pensar antes de agir, desenvolvimento do autocontrole' },
        { name: 'Treino de Assertividade', path: '/assertiveness-training', description: 'Defender opiniões, dizer não, expressar necessidades' },
        { name: 'Lidando com Frustrações', path: '/frustration-management', description: 'Lidar com críticas e gerenciar sentimentos de raiva' },
        { name: 'Missões Sociais', path: '/social-missions', description: 'Desafios de interação social' },
        { name: 'Missão do Cuidado', path: '/care-mission', description: 'Atividades de empatia e cuidado' },
        { name: 'Rastreador de Humor', path: '/mood-tracker', description: 'Acompanhamento emocional diário' },
        { name: 'Desafio do Revezamento', path: '/turn-challenge', description: 'Jogo de turnos e paciência' }
      ]
    }
  };

  const ModuleCard = ({ moduleKey, module }: { moduleKey: string, module: any }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
          <div 
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
            style={{ backgroundColor: `${module.color}20` }}
          >
            {module.icon}
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{module.title}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{module.activities.length} atividades disponíveis</p>
          </div>
        </div>
        
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">{module.description}</p>
        
        <button
          onClick={() => setSelectedModule(selectedModule === moduleKey ? null : moduleKey)}
          className="w-full py-3 sm:py-2 px-4 rounded-lg font-medium transition-colors text-white min-h-[48px] touch-manipulation"
          style={{ 
            backgroundColor: module.color
          }}
        >
          {selectedModule === moduleKey ? 'Ocultar Atividades' : 'Ver Atividades'}
        </button>
        
        {selectedModule === moduleKey && (
          <div className="mt-4 space-y-3 sm:space-y-2">
            {module.activities.map((activity: any, index: number) => (
              <Link
                key={index}
                href={activity.path}
                className="block p-4 sm:p-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 active:bg-blue-200 transition-colors group min-h-[60px] sm:min-h-[auto] touch-manipulation"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-grow min-w-0 pr-2">
                    <div className="font-medium text-gray-800 group-hover:text-blue-700 text-sm sm:text-base">{activity.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">{activity.description}</div>
                  </div>
                  <div className="text-blue-500 group-hover:text-blue-600 flex-shrink-0">
                    <ExternalLink size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            {/* CORREÇÃO AQUI */}
            <Link 
              href="/profileselection" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
            >
              <ChevronLeft size={20} />
              <span className="text-sm sm:text-base">Voltar à seleção</span>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="px-3 sm:px-4 py-2 rounded-full bg-blue-500 text-white font-medium flex items-center space-x-2">
                <span>🧩</span>
                <span className="text-sm sm:text-base">TEA</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Claudemir
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Info */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Dashboard TEA
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Transtorno do Espectro Autista - Comunicação Social e Interação
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
                💡 <strong>Dica:</strong> Clique em "Ver Atividades" para explorar os exercícios de cada módulo. 
                Todas as atividades são baseadas em evidências científicas para desenvolvimento de habilidades sociais.
              </p>
            </div>
          </div>

          {/* 🔧 GRID SIMPLIFICADO - Estrutura idêntica ao TDAH */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {Object.entries(mainModules).map(([key, module]) => (
              <ModuleCard key={key} moduleKey={key} module={module} />
            ))}
          </div>

          {/* Bottom Info */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                📊 Progresso e Estatísticas
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Acompanhe seu desenvolvimento nas habilidades sociais e de comunicação
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">32</div>
                  <div className="text-xs sm:text-sm text-blue-800">Atividades Disponíveis</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">4</div>
                  <div className="text-xs sm:text-sm text-green-800">Módulos Especializados</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-xs sm:text-sm text-purple-800">Baseado em Evidências</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
