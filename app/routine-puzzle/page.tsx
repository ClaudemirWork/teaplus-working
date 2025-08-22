'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Trophy, RotateCcw, Sun, Moon, Sparkles, CheckCircle, XCircle, Clock, Star, Calendar, Plus, Trash2, Edit2, Eye } from 'lucide-react';
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

// Tipos
type Activity = {
    id: string;
    name: string;
    icon: string;
    period: 'dia' | 'noite';
    description: string;
};

type RoutineActivity = Activity & {
    time?: string;
    duration?: number;
};

type GameMode = 'menu' | 'game' | 'create_routine';
type GameState = 'initial' | 'playing' | 'checking' | 'finished';

// Banco de atividades
const allActivities: Activity[] = [
    // Atividades do DIA
    { id: 'acordar', name: 'Acordar', icon: '⏰', period: 'dia', description: 'Começar o dia' },
    { id: 'cafe', name: 'Tomar Café', icon: '☕', period: 'dia', description: 'Café da manhã' },
    { id: 'escovar_manha', name: 'Escovar Dentes', icon: '🪥', period: 'dia', description: 'Higiene matinal' },
    { id: 'escola', name: 'Ir para Escola', icon: '🎒', period: 'dia', description: 'Tempo de aprender' },
    { id: 'almoco', name: 'Almoçar', icon: '🍽️', period: 'dia', description: 'Refeição do meio-dia' },
    { id: 'licao', name: 'Fazer Lição', icon: '📚', period: 'dia', description: 'Estudar e fazer tarefas' },
    { id: 'brincar', name: 'Brincar', icon: '⚽', period: 'dia', description: 'Hora de se divertir' },
    { id: 'lanche', name: 'Lanche da Tarde', icon: '🍎', period: 'dia', description: 'Pequena refeição' },
    { id: 'banho_dia', name: 'Tomar Banho', icon: '🚿', period: 'dia', description: 'Ficar limpinho' },
    { id: 'sol', name: 'Tomar Sol', icon: '☀️', period: 'dia', description: 'Vitamina D' },
    
    // Atividades da NOITE
    { id: 'jantar', name: 'Jantar', icon: '🍝', period: 'noite', description: 'Refeição da noite' },
    { id: 'escovar_noite', name: 'Escovar Dentes', icon: '🦷', period: 'noite', description: 'Higiene antes de dormir' },
    { id: 'pijama', name: 'Vestir Pijama', icon: '👕', period: 'noite', description: 'Roupa de dormir' },
    { id: 'historia', name: 'Ouvir História', icon: '📖', period: 'noite', description: 'História para dormir' },
    { id: 'dormir', name: 'Dormir', icon: '😴', period: 'noite', description: 'Hora de descansar' },
    { id: 'lua', name: 'Ver a Lua', icon: '🌙', period: 'noite', description: 'Observar o céu' },
    { id: 'sonhar', name: 'Sonhar', icon: '💭', period: 'noite', description: 'Ter bons sonhos' },
];

// Horários sugeridos
const suggestedTimes = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
    '22:00'
];

