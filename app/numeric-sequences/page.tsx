'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Target, Award, Brain, BookOpen, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SequenciasNumericas() {
  const router = useRouter()
  const [showActivity, setShowActivity] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState<string[]>([])
  const [showSequence, setShowSequence] = useState(false)
  const [gamePhase, setGamePhase] = useState<'ready' | 'showing' | 'input' | 'feedback'>('ready')
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)
  const [attempts, setAttempts] = useState(0)

  const levelConfig = {
    1: { length: 3, time: 2000, target: 50 },
    2: { length: 5, time: 3000, target: 50 },
    3: { length: 7, time: 4000, target: 50 }
  }

  const generateSequence = () => {
    const config = levelConfig[currentLevel as keyof typeof levelConfig]
    const newSequence = Array.from({ length: config.length }, () => 
      Math.floor(Math.random() * 10)
    )
    setSequence(newSequence)
    setUserInput(Array(config.length).fill(''))
  }

  const startRound = () => {
    generateSequence()
    setGamePhase('showing')
    setShowSequence(true)
    setFeedback(null)
    
    setTimeout(() => {
      setShowSequence(false)
      setGamePhase('input')
    }, levelConfig[currentLevel as keyof typeof levelConfig].time)
  }

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newInput = [...userInput]
      newInput[index] = value
      setUserInput(newInput)
    }
  }

  const checkAnswer = () => {
    const isCorrect = userInput.every((digit, index) => 
      digit === sequence[index].toString()
    )
    
    setAttempts(prev => prev + 1)
    
    if (isCorrect) {
      setScore(prev => prev + 10)
      setFeedback({
        correct: true,
        message: "Excelente! Sequência correta!"
      })
    } else {
      setFeedback({
        correct: false,
        message: `Incorreto. A sequência era: ${sequence.join(' ')}`
      })
    }
    
    setGamePhase('feedback')
  }

  const nextRound = () => {
    if (score >= 50 && currentLevel < 3) {
      setCurrentLevel(prev => prev + 1)
      setScore(0)
    }
    setGamePhase('ready')
  }

  const resetActivity = () => {
    setCurrentLevel(1)
    setScore(0)
    setAttempts(0)
    setGamePhase('ready')
    setFeedback(null)
    setShowActivity(false)
  }

  if (!showActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Sequências Numéricas</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Objetivo */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-400">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-800">Objetivo:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Desenvolver e fortalecer a capacidade de memória de trabalho através da 
                memorização e reprodução de sequências numéricas de complexidade crescente, 
                melhorando a retenção de informações na mente por períodos curtos.
              </p>
            </div>

            {/* Pontuação */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-400">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">Pontuação:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Cada sequência reproduzida corretamente = +10 pontos. Você precisa de 50 pontos 
                para completar a atividade com sucesso e avançar para o próximo nível.
              </p>
            </div>
          </div>

          {/* Níveis */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-purple-400">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">📊</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Níveis:</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 1: Sequências Básicas</h3>
                  <p className="text-gray-600 text-sm">Memorização de sequências de 3-4 dígitos</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Iniciante
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 2: Sequências Intermediárias</h3>
                  <p className="text-gray-600 text-sm">Memorização de sequências de 5-6 dígitos</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Intermediário
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 3: Sequências Avançadas</h3>
                  <p className="text-gray-600 text-sm">Memorização de sequências de 7-9 dígitos</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Avançado
                </span>
              </div>
            </div>
          </div>

          {/* Final */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-green-400">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">🏁</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Final:</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Complete os 3 níveis com 50 pontos para finalizar a atividade e 
              dominar as habilidades de memorização de sequências numéricas, fortalecendo 
              significativamente sua memória de trabalho.
            </p>
          </div>

          {/* Base Científica */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-pink-400">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-semibold text-gray-800">Base Científica:</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Este exercício é baseado no teste clássico de span de dígitos (Digit Span) 
              amplamente utilizado em neuropsicologia. Estudos demonstram que o treinamento 
              de sequências numéricas fortalece a alça fonológica da memória de trabalho, 
              melhorando a capacidade de manter e manipular informações numéricas na mente.
            </p>
          </div>

          {/* Botão Começar */}
          <div className="mt-8 text-center">
            <button 
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Sequências Numéricas</h1>
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
            <h3 className="text-sm font-medium text-gray-500">Nível</h3>
            <p className="text-2xl font-bold text-blue-600">{currentLevel}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Pontuação</h3>
            <p className="text-2xl font-bold text-green-600">{score}/50</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Tentativas</h3>
            <p className="text-2xl font-bold text-purple-600">{attempts}</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          {gamePhase === 'ready' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Nível {currentLevel}: Memorize sequências de {levelConfig[currentLevel as keyof typeof levelConfig].length} dígitos
              </h2>
              <p className="text-gray-600 mb-6">
                Uma sequência de números aparecerá por {levelConfig[currentLevel as keyof typeof levelConfig].time / 1000} segundos. 
                Memorize-a e digite quando solicitado.
              </p>
              <button
                onClick={startRound}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-shadow"
              >
                <Play className="w-5 h-5" />
                Iniciar Rodada
              </button>
            </div>
          )}

          {gamePhase === 'showing' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-6">Memorize esta sequência:</h2>
              <div className="flex justify-center gap-4 mb-6">
                {sequence.map((digit, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg"
                  >
                    {digit}
                  </div>
                ))}
              </div>
              <p className="text-gray-600">Sequência será ocultada em breve...</p>
            </div>
          )}

          {gamePhase === 'input' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-6">Digite a sequência que você memorizou:</h2>
              <div className="flex justify-center gap-4 mb-6">
                {userInput.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    maxLength={1}
                  />
                ))}
              </div>
              <button
                onClick={checkAnswer}
                disabled={userInput.some(digit => digit === '')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
              >
                Verificar Resposta
              </button>
            </div>
          )}

          {gamePhase === 'feedback' && feedback && (
            <div className="text-center">
              <div className={`flex items-center justify-center gap-3 mb-4 ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                {feedback.correct ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
                <h2 className="text-xl font-semibold">{feedback.message}</h2>
              </div>
              
              {score >= 50 ? (
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 text-yellow-600 mb-2">
                    <Trophy className="w-6 h-6" />
                    <span className="font-semibold">Nível {currentLevel} Concluído!</span>
                  </div>
                  {currentLevel < 3 ? (
                    <p className="text-gray-600">Parabéns! Você desbloqueou o próximo nível.</p>
                  ) : (
                    <p className="text-gray-600">Excelente! Você concluiu todos os níveis!</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 mb-6">
                  Continue praticando! Você precisa de {50 - score} pontos para completar este nível.
                </p>
              )}
              
              <button
                onClick={nextRound}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                {score >= 50 && currentLevel < 3 ? 'Próximo Nível' : 'Nova Rodada'}
              </button>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Progresso do Nível {currentLevel}</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((score / 50) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{score}/50 pontos</p>
        </div>
      </div>
    </div>
  )
}