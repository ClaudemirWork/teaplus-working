// app/emotional-maze/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Heart, Star, Users, Compass, Play, Volume2, VolumeX, Sparkles, Clock, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './emotionmaze.module.css';

// Sistema de Power-ups
const POWERUPS = {
  wallPass: {
    name: 'Atravessador de Paredes',
    icon: '🕐',
    duration: 45,
    color: '#9C27B0',
    description: 'Atravesse paredes por 45 segundos!'
  },
  reveal: {
    name: 'Visão Mágica',
    icon: '👁️',
    duration: 15,
    color: '#2196F3',
    description: 'Revela o caminho e gemas por 15 segundos!'
  },
  doublePoints: {
    name: 'Pontos em Dobro',
    icon: '✨',
    duration: 30,
    color: '#FFD700',
    description: 'Pontos em dobro por 30 segundos!'
  }
};

// Configuração de sons
const SOUNDS = {
  footstep: '/sounds/footstep.wav',
  checkpoint: '/sounds/coin.wav',
  powerup: '/sounds/magic.wav',
  gem: '/sounds/coin.wav',
  wallPass: '/sounds/magic.wav',
  levelComplete: '/sounds/sucess.wav'
};

// Função para tocar som
const playSound = (soundName: keyof typeof SOUNDS, volume: number = 0.3) => {
  try {
    const audio = new Audio(SOUNDS[soundName]);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (error) {
    console.log('Som não encontrado:', soundName);
  }
};

// Tipos de emoções
const EMOTIONS = {
  joy: {
    name: 'Alegria',
    icon: '😊',
    color: '#FFE066',
    message: 'A alegria ilumina nosso caminho!',
    mascot: 'mila',
    particles: true
  },
  calm: {
    name: 'Calma',
    icon: '😌',
    color: '#B2DFDB',
    message: 'Respire fundo e encontre seu centro.',
    mascot: 'leo',
    particles: false
  },
  courage: {
    name: 'Coragem',
    icon: '💪',
    color: '#7E57C2',
    message: 'Seja corajoso, você consegue!',
    mascot: 'leo',
    particles: true
  },
  sadness: {
    name: 'Tristeza',
    icon: '😢',
    color: '#64B5F6',
    message: 'Está tudo bem sentir tristeza às vezes.',
    mascot: 'mila',
    particles: false
  },
  fear: {
    name: 'Medo',
    icon: '😰',
    color: '#757575',
    message: 'O medo nos protege, mas podemos superá-lo.',
    mascot: 'leo',
    particles: false
  },
  mirror: {
    name: 'Espelho',
    icon: '🪞',
    color: '#E91E63',
    message: 'Tudo está invertido! Pense diferente!',
    mascot: 'mila',
    particles: true
  }
};

// NPCs para resgatar
const NPCS = [
  { id: 'bunny', name: 'Coelhinho', emoji: '🐰', dialogue: 'Obrigado por me salvar!' },
  { id: 'bird', name: 'Passarinho', emoji: '🐦', dialogue: 'Que alívio!' },
  { id: 'cat', name: 'Gatinho', emoji: '🐱', dialogue: 'Miau! Você é gentil!' },
  { id: 'dog', name: 'Cachorrinho', emoji: '🐶', dialogue: 'Au au! Amigos!' },
  { id: 'butterfly', name: 'Borboleta', emoji: '🦋', dialogue: 'Obrigado!' },
  { id: 'turtle', name: 'Tartaruga', emoji: '🐢', dialogue: 'Devagar e sempre!' }
];

// Função para espelhar labirinto
const mirrorMaze = (originalGrid: number[][]): number[][] => {
  return originalGrid.map(row => [...row].reverse());
};

// Configuração dos níveis
const LEVELS = [
  {
    id: 1,
    emotion: 'joy',
    size: 7,
    name: 'Jardim da Alegria',
    story: 'O Coelhinho perdeu seu sorriso no labirinto. Ajude-o a encontrar o caminho da alegria!',
    npc: NPCS[0],
    npcPosition: { x: 3, y: 3 },
    checkpoints: [{ x: 3, y: 1 }],
    powerups: [{ x: 5, y: 2, type: 'wallPass' }, { x: 1, y: 4, type: 'reveal' }],
    gems: [{ x: 2, y: 2 }, { x: 4, y: 4 }],
    perfectTime: 60,
    grid: [
      [1,1,1,1,1,1,1],
      [1,0,0,0,1,0,1],
      [1,0,1,0,1,0,1],
      [1,0,1,0,0,0,1],
      [1,0,1,1,1,0,1],
      [1,0,0,0,0,2,1],
      [1,1,1,1,1,1,1]
    ],
    start: { x: 1, y: 1 },
    end: { x: 5, y: 5 }
  },
  {
    id: 2,
    emotion: 'calm',
    size: 9,
    name: 'Lago da Tranquilidade',
    story: 'O Passarinho está agitado e precisa encontrar paz. Guie-o pelo caminho da calma.',
    npc: NPCS[1],
    npcPosition: { x: 4, y: 4 },
    checkpoints: [{ x: 2, y: 2 }, { x: 6, y: 6 }],
    powerups: [{ x: 7, y: 3, type: 'wallPass' }, { x: 1, y: 7, type: 'doublePoints' }],
    gems: [{ x: 3, y: 3 }, { x: 5, y: 5 }, { x: 7, y: 1 }],
    perfectTime: 90,
    grid: [
      [1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,1],
      [1,0,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,1],
      [1,1,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,0,2,1],
      [1,1,1,1,1,1,1,1,1]
    ],
    start: { x: 1, y: 1 },
    end: { x: 7, y: 7 }
  },
  {
    id: 3,
    emotion: 'courage',
    size: 11,
    name: 'Montanha da Bravura',
    story: 'O Gatinho tem medo de altura. Mostre a ele o caminho da coragem!',
    npc: NPCS[2],
    npcPosition: { x: 5, y: 5 },
    checkpoints: [{ x: 3, y: 3 }, { x: 7, y: 7 }],
    powerups: [{ x: 9, y: 1, type: 'reveal' }, { x: 1, y: 9, type: 'wallPass' }, { x: 5, y: 3, type: 'wallPass' }],
    gems: [{ x: 2, y: 4 }, { x: 8, y: 6 }, { x: 4, y: 8 }, { x: 6, y: 2 }],
    perfectTime: 120,
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,0,1,0,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,1],
      [1,1,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,2,1],
      [1,1,1,1,1,1,1,1,1,1,1]
    ],
    start: { x: 1, y: 1 },
    end: { x: 9, y: 9 }
  },
  {
    id: 4,
    emotion: 'sadness',
    size: 9,
    name: 'Vale das Lágrimas',
    story: 'O Cachorrinho perdeu seu brinquedo favorito. Ajude-o a processar a tristeza.',
    npc: NPCS[3],
    npcPosition: { x: 4, y: 5 },
    checkpoints: [{ x: 3, y: 2 }, { x: 5, y: 6 }],
    powerups: [{ x: 7, y: 1, type: 'wallPass' }, { x: 2, y: 7, type: 'reveal' }],
    gems: [{ x: 1, y: 3 }, { x: 6, y: 4 }, { x: 3, y: 6 }],
    perfectTime: 100,
    grid: [
      [1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,1],
      [1,0,1,1,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,1],
      [1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,1],
      [1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,2,1],
      [1,1,1,1,1,1,1,1,1]
    ],
    start: { x: 1, y: 1 },
    end: { x: 7, y: 7 }
  },
  {
    id: 5,
    emotion: 'fear',
    size: 13,
    name: 'Floresta Sombria',
    story: 'A Borboleta tem medo do escuro. Ilumine seu caminho com coragem!',
    npc: NPCS[4],
    npcPosition: { x: 6, y: 6 },
    checkpoints: [{ x: 2, y: 3 }, { x: 5, y: 5 }, { x: 10, y: 9 }],
    powerups: [
      { x: 3, y: 1, type: 'reveal' }, 
      { x: 9, y: 11, type: 'wallPass' },
      { x: 5, y: 7, type: 'wallPass' },
      { x: 7, y: 3, type: 'doublePoints' }
    ],
    gems: [
      { x: 1, y: 5 }, { x: 3, y: 8 }, { x: 6, y: 2 },
      { x: 8, y: 10 }, { x: 11, y: 6 }
    ],
    perfectTime: 150,
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,0,1,0,1,0,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,0,1,1,1,1,1,0,1,1,1],
      [1,0,0,0,1,0,0,0,1,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,1,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    start: { x: 1, y: 1 },
    end: { x: 11, y: 11 }
  }
];

