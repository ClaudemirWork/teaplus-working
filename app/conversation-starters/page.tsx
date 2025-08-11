'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient'
import { ChevronLeft, Save, MessageSquare, Timer, TrendingUp, Award } from 'lucide-react'

// Usar o mesmo cliente do CAA
const supabase = createClient()

interface Option {
  text: string
  correct: boolean
  feedback: string
  estrategia: 'cumprimento' | 'observacao' | 'elogio' | 'pergunta' | 'opiniao'
  elementosNaoVerbais?: string[]
}

interface Situation {
  situation: string
  contexto: 'escolar' | 'familiar' | 'social' | 'profissional' | 'comunitario'
  options: Option[]
}

interface LevelData {
  title: string
  situations: Situation[]
}

const gameData: Record<number, LevelData> = {
  1: {
    title: "Conversas Básicas",
    situations: [
      {
        situation: "Você encontra um colega da escola no corredor durante o intervalo.",
        contexto: 'escolar',
        options: [
          { 
            text: "Oi! Como você está?", 
            correct: true, 
            feedback: "Perfeito! Um cumprimento simples e direto é sempre uma boa forma de iniciar uma conversa. Demonstra interesse genuíno pela pessoa.",
            estrategia: 'cumprimento',
            elementosNaoVerbais: ['contato visual', 'sorriso']
          },
          { 
            text: "Você pode me emprestar dinheiro?", 
            correct: false, 
            feedback: "Pedir favores logo no início pode ser desconfortável. É melhor começar com um cumprimento e construir a conversa gradualmente.",
            estrategia: 'pergunta',
            elementosNaoVerbais: []
          },
          { 
            text: "Não dizer nada e passar direto", 
            correct: false, 
            feedback: "Ignorar conhecidos pode parecer rude. Um simples 'oi' já demonstra educação e pode abrir oportunidades de interação positiva.",
            estrategia: 'cumprimento',
            elementosNaoVerbais: []
          }
        ]
      },
      {
        situation: "Você está na fila do lanche e vê um colega que você conhece pouco.",
        contexto: 'escolar',
        options: [
          { 
            text: "Esta fila está bem grande hoje, né?", 
            correct: true, 
            feedback: "Excelente! Comentar sobre algo que vocês estão vivenciando juntos é uma estratégia eficaz para quebrar o gelo de forma natural.",
            estrategia: 'observacao',
            elementosNaoVerbais: ['gestos', 'expressão facial']
          },
          { 
            text: "Você sempre come lanche aqui?", 
            correct: false, 
            feedback: "Esta pergunta pode soar um pouco invasiva para alguém que você conhece pouco. É melhor começar com observações neutras.",
            estrategia: 'pergunta',
            elementosNaoVerbais: []
          },
          { 
            text: "Ficar em silêncio olhando para o celular", 
            correct: false, 
            feedback: "Perder a oportunidade de interagir pode limitar o desenvolvimento de novos relacionamentos. Pequenas interações ajudam a construir vínculos.",
            estrategia: 'cumprimento',
            elementosNaoVerbais: []
          }
        ]
      },
      {
        situation: "Seu vizinho está regando as plantas no jardim quando você passa.",
        contexto: 'comunitario',
        options: [
          { 
            text: "Bom dia! Suas plantas estão lindas!", 
            correct: true, 
            feedback: "Perfeito! Elogios sinceros sobre algo visível são uma forma calorosa de iniciar conversas com vizinhos e demonstram atenção positiva.",
            estrategia: 'elogio',
            elementosNaoVerbais: ['sorriso', 'aceno', 'contato visual']
          },
          { 
            text: "Quanto você gasta com água para regar isso?", 
            correct: false, 
            feedback: "Perguntas sobre custos podem ser consideradas indiscretas. É melhor focar em aspectos positivos e neutros.",
            estrategia: 'pergunta',
            elementosNaoVerbais: []
          },
          { 
            text: "Acenar rapidamente e seguir andando", 
            correct: false, 
            feedback: "Um aceno é educado, mas uma breve conversa pode fortalecer o relacionamento de vizinhança e criar um ambiente mais amigável.",
            estrategia: 'cumprimento',
            elementosNaoVerbais: ['aceno']
          }
        ]
      },
      {
        situation: "Você chega cedo na aula e há apenas mais um colega na sala.",
        contexto: 'escolar',
        options: [
          { 
            text: "Oi! Chegamos cedo hoje, né?", 
            correct: true, 
            feedback: "Ótimo! Observar uma situação compartilhada cria conexão imediata e é uma forma natural de iniciar uma conversa em ambientes escolares.",
            estrategia: 'observacao',
            elementosNaoVerbais: ['contato visual', 'sorriso']
          },
          { 
            text: "Você fez a lição de casa?", 
            correct: false, 
            feedback: "Embora relacionado ao contexto escolar, começar falando de obrigações pode criar pressão. É melhor estabelecer um clima amigável primeiro.",
            estrategia: 'pergunta',
            elementosNaoVerbais: []
          },
          { 
            text: "Sentar em silêncio mexendo no celular", 
            correct: false, 
            feedback: "Momentos sozinhos com colegas são oportunidades valiosas para fortalecer relacionamentos. Uma pequena interação pode fazer a diferença.",
            estrategia: 'cumprimento',
            elementosNaoVerbais: []
          }
        ]
      },
      {
        situation: "Você está esperando o ônibus e reconhece alguém da sua idade.",
        contexto: 'comunitario',
        options: [
          { 
            text: "Oi! Você também pega este ônibus?", 
            correct: true, 
            feedback: "Excelente! Identificar algo em comum (como pegar o mesmo ônibus) é uma estratégia eficaz para iniciar conversas com desconhecidos de forma segura.",
            estrategia: 'pergunta',
            elementosNaoVerbais: ['contato visual breve', 'postura aberta']
          },
          { 
            text: "Onde você mora?", 
            correct: false, 
            feedback: "Perguntas muito pessoais podem deixar desconhecidos desconfortáveis. É melhor começar com observações sobre a situação atual.",
            estrategia: 'pergunta',
            elementosNaoVerbais: []
          },
          { 
            text: "Olhar para o celular e evitar contato visual", 
            correct: false, 
            feedback: "Evitar interação pode fazer você perder oportunidades de conhecer pessoas interessantes. Um simples 'oi' pode abrir novas amizades.",
            estrategia: 'cumprimento',
            elementosNaoVerbais: []
          }
        ]
      }
    ]
  },
  2: {
    title: "Situações Intermediárias",
    situations: [
      {
        situation: "Você está em uma festa de aniversário e conhece poucas pessoas. Há um grupo conversando sobre filmes.",
        contexto: 'social',
        options: [
          { 
            text: "Com licença, posso me juntar? Ouvi vocês falando de filmes.", 
            correct: true, 
            feedback: "Perfeito! Pedir permissão educadamente e mostrar interesse no tópico é a forma ideal de se juntar a conversas em grupo.",
            estrategia: 'pergunta',
            elementosNaoVerbais: ['contato visual', 'postura aberta', 'sorriso']
          },
          { 
            text: "Interromper para contar sobre seu filme favorito", 
            correct: false, 
            feedback: "Interromper pode ser mal visto. É melhor aguardar uma pausa natural e pedir permissão para participar da conversa.",
            estrategia: 'opiniao',
            elementosNaoVerbais: []
          },
          { 
            text: "Ficar próximo ouvindo sem participar", 
            correct: false, 
            feedback: "Apenas ouvir pode parecer invasivo. É melhor se apresentar e pedir para participar da conversa de forma educada.",
            estrategia: 'observacao',
            elementosNaoVerbais: []
          }
        ]
      },
      {
        situation: "No trabalho em grupo da escola, você foi colocado com pessoas que não conhece bem.",
        contexto: 'escolar',
        options: [
          { 
            text: "Oi pessoal! Eu sou [seu nome]. Como vocês acham que devemos começar?", 
            correct: true, 
            feedback: "Excelente! Apresentar-se e fazer uma pergunta aberta sobre o trabalho integra o grupo e demonstra proatividade colaborativa.",
            estrategia: 'cumprimento',
            elementosNaoVerbais: ['contato visual com todos', 'postura confiante']
          },
          { 
            text: "Esperar alguém tomar a iniciativa", 
            correct: false, 
            feedback: "Aguardar pode fazer o grupo perder tempo. Tomar iniciativa de forma respeitosa demonstra liderança e ajuda o grupo a progredir.",
            estrategia: 'observacao',
            elementosNaoVerbais: []
          },
          { 
            text: "Começar a trabalhar sozinho no seu celular", 
            correct: false, 
            feedback: "Trabalhar isoladamente vai contra o propósito do trabalho em grupo e pode prejudicar tanto o resultado quanto os relacionamentos.",
            estrategia: 'observacao',
            elementosNaoVerbais: []
          }
        ]
      },
      {
        situation: "Você está no intervalo e vê um grupo de colegas conversando animadamente sobre um assunto que você conhece.",
        contexto: 'escolar',
        options: [
          { 
            text: "Esperar uma pausa e dizer: 'Desculpem, ouvi vocês falando sobre [assunto]. Posso dar minha opinião?'", 
            correct: true, 
            feedback: "Perfeito! Aguardar o momento certo e pedir permissão demonstra respeito pelo grupo e interesse genuíno no assunto.",
            estrategia: 'pergunta',
            elementosNaoVerbais: ['contato visual', 'expressão interessada', 'postura aberta']
          },
          { 
            text: "Chegar falando alto: 'Ei, eu sei tudo sobre isso!'", 
            correct: false, 
            feedback: "Ser muito assertivo pode intimidar o grupo. É melhor ser mais sutil e respeitoso ao se juntar a conversas em andamento.",
            estrategia: 'opiniao',
            elementosNaoVerbais: []
          },
          { 
            text: "Ficar próximo sinalizando que quer participar", 
            correct: false, 
            feedback: "Sinais não verbais podem ser mal interpretados. É mais eficaz comunicar verbalmente seu interesse em participar da conversa.",
            estrategia: 'observacao',
            elementosNaoVerbais: ['linguagem corporal']
          }
        ]
      },
      {
        situation: "Em uma reunião familiar, você precisa conversar com parentes que não vê há muito tempo.",
        contexto: 'familiar',
        options: [
          { 
            text: "Oi tia! Faz tempo que não nos vemos. Como você está?", 
            correct: true, 
            feedback: "Ótimo! Reconhecer o tempo que passou e demonstrar interesse genuíno são estratégias eficazes para reconectar com familiares.",
            estrategia: 'cumprimento',
            elementosNaoVerbais: ['abraço', 'sorriso caloroso', 'contato visual']
          },
          { 
            text: "Cumprimentar rapidamente e ir para outro canto", 
            correct: false, 
            feedback: "Evitar interação em reuniões familiares pode parecer rude e perder oportunidades de fortalecer vínculos familiares importantes.",
            estrategia: 'cumprimento',
            elementosNaoVerbais: []
          },
          { 
            text: "Esperar que eles venham falar com você", 
            correct: false, 
            feedback: "Tomar iniciativa em contextos familiares demonstra carinho e pode facilitar conversas mais significativas com parentes queridos.",
            estrategia: 'observacao',
            elementosNaoVerbais: []
          }
        ]
      },
      {
        situation: "Você está em uma atividade extracurricular nova e não conhece ninguém.",
        contexto: 'social',
        options: [
          { 
            text: "Olá! Eu sou novo aqui. Esta é a primeira vez de vocês também?", 
            correct: true, 
            feedback: "Excelente! Identificar-se como novo e fazer perguntas sobre a experiência dos outros cria conexão e pode encontrar outros iniciantes.",
            estrategia: 'pergunta',
            elementosNaoVerbais: ['sorriso', 'postura aberta', 'contato visual']
          },
          { 
            text: "Sentar no canto e observar tudo em silêncio", 
            correct: false, 
            feedback: "Observar é natural, mas participar ativamente ajuda na integração. Pequenas interações facilitam a adaptação ao novo ambiente.",
            estrategia: 'observacao',
            elementosNaoVerbais: []
          },
          { 
            text: "Tentar impressionar contando suas conquistas em outras atividades", 
            correct: false, 
            feedback: "Focar demais em si mesmo pode afastar pessoas. É melhor demonstrar interesse genuíno nos outros e na atividade atual.",
            estrategia: 'opiniao',
            elementosNaoVerbais: []
          }
        ]
      }
    ]
  },
  3: {
    title: "Interações Avançadas",
    situations: [
      {
        situation: "Em uma festa com muitas pessoas desconhecidas, você quer se integrar a uma conversa sobre um tópico complexo que você conhece bem.",
        contexto: 'social',
        options: [
          { 
            text: "Aguardar uma pausa natural e dizer: 'Desculpem interromper, mas achei interessante o que vocês estavam discutindo. Posso compartilhar uma perspectiva?'", 
            correct: true, 
            feedback: "Perfeito! Esta abordagem demonstra respeito pelo grupo, interesse genuíno e oferece valor à conversa de forma educada e não invasiva.",
            estrategia: 'opiniao',
            elementosNaoVerbais: ['contato visual', 'gestos moderados', 'postura confiante']
          },
          { 
            text: "Interromper para corrigir uma informação incorreta que ouviu", 
            correct: false, 
            feedback: "Corrigir pessoas que você não conhece pode criar tensão. É melhor esperar o momento certo e oferecer sua perspectiva de forma construtiva.",
            estrategia: 'opiniao',
            elementosNaoVerbais: []
          },
          { 
            text: "Ficar próximo acenando com a cabeça concordando com tudo", 
            correct: false, 
            feedback: "Apenas concordar sem contribuir pode parecer superficial. É melhor se posicionar de forma respeitosa quando apropriado.",
            estrategia: 'observacao',
            elementosNaoVerbais: ['acenos de cabeça']
          }
        ]
      },
      {
        situation: "Você está em um evento de networking profissional e precisa abordar pessoas influentes na sua área.",
        contexto: 'profissional',
        options: [
          { 
            text: "Aproximar-se durante uma pausa e dizer: 'Olá, eu sou [nome]. Admiro muito seu trabalho em [área específica]. Poderia me dar alguns minutos para uma conversa?'", 
            correct: true, 
            feedback: "Excelente! Esta abordagem é profissional, específica e demonstra preparação. Reconhecer o trabalho da pessoa e pedir permissão são estratégias eficazes.",
            estrategia: 'elogio',
            elementosNaoVerbais: ['aperto de mão firme', 'contato visual', 'postura profissional']
          },
          { 
            text: "Entregar seu cartão para várias pessoas sem conversar", 
            correct: false, 
            feedback: "Networking eficaz requer conversas genuínas. Simplesmente distribuir cartões sem conexão pessoal é menos eficaz para construir relacionamentos.",
            estrategia: 'cumprimento',
            elementosNaoVerbais: []
          },
          { 
            text: "Aguardar que alguém venha falar com você", 
            correct: false, 
            feedback: "Em eventos de networking, a proatividade é essencial. Aguardar pode resultar em poucas conexões valiosas.",
            estrategia: 'observacao',
            elementosNaoVerbais: []
          }
        ]
      },
      {
        situation: "Durante um debate acadêmico, você discorda de uma opinião popular mas quer expressar sua visão respeitosamente.",
        contexto: 'escolar',
        options: [
          { 
            text: "Esperar sua vez e dizer: 'Entendo esse ponto de vista, mas gostaria de apresentar uma perspectiva alternativa baseada em [evidência].'", 
            correct: true, 
            feedback: "Perfeito! Esta abordagem reconhece outras opiniões, é respeitosa e fundamentada. Essencial para debates construtivos e acadêmicos.",
            estrategia: 'opiniao',
            elementosNaoVerbais: ['tom de voz calmo', 'gestos explicativos', 'contato visual']
          },
          { 
            text: "Interromper para dizer que todos estão errados", 
            correct: false, 
            feedback: "Ser confrontativo pode prejudicar o debate. É melhor apresentar argumentos de forma respeitosa e construtiva.",
            estrategia: 'opiniao',
            elementosNaoVerbais: []
          },
          { 
            text: "Ficar em silêncio para evitar conflito", 
            correct: false, 
            feedback: "Em contextos acadêmicos, diferentes perspectivas enriquecem o debate. Expressar opiniões fundamentadas é valioso quando feito respeitosamente.",
            estrategia: 'observacao',
            elementosNaoVerbais: []
          }
        ]
      },
      {
        situation: "Você precisa mediar uma discussão entre dois amigos que estão discordando sobre algo importante.",
        contexto: 'social',
        options: [
          { 
            text: "'Pessoal, vocês dois têm pontos válidos. Que tal cada um explicar sua perspectiva sem interrupções?'", 
            correct: true, 
            feedback: "Excelente! Mediar conflitos requer neutralidade, reconhecimento de ambas as partes e estabelecimento de regras claras para comunicação respeitosa.",
            estrategia: 'pergunta',
            elementosNaoVerbais: ['gestos apaziguadores', 'tom calmo', 'postura neutra']
          },
          { 
            text: "Tomar o lado de quem você acha que está certo", 
            correct: false, 
            feedback: "Tomar partido pode escalar o conflito. Um mediador eficaz mantém neutralidade e foca em facilitar o entendimento mútuo.",
            estrategia: 'opiniao',
            elementosNaoVerbais: []
          },
          { 
            text: "Mudar de assunto para evitar o conflito", 
            correct: false, 
            feedback: "Evitar o conflito pode deixar questões importantes sem resolução. É melhor facilitar uma discussão construtiva.",
            estrategia: 'observacao',
            elementosNaoVerbais: []
          }
        ]
      },
      {
        situation: "Em uma apresentação pública, um membro da audiência faz uma pergunta desafiadora sobre seu tema.",
        contexto: 'profissional',
        options: [
          { 
            text: "'Obrigado pela pergunta. É um ponto importante que merece uma resposta cuidadosa. [responder] E você, qual sua experiência com isso?'", 
            correct: true, 
            feedback: "Perfeito! Agradecer, reconhecer a importância, responder com cuidado e devolver uma pergunta demonstra profissionalismo e engajamento genuíno.",
            estrategia: 'pergunta',
            elementosNaoVerbais: ['contato visual com audiência', 'gestos explicativos', 'postura confiante']
          },
          { 
            text: "Dar uma resposta rápida e passar para outra pergunta", 
            correct: false, 
            feedback: "Respostas superficiais podem prejudicar sua credibilidade. É melhor abordar perguntas desafiadoras com profundidade e respeito.",
            estrategia: 'opiniao',
            elementosNaoVerbais: []
          },
          { 
            text: "Dizer que a pergunta está fora do escopo da apresentação", 
            correct: false, 
            feedback: "Descartar perguntas pode parecer evasivo. É melhor tentar responder ou explicar construtivamente por que está fora do escopo.",
            estrategia: 'observacao',
            elementosNaoVerbais: []
          }
        ]
      }
    ]
  }
}

