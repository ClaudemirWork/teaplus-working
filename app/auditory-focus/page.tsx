'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

export default function ConcentracaoAuditivaPage() {
    const router = useRouter();
    const supabase = createClient();
    
    // Estados principais
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
    const [totalDistratores, setTotalDistratores] = useState(0);
    const [exercicioConcluido, setExercicioConcluido] = useState(false);
    const [jogoIniciado, setJogoIniciado] = useState(false);
    const [salvando, setSalvando] = useState(false);
    
    // Estados para feedback visual
    const [ultimoTom, setUltimoTom] = useState<'alvo' | 'distrator' | null>(null);
    const [aguardandoResposta, setAguardandoResposta] = useState(false);
    const [debugInfo, setDebugInfo] = useState('Aguardando...');
    
    // Métricas científicas
    const [inicioSessao] = useState(new Date());
    const [temposResposta, setTemposResposta] = useState<number[]>([]);
    const [sequenciaTemporal, setSequenciaTemporal] = useState<any[]>([]);
    const [nivelMaximo, setNivelMaximo] = useState(1);
    const inicioTom = useRef<Date | null>(null);
    
    // Refs para controle robusto
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
    const ativoRef = useRef(false);
    const nivelRef = useRef(1);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Configurações por nível
    const niveis = {
        1: { duracao: 60, intervalo: 3000, probAlvo: 0.4, nome: "Iniciante (1min)" },
        2: { duracao: 75, intervalo: 2500, probAlvo: 0.35, nome: "Básico (1.25min)" },
        3: { duracao: 90, intervalo: 2000, probAlvo: 0.3, nome: "Intermediário (1.5min)" },
        4: { duracao: 105, intervalo: 1700, probAlvo: 0.25, nome: "Avançado (1.75min)" },
        5: { duracao: 120, intervalo: 1500, probAlvo: 0.2, nome: "Expert (2min)" }
    };

    // Frequências dos tons (em Hz)
    const tons = {
        alvo: 800,
        distrator1: 400,
        distrator2: 600,
        distrator3: 1000
    };

    const activityInfo = {
        title: 'Concentração Auditiva Seletiva',
        objective: 'Desenvolver a atenção auditiva seletiva, capacidade de focar em sons específicos ignorando distratores, fundamental para o controle atencional no TDAH.',
        levels: [
            'Nível 1: 60s - Tom alvo em 40% dos estímulos',
            'Nível 2: 75s - Tom alvo em 35% dos estímulos',
            'Nível 3: 90s - Tom alvo em 30% dos estímulos',
            'Nível 4: 105s - Tom alvo em 25% dos estímulos',
            'Nível 5: 120s - Tom alvo em 20% dos estímulos'
        ],
        howToPlay: [
            'Clique APENAS quando ouvir o tom alvo (800Hz - agudo)',
            'IGNORE os tons distratores (400Hz, 600Hz, 1000Hz)',
            'Você tem 2 segundos para responder a cada tom',
            'Use os círculos coloridos como apoio visual',
            'Mantenha foco e precisão ao longo do exercício'
        ]
    };

    // Sincronizar refs com states
    useEffect(() => {
        ativoRef.current = ativo;
        nivelRef.current = nivel;
    }, [ativo, nivel]);

    // Sistema de áudio robusto
    useEffect(() => {
        const initAudio = async () => {
            try {
                if (audioContextRef.current) {
                    await audioContextRef.current.close();
                }
                
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                if (!AudioContextClass) {
                    throw new Error('Web Audio API não suportada');
                }
                
                audioContextRef.current = new AudioContextClass();
                gainNodeRef.current = audioContextRef.current.createGain();
                gainNodeRef.current.connect(audioContextRef.current.destination);
                gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
                
                setAudioDisponivel(true);
                setDebugInfo(`AudioContext: ${audioContextRef.current.state}`);
                
            } catch (error) {
                console.error('Erro ao inicializar áudio:', error);
                setAudioDisponivel(false);
                setDebugInfo('Erro no áudio');
            }
        };

        initAudio();

        return () => {
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Atualizar volume
    useEffect(() => {
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        }
    }, [volume]);

    // Timer principal
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (ativo && tempoRestante > 0) {
            timer = setTimeout(() => {
                setTempoRestante(prev => prev - 1);
            }, 1000);
        } else if (tempoRestante === 0 && ativo) {
            finalizarExercicio();
        }
        return () => clearTimeout(timer);
    }, [ativo, tempoRestante]);

    // Game loop principal
    useEffect(() => {
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
            gameLoopRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        
        if (!ativo) return;

        const config = niveis[nivel as keyof typeof niveis];
        
        timeoutRef.current = setTimeout(async () => {
            if (ativoRef.current) {
                await reproduzirTomJogo();
            }
        }, 3000);

        const intervalId = setInterval(async () => {
            if (!ativoRef.current) {
                clearInterval(intervalId);
                return;
            }
            await reproduzirTomJogo();
        }, config.intervalo);
        
        gameLoopRef.current = intervalId;

        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current);
                gameLoopRef.current = null;
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [ativo, nivel]);

    // Função de reprodução de tom
    const reproduzirTom = useCallback(async (frequencia: number, duracao: number = 600): Promise<boolean> => {
        try {
            if (!audioContextRef.current || !gainNodeRef.current) return false;

            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            const oscillator = audioContextRef.current.createOscillator();
            const envelope = audioContextRef.current.createGain();
            
            oscillator.connect(envelope);
            envelope.connect(gainNodeRef.current);
            
            oscillator.frequency.setValueAtTime(frequencia, audioContextRef.current.currentTime);
            oscillator.type = 'sine';
            
            const volumeAtual = volume * 0.4;
            envelope.gain.setValueAtTime(0, audioContextRef.current.currentTime);
            envelope.gain.linearRampToValueAtTime(volumeAtual, audioContextRef.current.currentTime + 0.05);
            envelope.gain.linearRampToValueAtTime(volumeAtual, audioContextRef.current.currentTime + (duracao / 1000) - 0.05);
            envelope.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + (duracao / 1000));
            
            oscillator.start(audioContextRef.current.currentTime);
            oscillator.stop(audioContextRef.current.currentTime + (duracao / 1000));
            
            return true;
            
        } catch (error) {
            console.error('Erro ao reproduzir tom:', error);
            return false;
        }
    }, [volume]);

    // Reproduzir tom do jogo com métricas
    const reproduzirTomJogo = useCallback(async () => {
        if (!ativoRef.current) return;

        const config = niveis[nivelRef.current as keyof typeof niveis];
        const isAlvo = Math.random() < config.probAlvo;
        
        let frequencia: number;
        let tipo: 'alvo' | 'distrator';
        
        if (isAlvo) {
            frequencia = tons.alvo;
            tipo = 'alvo';
            setTotalAlvos(prev => prev + 1);
        } else {
            const distratores = [tons.distrator1, tons.distrator2, tons.distrator3];
            frequencia = distratores[Math.floor(Math.random() * distratores.length)];
            tipo = 'distrator';
            setTotalDistratores(prev => prev + 1);
        }
        
        // Marcar início do tom para métricas de tempo
        inicioTom.current = new Date();
        
        setUltimoTom(tipo);
        setAguardandoResposta(true);
        setTotalTons(prev => prev + 1);
        setDebugInfo(`Nível ${nivelRef.current}: ${tipo} (${frequencia}Hz)`);
        
        const sucesso = await reproduzirTom(frequencia, 600);
        
        if (sucesso) {
            const timeoutId = setTimeout(() => {
                // Se não houve resposta, registrar como omissão (se foi alvo)
                if (aguardandoResposta && ultimoTom === 'alvo') {
                    registrarResposta(false, true); // false = não clicou, true = era alvo
                }
                setAguardandoResposta(false);
                setUltimoTom(null);
            }, 2000);
            
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = timeoutId;
        }
    }, [reproduzirTom, aguardandoResposta, ultimoTom]);

    // Registrar resposta com métricas científicas
    const registrarResposta = (clicou: boolean, eraAlvo: boolean) => {
        if (!inicioTom.current) return;
        
        const tempoResposta = (new Date().getTime() - inicioTom.current.getTime()) / 1000;
        
        // Atualizar contadores
        if (clicou && eraAlvo) {
            // Acerto: clicou no alvo
            setAcertos(prev => prev + 1);
            setPontuacao(prev => prev + 20 * nivel);
            setTemposResposta(prev => [...prev, tempoResposta]);
        } else if (clicou && !eraAlvo) {
            // Erro de comissão: clicou no distrator
            setErros(prev => prev + 1);
            setPontuacao(prev => Math.max(0, prev - 10));
        } else if (!clicou && eraAlvo) {
            // Erro de omissão: não clicou no alvo
            setErros(prev => prev + 1);
        }
        // Caso (!clicou && !eraAlvo) = correto, ignorar distrator
        
        // Registrar na sequência temporal
        setSequenciaTemporal(prev => [...prev, {
            timestamp: new Date(),
            nivel: nivelRef.current,
            era_alvo: eraAlvo,
            clicou: clicou,
            tempo_resposta: clicou ? tempoResposta : null,
            frequencia: eraAlvo ? tons.alvo : 'distrator',
            acertou: (clicou && eraAlvo) || (!clicou && !eraAlvo)
        }]);
    };

    // Teste de áudio
    const testarAudio = useCallback(async () => {
        const sucesso = await reproduzirTom(tons.alvo, 1000);
        if (sucesso) {
            setAudioTestado(true);
        }
    }, [reproduzirTom]);

    // Reativar áudio
    const reativarAudio = useCallback(async () => {
        if (!audioContextRef.current) return;

        try {
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
                setDebugInfo('AudioContext reativado!');
            }
            await reproduzirTom(tons.alvo, 500);
        } catch (error) {
            console.error('Erro na reativação:', error);
        }
    }, [reproduzirTom]);

    // Iniciar exercício
    const iniciarExercicio = () => {
        if (!audioDisponivel || !audioTestado) {
            alert('Por favor, teste o áudio primeiro!');
            return;
        }

        const configuracao = niveis[nivel as keyof typeof niveis];
        setTempoRestante(configuracao.duracao);
        setAtivo(true);
        setPontuacao(0);
        setAcertos(0);
        setErros(0);
        setTotalTons(0);
        setTotalAlvos(0);
        setTotalDistratores(0);
        setExercicioConcluido(false);
        setJogoIniciado(true);
        setAguardandoResposta(false);
        setUltimoTom(null);
        setTemposResposta([]);
        setSequenciaTemporal([]);
        setDebugInfo('Jogo iniciado!');

        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
    };

    // Processar clique
    const processarClique = () => {
        if (!aguardandoResposta || !ultimoTom) return;
        
        const eraAlvo = ultimoTom === 'alvo';
        registrarResposta(true, eraAlvo);
        
        // Limpar timeout pendente
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        
        setAguardandoResposta(false);
        setUltimoTom(null);
        setDebugInfo(`Resposta processada nível ${nivel}`);
    };

    // Finalizar exercício
    const finalizarExercicio = () => {
        setAtivo(false);
        setAguardandoResposta(false);
        setUltimoTom(null);
        setExercicioConcluido(true);
        setNivelMaximo(Math.max(nivelMaximo, nivel));
    };

    // Próximo nível
    const proximoNivel = () => {
        if (nivel < 5) {
            setNivel(prev => prev + 1);
            setExercicioConcluido(false);
            setJogoIniciado(false);
        }
    };

    // Voltar ao início
    const voltarInicio = () => {
        setJogoIniciado(false);
        setExercicioConcluido(false);
        setAtivo(false);
        setAguardandoResposta(false);
        setUltimoTom(null);
        setDebugInfo('Parado');
    };

    // Calcular métricas científicas
    const calcularTempoMedioResposta = () => {
        if (temposResposta.length === 0) return 0;
        return temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length;
    };

    const calcularVariabilidadeTempoResposta = () => {
        if (temposResposta.length < 2) return 0;
        const media = calcularTempoMedioResposta();
        const somaDiferencasQuadradas = temposResposta.reduce((acc, tempo) => 
            acc + Math.pow(tempo - media, 2), 0);
        return Math.sqrt(somaDiferencasQuadradas / (temposResposta.length - 1));
    };

    const calcularCoeficienteVariacao = () => {
        const media = calcularTempoMedioResposta();
        const variabilidade = calcularVariabilidadeTempoResposta();
        return media > 0 ? (variabilidade / media) : 0;
    };

    const calcularTaxaAcerto = () => {
        const totalRespostas = acertos + erros;
        return totalRespostas > 0 ? (acertos / totalRespostas) * 100 : 0;
    };

    const calcularErrosOmissao = () => {
        return sequenciaTemporal.filter(item => 
            item.era_alvo && !item.clicou
        ).length;
    };

    const calcularErrosComissao = () => {
        return sequenciaTemporal.filter(item => 
            !item.era_alvo && item.clicou
        ).length;
    };

    // Salvar sessão com métricas científicas completas
    const handleSaveSession = async () => {
        if (totalTons === 0) {
            alert('Nenhuma atividade foi registrada para salvar.');
            return;
        }
        
        setSalvando(true);
        
        const fimSessao = new Date();
        const duracaoSegundos = Math.round((fimSessao.getTime() - inicioSessao.getTime()) / 1000);
        const tempoMedioResposta = calcularTempoMedioResposta();
        const variabilidadeTempoResposta = calcularVariabilidadeTempoResposta();
        const coeficienteVariacao = calcularCoeficienteVariacao();
        const taxaAcerto = calcularTaxaAcerto();
        const errosOmissao = calcularErrosOmissao();
        const errosComissao = calcularErrosComissao();
        
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                console.error('Erro ao obter usuário:', userError);
                alert('Erro: Sessão expirada. Por favor, faça login novamente.');
                router.push('/login');
                return;
            }
            
            const { data, error } = await supabase
                .from('sessoes')
                .insert([{
                    usuario_id: user.id,
                    atividade_nome: 'Concentracao_Auditiva',
                    pontuacao_final: pontuacao,
                    taxa_acerto: Number(taxaAcerto.toFixed(2)),
                    tempo_reacao_medio: Number(tempoMedioResposta.toFixed(3)),
                    duracao_segundos: duracaoSegundos,
                    nivel_maximo_atingido: nivelMaximo,
                    data_fim: fimSessao.toISOString(),
                    observacoes: {
                        // Métricas científicas específicas para TDAH
                        variabilidade_tempo_reacao: Number(variabilidadeTempoResposta.toFixed(3)),
                        coeficiente_variacao: Number(coeficienteVariacao.toFixed(4)),
                        erros_omissao: errosOmissao,
                        erros_comissao: errosComissao,
                        total_alvos: totalAlvos,
                        total_distratores: totalDistratores,
                        
                        // Arrays detalhados para análise
                        tempos_resposta_individuais: temposResposta,
                        sequencia_temporal: sequenciaTemporal,
                        
                        // Configuração do exercício
                        configuracao_inicial: {
                            nivel_inicial: 1,
                            nivel_final: nivel,
                            volume_audio: volume,
                            configuracoes_niveis: niveis
                        },
                        
                        // Métricas derivadas
                        sensibilidade_deteccao: totalAlvos > 0 ? (acertos / totalAlvos) * 100 : 0,
                        especificidade: totalDistratores > 0 ? ((totalDistratores - errosComissao) / totalDistratores) * 100 : 0,
                        total_tons_apresentados: totalTons
                    }
                }]);

            if (error) {
                console.error('Erro ao salvar:', error);
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!
                
📊 Resumo Científico:
• Pontuação: ${pontuacao}
• Taxa de acerto: ${taxaAcerto.toFixed(1)}%
• Tempo médio de reação: ${tempoMedioResposta.toFixed(3)}s
• Variabilidade: ${variabilidadeTempoResposta.toFixed(3)}s
• Coeficiente de variação: ${coeficienteVariacao.toFixed(4)}
• Erros de omissão: ${errosOmissao}
• Erros de comissão: ${errosComissao}
• Nível máximo: ${nivelMaximo}
• Total de estímulos: ${totalTons}`);
                
                router.push('/profileselection');
            }
        } catch (error: any) {
            console.error('Erro inesperado:', error);
            alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setSalvando(false);
        }
    };

    // Cálculos de estatísticas
    const totalRespostas = acertos + erros;
    const precisao = totalRespostas > 0 ? Math.round((acertos / totalRespostas) * 100) : 0;
    const podeAvancar = precisao >= 70 && nivel < 5;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Idêntico ao CAA */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="p-3 sm:p-4 flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
                    >
                        <ChevronLeft size={20} />
                        <span className="text-sm sm:text-base">← Voltar</span>
                    </Link>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button 
                            onClick={handleSaveSession}
                            disabled={salvando || totalTons === 0}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:bg-green-400"
                        >
                            <Save size={20} />
                            <span>{salvando ? 'Salvando...' : 'Finalizar e Salvar'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {/* Cards Informativos - Idêntico ao CAA */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{activityInfo.title}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                            <p className="text-sm text-gray-600">{activityInfo.objective}</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">🎮 Como Jogar:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {activityInfo.howToPlay.map((instruction, index) => (
                                    <li key={index}>{instruction}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">⭐ Níveis:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {activityInfo.levels.map((level, index) => (
                                    <li key={index}>{level}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Progresso da Sessão */}
                {jogoIniciado && (
                    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            <Brain className="mr-2" size={20} />
                            Progresso da Sessão - Nível {nivel}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-blue-800">{pontuacao}</div>
                                <div className="text-xs text-blue-600">Pontos</div>
                            </div>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-orange-800">{tempoRestante}s</div>
                                <div className="text-xs text-orange-600">Restante</div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-green-800">{acertos}</div>
                                <div className="text-xs text-green-600">Acertos</div>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-red-800">{erros}</div>
                                <div className="text-xs text-red-600">Erros</div>
                            </div>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-purple-800">{precisao}%</div>
                                <div className="text-xs text-purple-600">Precisão</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Área Principal do Jogo */}
                {!jogoIniciado && !exercicioConcluido ? (
                    // Tela Inicial
                    <div className="space-y-6">
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

                        {/* Base Científica */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                            <h3 className="font-semibold text-yellow-900 mb-2">
                                📊 Base Científica:
                            </h3>
                            <p className="text-sm text-yellow-800">
                                Exercício validado para avaliação da atenção auditiva seletiva em TDAH. 
                                Baseado nos paradigmas CPT (Continuous Performance Test) com métricas 
                                de tempo de reação, variabilidade e discriminação sinal-ruído 
                                (Huang-Pollock et al., 2012; Wang et al., 2021).
                            </p>
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
                ) : exercicioConcluido ? (
                    // Tela de Resultado
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">
                            {precisao >= 80 ? '🏆' : precisao >= 60 ? '🎯' : precisao >= 40 ? '💪' : '📈'}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            {precisao >= 80 ? 'Excelente Desempenho!' : 
                             precisao >= 60 ? 'Muito Bem!' : 
                             precisao >= 40 ? 'Bom Progresso!' : 'Continue Praticando!'}
                        </h3>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-gray-800">{pontuacao}</div>
                                <div className="text-sm text-gray-600">Pontos Totais</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-gray-800">{precisao}%</div>
                                <div className="text-sm text-gray-600">Precisão</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-gray-800">{nivelMaximo}</div>
                                <div className="text-sm text-gray-600">Nível Máximo</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-gray-800">
                                    {calcularTempoMedioResposta().toFixed(2)}s
                                </div>
                                <div className="text-sm text-gray-600">Tempo Médio</div>
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
                ) : (
                    // Área do Jogo Ativa
                    <div className="space-y-6">
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
                                {/* Indicador central */}
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
                )}
            </main>
        </div>
    );
}
