'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient'

export default function DividedAttention() {
  const router = useRouter()
  const supabase = createClient()
  
  // Estados principais
  const [nivel, setNivel] = useState(1)
  const [pontuacao, setPontuacao] = useState(0)
  const [tempoRestante, setTempoRestante] = useState(90)
  const [ativo, setAtivo] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [audioDisponivel, setAudioDisponivel] = useState(false)
  const [audioTestado, setAudioTestado] = useState(false)
  
  // Estados do jogo
  const [exercicioConcluido, setExercicioConcluido] = useState(false)
  const [jogoIniciado, setJogoIniciado] = useState(false)
  
  // Estados das tarefas
  const [objetosContados, setObjetosContados] = useState(0)
  const [objetosCorretos, setObjetosCorretos] = useState(0)
  const [tonsIdentificados, setTonsIdentificados] = useState(0)
  const [tonsCorretos, setTonsCorretos] = useState(0)
  const [totalObjetosAlvo, setTotalObjetosAlvo] = useState(0)
  const [totalTonsAlvo, setTotalTonsAlvo] = useState(0)
  
  // Estados visuais
  const [objetosNaTela, setObjetosNaTela] = useState<Array<{id: number, x: number, y: number, tipo: 'alvo' | 'distrator', cor: string}>>([])
  const [ultimoTom, setUltimoTom] = useState<'alvo' | 'distrator' | null>(null)
  const [aguardandoTom, setAguardandoTom] = useState(false)
  
  // Estados para salvamento e métricas científicas
  const [salvando, setSalvando] = useState(false)
  const [inicioSessao] = useState(new Date())
  const [temposReacaoVisuais, setTemposReacaoVisuais] = useState<number[]>([])
  const [temposReacaoAuditivos, setTemposReacaoAuditivos] = useState<number[]>([])
  const [historicoAcoes, setHistoricoAcoes] = useState<any[]>([])
  const [timestampUltimoObjeto, setTimestampUltimoObjeto] = useState<number | null>(null)
  const [timestampUltimoTom, setTimestampUltimoTom] = useState<number | null>(null)
  
  // Refs para controle
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const audioLoopRef = useRef<NodeJS.Timeout | null>(null)
  const ativoRef = useRef(false)
  const nivelRef = useRef(1)

  // Configurações por nível
  const niveis = {
    1: { 
      duracao: 90, 
      intervalObjetos: 2000, 
      intervalTons: 4000,
      probObjetoAlvo: 0.4,
      probTomAlvo: 0.3,
      quantidadeObjetos: 3,
      velocidadeObjetos: 4000,
      nome: "Iniciante (1.5min)" 
    },
    2: { 
      duracao: 105, 
      intervalObjetos: 1800, 
      intervalTons: 3500,
      probObjetoAlvo: 0.35,
      probTomAlvo: 0.3,
      quantidadeObjetos: 4,
      velocidadeObjetos: 3500,
      nome: "Básico (1.75min)" 
    },
    3: { 
      duracao: 120, 
      intervalObjetos: 1500, 
      intervalTons: 3000,
      probObjetoAlvo: 0.3,
      probTomAlvo: 0.25,
      quantidadeObjetos: 5,
      velocidadeObjetos: 3000,
      nome: "Intermediário (2min)" 
    },
    4: { 
      duracao: 135, 
      intervalObjetos: 1300, 
      intervalTons: 2500,
      probObjetoAlvo: 0.25,
      probTomAlvo: 0.25,
      quantidadeObjetos: 6,
      velocidadeObjetos: 2500,
      nome: "Avançado (2.25min)" 
    },
    5: { 
      duracao: 150, 
      intervalObjetos: 1000, 
      intervalTons: 2000,
      probObjetoAlvo: 0.2,
      probTomAlvo: 0.2,
      quantidadeObjetos: 7,
      velocidadeObjetos: 2000,
      nome: "Expert (2.5min)" 
    }
  }

  // Tons para tarefa auditiva
  const tons = {
    alvo: 800,      // Tom agudo - contar este
    distrator1: 400, // Tom grave - ignorar
    distrator2: 600, // Tom médio - ignorar
    distrator3: 1000 // Tom muito agudo - ignorar
  }

  // Cores para objetos
  const cores = {
    alvo: '#10B981',      // Verde - contar este
    distrator1: '#EF4444', // Vermelho - ignorar
    distrator2: '#3B82F6', // Azul - ignorar
    distrator3: '#F59E0B', // Amarelo - ignorar
    distrator4: '#8B5CF6'  // Roxo - ignorar
  }

  // Sincronizar refs
  useEffect(() => {
    ativoRef.current = ativo
    nivelRef.current = nivel
  }, [ativo, nivel])

  // Inicializar áudio
  useEffect(() => {
    const initAudio = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioContextClass) {
          throw new Error('Web Audio API não suportada')
        }
        
        audioContextRef.current = new AudioContextClass()
        gainNodeRef.current = audioContextRef.current.createGain()
        gainNodeRef.current.connect(audioContextRef.current.destination)
        gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime)
        
        setAudioDisponivel(true)
        console.log('✅ [AUDIO] Sistema de áudio inicializado')
        
      } catch (error) {
        console.error('❌ [AUDIO] Erro ao inicializar áudio:', error)
        setAudioDisponivel(false)
      }
    }

    initAudio()

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Atualizar volume
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime)
    }
  }, [volume])

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

  // Loop de objetos visuais
  useEffect(() => {
    if (!ativo) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
      return
    }

    const config = niveis[nivel as keyof typeof niveis]
    
    gameLoopRef.current = setInterval(() => {
      if (ativoRef.current) {
        gerarObjetos()
      }
    }, config.intervalObjetos)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }
  }, [ativo, nivel])

  // Loop de tons auditivos
  useEffect(() => {
    if (!ativo) {
      if (audioLoopRef.current) {
        clearInterval(audioLoopRef.current)
        audioLoopRef.current = null
      }
      return
    }

    const config = niveis[nivel as keyof typeof niveis]
    
    // Primeiro tom após 2 segundos
    setTimeout(() => {
      if (ativoRef.current) {
        reproduzirTomJogo()
      }
    }, 2000)
    
    audioLoopRef.current = setInterval(() => {
      if (ativoRef.current) {
        reproduzirTomJogo()
      }
    }, config.intervalTons)

    return () => {
      if (audioLoopRef.current) {
        clearInterval(audioLoopRef.current)
        audioLoopRef.current = null
      }
    }
  }, [ativo, nivel])

  // Reproduzir tom
  const reproduzirTom = useCallback(async (frequencia: number, duracao: number = 600): Promise<boolean> => {
    try {
      if (!audioContextRef.current || !gainNodeRef.current) {
        return false
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      const oscillator = audioContextRef.current.createOscillator()
      const envelope = audioContextRef.current.createGain()
      
      oscillator.connect(envelope)
      envelope.connect(gainNodeRef.current)
      
      oscillator.frequency.setValueAtTime(frequencia, audioContextRef.current.currentTime)
      oscillator.type = 'sine'
      
      const volumeAtual = volume * 0.3
      envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime)
      envelope.gain.linearRampToValueAtTime(volumeAtual, audioContextRef.current.currentTime + 0.05)
      envelope.gain.linearRampToValueAtTime(volumeAtual, audioContextRef.current.currentTime + (duracao / 1000) - 0.05)
      envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + (duracao / 1000))
      
      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + (duracao / 1000))
      
      return true
      
    } catch (error) {
      console.error('❌ [TOM] Erro ao reproduzir:', error)
      return false
    }
  }, [volume])

  // Reproduzir tom do jogo
  const reproduzirTomJogo = useCallback(async () => {
    if (!ativoRef.current) return

    const config = niveis[nivelRef.current as keyof typeof niveis]
    const isAlvo = Math.random() < config.probTomAlvo
    
    let frequencia: number
    let tipo: 'alvo' | 'distrator'
    
    if (isAlvo) {
      frequencia = tons.alvo
      tipo = 'alvo'
      setTotalTonsAlvo(prev => prev + 1)
    } else {
      const distratores = [tons.distrator1, tons.distrator2, tons.distrator3]
      frequencia = distratores[Math.floor(Math.random() * distratores.length)]
      tipo = 'distrator'
    }
    
    console.log(`🎵 [TOM] ${tipo} - ${frequencia}Hz`)
    
    const sucesso = await reproduzirTom(frequencia, 600)
    
    if (sucesso) {
      const timestamp = Date.now()
      setTimestampUltimoTom(timestamp)
      setUltimoTom(tipo)
      setAguardandoTom(true)
      
      // Registrar no histórico
      setHistoricoAcoes(prev => [...prev, {
        timestamp: new Date(),
        tipo: 'tom_reproduzido',
        categoria: tipo,
        frequencia,
        nivel: nivelRef.current
      }])
      
      setTimeout(() => {
        setUltimoTom(null)
        setAguardandoTom(false)
        setTimestampUltimoTom(null)
      }, 1500)
    }
  }, [reproduzirTom])

  // Gerar objetos na tela
  const gerarObjetos = useCallback(() => {
    if (!ativoRef.current) return

    const config = niveis[nivelRef.current as keyof typeof niveis]
    const novosObjetos: Array<{id: number, x: number, y: number, tipo: 'alvo' | 'distrator', cor: string}> = []
    const timestamp = Date.now()
    
    setTimestampUltimoObjeto(timestamp)
    
    for (let i = 0; i < config.quantidadeObjetos; i++) {
      const isAlvo = Math.random() < config.probObjetoAlvo
      const id = Date.now() + Math.random()
      
      let cor: string
      let tipo: 'alvo' | 'distrator'
      
      if (isAlvo) {
        cor = cores.alvo
        tipo = 'alvo'
        setTotalObjetosAlvo(prev => prev + 1)
      } else {
        const coresDistratoras = [cores.distrator1, cores.distrator2, cores.distrator3, cores.distrator4]
        cor = coresDistratoras[Math.floor(Math.random() * coresDistratoras.length)]
        tipo = 'distrator'
      }
      
      novosObjetos.push({
        id,
        x: Math.random() * 80 + 10, // 10% a 90% da largura
        y: Math.random() * 70 + 15, // 15% a 85% da altura
        tipo,
        cor
      })
    }
    
    // Registrar no histórico
    setHistoricoAcoes(prev => [...prev, {
      timestamp: new Date(),
      tipo: 'objetos_gerados',
      quantidade_alvos: novosObjetos.filter(obj => obj.tipo === 'alvo').length,
      quantidade_total: novosObjetos.length,
      nivel: nivelRef.current
    }])
    
    setObjetosNaTela(novosObjetos)
    
    // Remover objetos após um tempo
    setTimeout(() => {
      if (ativoRef.current) {
        setObjetosNaTela([])
        setTimestampUltimoObjeto(null)
      }
    }, config.velocidadeObjetos - 500)
    
  }, [])

  // Teste de áudio
  const testarAudio = useCallback(async () => {
    const sucesso = await reproduzirTom(tons.alvo, 1000)
    if (sucesso) {
      setAudioTestado(true)
    }
  }, [reproduzirTom])

  // Reativar áudio
  const reativarAudio = useCallback(async () => {
    if (!audioContextRef.current) return

    try {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      await reproduzirTom(tons.alvo, 500)
    } catch (error) {
      console.error('❌ [REATIVAR] Erro:', error)
    }
  }, [reproduzirTom])

  // Clique em objeto
  const clicarObjeto = (objeto: {id: number, x: number, y: number, tipo: 'alvo' | 'distrator', cor: string}) => {
    const tempoReacao = timestampUltimoObjeto ? Date.now() - timestampUltimoObjeto : 0
    
    if (objeto.tipo === 'alvo') {
      setObjetosContados(prev => prev + 1)
      setObjetosCorretos(prev => prev + 1)
      setPontuacao(prev => prev + 15 * nivel)
      setTemposReacaoVisuais(prev => [...prev, tempoReacao])
      console.log('✅ [OBJETO] Objeto alvo clicado!')
    } else {
      setObjetosContados(prev => prev + 1)
      setPontuacao(prev => Math.max(0, prev - 8))
      console.log('❌ [OBJETO] Objeto distrator clicado!')
    }
    
    // Registrar no histórico
    setHistoricoAcoes(prev => [...prev, {
      timestamp: new Date(),
      tipo: 'objeto_clicado',
      categoria: objeto.tipo,
      tempo_reacao: tempoReacao,
      correto: objeto.tipo === 'alvo',
      pontuacao_mudanca: objeto.tipo === 'alvo' ? 15 * nivel : -8,
      nivel: nivel
    }])
    
    // Remover objeto clicado
    setObjetosNaTela(prev => prev.filter(obj => obj.id !== objeto.id))
  }

  // Botão de tom identificado
  const identificarTom = () => {
    if (!aguardandoTom || !ultimoTom) return
    
    const tempoReacao = timestampUltimoTom ? Date.now() - timestampUltimoTom : 0
    
    if (ultimoTom === 'alvo') {
      setTonsIdentificados(prev => prev + 1)
      setTonsCorretos(prev => prev + 1)
      setPontuacao(prev => prev + 10 * nivel)
      setTemposReacaoAuditivos(prev => [...prev, tempoReacao])
      console.log('✅ [TOM] Tom alvo identificado!')
    } else {
      setTonsIdentificados(prev => prev + 1)
      setPontuacao(prev => Math.max(0, prev - 5))
      console.log('❌ [TOM] Tom distrator identificado!')
    }
    
    // Registrar no histórico
    setHistoricoAcoes(prev => [...prev, {
      timestamp: new Date(),
      tipo: 'tom_identificado',
      categoria: ultimoTom,
      tempo_reacao: tempoReacao,
      correto: ultimoTom === 'alvo',
      pontuacao_mudanca: ultimoTom === 'alvo' ? 10 * nivel : -5,
      nivel: nivel
    }])
    
    setUltimoTom(null)
    setAguardandoTom(false)
    setTimestampUltimoTom(null)
  }

  // Iniciar exercício
  const iniciarExercicio = () => {
    if (!audioDisponivel || !audioTestado) {
      alert('Por favor, teste o áudio primeiro!')
      return
    }

    const configuracao = niveis[nivel as keyof typeof niveis]
    setTempoRestante(configuracao.duracao)
    setAtivo(true)
    setPontuacao(0)
    setObjetosContados(0)
    setObjetosCorretos(0)
    setTonsIdentificados(0)
    setTonsCorretos(0)
    setTotalObjetosAlvo(0)
    setTotalTonsAlvo(0)
    setExercicioConcluido(false)
    setJogoIniciado(true)
    setObjetosNaTela([])
    setUltimoTom(null)
    setAguardandoTom(false)
    
    // Reset métricas científicas
    setTemposReacaoVisuais([])
    setTemposReacaoAuditivos([])
    setHistoricoAcoes([])
    setTimestampUltimoObjeto(null)
    setTimestampUltimoTom(null)

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume()
    }

    console.log('🚀 [JOGO] Atenção Dividida iniciada!')
  }

  // Finalizar exercício
  const finalizarExercicio = () => {
    setAtivo(false)
    setExercicioConcluido(true)
    setObjetosNaTela([])
    setUltimoTom(null)
    setAguardandoTom(false)
    setTimestampUltimoObjeto(null)
    setTimestampUltimoTom(null)
    console.log('🏁 [JOGO] Exercício finalizado!')
  }

  // Próximo nível
  const proximoNivel = () => {
    if (nivel < 5) {
      setNivel(prev => prev + 1)
      setExercicioConcluido(false)
      setJogoIniciado(false)
    }
  }

  // Voltar ao início
  const voltarInicio = () => {
    setJogoIniciado(false)
    setExercicioConcluido(false)
    setAtivo(false)
    setObjetosNaTela([])
    setUltimoTom(null)
    setAguardandoTom(false)
    setTimestampUltimoObjeto(null)
    setTimestampUltimoTom(null)
  }

  // FUNÇÃO DE SALVAMENTO - IGUAL AO CAA
  const handleSaveSession = async () => {
    if (!jogoIniciado) {
      alert('Nenhuma sessão foi iniciada para salvar.')
      return
    }
    
    setSalvando(true)
    
    const fimSessao = new Date()
    const duracaoFinalSegundos = Math.round((fimSessao.getTime() - inicioSessao.getTime()) / 1000)
    
    // Cálculos de métricas científicas
    const tempoMedioReacaoVisual = temposReacaoVisuais.length > 0 ? 
      temposReacaoVisuais.reduce((a, b) => a + b, 0) / temposReacaoVisuais.length : 0
    
    const tempoMedioReacaoAuditivo = temposReacaoAuditivos.length > 0 ? 
      temposReacaoAuditivos.reduce((a, b) => a + b, 0) / temposReacaoAuditivos.length : 0
    
    const variabilidadeVisual = temposReacaoVisuais.length > 1 ? 
      Math.sqrt(temposReacaoVisuais.reduce((acc, val) => acc + Math.pow(val - tempoMedioReacaoVisual, 2), 0) / (temposReacaoVisuais.length - 1)) : 0
    
    const variabilidadeAuditiva = temposReacaoAuditivos.length > 1 ? 
      Math.sqrt(temposReacaoAuditivos.reduce((acc, val) => acc + Math.pow(val - tempoMedioReacaoAuditivo, 2), 0) / (temposReacaoAuditivos.length - 1)) : 0
    
    const custoDualTask = ((totalObjetosAlvo + totalTonsAlvo) > 0) ? 
      (((totalObjetosAlvo - objetosCorretos) + (totalTonsAlvo - tonsCorretos)) / (totalObjetosAlvo + totalTonsAlvo)) * 100 : 0
    
    try {
      // Obter o usuário atual - EXATAMENTE COMO NO CAA
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Erro ao obter usuário:', userError)
        alert('Erro: Sessão expirada. Por favor, faça login novamente.')
        router.push('/login')
        return
      }
      
      // Salvar na tabela sessoes
      const { data, error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Atenção_Dividida',
          pontuacao_final: pontuacao,
          taxa_acerto: precisaoGeral,
          tempo_reacao_medio: Math.round((tempoMedioReacaoVisual + tempoMedioReacaoAuditivo) / 2),
          data_fim: fimSessao.toISOString(),
          observacoes: {
            // Métricas por tarefa
            precisao_visual: precisaoObjetos,
            precisao_auditiva: precisaoTons,
            precisao_geral: precisaoGeral,
            
            // Tempos de reação detalhados
            tempo_reacao_visual_ms: Math.round(tempoMedioReacaoVisual),
            tempo_reacao_auditivo_ms: Math.round(tempoMedioReacaoAuditivo),
            variabilidade_visual_ms: Math.round(variabilidadeVisual),
            variabilidade_auditiva_ms: Math.round(variabilidadeAuditiva),
            
            // Dual-task metrics
            custo_dual_task_pct: Math.round(custoDualTask * 100) / 100,
            total_acoes_visuais: objetosContados,
            total_acoes_auditivas: tonsIdentificados,
            
            // Progressão e contexto
            nivel_atingido: nivel,
            nivel_configuracao: niveis[nivel as keyof typeof niveis],
            duracao_total_segundos: duracaoFinalSegundos,
            
            // Contadores detalhados
            objetos_corretos: objetosCorretos,
            objetos_total_alvo: totalObjetosAlvo,
            tons_corretos: tonsCorretos,
            tons_total_alvo: totalTonsAlvo,
            
            // Sequência temporal completa
            historico_completo: historicoAcoes,
            
            // Métricas de consistência
            consistencia_visual: temposReacaoVisuais.length > 0 ? 
              (variabilidadeVisual / tempoMedioReacaoVisual) : 0,
            consistencia_auditiva: temposReacaoAuditivos.length > 0 ? 
              (variabilidadeAuditiva / tempoMedioReacaoAuditivo) : 0,
              
            // Estratégia de priorizacao
            proporcao_visual_auditiva: tonsIdentificados > 0 ? 
              objetosContados / tonsIdentificados : objetosContados,
              
            // Timestamp da sessão
            timestamp_inicio: inicioSessao.toISOString(),
            timestamp_fim: fimSessao.toISOString()
          }
        }])

      if (error) {
        console.error('Erro ao salvar:', error)
        alert(`Erro ao salvar: ${error.message}`)
      } else {
        alert(`Sessão de Atenção Dividida salva com sucesso!
        
📊 Resumo da Performance:
- Precisão Geral: ${precisaoGeral}%
- Precisão Visual: ${precisaoObjetos}%  
- Precisão Auditiva: ${precisaoTons}%
- Tempo Reação Médio: ${Math.round((tempoMedioReacaoVisual + tempoMedioReacaoAuditivo) / 2)}ms
- Custo Dual-Task: ${Math.round(custoDualTask * 100) / 100}%
- Nível Atingido: ${nivel}
- Duração: ${Math.round(duracaoFinalSegundos / 60)}min${duracaoFinalSegundos % 60}s`)
        
        router.push('/profileselection')
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error)
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setSalvando(false)
    }
  }

  // Cálculos de precisão
  const precisaoObjetos = totalObjetosAlvo > 0 ? Math.round((objetosCorretos / totalObjetosAlvo) * 100) : 0
  const precisaoTons = totalTonsAlvo > 0 ? Math.round((tonsCorretos / totalTonsAlvo) * 100) : 0
  const precisaoGeral = Math.round((precisaoObjetos + precisaoTons) / 2)
  const podeAvancar = precisaoGeral >= 65 && nivel < 5

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="text-sm sm:text-base">← Voltar</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">🧠 Atenção Dividida</h1>
              <div className="text-sm text-gray-600">Multitarefa Controlada</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-semibold text-blue-600">Nível {nivel}</div>
                <div className="text-sm text-gray-600">{niveis[nivel as keyof typeof niveis].nome}</div>
              </div>
              
              {jogoIniciado && (
                <button 
                  onClick={handleSaveSession}
                  disabled={salvando}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:bg-green-400"
                >
                  <Save size={20} />
                  <span>{salvando ? 'Salvando...' : 'Finalizar e Salvar'}</span>
                </button>
              )}
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
                  Execute duas tarefas simultaneamente: <strong>conte círculos VERDES na tela</strong> e <strong>identifique tons AGUDOS no áudio</strong>. 
                  Desenvolva sua capacidade de atenção dividida e multitarefa controlada.
                </p>
              </div>

              {/* Pontuação */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">⭐</span>
                  <h2 className="text-lg font-bold text-gray-800">Pontuação:</h2>
                </div>
                <div className="border-l-4 border-green-400 pl-4 space-y-1">
                  <p className="text-gray-700"><strong>Círculo Verde (alvo):</strong> +15 pontos × nível</p>
                  <p className="text-gray-700"><strong>Tom Agudo (alvo):</strong> +10 pontos × nível</p>
                  <p className="text-gray-700"><strong>Erro em círculo:</strong> -8 pontos</p>
                  <p className="text-gray-700"><strong>Erro em tom:</strong> -5 pontos</p>
                  <p className="text-gray-700"><strong>Meta:</strong> 65% de precisão geral para avançar</p>
                </div>
              </div>

              {/* Níveis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">📊</span>
                  <h2 className="text-lg font-bold text-gray-800">Níveis:</h2>
                </div>
                <div className="border-l-4 border-purple-400 pl-4 space-y-1">
                  <p className="text-gray-700"><strong>Nível 1:</strong> Círculos a cada 2s, tons a cada 4s (1.5min)</p>
                  <p className="text-gray-700"><strong>Nível 2:</strong> Círculos a cada 1.8s, tons a cada 3.5s (1.75min)</p>
                  <p className="text-gray-700"><strong>Nível 3:</strong> Círculos a cada 1.5s, tons a cada 3s (2min)</p>
                  <p className="text-gray-700"><strong>Nível 4:</strong> Círculos a cada 1.3s, tons a cada 2.5s (2.25min)</p>
                  <p className="text-gray-700"><strong>Nível 5:</strong> Círculos a cada 1s, tons a cada 2s (2.5min)</p>
                </div>
              </div>

              {/* Base Científica */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🧠</span>
                  <h2 className="text-lg font-bold text-gray-800">Base Científica:</h2>
                </div>
                <p className="text-gray-700">
                  Este exercício é baseado em pesquisas sobre atenção dividida e funções executivas em pessoas com TEA e TDAH. 
                  O treinamento de multitarefa controlada fortalece a capacidade de gerenciar múltiplas demandas atencionais simultaneamente, 
                  uma habilidade crucial para o funcionamento acadêmico e profissional.
                </p>
              </div>

              {/* Instruções */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">📖</span>
                  <h2 className="text-lg font-bold text-gray-800">Como Jogar:</h2>
                </div>
                <div className="border-l-4 border-indigo-400 pl-4 space-y-2">
                  <p className="text-gray-700">🟢 <strong>Tarefa Visual:</strong> Clique APENAS nos círculos VERDES</p>
                  <p className="text-gray-700">🔴 <strong>Ignore:</strong> Círculos vermelhos, azuis, amarelos e roxos</p>
                  <p className="text-gray-700">🎵 <strong>Tarefa Auditiva:</strong> Clique no botão quando ouvir tons AGUDOS</p>
                  <p className="text-gray-700">🎯 <strong>Multitarefa:</strong> Execute AMBAS as tarefas simultaneamente</p>
                  <p className="text-gray-700">⚡ <strong>Atenção:</strong> Velocidade aumenta progressivamente</p>
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
                  </div>
                </div>
              </div>

              {/* Botão Iniciar */}
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🧠</div>
                <button
                  onClick={iniciarExercicio}
                  disabled={!audioDisponivel || !audioTestado}
                  className={`font-bold py-4 px-8 rounded-lg text-lg transition-all ${
                    audioDisponivel && audioTestado
                      ? 'bg-purple-500 hover:bg-purple-600 text-white transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🚀 Iniciar Atenção Dividida
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
              <div className="grid grid-cols-6 gap-4">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-blue-600">{pontuacao}</div>
                  <div className="text-sm text-gray-600">Pontos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-orange-600">{tempoRestante}s</div>
                  <div className="text-sm text-gray-600">Restante</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-green-600">{objetosCorretos}/{totalObjetosAlvo}</div>
                  <div className="text-sm text-gray-600">Objetos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-purple-600">{tonsCorretos}/{totalTonsAlvo}</div>
                  <div className="text-sm text-gray-600">Tons</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-indigo-600">{precisaoObjetos}%</div>
                  <div className="text-sm text-gray-600">Visual</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-xl font-bold text-pink-600">{precisaoTons}%</div>
                  <div className="text-sm text-gray-600">Auditiva</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Barra de progresso */}
                <div className="h-2 bg-gray-200">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                    style={{ width: `${((niveis[nivel as keyof typeof niveis].duracao - tempoRestante) / niveis[nivel as keyof typeof niveis].duracao) * 100}%` }}
                  />
                </div>

                {/* Área do jogo */}
                <div 
                  className="relative bg-gradient-to-br from-gray-50 to-blue-50"
                  style={{ height: '400px', width: '100%' }}
                >
                  {/* Objetos na tela */}
                  {objetosNaTela.map((objeto) => (
                    <button
                      key={objeto.id}
                      onClick={() => clicarObjeto(objeto)}
                      className="absolute w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                      style={{
                        left: `${objeto.x}%`,
                        top: `${objeto.y}%`,
                        backgroundColor: objeto.cor,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                  
                  {/* Instruções no canto superior direito - AJUSTE APLICADO */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
                      <div className="font-bold text-xs">🟢 VERDES | 🎵 AGUDOS</div>
                      <div className="text-xs opacity-90">Tempo: {tempoRestante}s</div>
                    </div>
                  </div>
                </div>

                {/* Controle de tom */}
                <div className="p-4 bg-gray-50 flex justify-center">
                  <button
                    onClick={identificarTom}
                    disabled={!aguardandoTom}
                    className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                      aguardandoTom && ultimoTom === 'alvo'
                        ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse'
                        : aguardandoTom
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {aguardandoTom 
                      ? (ultimoTom === 'alvo' ? '🎯 TOM AGUDO - CLIQUE!' : '❌ Tom Grave - Não clique')
                      : '🔊 Aguardando Tom...'
                    }
                  </button>
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
                {precisaoGeral >= 80 ? '🏆' : precisaoGeral >= 65 ? '🎯' : '💪'}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {precisaoGeral >= 80 ? 'Excelente Multitarefa!' : precisaoGeral >= 65 ? 'Boa Atenção Dividida!' : 'Continue Praticando!'}
              </h3>
              
              <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{precisaoGeral}%</div>
                  <div className="text-sm text-gray-600">Precisão Geral</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-gray-800">{pontuacao}</div>
                  <div className="text-sm text-gray-600">Pontos Totais</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-green-600">{precisaoObjetos}%</div>
                  <div className="text-sm text-gray-600">Tarefa Visual</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-lg font-bold text-purple-600">{precisaoTons}%</div>
                  <div className="text-sm text-gray-600">Tarefa Auditiva</div>
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
