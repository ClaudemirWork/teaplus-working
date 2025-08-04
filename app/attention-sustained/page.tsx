'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function AttentionSustained() {
  const [nivel, setNivel] = useState(1)
  const [pontuacao, setPontuacao] = useState(0)
  const [duracao, setDuracao] = useState(30) // segundos
  const [tempoRestante, setTempoRestante] = useState(30)
  const [ativo, setAtivo] = useState(false)
  const [targetVisible, setTargetVisible] = useState(false)
  const [posicaoTarget, setPosicaoTarget] = useState({ x: 50, y: 50 })
  const [acertos, setAcertos] = useState(0)
  const [tentativas, setTentativas] = useState(0)
  const [exercicioConcluido, setExercicioConcluido] = useState(false)
  const [jogoIniciado, setJogoIniciado] = useState(false)

  // Configurações por nível
  const niveis = {
    1: { duracao: 30, intervalo: 2500, nome: "Iniciante (30s)" },
    2: { duracao: 60, intervalo: 2000, nome: "Básico (1min)" },
    3: { duracao: 90, intervalo: 1700, nome: "Intermediário (1.5min)" },
    4: { duracao: 120, intervalo: 1400, nome: "Avançado (2min)" },
    5: { duracao: 180, intervalo: 1200, nome: "Expert (3min)" }
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

  const iniciarExercicio = () => {
    const configuracao = niveis[nivel as keyof typeof niveis]
    setDuracao(configuracao.duracao)
    setTempoRestante(configuracao.duracao)
    setAtivo(true)
    setPontuacao(0)
    setAcertos(0)
    setTentativas(0)
    setExercicioConcluido(false)
    setTargetVisible(false)
    setJogoIniciado(true)
  }

  const mostrarTarget = () => {
    if (!ativo) return
    
    // Gerar posição aleatória
    const x = Math.random() * 70 + 15 // 15-85%
    const y = Math.random() * 60 + 20 // 20-80%
    setPosicaoTarget({ x, y })
    setTargetVisible(true)
    setTentativas(prev => prev + 1)

    // Esconder após 1.2 segundos
    setTimeout(() => {
      setTargetVisible(false)
    }, 1200)
  }

  const clicarTarget = () => {
    if (targetVisible && ativo) {
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

  const precisao = tentativas > 0 ? Math.round((acertos / tentativas) * 100) : 0
  const podeAvancar = precisao >= 70 && nivel < 5

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
              <h1 className="text-xl font-bold text-gray-800">⚡ Atenção Sustentada Progressiva</h1>
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
            // Tela de informações inicial
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

              {/* Pontuação */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">⭐</span>
                  <h2 className="text-lg font-bold text-gray-800">Pontuação:</h2>
                </div>
                <p className="text-gray-700 border-l-4 border-blue-400 pl-4">
                  Cada alvo acertado = +10 pontos × nível atual. Você precisa de 70% de precisão para avançar de nível.
                </p>
              </div>

              {/* Níveis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">📊</span>
                  <h2 className="text-lg font-bold text-gray-800">Níveis:</h2>
                </div>
                <div className="border-l-4 border-purple-400 pl-4 space-y-1">
                  <p className="text-gray-700"><strong>Nível 1:</strong> Iniciante (30 segundos)</p>
                  <p className="text-gray-700"><strong>Nível 2:</strong> Básico (1 minuto)</p>
                  <p className="text-gray-700"><strong>Nível 3:</strong> Intermediário (1,5 minutos)</p>
                  <p className="text-gray-700"><strong>Nível 4:</strong> Avançado (2 minutos)</p>
                  <p className="text-gray-700"><strong>Nível 5:</strong> Expert (3 minutos)</p>
                </div>
              </div>

              {/* Final */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🏆</span>
                  <h2 className="text-lg font-bold text-gray-800">Final:</h2>
                </div>
                <p className="text-gray-700 border-l-4 border-green-400 pl-4">
                  Complete o Nível 5 com 70% de precisão para finalizar o exercício com sucesso e fortalecer sua atenção sustentada.
                </p>
              </div>

              {/* Base Científica */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🧠</span>
                  <h2 className="text-lg font-bold text-gray-800">Base Científica:</h2>
                </div>
                <p className="text-gray-700">
                  Este exercício é baseado em protocolos de treinamento de atenção sustentada para desenvolvimento de funções executivas em pessoas com TDAH, fundamentado em neurociência cognitiva aplicada.
                </p>
              </div>

              {/* Botão Iniciar */}
              <div className="text-center py-8">
                <div className="text-6xl mb-4">😊</div>
                <button
                  onClick={iniciarExercicio}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                >
                  🚀 Iniciar Jogo
                </button>
              </div>
            </div>
          ) : !exercicioConcluido ? (
            // Área de jogo ativa
            <div className="space-y-6">
              {/* Stats durante o jogo */}
              <div className="grid grid-cols-4 gap-4">
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
                {/* Barra de progresso */}
                <div className="h-2 bg-gray-200">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-1000"
                    style={{ width: `${((duracao - tempoRestante) / duracao) * 100}%` }}
                  />
                </div>

                {/* Área do jogo */}
                <div 
                  className="relative bg-gradient-to-br from-blue-50 to-purple-50 cursor-crosshair"
                  style={{ height: '500px', width: '100%' }}
                >
                  {/* Target */}
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

                  {/* Instruções durante o jogo */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg">
                      <div className="font-medium">Mantenha o foco! ⚡</div>
                      <div className="text-sm opacity-90">Tempo restante: {tempoRestante}s</div>
                    </div>
                  </div>
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
                {precisao >= 90 ? '🏆' : precisao >= 70 ? '🎉' : '💪'}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {precisao >= 90 ? 'Excelente!' : precisao >= 70 ? 'Muito Bem!' : 'Continue Praticando!'}
              </h3>
              
              <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{acertos}/{tentativas}</div>
                  <div className="text-sm text-gray-600">Acertos</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{precisao}%</div>
                  <div className="text-sm text-gray-600">Precisão</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{pontuacao}</div>
                  <div className="text-sm text-gray-600">Pontos</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">Nível {nivel}</div>
                  <div className="text-sm text-gray-600">Atual</div>
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
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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