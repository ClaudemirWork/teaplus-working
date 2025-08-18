'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Target, Award, Brain, BookOpen, Trophy, RotateCcw, CheckCircle, XCircle, Zap, Clock, AlertTriangle, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Task {
  id: number
  title: string
  description: string
  urgency: number // 1-5
  importance: number // 1-5
  effort: number // 1-5
  impact: number // 1-5
  category?: 'A' | 'B' | 'C' | null
  quadrant?: 1 | 2 | 3 | 4 | null
}

interface PrioritizationResult {
  taskId: number
  userChoice: string
  correctChoice: string
  accuracy: number
}

export default function PriorizacaoTarefas() {
  const router = useRouter()
  const [showActivity, setShowActivity] = useState(false)
  const [currentMethod, setCurrentMethod] = useState<'eisenhower' | 'abc' | 'impact'>('eisenhower')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [results, setResults] = useState<PrioritizationResult[]>([])
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<'A' | 'B' | 'C' | null>(null)
  const [taskList, setTaskList] = useState<Task[]>([])
  const [sortedTasks, setSortedTasks] = useState<Task[]>([])
  const [gamePhase, setGamePhase] = useState<'instruction' | 'practice' | 'feedback'>('instruction')

  const sampleTasks: Task[] = [
    {
      id: 1,
      title: "Reunião com o chefe",
      description: "Reunião urgente para discutir projeto atrasado",
      urgency: 5,
      importance: 5,
      effort: 2,
      impact: 5
    },
    {
      id: 2,
      title: "Responder emails",
      description: "Verificar e responder emails acumulados",
      urgency: 3,
      importance: 2,
      effort: 2,
      impact: 2
    },
    {
      id: 3,
      title: "Planejar férias",
      description: "Pesquisar destinos e fazer reservas",
      urgency: 1,
      importance: 2,
      effort: 4,
      impact: 3
    },
    {
      id: 4,
      title: "Curso de capacitação",
      description: "Iniciar curso online para desenvolvimento profissional",
      urgency: 2,
      importance: 5,
      effort: 5,
      impact: 5
    },
    {
      id: 5,
      title: "Organizar mesa",
      description: "Limpar e organizar espaço de trabalho",
      urgency: 2,
      importance: 3,
      effort: 1,
      impact: 2
    },
    {
      id: 6,
      title: "Ligação para cliente",
      description: "Cliente insatisfeito precisa de resposta hoje",
      urgency: 5,
      importance: 4,
      effort: 1,
      impact: 4
    },
    {
      id: 7,
      title: "Exercícios físicos",
      description: "Ir à academia ou fazer caminhada",
      urgency: 2,
      importance: 4,
      effort: 3,
      impact: 4
    },
    {
      id: 8,
      title: "Relatório mensal",
      description: "Preparar relatório que vence amanhã",
      urgency: 4,
      importance: 4,
      effort: 3,
      impact: 3
    }
  ]

  // Calcular quadrante correto (Matriz de Eisenhower)
  const getCorrectQuadrant = (task: Task): number => {
    if (task.urgency >= 4 && task.importance >= 4) return 1 // Urgente e Importante
    if (task.urgency < 4 && task.importance >= 4) return 2 // Não Urgente mas Importante
    if (task.urgency >= 4 && task.importance < 4) return 3 // Urgente mas Não Importante
    return 4 // Não Urgente e Não Importante
  }

  // Calcular categoria correta (Método ABC)
  const getCorrectCategory = (task: Task): 'A' | 'B' | 'C' => {
    const priority = (task.importance * 0.6) + (task.urgency * 0.4)
    if (priority >= 4) return 'A'
    if (priority >= 2.5) return 'B'
    return 'C'
  }

  // Calcular ordem correta (Impacto vs Esforço)
  const getImpactEffortScore = (task: Task): number => {
    return (task.impact * 2) - task.effort // Prioriza alto impacto e baixo esforço
  }

  // Inicializar nova rodada
  const startNewRound = () => {
    const shuffledTasks = [...sampleTasks].sort(() => Math.random() - 0.5)
    setTaskList(shuffledTasks.slice(0, 5))
    setCurrentTaskIndex(0)
    setSelectedQuadrant(null)
    setSelectedCategory(null)
    setSortedTasks([])
    setGamePhase('instruction')
    setResults([])
  }

  // Processar resposta da Matriz de Eisenhower
  const handleEisenhowerChoice = (quadrant: number) => {
    const currentTask = taskList[currentTaskIndex]
    const correctQuadrant = getCorrectQuadrant(currentTask)
    const accuracy = quadrant === correctQuadrant ? 100 : 0
    
    const result: PrioritizationResult = {
      taskId: currentTask.id,
      userChoice: `Quadrante ${quadrant}`,
      correctChoice: `Quadrante ${correctQuadrant}`,
      accuracy
    }
    
    setResults(prev => [...prev, result])
    setScore(prev => prev + (accuracy === 100 ? 20 : 0))
    
    if (currentTaskIndex < taskList.length - 1) {
      setCurrentTaskIndex(prev => prev + 1)
      setSelectedQuadrant(null)
    } else {
      setGamePhase('feedback')
    }
  }

  // Processar resposta do Método ABC
  const handleABCChoice = (category: 'A' | 'B' | 'C') => {
    const currentTask = taskList[currentTaskIndex]
    const correctCategory = getCorrectCategory(currentTask)
    const accuracy = category === correctCategory ? 100 : 0
    
    const result: PrioritizationResult = {
      taskId: currentTask.id,
      userChoice: `Categoria ${category}`,
      correctChoice: `Categoria ${correctCategory}`,
      accuracy
    }
    
    setResults(prev => [...prev, result])
    setScore(prev => prev + (accuracy === 100 ? 20 : 0))
    
    if (currentTaskIndex < taskList.length - 1) {
      setCurrentTaskIndex(prev => prev + 1)
      setSelectedCategory(null)
    } else {
      setGamePhase('feedback')
    }
  }

  // Processar ordenação de Impacto vs Esforço
  const handleImpactSort = (sortedList: Task[]) => {
    const correctOrder = [...taskList].sort((a, b) => getImpactEffortScore(b) - getImpactEffortScore(a))
    
    let correctPositions = 0
    sortedList.forEach((task, index) => {
      if (task.id === correctOrder[index].id) {
        correctPositions++
      }
    })
    
    const accuracy = (correctPositions / taskList.length) * 100
    setScore(prev => prev + Math.round(accuracy / 5))
    
    const result: PrioritizationResult = {
      taskId: 0,
      userChoice: 'Ordenação personalizada',
      correctChoice: 'Ordenação por impacto/esforço',
      accuracy
    }
    
    setResults([result])
    setGamePhase('feedback')
  }

  // Drag and Drop para ordenação
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', task.id.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    const draggedTaskId = parseInt(e.dataTransfer.getData('text/plain'))
    const draggedTask = sortedTasks.find(task => task.id === draggedTaskId)
    
    if (draggedTask) {
      const newSortedTasks = sortedTasks.filter(task => task.id !== draggedTaskId)
      newSortedTasks.splice(targetIndex, 0, draggedTask)
      setSortedTasks(newSortedTasks)
    }
  }

  // Reset atividade
  const resetActivity = () => {
    setScore(0)
    setLevel(1)
    setCurrentTaskIndex(0)
    setResults([])
    setSelectedQuadrant(null)
    setSelectedCategory(null)
    setTaskList([])
    setSortedTasks([])
    setGamePhase('instruction')
    setCurrentMethod('eisenhower')
    setShowActivity(false)
  }

  // Inicializar atividade
  useEffect(() => {
    if (showActivity) {
      startNewRound()
    }
  }, [showActivity, currentMethod])

  // Inicializar lista para ordenação
  useEffect(() => {
    if (currentMethod === 'impact' && taskList.length > 0) {
      setSortedTasks([...taskList])
    }
  }, [currentMethod, taskList])

  if (!showActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Priorização de Tarefas</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Objetivo */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-400">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Objetivo:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Desenvolver habilidades de priorização essenciais para pessoas com TDAH através 
                de técnicas comprovadas como Matriz de Eisenhower, Método ABC e análise de 
                Impacto vs Esforço. Aprenda a distinguir entre urgente e importante.
              </p>
            </div>

            {/* Pontuação */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-400">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">Pontuação:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Ganhe pontos classificando tarefas corretamente nos diferentes métodos de priorização. 
                Desenvolva intuição para tomar decisões rápidas e eficazes sobre o que fazer primeiro.
              </p>
            </div>
          </div>

          {/* Métodos */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-purple-400">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">📊</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Métodos de Priorização:</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Matriz de Eisenhower</h3>
                  <p className="text-gray-600 text-sm">Urgente vs Importante em 4 quadrantes</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Clássico
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-green-600">Método ABC</h3>
                  <p className="text-gray-600 text-sm">Classificação A (crítico), B (importante), C (desejável)</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Simples
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-purple-600">Impacto vs Esforço</h3>
                  <p className="text-gray-600 text-sm">Priorizar máximo impacto com mínimo esforço</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Estratégico
                </span>
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
              Pessoas com TDAH frequentemente lutam com funções executivas de priorização e tomada de decisão. 
              Estas técnicas estruturadas reduzem a sobrecarga cognitiva, facilitam escolhas e melhoram 
              a produtividade através de frameworks claros de decisão.
            </p>
          </div>

          {/* Botão Começar */}
          <div className="mt-8 text-center">
            <button 
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Priorização de Tarefas</h1>
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
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Pontuação</h3>
            <p className="text-2xl font-bold text-blue-600">{score}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Acertos</h3>
            <p className="text-2xl font-bold text-green-600">{results.filter(r => r.accuracy === 100).length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Progresso</h3>
            <p className="text-2xl font-bold text-purple-600">{results.length}/{taskList.length}</p>
          </div>
        </div>

        {/* Seletor de Método */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Escolha o Método:</h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentMethod('eisenhower')}
              className={`p-4 rounded-xl border-2 transition-all ${
                currentMethod === 'eisenhower' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="grid grid-cols-2 gap-1 w-6 h-6 mx-auto mb-2">
                <div className="bg-red-400 rounded-sm"></div>
                <div className="bg-yellow-400 rounded-sm"></div>
                <div className="bg-green-400 rounded-sm"></div>
                <div className="bg-gray-400 rounded-sm"></div>
              </div>
              <p className="font-semibold text-blue-600">Eisenhower</p>
            </button>
            <button
              onClick={() => setCurrentMethod('abc')}
              className={`p-4 rounded-xl border-2 transition-all ${
                currentMethod === 'abc' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex gap-1 justify-center mb-2">
                <span className="w-2 h-6 bg-red-500 rounded-sm"></span>
                <span className="w-2 h-4 bg-yellow-500 rounded-sm"></span>
                <span className="w-2 h-2 bg-green-500 rounded-sm"></span>
              </div>
              <p className="font-semibold text-green-600">ABC</p>
            </button>
            <button
              onClick={() => setCurrentMethod('impact')}
              className={`p-4 rounded-xl border-2 transition-all ${
                currentMethod === 'impact' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <Zap className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="font-semibold text-purple-600">Impacto</p>
            </button>
          </div>
        </div>

        {/* Área do Jogo */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          {gamePhase === 'instruction' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">
                {currentMethod === 'eisenhower' && '📊 Matriz de Eisenhower'}
                {currentMethod === 'abc' && '🔤 Método ABC'}
                {currentMethod === 'impact' && '⚡ Impacto vs Esforço'}
              </h2>
              
              {currentMethod === 'eisenhower' && (
                <div>
                  <p className="mb-6">Classifique cada tarefa no quadrante correto:</p>
                  <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
                    <div className="p-3 bg-red-100 rounded-lg text-sm">
                      <strong>Q1:</strong> Urgente + Importante<br/>
                      <em>Fazer agora</em>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg text-sm">
                      <strong>Q2:</strong> Importante + Não Urgente<br/>
                      <em>Planejar</em>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg text-sm">
                      <strong>Q3:</strong> Urgente + Não Importante<br/>
                      <em>Delegar</em>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg text-sm">
                      <strong>Q4:</strong> Não Urgente + Não Importante<br/>
                      <em>Eliminar</em>
                    </div>
                  </div>
                </div>
              )}
              
              {currentMethod === 'abc' && (
                <div>
                  <p className="mb-6">Classifique cada tarefa por prioridade:</p>
                  <div className="space-y-3 mb-6 max-w-md mx-auto">
                    <div className="p-3 bg-red-100 rounded-lg text-sm">
                      <strong>A:</strong> Crítico - Deve ser feito, consequências sérias se não for
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg text-sm">
                      <strong>B:</strong> Importante - Deveria ser feito, consequências leves
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg text-sm">
                      <strong>C:</strong> Desejável - Seria bom fazer, sem consequências
                    </div>
                  </div>
                </div>
              )}
              
              {currentMethod === 'impact' && (
                <div>
                  <p className="mb-6">Ordene as tarefas priorizando alto impacto e baixo esforço:</p>
                  <div className="text-sm text-gray-600 mb-6">
                    Arraste e solte para reordenar da maior para menor prioridade
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setGamePhase('practice')}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Começar Prática
              </button>
            </div>
          )}

          {gamePhase === 'practice' && taskList.length > 0 && (
            <div>
              {currentMethod === 'eisenhower' && currentTaskIndex < taskList.length && (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">
                    Tarefa {currentTaskIndex + 1}/{taskList.length}
                  </h3>
                  
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <h4 className="text-lg font-semibold mb-2">{taskList[currentTaskIndex].title}</h4>
                    <p className="text-gray-600 mb-4">{taskList[currentTaskIndex].description}</p>
                    <div className="flex justify-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Urgência: {taskList[currentTaskIndex].urgency}/5
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Importância: {taskList[currentTaskIndex].importance}/5
                      </span>
                    </div>
                  </div>
                  
                  <p className="mb-4">Em qual quadrante esta tarefa se encaixa?</p>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {[1, 2, 3, 4].map(quadrant => (
                      <button
                        key={quadrant}
                        onClick={() => handleEisenhowerChoice(quadrant)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          quadrant === 1 ? 'bg-red-100 border-red-300 hover:bg-red-200' :
                          quadrant === 2 ? 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200' :
                          quadrant === 3 ? 'bg-orange-100 border-orange-300 hover:bg-orange-200' :
                          'bg-gray-100 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        <div className="font-semibold">Quadrante {quadrant}</div>
                        <div className="text-sm mt-1">
                          {quadrant === 1 && 'Urgente + Importante'}
                          {quadrant === 2 && 'Importante + Não Urgente'}
                          {quadrant === 3 && 'Urgente + Não Importante'}
                          {quadrant === 4 && 'Não Urgente + Não Importante'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentMethod === 'abc' && currentTaskIndex < taskList.length && (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">
                    Tarefa {currentTaskIndex + 1}/{taskList.length}
                  </h3>
                  
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <h4 className="text-lg font-semibold mb-2">{taskList[currentTaskIndex].title}</h4>
                    <p className="text-gray-600 mb-4">{taskList[currentTaskIndex].description}</p>
                    <div className="flex justify-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Urgência: {taskList[currentTaskIndex].urgency}/5
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Importância: {taskList[currentTaskIndex].importance}/5
                      </span>
                    </div>
                  </div>
                  
                  <p className="mb-4">Qual a prioridade desta tarefa?</p>
                  <div className="flex justify-center gap-4">
                    {(['A', 'B', 'C'] as const).map(category => (
                      <button
                        key={category}
                        onClick={() => handleABCChoice(category)}
                        className={`px-8 py-4 rounded-xl border-2 transition-all ${
                          category === 'A' ? 'bg-red-100 border-red-300 hover:bg-red-200' :
                          category === 'B' ? 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200' :
                          'bg-green-100 border-green-300 hover:bg-green-200'
                        }`}
                      >
                        <div className="text-2xl font-bold">{category}</div>
                        <div className="text-sm mt-1">
                          {category === 'A' && 'Crítico'}
                          {category === 'B' && 'Importante'}
                          {category === 'C' && 'Desejável'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentMethod === 'impact' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    Ordene por Prioridade (Impacto vs Esforço)
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    {sortedTasks.map((task, index) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 cursor-move hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-purple-500 text-white px-2 py-1 rounded text-sm font-semibold">
                                #{index + 1}
                              </span>
                              <h4 className="font-semibold">{task.title}</h4>
                            </div>
                            <p className="text-gray-600 text-sm">{task.description}</p>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Zap className="w-4 h-4 text-green-500" />
                              Impacto: {task.impact}/5
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-orange-500" />
                              Esforço: {task.effort}/5
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => handleImpactSort(sortedTasks)}
                      className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                    >
                      Confirmar Ordem
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {gamePhase === 'feedback' && (
            <div className="text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-6">Resultados</h2>
              
              <div className="space-y-3 mb-6">
                {results.map((result, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">
                      {taskList.find(t => t.id === result.taskId)?.title || 'Ordenação geral'}
                    </span>
                    <div className="text-sm">
                      <span className="text-gray-600">Sua escolha: {result.userChoice}</span>
                      <span className="mx-2">|</span>
                      <span className="text-gray-600">Correto: {result.correctChoice}</span>
                      <span className="mx-2">|</span>
                      <span className={`font-semibold ${result.accuracy === 100 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.accuracy === 100 ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={startNewRound}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Nova Rodada
                </button>
                <button
                  onClick={() => setCurrentMethod(currentMethod === 'eisenhower' ? 'abc' : currentMethod === 'abc' ? 'impact' : 'eisenhower')}
                  className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                >
                  Próximo Método
                </button>
              </div>
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
                <span>{score}/400</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((score / 400) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}