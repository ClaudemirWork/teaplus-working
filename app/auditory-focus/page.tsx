'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

// VERSÃO COMPLETAMENTE REESCRITA - SOLUÇÃO PARA 39 TESTES FALHARAM
export default function AuditoryFocus() {
  // Estados essenciais
  const [nivel, setNivel] = useState(1)
  const [pontuacao, setPontuacao] = useState(0)
  const [tempoRestante, setTempoRestante] = useState(60)
  const [ativo, setAtivo] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [audioDisponivel, setAudioDisponivel] = useState(false)
  const [audioTestado, setAudioTestado] = useState(false)
  const [acertos, setAcertos] = useState(0)
  const [erros, setErros] = useState(0)
  const [totalTons, setTotalTons] = useState(0)
  const [exercicioConcluido, setExercicioConcluido] = useState(false)
  const [jogoIniciado, setJogoIniciado] = useState(false)
  
  // Estados para feedback visual
  const [ultimoTom, setUltimoTom] = useState<'alvo' | 'distrator' | null>(null)
  const [aguardandoResposta, setAguardandoResposta] = useState(false)
  const [debugInfo, setDebugInfo] = useState('Aguardando...')
  
  // Refs para controle robusto
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const ativoRef = useRef(false)
  const nivelRef = useRef(1)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Configurações por nível
  const niveis = {
    1: { duracao: 60, intervalo: 3000, probAlvo: 0.4, nome: "Iniciante (1min)" },
    2: { duracao: 75, intervalo: 2500, probAlvo: 0.35, nome: "Básico (1.25min)" },
    3: { duracao: 90, intervalo: 2000, probAlvo: 0.3, nome: "Intermediário (1.5min)" },
    4: { duracao: 105, intervalo: 1700, probAlvo: 0.25, nome: "Avançado (1.75min)" },
    5: { duracao: 120, intervalo: 1500, probAlvo: 0.2, nome: "Expert (2min)" }
  }

  // Frequências dos tons (em Hz)
  const tons = {
    alvo: 800,
    distrator1: 400,
    distrator2: 600,
    distrator3: 1000
  }

  // Sincronizar refs com states
  useEffect(() => {
    ativoRef.current = ativo
    nivelRef.current = nivel
  }, [ativo, nivel])

  // 🎵 SISTEMA DE ÁUDIO ROBUSTO PARA NEXT.JS 13+
  useEffect(() => {
    const initAudio = async () => {
      try {
        console.log('🎵 [AUDIO INIT] Inicializando AudioContext...')
        
        // Verificar se já existe
        if (audioContextRef.current) {
          console.log('⚠️ [AUDIO INIT] AudioContext já existe, limpando...')
          await audioContextRef.current.close()
        }
        
        // Criar novo AudioContext
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioContextClass) {
          throw new Error('Web Audio API não suportada')
        }
        
        audioContextRef.current = new AudioContextClass()
        console.log(`🔊 [AUDIO INIT] AudioContext criado. Estado: ${audioContextRef.current.state}`)
        
        // Criar GainNode
        gainNodeRef.current = audioContextRef.current.createGain()
        gainNodeRef.current.connect(audioContextRef.current.destination)
        gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime)
        
        setAudioDisponivel(true)
        setDebugInfo(`AudioContext: ${audioContextRef.current.state}`)
        
        console.log('✅ [AUDIO INIT] Sistema de áudio inicializado com sucesso!')
        
      } catch (error) {
        console.error('❌ [AUDIO INIT] Erro ao inicializar áudio:', error)
        setAudioDisponivel(false)
        setDebugInfo('Erro no áudio')
      }
    }

    initAudio()

    // Cleanup
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
        console.log('🧹 [CLEANUP] AudioContext fechado')
      }
    }
  }, []) // Executar apenas uma vez

  // Atualizar volume
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime)
      console.log(`🔊 [VOLUME] Volume atualizado para: ${Math.round(volume * 100)}%`)
    }
  }, [volume])

  // ⏰ TIMER PRINCIPAL
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (ativo && tempoRestante > 0) {
      timer = setTimeout(() => {
        setTempoRestante(prev => {
          const novoTempo = prev - 1
          console.log(`⏰ [TIMER] Tempo restante: ${novoTempo}s`)
          return novoTempo
        })
      }, 1000)
    } else if (tempoRestante === 0 && ativo) {
      console.log('🏁 [TIMER] Tempo esgotado! Finalizando exercício...')
      finalizarExercicio()
    }
    return () => clearTimeout(timer)
  }, [ativo, tempoRestante])

  // 🎮 GAME LOOP PRINCIPAL - SOLUÇÃO DEFINITIVA
  useEffect(() => {
    console.log(`🎮 [GAME LOOP] useEffect executado. Ativo: ${ativo}, Nível: ${nivel}`)
    
    // Limpar loops anteriores PRIMEIRO
    if (gameLoopRef.current) {
      console.log('🧹 [GAME LOOP] Limpando interval anterior...')
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }
    if (timeoutRef.current) {
      console.log('🧹 [GAME LOOP] Limpando timeout anterior...')
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    if (!ativo) {
      console.log('⏹️ [GAME LOOP] Jogo não ativo - não iniciando loop')
      return
    }

    // Configuração do nível atual
    const config = niveis[nivel as keyof typeof niveis]
    console.log(`🎮 [GAME LOOP] Iniciando novo loop. Nível: ${nivel}, Intervalo: ${config.intervalo}ms, ProbAlvo: ${config.probAlvo}`)
    
    // Aguardar um pouco antes do primeiro tom para evitar conflitos
    console.log('⏳ [GAME LOOP] Aguardando 3 segundos antes do primeiro tom...')
    timeoutRef.current = setTimeout(async () => {
      if (ativoRef.current) {
        console.log('🎵 [GAME LOOP] Executando primeiro tom do nível...')
        await reproduzirTomJogo()
      }
    }, 3000)

    // Loop principal com setInterval ROBUSTO
    const intervalId = setInterval(async () => {
      console.log(`🔄 [GAME LOOP] Tick do loop nível ${nivelRef.current}. Ativo: ${ativoRef.current}`)
      
      if (!ativoRef.current) {
        console.log('⏹️ [GAME LOOP] Loop detectou jogo inativo, auto-limpando...')
        clearInterval(intervalId)
        return
      }

      // Reproduzir próximo tom
      console.log(`🎵 [GAME LOOP] Chamando reproduzirTomJogo para nível ${nivelRef.current}...`)
      await reproduzirTomJogo()
      
    }, config.intervalo)
    
    gameLoopRef.current = intervalId
    console.log(`✅ [GAME LOOP] Loop criado com ID: ${intervalId} para nível ${nivel}`)

    // Cleanup
    return () => {
      console.log(`🧹 [GAME LOOP] Cleanup executado para nível ${nivel}`)
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [ativo, nivel]) // Removido reproduzirTomJogo das dependências para evitar erro circular

  // 🔊 FUNÇÃO DE REPRODUÇÃO DE TOM ROBUSTA
  const reproduzirTom = useCallback(async (frequencia: number, duracao: number = 600): Promise<boolean> => {
    try {
      if (!audioContextRef.current || !gainNodeRef.current) {
        console.log('❌ [REPRODUZIR TOM] AudioContext ou GainNode não disponível')
        return false
      }

      // VERIFICAR E REATIVAR AUDIOCONTEXT - SOLUÇÃO PARA SUSPENDED
      if (audioContextRef.current.state === 'suspended') {
        console.log('⚡ [REPRODUZIR TOM] AudioContext suspenso, reativando...')
        try {
          await audioContextRef.current.resume()
          console.log('✅ [REPRODUZIR TOM] AudioContext reativado com sucesso!')
        } catch (error) {
          console.error('❌ [REPRODUZIR TOM] Erro ao reativar AudioContext:', error)
          return false
        }
      }

      console.log(`🎵 [REPRODUZIR TOM] Reproduzindo ${frequencia}Hz por ${duracao}ms`)

      // Criar oscillator
      const oscillator = audioContextRef.current.createOscillator()
      const envelope = audioContextRef.current.createGain()
      
      // Conectar
      oscillator.connect(envelope)
      envelope.connect(gainNodeRef.current)
      
      // Configurar
      oscillator.frequency.setValueAtTime(frequencia, audioContextRef.current.currentTime)
      oscillator.type = 'sine'
      
      // Volume com envelope suave
      const volumeAtual = volume * 0.4 // Volume controlado
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime)
      envelope.gain.linearRampToValueAtTime(volumeAtual, audioContextRef.current.currentTime + 0.05)
      envelope.gain.linearRampToValueAtTime(volumeAtual, audioContextRef.current.currentTime + (duracao / 1000) - 0.05)
      envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + (duracao / 1000))
      
      // Reproduzir
      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + (duracao / 1000))
      
      console.log(`✅ [REPRODUZIR TOM] Tom ${frequencia}Hz reproduzido com sucesso!`)
      return true
      
    } catch (error) {
      console.error('❌ [REPRODUZIR TOM] Erro ao reproduzir tom:', error)
      return false
    }
  }, [volume])

  // 🎯 REPRODUZIR TOM DO JOGO
  const reproduzirTomJogo = useCallback(async () => {
    if (!ativoRef.current) {
      console.log('❌ [TOM JOGO] Jogo não está ativo')
      return
    }

    const config = niveis[nivelRef.current as keyof typeof niveis]
    const isAlvo = Math.random() < config.probAlvo
    
    let frequencia: number
    let tipo: 'alvo' | 'distrator'
    
    if (isAlvo) {
      frequencia = tons.alvo
      tipo = 'alvo'
    } else {
      const distratores = [tons.distrator1, tons.distrator2, tons.distrator3]
      frequencia = distratores[Math.floor(Math.random() * distratores.length)]
      tipo = 'distrator'
    }
    
    console.log(`🎯 [TOM JOGO] Nível: ${nivelRef.current} | Tipo: ${tipo} | Frequência: ${frequencia}Hz`)
    
    // FORÇAR atualização dos estados ANTES da reprodução
    console.log(`🔄 [TOM JOGO] Forçando atualização de estados visuais...`)
    setUltimoTom(tipo)
    setAguardandoResposta(true)
    setTotalTons(prev => prev + 1)
    setDebugInfo(`Nível ${nivelRef.current}: ${tipo} (${frequencia}Hz)`)
    
    // Reproduzir tom
    const sucesso = await reproduzirTom(frequencia, 600)
    
    if (sucesso) {
      console.log(`✅ [TOM JOGO] Tom reproduzido e estados atualizados com sucesso!`)
      
      // Timeout para resposta - usar ref do timeout para limpeza
      const timeoutId = setTimeout(() => {
        console.log(`⏱️ [TOM JOGO] Timeout (2s) - Limpando estados para: ${tipo}`)
        setAguardandoResposta(false)
        setUltimoTom(null)
        setDebugInfo(`Timeout nível ${nivelRef.current}`)
      }, 2000)
      
      // Limpar timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = timeoutId
      
    } else {
      console.log('❌ [TOM JOGO] Falha ao reproduzir tom - limpando estados')
      setUltimoTom(null)
      setAguardandoResposta(false)
      setDebugInfo(`Erro nível ${nivelRef.current}`)
    }
  }, [reproduzirTom])

  // 🧪 TESTE DE ÁUDIO
  const testarAudio = useCallback(async () => {
    console.log('🧪 [TESTE] Iniciando teste de áudio...')
    const sucesso = await reproduzirTom(tons.alvo, 1000)
    if (sucesso) {
      setAudioTestado(true)
      console.log('✅ [TESTE] Teste de áudio bem-sucedido!')
    } else {
      console.log('❌ [TESTE] Teste de áudio falhou!')
    }
  }, [reproduzirTom])

  // 🔄 REATIVAR ÁUDIO MANUALMENTE
  const reativarAudio = useCallback(async () => {
    console.log('🔄 [REATIVAR] Reativação manual solicitada...')
    
    if (!audioContextRef.current) {
      console.log('❌ [REATIVAR] AudioContext não existe')
      return
    }

    try {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
        console.log('✅ [REATIVAR] AudioContext reativado!')
        setDebugInfo('AudioContext reativado!')
      } else {
        console.log(`ℹ️ [REATIVAR] AudioContext já está: ${audioContextRef.current.state}`)
      }
      
      // Tocar tom de confirmação
      await reproduzirTom(tons.alvo, 500)
      
    } catch (error) {
      console.error('❌ [REATIVAR] Erro na reativação:', error)
    }
  }, [reproduzirTom])

  // 🚀 INICIAR EXERCÍCIO
  const iniciarExercicio = () => {
    if (!audioDisponivel || !audioTestado) {
      alert('Por favor, teste o áudio primeiro!')
      return
    }

    console.log('🚀 [INICIAR] Iniciando exercício...')
    
    const configuracao = niveis[nivel as keyof typeof niveis]
    setTempoRestante(configuracao.duracao)
    setAtivo(true)
    setPontuacao(0)
    setAcertos(0)
    setErros(0)
    setTotalTons(0)
    setExercicioConcluido(false)
    setJogoIniciado(true)
    setAguardandoResposta(false)
    setUltimoTom(null)
    setDebugInfo('Jogo iniciado!')

    // Garantir que AudioContext está ativo
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume()
    }
  }

  // 👆 PROCESSAR CLIQUE
  const processarClique = () => {
    console.log(`👆 [CLIQUE] Clique recebido. AguardandoResposta: ${aguardandoResposta}, UltimoTom: ${ultimoTom}`)
    
    if (!aguardandoResposta || !ultimoTom) {
      console.log('⚠️ [CLIQUE] Clique ignorado - não aguardando resposta ou sem tom ativo')
      return
    }
    
    console.log(`👆 [CLIQUE] Processando resposta para: ${ultimoTom} no nível ${nivel}`)
    
    // Limpar timeout pendente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      console.log('🧹 [CLIQUE] Timeout de resposta cancelado pelo clique')
    }
    
    if (ultimoTom === 'alvo') {
      setAcertos(prev => prev + 1)
      setPontuacao(prev => prev + 20 * nivel)
      console.log('✅ [CLIQUE] Acerto! Pontos adicionados.')
    } else {
      setErros(prev => prev + 1)
      setPontuacao(prev => Math.max(0, prev - 10))
      console.log('❌ [CLIQUE] Erro! Pontos deduzidos.')
    }
    
    // FORÇAR limpeza dos estados visuais
    console.log('🔄 [CLIQUE] Limpando estados visuais...')
    setAguardandoResposta(false)
    setUltimoTom(null)
    setDebugInfo(`Resposta processada nível ${nivel}`)
  }

  // 🏁 FINALIZAR EXERCÍCIO
  const finalizarExercicio = () => {
    console.log('🏁 [FINALIZAR] Finalizando exercício...')
    setAtivo(false)
    setAguardandoResposta(false)
    setUltimoTom(null)
    setExercicioConcluido(true)
  }

  // ⬆️ PRÓXIMO NÍVEL
  const proximoNivel = () => {
    if (nivel < 5) {
      setNivel(prev => prev + 1)
      setExercicioConcluido(false)
      setJogoIniciado(false)
    }
  }

  // ↩️ VOLTAR AO INÍCIO
  const voltarInicio = () => {
    console.log('↩️ [VOLTAR] Voltando ao início...')
    setJogoIniciado(false)
    setExercicioConcluido(false)
    setAtivo(false)
    setAguardandoResposta(false)
    setUltimoTom(null)
    setDebugInfo('Parado')
  }

  // Cálculos de estatísticas
  const totalRespostas = acertos + erros
  const precisao = totalRespostas > 0 ? Math.round((acertos / totalRespostas) * 100) : 0
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
              <h1 className="text-xl font-bold text-gray-800">🔊 Concentração Auditiva</h1>
              <div className="text-sm text-gray-600">Versão Robusta - Solução Definitiva</div>
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
            // Tela inicial
            <div className="space-y-6">
              {/* Objetivo */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🎯</span>
                  <h2 className="text-lg font-bold text-gray-800">Objetivo:</h2>
                </div>
                <p className="text-gray-700 border-l-4 border-blue-400 pl-4">
                  Identifique e clique apenas quando ouvir o <strong>tom alvo (800Hz - agudo)</strong>. 
                  Ignore os tons distratores (graves/médios). Treine sua atenção auditiva seletiva!
                </p>
              </div>

              {/* Instruções */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">📖</span>
                  <h2 className="text-lg font-bold text-gray-800">Como Jogar:</h2>
                </div>
                <div className="border-l-4 border-green-400 pl-4 space-y-2">
                  <p className="text-gray-700">🎯 <strong>Tom Alvo (800Hz):</strong> Som AGUDO - CLIQUE quando ouvir!</p>
                  <p className="text-gray-700">❌ <strong>Tons Distratores:</strong> Sons GRAVES/MÉDIOS - NÃO clique!</p>
                  <p className="text-gray-700">⏱️ <strong>Tempo:</strong> 2 segundos para responder a cada tom</p>
                  <p className="text-gray-700">👁️ <strong>Apoio Visual:</strong> Círculos coloridos como backup</p>
                </div>
              </div>

              {/* Status do Sistema */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🔧</span>
                  <h2 className="text-lg font-bold text-gray-800">Status do Sistema:</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className={`p-3 rounded-lg ${audioDisponivel ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className={`font-medium ${audioDisponivel ? 'text-green-800' : 'text-red-800'}`}>
                      {audioDisponivel ? '✅ Áudio Disponível' : '❌ Áudio Indisponível'}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${audioTestado ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                    <div className={`font-medium ${audioTestado ? 'text-blue-800' : 'text-yellow-800'}`}>
                      {audioTestado ? '✅ Áudio Testado' : '⏳ Teste Pendente'}
                    </div>
                  </div>
                  <div className="col-span-2 p-3 rounded-lg bg-gray-50">
                    <div className="font-medium text-gray-800">
                      🔍 Debug: {debugInfo}
                    </div>
                  </div>
                </div>
              </div>

              {/* Controles de Áudio */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">🔊</span>
                  <h2 className="text-lg font-bold text-gray-800">Configuração de Áudio:</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volume: {Math.round(volume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={testarAudio}
                      disabled={!audioDisponivel}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        audioDisponivel 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      🎵 Testar Tom Alvo
                    </button>
                    
                    <button
                      onClick={reativarAudio}
                      className="px-6 py-3 rounded-lg font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                    >
                      🔄 Reativar Áudio
                    </button>
                  </div>
                </div>
              </div>

              {/* Botão Iniciar */}
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🚀</div>
                <button
                  onClick={iniciarExercicio}
                  disabled={!audioDisponivel || !audioTestado}
                  className={`font-bold py-4 px-8 rounded-lg text-lg transition-all ${
                    audioDisponivel && audioTestado
                      ? 'bg-green-500 hover:bg-green-600 text-white transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🎮 Iniciar Concentração Auditiva
                </button>
                {(!audioDisponivel || !audioTestado) && (
                  <p className="text-sm text-red-600 mt-2">
                    ⚠️ Teste o áudio antes de iniciar
                  </p>
                )}
              </div>
            </div>
          ) : !exercicioConcluido ? (
            // Área de jogo ativa
            <div className="space-y-6">
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
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                    style={{ width: `${((niveis[nivel as keyof typeof niveis].duracao - tempoRestante) / niveis[nivel as keyof typeof niveis].duracao) * 100}%` }}
                  />
                </div>

                {/* Área do jogo */}
                <div 
                  className="relative bg-gradient-to-br from-blue-50 to-purple-50 cursor-pointer"
                  style={{ height: '500px', width: '100%' }}
                  onClick={processarClique}
                >
                  {/* Indicador central - APENAS O CÍRCULO */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    {aguardandoResposta && ultimoTom ? (
                      <div className={`w-40 h-40 rounded-full flex items-center justify-center text-white text-2xl font-bold animate-bounce shadow-2xl ${
                        ultimoTom === 'alvo' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {ultimoTom === 'alvo' ? (
                          <>🎯<br/>CLIQUE!</>
                        ) : (
                          <>❌<br/>NÃO!</>
                        )}
                      </div>
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        🔊<br/>ESCUTE...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botões de controle */}
              <div className="text-center space-x-4">
                <button
                  onClick={reativarAudio}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  🔊 Reativar Áudio
                </button>
                
                <button
                  onClick={voltarInicio}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  ↩️ Voltar ao Início
                </button>
              </div>
            </div>
          ) : (
            // Tela de resultados
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">
                {precisao >= 80 ? '🏆' : precisao >= 60 ? '🎯' : '💪'}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {precisao >= 80 ? 'Excelente!' : precisao >= 60 ? 'Bom Trabalho!' : 'Continue Treinando!'}
              </h3>
              
              <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{acertos}/{totalTons}</div>
                  <div className="text-sm text-gray-600">Acertos/Total</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{precisao}%</div>
                  <div className="text-sm text-gray-600">Precisão</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-green-600">{acertos}</div>
                  <div className="text-sm text-gray-600">Acertos</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-red-600">{erros}</div>
                  <div className="text-sm text-gray-600">Erros</div>
                </div>
              </div>
              
              <div className="space-x-4">
                {podeAvancar && (
                  <button
                    onClick={proximoNivel}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    ⬆️ Próximo Nível
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