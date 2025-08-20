'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Pause, RotateCcw, Brain, Timer, Trophy, Save, MemoryStick } from 'lucide-react';
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

export default function MemoryGamePlus() {
    const router = useRouter();
    const supabase = createClient();

    const [level, setLevel] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(180);
    const [cards, setCards] = useState<string[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const symbols = ['🌟', '🎯', '🔥', '⚡', '🚀', '🎨', '🎭', '💡', '🔮', '🎲'];
    
    const getLevelConfig = (lvl: number) => {
        switch(lvl) {
            case 1: return { pairs: 6, gridCols: 4, time: 120 }; // 12 cards
            case 2: return { pairs: 8, gridCols: 4, time: 150 }; // 16 cards
            case 3: return { pairs: 10, gridCols: 5, time: 180 }; // 20 cards
            default: return { pairs: 6, gridCols: 4, time: 120 };
        }
    };

    const initializeGame = (lvl: number) => {
        const config = getLevelConfig(lvl);
        const gameSymbols = symbols.slice(0, config.pairs);
        const cardPairs = [...gameSymbols, ...gameSymbols];
        const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
        
        setCards(shuffledCards);
        setFlippedCards([]);
        setMatchedPairs([]);
        setMoves(0);
        setGameCompleted(false);
        setTimeRemaining(config.time);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isPlaying && timeRemaining > 0 && !gameCompleted) {
            interval = setInterval(() => {
                setTimeRemaining(time => time - 1);
            }, 1000);
        } else if (timeRemaining === 0 && isPlaying) {
            alert('Tempo esgotado! Tente novamente.');
            setIsPlaying(false);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, timeRemaining, gameCompleted]);

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [first, second] = flippedCards;
            setMoves(prev => prev + 1);
            
            if (cards[first] === cards[second]) {
                setMatchedPairs(prev => [...prev, first, second]);
                setScore(prev => prev + 20 * level);
                setFlippedCards([]);
                
                if (matchedPairs.length + 2 === cards.length) {
                    setGameCompleted(true);
                    setScore(prev => prev + getLevelConfig(level).time + Math.floor(timeRemaining / 10) * 5);
                    setIsPlaying(false);
                }
            } else {
                setTimeout(() => setFlippedCards([]), 1000);
            }
        }
    }, [flippedCards, cards, matchedPairs, level, timeRemaining]);
    

    const startActivity = () => {
        setLevel(1);
        setScore(0);
        initializeGame(1);
        setIsPlaying(true);
    };

    const resetActivity = () => {
        setIsPlaying(false);
        setScore(0);
        setLevel(1);
    };

    const handleCardClick = (index: number) => {
        if (!isPlaying || flippedCards.includes(index) || matchedPairs.includes(index) || flippedCards.length === 2) {
            return;
        }
        setFlippedCards(prev => [...prev, index]);
    };

    const nextLevel = () => {
        if (level < 3) {
            const nextLvl = level + 1;
            setLevel(nextLvl);
            initializeGame(nextLvl);
            setIsPlaying(true);
        }
    };
    
    const handleSaveSession = async () => {
        if (!gameCompleted) {
            alert('Complete o jogo antes de salvar.');
            return;
        }
        setSalvando(true);
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                alert('Sessão expirada. Por favor, faça login novamente.');
                router.push('/login');
                return;
            }
            const { error } = await supabase.from('sessoes').insert([{
                usuario_id: user.id,
                atividade_nome: 'Memória Plus',
                pontuacao_final: score,
                data_fim: new Date().toISOString(),
                observacoes: { nivel_final: level, jogadas: moves }
            }]);

            if (error) {
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!\nPontuação Final: ${score}`);
                router.push('/dashboard');
            }
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setSalvando(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isCardVisible = (index: number) => flippedCards.includes(index) || matchedPairs.includes(index);

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Memória Plus"
                icon={<MemoryStick size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={gameCompleted && level === 3}
            />
            
            <main className="p-4 sm:p-6 max-w-4xl mx-auto">
                {!isPlaying && !gameCompleted ? (
                    <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                        <div className="text-6xl mb-4">🧠</div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pronto para exercitar sua memória?</h1>
                        <p className="text-gray-600 mb-8">
                            Clique em "Iniciar Jogo" para começar o desafio com níveis progressivos.
                        </p>
                        <button
                            onClick={startActivity}
                            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors mx-auto"
                        >
                            <Play size={20} />
                            <span>Iniciar Jogo</span>
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                            <div className="flex items-center gap-4">
                                <span className="bg-purple-100 text-purple-800 font-medium px-4 py-2 rounded-lg">Nível {level}/3</span>
                                <span className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">Pontos: {score}</span>
                                <span className="bg-yellow-100 text-yellow-800 font-medium px-4 py-2 rounded-lg">Jogadas: {moves}</span>
                            </div>
                            <div className="bg-red-100 px-4 py-2 rounded-lg flex items-center">
                                <Timer className="mr-2 text-red-600" size={16} />
                                <span className="text-red-800 font-medium">{formatTime(timeRemaining)}</span>
                            </div>
                        </div>

                        {gameCompleted && (
                            <div className="text-center mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <Trophy className="mx-auto text-green-600 mb-2" size={32} />
                                <h3 className="text-xl font-semibold text-green-800 mb-2">Nível {level} Concluído!</h3>
                                {level < 3 ? (
                                    <button onClick={nextLevel} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                        Ir para o Próximo Nível
                                    </button>
                                ) : (
                                    <div>
                                        <p className="text-green-800 font-semibold text-lg mb-2">🎉 Jogo Completo!</p>
                                        <p className="text-green-700">Pontuação Final: {score} pontos</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div 
                            className="grid gap-3 mx-auto"
                            style={{ gridTemplateColumns: `repeat(${getLevelConfig(level).gridCols}, minmax(0, 1fr))` }}
                        >
                            {cards.map((symbol, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleCardClick(index)}
                                    className={`aspect-square rounded-lg border-2 text-3xl font-bold transition-all duration-300 flex items-center justify-center ${
                                        isCardVisible(index)
                                            ? matchedPairs.includes(index)
                                                ? 'bg-green-100 border-green-400 text-green-800 cursor-default'
                                                : 'bg-blue-100 border-blue-400 text-blue-800'
                                            : 'bg-gray-200 border-gray-300 hover:bg-gray-300 text-transparent'
                                    }`}
                                    disabled={!isPlaying}
                                >
                                    {isCardVisible(index) ? symbol : '?' }
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-center space-x-4 mt-6">
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
