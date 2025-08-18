'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Award, Target, Clock, Activity, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const SelfRegulationPage = () => {
  const [gameState, setGameState] = useState<'intro' | 'instructions' | 'breathing' | 'focus' | 'impulse' | 'finished'>('intro')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [breathingCount, setBreathingCount] = useState(0)
  const [focusTargets, setFocusTargets] = useState<Array<{id: number, x: number, y: number}>>([])
  const [currentTarget, setCurrentTarget] = useState(0)
  const [responses, setResponses] = useState({breathing: 0, focus: 0, impulse: 0, total: 0})
  const [impulseTask, setImpulseTask] = useState({show: false, isTarget: false})
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const exercises = [
    { name: 'Respiração Controlada', duration: 120, type: 'breathing' },
    { name: 'Foco Sustentado', duration: 90, type: 'focus' },
    { name: 'Controle de Impulsos', duration: 60, type: 'impulse' }
  ]

  useEffect(() => {
    if (timeLeft > 0 && gameState !== 'intro' && gameState !== 'instructions' && gameState !== 'finished') {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameState !== 'intro' && gameState !== 'instructions' && gameState !== 'finished') {
      nextExercise()
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeLeft, gameState])

  useEffect(() => {
    if (gameState === 'breathing') {
      const breathingCycle = () => {
        setBreathingPhase('inhale')
        setTimeout(() => setBreathingPhase('hold'), 4000)
        setTimeout(() => setBreathingPhase('exhale'), 8000)
        setTimeout(() => {
          setBreathingCount(prev => prev + 1)
          if (timeLeft > 12) breathingCycle()
        }, 12000)
      }
      breathingCycle()
    }
  }, [gameState])

  useEffect(() => {
    if (gameState === 'focus') {
      generateFocusTargets()
      const interval = setInterval(() => {
        setCurrentTarget(prev => (prev + 1) % 5)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [gameState])

  useEffect(() => {
    if (gameState === 'impulse') {
      const scheduleTask = () => {
        const delay = 2000 + Math.random() * 4000
        const isTarget = Math.random() > 0.3
        
        setTimeout(() => {
          setImpulseTask({show: true, isTarget})
          setTimeout(() => {
            setImpulseTask({show: false, isTarget: false})
            if (timeLeft > 0) scheduleTask()
          }, 1500)
        }, delay)
      }
      scheduleTask()
    }
  }, [gameState])

  const generateFocusTargets = () => {
    const targets = []
    for (let i = 0; i < 5; i++) {
      targets.push({
        id: i,
        x: 20 + (i * 15),
        y: 30 + Math.random() * 40
      })
    }
    setFocusTargets(targets)
  }

  const startExercise = () => {
    setGameState('breathing')
    setCurrentExercise(0)
    setTimeLeft(exercises[0].duration)
    setScore(0)
    setResponses({breathing: 0, focus: 0, impulse: 0, total: 0})
    setBreathingCount(0)
  }

  const nextExercise = () => {
    let exerciseScore = 0
    
    switch (gameState) {
      case 'breathing':
        exerciseScore = Math.min(breathingCount * 10, 100)
        setResponses(prev => ({...prev, breathing: exerciseScore}))
        break
      case 'focus':
        exerciseScore = responses.focus
        break
      case 'impulse':
        exerciseScore = responses.impulse
        break
    }
    
    setScore(prev => prev + exerciseScore)
    
    if (currentExercise < exercises.length - 1) {
      const nextEx = currentExercise + 1
      setCurrentExercise(nextEx)
      setTimeLeft(exercises[nextEx].duration)
      setGameState(exercises[nextEx].type as any)
      if (exercises[nextEx].type === 'focus') {
        setCurrentTarget(0)
      }
    } else {
      finishExercise()
    }
  }

  const handleFocusClick = (targetId: number) => {
    if (targetId === currentTarget) {
      setResponses(prev => ({...prev, focus: prev.focus + 15}))
    } else {
      setResponses(prev => ({...prev, focus: Math.max(0, prev.focus - 5)}))
    }
  }

  const handleImpulseResponse = () => {
    if (impulseTask.isTarget) {
      setResponses(prev => ({...prev, impulse: prev.impulse + 20}))
    } else {
      setResponses(prev => ({...prev, impulse: Math.max(0, prev.impulse - 10)}))
    }
  }

  const finishExercise = () => {
    setGameState('finished')
    const totalScore = responses.breathing + responses.focus + responses.impulse
    setResponses(prev => ({...prev, total: totalScore}))
    setScore(totalScore)
  }

  const resetExercise = () => {
    setGameState('intro')
    setCurrentExercise(0)
    setScore(0)
    setTimeLeft(0)
    setBreathingCount(0)
    setCurrentTarget(0)
    setResponses({breathing: 0, focus: 0, impulse: 0, total: 0})
    setImpulseTask({show: false, isTarget: false})
  }

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Inspire lentamente (4s)'
      case 'hold': return 'Segure a respiração (4s)'
      case 'exhale': return 'Expire lentamente (4s)'
    }
  }

  const getBreathingColor = () => {
    switch (breathingPhase) {
      case 'inhale': return 'bg-blue-500'
      case 'hold': return 'bg-yellow-500'
      case 'exhale': return 'bg-green-500'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">⚖️ Autorregulação</h1>
                <p className="text-gray-600 mt-1">Gestão do comportamento e emoções</p>
              </div>
            </div>
            
            {gameState !== 'intro' && gameState !== 'instructions' && gameState !== 'finished' && (
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Exercício</div>
                  <div className="text-lg font-bold text-gray-900">{currentExercise + 1}/3</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Tempo</div>
                  <div className="text-2xl font-bold text-gray-900">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Pontuação</div>
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
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
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sobre este exercício</h2>
                  <p className="text-gray-600">Sequência de técnicas de autorregulação</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Objetivo
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Desenvolver habilidades de autorregulação através de três exercícios integrados: 
                    respiração controlada, foco sustentado e controle de impulsos.
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
                      Melhora autorregulação emocional
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Desenvolve controle comportamental
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Treina técnicas de relaxamento
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Fortalece atenção sustentada
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Duração</div>
                  <div className="text-sm text-gray-600">12-18 minutos</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Target className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Dificuldade</div>
                  <div className="text-sm text-gray-600">Intermediário</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Activity className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Exercícios</div>
                  <div className="text-sm text-gray-600">3 etapas</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameState('instructions')}
                className="bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-colors"
              >
                Ver instruções
              </button>
            </div>
          </div>
        )}

        {gameState === 'instructions' && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">📋 Como fazer os exercícios</h2>
              
              <div className="space-y-8">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">🫁 1. Respiração Controlada</h3>
                  <p className="text-blue-800 mb-4">
                    Siga o círculo na tela que guiará sua respiração no ritmo 4-4-4.
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">🎯 2. Foco Sustentado</h3>
                  <p className="text-green-800">
                    Clique apenas no círculo que está destacado (piscando). 
                    Mantenha foco total e ignore os outros círculos.
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">⚡ 3. Controle de Impulsos</h3>
                  <p className="text-purple-800">
                    Clique APENAS quando aparecer um quadrado verde. 
                    Ignore círculos vermelhos - não clique neles!
                  </p>
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
                onClick={startExercise}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Iniciar exercícios
              </button>
            </div>
          </div>
        )}

        {gameState === 'breathing' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🫁 Respiração Controlada</h2>
              <p className="text-gray-600 mb-8">Siga o círculo e respire no ritmo indicado</p>
              
              <div className="flex justify-center mb-8">
                <div className={`w-48 h-48 rounded-full ${getBreathingColor()} transition-all duration-1000 flex items-center justify-center`}>
                  <div className="text-white text-xl font-bold text-center">
                    <div>{getBreathingInstruction()}</div>
                    <div className="text-sm mt-2">Ciclo {breathingCount + 1}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'focus' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Foco Sustentado</h2>
              <p className="text-gray-600 mb-8">Clique apenas no círculo que está piscando</p>
            </div>
            
            <div className="relative h-96 bg-gray-50 rounded-2xl border border-gray-200">
              {focusTargets.map((target, index) => (
                <button
                  key={target.id}
                  onClick={() => handleFocusClick(target.id)}
                  className={`absolute w-12 h-12 rounded-full transition-all duration-300 ${
                    index === currentTarget 
                      ? 'bg-blue-500 animate-pulse scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {gameState === 'impulse' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ Controle de Impulsos</h2>
              <p className="text-gray-600 mb-8">Clique APENAS nos quadrados verdes. Ignore círculos vermelhos!</p>
            </div>
            
            <div className="h-96 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center">
              {impulseTask.show ? (
                <button
                  onClick={handleImpulseResponse}
                  className={`w-24 h-24 transition-all duration-200 ${
                    impulseTask.isTarget 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 rounded-full cursor-default'
                  }`}
                >
                  <div className="text-white font-bold">
                    {impulseTask.isTarget ? 'CLIQUE' : 'NÃO!'}
                  </div>
                </button>
              ) : (
                <div className="text-gray-500 text-xl">Aguarde...</div>
              )}
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="space-y-8">
            <div className="bg-green-50 rounded-2xl p-8 border border-green-200 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Exercícios concluídos!</h2>
              <p className="text-gray-600 mb-8">Parabéns! Você completou toda a sequência de autorregulação.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{responses.breathing}</div>
                  <div className="text-sm font-medium text-gray-600">Respiração</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">{responses.focus}</div>
                  <div className="text-sm font-medium text-gray-600">Foco</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{responses.impulse}</div>
                  <div className="text-sm font-medium text-gray-600">Impulsos</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{score}</div>
                  <div className="text-sm font-medium text-gray-600">Total</div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetExercise}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors"
                >
                  Fazer novamente
                </button>
                <Link href="/dashboard">
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

export default SelfRegulationPage