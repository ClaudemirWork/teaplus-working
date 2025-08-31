'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Save, Trophy, RotateCcw, Calculator, Crown, Coins, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './multiplication-game.css';

// --- SISTEMA DE SONS ---
class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  
  constructor() {
    this.createSound('click', 440, 0.1);
    this.createSound('correct', 523, 0.2);
    this.createSound('wrong', 196, 0.2);
    this.createSound('victory', 784, 0.3);
    this.createSound('coin', 659, 0.15);
  }
  
  createSound(name: string, frequency: number, duration: number) {
    const audioContext = typeof window !== 'undefined' && window.AudioContext 
      ? new (window.AudioContext || (window as any).webkitAudioContext)()
      : null;
      
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.3;
    
    const audio = new Audio();
    audio.volume = 0.5;
    
    const beep = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZijgJGGm98OScTgwOUKzn47VgGAU7k9zyw3UpBSyAzvDaiTYIGWu+8OabTQ0OT6vm4bVfGAU8lN/ywHIiBi6F0fDYhjIJHm/A8OaZTQ0OTqzl4rVfGAU9md/yvnEmBSyE0fDYhDEJHnDB8OaXTQ0PT6/k4bVfGQU9md/yu3ElBi+G0fDYgjAJIHPC8OaVTQ0PT6/k4bVfGQU9md/yu3ElBi+G0fDYgjAJIHPC8OaVTQ0PT6/k4bVfGQU9md/yu3ElBi+G0fDYgjAJIHPC8OWVTQ0PT6/k4bVfGQU9md/yu3ElBi+G0fDYgjAJIHPC8OWVTg0OTqzm4bVeGQU9mt/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWm98OicTgwOUKzl47RfGAU8mN/yxnkiBySA0fDaiTcIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIGWm+8OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIGWm+8OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIGWm+8OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIGWm+8OmcTQ0NUKzl47RfGAU8mN/yxnkiBw==`;
    
    this.sounds[name] = new Audio(beep);
  }
  
  play(soundName: string) {
    if (this.sounds[soundName]) {
      const sound = this.sounds[soundName].cloneNode() as HTMLAudioElement;
      sound.play().catch(() => {});
    }
  }
}

// --- SISTEMA DE IA ---
class IAPlayer {
  difficulty: 'facil' | 'medio' | 'dificil';
  thinkingTime: { min: number; max: number };
  accuracy: number;
  
  constructor(difficulty: 'facil' | 'medio' | 'dificil') {
    this.difficulty = difficulty;
    
    switch(difficulty) {
      case 'facil':
        this.thinkingTime = { min: 1500, max: 3000 };
        this.accuracy = 0.6;
        break;
      case 'medio':
        this.thinkingTime = { min: 1000, max: 2000 };
        this.accuracy = 0.75;
        break;
      case 'dificil':
        this.thinkingTime = { min: 800, max: 1500 };
        this.accuracy = 0.9;
        break;
    }
  }
  
  async makeMove(problem: { answer: number }) {
    const thinkTime = Math.random() * (this.thinkingTime.max - this.thinkingTime.min) + this.thinkingTime.min;
    const complexityBonus = problem.answer > 50 ? 500 : 0;
    
    await new Promise(resolve => setTimeout(resolve, thinkTime + complexityBonus));
    
    const shouldHit = Math.random() < this.accuracy;
    
    if (shouldHit) {
      return problem.answer;
    } else {
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
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] === currentPlayer && board[b] === currentPlayer && !board[c]) return c;
      if (board[a] === currentPlayer && board[c] === currentPlayer && !board[b]) return b;
      if (board[b] === currentPlayer && board[c] === currentPlayer && !board[a]) return a;
    }
    
    const opponent = currentPlayer === 'X' ? 'O' : 'X';
    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] === opponent && board[b] === opponent && !board[c]) return c;
      if (board[a] === opponent && board[c] === opponent && !board[b]) return b;
      if (board[b] === opponent && board[c] === opponent && !board[a]) return a;
    }
    
    const preferences = [4, 0, 2, 6, 8, 1, 3, 5, 7];
    for (const pos of preferences) {
      if (!board[pos]) return pos;
    }
    
    return 0;
  }
}

// --- COMPONENTE PRINCIPAL ---
interface GameState {
  board: ('X' | 'O' | null)[];
  currentPlayer: 'X' | 'O';
  status: 'splash' | 'welcome' | 'initial' | 'playing' | 'finished';
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
  const soundManager = useRef<SoundManager | null>(null);
  
  useEffect(() => {
    soundManager.current = new SoundManager();
  }, []);
  
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    status: 'splash',
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
  const [showIaFeedback, setShowIaFeedback] = useState<{ show: boolean; correct: boolean; answer: string }>({ show: false, correct: false, answer: '' });
  const [showVictoryEffects, setShowVictoryEffects] = useState(false);
  
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
    soundManager.current?.play('click');
  };
  
  const addCoins = (amount: number, x: number, y: number) => {
    setCoinPosition({ x, y });
    setShowCoinAnimation(true);
    setGameState(prev => ({ ...prev, coins: prev.coins + amount }));
    soundManager.current?.play('coin');
    setTimeout(() => setShowCoinAnimation(false), 800);
  };
  
  const createConfetti = () => {
    setShowVictoryEffects(true);
    const container = document.getElementById('game-container');
    
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8cc8'][Math.floor(Math.random() * 5)];
        container?.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
      }, i * 20);
    }
    
    setTimeout(() => setShowVictoryEffects(false), 4000);
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
    
    soundManager.current?.play('click');
    setShowAnswerInput(true);
    setCurrentCellIndex(index);
    setMessage(`Qual o resultado de ${gameState.currentProblem?.question}?`);
  };
  
  const handleAnswerSubmit = () => {
    if (currentCellIndex === null || !gameState.currentProblem) return;
    
    const isCorrect = parseInt(userAnswer, 10) === gameState.currentProblem.answer;
    const rect = document.querySelector('.game-board-container')?.getBoundingClientRect();
    
    if (isCorrect) {
      soundManager.current?.play('correct');
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
        
        if (gameState.mode === 'pve' && gameState.currentPlayer === 'X') {
          setTimeout(() => iaPlay(newBoard), 1000);
        }
      }
    } else {
      soundManager.current?.play('wrong');
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
    const problem = generateProblem(nivelSelecionado);
    
    setMessage(`🤖 IA resolvendo: ${problem.question} = ?`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const iaAnswer = await iaPlayer.makeMove(problem);
    const isCorrect = iaAnswer === problem.answer;
    
    setShowIaFeedback({ 
      show: true, 
      correct: isCorrect, 
      answer: `${problem.question} = ${iaAnswer}` 
    });
    
    setIaThinking(false);
    
    if (isCorrect) {
      soundManager.current?.play('correct');
      const newBoard = [...currentBoard];
      newBoard[cellIndex] = 'O';
      
      setMessage(`✅ IA acertou! ${problem.question} = ${iaAnswer}`);
      
      const winner = checkWinner(newBoard);
      
      if (winner) {
        handleGameEnd(winner, newBoard);
      } else {
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            board: newBoard,
            currentPlayer: 'X',
            currentProblem: generateProblem(nivelSelecionado),
          }));
          setShowIaFeedback({ show: false, correct: false, answer: '' });
        }, 2000);
      }
    } else {
      soundManager.current?.play('wrong');
      setMessage(`❌ IA errou! ${problem.question} ≠ ${iaAnswer}`);
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentPlayer: 'X',
          currentProblem: generateProblem(nivelSelecionado),
        }));
        setShowIaFeedback({ show: false, correct: false, answer: '' });
      }, 2000);
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
      soundManager.current?.play('victory');
      createConfetti();
      
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
    
    const rect = document.querySelector('.game-board-container')?.getBoundingClientRect();
    if (rect) addCoins(coinsEarned, rect.left + rect.width/2, rect.top);
    
    setMessage(endMessage);
    setGameState(prev => ({
      ...prev,
      board: finalBoard,
      status: 'finished'
    }));
    
    if (gameState.consecutiveWins >= 2 && nivelSelecionado < 3) {
      setTimeout(() => {
        setNivelSelecionado(prev => prev + 1);
        setMessage('🎉 Você avançou de nível!');
      }, 2000);
    }
  };

  // [TELAS SPLASH, WELCOME E INITIAL PERMANECEM IGUAIS]
  // ... código das telas anteriores ...

  // Tela do Jogo CORRIGIDA
  if (gameState.status === 'playing' || gameState.status === 'finished') {
    return (
      <div id="game-container" className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-3 sm:p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="ml-1 font-medium text-xs sm:text-base">Sair</span>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-center">
                <div className="text-base sm:text-2xl font-bold">
                  <span className="text-blue-600">🏰 {gameState.scoreX}</span>
                  {' vs '}
                  <span className="text-red-600">{gameState.scoreO} 🏰</span>
                </div>
              </div>
              
              <div className="coin-display scale-75 sm:scale-100">
                <Coins size={20} />
                <span>{gameState.coins}</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                soundManager.current?.play('click');
                setGameState(prev => ({ ...prev, status: 'initial' }));
              }}
              className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs sm:text-base"
            >
              <RotateCcw size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </header>
        
        <main className="p-4 sm:p-6 max-w-4xl mx-auto">
          <div className="bg-white/95 rounded-2xl shadow-2xl p-4 sm:p-6">
            {/* Status do Jogo */}
            <div className="text-center mb-4 sm:mb-6">
              {gameState.status === 'playing' && (
                <>
                  <div className="text-lg sm:text-2xl font-bold mb-2 text-gray-800">
                    {iaThinking ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="ia-avatar thinking scale-75 sm:scale-100">🤖</div>
                        <div className="thought-bubble text-sm sm:text-base text-gray-700">Hmm... 🤔</div>
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
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                      {gameState.currentProblem.question} = ?
                    </div>
                  )}
                  
                  {showIaFeedback.show && (
                    <div className={`mt-4 p-3 rounded-lg font-bold text-lg ${
                      showIaFeedback.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {showIaFeedback.correct ? '✅' : '❌'} IA: {showIaFeedback.answer}
                    </div>
                  )}
                </>
              )}
              
              {gameState.status === 'finished' && (
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">
                  {message}
                </div>
              )}
            </div>
            
            {/* TABULEIRO CORRIGIDO */}
            <div className="game-board-container mx-auto max-w-sm">
              <div 
                className="grid grid-cols-3 gap-2 p-4 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                }}
              >
                {gameState.board.map((cell, index) => (
                  <button
                    key={index}
                    className={`
                      aspect-square rounded-lg transition-all transform hover:scale-105
                      ${cell === 'X' ? 'bg-blue-500' : ''}
                      ${cell === 'O' ? 'bg-red-500' : ''}
                      ${!cell ? 'bg-white/90 hover:bg-white' : ''}
                      shadow-lg border-2 border-gray-800/20
                      flex items-center justify-center
                      text-4xl sm:text-5xl font-bold
                      ${!cell && gameState.status === 'playing' && !iaThinking ? 'cursor-pointer' : 'cursor-not-allowed'}
                    `}
                    onClick={() => handleCellClick(index)}
                    disabled={!!cell || gameState.status !== 'playing' || iaThinking}
                    style={{ minHeight: '80px' }}
                  >
                    {cell === 'X' && (
                      <span className="text-white drop-shadow-lg">🏰</span>
                    )}
                    {cell === 'O' && (
                      <span className="text-white drop-shadow-lg">🏯</span>
                    )}
                    {!cell && (
                      <span className="text-gray-400 text-2xl opacity-50">?</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Estatísticas */}
            <div className="mt-4 sm:mt-6 flex justify-center gap-4 sm:gap-6">
              <div className="text-center">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-purple-600 mb-1" />
                <div className="text-xs sm:text-sm text-gray-700 font-medium">Territórios</div>
                <div className="text-base sm:text-xl font-bold text-gray-800">{gameState.conqueredTerritories}</div>
              </div>
              <div className="text-center">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-yellow-500 mb-1" />
                <div className="text-xs sm:text-sm text-gray-700 font-medium">Vitórias</div>
                <div className="text-base sm:text-xl font-bold text-gray-800">{gameState.consecutiveWins}</div>
              </div>
              <div className="text-center">
                <Crown className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-purple-600 mb-1" />
                <div className="text-xs sm:text-sm text-gray-700 font-medium">Nível</div>
                <div className="text-base sm:text-xl font-bold text-gray-800">{nivelSelecionado}</div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Modal de Resposta */}
        {showAnswerInput && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-sm w-full">
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 text-purple-600">
                {message}
              </h3>
              <input
                type="number"
                className="w-full text-center p-3 sm:p-4 border-2 border-purple-300 rounded-xl text-2xl sm:text-3xl font-bold text-gray-800"
                placeholder="?"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                autoFocus
              />
              <button
                onClick={handleAnswerSubmit}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-xl text-base sm:text-lg hover:from-purple-700 hover:to-blue-700 transition-all"
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
        
        {/* Efeitos de Vitória */}
        {showVictoryEffects && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="victory-message">
              🎉 PARABÉNS! 🎉
            </div>
          </div>
        )}
      </div>
    );
  }

  // Copiar as outras telas (splash, welcome, initial) do código anterior...
  // [RESTO DO CÓDIGO PERMANECE IGUAL]
  
  return null;
}
