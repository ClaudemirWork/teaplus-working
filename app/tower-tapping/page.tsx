'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Star, Trophy } from 'lucide-react';
import { createClient } from '../utils/supabaseClient';
import confetti from 'canvas-confetti';
import Image from 'next/image';

interface Block {
  id: number;
  x: number;
  y: number;
  offset: number;
  quality: 'perfect' | 'good' | 'poor';
  isSpecial: boolean;
  color: string;
  points: number;
  width: number;
  falling?: boolean;
  opacity?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  type?: 'star' | 'spark' | 'dust';
}

interface PowerUp {
  type: 'perfect_streak' | 'rhythm_master' | 'tower_boost' | 'golden_block';
  active: boolean;
  duration?: number;
  message: string;
}

export default function TowerTappingInfinite() {
  const router = useRouter();
  const supabase = createClient();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const towerContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  // Controle de telas
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
  
  // Estados do jogo
  const [isPlaying, setIsPlaying] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [towerHeight, setTowerHeight] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [showResults, setShowResults] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [perfectStreak, setPerfectStreak] = useState(0);
  const [maxPerfectStreak, setMaxPerfectStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [multiplierTime, setMultiplierTime] = useState(0);
  const [towerLevel, setTowerLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [targetBPM, setTargetBPM] = useState<number | null>(null);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);
  const [tapHistory, setTapHistory] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [totalTaps, setTotalTaps] = useState(0);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [cameraOffset, setCameraOffset] = useState(0);

  // Estados salvos
  const [bestHeight, setBestHeight] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  // Configurações responsivas
  const [gameConfig, setGameConfig] = useState({
    blockWidth: 100,
    blockHeight: 30,
    blockSpacing: 32,
    gameAreaHeight: 500,
    baseHeight: 60
  });

  useEffect(() => {
    const savedHeight = localStorage.getItem('towerTapping_bestHeight');
    const savedStars = localStorage.getItem('towerTapping_totalStars');
    
    if (savedHeight) setBestHeight(parseInt(savedHeight));
    if (savedStars) setTotalStars(parseInt(savedStars));
    
    const updateConfig = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      
      setGameConfig({
        blockWidth: mobile ? 80 : 100,
        blockHeight: mobile ? 25 : 30,
        blockSpacing: mobile ? 27 : 32,
        gameAreaHeight: mobile ? 400 : 500,
        baseHeight: mobile ? 50 : 60
      });
    };
    
    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  const blockColors = {
    perfect: { color: '#10B981', glow: '#34D399' }, // Verde
    good: { color: '#3B82F6', glow: '#60A5FA' },    // Azul
    poor: { color: '#F59E0B', glow: '#FBBF24' }     // Laranja
  };

  const startActivity = () => {
    setCurrentScreen('game');
    setIsPlaying(true);
    setBlocks([]);
    setParticles([]);
    setScore(0);
    setTowerHeight(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setShowResults(false);
    setPerfectStreak(0);
    setMaxPerfectStreak(0);
    setMultiplier(1);
    setMultiplierTime(0);
    setTowerLevel(1);
    setTargetBPM(null);
    setLastTapTime(null);
    setTapHistory([]);
    setTotalTaps(0);
    setIsCollapsing(false);
    setPowerUps([]);
    setCameraOffset(0);
    setGameMessage('Comece a construir sua torre!');
  };

  const showGameMessage = (message: string, duration: number = 3000) => {
    setGameMessage(message);
    setTimeout(() => {
      if (isPlaying) setGameMessage('');
    }, duration);
  };

  // Sistema de câmera que acompanha a torre
  const updateCamera = (newHeight: number) => {
    if (!gameAreaRef.current) return;
    
    const visibleBlocks = Math.floor((gameConfig.gameAreaHeight - gameConfig.baseHeight) / gameConfig.blockSpacing);
    
    if (newHeight > visibleBlocks - 3) {
      // Começar a mover a câmera quando restam apenas 3 blocos visíveis
      const offset = (newHeight - (visibleBlocks - 3)) * gameConfig.blockSpacing;
      setCameraOffset(offset);
    }
  };

  const createParticles = (x: number, y: number, type: string = 'spark', count: number = 10) => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = Math.random() * 4 + 2;
      const color = type === 'perfect' ? '#10B981' : 
                   type === 'good' ? '#3B82F6' : 
                   type === 'explosion' ? ['#FF6B6B', '#FFD93D', '#6BCF7F'][Math.floor(Math.random() * 3)] :
                   '#F59E0B';
      
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - Math.random() * 2,
        color,
        life: 1,
        type: type as any
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const updateParticles = () => {
    setParticles(prev => prev.map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      vy: particle.vy + 0.3,
      life: particle.life - 0.02
    })).filter(particle => particle.life > 0));
  };

  const playSound = (type: 'perfect' | 'good' | 'poor' | 'collapse' | 'levelup' | 'powerup') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch (type) {
        case 'perfect':
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(659, audioContext.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
          
        case 'good':
          oscillator.frequency.value = 440;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.15);
          break;
          
        case 'poor':
          oscillator.frequency.value = 220;
          oscillator.type = 'sawtooth';
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
          
        case 'collapse':
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 1);
          gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 1);
          break;
          
        case 'levelup':
          [523, 659, 784].forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4 + i * 0.1);
            osc.start(audioContext.currentTime + i * 0.1);
            osc.stop(audioContext.currentTime + 0.4 + i * 0.1);
          });
          break;
          
        case 'powerup':
          [262, 294, 330, 349, 392, 440, 494, 523].forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.15, audioContext.currentTime + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1 + i * 0.05);
            osc.start(audioContext.currentTime + i * 0.05);
            osc.stop(audioContext.currentTime + 0.1 + i * 0.05);
          });
          break;
      }
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const createCelebrationBurst = (x?: number, y?: number) => {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { 
          x: x ? x / (gameAreaRef.current?.offsetWidth || 400) : 0.5,
          y: y ? y / (gameAreaRef.current?.offsetHeight || 400) : 0.5
        }
      });
    }
  };

  const activatePowerUp = (type: PowerUp['type']) => {
    const powerUpMessages = {
      perfect_streak: 'SEQUÊNCIA PERFEITA! +Multiplicador',
      rhythm_master: 'MESTRE DO RITMO! +Bônus',
      tower_boost: 'IMPULSO DA TORRE! +Velocidade', 
      golden_block: 'BLOCO DOURADO! +Pontos Extras'
    };

    const newPowerUp: PowerUp = {
      type,
      active: true,
      duration: type === 'perfect_streak' ? 15 : 10,
      message: powerUpMessages[type]
    };

    setPowerUps(prev => [...prev.filter(p => p.type !== type), newPowerUp]);
    showGameMessage(newPowerUp.message, 2000);
    playSound('powerup');
    
    if (type === 'perfect_streak') {
      setMultiplier(prev => Math.min(prev + 1, 5));
      setMultiplierTime(15);
    }
    
    createCelebrationBurst();
  };

  const addBlock = (quality: 'perfect' | 'good' | 'poor', offset: number) => {
    if (!gameAreaRef.current) return;
    
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const centerX = gameArea.width / 2;
    
    const basePoints = quality === 'perfect' ? 100 : quality === 'good' ? 60 : 30;
    const finalPoints = Math.round(basePoints * multiplier);
    const isSpecial = perfectStreak > 0 && perfectStreak % 5 === 0;
    
    // Calcular posição Y baseada no índice dos blocos existentes
    const blockIndex = blocks.length;
    const blockY = gameConfig.gameAreaHeight - gameConfig.baseHeight - ((blockIndex + 1) * gameConfig.blockSpacing);
    
    const newBlock: Block = {
      id: Date.now() + Math.random(),
      x: centerX - (gameConfig.blockWidth / 2) + offset, // Centralizado + offset do ritmo
      y: blockY,
      offset,
      quality,
      isSpecial,
      color: blockColors[quality].color,
      points: finalPoints,
      width: gameConfig.blockWidth,
      opacity: 1
    };
    
    setBlocks(prev => [...prev, newBlock]);
    
    const newHeight = towerHeight + 1;
    setTowerHeight(newHeight);
    setScore(prev => prev + finalPoints);
    setTotalTaps(prev => prev + 1);
    
    // Atualizar câmera
    updateCamera(newHeight);
    
    // Criar partículas
    createParticles(
      newBlock.x + gameConfig.blockWidth / 2, 
      newBlock.y + gameConfig.blockHeight / 2, 
      quality,
      quality === 'perfect' ? 15 : quality === 'good' ? 10 : 5
    );
    
    // Atualizar combos e streaks
    if (quality === 'perfect') {
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => Math.max(max, newCombo));
        return newCombo;
      });
      setPerfectStreak(prev => {
        const newStreak = prev + 1;
        setMaxPerfectStreak(max => Math.max(max, newStreak));
        
        if (newStreak === 10) {
          activatePowerUp('perfect_streak');
        } else if (newStreak === 20) {
          activatePowerUp('rhythm_master');
        }
        
        return newStreak;
      });
    } else {
      if (quality === 'poor') {
        setCombo(0);
        setPerfectStreak(0);
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            triggerCollapse();
          } else {
            showGameMessage(`Cuidado! ${newLives} vidas restantes`, 2000);
          }
          return newLives;
        });
      } else {
        setCombo(prev => {
          const newCombo = prev + 1;
          setMaxCombo(max => Math.max(max, newCombo));
          return newCombo;
        });
        setPerfectStreak(0);
      }
    }
    
    // Verificar level up da torre
    if (newHeight % 25 === 0) {
      const newLevel = Math.floor(newHeight / 25) + 1;
      setTowerLevel(newLevel);
      setShowLevelUp(true);
      playSound('levelup');
      showGameMessage(`NÍVEL ${newLevel} DA TORRE ALCANÇADO!`, 3000);
      createCelebrationBurst();
      
      // Recuperar uma vida a cada level up
      setLives(prev => Math.min(prev + 1, 3));
      
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    
    playSound(quality);
  };

  const triggerCollapse = () => {
    setIsCollapsing(true);
    setIsPlaying(false);
    playSound('collapse');
    showGameMessage('TORRE DESMORONOU!', 3000);
    
    // Animar blocos caindo
    setBlocks(prev => prev.map(block => ({
      ...block,
      falling: true
    })));
    
    // Criar explosão de partículas
    blocks.forEach((block, index) => {
      setTimeout(() => {
        createParticles(
          block.x + block.width / 2,
          block.y + 15,
          'explosion',
          20
        );
      }, index * 50);
    });
    
    // Após animação, mostrar resultados
    setTimeout(() => {
      endGame();
    }, 3000);
  };

  const handleTap = () => {
    if (!isPlaying || isCollapsing) return;
    
    const currentTime = Date.now();
    const newTapHistory = [...tapHistory, currentTime].slice(-10);
    setTapHistory(newTapHistory);
    
    // Calcular BPM target após 3 taps
    if (newTapHistory.length >= 3 && !targetBPM) {
      const intervals = [];
      for (let i = 1; i < newTapHistory.length; i++) {
        intervals.push(newTapHistory[i] - newTapHistory[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = 60000 / avgInterval;
      setTargetBPM(Math.round(bpm));
      showGameMessage(`Ritmo estabelecido: ${Math.round(bpm)} BPM`, 2000);
    }
    
    // Calcular qualidade do tap
    let quality: 'perfect' | 'good' | 'poor' = 'perfect';
    let offset = 0;
    const maxOffset = gameConfig.blockWidth * 0.4; // 40% da largura do bloco
    
    if (targetBPM && newTapHistory.length >= 2) {
      const lastInterval = currentTime - newTapHistory[newTapHistory.length - 2];
      const targetInterval = 60000 / targetBPM;
      const deviation = Math.abs(lastInterval - targetInterval) / targetInterval;
      
      if (deviation < 0.1) {
        quality = 'perfect';
        offset = (Math.random() - 0.5) * (maxOffset * 0.2);
      } else if (deviation < 0.25) {
        quality = 'good'; 
        offset = (Math.random() - 0.5) * (maxOffset * 0.6);
      } else {
        quality = 'poor';
        offset = (Math.random() - 0.5) * maxOffset;
      }
    }
    
    setLastTapTime(currentTime);
    addBlock(quality, offset);
  };

  const endGame = () => {
    setShowResults(true);
    
    // Atualizar recordes
    if (towerHeight > bestHeight) {
      setBestHeight(towerHeight);
      localStorage.setItem('towerTapping_bestHeight', towerHeight.toString());
    }
    
    const newStars = totalStars + Math.floor(score / 1000);
    setTotalStars(newStars);
    localStorage.setItem('towerTapping_totalStars', newStars.toString());
  };

  const restartGame = () => {
    setCurrentScreen('title');
    setShowResults(false);
    setIsCollapsing(false);
  };

  // Atualizar power-ups
  useEffect(() => {
    if (!isPlaying) return;
    
    if (multiplierTime <= 0) {
      setMultiplier(1);
      return;
    }
    
    const timer = setTimeout(() => {
      setMultiplierTime(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [multiplierTime, isPlaying]);

  // Game loop para partículas e animações
  useEffect(() => {
    if (!isPlaying && !isCollapsing) return;
    
    const gameLoop = () => {
      updateParticles();
      
      // Animar blocos caindo durante colapso
      if (isCollapsing) {
        setBlocks(prev => prev.map(block => {
          if (!block.falling) return block;
          
          return {
            ...block,
            y: block.y + 5,
            opacity: Math.max(0, (block.opacity || 1) - 0.02)
          };
        }).filter(block => (block.opacity || 1) > 0));
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isCollapsing]);

  const handleSaveSession = async () => {
    setSalvando(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Erro ao obter usuário:', userError);
        alert('Erro: Sessão expirada. Por favor, faça login novamente.');
        router.push('/login');
        return;
      }
      
      const { data, error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Torre do Ritmo Infinita',
          pontuacao_final: score,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!
        
🏗️ Torre Construída:
- Altura: ${towerHeight} blocos
- Nível da Torre: ${towerLevel}
- Sequência Perfeita Máxima: ${maxPerfectStreak}
- Combo Máximo: ${maxCombo}
- Pontuação: ${score} pontos`);
        
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error);
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  };

  // TELAS DO JOGO
  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-orange-300 via-red-400 to-purple-500 overflow-hidden">
      {/* Estrelas de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
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
            <Star className="w-6 h-6 text-white opacity-30" fill="currentColor" />
          </div>
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4">
          <Image 
            src="/images/mascotes/leo/leo_torre.webp" 
            alt="Leo Constructor" 
            width={400} 
            height={400} 
            className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl animate-bounce" 
            priority 
          />
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
          Torre do Ritmo
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-4 drop-shadow-md">
          🏗️ Construa até o céu! 🎵
        </p>
        
        {/* Estatísticas */}
        {(totalStars > 0 || bestHeight > 0) && (
          <div className="bg-white/80 rounded-2xl p-4 mb-4 shadow-xl">
            <div className="flex items-center gap-4">
              {totalStars > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                  <span className="font-bold text-orange-800">{totalStars} estrelas</span>
                </div>
              )}
              {bestHeight > 0 && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <span className="font-bold text-orange-800">Recorde: {bestHeight} blocos</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setCurrentScreen('instructions')} 
          className="text-xl font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1"
        >
          Começar Construção
        </button>
      </div>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-red-300 via-orange-300 to-yellow-300">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-orange-600">Como Construir</h2>
        <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
          <p className="flex items-center gap-4">
            <span className="text-4xl">🔨</span>
            <span><b>Toque no botão</b> para adicionar blocos à torre!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🎵</span>
            <span><b>Mantenha o ritmo</b> - blocos alinhados = ritmo perfeito!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">💚</span>
            <span><b>Blocos verdes</b> = toque perfeito (+100 pontos)</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">💙</span>
            <span><b>Blocos azuis</b> = bom toque (+60 pontos)</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🧡</span>
            <span><b>Blocos laranja</b> = ajuste o ritmo (+30 pontos)</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">💔</span>
            <span><b>Muitos erros</b> fazem a torre desmoronar!</span>
          </p>
        </div>
        
        <button 
          onClick={startActivity} 
          className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform"
        >
          Construir Torre! 🚀
        </button>
      </div>
    </div>
  );

  const GameScreen = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setCurrentScreen('title')}
                className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
              </button>

              <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                🏗️
                <span>Torre do Ritmo</span>
              </h1>

              {showResults ? (
                <button
                  onClick={handleSaveSession}
                  disabled={salvando}
                  className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${
                    !salvando
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save size={18} />
                  <span className="hidden sm:inline">{salvando ? 'Salvando...' : 'Salvar'}</span>
                </button>
              ) : (
                <div className="w-24"></div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {!showResults ? (
            <div className="space-y-4">
              {/* Status */}
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
                <div className="grid grid-cols-5 gap-2">
                  <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-orange-800">
                      {towerHeight}
                    </div>
                    <div className="text-xs text-orange-600">Altura</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-blue-800">
                      {score}
                    </div>
                    <div className="text-xs text-blue-600">Pontos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-green-800">
                      x{combo}
                    </div>
                    <div className="text-xs text-green-600">Combo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-purple-800">
                      {perfectStreak}
                    </div>
                    <div className="text-xs text-purple-600">Perfeitas</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3].map(i => (
                        <div
                          key={i}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                            i <= lives ? 'bg-red-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-red-600">Vidas</div>
                  </div>
                </div>
              </div>

              {/* BPM e Multiplicador */}
              <div className="flex gap-2">
                {targetBPM && (
                  <div className="bg-white rounded-lg shadow p-2 flex-1 text-center">
                    <div className="font-bold text-indigo-800">{targetBPM} BPM</div>
                    <div className="text-xs text-indigo-600">Ritmo</div>
                  </div>
                )}
                {multiplier > 1 && (
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg shadow p-2 flex-1 text-center">
                    <div className="font-bold text-yellow-800">x{multiplier} ({multiplierTime}s)</div>
                    <div className="text-xs text-yellow-600">Multiplicador</div>
                  </div>
                )}
              </div>

              {/* Área da Torre com Sistema de Câmera */}
              <div 
                ref={gameAreaRef}
                className="relative bg-gradient-to-b from-sky-200 to-sky-100 rounded-xl shadow-lg overflow-hidden"
                style={{ height: `${gameConfig.gameAreaHeight}px` }}
              >
                {/* Container da Torre com Transform para Câmera */}
                <div 
                  ref={towerContainerRef}
                  className="absolute inset-0"
                  style={{ 
                    transform: `translateY(${cameraOffset}px)`,
                    transition: 'transform 0.5s ease-out'
                  }}
                >
                  {/* Linha guia central - FIXA */}
                  <div 
                    className="absolute top-0 w-0.5 bg-red-300 opacity-40 z-10" 
                    style={{
                      left: '50%',
                      transform: 'translateX(-0.5px)',
                      height: `${Math.max(gameConfig.gameAreaHeight, (blocks.length + 10) * gameConfig.blockSpacing)}px`,
                      bottom: `${gameConfig.baseHeight}px`
                    }}
                  />
                  
                  {/* Mensagens do jogo */}
                  {gameMessage && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-white/90 text-black px-4 py-2 rounded-full font-bold animate-bounce text-center text-sm sm:text-base">
                        {gameMessage}
                      </div>
                    </div>
                  )}

                  {/* Level Up Animation */}
                  {showLevelUp && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
                      <div className="bg-white rounded-2xl p-8 text-center animate-pulse">
                        <div className="text-6xl mb-4">🏗️</div>
                        <div className="text-2xl font-bold text-orange-600">
                          NÍVEL {towerLevel}!
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Blocos da Torre */}
                  {blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className={`absolute transition-all duration-200 ${
                        block.isSpecial ? 'animate-pulse' : ''
                      } ${isCollapsing && block.falling ? 'animate-bounce' : ''}`}
                      style={{
                        left: `${block.x}px`,
                        bottom: `${gameConfig.baseHeight + index * gameConfig.blockSpacing}px`,
                        width: `${block.width}px`,
                        height: `${gameConfig.blockHeight}px`,
                        background: block.isSpecial 
                          ? 'linear-gradient(45deg, #FFD700, #FFA500)' 
                          : `linear-gradient(135deg, ${block.color}, ${blockColors[block.quality].glow})`,
                        borderRadius: '4px',
                        border: `2px solid ${block.isSpecial ? '#FF8C00' : blockColors[block.quality].glow}`,
                        boxShadow: `0 4px 8px rgba(0,0,0,0.3), 0 0 ${block.isSpecial ? '20px' : '10px'} ${blockColors[block.quality].glow}`,
                        opacity: block.opacity || 1,
                        transform: block.falling ? `translateY(${Math.random() * 200}px) rotate(${Math.random() * 360}deg)` : 'none'
                      }}
                    >
                      {block.isSpecial && (
                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                          ⭐
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Partículas */}
                  {particles.map(particle => (
                    <div
                      key={particle.id}
                      className="absolute w-2 h-2 rounded-full pointer-events-none"
                      style={{
                        left: `${particle.x}px`,
                        bottom: `${particle.y}px`,
                        backgroundColor: particle.color,
                        opacity: particle.life,
                        transform: particle.type === 'star' ? 'rotate(45deg)' : 'none'
                      }}
                    />
                  ))}

                  {/* Base da Torre - FIXA */}
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-stone-800 to-stone-600 border-t-4 border-stone-900"
                    style={{ height: `${gameConfig.baseHeight}px` }}
                  >
                    <div className="text-white text-center font-bold pt-4 text-sm sm:text-base">
                      FUNDAÇÃO
                    </div>
                  </div>
                </div>

                {/* Indicador de Nível da Torre - FIXO */}
                <div className="absolute top-4 right-4 bg-white/80 rounded-lg p-2 text-center z-30">
                  <div className="text-lg font-bold text-orange-800">Nv.{towerLevel}</div>
                  <div className="text-xs text-orange-600">Torre</div>
                </div>
              </div>

              {/* Botão de Construir */}
              <div className="text-center">
                <button
                  onClick={handleTap}
                  disabled={isCollapsing}
                  className={`${
                    isCollapsing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-95'
                  } text-white px-8 py-3 sm:px-12 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl`}
                >
                  {isCollapsing ? '💥 DESMORONANDO...' : '🔨 ADICIONAR BLOCO'}
                </button>
                
                {targetBPM && !isCollapsing && (
                  <div className="text-xs sm:text-sm text-gray-600 mt-2">
                    Mantenha o ritmo de {targetBPM} BPM
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Tela de Resultados
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="text-5xl sm:text-6xl mb-4">
                  {towerHeight > 100 ? '🏆' : towerHeight > 50 ? '🎉' : '💪'}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  Torre de {towerHeight} blocos!
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600">
                  {towerHeight > bestHeight ? 'NOVO RECORDE!' : 
                   towerHeight > 50 ? 'Torre impressionante!' : 
                   'Continue praticando!'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-orange-800">{towerHeight}</div>
                  <div className="text-xs text-orange-600">Altura</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-blue-800">{score}</div>
                  <div className="text-xs text-blue-600">Pontuação</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-green-800">{maxPerfectStreak}</div>
                  <div className="text-xs text-green-600">Seq. Perfeita</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-purple-800">{maxCombo}</div>
                  <div className="text-xs text-purple-600">Combo Máx</div>
                </div>
              </div>

              {/* Estatísticas extras */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">📊 Estatísticas da Construção:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>🎯 Nível da Torre: <span className="font-bold">{towerLevel}</span></div>
                  <div>🎵 BPM Final: <span className="font-bold">{targetBPM || 'N/A'}</span></div>
                  <div>🏗️ Total de Toques: <span className="font-bold">{totalTaps}</span></div>
                  <div>⭐ Taxa de Perfeição: <span className="font-bold">{totalTaps ? Math.round((maxPerfectStreak / totalTaps) * 100) : 0}%</span></div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={restartGame}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  🔄 Nova Torre
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  // Renderização das telas
  if (currentScreen === 'title') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
}
