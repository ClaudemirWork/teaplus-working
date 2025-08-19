'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient'
import { ChevronLeft, Save, Timer, Target, Brain, Users, Heart } from 'lucide-react'

// Usar o mesmo cliente do CAA
const supabase = createClient()

interface DialogueOption {
  id: number
  text: string
  isCorrect: boolean
  feedback: string
  skillType: 'empathy' | 'assertiveness' | 'problem_solving' | 'active_listening' | 'emotional_recognition'
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
  dialogueAct: 'request_info' | 'provide_info' | 'acknowledge' | 'express_emotion' | 'negotiate'
}

interface Level {
  id: number
  name: string
  description: string
  scenes: Scene[]
  pointsRequired: number
}

export default function DialogueScenes() {
  const router = useRouter()
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentScene, setCurrentScene] = useState(0)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const [salvando, setSalvando] = useState(false)

  // Estados para métricas científicas
  const [inicioSessao] = useState(new Date())
  const [temposResposta, setTemposResposta] = useState<number[]>([])
  const [inicioScene, setInicioScene] = useState<Date>(new Date())
  const [habilidadesPraticadas, setHabilidadesPraticadas] = useState(new Set<string>())
  const [dialogueActsUsados, setDialogueActsUsados] = useState(new Set<string>())
  const [respostasEmpaticas, setRespostasEmpaticas] = useState(0)
  const [respostasContextuais, setRespostasContextuais] = useState(0)
  const [totalCenas, setTotalCenas] = useState(0)
  const [acertosPorNivel, setAcertosPorNivel] = useState<{[key: number]: number}>({1: 0, 2: 0, 3: 0})
  const [tentativasPorNivel, setTentativasPorNivel] = useState<{[key: number]: number}>({1: 0, 2: 0, 3: 0})

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
          dialogueAct: 'request_info',
          options: [
            {
              id: 1,
              text: "Oi Alex! Eu sou [seu nome]. Prazer em te conhecer!",
              isCorrect: true,
              feedback: "Perfeito! Você se apresentou de forma educada e amigável.",
              skillType: 'assertiveness'
            },
            {
              id: 2,
              text: "[Não responder e sair andando]",
              isCorrect: false,
              feedback: "É importante responder quando alguém se apresenta. Isso mostra educação e interesse.",
              skillType: 'assertiveness'
            },
            {
              id: 3,
              text: "Por que você quer saber?",
              isCorrect: false,
              feedback: "Essa resposta pode soar rude. Em apresentações, é melhor ser acolhedor.",
              skillType: 'assertiveness'
            }
          ],
          explanation: "Quando alguém se apresenta, a resposta educada inclui: dizer seu nome, cumprimentar e demonstrar interesse na conversa. Isso estabelece reciprocidade conversacional."
        },
        {
          id: 2,
          title: "Falando sobre Hobbies",
          context: "Um amigo quer saber sobre seus interesses",
          character: "Maria",
          characterEmotion: "🤔",
          characterLine: "O que você gosta de fazer no seu tempo livre?",
          socialSkill: "Compartilhamento",
          dialogueAct: 'provide_info',
          options: [
            {
              id: 1,
              text: "Eu gosto de ler livros e jogar videogame. E você?",
              isCorrect: true,
              feedback: "Excelente! Você compartilhou seus interesses e retribuiu a pergunta, demonstrando reciprocidade.",
              skillType: 'active_listening'
            },
            {
              id: 2,
              text: "Nada interessante.",
              isCorrect: false,
              feedback: "Essa resposta encerra a conversa. Tente compartilhar algo que você gosta.",
              skillType: 'active_listening'
            },
            {
              id: 3,
              text: "Muita coisa, tenho 50 hobbies diferentes...",
              isCorrect: false,
              feedback: "Muito específico pode confundir. É melhor mencionar 1-2 atividades principais.",
              skillType: 'active_listening'
            }
          ],
          explanation: "Compartilhar hobbies ajuda a criar conexões. A técnica de turn-taking (revezamento) inclui responder e fazer uma pergunta de volta."
        },
        {
          id: 3,
          title: "Pedindo Ajuda",
          context: "Você precisa de ajuda com uma tarefa escolar",
          character: "Professor João",
          characterEmotion: "📚",
          characterLine: "Posso te ajudar com alguma coisa?",
          socialSkill: "Comunicação de necessidades",
          dialogueAct: 'acknowledge',
          options: [
            {
              id: 1,
              text: "Sim, por favor! Estou com dificuldade neste exercício.",
              isCorrect: true,
              feedback: "Ótimo! Você pediu ajuda de forma clara e educada.",
              skillType: 'assertiveness'
            },
            {
              id: 2,
              text: "Não, estou bem.",
              isCorrect: false,
              feedback: "Se você precisa de ajuda, é importante aceitar. Isso mostra maturidade.",
              skillType: 'assertiveness'
            },
            {
              id: 3,
              text: "Esse exercício é muito difícil e chato!",
              isCorrect: false,
              feedback: "Evite reclamar. Foque em explicar especificamente onde você precisa de ajuda.",
              skillType: 'assertiveness'
            }
          ],
          explanation: "Pedir ajuda é uma habilidade importante. Scripts sociais incluem: reconhecer a necessidade, pedir educadamente e agradecer."
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
          dialogueAct: 'express_emotion',
          options: [
            {
              id: 1,
              text: "Desculpa, Lucas! Eu realmente esqueci. Como posso compensar?",
              isCorrect: true,
              feedback: "Perfeito! Você reconheceu o erro e ofereceu uma solução, demonstrando empatia.",
              skillType: 'empathy'
            },
            {
              id: 2,
              text: "Ah, foi mal. Acontece.",
              isCorrect: false,
              feedback: "Muito casual para a situação. É importante mostrar que você se importa.",
              skillType: 'empathy'
            },
            {
              id: 3,
              text: "Você devia ter me lembrado!",
              isCorrect: false,
              feedback: "Culpar o outro não resolve o problema. Assuma a responsabilidade.",
              skillType: 'problem_solving'
            }
          ],
          explanation: "Para resolver conflitos: reconheça sentimentos, peça desculpas sinceramente e ofereça reparação. Isso demonstra competência social."
        },
        {
          id: 5,
          title: "Expressando Opinião",
          context: "Amigos estão decidindo qual filme assistir",
          character: "Ana",
          characterEmotion: "🎬",
          characterLine: "Que tipo de filme vocês querem assistir?",
          socialSkill: "Assertividade",
          dialogueAct: 'negotiate',
          options: [
            {
              id: 1,
              text: "Eu prefiro comédia, mas estou aberto a outras sugestões.",
              isCorrect: true,
              feedback: "Excelente! Você expressou sua preferência mas mostrou flexibilidade.",
              skillType: 'assertiveness'
            },
            {
              id: 2,
              text: "Tanto faz.",
              isCorrect: false,
              feedback: "Participar da decisão é importante. Compartilhe sua opinião.",
              skillType: 'assertiveness'
            },
            {
              id: 3,
              text: "Só assisto comédia. Outros gêneros são chatos.",
              isCorrect: false,
              feedback: "Ser muito rígido pode excluir você de atividades. Seja mais flexível.",
              skillType: 'assertiveness'
            }
          ],
          explanation: "Expressar opinião de forma assertiva envolve: compartilhar preferências e demonstrar abertura para negociação."
        },
        {
          id: 6,
          title: "Consolando um Amigo",
          context: "Sua amiga está triste porque não foi bem em uma prova",
          character: "Sofia",
          characterEmotion: "😢",
          characterLine: "Tirei nota baixa na prova de matemática. Estou muito triste...",
          socialSkill: "Empatia",
          dialogueAct: 'express_emotion',
          options: [
            {
              id: 1,
              text: "Que pena, Sofia. Matemática é difícil mesmo. Quer conversar sobre isso?",
              isCorrect: true,
              feedback: "Muito bem! Você demonstrou empatia e ofereceu apoio emocional.",
              skillType: 'empathy'
            },
            {
              id: 2,
              text: "Eu sempre vou bem em matemática. É fácil!",
              isCorrect: false,
              feedback: "Isso pode fazer a pessoa se sentir pior. Foque em apoiar, não em se comparar.",
              skillType: 'empathy'
            },
            {
              id: 3,
              text: "Pelo menos não foi zero!",
              isCorrect: false,
              feedback: "Minimizar os sentimentos dos outros não ajuda. Seja mais empático.",
              skillType: 'empathy'
            }
          ],
          explanation: "Para consolar: reconheça sentimentos, demonstre empatia e ofereça apoio. Isso fortalece vínculos sociais."
        },
        {
          id: 7,
          title: "Lidando com Críticas",
          context: "Um colega critica seu trabalho em grupo",
          character: "Pedro",
          characterEmotion: "😤",
          characterLine: "Acho que sua parte do trabalho ficou confusa e desorganizada.",
          socialSkill: "Receber feedback",
          dialogueAct: 'acknowledge',
          options: [
            {
              id: 1,
              text: "Obrigado pelo feedback. Pode me mostrar onde posso melhorar?",
              isCorrect: true,
              feedback: "Excelente! Você recebeu a crítica de forma madura e construtiva.",
              skillType: 'emotional_recognition'
            },
            {
              id: 2,
              text: "Você que não entendeu nada!",
              isCorrect: false,
              feedback: "Reagir defensivamente prejudica o trabalho em equipe. Tente ser mais receptivo.",
              skillType: 'emotional_recognition'
            },
            {
              id: 3,
              text: "[Ficar em silêncio e sair]",
              isCorrect: false,
              feedback: "Evitar o feedback impede seu crescimento. É melhor dialogar construtivamente.",
              skillType: 'emotional_recognition'
            }
          ],
          explanation: "Receber críticas construtivamente: agradeça o feedback, peça esclarecimentos e demonstre abertura para melhorar."
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
          id: 8,
          title: "Negociação em Grupo",
          context: "Você e seus amigos precisam decidir onde comemorar um aniversário",
          character: "Grupo",
          characterEmotion: "🎉",
          characterLine: "Pessoal, precisamos decidir onde fazer a festa. Alguém tem sugestões?",
          socialSkill: "Liderança colaborativa",
          dialogueAct: 'negotiate',
          options: [
            {
              id: 1,
              text: "Que tal fazermos uma lista de opções e votarmos? Posso começar sugerindo o parque.",
              isCorrect: true,
              feedback: "Excelente! Você propôs um processo justo e deu uma sugestão construtiva.",
              skillType: 'problem_solving'
            },
            {
              id: 2,
              text: "Tanto faz, decidam vocês.",
              isCorrect: false,
              feedback: "Participar das decisões em grupo é importante. Contribua com ideias.",
              skillType: 'problem_solving'
            },
            {
              id: 3,
              text: "Vamos fazer no shopping, já decidi.",
              isCorrect: false,
              feedback: "Decisões unilaterais podem excluir outros. Seja mais colaborativo.",
              skillType: 'problem_solving'
            }
          ],
          explanation: "Em negociações grupais: proponha processos democráticos, contribua com ideias e busque consenso."
        },
        {
          id: 9,
          title: "Conversa Profunda",
          context: "Um amigo está passando por um momento difícil em casa",
          character: "Carlos",
          characterEmotion: "😟",
          characterLine: "Meus pais estão brigando muito ultimamente. Não sei o que fazer...",
          socialSkill: "Apoio emocional",
          dialogueAct: 'express_emotion',
          options: [
            {
              id: 1,
              text: "Isso deve ser muito difícil para você. Obrigado por confiar em mim. Como posso ajudar?",
              isCorrect: true,
              feedback: "Perfeito! Você validou os sentimentos e ofereceu apoio genuíno.",
              skillType: 'empathy'
            },
            {
              id: 2,
              text: "Meus pais também brigam às vezes. É normal.",
              isCorrect: false,
              feedback: "Evite minimizar ou comparar. Foque na experiência da pessoa.",
              skillType: 'empathy'
            },
            {
              id: 3,
              text: "Você deveria falar com eles para pararem.",
              isCorrect: false,
              feedback: "Conselhos precipitados podem não ser úteis. Primeiro ouça e apoie.",
              skillType: 'empathy'
            }
          ],
          explanation: "Em conversas profundas: valide sentimentos, agradeça a confiança e ofereça apoio antes de aconselhar."
        },
        {
          id: 10,
          title: "Mediando Discussão",
          context: "Dois amigos estão discutindo e você precisa mediar",
          character: "João e Ana",
          characterEmotion: "😠",
          characterLine: "João diz que Ana pegou seu livro sem pedir. Ana diz que João prometeu emprestar.",
          socialSkill: "Mediação",
          dialogueAct: 'negotiate',
          options: [
            {
              id: 1,
              text: "Vamos com calma. João, conte sua versão. Depois Ana. Vamos resolver juntos.",
              isCorrect: true,
              feedback: "Excelente mediação! Você deu espaço para ambos e propôs solução colaborativa.",
              skillType: 'problem_solving'
            },
            {
              id: 2,
              text: "Parem de brigar por bobagem!",
              isCorrect: false,
              feedback: "Minimizar o conflito não ajuda. É preciso mediar com neutralidade.",
              skillType: 'problem_solving'
            },
            {
              id: 3,
              text: "João tem razão, não se pega sem pedir.",
              isCorrect: false,
              feedback: "Tomar partido prejudica a mediação. Mantenha neutralidade.",
              skillType: 'problem_solving'
            }
          ],
          explanation: "Para mediar: mantenha neutralidade, ouça ambos os lados e facilite a comunicação respeitosa."
        },
        {
          id: 11,
          title: "Entrevista de Emprego",
          context: "Você está em uma entrevista para um estágio",
          character: "Entrevistador",
          characterEmotion: "👔",
          characterLine: "Por que você quer trabalhar conosco?",
          socialSkill: "Comunicação profissional",
          dialogueAct: 'provide_info',
          options: [
            {
              id: 1,
              text: "Admiro o trabalho da empresa e acredito que posso contribuir com minhas habilidades em [área].",
              isCorrect: true,
              feedback: "Perfeito! Resposta profissional e focada.",
              skillType: 'assertiveness'
            },
            {
              id: 2,
              text: "Preciso do dinheiro.",
              isCorrect: false,
              feedback: "Muito direto e informal. Foque em aspectos profissionais.",
              skillType: 'assertiveness'
            },
            {
              id: 3,
              text: "Não sei, meus pais me mandaram procurar estágio.",
              isCorrect: false,
              feedback: "Demonstre interesse genuíno e motivação própria.",
              skillType: 'assertiveness'
            }
          ],
          explanation: "Em contextos profissionais: seja claro, demonstre preparação e interesse genuíno."
        }
      ]
    }
  ]

  const calcularMetricas = () => {
    const duracaoMinutos = (new Date().getTime() - inicioSessao.getTime()) / 60000
    const tempoMedioResposta = temposResposta.length > 0 
      ? temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length
      : 0
    
    const totalTentativas = Object.values(tentativasPorNivel).reduce((a, b) => a + b, 0)
    const totalAcertos = Object.values(acertosPorNivel).reduce((a, b) => a + b, 0)
    const taxaAcerto = totalTentativas > 0 ? (totalAcertos / totalTentativas) * 100 : 0
    
    const taxaReciprocidade = totalCenas > 0 ? ((respostasContextuais / totalCenas) * 100) : 0
    
    return {
      duracaoMinutos: duracaoMinutos.toFixed(2),
      tempoMedioResposta: tempoMedioResposta.toFixed(2),
      taxaAcerto: taxaAcerto.toFixed(1),
      taxaReciprocidade: taxaReciprocidade.toFixed(1),
      diversidadeHabilidades: habilidadesPraticadas.size,
      dialogueActsPraticados: dialogueActsUsados.size,
      respostasEmpaticas,
      respostasContextuais,
      niveisCompletados: completedLevels.length,
      cenasCompletadas: totalCenas
    }
  }

  const currentLevelData = levels.find(level => level.id === currentLevel)
  const currentSceneData = currentLevelData?.scenes[currentScene]

  const handleAnswer = (optionId: number) => {
    if (selectedAnswer !== null) return

    const tempoResposta = (new Date().getTime() - inicioScene.getTime()) / 1000
    setTemposResposta([...temposResposta, tempoResposta])

    setSelectedAnswer(optionId)
    setShowResult(true)
    setTotalCenas(totalCenas + 1)
    
    setTentativasPorNivel(prev => ({
      ...prev,
      [currentLevel]: prev[currentLevel] + 1
    }))

    const selectedOption = currentSceneData?.options.find(opt => opt.id === optionId)
    
    if (selectedOption) {
      setHabilidadesPraticadas(prev => new Set(prev).add(selectedOption.skillType))
      
      if (currentSceneData) {
        setDialogueActsUsados(prev => new Set(prev).add(currentSceneData.dialogueAct))
      }
      
      if (selectedOption.isCorrect) {
        const points = 10
        setScore(score + points)
        setTotalScore(totalScore + points)
        
        setAcertosPorNivel(prev => ({
          ...prev,
          [currentLevel]: prev[currentLevel] + 1
        }))
        
        if (selectedOption.skillType === 'empathy') {
          setRespostasEmpaticas(respostasEmpaticas + 1)
        }
        if (selectedOption.skillType === 'active_listening' || selectedOption.text.includes('?')) {
          setRespostasContextuais(respostasContextuais + 1)
        }
      }
    }

    setTimeout(() => {
      setShowExplanation(true)
    }, 1500)
  }

  const nextScene = () => {
    if (!currentLevelData) return

    if (currentScene < currentLevelData.scenes.length - 1) {
      setCurrentScene(currentScene + 1)
      setInicioScene(new Date())
    } else {
      if (score >= currentLevelData.pointsRequired) {
        setCompletedLevels([...completedLevels, currentLevel])
        
        if (currentLevel < levels.length) {
          setCurrentLevel(currentLevel + 1)
          setCurrentScene(0)
          setScore(0)
          setInicioScene(new Date())
        } else {
          setGameCompleted(true)
        }
      } else {
        setCurrentScene(0)
        setScore(0)
        setInicioScene(new Date())
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
    setInicioScene(new Date())
  }

  const handleSaveSession = async () => {
    if (totalCenas === 0) {
      alert('Complete pelo menos uma cena antes de salvar.')
      return
    }
    
    setSalvando(true)
    
    const metricas = calcularMetricas()
    const fimSessao = new Date()
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Erro ao obter usuário:', userError)
        alert('Erro: Sessão expirada. Por favor, faça login novamente.')
        router.push('/login')
        return
      }
      
      const detalhesMetricas = {
        tipo_atividade: 'dialogue_scenes',
        versao_metricas: '1.0',
        niveis_completados: completedLevels,
        cenas_totais: totalCenas,
        pontuacao_por_nivel: acertosPorNivel,
        tentativas_por_nivel: tentativasPorNivel,
        taxa_acerto: parseFloat(metricas.taxaAcerto),
        taxa_reciprocidade: parseFloat(metricas.taxaReciprocidade),
        tempo_medio_resposta: parseFloat(metricas.tempoMedioResposta),
        habilidades_praticadas: Array.from(habilidadesPraticadas),
        dialogue_acts_usados: Array.from(dialogueActsUsados),
        respostas_empaticas: respostasEmpaticas,
        respostas_contextuais: respostasContextuais,
        duracao_minutos: parseFloat(metricas.duracaoMinutos)
      }
      
      const { error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Diálogos em Cenas',
          pontuacao_final: totalScore,
          data_fim: fimSessao.toISOString(),
          metricas: detalhesMetricas
        }])

      if (error) {
        console.error('Erro ao salvar:', error)
        alert(`Erro ao salvar: ${error.message}`)
      } else {
        alert(`Sessão salva com sucesso!
        
📊 Resumo:
• Pontuação total: ${totalScore}
• Taxa de acerto: ${metricas.taxaAcerto}%
• ${metricas.respostasEmpaticas} respostas empáticas`)
        
        router.push('/dashboard') // <<< CORRIGIDO
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error)
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setSalvando(false)
    }
  }

  const GameHeader = () => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/dashboard" 
            className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
          </Link>
          
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center">
            🎭 Diálogos em Cenas
          </h1>
          
          <button
            onClick={handleSaveSession}
            disabled={salvando}
            className="flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors disabled:bg-green-400"
          >
            <Save size={18} />
            <span className="hidden sm:inline">{salvando ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>
      </div>
    </header>
  )

  if (gameCompleted) {
    const metricas = calcularMetricas()
    
    return (
      <div className="min-h-screen bg-gray-50">
        <GameHeader />

        <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Parabéns!</h2>
              <p className="text-xl text-gray-600">Você completou todos os níveis!</p>
            </div>

            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl mb-8 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <div className="text-2xl font-bold mb-2">
                  Pontuação Total: {totalScore} pontos
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-gray-700 mb-4">📊 Análise de Desempenho</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2"><Target className="text-blue-500" size={20} /><span className="text-sm">Acerto</span></div>
                  <div className="text-xl font-bold">{metricas.taxaAcerto}%</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2"><Users className="text-green-500" size={20} /><span className="text-sm">Reciprocidade</span></div>
                  <div className="text-xl font-bold">{metricas.taxaReciprocidade}%</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2"><Heart className="text-red-500" size={20} /><span className="text-sm">Empatia</span></div>
                  <div className="text-xl font-bold">{respostasEmpaticas}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2"><Brain className="text-purple-500" size={20} /><span className="text-sm">Habilidades</span></div>
                  <div className="text-xl font-bold">{metricas.diversidadeHabilidades}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={resetGame}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                🔄 Jogar Novamente
              </button>
              <button 
                onClick={handleSaveSession}
                disabled={salvando}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:bg-green-400"
              >
                {salvando ? 'Salvando...' : '💾 Salvar e Finalizar'}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader />
      <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
              <p className="text-sm text-gray-600">Desenvolver habilidades de conversação através de role-play e scripts sociais.</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Leia o contexto da cena</li>
                <li>Escolha a melhor resposta</li>
                <li>Aprenda com o feedback</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-1">⭐ Níveis:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Básico, Intermediário e Avançado</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Nível {currentLevel}: {currentLevelData?.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">{currentLevelData?.description}</p>
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <div className="text-xs text-gray-500">Pontos</div>
                <div className="text-lg font-bold text-purple-600">
                  {score}/{currentLevelData?.pointsRequired}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min((score / (currentLevelData?.pointsRequired || 1)) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {currentSceneData && (
            <div>
              <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
                <h3 className="mb-2 font-semibold text-gray-900">{currentSceneData.title}</h3>
                <p className="mb-4 text-sm text-gray-700">{currentSceneData.context}</p>
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-600">
                  Habilidade: {currentSceneData.socialSkill}
                </span>
              </div>

              <div className="mb-6 flex items-start space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-3xl text-white flex-shrink-0">
                  {currentSceneData.characterEmotion}
                </div>
                <div className="flex-1">
                  <div className="mb-2 font-semibold text-gray-900">{currentSceneData.character}:</div>
                  <div className="rounded-xl bg-gray-100 p-4 text-gray-800">
                    "{currentSceneData.characterLine}"
                  </div>
                </div>
              </div>

              <h4 className="mb-4 font-semibold text-gray-900">Como você responderia?</h4>

              <div className="space-y-3 mb-6">
                {currentSceneData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={selectedAnswer !== null}
                    className={`w-full rounded-xl p-4 text-left transition-all ${
                      selectedAnswer === null
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : selectedAnswer === option.id
                        ? option.isCorrect ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'
                        : option.isCorrect ? 'bg-green-100' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <div className="font-medium">{option.text}</div>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <>
                  <div className="mb-6 rounded-xl bg-blue-50 p-4">
                    <h4 className="mb-2 font-semibold text-blue-900">💡 Dica Social:</h4>
                    <p className="text-blue-800">{currentSceneData.explanation}</p>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={nextScene}
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 font-semibold text-white transition-all hover:shadow-lg"
                    >
                      {currentScene < (currentLevelData?.scenes.length || 0) - 1 
                        ? 'Próxima Cena' 
                        : score >= (currentLevelData?.pointsRequired || 0)
                        ? currentLevel < levels.length ? 'Próximo Nível' : 'Finalizar'
                        : 'Tentar Nível Novamente'
                      }
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
