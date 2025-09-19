'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Howl } from 'howler';

// Inicializa Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Card = {
  id: number;
  image: string;
  matched: boolean;
};

export default function MemoryGamePage() {
  const [gameState, setGameState] = useState<'intro' | 'instructions' | 'playing' | 'won'>('intro');
  const [isInteracting, setIsInteracting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [level, setLevel] = useState(1);

  const audioContextRef = useRef<AudioContext | null>(null);
  const introSound = useRef<Howl | null>(null);
  const winSound = useRef<Howl | null>(null);

  // Inicializa áudio
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    introSound.current = new Howl({
      src: ['/sounds/intro.mp3'],
      volume: muted ? 0 : 1,
    });

    winSound.current = new Howl({
      src: ['/sounds/win.mp3'],
      volume: muted ? 0 : 1,
    });

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (introSound.current) introSound.current.volume(muted ? 0 : 1);
    if (winSound.current) winSound.current.volume(muted ? 0 : 1);
  }, [muted]);

  // Fala inicial do Leo
  const handleStartIntro = async () => {
    if (isInteracting || !isReady) return;
    setIsInteracting(true);

    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    introSound.current?.play();
    setTimeout(() => {
      setGameState('instructions');
      setTimeout(() => setIsInteracting(false), 300);
    }, 4000);
  };

  // Fala de instruções
  const handleNextInstruction = () => {
    if (isInteracting) return;
    setIsInteracting(true);

    setTimeout(() => {
      startGame();
      setTimeout(() => setIsInteracting(false), 300);
    }, 3000);
  };

  // Inicia jogo
  const startGame = () => {
    setGameState('playing');
    const newCards: Card[] = generateCards(level);
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
  };

  // Gera cartas
  const generateCards = (lvl: number): Card[] => {
    const baseImages = ['/images/apple.png', '/images/banana.png', '/images/orange.png', '/images/grape.png'];
    const selected = baseImages.slice(0, lvl + 1);
    const pairSet = [...selected, ...selected].map((img, i) => ({
      id: i,
      image: img,
      matched: false,
    }));
    return shuffle(pairSet);
  };

  // Shuffle simples
  const shuffle = (arr: any[]) => {
    let array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Flip card
  const handleFlip = (id: number) => {
    if (flippedCards.includes(id) || cards[id].matched) return;
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setTimeout(() => checkMatch(newFlipped), 800);
    }
  };

  // Checa match
  const checkMatch = (flipped: number[]) => {
    const [a, b] = flipped;
    if (cards[a].image === cards[b].image) {
      const updated = [...cards];
      updated[a].matched = true;
      updated[b].matched = true;
      setCards(updated);
      setMatchedPairs(matchedPairs + 1);

      if (matchedPairs + 1 === cards.length / 2) {
        handleWin();
      }
    }
    setFlippedCards([]);
  };

  // Vitória
  const handleWin = () => {
    setGameState('won');
    winSound.current?.play();
    if (!bestScore || level < bestScore) {
      setBestScore(level);
    }
  };

  // Próximo nível
  const handleNextLevel = () => {
    setLevel(level + 1);
    startGame();
  };

  // Reset
  const handleReset = () => {
    setLevel(1);
    startGame();
  };

  // Renderização
  if (gameState === 'intro') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-indigo-300 to-purple-400">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-12 h-12 bg-white/20 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        <h1 className="text-4xl font-bold text-white mb-6">LudiTEA - Memory Game</h1>
        <button
          onClick={handleStartIntro}
          disabled={isInteracting}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Iniciar com o Leo
        </button>
      </div>
    );
  }

  if (gameState === 'instructions') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-green-300 to-teal-400">
        <h2 className="text-2xl font-semibold text-white mb-4">Como jogar</h2>
        <p className="text-white mb-6">Encontre todos os pares de cartas iguais para vencer!</p>
        <button
          onClick={handleNextInstruction}
          disabled={isInteracting}
          className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          Começar
        </button>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-300 to-orange-400">
        <Trophy size={80} className="text-white mb-6 animate-bounce" />
        <h2 className="text-3xl font-bold text-white mb-4">Parabéns! Você venceu!</h2>
        <div className="flex gap-4">
          <button
            onClick={handleNextLevel}
            className="px-6 py-3 bg-yellow-600 text-white rounded-xl shadow-lg hover:bg-yellow-700 transition"
          >
            Próximo nível
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition"
          >
            Reiniciar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-blue-300 to-indigo-400">
      <h2 className="text-2xl font-bold text-white mb-4">Nível {level}</h2>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`w-20 h-28 bg-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer transition transform ${
              flippedCards.includes(idx) || card.matched ? 'rotate-y-180' : ''
            }`}
            onClick={() => handleFlip(idx)}
          >
            {flippedCards.includes(idx) || card.matched ? (
              <img src={card.image} alt="card" className="w-16 h-16 object-contain" />
            ) : (
              <div className="w-16 h-16 bg-indigo-200 rounded-lg" />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => setMuted(!muted)}
        className="mt-6 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
      >
        {muted ? <VolumeX /> : <Volume2 />}
      </button>
    </div>
  );
}
