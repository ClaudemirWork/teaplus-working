'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Target, CheckCircle, Calendar, TrendingUp, Plus, Edit3, Trash2, Star, Lightbulb, Brain, ChevronLeft, Info, Award, Clock, Flag } from 'lucide-react';

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
// 2. DADOS E CONFIGURAÇÕES
// ============================================================================
const smartCriteria = {
  specific: {
    letter: 'S',
    title: 'Específico',
    english: 'Specific',
    description: 'Sua meta deve ser clara e detalhada',
    questions: [
      'O que exatamente você quer alcançar?',
      'Quem está envolvido?',
      'Onde isso acontecerá?'
    ],
    placeholder: 'Ex: Quero aprender a tocar 5 músicas no violão, praticando em casa...',
    icon: '🎯'
  },
  measurable: {
    letter: 'M',
    title: 'Mensurável',
    english: 'Measurable',
    description: 'Deve ser possível medir o progresso',
    questions: [
      'Como você saberá que alcançou a meta?',
      'Quais números ou indicadores usará?',
      'Qual é a quantidade específica?'
    ],
    placeholder: 'Ex: Praticar 30 minutos por dia, aprender 1 música por mês...',
    icon: '📊'
  },
  achievable: {
    letter: 'A',
    title: 'Atingível',
    english: 'Achievable',
    description: 'A meta deve ser realista e possível',
    questions: [
      'Você tem os recursos necessários?',
      'É realista com seu tempo disponível?',
      'Quais obstáculos pode encontrar?'
    ],
    placeholder: 'Ex: Tenho o violão e posso dedicar 30min diários após o trabalho...',
    icon: '💪'
  },
  relevant: {
    letter: 'R',
    title: 'Relevante',
    english: 'Relevant',
    description: 'Deve ser importante para sua vida',
    questions: [
      'Por que essa meta é importante para você?',
      'Como ela se conecta com seus valores?',
      'O que você ganha ao alcançá-la?'
    ],
    placeholder: 'Ex: Música me ajuda a relaxar e sempre quis aprender um instrumento...',
    icon: '⭐'
  },
  timebound: {
    letter: 'T',
    title: 'Temporal',
    english: 'Time-bound',
    description: 'Deve ter um prazo definido',
    questions: [
      'Quando você quer completar a meta?',
      'Quais são os marcos intermediários?',
      'Qual é o prazo final?'
    ],
    placeholder: 'Ex: Em 6 meses, com checkpoints mensais para avaliar progresso...',
    icon: '⏰'
  }
};

