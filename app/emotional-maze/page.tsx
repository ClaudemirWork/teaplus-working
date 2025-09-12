'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Heart, Star, Play, Volume2, VolumeX, Sparkles, Trophy, Compass, Clock, Gem, Key, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './emotionmaze.module.css';

/* ===========================
   CONSTANTES (POWERUPS, SONS, EMOTIONS, NPCS)
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

const MOTIVATIONAL_MESSAGES = ['INCRÍVEL!', 'SENSACIONAL!', 'FANTÁSTICO!', 'VOCÊ É DEMAIS!', 'SUPER!', 'ESPETACULAR!', 'MARAVILHOSO!', 'GENIAL!'];

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
   HELPERS: criar labirinto 8x8
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
   NÍVEIS COMPLETOS (30 NÍVEIS)
   =========================== */
type Level = any;
const LEVELS: Level[] = [
  { id: 1, name: 'Primeiro Passo', story: 'Apenas chegue ao final! Sem pressão!', emotion: 'joy', size: 8, grid: createMaze8x8(1), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [], gems: [], specialGems: [], megaGems: [], powerups: [], keys: [], doors: [], perfectTime: 30 },
  { id: 2, name: 'Primeira Gema', story: 'Pegue sua primeira gema!', emotion: 'joy', size: 8, grid: createMaze8x8(1), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [], gems: [{ x: 4, y: 4, type: 'normal' }], specialGems: [], megaGems: [], powerups: [], keys: [], doors: [], perfectTime: 35 },
  { id: 3, name: 'Três Tesouros', story: 'Agora são 3 gemas para coletar!', emotion: 'joy', size: 8, grid: createMaze8x8(1), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [], gems: [{ x: 2, y: 2, type: 'normal' }, { x: 5, y: 3, type: 'normal' }, { x: 3, y: 5, type: 'normal' }], specialGems: [], megaGems: [], powerups: [], keys: [], doors: [], perfectTime: 40 },
  { id: 4, name: 'Conhecendo Amigos', story: 'O Coelhinho precisa de ajuda!', emotion: 'joy', size: 8, grid: createMaze8x8(1), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[0], x: 4, y: 2 }], gems: [{ x: 2, y: 3, type: 'normal' }, { x: 5, y: 4, type: 'normal' }, { x: 3, y: 1, type: 'normal' }], specialGems: [], megaGems: [], powerups: [], keys: [], doors: [], perfectTime: 45 },
  { id: 5, name: 'Poder Mágico', story: 'Use o poder para atravessar paredes!', emotion: 'calm', size: 8, grid: createMaze8x8(2), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[1], x: 5, y: 5 }], gems: [{ x: 2, y: 2, type: 'normal' }, { x: 4, y: 1, type: 'normal' }, { x: 3, y: 3, type: 'normal' }], specialGems: [], megaGems: [], powerups: [{ x: 1, y: 5, type: 'wallPass' }], keys: [], doors: [], perfectTime: 50 },
  { id: 6, name: 'Gema Especial', story: 'Uma gema especial vale 500 pontos!', emotion: 'calm', size: 8, grid: createMaze8x8(2), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[2], x: 3, y: 2 }], gems: [{ x: 2, y: 4, type: 'normal' }, { x: 5, y: 2, type: 'normal' }], specialGems: [{ x: 4, y: 5, type: 'special' }], megaGems: [], powerups: [{ x: 1, y: 3, type: 'doublePoints' }], keys: [], doors: [], perfectTime: 55 },
  { id: 7, name: 'MEGA GEMA!', story: 'A MEGA GEMA vale 1000 pontos!', emotion: 'courage', size: 8, grid: createMaze8x8(2), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[3], x: 4, y: 4 }], gems: [{ x: 2, y: 2, type: 'normal' }, { x: 5, y: 3, type: 'normal' }, { x: 1, y: 4, type: 'normal' }], specialGems: [{ x: 6, y: 1, type: 'special' }], megaGems: [{ x: 3, y: 6, type: 'mega' }], powerups: [], keys: [], doors: [], perfectTime: 60 },
  { id: 8, name: 'Porta e Chave', story: 'Pegue a chave para abrir a porta!', emotion: 'courage', size: 8, grid: (() => { const m = createMaze8x8(2); m[4][2] = 0; m[4][3] = 0; m[4][4] = 0; m[4][5] = 0; return m; })(), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[4], x: 5, y: 5 }], gems: [{ x: 2, y: 2, type: 'normal' }, { x: 5, y: 4, type: 'normal' }], keys: [{ x: 1, y: 5, id: 'key1' }], doors: [{ x: 4, y: 3, keyId: 'key1' }], specialGems: [], megaGems: [], powerups: [], perfectTime: 65 },
  { id: 9, name: 'Desafio Completo', story: 'Use tudo que aprendeu!', emotion: 'sadness', size: 8, grid: createMaze8x8(3), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[5], x: 3, y: 4 }], gems: [{ x: 2, y: 1, type: 'normal' }, { x: 4, y: 2, type: 'normal' }, { x: 5, y: 5, type: 'normal' }], specialGems: [{ x: 1, y: 3, type: 'special' }], megaGems: [{ x: 6, y: 2, type: 'mega' }], powerups: [{ x: 3, y: 1, type: 'doublePoints' }, { x: 5, y: 3, type: 'wallPass' }], keys: [], doors: [], perfectTime: 70 },
  { id: 10, name: 'Teste Final', story: 'Complete o primeiro mundo!', emotion: 'fear', size: 8, grid: createMaze8x8(3), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[6], x: 4, y: 3 }], gems: [{ x: 2, y: 2, type: 'normal' }, { x: 3, y: 5, type: 'normal' }, { x: 5, y: 1, type: 'normal' }, { x: 6, y: 4, type: 'normal' }], specialGems: [{ x: 1, y: 4, type: 'special' }, { x: 4, y: 6, type: 'special' }], megaGems: [{ x: 3, y: 3, type: 'mega' }], powerups: [{ x: 1, y: 2, type: 'wallPass' }, { x: 6, y: 5, type: 'doublePoints' }], keys: [{ x: 2, y: 6, id: 'key1' }], doors: [{ x: 5, y: 4, keyId: 'key1' }], perfectTime: 80 },

  // MUNDO 2 (11-20)
  { id: 11, name: 'Novo Desafio', story: 'O segundo mundo começa!', emotion: 'joy', size: 8, grid: createMaze8x8(2), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[7], x: 3, y: 3 }], gems: [{ x: 2, y: 3, type: 'normal' }, { x: 4, y: 2, type: 'normal' }, { x: 5, y: 5, type: 'normal' }], specialGems: [{ x: 1, y: 5, type: 'special' }], megaGems: [], powerups: [{ x: 6, y: 1, type: 'reveal' }], keys: [], doors: [], perfectTime: 70 },
  { id: 12, name: 'Dupla Porta', story: 'Duas portas, duas chaves!', emotion: 'calm', size: 8, grid: (() => { const m = createMaze8x8(2); m[3][1] = 0; m[3][2] = 0; m[3][4] = 0; m[3][5] = 0; m[3][6] = 0; return m; })(), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[8], x: 4, y: 4 }], gems: [{ x: 2, y: 2, type: 'normal' }, { x: 5, y: 3, type: 'normal' }, { x: 3, y: 5, type: 'normal' }], specialGems: [{ x: 6, y: 2, type: 'special' }], megaGems: [{ x: 1, y: 6, type: 'mega' }], powerups: [{ x: 4, y: 1, type: 'doublePoints' }], keys: [{ x: 1, y: 2, id: 'key1' }, { x: 6, y: 5, id: 'key2' }], doors: [{ x: 3, y: 2, keyId: 'key1' }, { x: 3, y: 5, keyId: 'key2' }], perfectTime: 80 },
  { id: 13, name: 'Labirinto Secreto', story: 'Descubra os segredos escondidos!', emotion: 'courage', size: 8, grid: createMaze8x8(3), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[9], x: 5, y: 4 }], gems: [{ x: 2, y: 1, type: 'normal' }, { x: 3, y: 4, type: 'normal' }, { x: 5, y: 2, type: 'normal' }, { x: 4, y: 5, type: 'normal' }], specialGems: [{ x: 1, y: 3, type: 'special' }, { x: 6, y: 3, type: 'special' }], megaGems: [], powerups: [{ x: 2, y: 5, type: 'wallPass' }, { x: 5, y: 1, type: 'reveal' }], keys: [], doors: [], perfectTime: 85 },
  { id: 14, name: 'Tesouro Protegido', story: 'A mega gema está protegida!', emotion: 'sadness', size: 8, grid: (() => { const m = createMaze8x8(3); m[5][5] = 0; m[5][6] = 0; m[6][5] = 0; return m; })(), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[0], x: 3, y: 2 }], gems: [{ x: 2, y: 3, type: 'normal' }, { x: 4, y: 1, type: 'normal' }, { x: 3, y: 5, type: 'normal' }], specialGems: [{ x: 1, y: 4, type: 'special' }, { x: 5, y: 3, type: 'special' }], megaGems: [{ x: 5, y: 5, type: 'mega' }], powerups: [{ x: 2, y: 1, type: 'doublePoints' }, { x: 4, y: 4, type: 'wallPass' }], keys: [{ x: 1, y: 6, id: 'key1' }], doors: [{ x: 4, y: 5, keyId: 'key1' }], perfectTime: 90 },
  { id: 15, name: 'Três Chaves', story: 'Três chaves, três portas!', emotion: 'fear', size: 8, grid: createMaze8x8(3), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[1], x: 4, y: 3 }], gems: [{ x: 2, y: 2, type: 'normal' }, { x: 3, y: 1, type: 'normal' }, { x: 5, y: 4, type: 'normal' }], specialGems: [{ x: 1, y: 5, type: 'special' }, { x: 6, y: 2, type: 'special' }], megaGems: [{ x: 3, y: 6, type: 'mega' }], powerups: [{ x: 2, y: 4, type: 'reveal' }, { x: 5, y: 1, type: 'doublePoints' }], keys: [{ x: 1, y: 2, id: 'key1' }, { x: 6, y: 1, id: 'key2' }, { x: 1, y: 6, id: 'key3' }], doors: [{ x: 2, y: 3, keyId: 'key1' }, { x: 4, y: 2, keyId: 'key2' }, { x: 3, y: 5, keyId: 'key3' }], perfectTime: 95 },
  { id: 16, name: 'Gemas Escondidas', story: 'Use o poder para encontrar tudo!', emotion: 'joy', size: 8, grid: createMaze8x8(3), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[2], x: 3, y: 4 }], gems: [{ x: 2, y: 1, type: 'normal' }, { x: 4, y: 2, type: 'normal' }, { x: 5, y: 5, type: 'normal' }, { x: 3, y: 3, type: 'normal' }, { x: 4, y: 3, type: 'normal' }], specialGems: [{ x: 1, y: 3, type: 'special' }, { x: 6, y: 4, type: 'special' }], megaGems: [], powerups: [{ x: 1, y: 5, type: 'wallPass' }, { x: 6, y: 1, type: 'doublePoints' }], keys: [], doors: [], perfectTime: 100 },
  { id: 17, name: 'Dupla Mega', story: 'Duas mega gemas em um nível!', emotion: 'calm', size: 8, grid: createMaze8x8(3), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[3], x: 4, y: 4 }], gems: [{ x: 2, y: 3, type: 'normal' }, { x: 3, y: 1, type: 'normal' }, { x: 5, y: 3, type: 'normal' }], specialGems: [{ x: 1, y: 4, type: 'special' }, { x: 6, y: 1, type: 'special' }, { x: 3, y: 5, type: 'special' }], megaGems: [{ x: 2, y: 2, type: 'mega' }, { x: 5, y: 5, type: 'mega' }], powerups: [{ x: 1, y: 2, type: 'wallPass' }, { x: 4, y: 1, type: 'doublePoints' }, { x: 6, y: 3, type: 'reveal' }], keys: [], doors: [], perfectTime: 110 },
  { id: 18, name: 'Labirinto Complexo', story: 'O desafio aumenta!', emotion: 'courage', size: 8, grid: createMaze8x8(3), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[4], x: 3, y: 3 }], gems: [{ x: 1, y: 2, type: 'normal' }, { x: 2, y: 4, type: 'normal' }, { x: 4, y: 1, type: 'normal' }, { x: 5, y: 3, type: 'normal' }, { x: 6, y: 5, type: 'normal' }], specialGems: [{ x: 2, y: 6, type: 'special' }, { x: 4, y: 5, type: 'special' }, { x: 5, y: 2, type: 'special' }], megaGems: [{ x: 3, y: 6, type: 'mega' }, { x: 6, y: 1, type: 'mega' }], powerups: [{ x: 1, y: 3, type: 'wallPass' }, { x: 3, y: 1, type: 'doublePoints' }], keys: [{ x: 2, y: 5, id: 'key1' }], doors: [{ x: 4, y: 4, keyId: 'key1' }], perfectTime: 120 },
  { id: 19, name: 'Penúltimo Desafio', story: 'Quase no final do segundo mundo!', emotion: 'sadness', size: 8, grid: createMaze8x8(3), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[5], x: 5, y: 4 }], gems: [{ x: 2, y: 1, type: 'normal' }, { x: 3, y: 2, type: 'normal' }, { x: 4, y: 4, type: 'normal' }, { x: 5, y: 5, type: 'normal' }], specialGems: [{ x: 1, y: 3, type: 'special' }, { x: 3, y: 5, type: 'special' }, { x: 6, y: 2, type: 'special' }], megaGems: [{ x: 2, y: 5, type: 'mega' }, { x: 5, y: 1, type: 'mega' }], powerups: [{ x: 1, y: 5, type: 'wallPass' }, { x: 3, y: 1, type: 'doublePoints' }, { x: 6, y: 4, type: 'reveal' }], keys: [{ x: 1, y: 6, id: 'key1' }, { x: 6, y: 1, id: 'key2' }], doors: [{ x: 3, y: 4, keyId: 'key1' }, { x: 5, y: 3, keyId: 'key2' }], perfectTime: 130 },
  { id: 20, name: 'Grande Final', story: 'O último desafio antes do mundo espelhado!', emotion: 'fear', size: 8, grid: createMaze8x8(3), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [{ type: NPCS[6], x: 4, y: 3 }], gems: [{ x: 1, y: 2, type: 'normal' }, { x: 2, y: 4, type: 'normal' }, { x: 3, y: 1, type: 'normal' }, { x: 4, y: 5, type: 'normal' }, { x: 5, y: 3, type: 'normal' }, { x: 6, y: 4, type: 'normal' }], specialGems: [{ x: 2, y: 6, type: 'special' }, { x: 3, y: 2, type: 'special' }, { x: 5, y: 1, type: 'special' }, { x: 6, y: 5, type: 'special' }], megaGems: [{ x: 2, y: 2, type: 'mega' }, { x: 3, y: 3, type: 'mega' }, { x: 5, y: 5, type: 'mega' }], powerups: [{ x: 1, y: 3, type: 'wallPass' }, { x: 2, y: 5, type: 'doublePoints' }, { x: 6, y: 2, type: 'reveal' }], keys: [{ x: 1, y: 5, id: 'key1' }, { x: 6, y: 1, id: 'key2' }, { x: 1, y: 6, id: 'key3' }], doors: [{ x: 2, y: 3, keyId: 'key1' }, { x: 4, y: 2, keyId: 'key2' }, { x: 5, y: 4, keyId: 'key3' }], perfectTime: 150 }
];

