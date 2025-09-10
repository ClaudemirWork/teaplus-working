'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Play, RotateCcw, Trophy, Star, Sparkles, Heart, Zap, Gift } from 'lucide-react';
import './auditory-memory.css';

// Interface de Stats do Jogo
interface GameStats {
  level: number;
  score: number;
  highScore: number;
  coins: number;
  combo: number;
  lives: number;
}

// ===== COMPONENTE PRINCIPAL =====
const AuditoryMemoryGame: React.FC = () => {
  // Estados para controlar qual tela é exibida
  const [currentScreen, setCurrentScreen] = useState<'titleScreen' | 'instructions' | 'game'>('titleScreen');
  
  // (O resto dos estados do jogo permanecem os mesmos)
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'listening' | 'success' | 'fail'>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentNote, setCurrentNote] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stats, setStats] = useState<GameStats>({
    level: 1,
    score: 0,
    highScore: 0,
    coins: 0,
    combo: 0,
    lives: 3
  });
  const [sequenceLength, setSequenceLength] = useState(3);
  const [playbackSpeed, setPlaybackSpeed] = useState(800);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const buttons = [
    { color: 'btn-red', emoji: '🎵', freq: 261.63, name: 'DÓ' },
    { color: 'btn-orange', emoji: '🎶', freq: 293.66, name: 'RÉ' },
    { color: 'btn-yellow', emoji: '🎼', freq: 329.63, name: 'MI' },
    { color: 'btn-green', emoji: '🎹', freq: 392.00, name: 'FÁ' },
    { color: 'btn-blue', emoji: '🎸', freq: 440.00, name: 'SOL' },
    { color: 'btn-purple', emoji: '🎺', freq: 523.25, name: 'LÁ' }
  ];

  // ===== TODA A LÓGICA DE JOGABILIDADE (INTACTA) =====
  // Nenhuma alteração foi feita na lógica principal do jogo.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const savedHighScore = localStorage.getItem('memoriaSonoraHighScore');
      if (savedHighScore) {
        setStats(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
      }
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playNote = useCallback((frequency: number, duration: number = 400) => {
    if (!soundEnabled || !audioContextRef.current) return;
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  }, [soundEnabled]);

  const generateSequence = useCallback(() => {
    return Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * 6));
  }, [sequenceLength]);

  const playSequence = useCallback(async (seq: number[]) => {
    setIsPlaying(true);
    setGameState('listening');
    await new Promise(resolve => setTimeout(resolve, 500));
    for (let i = 0; i < seq.length; i++) {
      setCurrentNote(seq[i]);
      playNote(buttons[seq[i]].freq, 400);
      await new Promise(resolve => setTimeout(resolve, playbackSpeed));
      setCurrentNote(null);
      if (i < seq.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    setIsPlaying(false);
    setGameState('playing');
    setUserSequence([]);
  }, [playNote, buttons, playbackSpeed]);
  
  const startFirstRound = useCallback(() => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setUserSequence([]);
    playSequence(newSequence);
  }, [generateSequence, playSequence]);
  
  const handleNoteClick = useCallback((noteIndex: number) => {
    if (gameState !== 'playing' || isPlaying) return;
    playNote(buttons[noteIndex].freq, 300);
    const newUserSequence = [...userSequence, noteIndex];
    setUserSequence(newUserSequence);
    if (newUserSequence.length === sequence.length) {
      const isCorrect = newUserSequence.every((note, index) => note === sequence[index]);
      setTimeout(() => {
        if (isCorrect) handleSuccess();
        else handleFailure();
      }, 400);
    }
  }, [gameState, isPlaying, userSequence, sequence, playNote, buttons]);

  const handleSuccess = useCallback(() => {
    setGameState('success');
    const newScore = stats.score + (sequenceLength * 10 * stats.level);
    const newHighScore = Math.max(newScore, stats.highScore);
    setStats(prev => ({...prev, score: newScore, highScore: newHighScore, level: prev.level + 1, combo: prev.combo + 1}));
    localStorage.setItem('memoriaSonoraHighScore', newHighScore.toString());
    setTimeout(() => {
      const newSequence = generateSequence();
      setSequence(newSequence);
      playSequence(newSequence);
    }, 2000);
  }, [sequence, stats, generateSequence, playSequence]);

  const handleFailure = useCallback(() => {
    setGameState('fail');
    const newLives = stats.lives - 1;
    setStats(prev => ({ ...prev, lives: newLives, combo: 0 }));
    if (newLives <= 0) {
      setTimeout(() => {
        alert(`Game Over! Pontuação Final: ${stats.score}`);
        resetGame();
      }, 1000);
    } else {
      setTimeout(() => playSequence(sequence), 2000);
    }
  }, [stats, sequence, playSequence]);

  const resetGame = () => {
    setCurrentScreen('titleScreen');
    setGameState('idle');
    setStats(prev => ({
      level: 1,
      score: 0,
      highScore: prev.highScore, // Mantém o recorde
      coins: prev.coins,
      combo: 0,
      lives: 3
    }));
    setSequenceLength(3);
  };

  // ===== NOVAS TELAS PADRONIZADAS =====

  // 1. TELA DE TÍTULO (A CAPA DO JOGO)
  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4">
          <Image 
            src="/images/mascotes/mila/mila_apoio_resultado.webp"
            alt="Mascote Mila" 
            width={400} 
            height={400} 
            className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl"
            priority 
          />
        </div>
        
        {/* TÍTULO DE TESTE PARA VERIFICAR A MUDANÇA */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-800 drop-shadow-lg mb-4">
          TESTE LAYOUT NOVO - Memória Sonora
        </h1>
        
        <p className="text-xl sm:text-2xl text-purple-700 mt-2 mb-8 drop-shadow-md">
          Siga a melodia e teste sua memória!
        </p>
        
        <button 
          onClick={() => setCurrentScreen('instructions')}
          className="text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95"
        >
          Começar
        </button>
      </div>
    </div>
  );

  // 2. TELA DE INSTRUÇÕES
  const InstructionsScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-300 via-green-300 to-yellow-300">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-purple-600">
          Como Jogar
        </h2>
        <div className="text-lg text-gray-700 space-y-6 mb-8 text-left">
          <p className="flex items-center gap-4">
            <span className="text-4xl">🎧</span>
            <span><b>Escute com atenção</b> a sequência de sons que a Mila vai tocar.</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🎹</span>
            <span><b>Repita a sequência</b> na ordem correta, clicando nos botões coloridos.</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🏆</span>
            <span><b>Acerte para avançar de nível</b> e aumentar a dificuldade!</span>
          </p>
        </div>
        <button 
          onClick={() => setCurrentScreen('game')}
          className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl transition-all duration-300 hover:scale-105"
        >
          Entendi, vamos jogar!
        </button>
      </div>
    </div>
  );
  
  // 3. TELA DO JOGO (JOGABILIDADE)
  const GameScreen = () => {
    // Inicia o jogo na primeira vez que esta tela é renderizada
    useEffect(() => {
        startFirstRound();
    }, []);

    return (
        <div id="game-container" className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 game-container">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-4">
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 text-center">
                        <div><div className="text-xs">NÍVEL</div><div className="text-2xl font-bold">{stats.level}</div></div>
                        <div><div className="text-xs">PONTOS</div><div className="text-2xl font-bold">{stats.score}</div></div>
                        <div><div className="text-xs">COMBO</div><div className="text-2xl font-bold">{stats.combo}x</div></div>
                        <div><div className="text-xs">VIDAS</div><div className="text-2xl">{Array.from({ length: stats.lives }).map((_, i) => <Heart key={i} className="inline w-5 h-5 text-red-500 fill-red-500" />)}</div></div>
                        <div className="hidden md:block"><div className="text-xs">RECORDE</div><div className="text-2xl font-bold">{stats.highScore}</div></div>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-4">
                    <div className="text-center mb-6 min-h-[100px] flex items-center justify-center">
                        {gameState === 'listening' && <p className="text-yellow-300 text-2xl font-bold animate-pulse">🎧 ESCUTE...</p>}
                        {gameState === 'playing' && <p className="text-green-300 text-2xl font-bold">SUA VEZ!</p>}
                        {gameState === 'success' && <p className="text-green-400 text-3xl font-bold animate-bounce">PERFEITO! 🎉</p>}
                        {gameState === 'fail' && <p className="text-red-400 text-2xl font-bold">OPS! TENTE DE NOVO!</p>}
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {buttons.map((button, index) => (
                            <button
                                key={index}
                                onClick={() => handleNoteClick(index)}
                                disabled={gameState !== 'playing' || isPlaying}
                                className={`musical-button ${button.color} h-24 md:h-28 rounded-2xl ${gameState === 'listening' && currentNote === index ? 'scale-110 ring-4 ring-white' : ''}`}
                            >
                                <span className="text-3xl">{button.emoji}</span>
                                <span className="text-lg font-bold">{button.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center gap-3">
                    <button onClick={resetGame} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold">MENU</button>
                </div>
            </div>
        </div>
    );
  }

  // Lógica para renderizar a tela correta
  if (currentScreen === 'titleScreen') {
    return <TitleScreen />;
  }
  if (currentScreen === 'instructions') {
    return <InstructionsScreen />;
  }
  return <GameScreen />;
};

export default AuditoryMemoryGame;
