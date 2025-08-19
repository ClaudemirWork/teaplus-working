'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, RotateCcw, Trophy, Brain, Target } from 'lucide-react';

// Defines the properties of the game state
interface GameState {
  board: ('X' | 'O' | null)[];
  currentPlayer: 'X' | 'O';
  status: 'playing' | 'winner-X' | 'winner-O' | 'draw' | 'idle';
  currentProblem: { a: number; b: number; question: string; answer: number } | null;
  scoreX: number;
  scoreO: number;
}

// Defines the properties for the component
interface Props {
  initialState?: GameState;
}

export default function MultiplicationGame({ initialState }: Props) {
  // Constants for the board size
  const BOARD_SIZE = 9;

  // State hooks for managing the game
  const [gameState, setGameState] = useState<GameState>(
    initialState || {
      board: Array(BOARD_SIZE).fill(null),
      currentPlayer: 'X',
      status: 'idle',
      currentProblem: null,
      scoreX: 0,
      scoreO: 0,
    }
  );
  const [message, setMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);

  // Generates a new multiplication problem
  const generateProblem = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const answer = a * b;
    const question = `${a} x ${b}`;
    return { a, b, question, answer };
  };

  // Handles starting a new game
  const handleStartGame = () => {
    const newProblem = generateProblem();
    setGameState({
      board: Array(BOARD_SIZE).fill(null),
      currentPlayer: 'X',
      status: 'playing',
      currentProblem: newProblem,
      scoreX: gameState.scoreX,
      scoreO: gameState.scoreO,
    });
    setMessage('');
    setFeedbackType(null);
  };

  // Resets the game to the initial state
  const handleResetGame = () => {
    setGameState({
      board: Array(BOARD_SIZE).fill(null),
      currentPlayer: 'X',
      status: 'idle',
      currentProblem: null,
      scoreX: 0,
      scoreO: 0,
    });
    setMessage('');
    setFeedbackType(null);
  };

  // Checks for a winner or a draw
  const checkWinner = (board: ('X' | 'O' | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    if (board.every(cell => cell !== null)) {
      return 'draw';
    }
    return null;
  };

  // Handles a cell click on the board
  const handleCellClick = (index: number) => {
    if (gameState.status !== 'playing' || gameState.board[index]) return;

    // Show a small message or modal for the user to answer the multiplication problem
    // A simple prompt is used for demonstration, but a custom UI would be better
    const userAnswer = window.prompt(`Qual o resultado de ${gameState.currentProblem?.question}?`);
    
    // Check if the user's answer is correct
    if (userAnswer && parseInt(userAnswer, 10) === gameState.currentProblem?.answer) {
      // If correct, update the board and check for a winner
      const newBoard = [...gameState.board];
      newBoard[index] = gameState.currentPlayer;

      const winner = checkWinner(newBoard);
      
      if (winner) {
        if (winner === 'draw') {
          setMessage('Empate! O jogo recomeçará em breve.');
          setFeedbackType(null);
          setGameState(prev => ({ ...prev, board: newBoard, status: 'draw' }));
        } else {
          setMessage(`Jogador ${winner} venceu!`);
          setFeedbackType('success');
          setGameState(prev => ({
            ...prev,
            board: newBoard,
            status: winner === 'X' ? 'winner-X' : 'winner-O',
            scoreX: winner === 'X' ? prev.scoreX + 1 : prev.scoreX,
            scoreO: winner === 'O' ? prev.scoreO + 1 : prev.scoreO,
          }));
        }
      } else {
        // If no winner, switch turns and generate a new problem
        const nextPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        const newProblem = generateProblem();
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: nextPlayer,
          currentProblem: newProblem,
        }));
        setFeedbackType('success');
        setMessage('Resposta correta!');
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 1500);
      }
    } else {
      // If incorrect, provide feedback
      setMessage('Resposta incorreta! Tente novamente.');
      setFeedbackType('error');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>← Voltar</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 rounded-full bg-purple-500 text-white font-medium flex items-center space-x-2">
                <Brain size={16} />
                <span>Jogo da Multiplicação</span>
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
              <Brain className="mr-3 text-purple-600" size={40} />
              Jogo da Multiplicação
            </h1>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Objetivo */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-purple-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <Target size={20} className="mr-2" /> Objetivo
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Seja o primeiro a conseguir uma sequência de três peças (X ou O) na horizontal, vertical ou diagonal, respondendo corretamente às questões de multiplicação.
                </p>
              </div>
            </div>

            {/* Curiosidades */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <Brain size={20} className="mr-2" /> Curiosidades
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Este jogo estimula o raciocínio lógico, a memória e a agilidade mental, transformando a prática da tabuada em uma atividade divertida e interativa.
                </p>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            {/* Game Status Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 text-center md:text-left space-y-4 md:space-y-0">
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold">Placar</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-blue-600">X: {gameState.scoreX}</div>
                  <div className="text-3xl font-bold text-red-600">O: {gameState.scoreO}</div>
                </div>
              </div>
              <div className="text-center">
                {gameState.status === 'playing' && (
                  <>
                    <p className="text-lg font-medium text-gray-600">Vez do jogador <span className={`font-bold text-${gameState.currentPlayer === 'X' ? 'blue' : 'red'}-600`}>{gameState.currentPlayer}</span></p>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mt-2 rounded-lg">
                      <p className="font-bold">Problema:</p>
                      <p className="text-2xl font-semibold mt-1">{gameState.currentProblem?.question}</p>
                    </div>
                  </>
                )}
                {gameState.status.startsWith('winner') && (
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg flex items-center justify-center space-x-2">
                    <Trophy size={24} />
                    <span className="font-bold text-lg">{message}</span>
                  </div>
                )}
                {gameState.status === 'draw' && (
                  <div className="bg-gray-100 border-l-4 border-gray-500 text-gray-800 p-4 rounded-lg flex items-center justify-center space-x-2">
                    <span className="font-bold text-lg">{message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Board and Controls */}
            {gameState.status !== 'playing' ? (
              <div className="text-center">
                <p className="text-gray-600 mb-6">{gameState.status === 'idle' ? 'Clique em Iniciar Jogo para começar!' : 'Clique em Reiniciar Jogo para começar uma nova rodada.'}</p>
                <button
                  onClick={gameState.status === 'idle' ? handleStartGame : handleResetGame}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium transition-colors mx-auto"
                >
                  {gameState.status === 'idle' ? <Play size={20} /> : <RotateCcw size={20} />}
                  <span>{gameState.status === 'idle' ? 'Iniciar Jogo' : 'Reiniciar Jogo'}</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto">
                  {gameState.board.map((cell, index) => (
                    <button
                      key={index}
                      className={`
                        w-24 h-24 sm:w-32 sm:h-32 rounded-lg flex items-center justify-center text-5xl font-bold transition-all duration-200
                        ${cell ? 'cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 cursor-pointer'}
                        ${cell === 'X' ? 'bg-blue-500 text-white' : ''}
                        ${cell === 'O' ? 'bg-red-500 text-white' : ''}
                      `}
                      onClick={() => handleCellClick(index)}
                      disabled={cell !== null}
                    >
                      {cell}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Scientific Basis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              🧬 Base Científica:
            </h2>
            <p className="text-gray-700 leading-relaxed">
              O "Jogo da Multiplicação" é baseado em princípios de gamificação e aprendizado ativo, que comprovadamente melhoram a retenção de conhecimento. A repetição espaçada das operações matemáticas, combinada com a tomada de decisões estratégicas (qual célula marcar), ajuda a solidificar o conhecimento da tabuada enquanto desenvolve o pensamento lógico.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
