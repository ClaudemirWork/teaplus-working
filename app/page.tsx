'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient'

// Interface de Tipagem para as configurações de nível
interface NivelConfig {
  duracao: number;
  intervalo: number;
  nome: string;
  exposicao: number;
}

export default function AttentionSustained() {
  const router = useRouter()
  const supabase = createClient()
  
  // CORRIGIDO: Declarações de useState com a sintaxe de desestruturação de array correta
  const [nivel, setNivel] = useState(1);
  const [pontuacao, setPontuacao] = useState(0);
  const = useState(30);
  const = useState(30);
  const [ativo, setAtivo] = useState(false);
  const = useState(false);
  const = useState({ x: 50, y: 50 });
  const [acertos, setAcertos] = useState(0);
  const = useState(0);
  const [exercicioConcluido, setExercicioConcluido] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const = useState(false);
  
  // Métricas internas - CORRIGIDO: Inicializadas como arrays vazios para evitar erros de runtime
  const = useState<number>();
  const [errosComissao, setErrosComissao] = useState(0);
  const [errosOmissao, setErrosOmissao] = useState(0);
  const = useState<number>(0);
  const = useState<boolean>();

  // Configurações por nível
  const niveis: { [key: number]: NivelConfig } = {
    1: { duracao: 30, intervalo: 2500, nome: "Iniciante (30s)", exposicao: 1200 },
    2: { duracao: 60, intervalo: 2200, nome: "Básico (1min)", exposicao: 1100 },
    3: { duracao: 90, intervalo: 1900, nome: "Intermediário (1.5min)", exposicao: 1000 },
    4: { duracao: 120, intervalo: 1600, nome: "Avançado (2min)", exposicao: 900 },
    5: { duracao: 180, intervalo: 1300, nome: "Expert (3min)", exposicao: 800 }
  }

  // Timer principal
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (ativo && tempoRestante > 0) {
      timer = setTimeout(() => {
        setTempoRestante(prev => prev - 1)
      }, 1000)
    } else if (tempoRestante === 0 && ativo) {
      finalizarExercicio()
    }
    return () => {
      if (timer) clearTimeout(timer);
    }
  },)

  // Controle de aparição do target
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (ativo) {
      interval = setInterval(() => {
        mostrarTarget()
      }, niveis[nivel as keyof typeof niveis].intervalo)
    }
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [ativo, nivel])

  const handleClickArea = (event: React.MouseEvent) => {
    if (ativo &&!targetVisible) {
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
    setTemposReacao() // CORRIGIDO: Resetando o array com
    setErrosComissao(0)
    setErrosOmissao(0)
    setSequenciaAcertos() // CORRIGIDO: Resetando o array com
    setExercicioConcluido(false)
    setTargetVisible(false)
    setJogoIniciado(true)
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
      setTargetVisible(prev => {
        if (prev) {
          setErrosOmissao(oldErros => oldErros + 1)
          setSequenciaAcertos(oldSeq =>) // CORRIGIDO: Sintaxe do spread operator
        }
        return false
      })
    }, tempoExposicao)
  }

  const clicarTarget = () => {
    if (targetVisible && ativo) {
      const tempoReacao = Date.now() - timestampTarget
      setTemposReacao(prev =>) // CORRIGIDO: Sintaxe do spread operator
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

  // Cálculos para métricas
  const precisao = tentativas > 0? Math.round((acertos / tentativas) * 100) : 0
  const tempoReacaoMedio = temposReacao.length > 0? Math.round(temposReacao.reduce((a, b) => a + b, 0) / temposReacao.length) : 0
  
  const calcularVariabilidade = () => {
    if (temposReacao.length < 2) return 0
    const media = tempoReacaoMedio
    const variancia = temposReacao.reduce((acc, tempo) => acc + Math.pow(tempo - media, 2), 0) / temposReacao.length
    return Math.round(Math.sqrt(variancia))
  }
  
  const variabilidadeRT = calcularVariabilidade()
  const coeficienteVariacao = tempoReacaoMedio > 0? Math.round((variabilidadeRT / tempoReacaoMedio) * 100) : 0
  const podeAvancar = precisao >= 75 && nivel < 5 && coeficienteVariacao <= 30

  // SALVAMENTO
  const handleSaveSession = async () => {
    if (tentativas === 0) {
      alert('Complete pelo menos uma tentativa antes de salvar.')
      return
    }

    setSalvando(true)
    
    try {
      // Obter o usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError ||!user) {
        console.error('Erro ao obter usuário:', userError)
        alert('Erro: Sessão expirada. Por favor, faça login novamente.')
        router.push('/login')
        return
      }
      
      // Salvar na tabela sessoes - CORRIGIDO: Passando o objeto de dados completo
      const { data, error } = await supabase
       .from('sessoes')
       .insert()

      if (error) {
        console.error('Erro ao salvar:', error)
        alert(`Erro ao salvar: ${error.message}`)
      } else {
        // ALERT MELHORADO COM MÉTRICAS DETALHADAS
        alert(`Sessão salva com sucesso!
        
📊 Resumo da Avaliação:
- ${acertos}/${tentativas} acertos (${precisao}%)
- Tempo de reação: ${tempoReacaoMedio}ms
- Variabilidade (CV): ${coeficienteVariacao}%
- Erros de omissão: ${errosOmissao}
- Erros de comissão: ${errosComissao}
- Nível ${nivel} completado
- ${pontuacao} pontos`)
        
        // CORRIGIDO: Redirecionamento final para o dashboard
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error)
      alert(`Erro ao salvar: ${error.message |

| 'Erro desconhecido'}`)
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
      {/* HEADER PADRONIZADO E CENTRALIZADO */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto p-3 sm:p-4 flex items-center justify-between h-16">
          {/* Botão Voltar (Esquerda) */}
          <Link
            href="/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
          >
            <ChevronLeft size={20} />
            <span className="text-sm sm:text-base">← Voltar</span>
          </Link>
          
          {/* Título Centralizado (Meio) */}
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-grow flex items-center justify-center gap-2">
            <span>⚡</span>
            <span>Atenção Sustentada</span>
          </h1>

          {/* Botão de Ação ou Espaçador (Direita) */}
          {exercicioConcluido? (
            <button
              onClick={handleSaveSession}
              disabled={salvando}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:bg-green-400"
            >
              <Save size={20} />
              <span>{salvando? 'Salvando...' : 'Finalizar e Salvar'}</span>
            </button>
          ) : (
            // Espaçador para manter o título centralizado
            <div className="min-w-[124px] touch-manipulation"></div>
          )}
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {!jogoIniciado? (
          // Tela inicial LIMPA - SEM TERMOS TÉCNICOS
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                  <p className="text-sm text-gray-600">
                    Manter atenção focada clicando nos alvos que aparecem na tela.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Clique nos alvos vermelhos</li>
                    <li>Seja rápido e preciso</li>
                    <li>Evite clicar fora do alvo</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Progresso:</h3>
                  <p className="text-sm text-gray-600">
                    75% de precisão para avançar de nível. Consistência é importante!
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
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-sm">Nível {key}</div>
                    <div className="text-xs opacity-80">{value.nome}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Botão Iniciar - SEM "AVALIAÇÃO CIENTÍFICA" */}
            <div className="text-center">
              <button
                onClick={iniciarExercicio}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                🚀 Iniciar Atividade
              </button>
            </div>
          </div>
        ) :!exercicioConcluido? (
          // Área de jogo - LIMPA
          <div className="space-y-6">
            {/* Progresso */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">📊 Progresso da Sessão</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-800">{pontuacao}</div>
                  <div className="text-xs text-orange-600">Pontos</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-800">{tempoRestante}s</div>
                  <div className="text-xs text-blue-600">Tempo</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-800">{acertos}/{tentativas}</div>
                  <div className="text-xs text-green-600">Acertos</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-800">{precisao}%</div>
                  <div className="text-xs text-purple-600">Precisão</div>
                </div>
              </div>
            </div>

            {/* Área de Jogo */}
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
                    <div className="font-medium">Mantenha o foco!</div>
                    <div className="text-sm opacity-90">Nível {nivel} • {tempoRestante}s restantes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Tela de resultados LIMPA
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {precisao >= 90? '🏆' : precisao >= 75? '🎉' : '💪'}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {precisao >= 90? 'Excelente!' : precisao >= 75? 'Muito bem!' : 'Continue praticando!'}
              </h3>
              
              <p className="text-gray-600">
                Você completou o nível {nivel} com {precisao}% de precisão
              </p>
            </div>
            
            {/* Resultados - LAYOUT LIMPO */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">📊 Resultados da Sessão</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-800">{acertos}/{tentativas}</div>
                  <div className="text-xs text-blue-600">Acertos</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-800">{precisao}%</div>
                  <div className="text-xs text-green-600">Precisão</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-purple-800">{tempoReacaoMedio}ms</div>
                  <div className="text-xs text-purple-600">Tempo Médio</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-800">{pontuacao}</div>
                  <div className="text-xs text-orange-600">Pontos</div>
                </div>
              </div>
            </div>
            
            {/* Feedback - LINGUAGEM SIMPLES */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-blue-800 mb-2">📊 Seu Desempenho:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Precisão: {precisao >= 75? '✅ Ótima!' : '⚠️ Precisa melhorar'}</p>
                <p>• Velocidade: {tempoReacaoMedio < 600? '✅ Rápido' : tempoReacaoMedio < 800? '⚠️ Moderado' : '🔴 Lento'}</p>
                <p>• Consistência: {coeficienteVariacao <= 30? '✅ Estável' : '⚠️ Variável'}</p>
                <p>• Atenção: {errosOmissao <= 2? '✅ Focado' : '⚠️ Distraído'}</p>
                <p>• Controle: {errosComissao <= 2? '✅ Controlado' : '⚠️ Impulsivo'}</p>
              </div>
            </div>
            
            {/* Botões de ação */}
            <div className="flex justify-center space-x-4">
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
                🔄 Repetir
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
