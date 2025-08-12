'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';
import '../visual-focus.css';  // NOVO IMPORT DO CSS

export default function VisualFocusPage() {
    const router = useRouter();
    const supabase = createClient();
    const [nivel, setNivel] = useState(1);
    const [pontuacao, setPontuacao] = useState(0);
    const [duracao, setDuracao] = useState(60);
    const [tempoRestante, setTempoRestante] = useState(60);
    const [ativo, setAtivo] = useState(false);
    const [posicaoAlvo, setPosicaoAlvo] = useState({ x: 50, y: 50 });
    const [posicaoMouse, setPosicaoMouse] = useState({ x: 0, y: 0 });
    const [distratores, setDistratores] = useState<any[]>([]);
    const [proximidadeMedia, setProximidadeMedia] = useState(0);
    const [tempoFoco, setTempoFoco] = useState(0);
    const [tempoFocoTotal, setTempoFocoTotal] = useState(0);
    const [exercicioConcluido, setExercicioConcluido] = useState(false);
    const [jogoIniciado, setJogoIniciado] = useState(false);
    const [salvando, setSalvando] = useState(false);
    
    // MÉTRICAS CIENTÍFICAS
    const [inicioSessao] = useState(new Date());
    const [sequenciaTemporal, setSequenciaTemporal] = useState<any[]>([]);
    const [proximidadeHistorico, setProximidadeHistorico] = useState<number[]>([]);
    const [lapsosAtencao, setLapsosAtencao] = useState(0);
    const [tempoRecuperacao, setTempoRecuperacao] = useState<number[]>([]);
    const [emLapso, setEmLapso] = useState(false);
    const [inicioLapso, setInicioLapso] = useState<Date | null>(null);
    const [nivelMaximo, setNivelMaximo] = useState(1);
    
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const direcaoRef = useRef({ x: 1, y: 1 });
    const ultimaAtualizacao = useRef(Date.now());

    // ==========================================
    // FIX PARA iOS - PREVENIR TREMEDEIRA
    // ==========================================
    useEffect(() => {
        // 1. AJUSTAR ALTURA REAL DA VIEWPORT (iOS tem barra de endereço que some/aparece)
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            console.log('Viewport ajustada:', window.innerHeight + 'px');
        };

        // 2. DETECTAR SE É iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isIOS) {
            console.log('iOS detectado - aplicando fixes');
            
            // 3. ADICIONAR CLASSE ESPECIAL PARA iOS
            document.documentElement.classList.add('ios-device');
            
            // 4. PREVENIR SCROLL BOUNCE
            const preventBounce = (e: TouchEvent) => {
                const target = e.target as HTMLElement;
                if (!target.closest('.allow-scroll')) {
                    e.preventDefault();
                }
            };
            
            // 5. PREVENIR ZOOM COM PINCH
            const preventZoom = (e: TouchEvent) => {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            };
            
            // 6. ADICIONAR LISTENERS
            document.addEventListener('touchmove', preventBounce, { passive: false });
            document.addEventListener('touchstart', preventZoom, { passive: false });
            
            // 7. PREVENIR SCROLL QUANDO TOCA NA ÁREA DO JOGO
            const gameArea = gameAreaRef.current;
            if (gameArea) {
                gameArea.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, { passive: false });
            }
            
            // 8. LIMPAR AO DESMONTAR
            return () => {
                document.removeEventListener('touchmove', preventBounce);
                document.removeEventListener('touchstart', preventZoom);
                document.documentElement.classList.remove('ios-device');
            };
        }
        
        // 9. AJUSTAR VIEWPORT INICIAL
        setViewportHeight();
        
        // 10. REAJUSTAR QUANDO MUDA ORIENTAÇÃO OU TAMANHO
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', setViewportHeight);
        
        // 11. FORÇAR REAJUSTE APÓS 100ms (iOS às vezes demora)
        setTimeout(setViewportHeight, 100);
        
        return () => {
            window.removeEventListener('resize', setViewportHeight);
            window.removeEventListener('orientationchange', setViewportHeight);
        };
    }, []);

    // Configurações por nível
    const niveis = {
        1: { duracao: 60, velocidade: 1, distratores: 0, raioFoco: 80, nome: "Iniciante (1min)" },
        2: { duracao: 75, velocidade: 1.3, distratores: 1, raioFoco: 70, nome: "Básico (1.25min)" },
        3: { duracao: 90, velocidade: 1.6, distratores: 2, raioFoco: 60, nome: "Intermediário (1.5min)" },
        4: { duracao: 105, velocidade: 2, distratores: 3, raioFoco: 50, nome: "Avançado (1.75min)" },
        5: { duracao: 120, velocidade: 2.5, distratores: 4, raioFoco: 40, nome: "Expert (2min)" }
    };

    const activityInfo = {
        title: 'Foco Visual e Rastreamento',
        objective: 'Desenvolver concentração visual e rastreamento seguindo um alvo em movimento constante, ignorando distratores na tela.',
        levels: [
            'Nível 1: Iniciante - Velocidade baixa, sem distratores (1min)',
            'Nível 2: Básico - Velocidade média, 1 distrator (1.25min)',
            'Nível 3: Intermediário - Velocidade alta, 2 distratores (1.5min)',
            'Nível 4: Avançado - Velocidade rápida, 3 distratores (1.75min)',
            'Nível 5: Expert - Velocidade máxima, 4 distratores (2min)'
        ],
        howToPlay: [
            'Siga o alvo verde com o cursor do mouse constantemente.',
            'Mantenha o cursor próximo ao alvo em movimento.',
            'Ignore os distratores coloridos que aparecem na tela.',
            'Complete cada nível mantendo 70% de tempo em foco para avançar.'
        ]
    };

    // CÁLCULOS CIENTÍFICOS
    const calcularVariabilidadeProximidade = () => {
        if (proximidadeHistorico.length <= 1) return 0;
        const media = proximidadeHistorico.reduce((sum, p) => sum + p, 0) / proximidadeHistorico.length;
        const variancia = proximidadeHistorico.reduce((sum, p) => sum + Math.pow(p - media, 2), 0) / proximidadeHistorico.length;
        return Math.sqrt(variancia);
    };

    const calcularTempoRecuperacaoMedio = () => {
        if (tempoRecuperacao.length === 0) return 0;
        return tempoRecuperacao.reduce((sum, t) => sum + t, 0) / tempoRecuperacao.length;
    };

    const calcularAtosPorMinuto = () => {
        const agora = new Date();
        const diferencaMinutos = (agora.getTime() - inicioSessao.getTime()) / 60000;
        return diferencaMinutos > 0 ? (sequenciaTemporal.length / diferencaMinutos).toFixed(2) : '0.00';
    };

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

    // Animação do alvo
    useEffect(() => {
        let animationId: number;
        
        if (ativo) {
            const animate = () => {
                const agora = Date.now();
                const deltaTime = agora - ultimaAtualizacao.current;
                ultimaAtualizacao.current = agora;
                
                const config = niveis[nivel as keyof typeof niveis];
                const velocidade = config.velocidade * (deltaTime / 16);
                
                setPosicaoAlvo(prev => {
                    let novoX = prev.x + direcaoRef.current.x * velocidade;
                    let novoY = prev.y + direcaoRef.current.y * velocidade;
                    
                    if (novoX <= 5 || novoX >= 95) {
                        direcaoRef.current.x *= -1;
                        novoX = Math.max(5, Math.min(95, novoX));
                    }
                    if (novoY <= 5 || novoY >= 95) {
                        direcaoRef.current.y *= -1;
                        novoY = Math.max(5, Math.min(95, novoY));
                    }
                    
                    return { x: novoX, y: novoY };
                });
                
                calcularProximidade();
                animationId = requestAnimationFrame(animate);
            };
            
            animationId = requestAnimationFrame(animate);
        }
        
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [ativo, nivel]);

    // Gerar distratores
    useEffect(() => {
        if (ativo) {
            const config = niveis[nivel as keyof typeof niveis];
            const novosDistratores = [];
            
            for (let i = 0; i < config.distratores; i++) {
                novosDistratores.push({
                    id: i,
                    x: Math.random() * 80 + 10,
                    y: Math.random() * 80 + 10,
                    cor: ['#ef4444', '#3b82f6', '#eab308', '#8b5cf6'][Math.floor(Math.random() * 4)]
                });
            }
            
            setDistratores(novosDistratores);
            
            const interval = setInterval(() => {
                if (ativo) {
                    setDistratores(prev => prev.map(d => ({
                        ...d,
                        x: Math.random() * 80 + 10,
                        y: Math.random() * 80 + 10
                    })));
                }
            }, 3000);
            
            return () => clearInterval(interval);
        }
    }, [ativo, nivel]);

    const iniciarExercicio = () => {
        const configuracao = niveis[nivel as keyof typeof niveis];
        setDuracao(configuracao.duracao);
        setTempoRestante(configuracao.duracao);
        setAtivo(true);
        setPontuacao(0);
        setProximidadeMedia(0);
        setTempoFoco(0);
        setTempoFocoTotal(0);
        setExercicioConcluido(false);
        setJogoIniciado(true);
        setPosicaoAlvo({ x: 50, y: 50 });
        
        // Reset métricas científicas
        setSequenciaTemporal([]);
        setProximidadeHistorico([]);
        setLapsosAtencao(0);
        setTempoRecuperacao([]);
        setEmLapso(false);
        setInicioLapso(null);
        setNivelMaximo(Math.max(nivelMaximo, nivel));
        
        direcaoRef.current = { 
            x: Math.random() > 0.5 ? 1 : -1, 
            y: Math.random() > 0.5 ? 1 : -1 
        };
        ultimaAtualizacao.current = Date.now();
    };

    // FUNÇÃO handleMouseMove MODIFICADA PARA SUPORTAR TOUCH
    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!gameAreaRef.current || !ativo) return;
        
        const rect = gameAreaRef.current.getBoundingClientRect();
        let clientX, clientY;
        
        // DETECTAR SE É TOUCH OU MOUSE
        if ('touches' in e) {
            // É um evento de toque (mobile)
            if (e.touches.length === 0) return;
            
            // Previne comportamento padrão do touch
            e.preventDefault();
            
            // Pega a primeira posição de toque
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            // É um evento de mouse (desktop)
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        // Calcula posição relativa em porcentagem
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        
        // Limita aos bounds da área de jogo
        const boundedX = Math.max(0, Math.min(100, x));
        const boundedY = Math.max(0, Math.min(100, y));
        
        setPosicaoMouse({ x: boundedX, y: boundedY });
    };

    const calcularProximidade = () => {
        if (!ativo) return;
        
        const config = niveis[nivel as keyof typeof niveis];
        const distancia = Math.sqrt(
            Math.pow(posicaoAlvo.x - posicaoMouse.x, 2) + 
            Math.pow(posicaoAlvo.y - posicaoMouse.y, 2)
        );
        
        const proximidade = Math.max(0, 100 - (distancia / config.raioFoco) * 100);
        
        // MÉTRICAS CIENTÍFICAS
        setProximidadeHistorico(prev => [...prev.slice(-29), proximidade]);
        
        // Detectar lapsos de atenção
        if (proximidade < 30) {
            if (!emLapso) {
                setEmLapso(true);
                setInicioLapso(new Date());
                setLapsosAtencao(prev => prev + 1);
            }
        } else {
            if (emLapso && inicioLapso) {
                const tempoRecup = (new Date().getTime() - inicioLapso.getTime()) / 1000;
                setTempoRecuperacao(prev => [...prev, tempoRecup]);
                setEmLapso(false);
                setInicioLapso(null);
            }
        }
        
        if (proximidade > 30) {
            setTempoFoco(prev => prev + 1);
            const pontos = Math.round(proximidade * nivel * 0.2);
            setPontuacao(prev => prev + pontos);
        }
        
        setTempoFocoTotal(prev => prev + 1);
        setProximidadeMedia(prev => 
            ((prev * (tempoFocoTotal - 1)) + proximidade) / tempoFocoTotal
        );
        
        // Registrar sequência temporal
        setSequenciaTemporal(prev => [...prev, {
            timestamp: new Date(),
            nivel: nivel,
            proximidade: proximidade,
            posicao_alvo: { x: posicaoAlvo.x, y: posicaoAlvo.y },
            posicao_mouse: { x: posicaoMouse.x, y: posicaoMouse.y },
            em_foco: proximidade > 30
        }]);
    };

    const finalizarExercicio = () => {
        setAtivo(false);
        setExercicioConcluido(true);
    };

    const proximoNivel = () => {
        if (nivel < 5) {
            setNivel(prev => prev + 1);
            setExercicioConcluido(false);
            setJogoIniciado(false);
        }
    };

    const voltarInicio = () => {
        setJogoIniciado(false);
        setExercicioConcluido(false);
        setAtivo(false);
        setDistratores([]);
    };

    // FUNÇÃO DE SALVAMENTO - IGUAL AO CAA
    const handleSaveSession = async () => {
        if (tempoFocoTotal === 0) {
            alert('Nenhuma interação foi registrada para salvar.');
            return;
        }
        
        setSalvando(true);
        
        const fimSessao = new Date();
        const duracaoFinalSegundos = Math.round((fimSessao.getTime() - inicioSessao.getTime()) / 1000);
        const percentualFoco = tempoFocoTotal > 0 ? Math.round((tempoFoco / tempoFocoTotal) * 100) : 0;
        const variabilidadeProximidade = calcularVariabilidadeProximidade();
        const tempoRecuperacaoMedio = calcularTempoRecuperacaoMedio();
        
        try {
            // Obter o usuário atual - EXATAMENTE COMO NO CAA
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                console.error('Erro ao obter usuário:', userError);
                alert('Erro: Sessão expirada. Por favor, faça login novamente.');
                router.push('/login');
                return;
            }
            
            // Salvar na tabela sessoes
            const { data, error } = await supabase
                .from('sessoes')
                .insert([{
                    usuario_id: user.id,
                    atividade_nome: 'Foco_Visual',
                    pontuacao_final: pontuacao,
                    data_fim: fimSessao.toISOString(),
                    duracao_segundos: duracaoFinalSegundos,
                    // MÉTRICAS ESPECÍFICAS DO FOCO VISUAL
                    proximidade_media: Number(proximidadeMedia.toFixed(2)),
                    tempo_foco_percentual: Number(percentualFoco.toFixed(2)),
                    variabilidade_proximidade: Number(variabilidadeProximidade.toFixed(2)),
                    lapsos_atencao: lapsosAtencao,
                    tempo_recuperacao_medio: Number(tempoRecuperacaoMedio.toFixed(2)),
                    nivel_maximo_atingido: nivelMaximo,
                    distratores_nivel_final: niveis[nivelMaximo as keyof typeof niveis].distratores,
                    observacoes: JSON.stringify({
                        sequencia_temporal: sequenciaTemporal.slice(-50),
                        proximidade_historico: proximidadeHistorico,
                        tempo_recuperacao: tempoRecuperacao
                    })
                }]);

            if (error) {
                console.error('Erro ao salvar:', error);
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!
                
📊 Resumo Científico:
- ${percentualFoco}% tempo em foco
- ${proximidadeMedia.toFixed(1)}% proximidade média
- ${lapsosAtencao} lapsos de atenção
- ${tempoRecuperacaoMedio.toFixed(1)}s recuperação média
- Nível máximo: ${nivelMaximo}
- Variabilidade: ${variabilidadeProximidade.toFixed(1)}%`);
                
                router.push('/profileselection');
            }
        } catch (error: any) {
            console.error('Erro inesperado:', error);
            alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setSalvando(false);
        }
    };

    const distanciaAtual = Math.sqrt(
        Math.pow(posicaoAlvo.x - posicaoMouse.x, 2) + 
        Math.pow(posicaoAlvo.y - posicaoMouse.y, 2)
    );
    const proximidadeAtual = Math.max(0, Math.round(100 - distanciaAtual));
    const percentualFoco = tempoFocoTotal > 0 ? Math.round((tempoFoco / tempoFocoTotal) * 100) : 0;
    const podeAvancar = percentualFoco >= 70 && proximidadeMedia >= 50 && nivel < 5;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - IGUAL AO CAA */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="p-3 sm:p-4 flex items-center justify-between">
                    <Link
                        href="/tdah"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
                    >
                        <ChevronLeft size={20} />
                        <span className="text-sm sm:text-base">Voltar para TDAH</span>
                    </Link>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button 
                          onClick={handleSaveSession}
                          disabled={salvando}
                          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:bg-green-400"
                        >
                            <Save size={20} />
                            <span>{salvando ? 'Salvando...' : 'Finalizar e Salvar'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {/* Informações da Atividade - IGUAL AO CAA */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{activityInfo.title}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                            <p className="text-sm text-gray-600">{activityInfo.objective}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como se Joga:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {activityInfo.howToPlay.map((instruction, index) => (
                                    <li key={index}>{instruction}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">⭐ Níveis:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {activityInfo.levels.map((level, index) => (
                                    <li key={index}>{level}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Progresso da Sessão - IGUAL AO CAA */}
                {jogoIniciado && (
                    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">📊 Progresso da Sessão</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-blue-800">{pontuacao}</div>
                                <div className="text-xs text-blue-600">Pontos</div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-green-800">{percentualFoco}%</div>
                                <div className="text-xs text-green-600">Tempo Foco</div>
                            </div>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-purple-800">{Math.round(proximidadeMedia)}%</div>
                                <div className="text-xs text-purple-600">Proximidade Média</div>
                            </div>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-orange-800">{lapsosAtencao}</div>
                                <div className="text-xs text-orange-600">Lapsos Atenção</div>
                            </div>
                        </div>
                    </div>
                )}

                {!jogoIniciado ? (
                    // Tela inicial
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">👁️</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Foco Visual</h2>
                        <p className="text-gray-600 mb-6">Nível {nivel}: {niveis[nivel as keyof typeof niveis].nome}</p>
                        
                        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                            <h3 className="font-semibold mb-2">🧠 Base Científica:</h3>
                            <p className="text-sm text-gray-600">
                                Este exercício treina atenção visual sustentada e rastreamento de objetos, 
                                fundamentais para concentração e coordenação visomotora em pessoas com TDAH.
                            </p>
                        </div>
                        
                        <button
                            onClick={iniciarExercicio}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                        >
                            🚀 Iniciar Exercício
                        </button>
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

                            {/* Área do jogo - MODIFICADA */}
                            <div 
                                ref={gameAreaRef}
                                onMouseMove={handleMouseMove}
                                onTouchMove={handleMouseMove}  // NOVO
                                onTouchStart={handleMouseMove} // NOVO
                                className="game-area-ios-fix relative bg-gradient-to-br from-blue-50 to-green-50 cursor-none" // CLASSE MUDADA
                                style={{ 
                                    height: '500px', 
                                    width: '100%',
                                    WebkitUserSelect: 'none',  // NOVO
                                    userSelect: 'none',        // NOVO
                                    touchAction: 'none'         // NOVO
                                }}
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
                                        className="absolute w-4 h-4 rounded-full opacity-60"
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
            </main>
        </div>
    );
}
