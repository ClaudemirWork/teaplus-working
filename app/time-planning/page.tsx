'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, Trash2, Save, Target, Brain, Edit3, User, Zap, Coffee, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE PADRÃO "GAMEHEADER"
// ============================================================================
const GameHeader = ({ title, icon }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <Link
          href="/dashboard"
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </Link>
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
// 2. INTERFACES E DADOS DA ATIVIDADE
// ============================================================================
interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: 'work' | 'personal' | 'health' | 'family' | 'learning' | 'rest' | 'routine';
  priority: 'high' | 'medium' | 'low';
  color: string;
  completed?: boolean;
}

interface DaySchedule {
  date: string;
  dayName: string;
  blocks: TimeBlock[];
}

interface WeekPlan {
  id: string;
  title: string;
  days: DaySchedule[];
  goals: string[];
  createdAt: Date;
}

interface Template {
  name: string;
  description: string;
  icon: string;
  defaultBlocks: Omit<TimeBlock, 'id' | 'color'>[];
}

const categories = [
  { id: 'work', name: 'Trabalho', color: '#3B82F6', icon: '💼' },
  { id: 'personal', name: 'Pessoal', color: '#10B981', icon: '🏠' },
  { id: 'health', name: 'Saúde', color: '#EF4444', icon: '🏃' },
  { id: 'family', name: 'Família', color: '#8B5CF6', icon: '👨‍👩‍👧‍👦' },
  { id: 'learning', name: 'Aprendizado', color: '#F59E0B', icon: '📚' },
  { id: 'rest', name: 'Descanso', color: '#6B7280', icon: '😴' },
  { id: 'routine', name: 'Rotina', color: '#EC4899', icon: '🔄' }
] as const;

const templates: Template[] = [
  {
    name: 'Profissional Equilibrado',
    description: 'Para quem trabalha em horário comercial e busca equilíbrio',
    icon: '💼',
    defaultBlocks: [
      { title: 'Rotina Matinal', startTime: '07:00', endTime: '08:30', category: 'routine', priority: 'high' },
      { title: 'Trabalho Focado', startTime: '09:00', endTime: '12:00', category: 'work', priority: 'high' },
      { title: 'Almoço e Descanso', startTime: '12:00', endTime: '13:00', category: 'health', priority: 'medium' },
      { title: 'Trabalho - Reuniões', startTime: '13:00', endTime: '17:00', category: 'work', priority: 'medium' },
      { title: 'Exercícios', startTime: '18:00', endTime: '19:00', category: 'health', priority: 'medium' },
      { title: 'Tempo em Família', startTime: '19:30', endTime: '21:00', category: 'family', priority: 'high' },
      { title: 'Rotina Noturna', startTime: '21:30', endTime: '22:30', category: 'routine', priority: 'low' }
    ]
  },
  {
    name: 'Estudante Dedicado',
    description: 'Focado em estudos e desenvolvimento pessoal',
    icon: '📚',
    defaultBlocks: [
      { title: 'Rotina Matinal', startTime: '07:00', endTime: '08:00', category: 'routine', priority: 'medium' },
      { title: 'Estudos - Foco Total', startTime: '08:00', endTime: '11:00', category: 'learning', priority: 'high' },
      { title: 'Intervalo Ativo', startTime: '11:00', endTime: '11:30', category: 'health', priority: 'medium' },
      { title: 'Almoço', startTime: '11:30', endTime: '12:30', category: 'health', priority: 'medium' },
      { title: 'Estudos - Revisão', startTime: '14:00', endTime: '17:00', category: 'learning', priority: 'high' },
      { title: 'Atividade Física', startTime: '17:30', endTime: '18:30', category: 'health', priority: 'medium' },
      { title: 'Tempo Livre', startTime: '19:00', endTime: '21:00', category: 'personal', priority: 'low' }
    ]
  },
  {
    name: 'Home Office Produtivo',
    description: 'Para quem trabalha de casa e precisa de estrutura',
    icon: '🏠',
    defaultBlocks: [
      { title: 'Preparação Mental', startTime: '07:30', endTime: '08:00', category: 'routine', priority: 'high' },
      { title: 'Deep Work', startTime: '08:00', endTime: '10:30', category: 'work', priority: 'high' },
      { title: 'Pausa Café', startTime: '10:30', endTime: '10:45', category: 'rest', priority: 'low' },
      { title: 'Reuniões/Calls', startTime: '10:45', endTime: '12:00', category: 'work', priority: 'medium' },
      { title: 'Almoço + Caminhada', startTime: '12:00', endTime: '13:30', category: 'health', priority: 'high' },
      { title: 'Trabalho Administrativo', startTime: '13:30', endTime: '16:00', category: 'work', priority: 'medium' },
      { title: 'Encerramento do Dia', startTime: '16:00', endTime: '17:00', category: 'work', priority: 'low' }
    ]
  }
];

