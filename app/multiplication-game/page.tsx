'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Trophy, RotateCcw, Calculator, Crown, Coins, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './multiplication-game.css';

// --- SISTEMA DE IA ---
class IAPlayer {
  difficulty: 'facil' | 'medio' | 'dificil';
  thinkingTime: { min: number; max: number };
  accuracy: number;
  
  constructor(difficulty: 'facil' | 'medio' | 'dificil') {
    this.difficulty = difficulty;
    
    switch(difficulty) {
      case 'facil':
        this.thinkingTime = { min: 2000, max: 5000 };
        this.accuracy = 0.6;
        break;
      case 'medio':
        this.thinkingTime = { min: 1500, max: 3500 };
        this.accuracy = 0.75;
        break;
      case 'dificil':
        this.thinkingTime = { min: 1000, max: 2500 };
        this.accuracy = 0.9;
        break;
    }
  }
  
  async makeMove(problem: { answer: number }) {
    // Simula tempo de pensamento
    const thinkTime = Math.random() * (this.thinkingTime.max - this.thinkingTime.min) + this.thinkingTime.min;
    
    // Adiciona tempo extra para números maiores
    const complexityBonus = problem.answer > 50 ? 1000 : 0;
    
    await new Promise(resolve => setTimeout(resolve, thinkTime + complexityBonus));
    
    // Decide se acerta ou erra
    const shouldHit = Math.random() < this.accuracy;
    
    if (shouldHit) {
      return problem.answer;
    } else {
      // Erros realistas
      const errors = [
        problem.answer + 1,
        problem.answer - 1,
        problem.answer + 10,
        Math.floor(problem.answer * 0.9)
      ];
      return errors[Math.floor(Math.random() * errors.length)];
    }
  }
  
  chooseBestCell(board: any[], currentPlayer: string) {
    // Estratégia: tentar ganhar, bloquear oponente, ou escolher centro/cantos
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    // Tentar ganhar
    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] === currentPlayer && board[b] === currentPlayer && !board[c]) return c;
      if (board[a] === currentPlayer && board[c] === currentPlayer && !board[b]) return b;
      if (board[b] === currentPlayer && board[c] === currentPlayer && !board[a]) return a;
    }
    
    // Bloquear oponente
    const opponent = currentPlayer === 'X' ? 'O' : 'X';
    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] === opponent && board[b] === opponent && !board[c]) return c;
      if (board[a] === opponent && board[c] === opponent && !board[b]) return b;
      if (board[b] === opponent && board[c] === opponent && !board[a]) return a;
    }
    
    // Preferir centro, depois cantos, depois laterais
    const preferences = [4, 0, 2, 6, 8, 1, 3, 5, 7];
    for (const pos of preferences) {
      if (!board[pos]) return pos;
    }
    
    return 0;
  }
}

// --- TIPAGEM E CONSTANTES ---
interface GameState {
  board: ('X' | 'O' | null)[];
  currentPlayer: 'X' | 'O';
  status: 'welcome' | 'initial' | 'playing' | 'finished';
  currentProblem: { a: number; b: number; question: string; answer: number } | null;
  scoreX: number;
  scoreO: number;
  mode: 'pvp' | 'pve';
  coins: number;
  conqueredTerritories: number;
  badges: string[];
  consecutiveWins: number;
}

