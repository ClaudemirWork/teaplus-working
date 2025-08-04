'use client';

import { useState, useEffect } from 'react';

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
    {
      title: 'Respiração Energizante',
      description: 'Inspire por 3 segundos, expire por 3 segundos',
      instruction: 'Ritmo mais rápido para aumentar energia e foco.',
      inhaleTime: 3,
      holdTime: 1,
      exhaleTime: 3,
      cycles: 5,
      color: 'from-orange-400 to-red-500',
      explanation: 'Esta respiração estimula o sistema nervoso e aumenta o estado de alerta!'
    },
    {
      title: 'Respiração de Emergência',
      description: 'Para momentos de crise ou pânico',
      instruction: 'Respire lentamente para recuperar o controle emocional.',
      inhaleTime: 6,
      holdTime: 2,
      exhaleTime: 8,
      cycles: 3,
      color: 'from-red-400 to-purple-600',
      explanation: 'Esta técnica interrompe o ciclo de pânico e restaura o equilíbrio emocional!'
    }
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
      const cyclePosition = timer % totalCycleTime;
      
      if (cyclePosition < currentEx.inhaleTime) {
        setBreathPhase('inhale');
      } else if (cyclePosition < currentEx.inhaleTime + currentEx.holdTime) {
        setBreathPhase('hold');
      } else {
        setBreathPhase('exhale');
      }
      
      // Check if cycle completed
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

  const getPhaseTime = () => {
    switch (breathPhase) {
      case 'inhale': return currentEx.inhaleTime;
      case 'hold': return currentEx.holdTime;
      case 'exhale': return currentEx.exhaleTime;
      default: return 0;
    }
  };

  const getCurrentPhaseTimeRemaining = () => {
    if (!isBreathing) return 0;
    const totalCycleTime = currentEx.inhaleTime + currentEx.holdTime + currentEx.exhaleTime;
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()}
                className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                ← Voltar para TEA
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🫁</span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Técnicas de Respiração</h1>
              </div>
            </div>
            
            {gameStarted && (
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Pontos: <span className="font-bold text-blue-600">{points}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Exercício <span className="font-bold">{currentExercise + 1}</span>/{exercises.length}
                </div>
              </div>
            )}
          </div>
          
          {gameStarted && (
            <button
              onClick={() => setGameStarted(false)}
              className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ← Voltar ao Início
            </button>
          )}
        </div>

        {!gameStarted ? (
          <div>
            {/* Description */}
            <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Aprender técnicas de respiração consciente para autorregulação emocional, 
              redução da ansiedade e promoção do bem-estar
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg border-l-4 border-red-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🎯</span>
                  <h3 className="text-lg font-semibold text-red-600">Objetivo:</h3>
                </div>
                <p className="text-gray-700">
                  Aprender técnicas de respiração consciente para autorregulação emocional, 
                  redução da ansiedade e promoção do bem-estar
                </p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-blue-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">👑</span>
                  <h3 className="text-lg font-semibold text-blue-600">Pontuação:</h3>
                </div>
                <p className="text-gray-700">
                  Cada técnica completada = +10 pontos. Você precisa de 50 pontos 
                  para completar a atividade com sucesso
                </p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-purple-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">📊</span>
                  <h3 className="text-lg font-semibold text-purple-600">Níveis:</h3>
                </div>
                <div className="text-gray-700">
                  <p><strong className="text-purple-600">Nível 1:</strong> Respirações básicas (quadrada, abdominal)</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> Técnicas avançadas (4-7-8, energizante)</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> Respiração de emergência e crise</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-green-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🏁</span>
                  <h3 className="text-lg font-semibold text-green-600">Final:</h3>
                </div>
                <p className="text-gray-700">
                  Complete os 3 níveis com 50 pontos para finalizar a atividade 
                  e dominar as técnicas de respiração
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center mb-8">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Começar Atividade
              </button>
            </div>

            {/* Base Científica */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <span className="text-xl mr-2">🧠</span>
                <h3 className="text-lg font-semibold text-gray-800">Base Científica:</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Este exercício é baseado em técnicas de respiração terapêutica validadas cientificamente, 
                incluindo práticas de Mindfulness e terapia cognitivo-comportamental. A respiração controlada 
                ativa o sistema nervoso parassimpático, reduzindo cortisol e promovendo autorregulação emocional.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                {currentEx.title}
              </h2>
              
              {!exerciseStarted ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                    <p className="text-gray-700 text-lg leading-relaxed mb-3">
                      <strong>{currentEx.description}</strong>
                    </p>
                    <p className="text-gray-600">
                      {currentEx.instruction}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleStartExercise}
                    className={`w-full md:w-auto bg-gradient-to-r ${currentEx.color} text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                  >
                    Iniciar Exercício
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-6">
                    <p className="text-gray-700 text-lg leading-relaxed mb-3">
                      <strong>{currentEx.description}</strong>
                    </p>
                    <p className="text-gray-600 mb-4">
                      {currentEx.instruction}
                    </p>
                    <p className="text-sm text-gray-500">
                      Meta: {currentEx.cycles} ciclos completos
                    </p>
                  </div>

                  {/* Breathing Circle */}
                  <div className="bg-gray-50 p-6 md:p-8 rounded-xl">
                    <div className="flex flex-col items-center space-y-6">
                      {/* Visual Circle */}
                      <div className="relative flex items-center justify-center">
                        <div className={`${getCircleSize()} rounded-full bg-gradient-to-r ${currentEx.color} transition-all duration-1000 flex items-center justify-center shadow-lg`}>
                          <span className="text-white font-bold text-base md:text-lg">
                            {isBreathing ? Math.ceil(getCurrentPhaseTimeRemaining()) : ''}
                          </span>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="text-center">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                          {getPhaseText()}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-gray-600">
                            Ciclos: {completedCycles}/{currentEx.cycles}
                          </p>
                          {isBreathing && (
                            <p className="text-sm text-gray-500">
                              {breathPhase === 'inhale' && 'Inspire pelo nariz suavemente'}
                              {breathPhase === 'hold' && 'Segure a respiração com calma'}
                              {breathPhase === 'exhale' && 'Expire pela boca lentamente'}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Controls */}
                      {!isBreathing && !showFeedback && (
                        <button
                          onClick={handleStartBreathing}
                          className={`w-full md:w-auto bg-gradient-to-r ${currentEx.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
                        >
                          Iniciar Respiração
                        </button>
                      )}

                      {isBreathing && (
                        <button
                          onClick={() => setIsBreathing(false)}
                          className="w-full md:w-auto bg-gray-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                        >
                          Pausar
                        </button>
                      )}

                      {/* Progress Indicator */}
                      {isBreathing && (
                        <div className="w-full max-w-xs">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progresso do Ciclo</span>
                            <span>{Math.round((completedCycles / currentEx.cycles) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${currentEx.color} transition-all duration-300`}
                              style={{ width: `${(completedCycles / currentEx.cycles) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Breathing Pattern Info */}
                  {!isBreathing && !showFeedback && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Padrão de Respiração:</h4>
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="font-bold text-blue-600">{currentEx.inhaleTime}s</div>
                          <div className="text-gray-600">Inspirar</div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <div className="font-bold text-yellow-600">{currentEx.holdTime}s</div>
                          <div className="text-gray-600">Segurar</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="font-bold text-green-600">{currentEx.exhaleTime}s</div>
                          <div className="text-gray-600">Expirar</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {showFeedback && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-xl">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl">🎉</span>
                        <h3 className="text-lg font-semibold">
                          Excelente! +10 pontos
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {currentEx.explanation}
                      </p>
                    </div>
                  )}

                  {/* Navigation */}
                  {showFeedback && (
                    <div className="flex justify-center">
                      {currentExercise < exercises.length - 1 ? (
                        <button
                          onClick={handleNext}
                          className={`w-full md:w-auto bg-gradient-to-r ${currentEx.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
                        >
                          Próximo Exercício →
                        </button>
                      ) : (
                        <button
                          onClick={() => window.history.back()}
                          className={`w-full md:w-auto bg-gradient-to-r ${currentEx.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
                        >
                          Finalizar Atividade ✓
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}