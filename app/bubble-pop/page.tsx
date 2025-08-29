'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { ChevronLeft, Save } from 'lucide-react';
import { createClient } from '../utils/supabaseClient'

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
  type: 'air' | 'oxygen' | 'pink' | 'purple' | 'yellow' | 'green' | 'orange' | 'mine' | 'treasure' | 'pearl';
  popped: boolean;
  opacity: number;
  horizontalMovement?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
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

  // Configuração dos níveis - VELOCIDADE CONSTANTE, MAIS BOLHAS
  const levelConfigs = [
    { 
      level: 1, 
      name: 'Superfície (0-10m)', 
      depth: '0-10m',
      totalBubbles: 200,        // MUITAS bolhas
      minePercentage: 0.05,     // 5% minas apenas
      spawnRate: 400,           // Spawn rápido
      oxygenDrain: 0.3,
      bgGradient: 'from-cyan-300 to-blue-400'
    },
    { 
      level: 2, 
      name: 'Águas Rasas (10-30m)', 
      depth: '10-30m',
      totalBubbles: 150,        // Ainda muitas bolhas
      minePercentage: 0.15,     // 15% minas
      spawnRate: 450,
      oxygenDrain: 0.5,
      bgGradient: 'from-blue-400 to-blue-500'
    },
    { 
      level: 3, 
      name: 'Zona Média (30-60m)', 
      depth: '30-60m',
      totalBubbles: 100,        // Quantidade média
      minePercentage: 0.30,     // 30% minas
      spawnRate: 500,
      oxygenDrain: 0.7,
      bgGradient: 'from-blue-500 to-blue-700'
    },
    { 
      level: 4, 
      name: 'Águas Fundas (60-100m)', 
      depth: '60-100m',
      totalBubbles: 60,         // Poucas bolhas
      minePercentage: 0.45,     // 45% minas
      spawnRate: 550,
      oxygenDrain: 0.9,
      bgGradient: 'from-blue-700 to-indigo-900'
    },
    { 
      level: 5, 
      name: 'Zona Abissal (100m+)', 
      depth: '100m+',
      totalBubbles: 40,         // Muito poucas bolhas
      minePercentage: 0.60,     // 60% minas
      spawnRate: 600,
      oxygenDrain: 1.1,
      bgGradient: 'from-indigo-900 to-black'
    }
  ];

  // Sistema de bolhas coloridas com pontuações
  const coloredBubbles = {
    air: { color: '#E0F2FE', points: 5, size: 40 },        // Azul claro - básica
    oxygen: { color: '#60A5FA', points: 15, size: 55 },    // Azul médio - média
    pink: { color: '#F9A8D4', points: 20, size: 45 },      // Rosa - boa
    purple: { color: '#C084FC', points: 25, size: 45 },    // Roxo - muito boa
    yellow: { color: '#FDE047', points: 30, size: 45 },    // Amarelo - ótima
    green: { color: '#86EFAC', points: 35, size: 45 },     // Verde - excelente
    orange: { color: '#FB923C', points: 40, size: 45 },    // Laranja - super
    treasure: { color: '#FFD700', points: 50, size: 50 },  // Dourado - tesouro
    pearl: { color: '#FFF0F5', points: 100, size: 40 }     // Pérola - rara
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
  };

  // Criar nova bolha
  const createBubble = () => {
    if (!isPlaying || !gameAreaRef.current) return;
    
    const config = levelConfigs[currentLevel - 1];
    
    // Verificar se já spawnou todas as bolhas do nível
    if (bubblesSpawned >= config.totalBubbles) return;
    
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    
    // Determinar tipo de bolha
    const rand = Math.random();
    let type: Bubble['type'] = 'air';
    let bubbleConfig = coloredBubbles.air;
    let horizontalMovement = 0;
    
    if (rand < config.minePercentage) {
      // Mina submarina
      type = 'mine';
      bubbleConfig = { color: '#8B0000', points: -20, size: 45 };
    } else {
      // Selecionar bolha colorida baseada no nível
      const colorRand = Math.random();
      
      if (currentLevel === 1) {
        // Nível 1: Mais bolhas básicas, algumas coloridas
        if (colorRand < 0.5) type = 'air';
        else if (colorRand < 0.7) type = 'oxygen';
        else if (colorRand < 0.85) type = 'pink';
        else if (colorRand < 0.95) type = 'purple';
        else type = 'treasure';
      } else if (currentLevel === 2) {
        // Nível 2: Mais variedade
        if (colorRand < 0.3) type = 'air';
        else if (colorRand < 0.5) type = 'oxygen';
        else if (colorRand < 0.65) type = 'pink';
        else if (colorRand < 0.75) type = 'purple';
        else if (colorRand < 0.85) type = 'yellow';
        else if (colorRand < 0.95) type = 'green';
        else type = 'treasure';
      } else if (currentLevel === 3) {
        // Nível 3: Todas as cores
        if (colorRand < 0.2) type = 'air';
        else if (colorRand < 0.35) type = 'oxygen';
        else if (colorRand < 0.5) type = 'pink';
        else if (colorRand < 0.6) type = 'purple';
        else if (colorRand < 0.7) type = 'yellow';
        else if (colorRand < 0.8) type = 'green';
        else if (colorRand < 0.9) type = 'orange';
        else if (colorRand < 0.97) type = 'treasure';
        else type = 'pearl';
      } else {
        // Níveis 4 e 5: Mais bolhas valiosas (compensar dificuldade)
        if (colorRand < 0.1) type = 'air';
        else if (colorRand < 0.2) type = 'oxygen';
        else if (colorRand < 0.35) type = 'purple';
        else if (colorRand < 0.5) type = 'yellow';
        else if (colorRand < 0.65) type = 'green';
        else if (colorRand < 0.75) type = 'orange';
        else if (colorRand < 0.9) type = 'treasure';
        else type = 'pearl';
      }
      
      bubbleConfig = coloredBubbles[type as keyof typeof coloredBubbles];
      
      // Movimento horizontal para algumas bolhas especiais
      if (type === 'pearl' || type === 'treasure') {
        horizontalMovement = (Math.random() - 0.5) * 1.5;
      }
    }
    
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * (gameArea.width - bubbleConfig.size),
      y: gameArea.height + bubbleConfig.size,
      size: bubbleConfig.size + (Math.random() * 10 - 5), // Variação de tamanho
      speed: 2, // VELOCIDADE CONSTANTE
      color: bubbleConfig.color,
      points: bubbleConfig.points,
      type: type,
      popped: false,
      opacity: 1,
      horizontalMovement: horizontalMovement
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
      
      let newY = bubble.y - bubble.speed; // Velocidade constante
      let newX = bubble.x;
      
      // Movimento horizontal para bolhas especiais
      if (bubble.horizontalMovement) {
        newX += bubble.horizontalMovement;
        
        // Inverter direção nas bordas
        if (newX <= 0 || newX >= gameArea.width - bubble.size) {
          bubble.horizontalMovement = -bubble.horizontalMovement;
          newX = Math.max(0, Math.min(gameArea.width - bubble.size, newX));
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

  // Criar partículas de explosão
  const createParticles = (x: number, y: number, color: string, isExplosion: boolean = false) => {
    const newParticles: Particle[] = [];
    const particleCount = isExplosion ? 20 : 10;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = isExplosion ? Math.random() * 5 + 3 : Math.random() * 3 + 2;
      
      newParticles.push({
        id: Date.now() + i,
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: isExplosion ? '#FF4500' : color,
        life: 1
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Atualizar partículas
  const updateParticles = () => {
    setParticles(prev => prev.map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      vy: particle.vy + 0.2,
      life: particle.life - 0.03
    })).filter(particle => particle.life > 0));
  };

  // Som de estouro
  const playPopSound = (type: Bubble['type']) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'mine') {
        // Som de explosão
        const noise = audioContext.createOscillator();
        const noiseGain = audioContext.createGain();
        noise.type = 'sawtooth';
        noise.frequency.value = 100;
        noise.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        noiseGain.gain.setValueAtTime(0.5, audioContext.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        noise.start(audioContext.currentTime);
        noise.stop(audioContext.currentTime + 0.3);
        
        oscillator.frequency.value = 50;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.7, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } else if (type === 'pearl' || type === 'treasure') {
        // Som especial
        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else {
        // Som de bolha normal com variação baseada na cor
        const freqMap = {
          air: 600,
          oxygen: 700,
          pink: 800,
          purple: 900,
          yellow: 1000,
          green: 1100,
          orange: 1200
        };
        oscillator.frequency.value = freqMap[type as keyof typeof freqMap] || 600;
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

  // Estourar bolha
  const popBubble = (bubble: Bubble, x: number, y: number) => {
    if (bubble.popped) return;
    
    setBubbles(prev => prev.map(b => 
      b.id === bubble.id ? { ...b, popped: true } : b
    ));
    
    playPopSound(bubble.type);
    
    if (bubble.type === 'mine') {
      createParticles(x, y, bubble.color, true);
      setScore(prev => Math.max(0, prev + bubble.points));
      setCombo(0);
      setOxygenLevel(prev => Math.max(0, prev - 10));
    } else {
      createParticles(x, y, bubble.color);
      setPoppedBubbles(prev => prev + 1);
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => Math.max(max, newCombo));
        return newCombo;
      });
      
      const comboMultiplier = 1 + (combo * 0.1);
      const finalPoints = Math.round(bubble.points * comboMultiplier);
      setScore(prev => prev + finalPoints);
      
      // Recuperar oxigênio baseado no tipo
      if (bubble.type === 'oxygen') {
        setOxygenLevel(prev => Math.min(100, prev + 10));
      } else if (bubble.type === 'pearl') {
        setOxygenLevel(prev => Math.min(100, prev + 20));
      } else {
        setOxygenLevel(prev => Math.min(100, prev + 3));
      }
    }
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
  }, [isPlaying]);

  // Spawn de bolhas
  useEffect(() => {
    if (!isPlaying) return;
    
    const config = levelConfigs[currentLevel - 1];
    
    const spawnInterval = setInterval(() => {
      if (bubblesSpawned < config.totalBubbles) {
        createBubble();
      }
    }, config.spawnRate);
    
    return () => clearInterval(spawnInterval);
  }, [isPlaying, currentLevel, bubblesSpawned]);

  // Drenar oxigênio
  useEffect(() => {
    if (!isPlaying) return;
    
    const config = levelConfigs[currentLevel - 1];
    const drainInterval = setInterval(() => {
      setOxygenLevel(prev => {
        const newLevel = Math.max(0, prev - config.oxygenDrain);
        if (newLevel === 0) {
          endGame();
        }
        return newLevel;
      });
    }, 1000);
    
    return () => clearInterval(drainInterval);
  }, [isPlaying, currentLevel]);

  // Verificar fim do nível
  useEffect(() => {
    if (!isPlaying) return;
    
    const config = levelConfigs[currentLevel - 1];
    
    if (bubblesSpawned >= config.totalBubbles && bubbles.length === 0) {
      if (currentLevel < 5) {
        setCompletedLevels(prev => [...prev, currentLevel]);
        setLevelMessage(`🌊 Profundidade ${config.depth} Completa!`);
        setShowLevelTransition(true);
        
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
        }, 2500);
      } else {
        endGame();
      }
    }
  }, [isPlaying, currentLevel, bubblesSpawned, bubbles]);

  const endGame = () => {
    setIsPlaying(false);
    setShowResults(true);
    if (currentLevel === 5 && bubblesSpawned >= levelConfigs[4].totalBubbles) {
      setCompletedLevels(prev => [...prev, currentLevel]);
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
          atividade_nome: 'Oceano de Bolhas',
          pontuacao_final: score,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!
        
🌊 Resultado do Oceano de Bolhas:
- Profundidade Alcançada: ${levelConfigs[Math.max(...completedLevels, 0)]?.depth || '0m'}
- Bolhas Coletadas: ${poppedBubbles}
- Precisão: ${accuracy}%
- Combo Máximo: ${maxCombo}
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader 
        title="Oceano de Bolhas"
        icon="🌊"
        onSave={handleSaveSession}
        isSaveDisabled={salvando}
        showSaveButton={showResults}
      />

      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {!jogoIniciado ? (
          // Tela inicial
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
                  Mila convida você para uma aventura submarina!
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">🎯 Objetivo:</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Colete bolhas coloridas! Cada cor vale pontos diferentes!
                  </p>
                </div>
                
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">🫧 Pontuação das Cores:</h3>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>🔵 Azul = 5 pts</li>
                    <li>💗 Rosa = 20 pts</li>
                    <li>💜 Roxo = 25 pts</li>
                    <li>💛 Amarelo = 30 pts</li>
                    <li>💚 Verde = 35 pts</li>
                    <li>🧡 Laranja = 40 pts</li>
                    <li>💎 Pérola = 100 pts!</li>
                  </ul>
                </div>
                
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">📊 Níveis:</h3>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>Nível 1: 200 bolhas!</li>
                    <li>Nível 2: 150 bolhas</li>
                    <li>Nível 3: 100 bolhas</li>
                    <li>Nível 4: 60 bolhas</li>
                    <li>Nível 5: 40 bolhas</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startActivity}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🤿 Mergulhar no Oceano
              </button>
              <p className="text-sm text-gray-600 mt-2">Velocidade constante, foco na diferenciação!</p>
            </div>
          </div>
        ) : !showResults ? (
          // Área de jogo
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
              <div className="grid grid-cols-5 gap-2">
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-indigo-800">
                    {levelConfigs[currentLevel - 1].depth}
                  </div>
                  <div className="text-xs text-indigo-600">Profundidade</div>
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
                    {poppedBubbles}
                  </div>
                  <div className="text-xs text-green-600">Coletadas</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-purple-800">
                    {bubblesRemaining}
                  </div>
                  <div className="text-xs text-purple-600">Restantes</div>
                </div>
              </div>
            </div>

            {/* Barra de Oxigênio */}
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

            {/* Área do jogo */}
            <div 
              ref={gameAreaRef}
              className={`relative bg-gradient-to-b ${levelConfigs[currentLevel - 1].bgGradient} rounded-xl shadow-lg overflow-hidden cursor-crosshair`}
              style={{ height: isMobile ? '450px' : '500px' }}
              onMouseDown={handleInteraction}
              onTouchStart={handleInteraction}
            >
              {/* Imagem da Mila no fundo - CORRIGIDA */}
              <div 
                className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `url(https://raw.githubusercontent.com/ClaudemirWork/teaplus-working/main/public/images/mila_feiticeira_resultado.webp)`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />

              {/* Transição de nível */}
              {showLevelTransition && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-30">
                  <div className="text-center animate-bounce">
                    <div className="text-4xl sm:text-6xl mb-2">🌊</div>
                    <div className="text-xl sm:text-3xl font-bold text-blue-600">
                      {levelMessage}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 mt-2">
                      Descendo para: {levelConfigs[currentLevel]?.name}
                    </div>
                  </div>
                </div>
              )}

              {/* Bolhas */}
              {bubbles.map(bubble => (
                <div
                  key={bubble.id}
                  className={`absolute rounded-full transition-opacity ${
                    bubble.popped ? 'pointer-events-none' : 'cursor-pointer'
                  }`}
                  style={{
                    left: `${bubble.x}px`,
                    top: `${bubble.y}px`,
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    background: bubble.type === 'mine' 
                      ? 'radial-gradient(circle, #8B0000, #4B0000)'
                      : bubble.type === 'treasure'
                      ? 'radial-gradient(circle, #FFD700, #FFA500)'
                      : bubble.type === 'pearl'
                      ? 'radial-gradient(circle, #FFF0F5, #FFB6C1)'
                      : bubble.color,
                    border: bubble.type === 'pearl' ? '2px solid #FFD700' :
                            bubble.type === 'treasure' ? '2px solid #FFA500' :
                            bubble.type === 'mine' ? '2px solid #FF0000' : 
                            '1px solid rgba(255,255,255,0.3)',
                    opacity: bubble.opacity,
                    boxShadow: bubble.type === 'pearl' ? '0 0 20px #FFF0F5' :
                               bubble.type === 'treasure' ? '0 0 15px #FFD700' :
                               '0 2px 8px rgba(0,0,0,0.2)',
                    transform: `scale(${bubble.popped ? 1.5 : 1})`,
                  }}
                >
                  {/* Ícones nas bolhas especiais */}
                  {bubble.type === 'mine' && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                      💣
                    </div>
                  )}
                  {bubble.type === 'pearl' && (
                    <div className="absolute inset-0 flex items-center justify-center text-xl">
                      🦪
                    </div>
                  )}
                  {bubble.type === 'treasure' && (
                    <div className="absolute inset-0 flex items-center justify-center text-xl">
                      💰
                    </div>
                  )}
                  {/* Mostrar pontos nas bolhas coloridas */}
                  {!['mine', 'pearl', 'treasure'].includes(bubble.type) && (
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                      +{bubble.points}
                    </div>
                  )}
                </div>
              ))}

              {/* Partículas */}
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: `${particle.x}px`,
                    top: `${particle.y}px`,
                    width: '6px',
                    height: '6px',
                    background: particle.color,
                    opacity: particle.life
                  }}
                />
              ))}

              {/* Aviso de oxigênio baixo */}
              {oxygenLevel < 30 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                    ⚠️ OXIGÊNIO BAIXO!
                  </div>
                </div>
              )}

              {/* Combo display */}
              {combo > 5 && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-lg">
                    🔥 COMBO x{combo}!
                  </div>
                </div>
              )}
            </div>

            {/* Indicador de profundidade */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-16 h-10 rounded-lg flex flex-col items-center justify-center text-xs font-bold
                    ${completedLevels.includes(level) ? 'bg-blue-500 text-white' :
                      level === currentLevel ? 'bg-cyan-400 text-black animate-pulse' :
                      'bg-gray-300 text-gray-600'}`}
                >
                  <div>{levelConfigs[level - 1].depth}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Tela de resultados
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="text-5xl sm:text-6xl mb-4">
                {completedLevels.length === 5 ? '🏆' : 
                 accuracy > 70 ? '🌊' : '🤿'}
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {completedLevels.length === 5 ? 'Explorador das Profundezas!' : 
                 accuracy > 70 ? 'Mergulhador Experiente!' : 'Boa Exploração!'}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600">
                Você alcançou {levelConfigs[Math.max(...completedLevels, 0)]?.depth || '0m'} de profundidade!
              </p>
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
                  {accuracy}%
                </div>
                <div className="text-xs text-green-600">Precisão</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-orange-800">
                  x{maxCombo}
                </div>
                <div className="text-xs text-orange-600">Combo Máx</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-indigo-800">
                  {completedLevels.length}/5
                </div>
                <div className="text-xs text-indigo-600">Níveis</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">🌊 Relatório de Mergulho:</h4>
              <div className="space-y-1 text-xs sm:text-sm">
                <p>• Profundidade Máxima: {levelConfigs[Math.max(...completedLevels, 0)]?.depth || '0m'}</p>
                <p>• Bolhas Coletadas: {poppedBubbles}</p>
                <p>• Minas Evitadas: {missedBubbles}</p>
                <p>• Habilidade: {accuracy > 80 ? '⭐⭐⭐' : accuracy > 60 ? '⭐⭐' : '⭐'}</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={voltarInicio}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                🔄 Mergulhar Novamente
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
