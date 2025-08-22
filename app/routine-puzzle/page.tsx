'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Trophy, RotateCcw, Sun, Moon, Sparkles, CheckCircle, XCircle, Clock, Star } from 'lucide-react';
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

// Tipo para as atividades
type Activity = {
    id: string;
    name: string;
    icon: string;
    period: 'dia' | 'noite';
    description: string;
};

// Banco de atividades com diferentes dificuldades
const allActivities: Activity[] = [
    // Atividades do DIA
    { id: 'cafe', name: 'Tomar Café', icon: '☕', period: 'dia', description: 'Hora do café da manhã' },
    { id: 'escola', name: 'Ir para Escola', icon: '🎒', period: 'dia', description: 'Tempo de aprender' },
    { id: 'almoco', name: 'Almoçar', icon: '🍽️', period: 'dia', description: 'Refeição do meio-dia' },
    { id: 'licao', name: 'Fazer Lição', icon: '📚', period: 'dia', description: 'Estudar e fazer tarefas' },
    { id: 'brincar', name: 'Brincar', icon: '⚽', period: 'dia', description: 'Hora de se divertir' },
    { id: 'lanche', name: 'Lanche da Tarde', icon: '🍎', period: 'dia', description: 'Pequena refeição' },
    { id: 'banho_dia', name: 'Tomar Banho', icon: '🚿', period: 'dia', description: 'Ficar limpinho' },
    { id: 'sol', name: 'Tomar Sol', icon: '☀️', period: 'dia', description: 'Vitamina D' },
    
    // Atividades da NOITE
    { id: 'jantar', name: 'Jantar', icon: '🍝', period: 'noite', description: 'Refeição da noite' },
    { id: 'escovar', name: 'Escovar Dentes', icon: '🦷', period: 'noite', description: 'Higiene bucal' },
    { id: 'pijama', name: 'Vestir Pijama', icon: '👕', period: 'noite', description: 'Roupa de dormir' },
    { id: 'historia', name: 'Ouvir História', icon: '📖', period: 'noite', description: 'História para dormir' },
    { id: 'dormir', name: 'Dormir', icon: '😴', period: 'noite', description: 'Hora de descansar' },
    { id: 'lua', name: 'Ver a Lua', icon: '🌙', period: 'noite', description: 'Observar o céu' },
    { id: 'sonhar', name: 'Sonhar', icon: '💭', period: 'noite', description: 'Ter bons sonhos' },
];

// Componente de carta arrastável
const DraggableCard = ({ activity, isDragging, onDragStart, onDragEnd, isPlaced, isCorrect }: {
    activity: Activity;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    isPlaced: boolean;
    isCorrect: boolean | null;
}) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('activityId', activity.id);
        onDragStart(e);
    };

    return (
        <div
            draggable={!isPlaced}
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
            className={`
                relative p-4 rounded-xl cursor-move transition-all transform select-none
                ${isDragging ? 'opacity-50 scale-95' : ''}
                ${isPlaced ? 'cursor-not-allowed opacity-60' : 'hover:scale-105 hover:shadow-lg'}
                ${isCorrect === true ? 'bg-green-100 border-2 border-green-500' : ''}
                ${isCorrect === false ? 'bg-red-100 border-2 border-red-500' : ''}
                ${!isPlaced && isCorrect === null ? 'bg-white border-2 border-gray-300 shadow-md' : ''}
            `}
        >
            <div className="text-3xl text-center mb-2">{activity.icon}</div>
            <div className="text-xs sm:text-sm font-semibold text-center text-gray-700">{activity.name}</div>
            {isCorrect !== null && (
                <div className="absolute -top-2 -right-2">
                    {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 bg-white rounded-full" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-600 bg-white rounded-full" />
                    )}
                </div>
            )}
        </div>
    );
};

