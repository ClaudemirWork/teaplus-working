'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, Brain, Timer, Move, Star, Repeat, Target, Gamepad2, Trophy } from 'lucide-react';
import './memory-game.css'; // Arquivo CSS separado para os estilos 3D

// --- COMPONENTES ---

// Componente do Cabeçalho Padrão
const GameHeader = ({ onRestart, moves, timer }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20 w-full">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <a 
          href="/dashboard" 
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </a>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
          <Brain size={22} />
          <span>Jogo da Memória</span>
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600">
            <Move size={18} />
            <span className="font-semibold">{moves}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Timer size={18} />
            <span className="font-semibold">{timer}s</span>
          </div>
          <button onClick={onRestart} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <Repeat size={20} />
          </button>
        </div>
      </div>
    </div>
  </header>
);

// Componente com as informações do jogo
const GameInfo = () => (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-400">
                <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                    <Target size={18} className="mr-2 text-red-500"/> 
                    Objetivo:
                </h3>
                <p className="text-sm text-gray-600">
                    Exercitar a memória de trabalho, atenção visual e concentração.
                </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-400">
                <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                    <Gamepad2 size={18} className="mr-2 text-blue-500"/> 
                    Como Jogar:
                </h3>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                    <li>Memorize a posição das cartas.</li>
                    <li>Clique para virar e encontrar os pares.</li>
                    <li>Complete o nível para avançar.</li>
                </ul>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-400">
                <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                    <Trophy size={18} className="mr-2 text-yellow-500"/> 
                    Níveis:
                </h3>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                    <li>Nível 1: 4 cartas</li>
                    <li>Nível 2: 6 cartas</li>
                    <li>Nível 3: 8 cartas</li>
                    <li>Nível 4: 10 cartas</li>
                </ul>
            </div>
        </div>
    </div>
);

// Componente da Carta - CORRIGIDO
const Card = ({ card, onCardClick }) => {
  const isFlipped = card.status === 'flipped' || card.status === 'matched';
  const isMatched = card.status === 'matched';
  
  return (
    <div 
      className={`card-container ${isFlipped ? 'flipped' : ''}`}
      onClick={() => onCardClick(card.id)}
      style={{ aspectRatio: '2.5 / 3.5' }}
    >
      <div className="card-inner shadow-md rounded-lg">
        {/* Verso da Carta */}
        <div className="card-face card-back">
          <span className="text-white text-2xl font-bold tracking-wider">TeaPlus</span>
        </div>
        {/* Frente da Carta */}
        <div className={`card-face card-front ${isMatched ? 'matched' : ''}`}>
          <span className="text-5xl md:text-6xl">{card.emoji}</span>
        </div>
      </div>
    </div>
  );
};

