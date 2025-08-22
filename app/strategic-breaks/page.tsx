'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Coffee, Play, Pause, Award, Target, Clock, CheckCircle, Timer, RotateCcw, 
  ChevronLeft, Brain, Heart, Eye, Zap, TrendingUp, Star, Trophy, Flame,
  Volume2, VolumeX, Settings, BarChart3, Calendar, Gift, Music, Sparkles
} from 'lucide-react';

// ============================================================================
// 1. COMPONENTE PADRÃO "GAMEHEADER"
// ============================================================================
const GameHeader = ({ title, icon }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h1>
        <div className="w-24"></div>
      </div>
    </div>
  </header>
);

// ============================================================================
// 2. DADOS E CONFIGURAÇÕES
// ============================================================================
const breakActivities = {
  physical: {
    title: 'Atividades Físicas',
    icon: '🏃',
    color: 'bg-blue-50',
    activities: [
      { id: 'stretch', name: 'Alongamento completo', points: 15, duration: '2-3 min', icon: '🧘' },
      { id: 'walk', name: 'Caminhada rápida', points: 20, duration: '3-5 min', icon: '🚶' },
      { id: 'jumping', name: '20 polichinelos', points: 25, duration: '1 min', icon: '🤸' },
      { id: 'neck', name: 'Rotação de pescoço e ombros', points: 10, duration: '1 min', icon: '🔄' },
      { id: 'squats', name: '10 agachamentos', points: 20, duration: '1 min', icon: '🦵' }
    ]
  },
  mental: {
    title: 'Relaxamento Mental',
    icon: '🧠',
    color: 'bg-purple-50',
    activities: [
      { id: 'breathe', name: 'Respiração 4-7-8', points: 15, duration: '2 min', icon: '🌬️' },
      { id: 'meditate', name: 'Meditação guiada', points: 20, duration: '3-5 min', icon: '🧘‍♀️' },
      { id: 'visualize', name: 'Visualização positiva', points: 15, duration: '2 min', icon: '🌈' },
      { id: 'gratitude', name: 'Listar 3 gratidões', points: 10, duration: '1 min', icon: '🙏' },
      { id: 'doodle', name: 'Desenho livre', points: 15, duration: '3 min', icon: '🎨' }
    ]
  },
  sensory: {
    title: 'Estímulo Sensorial',
    icon: '👁️',
    color: 'bg-green-50',
    activities: [
      { id: 'window', name: 'Olhar pela janela (foco distante)', points: 10, duration: '2 min', icon: '🪟' },
      { id: 'water', name: 'Beber água devagar', points: 10, duration: '1 min', icon: '💧' },
      { id: 'music', name: 'Ouvir música relaxante', points: 15, duration: '3 min', icon: '🎵' },
      { id: 'aromatherapy', name: 'Respirar aroma agradável', points: 10, duration: '1 min', icon: '🌸' },
      { id: 'massage', name: 'Auto-massagem nas mãos', points: 15, duration: '2 min', icon: '✋' }
    ]
  },
  productive: {
    title: 'Pausas Produtivas',
    icon: '📋',
    color: 'bg-yellow-50',
    activities: [
      { id: 'organize', name: 'Organizar mesa/área', points: 15, duration: '3 min', icon: '🗂️' },
      { id: 'plan', name: 'Revisar próximas tarefas', points: 10, duration: '2 min', icon: '📝' },
      { id: 'hydrate', name: 'Preparar chá ou café', points: 10, duration: '3 min', icon: '☕' },
      { id: 'snack', name: 'Lanche saudável', points: 10, duration: '3 min', icon: '🍎' },
      { id: 'tidy', name: 'Arrumar um item fora do lugar', points: 10, duration: '1 min', icon: '🧹' }
    ]
  }
};

