'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient'

interface Scenario {
  id: number
  situation: string
  options: {
    red: string
    yellow: string
    green: string
  }
  correctAnswer: 'red' | 'yellow' | 'green'
  explanation: string
  difficulty: 'iniciante' | 'intermediário' | 'avançado'
}

// 🧠 CENÁRIOS REFORMULADOS COM BASE CIENTÍFICA 
// (Variabilidade contextual baseada em DBT e Impulse Control research)
const scenarios: Scenario[] = [
  // ===== INICIANTE (2 cenários) =====
  {
    id: 1,
    situation: "Seu amigo está chorando porque perdeu o jogo que estava jogando. Você quer ajudá-lo.",
    options: {
      red: "Ignorar e continuar com suas coisas",
      yellow: "Observar se ele realmente quer ajuda antes de agir", 
      green: "Oferecer um abraço ou palavras de apoio imediatamente"
    },
    correctAnswer: 'green',
    explanation: "VERDE! Quando alguém está triste, oferecer apoio é sempre uma boa ação. Gestos de carinho ajudam quem está sofrendo.",
    difficulty: 'iniciante'
  },
  {
    id: 2,
    situation: "Você errou várias questões na prova e está muito frustrado. Quer desistir de estudar.",
    options: {
      red: "Jogar os materiais longe e parar de estudar",
      yellow: "Parar, respirar fundo e esperar a frustração passar",
      green: "Continuar estudando mesmo frustrado"
    },
    correctAnswer: 'yellow',
    explanation: "AMARELO! Quando muito frustrado, é importante pausar e se acalmar. Estudar com raiva não funciona bem.",
    difficulty: 'iniciante'
  },

  // ===== INTERMEDIÁRIO (2 cenários) =====
  {
    id: 3,
    situation: "Um colega fez um comentário sobre seu cabelo. Você não tem certeza se foi elogio ou crítica.",
    options: {
      red: "Fazer um comentário ruim sobre ele também",
      yellow: "Observar o tom e contexto antes de reagir",
      green: "Agradecer e sorrir, assumindo que foi elogio"
    },
    correctAnswer: 'yellow',
    explanation: "AMARELO! Situações ambíguas precisam de observação. Melhor entender a intenção antes de reagir.",
    difficulty: 'intermediário'
  },
  {
    id: 4,
    situation: "Você vê alguém sendo machucado ou em perigo real. A situação é séria.",
    options: {
      red: "Fingir que não viu para evitar problemas",
      yellow: "Parar para pensar qual a melhor forma de ajudar",
      green: "Agir imediatamente: ajudar ou chamar um adulto"
    },
    correctAnswer: 'green',
    explanation: "VERDE! Em situações de perigo real, agir rapidamente é essencial. A segurança sempre vem primeiro.",
    difficulty: 'intermediário'
  },

  // ===== AVANÇADO (2 cenários) =====
  {
    id: 5,
    situation: "Seus pais disseram 'não' para algo muito importante para você. Você sente uma raiva muito intensa.",
    options: {
      red: "Contar até 10 e sair do ambiente até se acalmar completamente",
      yellow: "Respirar fundo e tentar conversar mesmo sentindo raiva",
      green: "Explicar calmamente por que é importante para você"
    },
    correctAnswer: 'red',
    explanation: "VERMELHO! Raiva muito intensa pode levar a palavras que machucam. Melhor sair e voltar quando estiver calmo.",
    difficulty: 'avançado'
  },
  {
    id: 6,
    situation: "Você recebeu uma crítica sobre seu trabalho. A crítica doeu, mas pode ter pontos válidos.",
    options: {
      red: "Se defender imediatamente e explicar por que está errada",
      yellow: "Processar a informação com calma antes de responder",
      green: "Agradecer e aceitar todos os pontos imediatamente"
    },
    correctAnswer: 'yellow',
    explanation: "AMARELO! Críticas precisam ser processadas com calma. Assim você aproveita o que é útil e ignora o resto.",
    difficulty: 'avançado'
  }
]

