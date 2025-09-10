'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Play, RotateCcw, Trophy, Star, Sparkles, Heart, Zap, Gift, Award, Crown, Medal, Target, Flame } from 'lucide-react';
import './auditory-memory.css';

interface GameStats {
  level: number;
  score: number;
  highScore: number;
  combo: number;
  lives: number;
  totalStars: number;
  perfectRounds: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

interface FloatingReward {
  id: number;
  type: 'star' | 'heart' | 'gem' | 'coin' | 'trophy';
  x: number;
  y: number;
}

const AuditoryMemoryGame: React.FC = () => {
  // Controle de Telas
  const [currentScreen, setCurrentScreen] = useState<'titleScreen' | 'instructions' | 'game'>('titleScreen');
  
  // Estados do Jogo
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'listening' | 'success' | 'fail'>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentNote, setCurrentNote] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  
  // NOVOS ESTADOS DE GAMIFICAÇÃO
  const [floatingRewards, setFloatingRewards] = useState<FloatingReward[]>([]);
  const [showComboFire, setShowComboFire] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [starBurst, setStarBurst] = useState(false);
  const [correctNoteStreak, setCorrectNoteStreak] = useState(0);
  const [showPerfectBonus, setShowPerfectBonus] = useState(false);
  
  const [stats, setStats] = useState<GameStats>({
    level: 1,
    score: 0,
    highScore: 0,
    combo: 0,
    lives: 3,
    totalStars: 0,
    perfectRounds: 0
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first_star', name: 'Primeira Estrela!', description: 'Ganhe sua primeira estrela', icon: <Star className="w-6 h-6" />, unlocked: false },
    { id: 'combo_5', name: 'Combo Master!', description: 'Faça 5 acertos seguidos', icon: <Flame className="w-6 h-6" />, unlocked: false },
    { id: 'level_5', name: 'Explorador!', description: 'Chegue ao nível 5', icon: <Trophy className="w-6 h-6" />, unlocked: false },
    { id: 'perfect_3', name: 'Perfeição!', description: '3 rodadas perfeitas', icon: <Crown className="w-6 h-6" />, unlocked: false },
    { id: '100_points', name: 'Centurião!', description: 'Marque 100 pontos', icon: <Medal className="w-6 h-6" />, unlocked: false },
    { id: 'survivor', name: 'Sobrevivente!', description: 'Complete 10 níveis', icon: <Award className="w-6 h-6" />, unlocked: false }
  ]);

  // Mensagens motivacionais variadas
  const motivationalMessages = [
    "Incrível! 🌟", "Você é demais! 🎉", "Fantástico! 🚀", "Show de bola! ⭐",
    "Arrasou! 💫", "Sensacional! 🏆", "Maravilhoso! 🌈", "Excelente! 🎯",
    "Brilhante! ✨", "Espetacular! 🎪", "Genial! 🧠", "Campeão! 🥇",
    "Super! 💪", "Wow! 🤩", "Perfeito! 💯", "Mandou bem! 👏"
  ];

  const comboMessages = {
    3: "Combo x3! 🔥", 5: "Super Combo! 🔥🔥", 7: "Mega Combo! 🔥🔥🔥",
    10: "ULTRA COMBO! 🌟🔥🌟", 15: "LENDÁRIO! 👑🔥👑"
  };

  // LÓGICA DE PROGRESSÃO
  const [sequenceLength, setSequenceLength] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(800);

  const audioContextRef = useRef<AudioContext | null>(null);
  const isAudioInitialized = useRef(false);
  const rewardIdCounter = useRef(0);

  const buttons = [
    { color: 'btn-red', emoji: '🎵', freq: 261.63, name: 'DÓ' },
    { color: 'btn-orange', emoji: '🎶', freq: 293.66, name: 'RÉ' },
    { color: 'btn-yellow', emoji: '🎼', freq: 329.63, name: 'MI' },
    { color: 'btn-green', emoji: '🎹', freq: 392.00, name: 'FÁ' },
    { color: 'btn-blue', emoji: '🎸', freq: 440.00, name: 'SOL' },
    { color: 'btn-purple', emoji: '🎺', freq: 523.25, name: 'LÁ' }
  ];

