'use client'

import { useState, useEffect } from 'react'
import { Target, Trophy, RotateCcw, Zap, Clock, AlertTriangle, Star } from 'lucide-react'
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE PADRÃO "GAMEHEADER" (COPIADO DO NOSSO LOG)
// ============================================================================
const GameHeader = ({ title, icon }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        {/* 1. Botão Voltar (Esquerda) */}
        <Link
          href="/dashboard"
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </Link>
        {/* 2. Título Centralizado (Meio) */}
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h1>
        {/* 3. Espaçador (Direita) */}
        <div className="w-24"></div>
      </div>
    </div>
  </header>
);


// ============================================================================
// 2. INTERFACES E DADOS DA ATIVIDADE (LÓGICA ORIGINAL MANTIDA)
// ============================================================================
interface Task {
  id: number
  title: string
  description: string
  urgency: number // 1-5
  importance: number // 1-5
  effort: number // 1-5
  impact: number // 1-5
}

interface PrioritizationResult {
  taskId: number
  userChoice: string
  correctChoice: string
  accuracy: number
}

const sampleTasks: Task[] = [
    { id: 1, title: "Reunião com o chefe", description: "Reunião urgente para discutir projeto atrasado", urgency: 5, importance: 5, effort: 2, impact: 5 },
    { id: 2, title: "Responder emails", description: "Verificar e responder emails acumulados", urgency: 3, importance: 2, effort: 2, impact: 2 },
    { id: 3, title: "Planejar férias", description: "Pesquisar destinos e fazer reservas", urgency: 1, importance: 2, effort: 4, impact: 3 },
    { id: 4, title: "Curso de capacitação", description: "Iniciar curso online para desenvolvimento profissional", urgency: 2, importance: 5, effort: 5, impact: 5 },
    { id: 5, title: "Organizar mesa", description: "Limpar e organizar espaço de trabalho", urgency: 2, importance: 3, effort: 1, impact: 2 },
    { id: 6, title: "Ligação para cliente", description: "Cliente insatisfeito precisa de resposta hoje", urgency: 5, importance: 4, effort: 1, impact: 4 },
    { id: 7, title: "Exercícios físicos", description: "Ir à academia ou fazer caminhada", urgency: 2, importance: 4, effort: 3, impact: 4 },
    { id: 8, title: "Relatório mensal", description: "Preparar relatório que vence amanhã", urgency: 4, importance: 4, effort: 3, impact: 3 }
]

