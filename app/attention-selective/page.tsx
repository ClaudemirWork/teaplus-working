'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

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


type Direction = 'up' | 'down' | 'left' | 'right';
type TrialType = 'congruent' | 'incongruent' | 'neutral';

interface Trial {
    target: Direction;
    flankers: Direction[];
    type: TrialType;
    startTime: number;
    responseTime?: number;
    correct?: boolean;
    responded?: boolean;
}

export default function SelectiveAttentionPage() {
    const router = useRouter();
    const supabase = createClient();
    
    // Estados do jogo
    const [nivel, setNivel] = useState(1);
    const [pontuacao, setPontuacao] = useState(0);
    const [jogoIniciado, setJogoIniciado] = useState(false);
    const [exercicioConcluido, setExercicioConcluido] = useState(false);
    const [salvando, setSalvando] = useState(false);
    
    // Estados da tarefa Flanker
    const [trialAtual, setTrialAtual] = useState<Trial | null>(null);
    const [trials, setTrials] = useState<Trial[]>([]);
    const [trialIndex, setTrialIndex] = useState(0);
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect'>('correct');
    
    // Configurações por nível
    const niveis = {
        1: { totalTrials: 20, tempoLimite: 3000, nome: "Iniciante", proporcaoIncongruente: 0.3 },
        2: { totalTrials: 30, tempoLimite: 2500, nome: "Básico", proporcaoIncongruente: 0.4 },
        3: { totalTrials: 40, tempoLimite: 2000, nome: "Intermediário", proporcaoIncongruente: 0.5 },
        4: { totalTrials: 50, tempoLimite: 1500, nome: "Avançado", proporcaoIncongruente: 0.6 },
        5: { totalTrials: 60, tempoLimite: 1200, nome: "Expert", proporcaoIncongruente: 0.7 }
    };

    // Gerar trials baseado no nível
    const gerarTrials = (nivel: number): Trial[] => {
        const config = niveis[nivel as keyof typeof niveis];
        const novasTrials: Trial[] = [];
        const direcoes: Direction[] = ['up', 'down', 'left', 'right'];
        
        const numIncongruente = Math.floor(config.totalTrials * config.proporcaoIncongruente);
        const numCongruente = Math.floor((config.totalTrials - numIncongruente) * 0.7);
        const numNeutral = config.totalTrials - numIncongruente - numCongruente;
        
        // Criar trials incongruentes
        for (let i = 0; i < numIncongruente; i++) {
            const target = direcoes[Math.floor(Math.random() * direcoes.length)];
            const flankerDirection = direcoes.filter(d => d !== target)[Math.floor(Math.random() * 3)];
            novasTrials.push({
                target,
                flankers: [flankerDirection, flankerDirection, flankerDirection, flankerDirection],
                type: 'incongruent',
                startTime: 0
            });
        }
        
        // Criar trials congruentes
        for (let i = 0; i < numCongruente; i++) {
            const direction = direcoes[Math.floor(Math.random() * direcoes.length)];
            novasTrials.push({
                target: direction,
                flankers: [direction, direction, direction, direction],
                type: 'congruent',
                startTime: 0
            });
        }
        
        // Criar trials neutros
        for (let i = 0; i < numNeutral; i++) {
            const target = direcoes[Math.floor(Math.random() * direcoes.length)];
            novasTrials.push({
                target,
                flankers: ['neutral' as Direction, 'neutral' as Direction, 'neutral' as Direction, 'neutral' as Direction],
                type: 'neutral',
                startTime: 0
            });
        }
        
        // Embaralhar
        return novasTrials.sort(() => Math.random() - 0.5);
    };

    // Iniciar exercício
    const iniciarExercicio = () => {
        const novasTrials = gerarTrials(nivel);
        setTrials(novasTrials);
        setTrialIndex(0);
        setPontuacao(0);
        setJogoIniciado(true);
        setExercicioConcluido(false);
        
        // Iniciar primeira trial após delay
        setTimeout(() => {
            if (novasTrials.length > 0) {
                setTrialAtual({ ...novasTrials[0], startTime: Date.now() });
            }
        }, 1000);
    };

    // Processar resposta do usuário
    const handleResponse = (direction: Direction) => {
        if (!trialAtual || trialAtual.responded) return;
        
        const responseTime = Date.now() - trialAtual.startTime;
        const correct = direction === trialAtual.target;
        
        const updatedTrial = {
            ...trialAtual,
            responseTime,
            correct,
            responded: true
        };
        
        const updatedTrials = [...trials];
        updatedTrials[trialIndex] = updatedTrial;
        setTrials(updatedTrials);
        
        if (correct) {
            const bonus = responseTime < 500 ? 20 : responseTime < 1000 ? 15 : 10;
            setPontuacao(prev => prev + bonus * nivel);
        }
        
        setFeedbackType(correct ? 'correct' : 'incorrect');
        setMostrarFeedback(true);
        
        setTimeout(() => {
            setMostrarFeedback(false);
            proximaTrial();
        }, 500);
    };

    // Avançar para próxima trial
    const proximaTrial = () => {
        const nextIndex = trialIndex + 1;
        
        if (nextIndex >= trials.length) {
            finalizarExercicio();
        } else {
            setTrialIndex(nextIndex);
            setTimeout(() => {
                setTrialAtual({ ...trials[nextIndex], startTime: Date.now() });
            }, 500);
        }
    };

    // Timeout para trials sem resposta
    useEffect(() => {
        if (trialAtual && !trialAtual.responded) {
            const config = niveis[nivel as keyof typeof niveis];
            const timeout = setTimeout(() => {
                handleResponse('none' as Direction);
            }, config.tempoLimite);
            
            return () => clearTimeout(timeout);
        }
    }, [trialAtual]);

    // Finalizar exercício
    const finalizarExercicio = () => {
        setJogoIniciado(false);
        setExercicioConcluido(true);
        setTrialAtual(null);
    };

    // Calcular métricas
    const calcularMetricas = () => {
        const trialsRespondidas = trials.filter(t => t.responded);
        if (trialsRespondidas.length === 0) {
            return {
                acertosTotal: 0, totalTentativas: 0, acertosCongruentes: 0,
                acertosIncongruentes: 0, rtCongruente: 0, rtIncongruente: 0,
                indiceInterferencia: 0, precisaoTotal: 0
            };
        }
        
        const congruentes = trialsRespondidas.filter(t => t.type === 'congruent');
        const incongruentes = trialsRespondidas.filter(t => t.type === 'incongruent');
        
        const acertosTotal = trialsRespondidas.filter(t => t.correct).length;
        const acertosCongruentes = congruentes.filter(t => t.correct).length;
        const acertosIncongruentes = incongruentes.filter(t => t.correct).length;
        
        const rtCongruente = congruentes.length > 0 
            ? Math.round(congruentes.reduce((acc, t) => acc + (t.responseTime || 0), 0) / congruentes.length)
            : 0;
        
        const rtIncongruente = incongruentes.length > 0
            ? Math.round(incongruentes.reduce((acc, t) => acc + (t.responseTime || 0), 0) / incongruentes.length)
            : 0;
        
        const indiceInterferencia = rtIncongruente - rtCongruente;
        const precisaoTotal = Math.round((acertosTotal / trialsRespondidas.length) * 100);
        
        return {
            acertosTotal, totalTentativas: trialsRespondidas.length, acertosCongruentes,
            acertosIncongruentes, rtCongruente, rtIncongruente, indiceInterferencia, precisaoTotal
        };
    };

    // Renderizar setas do Flanker
    const renderizarFlanker = () => {
        if (!trialAtual) return null;
        
        const getArrow = (direction: Direction | 'neutral') => {
            switch (direction) {
                case 'up': return <ArrowUp size={48} />;
                case 'down': return <ArrowDown size={48} />;
                case 'left': return <ArrowLeft size={48} />;
                case 'right': return <ArrowRight size={48} />;
                case 'neutral': return <div className="w-12 h-12 bg-gray-400 rounded" />;
                default: return null;
            }
        };
        
        return (
            <div className="flex items-center justify-center space-x-4">
                <div className="text-gray-600">{getArrow(trialAtual.flankers[0])}</div>
                <div className="text-gray-600">{getArrow(trialAtual.flankers[1])}</div>
                <div className="text-blue-600 border-4 border-blue-400 rounded-lg p-2 bg-blue-50">
                    {getArrow(trialAtual.target)}
                </div>
                <div className="text-gray-600">{getArrow(trialAtual.flankers[2])}</div>
                <div className="text-gray-600">{getArrow(trialAtual.flankers[3])}</div>
            </div>
        );
    };

    // FUNÇÃO DE SALVAMENTO - CORRIGIDA
    const handleSaveSession = async () => {
        if (trials.filter(t => t.responded).length === 0) {
            alert('Complete pelo menos uma tentativa antes de salvar.');
            return;
        }
        
        setSalvando(true);
        const metricas = calcularMetricas();
        
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
                    atividade_nome: 'Atenção Seletiva',
                    pontuacao_final: pontuacao,
                    data_fim: new Date().toISOString()
                }]);

            if (error) {
                console.error('Erro ao salvar:', error);
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!
                
📊 Resumo:
• ${metricas.acertosTotal}/${metricas.totalTentativas} acertos (${metricas.precisaoTotal}%)
• Interferência: ${metricas.indiceInterferencia}ms
• Nível ${nivel} completado
• ${pontuacao} pontos`);
                
                // Redirecionamento CORRIGIDO
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error('Erro inesperado:', error);
            alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setSalvando(false);
        }
    };

    const voltarInicio = () => {
        setJogoIniciado(false);
        setExercicioConcluido(false);
        setTrialAtual(null);
        setTrials([]);
        setTrialIndex(0);
    };

    const proximoNivel = () => {
        if (nivel < 5) {
            setNivel(prev => prev + 1);
            voltarInicio();
        }
    };

    const metricas = calcularMetricas();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header PADRONIZADO implementado */}
            <GameHeader 
                title="Atenção Seletiva"
                icon={<Target size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={exercicioConcluido}
            />
            
            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {!jogoIniciado && !exercicioConcluido ? (
                    // Tela inicial
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                             {/* Título h1 foi REMOVIDO daqui e movido para o GameHeader */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                                    <p className="text-sm text-gray-600">
                                        Responda apenas à seta CENTRAL, ignorando as setas ao redor.
                                    </p>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Foque na seta do MEIO (azul)</li>
                                        <li>Use as setas do teclado ou botões</li>
                                        <li>Ignore as setas cinzas ao lado</li>
                                        <li>Responda o mais rápido possível</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">⭐ Dica:</h3>
                                    <p className="text-sm text-gray-600">
                                        Quando as setas apontam para direções diferentes, é mais difícil. Mantenha o foco!
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
                                        <div className="text-2xl mb-1">🎯</div>
                                        <div className="text-sm">Nível {key}</div>
                                        <div className="text-xs opacity-80">{value.nome}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={iniciarExercicio}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                            >
                                🚀 Iniciar Atividade
                            </button>
                        </div>
                    </div>
                ) : jogoIniciado ? (
                    // Área de jogo
                    <div className="space-y-6">
                        {/* Progresso */}
                        <div className="bg-white rounded-xl shadow-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold text-gray-800">📊 Progresso</h3>
                                <span className="text-sm text-gray-600">
                                    Tentativa {trialIndex + 1} de {trials.length}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((trialIndex + 1) / trials.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Área do Flanker */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="text-center mb-6">
                                <p className="text-lg font-semibold text-gray-700 mb-2">
                                    Responda à direção da seta AZUL (centro)
                                </p>
                                <p className="text-sm text-gray-500">
                                    Use as setas do teclado: ↑ ↓ ← →
                                </p>
                            </div>

                            {/* Display do Flanker */}
                            <div className="flex justify-center items-center min-h-[200px] bg-gray-50 rounded-lg">
                                {trialAtual && !mostrarFeedback ? (
                                    renderizarFlanker()
                                ) : mostrarFeedback ? (
                                    <div className={`text-4xl font-bold ${feedbackType === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                                        {feedbackType === 'correct' ? '✓ Correto!' : '✗ Incorreto'}
                                    </div>
                                ) : (
                                    <div className="text-gray-400">Preparando...</div>
                                )}
                            </div>

                            {/* Botões de resposta para mobile */}
                            <div className="grid grid-cols-3 gap-4 mt-8 max-w-xs mx-auto">
                                <div />
                                <button
                                    onClick={() => handleResponse('up')}
                                    className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                                    disabled={!trialAtual || trialAtual.responded}
                                >
                                    <ArrowUp size={32} className="mx-auto" />
                                </button>
                                <div />
                                
                                <button
                                    onClick={() => handleResponse('left')}
                                    className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                                    disabled={!trialAtual || trialAtual.responded}
                                >
                                    <ArrowLeft size={32} className="mx-auto" />
                                </button>
                                <button
                                    onClick={() => handleResponse('down')}
                                    className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                                    disabled={!trialAtual || trialAtual.responded}
                                >
                                    <ArrowDown size={32} className="mx-auto" />
                                </button>
                                <button
                                    onClick={() => handleResponse('right')}
                                    className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                                    disabled={!trialAtual || trialAtual.responded}
                                >
                                    <ArrowRight size={32} className="mx-auto" />
                                </button>
                            </div>
                        </div>

                        {/* Pontuação atual */}
                        <div className="bg-white rounded-xl shadow-lg p-4">
                            <div className="flex justify-around text-center">
                                <div>
                                    <div className="text-2xl font-bold text-orange-600">{pontuacao}</div>
                                    <div className="text-sm text-gray-600">Pontos</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {trials.filter(t => t.correct).length}/{trialIndex}
                                    </div>
                                    <div className="text-sm text-gray-600">Acertos</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Tela de resultados
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">
                                {metricas.precisaoTotal >= 90 ? '🏆' : metricas.precisaoTotal >= 75 ? '🎉' : '💪'}
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {metricas.precisaoTotal >= 90 ? 'Excelente!' : metricas.precisaoTotal >= 75 ? 'Muito bem!' : 'Continue praticando!'}
                            </h3>
                            
                            <p className="text-gray-600">
                                Você completou o nível {nivel} com {metricas.precisaoTotal}% de precisão
                            </p>
                        </div>
                        
                        {/* Métricas detalhadas */}
                        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">📊 Resultados da Sessão</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-blue-800">
                                        {metricas.acertosTotal}/{metricas.totalTentativas}
                                    </div>
                                    <div className="text-xs text-blue-600">Acertos Total</div>
                                </div>
                                
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-green-800">{metricas.rtCongruente}ms</div>
                                    <div className="text-xs text-green-600">Tempo Congruente</div>
                                </div>
                                
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-purple-800">{metricas.rtIncongruente}ms</div>
                                    <div className="text-xs text-purple-600">Tempo Incongruente</div>
                                </div>
                                
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                                    <div className="text-xl font-bold text-orange-800">{metricas.indiceInterferencia}ms</div>
                                    <div className="text-xs text-orange-600">Índice Interferência</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Análise de desempenho */}
                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <h4 className="font-bold text-blue-800 mb-2">📊 Análise do Desempenho:</h4>
                            <div className="text-sm text-blue-700 space-y-1">
                                <p>• Precisão: {metricas.precisaoTotal >= 75 ? '✅ Ótima!' : '⚠️ Precisa melhorar'}</p>
                                <p>• Controle de Interferência: {metricas.indiceInterferencia < 200 ? '✅ Excelente' : metricas.indiceInterferencia < 400 ? '⚠️ Moderado' : '🔴 Precisa treinar'}</p>
                                <p>• Velocidade: {metricas.rtCongruente < 800 ? '✅ Rápido' : '⚠️ Pode melhorar'}</p>
                            </div>
                        </div>
                        
                        {/* Botões de ação */}
                        <div className="flex justify-center space-x-4">
                            {metricas.precisaoTotal >= 75 && nivel < 5 && (
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
    );
}
