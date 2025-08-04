'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FriendshipScenario {
  id: number
  title: string
  description: string
  friendshipStage: string
  characters: {
    name: string
    personality: string
    emotion: string
  }[]
  situation: string
  socialContext: string
  questions: {
    id: number
    question: string
    options: string[]
    correct: number
    explanation: string
    peersSkill: string
  }[]
  skillFocus: string
}

interface Level {
  id: number
  name: string
  description: string
  scenarios: FriendshipScenario[]
  pointsRequired: number
}

export default function FriendshipAcademy() {
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
  const [friendshipPoints, setFriendshipPoints] = useState(0)

  const levels: Level[] = [
    {
      id: 1,
      name: "Fazendo Amigos",
      description: "Aprender a iniciar conversas e criar novas amizades",
      pointsRequired: 70,
      scenarios: [
        {
          id: 1,
          title: "Primeiro Dia na Escola",
          description: "Conhecer pessoas novas em um ambiente desconhecido",
          friendshipStage: "Iniciação",
          characters: [
            { name: "Você", personality: "Novo aluno", emotion: "😊" },
            { name: "Marina", personality: "Amigável e curiosa", emotion: "🙂" },
            { name: "Grupo da Mesa", personality: "Já se conhecem", emotion: "👥" }
          ],
          situation: "É seu primeiro dia em uma nova escola. Durante o intervalo, você vê uma mesa com alguns alunos conversando e rindo. Marina, que parece simpática, está sentada um pouco afastada lendo um livro.",
          socialContext: "Pátio da escola durante o recreio",
          skillFocus: "Iniciação de contato social",
          questions: [
            {
              id: 1,
              question: "Qual é a melhor forma de se aproximar para fazer amigos?",
              options: [
                "Interromper a conversa do grupo e se apresentar",
                "Se aproximar de Marina que está sozinha e puxar conversa sobre o livro",
                "Esperar alguém vir falar comigo primeiro",
                "Sentar sozinho e esperar o recreio acabar"
              ],
              correct: 1,
              explanation: "Aproximar-se de alguém que está sozinho e iniciar conversa sobre interesses comuns é uma estratégia eficaz do PEERS.",
              peersSkill: "Encontrar ponto de entrada apropriado"
            },
            {
              id: 2,
              question: "Como iniciar uma conversa com Marina sobre o livro?",
              options: [
                "'Oi! Esse livro é legal? Estou procurando algo para ler'",
                "'Por que você está lendo ao invés de conversar com os outros?'",
                "'Você sempre lê sozinha?'",
                "'Livros são chatos, vamos fazer outra coisa'"
              ],
              correct: 0,
              explanation: "Mostrar interesse genuíno e compartilhar algo sobre si mesmo cria conexão natural.",
              peersSkill: "Iniciar conversa com interesse comum"
            }
          ]
        },
        {
          id: 2,
          title: "Atividade em Grupo",
          description: "Participar de atividades coletivas para conhecer pessoas",
          friendshipStage: "Participação",
          characters: [
            { name: "Você", personality: "Participativo", emotion: "😊" },
            { name: "Carlos", personality: "Organizador", emotion: "😎" },
            { name: "Lucia", personality: "Tímida mas talentosa", emotion: "😌" },
            { name: "Roberto", personality: "Competitivo", emotion: "😤" }
          ],
          situation: "A escola está organizando um torneio de jogos cooperativos. Você precisa formar um grupo de 4 pessoas. Carlos já tem um grupo quase completo, Lucia está sozinha, e Roberto quer entrar em qualquer grupo vencedor.",
          socialContext: "Quadra esportiva durante organização de times",
          skillFocus: "Integração em grupos sociais",
          questions: [
            {
              id: 1,
              question: "Como formar um grupo que seja bom para fazer amizades?",
              options: [
                "Entrar no grupo do Carlos que já está organizado",
                "Convidar Lucia para formar um grupo e procurar mais pessoas",
                "Formar grupo apenas com os melhores jogadores",
                "Esperar sobrar em algum grupo"
              ],
              correct: 1,
              explanation: "Incluir pessoas que estão sozinhas e formar grupo novo permite criar vínculos mais fortes.",
              peersSkill: "Formação inclusiva de grupos"
            },
            {
              id: 2,
              question: "Como lidar com Roberto que só quer ganhar?",
              options: [
                "Aceitar ele no grupo e focar apenas na vitória",
                "Recusar ele porque pode criar conflitos",
                "Incluir ele mas equilibrar competição com diversão",
                "Ignorar o comportamento dele"
              ],
              correct: 2,
              explanation: "Incluir pessoas diferentes e estabelecer equilíbrio entre objetivos é habilidade social importante.",
              peersSkill: "Gerenciar diferentes personalidades"
            }
          ]
        },
        {
          id: 3,
          title: "Interesses Comuns",
          description: "Descobrir e desenvolver atividades compartilhadas",
          friendshipStage: "Conexão",
          characters: [
            { name: "Você", personality: "Gosta de música", emotion: "🎵" },
            { name: "Ana", personality: "Ama desenhar", emotion: "🎨" },
            { name: "Pedro", personality: "Fã de jogos", emotion: "🎮" }
          ],
          situation: "Você descobriu que Ana gosta de música (assim como você), mas ela principalmente desenha. Pedro adora jogos e descobriu que você também joga. Cada um tem um interesse principal diferente, mas há sobreposições.",
          socialContext: "Biblioteca da escola durante estudo livre",
          skillFocus: "Descoberta de interesses mútuos",
          questions: [
            {
              id: 1,
              question: "Como desenvolver amizade com interesses parcialmente diferentes?",
              options: [
                "Focar apenas nos interesses que são iguais",
                "Tentar mudar os interesses dos outros",
                "Explorar os interesses deles e compartilhar os seus",
                "Procurar outras pessoas com interesses idênticos"
              ],
              correct: 2,
              explanation: "Curiosidade mútua e troca de interesses enriquece amizades e permite crescimento pessoal.",
              peersSkill: "Expansão de interesses compartilhados"
            },
            {
              id: 2,
              question: "Ana te convida para um clube de arte. Você não desenha bem, mas...",
              options: [
                "Recusar porque não tem talento",
                "Aceitar e fingir que sabe desenhar",
                "Aceitar como iniciante e pedir para ela te ensinar",
                "Sugerir que ela venha no seu clube de música ao invés"
              ],
              correct: 2,
              explanation: "Aceitar convites e estar aberto a aprender demonstra interesse genuíno na amizade.",
              peersSkill: "Reciprocidade e abertura para aprender"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Mantendo Amizades",
      description: "Cultivar relacionamentos duradouros e saudáveis",
      pointsRequired: 90,
      scenarios: [
        {
          id: 4,
          title: "Conflito de Opinião",
          description: "Manter amizade mesmo com diferenças de pensamento",
          friendshipStage: "Manutenção",
          characters: [
            { name: "Você", personality: "Gosta de filmes de ação", emotion: "🎬" },
            { name: "Beatriz", personality: "Prefere filmes românticos", emotion: "💕" },
            { name: "Grupo", personality: "Opinião dividida", emotion: "🤔" }
          ],
          situation: "Seu grupo de amigos está decidindo que filme assistir na sessão cinema da escola. Você quer um filme de ação, Beatriz prefere romance, e o grupo está dividido. A discussão está ficando tensa e pode afetar a amizade.",
          socialContext: "Reunião do grupo para escolher filme",
          skillFocus: "Resolução de diferenças de opinião",
          questions: [
            {
              id: 1,
              question: "Como resolver a diferença sem prejudicar a amizade?",
              options: [
                "Insistir na sua escolha até convencer todos",
                "Propor alternância: desta vez romance, próxima ação",
                "Desistir e deixar os outros decidirem",
                "Sair do grupo se não escolherem seu filme"
              ],
              correct: 1,
              explanation: "Compromisso e alternância demonstram maturidade e consideração pelos amigos.",
              peersSkill: "Negociação e compromisso"
            },
            {
              id: 2,
              question: "Se Beatriz ficar chateada com o resultado, você deve:",
              options: [
                "Dizer que ela está exagerando",
                "Conversar em particular e validar seus sentimentos",
                "Ignorar até ela superar",
                "Pedir desculpas mesmo se não fez nada errado"
              ],
              correct: 1,
              explanation: "Validação emocional e conversa individual fortalecem vínculos de amizade.",
              peersSkill: "Suporte emocional"
            }
          ]
        },
        {
          id: 5,
          title: "Tempo e Disponibilidade",
          description: "Equilibrar tempo com amigos e outras responsabilidades",
          friendshipStage: "Equilíbrio",
          characters: [
            { name: "Você", personality: "Estudante dedicado", emotion: "📚" },
            { name: "Marcos", personality: "Quer sair sempre", emotion: "🎉" },
            { name: "Julia", personality: "Compreensiva", emotion: "😊" }
          ],
          situation: "As provas finais estão chegando e você precisa estudar muito. Marcos quer que você saia com o grupo todos os dias e está achando que você não se importa mais com a amizade. Julia entende sua situação.",
          socialContext: "Período de provas finais",
          skillFocus: "Gestão de tempo em amizades",
          questions: [
            {
              id: 1,
              question: "Como manter a amizade durante período ocupado?",
              options: [
                "Abandonar os estudos para manter os amigos",
                "Explicar a situação e propor encontros menores",
                "Cortar contato temporariamente até as provas passarem",
                "Dizer que amizade não é prioridade agora"
              ],
              correct: 1,
              explanation: "Comunicação transparente e propostas alternativas mantêm conexão sem sacrificar responsabilidades.",
              peersSkill: "Comunicação de necessidades pessoais"
            },
            {
              id: 2,
              question: "Marcos continua pressionando. Como lidar?",
              options: [
                "Ceder à pressão para não perder a amizade",
                "Brigar e dizer que ele não te entende",
                "Manter firme mas gentil, explicando a importância dos estudos",
                "Pedir para Julia convencer Marcos"
              ],
              correct: 2,
              explanation: "Assertividade respeitosa mantém limites saudáveis na amizade.",
              peersSkill: "Assertividade com respeito"
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Respeitando Diferenças",
      description: "Aceitar e valorizar a diversidade nas amizades",
      pointsRequired: 110,
      scenarios: [
        {
          id: 6,
          title: "Amigo com Necessidades Especiais",
          description: "Incluir e apoiar amigos com diferenças",
          friendshipStage: "Inclusão",
          characters: [
            { name: "Você", personality: "Inclusivo", emotion: "🤗" },
            { name: "Samuel", personality: "Autista, ama matemática", emotion: "🧮" },
            { name: "Outros colegas", personality: "Variado", emotion: "👥" }
          ],
          situation: "Samuel, que é autista, é excelente em matemática mas tem dificuldades sociais. Alguns colegas fazem comentários sobre seus comportamentos diferentes. Você quer incluí-lo no grupo de estudos e nas atividades sociais.",
          socialContext: "Sala de aula e atividades escolares",
          skillFocus: "Inclusão e aceitação de neurodiversidade",
          questions: [
            {
              id: 1,
              question: "Como incluir Samuel respeitando suas necessidades?",
              options: [
                "Tratá-lo exatamente igual a todos os outros",
                "Adaptar atividades e ser paciente com suas diferenças",
                "Protegê-lo fazendo tudo por ele",
                "Incluir apenas em atividades acadêmicas"
              ],
              correct: 1,
              explanation: "Inclusão efetiva requer adaptação respeitosa e reconhecimento das necessidades individuais.",
              peersSkill: "Adaptação inclusiva"
            },
            {
              id: 2,
              question: "Quando outros fazem comentários sobre Samuel:",
              options: [
                "Ignorar para não criar mais problemas",
                "Defender Samuel e educar sobre neurodiversidade",
                "Concordar para se encaixar no grupo",
                "Contar para Samuel o que estão falando"
              ],
              correct: 1,
              explanation: "Defesa ativa e educação promovem ambiente mais inclusivo para todos.",
              peersSkill: "Advocacia social"
            }
          ]
        },
        {
          id: 7,
          title: "Diferenças Culturais",
          description: "Apreciar e aprender com amigos de outras culturas",
          friendshipStage: "Diversidade",
          characters: [
            { name: "Você", personality: "Brasileiro", emotion: "🇧🇷" },
            { name: "Yuki", personality: "Japonesa, nova no Brasil", emotion: "🇯🇵" },
            { name: "Ahmed", personality: "Sírio, família refugiada", emotion: "🇸🇾" }
          ],
          situation: "Sua turma recebeu dois novos alunos internacionais: Yuki do Japão e Ahmed da Síria. Eles têm costumes diferentes, comem comidas diferentes e às vezes não entendem algumas expressões brasileiras. Alguns colegas os tratam como 'esquisitos'.",
          socialContext: "Integração de alunos internacionais",
          skillFocus: "Competência intercultural",
          questions: [
            {
              id: 1,
              question: "Como criar amizade com pessoas de culturas diferentes?",
              options: [
                "Insistir para eles se adaptarem completamente à cultura brasileira",
                "Mostrar interesse genuíno em suas culturas e compartilhar a sua",
                "Tratá-los apenas como 'exóticos' e diferentes",
                "Evitar assuntos culturais para não causar mal-entendidos"
              ],
              correct: 1,
              explanation: "Curiosidade mútua e troca cultural enriquecem amizades interculturais.",
              peersSkill: "Competência intercultural"
            },
            {
              id: 2,
              question: "Ahmed convida você para conhecer comida síria que sua família fez:",
              options: [
                "Recusar porque pode não gostar da comida",
                "Aceitar com entusiasmo e perguntar sobre a cultura",
                "Aceitar mas deixar claro que prefere comida brasileira",
                "Aceitar apenas se ele experimentar comida brasileira também"
              ],
              correct: 1,
              explanation: "Abertura e entusiasmo por experiências culturais fortalecem vínculos interculturais.",
              peersSkill: "Abertura cultural"
            }
          ]
        },
        {
          id: 8,
          title: "Amizade Duradoura",
          description: "Manter amizades ao longo do tempo e mudanças",
          friendshipStage: "Permanência",
          characters: [
            { name: "Você", personality: "Leal", emotion: "💙" },
            { name: "Carolina", personality: "Melhor amiga há 3 anos", emotion: "💖" },
            { name: "Novos amigos", personality: "Do ensino médio", emotion: "✨" }
          ],
          situation: "Carolina é sua melhor amiga desde o 6º ano. Agora no 9º ano, vocês estão em turmas diferentes e fizeram novos amigos. Às vezes parece que estão se afastando, e vocês têm menos em comum do que antes. Mas a história de vocês é muito importante.",
          socialContext: "Transição entre etapas escolares",
          skillFocus: "Manutenção de amizades duradouras",
          questions: [
            {
              id: 1,
              question: "Como manter amizade antiga enquanto faz novas amizades?",
              options: [
                "Focar apenas nas amizades novas que têm mais em comum",
                "Manter contato regular e criar novos interesses juntas",
                "Forçar que tudo continue exatamente igual ao passado",
                "Aceitar que amizades sempre acabam com o tempo"
              ],
              correct: 1,
              explanation: "Amizades duradouras requerem adaptação e criação de novas experiências compartilhadas.",
              peersSkill: "Renovação de vínculos"
            },
            {
              id: 2,
              question: "Carolina parece distante ultimamente. Você deve:",
              options: [
                "Esperar ela procurar você primeiro",
                "Confrontá-la sobre o comportamento",
                "Conversar abertamente sobre as mudanças na amizade",
                "Começar a se afastar também"
              ],
              correct: 2,
              explanation: "Comunicação direta e honesta sobre mudanças fortalece amizades verdadeiras.",
              peersSkill: "Comunicação sobre relacionamentos"
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
      const points = 20
      setScore(score + points)
      setTotalScore(totalScore + points)
      setFriendshipPoints(friendshipPoints + 15) // Pontos extras de amizade
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
    setFriendshipPoints(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setCompletedLevels([])
    setGameCompleted(false)
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Header Fixo */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link 
                href="/tea" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Voltar para TEA</span>
              </Link>
              
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👫</span>
                <div className="text-right">
                  <div className="font-bold text-gray-800">Academia de Amizades</div>
                  <div className="text-sm text-gray-600">Formatura Completa!</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-2xl text-center">
              <div className="rounded-3xl bg-white/80 backdrop-blur-sm p-8 sm:p-12 shadow-xl">
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-4xl">
                    🏆
                  </div>
                  <h1 className="mb-4 text-3xl sm:text-4xl font-bold text-gray-900">
                    Academia Concluída! 
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600">
                    Você se formou na arte de fazer e manter amizades!
                  </p>
                </div>

                <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Pontuação Final</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">{totalScore} pontos</p>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Pontos PEERS</h3>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-600">{friendshipPoints} pts</p>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 p-4 sm:p-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Níveis</h3>
                    <p className="text-xl sm:text-2xl font-bold text-teal-600">{completedLevels.length}/3</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={resetGame}
                    className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 sm:px-8 py-3 sm:py-4 text-lg font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"
                  >
                    🔄 Nova Jornada de Amizades
                  </button>
                  <Link
                    href="/tea"
                    className="block w-full rounded-2xl border-2 border-gray-300 px-6 sm:px-8 py-3 sm:py-4 text-lg font-semibold text-gray-700 transition-all hover:border-gray-400 hover:shadow-lg"
                  >
                    🏠 Voltar para TEA
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header Fixo */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/tea" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Voltar para TEA</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👫</span>
              <div className="text-right">
                <div className="font-bold text-gray-800">Academia de Amizades</div>
                <div className="text-sm text-gray-600">Pontuação Total</div>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                {totalScore} pts
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Intro Section */}
        <div className="mb-6 sm:mb-8">
          <div className="rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-gray-900">
                  👫 Academia de Amizades
                </h1>
                <p className="text-base sm:text-lg text-gray-600">
                  Aprenda a fazer, manter e valorizar amizades verdadeiras e duradouras
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="mb-2 text-sm text-gray-500">Pontuação Total</div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">{totalScore} pts</div>
                <div className="text-sm text-green-500">{friendshipPoints} pts PEERS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-2xl bg-white/70 backdrop-blur-sm p-4 sm:p-6 shadow-lg border-l-4 border-red-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">🎯</span>
              <h3 className="text-base sm:text-lg font-semibold text-red-600">Objetivo:</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Desenvolver competências sociais para criar, manter e valorizar amizades respeitando diferenças individuais
            </p>
          </div>

          <div className="rounded-2xl bg-white/70 backdrop-blur-sm p-4 sm:p-6 shadow-lg border-l-4 border-green-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">👑</span>
              <h3 className="text-base sm:text-lg font-semibold text-green-600">Pontuação:</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Cada amizade desenvolvida = +20 pontos + 15 pontos PEERS por aplicar habilidades sociais científicas
            </p>
          </div>

          <div className="rounded-2xl bg-white/70 backdrop-blur-sm p-4 sm:p-6 shadow-lg border-l-4 border-emerald-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">📊</span>
              <h3 className="text-base sm:text-lg font-semibold text-emerald-600">Níveis:</h3>
            </div>
            <div className="space-y-1 text-sm">
              <div className={completedLevels.includes(1) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-emerald-600">Nível 1:</span> Fazendo amigos
              </div>
              <div className={completedLevels.includes(2) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-emerald-600">Nível 2:</span> Mantendo amizades
              </div>
              <div className={completedLevels.includes(3) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                <span className="font-semibold text-emerald-600">Nível 3:</span> Respeitando diferenças
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/70 backdrop-blur-sm p-4 sm:p-6 shadow-lg border-l-4 border-teal-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">🧠</span>
              <h3 className="text-base sm:text-lg font-semibold text-teal-600">Método:</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Baseado no PEERS Program (UCLA) para desenvolvimento científico de habilidades sociais e amizades
            </p>
          </div>
        </div>

        {/* Main Game Content */}
        <div className="rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-xl">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Nível {currentLevel}: {currentLevelData?.name}
                </h2>
                <p className="text-gray-600">{currentLevelData?.description}</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-sm text-gray-500">Pontos do Nível</div>
                <div className="text-lg sm:text-xl font-bold text-green-600">
                  {score}/{currentLevelData?.pointsRequired}
                </div>
              </div>
            </div>
            
            <div className="mt-4 h-2 sm:h-3 rounded-full bg-gray-200">
              <div 
                className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ 
                  width: `${Math.min((score / (currentLevelData?.pointsRequired || 1)) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {currentScenarioData && currentQuestionData && (
            <div className="mb-6 sm:mb-8">
              <div className="mb-4 sm:mb-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6">
                <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">{currentScenarioData.title}</h3>
                <p className="mb-4 text-sm sm:text-base text-gray-700">{currentScenarioData.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs sm:text-sm font-medium text-green-600">
                    Foco: {currentScenarioData.skillFocus}
                  </div>
                  <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs sm:text-sm font-medium text-green-700">
                    Estágio: {currentScenarioData.friendshipStage}
                  </div>
                </div>
              </div>

              <div className="mb-4 sm:mb-6 rounded-2xl bg-gray-50 p-4 sm:p-6">
                <div className="mb-4">
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3">👥 Personagens da História:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {currentScenarioData.characters.map((character, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center mb-1">
                          <span className="text-xl sm:text-2xl mr-2">{character.emotion}</span>
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">{character.name}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">{character.personality}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-lg bg-white p-4 sm:p-6 border border-gray-200">
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">📍 Contexto Social:</h5>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4">{currentScenarioData.socialContext}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">🎬 Situação:</h5>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{currentScenarioData.situation}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <h4 className="mb-4 text-base sm:text-lg font-semibold text-gray-900">
                  Desafio de Amizade {currentQuestion + 1}: {currentQuestionData.question}
                </h4>

                <div className="space-y-3">
                  {currentQuestionData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left text-sm sm:text-base transition-all ${
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
                <div className={`mb-4 rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
                  selectedAnswer === currentQuestionData.correct
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedAnswer === currentQuestionData.correct ? (
                    <div className="flex items-center">
                      <span className="mr-2 text-xl sm:text-2xl">👫</span>
                      <span className="text-sm sm:text-lg font-semibold">Excelente habilidade social! +20 pontos + 15 PEERS</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2 text-xl sm:text-2xl">🤝</span>
                      <span className="text-sm sm:text-lg font-semibold">Continue desenvolvendo suas habilidades de amizade!</span>
                    </div>
                  )}
                </div>
              )}

              {showExplanation && (
                <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-blue-50 p-4 sm:p-6">
                  <h4 className="mb-2 font-semibold text-blue-900 text-sm sm:text-base">💡 Lição do PEERS:</h4>
                  <p className="text-blue-800 mb-2 text-sm sm:text-base">{currentQuestionData.explanation}</p>
                  <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs sm:text-sm font-medium text-blue-700">
                    Habilidade PEERS: {currentQuestionData.peersSkill}
                  </div>
                </div>
              )}

              {showExplanation && (
                <div className="text-center">
                  <button
                    onClick={nextQuestion}
                    className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"
                  >
                    {currentQuestion < (currentScenarioData?.questions.length || 0) - 1 
                      ? 'Próxima Situação'
                      : currentScenario < (currentLevelData?.scenarios.length || 0) - 1
                      ? 'Nova História'
                      : score >= (currentLevelData?.pointsRequired || 0)
                      ? currentLevel < levels.length ? 'Próximo Nível' : 'Formar na Academia'
                      : 'Tentar Nível Novamente'
                    }
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
            História {currentScenario + 1} • Situação {currentQuestion + 1} • Nível {currentLevel} de {levels.length}
          </div>
        </div>
      </main>
    </div>
  )
}