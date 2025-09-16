// app/types/bubble-pop.ts

export interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  points: number;
  type: 'air' | 'oxygen' | 'pink' | 'purple' | 'yellow' | 'green' | 'orange' | 'mine' | 'treasure' | 'pearl' | 'fish' | 'double' | 'triple' | 'shockwave' | 'magnet' | 'equipment' | 'boss_minion';
  popped: boolean;
  opacity: number;
  horizontalMovement?: number;
  equipmentType?: string;
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

export interface Equipment {
  mask: boolean;
  fins: boolean;
  tank: boolean;
  suit: boolean;
  light: boolean;
}
