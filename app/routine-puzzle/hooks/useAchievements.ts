import { useState, useEffect } from 'react';
import type { GameState } from '../types';

// Tipos para o sistema de conquistas
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'routine' | 'streak' | 'progress' | 'social' | 'special';
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  requirement: {
    type: 'stars' | 'streak' | 'tasks_completed' | 'days_active' | 'level' | 'category_tasks' | 'perfect_week';
    target: number;
    category?: string;
  };
  reward: {
    stars: number;
    title?: string;
    unlock?: string;
  };
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number; // 0-100%
}

export interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  reward: number;
  expires: Date;
  isCompleted: boolean;
}

export interface AchievementState {
  achievements: Achievement[];
  dailyChallenges: DailyChallenge[];
  totalUnlocked: number;
  currentTitle: string;
  availableTitles: string[];
  lastChecked: Date;
}

// Definições das conquistas
const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'isUnlocked' | 'unlockedAt' | 'progress'>[] = [
  // Conquistas de Rotina
  {
    id: 'first_steps',
    name: 'Primeiros Passos',
    description: 'Complete sua primeira atividade',
    icon: '👶',
    category: 'routine',
    rarity: 'bronze',
    requirement: { type: 'tasks_completed', target: 1 },
    reward: { stars: 5, title: 'Iniciante' }
  },
  {
    id: 'routine_builder',
    name: 'Construtor de Rotinas',
    description: 'Complete 10 atividades',
    icon: '🏗️',
    category: 'routine',
    rarity: 'bronze',
    requirement: { type: 'tasks_completed', target: 10 },
    reward: { stars: 10 }
  },
  {
    id: 'task_master',
    name: 'Mestre das Tarefas',
    description: 'Complete 50 atividades',
    icon: '🎯',
    category: 'routine',
    rarity: 'silver',
    requirement: { type: 'tasks_completed', target: 50 },
    reward: { stars: 25, title: 'Organizador' }
  },
  {
    id: 'routine_champion',
    name: 'Campeão da Rotina',
    description: 'Complete 100 atividades',
    icon: '🏆',
    category: 'routine',
    rarity: 'gold',
    requirement: { type: 'tasks_completed', target: 100 },
    reward: { stars: 50, title: 'Campeão' }
  },
  {
    id: 'routine_legend',
    name: 'Lenda da Organização',
    description: 'Complete 500 atividades',
    icon: '👑',
    category: 'routine',
    rarity: 'legendary',
    requirement: { type: 'tasks_completed', target: 500 },
    reward: { stars: 200, title: 'Lenda', unlock: 'leo_crown' }
  },

  // Conquistas de Sequência
  {
    id: 'week_warrior',
    name: 'Guerreiro da Semana',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '⚔️',
    category: 'streak',
    rarity: 'silver',
    requirement: { type: 'streak', target: 7 },
    reward: { stars: 30, title: 'Guerreiro' }
  },
  {
    id: 'month_master',
    name: 'Mestre do Mês',
    description: 'Mantenha uma sequência de 30 dias',
    icon: '🌙',
    category: 'streak',
    rarity: 'gold',
    requirement: { type: 'streak', target: 30 },
    reward: { stars: 100, title: 'Mestre', unlock: 'leo_wizard' }
  },
  {
    id: 'year_legend',
    name: 'Lenda do Ano',
    description: 'Mantenha uma sequência de 365 dias',
    icon: '⭐',
    category: 'streak',
    rarity: 'legendary',
    requirement: { type: 'streak', target: 365 },
    reward: { stars: 1000, title: 'Lenda Eterna', unlock: 'leo_golden' }
  },

  // Conquistas de Progresso
  {
    id: 'star_collector',
    name: 'Coletor de Estrelas',
    description: 'Colete 100 estrelas',
    icon: '⭐',
    category: 'progress',
    rarity: 'bronze',
    requirement: { type: 'stars', target: 100 },
    reward: { stars: 20 }
  },
  {
    id: 'star_hoarder',
    name: 'Acumulador de Estrelas',
    description: 'Colete 500 estrelas',
    icon: '🌟',
    category: 'progress',
    rarity: 'silver',
    requirement: { type: 'stars', target: 500 },
    reward: { stars: 50, title: 'Acumulador' }
  },
  {
    id: 'stellar_master',
    name: 'Mestre Estelar',
    description: 'Colete 1000 estrelas',
    icon: '💫',
    category: 'progress',
    rarity: 'gold',
    requirement: { type: 'stars', target: 1000 },
    reward: { stars: 100, title: 'Mestre Estelar' }
  },

  // Conquistas de Nível
  {
    id: 'level_climber',
    name: 'Escalador de Níveis',
    description: 'Alcance o nível 5',
    icon: '🧗',
    category: 'progress',
    rarity: 'bronze',
    requirement: { type: 'level', target: 5 },
    reward: { stars: 25 }
  },
  {
    id: 'level_master',
    name: 'Mestre dos Níveis',
    description: 'Alcance o nível 10',
    icon: '🏔️',
    category: 'progress',
    rarity: 'silver',
    requirement: { type: 'level', target: 10 },
    reward: { stars: 50, title: 'Alpinista' }
  },
  {
    id: 'level_legend',
    name: 'Lenda dos Níveis',
    description: 'Alcance o nível 20',
    icon: '🏗️',
    category: 'progress',
    rarity: 'gold',
    requirement: { type: 'level', target: 20 },
    reward: { stars: 100, title: 'Construtor de Alturas' }
  },

  // Conquistas Especiais
  {
    id: 'perfect_week',
    name: 'Semana Perfeita',
    description: 'Complete todas as atividades por 7 dias seguidos',
    icon: '💎',
    category: 'special',
    rarity: 'platinum',
    requirement: { type: 'perfect_week', target: 7 },
    reward: { stars: 150, title: 'Perfeccionista', unlock: 'leo_diamond' }
  },
  {
    id: 'early_bird',
    name: 'Madrugador',
    description: 'Complete atividades matinais por 14 dias',
    icon: '🌅',
    category: 'special',
    rarity: 'gold',
    requirement: { type: 'category_tasks', target: 14, category: 'morning' },
    reward: { stars: 75, title: 'Madrugador' }
  },
  {
    id: 'night_owl',
    name: 'Coruja Noturna',
    description: 'Complete atividades noturnas por 14 dias',
    icon: '🦉',
    category: 'special',
    rarity: 'gold',
    requirement: { type: 'category_tasks', target: 14, category: 'night' },
    reward: { stars: 75, title: 'Coruja' }
  },
  {
    id: 'healthy_eater',
    name: 'Comedor Saudável',
    description: 'Complete 30 atividades de alimentação',
    icon: '🥗',
    category: 'special',
    rarity: 'silver',
    requirement: { type: 'category_tasks', target: 30, category: 'alimentos' },
    reward: { stars: 40, title: 'Nutricionista' }
  },
  {
    id: 'study_buddy',
    name: 'Companheiro de Estudos',
    description: 'Complete 20 atividades escolares',
    icon: '📚',
    category: 'special',
    rarity: 'silver',
    requirement: { type: 'category_tasks', target: 20, category: 'escola' },
    reward: { stars: 35, title: 'Estudioso' }
  },
  {
    id: 'active_life',
    name: 'Vida Ativa',
    description: 'Complete 25 atividades de ação',
    icon: '🏃',
    category: 'special',
    rarity: 'silver',
    requirement: { type: 'category_tasks', target: 25, category: 'acoes' },
    reward: { stars: 35, title: 'Atleta' }
  }
];

