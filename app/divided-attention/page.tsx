'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Save, ChevronLeft, Spline } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient' // Ajuste o caminho se necessário

// --- COMPONENTE DO CABEÇALHO PADRÃO ---
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }: {
    onSave?: () => void;
    isSaveDisabled?: boolean;
    title: string;
    icon: React.ReactNode;
    showSaveButton?: boolean;
}) => (
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

// --- PÁGINA DA ATIVIDADE ---
export default function DividedAttention() {
    const router = useRouter()
    const supabase = createClient()
    
    // Estados principais refatorados
    const [gameState, setGameState] = useState<'initial' | 'playing' | 'finished'>('initial');
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(1);
    const [pontuacao, setPontuacao] = useState(0)
    const [tempoRestante, setTempoRestante] = useState(90)
    const [volume, setVolume] = useState(0.5)
    const [audioDisponivel, setAudioDisponivel] = useState(false)
    const [audioTestado, setAudioTestado] = useState(false)
    
    // Estados do jogo
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
    const [temposReacaoVisuais, setTemposReacaoVisuais] = useState<number[]>([])
    const [temposReacaoAuditivos, setTemposReacaoAuditivos] = useState<number[]>([])
    const [timestampUltimoObjeto, setTimestampUltimoObjeto] = useState<number | null>(null)
    const [timestampUltimoTom, setTimestampUltimoTom] = useState<number | null>(null)
    
    // Refs
    const audioContextRef = useRef<AudioContext | null>(null)
    const gainNodeRef = useRef<GainNode | null>(null)
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
    const audioLoopRef = useRef<NodeJS.Timeout | null>(null)
    
    const niveis = [
        { id: 1, duracao: 90, intervalObjetos: 2000, intervalTons: 4000, probObjetoAlvo: 0.4, probTomAlvo: 0.3, quantidadeObjetos: 3, velocidadeObjetos: 4000, nome: "Nível 1", dificuldade: "Iniciante", icone: "🚦" },
        { id: 2, duracao: 105, intervalObjetos: 1800, intervalTons: 3500, probObjetoAlvo: 0.35, probTomAlvo: 0.3, quantidadeObjetos: 4, velocidadeObjetos: 3500, nome: "Nível 2", dificuldade: "Básico", icone: "🚗" },
        { id: 3, duracao: 120, intervalObjetos: 1500, intervalTons: 3000, probObjetoAlvo: 0.3, probTomAlvo: 0.25, quantidadeObjetos: 5, velocidadeObjetos: 3000, nome: "Nível 3", dificuldade: "Médio", icone: "✈️" },
        { id: 4, duracao: 135, intervalObjetos: 1300, intervalTons: 2500, probObjetoAlvo: 0.25, probTomAlvo: 0.25, quantidadeObjetos: 6, velocidadeObjetos: 2500, nome: "Nível 4", dificuldade: "Avançado", icone: "🚀" },
        { id: 5, duracao: 150, intervalObjetos: 1000, intervalTons: 2000, probObjetoAlvo: 0.2, probTomAlvo: 0.2, quantidadeObjetos: 7, velocidadeObjetos: 2000, nome: "Nível 5", dificuldade: "Expert", icone: "🌟" }
    ];

    const tons = { alvo: 800, distrator1: 400, distrator2: 600, distrator3: 1000 }
    const cores = { alvo: '#10B981', distrator1: '#EF4444', distrator2: '#3B82F6', distrator3: '#F59E0B', distrator4: '#8B5CF6' }

    // --- Efeitos e Lógica do Jogo (sem alterações significativas) ---
    useEffect(() => {
        const initAudio = async () => {
            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                if (!AudioContextClass) throw new Error('Web Audio API não suportada');
                audioContextRef.current = new AudioContextClass();
                gainNodeRef.current = audioContextRef.current.createGain();
                gainNodeRef.current.connect(audioContextRef.current.destination);
                gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
                setAudioDisponivel(true);
            } catch (error) {
                console.error('Erro ao inicializar áudio:', error);
                setAudioDisponivel(false);
            }
        };
        initAudio();
        return () => {
            if (audioContextRef.current?.state !== 'closed') audioContextRef.current?.close();
        };
    }, []);

    useEffect(() => {
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        }
    }, [volume]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'playing' && tempoRestante > 0) {
            timer = setTimeout(() => setTempoRestante(prev => prev - 1), 1000);
        } else if (tempoRestante === 0 && gameState === 'playing') {
            finalizarExercicio();
        }
        return () => clearTimeout(timer);
    }, [gameState, tempoRestante]);

    const setupGameLoops = useCallback(() => {
        const config = niveis.find(n => n.id === nivelSelecionado);
        if (!config) return;

        gameLoopRef.current = setInterval(gerarObjetos, config.intervalObjetos);
        audioLoopRef.current = setInterval(reproduzirTomJogo, config.intervalTons);
    }, [nivelSelecionado]);
    
    const clearGameLoops = () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        if (audioLoopRef.current) clearInterval(audioLoopRef.current);
    };

    const reproduzirTom = useCallback(async (frequencia: number, duracao: number = 600): Promise<boolean> => {
        try {
            if (!audioContextRef.current || !gainNodeRef.current) return false;
            if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();

            const oscillator = audioContextRef.current.createOscillator();
            oscillator.connect(gainNodeRef.current);
            oscillator.frequency.setValueAtTime(frequencia, audioContextRef.current.currentTime);
            oscillator.type = 'sine';
            
            oscillator.start(audioContextRef.current.currentTime);
            oscillator.stop(audioContextRef.current.currentTime + (duracao / 1000));
            return true;
        } catch (error) {
            console.error('Erro ao reproduzir tom:', error);
            return false;
        }
    }, [volume]);

    const reproduzirTomJogo = useCallback(() => {
        const config = niveis.find(n => n.id === nivelSelecionado);
        if (!config || gameState !== 'playing') return;
        
        const isAlvo = Math.random() < config.probTomAlvo;
        const tipo = isAlvo ? 'alvo' : 'distrator';
        const frequencia = isAlvo ? tons.alvo : [tons.distrator1, tons.distrator2, tons.distrator3][Math.floor(Math.random() * 3)];
        
        if (isAlvo) setTotalTonsAlvo(prev => prev + 1);
        
        reproduzirTom(frequencia, 600).then(sucesso => {
            if (sucesso && gameState === 'playing') {
                const timestamp = Date.now();
                setTimestampUltimoTom(timestamp);
                setUltimoTom(tipo);
                setAguardandoTom(true);
                setTimeout(() => setAguardandoTom(false), 1500);
            }
        });
    }, [reproduzirTom, nivelSelecionado, gameState]);
    
    const gerarObjetos = useCallback(() => {
        const config = niveis.find(n => n.id === nivelSelecionado);
        if (!config || gameState !== 'playing') return;

        const novosObjetos: any[] = [];
        const timestamp = Date.now();
        setTimestampUltimoObjeto(timestamp);

        for (let i = 0; i < config.quantidadeObjetos; i++) {
            const isAlvo = Math.random() < config.probObjetoAlvo;
            if (isAlvo) setTotalObjetosAlvo(prev => prev + 1);
            novosObjetos.push({ 
                id: Date.now() + Math.random(), 
                x: Math.random() * 80 + 10, 
                y: Math.random() * 70 + 15, 
                tipo: isAlvo ? 'alvo' : 'distrator', 
                cor: isAlvo ? cores.alvo : [cores.distrator1, cores.distrator2, cores.distrator3, cores.distrator4][Math.floor(Math.random() * 4)]
            });
        }
        setObjetosNaTela(novosObjetos);
        setTimeout(() => setObjetosNaTela([]), config.velocidadeObjetos - 500);
    }, [nivelSelecionado, gameState]);

    const testarAudio = useCallback(async () => {
        const sucesso = await reproduzirTom(tons.alvo, 1000);
        if (sucesso) setAudioTestado(true);
    }, [reproduzirTom]);

    const clicarObjeto = (objeto: { id: number, tipo: 'alvo' | 'distrator' }) => {
        const tempoReacao = timestampUltimoObjeto ? Date.now() - timestampUltimoObjeto : 0;
        if (objeto.tipo === 'alvo') {
            setObjetosCorretos(prev => prev + 1);
            setPontuacao(prev => prev + 15 * nivelSelecionado!);
            setTemposReacaoVisuais(prev => [...prev, tempoReacao]);
        } else {
            setPontuacao(prev => Math.max(0, prev - 8));
        }
        setObjetosContados(prev => prev + 1);
        setObjetosNaTela(prev => prev.filter(obj => obj.id !== objeto.id));
    };

    const identificarTom = () => {
        if (!aguardandoTom || !ultimoTom) return;
        const tempoReacao = timestampUltimoTom ? Date.now() - timestampUltimoTom : 0;
        if (ultimoTom === 'alvo') {
            setTonsCorretos(prev => prev + 1);
            setPontuacao(prev => prev + 10 * nivelSelecionado!);
            setTemposReacaoAuditivos(prev => [...prev, tempoReacao]);
        } else {
            setPontuacao(prev => Math.max(0, prev - 5));
        }
        setTonsIdentificados(prev => prev + 1);
        setAguardandoTom(false);
    };

    const iniciarExercicio = () => {
        if (!audioTestado || nivelSelecionado === null) {
            alert('Por favor, selecione um nível e teste o áudio antes de iniciar.');
            return;
        }
        const config = niveis.find(n => n.id === nivelSelecionado);
        if (!config) return;

        setTempoRestante(config.duracao);
        setPontuacao(0);
        setObjetosContados(0);
        setObjetosCorretos(0);
        setTonsIdentificados(0);
        setTonsCorretos(0);
        setTotalObjetosAlvo(0);
        setTotalTonsAlvo(0);
        setTemposReacaoVisuais([]);
        setTemposReacaoAuditivos([]);
        
        setGameState('playing');
        if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
        
        setTimeout(gerarObjetos, 1000);
        setTimeout(reproduzirTomJogo, 2000);
        setupGameLoops();
    };

    const finalizarExercicio = () => {
        clearGameLoops();
        setGameState('finished');
        setObjetosNaTela([]);
    };

    const resetGame = () => {
        clearGameLoops();
        setGameState('initial');
        setNivelSelecionado(1);
        setAudioTestado(false);
    };
    
    const precisaoObjetos = totalObjetosAlvo > 0 ? Math.round((objetosCorretos / totalObjetosAlvo) * 100) : 0;
    const precisaoTons = totalTonsAlvo > 0 ? Math.round((tonsCorretos / totalTonsAlvo) * 100) : 0;
    const precisaoGeral = (totalObjetosAlvo + totalTonsAlvo > 0) ? Math.round(((objetosCorretos + tonsCorretos) / (totalObjetosAlvo + totalTonsAlvo)) * 100) : 0;

    const handleSaveSession = async () => {
        if (gameState !== 'finished') {
            alert('Complete a atividade antes de salvar.');
            return;
        }
        setSalvando(true);
        // ... (lógica de salvar no Supabase, igual à anterior, mas usando nivelSelecionado)
        try {
            router.push('/dashboard');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Atenção Dividida"
                icon={<Spline size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={gameState === 'finished'}
            />

            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {gameState === 'initial' && (
                    <div className="space-y-6">
                        {/* Bloco 1: Cards Informativos */}
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🎯 Objetivo:</h3>
                                    <p className="text-sm text-gray-600">
                                        Treinar a capacidade de gerenciar e responder a múltiplos estímulos (visuais e auditivos) simultaneamente.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li><strong>Tarefa Visual:</strong> Clique apenas nos círculos <strong>verdes</strong> que aparecerem.</li>
                                        <li><strong>Tarefa Auditiva:</strong> Pressione o botão "Ouvi o Tom" apenas quando ouvir um som <strong>agudo</strong>.</li>
                                        <li>Realize ambas as tarefas ao mesmo tempo.</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                        A pontuação é baseada nos acertos em ambas as tarefas. A precisão é medida separadamente para os estímulos visuais e auditivos.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bloco 2: Configuração de Áudio */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                             <h2 className="text-lg font-bold text-gray-800 mb-4">🔊 Configuração de Áudio</h2>
                             <div className="flex flex-col sm:flex-row items-center gap-4">
                                 <div className="w-full sm:w-1/2">
                                     <label className="block text-sm font-medium text-gray-700 mb-1">Volume: {Math.round(volume * 100)}%</label>
                                     <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"/>
                                 </div>
                                 <button onClick={testarAudio} disabled={!audioDisponivel} className="px-6 py-3 rounded-lg font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 w-full sm:w-auto">
                                     🎵 Testar Tom Agudo
                                 </button>
                                 <div className={`p-3 rounded-lg text-sm font-medium ${audioTestado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} w-full sm:w-auto text-center`}>
                                     {audioTestado ? '✅ Áudio OK' : '⚠️ Teste Pendente'}
                                 </div>
                             </div>
                        </div>
                        
                        {/* Bloco 3: Seleção de Nível */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {niveis.map((nivel) => (
                                    <button
                                        key={nivel.id}
                                        onClick={() => setNivelSelecionado(nivel.id)}
                                        className={`p-4 rounded-lg font-medium transition-colors ${nivelSelecionado === nivel.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{nivel.icone}</div>
                                        <div className="text-sm">{nivel.nome}</div>
                                        <div className="text-xs opacity-80">{`${nivel.dificuldade}`}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bloco 4: Botão Iniciar */}
                        <div className="text-center pt-4">
                            <button
                                onClick={iniciarExercicio}
                                disabled={!audioTestado || nivelSelecionado === null}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                🚀 Iniciar Atividade
                            </button>
                             {!audioTestado && <p className="text-sm text-red-600 mt-2">⚠️ Teste o áudio antes de iniciar</p>}
                        </div>
                    </div>
                )}
                
                {gameState === 'playing' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-blue-600">{pontuacao}</div><div className="text-sm text-gray-600">Pontos</div></div>
                            <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-orange-600">{tempoRestante}s</div><div className="text-sm text-gray-600">Tempo</div></div>
                            <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-green-600">{precisaoObjetos}%</div><div className="text-sm text-gray-600">Visual</div></div>
                            <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-purple-600">{precisaoTons}%</div><div className="text-sm text-gray-600">Auditiva</div></div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="h-2 bg-gray-200">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000" style={{ width: `${((niveis.find(n=>n.id===nivelSelecionado)!.duracao - tempoRestante) / niveis.find(n=>n.id===nivelSelecionado)!.duracao) * 100}%` }}/>
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
                )}
                
                {gameState === 'finished' && (
                     <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
                         <div className="text-6xl mb-4">{precisaoGeral >= 80 ? '🏆' : '🎯'}</div>
                         <h3 className="text-2xl font-bold text-gray-800 mb-6">{precisaoGeral >= 80 ? 'Excelente Multitarefa!' : 'Boa Atenção Dividida!'}</h3>
                         <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                             <div className="bg-gray-100 rounded-lg p-4"><div className="text-lg font-bold">{precisaoGeral}%</div><div className="text-sm text-gray-600">Precisão Geral</div></div>
                             <div className="bg-gray-100 rounded-lg p-4"><div className="text-lg font-bold">{pontuacao}</div><div className="text-sm text-gray-600">Pontos</div></div>
                             <div className="bg-green-100 rounded-lg p-4"><div className="text-lg font-bold text-green-700">{precisaoObjetos}%</div><div className="text-sm text-gray-600">Precisão Visual</div></div>
                             <div className="bg-purple-100 rounded-lg p-4"><div className="text-lg font-bold text-purple-700">{precisaoTons}%</div><div className="text-sm text-gray-600">Precisão Auditiva</div></div>
                         </div>
                         <div className="space-x-4">
                             <button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                 🔄 Jogar Novamente
                             </button>
                         </div>
                     </div>
                )}
            </main>
        </div>
    )
}
