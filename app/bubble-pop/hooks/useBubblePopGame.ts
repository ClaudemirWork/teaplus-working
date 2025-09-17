'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabaseClient';
import { GameAudioManager } from '@/utils/gameAudioManager';
import { Bubble, Particle } from '@/app/types/bubble-pop';

export function useBubblePopGame(gameAreaRef: React.RefObject<HTMLDivElement>) {
  const router = useRouter();
  const supabase = createClient();
  const animationRef = useRef<number>();
  const audioManager = useRef<GameAudioManager | null>(null);

  // Estados principais do jogo
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [oxygenLevel, setOxygenLevel] = useState(100);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [poppedBubbles, setPoppedBubbles] = useState(0);
  const [missedBubbles, setMissedBubbles] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [levelMessage, setLevelMessage] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [bubblesRemaining, setBubblesRemaining] = useState(0);
  const [fishCollection, setFishCollection] = useState<Array<{id: number, name: string, type: string}>>([]);
  const [unlockedGear, setUnlockedGear] = useState<Array<{level: number, item: string, icon: string}>>([]);

  // Refs para controle de frequência do áudio
  const lastAudioTime = useRef<number>(0);
  const lastScoreMilestone = useRef<number>(0);

  // Configuração dos tipos de bolha
  const coloredBubbles = {
    air: { color: '#E0F2FE', points: 5, size: 40 },
    oxygen: { color: '#60A5FA', points: 15, size: 55 },
    pink: { color: '#F9A8D4', points: 20, size: 45 },
    purple: { color: '#C084FC', points: 25, size: 45 },
    yellow: { color: '#FDE047', points: 30, size: 45 },
    green: { color: '#86EFAC', points: 35, size: 45 },
    orange: { color: '#FB923C', points: 40, size: 45 },
    treasure: { color: '#FFD700', points: 50, size: 50 },
    pearl: { color: '#FFF0F5', points: 100, size: 40 },
    mine: { color: '#8B0000', points: -20, size: 45 },
    pufferfish: { color: '#FF6B6B', points: 75, size: 50 },
    starfish: { color: '#FFD93D', points: 80, size: 45 },
    octopus: { color: '#6BCF7F', points: 90, size: 55 },
    whale: { color: '#4A90E2', points: 120, size: 70 },
    shark: { color: '#8B4513', points: 110, size: 65 },
    turtle: { color: '#32CD32', points: 85, size: 50 },
    dolphin: { color: '#00CED1', points: 95, size: 55 }
  };

  // Configurações dos níveis
  const levelConfigs = [
    { level: 1, name: 'Águas Rasas', depth: '0-10m', totalBubbles: 30, minePercentage: 0.05, spawnRate: 2000, oxygenDrain: 0.5, bgGradient: 'from-cyan-200 to-blue-400' },
    { level: 2, name: 'Zona Iluminada', depth: '10-50m', totalBubbles: 40, minePercentage: 0.08, spawnRate: 1800, oxygenDrain: 0.7, bgGradient: 'from-blue-400 to-blue-600' },
    { level: 3, name: 'Zona Crepuscular', depth: '50-100m', totalBubbles: 50, minePercentage: 0.1, spawnRate: 1600, oxygenDrain: 0.9, bgGradient: 'from-blue-600 to-indigo-700' },
    { level: 4, name: 'Zona Escura', depth: '100-500m', totalBubbles: 60, minePercentage: 0.12, spawnRate: 1400, oxygenDrain: 1.1, bgGradient: 'from-indigo-700 to-purple-900' },
    { level: 5, name: 'Águas Profundas', depth: '500m+', totalBubbles: 70, minePercentage: 0.15, spawnRate: 1200, oxygenDrain: 1.3, bgGradient: 'from-purple-900 to-black' }
  ];

  // Inicialização do gerenciador de áudio
  useEffect(() => {
    audioManager.current = GameAudioManager.getInstance();
  }, []);

  // Sistema de áudio inteligente para marcos de pontuação
  const handleScoreMilestone = useCallback((newScore: number) => {
    if (!audioEnabled || !audioManager.current) return;

    const milestones = [200, 500, 1000, 1500, 2000, 3000, 5000];
    const phrases = [
      '200 pontos, valeu!',
      '500 pontos, ótimo!',
      '1000 pontos, você é fera!',
      '1500 pontos, incrível!',
      '2000 pontos, fantástico!',
      '3000 pontos, você é um expert!',
      '5000 pontos, simplesmente perfeito!'
    ];

    for (let i = milestones.length - 1; i >= 0; i--) {
      if (newScore >= milestones[i] && lastScoreMilestone.current < milestones[i]) {
        lastScoreMilestone.current = milestones[i];
        audioManager.current.falarMila(phrases[i]);
        break;
      }
    }
  }, [audioEnabled]);

  // Sistema de áudio para animais capturados
  const handleAnimalCaptured = useCallback((animalType: string) => {
    if (!audioEnabled || !audioManager.current) return;

    const animalPhrases = {
      pufferfish: 'Salvou um baiacu!',
      starfish: 'Salvou uma estrela do mar!',
      octopus: 'Salvou um polvo!',
      whale: 'Salvou uma baleia!',
      shark: 'Salvou um tubarão!',
      turtle: 'Salvou uma tartaruga!',
      dolphin: 'Salvou um golfinho!'
    };

    if (animalPhrases[animalType as keyof typeof animalPhrases]) {
      audioManager.current.falarMila(animalPhrases[animalType as keyof typeof animalPhrases]);
    }
  }, [audioEnabled]);

  // Sistema de áudio para equipamentos
  const handleGearUnlocked = useCallback((gearType: string) => {
    if (!audioEnabled || !audioManager.current) return;
    audioManager.current.falarMila('Conseguiu um item de mergulho!');
  }, [audioEnabled]);

  // Sistema de áudio para transição de nível
  const handleLevelTransition = useCallback((nextLevel: number) => {
    if (!audioEnabled || !audioManager.current) return;
    
    const levelPhrases = [
      'Ai sim, vamos para a fase 2!',
      'Ai sim, vamos para a fase 3!',
      'Ai sim, vamos para a fase 4!',
      'Ai sim, vamos para a fase 5!'
    ];

    if (nextLevel >= 2 && nextLevel <= 5) {
      audioManager.current.falarMila(levelPhrases[nextLevel - 2]);
    }
  }, [audioEnabled]);

  // Função para criar bolhas
  const createBubble = useCallback((): Bubble => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) {
      return {
        id: Date.now() + Math.random(),
        x: 100,
        y: 100,
        size: 40,
        speed: 1,
        color: '#E0F2FE',
        points: 5,
        type: 'air',
        popped: false,
        opacity: 1,
        horizontalMovement: 0
      };
    }

    const rect = gameArea.getBoundingClientRect();
    const margin = 60;
    const maxX = rect.width - margin;
    const maxY = rect.height - margin;

    let type: Bubble['type'] = 'air';
    const rand = Math.random();
    const colorRand = Math.random();
    const mineChance = levelConfigs[currentLevel - 1].minePercentage;

    // Determinar se é uma mina
    if (rand < mineChance) {
      type = 'mine';
    } else {
      // Lógica de spawn baseada no nível
      if (currentLevel === 1) {
        if (colorRand < 0.4) type = 'air';
        else if (colorRand < 0.7) type = 'oxygen';
        else if (colorRand < 0.9) type = 'pink';
        else type = 'purple';
      } else if (currentLevel === 2) {
        if (colorRand < 0.3) type = 'air';
        else if (colorRand < 0.5) type = 'oxygen';
        else if (colorRand < 0.65) type = 'pink';
        else if (colorRand < 0.8) type = 'purple';
        else if (colorRand < 0.9) type = 'yellow';
        else if (colorRand < 0.97) type = 'treasure';
        else type = 'pearl';
      } else if (currentLevel === 3) {
        if (colorRand < 0.15) type = 'air';
        else if (colorRand < 0.3) type = 'oxygen';
        else if (colorRand < 0.45) type = 'pink';
        else if (colorRand < 0.55) type = 'purple';
        else if (colorRand < 0.65) type = 'yellow';
        else if (colorRand < 0.75) type = 'green';
        else if (colorRand < 0.83) type = 'orange';
        else if (colorRand < 0.88) type = 'pufferfish';
        else if (colorRand < 0.93) type = 'turtle';
        else if (colorRand < 0.96) type = 'treasure';
        else type = 'pearl';
      } else {
        // Níveis 4 e 5 - Todos os animais
        if (colorRand < 0.08) type = 'air';
        else if (colorRand < 0.15) type = 'oxygen';
        else if (colorRand < 0.25) type = 'purple';
        else if (colorRand < 0.35) type = 'yellow';
        else if (colorRand < 0.45) type = 'green';
        else if (colorRand < 0.55) type = 'orange';
        else if (colorRand < 0.65) type = 'pufferfish';
        else if (colorRand < 0.72) type = 'starfish';
        else if (colorRand < 0.78) type = 'octopus';
        else if (colorRand < 0.83) type = 'whale';
        else if (colorRand < 0.88) type = 'shark';
        else if (colorRand < 0.93) type = 'dolphin';
        else if (colorRand < 0.97) type = 'treasure';
        else type = 'pearl';
      }
    }

    const config = coloredBubbles[type];
    const x = margin + Math.random() * (maxX - margin);
    const y = maxY + config.size;
    const speed = 0.5 + Math.random() * 1.5;
    const horizontalMovement = (Math.random() - 0.5) * 0.3;

    return {
      id: Date.now() + Math.random(),
      x,
      y,
      size: config.size,
      speed,
      color: config.color,
      points: config.points,
      type,
      popped: false,
      opacity: 1,
      horizontalMovement
    };
  }, [currentLevel]);

  // Função para detectar clique em bolha
  const detectBubbleClick = useCallback((x: number, y: number): Bubble | null => {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const bubble = bubbles[i];
      if (bubble.popped) continue;

      const distance = Math.sqrt(
        Math.pow(x - (bubble.x + bubble.size / 2), 2) +
        Math.pow(y - (bubble.y + bubble.size / 2), 2)
      );

      if (distance <= bubble.size / 2) {
        return bubble;
      }
    }
    return null;
  }, [bubbles]);

  // Manipulador de interação (clique/toque)
  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isPlaying) return;

    e.preventDefault();
    e.stopPropagation();

    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const rect = gameArea.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const clickedBubble = detectBubbleClick(x, y);
    if (!clickedBubble) return;

    // Marcar bolha como estourada
    setBubbles(prev => prev.map(b => 
      b.id === clickedBubble.id ? { ...b, popped: true, opacity: 0 } : b
    ));

    // Processar pontuação
    const newScore = score + clickedBubble.points + (combo * 5);
    setScore(newScore);
    setPoppedBubbles(prev => prev + 1);

    // Verificar marcos de pontuação
    handleScoreMilestone(newScore);

    // Processar efeitos especiais
    if (clickedBubble.type === 'oxygen') {
      setOxygenLevel(prev => Math.min(100, prev + 25));
    } else if (clickedBubble.type === 'mine') {
      setOxygenLevel(prev => Math.max(0, prev - 15));
      setCombo(0);
    } else {
      setCombo(prev => prev + 1);
      setMaxCombo(prev => Math.max(prev, combo + 1));
    }

    // Captura de animais
    const animalTypes = ['pufferfish', 'starfish', 'octopus', 'whale', 'shark', 'turtle', 'dolphin'];
    if (animalTypes.includes(clickedBubble.type)) {
      const animalNames = {
        pufferfish: 'Baiacu',
        starfish: 'Estrela do Mar',
        octopus: 'Polvo',
        whale: 'Baleia',
        shark: 'Tubarão',
        turtle: 'Tartaruga',
        dolphin: 'Golfinho'
      };

      setFishCollection(prev => [...prev, {
        id: Date.now(),
        name: animalNames[clickedBubble.type as keyof typeof animalNames],
        type: clickedBubble.type
      }]);

      handleAnimalCaptured(clickedBubble.type);
    }

    // Equipamentos especiais
    if (clickedBubble.type === 'treasure') {
      const gear = { level: currentLevel, item: 'Equipamento de Mergulho', icon: '🤿' };
      setUnlockedGear(prev => [...prev, gear]);
      handleGearUnlocked('diving_gear');
    }

    // Criar partículas
    createParticles(clickedBubble.x + clickedBubble.size / 2, clickedBubble.y + clickedBubble.size / 2, clickedBubble.color);

    // Tocar som de bolha
    if (audioEnabled && audioManager.current) {
      audioManager.current.tocarSom('bubble_pop');
    }
  }, [isPlaying, score, combo, detectBubbleClick, handleScoreMilestone, handleAnimalCaptured, handleGearUnlocked, audioEnabled]);

  // Função para criar partículas
  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color,
        life: 1.0
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Loop principal do jogo
  const gameLoop = useCallback(() => {
    if (!isPlaying) return;

    // Atualizar bolhas
    setBubbles(prev => prev.map(bubble => {
      if (bubble.popped) {
        return { ...bubble, opacity: Math.max(0, bubble.opacity - 0.1) };
      }
      return {
        ...bubble,
        y: bubble.y - bubble.speed,
        x: bubble.x + (bubble.horizontalMovement || 0)
      };
    }).filter(bubble => bubble.y > -bubble.size && bubble.opacity > 0));

    // Atualizar partículas
    setParticles(prev => prev.map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      life: particle.life - 0.02
    })).filter(particle => particle.life > 0));

    // Drenar oxigênio
    setOxygenLevel(prev => {
      const newLevel = prev - levelConfigs[currentLevel - 1].oxygenDrain / 60;
      return Math.max(0, newLevel);
    });

    // Atualizar bolhas restantes
    const activeBubbles = bubbles.filter(b => !b.popped).length;
    setBubblesRemaining(activeBubbles);

    // Verificar condições de fim de nível
    if (activeBubbles === 0) {
      completeLevel();
    } else if (oxygenLevel <= 0) {
      endGame();
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, bubbles, currentLevel, oxygenLevel]);

  // Completar nível
  const completeLevel = useCallback(() => {
    setIsPlaying(false);
    setCompletedLevels(prev => [...prev, currentLevel]);

    if (currentLevel < 5) {
      setShowLevelTransition(true);
      setLevelMessage(`Nível ${currentLevel} Completo!`);
      
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        handleLevelTransition(currentLevel + 1);
        setShowLevelTransition(false);
        setOxygenLevel(100);
        setBubbles([]);
        setCombo(0);
        setTimeout(() => setIsPlaying(true), 1000);
      }, 3000);
    } else {
      // Jogo completo
      setShowResults(true);
      if (audioEnabled && audioManager.current) {
        audioManager.current.falarMila('Parabéns! Você completou todos os níveis!');
      }
    }
  }, [currentLevel, audioEnabled, handleLevelTransition]);

  // Finalizar jogo
  const endGame = useCallback(() => {
    setIsPlaying(false);
    setShowResults(true);
  }, []);

  // Iniciar jogo
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setScore(0);
    setOxygenLevel(100);
    setCurrentLevel(1);
    setCombo(0);
    setMaxCombo(0);
    setPoppedBubbles(0);
    setMissedBubbles(0);
    setBubbles([]);
    setParticles([]);
    setCompletedLevels([]);
    setFishCollection([]);
    setUnlockedGear([]);
    setShowResults(false);
    setShowLevelTransition(false);
    lastScoreMilestone.current = 0;
  }, []);

  // Toggle de áudio
  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
  }, []);

  // Salvar sessão
  const handleSaveSession = useCallback(async () => {
    setSalvando(true);
    try {
      const sessionData = {
        score,
        max_combo: maxCombo,
        completed_levels: completedLevels,
        popped_bubbles: poppedBubbles,
        accuracy: poppedBubbles > 0 ? (poppedBubbles / (poppedBubbles + missedBubbles)) * 100 : 0,
        fish_collection: fishCollection,
        unlocked_gear: unlockedGear,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('bubble_pop_sessions')
        .insert([sessionData]);

      if (error) throw error;

      if (audioEnabled && audioManager.current) {
        audioManager.current.falarMila('Progresso salvo com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSalvando(false);
    }
  }, [score, maxCombo, completedLevels, poppedBubbles, missedBubbles, fishCollection, unlockedGear, supabase, audioEnabled]);

  // Reiniciar jogo
  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // Spawn de bolhas
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      if (bubbles.length < 8) {
        setBubbles(prev => [...prev, createBubble()]);
      }
    }, levelConfigs[currentLevel - 1].spawnRate);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, bubbles.length, currentLevel, createBubble]);

  // Iniciar loop do jogo
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, gameLoop]);

  // Calcular precisão
  const accuracy = poppedBubbles > 0 ? (poppedBubbles / (poppedBubbles + missedBubbles)) * 100 : 0;

  return {
    // Estados do jogo
    isPlaying,
    score,
    bubbles,
    particles,
    oxygenLevel,
    currentLevel,
    combo,
    maxCombo,
    showResults,
    salvando,
    poppedBubbles,
    accuracy,
    completedLevels,
    showLevelTransition,
    levelMessage,
    audioEnabled,
    bubblesRemaining,
    fishCollection,
    unlockedGear,

    // Configurações
    levelConfigs,

    // Funções
    startGame,
    restartGame,
    handleInteraction,
    toggleAudio,
    handleSaveSession
  };
}
