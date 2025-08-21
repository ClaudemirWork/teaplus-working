'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameHeader } from '@/components/GameHeader';
import { Theater, Trophy, Gamepad2 } from 'lucide-react';

export default function StructuredRoleplay() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const levels = [
    {
      id: 'beginner',
      name: 'Básico',
      icon: '🎭',
      description: 'Diálogos dirigidos e papéis simples.',
    },
    {
      id: 'intermediate',
      name: 'Intermediário',
      icon: '👥',
      description: 'Improvisação controlada em pequenos grupos.',
    },
    {
      id: 'advanced',
      name: 'Avançado',
      icon: '🌟',
      description: 'Dramatizações espontâneas e situações complexas.',
    },
  ];

  const handleStartActivity = () => {
    if (selectedLevel) {
      router.push(`/structured-roleplay/${selectedLevel}`);
    }
  };

  return (
    <>
      {/* 1. CABEÇALHO PADRÃO APLICADO */}
      <GameHeader
        title="Role-Play Estruturado"
        icon={<Theater className="h-6 w-6" />}
        showSaveButton={false}
      />

      {/* 2. LAYOUT PADRÃO DA TELA INICIAL APLICADO */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">

          {/* Bloco 1: Cards Informativos */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Card de Objetivo */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:
                </h3>
                <p className="text-sm text-gray-600">
                  Aprender e praticar estratégias para interações sociais através de dramatizações, aumentando a confiança em situações diversas.
                </p>
              </div>

              {/* Card de Como Jogar */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                  <Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Escolha um nível de dificuldade.</li>
                  <li>Leia o cenário social proposto.</li>
                  <li>Interprete o papel e siga os diálogos.</li>
                  <li>Pratique a improvisação controlada.</li>
                </ul>
              </div>

              {/* Card de Avaliação/Progresso */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                <p className="text-sm text-gray-600">
                  O foco é a prática e o desenvolvimento da confiança, observando a aplicação de scripts e a leitura de sinais sociais.
                </p>
              </div>

            </div>
          </div>

          {/* Bloco 2: Seleção de Nível */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-4 rounded-lg font-medium text-center transition-transform transform hover:scale-105 ${
                    selectedLevel === level.id
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-2">{level.icon}</div>
                  <div className="text-base font-semibold">{level.name}</div>
                  <div className="text-xs opacity-80 mt-1">{level.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bloco 3: Botão Iniciar */}
          {selectedLevel && (
            <div className="text-center pt-4">
              <button
                onClick={handleStartActivity}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg"
              >
                🚀 Iniciar Atividade
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
