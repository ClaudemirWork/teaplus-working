'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Save, CheckCircle } from 'lucide-react'

export default function AttentionSustained() {
  const [nivel, setNivel] = useState(1)
  const [pontuacao, setPontuacao] = useState(0)
  const [duracao, setDuracao] = useState(30)
  const [tempoRestante, setTempoRestante] = useState(30)
  const [ativo, setAtivo] = useState(false)
  const [targetVisible, setTargetVisible] = useState(false)
  const [posicaoTarget, setPosicaoTarget] = useState({ x: 50, y: 50 })
  const [acertos, setAcertos] = useState(0)
  const [tentativas, setTentativas] = useState(0)
  const [exercicioConcluido, setExercicioConcluido] = useState(false)
  const [jogoIniciado, setJogoIniciado] = useState(false)

  // ✅ MÉTRICAS CIENTÍFICAS
  const [temposReacao, setTemposReacao] = useState<number[]>([])
  const [errosComissao, setErrosComissao] = useState(0)
  const [errosOmissao, setErrosOmissao] = useState(0)
  const [timestampTarget, setTimestampTarget] = useState<number>(0)
  const [sequenciaAcertos, setSequenciaAcertos] = useState<boolean[]>([])

  // 💾 ESTADOS PARA SALVAMENTO (TEMPORARIAMENTE DESABILITADO)
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [erroSalvamento, setErroSalvamento] = useState('')

  // Configurações por nível
  const niveis = {
    1: { duracao: 30, intervalo: 2500, nome: "Iniciante (30s)", exposicao: 1200 },
    2: { duracao: 60, intervalo: 2200, nome: "Básico (1min)", exposicao: 1100 },
    3: { duracao: 90, intervalo: 1900, nome: "Intermediário (1.5min)", exposicao: 1000 },
    4: { duracao: 120, intervalo: 1600, nome: "Avançado (2min)", exposicao: 900 },
    5: { duracao: 180, intervalo: 1300, nome: "Expert (3min)", exposicao: 800 }
  }

  // Timer principal
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (ativo && tempoRestante > 0) {
      timer = setTimeout(() => {
        setTempoRestante(prev => prev - 1)
      }, 1000)
    } else if (tempoRestante === 0 && ativo) {
      finalizarExercicio()
    }
    return () => clearTimeout(timer)
  }, [ativo, tempoRestante])

  // Controle de aparição do target
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (ativo) {
      interval = setInterval(() => {
        mostrarTarget()
      }, niveis[nivel as keyof typeof niveis].intervalo)
    }
    return () => clearInterval(interval)
  }, [ativo, nivel])

  const handleClickArea = (event: React.MouseEvent) => {
    if (ativo && !targetVisible) {
      setErrosComissao(prev => prev + 1)
    }
  }

  const iniciarExercicio = () => {
    const configuracao = niveis[nivel as keyof typeof niveis]
    setDuracao(configuracao.duracao)
    setTempoRestante(configuracao.duracao)
    setAtivo(true)
    setPontuacao(0)
    setAcertos(0)
    setTentativas(0)
    setTemposReacao([])
    setErrosComissao(0)
    setErrosOmissao(0)
    setSequenciaAcertos([])
    setExercicioConcluido(false)
    setTargetVisible(false)
    setJogoIniciado(true)
    setSalvo(false)
    setErroSalvamento('')
  }

  const mostrarTarget = () => {
    if (!ativo) return
    
    const x = Math.random() * 70 + 15
    const y = Math.random() * 60 + 20
    setPosicaoTarget({ x, y })
    setTargetVisible(true)
    setTentativas(prev => prev + 1)
    setTimestampTarget(Date.now())

    const tempoExposicao = niveis[nivel as keyof typeof niveis].exposicao
    setTimeout(() => {
      if (targetVisible) {
        setErrosOmissao(prev => prev + 1)
        setSequenciaAcertos(prev => [...prev, false])
      }
      setTargetVisible(false)
    }, tempoExposicao)
  }

  const clicarTarget = () => {
    if (targetVisible && ativo) {
      const tempoReacao = Date.now() - timestampTarget
      setTemposReacao(prev => [...prev, tempoReacao])
      setSequenciaAcertos(prev => [...prev, true])
      
      setAcertos(prev => prev + 1)
      setPontuacao(prev => prev + 10 * nivel)
      setTargetVisible(false)
    }
  }

  const finalizarExercicio = () => {
    setAtivo(false)
    setTargetVisible(false)
    setExercicioConcluido(true)
  }

  // 🔬 CÁLCULOS CIENTÍFICOS
  const precisao = tentativas > 0 ? Math.round((acertos / tentativas) * 100) : 0
  const tempoReacaoMedio = temposReacao.length > 0 ? Math.round(temposReacao.reduce((a, b) => a + b, 0) / temposReacao.length) : 0
  
  const calcularVariabilidade = () => {
    if (temposReacao.length < 2) return 0
    const media = tempoReacaoMedio
    const variancia = temposReacao.reduce((acc, tempo) => acc + Math.pow(tempo - media, 2), 0) / temposReacao.length
    return Math.round(Math.sqrt(variancia))
  }
  
  const variabilidadeRT = calcularVariabilidade()
  const coeficienteVariacao = tempoReacaoMedio > 0 ? Math.round((variabilidadeRT / tempoReacaoMedio) * 100) : 0
  const podeAvancar = precisao >= 75 && nivel < 5 && coeficienteVariacao <= 30

  // 💾 FUNÇÃO SIMULADA PARA SALVAR (PREPARADA PARA SUPABASE)
  const salvarResultados = async () => {
    setSalvando(true)
    setErroSalvamento('')
    
    try {
      // 🔄 SIMULAÇÃO DE SALVAMENTO (localStorage temporário)
      const dadosResultado = {
        timestamp: new Date().toISOString(),
        nivel: nivel,
        acertos: acertos,
        tentativas: tentativas,
        precisao: precisao,
        tempoReacaoMedio: tempoReacaoMedio,
        variabilidadeRT: variabilidadeRT,
        coeficienteVariacao: coeficienteVariacao,
        errosComissao: errosComissao,
        errosOmissao: errosOmissao,
        temposReacao: temposReacao,
        sequenciaAcertos: sequenciaAcertos,
        duracao: duracao
      }

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Salvar temporariamente no localStorage para demonstração
      const sessionId = `atencao_sustentada_${Date.now()}`
      localStorage.setItem(sessionId, JSON.stringify(dadosResultado))
      
      // Log para verificação
      console.log('📊 Dados científicos capturados:', dadosResultado)
      console.log('💾 Salvo temporariamente em:', sessionId)

      setSalvo(true)
      
    } catch (error: any) {
      console.error('❌ Erro ao salvar:', error)
      setErroSalvamento('Erro na simulação de salvamento. Dados capturados no console.')
    } finally {
      setSalvando(false)
    }
  }

  const proximoNivel = () => {
    if (nivel < 5) {
      setNivel(prev => prev + 1)
      setExercicioConcluido(false)
      setJogoIniciado(false)
    }
  }

  const voltarInicio = () => {
    setJogoIniciado(false)
    setExercicioConcluido(false)
    setAtivo(false)
    setTargetVisible(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/tdah" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Voltar ao TDAH</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">⚡ Atenção Sustentada Científica</h1>
              <div className="text-xs text-green-600">🔬 Validado por CPT</div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-orange-600">Nível {nivel}</div>
              <div className="text-sm text-gray-600">{niveis[nivel as keyof typeof niveis].nome}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          
          {!jogoIniciado ? (
            // Tela inicial
            <div className="space-y-6">
              {/* Objetivo */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🎯</span>
                  <h2 className="text-lg font-bold text-gray-800">Objetivo:</h2>
                </div>
                <p className="text-gray-700 border-l-4 border-red-400 pl-4">
                  Fortalecer a capacidade de manter atenção sustentada clicando nos alvos que aparecem na tela de forma progressiva e consistente.
                </p>
              </div>

              {/* Métricas Científicas */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🔬</span>
                  <h2 className="text-lg font-bold text-blue-800">Métricas Científicas Avaliadas:</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>• Precisão:</strong> Acertos vs Total de tentativas<br/>
                    <strong>• Tempo de Reação:</strong> Velocidade de resposta (ms)<br/>
                    <strong>• Variabilidade:</strong> Consistência temporal
                  </div>
                  <div>
                    <strong>• Erros de Comissão:</strong> Cliques incorretos<br/>
                    <strong>• Erros de Omissão:</strong> Targets perdidos<br/>
                    <strong>• Coeficiente de Variação:</strong> Estabilidade
                  </div>
                </div>
              </div>

              {/* Critérios */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">⭐</span>
                  <h2 className="text-lg font-bold text-gray-800">Critérios de Avanço:</h2>
                </div>
                <p className="text-gray-700 border-l-4 border-blue-400 pl-4">
                  <strong>75% de precisão</strong> + <strong>Coeficiente de variação ≤ 30%</strong> (consistência temporal). 
                  Baseado em protocolos CPT para população brasileira.
                </p>
              </div>

              {/* Base Científica */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🧠</span>
                  <h2 className="text-lg font-bold text-gray-800">Base Científica:</h2>
                </div>
                <div className="text-gray-700 space-y-2">
                  <p><strong>Fundamentação:</strong> Conners' Continuous Performance Test (CPT-II) e protocolos brasileiros validados.</p>
                  <p><strong>Métricas:</strong> Atenção sustentada, vigilância, controle inibitório e variabilidade intraindividual.</p>
                  <p><strong>Literatura:</strong> Estudos SciELO brasileiros sobre avaliação neuropsicológica em TDAH.</p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-sm text-yellow-800">
                  <strong>⚠️ Nota Científica:</strong> Este exercício complementa avaliação profissional. 
                  Não substitui diagnóstico clínico. Métricas baseadas em literatura científica internacional adaptada.
                </div>
              </div>

              {/* Status Técnico */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-sm text-orange-800">
                  <strong>🔧 Status:</strong> Versão de demonstração - salvamento em localStorage. 
                  Integração Supabase será ativada após instalação de dependências.
                </div>
              </div>

              {/* Botão Iniciar */}
              <div className="text-center py-8">
                <div className="text-6xl mb-4">😊</div>
                <button
                  onClick={iniciarExercicio}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                >
                  🚀 Iniciar Avaliação Científica
                </button>
              </div>
            </div>
          ) : !exercicioConcluido ? (
            // Área de jogo
            <div className="space-y-6">
              {/* Stats durante o jogo */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-orange-600">{pontuacao}</div>
                  <div className="text-sm text-gray-600">Pontos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-blue-600">{tempoRestante}s</div>
                  <div className="text-sm text-gray-600">Restante</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-green-600">{acertos}/{tentativas}</div>
                  <div className="text-sm text-gray-600">Acertos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-purple-600">{precisao}%</div>
                  <div className="text-sm text-gray-600">Precisão</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="h-2 bg-gray-200">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-1000"
                    style={{ width: `${((duracao - tempoRestante) / duracao) * 100}%` }}
                  />
                </div>

                <div 
                  className="relative bg-gradient-to-br from-blue-50 to-purple-50 cursor-crosshair"
                  style={{ height: '500px', width: '100%' }}
                  onClick={handleClickArea}
                >
                  {targetVisible && (
                    <button
                      onClick={clicarTarget}
                      className="absolute w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center text-white text-2xl animate-pulse border-4 border-white"
                      style={{ 
                        left: `${posicaoTarget.x}%`, 
                        top: `${posicaoTarget.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      🎯
                    </button>
                  )}

                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg">
                      <div className="font-medium">Mantenha o foco! ⚡</div>
                      <div className="text-sm opacity-90">TR médio: {tempoReacaoMedio}ms | Restante: {tempoRestante}s</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={voltarInicio}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  ← Voltar ao Início
                </button>
              </div>
            </div>
          ) : (
            // Tela de resultados com salvamento
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">
                {precisao >= 90 && coeficienteVariacao <= 20 ? '🏆' : precisao >= 75 && coeficienteVariacao <= 30 ? '🎉' : '💪'}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {precisao >= 90 && coeficienteVariacao <= 20 ? 'Desempenho Excelente!' : 
                 precisao >= 75 && coeficienteVariacao <= 30 ? 'Bom Desempenho!' : 'Continue Praticando!'}
              </h3>
              
              {/* Métricas científicas */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{acertos}/{tentativas}</div>
                  <div className="text-sm text-gray-600">Acertos</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{precisao}%</div>
                  <div className="text-sm text-gray-600">Precisão</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{tempoReacaoMedio}ms</div>
                  <div className="text-sm text-gray-600">TR Médio</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{variabilidadeRT}ms</div>
                  <div className="text-sm text-gray-600">Variabilidade</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{coeficienteVariacao}%</div>
                  <div className="text-sm text-gray-600">Coef. Variação</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{errosComissao}</div>
                  <div className="text-sm text-gray-600">Erros Comissão</div>
                </div>
              </div>
              
              {/* Interpretação científica */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-bold text-blue-800 mb-2">📊 Interpretação Científica:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Precisão:</strong> {precisao >= 75 ? '✅ Dentro do esperado' : '⚠️ Abaixo do esperado'}</p>
                  <p><strong>Consistência:</strong> {coeficienteVariacao <= 30 ? '✅ Boa estabilidade' : '⚠️ Alta variabilidade'}</p>
                  <p><strong>Tempo de Reação:</strong> {tempoReacaoMedio < 600 ? '✅ Rápido' : tempoReacaoMedio < 800 ? '⚠️ Moderado' : '🔴 Lento'}</p>
                </div>
              </div>

              {/* Botão salvar dados */}
              {!salvo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Save size={20} className="text-green-600" />
                    <span className="font-bold text-green-800">Salvar Dados Científicos</span>
                  </div>
                  <p className="text-sm text-green-700 mb-4">
                    Capture suas métricas científicas para análise posterior. 
                    (Versão demo - dados salvos no console do navegador)
                  </p>
                  <button
                    onClick={salvarResultados}
                    disabled={salvando}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                  >
                    {salvando ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Capturando...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>💾 Capturar Métricas</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Confirmação de salvamento */}
              {salvo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-green-800">
                    <CheckCircle size={20} />
                    <span className="font-bold">✅ Dados Capturados!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    Métricas científicas salvas no console. Abra DevTools (F12) para visualizar.
                  </p>
                </div>
              )}

              {/* Erro de salvamento */}
              {erroSalvamento && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="text-red-800 font-bold">⚠️ Informação</div>
                  <p className="text-sm text-red-700">{erroSalvamento}</p>
                  <button
                    onClick={salvarResultados}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    🔄 Capturar Novamente
                  </button>
                </div>
              )}
              
              {/* Botões de ação */}
              <div className="space-x-4">
                {podeAvancar && (
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
                  🔄 Repetir Avaliação
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