const achievements = [
  { id: 'first_session', name: 'Primeira Sessão', description: 'Complete sua primeira sessão', icon: '🌟', points: 50 },
  { id: 'streak_3', name: 'Consistente', description: '3 dias seguidos', icon: '🔥', points: 100 },
  { id: 'streak_7', name: 'Semana Perfeita', description: '7 dias seguidos', icon: '💎', points: 200 },
  { id: 'early_bird', name: 'Madrugador', description: 'Sessão antes das 8h', icon: '🌅', points: 75 },
  { id: 'night_owl', name: 'Coruja Noturna', description: 'Sessão após 20h', icon: '🦉', points: 75 },
  { id: 'focused_50', name: 'Super Focado', description: '50 minutos de foco total', icon: '🎯', points: 150 },
  { id: 'variety', name: 'Explorador', description: 'Teste 10 pausas diferentes', icon: '🗺️', points: 100 },
  { id: 'perfect_day', name: 'Dia Perfeito', description: '4 sessões em um dia', icon: '⭐', points: 200 },
  { id: 'milestone_1000', name: 'Veterano', description: '1000 pontos totais', icon: '🏆', points: 300 }
];

const motivationalQuotes = [
  "Pequenas pausas, grandes resultados! 🌟",
  "Seu cérebro agradece este descanso! 🧠",
  "Foco e descanso: a dupla perfeita! 💪",
  "Cada pausa é um investimento em produtividade! 📈",
  "Você está construindo hábitos saudáveis! 🌱",
  "Descansar também é ser produtivo! ✨",
  "Mente descansada, foco renovado! 🔄",
  "Você está no controle do seu tempo! ⏰"
];

