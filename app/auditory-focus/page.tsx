'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Ear } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient'; // Ajuste o caminho se necessário

// --- COMPONENTE DO CABEÇALHO PADRÃO ---
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }: {
    onSave?: () => void;
    isSaveDisabled?: boolean;
    title: string;
    icon: React.ReactNode;
    showSaveButton?: boolean;
}) => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
export default function AuditoryFocusPage() {
    const router = useRouter();
    const supabase = createClient();
    
    // Estados refatorados para o padrão
    const [gameState, setGameState] = useState<'initial' | 'playing' | 'finished'>('initial');
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(1);
    const [pontuacao, setPontuacao] = useState(0);
    const [tempoRestante, setTempoRestante] = useState(60);
    const [volume, setVolume] = useState(0.5);
    const [audioDisponivel, setAudioDisponivel] = useState(false);
    const [audioTestado, setAudioTestado] = useState(false);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);
    const [totalAlvos, setTotalAlvos] = useState(0);
    const [salvando, setSalvando] = useState(false);
    
    const [ultimoTom, setUltimoTom] = useState<'alvo' | 'distrator' | null>(null);
    const [aguardandoResposta, setAguardandoResposta] = useState(false);
    
    const [temposResposta, setTemposResposta] = useState<number[]>([]);
    const inicioTom = useRef<Date | null>(null);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const niveis = [
        { id: 1, duracao: 60, intervalo: 3000, probAlvo: 0.4, nome: "Nível 1", dificuldade: "Iniciante (1min)", icone: "🎵" },
        { id: 2, duracao: 75, intervalo: 2500, probAlvo: 0.35, nome: "Nível 2", dificuldade: "Básico (1.25min)", icone: "🎶" },
        { id: 3, duracao: 90, intervalo: 2000, probAlvo: 0.3, nome: "Nível 3", dificuldade: "Médio (1.5min)", icone: "🎧" },
        { id: 4, duracao: 105, intervalo: 1700, probAlvo: 0.25, nome: "Nível 4", dificuldade: "Avançado (1.75min)", icone: "🎤" },
        { id: 5, duracao: 120, intervalo: 1500, probAlvo: 0.2, nome: "Nível 5", dificuldade: "Expert (2min)", icone: "🎸" }
    ];

    const tons = { alvo: 800, distrator1: 400, distrator2: 600, distrator3: 1000 };

    useEffect(() => {
        const initAudio = async () => {
            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                audioContextRef.current = new AudioContextClass();
                gainNodeRef.current = audioContextRef.current.createGain();
                gainNodeRef.current.connect(audioContextRef.current.destination);
                gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
                setAudioDisponivel(true);
            } catch (error) {
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
            return false;
        }
    }, [volume]);
    
    const reproduzirTomJogo = useCallback(() => {
        const config = niveis.find(n => n.id === nivelSelecionado);
        if (!config) return;

        const isAlvo = Math.random() < config.probAlvo;
        const tipo = isAlvo ? 'alvo' : 'distrator';
        const frequencia = isAlvo ? tons.alvo : [tons.distrator1, tons.distrator2, tons.distrator3][Math.floor(Math.random() * 3)];

        if(isAlvo) setTotalAlvos(prev => prev + 1);

        inicioTom.current = new Date();
        setUltimoTom(tipo);
        setAguardandoResposta(true);
        reproduzirTom(frequencia, 600);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (tipo === 'alvo') {
                setErros(prev => prev + 1); // Omissão
            }
            setAguardandoResposta(false);
            setUltimoTom(null);
        }, 2000);
    }, [nivelSelecionado, reproduzirTom]);

    useEffect(() => {
        if (gameState === 'playing') {
            const config = niveis.find(n => n.id === nivelSelecionado);
            if (!config) return;

            const gameInterval = setInterval(reproduzirTomJogo, config.intervalo);
            return () => clearInterval(gameInterval);
        }
    }, [gameState, nivelSelecionado, reproduzirTomJogo]);

    const registrarResposta = (clicou: boolean) => {
        if (!inicioTom.current || !ultimoTom) return;
        const tempoResposta = (new Date().getTime() - inicioTom.current.getTime());
        const eraAlvo = ultimoTom === 'alvo';

        if (clicou && eraAlvo) {
            setAcertos(prev => prev + 1);
            setPontuacao(prev => prev + 20 * nivelSelecionado!);
            setTemposResposta(prev => [...prev, tempoResposta]);
        } else if (clicou && !eraAlvo) {
            setErros(prev => prev + 1);
            setPontuacao(prev => Math.max(0, prev - 10));
        }
    };

    const processarClique = () => {
        if (!aguardandoResposta) return;
        registrarResposta(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setAguardandoResposta(false);
        setUltimoTom(null);
    };

    const testarAudio = useCallback(async () => {
        const sucesso = await reproduzirTom(tons.alvo, 1000);
        if (sucesso) setAudioTestado(true);
    }, [reproduzirTom]);

    const iniciarExercicio = () => {
        if (!audioTestado || nivelSelecionado === null) {
            alert('Por favor, selecione um nível e teste o áudio primeiro.');
            return;
        }
        const config = niveis.find(n => n.id === nivelSelecionado);
        if (!config) return;

        setTempoRestante(config.duracao);
        setPontuacao(0);
        setAcertos(0);
        setErros(0);
        setTotalAlvos(0);
        setTemposResposta([]);
        
        setGameState('playing');
        if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
    };

    const finalizarExercicio = () => {
        setGameState('finished');
    };
    
    const resetGame = () => {
        setGameState('initial');
        setNivelSelecionado(1);
        setAudioTestado(false);
    };

    const handleSaveSession = async () => {
        // ... Lógica de salvar no Supabase ...
        router.push('/dashboard');
    };

    const precisao = totalAlvos > 0 ? Math.round((acertos / totalAlvos) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Foco Auditivo"
                icon={<Ear size={22} />}
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
                                        Exercitar a atenção seletiva auditiva, focando em sons específicos (alvo) enquanto ignora outros (distratores).
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Clique na tela (ou no botão) <strong>apenas</strong> ao ouvir o som alvo (agudo).</li>
                                        <li>Ignore todos os outros sons mais graves.</li>
                                        <li>Seja rápido, você tem 2 segundos para responder após o som.</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                        A pontuação aumenta com acertos e diminui com erros (clicar no som errado). A precisão é a porcentagem de sons alvo identificados corretamente.
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
                                     🎵 Testar Som Alvo
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
                         <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                             <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-blue-800">{pontuacao}</div><div className="text-xs text-gray-600">Pontos</div></div>
                             <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-orange-600">{tempoRestante}s</div><div className="text-xs text-gray-600">Tempo</div></div>
                             <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-green-800">{acertos}</div><div className="text-xs text-gray-600">Acertos</div></div>
                             <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-red-800">{erros}</div><div className="text-xs text-gray-600">Erros</div></div>
                             <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-purple-800">{precisao}%</div><div className="text-xs text-gray-600">Precisão</div></div>
                         </div>
                         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                             <div className="h-2 bg-gray-200">
                                 <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000" style={{ width: `${((niveis.find(n => n.id === nivelSelecionado)!.duracao - tempoRestante) / niveis.find(n => n.id === nivelSelecionado)!.duracao) * 100}%` }}/>
                             </div>
                             <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 cursor-pointer flex items-center justify-center" style={{ height: '400px' }} onClick={processarClique}>
                                 <div className="text-center">
                                     {aguardandoResposta ? (
                                         <div className="w-48 h-48 rounded-full flex items-center justify-center text-white text-3xl font-bold animate-pulse shadow-2xl bg-teal-500">
                                             Responda!
                                         </div>
                                     ) : (
                                         <div className="w-48 h-48 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                             OUÇA
                                         </div>
                                     )}
                                 </div>
                             </div>
                         </div>
                     </div>
                )}

                {gameState === 'finished' && (
                     <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
                         <div className="text-6xl mb-4">{precisao >= 80 ? '🏆' : '🎯'}</div>
                         <h3 className="text-3xl font-bold text-gray-800 mb-6">{precisao >= 80 ? 'Excelente Foco!' : 'Bom Trabalho!'}</h3>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                             <div className="bg-gray-100 rounded-lg p-4"><div className="text-2xl font-bold">{pontuacao}</div><div className="text-sm">Pontos</div></div>
                             <div className="bg-gray-100 rounded-lg p-4"><div className="text-2xl font-bold">{precisao}%</div><div className="text-sm">Precisão</div></div>
                             <div className="bg-gray-100 rounded-lg p-4"><div className="text-2xl font-bold">{acertos}</div><div className="text-sm">Acertos</div></div>
                             <div className="bg-gray-100 rounded-lg p-4"><div className="text-2xl font-bold">{erros}</div><div className="text-sm">Erros</div></div>
                         </div>
                         <div className="space-x-4">
                             <button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                 Jogar Novamente
                             </button>
                         </div>
                     </div>
                )}

            </main>
        </div>
    );
}