export default function ConversationStartersPage() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState<'game' | 'results'>('game')
  const [currentLevel, setCurrentLevel] = useState<number>(1)
  const [currentSituation, setCurrentSituation] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [answered, setAnswered] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const [salvando, setSalvando] = useState(false)
  
  // Estados para métricas científicas
  const [inicioSessao] = useState(new Date())
  const [temposResposta, setTemposResposta] = useState<number[]>([])
  const [inicioSituacao, setInicioSituacao] = useState<Date>(new Date())
  const [estrategiasUsadas, setEstrategiasUsadas] = useState(new Set<string>())
  const [contextosExplorados, setContextosExplorados] = useState(new Set<string>())
  const [elementosNaoVerbais, setElementosNaoVerbais] = useState<string[]>([])
  const [trocasReciprocas, setTrocasReciprocas] = useState(0)
  const [iniciacoesCorretas, setIniciacoesCorretas] = useState(0)
  const [iniciacoesTotais, setIniciacoesTotais] = useState(0)
  
  // Reiniciar quando muda de nível
  useEffect(() => {
    setCurrentSituation(0)
    setScore(0)
    setAnswered(false)
    setSelectedOption(null)
    setShowFeedback(false)
    setInicioSituacao(new Date())
  }, [currentLevel])

  const selectOption = (index: number, option: Option) => {
    if (answered) return
    
    // Calcular tempo de resposta
    const tempoResposta = (new Date().getTime() - inicioSituacao.getTime()) / 1000
    setTemposResposta([...temposResposta, tempoResposta])
    
    setAnswered(true)
    setSelectedOption(index)
    setShowFeedback(true)
    setIniciacoesTotais(iniciacoesTotais + 1)
    
    // Registrar estratégia usada
    setEstrategiasUsadas(prev => new Set(prev).add(option.estrategia))
    
    // Registrar contexto
    const situacao = gameData[currentLevel].situations[currentSituation]
    setContextosExplorados(prev => new Set(prev).add(situacao.contexto))
    
    // Registrar elementos não-verbais
    if (option.elementosNaoVerbais) {
      setElementosNaoVerbais([...elementosNaoVerbais, ...option.elementosNaoVerbais])
    }
    
    if (option.correct) {
      setScore(score + 1)
      setIniciacoesCorretas(iniciacoesCorretas + 1)
      setTrocasReciprocas(trocasReciprocas + 1) // Simula uma troca recíproca bem-sucedida
    }
  }

  const nextSituation = () => {
    const levelData = gameData[currentLevel]
    
    if (currentSituation < levelData.situations.length - 1) {
      setCurrentSituation(currentSituation + 1)
      setAnswered(false)
      setSelectedOption(null)
      setShowFeedback(false)
      setInicioSituacao(new Date())
    } else {
      setCurrentScreen('results')
    }
  }

  const calcularMetricas = () => {
    const duracaoMinutos = (new Date().getTime() - inicioSessao.getTime()) / 60000
    const tempoMedioResposta = temposResposta.length > 0 
      ? (temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length).toFixed(2)
      : '0.00'
    const taxaIniciacao = (iniciacoesTotais / duracaoMinutos).toFixed(2)
    const taxaSucesso = iniciacoesTotais > 0 
      ? ((iniciacoesCorretas / iniciacoesTotais) * 100).toFixed(1)
      : '0.0'
    
    return {
      duracaoMinutos: duracaoMinutos.toFixed(2),
      tempoMedioResposta,
      taxaIniciacao,
      taxaSucesso,
      diversidadeEstrategias: estrategiasUsadas.size,
      contextosVariados: contextosExplorados.size,
      elementosNaoVerbaisTotal: elementosNaoVerbais.length,
      trocasReciprocas
    }
  }

  const handleSaveSession = async () => {
    if (iniciacoesTotais === 0) {
      alert('Complete pelo menos uma situação antes de salvar.')
      return
    }
    
    setSalvando(true)
    
    const metricas = calcularMetricas()
    const fimSessao = new Date()
    
    // Criar pontuação ponderada baseada nas métricas
    const pontuacaoFinal = Math.round(
      (score * 10) + // Acertos valem mais
      (parseFloat(metricas.taxaSucesso) * 0.5) + // Taxa de sucesso
      (metricas.diversidadeEstrategias * 5) + // Diversidade de estratégias
      (metricas.contextosVariados * 3) // Contextos explorados
    )
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Erro ao obter usuário:', userError)
        alert('Erro: Sessão expirada. Por favor, faça login novamente.')
        router.push('/login')
        return
      }
      
      // Salvar métricas detalhadas no campo detalhes (JSON)
      const detalhesMetricas = {
        nivel: currentLevel,
        situacoesCompletadas: currentSituation + 1,
        acertos: score,
        tempoMedioResposta: metricas.tempoMedioResposta,
        taxaIniciacao: metricas.taxaIniciacao,
        taxaSucesso: metricas.taxaSucesso,
        diversidadeEstrategias: metricas.diversidadeEstrategias,
        contextosVariados: metricas.contextosVariados,
        elementosNaoVerbais: metricas.elementosNaoVerbaisTotal,
        trocasReciprocas: metricas.trocasReciprocas
      }
      
      const { data, error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Iniciando Conversas',
          pontuacao_final: pontuacaoFinal,
          data_fim: fimSessao.toISOString(),
          detalhes: detalhesMetricas
        }])

      if (error) {
        console.error('Erro ao salvar:', error)
        alert(`Erro ao salvar: ${error.message}`)
      } else {
        alert(`Sessão salva com sucesso!
        
📊 Resumo das Métricas:
• ${score}/${gameData[currentLevel].situations.length} situações corretas
• Tempo médio de resposta: ${metricas.tempoMedioResposta}s
• Taxa de sucesso: ${metricas.taxaSucesso}%
• ${metricas.diversidadeEstrategias} estratégias diferentes usadas
• ${metricas.contextosVariados} contextos explorados
• Pontuação final: ${pontuacaoFinal} pontos`)
        
        router.push('/profileselection')
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error)
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setSalvando(false)
    }
  }

  const currentLevelData = gameData[currentLevel]
  const currentSituationData = currentLevelData?.situations[currentSituation]
  const progress = currentLevelData ? ((currentSituation + 1) / currentLevelData.situations.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header igual ao CAA */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <Link
            href="/tea"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
          >
            <ChevronLeft size={20} />
            <span className="text-sm sm:text-base">Voltar para TEA</span>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={handleSaveSession}
              disabled={salvando}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:bg-green-400"
            >
              <Save size={20} />
              <span>{salvando ? 'Salvando...' : 'Finalizar e Salvar'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {currentScreen === 'game' && (
          <>
            {/* Card de Informações igual ao CAA */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">💬 Iniciando Conversas</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                  <p className="text-sm text-gray-600">Desenvolver habilidades de iniciação e manutenção de conversas em diferentes contextos sociais.</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Leia a situação apresentada</li>
                    <li>Escolha a melhor forma de iniciar</li>
                    <li>Aprenda com o feedback</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Níveis:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>Nível 1: Conversas básicas</li>
                    <li>Nível 2: Situações intermediárias</li>
                    <li>Nível 3: Interações avançadas</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card de Métricas igual ao CAA */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">📊 Progresso da Sessão</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-800">{iniciacoesTotais}</div>
                  <div className="text-xs text-blue-600">Iniciações Totais</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-800">
                    {iniciacoesTotais > 0 ? ((iniciacoesCorretas / iniciacoesTotais) * 100).toFixed(0) : 0}%
                  </div>
                  <div className="text-xs text-green-600">Taxa de Sucesso</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-800">{estrategiasUsadas.size}</div>
                  <div className="text-xs text-purple-600">Estratégias Usadas</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-800">
                    {temposResposta.length > 0 
                      ? (temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length).toFixed(1)
                      : '0.0'}s
                  </div>
                  <div className="text-xs text-orange-600">Tempo Médio Resposta</div>
                </div>
              </div>
            </div>

            {/* Card da Situação */}
            {currentSituationData && (
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">Nível {currentLevel} - {currentLevelData.title}</span>
                    <span className="text-sm">Situação {currentSituation + 1}/{currentLevelData.situations.length}</span>
                  </div>
                  <div className="bg-white/30 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-400 h-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border-l-4 border-blue-500">
                  <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <MessageSquare size={24} />
                    Situação
                  </h3>
                  <p className="text-blue-700 text-lg leading-relaxed">{currentSituationData.situation}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                      Contexto: {currentSituationData.contexto}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-700 mb-4">💭 Como você iniciaria a conversa?</h3>
                
                <div className="space-y-3">
                  {currentSituationData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => selectOption(index, option)}
                      disabled={answered}
                      className={`
                        w-full text-left p-4 rounded-xl border-2 transition-all
                        ${answered
                          ? option.correct
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : selectedOption === index
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-gray-300 bg-gray-100 text-gray-600'
                          : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl mt-1">
                          {answered && (
                            option.correct ? '✅' : selectedOption === index ? '❌' : '⚪'
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-base">{option.text}</p>
                          {answered && selectedOption === index && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              <span className="text-xs bg-white/50 px-2 py-1 rounded">
                                Estratégia: {option.estrategia}
                              </span>
                              {option.elementosNaoVerbais && option.elementosNaoVerbais.length > 0 && (
                                <span className="text-xs bg-white/50 px-2 py-1 rounded">
                                  Não-verbais: {option.elementosNaoVerbais.join(', ')}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {showFeedback && selectedOption !== null && (
                  <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4">
                    <h4 className="text-lg font-bold text-yellow-800 mb-2">💡 Feedback</h4>
                    <p className="text-yellow-900">{currentSituationData.options[selectedOption].feedback}</p>
                  </div>
                )}

                {answered && (
                  <div className="mt-6 flex justify-center">
                    <button 
                      onClick={nextSituation}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                      {currentSituation < currentLevelData.situations.length - 1 
                        ? 'Próxima Situação →' 
                        : 'Ver Resultados 🎯'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {currentScreen === 'results' && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Parabéns!</h2>
              <p className="text-xl text-gray-600">Você completou o nível {currentLevel}!</p>
            </div>

            {/* Card de Resultados */}
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl mb-8">
              <div className="text-center">
                <div className="text-5xl mb-4">⭐</div>
                <div className="text-2xl font-bold mb-2">
                  Pontuação: {score}/{currentLevelData.situations.length}
                </div>
                <div className="text-lg">
                  {score >= currentLevelData.situations.length * 0.8 ? 'Excelente trabalho!' : 
                   score >= currentLevelData.situations.length * 0.6 ? 'Muito bom! Continue praticando!' : 
                   'Bom trabalho! Pratique mais para melhorar!'}
                </div>
              </div>
            </div>

            {/* Métricas Detalhadas */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-gray-700 mb-4">📊 Métricas de Desempenho</h3>
              {(() => {
                const metricas = calcularMetricas()
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Timer className="text-blue-500" size={20} />
                        <span className="text-sm text-gray-600">Tempo Médio</span>
                      </div>
                      <div className="text-xl font-bold text-gray-800">{metricas.tempoMedioResposta}s</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="text-green-500" size={20} />
                        <span className="text-sm text-gray-600">Taxa Sucesso</span>
                      </div>
                      <div className="text-xl font-bold text-gray-800">{metricas.taxaSucesso}%</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="text-purple-500" size={20} />
                        <span className="text-sm text-gray-600">Estratégias</span>
                      </div>
                      <div className="text-xl font-bold text-gray-800">{metricas.diversidadeEstrategias}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="text-orange-500" size={20} />
                        <span className="text-sm text-gray-600">Contextos</span>
                      </div>
                      <div className="text-xl font-bold text-gray-800">{metricas.contextosVariados}</div>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Dicas baseadas no nível */}
            <div className="bg-blue-50 p-6 rounded-xl mb-8 border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-blue-700 mb-3">💡 Dicas para Aplicar</h3>
              <ul className="text-blue-800 space-y-2">
                {currentLevel === 1 && (
                  <>
                    <li>• Pratique cumprimentos simples diariamente</li>
                    <li>• Observe situações compartilhadas para iniciar conversas</li>
                    <li>• Use elogios sinceros como abridores</li>
                  </>
                )}
                {currentLevel === 2 && (
                  <>
                    <li>• Desenvolva perguntas abertas</li>
                    <li>• Pratique se juntar a grupos educadamente</li>
                    <li>• Trabalhe na escuta ativa</li>
                  </>
                )}
                {currentLevel === 3 && (
                  <>
                    <li>• Refine habilidades de mediação</li>
                    <li>• Pratique networking profissional</li>
                    <li>• Desenvolva argumentação respeitosa</li>
                  </>
                )}
              </ul>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setCurrentLevel(currentLevel === 3 ? 1 : currentLevel + 1)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                {currentLevel === 3 ? 'Voltar ao Nível 1' : `Ir para Nível ${currentLevel + 1}`} →
              </button>
              <button 
                onClick={handleSaveSession}
                disabled={salvando}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:bg-green-400"
              >
                {salvando ? 'Salvando...' : '💾 Salvar e Sair'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
