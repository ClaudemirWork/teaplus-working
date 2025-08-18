'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Expression {
  id: number
  image: string
  emotion: string
  options: string[]
  correct: number
  explanation: string
  intensity: 'sutil' | 'moderada' | 'intensa'
}

interface Level {
  id: number
  name: string
  description: string
  expressions: Expression[]
  pointsRequired: number
}

export default function NonverbalExpressions() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentExpression, setCurrentExpression] = useState(0)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)

  const levels: Level[] = [
    {
      id: 1,
      name: "Expressões Básicas",
      description: "Identificação de emoções fundamentais em expressões claras",
      pointsRequired: 20,
      expressions: [
        {
          id: 1,
          image: "😊",
          emotion: "Felicidade",
          options: ["Tristeza", "Felicidade", "Raiva", "Medo"],
          correct: 1,
          explanation: "O sorriso genuíno é caracterizado pelo levantamento dos cantos da boca e contração dos músculos ao redor dos olhos.",
          intensity: 'moderada'
        },
        {
          id: 2,
          image: "😢",
          emotion: "Tristeza",
          options: ["Felicidade", "Surpresa", "Tristeza", "Nojo"],
          correct: 2,
          explanation: "A tristeza é expressa através do abaixamento dos cantos da boca e franzimento da testa.",
          intensity: 'moderada'
        },
        {
          id: 3,
          image: "😠",
          emotion: "Raiva",
          options: ["Raiva", "Medo", "Felicidade", "Surpresa"],
          correct: 0,
          explanation: "A raiva é mostrada através do franzimento das sobrancelhas, tensão facial e possível cerramento dos lábios.",
          intensity: 'intensa'
        },
        {
          id: 4,
          image: "😨",
          emotion: "Medo",
          options: ["Nojo", "Felicidade", "Medo", "Raiva"],
          correct: 2,
          explanation: "O medo é caracterizado pelos olhos arregalados, sobrancelhas levantadas e boca ligeiramente aberta.",
          intensity: 'intensa'
        }
      ]
    },
    {
      id: 2,
      name: "Expressões Sutis",
      description: "Reconhecimento de micro-expressões e sinais emocionais discretos",
      pointsRequired: 30,
      expressions: [
        {
          id: 5,
          image: "🙂",
          emotion: "Satisfação",
          options: ["Indiferença", "Satisfação", "Preocupação", "Ironia"],
          correct: 1,
          explanation: "Um sorriso sutil indica satisfação ou contentamento leve, sem a intensidade da felicidade plena.",
          intensity: 'sutil'
        },
        {
          id: 6,
          image: "😒",
          emotion: "Descontentamento",
          options: ["Tédio", "Raiva", "Descontentamento", "Tristeza"],
          correct: 2,
          explanation: "O descontentamento é mostrado através de uma expressão neutra com leve franzimento e olhar de lado.",
          intensity: 'sutil'
        },
        {
          id: 7,
          image: "🤔",
          emotion: "Reflexão",
          options: ["Confusão", "Reflexão", "Dúvida", "Concentração"],
          correct: 1,
          explanation: "A reflexão é caracterizada por olhar pensativo, possível toque no queixo e expressão concentrada.",
          intensity: 'sutil'
        },
        {
          id: 8,
          image: "😌",
          emotion: "Tranquilidade",
          options: ["Sonolência", "Tranquilidade", "Resignação", "Satisfação"],
          correct: 1,
          explanation: "A tranquilidade é expressa através de músculos faciais relaxados e expressão serena.",
          intensity: 'sutil'
        }
      ]
    },
    {
      id: 3,
      name: "Expressões Complexas",
      description: "Interpretação de emoções mistas e contextuais",
      pointsRequired: 40,
      expressions: [
        {
          id: 9,
          image: "😏",
          emotion: "Ironia",
          options: ["Arrogância", "Ironia", "Satisfação", "Desprezo"],
          correct: 1,
          explanation: "A ironia é mostrada através de um sorriso assimétrico, com um canto da boca mais elevado que o outro.",
          intensity: 'sutil'
        },
        {
          id: 10,
          image: "🥺",
          emotion: "Súplica",
          options: ["Tristeza", "Medo", "Súplica", "Vergonha"],
          correct: 2,
          explanation: "A súplica é caracterizada por olhos ligeiramente úmidos, sobrancelhas levantadas e expressão vulnerável.",
          intensity: 'moderada'
        },
        {
          id: 11,
          image: "😤",
          emotion: "Frustração",
          options: ["Raiva", "Frustração", "Determinação", "Impaciência"],
          correct: 1,
          explanation: "A frustração combina elementos de raiva contida com sinais de exaustão emocional.",
          intensity: 'moderada'
        },
        {
          id: 12,
          image: "🤨",
          emotion: "Ceticismo",
          options: ["Confusão", "Desconfiança", "Ceticismo", "Curiosidade"],
          correct: 2,
          explanation: "O ceticismo é expresso através de uma sobrancelha levantada e olhar questionador.",
          intensity: 'sutil'
        }
      ]
    }
  ]

  const currentLevelData = levels.find(level => level.id === currentLevel)
  const currentExpressionData = currentLevelData?.expressions[currentExpression]

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === currentExpressionData?.correct) {
      const points = 10
      setScore(score + points)
      setTotalScore(totalScore + points)
    }

    setTimeout(() => {
      setShowExplanation(true)
    }, 1500)
  }

  const nextExpression = () => {
    if (!currentLevelData) return

    if (currentExpression < currentLevelData.expressions.length - 1) {
      setCurrentExpression(currentExpression + 1)
    } else {
      // Fim do nível
      if (score >= currentLevelData.pointsRequired) {
        setCompletedLevels([...completedLevels, currentLevel])
        
        if (currentLevel < levels.length) {
          setCurrentLevel(currentLevel + 1)
          setCurrentExpression(0)
          setScore(0)
        } else {
          setGameCompleted(true)
        }
      } else {
        // Reiniciar nível se não atingiu pontuação mínima
        setCurrentExpression(0)
        setScore(0)
      }
    }

    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
  }

  const resetGame = () => {
    setCurrentLevel(1)
    setCurrentExpression(0)
    setScore(0)
    setTotalScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setCompletedLevels([])
    setGameCompleted(false)
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'sutil': return 'text-blue-600'
      case 'moderada': return 'text-yellow-600'
      case 'intensa': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getIntensityBg = (intensity: string) => {
    switch (intensity) {
      case 'sutil': return 'bg-blue-100'
      case 'moderada': return 'bg-yellow-100'
      case 'intensa': return 'bg-red-100'
      default: return 'bg-gray-100'
    }
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
        {/* Header Mobile */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <a 
                href="/dashboard" 
                className="flex items-center text-orange-600 hover:text-orange-700 transition-colors min-h-[44px] px-2 -ml-2"
              >
                <span className="text-xl mr-2">←</span>
                <span className="text-sm sm:text-base font-medium">Voltar</span>
              </a>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4 flex items-center justify-center gap-2">
                <span className="text-xl sm:text-2xl">😊</span>
                <span>Expressões Não-Verbais</span>
              </h1>
              <div className="w-20"></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="max-w-2xl text-center">
              <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl">
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-3xl sm:text-4xl">
                    🏆
                  </div>
                  <h1 className="mb-4 text-2xl sm:text-4xl font-bold text-gray-900">
                    Parabéns! Atividade Concluída!
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600">
                    Você dominou a leitura de expressões não-verbais!
                  </p>
                </div>

                <div className="mb-8 space-y-4">
                  <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
                    <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">Pontuação Final</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{totalScore} pontos</p>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6">
                    <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">Níveis Completados</h3>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">{completedLevels.length}/3</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={resetGame}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-700 hover:shadow-lg min-h-[48px] touch-manipulation"
                  >
                    🔄 Jogar Novamente
                  </button>
                  <a
                    href="/dashboard"
                    className="block w-full rounded-2xl border-2 border-gray-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-gray-700 transition-all hover:border-gray-400 hover:shadow-lg min-h-[48px] touch-manipulation"
                  >
                    🏠 Voltar à TEA
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      {/* Header Mobile */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Botão Voltar */}
            <a 
              href="/dashboard" 
              className="flex items-center text-orange-600 hover:text-orange-700 transition-colors min-h-[44px] px-2 -ml-2"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-sm sm:text-base font-medium">Voltar</span>
            </a>
            
            {/* Título */}
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4 flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl">😊</span>
              <span>Expressões Não-Verbais</span>
            </h1>
            
            {/* Pontuação */}
            <div className="text-right">
              <div className="text-xs sm:text-sm text-gray-500">Pontuação Total</div>
              <div className="text-base sm:text-xl font-bold text-orange-600">{totalScore} pts</div>
            </div>
          </div>
          
          {/* Subtítulo */}
          <p className="text-center text-sm sm:text-base text-gray-600 mt-2">Leitura de sinais faciais e emocionais sutis</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Game Info Cards */}
        <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Objetivo */}
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg border-l-4 border-red-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">🎯</span>
              <h3 className="text-base sm:text-lg font-semibold text-red-600">Objetivo:</h3>
            </div>
            <p className="text-sm text-gray-700">
              Desenvolver habilidades de interpretação de expressões faciais, micro-expressões e sinais emocionais não-verbais para melhorar a compreensão das emoções dos outros
            </p>
          </div>

          {/* Pontuação */}
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg border-l-4 border-blue-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">👑</span>
              <h3 className="text-base sm:text-lg font-semibold text-blue-600">Pontuação:</h3>
            </div>
            <p className="text-sm text-gray-700">
              Cada interpretação correta = +10 pontos. Complete cada nível para avançar e dominar a leitura de expressões
            </p>
          </div>

          {/* Níveis */}
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg border-l-4 border-purple-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">📊</span>
              <h3 className="text-base sm:text-lg font-semibold text-purple-600">Níveis:</h3>
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <div className={completedLevels.includes(1) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-purple-600">Nível 1:</span> Expressões básicas
              </div>
              <div className={completedLevels.includes(2) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-purple-600">Nível 2:</span> Expressões sutis
              </div>
              <div className={completedLevels.includes(3) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-purple-600">Nível 3:</span> Expressões complexas
              </div>
            </div>
          </div>

          {/* Final */}
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg border-l-4 border-green-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">🏁</span>
              <h3 className="text-base sm:text-lg font-semibold text-green-600">Final:</h3>
            </div>
            <p className="text-sm text-gray-700">
              Complete os 3 níveis com pontuação mínima para finalizar a atividade e dominar a leitura de expressões não-verbais
            </p>
          </div>
        </div>

        {/* Game Area */}
        <div className="rounded-xl sm:rounded-3xl bg-white p-4 sm:p-8 shadow-xl">
          {/* Level Info */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="mb-2 sm:mb-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Nível {currentLevel}: {currentLevelData?.name}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">{currentLevelData?.description}</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-gray-500">Pontos do Nível</div>
                <div className="text-lg sm:text-xl font-bold text-purple-600">
                  {score}/{currentLevelData?.pointsRequired}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 h-2 sm:h-3 rounded-full bg-gray-200">
              <div 
                className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                style={{ 
                  width: `${Math.min((score / (currentLevelData?.pointsRequired || 1)) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Expression Display */}
          {currentExpressionData && (
            <div className="mb-6 sm:mb-8">
              <div className="text-center">
                <div className="mb-6">
                  <div className="mx-auto mb-4 flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-gray-100 text-6xl sm:text-8xl">
                    {currentExpressionData.image}
                  </div>
                  <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs sm:text-sm font-medium ${getIntensityBg(currentExpressionData.intensity)} ${getIntensityColor(currentExpressionData.intensity)}`}>
                    Intensidade: {currentExpressionData.intensity}
                  </div>
                </div>

                <h3 className="mb-6 text-lg sm:text-xl font-semibold text-gray-900">
                  Que emoção esta expressão representa?
                </h3>

                {/* Answer Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                  {currentExpressionData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`rounded-xl p-3 sm:p-4 text-base sm:text-lg font-semibold transition-all min-h-[48px] touch-manipulation ${
                        selectedAnswer === null
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-lg active:bg-gray-300'
                          : selectedAnswer === index
                          ? index === currentExpressionData.correct
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : index === currentExpressionData.correct
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Result Feedback */}
                {showResult && (
                  <div className={`mb-4 rounded-xl p-4 ${
                    selectedAnswer === currentExpressionData.correct
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedAnswer === currentExpressionData.correct ? (
                      <div className="flex items-center justify-center">
                        <span className="mr-2 text-xl sm:text-2xl">✅</span>
                        <span className="text-base sm:text-lg font-semibold">Correto! +10 pontos</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2 text-xl sm:text-2xl">❌</span>
                        <span className="text-base sm:text-lg font-semibold">
                          Incorreto. A resposta correta é: {currentExpressionData.options[currentExpressionData.correct]}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation */}
                {showExplanation && (
                  <div className="mb-6 rounded-xl bg-blue-50 p-4 sm:p-6">
                    <h4 className="mb-2 font-semibold text-blue-900 text-sm sm:text-base">Explicação:</h4>
                    <p className="text-blue-800 text-sm sm:text-base">{currentExpressionData.explanation}</p>
                  </div>
                )}

                {/* Next Button */}
                {showExplanation && (
                  <button
                    onClick={nextExpression}
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-700 hover:shadow-lg active:scale-95 min-h-[48px] touch-manipulation"
                  >
                    {currentExpression < (currentLevelData?.expressions.length || 0) - 1 
                      ? 'Próxima Expressão' 
                      : score >= (currentLevelData?.pointsRequired || 0)
                      ? currentLevel < levels.length ? 'Próximo Nível' : 'Finalizar'
                      : 'Tentar Nível Novamente'
                    }
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
            Expressão {currentExpression + 1} de {currentLevelData?.expressions.length} • Nível {currentLevel} de {levels.length}
          </div>
        </div>
      </div>
    </div>
  )
}