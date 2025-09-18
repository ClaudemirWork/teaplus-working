'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabaseClient';
import { GameAudioManager } from '@/utils/gameAudioManager';
import { Bubble, Particle, Equipment, LEVEL_CONFIGS, BUBBLE_CONFIG } from '@/app/types/bubble-pop';

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
  const [bubblesPopped, setBubblesPopped] = useState(0);

  // NOVOS ESTADOS - Features do jogo antigo
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
  const [magnetActive, setMagnetActive] = useState(false);
  const [magnetTime, setMagnetTime] = useState(0);
  const [showBossLevel, setShowBossLevel] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [freedCreatures, setFreedCreatures] = useState<string[]>([]);
  const [bubblesSpawned, setBubblesSpawned] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  // Refs para controle de frequência do áudio
  const lastAudioTime = useRef<number>(0);
  const lastScoreMilestone = useRef<number>(0);

  // Inicialização do gerenciador de áudio
  useEffect(() => {
    audioManager.current = GameAudioManager.getInstance();
  }, []);

  // Som de bolha estourando
  const playBubblePopSound = useCallback(() => {
    if (!audioEnabled) return;

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const filterNode = audioCtx.createBiquadFilter();

      osc1.connect(filterNode);
      osc2.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(1000, audioCtx.currentTime);
      filterNode.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
      osc1.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.02);

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

      osc1.start(audioCtx.currentTime);
      osc2.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.15);
      osc2.stop(audioCtx.currentTime + 0.02);

      setTimeout(() => {
        audioCtx.close();
      }, 200);
    } catch (error) {
      console.log('Erro no som sintetizado:', error);
    }
  }, [audioEnabled]);

  // FUNÇÃO EXPANDIDA PARA CRIAR BOLHAS COM TODOS OS TIPOS
  const createBubble = useCallback((): Bubble => {
    const gameArea = gameAreaRef.current;
    if (!gameArea || !isPlaying || levelCompleted) {
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

    const config = LEVEL_CONFIGS[currentLevel - 1];
    if (bubblesSpawned >= config.totalBubbles) {
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
    let horizontalMovement = 0;
    let equipmentType: Bubble['equipmentType'] = undefined;
    let fishType = '';

    const rand = Math.random();

    // Verificar se é equipamento específico do nível
    if (config.equipment && rand < 0.02) {
      type = 'equipment';
      equipmentType = config.equipment;
    } else if (rand < config.minePercentage) {
      // Mina
      type = 'mine';
    } else {
      const features = config.features;
      const featureRand = Math.random();

      if (features.includes('fish_rescue') && featureRand < 0.15) {
        type = 'fish';
        const fishTypes = ['🐠', '🐟', '🐡', '🦈', '🐙'];
        fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
      } else if (features.includes('multipliers') && featureRand < 0.1) {
        type = Math.random() < 0.6 ? 'double' : 'triple';
      } else if (features.includes('powerups') && featureRand < 0.08) {
        type = Math.random() < 0.5 ? 'shockwave' : 'magnet';
      } else {
        // Bolhas normais e animais marinhos
        const colorRand = Math.random();
        if (currentLevel <= 2) {
          if (colorRand < 0.4) type = 'air';
          else if (colorRand < 0.7) type = 'oxygen';
          else if (colorRand < 0.9) type = 'pink';
          else type = 'purple';
        } else if (currentLevel <= 4) {
          if (colorRand < 0.3) type = 'air';
          else if (colorRand < 0.5) type = 'oxygen';
          else if (colorRand < 0.65) type = 'pink';
          else if (colorRand < 0.8) type = 'purple';
          else if (colorRand < 0.9) type = 'yellow';
          else if (colorRand < 0.97) type = 'treasure';
          else type = 'pearl';
        } else {
          // Níveis avançados - todos os tipos
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

      // Correntes marinhas
      if (features.includes('currents')) {
        horizontalMovement = (Math.random() - 0.5) * 2;
      }
    }

    const bubbleConfig = BUBBLE_CONFIG[type as keyof typeof BUBBLE_CONFIG];
    const x = margin + Math.random() * (maxX - margin);
    const y = maxY + bubbleConfig.size;
    const speed = 1.2;

    return {
      id: Date.now() + Math.random(),
      x,
      y,
      size: bubbleConfig.size + (Math.random() * 10 - 5),
      speed,
      color: bubbleConfig.color,
      points: bubbleConfig.points,
      type,
      popped: false,
      opacity: 1,
      horizontalMovement,
      equipmentType,
      fishType
    };
  }, [currentLevel, isPlaying, levelCompleted, bubblesSpawned]);

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

  // Função para criar partículas
  const createParticles = useCallback((x: number, y: number, color: string, type: string = 'normal') => {
    const newParticles: Particle[] = [];
    
    if (type === 'explosion') {
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
    }

    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Sistema de áudio para marcos de pontuação
  const checkScoreMilestone = useCallback((newScore: number) => {
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
        setTimeout(() => {
          if (audioManager.current) {
            audioManager.current.falarMila(phrases[i]);
          }
        }, 100);
        break;
      }
    }
  }, [audioEnabled]);

  // Sistema de áudio para animais
  const playAnimalSound = useCallback((animalType: string) => {
    if (!audioEnabled || !audioManager.current) return;

    const animalPhrases: { [key: string]: string } = {
      pufferfish: 'Salvou um baiacu!',
      starfish: 'Salvou uma estrela do mar!',
      octopus: 'Salvou um polvo!',
      whale: 'Salvou uma baleia!',
      shark: 'Salvou um tubarão!',
      turtle: 'Salvou uma tartaruga!',
      dolphin: 'Salvou um golfinho!'
    };

    if (animalPhrases[animalType]) {
      setTimeout(() => {
        if (audioManager.current) {
          audioManager.current.falarMila(animalPhrases[animalType]);
        }
      }, 200);
    }
  }, [audioEnabled]);

  // CONTINUAÇÃO NO PRÓXIMO TRECHO... (arquivo muito grande)

  // Função principal de iniciar jogo
  const startActivity = useCallback(() => {
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
    setBubblesPopped(0);
    
    // NOVOS RESETS
    setEquipment({
      mask: false,
      fins: false,
      tank: false,
      suit: false,
      light: false
    });
    setSavedFish(0);
    setMultiplier(1);
    setMultiplierTime(0);
    setMagnetActive(false);
    setMagnetTime(0);
    setShowBossLevel(false);
    setBossDefeated(false);
    setFreedCreatures([]);
    setBubblesSpawned(0);
    setLevelCompleted(false);
    setBubblesRemaining(LEVEL_CONFIGS[0].totalBubbles);
    
    lastScoreMilestone.current = 0;
  }, []);

  // Função voltar ao início
  const voltarInicio = useCallback(() => {
    setIsPlaying(false);
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
    setBubblesPopped(0);
    
    // NOVOS RESETS
    setEquipment({
      mask: false,
      fins: false,
      tank: false,
      suit: false,
      light: false
    });
    setSavedFish(0);
    setMultiplier(1);
    setMultiplierTime(0);
    setMagnetActive(false);
    setMagnetTime(0);
    setShowBossLevel(false);
    setBossDefeated(false);
    setFreedCreatures([]);
    setBubblesSpawned(0);
    setLevelCompleted(false);
    
    lastScoreMilestone.current = 0;
  }, []);

  // Toggle de áudio
  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
  }, []);

  // Função salvar sessão (por enquanto mantendo igual)
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

  // PLACEHOLDER para handleInteraction (implementaremos depois)
  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Implementação temporária - vamos expandir depois
    console.log('Interaction detected');
  }, []);

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
    
    // NOVOS ESTADOS
    equipment,
    savedFish,
    multiplier,
    multiplierTime,
    magnetActive,
    magnetTime,
    showBossLevel,
    bossDefeated,
    freedCreatures,
    bubblesSpawned,
    levelCompleted,

    // Configurações (agora usando os 11 níveis)
    levelConfigs: LEVEL_CONFIGS,

    // Funções
    startActivity,
    voltarInicio,
    handleInteraction,
    toggleAudio,
    handleSaveSession
  };
}
