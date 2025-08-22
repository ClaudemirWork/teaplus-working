'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw, Award, Target, Clock, Brain, CheckCircle, Shuffle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

// ============================================================================
// 1. STANDARD "GAMEHEADER" COMPONENT
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
// 2. MAIN "COGNITIVE FLEXIBILITY" ACTIVITY COMPONENT
// ============================================================================
const CognitiveFlexibilityPage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'finished'>('playing');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds total
  const [currentStimulus, setCurrentStimulus] = useState<any>(null);
  const [responses, setResponses] = useState({ correct: 0, incorrect: 0 });
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isRuleSwitch, setIsRuleSwitch] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const shapes = ['🔴', '🔵', '🟢', '🟡', '🔺', '⬛', '⭐', '❤️'];
  const colors = ['vermelho', 'azul', 'verde', 'amarelo', 'roxo', 'preto', 'dourado', 'rosa'];
  const rules = ['color', 'shape', 'count'] as const;
  
  // Game logic tied to useEffect
  useEffect(() => {
    if (gameStarted && gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timeLeft, gameState, gameStarted]);

  const generateNextRound = (prevRule = 'color') => {
    setIsRuleSwitch(false);
    setFeedback(null);
    
    let newRule = rules[Math.floor(Math.random() * rules.length)];
    if (newRule === prevRule) { // Force a switch more often
        newRule = rules[(rules.indexOf(newRule) + 1) % rules.length];
    }
    if (newRule !== prevRule) {
        setIsRuleSwitch(true);
    }

    const shapeCount = 3 + Math.floor(Math.random() * 3); // 3 to 5 shapes
    const stimulusShapes = Array.from({ length: shapeCount }, () => ({
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    let target = '';
    const counts = (arr: any[], key: string) => arr.reduce((acc, item) => { acc[item[key]] = (acc[item[key]] || 0) + 1; return acc; }, {});
    
    if (newRule === 'color') {
      const colorCounts = counts(stimulusShapes, 'color');
      target = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b);
    } else if (newRule === 'shape') {
      const shapeCounts = counts(stimulusShapes, 'shape');
      target = Object.keys(shapeCounts).reduce((a, b) => shapeCounts[a] > shapeCounts[b] ? a : b);
    } else { // count
      target = shapeCount.toString();
    }
    
    setCurrentStimulus({ shapes: stimulusShapes, rule: newRule, target });
  };
  
  const startGame = () => {
    setGameState('playing');
    setTimeLeft(90);
    setScore(0);
    setResponses({ correct: 0, incorrect: 0 });
    setGameStarted(true);
    generateNextRound();
  };

  const handleResponse = (answer: string) => {
    if (feedback) return; // Prevent multiple clicks
    
    const correct = answer === currentStimulus.target;
    if (correct) {
      setScore(prev => prev + 10 + (isRuleSwitch ? 5 : 0));
      setResponses(prev => ({ ...prev, correct: prev.correct + 1 }));
      setFeedback('correct');
    } else {
      setResponses(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      setFeedback('incorrect');
    }

    setTimeout(() => generateNextRound(currentStimulus.rule), 700);
  };

  const accuracy = (responses.correct + responses.incorrect) > 0 ? Math.round((responses.correct / (responses.correct + responses.incorrect)) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Flexibilidade Cognitiva" icon={<Shuffle className="w-6 h-6 text-gray-700" />} />
      
      {!gameStarted ? (
         <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3><p className="text-sm text-gray-600">Treinar a capacidade de mudar o foco e adaptar-se a novas regras rapidamente, uma habilidade essencial das funções executivas.</p></div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3><ul className="list-disc list-inside text-sm text-gray-600 space-y-1"><li>Uma regra aparecerá (Cor, Forma ou Quantidade).</li><li>Observe as figuras e aplique a regra atual.</li><li>Responda o mais rápido que puder.</li><li>Atenção! A regra pode mudar a qualquer momento.</li></ul></div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3><p className="text-sm text-gray-600">Você ganha pontos por cada resposta correta. Acertar logo após uma mudança de regra vale pontos extras!</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Pronto para um desafio de agilidade mental?</h2>
                <button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">🚀 Começar Exercício</button>
              </div>
            </div>
          </main>
      ) : (
        <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-white p-3 rounded-xl shadow-md"><p className="text-sm text-gray-500">Tempo</p><p className="font-bold text-lg">{formatTime(timeLeft)}</p></div>
                <div className="bg-white p-3 rounded-xl shadow-md"><p className="text-sm text-gray-500">Pontos</p><p className="font-bold text-lg text-blue-600">{score}</p></div>
                <div className="bg-white p-3 rounded-xl shadow-md"><p className="text-sm text-gray-500">Precisão</p><p className="font-bold text-lg text-green-600">{accuracy}%</p></div>
            </div>
            
            <div className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-300
                ${feedback === 'correct' ? 'ring-4 ring-green-400' : ''}
                ${feedback === 'incorrect' ? 'ring-4 ring-red-400' : ''}`}>
                {gameState === 'finished' ? (
                    <div className="text-center">
                        <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Exercício Concluído!</h2>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-600">Pontuação Final</p><p className="text-2xl font-bold">{score}</p></div>
                            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-600">Precisão</p><p className="text-2xl font-bold">{accuracy}%</p></div>
                            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-600">Acertos</p><p className="text-2xl font-bold text-green-600">{responses.correct}</p></div>
                            <div className="bg-gray-100 p-4 rounded-lg"><p className="text-gray-600">Erros</p><p className="text-2xl font-bold text-red-600">{responses.incorrect}</p></div>
                        </div>
                        <button onClick={startGame} className="mt-8 w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">Jogar Novamente</button>
                    </div>
                ) : currentStimulus ? (
                    <div className="text-center">
                        <div className={`p-3 rounded-lg font-bold text-lg mb-6 transition-colors duration-300 ${isRuleSwitch ? 'bg-yellow-200 text-yellow-800 animate-pulse' : 'bg-blue-100 text-blue-800'}`}>
                            {currentStimulus.rule === 'color' && 'Qual a COR mais frequente?'}
                            {currentStimulus.rule === 'shape' && 'Qual a FORMA mais frequente?'}
                            {currentStimulus.rule === 'count' && 'Quantas formas existem?'}
                        </div>
                        
                        <div className="min-h-[80px] flex items-center justify-center text-5xl gap-4 mb-6">
                           {currentStimulus.shapes.map((s, i) => <span key={i}>{s.shape}</span>)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                           { [...new Set(
                                currentStimulus.rule === 'color' ? currentStimulus.shapes.map(s => s.color) :
                                currentStimulus.rule === 'shape' ? currentStimulus.shapes.map(s => s.shape) :
                                ['3','4','5']
                           )].map(option => (
                               <button key={option} onClick={() => handleResponse(option)} className="p-4 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 text-2xl">
                                   {option}
                               </button>
                           ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </main>
      )}
    </div>
  );
}

// Helper function
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default CognitiveFlexibilityPage;
