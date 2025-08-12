'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Camera, Eye, MousePointer, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

// Declaração global do WebGazer
declare global {
    interface Window {
        webgazer: any;
    }
}

export default function VisualFocusPage() {
    const router = useRouter();
    const supabase = createClient();
    
    // Estados principais
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
    
    // Estados do Eye-Tracking
    const [modoControle, setModoControle] = useState<'eye-tracking' | 'mouse' | 'touch'>('mouse');
    const [cameraDisponivel, setCameraDisponivel] = useState(false);
    const [verificandoCamera, setVerificandoCamera] = useState(true);
    const [mostrarOpcaoEyeTracking, setMostrarOpcaoEyeTracking] = useState(false);
    const [calibrando, setCalibrando] = useState(false);
    const [calibracaoCompleta, setCalibracaoCompleta] = useState(false);
    const [pontosCalibrados, setPontosCalibrados] = useState(0);
    const [eyeTrackingAtivo, setEyeTrackingAtivo] = useState(false);
    const [dadosOculares, setDadosOculares] = useState<any[]>([]);
    const [fixacoes, setFixacoes] = useState<any[]>([]);
    const [sacadas, setSacadas] = useState<any[]>([]);
    
    // Métricas científicas
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
    const calibracaoRef = useRef<any[]>([]);
    const ultimoOlharRef = useRef({ x: 0, y: 0, timestamp: 0 });

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
        howToPlay: modoControle === 'eye-tracking' ? [
            '👁️ OLHE para o alvo verde constantemente',
            'Mantenha o foco visual no alvo em movimento',
            'Ignore os distratores coloridos',
            'Sistema rastreia automaticamente seu olhar'
        ] : [
            'Siga o alvo verde com o cursor do mouse constantemente',
            'Mantenha o cursor próximo ao alvo em movimento',
            'Ignore os distratores coloridos que aparecem na tela',
            'Complete cada nível mantendo 70% de tempo em foco para avançar'
        ]
    };

    // ==========================================
    // DETECÇÃO DE CÂMERA E DISPOSITIVO
    // ==========================================
    useEffect(() => {
        const detectarCapacidades = async () => {
            setVerificandoCamera(true);
            
            // Detectar tipo de dispositivo
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const hasTouch = 'ontouchstart' in window;
            
            // Verificar disponibilidade de câmera
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    // Tentar enumerar dispositivos primeiro (não pede permissão)
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const hasCamera = devices.some(device => device.kind === 'videoinput');
                    
                    setCameraDisponivel(hasCamera);
                    
                    if (hasCamera) {
                        setMostrarOpcaoEyeTracking(true);
                    }
                    
                    // Definir modo padrão baseado no dispositivo
                    if (isMobile && hasTouch) {
                        setModoControle('touch');
                    } else {
                        setModoControle('mouse');
                    }
                }
            } catch (error) {
                console.log('Câmera não disponível:', error);
                setCameraDisponivel(false);
            }
            
            setVerificandoCamera(false);
        };
        
        detectarCapacidades();
    }, []);

    // ==========================================
    // INICIALIZAÇÃO DO WEBGAZER
    // ==========================================
    const iniciarEyeTracking = async () => {
        if (typeof window !== 'undefined' && window.webgazer) {
            try {
                console.log('Iniciando WebGazer...');
                
                // Configurações do WebGazer
                window.webgazer.params.showVideoPreview = true;
                window.webgazer.params.showPredictionPoints = false;
                window.webgazer.params.showFaceOverlay = false;
                window.webgazer.params.showFaceFeedbackBox = false;
                
                // Iniciar WebGazer
                await window.webgazer
                    .setRegression('ridge')
                    .setTracker('TFFacemesh')
                    .begin();
                
                // Callback para dados do olhar
                window.webgazer.setGazeListener((data: any, clock: number) => {
                    if (data && eyeTrackingAtivo) {
                        // Salvar posição do olhar
                        ultimoOlharRef.current = {
                            x: data.x,
                            y: data.y,
                            timestamp: clock
                        };
                        
                        // Converter para percentual se estiver no jogo
                        if (gameAreaRef.current && ativo) {
                            const rect = gameAreaRef.current.getBoundingClientRect();
                            const x = ((data.x - rect.left) / rect.width) * 100;
                            const y = ((data.y - rect.top) / rect.height) * 100;
                            
                            setPosicaoMouse({ 
                                x: Math.max(0, Math.min(100, x)), 
                                y: Math.max(0, Math.min(100, y)) 
                            });
                            
                            // Coletar dados para análise
                            setDadosOculares(prev => [...prev.slice(-299), {
                                x: data.x,
                                y: data.y,
                                timestamp: clock
                            }]);
                        }
                    }
                });
                
                setEyeTrackingAtivo(true);
                console.log('WebGazer iniciado com sucesso!');
                
            } catch (error) {
                console.error('Erro ao iniciar eye-tracking:', error);
                setModoControle('mouse');
            }
        } else {
            console.log('WebGazer não disponível');
            setModoControle('mouse');
        }
    };

    // ==========================================
    // CALIBRAÇÃO DO EYE-TRACKING
    // ==========================================
    const iniciarCalibracao = async () => {
        setCalibrando(true);
        setPontosCalibrados(0);
        calibracaoRef.current = [];
        
        // Iniciar WebGazer primeiro
        await iniciarEyeTracking();
        
        // Pontos de calibração (9 pontos)
        const pontos = [
            { x: 10, y: 10 },   { x: 50, y: 10 },   { x: 90, y: 10 },
            { x: 10, y: 50 },   { x: 50, y: 50 },   { x: 90, y: 50 },
            { x: 10, y: 90 },   { x: 50, y: 90 },   { x: 90, y: 90 }
        ];
        
        // Mostrar pontos sequencialmente
        for (let i = 0; i < pontos.length; i++) {
            await mostrarPontoCalibracao(pontos[i], i + 1);
        }
        
        setCalibrando(false);
        setCalibracaoCompleta(true);
        setModoControle('eye-tracking');
    };

    const mostrarPontoCalibracao = (ponto: {x: number, y: number}, numero: number) => {
        return new Promise<void>((resolve) => {
            const pontoEl = document.createElement('div');
            pontoEl.className = 'calibration-point';
            pontoEl.style.position = 'fixed';
            pontoEl.style.left = `${ponto.x}%`;
            pontoEl.style.top = `${ponto.y}%`;
            pontoEl.style.width = '40px';
            pontoEl.style.height = '40px';
            pontoEl.style.backgroundColor = '#10b981';
            pontoEl.style.borderRadius = '50%';
            pontoEl.style.transform = 'translate(-50%, -50%)';
            pontoEl.style.cursor = 'pointer';
            pontoEl.style.zIndex = '10000';
            pontoEl.style.animation = 'pulse 1s infinite';
            
            // Adicionar número
            pontoEl.innerHTML = `<span style="color: white; font-weight: bold; display: flex; align-items: center; justify-content: center; height: 100%;">${numero}</span>`;
            
            document.body.appendChild(pontoEl);
            
            const handleClick = () => {
                // Registrar calibração no WebGazer
                if (window.webgazer) {
                    const screenX = (window.innerWidth * ponto.x) / 100;
                    const screenY = (window.innerHeight * ponto.y) / 100;
                    
                    // Registrar múltiplas vezes para melhor precisão
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            window.webgazer.recordScreenPosition(screenX, screenY);
                        }, i * 100);
                    }
                }
                
                // Feedback visual
                pontoEl.style.backgroundColor = '#059669';
                setPontosCalibrados(prev => prev + 1);
                
                setTimeout(() => {
                    document.body.removeChild(pontoEl);
                    resolve();
                }, 500);
            };
            
            pontoEl.addEventListener('click', handleClick);
        });
    };

    // ==========================================
    // ANÁLISE DE DADOS OCULARES
    // ==========================================
    const analisarDadosOculares = () => {
        if (dadosOculares.length < 10) return;
        
        // Detectar fixações (olhar parado por >100ms)
        const novasFixacoes: any[] = [];
        let fixacaoAtual: any[] = [];
        
        for (let i = 1; i < dadosOculares.length; i++) {
            const distancia = Math.sqrt(
                Math.pow(dadosOculares[i].x - dadosOculares[i-1].x, 2) +
                Math.pow(dadosOculares[i].y - dadosOculares[i-1].y, 2)
            );
            
            if (distancia < 50) { // Threshold para fixação
                fixacaoAtual.push(dadosOculares[i]);
            } else {
                if (fixacaoAtual.length > 3) {
                    novasFixacoes.push({
                        duracao: fixacaoAtual[fixacaoAtual.length-1].timestamp - fixacaoAtual[0].timestamp,
                        x: fixacaoAtual.reduce((sum, p) => sum + p.x, 0) / fixacaoAtual.length,
                        y: fixacaoAtual.reduce((sum, p) => sum + p.y, 0) / fixacaoAtual.length
                    });
                }
                fixacaoAtual = [];
            }
        }
        
        setFixacoes(novasFixacoes);
        
        // Detectar sacadas (movimentos rápidos)
        const novasSacadas: any[] = [];
        for (let i = 1; i < dadosOculares.length; i++) {
            const velocidade = Math.sqrt(
                Math.pow(dadosOculares[i].x - dadosOculares[i-1].x, 2) +
                Math.pow(dadosOculares[i].y - dadosOculares[i-1].y, 2)
            ) / (dadosOculares[i].timestamp - dadosOculares[i-1].timestamp);
            
            if (velocidade > 300) { // Threshold para sacada
                novasSacadas.push({
                    velocidade,
                    amplitude: Math.sqrt(
                        Math.pow(dadosOculares[i].x - dadosOculares[i-1].x, 2) +
                        Math.pow(dadosOculares[i].y - dadosOculares[i-1].y, 2)
                    )
                });
            }
        }
        
        setSacadas(novasSacadas);
    };

    // Analisar dados a cada segundo
    useEffect(() => {
        if (modoControle === 'eye-tracking' && ativo) {
            const interval = setInterval(analisarDadosOculares, 1000);
            return () => clearInterval(interval);
        }
    }, [modoControle, ativo, dadosOculares]);

    // ==========================================
    // FUNÇÕES DO JOGO
    // ==========================================
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
        
        // Reset métricas
        setSequenciaTemporal([]);
        setProximidadeHistorico([]);
        setLapsosAtencao(0);
        setTempoRecuperacao([]);
        setEmLapso(false);
        setInicioLapso(null);
        setNivelMaximo(Math.max(nivelMaximo, nivel));
        setDadosOculares([]);
        setFixacoes([]);
        setSacadas([]);
        
        direcaoRef.current = { 
            x: Math.random() > 0.5 ? 1 : -1, 
            y: Math.random() > 0.5 ? 1 : -1 
        };
        ultimaAtualizacao.current = Date.now();
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!gameAreaRef.current || !ativo || modoControle === 'eye-tracking') return;
        
        const rect = gameAreaRef.current.getBoundingClientRect();
        let clientX, clientY;
        
        if ('touches' in e) {
            if (e.touches.length === 0) return;
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        
        setPosicaoMouse({ 
            x: Math.max(0, Math.min(100, x)), 
            y: Math.max(0, Math.min(100, y)) 
        });
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

    const calcularProximidade = () => {
        if (!ativo) return;
        
        const config = niveis[nivel as keyof typeof niveis];
        const distancia = Math.sqrt(
            Math.pow(posicaoAlvo.x - posicaoMouse.x, 2) + 
            Math.pow(posicaoAlvo.y - posicaoMouse.y, 2)
        );
        
        const proximidade = Math.max(0, 100 - (distancia / config.raioFoco) * 100);
        
        setProximidadeHistorico(prev => [...prev.slice(-29), proximidade]);
        
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
        
        setSequenciaTemporal(prev => [...prev, {
            timestamp: new Date(),
            nivel: nivel,
            proximidade: proximidade,
            posicao_alvo: { x: posicaoAlvo.x, y: posicaoAlvo.y },
            posicao_mouse: { x: posicaoMouse.x, y: posicaoMouse.y },
            em_foco: proximidade > 30,
            modo_controle: modoControle
        }]);
    };

    const finalizarExercicio = () => {
        setAtivo(false);
        setExercicioConcluido(true);
        
        // Parar eye-tracking se ativo
        if (modoControle === 'eye-tracking' && window.webgazer) {
            window.webgazer.pause();
        }
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

    // Cálculos científicos
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

    // Função de salvamento
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
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                console.error('Erro ao obter usuário:', userError);
                alert('Erro: Sessão expirada. Por favor, faça login novamente.');
                router.push('/login');
                return;
            }
            
            // Preparar dados avançados se eye-tracking
            const dadosAvancados = modoControle === 'eye-tracking' ? {
                modo_controle: 'eye-tracking',
                total_fixacoes: fixacoes.length,
                duracao_media_fixacao: fixacoes.length > 0 
                    ? fixacoes.reduce((sum, f) => sum + f.duracao, 0) / fixacoes.length 
                    : 0,
                total_sacadas: sacadas.length,
                velocidade_media_sacada: sacadas.length > 0
                    ? sacadas.reduce((sum, s) => sum + s.velocidade, 0) / sacadas.length
                    : 0,
                dados_oculares_resumo: {
                    total_pontos: dadosOculares.length,
                    fixacoes: fixacoes.slice(-20),
                    sacadas: sacadas.slice(-20)
                }
            } : {
                modo_controle: modoControle
            };
            
            const { data, error } = await supabase
                .from('sessoes')
                .insert([{
                    usuario_id: user.id,
                    atividade_nome: 'Foco_Visual',
                    pontuacao_final: pontuacao,
                    data_fim: fimSessao.toISOString(),
                    duracao_segundos: duracaoFinalSegundos,
                    proximidade_media: Number(proximidadeMedia.toFixed(2)),
                    tempo_foco_percentual: Number(percentualFoco.toFixed(2)),
                    variabilidade_proximidade: Number(variabilidadeProximidade.toFixed(2)),
                    lapsos_atencao: lapsosAtencao,
                    tempo_recuperacao_medio: Number(tempoRecuperacaoMedio.toFixed(2)),
                    nivel_maximo_atingido: nivelMaximo,
                    distratores_nivel_final: niveis[nivelMaximo as keyof typeof niveis].distratores,
                    observacoes: JSON.stringify({
                        ...dadosAvancados,
                        sequencia_temporal: sequenciaTemporal.slice(-50),
                        proximidade_historico: proximidadeHistorico,
                        tempo_recuperacao: tempoRecuperacao
                    })
                }]);

            if (error) {
                console.error('Erro ao salvar:', error);
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                const mensagemExtra = modoControle === 'eye-tracking' 
                    ? `\n🧠 Dados Avançados:\n• ${fixacoes.length} fixações oculares\n• ${sacadas.length} movimentos sacádicos`
                    : '';
                
                alert(`Sessão salva com sucesso!
                
📊 Resumo Científico:
- ${percentualFoco}% tempo em foco
- ${proximidadeMedia.toFixed(1)}% proximidade média
- ${lapsosAtencao} lapsos de atenção
- ${tempoRecuperacaoMedio.toFixed(1)}s recuperação média
- Nível máximo: ${nivelMaximo}
- Variabilidade: ${variabilidadeProximidade.toFixed(1)}%${mensagemExtra}`);
                
                router.push('/profileselection');
            }
        } catch (error: any) {
            console.error('Erro inesperado:', error);
            alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setSalvando(false);
            
            // Limpar eye-tracking
            if (window.webgazer) {
                window.webgazer.end();
            }
        }
    };

    // Limpar WebGazer ao sair
    useEffect(() => {
        return () => {
            if (window.webgazer && eyeTrackingAtivo) {
                window.webgazer.end();
            }
        };
    }, [eyeTrackingAtivo]);

    const distanciaAtual = Math.sqrt(
        Math.pow(posicaoAlvo.x - posicaoMouse.x, 2) + 
        Math.pow(posicaoAlvo.y - posicaoMouse.y, 2)
    );
    const proximidadeAtual = Math.max(0, Math.round(100 - distanciaAtual));
    const percentualFoco = tempoFocoTotal > 0 ? Math.round((tempoFoco / tempoFocoTotal) * 100) : 0;
    const podeAvancar = percentualFoco >= 70 && proximidadeMedia >= 50 && nivel < 5;

    // CSS para animação de calibração
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.2); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
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
                        {modoControle === 'eye-tracking' && (
                            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                                <Eye size={16} />
                                <span className="text-sm font-medium">Eye-Tracking Ativo</span>
                            </div>
                        )}
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
                {/* Modal de Opção Eye-Tracking */}
                {mostrarOpcaoEyeTracking && !calibracaoCompleta && !jogoIniciado && !verificandoCamera && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🎥</div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    Câmera Detectada!
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Use <strong>RASTREAMENTO OCULAR</strong> para:
                                </p>
                                <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
                                    <li>• Maior precisão diagnóstica</li>
                                    <li>• Métricas científicas avançadas</li>
                                    <li>• Análise de fixações e sacadas</li>
                                    <li>• Sem necessidade de mouse ou toque</li>
                                </ul>
                                <div className="space-y-3">
                                    <button
                                        onClick={iniciarCalibracao}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <Eye size={20} />
                                        <span>Usar Eye-Tracking</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setMostrarOpcaoEyeTracking(false);
                                            const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
                                            setModoControle(isMobile ? 'touch' : 'mouse');
                                        }}
                                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                    >
                                        {/Android|iPhone|iPad/i.test(navigator.userAgent) ? (
                                            <>
                                                <Smartphone size={20} />
                                                <span>Usar Touch</span>
                                            </>
                                        ) : (
                                            <>
                                                <MousePointer size={20} />
                                                <span>Usar Mouse</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tela de Calibração */}
                {calibrando && (
                    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Calibração do Eye-Tracking
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Clique em cada ponto verde que aparecer
                            </p>
                            <div className="text-2xl font-bold text-green-600">
                                {pontosCalibrados} / 9 pontos calibrados
                            </div>
                            <div className="mt-8 w-64 bg-gray-200 rounded-full h-4 mx-auto">
                                <div 
                                    className="bg-green-600 h-4 rounded-full transition-all duration-300"
                                    style={{ width: `${(pontosCalibrados / 9) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Informações da Atividade */}
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

                {/* Progresso da Sessão */}
                {jogoIniciado && (
                    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            📊 Progresso da Sessão
                            {modoControle === 'eye-tracking' && (
                                <span className="ml-3 text-sm font-normal text-green-600">
                                    (Eye-Tracking: {fixacoes.length} fixações, {sacadas.length} sacadas)
                                </span>
                            )}
                        </h3>
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
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">👁️</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Foco Visual</h2>
                        <p className="text-gray-600 mb-2">Nível {nivel}: {niveis[nivel as keyof typeof niveis].nome}</p>
                        {modoControle === 'eye-tracking' && (
                            <p className="text-green-600 font-medium mb-4">
                                ✅ Eye-Tracking Calibrado e Pronto!
                            </p>
                        )}
                        
                        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                            <h3 className="font-semibold mb-2">🧠 Base Científica:</h3>
                            <p className="text-sm text-gray-600">
                                Este exercício treina atenção visual sustentada e rastreamento de objetos, 
                                fundamentais para concentração e coordenação visomotora em pessoas com TDAH.
                                {modoControle === 'eye-tracking' && (
                                    <span className="block mt-2 text-green-600">
                                        Com eye-tracking, medimos fixações oculares, sacadas e padrões de varredura visual 
                                        para análise científica precisa.
                                    </span>
                                )}
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
                    <div className="space-y-6">
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
                            <div className="h-2 bg-gray-200">
                                <div 
                                    className="h-full bg-green-500 transition-all duration-1000"
                                    style={{ width: `${((duracao - tempoRestante) / duracao) * 100}%` }}
                                />
                            </div>

                            <div 
                                ref={gameAreaRef}
                                onMouseMove={handleMouseMove}
                                onTouchMove={handleMouseMove}
                                onTouchStart={handleMouseMove}
                                className="relative bg-gradient-to-br from-blue-50 to-green-50 cursor-none"
                                style={{ 
                                    height: '500px', 
                                    width: '100%'
                                }}
                            >
                                <div
                                    className="absolute w-6 h-6 bg-green-500 rounded-full shadow-lg border-2 border-white animate-pulse"
                                    style={{ 
                                        left: `${posicaoAlvo.x}%`, 
                                        top: `${posicaoAlvo.y}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                />

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

                                {modoControle !== 'eye-tracking' && (
                                    <div
                                        className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white pointer-events-none"
                                        style={{ 
                                            left: `${posicaoMouse.x}%`, 
                                            top: `${posicaoMouse.y}%`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    />
                                )}

                                {modoControle === 'eye-tracking' && (
                                    <div
                                        className="absolute w-8 h-8 rounded-full border-4 border-red-500 pointer-events-none"
                                        style={{ 
                                            left: `${posicaoMouse.x}%`, 
                                            top: `${posicaoMouse.y}%`,
                                            transform: 'translate(-50%, -50%)',
                                            backgroundColor: 'rgba(239, 68, 68, 0.2)'
                                        }}
                                    />
                                )}

                                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
                                    <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg">
                                        <div className="font-medium">
                                            {modoControle === 'eye-tracking' 
                                                ? '👁️ Olhe para o alvo verde!' 
                                                : '🟢 Siga o alvo verde com o cursor!'}
                                        </div>
                                        <div className="text-sm opacity-90">
                                            Proximidade: {proximidadeAtual}% | Tempo restante: {tempoRestante}s
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">
                            {percentualFoco >= 80 && proximidadeMedia >= 60 ? '🏆' : 
                             percentualFoco >= 70 && proximidadeMedia >= 50 ? '🎉' : '💪'}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            {percentualFoco >= 80 && proximidadeMedia >= 60 ? 'Foco Excepcional!' : 
                             percentualFoco >= 70 && proximidadeMedia >= 50 ? 'Muito Bem!' : 'Continue Praticando!'}
                        </h3>
                        
                        {modoControle === 'eye-tracking' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-green-800 mb-2">
                                    🧠 Análise Eye-Tracking
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Fixações:</span>
                                        <span className="font-bold text-green-800 ml-2">{fixacoes.length}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Sacadas:</span>
                                        <span className="font-bold text-green-800 ml-2">{sacadas.length}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
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
