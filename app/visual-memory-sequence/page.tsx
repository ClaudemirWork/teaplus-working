'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Brain, Check, X, RotateCcw, ListOrdered, Trophy } from 'lucide-react';
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
export default function VisualMemorySequencePage() {
    const router = useRouter();
    const supabase = createClient();
    
    // Estados refatorados
    const [gameState, setGameState] = useState<'initial' | 'showing_pattern' | 'waiting_input' | 'feedback' | 'finished'>('initial');
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(1);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [sequenciaAtual, setSequenciaAtual] = useState<string[]>([]);
    const [sequenciaUsuario, setSequenciaUsuario] = useState<string[]>([]);
    const [salvando, setSalvando] = useState(false);
    
    const [pontuacao, setPontuacao] = useState(0);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);
    const [acertosNivel, setAcertosNivel] = useState(0);
    const [errosNivel, setErrosNivel] = useState(0);
    const [spanMaximo, setSpanMaximo] = useState(0);
    
    const [feedbackType, setFeedbackType] = useState<'acerto' | 'erro' | null>(null);
    const inicioResposta = useRef<Date | null>(null);

    const niveis = [
        { id: 1, tamanho: 3, tempo: 2000, nome: "Nível 1", dificuldade: "3 símbolos", icone: "🥉" },
        { id: 2, tamanho: 4, tempo: 3000, nome: "Nível 2", dificuldade: "4 símbolos", icone: "🥈" },
        { id: 3, tamanho: 5, tempo: 4000, nome: "Nível 3", dificuldade: "5 símbolos", icone: "🥇" },
        { id: 4, tamanho: 6, tempo: 5000, nome: "Nível 4", dificuldade: "6 símbolos", icone: "🏆" },
        { id: 5, tamanho: 7, tempo: 6000, nome: "Nível 5", dificuldade: "7 símbolos", icone: "💎" },
    ];

    const simbolos = ['🔵', '🔴', '🟢', '🟡', '🟣', '🟠', '⬜', '⬛', '🔺', '💎'];

    const gerarSequencia = (level: number) => {
        const config = niveis.find(n => n.id === level) || niveis[0];
        const novaSequencia: string[] = [];
        const simbolosDisponiveis = [...simbolos];
        for (let i = 0; i < config.tamanho; i++) {
            const indice = Math.floor(Math.random() * simbolosDisponiveis.length);
            novaSequencia.push(simbolosDisponiveis.splice(indice, 1)[0]);
        }
        return novaSequencia;
    };

    const iniciarRodada = (level = currentLevel) => {
        const novaSequencia = gerarSequencia(level);
        setSequenciaAtual(novaSequencia);
        setSequenciaUsuario([]);
        setGameState('showing_pattern');
        setFeedbackType(null);
        
        const config = niveis.find(n => n.id === level) || niveis[0];
        setTimeout(() => {
            setGameState('waiting_input');
            inicioResposta.current = new Date();
        }, config.tempo);
    };

    const processarResultado = (correto: boolean) => {
        setGameState('feedback');

        if (correto) {
            setAcertos(prev => prev + 1);
            setAcertosNivel(prev => prev + 1);
            setPontuacao(prev => prev + (currentLevel * 10));
            setSpanMaximo(prev => Math.max(prev, sequenciaAtual.length));
            setFeedbackType('acerto');
        } else {
            setErros(prev => prev + 1);
            setErrosNivel(prev => prev + 1);
            setFeedbackType('erro');
        }

        setTimeout(() => {
            const errosAtualizados = errosNivel + (correto ? 0 : 1);
            const acertosAtualizados = acertosNivel + (correto ? 1 : 0);

            if (errosAtualizados >= 3) {
                setGameState('finished');
            } else if (acertosAtualizados >= 3 && currentLevel < niveis.length) {
                const novoNivel = currentLevel + 1;
                setCurrentLevel(novoNivel);
                setAcertosNivel(0);
                setErrosNivel(0);
                iniciarRodada(novoNivel);
            } else if (acertosAtualizados >= 3 && currentLevel === niveis.length) {
                setGameState('finished');
            } else {
                iniciarRodada();
            }
        }, 1500);
    };

    const handleSimboloClick = (simbolo: string) => {
        if (gameState !== 'waiting_input') return;
        const novaSequenciaUsuario = [...sequenciaUsuario, simbolo];
        setSequenciaUsuario(novaSequenciaUsuario);

        const posicao = novaSequenciaUsuario.length - 1;
        if (simbolo !== sequenciaAtual[posicao]) {
            processarResultado(false);
        } else if (novaSequenciaUsuario.length === sequenciaAtual.length) {
            processarResultado(true);
        }
    };
    
    const startGame = () => {
        if (nivelSelecionado === null) return;
        setCurrentLevel(nivelSelecionado);
        setPontuacao(0);
        setAcertos(0);
        setErros(0);
        setAcertosNivel(0);
        setErrosNivel(0);
        setSpanMaximo(0);
        iniciarRodada(nivelSelecionado);
    };

    const resetGame = () => {
        setGameState('initial');
        setNivelSelecionado(1);
    };

    const handleSaveSession = async () => {
        setSalvando(true);
        // ... (lógica de salvar no Supabase)
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Memória Visual Sequencial"
                icon={<ListOrdered size={22} />}
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
                                       Testar e expandir a capacidade da memória visual de curto prazo (span de memória), recordando sequências de símbolos na ordem exata.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Observe a sequência de símbolos que aparece na tela.</li>
                                        <li>Quando ela desaparecer, clique nos símbolos na mesma ordem.</li>
                                        <li>Acerte 3 vezes para avançar de nível.</li>
                                        <li>O jogo termina após 3 erros no mesmo nível.</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                       Sua pontuação aumenta a cada acerto. O "Span Máximo" registra a maior sequência que você conseguiu memorizar corretamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Bloco 2: Seleção de Nível */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Tamanho Inicial da Sequência</h2>
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

                        {/* Bloco 3: Botão Iniciar */}
                        <div className="text-center pt-4">
                            <button
                                onClick={startGame}
                                disabled={nivelSelecionado === null}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                🚀 Iniciar Atividade
                            </button>
                        </div>
                    </div>
                )}

                {(gameState !== 'initial' && gameState !== 'finished') && (
                     <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
                         <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold">Nível {currentLevel}</h2>
                             <div className="text-right">
                                 <p className="font-bold text-xl">{pontuacao} <span className="text-sm font-normal">pontos</span></p>
                                 <p className="text-sm text-gray-600">Acertos no nível: {acertosNivel}/3</p>
                                 <p className="text-sm text-gray-600">Erros no nível: {errosNivel}/3</p>
                             </div>
                         </div>
                         <div className="bg-gray-100 rounded-lg p-6 mb-6 min-h-[120px] flex items-center justify-center">
                             {gameState === 'showing_pattern' && (
                                 <div className="flex justify-center items-center space-x-4">
                                     {sequenciaAtual.map((simbolo, index) => (
                                         <div key={index} className="text-6xl animate-pulse">{simbolo}</div>
                                     ))}
                                 </div>
                             )}
                             {gameState === 'waiting_input' && (
                                 <div className="w-full">
                                     <div className="h-16 flex items-center justify-center border-b-2 mb-4">
                                         {sequenciaUsuario.map((s, i) => <span key={i} className="text-5xl mx-2">{s}</span>)}
                                     </div>
                                     <p className="text-center text-gray-500">Clique nos símbolos na ordem correta.</p>
                                 </div>
                             )}
                             {gameState === 'feedback' && feedbackType && (
                                 <div className={`text-5xl ${feedbackType === 'acerto' ? 'text-green-500' : 'text-red-500'}`}>
                                     {feedbackType === 'acerto' ? <Check size={80} /> : <X size={80} />}
                                 </div>
                             )}
                         </div>
                         <div className="grid grid-cols-5 gap-3">
                             {simbolos.map(simbolo => (
                                 <button
                                     key={simbolo}
                                     onClick={() => handleSimboloClick(simbolo)}
                                     disabled={gameState !== 'waiting_input'}
                                     className="aspect-square bg-white border-2 border-gray-300 rounded-lg text-4xl flex items-center justify-center transition hover:bg-gray-200 disabled:opacity-50"
                                 >
                                     {simbolo}
                                 </button>
                             ))}
                         </div>
                     </div>
                )}
                
                {gameState === 'finished' && (
                     <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
                         <Trophy className="mx-auto text-yellow-500 mb-4" size={48}/>
                         <h2 className="text-3xl font-bold text-gray-800 mb-6">Exercício Concluído!</h2>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                             <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{pontuacao}</div><div className="text-sm">Pontos</div></div>
                             <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{Math.round((acertos / (acertos + erros)) * 100 || 0)}%</div><div className="text-sm">Precisão</div></div>
                             <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{spanMaximo}</div><div className="text-sm">Span Máximo</div></div>
                             <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{currentLevel}</div><div className="text-sm">Nível Final</div></div>
                         </div>
                         <button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto">
                            <RotateCcw size={20}/>
                            Jogar Novamente
                         </button>
                     </div>
                )}
            </main>
        </div>
    );
}
