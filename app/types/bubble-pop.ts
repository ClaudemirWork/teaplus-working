// Tipos e Interfaces para o jogo Bubble Pop

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
          'starfish' | 'octopus';
    popped: boolean;
    opacity: number;
    horizontalMovement?: number;
    distance?: number; // Opcional, usado para cálculos de distância
}

export interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
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
}

export type BubbleType = Bubble['type'];

export type GameState = 'menu' | 'playing' | 'paused' | 'levelTransition' | 'gameOver';

// Configuração de cores e propriedades das bolhas
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
    octopus: { color: '#6BCF7F', points: 90, size: 55 }
} as const;
