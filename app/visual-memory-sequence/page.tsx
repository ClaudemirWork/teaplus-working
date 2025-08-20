'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Brain, Check, X, RotateCcw, ListOrdered } from 'lucide-react';
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


export default function VisualMemorySequencePage() {
    const router = useRouter();
    const supabase = createClient();
    
    const [nivel, setNivel] = useState(1);
    const [sequenciaAtual, setSequenciaAtual] = useState<string[]>([]);
    const [sequenciaUsuario, setSequenciaUsuario] = useState<string[]>([]);
    const [mostrandoSequencia, setMostrandoSequencia] = useState(false);
    const [aguardandoResposta, setAguardandoResposta] = useState(false);
    const [jogoIniciado, setJogoIniciado] = useState(false);
    const [exercicioConcluido, setExercicioConcluido] = useState(false);
    const [salvando, setSalvando] = useState(false);
    
    const [pontuacao, setPontuacao] = useState(0);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);
    const [acertosNivel, setAcertosNivel] = useState(0);
    const [errosNivel, setErrosNivel] = useState(0);
    const [tentativasTotal, setTentativasTotal] = useState(0);
    
    const [inicioSessao] = useState(new Date());
    const [temposResposta, setTemposResposta] = useState<number[]>([]);
    const [nivelMaximo, setNivelMaximo] = useState(1);
    const [spanMaximo, setSpanMaximo] = useState(0);
    const inicioResposta = useRef<Date | null>(null);
    
    const [feedbackAtivo, setFeedbackAtivo] = useState<'acerto' | 'erro' | null>(null);

    const niveis = {
        1: { tamanho: 3, tempo: 2000, nome: "Iniciante (3 símbolos)" },
        2: { tamanho: 4, tempo: 3000, nome: "Básico (4 símbolos)" },
        3: { tamanho: 5, tempo: 4000, nome: "Intermediário (5 símbolos)" },
        4: { tamanho: 6, tempo: 5000, nome: "Avançado (6 símbolos)" },
        5: { tamanho: 7, tempo: 6000, nome: "Expert (7 símbolos)" }
    };

    const simbolos = ['🔵', '🔴', '🟢', '🟡', '🟣', '🟠', '⬜', '⬛', '🔺', '💎'];

    const gerarSequencia = (level: number) => {
        const config = niveis[level as keyof typeof niveis];
        const novaSequencia: string[] = [];
        const simbolosDisponiveis = [...simbolos];
        for (let i = 0; i < config.tamanho; i++) {
            const indice = Math.floor(Math.random() * simbolosDisponiveis.length);
            novaSequencia.push(simbolosDisponiveis.splice(indice, 1)[0]);
        }
        return novaSequencia;
    };

    const iniciarRodada = () => {
        const novaSequencia = gerarSequencia(nivel);
        setSequenciaAtual(novaSequencia);
        setSequenciaUsuario([]);
        setMostrandoSequencia(true);
        setAguardandoResposta(false);
        setFeedbackAtivo(null);
        
        const config = niveis[nivel as keyof typeof niveis];
        setTimeout(() => {
            setMostrandoSequencia(false);
            setAguardandoResposta(true);
            inicioResposta.current = new Date();
        }, config.tempo);
    };

    const processarResultado = (correto: boolean) => {
        if (!inicioResposta.current) return;
        const tempoResposta = (new Date().getTime() - inicioResposta.current.getTime());
        setTemposResposta(prev => [...prev, tempoResposta]);
        setTentativasTotal(prev => prev + 1);
        setAguardandoResposta(false);

        if (correto) {
            setAcertos(prev => prev + 1);
            setAcertosNivel(prev => prev + 1);
            setPontuacao(prev => prev + (nivel * 10));
            setSpanMaximo(prev => Math.max(prev, sequenciaAtual.length));
            setFeedbackAtivo('acerto');
        } else {
            setErros(prev => prev + 1);
            setErrosNivel(prev => prev + 1);
            setFeedbackAtivo('erro');
        }

        setTimeout(() => {
            if (errosNivel + (correto ? 0 : 1) >= 3) {
                finalizarExercicio();
            } else if (acertosNivel + (correto ? 1 : 0) >= 3 && nivel < 5) {
                avancarNivel();
            } else if (nivel === 5 && acertosNivel + (correto ? 1 : 0) >= 3) {
                finalizarExercicio();
            } else {
                iniciarRodada();
            }
        }, 2000);
    };

    const handleSimboloClick = (simbolo: string) => {
        if (!aguardandoResposta) return;
        const novaSequenciaUsuario = [...sequenciaUsuario, simbolo];
        setSequenciaUsuario(novaSequenciaUsuario);

        const posicao = novaSequenciaUsuario.length - 1;
        if (simbolo !== sequenciaAtual[posicao]) {
            processarResultado(false);
        } else if (novaSequenciaUsuario.length === sequenciaAtual.length) {
            processarResultado(true);
        }
    };

    const avancarNivel = () => {
        const novoNivel = nivel + 1;
        setNivel(novoNivel);
        setNivelMaximo(Math.max(nivelMaximo, novoNivel));
        setAcertosNivel(0);
        setErrosNivel(0);
        iniciarRodada();
    };
    
    const iniciarExercicio = () => {
        setNivel(1);
        setPontuacao(0);
        setAcertos(0);
        setErros(0);
        setAcertosNivel(0);
        setErrosNivel(0);
        setTentativasTotal(0);
        setTemposResposta([]);
        setSpanMaximo(0);
        setNivelMaximo(1);
        setJogoIniciado(true);
        setExercicioConcluido(false);
        iniciarRodada();
    };

    const finalizarExercicio = () => {
        setJogoIniciado(false);
        setExercicioConcluido(true);
    };

    const reiniciar = () => {
        setJogoIniciado(false);
        setExercicioConcluido(false);
        setNivel(1);
    };

    const calcularTaxaAcerto = () => tentativasTotal > 0 ? (acertos / tentativasTotal) * 100 : 0;

    const handleSaveSession = async () => {
        if (tentativasTotal === 0) return;
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
                atividade_nome: 'Memória Visual Sequencial',
                pontuacao_final: pontuacao,
                data_fim: fimSessao.toISOString(),
                nivel_maximo_atingido: nivelMaximo,
                tempo_reacao_medio: Math.round(tempoMedioResposta),
                taxa_acerto: Math.round(calcularTaxaAcerto()),
                observacoes: { span_maximo: spanMaximo }
            }]);
            if (error) {
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!\nSpan máximo: ${spanMaximo} símbolos.`);
                router.push('/dashboard');
            }
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Memória Visual Sequencial"
                icon={<ListOrdered size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={exercicioConcluido}
            />

            <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
                {!jogoIniciado && !exercicioConcluido ? (
                    <div className="space-y-6">
                         <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">Memória Visual Sequencial</h1>
                            <p className="text-gray-600 mb-6">Observe a sequência de símbolos e reproduza na ordem correta.</p>
                            <button onClick={iniciarExercicio} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                                Iniciar Exercício
                            </button>
                        </div>
                    </div>
                ) : exercicioConcluido ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Exercício Concluído!</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                            <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{pontuacao}</div><div className="text-sm">Pontos</div></div>
                            <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{calcularTaxaAcerto().toFixed(0)}%</div><div className="text-sm">Precisão</div></div>
                            <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{spanMaximo}</div><div className="text-sm">Span Máximo</div></div>
                            <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{nivelMaximo}</div><div className="text-sm">Nível Máximo</div></div>
                        </div>
                        <button onClick={reiniciar} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                            Jogar Novamente
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Nível {nivel}</h2>
                            <div className="text-right">
                                <p className="font-bold text-xl">{pontuacao} <span className="text-sm font-normal">pontos</span></p>
                                <p className="text-sm text-gray-600">Acertos no nível: {acertosNivel}/3</p>
                                <p className="text-sm text-gray-600">Erros no nível: {errosNivel}/3</p>
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-6 mb-6 min-h-[120px] flex items-center justify-center">
                            {mostrandoSequencia && (
                                <div className="flex justify-center items-center space-x-4">
                                    {sequenciaAtual.map((simbolo, index) => (
                                        <div key={index} className="text-6xl animate-pulse">{simbolo}</div>
                                    ))}
                                </div>
                            )}
                            {aguardandoResposta && (
                                <div className="w-full">
                                    <div className="h-16 flex items-center justify-center border-b-2 mb-4">
                                        {sequenciaUsuario.map((s, i) => <span key={i} className="text-5xl mx-2">{s}</span>)}
                                    </div>
                                    <p className="text-center text-gray-500">Clique nos símbolos abaixo na ordem correta.</p>
                                </div>
                            )}
                            {feedbackAtivo && (
                                <div className={`text-5xl ${feedbackAtivo === 'acerto' ? 'text-green-500' : 'text-red-500'}`}>
                                    {feedbackAtivo === 'acerto' ? <Check size={80} /> : <X size={80} />}
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {simbolos.map(simbolo => (
                                <button
                                    key={simbolo}
                                    onClick={() => handleSimboloClick(simbolo)}
                                    disabled={!aguardandoResposta}
                                    className="aspect-square bg-white border-2 border-gray-300 rounded-lg text-4xl flex items-center justify-center transition hover:bg-gray-200 disabled:opacity-50"
                                >
                                    {simbolo}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