// ============================================================================
// 3. COMPONENTE PRINCIPAL "PAUSAS ESTRATÉGICAS TURBINADO"
// ============================================================================
export default function StrategicBreaksPage() {
  // Estados principais
  const [gameStarted, setGameStarted] = useState(false);
  const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(null);
  const [customSettings, setCustomSettings] = useState({ work: 25, break: 5, cycles: 4 });
  
  // Estados do jogo
  const [gameState, setGameState] = useState<'working' | 'break' | 'finished'>('working');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  
  // Sistema de pontos e conquistas
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  
  // Atividades e feedback
  const [currentBreakActivity, setCurrentBreakActivity] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('physical');
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [focusQuality, setFocusQuality] = useState(5);
  const [showStats, setShowStats] = useState(false);
  
  // Configurações
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentView, setCurrentView] = useState<'timer' | 'activities' | 'stats' | 'achievements'>('timer');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const levels = [
    { id: 0, label: 'Micro Foco', work: 10 * 60, break: 2 * 60, cycles: 6, icon: '⚡', description: 'Perfeito para TDAH - ciclos curtos e frequentes' },
    { id: 1, label: 'Foco Médio', work: 20 * 60, break: 4 * 60, cycles: 4, icon: '🎯', description: 'Equilíbrio ideal para a maioria das tarefas' },
    { id: 2, label: 'Pomodoro Clássico', work: 25 * 60, break: 5 * 60, cycles: 4, icon: '🍅', description: 'O método tradicional Pomodoro' },
    { id: 3, label: 'Foco Profundo', work: 45 * 60, break: 10 * 60, cycles: 3, icon: '🧘', description: 'Para trabalhos que exigem imersão total' },
    { id: 4, label: 'Personalizado', work: customSettings.work * 60, break: customSettings.break * 60, cycles: customSettings.cycles, icon: '⚙️', description: 'Configure seus próprios tempos' }
  ];
  
  const currentLevel = levels.find(l => l.id === nivelSelecionado) || levels[0];
  const totalDuration = gameState === 'working' ? currentLevel.work : currentLevel.break;

  // Efeito do timer
  useEffect(() => {
    if (!gameStarted || isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState !== 'finished') {
      handlePhaseComplete();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameState, isPaused, gameStarted]);

  // Função para completar fase
  const handlePhaseComplete = () => {
    if (gameState === 'working') {
      // Calcula pontos baseados na qualidade do foco
      const basePoints = 50;
      const qualityBonus = focusQuality * 5;
      const cycleBonus = currentCycle * 10;
      const earnedPoints = basePoints + qualityBonus + cycleBonus;
      
      setScore(prev => prev + earnedPoints);
      setTotalScore(prev => prev + earnedPoints);
      
      // Muda para pausa
      setGameState('break');
      setTimeLeft(currentLevel.break);
      selectRandomActivity();
      playSound('break');
      
      // Mostra quote motivacional
      const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      setMotivationalQuote(randomQuote);
      
    } else if (gameState === 'break') {
      if (currentCycle < currentLevel.cycles) {
        setCurrentCycle(prev => prev + 1);
        setGameState('working');
        setTimeLeft(currentLevel.work);
        playSound('work');
      } else {
        finishSession();
      }
    }
  };

  // Seleciona atividade aleatória
  const selectRandomActivity = () => {
    const category = breakActivities[selectedCategory as keyof typeof breakActivities];
    const availableActivities = category.activities.filter(a => !completedActivities.includes(a.id));
    const activities = availableActivities.length > 0 ? availableActivities : category.activities;
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    setCurrentBreakActivity(randomActivity);
  };

  // Completa atividade de pausa
  const completeBreakActivity = () => {
    if (currentBreakActivity) {
      setCompletedActivities(prev => [...prev, currentBreakActivity.id]);
      setScore(prev => prev + currentBreakActivity.points);
      setTotalScore(prev => prev + currentBreakActivity.points);
      
      // Verifica conquista de variedade
      if (completedActivities.length + 1 >= 10) {
        unlockAchievement('variety');
      }
    }
  };

  // Sistema de conquistas
  const unlockAchievement = (achievementId: string) => {
    if (!unlockedAchievements.includes(achievementId)) {
      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        setUnlockedAchievements(prev => [...prev, achievementId]);
        setScore(prev => prev + achievement.points);
        setTotalScore(prev => prev + achievement.points);
        // Aqui poderia adicionar uma notificação visual
      }
    }
  };

  // Finaliza sessão
  const finishSession = () => {
    setGameState('finished');
    
    // Salva no histórico
    const session = {
      date: new Date().toISOString(),
      level: currentLevel.label,
      cycles: currentLevel.cycles,
      score: score,
      focusTime: currentLevel.work * currentLevel.cycles / 60,
      breakTime: currentLevel.break * currentLevel.cycles / 60
    };
    setSessionHistory(prev => [...prev, session]);
    
    // Verifica conquistas
    checkAchievements();
    
    // Atualiza streak
    updateStreak();
  };

  // Verifica conquistas
  const checkAchievements = () => {
    // Primeira sessão
    if (sessionHistory.length === 0) {
      unlockAchievement('first_session');
    }
    
    // Conquistas de pontuação
    if (totalScore >= 1000) {
      unlockAchievement('milestone_1000');
    }
    
    // Conquistas de horário
    const hour = new Date().getHours();
    if (hour < 8) unlockAchievement('early_bird');
    if (hour >= 20) unlockAchievement('night_owl');
    
    // Foco prolongado
    if (currentLevel.work >= 50 * 60) {
      unlockAchievement('focused_50');
    }
  };

  // Atualiza streak
  const updateStreak = () => {
    // Simplificado - em produção seria mais complexo
    setStreak(prev => prev + 1);
    if (streak + 1 >= 3) unlockAchievement('streak_3');
    if (streak + 1 >= 7) unlockAchievement('streak_7');
  };

  // Toca som (simulado)
  const playSound = (type: 'work' | 'break' | 'complete') => {
    if (soundEnabled) {
      // Em produção, tocaria um som real
      console.log(`🔔 Som: ${type}`);
    }
  };

  // Inicia atividade
  const handleStartActivity = () => {
    if (nivelSelecionado === null) return;
    
    const level = levels.find(l => l.id === nivelSelecionado)!;
    setTimeLeft(level.work);
    setCurrentCycle(1);
    setScore(0);
    setIsPaused(false);
    setGameState('working');
    setGameStarted(true);
    setCompletedActivities([]);
    setFocusQuality(5);
    playSound('work');
  };

  // Formata tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calcula progresso
  const progressPercentage = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration * 100) : 0;

  // Calcula estatísticas
  const calculateStats = () => {
    const totalSessions = sessionHistory.length;
    const totalFocusMinutes = sessionHistory.reduce((acc, s) => acc + s.focusTime, 0);
    const totalBreakMinutes = sessionHistory.reduce((acc, s) => acc + s.breakTime, 0);
    const averageScore = totalSessions > 0 ? Math.round(totalScore / totalSessions) : 0;
    
    return {
      totalSessions,
      totalFocusMinutes,
      totalBreakMinutes,
      averageScore,
      totalScore,
      streak,
      achievementsUnlocked: unlockedAchievements.length,
      achievementsTotal: achievements.length
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <GameHeader title="Pausas Estratégicas" icon={<Coffee className="w-6 h-6 text-gray-700" />} />
      
      {!gameStarted ? (
        // ============================================================================
        // TELA INICIAL TURBINADA
        // ============================================================================
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            {/* Cards informativos */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-red-600" />
                    Objetivo
                  </h3>
                  <p className="text-sm text-gray-600">
                    Desenvolva foco sustentável alternando períodos de concentração intensa 
                    com pausas estratégicas que recarregam sua energia mental.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-blue-600" />
                    Benefícios
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Reduz fadiga mental</li>
                    <li>• Aumenta produtividade</li>
                    <li>• Melhora concentração</li>
                    <li>• Previne burnout</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-green-600" />
                    Gamificação
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ganhe pontos, desbloqueie conquistas, mantenha streaks e acompanhe 
                    seu progresso com estatísticas detalhadas!
                  </p>
                </div>
              </div>
            </div>

            {/* Seleção de modo */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                🎯 Escolha seu Modo de Foco
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {levels.slice(0, 4).map(level => (
                  <button
                    key={level.id}
                    onClick={() => setNivelSelecionado(level.id)}
                    className={`p-4 rounded-xl transition-all transform hover:scale-105 ${
                      nivelSelecionado === level.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                  >
                    <div className="text-3xl mb-2">{level.icon}</div>
                    <div className="font-bold text-lg">{level.label}</div>
                    <div className="text-sm opacity-90 mt-1">
                      {level.work/60}min foco / {level.break/60}min pausa
                    </div>
                    <div className="text-xs mt-2 opacity-75">
                      {level.cycles} ciclos • {level.description}
                    </div>
                  </button>
                ))}
                
                {/* Modo personalizado */}
                <button
                  onClick={() => setNivelSelecionado(4)}
                  className={`p-4 rounded-xl transition-all ${
                    nivelSelecionado === 4
                      ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-2">⚙️</div>
                  <div className="font-bold text-lg">Personalizado</div>
                  <div className="text-sm opacity-90 mt-1">Configure seu ritmo</div>
                  
                  {nivelSelecionado === 4 && (
                    <div className="mt-3 space-y-2 text-left">
                      <div className="flex items-center justify-between text-xs">
                        <span>Foco:</span>
                        <input
                          type="number"
                          value={customSettings.work}
                          onChange={(e) => setCustomSettings(prev => ({...prev, work: parseInt(e.target.value) || 25}))}
                          className="w-16 px-2 py-1 rounded border text-gray-800"
                          min="5"
                          max="90"
                        /> min
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Pausa:</span>
                        <input
                          type="number"
                          value={customSettings.break}
                          onChange={(e) => setCustomSettings(prev => ({...prev, break: parseInt(e.target.value) || 5}))}
                          className="w-16 px-2 py-1 rounded border text-gray-800"
                          min="1"
                          max="30"
                        /> min
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Ciclos:</span>
                        <input
                          type="number"
                          value={customSettings.cycles}
                          onChange={(e) => setCustomSettings(prev => ({...prev, cycles: parseInt(e.target.value) || 4}))}
                          className="w-16 px-2 py-1 rounded border text-gray-800"
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                  )}
                </button>
              </div>

              {/* Estatísticas resumidas */}
              {sessionHistory.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-around text-center">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{stats.totalSessions}</p>
                      <p className="text-xs text-gray-600">Sessões</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalFocusMinutes}</p>
                      <p className="text-xs text-gray-600">Min de Foco</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.streak}</p>
                      <p className="text-xs text-gray-600">Dias Seguidos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{stats.achievementsUnlocked}/{stats.achievementsTotal}</p>
                      <p className="text-xs text-gray-600">Conquistas</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botão iniciar */}
              <div className="text-center">
                <button
                  onClick={handleStartActivity}
                  disabled={nivelSelecionado === null}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                >
                  <Zap className="w-6 h-6" />
                  Iniciar Sessão de Foco
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        // ============================================================================
        // INTERFACE PRINCIPAL TURBINADA
        // ============================================================================
        <main className="p-4 sm:p-6 max-w-6xl mx-auto w-full">
          {/* Barra de status */}
          <div className="bg-white rounded-xl shadow-sm p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Sessão</p>
                  <p className="font-bold text-lg">{currentLevel.label}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Ciclo</p>
                  <p className="font-bold text-lg">{currentCycle}/{currentLevel.cycles}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Pontos</p>
                  <p className="font-bold text-lg text-blue-600">{score}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Streak</p>
                  <p className="font-bold text-lg text-orange-600">
                    <Flame className="inline w-4 h-4" /> {streak}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setCurrentView('stats')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentView('achievements')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Trophy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Área principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Timer principal */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              {gameState === 'finished' ? (
                // Tela de conclusão
                <div className="text-center">
                  <Sparkles className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Sessão Concluída!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Você completou {currentLevel.cycles} ciclos de foco com sucesso!
                  </p>
                  
                  {/* Resumo da sessão */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-3xl font-bold text-blue-600">{score}</p>
                        <p className="text-sm text-gray-600">Pontos Ganhos</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-purple-600">
                          {Math.round(currentLevel.work * currentLevel.cycles / 60)}min
                        </p>
                        <p className="text-sm text-gray-600">Tempo Focado</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-green-600">
                          {completedActivities.length}
                        </p>
                        <p className="text-sm text-gray-600">Pausas Ativas</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conquistas desbloqueadas */}
                  {unlockedAchievements.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-2">🏆 Conquistas Desbloqueadas</h3>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {unlockedAchievements.map(id => {
                          const achievement = achievements.find(a => a.id === id);
                          return achievement ? (
                            <div key={id} className="bg-yellow-50 px-3 py-2 rounded-lg">
                              <span className="text-2xl mr-1">{achievement.icon}</span>
                              <span className="text-sm font-medium">{achievement.name}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handleStartActivity}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    Nova Sessão
                  </button>
                </div>
              ) : (
                // Timer ativo
                <>
                  <div className="text-center mb-6">
                    {gameState === 'working' ? (
                      <>
                        <h2 className="text-2xl font-bold text-blue-800 mb-2 flex items-center justify-center gap-2">
                          <Target className="w-6 h-6" />
                          MODO FOCO
                        </h2>
                        <p className="text-gray-600">
                          Concentre-se completamente na sua tarefa
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-green-800 mb-2 flex items-center justify-center gap-2">
                          <Coffee className="w-6 h-6" />
                          PAUSA ATIVA
                        </h2>
                        <p className="text-gray-600">
                          Recarregue sua energia com esta atividade:
                        </p>
                      </>
                    )}
                  </div>

                  {/* Atividade de pausa */}
                  {gameState === 'break' && currentBreakActivity && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{currentBreakActivity.icon}</span>
                          <div>
                            <p className="font-bold text-lg text-gray-800">
                              {currentBreakActivity.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {currentBreakActivity.duration} • +{currentBreakActivity.points} pontos
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            completeBreakActivity();
                            selectRandomActivity();
                          }}
                          className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                          title="Trocar atividade"
                        >
                          <RotateCcw className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      
                      <button
                        onClick={completeBreakActivity}
                        className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        ✓ Completei a Atividade
                      </button>
                    </div>
                  )}

                  {/* Timer Circular Melhorado */}
                  <div className="relative w-56 h-56 mx-auto mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Círculo de fundo */}
                      <circle
                        cx="112"
                        cy="112"
                        r="100"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-gray-200"
                      />
                      {/* Círculo de progresso */}
                      <circle
                        cx="112"
                        cy="112"
                        r="100"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 100}`}
                        strokeDashoffset={`${2 * Math.PI * 100 * (1 - progressPercentage / 100)}`}
                        className="transition-all duration-1000 ease-linear"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={gameState === 'working' ? '#3B82F6' : '#10B981'} />
                          <stop offset="100%" stopColor={gameState === 'working' ? '#8B5CF6' : '#3B82F6'} />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold font-mono">
                        {formatTime(timeLeft)}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {Math.round(progressPercentage)}% completo
                      </div>
                    </div>
                  </div>

                  {/* Quote motivacional */}
                  {motivationalQuote && gameState === 'break' && (
                    <div className="text-center mb-4 text-gray-600 italic">
                      "{motivationalQuote}"
                    </div>
                  )}

                  {/* Controles */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                        isPaused
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      }`}
                    >
                      {isPaused ? <Play size={20} /> : <Pause size={20} />}
                      {isPaused ? 'Continuar' : 'Pausar'}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja encerrar a sessão?')) {
                          finishSession();
                        }
                      }}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all"
                    >
                      Encerrar
                    </button>
                  </div>

                  {/* Avaliação de foco (apenas no modo trabalho) */}
                  {gameState === 'working' && (
                    <div className="mt-6 bg-blue-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Como está seu foco? (afeta pontuação)
                      </p>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(level => (
                          <button
                            key={level}
                            onClick={() => setFocusQuality(level)}
                            className={`w-10 h-10 rounded-lg transition-all ${
                              focusQuality >= level
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Painel lateral */}
            <div className="space-y-4">
              {/* Seletor de categoria de pausas */}
              {gameState === 'break' && (
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Categorias de Pausas
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(breakActivities).map(([key, category]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedCategory(key);
                          selectRandomActivity();
                        }}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedCategory === key
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{category.icon}</span>
                          <span className="font-medium">{category.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mini estatísticas */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Sessão Atual
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tempo Focado:</span>
                    <span className="font-medium">
                      {Math.round((currentLevel.work * (currentCycle - 1) + (gameState === 'working' ? totalDuration - timeLeft : currentLevel.work)) / 60)}min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pausas Ativas:</span>
                    <span className="font-medium">{completedActivities.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pontos Ganhos:</span>
                    <span className="font-medium text-blue-600">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Qualidade Foco:</span>
                    <span className="font-medium">
                      {'⭐'.repeat(focusQuality)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Próximas conquistas */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Próximas Conquistas
                </h3>
                <div className="space-y-2">
                  {achievements
                    .filter(a => !unlockedAchievements.includes(a.id))
                    .slice(0, 3)
                    .map(achievement => (
                      <div key={achievement.id} className="flex items-center gap-2 text-sm">
                        <span className="text-xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-700">{achievement.name}</p>
                          <p className="text-xs text-gray-500">{achievement.description}</p>
                        </div>
                        <span className="text-xs font-bold text-purple-600">
                          +{achievement.points}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
