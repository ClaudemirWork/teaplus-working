import { useState, useEffect } from 'react';
import type { GameState } from '../types';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    stars: 0,
    streak: 0,
    completedToday: 0,
    level: 1,
    penalties: 0
  });

  // Calcular nível baseado no total de estrelas
  const calculateLevel = (totalStars: number): number => {
    return Math.floor(totalStars / 50) + 1;
  };

  // Adicionar estrelas (quando completa tarefa)
  const addStars = (amount: number = 2) => {
    setGameState(prev => {
      const newStars = prev.stars + amount;
      const newLevel = calculateLevel(newStars);
      
      return {
        ...prev,
        stars: newStars,
        level: newLevel,
        completedToday: prev.completedToday + 1
      };
    });
  };

  // Remover estrelas (quando pula/desfaz tarefa)
  const removeStars = (amount: number = 1) => {
    setGameState(prev => {
      const newStars = Math.max(0, prev.stars - amount);
      const newLevel = calculateLevel(newStars);
      
      return {
        ...prev,
        stars: newStars,
        level: newLevel,
        penalties: prev.penalties + 1,
        completedToday: Math.max(0, prev.completedToday - 1)
      };
    });
  };

  // Incrementar streak (sequência de dias)
  const incrementStreak = () => {
    setGameState(prev => ({
      ...prev,
      streak: prev.streak + 1
    }));
  };

  // Reset streak
  const resetStreak = () => {
    setGameState(prev => ({
      ...prev,
      streak: 0
    }));
  };

  // Bonus por streak (7 dias consecutivos = 10 estrelas)
  const getStreakBonus = (): number => {
    if (gameState.streak > 0 && gameState.streak % 7 === 0) {
      return 10;
    }
    return 0;
  };

  // Reset contador diário
  const resetDailyProgress = () => {
    setGameState(prev => ({
      ...prev,
      completedToday: 0
    }));
  };

  // Verificar se subiu de nível
  const checkLevelUp = (previousLevel: number, currentLevel: number): boolean => {
    return currentLevel > previousLevel;
  };

  // Obter progresso para próximo nível
  const getLevelProgress = (): { current: number; needed: number; percentage: number } => {
    const currentLevelStars = (gameState.level - 1) * 50;
    const nextLevelStars = gameState.level * 50;
    const current = gameState.stars - currentLevelStars;
    const needed = nextLevelStars - currentLevelStars;
    const percentage = (current / needed) * 100;
    
    return { current, needed, percentage };
  };

  // Verificar conquistas
  const checkAchievements = (): string[] => {
    const achievements: string[] = [];
    
    if (gameState.stars >= 100) achievements.push('first_century');
    if (gameState.streak >= 7) achievements.push('week_warrior');
    if (gameState.streak >= 30) achievements.push('month_master');
    if (gameState.completedToday >= 10) achievements.push('daily_champion');
    if (gameState.level >= 5) achievements.push('level_master');
    
    return achievements;
  };

  // Salvar no localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('routine-puzzle-game-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGameState(parsed);
      } catch (error) {
        console.error('Erro ao carregar estado do jogo:', error);
      }
    }
  }, []);

  // Atualizar localStorage quando o estado mudar
  useEffect(() => {
    localStorage.setItem('routine-puzzle-game-state', JSON.stringify(gameState));
  }, [gameState]);

  return {
    gameState,
    addStars,
    removeStars,
    incrementStreak,
    resetStreak,
    getStreakBonus,
    resetDailyProgress,
    checkLevelUp,
    getLevelProgress,
    checkAchievements,
    calculateLevel
  };
}
