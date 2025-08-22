'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameHeader } from '@/components/GameHeader';
import { ListChecks, Trophy, Gamepad2, CheckCircle, XCircle, Plus, Trash2, Edit3, Save, Clock, Flag, RotateCcw, Play, Target, Award, Brain, BookOpen } from 'lucide-react';

// Interfaces
interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: number;
  category?: string;
  notes?: string;
}

interface Checklist {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  category: 'daily' | 'project' | 'travel' | 'health' | 'work' | 'custom';
  created: Date;
  completed: boolean;
  completionRate: number;
}

export default function ChecklistCreatorPage() {
  const router = useRouter();
  const [showActivity, setShowActivity] = useState(false);
  const [currentMode, setCurrentMode] = useState<'templates' | 'create' | 'manage'>('templates');
  const [score, setScore] = useState(0);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [currentChecklist, setCurrentChecklist] = useState<Checklist | null>(null);
  const [newItem, setNewItem] = useState<Partial<ChecklistItem>>({
    text: '',
    priority: 'medium',
    estimatedTime: 5
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Criar lista vazia quando entrar no modo create sem lista
  useEffect(() => {
    if (currentMode === 'create' && !currentChecklist) {
      createEmptyChecklist();
    }
  }, [currentMode]);

  const templates = [
    {
      title: "Rotina Matinal Produtiva",
      description: "Começar o dia com energia e foco",
      category: "daily" as const,
      items: [
        { text: "Acordar no horário planejado", priority: "high" as const, estimatedTime: 1 },
        { text: "Beber um copo de água", priority: "high" as const, estimatedTime: 2 },
        { text: "Fazer 5 min de alongamento", priority: "medium" as const, estimatedTime: 5 },
        { text: "Tomar banho", priority: "high" as const, estimatedTime: 15 },
        { text: "Vestir roupa do dia", priority: "high" as const, estimatedTime: 5 },
        { text: "Tomar café da manhã", priority: "high" as const, estimatedTime: 15 },
        { text: "Revisar agenda do dia", priority: "medium" as const, estimatedTime: 5 },
        { text: "Preparar materiais de trabalho", priority: "medium" as const, estimatedTime: 10 }
      ]
    },
    {
      title: "Preparação para Viagem",
      description: "Não esquecer nada importante",
      category: "travel" as const,
      items: [
        { text: "Verificar documentos (RG, passaporte)", priority: "high" as const, estimatedTime: 5 },
        { text: "Imprimir passagens/reservas", priority: "high" as const, estimatedTime: 10 },
        { text: "Separar roupas adequadas ao clima", priority: "medium" as const, estimatedTime: 30 },
        { text: "Embalar medicamentos", priority: "high" as const, estimatedTime: 5 },
        { text: "Carregar dispositivos eletrônicos", priority: "medium" as const, estimatedTime: 5 },
        { text: "Preparar kit de higiene", priority: "medium" as const, estimatedTime: 10 },
        { text: "Conferir peso da bagagem", priority: "low" as const, estimatedTime: 5 },
        { text: "Confirmar transporte para aeroporto", priority: "high" as const, estimatedTime: 5 }
      ]
    },
    {
      title: "Organização Semanal",
      description: "Manter tudo em ordem durante a semana",
      category: "work" as const,
      items: [
        { text: "Revisar metas da semana", priority: "high" as const, estimatedTime: 15 },
        { text: "Organizar mesa de trabalho", priority: "medium" as const, estimatedTime: 10 },
        { text: "Responder emails pendentes", priority: "high" as const, estimatedTime: 30 },
        { text: "Planejar refeições da semana", priority: "low" as const, estimatedTime: 20 },
        { text: "Agendar compromissos", priority: "high" as const, estimatedTime: 15 }
      ]
    }
  ];

  const categories = [
    { id: 'daily', name: 'Rotina Diária', color: 'bg-blue-500', icon: '🌅' },
    { id: 'project', name: 'Projetos', color: 'bg-green-500', icon: '📊' },
    { id: 'travel', name: 'Viagens', color: 'bg-purple-500', icon: '✈️' },
    { id: 'health', name: 'Saúde', color: 'bg-red-500', icon: '🏥' },
    { id: 'work', name: 'Trabalho', color: 'bg-orange-500', icon: '💼' },
    { id: 'custom', name: 'Personalizada', color: 'bg-gray-500', icon: '📝' }
  ];

  // Funções implementadas
  const createFromTemplate = (templateIndex: number) => {
    const template = templates[templateIndex];
    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: template.title,
      description: template.description,
      category: template.category,
      items: template.items.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        text: item.text,
        completed: false,
        priority: item.priority,
        estimatedTime: item.estimatedTime
      })),
      created: new Date(),
      completed: false,
      completionRate: 0
    };
    setCurrentChecklist(newChecklist);
    setChecklists(prev => [...prev, newChecklist]);
    setScore(prev => prev + 30);
    setCurrentMode('manage');
  };

  const createEmptyChecklist = () => {
    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: 'Nova Lista',
      description: '',
      category: 'custom',
      items: [],
      created: new Date(),
      completed: false,
      completionRate: 0
    };
    setCurrentChecklist(newChecklist);
    setCurrentMode('create');
  };

  const addItem = () => {
    if (!currentChecklist || !newItem.text?.trim()) return;

    const item: ChecklistItem = {
      id: `item-${Date.now()}`,
      text: newItem.text,
      completed: false,
      priority: newItem.priority || 'medium',
      estimatedTime: newItem.estimatedTime || 5
    };

    const updatedChecklist = {
      ...currentChecklist,
      items: [...currentChecklist.items, item]
    };

    setCurrentChecklist(updatedChecklist);
    setScore(prev => prev + 5);
    setNewItem({ text: '', priority: 'medium', estimatedTime: 5 });
  };

  const removeItem = (itemId: string) => {
    if (!currentChecklist) return;

    const updatedChecklist = {
      ...currentChecklist,
      items: currentChecklist.items.filter(item => item.id !== itemId)
    };

    setCurrentChecklist(updatedChecklist);
    updateCompletionRate(updatedChecklist);
  };

  const toggleItem = (itemId: string) => {
    if (!currentChecklist) return;

    const updatedItems = currentChecklist.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const updatedChecklist = {
      ...currentChecklist,
      items: updatedItems
    };

    setCurrentChecklist(updatedChecklist);
    updateCompletionRate(updatedChecklist);
    
    const item = updatedItems.find(i => i.id === itemId);
    if (item?.completed) {
      setScore(prev => prev + 10);
    }
  };

  const updateCompletionRate = (checklist: Checklist) => {
    if (checklist.items.length === 0) {
      checklist.completionRate = 0;
      return;
    }
    
    const completedCount = checklist.items.filter(item => item.completed).length;
    checklist.completionRate = Math.round((completedCount / checklist.items.length) * 100);
    checklist.completed = checklist.completionRate === 100;
  };

  const saveChecklist = () => {
    if (!currentChecklist) return;

    updateCompletionRate(currentChecklist);
    
    const existingIndex = checklists.findIndex(c => c.id === currentChecklist.id);
    
    if (existingIndex >= 0) {
      const updatedChecklists = [...checklists];
      updatedChecklists[existingIndex] = currentChecklist;
      setChecklists(updatedChecklists);
    } else {
      setChecklists(prev => [...prev, currentChecklist]);
    }
    
    setScore(prev => prev + 20);
    setCurrentMode('manage');
  };

  const duplicateChecklist = (checklist: Checklist) => {
    const duplicated: Checklist = {
      ...checklist,
      id: Date.now().toString(),
      title: `${checklist.title} (Cópia)`,
      created: new Date(),
      completed: false,
      items: checklist.items.map(item => ({
        ...item,
        id: `${Date.now()}-${Math.random()}`,
        completed: false
      })),
      completionRate: 0
    };
    
    setChecklists(prev => [...prev, duplicated]);
    setScore(prev => prev + 15);
  };

  const deleteChecklist = (checklistId: string) => {
    setChecklists(prev => prev.filter(c => c.id !== checklistId));
    if (currentChecklist?.id === checklistId) {
      setCurrentChecklist(null);
    }
  };

  const getStats = () => {
    const totalChecklists = checklists.length;
    const completedChecklists = checklists.filter(c => c.completed).length;
    const totalItems = checklists.reduce((acc, c) => acc + c.items.length, 0);
    const completedItems = checklists.reduce((acc, c) => 
      acc + c.items.filter(item => item.completed).length, 0
    );
    const averageCompletion = totalChecklists > 0
      ? Math.round(checklists.reduce((acc, c) => acc + c.completionRate, 0) / totalChecklists)
      : 0;

    return {
      totalChecklists,
      completedChecklists,
      totalItems,
      completedItems,
      averageCompletion
    };
  };

  const analyzeTaskBreakdown = (text: string): string => {
    const wordCount = text.split(' ').length;
    
    if (wordCount < 3) {
      return "💡 Tente ser mais específico. Ex: 'Organizar gaveta de documentos'";
    }
    if (wordCount > 10) {
      return "💡 Considere dividir em tarefas menores e mais simples";
    }
    if (!text.includes(' ')) {
      return "💡 Adicione mais detalhes para clareza";
    }
    if (text.startsWith('Fazer') || text.startsWith('Realizar')) {
      return "✅ Boa estrutura! Começar com verbo de ação é ótimo";
    }
    return "✅ Tarefa bem definida!";
  };

  const resetActivity = () => {
    setScore(0);
    setChecklists([]);
    setCurrentChecklist(null);
    setNewItem({ text: '', priority: 'medium', estimatedTime: 5 });
    setEditingItem(null);
    setCurrentMode('templates');
    setShowActivity(false);
  };

  const stats = getStats();

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[5];
  };

  // Tela inicial
  if (!showActivity) {
    return (
      <>
        <GameHeader title="Criador de Listas" icon={<ListChecks className="h-6 w-6" />} />
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:
                  </h3>
                  <p className="text-sm text-gray-600">
                    Aprender a quebrar tarefas complexas em passos simples, desenvolvendo habilidades de organização para reduzir a sobrecarga mental.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                    <Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Usar:
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Use templates prontos para rotinas comuns.</li>
                    <li>Crie suas próprias listas personalizadas.</li>
                    <li>Adicione, complete e gerencie suas tarefas.</li>
                    <li>Receba feedback para criar tarefas mais eficazes.</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Pontuação:</h3>
                  <p className="text-sm text-gray-600">
                    Ganhe pontos ao usar templates, criar listas, adicionar itens e, o mais importante, completar suas tarefas. Transforme a organização em um hábito!
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center pt-4">
              <button 
                onClick={() => setShowActivity(true)} 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg"
              >
                🚀 Começar Atividade
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Ferramenta principal
  return (
    <>
      <GameHeader title="Criador de Listas" icon={<ListChecks className="h-6 w-6" />} />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <main className="max-w-6xl mx-auto">
          <div className="flex items-center justify-end mb-4">
            <button 
              onClick={resetActivity} 
              className="flex items-center gap-2 px-4 py-2 bg-white text-sm text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <RotateCcw className="w-4 h-4" />
              Voltar e Reiniciar
            </button>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <h3 className="text-sm font-medium text-gray-500">Pontuação</h3>
              <p className="text-2xl font-bold text-emerald-600">{score}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <h3 className="text-sm font-medium text-gray-500">Listas</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.totalChecklists}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <h3 className="text-sm font-medium text-gray-500">Completas</h3>
              <p className="text-2xl font-bold text-green-600">{stats.completedChecklists}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <h3 className="text-sm font-medium text-gray-500">Itens</h3>
              <p className="text-2xl font-bold text-purple-600">{stats.totalItems}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <h3 className="text-sm font-medium text-gray-500">Taxa</h3>
              <p className="text-2xl font-bold text-orange-600">{stats.averageCompletion}%</p>
            </div>
          </div>

          {/* Área principal */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <div className="flex gap-4 mb-4 border-b pb-4">
              <button 
                onClick={() => setCurrentMode('templates')} 
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentMode === 'templates' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Templates
              </button>
              <button 
                onClick={() => {
                  // Sempre criar uma nova lista vazia ao clicar em "Criar Nova"
                  if (!currentChecklist || currentMode !== 'create') {
                    createEmptyChecklist();
                  } else {
                    setCurrentMode('create');
                  }
                }} 
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentMode === 'create' 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Criar Nova
              </button>
              <button 
                onClick={() => setCurrentMode('manage')} 
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentMode === 'manage' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Gerenciar ({checklists.length})
              </button>
            </div>
            
            {/* Modo Templates */}
            {currentMode === 'templates' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  📋 Templates Prontos para Usar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template, index) => {
                    const categoryInfo = getCategoryInfo(template.category);
                    return (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{template.title}</h3>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </div>
                          <span className="text-2xl">{categoryInfo.icon}</span>
                        </div>
                        <div className="mb-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs text-white ${categoryInfo.color}`}>
                            {categoryInfo.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {template.items.length} itens
                          </span>
                        </div>
                        <div className="space-y-1 mb-3 max-h-32 overflow-y-auto">
                          {template.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="text-xs text-gray-600 flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-2 ${
                                item.priority === 'high' ? 'bg-red-400' :
                                item.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                              }`}></span>
                              {item.text}
                            </div>
                          ))}
                          {template.items.length > 3 && (
                            <p className="text-xs text-gray-400">
                              +{template.items.length - 3} mais itens...
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => createFromTemplate(index)}
                          className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                          Usar Template
                        </button>
                      </div>
                    );
                  })}
                  
                  {/* Botão para criar lista vazia */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:border-teal-500 transition-colors">
                    <Plus className="w-12 h-12 text-gray-400 mb-2" />
                    <h3 className="font-semibold text-lg mb-2">Lista Personalizada</h3>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Crie sua própria lista do zero
                    </p>
                    <button
                      onClick={createEmptyChecklist}
                      className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Criar Nova Lista
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modo Criar/Editar */}
            {currentMode === 'create' && currentChecklist && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    ✏️ {currentChecklist.items.length > 0 ? 'Editar' : 'Criar'} Lista
                  </h2>
                  <button
                    onClick={saveChecklist}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Lista
                  </button>
                </div>

                    {/* Informações da lista */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Título da Lista
                        </label>
                        <input
                          type="text"
                          value={currentChecklist.title}
                          onChange={(e) => setCurrentChecklist({
                            ...currentChecklist,
                            title: e.target.value
                          })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Ex: Rotina Matinal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoria
                        </label>
                        <select
                          value={currentChecklist.category}
                          onChange={(e) => setCurrentChecklist({
                            ...currentChecklist,
                            category: e.target.value as Checklist['category']
                          })}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea
                        value={currentChecklist.description}
                        onChange={(e) => setCurrentChecklist({
                          ...currentChecklist,
                          description: e.target.value
                        })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        rows={2}
                        placeholder="Descreva o objetivo desta lista..."
                      />
                    </div>

                    {/* Adicionar novo item */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Adicionar Item</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            value={newItem.text || ''}
                            onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && addItem()}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Descrição da tarefa..."
                          />
                          {newItem.text && (
                            <p className="text-xs mt-1 text-gray-600">
                              {analyzeTaskBreakdown(newItem.text)}
                            </p>
                          )}
                        </div>
                        <div>
                          <select
                            value={newItem.priority}
                            onChange={(e) => setNewItem({ 
                              ...newItem, 
                              priority: e.target.value as ChecklistItem['priority']
                            })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="high">🔴 Alta</option>
                            <option value="medium">🟡 Média</option>
                            <option value="low">🟢 Baixa</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={newItem.estimatedTime || 5}
                            onChange={(e) => setNewItem({ 
                              ...newItem, 
                              estimatedTime: parseInt(e.target.value) || 5
                            })}
                            className="w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            min="1"
                            max="120"
                          />
                          <button
                            onClick={addItem}
                            className="flex-1 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Lista de itens */}
                    <div className="space-y-2">
                      <h3 className="font-semibold">
                        Itens da Lista ({currentChecklist.items.length})
                      </h3>
                      {currentChecklist.items.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          Nenhum item adicionado ainda. Comece adicionando tarefas acima!
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {currentChecklist.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-md transition-shadow"
                            >
                              <button
                                onClick={() => toggleItem(item.id)}
                                className="flex-shrink-0"
                              >
                                {item.completed ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                                )}
                              </button>
                              
                              {editingItem === item.id ? (
                                <input
                                  type="text"
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      const updatedItems = currentChecklist.items.map(i =>
                                        i.id === item.id ? { ...i, text: editingText } : i
                                      );
                                      setCurrentChecklist({
                                        ...currentChecklist,
                                        items: updatedItems
                                      });
                                      setEditingItem(null);
                                    }
                                  }}
                                  onBlur={() => setEditingItem(null)}
                                  className="flex-1 px-2 py-1 border rounded"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className={`flex-1 ${item.completed ? 'line-through text-gray-400' : ''}`}
                                  onClick={() => {
                                    setEditingItem(item.id);
                                    setEditingText(item.text);
                                  }}
                                >
                                  {item.text}
                                </span>
                              )}
                              
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                {item.priority === 'high' ? 'Alta' : 
                                 item.priority === 'medium' ? 'Média' : 'Baixa'}
                              </span>
                              
                              {item.estimatedTime && (
                                <span className="flex items-center text-xs text-gray-500">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {item.estimatedTime}min
                                </span>
                              )}
                              
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tempo total estimado */}
                    {currentChecklist.items.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-800">
                            Tempo Total Estimado:
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            {currentChecklist.items.reduce((acc, item) => 
                              acc + (item.estimatedTime || 0), 0
                            )} minutos
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Modo Gerenciar */}
            {currentMode === 'manage' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  📊 Suas Listas
                </h2>
                
                {checklists.length === 0 ? (
                  <div className="text-center py-12">
                    <ListChecks className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      Você ainda não criou nenhuma lista
                    </p>
                    <button
                      onClick={() => setCurrentMode('templates')}
                      className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Explorar Templates
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {checklists.map((checklist) => {
                      const categoryInfo = getCategoryInfo(checklist.category);
                      const completedCount = checklist.items.filter(i => i.completed).length;
                      
                      return (
                        <div
                          key={checklist.id}
                          className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg flex items-center">
                                {checklist.title}
                                {checklist.completed && (
                                  <Award className="w-5 h-5 text-green-500 ml-2" />
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">{checklist.description}</p>
                            </div>
                            <span className="text-2xl">{categoryInfo.icon}</span>
                          </div>
                          
                          <div className="mb-3 flex items-center gap-2">
                            <span className={`inline-block px-2 py-1 rounded text-xs text-white ${categoryInfo.color}`}>
                              {categoryInfo.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {completedCount}/{checklist.items.length} completos
                            </span>
                          </div>
                          
                          {/* Barra de progresso */}
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div
                              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${checklist.completionRate}%` }}
                            />
                          </div>
                          
                          {/* Preview dos itens */}
                          <div className="space-y-1 mb-3 max-h-24 overflow-y-auto">
                            {checklist.items.slice(0, 3).map((item) => (
                              <div key={item.id} className="text-xs flex items-center">
                                {item.completed ? (
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                ) : (
                                  <div className="w-3 h-3 border border-gray-300 rounded-full mr-2" />
                                )}
                                <span className={item.completed ? 'line-through text-gray-400' : 'text-gray-600'}>
                                  {item.text}
                                </span>
                              </div>
                            ))}
                            {checklist.items.length > 3 && (
                              <p className="text-xs text-gray-400">
                                +{checklist.items.length - 3} mais itens...
                              </p>
                            )}
                          </div>
                          
                          {/* Ações */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setCurrentChecklist(checklist);
                                setCurrentMode('create');
                              }}
                              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center"
                            >
                              <Edit3 className="w-4 h-4 mr-1" />
                              Editar
                            </button>
                            <button
                              onClick={() => duplicateChecklist(checklist)}
                              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                              title="Duplicar"
                            >
                              📋
                            </button>
                            <button
                              onClick={() => deleteChecklist(checklist.id)}
                              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
