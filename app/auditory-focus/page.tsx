'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Brain, Ear } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

// Componente do Cabeçalho Padrão
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }) => (
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


export default function ConcentracaoAuditivaPage() {
    const router = useRouter();
    const supabase = createClient();
    
    const [nivel, setNivel] = useState(1);
    const [pontuacao, setPontuacao] = useState(0);
    const [tempoRestante, setTempoRestante] = useState(60);
    const [ativo, setAtivo] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [audioDisponivel, setAudioDisponivel] = useState(false);
    const [audioTestado, setAudioTestado] = useState(false);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);
    const [totalTons, setTotalTons] = useState(0);
    const [totalAlvos, setTotalAlvos] = useState(0);
    const [exercicioConcluido, setExercicioConcluido] = useState(false);
    const [jogoIniciado, setJogoIniciado] = useState(false);
    const [salvando, setSalvando] = useState(false);
    
    const [ultimoTom, setUltimoTom] = useState<'alvo' | 'distrator' | null>(null);
    const [aguardandoResposta, setAguardandoResposta] = useState(false);
    
    const [inicioSessao] = useState(new Date());
    const [temposResposta, setTemposResposta] = useState<number[]>([]);
    const inicioTom = useRef<Date | null>(null);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const niveis = {
        1: { duracao: 60, intervalo: 3000, probAlvo: 0.4, nome: "Iniciante (1min)" },
        2: { duracao: 75, intervalo: 2500, probAlvo: 0.35, nome: "Básico (1.25min)" },
        3: { duracao: 90, intervalo: 2000, probAlvo: 0.3, nome: "Intermediário (1.5min)" },
        4: { duracao: 105, intervalo: 1700, probAlvo: 0.25, nome: "Avançado (1.75min)" },
        5: { duracao: 120, intervalo: 1500, probAlvo: 0.2, nome: "Expert (2min)" }
    };

    const tons = { alvo: 800, distrator1: 400, distrator2: 600, distrator3: 1000 };

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
        if (ativo && tempoRestante > 0) {
            timer = setTimeout(() => setTempoRestante(prev => prev - 1), 1000);
        } else if (tempoRestante === 0 && ativo) {
            finalizarExercicio();
        }
        return () => clearTimeout(timer);
    }, [ativo, tempoRestante]);

    const reproduzirTom = useCallback(async (frequencia: number, duracao: number = 600): Promise<boolean> => {
        try {
            if (!audioContextRef.current || !gainNodeRef.current) return false;
            if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
            
            const oscillator = audioContextRef.current.createOscillator();
            const envelope = audioContextRef.current.createGain();
            oscillator.connect(envelope);
            envelope.connect(gainNodeRef.current);
            oscillator.frequency.setValueAtTime(frequencia, audioContextRef.current.currentTime);
            oscillator.type = 'sine';
            
            const volumeAtual = volume * 0.4;
            envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
            envelope.gain.linearRampToValueAtTime(volumeAtual, audioContextRef.current.currentTime + 0.05);
            envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + (duracao / 1000));
            
            oscillator.start(audioContextRef.current.currentTime);
            oscillator.stop(audioContextRef.current.currentTime + (duracao / 1000));
            return true;
        } catch (error) {
            console.error('Erro ao reproduzir tom:', error);
            return false;
        }
    }, [volume]);
    
    const reproduzirTomJogo = useCallback(() => {
        if (!ativo) return;
        const config = niveis[nivel as keyof typeof niveis];
        const isAlvo = Math.random() < config.probAlvo;
        const tipo = isAlvo ? 'alvo' : 'distrator';
        const frequencia = isAlvo ? tons.alvo : [tons.distrator1, tons.distrator2, tons.distrator3][Math.floor(Math.random() * 3)];

        if(isAlvo) setTotalAlvos(prev => prev + 1);
        setTotalTons(prev => prev + 1);

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
    }, [ativo, nivel, reproduzirTom]);

    useEffect(() => {
        if (!ativo) return;
        const config = niveis[nivel as keyof typeof niveis];
        const gameInterval = setInterval(reproduzirTomJogo, config.intervalo);
        return () => clearInterval(gameInterval);
    }, [ativo, nivel, reproduzirTomJogo]);

    const registrarResposta = (clicou: boolean) => {
        if (!inicioTom.current || !ultimoTom) return;
        const tempoResposta = (new Date().getTime() - inicioTom.current.getTime());
        const eraAlvo = ultimoTom === 'alvo';

        if (clicou && eraAlvo) {
            setAcertos(prev => prev + 1);
            setPontuacao(prev => prev + 20 * nivel);
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
        if (!audioDisponivel || !audioTestado) {
            alert('Por favor, teste o áudio primeiro!');
            return;
        }
        const config = niveis[nivel as keyof typeof niveis];
        setTempoRestante(config.duracao);
        setAtivo(true);
        setPontuacao(0);
        setAcertos(0);
        setErros(0);
        setTotalTons(0);
        setTotalAlvos(0);
        setTemposResposta([]);
        setExercicioConcluido(false);
        setJogoIniciado(true);
        if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
    };

    const finalizarExercicio = () => {
        setAtivo(false);
        setExercicioConcluido(true);
    };
    
    const proximoNivel = () => {
        if (nivel < 5) {
            setNivel(prev => prev + 1);
            setJogoIniciado(false);
        }
    };

    const voltarInicio = () => {
        setJogoIniciado(false);
        setExercicioConcluido(false);
        setAtivo(false);
    };

    const handleSaveSession = async () => {
        if (totalTons === 0) {
            alert('Nenhuma atividade foi registrada para salvar.');
            return;
        }
        setSalvando(true);
        const fimSessao = new Date();
        const tempoMedioResposta = temposResposta.length > 0 ? temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length : 0;
        
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                alert('Sessão expirada. Faça login novamente.');
                router.push('/login');
                return;
            }
            const { error } = await supabase.from('sessoes').insert([{
                usuario_id: user.id,
                atividade_nome: 'Foco Auditivo',
                pontuacao_final: pontuacao,
                taxa_acerto: precisao,
                tempo_reacao_medio: Math.round(tempoMedioResposta),
                data_fim: fimSessao.toISOString(),
                observacoes: { nivel_final: nivel, acertos, erros, total_alvos: totalAlvos }
            }]);
            if (error) {
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!\nPontuação: ${pontuacao}\nPrecisão: ${precisao}%`);
                router.push('/dashboard');
            }
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        } finally {
            setSalvando(false);
        }
    };

    const precisao = totalAlvos > 0 ? Math.round((acertos / totalAlvos) * 100) : 0;
    const podeAvancar = precisao >= 70 && nivel < 5;

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Foco Auditivo"
                icon={<Ear size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={exercicioConcluido}
            />

            <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
                {!jogoIniciado ? (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-3">🎯 Objetivo</h2>
                                    <p className="text-gray-600">Focar em sons específicos (alvo) ignorando outros (distratores), uma habilidade chave para o controle da atenção.</p>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-3">🎮 Como Jogar</h2>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        <li>Clique na tela APENAS ao ouvir o som alvo (agudo).</li>
                                        <li>IGNORE todos os outros sons.</li>
                                        <li>Seja rápido, você tem 2 segundos para responder.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6">
                             <h2 className="text-xl font-bold text-gray-800 mb-4">🔊 Configuração de Áudio</h2>
                             <div className="space-y-4">
                                 <div>
                                     <label className="block text-sm font-medium text-gray-700 mb-2">Volume: {Math.round(volume * 100)}%</label>
                                     <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"/>
                                 </div>
                                 <div className="flex items-center space-x-4">
                                     <button onClick={testarAudio} disabled={!audioDisponivel} className="px-6 py-3 rounded-lg font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300">
                                         🎵 Testar Som Alvo
                                     </button>
                                     <div className={`p-3 rounded-lg text-sm font-medium ${audioTestado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                         {audioTestado ? '✅ Áudio Testado' : '⏳ Teste Pendente'}
                                     </div>
                                 </div>
                             </div>
                        </div>
                        <div className="text-center pt-4">
                            <button onClick={iniciarExercicio} disabled={!audioTestado} className="font-bold py-4 px-8 rounded-lg text-lg transition-all bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
                                Iniciar Atividade
                            </button>
                        </div>
                    </div>
                ) : !exercicioConcluido ? (
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
                                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000" style={{ width: `${((niveis[nivel as keyof typeof niveis].duracao - tempoRestante) / niveis[nivel as keyof typeof niveis].duracao) * 100}%` }}/>
                            </div>
                            <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 cursor-pointer flex items-center justify-center" style={{ height: '400px' }} onClick={processarClique}>
                                <div className="text-center">
                                    {aguardandoResposta && ultimoTom ? (
                                        <div className={`w-48 h-48 rounded-full flex items-center justify-center text-white text-3xl font-bold animate-pulse shadow-2xl transition-colors duration-300 ${ultimoTom === 'alvo' ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {ultimoTom === 'alvo' ? 'CLIQUE!' : 'NÃO!'}
                                        </div>
                                    ) : (
                                        <div className="w-48 h-48 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                            ESCUTE
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">{precisao >= 80 ? '🏆' : '🎯'}</div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">{precisao >= 80 ? 'Excelente Foco!' : 'Bom Trabalho!'}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                            <div className="bg-gray-100 rounded-lg p-4"><div className="text-2xl font-bold">{pontuacao}</div><div className="text-sm">Pontos</div></div>
                            <div className="bg-gray-100 rounded-lg p-4"><div className="text-2xl font-bold">{precisao}%</div><div className="text-sm">Precisão</div></div>
                            <div className="bg-gray-100 rounded-lg p-4"><div className="text-2xl font-bold">{acertos}</div><div className="text-sm">Acertos</div></div>
                            <div className="bg-gray-100 rounded-lg p-4"><div className="text-2xl font-bold">{erros}</div><div className="text-sm">Erros</div></div>
                        </div>
                        <div className="space-x-4">
                            {podeAvancar && (
                                <button onClick={proximoNivel} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                    Próximo Nível
                                </button>
                            )}
                            <button onClick={voltarInicio} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                Jogar Novamente
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
