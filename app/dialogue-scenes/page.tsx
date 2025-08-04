'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DialogueOption {
  id: number
  text: string
  isCorrect: boolean
  feedback: string
}

interface Scene {
  id: number
  title: string
  context: string
  character: string
  characterEmotion: string
  characterLine: string
  options: DialogueOption[]
  explanation: string
  socialSkill: string
}

interface Level {
  id: number
  name: string
  description: string
  scenes: Scene[]
  pointsRequired: number
}

export default function DialogueScenes() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentScene, setCurrentScene] = useState(0)
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
      name: "Conversas Básicas",
      description: "Aprender a responder perguntas simples e manter diálogos curtos",
      pointsRequired: 30,
      scenes: [
        {
          id: 1,
          title: "Apresentação Pessoal",
          context: "Você está conhecendo um novo colega na escola",
          character: "Alex",
          characterEmotion: "😊",
          characterLine: "Oi! Eu sou o Alex. Qual é o seu nome?",
          socialSkill: "Apresentação",
          options: [
            {
              id: 1,
              text: "Oi Alex! Eu sou [seu nome]. Prazer em te conhecer!",
              isCorrect: true,
              feedback: "Perfeito! Você se apresentou de forma educada e amigável."
            },
            {
              id: 2,
              text: "[Não responder e sair andando]",
              isCorrect: false,
              feedback: "É importante responder quando alguém se apresenta. Isso mostra educação e interesse."
            },
            {
              id: 3,
              text: "Por que você quer saber?",
              isCorrect: false,
              feedback: "Essa resposta pode soar rude. Em apresentações, é melhor ser acolhedor."
            }
          ],
          explanation: "Quando alguém se apresenta, a resposta educada inclui: dizer seu nome, cumprimentar e demonstrar interesse na conversa."
        },
        {
          id: 2,
          title: "Falando sobre Hobbies",
          context: "Um amigo quer saber sobre seus interesses",
          character: "Maria",
          characterEmotion: "🤔",
          characterLine: "O que você gosta de fazer no seu tempo livre?",
          socialSkill: "Compartilhamento",
          options: [
            {
              id: 1,
              text: "Eu gosto de ler livros e jogar videogame. E você?",
              isCorrect: true,
              feedback: "Excelente! Você compartilhou seus interesses e retribuiu a pergunta."
            },
            {
              id: 2,
              text: "Nada interessante.",
              isCorrect: false,
              feedback: "Essa resposta encerra a conversa. Tente compartilhar algo que você gosta."
            },
            {
              id: 3,
              text: "Muita coisa, tenho 50 hobbies diferentes...",
              isCorrect: false,
              feedback: "Muito específico pode confundir. É melhor mencionar 1-2 atividades principais."
            }
          ],
          explanation: "Compartilhar hobbies ajuda a criar conexões. Mencione 1-2 atividades e faça uma pergunta de volta."
        },
        {
          id: 3,
          title: "Pedindo Ajuda",
          context: "Você precisa de ajuda com uma tarefa escolar",
          character: "Professor João",
          characterEmotion: "📚",
          characterLine: "Posso te ajudar com alguma coisa?",
          socialSkill: "Comunicação de necessidades",
          options: [
            {
              id: 1,
              text: "Sim, por favor! Estou com dificuldade neste exercício.",
              isCorrect: true,
              feedback: "Ótimo! Você pediu ajuda de forma clara e educada."
            },
            {
              id: 2,
              text: "Não, estou bem.",
              isCorrect: false,
              feedback: "Se você precisa de ajuda, é importante aceitar. Isso mostra maturidade."
            },
            {
              id: 3,
              text: "Esse exercício é muito difícil e chato!",
              isCorrect: false,
              feedback: "Evite reclamar. Foque em explicar especificamente onde você precisa de ajuda."
            }
          ],
          explanation: "Pedir ajuda é uma habilidade importante. Seja específico sobre sua dificuldade e sempre agradeça."
        }
      ]
    },
    {
      id: 2,
      name: "Conversas Intermediárias",
      description: "Desenvolver habilidades de manter conversas mais longas e complexas",
      pointsRequired: 40,
      scenes: [
        {
          id: 4,
          title: "Resolvendo Conflitos",
          context: "Um amigo está chateado porque você esqueceu de um compromisso",
          character: "Lucas",
          characterEmotion: "😔",
          characterLine: "Você esqueceu do nosso encontro ontem. Eu fiquei esperando...",
          socialSkill: "Resolução de conflitos",
          options: [
            {
              id: 1,
              text: "Desculpa, Lucas! Eu realmente esqueci. Como posso compensar?",
              isCorrect: true,
              feedback: "Perfeito! Você reconheceu o erro e ofereceu uma solução."
            },
            {
              id: 2,
              text: "Ah, foi mal. Acontece.",
              isCorrect: false,
              feedback: "Muito casual para a situação. É importante mostrar que você se importa."
            },
            {
              id: 3,
              text: "Você devia ter me lembrado!",
              isCorrect: false,
              feedback: "Culpar o outro não resolve o problema. Assuma a responsabilidade."
            }
          ],
          explanation: "Para resolver conflitos: reconheça o erro, peça desculpas sinceramente e ofereça uma forma de compensar."
        },
        {
          id: 5,
          title: "Expressando Opinião",
          context: "Amigos estão decidindo qual filme assistir",
          character: "Ana",
          characterEmotion: "🎬",
          characterLine: "Que tipo de filme vocês querem assistir?",
          socialSkill: "Assertividade",
          options: [
            {
              id: 1,
              text: "Eu prefiro comédia, mas estou aberto a outras sugestões.",
              isCorrect: true,
              feedback: "Excelente! Você expressou sua preferência mas mostrou flexibilidade."
            },
            {
              id: 2,
              text: "Tanto faz.",
              isCorrect: false,
              feedback: "Participar da decisão é importante. Compartilhe sua opinião."
            },
            {
              id: 3,
              text: "Só assisto comédia. Outros gêneros são chatos.",
              isCorrect: false,
              feedback: "Ser muito rígido pode excluir você de atividades. Seja mais flexível."
            }
          ],
          explanation: "Expressar opinião de forma assertiva: compartilhe sua preferência, mas mostre disposição para negociar."
        },
        {
          id: 6,
          title: "Consolando um Amigo",
          context: "Sua amiga está triste porque não foi bem em uma prova",
          character: "Sofia",
          characterEmotion: "😢",
          characterLine: "Tirei nota baixa na prova de matemática. Estou muito triste...",
          socialSkill: "Empatia",
          options: [
            {
              id: 1,
              text: "Que pena, Sofia. Matemática é difícil mesmo. Quer conversar sobre isso?",
              isCorrect: true,
              feedback: "Muito bem! Você demonstrou empatia e ofereceu apoio."
            },
            {
              id: 2,
              text: "Eu sempre vou bem em matemática. É fácil!",
              isCorrect: false,
              feedback: "Isso pode fazer a pessoa se sentir pior. Foque em apoiar, não em se comparar."
            },
            {
              id: 3,
              text: "Pelo menos não foi zero!",
              isCorrect: false,
              feedback: "Minimizar os sentimentos dos outros não ajuda. Seja mais empático."
            }
          ],
          explanation: "Para consolar alguém: reconheça os sentimentos, demonstre empatia e ofereça apoio."
        }
      ]
    },
    {
      id: 3,
      name: "Conversas Avançadas",
      description: "Dominar situações sociais complexas e comunicação profunda",
      pointsRequired: 50,
      scenes: [
        {
          id: 7,
          title: "Negociação em Grupo",
          context: "Você e seus amigos precisam decidir onde comemorar um aniversário",
          character: "Grupo",
          characterEmotion: "🎉",
          characterLine: "Pessoal, precisamos decidir onde fazer a festa. Alguém tem sugestões?",
          socialSkill: "Liderança colaborativa",
          options: [
            {
              id: 1,
              text: "Que tal fazermos uma lista de opções e votarmos? Posso começar sugerindo o parque.",
              isCorrect: true,
              feedback: "Excelente! Você propôs um processo justo e deu uma sugestão construtiva."
            },
            {
              id: 2,
              text: "Tanto faz, decidam vocês.",
              isCorrect: false,
              feedback: "Participar das decisões em grupo é importante. Contribua com ideias."
            },
            {
              id: 3,
              text: "Vamos fazer no shopping, já decidi.",
              isCorrect: false,
              feedback: "Decisões unilaterais podem excluir outros. Seja mais colaborativo."
            }
          ],
          explanation: "Em negociações de grupo: proponha processos justos, contribua com ideias e busque consenso."
        },
        {
          id: 8,
          title: "Conversa Profunda",
          context: "Um amigo está passando por um momento difícil em casa",
          character: "Carlos",
          characterEmotion: "😟",
          characterLine: "Meus pais estão brigando muito ultimamente. Não sei o que fazer...",
          socialSkill: "Apoio emocional",
          options: [
            {
              id: 1,
              text: "Isso deve ser muito difícil para você. Obrigado por confiar em mim. Como posso ajudar?",
              isCorrect: true,
              feedback: "Perfeito! Você validou os sentimentos e ofereceu apoio genuíno."
            },
            {
              id: 2,
              text: "Meus pais também brigam às vezes. É normal.",
              isCorrect: false,
              feedback: "Evite minimizar ou comparar. Foque na experiência da pessoa."
            },
            {
              id: 3,
              text: "Você deveria falar com eles para pararem.",
              isCorrect: false,
              feedback: "Conselhos precipitados podem não ser úteis. Primeiro ouça e apoie."
            }
          ],
          explanation: "Em conversas profundas: valide sentimentos, agradeça a confiança e ofereça apoio antes de dar conselhos."
        }
      ]
    }
  ]

  const currentLevelData = levels.find(level => level.id === currentLevel)
  const currentSceneData = currentLevelData?.scenes[currentScene]

  const handleAnswer = (optionId: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(optionId)
    setShowResult(true)

    const selectedOption = currentSceneData?.options.find(opt => opt.id === optionId)
    if (selectedOption?.isCorrect) {
      const points = 10
      setScore(score + points)
      setTotalScore(totalScore + points)
    }

    setTimeout(() => {
      setShowExplanation(true)
    }, 1500)
  }

  const nextScene = () => {
    if (!currentLevelData) return

    if (currentScene < currentLevelData.scenes.length - 1) {
      setCurrentScene(currentScene + 1)
    } else {
      if (score >= currentLevelData.pointsRequired) {
        setCompletedLevels([...completedLevels, currentLevel])
        
        if (currentLevel < levels.length) {
          setCurrentLevel(currentLevel + 1)
          setCurrentScene(0)
          setScore(0)
        } else {
          setGameCompleted(true)
        }
      } else {
        setCurrentScene(0)
        setScore(0)
      }
    }

    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
  }

  const resetGame = () => {
    setCurrentLevel(1)
    setCurrentScene(0)
    setScore(0)
    setTotalScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setCompletedLevels([])
    setGameCompleted(false)
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header Mobile */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <a 
                href="/tea" 
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors min-h-[44px] px-2 -ml-2"
              >
                <span className="text-xl mr-2">←</span>
                <span className="text-sm sm:text-base font-medium">Voltar para TEA</span>
              </a>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4">
                🎭 Diálogo em Cenas
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
                    Você dominou a arte do diálogo em cenas!
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Mobile */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <a 
              href="/tea" 
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors min-h-[44px] px-2 -ml-2"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-sm sm:text-base font-medium">Voltar para TEA</span>
            </a>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4">
              🎭 Diálogo em Cenas
            </h1>
            <div className="text-right">
              <div className="text-xs sm:text-sm text-gray-500">Pontuação Total</div>
              <div className="text-base sm:text-xl font-bold text-blue-600">{totalScore} pts</div>
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
              Desenvolver habilidades de manter conversas, responder perguntas adequadamente e praticar scripts sociais através de role-play digital interativo
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-lg border-l-4 border-blue-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">👑</span>
              <h3 className="text-base sm:text-lg font-semibold text-blue-600">Pontuação:</h3>
            </div>
            <p className="text-sm text-gray-700">
              Cada resposta adequada = +10 pontos. Complete os níveis progressivos para dominar diferentes tipos de diálogo social
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-lg border-l-4 border-purple-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">📊</span>
              <h3 className="text-base sm:text-lg font-semibold text-purple-600">Níveis:</h3>
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <div className={completedLevels.includes(1) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-purple-600">Nível 1:</span> Conversas básicas
              </div>
              <div className={completedLevels.includes(2) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-purple-600">Nível 2:</span> Conversas intermediárias
              </div>
              <div className={completedLevels.includes(3) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-purple-600">Nível 3:</span> Conversas avançadas
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-lg border-l-4 border-green-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">🏁</span>
              <h3 className="text-base sm:text-lg font-semibold text-green-600">Final:</h3>
            </div>
            <p className="text-sm text-gray-700">
              Complete os 3 níveis para dominar scripts sociais e se tornar confiante em diferentes situações de diálogo
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
                className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                style={{ 
                  width: `${Math.min((score / (currentLevelData?.pointsRequired || 1)) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {currentSceneData && (
            <div className="mb-6">
              <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
                <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">{currentSceneData.title}</h3>
                <p className="mb-4 text-sm sm:text-base text-gray-700">{currentSceneData.context}</p>
                <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs sm:text-sm font-medium text-blue-600">
                  Habilidade: {currentSceneData.socialSkill}
                </div>
              </div>

              <div className="mb-6 flex items-start space-x-3 sm:space-x-4">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-2xl sm:text-3xl text-white flex-shrink-0">
                  {currentSceneData.characterEmotion}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-2 text-sm sm:text-base font-semibold text-gray-900">{currentSceneData.character}:</div>
                  <div className="rounded-xl bg-gray-100 p-3 sm:p-4 text-sm sm:text-base text-gray-800">
                    "{currentSceneData.characterLine}"
                  </div>
                </div>
              </div>

              <h4 className="mb-4 text-base sm:text-lg font-semibold text-gray-900">Como você responderia?</h4>

              <div className="space-y-3 mb-6">
                {currentSceneData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={selectedAnswer !== null}
                    className={`w-full rounded-xl p-3 sm:p-4 text-left transition-all min-h-[48px] touch-manipulation ${
                      selectedAnswer === null
                        ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-lg active:bg-gray-200'
                        : selectedAnswer === option.id
                        ? option.isCorrect
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : 'bg-red-100 text-red-800 border-2 border-red-300'
                        : option.isCorrect && selectedAnswer !== null
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <div className="font-medium text-sm sm:text-base">{option.text}</div>
                    {selectedAnswer === option.id && (
                      <div className="mt-2 text-xs sm:text-sm">{option.feedback}</div>
                    )}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className={`mb-4 rounded-xl p-4 ${
                  currentSceneData.options.find(opt => opt.id === selectedAnswer)?.isCorrect
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentSceneData.options.find(opt => opt.id === selectedAnswer)?.isCorrect ? (
                    <div className="flex items-center">
                      <span className="mr-2 text-xl sm:text-2xl">✅</span>
                      <span className="text-base sm:text-lg font-semibold">Excelente resposta! +10 pontos</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2 text-xl sm:text-2xl">💡</span>
                      <span className="text-base sm:text-lg font-semibold">Boa tentativa! Vamos aprender com isso.</span>
                    </div>
                  )}
                </div>
              )}

              {showExplanation && (
                <div className="mb-6 rounded-xl bg-blue-50 p-4 sm:p-6">
                  <h4 className="mb-2 text-sm sm:text-base font-semibold text-blue-900">💡 Dica Social:</h4>
                  <p className="text-sm sm:text-base text-blue-800">{currentSceneData.explanation}</p>
                </div>
              )}

              {showExplanation && (
                <div className="text-center">
                  <button
                    onClick={nextScene}
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-700 hover:shadow-lg min-h-[48px] touch-manipulation"
                  >
                    {currentScene < (currentLevelData?.scenes.length || 0) - 1 
                      ? 'Próxima Cena' 
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
            Cena {currentScene + 1} de {currentLevelData?.scenes.length} • Nível {currentLevel} de {levels.length}
          </div>
        </div>
      </div>
    </div>
  )
}