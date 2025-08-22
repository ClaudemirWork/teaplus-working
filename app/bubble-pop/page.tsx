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
  type: 'normal' | 'golden' | 'rainbow' | 'bomb' | 'freeze';
  popped: boolean;
  opacity: number;
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

export default function BubblePop() {
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
  const [timeLeft, setTimeLeft] = useState(30);
  const [showResults, setShowResults] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [totalBubbles, setTotalBubbles] = useState(0);
  const [poppedBubbles, setPoppedBubbles] = useState(0);
  const [missedBubbles, setMissedBubbles] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [powerUpActive, setPowerUpActive] = useState<string | null>(null);
  const [powerUpTime, setPowerUpTime] = useState(0);
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [levelMessage, setLevelMessage] = useState('');
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Configuração dos níveis
  const levelConfigs = [
    { level: 1, name: 'Aquecimento', duration: 30, spawnRate: 1500, speedMultiplier: 1, specialChance: 0.1 },
    { level: 2, name: 'Acelerando', duration: 35, spawnRate: 1200, speedMultiplier: 1.2, specialChance: 0.15 },
    { level: 3, name: 'Desafiador', duration: 40, spawnRate: 1000, speedMultiplier: 1.5, specialChance: 0.2 },
    { level: 4, name: 'Intenso', duration: 45, spawnRate: 800, speedMultiplier: 1.8, specialChance: 0.25 },
    { level: 5, name: 'Extremo', duration: 50, spawnRate: 600, speedMultiplier: 2, specialChance: 0.3 }
  ];

  // Cores das bolhas
  const bubbleColors = [
    '#EF4444', // Vermelho
    '#3B82F6', // Azul
    '#10B981', // Verde
    '#F59E0B', // Amarelo
    '#8B5CF6', // Roxo
    '#EC4899', // Rosa
    '#06B6D4', // Ciano
    '#F97316'  // Laranja
  ];

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
    setTimeLeft(levelConfigs[0].duration);
    setShowResults(false);
    setTotalBubbles(0);
    setPoppedBubbles(0);
    setMissedBubbles(0);
    setCompletedLevels([]);
    setPowerUpActive(null);
    setPowerUpTime(0);
  };

  // Criar nova bolha
  const createBubble = () => {
    if (!isPlaying || !gameAreaRef.current) return;
    
    const config = levelConfigs[currentLevel - 1];
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    
    // Determinar tipo de bolha
    const rand = Math.random();
    let type: Bubble['type'] = 'normal';
    let color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    let points = 10;
    let size = Math.random() * 30 + 30; // 30-60px
    
    if (rand < config.specialChance) {
      const specialRand = Math.random();
      if (specialRand < 0.3) {
        type = 'golden';
        color = '#FFD700';
        points = 50;
        size = 50;
      } else if (specialRand < 0.5) {
        type = 'rainbow';
        color = 'rainbow';
        points = 100;
        size = 60;
      } else if (specialRand < 0.7) {
        type = 'bomb';
        color = '#DC2626';
        points = -30;
        size = 45;
      } else {
        type = 'freeze';
        color = '#60A5FA';
        points = 20;
        size = 45;
      }
    }
    
    // Bolhas menores = mais pontos
    if (type === 'normal') {
      if (size < 40) points = 20;
      else if (size < 50) points = 15;
      else points = 10;
    }
    
    const newBubble: Bubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * (gameArea.width - size),
      y: gameArea.height + size,
      size: size,
      speed: (Math.random() * 2 + 1) * config.speedMultiplier,
      color: color,
      points: points,
      type: type,
      popped: false,
      opacity: 1
    };
    
    setBubbles(prev => [...prev, newBubble]);
    setTotalBubbles(prev => prev + 1);
  };

  // Atualizar posição das bolhas
  const updateBubbles = () => {
    if (!gameAreaRef.current) return;
    
    const gameHeight = gameAreaRef.current.getBoundingClientRect().height;
    
    setBubbles(prev => prev.map(bubble => {
      if (bubble.popped) {
        return { ...bubble, opacity: bubble.opacity - 0.05 };
      }
      
      let newY = bubble.y - bubble.speed;
      
      // Power-up freeze ativo
      if (powerUpActive === 'freeze') {
        newY = bubble.y - bubble.speed * 0.3;
      }
      
      // Bolha saiu da tela
      if (newY < -bubble.size) {
        if (!bubble.popped && bubble.type !== 'bomb') {
          setMissedBubbles(prev => prev + 1);
          setCombo(0); // Reset combo
        }
        return { ...bubble, y: newY, opacity: 0 };
      }
      
      return { ...bubble, y: newY };
    }).filter(bubble => bubble.opacity > 0));
  };

  // Criar partículas de explosão
  const createParticles = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    const particleCount = 10;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = Math.random() * 3 + 2;
      
      newParticles.push({
        id: Date.now() + i,
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: color === 'rainbow' ? bubbleColors[Math.floor(Math.random() * bubbleColors.length)] : color,
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
      vy: particle.vy + 0.3, // Gravidade
      life: particle.life - 0.03
    })).filter(particle => particle.life > 0));
  };

  // Estourar bolha
  const popBubble = (bubble: Bubble, x: number, y: number) => {
    if (bubble.popped) return;
    
    // Marcar como estourada
    setBubbles(prev => prev.map(b => 
      b.id === bubble.id ? { ...b, popped: true } : b
    ));
    
    // Som de pop
    playPopSound(bubble.type);
    
    // Criar partículas
    createParticles(x, y, bubble.color);
    
    // Processar tipo de bolha
    if (bubble.type === 'bomb') {
      // Bomba - perde pontos e combo
      setScore(prev => Math.max(0, prev + bubble.points));
      setCombo(0);
    } else {
      // Bolha normal ou especial
      setPoppedBubbles(prev => prev + 1);
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => Math.max(max, newCombo));
        return newCombo;
      });
      
      // Calcular pontos com combo
      const comboMultiplier = 1 + (combo * 0.1);
      const finalPoints = Math.round(bubble.points * comboMultiplier);
      setScore(prev => prev + finalPoints);
      
      // Ativar power-ups
      if (bubble.type === 'freeze') {
        setPowerUpActive('freeze');
        setPowerUpTime(5);
      } else if (bubble.type === 'rainbow') {
        // Estourar todas as bolhas visíveis
        popAllVisibleBubbles();
      }
    }
  };

  // Estourar todas as bolhas visíveis (power-up rainbow)
  const popAllVisibleBubbles = () => {
    if (!gameAreaRef.current) return;
    
    setBubbles(prev => prev.map(bubble => {
      if (!bubble.popped && bubble.type !== 'bomb') {
        createParticles(bubble.x + bubble.size/2, bubble.y + bubble.size/2, bubble.color);
        setPoppedBubbles(p => p + 1);
        setScore(s => s + bubble.points);
        return { ...bubble, popped: true };
      }
      return bubble;
    }));
  };

  // Som de estouro SINCRONIZADO
  const playPopSound = (type: Bubble['type']) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Som diferente para cada tipo
      switch(type) {
        case 'golden':
          oscillator.frequency.value = 1000;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'rainbow':
          // Som mágico
          for (let i = 0; i < 3; i++) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = 800 + i * 200;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.1, audioContext.currentTime + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2 + i * 0.05);
            osc.start(audioContext.currentTime + i * 0.05);
            osc.stop(audioContext.currentTime + 0.2 + i * 0.05);
          }
          break;
        case 'bomb':
          oscillator.frequency.value = 150;
          oscillator.type = 'sawtooth';
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        default:
          // Som de pop normal
          oscillator.frequency.value = 600 + Math.random() * 200;
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

  // Handle de clique/toque
  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!gameAreaRef.current || !isPlaying) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    // Verificar se acertou alguma bolha
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
  }, [isPlaying, powerUpActive]);

  // Spawn de bolhas
  useEffect(() => {
    if (!isPlaying) return;
    
    const config = levelConfigs[currentLevel - 1];
    const spawnInterval = setInterval(() => {
      createBubble();
    }, config.spawnRate);
    
    return () => clearInterval(spawnInterval);
  }, [isPlaying, currentLevel]);

  // Timer do nível
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  // Power-up timer
  useEffect(() => {
    if (!powerUpActive || powerUpTime <= 0) return;
    
    const timer = setTimeout(() => {
      setPowerUpTime(prev => {
        if (prev <= 1) {
          setPowerUpActive(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [powerUpActive, powerUpTime]);

  // Mudança de nível
  useEffect(() => {
    if (isPlaying && timeLeft === 0) {
      if (currentLevel < 5) {
        // Próximo nível
        setCompletedLevels(prev => [...prev, currentLevel]);
        setLevelMessage(`🎉 Nível ${currentLevel} Completo!`);
        setShowLevelTransition(true);
        
        setTimeout(() => {
          const nextLevel = currentLevel + 1;
          const config = levelConfigs[nextLevel - 1];
          setCurrentLevel(nextLevel);
          setTimeLeft(config.duration);
          setShowLevelTransition(false);
          setBubbles([]);
          setParticles([]);
          setCombo(0);
        }, 2500);
      } else {
        // Fim do jogo
        endGame();
      }
    }
  }, [timeLeft, isPlaying, currentLevel]);

  const endGame = () => {
    setIsPlaying(false);
    setShowResults(true);
    setCompletedLevels(prev => [...prev, currentLevel]);
    
    // Calcular precisão
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
          atividade_nome: 'Estouro de Bolhas',
          pontuacao_final: score,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!
        
🎈 Resultado do Bubble Pop:
- Níveis Completados: ${completedLevels.length}/5
- Bolhas Estouradas: ${poppedBubbles}
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
        title="Estouro de Bolhas"
        icon="🎈"
        onSave={handleSaveSession}
        isSaveDisabled={salvando}
        showSaveButton={showResults}
      />

      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {!jogoIniciado ? (
          // Tela inicial
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">🎯 Objetivo:</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Estoure as bolhas antes que escapem! 5 níveis progressivos.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>Toque para estourar</li>
                    <li>Combos = mais pontos</li>
                    <li>Evite bombas 💣</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">⭐ Especiais:</h3>
                  <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>🟡 Dourada = 50pts</li>
                    <li>🌈 Arco-íris = estoura tudo</li>
                    <li>❄️ Gelo = tempo lento</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startActivity}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🚀 Iniciar Aventura das Bolhas
              </button>
              <p className="text-sm text-gray-600 mt-2">5 níveis de diversão!</p>
            </div>
          </div>
        ) : !showResults ? (
          // Área de jogo
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
              <div className="grid grid-cols-5 gap-2">
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-purple-800">
                    Nível {currentLevel}
                  </div>
                  <div className="text-xs text-purple-600">Fase</div>
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
                  <div className="text-xs text-green-600">Estouradas</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-red-800">
                    {timeLeft}s
                  </div>
                  <div className="text-xs text-red-600">Tempo</div>
                </div>
              </div>
            </div>

            {/* Power-up ativo */}
            {powerUpActive && (
              <div className="text-center">
                <div className="inline-block bg-cyan-400/90 text-white px-4 py-2 rounded-lg font-bold animate-pulse">
                  ❄️ Tempo Lento Ativo: {powerUpTime}s
                </div>
              </div>
            )}

            {/* Área do jogo */}
            <div 
              ref={gameAreaRef}
              className="relative bg-gradient-to-b from-sky-200 to-blue-400 rounded-xl shadow-lg overflow-hidden cursor-crosshair"
              style={{ height: isMobile ? '450px' : '500px' }}
              onMouseDown={handleInteraction}
              onTouchStart={handleInteraction}
            >
              {/* Transição de nível */}
              {showLevelTransition && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-30">
                  <div className="text-center animate-bounce">
                    <div className="text-4xl sm:text-6xl mb-2">🎉</div>
                    <div className="text-xl sm:text-3xl font-bold text-blue-600">
                      {levelMessage}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 mt-2">
                      Próximo: {levelConfigs[currentLevel]?.name}
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
                    background: bubble.color === 'rainbow' 
                      ? 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)'
                      : bubble.color,
                    border: bubble.type === 'golden' ? '3px solid #FFA500' :
                            bubble.type === 'bomb' ? '3px solid #8B0000' :
                            bubble.type === 'freeze' ? '3px solid #FFFFFF' : 'none',
                    opacity: bubble.opacity,
                    boxShadow: bubble.type === 'golden' ? '0 0 20px #FFD700' :
                               bubble.type === 'rainbow' ? '0 0 20px rgba(255,255,255,0.8)' :
                               '0 4px 6px rgba(0,0,0,0.1)',
                    transform: `scale(${bubble.popped ? 1.5 : 1})`,
                    zIndex: bubble.type === 'golden' || bubble.type === 'rainbow' ? 10 : 1
                  }}
                >
                  {/* Ícone especial */}
                  {bubble.type === 'bomb' && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                      💣
                    </div>
                  )}
                  {bubble.type === 'freeze' && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
                      ❄️
                    </div>
                  )}
                  {bubble.type === 'golden' && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                      +50
                    </div>
                  )}
                  {bubble.type === 'rainbow' && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xl animate-spin">
                      ✨
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

              {/* Combo display */}
              {combo > 5 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                  <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-lg">
                    🔥 COMBO x{combo}!
                  </div>
                </div>
              )}
            </div>

            {/* Indicador de níveis */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    ${completedLevels.includes(level) ? 'bg-green-500 text-white' :
                      level === currentLevel ? 'bg-yellow-400 text-black animate-pulse' :
                      'bg-gray-300 text-gray-600'}`}
                >
                  {level}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Tela de resultados
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="text-5xl sm:text-6xl mb-4">
                {accuracy > 80 ? '🏆' : accuracy > 60 ? '🎉' : '💪'}
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {accuracy > 80 ? 'Mestre das Bolhas!' : 
                 accuracy > 60 ? 'Muito Bem!' : 'Bom Treino!'}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600">
                {completedLevels.length} níveis completos com {poppedBubbles} bolhas estouradas!
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
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-purple-800">
                  {missedBubbles}
                </div>
                <div className="text-xs text-purple-600">Perdidas</div>
              </div>
            </div>

            {/* Estatísticas por nível */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">📊 Desempenho:</h4>
              <div className="space-y-1 text-xs sm:text-sm">
                <p>• Níveis Completados: {completedLevels.length}/5</p>
                <p>• Taxa de Acerto: {accuracy}%</p>
                <p>• Velocidade de Reação: {accuracy > 70 ? '⚡ Rápida' : '🐌 Pode melhorar'}</p>
                <p>• Coordenação: {maxCombo > 10 ? '✅ Excelente' : '⚠️ Pratique mais'}</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={voltarInicio}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                🔄 Jogar Novamente
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
