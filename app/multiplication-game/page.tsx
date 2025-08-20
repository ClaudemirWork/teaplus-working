'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, RotateCcw, Trophy, Brain, Target, Save, ChevronRight, Calculator } from 'lucide-react';
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

interface GameState {
    board: ('X' | 'O' | null)[];
    currentPlayer: 'X' | 'O';
    status: 'playing' | 'winner-X' | 'winner-O' | 'draw' | 'idle' | 'finished';
    currentProblem: { a: number; b: number; question: string; answer: number } | null;
    scoreX: number;
    scoreO: number;
}

export default function MultiplicationGame() {
    const router = useRouter();
    const supabase = createClient();
    const BOARD_SIZE = 9;

    const [gameState, setGameState] = useState<GameState>({
        board: Array(BOARD_SIZE).fill(null),
        currentPlayer: 'X',
        status: 'idle',
        currentProblem: null,
        scoreX: 0,
        scoreO: 0,
    });
    const [currentLevel, setCurrentLevel] = useState(1);
    const [userAnswer, setUserAnswer] = useState('');
    const [showAnswerInput, setShowAnswerInput] = useState(false);
    const [currentCellIndex, setCurrentCellIndex] = useState<number | null>(null);
    const [message, setMessage] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [inicioSessao, setInicioSessao] = useState<Date | null>(null);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);

    const generateProblem = (level: number) => {
        let a, b;
        switch (level) {
            case 1: a = Math.floor(Math.random() * 10) + 1; b = 1; break;
            case 2: a = Math.floor(Math.random() * 4) + 2; b = Math.floor(Math.random() * 10) + 1; break;
            case 3: a = Math.floor(Math.random() * 5) + 6; b = Math.floor(Math.random() * 10) + 1; break;
            default: a = Math.floor(Math.random() * 10) + 1; b = 1;
        }
        return { a, b, question: `${a} x ${b}`, answer: a * b };
    };

    const handleStartGame = () => {
        setInicioSessao(new Date());
        setAcertos(0);
        setErros(0);
        setGameState(prev => ({
            ...prev,
            board: Array(BOARD_SIZE).fill(null),
            currentPlayer: 'X',
            status: 'playing',
            currentProblem: generateProblem(currentLevel),
        }));
        setMessage('');
    };

    const handleResetGame = () => {
        setGameState({
            board: Array(BOARD_SIZE).fill(null),
            currentPlayer: 'X',
            status: 'idle',
            currentProblem: null,
            scoreX: 0,
            scoreO: 0,
        });
        setAcertos(0);
        setErros(0);
        setMessage('');
    };
    
    const checkWinner = (board: ('X' | 'O' | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
            [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
        ];
        for (const line of lines) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        }
        if (board.every(cell => cell)) return 'draw';
        return null;
    };

    const handleCellClick = (index: number) => {
        if (gameState.status !== 'playing' || gameState.board[index]) return;
        setShowAnswerInput(true);
        setCurrentCellIndex(index);
        setMessage(`Qual o resultado de ${gameState.currentProblem?.question}?`);
    };

    const handleAnswerSubmit = () => {
        if (currentCellIndex === null || !gameState.currentProblem) return;
        
        const isCorrect = parseInt(userAnswer, 10) === gameState.currentProblem.answer;

        if (isCorrect) {
            setAcertos(prev => prev + 1);
            const newBoard = [...gameState.board];
            newBoard[currentCellIndex] = gameState.currentPlayer;
            const winner = checkWinner(newBoard);

            if (winner) {
                const newStatus = winner === 'draw' ? 'draw' : `winner-${winner}` as 'winner-X' | 'winner-O';
                setMessage(winner === 'draw' ? 'Empate!' : `Jogador ${winner} venceu!`);
                setGameState(prev => ({
                    ...prev,
                    board: newBoard,
                    status: 'finished',
                    scoreX: winner === 'X' ? prev.scoreX + 1 : prev.scoreX,
                    scoreO: winner === 'O' ? prev.scoreO + 1 : prev.scoreO,
                }));
            } else {
                setMessage('Resposta correta!');
                setGameState(prev => ({
                    ...prev,
                    board: newBoard,
                    currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
                    currentProblem: generateProblem(currentLevel),
                }));
            }
        } else {
            setErros(prev => prev + 1);
            setMessage('Resposta incorreta! Vez do próximo jogador.');
            setGameState(prev => ({
                ...prev,
                currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
                currentProblem: generateProblem(currentLevel),
            }));
        }
        setShowAnswerInput(false);
        setUserAnswer('');
    };
    
    const handleSaveSession = async () => {
        if (gameState.status !== 'finished') return;
        setSalvando(true);
        const fimSessao = new Date();
        const duracaoSegundos = inicioSessao ? Math.round((fimSessao.getTime() - inicioSessao.getTime()) / 1000) : 0;
        const pontuacaoFinal = acertos - erros;

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                alert('Sessão expirada. Faça login novamente.');
                router.push('/login');
                return;
            }
            const { error } = await supabase.from('sessoes').insert([{
                usuario_id: user.id,
                atividade_nome: 'Jogo da Multiplicação',
                pontuacao_final: pontuacaoFinal,
                data_fim: fimSessao.toISOString(),
                observacoes: { nivel: currentLevel, acertos, erros, duracao_segundos: duracaoSegundos }
            }]);

            if (error) {
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!\nPontuação: ${pontuacaoFinal}`);
                router.push('/dashboard'); // Redirecionamento corrigido
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
                title="Jogo da Multiplicação"
                icon={<Calculator size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={gameState.status === 'finished'}
            />
            <main className="p-4 sm:p-6 max-w-4xl mx-auto">
                {gameState.status === 'idle' ? (
                    <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                        <div className="text-6xl mb-4">🧠</div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pronto para o Jogo da Velha Matemático?</h1>
                        <p className="text-gray-600 mb-6">Escolha o nível de dificuldade da tabuada e clique em iniciar.</p>
                        <div className="flex justify-center space-x-2 mb-6">
                            {[1, 2, 3].map(level => (
                                <button key={level} onClick={() => setCurrentLevel(level)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentLevel === level ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                                    Nível {level}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleStartGame} className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors mx-auto">
                            <Play size={20} />
                            <span>Iniciar Jogo</span>
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 text-center gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">Placar</h2>
                                <p className="text-2xl font-bold"><span className="text-blue-600">X: {gameState.scoreX}</span> | <span className="text-red-600">O: {gameState.scoreO}</span></p>
                            </div>
                            <div className="text-center">
                                {gameState.status === 'playing' && (
                                    <>
                                        <p className="text-lg font-medium">Vez de: <span className={`font-bold ${gameState.currentPlayer === 'X' ? 'text-blue-600' : 'text-red-600'}`}>{gameState.currentPlayer}</span></p>
                                        <p className="text-2xl font-semibold mt-1">{gameState.currentProblem?.question} = ?</p>
                                    </>
                                )}
                                {gameState.status === 'finished' && <p className="text-2xl font-bold text-green-600">{message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full max-w-xs sm:max-w-sm mx-auto">
                            {gameState.board.map((cell, index) => (
                                <button
                                    key={index}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-5xl font-bold transition-colors ${cell ? 'cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'} ${cell === 'X' ? 'bg-blue-500 text-white' : ''} ${cell === 'O' ? 'bg-red-500 text-white' : ''}`}
                                    onClick={() => handleCellClick(index)}
                                    disabled={!!cell || gameState.status !== 'playing'}
                                >
                                    {cell}
                                </button>
                            ))}
                        </div>
                        {gameState.status === 'finished' && (
                            <div className="flex justify-center gap-4 mt-6">
                                <button onClick={handleStartGame} className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                    <RotateCcw size={20} />
                                    <span>Jogar de Novo</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {showAnswerInput && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-lg shadow-xl text-center space-y-4 w-full max-w-sm">
                            <h3 className="text-xl font-semibold">{message}</h3>
                            <input
                                type="number"
                                className="w-full text-center p-3 border border-gray-300 rounded-lg text-2xl"
                                placeholder="Sua resposta"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                                autoFocus
                            />
                            <button onClick={handleAnswerSubmit} className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors text-lg">
                                Enviar
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