export function useAchievements() {
  const [achievementState, setAchievementState] = useState<AchievementState>({
    achievements: [],
    dailyChallenges: [],
    totalUnlocked: 0,
    currentTitle: 'Novato',
    availableTitles: ['Novato'],
    lastChecked: new Date()
  });

  // Inicializar conquistas
  useEffect(() => {
    const saved = localStorage.getItem('routine-puzzle-achievements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAchievementState(parsed);
      } catch (error) {
        console.error('Erro ao carregar conquistas:', error);
        initializeAchievements();
      }
    } else {
      initializeAchievements();
    }
  }, []);

  // Salvar conquistas
  useEffect(() => {
    localStorage.setItem('routine-puzzle-achievements', JSON.stringify(achievementState));
  }, [achievementState]);

  // Inicializar sistema de conquistas
  const initializeAchievements = () => {
    const achievements: Achievement[] = ACHIEVEMENT_DEFINITIONS.map(def => ({
      ...def,
      isUnlocked: false,
      progress: 0
    }));

    setAchievementState(prev => ({
      ...prev,
      achievements,
      dailyChallenges: generateDailyChallenges()
    }));
  };

  // Gerar desafios diários
  const generateDailyChallenges = (): DailyChallenge[] => {
    const challenges = [
      {
        id: 'daily_tasks',
        name: 'Produtividade Diária',
        description: 'Complete 5 atividades hoje',
        icon: '📋',
        target: 5,
        current: 0,
        reward: 15,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isCompleted: false
      },
      {
        id: 'morning_routine',
        name: 'Rotina Matinal',
        description: 'Complete 3 atividades antes das 10h',
        icon: '🌅',
        target: 3,
        current: 0,
        reward: 20,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isCompleted: false
      },
      {
        id: 'category_focus',
        name: 'Foco Alimentar',
        description: 'Complete 3 atividades de alimentação',
        icon: '🍽️',
        target: 3,
        current: 0,
        reward: 12,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isCompleted: false
      }
    ];

    return challenges;
  };

  // Verificar conquistas baseadas no estado do jogo
  const checkAchievements = (gameState: GameState, totalTasksCompleted: number, categoryStats: Record<string, number>) => {
    const newUnlocks: Achievement[] = [];

    setAchievementState(prev => {
      const updatedAchievements = prev.achievements.map(achievement => {
        if (achievement.isUnlocked) return achievement;

        let progress = 0;
        let isUnlocked = false;

        // Calcular progresso baseado no tipo de requirement
        switch (achievement.requirement.type) {
          case 'stars':
            progress = Math.min(100, (gameState.stars / achievement.requirement.target) * 100);
            isUnlocked = gameState.stars >= achievement.requirement.target;
            break;

          case 'streak':
            progress = Math.min(100, (gameState.streak / achievement.requirement.target) * 100);
            isUnlocked = gameState.streak >= achievement.requirement.target;
            break;

          case 'tasks_completed':
            progress = Math.min(100, (totalTasksCompleted / achievement.requirement.target) * 100);
            isUnlocked = totalTasksCompleted >= achievement.requirement.target;
            break;

          case 'level':
            progress = Math.min(100, (gameState.level / achievement.requirement.target) * 100);
            isUnlocked = gameState.level >= achievement.requirement.target;
            break;

          case 'category_tasks':
            const categoryCount = categoryStats[achievement.requirement.category || ''] || 0;
            progress = Math.min(100, (categoryCount / achievement.requirement.target) * 100);
            isUnlocked = categoryCount >= achievement.requirement.target;
            break;

          case 'perfect_week':
            // Lógica complexa para semana perfeita - seria implementada separadamente
            progress = 0;
            isUnlocked = false;
            break;
        }

        if (isUnlocked && !achievement.isUnlocked) {
          newUnlocks.push({
            ...achievement,
            isUnlocked: true,
            unlockedAt: new Date(),
            progress: 100
          });
        }

        return {
          ...achievement,
          progress,
          isUnlocked,
          unlockedAt: isUnlocked && !achievement.unlockedAt ? new Date() : achievement.unlockedAt
        };
      });

      const totalUnlocked = updatedAchievements.filter(a => a.isUnlocked).length;
      const availableTitles = updatedAchievements
        .filter(a => a.isUnlocked && a.reward.title)
        .map(a => a.reward.title!)
        .concat(['Novato']);

      return {
        ...prev,
        achievements: updatedAchievements,
        totalUnlocked,
        availableTitles
      };
    });

    return newUnlocks;
  };

  // Atualizar progresso dos desafios diários
  const updateDailyChallenges = (taskCategory: string, isCompleted: boolean) => {
    setAchievementState(prev => ({
      ...prev,
      dailyChallenges: prev.dailyChallenges.map(challenge => {
        if (challenge.isCompleted) return challenge;

        let shouldUpdate = false;
        
        switch (challenge.id) {
          case 'daily_tasks':
            shouldUpdate = isCompleted;
            break;
          case 'morning_routine':
            shouldUpdate = isCompleted && new Date().getHours() < 10;
            break;
          case 'category_focus':
            shouldUpdate = isCompleted && taskCategory === 'alimentos';
            break;
        }

        if (shouldUpdate) {
          const newCurrent = challenge.current + 1;
          return {
            ...challenge,
            current: newCurrent,
            isCompleted: newCurrent >= challenge.target
          };
        }

        return challenge;
      })
    }));
  };

  // Alterar título atual
  const setCurrentTitle = (title: string) => {
    if (achievementState.availableTitles.includes(title)) {
      setAchievementState(prev => ({
        ...prev,
        currentTitle: title
      }));
    }
  };

  // Obter conquistas por categoria
  const getAchievementsByCategory = (category: Achievement['category']) => {
    return achievementState.achievements.filter(a => a.category === category);
  };

  // Obter conquistas por raridade
  const getAchievementsByRarity = (rarity: Achievement['rarity']) => {
    return achievementState.achievements.filter(a => a.rarity === rarity);
  };

  // Obter próximas conquistas (não desbloqueadas com maior progresso)
  const getNextAchievements = (limit: number = 3) => {
    return achievementState.achievements
      .filter(a => !a.isUnlocked)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, limit);
  };

  // Resetar desafios diários (chamado automaticamente à meia-noite)
  const resetDailyChallenges = () => {
    setAchievementState(prev => ({
      ...prev,
      dailyChallenges: generateDailyChallenges(),
      lastChecked: new Date()
    }));
  };

  return {
    achievementState,
    checkAchievements,
    updateDailyChallenges,
    setCurrentTitle,
    getAchievementsByCategory,
    getAchievementsByRarity,
    getNextAchievements,
    resetDailyChallenges,
    initializeAchievements
  };
}