  // Sistema de Partículas/Recompensas Flutuantes
  const createFloatingReward = useCallback((type: FloatingReward['type']) => {
    const newReward: FloatingReward = {
      id: rewardIdCounter.current++,
      type,
      x: Math.random() * 80 + 10, // 10% a 90% da largura
      y: Math.random() * 30 + 35  // 35% a 65% da altura
    };
    
    setFloatingRewards(prev => [...prev, newReward]);
    
    // Remove após animação
    setTimeout(() => {
      setFloatingRewards(prev => prev.filter(r => r.id !== newReward.id));
    }, 2000);
  }, []);

  // Função para criar múltiplas estrelas
  const createStarBurst = useCallback((count: number = 5) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        createFloatingReward('star');
      }, i * 100);
    }
  }, [createFloatingReward]);

  // Verifica e desbloqueia conquistas
  const checkAchievements = useCallback((newStats: GameStats) => {
    const newAchievements = [...achievements];
    let unlocked: Achievement | null = null;

    // Primeira estrela
    if (!newAchievements[0].unlocked && newStats.totalStars >= 1) {
      newAchievements[0].unlocked = true;
      unlocked = newAchievements[0];
    }
    
    // Combo 5
    if (!newAchievements[1].unlocked && newStats.combo >= 5) {
      newAchievements[1].unlocked = true;
      unlocked = newAchievements[1];
    }
    
    // Nível 5
    if (!newAchievements[2].unlocked && newStats.level >= 5) {
      newAchievements[2].unlocked = true;
      unlocked = newAchievements[2];
    }
    
    // 3 rodadas perfeitas
    if (!newAchievements[3].unlocked && newStats.perfectRounds >= 3) {
      newAchievements[3].unlocked = true;
      unlocked = newAchievements[3];
    }
    
    // 100 pontos
    if (!newAchievements[4].unlocked && newStats.score >= 100) {
      newAchievements[4].unlocked = true;
      unlocked = newAchievements[4];
    }
    
    // Nível 10
    if (!newAchievements[5].unlocked && newStats.level >= 10) {
      newAchievements[5].unlocked = true;
      unlocked = newAchievements[5];
    }

    setAchievements(newAchievements);
    
    if (unlocked) {
      setUnlockedAchievement(unlocked);
      createStarBurst(7);
      setTimeout(() => setUnlockedAchievement(null), 3000);
    }
  }, [achievements, createStarBurst]);

  // Inicialização do AudioContext
  const initializeAudio = useCallback(() => {
    if (!isAudioInitialized.current && typeof window !== 'undefined') {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        isAudioInitialized.current = true;
      } catch (error) {
        console.error('Erro ao inicializar AudioContext:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('memoriaSonoraHighScore');
      const savedStars = localStorage.getItem('memoriaSonoraTotalStars');
      if (savedHighScore) {
        setStats(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
      }
      if (savedStars) {
        setStats(prev => ({ ...prev, totalStars: parseInt(savedStars) }));
      }
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playNote = useCallback((frequency: number, duration: number = 400, isSuccess: boolean = false) => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = isSuccess ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      
      // Nota de sucesso tem um pequeno vibrato
      if (isSuccess) {
        const vibrato = audioContextRef.current.createOscillator();
        vibrato.frequency.value = 5;
        const vibratoGain = audioContextRef.current.createGain();
        vibratoGain.gain.value = 10;
        vibrato.connect(vibratoGain);
        vibratoGain.connect(oscillator.frequency);
        vibrato.start();
        vibrato.stop(audioContextRef.current.currentTime + duration / 1000);
      }
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
    } catch (error) {
      console.error('Erro ao tocar nota:', error);
    }
  }, [soundEnabled]);

  // Som de recompensa
  const playRewardSound = useCallback(() => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    const notes = [523.25, 659.25, 783.99]; // Acorde maior alegre
    notes.forEach((freq, i) => {
      setTimeout(() => playNote(freq, 200, true), i * 50);
    });
  }, [soundEnabled, playNote]);

  const generateSequence = useCallback(() => {
    return Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * 6));
  }, [sequenceLength]);
  
  const playSequence = useCallback(async (seq: number[]) => {
    setIsPlaying(true);
    setGameState('listening');
    setUserSequence([]);
    setCorrectNoteStreak(0);
    
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
  }, [playNote, buttons, playbackSpeed]);
  
  const startRound = useCallback(() => {
    initializeAudio();
    const newSequence = generateSequence();
    setSequence(newSequence);
    setUserSequence([]);
    setCorrectNoteStreak(0);
    playSequence(newSequence);
  }, [generateSequence, playSequence, initializeAudio]);
  
  const handleNoteClick = useCallback((noteIndex: number) => {
    if (gameState !== 'playing' || isPlaying) return;
    
    // Feedback visual
    setActiveButton(noteIndex);
    setTimeout(() => setActiveButton(null), 300);
    
    const newUserSequence = [...userSequence, noteIndex];
    setUserSequence(newUserSequence);

    // Verifica se errou
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      handleFailure();
      return;
    }

    // ACERTOU UMA NOTA! CELEBRAÇÃO!
    playNote(buttons[noteIndex].freq, 300, true);
    setCorrectNoteStreak(prev => prev + 1);
    
    // Cria recompensa visual para CADA acerto
    createFloatingReward('star');
    if (Math.random() > 0.7) createFloatingReward('heart');
    if (Math.random() > 0.8) createFloatingReward('gem');
    
    // Adiciona estrelas ao total
    const newTotalStars = stats.totalStars + 1;
    setStats(prev => ({ ...prev, totalStars: newTotalStars }));
    localStorage.setItem('memoriaSonoraTotalStars', newTotalStars.toString());
    
    // Mensagem motivacional a cada 2 notas corretas
    if (correctNoteStreak > 0 && correctNoteStreak % 2 === 0) {
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setMotivationalMessage(randomMessage);
      setTimeout(() => setMotivationalMessage(''), 1500);
    }

    // Verifica se completou a sequência
    if (newUserSequence.length === sequence.length) {
      handleSuccess();
    }
  }, [gameState, isPlaying, userSequence, sequence, playNote, buttons, stats.totalStars, correctNoteStreak, createFloatingReward, motivationalMessages]);

  const handleSuccess = useCallback(() => {
    setGameState('success');
    setShowSuccess(true);
    
    // EXPLOSÃO DE RECOMPENSAS!
    playRewardSound();
    createStarBurst(10);
    
    // Bônus perfeito se não errou nenhuma vez
    const isPerfect = stats.lives === 3;
    if (isPerfect) {
      setShowPerfectBonus(true);
      setTimeout(() => setShowPerfectBonus(false), 2000);
      createFloatingReward('trophy');
    }
    
    // Calcula pontuação com bônus
    let points = sequenceLength * 10;
    if (isPerfect) points *= 1.5; // 50% de bônus por rodada perfeita
    if (stats.combo >= 5) points *= 1.2; // 20% de bônus por combo alto
    
    const newScore = stats.score + Math.floor(points);
    const newHighScore = Math.max(newScore, stats.highScore);
    const newLevel = stats.level + 1;
    const newCombo = stats.combo + 1;
    const newPerfectRounds = isPerfect ? stats.perfectRounds + 1 : stats.perfectRounds;
    
    // Atualiza estatísticas
    const newStats = {
      ...stats,
      score: newScore,
      highScore: newHighScore,
      level: newLevel,
      combo: newCombo,
      perfectRounds: newPerfectRounds
    };
    
    setStats(newStats);
    localStorage.setItem('memoriaSonoraHighScore', newHighScore.toString());
    
    // Verifica conquistas
    checkAchievements(newStats);
    
    // Mensagens especiais de combo
    if (comboMessages[newCombo as keyof typeof comboMessages]) {
      setMotivationalMessage(comboMessages[newCombo as keyof typeof comboMessages]);
      setShowComboFire(true);
      setTimeout(() => {
        setMotivationalMessage('');
        setShowComboFire(false);
      }, 2000);
    }
    
    // Progressão de dificuldade
    if (newLevel <= 5) {
      setSequenceLength(newLevel);
      setPlaybackSpeed(800);
    } else if (newLevel <= 8) {
      const phase2Level = newLevel - 5;
      setSequenceLength(phase2Level * 2);
      setPlaybackSpeed(650);
    } else {
      setSequenceLength(Math.min(20, 6 + Math.floor((newLevel - 8) / 2)));
      setPlaybackSpeed(Math.max(400, 650 - (newLevel - 8) * 20));
    }

    setTimeout(() => {
      setShowSuccess(false);
      startRound();
    }, 2000);
  }, [stats, sequenceLength, startRound, playRewardSound, createStarBurst, createFloatingReward, checkAchievements]);

  const handleFailure = useCallback(() => {
    setGameState('fail');
    setShowError(true);
    setCorrectNoteStreak(0);
    
    const newLives = stats.lives - 1;
    setStats(prev => ({ ...prev, lives: newLives, combo: 0 }));
    
    if (newLives <= 0) {
      setTimeout(() => {
        alert(`Fim de Jogo! 🏆\n\nNível alcançado: ${stats.level}\nPontuação: ${stats.score}\nEstrelas coletadas: ${stats.totalStars}\n\nVocê foi incrível!`);
        resetGame();
      }, 1000);
    } else {
      setTimeout(() => {
        setShowError(false);
        setUserSequence([]);
        playSequence(sequence);
      }, 2000);
    }
  }, [stats, sequence, playSequence]);

  const resetGame = () => {
    setCurrentScreen('titleScreen');
    setGameState('idle');
    setSequence([]);
    setUserSequence([]);
    setStats(prev => ({
      level: 1,
      score: 0,
      highScore: prev.highScore,
      combo: 0,
      lives: 3,
      totalStars: prev.totalStars,
      perfectRounds: 0
    }));
    setSequenceLength(1);
    setPlaybackSpeed(800);
    setShowSuccess(false);
    setShowError(false);
    setFloatingRewards([]);
    setCorrectNoteStreak(0);
  };

  // TELAS DO JOGO
  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 overflow-hidden">
      {/* Estrelas de fundo animadas */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Star className="w-6 h-6 text-yellow-200 opacity-50" fill="currentColor" />
          </div>
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4 animate-bounce-slow">
          <Image 
            src="/images/mascotes/mila/mila_apoio_resultado.webp" 
            alt="Mila" 
            width={400} 
            height={400} 
            className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl" 
            priority 
          />
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-purple-800 drop-shadow-lg mb-4">
          Memória Sonora
        </h1>
        <p className="text-xl sm:text-2xl text-purple-700 mt-2 mb-4 drop-shadow-md">
          Siga a melodia e teste sua memória!
        </p>
        
        {/* Mostra estatísticas na tela inicial */}
        {stats.totalStars > 0 && (
          <div className="bg-white/80 rounded-2xl p-4 mb-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                <span className="font-bold text-purple-800">{stats.totalStars} estrelas</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <span className="font-bold text-purple-800">Recorde: {stats.highScore}</span>
              </div>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => {
            initializeAudio();
            setCurrentScreen('instructions');
          }} 
          className="text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1"
        >
          Começar Aventura
        </button>
      </div>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-300 via-green-300 to-yellow-300">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-purple-600">Como Jogar</h2>
        <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
          <p className="flex items-center gap-4">
            <span className="text-4xl">🎧</span>
            <span><b>Escute com atenção</b> a sequência de sons.</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🎹</span>
            <span><b>Repita a sequência</b> clicando nos botões na ordem correta.</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">⭐</span>
            <span><b>Ganhe estrelas</b> a cada nota correta!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🏆</span>
            <span><b>Desbloqueie conquistas</b> e bata recordes!</span>
          </p>
        </div>
        
        {/* Mostra conquistas desbloqueadas */}
        <div className="bg-purple-100 p-4 rounded-xl mb-4">
          <h3 className="font-bold text-purple-800 mb-2">Conquistas</h3>
          <div className="grid grid-cols-3 gap-2">
            {achievements.slice(0, 3).map(achievement => (
              <div 
                key={achievement.id}
                className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-yellow-200' : 'bg-gray-200'}`}
              >
                {achievement.icon}
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => setCurrentScreen('game')} 
          className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform"
        >
          Vamos jogar! 🚀
        </button>
      </div>
    </div>
  );
  
  const GameScreen = () => {
    return (
      <div id="game-container" className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 game-container relative overflow-hidden">
        {/* Recompensas Flutuantes */}
        {floatingRewards.map(reward => (
          <div
            key={reward.id}
            className="absolute animate-float-up pointer-events-none z-50"
            style={{ left: `${reward.x}%`, top: `${reward.y}%` }}
          >
            {reward.type === 'star' && <Star className="w-8 h-8 text-yellow-400" fill="currentColor" />}
            {reward.type === 'heart' && <Heart className="w-8 h-8 text-red-500" fill="currentColor" />}
            {reward.type === 'gem' && <Sparkles className="w-8 h-8 text-blue-400" />}
            {reward.type === 'coin' && <Gift className="w-8 h-8 text-yellow-500" />}
            {reward.type === 'trophy' && <Trophy className="w-8 h-8 text-yellow-600" />}
          </div>
        ))}
        
        {/* Mensagem Motivacional */}
        {motivationalMessage && (
          <div className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 z-50 ${showComboFire ? 'animate-bounce' : 'animate-pulse'}`}>
            <div className="bg-yellow-400 text-purple-900 px-8 py-4 rounded-full text-2xl font-bold shadow-2xl">
              {motivationalMessage}
            </div>
          </div>
        )}
        
        {/* Conquista Desbloqueada */}
        {unlockedAchievement && (
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-4">
                {unlockedAchievement.icon}
                <div>
                  <p className="text-xl font-bold">Conquista Desbloqueada!</p>
                  <p className="text-lg">{unlockedAchievement.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Bônus Perfeito */}
        {showPerfectBonus && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="text-6xl font-bold text-yellow-400 animate-ping">
              PERFEITO! 🌟
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Painel de Status com mais informações */}
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-4">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center text-white">
              <div>
                <div className="text-xs opacity-80">NÍVEL</div>
                <div className="text-2xl font-bold">{stats.level}</div>
              </div>
              <div>
                <div className="text-xs opacity-80">PONTOS</div>
                <div className="text-2xl font-bold">{stats.score}</div>
              </div>
              <div>
                <div className="text-xs opacity-80">VIDAS</div>
                <div className="text-2xl">
                  {Array.from({ length: stats.lives }).map((_, i) => (
                    <Heart key={i} className="inline w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs opacity-80">COMBO</div>
                <div className="text-2xl font-bold flex items-center justify-center">
                  {stats.combo > 0 && (
                    <>
                      <Flame className={`w-5 h-5 ${stats.combo >= 5 ? 'text-orange-400' : 'text-yellow-400'}`} />
                      {stats.combo}
                    </>
                  )}
                  {stats.combo === 0 && '-'}
                </div>
              </div>
              <div>
                <div className="text-xs opacity-80">ESTRELAS</div>
                <div className="text-2xl font-bold flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                  {stats.totalStars}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-xs opacity-80">RECORDE</div>
                <div className="text-2xl font-bold">
                  <Trophy className="inline w-5 h-5 text-yellow-500" />
                  {stats.highScore}
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Progresso Visual */}
          {gameState === 'playing' && sequence.length > 0 && (
            <div className="bg-white/20 backdrop-blur rounded-full p-2 mb-4">
              <div className="flex gap-1">
                {sequence.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      index < userSequence.length 
                        ? 'bg-green-400 animate-pulse' 
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Área Principal do Jogo */}
          <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-4">
            {/* Mensagens de Status com Mascotes */}
            <div className="text-center mb-6 min-h-[140px] flex items-center justify-center">
              {gameState === 'idle' && (
                <div className="flex flex-col items-center">
                  <Image 
                    src="/images/mascotes/leo/leo_boas_vindas_resultado.webp" 
                    alt="Leo" 
                    width={100} 
                    height={100} 
                    className="object-contain mb-2 animate-bounce" 
                  />
                  <p className="text-white text-xl font-bold">Clique em COMEÇAR para jogar!</p>
                  <p className="text-yellow-300 text-sm mt-1">Colete estrelas e divirta-se!</p>
                </div>
              )}
              
              {gameState === 'listening' && (
                <div className="flex flex-col items-center">
                  <Image 
                    src="/images/mascotes/mila/mila_apoio_resultado.webp" 
                    alt="Mila" 
                    width={100} 
                    height={100} 
                    className="object-contain mb-2 animate-pulse" 
                  />
                  <p className="text-yellow-300 text-2xl font-bold animate-pulse">
                    🎧 ESCUTE COM ATENÇÃO!
                  </p>
                  <p className="text-white text-sm mt-2">
                    Sequência: {sequence.length} {sequence.length === 1 ? 'nota' : 'notas'}
                  </p>
                </div>
              )}
              
              {gameState === 'playing' && !showSuccess && !showError && (
                <div className="flex flex-col items-center">
                  <Image 
                    src="/images/mascotes/leo/leo_apontando_resultado.webp" 
                    alt="Leo" 
                    width={100} 
                    height={100} 
                    className="object-contain mb-2" 
                  />
                  <p className="text-green-300 text-2xl font-bold">SUA VEZ! REPITA A SEQUÊNCIA!</p>
                  <div className="flex items-center gap-2 mt-2">
                    {Array.from({ length: userSequence.length }).map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 animate-pulse" fill="currentColor" />
                    ))}
                  </div>
                </div>
              )}
              
              {showSuccess && (
                <div className="flex flex-col items-center animate-bounce">
                  <Image 
                    src="/images/mascotes/leo/leo_joinha_resultado.webp" 
                    alt="Leo" 
                    width={120} 
                    height={120} 
                    className="object-contain mb-2" 
                  />
                  <p className="text-green-400 text-3xl font-bold">PERFEITO! 🎉</p>
                  <p className="text-yellow-300 text-xl">+{Math.floor(sequenceLength * 10 * (stats.lives === 3 ? 1.5 : 1))} pontos!</p>
                </div>
              )}
              
              {showError && (
                <div className="flex flex-col items-center">
                  <Image 
                    src="/images/mascotes/leo/leo_surpreso_resultado.webp" 
                    alt="Leo" 
                    width={100} 
                    height={100} 
                    className="object-contain mb-2 animate-shake" 
                  />
                  <p className="text-red-400 text-2xl font-bold">OPS! TENTE NOVAMENTE!</p>
                  <p className="text-white text-sm mt-2">
                    {stats.lives > 0 ? `Vidas restantes: ${stats.lives}` : 'Última chance!'}
                  </p>
                </div>
              )}
            </div>

            {/* Botões Musicais com Melhor Feedback */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {buttons.map((button, index) => (
                <button 
                  key={index} 
                  id={`btn-${index}`} 
                  onClick={() => handleNoteClick(index)} 
                  disabled={gameState !== 'playing' || isPlaying}
                  className={`
                    musical-button ${button.color} 
                    h-24 md:h-28 rounded-2xl 
                    font-bold text-white text-2xl md:text-3xl 
                    flex flex-col items-center justify-center gap-1 
                    shadow-lg transition-all duration-200
                    ${gameState === 'playing' && !isPlaying ? 'hover:scale-105 cursor-pointer hover:rotate-2' : 'cursor-not-allowed opacity-90'}
                    ${(gameState === 'listening' && currentNote === index) ? 'scale-110 ring-4 ring-white animate-pulse shadow-2xl' : ''}
                    ${activeButton === index ? 'scale-125 ring-4 ring-yellow-400 shadow-yellow-400/50 shadow-2xl' : ''}
                    ${gameState !== 'playing' || isPlaying ? 'grayscale-[30%]' : ''}
                  `}
                >
                  <span className="text-3xl">{button.emoji}</span>
                  <span className="text-lg font-bold">{button.name}</span>
                  {activeButton === index && (
                    <Star className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-spin" fill="currentColor" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Conquistas Rápidas */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-3 mb-4">
            <div className="flex justify-center gap-2">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={`p-2 rounded-lg transition-all ${
                    achievement.unlocked 
                      ? 'bg-yellow-400/30 scale-110' 
                      : 'bg-white/10 opacity-50'
                  }`}
                  title={achievement.description}
                >
                  {achievement.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Controle */}
          <div className="flex justify-center gap-3 flex-wrap">
            {gameState === 'idle' && (
              <button 
                onClick={startRound} 
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-lg hover:scale-105 hover:rotate-1 transition-transform shadow-lg flex items-center gap-2"
              >
                <Play className="w-5 h-5" /> COMEÇAR
              </button>
            )}
            
            {gameState === 'playing' && (
              <button 
                onClick={() => playSequence(sequence)} 
                disabled={isPlaying}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-5 h-5" /> OUVIR NOVAMENTE
              </button>
            )}
            
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`${soundEnabled ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gray-500'} text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={resetGame} 
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
            >
              MENU
            </button>
          </div>
        </div>

        {/* Adicione estas animações ao seu arquivo CSS */}
        <style jsx>{`
          @keyframes float-up {
            0% {
              transform: translateY(0) scale(0.5);
              opacity: 0;
            }
            50% {
              transform: translateY(-30px) scale(1.2);
              opacity: 1;
            }
            100% {
              transform: translateY(-60px) scale(0.8);
              opacity: 0;
            }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          .animate-float-up {
            animation: float-up 2s ease-out forwards;
          }
          
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    );
  };

  // Renderização condicional das telas
  if (currentScreen === 'titleScreen') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
};

export default AuditoryMemoryGame;