export default function JogoSemaforo() {
  const router = useRouter()
  const supabase = createClient()
  
  // 🎯 DETECTOR DE ORIGEM VIA URL
  const [origemSecao, setOrigemSecao] = useState<'TEA' | 'TDAH' | 'TEA_TDAH'>('TEA')
  const [voltarPara, setVoltarPara] = useState('/tea')
  
  // Estados do jogo
  const [currentScenario, setCurrentScenario] = useState(0)
  const [selectedOption, setSelectedOption] = useState<'red' | 'yellow' | 'green' | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState<'iniciante' | 'intermediário' | 'avançado'>('iniciante')
  
  // 🔬 MÉTRICAS CIENTÍFICAS (invisíveis ao usuário)
  const [inicioSessao] = useState(new Date())
  const [salvando, setSalvando] = useState(false)
  const [sequenciaTemporal, setSequenciaTemporal] = useState<any[]>([])
  const [temposReacao, setTemposReacao] = useState<number[]>([])
  const [inicioResposta, setInicioResposta] = useState<Date | null>(null)
  const [tiposResposta, setTiposResposta] = useState<('correto' | 'incorreto' | 'timeout')[]>([])
  const [respostasImpulsivas, setRespostasImpulsivas] = useState(0)
  const [pausasReflexivas, setPausasReflexivas] = useState(0)
  const [variabilidadeContextual, setVariabilidadeContextual] = useState<{green: number, yellow: number, red: number}>({green: 0, yellow: 0, red: 0})
  
  const filteredScenarios = scenarios.filter(s => s.difficulty === currentDifficulty)

  // 🎯 DETECTAR ORIGEM
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const urlParams = new URLSearchParams(window.location.search)
    const origem = urlParams.get('origem') || 'tea'
    
    if (origem.toLowerCase() === 'combined' || origem.toLowerCase() === 'tea_tdah') {
      setOrigemSecao('TEA_TDAH')
      setVoltarPara('/dashboard')
    } else if (origem.toLowerCase() === 'tdah') {
      setOrigemSecao('TDAH')
      setVoltarPara('/tdah')
    } else {
      setOrigemSecao('TEA')
      setVoltarPara('/tea')
    }
  }, [])

  // Timer do jogo
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameStarted && timeLeft > 0 && !showResult && !gameCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && !showResult && inicioResposta) {
      handleAnswer(null, 'timeout')
    }
    return () => clearTimeout(timer)
  }, [timeLeft, gameStarted, showResult, gameCompleted, inicioResposta])

  // Iniciar contagem de tempo de reação
  useEffect(() => {
    if (gameStarted && !showResult && !gameCompleted) {
      setInicioResposta(new Date())
    }
  }, [currentScenario, gameStarted, showResult, gameCompleted])

  const handleAnswer = (option: 'red' | 'yellow' | 'green' | null, tipoResposta: 'manual' | 'timeout' = 'manual') => {
    if (!inicioResposta) return
    
    const fimResposta = new Date()
    const tempoReacao = (fimResposta.getTime() - inicioResposta.getTime()) / 1000
    
    setSelectedOption(option)
    setShowResult(true)
    
    // 🔬 MÉTRICAS CIENTÍFICAS
    const cenarioAtual = filteredScenarios[currentScenario]
    const isCorrect = option === cenarioAtual?.correctAnswer
    const isTimeout = tipoResposta === 'timeout'
    
    let classificacaoResposta: 'correto' | 'incorreto' | 'timeout' = 'incorreto'
    if (isTimeout) {
      classificacaoResposta = 'timeout'
    } else if (isCorrect) {
      classificacaoResposta = 'correto'
      setScore(score + 1)
    }
    
    // Padrões comportamentais baseados em research
    if (tempoReacao < 3) {
      setRespostasImpulsivas(prev => prev + 1)
    } else if (tempoReacao > 10) {
      setPausasReflexivas(prev => prev + 1)
    }
    
    // Variabilidade contextual (DBT-based)
    if (option) {
      setVariabilidadeContextual(prev => ({
        ...prev,
        [option]: prev[option] + 1
      }))
    }
    
    // Registro temporal completo
    setTemposReacao(prev => [...prev, tempoReacao])
    setTiposResposta(prev => [...prev, classificacaoResposta])
    setSequenciaTemporal(prev => [...prev, {
      timestamp: fimResposta,
      cenario_id: cenarioAtual?.id,
      opcao_escolhida: option,
      opcao_correta: cenarioAtual?.correctAnswer,
      tempo_reacao: tempoReacao,
      dificuldade: currentDifficulty,
      correto: isCorrect,
      timeout: isTimeout,
      tipo_comportamental: tempoReacao < 3 ? 'impulsivo' : tempoReacao > 10 ? 'reflexivo' : 'normal',
      contexto_resposta: cenarioAtual?.correctAnswer // Para análise de variabilidade
    }])
  }

  const nextScenario = () => {
    if (currentScenario < filteredScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
      setSelectedOption(null)
      setShowResult(false)
      setTimeLeft(30)
    } else {
      setGameCompleted(true)
    }
  }

  const resetGame = () => {
    setCurrentScenario(0)
    setSelectedOption(null)
    setShowResult(false)
    setScore(0)
    setGameStarted(false)
    setTimeLeft(30)
    setGameCompleted(false)
    // Reset métricas
    setSequenciaTemporal([])
    setTemposReacao([])
    setTiposResposta([])
    setRespostasImpulsivas(0)
    setPausasReflexivas(0)
    setVariabilidadeContextual({green: 0, yellow: 0, red: 0})
  }

  const startGame = () => {
    setGameStarted(true)
    setTimeLeft(30)
  }

  const proximoNivel = () => {
    if (currentDifficulty === 'iniciante') {
      setCurrentDifficulty('intermediário')
    } else if (currentDifficulty === 'intermediário') {
      setCurrentDifficulty('avançado')
    }
    resetGame()
  }

  const getScoreMessage = () => {
    const percentage = (score / filteredScenarios.length) * 100
    if (percentage >= 80) return "🏆 Excelente! Você entende bem quando agir em cada situação!"
    if (percentage >= 60) return "👏 Muito bom! Continue praticando as diferentes respostas!"
    if (percentage >= 40) return "📚 Bom início! Cada situação pede uma resposta diferente!"
    return "💪 Continue tentando! Cada cor do semáforo tem seu momento certo!"
  }

  // 💾 SALVAMENTO COM MÉTRICAS CIENTÍFICAS AVANÇADAS
  const handleSaveSession = async () => {
    if (sequenciaTemporal.length === 0) {
      alert('Nenhuma interação foi registrada para salvar.')
      return
    }
    
    setSalvando(true)
    
    const fimSessao = new Date()
    const duracaoTotalSegundos = Math.round((fimSessao.getTime() - inicioSessao.getTime()) / 1000)
    
    // 🔬 MÉTRICAS AVANÇADAS BASEADAS EM RESEARCH
    const tempoReacaoMedio = temposReacao.length > 0 ? 
      temposReacao.reduce((a, b) => a + b, 0) / temposReacao.length : 0
    
    const taxaAcerto = tiposResposta.length > 0 ? 
      (tiposResposta.filter(t => t === 'correto').length / tiposResposta.length) * 100 : 0
    
    const variabilidadeRT = temposReacao.length > 1 ? 
      Math.sqrt(temposReacao.reduce((sum, rt) => sum + Math.pow(rt - tempoReacaoMedio, 2), 0) / temposReacao.length) : 0
    
    // Índices baseados em Impulse Control research
    const indiceControleInibitorio = sequenciaTemporal.length > 0 ? 
      ((pausasReflexivas / sequenciaTemporal.length) * 100) : 0
    
    const indiceImpulsividade = sequenciaTemporal.length > 0 ? 
      ((respostasImpulsivas / sequenciaTemporal.length) * 100) : 0
    
    // 🎯 VARIABILIDADE CONTEXTUAL (baseado em DBT)
    const totalRespostas = variabilidadeContextual.green + variabilidadeContextual.yellow + variabilidadeContextual.red
    const flexibilidadeContextual = totalRespostas > 0 ? {
      uso_green: (variabilidadeContextual.green / totalRespostas) * 100,
      uso_yellow: (variabilidadeContextual.yellow / totalRespostas) * 100,
      uso_red: (variabilidadeContextual.red / totalRespostas) * 100,
      diversidade_resposta: Object.values(variabilidadeContextual).filter(v => v > 0).length
    } : { uso_green: 0, uso_yellow: 0, uso_red: 0, diversidade_resposta: 0 }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Erro ao obter usuário:', userError)
        alert('Erro: Sessão expirada. Por favor, faça login novamente.')
        router.push('/login')
        return
      }
      
      // 📊 DADOS CIENTÍFICOS PARA SUPABASE
      const observacoesData = {
        origem_secao: origemSecao,
        contexto_atividade: origemSecao === 'TEA' ? 'regulacao_emocional' : 
                            origemSecao === 'TDAH' ? 'controle_inibitorio' : 'habilidades_essenciais',
        nivel_dificuldade: currentDifficulty,
        duracao_sessao_segundos: duracaoTotalSegundos,
        
        // Métricas principais
        tempo_reacao_medio_ms: Math.round(tempoReacaoMedio * 1000),
        variabilidade_rt: Math.round(variabilidadeRT * 1000) / 1000,
        indice_controle_inibitorio: Math.round(indiceControleInibitorio * 10) / 10,
        indice_impulsividade: Math.round(indiceImpulsividade * 10) / 10,
        
        // 🎯 NOVA MÉTRICA: Flexibilidade Contextual (baseada em DBT research)
        flexibilidade_contextual: flexibilidadeContextual,
        variabilidade_resposta_por_cor: variabilidadeContextual,
        
        // Contadores específicos
        total_cenarios: sequenciaTemporal.length,
        respostas_corretas: tiposResposta.filter(t => t === 'correto').length,
        respostas_incorretas: tiposResposta.filter(t => t === 'incorreto').length,
        timeouts: tiposResposta.filter(t => t === 'timeout').length,
        respostas_impulsivas: respostasImpulsivas,
        pausas_reflexivas: pausasReflexivas,
        
        // Histórico temporal completo para análise longitudinal
        sequencia_temporal: sequenciaTemporal,
        tempos_reacao_detalhados: temposReacao,
        
        // Meta-dados para research
        versao_atividade: 'contextual_variability_v2.0',
        base_cientifica: 'DBT_impulse_control_research',
        timestamp_inicio: inicioSessao.toISOString(),
        timestamp_fim: fimSessao.toISOString()
      }
      
      // Salvar na tabela sessoes
      const { data, error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Jogo do Semáforo',
          pontuacao_final: score,
          taxa_acerto: taxaAcerto,
          tempo_reacao_medio: tempoReacaoMedio,
          data_fim: fimSessao.toISOString(),
          observacoes: observacoesData
        }])

      if (error) {
        console.error('Erro ao salvar:', error)
        alert(`Erro ao salvar: ${error.message}`)
      } else {
        alert(`✅ Atividade concluída com sucesso!
        
📊 Seu resumo:
• Acertos: ${Math.round(taxaAcerto)}%
• Tempo médio: ${tempoReacaoMedio.toFixed(2)}s
• Flexibilidade: ${flexibilidadeContextual.diversidade_resposta}/3 tipos de resposta
• Cenários completos: ${sequenciaTemporal.length}`)
        
        router.push('/profileselection')
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error)
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setSalvando(false)
    }
  }

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: 'clamp(16px, 4vw, 24px)',
    marginBottom: 'clamp(16px, 4vw, 24px)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  }

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px)',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'clamp(14px, 3vw, 16px)',
    fontWeight: '600',
    transition: 'all 0.2s'
  }

  const progressStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: 'clamp(20px, 5vw, 32px)'
  }

  const progressBarStyle = {
    height: '100%',
    backgroundColor: '#3b82f6',
    width: `${(currentScenario / filteredScenarios.length) * 100}%`,
    transition: 'width 0.3s ease'
  }

  if (!gameStarted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fef2f2 0%, #fefce8 50%, #f0fdf4 100%)',
        paddingTop: '80px'
      }}>
        {/* Header */}
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
              onClick={() => window.location.href = voltarPara}
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
              background: 'linear-gradient(90deg, #ef4444, #eab308, #22c55e)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>
              🚦
            </div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #dc2626, #ca8a04, #16a34a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Jogo do Semáforo
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(16px, 4vw, 20px)' }}>
          {/* Header Principal */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 6vw, 32px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{ 
                width: 'clamp(40px, 8vw, 48px)', 
                height: 'clamp(40px, 8vw, 48px)', 
                background: 'linear-gradient(90deg, #ef4444, #eab308, #22c55e)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(20px, 5vw, 24px)'
              }}>
                🚦
              </div>
              <h1 style={{ 
                fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', 
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #dc2626, #ca8a04, #16a34a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                Jogo do Semáforo
              </h1>
            </div>
            <p style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', color: '#6b7280', maxWidth: '600px', margin: '0 auto', padding: '0 16px' }}>
              Aprenda a <strong>escolher a melhor resposta</strong> para cada situação
            </p>
          </div>

          {/* Objetivo */}
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'clamp(1rem, 4vw, 1.125rem)' }}>
              🎯 Como Jogar
            </h3>
            <p style={{ color: '#374151', marginBottom: '16px', fontSize: 'clamp(14px, 3vw, 16px)', lineHeight: '1.6' }}>
              Cada situação pede um tipo diferente de resposta. Você vai aprender quando usar cada cor do semáforo!
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '24px', height: '24px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
                  <h4 style={{ color: '#b91c1c', margin: 0, fontSize: 'clamp(14px, 3vw, 16px)' }}>VERMELHO - PARE!</h4>
                </div>
                <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: '#dc2626', margin: 0 }}>Quando precisar parar completamente e se afastar</p>
              </div>
              <div style={{ backgroundColor: '#fefce8', padding: '16px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '24px', height: '24px', backgroundColor: '#eab308', borderRadius: '50%' }}></div>
                  <h4 style={{ color: '#a16207', margin: 0, fontSize: 'clamp(14px, 3vw, 16px)' }}>AMARELO - PENSE!</h4>
                </div>
                <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: '#ca8a04', margin: 0 }}>Quando precisar pausar e pensar antes de agir</p>
              </div>
              <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '24px', height: '24px', backgroundColor: '#22c55e', borderRadius: '50%' }}></div>
                  <h4 style={{ color: '#15803d', margin: 0, fontSize: 'clamp(14px, 3vw, 16px)' }}>VERDE - SIGA!</h4>
                </div>
                <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: '#16a34a', margin: 0 }}>Quando puder agir imediatamente de forma positiva</p>
              </div>
            </div>
          </div>

          {/* Seletor de Dificuldade */}
          <div style={cardStyle}>
            <h3 style={{ marginBottom: '16px', fontSize: 'clamp(1rem, 4vw, 1.125rem)' }}>🎚️ Escolha o Nível</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
              {[
                { level: 'iniciante', desc: '2 situações simples' },
                { level: 'intermediário', desc: '2 situações moderadas' },
                { level: 'avançado', desc: '2 situações complexas' }
              ].map(({ level, desc }) => (
                <button
                  key={level}
                  onClick={() => setCurrentDifficulty(level as any)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: currentDifficulty === level ? '#3b82f6' : 'white',
                    color: currentDifficulty === level ? 'white' : '#374151',
                    border: '1px solid #d1d5db',
                    height: 'auto',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontWeight: '600', textTransform: 'capitalize', fontSize: 'clamp(14px, 3vw, 16px)' }}>{level}</span>
                  <span style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', opacity: 0.75 }}>{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Botão Iniciar */}
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={startGame} 
              style={{
                ...buttonStyle,
                background: 'linear-gradient(90deg, #ef4444, #eab308, #22c55e)',
                fontSize: 'clamp(16px, 4vw, 18px)',
                padding: 'clamp(14px, 3vw, 16px) clamp(24px, 6vw, 32px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ▶️ Iniciar Jogo
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameCompleted) {
    const podeAvancarNivel = (currentDifficulty === 'iniciante' || currentDifficulty === 'intermediário')
    const proximoNome = currentDifficulty === 'iniciante' ? 'Intermediário' : 'Avançado'
    
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fef2f2 0%, #fefce8 50%, #f0fdf4 100%)',
        paddingTop: '80px'
      }}>
        {/* Header com Salvamento */}
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
              onClick={() => window.location.href = voltarPara}
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
              <ChevronLeft size={20} />
              <span>Voltar</span>
            </button>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(90deg, #ef4444, #eab308, #22c55e)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>
              🚦
            </div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #dc2626, #ca8a04, #16a34a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Parabéns!
            </h1>
            <div style={{ marginLeft: 'auto' }}>
              <button 
                onClick={handleSaveSession}
                disabled={salvando}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: salvando ? 'not-allowed' : 'pointer',
                  opacity: salvando ? 0.6 : 1
                }}
              >
                <Save size={16} />
                <span>{salvando ? 'Salvando...' : 'Finalizar e Salvar'}</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'clamp(16px, 4vw, 20px)' }}>
          <div style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'clamp(40px, 10vw, 48px)' }}>🏆</span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)', margin: 0 }}>Nível {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)} Concluído!</h2>
            </div>
            
            <div style={{ fontSize: 'clamp(3rem, 10vw, 4rem)', fontWeight: 'bold', color: '#16a34a', marginBottom: '16px' }}>
              {score}/{filteredScenarios.length}
            </div>
            <p style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', marginBottom: '24px' }}>{getScoreMessage()}</p>
            
            {/* Resumo da Performance */}
            <div style={{ backgroundColor: '#f8fafc', padding: 'clamp(16px, 4vw, 24px)', borderRadius: '8px', marginBottom: '24px' }}>
              <h3 style={{ color: '#1e40af', marginBottom: '12px', fontSize: 'clamp(1rem, 4vw, 1.125rem)' }}>📊 Seu Resumo</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {temposReacao.length > 0 ? (temposReacao.reduce((a, b) => a + b, 0) / temposReacao.length).toFixed(1) : '0'}s
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Tempo Médio</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>
                    {Object.values(variabilidadeContextual).filter(v => v > 0).length}/3
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Tipos Usados</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {Math.round((pausasReflexivas / (sequenciaTemporal.length || 1)) * 100)}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Reflexão</div>
                </div>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#eff6ff', padding: 'clamp(16px, 4vw, 24px)', borderRadius: '8px', marginBottom: '24px' }}>
              <h3 style={{ color: '#1e40af', marginBottom: '12px', fontSize: 'clamp(1rem, 4vw, 1.125rem)' }}>🧠 Lembre-se</h3>
              <p style={{ color: '#1e40af', marginBottom: '12px', fontSize: 'clamp(14px, 3vw, 16px)', lineHeight: '1.6' }}>
                Cada situação é única e pede uma resposta diferente. Continue praticando no seu dia a dia:
              </p>
              <ul style={{ textAlign: 'left', color: '#1e40af', margin: 0, paddingLeft: '20px', fontSize: 'clamp(14px, 3vw, 16px)' }}>
                <li>🔴 <strong>Vermelho:</strong> Quando sentir muita raiva, é melhor se afastar</li>
                <li>🟡 <strong>Amarelo:</strong> Quando não souber como reagir, pause e pense</li>
                <li>🟢 <strong>Verde:</strong> Quando puder ajudar alguém, aja com confiança</li>
              </ul>
            </div>

            {/* Botões de Progressão */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={resetGame} 
                style={{ ...buttonStyle, backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db' }}
              >
                🔄 Jogar Novamente
              </button>
              
              {podeAvancarNivel && (
                <button 
                  onClick={proximoNivel}
                  style={{
                    ...buttonStyle,
                    background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
                    fontSize: 'clamp(14px, 3vw, 16px)'
                  }}
                >
                  🎯 Nível {proximoNome}
                </button>
              )}
              
              {!podeAvancarNivel && (
                <button 
                  onClick={handleSaveSession}
                  disabled={salvando}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#22c55e',
                    opacity: salvando ? 0.6 : 1,
                    cursor: salvando ? 'not-allowed' : 'pointer'
                  }}
                >
                  {salvando ? '💾 Salvando...' : '🏆 Finalizar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const scenario = filteredScenarios[currentScenario]

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fef2f2 0%, #fefce8 50%, #f0fdf4 100%)',
      paddingTop: '80px'
    }}>
      {/* Header do Jogo */}
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
            onClick={() => window.location.href = voltarPara}
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
            background: 'linear-gradient(90deg, #ef4444, #eab308, #22c55e)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>
            🚦
          </div>
          <h1 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #dc2626, #ca8a04, #16a34a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Jogo do Semáforo
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: 'clamp(16px, 4vw, 20px)' }}>
        {/* Header do Jogo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: 'clamp(20px, 5vw, 24px)', 
          flexWrap: 'wrap', 
          gap: '16px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: 'clamp(32px, 6vw, 40px)', 
              height: 'clamp(32px, 6vw, 40px)', 
              background: 'linear-gradient(90deg, #ef4444, #eab308, #22c55e)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(16px, 4vw, 20px)'
            }}>
              🚦
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 'bold', margin: 0 }}>Jogo do Semáforo</h1>
              <p style={{ color: '#6b7280', margin: 0, fontSize: 'clamp(12px, 3vw, 14px)' }}>Situação {currentScenario + 1} de {filteredScenarios.length} - Nível {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: 'white', 
              padding: '8px 12px', 
              borderRadius: '8px', 
              border: '1px solid #d1d5db' 
            }}>
              <span style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>⏱️</span>
              <span style={{ fontFamily: 'monospace', fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: 'bold' }}>{timeLeft}s</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: '#6b7280', margin: 0 }}>Pontuação</p>
              <p style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', fontWeight: 'bold', margin: 0 }}>{score}/{filteredScenarios.length}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={progressStyle}>
          <div style={progressBarStyle}></div>
        </div>

        {/* Cenário */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '16px', fontSize: 'clamp(1rem, 4vw, 1.125rem)', color: '#374151' }}>🎭 Situação</h3>
          <p style={{ fontSize: 'clamp(1rem, 4vw, 1.125rem)', lineHeight: '1.6', color: '#374151' }}>{scenario.situation}</p>
        </div>

        {/* Opções */}
        <div style={{ marginBottom: 'clamp(24px, 6vw, 32px)' }}>
          <h3 style={{ fontSize: 'clamp(1rem, 4vw, 1.125rem)', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Como você reagiria?</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {([
              { color: 'red', bg: '#fef2f2', border: '#fecaca', textColor: '#7f1d1d' },
              { color: 'yellow', bg: '#fefce8', border: '#fde68a', textColor: '#78350f' },
              { color: 'green', bg: '#f0fdf4', border: '#bbf7d0', textColor: '#14532d' }
            ] as const).map(({ color, bg, border, textColor }) => (
              <div
                key={color}
                onClick={() => !showResult && handleAnswer(color as any)}
                style={{
                  backgroundColor: bg,
                  border: `2px solid ${border}`,
                  borderRadius: '8px',
                  padding: 'clamp(12px, 3vw, 16px)',
                  cursor: showResult ? 'not-allowed' : 'pointer',
                  opacity: showResult ? 0.75 : 1,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  if (!showResult) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showResult) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                <div style={{ 
                  width: 'clamp(20px, 4vw, 24px)', 
                  height: 'clamp(20px, 4vw, 24px)', 
                  backgroundColor: color === 'red' ? '#ef4444' : color === 'yellow' ? '#eab308' : '#22c55e',
                  borderRadius: '50%',
                  flexShrink: 0
                }}></div>
                <p style={{ flex: 1, margin: 0, color: textColor, fontSize: 'clamp(14px, 3vw, 16px)', lineHeight: '1.5' }}>
                  {scenario.options[color as keyof typeof scenario.options]}
                </p>
                {showResult && selectedOption === color && (
                  <span style={{
                    backgroundColor: color === scenario.correctAnswer ? '#22c55e' : '#ef4444',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    fontWeight: 'bold'
                  }}>
                    {color === scenario.correctAnswer ? '✓' : '✗'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resultado */}
        {showResult && (
          <div style={{ ...cardStyle, borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ color: '#1e40af', marginBottom: '16px', fontSize: 'clamp(1rem, 4vw, 1.125rem)' }}>
              {selectedOption === scenario.correctAnswer ? '🎉 Muito bem!' : '💭 Vamos aprender'}
            </h3>
            <p style={{ marginBottom: '16px', lineHeight: '1.6', fontSize: 'clamp(14px, 3vw, 16px)', color: '#374151' }}>{scenario.explanation}</p>
            <button 
              onClick={nextScenario} 
              style={{ ...buttonStyle, width: '100%' }}
            >
              {currentScenario < filteredScenarios.length - 1 ? 'Próxima Situação' : 'Ver Resultado Final'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
