'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Pause, RotateCcw, Navigation, Timer, Target, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export default function MentalMaze() {
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [moves, setMoves] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Maze configurations for different levels
  const mazes = {
    1: {
      size: 7,
      grid: [
        [1,1,1,1,1,1,1],
        [1,0,0,0,1,0,1],
        [1,0,1,0,1,0,1],
        [1,0,1,0,0,0,1],
        [1,0,1,1,1,0,1],
        [1,0,0,0,0,2,1],
        [1,1,1,1,1,1,1]
      ],
      start: { x: 1, y: 1 },
      end: { x: 5, y: 5 },
      timeBonus: 100
    },
    2: {
      size: 9,
      grid: [
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,0,1,0,1],
        [1,0,1,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,1],
        [1,1,1,0,1,1,1,0,1],
        [1,0,0,0,1,0,0,2,1],
        [1,1,1,1,1,1,1,1,1]
      ],
      start: { x: 1, y: 1 },
      end: { x: 7, y: 7 },
      timeBonus: 150
    },
    3: {
      size: 11,
      grid: [
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,1],
        [1,1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,2,1],
        [1,1,1,1,1,1,1,1,1,1,1]
      ],
      start: { x: 1, y: 1 },
      end: { x: 9, y: 9 },
      timeBonus: 200
    }
  };

  const currentMaze = mazes[level as keyof typeof mazes];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && timeRemaining > 0 && !levelCompleted) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsPlaying(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeRemaining, levelCompleted]);

  const initializeLevel = useCallback(() => {
    const maze = mazes[level as keyof typeof mazes];
    setPlayerPosition(maze.start);
    setMoves(0);
    setLevelCompleted(false);
    setTimeRemaining(120);
  }, [level]);

  useEffect(() => {
    initializeLevel();
  }, [level, initializeLevel]);

  const startActivity = () => {
    setIsPlaying(true);
    setScore(0);
    setLevel(1);
    setGameCompleted(false);
    initializeLevel();
  };

  const pauseActivity = () => {
    setIsPlaying(false);
  };

  const resetActivity = () => {
    setIsPlaying(false);
    setScore(0);
    setLevel(1);
    setGameCompleted(false);
    initializeLevel();
  };

  const movePlayer = useCallback((direction: string) => {
    if (!isPlaying || levelCompleted) return;

    const newPosition = { ...playerPosition };
    
    switch(direction) {
      case 'up':
        newPosition.y = Math.max(0, newPosition.y - 1);
        break;
      case 'down':
        newPosition.y = Math.min(currentMaze.size - 1, newPosition.y + 1);
        break;
      case 'left':
        newPosition.x = Math.max(0, newPosition.x - 1);
        break;
      case 'right':
        newPosition.x = Math.min(currentMaze.size - 1, newPosition.x + 1);
        break;
    }

    // Check if the new position is valid (not a wall)
    if (currentMaze.grid[newPosition.y][newPosition.x] !== 1) {
      setPlayerPosition(newPosition);
      setMoves(prev => prev + 1);

      // Check if player reached the end
      if (newPosition.x === currentMaze.end.x && newPosition.y === currentMaze.end.y) {
        setLevelCompleted(true);
        const timeBonus = currentMaze.timeBonus + Math.floor(timeRemaining / 5) * 10;
        const moveBonus = Math.max(0, 100 - moves * 2);
        setScore(prev => prev + timeBonus + moveBonus);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, levelCompleted, playerPosition, currentMaze, timeRemaining, moves]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch(event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  const nextLevel = () => {
    if (level < 3) {
      setLevel(prev => prev + 1);
      setIsPlaying(true);
    } else {
      setGameCompleted(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCellClass = (x: number, y: number) => {
    const cellValue = currentMaze.grid[y][x];
    
    if (playerPosition.x === x && playerPosition.y === y) {
      return 'bg-blue-500 border-blue-600'; // Player position
    } else if (x === currentMaze.end.x && y === currentMaze.end.y) {
      return 'bg-green-500 border-green-600'; // End position
    } else if (cellValue === 1) {
      return 'bg-gray-800 border-gray-900'; // Wall
    } else {
      return 'bg-white border-gray-300'; // Path
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Voltar ao Dashboard</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 rounded-full bg-purple-500 text-white font-medium flex items-center space-x-2">
                <Navigation size={16} />
                <span>Labirinto Mental</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <Navigation className="mr-3 text-purple-600" size={40} />
              Labirinto Mental
            </h1>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Objetivo */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-red-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  🎯 Objetivo:
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Navegue pelo labirinto encontrando o caminho da posição azul (início) até a posição verde (fim). Desenvolva planejamento espacial, memória de trabalho e função executiva.
                </p>
              </div>
            </div>

            {/* Pontuação */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  👥 Pontuação:
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Bônus de tempo: +10 pontos por cada 5 segundos restantes. Bônus de eficiência: +100 pontos menos 2 por movimento. Bônus de conclusão: Nível 1 (+100), Nível 2 (+150), Nível 3 (+200).
                </p>
              </div>
            </div>

            {/* Níveis */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-purple-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  📊 Níveis:
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <p><strong className="text-purple-600">Nível 1:</strong> Labirinto 7x7 - Caminho direto (fácil)</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> Labirinto 9x9 - Múltiplos caminhos (médio)</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> Labirinto 11x11 - Complexo (difícil)</p>
                </div>
              </div>
            </div>

            {/* Final */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-green-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  🏁 Final:
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Complete todos os 3 labirintos dentro do tempo limite de 2 minutos cada para finalizar com sucesso. Use teclas direcionais ou botões para navegar.
                </p>
              </div>
            </div>
          </div>

          {/* Game Area */}
          {isPlaying || levelCompleted || gameCompleted ? (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {/* Game Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 px-4 py-2 rounded-lg">
                    <span className="text-purple-800 font-medium">Nível {level}/3</span>
                  </div>
                  <div className="bg-blue-100 px-4 py-2 rounded-lg">
                    <span className="text-blue-800 font-medium">Pontos: {score}</span>
                  </div>
                  <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                    <span className="text-yellow-800 font-medium">Movimentos: {moves}</span>
                  </div>
                </div>
                <div className="bg-red-100 px-4 py-2 rounded-lg flex items-center">
                  <Timer className="mr-2 text-red-600" size={16} />
                  <span className="text-red-800 font-medium">{formatTime(timeRemaining)}</span>
                </div>
              </div>

              {/* Level/Game Completed */}
              {(levelCompleted || gameCompleted) && (
                <div className="text-center mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Trophy className="mx-auto text-green-600 mb-2" size={32} />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    {gameCompleted ? 'Jogo Completo!' : `Nível ${level} Concluído!`}
                  </h3>
                  <p className="text-green-700 mb-4">
                    {gameCompleted 
                      ? `Parabéns! Pontuação final: ${score} pontos` 
                      : `Você completou o labirinto em ${moves} movimentos!`
                    }
                  </p>
                  {!gameCompleted && level < 3 && (
                    <button
                      onClick={nextLevel}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Próximo Nível
                    </button>
                  )}
                </div>
              )}

              {/* Maze Grid */}
              <div className="mb-6">
                <div className="flex justify-center">
                  <div 
                    className="grid gap-1 p-4 bg-gray-100 rounded-lg"
                    style={{ 
                      gridTemplateColumns: `repeat(${currentMaze.size}, 1fr)`,
                      maxWidth: '400px'
                    }}
                  >
                    {currentMaze.grid.map((row, y) =>
                      row.map((cell, x) => (
                        <div
                          key={`${x}-${y}`}
                          className={`w-8 h-8 border-2 rounded ${getCellClass(x, y)} transition-colors duration-200`}
                        >
                          {playerPosition.x === x && playerPosition.y === y && (
                            <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                              👤
                            </div>
                          )}
                          {x === currentMaze.end.x && y === currentMaze.end.y && playerPosition.x !== x && (
                            <div className="w-full h-full flex items-center justify-center text-white text-sm">
                              🏁
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">Use as teclas direcionais ou os botões abaixo para mover</p>
                <div className="flex justify-center">
                  <div className="grid grid-cols-3 gap-2 max-w-48">
                    <div></div>
                    <button
                      onClick={() => movePlayer('up')}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
                      disabled={!isPlaying || levelCompleted}
                    >
                      <ArrowUp size={20} />
                    </button>
                    <div></div>
                    <button
                      onClick={() => movePlayer('left')}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
                      disabled={!isPlaying || levelCompleted}
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      onClick={() => movePlayer('down')}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
                      disabled={!isPlaying || levelCompleted}
                    >
                      <ArrowDown size={20} />
                    </button>
                    <button
                      onClick={() => movePlayer('right')}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
                      disabled={!isPlaying || levelCompleted}
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={pauseActivity}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  disabled={levelCompleted || gameCompleted}
                >
                  <Pause size={20} />
                  <span>Pausar</span>
                </button>
                <button
                  onClick={resetActivity}
                  className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <RotateCcw size={20} />
                  <span>Reiniciar</span>
                </button>
              </div>
            </div>
          ) : (
            /* Start Screen */
            <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-6">
              <div className="text-6xl mb-4">🧩</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Pronto para navegar pelo labirinto?
              </h3>
              <p className="text-gray-600 mb-6">
                Clique em "Iniciar Navegação" para começar o desafio de planejamento espacial
              </p>
              <button
                onClick={startActivity}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium transition-colors mx-auto"
              >
                <Play size={20} />
                <span>Iniciar Navegação</span>
              </button>
            </div>
          )}

          {/* Base Científica */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              🧬 Base Científica:
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Este exercício é baseado em pesquisas sobre navegação espacial e funções executivas. 
              Estimula o hipocampo (navegação espacial), córtex pré-frontal (planejamento) e lobo parietal (processamento visuoespacial). 
              Desenvolve especificamente habilidades de planejamento, memória de trabalho espacial e flexibilidade cognitiva, áreas frequentemente comprometidas no TDAH.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}