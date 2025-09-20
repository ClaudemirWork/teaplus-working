import { useState } from 'react';
import type { WeeklyRoutine } from '../types';

interface UseTaskCompletionProps {
  weeklyRoutine: WeeklyRoutine;
  setWeeklyRoutine: React.Dispatch<React.SetStateAction<WeeklyRoutine>>;
  onAddStars: (amount?: number) => void;
  onRemoveStars: (amount?: number) => void;
}

export function useTaskCompletion({
  weeklyRoutine,
  setWeeklyRoutine,
  onAddStars,
  onRemoveStars
}: UseTaskCompletionProps) {
  const [celebrationQueue, setCelebrationQueue] = useState<string[]>([]);

  // Completar uma tarefa
  const completeTask = (day: string, uniqueId: string) => {
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day]?.map(item => {
        if (item.uniqueId === uniqueId) {
          const wasCompleted = item.completed;
          const newCompleted = !wasCompleted;
          
          // Sistema de pontuação bidirecional
          if (newCompleted && !wasCompleted) {
            // Completando uma tarefa: +2 estrelas
            onAddStars(2);
            triggerCelebration('task');
          } else if (!newCompleted && wasCompleted) {
            // Desfazendo uma tarefa: -1 estrela
            onRemoveStars(1);
          }
          
          return { ...item, completed: newCompleted };
        }
        return item;
      }) || []
    }));
  };

  // Marcar múltiplas tarefas como completas
  const completeMultipleTasks = (day: string, uniqueIds: string[]) => {
    const completedCount = uniqueIds.length;
    
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day]?.map(item => {
        if (uniqueIds.includes(item.uniqueId) && !item.completed) {
          return { ...item, completed: true };
        }
        return item;
      }) || []
    }));

    // Bonus por completar múltiplas tarefas
    onAddStars(completedCount * 2);
    
    if (completedCount >= 3) {
      triggerCelebration('streak');
    }
  };

  // Verificar se todas as tarefas do dia foram completadas
  const isDayCompleted = (day: string): boolean => {
    const dayTasks = weeklyRoutine[day] || [];
    if (dayTasks.length === 0) return false;
    return dayTasks.every(task => task.completed);
  };

  // Obter estatísticas do dia
  const getDayStats = (day: string) => {
    const dayTasks = weeklyRoutine[day] || [];
    const completed = dayTasks.filter(task => task.completed).length;
    const total = dayTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  // Obter estatísticas da semana
  const getWeekStats = () => {
    let totalCompleted = 0;
    let totalTasks = 0;
    
    Object.values(weeklyRoutine).forEach(dayTasks => {
      totalTasks += dayTasks.length;
      totalCompleted += dayTasks.filter(task => task.completed).length;
    });
    
    const percentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
    
    return { completed: totalCompleted, total: totalTasks, percentage };
  };

  // Resetar tarefas do dia
  const resetDay = (day: string) => {
    const dayTasks = weeklyRoutine[day] || [];
    const completedTasks = dayTasks.filter(task => task.completed).length;
    
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day]?.map(item => ({ ...item, completed: false })) || []
    }));

    // Penalidade por resetar dia completo
    if (completedTasks > 0) {
      onRemoveStars(completedTasks);
    }
  };

  // Adicionar celebração à fila
  const triggerCelebration = (type: 'task' | 'streak' | 'day' | 'level') => {
    setCelebrationQueue(prev => [...prev, type]);
    
    // Remover da fila após 3 segundos
    setTimeout(() => {
      setCelebrationQueue(prev => prev.slice(1));
    }, 3000);
  };

  // Verificar conquistas diárias
  const checkDailyAchievements = (day: string) => {
    const stats = getDayStats(day);
    
    if (stats.percentage === 100 && stats.total > 0) {
      // Dia completado: bonus de 5 estrelas
      onAddStars(5);
      triggerCelebration('day');
      return 'day_completed';
    }
    
    if (stats.completed >= 5) {
      return 'productive_day';
    }
    
    return null;
  };

  // Verificar conquistas semanais
  const checkWeeklyAchievements = () => {
    const weekStats = getWeekStats();
    
    if (weekStats.percentage >= 80) {
      return 'week_champion';
    }
    
    if (weekStats.completed >= 30) {
      return 'task_master';
    }
    
    return null;
  };

  // Obter próxima tarefa não completa
  const getNextTask = (day: string) => {
    const dayTasks = weeklyRoutine[day] || [];
    return dayTasks.find(task => !task.completed);
  };

  // Obter tarefas por período (manhã, tarde, noite)
  const getTasksByPeriod = (day: string) => {
    const dayTasks = weeklyRoutine[day] || [];
    
    const morning = dayTasks.filter(task => {
      const hour = parseInt(task.time.split(':')[0]);
      return hour >= 6 && hour < 12;
    });
    
    const afternoon = dayTasks.filter(task => {
      const hour = parseInt(task.time.split(':')[0]);
      return hour >= 12 && hour < 18;
    });
    
    const evening = dayTasks.filter(task => {
      const hour = parseInt(task.time.split(':')[0]);
      return hour >= 18 && hour <= 23;
    });
    
    return { morning, afternoon, evening };
  };

  return {
    completeTask,
    completeMultipleTasks,
    isDayCompleted,
    getDayStats,
    getWeekStats,
    resetDay,
    triggerCelebration,
    checkDailyAchievements,
    checkWeeklyAchievements,
    getNextTask,
    getTasksByPeriod,
    celebrationQueue
  };
}
