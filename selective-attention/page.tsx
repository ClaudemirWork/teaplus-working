'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Save, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient'

type Direction = 'up' | 'down' | 'left' | 'right'
type TrialType = 'congruent' | 'incongruent' | 'neutral'

interface Trial {
  target: Direction
  flankers: Direction[]
  type: TrialType
  startTime: number
  responseTime?: number
  correct?: boolean
  responded?: boolean
}

export default function SelectiveAttention() {
  const router = useRouter()
  const supabase = createClient()
  
  // Estados do jogo
  const [nivel, setNivel] = useState(1)
  const [pontuacao, setPontuacao] = useState(0)
  const [jogoIniciado, setJogoIniciado] = useState(false)
  const [exercicioConcluido, setExercicioConcluido] = useState(false)
  const [salvando, setSalvando] = useState(false)
  
  // Estados da tarefa Flanker
  const [trialAtual, setTrialAtual] = useState<Trial | null>(null)
  const [trials, setTrials] = useState<Trial[]>([])
  const [trialIndex, setTrialIndex] = useState(0)
  const [mostrarFeedback, setMostrarFeedback] = useState(false)
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect'>('correct')
  
  // Configurações por nível
  const niveis = {
    1: { totalTrials: 20, tempoLimite: 3000, nome: "Iniciante", proporcaoIncongruente: 0.3 },
    2: { totalTrials: 30, tempoLimite: 2500, nome: "Básico", proporcaoIncongruente: 0.4 },
    3: { totalTrials: 40, tempoLimite: 2000, nome: "Intermediário", proporcaoIncongruente: 0.5 },
    4: { totalTrials: 50, tempoLimite: 1500, nome: "Avançado", proporcaoIncongruente: 0.6 },
    5: { totalTrials: 60, tempoLimite: 1200, nome: "Expert", proporcaoIncongruente: 0.7 }
  }

  // Gerar trials baseado no nível
  const gerarTrials = (nivel: number): Trial[] => {
    const config = niveis[nivel as keyof typeof niveis]
    const novasTrials: Trial[] = []
    const direcoes: Direction[] = ['up', 'down', 'left', 'right']
    
    const numIncongruente = Math.floor(config.totalTrials * config.proporcaoIncongruente)
    const numCongruente = Math.floor((config.totalTrials - numIncongruente) * 0.7)
    const numNeutral = config.totalTrials - numIncongruente - numCongruente
    
    // Criar trials incongruentes
    for (let i = 0; i < numIncongruente; i++) {
      const target = direcoes[Math.floor(Math.random() * direcoes.length)]
      const flankerDirection = direcoes.filter(d => d !== target)[Math.floor(Math.random() * 3)]
      novasTrials.push({
        target,
        flankers: [flankerDirection, flankerDirection, flankerDirection, flankerDirection],
        type: 'incongruent',
        startTime: 0
      })
    }
    
    // Criar trials congruentes
    for (let i = 0; i < numCongruente; i++) {
      const direction = direcoes[Math.floor(Math.random() * direcoes.length)]
      novasTrials.push({
        target: direction,
        flankers: [direction, direction, direction, direction],
        type: 'congruent',
        startTime: 0
      })
    }
    
    // Criar trials neutros (sem flankers direcionais)
    for (let i = 0; i < numNeutral; i++) {
      const target = direcoes[Math.floor(Math.random() * direcoes.length)]
      novasTrials.push({
        target,
        flankers: ['neutral' as Direction, 'neutral' as Direction, 'neutral' as Direction, 'neutral' as Direction],
        type: 'neutral',
        startTime: 0
      })
    }
    
    // Embaralhar
    return novasTrials.sort(() => Math.random() - 0.5)
  }

  // Iniciar exercício
  const iniciarExercicio = () => {
    const novasTrials = gerarTrials(nivel)
    setTrials(novasTrials)
    setTrialIndex(0)
    setPontuacao(0)
    setJogoIniciado(true)
    setExercicioConcluido(false)
    
    // Iniciar primeira trial após delay
    setTimeout(() => {
      if (novasTrials.length > 0) {
        setTrialAtual({ ...novasTrials[0], startTime: Date.now() })
      }
    }, 1000)
  }

  // Processar resposta do usuário
  const handleResponse = (direction: Direction) => {
    if (!trialAtual || trialAtual.responded) return
    
    const responseTime = Date.now() - trialAtual.startTime
    const correct = direction === trialAtual.target
    
    // Atualizar trial com resposta
    const updatedTrial = {
      ...trialAtual,
      responseTime,
      correct,
      responded: true
    }
    
    // Atualizar trials array
    const updatedTrials = [...trials]
    updatedTrials[trialIndex] = updatedTrial
    setTrials(updatedTrials)
    
    // Atualizar pontuação
    if (correct) {
      const bonus = responseTime < 500 ? 20 : responseTime < 1000 ? 15 : 10
      setPontuacao(prev => prev + bonus * nivel)
    }
    
    // Mostrar feedback
    setFeedbackType(correct ? 'correct' : 'incorrect')
    setMostrarFeedback(true)
    
    // Próxima trial após delay
    setTimeout(() => {
      setMostrarFeedback(false)
      proximaTrial()
    }, 500)
  }

  // Avançar para próxima trial
  const proximaTrial = () => {
    const nextIndex = trialIndex + 1
    
    if (nextIndex >= trials.length) {
      finalizarExercicio()
    } else {
      setTrialIndex(nextIndex)
      setTimeout(() => {
        setTrialAtual({ ...trials[nextIndex], startTime: Date.now() })
      }, 500)
    }
  }

  // Timeout para trials sem resposta
  useEffect(() => {
    if (trialAtual && !trialAtual.responded) {
      const config = niveis[nivel as keyof typeof niveis]
      const timeout = setTimeout(() => {
        handleResponse('none' as Direction) // Marca como erro
      }, config.tempoLimite)
      
      return () => clearTimeout(timeout)
    }
  }, [trialAtual])

  // Finalizar exercício
  const finalizarExercicio = () => {
    setJogoIniciado(false)
    setExercicioConcluido(true)
    setTrialAtual(null)
  }

  // Calcular métricas
  const calcularMetricas = () => {
    const trialsRespondidas = trials.filter(t => t.responded)
    const congruentes = trialsRespondidas.filter(t => t.type === 'congruent')
    const incongruentes = trialsRespondidas.filter(t => t.type === 'incongruent')
    
    const acertosTotal = trialsRespondidas.filter(t => t.correct).length
    const acertosCongruentes = congruentes.filter(t => t.correct).length
    const acertosIncongruentes = incongruentes.filter(t => t.correct).length
    
    const rtCongruente = congruentes.length > 0 
      ? Math.round(congruentes.reduce((acc, t) => acc + (t.responseTime || 0), 0) / congruentes.length)
      : 0
    
    const rtIncongruente = incongruentes.length > 0
      ? Math.round(incongruentes.reduce((acc, t) => acc + (t.responseTime || 0), 0) / incongruentes.length)
      : 0
    
    const indiceInterferencia = rtIncongruente - rtCongruente
    const precisaoTotal = trialsRespondidas.length > 0 
      ? Math.round((acertosTotal / trialsRespondidas.length) * 100)
      : 0
    
    return {
      acertosTotal,
      totalTentativas: trialsRespondidas.length,
      acertosCongruentes,
      acertosIncongruentes,
      rtCongruente,
      rtIncongruente,
      indiceInterferencia,
      precisaoTotal
    }
  }

  // Renderizar setas do Flanker
  const renderizarFlanker = () => {
    if (!trialAtual) return null
    
    const getArrow = (direction: Direction | 'neutral') => {
      switch (direction) {
        case 'up': return <ArrowUp size={48} />
        case 'down': return <ArrowDown size={48} />
        case 'left': return <ArrowLeft size={48} />
        case 'right': return <ArrowRight size={48} />
        case 'neutral': return <div className="w-12 h-12 bg-gray-400 rounded" />
        default: return null
      }
    }
    
    return (
      <div className="flex items-center justify-center space-x-4">
        {/* Flankers esquerdos */}
        <div className="text-gray-600">
          {getArrow(trialAtual.flankers[0])}
        </div>
        <div className="text-gray-600">
          {getArrow(trialAtual.flankers[1])}
        </div>
        
        {/* Target central - DESTAQUE */}
        <div className="text-blue-600 border-4 border-blue-400 rounded-lg p-2 bg-blue-50">
          {getArrow(trialAtual.target)}
        </div>
        
        {/* Flankers direitos */}
        <div className="text-gray-600">
          {getArrow(trialAtual.flankers[2])}
        </div>
        <div className="text-gray-600">
          {getArrow(trialAtual.flankers[3])}
        </div>
      </div>
    )
  }

  // Salvamento - IGUAL AO PADRÃO
  const handleSaveSession = async () => {
    setSalvando(true)
    const metricas = calcularMetricas()
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Erro ao obter usuário:', userError)
        alert('Erro: Sessão expirada. Por favor, faça login novamente.')
        router.push('/login')
        return
      }
      
      // Salvar com métricas detalhadas
      const { data, error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Atenção Seletiva',
          pontuacao_final: pontuacao,
          data_fim: new Date().toISOString(),
          detalhes: {
            acertos_congruentes: metricas.acertosCongruentes,
            acertos_incongruentes: metricas.acertosIncongruentes,
            rt_medio_congruente: metricas.rtCongruente,
            rt_medio_incongruente: metricas.rtIncongruente,
            indice_interferencia: metricas.indiceInterferencia,
            tentativas_total: metricas.totalTentativas,
            nivel_completado: nivel
          }
        }])

      if (error) {
        console.error('Erro ao salvar:', error)
        alert(`Erro ao salvar: ${error.message}`)
      } else {
        alert(`Sessão salva com sucesso!
        
📊 Resumo:
• ${metricas.acertosTotal}/${metricas.totalTentativas} acertos (${metricas.precisaoTotal}%)
• Interferência: ${metricas.indiceInterferencia}ms
• Nível ${nivel} completado
• ${pontuacao} pontos`)
        
        router.push('/profileselection')
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error)
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setSalvando(false)
    }
  }

  const voltarInicio = () => {
    setJogoIniciado(false)
    setExercicioConcluido(false)
    setTrialAtual(null)
    setTrials([])
    setTrialIndex(0)
  }

  const proximoNivel = () => {
    if (nivel < 5) {
      setNivel(prev => prev + 1)
      voltarInicio()
    }
  }

  const metricas = calcularMetricas()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header PADRÃO */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <Link 
            href="/tdah" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
          >
            <ChevronLeft size={20} />
            <span className="text-sm sm:text-base">Voltar para TDAH</span>
          </Link>
          
          {exercicioConcluido && (
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
          )}
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {!jogoIniciado && !exercicioConcluido ? (
          // Tela inicial
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">🎯 Atenção Seletiva</h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                  <p className="text-sm text-gray-600">
                    Responda apenas à seta CENTRAL, ignorando as setas ao redor (distratores).
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Foque na seta do MEIO (azul)</li>
                    <li>Use as teclas de seta do teclado</li>
                    <li>Ignore as setas cinzas ao lado</li>
                    <li>Responda o mais rápido possível</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Dica:</h3>
                  <p className="text-sm text-gray-600">
                    Quando as setas apontam para direções diferentes, é mais difícil. Mantenha o foco!
                  </p>
                </div>
              </div>
            </div>

            {/* Seleção de Nível */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(niveis).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setNivel(Number(key))}
                    className={`p-4 rounded-lg font-medium transition-colors ${
                      nivel === Number(key)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-sm">Nível {key}</div>
                    <div className="text-xs opacity-80">{value.nome}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={iniciarExercicio}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                🚀 Iniciar Atividade
              </button>
            </div>
          </div>
        ) : jogoIniciado ? (
          // Área de jogo
          <div className="space-y-6">
            {/* Progresso */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800">📊 Progresso</h3>
                <span className="text-sm text-gray-600">
                  Trial {trialIndex + 1} de {trials.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((trialIndex + 1) / trials.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Área do Flanker */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Responda à direção da seta AZUL (centro)
                </p>
                <p className="text-sm text-gray-500">
                  Use as setas do teclado: ↑ ↓ ← →
                </p>
              </div>

              {/* Display do Flanker */}
              <div className="flex justify-center items-center min-h-[200px] bg-gray-50 rounded-lg">
                {trialAtual && !mostrarFeedback ? (
                  renderizarFlanker()
                ) : mostrarFeedback ? (
                  <div className={`text-4xl font-bold ${feedbackType === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                    {feedbackType === 'correct' ? '✓ Correto!' : '✗ Incorreto'}
                  </div>
                ) : (
                  <div className="text-gray-400">Preparando...</div>
                )}
              </div>

              {/* Botões de resposta para mobile */}
              <div className="grid grid-cols-3 gap-4 mt-8 max-w-xs mx-auto">
                <div />
                <button
                  onClick={() => handleResponse('up')}
                  className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  disabled={!trialAtual || trialAtual.responded}
                >
                  <ArrowUp size={32} className="mx-auto" />
                </button>
                <div />
                
                <button
                  onClick={() => handleResponse('left')}
                  className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  disabled={!trialAtual || trialAtual.responded}
                >
                  <ArrowLeft size={32} className="mx-auto" />
                </button>
                <button
                  onClick={() => handleResponse('down')}
                  className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  disabled={!trialAtual || trialAtual.responded}
                >
                  <ArrowDown size={32} className="mx-auto" />
                </button>
                <button
                  onClick={() => handleResponse('right')}
                  className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  disabled={!trialAtual || trialAtual.responded}
                >
                  <ArrowRight size={32} className="mx-auto" />
                </button>
              </div>
            </div>

            {/* Pontuação atual */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex justify-around text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{pontuacao}</div>
                  <div className="text-sm text-gray-600">Pontos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {trials.filter(t => t.correct).length}/{trialIndex}
                  </div>
                  <div className="text-sm text-gray-600">Acertos</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Tela de resultados
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {metricas.precisaoTotal >= 90 ? '🏆' : metricas.precisaoTotal >= 75 ? '🎉' : '💪'}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {metricas.precisaoTotal >= 90 ? 'Excelente!' : metricas.precisaoTotal >= 75 ? 'Muito bem!' : 'Continue praticando!'}
              </h3>
              
              <p className="text-gray-600">
                Você completou o nível {nivel} com {metricas.precisaoTotal}% de precisão
              </p>
            </div>
            
            {/* Métricas detalhadas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-800">
                  {metricas.acertosTotal}/{metricas.totalTentativas}
                </div>
                <div className="text-xs text-blue-600">Acertos Total</div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-800">{metricas.rtCongruente}ms</div>
                <div className="text-xs text-green-600">Tempo Congruente</div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-purple-800">{metricas.rtIncongruente}ms</div>
                <div className="text-xs text-purple-600">Tempo Incongruente</div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-orange-800">{metricas.indiceInterferencia}ms</div>
                <div className="text-xs text-orange-600">Índice Interferência</div>
              </div>
            </div>
            
            {/* Análise de desempenho */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-blue-800 mb-2">📊 Análise do Desempenho:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Precisão: {metricas.precisaoTotal >= 75 ? '✅ Ótima!' : '⚠️ Precisa melhorar'}</p>
                <p>• Controle de Interferência: {metricas.indiceInterferencia < 200 ? '✅ Excelente' : metricas.indiceInterferencia < 400 ? '⚠️ Moderado' : '🔴 Precisa treinar'}</p>
                <p>• Velocidade: {metricas.rtCongruente < 800 ? '✅ Rápido' : '⚠️ Pode melhorar'}</p>
              </div>
            </div>
            
            {/* Botões de ação */}
            <div className="flex justify-center space-x-4">
              {metricas.precisaoTotal >= 75 && nivel < 5 && (
                <button
                  onClick={proximoNivel}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  🆙 Próximo Nível
                </button>
              )}
              
              <button
                onClick={voltarInicio}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                🔄 Repetir
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
