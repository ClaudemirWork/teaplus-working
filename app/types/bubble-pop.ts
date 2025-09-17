// app/bubble-pop/types/bubble-pop.ts

export interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    color: string;
    points: number;
    type: 'air' | 'oxygen' | 'pink' | 'purple' | 'yellow' | 'green' | 'orange' | 'mine' | 'treasure' | 'pearl';
    popped: boolean;
    opacity: number;
    horizontalMovement?: number;
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

// Estes tipos podem ser removidos se não estiver usando o sistema de equipamentos/peixes
export interface Equipment {
    mask: boolean;
    fins: boolean;
    tank: boolean;
    suit: boolean;
    light: boolean;
}

export interface ScoreEffect {
    id: number;
    points: number;
    x: number;
    y: number;
    opacity: number;
}

export interface FishEffect {
    id: number;
    x: number;
    y: number;
    opacity: number;
    emoji: string;
}
