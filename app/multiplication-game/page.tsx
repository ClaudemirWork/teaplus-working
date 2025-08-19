'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, RotateCcw, Trophy, Brain, Target, Save, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

// Define as propriedades do estado do jogo
interface GameState {
  board: ('X' | 'O' | null)[];
  currentPlayer: 'X' | 'O';
  status: 'playing' | 'winner-X' | 'winner-O' | 'draw' | 'idle' | 'finished';
  currentProblem: { a: number; b: number; question: string; answer: number } | null;
  scoreX: number;
  scoreO: number;
}

interface Props {
  initialState?: GameState;
}

export default function MultiplicationGame({ initialState }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const BOARD_SIZE = 9;

  // Estados do jogo
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
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  const [currentCellIndex, setCurrentCellIndex] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Estados para métricas
  const [inicioSessao, setInicioSessao] = useState<Date | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);

  // Gera um novo problema de multiplicação com base no nível
  const generateProblem = (level: number) => {
    let a, b;
    switch (level) {
      case 1: // Nível Fácil: tabuada do 1
        a = Math.floor(Math.random() * 10) + 1;
        b = 1;
        break;
      case 2: // Nível Médio: tabuada do 2 ao 5
        a = Math.floor(Math.random() * 4) + 2;
        b = Math.floor(Math.random() * 10) + 1;
        break;
      case 3: // Nível Difícil: tabuada do 6 ao 10
        a = Math.floor(Math.random() * 5) + 6;
        b = Math.floor(Math.random() * 10) + 1;
        break;
      default:
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
    }
    const answer = a * b;
    const question = `${a} x ${b}`;
    return { a, b, question, answer };
  };

  // Lida com o início de um novo jogo
  const handleStartGame = () => {
    setInicioSessao(new Date());
    setAcertos(0);
    setErros(0);
    const newProblem = generateProblem(currentLevel);
    setGameState({
      board: Array(BOARD_SIZE).fill(null),
      currentPlayer: 'X',
      status: 'playing',
      currentProblem: newProblem,
      scoreX: 0,
      scoreO: 0,
    });
    setMessage('');
    setFeedbackType(null);
  };

  // Reinicia o jogo para o estado inicial
  const handleResetGame = () => {
    setGameState({
      board: Array(BOARD_SIZE).fill(null),
      currentPlayer: 'X',
      status: 'idle',
      currentProblem: null,
      scoreX: 0,
      scoreO: 0,
    });
    setInicioSessao(null);
    setAcertos(0);
    setErros(0);
    setMessage('');
    setFeedbackType(null);
  };
  
  // Função para avançar para o próximo nível
  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel <= 3) {
      setCurrentLevel(nextLevel);
      handleStartGame();
    } else {
      alert('Parabéns! Você concluiu todos os níveis.');
      handleResetGame();
    }
  };

  // Checa se há um vencedor ou empate
  const checkWinner = (board: ('X' | 'O' | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
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

  // Lida com o clique em uma célula do tabuleiro
  const handleCellClick = (index: number) => {
    if (gameState.status !== 'playing' || gameState.board[index]) return;
    setShowAnswerInput(true);
    setCurrentCellIndex(index);
    setMessage(`Qual o resultado de ${gameState.currentProblem?.question}?`);
  };

  // Lida com a submissão da resposta do usuário
  const handleAnswerSubmit = () => {
    if (currentCellIndex === null) return;
    const answer = parseInt(userAnswer, 10);
    
    if (!isNaN(answer) && answer === gameState.currentProblem?.answer) {
      setAcertos(prev => prev + 1);
      const newBoard = [...gameState.board];
      newBoard[currentCellIndex] = gameState.currentPlayer;
      const winner = checkWinner(newBoard);

      if (winner) {
        if (winner === 'draw') {
          setMessage('Empate!');
          setFeedbackType(null);
          setGameState(prev => ({ ...prev, board: newBoard, status: 'finished' }));
        } else {
          setMessage(`Jogador ${winner} venceu!`);
          setFeedbackType('success');
          setGameState(prev => ({
            ...prev,
            board: newBoard,
            status: 'finished',
            scoreX: winner === 'X' ? prev.scoreX + 1 : prev.scoreX,
            scoreO: winner === 'O' ? prev.scoreO + 1 : prev.scoreO,
          }));
        }
      } else {
        const nextPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        const newProblem = generateProblem(currentLevel);
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
      setErros(prev => prev + 1);
      setMessage('Resposta incorreta! Tente novamente.');
      setFeedbackType('error');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1500);
    }
    setShowAnswerInput(false);
    setUserAnswer('');
    setCurrentCellIndex(null);
  };
  
  // Função para salvar a sessão no Supabase
  const handleSaveSession = async () => {
    if (gameState.status === 'idle') {
      alert('Inicie e finalize um jogo antes de salvar.');
      return;
    }
    
    setSalvando(true);
    
    const fimSessao = new Date();
    const duracaoSegundos = inicioSessao ? Math.round((fimSessao.getTime() - inicioSessao.getTime()) / 1000) : 0;
    const pontuacaoFinal = acertos - erros; // Pontuação baseada em acertos e erros
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('Erro ao obter usuário:', userError);
        alert('Erro: Sessão expirada. Por favor, faça login novamente.');
        router.push('/login');
        return;
      }
      
      const { error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Jogo da Multiplicação',
          pontuacao_final: pontuacaoFinal,
          data_fim: fimSessao.toISOString(),
          detalhes: {
            nivel_dificuldade: currentLevel,
            acertos: acertos,
            erros: erros,
            duracao_segundos: duracaoSegundos,
          }
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar a sessão: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!
        
📊 Resumo:
• Pontuação Final: ${pontuacaoFinal}
• Nível de Dificuldade: ${currentLevel}
• Acertos: ${acertos}
• Erros: ${erros}
• Duração: ${duracaoSegundos} segundos
`);
        handleResetGame();
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      alert('Erro inesperado ao salvar a sessão.');
    } finally {
      setSalvando(false);
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
                  Uma versão do "jogo da velha" para praticar tabuada. Seja o primeiro a conseguir uma sequência de três peças (X ou O) na horizontal, vertical ou diagonal, respondendo corretamente às questões de multiplicação.
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
            {gameState.status !== 'playing' && gameState.status !== 'finished' ? (
              <div className="text-center">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Selecione o Nível de Dificuldade:</h3>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => setCurrentLevel(1)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentLevel === 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                      Nível 1 (Fácil)
                    </button>
                    <button
                      onClick={() => setCurrentLevel(2)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentLevel === 2 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                      Nível 2 (Médio)
                    </button>
                    <button
                      onClick={() => setCurrentLevel(3)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentLevel === 3 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                      Nível 3 (Difícil)
                    </button>
                  </div>
                </div>
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
                
                {/* Answer Input Modal */}
                {showAnswerInput && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center space-y-4">
                      <h3 className="text-xl font-semibold">{message}</h3>
                      <input
                        type="number"
                        className="w-full text-center p-3 border border-gray-300 rounded-lg text-lg"
                        placeholder="Sua resposta"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                        autoFocus
                      />
                      <button
                        onClick={handleAnswerSubmit}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors"
                      >
                        Enviar Resposta
                      </button>
                    </div>
                  </div>
                )}
                {/* Botões de controle após o jogo */}
                {gameState.status === 'finished' && (
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                        <button
                            onClick={handleResetGame}
                            className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-medium transition-colors"
                        >
                            <RotateCcw size={20} />
                            <span>Jogar Novamente</span>
                        </button>
                        {currentLevel < 3 && (
                            <button
                                onClick={handleNextLevel}
                                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-colors"
                            >
                                <span>Próximo Nível</span>
                                <ChevronRight size={20} />
                            </button>
                        )}
                        <button
                          onClick={handleSaveSession}
                          disabled={salvando}
                          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:bg-green-400"
                        >
                          <Save size={20} />
                          <span>{salvando ? 'Salvando...' : 'Finalizar e Salvar'}</span>
                        </button>
                    </div>
                )}
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
