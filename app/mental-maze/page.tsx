// app/components/activities/emotion-maze/EmotionMaze.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Heart, Star, Users, Compass, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './emotionmaze.module.css';

// Tipos de emoções e suas configurações
const EMOTIONS = {
  joy: {
    name: 'Alegria',
    icon: '😊',
    color: '#FFE066',
    message: 'A alegria ilumina nosso caminho!',
    mascot: 'mila',
    bgMusic: 'joy_theme.mp3',
    particles: true
  },
  calm: {
    name: 'Calma',
    icon: '😌',
    color: '#B2DFDB',
    message: 'Respire fundo e encontre seu centro.',
    mascot: 'leo',
    bgMusic: 'calm_theme.mp3',
    particles: false
  },
  courage: {
    name: 'Coragem',
    icon: '💪',
    color: '#7E57C2',
    message: 'Seja corajoso, você consegue!',
    mascot: 'leo',
    bgMusic: 'courage_theme.mp3',
    particles: true
  },
  sadness: {
    name: 'Tristeza',
    icon: '😢',
    color: '#64B5F6',
    message: 'Está tudo bem sentir tristeza às vezes.',
    mascot: 'mila',
    bgMusic: 'sadness_theme.mp3',
    particles: false
  },
  fear: {
    name: 'Medo',
    icon: '😰',
    color: '#757575',
    message: 'O medo nos protege, mas podemos superá-lo.',
    mascot: 'leo',
    bgMusic: 'fear_theme.mp3',
    particles: false
  }
};

// NPCs para resgatar
const NPCS = [
  { id: 'bunny', name: 'Coelhinho', emoji: '🐰', dialogue: 'Obrigado por me salvar! Estava perdido!' },
  { id: 'bird', name: 'Passarinho', emoji: '🐦', dialogue: 'Que alívio! Agora posso voar de novo!' },
  { id: 'cat', name: 'Gatinho', emoji: '🐱', dialogue: 'Miau! Você é muito gentil!' },
  { id: 'dog', name: 'Cachorrinho', emoji: '🐶', dialogue: 'Au au! Vamos ser amigos!' },
  { id: 'butterfly', name: 'Borboleta', emoji: '🦋', dialogue: 'Suas cores voltaram! Obrigado!' }
];

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
    perfectTime: 60,
    dialogues: {
      start: 'Vamos espalhar alegria e resgatar nosso amigo!',
      checkpoint: 'Ótimo! Você encontrou um ponto seguro!',
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
    perfectTime: 90,
    dialogues: {
      start: 'Respire fundo. Vamos trazer tranquilidade ao nosso amigo.',
      checkpoint: 'Muito bem! Pause e respire aqui.',
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
    perfectTime: 120,
    dialogues: {
      start: 'Seja corajoso! Nosso amigo precisa de você!',
      checkpoint: 'Excelente! Sua coragem está crescendo!',
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
    perfectTime: 100,
    dialogues: {
      start: 'Às vezes precisamos aceitar a tristeza para seguir em frente.',
      checkpoint: 'Está tudo bem. Descanse um pouco aqui.',
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
    size: 11,
    name: 'Floresta Sombria',
    story: 'A Borboleta tem medo do escuro. Ilumine seu caminho com coragem!',
    npc: NPCS[4],
    npcPosition: { x: 6, y: 6 },
    checkpoints: [{ x: 2, y: 3 }, { x: 5, y: 5 }, { x: 8, y: 7 }],
    perfectTime: 150,
    dialogues: {
      start: 'O medo é normal, mas podemos enfrentá-lo juntos!',
      checkpoint: 'Muito bem! Cada passo é uma vitória!',
      npcRescue: 'A Borboleta encontrou sua luz interior!',
      complete: 'Você transformou o medo em força! Incrível!'
    },
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,0,1,0,1,0,1,0,1],
      [1,0,1,0,0,0,1,0,0,0,1],
      [1,0,1,1,1,1,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,1,0,1],
      [1,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,2,1],
      [1,1,1,1,1,1,1,1,1,1,1]
    ],
    start: { x: 1, y: 1 },
    end: { x: 9, y: 9 }
  }
];

// Componente do Cabeçalho
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }: any) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center text-teal-600 hover:text-teal-700 transition-colors">
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium">Voltar</span>
        </Link>
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h1>
        {showSaveButton && onSave ? (
          <button
            onClick={onSave}
            disabled={isSaveDisabled}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              !isSaveDisabled
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save size={18} />
            <span>Salvar</span>
          </button>
        ) : (
          <div className="w-24"></div>
        )}
      </div>
    </div>
  </header>
);

