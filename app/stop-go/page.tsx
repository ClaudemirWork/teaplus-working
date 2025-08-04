'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function StopGo() {
  const [nivel, setNivel] = useState(1)
  const [pontuacao, setPontuacao] = useState(0)
  const [duracao, setDuracao] = useState(60) // segundos
  const [tempoRestante, setTempoRestante] = useState(60)
  const [ativo, setAtivo] = useState(false)
  const [botaoVisivel, setBotaoVisivel] = useState(false)
  const [tipoSinal, setTipoSinal] = useState<'go' | 'stop'>('go')
  const [tempoAparicao, setTempoAparicao] = useState(0)
  const [acertosGo, setAcertosGo] = useState(0)
  const [acertosStop, setAcertosStop] = useState(0)
  const [errosGo, setErrosGo] = useState(0)
  const [errosStop, setErrosStop] = useState(0)
  const [tentativasGo, setTentativasGo] = useState(0)
  const [tentativasStop, setTentativasStop] = useState(0)
  const [temposReacao, setTemposReacao] = useState<number[]>([])
  const [exercicioConcluido, setExercicioConcluido] = useState(false)
  const [jogoIniciado, setJogoIniciado] = useState(false)

  // Configurações por nível
  const niveis = {
    1: { duracao: 60, intervaloMin: 2000, intervaloMax: 4000, probStop: 0.3, nome: "Iniciante (1min)" },
    2: { duracao: 75, intervaloMin: 1800, intervaloMax: 3500, probStop: 0.35, nome: "Básico (1.25min)" },
    3: { duracao: 90, intervaloMin: 1500, intervaloMax: 3000, probStop: 0.4, nome: "Intermediário (1.5min)" },
    4: { duracao: 105, intervaloMin: 1200, intervaloMax: 2500, probStop: 0.45, nome: "Avançado (1.75min)" },
    5: { duracao: 120, intervaloMin: 1000, intervaloMax: 2000, probStop: 0.5, nome: "Expert (2min)" }
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

  // Controle de aparição de sinais
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (ativo) {
      const config = niveis[nivel as keyof typeof niveis]
      const intervalo = Math.random() * (config.intervaloMax - config.intervaloMin) + config.intervaloMin
      
      timeout = setTimeout(() => {
        mostrarSinal()
      }, intervalo)
    }
    return () => clearTimeout(timeout)
  }, [ativo, botaoVisivel])

  const iniciarExercicio = () => {
    const configuracao = niveis[nivel as keyof typeof niveis]
    setDuracao(configuracao.duracao)
    setTempoRestante(configuracao.duracao)
    setAtivo(true)
    setPontuacao(0)
    setAcertosGo(0)
    setAcertosStop(0)
    setErrosGo(0)
    setErrosStop(0)
    setTentativasGo(0)
    setTentativasStop(0)
    setTemposReacao([])
    setExercicioConcluido(false)
    setBotaoVisivel(false)
    setJogoIniciado(true)
  }

  const mostrarSinal = () => {
    if (!ativo) return
    
    const config = niveis[nivel as keyof typeof niveis]
    const isStop = Math.random() < config.probStop
    
    setTipoSinal(isStop ? 'stop' : 'go')
    setBotaoVisivel(true)
    setTempoAparicao(Date.now())
    
    if (isStop) {
      setTentativasStop(prev => prev + 1)
    } else {
      setTentativasGo(prev => prev + 1)
    }
    
    // Esconder após tempo limite
    setTimeout(() => {
      if (botaoVisivel) {
        // Se não clicou em GO, conta como erro
        if (tipoSinal === 'go') {
          setErrosGo(prev => prev + 1)
          setPontuacao(prev => Math.max(0, prev - 5))
        } else {
          // Se não clicou em STOP, conta como acerto
          setAcertosStop(prev => prev + 1)
          setPontuacao(prev => prev + 15 * nivel)
        }
        setBotaoVisivel(false)
      }
    }, 1500)
  }

  const clicarBotao = () => {
    if (!botaoVisivel || !ativo) return
    
    const tempoReacao = Date.now() - tempoAparicao
    
    if (tipoSinal === 'go') {
      // Clicou corretamente no GO
      setAcertosGo(prev => prev + 1)
      setTemposReacao(prev => [...prev, tempoReacao])
      
      // Pontuação baseada na velocidade
      let pontos = 20 * nivel
      if (tempoReacao < 300) pontos += 10 // Bônus por velocidade
      else if (tempoReacao > 800) pontos -= 5 // Penalidade por lentidão
      
      setPontuacao(prev => prev + pontos)
    } else {
      // Clicou incorretamente no STOP
      setErrosStop(prev => prev + 1)
      setPontuacao(prev => Math.max(0, prev - 10))
    }
    
    setBotaoVisivel(false)
  }

  const finalizarExercicio = () => {
    setAtivo(false)
    setBotaoVisivel(false)
    setExercicioConcluido(true)
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
    setBotaoVisivel(false)
  }

  const totalTentativas = tentativasGo + tentativasStop
  const totalAcertos = acertosGo + acertosStop
  const precisao = totalTentativas > 0 ? Math.round((totalAcertos / totalTentativas) * 100) : 0
  const precisaoGo = tentativasGo > 0 ? Math.round((acertosGo / tentativasGo) * 100) : 0
  const precisaoStop = tentativasStop > 0 ? Math.round((acertosStop / tentativasStop) * 100) : 0
  const tempoMedio = temposReacao.length > 0 ? Math.round(temposReacao.reduce((a, b) => a + b, 0) / temposReacao.length) : 0
  const podeAvancar = precisao >= 75 && nivel < 5

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
              <h1 className="text-xl font-bold text-gray-800">🚦 Stop-Go</h1>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-red-600">Nível {nivel}</div>
              <div className="text-sm text-gray-600">{niveis[nivel as keyof typeof niveis].nome}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          
          {!jogoIniciado ? (
            // Tela de informações inicial
            <div className="space-y-6">
              {/* Objetivo */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🎯</span>
                  <h2 className="text-lg font-bold text-gray-800">Objetivo:</h2>
                </div>
                <p className="text-gray-700 border-l-4 border-red-400 pl-4">
                  Desenvolver controle inibitório e flexibilidade cognitiva reagindo rapidamente ao verde (GO) e resistindo ao impulso no vermelho (STOP).
                </p>
              </div>

              {/* Pontuação */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">⭐</span>
                  <h2 className="text-lg font-bold text-gray-800">Pontuação:</h2>
                </div>
                <p className="text-gray-700 border-l-4 border-blue-400 pl-4">
                  GO correto = +20 pontos × nível (+10 bônus se rápido). STOP correto = +15 pontos × nível. Erros = -5 a -10 pontos. 75% de precisão para avançar.
                </p>
              </div>

              {/* Níveis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">📊</span>
                  <h2 className="text-lg font-bold text-gray-800">Níveis:</h2>
                </div>
                <div className="border-l-4 border-purple-400 pl-4 space-y-1">
                  <p className="text-gray-700"><strong>Nível 1:</strong> Iniciante (30% STOP, intervalos 2-4s, 1min)</p>
                  <p className="text-gray-700"><strong>Nível 2:</strong> Básico (35% STOP, intervalos 1.8-3.5s, 1.25min)</p>
                  <p className="text-gray-700"><strong>Nível 3:</strong> Intermediário (40% STOP, intervalos 1.5-3s, 1.5min)</p>
                  <p className="text-gray-700"><strong>Nível 4:</strong> Avançado (45% STOP, intervalos 1.2-2.5s, 1.75min)</p>
                  <p className="text-gray-700"><strong>Nível 5:</strong> Expert (50% STOP, intervalos 1-2s, 2min)</p>
                </div>
              </div>

              {/* Final */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🏆</span>
                  <h2 className="text-lg font-bold text-gray-800">Final:</h2>
                </div>
                <p className="text-gray-700 border-l-4 border-green-400 pl-4">
                  Complete o Nível 5 com 75% de precisão para finalizar o exercício e fortalecer seu controle inibitório.
                </p>
              </div>

              {/* Base Científica */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🧠</span>
                  <h2 className="text-lg font-bold text-gray-800">Base Científica:</h2>
                </div>
                <p className="text-gray-700">
                  Este exercício é baseado no paradigma Stop-Signal da neuropsicologia, fundamental para treinar controle inibitório e funções executivas em pessoas com TDAH.
                </p>
              </div>

              {/* Instruções */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">📖</span>
                  <h2 className="text-lg font-bold text-gray-800">Como Jogar:</h2>
                </div>
                <div className="border-l-4 border-indigo-400 pl-4 space-y-2">
                  <p className="text-gray-700">🟢 <strong>VERDE (GO):</strong> Clique rapidamente!</p>
                  <p className="text-gray-700">🔴 <strong>VERMELHO (STOP):</strong> NÃO clique! Resista ao impulso!</p>
                  <p className="text-gray-700">⚡ <strong>Velocidade:</strong> Cliques rápidos no verde ganham bônus</p>
                  <p className="text-gray-700">🧠 <strong>Controle:</strong> O desafio é não clicar no vermelho</p>
                </div>
              </div>

              {/* Botão Iniciar */}
              <div className="text-center py-8">
                <div className="text-6xl mb-4">😊</div>
                <button
                  onClick={iniciarExercicio}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                >
                  🚀 Iniciar Jogo
                </button>
              </div>
            </div>
          ) : !exercicioConcluido ? (
            // Área de jogo ativa
            <div className="space-y-6">
              {/* Stats durante o jogo */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-red-600">{pontuacao}</div>
                  <div className="text-sm text-gray-600">Pontos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-orange-600">{tempoRestante}s</div>
                  <div className="text-sm text-gray-600">Restante</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-green-600">{precisaoGo}%</div>
                  <div className="text-sm text-gray-600">GO</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-red-600">{precisaoStop}%</div>
                  <div className="text-sm text-gray-600">STOP</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-blue-600">{tempoMedio}ms</div>
                  <div className="text-sm text-gray-600">Tempo</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Barra de progresso */}
                <div className="h-2 bg-gray-200">
                  <div 
                    className="h-full bg-red-500 transition-all duration-1000"
                    style={{ width: `${((duracao - tempoRestante) / duracao) * 100}%` }}
                  />
                </div>

                {/* Área do jogo */}
                <div 
                  className="relative bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer"
                  style={{ height: '500px', width: '100%' }}
                >
                  {/* Botão GO/STOP */}
                  {botaoVisivel && (
                    <button
                      onClick={clicarBotao}
                      className={`absolute w-32 h-32 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 border-4 border-white font-bold text-white text-xl ${
                        tipoSinal === 'go' 
                          ? 'bg-green-500 hover:bg-green-600 animate-pulse' 
                          : 'bg-red-500 hover:bg-red-600 animate-bounce'
                      }`}
                      style={{ 
                        left: '50%', 
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {tipoSinal === 'go' ? 'GO!' : 'STOP!'}
                    </button>
                  )}

                  {/* Instruções durante o jogo */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg">
                      <div className="font-medium">🟢 Verde = Clique | 🔴 Vermelho = NÃO clique!</div>
                      <div className="text-sm opacity-90">Tempo restante: {tempoRestante}s</div>
                    </div>
                  </div>

                  {/* Aguardando próximo sinal */}
                  {!botaoVisivel && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                      <div className="bg-gray-800 bg-opacity-70 text-white px-6 py-3 rounded-lg">
                        <div className="font-medium">⏳ Aguardando próximo sinal...</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botão para voltar */}
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
            // Tela de resultados
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">
                {precisao >= 90 ? '🏆' : precisao >= 75 ? '🎉' : '💪'}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {precisao >= 90 ? 'Controle Excepcional!' : precisao >= 75 ? 'Muito Bem!' : 'Continue Praticando!'}
              </h3>
              
              <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{totalAcertos}/{totalTentativas}</div>
                  <div className="text-sm text-gray-600">Total Acertos</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{precisao}%</div>
                  <div className="text-sm text-gray-600">Precisão Geral</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-green-600">{precisaoGo}%</div>
                  <div className="text-sm text-gray-600">Precisão GO</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-red-600">{precisaoStop}%</div>
                  <div className="text-sm text-gray-600">Precisão STOP</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{pontuacao}</div>
                  <div className="text-sm text-gray-600">Pontos</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-blue-600">{tempoMedio}ms</div>
                  <div className="text-sm text-gray-600">Tempo Médio</div>
                </div>
              </div>
              
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
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  🔄 Jogar Novamente
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}