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
    // Criar sons usando Web Audio API
    this.createSound('click', 440, 0.1);
    this.createSound('correct', 523, 0.2);
    this.createSound('wrong', 196, 0.2);
    this.createSound('victory', 784, 0.3);
    this.createSound('coin', 659, 0.15);
  }
  
  createSound(name: string, frequency: number, duration: number) {
    // Usar oscilador para criar sons simples
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
    
    // Criar um data URL para o som
    const audio = new Audio();
    audio.volume = 0.5;
    
    // Simular som com data URL (beep simples)
    const beep = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZijgJGGm98OScTgwOUKzn47VgGAU7k9zyw3UpBSyAzvDaiTYIGWu+8OabTQ0OT6vm4bVfGAU8lN/ywHIiBi6F0fDYhjIJHm/A8OaZTQ0OTqzl4rVfGAU9md/yvnEmBSyE0fDYhDEJHnDB8OaXTQ0PT6/k4bVfGQU9md/yu3ElBi+G0fDYgjAJIHPC8OaVTQ0PT6/k4bVfGQU9md/yu3ElBi+G0fDYgjAJIHPC8OaVTQ0PT6/k4bVfGQU9md/yu3ElBi+G0fDYgjAJIHPC8OWVTQ0PT6/k4bVfGQU9md/yu3ElBi+G0fDYgjAJIHPC8OWVTg0OTqzm4bVeGQU9mt/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWq+8OmeTgwNT6vl4bVfGAU9mN/yxnkiBySA0fDaiTcIGWm98OicTgwOUKzl47RfGAU8mN/yxnkiBySA0fDaiTcIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIG2m98OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIGWm+8OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIGWm+8OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIGWm+8OmcTQ0NUKzl47RfGAU8mN/yxnkiBySA0fDaiTYIGWm+8OmcTQ0NUKzl47RfGAU8mN/yxnkiBw==`;
    
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
  
  // Inicializar sons
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
    const rect = document.querySelector('.game-board')?.getBoundingClientRect();
    
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
    
    // Mostrar a multiplicação que a IA está resolvendo
    setMessage(`🤖 IA resolvendo: ${problem.question} = ?`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const iaAnswer = await iaPlayer.makeMove(problem);
    const isCorrect = iaAnswer === problem.answer;
    
    // Mostrar feedback da resposta da IA
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
      
      // Mostrar mensagem de acerto
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
    
    const rect = document.querySelector('.game-board')?.getBoundingClientRect();
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

  // Tela Splash com Leo Mago
  if (gameState.status === 'splash') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Fundo Medieval Animado */}
        <div className="absolute inset-0 medieval-background">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 opacity-90"></div>
          <div className="castle-silhouette castle-1">🏰</div>
          <div className="castle-silhouette castle-2">🏯</div>
          <div className="castle-silhouette castle-3">🏛️</div>
        </div>
        
        {/* Conteúdo Principal */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          {/* Título do Jogo */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 text-center drop-shadow-2xl">
            <span className="text-yellow-400">⚔️</span> Conquista Matemática <span className="text-yellow-400">⚔️</span>
          </h1>
          
          {/* Leo Mago */}
          <div className="relative mb-8" style={{ width: '60vw', maxWidth: '400px' }}>
            <Image 
              src="/images/mascotes/leo/leo_mago_resultado.webp"
              alt="Leo Mago"
              width={400}
              height={400}
              className="drop-shadow-2xl"
              style={{ width: '100%', height: 'auto' }}
              priority
            />
            {/* Brilho mágico ao redor do Leo */}
            <div className="absolute inset-0 magic-glow"></div>
          </div>
          
          {/* Botão Iniciar */}
          <button
            onClick={() => {
              soundManager.current?.play('click');
              setGameState(prev => ({ ...prev, status: 'welcome' }));
            }}
            className="px-8 py-4 sm:px-12 sm:py-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 rounded-full text-xl sm:text-2xl font-bold hover:scale-110 transition-transform shadow-2xl animate-pulse"
          >
            🎮 COMEÇAR AVENTURA
          </button>
          
          {/* Texto Motivacional */}
          <p className="text-white/80 text-center mt-6 text-sm sm:text-base max-w-md">
            Prepare-se para uma jornada épica pelos reinos matemáticos!
          </p>
        </div>
      </div>
    );
  }
  
  // Tela de Escolha de Modo
  if (gameState.status === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-600">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white/95 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full text-center">
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ⚔️ Conquista Matemática ⚔️
            </h1>
            
            <div className="text-4xl sm:text-6xl mb-6">🏰</div>
            
            <p className="text-base sm:text-lg text-gray-700 mb-8">
              Conquiste territórios resolvendo multiplicações!<br/>
              Construa seu reino e torne-se o Rei da Matemática!
            </p>
            
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold">Escolha o Modo de Jogo:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    soundManager.current?.play('click');
                    setGameState(prev => ({ ...prev, mode: 'pvp', status: 'initial' }));
                  }}
                  className="p-4 sm:p-6 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all transform hover:scale-105"
                >
                  <div className="text-2xl sm:text-3xl mb-2">👥</div>
                  <div className="font-bold text-lg sm:text-xl">2 Jogadores</div>
                  <div className="text-xs sm:text-sm opacity-90">Desafie um amigo!</div>
                </button>
                
                <button
                  onClick={() => {
                    soundManager.current?.play('click');
                    setGameState(prev => ({ ...prev, mode: 'pve', status: 'initial' }));
                  }}
                  className="p-4 sm:p-6 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all transform hover:scale-105"
                >
                  <div className="text-2xl sm:text-3xl mb-2">🤖</div>
                  <div className="font-bold text-lg sm:text-xl">Contra IA</div>
                  <div className="text-xs sm:text-sm opacity-90">Desafie o computador!</div>
                </button>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <div className="coin-display mx-auto">
                <Coins size={20} />
                <span>{gameState.coins} Moedas</span>
              </div>
              {gameState.badges.length > 0 && (
                <div className="flex gap-2 justify-center flex-wrap">
                  {gameState.badges.map((badge, i) => (
                    <span key={i} className="badge text-xs">{badge}</span>
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
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-3 sm:p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => {
                soundManager.current?.play('click');
                setGameState(prev => ({ ...prev, status: 'welcome' }));
              }}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
            </button>
            <h1 className="text-base sm:text-xl font-bold">Escolha seu Reino</h1>
            <div className="coin-display scale-75 sm:scale-100">
              <Coins size={20} />
              <span>{gameState.coins}</span>
            </div>
          </div>
        </header>
        
        <main className="p-4 sm:p-6 max-w-4xl mx-auto">
          {/* Mapa do Reino */}
          <div className="kingdom-map mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">
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
                  <span className="text-2xl">{nivel.icone}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Seleção de Dificuldade da IA */}
          {gameState.mode === 'pve' && (
            <div className="bg-white rounded-xl p-4 sm:p-6 mb-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Escolha a Dificuldade da IA:</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    soundManager.current?.play('click');
                    setIaDifficulty('facil');
                  }}
                  className={`p-3 sm:p-4 rounded-lg font-medium transition-colors ${
                    iaDifficulty === 'facil'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-1">😊</div>
                  <div className="text-xs sm:text-sm">Iniciante Leo</div>
                </button>
                <button
                  onClick={() => {
                    soundManager.current?.play('click');
                    setIaDifficulty('medio');
                  }}
                  className={`p-3 sm:p-4 rounded-lg font-medium transition-colors ${
                    iaDifficulty === 'medio'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-1">🤓</div>
                  <div className="text-xs sm:text-sm">Leo Estudioso</div>
                </button>
                <button
                  onClick={() => {
                    soundManager.current?.play('click');
                    setIaDifficulty('dificil');
                  }}
                  className={`p-3 sm:p-4 rounded-lg font-medium transition-colors ${
                    iaDifficulty === 'dificil'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-1">🧙‍♂️</div>
                  <div className="text-xs sm:text-sm">Professor Leo</div>
                </button>
              </div>
            </div>
          )}
          
          {/* Seleção de Reino/Nível */}
          <div className="bg-white rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Selecione o Reino:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {niveis.map((nivel) => (
                <button
                  key={nivel.id}
                  onClick={() => {
                    soundManager.current?.play('click');
                    setNivelSelecionado(nivel.id);
                  }}
                  className={`p-4 sm:p-6 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    nivelSelecionado === nivel.id
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white scale-105'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: nivelSelecionado === nivel.id ? nivel.color : undefined
                  }}
                >
                  <div className="text-3xl sm:text-4xl mb-2">{nivel.icone}</div>
                  <div className="text-base sm:text-lg font-bold">{nivel.nome}</div>
                  <div className="text-xs sm:text-sm opacity-80">{nivel.dificuldade}</div>
                  <div className="mt-2 text-xs">
                    🪙 {nivel.id * 10} moedas por acerto
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-6 sm:mt-8">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-xl text-lg sm:text-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
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
                
                {/* Feedback da IA */}
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
          
          {/* Tabuleiro */}
          <div className="game-board mx-auto" style={{ maxWidth: '350px' }}>
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {gameState.board.map((cell, index) => (
                <button
                  key={index}
                  className={`territory-cell aspect-square ${
                    cell ? `conquered-${cell}` : ''
                  }`}
                  onClick={() => handleCellClick(index)}
                  disabled={!!cell || gameState.status !== 'playing' || iaThinking}
                  style={{ minHeight: '80px' }}
                >
                  {cell && (
                    <div className="castle-icon text-2xl sm:text-3xl">
                      {cell === 'X' ? '🏰' : '🏯'}
                    </div>
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
