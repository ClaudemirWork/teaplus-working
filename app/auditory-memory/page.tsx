'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Play, RotateCcw, Trophy, Star, Sparkles, Heart, Zap, Gift } from 'lucide-react';
import './auditory-memory.css';

interface GameStats {
  level: number;
  score: number;
  highScore: number;
  coins: number;
  combo: number;
  lives: number;
}

const AuditoryMemoryGame: React.FC = () => {
  // Estados do jogo
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'game'>('welcome');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'listening' | 'success' | 'fail'>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentNote, setCurrentNote] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showCombo, setShowCombo] = useState(false);
  const [showTreasure, setShowTreasure] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [coinsRaining, setCoinsRaining] = useState(false);
  
  // Estatísticas
  const [stats, setStats] = useState<GameStats>({
    level: 1,
    score: 0,
    highScore: 0,
    coins: 0,
    combo: 0,
    lives: 3
  });

  // Configuração do jogo
  const [sequenceLength, setSequenceLength] = useState(3);
  const [playbackSpeed, setPlaybackSpeed] = useState(800);
  
  // Referências de áudio
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Cores e frequências dos botões
  const buttons = [
    { color: 'btn-red', emoji: '🎵', freq: 261.63, name: 'DÓ' },
    { color: 'btn-orange', emoji: '🎶', freq: 293.66, name: 'RÉ' },
    { color: 'btn-yellow', emoji: '🎼', freq: 329.63, name: 'MI' },
    { color: 'btn-green', emoji: '🎹', freq: 392.00, name: 'FÁ' },
    { color: 'btn-blue', emoji: '🎸', freq: 440.00, name: 'SOL' },
    { color: 'btn-purple', emoji: '🎺', freq: 523.25, name: 'LÁ' }
  ];

  // Inicializar áudio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Carregar dados salvos
      const savedHighScore = localStorage.getItem('memoriaSonoraHighScore');
      const savedCoins = localStorage.getItem('memoriaSonoraCoins');
      
      if (savedHighScore) {
        setStats(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
      }
      if (savedCoins) {
        setStats(prev => ({ ...prev, coins: parseInt(savedCoins) }));
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Tocar nota musical
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

  // Gerar nova sequência
  const generateSequence = useCallback(() => {
    const newSequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * 6));
    }
    setSequence(newSequence);
    return newSequence;
  }, [sequenceLength]);

  // Tocar sequência
  const playSequence = useCallback(async (seq: number[]) => {
    setIsPlaying(true);
    setGameState('listening');
    
    // Pequena pausa antes de começar
    await new Promise(resolve => setTimeout(resolve, 500));
    
    for (let i = 0; i < seq.length; i++) {
      setCurrentNote(seq[i]);
      
      // Adicionar efeito visual ao botão
      const button = document.getElementById(`btn-${seq[i]}`);
      if (button) {
        button.classList.add('btn-active');
        button.style.transform = 'scale(1.2)';
        button.style.boxShadow = '0 0 30px rgba(255,255,255,0.8)';
      }
      
      playNote(buttons[seq[i]].freq, 400);
      
      await new Promise(resolve => setTimeout(resolve, playbackSpeed));
      
      // Remover efeito visual
      if (button) {
        button.classList.remove('btn-active');
        button.style.transform = '';
        button.style.boxShadow = '';
      }
      
      if (i < seq.length - 1) {
        setCurrentNote(null);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setCurrentNote(null);
    setIsPlaying(false);
    setGameState('playing');
    setUserSequence([]);
  }, [playNote, buttons, playbackSpeed]);

  // Iniciar jogo
  const startGame = useCallback(() => {
    const newSequence = generateSequence();
    setUserSequence([]);
    setShowSuccess(false);
    setShowError(false);
    playSequence(newSequence);
  }, [generateSequence, playSequence]);

  // Criar confete
  const createConfetti = () => {
    setConfettiActive(true);
    const container = document.getElementById('game-container');
    
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'][Math.floor(Math.random() * 4)];
        container?.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
      }, i * 30);
    }
    
    setTimeout(() => setConfettiActive(false), 3000);
  };

  // Criar chuva de moedas
  const createCoinRain = () => {
    setCoinsRaining(true);
    const container = document.getElementById('game-container');
    
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.style.left = Math.random() * 100 + '%';
        coin.style.animationDelay = Math.random() * 0.5 + 's';
        
        coin.onclick = () => {
          setStats(prev => ({ ...prev, coins: prev.coins + 5 }));
          coin.remove();
          
          // Mostrar +5 pontos
          const points = document.createElement('div');
          points.className = 'score-popup';
          points.textContent = '+5';
          points.style.left = coin.style.left;
          points.style.top = coin.getBoundingClientRect().top + 'px';
          container?.appendChild(points);
          setTimeout(() => points.remove(), 2000);
        };
        
        container?.appendChild(coin);
        setTimeout(() => coin.remove(), 2000);
      }, i * 100);
    }
    
    setTimeout(() => setCoinsRaining(false), 3000);
  };

  // Criar baú surpresa
  const createTreasureChest = () => {
    if (showTreasure) return;
    
    setShowTreasure(true);
    const container = document.getElementById('game-container');
    const chest = document.createElement('div');
    chest.className = 'treasure-chest';
    chest.style.right = '20px';
    chest.style.bottom = '100px';
    chest.innerHTML = '🎁';
    chest.style.fontSize = '40px';
    chest.style.display = 'flex';
    chest.style.alignItems = 'center';
    chest.style.justifyContent = 'center';
    
    chest.onclick = () => {
      const rewards = [
        { type: 'coins', value: 100, text: '+100 Moedas!' },
        { type: 'life', value: 1, text: '+1 Vida!' },
        { type: 'score', value: 500, text: '+500 Pontos!' }
      ];
      
      const reward = rewards[Math.floor(Math.random() * rewards.length)];
      
      if (reward.type === 'coins') {
        setStats(prev => ({ ...prev, coins: prev.coins + reward.value }));
      } else if (reward.type === 'life') {
        setStats(prev => ({ ...prev, lives: Math.min(prev.lives + 1, 5) }));
      } else if (reward.type === 'score') {
        setStats(prev => ({ ...prev, score: prev.score + reward.value }));
      }
      
      // Mostrar recompensa
      const rewardText = document.createElement('div');
      rewardText.className = 'score-popup';
      rewardText.textContent = reward.text;
      rewardText.style.right = '20px';
      rewardText.style.bottom = '150px';
      container?.appendChild(rewardText);
      
      createConfetti();
      chest.remove();
      setTimeout(() => rewardText.remove(), 2000);
      setShowTreasure(false);
    };
    
    container?.appendChild(chest);
    setTimeout(() => {
      chest.remove();
      setShowTreasure(false);
    }, 10000);
  };

  // Verificar clique do usuário
  const handleNoteClick = useCallback((noteIndex: number) => {
    if (gameState !== 'playing' || isPlaying) return;
    
    // Efeito visual imediato
    const button = document.getElementById(`btn-${noteIndex}`);
    if (button) {
      button.style.transform = 'scale(1.2) translateY(-5px)';
      button.style.boxShadow = '0 10px 40px rgba(255,255,255,0.5)';
      button.style.filter = 'brightness(1.5)';
    }
    
    playNote(buttons[noteIndex].freq, 300);
    const newUserSequence = [...userSequence, noteIndex];
    setUserSequence(newUserSequence);
    setCurrentNote(noteIndex);
    
    // Remover efeito após animação
    setTimeout(() => {
      if (button) {
        button.style.transform = '';
        button.style.boxShadow = '';
        button.style.filter = '';
      }
      setCurrentNote(null);
    }, 300);
    
    // Verificar se completou a sequência
    if (newUserSequence.length === sequence.length) {
      const isCorrect = newUserSequence.every((note, index) => note === sequence[index]);
      
      setTimeout(() => {
        if (isCorrect) {
          handleSuccess();
        } else {
          handleFailure();
        }
      }, 400);
    }
  }, [gameState, isPlaying, userSequence, sequence, playNote, buttons]);

  // Sucesso
  const handleSuccess = useCallback(() => {
    setGameState('success');
    setShowSuccess(true);
    
    // Calcular pontos
    const basePoints = sequenceLength * 10;
    const comboBonus = stats.combo * 5;
    const totalPoints = (basePoints + comboBonus) * stats.level;
    
    // Atualizar estatísticas
    const newCombo = stats.combo + 1;
    const newScore = stats.score + totalPoints;
    const newHighScore = Math.max(newScore, stats.highScore);
    
    setStats(prev => ({
      ...prev,
      score: newScore,
      highScore: newHighScore,
      combo: newCombo,
      coins: prev.coins + 10
    }));
    
    // Salvar dados
    localStorage.setItem('memoriaSonoraHighScore', newHighScore.toString());
    localStorage.setItem('memoriaSonoraCoins', (stats.coins + 10).toString());
    
    // Efeitos visuais baseados no combo
    if (newCombo >= 10) {
      createCoinRain();
      document.getElementById('game-container')?.classList.add('combo-mode');
    } else if (newCombo >= 5) {
      createConfetti();
      document.getElementById('game-container')?.classList.add('shake-screen');
      setTimeout(() => {
        document.getElementById('game-container')?.classList.remove('shake-screen');
      }, 500);
    } else if (newCombo >= 3) {
      createConfetti();
    }
    
    // Mostrar combo
    if (newCombo >= 3) {
      setShowCombo(true);
      setTimeout(() => setShowCombo(false), 2000);
    }
    
    // Baú surpresa aleatório
    if (Math.random() < 0.3) {
      setTimeout(createTreasureChest, 1000);
    }
    
    // Próximo nível
    setTimeout(() => {
      setShowSuccess(false);
      document.getElementById('game-container')?.classList.remove('combo-mode');
      
      const newLevel = stats.level + 1;
      setStats(prev => ({ ...prev, level: newLevel }));
      
      // Aumentar dificuldade
      if (newLevel % 3 === 0) {
        setSequenceLength(prev => Math.min(prev + 1, 12));
      }
      if (newLevel % 5 === 0) {
        setPlaybackSpeed(prev => Math.max(prev - 50, 400));
      }
      
      startGame();
    }, 2500);
  }, [sequenceLength, stats, startGame]);

  // Falha
  const handleFailure = useCallback(() => {
    setGameState('fail');
    setShowError(true);
    
    // Perder vida
    const newLives = stats.lives - 1;
    setStats(prev => ({ 
      ...prev, 
      lives: newLives,
      combo: 0 
    }));
    
    if (newLives <= 0) {
      // Game Over
      setTimeout(() => {
        alert(`Game Over! 🎮\n\nPontuação Final: ${stats.score}\nMoedas Ganhas: ${stats.coins}`);
        resetGame();
      }, 1000);
    } else {
      // Tentar novamente
      setTimeout(() => {
        setShowError(false);
        playSequence(sequence);
      }, 2000);
    }
  }, [stats, playSequence, sequence]);

  // Resetar jogo
  const resetGame = () => {
    setCurrentScreen('welcome');
    setGameState('idle');
    setSequence([]);
    setUserSequence([]);
    setCurrentNote(null);
    setIsPlaying(false);
    setShowSuccess(false);
    setShowError(false);
    setShowCombo(false);
    setStats(prev => ({
      level: 1,
      score: 0,
      highScore: prev.highScore,
      coins: prev.coins,
      combo: 0,
      lives: 3
    }));
    setSequenceLength(3);
    setPlaybackSpeed(800);
  };

  // Repetir sequência
  const replaySequence = () => {
    if (!isPlaying && gameState === 'playing' && sequence.length > 0) {
      setUserSequence([]);
      playSequence(sequence);
    }
  };

  // Tela de Boas-Vindas
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
          
          {/* Título Animado */}
          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              MEMÓRIA SONORA
            </h1>
            <p className="text-2xl text-orange-500 font-bold mt-2">Desafio Musical Épico!</p>
          </div>

          {/* Mascotes */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="relative">
              <Image 
                src="/images/mascotes/leo/leo_feliz_resultado.webp"
                alt="Leo"
                width={120}
                height={120}
                className="object-contain animate-bounce"
              />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <div className="relative">
              <Image 
                src="/images/mascotes/mila/mila_sinal_positivo_resultado.webp"
                alt="Mila"
                width={120}
                height={120}
                className="object-contain animate-bounce"
                style={{ animationDelay: '0.5s' }}
              />
              <Star className="absolute -top-2 -left-2 w-6 h-6 text-pink-400 animate-pulse" />
            </div>
          </div>

          {/* Mensagem dos Mascotes */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-6">
            <p className="text-lg text-center text-gray-800">
              <span className="font-bold text-blue-600">Leo</span> e <span className="font-bold text-purple-600">Mila</span> te desafiam para o jogo mais divertido de memória musical! 
            </p>
            <p className="text-lg text-center text-gray-700 mt-2">
              🎵 Memorize as sequências de sons e ganhe muitas recompensas! 🎁
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 text-center">
              <Trophy className="w-8 h-8 text-white mx-auto mb-1" />
              <p className="text-white font-bold text-2xl">{stats.highScore}</p>
              <p className="text-white/90 text-sm">Recorde</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-xl p-4 text-center">
              <div className="text-3xl mb-1">💰</div>
              <p className="text-white font-bold text-2xl">{stats.coins}</p>
              <p className="text-white/90 text-sm">Moedas</p>
            </div>
          </div>

          {/* Botão Jogar */}
          <button
            onClick={() => {
              setCurrentScreen('game');
              setTimeout(startGame, 500);
            }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-5 rounded-2xl font-bold text-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-3 animate-pulse"
          >
            <Play className="w-8 h-8" />
            VAMOS JOGAR!
            <Zap className="w-8 h-8" />
          </button>

          {/* Instruções Rápidas */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              🎮 Escute a sequência → 🎹 Repita os sons → 🏆 Ganhe prêmios!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Tela do Jogo
  const GameScreen = () => (
    <div id="game-container" className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 game-container">
      <div className="max-w-4xl mx-auto">
        
        {/* Header com Status */}
        <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
            <div>
              <div className="text-yellow-300 text-xs font-bold">NÍVEL</div>
              <div className="text-white text-2xl font-bold">{stats.level}</div>
            </div>
            <div>
              <div className="text-green-300 text-xs font-bold">PONTOS</div>
              <div className="text-white text-2xl font-bold">{stats.score}</div>
            </div>
            <div>
              <div className="text-orange-300 text-xs font-bold">COMBO</div>
              <div className="text-white text-2xl font-bold">{stats.combo}x</div>
            </div>
            <div>
              <div className="text-red-300 text-xs font-bold">VIDAS</div>
              <div className="text-white text-2xl">
                {Array.from({ length: stats.lives }, (_, i) => (
                  <Heart key={i} className="inline w-5 h-5 text-red-500 fill-red-500" />
                ))}
              </div>
            </div>
            <div>
              <div className="text-yellow-300 text-xs font-bold">MOEDAS</div>
              <div className="text-white text-2xl font-bold">💰 {stats.coins}</div>
            </div>
            <div>
              <div className="text-purple-300 text-xs font-bold">SEQUÊNCIA</div>
              <div className="text-white text-2xl font-bold">{sequenceLength}</div>
            </div>
          </div>
        </div>

        {/* Área Principal do Jogo */}
        <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-4">
          
          {/* Status do Jogo com Mascotes */}
          <div className="text-center mb-6">
            {gameState === 'idle' && (
              <div className="flex flex-col items-center">
                <Image 
                  src="/images/mascotes/leo/leo_boas_vindas_resultado.webp"
                  alt="Leo"
                  width={100}
                  height={100}
                  className="object-contain mb-2"
                />
                <p className="text-white text-xl font-bold">Clique em COMEÇAR para jogar!</p>
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
                <p className="text-yellow-300 text-2xl font-bold animate-pulse">🎧 ESCUTE COM ATENÇÃO!</p>
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
                <div className="mt-2 bg-white/20 rounded-full px-4 py-1">
                  <span className="text-white">{userSequence.length} / {sequence.length}</span>
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
                <p className="text-yellow-300 text-xl">+{sequenceLength * 10 * stats.level} pontos!</p>
              </div>
            )}
            
            {showError && (
              <div className="flex flex-col items-center">
                <Image 
                  src="/images/mascotes/leo/leo_surpreso_resultado.webp"
                  alt="Leo"
                  width={100}
                  height={100}
                  className="object-contain mb-2"
                />
                <p className="text-red-400 text-2xl font-bold">OPS! TENTE NOVAMENTE!</p>
              </div>
            )}
            
            {showCombo && stats.combo >= 3 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="text-6xl font-bold text-yellow-400 animate-pulse neon-glow">
                  COMBO x{stats.combo}!
                </div>
              </div>
            )}
          </div>

          {/* Botões Musicais Coloridos */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {buttons.map((button, index) => (
              <button
                key={index}
                id={`btn-${index}`}
                onClick={() => handleNoteClick(index)}
                disabled={gameState !== 'playing' || isPlaying}
                className={`
                  musical-button ${button.color} 
                  h-24 md:h-28 rounded-2xl font-bold text-white text-2xl md:text-3xl
                  transition-all duration-200 transform
                  ${gameState === 'playing' && !isPlaying ? 'hover:scale-105 opacity-100' : 'opacity-60'}
                  ${gameState === 'listening' && currentNote === index ? 'scale-110 ring-4 ring-white animate-pulse opacity-100' : ''}
                  ${gameState === 'playing' && currentNote === index ? 'scale-110 ring-4 ring-yellow-400 opacity-100' : ''}
                  ${userSequence.includes(index) && gameState === 'playing' ? 'ring-2 ring-green-400' : ''}
                  disabled:cursor-not-allowed
                  flex flex-col items-center justify-center gap-1
                  shadow-lg
                `}
                style={{
                  filter: gameState === 'playing' && !isPlaying ? 'brightness(1.2)' : 
                          gameState === 'listening' && currentNote === index ? 'brightness(1.5)' : 
                          'brightness(0.8)'
                }}
              >
                <span className="text-3xl">{button.emoji}</span>
                <span className="text-lg font-bold">{button.name}</span>
              </button>
            ))}
          </div>

          {/* Barra de Progresso */}
          {gameState === 'playing' && sequence.length > 0 && (
            <div className="bg-white/20 rounded-xl p-3 mb-4">
              <div className="w-full bg-white/30 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(userSequence.length / sequence.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Botões de Controle */}
        <div className="flex justify-center gap-3 flex-wrap">
          {gameState === 'idle' && (
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              COMEÇAR
            </button>
          )}

          {gameState === 'playing' && (
            <button
              onClick={replaySequence}
              disabled={isPlaying}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <RotateCcw className="w-5 h-5" />
              OUVIR NOVAMENTE
            </button>
          )}

          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
          >
            MENU
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors shadow-lg flex items-center gap-2"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        {/* Mascote de Apoio */}
        {stats.combo >= 5 && (
          <div className="fixed bottom-4 right-4 animate-bounce">
            <Image 
              src="/images/mascotes/leo/leo_forca_resultado.webp"
              alt="Leo Força"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );

  return currentScreen === 'welcome' ? <WelcomeScreen /> : <GameScreen />;
};

export default AuditoryMemoryGame;
