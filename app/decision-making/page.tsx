'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Award, Target, Clock, Brain, CheckCircle, TrendingUp, Users, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

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
// 2. COMPONENTE PRINCIPAL "TOMADA DE DECISÃO"
// ============================================================================
const DecisionMakingPage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [responses, setResponses] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scenarios = [
    { id: 1, category: "Organização", situation: "Você tem 3 tarefas importantes para hoje, mas só há tempo para fazer 2 bem-feitas. O que você faz?", options: [
        {text: "Foco nas 2 mais importantes e deixo a terceira para amanhã.", points: 10, explanation: "Excelente! Priorizar a qualidade e evitar a sobrecarga é uma estratégia chave."},
        {text: "Tento fazer as 3, mesmo que não fiquem perfeitas.", points: 3, explanation: "Cuidado. Isso pode levar a resultados medíocres em todas as tarefas e aumentar o estresse."},
        {text: "Escolho as 2 mais fáceis para terminar rápido.", points: 5, explanation: "É uma opção, mas nem sempre as tarefas mais fáceis são as mais importantes. A priorização é essencial."},
    ], timeLimit: 20 },
    { id: 2, category: "Social", situation: "Em uma reunião de grupo, você discorda fortemente de uma ideia popular. Como você age?", options: [
        {text: "Exponho minha opinião de forma calma e respeitosa, com argumentos.", points: 10, explanation: "Perfeito! A comunicação assertiva e respeitosa é a melhor abordagem."},
        {text: "Fico quieto para não gerar conflito com o grupo.", points: 4, explanation: "Evitar o conflito pode parecer seguro, mas pode levar a decisões ruins que afetam a todos."},
        {text: "Interrompo e falo impulsivamente por que a ideia é ruim.", points: 2, explanation: "A impulsividade pode fazer com que sua opinião seja descartada, mesmo que seja válida."},
    ], timeLimit: 25 },
    { id: 3, category: "Aprendizado", situation: "Você está estudando um tópico novo e percebe que não está absorvendo nada. O que faz?", options: [
        {text: "Paro, faço uma pequena pausa e tento uma abordagem diferente (vídeo, resumo).", points: 10, explanation: "Ótimo! Reconhecer que um método não funciona e adaptar-se é uma habilidade de aprendizado poderosa."},
        {text: "Continuo forçando a leitura do mesmo material até entender.", points: 2, explanation: "Insistir em um método que não está funcionando pode levar à exaustão mental e frustração."},
        {text: "Desisto por hoje e vou fazer algo mais divertido.", points: 1, explanation: "Evitar o desafio impede o crescimento. Uma pausa é diferente de uma desistência completa."},
    ], timeLimit: 18 },
  ];

  const currentScenario = scenarios[currentScenarioIndex];

  useEffect(() => {
    if (gameStarted && gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleChoice(-1); // Timeout
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timeLeft, gameState, gameStarted]);

  const startGame = () => {
    setCurrentScenarioIndex(0);
    setScore(0);
    setResponses([]);
    setSelectedOption(null);
    setTimeLeft(scenarios[0].timeLimit);
    setGameState('playing');
    setGameStarted(true);
  };

  const handleChoice = (optionIndex: number) => {
    if (gameState !== 'playing') return;
    if (timerRef.current) clearTimeout(timerRef.current);
    
    const isTimeout = optionIndex === -1;
    const points = isTimeout ? 0 : currentScenario.options[optionIndex].points;
    
    setScore(prev => prev + points);
    setSelectedOption(optionIndex);
    setResponses(prev => [...prev, { scenarioId: currentScenario.id, choice: optionIndex, points }]);
    setGameState('feedback');

    setTimeout(() => {
      if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(prev => prev + 1);
        setTimeLeft(scenarios[currentScenarioIndex + 1].timeLimit);
        setSelectedOption(null);
        setGameState('playing');
      } else {
        setGameState('finished');
      }
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Tomada de Decisão" icon={<Brain className="w-6 h-6 text-gray-700" />} />

      {!gameStarted ? (
         <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3><p className="text-sm text-gray-600">Treinar o processo de tomada de decisão em cenários do dia a dia, ajudando a reduzir a impulsividade e a paralisia decisória.</p></div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3><ul className="list-disc list-inside text-sm text-gray-600 space-y-1"><li>Analise cada situação apresentada.</li><li>Escolha a melhor opção dentro do tempo limite.</li><li>Receba feedback instantâneo sobre sua escolha.</li><li>Reflita sobre as melhores estratégias ao final.</li></ul></div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3><p className="text-sm text-gray-600">Você pontua com base na eficácia da sua decisão. Escolhas que demonstram planejamento e autocontrole valem mais pontos.</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Pronto para treinar suas habilidades de decisão?</h2>
                <p className="text-gray-600 mb-6">Enfrente cenários desafiadores e aprenda a fazer escolhas mais conscientes.</p>
                <button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">🚀 Começar Desafio</button>
              </div>
            </div>
          </main>
      ) : (
        <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
           <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-white p-3 rounded-xl shadow-md"><p className="text-sm text-gray-500">Cenário</p><p className="font-bold text-lg">{currentScenarioIndex + 1}/{scenarios.length}</p></div>
                <div className="bg-white p-3 rounded-xl shadow-md"><p className="text-sm text-gray-500">Pontos</p><p className="font-bold text-lg text-blue-600">{score}</p></div>
                <div className="bg-white p-3 rounded-xl shadow-md"><p className="text-sm text-gray-500">Tempo</p><p className={`font-bold text-lg ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : ''}`}>{timeLeft}s</p></div>
           </div>

           <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            {gameState === 'finished' ? (
                <div className="text-center">
                    <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Desafio Concluído!</h2>
                    <p className="text-gray-600 mb-6">Veja o resumo do seu desempenho.</p>
                    <div className="text-3xl font-bold mb-8">Pontuação Final: <span className="text-blue-600">{score}</span></div>
                    <button onClick={startGame} className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">Jogar Novamente</button>
                </div>
            ) : (
                <div>
                    <div className="bg-indigo-50 text-indigo-800 font-semibold p-3 rounded-lg text-center mb-4">{currentScenario.category}</div>
                    <p className="text-lg text-center font-medium mb-6">{currentScenario.situation}</p>
                    
                    <div className="space-y-3">
                        {currentScenario.options.map((option, index) => {
                            const isSelected = selectedOption === index;
                            const isCorrect = option.points >= 9;
                            const isFeedback = gameState === 'feedback';
                            
                            let buttonClass = 'bg-white hover:bg-gray-100 border-gray-200';
                            if(isFeedback) {
                                if(isSelected) {
                                    buttonClass = option.points >= 9 ? 'bg-green-200 border-green-400' : 'bg-red-200 border-red-400';
                                } else if (isCorrect) {
                                    buttonClass = 'bg-green-100 border-green-300';
                                } else {
                                     buttonClass = 'bg-gray-100 border-gray-200 opacity-50';
                                }
                            }

                            return(
                                <button key={index} onClick={() => handleChoice(index)} disabled={isFeedback} className={`w-full p-4 rounded-lg border-2 text-left transition-all ${buttonClass}`}>
                                    {option.text}
                                </button>
                            );
                        })}
                    </div>
                    
                    {gameState === 'feedback' && (
                        <div className="mt-6 p-4 rounded-lg bg-gray-50 border">
                            <h4 className="font-bold mb-2">Feedback:</h4>
                            <p className="text-sm">
                                {selectedOption === -1 ? "O tempo acabou! Tente ser mais ágil na próxima." : currentScenario.options[selectedOption].explanation}
                            </p>
                        </div>
                    )}
                </div>
            )}
           </div>
        </main>
      )}
    </div>
  );
}

export default DecisionMakingPage;