// Criar níveis espelhados (21-30)
const mirrorLevel = (level: Level, newId: number): Level => {
  const mirrored = JSON.parse(JSON.stringify(level));
  mirrored.id = newId;
  mirrored.name = `${level.name} (Espelhado)`;
  mirrored.story = `Versão espelhada: ${level.story}`;
  mirrored.emotion = 'mirror';
  const mirrorX = (x: number) => 7 - x;
  mirrored.start.x = mirrorX(level.start.x);
  mirrored.end.x = mirrorX(level.end.x);
  const mirrorArray = (arr: any[] = []) => arr.map(it => ({ ...it, x: mirrorX(it.x) }));
  mirrored.npcs = (level.npcs || []).map((npc: any) => ({ ...npc, x: mirrorX(npc.x) }));
  mirrored.gems = mirrorArray(level.gems || []);
  mirrored.specialGems = mirrorArray(level.specialGems || []);
  mirrored.megaGems = mirrorArray(level.megaGems || []);
  mirrored.powerups = mirrorArray(level.powerups || []);
  mirrored.keys = (level.keys || []).map((k: any) => ({ ...k, x: mirrorX(k.x) }));
  mirrored.doors = (level.doors || []).map((d: any) => ({ ...d, x: mirrorX(d.x) }));
  mirrored.grid = level.grid.map((row: number[]) => [...row].reverse());
  return mirrored;
};

