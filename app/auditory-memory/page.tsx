'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Play, RotateCcw, Trophy, Star, Sparkles, Heart, Zap, Gift } from 'lucide-react';
import './auditory-memory.css';

interface GameStats {
  level: number;
  score: number;
  highScore: number;
  lives: number;
}

const AuditoryMemoryGame: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'titleScreen' | 'instructions' | 'game'>('titleScreen');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'listening' | 'success' | 'fail'>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [stats, setStats] = useState<GameStats>({
    level: 1,
    score: 0,
    highScore: 0,
    lives: 3
  });
  const [sequenceLength, setSequenceLength] = useState(1); // MUDANÇA: Começa com 1
  const [playbackSpeed, setPlaybackSpeed] = useState(800); // MUDANÇA: Velocidade inicial
  const audioContextRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const buttons = [
    { color: 'btn-red', emoji: '🎵', freq: 261.63, name: 'DÓ' },
    { color: 'btn-orange', emoji: '🎶', freq: 293.66, name: 'RÉ' },
    { color: 'btn-yellow', emoji: '🎼', freq: 329.63, name: 'MI' },
    { color: 'btn-green', emoji: '🎹', freq: 392.00, name: 'FÁ' },
    { color: 'btn-blue', emoji: '🎸', freq: 440.00, name: 'SOL' },
    { color: 'btn-purple', emoji: '🎺', freq: 523.25, name: 'LÁ' }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const savedHighScore = localStorage.getItem('memoriaSonoraHighScore');
      if (savedHighScore) {
        setStats(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
      }
    }
    return () => {
      audioContextRef.current?.close();
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
    setGameState('listening');
    await new Promise(resolve => setTimeout(resolve, 500));
    for (const noteIndex of seq) {
      const button = document.getElementById(`btn-${noteIndex}`);
      if (button) button.style.opacity = '1'; // Acende o botão
      playNote(buttons[noteIndex].freq, 400);
      await new Promise(resolve => setTimeout(resolve, playbackSpeed));
      if (button) button.style.opacity = ''; // Apaga o botão
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    setGameState('playing');
    setUserSequence([]);
  }, [playNote, buttons, playbackSpeed]);
  
  const startRound = useCallback(() => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    playSequence(newSequence);
  }, [generateSequence, playSequence]);
  
  const handleNoteClick = useCallback((noteIndex: number) => {
    if (gameState !== 'playing') return;
    const button = document.getElementById(`btn-${noteIndex}`);
    if (button) button.style.opacity = '1'; // Acende ao clicar
    setTimeout(() => { if (button) button.style.opacity = ''; }, 300); // Apaga após clique

    playNote(buttons[noteIndex].freq, 300);
    const newUserSequence = [...userSequence, noteIndex];
    setUserSequence(newUserSequence);

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
        handleFailure();
        return;
    }

    if (newUserSequence.length === sequence.length) {
      handleSuccess();
    }
  }, [gameState, userSequence, sequence, playNote, buttons]);

  // LÓGICA DE DIFICULDADE ATUALIZADA
  const handleSuccess = useCallback(() => {
    setGameState('success');
    const newScore = stats.score + (sequenceLength * 10);
    const newHighScore = Math.max(newScore, stats.highScore);
    const newLevel = stats.level + 1;
    
    setStats(prev => ({...prev, score: newScore, highScore: newHighScore, level: newLevel}));
    localStorage.setItem('memoriaSonoraHighScore', newHighScore.toString());
    
    // Nova lógica de progressão
    if (newLevel <= 5) {
      // Fase 1: Adaptação
      setSequenceLength(newLevel);
    } else {
      // Fase 2: Desafio
      if (newLevel === 6) { // Transição para a fase 2
        setPlaybackSpeed(650); // Aumenta a velocidade
        setSequenceLength(2); // Começa com 2 notas
      } else {
        // Aumenta de 2 em 2
        const lengthInPhase2 = (newLevel - 5) * 2;
        setSequenceLength(lengthInPhase2);
      }
    }

    setTimeout(() => startRound(), 1500);
  }, [stats, sequenceLength, startRound]);

  const handleFailure = useCallback(() => {
    setGameState('fail');
    const newLives = stats.lives - 1;
    setStats(prev => ({ ...prev, lives: newLives }));
    if (newLives <= 0) {
      setTimeout(() => {
        alert(`Fim de Jogo! Você chegou ao nível ${stats.level} com ${stats.score} pontos!`);
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
      highScore: prev.highScore,
      lives: 3
    }));
    setSequenceLength(1); // MUDANÇA: Reseta para 1
    setPlaybackSpeed(800); // MUDANÇA: Reseta a velocidade
  };

  // Funções de renderização das telas
  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300">
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4 animate-bounce-slow">
          <Image src="/images/mascotes/mila/mila_apoio_resultado.webp" alt="Mila" width={400} height={400} className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl" priority />
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-purple-800 drop-shadow-lg mb-4">Memória Sonora</h1>
        <p className="text-xl sm:text-2xl text-purple-700 mt-2 mb-8 drop-shadow-md">Siga a melodia e teste sua memória!</p>
        <button onClick={() => setCurrentScreen('instructions')} className="text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110">Começar</button>
      </div>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-300 via-green-300 to-yellow-300">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-purple-600">Como Jogar</h2>
        <div className="text-lg text-gray-700 space-y-6 mb-8 text-left">
          <p className="flex items-center gap-4"><span className="text-4xl">🎧</span><span><b>Escute com atenção</b> a sequência de sons.</span></p>
          <p className="flex items-center gap-4"><span className="text-4xl">🎹</span><span><b>Repita a sequência</b> na ordem correta.</span></p>
          <p className="flex items-center gap-4"><span className="text-4xl">🏆</span><span><b>Acerte para avançar</b> e aumentar o desafio!</span></p>
        </div>
        <button onClick={() => setCurrentScreen('game')} className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105">Entendi, vamos jogar!</button>
      </div>
    </div>
  );
  
  const GameScreen = () => {
    useEffect(() => {
        startRound();
    }, [startRound]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 game-container">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-4">
                    <div className="grid grid-cols-4 gap-2 text-center text-white">
                        <div><div className="text-xs opacity-80">NÍVEL</div><div className="text-2xl font-bold">{stats.level}</div></div>
                        <div><div className="text-xs opacity-80">PONTOS</div><div className="text-2xl font-bold">{stats.score}</div></div>
                        <div><div className="text-xs opacity-80">VIDAS</div><div className="text-2xl">{Array.from({ length: stats.lives }).map((_, i) => <Heart key={i} className="inline w-5 h-5 text-red-500 fill-red-500" />)}</div></div>
                        <div><div className="text-xs opacity-80">RECORDE</div><div className="text-2xl font-bold">{stats.highScore}</div></div>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-4">
                    <div className="text-center mb-6 min-h-[50px] flex items-center justify-center">
                        {gameState === 'listening' && <p className="text-yellow-300 text-2xl font-bold animate-pulse">🎧 ESCUTE...</p>}
                        {gameState === 'playing' && <p className="text-green-300 text-2xl font-bold">SUA VEZ!</p>}
                        {gameState === 'success' && <p className="text-green-400 text-3xl font-bold animate-bounce">ACERTOU! ✔️</p>}
                        {gameState === 'fail' && <p className="text-red-400 text-2xl font-bold">OPS, TENTE DE NOVO!</p>}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {buttons.map((button, index) => (
                            <button key={index} id={`btn-${index}`} onClick={() => handleNoteClick(index)} disabled={gameState !== 'playing'} className={`musical-button ${button.color} h-24 md:h-28 rounded-2xl`}>
                                <span className="text-3xl">{button.emoji}</span>
                                <span className="text-lg font-bold">{button.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center gap-3"><button onClick={resetGame} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold">MENU</button></div>
            </div>
        </div>
    );
  }

  // Renderização principal
  if (currentScreen === 'titleScreen') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
};

export default AuditoryMemoryGame;
