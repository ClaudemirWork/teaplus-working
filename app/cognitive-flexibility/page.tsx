'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Pause, RotateCcw, Award, Target, Clock, Brain, CheckCircle, Shuffle } from 'lucide-react'
import Link from 'next/link'

const CognitiveFlexibilityPage = () => {
  const [gameState, setGameState] = useState<'intro' | 'instructions' | 'playing' | 'paused' | 'finished'>('intro')
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [currentStimulus, setCurrentStimulus] = useState<{ 
    shapes: Array<{shape: string, color: string}>, 
    rule: 'color' | 'shape' | 'count',
    target: string 
  } | null>(null)
  const [responses, setResponses] = useState<{correct: number, incorrect: number, switches: number}>({correct: 0, incorrect: 0, switches: 0})
  const [showStimulus, setShowStimulus] = useState(false)
  const [level, setLevel] = useState(1)
  const [previousRule, setPreviousRule] = useState<'color' | 'shape' | 'count'>('color')
  
  const stimulusTimerRef = useRef<NodeJS.Timeout | null>(null)
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null)

  const shapes = ['🔴', '🔵', '🟢', '🟡', '🔺', '⬛', '⭐', '❤️']
  const colors = ['vermelho', 'azul', 'verde', 'amarelo', 'roxo', 'preto', 'dourado', 'rosa']
  const rules = ['color', 'shape', 'count'] as const

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

  const generateStimulus = () => {
    // Switch rules frequently to test flexibility
    const newRule = rules[Math.floor(Math.random() * rules.length)]
    const isRuleSwitch = newRule !== previousRule
    
    if (isRuleSwitch) {
      setResponses(prev => ({ ...prev, switches: prev.switches + 1 }))
    }
    
    setPreviousRule(newRule)

    // Generate 3-6 shapes
    const shapeCount = 3 + Math.floor(Math.random() * 4)
    const stimulusShapes = []
    
    for (let i = 0; i < shapeCount; i++) {
      stimulusShapes.push({
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    let target = ''
    
    switch (newRule) {
      case 'color':
        // Find most common color
        const colorCounts = stimulusShapes.reduce((acc, item) => {
          acc[item.color] = (acc[item.color] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        target = Object.entries(colorCounts).reduce((a, b) => colorCounts[a[0]] > colorCounts[b[0]] ? a : b)[0]
        break
        
      case 'shape':
        // Find most common shape
        const shapeCounts = stimulusShapes.reduce((acc, item) => {
          acc[item.shape] = (acc[item.shape] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        target = Object.entries(shapeCounts).reduce((a, b) => shapeCounts[a[0]] > shapeCounts[b[0]] ? a : b)[0]
        break
        
      case 'count':
        target = shapeCount.toString()
        break
    }

    return {
      shapes: stimulusShapes,
      rule: newRule,
      target
    }
  }

  const startRound = () => {
    const stimulus = generateStimulus()
    setCurrentStimulus(stimulus)
    setShowStimulus(true)
    setCurrentRound(prev => prev + 1)

    const delay = Math.max(2000 - (level * 150), 1000)
    stimulusTimerRef.current = setTimeout(() => {
      setShowStimulus(false)
      setTimeout(() => {
        setTimeout(() => startRound(), 500)
      }, 1500)
    }, delay)
  }

  const handleResponse = (answer: string) => {
    if (!currentStimulus || !showStimulus) return

    if (stimulusTimerRef.current) {
      clearTimeout(stimulusTimerRef.current)
    }

    const isCorrect = answer === currentStimulus.target

    if (isCorrect) {
      const switchBonus = responses.switches > previousRule === currentStimulus.rule ? 0 : 20
      setScore(prev => prev + 15 + (level * 5) + switchBonus)
      setResponses(prev => ({ ...prev, correct: prev.correct + 1 }))
      
      if (responses.correct > 0 && (responses.correct + 1) % 8 === 0) {
        setLevel(prev => prev + 1)
      }
    } else {
      setResponses(prev => ({ ...prev, incorrect: prev.incorrect + 1 }))
    }

    setShowStimulus(false)
    setTimeout(() => startRound(), 1000)
  }

  const startGame = () => {
    setGameState('playing')
    setTimeLeft(120)
    setCurrentRound(0)
    setScore(0)
    setResponses({correct: 0, incorrect: 0, switches: 0})
    setLevel(1)
    setPreviousRule('color')
    setTimeout(() => startRound(), 1500)
  }

  const pauseGame = () => {
    setGameState('paused')
    if (stimulusTimerRef.current) clearTimeout(stimulusTimerRef.current)
    if (gameTimerRef.current) clearTimeout(gameTimerRef.current)
  }

  const resumeGame = () => {
    setGameState('playing')
  }

  const finishGame = () => {
    setGameState('finished')
    if (stimulusTimerRef.current) clearTimeout(stimulusTimerRef.current)
    if (gameTimerRef.current) clearTimeout(gameTimerRef.current)
  }

  const resetGame = () => {
    setGameState('intro')
    setCurrentRound(0)
    setScore(0)
    setResponses({correct: 0, incorrect: 0, switches: 0})
    setCurrentStimulus(null)
    setShowStimulus(false)
    setLevel(1)
    setPreviousRule('color')
  }

  const accuracy = responses.correct + responses.incorrect > 0 
    ? Math.round((responses.correct / (responses.correct + responses.incorrect)) * 100)
    : 0

  const getRuleInstruction = (rule: 'color' | 'shape' | 'count') => {
    switch (rule) {
      case 'color': return 'Qual COR aparece mais vezes?'
      case 'shape': return 'Qual FORMA aparece mais vezes?'
      case 'count': return 'Quantas formas há no total?'
    }
  }

  const getAnswerOptions = () => {
    if (!currentStimulus) return []
    
    switch (currentStimulus.rule) {
      case 'color':
        return [...new Set(currentStimulus.shapes.map(s => s.color))]
      case 'shape':
        return [...new Set(currentStimulus.shapes.map(s => s.shape))]
      case 'count':
        return ['3', '4', '5', '6']
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/tdah" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🧠 Flexibilidade Cognitiva</h1>
                <p className="text-gray-600 mt-1">Adaptação mental a mudanças de regras</p>
              </div>
            </div>
            
            {gameState === 'playing' && (
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Tempo</div>
                  <div className="text-2xl font-bold text-gray-900">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Pontuação</div>
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Nível</div>
                  <div className="text-2xl font-bold text-purple-600">{level}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Intro */}
        {gameState === 'intro' && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Shuffle className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sobre este exercício</h2>
                  <p className="text-gray-600">Teste de alternância de regras cognitivas</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Objetivo
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Desenvolver flexibilidade cognitiva respondendo a diferentes regras que mudam 
                    aleatoriamente. Você precisa alternar entre focar em cores, formas ou quantidades.
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
                      Melhora flexibilidade mental
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Treina mudança de foco
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Desenvolve adaptabilidade
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Fortalece função executiva
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Duração</div>
                  <div className="text-sm text-gray-600">8-12 minutos</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Target className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Dificuldade</div>
                  <div className="text-sm text-gray-600">Avançado</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Shuffle className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Alternância</div>
                  <div className="text-sm text-gray-600">3 regras</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameState('instructions')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-colors"
              >
                Ver instruções
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {gameState === 'instructions' && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">📋 Como jogar</h2>
              
              <div className="space-y-8">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">🔄 Regras que mudam</h3>
                  <p className="text-blue-800 leading-relaxed">
                    Formas coloridas aparecerão na tela. A regra para responder <strong>muda aleatoriamente</strong> 
                    entre três tipos: cor, forma ou quantidade. Fique atento à instrução no topo!
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-4">🎨 Regra: COR</h3>
                    <div className="text-center mb-4">
                      <div className="flex justify-center gap-2 text-2xl">
                        🔴🔵🔴🟢🔴
                      </div>
                    </div>
                    <p className="text-red-700 text-center text-sm">
                      Resposta: <strong>vermelho</strong><br/>
                      (cor que aparece mais)
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">🔷 Regra: FORMA</h3>
                    <div className="text-center mb-4">
                      <div className="flex justify-center gap-2 text-2xl">
                        🔴⭐🔴🔺🔴
                      </div>
                    </div>
                    <p className="text-green-700 text-center text-sm">
                      Resposta: <strong>🔴</strong><br/>
                      (forma que aparece mais)
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">🔢 Regra: QUANTIDADE</h3>
                    <div className="text-center mb-4">
                      <div className="flex justify-center gap-2 text-2xl">
                        🔴🔵🟢⭐
                      </div>
                    </div>
                    <p className="text-purple-700 text-center text-sm">
                      Resposta: <strong>4</strong><br/>
                      (total de formas)
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4">⚡ Dica importante</h3>
                  <p className="text-yellow-700">
                    A regra pode mudar a qualquer momento! Sempre leia a instrução no topo da tela 
                    antes de responder. Seja rápido, mas cuidadoso com as mudanças.
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
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Iniciar exercício
              </button>
            </div>
          </div>
        )}

        {/* Game */}
        {(gameState === 'playing' || gameState === 'paused') && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-lg font-medium text-gray-600 mb-2">Rodada {currentRound}</div>
              {currentStimulus && (
                <div className="text-xl font-bold text-blue-600 mb-4">
                  {getRuleInstruction(currentStimulus.rule)}
                </div>
              )}
            </div>

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

            {/* Stimulus Display */}
            <div className="bg-gray-50 rounded-2xl p-16 border border-gray-200 text-center min-h-[300px] flex items-center justify-center">
              {showStimulus && currentStimulus && gameState === 'playing' ? (
                <div className="space-y-8">
                  <div className="flex justify-center gap-4 text-6xl">
                    {currentStimulus.shapes.map((item, index) => (
                      <span key={index}>{item.shape}</span>
                    ))}
                  </div>
                </div>
              ) : gameState === 'playing' ? (
                <div className="text-gray-500 text-xl">Prepare-se para a próxima regra...</div>
              ) : null}
            </div>

            {/* Answer Options */}
            {showStimulus && currentStimulus && gameState === 'playing' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getAnswerOptions().map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleResponse(option)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-6 px-4 rounded-xl font-semibold transition-colors flex flex-col items-center gap-3 text-lg"
                  >
                    {currentStimulus.rule === 'shape' ? (
                      <span className="text-3xl">{option}</span>
                    ) : (
                      <span className="text-xl">{option}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Game Controls */}
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

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-1">{responses.correct}</div>
                <div className="text-sm font-medium text-green-700">Corretas</div>
              </div>
              <div className="bg-red-50 rounded-xl p-6 text-center border border-red-200">
                <div className="text-3xl font-bold text-red-600 mb-1">{responses.incorrect}</div>
                <div className="text-sm font-medium text-red-700">Incorretas</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 text-center border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-1">{responses.switches}</div>
                <div className="text-sm font-medium text-purple-700">Mudanças</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">{accuracy}%</div>
                <div className="text-sm font-medium text-blue-700">Precisão</div>
              </div>
            </div>
          </div>
        )}

        {/* Finished */}
        {gameState === 'finished' && (
          <div className="space-y-8">
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-blue-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Exercício concluído!</h2>
              <p className="text-gray-600 mb-8">Parabéns! Você completou o teste de flexibilidade cognitiva.</p>
              
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
                  <div className="text-3xl font-bold text-purple-600 mb-2">{responses.switches}</div>
                  <div className="text-sm font-medium text-gray-600">Mudanças</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{level}</div>
                  <div className="text-sm font-medium text-gray-600">Nível final</div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors"
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

export default CognitiveFlexibilityPage