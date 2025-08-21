'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Supondo que o GameHeader está em @/components/GameHeader
// e os ícones estão instalados via lucide-react
import { GameHeader } from '@/components/GameHeader'; 
import { BookOpen, Trophy, Gamepad2 } from 'lucide-react';

export default function SequentialNarrativePage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const handleStartActivity = () => {
    if (selectedLevel) {
      router.push(`/sequential-narrative/${selectedLevel}`);
    }
  };

  const levels = [
    { id: 'beginner', name: 'Iniciante', icon: '🌟', details: '3 elementos para sequenciar', description: 'Histórias simples do cotidiano' },
    { id: 'intermediate', name: 'Intermediário', icon: '⭐', details: '5 elementos para sequenciar', description: 'Histórias com conflitos sociais' },
    { id: 'advanced', name: 'Avançado', icon: '🏆', details: '7 elementos para sequenciar', description: 'Narrativas complexas' },
  ];

  return (
    <>
      {/* 1. CABEÇALHO PADRÃO APLICADO */}
      <GameHeader
        title="Narrativa Sequencial"
        icon={<BookOpen className="h-6 w-6" />}
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
                  Aprender a organizar eventos em ordem, expressar pensamentos e compreender diferentes perspectivas nas histórias.
                </p>
              </div>

              {/* Card de Como Jogar */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                  <Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Selecione um nível de dificuldade.</li>
                  <li>Você receberá uma história desordenada.</li>
                  <li>Organize os eventos na ordem correta.</li>
                  <li>Adicione detalhes e emoções para enriquecer.</li>
                </ul>
              </div>

              {/* Card de Avaliação/Progresso */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                <p className="text-sm text-gray-600">
                  Sua narrativa será avaliada pela coerência cronológica, contextual e temática, ajudando a aprimorar suas habilidades de comunicação.
                </p>
              </div>

            </div>
          </div>

          {/* Bloco 2: Seleção de Nível */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-4 rounded-lg font-medium transition-transform transform hover:scale-105 ${
                    selectedLevel === level.id
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{level.icon}</div>
                  <div className="text-sm font-semibold">{level.name}</div>
                  <div className="text-xs opacity-80 mt-1">{level.details}</div>
                  <div className="text-xs opacity-70">{level.description}</div>
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
