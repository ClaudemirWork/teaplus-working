'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, Star, Trophy } from 'lucide-react';
import { createClient } from '../utils/supabaseClient'; // Assumindo que o caminho está correto
import confetti from 'canvas-confetti';
import Image from 'next/image';

interface Block {
  id: number;
  widthPercentage: number; // Largura do bloco em relação à base, diminui com erros
  offset: number; // Posição horizontal do bloco
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

const INITIAL_BLOCK_WIDTH = 100; // Porcentagem inicial da largura do bloco

export default function MagicTower() {
  const router = useRouter();
  const supabase = createClient();
  const animationRef = useRef<number>();
  const movingBlockRef = useRef<HTMLDivElement>(null);

  // Controle de telas
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');

  // Estados do jogo
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
  const [isCollapsing, setIsCollapsing] = useState(false);

  // Estados do bloco em movimento
  const [movingBlockOffset, setMovingBlockOffset] = useState(0); // -100 (esquerda) a 100 (direita)
  const [movingBlockDirection, setMovingBlockDirection] = useState(1); // 1 para direita, -1 para esquerda
  const [blockSpeed, setBlockSpeed] = useState(1.5); // Velocidade inicial do bloco
  const [currentBlockWidth, setCurrentBlockWidth] = useState(INITIAL_BLOCK_WIDTH); // Largura do bloco atual

  // Estados salvos (usando localStorage para simplicidade, pode integrar com Supabase depois)
  const [bestHeight, setBestHeight] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    const savedHeight = localStorage.getItem('magicTower_bestHeight');
    const savedStars = localStorage.getItem('magicTower_totalStars');

    if (savedHeight) setBestHeight(parseInt(savedHeight));
    if (savedStars) setTotalStars(parseInt(savedStars));

    // Pré-carregar o som (tenta tocar um som mudo uma vez)
    playSound('silent');
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
    setIsCollapsing(false);
    setGameMessage('Prepare-se para construir!');
    setCurrentBlockWidth(INITIAL_BLOCK_WIDTH); // Resetar largura do bloco
    setMovingBlockOffset(0); // Começa no centro
    setMovingBlockDirection(1); // Começa movendo para a direita
    setBlockSpeed(1.5); // Resetar velocidade

    // Adicionar o primeiro bloco (base)
    setBlocks([{ id: Date.now(), widthPercentage: INITIAL_BLOCK_WIDTH, offset: 0, quality: 'perfect', isSpecial: false }]);
  };

  const showGameMessage = (message: string, duration: number = 3000) => {
    setGameMessage(message);
    const timer = setTimeout(() => setGameMessage(''), duration);
    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado ou message mudar
  };

