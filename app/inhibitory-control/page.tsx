'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Trophy, RotateCcw, Zap, CheckCircle, XCircle, ArrowRightCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

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

// --- PÁGINA DA NOVA ATIVIDADE ---
export default function AttentionRoulettePage() {
    const router = useRouter();
    const supabase = createClient();

    type GameState = 'initial' | 'awaiting_spin' | 'spinning' | 'decision' | 'feedback' | 'finished';

    const [gameState, setGameState] = useState<GameState>('initial');
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(1);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    
    const [targetColor, setTargetColor] = useState('VERMELHO');
    const [rouletteResult, setRouletteResult] = useState('');
    const [rotation, setRotation] = useState(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    // ESTADO FALTANDO (CORRIGIDO)
    const [salvando, setSalvando] = useState(false);

    // Métricas
    const [goReactionTimes, setGoReactionTimes] = useState<number[]>([]);
    const [goOpportunities, setGoOpportunities] = useState(0);
    const [stopErrors, setStopErrors] = useState(0);
    const [stopOpportunities, setStopOpportunities] = useState(0);
    const [missedGo, setMissedGo] = useState(0);

    const decisionTimerRef = useRef<NodeJS.Timeout | null>(null);
    const reactionStartRef = useRef<number>(0);

    const niveis = [
        { id: 1, nome: "Nível 1", dificuldade: "4 Cores", options: ['VERMELHO', 'VERDE', 'AZUL', 'AMARELO'], spinDuration: 2000, decisionTime: 4000, icone: "🎨" },
        { id: 2, nome: "Nível 2", dificuldade: "6 Cores", options: ['VERMELHO', 'VERDE', 'AZUL', 'AMARELO', 'ROXO', 'LARANJA'], spinDuration: 1800, decisionTime: 3000, icone: "🖌️" },
        { id: 3, nome: "Nível 3", dificuldade: "8 Cores", options: ['VERMELHO', 'VERDE', 'AZUL', 'AMARELO', 'ROXO', 'LARANJA', 'PRETO', 'BRANCO'], spinDuration: 1500, decisionTime: 2500, icone: "🖼️" },
    ];
    
    const colorsMap: { [key: string]: { bg: string, text: string } } = {
        'VERMELHO': { bg: '#ef4444', text: '#ffffff' }, 'VERDE': { bg: '#22c55e', text: '#ffffff' }, 
        'AZUL': { bg: '#3b82f6', text: '#ffffff' }, 'AMARELO': { bg: '#f59e0b', text: '#ffffff' },
        'ROXO': { bg: '#8b5cf6', text: '#ffffff' }, 'LARANJA': { bg: '#f97316', text: '#ffffff' }, 
        'PRETO': { bg: '#1f2937', text: '#ffffff' }, 'BRANCO': { bg: '#f9fafb', text: '#000000' }
    };
    
    const currentConfig = niveis.find(n => n.id === currentLevel) || niveis[0];

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (gameState !== 'initial' && gameState !== 'finished' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setGameState('finished');
        }
        return () => { if (timer) clearTimeout(timer); };
    }, [gameState, timeLeft]);


    const startNewRound = () => {
        const newTarget = currentConfig.options[Math.floor(Math.random() * currentConfig.options.length)];
        setTargetColor(newTarget);
        setGameState('awaiting_spin');
    };

    const handleSpin = () => {
        if (gameState !== 'awaiting_spin') return;
        
        setGameState('spinning');
        const resultIndex = Math.floor(Math.random() * currentConfig.options.length);
        const resultColor = currentConfig.options[resultIndex];
        
        const baseRotation = 360 * 5;
        const sliceAngle = 360 / currentConfig.options.length;
        const resultAngle = (resultIndex * sliceAngle) + (sliceAngle / 2);
        const finalRotation = baseRotation + (360 - resultAngle);

        setRotation(finalRotation);

        setTimeout(() => {
            setRouletteResult(resultColor);
            setGameState('decision');
            reactionStartRef.current = performance.now();

            if (resultColor === targetColor) {
                setGoOpportunities(prev => prev + 1);
            } else {
                setStopOpportunities(prev => prev + 1);
            }

            decisionTimerRef.current = setTimeout(() => {
                if (resultColor !== targetColor) {
                    setIsCorrect(true);
                } else {
                    setIsCorrect(false);
                    setMissedGo(prev => prev + 1);
                }
                setGameState('feedback');
                setTimeout(startNewRound, 1500);
            }, currentConfig.decisionTime);

        }, currentConfig.spinDuration);
    };

    const handleActionClick = () => {
        if (gameState !== 'decision' || !rouletteResult) return;
        if (decisionTimerRef.current) clearTimeout(decisionTimerRef.current);

        const reactionTime = performance.now() - reactionStartRef.current;
        const wasCorrectClick = rouletteResult === targetColor;

        if (wasCorrectClick) {
            setGoReactionTimes(prev => [...prev, reactionTime]);
            setScore(prev => prev + 100);
            setIsCorrect(true);
        } else {
            setStopErrors(prev => prev + 1);
            setIsCorrect(false);
        }

        setGameState('feedback');
        setTimeout(startNewRound, 1500);
    };

    const startGame = () => {
        if (nivelSelecionado === null) return;
        setCurrentLevel(nivelSelecionado);
        setTimeLeft(120);
        setScore(0);
        setGoReactionTimes([]);
        setGoOpportunities(0);
        setStopErrors(0);
        setStopOpportunities(0);
        setMissedGo(0);
        startNewRound();
    };

    const resetGame = () => setGameState('initial');

    // FUNÇÃO PARA SALVAR SESSÃO (ADICIONADA)
    const handleSaveSession = async () => {
        setSalvando(true);
        // Lógica para salvar os dados da sessão no Supabase...
        console.log("Salvando sessão...");
        // Após salvar:
        router.push('/dashboard');
    };

    const calculateMetrics = () => {
        const avgRT = goReactionTimes.length > 0 ? goReactionTimes.reduce((a, b) => a + b, 0) / goReactionTimes.length : 0;
        const goAccuracy = goOpportunities > 0 ? ((goOpportunities - missedGo) / goOpportunities) * 100 : 0;
        const stopAccuracy = stopOpportunities > 0 ? ((stopOpportunities - stopErrors) / stopOpportunities) * 100 : 0;
        return { avgRT, goAccuracy, stopAccuracy };
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Roleta da Atenção"
                icon={<Zap size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={gameState === 'finished'}
            />
            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {gameState === 'initial' && (
                     <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🎯 Objetivo:</h3>
                                    <p className="text-sm text-gray-600">
                                        Treinar a atenção seletiva e o controle inibitório, focando em um alvo específico enquanto ignora estímulos distratores apresentados de forma dinâmica.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Observe a cor alvo indicada na tela.</li>
                                        <li>Clique em "Girar" para rodar a roleta.</li>
                                        <li>Se a roleta parar na cor alvo, clique no botão de ação.</li>
                                        <li>Se parar em outra cor, **não clique** e aguarde a próxima rodada.</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                        Sua performance é medida pela velocidade dos acertos (clicar no alvo) e pela sua capacidade de não clicar nos distratores (controle de impulso).
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível de Dificuldade</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {niveis.map((nivel) => (
                                    <button
                                        key={nivel.id}
                                        onClick={() => setNivelSelecionado(nivel.id)}
                                        className={`p-4 rounded-lg font-medium transition-colors ${nivelSelecionado === nivel.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                    >
                                        <div className="text-2xl mb-1">{nivel.icone}</div>
                                        <div className="text-sm">{nivel.nome}</div>
                                        <div className="text-xs opacity-80">{nivel.dificuldade}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-center pt-4">
                            <button onClick={startGame} disabled={nivelSelecionado === null} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                                🚀 Iniciar Atividade
                            </button>
                        </div>
                    </div>
                )}
                
                {(gameState !== 'initial' && gameState !== 'finished') && (
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <span className="bg-purple-100 text-purple-800 font-medium px-4 py-2 rounded-lg">Nível {currentLevel}</span>
                            <span className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">Pontos: {score}</span>
                            <span className="bg-red-100 text-red-800 font-medium px-4 py-2 rounded-lg">Tempo: {timeLeft}s</span>
                        </div>

                        <h2 className="text-2xl font-bold mb-4">A Tarefa: Clique se a roleta parar em <span className="p-1 rounded" style={{ backgroundColor: colorsMap[targetColor]?.bg, color: colorsMap[targetColor]?.text }}>{targetColor}</span></h2>
                        
                        <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto my-8">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-5xl text-gray-700">▼</div>
                            <div 
                                className="w-full h-full rounded-full border-8 border-white shadow-xl overflow-hidden"
                                style={{
                                    transition: `transform ${currentConfig.spinDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
                                    transform: `rotate(${rotation}deg)`
                                }}
                            >
                                {currentConfig.options.map((color) => {
                                    return (
                                        <div key={color} className="absolute w-full h-full" style={{transform: `rotate(${360 / currentConfig.options.length * currentConfig.options.indexOf(color)}deg)`}}>
                                            <div style={{
                                                background: colorsMap[color].bg,
                                                color: colorsMap[color].text,
                                                clipPath: `polygon(50% 50%, 100% 0, 100% 100%)` // Cria um triângulo
                                            }} className="w-1/2 h-1/2 absolute top-0 left-1/2 origin-bottom-left flex items-center justify-center">
                                                <span style={{transform: `rotate(${(360 / currentConfig.options.length / 2) - 90}deg) translate(40px)`}} className="text-sm font-bold">{color}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="h-20 flex items-center justify-center">
                            {gameState === 'awaiting_spin' && <button onClick={handleSpin} className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-xl">Girar</button>}
                            {gameState === 'spinning' && <p className="text-xl animate-pulse text-gray-500">Girando...</p>}
                            {gameState === 'decision' && <button onClick={handleActionClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-xl animate-bounce">É esta!</button>}
                            {gameState === 'feedback' && ( isCorrect ? <CheckCircle size={48} className="text-green-500 mx-auto" /> : <XCircle size={48} className="text-red-500 mx-auto" />)}
                        </div>
                    </div>
                )}

                {gameState === 'finished' && (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
                        <Trophy className="mx-auto text-yellow-500 mb-4" size={48}/>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Sessão Concluída!</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                            <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{score}</div><div className="text-sm">Pontos</div></div>
                            <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{calculateMetrics().avgRT.toFixed(0)}ms</div><div className="text-sm">RT Médio (Go)</div></div>
                            <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{calculateMetrics().goAccuracy.toFixed(0)}%</div><div className="text-sm">Precisão (Go)</div></div>
                            <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{calculateMetrics().stopAccuracy.toFixed(0)}%</div><div className="text-sm">Precisão (Stop)</div></div>
                            <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{stopErrors}</div><div className="text-sm">Erros de Impulso</div></div>
                            <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{missedGo}</div><div className="text-sm">Omissões (Go)</div></div>
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
