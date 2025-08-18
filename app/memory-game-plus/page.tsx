'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Pause, RotateCcw, Brain, Timer, Star, Trophy } from 'lucide-react';

export default function MemoryGamePlus() {
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [cards, setCards] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const symbols = ['🌟', '🎯', '🔥', '⚡', '🎪', '🎨', '🎭', '🎪', '🎯', '🔮', '🎲', '🎪'];
  
  const getLevelConfig = () => {
    switch(level) {
      case 1: return { pairs: 6, gridCols: 3, timeBonus: 100 };
      case 2: return { pairs: 8, gridCols: 4, timeBonus: 150 };
      case 3: return { pairs: 10, gridCols: 4, timeBonus: 200 };
      default: return { pairs: 6, gridCols: 3, timeBonus: 100 };
    }
  };

  const initializeGame = () => {
    const config = getLevelConfig();
    const gameSymbols = symbols.slice(0, config.pairs);
    const cardPairs = [...gameSymbols, ...gameSymbols];
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameCompleted(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && timeRemaining > 0 && !gameCompleted) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsPlaying(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeRemaining, gameCompleted]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      setMoves(prev => prev + 1);
      
      if (cards[first] === cards[second]) {
        setMatchedPairs(prev => [...prev, first, second]);
        setScore(prev => prev + 20 * level);
        setFlippedCards([]);
        
        // Check if game is completed
        if (matchedPairs.length + 2 === cards.length) {
          setGameCompleted(true);
          setScore(prev => prev + getLevelConfig().timeBonus + Math.floor(timeRemaining / 10) * 5);
          setIsPlaying(false);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, matchedPairs.length, level, timeRemaining]);

  const startActivity = () => {
    setIsPlaying(true);
    setTimeRemaining(180);
    setScore(0);
    setLevel(1);
    initializeGame();
  };

  const pauseActivity = () => {
    setIsPlaying(false);
  };

  const resetActivity = () => {
    setIsPlaying(false);
    setTimeRemaining(180);
    setScore(0);
    setLevel(1);
    initializeGame();
  };

  const handleCardClick = (index: number) => {
    if (!isPlaying || flippedCards.includes(index) || matchedPairs.includes(index) || flippedCards.length === 2) {
      return;
    }
    setFlippedCards(prev => [...prev, index]);
  };

  const nextLevel = () => {
    if (level < 3) {
      setLevel(prev => prev + 1);
      setTimeRemaining(180);
      initializeGame();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCardVisible = (index: number) => {
    return flippedCards.includes(index) || matchedPairs.includes(index);
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
                <span>Jogo da Memória Plus</span>
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
              Jogo da Memória Plus
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
                  Encontrar todos os pares de cartas iguais virando apenas duas cartas por vez. Desenvolva memória de trabalho, atenção visual e capacidade de retenção de informações espaciais.
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
                  Cada par encontrado = +20 pontos × nível. Bônus de tempo: +5 pontos por cada 10 segundos restantes. Bônus de conclusão por nível: Nível 1 (+100), Nível 2 (+150), Nível 3 (+200).
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
                  <p><strong className="text-purple-600">Nível 1:</strong> 6 pares - Grade 3x4 (fácil)</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> 8 pares - Grade 4x4 (médio)</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> 10 pares - Grade 4x5 (difícil)</p>
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
                  Complete todos os 3 níveis encontrando todos os pares dentro do tempo limite de 3 minutos por nível para maximizar sua pontuação final.
                </p>
              </div>
            </div>
          </div>

          {/* Game Area */}
          {isPlaying || gameCompleted ? (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {/* Game Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 px-4 py-2 rounded-lg">
                    <span className="text-purple-800 font-medium">Nível {level}/3</span>
                  </div>
                  <div className="bg-blue-100 px-4 py-2 rounded-lg">
                    <span className="text-blue-800 font-medium">Pontos: {score}</span>
                  </div>
                  <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                    <span className="text-yellow-800 font-medium">Jogadas: {moves}</span>
                  </div>
                </div>
                <div className="bg-red-100 px-4 py-2 rounded-lg flex items-center">
                  <Timer className="mr-2 text-red-600" size={16} />
                  <span className="text-red-800 font-medium">{formatTime(timeRemaining)}</span>
                </div>
              </div>

              {/* Game Completed for Level */}
              {gameCompleted && (
                <div className="text-center mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Trophy className="mx-auto text-green-600 mb-2" size={32} />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Nível {level} Concluído!</h3>
                  <p className="text-green-700 mb-4">
                    Parabéns! Você encontrou todos os pares em {moves} jogadas.
                  </p>
                  {level < 3 ? (
                    <button
                      onClick={nextLevel}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Próximo Nível
                    </button>
                  ) : (
                    <div>
                      <p className="text-green-800 font-semibold mb-2">🎉 Jogo Completo!</p>
                      <p className="text-green-700">Pontuação Final: {score} pontos</p>
                    </div>
                  )}
                </div>
              )}

              {/* Memory Cards Grid */}
              <div 
                className={`grid gap-3 mb-6 justify-center`}
                style={{ 
                  gridTemplateColumns: `repeat(${getLevelConfig().gridCols}, 1fr)`,
                  maxWidth: '500px',
                  margin: '0 auto'
                }}
              >
                {cards.map((symbol, index) => (
                  <button
                    key={index}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square rounded-lg border-2 text-2xl font-bold transition-all duration-300 ${
                      isCardVisible(index)
                        ? matchedPairs.includes(index)
                          ? 'bg-green-100 border-green-400 text-green-800 cursor-default'
                          : 'bg-blue-100 border-blue-400 text-blue-800'
                        : 'bg-gray-200 border-gray-300 hover:bg-gray-300 text-transparent'
                    }`}
                    disabled={!isPlaying || gameCompleted}
                  >
                    {isCardVisible(index) ? symbol : '?'}
                  </button>
                ))}
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={pauseActivity}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  disabled={gameCompleted}
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
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Pronto para exercitar sua memória?
              </h3>
              <p className="text-gray-600 mb-6">
                Clique em "Iniciar Jogo" para começar o desafio de memória com níveis progressivos
              </p>
              <button
                onClick={startActivity}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium transition-colors mx-auto"
              >
                <Play size={20} />
                <span>Iniciar Jogo</span>
              </button>
            </div>
          )}

          {/* Base Científica */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              🧬 Base Científica:
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Este jogo é baseado em pesquisas sobre memória de trabalho visuoespacial e função executiva. 
              Estimula o hipocampo (consolidação de memória), córtex pré-frontal dorsolateral (memória de trabalho) e áreas parietais (processamento espacial). 
              Especialmente eficaz para pessoas com TDAH, melhorando atenção sustentada e capacidade de retenção de informações.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}