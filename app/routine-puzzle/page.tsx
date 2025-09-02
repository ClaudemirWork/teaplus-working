'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Clock, Calendar, Trophy, Star, Check, Gift, Volume2, VolumeX, ArrowRight, Award, Trash2, Edit2, Filter, Menu, X } from 'lucide-react';
import { createClient } from '../utils/supabaseClient';
import './styles.css';

// [MAPEAMENTO PECS_CARDS permanece o mesmo...]
const PECS_CARDS = {
  rotina: [
    { id: 'acordar', name: 'Acordar', image: '/images/cards/rotina/hora_acordar.webp', time: '07:00' },
    { id: 'cafe_manha', name: 'Café da Manhã', image: '/images/cards/rotina/cafe_manha.webp', time: '07:30' },
    { id: 'banho', name: 'Tomar Banho', image: '/images/cards/rotina/tomar_banho.webp', time: '08:00' },
    { id: 'escola', name: 'Ir para Escola', image: '/images/cards/rotina/mochila_escola.webp', time: '08:30' },
    { id: 'almoco', name: 'Almoço', image: '/images/cards/rotina/almoco.webp', time: '12:00' },
    { id: 'estudar', name: 'Estudar', image: '/images/cards/rotina/estudar.webp', time: '14:00' },
    { id: 'brincar', name: 'Brincar', image: '/images/cards/rotina/brincar.webp', time: '15:00' },
    { id: 'jantar', name: 'Jantar', image: '/images/cards/rotina/jantar.webp', time: '19:00' },
    { id: 'dormir', name: 'Dormir', image: '/images/cards/rotina/hora_dormir.webp', time: '20:30' },
  ],
  acoes: [
    { id: 'escovar_dentes', name: 'Escovar Dentes', image: '/images/cards/acoes/escovar os dentes.webp', time: '07:15' },
    { id: 'lavar_maos', name: 'Lavar as Mãos', image: '/images/cards/acoes/lavar as maos.webp', time: '11:50' },
    { id: 'vestir', name: 'Vestir Roupa', image: '/images/cards/acoes/vestindo_blusa.webp', time: '07:45' },
    { id: 'abracar', name: 'Abraçar', image: '/images/cards/acoes/abraçar.webp', time: '20:00' },
  ],
  alimentos: [
    { id: 'suco', name: 'Suco', image: '/images/cards/alimentos/suco_laranja.webp', time: '07:30' },
    { id: 'fruta', name: 'Fruta', image: '/images/cards/alimentos/banana.webp', time: '10:00' },
    { id: 'sanduiche', name: 'Sanduíche', image: '/images/cards/alimentos/sanduiche.webp', time: '16:00' },
  ],
  escola: [
    { id: 'caderno', name: 'Caderno', image: '/images/cards/escola/caderno.webp', time: '09:00' },
    { id: 'lapis', name: 'Lápis', image: '/images/cards/escola/lapis.webp', time: '09:00' },
    { id: 'livro', name: 'Livro', image: '/images/cards/escola/livro.webp', time: '14:00' },
  ],
  necessidades: [
    { id: 'beber_agua', name: 'Beber Água', image: '/images/cards/acoes/beber.webp', time: '10:30' },
    { id: 'descansar', name: 'Descansar', image: '/images/cards/acoes/sentar.webp', time: '13:00' },
  ],
  fimdesemana: [
    { id: 'passeio', name: 'Passear', image: '/images/cards/acoes/caminhar.webp', time: '10:00' },
    { id: 'parque', name: 'Ir ao Parque', image: '/images/cards/rotina/brincar.webp', time: '10:30' },
  ]
};

const CATEGORIES = [
  { id: 'rotina', name: 'Rotina Diária', icon: '📅', color: 'bg-blue-100 border-blue-400' },
  { id: 'acoes', name: 'Ações', icon: '👋', color: 'bg-green-100 border-green-400' },
  { id: 'alimentos', name: 'Alimentação', icon: '🍎', color: 'bg-orange-100 border-orange-400' },
  { id: 'escola', name: 'Escola', icon: '🎒', color: 'bg-purple-100 border-purple-400' },
  { id: 'necessidades', name: 'Necessidades', icon: '💙', color: 'bg-pink-100 border-pink-400' },
  { id: 'fimdesemana', name: 'Fim de Semana', icon: '🎉', color: 'bg-yellow-100 border-yellow-400' },
];

