'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw, Award, Target, Clock, Brain, CheckCircle, Shuffle, ChevronLeft, Zap, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// ============================================================================
// 1. STANDARD "GAMEHEADER" COMPONENT
// ============================================================================
const GameHeader = ({ title, icon }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </button>
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
// 2. MAIN "COGNITIVE FLEXIBILITY" ACTIVITY COMPONENT - FIXED VERSION
// ============================================================================
const CognitiveFlexibilityPage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'finished'>('playing');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 120 seconds for better gameplay
  const [currentStimulus, setCurrentStimulus] = useState<any>(null);
  const [responses, setResponses] = useState({ correct: 0, incorrect: 0 });
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isRuleSwitch, setIsRuleSwitch] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [previousRule, setPreviousRule] = useState<string>('');
  const [difficulty, setDifficulty] = useState(1);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Definição clara de formas e cores com representação visual consistente
  const shapes = [
    { id: 'circle', symbol: '●', name: 'Círculo' },
    { id: 'square', symbol: '■', name: 'Quadrado' },
    { id: 'triangle', symbol: '▲', name: 'Triângulo' },
    { id: 'star', symbol: '★', name: 'Estrela' },
    { id: 'diamond', symbol: '♦', name: 'Diamante' },
    { id: 'heart', symbol: '♥', name: 'Coração' }
  ];

  const colors = [
    { id: 'red', hex: '#EF4444', name: 'Vermelho' },
    { id: 'blue', hex: '#3B82F6', name: 'Azul' },
    { id: 'green', hex: '#10B981', name: 'Verde' },
    { id: 'yellow', hex: '#F59E0B', name: 'Amarelo' },
    { id: 'purple', hex: '#8B5CF6', name: 'Roxo' },
    { id: 'pink', hex: '#EC4899', name: 'Rosa' }
  ];

  const rules = ['color', 'shape', 'count', 'position'] as const;
  
  // Timer effect
  useEffect(() => {
    if (gameStarted && gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('finished');
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timeLeft, gameState, gameStarted]);

  // Função melhorada para gerar próximo round
  const generateNextRound = () => {
    setFeedback(null);
    setRoundStartTime(Date.now());
    
    // Escolhe uma nova regra diferente da anterior (garante mudança)
    let availableRules = rules.filter(r => r !== previousRule);
    if (availableRules.length === 0) availableRules = [...rules];
    
    const newRule = availableRules[Math.floor(Math.random() * availableRules.length)];
    const ruleChanged = newRule !== previousRule;
    setIsRuleSwitch(ruleChanged);
    setPreviousRule(newRule);
    
    // Aumenta dificuldade baseado na pontuação
    const newDifficulty = Math.min(3, Math.floor(score / 100) + 1);
    setDifficulty(newDifficulty);
    
    // Gera quantidade de formas baseado na dificuldade
    const minShapes = 2 + newDifficulty;
    const maxShapes = 4 + newDifficulty;
    const shapeCount = minShapes + Math.floor(Math.random() * (maxShapes - minShapes + 1));
    
    // Gera as formas com cores
    const availableShapes = [...shapes];
    const availableColors = [...colors];
    
    const stimulusShapes = [];
    let targetAnswer = '';
    let options: string[] = [];
    
    if (newRule === 'color') {
      // Garante que há uma cor dominante
      const dominantColor = availableColors[Math.floor(Math.random() * availableColors.length)];
      const dominantCount = Math.ceil(shapeCount / 2) + Math.floor(Math.random() * 2);
      
      // Adiciona formas com a cor dominante
      for (let i = 0; i < dominantCount && i < shapeCount; i++) {
        const shape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
        stimulusShapes.push({
          shape: shape,
          color: dominantColor,
          position: i
        });
      }
      
      // Preenche o resto com cores diferentes
      for (let i = dominantCount; i < shapeCount; i++) {
        const shape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
        const otherColors = availableColors.filter(c => c.id !== dominantColor.id);
        const color = otherColors[Math.floor(Math.random() * otherColors.length)];
        stimulusShapes.push({
          shape: shape,
          color: color,
          position: i
        });
      }
      
      targetAnswer = dominantColor.name;
      options = availableColors.slice(0, 4).map(c => c.name);
      if (!options.includes(targetAnswer)) {
        options[Math.floor(Math.random() * options.length)] = targetAnswer;
      }
      
    } else if (newRule === 'shape') {
      // Garante que há uma forma dominante
      const dominantShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
      const dominantCount = Math.ceil(shapeCount / 2) + Math.floor(Math.random() * 2);
      
      // Adiciona a forma dominante
      for (let i = 0; i < dominantCount && i < shapeCount; i++) {
        const color = availableColors[Math.floor(Math.random() * availableColors.length)];
        stimulusShapes.push({
          shape: dominantShape,
          color: color,
          position: i
        });
      }
      
      // Preenche o resto com formas diferentes
      for (let i = dominantCount; i < shapeCount; i++) {
        const otherShapes = availableShapes.filter(s => s.id !== dominantShape.id);
        const shape = otherShapes[Math.floor(Math.random() * otherShapes.length)];
        const color = availableColors[Math.floor(Math.random() * availableColors.length)];
        stimulusShapes.push({
          shape: shape,
          color: color,
          position: i
        });
      }
      
      targetAnswer = dominantShape.name;
      options = availableShapes.slice(0, 4).map(s => s.name);
      if (!options.includes(targetAnswer)) {
        options[Math.floor(Math.random() * options.length)] = targetAnswer;
      }
      
    } else if (newRule === 'count') {
      // Gera formas aleatórias
      for (let i = 0; i < shapeCount; i++) {
        const shape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
        const color = availableColors[Math.floor(Math.random() * availableColors.length)];
        stimulusShapes.push({
          shape: shape,
          color: color,
          position: i
        });
      }
      
      targetAnswer = shapeCount.toString();
      // Gera opções próximas ao valor real
      options = [];
      for (let i = -1; i <= 2; i++) {
        const opt = (shapeCount + i).toString();
        if (parseInt(opt) > 0 && parseInt(opt) <= 10) {
          options.push(opt);
        }
      }
      // Garante 4 opções
      while (options.length < 4) {
        const randomNum = (2 + Math.floor(Math.random() * 8)).toString();
        if (!options.includes(randomNum)) {
          options.push(randomNum);
        }
      }
      options.sort((a, b) => parseInt(a) - parseInt(b));
      
    } else if (newRule === 'position') {
      // Gera formas aleatórias mas destaca uma posição
      const targetPosition = Math.floor(Math.random() * shapeCount);
      const specialShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
      
      for (let i = 0; i < shapeCount; i++) {
        if (i === targetPosition) {
          // Coloca uma forma especial/única nesta posição
          const specialColor = availableColors[Math.floor(Math.random() * availableColors.length)];
          stimulusShapes.push({
            shape: specialShape,
            color: specialColor,
            position: i,
            isSpecial: true
          });
        } else {
          // Usa formas diferentes da especial
          const otherShapes = availableShapes.filter(s => s.id !== specialShape.id);
          const shape = otherShapes[Math.floor(Math.random() * otherShapes.length)];
          const color = availableColors[Math.floor(Math.random() * availableColors.length)];
          stimulusShapes.push({
            shape: shape,
            color: color,
            position: i
          });
        }
      }
      
      targetAnswer = (targetPosition + 1).toString() + 'ª';
      options = [];
      for (let i = 0; i < shapeCount && i < 4; i++) {
        options.push((i + 1).toString() + 'ª');
      }
    }
    
    // Embaralha as formas para exibição (exceto para regra de posição)
    if (newRule !== 'position') {
      stimulusShapes.sort(() => Math.random() - 0.5);
    }
    
    setCurrentStimulus({ 
      shapes: stimulusShapes, 
      rule: newRule, 
      target: targetAnswer,
      options: options
    });
  };
  
  const startGame = () => {
    setGameState('playing');
    setTimeLeft(120);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setResponses({ correct: 0, incorrect: 0 });
    setReactionTimes([]);
    setGameStarted(true);
    setPreviousRule('');
    setDifficulty(1);
    generateNextRound();
  };

  const handleResponse = (answer: string) => {
    if (feedback) return; // Previne múltiplos cliques
    
    // Calcula tempo de reação
    const reactionTime = Date.now() - roundStartTime;
    setReactionTimes(prev => [...prev, reactionTime]);
    
    const correct = answer === currentStimulus.target;
    
    if (correct) {
      // Sistema de pontuação melhorado
      let points = 10; // Pontos base
      
      // Bônus por mudança de regra
      if (isRuleSwitch) {
        points += 15;
      }
      
      // Bônus por velocidade (quanto mais rápido, mais pontos)
      if (reactionTime < 1000) {
        points += 10; // Muito rápido
      } else if (reactionTime < 2000) {
        points += 5; // Rápido
      }
      
      // Bônus por streak
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }
      points += Math.floor(newStreak / 3) * 5; // +5 pontos a cada 3 acertos seguidos
      
      // Bônus por dificuldade
      points += (difficulty - 1) * 5;
      
      setScore(prev => prev + points);
      setResponses(prev => ({ ...prev, correct: prev.correct + 1 }));
      setFeedback('correct');
    } else {
      setStreak(0); // Reset streak
      setResponses(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      setFeedback('incorrect');
    }

    setTimeout(() => generateNextRound(), 1000);
  };

  const pauseGame = () => {
    setGameState(gameState === 'paused' ? 'playing' : 'paused');
  };

  const accuracy = (responses.correct + responses.incorrect) > 0 
    ? Math.round((responses.correct / (responses.correct + responses.incorrect)) * 100) 
    : 0;
    
  const avgReactionTime = reactionTimes.length > 0 
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <GameHeader title="Flexibilidade Cognitiva" icon={<Shuffle className="w-6 h-6 text-gray-700" />} />
      
      {!gameStarted ? (
         <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      Objetivo
                    </h3>
                    <p className="text-sm text-gray-600">
                      Treinar a capacidade de mudar rapidamente entre diferentes tipos de tarefas, 
                      melhorando a flexibilidade mental e adaptação.
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      Como Jogar
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Uma pergunta aparecerá no topo</li>
                      <li>• Observe as figuras coloridas</li>
                      <li>• Escolha a resposta correta</li>
                      <li>• A regra muda frequentemente!</li>
                      <li>• Seja rápido e preciso</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      Pontuação
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Resposta correta: 10 pts</li>
                      <li>• Mudança de regra: +15 pts</li>
                      <li>• Resposta rápida: +10 pts</li>
                      <li>• Sequência de acertos: bônus</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  🧠 Desafio de Flexibilidade Mental
                </h2>
                <p className="text-gray-600 mb-6">
                  Teste sua capacidade de adaptação e agilidade cognitiva!
                </p>
                <button 
                  onClick={startGame} 
                  className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                >
                  <Zap className="w-6 h-6" />
                  Começar Desafio
                </button>
              </div>
            </div>
          </main>
      ) : (
        <main className="p-4 sm:p-6 max-w-5xl mx-auto w-full">
            {/* Barra de estatísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                <div className="bg-white p-3 rounded-xl shadow-md text-center">
                  <p className="text-xs text-gray-500">Tempo</p>
                  <p className="font-bold text-lg">{formatTime(timeLeft)}</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-md text-center">
                  <p className="text-xs text-gray-500">Pontos</p>
                  <p className="font-bold text-lg text-blue-600">{score}</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-md text-center">
                  <p className="text-xs text-gray-500">Sequência</p>
                  <p className="font-bold text-lg text-orange-500">{streak}</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-md text-center">
                  <p className="text-xs text-gray-500">Precisão</p>
                  <p className="font-bold text-lg text-green-600">{accuracy}%</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-md text-center">
                  <p className="text-xs text-gray-500">Nível</p>
                  <p className="font-bold text-lg text-purple-600">{difficulty}</p>
                </div>
            </div>
            
            {/* Área principal do jogo */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-500 transform
                ${feedback === 'correct' ? 'ring-4 ring-green-400 scale-[1.02]' : ''}
                ${feedback === 'incorrect' ? 'ring-4 ring-red-400 shake' : ''}`}>
                
                {gameState === 'finished' ? (
                    <div className="text-center">
                        <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          Exercício Concluído!
                        </h2>
                        <p className="text-gray-600 mb-6">
                          Você demonstrou excelente flexibilidade cognitiva!
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                              <p className="text-gray-600 text-sm">Pontuação Final</p>
                              <p className="text-3xl font-bold text-blue-600">{score}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                              <p className="text-gray-600 text-sm">Precisão</p>
                              <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                              <p className="text-gray-600 text-sm">Melhor Sequência</p>
                              <p className="text-3xl font-bold text-orange-600">{maxStreak}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                              <p className="text-gray-600 text-sm">Tempo Médio</p>
                              <p className="text-2xl font-bold text-purple-600">{avgReactionTime}ms</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                          <h3 className="font-semibold text-gray-800 mb-2">Resumo do Desempenho</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-left">
                              <span className="text-gray-600">Total de Respostas:</span>
                              <span className="ml-2 font-semibold">{responses.correct + responses.incorrect}</span>
                            </div>
                            <div className="text-left">
                              <span className="text-gray-600">Acertos:</span>
                              <span className="ml-2 font-semibold text-green-600">{responses.correct}</span>
                            </div>
                            <div className="text-left">
                              <span className="text-gray-600">Erros:</span>
                              <span className="ml-2 font-semibold text-red-600">{responses.incorrect}</span>
                            </div>
                            <div className="text-left">
                              <span className="text-gray-600">Nível Alcançado:</span>
                              <span className="ml-2 font-semibold text-purple-600">{difficulty}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={startGame} 
                          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                        >
                          Jogar Novamente
                        </button>
                    </div>
                ) : gameState === 'paused' ? (
                    <div className="text-center py-12">
                        <Pause className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Jogo Pausado</h3>
                        <p className="text-gray-600 mb-6">Clique em continuar quando estiver pronto</p>
                        <button 
                          onClick={pauseGame}
                          className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                        >
                          Continuar
                        </button>
                    </div>
                ) : currentStimulus ? (
                    <div className="text-center">
                        {/* Indicador de mudança de regra */}
                        {isRuleSwitch && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                            Nova Regra!
                          </div>
                        )}
                        
                        {/* Pergunta atual */}
                        <div className={`p-4 rounded-xl font-bold text-lg mb-8 transition-all duration-500 ${
                          isRuleSwitch 
                            ? 'bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-900 animate-pulse' 
                            : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800'
                        }`}>
                            {currentStimulus.rule === 'color' && '🎨 Qual COR aparece MAIS vezes?'}
                            {currentStimulus.rule === 'shape' && '📐 Qual FORMA aparece MAIS vezes?'}
                            {currentStimulus.rule === 'count' && '🔢 QUANTAS figuras existem no total?'}
                            {currentStimulus.rule === 'position' && '📍 Em que POSIÇÃO está a forma diferente?'}
                        </div>
                        
                        {/* Display das formas */}
                        <div className="min-h-[120px] flex items-center justify-center gap-3 sm:gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
                           {currentStimulus.shapes.map((item, i) => (
                             <div key={i} className="relative">
                               {currentStimulus.rule === 'position' && (
                                 <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                                   {i + 1}ª
                                 </div>
                               )}
                               <span 
                                 style={{ 
                                   color: item.color.hex,
                                   fontSize: '3rem',
                                   filter: item.isSpecial ? 'drop-shadow(0 0 10px gold)' : 'none'
                                 }}
                                 className="transition-all duration-300 hover:scale-110"
                               >
                                 {item.shape.symbol}
                               </span>
                             </div>
                           ))}
                        </div>

                        {/* Opções de resposta */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                           {currentStimulus.options.map((option, index) => (
                               <button 
                                 key={index} 
                                 onClick={() => handleResponse(option)} 
                                 disabled={feedback !== null}
                                 className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl font-semibold hover:from-gray-800 hover:to-gray-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                               >
                                   {option}
                               </button>
                           ))}
                        </div>
                        
                        {/* Feedback visual */}
                        {feedback && (
                          <div className={`mt-4 p-3 rounded-lg font-semibold animate-fade-in ${
                            feedback === 'correct' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {feedback === 'correct' ? '✅ Correto!' : '❌ Incorreto!'}
                          </div>
                        )}
                    </div>
                ) : null}
                
                {/* Controles do jogo */}
                {gameState === 'playing' && (
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={pauseGame}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                    >
                      <Pause className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setGameState('finished')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                    >
                      Finalizar
                    </button>
                  </div>
                )}
            </div>
        </main>
      )}
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
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
