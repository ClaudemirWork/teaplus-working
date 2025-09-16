'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Star, Trophy, Volume2, VolumeX, Play } from 'lucide-react';
import { createClient } from '../utils/supabaseClient';
import dynamic from 'next/dynamic';
import styles from './bubble-pop.module.css';
import Image from 'next/image';
import { GameAudioManager } from '../utils/gameAudioManager';

const confetti = dynamic(() => import('canvas-confetti'), { ssr: false });

// Interfaces
interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  points: number;
  type: 'air' | 'oxygen' | 'pink' | 'purple' | 'yellow' | 'green' | 'orange' | 'mine' | 'treasure' | 'pearl' | 'fish' | 'double' | 'triple' | 'shockwave' | 'magnet' | 'equipment' | 'boss_minion';
  popped: boolean;
  opacity: number;
  horizontalMovement?: number;
  equipmentType?: string;
  fishType?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  type?: 'star' | 'bubble' | 'fish';
}

interface Equipment {
  mask: boolean;
  fins: boolean;
  tank: boolean;
  suit: boolean;
  light: boolean;
}

export default function OceanBubblePop() {
  const router = useRouter();
  const supabase = createClient();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const instructionsSpokenRef = useRef(false);

  const audioManager = useRef<GameAudioManager | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
  
  const [introSpeechComplete, setIntroSpeechComplete] = useState(false);
  const [instructionsSpeechComplete, setInstructionsSpeechComplete] = useState(false);
  const [gameStartSpeechComplete, setGameStartSpeechComplete] = useState(false);
  
  const [userInteracted, setUserInteracted] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const [totalStarsCollected, setTotalStarsCollected] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [oxygenLevel, setOxygenLevel] = useState(100);
  const [showResults, setShowResults] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [poppedBubbles, setPoppedBubbles] = useState(0);
  const [missedBubbles, setMissedBubbles] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [levelMessage, setLevelMessage] = useState('');
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [bubblesRemaining, setBubblesRemaining] = useState(0);
  const [bubblesSpawned, setBubblesSpawned] = useState(0);
  
  const [equipment, setEquipment] = useState<Equipment>({ mask: false, fins: false, tank: false, suit: false, light: false });
  const [savedFish, setSavedFish] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [multiplierTime, setMultiplierTime] = useState(0);
  const [magnetActive, setMagnetActive] = useState(false);
  const [magnetTime, setMagnetTime] = useState(0);
  const [showBossLevel, setShowBossLevel] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [freedCreatures, setFreedCreatures] = useState<string[]>([]);
  const [checkpointBubbles, setCheckpointBubbles] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioManager.current = GameAudioManager.getInstance();
      setIsMobile(window.innerWidth < 640);
    }
  }, []);

  const initializeAudio = async () => {
    if (!audioManager.current || audioInitialized) return;
    try {
      await audioManager.current.forceInitialize();
      setAudioInitialized(true);
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
    }
  };

  const startIntroSpeech = async () => {
    setUserInteracted(true);
    await initializeAudio();
    audioManager.current?.pararTodos();
    
    audioManager.current?.falarMila("Olá! Eu sou a Mila! Vamos estourar bolhas e salvar o mundo marinho!", () => {
      setTimeout(() => {
        audioManager.current?.falarMila("Será uma aventura incrível no fundo do oceano!", () => {
          setIntroSpeechComplete(true);
        });
      }, 1500);
    });
  };

  const startGameInstructions = () => {
    audioManager.current?.pararTodos();
    setTimeout(() => {
      audioManager.current?.falarMila("Vamos começar! Estoure as bolhas para ganhar pontos!", () => {
        setGameStartSpeechComplete(true);
      });
    }, 300);
  };

  useEffect(() => {
    if (currentScreen === 'title' && !introSpeechComplete && !userInteracted) {
      const timeout = setTimeout(() => setUserInteracted(true), 5000);
      return () => clearTimeout(timeout);
    }
  }, [currentScreen, introSpeechComplete, userInteracted]);

  useEffect(() => {
    if (currentScreen === 'instructions' && audioManager.current && !instructionsSpokenRef.current) {
      instructionsSpokenRef.current = true;
      audioManager.current?.pararTodos();
      setTimeout(() => {
        audioManager.current?.falarMila("Vou te ensinar como jogar! Estoure as bolhas clicando nelas!", () => {
          setTimeout(() => {
            audioManager.current?.falarMila("Salve os peixes, evite as bombas e colete equipamentos dourados!", () => {
              setInstructionsSpeechComplete(true);
            });
          }, 1500);
        });
      }, 500);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen === 'game' && audioManager.current && !gameStartSpeechComplete && isPlaying) {
      const timer = setTimeout(() => {
        audioManager.current?.falarMila("Vamos começar! Estoure as bolhas para ganhar pontos!");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, gameStartSpeechComplete, isPlaying]);

  useEffect(() => {
    return () => audioManager.current?.pararTodos();
  }, [currentScreen]);

  const levelConfigs = [
    { level: 1, name: 'Superfície - Bolhas Coloridas', depth: '0-10m', totalBubbles: 100, minePercentage: 0.05, spawnRate: 600, oxygenDrain: 0.3, bgGradient: 'from-cyan-300 to-blue-400', equipment: null, features: ['colored_bubbles']},
    { level: 2, name: 'Águas Rasas - Salvando Peixes', depth: '10-20m', totalBubbles: 110, minePercentage: 0.1, spawnRate: 580, oxygenDrain: 0.4, bgGradient: 'from-blue-400 to-blue-500', equipment: 'mask', features: ['colored_bubbles', 'fish_rescue']},
    { level: 3, name: 'Zona Clara - Multiplicadores', depth: '20-30m', totalBubbles: 120, minePercentage: 0.15, spawnRate: 560, oxygenDrain: 0.5, bgGradient: 'from-blue-500 to-blue-600', equipment: 'fins', features: ['colored_bubbles', 'fish_rescue', 'multipliers']},
    { level: 4, name: 'Águas Médias - Power-ups', depth: '30-40m', totalBubbles: 130, minePercentage: 0.2, spawnRate: 540, oxygenDrain: 0.6, bgGradient: 'from-blue-600 to-blue-700', equipment: 'tank', features: ['colored_bubbles', 'fish_rescue', 'multipliers', 'powerups']},
    { level: 5, name: 'Zona Mista - Todos Elementos', depth: '40-50m', totalBubbles: 140, minePercentage: 0.25, spawnRate: 520, oxygenDrain: 0.7, bgGradient: 'from-blue-700 to-indigo-700', equipment: 'suit', features: ['all']},
    { level: 6, name: 'Correntes Marinhas', depth: '50-60m', totalBubbles: 150, minePercentage: 0.3, spawnRate: 500, oxygenDrain: 0.8, bgGradient: 'from-indigo-700 to-indigo-800', equipment: 'light', features: ['all', 'currents']},
    { level: 7, name: 'Zona Escura', depth: '60-70m', totalBubbles: 140, minePercentage: 0.35, spawnRate: 480, oxygenDrain: 0.9, bgGradient: 'from-indigo-800 to-indigo-900', equipment: null, features: ['all', 'darkness']},
    { level: 8, name: 'Águas Profundas', depth: '70-80m', totalBubbles: 130, minePercentage: 0.4, spawnRate: 460, oxygenDrain: 1.0, bgGradient: 'from-indigo-900 to-purple-900', equipment: null, features: ['all', 'predators']},
    { level: 9, name: 'Zona Abissal', depth: '80-90m', totalBubbles: 120, minePercentage: 0.45, spawnRate: 440, oxygenDrain: 1.1, bgGradient: 'from-purple-900 to-black', equipment: null, features: ['all', 'extreme']},
    { level: 10, name: 'Portal do Abismo', depth: '90-100m', totalBubbles: 100, minePercentage: 0.5, spawnRate: 420, oxygenDrain: 1.2, bgGradient: 'from-black to-purple-950', equipment: null, features: ['all', 'portal']},
    { level: 11, name: 'Reino do Senhor dos Mares', depth: 'ABISMO', totalBubbles: 150, minePercentage: 0.3, spawnRate: 400, oxygenDrain: 0, bgGradient: 'from-purple-950 via-black to-red-950', equipment: null, features: ['boss_battle']}
  ];

  const coloredBubbles = {
    air: { color: '#E0F2FE', points: 5, size: 40 }, oxygen: { color: '#60A5FA', points: 15, size: 55 },
    pink: { color: '#F9A8D4', points: 20, size: 45 }, purple: { color: '#C084FC', points: 25, size: 45 },
    yellow: { color: '#FDE047', points: 30, size: 45 }, green: { color: '#86EFAC', points: 35, size: 45 },
    orange: { color: '#FB923C', points: 40, size: 45 }, treasure: { color: '#FFD700', points: 50, size: 50 },
    pearl: { color: '#FFF0F5', points: 100, size: 40 }
  };
  
  const comboPhrases = ["Uhuuuu!", "Incrível!", "Mandou bem!", "Continue assim!", "Que demais!"];

  const startActivity = () => {
    setCurrentScreen('game');
    setIsPlaying(true);
    setCurrentLevel(1);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setBubbles([]);
    setParticles([]);
    setOxygenLevel(100);
    setShowResults(false);
    setPoppedBubbles(0);
    setMissedBubbles(0);
    setCompletedLevels([]);
    setBubblesSpawned(0);
    setBubblesRemaining(levelConfigs[0].totalBubbles);
    setSavedFish(0);
    setMultiplier(1);
    setEquipment({ mask: false, fins: false, tank: false, suit: false, light: false });
    setCheckpointBubbles(0);
    setLevelCompleted(false);
    setGameStartSpeechComplete(false);
  };

  const createBubble = () => { /* ...código sem alteração... */ };
  const updateBubbles = () => { /* ...código sem alteração... */ };
  const createParticles = (x: number, y: number, color: string, type: string = 'normal') => { /* ...código sem alteração... */ };
  const updateParticles = () => { /* ...código sem alteração... */ };
  const playPopSound = (type: Bubble['type']) => { /* ...código sem alteração... */ };

  const popBubble = (bubble: Bubble, x: number, y: number) => {
    if (bubble.popped) return;
  
    setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, popped: true } : b));
    playPopSound(bubble.type);
  
    if (bubble.type === 'mine') {
      createParticles(x, y, bubble.color, 'explosion');
      audioManager.current?.falarMila("Ops! Você tocou numa bomba!");
      if (equipment.suit) {
        setEquipment(prev => ({ ...prev, suit: false }));
        setLevelMessage('⚠️ Proteção do Traje Perdida!');
        setTimeout(() => setLevelMessage(''), 2000);
      } else {
        resetLevel();
        return;
      }
    } else if (bubble.type === 'equipment') {
      createParticles(x, y, '#FFD700', 'shockwave');
      setEquipment(prev => ({ ...prev, [bubble.equipmentType || '']: true }));
      const equipmentNames: {[key: string]: string} = { 'mask': 'máscara', 'fins': 'nadadeiras', 'tank': 'tanque de oxigênio', 'suit': 'roupa de mergulho', 'light': 'lanterna' };
      const equipmentName = equipmentNames[bubble.equipmentType || ''] || 'equipamento';
      setLevelMessage(`🎯 ${equipmentName.toUpperCase()} Coletado!`);
      audioManager.current?.falarMila(`Coletou ${equipmentName}!`);
      setTimeout(() => setLevelMessage(''), 2000);
      checkForBossUnlock();
    } else if (bubble.type === 'fish') {
      createParticles(x, y, '#00CED1', 'fish');
      setSavedFish(prev => prev + 1);
      setScore(prev => prev + (bubble.points * multiplier));
      setPoppedBubbles(prev => prev + 1);
      setCombo(prev => prev + 1);
      setLevelMessage(`🐠 Peixe Salvo! +${bubble.points * multiplier}`);
      const fishNames: {[key: string]: string} = { '🐠': 'peixe tropical', '🐟': 'peixinho dourado', '🐡': 'baiacu', '🦈': 'tubarão', '🐙': 'polvo' };
      const fishName = fishNames[bubble.fishType || '🐠'] || 'peixe';
      audioManager.current?.falarMila(`Você salvou um ${fishName}! Muito bem!`);
      setTimeout(() => setLevelMessage(''), 1500);
    } else if (bubble.type === 'double') {
      createParticles(x, y, bubble.color, 'shockwave');
      setMultiplier(2);
      setMultiplierTime(10);
      setLevelMessage('✨ PONTOS x2 ATIVADO!');
      audioManager.current?.falarMila("Pontos em dobro!");
      setTimeout(() => setLevelMessage(''), 2000);
    } else if (bubble.type === 'triple') {
      createParticles(x, y, bubble.color, 'shockwave');
      setMultiplier(3);
      setMultiplierTime(7);
      setLevelMessage('🌟 PONTOS x3 ATIVADO!');
      audioManager.current?.falarMila("Pontos em triplo!");
      setTimeout(() => setLevelMessage(''), 2000);
    } else if (bubble.type === 'shockwave') {
      createParticles(x, y, bubble.color, 'shockwave');
      popAllNearbyBubbles(x, y, 150);
      setLevelMessage('💥 ONDA DE CHOQUE!');
      audioManager.current?.falarMila("Onda de choque!");
      setTimeout(() => setLevelMessage(''), 1500);
    } else if (bubble.type === 'magnet') {
      createParticles(x, y, bubble.color, 'shockwave');
      setMagnetActive(true);
      setMagnetTime(8);
      setLevelMessage('🧲 ÍMÃ ATIVADO!');
      audioManager.current?.falarMila("Ímã ativado!");
      setTimeout(() => setLevelMessage(''), 2000);
    } else {
      createParticles(x, y, bubble.color);
      setPoppedBubbles(prev => prev + 1);
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => Math.max(max, newCombo));
        if (newCombo >= 15 && newCombo % 5 === 0) {
          const randomPhrase = comboPhrases[Math.floor(Math.random() * comboPhrases.length)];
          audioManager.current?.falarMila(randomPhrase);
        }
        return newCombo;
      });
      const finalPoints = Math.round(bubble.points * multiplier);
      setScore(prev => prev + finalPoints);
      if (bubble.type === 'oxygen') {
        setOxygenLevel(prev => Math.min(100, prev + 10));
      } else if (bubble.type === 'pearl') {
        setOxygenLevel(prev => Math.min(100, prev + 20));
        audioManager.current?.falarMila("Pérola rara!");
      } else {
        setOxygenLevel(prev => Math.min(100, prev + 3));
      }
    }
  };

  const popAllNearbyBubbles = (x: number, y: number, radius: number) => { /* ...código sem alteração... */ };
  const resetLevel = () => { /* ...código sem alteração... */ };
  const checkForBossUnlock = () => { /* ...código sem alteração... */ };
  const createCelebrationBurst = () => { /* ...código sem alteração... */ };
  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => { /* ...código sem alteração... */ };
  
  useEffect(() => { /* gameLoop, código sem alteração... */ }, [isPlaying, magnetActive]);
  useEffect(() => { /* spawnInterval, código sem alteração... */ }, [isPlaying, currentLevel, bubblesSpawned, levelCompleted]);
  useEffect(() => { /* multiplierTime, código sem alteração... */ }, [multiplierTime]);
  useEffect(() => { /* magnetTime, código sem alteração... */ }, [magnetTime]);
  useEffect(() => { /* oxygenDrain, código sem alteração... */ }, [isPlaying, currentLevel, equipment.tank]);

  useEffect(() => {
    if (!isPlaying || levelCompleted) return;
    const config = levelConfigs[currentLevel - 1];
    
    if (bubblesSpawned >= config.totalBubbles && bubbles.filter(b => !b.popped).length === 0) {
      setLevelCompleted(true);
      
      if (currentLevel === 11) {
        setBossDefeated(true);
        victorySequence();
      } else if (currentLevel < 10) {
        setCompletedLevels(prev => [...prev, currentLevel]);
        setLevelMessage(`🌊 ${config.name} Completo!`);
        setShowLevelTransition(true);
        createCelebrationBurst();
        audioManager.current?.falarMila(`Você é fera! Terminou a fase ${currentLevel}!`);
        
        setTimeout(() => {
          const nextLevel = currentLevel + 1;
          const nextConfig = levelConfigs[nextLevel - 1];
          setCurrentLevel(nextLevel);
          setShowLevelTransition(false);
          setBubbles([]);
          setParticles([]);
          setCombo(0);
          setBubblesSpawned(0);
          setBubblesRemaining(nextConfig.totalBubbles);
          setOxygenLevel(100);
          setCheckpointBubbles(0);
          setMultiplier(1);
          setMagnetActive(false);
          setLevelCompleted(false);
          setIsPlaying(true);
          setGameStartSpeechComplete(false);
          audioManager.current?.falarMila(`Agora na fase ${nextLevel}!`);
        }, 3000);
      } else if (currentLevel === 10) {
          endGame();
      }
    }
  }, [isPlaying, currentLevel, bubblesSpawned, bubbles, showBossLevel, levelCompleted]);

  const victorySequence = () => { /* ...código sem alteração... */ };
  const endGame = (bossVictory = false) => { /* ...código sem alteração... */ };
  const handleSaveSession = async () => { /* ...código sem alteração... */ };
  
  const voltarInicio = () => {
    setCurrentScreen('title');
    setShowResults(false);
    setIsPlaying(false);
    setBubbles([]);
    setParticles([]);
    setFreedCreatures([]);
    setBossDefeated(false);
    setShowBossLevel(false);
    instructionsSpokenRef.current = false;
    setIntroSpeechComplete(false);
    setInstructionsSpeechComplete(false);
    setGameStartSpeechComplete(false);
    setUserInteracted(false);
  };
  
  const toggleAudio = () => {
    if (audioManager.current) {
      const newState = audioManager.current.toggleAudio();
      setAudioEnabled(newState);
      if (newState) {
        audioManager.current.falarMila("Áudio ligado!");
      }
    }
  };

  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-cyan-300 via-blue-400 to-blue-600 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute animate-pulse" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, animationDuration: `${3 + Math.random() * 2}s` }}>
            <Star className="w-6 h-6 text-white opacity-30" fill="currentColor" />
          </div>
        ))}
      </div>
      <button onClick={toggleAudio} className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors">
        {audioEnabled ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
      </button>
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4 animate-bounce-slow">
          <Image src="/images/mascotes/mila/Mila_roupa_mergulho.png" alt="Mila" width={400} height={400} className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl" priority />
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">Oceano de Bolhas</h1>
        <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-6 drop-shadow-md">🌊 Salve o reino oceânico! 🐠</p>
        
        {(totalStarsCollected > 0 || bestScore > 0) && (
          <div className="bg-white/80 rounded-2xl p-4 mb-6 shadow-xl">
            <div className="flex items-center gap-4">
              {totalStarsCollected > 0 && (
                <div className="flex items-center gap-2"><Star className="w-6 h-6 text-yellow-500" fill="currentColor" /><span className="font-bold text-blue-800">{totalStarsCollected} estrelas</span></div>
              )}
              {bestScore > 0 && (
                <div className="flex items-center gap-2"><Trophy className="w-6 h-6 text-yellow-600" /><span className="font-bold text-blue-800">Recorde: {bestScore}</span></div>
              )}
            </div>
          </div>
        )}
        
        {!userInteracted && (
          <button onClick={startIntroSpeech} className="flex items-center gap-2 text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full px-8 py-4 shadow-xl transition-all duration-300 hover:scale-110 animate-pulse">
            <Play className="w-6 h-6" /> Ouvir Mila
          </button>
        )}
        
        {introSpeechComplete && (
          <button onClick={() => setCurrentScreen('instructions')} className="text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1 animate-pulse">
            Começar Aventura
          </button>
        )}
        
        {userInteracted && !introSpeechComplete && (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4 font-medium">A Mila está falando...</p>
          </div>
        )}
      </div>
    </div>
  );

  const InstructionsScreen = () => {
    const [instructionsStarted, setInstructionsStarted] = useState(false);
    const startInstructionsSpeech = () => {
      setInstructionsStarted(true);
      audioManager.current?.pararTodos();
      setTimeout(() => {
        audioManager.current?.falarMila("Vou te ensinar como jogar! Estoure as bolhas clicando nelas!", () => {
          setTimeout(() => {
            audioManager.current?.falarMila("Salve os peixes, evite as bombas e colete equipamentos dourados!", () => {
              setInstructionsSpeechComplete(true);
            });
          }, 1500);
        });
      }, 300);
    };
    
    return (
      <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-300 via-cyan-300 to-teal-300">
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-blue-600">Como Jogar</h2>
          <div className="text-base sm:text-lg text-gray-700 space-y-4 sm:space-y-6 mb-6 text-left">
            <p className="flex items-center gap-4"><span className="text-3xl sm:text-4xl">🫧</span><span><b>Estoure as bolhas</b> clicando nelas!</span></p>
            <p className="flex items-center gap-4"><span className="text-3xl sm:text-4xl">🐠</span><span><b>Salve os peixes</b> presos em bolhas!</span></p>
            <p className="flex items-center gap-4"><span className="text-3xl sm:text-4xl">💣</span><span><b>Evite as bombas</b> para não reiniciar!</span></p>
            <p className="flex items-center gap-4"><span className="text-3xl sm:text-4xl">🤿</span><span><b>Colete os equipamentos</b> dourados!</span></p>
            <p className="flex items-center gap-4"><span className="text-3xl sm:text-4xl">💨</span><span><b>Fique de olho no oxigênio!</b></span></p>
          </div>
          {!instructionsStarted && (
            <button onClick={startInstructionsSpeech} className="flex items-center justify-center gap-2 w-full text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full px-8 py-4 shadow-xl transition-all duration-300 hover:scale-105">
              <Play className="w-6 h-6" /> Ouvir as Instruções
            </button>
          )}
          {instructionsStarted && !instructionsSpeechComplete && (
            <div className="flex flex-col items-center justify-center h-24">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-600 mt-4 font-medium">Mila está explicando...</p>
            </div>
          )}
          {instructionsSpeechComplete && (
            <button onClick={startActivity} className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform animate-pulse">
              Vamos jogar! 🚀
            </button>
          )}
        </div>
      </div>
    );
  };
  
  const GameScreen = () => (
      <div className="min-h-screen bg-gray-50">
          <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
              <div className="max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center justify-between h-16">
                      <button onClick={() => setCurrentScreen('title')} className="flex items-center text-teal-600 hover:text-teal-700 transition-colors">
                          <ChevronLeft className="h-6 w-6" />
                          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                      </button>
                      <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">🌊<span>Oceano de Bolhas</span></h1>
                      <div className="flex items-center gap-2">
                          <button onClick={toggleAudio} className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                          </button>
                          {showResults ? (
                              <button onClick={handleSaveSession} disabled={salvando} className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${!salvando ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                                  <Save size={18} />
                                  <span className="hidden sm:inline">{salvando ? 'Salvando...' : 'Salvar'}</span>
                              </button>
                          ) : ( <div className="w-16"></div> )}
                      </div>
                  </div>
              </div>
          </header>
          <main className="p-2 sm:p-6 max-w-7xl mx-auto w-full">
              {!showResults ? (
                  <div className="space-y-4">
                      <div className="bg-white rounded-xl shadow-lg p-2 sm:p-4">
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                              <div><div className="text-base sm:text-xl font-bold text-indigo-800">Nv.{currentLevel}</div><div className="text-xs text-indigo-600">Nível</div></div>
                              <div><div className="text-base sm:text-xl font-bold text-blue-800">{score}</div><div className="text-xs text-blue-600">Pontos</div></div>
                              <div><div className="text-base sm:text-xl font-bold text-orange-800">x{combo}</div><div className="text-xs text-orange-600">Combo</div></div>
                              <div><div className="text-base sm:text-xl font-bold text-green-800">{savedFish}</div><div className="text-xs text-green-600">🐠 Salvos</div></div>
                              <div><div className="text-base sm:text-xl font-bold text-purple-800">{bubblesRemaining < 0 ? 0 : bubblesRemaining}</div><div className="text-xs text-purple-600">Faltam</div></div>
                              <div><div className={`text-base sm:text-xl font-bold ${multiplier > 1 ? 'text-yellow-500 animate-pulse' : 'text-gray-800'}`}>x{multiplier}</div><div className="text-xs text-gray-600">Multi</div></div>
                          </div>
                      </div>
                      <div className="bg-white rounded-lg shadow p-2 flex justify-center gap-3">
                        <span className={`text-2xl ${equipment.mask ? '' : 'opacity-30'}`}>🥽</span><span className={`text-2xl ${equipment.fins ? '' : 'opacity-30'}`}>🦶</span>
                        <span className={`text-2xl ${equipment.tank ? '' : 'opacity-30'}`}>🤿</span><span className={`text-2xl ${equipment.suit ? '' : 'opacity-30'}`}>👔</span>
                        <span className={`text-2xl ${equipment.light ? '' : 'opacity-30'}`}>🔦</span>
                      </div>
                      {currentLevel !== 11 && (
                        <div className="bg-white rounded-lg shadow p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">💨 Oxigênio:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                              <div className={`h-full transition-all duration-300 ${oxygenLevel > 60 ? 'bg-blue-500' : oxygenLevel > 30 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} style={{ width: `${oxygenLevel}%` }} />
                            </div>
                            <span className="text-sm font-bold">{Math.round(oxygenLevel)}%</span>
                          </div>
                        </div>
                      )}
                      <div ref={gameAreaRef} className={`relative bg-gradient-to-b ${levelConfigs[currentLevel - 1].bgGradient} rounded-xl shadow-lg overflow-hidden cursor-crosshair`} style={{ height: isMobile ? '450px' : '500px' }} onMouseDown={handleInteraction} onTouchStart={handleInteraction}>
                          {/* ... Jogo renderiza aqui ... */}
                      </div>
                  </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                  {/* ... Tela de Resultados ... */}
                </div>
              )}
          </main>
      </div>
  );

  if (currentScreen === 'title') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
}
