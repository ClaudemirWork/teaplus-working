'use client'

import { useState, useEffect } from 'react'

interface AudioExercise {
  id: number
  title: string
  instruction: string
  audioDescription: string
  speaker: string
  speakerEmotion: string
  message: string
  questions: {
    id: number
    question: string
    options: string[]
    correct: number
    explanation: string
  }[]
  listeningSkill: string
}

interface Level {
  id: number
  name: string
  description: string
  exercises: AudioExercise[]
  pointsRequired: number
}

export default function EmotionMirror() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const [observationTime, setObservationTime] = useState(0)
  const [isObserving, setIsObserving] = useState(true)

  useEffect(() => {
    if (isObserving && observationTime < 5) {
      const timer = setTimeout(() => {
        setObservationTime(observationTime + 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (observationTime >= 5) {
      setIsObserving(false)
    }
  }, [observationTime, isObserving])

  const levels: Level[] = [
    {
      id: 1,
      name: "Emoções Básicas",
      description: "Reconhecer emoções fundamentais através de expressões faciais",
      pointsRequired: 40,
      exercises: [
        {
          id: 1,
          title: "Alegria Genuína",
          instruction: "Observe atentamente a expressão facial e identifique a emoção",
          emotion: "Felicidade",
          emotionIcon: "😊",
          facialDescription: "Olhos brilhantes e levemente contraídos, cantos da boca elevados, bochechas ligeiramente levantadas, expressão radiante de contentamento",
          context: "Maria acabou de receber uma boa notícia sobre sua aprovação na escola",
          skillFocus: "Reconhecimento de alegria genuína",
          questions: [
            {
              id: 1,
              question: "Qual emoção esta pessoa está expressando?",
              options: ["Tristeza", "Felicidade", "Raiva", "Medo"],
              correct: 1,
              explanation: "A expressão mostra felicidade genuína: olhos brilhantes e sorriso natural com bochechas elevadas."
            },
            {
              id: 2,
              question: "Como você pode identificar que é uma alegria verdadeira?",
              options: ["Apenas os lábios sorriem", "Os olhos também 'sorriem'", "A testa está franzida", "Os ombros estão tensos"],
              correct: 1,
              explanation: "Na alegria genuína, os olhos se contraem levemente e as bochechas se elevam, criando o 'sorriso dos olhos'."
            }
          ]
        },
        {
          id: 2,
          title: "Tristeza Profunda",
          instruction: "Analise os sinais faciais de tristeza",
          emotion: "Tristeza",
          emotionIcon: "😢",
          facialDescription: "Cantos da boca voltados para baixo, olhos ligeiramente fechados ou com lágrimas, sobrancelhas em formato de 'V' invertido, expressão melancólica",
          context: "João está se sentindo triste porque seu melhor amigo se mudou de cidade",
          skillFocus: "Identificação de sinais de tristeza",
          questions: [
            {
              id: 1,
              question: "Qual a principal característica facial da tristeza?",
              options: ["Boca aberta", "Cantos da boca para baixo", "Dentes cerrados", "Língua para fora"],
              correct: 1,
              explanation: "Na tristeza, os cantos da boca se voltam para baixo e as sobrancelhas formam um 'V' invertido."
            }
          ]
        },
        {
          id: 3,
          title: "Raiva Intensa",
          instruction: "Reconheça os sinais de irritação e raiva",
          emotion: "Raiva",
          emotionIcon: "😠",
          facialDescription: "Sobrancelhas franzidas e baixas, olhos estreitados, lábios apertados ou mostrando dentes, tensão facial visível, mandíbula contraída",
          context: "Carlos está irritado porque alguém pegou seu material sem pedir",
          skillFocus: "Detecção de sinais de raiva",
          questions: [
            {
              id: 1,
              question: "Qual sinal facial indica raiva?",
              options: ["Sobrancelhas franzidas", "Olhos arregalados", "Boca relaxada", "Bochechas rosadas"],
              correct: 0,
              explanation: "A raiva se manifesta principalmente através de sobrancelhas franzidas e tensão na região dos olhos."
            }
          ]
        },
        {
          id: 4,
          title: "Surpresa Genuína",
          instruction: "Identifique os elementos da surpresa",
          emotion: "Surpresa",
          emotionIcon: "😲",
          facialDescription: "Olhos arregalados, sobrancelhas elevadas, boca ligeiramente aberta em formato oval, expressão de espanto momentâneo",
          context: "Ana foi surpreendida com uma festa de aniversário inesperada",
          skillFocus: "Reconhecimento de surpresa",
          questions: [
            {
              id: 1,
              question: "O que caracteriza a expressão de surpresa?",
              options: ["Olhos fechados", "Olhos arregalados", "Olhos estreitados", "Olhos normais"],
              correct: 1,
              explanation: "A surpresa se caracteriza por olhos arregalados, sobrancelhas elevadas e boca ligeiramente aberta."
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Emoções Intermediárias",
      description: "Reconhecer emoções mais sutis e suas nuances",
      pointsRequired: 50,
      exercises: [
        {
          id: 5,
          title: "Nervosismo e Ansiedade",
          instruction: "Detecte os sinais de nervosismo",
          emotion: "Nervosismo",
          emotionIcon: "😰",
          facialDescription: "Olhos ligeiramente arregalados, sobrancelhas levemente elevadas, lábios entreabertos ou sendo mordidos, expressão de preocupação",
          context: "Pedro está nervoso antes de fazer uma apresentação na escola",
          skillFocus: "Identificação de ansiedade",
          questions: [
            {
              id: 1,
              question: "Como identificar nervosismo?",
              options: ["Expressão muito relaxada", "Sinais de tensão sutil", "Sorriso constante", "Olhos fechados"],
              correct: 1,
              explanation: "O nervosismo se manifesta através de tensão sutil: lábios entreabertos e ligeira elevação das sobrancelhas."
            }
          ]
        },
        {
          id: 6,
          title: "Confusão Mental",
          instruction: "Reconheça sinais de confusão",
          emotion: "Confusão",
          emotionIcon: "😕",
          facialDescription: "Sobrancelhas ligeiramente franzidas, olhos com olhar perdido, boca levemente entreaberta, expressão de questionamento",
          context: "Laura está confusa com as instruções do exercício de matemática",
          skillFocus: "Detecção de confusão",
          questions: [
            {
              id: 1,
              question: "Qual expressão indica confusão?",
              options: ["Olhar fixo e determinado", "Olhar perdido e questionador", "Olhar alegre", "Olhar irritado"],
              correct: 1,
              explanation: "A confusão se manifesta por um olhar perdido, sobrancelhas ligeiramente franzidas e expressão questionadora."
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Emoções Complexas",
      description: "Interpretar emoções mistas e sutis expressões sociais",
      pointsRequired: 60,
      exercises: [
        {
          id: 7,
          title: "Sarcasmo Sutil",
          instruction: "Identifique quando alguém está sendo sarcástico",
          emotion: "Sarcasmo",
          emotionIcon: "😏",
          facialDescription: "Meio sorriso assimétrico, sobrancelha ligeiramente elevada, olhar de lado, expressão de ironia controlada",
          context: "Roberto faz um comentário irônico sobre o tempo chuvoso",
          skillFocus: "Reconhecimento de ironia",
          questions: [
            {
              id: 1,
              question: "Como reconhecer sarcasmo?",
              options: ["Sorriso simétrico", "Sorriso assimétrico", "Expressão neutra", "Franzir de testa"],
              correct: 1,
              explanation: "O sarcasmo geralmente se manifesta por um sorriso assimétrico e olhar de lado, indicando ironia."
            }
          ]
        },
        {
          id: 8,
          title: "Vergonha e Constrangimento",
          instruction: "Detecte sinais de vergonha",
          emotion: "Vergonha",
          emotionIcon: "😳",
          facialDescription: "Bochechas rosadas, olhar desviado para baixo, sorriso tímido ou forçado, ombros ligeiramente curvados",
          context: "Mariana se sente envergonhada após tropeçar na frente dos colegas",
          skillFocus: "Identificação de constrangimento",
          questions: [
            {
              id: 1,
              question: "Qual sinal indica vergonha?",
              options: ["Olhar direto e fixo", "Olhar desviado para baixo", "Olhar para o alto", "Olhar de lado"],
              correct: 1,
              explanation: "A vergonha se caracteriza por desviar o olhar para baixo e bochechas rosadas."
            }
          ]
        }
      ]
    }
  ]

  const currentLevelData = levels.find(level => level.id === currentLevel)
  const currentExerciseData = currentLevelData?.exercises[currentExercise]
  const currentQuestionData = currentExerciseData?.questions[currentQuestion]

  const startNewExercise = () => {
    setObservationTime(0)
    setIsObserving(true)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
  }

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === currentQuestionData?.correct) {
      const points = 10
      setScore(score + points)
      setTotalScore(totalScore + points)
    }

    setTimeout(() => {
      setShowExplanation(true)
    }, 1500)
  }

  const nextQuestion = () => {
    if (!currentExerciseData || !currentQuestionData) return

    if (currentQuestion < currentExerciseData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setShowExplanation(false)
    } else {
      if (currentExercise < (currentLevelData?.exercises.length || 0) - 1) {
        setCurrentExercise(currentExercise + 1)
        setCurrentQuestion(0)
        startNewExercise()
      } else {
        if (score >= (currentLevelData?.pointsRequired || 0)) {
          setCompletedLevels([...completedLevels, currentLevel])
          
          if (currentLevel < levels.length) {
            setCurrentLevel(currentLevel + 1)
            setCurrentExercise(0)
            setCurrentQuestion(0)
            setScore(0)
            startNewExercise()
          } else {
            setGameCompleted(true)
          }
        } else {
          setCurrentExercise(0)
          setCurrentQuestion(0)
          setScore(0)
          startNewExercise()
        }
      }
    }
  }

  const resetGame = () => {
    setCurrentLevel(1)
    setCurrentExercise(0)
    setCurrentQuestion(0)
    setScore(0)
    setTotalScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setCompletedLevels([])
    setGameCompleted(false)
    startNewExercise()
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => window.history.back()}
              className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              ← Voltar
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🌟</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Espelho de Emoções</h1>
            </div>
          </div>

          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="rounded-3xl bg-white p-8 md:p-12 shadow-xl">
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-3xl md:text-4xl">
                    🏆
                  </div>
                  <h1 className="mb-4 text-2xl md:text-4xl font-bold text-gray-900">
                    Parabéns! Espelho Concluído!
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600">
                    Você dominou o reconhecimento de emoções!
                  </p>
                </div>

                <div className="mb-8 space-y-4">
                  <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-pink-50 p-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Pontuação Final</h3>
                    <p className="text-2xl md:text-3xl font-bold text-orange-600">{totalScore} pontos</p>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 p-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Níveis Completados</h3>
                    <p className="text-xl md:text-2xl font-bold text-pink-600">{completedLevels.length}/3</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={resetGame}
                    className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:from-orange-600 hover:to-pink-700 hover:shadow-lg"
                  >
                    🔄 Jogar Novamente
                  </button>
                  <button
                    onClick={() => window.history.back()}
                    className="w-full rounded-2xl border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-gray-400 hover:shadow-lg"
                  >
                    🏠 Voltar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()}
                className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                ← Voltar
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🌟</span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Espelho de Emoções</h1>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Pontuação Total</div>
              <div className="text-xl md:text-2xl font-bold text-orange-600">{totalScore} pts</div>
            </div>
          </div>
          
          <p className="text-gray-600 mt-4 text-center max-w-3xl mx-auto">
            Desenvolva a habilidade de reconhecer emoções através de expressões faciais
          </p>
        </div>

        {/* Info Cards */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white p-4 md:p-6 shadow-sm border-l-4 border-red-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl md:text-2xl">🎯</span>
              <h3 className="text-sm md:text-lg font-semibold text-red-600">Objetivo:</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-700">
              Aprender a identificar e interpretar diferentes emoções através de expressões faciais e contexto social
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 md:p-6 shadow-sm border-l-4 border-orange-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl md:text-2xl">👑</span>
              <h3 className="text-sm md:text-lg font-semibold text-orange-600">Pontuação:</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-700">
              Cada resposta correta = +10 pontos. Observe atentamente as expressões antes de responder
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 md:p-6 shadow-sm border-l-4 border-pink-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl md:text-2xl">📊</span>
              <h3 className="text-sm md:text-lg font-semibold text-pink-600">Níveis:</h3>
            </div>
            <div className="space-y-1 text-xs md:text-sm">
              <div className={completedLevels.includes(1) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-pink-600">Nível 1:</span> Emoções básicas
              </div>
              <div className={completedLevels.includes(2) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-pink-600">Nível 2:</span> Emoções intermediárias
              </div>
              <div className={completedLevels.includes(3) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-pink-600">Nível 3:</span> Emoções complexas
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 md:p-6 shadow-sm border-l-4 border-purple-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl md:text-2xl">🧠</span>
              <h3 className="text-sm md:text-lg font-semibold text-purple-600">Método:</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-700">
              Baseado no Mind Reading de Simon Baron-Cohen para desenvolvimento da empatia cognitiva
            </p>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xl">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Nível {currentLevel}: {currentLevelData?.name}
                </h2>
                <p className="text-gray-600">{currentLevelData?.description}</p>
              </div>
              <div className="text-left md:text-right mt-2 md:mt-0">
                <div className="text-sm text-gray-500">Pontos do Nível</div>
                <div className="text-lg md:text-xl font-bold text-orange-600">
                  {score}/{currentLevelData?.pointsRequired}
                </div>
              </div>
            </div>
            
            <div className="h-3 rounded-full bg-gray-200">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-500"
                style={{ 
                  width: `${Math.min((score / (currentLevelData?.pointsRequired || 1)) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {currentExerciseData && currentQuestionData && (
            <div className="mb-8">
              <div className="mb-6 rounded-2xl bg-gradient-to-r from-orange-50 to-pink-50 p-4 md:p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{currentExerciseData.title}</h3>
                <p className="mb-4 text-gray-700">{currentExerciseData.instruction}</p>
                <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-orange-600">
                  Foco: {currentExerciseData.skillFocus}
                </div>
              </div>

              <div className="mb-6 rounded-2xl bg-gray-50 p-4 md:p-6">
                <div className="text-center mb-6">
                  <div className="mx-auto mb-4 flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-gradient-to-r from-orange-100 to-pink-100 text-6xl md:text-8xl">
                    {currentExerciseData.emotionIcon}
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{currentExerciseData.emotion}</h4>
                  
                  {isObserving ? (
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm md:text-base">
                     ⏱️ Observe atentamente... {5 - observationTime}s
                    </div>
                  ) : (
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm md:text-base">
                      ✅ Observação concluída! Responda as perguntas.
                    </div>
                  )}
                </div>
                
                <div className="rounded-lg bg-white p-4 md:p-6 border border-gray-200">
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">🔍 Descrição Facial:</h5>
                    <p className="text-gray-700 text-sm md:text-base">{currentExerciseData.facialDescription}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">📖 Contexto:</h5>
                    <p className="text-gray-700 text-sm md:text-base">{currentExerciseData.context}</p>
                  </div>
                </div>
              </div>

              {!isObserving && (
                <>
                  <div className="mb-6">
                    <h4 className="mb-4 text-lg font-semibold text-gray-900">
                      Pergunta {currentQuestion + 1}: {currentQuestionData.question}
                    </h4>

                    <div className="space-y-3">
                      {currentQuestionData.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full rounded-2xl p-3 md:p-4 text-left transition-all text-sm md:text-base ${
                            selectedAnswer === null
                              ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-lg'
                              : selectedAnswer === index
                              ? index === currentQuestionData.correct
                                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                : 'bg-red-100 text-red-800 border-2 border-red-300'
                              : index === currentQuestionData.correct
                              ? 'bg-green-100 text-green-800 border-2 border-green-300'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {showResult && (
                    <div className={`mb-4 rounded-2xl p-4 ${
                      selectedAnswer === currentQuestionData.correct
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedAnswer === currentQuestionData.correct ? (
                        <div className="flex items-center">
                          <span className="mr-2 text-2xl">✅</span>
                          <span className="text-base md:text-lg font-semibold">Excelente percepção! +10 pontos</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="mr-2 text-2xl">🔍</span>
                          <span className="text-base md:text-lg font-semibold">Continue praticando sua observação!</span>
                        </div>
                      )}
                    </div>
                  )}

                  {showExplanation && (
                    <div className="mb-6 rounded-2xl bg-blue-50 p-4 md:p-6">
                      <h4 className="mb-2 font-semibold text-blue-900">💡 Dica de Observação:</h4>
                      <p className="text-blue-800 text-sm md:text-base">{currentQuestionData.explanation}</p>
                    </div>
                  )}

                  {showExplanation && (
                    <div className="text-center">
                      <button
                        onClick={nextQuestion}
                        className="w-full md:w-auto rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 px-6 md:px-8 py-3 text-base md:text-lg font-semibold text-white transition-all hover:from-orange-600 hover:to-pink-700 hover:shadow-lg"
                      >
                        {currentQuestion < (currentExerciseData?.questions.length || 0) - 1 
                          ? 'Próxima Pergunta'
                          : currentExercise < (currentLevelData?.exercises.length || 0) - 1
                          ? 'Próxima Emoção'
                          : score >= (currentLevelData?.pointsRequired || 0)
                          ? currentLevel < levels.length ? 'Próximo Nível' : 'Finalizar'
                          : 'Tentar Nível Novamente'
                        }
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <div className="mt-8 text-center text-xs md:text-sm text-gray-500">
            Emoção {currentExercise + 1} • Pergunta {currentQuestion + 1} • Nível {currentLevel} de {levels.length}
          </div>
        </div>
      </div>
    </div>
  )
}