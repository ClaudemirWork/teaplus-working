'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GameHeader } from '@/components/GameHeader'
import { Smile, Trophy, Gamepad2 } from 'lucide-react'

// As interfaces Expression e Level permanecem as mesmas
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
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentExpression, setCurrentExpression] = useState(0)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)

  // A lógica de levels, handleAnswer, etc., permanece 100% a mesma.
  const levels: Level[] = [
    {
      id: 1,
      name: "Expressões Básicas",
      description: "Emoções fundamentais e claras",
      pointsRequired: 20,
      expressions: [
        { id: 1, image: "😊", emotion: "Felicidade", options: ["Tristeza", "Felicidade", "Raiva", "Medo"], correct: 1, explanation: "O sorriso genuíno é caracterizado pelo levantamento dos cantos da boca e contração dos músculos ao redor dos olhos.", intensity: 'moderada' },
        { id: 2, image: "😢", emotion: "Tristeza", options: ["Felicidade", "Surpresa", "Tristeza", "Nojo"], correct: 2, explanation: "A tristeza é expressa através do abaixamento dos cantos da boca e franzimento da testa.", intensity: 'moderada' },
        { id: 3, image: "😠", emotion: "Raiva", options: ["Raiva", "Medo", "Felicidade", "Surpresa"], correct: 0, explanation: "A raiva é mostrada através do franzimento das sobrancelhas, tensão facial e possível cerramento dos lábios.", intensity: 'intensa' },
        { id: 4, image: "😨", emotion: "Medo", options: ["Nojo", "Felicidade", "Medo", "Raiva"], correct: 2, explanation: "O medo é caracterizado pelos olhos arregalados, sobrancelhas levantadas e boca ligeiramente aberta.", intensity: 'intensa' }
      ]
    },
    {
      id: 2,
      name: "Expressões Sutis",
      description: "Sinais emocionais discretos",
      pointsRequired: 30,
      expressions: [
        { id: 5, image: "🙂", emotion: "Satisfação", options: ["Indiferença", "Satisfação", "Preocupação", "Ironia"], correct: 1, explanation: "Um sorriso sutil indica satisfação ou contentamento leve, sem a intensidade da felicidade plena.", intensity: 'sutil' },
        { id: 6, image: "😒", emotion: "Descontentamento", options: ["Tédio", "Raiva", "Descontentamento", "Tristeza"], correct: 2, explanation: "O descontentamento é mostrado através de uma expressão neutra com leve franzimento e olhar de lado.", intensity: 'sutil' },
        { id: 7, image: "🤔", emotion: "Reflexão", options: ["Confusão", "Reflexão", "Dúvida", "Concentração"], correct: 1, explanation: "A reflexão é caracterizada por olhar pensativo, possível toque no queixo e expressão concentrada.", intensity: 'sutil' },
        { id: 8, image: "😌", emotion: "Tranquilidade", options: ["Sonolência", "Tranquilidade", "Resignação", "Satisfação"], correct: 1, explanation: "A tranquilidade é expressa através de músculos faciais relaxados e expressão serena.", intensity: 'sutil' }
      ]
    },
    {
      id: 3,
      name: "Expressões Complexas",
      description: "Emoções mistas e contextuais",
      pointsRequired: 40,
      expressions: [
        { id: 9, image: "😏", emotion: "Ironia", options: ["Arrogância", "Ironia", "Satisfação", "Desprezo"], correct: 1, explanation: "A ironia é mostrada através de um sorriso assimétrico, com um canto da boca mais elevado que o outro.", intensity: 'sutil' },
        { id: 10, image: "🥺", emotion: "Súplica", options: ["Tristeza", "Medo", "Súplica", "Vergonha"], correct: 2, explanation: "A súplica é caracterizada por olhos ligeiramente úmidos, sobrancelhas levantadas e expressão vulnerável.", intensity: 'moderada' },
        { id: 11, image: "😤", emotion: "Frustração", options: ["Raiva", "Frustração", "Determinação", "Impaciência"], correct: 1, explanation: "A frustração combina elementos de raiva contida com sinais de exaustão emocional.", intensity: 'moderada' },
        { id: 12, image: "🤨", emotion: "Ceticismo", options: ["Confusão", "Desconfiança", "Ceticismo", "Curiosidade"], correct: 2, explanation: "O ceticismo é expresso através de uma sobrancelha levantada e olhar questionador.", intensity: 'sutil' }
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
    setTimeout(() => setShowExplanation(true), 1500)
  }

  const nextExpression = () => {
    if (!currentLevelData) return
    if (currentExpression < currentLevelData.expressions.length - 1) {
      setCurrentExpression(currentExpression + 1)
    } else {
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
        setCurrentExpression(0)
        setScore(0)
      }
    }
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
  }

  const resetGame = () => {
    setSelectedLevel(1); // Reseta o nível selecionado para o próximo jogo
    setCurrentLevel(1)
    setCurrentExpression(0)
    setScore(0)
    setTotalScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setCompletedLevels([])
    setGameCompleted(false)
    setIsGameStarted(false)
  }

  const handleStartGame = () => {
    setCurrentLevel(selectedLevel);
    // Zera o score do nível atual ao iniciar
    setScore(0);
    setCurrentExpression(0);
    setIsGameStarted(true);
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

  if (!isGameStarted) {
    return (
      <>
        <GameHeader
          title="Expressões Não-Verbais"
          icon={<Smile className="h-6 w-6" />}
          showSaveButton={false}
        />
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:</h3>
                  <p className="text-sm text-gray-600">Desenvolver a habilidade de reconhecer emoções básicas, sutis e complexas através de expressões faciais.</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Observe a expressão facial (emoji).</li>
                    <li>Escolha a emoção que você acha correta.</li>
                    <li>Avance de nível acertando as respostas.</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                  <p className="text-sm text-gray-600">Você ganha pontos por cada acerto. Atinja a pontuação necessária para desbloquear o próximo nível de dificuldade.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível Inicial</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`p-4 rounded-lg font-medium transition-transform transform hover:scale-105 ${
                      selectedLevel === level.id
                        ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-sm font-semibold">{level.name}</div>
                    <div className="text-xs opacity-80 mt-1">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center pt-4">
              <button
                onClick={handleStartGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg"
              >
                🚀 Iniciar Atividade
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }
  
  // O JOGO EM SI
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <GameHeader
        title="Expressões Não-Verbais"
        icon={<Smile className="h-6 w-6" />}
        showSaveButton={gameCompleted}
        // onSave={suaFuncaoDeSalvar}
      />
      {gameCompleted ? (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="max-w-2xl text-center">
              <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl">
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-4xl">🏆</div>
                  <h1 className="mb-4 text-4xl font-bold text-gray-900">Parabéns!</h1>
                  <p className="text-xl text-gray-600">Você dominou a leitura de expressões não-verbais!</p>
                </div>
                <div className="mb-8 space-y-4">
                  <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Pontuação Final</h3>
                    <p className="text-3xl font-bold text-blue-600">{totalScore} pontos</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <button onClick={resetGame} className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg">
                    🔄 Jogar Novamente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="rounded-xl sm:rounded-3xl bg-white p-4 sm:p-8 shadow-xl">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Nível {currentLevel}: {currentLevelData?.name}</h2>
                  <p className="text-gray-600">{currentLevelData?.description}</p>
                </div>
                <div className="text-left sm:text-right mt-2 sm:mt-0">
                  <div className="text-sm text-gray-500">Pontos do Nível</div>
                  <div className="text-xl font-bold text-purple-600">{score}/{currentLevelData?.pointsRequired}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all" style={{ width: `${Math.min((score / (currentLevelData?.pointsRequired || 1)) * 100, 100)}%` }}></div>
              </div>
            </div>
            
            {/* ### INÍCIO DO BLOCO CORRIGIDO ### */}
            {currentExpressionData && (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gray-100 text-8xl">
                  {currentExpressionData.image}
                </div>
                <div className={`inline-flex items-center rounded-full px-3 py-1 font-medium mb-6 ${getIntensityBg(currentExpressionData.intensity)} ${getIntensityColor(currentExpressionData.intensity)}`}>
                  Intensidade: {currentExpressionData.intensity}
                </div>

                <h3 className="mb-6 text-xl font-semibold text-gray-900">Que emoção esta expressão representa?</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {currentExpressionData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`rounded-xl p-4 text-lg font-semibold transition-all ${
                        selectedAnswer === null
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : selectedAnswer === index
                          ? index === currentExpressionData.correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          : index === currentExpressionData.correct ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {showExplanation && (
                  <>
                    <div className="mb-6 rounded-xl bg-blue-50 p-6 text-left">
                      <h4 className="mb-2 font-semibold text-blue-900 text-base">Explicação:</h4>
                      <p className="text-blue-800">{currentExpressionData.explanation}</p>
                    </div>
                    <button onClick={nextExpression} className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 text-lg font-semibold text-white transition-all hover:shadow-lg">
                      {currentExpression < (currentLevelData?.expressions.length || 0) - 1
                        ? 'Próxima Expressão'
                        : score >= (currentLevelData?.pointsRequired || 0)
                        ? currentLevel < levels.length ? 'Próximo Nível' : 'Finalizar'
                        : 'Tentar Nível Novamente'
                      }
                    </button>
                  </>
                )}
              </div>
            )}
            {/* ### FIM DO BLOCO CORRIGIDO ### */}

          </div>
        </main>
      )}
    </div>
  )
}
