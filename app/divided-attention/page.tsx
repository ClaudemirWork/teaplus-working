'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Save, ChevronLeft, Spline } from 'lucide-react' // Ícones adicionados
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient'

// Componente do Cabeçalho Padrão
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }) => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
                <Link
                    href="/dashboard"
                    className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                </Link>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </h1>
                {showSaveButton && onSave ? (
                    <button
                        onClick={onSave}
                        disabled={isSaveDisabled}
                        className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${
                            !isSaveDisabled
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <Save size={18} />
                        <span className="hidden sm:inline">{isSaveDisabled ? 'Salvando...' : 'Salvar'}</span>
                    </button>
                ) : (
                    <div className="w-24"></div>
                )}
            </div>
        </div>
    </header>
);


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
    
    // Estados para salvamento e métricas
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

    const niveis = {
        1: { duracao: 90, intervalObjetos: 2000, intervalTons: 4000, probObjetoAlvo: 0.4, probTomAlvo: 0.3, quantidadeObjetos: 3, velocidadeObjetos: 4000, nome: "Iniciante" },
        2: { duracao: 105, intervalObjetos: 1800, intervalTons: 3500, probObjetoAlvo: 0.35, probTomAlvo: 0.3, quantidadeObjetos: 4, velocidadeObjetos: 3500, nome: "Básico" },
        3: { duracao: 120, intervalObjetos: 1500, intervalTons: 3000, probObjetoAlvo: 0.3, probTomAlvo: 0.25, quantidadeObjetos: 5, velocidadeObjetos: 3000, nome: "Intermediário" },
        4: { duracao: 135, intervalObjetos: 1300, intervalTons: 2500, probObjetoAlvo: 0.25, probTomAlvo: 0.25, quantidadeObjetos: 6, velocidadeObjetos: 2500, nome: "Avançado" },
        5: { duracao: 150, intervalObjetos: 1000, intervalTons: 2000, probObjetoAlvo: 0.2, probTomAlvo: 0.2, quantidadeObjetos: 7, velocidadeObjetos: 2000, nome: "Expert" }
    }

    const tons = { alvo: 800, distrator1: 400, distrator2: 600, distrator3: 1000 }
    const cores = { alvo: '#10B981', distrator1: '#EF4444', distrator2: '#3B82F6', distrator3: '#F59E0B', distrator4: '#8B5CF6' }

    useEffect(() => {
        ativoRef.current = ativo
        nivelRef.current = nivel
    }, [ativo, nivel])

    useEffect(() => {
        const initAudio = async () => {
            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
                if (!AudioContextClass) throw new Error('Web Audio API não suportada')
                
                audioContextRef.current = new AudioContextClass()
                gainNodeRef.current = audioContextRef.current.createGain()
                gainNodeRef.current.connect(audioContextRef.current.destination)
                gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime)
                setAudioDisponivel(true)
            } catch (error) {
                console.error('Erro ao inicializar áudio:', error)
                setAudioDisponivel(false)
            }
        }
        initAudio()
        return () => {
            if (audioContextRef.current?.state !== 'closed') audioContextRef.current?.close()
        }
    }, [])

    useEffect(() => {
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime)
        }
    }, [volume])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (ativo && tempoRestante > 0) {
            timer = setTimeout(() => setTempoRestante(prev => prev - 1), 1000)
        } else if (tempoRestante === 0 && ativo) {
            finalizarExercicio()
        }
        return () => clearTimeout(timer)
    }, [ativo, tempoRestante])

    useEffect(() => {
        if (!ativo) {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current)
            return
        }
        const config = niveis[nivel as keyof typeof niveis]
        gameLoopRef.current = setInterval(() => { if (ativoRef.current) gerarObjetos() }, config.intervalObjetos)
        return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current) }
    }, [ativo, nivel])

    useEffect(() => {
        if (!ativo) {
            if (audioLoopRef.current) clearInterval(audioLoopRef.current)
            return
        }
        const config = niveis[nivel as keyof typeof niveis]
        setTimeout(() => { if (ativoRef.current) reproduzirTomJogo() }, 2000)
        audioLoopRef.current = setInterval(() => { if (ativoRef.current) reproduzirTomJogo() }, config.intervalTons)
        return () => { if (audioLoopRef.current) clearInterval(audioLoopRef.current) }
    }, [ativo, nivel])

    const reproduzirTom = useCallback(async (frequencia: number, duracao: number = 600): Promise<boolean> => {
        try {
            if (!audioContextRef.current || !gainNodeRef.current) return false
            if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume()

            const oscillator = audioContextRef.current.createOscillator()
            const envelope = audioContextRef.current.createGain()
            oscillator.connect(envelope)
            envelope.connect(gainNodeRef.current)
            oscillator.frequency.setValueAtTime(frequencia, audioContextRef.current.currentTime)
            oscillator.type = 'sine'
            
            const volumeAtual = volume * 0.3
            envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime)
            envelope.gain.linearRampToValueAtTime(volumeAtual, audioContextRef.current.currentTime + 0.05)
            envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + (duracao / 1000))
            
            oscillator.start(audioContextRef.current.currentTime)
            oscillator.stop(audioContextRef.current.currentTime + (duracao / 1000))
            return true
        } catch (error) {
            console.error('Erro ao reproduzir tom:', error)
            return false
        }
    }, [volume])

    const reproduzirTomJogo = useCallback(async () => {
        if (!ativoRef.current) return
        const config = niveis[nivelRef.current as keyof typeof niveis]
        const isAlvo = Math.random() < config.probTomAlvo
        const tipo = isAlvo ? 'alvo' : 'distrator'
        const frequencia = isAlvo ? tons.alvo : [tons.distrator1, tons.distrator2, tons.distrator3][Math.floor(Math.random() * 3)]
        
        if (isAlvo) setTotalTonsAlvo(prev => prev + 1)
        
        const sucesso = await reproduzirTom(frequencia, 600)
        if (sucesso) {
            const timestamp = Date.now()
            setTimestampUltimoTom(timestamp)
            setUltimoTom(tipo)
            setAguardandoTom(true)
            setTimeout(() => setAguardandoTom(false), 1500)
        }
    }, [reproduzirTom])

    const gerarObjetos = useCallback(() => {
        if (!ativoRef.current) return
        const config = niveis[nivelRef.current as keyof typeof niveis]
        const novosObjetos: any[] = []
        const timestamp = Date.now()
        setTimestampUltimoObjeto(timestamp)

        for (let i = 0; i < config.quantidadeObjetos; i++) {
            const isAlvo = Math.random() < config.probObjetoAlvo
            const tipo = isAlvo ? 'alvo' : 'distrator'
            const cor = isAlvo ? cores.alvo : [cores.distrator1, cores.distrator2, cores.distrator3, cores.distrator4][Math.floor(Math.random() * 4)]
            if (isAlvo) setTotalObjetosAlvo(prev => prev + 1)
            novosObjetos.push({ id: Date.now() + Math.random(), x: Math.random() * 80 + 10, y: Math.random() * 70 + 15, tipo, cor })
        }
        setObjetosNaTela(novosObjetos)
        setTimeout(() => setObjetosNaTela([]), config.velocidadeObjetos - 500)
    }, [])

    const testarAudio = useCallback(async () => {
        const sucesso = await reproduzirTom(tons.alvo, 1000)
        if (sucesso) setAudioTestado(true)
    }, [reproduzirTom])

    const clicarObjeto = (objeto: { id: number, tipo: 'alvo' | 'distrator' }) => {
        const tempoReacao = timestampUltimoObjeto ? Date.now() - timestampUltimoObjeto : 0
        if (objeto.tipo === 'alvo') {
            setObjetosCorretos(prev => prev + 1)
            setPontuacao(prev => prev + 15 * nivel)
            setTemposReacaoVisuais(prev => [...prev, tempoReacao])
        } else {
            setPontuacao(prev => Math.max(0, prev - 8))
        }
        setObjetosContados(prev => prev + 1)
        setObjetosNaTela(prev => prev.filter(obj => obj.id !== objeto.id))
    }

    const identificarTom = () => {
        if (!aguardandoTom || !ultimoTom) return
        const tempoReacao = timestampUltimoTom ? Date.now() - timestampUltimoTom : 0
        if (ultimoTom === 'alvo') {
            setTonsCorretos(prev => prev + 1)
            setPontuacao(prev => prev + 10 * nivel)
            setTemposReacaoAuditivos(prev => [...prev, tempoReacao])
        } else {
            setPontuacao(prev => Math.max(0, prev - 5))
        }
        setTonsIdentificados(prev => prev + 1)
        setAguardandoTom(false)
    }

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
        setTemposReacaoVisuais([])
        setTemposReacaoAuditivos([])
        setExercicioConcluido(false)
        setJogoIniciado(true)
        if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume()
    }

    const finalizarExercicio = () => {
        setAtivo(false)
        setExercicioConcluido(true)
        setObjetosNaTela([])
    }

    const proximoNivel = () => {
        if (nivel < 5) {
            setNivel(prev => prev + 1)
            setJogoIniciado(false)
        }
    }

    const voltarInicio = () => {
        setJogoIniciado(false)
        setExercicioConcluido(false)
        setAtivo(false)
    }

    // **CORREÇÃO:** Variáveis de precisão movidas para antes da função de salvar
    const precisaoObjetos = totalObjetosAlvo > 0 ? Math.round((objetosCorretos / totalObjetosAlvo) * 100) : 0
    const precisaoTons = totalTonsAlvo > 0 ? Math.round((tonsCorretos / totalTonsAlvo) * 100) : 0
    const precisaoGeral = (totalObjetosAlvo + totalTonsAlvo > 0) ? Math.round(((objetosCorretos + tonsCorretos) / (totalObjetosAlvo + totalTonsAlvo)) * 100) : 0
    const podeAvancar = precisaoGeral >= 65 && nivel < 5

    const handleSaveSession = async () => {
        if (!jogoIniciado) {
            alert('Nenhuma sessão foi iniciada para salvar.')
            return
        }
        setSalvando(true)
        const fimSessao = new Date()
        const duracaoFinalSegundos = Math.round((fimSessao.getTime() - inicioSessao.getTime()) / 1000)
        const tempoMedioReacaoVisual = temposReacaoVisuais.length > 0 ? temposReacaoVisuais.reduce((a, b) => a + b, 0) / temposReacaoVisuais.length : 0
        const tempoMedioReacaoAuditivo = temposReacaoAuditivos.length > 0 ? temposReacaoAuditivos.reduce((a, b) => a + b, 0) / temposReacaoAuditivos.length : 0

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) {
                alert('Sessão expirada. Por favor, faça login novamente.')
                router.push('/login')
                return
            }
            const { error } = await supabase
                .from('sessoes')
                .insert([{
                    usuario_id: user.id,
                    atividade_nome: 'Atenção_Dividida',
                    pontuacao_final: pontuacao,
                    data_fim: fimSessao.toISOString(),
                    observacoes: {
                        precisao_visual: precisaoObjetos,
                        precisao_auditiva: precisaoTons,
                        precisao_geral: precisaoGeral,
                        tempo_reacao_visual_ms: Math.round(tempoMedioReacaoVisual),
                        tempo_reacao_auditivo_ms: Math.round(tempoMedioReacaoAuditivo),
                        nivel_atingido: nivel,
                        duracao_total_segundos: duracaoFinalSegundos,
                    }
                }])

            if (error) {
                alert(`Erro ao salvar: ${error.message}`)
            } else {
                alert(`Sessão salva com sucesso!\n
📊 Resumo:
- Precisão Geral: ${precisaoGeral}%
- Precisão Visual: ${precisaoObjetos}%
- Precisão Auditiva: ${precisaoTons}%`)
                // **CORREÇÃO:** Redirecionamento ajustado
                router.push('/dashboard')
            }
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`)
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header PADRONIZADO implementado */}
            <GameHeader 
                title="Atenção Dividida"
                icon={<Spline size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={exercicioConcluido || (jogoIniciado && !ativo)}
            />

            <main className="p-4 sm:p-6 max-w-4xl mx-auto">
                {!jogoIniciado ? (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">🎯 Objetivo</h2>
                            <p className="text-gray-700">
                                Execute duas tarefas ao mesmo tempo: <strong>clique nos círculos VERDES</strong> e <strong>aperte o botão ao ouvir um TOM AGUDO</strong>.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-3">🔊 Configuração de Áudio</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Volume: {Math.round(volume * 100)}%</label>
                                    <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"/>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button onClick={testarAudio} disabled={!audioDisponivel} className="px-6 py-3 rounded-lg font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300">
                                        🎵 Testar Tom
                                    </button>
                                    <div className={`p-3 rounded-lg text-sm font-medium ${audioTestado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {audioTestado ? '✅ Áudio Testado' : '⏳ Teste Pendente'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center py-6">
                            <button onClick={iniciarExercicio} disabled={!audioTestado} className="font-bold py-4 px-8 rounded-lg text-lg transition-all bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed">
                                🚀 Iniciar Atividade
                            </button>
                            {!audioTestado && <p className="text-sm text-red-600 mt-2">⚠️ Teste o áudio antes de iniciar</p>}
                        </div>
                    </div>
                ) : !exercicioConcluido ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-blue-600">{pontuacao}</div><div className="text-sm text-gray-600">Pontos</div></div>
                            <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-orange-600">{tempoRestante}s</div><div className="text-sm text-gray-600">Tempo</div></div>
                            <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-green-600">{precisaoObjetos}%</div><div className="text-sm text-gray-600">Visual</div></div>
                            <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-purple-600">{precisaoTons}%</div><div className="text-sm text-gray-600">Auditiva</div></div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="h-2 bg-gray-200">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000" style={{ width: `${((niveis[nivel as keyof typeof niveis].duracao - tempoRestante) / niveis[nivel as keyof typeof niveis].duracao) * 100}%` }}/>
                            </div>
                            <div className="relative bg-gradient-to-br from-gray-100 to-blue-100" style={{ height: '400px', width: '100%' }}>
                                {objetosNaTela.map((objeto) => (
                                    <button key={objeto.id} onClick={() => clicarObjeto(objeto)} className="absolute w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 shadow-lg" style={{ left: `${objeto.x}%`, top: `${objeto.y}%`, backgroundColor: objeto.cor, transform: 'translate(-50%, -50%)' }}/>
                                ))}
                            </div>
                            <div className="p-4 bg-gray-200 flex justify-center">
                                <button onClick={identificarTom} disabled={!aguardandoTom} className={`px-8 py-4 rounded-lg font-bold text-lg transition-all w-full sm:w-auto ${aguardandoTom ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}>
                                    {aguardandoTom ? '🎯 OUVI O TOM AGUDO!' : '🔊 Aguardando Tom...'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">{precisaoGeral >= 80 ? '🏆' : '🎯'}</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">{precisaoGeral >= 80 ? 'Excelente Multitarefa!' : 'Boa Atenção Dividida!'}</h3>
                        <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                            <div className="bg-gray-100 rounded-lg p-4"><div className="text-lg font-bold">{precisaoGeral}%</div><div className="text-sm text-gray-600">Precisão Geral</div></div>
                            <div className="bg-gray-100 rounded-lg p-4"><div className="text-lg font-bold">{pontuacao}</div><div className="text-sm text-gray-600">Pontos</div></div>
                            <div className="bg-green-100 rounded-lg p-4"><div className="text-lg font-bold text-green-700">{precisaoObjetos}%</div><div className="text-sm text-gray-600">Precisão Visual</div></div>
                            <div className="bg-purple-100 rounded-lg p-4"><div className="text-lg font-bold text-purple-700">{precisaoTons}%</div><div className="text-sm text-gray-600">Precisão Auditiva</div></div>
                        </div>
                        <div className="space-x-4">
                            {podeAvancar && (
                                <button onClick={proximoNivel} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                    ⬆️ Próximo Nível
                                </button>
                            )}
                            <button onClick={voltarInicio} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                🔄 Jogar Novamente
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