// Componente de carta arrastável
const DraggableCard = ({ 
    activity, 
    isDragging, 
    onDragStart, 
    onDragEnd, 
    isPlaced, 
    isCorrect,
    onDuplicate,
    showTime,
    onTimeChange,
    onRemove
}: {
    activity: RoutineActivity;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    isPlaced: boolean;
    isCorrect: boolean | null;
    onDuplicate?: (activity: Activity) => void;
    showTime?: boolean;
    onTimeChange?: (id: string, time: string) => void;
    onRemove?: (id: string) => void;
}) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('activityId', activity.id);
        onDragStart(e);
    };

    return (
        <div
            draggable={!isPlaced && !showTime}
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
            className={`
                relative p-4 rounded-xl transition-all transform select-none
                ${!showTime && 'cursor-move'}
                ${isDragging ? 'opacity-50 scale-95' : ''}
                ${isPlaced && !showTime ? 'cursor-not-allowed opacity-60' : !showTime ? 'hover:scale-105 hover:shadow-lg' : ''}
                ${isCorrect === true ? 'bg-green-100 border-2 border-green-500' : ''}
                ${isCorrect === false ? 'bg-red-100 border-2 border-red-500' : ''}
                ${!isPlaced && isCorrect === null ? 'bg-white border-2 border-gray-300 shadow-md' : ''}
                ${showTime ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300' : ''}
            `}
        >
            {showTime && activity.time && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <select
                        value={activity.time}
                        onChange={(e) => onTimeChange?.(activity.id, e.target.value)}
                        className="bg-white border-2 border-blue-400 rounded-lg px-2 py-1 text-xs font-bold text-blue-600"
                    >
                        {suggestedTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
            )}
            
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
            
            {/* Botão de Duplicar */}
            {!isPlaced && onDuplicate && !showTime && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(activity);
                    }}
                    className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-6 h-6 text-xs hover:bg-blue-600 flex items-center justify-center font-bold"
                    title="Duplicar atividade"
                >
                    +2
                </button>
            )}
            
            {/* Botão de Remover (para modo rotina) */}
            {showTime && onRemove && (
                <button
                    onClick={() => onRemove(activity.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 hover:bg-red-600 flex items-center justify-center"
                    title="Remover atividade"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

// Componente de área para soltar (MODO JOGO)
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

// --- PÁGINA PRINCIPAL ---
export default function RoutinePuzzlePage() {
    const router = useRouter();
    const supabase = createClient();

    // Estados principais
    const [gameMode, setGameMode] = useState<GameMode>('menu');
    const [gameState, setGameState] = useState<GameState>('initial');
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    
    // Estados do jogo
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
    
    // Estados do modo criar rotina
    const [routineName, setRoutineName] = useState('Minha Rotina Diária');
    const [routineType, setRoutineType] = useState<'weekday' | 'weekend'>('weekday');
    const [myRoutine, setMyRoutine] = useState<RoutineActivity[]>([]);
    const [availableForRoutine, setAvailableForRoutine] = useState<Activity[]>(allActivities);
    const [viewMode, setViewMode] = useState<'edit' | 'view'>('edit');

    const levels = [
        { id: 1, name: 'Iniciante', pieces: 4, icon: '🌱', color: 'from-green-400 to-green-600' },
        { id: 2, name: 'Fácil', pieces: 6, icon: '🌿', color: 'from-blue-400 to-blue-600' },
        { id: 3, name: 'Médio', pieces: 8, icon: '🌳', color: 'from-purple-400 to-purple-600' },
        { id: 4, name: 'Difícil', pieces: 10, icon: '🌲', color: 'from-orange-400 to-orange-600' },
        { id: 5, name: 'Expert', pieces: 12, icon: '🏆', color: 'from-red-400 to-red-600' },
        { id: 6, name: 'Mestre', pieces: 15, icon: '👑', color: 'from-pink-400 to-pink-600' },
    ];

    // Timer do jogo
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameState === 'playing' && startTime > 0) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, startTime]);

    // Funções do MODO JOGO
    const startGame = () => {
        const level = levels.find(l => l.id === selectedLevel) || levels[0];
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
        
        if (gameMode === 'game') {
            if (activity.period === 'dia') {
                setIsHighlightedDay(true);
            } else {
                setIsHighlightedNight(true);
            }
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

        setAvailableActivities(prev => prev.filter(a => a.id !== activity.id));
        
        if (period === 'dia') {
            setDayActivities(prev => [...prev, activity]);
        } else {
            setNightActivities(prev => [...prev, activity]);
        }

        if (activity.period === period) {
            setScore(prev => prev + 10);
        } else {
            setErrors(prev => prev + 1);
        }

        setIsHighlightedDay(false);
        setIsHighlightedNight(false);

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
        setGameMode('menu');
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
    
    const handleDuplicateActivity = (activity: Activity) => {
        const duplicatedActivity: Activity = {
            ...activity,
            id: `${activity.id}_copy_${Date.now()}`,
            name: `${activity.name} (2)`
        };
        
        setAvailableActivities(prev => [...prev, duplicatedActivity]);
        setCurrentActivities(prev => [...prev, duplicatedActivity]);
    };
    
    // Funções do MODO CRIAR ROTINA
    const addToRoutine = (activity: Activity) => {
        const defaultTime = myRoutine.length > 0 
            ? incrementTime(myRoutine[myRoutine.length - 1].time || '07:00')
            : '07:00';
            
        const routineActivity: RoutineActivity = {
            ...activity,
            id: `${activity.id}_${Date.now()}`,
            time: defaultTime,
            duration: 30
        };
        
        setMyRoutine(prev => [...prev, routineActivity]);
    };
    
    const removeFromRoutine = (id: string) => {
        setMyRoutine(prev => prev.filter(a => a.id !== id));
    };
    
    const updateActivityTime = (id: string, time: string) => {
        setMyRoutine(prev => prev.map(a => 
            a.id === id ? { ...a, time } : a
        ).sort((a, b) => (a.time || '').localeCompare(b.time || '')));
    };
    
    const incrementTime = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + 30;
        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMinutes = totalMinutes % 60;
        return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    };
    
    const saveRoutine = async () => {
        setSalvando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                const routineData = {
                    user_id: user.id,
                    routine_name: routineName,
                    routine_type: routineType,
                    activities: myRoutine.map(a => ({
                        activity_id: a.id.split('_')[0],
                        name: a.name,
                        icon: a.icon,
                        time: a.time,
                        duration: a.duration
                    })),
                    is_active: true,
                    created_at: new Date().toISOString()
                };
                
                const { error } = await supabase
                    .from('daily_routines')
                    .insert([routineData]);
                    
                if (error) {
                    console.error('Erro ao salvar rotina:', error);
                    alert('Erro ao salvar rotina. Tente novamente.');
                } else {
                    alert('Rotina salva com sucesso!');
                    setViewMode('view');
                }
            }
        } catch (error) {
            console.error('Erro ao salvar rotina:', error);
            alert('Erro ao salvar rotina. Tente novamente.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <GameHeader 
                title={gameMode === 'game' ? "Quebrando a Rotina" : gameMode === 'create_routine' ? "Criar Minha Rotina" : "Rotina Diária"}
                icon={gameMode === 'create_routine' ? <Calendar className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                onSave={gameMode === 'game' && gameState === 'finished' ? handleSaveSession : gameMode === 'create_routine' ? saveRoutine : undefined}
                isSaveDisabled={salvando}
                showSaveButton={(gameMode === 'game' && gameState === 'finished') || (gameMode === 'create_routine' && myRoutine.length > 0)}
            />

            <main className="p-4 sm:p-6 max-w-7xl mx-auto">
                {/* MENU PRINCIPAL - Escolha do Modo */}
                {gameMode === 'menu' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                                🎯 Escolha o Modo
                            </h2>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Modo Jogo */}
                                <button
                                    onClick={() => setGameMode('game')}
                                    className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white transition-all hover:scale-105 hover:shadow-2xl"
                                >
                                    <div className="relative z-10">
                                        <div className="text-6xl mb-4">🎮</div>
                                        <h3 className="text-2xl font-bold mb-2">Modo Jogo</h3>
                                        <p className="text-sm opacity-90">
                                            Teste seus conhecimentos organizando atividades entre DIA e NOITE
                                        </p>
                                        <div className="mt-4 flex justify-center gap-2">
                                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Pontuação</span>
                                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Níveis</span>
                                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Desafios</span>
                                        </div>
                                    </div>
                                </button>
                                
                                {/* Modo Criar Rotina */}
                                <button
                                    onClick={() => setGameMode('create_routine')}
                                    className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-8 text-white transition-all hover:scale-105 hover:shadow-2xl"
                                >
                                    <div className="relative z-10">
                                        <div className="text-6xl mb-4">📅</div>
                                        <h3 className="text-2xl font-bold mb-2">Criar Rotina</h3>
                                        <p className="text-sm opacity-90">
                                            Monte sua rotina diária personalizada com horários
                                        </p>
                                        <div className="mt-4 flex justify-center gap-2">
                                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Personalizar</span>
                                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Horários</span>
                                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Salvar</span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODO JOGO */}
                {gameMode === 'game' && (
                    <>
                        {/* Tela Inicial do Jogo */}
                        {gameState === 'initial' && (
                            <div className="space-y-6">
                                <button
                                    onClick={() => setGameMode('menu')}
                                    className="flex items-center text-purple-600 hover:text-purple-700 font-semibold"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Voltar ao Menu
                                </button>
                                
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
                                                Arraste cada carta para a área correta.
                                            </p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                                            <h3 className="font-bold text-green-800 mb-2">⭐ Pontuação</h3>
                                            <p className="text-sm text-gray-700">
                                                Ganhe pontos por acertos!
                                            </p>
                                        </div>
                                    </div>
                                </div>

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
                                                onDuplicate={handleDuplicateActivity}
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

                        {/* Tela Final do Jogo */}
                        {gameState === 'finished' && (
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Parabéns!</h2>
                                    
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
                    </>
                )}

                {/* MODO CRIAR ROTINA */}
                {gameMode === 'create_routine' && (
                    <div className="space-y-6">
                        <button
                            onClick={() => {
                                setGameMode('menu');
                                setMyRoutine([]);
                                setViewMode('edit');
                            }}
                            className="flex items-center text-purple-600 hover:text-purple-700 font-semibold"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Voltar ao Menu
                        </button>

                        {/* Configurações da Rotina */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    📅 {viewMode === 'edit' ? 'Criar' : 'Visualizar'} Rotina
                                </h2>
                                <button
                                    onClick={() => setViewMode(viewMode === 'edit' ? 'view' : 'edit')}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                                >
                                    {viewMode === 'edit' ? <Eye className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                                    {viewMode === 'edit' ? 'Visualizar' : 'Editar'}
                                </button>
                            </div>
                            
                            {viewMode === 'edit' && (
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome da Rotina
                                        </label>
                                        <input
                                            type="text"
                                            value={routineName}
                                            onChange={(e) => setRoutineName(e.target.value)}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                                            placeholder="Ex: Minha Rotina Escolar"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipo de Rotina
                                        </label>
                                        <select
                                            value={routineType}
                                            onChange={(e) => setRoutineType(e.target.value as 'weekday' | 'weekend')}
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                                        >
                                            <option value="weekday">Dia de Semana</option>
                                            <option value="weekend">Fim de Semana</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Área da Rotina */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Minha Rotina */}
                            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-green-600" />
                                    Minha Rotina
                                </h3>
                                
                                {viewMode === 'view' && myRoutine.length > 0 ? (
                                    <div className="space-y-2">
                                        {myRoutine.map((activity) => (
                                            <div key={activity.id} className="flex items-center gap-3 bg-white rounded-lg p-3">
                                                <span className="text-lg font-bold text-blue-600">{activity.time}</span>
                                                <span className="text-2xl">{activity.icon}</span>
                                                <span className="text-sm font-medium">{activity.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : viewMode === 'edit' ? (
                                    <div className="space-y-3">
                                        {myRoutine.length === 0 ? (
                                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                                <p className="text-gray-500">
                                                    Clique nas atividades ao lado para adicionar à rotina
                                                </p>
                                            </div>
                                        ) : (
                                            myRoutine.map((activity) => (
                                                <DraggableCard
                                                    key={activity.id}
                                                    activity={activity}
                                                    isDragging={false}
                                                    onDragStart={() => {}}
                                                    onDragEnd={() => {}}
                                                    isPlaced={false}
                                                    isCorrect={null}
                                                    showTime={true}
                                                    onTimeChange={updateActivityTime}
                                                    onRemove={removeFromRoutine}
                                                />
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Nenhuma atividade adicionada ainda</p>
                                    </div>
                                )}
                            </div>

                            {/* Atividades Disponíveis */}
                            {viewMode === 'edit' && (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Plus className="w-6 h-6 text-blue-600" />
                                        Atividades Disponíveis
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto">
                                        {availableForRoutine.map(activity => (
                                            <button
                                                key={activity.id}
                                                onClick={() => addToRoutine(activity)}
                                                className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:scale-105 transition-all border-2 border-gray-200 hover:border-blue-300"
                                            >
                                                <div className="text-3xl text-center mb-2">{activity.icon}</div>
                                                <div className="text-xs font-semibold text-center text-gray-700">
                                                    {activity.name}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Visualização em Lista */}
                            {viewMode === 'view' && myRoutine.length > 0 && (
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                                        📋 Resumo do Dia
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600">Total de Atividades</p>
                                            <p className="text-2xl font-bold text-blue-600">{myRoutine.length}</p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600">Início do Dia</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {myRoutine[0]?.time || '--:--'}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600">Fim do Dia</p>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {myRoutine[myRoutine.length - 1]?.time || '--:--'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
