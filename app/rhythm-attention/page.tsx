'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Music, RotateCcw, Save, Trophy } from 'lucide-react';
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
export default function RhythmAttention() {
    const router = useRouter();
    const supabase = createClient();

    // Estados refatorados
    const [gameState, setGameState] = useState<'initial' | 'showing_pattern' | 'waiting_input' | 'finished'>('initial');
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(1);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(90);
    const [lives, setLives] = useState(3);
    const [currentSequence, setCurrentSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [salvando, setSalvando] = useState(false);

    const audioContext = useRef<AudioContext | null>(null);
    
    const niveis = [
        { id: 1, nome: "Nível 1", dificuldade: "3 botões", sequenceLength: 3, speed: 800, buttons: 3, duracao: 1.5, icone: "🥁" },
        { id: 2, nome: "Nível 2", dificuldade: "4 botões", sequenceLength: 4, speed: 700, buttons: 4, duracao: 2, icone: "🎹" },
        { id: 3, nome: "Nível 3", dificuldade: "Rápido", sequenceLength: 5, speed: 550, buttons: 4, duracao: 2, icone: "🎷" },
        { id: 4, nome: "Nível 4", dificuldade: "Complexo", sequenceLength: 6, speed: 500, buttons: 4, duracao: 2.5, icone: "🎺" },
        { id: 5, nome: "Nível 5", dificuldade: "Maestro", sequenceLength: 7, speed: 450, buttons: 4, duracao: 3, icone: "🎻" },
    ];

    const rhythmButtons = [
        { id: 1, color: 'bg-red-500', sound: 261.63 },
        { id: 2, color: 'bg-blue-500', sound: 329.63 },
        { id: 3, color: 'bg-green-500', sound: 392.00 },
        { id: 4, color: 'bg-yellow-500', sound: 523.25 }
    ];

    useEffect(() => {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        return () => { audioContext.current?.close(); };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (gameState !== 'initial' && gameState !== 'finished' && timeRemaining > 0) {
            interval = setInterval(() => setTimeRemaining(time => time - 1), 1000);
        } else if (timeRemaining === 0) {
            setGameState('finished');
        }
        return () => { if (interval) clearInterval(interval); };
    }, [gameState, timeRemaining]);

    const playSound = useCallback((frequency: number, duration: number = 200) => {
        if (audioContext.current) {
            const oscillator = audioContext.current.createOscillator();
            oscillator.connect(audioContext.current.destination);
            oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
            oscillator.start();
            oscillator.stop(audioContext.current.currentTime + duration / 1000);
        }
    }, []);

    const generateSequence = useCallback(() => {
        const config = niveis.find(n => n.id === currentLevel) || niveis[0];
        return Array.from({ length: config.sequenceLength }, () => Math.floor(Math.random() * config.buttons) + 1);
    }, [currentLevel, niveis]);

    const showPattern = useCallback((sequence: number[]) => {
        setGameState('showing_pattern');
        const config = niveis.find(n => n.id === currentLevel) || niveis[0];
        sequence.forEach((buttonId, index) => {
            setTimeout(() => {
                setCurrentStep(index + 1);
                const button = rhythmButtons.find(b => b.id === buttonId);
                if (button) playSound(button.sound);
                if (index === sequence.length - 1) {
                    setTimeout(() => {
                        setGameState('waiting_input');
                        setCurrentStep(0);
                    }, config.speed);
                }
            }, (index + 1) * config.speed);
        });
    }, [playSound, currentLevel, niveis]);

    const startNewRound = useCallback(() => {
        const newSequence = generateSequence();
        setCurrentSequence(newSequence);
        setUserSequence([]);
        showPattern(newSequence);
    }, [generateSequence, showPattern]);

    const handleButtonClick = (buttonId: number) => {
        if (gameState !== 'waiting_input') return;
        
        const button = rhythmButtons.find(b => b.id === buttonId);
        if (button) playSound(button.sound, 150);
        
        const newUserSequence = [...userSequence, buttonId];
        setUserSequence(newUserSequence);
        
        if (newUserSequence[newUserSequence.length - 1] !== currentSequence[newUserSequence.length - 1]) {
            const newLives = lives - 1;
            setLives(newLives);
            setFeedbackMessage('❌ Sequência Incorreta!');
            setTimeout(() => setFeedbackMessage(''), 1000);
            
            if (newLives <= 0) {
                setGameState('finished');
            } else {
                setTimeout(startNewRound, 1500);
            }
        } else if (newUserSequence.length === currentSequence.length) {
            setScore(prev => prev + 50 * currentLevel);
            setFeedbackMessage('✅ Perfeito!');
            setTimeout(() => setFeedbackMessage(''), 1000);
            
            // Lógica de avançar de nível
            if (currentLevel < niveis.length && score + 50 * currentLevel >= currentLevel * 200) {
                setTimeout(() => {
                    setCurrentLevel(prev => prev + 1);
                    startNewRound();
                }, 1500);
            } else {
                setTimeout(startNewRound, 1500);
            }
        }
    };
    
    const startGame = () => {
        if (nivelSelecionado === null) return;
        const config = niveis.find(n => n.id === nivelSelecionado) || niveis[0];
        
        setCurrentLevel(nivelSelecionado);
        setTimeRemaining(config.duracao * 60);
        setScore(0);
        setLives(3);
        
        const initialSequence = generateSequence();
        setCurrentSequence(initialSequence);
        setUserSequence([]);
        showPattern(initialSequence);
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

    const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
    const getConfigForCurrentLevel = () => niveis.find(n => n.id === currentLevel) || niveis[0];

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Ritmo e Atenção"
                icon={<Music size={22} />}
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
                                       Memorizar e reproduzir sequências de sons e cores que aumentam em complexidade e velocidade, treinando a memória de curto prazo e a atenção sustentada.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Observe e ouça a sequência de cores e sons.</li>
                                        <li>Quando for sua vez, repita a sequência clicando nos botões.</li>
                                        <li>Cuidado! Você tem um número limitado de vidas.</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                        Você ganha pontos por cada sequência correta. O jogo avança para níveis mais difíceis automaticamente conforme você acerta.
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
                                        <div className="text-xs opacity-80">{`${nivel.dificuldade} (${nivel.duracao}min)`}</div>
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
                         <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                             <div className="flex items-center gap-4">
                                 <span className="bg-purple-100 text-purple-800 font-medium px-4 py-2 rounded-lg">Nível {currentLevel}</span>
                                 <span className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">Pontos: {score}</span>
                                 <span className="bg-green-100 text-green-800 font-medium px-4 py-2 rounded-lg">Vidas: {'❤️'.repeat(lives)}</span>
                             </div>
                             <div className="bg-red-100 text-red-800 font-medium px-4 py-2 rounded-lg">
                                 Tempo: {formatTime(timeRemaining)}
                             </div>
                         </div>

                         <div className="h-20 text-center flex items-center justify-center mb-6">
                             {gameState === 'showing_pattern' && <p className="text-blue-800 font-medium text-lg animate-pulse">Observe... {currentStep}/{currentSequence.length}</p>}
                             {gameState === 'waiting_input' && <p className="text-yellow-800 font-medium text-lg">Sua vez! {userSequence.length}/{currentSequence.length}</p>}
                             {feedbackMessage && <p className="text-purple-800 font-medium text-lg">{feedbackMessage}</p>}
                         </div>

                         <div className="flex justify-center items-center space-x-4 sm:space-x-6 mb-8">
                             {rhythmButtons.slice(0, getConfigForCurrentLevel().buttons).map(button => (
                                 <button
                                     key={button.id}
                                     onClick={() => handleButtonClick(button.id)}
                                     className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 transition-all duration-150 flex items-center justify-center text-4xl font-bold ${button.color} ${gameState === 'showing_pattern' && currentSequence[currentStep - 1] === button.id ? 'scale-110 border-white shadow-lg' : 'border-transparent hover:scale-105'}`}
                                     disabled={gameState !== 'waiting_input'}
                                 />
                             ))}
                         </div>
                     </div>
                )}

                {gameState === 'finished' && (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
                        <Trophy className="mx-auto text-yellow-500 mb-4" size={48} />
                         <h3 className="text-3xl font-bold text-gray-800 mb-6">{lives > 0 ? 'Parabéns, você completou!' : 'Fim de Jogo!'}</h3>
                         <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                             <div className="bg-gray-100 rounded-lg p-4"><div className="text-2xl font-bold">{score}</div><div className="text-sm">Pontuação Final</div></div>
                             <div className="bg-gray-100 rounded-lg p-4"><div className="text-2xl font-bold">{currentLevel}</div><div className="text-sm">Nível Atingido</div></div>
                         </div>
                         <div className="space-x-4">
                             <button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                 Jogar Novamente
                             </button>
                         </div>
                    </div>
                )}
            </main>
        </div>
    );
}
