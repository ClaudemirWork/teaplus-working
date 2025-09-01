'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Clock, Calendar, Trophy, Star, Check, Gift, Volume2, VolumeX, ArrowRight, Award } from 'lucide-react';
import './styles.css';

// MAPEAMENTO DOS CARDS PECS (mantém o mesmo)
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
  ],
  alimentos: [
    { id: 'suco', name: 'Suco', image: '/images/cards/alimentos/suco_laranja.webp', time: '07:30' },
    { id: 'fruta', name: 'Fruta', image: '/images/cards/alimentos/banana.webp', time: '10:00' },
  ]
};

// Dias da Semana
const WEEKDAYS = [
  { id: 'segunda', name: 'Segunda', short: 'SEG', color: 'bg-blue-100 border-blue-400' },
  { id: 'terca', name: 'Terça', short: 'TER', color: 'bg-green-100 border-green-400' },
  { id: 'quarta', name: 'Quarta', short: 'QUA', color: 'bg-yellow-100 border-yellow-400' },
  { id: 'quinta', name: 'Quinta', short: 'QUI', color: 'bg-orange-100 border-orange-400' },
  { id: 'sexta', name: 'Sexta', short: 'SEX', color: 'bg-purple-100 border-purple-400' },
  { id: 'sabado', name: 'Sábado', short: 'SÁB', color: 'bg-pink-100 border-pink-400' },
  { id: 'domingo', name: 'Domingo', short: 'DOM', color: 'bg-red-100 border-red-400' },
];

// Tipos
interface RoutineItem {
  id: string;
  name: string;
  image: string;
  time: string;
  completed?: boolean;
  uniqueId: string;
}

interface WeeklyRoutine {
  [key: string]: RoutineItem[];
}

interface DailyProgress {
  [key: string]: number; // percentual de conclusão por dia
}

