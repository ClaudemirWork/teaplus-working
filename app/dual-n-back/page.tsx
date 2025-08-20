'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Brain, Play, RotateCcw, CheckCircle, XCircle, Trophy } from 'lucide-react';
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

interface Stimulus {
    position: number;
    sound: number;
}

export default function DualNBack() {
    const router = useRouter();
    const supabase = createClient();
    
    const [showActivity, setShowActivity] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [stimuli, setStimuli] = useState<Stimulus[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gamePhase, setGamePhase] = useState<'ready' | 'playing' | 'feedback'>('ready');
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
    const [hasResponded, setHasResponded] = useState({ position: false, sound: false });
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [activeStimulus, setActiveStimulus] = useState<number | null>(null); // Novo estado para controle visual

    const levelConfig = {
        1: { nBack: 1, stimuliCount: 15, target: 80 },
        2: { nBack: 2, stimuliCount: 20, target: 100 },
        3: { nBack: 3, stimuliCount: 25, target: 120 }
    };

    const sounds = [440, 523, 659, 784];

    const playSound = (frequency: number) => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        } catch (error) {
            console.log('Audio não suportado');
        }
    };
    
    useEffect(() => {
        if (gamePhase !== 'playing' || currentIndex >= stimuli.length) {
            if (gamePhase === 'playing' && currentIndex > 0) endGame();
            return;
        }

        const stimulus = stimuli[currentIndex];
        playSound(sounds[stimulus.sound]);
        setActiveStimulus(stimulus.position); // Acende o quadrado
        setHasResponded({ position: false, sound: false });

        // Apaga o quadrado após 1 segundo
        const showTimer = setTimeout(() => {
            setActiveStimulus(null);
        }, 1000);

        // Avança para o próximo estímulo após 3 segundos no total
        const advanceTimer = setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
        }, 3000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(advanceTimer);
        };
    }, [currentIndex, gamePhase, stimuli]);

    const startGame = () => {
        const config = levelConfig[currentLevel as keyof typeof levelConfig];
        const newStimuli = Array.from({ length: config.stimuliCount }, () => ({
            position: Math.floor(Math.random() * 9),
            sound: Math.floor(Math.random() * 4),
        }));
        
        setStimuli(newStimuli);
        setCurrentIndex(0);
        setGamePhase('playing');
    };

    const handleResponse = (type: 'position' | 'sound') => {
        if (hasResponded[type]) return;

        const config = levelConfig[currentLevel as keyof typeof levelConfig];
        // Responde ao estímulo que acabou de ser apresentado (currentIndex)
        if (currentIndex < config.nBack) return;

        const currentStimulus = stimuli[currentIndex];
        const compareStimulus = stimuli[currentIndex - config.nBack];
        
        const isCorrect = currentStimulus[type] === compareStimulus[type];
        if (isCorrect) setScore(prev => prev + 10);
        else setScore(prev => Math.max(0, prev - 5)); // Penalidade por erro
        
        setHasResponded(prev => ({ ...prev, [type]: true }));
    };

    const endGame = () => {
        setGamePhase('feedback');
        setIsGameFinished(true); // O jogo terminou, pode salvar
        const config = levelConfig[currentLevel as keyof typeof levelConfig];
        if (score >= config.target) {
            if(currentLevel < 3){
                setFeedback({ correct: true, message: `Nível ${currentLevel} concluído!` });
            } else {
                setFeedback({ correct: true, message: `Parabéns! Você completou todos os níveis!` });
            }
        } else {
            setFeedback({ correct: false, message: `Fim de jogo. Tente novamente!` });
        }
    };
    
    const nextRound = () => {
        const config = levelConfig[currentLevel as keyof typeof levelConfig];
        if (score >= config.target && currentLevel < 3) {
            const nextLevel = currentLevel + 1;
            setCurrentLevel(nextLevel);
            setScore(0);
            const nextConfig = levelConfig[nextLevel as keyof typeof levelConfig];
            const newStimuli = Array.from({ length: nextConfig.stimuliCount }, () => ({
                position: Math.floor(Math.random() * 9),
                sound: Math.floor(Math.random() * 4),
            }));
            setStimuli(newStimuli);
            setCurrentIndex(0);
            setGamePhase('playing');
        } else {
            // Se não passou, ou se já está no último nível, volta para o menu
             resetActivity();
        }
        setFeedback(null);
    };

    const resetActivity = () => {
        setCurrentLevel(1);
        setScore(0);
        setStimuli([]);
        setCurrentIndex(0);
        setGamePhase('ready');
        setFeedback(null);
        setShowActivity(false);
        setIsGameFinished(false);
    };

    const handleSaveSession = async () => {
        if (!isGameFinished) return;
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
                atividade_nome: 'Dual N-Back',
                pontuacao_final: score,
                data_fim: new Date().toISOString(),
                observacoes: { nivel_final: currentLevel }
            }]);
            if (error) {
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert('Sessão salva com sucesso!');
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
                title="Dual N-Back"
                icon={<Brain size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={isGameFinished}
            />
            <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
                {!showActivity ? (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-400">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">🎯 Objetivo</h2>
                            <p className="text-gray-700">Detecte quando a posição visual OU o som auditivo é igual ao apresentado N posições atrás.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Níveis</h2>
                            <div className="space-y-3">
                                <p><strong className="text-blue-600">Nível 1 (1-Back):</strong> Corresponde ao estímulo anterior.</p>
                                <p><strong className="text-blue-600">Nível 2 (2-Back):</strong> Corresponde ao estímulo de 2 rodadas atrás.</p>
                                <p><strong className="text-blue-600">Nível 3 (3-Back):</strong> Corresponde ao estímulo de 3 rodadas atrás.</p>
                            </div>
                        </div>
                        <div className="text-center pt-6">
                            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all" onClick={() => setShowActivity(true)}>
                                <Play className="w-5 h-5 inline-block mr-2" />
                                Começar Atividade
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm">Nível (N-Back)</h3><p className="text-2xl font-bold text-blue-600">{currentLevel}</p></div>
                            <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm">Pontuação</h3><p className="text-2xl font-bold text-green-600">{score}/{levelConfig[currentLevel as keyof typeof levelConfig].target}</p></div>
                            <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm">Progresso</h3><p className="text-2xl font-bold text-purple-600">{currentIndex}/{stimuli.length}</p></div>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            {gamePhase === 'ready' && (
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold mb-6">Nível {currentLevel}: Pronto para o {currentLevel}-Back?</h2>
                                    <button onClick={startGame} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto">
                                        <Play className="w-5 h-5" /> Iniciar
                                    </button>
                                </div>
                            )}
                            {gamePhase === 'playing' && (
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold mb-6">Estímulo {currentIndex}/{stimuli.length}</h2>
                                    <div className="grid grid-cols-3 gap-2 w-48 h-48 mx-auto mb-6">
                                        {Array.from({ length: 9 }, (_, i) => <div key={i} className={`border-2 rounded-lg transition-all ${activeStimulus === i ? 'bg-blue-500' : 'bg-gray-100'}`} />)}
                                    </div>
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => handleResponse('position')} disabled={hasResponded.position} className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold disabled:opacity-50">Posição N-Back</button>
                                        <button onClick={() => handleResponse('sound')} disabled={hasResponded.sound} className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold disabled:opacity-50">Som N-Back</button>
                                    </div>
                                </div>
                            )}
                            {gamePhase === 'feedback' && feedback && (
                                <div className="text-center">
                                    <div className={`flex items-center justify-center gap-3 mb-4 text-2xl font-bold ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                                        {feedback.correct ? <CheckCircle /> : <XCircle />}
                                        <h2>{feedback.message}</h2>
                                    </div>
                                    {isGameFinished ? (
                                        <button onClick={resetActivity} className="mt-6 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold">Reiniciar Jogo</button>
                                    ) : (
                                        <button onClick={nextRound} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold">
                                            Próximo Nível
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
