'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { ChevronLeft, Save } from 'lucide-react';
import { createClient } from '../utils/supabaseClient'
import confetti from 'canvas-confetti';
import styles from './bubble-pop.module.css';

// Componente do Cabeçalho Padrão
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }: any) => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
                <Link
                    href="/dashboard"
                    className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                </Link>

                <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </h1>

                {showSaveButton && onSave ? (
                    <button
                        onClick={onSave}
                        disabled={isSaveDisabled}
                        className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${
                            !isSaveDisabled
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <Save size={18} />
                        <span className="hidden sm:inline">{isSaveDisabled ? 'Salvando...' : 'Salvar'}</span>
                    </button>
                ) : (
                    <div className="w-24"></div>
                )}
            </div>
        </div>
    </header>
);

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  points: number;
  type: 'air' | 'oxygen' | 'pink' | 'purple' | 'yellow' | 'green' | 'orange' | 
        'mine' | 'treasure' | 'pearl' | 'fish' | 'double' | 'triple' | 
        'shockwave' | 'magnet' | 'equipment' | 'boss_minion';
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
  
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [oxygenLevel, setOxygenLevel] = useState(100);
  const [showResults, setShowResults] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [totalBubbles, setTotalBubbles] = useState(0);
  const [poppedBubbles, setPoppedBubbles] = useState(0);
  const [missedBubbles, setMissedBubbles] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [levelMessage, setLevelMessage] = useState('');
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [bubblesRemaining, setBubblesRemaining] = useState(0);
  const [bubblesSpawned, setBubblesSpawned] = useState(0);
  
  // Novos estados
  const [equipment, setEquipment] = useState<Equipment>({
    mask: false,
    fins: false,
    tank: false,
    suit: false,
    light: false
  });
  const [savedFish, setSavedFish] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [multiplierTime, setMultiplierTime] = useState(0);
  const [hasProtection, setHasProtection] = useState(false);
  const [magnetActive, setMagnetActive] = useState(false);
  const [magnetTime, setMagnetTime] = useState(0);
  const [showBossLevel, setShowBossLevel] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [freedCreatures, setFreedCreatures] = useState<string[]>([]);
  const [checkpointBubbles, setCheckpointBubbles] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  // Configuração dos 10 níveis + Boss - VELOCIDADE REDUZIDA
  const levelConfigs = [
    { 
      level: 1, 
      name: 'Superfície - Bolhas Coloridas', 
      depth: '0-10m',
      totalBubbles: 100, // Reduzido para testes mais rápidos
      minePercentage: 0.05,
      spawnRate: 600,
      oxygenDrain: 0.3,
      bgGradient: 'from-cyan-300 to-blue-400',
      equipment: null,
      features: ['colored_bubbles']
    },
    { 
      level: 2, 
      name: 'Águas Rasas - Salvando Peixes', 
      depth: '10-20m',
      totalBubbles: 110,
      minePercentage: 0.1,
      spawnRate: 580,
      oxygenDrain: 0.4,
      bgGradient: 'from-blue-400 to-blue-500',
      equipment: 'mask',
      features: ['colored_bubbles', 'fish_rescue']
    },
    { 
      level: 3, 
      name: 'Zona Clara - Multiplicadores', 
      depth: '20-30m',
      totalBubbles: 120,
      minePercentage: 0.15,
      spawnRate: 560,
      oxygenDrain: 0.5,
      bgGradient: 'from-blue-500 to-blue-600',
      equipment: 'fins',
      features: ['colored_bubbles', 'fish_rescue', 'multipliers']
    },
    { 
      level: 4, 
      name: 'Águas Médias - Power-ups', 
      depth: '30-40m',
      totalBubbles: 130,
      minePercentage: 0.2,
      spawnRate: 540,
      oxygenDrain: 0.6,
      bgGradient: 'from-blue-600 to-blue-700',
      equipment: 'tank',
      features: ['colored_bubbles', 'fish_rescue', 'multipliers', 'powerups']
    },
    { 
      level: 5, 
      name: 'Zona Mista - Todos Elementos', 
      depth: '40-50m',
      totalBubbles: 140,
      minePercentage: 0.25,
      spawnRate: 520,
      oxygenDrain: 0.7,
      bgGradient: 'from-blue-700 to-indigo-700',
      equipment: 'suit',
      features: ['all']
    },
    { 
      level: 6, 
      name: 'Correntes Marinhas', 
      depth: '50-60m',
      totalBubbles: 150,
      minePercentage: 0.3,
      spawnRate: 500,
      oxygenDrain: 0.8,
      bgGradient: 'from-indigo-700 to-indigo-800',
      equipment: 'light',
      features: ['all', 'currents']
    },
    { 
      level: 7, 
      name: 'Zona Escura', 
      depth: '60-70m',
      totalBubbles: 140,
      minePercentage: 0.35,
      spawnRate: 480,
      oxygenDrain: 0.9,
      bgGradient: 'from-indigo-800 to-indigo-900',
      equipment: null,
      features: ['all', 'darkness']
    },
    { 
      level: 8, 
      name: 'Águas Profundas', 
      depth: '70-80m',
      totalBubbles: 130,
      minePercentage: 0.4,
      spawnRate: 460,
      oxygenDrain: 1.0,
      bgGradient: 'from-indigo-900 to-purple-900',
      equipment: null,
      features: ['all', 'predators']
    },
    { 
      level: 9, 
      name: 'Zona Abissal', 
      depth: '80-90m',
      totalBubbles: 120,
      minePercentage: 0.45,
      spawnRate: 440,
      oxygenDrain: 1.1,
      bgGradient: 'from-purple-900 to-black',
      equipment: null,
      features: ['all', 'extreme']
    },
    { 
      level: 10, 
      name: 'Portal do Abismo', 
      depth: '90-100m',
      totalBubbles: 100,
      minePercentage: 0.5,
      spawnRate: 420,
      oxygenDrain: 1.2,
      bgGradient: 'from-black to-purple-950',
      equipment: null,
      features: ['all', 'portal']
    },
    // Nível Boss Secreto
    { 
      level: 11, 
      name: 'Reino do Senhor dos Mares', 
      depth: 'ABISMO',
      totalBubbles: 150,
      minePercentage: 0.3,
      spawnRate: 400,
      oxygenDrain: 0, // Sem oxigênio!
      bgGradient: 'from-purple-950 via-black to-red-950',
      equipment: null,
      features: ['boss_battle']
    }
  ];

  // Sistema de bolhas coloridas com pontuações
  const coloredBubbles = {
    air: { color: '#E0F2FE', points: 5, size: 40 },
    oxygen: { color: '#60A5FA', points: 15, size: 55 },
    pink: { color: '#F9A8D4', points: 20, size: 45 },
    purple: { color: '#C084FC', points: 25, size: 45 },
    yellow: { color: '#FDE047', points: 30, size: 45 },
    green: { color: '#86EFAC', points: 35, size: 45 },
    orange: { color: '#FB923C', points: 40, size: 45 },
    treasure: { color: '#FFD700', points: 50, size: 50 },
    pearl: { color: '#FFF0F5', points: 100, size: 40 }
  };

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  const startActivity = () => {
    setJogoIniciado(true);
    setIsPlaying(true);
    setCurrentLevel(1);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setBubbles([]);
    setParticles([]);
    setOxygenLevel(100);
    setShowResults(false);
    setTotalBubbles(0);
    setPoppedBubbles(0);
    setMissedBubbles(0);
    setCompletedLevels([]);
    setBubblesSpawned(0);
    setBubblesRemaining(levelConfigs[0].totalBubbles);
    setSavedFish(0);
    setMultiplier(1);
    setEquipment({
      mask: false,
      fins: false,
      tank: false,
      suit: false,
      light: false
    });
    setCheckpointBubbles(0);
    setLevelCompleted(false);
  };

  // Criar nova bolha com todas as mecânicas
  const createBubble = () => {
    if (!isPlaying || !gameAreaRef.current || levelCompleted) return;
    
    const config = levelConfigs[currentLevel - 1];
    
    if (bubblesSpawned >= config.totalBubbles) return;
    
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    
    const rand = Math.random();
    let type: Bubble['type'] = 'air';
    let bubbleConfig: any = coloredBubbles.air;
    let horizontalMovement = 0;
    let equipmentType = '';
    let fishType = '';
    
    // Sistema de spawn baseado no nível
    if (config.equipment && rand < 0.02) {
      // Equipamento do nível (2% chance)
      type = 'equipment';
      equipmentType = config.equipment;
      bubbleConfig = {
        color: '#FFD700',
        points: 0,
        size: 60
      };
    } else if (rand < config.minePercentage) {
      // Mina
      type = 'mine';
      bubbleConfig = { color: '#8B0000', points: -20, size: 45 };
    } else {
      // Determinar tipo baseado nas features do nível
      const features = config.features;
      const featureRand = Math.random();
      
      if (features.includes('fish_rescue') && featureRand < 0.15) {
        // Peixe preso (15% chance)
        type = 'fish';
        const fishTypes = ['🐠', '🐟', '🐡', '🦈', '🐙'];
        fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
        bubbleConfig = {
          color: '#87CEEB',
          points: 50,
          size: 55
        };
      } else if (features.includes('multipliers') && featureRand < 0.1) {
        // Multiplicadores (10% chance)
        type = Math.random() < 0.6 ? 'double' : 'triple';
        bubbleConfig = {
          color: type === 'double' ? '#FFD700' : '#FF69B4',
          points: 0,
          size: 50
        };
      } else if (features.includes('powerups') && featureRand < 0.08) {
        // Power-ups (8% chance)
        type = Math.random() < 0.5 ? 'shockwave' : 'magnet';
        bubbleConfig = {
          color: type === 'shockwave' ? '#FF4500' : '#9370DB',
          points: 0,
          size: 50
        };
      } else {
        // Bolhas coloridas normais
        const colorRand = Math.random();
        if (colorRand < 0.3) type = 'air';
        else if (colorRand < 0.45) type = 'oxygen';
        else if (colorRand < 0.55) type = 'pink';
        else if (colorRand < 0.65) type = 'purple';
        else if (colorRand < 0.73) type = 'yellow';
        else if (colorRand < 0.8) type = 'green';
        else if (colorRand < 0.87) type = 'orange';
        else if (colorRand < 0.95) type = 'treasure';
        else type = 'pearl';
        
        bubbleConfig = coloredBubbles[type as keyof typeof coloredBubbles];
      }
      
      // Movimento horizontal para níveis com correntes
      if (features.includes('currents')) {
        horizontalMovement = (Math.random() - 0.5) * 2;
      }
    }
    
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * (gameArea.width - bubbleConfig.size),
      y: gameArea.height + bubbleConfig.size,
      size: bubbleConfig.size + (Math.random() * 10 - 5),
      speed: 1.2, // VELOCIDADE REDUZIDA (era 2)
      color: bubbleConfig.color,
      points: bubbleConfig.points,
      type: type,
      popped: false,
      opacity: 1,
      horizontalMovement: horizontalMovement,
      equipmentType: equipmentType,
      fishType: fishType
    };
    
    setBubbles(prev => [...prev, newBubble]);
    setTotalBubbles(prev => prev + 1);
    setBubblesSpawned(prev => prev + 1);
    setBubblesRemaining(prev => prev - 1);
  };

  // Atualizar posição das bolhas
  const updateBubbles = () => {
    if (!gameAreaRef.current) return;
    
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    
    setBubbles(prev => prev.map(bubble => {
      if (bubble.popped) {
        return { ...bubble, opacity: bubble.opacity - 0.05 };
      }
      
      let newY = bubble.y - bubble.speed;
      let newX = bubble.x;
      
      // Movimento horizontal
      if (bubble.horizontalMovement) {
        newX += bubble.horizontalMovement;
        
        if (newX <= 0 || newX >= gameArea.width - bubble.size) {
          bubble.horizontalMovement = -bubble.horizontalMovement;
          newX = Math.max(0, Math.min(gameArea.width - bubble.size, newX));
        }
      }
      
      // Efeito magnético
      if (magnetActive && bubble.type !== 'mine') {
        const centerX = gameArea.width / 2;
        const centerY = gameArea.height / 2;
        const dx = centerX - (newX + bubble.size / 2);
        const dy = centerY - (bubble.y + bubble.size / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          newX += dx * 0.02;
          newY -= dy * 0.02;
        }
      }
      
      // Bolha saiu da tela
      if (newY < -bubble.size) {
        if (!bubble.popped && bubble.type !== 'mine') {
          setMissedBubbles(prev => prev + 1);
          setCombo(0);
          setOxygenLevel(prev => Math.max(0, prev - 1));
        }
        return { ...bubble, y: newY, opacity: 0 };
      }
      
      return { ...bubble, y: newY, x: newX };
    }).filter(bubble => bubble.opacity > 0));
  };

  // Criar partículas especiais
  const createParticles = (x: number, y: number, color: string, type: string = 'normal') => {
    const newParticles: Particle[] = [];
    
    if (type === 'explosion') {
      // Explosão grande
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = Math.random() * 6 + 4;
        newParticles.push({
          id: Date.now() + i,
          x: x,
          y: y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color: ['#FF4500', '#FF6347', '#FFD700'][Math.floor(Math.random() * 3)],
          life: 1,
          type: 'star'
        });
      }
    } else if (type === 'fish') {
      // Peixe sendo libertado
      newParticles.push({
        id: Date.now(),
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 5,
        vy: -5,
        color: color,
        life: 2,
        type: 'fish'
      });
    } else if (type === 'shockwave') {
      // Onda de choque
      for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = 8;
        newParticles.push({
          id: Date.now() + i,
          x: x,
          y: y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color: '#00FFFF',
          life: 1,
          type: 'star'
        });
      }
    } else {
      // Partículas normais
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10;
        const velocity = Math.random() * 3 + 2;
        newParticles.push({
          id: Date.now() + i,
          x: x,
          y: y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color: color,
          life: 1
        });
      }
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Atualizar partículas
  const updateParticles = () => {
    setParticles(prev => prev.map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      vy: particle.type === 'fish' ? particle.vy : particle.vy + 0.2,
      life: particle.life - 0.03
    })).filter(particle => particle.life > 0));
  };

  // Som melhorado
  const playPopSound = (type: Bubble['type'], special: boolean = false) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'mine') {
        // Explosão de bomba
        const noise = audioContext.createOscillator();
        const noiseGain = audioContext.createGain();
        noise.type = 'sawtooth';
        noise.frequency.value = 100;
        noise.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        noiseGain.gain.setValueAtTime(0.7, audioContext.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        noise.start(audioContext.currentTime);
        noise.stop(audioContext.currentTime + 0.5);
      } else if (type === 'fish') {
        // Som de libertação
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1600, audioContext.currentTime + 0.2);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else if (type === 'equipment') {
        // Som de coletar equipamento
        for (let i = 0; i < 3; i++) {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.value = 1000 + i * 200;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2 + i * 0.1);
          osc.start(audioContext.currentTime + i * 0.1);
          osc.stop(audioContext.currentTime + 0.2 + i * 0.1);
        }
      } else {
        // Som normal com variação
        oscillator.frequency.value = 600 + Math.random() * 400;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
      }
    } catch (e) {
      // Silently fail
    }
  };

  // Estourar bolha com mecânicas especiais
  const popBubble = (bubble: Bubble, x: number, y: number) => {
    if (bubble.popped) return;
    
    setBubbles(prev => prev.map(b => 
      b.id === bubble.id ? { ...b, popped: true } : b
    ));
    
    playPopSound(bubble.type);
    
    if (bubble.type === 'mine') {
      // Bomba - reinicia nível se não tiver proteção
      createParticles(x, y, bubble.color, 'explosion');
      
      if (equipment.suit) { // Traje dá proteção
        setEquipment(prev => ({ ...prev, suit: false }));
        setLevelMessage('⚠️ Proteção do Traje Perdida!');
        setTimeout(() => setLevelMessage(''), 2000);
      } else {
        // Reiniciar nível
        resetLevel();
        return;
      }
    } else if (bubble.type === 'equipment') {
      // Coletar equipamento
      createParticles(x, y, '#FFD700', 'shockwave');
      setEquipment(prev => ({
        ...prev,
        [bubble.equipmentType || '']: true
      }));
      setLevelMessage(`🎯 ${bubble.equipmentType?.toUpperCase()} Coletado!`);
      setTimeout(() => setLevelMessage(''), 2000);
      
      // Verificar se coletou todo equipamento para desbloquear boss
      checkForBossUnlock();
    } else if (bubble.type === 'fish') {
      // Salvar peixe
      createParticles(x, y, '#00CED1', 'fish');
      setSavedFish(prev => prev + 1);
      setScore(prev => prev + (bubble.points * multiplier));
      setPoppedBubbles(prev => prev + 1);
      setCombo(prev => prev + 1);
      setLevelMessage(`🐠 Peixe Salvo! +${bubble.points * multiplier}`);
      setTimeout(() => setLevelMessage(''), 1500);
    } else if (bubble.type === 'double') {
      // Multiplicador x2
      createParticles(x, y, bubble.color, 'shockwave');
      setMultiplier(2);
      setMultiplierTime(10);
      setLevelMessage('✨ PONTOS x2 ATIVADO!');
      setTimeout(() => setLevelMessage(''), 2000);
    } else if (bubble.type === 'triple') {
      // Multiplicador x3
      createParticles(x, y, bubble.color, 'shockwave');
      setMultiplier(3);
      setMultiplierTime(7);
      setLevelMessage('🌟 PONTOS x3 ATIVADO!');
      setTimeout(() => setLevelMessage(''), 2000);
    } else if (bubble.type === 'shockwave') {
      // Power-up onda de choque
      createParticles(x, y, bubble.color, 'shockwave');
      popAllNearbyBubbles(x, y, 150);
      setLevelMessage('💥 ONDA DE CHOQUE!');
      setTimeout(() => setLevelMessage(''), 1500);
    } else if (bubble.type === 'magnet') {
      // Power-up ímã
      createParticles(x, y, bubble.color, 'shockwave');
      setMagnetActive(true);
      setMagnetTime(8);
      setLevelMessage('🧲 ÍMÃ ATIVADO!');
      setTimeout(() => setLevelMessage(''), 2000);
    } else {
      // Bolhas normais
      createParticles(x, y, bubble.color);
      setPoppedBubbles(prev => prev + 1);
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => Math.max(max, newCombo));
        return newCombo;
      });
      
      const finalPoints = Math.round(bubble.points * multiplier);
      setScore(prev => prev + finalPoints);
      
      // Recuperar oxigênio
      if (bubble.type === 'oxygen') {
        setOxygenLevel(prev => Math.min(100, prev + 10));
      } else if (bubble.type === 'pearl') {
        setOxygenLevel(prev => Math.min(100, prev + 20));
      } else {
        setOxygenLevel(prev => Math.min(100, prev + 3));
      }
    }
    
    // Checkpoint a cada 25% do nível
    setCheckpointBubbles(prev => {
      const newCount = prev + 1;
      const config = levelConfigs[currentLevel - 1];
      const percentage = (newCount / config.totalBubbles) * 100;
      
      if (percentage >= 25 && percentage < 26) {
        setLevelMessage('📍 25% Completo!');
        setTimeout(() => setLevelMessage(''), 1500);
      } else if (percentage >= 50 && percentage < 51) {
        setLevelMessage('📍 50% Completo!');
        setTimeout(() => setLevelMessage(''), 1500);
      } else if (percentage >= 75 && percentage < 76) {
        setLevelMessage('📍 75% Completo!');
        setTimeout(() => setLevelMessage(''), 1500);
      }
      
      return newCount;
    });
  };

  // Estourar bolhas próximas (shockwave)
  const popAllNearbyBubbles = (x: number, y: number, radius: number) => {
    setBubbles(prev => prev.map(bubble => {
      if (bubble.type !== 'mine' && !bubble.popped) {
        const distance = Math.sqrt(
          Math.pow(bubble.x + bubble.size/2 - x, 2) + 
          Math.pow(bubble.y + bubble.size/2 - y, 2)
        );
        if (distance < radius) {
          createParticles(bubble.x + bubble.size/2, bubble.y + bubble.size/2, bubble.color);
          setPoppedBubbles(p => p + 1);
          setScore(s => s + (bubble.points * multiplier));
          return { ...bubble, popped: true };
        }
      }
      return bubble;
    }));
  };

  // Reiniciar nível após bomba
  const resetLevel = () => {
    setIsPlaying(false);
    setLevelMessage('💣 BOMBA! Reiniciando nível...');
    setShowLevelTransition(true);
    
    setTimeout(() => {
      const config = levelConfigs[currentLevel - 1];
      setBubbles([]);
      setParticles([]);
      setCombo(0);
      setBubblesSpawned(0);
      setBubblesRemaining(config.totalBubbles);
      setOxygenLevel(100);
      setCheckpointBubbles(0);
      setMultiplier(1);
      setMagnetActive(false);
      setShowLevelTransition(false);
      setIsPlaying(true);
      setLevelCompleted(false);
    }, 2000);
  };

  // Verificar desbloqueio do boss
  const checkForBossUnlock = () => {
    const hasAllEquipment = equipment.mask && equipment.fins && 
                            equipment.tank && equipment.suit && equipment.light;
    
    if (hasAllEquipment && currentLevel === 10 && !showBossLevel) {
      setLevelMessage('🔓 FASE SECRETA DESBLOQUEADA!');
      setShowBossLevel(true);
    }
  };

  // Efeito de celebração com confetti
  const createCelebrationBurst = () => {
    // Confetti da biblioteca
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Múltiplos bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }, 200);
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);
  };

  // Handle de clique/toque
  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!gameAreaRef.current || !isPlaying) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    bubbles.forEach(bubble => {
      if (bubble.popped) return;
      
      const bubbleCenterX = bubble.x + bubble.size / 2;
      const bubbleCenterY = bubble.y + bubble.size / 2;
      const distance = Math.sqrt(
        Math.pow(x - bubbleCenterX, 2) + 
        Math.pow(y - bubbleCenterY, 2)
      );
      
      if (distance <= bubble.size / 2) {
        popBubble(bubble, x, y);
      }
    });
  };

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const gameLoop = () => {
      updateBubbles();
      updateParticles();
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, magnetActive]);

  // Spawn de bolhas
  useEffect(() => {
    if (!isPlaying || levelCompleted) return;
    
    const config = levelConfigs[currentLevel - 1];
    
    const spawnInterval = setInterval(() => {
      if (bubblesSpawned < config.totalBubbles && !levelCompleted) {
        createBubble();
      }
    }, config.spawnRate);
    
    return () => clearInterval(spawnInterval);
  }, [isPlaying, currentLevel, bubblesSpawned, levelCompleted]);

  // Timer do multiplicador
  useEffect(() => {
    if (multiplierTime <= 0) {
      setMultiplier(1);
      return;
    }
    
    const timer = setTimeout(() => {
      setMultiplierTime(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [multiplierTime]);

  // Timer do ímã
  useEffect(() => {
    if (magnetTime <= 0) {
      setMagnetActive(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setMagnetTime(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [magnetTime]);

  // Drenar oxigênio (exceto no boss)
  useEffect(() => {
    if (!isPlaying || currentLevel === 11) return;
    
    const config = levelConfigs[currentLevel - 1];
    let drainRate = config.oxygenDrain;
    
    // Tanque de oxigênio reduz drain pela metade
    if (equipment.tank) {
      drainRate *= 0.5;
    }
    
    const drainInterval = setInterval(() => {
      setOxygenLevel(prev => {
        const newLevel = Math.max(0, prev - drainRate);
        if (newLevel === 0) {
          endGame();
        }
        return newLevel;
      });
    }, 1000);
    
    return () => clearInterval(drainInterval);
  }, [isPlaying, currentLevel, equipment.tank]);

  // Verificar fim do nível - CORRIGIDO
  useEffect(() => {
    if (!isPlaying || levelCompleted) return;
    
    const config = levelConfigs[currentLevel - 1];
    
    // Verificar se todas as bolhas foram spawnadas e processadas
    if (bubblesSpawned >= config.totalBubbles && bubbles.filter(b => !b.popped).length === 0) {
      setLevelCompleted(true);
      
      if (currentLevel === 11) {
        // Vitória do Boss!
        setBossDefeated(true);
        victorySequence();
      } else if (currentLevel < 10) {
        // Próximo nível
        setCompletedLevels(prev => [...prev, currentLevel]);
        setLevelMessage(`🌊 ${config.name} Completo!`);
        setShowLevelTransition(true);
        
        // Efeito de celebração
        createCelebrationBurst();
        
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
          setIsPlaying(true); // Continuar jogando
        }, 3000);
      } else if (currentLevel === 10) {
        // Fim do jogo normal ou acesso ao boss
        if (showBossLevel) {
          // Ir para o boss
          setLevelMessage('🌊 ENTRANDO NO REINO DO SENHOR DOS MARES!');
          setShowLevelTransition(true);
          createCelebrationBurst();
          
          setTimeout(() => {
            setCurrentLevel(11);
            const bossConfig = levelConfigs[10];
            setBubblesSpawned(0);
            setBubblesRemaining(bossConfig.totalBubbles);
            setShowLevelTransition(false);
            setOxygenLevel(100);
            setLevelCompleted(false);
            setIsPlaying(true);
          }, 3000);
        } else {
          endGame();
        }
      } else {
        endGame();
      }
    }
  }, [isPlaying, currentLevel, bubblesSpawned, bubbles, showBossLevel, levelCompleted]);

  // Sequência de vitória do boss
  const victorySequence = () => {
    setIsPlaying(false);
    setLevelMessage('🎉 SENHOR DOS MARES DERROTADO!');
    
    // Múltiplos confettis
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: Math.random() }
        });
      }, i * 300);
    }
    
    // Liberar todas as criaturas
    const creatures = ['🐠', '🐟', '🐡', '🦈', '🐙', '🦑', '🦀', '🦞', '🐢', '🐳', '🐬', '🦭'];
    let index = 0;
    
    const releaseInterval = setInterval(() => {
      if (index < creatures.length) {
        setFreedCreatures(prev => [...prev, creatures[index]]);
        index++;
      } else {
        clearInterval(releaseInterval);
        setTimeout(() => {
          endGame(true);
        }, 3000);
      }
    }, 200);
  };

  const endGame = (bossVictory = false) => {
    setIsPlaying(false);
    setShowResults(true);
    
    if (bossVictory) {
      // Celebração final épica
      const duration = 5 * 1000;
      const end = Date.now() + duration;
      
      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
    
    const totalAttempts = poppedBubbles + missedBubbles;
    const acc = totalAttempts > 0 ? Math.round((poppedBubbles / totalAttempts) * 100) : 0;
    setAccuracy(acc);
  };

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
          atividade_nome: 'Oceano de Bolhas - Aventura Completa',
          pontuacao_final: score,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!
        
🌊 Resultado da Aventura Oceânica:
- Níveis Completados: ${completedLevels.length}/11
- Peixes Salvos: ${savedFish}
- Equipamentos: ${Object.values(equipment).filter(e => e).length}/5
- Boss Derrotado: ${bossDefeated ? 'SIM! 🏆' : 'Não'}
- Reino Salvo: ${freedCreatures.length > 0 ? 'SIM! 🌟' : 'Não'}
- Pontuação Total: ${score} pontos`);
        
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error);
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  };

  const voltarInicio = () => {
    setJogoIniciado(false);
    setShowResults(false);
    setIsPlaying(false);
    setBubbles([]);
    setParticles([]);
    setFreedCreatures([]);
    setBossDefeated(false);
    setShowBossLevel(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader 
        title="Oceano de Bolhas - Aventura Épica"
        icon="🌊"
        onSave={handleSaveSession}
        isSaveDisabled={salvando}
        showSaveButton={showResults}
      />

      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {!jogoIniciado ? (
          // Tela inicial - mantida igual
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6">
                <img 
                  src="https://raw.githubusercontent.com/ClaudemirWork/teaplus-working/main/public/images/mila_boas_vindas_resultado.webp"
                  alt="Mila"
                  className="w-32 h-32 mx-auto rounded-full border-4 border-blue-400 shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <h2 className="text-2xl font-bold text-blue-800 mt-4">
                  Mila precisa de sua ajuda para salvar o reino oceânico!
                </h2>
                <p className="text-gray-600 mt-2">
                  O malvado Senhor dos Mares prendeu todas as criaturas marinhas!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">🎯 Missão:</h3>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>• Colete equipamentos de mergulho</li>
                    <li>• Salve peixes presos</li>
                    <li>• Derrote o Senhor dos Mares</li>
                    <li>• Liberte o reino oceânico!</li>
                  </ul>
                </div>
                
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">🎁 Novidades:</h3>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>🐠 Peixes para salvar</li>
                    <li>x2 x3 Multiplicadores</li>
                    <li>💥 Power-ups de área</li>
                    <li>🧲 Ímã magnético</li>
                    <li>🤿 5 equipamentos</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">⚡ Equipamentos:</h3>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>🥽 Máscara - Nível 2</li>
                    <li>🦶 Nadadeiras - Nível 3</li>
                    <li>🤿 Tanque - Nível 4</li>
                    <li>👔 Traje - Nível 5 (Proteção)</li>
                    <li>🔦 Lanterna - Nível 6</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-center text-sm font-semibold text-red-800">
                  ⚠️ ATENÇÃO: Bombas reiniciam o nível! Colete o traje para proteção!
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startActivity}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🤿 Iniciar Aventura Épica
              </button>
              <p className="text-sm text-gray-600 mt-2">
                10 níveis + Fase Secreta do Boss! (Velocidade constante)
              </p>
            </div>
          </div>
        ) : !showResults ? (
          // Área de jogo - com todas as melhorias
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
              <div className="grid grid-cols-6 gap-2">
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-indigo-800">
                    Nv.{currentLevel}
                  </div>
                  <div className="text-xs text-indigo-600">Nível</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-blue-800">
                    {score}
                  </div>
                  <div className="text-xs text-blue-600">Pontos</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-orange-800">
                    x{combo}
                  </div>
                  <div className="text-xs text-orange-600">Combo</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-green-800">
                    {savedFish}
                  </div>
                  <div className="text-xs text-green-600">🐠 Salvos</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-purple-800">
                    {bubblesRemaining}
                  </div>
                  <div className="text-xs text-purple-600">Restantes</div>
                </div>
                <div className="text-center">
                  <div className={`text-base sm:text-xl font-bold ${
                    multiplier > 1 ? 'text-yellow-500 animate-pulse' : 'text-gray-800'
                  }`}>
                    x{multiplier}
                  </div>
                  <div className="text-xs text-gray-600">Multi</div>
                </div>
              </div>
            </div>

            {/* Equipamentos coletados */}
            <div className="bg-white rounded-lg shadow p-2 flex justify-center gap-3">
              <span className={`text-2xl ${equipment.mask ? '' : 'opacity-30'}`}>🥽</span>
              <span className={`text-2xl ${equipment.fins ? '' : 'opacity-30'}`}>🦶</span>
              <span className={`text-2xl ${equipment.tank ? '' : 'opacity-30'}`}>🤿</span>
              <span className={`text-2xl ${equipment.suit ? '' : 'opacity-30'}`}>👔</span>
              <span className={`text-2xl ${equipment.light ? '' : 'opacity-30'}`}>🔦</span>
            </div>

            {/* Barra de Oxigênio (não aparece no boss) */}
            {currentLevel !== 11 && (
              <div className="bg-white rounded-lg shadow p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">💨 Oxigênio:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        oxygenLevel > 60 ? 'bg-blue-500' :
                        oxygenLevel > 30 ? 'bg-yellow-500' :
                        'bg-red-500 animate-pulse'
                      }`}
                      style={{ width: `${oxygenLevel}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold">{Math.round(oxygenLevel)}%</span>
                </div>
              </div>
            )}

            {/* Área do jogo */}
            <div 
              ref={gameAreaRef}
              className={`relative bg-gradient-to-b ${levelConfigs[currentLevel - 1].bgGradient} rounded-xl shadow-lg overflow-hidden cursor-crosshair`}
              style={{ height: isMobile ? '450px' : '500px' }}
              onMouseDown={handleInteraction}
              onTouchStart={handleInteraction}
            >
              {/* Imagem da Mila no fundo */}
              <div 
                className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `url(https://raw.githubusercontent.com/ClaudemirWork/teaplus-working/main/public/images/mila_feiticeira_resultado.webp)`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />

              {/* Mensagens de nível */}
              {levelMessage && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-white/90 text-black px-6 py-3 rounded-full font-bold animate-bounce">
                    {levelMessage}
                  </div>
                </div>
              )}

              {/* Transição de nível com animação */}
              {showLevelTransition && (
                <div className={styles.levelTransition}>
                  <div className="text-center">
                    <div className="text-4xl sm:text-6xl mb-2 animate-bounce">
                      {currentLevel === 11 ? '👑' : '🌊'}
                    </div>
                    <div className="text-xl sm:text-3xl font-bold text-blue-600">
                      {levelMessage}
                    </div>
                    {currentLevel < 11 && levelConfigs[currentLevel] && (
                      <div className="text-sm sm:text-base text-gray-600 mt-2">
                        Próximo: {levelConfigs[currentLevel].name}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Criaturas sendo libertadas (boss victory) */}
              {freedCreatures.length > 0 && (
                <div className="absolute inset-0 flex flex-wrap items-center justify-center z-25">
                  {freedCreatures.map((creature, i) => (
                    <div 
                      key={i}
                      className={`text-4xl ${styles.fishEscape}`}
                      style={{
                        animationDelay: `${i * 0.1}s`
                      }}
                    >
                      {creature}
                    </div>
                  ))}
                </div>
              )}

              {/* Bolhas com animações CSS */}
              {bubbles.map(bubble => (
                <div
                  key={bubble.id}
                  className={`absolute rounded-full transition-opacity ${
                    bubble.popped ? 'pointer-events-none' : 'cursor-pointer'
                  } ${styles.bubbleContainer}`}
                  style={{
                    left: `${bubble.x}px`,
                    top: `${bubble.y}px`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    background: bubble.type === 'mine' 
                      ? 'radial-gradient(circle, #8B0000, #4B0000)'
                      : bubble.type === 'fish'
                      ? 'radial-gradient(circle, #87CEEB, #4682B4)'
                      : bubble.type === 'equipment'
                      ? 'radial-gradient(circle, #FFD700, #FFA500)'
                      : bubble.type === 'double'
                      ? 'radial-gradient(circle, #FFD700, #FF8C00)'
                      : bubble.type === 'triple'
                      ? 'radial-gradient(circle, #FF69B4, #FF1493)'
                      : bubble.type === 'shockwave'
                      ? 'radial-gradient(circle, #00FFFF, #0000FF)'
                      : bubble.type === 'magnet'
                      ? 'radial-gradient(circle, #9370DB, #4B0082)'
                      : bubble.color,
                    border: bubble.type === 'equipment' ? '3px solid #FFD700' :
                            bubble.type === 'mine' ? '2px solid #FF0000' :
                            bubble.type === 'fish' ? '2px solid #00CED1' :
                            '1px solid rgba(255,255,255,0.3)',
                    opacity: bubble.opacity,
                    boxShadow: bubble.type === 'equipment' ? '0 0 20px #FFD700' :
                               bubble.type === 'double' || bubble.type === 'triple' ? '0 0 15px #FFD700' :
                               '0 2px 8px rgba(0,0,0,0.2)',
                    transform: `scale(${bubble.popped ? 1.5 : 1})`,
                  }}
                >
                  {/* Ícones especiais */}
                  {bubble.type === 'mine' && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                      💣
                    </div>
                  )}
                  {bubble.type === 'fish' && (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                      {bubble.fishType}
                    </div>
                  )}
                  {bubble.type === 'equipment' && (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                      {bubble.equipmentType === 'mask' && '🥽'}
                      {bubble.equipmentType === 'fins' && '🦶'}
                      {bubble.equipmentType === 'tank' && '🤿'}
                      {bubble.equipmentType === 'suit' && '👔'}
                      {bubble.equipmentType === 'light' && '🔦'}
                    </div>
                  )}
                  {bubble.type === 'double' && (
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                      x2
                    </div>
                  )}
                  {bubble.type === 'triple' && (
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                      x3
                    </div>
                  )}
                  {bubble.type === 'shockwave' && (
                    <div className="absolute inset-0 flex items-center justify-center text-xl">
                      💥
                    </div>
                  )}
                  {bubble.type === 'magnet' && (
                    <div className="absolute inset-0 flex items-center justify-center text-xl">
                      🧲
                    </div>
                  )}
                  {/* Pontos nas bolhas normais */}
                  {['air', 'oxygen', 'pink', 'purple', 'yellow', 'green', 'orange'].includes(bubble.type) && (
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                      +{bubble.points}
                    </div>
                  )}
                </div>
              ))}

              {/* Partículas com animações CSS */}
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className={`${styles.particle} ${
                    particle.type === 'star' ? styles.particleStar : ''
                  }`}
                  style={{
                    left: `${particle.x}px`,
                    top: `${particle.y}px`,
                    width: particle.type === 'star' ? '8px' : particle.type === 'fish' ? '20px' : '6px',
                    height: particle.type === 'star' ? '8px' : particle.type === 'fish' ? '20px' : '6px',
                    background: particle.color,
                    opacity: particle.life,
                  }}
                >
                  {particle.type === 'fish' && '🐠'}
                </div>
              ))}

              {/* Indicadores de power-ups ativos */}
              {multiplierTime > 0 && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold">
                    ⚡ x{multiplier} ({multiplierTime}s)
                  </div>
                </div>
              )}

              {magnetActive && (
                <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold">
                    🧲 ÍMÃ ({magnetTime}s)
                  </div>
                </div>
              )}

              {/* Boss aparece no nível 11 */}
              {currentLevel === 11 && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                  <div className={`text-6xl ${styles.victoryAnimation}`}>
                    👹
                  </div>
                  <div className="text-white font-bold text-center">
                    Senhor dos Mares
                  </div>
                </div>
              )}
            </div>

            {/* Indicador de progresso dos níveis */}
            <div className="flex justify-center gap-1 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <div
                  key={level}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                    ${completedLevels.includes(level) ? 'bg-green-500 text-white' :
                      level === currentLevel ? 'bg-cyan-400 text-black animate-pulse' :
                      'bg-gray-300 text-gray-600'}`}
                >
                  {level}
                </div>
              ))}
              {showBossLevel && (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                  ${currentLevel === 11 ? 'bg-red-500 text-white animate-pulse' :
                    bossDefeated ? 'bg-gold-500 text-white' : 'bg-purple-500 text-white'}`}>
                  👑
                </div>
              )}
            </div>
          </div>
        ) : (
          // Tela de resultados com animações
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className={`text-5xl sm:text-6xl mb-4 ${bossDefeated ? styles.victoryAnimation : ''}`}>
                {bossDefeated ? '👑' : 
                 completedLevels.length === 10 ? '🏆' : 
                 savedFish > 20 ? '🐠' : '🌊'}
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {bossDefeated ? 'HERÓI DO OCEANO!' : 
                 completedLevels.length === 10 ? 'Aventura Completa!' : 
                 savedFish > 20 ? 'Salvador dos Peixes!' : 'Boa Exploração!'}
              </h3>
              
              {bossDefeated && (
                <p className="text-lg text-green-600 font-bold">
                  Você libertou todo o reino oceânico! 🌟
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-blue-800">
                  {score}
                </div>
                <div className="text-xs text-blue-600">Pontuação</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-green-800">
                  {savedFish}
                </div>
                <div className="text-xs text-green-600">Peixes Salvos</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-orange-800">
                  x{maxCombo}
                </div>
                <div className="text-xs text-orange-600">Combo Máx</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-purple-800">
                  {completedLevels.length}/11
                </div>
                <div className="text-xs text-purple-600">Níveis</div>
              </div>
            </div>

            {/* Equipamentos coletados */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">🤿 Equipamentos Coletados:</h4>
              <div className="flex justify-center gap-3">
                <span className={`text-3xl ${equipment.mask ? '' : 'opacity-30'}`}>🥽</span>
                <span className={`text-3xl ${equipment.fins ? '' : 'opacity-30'}`}>🦶</span>
                <span className={`text-3xl ${equipment.tank ? '' : 'opacity-30'}`}>🤿</span>
                <span className={`text-3xl ${equipment.suit ? '' : 'opacity-30'}`}>👔</span>
                <span className={`text-3xl ${equipment.light ? '' : 'opacity-30'}`}>🔦</span>
              </div>
            </div>

            {bossDefeated && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-yellow-800 mb-3">🏆 Conquistas Especiais:</h4>
                <ul className="text-sm text-yellow-700">
                  <li>✅ Derrotou o Senhor dos Mares</li>
                  <li>✅ Libertou {freedCreatures.length} criaturas marinhas</li>
                  <li>✅ Salvou o reino oceânico</li>
                  <li>✅ Verdadeiro herói do oceano!</li>
                </ul>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={voltarInicio}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                🔄 Nova Aventura
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
