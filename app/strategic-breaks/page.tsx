'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Pause, Award, Target, Clock, Coffee, CheckCircle, Timer } from 'lucide-react'
import Link from 'next/link'

const StrategicBreaksPage = () => {
  const [gameState, setGameState] = useState<'intro' | 'instructions' | 'working' | 'break' | 'finished'>('intro')
  const [currentCycle, setCurrentCycle] = useState(1)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalCycles, setTotalCycles] = useState(4)
  const [workDuration, setWorkDuration] = useState(300) // 5 minutes
  const [breakDuration, setBreakDuration] = useState(60) // 1 minute
  const [completedCycles, setCompletedCycles] = useState(0)
  const [breakActivities, setBreakActivities] = useState<string[]>([])
  const [currentBreakActivity, setCurrentBreakActivity] = useState('')
  const [score, setScore] = useState(0)
  const [focusRating, setFocusRating] = useState(5)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const activities = [
    'Respire profundamente 5 vezes',
    'Estique os braços para cima',
    'Movimente o pescoço suavemente',
    'Beba um gole de água',
    'Olhe para longe por 30 segundos',
    'Massageie as têmporas',
    'Espreguice-se como um gato',
    'Faça 5 respirações abdominais',
    'Gire os ombros para trás',
    'Pisque os olhos várias vezes'
  ]

  useEffect(() => {
    if (timeLeft > 0 && (gameState === 'working' || gameState === 'break')) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      if (gameState === 'working') {
        startBreak()
      } else if (gameState === 'break') {
        endBreak()
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeLeft, gameState])

  const startSession = () => {
    setGameState('working')
    setTimeLeft(workDuration)
    setCurrentCycle(1)
    setCompletedCycles(0)
    setScore(0)
    setFocusRating(5)
  }

  const startBreak = () => {
    setGameState('break')
    setTimeLeft(breakDuration)
    const randomActivity = activities[Math.floor(Math.random() * activities.length)]
    setCurrentBreakActivity(randomActivity)
    setBreakActivities(prev => [...prev, randomActivity])
  }

  const endBreak = () => {
    setCompletedCycles(prev => prev + 1)
    setScore(prev => prev + (focusRating * 10))
    
    if (currentCycle < totalCycles) {
      setCurrentCycle(prev => prev + 1)
      setGameState('working')
      setTimeLeft(workDuration)
    } else {
      finishSession()
    }
  }

  const finishSession = () => {
    setGameState('finished')
  }

  const resetSession = () => {
    setGameState('intro')
    setCurrentCycle(1)
    setTimeLeft(0)
    setCompletedCycles(0)
    setBreakActivities([])
    setCurrentBreakActivity('')
    setScore(0)
    setFocusRating(5)
  }

  const handleFocusRating = (rating: number) => {
    setFocusRating(rating)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    const totalTime = gameState === 'working' ? workDuration : breakDuration
    return ((totalTime - timeLeft) / totalTime) * 100
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
                <h1 className="text-3xl font-bold text-gray-900">⏸️ Pausas Estratégicas</h1>
                <p className="text-gray-600 mt-1">Técnicas de pausa consciente</p>
              </div>
            </div>
            
            {(gameState === 'working' || gameState === 'break') && (
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Ciclo</div>
                  <div className="text-2xl font-bold text-gray-900">{currentCycle}/{totalCycles}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Tempo</div>
                  <div className="text-2xl font-bold text-purple-600">{formatTime(timeLeft)}</div>
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
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sobre este exercício</h2>
                  <p className="text-gray-600">Técnica Pomodoro adaptada para TDAH</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    Objetivo
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Aprender a fazer pausas estratégicas durante o trabalho para melhorar foco, 
                    reduzir fadiga mental e aumentar a produtividade através de micro-exercícios.
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
                      Melhora gestão do tempo
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Reduz fadiga mental
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Aumenta foco sustentado
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Ensina autorregulação
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Duração</div>
                  <div className="text-sm text-gray-600">5-10 minutos</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Target className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Dificuldade</div>
                  <div className="text-sm text-gray-600">Básico</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Timer className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Ciclos</div>
                  <div className="text-sm text-gray-600">4 rodadas</div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">⏱️ Como funciona</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <div className="font-medium text-purple-800">Trabalho Focado (5 min)</div>
                      <div className="text-sm text-purple-600">Concentre-se em uma tarefa específica</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <div className="font-medium text-purple-800">Pausa Ativa (1 min)</div>
                      <div className="text-sm text-purple-600">Micro-exercício de relaxamento</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <div className="font-medium text-purple-800">Repetir</div>
                      <div className="text-sm text-purple-600">4 ciclos completos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameState('instructions')}
                className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-colors"
              >
                Ver instruções
              </button>
            </div>
          </div>
        )}

        {gameState === 'instructions' && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">📋 Como fazer as pausas estratégicas</h2>
              
              <div className="space-y-8">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">💼 Durante o trabalho (5 min)</h3>
                  <div className="space-y-3 text-blue-800">
                    <p>• Foque em UMA tarefa específica</p>
                    <p>• Evite distrações (celular, redes sociais)</p>
                    <p>• Se a mente divagar, gentilmente volte o foco</p>
                    <p>• Trabalhe até o timer terminar</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">☕ Durante a pausa (1 min)</h3>
                  <div className="space-y-3 text-green-800">
                    <p>• Siga EXATAMENTE a atividade sugerida</p>
                    <p>• Levante-se da cadeira</p>
                    <p>• Movimente-se ou relaxe conforme indicado</p>
                    <p>• NÃO use celular ou redes sociais</p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4">📊 Avaliação do foco</h3>
                  <p className="text-yellow-800">
                    No final de cada ciclo, avalie seu nível de foco de 1 a 5 estrelas. 
                    Isso ajuda a identificar padrões e melhorar sua concentração.
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">🎯 Dicas importantes</h3>
                  <div className="space-y-2 text-purple-800">
                    <p>• As pausas são obrigatórias, não opcionais</p>
                    <p>• Cada pausa tem uma atividade diferente</p>
                    <p>• Respeite rigorosamente os tempos</p>
                    <p>• Seja honesto na avaliação do foco</p>
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
                onClick={startSession}
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Iniciar sessão
              </button>
            </div>
          </div>
        )}

        {gameState === 'working' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💼 Período de Trabalho</h2>
              <p className="text-gray-600 mb-8">Foque em sua tarefa. Evite distrações!</p>
              
              <div className="mb-8">
                <div className="text-6xl font-bold text-blue-600 mb-4">{formatTime(timeLeft)}</div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 Foque agora em:</h3>
                <div className="space-y-3 text-blue-800">
                  <p>• Uma tarefa específica e bem definida</p>
                  <p>• Mantenha a concentração total</p>
                  <p>• Se distrair, gentilmente volte o foco</p>
                  <p>• Respire calmamente se sentir ansiedade</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'break' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">☕ Pausa Ativa</h2>
              <p className="text-gray-600 mb-8">Hora de recarregar suas energias!</p>
              
              <div className="mb-8">
                <div className="text-6xl font-bold text-green-600 mb-4">{formatTime(timeLeft)}</div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className="bg-green-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-8 border border-green-200 mb-8">
                <div className="text-2xl mb-4">🧘‍♀️</div>
                <h3 className="text-2xl font-bold text-green-900 mb-4">Sua atividade:</h3>
                <p className="text-xl text-green-800 font-medium">{currentBreakActivity}</p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">Como foi seu foco no último período?</h3>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFocusRating(rating)}
                      className={`w-12 h-12 rounded-full text-xl transition-colors ${
                        rating <= focusRating 
                          ? 'bg-yellow-500 text-white' 
                          : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  {focusRating === 1 && "Muito distraído"}
                  {focusRating === 2 && "Pouco focado"}
                  {focusRating === 3 && "Foco moderado"}
                  {focusRating === 4 && "Bem focado"}
                  {focusRating === 5 && "Totalmente focado"}
                </p>
              </div>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="space-y-8">
            <div className="bg-purple-50 rounded-2xl p-8 border border-purple-200 text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-purple-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Sessão concluída!</h2>
              <p className="text-gray-600 mb-8">Parabéns! Você completou {totalCycles} ciclos de trabalho focado.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{completedCycles}</div>
                  <div className="text-sm font-medium text-gray-600">Ciclos completos</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{score}</div>
                  <div className="text-sm font-medium text-gray-600">Pontuação total</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">{breakActivities.length}</div>
                  <div className="text-sm font-medium text-gray-600">Pausas realizadas</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades realizadas:</h3>
                <div className="space-y-2">
                  {breakActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetSession}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors"
                >
                  Nova sessão
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

export default StrategicBreaksPage