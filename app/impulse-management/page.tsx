'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw, Award, Target, Clock, Zap, CheckCircle, Hand } from 'lucide-react'
import Link from 'next/link'

const ImpulseControlPage = () => {
  const [gameState, setGameState] = useState<'intro' | 'instructions' | 'playing' | 'paused' | 'finished'>('intro')
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [currentTask, setCurrentTask] = useState<{
    type: 'go' | 'nogo' | 'delay' | 'choice',
    stimulus: string,
    color: string,
    shouldRespond: boolean,
    delay?: number
  } | null>(null)
  const [responses, setResponses] = useState({correct: 0, incorrect: 0, premature: 0, missed: 0})
  const [showStimulus, setShowStimulus] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  
  const stimulusTimerRef = useRef<NodeJS.Timeout | null>(null)
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null)
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null)

  const stimuli = {
    go: ['🟢', '✅', '🚀', '⚡'],
    nogo: ['🔴', '❌', '🛑', '⛔'],
    choice: ['🔵', '🟡', '🟣', '🟠']
  }

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      gameTimerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishGame()
    }

    return () => {
      if (gameTimerRef.current) clearTimeout(gameTimerRef.current)
    }
  }, [timeLeft, gameState])

  const generateTask = () => {
    const taskTypes = ['go', 'nogo', 'delay', 'choice']
    const weights = [0.3, 0.4, 0.2, 0.1] // More nogo tasks to test impulse control
    
    let randomValue = Math.random()
    let taskType = 'go'
    
    for (let i = 0; i < taskTypes.length; i++) {
      if (randomValue < weights[i]) {
        taskType = taskTypes[i]
        break
      }
      randomValue -= weights[i]
    }

    let stimulus = ''
    let color = ''
    let shouldRespond = false
    let delay = undefined

    switch (taskType) {
      case 'go':
        stimulus = stimuli.go[Math.floor(Math.random() * stimuli.go.length)]
        color = 'text-green-500'
        shouldRespond = true
        break
      case 'nogo':
        stimulus = stimuli.nogo[Math.floor(Math.random() * stimuli.nogo.length)]
        color = 'text-red-500'
        shouldRespond = false
        break
      case 'delay':
        stimulus = '⏰'
        color = 'text-yellow-500'
        shouldRespond = true
        delay = 1000 + (Math.random() * 2000) // 1-3 seconds delay
        break
      case 'choice':
        stimulus = stimuli.choice[Math.floor(Math.random() * stimuli.choice.length)]
        color = stimulus === '🔵' ? 'text-blue-500' : stimulus === '🟡' ? 'text-yellow-500' : stimulus === '🟣' ? 'text-purple-500' : 'text-orange-500'
        shouldRespond = stimulus === '🔵' || stimulus === '🟡' // Only respond to blue and yellow
        break
    }

    return { type: taskType as any, stimulus, color, shouldRespond, delay }
  }

  const startRound = () => {
    const task = generateTask()
    setCurrentTask(task)
    setShowStimulus(false)
    
    if (task.type === 'delay' && task.delay) {
      // Show countdown for delay tasks
      let count = Math.ceil(task.delay / 1000)
      setCountdown(count)
      
      const countInterval = setInterval(() => {
        count--
        setCountdown(count)
        if (count <= 0) {
          clearInterval(countInterval)
          setCountdown(0)
          setShowStimulus(true)
          setupStimulusTimer()
        }
      }, 1000)
    } else {
      setShowStimulus(true)
      setupStimulusTimer()
    }
  }

  const setupStimulusTimer = () => {
    const displayTime = Math.max(2000 - (currentLevel * 100), 1000)
    stimulusTimerRef.current = setTimeout(() => {
      if (currentTask && currentTask.shouldRespond) {
        // Missed response
        setResponses(prev => ({...prev, missed: prev.missed + 1}))
        setStreak(0)
      }
      setShowStimulus(false)
      setTimeout(() => startRound(), 800)
    }, displayTime)
  }

  const handleResponse = () => {
    if (!currentTask || !showStimulus) {
      // Premature response
      setResponses(prev => ({...prev, premature: prev.premature + 1}))
      setStreak(0)
      return
    }

    if (stimulusTimerRef.current) {
      clearTimeout(stimulusTimerRef.current)
    }

    if (currentTask.shouldRespond) {
      // Correct response
      setScore(prev => prev + 10 + (currentLevel * 5) + (streak * 2))
      setResponses(prev => ({...prev, correct: prev.correct + 1}))
      setStreak(prev => {
        const newStreak = prev + 1
        setMaxStreak(current => Math.max(current, newStreak))
        return newStreak
      })
      
      // Level up every 15 correct responses
      if (responses.correct > 0 && (responses.correct + 1) % 15 === 0) {
        setCurrentLevel(prev => Math.min(prev + 1, 5))
      }
    } else {
      // Incorrect response (should not have responded)
      setResponses(prev => ({...prev, incorrect: prev.incorrect + 1}))
      setStreak(0)
    }

    setShowStimulus(false)
    setTimeout(() => startRound(), 800)
  }

  const startGame = () => {
    setGameState('playing')
    setTimeLeft(90)
    setCurrentLevel(1)
    setScore(0)
    setResponses({correct: 0, incorrect: 0, premature: 0, missed: 0})
    setStreak(0)
    setMaxStreak(0)
    setTimeout(() => startRound(), 1000)
  }

  const pauseGame = () => {
    setGameState('paused')
    if (stimulusTimerRef.current) clearTimeout(stimulusTimerRef.current)
    if (gameTimerRef.current) clearTimeout(gameTimerRef.current)
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current)
  }

  const resumeGame = () => {
    setGameState('playing')
  }

  const finishGame = () => {
    setGameState('finished')
    if (stimulusTimerRef.current) clearTimeout(stimulusTimerRef.current)
    if (gameTimerRef.current) clearTimeout(gameTimerRef.current)
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current)
  }

  const resetGame = () => {
    setGameState('intro')
    setCurrentLevel(1)
    setScore(0)
    setTimeLeft(90)
    setCurrentTask(null)
    setShowStimulus(false)
    setCountdown(0)
    setResponses({correct: 0, incorrect: 0, premature: 0, missed: 0})
    setStreak(0)
    setMaxStreak(0)
  }

  const accuracy = responses.correct + responses.incorrect > 0 
    ? Math.round((responses.correct / (responses.correct + responses.incorrect)) * 100)
    : 0

  const getTaskInstruction = () => {
    if (!currentTask) return ''
    
    switch (currentTask.type) {
      case 'go': return 'CLIQUE AGORA!'
      case 'nogo': return 'NÃO CLIQUE!'
      case 'delay': return countdown > 0 ? `AGUARDE... ${countdown}` : 'CLIQUE AGORA!'
      case 'choice': return currentTask.shouldRespond ? 'CLIQUE!' : 'NÃO CLIQUE!'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/tdah" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">⚡ Controle de Impulsos</h1>
                <p className="text-gray-600 mt-1">Manejo de impulsividade</p>
              </div>
            </div>
            
            {gameState === 'playing' && (
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Tempo</div>
                  <div className="text-2xl font-bold text-gray-900">{timeLeft}s</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Pontuação</div>
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Sequência</div>
                  <div className="text-2xl font-bold text-purple-600">{streak}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Nível</div>
                  <div className="text-2xl font-bold text-orange-600">{currentLevel}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {gameState === 'intro' && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Hand className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sobre este exercício</h2>
                  <p className="text-gray-600">Teste Go/No-Go avançado para impulsos</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-500" />
                    Objetivo
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Desenvolver controle inibitório através de tarefas que exigem respostas rápidas 
                    ou contenção de impulsos, com diferentes tipos de estímulos e situações.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Benefícios
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Fortalece controle inibitório
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Reduz impulsividade
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Melhora tomada de decisão
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Treina paciência e timing
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Duração</div>
                  <div className="text-sm text-gray-600">10-15 minutos</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Target className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Dificuldade</div>
                  <div className="text-sm text-gray-600">Avançado</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Zap className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Tipos</div>
                  <div className="text-sm text-gray-600">4 variações</div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-900 mb-4">🎯 Tipos de tarefa</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🟢</span>
                      <div>
                        <div className="font-medium text-orange-800">GO - Clique</div>
                        <div className="text-sm text-orange-600">Responda rapidamente</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔴</span>
                      <div>
                        <div className="font-medium text-orange-800">NO-GO - Não clique</div>
                        <div className="text-sm text-orange-600">Controle o impulso</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <div className="font-medium text-orange-800">DELAY - Aguarde</div>
                        <div className="text-sm text-orange-600">Espere o sinal</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔵</span>
                      <div>
                        <div className="font-medium text-orange-800">CHOICE - Selecione</div>
                        <div className="text-sm text-orange-600">Apenas azul/amarelo</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameState('instructions')}
                className="bg-orange-600 hover:bg-orange-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-colors"
              >
                Ver instruções
              </button>
            </div>
          </div>
        )}

        {gameState === 'instructions' && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">📋 Como controlar os impulsos</h2>
              
              <div className="space-y-8">
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">🟢 Tarefas GO (Clique)</h3>
                  <p className="text-green-800 mb-3">
                    Quando ver símbolos verdes (🟢, ✅, 🚀, ⚡), clique IMEDIATAMENTE.
                  </p>
                  <p className="text-sm text-green-700">
                    Teste de velocidade de resposta - seja rápido mas preciso.
                  </p>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">🔴 Tarefas NO-GO (Não clique)</h3>
                  <p className="text-red-800 mb-3">
                    Quando ver símbolos vermelhos (🔴, ❌, 🛑, ⛔), NÃO CLIQUE.
                  </p>
                  <p className="text-sm text-red-700">
                    Teste de controle inibitório - resista ao impulso de clicar.
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4">⏰ Tarefas DELAY (Aguarde)</h3>
                  <p className="text-yellow-800 mb-3">
                    Quando ver o relógio (⏰), aguarde a contagem regressiva terminar antes de clicar.
                  </p>
                  <p className="text-sm text-yellow-700">
                    Teste de paciência - clique apenas quando a instrução mudar.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">🔵 Tarefas CHOICE (Selecione)</h3>
                  <p className="text-blue-800 mb-3">
                    Clique apenas em círculos AZUIS (🔵) ou AMARELOS (🟡). 
                    Ignore roxos (🟣) e laranjas (🟠).
                  </p>
                  <p className="text-sm text-blue-700">
                    Teste de discriminação - escolha apenas os alvos corretos.
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">⚡ Dicas importantes</h3>
                  <div className="space-y-2 text-purple-800">
                    <p>• Leia sempre a instrução que aparece na tela</p>
                    <p>• Cliques prematuros (antes do estímulo) são penalizados</p>
                    <p>• Construa sequências de acertos para bônus</p>
                    <p>• A velocidade aumenta conforme você avança de nível</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setGameState('intro')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-medium transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={startGame}
                className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Iniciar exercício
              </button>
            </div>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'paused') && (
          <div className="space-y-8">
            {gameState === 'paused' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <div className="text-lg font-semibold text-yellow-800 mb-4">⏸️ Jogo pausado</div>
                <button
                  onClick={resumeGame}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                >
                  Continuar
                </button>
              </div>
            )}

            <div className="bg-gray-50 rounded-2xl p-16 border border-gray-200 text-center min-h-[400px] flex flex-col items-center justify-center">
              {showStimulus && currentTask && gameState === 'playing' ? (
                <div className="space-y-8">
                  <div className={`text-9xl ${currentTask.color}`}>
                    {currentTask.stimulus}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {getTaskInstruction()}
                  </div>
                </div>
              ) : countdown > 0 ? (
                <div className="space-y-8">
                  <div className="text-9xl text-yellow-500">⏰</div>
                  <div className="text-3xl font-bold text-yellow-600">
                    AGUARDE... {countdown}
                  </div>
                </div>
              ) : gameState === 'playing' ? (
                <div className="text-gray-500 text-xl">Prepare-se...</div>
              ) : null}
            </div>

            <div className="text-center">
              <button
                onClick={handleResponse}
                className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-12 rounded-2xl font-bold text-2xl transition-colors"
              >
                CLIQUE AQUI
              </button>
            </div>

            <div className="flex justify-center gap-4">
              {gameState === 'playing' && (
                <button
                  onClick={pauseGame}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Pausar
                </button>
              )}
              <button
                onClick={resetGame}
                className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-1">{responses.correct}</div>
                <div className="text-sm font-medium text-green-700">Corretas</div>
              </div>
              <div className="bg-red-50 rounded-xl p-6 text-center border border-red-200">
                <div className="text-3xl font-bold text-red-600 mb-1">{responses.incorrect}</div>
                <div className="text-sm font-medium text-red-700">Incorretas</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-6 text-center border border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-1">{responses.premature}</div>
                <div className="text-sm font-medium text-orange-700">Prematuras</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">{accuracy}%</div>
                <div className="text-sm font-medium text-blue-700">Precisão</div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="space-y-8">
            <div className="bg-orange-50 rounded-2xl p-8 border border-orange-200 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-orange-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Exercício concluído!</h2>
              <p className="text-gray-600 mb-8">Parabéns! Você completou o teste de controle de impulsos.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{score}</div>
                  <div className="text-sm font-medium text-gray-600">Pontuação final</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">{accuracy}%</div>
                  <div className="text-sm font-medium text-gray-600">Precisão</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{maxStreak}</div>
                  <div className="text-sm font-medium text-gray-600">Maior sequência</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{currentLevel}</div>
                  <div className="text-sm font-medium text-gray-600">Nível alcançado</div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors"
                >
                  Jogar novamente
                </button>
                <Link href="/tdah">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-8 rounded-xl font-semibold transition-colors">
                    Voltar ao menu
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImpulseControlPage