'use client'

import { useState } from 'react'

interface CareScenario {
  id: number
  title: string
  description: string
  situation: string
  character: string
  characterEmotion: string
  environment: string
  questions: {
    id: number
    question: string
    options: string[]
    correct: number
    explanation: string
    careType: string
  }[]
  skillFocus: string
}

interface Level {
  id: number
  name: string
  description: string
  scenarios: CareScenario[]
  pointsRequired: number
}

export default function CareMission() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentScenario, setCurrentScenario] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const [missionPoints, setMissionPoints] = useState(0)

  const levels: Level[] = [
    {
      id: 1,
      name: "Cuidado Básico",
      description: "Identificar necessidades básicas e oferecer ajuda simples",
      pointsRequired: 50,
      scenarios: [
        {
          id: 1,
          title: "Colega Machucado",
          description: "Identificar quando alguém se machuca e precisa de ajuda",
          situation: "Durante o recreio, você vê seu colega tropeçar e cair no pátio. Ele está no chão segurando o joelho.",
          character: "Lucas",
          characterEmotion: "😣",
          environment: "Pátio da escola durante o recreio",
          skillFocus: "Reconhecimento de dor física",
          questions: [
            {
              id: 1,
              question: "O que você deve fazer primeiro?",
              options: [
                "Ignorar e continuar brincando",
                "Se aproximar e perguntar se ele está bem",
                "Rir da situação",
                "Chamar outros para ver"
              ],
              correct: 1,
              explanation: "A primeira ação deve ser verificar se a pessoa está bem e oferecer ajuda.",
              careType: "Cuidado imediato"
            },
            {
              id: 2,
              question: "Como você pode ajudar Lucas?",
              options: [
                "Ajudá-lo a se levantar e chamar um adulto se necessário",
                "Dizer para ele parar de reclamar",
                "Continuar sua atividade",
                "Contar para todos o que aconteceu"
              ],
              correct: 0,
              explanation: "Ajudar a pessoa machucada e buscar auxílio adulto quando necessário demonstra cuidado.",
              careType: "Assistência prática"
            }
          ]
        },
        {
          id: 2,
          title: "Material Esquecido",
          description: "Reconhecer quando alguém esqueceu algo importante",
          situation: "Na aula de matemática, você percebe que Maria está mexendo nervosamente na mochila e parece preocupada.",
          character: "Maria",
          characterEmotion: "😰",
          environment: "Sala de aula durante a aula",
          skillFocus: "Percepção de necessidades escolares",
          questions: [
            {
              id: 1,
              question: "O que Maria provavelmente esqueceu?",
              options: [
                "O lanche",
                "Material escolar (lápis, borracha, caderno)",
                "A agenda",
                "A carteira"
              ],
              correct: 1,
              explanation: "Gestos nervosos com a mochila durante a aula indicam falta de material escolar.",
              careType: "Percepção de necessidades"
            },
            {
              id: 2,
              question: "Como você pode ajudar Maria?",
              options: [
                "Oferecer emprestar seu material extra",
                "Avisar ao professor que ela esqueceu algo",
                "Ignorar a situação",
                "Fazer piada sobre o esquecimento"
              ],
              correct: 0,
              explanation: "Emprestar material demonstra generosidade e cuidado com os colegas.",
              careType: "Compartilhamento"
            }
          ]
        },
        {
          id: 3,
          title: "Criança Perdida",
          description: "Ajudar alguém que está perdido ou confuso",
          situation: "No shopping, você vê uma criança pequena chorando e chamando pela mãe. Ela parece perdida.",
          character: "Criança pequena",
          characterEmotion: "😭",
          environment: "Shopping center",
          skillFocus: "Reconhecimento de desamparo",
          questions: [
            {
              id: 1,
              question: "Qual é a melhor forma de ajudar?",
              options: [
                "Levar a criança para procurar a mãe sozinho",
                "Chamar um adulto responsável (segurança, funcionário)",
                "Dar doces para ela parar de chorar",
                "Ignorar porque não é seu problema"
              ],
              correct: 1,
              explanation: "Sempre envolver adultos responsáveis em situações com crianças perdidas é o mais seguro.",
              careType: "Segurança e proteção"
            },
            {
              id: 2,
              question: "Enquanto espera ajuda, o que fazer?",
              options: [
                "Ficar perto para tranquilizar, mas sem tocar",
                "Sair do local",
                "Gritar para chamar atenção",
                "Pegar a criança no colo"
              ],
              correct: 0,
              explanation: "Oferecer presença tranquilizadora mantendo limites apropriados é o ideal.",
              careType: "Conforto emocional"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Cuidado Emocional",
      description: "Reconhecer e responder a necessidades emocionais dos outros",
      pointsRequired: 60,
      scenarios: [
        {
          id: 4,
          title: "Amigo Triste",
          description: "Identificar tristeza e oferecer suporte emocional",
          situation: "Seu amigo Pedro chegou na escola cabisbaixo e não quer conversar. Ele normalmente é alegre e falante.",
          character: "Pedro",
          characterEmotion: "😔",
          environment: "Entrada da escola pela manhã",
          skillFocus: "Detecção de mudanças emocionais",
          questions: [
            {
              id: 1,
              question: "Como você deve abordar Pedro?",
              options: [
                "Forçar ele a contar o que aconteceu",
                "Se aproximar gentilmente e perguntar se quer conversar",
                "Fazer piadas para ele rir",
                "Deixar ele completamente sozinho"
              ],
              correct: 1,
              explanation: "Abordagem gentil e respeitosa permite que a pessoa escolha se quer compartilhar.",
              careType: "Suporte emocional"
            },
            {
              id: 2,
              question: "Se Pedro disser que está triste, o que fazer?",
              options: [
                "Escutar com atenção e validar seus sentimentos",
                "Dizer que não é nada demais",
                "Mudar de assunto rapidamente",
                "Contar seus próprios problemas"
              ],
              correct: 0,
              explanation: "Escuta ativa e validação são fundamentais para o apoio emocional.",
              careType: "Escuta ativa"
            }
          ]
        },
        {
          id: 5,
          title: "Colega Excluído",
          description: "Perceber exclusão social e promover inclusão",
          situation: "Durante o intervalo, você nota que Sofia está sentada sozinha enquanto todos brincam em grupos. Ela olha tristemente para os outros.",
          character: "Sofia",
          characterEmotion: "😞",
          environment: "Pátio escolar durante o recreio",
          skillFocus: "Identificação de exclusão social",
          questions: [
            {
              id: 1,
              question: "O que a postura de Sofia indica?",
              options: [
                "Ela prefere ficar sozinha",
                "Ela se sente excluída e gostaria de participar",
                "Ela está cansada",
                "Ela está brava com todos"
              ],
              correct: 1,
              explanation: "Olhar tristemente para outros brincando indica desejo de inclusão.",
              careType: "Percepção social"
            },
            {
              id: 2,
              question: "Como incluir Sofia de forma cuidadosa?",
              options: [
                "Convidá-la para se juntar ao seu grupo de brincadeira",
                "Ignorar porque ela pode não querer",
                "Contar para o professor sobre ela",
                "Apenas acenar de longe"
              ],
              correct: 0,
              explanation: "Convite direto e caloroso promove inclusão e demonstra cuidado social.",
              careType: "Inclusão social"
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Cuidado Avançado",
      description: "Situações complexas que exigem empatia e ação cuidadosa",
      pointsRequired: 70,
      scenarios: [
        {
          id: 6,
          title: "Conflito Entre Amigos",
          description: "Mediar conflitos e promover reconciliação",
          situation: "Seus amigos Ana e João estão brigados há dias. Ana está chorando porque João não quer mais falar com ela após uma discussão.",
          character: "Ana e João",
          characterEmotion: "😢😠",
          environment: "Escola durante o intervalo",
          skillFocus: "Mediação de conflitos",
          questions: [
            {
              id: 1,
              question: "Como você pode ajudar na situação?",
              options: [
                "Escolher um lado e apoiar apenas um deles",
                "Escutar ambos separadamente e tentar entender os dois lados",
                "Dizer que a briga é bobagem",
                "Espalhar a fofoca para outros"
              ],
              correct: 1,
              explanation: "Mediação imparcial requer escutar ambas as partes com empatia.",
              careType: "Mediação empática"
            },
            {
              id: 2,
              question: "Qual seria o próximo passo?",
              options: [
                "Sugerir gentilmente que conversem para resolver",
                "Forçar eles a se falarem imediatamente",
                "Contar para um adulto sem perguntar",
                "Deixar que resolvam sozinhos"
              ],
              correct: 0,
              explanation: "Facilitar comunicação respeitosa ajuda na resolução de conflitos.",
              careType: "Facilitação de diálogo"
            }
          ]
        },
        {
          id: 7,
          title: "Pessoa com Dificuldades",
          description: "Ajudar alguém com limitações ou dificuldades especiais",
          situation: "Na escola, há um novo aluno, Miguel, que usa muletas. Você vê que ele está tendo dificuldade para carregar seus livros até a sala.",
          character: "Miguel",
          characterEmotion: "😓",
          environment: "Corredor da escola",
          skillFocus: "Assistência respeitosa",
          questions: [
            {
              id: 1,
              question: "Como oferecer ajuda de forma respeitosa?",
              options: [
                "Pegar os livros sem perguntar",
                "Perguntar se ele gostaria de ajuda",
                "Fingir que não viu",
                "Chamar outros para ajudar sem avisar"
              ],
              correct: 1,
              explanation: "Sempre perguntar antes de ajudar respeita a autonomia da pessoa.",
              careType: "Assistência respeitosa"
            },
            {
              id: 2,
              question: "Se Miguel aceitar ajuda, o que fazer?",
              options: [
                "Carregar os livros e conversar naturalmente",
                "Fazer muitas perguntas sobre as muletas",
                "Tratá-lo como se fosse incapaz",
                "Ajudar e sair rapidamente"
              ],
              correct: 0,
              explanation: "Ajudar naturalmente e tratar com normalidade demonstra verdadeiro cuidado.",
              careType: "Inclusão natural"
            }
          ]
        }
      ]
    }
  ]

  const currentLevelData = levels.find(level => level.id === currentLevel)
  const currentScenarioData = currentLevelData?.scenarios[currentScenario]
  const currentQuestionData = currentScenarioData?.questions[currentQuestion]

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === currentQuestionData?.correct) {
      const points = 10
      setScore(score + points)
      setTotalScore(totalScore + points)
      setMissionPoints(missionPoints + 5) // Pontos extras de missão
    }

    setTimeout(() => {
      setShowExplanation(true)
    }, 1500)
  }

  const nextQuestion = () => {
    if (!currentScenarioData || !currentQuestionData) return

    if (currentQuestion < currentScenarioData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setShowExplanation(false)
    } else {
      if (currentScenario < (currentLevelData?.scenarios.length || 0) - 1) {
        setCurrentScenario(currentScenario + 1)
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setShowExplanation(false)
      } else {
        if (score >= (currentLevelData?.pointsRequired || 0)) {
          setCompletedLevels([...completedLevels, currentLevel])
          
          if (currentLevel < levels.length) {
            setCurrentLevel(currentLevel + 1)
            setCurrentScenario(0)
            setCurrentQuestion(0)
            setScore(0)
            setSelectedAnswer(null)
            setShowResult(false)
            setShowExplanation(false)
          } else {
            setGameCompleted(true)
          }
        } else {
          setCurrentScenario(0)
          setCurrentQuestion(0)
          setScore(0)
          setSelectedAnswer(null)
          setShowResult(false)
          setShowExplanation(false)
        }
      }
    }
  }

  const resetGame = () => {
    setCurrentLevel(1)
    setCurrentScenario(0)
    setCurrentQuestion(0)
    setScore(0)
    setTotalScore(0)
    setMissionPoints(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setCompletedLevels([])
    setGameCompleted(false)
  }

  if (gameCompleted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)',
        paddingTop: '80px'
      }}>
        {/* Header Fixo - Voltar para TEA */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 20px',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <button
              onClick={() => window.location.href = '/tea'}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '8px'
              }}
            >
              <span style={{ fontSize: '18px' }}>←</span>
              Voltar para TEA
            </button>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(90deg, #ec4899, #be185d)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>
              🤗
            </div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #be185d, #9d174d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Missão Cumprida!
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'clamp(16px, 4vw, 20px)' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: 'clamp(24px, 6vw, 48px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                width: 'clamp(80px, 15vw, 96px)',
                height: 'clamp(80px, 15vw, 96px)',
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(32px, 8vw, 48px)',
                margin: '0 auto 24px'
              }}>
                🏆
              </div>
              <h1 style={{ 
                fontSize: 'clamp(2rem, 6vw, 2.5rem)', 
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 16px 0'
              }}>
                Missão Cumprida!
              </h1>
              <p style={{ 
                fontSize: 'clamp(1.125rem, 4vw, 1.25rem)', 
                color: '#6b7280',
                margin: 0
              }}>
                Você demonstrou verdadeiro cuidado e empatia!
              </p>
            </div>

            <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>Pontuação Final</h3>
                <p style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 'bold', color: '#ec4899', margin: 0 }}>{totalScore} pontos</p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #fce7f3, #f3e8ff)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>Pontos de Missão</h3>
                <p style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 'bold', color: '#be185d', margin: 0 }}>{missionPoints} pts cuidado</p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>Níveis Completados</h3>
                <p style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 'bold', color: '#9333ea', margin: 0 }}>{completedLevels.length}/3</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                onClick={resetGame}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ec4899, #be185d)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: 'clamp(14px, 3vw, 16px) clamp(24px, 6vw, 32px)',
                  fontSize: 'clamp(16px, 4vw, 18px)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                🔄 Nova Missão
              </button>
              <button
                onClick={() => window.location.href = '/tea'}
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '2px solid #d1d5db',
                  borderRadius: '16px',
                  padding: 'clamp(14px, 3vw, 16px) clamp(24px, 6vw, 32px)',
                  fontSize: 'clamp(16px, 4vw, 18px)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#9ca3af'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                ← Voltar ao TEA
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)',
      paddingTop: '80px'
    }}>
      {/* Header Fixo - Voltar para TEA */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 20px',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <button
            onClick={() => window.location.href = '/tea'}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '8px'
            }}
          >
            <span style={{ fontSize: '18px' }}>←</span>
            Voltar para TEA
          </button>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(90deg, #ec4899, #be185d)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>
            🤗
          </div>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #be185d, #9d174d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Missão Cuidado
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px)' }}>
        {/* Header Principal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: 'clamp(24px, 6vw, 32px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          marginBottom: 'clamp(24px, 6vw, 32px)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <div>
              <h1 style={{ 
                fontSize: 'clamp(1.5rem, 5vw, 3rem)', 
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                🤗 Missão Cuidado
              </h1>
              <p style={{ 
                fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                color: '#6b7280',
                margin: 0
              }}>
                Desenvolva empatia e aprenda a cuidar dos outros em diferentes situações
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Pontuação Total</div>
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#ec4899' }}>{totalScore} pts</div>
              <div style={{ fontSize: '14px', color: '#be185d' }}>{missionPoints} pts missão</div>
            </div>
          </div>
        </div>

        {/* Cards de Informação */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', 
          gap: 'clamp(16px, 4vw, 24px)',
          marginBottom: 'clamp(24px, 6vw, 32px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: 'clamp(20px, 5vw, 24px)',
            borderLeft: '4px solid #ef4444',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginRight: '8px' }}>🎯</span>
              <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', color: '#dc2626', margin: 0 }}>Objetivo:</h3>
            </div>
            <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#374151', margin: 0, lineHeight: '1.5' }}>
              Aprender a reconhecer quando outros precisam de ajuda e desenvolver formas empáticas de cuidar
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: 'clamp(20px, 5vw, 24px)',
            borderLeft: '4px solid #ec4899',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginRight: '8px' }}>👑</span>
              <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', color: '#be185d', margin: 0 }}>Pontuação:</h3>
            </div>
            <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#374151', margin: 0, lineHeight: '1.5' }}>
              Cada ato de cuidado = +10 pontos + 5 pontos de missão especiais por demonstrar empatia
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: 'clamp(20px, 5vw, 24px)',
            borderLeft: '4px solid #9333ea',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginRight: '8px' }}>📊</span>
              <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', color: '#7c3aed', margin: 0 }}>Níveis:</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ 
                fontSize: 'clamp(14px, 3vw, 16px)', 
                color: completedLevels.includes(1) ? '#059669' : '#374151',
                fontWeight: completedLevels.includes(1) ? '600' : 'normal'
              }}>
                <span style={{ fontWeight: '600', color: '#7c3aed' }}>Nível 1:</span> Cuidado básico
              </div>
              <div style={{ 
                fontSize: 'clamp(14px, 3vw, 16px)', 
                color: completedLevels.includes(2) ? '#059669' : '#374151',
                fontWeight: completedLevels.includes(2) ? '600' : 'normal'
              }}>
                <span style={{ fontWeight: '600', color: '#7c3aed' }}>Nível 2:</span> Cuidado emocional
              </div>
              <div style={{ 
                fontSize: 'clamp(14px, 3vw, 16px)', 
                color: completedLevels.includes(3) ? '#059669' : '#374151',
                fontWeight: completedLevels.includes(3) ? '600' : 'normal'
              }}>
                <span style={{ fontWeight: '600', color: '#7c3aed' }}>Nível 3:</span> Cuidado avançado
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: 'clamp(20px, 5vw, 24px)',
            borderLeft: '4px solid #e11d48',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginRight: '8px' }}>💖</span>
              <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', color: '#be123c', margin: 0 }}>Missão:</h3>
            </div>
            <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#374151', margin: 0, lineHeight: '1.5' }}>
              Cenários reais de cuidado e empatia para desenvolver habilidades sociais e emocionais
            </p>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: 'clamp(24px, 6vw, 32px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ marginBottom: 'clamp(24px, 6vw, 32px)' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: 'clamp(1.25rem, 4vw, 2rem)', 
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 8px 0'
                }}>
                  Nível {currentLevel}: {currentLevelData?.name}
                </h2>
                <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#6b7280', margin: 0 }}>{currentLevelData?.description}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Pontos do Nível</div>
                <div style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', fontWeight: 'bold', color: '#ec4899' }}>
                  {score}/{currentLevelData?.pointsRequired}
                </div>
              </div>
            </div>
            
            <div style={{
              height: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #ec4899, #be185d)',
                borderRadius: '6px',
                width: `${Math.min((score / (currentLevelData?.pointsRequired || 1)) * 100, 100)}%`,
                transition: 'width 0.5s ease'
              }}></div>
            </div>
          </div>

          {currentScenarioData && currentQuestionData && (
            <div style={{ marginBottom: 'clamp(24px, 6vw, 32px)' }}>
              <div style={{
                background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
                borderRadius: '16px',
                padding: 'clamp(20px, 5vw, 24px)',
                marginBottom: '24px'
              }}>
                <h3 style={{ 
                  fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 8px 0'
                }}>{currentScenarioData.title}</h3>
                <p style={{ 
                  fontSize: 'clamp(14px, 3vw, 16px)', 
                  color: '#374151',
                  margin: '0 0 16px 0'
                }}>{currentScenarioData.description}</p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ec4899'
                }}>
                  Foco: {currentScenarioData.skillFocus}
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: 'clamp(20px, 5vw, 24px)',
                marginBottom: '24px'
              }}>
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                  <div style={{
                    width: 'clamp(64px, 12vw, 80px)',
                    height: 'clamp(64px, 12vw, 80px)',
                    background: 'linear-gradient(135deg, #fce7f3, #f3e8ff)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(32px, 8vw, 48px)',
                    margin: '0 auto 16px'
                  }}>
                    {currentScenarioData.characterEmotion}
                  </div>
                  <h4 style={{ 
                    fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 8px 0'
                  }}>{currentScenarioData.character}</h4>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>📍 {currentScenarioData.environment}</div>
                </div>
                
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: 'clamp(20px, 5vw, 24px)',
                  border: '1px solid #e5e7eb'
                }}>
                  <h5 style={{ 
                    fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 12px 0'
                  }}>🎬 Situação:</h5>
                  <p style={{ 
                    fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                    color: '#374151',
                    margin: 0,
                    lineHeight: '1.6'
                  }}>{currentScenarioData.situation}</p>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 16px 0'
                }}>
                  Missão {currentQuestion + 1}: {currentQuestionData.question}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentQuestionData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      style={{
                        width: '100%',
                        borderRadius: '16px',
                        padding: 'clamp(16px, 4vw, 20px)',
                        textAlign: 'left',
                        border: 'none',
                        cursor: selectedAnswer === null ? 'pointer' : 'default',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        lineHeight: '1.5',
                        transition: 'all 0.2s',
                        backgroundColor: selectedAnswer === null
                          ? '#f9fafb'
                          : selectedAnswer === index
                          ? index === currentQuestionData.correct
                            ? '#dcfce7'
                            : '#fee2e2'
                          : index === currentQuestionData.correct
                          ? '#dcfce7'
                          : '#f3f4f6',
                        color: selectedAnswer === null
                          ? '#374151'
                          : selectedAnswer === index
                          ? index === currentQuestionData.correct
                            ? '#166534'
                            : '#991b1b'
                          : index === currentQuestionData.correct
                          ? '#166534'
                          : '#6b7280',
                        border: selectedAnswer !== null && (selectedAnswer === index || index === currentQuestionData.correct)
                          ? `2px solid ${index === currentQuestionData.correct ? '#16a34a' : '#dc2626'}`
                          : '2px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedAnswer === null) {
                          e.currentTarget.style.backgroundColor = '#f3f4f6'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedAnswer === null) {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {showResult && (
                <div style={{
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '16px',
                  backgroundColor: selectedAnswer === currentQuestionData.correct ? '#dcfce7' : '#fee2e2',
                  color: selectedAnswer === currentQuestionData.correct ? '#166534' : '#991b1b'
                }}>
                  {selectedAnswer === currentQuestionData.correct ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginRight: '8px' }}>💖</span>
                      <span style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600' }}>
                        Excelente cuidado! +10 pontos + 5 missão
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginRight: '8px' }}>🤗</span>
                      <span style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600' }}>
                        Continue desenvolvendo sua empatia!
                      </span>
                    </div>
                  )}
                </div>
              )}

              {showExplanation && (
                <div style={{
                  backgroundColor: '#eff6ff',
                  borderRadius: '16px',
                  padding: 'clamp(20px, 5vw, 24px)',
                  marginBottom: '24px'
                }}>
                  <h4 style={{ 
                    fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                    fontWeight: '600',
                    color: '#1e40af',
                    margin: '0 0 8px 0'
                  }}>💡 Lição de Cuidado:</h4>
                  <p style={{ 
                    fontSize: 'clamp(14px, 3vw, 16px)', 
                    color: '#1e40af',
                    margin: '0 0 12px 0',
                    lineHeight: '1.6'
                  }}>{currentQuestionData.explanation}</p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#dbeafe',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1e40af'
                  }}>
                    Tipo: {currentQuestionData.careType}
                  </div>
                </div>
              )}

              {showExplanation && (
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={nextQuestion}
                    style={{
                      background: 'linear-gradient(135deg, #ec4899, #be185d)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      padding: 'clamp(14px, 3vw, 16px) clamp(24px, 6vw, 32px)',
                      fontSize: 'clamp(16px, 4vw, 18px)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {currentQuestion < (currentScenarioData?.questions.length || 0) - 1 
                      ? 'Próxima Missão'
                      : currentScenario < (currentLevelData?.scenarios.length || 0) - 1
                      ? 'Novo Cenário'
                      : score >= (currentLevelData?.pointsRequired || 0)
                      ? currentLevel < levels.length ? 'Próximo Nível' : 'Finalizar Missões'
                      : 'Tentar Nível Novamente'
                    }
                  </button>
                </div>
              )}
            </div>
          )}

          <div style={{ 
            textAlign: 'center', 
            fontSize: 'clamp(12px, 2.5vw, 14px)', 
            color: '#6b7280',
            marginTop: '32px'
          }}>
            Cenário {currentScenario + 1} • Missão {currentQuestion + 1} • Nível {currentLevel} de {levels.length}
          </div>
        </div>
      </div>
    </div>
  )
}