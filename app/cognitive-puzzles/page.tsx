'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Pause, RotateCcw, CheckCircle, Brain, Timer, Target } from 'lucide-react';

export default function CognitivePuzzles() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [level, setLevel] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const puzzles = [
    {
      question: "Qual número vem a seguir na sequência: 2, 4, 8, 16, ?",
      options: [24, 32, 30, 20],
      correct: 1,
      explanation: "Cada número é multiplicado por 2"
    },
    {
      question: "Se GATO = 42, CARRO = 58, então BICICLETA = ?",
      options: [84, 76, 92, 68],
      correct: 2,
      explanation: "Soma dos valores das letras no alfabeto"
    },
    {
      question: "Quantos triângulos você consegue ver na figura abaixo?",
      options: [6, 8, 10, 12],
      correct: 2,
      explanation: "Incluindo triângulos sobrepostos"
    },
    {
      question: "Se todos os Bloops são Razzies e alguns Razzies são Lazzies, então:",
      options: [
        "Todos os Bloops são Lazzies",
        "Alguns Bloops podem ser Lazzies", 
        "Nenhum Bloop é Lazzie",
        "Não podemos determinar"
      ],
      correct: 1,
      explanation: "Lógica de conjuntos - alguns Bloops podem ser Lazzies"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsPlaying(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeRemaining]);

  const startActivity = () => {
    setIsPlaying(true);
    setTimeRemaining(120);
    setScore(0);
    setCurrentPuzzle(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const pauseActivity = () => {
    setIsPlaying(false);
  };

  const resetActivity = () => {
    setIsPlaying(false);
    setTimeRemaining(120);
    setScore(0);
    setLevel(1);
    setCurrentPuzzle(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (!isPlaying || showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === puzzles[currentPuzzle].correct) {
      setScore(prev => prev + 10 * level);
    }
    
    // Auto-advance after 3 seconds
    setTimeout(() => {
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setIsPlaying(false);
      }
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Voltar ao Dashboard</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 rounded-full bg-purple-500 text-white font-medium flex items-center space-x-2">
                <Brain size={16} />
                <span>Quebra-cabeças Cognitivos</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <Brain className="mr-3 text-purple-600" size={40} />
              Quebra-cabeças Cognitivos
            </h1>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Objetivo */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-red-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  🎯 Objetivo:
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Desenvolver o raciocínio lógico resolvendo quebra-cabeças que desafiam diferentes aspectos da cognição: sequências, padrões, lógica verbal e resolução de problemas.
                </p>
              </div>
            </div>

            {/* Pontuação */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  👥 Pontuação:
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Cada resposta correta = +10 pontos × nível atual. Você precisa de 40 pontos para avançar de nível. Resolva todos os quebra-cabeças para maximizar sua pontuação.
                </p>
              </div>
            </div>

            {/* Níveis */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-purple-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  📊 Níveis:
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <p><strong className="text-purple-600">Nível 1:</strong> Sequências simples (fácil)</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> Lógica verbal (médio)</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> Problemas visuais (difícil)</p>
                </div>
              </div>
            </div>

            {/* Final */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-green-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  🏁 Final:
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Complete todos os 4 quebra-cabeças dentro do tempo limite de 2 minutos para finalizar o exercício com sucesso e obter feedback detalhado.
                </p>
              </div>
            </div>
          </div>

          {/* Game Area */}
          {isPlaying ? (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {/* Game Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 px-4 py-2 rounded-lg">
                    <span className="text-purple-800 font-medium">Puzzle {currentPuzzle + 1}/4</span>
                  </div>
                  <div className="bg-blue-100 px-4 py-2 rounded-lg">
                    <span className="text-blue-800 font-medium">Pontos: {score}</span>
                  </div>
                </div>
                <div className="bg-red-100 px-4 py-2 rounded-lg flex items-center">
                  <Timer className="mr-2 text-red-600" size={16} />
                  <span className="text-red-800 font-medium">{formatTime(timeRemaining)}</span>
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {puzzles[currentPuzzle].question}
                </h3>

                {/* Visual representation for puzzle 3 */}
                {currentPuzzle === 2 && (
                  <div className="flex justify-center mb-6">
                    <svg width="200" height="150" viewBox="0 0 200 150">
                      <polygon points="100,20 60,100 140,100" fill="none" stroke="purple" strokeWidth="2"/>
                      <polygon points="80,100 120,100 100,60" fill="none" stroke="purple" strokeWidth="2"/>
                      <polygon points="70,100 90,100 80,80" fill="none" stroke="purple" strokeWidth="2"/>
                      <polygon points="110,100 130,100 120,80" fill="none" stroke="purple" strokeWidth="2"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {puzzles[currentPuzzle].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      showResult
                        ? index === puzzles[currentPuzzle].correct
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : index === selectedAnswer && index !== puzzles[currentPuzzle].correct
                          ? 'bg-red-100 border-red-500 text-red-800'
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                        : 'bg-white border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showResult && index === puzzles[currentPuzzle].correct && (
                        <CheckCircle className="text-green-600" size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {showResult && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">💡 Explicação:</h4>
                  <p className="text-blue-700">{puzzles[currentPuzzle].explanation}</p>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={pauseActivity}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Pause size={20} />
                  <span>Pausar</span>
                </button>
                <button
                  onClick={resetActivity}
                  className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <RotateCcw size={20} />
                  <span>Reiniciar</span>
                </button>
              </div>
            </div>
          ) : (
            /* Start Screen */
            <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-6">
              <div className="text-6xl mb-4">🧩</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                {timeRemaining === 120 ? 'Pronto para o desafio?' : 'Desafio Concluído!'}
              </h3>
              {timeRemaining === 120 ? (
                <p className="text-gray-600 mb-6">
                  Clique em "Iniciar Desafio" para começar os quebra-cabeças cognitivos
                </p>
              ) : (
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Pontuação final: <span className="font-bold text-purple-600">{score} pontos</span></p>
                  <p className="text-gray-500">Parabéns por completar o desafio!</p>
                </div>
              )}
              <button
                onClick={startActivity}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium transition-colors mx-auto"
              >
                <Play size={20} />
                <span>Iniciar Desafio</span>
              </button>
            </div>
          )}

          {/* Base Científica */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              🧬 Base Científica:
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Este exercício é baseado em terapias cognitivo-comportamentais e neuropsicologia para desenvolvimento de funções executivas em pessoas com TDAH. 
              Os quebra-cabeças estimulam diferentes áreas cerebrais: córtex pré-frontal (raciocínio lógico), área de Broca (processamento verbal) e córtex visual (reconhecimento de padrões).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}