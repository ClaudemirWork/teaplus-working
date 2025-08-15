'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Award, Target, Clock, Brain, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const InhibitoryControlPage = () => {
  const [gameState, setGameState] = useState<'intro' | 'instructions' | 'playing' | 'paused' | 'finished'>('intro')
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [currentStimulus, setCurrentStimulus] = useState<{ color: string, word: string, isCongruent: boolean } | null>(null)
  const [responses, setResponses] = useState<{correct: number, incorrect: number, missed: number}>({correct: 0, incorrect: 0, missed: 0})
  const [showStimulus, setShowStimulus] = useState(false)
  const [level, setLevel] = useState(1)
  
  const stimulusTimerRef = useRef<NodeJS.Timeout | null>(null)
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null)

  const colors = ['VERMELHO', 'AZUL', 'VERDE', 'AMARELO']
  const colorClasses = {
    'VERMELHO': 'text-red-500',
    'AZUL': 'text-blue-500', 
    'VERDE': 'text-green-500',
    'AMARELO': 'text-yellow-500'
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

  const generateStimulus = () => {
    const colorWord = colors[Math.floor(Math.random() * colors.length)]
    const displayColor = colors[Math.floor(Math.random() * colors.length)]
    const isCongruent = Math.random() > 0.5
    
    return {
      word: colorWord,
      color: isCongruent ? colorWord : displayColor,
      isCongruent
    }
  }

  const startRound = () => {
    const stimulus = generateStimulus()
    setCurrentStimulus(stimulus)
    setShowStimulus(true)
    setCurrentRound(prev => prev + 1)

    const delay = Math.max(1500 - (level * 100), 800)
    stimulusTimerRef.current = setTimeout(() => {
      setShowStimulus(false)
      setTimeout(() => {
        setResponses(prev => ({ ...prev, missed: prev.missed + 1 }))
        setTimeout(() => startRound(), 500)
      }, 1000)
    }, delay)
  }

  const handleResponse = (selectedColor: string) => {
    if (!currentStimulus || !showStimulus) return

    if (stimulusTimerRef.current) {
      clearTimeout(stimulusTimerRef.current)
    }

    const isCorrect = selectedColor === currentStimulus.color

    if (isCorrect) {
      setScore(prev => prev + 10 + (level * 5))
      setResponses(prev => ({ ...prev, correct: prev.correct + 1 }))
      
      if (responses.correct > 0 && (responses.correct + 1) % 10 === 0) {
        setLevel(prev => prev + 1)
      }
    } else {
      setResponses(prev => ({ ...prev, incorrect: prev.incorrect + 1 }))
    }

    setShowStimulus(false)
    setTimeout(() => startRound(), 800)
  }

  const startGame = () => {
    setGameState('playing')
    setTimeLeft(60)
    setCurrentRound(0)
    setScore(0)
    setResponses({correct: 0, incorrect: 0, missed: 0})
    setLevel(1)
    setTimeout(() => startRound(), 1000)
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
    setResponses({correct: 0, incorrect: 0, missed: 0})
    setCurrentStimulus(null)
    setShowStimulus(false)
    setLevel(1)
  }

  const accuracy = responses.correct + responses.incorrect > 0 
    ? Math.round((responses.correct / (responses.correct + responses.incorrect)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
                <span className="text-sm sm:text-base">← Voltar</span>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🛑 Controle Inibitório</h1>
                <p className="text-gray-600 mt-1">Teste de Stroop - Exercícios de autocontrole</p>
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
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sobre este exercício</h2>
                  <p className="text-gray-600">Teste de Stroop para controle inibitório</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-500" />
                    Objetivo
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Desenvolver controle inibitório através do famoso teste de Stroop, 
                    onde você deve inibir a resposta automática de ler a palavra e focar na cor do texto.
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
                      Melhora atenção seletiva
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Desenvolve flexibilidade mental
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Treina resolução de conflitos
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
                  <div className="text-sm text-gray-600">Intermediário</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Award className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Progressivo</div>
                  <div className="text-sm text-gray-600">5 níveis</div>
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
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 Regra principal</h3>
                  <p className="text-blue-800 leading-relaxed">
                    Palavras de cores aparecerão na tela escritas em cores diferentes. 
                    Você deve responder baseado na <strong>COR do texto</strong>, não na palavra escrita.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">✅ Exemplo correto</h3>
                    <div className="text-center mb-4">
                      <span className="text-5xl font-bold text-blue-500">VERMELHO</span>
                    </div>
                    <p className="text-green-700 text-center">
                      Resposta correta: <strong>AZUL</strong><br/>
                      <span className="text-sm">(cor do texto, não a palavra)</span>
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-4">❌ Erro comum</h3>
                    <div className="text-center mb-4">
                      <span className="text-5xl font-bold text-green-500">AZUL</span>
                    </div>
                    <p className="text-red-700 text-center">
                      Resposta errada: AZUL<br/>
                      Resposta certa: <strong>VERDE</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">🎮 Controles</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="bg-red-500 w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">R</div>
                      <div className="text-sm font-medium text-gray-700">VERMELHO</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-blue-500 w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">A</div>
                      <div className="text-sm font-medium text-gray-700">AZUL</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-500 w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl">V</div>
                      <div className="text-sm font-medium text-gray-700">VERDE</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-yellow-500 w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center text-gray-900 font-bold text-xl">M</div>
                      <div className="text-sm font-medium text-gray-700">AMARELO</div>
                    </div>
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
              <div className="text-sm text-gray-500">Responda com a COR do texto, não a palavra escrita</div>
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
            <div className="bg-gray-50 rounded-2xl p-16 border border-gray-200 text-center min-h-[350px] flex items-center justify-center">
              {showStimulus && currentStimulus && gameState === 'playing' ? (
                <div className="space-y-8">
                  <div className={`text-8xl font-bold ${colorClasses[currentStimulus.color as keyof typeof colorClasses]}`}>
                    {currentStimulus.word}
                  </div>
                  <div className="text-lg text-gray-600 font-medium">
                    Qual é a COR desta palavra?
                  </div>
                </div>
              ) : gameState === 'playing' ? (
                <div className="text-gray-500 text-xl">Prepare-se...</div>
              ) : null}
            </div>

            {/* Controls */}
            {showStimulus && gameState === 'playing' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => handleResponse('VERMELHO')}
                  className="bg-red-500 hover:bg-red-600 text-white py-6 px-6 rounded-xl font-semibold transition-colors flex flex-col items-center gap-3"
                >
                  <div className="text-3xl font-bold">R</div>
                  <div className="text-sm">VERMELHO</div>
                </button>
                <button
                  onClick={() => handleResponse('AZUL')}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-6 px-6 rounded-xl font-semibold transition-colors flex flex-col items-center gap-3"
                >
                  <div className="text-3xl font-bold">A</div>
                  <div className="text-sm">AZUL</div>
                </button>
                <button
                  onClick={() => handleResponse('VERDE')}
                  className="bg-green-500 hover:bg-green-600 text-white py-6 px-6 rounded-xl font-semibold transition-colors flex flex-col items-center gap-3"
                >
                  <div className="text-3xl font-bold">V</div>
                  <div className="text-sm">VERDE</div>
                </button>
                <button
                  onClick={() => handleResponse('AMARELO')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-6 px-6 rounded-xl font-semibold transition-colors flex flex-col items-center gap-3"
                >
                  <div className="text-3xl font-bold text-gray-900">M</div>
                  <div className="text-sm text-gray-900">AMARELO</div>
                </button>
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
              <div className="bg-yellow-50 rounded-xl p-6 text-center border border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600 mb-1">{responses.missed}</div>
                <div className="text-sm font-medium text-yellow-700">Perdidas</div>
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
            <div className="bg-green-50 rounded-2xl p-8 border border-green-200 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Exercício concluído!</h2>
              <p className="text-gray-600 mb-8">Parabéns! Você completou o teste de controle inibitório.</p>
              
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
                  <div className="text-3xl font-bold text-purple-600 mb-2">{level}</div>
                  <div className="text-sm font-medium text-gray-600">Nível alcançado</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{currentRound}</div>
                  <div className="text-sm font-medium text-gray-600">Rodadas</div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors"
                >
                  Jogar novamente
                </button>
                <Link href="/dashboard">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-8 rounded-xl font-semibold transition-colors">
                    ← Voltar
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

export default InhibitoryControlPage