// NÍVEIS ESPELHADOS
const MIRROR_LEVELS = [
  {
    id: 6,
    emotion: 'mirror',
    size: 11,
    name: 'Mundo Espelhado 1',
    story: 'Tudo está invertido! A Tartaruga precisa de ajuda para entender este mundo ao contrário!',
    npc: NPCS[5],
    npcPosition: { x: 5, y: 5 },
    checkpoints: [{ x: 8, y: 3 }, { x: 3, y: 7 }],
    powerups: [
      { x: 9, y: 1, type: 'wallPass' },
      { x: 1, y: 9, type: 'wallPass' },
      { x: 5, y: 5, type: 'reveal' }
    ],
    gems: [
      { x: 2, y: 2 }, { x: 8, y: 8 }, { x: 4, y: 6 },
      { x: 6, y: 4 }, { x: 9, y: 5 }
    ],
    perfectTime: 180,
    grid: [],
    start: { x: 9, y: 1 },
    end: { x: 1, y: 9 }
  },
  {
    id: 7,
    emotion: 'mirror',
    size: 13,
    name: 'Mundo Espelhado Final',
    story: 'O desafio final! Todos os amigos estão presos no mundo invertido!',
    npc: null,
    npcPosition: { x: 6, y: 6 },
    checkpoints: [{ x: 10, y: 3 }, { x: 7, y: 7 }, { x: 2, y: 9 }],
    powerups: [
      { x: 10, y: 1, type: 'wallPass' },
      { x: 2, y: 11, type: 'wallPass' },
      { x: 6, y: 6, type: 'reveal' },
      { x: 8, y: 4, type: 'doublePoints' }
    ],
    gems: [
      { x: 11, y: 2 }, { x: 9, y: 4 }, { x: 7, y: 6 },
      { x: 5, y: 8 }, { x: 3, y: 10 }, { x: 1, y: 7 }
    ],
    perfectTime: 200,
    grid: [],
    start: { x: 11, y: 1 },
    end: { x: 1, y: 11 }
  }
];