const priorities = {
  low: { label: 'Baixa', color: 'bg-green-100 text-green-800', icon: '🟢' },
  medium: { label: 'Média', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
  high: { label: 'Alta', color: 'bg-red-100 text-red-800', icon: '🔴' }
};

const categories = {
  personal: { label: 'Pessoal', icon: '👤', color: 'bg-blue-50' },
  professional: { label: 'Profissional', icon: '💼', color: 'bg-purple-50' },
  health: { label: 'Saúde', icon: '🏃‍♂️', color: 'bg-green-50' },
  learning: { label: 'Aprendizado', icon: '📚', color: 'bg-yellow-50' },
  financial: { label: 'Financeiro', icon: '💰', color: 'bg-orange-50' },
  relationships: { label: 'Relacionamentos', icon: '❤️', color: 'bg-pink-50' },
  hobby: { label: 'Hobby', icon: '🎨', color: 'bg-indigo-50' }
};

const exampleGoals = [
  {
    title: 'Aprender inglês básico',
    category: 'learning',
    specific: 'Quero aprender inglês suficiente para ter conversas básicas',
    measurable: 'Completar 3 módulos do curso e ter 5 conversas de 10 minutos',
    achievable: 'Tenho 1 hora livre por dia e acesso a apps de idiomas',
    relevant: 'Preciso para minha carreira e viagens futuras',
    timebound: '6 meses, com avaliações mensais'
  },
  {
    title: 'Economizar para emergências',
    category: 'financial',
    specific: 'Criar uma reserva de emergência de 3 meses de despesas',
    measurable: 'Guardar R$ 500 por mês até atingir R$ 6.000',
    achievable: 'Posso cortar gastos supérfluos e fazer renda extra',
    relevant: 'Quero ter segurança financeira e paz de espírito',
    timebound: '12 meses, com depósitos mensais'
  }
];

// ============================================================================
// 3. COMPONENTE PRINCIPAL "METAS SMART"
// ============================================================================
export default function SmartGoalsPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);
  const [currentGoal, setCurrentGoal] = useState({
    title: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timebound: '',
    priority: 'medium',
    status: 'not-started',
    progress: 0,
    deadline: '',
    category: 'personal',
    notes: '',
    milestones: []
  });
  const [activeTab, setActiveTab] = useState('list');
  const [showHelper, setShowHelper] = useState(false);
  const [currentCriterion, setCurrentCriterion] = useState('specific');

  const handleInputChange = (field, value) => {
    setCurrentGoal(prev => ({ ...prev, [field]: value }));
  };

  const validateGoal = () => {
    if (!currentGoal.title.trim()) {
      alert('Por favor, dê um título para sua meta');
      return false;
    }
    if (!currentGoal.deadline) {
      alert('Por favor, defina um prazo para sua meta');
      return false;
    }
    const requiredFields = ['specific', 'measurable', 'achievable', 'relevant', 'timebound'];
    const emptyFields = requiredFields.filter(field => !currentGoal[field].trim());
    
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(f => smartCriteria[f].title).join(', ');
      alert(`Por favor, preencha os campos: ${fieldNames}`);
      return false;
    }
    return true;
  };

  const saveGoal = () => {
    if (!validateGoal()) return;
    
    const goalData = {
      ...currentGoal,
      id: editingGoal ? editingGoal.id : Date.now(),
      createdAt: editingGoal ? editingGoal.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (editingGoal) {
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? goalData : g));
      setEditingGoal(null);
    } else {
      setGoals(prev => [...prev, goalData]);
    }
    
    resetForm();
    setActiveTab('list');
  };

  const resetForm = () => {
    setCurrentGoal({
      title: '',
      specific: '',
      measurable: '',
      achievable: '',
      relevant: '',
      timebound: '',
      priority: 'medium',
      status: 'not-started',
      progress: 0,
      deadline: '',
      category: 'personal',
      notes: '',
      milestones: []
    });
    setEditingGoal(null);
    setCurrentCriterion('specific');
  };

  const loadExample = (example) => {
    setCurrentGoal(prev => ({
      ...prev,
      ...example,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'medium',
      status: 'not-started',
      progress: 0
    }));
  };

  const editGoal = (goal) => {
    setCurrentGoal(goal);
    setEditingGoal(goal);
    setActiveTab('create');
  };

  const deleteGoal = (goalId) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      setGoals(prev => prev.filter(g => g.id !== goalId));
    }
  };

  const updateProgress = (goalId, newProgress) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const status = newProgress >= 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'not-started';
        return { ...goal, progress: newProgress, status };
      }
      return goal;
    }));
  };

  const getMotivationalMessage = (progress) => {
    if (progress === 0) return 'Toda jornada começa com o primeiro passo! 🚀';
    if (progress < 25) return 'Ótimo começo! Continue assim! 💪';
    if (progress < 50) return 'Você está no caminho certo! 🎯';
    if (progress < 75) return 'Mais da metade! Não desista agora! ⭐';
    if (progress < 100) return 'Quase lá! A vitória está próxima! 🏆';
    return 'Parabéns! Meta conquistada! 🎉';
  };
  
  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'completed').length,
    inProgress: goals.filter(g => g.status === 'in-progress').length,
    notStarted: goals.filter(g => g.status === 'not-started').length,
    successRate: goals.length > 0 ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Metas SMART" icon={<Target className="w-6 h-6 text-gray-700" />} />
      
      {!gameStarted ? (
        // ============================================================================
        // TELA INICIAL PADRÃO
        // ============================================================================
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                  <p className="text-sm text-gray-600">
                    Aprender a definir objetivos claros e estruturados usando o método SMART 
                    para aumentar suas chances de sucesso e combater a procrastinação.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Usar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Entenda cada critério SMART com explicações</li>
                    <li>Use exemplos prontos para se inspirar</li>
                    <li>Crie suas metas com formulário guiado</li>
                    <li>Acompanhe e celebre seu progresso</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Benefícios:</h3>
                  <p className="text-sm text-gray-600">
                    Metas bem definidas reduzem ansiedade, aumentam foco e motivação. 
                    Perfeito para quem tem TDAH ou dificuldade com organização!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  🚀 Transforme Sonhos em Conquistas!
                </h2>
                <p className="text-gray-600 mb-6">
                  O método SMART é usado por milhões de pessoas para alcançar objetivos. 
                  Hoje você aprenderá a usar essa poderosa ferramenta!
                </p>
                
                {/* Preview do método SMART */}
                <div className="flex justify-center gap-2 mb-6">
                  {Object.values(smartCriteria).map(criterion => (
                    <div key={criterion.letter} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-2xl mb-1">{criterion.icon}</div>
                      <div className="text-lg font-bold text-blue-600">{criterion.letter}</div>
                      <div className="text-xs text-gray-600">{criterion.title}</div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setGameStarted(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  🎯 Começar a Criar Metas
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        // ============================================================================
        // FERRAMENTA DE METAS
        // ============================================================================
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {/* Dashboard de Estatísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600"/>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600"/>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-gray-500">Concluídas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600"/>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-xs text-gray-500">Em Progresso</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600"/>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.notStarted}</p>
                  <p className="text-xs text-gray-500">Não Iniciadas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Award className="w-5 h-5 text-purple-600"/>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                  <p className="text-xs text-gray-500">Sucesso</p>
                </div>
              </div>
            </div>
          </div>

          {/* Área Principal com Abas */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="flex border-b border-gray-200 px-4 overflow-x-auto">
              {[
                {id: 'list', label: 'Minhas Metas', icon: Target},
                {id: 'create', label: editingGoal ? 'Editar Meta' : 'Nova Meta', icon: Plus},
                {id: 'guide', label: 'Guia SMART', icon: Lightbulb},
                {id: 'examples', label: 'Exemplos', icon: Brain}
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  <tab.icon className="w-5 h-5"/>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className="p-4 sm:p-6">
              {/* Aba: Lista de Metas */}
              {activeTab === 'list' && (
                <div>
                  {goals.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                      <h3 className="text-lg font-semibold text-gray-800">Nenhuma meta criada ainda</h3>
                      <p className="text-gray-500 mb-4">Que tal começar agora mesmo?</p>
                      <button
                        onClick={() => setActiveTab('create')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Criar Primeira Meta
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {goals.map(goal => {
                        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                        const isOverdue = daysLeft < 0;
                        
                        return (
                          <div key={goal.id} className={`${categories[goal.category].color} rounded-xl p-4 border border-gray-200`}>
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg">{categories[goal.category].icon}</span>
                                  <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                  <span className={`px-2 py-0.5 rounded-full font-medium ${priorities[goal.priority].color}`}>
                                    {priorities[goal.priority].icon} {priorities[goal.priority].label}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3"/>
                                    {isOverdue ? (
                                      <span className="text-red-600 font-medium">Atrasado {Math.abs(daysLeft)} dias</span>
                                    ) : (
                                      <span>{daysLeft} dias restantes</span>
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => editGoal(goal)}
                                  className="p-1.5 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded transition-colors"
                                >
                                  <Edit3 size={14}/>
                                </button>
                                <button
                                  onClick={() => deleteGoal(goal.id)}
                                  className="p-1.5 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                                >
                                  <Trash2 size={14}/>
                                </button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="font-medium text-gray-700">Progresso</span>
                                  <span className="font-bold text-gray-800">{goal.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{width: `${goal.progress}%`}}
                                  />
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={goal.progress}
                                  onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                />
                              </div>
                              
                              <p className="text-xs text-gray-600 italic text-center">
                                {getMotivationalMessage(goal.progress)}
                              </p>
                              
                              {goal.notes && (
                                <div className="bg-white/50 rounded p-2 text-xs text-gray-600">
                                  <span className="font-medium">Notas:</span> {goal.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              
              {/* Aba: Criar/Editar Meta */}
              {activeTab === 'create' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">
                      {editingGoal ? '✏️ Editar Meta' : '🎯 Criar Nova Meta'}
                    </h3>
                    <button
                      onClick={() => setShowHelper(!showHelper)}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                    >
                      <Info className="w-4 h-4"/>
                      {showHelper ? 'Ocultar' : 'Mostrar'} Ajuda
                    </button>
                  </div>
                  
                  {/* Informações Básicas */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Flag className="w-5 h-5 text-gray-600"/>
                      Informações Básicas
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Título da Meta *
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Aprender a tocar violão"
                          value={currentGoal.title}
                          onChange={e => handleInputChange('title', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prazo Final *
                        </label>
                        <input
                          type="date"
                          value={currentGoal.deadline}
                          onChange={e => handleInputChange('deadline', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoria
                        </label>
                        <select
                          value={currentGoal.category}
                          onChange={e => handleInputChange('category', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Object.entries(categories).map(([key, cat]) => (
                            <option key={key} value={key}>
                              {cat.icon} {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prioridade
                        </label>
                        <select
                          value={currentGoal.priority}
                          onChange={e => handleInputChange('priority', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Object.entries(priorities).map(([key, priority]) => (
                            <option key={key} value={key}>
                              {priority.icon} {priority.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas / Observações (opcional)
                      </label>
                      <textarea
                        value={currentGoal.notes}
                        onChange={e => handleInputChange('notes', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                        placeholder="Adicione detalhes extras, motivações, recursos necessários..."
                      />
                    </div>
                  </div>
                  
                  {/* Critérios SMART */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Target className="w-5 h-5 text-gray-600"/>
                      Critérios SMART
                    </h4>
                    
                    {/* Navegação pelos critérios */}
                    <div className="flex gap-2 justify-center">
                      {Object.entries(smartCriteria).map(([key, criterion]) => (
                        <button
                          key={key}
                          onClick={() => setCurrentCriterion(key)}
                          className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                            currentCriterion === key
                              ? 'bg-blue-100 text-blue-700 shadow-md transform scale-105'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          } ${currentGoal[key] ? 'ring-2 ring-green-500' : ''}`}
                        >
                          <span className="text-2xl mb-1">{criterion.icon}</span>
                          <span className="text-lg font-bold">{criterion.letter}</span>
                          <span className="text-xs">{criterion.title}</span>
                          {currentGoal[key] && (
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1"/>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    {/* Campo do critério atual */}
                    <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{smartCriteria[currentCriterion].icon}</span>
                        <div className="flex-1">
                          <h5 className="font-bold text-lg text-gray-800">
                            {smartCriteria[currentCriterion].letter} - {smartCriteria[currentCriterion].title}
                            <span className="text-sm text-gray-500 ml-2">
                              ({smartCriteria[currentCriterion].english})
                            </span>
                          </h5>
                          <p className="text-sm text-gray-600 mb-2">
                            {smartCriteria[currentCriterion].description}
                          </p>
                          
                          {showHelper && (
                            <div className="bg-white rounded-lg p-3 mb-3">
                              <p className="text-xs font-semibold text-gray-700 mb-2">
                                Perguntas para te ajudar:
                              </p>
                              <ul className="space-y-1">
                                {smartCriteria[currentCriterion].questions.map((question, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 flex items-start">
                                    <span className="text-blue-500 mr-1">•</span>
                                    {question}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <textarea
                            value={currentGoal[currentCriterion]}
                            onChange={e => handleInputChange(currentCriterion, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                            placeholder={smartCriteria[currentCriterion].placeholder}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botões de Ação */}
                  <div className="flex justify-between gap-4">
                    <button
                      onClick={resetForm}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Limpar
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab('examples')}
                        className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        Ver Exemplos
                      </button>
                      <button
                        onClick={saveGoal}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        {editingGoal ? 'Atualizar' : 'Salvar'} Meta
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Aba: Guia SMART */}
              {activeTab === 'guide' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-center text-gray-800">
                    📚 Guia Completo do Método SMART
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {Object.entries(smartCriteria).map(([key, criterion]) => (
                      <div key={key} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl text-center hover:shadow-lg transition-shadow">
                        <div className="text-3xl mb-2">{criterion.icon}</div>
                        <p className="text-2xl font-bold text-blue-600">{criterion.letter}</p>
                        <p className="font-semibold text-gray-800">{criterion.title}</p>
                        <p className="text-xs text-gray-500 italic">{criterion.english}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(smartCriteria).map(([key, criterion]) => (
                      <div key={key} className="bg-white rounded-xl p-5 border border-gray-200">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{criterion.icon}</div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-800 mb-2">
                              {criterion.letter} - {criterion.title} ({criterion.english})
                            </h4>
                            <p className="text-gray-600 mb-3">{criterion.description}</p>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm font-semibold text-gray-700 mb-2">
                                Perguntas-chave:
                              </p>
                              <ul className="space-y-1">
                                {criterion.questions.map((question, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                                    <span className="text-blue-500 mr-2">✓</span>
                                    {question}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                    <h4 className="font-bold text-purple-800 flex items-center gap-2 mb-3">
                      <Brain className="w-5 h-5"/>
                      Dicas Especiais para TDAH
                    </h4>
                    <div className="space-y-2 text-sm text-purple-700">
                      <p>• <strong>Divida em micro-metas:</strong> Transforme cada meta em passos muito pequenos e específicos</p>
                      <p>• <strong>Use lembretes visuais:</strong> Coloque post-its, alarmes e notificações para não esquecer</p>
                      <p>• <strong>Celebre pequenas vitórias:</strong> Cada progresso merece reconhecimento, por menor que seja</p>
                      <p>• <strong>Seja flexível:</strong> Se algo não funcionar, ajuste sem culpa. O importante é continuar</p>
                      <p>• <strong>Accountability partner:</strong> Compartilhe suas metas com alguém que possa te apoiar</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Aba: Exemplos */}
              {activeTab === 'examples' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-center text-gray-800">
                    💡 Exemplos de Metas SMART
                  </h3>
                  
                  <p className="text-center text-gray-600">
                    Clique em um exemplo para usá-lo como base para sua meta
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exampleGoals.map((example, idx) => (
                      <div key={idx} className={`${categories[example.category].color} rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer`}
                           onClick={() => {
                             loadExample(example);
                             setActiveTab('create');
                           }}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{categories[example.category].icon}</span>
                          <h4 className="font-bold text-gray-800">{example.title}</h4>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold text-gray-700">S - Específico:</span>
                            <p className="text-gray-600">{example.specific}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">M - Mensurável:</span>
                            <p className="text-gray-600">{example.measurable}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">A - Atingível:</span>
                            <p className="text-gray-600">{example.achievable}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">R - Relevante:</span>
                            <p className="text-gray-600">{example.relevant}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">T - Temporal:</span>
                            <p className="text-gray-600">{example.timebound}</p>
                          </div>
                        </div>
                        
                        <button className="mt-4 w-full bg-white/50 hover:bg-white text-gray-700 py-2 rounded-lg transition-colors text-sm font-medium">
                          Usar Este Exemplo
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 Dica:</strong> Use estes exemplos como inspiração, mas personalize cada meta 
                      para sua realidade e necessidades específicas. Uma meta pessoal sempre terá mais significado!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