// Componente da Tela de Vitória
const WinScreen = ({ level, onNextLevel, onRestart, moves, timer }) => (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
    <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4 animate-fade-in">
      <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Nível {level} Completo!</h2>
      <p className="text-gray-600 mb-6">Você encontrou todos os pares. Excelente memória!</p>
      <div className="flex justify-around mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Movimentos</p>
          <p className="text-2xl font-bold text-teal-600">{moves}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Tempo</p>
          <p className="text-2xl font-bold text-teal-600">{timer}s</p>
        </div>
      </div>
      <div className="space-y-3">
        {level < 4 ? (
          <button 
            onClick={onNextLevel} 
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
            Próximo Nível
          </button>
        ) : (
          <p className="font-bold text-green-600">🎉 Você completou todos os níveis! 🎉</p>
        )}
        <button 
          onClick={onRestart} 
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Jogar Novamente
        </button>
      </div>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

export default function MemoryGame() {
  const EMOJIS = useMemo(() => ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'], []);

  const LEVEL_CONFIG = useMemo(() => ({
    1: { pairs: 2, grid: 'grid-cols-2', title: 'Fácil' },
    2: { pairs: 3, grid: 'grid-cols-3', title: 'Médio' },
    3: { pairs: 4, grid: 'grid-cols-4', title: 'Difícil' },
    4: { pairs: 5, grid: 'grid-cols-5', title: 'Avançado' },
  }), []);

  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameState, setGameState] = useState('loading');
  
  const memorizeTimeoutRef = useRef(null);
  const processTimeoutRef = useRef(null);

  // Efeito para iniciar o jogo automaticamente ao carregar a página
  useEffect(() => {
    setupGame(1);
  }, []);

  // Efeito para o timer do jogo
  useEffect(() => {
    let interval;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Efeito para checar os pares virados
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      
      if (firstCard.emoji === secondCard.emoji) {
        // Par encontrado
        processTimeoutRef.current = setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.emoji === firstCard.emoji ? { ...card, status: 'matched' } : card
            )
          );
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // Par incorreto
        processTimeoutRef.current = setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, status: 'hidden' }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards]);

  // Efeito para checar vitória
  useEffect(() => {
    if (cards.length > 0 && matchedPairs === LEVEL_CONFIG[level].pairs) {
      setGameState('won');
    }
  }, [matchedPairs, level, LEVEL_CONFIG, cards]);

  // Cleanup dos timeouts
  useEffect(() => {
    return () => {
      if (memorizeTimeoutRef.current) {
        clearTimeout(memorizeTimeoutRef.current);
      }
      if (processTimeoutRef.current) {
        clearTimeout(processTimeoutRef.current);
      }
    };
  }, []);

  // Função para iniciar o jogo/nível
  const setupGame = (currentLevel) => {
    // Limpar timeouts anteriores
    if (memorizeTimeoutRef.current) {
        clearTimeout(memorizeTimeoutRef.current);
    }
    if (processTimeoutRef.current) {
        clearTimeout(processTimeoutRef.current);
    }

    setMatchedPairs(0);
    setMoves(0);
    setTimer(0);
    setFlippedCards([]);
    setLevel(currentLevel);

    const numPairs = LEVEL_CONFIG[currentLevel].pairs;
    const gameEmojis = EMOJIS.slice(0, numPairs);
    const duplicatedEmojis = [...gameEmojis, ...gameEmojis];
    
    const shuffledCards = duplicatedEmojis
      .map((emoji, index) => ({ 
        id: index, 
        emoji, 
        status: 'flipped' // Mostra os emojis inicialmente
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setGameState('memorize');

    // Após 5 segundos, esconder as cartas
    memorizeTimeoutRef.current = setTimeout(() => {
      setCards(currentCards => 
        currentCards.map(card => ({ 
          ...card, 
          status: 'hidden' // Esconde as cartas
        }))
      );
      setGameState('playing');
    }, 5000);
  };

  const handleCardClick = (id) => {
    if (gameState !== 'playing' || flippedCards.length === 2) return;

    const clickedCard = cards.find(card => card.id === id);
    if (!clickedCard || clickedCard.status !== 'hidden') return;
    
    // Incrementar movimentos no início de cada tentativa de par
    if (flippedCards.length === 0) {
        setMoves(prev => prev + 1);
    }

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, status: 'flipped' } : card
      )
    );
    
    setFlippedCards(prev => [...prev, clickedCard]);
  };

  const handleNextLevel = () => {
    const nextLevel = level + 1;
    if (nextLevel <= 4) {
      setupGame(nextLevel);
    }
  };

  const handleRestart = () => {
    setupGame(1);
  };
  
  if (gameState === 'loading') {
    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 flex items-center justify-center">
            <p className="text-xl font-semibold text-gray-600">Carregando jogo...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 flex flex-col">
      <GameHeader onRestart={handleRestart} moves={moves} timer={timer} />
      <div className="w-full pt-6">
        <GameInfo />
      </div>
      <main className="flex-grow flex flex-col items-center justify-center p-4 -mt-6">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-700">Nível {level}: {LEVEL_CONFIG[level].title}</h2>
          {gameState === 'memorize' && (
            <p className="text-blue-600 font-semibold animate-pulse">
              Memorize as cartas! (5 segundos)
            </p>
          )}
        </div>
        <div className={`grid ${LEVEL_CONFIG[level].grid} gap-3 sm:gap-4 w-full max-w-2xl`}>
          {cards.map(card => (
            <Card key={card.id} card={card} onCardClick={handleCardClick} />
          ))}
        </div>
      </main>
      {gameState === 'won' && (
        <WinScreen 
          level={level} 
          onNextLevel={handleNextLevel} 
          onRestart={handleRestart}
          moves={moves}
          timer={timer}
        />
      )}
    </div>
  );
}
