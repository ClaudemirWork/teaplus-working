'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

export default function SelectiveAttentionPage() {
    const router = useRouter();
    const supabase = createClient();
    const [salvando, setSalvando] = useState(false);
    
    // Estados do jogo
    const [nivel, setNivel] = useState(1);
    const [sequencia, setSequencia] = useState<string[]>([]);
    const [entrada, setEntrada] = useState('');
    const [mostrandoSequencia, setMostrandoSequencia] = useState(false);
    const [jogoIniciado, setJogoIniciado] = useState(false);
    const [resultadoAtual, setResultadoAtual] = useState<'acerto' | 'erro' | null>(null);
    const [pontuacao, setPontuacao] = useState(0);
    const [exercicioConcluido, setExercicioConcluido] = useState(false);
    
    // Métricas científicas
    const [inicioSessao] = useState(new Date());
    const [tempoReacao, setTempoReacao] = useState<number[]>([]);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);
    const [nivelMaximo, setNivelMaximo] = useState(1);
    const [sequenciaTemporal, setSequenciaTemporal] = useState<any[]>([]);
    const inicioApresentacao = useRef<Date | null>(null);

    const niveis = {
        1: { tamanho: 3, tempo: 3000, nome: "Iniciante (3 itens)" },
        2: { tamanho: 4, tempo: 4000, nome: "Básico (4 itens)" },
        3: { tamanho: 5, tempo: 5000, nome: "Intermediário (5 itens)" },
        4: { tamanho: 6, tempo: 6000, nome: "Avançado (6 itens)" },
        5: { tamanho: 7, tempo: 7000, nome: "Expert (7 itens)" }
    };

    const activityInfo = {
        title: 'Atenção Seletiva e Memória',
        objective: 'Desenvolver a capacidade de focar em informações relevantes, ignorando distrações, e melhorar a memória de trabalho.',
        levels: [
            'Nível 1: Memorize 3 itens em 3 segundos',
            'Nível 2: Memorize 4 itens em 4 segundos',
            'Nível 3: Memorize 5 itens em 5 segundos',
            'Nível 4: Memorize 6 itens em 6 segundos',
            'Nível 5: Memorize 7 itens em 7 segundos'
        ],
        howToPlay: [
            'Observe a sequência de letras e números apresentada',
            'Digite apenas os NÚMEROS em ordem',
            'Ignore as LETRAS (são distrações)',
            'Complete 3 sequências corretas para avançar de nível'
        ]
    };

    const gerarSequencia = () => {
        const config = niveis[nivel as keyof typeof niveis];
        const elementos: string[] = [];
        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numeros = '0123456789';
        
        // Garantir pelo menos 2 números
        const qtdNumeros = Math.max(2, Math.floor(config.tamanho * 0.4));
        const qtdLetras = config.tamanho - qtdNumeros;
        
        // Adicionar números
        for (let i = 0; i < qtdNumeros; i++) {
            elementos.push(numeros[Math.floor(Math.random() * numeros.length)]);
        }
        
        // Adicionar letras (distrações)
        for (let i = 0; i < qtdLetras; i++) {
            elementos.push(letras[Math.floor(Math.random() * letras.length)]);
        }
        
        // Embaralhar
        for (let i = elementos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [elementos[i], elementos[j]] = [elementos[j], elementos[i]];
        }
        
        return elementos;
    };

    const iniciarSequencia = () => {
        const novaSequencia = gerarSequencia();
        setSequencia(novaSequencia);
        setMostrandoSequencia(true);
        setEntrada('');
        setResultadoAtual(null);
        setJogoIniciado(true);
        inicioApresentacao.current = new Date();
        
        const config = niveis[nivel as keyof typeof niveis];
        setTimeout(() => {
            setMostrandoSequencia(false);
        }, config.tempo);
    };

    const verificarResposta = () => {
        if (!inicioApresentacao.current) return;
        
        const fimResposta = new Date();
        const tempo = (fimResposta.getTime() - inicioApresentacao.current.getTime()) / 1000;
        setTempoReacao(prev => [...prev, tempo]);
        
        const numerosCorretos = sequencia.filter(item => !isNaN(parseInt(item))).join('');
        const acertou = entrada === numerosCorretos;
        
        // Registrar na sequência temporal
        setSequenciaTemporal(prev => [...prev, {
            nivel,
            sequencia: sequencia.join(''),
            resposta: entrada,
            esperado: numerosCorretos,
            acertou,
            tempoReacao: tempo,
            timestamp: new Date()
        }]);
        
        if (acertou) {
            setResultadoAtual('acerto');
            setPontuacao(prev => prev + nivel * 10);
            setAcertos(prev => prev + 1);
            
            setTimeout(() => {
                if (acertos + 1 >= 3 && nivel < 5) {
                    proximoNivel();
                } else if (nivel === 5 && acertos + 1 >= 3) {
                    finalizarExercicio();
                } else {
                    iniciarSequencia();
                }
            }, 1500);
        } else {
            setResultadoAtual('erro');
            setErros(prev => prev + 1);
            
            setTimeout(() => {
                if (erros + 1 >= 3) {
                    finalizarExercicio();
                } else {
                    iniciarSequencia();
                }
            }, 2000);
        }
    };

    const proximoNivel = () => {
        if (nivel < 5) {
            setNivel(prev => prev + 1);
            setNivelMaximo(prev => Math.max(prev, nivel + 1));
            setAcertos(0);
            setErros(0);
            setResultadoAtual(null);
            setJogoIniciado(false);
        }
    };

    const finalizarExercicio = () => {
        setExercicioConcluido(true);
        setJogoIniciado(false);
    };

    const voltarInicio = () => {
        setJogoIniciado(false);
        setExercicioConcluido(false);
        setResultadoAtual(null);
        setEntrada('');
        setSequencia([]);
        setAcertos(0);
        setErros(0);
    };

    const calcularTempoMedio = () => {
        if (tempoReacao.length === 0) return 0;
        return tempoReacao.reduce((a, b) => a + b, 0) / tempoReacao.length;
    };

    const handleSaveSession = async () => {
        if (sequenciaTemporal.length === 0) {
            alert('Nenhuma atividade foi registrada para salvar.');
            return;
        }
        
        setSalvando(true);
        
        const fimSessao = new Date();
        const duracaoSegundos = Math.round((fimSessao.getTime() - inicioSessao.getTime()) / 1000);
        const tempoMedio = calcularTempoMedio();
        const taxaAcerto = sequenciaTemporal.length > 0 
            ? (sequenciaTemporal.filter(s => s.acertou).length / sequenciaTemporal.length) * 100 
            : 0;
        
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
                    atividade_nome: 'Atencao_Seletiva',
                    pontuacao_final: pontuacao,
                    tempo_total: duracaoSegundos,
                    data_fim: fimSessao.toISOString(),
                    duracao_segundos: duracaoSegundos,
                    nivel_maximo_atingido: nivelMaximo,
                    tempo_reacao_medio: Number(tempoMedio.toFixed(2)),
                    taxa_acerto: Number(taxaAcerto.toFixed(2)),
                    total_sequencias: sequenciaTemporal.length,
                    observacoes: JSON.stringify({
                        sequencia_temporal: sequenciaTemporal,
                        tempos_reacao: tempoReacao
                    })
                }]);

            if (error) {
                console.error('Erro ao salvar:', error);
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!
                
📊 Resumo:
- Pontuação: ${pontuacao}
- Taxa de acerto: ${taxaAcerto.toFixed(1)}%
- Tempo médio: ${tempoMedio.toFixed(1)}s
- Nível máximo: ${nivelMaximo}`);
                
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
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="p-3 sm:p-4 flex items-center justify-between">
                    <Link
                        href="/tdah"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ChevronLeft size={20} />
                        <span>Voltar para TDAH</span>
                    </Link>
                    <button 
                        onClick={handleSaveSession}
                        disabled={salvando}
                        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:bg-green-400"
                    >
                        <Save size={20} />
                        <span>{salvando ? 'Salvando...' : 'Finalizar e Salvar'}</span>
                    </button>
                </div>
            </header>

            <main className="p-4 sm:p-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{activityInfo.title}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                            <p className="text-sm text-gray-600">{activityInfo.objective}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600">
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

                {!jogoIniciado && !exercicioConcluido ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">🧠</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Atenção Seletiva</h2>
                        <p className="text-gray-600 mb-6">Nível {nivel}: {niveis[nivel as keyof typeof niveis].nome}</p>
                        <button
                            onClick={iniciarSequencia}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                        >
                            🚀 Iniciar Exercício
                        </button>
                    </div>
                ) : exercicioConcluido ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Exercício Concluído!</h3>
                        <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-lg font-bold text-gray-800">{pontuacao}</div>
                                <div className="text-sm text-gray-600">Pontos</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-lg font-bold text-gray-800">Nível {nivelMaximo}</div>
                                <div className="text-sm text-gray-600">Máximo</div>
                            </div>
                        </div>
                        <button
                            onClick={voltarInicio}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            🔄 Jogar Novamente
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Nível {nivel}</h3>
                                <div className="flex gap-4">
                                    <span className="text-green-600">✓ {acertos}</span>
                                    <span className="text-red-600">✗ {erros}</span>
                                </div>
                            </div>

                            {mostrandoSequencia ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl font-mono font-bold tracking-wider mb-4">
                                        {sequencia.map((item, index) => (
                                            <span
                                                key={index}
                                                className={`mx-2 ${isNaN(parseInt(item)) ? 'text-gray-400' : 'text-blue-600'}`}
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600">Memorize os NÚMEROS!</p>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <input
                                        type="text"
                                        value={entrada}
                                        onChange={(e) => setEntrada(e.target.value)}
                                        className="text-3xl font-mono text-center border-2 border-gray-300 rounded-lg px-4 py-2 mb-4 w-full max-w-xs"
                                        placeholder="Digite os números"
                                        autoFocus
                                    />
                                    <div>
                                        <button
                                            onClick={verificarResposta}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                                        >
                                            Verificar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {resultadoAtual && (
                                <div className={`mt-4 p-4 rounded-lg text-center ${
                                    resultadoAtual === 'acerto' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {resultadoAtual === 'acerto' ? (
                                        <div className="flex items-center justify-center">
                                            <CheckCircle className="mr-2" />
                                            <span>Correto! +{nivel * 10} pontos</span>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center justify-center mb-2">
                                                <AlertCircle className="mr-2" />
                                                <span>Incorreto!</span>
                                            </div>
                                            <div className="text-sm">
                                                Resposta correta: {sequencia.filter(item => !isNaN(parseInt(item))).join('')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
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
                )}
            </main>
        </div>
    );
}
