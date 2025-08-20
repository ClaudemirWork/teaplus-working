'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, RotateCcw, Save, MemoryStick, Trophy } from 'lucide-react';
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
export default function MemoryGamePlus() {
    const router = useRouter();
    const supabase = createClient();

    const [gameState, setGameState] = useState<'initial' | 'playing' | 'level_complete' | 'finished'>('initial');
    const [currentLevel, setCurrentLevel] = useState(1);
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(1);
    const [score, setScore] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(120);
    const [cards, setCards] = useState<string[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [salvando, setSalvando] = useState(false);

    const symbols = ['🌟', '🎯', '🔥', '⚡', '🚀', '🎨', '🎭', '💡', '🔮', '🎲'];
    
    const niveis = [
        { id: 1, nome: "Nível 1", dificuldade: "Básico (12)", duracao: 2, pares: 6, grid: 4, icone: "😊" },
        { id: 2, nome: "Nível 2", dificuldade: "Médio (16)", duracao: 2.5, pares: 8, grid: 4, icone: "🤔" },
        { id: 3, nome: "Nível 3", dificuldade: "Difícil (20)", duracao: 3, pares: 10, grid: 5, icone: "🤯" },
    ];

    const initializeGame = (level: number) => {
        const config = niveis.find(n => n.id === level);
        if (!config) return;

        const gameSymbols = symbols.slice(0, config.pares);
        const cardPairs = [...gameSymbols, ...gameSymbols];
        const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
        
        setCards(shuffledCards);
        setFlippedCards([]);
        setMatchedPairs([]);
        setMoves(0);
        setTimeRemaining(config.duracao * 60);
        setCurrentLevel(level);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (gameState === 'playing' && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(time => time - 1);
            }, 1000);
        } else if (timeRemaining === 0 && gameState === 'playing') {
            alert('Tempo esgotado! Tente novamente.');
            setGameState('finished'); // Finaliza o jogo se o tempo acabar
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameState, timeRemaining]);

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [first, second] = flippedCards;
            setMoves(prev => prev + 1);
            
            if (cards[first] === cards[second]) {
                setMatchedPairs(prev => [...prev, first, second]);
                setScore(prev => prev + 20 * currentLevel);
                setFlippedCards([]);
                
                if (matchedPairs.length + 2 === cards.length) {
                    setScore(prev => prev + timeRemaining); // Bônus de tempo
                    if (currentLevel < niveis.length) {
                        setGameState('level_complete');
                    } else {
                        setGameState('finished');
                    }
                }
            } else {
                setTimeout(() => setFlippedCards([]), 1000);
            }
        }
    }, [flippedCards, cards, matchedPairs, currentLevel, timeRemaining]);

    const startGame = () => {
        if (nivelSelecionado === null) {
            alert("Por favor, selecione um nível para começar.");
            return;
        }
        setScore(0);
        initializeGame(nivelSelecionado);
        setGameState('playing');
    };
    
    const handleNivelSelect = (nivel: any) => {
        setNivelSelecionado(nivel.id);
    };

    const nextLevel = () => {
        const nextLvl = currentLevel + 1;
        initializeGame(nextLvl);
        setGameState('playing');
    };

    const resetGame = () => {
        setGameState('initial');
        setScore(0);
        setNivelSelecionado(1);
    };

    const handleCardClick = (index: number) => {
        if (gameState !== 'playing' || flippedCards.includes(index) || matchedPairs.includes(index) || flippedCards.length === 2) {
            return;
        }
        setFlippedCards(prev => [...prev, index]);
    };
    
    const handleSaveSession = async () => {
        if (gameState !== 'finished') {
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
                nivel_final: currentLevel,
                detalhes: { jogadas: moves }
            }]);

            if (error) {
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!`);
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
    const getConfigForCurrentLevel = () => niveis.find(n => n.id === currentLevel) || niveis[0];

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Memória Plus"
                icon={<MemoryStick size={22} />}
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
                                        Encontrar todos os pares de cartas idênticas no menor tempo e com o menor número de jogadas possível.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Selecione um nível para começar.</li>
                                        <li>Clique em duas cartas para virá-las.</li>
                                        <li>Se as cartas forem um par, elas permanecerão viradas.</li>
                                        <li>Se não forem, elas virarão novamente. Memorize suas posições!</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                        Você ganha pontos por cada par encontrado. Um bônus é concedido com base no tempo restante ao completar um nível.
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
                                        onClick={() => handleNivelSelect(nivel)}
                                        className={`p-4 rounded-lg font-medium transition-colors ${nivelSelecionado === nivel.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                    >
                                        <div className="text-2xl mb-1">{nivel.icone}</div>
                                        <div className="text-sm">{nivel.nome}</div>
                                        <div className="text-xs opacity-80">{`${nivel.dificuldade} cartas (${nivel.duracao}min)`}</div>
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

                {(gameState === 'playing' || gameState === 'level_complete' || gameState === 'finished') && (
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
                        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                            <div className="flex items-center gap-4">
                                <span className="bg-purple-100 text-purple-800 font-medium px-4 py-2 rounded-lg">Nível {currentLevel}/{niveis.length}</span>
                                <span className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">Pontos: {score}</span>
                                <span className="bg-yellow-100 text-yellow-800 font-medium px-4 py-2 rounded-lg">Jogadas: {moves}</span>
                            </div>
                            <div className="bg-red-100 text-red-800 font-medium px-4 py-2 rounded-lg">
                                Tempo: {formatTime(timeRemaining)}
                            </div>
                        </div>

                        {gameState === 'level_complete' && (
                             <div className="text-center mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                 <Trophy className="mx-auto text-green-600 mb-2" size={32} />
                                 <h3 className="text-xl font-semibold text-green-800 mb-2">Nível {currentLevel} Concluído!</h3>
                                 <button onClick={nextLevel} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                     Ir para o Próximo Nível
                                 </button>
                             </div>
                        )}

                        {gameState === 'finished' && (
                             <div className="text-center mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                 <Trophy className="mx-auto text-yellow-600 mb-2" size={32} />
                                 <h3 className="text-xl font-semibold text-yellow-800 mb-2">🎉 Jogo Concluído!</h3>
                                 <p className="text-yellow-700">Pontuação Final: {score} pontos</p>
                             </div>
                        )}

                        <div 
                            className="grid gap-3 mx-auto"
                            style={{ gridTemplateColumns: `repeat(${getConfigForCurrentLevel().grid}, minmax(0, 1fr))` }}
                        >
                            {cards.map((symbol, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleCardClick(index)}
                                    className={`aspect-square rounded-lg border-2 text-3xl sm:text-4xl font-bold transition-all duration-300 flex items-center justify-center ${
                                        isCardVisible(index)
                                            ? matchedPairs.includes(index)
                                                ? 'bg-green-100 border-green-400 text-green-800 cursor-default'
                                                : 'bg-blue-100 border-blue-400 text-blue-800'
                                            : 'bg-gray-200 border-gray-300 hover:bg-gray-300 text-transparent'
                                    }`}
                                    disabled={gameState !== 'playing'}
                                >
                                    {isCardVisible(index) ? symbol : '?' }
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-center space-x-4 mt-6">
                            <button
                                onClick={resetGame}
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
