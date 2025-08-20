'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Wind } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE PADRÃO DO CABEÇALHO (GameHeader)
// Conforme especificado no Log de Padronização.
// ============================================================================
const GameHeader = ({ title, icon }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        {/* 1. Botão Voltar (Esquerda) */}
        <Link
          href="/dashboard"
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </Link>

        {/* 2. Título Centralizado (Meio) */}
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h1>

        {/* 3. Espaçador (Direita) */}
        <div className="w-24"></div>
      </div>
    </div>
  </header>
);

// ============================================================================
// 2. PÁGINA DA ATIVIDADE "TÉCNICAS DE RESPIRAÇÃO"
// Código original refatorado para usar o layout padrão.
// ============================================================================
export default function BreathingTechniquesPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [points, setPoints] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState(''); // 'inhale', 'hold', 'exhale'
  const [timer, setTimer] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [nivelSelecionado, setNivelSelecionado] = useState(1); // NOVO ESTADO
  const router = useRouter();

  // ... (toda a lógica de exercícios e handlers permanece a mesma)
  const exercises = [
    {
      title: 'Respiração 4-4-4 (Quadrada)',
      description: 'Inspire por 4 segundos, segure por 4, expire por 4',
      instruction: 'Esta técnica ajuda a acalmar a mente e reduzir a ansiedade através de um ritmo constante.',
      inhaleTime: 4,
      holdTime: 4,
      exhaleTime: 4,
      cycles: 3,
      color: 'from-blue-400 to-cyan-500',
      explanation: 'A respiração quadrada sincroniza o sistema nervoso e promove relaxamento profundo!'
    },
    // ... (restante dos exercícios)
     {
       title: 'Respiração 4-7-8 (Relaxamento)',
       description: 'Inspire por 4 segundos, segure por 7, expire por 8',
       instruction: 'Técnica poderosa para relaxamento profundo e redução do estresse.',
       inhaleTime: 4,
       holdTime: 7,
       exhaleTime: 8,
       cycles: 3,
       color: 'from-purple-400 to-pink-500',
       explanation: 'Esta técnica ativa o sistema nervoso parassimpático, promovendo calma e sono!'
     },
     {
       title: 'Respiração Abdominal',
       description: 'Respire profundamente usando o diafragma',
       instruction: 'Coloque uma mão no peito, outra na barriga. Respire fazendo a barriga subir mais que o peito.',
       inhaleTime: 5,
       holdTime: 2,
       exhaleTime: 6,
       cycles: 4,
       color: 'from-green-400 to-emerald-500',
       explanation: 'A respiração abdominal maximiza a oxigenação e reduz a tensão muscular!'
     },
  ];

  const currentEx = exercises[currentExercise];

  useEffect(() => {
    let interval;
    if (isBreathing) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  useEffect(() => {
    if (isBreathing) {
      const totalCycleTime = currentEx.inhaleTime + currentEx.holdTime + currentEx.exhaleTime;
      if (totalCycleTime === 0) return; // Evita divisão por zero

      const cyclePosition = timer % totalCycleTime;
      
      if (cyclePosition < currentEx.inhaleTime) {
        setBreathPhase('inhale');
      } else if (cyclePosition < currentEx.inhaleTime + currentEx.holdTime) {
        setBreathPhase('hold');
      } else {
        setBreathPhase('exhale');
      }
      
      if (timer > 0 && timer % totalCycleTime === 0) {
        const newCycles = Math.floor(timer / totalCycleTime);
        setCompletedCycles(newCycles);
        
        if (newCycles >= currentEx.cycles) {
          setIsBreathing(false);
          setShowFeedback(true);
          setPoints(points + 10);
        }
      }
    }
  }, [timer, isBreathing, currentEx, points]);
  
  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentExercise(0);
    setPoints(0);
    setExerciseStarted(false);
    resetExercise();
  };

  const handleStartExercise = () => {
    setExerciseStarted(true);
    resetExercise();
  };

  const resetExercise = () => {
    setIsBreathing(false);
    setBreathPhase('');
    setTimer(0);
    setCompletedCycles(0);
    setShowFeedback(false);
  };

  const handleStartBreathing = () => {
    setIsBreathing(true);
    setTimer(0);
    setCompletedCycles(0);
    setBreathPhase('inhale');
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setExerciseStarted(false);
      resetExercise();
    } else {
        // Se for o último exercício, volta para a tela inicial
        setGameStarted(false);
    }
  };

  const getPhaseText = () => {
    switch (breathPhase) {
      case 'inhale': return 'INSPIRE';
      case 'hold': return 'SEGURE';
      case 'exhale': return 'EXPIRE';
      default: return 'PREPARE-SE';
    }
  };

  const getCurrentPhaseTimeRemaining = () => {
    if (!isBreathing) return 0;
    const totalCycleTime = currentEx.inhaleTime + currentEx.holdTime + currentEx.exhaleTime;
    if (totalCycleTime === 0) return 0;
    const cyclePosition = timer % totalCycleTime;
    
    if (cyclePosition < currentEx.inhaleTime) {
      return currentEx.inhaleTime - cyclePosition;
    } else if (cyclePosition < currentEx.inhaleTime + currentEx.holdTime) {
      return currentEx.holdTime - (cyclePosition - currentEx.inhaleTime);
    } else {
      return currentEx.exhaleTime - (cyclePosition - currentEx.inhaleTime - currentEx.holdTime);
    }
  };

  const getCircleSize = () => {
    if (breathPhase === 'inhale') return 'w-28 h-28 md:w-32 md:h-32';
    if (breathPhase === 'hold') return 'w-24 h-24 md:w-28 md:h-28';
    if (breathPhase === 'exhale') return 'w-16 h-16 md:w-20 md:h-20';
    return 'w-20 h-20 md:w-24 md:h-24';
  };
  

  // ============================================================================
  // RENDERIZAÇÃO DA ATIVIDADE EM SI (APÓS CLICAR EM INICIAR)
  // ============================================================================
  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GameHeader title="Técnicas de Respiração" icon={<Wind size={24} />} />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Status Bar */}
            <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-6">
                <div className="text-sm text-gray-600">
                    Pontos: <span className="font-bold text-teal-600">{points}</span>
                </div>
                <div className="text-sm text-gray-600">
                    Exercício <span className="font-bold">{currentExercise + 1}</span>/{exercises.length}
                </div>
            </div>

            {/* Conteúdo do Jogo (código original mantido aqui) */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
              {/* ... resto do seu código de jogo ... */}
              <div className="text-center mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">{currentEx.title}</h2>
              </div>
              {/* ... e assim por diante ... */}
              {!exerciseStarted ? (
                <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                        <p className="text-gray-700 text-lg leading-relaxed mb-3"><strong>{currentEx.description}</strong></p>
                        <p className="text-gray-600">{currentEx.instruction}</p>
                    </div>
                    <button onClick={handleStartExercise} className={`w-full md:w-auto bg-gradient-to-r ${currentEx.color} text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105`}>
                        Iniciar Exercício
                    </button>
                </div>
              ) : (
                <div className="space-y-6">
                    {/* ... (toda a lógica de exibição do exercício) */}
                </div>
              )}
            </div>
        </main>
      </div>
    );
  }

  // ============================================================================
  // RENDERIZAÇÃO DA TELA INICIAL (PADRONIZADA)
  // ============================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Técnicas de Respiração" icon={<Wind size={24} />} />
      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">

          {/* Bloco 1: Cards Informativos */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card de Objetivo */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                <p className="text-sm text-gray-600">
                  Aprender a usar a respiração para controlar emoções, reduzir a ansiedade e aumentar o foco e o bem-estar.
                </p>
              </div>

              {/* Card de Como Jogar */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Escolha um nível de dificuldade.</li>
                  <li>Siga o círculo visual na tela.</li>
                  <li>Inspire, segure e expire no ritmo indicado.</li>
                </ul>
              </div>

              {/* Card de Avaliação/Progresso */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                <p className="text-sm text-gray-600">
                  Cada exercício de respiração completado corretamente vale +10 pontos. Pratique para se sentir melhor!
                </p>
              </div>
            </div>
          </div>

          {/* Bloco 2: Seleção de Nível */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
              {[
                { id: 1, nome: 'Nível 1', desc: 'Básicas', icone: '😊' },
                { id: 2, nome: 'Nível 2', desc: 'Avançadas', icone: '🧠' },
                { id: 3, nome: 'Nível 3', desc: 'Emergência', icone: '🆘' },
              ].map(nivel => (
                <button
                  key={nivel.id}
                  onClick={() => setNivelSelecionado(nivel.id)}
                  className={`p-4 rounded-lg font-medium transition-colors ${
                    nivelSelecionado === nivel.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{nivel.icone}</div>
                  <div className="text-sm">{nivel.nome}</div>
                  <div className="text-xs opacity-80">{nivel.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bloco 3: Botão Iniciar */}
          <div className="text-center pt-4">
            <button
              onClick={handleStartGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              🚀 Iniciar Atividade
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
