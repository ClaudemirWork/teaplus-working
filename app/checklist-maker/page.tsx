'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Target, Award, Brain, BookOpen, Trophy, RotateCcw, CheckCircle, XCircle, Plus, Trash2, Edit3, Save, Clock, Flag, List } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  estimatedTime?: number // minutos
  category?: string
  notes?: string
}

interface Checklist {
  id: string
  title: string
  description: string
  items: ChecklistItem[]
  category: 'daily' | 'project' | 'travel' | 'health' | 'work' | 'custom'
  created: Date
  completed: boolean
  completionRate: number
}

export default function ListaVerificacao() {
  const router = useRouter()
  const [showActivity, setShowActivity] = useState(false)
  const [currentMode, setCurrentMode] = useState<'templates' | 'create' | 'manage'>('templates')
  const [score, setScore] = useState(0)
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [currentChecklist, setCurrentChecklist] = useState<Checklist | null>(null)
  const [newItem, setNewItem] = useState<Partial<ChecklistItem>>({})
  const [editingItem, setEditingItem] = useState<string | null>(null)

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
      title: "Entrega de Projeto",
      description: "Finalizar projeto com qualidade",
      category: "project" as const,
      items: [
        { text: "Revisar todos os requisitos", priority: "high" as const, estimatedTime: 30 },
        { text: "Verificar qualidade do trabalho", priority: "high" as const, estimatedTime: 45 },
        { text: "Fazer testes finais", priority: "high" as const, estimatedTime: 60 },
        { text: "Criar documentação", priority: "medium" as const, estimatedTime: 90 },
        { text: "Preparar apresentação", priority: "medium" as const, estimatedTime: 60 },
        { text: "Fazer backup dos arquivos", priority: "high" as const, estimatedTime: 10 },
        { text: "Enviar para aprovação", priority: "high" as const, estimatedTime: 5 },
        { text: "Agendar reunião de entrega", priority: "medium" as const, estimatedTime: 10 }
      ]
    },
    {
      title: "Preparação para Exame Médico",
      description: "Consulta médica organizada",
      category: "health" as const,
      items: [
        { text: "Confirmar horário da consulta", priority: "high" as const, estimatedTime: 2 },
        { text: "Separar documentos (cartão SUS, convênio)", priority: "high" as const, estimatedTime: 5 },
        { text: "Listar sintomas e dúvidas", priority: "medium" as const, estimatedTime: 15 },
        { text: "Reunir exames anteriores", priority: "medium" as const, estimatedTime: 10 },
        { text: "Anotar medicamentos em uso", priority: "high" as const, estimatedTime: 5 },
        { text: "Verificar jejum (se necessário)", priority: "high" as const, estimatedTime: 1 },
        { text: "Planejar transporte", priority: "medium" as const, estimatedTime: 5 },
        { text: "Chegar 15 min antes", priority: "medium" as const, estimatedTime: 15 }
      ]
    }
  ]

  const categories = [
    { id: 'daily', name: 'Rotina Diária', color: 'bg-blue-500', icon: '🌅' },
    { id: 'project', name: 'Projetos', color: 'bg-green-500', icon: '📊' },
    { id: 'travel', name: 'Viagens', color: 'bg-purple-500', icon: '✈️' },
    { id: 'health', name: 'Saúde', color: 'bg-red-500', icon: '🏥' },
    { id: 'work', name: 'Trabalho', color: 'bg-orange-500', icon: '💼' },
    { id: 'custom', name: 'Personalizada', color: 'bg-gray-500', icon: '📝' }
  ]

  // Criar checklist a partir de template
  const createFromTemplate = (templateIndex: number) => {
    const template = templates[templateIndex]
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
    }
    
    setCurrentChecklist(newChecklist)
    setScore(prev => prev + 30)
    setCurrentMode('manage')
  }

  // Criar nova checklist vazia
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
    }
    
    setCurrentChecklist(newChecklist)
    setCurrentMode('create')
  }

  // Adicionar item à checklist
  const addItem = () => {
    if (!currentChecklist || !newItem.text) return

    const item: ChecklistItem = {
      id: Date.now().toString(),
      text: newItem.text,
      completed: false,
      priority: newItem.priority || 'medium',
      estimatedTime: newItem.estimatedTime,
      category: newItem.category,
      notes: newItem.notes
    }

    const updatedChecklist = {
      ...currentChecklist,
      items: [...currentChecklist.items, item]
    }
    
    setCurrentChecklist(updatedChecklist)
    setNewItem({})
    setScore(prev => prev + 10)
  }

  // Remover item
  const removeItem = (itemId: string) => {
    if (!currentChecklist) return

    const updatedChecklist = {
      ...currentChecklist,
      items: currentChecklist.items.filter(item => item.id !== itemId)
    }
    
    setCurrentChecklist(updatedChecklist)
  }

  // Marcar item como completo/incompleto
  const toggleItem = (itemId: string) => {
    if (!currentChecklist) return

    const updatedItems = currentChecklist.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    )

    const completionRate = (updatedItems.filter(item => item.completed).length / updatedItems.length) * 100
    const isCompleted = completionRate === 100

    const updatedChecklist = {
      ...currentChecklist,
      items: updatedItems,
      completionRate,
      completed: isCompleted
    }
    
    setCurrentChecklist(updatedChecklist)
    
    // Pontuação por completar item
    const item = updatedItems.find(i => i.id === itemId)
    if (item?.completed) {
      setScore(prev => prev + (item.priority === 'high' ? 15 : item.priority === 'medium' ? 10 : 5))
    }
  }

  // Salvar checklist
  const saveChecklist = () => {
    if (!currentChecklist) return

    const existingIndex = checklists.findIndex(c => c.id === currentChecklist.id)
    
    if (existingIndex >= 0) {
      const updatedChecklists = [...checklists]
      updatedChecklists[existingIndex] = currentChecklist
      setChecklists(updatedChecklists)
    } else {
      setChecklists(prev => [...prev, currentChecklist])
    }
    
    setScore(prev => prev + 25)
    setCurrentMode('manage')
  }

  // Duplicar checklist
  const duplicateChecklist = (checklist: Checklist) => {
    const duplicated: Checklist = {
      ...checklist,
      id: Date.now().toString(),
      title: `${checklist.title} (Cópia)`,
      items: checklist.items.map(item => ({ ...item, id: Date.now().toString() + Math.random(), completed: false })),
      created: new Date(),
      completed: false,
      completionRate: 0
    }
    
    setChecklists(prev => [...prev, duplicated])
    setScore(prev => prev + 15)
  }

  // Calcular estatísticas
  const getStats = () => {
    const totalChecklists = checklists.length
    const completedChecklists = checklists.filter(c => c.completed).length
    const totalItems = checklists.reduce((sum, c) => sum + c.items.length, 0)
    const completedItems = checklists.reduce((sum, c) => sum + c.items.filter(i => i.completed).length, 0)
    
    return {
      totalChecklists,
      completedChecklists,
      totalItems,
      completedItems,
      averageCompletion: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    }
  }

  // Análise de quebra de tarefas
  const analyzeTaskBreakdown = (text: string): { suggestions: string[], score: number } => {
    const suggestions = []
    let score = 0

    // Verifica se a tarefa é específica
    if (text.length > 50) {
      suggestions.push("Considere quebrar em tarefas menores")
    } else {
      score += 20
    }

    // Verifica se tem verbo de ação
    const actionVerbs = ['fazer', 'criar', 'escrever', 'revisar', 'enviar', 'preparar', 'organizar', 'verificar']
    if (actionVerbs.some(verb => text.toLowerCase().includes(verb))) {
      score += 20
    } else {
      suggestions.push("Use verbos de ação (fazer, criar, verificar...)")
    }

    // Verifica se é mensurável
    const numbers = /\d+/.test(text)
    if (numbers) {
      score += 20
    } else {
      suggestions.push("Adicione números quando possível (quantos, quando...)")
    }

    // Verifica clareza
    const vagueWords = ['algumas', 'várias', 'mais', 'melhorar', 'otimizar']
    if (!vagueWords.some(word => text.toLowerCase().includes(word))) {
      score += 20
    } else {
      suggestions.push("Evite palavras vagas - seja específico")
    }

    return { suggestions, score }
  }

  // Reset atividade
  const resetActivity = () => {
    setScore(0)
    setChecklists([])
    setCurrentChecklist(null)
    setNewItem({})
    setEditingItem(null)
    setCurrentMode('templates')
    setShowActivity(false)
  }

  const stats = getStats()

  if (!showActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Botão Voltar */}
          <div className="mb-4">
            <button 
              onClick={() => router.push('/tdah')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Lista de Verificação</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Objetivo */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-emerald-400">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-semibold text-gray-800">Objetivo:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Desenvolver habilidades para criar checklists eficazes que reduzam a sobrecarga cognitiva 
                e melhorem a organização. Aprenda a quebrar tarefas complexas em passos simples e 
                acionáveis, fundamentais para pessoas com TDAH.
              </p>
            </div>

            {/* Pontuação */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-400">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">Pontuação:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Ganhe pontos criando listas, adicionando itens e completando tarefas. 
                Desenvolva o hábito de usar checklists como ferramenta de produtividade 
                e redução de estresse mental.
              </p>
            </div>
          </div>

          {/* Tipos de Checklist */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-teal-400">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-teal-600 font-bold">✅</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Tipos de Checklist:</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">🌅 Rotinas Diárias</h3>
                  <p className="text-gray-600 text-sm">Estruturar manhãs e atividades recorrentes</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-green-600">📊 Projetos</h3>
                  <p className="text-gray-600 text-sm">Quebrar projetos complexos em etapas</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-purple-600">✈️ Viagens</h3>
                  <p className="text-gray-600 text-sm">Não esquecer nada importante</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-red-600">🏥 Saúde</h3>
                  <p className="text-gray-600 text-sm">Preparação para consultas e exames</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefícios */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-purple-400">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-800">Benefícios para TDAH:</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-700">• <strong>Reduz sobrecarga mental</strong> - Libera espaço cognitivo</p>
                <p className="text-gray-700">• <strong>Aumenta confiança</strong> - Sensação de progresso visível</p>
                <p className="text-gray-700">• <strong>Diminui esquecimentos</strong> - Memória externa confiável</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">• <strong>Melhora foco</strong> - Uma tarefa por vez</p>
                <p className="text-gray-700">• <strong>Facilita início</strong> - Quebra paralisia de decisão</p>
                <p className="text-gray-700">• <strong>Cria momentum</strong> - Cada ✓ motiva o próximo</p>
              </div>
            </div>
          </div>

          {/* Botão Começar */}
          <div className="mt-8 text-center">
            <button 
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto"
              onClick={() => setShowActivity(true)}
            >
              <Play className="w-5 h-5" />
              Começar Atividade
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowActivity(false)}
              className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Lista de Verificação</h1>
            </div>
          </div>
          
          <button
            onClick={resetActivity}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
        </div>

        {/* Status */}
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

        {/* Navegação */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex gap-4 mb-4">
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
              onClick={() => setCurrentMode('create')}
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
              Gerenciar
            </button>
          </div>

          {/* Templates */}
          {currentMode === 'templates' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Escolha um Template:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template, index) => {
                  const category = categories.find(c => c.id === template.category)
                  return (
                    <div key={index} className="border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{category?.icon}</span>
                        <h4 className="font-semibold">{template.title}</h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                      <div className="space-y-1 mb-4">
                        {template.items.slice(0, 3).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-2 text-xs text-gray-500">
                            <CheckCircle className="w-3 h-3" />
                            <span>{item.text}</span>
                            {item.estimatedTime && (
                              <span className="text-gray-400">({item.estimatedTime}min)</span>
                            )}
                          </div>
                        ))}
                        {template.items.length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{template.items.length - 3} mais itens...
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => createFromTemplate(index)}
                        className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        Usar Template
                      </button>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={createEmptyChecklist}
                  className="px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Criar Lista Personalizada
                </button>
              </div>
            </div>
          )}

          {/* Criar/Editar */}
          {currentMode === 'create' && currentChecklist && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Criar Nova Lista:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Título da lista"
                    value={currentChecklist.title}
                    onChange={(e) => setCurrentChecklist(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="p-3 border border-gray-300 rounded-lg"
                  />
                  <select
                    value={currentChecklist.category}
                    onChange={(e) => setCurrentChecklist(prev => prev ? { ...prev, category: e.target.value as any } : null)}
                    className="p-3 border border-gray-300 rounded-lg"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Descrição (opcional)"
                  value={currentChecklist.description}
                  onChange={(e) => setCurrentChecklist(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  rows={2}
                />
              </div>

              {/* Adicionar Item */}
              <div className="bg-teal-50 p-4 rounded-xl mb-6">
                <h4 className="font-semibold mb-3">Adicionar Item:</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Descrição da tarefa (use verbos de ação)"
                    value={newItem.text || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, text: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  
                  {newItem.text && (
                    <div className="bg-white p-3 rounded-lg border">
                      <h5 className="font-medium mb-2">Análise da Tarefa:</h5>
                      {(() => {
                        const analysis = analyzeTaskBreakdown(newItem.text)
                        return (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${analysis.score >= 60 ? 'bg-green-500' : analysis.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                              <span className="text-sm font-medium">Qualidade: {analysis.score}/80</span>
                            </div>
                            {analysis.suggestions.length > 0 && (
                              <div className="space-y-1">
                                {analysis.suggestions.map((suggestion, index) => (
                                  <p key={index} className="text-xs text-gray-600">💡 {suggestion}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={newItem.priority || 'medium'}
                      onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="high">🔴 Alta Prioridade</option>
                      <option value="medium">🟡 Média Prioridade</option>
                      <option value="low">🟢 Baixa Prioridade</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Tempo estimado (min)"
                      value={newItem.estimatedTime || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, estimatedTime: Number(e.target.value) }))}
                      className="p-2 border border-gray-300 rounded-lg"
                      min="1"
                    />
                    <button
                      onClick={addItem}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de Itens */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Itens da Lista ({currentChecklist.items.length}):</h4>
                {currentChecklist.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum item adicionado ainda</p>
                ) : (
                  <div className="space-y-2">
                    {currentChecklist.items.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                          <div>
                            <p className="font-medium">{item.text}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className={`px-2 py-1 rounded ${
                                item.priority === 'high' ? 'bg-red-100 text-red-700' :
                                item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {item.priority === 'high' ? '🔴 Alta' : item.priority === 'medium' ? '🟡 Média' : '🟢 Baixa'}
                              </span>
                              {item.estimatedTime && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {item.estimatedTime}min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-4">
                <button
                  onClick={saveChecklist}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Salvar Lista
                </button>
                <button
                  onClick={() => setCurrentMode('templates')}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Gerenciar Listas */}
          {currentMode === 'manage' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Suas Listas:</h3>
                <button
                  onClick={createEmptyChecklist}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nova Lista
                </button>
              </div>

              {checklists.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma lista criada ainda</p>
              ) : (
                <div className="space-y-4">
                  {checklists.map((checklist) => {
                    const category = categories.find(c => c.id === checklist.category)
                    const totalTime = checklist.items.reduce((sum, item) => sum + (item.estimatedTime || 0), 0)
                    
                    return (
                      <div key={checklist.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{category?.icon}</span>
                            <div>
                              <h4 className="font-semibold">{checklist.title}</h4>
                              <p className="text-sm text-gray-600">{checklist.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-sm font-semibold ${
                              checklist.completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {checklist.completionRate.toFixed(0)}%
                            </span>
                            <button
                              onClick={() => duplicateChecklist(checklist)}
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Duplicar"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>{checklist.items.filter(i => i.completed).length}/{checklist.items.length} itens</span>
                            {totalTime > 0 && <span>~{totalTime}min total</span>}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${checklist.completionRate}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {checklist.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                              <button
                                onClick={() => toggleItem(item.id)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  item.completed 
                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                    : 'border-gray-300 hover:border-emerald-300'
                                }`}
                              >
                                {item.completed && <CheckCircle className="w-3 h-3" />}
                              </button>
                              <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                                {item.text}
                              </span>
                              <div className="flex items-center gap-2 text-xs">
                                <span className={`w-2 h-2 rounded-full ${
                                  item.priority === 'high' ? 'bg-red-500' :
                                  item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}></span>
                                {item.estimatedTime && (
                                  <span className="text-gray-500">{item.estimatedTime}min</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {checklist.completed && (
                          <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
                            <Trophy className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-green-700 font-semibold">Lista Completa! 🎉</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Progresso Geral</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Pontuação Total</span>
                <span>{score}/1000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((score / 1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}