export default function RoutineVisualPage() {
  // Estados de Navegação
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'instructions' | 'main'>('welcome');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Estados da Rotina
  const [selectedDay, setSelectedDay] = useState('segunda');
  const [weeklyRoutine, setWeeklyRoutine] = useState<WeeklyRoutine>({});
  const [viewMode, setViewMode] = useState<'edit' | 'check'>('edit');
  
  // Estados de Gamificação
  const [totalPoints, setTotalPoints] = useState(0);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGoldenGem, setShowGoldenGem] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);

  // Função de Fala
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

  // Adicionar atividade ao dia
  const addActivityToDay = (activity: any) => {
    const newActivity: RoutineItem = {
      ...activity,
      uniqueId: `${activity.id}_${Date.now()}`,
      completed: false
    };
    
    setWeeklyRoutine(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newActivity].sort((a, b) => 
        a.time.localeCompare(b.time)
      )
    }));
  };

  // Marcar atividade como completa
  const toggleActivityComplete = (day: string, uniqueId: string) => {
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day]?.map(item => 
        item.uniqueId === uniqueId 
          ? { ...item, completed: !item.completed }
          : item
      ) || []
    }));
    
    // Calcular progresso
    calculateDayProgress(day);
  };

  // Calcular progresso do dia
  const calculateDayProgress = (day: string) => {
    const activities = weeklyRoutine[day] || [];
    if (activities.length === 0) return;
    
    const completed = activities.filter(a => a.completed).length;
    const progress = Math.round((completed / activities.length) * 100);
    
    setDailyProgress(prev => ({
      ...prev,
      [day]: progress
    }));
    
    // Celebrações baseadas no progresso
    if (progress >= 80 && progress < 100) {
      launchConfetti();
      setTotalPoints(prev => prev + 50);
    } else if (progress === 100) {
      showGoldenReward();
      setTotalPoints(prev => prev + 100);
    }
  };

  // Lançar confetes
  const launchConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Mostrar prêmio dourado
  const showGoldenReward = () => {
    setShowGoldenGem(true);
    setTimeout(() => setShowGoldenGem(false), 4000);
  };

  // Copiar rotina para outros dias
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

  // TELA 1: Boas-vindas Simples
  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center p-4">
        <div className="text-center fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg">
            📅 Organizando Minha Rotina
          </h1>
          
          <div className="mb-8">
            <img
              src="/images/mascotes/leo/leo_forca_resultado.webp"
              alt="Leo"
              className="w-80 h-80 md:w-96 md:h-96 object-contain mx-auto drop-shadow-2xl"
            />
          </div>
          
          <button
            onClick={() => setCurrentScreen('instructions')}
            className="px-12 py-4 bg-white text-orange-500 rounded-full text-xl font-bold shadow-2xl hover:scale-105 transition-transform"
          >
            Iniciar
          </button>
        </div>
      </div>
    );
  }

  // TELA 2: Instruções e Prêmios
  if (currentScreen === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
              Como Funciona? 🎯
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Instruções */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Monte sua Rotina Semanal:
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                    <p>Escolha o dia da semana</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                    <p>Adicione as atividades do dia</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                    <p>Organize os horários</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">4</div>
                    <p>Marque as tarefas cumpridas</p>
                  </div>
                </div>
              </div>
              
              {/* Sistema de Prêmios */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Sistema de Prêmios
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎊</span>
                    <div>
                      <p className="font-semibold">80% das tarefas</p>
                      <p className="text-sm text-gray-600">Confetes + 50 pontos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💎</span>
                    <div>
                      <p className="font-semibold">100% das tarefas</p>
                      <p className="text-sm text-gray-600">Gema Dourada + 100 pontos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎁</span>
                    <div>
                      <p className="font-semibold">500 pontos</p>
                      <p className="text-sm text-gray-600">Prêmio especial!</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Dica:</strong> Peça ajuda aos pais para marcar as tarefas cumpridas e ganhar pontos!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => speakText("Monte sua rotina semanal e ganhe prêmios! Complete 80% das tarefas para ganhar confetes e 100% para ganhar a gema dourada!")}
                className="px-6 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 flex items-center gap-2"
              >
                <Volume2 className="w-5 h-5" />
                Ouvir Instruções
              </button>
              
              <button
                onClick={() => setCurrentScreen('main')}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
              >
                Começar
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TELA PRINCIPAL
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Efeitos Visuais */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#95E77E', '#A8E6CF'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}
      
      {showGoldenGem && (
        <div className="golden-gem-container">
          <div className="golden-gem">💎</div>
          <div className="gem-message">
            PARABÉNS! Rotina Completa!
            <br/>
            <span className="text-xl">+100 pontos!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
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
              Minha Rotina Semanal
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-yellow-800">{totalPoints} pts</span>
                </div>
              </div>
              
              <button
                onClick={() => setViewMode(viewMode === 'edit' ? 'check' : 'edit')}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                {viewMode === 'edit' ? 'Modo Check' : 'Modo Editar'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Abas dos Dias da Semana */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-2 overflow-x-auto py-4">
            {WEEKDAYS.map(day => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`weekday-tab px-4 py-2 rounded-lg font-medium whitespace-nowrap border-2 ${
                  selectedDay === day.id
                    ? `${day.color} border-opacity-100`
                    : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                }`}
              >
                <div className="text-xs">{day.name}</div>
                {dailyProgress[day.id] !== undefined && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
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

      {/* Área Principal */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Painel de Atividades (apenas no modo editar) */}
          {viewMode === 'edit' && (
            <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold mb-4">Adicionar Atividades</h3>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {Object.entries(PECS_CARDS).map(([category, cards]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-gray-700 mb-2 capitalize">{category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {cards.map(card => (
                        <button
                          key={card.id}
                          onClick={() => addActivityToDay(card)}
                          className="p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all"
                        >
                          <img
                            src={card.image}
                            alt={card.name}
                            className="w-full h-16 object-contain mb-1"
                          />
                          <p className="text-xs">{card.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rotina do Dia */}
          <div className={viewMode === 'edit' ? 'md:col-span-2' : 'md:col-span-3'}>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {WEEKDAYS.find(d => d.id === selectedDay)?.name}
                </h3>
                
                {viewMode === 'edit' && weeklyRoutine[selectedDay]?.length > 0 && (
                  <select 
                    onChange={(e) => e.target.value && copyRoutineToDay(selectedDay, e.target.value)}
                    className="px-3 py-1 border rounded-lg text-sm"
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
                    {viewMode === 'edit' 
                      ? 'Adicione atividades para este dia'
                      : 'Nenhuma atividade programada'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {weeklyRoutine[selectedDay].map(item => (
                    <div 
                      key={item.uniqueId}
                      className={`activity-card flex items-center gap-4 p-4 rounded-lg border-2 ${
                        item.completed 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {viewMode === 'check' && (
                        <button
                          onClick={() => toggleActivityComplete(selectedDay, item.uniqueId)}
                          className={`custom-checkbox ${item.completed ? 'checked' : ''}`}
                        />
                      )}
                      
                      <div className="text-lg font-bold text-blue-600">
                        {item.time}
                      </div>
                      
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain"
                      />
                      
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                      </div>
                      
                      {item.completed && (
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Painel de Conquistas */}
        {totalPoints >= 100 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-500" />
              Suas Conquistas
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {totalPoints >= 100 && (
                <div className="achievement-badge text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-4xl mb-2">🏅</div>
                  <p className="font-semibold">Iniciante</p>
                  <p className="text-sm text-gray-600">100 pontos</p>
                </div>
              )}
              
              {totalPoints >= 500 && (
                <div className="achievement-badge text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="font-semibold">Dedicado</p>
                  <p className="text-sm text-gray-600">500 pontos</p>
                </div>
              )}
              
              {totalPoints >= 1000 && (
                <div className="achievement-badge text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-4xl mb-2">👑</div>
                  <p className="font-semibold">Mestre da Rotina</p>
                  <p className="text-sm text-gray-600">1000 pontos</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
