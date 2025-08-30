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

// Configuração de sons (SEM O SOM DE SUCESSO)
const SOUNDS = {
  footstep: '/sounds/footstep.wav',
  checkpoint: '/sounds/coin.wav',
  powerup: '/sounds/magic.wav',
  gem: '/sounds/coin.wav',
  wallPass: '/sounds/magic.wav'
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
  { id: 'bunny', name: 'Coelhinho', emoji: '🐰', dialogue: 'Obrigado por me salvar! Estava perdido!' },
  { id: 'bird', name: 'Passarinho', emoji: '🐦', dialogue: 'Que alívio! Agora posso voar de novo!' },
  { id: 'cat', name: 'Gatinho', emoji: '🐱', dialogue: 'Miau! Você é muito gentil!' },
  { id: 'dog', name: 'Cachorrinho', emoji: '🐶', dialogue: 'Au au! Vamos ser amigos!' },
  { id: 'butterfly', name: 'Borboleta', emoji: '🦋', dialogue: 'Suas cores voltaram! Obrigado!' },
  { id: 'turtle', name: 'Tartaruga', emoji: '🐢', dialogue: 'Devagar e sempre! Obrigado!' }
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
    dialogues: {
      start: 'Vamos espalhar alegria e resgatar nosso amigo!',
      checkpoint: 'Ótimo! Você encontrou um ponto seguro!',
      powerup: 'Poder especial ativado!',
      gem: 'Gema secreta encontrada! +100 pontos!',
      npcRescue: 'Você resgatou o Coelhinho! Ele está feliz agora!',
      complete: 'Parabéns! A alegria está restaurada!'
    },
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
    dialogues: {
      start: 'Respire fundo. Vamos trazer tranquilidade ao nosso amigo.',
      checkpoint: 'Muito bem! Pause e respire aqui.',
      powerup: 'Poder ativado!',
      gem: 'Gema da tranquilidade! +100 pontos!',
      npcRescue: 'O Passarinho está calmo agora. Que paz!',
      complete: 'A tranquilidade foi restaurada. Namastê!'
    },
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
    dialogues: {
      start: 'Seja corajoso! Nosso amigo precisa de você!',
      checkpoint: 'Excelente! Sua coragem está crescendo!',
      powerup: 'Poder especial ativado!',
      gem: 'Gema da coragem descoberta! +100 pontos!',
      npcRescue: 'O Gatinho encontrou sua coragem! Miau!',
      complete: 'Você é um verdadeiro herói! Que coragem!'
    },
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
    dialogues: {
      start: 'Às vezes precisamos aceitar a tristeza para seguir em frente.',
      checkpoint: 'Está tudo bem. Descanse um pouco aqui.',
      powerup: 'Força renovada!',
      gem: 'Lágrima cristalizada! +100 pontos!',
      npcRescue: 'O Cachorrinho aprendeu que a tristeza passa. Au au!',
      complete: 'A tristeza foi acolhida e transformada em aprendizado.'
    },
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
    dialogues: {
      start: 'O medo é normal, mas podemos enfrentá-lo juntos!',
      checkpoint: 'Muito bem! Cada passo é uma vitória!',
      powerup: 'Poder mágico adquirido!',
      gem: 'Cristal sombrio encontrado! +100 pontos!',
      npcRescue: 'A Borboleta encontrou sua luz interior!',
      complete: 'Você transformou o medo em força! Incrível!'
    },
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
    dialogues: {
      start: 'Cuidado! Tudo está espelhado! Direita é esquerda!',
      checkpoint: 'Você está pegando o jeito!',
      powerup: 'Poder espelhado ativado!',
      gem: 'Gema refletida! +100 pontos!',
      npcRescue: 'A Tartaruga entendeu o espelho!',
      complete: 'Você dominou o mundo espelhado!'
    },
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
    dialogues: {
      start: 'O DESAFIO SUPREMO ESPELHADO!',
      checkpoint: 'Continue! Você está quase lá!',
      powerup: 'Super poder espelhado!',
      gem: 'Mega gema invertida! +100 pontos!',
      npcRescue: 'Todos salvos!',
      complete: 'VOCÊ É O MESTRE DOS ESPELHOS!'
    },
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
  const [showDialogue, setShowDialogue] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState<'leo' | 'mila'>('leo');
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

  const level = allLevels[currentLevel] || LEVELS[0];

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
    setShowDialogue(false);
    setShowPath(false);
    setShowGems(false);
  }, [allLevels, generateMirrorLevel]);

  const showGameDialogue = (text: string, speaker: 'leo' | 'mila' = 'leo') => {
    setCurrentDialogue(text);
    setCurrentSpeaker(speaker);
    setShowDialogue(true);
  };

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
    const emotion = EMOTIONS[level.emotion as keyof typeof EMOTIONS];
    showGameDialogue(level.dialogues.start, emotion.mascot as 'leo' | 'mila');
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
      showGameDialogue(level.dialogues.gem);
      if (soundEnabled) playSound('gem');
    }

    const checkpointKey = `${newPos.x},${newPos.y}`;
    const checkpoint = level.checkpoints?.find(cp => cp.x === newPos.x && cp.y === newPos.y);
    if (checkpoint && !visitedCheckpoints.has(checkpointKey)) {
      setVisitedCheckpoints(prev => new Set(prev).add(checkpointKey));
      showGameDialogue(level.dialogues.checkpoint);
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
      showGameDialogue(powerupData.description);
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
      showGameDialogue(level.dialogues.npcRescue);
      const npcPoints = activePowerup === 'doublePoints' ? 200 : 100;
      setScore(prev => prev + npcPoints);
      if (soundEnabled) playSound('checkpoint', 0.5);
      
      setTimeout(() => {
        showGameDialogue(level.npc.dialogue);
      }, 2000);
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
    
    // Apenas confete, SEM SOM!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    showGameDialogue(level.dialogues.complete);
    
    if (currentLevel === 4 && !mirrorLevelsUnlocked) {
      setMirrorLevelsUnlocked(true);
      setTimeout(() => {
        setGameState('mirrorUnlocked');
      }, 3000);
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
      // Jogo completo - apenas confete extra, SEM SOM!
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
    
    const cellSize = level.size > 20 ? 16 : level.size > 10 ? 24 : 32;
    
    return (
      <div 
        key={`${x}-${y}`} 
        className={className}
        style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
      >
        {isPlayer && <span className={styles.player}>🧑</span>}
        {isEnd && !isPlayer && <span>🎯</span>}
        {isNpc && <span className={styles.npc}>{level.npc.emoji}</span>}
        {isCheckpoint && !visitedCheckpoints.has(`${x},${y}`) && !isPlayer && !isNpc && <span>⭐</span>}
        {isPowerup && !isPlayer && (
          <span>{POWERUPS[level.powerups.find(p => p.x === x && p.y === y)?.type as keyof typeof POWERUPS]?.icon}</span>
        )}
        {isGem && (showGems || !isWall) && !isPlayer && <span>💎</span>}
      </div>
    );
  };

  const emotionTheme = EMOTIONS[currentEmotion];

  return (
    <div className={`${styles.gameContainer} ${styles[`theme${currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}`]}`}>
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center text-teal-600 hover:text-teal-700">
              <ChevronLeft className="h-6 w-6" />
              <span className="ml-1 font-medium">Voltar</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="text-red-500" />
              <span>Labirinto das Emoções</span>
            </h1>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/50"
            >
              {soundEnabled ? <Volume2 /> : <VolumeX />}
            </button>
          </div>
        </div>
      </header>

      {gameState === 'playing' && (
        <>
          <div className={styles.emotionIndicator}>
            <div className={styles.emotionTitle}>Emoção Atual</div>
            <div className={styles.emotionCurrent}>
              <span className={styles.emotionIcon}>{emotionTheme.icon}</span>
              <span>{emotionTheme.name}</span>
            </div>
          </div>
          
          {activePowerup && (
            <div className={styles.powerupIndicator} style={{ backgroundColor: POWERUPS[activePowerup as keyof typeof POWERUPS].color }}>
              <div className="text-white font-bold">
                {POWERUPS[activePowerup as keyof typeof POWERUPS].icon} {POWERUPS[activePowerup as keyof typeof POWERUPS].name}
              </div>
              <div className="text-white text-2xl font-bold">
                {powerupTimeLeft}s
              </div>
            </div>
          )}
        </>
      )}

      <main className="p-6 max-w-7xl mx-auto">
        {gameState === 'intro' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">
                O Labirinto das Emoções
              </h1>
              
              <div className="flex justify-center gap-4 mb-6">
                <div className="text-6xl animate-bounce">🦁</div>
                <div className="text-6xl animate-bounce" style={{ animationDelay: '0.1s' }}>🦄</div>
              </div>
              
              <p className="text-lg text-gray-600 mb-6">
                Ajude Leo e Mila a resgatar amigos perdidos em labirintos emocionais!
                Complete os 5 níveis para desbloquear os MUNDOS ESPELHADOS!
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(EMOTIONS).map(([key, emotion]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-3xl mb-2">{emotion.icon}</div>
                    <div className="font-semibold">{emotion.name}</div>
                  </div>
                ))}
              </div>
              
              <div className="bg-purple-100 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-purple-800 mb-2">🎮 Power-ups e Tesouros!</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>🕐 Atravessar Paredes</div>
                  <div>👁️ Revelar Segredos</div>
                  <div>💎 Gemas Escondidas</div>
                </div>
              </div>
              
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:scale-105 transition-transform"
              >
                <Play className="inline mr-2" />
                Começar Aventura
              </button>
            </div>
          </motion.div>
        )}

        {showCutscene && (
          <div className={styles.cutscene}>
            <motion.div 
              className={styles.cutsceneContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-6xl mb-4">{cutsceneContent.image}</div>
              <h2 className="text-2xl font-bold mb-4">{cutsceneContent.title}</h2>
              <p className="text-lg mb-6">{cutsceneContent.text}</p>
              {currentLevel >= 5 && (
                <div className="bg-yellow-100 p-3 rounded-lg mb-4">
                  <p className="text-sm font-bold">⚠️ MUNDO ESPELHADO - Tudo está invertido!</p>
                </div>
              )}
              <button
                onClick={startLevel}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
              >
                Vamos lá!
              </button>
            </motion.div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
            <div 
              className={styles.mazeGrid} 
              style={{ 
                gridTemplateColumns: `repeat(${level.size}, 1fr)`
              }}
            >
              {level.grid.map((row, y) =>
                row.map((_, x) => renderCell(x, y))
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur rounded-xl p-4 space-y-2">
                <div className="text-lg font-bold">Nível {currentLevel + 1} de {allLevels.length}</div>
                <div className="flex items-center gap-2">
                  <Users className="text-blue-500" />
                  <span>NPCs: {npcFollowing ? '1/1' : '0/1'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gem className="text-purple-500" />
                  <span>Gemas: {collectedGems.size}/{level.gems?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="text-green-500" />
                  <span>Movimentos: {moves}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-orange-500" />
                  <span>Tempo: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" />
                  <span>Pontos: {score}</span>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-xl p-4">
                <div className="grid grid-cols-3 gap-2 w-36 mx-auto">
                  <div></div>
                  <button
                    onClick={() => movePlayer('up')}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                  >
                    ↑
                  </button>
                  <div></div>
                  <button
                    onClick={() => movePlayer('left')}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => movePlayer('down')}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => movePlayer('right')}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'mirrorUnlocked' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur rounded-2xl p-8 max-w-2xl mx-auto text-center"
          >
            <Sparkles className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              MUNDOS ESPELHADOS DESBLOQUEADOS!
            </h2>
            <p className="text-xl mb-6">
              Você completou todos os níveis normais! Agora enfrente os MUNDOS ESPELHADOS!
            </p>
            <div className="bg-yellow-100 rounded-lg p-4 mb-6">
              <p className="font-bold text-lg mb-2">🪞 Como funciona:</p>
              <p>Tudo está invertido! Esquerda é direita, direita é esquerda!</p>
              <p>Você precisa pensar de forma diferente!</p>
            </div>
            <button
              onClick={() => setGameState('levelComplete')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:scale-105 transition-transform"
            >
              Aceitar o Desafio!
            </button>
          </motion.div>
        )}

        {gameState === 'levelComplete' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur rounded-2xl p-8 max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Nível Completo!</h2>
            
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map(i => (
                <Star
                  key={i}
                  className={`w-12 h-12 ${i <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
            
            <div className="space-y-2 mb-6">
              <p>Tempo: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</p>
              <p>Movimentos: {moves}</p>
              <p>NPCs Resgatados: {npcFollowing ? '✅' : '❌'}</p>
              <p>Gemas Coletadas: {collectedGems.size}/{level.gems?.length || 0}</p>
              <p>Power-ups: {collectedPowerups.size}</p>
              <p className="text-2xl font-bold">Pontuação: {score}</p>
            </div>
            
            {currentLevel < allLevels.length - 1 ? (
              <button
                onClick={nextLevel}
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
              >
                {currentLevel === 4 ? 'Ir para Mundos Espelhados!' : 'Próximo Nível'}
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
              >
                Jogar Novamente
              </button>
            )}
          </motion.div>
        )}

        {gameState === 'gameComplete' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur rounded-2xl p-8 max-w-3xl mx-auto text-center"
          >
            <Sparkles className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              VOCÊ É O MESTRE DOS LABIRINTOS!
            </h2>
            <p className="text-2xl mb-6">
              Completou TODOS os labirintos, incluindo os ESPELHADOS!
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {rescuedNpcs.map(npcId => {
                const npc = NPCS.find(n => n.id === npcId);
                return npc ? (
                  <div key={npcId} className="text-4xl">
                    {npc.emoji}
                  </div>
                ) : null;
              })}
            </div>
            
            <p className="text-4xl font-bold mb-6 animate-pulse">
              Pontuação Final: {score}
            </p>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:scale-105 transition-transform"
            >
              Jogar Novamente
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {showDialogue && (
            <motion.div
              className={styles.dialogueBox}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
            >
              <div className={styles.dialogueCharacter}>
                <div className={styles.dialogueAvatar}>
                  {currentSpeaker === 'leo' ? '🦁' : '🦄'}
                </div>
                <div className={styles.dialogueName}>
                  {currentSpeaker === 'leo' ? 'Leo' : 'Mila'}
                </div>
              </div>
              <div className={styles.dialogueText}>{currentDialogue}</div>
              <button
                onClick={() => setShowDialogue(false)}
                className={styles.dialogueButton}
              >
                Continuar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
