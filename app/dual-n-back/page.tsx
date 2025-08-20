'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Brain, Play, RotateCcw, CheckCircle, XCircle, Trophy, ArrowRight } from 'lucide-react';
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

// --- TIPAGEM E CONSTANTES ---
interface Stimulus {
    position: number;
    sound: number;
}

// --- PÁGINA DA ATIVIDADE ---
export default function DualNBack() {
    const router = useRouter();
    const supabase = createClient();
    
    const [gameState, setGameState] = useState<'initial' | 'playing' | 'level_complete' | 'finished'>('initial');
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(1);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [stimuli, setStimuli] = useState<Stimulus[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasResponded, setHasResponded] = useState({ position: false, sound: false });
    const [salvando, setSalvando] = useState(false);
    const [activeStimulus, setActiveStimulus] = useState<number | null>(null);

    const niveis = [
        { id: 1, nome: "Nível 1", dificuldade: "1-Back", nBack: 1, stimuliCount: 15 + 1, target: 80, icone: "1️⃣" },
        { id: 2, nome: "Nível 2", dificuldade: "2-Back", nBack: 2, stimuliCount: 20 + 2, target: 100, icone: "2️⃣" },
        { id: 3, nome: "Nível 3", dificuldade: "3-Back", nBack: 3, stimuliCount: 25 + 3, target: 120, icone: "3️⃣" }
    ];

    const sounds = [440, 523, 659, 784]; // Frequências para os sons

    const playSound = (frequency: number) => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            oscillator.connect(audioContext.destination);
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.4);
        } catch (e) {
            console.error("Audio API not supported");
        }
    };
    
    useEffect(() => {
        if (gameState !== 'playing' || currentIndex >= stimuli.length) {
            if (gameState === 'playing' && currentIndex > 0) endGame();
            return;
        }

        const stimulus = stimuli[currentIndex];
        playSound(sounds[stimulus.sound]);
        setActiveStimulus(stimulus.position);
        setHasResponded({ position: false, sound: false });

        const showTimer = setTimeout(() => setActiveStimulus(null), 1000);
        const advanceTimer = setTimeout(() => setCurrentIndex(prev => prev + 1), 3000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(advanceTimer);
        };
    }, [currentIndex, gameState, stimuli]);

    const startGame = () => {
        if (nivelSelecionado === null) return;
        
        const config = niveis.find(n => n.id === nivelSelecionado) || niveis[0];
        const newStimuli = Array.from({ length: config.stimuliCount }, () => ({
            position: Math.floor(Math.random() * 9),
            sound: Math.floor(Math.random() * 4),
        }));
        
        setStimuli(newStimuli);
        setCurrentLevel(nivelSelecionado);
        setCurrentIndex(0);
        setScore(0);
        setGameState('playing');
    };

    const handleResponse = (type: 'position' | 'sound') => {
        if (hasResponded[type]) return;
        const config = niveis.find(n => n.id === currentLevel) || niveis[0];
        if (currentIndex < config.nBack) return;

        const currentStimulus = stimuli[currentIndex];
        const compareStimulus = stimuli[currentIndex - config.nBack];
        
        const isCorrect = currentStimulus[type] === compareStimulus[type];
        if (isCorrect) setScore(prev => prev + 10);
        else setScore(prev => Math.max(0, prev - 5));
        
        setHasResponded(prev => ({ ...prev, [type]: true }));
    };

    const endGame = () => {
        const config = niveis.find(n => n.id === currentLevel) || niveis[0];
        if (score >= config.target && currentLevel < niveis.length) {
            setGameState('level_complete');
        } else {
            setGameState('finished');
        }
    };
    
    const startNextLevel = () => {
        const nextLevelId = currentLevel + 1;
        const config = niveis.find(n => n.id === nextLevelId) || niveis[0];
        const newStimuli = Array.from({ length: config.stimuliCount }, () => ({
            position: Math.floor(Math.random() * 9),
            sound: Math.floor(Math.random() * 4),
        }));

        setStimuli(newStimuli);
        setCurrentLevel(nextLevelId);
        setCurrentIndex(0);
        setScore(0);
        setGameState('playing');
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
                title="Dual N-Back"
                icon={<Brain size={22} />}
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
                                        Expandir a capacidade da memória de trabalho, monitorando e comparando estímulos visuais e auditivos simultaneamente.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Você verá um quadrado acender e ouvirá um som.</li>
                                        <li>Se a <strong>posição</strong> for igual à de N rodadas atrás, clique em "Posição N-Back".</li>
                                        <li>Se o <strong>som</strong> for igual ao de N rodadas atrás, clique em "Som N-Back".</li>
                                        <li>'N' é o nível do jogo (1-Back, 2-Back, etc).</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                        Sua pontuação aumenta para cada correspondência correta identificada. Este exercício é cientificamente reconhecido por melhorar a inteligência fluida.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Bloco 2: Seleção de Nível */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível (N-Back)</h2>
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
                
                {(gameState === 'playing') && (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                             <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm">Nível (N-Back)</h3><p className="text-2xl font-bold text-blue-600">{currentLevel}</p></div>
                             <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm">Pontuação</h3><p className="text-2xl font-bold text-green-600">{score} / {niveis.find(n => n.id === currentLevel)?.target}</p></div>
                             <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm">Progresso</h3><p className="text-2xl font-bold text-purple-600">{currentIndex}/{stimuli.length}</p></div>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                             <h2 className="text-xl font-semibold mb-6">Estímulo {currentIndex}/{stimuli.length}</h2>
                             <div className="grid grid-cols-3 gap-2 w-48 h-48 mx-auto mb-6">
                                 {Array.from({ length: 9 }, (_, i) => <div key={i} className={`border-2 rounded-lg transition-all ${activeStimulus === i ? 'bg-blue-500' : 'bg-gray-100'}`} />)}
                             </div>
                             <div className="flex justify-center gap-4">
                                 <button onClick={() => handleResponse('position')} disabled={hasResponded.position} className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold disabled:opacity-50">Posição N-Back</button>
                                 <button onClick={() => handleResponse('sound')} disabled={hasResponded.sound} className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold disabled:opacity-50">Som N-Back</button>
                             </div>
                        </div>
                    </div>
                )}

                {(gameState === 'level_complete' || gameState === 'finished') && (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
                        <Trophy className="mx-auto text-yellow-500 mb-4" size={48}/>
                         <h2 className="text-3xl font-bold text-gray-800 mb-2">
                             {gameState === 'finished' && score < (niveis.find(n => n.id === currentLevel)?.target || 0) ? "Fim de Jogo" : `Nível ${currentLevel} Concluído!`}
                         </h2>
                         <p className="text-gray-600 mb-6">Sua pontuação foi {score}.</p>
                        
                        {gameState === 'level_complete' ? (
                            <button onClick={startNextLevel} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto">
                                <ArrowRight size={20}/>
                                Ir para o Nível {currentLevel + 1}
                            </button>
                        ) : (
                             <button onClick={resetGame} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto">
                                <RotateCcw size={20}/>
                                Jogar Novamente
                             </button>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
