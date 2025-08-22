'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameHeader from '@/components/GameHeader';

export default function FingerTapping() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [taps, setTaps] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showResults, setShowResults] = useState(false);

  const levels = [
    { id: 1, name: 'Nível 1', duration: '10s', description: 'Iniciante (10s)' },
    { id: 2, name: 'Nível 2', duration: '15s', description: 'Básico (15s)' },
    { id: 3, name: 'Nível 3', duration: '20s', description: 'Intermediário (20s)' },
    { id: 4, name: 'Nível 4', duration: '25s', description: 'Avançado (25s)' },
    { id: 5, name: 'Nível 5', duration: '30s', description: 'Expert (30s)' }
  ];

  const startActivity = () => {
    const durations = { 1: 10, 2: 15, 3: 20, 4: 25, 5: 30 };
    setTimeLeft(durations[selectedLevel as keyof typeof durations]);
    setIsPlaying(true);
    setTaps([]);
    setStartTime(Date.now());
    setShowResults(false);
  };

  const handleTap = () => {
    if (!isPlaying || showResults) return;
    const currentTime = Date.now();
    setTaps([...taps, currentTime - startTime]);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setShowResults(true);
    }
  }, [isPlaying, timeLeft]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <GameHeader 
        title="Toque Rítmico" 
        onBack={() => router.push('/dashboard')}
      />

      {!isPlaying && !showResults && (
        <div className="max-w-4xl mx-auto p-4">
          {/* Cards Informativos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-red-800 mb-2">🎯 Objetivo:</h3>
              <p className="text-sm text-gray-700">
                Desenvolver coordenação motora fina tocando rapidamente na tela com ritmo consistente.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-800 mb-2">🎮 Como Jogar:</h3>
              <ul className="text-sm text-gray-700 list-disc list-inside">
                <li>Toque rapidamente na área azul</li>
                <li>Mantenha ritmo constante</li>
                <li>Continue até o tempo acabar</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-800 mb-2">⭐ Avaliação:</h3>
              <p className="text-sm text-gray-700">
                Medimos quantidade de toques, ritmo e consistência do movimento.
              </p>
            </div>
          </div>

          {/* Seleção de Nível */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Selecione o Nível</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedLevel === level.id
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="font-bold">{level.name}</div>
                  <div className="text-xs mt-1">{level.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Botão Iniciar */}
          <div className="flex justify-center">
            <button
              onClick={startActivity}
              className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              🚀 Iniciar Atividade
            </button>
          </div>
        </div>
      )}

      {/* Área de Jogo */}
      {(isPlaying || showResults) && (
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {showResults ? 'Resultados' : `Tempo: ${timeLeft}s`}
              </h2>
            </div>

            {!showResults && (
              <button
                onClick={handleTap}
                className="w-full h-64 bg-blue-500 rounded-lg text-white text-4xl font-bold hover:bg-blue-600 active:bg-blue-700 transition-colors"
              >
                TOQUE AQUI!
              </button>
            )}

            {showResults && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-lg font-bold text-green-800">
                    Total de Toques: {taps.length}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Média: {((taps.length / (levels[selectedLevel - 1].duration.replace('s', ''))) * 1).toFixed(1)} toques/segundo
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setIsPlaying(false);
                  }}
                  className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-600"
                >
                  Jogar Novamente
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
