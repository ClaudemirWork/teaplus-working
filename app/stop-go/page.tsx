'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Save, TrafficCone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient'

// Componente do Cabeçalho Padrão
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }) => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">

                {/* 1. Botão Voltar (Esquerda) */}
                <Link
                    href="/dashboard"
                    className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                </Link>

                {/* 2. Título Centralizado (Meio) */}
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </h1>

                {/* 3. Botão de Ação ou Espaçador (Direita) */}
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
                    // Espaçador para manter o título centralizado
                    <div className="w-24"></div>
                )}
            </div>
        </div>
    </header>
);


export default function StopGo() {
    const router = useRouter()
    const supabase = createClient()
    
    const [nivel, setNivel] = useState(1)
    const [pontuacao, setPontuacao] = useState(0)
    const [duracao, setDuracao] = useState(60)
    const [tempoRestante, setTempoRestante] = useState(60)
    const [ativo, setAtivo] = useState(false)
    const [sinalVisivel, setSinalVisivel] = useState(false)
    const [tipoSinal, setTipoSinal] = useState<'go' | 'stop'>('go')
    const [aguardandoStop, setAguardandoStop] = useState(false)
    const [tempoAparicao, setTempoAparicao] = useState(0)
    const [exercicioConcluido, setExercicioConcluido] = useState(false)
    const [jogoIniciado, setJogoIniciado] = useState(false)
    const [salvando, setSalvando] = useState(false)
    
    // Métricas
    const [goRTs, setGoRTs] = useState<number[]>([])
    const [stopSuccesses, setStopSuccesses] = useState(0)
    const [stopFailures, setStopFailures] = useState(0)
    const [goCorrect, setGoCorrect] = useState(0)
    const [goOmissions, setGoOmissions] = useState(0)
    const [currentSSD, setCurrentSSD] = useState(250)
    const [allSSDs, setAllSSDs] = useState<number[]>([])
    const [totalGo, setTotalGo] = useState(0)
    const [totalStop, setTotalStop] = useState(0)

    // Configurações por nível
    const niveis = {
        1: { duracao: 60, intervaloMin: 2000, intervaloMax: 4000, nome: "Iniciante (1min)" },
        2: { duracao: 90, intervaloMin: 1800, intervaloMax: 3500, nome: "Básico (1.5min)" },
        3: { duracao: 120, intervaloMin: 1500, intervaloMax: 3000, nome: "Intermediário (2min)" },
        4: { duracao: 150, intervaloMin: 1200, intervaloMax: 2500, nome: "Avançado (2.5min)" },
        5: { duracao: 180, intervaloMin: 1000, intervaloMax: 2000, nome: "Expert (3min)" }
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

    // Controle de aparição dos sinais
    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (ativo && !sinalVisivel && !aguardandoStop) {
            const config = niveis[nivel as keyof typeof niveis]
            const intervalo = Math.random() * (config.intervaloMax - config.intervaloMin) + config.intervaloMin
            
            timeout = setTimeout(() => {
                mostrarSinal()
            }, intervalo)
        }
        return () => clearTimeout(timeout)
    }, [ativo, sinalVisivel, aguardandoStop, nivel])

    // Stop Signal com delay adaptativo
    useEffect(() => {
        let stopTimeout: NodeJS.Timeout
        if (aguardandoStop) {
            stopTimeout = setTimeout(() => {
                setTipoSinal('stop')
                
                setTimeout(() => {
                    if (aguardandoStop) {
                        setStopFailures(prev => prev + 1)
                        setCurrentSSD(prev => Math.max(50, prev - 50))
                        setAllSSDs(prev => [...prev, currentSSD])
                        setAguardandoStop(false)
                        setSinalVisivel(false)
                    }
                }, 1000) 
            }, currentSSD)
        }
        return () => clearTimeout(stopTimeout)
    }, [aguardandoStop, currentSSD])

    const iniciarExercicio = () => {
        const configuracao = niveis[nivel as keyof typeof niveis]
        setDuracao(configuracao.duracao)
        setTempoRestante(configuracao.duracao)
        setAtivo(true)
        setPontuacao(0)
        setGoRTs([])
        setStopSuccesses(0)
        setStopFailures(0)
        setGoCorrect(0)
        setGoOmissions(0)
        setCurrentSSD(250)
        setAllSSDs([])
        setTotalGo(0)
        setTotalStop(0)
        setExercicioConcluido(false)
        setSinalVisivel(false)
        setJogoIniciado(true)
    }

    const mostrarSinal = () => {
        if (!ativo) return
        
        const isStop = Math.random() < 0.25
        
        if (isStop) {
            setTotalStop(prev => prev + 1)
            setTipoSinal('go') 
            setAguardandoStop(true)
        } else {
            setTotalGo(prev => prev + 1)
            setTipoSinal('go')
            setAguardandoStop(false)
        }
        
        setSinalVisivel(true)
        setTempoAparicao(Date.now())
        
        if (!isStop) {
            setTimeout(() => {
                // Usando um callback para verificar o estado mais recente
                setSinalVisivel(currentSinalVisivel => {
                    if (currentSinalVisivel) {
                        setGoOmissions(prev => prev + 1);
                        return false; // Esconde o sinal
                    }
                    return currentSinalVisivel;
                });
            }, 2000)
        }
    }
    
    const clicarBotao = () => {
        if (!sinalVisivel || !ativo) return
        
        const tempoReacao = Date.now() - tempoAparicao
        
        if (tipoSinal === 'go' && !aguardandoStop) {
            setGoCorrect(prev => prev + 1)
            setGoRTs(prev => [...prev, tempoReacao])
            setPontuacao(prev => prev + 10 * nivel)
            setSinalVisivel(false)
            
        } else if (tipoSinal === 'go' && aguardandoStop) {
            setGoRTs(prev => [...prev, tempoReacao])
            
        } else if (tipoSinal === 'stop') {
            setStopFailures(prev => prev + 1)
            setPontuacao(prev => Math.max(0, prev - 5))
            setCurrentSSD(prev => Math.max(50, prev - 50))
            setAllSSDs(prev => [...prev, currentSSD])
            setAguardandoStop(false)
            setSinalVisivel(false)
        }
    }

    // Detectar inibição bem-sucedida (não clicar)
    useEffect(() => {
        if (tipoSinal === 'stop' && sinalVisivel) {
            const timer = setTimeout(() => {
                setSinalVisivel(currentSinalVisivel => {
                    if (currentSinalVisivel) {
                        setStopSuccesses(prev => prev + 1)
                        setPontuacao(prev => prev + 15 * nivel)
                        setCurrentSSD(prev => Math.min(800, prev + 50))
                        setAllSSDs(prev => [...prev, currentSSD])
                        setAguardandoStop(false)
                        return false
                    }
                    return currentSinalVisivel;
                });
            }, 1000) 
            return () => clearTimeout(timer)
        }
    }, [tipoSinal, sinalVisivel, currentSSD, nivel])


    const finalizarExercicio = () => {
        setAtivo(false)
        setSinalVisivel(false)
        setAguardandoStop(false)
        setExercicioConcluido(true)
    }

    const calcularSSRT = () => {
        if (goRTs.length === 0 || totalStop === 0) return 0
    
        // Ordena os tempos de reação
        const sortedGoRTs = [...goRTs].sort((a, b) => a - b);
        
        // Calcula a probabilidade de falha
        const pRespond = stopFailures / totalStop;
    
        // Encontra o tempo de reação no n-ésimo percentil
        const nthIndex = Math.floor(sortedGoRTs.length * pRespond);
        const integrationPointRT = sortedGoRTs[nthIndex] || sortedGoRTs[sortedGoRTs.length - 1];
    
        // Calcula a média do SSD
        const meanSSD = allSSDs.length > 0 ? allSSDs.reduce((a, b) => a + b, 0) / allSSDs.length : 0;
        
        const ssrtValue = Math.round(integrationPointRT - meanSSD);
        
        return ssrtValue > 0 ? ssrtValue : 0; // Retorna 0 se o SSRT for negativo
    }

    const meanGoRT = goRTs.length > 0 ? Math.round(goRTs.reduce((a, b) => a + b, 0) / goRTs.length) : 0
    const sdGoRT = goRTs.length > 1 ? Math.round(Math.sqrt(goRTs.reduce((acc, rt) => acc + Math.pow(rt - meanGoRT, 2), 0) / goRTs.length)) : 0
    const cvRT = meanGoRT > 0 ? Math.round((sdGoRT / meanGoRT) * 100) : 0
    const ssrt = calcularSSRT()
    const stopAccuracy = totalStop > 0 ? Math.round((stopSuccesses / totalStop) * 100) : 0
    const goAccuracy = totalGo > 0 ? Math.round((goCorrect / totalGo) * 100) : 0

    // SALVAMENTO PADRONIZADO - CORRIGIDO
    const handleSaveSession = async () => {
        if (totalGo === 0 && totalStop === 0) {
            alert('Complete pelo menos algumas tentativas antes de salvar.')
            return
        }

        setSalvando(true)
        
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            
            if (userError || !user) {
                console.error('Erro ao obter usuário:', userError)
                alert('Erro: Sessão expirada. Por favor, faça login novamente.')
                router.push('/login')
                return
            }
            
            const { data, error } = await supabase
                .from('sessoes')
                .insert([{
                    usuario_id: user.id,
                    atividade_nome: 'Stop-Go',
                    pontuacao_final: pontuacao,
                    data_fim: new Date().toISOString()
                }])

            if (error) {
                console.error('Erro ao salvar:', error)
                alert(`Erro ao salvar: ${error.message}`)
            } else {
                alert(`Sessão salva com sucesso!
                
📊 Resumo da Avaliação:
- SSRT: ${ssrt}ms (controle inibitório)
- Precisão GO: ${goAccuracy}%
- Precisão STOP: ${stopAccuracy}%
- Tempo de reação: ${meanGoRT}ms
- Variabilidade (CV): ${cvRT}%
- Nível ${nivel} completado
- ${pontuacao} pontos`)
                
                // Redirecionamento CORRIGIDO
                router.push('/dashboard')
            }
        } catch (error: any) {
            console.error('Erro inesperado:', error)
            alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`)
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
        setSinalVisivel(false)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header PADRONIZADO implementado */}
            <GameHeader 
                title="Stop-Go"
                icon={<TrafficCone size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={exercicioConcluido}
            />

            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {!jogoIniciado ? (
                    // Tela inicial
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                            {/* h1 REMOVIDO daqui */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                                    <p className="text-sm text-gray-600">
                                        Desenvolver controle inibitório respondendo ao verde (GO) e resistindo ao vermelho (STOP).
                                    </p>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Verde (GO): Clique rapidamente!</li>
                                        <li>Vermelho (STOP): NÃO clique!</li>
                                        <li>Seja rápido mas atento aos sinais</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                        Medimos seu tempo de controle inibitório (SSRT) - quanto menor, melhor o controle!
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
                                        <div className="text-2xl mb-1">🚦</div>
                                        <div className="text-sm">Nível {key}</div>
                                        <div className="text-xs opacity-80">{value.nome}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Botão Iniciar */}
                        <div className="text-center">
                            <button
                                onClick={iniciarExercicio}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                            >
                                🚀 Iniciar Atividade
                            </button>
                        </div>
                    </div>
                ) : !exercicioConcluido ? (
                    // Área de jogo
                    <div className="space-y-6">
                        {/* Progresso */}
                        <div className="bg-white rounded-xl shadow-lg p-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Progresso da Sessão</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-orange-800">{pontuacao}</div>
                                    <div className="text-xs text-orange-600">Pontos</div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-blue-800">{tempoRestante}s</div>
                                    <div className="text-xs text-blue-600">Tempo</div>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-green-800">{goAccuracy}%</div>
                                    <div className="text-xs text-green-600">GO</div>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-red-800">{stopAccuracy}%</div>
                                    <div className="text-xs text-red-600">STOP</div>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-purple-800">{currentSSD}ms</div>
                                    <div className="text-xs text-purple-600">Delay</div>
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
                                className="relative bg-gradient-to-br from-gray-100 to-gray-200"
                                style={{ height: '500px', width: '100%' }}
                            >
                                {sinalVisivel && (
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

                                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
                                    <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg">
                                        <div className="font-medium">🟢 Verde = Clique | 🔴 Vermelho = NÃO clique!</div>
                                        <div className="text-sm opacity-90">Nível {nivel} • {tempoRestante}s restantes</div>
                                    </div>
                                </div>

                                {!sinalVisivel && ativo && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-gray-800 bg-opacity-70 text-white px-6 py-3 rounded-lg">
                                            <div className="font-medium">⏳ Aguardando próximo sinal...</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Tela de resultados
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">
                                {ssrt > 0 && ssrt < 200 ? '🏆' : ssrt > 0 && ssrt < 250 ? '🎉' : '💪'}
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {ssrt > 0 && ssrt < 200 ? 'Controle Excepcional!' : ssrt > 0 && ssrt < 250 ? 'Muito Bem!' : 'Continue Praticando!'}
                            </h3>
                            
                            <p className="text-gray-600">
                                Seu tempo de controle inibitório (SSRT): {ssrt > 0 ? `${ssrt}ms` : 'N/A'}
                            </p>
                        </div>
                        
                        {/* Resultados Detalhados */}
                        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Resultados da Sessão</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-purple-800">{ssrt > 0 ? `${ssrt}ms` : 'N/A'}</div>
                                    <div className="text-xs text-purple-600">SSRT</div>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-blue-800">{meanGoRT}ms</div>
                                    <div className="text-xs text-blue-600">RT Médio</div>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-yellow-800">{cvRT}%</div>
                                    <div className="text-xs text-yellow-600">CV</div>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-green-800">{goAccuracy}%</div>
                                    <div className="text-xs text-green-600">Precisão GO</div>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-red-800">{stopAccuracy}%</div>
                                    <div className="text-xs text-red-600">Precisão STOP</div>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-orange-800">{pontuacao}</div>
                                    <div className="text-xs text-orange-600">Pontos</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Interpretação */}
                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <h4 className="font-bold text-blue-800 mb-2">📊 Análise do Desempenho:</h4>
                            <div className="text-sm text-blue-700 space-y-1">
                                <p>• Controle Inibitório: {ssrt > 0 && ssrt < 200 ? '✅ Excelente!' : ssrt > 0 && ssrt < 250 ? '✅ Bom' : '⚠️ Precisa melhorar'}</p>
                                <p>• Velocidade: {meanGoRT > 0 && meanGoRT < 400 ? '✅ Rápido' : meanGoRT > 0 && meanGoRT < 600 ? '⚠️ Moderado' : '🔴 Lento'}</p>
                                <p>• Consistência: {cvRT <= 30 ? '✅ Estável' : '⚠️ Variável'}</p>
                                <p>• Precisão GO: {goAccuracy >= 90 ? '✅ Ótima' : '⚠️ Pode melhorar'}</p>
                                <p>• Inibição STOP: {stopAccuracy >= 40 && stopAccuracy <= 60 ? '✅ Balanceada' : '⚠️ Desbalanceada'}</p>
                            </div>
                        </div>
                        
                        {/* Botões */}
                        <div className="flex justify-center space-x-4">
                            {nivel < 5 && ssrt > 0 && ssrt < 250 && (
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
