'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Target, CheckCircle, Calendar, TrendingUp, Plus, Edit3, Trash2, Star, Lightbulb, Brain, ChevronLeft } from 'lucide-react';

// ============================================================================
// 1. STANDARD "GAMEHEADER" COMPONENT
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
// 2. MAIN "SMARTGOALS" ACTIVITY COMPONENT
// ============================================================================
export default function SmartGoalsPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);
  const [currentGoal, setCurrentGoal] = useState({
    title: '', specific: '', measurable: '', achievable: '', relevant: '', timebound: '',
    priority: 'medium', status: 'not-started', progress: 0, deadline: '', category: 'personal'
  });
  const [activeTab, setActiveTab] = useState('list');

  const priorities = {
    low: { label: 'Baixa', color: 'bg-green-100 text-green-800' },
    medium: { label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
    high: { label: 'Alta', color: 'bg-red-100 text-red-800' }
  };

  const categories = {
    personal: { label: 'Pessoal', icon: '👤' }, professional: { label: 'Profissional', icon: '💼' },
    health: { label: 'Saúde', icon: '🏃‍♂️' }, learning: { label: 'Aprendizado', icon: '📚' },
    financial: { label: 'Financeiro', icon: '💰' }
  };

  const handleInputChange = (field, value) => {
    setCurrentGoal(prev => ({ ...prev, [field]: value }));
  };

  const saveGoal = () => {
    const goalData = { ...currentGoal, id: editingGoal ? editingGoal.id : Date.now() };
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
      title: '', specific: '', measurable: '', achievable: '', relevant: '', timebound: '',
      priority: 'medium', status: 'not-started', progress: 0, deadline: '', category: 'personal'
    });
    setEditingGoal(null);
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
  
  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'completed').length,
    inProgress: goals.filter(g => g.status === 'in-progress').length,
    successRate: goals.length > 0 ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Metas SMART" icon={<Target className="w-6 h-6 text-gray-700" />} />
      
      {!gameStarted ? (
        // ============================================================================
        // 3. STANDARD INITIAL SCREEN
        // ============================================================================
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3><p className="text-sm text-gray-600">Aprender a definir objetivos claros e estruturados usando o método SMART para aumentar a chance de sucesso e combater a procrastinação.</p></div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Usar:</h3><ul className="list-disc list-inside text-sm text-gray-600 space-y-1"><li>Use o guia para entender cada critério SMART.</li><li>Crie suas próprias metas seguindo o formulário guiado.</li><li>Acompanhe e atualize o progresso de cada meta.</li></ul></div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3><p className="text-sm text-gray-600">O sucesso é medido pela criação de metas bem definidas e pelo progresso que você alcança. Cada meta concluída é uma grande vitória!</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Pronto para transformar seus sonhos em planos?</h2>
              <p className="text-gray-600 mb-6">Esta ferramenta irá guiá-lo para criar metas poderosas e alcançáveis.</p>
              <button onClick={() => setGameStarted(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">🚀 Iniciar Ferramenta de Metas</button>
            </div>
          </div>
        </main>
      ) : (
        // ============================================================================
        // 4. MAIN GOAL SETTING TOOL
        // ============================================================================
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4"><div className="bg-blue-100 p-3 rounded-lg"><Target className="w-6 h-6 text-blue-600"/></div><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-gray-500">Metas Totais</p></div></div>
            <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4"><div className="bg-green-100 p-3 rounded-lg"><CheckCircle className="w-6 h-6 text-green-600"/></div><div><p className="text-2xl font-bold">{stats.completed}</p><p className="text-sm text-gray-500">Concluídas</p></div></div>
            <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4"><div className="bg-orange-100 p-3 rounded-lg"><TrendingUp className="w-6 h-6 text-orange-600"/></div><div><p className="text-2xl font-bold">{stats.inProgress}</p><p className="text-sm text-gray-500">Em Progresso</p></div></div>
            <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4"><div className="bg-purple-100 p-3 rounded-lg"><Star className="w-6 h-6 text-purple-600"/></div><div><p className="text-2xl font-bold">{stats.successRate}%</p><p className="text-sm text-gray-500">Sucesso</p></div></div>
          </div>

          {/* Main Content Area with Tabs */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="flex border-b border-gray-200 px-4">
              {[{id: 'list', label: 'Minhas Metas', icon: Target}, {id: 'create', label: 'Nova Meta', icon: Plus}, {id: 'guide', label: 'Guia SMART', icon: Lightbulb}].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>
                  <tab.icon className="w-5 h-5"/><span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className="p-4 sm:p-6">
              {/* Tab: Goal List */}
              {activeTab === 'list' && (
                <div>
                  {goals.length === 0 ? (
                    <div className="text-center py-12"><Target className="w-16 h-16 text-gray-300 mx-auto mb-4"/><h3 className="text-lg font-semibold">Nenhuma meta criada.</h3><p className="text-gray-500">Clique em "Nova Meta" para começar.</p></div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {goals.map(goal => (
                        <div key={goal.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                          <div className="flex justify-between items-start">
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-semibold">{categories[goal.category].icon} {goal.title}</span>
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorities[goal.priority].color}`}>{priorities[goal.priority].label}</span>
                                  </div>
                                  <p className="text-xs text-gray-500">Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</p>
                              </div>
                              <div className="flex gap-1">
                                  <button onClick={() => editGoal(goal)} className="p-1.5 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded"><Edit3 size={14}/></button>
                                  <button onClick={() => deleteGoal(goal.id)} className="p-1.5 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded"><Trash2 size={14}/></button>
                              </div>
                          </div>
                          <div>
                              <div className="flex justify-between text-xs mb-1"><span className="font-medium">Progresso</span><span>{goal.progress}%</span></div>
                              <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{width: `${goal.progress}%`}}></div></div>
                              <input type="range" min="0" max="100" value={goal.progress} onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))} className="w-full mt-2"/>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Tab: Create/Edit Goal */}
              {activeTab === 'create' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">{editingGoal ? 'Editar Meta' : 'Criar Nova Meta'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Título da Meta (ex: Aprender a cozinhar)" value={currentGoal.title} onChange={e => handleInputChange('title', e.target.value)} className="p-2 border rounded-lg w-full"/>
                      <input type="date" value={currentGoal.deadline} onChange={e => handleInputChange('deadline', e.target.value)} className="p-2 border rounded-lg w-full"/>
                  </div>
                  {/* SMART fields */}
                  <div className="space-y-2">
                    {['specific', 'measurable', 'achievable', 'relevant', 'timebound'].map(field => (
                        <div key={field}>
                            <label className="font-semibold text-sm capitalize">{field}</label>
                            <textarea value={currentGoal[field]} onChange={e => handleInputChange(field, e.target.value)} className="w-full p-2 border rounded-lg mt-1" rows="2" placeholder={`Descreva o critério ${field}...`}></textarea>
                        </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-4">
                      <button onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Limpar</button>
                      <button onClick={saveGoal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar Meta</button>
                  </div>
                </div>
              )}
              
              {/* Tab: SMART Guide */}
              {activeTab === 'guide' && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-center">Guia Rápido de Metas SMART</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[{l:'S', w:'Específico'}, {l:'M', w:'Mensurável'}, {l:'A', w:'Atingível'}, {l:'R', w:'Relevante'}, {l:'T', w:'Temporal'}].map(item => (
                            <div key={item.l} className="bg-blue-50 p-4 rounded-lg text-center">
                                <p className="text-2xl font-bold text-blue-600">{item.l}</p>
                                <p className="font-semibold">{item.w}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-bold text-purple-800 flex items-center gap-2"><Brain size={18}/> Dica para TDAH</h4>
                        <p className="text-sm text-purple-700 mt-2">Divida sua meta em passos muito pequenos. Em vez de "limpar o quarto", comece com "arrumar a cama". Celebrar pequenas vitórias mantém a motivação em alta!</p>
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
