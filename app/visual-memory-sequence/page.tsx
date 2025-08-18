'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Brain, Check, X, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

export default function VisualMemorySequencePage() {
    const router = useRouter();
    const supabase = createClient();
    
    // Estados principais
    const [nivel, setNivel] = useState(1);
    const [sequenciaAtual, setSequenciaAtual] = useState<string[]>([]);
    const [sequenciaUsuario, setSequenciaUsuario] = useState<string[]>([]);
    const [mostrandoSequencia, setMostrandoSequencia] = useState(false);
    const [aguardandoResposta, setAguardandoResposta] = useState(false);
    const [jogoIniciado, setJogoIniciado] = useState(false);
    const [exercicioConcluido, setExercicioConcluido] = useState(false);
    const [salvando, setSalvando] = useState(false);
    
    // Métricas e pontuação
    const [pontuacao, setPontuacao] = useState(0);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);
    const [acertosNivel, setAcertosNivel] = useState(0);
    const [errosNivel, setErrosNivel] = useState(0);
    const [tentativasTotal, setTentativasTotal] = useState(0);
    
    // Métricas científicas
    const [inicioSessao] = useState(new Date());
    const [temposResposta, setTemposResposta] = useState<number[]>([]);
    const [sequenciaTemporal, setSequenciaTemporal] = useState<any[]>([]);
    const [nivelMaximo, setNivelMaximo] = useState(1);
    const [spanMaximo, setSpanMaximo] = useState(0);
    const inicioMemorizacao = useRef<Date | null>(null);
    const inicioResposta = useRef<Date | null>(null);
    
    // Feedback visual
    const [feedbackAtivo, setFeedbackAtivo] = useState<'acerto' | 'erro' | null>(null);
    const [simboloFeedback, setSimboloFeedback] = useState<string>('');

    // Configurações por nível
    const niveis = {
        1: { tamanho: 3, tempo: 2000, nome: "Iniciante (3 símbolos)" },
        2: { tamanho: 4, tempo: 3000, nome: "Básico (4 símbolos)" },
        3: { tamanho: 5, tempo: 4000, nome: "Intermediário (5 símbolos)" },
        4: { tamanho: 6, tempo: 5000, nome: "Avançado (6 símbolos)" },
        5: { tamanho: 7, tempo: 6000, nome: "Expert (7 símbolos)" }
    };

    // Símbolos disponíveis - emojis de alta visibilidade
    const simbolos = ['🔵', '🔴', '🟢', '🟡', '🟣', '🟠', '⬜', '⬛', '🔺', '💎'];

    const activityInfo = {
        title: 'Memória Visual Sequencial',
        objective: 'Desenvolver a memória de trabalho visual e a capacidade de reter e reproduzir sequências, habilidades fundamentais para atenção e aprendizagem.',
        levels: [
            'Nível 1: Memorize 3 símbolos em 2 segundos',
            'Nível 2: Memorize 4 símbolos em 3 segundos',
            'Nível 3: Memorize 5 símbolos em 4 segundos',
            'Nível 4: Memorize 6 símbolos em 5 segundos',
            'Nível 5: Memorize 7 símbolos em 6 segundos'
        ],
        howToPlay: [
            'Observe atentamente a sequência de símbolos',
            'Memorize a ordem exata dos símbolos',
            'Clique nos símbolos na mesma ordem',
            'Acerte 3 sequências para avançar de nível',
            '3 erros encerram a sessão'
        ]
    };

    // Gerar nova sequência
    const gerarSequencia = () => {
        const config = niveis[nivel as keyof typeof niveis];
        const novaSequencia: string[] = [];
        const simbolosDisponiveis = [...simbolos];
        
        for (let i = 0; i < config.tamanho; i++) {
            const indice = Math.floor(Math.random() * simbolosDisponiveis.length);
            novaSequencia.push(simbolosDisponiveis[indice]);
            // Remove o símbolo para evitar repetição na mesma sequência
            simbolosDisponiveis.splice(indice, 1);
        }
        
        return novaSequencia;
    };

    // Iniciar nova rodada
    const iniciarRodada = () => {
        const novaSequencia = gerarSequencia();
        setSequenciaAtual(novaSequencia);
        setSequenciaUsuario([]);
        setMostrandoSequencia(true);
        setAguardandoResposta(false);
        setFeedbackAtivo(null);
        inicioMemorizacao.current = new Date();
        
        const config = niveis[nivel as keyof typeof niveis];
        
        // Mostrar sequência pelo tempo configurado
        setTimeout(() => {
            setMostrandoSequencia(false);
            setAguardandoResposta(true);
            inicioResposta.current = new Date();
        }, config.tempo);
    };

    // Processar clique do usuário
    const handleSimboloClick = (simbolo: string) => {
        if (!aguardandoResposta || feedbackAtivo) return;
        
        const novaSequenciaUsuario = [...sequenciaUsuario, simbolo];
        setSequenciaUsuario(novaSequenciaUsuario);
        
        // Verificar se o símbolo está correto na posição
        const posicao = novaSequenciaUsuario.length - 1;
        const simboloCorreto = sequenciaAtual[posicao];
        
        if (simbolo !== simboloCorreto) {
            // Erro imediato
            processarErro(novaSequenciaUsuario);
        } else if (novaSequenciaUsuario.length === sequenciaAtual.length) {
            // Sequência completa e correta
            processarAcerto(novaSequenciaUsuario);
        }
        // Continua aguardando mais cliques se ainda não completou
    };

    // Processar acerto
    const processarAcerto = (sequenciaRespondida: string[]) => {
        if (!inicioResposta.current) return;
        
        const tempoResposta = (new Date().getTime() - inicioResposta.current.getTime()) / 1000;
        
        setAcertos(prev => prev + 1);
        setAcertosNivel(prev => prev + 1);
        setPontuacao(prev => prev + (nivel * 10));
        setTemposResposta(prev => [...prev, tempoResposta]);
        setTentativasTotal(prev => prev + 1);
        
        // Atualizar span máximo
        const tamanhoSequencia = sequenciaAtual.length;
        setSpanMaximo(prev => Math.max(prev, tamanhoSequencia));
        
        // Registrar na sequência temporal
        setSequenciaTemporal(prev => [...prev, {
            nivel,
            sequencia: sequenciaAtual.join(''),
            resposta: sequenciaRespondida.join(''),
            acertou: true,
            tempoMemorizacao: niveis[nivel as keyof typeof niveis].tempo / 1000,
            tempoResposta,
            timestamp: new Date()
        }]);
        
        // Feedback visual
        setFeedbackAtivo('acerto');
        setAguardandoResposta(false);
        
        setTimeout(() => {
            setFeedbackAtivo(null);
            
            // Verificar progressão
            if (acertosNivel >= 3 && nivel < 5) {
                avancarNivel();
            } else if (nivel === 5 && acertosNivel >= 3) {
                finalizarExercicio();
            } else {
                iniciarRodada();
            }
        }, 1500);
    };

    // Processar erro
    const processarErro = (sequenciaRespondida: string[]) => {
        if (!inicioResposta.current) return;
        
        const tempoResposta = (new Date().getTime() - inicioResposta.current.getTime()) / 1000;
        
        setErros(prev => prev + 1);
        setErrosNivel(prev => prev + 1);
        setTemposResposta(prev => [...prev, tempoResposta]);
        setTentativasTotal(prev => prev + 1);
        
        // Registrar na sequência temporal
        setSequenciaTemporal(prev => [...prev, {
            nivel,
            sequencia: sequenciaAtual.join(''),
            resposta: sequenciaRespondida.join(''),
            acertou: false,
            tempoMemorizacao: niveis[nivel as keyof typeof niveis].tempo / 1000,
            tempoResposta,
            timestamp: new Date()
        }]);
        
        // Mostrar sequência correta como feedback
        setSimboloFeedback(sequenciaAtual.join(' → '));
        setFeedbackAtivo('erro');
        setAguardandoResposta(false);
        
        setTimeout(() => {
            setFeedbackAtivo(null);
            setSimboloFeedback('');
            
            // Verificar se deve encerrar
            if (errosNivel + 1 >= 3) {
                finalizarExercicio();
            } else {
                iniciarRodada();
            }
        }, 2500);
    };

    // Avançar nível
    const avancarNivel = () => {
        const novoNivel = nivel + 1;
        setNivel(novoNivel);
        setNivelMaximo(Math.max(nivelMaximo, novoNivel));
        setAcertosNivel(0);
        setErrosNivel(0);
        setFeedbackAtivo(null);
        
        // Tela de transição
        setTimeout(() => {
            iniciarRodada();
        }, 1000);
    };

    // Iniciar exercício
    const iniciarExercicio = () => {
        setJogoIniciado(true);
        setExercicioConcluido(false);
        setPontuacao(0);
        setAcertos(0);
        setErros(0);
        setAcertosNivel(0);
        setErrosNivel(0);
        setTentativasTotal(0);
        setSequenciaTemporal([]);
        setTemposResposta([]);
        setSpanMaximo(0);
        
        iniciarRodada();
    };

    // Finalizar exercício
    const finalizarExercicio = () => {
        setJogoIniciado(false);
        setExercicioConcluido(true);
        setAguardandoResposta(false);
        setMostrandoSequencia(false);
    };

    // Reiniciar
    const reiniciar = () => {
        setNivel(1);
        setNivelMaximo(1);
        setExercicioConcluido(false);
        setJogoIniciado(false);
        setSequenciaAtual([]);
        setSequenciaUsuario([]);
    };

    // Calcular métricas
    const calcularTempoMedioResposta = () => {
        if (temposResposta.length === 0) return 0;
        return temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length;
    };

    const calcularTaxaAcerto = () => {
        if (tentativasTotal === 0) return 0;
        return (acertos / tentativasTotal) * 100;
    };

    // Salvar sessão - AGORA COM span_maximo
    const handleSaveSession = async () => {
        if (tentativasTotal === 0) {
            alert('Nenhuma atividade foi registrada para salvar.');
            return;
        }
        
        setSalvando(true);
        
        const fimSessao = new Date();
        const duracaoSegundos = Math.round((fimSessao.getTime() - inicioSessao.getTime()) / 1000);
        const tempoMedioResposta = calcularTempoMedioResposta();
        const taxaAcerto = calcularTaxaAcerto();
        
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
                    atividade_nome: 'Memoria_Visual_Sequencial',
                    pontuacao_final: pontuacao,
                    tempo_total: duracaoSegundos,
                    data_fim: fimSessao.toISOString(),
                    duracao_segundos: duracaoSegundos,
                    nivel_maximo_atingido: nivelMaximo,
                    tempo_reacao_medio: Number(tempoMedioResposta.toFixed(2)),
                    taxa_acerto: Number(taxaAcerto.toFixed(2)),
                    total_sequencias: tentativasTotal,
                    span_maximo: spanMaximo, // AGORA FUNCIONA!
                    observacoes: JSON.stringify({
                        sequencia_temporal: sequenciaTemporal,
                        tempos_resposta: temposResposta,
                        acertos_total: acertos,
                        erros_total: erros
                    })
                }]);

            if (error) {
                console.error('Erro ao salvar:', error);
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!
                
📊 Resumo da Sessão:
- Pontuação: ${pontuacao}
- Taxa de acerto: ${taxaAcerto.toFixed(1)}%
- Span máximo: ${spanMaximo} símbolos
- Tempo médio: ${tempoMedioResposta.toFixed(1)}s
- Nível máximo: ${nivelMaximo}
- Total de sequências: ${tentativasTotal}`);
                
                router.push('/profileselection');
            }
        } catch (error: any) {
            console.error('Erro inesperado:', error);
            alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setSalvando(false);
        }
    };

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
                        <span className="text-sm sm:text-base">Voltar</span>
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
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-green-800">{acertos}</div>
                                <div className="text-xs text-green-600">Acertos Total</div>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-red-800">{erros}</div>
                                <div className="text-xs text-red-600">Erros Total</div>
                            </div>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-purple-800">{acertosNivel}/3</div>
                                <div className="text-xs text-purple-600">Acertos Nível</div>
                            </div>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-orange-800">{errosNivel}/3</div>
                                <div className="text-xs text-orange-600">Erros Nível</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Área Principal do Jogo */}
                {!jogoIniciado && !exercicioConcluido ? (
                    // Tela Inicial
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">🧠</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Memória Visual Sequencial
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Desenvolva sua memória de trabalho visual
                        </p>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                            <h3 className="font-semibold text-yellow-900 mb-2">
                                📊 Base Científica:
                            </h3>
                            <p className="text-sm text-yellow-800">
                                Exercício validado por estudos em neurociência cognitiva para 
                                melhorar a memória de trabalho visual, componente essencial 
                                no TDAH (Martinussen et al., 2005; Kofler et al., 2018).
                            </p>
                        </div>
                        
                        <button
                            onClick={iniciarExercicio}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors inline-flex items-center space-x-2"
                        >
                            <Brain size={24} />
                            <span>Iniciar Exercício</span>
                        </button>
                    </div>
                ) : exercicioConcluido ? (
                    // Tela de Resultado
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">
                            {calcularTaxaAcerto() >= 80 ? '🏆' : 
                             calcularTaxaAcerto() >= 60 ? '🎉' : 
                             calcularTaxaAcerto() >= 40 ? '💪' : '📈'}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            {calcularTaxaAcerto() >= 80 ? 'Excelente Desempenho!' : 
                             calcularTaxaAcerto() >= 60 ? 'Muito Bem!' : 
                             calcularTaxaAcerto() >= 40 ? 'Bom Progresso!' : 'Continue Praticando!'}
                        </h3>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-gray-800">{pontuacao}</div>
                                <div className="text-sm text-gray-600">Pontos Totais</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-gray-800">
                                    {calcularTaxaAcerto().toFixed(0)}%
                                </div>
                                <div className="text-sm text-gray-600">Taxa de Acerto</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-gray-800">{spanMaximo}</div>
                                <div className="text-sm text-gray-600">Span Máximo</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-gray-800">{nivelMaximo}</div>
                                <div className="text-sm text-gray-600">Nível Máximo</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-gray-800">
                                    {calcularTempoMedioResposta().toFixed(1)}s
                                </div>
                                <div className="text-sm text-gray-600">Tempo Médio</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-gray-800">{tentativasTotal}</div>
                                <div className="text-sm text-gray-600">Sequências</div>
                            </div>
                        </div>
                        
                        <button
                            onClick={reiniciar}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center space-x-2"
                        >
                            <RotateCcw size={20} />
                            <span>Jogar Novamente</span>
                        </button>
                    </div>
                ) : (
                    // Área do Jogo Ativa
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                Nível {nivel} - {niveis[nivel as keyof typeof niveis].nome}
                            </h2>
                            {mostrandoSequencia && (
                                <p className="text-green-600 font-medium animate-pulse">
                                    🧠 Memorize a sequência...
                                </p>
                            )}
                            {aguardandoResposta && !feedbackAtivo && (
                                <p className="text-blue-600 font-medium">
                                    👆 Clique na ordem correta
                                </p>
                            )}
                        </div>

                        {/* Área de Exibição da Sequência */}
                        {mostrandoSequencia && (
                            <div className="bg-gray-100 rounded-lg p-8 mb-6">
                                <div className="flex justify-center items-center space-x-4">
                                    {sequenciaAtual.map((simbolo, index) => (
                                        <div
                                            key={index}
                                            className="text-6xl animate-pulse"
                                            style={{
                                                animation: `fadeIn 0.3s ease-in-out ${index * 0.2}s`
                                            }}
                                        >
                                            {simbolo}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Área de Resposta */}
                        {aguardandoResposta && (
                            <div className="space-y-6">
                                {/* Sequência do Usuário */}
                                <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
                                    {sequenciaUsuario.length > 0 ? (
                                        <div className="flex space-x-3">
                                            {sequenciaUsuario.map((simbolo, index) => (
                                                <div key={index} className="text-5xl">
                                                    {simbolo}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">Sua resposta aparecerá aqui...</p>
                                    )}
                                </div>

                                {/* Grade de Símbolos para Clicar */}
                                <div className="grid grid-cols-5 gap-3 sm:gap-4">
                                    {simbolos.map((simbolo) => (
                                        <button
                                            key={simbolo}
                                            onClick={() => handleSimboloClick(simbolo)}
                                            disabled={feedbackAtivo !== null}
                                            className="aspect-square bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all text-4xl sm:text-5xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {simbolo}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Feedback Visual */}
                        {feedbackAtivo && (
                            <div className={`rounded-lg p-6 text-center ${
                                feedbackAtivo === 'acerto' 
                                    ? 'bg-green-100 border-2 border-green-500' 
                                    : 'bg-red-100 border-2 border-red-500'
                            }`}>
                                <div className="text-5xl mb-3">
                                    {feedbackAtivo === 'acerto' ? <Check className="w-16 h-16 mx-auto text-green-600" /> : <X className="w-16 h-16 mx-auto text-red-600" />}
                                </div>
                                <p className={`text-xl font-bold ${
                                    feedbackAtivo === 'acerto' ? 'text-green-800' : 'text-red-800'
                                }`}>
                                    {feedbackAtivo === 'acerto' ? 'Correto!' : 'Sequência Incorreta'}
                                </p>
                                {feedbackAtivo === 'erro' && simboloFeedback && (
                                    <p className="text-red-700 mt-3">
                                        Sequência correta: {simboloFeedback}
                                    </p>
                                )}
                                {feedbackAtivo === 'acerto' && (
                                    <p className="text-green-700 mt-2">
                                        +{nivel * 10} pontos
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* CSS para animações */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
