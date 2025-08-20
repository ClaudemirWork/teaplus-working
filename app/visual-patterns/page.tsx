'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Shapes, Trophy, RotateCcw, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
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
export default function VisualPatterns() {
    const router = useRouter();
    const supabase = createClient();

    // Estado de jogo aprimorado para incluir a transição de nível
    const [gameState, setGameState] = useState<'initial' | 'ready_for_round' | 'showing_pattern' | 'waiting_input' | 'feedback' | 'level_complete' | 'finished'>('initial');
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(1);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [pattern, setPattern] = useState<number[]>([]);
    const [userPattern, setUserPattern] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
    const [salvando, setSalvando] = useState(false);

    const niveis = [
        { id: 1, nome: "Nível 1", dificuldade: "Grade 3x3", gridSize: 3, patternLength: 3, time: 2000, target: 50, icone: "🟩" },
        { id: 2, nome: "Nível 2", dificuldade: "Grade 4x4", gridSize: 4, patternLength: 4, time: 2500, target: 50, icone: "🟪" },
        { id: 3, nome: "Nível 3", dificuldade: "Mais longo", gridSize: 4, patternLength: 6, time: 3000, target: 50, icone: "🟦" },
    ];

    const generatePattern = (level: number) => {
        const config = niveis.find(n => n.id === level) || niveis[0];
        const totalCells = config.gridSize * config.gridSize;
        const newPattern: number[] = [];
        while (newPattern.length < config.patternLength) {
            const randomCell = Math.floor(Math.random() * totalCells);
            if (!newPattern.includes(randomCell)) {
                newPattern.push(randomCell);
            }
        }
        setPattern(newPattern);
        setUserPattern([]);
    };

    const startRound = () => {
        generatePattern(currentLevel);
        setGameState('showing_pattern');
        setFeedback(null);
        const config = niveis.find(n => n.id === currentLevel) || niveis[0];
        setTimeout(() => {
            setGameState('waiting_input');
        }, config.time);
    };

    const handleCellClick = (cellIndex: number) => {
        if (gameState !== 'waiting_input') return;
        const newUserPattern = userPattern.includes(cellIndex)
            ? userPattern.filter(index => index !== cellIndex)
            : [...userPattern, cellIndex];
        setUserPattern(newUserPattern);
    };

    const checkAnswer = () => {
        const isCorrect = pattern.length === userPattern.length && pattern.every(cell => userPattern.includes(cell));
        setAttempts(prev => prev + 1);
        if (isCorrect) {
            setScore(prev => prev + 10);
            setFeedback({ correct: true, message: "Excelente! Padrão correto!" });
        } else {
            setFeedback({ correct: false, message: "Incorreto. Veja a correção." });
        }
        setGameState('feedback');
    };

    const nextStep = () => {
        const config = niveis.find(n => n.id === currentLevel) || niveis[0];
        // Verifica se atingiu a meta de pontos
        if (score >= config.target) {
            // Se não for o último nível, vai para a tela de nível completo
            if (currentLevel < niveis.length) {
                setGameState('level_complete');
            } else {
                // Se for o último nível, finaliza o jogo
                setGameState('finished');
            }
        } else {
            // Se não atingiu a meta, prepara para a próxima rodada no mesmo nível
            setGameState('ready_for_round');
        }
    };

    // Nova função para iniciar o próximo nível
    const startNextLevel = () => {
        const newLevel = currentLevel + 1;
        setCurrentLevel(newLevel);
        setScore(0);
        setAttempts(0);
        setGameState('ready_for_round');
    };

    const startGame = () => {
        if (nivelSelecionado === null) return;
        setCurrentLevel(nivelSelecionado);
        setScore(0);
        setAttempts(0);
        setFeedback(null);
        setGameState('ready_for_round');
    };

    const resetGame = () => {
        setGameState('initial');
        setNivelSelecionado(1);
    };

    const handleSaveSession = async () => {
        setSalvando(true);
        // ... Lógica de salvar no Supabase
        router.push('/dashboard');
    };

    const renderGrid = () => {
        const config = niveis.find(n => n.id === currentLevel) || niveis[0];
        const gridSize = config.gridSize;
        const cells = Array.from({ length: gridSize * gridSize }, (_, i) => i);

        return (
            <div className="grid gap-2 mx-auto" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, width: `${gridSize * 60}px` }}>
                {cells.map(cellIndex => {
                    const isPatternCell = pattern.includes(cellIndex);
                    const isSelectedByUser = userPattern.includes(cellIndex);
                    let cellClass = "w-14 h-14 rounded-lg border-2 transition-all duration-200 ";
                    
                    if (gameState === 'showing_pattern' && isPatternCell) cellClass += "bg-blue-500 border-blue-600";
                    else if (gameState === 'waiting_input' && isSelectedByUser) cellClass += "bg-green-400 border-green-500";
                    else if (gameState === 'feedback') {
                        if (isPatternCell && isSelectedByUser) cellClass += "bg-green-500 border-green-600";
                        else if (isPatternCell && !isSelectedByUser) cellClass += "bg-red-400 border-red-500 animate-pulse";
                        else if (!isPatternCell && isSelectedByUser) cellClass += "bg-yellow-400 border-yellow-500";
                        else cellClass += "bg-gray-200 border-gray-300";
                    } else cellClass += "bg-gray-200 border-gray-300 hover:bg-gray-300 cursor-pointer";
                    
                    return <div key={cellIndex} className={cellClass} onClick={() => handleCellClick(cellIndex)} />;
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Padrões Visuais"
                icon={<Shapes size={22} />}
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
                                        Fortalecer a memória visual de trabalho, reproduzindo padrões em uma grade após uma breve visualização.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Observe o padrão de quadrados que se acende.</li>
                                        <li>Quando o padrão desaparecer, clique nos quadrados para recriá-lo.</li>
                                        <li>Clique em "Verificar" para confirmar sua resposta.</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                        Você ganha pontos para cada padrão correto. Atingir a pontuação alvo avança para o próximo nível.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Bloco 2: Seleção de Nível */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível Inicial</h2>
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

                {gameState !== 'initial' && (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                             <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm font-medium text-gray-500">Nível</h3><p className="text-2xl font-bold text-blue-600">{currentLevel}</p></div>
                             <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm font-medium text-gray-500">Pontuação</h3><p className="text-2xl font-bold text-green-600">{score} / {niveis.find(n=>n.id === currentLevel)?.target}</p></div>
                             <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm font-medium text-gray-500">Tentativas</h3><p className="text-2xl font-bold text-purple-600">{attempts}</p></div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                            {gameState === 'finished' ? (
                                <div>
                                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-gray-800">Parabéns!</h2>
                                    <p className="text-gray-600 mt-2">Você completou todos os níveis com sucesso.</p>
                                    <button onClick={resetGame} className="mt-6 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center gap-2 mx-auto"><RotateCcw className="w-5 h-5" />Jogar Novamente</button>
                                </div>
                            ) : gameState === 'level_complete' ? ( // TELA DE TRANSIÇÃO
                                <div>
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-gray-800">Nível {currentLevel} Concluído!</h2>
                                    <p className="text-gray-600 mt-2">Você está indo muito bem. Prepare-se para o próximo desafio.</p>
                                    <button onClick={startNextLevel} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center gap-2 mx-auto"><ArrowRight className="w-5 h-5" />Próximo Nível</button>
                                </div>
                            ) : gameState === 'ready_for_round' ? (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Nível {currentLevel}: Pronto para começar?</h2>
                                    <p className="text-gray-600 mb-6">Um padrão de {niveis.find(n=>n.id === currentLevel)?.patternLength} células será exibido.</p>
                                    <button onClick={startRound} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-shadow">Iniciar Rodada</button>
                                </div>
                            ) : gameState === 'showing_pattern' ? (
                                <div>
                                    <h2 className="text-xl font-semibold mb-6">Memorize o padrão:</h2>
                                    {renderGrid()}
                                </div>
                            ) : gameState === 'waiting_input' ? (
                                <div>
                                    <h2 className="text-xl font-semibold mb-6">Reproduza o padrão:</h2>
                                    {renderGrid()}
                                    <button onClick={checkAnswer} disabled={userPattern.length === 0} className="mt-6 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow">Verificar</button>
                                </div>
                            ) : gameState === 'feedback' && feedback && (
                                <div>
                                    <h2 className={`text-2xl font-bold mb-4 ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</h2>
                                    {renderGrid()}
                                    <button onClick={nextStep} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow">
                                        Continuar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
