'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ExternalLink } from 'lucide-react';

export default function TdahDashboard() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const tdahModules = {
    attention_focus: {
      icon: '🧠',
      title: 'Atenção & Foco',
      description: 'Fortaleça sua capacidade de concentração e atenção sustentada',
      color: '#F5A623',
      activities: [
        { name: 'Atenção Sustentada', path: '/attention-sustained', description: 'Exercícios de concentração prolongada' },
        { name: 'Atenção Seletiva', path: '/attention-selective', description: 'Foco em estímulos específicos' },
        { name: 'Stop-Go', path: '/stop-go', description: 'Controle inibitório e flexibilidade' },
        { name: 'Foco Visual', path: '/visual-focus', description: 'Concentração em elementos visuais' },
        { name: 'Concentração Auditiva', path: '/auditory-focus', description: 'Atenção a estímulos sonoros' },
        { name: 'Atenção Dividida', path: '/divided-attention', description: 'Multitarefa controlada' }
      ]
    },
    working_memory: {
      icon: '🧮',
      title: 'Memória de Trabalho',
      description: 'Desenvolva a capacidade de processar e reter informações',
      color: '#E67E22',
      activities: [
        { name: 'Sequências Numéricas', path: '/numeric-sequences', description: 'Memorização de sequências de números' },
        { name: 'Padrões Visuais', path: '/visual-patterns', description: 'Reconhecimento e reprodução de padrões' },
        { name: 'Memória Auditiva', path: '/auditory-memory', description: 'Retenção de informações sonoras' },
        { name: 'Span de Dígitos', path: '/digit-span', description: 'Exercícios clássicos de memória' },
        { name: 'Sequências Complexas', path: '/complex-sequences', description: 'Padrões multi-modais avançados' },
        { name: 'Dual N-Back', path: '/dual-n-back', description: 'Treinamento intensivo de memória' }
      ]
    },
    organization_planning: {
      icon: '⏰',
      title: 'Organização & Planejamento',
      description: 'Organize tarefas, gerencie tempo e desenvolva rotinas eficazes',
      color: '#D35400',
      activities: [
        { name: 'Gestão de Tempo', path: '/time-management', description: 'Técnicas de controle temporal' },
        { name: 'Priorização de Tarefas', path: '/task-prioritization', description: 'Organização por importância' },
        { name: 'Lista de Verificação', path: '/checklist-maker', description: 'Criação de checklists eficazes' },
        { name: 'Cronograma Pessoal', path: '/time-planning', description: 'Agenda personalizada' },
        { name: 'Metas SMART', path: '/smart-goals', description: 'Definição de objetivos específicos' }
      ]
    },
    self_control: {
      icon: '🎯',
      title: 'Autocontrole & Regulação',
      description: 'Desenvolva controle inibitório e flexibilidade cognitiva',
      color: '#C0392B',
      activities: [
        { name: 'Controle Inibitório', path: '/inhibitory-control', description: 'Exercícios de autocontrole' },
        { name: 'Flexibilidade Cognitiva', path: '/cognitive-flexibility', description: 'Adaptação mental a mudanças' },
        { name: 'Autorregulação', path: '/self-regulation-exercise', description: 'Gestão do comportamento' },
        { name: 'Pausas Estratégicas', path: '/strategic-breaks', description: 'Técnicas de pausa consciente' },
        { name: 'Controle de Impulsos', path: '/impulse-control', description: 'Manejo de impulsividade' },
        { name: 'Tomada de Decisão', path: '/decision-making', description: 'Processos de escolha consciente' }
      ]
    },
    games_training: {
      icon: '🎮',
      title: 'Jogos & Treinamento',
      description: 'Atividades lúdicas para desenvolvimento das funções executivas',
      color: '#8E44AD',
      activities: [
        { name: 'Quebra-cabeças Cognitivos', path: '/cognitive-puzzles', description: 'Desafios de raciocínio' },
        { name: 'Jogo da Memória Plus', path: '/memory-game-plus', description: 'Memória com níveis avançados' },
        { name: 'Labirinto Mental', path: '/mental-maze', description: 'Navegação e planejamento espacial' },
        { name: 'Ritmo e Atenção', path: '/rhythm-attention', description: 'Sincronização e foco' },
        { name: 'Desafio Multitarefa', path: '/multitask-challenge', description: 'Gestão de múltiplas atividades' }
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
                className="block p-4 sm:p-3 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-100 active:bg-orange-200 transition-colors group min-h-[60px] sm:min-h-[auto] touch-manipulation"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-grow min-w-0 pr-2">
                    <div className="font-medium text-gray-800 group-hover:text-orange-700 text-sm sm:text-base">{activity.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">{activity.description}</div>
                  </div>
                  <div className="text-orange-500 group-hover:text-orange-600 flex-shrink-0">
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
              <div className="px-3 sm:px-4 py-2 rounded-full bg-orange-500 text-white font-medium flex items-center space-x-2">
                <span>⚡</span>
                <span className="text-sm sm:text-base">TDAH</span>
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
              Dashboard TDAH
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Transtorno do Déficit de Atenção - Foco, Memória e Organização
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <p className="text-green-800 text-xs sm:text-sm leading-relaxed">
                ✅ <strong>Atividades Disponíveis:</strong> Todas as atividades estão funcionais e prontas para uso. 
                Baseadas nas mais recentes pesquisas em neurociência cognitiva.
              </p>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {Object.entries(tdahModules).map(([key, module]) => (
              <ModuleCard key={key} moduleKey={key} module={module} />
            ))}
          </div>

          {/* Bottom Info */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                🧠 Funções Executivas em Foco
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Treinamento cognitivo baseado em evidências para melhorar atenção, memória e autocontrole
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-orange-50 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">29</div>
                  <div className="text-xs sm:text-sm text-orange-800">Exercícios Disponíveis</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">5</div>
                  <div className="text-xs sm:text-sm text-red-800">Áreas Especializadas</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-xs sm:text-sm text-purple-800">Neurociência Aplicada</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
