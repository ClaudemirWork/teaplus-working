'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Zap, Play, Pause, RotateCcw, Award, CheckCircle, XCircle } from 'lucide-react';
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

// --- PÁGINA DA ATIVIDADE ---
export default function ImpulseControlPage() {
    const router = useRouter();
    const supabase = createClient();
    
    const [gameState, setGameState] = useState<'initial' | 'playing' | 'paused' | 'finished'>('initial');
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(90);
    const [currentTask, setCurrentTask] = useState<{ type: string, stimulus: string, color: string, shouldRespond: boolean, delay?: number } | null>(null);
    const [responses, setResponses] = useState({ correct: 0, incorrect: 0, premature: 0, missed: 0 });
    const [showStimulus, setShowStimulus] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [salvando, setSalvando] = useState(false);
    
    const stimulusTimerRef = useRef<NodeJS.Timeout | null>(null);
    const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
    
    const stimuli = {
        go: ['🟢', '✅', '🚀', '⚡'],
        nogo: ['🔴', '❌', '🛑', '⛔'],
        choice: ['🔵', '🟡', '🟣', '🟠']
    };

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            gameTimerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            finishGame();
        }
        return () => { if (gameTimerRef.current) clearTimeout(gameTimerRef.current); };
    }, [timeLeft, gameState]);

    // Função para obter o tempo de exibição com base na sua sugestão
    const getDisplayTimeForLevel = (level: number) => {
        switch (level) {
            case 1: return 5000; // 5 segundos
            case 2: return 4000; // 4 segundos
            case 3: return 3500; // 3.5 segundos
            case 4: return 3000; // 3 segundos
            case 5: return 2500; // 2.5 segundos
            default: return 5000;
        }
    };

    const generateTask = useCallback(() => {
        const taskTypes = ['go', 'nogo', 'delay', 'choice'];
        const weights = [0.3, 0.4, 0.2, 0.1];
        let randomValue = Math.random();
        let taskType = 'go';

        for (let i = 0; i < taskTypes.length; i++) {
            if (randomValue < weights[i]) {
                taskType = taskTypes[i];
                break;
            }
            randomValue -= weights[i];
        }

        let stimulus = '', color = '', shouldRespond = false, delay;
        switch (taskType) {
            case 'go':
                stimulus = stimuli.go[Math.floor(Math.random() * stimuli.go.length)];
                color = 'text-green-500';
                shouldRespond = true;
                break;
            case 'nogo':
                stimulus = stimuli.nogo[Math.floor(Math.random() * stimuli.nogo.length)];
                color = 'text-red-500';
                shouldRespond = false;
                break;
            case 'delay':
                stimulus = '⏰';
                color = 'text-yellow-500';
                shouldRespond = true;
                delay = 1000 + (Math.random() * 2000);
                break;
            case 'choice':
                stimulus = stimuli.choice[Math.floor(Math.random() * stimuli.choice.length)];
                color = stimulus === '🔵' ? 'text-blue-500' : stimulus === '🟡' ? 'text-yellow-500' : stimulus === '🟣' ? 'text-purple-500' : 'text-orange-500';
                shouldRespond = stimulus === '🔵' || stimulus === '🟡';
                break;
        }
        return { type: taskType, stimulus, color, shouldRespond, delay };
    }, [stimuli.go, stimuli.nogo, stimuli.choice]);

    const startRound = useCallback(() => {
        const task = generateTask();
        setCurrentTask(task);
        setShowStimulus(false);
        
        // VELOCIDADE AJUSTADA: Pausa entre rodadas bem mais longa
        const interRoundDelay = Math.max(3000 - (currentLevel * 200), 2000);

        const setupStimulusTimer = () => {
            // VELOCIDADE AJUSTADA: Usando a nova função para definir o tempo
            const displayTime = getDisplayTimeForLevel(currentLevel);

            stimulusTimerRef.current = setTimeout(() => {
                if (task.shouldRespond) {
                    setResponses(prev => ({...prev, missed: prev.missed + 1}));
                    setStreak(0);
                }
                setShowStimulus(false);
                setTimeout(() => startRound(), interRoundDelay);
            }, displayTime);
        };
        
        if (task.type === 'delay' && task.delay) {
            let count = Math.ceil(task.delay / 1000);
            setCountdown(count);
            const countInterval = setInterval(() => {
                count--;
                setCountdown(count);
                if (count <= 0) {
                    clearInterval(countInterval);
                    setCountdown(0);
                    setShowStimulus(true);
                    setupStimulusTimer();
                }
            }, 1000);
        } else {
            setShowStimulus(true);
            setupStimulusTimer();
        }
    }, [generateTask, currentLevel]);

    useEffect(() => {
        if (gameState === 'playing') {
            const startTimeout = setTimeout(() => {
                startRound();
            }, 1000);

            return () => clearTimeout(startTimeout);
        }
    }, [gameState, startRound]);

    const handleResponse = () => {
        if (gameState !== 'playing') return;
        if (!currentTask || !showStimulus) {
            setResponses(prev => ({...prev, premature: prev.premature + 1}));
            setStreak(0);
            return;
        }

        if (stimulusTimerRef.current) clearTimeout(stimulusTimerRef.current);

        const interRoundDelay = Math.max(3000 - (currentLevel * 200), 2000);

        if (currentTask.shouldRespond) {
            setScore(prev => prev + 10 + (currentLevel * 5) + (streak * 2));
            setResponses(prev => ({...prev, correct: prev.correct + 1}));
            const newStreak = streak + 1;
            setStreak(newStreak);
            setMaxStreak(current => Math.max(current, newStreak));
            
            if (responses.correct > 0 && (responses.correct + 1) % 15 === 0) {
                setCurrentLevel(prev => Math.min(prev + 1, 5));
            }
        } else {
            setResponses(prev => ({...prev, incorrect: prev.incorrect + 1}));
            setStreak(0);
        }

        setShowStimulus(false);
        setTimeout(() => startRound(), interRoundDelay);
    };

    const startGame = () => {
        setTimeLeft(90);
        setCurrentLevel(1);
        setScore(0);
        setResponses({correct: 0, incorrect: 0, premature: 0, missed: 0});
        setStreak(0);
        setMaxStreak(0);
        setGameState('playing');
    };

    const finishGame = () => {
        setGameState('finished');
        if (stimulusTimerRef.current) clearTimeout(stimulusTimerRef.current);
        if (gameTimerRef.current) clearTimeout(gameTimerRef.current);
    };

    const resetGame = () => {
        setGameState('initial');
    };

    const accuracy = responses.correct + responses.incorrect > 0 ? Math.round((responses.correct / (responses.correct + responses.incorrect)) * 100) : 0;
    const getTaskInstruction = () => {
        if (!currentTask) return '';
        switch (currentTask.type) {
            case 'go': return 'CLIQUE!';
            case 'nogo': return 'NÃO CLIQUE!';
            case 'delay': return countdown > 0 ? `AGUARDE... ${countdown}` : 'CLIQUE!';
            case 'choice': return currentTask.shouldRespond ? 'CLIQUE!' : 'NÃO CLIQUE!';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Controle de Impulsos"
                icon={<Zap size={22} />}
                onSave={() => {}}
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
                                        Desenvolver o controle inibitório e a capacidade de tomar decisões rápidas, respondendo ou contendo impulsos de acordo com regras variadas.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li><strong>Go (🟢):</strong> Clique o mais rápido possível.</li>
                                        <li><strong>No-Go (🔴):</strong> Não clique. Resista ao impulso.</li>
                                        <li><strong>Delay (⏰):</strong> Espere a contagem acabar para clicar.</li>
                                        <li><strong>Choice (🔵🟡):</strong> Clique apenas em azul ou amarelo.</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                       A pontuação é baseada na velocidade e precisão. Acertos em sequência dão bônus. Erros, como cliques errados ou prematuros, são penalizados.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-4">
                            <button
                                onClick={startGame}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                            >
                                🚀 Iniciar Atividade
                            </button>
                        </div>
                    </div>
                )}

                {(gameState === 'playing' || gameState === 'paused') && (
                    <div className="space-y-6 max-w-3xl mx-auto">
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                             <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-blue-600">{score}</div><div className="text-sm text-gray-600">Pontos</div></div>
                             <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-orange-600">{timeLeft}s</div><div className="text-sm text-gray-600">Tempo</div></div>
                             <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-purple-600">{streak}</div><div className="text-sm text-gray-600">Sequência</div></div>
                             <div className="bg-white rounded-lg p-3 text-center shadow"><div className="text-xl font-bold text-teal-600">{currentLevel}</div><div className="text-sm text-gray-600">Nível</div></div>
                         </div>
                        
                        <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center min-h-[350px] flex flex-col items-center justify-center">
                            {showStimulus && currentTask && gameState === 'playing' ? (
                                <div className="space-y-6">
                                    <div className={`text-9xl ${currentTask.color}`}>{currentTask.stimulus}</div>
                                    <div className="text-2xl font-bold text-gray-900">{getTaskInstruction()}</div>
                                </div>
                            ) : countdown > 0 ? (
                                <div className="space-y-6">
                                    <div className="text-9xl text-yellow-500">⏰</div>
                                    <div className="text-3xl font-bold text-yellow-600">{getTaskInstruction()}</div>
                                </div>
                            ) : gameState === 'playing' ? (
                                <div className="text-gray-500 text-xl">Prepare-se...</div>
                            ) : null}
                        </div>

                        <div className="text-center">
                            <button onClick={handleResponse} className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-12 rounded-2xl font-bold text-2xl transition-colors">
                                CLIQUE AQUI
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'finished' && (
                     <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
                         <Award className="mx-auto text-orange-500 mb-4" size={48}/>
                         <h2 className="text-3xl font-bold text-gray-800 mb-6">Exercício Concluído!</h2>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                             <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{score}</div><div className="text-sm">Pontuação</div></div>
                             <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{accuracy}%</div><div className="text-sm">Precisão</div></div>
                             <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{maxStreak}</div><div className="text-sm">Maior Sequência</div></div>
                             <div className="bg-gray-100 p-4 rounded-lg"><div className="text-2xl font-bold">{currentLevel}</div><div className="text-sm">Nível Final</div></div>
                         </div>
                         <div className="flex justify-center gap-4">
                             <button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto">
                                <RotateCcw size={20}/>
                                Jogar Novamente
                             </button>
                         </div>
                     </div>
                )}
            </main>
        </div>
    )
}
