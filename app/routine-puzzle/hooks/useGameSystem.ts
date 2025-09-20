import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameState } from './useGameState';
import { useAchievements, type Achievement } from './useAchievements';
import type { GameState } from '../types';

// Tipos para estatísticas consolidadas
export interface GameStats {
  totalTasksCompleted: number;
  tasksByCategory: Record<string, number>;
  tasksByDay: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  averageTasksPerDay: number;
  daysActive: number;
  lastActiveDate: string;
}

// Tipos para notificações
export interface GameNotification {
  id: string;
  type: 'achievement' | 'level_up' | 'challenge_complete' | 'streak_bonus';
  title: string;
  message: string;
  icon: string;
  reward?: {
    stars: number;
    title?: string;
    unlock?: string;
  };
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Estado consolidado do sistema de jogo
export interface UnifiedGameState {
  gameState: GameState;
  stats: GameStats;
  achievements: Achievement[];
  notifications: GameNotification[];
  dailyChallenges: any[];
  currentTitle: string;
  availableTitles: string[];
  isInitialized: boolean;
}

export function useGameSystem() {
  // Hooks base
  const gameState = useGameState();
  const achievementSystem = useAchievements();
  
  // Estado local para estatísticas e notificações
  const [stats, setStats] = useState<GameStats>({
    totalTasksCompleted: 0,
    tasksByCategory: {},
    tasksByDay: {},
    currentStreak: 0,
    longestStreak: 0,
    averageTasksPerDay: 0,
    daysActive: 0,
    lastActiveDate: new Date().toISOString().split('T')[0]
  });

  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Carregar estatísticas do localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('routine-puzzle-stats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    }

    const savedNotifications = localStorage.getItem('routine-puzzle-notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    }

    setIsInitialized(true);
  }, []);

  // Salvar estatísticas
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('routine-puzzle-stats', JSON.stringify(stats));
    }
  }, [stats, isInitialized]);

  // Salvar notificações
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('routine-puzzle-notifications', JSON.stringify(notifications));
    }
  }, [notifications, isInitialized]);

  // Função unificada para completar tarefa
  const completeTask = useCallback((taskName: string, category: string, day: string) => {
    // Atualizar gameState
    gameState.addStars(2);

    // Atualizar estatísticas
    const today = new Date().toISOString().split('T')[0];
    
    setStats(prev => {
      const newStats = {
        ...prev,
        totalTasksCompleted: prev.totalTasksCompleted + 1,
        tasksByCategory: {
          ...prev.tasksByCategory,
          [category]: (prev.tasksByCategory[category] || 0) + 1
        },
        tasksByDay: {
          ...prev.tasksByDay,
          [today]: (prev.tasksByDay[today] || 0) + 1
        },
        lastActiveDate: today
      };

      // Calcular streak
      if (prev.lastActiveDate === today) {
        // Mesmo dia, não altera streak
        newStats.currentStreak = prev.currentStreak;
      } else {
        const lastDate = new Date(prev.lastActiveDate);
        const currentDate = new Date(today);
        const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Dia consecutivo
          newStats.currentStreak = prev.currentStreak + 1;
          gameState.incrementStreak();
        } else if (diffDays > 1) {
          // Quebrou a sequência
          newStats.currentStreak = 1;
          gameState.resetStreak();
        }
      }

      // Atualizar streak mais longa
      newStats.longestStreak = Math.max(prev.longestStreak, newStats.currentStreak);

      // Calcular dias ativos
      const uniqueDays = Object.keys(newStats.tasksByDay).length;
      newStats.daysActive = uniqueDays;

      // Calcular média de tarefas por dia
      newStats.averageTasksPerDay = uniqueDays > 0 ? newStats.totalTasksCompleted / uniqueDays : 0;

      return newStats;
    });

    // Atualizar desafios diários
    achievementSystem.updateDailyChallenges(category, true);

    // Verificar conquistas
    const newAchievements = achievementSystem.checkAchievements(
      gameState.gameState,
      stats.totalTasksCompleted + 1,
      {
        ...stats.tasksByCategory,
        [category]: (stats.tasksByCategory[category] || 0) + 1
      }
    );

    // Adicionar notificações para novas conquistas
    newAchievements.forEach(achievement => {
      addNotification({
        type: 'achievement',
        title: 'Conquista Desbloqueada!',
        message: achievement.name,
        icon: achievement.icon,
        reward: achievement.reward,
        priority: achievement.rarity === 'legendary' ? 'high' : 
                 achievement.rarity === 'gold' ? 'medium' : 'low'
      });

      // Adicionar estrelas da recompensa
      if (achievement.reward.stars > 0) {
        gameState.addStars(achievement.reward.stars);
      }
    });

    // Verificar bônus de streak
    const streakBonus = gameState.getStreakBonus();
    if (streakBonus > 0) {
      gameState.addStars(streakBonus);
      addNotification({
        type: 'streak_bonus',
        title: 'Bônus de Sequência!',
        message: `${gameState.gameState.streak} dias consecutivos!`,
        icon: '🔥',
        reward: { stars: streakBonus },
        priority: 'medium'
      });
    }

    // Verificar level up
    const previousLevel = gameState.gameState.level;
    setTimeout(() => {
      const newLevel = gameState.gameState.level;
      if (gameState.checkLevelUp(previousLevel, newLevel)) {
        addNotification({
          type: 'level_up',
          title: 'Subiu de Nível!',
          message: `Parabéns! Você alcançou o nível ${newLevel}!`,
          icon: '🎉',
          priority: 'high'
        });
      }
    }, 100);

  }, [gameState, achievementSystem, stats]);

  // Função para remover tarefa (quando desmarca)
  const uncompleteTask = useCallback((taskName: string, category: string) => {
    gameState.removeStars(1);

    setStats(prev => ({
      ...prev,
      totalTasksCompleted: Math.max(0, prev.totalTasksCompleted - 1),
      tasksByCategory: {
        ...prev.tasksByCategory,
        [category]: Math.max(0, (prev.tasksByCategory[category] || 0) - 1)
      }
    }));
  }, [gameState]);

  // Adicionar notificação
  const addNotification = useCallback((notification: Omit<GameNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: GameNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Manter apenas 50 notificações
  }, []);

  // Marcar notificação como lida
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  }, []);

  // Limpar notificações antigas
  const clearOldNotifications = useCallback(() => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    setNotifications(prev => 
      prev.filter(notif => notif.timestamp > sevenDaysAgo)
    );
  }, []);

  // Resetar sistema de jogo (para testes ou reset completo)
  const resetGameSystem = useCallback(() => {
    // Reset gameState
    localStorage.removeItem('routine-puzzle-game-state');
    
    // Reset achievements
    localStorage.removeItem('routine-puzzle-achievements');
    achievementSystem.initializeAchievements();
    
    // Reset stats
    setStats({
      totalTasksCompleted: 0,
      tasksByCategory: {},
      tasksByDay: {},
      currentStreak: 0,
      longestStreak: 0,
      averageTasksPerDay: 0,
      daysActive: 0,
      lastActiveDate: new Date().toISOString().split('T')[0]
    });
    
    // Reset notifications
    setNotifications([]);
    
    // Reload page para garantir reset completo
    window.location.reload();
  }, [achievementSystem]);

  // Estado consolidado memoizado
  const unifiedState = useMemo<UnifiedGameState>(() => ({
    gameState: gameState.gameState,
    stats,
    achievements: achievementSystem.achievementState.achievements,
    notifications,
    dailyChallenges: achievementSystem.achievementState.dailyChallenges,
    currentTitle: achievementSystem.achievementState.currentTitle,
    availableTitles: achievementSystem.achievementState.availableTitles,
    isInitialized
  }), [
    gameState.gameState,
    stats,
    achievementSystem.achievementState,
    notifications,
    isInitialized
  ]);

  // Notificações não lidas
  const unreadNotifications = useMemo(() => 
    notifications.filter(n => !n.isRead),
    [notifications]
  );

  // Progresso para próximo nível
  const levelProgress = useMemo(() => 
    gameState.getLevelProgress(),
    [gameState.gameState.stars, gameState.gameState.level]
  );

  // Conquistas recentes (últimas 7 dias)
  const recentAchievements = useMemo(() => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return achievementSystem.achievementState.achievements
      .filter(a => a.isUnlocked && a.unlockedAt && new Date(a.unlockedAt) > sevenDaysAgo)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime());
  }, [achievementSystem.achievementState.achievements]);

  // Próximas conquistas (3 mais próximas)
  const nextAchievements = useMemo(() => 
    achievementSystem.getNextAchievements(3),
    [achievementSystem.achievementState.achievements]
  );

  // Cleanup automático de notificações antigas (executa uma vez por dia)
  useEffect(() => {
    const lastCleanup = localStorage.getItem('routine-puzzle-last-cleanup');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastCleanup !== today) {
      clearOldNotifications();
      localStorage.setItem('routine-puzzle-last-cleanup', today);
    }
  }, [clearOldNotifications]);

  // Interface unificada
  return {
    // Estado consolidado
    state: unifiedState,
    
    // Ações principais
    completeTask,
    uncompleteTask,
    resetGameSystem,
    
    // Notificações
    addNotification,
    markNotificationAsRead,
    clearOldNotifications,
    unreadNotifications,
    
    // Conquistas e títulos
    setCurrentTitle: achievementSystem.setCurrentTitle,
    getAchievementsByCategory: achievementSystem.getAchievementsByCategory,
    getAchievementsByRarity: achievementSystem.getAchievementsByRarity,
    
    // Dados derivados
    levelProgress,
    recentAchievements,
    nextAchievements,
    
    // Utilitários
    isInitialized,
    
    // Acesso direto aos hooks internos (para casos especiais)
    gameState: gameState.gameState,
    achievements: achievementSystem.achievementState,
    
    // PWA sync functions (preparação para futuro)
    syncOfflineData: () => {
      // TODO: Implementar sincronização offline
      console.log('PWA sync será implementado aqui');
    },
    
    exportGameData: () => {
      return {
        gameState: gameState.gameState,
        stats,
        achievements: achievementSystem.achievementState,
        notifications,
        timestamp: new Date().toISOString()
      };
    },
    
    importGameData: (data: any) => {
      // TODO: Implementar importação de dados
      console.log('Import de dados será implementado aqui', data);
    }
  };
}
