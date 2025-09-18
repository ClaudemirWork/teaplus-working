// ARQUIVO DA PASTA APP/TYPES
// Tipos e Interfaces para o jogo Bubble Pop - VERSÃO EXPANDIDA

export interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  points: number;
  type: 'air' | 'oxygen' | 'pink' | 'purple' | 'yellow' | 'green' | 
         'orange' | 'treasure' | 'pearl' | 'mine' | 'pufferfish' | 
         'starfish' | 'octopus' | 'whale' | 'shark' | 'turtle' | 
         'dolphin' | 'fish' | 'double' | 'triple' | 'shockwave' | 
         'magnet' | 'equipment';
  popped: boolean;
  opacity: number;
  horizontalMovement?: number;
  distance?: number; // Opcional, usado para cálculos de distância
  equipmentType?: 'mask' | 'fins' | 'tank' | 'suit' | 'light';
  fishType?: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  type?: 'star' | 'bubble' | 'fish';
}

export interface LevelConfig {
  level: number;
  name: string;
  depth: string;
  totalBubbles: number;
  minePercentage: number;
  spawnRate: number;
  oxygenDrain: number;
  bgGradient: string;
  equipment?: 'mask' | 'fins' | 'tank' | 'suit' | 'light';
  features: string[];
}

export interface Equipment {
  mask: boolean;
  fins: boolean;
  tank: boolean;
  suit: boolean;
  light: boolean;
}

export interface GearItem {
  level: number;
  item: string;
  icon: string;
  x?: number;
  y?: number;
}

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  poppedBubbles: number;
  missedBubbles: number;
  accuracy: number;
  completedLevels: number[];
  savedFish: number;
  freedCreatures: string[];
}

export type BubbleType = Bubble['type'];

export type GameState = 'menu' | 'playing' | 'paused' | 'levelTransition' | 'gameOver';

// Configuração de cores e propriedades das bolhas - EXPANDIDA
export const BUBBLE_CONFIG = {
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
  dolphin: { color: '#00CED1', points: 95, size: 55 },
  // Novos tipos adicionados
  fish: { color: '#87CEEB', points: 50, size: 55 },
  double: { color: '#FFD700', points: 0, size: 50 },
  triple: { color: '#FF69B4', points: 0, size: 50 },
  shockwave: { color: '#00FFFF', points: 0, size: 50 },
  magnet: { color: '#9370DB', points: 0, size: 50 },
  equipment: { color: '#FFD700', points: 0, size: 60 }
} as const;

// Configuração dos 11 níveis
export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 1,
    name: 'Superfície - Bolhas Coloridas',
    depth: '0-10m',
    totalBubbles: 100,
    minePercentage: 0.05,
    spawnRate: 600,
    oxygenDrain: 0.3,
    bgGradient: 'from-cyan-300 to-blue-400',
    features: ['colored_bubbles']
  },
  {
    level: 2,
    name: 'Águas Rasas - Salvando Peixes',
    depth: '10-20m',
    totalBubbles: 110,
    minePercentage: 0.1,
    spawnRate: 580,
    oxygenDrain: 0.4,
    bgGradient: 'from-blue-400 to-blue-500',
    equipment: 'mask',
    features: ['colored_bubbles', 'fish_rescue']
  },
  {
    level: 3,
    name: 'Zona Clara - Multiplicadores',
    depth: '20-30m',
    totalBubbles: 120,
    minePercentage: 0.15,
    spawnRate: 560,
    oxygenDrain: 0.5,
    bgGradient: 'from-blue-500 to-blue-600',
    equipment: 'fins',
    features: ['colored_bubbles', 'fish_rescue', 'multipliers']
  },
  {
    level: 4,
    name: 'Águas Médias - Power-ups',
    depth: '30-40m',
    totalBubbles: 130,
    minePercentage: 0.2,
    spawnRate: 540,
    oxygenDrain: 0.6,
    bgGradient: 'from-blue-600 to-blue-700',
    equipment: 'tank',
    features: ['colored_bubbles', 'fish_rescue', 'multipliers', 'powerups']
  },
  {
    level: 5,
    name: 'Zona Mista - Todos Elementos',
    depth: '40-50m',
    totalBubbles: 140,
    minePercentage: 0.25,
    spawnRate: 520,
    oxygenDrain: 0.7,
    bgGradient: 'from-blue-700 to-indigo-700',
    equipment: 'suit',
    features: ['all']
  },
  {
    level: 6,
    name: 'Correntes Marinhas',
    depth: '50-60m',
    totalBubbles: 150,
    minePercentage: 0.3,
    spawnRate: 500,
    oxygenDrain: 0.8,
    bgGradient: 'from-indigo-700 to-indigo-800',
    equipment: 'light',
    features: ['all', 'currents']
  },
  {
    level: 7,
    name: 'Zona Escura',
    depth: '60-70m',
    totalBubbles: 140,
    minePercentage: 0.35,
    spawnRate: 480,
    oxygenDrain: 0.9,
    bgGradient: 'from-indigo-800 to-indigo-900',
    features: ['all', 'darkness']
  },
  {
    level: 8,
    name: 'Águas Profundas',
    depth: '70-80m',
    totalBubbles: 130,
    minePercentage: 0.4,
    spawnRate: 460,
    oxygenDrain: 1.0,
    bgGradient: 'from-indigo-900 to-purple-900',
    features: ['all', 'predators']
  },
  {
    level: 9,
    name: 'Zona Abissal',
    depth: '80-90m',
    totalBubbles: 120,
    minePercentage: 0.45,
    spawnRate: 440,
    oxygenDrain: 1.1,
    bgGradient: 'from-purple-900 to-black',
    features: ['all', 'extreme']
  },
  {
    level: 10,
    name: 'Portal do Abismo',
    depth: '90-100m',
    totalBubbles: 100,
    minePercentage: 0.5,
    spawnRate: 420,
    oxygenDrain: 1.2,
    bgGradient: 'from-black to-purple-950',
    features: ['all', 'portal']
  },
  {
    level: 11,
    name: 'Reino do Senhor dos Mares',
    depth: 'ABISMO',
    totalBubbles: 150,
    minePercentage: 0.3,
    spawnRate: 400,
    oxygenDrain: 0, // Boss não drena oxigênio
    bgGradient: 'from-purple-950 via-black to-red-950',
    features: ['boss_battle']
  }
];