export default function MultiplicationGame() {
  const router = useRouter();
  
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    status: 'welcome',
    currentProblem: null,
    scoreX: 0,
    scoreO: 0,
    mode: 'pvp',
    coins: 0,
    conqueredTerritories: 0,
    badges: [],
    consecutiveWins: 0
  });
  
  const [nivelSelecionado, setNivelSelecionado] = useState<number>(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  const [currentCellIndex, setCurrentCellIndex] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [iaPlayer, setIaPlayer] = useState<IAPlayer | null>(null);
  const [iaThinking, setIaThinking] = useState(false);
  const [iaDifficulty, setIaDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [coinPosition, setCoinPosition] = useState({ x: 0, y: 0 });
  
  const niveis = [
    { id: 1, nome: "Reino do 1", dificuldade: "Tabuada do 1", icone: "🏰", color: "#4caf50" },
    { id: 2, nome: "Reino 2-5", dificuldade: "Tabuadas 2-5", icone: "🏯", color: "#2196f3" },
    { id: 3, nome: "Reino 6-10", dificuldade: "Tabuadas 6-10", icone: "🏛️", color: "#9c27b0" },
  ];
  
  const generateProblem = (level: number) => {
    let a, b;
    switch (level) {
      case 1: 
        a = Math.floor(Math.random() * 10) + 1; 
        b = 1; 
        break;
      case 2: 
        a = Math.floor(Math.random() * 4) + 2; 
        b = Math.floor(Math.random() * 10) + 1; 
        break;
      case 3: 
        a = Math.floor(Math.random() * 5) + 6; 
        b = Math.floor(Math.random() * 10) + 1; 
        break;
      default: 
        a = 1; 
        b = 1;
    }
    return { a, b, question: `${a} × ${b}`, answer: a * b };
  };
  
  const startGame = () => {
    const ia = gameState.mode === 'pve' ? new IAPlayer(iaDifficulty) : null;
    setIaPlayer(ia);
    
    setGameState(prev => ({
      ...prev,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      status: 'playing',
      currentProblem: generateProblem(nivelSelecionado),
    }));
    setMessage('');
  };
  
  const addCoins = (amount: number, x: number, y: number) => {
    setCoinPosition({ x, y });
    setShowCoinAnimation(true);
    setGameState(prev => ({ ...prev, coins: prev.coins + amount }));
    setTimeout(() => setShowCoinAnimation(false), 800);
  };
  
  const addBadge = (badge: string) => {
    setGameState(prev => ({
      ...prev,
      badges: prev.badges.includes(badge) ? prev.badges : [...prev.badges, badge]
    }));
  };
  
  const checkWinner = (board: ('X' | 'O' | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    
    if (board.every(cell => cell)) return 'draw';
    return null;
  };
  
  const handleCellClick = (index: number) => {
    if (gameState.status !== 'playing' || gameState.board[index]) return;
    if (gameState.mode === 'pve' && gameState.currentPlayer === 'O') return;
    
    setShowAnswerInput(true);
    setCurrentCellIndex(index);
    setMessage(`Qual o resultado de ${gameState.currentProblem?.question}?`);
  };
  
  const handleAnswerSubmit = () => {
    if (currentCellIndex === null || !gameState.currentProblem) return;
    
    const isCorrect = parseInt(userAnswer, 10) === gameState.currentProblem.answer;
    const rect = document.querySelector('.game-board')?.getBoundingClientRect();
    
    if (isCorrect) {
      // Adicionar moedas com animação
      if (rect) addCoins(10 * nivelSelecionado, rect.left + rect.width/2, rect.top);
      
      const newBoard = [...gameState.board];
      newBoard[currentCellIndex] = gameState.currentPlayer;
      
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        conqueredTerritories: prev.conqueredTerritories + 1
      }));
      
      const winner = checkWinner(newBoard);
      
      if (winner) {
        handleGameEnd(winner, newBoard);
      } else {
        setMessage('🎯 Território conquistado!');
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
          currentProblem: generateProblem(nivelSelecionado),
        }));
        
        // Se modo PvE e vez da IA
        if (gameState.mode === 'pve' && gameState.currentPlayer === 'X') {
          setTimeout(() => iaPlay(newBoard), 1000);
        }
      }
    } else {
      setMessage('❌ Resposta incorreta! Vez do próximo jogador.');
      setGameState(prev => ({
        ...prev,
        currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
        currentProblem: generateProblem(nivelSelecionado),
      }));
    }
    
    setShowAnswerInput(false);
    setUserAnswer('');
  };
  
  const iaPlay = async (currentBoard: any[]) => {
    if (!iaPlayer) return;
    
    setIaThinking(true);
    const cellIndex = iaPlayer.chooseBestCell(currentBoard, 'O');
    
    // Simular pensamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const problem = generateProblem(nivelSelecionado);
    const iaAnswer = await iaPlayer.makeMove(problem);
    
    setIaThinking(false);
    
    if (iaAnswer === problem.answer) {
      const newBoard = [...currentBoard];
      newBoard[cellIndex] = 'O';
      
      const winner = checkWinner(newBoard);
      
      if (winner) {
        handleGameEnd(winner, newBoard);
      } else {
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: 'X',
          currentProblem: generateProblem(nivelSelecionado),
        }));
      }
    } else {
      setMessage('🤖 A IA errou! Sua vez!');
      setGameState(prev => ({
        ...prev,
        currentPlayer: 'X',
        currentProblem: generateProblem(nivelSelecionado),
      }));
    }
  };
  
  const handleGameEnd = (winner: string | 'draw', finalBoard: any[]) => {
    let endMessage = '';
    let coinsEarned = 0;
    
    if (winner === 'draw') {
      endMessage = '⚔️ Empate épico!';
      coinsEarned = 25;
    } else if (winner === 'X') {
      endMessage = '👑 Você conquistou o reino!';
      coinsEarned = 50 * nivelSelecionado;
      
      // Adicionar badges
      if (nivelSelecionado === 1) addBadge('Conquistador Iniciante');
      if (nivelSelecionado === 2) addBadge('Mestre dos Números');
      if (nivelSelecionado === 3) addBadge('Rei da Matemática');
      
      setGameState(prev => ({
        ...prev,
        consecutiveWins: prev.consecutiveWins + 1,
        scoreX: prev.scoreX + 1
      }));
    } else {
      endMessage = gameState.mode === 'pve' ? '🤖 A IA venceu!' : '🏰 Jogador O venceu!';
      setGameState(prev => ({
        ...prev,
        consecutiveWins: 0,
        scoreO: prev.scoreO + 1
      }));
    }
    
    const rect = document.querySelector('.game-board')?.getBoundingClientRect();
    if (rect) addCoins(coinsEarned, rect.left + rect.width/2, rect.top);
    
    setMessage(endMessage);
    setGameState(prev => ({
      ...prev,
      board: finalBoard,
      status: 'finished'
    }));
    
    // Progressão automática
    if (gameState.consecutiveWins >= 2 && nivelSelecionado < 3) {
      setTimeout(() => {
        setNivelSelecionado(prev => prev + 1);
        setMessage('🎉 Você avançou de nível!');
      }, 2000);
    }
  };
  
  // Tela de Boas-Vindas
  if (gameState.status === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-600">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white/95 rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ⚔️ Conquista Matemática ⚔️
            </h1>
            
            <div className="text-6xl mb-6">🏰</div>
            
            <p className="text-lg text-gray-700 mb-8">
              Conquiste territórios resolvendo multiplicações!<br/>
              Construa seu reino e torne-se o Rei da Matemática!
            </p>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Escolha o Modo de Jogo:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setGameState(prev => ({ ...prev, mode: 'pvp', status: 'initial' }));
                  }}
                  className="p-6 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">👥</div>
                  <div className="font-bold text-xl">2 Jogadores</div>
                  <div className="text-sm opacity-90">Desafie um amigo!</div>
                </button>
                
                <button
                  onClick={() => {
                    setGameState(prev => ({ ...prev, mode: 'pve', status: 'initial' }));
                  }}
                  className="p-6 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all transform hover:scale-105"
                >
                  <div className="text-3xl mb-2">🤖</div>
                  <div className="font-bold text-xl">Contra IA</div>
                  <div className="text-sm opacity-90">Desafie o computador!</div>
                </button>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center gap-4">
              <div className="coin-display">
                <Coins size={20} />
                <span>{gameState.coins} Moedas</span>
              </div>
              {gameState.badges.length > 0 && (
                <div className="flex gap-2">
                  {gameState.badges.map((badge, i) => (
                    <span key={i} className="badge">{badge}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Tela de Seleção de Nível
  if (gameState.status === 'initial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setGameState(prev => ({ ...prev, status: 'welcome' }))}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="ml-1 font-medium">Voltar</span>
            </button>
            <h1 className="text-xl font-bold">Escolha seu Reino</h1>
            <div className="coin-display">
              <Coins size={20} />
              <span>{gameState.coins}</span>
            </div>
          </div>
        </header>
        
        <main className="p-6 max-w-4xl mx-auto">
          {/* Mapa do Reino */}
          <div className="kingdom-map mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              🗺️ Mapa dos Reinos Matemáticos
            </h2>
            <div className="kingdom-progress">
              {niveis.map((nivel) => (
                <div 
                  key={nivel.id}
                  className={`kingdom-level ${
                    gameState.consecutiveWins >= (nivel.id - 1) * 3 ? 'completed' : ''
                  } ${nivelSelecionado === nivel.id ? 'current' : ''}`}
                >
                  {nivel.icone}
                </div>
              ))}
            </div>
          </div>
          
          {/* Seleção de Dificuldade da IA */}
          {gameState.mode === 'pve' && (
            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Escolha a Dificuldade da IA:</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setIaDifficulty('facil')}
                  className={`p-4 rounded-lg font-medium transition-colors ${
                    iaDifficulty === 'facil'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">😊</div>
                  <div>Iniciante Leo</div>
                </button>
                <button
                  onClick={() => setIaDifficulty('medio')}
                  className={`p-4 rounded-lg font-medium transition-colors ${
                    iaDifficulty === 'medio'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">🤓</div>
                  <div>Leo Estudioso</div>
                </button>
                <button
                  onClick={() => setIaDifficulty('dificil')}
                  className={`p-4 rounded-lg font-medium transition-colors ${
                    iaDifficulty === 'dificil'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">🧙‍♂️</div>
                  <div>Professor Leo</div>
                </button>
              </div>
            </div>
          )}
          
          {/* Seleção de Reino/Nível */}
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Selecione o Reino:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {niveis.map((nivel) => (
                <button
                  key={nivel.id}
                  onClick={() => setNivelSelecionado(nivel.id)}
                  className={`p-6 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    nivelSelecionado === nivel.id
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white scale-105'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: nivelSelecionado === nivel.id ? nivel.color : undefined
                  }}
                >
                  <div className="text-4xl mb-2">{nivel.icone}</div>
                  <div className="text-lg font-bold">{nivel.nome}</div>
                  <div className="text-sm opacity-80">{nivel.dificuldade}</div>
                  <div className="mt-2 text-xs">
                    🪙 {nivel.id * 10} moedas por acerto
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-12 rounded-xl text-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              ⚔️ Iniciar Conquista!
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  // Tela do Jogo
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center text-purple-600 hover:text-purple-700"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="ml-1 font-medium">Sair</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                <span className="text-blue-600">🏰 {gameState.scoreX}</span>
                {' vs '}
                <span className="text-red-600">{gameState.scoreO} 🏰</span>
              </div>
            </div>
            
            <div className="coin-display">
              <Coins size={20} />
              <span>{gameState.coins}</span>
            </div>
          </div>
          
          <button
            onClick={() => setGameState(prev => ({ ...prev, status: 'initial' }))}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            <RotateCcw size={18} />
            <span>Reiniciar</span>
          </button>
        </div>
      </header>
      
      <main className="p-6 max-w-4xl mx-auto">
        <div className="bg-white/95 rounded-2xl shadow-2xl p-6">
          {/* Status do Jogo */}
          <div className="text-center mb-6">
            {gameState.status === 'playing' && (
              <>
                <div className="text-2xl font-bold mb-2">
                  {iaThinking ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="ia-avatar thinking">🤖</div>
                      <div className="thought-bubble">Hmm... 🤔</div>
                    </div>
                  ) : (
                    <>
                      Vez de: 
                      <span className={gameState.currentPlayer === 'X' ? ' text-blue-600' : ' text-red-600'}>
                        {' '}{gameState.currentPlayer === 'X' ? '⚔️ Você' : gameState.mode === 'pve' ? '🤖 IA' : '🛡️ Jogador O'}
                      </span>
                    </>
                  )}
                </div>
                {gameState.currentProblem && !iaThinking && (
                  <div className="text-3xl font-bold text-purple-600">
                    {gameState.currentProblem.question} = ?
                  </div>
                )}
              </>
            )}
            
            {gameState.status === 'finished' && (
              <div className="text-3xl font-bold text-green-600 mb-4">
                {message}
              </div>
            )}
          </div>
          
          {/* Tabuleiro */}
          <div className="game-board mx-auto" style={{ maxWidth: '400px' }}>
            <div className="grid grid-cols-3 gap-2">
              {gameState.board.map((cell, index) => (
                <button
                  key={index}
                  className={`territory-cell aspect-square ${
                    cell ? `conquered-${cell}` : ''
                  }`}
                  onClick={() => handleCellClick(index)}
                  disabled={!!cell || gameState.status !== 'playing' || iaThinking}
                >
                  {cell && (
                    <div className="castle-icon">
                      {cell === 'X' ? '🏰' : '🏯'}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Estatísticas */}
          <div className="mt-6 flex justify-center gap-6">
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto text-purple-600 mb-1" />
              <div className="text-sm text-gray-600">Territórios</div>
              <div className="text-xl font-bold">{gameState.conqueredTerritories}</div>
            </div>
            <div className="text-center">
              <Trophy className="h-8 w-8 mx-auto text-yellow-500 mb-1" />
              <div className="text-sm text-gray-600">Vitórias</div>
              <div className="text-xl font-bold">{gameState.consecutiveWins}</div>
            </div>
            <div className="text-center">
              <Crown className="h-8 w-8 mx-auto text-purple-600 mb-1" />
              <div className="text-sm text-gray-600">Nível</div>
              <div className="text-xl font-bold">{nivelSelecionado}</div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modal de Resposta */}
      {showAnswerInput && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-2xl font-bold text-center mb-4 text-purple-600">
              {message}
            </h3>
            <input
              type="number"
              className="w-full text-center p-4 border-2 border-purple-300 rounded-xl text-3xl font-bold"
              placeholder="?"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
              autoFocus
            />
            <button
              onClick={handleAnswerSubmit}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-xl text-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              ⚔️ Conquistar!
            </button>
          </div>
        </div>
      )}
      
      {/* Animação de Moedas */}
      {showCoinAnimation && (
        <div 
          className="coin-animation"
          style={{ left: coinPosition.x, top: coinPosition.y }}
        >
          🪙 +{10 * nivelSelecionado}
        </div>
      )}
    </div>
  );
}
