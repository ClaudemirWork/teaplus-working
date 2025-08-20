'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Trophy, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Navigation, ArrowRightCircle } from 'lucide-react';
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
export default function MentalMaze() {
    const router = useRouter();
    const supabase = createClient();
    
    const [gameState, setGameState] = useState<'initial' | 'playing' | 'paused' | 'level_complete' | 'finished'>('initial');
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(1);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(120);
    const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
    const [moves, setMoves] = useState(0);
    const [salvando, setSalvando] = useState(false);

    // --- NÍVEIS AJUSTADOS PARA 5 ---
    const niveis = [
        { id: 1, nome: "Nível 1", dificuldade: "Labirinto 7x7", size: 7, grid: [[1,1,1,1,1,1,1],[1,0,0,0,1,0,1],[1,0,1,0,1,0,1],[1,0,1,0,0,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,2,1],[1,1,1,1,1,1,1]], start: { x: 1, y: 1 }, end: { x: 5, y: 5 }, timeBonus: 100, timeLimit: 120, icone: "1️⃣" },
        { id: 2, nome: "Nível 2", dificuldade: "Labirinto 9x9", size: 9, grid: [[1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,1],[1,0,1,0,1,0,1,0,1],[1,0,1,0,0,0,1,0,1],[1,0,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,1],[1,1,1,0,1,1,1,0,1],[1,0,0,0,1,0,0,2,1],[1,1,1,1,1,1,1,1,1]], start: { x: 1, y: 1 }, end: { x: 7, y: 7 }, timeBonus: 150, timeLimit: 150, icone: "2️⃣" },
        { id: 3, nome: "Nível 3", dificuldade: "Labirinto 11x11", size: 11, grid: [[1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,0,0,1],[1,0,1,0,1,0,1,1,1,0,1],[1,0,1,0,0,0,0,0,1,0,1],[1,0,1,1,1,1,1,0,1,0,1],[1,0,0,0,0,0,1,0,0,0,1],[1,1,1,1,1,0,1,1,1,0,1],[1,0,0,0,0,0,0,0,1,0,1],[1,0,1,1,1,1,1,0,1,0,1],[1,0,0,0,0,0,0,0,0,2,1],[1,1,1,1,1,1,1,1,1,1,1]], start: { x: 1, y: 1 }, end: { x: 9, y: 9 }, timeBonus: 200, timeLimit: 180, icone: "3️⃣" },
        { id: 4, nome: "Nível 4", dificuldade: "Labirinto 13x13", size: 13, grid: [[1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,1,1,0,1],[1,0,1,0,0,0,1,0,1,0,0,0,1],[1,0,1,0,1,1,1,0,1,0,1,0,1],[1,0,1,0,1,0,0,0,1,0,1,0,1],[1,0,1,1,1,0,1,1,1,1,1,0,1],[1,0,0,0,1,0,0,0,0,0,1,0,1],[1,1,1,0,1,1,1,1,1,0,1,0,1],[1,0,0,0,0,0,1,0,0,0,1,0,1],[1,0,1,1,1,0,1,0,1,1,1,0,1],[1,0,0,0,1,0,0,0,1,0,0,2,1],[1,1,1,1,1,1,1,1,1,1,1,1,1]], start: { x: 1, y: 1 }, end: { x: 11, y: 11 }, timeBonus: 250, timeLimit: 210, icone: "4️⃣" },
        { id: 5, nome: "Nível 5", dificuldade: "Labirinto 15x15", size: 15, grid: [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,1,0,0,0,0,0,1,0,0,0,0,0,1],[1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],[1,0,0,0,1,0,1,0,1,0,1,0,0,0,1],[1,0,1,1,1,0,1,0,1,1,1,0,1,1,1],[1,0,1,0,0,0,1,0,0,0,1,0,1,0,1],[1,1,1,0,1,1,1,1,1,0,1,0,1,0,1],[1,0,0,0,1,0,0,0,1,0,1,0,1,0,1],[1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],[1,0,1,0,0,0,1,0,0,0,1,0,0,0,1],[1,0,1,1,1,1,1,1,1,0,1,0,1,1,1],[1,0,0,0,1,0,0,0,1,0,1,0,1,0,1],[1,0,1,1,1,0,1,0,1,0,1,0,1,0,1],[1,0,0,0,1,0,0,0,1,0,0,0,0,2,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]], start: { x: 1, y: 1 }, end: { x: 13, y: 13 }, timeBonus: 300, timeLimit: 240, icone: "5️⃣" }
    ];

    const currentMaze = niveis.find(n => n.id === currentLevel) || niveis[0];

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (gameState === 'playing' && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(time => time - 1);
            }, 1000);
        } else if (timeRemaining === 0 && gameState === 'playing') {
            setGameState('finished');
        }
        return () => { if (interval) clearInterval(interval); };
    }, [gameState, timeRemaining]);

    const initializeLevel = useCallback((level: number) => {
        const maze = niveis.find(n => n.id === level) || niveis[0];
        setPlayerPosition(maze.start);
        setMoves(0);
        setTimeRemaining(maze.timeLimit);
    }, [niveis]);

    const startGame = () => {
        if (nivelSelecionado === null) return;
        setCurrentLevel(nivelSelecionado);
        setScore(0);
        initializeLevel(nivelSelecionado);
        setGameState('playing');
    };
    
    const movePlayer = useCallback((direction: string) => {
        if (gameState !== 'playing') return;

        const newPosition = { ...playerPosition };
        
        if (direction === 'up') newPosition.y = Math.max(0, newPosition.y - 1);
        if (direction === 'down') newPosition.y = Math.min(currentMaze.size - 1, newPosition.y + 1);
        if (direction === 'left') newPosition.x = Math.max(0, newPosition.x - 1);
        if (direction === 'right') newPosition.x = Math.min(currentMaze.size - 1, newPosition.x + 1);

        if (currentMaze.grid[newPosition.y][newPosition.x] !== 1) {
            setPlayerPosition(newPosition);
            setMoves(prev => prev + 1);

            if (newPosition.x === currentMaze.end.x && newPosition.y === currentMaze.end.y) {
                const timeBonus = currentMaze.timeBonus + Math.floor(timeRemaining / 5) * 10;
                const moveBonus = Math.max(0, 100 - moves * 2);
                setScore(prev => prev + timeBonus + moveBonus);
                if (currentLevel < niveis.length) {
                    setGameState('level_complete');
                } else {
                    setGameState('finished');
                }
            }
        }
    }, [gameState, playerPosition, currentMaze, timeRemaining, moves, currentLevel, niveis.length]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const keyMap: { [key: string]: string } = {
                'ArrowUp': 'up', 'w': 'up', 'W': 'up',
                'ArrowDown': 'down', 's': 'down', 'S': 'down',
                'ArrowLeft': 'left', 'a': 'left', 'A': 'left',
                'ArrowRight': 'right', 'd': 'right', 'D': 'right'
            };
            const direction = keyMap[event.key];
            if (direction) {
                event.preventDefault();
                movePlayer(direction);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [movePlayer]);

    const startNextLevel = () => {
        const nextLevelId = currentLevel + 1;
        setCurrentLevel(nextLevelId);
        initializeLevel(nextLevelId);
        setGameState('playing');
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

    const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

    const getCellClass = (x: number, y: number) => {
        if (playerPosition.x === x && playerPosition.y === y) return 'bg-blue-500';
        if (x === currentMaze.end.x && y === currentMaze.end.y) return 'bg-green-500';
        return currentMaze.grid[y][x] === 1 ? 'bg-gray-800' : 'bg-gray-100';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Labirinto Mental"
                icon={<Navigation size={22} />}
                onSave={handleSaveSession}
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
                                        Navegar pelo labirinto do início ao fim no menor tempo possível. Exercita o planejamento espacial e a memória de trabalho.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Use as setas do teclado ou os botões na tela para se mover.</li>
                                        <li>O seu personagem é o círculo azul (ou emoji).</li>
                                        <li>Encontre a saída (verde) para completar o nível.</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                       Sua pontuação é baseada na rapidez e eficiência (menos movimentos). Este exercício estimula áreas do cérebro responsáveis pela navegação e planejamento.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível do Labirinto</h2>
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
                                        <div className="text-xs opacity-80">{`${nivel.dificuldade}`}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-center pt-4">
                            <button
                                onClick={startGame}
                                disabled={nivelSelecionado === null}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                🚀 Iniciar Navegação
                            </button>
                        </div>
                    </div>
                )}

                {(gameState !== 'initial' && gameState !== 'finished') && (
                     <div className="bg-white rounded-xl shadow-lg p-6">
                         <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                             <div className="flex items-center gap-4">
                                 <span className="bg-purple-100 text-purple-800 font-medium px-4 py-2 rounded-lg">Nível {currentLevel}</span>
                                 <span className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">Pontos: {score}</span>
                                 <span className="bg-yellow-100 text-yellow-800 font-medium px-4 py-2 rounded-lg">Movimentos: {moves}</span>
                             </div>
                             <div className="bg-red-100 text-red-800 font-medium px-4 py-2 rounded-lg">
                                 Tempo: {formatTime(timeRemaining)}
                             </div>
                         </div>

                         <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                             <div className="grid gap-0.5 p-1 bg-gray-300 rounded-md" style={{ gridTemplateColumns: `repeat(${currentMaze.size}, 1fr)` }}>
                                 {currentMaze.grid.map((row, y) =>
                                     row.map((cell, x) => (
                                         <div key={`${x}-${y}`} className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-sm ${getCellClass(x, y)}`}>
                                             {playerPosition.x === x && playerPosition.y === y && ('👤')}
                                             {x === currentMaze.end.x && y === currentMaze.end.y && playerPosition.x !== x && ('🏁')}
                                         </div>
                                     ))
                                 )}
                             </div>
                             <div className="grid grid-cols-3 gap-2 w-48">
                                 <div />
                                 <button onClick={() => movePlayer('up')} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"><ArrowUp /></button>
                                 <div />
                                 <button onClick={() => movePlayer('left')} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"><ArrowLeft /></button>
                                 <button onClick={() => movePlayer('down')} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"><ArrowDown /></button>
                                 <button onClick={() => movePlayer('right')} className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"><ArrowRight /></button>
                             </div>
                         </div>
                     </div>
                )}
                
                {(gameState === 'level_complete' || gameState === 'finished') && (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
                        <Trophy className="mx-auto text-yellow-500 mb-4" size={48}/>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {gameState === 'finished' && timeRemaining === 0 ? "Tempo Esgotado!" : 
                             gameState === 'finished' ? "Parabéns, Jogo Concluído!" : 
                             `Nível ${currentLevel} Concluído!`}
                        </h2>
                        <p className="text-gray-600 mb-6">Sua pontuação total é {score}.</p>
                        
                        {gameState === 'level_complete' ? (
                            <button onClick={startNextLevel} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto">
                                <ArrowRightCircle size={20}/>
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