const MIRROR_LEVELS = LEVELS.slice(0, 10).map((lvl, idx) => mirrorLevel(lvl, 21 + idx));
const ALL_LEVELS = [...LEVELS, ...MIRROR_LEVELS];

/* ===========================
   PLAY SOUND
   =========================== */
const playSound = (soundName: keyof typeof SOUNDS, volume: number = 0.3) => {
  try {
    const audio = new Audio(SOUNDS[soundName]);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (e) {
    // silencioso
  }
};

/* ===========================
   COMPONENTE PRINCIPAL
   =========================== */
export default function EmotionMazeGame(): JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
  const [gameState, setGameState] = useState<'intro' | 'story' | 'playing' | 'levelComplete' | 'gameComplete' | 'mirrorUnlocked'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [collectedItems, setCollectedItems] = useState({
    gems: new Set<string>(),
    specialGems: new Set<string>(),
    megaGems: new Set<string>(),
    powerups: new Set<string>(),
    keys: new Set<string>(),
    npcs: new Set<string>()
  });
  const [openedDoors, setOpenedDoors] = useState(new Set<string>());
  const [activePowerup, setActivePowerup] = useState<string | null>(null);
  const [powerupTimeLeft, setPowerupTimeLeft] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCutscene, setShowCutscene] = useState(false);
  const [cutsceneContent, setCutsceneContent] = useState({ title: '', text: '', image: '' });
  const [isMobile, setIsMobile] = useState(false);

  const level = ALL_LEVELS[currentLevel];
  const currentEmotion = level?.emotion || 'joy';
  const emotionTheme = EMOTIONS[currentEmotion as keyof typeof EMOTIONS];

  /* Detect mobile */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* Timer do nível */
  useEffect(() => {
    let interval: any;
    if (gameState === 'playing') {
      interval = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  /* Timer powerup */
  useEffect(() => {
    let interval: any;
    if (activePowerup && powerupTimeLeft > 0) {
      interval = setInterval(() => {
        setPowerupTimeLeft(prev => {
          if (prev <= 1) { setActivePowerup(null); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePowerup, powerupTimeLeft]);

  /* initLevel */
  const initLevel = useCallback((levelIndex: number) => {
    const newLevel = ALL_LEVELS[levelIndex];
    if (!newLevel) return;
    setPlayerPosition(newLevel.start);
    setCollectedItems({ gems: new Set(), specialGems: new Set(), megaGems: new Set(), powerups: new Set(), keys: new Set(), npcs: new Set() });
    setOpenedDoors(new Set());
    setActivePowerup(null);
    setPowerupTimeLeft(0);
    setMoves(0);
    setTimeElapsed(0);
    setScore(0);
  }, []);

  /* startGame / startLevel */
  const handleStartGame = useCallback(() => {
    setCurrentLevel(0);
    setTotalScore(0);
    initLevel(0);
    setCurrentScreen('game');
    setGameState('story');
    setCutsceneContent({ title: 'O Labirinto das Emoções', text: 'Ajude nossos amigos a coletar tesouros incríveis!', image: '🌈' });
    setShowCutscene(true);
  }, [initLevel]);

  const startLevel = () => {
    setShowCutscene(false);
    setGameState('playing');
  };

  /* Função de explosão de mega gema */
  const createMegaGemExplosion = () => {
    if (soundEnabled) playSound('megaGem', 0.5);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    
    const message = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    const messageEl = document.createElement('div');
    messageEl.className = styles.motivationalMessage || '';
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed; top: 30%; left: 50%; transform: translateX(-50%); 
      z-index: 9999; font-size: 2rem; font-weight: bold; color: #FFD700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8); pointer-events: none;
      animation: fadeInOut 2s ease-in-out;
    `;
    document.body.appendChild(messageEl);
    setTimeout(() => { if (messageEl.parentNode) messageEl.parentNode.removeChild(messageEl); }, 2000);
  };

  /* Movimento do jogador */
  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState !== 'playing') return;
    const newPos = { ...playerPosition };
    switch (direction) {
      case 'up': newPos.y = Math.max(0, newPos.y - 1); break;
      case 'down': newPos.y = Math.min(7, newPos.y + 1); break;
      case 'left': newPos.x = Math.max(0, newPos.x - 1); break;
      case 'right': newPos.x = Math.min(7, newPos.x + 1); break;
    }
    const canPassWalls = activePowerup === 'wallPass';
    if (level.grid[newPos.y][newPos.x] === 1 && !canPassWalls) return;

    // Checa portas
    const door = level.doors?.find((d: any) => d.x === newPos.x && d.y === newPos.y);
    if (door && !openedDoors.has(door.keyId)) {
      if (collectedItems.keys.has(door.keyId)) {
        setOpenedDoors(prev => new Set(prev).add(door.keyId));
        if (soundEnabled) playSound('door');
      } else {
        return; // porta fechada e sem chave
      }
    }

    // Move player
    setPlayerPosition(newPos);
    setMoves(prev => prev + 1);
    if (soundEnabled) playSound('footstep', 0.1);

    const posKey = `${newPos.x},${newPos.y}`;

    // Gema normal
    const gem = level.gems?.find((g: any) => g.x === newPos.x && g.y === newPos.y);
    if (gem && !collectedItems.gems.has(posKey)) {
      setCollectedItems(prev => ({ ...prev, gems: new Set(prev.gems).add(posKey) }));
      const points = activePowerup === 'doublePoints' ? 200 : 100;
      setScore(prev => prev + points);
      if (soundEnabled) playSound('gem');
    }

    // special gem
    const specialGem = level.specialGems?.find((g: any) => g.x === newPos.x && g.y === newPos.y);
    if (specialGem && !collectedItems.specialGems.has(posKey)) {
      setCollectedItems(prev => ({ ...prev, specialGems: new Set(prev.specialGems).add(posKey) }));
      const points = activePowerup === 'doublePoints' ? 1000 : 500;
      setScore(prev => prev + points);
      if (soundEnabled) playSound('gem', 0.4);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.5 } });
    }

    // mega gem
    const megaGem = level.megaGems?.find((g: any) => g.x === newPos.x && g.y === newPos.y);
    if (megaGem && !collectedItems.megaGems.has(posKey)) {
      setCollectedItems(prev => ({ ...prev, megaGems: new Set(prev.megaGems).add(posKey) }));
      const points = activePowerup === 'doublePoints' ? 2000 : 1000;
      setScore(prev => prev + points);
      createMegaGemExplosion();
    }

    // powerups
    const powerup = level.powerups?.find((p: any) => p.x === newPos.x && p.y === newPos.y);
    if (powerup && !collectedItems.powerups.has(posKey)) {
      setCollectedItems(prev => ({ ...prev, powerups: new Set(prev.powerups).add(posKey) }));
      const powerupData = POWERUPS[powerup.type as keyof typeof POWERUPS];
      setActivePowerup(powerup.type);
      setPowerupTimeLeft(powerupData.duration);
      setScore(prev => prev + 50);
      if (soundEnabled) playSound('powerup');
    }

    // keys
    const key = level.keys?.find((k: any) => k.x === newPos.x && k.y === newPos.y);
    if (key && !collectedItems.keys.has(key.id)) {
      setCollectedItems(prev => ({ ...prev, keys: new Set(prev.keys).add(key.id) }));
      setScore(prev => prev + 25);
      if (soundEnabled) playSound('key');
    }

    // npcs
    const npc = level.npcs?.find((n: any) => n.x === newPos.x && n.y === newPos.y);
    if (npc && !collectedItems.npcs.has(posKey)) {
      setCollectedItems(prev => ({ ...prev, npcs: new Set(prev.npcs).add(posKey) }));
      const points = activePowerup === 'doublePoints' ? 200 : 100;
      setScore(prev => prev + points);
      if (soundEnabled) playSound('gem', 0.5);
    }

    // fim de nível
    if (newPos.x === level.end.x && newPos.y === level.end.y) {
      completeLevel();
    }

  }, [gameState, playerPosition, level, collectedItems, openedDoors, activePowerup, soundEnabled]);

  /* completar nível */
  const completeLevel = () => {
    const timeBonus = Math.max(0, level.perfectTime - timeElapsed) * 5;
    const finalScore = score + timeBonus;
    setScore(finalScore);
    setTotalScore(prev => prev + finalScore);

    const totalGems = (level.gems?.length || 0) + (level.specialGems?.length || 0) + (level.megaGems?.length || 0);
    const collectedGems = collectedItems.gems.size + collectedItems.specialGems.size + collectedItems.megaGems.size;
    let earnedStars = 1;
    if (collectedGems === totalGems && collectedItems.npcs.size === (level.npcs?.length || 0)) earnedStars = 3;
    else if (timeElapsed <= level.perfectTime) earnedStars = 2;
    setStars(earnedStars);

    if (soundEnabled) playSound('levelComplete');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    if (currentLevel === 19) {
      setTimeout(() => setGameState('mirrorUnlocked'), 1200);
    } else {
      setGameState('levelComplete');
    }
  };

  /* nextLevel */
  const nextLevel = () => {
    if (currentLevel < ALL_LEVELS.length - 1) {
      const next = currentLevel + 1;
      setCurrentLevel(next);
      initLevel(next);
      setGameState('story');
      const nextLevelData = ALL_LEVELS[next];
      setCutsceneContent({ title: nextLevelData.name, text: nextLevelData.story, image: EMOTIONS[nextLevelData.emotion as keyof typeof EMOTIONS].icon });
      setShowCutscene(true);
    } else {
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
      setGameState('gameComplete');
    }
  };

  /* teclado */
  useEffect(() => {
    const keyMap: { [k: string]: 'up' | 'down' | 'left' | 'right' } = {
      ArrowUp: 'up', w: 'up', W: 'up',
      ArrowDown: 'down', s: 'down', S: 'down',
      ArrowLeft: 'left', a: 'left', A: 'left',
      ArrowRight: 'right', d: 'right', D: 'right'
    };
    const handleKey = (e: KeyboardEvent) => {
      const dir = keyMap[e.key];
      if (dir) { e.preventDefault(); movePlayer(dir); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [movePlayer]);

  /* renderCell */
  const renderCell = (x: number, y: number) => {
    const isWall = level.grid[y][x] === 1;
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    const isEnd = x === level.end.x && y === level.end.y;

    const posKey = `${x},${y}`;
    const gem = level.gems?.find((g: any) => g.x === x && g.y === y && !collectedItems.gems.has(posKey));
    const specialGem = level.specialGems?.find((g: any) => g.x === x && g.y === y && !collectedItems.specialGems.has(posKey));
    const megaGem = level.megaGems?.find((g: any) => g.x === x && g.y === y && !collectedItems.megaGems.has(posKey));
    const powerup = level.powerups?.find((p: any) => p.x === x && p.y === y && !collectedItems.powerups.has(posKey));
    const key = level.keys?.find((k: any) => k.x === x && k.y === y && !collectedItems.keys.has(k.id));
    const door = level.doors?.find((d: any) => d.x === x && d.y === y);
    const doorIsOpen = door ? openedDoors.has(door.keyId) : false;
    const npc = level.npcs?.find((n: any) => n.x === x && n.y === y && !collectedItems.npcs.has(posKey));

    let className = styles.cell || '';
    className += isWall ? ` ${styles.cellWall || ''}` : ` ${styles.cellPath || ''}`;
    if (door && !doorIsOpen) className += ` ${styles.door || ''}`;

    const cellSize = isMobile ? '35px' : '45px';
    const fontSize = isMobile ? '16px' : '20px';

    return (
      <div 
        key={`${x}-${y}`} 
        className={className} 
        style={{ 
          width: cellSize, 
          height: cellSize, 
          fontSize, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          position: 'relative', 
          backgroundColor: door && !doorIsOpen ? '#8B4513' : undefined, 
          opacity: door && doorIsOpen ? 0.5 : 1 
        }}>
        {isPlayer && <span className={styles.player} style={{ fontSize }}>🧑</span>}
        {isEnd && !isPlayer && <span style={{ fontSize }}>🎯</span>}
        {npc && !isPlayer && <span className={styles.npc} style={{ fontSize }}>{npc.type?.emoji ?? '🐾'}</span>}
        {gem && !isPlayer && <span style={{ fontSize }}>💎</span>}
        {specialGem && !isPlayer && <span className={styles.specialGem} style={{ fontSize }}>💎✨</span>}
        {megaGem && !isPlayer && <span className={styles.megaGem} style={{ fontSize }}>🌟</span>}
        {powerup && !isPlayer && <span style={{ fontSize }}>{POWERUPS[powerup.type as keyof typeof POWERUPS].icon}</span>}
        {key && !isPlayer && <span className={styles.key} style={{ fontSize }}>🗝️</span>}
        {door && !doorIsOpen && !isPlayer && <span style={{ fontSize, filter: 'brightness(1.5)' }}>🚪</span>}
      </div>
    );
  };

  /* --- TELAS --- */
  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute animate-pulse" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, animationDuration: `${3 + Math.random() * 2}s` }}>
            <Star className="w-6 h-6 text-white opacity-20" fill="currentColor" />
          </div>
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 100 }} className="mb-4">
          <img src="/images/mascotes/leo/jogo do labirinto tela.webp" alt="Mascote Léo no Labirinto" className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl animate-bounce-slow" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4, type: 'spring', stiffness: 100 }}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-2">Labirinto das Emoções</h1>
          <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-6 drop-shadow-md">🧭 Ajude Léo a encontrar os tesouros e amigos perdidos!</p>
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl max-w-xs mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-100" />
              <span className="font-bold text-white">30 Níveis de Aventura</span>
            </div>
          </div>
          <button onClick={() => setCurrentScreen('instructions')} className="text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1">Começar Aventura</button>
        </motion.div>
      </div>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-purple-600">Como Jogar</h2>
        <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
          <p className="flex items-center gap-4"><span className="text-4xl">🧭</span><span><b>Explore o labirinto</b> usando as setas ou os controles.</span></p>
          <p className="flex items-center gap-4"><span className="text-4xl">💎</span><span><b>Colete todas as gemas</b> e encontre os amigos.</span></p>
          <p className="flex items-center gap-4"><span className="text-4xl">🗝️</span><span>Pegue as <b>chaves</b> para abrir as <b>portas</b> trancadas.</span></p>
          <p className="flex items-center gap-4"><span className="text-4xl">✨</span><span>Use <b>poderes especiais</b> para atravessar paredes!</span></p>
        </div>
        <button onClick={handleStartGame} className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform">Vamos jogar! 🚀</button>
      </div>
    </div>
  );

  const GameScreen = () => (
    <div className={`${styles.gameContainer || ''} ${styles[`theme${currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}`] || ''}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => { setCurrentScreen('title'); setGameState('intro'); }} className="flex items-center text-teal-600 hover:text-teal-700">
              <ChevronLeft className="h-5 w-5" /> <span className="hidden sm:inline">Menu</span>
            </button>
            <h1 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="text-red-500 h-5 w-5" />
              <span>Nível {currentLevel + 1}</span>
            </h1>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-white/50" style={{ touchAction: 'manipulation' }}>
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
        <AnimatePresence>
          {gameState === 'story' && showCutscene && (
            <motion.div key="cutscene" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-center flex-1">
              <div className="bg-white/90 rounded-2xl p-6 max-w-md">
                <div className="text-5xl mb-4 text-center">{cutsceneContent.image}</div>
                <h2 className="text-xl font-bold mb-3 text-gray-800 text-center">{cutsceneContent.title}</h2>
                <p className="text-sm text-gray-700 mb-4 text-center">{cutsceneContent.text}</p>
                {level.keys && level.keys.length > 0 && (
                  <div className="bg-yellow-100 rounded p-2 mb-3">
                    <p className="text-xs font-bold text-center">🗝️ Pegue as chaves para abrir as 🚪 portas!</p>
                  </div>
                )}
                {level.powerups?.some((p: any) => p.type === 'wallPass') && (
                  <div className="bg-purple-100 rounded p-2 mb-3">
                    <p className="text-xs font-bold text-center">🕐 Use o poder para atravessar paredes!</p>
                  </div>
                )}
                <button onClick={startLevel} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold" style={{ touchAction: 'manipulation' }}>Vamos lá!</button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && level && (
            <motion.div key="gameplay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* HUD com pontuação */}
              <div className="flex flex-wrap justify-center gap-2 mb-2">
                <div className="bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-800">⭐ {score}</div>
                <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-800">💎 {collectedItems.gems.size + collectedItems.specialGems.size + collectedItems.megaGems.size}/{(level.gems?.length || 0) + (level.specialGems?.length || 0) + (level.megaGems?.length || 0)}</div>
                {level.npcs && level.npcs.length > 0 && (
                  <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-800">🐾 {collectedItems.npcs.size}/{level.npcs.length}</div>
                )}
                {level.keys && level.keys.length > 0 && (
                  <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-800">🗝️ {collectedItems.keys.size}/{level.keys.length}</div>
                )}
              </div>

              {/* Grid do labirinto */}
              <div className="flex justify-center items-center flex-1">
                <div className={styles.mazeGrid || ''} style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
                  {level.grid.map((row: any[], y: number) => row.map((cell: any, x: number) => renderCell(x, y)))}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'mirrorUnlocked' && (
            <motion.div key="mirrorUnlocked" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center justify-center flex-1">
              <div className="bg-white/90 rounded-2xl p-6 max-w-md text-center">
                <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-3 text-purple-600">MUNDO ESPELHADO!</h2>
                <p className="text-gray-700 mb-4">10 níveis espelhados desbloqueados!</p>
                <button onClick={() => setGameState('levelComplete')} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold" style={{ touchAction: 'manipulation' }}>Continuar!</button>
              </div>
            </motion.div>
          )}

          {gameState === 'levelComplete' && (
            <motion.div key="levelComplete" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center justify-center flex-1">
              <div className="bg-white/90 rounded-2xl p-6 max-w-md text-center">
                <h2 className="text-2xl font-bold mb-3 text-gray-800">Nível Completo!</h2>
                <div className="flex justify-center gap-2 mb-3">
                  {[1, 2, 3].map(i => (
                    <Star key={i} className={`w-10 h-10 ${i <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p>Movimentos: {moves}</p>
                  <p>Tempo: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</p>
                  <p className="text-xl font-bold text-gray-800">Pontos: {score}</p>
                </div>
                <button onClick={nextLevel} className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold w-full" style={{ touchAction: 'manipulation' }}>
                  {currentLevel === 19 ? 'Mundo Espelhado!' : 'Próximo Nível'}
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'gameComplete' && (
            <motion.div key="gameComplete" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center justify-center flex-1">
              <div className="bg-white/90 rounded-2xl p-6 max-w-md text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-3 text-purple-600">VOCÊ VENCEU!</h2>
                <p className="text-lg text-gray-700 mb-4">Completou todos os 30 níveis!</p>
                <p className="text-2xl font-bold text-gray-800 mb-4">Pontuação Total: {totalScore}</p>
                <button onClick={() => window.location.reload()} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold w-full" style={{ touchAction: 'manipulation' }}>Jogar Novamente</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Controles móveis - SEM FLASH */}
      {gameState === 'playing' && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 rounded-xl p-3 shadow-lg">
          <div className="grid grid-cols-3 gap-1 w-32">
            <div></div>
            <button 
              onMouseDown={() => movePlayer('up')} 
              onTouchStart={(e) => { e.preventDefault(); movePlayer('up'); }}
              className="bg-blue-500 text-white p-3 rounded-lg font-bold text-xl select-none" 
              style={{ touchAction: 'manipulation', transition: 'none' }}>↑</button>
            <div></div>
            <button 
              onMouseDown={() => movePlayer('left')} 
              onTouchStart={(e) => { e.preventDefault(); movePlayer('left'); }}
              className="bg-blue-500 text-white p-3 rounded-lg font-bold text-xl select-none" 
              style={{ touchAction: 'manipulation', transition: 'none' }}>←</button>
            <button 
              onMouseDown={() => movePlayer('down')} 
              onTouchStart={(e) => { e.preventDefault(); movePlayer('down'); }}
              className="bg-blue-500 text-white p-3 rounded-lg font-bold text-xl select-none" 
              style={{ touchAction: 'manipulation', transition: 'none' }}>↓</button>
            <button 
              onMouseDown={() => movePlayer('right')} 
              onTouchStart={(e) => { e.preventDefault(); movePlayer('right'); }}
              className="bg-blue-500 text-white p-3 rounded-lg font-bold text-xl select-none" 
              style={{ touchAction: 'manipulation', transition: 'none' }}>→</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(-4%); } 50% { transform: translateY(0); } }
        @keyframes fadeInOut { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );

  /* ROTEAMENTO SIMPLES ENTRE TELAS */
  if (currentScreen === 'title') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
}