  const createParticles = useCallback((x: number, y: number, type: string = 'normal', count: number = 8) => {
    const newParticles: Particle[] = [];
    const colors = type === 'perfect' ? ['#84CC16', '#A3E635'] : // Verde-lima
                   type === 'good' ? ['#3B82F6', '#60A5FA'] : // Azul vibrante
                   type === 'poor' ? ['#F59E0B', '#FBBF24'] : // Laranja
                   type === 'explosion' ? ['#EF4444', '#FCD34D', '#4ADE80'] : // Explosão colorida
                   ['#E5E7EB', '#D1D5DB']; // Cinza claro (silent)
    
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
        life: 1,
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const updateParticles = useCallback(() => {
    setParticles(prev => prev.map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      vy: particle.vy + 0.3, // Gravidade
      life: particle.life - 0.02,
    })).filter(particle => particle.life > 0));
  }, []);

  const playSound = (type: 'perfect' | 'good' | 'poor' | 'collapse' | 'levelup' | 'silent', attempt: number = 0) => {
    if (attempt > 2) return; // Máximo 3 tentativas para evitar loop infinito
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          playSound(type, attempt + 1); // Tenta novamente após resumir
        }).catch(() => {}); // Falha silenciosa
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
        case 'silent': // Toca um som inaudível para inicializar o AudioContext
          oscillator.frequency.value = 1; // Frequência muito baixa
          gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime); // Volume quase zero
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.001);
          break;
      }
    } catch (e) {
      // Falha silenciosa se AudioContext não for suportado ou houver erro
    }
  };

  const createCelebrationBurst = () => {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#FFD700', '#FF4500', '#ADFF2F', '#1E90FF'], // Cores vibrantes
        scalar: 1.2
      });
    }
  };

  const handlePlaceBlock = useCallback(() => {
    if (!isPlaying || isCollapsing) return;

    // O último bloco é a base para o encaixe
    const lastBlock = blocks[blocks.length - 1];
    if (!lastBlock) return; // Não deveria acontecer se o jogo iniciou corretamente

    // Calcular o quão alinhado o bloco móvel está com o bloco de baixo
    const alignmentOffset = movingBlockOffset; // -100 (esquerda) a 100 (direita)
    const baseBlockWidth = lastBlock.widthPercentage; // Largura do bloco de baixo (100 = largura máxima)

    let quality: 'perfect' | 'good' | 'poor';
    let newBlockOffset = 0; // O bloco novo sempre se "centraliza" ou se ajusta
    let points = 0;
    let newBlockWidth = currentBlockWidth;

    const perfectThreshold = 10; // Quão próximo do centro é "perfect"
    const goodThreshold = 30; // Quão próximo do centro é "good"

    const currentBlockAbsoluteOffset = movingBlockRef.current?.offsetLeft || 0;
    const towerArea = document.querySelector('.tower-area');
    const towerAreaRect = towerArea?.getBoundingClientRect();
    const towerCenter = towerAreaRect ? towerAreaRect.width / 2 : 0;
    const blockVisualOffset = currentBlockAbsoluteOffset - towerCenter; // Offset visual em pixels

    if (Math.abs(alignmentOffset) <= perfectThreshold) {
      quality = 'perfect';
      points = 150; // Mais pontos para perfeito
      newBlockOffset = 0; // Perfeito, centraliza
      // Se for perfeito, recupera um pouco da largura, até o máximo
      newBlockWidth = Math.min(INITIAL_BLOCK_WIDTH, currentBlockWidth + 5);
      playSound('perfect');
      showGameMessage('✨ PERFEITO! ✨', 1500);
      createParticles(towerCenter + blockVisualOffset, 100 + (blocks.length * (isMobile ? 27 : 32)), 'perfect', 15);
    } else if (Math.abs(alignmentOffset) <= goodThreshold) {
      quality = 'good';
      points = 80;
      // Calcula o "corte" do bloco
      const overhang = Math.abs(alignmentOffset) - perfectThreshold;
      newBlockWidth = Math.max(20, currentBlockWidth - (overhang * 0.8)); // Reduz a largura
      newBlockOffset = alignmentOffset > 0 ? alignmentOffset - (overhang / 2) : alignmentOffset + (overhang / 2); // Ajusta o centro do bloco
      playSound('good');
      showGameMessage('✅ Bom! ✅', 1500);
      createParticles(towerCenter + blockVisualOffset, 100 + (blocks.length * (isMobile ? 27 : 32)), 'good', 10);
    } else {
      quality = 'poor';
      points = 0; // Nenhum ponto para erro grave
      newBlockWidth = Math.max(10, currentBlockWidth - (Math.abs(alignmentOffset) * 0.5)); // Reduz muito a largura
      newBlockOffset = alignmentOffset > 0 ? alignmentOffset - (Math.abs(alignmentOffset) / 2) : alignmentOffset + (Math.abs(alignmentOffset) / 2);
      playSound('poor');
      showGameMessage('❌ ERRO! ❌', 1500);
      createParticles(towerCenter + blockVisualOffset, 100 + (blocks.length * (isMobile ? 27 : 32)), 'poor', 8);

      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          triggerCollapse();
        } else {
          showGameMessage(`⚠️ Cuidado! ${newLives} vidas restantes`, 2000);
        }
        return newLives;
      });
    }

    if (newBlockWidth < 15) { // Se o bloco ficar muito fino, a torre desmorona
        triggerCollapse();
        return;
    }

    const isSpecial = (blocks.length + 1) % 10 === 0;

    const newBlock: Block = {
      id: Date.now() + Math.random(),
      widthPercentage: newBlockWidth,
      offset: newBlockOffset,
      quality,
      isSpecial,
    };

    setBlocks(prev => [...prev, newBlock]);
    setScore(prev => prev + Math.round(points * multiplier));
    setCurrentBlockWidth(newBlockWidth); // Próximo bloco terá a largura ajustada

    // Resetar offset do bloco móvel para a próxima rodada
    setMovingBlockOffset(0); // Sempre começa do centro para a próxima peça
    setMovingBlockDirection(Math.random() > 0.5 ? 1 : -1); // Alterna a direção inicial
    
    // Aumentar a velocidade do bloco gradualmente
    setBlockSpeed(prev => Math.min(prev + 0.1, 5)); // Aumenta até um máximo

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

        if (newStreak % 5 === 0 && newStreak > 0) { // A cada 5 perfeitos
          setMultiplier(prev => prev + 0.5); // Aumenta multiplicador
          setMultiplierTime(5); // Duração do multiplicador
          showGameMessage(`🔥 Combo Perfeito! Multiplicador x${multiplier + 0.5}!`, 2500);
          createCelebrationBurst();
        }
        return newStreak;
      });
    } else {
      setCombo(0);
      setPerfectStreak(0);
    }

    // Level up da torre a cada 10 blocos (ajustado para a nova mecânica)
    const newHeight = blocks.length + 1;
    if (newHeight > 1 && newHeight % 10 === 0) {
      const newLevel = Math.floor(newHeight / 10) + 1;
      setTowerLevel(newLevel);
      setShowLevelUp(true);
      playSound('levelup');
      showGameMessage(`🏗️ NÍVEL ${newLevel} ALCANÇADO!`, 3000);
      createCelebrationBurst();

      // Recuperar vida a cada level up
      setLives(prev => Math.min(prev + 1, 3));
      setCurrentBlockWidth(prev => Math.min(INITIAL_BLOCK_WIDTH, prev + 10)); // Aumenta um pouco a largura do bloco
      
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [isPlaying, isCollapsing, blocks, multiplier, isMobile, createParticles, showGameMessage, playSound, currentBlockWidth, triggerCollapse]);


  const triggerCollapse = useCallback(() => {
    setIsCollapsing(true);
    setIsPlaying(false);
    playSound('collapse');
    showGameMessage('💥 TORRE DESMORONOU!', 3000);
    
    // Criar explosão de partículas
    const gameArea = document.querySelector('.tower-area');
    if (gameArea) {
      const rect = gameArea.getBoundingClientRect();
      // Criar partículas de todos os blocos desmoronando
      blocks.forEach((block, index) => {
        setTimeout(() => {
          createParticles(
            rect.width / 2 + block.offset, // Posição do bloco
            rect.height - (index * (isMobile ? 27 : 32)), // Altura aproximada do bloco
            'explosion',
            15
          );
        }, index * 80); // Defasagem para o efeito de desmoronamento
      });
    }
    
    // Mostrar resultados após animação
    setTimeout(() => {
      endGame();
    }, 2500 + blocks.length * 80); // Ajusta o tempo para a animação de queda
  }, [blocks, createParticles, isMobile, playSound, showGameMessage]);

  const endGame = () => {
    setShowResults(true);
    
    // Atualizar recordes
    const currentHeight = blocks.length;
    if (currentHeight > bestHeight) {
      setBestHeight(currentHeight);
      localStorage.setItem('magicTower_bestHeight', currentHeight.toString());
    }
    
    const newStars = totalStars + Math.floor(score / 1500); // Ajustado para nova pontuação
    setTotalStars(newStars);
    localStorage.setItem('magicTower_totalStars', newStars.toString());
  };

  const restartGame = () => {
    setCurrentScreen('title');
    setShowResults(false);
    setIsCollapsing(false);
  };

  // Game loop principal para o bloco em movimento e partículas
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let lastTime = 0;
    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const deltaTime = time - lastTime;
      lastTime = time;

      // Movimento do bloco
      setMovingBlockOffset(prev => {
        let newOffset = prev + (movingBlockDirection * blockSpeed * (deltaTime / 16)); // Ajusta a velocidade pelo deltaTime
        const maxOffset = 100 - (currentBlockWidth / 2); // Limita o movimento baseado na largura do bloco

        if (newOffset > maxOffset) {
          newOffset = maxOffset;
          setMovingBlockDirection(-1);
        } else if (newOffset < -maxOffset) {
          newOffset = -maxOffset;
          setMovingBlockDirection(1);
        }
        return newOffset;
      });

      // Atualizar multiplicador
      setMultiplierTime(prev => {
        if (prev <= 0) {
          setMultiplier(1);
          return 0;
        }
        return prev - (deltaTime / 1000); // Decrementa em segundos
      });

      updateParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, movingBlockDirection, blockSpeed, currentBlockWidth, updateParticles]);


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
          atividade_nome: 'Torre Mágica',
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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const blockHeight = isMobile ? 'h-7' : 'h-9';
  const blockSpacing = isMobile ? 27 : 32;
  const maxVisibleBlocks = isMobile ? 12 : 15;
  const gameAreaHeight = isMobile ? '400px' : '500px';

  // TELAS DO JOGO
  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 overflow-hidden">
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
            <Star className="w-6 h-6 text-yellow-300 opacity-50" fill="currentColor" />
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
            className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl animate-float" // Nova animação
            priority 
          />
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
          Torre Mágica
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-4 drop-shadow-md">
          ✨ Construa sua torre mágica! ✨
        </p>
        
        {(totalStars > 0 || bestHeight > 0) && (
          <div className="bg-white/80 rounded-2xl p-4 mb-4 shadow-xl">
            <div className="flex items-center gap-4">
              {totalStars > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                  <span className="font-bold text-indigo-800">{totalStars} estrelas</span>
                </div>
              )}
              {bestHeight > 0 && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <span className="font-bold text-indigo-800">Recorde: {bestHeight} blocos</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setCurrentScreen('instructions')} 
          className="text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1"
        >
          Começar Aventura
        </button>
      </div>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-300 via-green-300 to-yellow-300">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-green-700">Como Jogar a Torre Mágica</h2>
        <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
          <p className="flex items-center gap-4">
            <span className="text-4xl">👆</span>
            <span>Quando o bloco estiver se movendo, <b>toque ou clique na tela</b> para soltá-lo!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🎯</span>
            <span>Tente encaixar o bloco <b>perfeitamente</b> sobre o de baixo para ganhar mais pontos e manter a torre larga.</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">💚</span>
            <span>Encaixes <b>PERFEITOS</b> te dão mais pontos e recompensas especiais!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">✂️</span>
            <span>Se o bloco não encaixar perfeitamente, o excesso será **cortado**, e a torre ficará mais fina.</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">💔</span>
            <span>Se errar muito e o bloco ficar **muito fino**, ou cair, você perderá!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🌟</span>
            <span>A torre cresce, os níveis mudam, e a diversão aumenta!</span>
          </p>
        </div>
        
        <button 
          onClick={startActivity} 
          className="w-full text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform"
        >
          Iniciar Construção! 🚀
        </button>
      </div>
    </div>
  );

  const GameScreen = () => {
    // Calculamos o offset da base para simular a torre "subindo"
    const towerOffset = Math.max(0, blocks.length - maxVisibleBlocks) * blockSpacing;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setCurrentScreen('title')}
                className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
              </button>

              <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                ✨
                <span>Torre Mágica</span>
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
                <div className="w-24"></div> // Espaçador para manter o layout
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
                    <div className="text-base sm:text-xl font-bold text-purple-800">
                      {blocks.length}
                    </div>
                    <div className="text-xs text-purple-600">Altura</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-teal-800">
                      {score}
                    </div>
                    <div className="text-xs text-teal-600">Pontos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-yellow-800">
                      x{combo}
                    </div>
                    <div className="text-xs text-yellow-600">Combo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-lime-800">
                      {perfectStreak}
                    </div>
                    <div className="text-xs text-lime-600">Perfeitas</div>
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

              {/* Multiplicador */}
              {multiplier > 1 && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg shadow p-2 flex-1 text-center animate-pulse-fast">
                  <div className="font-bold text-yellow-800">x{multiplier.toFixed(1)} ({Math.ceil(multiplierTime)}s)</div>
                  <div className="text-xs text-yellow-600">Multiplicador ATIVO!</div>
                </div>
              )}

              {/* Área da Torre */}
              <div 
                className="tower-area relative bg-gradient-to-b from-sky-200 to-blue-300 rounded-xl shadow-lg overflow-hidden flex justify-center items-end"
                style={{ height: gameAreaHeight }}
              >
                {/* Linha guia central para ajudar no alinhamento */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-yellow-400 opacity-60 z-10 transform -translate-x-0.5 animate-pulse-slow" />
                
                {/* Mensagens do jogo */}
                {gameMessage && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
                    <div className="bg-white/90 text-black px-4 py-2 rounded-full font-bold animate-fade-in-out text-center text-sm sm:text-base shadow-md">
                      {gameMessage}
                    </div>
                  </div>
                )}

                {/* Level Up Animation */}
                {showLevelUp && (
                  <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/50">
                    <div className="bg-white rounded-2xl p-8 text-center animate-pop-in">
                      <div className="text-6xl mb-4 animate-bounce-slow">✨</div>
                      <div className="text-2xl font-bold text-indigo-600">
                        NÍVEL {towerLevel} CONQUISTADO!
                      </div>
                    </div>
                  </div>
                )}

                {/* Container da Torre */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-50%) translateY(${towerOffset}px)` }} // Move a torre para cima
                >
                  {/* Blocos da Torre */}
                  {blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className={`relative ${blockHeight} rounded-sm border-2 transition-all duration-100 ${
                        block.quality === 'perfect' ? 'border-green-600' :
                        block.quality === 'good' ? 'border-blue-600' :
                        'border-orange-600'
                      } ${
                        block.isSpecial ? 'animate-glow-gold' : ''
                      } ${
                        isCollapsing ? 'animate-fall-block' : '' // Animação de queda
                      }`}
                      style={{
                        width: `${block.widthPercentage}%`,
                        backgroundColor: 
                          block.quality === 'perfect' ? '#4CAF50' :
                          block.quality === 'good' ? '#2196F3' :
                          '#FF9800',
                        // Se o bloco for especial, muda a cor
                        backgroundImage: block.isSpecial 
                          ? 'linear-gradient(to right, #FFD700, #FFA500)' 
                          : '',
                        zIndex: blocks.length - index,
                        marginBottom: '2px', // Espaçamento entre blocos
                        transform: `translateX(${block.offset}px)`, // Offset do bloco
                        boxShadow: `0 2px 4px rgba(0,0,0,0.3)${block.isSpecial ? ', 0 0 15px #FFD700' : ''}`
                      }}
                    >
                      {block.isSpecial && (
                        <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
                          ⭐
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="w-[150%] h-16 bg-gradient-to-t from-stone-800 to-stone-600 border-t-4 border-stone-900 rounded-b-xl z-10 flex items-center justify-center">
                    <div className="text-white text-center font-bold text-sm sm:text-base opacity-70">
                      FUNDAÇÃO
                    </div>
                  </div>
                </div>

                {/* Bloco em movimento */}
                {isPlaying && !isCollapsing && (
                  <div
                    ref={movingBlockRef}
                    className={`absolute bottom-0 ${blockHeight} rounded-sm border-2 border-indigo-600 bg-indigo-500 shadow-md transition-opacity duration-300`}
                    style={{
                      width: `${currentBlockWidth}%`,
                      transform: `translateX(calc(${movingBlockOffset}% - 50%))`, // Movimento horizontal
                      opacity: isPlaying && !isCollapsing ? 1 : 0,
                      marginBottom: `${blocks.length * blockSpacing + (isMobile ? 27 : 32)}px`, // Posição acima da torre
                      zIndex: blocks.length + 10,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                      NOVO BLOCO
                    </div>
                  </div>
                )}
                
                {/* Partículas */}
                {particles.map(particle => (
                  <div
                    key={particle.id}
                    className="absolute w-2 h-2 rounded-full pointer-events-none"
                    style={{
                      left: `calc(50% + ${particle.x}px - 4px)`, // Centraliza e ajusta o pixel
                      top: `calc(${gameAreaHeight} - ${particle.y}px - 4px)`, // Inverte o eixo Y para parecer que sobe
                      backgroundColor: particle.color,
                      opacity: particle.life,
                      zIndex: 50,
                    }}
                  />
                ))}

                {/* Indicador de Nível da Torre */}
                <div className="absolute top-4 right-4 bg-white/80 rounded-lg p-2 text-center shadow-sm">
                  <div className="text-lg font-bold text-indigo-800">Nv.{towerLevel}</div>
                  <div className="text-xs text-indigo-600">Torre</div>
                </div>
              </div>

              {/* Botão de Construir */}
              <div className="text-center">
                <button
                  onClick={handlePlaceBlock}
                  disabled={isCollapsing || !isPlaying}
                  className={`${
                    isCollapsing || !isPlaying
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-95'
                  } text-white px-8 py-3 sm:px-12 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl`}
                >
                  {isCollapsing ? '💥 DESMORONANDO...' : '🔨 SOLTAR BLOCO'}
                </button>
              </div>
            </div>
          ) : (
            // Tela de Resultados
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-5xl sm:text-6xl mb-4">
                  {blocks.length > 50 ? '🏆' : blocks.length > 20 ? '🎉' : '💪'}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  Você construiu uma torre de {blocks.length} blocos!
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600">
                  {blocks.length > bestHeight ? 'NOVO RECORDE NA TORRE MÁGICA!' : 
                   blocks.length > 20 ? 'Torre Mágica impressionante!' : 
                   'Continue praticando para construir mais alto!'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-purple-800">{blocks.length}</div>
                  <div className="text-xs text-purple-600">Altura Final</div>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-teal-800">{score}</div>
                  <div className="text-xs text-teal-600">Pontuação Total</div>
                </div>
                <div className="bg-lime-50 border border-lime-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-lime-800">{maxPerfectStreak}</div>
                  <div className="text-xs text-lime-600">Sequência Perfeita</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-yellow-800">{maxCombo}</div>
                  <div className="text-xs text-yellow-600">Combo Máximo</div>
                </div>
              </div>

              {/* Estatísticas extras */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">📊 Seus feitos Mágicos:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>🎯 Nível da Torre Alcançado: <span className="font-bold">{towerLevel}</span></div>
                  <div>⭐ Altura Recorde: <span className="font-bold">{bestHeight}</span></div>
                  <div>✨ Estrelas Coletadas: <span className="font-bold">{Math.floor(score / 1500)}</span></div>
                  <div>💎 Total de Estrelas: <span className="font-bold">{totalStars}</span></div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={restartGame}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  🔄 Nova Aventura
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
