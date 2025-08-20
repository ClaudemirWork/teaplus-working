'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Trophy, RotateCcw, CheckCircle, XCircle, Hash, ArrowRight } from 'lucide-react';
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
export default function DigitSpan() {
    const router = useRouter();
    const supabase = createClient();

    const [gameState, setGameState] = useState<'initial' | 'ready_for_round' | 'showing_sequence' | 'waiting_input' | 'feedback' | 'level_complete' | 'finished'>('initial');
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(1);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [sequence, setSequence] = useState<number[]>([]);
    const [userInput, setUserInput] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [salvando, setSalvando] = useState(false);

    const niveis = [
        { id: 1, nome: "Nível 1", dificuldade: "3 dígitos", length: 3, time: 2500, target: 50, icone: "1️⃣" },
        { id: 2, nome: "Nível 2", dificuldade: "4 dígitos", length: 4, time: 3000, target: 50, icone: "2️⃣" },
        { id: 3, nome: "Nível 3", dificuldade: "5 dígitos", length: 5, time: 3500, target: 50, icone: "3️⃣" },
    ];

    const generateSequence = (level: number) => {
        const config = niveis.find(n => n.id === level) || niveis[0];
        const newSequence = Array.from({ length: config.length }, () => Math.floor(Math.random() * 10));
        setSequence(newSequence);
        setUserInput(Array(config.length).fill(''));
    };

    const startRound = () => {
        generateSequence(currentLevel);
        setGameState('showing_sequence');
        setFeedback(null);
        const config = niveis.find(n => n.id === currentLevel) || niveis[0];
        setTimeout(() => {
            setGameState('waiting_input');
        }, config.time);
    };

    const handleInputChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newInput = [...userInput];
            newInput[index] = value;
            setUserInput(newInput);

            // Foco automático para o próximo input
            if (value && index < (niveis.find(n => n.id === currentLevel)?.length || 0) - 1) {
                const nextInput = document.getElementById(`digit-input-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const checkAnswer = () => {
        const reversedSequence = [...sequence].reverse();
        const isCorrect = userInput.every((digit, index) => digit === reversedSequence[index].toString());
        setAttempts(prev => prev + 1);

        if (isCorrect) {
            setScore(prev => prev + 10);
            setFeedback({ correct: true, message: "Excelente! Sequência inversa correta!" });
        } else {
            const correctSequence = reversedSequence.join(' ');
            setFeedback({ correct: false, message: `Incorreto. A sequência inversa era: ${correctSequence}` });
        }
        setGameState('feedback');
    };

    const nextStep = () => {
        const config = niveis.find(n => n.id === currentLevel) || niveis[0];
        if (score >= config.target) {
            if (currentLevel < niveis.length) {
                setGameState('level_complete');
            } else {
                setGameState('finished');
            }
        } else {
            setGameState('ready_for_round');
        }
    };

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

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Span de Dígitos"
                icon={<Hash size={22} />}
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
                                        Fortalecer a memória de trabalho, exigindo memorização e o controle executivo para reverter sequências mentalmente.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Observe a sequência de números que aparece.</li>
                                        <li>Quando os campos aparecerem, digite a sequência na <strong>ordem inversa</strong>.</li>
                                        <li>Clique em "Verificar" para confirmar sua resposta.</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                        Você ganha pontos por cada sequência correta. Atingir a pontuação alvo permite avançar para o próximo nível.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Bloco 2: Seleção de Nível */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione a Quantidade de Dígitos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                            ) : gameState === 'level_complete' ? (
                                <div>
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-gray-800">Nível {currentLevel} Concluído!</h2>
                                    <p className="text-gray-600 mt-2">Excelente trabalho de memória! Prepare-se para o próximo desafio.</p>
                                    <button onClick={startNextLevel} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center gap-2 mx-auto"><ArrowRight className="w-5 h-5" />Próximo Nível</button>
                                </div>
                            ) : gameState === 'ready_for_round' ? (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Nível {currentLevel}: Memorize e digite na ordem <strong>INVERSA</strong>.</h2>
                                    <button onClick={startRound} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-shadow">Iniciar Rodada</button>
                                </div>
                            ) : gameState === 'showing_sequence' ? (
                                <div>
                                    <h2 className="text-xl font-semibold mb-6">Memorize:</h2>
                                    <div className="flex justify-center gap-4">
                                        {sequence.map((digit, index) => <div key={index} className="w-16 h-16 bg-blue-500 text-white rounded-xl flex items-center justify-center text-3xl font-bold shadow-lg animate-pulse">{digit}</div>)}
                                    </div>
                                </div>
                            ) : gameState === 'waiting_input' ? (
                                <div>
                                    <h2 className="text-xl font-semibold mb-6">Digite a sequência na ordem <strong>INVERSA</strong>:</h2>
                                    <div className="flex justify-center gap-2 sm:gap-4 mb-6">
                                        {userInput.map((digit, index) => <input key={index} id={`digit-input-${index}`} type="text" value={digit} onChange={(e) => handleInputChange(index, e.target.value)} className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none" maxLength={1} />)}
                                    </div>
                                    <button onClick={checkAnswer} disabled={userInput.some(d => d === '')} className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow">Verificar</button>
                                </div>
                            ) : gameState === 'feedback' && feedback && (
                                <div>
                                    <div className={`flex items-center justify-center gap-3 mb-4 text-2xl font-bold ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                                        {feedback.correct ? <CheckCircle /> : <XCircle />}
                                        <h2>{feedback.message}</h2>
                                    </div>
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
