// app/types/bubble-pop.ts
export interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  points: number;
  type: 'air' | 'oxygen' | 'pink' | 'purple' | 'yellow' | 'green' | 'orange' | 
        'mine' | 'treasure' | 'pearl' | 'fish' | 'double' | 'triple' | 
        'shockwave' | 'magnet' | 'equipment' | 'boss_minion' |
        'pufferfish' | 'starfish' | 'octopus';  // ADICIONAR ESTES TRÊS
  popped: boolean;
  opacity: number;
  horizontalMovement?: number;
  equipmentType?: string;
  fishType?: string;
  emoji?: string;  // ADICIONAR ESTE CAMPO
  message?: string; // ADICIONAR ESTE CAMPO
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

export interface Equipment {
  mask: boolean;
  fins: boolean;
  tank: boolean;
  suit: boolean;
  light: boolean;
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
