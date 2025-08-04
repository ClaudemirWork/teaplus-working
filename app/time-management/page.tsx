'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw, Clock, Target, Award, Brain, BookOpen, Timer, CheckCircle, XCircle, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TimeEstimate {
  task: string
  estimatedTime: number
  actualTime: number
  accuracy: number
}

export default function GestaoTempo() {
  const router = useRouter()
  const [showActivity, setShowActivity] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<'focus' | 'estimation' | 'perception'>('focus')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  
  // Estados da Técnica de Foco
  const [focusTime, setFocusTime] = useState(25 * 60) // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentSession, setCurrentSession] = useState<'work' | 'break'>('work')
  const [completedSessions, setCompletedSessions] = useState(0)
  
  // Estados da Estimativa de Tempo
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [actualTime, setActualTime] = useState(0)
  const [isTimingTask, setIsTimingTask] = useState(false)
  const [taskStartTime, setTaskStartTime] = useState<Date | null>(null)
  const [timeEstimates, setTimeEstimates] = useState<TimeEstimate[]>([])
  
  // Estados da Percepção Temporal
  const [targetDuration, setTargetDuration] = useState(30) // segundos
  const [userDuration, setUserDuration] = useState(0)
  const [isCountingTime, setIsCountingTime] = useState(false)
  const [timeStarted, setTimeStarted] = useState<Date | null>(null)
  const [perceptionResults, setPerceptionResults] = useState<Array<{target: number, actual: number, accuracy: number}>>([])

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const tasks = [
    "Ler um email importante",
    "Organizar a mesa de trabalho",
    "Fazer uma ligação rápida",
    "Escrever um parágrafo",
    "Procurar um documento",
    "Responder uma mensagem",
    "Verificar a agenda do dia",
    "Fazer um lanche rápido"
  ]

  // Efeito do timer da Técnica de Foco
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setFocusTime(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            if (currentSession === 'work') {
              setCompletedSessions(prev => prev + 1)
              setCurrentSession('break')
              setFocusTime(5 * 60) // 5 minutos de pausa
              setScore(prev => prev + 25)
            } else {
              setCurrentSession('work')
              setFocusTime(25 * 60) // Volta para 25 minutos
            }
            return prev - 1
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, isPaused, currentSession])

  // Funções da Técnica de Foco
  const startFocusSession = () => {
    setIsRunning(true)
    setIsPaused(false)
  }

  const pauseFocusSession = () => {
    setIsPaused(!isPaused)
  }

  const resetFocusSession = () => {
    setIsRunning(false)
    setIsPaused(false)
    setFocusTime(currentSession === 'work' ? 25 * 60 : 5 * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Funções da Estimativa de Tempo
  const startTaskTiming = () => {
    if (estimatedTime === 0) {
      alert('Por favor, estime quantos minutos levará para fazer esta tarefa')
      return
    }
    
    setIsTimingTask(true)
    setTaskStartTime(new Date())
    setActualTime(0)
    
    // Iniciar cronômetro
    intervalRef.current = setInterval(() => {
      setActualTime(prev => prev + 1)
    }, 1000)
  }

  const finishTask = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsTimingTask(false)
    
    const actualMinutes = actualTime / 60
    const accuracy = Math.max(0, 100 - Math.abs(estimatedTime - actualMinutes) * 10)
    
    const newEstimate: TimeEstimate = {
      task: tasks[currentTaskIndex],
      estimatedTime: estimatedTime,
      actualTime: actualMinutes,
      accuracy: accuracy
    }
    
    setTimeEstimates(prev => [...prev, newEstimate])
    setScore(prev => prev + Math.round(accuracy / 4))
    
    // Próxima tarefa
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1)
      setEstimatedTime(0)
      setActualTime(0)
    }
  }

  // Funções da Percepção Temporal
  const startTimePerception = () => {
    setIsCountingTime(true)
    setTimeStarted(new Date())
    setUserDuration(0)
    
    intervalRef.current = setInterval(() => {
      setUserDuration(prev => prev + 1)
    }, 1000)
  }

  const stopTimePerception = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsCountingTime(false)
    
    const accuracy = Math.max(0, 100 - Math.abs(targetDuration - userDuration) * 2)
    
    setPerceptionResults(prev => [...prev, {
      target: targetDuration,
      actual: userDuration,
      accuracy: accuracy
    }])
    
    setScore(prev => prev + Math.round(accuracy / 5))
    
    // Próximo desafio
    const newTarget = 15 + Math.floor(Math.random() * 60) // Entre 15 e 75 segundos
    setTargetDuration(newTarget)
    setUserDuration(0)
  }

  const resetActivity = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setScore(0)
    setLevel(1)
    setCompletedSessions(0)
    setCurrentTaskIndex(0)
    setTimeEstimates([])
    setPerceptionResults([])
    setIsRunning(false)
    setIsPaused(false)
    setIsTimingTask(false)
    setIsCountingTime(false)
    setFocusTime(25 * 60)
    setCurrentSession('work')
    setEstimatedTime(0)
    setActualTime(0)
    setUserDuration(0)
    setShowActivity(false)
  }

  if (!showActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
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
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Gestão de Tempo</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Objetivo */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-400">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">Objetivo:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Desenvolver habilidades de gestão temporal essenciais para pessoas com TDAH através 
                de técnicas práticas como sessões de foco, estimativa de tempo e percepção temporal. 
                Melhore sua capacidade de planejar, estimar e controlar o tempo de forma mais eficiente.
              </p>
            </div>

            {/* Pontuação */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-400">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">Pontuação:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Ganhe pontos completando sessões de foco, melhorando estimativas de tempo e 
                desenvolvendo percepção temporal. Cada atividade recompensa progresso 
                e precisão temporal.
              </p>
            </div>
          </div>

          {/* Atividades */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-purple-400">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">⏰</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Atividades:</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-red-600">Técnica de Foco</h3>
                  <p className="text-gray-600 text-sm">25min trabalho + 5min pausa estruturada</p>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  Concentração
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-orange-600">Estimativa de Tempo</h3>
                  <p className="text-gray-600 text-sm">Prever vs tempo real de tarefas</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Precisão
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-purple-600">Percepção Temporal</h3>
                  <p className="text-gray-600 text-sm">Desenvolver senso interno de tempo</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Intuição
                </span>
              </div>
            </div>
          </div>

          {/* Base Científica */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-blue-400">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Base Científica:</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Pessoas com TDAH frequentemente têm dificuldades com percepção temporal e estimativa de duração. 
              A técnica de intervalos estruturados de trabalho e exercícios de estimativa temporal são estratégias 
              baseadas em evidências que melhoram o controle executivo, reduzem procrastinação e aumentam a produtividade.
            </p>
          </div>

          {/* Botão Começar */}
          <div className="mt-8 text-center">
            <button 
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
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
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Gestão de Tempo</h1>
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
            <p className="text-2xl font-bold text-orange-600">{score}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Sessões</h3>
            <p className="text-2xl font-bold text-red-600">{completedSessions}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Nível</h3>
            <p className="text-2xl font-bold text-purple-600">{level}</p>
          </div>
        </div>

        {/* Seletor de Atividade */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Escolha a Atividade:</h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentActivity('focus')}
              className={`p-4 rounded-xl border-2 transition-all ${
                currentActivity === 'focus' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-red-300'
              }`}
            >
              <Timer className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <p className="font-semibold text-red-600">Foco</p>
            </button>
            <button
              onClick={() => setCurrentActivity('estimation')}
              className={`p-4 rounded-xl border-2 transition-all ${
                currentActivity === 'estimation' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <Target className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <p className="font-semibold text-orange-600">Estimativa</p>
            </button>
            <button
              onClick={() => setCurrentActivity('perception')}
              className={`p-4 rounded-xl border-2 transition-all ${
                currentActivity === 'perception' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <Brain className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="font-semibold text-purple-600">Percepção</p>
            </button>
          </div>
        </div>

        {/* Atividade Técnica de Foco */}
        {currentActivity === 'focus' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6 text-red-600">
                {currentSession === 'work' ? '🎯 Sessão de Foco' : '☕ Pausa Ativa'}
              </h2>
              
              <div className="text-6xl font-mono font-bold text-gray-800 mb-8">
                {formatTime(focusTime)}
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                {!isRunning ? (
                  <button
                    onClick={startFocusSession}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-green-600 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Iniciar
                  </button>
                ) : (
                  <button
                    onClick={pauseFocusSession}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-yellow-600 transition-colors"
                  >
                    <Pause className="w-5 h-5" />
                    {isPaused ? 'Continuar' : 'Pausar'}
                  </button>
                )}
                
                <button
                  onClick={resetFocusSession}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Sessões completadas: {completedSessions}</p>
                <p className="mt-2">
                  {currentSession === 'work' 
                    ? 'Foque em uma tarefa específica por 25 minutos' 
                    : 'Relaxe e descanse por 5 minutos'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Atividade Estimativa de Tempo */}
        {currentActivity === 'estimation' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">📊 Estimativa de Tempo</h2>
            
            {currentTaskIndex < tasks.length ? (
              <div className="text-center">
                <div className="bg-orange-50 p-6 rounded-xl mb-6">
                  <h3 className="text-xl font-semibold mb-4">Tarefa {currentTaskIndex + 1}/{tasks.length}:</h3>
                  <p className="text-lg text-gray-700">{tasks[currentTaskIndex]}</p>
                </div>
                
                {!isTimingTask ? (
                  <div>
                    <p className="mb-4">Quantos minutos você acha que levará para fazer esta tarefa?</p>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <input
                        type="number"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(Number(e.target.value))}
                        className="w-20 p-2 border border-gray-300 rounded-lg text-center"
                        min="0.5"
                        max="60"
                        step="0.5"
                      />
                      <span>minutos</span>
                    </div>
                    <button
                      onClick={startTaskTiming}
                      className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Começar Tarefa
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl font-mono font-bold text-gray-800 mb-6">
                      ⏱️ {formatTime(actualTime)}
                    </p>
                    <p className="mb-4">Execute a tarefa e clique em "Terminar" quando concluir</p>
                    <button
                      onClick={finishTask}
                      className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                    >
                      Terminar Tarefa
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Estimativas Concluídas!</h3>
                <div className="space-y-2">
                  {timeEstimates.map((estimate, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">{estimate.task}</span>
                      <div className="text-sm">
                        <span className="text-gray-600">Est: {estimate.estimatedTime}min</span>
                        <span className="mx-2">|</span>
                        <span className="text-gray-600">Real: {estimate.actualTime.toFixed(1)}min</span>
                        <span className="mx-2">|</span>
                        <span className={`font-semibold ${estimate.accuracy > 70 ? 'text-green-600' : 'text-red-600'}`}>
                          {estimate.accuracy.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Atividade Percepção Temporal */}
        {currentActivity === 'perception' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-6 text-purple-600 text-center">🧠 Percepção Temporal</h2>
            
            <div className="text-center">
              <div className="bg-purple-50 p-6 rounded-xl mb-6">
                <p className="text-lg mb-4">
                  Desafio: Pare o cronômetro o mais próximo possível de 
                  <span className="font-bold text-purple-600"> {targetDuration} segundos</span>
                </p>
                <p className="text-sm text-gray-600">
                  Use seu senso interno de tempo - não conte mentalmente!
                </p>
              </div>
              
              {!isCountingTime ? (
                <div>
                  <button
                    onClick={startTimePerception}
                    className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                  >
                    Iniciar Contagem
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-4xl font-mono font-bold text-gray-800 mb-6">
                    ⏱️ {userDuration}s
                  </p>
                  <button
                    onClick={stopTimePerception}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                  >
                    Parar Agora!
                  </button>
                </div>
              )}
              
              {perceptionResults.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Últimos Resultados:</h4>
                  <div className="space-y-2">
                    {perceptionResults.slice(-5).map((result, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Meta: {result.target}s</span>
                        <span className="text-sm">Você: {result.actual}s</span>
                        <span className={`text-sm font-semibold ${result.accuracy > 70 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.accuracy.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Progresso Geral</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Pontuação Total</span>
                <span>{score}/500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((score / 500) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}