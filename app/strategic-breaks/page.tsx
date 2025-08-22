'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Coffee, Play, Pause, Award, Target, Clock, CheckCircle, Timer, RotateCcw, ChevronLeft } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE PADRÃO "GAMEHEADER"
// ============================================================================
const GameHeader = ({ title, icon }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <Link
          href="/dashboard"
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </Link>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h1>
        <div className="w-24"></div>
      </div>
    </div>
  </header>
);

// ============================================================================
// 2. COMPONENTE PRINCIPAL "PAUSAS ESTRATÉGICAS"
// ============================================================================
export default function StrategicBreaksPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(null);

  const [gameState, setGameState] = useState<'working' | 'break' | 'finished'>('working');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBreakActivity, setCurrentBreakActivity] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const levels = [
    { id: 0, label: 'Foco Rápido', work: 5 * 60, break: 1 * 60, cycles: 4 },
    { id: 1, label: 'Foco Padrão', work: 15 * 60, break: 3 * 60, cycles: 4 },
    { id: 2, label: 'Foco Profundo', work: 25 * 60, break: 5 * 60, cycles: 4 },
  ];
  
  const currentLevel = levels.find(l => l.id === nivelSelecionado) || levels[0];
  const totalDuration = gameState === 'working' ? currentLevel.work : currentLevel.break;

  const activities = [
    'Respire fundo 5 vezes', 'Alongue os braços e as pernas', 'Beba um copo de água',
    'Olhe pela janela para um ponto distante', 'Caminhe pelo cômodo', 'Organize um item na sua mesa'
  ];

  useEffect(() => {
    if (!gameStarted || isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else {
      if (gameState === 'working') {
        setGameState('break');
        setTimeLeft(currentLevel.break);
        setCurrentBreakActivity(activities[Math.floor(Math.random() * activities.length)]);
      } else if (gameState === 'break') {
        setScore(prev => prev + 10); // Pontos por ciclo
        if (currentCycle < currentLevel.cycles) {
          setCurrentCycle(prev => prev + 1);
          setGameState('working');
          setTimeLeft(currentLevel.work);
        } else {
          setGameState('finished');
        }
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameState, isPaused, gameStarted]);

  const handleStartActivity = () => {
    if (nivelSelecionado === null) return;
    const level = levels.find(l => l.id === nivelSelecionado)!;
    setTimeLeft(level.work);
    setCurrentCycle(1);
    setScore(0);
    setIsPaused(false);
    setGameState('working');
    setGameStarted(true);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progressPercentage = (totalDuration - timeLeft) / totalDuration * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Pausas Estratégicas" icon={<Coffee className="w-6 h-6 text-gray-700" />} />
      
      {!gameStarted ? (
        // ============================================================================
        // 3. TELA INICIAL PADRONIZADA
        // ============================================================================
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3><p className="text-sm text-gray-600">Treinar a habilidade de alternar entre foco intenso e descanso ativo, melhorando a resistência mental e a produtividade sustentável.</p></div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3><ul className="list-disc list-inside text-sm text-gray-600 space-y-1"><li>Escolha um ritmo de trabalho (nível).</li><li>Concentre-se totalmente durante os períodos de foco.</li><li>Siga a sugestão de atividade durante as pausas.</li><li>Complete todos os ciclos para maximizar os benefícios.</li></ul></div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3><p className="text-sm text-gray-600">Você ganha pontos por cada ciclo de foco e pausa completado. O maior prêmio é a melhora na sua capacidade de concentração.</p></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Escolha seu ritmo de foco</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {levels.map(level => (
                  <button key={level.id} onClick={() => setNivelSelecionado(level.id)} className={`p-4 rounded-lg font-medium transition-colors text-left ${nivelSelecionado === level.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                    <div className="text-2xl mb-1">⏲️</div>
                    <div className="text-sm font-bold">{level.label}</div>
                    <div className="text-xs opacity-80">{level.work/60}min foco / {level.break/60}min pausa</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <button onClick={handleStartActivity} disabled={nivelSelecionado === null} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed">🚀 Iniciar Sessão de Foco</button>
            </div>
          </div>
        </main>
      ) : (
        // ============================================================================
        // 4. INTERFACE PRINCIPAL DA ATIVIDADE
        // ============================================================================
        <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
                {gameState === 'working' && (
                    <div>
                        <h2 className="text-2xl font-bold text-blue-800">FOCO TOTAL</h2>
                        <p className="text-gray-600 mb-6">Concentre-se em uma única tarefa. Ciclo {currentCycle}/{currentLevel.cycles}.</p>
                    </div>
                )}
                {gameState === 'break' && (
                    <div>
                        <h2 className="text-2xl font-bold text-green-800">PAUSA ATIVA</h2>
                        <p className="text-gray-600 mb-6">Relaxe e recarregue. Atividade sugerida:</p>
                        <p className="font-semibold text-lg text-green-700 bg-green-50 p-3 rounded-lg mb-6">{currentBreakActivity}</p>
                    </div>
                )}
                {gameState === 'finished' ? (
                     <div className="text-center">
                        <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Sessão Concluída!</h2>
                        <p className="text-gray-600 mb-6">Você completou {currentLevel.cycles} ciclos de foco. Parabéns!</p>
                        <div className="text-3xl font-bold mb-8">Pontuação Final: <span className="text-blue-600">{score}</span></div>
                        <button onClick={handleStartActivity} className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">Iniciar Nova Sessão</button>
                    </div>
                ) : (
                    <>
                        {/* Timer Circular */}
                        <div className="relative w-48 h-48 mx-auto mb-6">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                                <circle 
                                    className={gameState === 'working' ? 'text-blue-600' : 'text-green-600'}
                                    strokeWidth="8"
                                    strokeDasharray={2 * Math.PI * 45}
                                    strokeDashoffset={(2 * Math.PI * 45) - (progressPercentage / 100) * (2 * Math.PI * 45)}
                                    strokeLinecap="round"
                                    stroke="currentColor" fill="transparent" r="45" cx="50" cy="50"
                                    style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear'}}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-4xl font-mono font-bold">{formatTime(timeLeft)}</div>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setIsPaused(!isPaused)} className="w-32 px-4 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2">
                               {isPaused ? <Play size={18}/> : <Pause size={18}/>} {isPaused ? 'Continuar' : 'Pausar'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
      )}
    </div>
  );
}