// COMPONENTE PRINCIPAL
export default function EmotionMaze() {
  const [gameState, setGameState] = useState<'intro' | 'story' | 'playing' | 'paused' | 'levelComplete' | 'gameComplete' | 'mirrorUnlocked'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [npcFollowing, setNpcFollowing] = useState(false);
  const [visitedCheckpoints, setVisitedCheckpoints] = useState<Set<string>>(new Set());
  const [collectedPowerups, setCollectedPowerups] = useState<Set<string>>(new Set());
  const [collectedGems, setCollectedGems] = useState<Set<string>>(new Set());
  const [activePowerup, setActivePowerup] = useState<string | null>(null);
  const [powerupTimeLeft, setPowerupTimeLeft] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<keyof typeof EMOTIONS>('joy');
  const [rescuedNpcs, setRescuedNpcs] = useState<string[]>([]);
  const [showCutscene, setShowCutscene] = useState(false);
  const [cutsceneContent, setCutsceneContent] = useState({ title: '', text: '', image: '' });
  const [mirrorLevelsUnlocked, setMirrorLevelsUnlocked] = useState(false);
  const [allLevels, setAllLevels] = useState(LEVELS);
  const [showPath, setShowPath] = useState(false);
  const [showGems, setShowGems] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const level = allLevels[currentLevel] || LEVELS[0];

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activePowerup && powerupTimeLeft > 0) {
      interval = setInterval(() => {
        setPowerupTimeLeft(prev => {
          if (prev <= 1) {
            setActivePowerup(null);
            if (activePowerup === 'reveal') {
              setShowGems(false);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePowerup, powerupTimeLeft]);

  const generateMirrorLevel = useCallback((levelIndex: number) => {
    if (levelIndex === 5) {
      const mirroredGrid = mirrorMaze(LEVELS[2].grid);
      return { ...MIRROR_LEVELS[0], grid: mirroredGrid };
    } else if (levelIndex === 6) {
      const mirroredGrid = mirrorMaze(LEVELS[4].grid);
      return { ...MIRROR_LEVELS[1], grid: mirroredGrid };
    }
    return MIRROR_LEVELS[0];
  }, []);

  const initLevel = useCallback((levelIndex: number) => {
    let newLevel = allLevels[levelIndex];
    
    if (levelIndex >= 5) {
      newLevel = generateMirrorLevel(levelIndex);
      const updatedLevels = [...allLevels];
      updatedLevels[levelIndex] = newLevel;
      setAllLevels(updatedLevels);
    }
    
    setPlayerPosition(newLevel.start);
    setCurrentEmotion(newLevel.emotion as keyof typeof EMOTIONS);
    setNpcFollowing(false);
    setVisitedCheckpoints(new Set());
    setCollectedPowerups(new Set());
    setCollectedGems(new Set());
    setActivePowerup(null);
    setPowerupTimeLeft(0);
    setMoves(0);
    setTimeElapsed(0);
    setShowPath(false);
    setShowGems(false);
  }, [allLevels, generateMirrorLevel]);

  const startGame = () => {
    if (allLevels.length === 5) {
      setAllLevels([...LEVELS, ...MIRROR_LEVELS]);
    }
    
    setCurrentLevel(0);
    initLevel(0);
    setScore(0);
    setRescuedNpcs([]);
    setGameState('story');
    
    setCutsceneContent({
      title: 'O Labirinto das Emoções',
      text: 'Leo e Mila descobriram que seus amigos estão perdidos em labirintos emocionais!',
      image: '🌈'
    });
    setShowCutscene(true);
  };

  const startLevel = () => {
    setShowCutscene(false);
    setGameState('playing');
  };

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState !== 'playing') return;

    const newPos = { ...playerPosition };
    
    switch(direction) {
      case 'up': newPos.y = Math.max(0, newPos.y - 1); break;
      case 'down': newPos.y = Math.min(level.size - 1, newPos.y + 1); break;
      case 'left': newPos.x = Math.max(0, newPos.x - 1); break;
      case 'right': newPos.x = Math.min(level.size - 1, newPos.x + 1); break;
    }

    if (!level.grid[newPos.y] || level.grid[newPos.y][newPos.x] === undefined) {
      return;
    }

    const canPassWalls = activePowerup === 'wallPass';
    if (level.grid[newPos.y][newPos.x] === 1 && !canPassWalls) {
      return;
    }

    setPlayerPosition(newPos);
    setMoves(prev => prev + 1);
    if (soundEnabled) playSound('footstep', 0.1);

    if (level.grid[newPos.y][newPos.x] === 1 && canPassWalls) {
      if (soundEnabled) playSound('wallPass', 0.2);
    }

    const gemKey = `${newPos.x},${newPos.y}`;
    const gem = level.gems?.find(g => g.x === newPos.x && g.y === newPos.y);
    if (gem && !collectedGems.has(gemKey)) {
      setCollectedGems(prev => new Set(prev).add(gemKey));
      const gemPoints = activePowerup === 'doublePoints' ? 200 : 100;
      setScore(prev => prev + gemPoints);
      if (soundEnabled) playSound('gem');
    }

    const checkpointKey = `${newPos.x},${newPos.y}`;
    const checkpoint = level.checkpoints?.find(cp => cp.x === newPos.x && cp.y === newPos.y);
    if (checkpoint && !visitedCheckpoints.has(checkpointKey)) {
      setVisitedCheckpoints(prev => new Set(prev).add(checkpointKey));
      const checkpointPoints = activePowerup === 'doublePoints' ? 100 : 50;
      setScore(prev => prev + checkpointPoints);
      if (soundEnabled) playSound('checkpoint');
    }

    const powerupKey = `${newPos.x},${newPos.y}`;
    const powerup = level.powerups?.find(p => p.x === newPos.x && p.y === newPos.y);
    if (powerup && !collectedPowerups.has(powerupKey)) {
      setCollectedPowerups(prev => new Set(prev).add(powerupKey));
      const powerupData = POWERUPS[powerup.type as keyof typeof POWERUPS];
      setActivePowerup(powerup.type);
      setPowerupTimeLeft(powerupData.duration);
      setScore(prev => prev + 75);
      if (soundEnabled) playSound('powerup');
      
      if (powerup.type === 'reveal') {
        setShowPath(true);
        setShowGems(true);
        setTimeout(() => {
          setShowPath(false);
          setShowGems(false);
        }, powerupData.duration * 1000);
      }
    }

    if (!npcFollowing && level.npc && newPos.x === level.npcPosition.x && newPos.y === level.npcPosition.y) {
      setNpcFollowing(true);
      setRescuedNpcs(prev => [...prev, level.npc.id]);
      const npcPoints = activePowerup === 'doublePoints' ? 200 : 100;
      setScore(prev => prev + npcPoints);
      if (soundEnabled) playSound('checkpoint', 0.5);
    }

    if (newPos.x === level.end.x && newPos.y === level.end.y) {
      completeLevel();
    }
  }, [gameState, playerPosition, level, npcFollowing, visitedCheckpoints, collectedPowerups, collectedGems, activePowerup, soundEnabled]);

  const completeLevel = () => {
    const timeBonus = Math.max(0, level.perfectTime - timeElapsed) * 2;
    const checkpointBonus = visitedCheckpoints.size * 50;
    const powerupBonus = collectedPowerups.size * 75;
    const gemBonus = collectedGems.size * 100;
    const npcBonus = npcFollowing ? 200 : 0;
    const totalScore = timeBonus + checkpointBonus + powerupBonus + gemBonus + npcBonus;
    
    setScore(prev => prev + totalScore);
    
    let earnedStars = 1;
    if (collectedGems.size === level.gems?.length && npcFollowing) earnedStars = 3;
    else if (timeElapsed <= level.perfectTime * 1.5) earnedStars = 2;
    
    setStars(earnedStars);
    
    if (soundEnabled) playSound('levelComplete');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    if (currentLevel === 4 && !mirrorLevelsUnlocked) {
      setMirrorLevelsUnlocked(true);
      setTimeout(() => {
        setGameState('mirrorUnlocked');
      }, 2000);
    } else {
      setGameState('levelComplete');
    }
  };

  const nextLevel = () => {
    if (currentLevel < allLevels.length - 1) {
      const nextLevelIndex = currentLevel + 1;
      setCurrentLevel(nextLevelIndex);
      initLevel(nextLevelIndex);
      setGameState('story');
      
      const nextLevelData = allLevels[nextLevelIndex];
      setCutsceneContent({
        title: nextLevelData.name,
        text: nextLevelData.story,
        image: EMOTIONS[nextLevelData.emotion as keyof typeof EMOTIONS].icon
      });
      setShowCutscene(true);
    } else {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      });
      setGameState('gameComplete');
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const keyMap: { [key: string]: 'up' | 'down' | 'left' | 'right' } = {
        'ArrowUp': 'up', 'w': 'up', 'W': 'up',
        'ArrowDown': 'down', 's': 'down', 'S': 'down',
        'ArrowLeft': 'left', 'a': 'left', 'A': 'left',
        'ArrowRight': 'right', 'd': 'right', 'D': 'right'
      };
      
      const direction = keyMap[e.key];
      if (direction) {
        e.preventDefault();
        movePlayer(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  const renderCell = (x: number, y: number) => {
    if (!level.grid[y] || level.grid[y][x] === undefined) {
      return null;
    }
    
    const isWall = level.grid[y][x] === 1;
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    const isEnd = x === level.end.x && y === level.end.y;
    const isNpc = !npcFollowing && level.npc && x === level.npcPosition.x && y === level.npcPosition.y;
    const isCheckpoint = level.checkpoints?.some(cp => cp.x === x && cp.y === y);
    const isPowerup = level.powerups?.some(p => p.x === x && p.y === y && !collectedPowerups.has(`${x},${y}`));
    const isGem = level.gems?.some(g => g.x === x && g.y === y && !collectedGems.has(`${x},${y}`));
    const isOnPath = showPath && !isWall;
    
    let className = styles.cell;
    if (isWall) className += ` ${styles.cellWall}`;
    else if (isCheckpoint && !visitedCheckpoints.has(`${x},${y}`)) className += ` ${styles.cellCheckpoint}`;
    else className += ` ${styles.cellPath}`;
    
    if (isOnPath && !isPlayer && !isEnd) className += ` ${styles.cellRevealed}`;
    
    // Tamanho responsivo das células
    const cellSize = isMobile 
      ? level.size > 10 ? '20px' : level.size > 7 ? '28px' : '35px'
      : level.size > 10 ? '24px' : level.size > 7 ? '32px' : '40px';
    
    const fontSize = isMobile ? '12px' : '16px';
    
    return (
      <div 
        key={`${x}-${y}`} 
        className={className}
        style={{ 
          width: cellSize, 
          height: cellSize,
          fontSize: fontSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isPlayer && <span style={{ fontSize }}>🧑</span>}
        {isEnd && !isPlayer && <span style={{ fontSize }}>🎯</span>}
        {isNpc && <span style={{ fontSize }}>{level.npc.emoji}</span>}
        {isCheckpoint && !visitedCheckpoints.has(`${x},${y}`) && !isPlayer && !isNpc && <span style={{ fontSize }}>⭐</span>}
        {isPowerup && !isPlayer && (
          <span style={{ fontSize }}>{POWERUPS[level.powerups.find(p => p.x === x && p.y === y)?.type as keyof typeof POWERUPS]?.icon}</span>
        )}
        {isGem && (showGems || !isWall) && !isPlayer && <span style={{ fontSize }}>💎</span>}
      </div>
    );
  };

  const emotionTheme = EMOTIONS[currentEmotion];

  return (
    <div className={`${styles.gameContainer} ${styles[`theme${currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}`]}`}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/dashboard" className="flex items-center text-teal-600 hover:text-teal-700">
              <ChevronLeft className="h-5 w-5" />
              <span className="ml-1 font-medium hidden sm:inline">Voltar</span>
            </Link>
            <h1 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="text-red-500 h-5 w-5" />
              <span>Labirinto</span>
            </h1>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/50"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {gameState === 'playing' && (
        <>
          <div className="bg-white/90 rounded-lg px-3 py-1 m-2 inline-block">
            <span className="text-sm font-bold text-gray-800">
              {emotionTheme.icon} {emotionTheme.name}
            </span>
          </div>
          
          {activePowerup && (
            <div className="bg-purple-600 text-white rounded-lg px-3 py-1 m-2 inline-block">
              <span className="text-sm font-bold">
                {POWERUPS[activePowerup as keyof typeof POWERUPS].icon} {powerupTimeLeft}s
              </span>
            </div>
          )}
        </>
      )}

      <main className="flex-1 p-4 flex flex-col" style={{ paddingBottom: isMobile ? '150px' : '20px' }}>
        {gameState === 'intro' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl max-w-3xl mx-auto">
              <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-gray-800">
                O Labirinto das Emoções
              </h1>
              
              <div className="flex justify-center gap-4 mb-4">
                <div className="text-5xl">🦁</div>
                <div className="text-5xl">🦄</div>
              </div>
              
              <p className="text-sm sm:text-lg text-gray-700 mb-4">
                Ajude Leo e Mila a resgatar amigos perdidos!
              </p>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {Object.entries(EMOTIONS).slice(0, 6).map(([key, emotion]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-2">
                    <div className="text-2xl">{emotion.icon}</div>
                    <div className="text-xs font-semibold text-gray-800">{emotion.name}</div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl text-lg font-bold"
              >
                <Play className="inline mr-2" />
                Começar
              </button>
            </div>
          </motion.div>
        )}

        {showCutscene && (
          <div className="flex items-center justify-center flex-1">
            <motion.div 
              className="bg-white/90 rounded-2xl p-6 max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-5xl mb-4 text-center">{cutsceneContent.image}</div>
              <h2 className="text-xl font-bold mb-3 text-gray-800 text-center">{cutsceneContent.title}</h2>
              <p className="text-sm text-gray-700 mb-4 text-center">{cutsceneContent.text}</p>
              <button
                onClick={startLevel}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
              >
                Vamos lá!
              </button>
            </motion.div>
          </div>
        )}

        {gameState === 'playing' && (
          <>
            {/* Informações no topo para mobile */}
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              <div className="bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-800">
                ⭐ {score}
              </div>
              <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-800">
                💎 {collectedGems.size}/{level.gems?.length || 0}
              </div>
              <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-800">
                🐾 {npcFollowing ? '✅' : '0/1'}
              </div>
            </div>

            {/* Labirinto */}
            <div className="flex justify-center items-center flex-1">
              <div 
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: `repeat(${level.size}, 1fr)`,
                  gap: '1px',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  padding: '4px',
                  borderRadius: '8px'
                }}
              >
                {level.grid.map((row, y) =>
                  row.map((_, x) => renderCell(x, y))
                )}
              </div>
            </div>

            {/* Controles */}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 rounded-xl p-3 shadow-lg">
              <div className="grid grid-cols-3 gap-1 w-32">
                <div></div>
                <button
                  onClick={() => movePlayer('up')}
                  className="bg-blue-500 text-white p-3 rounded-lg active:bg-blue-600"
                >
                  ↑
                </button>
                <div></div>
                <button
                  onClick={() => movePlayer('left')}
                  className="bg-blue-500 text-white p-3 rounded-lg active:bg-blue-600"
                >
                  ←
                </button>
                <button
                  onClick={() => movePlayer('down')}
                  className="bg-blue-500 text-white p-3 rounded-lg active:bg-blue-600"
                >
                  ↓
                </button>
                <button
                  onClick={() => movePlayer('right')}
                  className="bg-blue-500 text-white p-3 rounded-lg active:bg-blue-600"
                >
                  →
                </button>
              </div>
            </div>
          </>
        )}

        {gameState === 'mirrorUnlocked' && (
          <div className="flex items-center justify-center flex-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/90 rounded-2xl p-6 max-w-md text-center"
            >
              <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3 text-purple-600">
                MUNDOS ESPELHADOS!
              </h2>
              <p className="text-gray-700 mb-4">
                Tudo está invertido! Esquerda é direita!
              </p>
              <button
                onClick={() => setGameState('levelComplete')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold"
              >
                Aceitar Desafio!
              </button>
            </motion.div>
          </div>
        )}

        {gameState === 'levelComplete' && (
          <div className="flex items-center justify-center flex-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/90 rounded-2xl p-6 max-w-md text-center"
            >
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Nível Completo!</h2>
              
              <div className="flex justify-center gap-2 mb-3">
                {[1, 2, 3].map(i => (
                  <Star
                    key={i}
                    className={`w-10 h-10 ${i <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              
              <div className="text-sm text-gray-700 space-y-1 mb-4">
                <p>Movimentos: {moves}</p>
                <p>Gemas: {collectedGems.size}/{level.gems?.length || 0}</p>
                <p className="text-xl font-bold text-gray-800">Pontos: {score}</p>
              </div>
              
              <button
                onClick={nextLevel}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold w-full"
              >
                {currentLevel === 4 ? 'Mundos Espelhados!' : 'Próximo Nível'}
              </button>
            </motion.div>
          </div>
        )}

        {gameState === 'gameComplete' && (
          <div className="flex items-center justify-center flex-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/90 rounded-2xl p-6 max-w-md text-center"
            >
              <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-3 text-purple-600">
                VOCÊ VENCEU!
              </h2>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {rescuedNpcs.map(npcId => {
                  const npc = NPCS.find(n => n.id === npcId);
                  return npc ? (
                    <div key={npcId} className="text-3xl">
                      {npc.emoji}
                    </div>
                  ) : null;
                })}
              </div>
              
              <p className="text-2xl font-bold text-gray-800 mb-4">
                Pontuação: {score}
              </p>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold w-full"
              >
                Jogar Novamente
              </button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
