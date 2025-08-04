'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Target, Award, Brain, BookOpen, Trophy, RotateCcw, CheckCircle, XCircle, Plus, Trash2, Edit3, Save, Clock, Calendar, User, Zap, Coffee, Moon, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TimeBlock {
  id: string
  title: string
  startTime: string
  endTime: string
  category: 'work' | 'personal' | 'health' | 'family' | 'learning' | 'rest' | 'routine'
  priority: 'high' | 'medium' | 'low'
  flexible: boolean
  recurring: boolean
  notes?: string
  color: string
}

interface DaySchedule {
  date: string
  dayName: string
  blocks: TimeBlock[]
  energy: number // 1-5
  focus: number // 1-5
  productivity: 'morning' | 'afternoon' | 'evening' | 'night'
}

interface WeekPlan {
  id: string
  title: string
  startDate: string
  days: DaySchedule[]
  goals: string[]
  reflection: string
  completed: boolean
}

interface Template {
  name: string
  description: string
  type: 'professional' | 'student' | 'flexible' | 'parent'
  defaultBlocks: Omit<TimeBlock, 'id' | 'color'>[]
}

export default function PlanejamentoTempo() {
  const router = useRouter()
  const [showActivity, setShowActivity] = useState(false)
  const [currentView, setCurrentView] = useState<'templates' | 'daily' | 'weekly' | 'analysis'>('templates')
  const [score, setScore] = useState(0)
  const [weekPlans, setWeekPlans] = useState<WeekPlan[]>([])
  const [currentWeek, setCurrentWeek] = useState<WeekPlan | null>(null)
  const [selectedDay, setSelectedDay] = useState(0)
  const [newBlock, setNewBlock] = useState<Partial<TimeBlock>>({})
  const [weeklyGoals, setWeeklyGoals] = useState<string[]>(['', '', ''])

  const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  
  const categories = [
    { id: 'work', name: 'Trabalho', color: '#3B82F6', icon: '💼' },
    { id: 'personal', name: 'Pessoal', color: '#10B981', icon: '🏠' },
    { id: 'health', name: 'Saúde', color: '#EF4444', icon: '🏃' },
    { id: 'family', name: 'Família', color: '#8B5CF6', icon: '👨‍👩‍👧‍👦' },
    { id: 'learning', name: 'Aprendizado', color: '#F59E0B', icon: '📚' },
    { id: 'rest', name: 'Descanso', color: '#6B7280', icon: '😴' },
    { id: 'routine', name: 'Rotina', color: '#EC4899', icon: '🔄' }
  ] as const

  const templates: Template[] = [
    {
      name: 'Profissional Equilibrado',
      description: 'Para quem trabalha em horário comercial',
      type: 'professional',
      defaultBlocks: [
        { title: 'Rotina Matinal', startTime: '07:00', endTime: '08:30', category: 'routine', priority: 'high', flexible: false, recurring: true },
        { title: 'Trabalho - Manhã', startTime: '09:00', endTime: '12:00', category: 'work', priority: 'high', flexible: false, recurring: true },
        { title: 'Almoço', startTime: '12:00', endTime: '13:00', category: 'personal', priority: 'medium', flexible: true, recurring: true },
        { title: 'Trabalho - Tarde', startTime: '13:00', endTime: '17:00', category: 'work', priority: 'high', flexible: false, recurring: true },
        { title: 'Exercícios', startTime: '18:00', endTime: '19:00', category: 'health', priority: 'medium', flexible: true, recurring: true },
        { title: 'Jantar', startTime: '19:30', endTime: '20:30', category: 'personal', priority: 'medium', flexible: true, recurring: true },
        { title: 'Tempo Livre', startTime: '21:00', endTime: '22:00', category: 'rest', priority: 'low', flexible: true, recurring: true }
      ]
    },
    {
      name: 'Estudante Dedicado',
      description: 'Focado em estudos e desenvolvimento',
      type: 'student',
      defaultBlocks: [
        { title: 'Despertar', startTime: '06:30', endTime: '07:30', category: 'routine', priority: 'high', flexible: false, recurring: true },
        { title: 'Estudos - Manhã', startTime: '08:00', endTime: '11:00', category: 'learning', priority: 'high', flexible: false, recurring: true },
        { title: 'Intervalo Ativo', startTime: '11:00', endTime: '11:30', category: 'health', priority: 'medium', flexible: false, recurring: true },
        { title: 'Estudos - Meio-dia', startTime: '11:30', endTime: '13:00', category: 'learning', priority: 'high', flexible: false, recurring: true },
        { title: 'Almoço/Descanso', startTime: '13:00', endTime: '14:30', category: 'personal', priority: 'medium', flexible: true, recurring: true },
        { title: 'Projetos/Trabalhos', startTime: '15:00', endTime: '17:00', category: 'learning', priority: 'high', flexible: true, recurring: true },
        { title: 'Atividade Física', startTime: '17:30', endTime: '18:30', category: 'health', priority: 'medium', flexible: true, recurring: true },
        { title: 'Tempo Família', startTime: '19:00', endTime: '21:00', category: 'family', priority: 'medium', flexible: true, recurring: true }
      ]
    },
    {
      name: 'Freelancer Flexível',
      description: 'Horários adaptáveis com blocos produtivos',
      type: 'flexible',
      defaultBlocks: [
        { title: 'Início Suave', startTime: '08:00', endTime: '09:00', category: 'routine', priority: 'medium', flexible: true, recurring: true },
        { title: 'Bloco Produtivo 1', startTime: '09:30', endTime: '11:30', category: 'work', priority: 'high', flexible: true, recurring: true },
        { title: 'Pausa Criativa', startTime: '11:30', endTime: '12:00', category: 'rest', priority: 'low', flexible: true, recurring: true },
        { title: 'Bloco Produtivo 2', startTime: '14:00', endTime: '16:00', category: 'work', priority: 'high', flexible: true, recurring: true },
        { title: 'Desenvolvimento Pessoal', startTime: '16:30', endTime: '17:30', category: 'learning', priority: 'medium', flexible: true, recurring: true },
        { title: 'Exercícios/Caminhada', startTime: '18:00', endTime: '19:00', category: 'health', priority: 'medium', flexible: true, recurring: true },
        { title: 'Relaxamento', startTime: '20:00', endTime: '21:30', category: 'rest', priority: 'low', flexible: true, recurring: true }
      ]
    },
    {
      name: 'Pai/Mãe Organizados',
      description: 'Equilibrando família e responsabilidades',
      type: 'parent',
      defaultBlocks: [
        { title: 'Preparação Familiar', startTime: '06:00', endTime: '08:00', category: 'family', priority: 'high', flexible: false, recurring: true },
        { title: 'Trabalho - Manhã', startTime: '09:00', endTime: '11:30', category: 'work', priority: 'high', flexible: false, recurring: true },
        { title: 'Tarefas Domésticas', startTime: '11:30', endTime: '12:30', category: 'personal', priority: 'medium', flexible: true, recurring: true },
        { title: 'Almoço em Família', startTime: '12:30', endTime: '13:30', category: 'family', priority: 'high', flexible: false, recurring: true },
        { title: 'Trabalho - Tarde', startTime: '14:00', endTime: '16:00', category: 'work', priority: 'high', flexible: true, recurring: true },
        { title: 'Atividades com Filhos', startTime: '16:30', endTime: '18:00', category: 'family', priority: 'high', flexible: false, recurring: true },
        { title: 'Jantar Familiar', startTime: '18:30', endTime: '19:30', category: 'family', priority: 'high', flexible: false, recurring: true },
        { title: 'Tempo Pessoal', startTime: '21:00', endTime: '22:00', category: 'personal', priority: 'medium', flexible: true, recurring: true }
      ]
    }
  ]

  // Criar semana vazia
  const createEmptyWeek = (): WeekPlan => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    
    return {
      id: Date.now().toString(),
      title: `Semana ${weekPlans.length + 1}`,
      startDate: startOfWeek.toISOString().split('T')[0],
      days: daysOfWeek.map((dayName, index) => {
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + index)
        return {
          date: date.toISOString().split('T')[0],
          dayName,
          blocks: [],
          energy: 3,
          focus: 3,
          productivity: 'morning'
        }
      }),
      goals: ['', '', ''],
      reflection: '',
      completed: false
    }
  }

  // Aplicar template
  const applyTemplate = (templateIndex: number) => {
    const template = templates[templateIndex]
    const newWeek = createEmptyWeek()
    
    // Aplicar template para dias úteis (Segunda a Sexta)
    for (let dayIndex = 1; dayIndex <= 5; dayIndex++) {
      newWeek.days[dayIndex].blocks = template.defaultBlocks.map((block, blockIndex) => {
        const category = categories.find(c => c.id === block.category)!
        return {
          ...block,
          id: `${dayIndex}-${blockIndex}-${Date.now()}`,
          color: category.color
        }
      })
    }
    
    setCurrentWeek(newWeek)
    setScore(prev => prev + 50)
    setCurrentView('weekly')
  }

  // Adicionar bloco de tempo
  const addTimeBlock = () => {
    if (!currentWeek || !newBlock.title || !newBlock.startTime || !newBlock.endTime) return

    const category = categories.find(c => c.id === newBlock.category) || categories[0]
    
    const block: TimeBlock = {
      id: `${selectedDay}-${Date.now()}`,
      title: newBlock.title,
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      category: newBlock.category || 'personal',
      priority: newBlock.priority || 'medium',
      flexible: newBlock.flexible || false,
      recurring: newBlock.recurring || false,
      notes: newBlock.notes,
      color: category.color
    }

    const updatedWeek = { ...currentWeek }
    updatedWeek.days[selectedDay].blocks.push(block)
    updatedWeek.days[selectedDay].blocks.sort((a, b) => a.startTime.localeCompare(b.startTime))
    
    setCurrentWeek(updatedWeek)
    setNewBlock({})
    setScore(prev => prev + 15)
  }

  // Remover bloco
  const removeTimeBlock = (dayIndex: number, blockId: string) => {
    if (!currentWeek) return

    const updatedWeek = { ...currentWeek }
    updatedWeek.days[dayIndex].blocks = updatedWeek.days[dayIndex].blocks.filter(block => block.id !== blockId)
    
    setCurrentWeek(updatedWeek)
  }

  // Atualizar energia/foco do dia
  const updateDayMetrics = (dayIndex: number, energy: number, focus: number, productivity: 'morning' | 'afternoon' | 'evening' | 'night') => {
    if (!currentWeek) return

    const updatedWeek = { ...currentWeek }
    updatedWeek.days[dayIndex].energy = energy
    updatedWeek.days[dayIndex].focus = focus
    updatedWeek.days[dayIndex].productivity = productivity
    
    setCurrentWeek(updatedWeek)
  }

  // Salvar semana
  const saveWeek = () => {
    if (!currentWeek) return

    const weekToSave = {
      ...currentWeek,
      goals: weeklyGoals.filter(goal => goal.trim() !== '')
    }

    const existingIndex = weekPlans.findIndex(w => w.id === currentWeek.id)
    
    if (existingIndex >= 0) {
      const updatedWeeks = [...weekPlans]
      updatedWeeks[existingIndex] = weekToSave
      setWeekPlans(updatedWeeks)
    } else {
      setWeekPlans(prev => [...prev, weekToSave])
    }
    
    setScore(prev => prev + 30)
  }

  // Calcular duração do bloco
  const getBlockDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01 ${startTime}`)
    const end = new Date(`2000-01-01 ${endTime}`)
    return (end.getTime() - start.getTime()) / (1000 * 60) // minutos
  }

  // Análise da semana
  const analyzeWeek = (week: WeekPlan) => {
    const allBlocks = week.days.flatMap(day => day.blocks)
    const totalMinutes = allBlocks.reduce((sum, block) => 
      sum + getBlockDuration(block.startTime, block.endTime), 0
    )
    
    const categoryStats = categories.map(cat => {
      const categoryBlocks = allBlocks.filter(block => block.category === cat.id)
      const minutes = categoryBlocks.reduce((sum, block) => 
        sum + getBlockDuration(block.startTime, block.endTime), 0
      )
      return {
        ...cat,
        minutes,
        percentage: totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0,
        count: categoryBlocks.length
      }
    })

    const avgEnergy = week.days.reduce((sum, day) => sum + day.energy, 0) / week.days.length
    const avgFocus = week.days.reduce((sum, day) => sum + day.focus, 0) / week.days.length
    
    return {
      totalMinutes,
      totalHours: totalMinutes / 60,
      categoryStats,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      avgFocus: Math.round(avgFocus * 10) / 10,
      balanceScore: Math.round((categoryStats.filter(cat => cat.percentage > 0).length / categories.length) * 100),
      flexibilityScore: Math.round((allBlocks.filter(b => b.flexible).length / allBlocks.length) * 100)
    }
  }

  // Reset atividade
  const resetActivity = () => {
    setScore(0)
    setWeekPlans([])
    setCurrentWeek(null)
    setSelectedDay(0)
    setNewBlock({})
    setWeeklyGoals(['', '', ''])
    setCurrentView('templates')
    setShowActivity(false)
  }

  // Inicializar
  useEffect(() => {
    if (showActivity && !currentWeek) {
      setCurrentWeek(createEmptyWeek())
    }
  }, [showActivity])

  if (!showActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Botão Voltar ao TDAH */}
          <div className="mb-4">
            <button 
              onClick={() => router.push('/tdah')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao TDAH
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
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Planejamento de Tempo</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Objetivo */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-cyan-400">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-cyan-500" />
                <h2 className="text-xl font-semibold text-gray-800">Objetivo:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Criar cronogramas integrados que combinam planejamento diário detalhado com visão semanal estratégica. 
                Desenvolva rotinas flexíveis que respeitam seus padrões de energia e maximizam sua produtividade 
                através de estrutura adaptável.
              </p>
            </div>

            {/* Pontuação */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-400">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">Pontuação:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Ganhe pontos criando cronogramas balanceados, definindo metas semanais e mantendo 
                consistência entre planejamento e execução. Desenvolva autoconsciência temporal 
                através de métricas pessoais.
              </p>
            </div>
          </div>

          {/* Funcionalidades Integradas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-blue-400">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">⚡</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Funcionalidades Integradas:</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-cyan-600">📅 Visão Diária</h3>
                  <p className="text-gray-600 text-sm">Timeline detalhada com energia e foco</p>
                </div>
                <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                  Tático
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">📆 Visão Semanal</h3>
                  <p className="text-gray-600 text-sm">Estrutura macro com metas e objetivos</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Estratégico
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-purple-600">📊 Análise Integrada</h3>
                  <p className="text-gray-600 text-sm">Métricas de equilíbrio e padrões</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Inteligente
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-green-600">🎯 Templates Personalizados</h3>
                  <p className="text-gray-600 text-sm">4 perfis para diferentes estilos</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Rápido
                </span>
              </div>
            </div>
          </div>

          {/* Diferencial TDAH */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-purple-400">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-800">Especial para TDAH:</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-700">• <strong>Flexibilidade Inteligente</strong> - Blocos adaptáveis vs fixos</p>
                <p className="text-gray-700">• <strong>Energia Personalizada</strong> - Escala 1-5 por dia</p>
                <p className="text-gray-700">• <strong>Picos de Produtividade</strong> - 4 períodos do dia</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">• <strong>Transições Suaves</strong> - Tempo entre atividades</p>
                <p className="text-gray-700">• <strong>Categorias Visuais</strong> - Cores para reconhecimento</p>
                <p className="text-gray-700">• <strong>Metas Claras</strong> - Objetivos semanais estruturados</p>
              </div>
            </div>
          </div>

          {/* Base Científica */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-green-400">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">Base Científica:</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Integra princípios de gestão temporal adaptativa com automonitoramento de energia e foco. 
              A combinação de planejamento estratégico (semanal) com execução tática (diária) oferece 
              estrutura externa essencial para pessoas com TDAH, reduzindo sobrecarga cognitiva e 
              facilitando autorregulação.
            </p>
          </div>

          {/* Botão Começar */}
          <div className="mt-8 text-center">
            <button 
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto"
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
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
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Planejamento de Tempo</h1>
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
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Pontuação</h3>
            <p className="text-2xl font-bold text-cyan-600">{score}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Semanas</h3>
            <p className="text-2xl font-bold text-blue-600">{weekPlans.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Blocos</h3>
            <p className="text-2xl font-bold text-purple-600">
              {currentWeek ? currentWeek.days.flatMap(d => d.blocks).length : 0}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Equilíbrio</h3>
            <p className="text-2xl font-bold text-green-600">
              {currentWeek ? analyzeWeek(currentWeek).balanceScore : 0}%
            </p>
          </div>
        </div>

        {/* Navegação */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex gap-4 mb-4 overflow-x-auto">
            <button
              onClick={() => setCurrentView('templates')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                currentView === 'templates' 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setCurrentView('daily')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                currentView === 'daily' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Visão Diária
            </button>
            <button
              onClick={() => setCurrentView('weekly')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                currentView === 'weekly' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Visão Semanal
            </button>
            <button
              onClick={() => setCurrentView('analysis')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                currentView === 'analysis' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Análise
            </button>
          </div>

          {/* Templates */}
          {currentView === 'templates' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Escolha seu Template:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-xl p-4 hover:border-cyan-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-cyan-500" />
                      <h4 className="font-semibold">{template.name}</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                    
                    <div className="space-y-1 mb-4 max-h-32 overflow-y-auto">
                      {template.defaultBlocks.slice(0, 4).map((block, blockIndex) => {
                        const category = categories.find(c => c.id === block.category)
                        return (
                          <div key={blockIndex} className="flex items-center gap-2 text-xs">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: category?.color }}
                            ></div>
                            <span className="text-gray-600">
                              {block.startTime} - {block.title}
                            </span>
                          </div>
                        )
                      })}
                      {template.defaultBlocks.length > 4 && (
                        <div className="text-xs text-gray-400">
                          +{template.defaultBlocks.length - 4} mais atividades...
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => applyTemplate(index)}
                      className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                      Usar Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visão Diária */}
          {currentView === 'daily' && currentWeek && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Planejamento Diário</h3>
                <button
                  onClick={saveWeek}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
              </div>

              {/* Seletor de Dia */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {daysOfWeek.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(index)}
                    className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                      selectedDay === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Configurações do Dia */}
              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <h4 className="font-semibold mb-3">Configurações - {daysOfWeek[selectedDay]}:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pico de Produtividade:</label>
                    <select
                      value={currentWeek.days[selectedDay].productivity}
                      onChange={(e) => updateDayMetrics(
                        selectedDay,
                        currentWeek.days[selectedDay].energy,
                        currentWeek.days[selectedDay].focus,
                        e.target.value as any
                      )}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="morning">🌅 Manhã</option>
                      <option value="afternoon">☀️ Tarde</option>
                      <option value="evening">🌆 Noite</option>
                      <option value="night">🌙 Madrugada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Energia: {currentWeek.days[selectedDay].energy}/5</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={currentWeek.days[selectedDay].energy}
                      onChange={(e) => updateDayMetrics(
                        selectedDay,
                        Number(e.target.value),
                        currentWeek.days[selectedDay].focus,
                        currentWeek.days[selectedDay].productivity
                      )}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Foco: {currentWeek.days[selectedDay].focus}/5</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={currentWeek.days[selectedDay].focus}
                      onChange={(e) => updateDayMetrics(
                        selectedDay,
                        currentWeek.days[selectedDay].energy,
                        Number(e.target.value),
                        currentWeek.days[selectedDay].productivity
                      )}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Adicionar Bloco */}
              <div className="bg-cyan-50 p-4 rounded-xl mb-6">
                <h4 className="font-semibold mb-3">Adicionar Bloco:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Título da atividade"
                    value={newBlock.title || ''}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, title: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="time"
                    value={newBlock.startTime || ''}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, startTime: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="time"
                    value={newBlock.endTime || ''}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, endTime: e.target.value }))}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                  <select
                    value={newBlock.category || 'personal'}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, category: e.target.value as any }))}
                    className="p-2 border border-gray-300 rounded-lg"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-3 mb-3">
                  <select
                    value={newBlock.priority || 'medium'}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="high">🔴 Alta</option>
                    <option value="medium">🟡 Média</option>
                    <option value="low">🟢 Baixa</option>
                  </select>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newBlock.flexible || false}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, flexible: e.target.checked }))}
                    />
                    <span className="text-sm">Flexível</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newBlock.recurring || false}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, recurring: e.target.checked }))}
                    />
                    <span className="text-sm">Recorrente</span>
                  </label>
                  
                  <button
                    onClick={addTimeBlock}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Timeline do Dia */}
              <div>
                <h4 className="font-semibold mb-3">Timeline - {daysOfWeek[selectedDay]}:</h4>
                {currentWeek.days[selectedDay].blocks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhuma atividade programada</p>
                ) : (
                  <div className="space-y-2">
                    {currentWeek.days[selectedDay].blocks.map((block) => {
                      const category = categories.find(c => c.id === block.category)
                      const duration = getBlockDuration(block.startTime, block.endTime)
                      
                      return (
                        <div key={block.id} className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4" style={{ borderLeftColor: block.color }}>
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <div className="text-sm font-semibold">{block.startTime}</div>
                              <div className="text-xs text-gray-500">{duration}min</div>
                            </div>
                            <div>
                              <h5 className="font-semibold">{block.title}</h5>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{category?.icon} {category?.name}</span>
                                <span>•</span>
                                <span className={`px-2 py-1 rounded ${
                                  block.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  block.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {block.priority === 'high' ? 'Alta' : block.priority === 'medium' ? 'Média' : 'Baixa'}
                                </span>
                                {block.flexible && <span className="text-blue-600">📋 Flexível</span>}
                                {block.recurring && <span className="text-purple-600">🔄 Recorrente</span>}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeTimeBlock(selectedDay, block.id)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visão Semanal */}
          {currentView === 'weekly' && currentWeek && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Visão Semanal</h3>
                <button
                  onClick={saveWeek}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar Semana
                </button>
              </div>

              {/* Metas Semanais */}
              <div className="bg-purple-50 p-4 rounded-xl mb-6">
                <h4 className="font-semibold mb-3">Metas da Semana:</h4>
                <div className="space-y-2">
                  {weeklyGoals.map((goal, index) => (
                    <input
                      key={index}
                      type="text"
                      value={goal}
                      onChange={(e) => {
                        const newGoals = [...weeklyGoals]
                        newGoals[index] = e.target.value
                        setWeeklyGoals(newGoals)
                      }}
                      placeholder={`Meta ${index + 1}`}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ))}
                </div>
              </div>

              {/* Resumo dos Dias */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {currentWeek.days.map((day, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{day.dayName}</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <span>⚡{day.energy}</span>
                        <span>🎯{day.focus}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      {day.blocks.slice(0, 3).map((block) => {
                        const category = categories.find(c => c.id === block.category)
                        return (
                          <div key={block.id} className="flex items-center gap-2 text-xs">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: block.color }}
                            ></div>
                            <span>{block.startTime} - {block.title}</span>
                          </div>
                        )
                      })}
                      {day.blocks.length > 3 && (
                        <div className="text-xs text-gray-400">
                          +{day.blocks.length - 3} mais atividades...
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      {day.blocks.length} blocos • {day.blocks.reduce((sum, block) => 
                        sum + getBlockDuration(block.startTime, block.endTime), 0) / 60}h total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Análise */}
          {currentView === 'analysis' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Análise dos Planejamentos</h3>
              
              {weekPlans.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Crie semanas para ver análises</p>
              ) : (
                <div className="space-y-6">
                  {weekPlans.map((week, index) => {
                    const analysis = analyzeWeek(week)
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-xl p-6">
                        <h4 className="font-semibold mb-4">{week.title}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium mb-3">Distribuição por Categoria:</h5>
                            <div className="space-y-2">
                              {analysis.categoryStats.filter(cat => cat.percentage > 0).map(cat => (
                                <div key={cat.id}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="flex items-center gap-1">
                                      {cat.icon} {cat.name}
                                    </span>
                                    <span>{cat.percentage.toFixed(1)}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="h-2 rounded-full transition-all duration-300"
                                      style={{ 
                                        width: `${cat.percentage}%`,
                                        backgroundColor: cat.color
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium mb-3">Métricas Semanais:</h5>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span>Energia Média:</span>
                                <span className="font-semibold text-green-600">{analysis.avgEnergy}/5</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Foco Médio:</span>
                                <span className="font-semibold text-blue-600">{analysis.avgFocus}/5</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Equilíbrio:</span>
                                <span className="font-semibold text-purple-600">{analysis.balanceScore}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Flexibilidade:</span>
                                <span className="font-semibold text-orange-600">{analysis.flexibilityScore}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total de Horas:</span>
                                <span className="font-semibold">{analysis.totalHours.toFixed(1)}h</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {week.goals.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-medium mb-2">Metas da Semana:</h5>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {week.goals.map((goal, goalIndex) => (
                                <li key={goalIndex}>{goal}</li>
                              ))}
                            </ul>
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
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all duration-300"
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