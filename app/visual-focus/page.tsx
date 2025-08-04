'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function VisualFocus() {
  const [nivel, setNivel] = useState(1)
  const [pontuacao, setPontuacao] = useState(0)
  const [duracao, setDuracao] = useState(60) // segundos
  const [tempoRestante, setTempoRestante] = useState(60)
  const [ativo, setAtivo] = useState(false)
  const [posicaoAlvo, setPosicaoAlvo] = useState({ x: 50, y: 50 })
  const [posicaoMouse, setPosicaoMouse] = useState({ x: 0, y: 0 })
  const [distratores, setDistratores] = useState<any[]>([])
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0)
  const [proximidadeMedia, setProximidadeMedia] = useState(0)
  const [tempoFoco, setTempoFoco] = useState(0)
  const [tempoFocoTotal, setTempoFocoTotal] = useState(0)
  const [exercicioConcluido, setExercicioConcluido] = useState(false)
  const [jogoIniciado, setJogoIniciado] = useState(false)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Configurações por nível
  const niveis = {
    1: { duracao: 60, velocidade: 1, distratores: 0, raioFoco: 80, nome: "Iniciante (1min)" },
    2: { duracao: 75, velocidade: 1.3, distratores: 1, raioFoco: 70, nome: "Básico (1.25min)" },
    3: { duracao: 90, velocidade: 1.6, distratores: 2, raioFoco: 60, nome: "Intermediário (1.5min)" },
    4: { duracao: 105, velocidade: 2, distratores: 3, raioFoco: 50, nome: "Avançado (1.75min)" },
    5: { duracao: 120, velocidade: 2.5, distratores: 4, raioFoco: 40, nome: "Expert (2min)" }
  }

  const direcaoRef = useRef({ x: 1, y: 1 })
  const ultimaAtualizacao = useRef(Date.now())

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

  // Animação do alvo
  useEffect(() => {
    let animationId: number
    
    if (ativo) {
      const animate = () => {
        const agora = Date.now()
        const deltaTime = agora - ultimaAtualizacao.current
        ultimaAtualizacao.current = agora
        
        const config = niveis[nivel as keyof typeof niveis]
        const velocidade = config.velocidade * (deltaTime / 16) // Normalizar para 60fps
        
        setPosicaoAlvo(prev => {
          let novoX = prev.x + direcaoRef.current.x * velocidade
          let novoY = prev.y + direcaoRef.current.y * velocidade
          
          // Rebater nas bordas
          if (novoX <= 5 || novoX >= 95) {
            direcaoRef.current.x *= -1
            novoX = Math.max(5, Math.min(95, novoX))
          }
          if (novoY <= 5 || novoY >= 95) {
            direcaoRef.current.y *= -1
            novoY = Math.max(5, Math.min(95, novoY))
          }
          
          return { x: novoX, y: novoY }
        })
        
        // Verificar proximidade e pontuar
        calcularProximidade()
        
        animationId = requestAnimationFrame(animate)
      }
      
      animationId = requestAnimationFrame(animate)
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [ativo, nivel])

  // Gerar distratores
  useEffect(() => {
    if (ativo) {
      const config = niveis[nivel as keyof typeof niveis]
      const novosDistratores = []
      
      for (let i = 0; i < config.distratores; i++) {
        novosDistratores.push({
          id: i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          cor: ['red', 'blue', 'yellow', 'purple'][Math.floor(Math.random() * 4)]
        })
      }
      
      setDistratores(novosDistratores)
      
      // Reposicionar distratores periodicamente
      const interval = setInterval(() => {
        if (ativo) {
          setDistratores(prev => prev.map(d => ({
            ...d,
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10
          })))
        }
      }, 3000)
      
      return () => clearInterval(interval)
    }
  }, [ativo, nivel])

  const iniciarExercicio = () => {
    const configuracao = niveis[nivel as keyof typeof niveis]
    setDuracao(configuracao.duracao)
    setTempoRestante(configuracao.duracao)
    setAtivo(true)
    setPontuacao(0)
    setPontuacaoTotal(0)
    setProximidadeMedia(0)
    setTempoFoco(0)
    setTempoFocoTotal(0)
    setExercicioConcluido(false)
    setJogoIniciado(true)
    setPosicaoAlvo({ x: 50, y: 50 })
    direcaoRef.current = { 
      x: Math.random() > 0.5 ? 1 : -1, 
      y: Math.random() > 0.5 ? 1 : -1 
    }
    ultimaAtualizacao.current = Date.now()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameAreaRef.current || !ativo) return
    
    const rect = gameAreaRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setPosicaoMouse({ x, y })
  }

  const calcularProximidade = () => {
    if (!ativo) return
    
    const config = niveis[nivel as keyof typeof niveis]
    const distancia = Math.sqrt(
      Math.pow(posicaoAlvo.x - posicaoMouse.x, 2) + 
      Math.pow(posicaoAlvo.y - posicaoMouse.y, 2)
    )
    
    const proximidade = Math.max(0, 100 - (distancia / config.raioFoco) * 100)
    
    if (proximidade > 30) { // Considera "em foco" se proximidade > 30%
      setTempoFoco(prev => prev + 1)
      const pontos = Math.round(proximidade * nivel * 0.2)
      setPontuacao(prev => prev + pontos)
    }
    
    setTempoFocoTotal(prev => prev + 1)
    setProximidadeMedia(prev => 
      ((prev * (tempoFocoTotal - 1)) + proximidade) / tempoFocoTotal
    )
  }

  const finalizarExercicio = () => {
    setAtivo(false)
    setExercicioConcluido(true)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
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
    setDistratores([])
  }

  const distanciaAtual = Math.sqrt(
    Math.pow(posicaoAlvo.x - posicaoMouse.x, 2) + 
    Math.pow(posicaoAlvo.y - posicaoMouse.y, 2)
  )
  const proximidadeAtual = Math.max(0, Math.round(100 - distanciaAtual))
  const percentualFoco = tempoFocoTotal > 0 ? Math.round((tempoFoco / tempoFocoTotal) * 100) : 0
  const podeAvancar = percentualFoco >= 70 && proximidadeMedia >= 50 && nivel < 5

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
              <h1 className="text-xl font-bold text-gray-800">👁️ Foco Visual</h1>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-green-600">Nível {nivel}</div>
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
                  Desenvolver concentração visual e rastreamento seguindo um alvo em movimento constante, ignorando distratores na tela.
                </p>
              </div>

              {/* Pontuação */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">⭐</span>
                  <h2 className="text-lg font-bold text-gray-800">Pontuação:</h2>
                </div>
                <p className="text-gray-700 border-l-4 border-blue-400 pl-4">
                  Pontos baseados na proximidade do cursor ao alvo (proximidade × nível × 0.2). Manter foco em 70% do tempo e 50% proximidade média para avançar.
                </p>
              </div>

              {/* Níveis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">📊</span>
                  <h2 className="text-lg font-bold text-gray-800">Níveis:</h2>
                </div>
                <div className="border-l-4 border-purple-400 pl-4 space-y-1">
                  <p className="text-gray-700"><strong>Nível 1:</strong> Iniciante (velocidade baixa, sem distratores, 1min)</p>
                  <p className="text-gray-700"><strong>Nível 2:</strong> Básico (velocidade média, 1 distrator, 1.25min)</p>
                  <p className="text-gray-700"><strong>Nível 3:</strong> Intermediário (velocidade alta, 2 distratores, 1.5min)</p>
                  <p className="text-gray-700"><strong>Nível 4:</strong> Avançado (velocidade rápida, 3 distratores, 1.75min)</p>
                  <p className="text-gray-700"><strong>Nível 5:</strong> Expert (velocidade máxima, 4 distratores, 2min)</p>
                </div>
              </div>

              {/* Final */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🏆</span>
                  <h2 className="text-lg font-bold text-gray-800">Final:</h2>
                </div>
                <p className="text-gray-700 border-l-4 border-green-400 pl-4">
                  Complete o Nível 5 mantendo 70% de tempo em foco e 50% de proximidade média para finalizar e fortalecer sua concentração visual.
                </p>
              </div>

              {/* Base Científica */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🧠</span>
                  <h2 className="text-lg font-bold text-gray-800">Base Científica:</h2>
                </div>
                <p className="text-gray-700">
                  Este exercício treina atenção visual sustentada e rastreamento de objetos, fundamentais para concentração e coordenação visomotora em pessoas com TDAH.
                </p>
              </div>

              {/* Instruções */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">📖</span>
                  <h2 className="text-lg font-bold text-gray-800">Como Jogar:</h2>
                </div>
                <div className="border-l-4 border-indigo-400 pl-4 space-y-2">
                  <p className="text-gray-700">🟢 <strong>Alvo Verde:</strong> Siga com o cursor constantemente</p>
                  <p className="text-gray-700">🎯 <strong>Proximidade:</strong> Mantenha o cursor próximo ao alvo</p>
                  <p className="text-gray-700">👁️ <strong>Foco:</strong> Ignore distratores coloridos</p>
                  <p className="text-gray-700">⚡ <strong>Movimento:</strong> O alvo acelera nos níveis avançados</p>
                </div>
              </div>

              {/* Botão Iniciar */}
              <div className="text-center py-8">
                <div className="text-6xl mb-4">😊</div>
                <button
                  onClick={iniciarExercicio}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
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
                  <div className="text-xl font-bold text-green-600">{pontuacao}</div>
                  <div className="text-sm text-gray-600">Pontos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-orange-600">{tempoRestante}s</div>
                  <div className="text-sm text-gray-600">Restante</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-blue-600">{proximidadeAtual}%</div>
                  <div className="text-sm text-gray-600">Proximidade</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-purple-600">{percentualFoco}%</div>
                  <div className="text-sm text-gray-600">Tempo Foco</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-red-600">{Math.round(proximidadeMedia)}%</div>
                  <div className="text-sm text-gray-600">Média</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Barra de progresso */}
                <div className="h-2 bg-gray-200">
                  <div 
                    className="h-full bg-green-500 transition-all duration-1000"
                    style={{ width: `${((duracao - tempoRestante) / duracao) * 100}%` }}
                  />
                </div>

                {/* Área do jogo */}
                <div 
                  ref={gameAreaRef}
                  onMouseMove={handleMouseMove}
                  className="relative bg-gradient-to-br from-blue-50 to-green-50 cursor-none"
                  style={{ height: '500px', width: '100%' }}
                >
                  {/* Alvo principal */}
                  <div
                    className="absolute w-6 h-6 bg-green-500 rounded-full shadow-lg border-2 border-white animate-pulse"
                    style={{ 
                      left: `${posicaoAlvo.x}%`, 
                      top: `${posicaoAlvo.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />

                  {/* Distratores */}
                  {distratores.map((distrator) => (
                    <div
                      key={distrator.id}
                      className={`absolute w-4 h-4 rounded-full opacity-60`}
                      style={{ 
                        left: `${distrator.x}%`, 
                        top: `${distrator.y}%`,
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: distrator.cor
                      }}
                    />
                  ))}

                  {/* Cursor do usuário */}
                  <div
                    className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white pointer-events-none"
                    style={{ 
                      left: `${posicaoMouse.x}%`, 
                      top: `${posicaoMouse.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />

                  {/* Instruções durante o jogo */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg">
                      <div className="font-medium">🟢 Siga o alvo verde com o cursor!</div>
                      <div className="text-sm opacity-90">Proximidade: {proximidadeAtual}% | Tempo restante: {tempoRestante}s</div>
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
                {percentualFoco >= 80 && proximidadeMedia >= 60 ? '🏆' : 
                 percentualFoco >= 70 && proximidadeMedia >= 50 ? '🎉' : '💪'}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {percentualFoco >= 80 && proximidadeMedia >= 60 ? 'Foco Excepcional!' : 
                 percentualFoco >= 70 && proximidadeMedia >= 50 ? 'Muito Bem!' : 'Continue Praticando!'}
              </h3>
              
              <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{percentualFoco}%</div>
                  <div className="text-sm text-gray-600">Tempo em Foco</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{Math.round(proximidadeMedia)}%</div>
                  <div className="text-sm text-gray-600">Proximidade Média</div>
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
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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