const WEEKDAYS = [
  { id: 'segunda', name: 'Segunda', short: 'SEG', color: 'bg-blue-100 border-blue-400' },
  { id: 'terca', name: 'Terça', short: 'TER', color: 'bg-green-100 border-green-400' },
  { id: 'quarta', name: 'Quarta', short: 'QUA', color: 'bg-yellow-100 border-yellow-400' },
  { id: 'quinta', name: 'Quinta', short: 'QUI', color: 'bg-orange-100 border-orange-400' },
  { id: 'sexta', name: 'Sexta', short: 'SEX', color: 'bg-purple-100 border-purple-400' },
  { id: 'sabado', name: 'Sábado', short: 'SÁB', color: 'bg-pink-100 border-pink-400' },
  { id: 'domingo', name: 'Domingo', short: 'DOM', color: 'bg-red-100 border-red-400' },
];

const TIME_OPTIONS = [];
for (let h = 6; h <= 22; h++) {
  for (let m = 0; m < 60; m += 15) {
    TIME_OPTIONS.push(
      `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
    );
  }
}

interface RoutineItem {
  id: string;
  name: string;
  image: string;
  time: string;
  completed?: boolean;
  uniqueId: string;
  category?: string;
}

interface WeeklyRoutine {
  [key: string]: RoutineItem[];
}

export default function RoutineVisualPage() {
  const supabase = createClient();
  
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'instructions' | 'main'>('welcome');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('rotina');
  const [selectedDay, setSelectedDay] = useState('segunda');
  const [weeklyRoutine, setWeeklyRoutine] = useState<WeeklyRoutine>({});
  const [viewMode, setViewMode] = useState<'edit' | 'check'>('edit');
  const [totalPoints, setTotalPoints] = useState(0);
  const [dailyProgress, setDailyProgress] = useState<{ [key: string]: number }>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGoldenGem, setShowGoldenGem] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [routineName, setRoutineName] = useState('Minha Rotina Semanal');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Funções auxiliares para horários inteligentes
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
      // Se não há atividades, começa às 07:00
      return '07:00';
    }
    
    // Ordena as atividades por horário para pegar realmente a última
    const sortedActivities = [...dayActivities].sort((a, b) => 
      a.time.localeCompare(b.time)
    );
    
    // Pega o último horário e adiciona 30 minutos
    const lastActivity = sortedActivities[sortedActivities.length - 1];
    const nextTime = addMinutesToTime(lastActivity.time, 30);
    
    // Se passar das 22:00, volta para 22:00 (horário limite)
    if (nextTime > '22:00') {
      return '22:00';
    }
    
    return nextTime;
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
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
              routine_name: `${routineName} - ${WEEKDAYS.find(w => w.id === day)?.name}`,
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
              
            if (error) {
              console.error('Erro ao salvar dia:', day, error);
            }
          }
        }
        
        alert('Rotina semanal salva com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar rotina. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Função ATUALIZADA com horário inteligente
  const addActivityToDay = (activity: any) => {
    // Obtém o próximo horário disponível baseado nas atividades existentes
    const smartTime = getNextAvailableTime(selectedDay);
    
    const routineItem: RoutineItem = {
      ...activity,
      uniqueId: `${activity.id}_${Date.now()}`,
      category: selectedCategory,
      completed: false,
      time: smartTime // Usa o horário inteligente
    };
    
    setWeeklyRoutine(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), routineItem].sort((a, b) => 
        a.time.localeCompare(b.time)
      )
    }));
    
    // Fecha menu mobile após adicionar
    setShowMobileMenu(false);
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

  const toggleActivityComplete = (day: string, uniqueId: string) => {
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day]?.map(item => 
        item.uniqueId === uniqueId 
          ? { ...item, completed: !item.completed }
          : item
      ) || []
    }));
    
    calculateDayProgress(day);
  };

  const calculateDayProgress = (day: string) => {
    const activities = weeklyRoutine[day] || [];
    if (activities.length === 0) return;
    
    const completed = activities.filter(a => a.completed).length;
    const progress = Math.round((completed / activities.length) * 100);
    
    setDailyProgress(prev => ({
      ...prev,
      [day]: progress
    }));
    
    if (progress >= 80 && progress < 100) {
      launchConfetti();
      setTotalPoints(prev => prev + 50);
    } else if (progress === 100) {
      showGoldenReward();
      setTotalPoints(prev => prev + 100);
    }
  };

  const launchConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const showGoldenReward = () => {
    setShowGoldenGem(true);
    setTimeout(() => setShowGoldenGem(false), 4000);
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

  // [RESTO DO CÓDIGO PERMANECE IGUAL - telas de welcome, instructions e main...]
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

  // TELA 2: Instruções (adicionar info sobre o horário automático)
  if (currentScreen === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-purple-600">
              Como Funciona? 🎯
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                  Monte sua Rotina Semanal:
                </h3>
                
                <div className="space-y-3">
                  {[
                    'Escolha o dia da semana na aba superior',
                    'No mobile, clique no botão menu',
                    'CLIQUE na imagem para adicionar',
                    '⏰ Novo! Horário automático +30min',
                    'Ajuste horários se necessário',
                    'Salve sua rotina completa'
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-purple-500 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className={`text-sm sm:text-base ${i === 3 ? 'font-semibold text-purple-600' : ''}`}>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 mt-4">
                  <p className="text-sm text-blue-700">
                    <strong>Dica:</strong> Cada nova atividade é adicionada automaticamente 30 minutos após a última!
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                  Sistema de Prêmios
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl">🎊</span>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">80% das tarefas</p>
                      <p className="text-xs sm:text-sm text-gray-600">Confetes + 50 pontos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl">💎</span>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">100% das tarefas</p>
                      <p className="text-xs sm:text-sm text-gray-600">Gema Dourada + 100 pontos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => speakText("Nova funcionalidade! Agora cada atividade é adicionada automaticamente 30 minutos após a última, facilitando sua organização.")}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Ouvir
              </button>
              
              <button
                onClick={() => setCurrentScreen('main')}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                Começar
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // [RESTO DA TELA PRINCIPAL PERMANECE IGUAL...]
  // TELA PRINCIPAL
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Efeitos Visuais */}
      {showConfetti && (
        <div className="confetti-container fixed inset-0 pointer-events-none z-[9999]">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD93D'][Math.floor(Math.random() * 3)]
              }}
            />
          ))}
        </div>
      )}
      
      {showGoldenGem && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[10000] p-4">
          <div className="text-8xl sm:text-9xl animate-spin">💎</div>
          <div className="text-yellow-400 text-xl sm:text-2xl font-bold text-center mt-4">
            PARABÉNS! Rotina Completa!
            <br/>
            <span className="text-lg sm:text-xl">+100 pontos!</span>
          </div>
          <button 
            onClick={() => setShowGoldenGem(false)}
            className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg"
          >
            OK
          </button>
        </div>
      )}

      {/* Header Responsivo */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentScreen('instructions')}
              className="p-2 text-purple-600"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              Rotina Semanal
            </h1>
            
            <div className="flex items-center gap-2">
              <div className="bg-yellow-100 px-2 sm:px-3 py-1 rounded">
                <span className="text-xs sm:text-sm font-bold text-yellow-800">{totalPoints}pts</span>
              </div>
              
              {/* Botão Menu Mobile */}
              {viewMode === 'edit' && (
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 text-purple-600"
                >
                  {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              )}
            </div>
          </div>
          
          {/* Controles */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={saveRoutine}
              disabled={isSaving}
              className="flex-1 px-3 py-1.5 bg-green-500 text-white rounded text-sm font-medium"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
            
            <button
              onClick={() => setViewMode(viewMode === 'edit' ? 'check' : 'edit')}
              className="flex-1 px-3 py-1.5 bg-purple-500 text-white rounded text-sm font-medium"
            >
              {viewMode === 'edit' ? 'Check' : 'Editar'}
            </button>
          </div>
        </div>
      </header>

      {/* Abas dos Dias - Scroll Horizontal no Mobile */}
      <div className="bg-white shadow-md">
        <div className="px-2 sm:px-4">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto py-2 sm:py-3 scrollbar-hide">
            {WEEKDAYS.map(day => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`px-2 sm:px-3 py-2 rounded-lg font-medium whitespace-nowrap border-2 text-xs sm:text-sm flex-shrink-0 ${
                  selectedDay === day.id
                    ? `${day.color} border-opacity-100`
                    : 'bg-gray-100 border-gray-200'
                }`}
              >
                <div className="sm:hidden">{day.short}</div>
                <div className="hidden sm:block">{day.name}</div>
                {dailyProgress[day.id] !== undefined && (
                  <div className="mt-1">
                    <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${dailyProgress[day.id]}%` }}
                      />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Mobile Lateral */}
      {viewMode === 'edit' && showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Adicionar Atividades</h3>
                <button onClick={() => setShowMobileMenu(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Categorias */}
              <div className="flex flex-wrap gap-2 mb-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      selectedCategory === cat.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
              
              {/* Cards */}
              <div className="grid grid-cols-2 gap-3">
                {PECS_CARDS[selectedCategory as keyof typeof PECS_CARDS]?.map(card => (
                  <button
                    key={card.id}
                    onClick={() => addActivityToDay(card)}
                    className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200 active:border-blue-400"
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-20 object-contain mb-1"
                    />
                    <p className="text-xs font-medium">{card.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Área Principal */}
      <div className="p-2 sm:p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Menu Desktop */}
          {viewMode === 'edit' && (
            <div className="hidden md:block md:w-1/3 bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold mb-4">Adicionar Atividades</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      selectedCategory === cat.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto">
                {PECS_CARDS[selectedCategory as keyof typeof PECS_CARDS]?.map(card => (
                  <button
                    key={card.id}
                    onClick={() => addActivityToDay(card)}
                    className="p-2 bg-gray-50 rounded-lg hover:bg-blue-50 border-2 border-gray-200"
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-16 object-contain mb-1"
                    />
                    <p className="text-xs font-medium">{card.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rotina do Dia */}
          <div className={`flex-1 bg-white rounded-xl shadow-lg p-3 sm:p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold">
                {WEEKDAYS.find(d => d.id === selectedDay)?.name}
              </h3>
              
              {viewMode === 'edit' && weeklyRoutine[selectedDay]?.length > 0 && (
                <select 
                  onChange={(e) => e.target.value && copyRoutineToDay(selectedDay, e.target.value)}
                  className="px-2 py-1 border rounded text-xs sm:text-sm"
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
              <div className="text-center py-8 sm:py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 text-sm sm:text-base">
                  {viewMode === 'edit' 
                    ? 'Clique no menu para adicionar'
                    : 'Nenhuma atividade programada'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {weeklyRoutine[selectedDay].map(item => (
                  <div 
                    key={item.uniqueId}
                    className={`flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg border-2 ${
                      item.completed 
                        ? 'bg-green-50 border-green-300' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {viewMode === 'check' && (
                      <button
                        onClick={() => toggleActivityComplete(selectedDay, item.uniqueId)}
                        className={`w-6 h-6 rounded border-2 flex-shrink-0 ${
                          item.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                        }`}
                      >
                        {item.completed && <Check className="w-4 h-4 text-white" />}
                      </button>
                    )}
                    
                    <div className="w-16 sm:w-20 flex-shrink-0">
                      {viewMode === 'edit' ? (
                        <select
                          value={item.time}
                          onChange={(e) => updateActivityTime(selectedDay, item.uniqueId, e.target.value)}
                          className="text-xs sm:text-sm font-bold text-blue-600 border rounded px-1 py-1 w-full"
                        >
                          {TIME_OPTIONS.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-sm sm:text-lg font-bold text-blue-600">{item.time}</span>
                      )}
                    </div>
                    
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate">{item.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {CATEGORIES.find(c => c.id === item.category)?.name}
                      </p>
                    </div>
                    
                    {item.completed && (
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                    
                    {viewMode === 'edit' && (
                      <button
                        onClick={() => removeActivity(selectedDay, item.uniqueId)}
                        className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
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
