'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function AttentionSelective() {
  const [nivel, setNivel] = useState(1)
  const [pontuacao, setPontuacao] = useState(0)
  const [duracao, setDuracao] = useState(45) // segundos
  const [tempoRestante, setTempoRestante] = useState(45)
  const [ativo, setAtivo] = useState(false)
  const [alvos, setAlvos] = useState<any[]>([])
  const [corAlvo, setCorAlvo] = useState('red')
  const [acertos, setAcertos] = useState(0)
  const [erros, setErros] = useState(0)
  const [tentativas, setTentativas] = useState(0)
  const [exercicioConcluido, setExercicioConcluido] = useState(false)
  const [jogoIniciado, setJogoIniciado] = useState(false)

  // Configurações por nível
  const niveis = {
    1: { duracao: 45, totalAlvos: 3, distratores: 2, intervalo: 3000, nome: "Iniciante (45s)" },
    2: { duracao: 60, totalAlvos: 4, distratores: 3, intervalo: 2500, nome: "Básico (1min)" },
    3: { duracao: 75, totalAlvos: 5, distratores: 4, intervalo: 2000, nome: "Intermediário (1.25min)" },
    4: { duracao: 90, totalAlvos: 6, distratores: 5, intervalo: 1800, nome: "Avançado (1.5min)" },
    5: { duracao: 120, totalAlvos: 8, distratores: 7, intervalo: 1500, nome: "Expert (2min)" }
  }

  const cores = {
    red: { bg: 'bg-red-500', nome: 'Vermelho', emoji: '🔴' },
    blue: { bg: 'bg-blue-500', nome: 'Azul', emoji: '🔵' },
    green: { bg: 'bg-green-500', nome: 'Verde', emoji: '🟢' },
    yellow: { bg: 'bg-yellow-500', nome: 'Amarelo', emoji: '🟡' },
    purple: { bg: 'bg-purple-500', nome: 'Roxo', emoji: '🟣' },
    orange: { bg: 'bg-orange-500', nome: 'Laranja', emoji: '🟠' }
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

  // Controle de geração de alvos
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (ativo) {
      interval = setInterval(() => {
        gerarAlvos()
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
    setErros(0)
    setTentativas(0)
    setExercicioConcluido(false)
    setAlvos([])
    setJogoIniciado(true)
    
    // Definir cor alvo aleatória
    const coresDisponiveis = Object.keys(cores)
    const corEscolhida = coresDisponiveis[Math.floor(Math.random() * coresDisponiveis.length)]
    setCorAlvo(corEscolhida)
  }

  const gerarAlvos = () => {
    if (!ativo) return
    
    const config = niveis[nivel as keyof typeof niveis]
    const novosAlvos = []
    const coresDisponiveis = Object.keys(cores)
    
    // Gerar alvos corretos
    const numAlvosCorretos = Math.floor(Math.random() * 2) + 1 // 1-2 alvos corretos
    for (let i = 0; i < numAlvosCorretos; i++) {
      novosAlvos.push({
        id: Date.now() + i,
        cor: corAlvo,
        correto: true,
        x: Math.random() * 70 + 15,
        y: Math.random() * 60 + 20
      })
    }
    
    // Gerar distratores
    const numDistratores = config.distratores
    for (let i = 0; i < numDistratores; i++) {
      const coresDistratores = coresDisponiveis.filter(c => c !== corAlvo)
      const corDistrator = coresDistratores[Math.floor(Math.random() * coresDistratores.length)]
      
      novosAlvos.push({
        id: Date.now() + numAlvosCorretos + i,
        cor: corDistrator,
        correto: false,
        x: Math.random() * 70 + 15,
        y: Math.random() * 60 + 20
      })
    }
    
    setAlvos(novosAlvos)
    setTentativas(prev => prev + numAlvosCorretos)
    
    // Remover alvos após 2 segundos
    setTimeout(() => {
      setAlvos([])
    }, 2000)
  }

  const clicarAlvo = (alvo: any) => {
    if (!ativo) return
    
    if (alvo.correto) {
      setAcertos(prev => prev + 1)
      setPontuacao(prev => prev + 15 * nivel)
    } else {
      setErros(prev => prev + 1)
      setPontuacao(prev => Math.max(0, prev - 5)) // Penalidade por erro
    }
    
    // Remover alvo clicado
    setAlvos(prev => prev.filter(a => a.id !== alvo.id))
  }

  const finalizarExercicio = () => {
    setAtivo(false)
    setAlvos([])
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
    setAlvos([])
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
              <h1 className="text-xl font-bold text-gray-800">🎯 Atenção Seletiva</h1>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-600">Nível {nivel}</div>
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
                  Desenvolver atenção seletiva clicando apenas nos alvos da cor especificada, ignorando distratores de outras cores.
                </p>
              </div>

              {/* Pontuação */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">⭐</span>
                  <h2 className="text-lg font-bold text-gray-800">Pontuação:</h2>
                </div>
                <p className="text-gray-700 border-l-4 border-blue-400 pl-4">
                  Alvo correto = +15 pontos × nível. Erro = -5 pontos. Você precisa de 70% de precisão para avançar de nível.
                </p>
              </div>

              {/* Níveis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">📊</span>
                  <h2 className="text-lg font-bold text-gray-800">Níveis:</h2>
                </div>
                <div className="border-l-4 border-purple-400 pl-4 space-y-1">
                  <p className="text-gray-700"><strong>Nível 1:</strong> Iniciante (3 alvos, 2 distratores, 45s)</p>
                  <p className="text-gray-700"><strong>Nível 2:</strong> Básico (4 alvos, 3 distratores, 1min)</p>
                  <p className="text-gray-700"><strong>Nível 3:</strong> Intermediário (5 alvos, 4 distratores, 1.25min)</p>
                  <p className="text-gray-700"><strong>Nível 4:</strong> Avançado (6 alvos, 5 distratores, 1.5min)</p>
                  <p className="text-gray-700"><strong>Nível 5:</strong> Expert (8 alvos, 7 distratores, 2min)</p>
                </div>
              </div>

              {/* Final */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🏆</span>
                  <h2 className="text-lg font-bold text-gray-800">Final:</h2>
                </div>
                <p className="text-gray-700 border-l-4 border-green-400 pl-4">
                  Complete o Nível 5 com 70% de precisão para finalizar o exercício e fortalecer sua atenção seletiva.
                </p>
              </div>

              {/* Base Científica */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🧠</span>
                  <h2 className="text-lg font-bold text-gray-800">Base Científica:</h2>
                </div>
                <p className="text-gray-700">
                  Este exercício treina atenção seletiva e controle inibitório, fundamentais para filtrar estímulos irrelevantes e focar no que é importante, baseado em protocolos de neurociência cognitiva.
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
              {/* Instrução da cor alvo */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Clique apenas nos alvos: {cores[corAlvo as keyof typeof cores].emoji} {cores[corAlvo as keyof typeof cores].nome}
                </h2>
                <p className="text-gray-600">Ignore as outras cores!</p>
              </div>

              {/* Stats durante o jogo */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-blue-600">{pontuacao}</div>
                  <div className="text-sm text-gray-600">Pontos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-orange-600">{tempoRestante}s</div>
                  <div className="text-sm text-gray-600">Restante</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-green-600">{acertos}</div>
                  <div className="text-sm text-gray-600">Acertos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-red-600">{erros}</div>
                  <div className="text-sm text-gray-600">Erros</div>
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
                    className="h-full bg-blue-500 transition-all duration-1000"
                    style={{ width: `${((duracao - tempoRestante) / duracao) * 100}%` }}
                  />
                </div>

                {/* Área do jogo */}
                <div 
                  className="relative bg-gradient-to-br from-gray-50 to-blue-50"
                  style={{ height: '500px', width: '100%' }}
                >
                  {/* Alvos */}
                  {alvos.map((alvo) => (
                    <button
                      key={alvo.id}
                      onClick={() => clicarAlvo(alvo)}
                      className={`absolute w-16 h-16 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border-4 border-white ${cores[alvo.cor as keyof typeof cores].bg}`}
                      style={{ 
                        left: `${alvo.x}%`, 
                        top: `${alvo.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}

                  {/* Instruções durante o jogo */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg">
                      <div className="font-medium">
                        Clique apenas nos {cores[corAlvo as keyof typeof cores].emoji} {cores[corAlvo as keyof typeof cores].nome}!
                      </div>
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
                {precisao >= 90 ? 'Excelente Foco!' : precisao >= 70 ? 'Muito Bem!' : 'Continue Praticando!'}
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
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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