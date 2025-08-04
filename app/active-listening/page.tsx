'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

export default function ActiveListening() {
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
  const [isListening, setIsListening] = useState(false)

  // Inicializar vozes do navegador
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          console.log('Vozes disponíveis:', voices.filter(v => v.lang.includes('pt')))
        }
      }
      
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const levels: Level[] = [
    {
      id: 1,
      name: "Escuta Básica",
      description: "Compreender mensagens simples e identificar informações principais",
      pointsRequired: 30,
      exercises: [
        {
          id: 1,
          title: "Apresentação Pessoal",
          instruction: "Ouça atentamente a apresentação e responda as perguntas",
          audioDescription: "Ana se apresenta de forma amigável",
          speaker: "Ana",
          speakerEmotion: "😊",
          message: "Oi! Meu nome é Ana, tenho 16 anos e estudo no Colégio Santos. Moro aqui em São Paulo com minha família. Gosto muito de ler livros e tocar violão nas horas livres.",
          listeningSkill: "Identificação de informações pessoais",
          questions: [
            {
              id: 1,
              question: "Qual é o nome da pessoa que se apresentou?",
              options: ["Maria", "Ana", "Clara", "Sofia"],
              correct: 1,
              explanation: "A pessoa disse claramente: 'Meu nome é Ana'."
            },
            {
              id: 2,
              question: "Quantos anos Ana tem?",
              options: ["15 anos", "16 anos", "17 anos", "18 anos"],
              correct: 1,
              explanation: "Ana disse: 'tenho 16 anos'."
            },
            {
              id: 3,
              question: "Quais são os hobbies de Ana?",
              options: ["Ler e tocar violão", "Desenhar e cantar", "Dançar e nadar", "Cozinhar e correr"],
              correct: 0,
              explanation: "Ana mencionou: 'Gosto muito de ler livros e tocar violão nas horas livres'."
            }
          ]
        },
        {
          id: 2,
          title: "Instruções Escolares",
          instruction: "Escute as instruções do professor e identifique o que foi solicitado",
          audioDescription: "Professor dando instruções para próxima aula",
          speaker: "Professor",
          speakerEmotion: "📚",
          message: "Pessoal, para a próxima aula vocês precisam trazer o livro de matemática, uma calculadora e fazer os exercícios da página 45. A prova será na sexta-feira.",
          listeningSkill: "Compreensão de instruções",
          questions: [
            {
              id: 1,
              question: "O que os alunos devem trazer para a próxima aula?",
              options: ["Livro e lápis", "Livro e calculadora", "Caderno e régua", "Apenas o livro"],
              correct: 1,
              explanation: "O professor disse: 'precisam trazer o livro de matemática, uma calculadora'."
            },
            {
              id: 2,
              question: "Qual tarefa de casa foi solicitada?",
              options: ["Página 40", "Página 45", "Página 50", "Página 35"],
              correct: 1,
              explanation: "Foi mencionado: 'fazer os exercícios da página 45'."
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Escuta Interpretativa",
      description: "Compreender significados implícitos e intenções nas mensagens",
      pointsRequired: 40,
      exercises: [
        {
          id: 3,
          title: "Detectando Sarcasmo",
          instruction: "Identifique o verdadeiro significado da mensagem",
          audioDescription: "Pessoa usando tom irônico",
          speaker: "Pessoa",
          speakerEmotion: "😏",
          message: "Nossa, que dia lindo para um piquenique!",
          listeningSkill: "Interpretação de sarcasmo e ironia",
          questions: [
            {
              id: 1,
              question: "Qual é o verdadeiro significado da frase?",
              options: ["A pessoa realmente acha o dia bom", "A pessoa está sendo sarcástica", "A pessoa está feliz", "A pessoa quer fazer piquenique"],
              correct: 1,
              explanation: "O tom irônico indica sarcasmo sobre o mau tempo."
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Escuta Empática",
      description: "Identificar emoções e necessidades emocionais nas mensagens",
      pointsRequired: 50,
      exercises: [
        {
          id: 4,
          title: "Detectando Tristeza",
          instruction: "Identifique as emoções por trás das palavras",
          audioDescription: "Estudante com tom baixo e hesitante",
          speaker: "Estudante",
          speakerEmotion: "😔",
          message: "Ah, tudo bem... a prova foi normal, eu acho... não sei...",
          listeningSkill: "Reconhecimento de estados emocionais",
          questions: [
            {
              id: 1,
              question: "Como a pessoa realmente se sente?",
              options: ["Muito feliz", "Confiante", "Preocupada/triste", "Indiferente"],
              correct: 2,
              explanation: "O tom baixo, hesitação e incerteza indicam preocupação ou tristeza."
            }
          ]
        }
      ]
    }
  ]

  const currentLevelData = levels.find(level => level.id === currentLevel)
  const currentExerciseData = currentLevelData?.exercises[currentExercise]
  const currentQuestionData = currentExerciseData?.questions[currentQuestion]

  const simulateAudioPlay = () => {
    if (!currentExerciseData) return
    
    setIsListening(true)
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(currentExerciseData.message)
      
      const voices = window.speechSynthesis.getVoices()
      const ptBrVoice = voices.find(voice => 
        voice.lang.includes('pt-BR') || voice.lang.includes('pt')
      )
      
      if (ptBrVoice) {
        utterance.voice = ptBrVoice
      }
      
      utterance.rate = 1.0
      utterance.pitch = 1.0
      
      utterance.onend = () => {
        setIsListening(false)
      }
      
      utterance.onerror = () => {
        setIsListening(false)
      }
      
      window.speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => {
        setIsListening(false)
      }, 3000)
    }
  }

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsListening(false)
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
    stopAudio()
    
    if (!currentExerciseData || !currentQuestionData) return

    if (currentQuestion < currentExerciseData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      if (currentExercise < (currentLevelData?.exercises.length || 0) - 1) {
        setCurrentExercise(currentExercise + 1)
        setCurrentQuestion(0)
      } else {
        if (score >= (currentLevelData?.pointsRequired || 0)) {
          setCompletedLevels([...completedLevels, currentLevel])
          
          if (currentLevel < levels.length) {
            setCurrentLevel(currentLevel + 1)
            setCurrentExercise(0)
            setCurrentQuestion(0)
            setScore(0)
          } else {
            setGameCompleted(true)
          }
        } else {
          setCurrentExercise(0)
          setCurrentQuestion(0)
          setScore(0)
        }
      }
    }

    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
  }

  const resetGame = () => {
    stopAudio()
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
    setIsListening(false)
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
        {/* Header Mobile */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <a 
                href="/tea" 
                className="flex items-center text-teal-600 hover:text-teal-700 transition-colors min-h-[44px] px-2 -ml-2"
              >
                <span className="text-xl mr-2">←</span>
                <span className="text-sm sm:text-base font-medium">Voltar para TEA</span>
              </a>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4">
                👂 Escuta Ativa
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
                    Você dominou a arte da escuta ativa!
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
                    className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:from-teal-600 hover:to-blue-700 hover:shadow-lg min-h-[48px] touch-manipulation"
                  >
                    🔄 Jogar Novamente
                  </button>
                  <Link
                    href="/tea"
                    className="block w-full rounded-2xl border-2 border-gray-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-gray-700 transition-all hover:border-gray-400 hover:shadow-lg min-h-[48px] touch-manipulation"
                  >
                    🏠 Voltar à TEA
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      {/* Header Mobile */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <a 
              href="/tea" 
              className="flex items-center text-teal-600 hover:text-teal-700 transition-colors min-h-[44px] px-2 -ml-2"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-sm sm:text-base font-medium">Voltar para TEA</span>
            </a>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4">
              👂 Escuta Ativa
            </h1>
            <div className="text-right">
              <div className="text-xs sm:text-sm text-gray-500">Pontuação Total</div>
              <div className="text-base sm:text-xl font-bold text-teal-600">{totalScore} pts</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Game Info Cards */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-white p-4 shadow-lg border-l-4 border-red-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">🎯</span>
              <h3 className="text-base sm:text-lg font-semibold text-red-600">Objetivo:</h3>
            </div>
            <p className="text-sm text-gray-700">
              Desenvolver habilidades de escuta ativa, compreensão de mensagens e interpretação de sinais emocionais
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-lg border-l-4 border-blue-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">👑</span>
              <h3 className="text-base sm:text-lg font-semibold text-blue-600">Pontuação:</h3>
            </div>
            <p className="text-sm text-gray-700">
              Cada resposta correta = +10 pontos. Use o botão ▶️ para ouvir o áudio!
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-lg border-l-4 border-purple-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">📊</span>
              <h3 className="text-base sm:text-lg font-semibold text-purple-600">Níveis:</h3>
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <div className={completedLevels.includes(1) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-purple-600">Nível 1:</span> Escuta básica
              </div>
              <div className={completedLevels.includes(2) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-purple-600">Nível 2:</span> Escuta interpretativa
              </div>
              <div className={completedLevels.includes(3) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-purple-600">Nível 3:</span> Escuta empática
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-lg border-l-4 border-green-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">🏁</span>
              <h3 className="text-base sm:text-lg font-semibold text-green-600">Final:</h3>
            </div>
            <p className="text-sm text-gray-700">
              Complete os 3 níveis para dominar a escuta ativa e compreensão de mensagens
            </p>
          </div>
        </div>

        {/* Game Area */}
        <div className="rounded-xl bg-white p-4 sm:p-8 shadow-xl">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="mb-2 sm:mb-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Nível {currentLevel}: {currentLevelData?.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">{currentLevelData?.description}</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-gray-500">Pontos do Nível</div>
                <div className="text-lg sm:text-xl font-bold text-purple-600">
                  {score}/{currentLevelData?.pointsRequired}
                </div>
              </div>
            </div>
            
            <div className="mt-4 h-2 sm:h-3 rounded-full bg-gray-200">
              <div 
                className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500"
                style={{ 
                  width: `${Math.min((score / (currentLevelData?.pointsRequired || 1)) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {currentExerciseData && currentQuestionData && (
            <div className="mb-6">
              <div className="mb-6 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 p-4 sm:p-6">
                <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">{currentExerciseData.title}</h3>
                <p className="mb-4 text-sm sm:text-base text-gray-700">{currentExerciseData.instruction}</p>
                <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs sm:text-sm font-medium text-teal-600">
                  Habilidade: {currentExerciseData.listeningSkill}
                </div>
              </div>

              <div className="mb-6 rounded-xl bg-gray-50 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-blue-500 text-xl sm:text-2xl text-white mr-3 flex-shrink-0">
                      {currentExerciseData.speakerEmotion}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">{currentExerciseData.speaker}</div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {isListening ? 'Reproduzindo áudio...' : 'Clique para ouvir a mensagem'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center sm:justify-end">
                    <button
                      onClick={simulateAudioPlay}
                      disabled={isListening}
                      className={`rounded-full p-2 sm:p-3 transition-all min-h-[44px] min-w-[44px] touch-manipulation ${
                        isListening 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white'
                      }`}
                      title="Reproduzir áudio"
                    >
                      {isListening ? '🔊' : '▶️'}
                    </button>
                    {isListening && (
                      <button
                        onClick={stopAudio}
                        className="rounded-full p-2 sm:p-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white transition-all min-h-[44px] min-w-[44px] touch-manipulation"
                        title="Parar áudio"
                      >
                        ⏹️
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="rounded-lg bg-white p-3 sm:p-4 border border-gray-200">
                  <div className="text-gray-600 text-xs sm:text-sm mb-2">Mensagem de {currentExerciseData.speaker}:</div>
                  <div className="text-gray-800 font-medium text-sm sm:text-base">"{currentExerciseData.message}"</div>
                  <div className="text-gray-500 text-xs mt-2">
                    💡 Contexto: {currentExerciseData.audioDescription}
                  </div>
                </div>
                
                {isListening && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-teal-100 text-teal-800 rounded-lg text-sm">
                      <div className="animate-pulse mr-2">🎧</div>
                      Reproduzindo áudio... (Escute com atenção!)
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h4 className="mb-4 text-base sm:text-lg font-semibold text-gray-900">
                  Pergunta {currentQuestion + 1}: {currentQuestionData.question}
                </h4>

                <div className="space-y-3">
                  {currentQuestionData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full rounded-xl p-3 sm:p-4 text-left transition-all min-h-[48px] touch-manipulation ${
                        selectedAnswer === null
                          ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-lg active:bg-gray-200'
                          : selectedAnswer === index
                          ? index === currentQuestionData.correct
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : 'bg-red-100 text-red-800 border-2 border-red-300'
                          : index === currentQuestionData.correct
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              {showResult && (
                <div className={`mb-4 rounded-xl p-4 ${
                  selectedAnswer === currentQuestionData.correct
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedAnswer === currentQuestionData.correct ? (
                    <div className="flex items-center">
                      <span className="mr-2 text-xl sm:text-2xl">✅</span>
                      <span className="text-base sm:text-lg font-semibold">Excelente escuta! +10 pontos</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2 text-xl sm:text-2xl">👂</span>
                      <span className="text-base sm:text-lg font-semibold">Boa tentativa! Vamos aprimorar a escuta.</span>
                    </div>
                  )}
                </div>
              )}

              {showExplanation && (
                <div className="mb-6 rounded-xl bg-blue-50 p-4 sm:p-6">
                  <h4 className="mb-2 text-sm sm:text-base font-semibold text-blue-900">💡 Dica de Escuta:</h4>
                  <p className="text-sm sm:text-base text-blue-800">{currentQuestionData.explanation}</p>
                </div>
              )}

              {showExplanation && (
                <div className="text-center">
                  <button
                    onClick={nextQuestion}
                    className="rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:from-teal-600 hover:to-blue-700 hover:shadow-lg min-h-[48px] touch-manipulation"
                  >
                    {currentQuestion < (currentExerciseData?.questions.length || 0) - 1 
                      ? 'Próxima Pergunta'
                      : currentExercise < (currentLevelData?.exercises.length || 0) - 1
                      ? 'Próximo Exercício'
                      : score >= (currentLevelData?.pointsRequired || 0)
                      ? currentLevel < levels.length ? 'Próximo Nível' : 'Finalizar'
                      : 'Tentar Nível Novamente'
                    }
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center text-xs sm:text-sm text-gray-500">
            Exercício {currentExercise + 1} • Pergunta {currentQuestion + 1} • Nível {currentLevel} de {levels.length}
          </div>
        </div>
      </div>
    </div>
  )
}