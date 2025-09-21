'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Clock, Calendar, Trophy, Star, Check, Plus, Volume2, VolumeX, ArrowRight, Award, Trash2, Edit2, Search, Filter, Users, Baby, X, Bell } from 'lucide-react';
import { createClient } from '@/utils/supabaseClient';
import './styles.css';
import { PECS_CARDS } from './data/pecsCards';
import { CATEGORIES, WEEKDAYS, TIME_OPTIONS } from './data/categories';
import type { RoutineItem, WeeklyRoutine } from './types';
import { useGameSystem } from './hooks/useGameSystem';
import ChildMode from './components/ChildMode';
import GameHUD from './components/GameHUD';
import CelebrationOverlay from './components/CelebrationOverlay';
import LeoMascot, { useLeoMascot } from './components/LeoMascot';
import { GameAudioManager } from '@/utils/gameAudioManager';

// Importações do sistema de mensagens contextuais do Leo
import { LeoAssistant } from './components/LeoAssistant';
import { useLeoMessages } from './hooks/useLeoMessages';
import { UserContext } from './data/leoContextualMessages';

export default function RoutineVisualPage() {
  const supabase = createClient();
  const audioManager = GameAudioManager.getInstance();
  
  // Sistema de jogo unificado
  const gameSystem = useGameSystem();
  
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'instructions' | 'main'>('welcome');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('rotina');
  const [selectedDay, setSelectedDay] = useState('segunda');
  const [weeklyRoutine, setWeeklyRoutine] = useState<WeeklyRoutine>({});
  const [viewMode, setViewMode] = useState<'activities' | 'schedule'>('activities');
  const [userMode, setUserMode] = useState<'parent' | 'child'>('parent');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [volumeMuted, setVolumeMuted] = useState(false);

  // Estados para tracking do usuário (Leo)
  const [userStats, setUserStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    streakDays: 0,
    level: 1,
    stars: 0,
    daysUsing: 0,
    firstTimeUser: true,
    lastActivity: new Date()
  });

  // Hook do Leo Mascot (existente)
  const {
    leoMood,
    leoMessage,
    showLeo,
    celebrateTask,
    encourageUser,
    celebrateLevelUp,
    greetUser,
    setLeoMood,
    setLeoMessage
  } = useLeoMascot();

  // Calcular contexto do usuário para o sistema de mensagens do Leo
  const userContext: UserContext = {
    userMode: userMode,
    totalTasks: userStats.totalTasks,
    completedTasks: userStats.completedTasks,
    completionRate: userStats.totalTasks > 0 ? (userStats.completedTasks / userStats.totalTasks) * 100 : 0,
    streakDays: userStats.streakDays,
    level: gameSystem.state.gameState.level,
    stars: gameSystem.state.gameState.stars,
    daysUsing: userStats.daysUsing,
    lastActivity: userStats.lastActivity,
    progressLevel: 'beginner' // será calculado automaticamente pelo hook
  };

  // Hook do sistema de mensagens contextuais do Leo
  const {
    currentMessage,
    triggerMessage,
    speakMessage,
    dismissMessage,
    messageHistory,
    isLoading: leoIsLoading,
    error: leoError
  } = useLeoMessages({ 
    userContext, 
    enableTTS: !volumeMuted, 
    debugMode: process.env.NODE_ENV === 'development' 
  });

  // Sincronizar estatísticas com gameSystem
  useEffect(() => {
    setUserStats(prev => ({
      ...prev,
      level: gameSystem.state.gameState.level,
      stars: gameSystem.state.gameState.stars,
      totalTasks: gameSystem.state.stats.totalTasksCompleted,
      completedTasks: gameSystem.state.stats.totalTasksCompleted,
      streakDays: gameSystem.state.gameState.streak
    }));
  }, [gameSystem.state]);

  // Carregar estatísticas do localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('routine-puzzle-user-stats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setUserStats(prev => ({
        ...prev,
        ...parsed,
        firstTimeUser: false
      }));
    }
  }, []);

  // Salvar estatísticas no localStorage
  useEffect(() => {
    localStorage.setItem('routine-puzzle-user-stats', JSON.stringify(userStats));
  }, [userStats]);

  // Trigger de primeira visita
  useEffect(() => {
    if (userStats.firstTimeUser && currentScreen === 'main') {
      setTimeout(() => {
        triggerMessage('app_start');
        setUserStats(prev => ({ ...prev, firstTimeUser: false }));
      }, 1000);
    }
  }, [currentScreen, userStats.firstTimeUser, triggerMessage]);

  // Função melhorada para completar tarefa com sistema unificado + Leo
  const completeTask = (day: string, uniqueId: string) => {
    const task = weeklyRoutine[day]?.find(t => t.uniqueId === uniqueId);
    if (!task) return;

    // Atualizar rotina local
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day]?.map(item => 
        item.uniqueId === uniqueId 
          ? { ...item, completed: !item.completed }
          : item
      ) || []
    }));
    
    if (!task.completed) {
      // Completando tarefa - usar sistema unificado
      gameSystem.completeTask(task.name, task.category, day);
      
      // Atualizar estatísticas do usuário
      setUserStats(prev => ({
        ...prev,
        completedTasks: prev.completedTasks + 1,
        lastActivity: new Date()
      }));
      
      // Trigger do Leo para tarefa completada
      setTimeout(() => {
        triggerMessage('task_completion');
      }, 500);
      
      // Leo celebra apenas no modo pai (comportamento existente)
      if (userMode === 'parent') {
        setTimeout(() => {
          celebrateTask(task.name);
          audioManager.falarLeo(`Parabéns! Você completou: ${task.name}`);
        }, 500);
      }
    } else {
      // Descompletando tarefa
      gameSystem.uncompleteTask(task.name, task.category);
      
      setUserStats(prev => ({
        ...prev,
        completedTasks: Math.max(0, prev.completedTasks - 1),
        lastActivity: new Date()
      }));
    }
  };

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Verificar estado do mute
  useEffect(() => {
    setVolumeMuted(!audioManager.getAudioEnabled());
  }, []);

  // Reagir a notificações de level up
  useEffect(() => {
    const levelUpNotifications = gameSystem.unreadNotifications.filter(n => n.type === 'level_up');
    levelUpNotifications.forEach(notification => {
      celebrateLevelUp(gameSystem.state.gameState.level);
      audioManager.falarLeo(notification.message);
      gameSystem.markNotificationAsRead(notification.id);
      
      // Trigger do Leo para level up
      setTimeout(() => {
        triggerMessage('level_up');
      }, 1000);
    });
  }, [gameSystem.unreadNotifications, triggerMessage]);

  // Função para lidar com erro de imagem
  const handleImageError = (cardId: string) => {
    setImageErrors(prev => new Set(prev).add(cardId));
  };

  // Toggle mute
  const handleToggleMute = () => {
    const newEnabledState = audioManager.toggleAudio();
    setVolumeMuted(!newEnabledState);
  };

  // Funções auxiliares
  const addMinutesToTime = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  const getNextAvailableTime = (day: string): string => {
    const dayActivities = weeklyRoutine[day] || [];
    
    if (dayActivities.length === 0) {
      return '07:00';
    }
    
    const sortedActivities = [...dayActivities].sort((a, b) => 
      a.time.localeCompare(b.time)
    );
    
    const lastActivity = sortedActivities[sortedActivities.length - 1];
    const nextTime = addMinutesToTime(lastActivity.time, 30);
    
    if (nextTime > '22:00') {
      return '22:00';
    }
    
    return nextTime;
  };

  const addActivityToDay = (activity: any) => {
    const smartTime = getNextAvailableTime(selectedDay);
    
    const routineItem: RoutineItem = {
      ...activity,
      uniqueId: `${activity.id}_${Date.now()}`,
      category: selectedCategory,
      completed: false,
      time: smartTime
    };
    
    setWeeklyRoutine(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), routineItem].sort((a, b) => 
        a.time.localeCompare(b.time)
      )
    }));
    
    // Atualizar estatísticas
    setUserStats(prev => ({
      ...prev,
      totalTasks: prev.totalTasks + 1,
      lastActivity: new Date()
    }));
    
    // Trigger do Leo para atividade adicionada
    setTimeout(() => {
      triggerMessage('activity_added');
    }, 300);
    
    // Animação de sucesso
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 1000);
  };

  const removeActivity = (day: string, uniqueId: string) => {
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day]?.filter(item => item.uniqueId !== uniqueId) || []
    }));
    
    setUserStats(prev => ({
      ...prev,
      totalTasks: Math.max(0, prev.totalTasks - 1),
      lastActivity: new Date()
    }));
  };

  const updateActivityTime = (day: string, uniqueId: string, newTime: string) => {
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day]?.map(item => 
        item.uniqueId === uniqueId ? { ...item, time: newTime } : item
      ).sort((a, b) => a.time.localeCompare(b.time)) || []
    }));
  };

  const saveRoutine = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        for (const [day, activities] of Object.entries(weeklyRoutine)) {
          if (activities && activities.length > 0) {
            const routineData = {
              user_id: user.id,
              routine_name: `Rotina - ${WEEKDAYS.find(w => w.id === day)?.name}`,
              routine_type: 'weekly_visual',
              weekday: day,
              activities: activities.map(item => ({
                activity_id: item.id,
                name: item.name,
                image: item.image,
                time: item.time,
                category: item.category,
                completed: item.completed || false
              })),
              total_points: gameSystem.state.gameState.stars,
              is_active: true,
              created_at: new Date().toISOString()
            };
            
            const { error } = await supabase
              .from('daily_routines')
              .insert([routineData]);
          }
        }
        
        // Trigger do Leo para rotina salva
        setTimeout(() => {
          triggerMessage('routine_saved');
        }, 500);
        
        alert('Rotina salva com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar rotina.');
    } finally {
      setIsSaving(false);
    }
  };

  const copyRoutineToDay = (fromDay: string, toDay: string) => {
    const routineToCopy = weeklyRoutine[fromDay] || [];
    const newRoutine = routineToCopy.map(item => ({
      ...item,
      uniqueId: `${item.id}_${Date.now()}_${Math.random()}`,
      completed: false
    }));
    
    setWeeklyRoutine(prev => ({
      ...prev,
      [toDay]: newRoutine
    }));
  };

  // Trigger para dia vazio
  useEffect(() => {
    const currentDayActivities = weeklyRoutine[selectedDay] || [];
    if (currentDayActivities.length === 0 && !userStats.firstTimeUser) {
      const timer = setTimeout(() => {
        triggerMessage('empty_day_view');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedDay, weeklyRoutine, userStats.firstTimeUser, triggerMessage]);

  // Trigger para mudança de tela principal
  useEffect(() => {
    if (currentScreen === 'main' && !userStats.firstTimeUser) {
      setTimeout(() => {
        triggerMessage('main_screen_load');
      }, 1000);
    }
  }, [currentScreen, userStats.firstTimeUser, triggerMessage]);

  // Filtrar atividades
  const getFilteredActivities = () => {
    let allActivities: any[] = [];
    
    if (selectedCategory === 'all') {
      Object.values(PECS_CARDS).forEach(categoryCards => {
        allActivities = [...allActivities, ...categoryCards];
      });
    } else {
      allActivities = PECS_CARDS[selectedCategory as keyof typeof PECS_CARDS] || [];
    }
    
    if (searchTerm) {
      return allActivities.filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return allActivities;
  };

  // Modal de Busca
  const SearchModal = () => {
    if (!showSearchModal) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-16">
        <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md max-h-96 overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Buscar Atividade</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <input
              type="text"
              placeholder="Digite o nome da atividade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-xl text-base"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {getFilteredActivities().slice(0, 20).map(card => (
              <button
                key={card.id}
                onClick={() => {
                  addActivityToDay(card);
                  setShowSearchModal(false);
                  setSearchTerm('');
                }}
                className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 border-b last:border-b-0"
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-12 h-12 object-contain"
                  onError={() => handleImageError(card.id)}
                />
                <span className="font-medium">{card.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Modal de Notificações
  const NotificationsModal = () => {
    if (!showNotifications) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-16">
        <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md max-h-96 overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Notificações</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {gameSystem.state.notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação ainda</p>
              </div>
            ) : (
              gameSystem.state.notifications.slice(0, 10).map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b last:border-b-0 ${
                    !notification.isRead ? 'bg-blue-50' : 'bg-white'
                  }`}
                  onClick={() => gameSystem.markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{notification.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                      {notification.reward && (
                        <div className="text-xs text-green-600 font-medium">
                          +{notification.reward.stars} estrelas
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        {new Date(notification.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // TELA 1: Boas-vindas
  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center p-4">
        <div className="text-center fade-in max-w-lg mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-6 sm:mb-8 drop-shadow-lg">
            📅 Organizando Minha Rotina
          </h1>
          
          <div className="mb-6 sm:mb-8">
            <img
              src="/images/mascotes/leo/leo_forca_resultado.webp"
              alt="Leo"
              className="w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain mx-auto drop-shadow-2xl"
            />
          </div>
          
          <button
            onClick={() => setCurrentScreen('instructions')}
            className="px-8 sm:px-12 py-3 sm:py-4 bg-white text-orange-500 rounded-full text-lg sm:text-xl font-bold shadow-2xl hover:scale-105 transition-transform"
          >
            Iniciar
          </button>
        </div>
      </div>
    );
  }

  // TELA 2: Instruções
  if (currentScreen === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">
              Super Fácil! 🎯
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <p className="text-base">Escolha o dia da semana</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <p className="text-base">Toque nas atividades para adicionar</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <p className="text-base">Veja sua rotina completa!</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-3 mt-4">
              <p className="text-sm text-yellow-800">
                💡 <strong>Dica:</strong> Temos cards de clima, dias da semana e períodos do dia para deixar sua rotina ainda mais completa!
              </p>
            </div>
            
            <button
              onClick={() => setCurrentScreen('main')}
              className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg"
            >
              Vamos lá!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MODO CRIANÇA
  if (userMode === 'child') {
    return (
      <>
        <ChildMode
          selectedDay={selectedDay}
          weeklyRoutine={weeklyRoutine}
          onCompleteTask={completeTask}
          totalPoints={gameSystem.state.gameState.stars}
        />
        <CelebrationOverlay celebrationQueue={gameSystem.state.notifications.filter(n => !n.isRead && n.type === 'achievement')} />
        
        {/* Leo Assistant no modo criança (apenas visual) */}
        <LeoAssistant 
          userContext={userContext}
          position="bottom-right"
          enableAutoTriggers={true}
          debugMode={process.env.NODE_ENV === 'development'}
          onMessageDismiss={() => {
            console.log('Leo message dismissed in child mode');
          }}
        />
      </>
    );
  }

  // INTERFACE MOBILE (MODO PAI) - Header COMPACTO
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header Compacto */}
        <header className="bg-white shadow-lg sticky top-0 z-40">
          <div className="px-4 py-3">
            {/* Título e controles */}
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-bold text-gray-800">
                Minha Rotina
              </h1>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 bg-blue-100 text-blue-500 rounded-full text-xs"
                  title="Notificações"
                >
                  <Bell className="w-4 h-4" />
                  {gameSystem.unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {gameSystem.unreadNotifications.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setUserMode('child')}
                  className="p-2 bg-blue-500 text-white rounded-full text-xs"
                  title="Modo Criança"
                >
                  <Baby className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setViewMode(viewMode === 'activities' ? 'schedule' : 'activities')}
                  className="p-2 bg-purple-500 text-white rounded-full text-xs"
                  title={viewMode === 'activities' ? 'Ver Rotina' : 'Adicionar'}
                >
                  {viewMode === 'activities' ? <Calendar className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={handleToggleMute}
                  className={`p-2 rounded-full ${
                    volumeMuted ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-500'
                  }`}
                  title={volumeMuted ? 'Ativar som' : 'Silenciar'}
                >
                  {volumeMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Progresso condensado + Busca */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {gameSystem.state.gameState.level}
                </div>
                <div className="text-xs text-gray-600">
                  Nível {gameSystem.state.gameState.level} • {gameSystem.state.stats.totalTasksCompleted} total • {gameSystem.state.gameState.streak} dias
                </div>
              </div>
              
              <button
                onClick={() => setShowSearchModal(true)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                title="Buscar atividades"
              >
                <Search className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Dias da semana compactos */}
            <div className="flex gap-2 mb-3">
              {WEEKDAYS.map(day => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium text-xs transition-all ${
                    selectedDay === day.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>

            {/* Categorias compactas */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                🌟 Todas
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </header>

        {viewMode === 'activities' ? (
          // MODO ATIVIDADES
          <div className="flex flex-col h-[calc(100vh-180px)]">
            {/* Grid de Atividades */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-3 gap-2">
                {getFilteredActivities().map(card => (
                  <button
                    key={card.id}
                    onClick={() => addActivityToDay(card)}
                    className="bg-white rounded-xl p-3 shadow-sm active:scale-95 transition-transform"
                  >
                    {imageErrors.has(card.id) ? (
                      <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center mb-2">
                        <span className="text-2xl">📋</span>
                      </div>
                    ) : (
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-16 object-contain mb-2"
                        onError={() => handleImageError(card.id)}
                      />
                    )}
                    <p className="text-xs font-medium text-center line-clamp-2">
                      {card.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Contador de atividades */}
            {weeklyRoutine[selectedDay]?.length > 0 && (
              <div className="bg-white border-t p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {WEEKDAYS.find(d => d.id === selectedDay)?.name}:
                  </span>
                  <span className="text-sm font-bold text-purple-600">
                    {weeklyRoutine[selectedDay].length} atividades
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // MODO VISUALIZAR ROTINA
          <div className="p-3">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold mb-4 text-center">
                {WEEKDAYS.find(d => d.id === selectedDay)?.emoji} {WEEKDAYS.find(d => d.id === selectedDay)?.name}
              </h3>
              
              {!weeklyRoutine[selectedDay] || weeklyRoutine[selectedDay].length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Nenhuma atividade ainda</p>
                  <button
                    onClick={() => setViewMode('activities')}
                    className="px-6 py-2 bg-purple-500 text-white rounded-full"
                  >
                    Adicionar Atividades
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {weeklyRoutine[selectedDay].map(item => (
                    <div 
                      key={item.uniqueId}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <select
                        value={item.time}
                        onChange={(e) => updateActivityTime(selectedDay, item.uniqueId, e.target.value)}
                        className="text-sm font-bold text-blue-600 border rounded px-2 py-1"
                      >
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain"
                      />
                      
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                      </div>

                      <button
                        onClick={() => completeTask(selectedDay, item.uniqueId)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          item.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        {item.completed && <Check className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => removeActivity(selectedDay, item.uniqueId)}
                        className="p-2 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={saveRoutine}
                    disabled={isSaving}
                    className="w-full mt-4 py-2 bg-green-500 text-white rounded-lg"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Rotina'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leo Mascot no Mobile (modo pai) */}
        {showLeo && (
          <div className="fixed bottom-4 right-4 z-40">
            <LeoMascot
              isVisible={true}
              mood={leoMood}
              message={leoMessage}
              showVolumeControl={false}
            />
          </div>
        )}

        {/* Leo Assistant no Mobile */}
        <LeoAssistant 
          userContext={userContext}
          position="bottom-left"
          enableAutoTriggers={true}
          debugMode={process.env.NODE_ENV === 'development'}
          onMessageDismiss={() => {
            console.log('Leo message dismissed on mobile');
          }}
        />

        {showSuccessAnimation && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full animate-bounce">
              ✓ Adicionado!
            </div>
          </div>
        )}

        <SearchModal />
        <NotificationsModal />
        <CelebrationOverlay celebrationQueue={gameSystem.state.notifications.filter(n => !n.isRead && n.type === 'achievement')} />
      </div>
    );
  }

  // INTERFACE DESKTOP (MODO PAI) - Com sistema unificado + Leo
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header Desktop */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentScreen('instructions')}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <ChevronLeft className="w-6 h-6" />
              Voltar
            </button>
            
            <h1 className="text-2xl font-bold text-gray-800">
              Rotina Semanal Completa
            </h1>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-full bg-blue-100 text-blue-500"
                title="Notificações"
              >
                <Bell className="w-5 h-5" />
                {gameSystem.unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {gameSystem.unreadNotifications.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={handleToggleMute}
                className={`p-2 rounded-full ${
                  volumeMuted ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'
                }`}
                title={volumeMuted ? 'Ativar som' : 'Silenciar'}
              >
                {volumeMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setUserMode(userMode === 'parent' ? 'child' : 'parent')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {userMode === 'parent' ? <Baby className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                {userMode === 'parent' ? 'Modo Criança' : 'Modo Pai'}
              </button>
              
              <button
                onClick={saveRoutine}
                disabled={isSaving}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                <Save className="w-5 h-5 inline mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Abas dos Dias */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-4">
            {WEEKDAYS.map(day => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-4 py-2 rounded-lg font-medium border-2 ${
                  selectedDay === day.id
                    ? `${day.color} border-opacity-100`
                    : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {day.emoji} {day.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Área Principal Desktop */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-4 gap-4">
          {/* GameHUD */}
          <div className="col-span-1 space-y-4">
            <GameHUD gameState={gameSystem.state.gameState} isChildMode={false} showDetails={true} />
            
            {/* Leo Mascot no Desktop */}
            {showLeo && (
              <LeoMascot
                isVisible={true}
                mood={leoMood}
                message={leoMessage}
                showVolumeControl={true}
              />
            )}
          </div>

          {/* Painel de Atividades */}
          <div className="col-span-1 bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Todas as Atividades
            </h3>
            
            {/* Busca */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              />
            </div>
            
            {/* Categorias */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  selectedCategory === 'all'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    selectedCategory === cat.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
            
            {/* Grid de Cards */}
            <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
              {getFilteredActivities().map(card => (
                <button
                  key={card.id}
                  onClick={() => addActivityToDay(card)}
                  className="p-2 bg-gray-50 rounded-lg hover:bg-blue-50 hover:scale-105 transition-all border-2 border-gray-200 hover:border-blue-300"
                >
                  {imageErrors.has(card.id) ? (
                    <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center mb-1">
                      <span className="text-2xl">📋</span>
                    </div>
                  ) : (
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-16 object-contain mb-1"
                      onError={() => handleImageError(card.id)}
                    />
                  )}
                  <p className="text-xs font-medium">{card.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Rotina do Dia */}
          <div className="col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {WEEKDAYS.find(d => d.id === selectedDay)?.emoji} {WEEKDAYS.find(d => d.id === selectedDay)?.name}
              </h3>
              
              {weeklyRoutine[selectedDay]?.length > 0 && (
                <select 
                  onChange={(e) => e.target.value && copyRoutineToDay(selectedDay, e.target.value)}
                  className="px-3 py-1 border rounded-lg text-sm"
                  defaultValue=""
                >
                  <option value="">Copiar para...</option>
                  {WEEKDAYS.filter(d => d.id !== selectedDay).map(day => (
                    <option key={day.id} value={day.id}>{day.name}</option>
                  ))}
                </select>
              )}
            </div>

            {!weeklyRoutine[selectedDay] || weeklyRoutine[selectedDay].length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">
                  Clique nas atividades ao lado para adicionar
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {weeklyRoutine[selectedDay].map(item => (
                  <div 
                    key={item.uniqueId}
                    className="flex items-center gap-4 p-4 rounded-lg border-2 bg-gray-50 border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <div className="w-20">
                      <select
                        value={item.time}
                        onChange={(e) => updateActivityTime(selectedDay, item.uniqueId, e.target.value)}
                        className="text-sm font-bold text-blue-600 border rounded px-2 py-1 w-full"
                      >
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain"
                    />
                    
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {CATEGORIES.find(c => c.id === item.category)?.name}
                      </p>
                    </div>

                    <button
                      onClick={() => completeTask(selectedDay, item.uniqueId)}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        item.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {item.completed && <Check className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={() => removeActivity(selectedDay, item.uniqueId)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leo Assistant no Desktop */}
      <LeoAssistant 
        userContext={userContext}
        position="bottom-right"
        enableAutoTriggers={true}
        debugMode={process.env.NODE_ENV === 'development'}
        onMessageDismiss={() => {
          console.log('Leo message dismissed on desktop');
        }}
      />

      <NotificationsModal />
      <CelebrationOverlay celebrationQueue={gameSystem.state.notifications.filter(n => !n.isRead && n.type === 'achievement')} />

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
