'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Star, Volume2, VolumeX, Trophy, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './emotionmaze.module.css';

/* ===========================
   CONSTANTES
   =========================== */
const POWERUPS = {
  wallPass: { name: 'Atravessador', icon: '🕐', duration: 30, color: '#9C27B0', description: 'Atravesse paredes!' },
  reveal: { name: 'Visão', icon: '👁️', duration: 15, color: '#2196F3', description: 'Revela segredos!' },
  doublePoints: { name: 'Pontos x2', icon: '✨', duration: 20, color: '#FFD700', description: 'Pontos em dobro!' }
} as const;

const SOUNDS = {
  footstep: '/sounds/footstep.wav',
  gem: '/sounds/coin.wav',
  powerup: '/sounds/magic.wav',
  megaGem: '/sounds/sucess.wav',
  key: '/sounds/coin.wav',
  door: '/sounds/magic.wav',
  levelComplete: '/sounds/sucess.wav'
} as const;

const EMOTIONS = {
  joy: { name: 'Alegria', icon: '😊', color: '#FFE066' },
  calm: { name: 'Calma', icon: '😌', color: '#B2DFDB' },
  courage: { name: 'Coragem', icon: '💪', color: '#7E57C2' },
  sadness: { name: 'Tristeza', icon: '😢', color: '#64B5F6' },
  fear: { name: 'Medo', icon: '😰', color: '#757575' },
  mirror: { name: 'Espelho', icon: '🪞', color: '#E91E63' }
} as const;

const NPCS = [
  { id: 'bunny', emoji: '🐰', name: 'Coelhinho' },
  { id: 'bird', emoji: '🐦', name: 'Passarinho' },
  { id: 'cat', emoji: '🐱', name: 'Gatinho' },
  { id: 'dog', emoji: '🐶', name: 'Cachorrinho' },
  { id: 'butterfly', emoji: '🦋', name: 'Borboleta' },
  { id: 'turtle', emoji: '🐢', name: 'Tartaruga' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'fox', emoji: '🦊', name: 'Raposa' },
  { id: 'owl', emoji: '🦉', name: 'Coruja' },
  { id: 'penguin', emoji: '🐧', name: 'Pinguim' }
];

/* ===========================
   FUNÇÃO LABIRINTO BASE
   =========================== */
const createMaze8x8 = (complexity: number = 1): number[][] => {
  const maze = Array(8).fill(null).map(() => Array(8).fill(1));
  for (let i = 1; i < 7; i++) for (let j = 1; j < 7; j++) maze[i][j] = 0;
  if (complexity === 1) {
    maze[3][3] = 1; maze[3][4] = 1; maze[4][3] = 1;
  } else if (complexity === 2) {
    maze[2][3] = 1; maze[3][3] = 1; maze[4][4] = 1; maze[5][4] = 1; maze[3][5] = 1;
  } else {
    maze[2][2] = 1; maze[2][5] = 1; maze[3][3] = 1; maze[4][3] = 1; maze[5][2] = 1; maze[5][5] = 1;
  }
  return maze;
};

/* ===========================
   LEVELS (reduzido para exemplo — insira todos do docx)
   =========================== */
const LEVELS: any[] = [
  { id: 1, name: 'Primeiro Passo', story: 'Apenas chegue ao final! Sem pressão!', emotion: 'joy', size: 8, grid: createMaze8x8(1), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [], gems: [], specialGems: [], megaGems: [], powerups: [], keys: [], doors: [], perfectTime: 30 },
  { id: 2, name: 'Primeira Gema', story: 'Pegue sua primeira gema!', emotion: 'joy', size: 8, grid: createMaze8x8(1), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [], gems: [{ x: 4, y: 4, type: 'normal' }], specialGems: [], megaGems: [], powerups: [], keys: [], doors: [], perfectTime: 35 }
  // ... complete com os 30 níveis originais
];
const ALL_LEVELS = [...LEVELS];

/* ===========================
   FUNÇÃO PLAY SOUND
   =========================== */
