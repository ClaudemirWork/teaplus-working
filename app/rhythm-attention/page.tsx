'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Pause, RotateCcw, Music, Timer, Trophy, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

// Componente do Cabeçalho Padrão
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }) => (
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


export default function RhythmAttention() {
    const router = useRouter();
    const supabase = createClient();

    const [level, setLevel] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(90);
    const [currentSequence, setCurrentSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [isShowingPattern, setIsShowingPattern] = useState(false);
    const [isWaitingInput, setIsWaitingInput] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [accuracy, setAccuracy] = useState(100);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [salvando, setSalvando] = useState(false);

    const audioContext = useRef<AudioContext | null>(null);

    const rhythmButtons = [
        { id: 1, color: 'bg-red-500', sound: 261.63, label: '🔴' },
        { id: 2, color: 'bg-blue-500', sound: 329.63, label: '🔵' },
        { id: 3, color: 'bg-green-500', sound: 392.00, label: '🟢' },
        { id: 4, color: 'bg-yellow-500', sound: 523.25, label: '🟡' }
    ];

    const getLevelConfig = useCallback(() => {
        switch(level) {
            case 1: return { sequenceLength: 3, speed: 800, buttons: 3, timeBonus: 100 };
            case 2: return { sequenceLength: 4, speed: 600, buttons: 4, timeBonus: 150 };
            case 3: return { sequenceLength: 5, speed: 500, buttons: 4, timeBonus: 200 };
            default: return { sequenceLength: 3, speed: 800, buttons: 3, timeBonus: 100 };
        }
    }, [level]);

    useEffect(() => {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        return () => {
            audioContext.current?.close();
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isPlaying && timeRemaining > 0 && !gameCompleted) {
            interval = setInterval(() => setTimeRemaining(time => time - 1), 1000);
        } else if (timeRemaining === 0 && isPlaying) {
            setGameCompleted(true);
            setIsPlaying(false);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, timeRemaining, gameCompleted]);

    const playSound = useCallback((frequency: number, duration: number = 200) => {
        if (audioContext.current) {
            const oscillator = audioContext.current.createOscillator();
            const gainNode = audioContext.current.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.current.destination);
            oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration / 1000);
            oscillator.start(audioContext.current.currentTime);
            oscillator.stop(audioContext.current.currentTime + duration / 1000);
        }
    }, []);

    const generateSequence = useCallback(() => {
        const config = getLevelConfig();
        return Array.from({ length: config.sequenceLength }, () => Math.floor(Math.random() * config.buttons) + 1);
    }, [getLevelConfig]);

    const showPattern = useCallback((sequence: number[]) => {
        setIsShowingPattern(true);
        setIsWaitingInput(false);
        const config = getLevelConfig();
        sequence.forEach((buttonId, index) => {
            setTimeout(() => {
                setCurrentStep(index + 1);
                const button = rhythmButtons.find(b => b.id === buttonId);
                if (button) playSound(button.sound);
                if (index === sequence.length - 1) {
                    setTimeout(() => {
                        setIsShowingPattern(false);
                        setIsWaitingInput(true);
                        setCurrentStep(0);
                    }, config.speed);
                }
            }, (index + 1) * config.speed);
        });
    }, [playSound, getLevelConfig]);

    const startNewRound = useCallback(() => {
        const newSequence = generateSequence();
        setCurrentSequence(newSequence);
        setUserSequence([]);
        showPattern(newSequence);
    }, [generateSequence, showPattern]);

    useEffect(() => {
        if (isPlaying && currentSequence.length === 0) {
            startNewRound();
        }
    }, [isPlaying, currentSequence, startNewRound]);

    const handleButtonClick = (buttonId: number) => {
        if (!isWaitingInput) return;
        const button = rhythmButtons.find(b => b.id === buttonId);
        if (button) playSound(button.sound, 150);
        const newUserSequence = [...userSequence, buttonId];
        setUserSequence(newUserSequence);
        if (newUserSequence[newUserSequence.length - 1] !== currentSequence[newUserSequence.length - 1]) {
            const newLives = lives - 1;
            setLives(newLives);
            setFeedbackMessage('❌ Sequência Incorreta');
            setShowFeedback(true);
            setTimeout(() => setShowFeedback(false), 1000);
            if (newLives <= 0) {
                setGameCompleted(true);
                setIsPlaying(false);
            } else {
                setTimeout(startNewRound, 1500);
            }
        } else if (newUserSequence.length === currentSequence.length) {
            setScore(prev => prev + 50 * level);
            setFeedbackMessage('✅ Perfeito!');
            setShowFeedback(true);
            setTimeout(() => setShowFeedback(false), 1000);
            if (score + 50 * level >= level * 200) {
                if (level < 3) {
                    setTimeout(() => {
                        setLevel(prev => prev + 1);
                        startNewRound();
                    }, 1500);
                } else {
                    setGameCompleted(true);
                    setIsPlaying(false);
                }
            } else {
                setTimeout(startNewRound, 1500);
            }
        }
    };
    
    const startActivity = () => {
        setIsPlaying(true);
        setTimeRemaining(90);
        setScore(0);
        setLevel(1);
        setLives(3);
        setGameCompleted(false);
        startNewRound();
    };

    const resetActivity = () => {
        setIsPlaying(false);
        setGameCompleted(false);
    };

    const handleSaveSession = async () => {
        if (!gameCompleted) return;
        setSalvando(true);
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                alert('Sessão expirada. Faça login novamente.');
                router.push('/login');
                return;
            }
            const { error } = await supabase.from('sessoes').insert([{
                usuario_id: user.id,
                atividade_nome: 'Ritmo e Atenção',
                pontuacao_final: score,
                data_fim: new Date().toISOString(),
                observacoes: { nivel_final: level, precisao: accuracy, vidas_restantes: lives }
            }]);
            if (error) {
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!\nPontuação Final: ${score}`);
                router.push('/dashboard');
            }
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        } finally {
            setSalvando(false);
        }
    };

    const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
    
    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Ritmo e Atenção"
                icon={<Music size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={gameCompleted}
            />
            <main className="p-4 sm:p-6 max-w-4xl mx-auto">
                {!isPlaying && !gameCompleted ? (
                     <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                        <div className="text-6xl mb-4">🎵</div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pronto para o desafio rítmico?</h1>
                        <p className="text-gray-600 mb-8">
                            Observe e ouça a sequência, depois repita. Treine sua atenção e memória sequencial.
                        </p>
                        <button
                            onClick={startActivity}
                            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors mx-auto"
                        >
                            <Play size={20} />
                            <span>Iniciar Ritmo</span>
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                            <div className="flex items-center gap-4">
                                <span className="bg-purple-100 text-purple-800 font-medium px-4 py-2 rounded-lg">Nível {level}</span>
                                <span className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">Pontos: {score}</span>
                                <span className="bg-green-100 text-green-800 font-medium px-4 py-2 rounded-lg">Vidas: {'❤️'.repeat(lives)}</span>
                            </div>
                            <div className="bg-red-100 px-4 py-2 rounded-lg flex items-center">
                                <Timer className="mr-2 text-red-600" size={16} />
                                <span className="text-red-800 font-medium">{formatTime(timeRemaining)}</span>
                            </div>
                        </div>

                        {gameCompleted && (
                            <div className="text-center mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <Trophy className="mx-auto text-green-600 mb-2" size={32} />
                                <h3 className="text-xl font-semibold text-green-800 mb-2">{lives > 0 ? 'Parabéns!' : 'Fim de Jogo!'}</h3>
                                <p className="text-green-700">Pontuação Final: {score} pontos.</p>
                            </div>
                        )}

                        <div className="h-20 text-center flex items-center justify-center mb-6">
                            {isShowingPattern && <p className="text-blue-800 font-medium text-lg animate-pulse">Observe... {currentStep}/{currentSequence.length}</p>}
                            {isWaitingInput && <p className="text-yellow-800 font-medium text-lg">Sua vez! {userSequence.length}/{currentSequence.length}</p>}
                            {showFeedback && <p className="text-purple-800 font-medium text-lg">{feedbackMessage}</p>}
                        </div>

                        <div className="flex justify-center items-center space-x-4 sm:space-x-6 mb-8">
                            {rhythmButtons.slice(0, getLevelConfig().buttons).map(button => (
                                <button
                                    key={button.id}
                                    onClick={() => handleButtonClick(button.id)}
                                    className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 transition-all duration-150 flex items-center justify-center text-4xl font-bold ${button.color} ${isShowingPattern && currentSequence[currentStep - 1] === button.id ? 'scale-110 border-white shadow-lg' : 'border-transparent hover:scale-105'}`}
                                    disabled={isShowingPattern || !isWaitingInput || gameCompleted}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={resetActivity}
                                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                <RotateCcw size={20} />
                                <span>Reiniciar Jogo</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
