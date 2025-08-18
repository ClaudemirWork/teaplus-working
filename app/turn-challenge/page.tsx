'use client'

import { useState, useEffect } from 'react'

interface TeamChallenge {
  id: number
  title: string
  description: string
  scenario: string
  teamMembers: string[]
  task: string
  timeLimit: number
  questions: {
    id: number
    question: string
    options: string[]
    correct: number
    explanation: string
    skillType: string
  }[]
  collaborationFocus: string
}

interface Level {
  id: number
  name: string
  description: string
  challenges: TeamChallenge[]
  pointsRequired: number
}

export default function TurnChallenge() {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const [teamPoints, setTeamPoints] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false)
    }
  }, [timerActive, timeLeft])

  const levels: Level[] = [
    {
      id: 1,
      name: "Revezamento Básico",
      description: "Aprender a esperar a vez e colaborar em atividades simples",
      pointsRequired: 60,
      challenges: [
        {
          id: 1,
          title: "Jogando em Dupla",
          description: "Coordenar turnos em um jogo cooperativo",
          scenario: "Você e seu colega João estão jogando um jogo de cartas onde vocês são uma equipe contra o jogo. Cada jogador deve jogar uma carta por vez.",
          teamMembers: ["Você", "João"],
          task: "Vencer o jogo trabalhando em equipe e respeitando os turnos",
          timeLimit: 60,
          collaborationFocus: "Revezamento básico",
          questions: [
            {
              id: 1,
              question: "Qual é a melhor estratégia para jogar em equipe?",
              options: [
                "Jogar rapidamente sem esperar o colega",
                "Discutir cada jogada antes de agir",
                "Deixar apenas um jogador decidir tudo",
                "Ignorar o que o colega está fazendo"
              ],
              correct: 1,
              explanation: "Comunicação e planejamento conjunto são essenciais para o trabalho em equipe eficaz.",
              skillType: "Comunicação colaborativa"
            },
            {
              id: 2,
              question: "Se João demorar para decidir sua jogada, o que fazer?",
              options: [
                "Pressionar ele para ser mais rápido",
                "Ser paciente e oferecer ajuda se ele quiser",
                "Fazer a jogada por ele",
                "Desistir do jogo"
              ],
              correct: 1,
              explanation: "Paciência e oferecimento de apoio demonstram bom espírito de equipe.",
              skillType: "Paciência colaborativa"
            }
          ]
        },
        {
          id: 2,
          title: "Limpeza da Sala",
          description: "Organizar tarefas de limpeza entre colegas de classe",
          scenario: "A sala precisa ser organizada após um projeto em grupo. Há mesas para arrumar, lixo para recolher e materiais para guardar.",
          teamMembers: ["Você", "Ana", "Carlos", "Maria"],
          task: "Dividir as tarefas para que todos contribuam igualmente",
          timeLimit: 45,
          collaborationFocus: "Divisão de tarefas",
          questions: [
            {
              id: 1,
              question: "Como dividir as tarefas de forma justa?",
              options: [
                "Deixar cada um escolher o que quer fazer",
                "Uma pessoa distribui todas as tarefas",
                "Conversar em grupo e dividir igualmente",
                "Quem terminar primeiro sai"
              ],
              correct: 2,
              explanation: "Discussão em grupo garante divisão justa e consenso de todos os membros.",
              skillType: "Organização colaborativa"
            },
            {
              id: 2,
              question: "Se alguém terminar sua parte primeiro, deve:",
              options: [
                "Sair e deixar os outros terminarem",
                "Perguntar se pode ajudar em outras tarefas",
                "Supervisionar o trabalho dos outros",
                "Fazer apenas sua parte e esperar"
              ],
              correct: 1,
              explanation: "Oferecer ajuda adicional fortalece o espírito de equipe e eficiência.",
              skillType: "Iniciativa colaborativa"
            }
          ]
        },
        {
          id: 3,
          title: "Apresentação em Grupo",
          description: "Coordenar uma apresentação escolar com divisão clara de papéis",
          scenario: "Seu grupo precisa apresentar um trabalho sobre animais. Há 4 pessoas e 4 partes: introdução, mamíferos, aves e conclusão.",
          teamMembers: ["Você", "Pedro", "Julia", "Rafael"],
          task: "Organizar a apresentação para que cada um tenha sua vez de falar",
          timeLimit: 90,
          collaborationFocus: "Coordenação sequencial",
          questions: [
            {
              id: 1,
              question: "Como definir quem fala sobre cada parte?",
              options: [
                "O líder do grupo decide tudo",
                "Cada um escolhe baseado em suas preferências e conhecimentos",
                "Sortear aleatoriamente",
                "Sempre na ordem alfabética"
              ],
              correct: 1,
              explanation: "Considerar preferências e habilidades individuais otimiza o resultado do grupo.",
              skillType: "Alocação de tarefas"
            },
            {
              id: 2,
              question: "Durante a apresentação, enquanto outro colega fala, você deve:",
              options: [
                "Preparar sua própria parte mentalmente",
                "Prestar atenção e estar pronto para apoiar",
                "Conversar baixinho com outros colegas",
                "Mexer no celular discretamente"
              ],
              correct: 1,
              explanation: "Apoio ativo durante as partes dos colegas demonstra verdadeiro trabalho em equipe.",
              skillType: "Suporte ativo"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Coordenação de Equipe",
      description: "Gerenciar projetos colaborativos e mediar decisões em grupo",
      pointsRequired: 80,
      challenges: [
        {
          id: 4,
          title: "Projeto de Ciências",
          description: "Coordenar um experimento científico complexo em equipe",
          scenario: "Seu grupo precisa fazer um experimento sobre plantas. Há várias etapas: pesquisa, compra de materiais, montagem, observação diária e relatório final.",
          teamMembers: ["Você", "Lucas", "Amanda", "Bruno", "Sofia"],
          task: "Coordenar todas as etapas ao longo de 2 semanas",
          timeLimit: 120,
          collaborationFocus: "Gestão de projeto",
          questions: [
            {
              id: 1,
              question: "Como organizar um cronograma para 2 semanas?",
              options: [
                "Fazer tudo na última semana",
                "Dividir as etapas pelos dias e definir responsáveis",
                "Deixar cada um fazer quando puder",
                "Apenas uma pessoa controla o cronograma"
              ],
              correct: 1,
              explanation: "Cronograma estruturado com responsabilidades claras garante execução eficiente.",
              skillType: "Planejamento colaborativo"
            },
            {
              id: 2,
              question: "Se alguém não cumprir sua parte no prazo combinado:",
              options: [
                "Excluir a pessoa do grupo",
                "Fazer a parte dela sem avisar",
                "Conversar para entender o problema e reorganizar",
                "Contar para o professor imediatamente"
              ],
              correct: 2,
              explanation: "Comunicação aberta e flexibilidade são essenciais para resolver conflitos de equipe.",
              skillType: "Resolução de conflitos"
            }
          ]
        },
        {
          id: 5,
          title: "Evento Escolar",
          description: "Organizar uma festa junina da escola com múltiplas equipes",
          scenario: "A escola vai fazer uma festa junina e vocês precisam organizar: decoração, comidas típicas, brincadeiras, música e limpeza.",
          teamMembers: ["Você", "Carla", "Diego", "Fernanda", "Gabriel", "Helena"],
          task: "Coordenar 6 pessoas em 5 atividades diferentes",
          timeLimit: 180,
          collaborationFocus: "Liderança distribuída",
          questions: [
            {
              id: 1,
              question: "Como distribuir 6 pessoas em 5 atividades?",
              options: [
                "Uma pessoa fica sem fazer nada",
                "Uma atividade fica com 2 pessoas e as outras com 1",
                "Todo mundo faz um pouco de tudo",
                "Cancelar uma atividade"
              ],
              correct: 1,
              explanation: "Distribuição desigual pode ser eficiente quando considera complexidade das tarefas.",
              skillType: "Gestão de recursos"
            },
            {
              id: 2,
              question: "Se duas equipes querem o mesmo espaço para trabalhar:",
              options: [
                "A primeira que chegou fica com o espaço",
                "Negociar horários alternativos para compartilhar",
                "O coordenador decide sozinho",
                "Sortear quem usa o espaço"
              ],
              correct: 1,
              explanation: "Negociação e compartilhamento demonstram habilidades avançadas de colaboração.",
              skillType: "Mediação de recursos"
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Liderança Colaborativa",
      description: "Liderar equipes respeitando as contribuições de todos",
      pointsRequired: 100,
      challenges: [
        {
          id: 6,
          title: "Startup Estudantil",
          description: "Liderar um projeto empreendedor com colegas de diferentes habilidades",
          scenario: "Vocês querem criar um aplicativo simples para ajudar estudantes. Há pessoas com diferentes talentos: programação, design, marketing e gestão.",
          teamMembers: ["Você (Líder)", "Alex (Programador)", "Bianca (Designer)", "Carlos (Marketing)", "Diana (Gestão)"],
          task: "Liderar o projeto respeitando as especialidades de cada um",
          timeLimit: 240,
          collaborationFocus: "Liderança inclusiva",
          questions: [
            {
              id: 1,
              question: "Como um líder deve tomar decisões importantes?",
              options: [
                "Decidir sozinho baseado na própria opinião",
                "Consultar a equipe e decidir em conjunto",
                "Sempre seguir a opinião da maioria",
                "Delegar todas as decisões para especialistas"
              ],
              correct: 1,
              explanation: "Liderança colaborativa envolve consulta e decisão compartilhada respeitando expertise.",
              skillType: "Tomada de decisão colaborativa"
            },
            {
              id: 2,
              question: "Se Alex (programador) discorda da abordagem técnica proposta:",
              options: [
                "Insistir na decisão original como líder",
                "Ouvir atentamente e avaliar os argumentos técnicos",
                "Votar democraticamente mesmo sendo questão técnica",
                "Pedir para outra pessoa decidir"
              ],
              correct: 1,
              explanation: "Líderes eficazes respeitam e valorizam a expertise dos membros da equipe.",
              skillType: "Valorização de expertise"
            }
          ]
        },
        {
          id: 7,
          title: "Resolução de Crise",
          description: "Mediar conflitos complexos e manter a equipe unida",
          scenario: "No meio do projeto do aplicativo, Alex e Bianca entram em conflito sobre o design vs funcionalidade. Cada um acha que sua área é mais importante.",
          teamMembers: ["Você (Mediador)", "Alex (Frustrado)", "Bianca (Defensiva)", "Carlos (Neutro)", "Diana (Preocupada)"],
          task: "Resolver o conflito mantendo todos motivados e focados",
          timeLimit: 60,
          collaborationFocus: "Mediação de conflitos",
          questions: [
            {
              id: 1,
              question: "Qual a primeira ação para resolver o conflito?",
              options: [
                "Escolher um lado e apoiar",
                "Organizar uma conversa onde ambos possam se explicar",
                "Ignorar o conflito até passar",
                "Expulsar um dos dois do projeto"
              ],
              correct: 1,
              explanation: "Mediação eficaz começa criando espaço seguro para todas as perspectivas.",
              skillType: "Facilitação de diálogo"
            },
            {
              id: 2,
              question: "Como encontrar uma solução que satisfaça ambos?",
              options: [
                "Compromisso onde cada um cede um pouco",
                "Buscar uma terceira alternativa criativa",
                "Decidir por votação do grupo",
                "Seguir apenas a opinião do mais experiente"
              ],
              correct: 1,
              explanation: "Soluções criativas que transcendem o conflito inicial são ideais na mediação.",
              skillType: "Pensamento criativo colaborativo"
            }
          ]
        }
      ]
    }
  ]

  const currentLevelData = levels.find(level => level.id === currentLevel)
  const currentChallengeData = currentLevelData?.challenges[currentChallenge]
  const currentQuestionData = currentChallengeData?.questions[currentQuestion]

  const startTimer = () => {
    if (currentChallengeData) {
      setTimeLeft(currentChallengeData.timeLimit)
      setTimerActive(true)
    }
  }

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === currentQuestionData?.correct) {
      const points = 15
      setScore(score + points)
      setTotalScore(totalScore + points)
      setTeamPoints(teamPoints + 10) // Pontos extras de colaboração
    }

    setTimeout(() => {
      setShowExplanation(true)
    }, 1500)
  }

  const nextQuestion = () => {
    if (!currentChallengeData || !currentQuestionData) return

    if (currentQuestion < currentChallengeData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setShowExplanation(false)
    } else {
      if (currentChallenge < (currentLevelData?.challenges.length || 0) - 1) {
        setCurrentChallenge(currentChallenge + 1)
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setShowExplanation(false)
        setTimerActive(false)
      } else {
        if (score >= (currentLevelData?.pointsRequired || 0)) {
          setCompletedLevels([...completedLevels, currentLevel])
          
          if (currentLevel < levels.length) {
            setCurrentLevel(currentLevel + 1)
            setCurrentChallenge(0)
            setCurrentQuestion(0)
            setScore(0)
            setSelectedAnswer(null)
            setShowResult(false)
            setShowExplanation(false)
            setTimerActive(false)
          } else {
            setGameCompleted(true)
          }
        } else {
          setCurrentChallenge(0)
          setCurrentQuestion(0)
          setScore(0)
          setSelectedAnswer(null)
          setShowResult(false)
          setShowExplanation(false)
          setTimerActive(false)
        }
      }
    }
  }

  const resetGame = () => {
    setCurrentLevel(1)
    setCurrentChallenge(0)
    setCurrentQuestion(0)
    setScore(0)
    setTotalScore(0)
    setTeamPoints(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setCompletedLevels([])
    setGameCompleted(false)
    setTimerActive(false)
    setTimeLeft(0)
  }

  if (gameCompleted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #cffafe 100%)',
        paddingTop: '80px'
      }}>
        {/* Header Fixo - Voltar */}
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
              Voltar
            </button>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>
              🔄
            </div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #1e40af, #0891b2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Desafio Concluído!
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
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
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
                Desafio Concluído!
              </h1>
              <p style={{ 
                fontSize: 'clamp(1.125rem, 4vw, 1.25rem)', 
                color: '#6b7280',
                margin: 0
              }}>
                Você dominou o revezamento e colaboração!
              </p>
            </div>

            <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>Pontuação Final</h3>
                <p style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>{totalScore} pontos</p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #cffafe, #a5f3fc)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>Pontos de Equipe</h3>
                <p style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 'bold', color: '#06b6d4', margin: 0 }}>{teamPoints} pts colaboração</p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>Níveis Completados</h3>
                <p style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 'bold', color: '#059669', margin: 0 }}>{completedLevels.length}/3</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button
                onClick={resetGame}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
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
                🔄 Novo Desafio
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
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #cffafe 100%)',
      paddingTop: '80px'
    }}>
      {/* Header Fixo - Voltar */}
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
            Voltar
          </button>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>
            🔄
          </div>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #1e40af, #0891b2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Desafio do Revezamento
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
                🔄 Desafio do Revezamento
              </h1>
              <p style={{ 
                fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                color: '#6b7280',
                margin: 0
              }}>
                Desenvolva habilidades de trabalho em equipe e colaboração eficaz
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Pontuação Total</div>
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#3b82f6' }}>{totalScore} pts</div>
              <div style={{ fontSize: '14px', color: '#06b6d4' }}>{teamPoints} pts equipe</div>
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
              Aprender trabalho em equipe, divisão de tarefas e coordenação colaborativa através de desafios práticos
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: 'clamp(20px, 5vw, 24px)',
            borderLeft: '4px solid #3b82f6',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginRight: '8px' }}>👑</span>
              <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', color: '#1e40af', margin: 0 }}>Pontuação:</h3>
            </div>
            <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#374151', margin: 0, lineHeight: '1.5' }}>
              Cada colaboração = +15 pontos + 10 pontos de equipe por demonstrar verdadeiro espírito colaborativo
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: 'clamp(20px, 5vw, 24px)',
            borderLeft: '4px solid #06b6d4',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginRight: '8px' }}>📊</span>
              <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', color: '#0891b2', margin: 0 }}>Níveis:</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ 
                fontSize: 'clamp(14px, 3vw, 16px)', 
                color: completedLevels.includes(1) ? '#059669' : '#374151',
                fontWeight: completedLevels.includes(1) ? '600' : 'normal'
              }}>
                <span style={{ fontWeight: '600', color: '#0891b2' }}>Nível 1:</span> Revezamento básico
              </div>
              <div style={{ 
                fontSize: 'clamp(14px, 3vw, 16px)', 
                color: completedLevels.includes(2) ? '#059669' : '#374151',
                fontWeight: completedLevels.includes(2) ? '600' : 'normal'
              }}>
                <span style={{ fontWeight: '600', color: '#0891b2' }}>Nível 2:</span> Coordenação de equipe
              </div>
              <div style={{ 
                fontSize: 'clamp(14px, 3vw, 16px)', 
                color: completedLevels.includes(3) ? '#059669' : '#374151',
                fontWeight: completedLevels.includes(3) ? '600' : 'normal'
              }}>
                <span style={{ fontWeight: '600', color: '#0891b2' }}>Nível 3:</span> Liderança colaborativa
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: 'clamp(20px, 5vw, 24px)',
            borderLeft: '4px solid #059669',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginRight: '8px' }}>🧩</span>
              <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600', color: '#047857', margin: 0 }}>Método:</h3>
            </div>
            <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#374151', margin: 0, lineHeight: '1.5' }}>
              Baseado em Collaborative Problem Solving para desenvolvimento de competências sociais em grupo
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
                <div style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', fontWeight: 'bold', color: '#3b82f6' }}>
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
                background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                borderRadius: '6px',
                width: `${Math.min((score / (currentLevelData?.pointsRequired || 1)) * 100, 100)}%`,
                transition: 'width 0.5s ease'
              }}></div>
            </div>
          </div>

          {currentChallengeData && currentQuestionData && (
            <div style={{ marginBottom: 'clamp(24px, 6vw, 32px)' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                borderRadius: '16px',
                padding: 'clamp(20px, 5vw, 24px)',
                marginBottom: '24px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h3 style={{ 
                      fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: '0 0 8px 0'
                    }}>{currentChallengeData.title}</h3>
                    <p style={{ 
                      fontSize: 'clamp(14px, 3vw, 16px)', 
                      color: '#374151',
                      margin: '0 0 16px 0'
                    }}>{currentChallengeData.description}</p>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#3b82f6'
                    }}>
                      Foco: {currentChallengeData.collaborationFocus}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {!timerActive ? (
                      <button
                        onClick={startTimer}
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        ⏱️ Iniciar Timer
                      </button>
                    ) : (
                      <div style={{
                        backgroundColor: '#dbeafe',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '14px', color: '#3b82f6' }}>Tempo restante</div>
                        <div style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', fontWeight: 'bold', color: '#1e40af' }}>
                          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: 'clamp(20px, 5vw, 24px)',
                marginBottom: '24px'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ 
                    fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 12px 0'
                  }}>👥 Equipe do Desafio:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {currentChallengeData.teamMembers.map((member, index) => (
                      <div key={index} style={{
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: 'clamp(12px, 2.5vw, 14px)',
                        fontWeight: '500'
                      }}>
                        {member}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: 'clamp(20px, 5vw, 24px)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <h5 style={{ 
                      fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: '0 0 8px 0'
                    }}>🎬 Cenário:</h5>
                    <p style={{ 
                      fontSize: 'clamp(14px, 3vw, 16px)', 
                      color: '#374151',
                      margin: '0 0 16px 0',
                      lineHeight: '1.6'
                    }}>{currentChallengeData.scenario}</p>
                  </div>
                  
                  <div>
                    <h5 style={{ 
                      fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: '0 0 8px 0'
                    }}>🎯 Tarefa da Equipe:</h5>
                    <p style={{ 
                      fontSize: 'clamp(14px, 3vw, 16px)', 
                      color: '#374151',
                      fontWeight: '500',
                      margin: 0
                    }}>{currentChallengeData.task}</p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 16px 0'
                }}>
                  Desafio {currentQuestion + 1}: {currentQuestionData.question}
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
                      <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginRight: '8px' }}>🔄</span>
                      <span style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600' }}>
                        Excelente revezamento! +15 pontos + 10 equipe
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', marginRight: '8px' }}>🔄</span>
                      <span style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: '600' }}>
                        Continue praticando o revezamento!
                      </span>
                    </div>
                  )}
                </div>
              )}

              {showExplanation && (
                <div style={{
                  backgroundColor: '#f0f9ff',
                  borderRadius: '16px',
                  padding: 'clamp(20px, 5vw, 24px)',
                  marginBottom: '24px'
                }}>
                  <h4 style={{ 
                    fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                    fontWeight: '600',
                    color: '#1e40af',
                    margin: '0 0 8px 0'
                  }}>💡 Dica de Revezamento:</h4>
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
                    Habilidade: {currentQuestionData.skillType}
                  </div>
                </div>
              )}

              {showExplanation && (
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={nextQuestion}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
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
                    {currentQuestion < (currentChallengeData?.questions.length || 0) - 1 
                      ? 'Próximo Desafio'
                      : currentChallenge < (currentLevelData?.challenges.length || 0) - 1
                      ? 'Nova Equipe'
                      : score >= (currentLevelData?.pointsRequired || 0)
                      ? currentLevel < levels.length ? 'Próximo Nível' : 'Finalizar Desafios'
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
            Desafio {currentChallenge + 1} • Questão {currentQuestion + 1} • Nível {currentLevel} de {levels.length}
          </div>
        </div>
      </div>
    </div>
  )
}