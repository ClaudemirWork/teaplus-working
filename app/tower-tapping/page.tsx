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
  offset: number;
  quality: 'perfect' | 'good' | 'poor';
  isSpecial: boolean;
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

export default function TowerTappingInfinite() {
  const router = useRouter();
  const supabase = createClient();
  const animationRef = useRef<number>();
  
  // Controle de telas
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
  
  // Estados do jogo - SIMPLIFICADOS
  const [isPlaying, setIsPlaying] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
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
  const [tapHistory, setTapHistory] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [totalTaps, setTotalTaps] = useState(0);
  const [isCollapsing, setIsCollapsing] = useState(false);

  // Estados salvos
  const [bestHeight, setBestHeight] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  useEffect(() => {
    const savedHeight = localStorage.getItem('towerTapping_bestHeight');
    const savedStars = localStorage.getItem('towerTapping_totalStars');
    
    if (savedHeight) setBestHeight(parseInt(savedHeight));
    if (savedStars) setTotalStars(parseInt(savedStars));
    
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startActivity = () => {
    setCurrentScreen('game');
    setIsPlaying(true);
    setBlocks([]);
    setParticles([]);
    setScore(0);
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
    setTapHistory([]);
    setTotalTaps(0);
    setIsCollapsing(false);
    setGameMessage('Comece a construir sua torre!');
  };

  const showGameMessage = (message: string, duration: number = 3000) => {
    setGameMessage(message);
    setTimeout(() => setGameMessage(''), duration);
  };

  const createParticles = (x: number, y: number, type: string = 'normal', count: number = 8) => {
    const newParticles: Particle[] = [];
    const colors = type === 'perfect' ? ['#10B981', '#34D399'] : 
                  type === 'good' ? ['#3B82F6', '#60A5FA'] : 
                  type === 'explosion' ? ['#FF6B6B', '#FFD93D', '#6BCF7F'] :
                  ['#F59E0B', '#FBBF24'];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = Math.random() * 3 + 2;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1
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

  const playSound = (type: 'perfect' | 'good' | 'poor' | 'collapse' | 'levelup', attempt: number = 0) => {
    if (attempt > 2) return; // Máximo 3 tentativas
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Verificar se precisa de interação do usuário
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          playSound(type, attempt + 1);
        }).catch(() => {
          // Falha silenciosa
        });
        return;
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch (type) {
        case 'perfect':
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(659, audioContext.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.15);
          break;
          
        case 'good':
          oscillator.frequency.value = 440;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
          
        case 'poor':
          oscillator.frequency.value = 220;
          oscillator.type = 'sawtooth';
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.08);
          break;
          
        case 'collapse':
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.8);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.8);
          break;
          
        case 'levelup':
          [523, 659, 784].forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.15, audioContext.currentTime + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3 + i * 0.1);
            osc.start(audioContext.currentTime + i * 0.1);
            osc.stop(audioContext.currentTime + 0.3 + i * 0.1);
          });
          break;
      }
    } catch (e) {
      // Falha silenciosa - audio não suportado
    }
  };

  const createCelebrationBurst = () => {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
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
      const bpm = Math.round(60000 / avgInterval);
      setTargetBPM(bpm);
      showGameMessage(`Ritmo estabelecido: ${bpm} BPM`, 2000);
    }
    
    // Calcular qualidade do tap baseado no ritmo
    let quality: 'perfect' | 'good' | 'poor' = 'perfect';
    let offset = 0;
    const maxOffset = isMobile ? 30 : 40;
    
    if (targetBPM && newTapHistory.length >= 2) {
      const lastInterval = currentTime - newTapHistory[newTapHistory.length - 2];
      const targetInterval = 60000 / targetBPM;
      const deviation = Math.abs(lastInterval - targetInterval) / targetInterval;
      
      if (deviation < 0.12) {
        quality = 'perfect';
        offset = (Math.random() - 0.5) * (maxOffset * 0.2);
      } else if (deviation < 0.28) {
        quality = 'good'; 
        offset = (Math.random() - 0.5) * (maxOffset * 0.6);
      } else {
        quality = 'poor';
        offset = (Math.random() - 0.5) * maxOffset;
      }
    }
    
    // Adicionar bloco
    const basePoints = quality === 'perfect' ? 100 : quality === 'good' ? 60 : 30;
    const finalPoints = Math.round(basePoints * multiplier);
    const isSpecial = blocks.length > 0 && (blocks.length + 1) % 10 === 0;
    
    const newBlock: Block = {
      id: Date.now() + Math.random(),
      offset,
      quality,
      isSpecial
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setScore(prev => prev + finalPoints);
    setTotalTaps(prev => prev + 1);
    
    // Criar partículas na posição do novo bloco
    const gameArea = document.querySelector('.tower-area');
    if (gameArea) {
      const rect = gameArea.getBoundingClientRect();
      const centerX = rect.width / 2;
      const blockY = 100 + (blocks.length * (isMobile ? 27 : 32));
      createParticles(centerX + offset, blockY, quality, quality === 'perfect' ? 12 : 8);
    }
    
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
          setMultiplier(2);
          setMultiplierTime(10);
          showGameMessage('🔥 SEQUÊNCIA PERFEITA! Multiplicador x2!', 2500);
          createCelebrationBurst();
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
            showGameMessage(`⚠️ Cuidado! ${newLives} vidas restantes`, 2000);
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
    
    // Level up da torre a cada 25 blocos
    const newHeight = blocks.length + 1;
    if (newHeight % 25 === 0) {
      const newLevel = Math.floor(newHeight / 25) + 1;
      setTowerLevel(newLevel);
      setShowLevelUp(true);
      playSound('levelup');
      showGameMessage(`🏗️ NÍVEL ${newLevel} ALCANÇADO!`, 3000);
      createCelebrationBurst();
      
      // Recuperar vida a cada level up
      setLives(prev => Math.min(prev + 1, 3));
      
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    
    playSound(quality);
  };

  const triggerCollapse = () => {
    setIsCollapsing(true);
    setIsPlaying(false);
    playSound('collapse');
    showGameMessage('💥 TORRE DESMORONOU!', 3000);
    
    // Criar explosão de partículas
    const gameArea = document.querySelector('.tower-area');
    if (gameArea) {
      const rect = gameArea.getBoundingClientRect();
      blocks.forEach((_, index) => {
        setTimeout(() => {
          createParticles(
            rect.width / 2 + Math.random() * 100 - 50,
            200 + index * 20,
            'explosion',
            15
          );
        }, index * 100);
      });
    }
    
    // Mostrar resultados após animação
    setTimeout(() => {
      endGame();
    }, 2500);
  };

  const endGame = () => {
    setShowResults(true);
    
    // Atualizar recordes
    if (blocks.length > bestHeight) {
      setBestHeight(blocks.length);
      localStorage.setItem('towerTapping_bestHeight', blocks.length.toString());
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

  // Atualizar multiplicador
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

  // Game loop simples apenas para partículas
  useEffect(() => {
    if (!isPlaying && !isCollapsing) return;
    
    const gameLoop = () => {
      updateParticles();
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
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!
        
🏗️ Torre Construída:
- Altura: ${blocks.length} blocos
- Nível da Torre: ${towerLevel}
- Sequência Perfeita Máxima: ${maxPerfectStreak}
- Combo Máximo: ${maxCombo}
- Pontuação: ${score} pontos`);
        
        router.push('/dashboard');
      }
    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  };

  // Calcular dimensões responsivas
  const blockWidth = isMobile ? 'w-16' : 'w-24';
  const blockHeight = isMobile ? 'h-6' : 'h-8';
  const blockSpacing = isMobile ? 27 : 32;
  const maxVisibleBlocks = isMobile ? 12 : 15;
  const gameAreaHeight = isMobile ? '400px' : '500px';

  // TELAS DO JOGO
  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-orange-300 via-red-400 to-purple-500 overflow-hidden">
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
            <span><b>3 erros</b> fazem a torre desmoronar!</span>
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
                      {blocks.length}
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

              {/* Área da Torre - SIMPLIFICADA */}
              <div 
                className="tower-area relative bg-gradient-to-b from-sky-200 to-sky-100 rounded-xl shadow-lg overflow-hidden"
                style={{ height: gameAreaHeight }}
              >
                {/* Linha guia central */}
                <div className="absolute left-1/2 top-0 bottom-16 w-0.5 bg-red-300 opacity-40 z-10 transform -translate-x-0.5" />
                
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

                {/* Container da Torre - USANDO ABORDAGEM ORIGINAL */}
                <div className="absolute bottom-16 left-0 right-0" style={{ height: `calc(${gameAreaHeight} - 64px)` }}>
                  <div className="relative h-full flex flex-col-reverse items-center overflow-hidden">
                    {/* Blocos da Torre - SIMPLIFICADOS */}
                    {blocks.slice(-maxVisibleBlocks).map((block, index) => (
                      <div
                        key={block.id}
                        className={`absolute transition-all duration-300 ${
                          block.isSpecial ? 'animate-pulse' : ''
                        }`}
                        style={{
                          bottom: `${index * blockSpacing}px`,
                          left: `calc(50% + ${block.offset}px)`,
                          transform: 'translateX(-50%)',
                          zIndex: blocks.length - index
                        }}
                      >
                        <div
                          className={`${blockWidth} ${blockHeight} rounded-sm border-2 flex items-center justify-center ${
                            block.quality === 'perfect' 
                              ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-600' 
                              : block.quality === 'good'
                              ? 'bg-gradient-to-r from-blue-400 to-blue-500 border-blue-600'
                              : 'bg-gradient-to-r from-orange-400 to-orange-500 border-orange-600'
                          } ${block.isSpecial ? 'bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-600' : ''}`}
                          style={{
                            boxShadow: `0 2px 4px rgba(0,0,0,0.3)${block.isSpecial ? ', 0 0 15px #FFD700' : ''}`
                          }}
                        >
                          {block.isSpecial && (
                            <div className="text-white text-xs sm:text-sm font-bold">
                              ⭐
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partículas */}
                {particles.map(particle => (
                  <div
                    key={particle.id}
                    className="absolute w-2 h-2 rounded-full pointer-events-none"
                    style={{
                      left: `${particle.x}px`,
                      top: `${particle.y}px`,
                      backgroundColor: particle.color,
                      opacity: particle.life
                    }}
                  />
                ))}

                {/* Base da Torre */}
                <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-stone-800 to-stone-600 border-t-4 border-stone-900">
                  <div className="text-white text-center font-bold pt-4 text-sm sm:text-base">
                    FUNDAÇÃO
                  </div>
                </div>

                {/* Indicador de Nível da Torre */}
                <div className="absolute top-4 right-4 bg-white/80 rounded-lg p-2 text-center">
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
                  {blocks.length > 100 ? '🏆' : blocks.length > 50 ? '🎉' : '💪'}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  Torre de {blocks.length} blocos!
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600">
                  {blocks.length > bestHeight ? 'NOVO RECORDE!' : 
                   blocks.length > 50 ? 'Torre impressionante!' : 
                   'Continue praticando!'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-orange-800">{blocks.length}</div>
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

  if (currentScreen === 'title') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
}
