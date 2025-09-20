'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Clock, Calendar, Trophy, Star, Check, Plus, Volume2, VolumeX, ArrowRight, Award, Trash2, Edit2, Search, Filter } from 'lucide-react';
import { createClient } from '@/utils/supabaseClient';
import './styles.css';
import { PECS_CARDS } from './data/pecsCards';
import { CATEGORIES, WEEKDAYS, TIME_OPTIONS } from './data/categories';
import type { RoutineItem, WeeklyRoutine } from './types';

export default function RoutineVisualPage() {
  const supabase = createClient();
  
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'instructions' | 'main'>('welcome');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('rotina');
  const [selectedDay, setSelectedDay] = useState('segunda');
  const [weeklyRoutine, setWeeklyRoutine] = useState<WeeklyRoutine>({});
  const [viewMode, setViewMode] = useState<'activities' | 'schedule'>('activities');
  const [totalPoints, setTotalPoints] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Função para lidar com erro de imagem
  const handleImageError = (cardId: string) => {
    setImageErrors(prev => new Set(prev).add(cardId));
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
    
    // Animação de sucesso
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 1000);
  };

  const removeActivity = (day: string, uniqueId: string) => {
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day]?.filter(item => item.uniqueId !== uniqueId) || []
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
              total_points: totalPoints,
              is_active: true,
              created_at: new Date().toISOString()
            };
            
            const { error } = await supabase
              .from('daily_routines')
              .insert([routineData]);
          }
        }
        
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

  // INTERFACE MOBILE
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header Fixo */}
        <header className="bg-white shadow-lg sticky top-0 z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800">
                Minha Rotina
              </h1>
              
              <div className="flex items-center gap-2">
                {totalPoints > 0 && (
                  <div className="bg-yellow-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-yellow-800">
                      {totalPoints} ⭐
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => setViewMode(viewMode === 'activities' ? 'schedule' : 'activities')}
                  className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm"
                >
                  {viewMode === 'activities' ? 'Ver Rotina' : 'Add Atividades'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Seletor de Dia */}
        <div className="bg-white shadow-sm">
          <div className="px-2 py-3">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {WEEKDAYS.map(day => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`px-3 py-2 rounded-xl font-medium text-sm flex flex-col items-center min-w-[60px] transition-all ${
                    selectedDay === day.id
                      ? 'bg-purple-500 text-white scale-110'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-lg mb-1">{day.emoji}</span>
                  <span className="text-xs">{day.short}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {viewMode === 'activities' ? (
          // MODO ATIVIDADES
          <div className="flex flex-col h-[calc(100vh-140px)]">
            {/* Barra de Busca e Categorias */}
            <div className="bg-white p-3 shadow-sm">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar atividade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-full text-sm"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
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
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
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
                      <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center mb-2">
                        <span className="text-3xl">📋</span>
                      </div>
                    ) : (
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-20 object-contain mb-2"
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

        {showSuccessAnimation && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-green-500 text-white px-6 py-3 rounded-full animate-bounce">
              ✓ Adicionado!
            </div>
          </div>
        )}
      </div>
    );
  }

  // INTERFACE DESKTOP
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
              <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-600 inline mr-2" />
                <span className="font-bold text-yellow-800">{totalPoints} pts</span>
              </div>
              
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
        <div className="grid grid-cols-3 gap-4">
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
            
            {/* Info sobre cards especiais */}
            {selectedCategory === 'rotina' && (
              <div className="bg-blue-50 rounded-lg p-2 mb-3">
                <p className="text-xs text-blue-700">
                  💡 Incluímos cards de clima, períodos do dia e dias da semana!
                </p>
              </div>
            )}
            
            {/* Grid de Cards */}
            <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto">
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
