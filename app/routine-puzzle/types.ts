export interface RoutineItem {
  id: string;
  name: string;
  image: string;
  time: string;
  completed?: boolean;
  uniqueId: string;
  category?: string;
}

export interface WeeklyRoutine {
  [key: string]: RoutineItem[];
}

export interface GameState {
  stars: number;
  streak: number;
  completedToday: number;
  level: number;
  penalties: number;
}

export interface PECSCard {
  id: string;
  name: string;
  image: string;
  time: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Weekday {
  id: string;
  name: string;
  short: string;
  emoji: string;
  color: string;
}