// Componente de área para soltar
const DropZone = ({ period, activities, onDrop, isHighlighted }: {
    period: 'dia' | 'noite';
    activities: Activity[];
    onDrop: (activityId: string) => void;
    isHighlighted: boolean;
}) => {
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const activityId = e.dataTransfer.getData('activityId');
        if (activityId) {
            onDrop(activityId);
        }
    };

    const isDia = period === 'dia';

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`
                relative min-h-[300px] rounded-2xl p-6 transition-all
                ${isHighlighted ? 'ring-4 ring-blue-400 scale-102' : ''}
                ${isDia 
                    ? 'bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-50 border-2 border-yellow-300' 
                    : 'bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 border-2 border-purple-400'
                }
            `}
        >
            {/* Cabeçalho da área */}
            <div className="flex items-center justify-center mb-4">
                {isDia ? (
                    <>
                        <Sun className="w-8 h-8 text-yellow-600 mr-2" />
                        <h3 className="text-xl font-bold text-yellow-800">DIA</h3>
                    </>
                ) : (
                    <>
                        <Moon className="w-8 h-8 text-yellow-200 mr-2" />
                        <h3 className="text-xl font-bold text-white">NOITE</h3>
                    </>
                )}
            </div>

            {/* Grid de atividades */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activities.length === 0 ? (
                    <div className={`col-span-full text-center py-8 border-2 border-dashed rounded-lg ${
                        isDia ? 'border-yellow-400 text-yellow-700' : 'border-purple-300 text-purple-200'
                    }`}>
                        <p className="text-sm">Arraste as atividades para cá</p>
                    </div>
                ) : (
                    activities.map(activity => (
                        <div key={activity.id} className="animate-fadeIn">
                            <DraggableCard
                                activity={activity}
                                isDragging={false}
                                onDragStart={() => {}}
                                onDragEnd={() => {}}
                                isPlaced={true}
                                isCorrect={activity.period === period}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- PÁGINA PRINCIPAL DO JOGO ---
export default function RoutinePuzzlePage() {
    const router = useRouter();
    const supabase = createClient();

    type GameState = 'initial' | 'playing' | 'checking' | 'finished';

    const [gameState, setGameState] = useState<GameState>('initial');
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    const [currentActivities, setCurrentActivities] = useState<Activity[]>([]);
    const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);
    const [dayActivities, setDayActivities] = useState<Activity[]>([]);
    const [nightActivities, setNightActivities] = useState<Activity[]>([]);
    const [draggedActivity, setDraggedActivity] = useState<Activity | null>(null);
    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isHighlightedDay, setIsHighlightedDay] = useState(false);
    const [isHighlightedNight, setIsHighlightedNight] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const levels = [
        { id: 1, name: 'Iniciante', pieces: 4, icon: '🌱', color: 'from-green-400 to-green-600' },
        { id: 2, name: 'Fácil', pieces: 6, icon: '🌿', color: 'from-blue-400 to-blue-600' },
        { id: 3, name: 'Médio', pieces: 8, icon: '🌳', color: 'from-purple-400 to-purple-600' },
        { id: 4, name: 'Difícil', pieces: 10, icon: '🌲', color: 'from-orange-400 to-orange-600' },
        { id: 5, name: 'Expert', pieces: 12, icon: '🏆', color: 'from-red-400 to-red-600' },
        { id: 6, name: 'Mestre', pieces: 15, icon: '👑', color: 'from-pink-400 to-pink-600' },
    ];

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameState === 'playing' && startTime > 0) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, startTime]);

    const startGame = () => {
        const level = levels.find(l => l.id === selectedLevel) || levels[0];
        
        // Selecionar atividades aleatórias
        const shuffled = [...allActivities].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, level.pieces);
        
        setCurrentActivities(selected);
        setAvailableActivities(selected);
        setDayActivities([]);
        setNightActivities([]);
        setScore(0);
        setErrors(0);
        setStartTime(Date.now());
        setElapsedTime(0);
        setGameState('playing');
    };

    const handleDragStart = (e: React.DragEvent, activity: Activity) => {
        setDraggedActivity(activity);
        
        // Destacar a área correta
        if (activity.period === 'dia') {
            setIsHighlightedDay(true);
        } else {
            setIsHighlightedNight(true);
        }
    };

    const handleDragEnd = () => {
        setDraggedActivity(null);
        setIsHighlightedDay(false);
        setIsHighlightedNight(false);
    };

    const handleDrop = (period: 'dia' | 'noite', activityId: string) => {
        const activity = availableActivities.find(a => a.id === activityId);
        if (!activity) return;

        // Remover da lista de disponíveis
        setAvailableActivities(prev => prev.filter(a => a.id !== activity.id));
        
        // Adicionar à área apropriada
        if (period === 'dia') {
            setDayActivities(prev => [...prev, activity]);
        } else {
            setNightActivities(prev => [...prev, activity]);
        }

        // Verificar se está correto
        if (activity.period === period) {
            setScore(prev => prev + 10);
        } else {
            setErrors(prev => prev + 1);
        }

        // Limpar estados de destaque
        setIsHighlightedDay(false);
        setIsHighlightedNight(false);

        // Verificar se o jogo acabou
        if (availableActivities.length === 1) {
            setTimeout(() => {
                setGameState('checking');
                setTimeout(() => {
                    setGameState('finished');
                }, 2000);
            }, 500);
        }
    };

    const resetGame = () => {
        setGameState('initial');
        setSelectedLevel(1);
        setCurrentActivities([]);
        setAvailableActivities([]);
        setDayActivities([]);
        setNightActivities([]);
        setScore(0);
        setErrors(0);
        setElapsedTime(0);
    };

    const calculateAccuracy = () => {
        const total = currentActivities.length;
        if (total === 0) return 0;
        const correct = total - errors;
        return Math.round((correct / total) * 100);
    };

    const calculateStars = () => {
        const accuracy = calculateAccuracy();
        if (accuracy >= 95) return 3;
        if (accuracy >= 80) return 2;
        if (accuracy >= 60) return 1;
        return 0;
    };

    const handleSaveSession = async () => {
        setSalvando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                const sessionData = {
                    user_id: user.id,
                    game_type: 'routine_puzzle',
                    level: selectedLevel,
                    score: score,
                    duration_seconds: elapsedTime,
                    metrics: {
                        pieces: currentActivities.length,
                        errors: errors,
                        accuracy: calculateAccuracy(),
                        stars: calculateStars()
                    },
                    created_at: new Date().toISOString()
                };
                
                const { error } = await supabase
                    .from('game_sessions')
                    .insert([sessionData]);
                    
                if (error) {
                    console.error('Erro ao salvar sessão:', error);
                } else {
                    console.log('Sessão salva com sucesso!');
                }
            }
        } catch (error) {
            console.error('Erro ao salvar sessão:', error);
        } finally {
            setSalvando(false);
            router.push('/dashboard');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <GameHeader 
                title="Quebrando a Rotina"
                icon={<Sparkles className="w-6 h-6" />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={gameState === 'finished'}
            />

            <main className="p-4 sm:p-6 max-w-7xl mx-auto">
                {/* Tela Inicial */}
                {gameState === 'initial' && (
                    <div className="space-y-6">
                        {/* Instruções */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                                🌞 Organize a Rotina do Dia e da Noite 🌙
                            </h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                                    <h3 className="font-bold text-yellow-800 mb-2">🎯 Objetivo</h3>
                                    <p className="text-sm text-gray-700">
                                        Organize as atividades nos períodos corretos: DIA ou NOITE.
                                    </p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                                    <h3 className="font-bold text-blue-800 mb-2">🎮 Como Jogar</h3>
                                    <p className="text-sm text-gray-700">
                                        Arraste cada carta para a área correta. Atividades do dia vão para o sol, da noite para a lua.
                                    </p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                                    <h3 className="font-bold text-green-800 mb-2">⭐ Pontuação</h3>
                                    <p className="text-sm text-gray-700">
                                        Ganhe pontos por acertos! Quanto menos erros, mais estrelas você ganha.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seleção de Nível */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Escolha o Nível</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {levels.map(level => (
                                    <button
                                        key={level.id}
                                        onClick={() => setSelectedLevel(level.id)}
                                        className={`
                                            relative p-4 rounded-xl transition-all transform hover:scale-105
                                            ${selectedLevel === level.id 
                                                ? `bg-gradient-to-br ${level.color} text-white shadow-lg scale-105` 
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            }
                                        `}
                                    >
                                        <div className="text-3xl mb-2">{level.icon}</div>
                                        <div className="font-bold">{level.name}</div>
                                        <div className="text-xs opacity-80">{level.pieces} peças</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Botão Iniciar */}
                        <div className="text-center">
                            <button
                                onClick={startGame}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg transform transition-all hover:scale-105"
                            >
                                🚀 Começar Jogo
                            </button>
                        </div>
                    </div>
                )}

                {/* Tela do Jogo */}
                {(gameState === 'playing' || gameState === 'checking') && (
                    <div className="space-y-4">
                        {/* Status Bar */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    <span className="font-semibold">{formatTime(elapsedTime)}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                                        ✅ {score} pts
                                    </span>
                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                                        ❌ {errors}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {availableActivities.length}/{currentActivities.length} restantes
                                </div>
                            </div>
                        </div>

                        {/* Áreas de Drop */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <DropZone
                                period="dia"
                                activities={dayActivities}
                                onDrop={(activityId) => handleDrop('dia', activityId)}
                                isHighlighted={isHighlightedDay}
                            />
                            <DropZone
                                period="noite"
                                activities={nightActivities}
                                onDrop={(activityId) => handleDrop('noite', activityId)}
                                isHighlighted={isHighlightedNight}
                            />
                        </div>

                        {/* Cartas Disponíveis */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                                Arraste as Atividades
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                {availableActivities.map(activity => (
                                    <DraggableCard
                                        key={activity.id}
                                        activity={activity}
                                        isDragging={draggedActivity?.id === activity.id}
                                        onDragStart={(e) => handleDragStart(e, activity)}
                                        onDragEnd={handleDragEnd}
                                        isPlaced={false}
                                        isCorrect={null}
                                    />
                                ))}
                            </div>
                        </div>

                        {gameState === 'checking' && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-xl p-8 text-center animate-bounce">
                                    <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                                    <p className="text-2xl font-bold text-gray-800">Verificando...</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tela Final */}
                {gameState === 'finished' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Parabéns!</h2>
                            
                            {/* Estrelas */}
                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3].map(star => (
                                    <Star
                                        key={star}
                                        className={`w-12 h-12 ${
                                            star <= calculateStars()
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Estatísticas */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-blue-800">{score}</div>
                                    <div className="text-sm text-blue-600">Pontos</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-green-800">{calculateAccuracy()}%</div>
                                    <div className="text-sm text-green-600">Precisão</div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-purple-800">{formatTime(elapsedTime)}</div>
                                    <div className="text-sm text-purple-600">Tempo</div>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-orange-800">{currentActivities.length}</div>
                                    <div className="text-sm text-orange-600">Peças</div>
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="mb-6">
                                {calculateAccuracy() === 100 ? (
                                    <p className="text-lg text-green-600 font-semibold">
                                        🎉 Perfeito! Você acertou todas!
                                    </p>
                                ) : calculateAccuracy() >= 80 ? (
                                    <p className="text-lg text-blue-600 font-semibold">
                                        👏 Muito bem! Continue assim!
                                    </p>
                                ) : (
                                    <p className="text-lg text-orange-600 font-semibold">
                                        💪 Bom trabalho! Pratique mais!
                                    </p>
                                )}
                            </div>

                            {/* Botão Jogar Novamente */}
                            <button
                                onClick={resetGame}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Jogar Novamente
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
