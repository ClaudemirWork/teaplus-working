'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Target, Award, Brain, BookOpen, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SpanDigitos() {
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
  const [spanType, setSpanType] = useState<'backward'>('backward')

  const levelConfig = {
    1: { length: 3, time: 2500, target: 50 },
    2: { length: 4, time: 3000, target: 50 },
    3: { length: 5, time: 3500, target: 50 }
  }

  const generateSequence = () => {
    const config = levelConfig[currentLevel as keyof typeof levelConfig]
    const newSequence = Array.from({ length: config.length }, () => 
      Math.floor(Math.random() * 10)
    )
    setSequence(newSequence)
    setUserInput(Array(config.length).fill(''))
    setSpanType('backward')
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
    // Sempre span inverso: ordem reversa
    const reversedSequence = [...sequence].reverse()
    const isCorrect = userInput.every((digit, index) => 
      digit === reversedSequence[index].toString()
    )
    
    setAttempts(prev => prev + 1)
    
    if (isCorrect) {
      setScore(prev => prev + 10)
      setFeedback({
        correct: true,
        message: "Excelente! Sequência inversa correta!"
      })
    } else {
      const correctSequence = reversedSequence.join(' ')
      setFeedback({
        correct: false,
        message: `Incorreto. A sequência inversa era: ${correctSequence}`
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
              <h1 className="text-2xl font-bold text-gray-800">Span de Dígitos</h1>
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
                Desenvolver e fortalecer a capacidade de memória de trabalho através do desafio 
                do span inverso. Esta atividade treina especificamente a manipulação mental ativa 
                de informações numéricas, exigindo não apenas memorização, mas controle executivo 
                para reverter sequências mentalmente.
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
                  <h3 className="font-semibold text-blue-600">Nível 1: Span Inverso Básico</h3>
                  <p className="text-gray-600 text-sm">3 dígitos na ordem inversa (sequência reversa)</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Iniciante
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 2: Span Inverso Intermediário</h3>
                  <p className="text-gray-600 text-sm">4 dígitos na ordem inversa (sequência reversa)</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Intermediário
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 3: Span Inverso Avançado</h3>
                  <p className="text-gray-600 text-sm">5 dígitos na ordem inversa (sequência reversa)</p>
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
              dominar as habilidades do span inverso, fortalecendo especificamente 
              a capacidade de manipulação mental ativa na memória de trabalho.
            </p>
          </div>

          {/* Base Científica */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-pink-400">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-semibold text-gray-800">Base Científica:</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              O Span de Dígitos Inverso é uma das medidas mais robustas da memória de trabalho na 
              neuropsicologia. Diferente do span direto (apenas retenção), o span inverso exige 
              controle executivo ativo para manipular mentalmente a informação. É considerado um 
              indicador puro da capacidade de memória de trabalho e função executiva.
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
              <h1 className="text-2xl font-bold text-gray-800">Span de Dígitos</h1>
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
                Nível {currentLevel}: Span Inverso - {levelConfig[currentLevel as keyof typeof levelConfig].length} dígitos
              </h2>
              <p className="text-gray-600 mb-6">
                Uma sequência de números aparecerá. Memorize-a e digite na ordem INVERSA (de trás para frente).
                Este é o desafio clássico do span inverso da neuropsicologia!
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
              <h2 className="text-xl font-semibold mb-6">
                Memorize esta sequência (digite ordem INVERSA):
              </h2>
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
              <p className="text-red-600 font-semibold mt-2">
                ⚠️ ATENÇÃO: Digite na ordem INVERSA!
              </p>
            </div>
          )}

          {gamePhase === 'input' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-6">
                Digite a sequência na ordem INVERSA:
              </h2>
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-semibold">
                  🔄 ORDEM INVERSA: Digite de trás para frente!
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Exemplo: Se viu "1 2 3", digite "3 2 1"
                </p>
              </div>
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