const playSound = (soundName: keyof typeof SOUNDS, volume: number = 0.3) => {
  try {
    const audio = new Audio(SOUNDS[soundName]);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch {}
};

/* ===========================
   COMPONENTE PRINCIPAL
   =========================== */
export default function EmotionMazeGame() {
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
  const [gameState, setGameState] = useState<'intro' | 'story' | 'playing' | 'levelComplete' | 'gameComplete'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [collectedItems, setCollectedItems] = useState({ gems: new Set<string>(), specialGems: new Set<string>(), megaGems: new Set<string>(), powerups: new Set<string>(), keys: new Set<string>(), npcs: new Set<string>() });
  const [openedDoors, setOpenedDoors] = useState(new Set<string>());
  const [activePowerup, setActivePowerup] = useState<string | null>(null);
  const [powerupTimeLeft, setPowerupTimeLeft] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCutscene, setShowCutscene] = useState(false);
  const [cutsceneContent, setCutsceneContent] = useState({ title: '', text: '', image: '' });
  const [isMobile, setIsMobile] = useState(false);

  const level = ALL_LEVELS[currentLevel];

  /* Detecta mobile */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* Timer */
  useEffect(() => {
    let interval: any;
    if (gameState === 'playing') {
      interval = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  /* Start Game */
  const handleStartGame = () => {
    setCurrentLevel(0);
    setTotalScore(0);
    setPlayerPosition(level.start);
    setGameState('story');
    setCutsceneContent({ title: level.name, text: level.story, image: EMOTIONS[level.emotion as keyof typeof EMOTIONS].icon });
    setShowCutscene(true);
    setCurrentScreen('game');
  };

  const movePlayer = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    if (gameState !== 'playing') return;
    const newPos = { ...playerPosition };
    if (dir === 'up') newPos.y = Math.max(0, newPos.y - 1);
    if (dir === 'down') newPos.y = Math.min(7, newPos.y + 1);
    if (dir === 'left') newPos.x = Math.max(0, newPos.x - 1);
    if (dir === 'right') newPos.x = Math.min(7, newPos.x + 1);
    if (level.grid[newPos.y][newPos.x] === 1 && activePowerup !== 'wallPass') return;
    setPlayerPosition(newPos);
    if (soundEnabled) playSound('footstep', 0.1);
    if (newPos.x === level.end.x && newPos.y === level.end.y) setGameState('levelComplete');
  }, [gameState, playerPosition, level, activePowerup, soundEnabled]);

  /* Render cell */
  const renderCell = (x: number, y: number) => {
    const isWall = level.grid[y][x] === 1;
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    const isEnd = x === level.end.x && y === level.end.y;
    const cellSize = isMobile ? '35px' : '45px';
    return (
      <div key={`${x}-${y}`} className={`flex items-center justify-center ${isWall ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ width: cellSize, height: cellSize }}>
        {isPlayer && '🧑'}
        {isEnd && !isPlayer && '🎯'}
      </div>
    );
  };

  /* Title Screen */
  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.img initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} src="/images/mascotes/leo/jogo do labirinto tela.webp" alt="Mascote" className="w-[300px] h-auto mb-6" />
        <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-4">Labirinto das Emoções</h1>
        <button onClick={() => setCurrentScreen('instructions')} className="text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-12 py-5 shadow-xl">Começar Aventura</button>
      </div>
    </div>
  );

  /* Instructions */
  const InstructionsScreen = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200 p-6">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-lg text-center">
        <h2 className="text-4xl font-bold mb-6 text-purple-600">Como Jogar</h2>
        <p>Use as setas ou os controles para explorar o labirinto e coletar gemas.</p>
        <button onClick={handleStartGame} className="mt-6 w-full bg-green-500 text-white rounded-full py-4 text-xl font-bold">Vamos jogar! 🚀</button>
      </div>
    </div>
  );

  /* Game Screen */
  const GameScreen = () => (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <button onClick={() => setCurrentScreen('title')} className="flex items-center text-teal-600"><ChevronLeft className="h-5 w-5" /> Menu</button>
        <span className="font-bold">Nível {currentLevel + 1}</span>
        <button onClick={() => setSoundEnabled(!soundEnabled)}>{soundEnabled ? <Volume2 /> : <VolumeX />}</button>
      </header>
      <main className="flex-1 p-4 flex flex-col items-center">
        <AnimatePresence>
          {gameState === 'story' && showCutscene && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 p-8 rounded-2xl shadow-lg text-center">
              <div className="text-5xl mb-4">{cutsceneContent.image}</div>
              <h2 className="text-2xl font-bold mb-3">{cutsceneContent.title}</h2>
              <p>{cutsceneContent.text}</p>
              <button onClick={() => { setGameState('playing'); setShowCutscene(false); }} className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg font-bold">Começar</button>
            </motion.div>
          )}
          {gameState === 'playing' && (
            <>
              <div className="grid" style={{ gridTemplateColumns: `repeat(${level.size}, 1fr)` }}>
                {level.grid.map((row: any[], y: number) => row.map((cell: any, x: number) => renderCell(x, y)))}
              </div>
              {/* Controles mobile */}
              {isMobile && (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <div><button onClick={() => movePlayer('up')} className="p-4 bg-blue-500 text-white rounded-full">⬆️</button></div>
                  <div className="flex gap-2">
                    <button onClick={() => movePlayer('left')} className="p-4 bg-blue-500 text-white rounded-full">⬅️</button>
                    <button onClick={() => movePlayer('down')} className="p-4 bg-blue-500 text-white rounded-full">⬇️</button>
                    <button onClick={() => movePlayer('right')} className="p-4 bg-blue-500 text-white rounded-full">➡️</button>
                  </div>
                </div>
              )}
            </>
          )}
          {gameState === 'levelComplete' && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <h2 className="text-3xl font-bold text-green-600 mb-4">Nível Completo!</h2>
              <p>Pontos: {score}</p>
              <button onClick={() => { setCurrentLevel(currentLevel + 1); setGameState('story'); setCutsceneContent({ title: level.name, text: level.story, image: EMOTIONS[level.emotion as keyof typeof EMOTIONS].icon }); setShowCutscene(true); }} className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg">Próximo Nível</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );

  if (currentScreen === 'title') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
}
