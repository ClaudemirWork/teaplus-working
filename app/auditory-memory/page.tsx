'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Play, RotateCcw, Trophy, Star, Sparkles, Heart, Zap, Gift } from 'lucide-react';
import './auditory-memory.css';

interface GameStats {
  level: number;
  score: number;
  highScore: number;
  combo: number;
  lives: number;
}

const AuditoryMemoryGame: React.FC = () => {
  // Controle de Telas
  const [currentScreen, setCurrentScreen] = useState<'titleScreen' | 'instructions' | 'game'>('titleScreen');
  
  // Estados do Jogo
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'listening' | 'success' | 'fail'>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentNote, setCurrentNote] = useState<number | null>(null); // Essencial para a animação
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const [stats, setStats] = useState<GameStats>({
    level: 1,
    score: 0,
    highScore: 0,
    combo: 0,
    lives: 3
  });

  // NOVA LÓGICA DE JOGABILIDADE
  const [sequenceLength, setSequenceLength] = useState(1); // Começa com 1
  const [playbackSpeed, setPlaybackSpeed] = useState(800); // Velocidade Padrão

  const audioContextRef = useRef<AudioContext | null>(null);

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
    return () => { audioContextRef.current?.close(); };
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
  
  // LÓGICA DE ANIMAÇÃO CORRIGIDA
  const playSequence = useCallback(async (seq: number[]) => {
    setIsPlaying(true);
    setGameState('listening');
    await new Promise(resolve => setTimeout(resolve, 500));
    for (let i = 0; i < seq.length; i++) {
      setCurrentNote(seq[i]); // <-- LINHA ESSENCIAL RESTAURADA
      const button = document.getElementById(`btn-${seq[i]}`);
      if (button) button.style.opacity = '1'; // Acende o botão
      
      playNote(buttons[seq[i]].freq, 400);
      await new Promise(resolve => setTimeout(resolve, playbackSpeed));
      
      if (button) button.style.opacity = ''; // Apaga o botão
      setCurrentNote(null); // <-- LINHA ESSENCIAL RESTAURADA
      
      if (i < seq.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    setIsPlaying(false);
    setGameState('playing');
    setUserSequence([]);
  }, [playNote, buttons, playbackSpeed]);
  
  const startRound = useCallback(() => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    playSequence(newSequence);
  }, [generateSequence, playSequence]);
  
  const handleNoteClick = useCallback((noteIndex: number) => {
    if (gameState !== 'playing' || isPlaying) return;
    
    const button = document.getElementById(`btn-${noteIndex}`);
    if (button) {
      button.style.opacity = '1';
      setTimeout(() => { if (button) button.style.opacity = ''; }, 300);
    }

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
  }, [gameState, isPlaying, userSequence, sequence, playNote, buttons]);

  // NOVA LÓGICA DE DIFICULDADE
  const handleSuccess = useCallback(() => {
    setGameState('success');
    setShowSuccess(true);
    const newScore = stats.score + (sequenceLength * 10);
    const newHighScore = Math.max(newScore, stats.highScore);
    const newLevel = stats.level + 1;
    
    setStats(prev => ({...prev, score: newScore, highScore: newHighScore, level: newLevel, combo: prev.combo + 1}));
    localStorage.setItem('memoriaSonoraHighScore', newHighScore.toString());
    
    // Fase 1: Níveis 1-5
    if (newLevel <= 5) {
      setSequenceLength(newLevel);
    } else { // Fase 2: Nível 6+
      if (newLevel === 6) { // Transição de fase
        setPlaybackSpeed(650);
        setSequenceLength(2);
      } else {
        const lengthInPhase2 = 2 * (newLevel - 5);
        setSequenceLength(lengthInPhase2);
      }
    }

    setTimeout(() => {
      setShowSuccess(false);
      startRound();
    }, 1500);
  }, [stats, sequenceLength, startRound]);

  const handleFailure = useCallback(() => {
    setGameState('fail');
    setShowError(true);
    const newLives = stats.lives - 1;
    setStats(prev => ({ ...prev, lives: newLives, combo: 0 }));
    if (newLives <= 0) {
      setTimeout(() => {
        alert(`Fim de Jogo! Você chegou ao nível ${stats.level} com ${stats.score} pontos!`);
        resetGame();
      }, 1000);
    } else {
      setTimeout(() => {
        setShowError(false);
        playSequence(sequence);
      }, 2000);
    }
  }, [stats, sequence, playSequence]);

  const resetGame = () => {
    setCurrentScreen('titleScreen');
    setGameState('idle');
    setStats(prev => ({
      level: 1,
      score: 0,
      highScore: prev.highScore,
      combo: 0,
      lives: 3
    }));
    setSequenceLength(1); // Reseta para 1
    setPlaybackSpeed(800); // Reseta a velocidade
  };

  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 overflow-hidden">
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
  
  // TELA DO JOGO (LAYOUT ORIGINAL RESTAURADO)
  const GameScreen = () => {
    useEffect(() => {
      setGameState('idle');
    }, []);

    return (
      <div id="game-container" className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 game-container">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-white">
              <div><div className="text-xs opacity-80">NÍVEL</div><div className="text-2xl font-bold">{stats.level}</div></div>
              <div><div className="text-xs opacity-80">PONTOS</div><div className="text-2xl font-bold">{stats.score}</div></div>
              <div><div className="text-xs opacity-80">VIDAS</div><div className="text-2xl">{Array.from({ length: stats.lives }).map((_, i) => <Heart key={i} className="inline w-5 h-5 text-red-500 fill-red-500" />)}</div></div>
              <div className="hidden md:block"><div className="text-xs opacity-80">RECORDE</div><div className="text-2xl font-bold">{stats.highScore}</div></div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-4">
            <div className="text-center mb-6 min-h-[128px] flex items-center justify-center">
              {gameState === 'idle' && <div className="flex flex-col items-center"><Image src="/images/mascotes/leo/leo_boas_vindas_resultado.webp" alt="Leo" width={100} height={100} className="object-contain mb-2" /><p className="text-white text-xl font-bold">Clique em COMEÇAR para jogar!</p></div>}
              {gameState === 'listening' && <div className="flex flex-col items-center"><Image src="/images/mascotes/mila/mila_apoio_resultado.webp" alt="Mila" width={100} height={100} className="object-contain mb-2 animate-pulse" /><p className="text-yellow-300 text-2xl font-bold animate-pulse">🎧 ESCUTE COM ATENÇÃO!</p></div>}
              {gameState === 'playing' && !showSuccess && !showError && <div className="flex flex-col items-center"><Image src="/images/mascotes/leo/leo_apontando_resultado.webp" alt="Leo" width={100} height={100} className="object-contain mb-2" /><p className="text-green-300 text-2xl font-bold">SUA VEZ! REPITA A SEQUÊNCIA!</p></div>}
              {showSuccess && <div className="flex flex-col items-center animate-bounce"><Image src="/images/mascotes/leo/leo_joinha_resultado.webp" alt="Leo" width={120} height={120} className="object-contain mb-2" /><p className="text-green-400 text-3xl font-bold">PERFEITO! 🎉</p></div>}
              {showError && <div className="flex flex-col items-center"><Image src="/images/mascotes/leo/leo_surpreso_resultado.webp" alt="Leo" width={100} height={100} className="object-contain mb-2" /><p className="text-red-400 text-2xl font-bold">OPS! TENTE NOVAMENTE!</p></div>}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {buttons.map((button, index) => (
                <button key={index} id={`btn-${index}`} onClick={() => handleNoteClick(index)} disabled={gameState !== 'playing' || isPlaying} className={`musical-button ${button.color} h-24 md:h-28 rounded-2xl font-bold text-white text-2xl md:text-3xl flex flex-col items-center justify-center gap-1 shadow-lg ${gameState === 'listening' && currentNote === index ? 'scale-110 ring-4 ring-white' : ''}`}>
                  <span className="text-3xl">{button.emoji}</span>
                  <span className="text-lg font-bold">{button.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
              {gameState === 'idle' && (
                  <button onClick={startRound} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                      <Play className="w-5 h-5" /> COMEÇAR
                  </button>
              )}
              {gameState === 'playing' && (
                  <button onClick={() => playSequence(sequence)} disabled={isPlaying} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2 disabled:opacity-50">
                      <RotateCcw className="w-5 h-5" /> OUVIR NOVAMENTE
                  </button>
              )}
              <button onClick={resetGame} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">
                  MENU
              </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'titleScreen') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
};

export default AuditoryMemoryGame;