export default function EmotionMaze() {
  const [gameState, setGameState] = useState<'intro' | 'story' | 'playing' | 'paused' | 'npcDialogue' | 'levelComplete' | 'gameComplete'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [npcFollowing, setNpcFollowing] = useState(false);
  const [visitedCheckpoints, setVisitedCheckpoints] = useState<Set<string>>(new Set());
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

  const level = LEVELS[currentLevel] || LEVELS[0];

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Inicializar nível
  const initLevel = useCallback((levelIndex: number) => {
    const newLevel = LEVELS[levelIndex];
    setPlayerPosition(newLevel.start);
    setCurrentEmotion(newLevel.emotion as keyof typeof EMOTIONS);
    setNpcFollowing(false);
    setVisitedCheckpoints(new Set());
    setMoves(0);
    setTimeElapsed(0);
    setShowDialogue(false);
  }, []);

  // Mostrar diálogo
  const showGameDialogue = (text: string, speaker: 'leo' | 'mila' = 'leo') => {
    setCurrentDialogue(text);
    setCurrentSpeaker(speaker);
    setShowDialogue(true);
  };

  // Iniciar jogo
  const startGame = () => {
    setCurrentLevel(0);
    initLevel(0);
    setScore(0);
    setRescuedNpcs([]);
    setGameState('story');
    
    // Mostrar história inicial
    setCutsceneContent({
      title: 'O Labirinto das Emoções',
      text: 'Leo e Mila descobriram que seus amigos estão perdidos em labirintos emocionais. Cada amigo precisa de ajuda para processar suas emoções e encontrar o equilíbrio!',
      image: '🌈'
    });
    setShowCutscene(true);
  };

  // Começar nível após história
  const startLevel = () => {
    setShowCutscene(false);
    setGameState('playing');
    const emotion = EMOTIONS[level.emotion as keyof typeof EMOTIONS];
    showGameDialogue(level.dialogues.start, emotion.mascot as 'leo' | 'mila');
  };

  // Movimento do jogador
  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState !== 'playing') return;

    const newPos = { ...playerPosition };
    
    switch(direction) {
      case 'up': newPos.y = Math.max(0, newPos.y - 1); break;
      case 'down': newPos.y = Math.min(level.size - 1, newPos.y + 1); break;
      case 'left': newPos.x = Math.max(0, newPos.x - 1); break;
      case 'right': newPos.x = Math.min(level.size - 1, newPos.x + 1); break;
    }

    // Verificar se não é parede
    if (level.grid[newPos.y][newPos.x] !== 1) {
      setPlayerPosition(newPos);
      setMoves(prev => prev + 1);

      // Verificar checkpoint
      const checkpointKey = `${newPos.x},${newPos.y}`;
      const checkpoint = level.checkpoints.find(cp => cp.x === newPos.x && cp.y === newPos.y);
      if (checkpoint && !visitedCheckpoints.has(checkpointKey)) {
        setVisitedCheckpoints(prev => new Set(prev).add(checkpointKey));
        showGameDialogue(level.dialogues.checkpoint);
        setScore(prev => prev + 50);
        
        if (soundEnabled) {
          // Som de checkpoint
          const audio = new Audio('/sounds/checkpoint.mp3');
          audio.play().catch(() => {});
        }
      }

      // Verificar NPC
      if (!npcFollowing && newPos.x === level.npcPosition.x && newPos.y === level.npcPosition.y) {
        setNpcFollowing(true);
        setRescuedNpcs(prev => [...prev, level.npc.id]);
        showGameDialogue(level.dialogues.npcRescue);
        setScore(prev => prev + 100);
        
        // Mostrar diálogo do NPC
        setTimeout(() => {
          showGameDialogue(level.npc.dialogue);
        }, 2000);
      }

      // Verificar fim do nível
      if (newPos.x === level.end.x && newPos.y === level.end.y) {
        completeLevel();
      }
    }
  }, [gameState, playerPosition, level, npcFollowing, visitedCheckpoints, soundEnabled]);

  // Completar nível
  const completeLevel = () => {
    const timeBonus = Math.max(0, level.perfectTime - timeElapsed) * 2;
    const checkpointBonus = visitedCheckpoints.size * 50;
    const npcBonus = npcFollowing ? 200 : 0;
    const totalScore = timeBonus + checkpointBonus + npcBonus;
    
    setScore(prev => prev + totalScore);
    
    // Calcular estrelas
    let earnedStars = 1;
    if (timeElapsed <= level.perfectTime && npcFollowing) earnedStars = 3;
    else if (timeElapsed <= level.perfectTime * 1.5) earnedStars = 2;
    
    setStars(earnedStars);
    
    // Efeito de confete
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    showGameDialogue(level.dialogues.complete);
    setGameState('levelComplete');
  };

  // Próximo nível
  const nextLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      const nextLevelIndex = currentLevel + 1;
      setCurrentLevel(nextLevelIndex);
      initLevel(nextLevelIndex);
      setGameState('story');
      
      const nextLevelData = LEVELS[nextLevelIndex];
      setCutsceneContent({
        title: nextLevelData.name,
        text: nextLevelData.story,
        image: EMOTIONS[nextLevelData.emotion as keyof typeof EMOTIONS].icon
      });
      setShowCutscene(true);
    } else {
      setGameState('gameComplete');
    }
  };

  // Controles do teclado
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

  // Renderizar célula do labirinto
  const renderCell = (x: number, y: number) => {
    const isWall = level.grid[y][x] === 1;
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    const isEnd = x === level.end.x && y === level.end.y;
    const isNpc = !npcFollowing && x === level.npcPosition.x && y === level.npcPosition.y;
    const isCheckpoint = level.checkpoints.some(cp => cp.x === x && cp.y === y);
    
    let className = styles.cell;
    if (isWall) className += ` ${styles.cellWall}`;
    else if (isCheckpoint && !visitedCheckpoints.has(`${x},${y}`)) className += ` ${styles.cellCheckpoint}`;
    else className += ` ${styles.cellPath}`;
    
    return (
      <div key={`${x}-${y}`} className={className}>
        {isPlayer && <span className={styles.player}>🧑</span>}
        {isEnd && !isPlayer && <span>🎯</span>}
        {isNpc && <span className={styles.npc}>{level.npc.emoji}</span>}
        {isCheckpoint && !visitedCheckpoints.has(`${x},${y}`) && !isPlayer && !isNpc && <span>⭐</span>}
      </div>
    );
  };

  const emotionTheme = EMOTIONS[currentEmotion];

  return (
    <div className={`${styles.gameContainer} ${styles[`theme${currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}`]}`}>
      <GameHeader 
        title="Labirinto das Emoções"
        icon={<Heart className="text-red-500" />}
        showSaveButton={false}
      />

      {/* Indicador de Emoção */}
      {gameState === 'playing' && (
        <div className={styles.emotionIndicator}>
          <div className={styles.emotionTitle}>Emoção Atual</div>
          <div className={styles.emotionCurrent}>
            <span className={styles.emotionIcon}>{emotionTheme.icon}</span>
            <span>{emotionTheme.name}</span>
          </div>
        </div>
      )}

      <main className="p-6 max-w-7xl mx-auto">
        {/* Tela Inicial */}
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
                Cada labirinto representa uma emoção diferente.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(EMOTIONS).map(([key, emotion]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-3xl mb-2">{emotion.icon}</div>
                    <div className="font-semibold">{emotion.name}</div>
                  </div>
                ))}
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

        {/* Cutscene de História */}
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
              <button
                onClick={startLevel}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
              >
                Vamos lá!
              </button>
            </motion.div>
          </div>
        )}

        {/* Área de Jogo */}
        {gameState === 'playing' && (
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
            {/* Labirinto */}
            <div className={styles.mazeGrid} style={{ gridTemplateColumns: `repeat(${level.size}, 1fr)` }}>
              {level.grid.map((row, y) =>
                row.map((_, x) => renderCell(x, y))
              )}
            </div>

            {/* Controles e Status */}
            <div className="space-y-4">
              {/* Status */}
              <div className="bg-white/90 backdrop-blur rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="text-blue-500" />
                  <span>NPCs Resgatados: {rescuedNpcs.length}/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="text-green-500" />
                  <span>Movimentos: {moves}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" />
                  <span>Pontos: {score}</span>
                </div>
              </div>

              {/* Controles Direcionais */}
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

              {/* Som */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-white/90 backdrop-blur rounded-xl p-3 w-full flex items-center justify-center gap-2"
              >
                {soundEnabled ? <Volume2 /> : <VolumeX />}
                <span>{soundEnabled ? 'Som Ligado' : 'Som Desligado'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tela de Nível Completo */}
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
              <p className="text-2xl font-bold">Pontuação: {score}</p>
            </div>
            
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              Próximo Nível
            </button>
          </motion.div>
        )}

        {/* Tela de Jogo Completo */}
        {gameState === 'gameComplete' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur rounded-2xl p-8 max-w-3xl mx-auto text-center"
          >
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Parabéns!</h2>
            <p className="text-xl mb-6">
              Você ajudou todos os amigos a processar suas emoções!
            </p>
            
            <div className="grid grid-cols-5 gap-4 mb-6">
              {NPCS.map(npc => (
                <div key={npc.id} className="text-4xl">
                  {npc.emoji}
                </div>
              ))}
            </div>
            
            <p className="text-3xl font-bold mb-6">
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

        {/* Caixa de Diálogo */}
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
