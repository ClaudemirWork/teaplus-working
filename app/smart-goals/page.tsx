'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Target, CheckCircle, Calendar, TrendingUp, AlertTriangle, Plus, Edit3, Trash2, Star, ArrowLeft, Lightbulb, Users, Brain } from 'lucide-react';

export default function SmartGoals() {
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
    category: 'personal'
  });

  const [activeTab, setActiveTab] = useState('create');

  const priorities = {
    low: { label: 'Baixa', color: 'bg-green-100 text-green-800', icon: '📌' },
    medium: { label: 'Média', color: 'bg-yellow-100 text-yellow-800', icon: '⚡' },
    high: { label: 'Alta', color: 'bg-red-100 text-red-800', icon: '🔥' }
  };

  const statuses = {
    'not-started': { label: 'Não Iniciada', color: 'bg-gray-100 text-gray-800' },
    'in-progress': { label: 'Em Progresso', color: 'bg-blue-100 text-blue-800' },
    'completed': { label: 'Concluída', color: 'bg-green-100 text-green-800' },
    'paused': { label: 'Pausada', color: 'bg-yellow-100 text-yellow-800' }
  };

  const categories = {
    personal: { label: 'Pessoal', color: 'bg-purple-100 text-purple-800', icon: '👤' },
    professional: { label: 'Profissional', color: 'bg-blue-100 text-blue-800', icon: '💼' },
    health: { label: 'Saúde', color: 'bg-green-100 text-green-800', icon: '🏃‍♂️' },
    learning: { label: 'Aprendizado', color: 'bg-orange-100 text-orange-800', icon: '📚' },
    financial: { label: 'Financeiro', color: 'bg-emerald-100 text-emerald-800', icon: '💰' }
  };

  const handleInputChange = (field, value) => {
    setCurrentGoal(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateSmartGoal = () => {
    const { title, specific, measurable, achievable, relevant, timebound, deadline } = currentGoal;
    return title && specific && measurable && achievable && relevant && timebound && deadline;
  };

  const saveGoal = () => {
    if (!validateSmartGoal()) {
      alert('Por favor, preencha todos os campos SMART');
      return;
    }

    const goalData = {
      ...currentGoal,
      id: editingGoal ? editingGoal.id : Date.now(),
      createdAt: editingGoal ? editingGoal.createdAt : new Date(),
      updatedAt: new Date()
    };

    if (editingGoal) {
      setGoals(prev => prev.map(goal => goal.id === editingGoal.id ? goalData : goal));
      setEditingGoal(null);
    } else {
      setGoals(prev => [...prev, goalData]);
    }

    resetForm();
    setShowForm(false);
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
      category: 'personal'
    });
  };

  const editGoal = (goal) => {
    setCurrentGoal(goal);
    setEditingGoal(goal);
    setShowForm(true);
    setActiveTab('create');
  };

  const deleteGoal = (goalId) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    }
  };

  const updateProgress = (goalId, newProgress) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const status = newProgress === 100 ? 'completed' : 'in-progress';
        return { ...goal, progress: newProgress, status, updatedAt: new Date() };
      }
      return goal;
    }));
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressStats = () => {
    const total = goals.length;
    const completed = goals.filter(g => g.status === 'completed').length;
    const inProgress = goals.filter(g => g.status === 'in-progress').length;
    const notStarted = goals.filter(g => g.status === 'not-started').length;
    
    return { total, completed, inProgress, notStarted };
  };

  const stats = getProgressStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.push('/tdah')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar ao TDAH</span>
          </button>
        </div>

        {/* Main Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.push('/tdah')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Metas SMART</h1>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Objetivo */}
          <div className="bg-white rounded-xl p-6 border-l-4 border-orange-500 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Objetivo:</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Desenvolver habilidades de definição de objetivos específicos, mensuráveis, atingíveis, relevantes e temporais. 
              Criar metas estruturadas que aumentem a probabilidade de sucesso e reduzam a procrastinação comum no TDAH.
            </p>
          </div>

          {/* Pontuação */}
          <div className="bg-white rounded-xl p-6 border-l-4 border-yellow-500 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Pontuação:</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Ganhe pontos criando metas bem estruturadas, atingindo marcos intermediários e completando objetivos. 
              Cada meta SMART finalizada desenvolve disciplina e autoconfiança progressivamente.
            </p>
          </div>

          {/* Atividades */}
          <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Atividades:</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Definição de Metas</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Estruturação</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Acompanhamento de Progresso</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Monitoramento</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Revisão e Ajustes</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">Flexibilidade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Base Científica */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Base Científica:</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Pessoas com TDAH frequentemente têm dificuldades com funções executivas, incluindo planejamento e definição de objetivos. 
            A metodologia SMART fornece uma estrutura clara que compensa essas dificuldades, oferecendo diretrizes específicas que 
            melhoram o foco, reduzem a sobrecarga cognitiva e aumentam a motivação através de marcos tangíveis e alcançáveis.
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-gray-600">Total de Metas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
                <p className="text-gray-600">Concluídas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.inProgress}</p>
                <p className="text-gray-600">Em Progresso</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </p>
                <p className="text-gray-600">Taxa de Sucesso</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b">
            {[
              { id: 'create', label: 'Criar Meta', icon: Plus },
              { id: 'list', label: 'Minhas Metas', icon: Target },
              { id: 'guide', label: 'Guia SMART', icon: Star }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Create/Edit Goal Tab */}
            {activeTab === 'create' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingGoal ? 'Editar Meta' : 'Nova Meta SMART'}
                  </h2>
                  {editingGoal && (
                    <button
                      onClick={() => {
                        setEditingGoal(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancelar Edição
                    </button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Meta
                    </label>
                    <input
                      type="text"
                      value={currentGoal.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Ler 24 livros este ano"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={currentGoal.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(categories).map(([key, cat]) => (
                        <option key={key} value={key}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SMART Criteria */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Critérios SMART
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Specific */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-blue-600 font-bold">S</span>pecífico - O que exatamente você quer alcançar?
                      </label>
                      <textarea
                        value={currentGoal.specific}
                        onChange={(e) => handleInputChange('specific', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                        placeholder="Descreva de forma clara e específica o que você quer alcançar..."
                      />
                    </div>

                    {/* Measurable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-blue-600 font-bold">M</span>ensurável - Como você vai medir o progresso?
                      </label>
                      <textarea
                        value={currentGoal.measurable}
                        onChange={(e) => handleInputChange('measurable', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                        placeholder="Defina métricas e indicadores que podem ser quantificados..."
                      />
                    </div>

                    {/* Achievable */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-blue-600 font-bold">A</span>tingível - A meta é realista com seus recursos?
                      </label>
                      <textarea
                        value={currentGoal.achievable}
                        onChange={(e) => handleInputChange('achievable', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                        placeholder="Explique por que esta meta é realizável considerando seus recursos..."
                      />
                    </div>

                    {/* Relevant */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-blue-600 font-bold">R</span>elevante - Por que esta meta é importante?
                      </label>
                      <textarea
                        value={currentGoal.relevant}
                        onChange={(e) => handleInputChange('relevant', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                        placeholder="Descreva como esta meta se alinha com seus objetivos maiores..."
                      />
                    </div>

                    {/* Time-bound */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="text-blue-600 font-bold">T</span>emporal - Qual é o prazo para conclusão?
                      </label>
                      <textarea
                        value={currentGoal.timebound}
                        onChange={(e) => handleInputChange('timebound', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="2"
                        placeholder="Estabeleça prazos específicos e marcos intermediários..."
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={currentGoal.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(priorities).map(([key, priority]) => (
                        <option key={key} value={key}>
                          {priority.icon} {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Limite
                    </label>
                    <input
                      type="date"
                      value={currentGoal.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={currentGoal.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(statuses).map(([key, status]) => (
                        <option key={key} value={key}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={saveGoal}
                    disabled={!validateSmartGoal()}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {editingGoal ? 'Atualizar Meta' : 'Salvar Meta'}
                  </button>
                </div>
              </div>
            )}

            {/* Goals List Tab */}
            {activeTab === 'list' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Minhas Metas</h2>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Nova Meta
                  </button>
                </div>

                {goals.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Nenhuma meta criada ainda
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Comece criando sua primeira meta SMART
                    </p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Criar Primeira Meta
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {goals.map(goal => {
                      const daysLeft = getDaysUntilDeadline(goal.deadline);
                      const isOverdue = daysLeft < 0;
                      const isUrgent = daysLeft <= 7 && daysLeft >= 0;

                      return (
                        <div key={goal.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          {/* Goal Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categories[goal.category].color}`}>
                                  {categories[goal.category].icon} {categories[goal.category].label}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorities[goal.priority].color}`}>
                                  {priorities[goal.priority].icon} {priorities[goal.priority].label}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                {goal.title}
                              </h3>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statuses[goal.status].color}`}>
                                {statuses[goal.status].label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => editGoal(goal)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteGoal(goal.id)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Progresso</span>
                              <span className="text-sm text-gray-600">{goal.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={goal.progress}
                                onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                                className="flex-1"
                              />
                            </div>
                          </div>

                          {/* Deadline Info */}
                          <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                            </span>
                            {isOverdue && (
                              <span className="text-xs text-red-600 font-medium">
                                (Atrasada)
                              </span>
                            )}
                            {isUrgent && !isOverdue && (
                              <span className="text-xs text-orange-600 font-medium">
                                (Urgente)
                              </span>
                            )}
                          </div>

                          {/* SMART Summary */}
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-blue-600">Específico:</span>
                              <p className="text-gray-600 mt-1">{goal.specific}</p>
                            </div>
                            <div>
                              <span className="font-medium text-blue-600">Mensurável:</span>
                              <p className="text-gray-600 mt-1">{goal.measurable}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SMART Guide Tab */}
            {activeTab === 'guide' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Guia Completo de Metas SMART
                  </h2>
                  <p className="text-gray-600">
                    Aprenda a criar objetivos eficazes especialmente para quem tem TDAH
                  </p>
                </div>

                {/* SMART Framework */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">O que são Metas SMART?</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[
                      {
                        letter: 'S',
                        word: 'Específico',
                        description: 'Clara e bem definida',
                        example: 'Ler 2 livros por mês',
                        color: 'bg-red-100 text-red-800'
                      },
                      {
                        letter: 'M',
                        word: 'Mensurável',
                        description: 'Pode ser quantificada',
                        example: '24 livros em 12 meses',
                        color: 'bg-orange-100 text-orange-800'
                      },
                      {
                        letter: 'A',
                        word: 'Atingível',
                        description: 'Realista e possível',
                        example: 'Considerando tempo disponível',
                        color: 'bg-yellow-100 text-yellow-800'
                      },
                      {
                        letter: 'R',
                        word: 'Relevante',
                        description: 'Importante para você',
                        example: 'Melhora conhecimento profissional',
                        color: 'bg-green-100 text-green-800'
                      },
                      {
                        letter: 'T',
                        word: 'Temporal',
                        description: 'Com prazo definido',
                        example: 'Até dezembro de 2025',
                        color: 'bg-blue-100 text-blue-800'
                      }
                    ].map((item, index) => (
                      <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                        <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mb-4`}>
                          <span className="text-2xl font-bold">{item.letter}</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          {item.word}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {item.description}
                        </p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-700 font-medium">Exemplo:</p>
                          <p className="text-xs text-gray-600">{item.example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TDAH Specific Tips */}
                <div className="bg-purple-50 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    🧠 Dicas Especiais para TDAH
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-purple-800">✅ Faça</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Divida em micro-metas</p>
                            <p className="text-sm text-gray-600">Crie etapas menores e mais gerenciáveis</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Use lembretes visuais</p>
                            <p className="text-sm text-gray-600">Calendários, post-its e notificações</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Celebre pequenas vitórias</p>
                            <p className="text-sm text-gray-600">Reconheça cada progresso feito</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Tenha flexibilidade</p>
                            <p className="text-sm text-gray-600">Ajuste prazos quando necessário</p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-red-800">❌ Evite</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Metas muito ambiciosas</p>
                            <p className="text-sm text-gray-600">Podem gerar frustração e desistência</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Muitas metas simultâneas</p>
                            <p className="text-sm text-gray-600">Foco em 1-3 objetivos principais</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Prazos muito rígidos</p>
                            <p className="text-sm text-gray-600">Deixe margem para imprevistos</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Autocrítica excessiva</p>
                            <p className="text-sm text-gray-600">Seja gentil consigo mesmo</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Examples */}
                <div className="bg-green-50 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    📝 Exemplos de Metas SMART para TDAH
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-4">📚 Meta de Aprendizado</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-blue-600">S:</span>
                          <span className="text-gray-700"> Completar curso online de Python</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">M:</span>
                          <span className="text-gray-700"> 2 módulos por semana, 16 módulos total</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">A:</span>
                          <span className="text-gray-700"> 1 hora por dia, 3x na semana</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">R:</span>
                          <span className="text-gray-700"> Melhorar habilidades profissionais</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">T:</span>
                          <span className="text-gray-700"> Em 8 semanas (2 meses)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="font-semibold text-gray-800 mb-4">🏃‍♂️ Meta de Saúde</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-blue-600">S:</span>
                          <span className="text-gray-700"> Caminhar regularmente no parque</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">M:</span>
                          <span className="text-gray-700"> 30 minutos, 3x por semana</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">A:</span>
                          <span className="text-gray-700"> Horário livre após trabalho</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">R:</span>
                          <span className="text-gray-700"> Melhorar condicionamento e humor</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-600">T:</span>
                          <span className="text-gray-700"> Criar hábito em 21 dias</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Steps */}
                <div className="bg-blue-50 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    🚀 Como Começar Agora
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        1
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Escolha UMA área</h4>
                      <p className="text-sm text-gray-600">
                        Foque em apenas um aspecto da sua vida para começar
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        2
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Defina o SMART</h4>
                      <p className="text-sm text-gray-600">
                        Use nosso formulário para estruturar sua meta
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        3
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Acompanhe diariamente</h4>
                      <p className="text-sm text-gray-600">
                        Revise seu progresso e ajuste quando necessário
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setActiveTab('create')}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                    >
                      Criar Minha Primeira Meta SMART
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}