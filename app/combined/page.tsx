'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CombinedDashboard() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const router = useRouter();

  const combinedModules = {
    essential_skills: {
      icon: '🎯',
      title: 'Habilidades Essenciais',
      description: 'Competencias fundamentais que integram comunicacao e foco',
      color: '#8E44AD',
      activities: [
        { 
          name: 'Jogo do Semaforo Integrado', 
          path: '/traffic-light-game', 
          description: 'Autocontrole com comunicacao social', 
          available: true 
        },
        { 
          name: 'Trabalho em Equipe Focado', 
          path: '/teamwork', 
          description: 'Colaboracao com atencao sustentada', 
          available: true 
        },
        { 
          name: 'Revezamento Consciente', 
          path: '/turn-taking', 
          description: 'Alternancia social e autorregulacao', 
          available: true 
        },
        { 
          name: 'Respiracao e Calma Social', 
          path: '/breathing-techniques', 
          description: 'Tecnicas de calma em contexto social', 
          available: true 
        },
        { 
          name: 'Escolha Consciente', 
          path: '/conscious-choice', 
          description: 'Tomada de decisao social', 
          available: true 
        },
        { 
          name: 'Autorregulacao Global', 
          path: '/emotion-regulation', 
          description: 'Controle emocional e atencional integrado', 
          available: true 
        }
      ]
    },
    focused_communication: {
      icon: '🗣️',
      title: 'Comunicacao Focada',
      description: 'Habilidades de comunicacao com atencao sustentada',
      color: '#3498DB',
      activities: [
        { 
          name: 'Dialogo Focado', 
          path: '/dialogue-scenes', 
          description: 'Conversas com manutencao de atencao', 
          available: true 
        },
        { 
          name: 'Escuta Ativa Sustentada', 
          path: '/active-listening', 
          description: 'Audicao atenta prolongada', 
          available: true 
        },
        { 
          name: 'Expressao Organizada', 
          path: '/non-verbal-expressions', 
          description: 'Comunicacao estruturada e clara', 
          available: true 
        },
        { 
          name: 'Conversa Estruturada', 
          path: '/conversation-starters', 
          description: 'Dialogos com roteiro flexivel', 
          available: true 
        },
        { 
          name: 'Narrativa Sequencial', 
          path: '/sequential-narrative', 
          description: 'Contar historias de forma organizada', 
          available: true 
        }
      ]
    },
    social_attention: {
      icon: '🧠',
      title: 'Atencao Social',
      description: 'Foco direcionado em contextos e interacoes sociais',
      color: '#27AE60',
      activities: [
        { 
          name: 'Atencao Social Sustentada', 
          path: '/attention-sustained', 
          description: 'Foco prolongado em interacoes', 
          available: true 
        },
        { 
          name: 'Foco em Interacoes', 
          path: '/interaction', 
          description: 'Concentracao em dinamicas sociais', 
          available: true 
        },
        { 
          name: 'Processamento Social', 
          path: '/social-cues-detector', 
          description: 'Analise rapida de contextos sociais', 
          available: true 
        },
        { 
          name: 'Multitarefa Social', 
          path: '/multitask-challenge', 
          description: 'Gestao de multiplas pistas sociais', 
          available: true 
        },
        { 
          name: 'Rastreamento Visual Social', 
          path: '/visual-focus', 
          description: 'Seguimento de sinais nao-verbais', 
          available: true 
        }
      ]
    },
    organized_interaction: {
      icon: '📋',
      title: 'Interacao Organizada',
      description: 'Estruturacao de relacionamentos e atividades sociais',
      color: '#E74C3C',
      activities: [
        { 
          name: 'Planejamento Social', 
          path: '/social-context', 
          description: 'Organizacao de encontros e atividades', 
          available: true 
        },
        { 
          name: 'Agenda de Relacionamentos', 
          path: '/making-friends', 
          description: 'Gestao de contatos sociais', 
          available: true 
        },
        { 
          name: 'Rotinas Sociais', 
          path: '/social-routines', 
          description: 'Estruturas para interacoes regulares', 
          available: true 
        },
        { 
          name: 'Gestao de Compromissos', 
          path: '/time-management', 
          description: 'Organizacao de obrigacoes sociais', 
          available: true 
        },
        { 
          name: 'Priorizacao Social', 
          path: '/task-prioritization', 
          description: 'Hierarquizacao de relacionamentos', 
          available: true 
        }
      ]
    },
    integrated_games: {
      icon: '🎮',
      title: 'Jogos Integrados',
      description: 'Atividades que combinam multiplas habilidades simultaneamente',
      color: '#F39C12',
      activities: [
        { 
          name: 'Quebra-cabecas Colaborativos', 
          path: '/cognitive-puzzles', 
          description: 'Resolucao em equipe com foco', 
          available: true 
        },
        { 
          name: 'Jogo da Memoria Social', 
          path: '/memory-game-plus', 
          description: 'Memoria aplicada a contextos sociais', 
          available: true 
        },
        { 
          name: 'Padroes Colaborativos', 
          path: '/pattern-match-collaborative', 
          description: 'Coordenacao e comunicacao visual', 
          available: true 
        },
        { 
          name: 'Sequencias Musicais Sociais', 
          path: '/rhythm-attention', 
          description: 'Ritmo, memoria e interacao', 
          available: true 
        },
        { 
          name: 'Role-Play Estruturado', 
          path: '/structured-roleplay', 
          description: 'Dramatizacao com objetivos especificos', 
          available: true 
        },
        { 
          name: 'Missoes Adaptativas', 
          path: '/adaptive-missions', 
          description: 'Desafios que se ajustam ao usuario', 
          available: true 
        }
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
            <p className="text-xs sm:text-sm text-gray-500">{module.activities.length} atividades integradas</p>
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
              <div
                key={index}
                className="block p-4 sm:p-3 rounded-lg border bg-green-50 border-green-200 cursor-pointer hover:bg-green-100 active:bg-green-200 transition-colors min-h-[60px] sm:min-h-[auto] touch-manipulation"
                onClick={() => router.push(activity.path)}
              >
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
            >
              <ChevronLeft size={20} />
              <span className="text-sm sm:text-base">Voltar a selecao</span>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="px-3 sm:px-4 py-2 rounded-full bg-purple-500 text-white font-medium flex items-center space-x-2">
                <span>🎯</span>
                <span className="text-sm sm:text-base">TEA + TDAH</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Claudemir
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Dashboard Integrado
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              TEA + TDAH - Abordagem combinada para desenvolvimento integral
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
              <p className="text-purple-800 text-xs sm:text-sm leading-relaxed">
                🌟 <strong>Versao Beta Completa:</strong> Todas as atividades especialmente desenvolvidas para pessoas com TEA e TDAH simultaneos. 
                Combinamos comunicacao social, atencao sustentada e regulacao emocional em exercicios integrados.
              </p>
            </div>
          </div>

          <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link href="/tea" className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 active:bg-blue-200 transition-colors border border-blue-200 min-h-[80px] touch-manipulation">
              <div className="flex items-center space-x-3">
                <div className="text-2xl sm:text-3xl flex-shrink-0">🧩</div>
                <div className="flex-grow min-w-0">
                  <div className="font-semibold text-blue-700 text-sm sm:text-base">Acessar Modulos TEA</div>
                  <div className="text-xs sm:text-sm text-blue-600">Comunicacao social e interacao disponiveis</div>
                </div>
              </div>
            </Link>
            
            <Link href="/tdah" className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 active:bg-orange-200 transition-colors border border-orange-200 min-h-[80px] touch-manipulation">
              <div className="flex items-center space-x-3">
                <div className="text-2xl sm:text-3xl flex-shrink-0">⚡</div>
                <div className="flex-grow min-w-0">
                  <div className="font-semibold text-orange-700 text-sm sm:text-base">Acessar Modulos TDAH</div>
                  <div className="text-xs sm:text-sm text-orange-600">Atencao, memoria e organizacao</div>
                </div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {Object.entries(combinedModules).map(([key, module]) => (
              <ModuleCard key={key} moduleKey={key} module={module} />
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                🎯 Integracao Completa
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Todas as atividades integradas TEA+TDAH disponiveis na versao beta
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">30+</div>
                  <div className="text-xs sm:text-sm text-purple-800">Atividades Integradas</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">5</div>
                  <div className="text-xs sm:text-sm text-blue-800">Modulos Combinados</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">100%</div>
                  <div className="text-xs sm:text-sm text-green-800">Funcional Beta</div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs sm:text-sm text-green-800 leading-relaxed">
                  ✅ <strong>Versao Beta Completa:</strong> Todas as atividades TEA+TDAH implementadas e funcionais, incluindo Pattern Matching Colaborativo e Missões Adaptativas com IA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}