// ============================================================================
// 3. COMPONENTE PRINCIPAL "PLANEJAMENTO DE TEMPO"
// ============================================================================
export default function PlanejamentoTempoPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<'templates' | 'daily' | 'weekly' | 'analysis'>('templates');
  const [weekPlans, setWeekPlans] = useState<WeekPlan[]>([]);
  const [currentWeek, setCurrentWeek] = useState<WeekPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  
  // Estado para novo bloco com valores iniciais
  const [newBlock, setNewBlock] = useState<Partial<Omit<TimeBlock, 'id' | 'color'>>>({
    title: '',
    startTime: '',
    endTime: '',
    category: 'personal',
    priority: 'medium'
  });

  const [weeklyGoals, setWeeklyGoals] = useState<string[]>(['', '', '']);

  const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  // Criar semana vazia
  const createEmptyWeek = (): WeekPlan => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    return {
      id: Date.now().toString(),
      title: `Semana de ${startOfWeek.toLocaleDateString('pt-BR')}`,
      days: daysOfWeek.map((dayName, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        return {
          date: date.toISOString().split('T')[0],
          dayName,
          blocks: []
        };
      }),
      goals: [],
      createdAt: new Date()
    };
  };

  // Aplicar template
  const applyTemplate = (template: Template) => {
    const newWeek = createEmptyWeek();
    
    // Aplicar template de segunda a sexta
    for (let dayIndex = 1; dayIndex <= 5; dayIndex++) {
      newWeek.days[dayIndex].blocks = template.defaultBlocks.map((block, i) => ({
        ...block,
        id: `${dayIndex}-${i}-${Date.now()}`,
        color: categories.find(c => c.id === block.category)?.color || '#6B7280',
        completed: false
      }));
    }
    
    setCurrentWeek(newWeek);
    setCurrentView('weekly');
    setScore(prev => prev + 50);
  };

  // Adicionar bloco de tempo - CORRIGIDO
  const addTimeBlock = () => {
    // Validações
    if (!currentWeek) {
      console.error('Sem semana atual');
      return;
    }
    
    if (!newBlock.title || !newBlock.startTime || !newBlock.endTime) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Criar novo bloco
    const block: TimeBlock = {
      id: `${selectedDay}-${Date.now()}-${Math.random()}`,
      title: newBlock.title,
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      category: newBlock.category || 'personal',
      priority: newBlock.priority || 'medium',
      color: categories.find(c => c.id === (newBlock.category || 'personal'))?.color || '#6B7280',
      completed: false
    };

    // Atualizar semana
    const updatedWeek = { ...currentWeek };
    
    // Garantir que o array de blocks existe
    if (!updatedWeek.days[selectedDay].blocks) {
      updatedWeek.days[selectedDay].blocks = [];
    }
    
    // Adicionar e ordenar
    updatedWeek.days[selectedDay].blocks.push(block);
    updatedWeek.days[selectedDay].blocks.sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    // Atualizar estado
    setCurrentWeek(updatedWeek);
    setScore(prev => prev + 10);
    
    // Limpar formulário
    setNewBlock({
      title: '',
      startTime: '',
      endTime: '',
      category: 'personal',
      priority: 'medium'
    });
  };

  // Remover bloco de tempo - CORRIGIDO
  const removeTimeBlock = (dayIndex: number, blockId: string) => {
    if (!currentWeek) return;
    
    const updatedWeek = { ...currentWeek };
    updatedWeek.days[dayIndex].blocks = updatedWeek.days[dayIndex].blocks.filter(b => b.id !== blockId);
    setCurrentWeek(updatedWeek);
    setScore(prev => Math.max(0, prev - 5));
  };

  // Toggle completar bloco
  const toggleBlockComplete = (dayIndex: number, blockId: string) => {
    if (!currentWeek) return;
    
    const updatedWeek = { ...currentWeek };
    const block = updatedWeek.days[dayIndex].blocks.find(b => b.id === blockId);
    if (block) {
      block.completed = !block.completed;
      setCurrentWeek(updatedWeek);
      setScore(prev => prev + (block.completed ? 5 : -5));
    }
  };

  // Salvar semana
  const saveWeekPlan = () => {
    if (!currentWeek) return;
    
    const updatedWeek = { ...currentWeek, goals: weeklyGoals.filter(g => g.trim()) };
    setWeekPlans(prev => [...prev, updatedWeek]);
    setScore(prev => prev + 100);
    alert('Planejamento salvo com sucesso!');
  };

  // Calcular estatísticas
  const calculateStats = () => {
    if (!currentWeek) return { totalBlocks: 0, completedBlocks: 0, hoursPlanned: 0 };
    
    let totalBlocks = 0;
    let completedBlocks = 0;
    let hoursPlanned = 0;

    currentWeek.days.forEach(day => {
      totalBlocks += day.blocks.length;
      completedBlocks += day.blocks.filter(b => b.completed).length;
      
      day.blocks.forEach(block => {
        const start = new Date(`2000-01-01T${block.startTime}`);
        const end = new Date(`2000-01-01T${block.endTime}`);
        const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        hoursPlanned += diff;
      });
    });

    return { totalBlocks, completedBlocks, hoursPlanned };
  };

  // Iniciar atividade
  const handleStartActivity = () => {
    if (nivelSelecionado === null) return;
    
    const newWeek = createEmptyWeek();
    setCurrentWeek(newWeek);
    
    if (nivelSelecionado === 0) {
      setCurrentView('templates');
    } else {
      setCurrentView('daily');
    }
    
    setGameStarted(true);
  };

  // Reset
  const resetActivity = () => {
    setGameStarted(false);
    setNivelSelecionado(null);
    setCurrentWeek(null);
    setScore(0);
    setCurrentView('templates');
    setNewBlock({
      title: '',
      startTime: '',
      endTime: '',
      category: 'personal',
      priority: 'medium'
    });
  };

  const stats = calculateStats();

  // RENDERIZAÇÃO DA INTERFACE
  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Planejamento de Tempo" icon={<Calendar className="w-6 h-6 text-gray-700" />} />
      
      {gameStarted && currentWeek ? (
        // FERRAMENTA DE PLANEJAMENTO
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {/* Barra de Status */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Pontuação</p>
                  <p className="text-2xl font-bold text-blue-600">{score}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Blocos</p>
                  <p className="text-lg font-semibold">{stats.totalBlocks}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Horas Planejadas</p>
                  <p className="text-lg font-semibold">{stats.hoursPlanned.toFixed(1)}h</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveWeekPlan}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Salvar Semana
                </button>
                <button
                  onClick={resetActivity}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Reiniciar
                </button>
              </div>
            </div>
          </div>

          {/* Área Principal */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
            {/* Abas */}
            <div className="flex border-b border-gray-200 pb-4 mb-4 overflow-x-auto">
              {['templates', 'daily', 'weekly', 'analysis'].map(view => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view as any)}
                  className={`px-4 py-2 text-sm rounded-lg font-semibold whitespace-nowrap transition-colors mr-2 ${
                    currentView === view 
                      ? 'bg-blue-600 text-white shadow' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {view === 'templates' && '🚀 Templates'}
                  {view === 'daily' && '📅 Visão Diária'}
                  {view === 'weekly' && '📊 Visão Semanal'}
                  {view === 'analysis' && '📈 Análise'}
                </button>
              ))}
            </div>

            {/* View: Templates */}
            {currentView === 'templates' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Escolha um Template para Começar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                      <div className="text-3xl mb-2">{template.icon}</div>
                      <h4 className="font-bold text-blue-700 mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="text-xs text-gray-500 mb-3">
                        {template.defaultBlocks.length} blocos de tempo
                      </div>
                      <button
                        onClick={() => applyTemplate(template)}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Usar Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View: Daily */}
            {currentView === 'daily' && (
              <div>
                {/* Seletor de Dias */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {daysOfWeek.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDay(index)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        selectedDay === index 
                          ? 'bg-purple-600 text-white shadow' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Formulário para Adicionar Bloco */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Plus size={20} className="mr-2" />
                    Adicionar Novo Bloco de Tempo
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Título *</label>
                      <input
                        type="text"
                        placeholder="Ex: Trabalho Focado"
                        value={newBlock.title || ''}
                        onChange={e => setNewBlock(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Início *</label>
                      <input
                        type="time"
                        value={newBlock.startTime || ''}
                        onChange={e => setNewBlock(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Fim *</label>
                      <input
                        type="time"
                        value={newBlock.endTime || ''}
                        onChange={e => setNewBlock(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Categoria</label>
                      <select
                        value={newBlock.category}
                        onChange={e => setNewBlock(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Prioridade</label>
                      <select
                        value={newBlock.priority}
                        onChange={e => setNewBlock(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="high">🔴 Alta</option>
                        <option value="medium">🟡 Média</option>
                        <option value="low">🟢 Baixa</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={addTimeBlock}
                        className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                      >
                        <Plus size={20} />
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de Blocos do Dia */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {daysOfWeek[selectedDay]} - {currentWeek.days[selectedDay].blocks.length} blocos
                  </h4>
                  
                  {currentWeek.days[selectedDay].blocks.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Nenhum bloco de tempo adicionado ainda</p>
                      <p className="text-sm text-gray-400 mt-1">Use o formulário acima para adicionar</p>
                    </div>
                  ) : (
                    currentWeek.days[selectedDay].blocks.map(block => (
                      <div
                        key={block.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow"
                        style={{ borderLeftColor: block.color }}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleBlockComplete(selectedDay, block.id)}
                            className="flex-shrink-0"
                          >
                            {block.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-green-500 transition-colors" />
                            )}
                          </button>
                          <div className={block.completed ? 'opacity-50' : ''}>
                            <p className="font-semibold text-gray-800">{block.title}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {block.startTime} - {block.endTime}
                              </span>
                              <span>{categories.find(c => c.id === block.category)?.icon}</span>
                              <span className={`
                                ${block.priority === 'high' ? 'text-red-500' : ''}
                                ${block.priority === 'medium' ? 'text-yellow-500' : ''}
                                ${block.priority === 'low' ? 'text-green-500' : ''}
                              `}>
                                {block.priority === 'high' && '●'} 
                                {block.priority === 'medium' && '●'} 
                                {block.priority === 'low' && '●'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeTimeBlock(selectedDay, block.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* View: Weekly */}
            {currentView === 'weekly' && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Visão Semanal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                  {currentWeek.days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`bg-gray-50 p-3 rounded-xl ${
                        dayIndex === 0 || dayIndex === 6 ? 'bg-orange-50' : ''
                      }`}
                    >
                      <h4 className="font-bold text-center text-sm border-b pb-2 mb-2">
                        {day.dayName}
                      </h4>
                      <div className="space-y-1 max-h-64 overflow-y-auto">
                        {day.blocks.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center py-4">Vazio</p>
                        ) : (
                          day.blocks.map(block => (
                            <div
                              key={block.id}
                              className={`p-2 rounded text-xs text-white ${
                                block.completed ? 'opacity-60' : ''
                              }`}
                              style={{ backgroundColor: block.color }}
                            >
                              <p className="font-semibold truncate">{block.title}</p>
                              <p className="text-xs opacity-90">
                                {block.startTime} - {block.endTime}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Metas Semanais */}
                <div className="mt-6 bg-yellow-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">🎯 Metas da Semana</h4>
                  <div className="space-y-2">
                    {[0, 1, 2].map(index => (
                      <input
                        key={index}
                        type="text"
                        placeholder={`Meta ${index + 1}...`}
                        value={weeklyGoals[index] || ''}
                        onChange={e => {
                          const newGoals = [...weeklyGoals];
                          newGoals[index] = e.target.value;
                          setWeeklyGoals(newGoals);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* View: Analysis */}
            {currentView === 'analysis' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Análise do Planejamento</h3>
                
                {/* Estatísticas por Categoria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border rounded-xl p-4">
                    <h4 className="font-semibold mb-3">Distribuição por Categoria</h4>
                    <div className="space-y-2">
                      {categories.map(cat => {
                        const count = currentWeek.days.reduce((acc, day) => 
                          acc + day.blocks.filter(b => b.category === cat.id).length, 0
                        );
                        const percentage = stats.totalBlocks > 0 
                          ? Math.round((count / stats.totalBlocks) * 100) 
                          : 0;
                        
                        return (
                          <div key={cat.id} className="flex items-center justify-between">
                            <span className="text-sm flex items-center gap-2">
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all"
                                  style={{ 
                                    width: `${percentage}%`,
                                    backgroundColor: cat.color 
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 w-10 text-right">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white border rounded-xl p-4">
                    <h4 className="font-semibold mb-3">Resumo Geral</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total de Blocos:</span>
                        <span className="font-semibold">{stats.totalBlocks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Blocos Completados:</span>
                        <span className="font-semibold text-green-600">{stats.completedBlocks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Horas Planejadas:</span>
                        <span className="font-semibold">{stats.hoursPlanned.toFixed(1)}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Taxa de Conclusão:</span>
                        <span className="font-semibold">
                          {stats.totalBlocks > 0 
                            ? Math.round((stats.completedBlocks / stats.totalBlocks) * 100) 
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dias mais ocupados */}
                <div className="bg-white border rounded-xl p-4">
                  <h4 className="font-semibold mb-3">📅 Distribuição por Dia</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {currentWeek.days.map((day, index) => (
                      <div key={index} className="text-center">
                        <p className="text-xs text-gray-600 mb-1">{day.dayName.slice(0, 3)}</p>
                        <div className="bg-gray-100 rounded-lg p-2">
                          <p className="text-lg font-bold text-blue-600">{day.blocks.length}</p>
                          <p className="text-xs text-gray-500">blocos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      ) : (
        // TELA INICIAL
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                  <p className="text-sm text-gray-600">
                    Aprender a criar cronogramas semanais e diários estruturados mas flexíveis, 
                    melhorando a organização e reduzindo a sobrecarga cognitiva.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Escolha começar com template ou do zero</li>
                    <li>Adicione blocos de tempo para cada dia</li>
                    <li>Organize sua semana visualmente</li>
                    <li>Acompanhe seu progresso</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Pontuação:</h3>
                  <p className="text-sm text-gray-600">
                    Ganhe pontos ao criar blocos, usar templates e completar tarefas. 
                    O objetivo é praticar a estruturação consciente do seu tempo.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Como você quer começar?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setNivelSelecionado(0)}
                  className={`p-4 rounded-lg font-medium transition-colors text-left ${
                    nivelSelecionado === 0 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">🚀</div>
                  <div className="text-sm font-bold">Início Rápido (com Templates)</div>
                  <div className="text-xs opacity-80">Use modelos prontos para acelerar</div>
                </button>
                <button
                  onClick={() => setNivelSelecionado(1)}
                  className={`p-4 rounded-lg font-medium transition-colors text-left ${
                    nivelSelecionado === 1 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">✏️</div>
                  <div className="text-sm font-bold">Começar do Zero</div>
                  <div className="text-xs opacity-80">Crie sua semana com total liberdade</div>
                </button>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={handleStartActivity}
                disabled={nivelSelecionado === null}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                🚀 Iniciar Atividade
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