// ============================================================================
// 3. COMPONENTE PRINCIPAL DA ATIVIDADE "PRIORIZAÇÃO DE TAREFAS"
// ============================================================================
export default function PriorizacaoTarefasPage() {
  const [gameStarted, setGameStarted] = useState(false)
  const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(null)

  const [score, setScore] = useState(0)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [results, setResults] = useState<PrioritizationResult[]>([])
  const [taskList, setTaskList] = useState<Task[]>([])
  const [sortedTasks, setSortedTasks] = useState<Task[]>([])
  const [gamePhase, setGamePhase] = useState<'practice' | 'feedback'>('practice')

  const currentMethod = nivelSelecionado === 1 ? 'eisenhower' : nivelSelecionado === 2 ? 'abc' : 'impact'

  // Funções de cálculo (lógica original)
  const getCorrectQuadrant = (task: Task): number => {
    if (task.urgency >= 4 && task.importance >= 4) return 1
    if (task.urgency < 4 && task.importance >= 4) return 2
    if (task.urgency >= 4 && task.importance < 4) return 3
    return 4
  }

  const getCorrectCategory = (task: Task): 'A' | 'B' | 'C' => {
    const priority = (task.importance * 0.6) + (task.urgency * 0.4)
    if (priority >= 4) return 'A'
    if (priority >= 2.5) return 'B'
    return 'C'
  }

  const getImpactEffortScore = (task: Task): number => (task.impact * 2) - task.effort

  // Funções de controle do jogo (lógica original adaptada)
  const startNewRound = () => {
    const shuffledTasks = [...sampleTasks].sort(() => Math.random() - 0.5)
    setTaskList(shuffledTasks.slice(0, 5))
    setCurrentTaskIndex(0)
    setResults([])
    setGamePhase('practice')
    if(currentMethod === 'impact') {
        setSortedTasks(shuffledTasks.slice(0, 5))
    }
  }

  const handleStartActivity = () => {
    if (nivelSelecionado !== null) {
      setScore(0);
      startNewRound();
      setGameStarted(true);
    }
  };

  const handleReturnToMenu = () => {
      setGameStarted(false);
      setNivelSelecionado(null);
      setScore(0);
  }

  useEffect(() => {
    if (gameStarted) {
      startNewRound()
    }
  }, [gameStarted, nivelSelecionado])


  // Handlers de resposta (lógica original)
  const handleEisenhowerChoice = (quadrant: number) => {
    const currentTask = taskList[currentTaskIndex]
    const correctQuadrant = getCorrectQuadrant(currentTask)
    const accuracy = quadrant === correctQuadrant ? 100 : 0
    
    setResults(prev => [...prev, { taskId: currentTask.id, userChoice: `Q${quadrant}`, correctChoice: `Q${correctQuadrant}`, accuracy }])
    setScore(prev => prev + (accuracy === 100 ? 20 : 0))
    
    if (currentTaskIndex < taskList.length - 1) {
      setCurrentTaskIndex(prev => prev + 1)
    } else {
      setGamePhase('feedback')
    }
  }

  const handleABCChoice = (category: 'A' | 'B' | 'C') => {
    const currentTask = taskList[currentTaskIndex]
    const correctCategory = getCorrectCategory(currentTask)
    const accuracy = category === correctCategory ? 100 : 0
    
    setResults(prev => [...prev, { taskId: currentTask.id, userChoice: category, correctChoice: correctCategory, accuracy }])
    setScore(prev => prev + (accuracy === 100 ? 20 : 0))

    if (currentTaskIndex < taskList.length - 1) {
      setCurrentTaskIndex(prev => prev + 1)
    } else {
      setGamePhase('feedback')
    }
  }

  const handleImpactSort = (sortedList: Task[]) => {
    const correctOrder = [...taskList].sort((a, b) => getImpactEffortScore(b) - getImpactEffortScore(a))
    let correctPositions = 0
    sortedList.forEach((task, index) => {
      if (task.id === correctOrder[index].id) correctPositions++
    })
    
    const accuracy = (correctPositions / taskList.length) * 100
    setScore(prev => prev + Math.round(accuracy))
    
    setResults([{ taskId: 0, userChoice: 'Sua Ordem', correctChoice: 'Ordem Ideal', accuracy }])
    setGamePhase('feedback')
  }

  // Handlers de Drag & Drop (lógica original)
  const handleDragStart = (e: React.DragEvent, task: Task) => e.dataTransfer.setData('text/plain', task.id.toString())
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()
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

  // ============================================================================
  // 4. RENDERIZAÇÃO DO COMPONENTE
  // ============================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Priorização de Tarefas" icon={<Target className="w-6 h-6 text-gray-700" />} />

      {/* SEÇÃO DO JOGO ATIVO */}
      {gameStarted ? (
        <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
            {/* HUD do Jogo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                    <h3 className="text-sm font-medium text-gray-500">Pontuação</h3>
                    <p className="text-2xl font-bold text-blue-600">{score}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                    <h3 className="text-sm font-medium text-gray-500">Acertos</h3>
                    <p className="text-2xl font-bold text-green-600">{results.filter(r => r.accuracy === 100).length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md text-center">
                    <h3 className="text-sm font-medium text-gray-500">Progresso</h3>
                    <p className="text-2xl font-bold text-purple-600">{results.length}/{taskList.length}</p>
                </div>
                 <button
                    onClick={handleReturnToMenu}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:bg-red-50 text-red-600 transition-colors font-semibold"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Sair
                </button>
            </div>
          
            {/* Área do Jogo */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
                {/* Lógica de Feedback */}
                {gamePhase === 'feedback' && (
                     <div className="text-center">
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-6">Resultados da Rodada</h2>
                        <div className="space-y-3 mb-6">
                          {results.map((result, index) => (
                            <div key={index} className="flex flex-col sm:flex-row justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="font-semibold text-sm mb-2 sm:mb-0">
                                {taskList.find(t => t.id === result.taskId)?.title || 'Ordenação Geral'}
                              </span>
                              <div className="text-sm text-center sm:text-right">
                                <span className={`${result.accuracy === 100 ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                                  {result.accuracy === 100 ? '✓ Acertou!' : `✗ Sua resposta: ${result.userChoice}`}
                                </span>
                                {result.accuracy !== 100 && (
                                     <span className="text-gray-600 ml-2">(Correto: {result.correctChoice})</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-center gap-4">
                            <button onClick={startNewRound} className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                                Jogar Novamente
                            </button>
                            <button onClick={handleReturnToMenu} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
                                Mudar de Nível
                            </button>
                        </div>
                    </div>
                )}
                {/* Lógica do Jogo em Prática */}
                {gamePhase === 'practice' && taskList.length > 0 && (
                    <>
                    {/* Prática com Eisenhower */}
                    {currentMethod === 'eisenhower' && (
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-4">Tarefa {currentTaskIndex + 1}/{taskList.length}</h3>
                            <div className="bg-gray-50 p-6 rounded-xl mb-6">
                                <h4 className="text-lg font-semibold mb-2">{taskList[currentTaskIndex].title}</h4>
                                <p className="text-gray-600 mb-4">{taskList[currentTaskIndex].description}</p>
                                <div className="flex justify-center gap-4 text-sm">
                                    <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-red-500" /> Urgência: {taskList[currentTaskIndex].urgency}/5</span>
                                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> Importância: {taskList[currentTaskIndex].importance}/5</span>
                                </div>
                            </div>
                            <p className="mb-4 font-medium">Em qual quadrante esta tarefa se encaixa?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                                {[1, 2, 3, 4].map(q => (
                                <button key={q} onClick={() => handleEisenhowerChoice(q)} className={`p-4 rounded-xl border-2 transition-all ${q === 1 ? 'bg-red-50 border-red-200 hover:bg-red-100' : q === 2 ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' : q === 3 ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}>
                                    <div className="font-semibold">Quadrante {q}</div>
                                    <div className="text-xs mt-1 text-gray-600">
                                        {q === 1 && 'Urgente e Importante'}
                                        {q === 2 && 'Importante, Não Urgente'}
                                        {q === 3 && 'Urgente, Não Importante'}
                                        {q === 4 && 'Não Urgente, Não Importante'}
                                    </div>
                                </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Prática com ABC */}
                    {currentMethod === 'abc' && (
                        <div className="text-center">
                             <h3 className="text-xl font-semibold mb-4">Tarefa {currentTaskIndex + 1}/{taskList.length}</h3>
                            <div className="bg-gray-50 p-6 rounded-xl mb-6">
                                <h4 className="text-lg font-semibold mb-2">{taskList[currentTaskIndex].title}</h4>
                                <p className="text-gray-600 mb-4">{taskList[currentTaskIndex].description}</p>
                                <div className="flex justify-center gap-4 text-sm">
                                    <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-red-500" /> Urgência: {taskList[currentTaskIndex].urgency}/5</span>
                                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> Importância: {taskList[currentTaskIndex].importance}/5</span>
                                </div>
                            </div>
                            <p className="mb-4 font-medium">Qual a prioridade desta tarefa?</p>
                            <div className="flex justify-center gap-4">
                                {/* BOTÕES CORRIGIDOS ABAIXO */}
                                {(['A', 'B', 'C'] as const).map(c => (
                                <button key={c} onClick={() => handleABCChoice(c)} className={`px-8 py-4 rounded-xl border-2 transition-all ${c === 'A' ? 'bg-red-100 border-red-300 hover:bg-red-200' : c === 'B' ? 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200' : 'bg-green-100 border-green-300 hover:bg-green-200'}`}>
                                    <div className="text-2xl font-bold">{c}</div>
                                    <div className="text-sm mt-1">
                                        {c === 'A' && 'Crítico'}
                                        {c === 'B' && 'Importante'}
                                        {c === 'C' && 'Desejável'}
                                    </div>
                                </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Prática com Impacto vs Esforço */}
                    {currentMethod === 'impact' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-center">Ordene por Prioridade (Impacto vs Esforço)</h3>
                            <div className="space-y-3 mb-6">
                                {sortedTasks.map((task, index) => (
                                <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index)} className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 cursor-move hover:bg-gray-100 transition-colors">
                                    <h4 className="font-semibold">{task.title}</h4>
                                    <div className="flex gap-4 text-sm mt-2">
                                        <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-green-500" /> Impacto: {task.impact}/5</span>
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-orange-500" /> Esforço: {task.effort}/5</span>
                                    </div>
                                </div>
                                ))}
                            </div>
                            <div className="text-center">
                                <button onClick={() => handleImpactSort(sortedTasks)} className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors">
                                Confirmar Ordem
                                </button>
                            </div>
                        </div>
                    )}
                    </>
                )}
            </div>
        </main>
      ) : (
        
        // SEÇÃO DA TELA INICIAL PADRONIZADA
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            {/* Bloco 1: Cards Informativos */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card de Objetivo */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                  <p className="text-sm text-gray-600">
                    Aprender a distinguir tarefas urgentes e importantes usando técnicas comprovadas para melhorar o foco e a produtividade.
                  </p>
                </div>
                {/* Card de Como Jogar */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Escolha um método de priorização como nível.</li>
                    <li>Analise a urgência e importância de cada tarefa.</li>
                    <li>Classifique ou ordene as tarefas para ganhar pontos.</li>
                  </ul>
                </div>
                {/* Card de Avaliação/Progresso */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                  <p className="text-sm text-gray-600">
                    Sua pontuação é baseada na precisão das suas classificações. Quanto mais rápido e correto, mais pontos você ganha!
                  </p>
                </div>
              </div>
            </div>

            {/* Bloco 2: Seleção de Nível */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível (Método)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setNivelSelecionado(1)}
                  className={`p-4 rounded-lg font-medium transition-colors text-left ${nivelSelecionado === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-sm font-bold">Nível 1: Eisenhower</div>
                  <div className="text-xs opacity-80">Clássico e eficaz</div>
                </button>
                <button
                  onClick={() => setNivelSelecionado(2)}
                  className={`p-4 rounded-lg font-medium transition-colors text-left ${nivelSelecionado === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  <div className="text-2xl mb-1">🔤</div>
                  <div className="text-sm font-bold">Nível 2: Método ABC</div>
                  <div className="text-xs opacity-80">Simples e direto</div>
                </button>
                 <button
                  onClick={() => setNivelSelecionado(3)}
                  className={`p-4 rounded-lg font-medium transition-colors text-left ${nivelSelecionado === 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-sm font-bold">Nível 3: Impacto vs. Esforço</div>
                  <div className="text-xs opacity-80">Estratégico e rápido</div>
                </button>
              </div>
            </div>

            {/* Bloco 3: Botão Iniciar */}
            <div className="text-center pt-4">
              <button
                onClick={handleStartActivity}
                disabled={nivelSelecionado === null}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
              >
                🚀 Iniciar Atividade
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
