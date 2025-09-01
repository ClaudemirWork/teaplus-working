'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Clock, Calendar, Trophy, Star, Check, Gift, Volume2, VolumeX, ArrowRight, Award, Trash2, Edit2, Filter } from 'lucide-react';
import './styles.css';

// MAPEAMENTO DOS CARDS PECS
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
    { id: 'ler', name: 'Ler Livro', image: '/images/cards/acoes/ler_livro.webp', time: '19:30' },
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
  ]
};

// Categorias
const CATEGORIES = [
  { id: 'rotina', name: 'Rotina Diária', icon: '📅', color: 'bg-blue-100 border-blue-400' },
  { id: 'acoes', name: 'Ações', icon: '👋', color: 'bg-green-100 border-green-400' },
  { id: 'alimentos', name: 'Alimentação', icon: '🍎', color: 'bg-orange-100 border-orange-400' },
  { id: 'escola', name: 'Escola', icon: '🎒', color: 'bg-purple-100 border-purple-400' },
  { id: 'necessidades', name: 'Necessidades', icon: '💙', color: 'bg-pink-100 border-pink-400' },
];

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

// Horários disponíveis
const TIME_OPTIONS = [];
for (let h = 6; h <= 22; h++) {
  for (let m = 0; m < 60; m += 15) {
    TIME_OPTIONS.push(
      `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
    );
  }
}

// Tipos
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
  // Estados
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
    const routineItem: RoutineItem = {
      ...activity,
      uniqueId: `${activity.id}_${Date.now()}`,
      category: selectedCategory,
      completed: false
    };
    
    setWeeklyRoutine(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), routineItem].sort((a, b) => 
        a.time.localeCompare(b.time)
      )
    }));
  };

  // Remover atividade
  const removeActivity = (day: string, uniqueId: string) => {
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day]?.filter(item => item.uniqueId !== uniqueId) || []
    }));
  };

  // Atualizar horário
  const updateActivityTime = (day: string, uniqueId: string, newTime: string) => {
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day]?.map(item => 
        item.uniqueId === uniqueId ? { ...item, time: newTime } : item
      ).sort((a, b) => a.time.localeCompare(b.time)) || []
    }));
  };

  // Marcar como completa
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

  // Calcular progresso
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

  // Efeitos visuais
  const launchConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const showGoldenReward = () => {
    setShowGoldenGem(true);
    setTimeout(() => setShowGoldenGem(false), 4000);
  };

  // Copiar rotina
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

  // TELA 1: Boas-vindas
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

  // TELA 2: Instruções
  if (currentScreen === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-purple-600">
              Como Funciona? 🎯
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Monte sua Rotina Semanal:
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                    <p>Escolha o dia da semana na aba superior</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                    <p>Selecione a categoria no menu lateral</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                    <p><strong>CLIQUE</strong> na imagem para adicionar à rotina</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">4</div>
                    <p>Ajuste os horários e remova atividades se necessário</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">5</div>
                    <p>No modo CHECK, marque as tarefas cumpridas</p>
                  </div>
                </div>
              </div>
              
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
              </div>
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => speakText("Para montar sua rotina, escolha o dia da semana, selecione a categoria e clique nas imagens para adicionar. Você pode ajustar horários e remover atividades quando quiser.")}
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
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD93D'][Math.floor(Math.random() * 3)]
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

      {/* Abas dos Dias */}
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
          {/* Painel Lateral - Modo Editar */}
          {viewMode === 'edit' && (
            <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Adicionar Atividades
              </h3>
              
              {/* Abas de Categorias */}
              <div className="flex flex-wrap gap-2 mb-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
              
              {/* Cards da Categoria Selecionada */}
              <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto">
                {PECS_CARDS[selectedCategory as keyof typeof PECS_CARDS]?.map(card => (
                  <button
                    key={card.id}
                    onClick={() => addActivityToDay(card)}
                    className="p-2 bg-gray-50 rounded-lg hover:bg-blue-50 hover:scale-105 transition-all cursor-pointer border-2 border-gray-200 hover:border-blue-300"
                    title="Clique para adicionar"
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-16 object-contain mb-1"
                    />
                    <p className="text-xs font-medium">{card.name}</p>
                    <p className="text-xs text-gray-500">{card.time}</p>
                  </button>
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
                    {viewMode === 'edit' 
                      ? 'Clique nas imagens ao lado para adicionar atividades'
                      : 'Nenhuma atividade programada'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {weeklyRoutine[selectedDay].map(item => (
                    <div 
                      key={item.uniqueId}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
                        item.completed 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {/* Checkbox - Modo Check */}
                      {viewMode === 'check' && (
                        <button
                          onClick={() => toggleActivityComplete(selectedDay, item.uniqueId)}
                          className={`custom-checkbox ${item.completed ? 'checked' : ''}`}
                        />
                      )}
                      
                      {/* Horário - Editável no modo Edit */}
                      <div className="w-20">
                        {viewMode === 'edit' ? (
                          <select
                            value={item.time}
                            onChange={(e) => updateActivityTime(selectedDay, item.uniqueId, e.target.value)}
                            className="text-sm font-bold text-blue-600 border rounded px-2 py-1 w-full"
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-lg font-bold text-blue-600">{item.time}</span>
                        )}
                      </div>
                      
                      {/* Imagem */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain"
                      />
                      
                      {/* Nome */}
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {CATEGORIES.find(c => c.id === item.category)?.name}
                        </p>
                      </div>
                      
                      {/* Estrela se completado */}
                      {item.completed && (
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      )}
                      
                      {/* Botão Remover - Modo Edit */}
                      {viewMode === 'edit' && (
                        <button
                          onClick={() => removeActivity(selectedDay, item.uniqueId)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Remover atividade"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
