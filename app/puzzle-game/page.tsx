'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import './puzzle-game.css';

interface PuzzlePiece {
  id: number;
  correctPosition: number;
  currentPosition: number | null;
  imageUrl: string;
  isEmpty?: boolean;
}

interface PuzzleImage {
  id: string;
  name: string;
  url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface GameStats {
  totalPoints: number;
  puzzlesCompleted: number;
  currentStreak: number;
}

const PuzzleGame: React.FC = () => {
  // Lista das 13 imagens disponíveis
  const puzzleImages: PuzzleImage[] = [
    { id: 'cachorrinho', name: '🐶 Cachorrinho', url: '/images/puzzles/cachorrinho.png', difficulty: 'easy', points: 100 },
    { id: 'gatinho', name: '🐱 Gatinho', url: '/images/puzzles/gatinho.png', difficulty: 'easy', points: 100 },
    { id: 'patinho', name: '🐤 Patinho', url: '/images/puzzles/patinho.png', difficulty: 'easy', points: 100 },
    { id: 'pinguim', name: '🐧 Pinguim', url: '/images/puzzles/pinguim.png', difficulty: 'easy', points: 100 },
    { id: 'urso', name: '🧸 Ursinho', url: '/images/puzzles/urso.png', difficulty: 'easy', points: 100 },
    { id: 'macaco', name: '🐵 Macaco', url: '/images/puzzles/macaco.png', difficulty: 'medium', points: 200 },
    { id: 'menina', name: '👧 Menina', url: '/images/puzzles/menina.png', difficulty: 'medium', points: 200 },
    { id: 'sol', name: '☀️ Sol', url: '/images/puzzles/sol.png', difficulty: 'medium', points: 200 },
    { id: 'carrinho', name: '🚗 Carrinho', url: '/images/puzzles/carrinho.png', difficulty: 'medium', points: 200 },
    { id: 'fusca', name: '🚙 Fusca', url: '/images/puzzles/fusca.png', difficulty: 'hard', points: 300 },
    { id: 'caminhao', name: '🚛 Caminhão', url: '/images/puzzles/caminhao.png', difficulty: 'hard', points: 300 },
    { id: 'cavalo', name: '🐴 Cavalinho', url: '/images/puzzles/cavalo-madeira.png', difficulty: 'hard', points: 300 },
    { id: 'urso-panda', name: '🐼 Panda', url: '/images/puzzles/urso-panda.png', difficulty: 'hard', points: 300 }
  ];

  // Estados do jogo
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'menu' | 'game'>('welcome');
  const [selectedImage, setSelectedImage] = useState<PuzzleImage | null>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [availablePieces, setAvailablePieces] = useState<PuzzlePiece[]>([]);
  const [gridSize, setGridSize] = useState(3);
  const [isComplete, setIsComplete] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Estatísticas do jogo
  const [gameStats, setGameStats] = useState<GameStats>({
    totalPoints: 0,
    puzzlesCompleted: 0,
    currentStreak: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar estatísticas salvas
  useEffect(() => {
    const savedStats = localStorage.getItem('puzzleGameStats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
  }, []);

  // Timer do jogo
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  // Formatar tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Processar imagem selecionada
  const processImage = (image: PuzzleImage) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      imageRef.current = img;
      cutImageIntoPieces(img);
      setIsTimerRunning(true);
    };
    
    img.src = image.url;
    setSelectedImage(image);
    setCurrentScreen('game');
    setMoves(0);
    setTimeElapsed(0);
  };

  // Cortar imagem em peças com fundo automático
  const cutImageIntoPieces = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 600;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cores de fundo suaves para imagens sem fundo
    const backgrounds = [
      '#FFE5E5', // rosa claro
      '#E5F3FF', // azul claro
      '#E5FFE5', // verde claro
      '#FFF9E5', // amarelo claro
      '#F3E5FF'  // lilás claro
    ];
    
    // Adicionar fundo aleatório
    ctx.fillStyle = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    ctx.fillRect(0, 0, size, size);

    // Centralizar e escalar imagem
    const scale = Math.min(size/img.width, size/img.height) * 0.9;
    const width = img.width * scale;
    const height = img.height * scale;
    const x = (size - width) / 2;
    const y = (size - height) / 2;

    ctx.drawImage(img, x, y, width, height);

    // Criar peças
    const pieceSize = size / gridSize;
    const newPieces: PuzzlePiece[] = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = pieceSize;
        pieceCanvas.height = pieceSize;
        const pieceCtx = pieceCanvas.getContext('2d');
        
        if (pieceCtx) {
          pieceCtx.drawImage(
            canvas,
            col * pieceSize,
            row * pieceSize,
            pieceSize,
            pieceSize,
            0,
            0,
            pieceSize,
            pieceSize
          );

          const piece: PuzzlePiece = {
            id: row * gridSize + col,
            correctPosition: row * gridSize + col,
            currentPosition: null,
            imageUrl: pieceCanvas.toDataURL()
          };
          newPieces.push(piece);
        }
      }
    }

    // Embaralhar
    const shuffled = [...newPieces].sort(() => Math.random() - 0.5);
    setAvailablePieces(shuffled);

    // Grid vazio
    const emptyGrid = Array(gridSize * gridSize).fill(null).map((_, index) => ({
      id: -1,
      correctPosition: index,
      currentPosition: index,
      imageUrl: '',
      isEmpty: true
    }));
    setPieces(emptyGrid);
  };

  // Criar confete
  const createConfetti = () => {
    setShowConfetti(true);
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
    
    setTimeout(() => setShowConfetti(false), 4000);
  };

  // Drag and Drop
  const handleDragStart = (piece: PuzzlePiece) => {
    setDraggedPiece(piece);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    if (!draggedPiece) return;

    const newPieces = [...pieces];
    const newAvailable = [...availablePieces];

    const existingPiece = newPieces[position];
    if (existingPiece && !existingPiece.isEmpty) {
      newAvailable.push(existingPiece);
    }

    newPieces[position] = {
      ...draggedPiece,
      currentPosition: position
    };

    const availableIndex = newAvailable.findIndex(p => p.id === draggedPiece.id);
    if (availableIndex > -1) {
      newAvailable.splice(availableIndex, 1);
    }

    setPieces(newPieces);
    setAvailablePieces(newAvailable);
    setDraggedPiece(null);
    setMoves(moves + 1);

    checkCompletion(newPieces);
  };

  // Touch support para mobile
  const handleTouchStart = (e: React.TouchEvent, piece: PuzzlePiece) => {
    e.preventDefault();
    setDraggedPiece(piece);
  };

  const handleTouchEnd = (e: React.TouchEvent, position: number) => {
    e.preventDefault();
    if (draggedPiece) {
      handleDrop(e as any, position);
    }
  };

  // Verificar conclusão
  const checkCompletion = (currentPieces: PuzzlePiece[]) => {
    const isCorrect = currentPieces.every((piece, index) => {
      if (piece.isEmpty) return false;
      return piece.correctPosition === index;
    });
    
    if (isCorrect && selectedImage) {
      setIsComplete(true);
      setIsTimerRunning(false);
      
      // Calcular pontos
      let points = selectedImage.points;
      const timeBonus = Math.max(0, 300 - timeElapsed) * 2;
      const moveBonus = Math.max(0, (gridSize * gridSize * 2) - moves) * 5;
      const totalPoints = points + timeBonus + moveBonus;
      
      // Atualizar estatísticas
      const newStats = {
        totalPoints: gameStats.totalPoints + totalPoints,
        puzzlesCompleted: gameStats.puzzlesCompleted + 1,
        currentStreak: gameStats.currentStreak + 1
      };
      setGameStats(newStats);
      localStorage.setItem('puzzleGameStats', JSON.stringify(newStats));
      
      // Efeitos visuais
      createConfetti();
    }
  };

  const resetGame = () => {
    setCurrentScreen('menu');
    setIsComplete(false);
    setPieces([]);
    setAvailablePieces([]);
    setSelectedImage(null);
    setIsTimerRunning(false);
    setTimeElapsed(0);
    setMoves(0);
  };

  // Tela de Boas-Vindas
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-400 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-lg">
          🧩 Quebra-Cabeça Mágico
        </h1>
        
        <div className="mb-8 animate-bounce">
          <Image 
            src="/images/mascotes/leo/leo_boas_vindas_resultado.webp"
            alt="Leo - Mascote"
            width={400}
            height={400}
            className="mx-auto drop-shadow-2xl"
            style={{ maxWidth: '60vw', height: 'auto' }}
          />
        </div>
        
        <button
          onClick={() => setCurrentScreen('menu')}
          className="px-12 py-6 bg-white text-purple-600 rounded-full text-3xl font-bold hover:scale-110 transition-transform shadow-2xl animate-pulse"
        >
          🎮 INICIAR
        </button>
        
        <div className="mt-8 text-white text-xl">
          <p>Pontos Total: {gameStats.totalPoints} ⭐</p>
          <p>Puzzles Completos: {gameStats.puzzlesCompleted} 🏆</p>
        </div>
      </div>
    </div>
  );

  // Menu de Seleção
  const MenuScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-purple-800 mb-2">
            Escolha seu Quebra-Cabeça!
          </h2>
          <p className="text-lg text-gray-600">
            Pontos Total: {gameStats.totalPoints} ⭐
          </p>
        </div>

        {/* Seletor de Dificuldade */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setGridSize(3)}
            className={`px-6 py-3 rounded-lg font-bold text-lg ${
              gridSize === 3 
                ? 'bg-green-500 text-white scale-110' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-all`}
          >
            Fácil (3x3)
          </button>
          <button
            onClick={() => setGridSize(4)}
            className={`px-6 py-3 rounded-lg font-bold text-lg ${
              gridSize === 4 
                ? 'bg-yellow-500 text-white scale-110' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-all`}
          >
            Médio (4x4)
          </button>
          <button
            onClick={() => setGridSize(5)}
            className={`px-6 py-3 rounded-lg font-bold text-lg ${
              gridSize === 5 
                ? 'bg-red-500 text-white scale-110' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } transition-all`}
          >
            Difícil (5x5)
          </button>
        </div>

        {/* Grid de Imagens */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {puzzleImages.map((image) => (
            <button
              key={image.id}
              onClick={() => processImage(image)}
              className="bg-white p-4 rounded-xl shadow-lg hover:scale-105 transition-transform hover:shadow-2xl"
            >
              <div className="text-4xl mb-2">{image.name.split(' ')[0]}</div>
              <div className="font-bold text-gray-700">{image.name.split(' ')[1]}</div>
              <div className="mt-2">
                <span className={`text-sm px-2 py-1 rounded ${
                  image.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  image.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {image.points} pontos
                </span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentScreen('welcome')}
          className="mt-8 px-6 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-colors"
        >
          Voltar
        </button>
      </div>
    </div>
  );

  // Tela do Jogo
  const GameScreen = () => (
    <div id="game-container" className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header com Status */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold">
              {selectedImage?.name} - {gridSize}x{gridSize}
            </div>
            <div className="flex gap-4">
              <span className="text-blue-600 font-bold">⏱️ {formatTime(timeElapsed)}</span>
              <span className="text-green-600 font-bold">🎯 {moves} movimentos</span>
              <span className="text-purple-600 font-bold">⭐ {gameStats.totalPoints} pts</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
          
          {/* Grid do Quebra-Cabeça */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between mb-4">
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                {showGuide ? '👁️ Esconder' : '👁️ Mostrar'} Guia
              </button>
              <button
                onClick={resetGame}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Desistir
              </button>
            </div>

            <div 
              className="puzzle-grid grid gap-1 bg-gray-200 p-2 rounded-lg relative"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                width: '320px',
                height: '320px'
              }}
            >
              {showGuide && (
                <canvas
                  ref={canvasRef}
                  className="absolute inset-2 opacity-20 pointer-events-none"
                  style={{ width: '304px', height: '304px' }}
                />
              )}
              
              {pieces.map((piece, index) => (
                <div
                  key={index}
                  className="puzzle-cell bg-white border-2 border-dashed border-gray-300 relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onTouchEnd={(e) => handleTouchEnd(e, index)}
                  style={{
                    width: `${300/gridSize}px`,
                    height: `${300/gridSize}px`
                  }}
                >
                  {!piece.isEmpty && (
                    <img
                      src={piece.imageUrl}
                      alt={`Peça ${piece.id}`}
                      className="absolute inset-0 w-full h-full cursor-move hover:scale-105 transition-transform"
                      draggable
                      onDragStart={() => handleDragStart(piece)}
                      onTouchStart={(e) => handleTouchStart(e, piece)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Peças Disponíveis */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Peças ({availablePieces.length} restantes):
            </h3>
            <div className="flex flex-wrap gap-2" style={{ maxWidth: '320px' }}>
              {availablePieces.map((piece) => (
                <div
                  key={piece.id}
                  className="cursor-move hover:scale-110 transition-transform border-2 border-purple-300 rounded shadow-md"
                  style={{
                    width: `${280/gridSize}px`,
                    height: `${280/gridSize}px`
                  }}
                >
                  <img
                    src={piece.imageUrl}
                    alt={`Peça ${piece.id}`}
                    className="w-full h-full"
                    draggable
                    onDragStart={() => handleDragStart(piece)}
                    onTouchStart={(e) => handleTouchStart(e, piece)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mensagem de Sucesso */}
        {isComplete && selectedImage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl text-center max-w-md">
              <h2 className="text-4xl font-bold text-green-600 mb-4">
                🎉 PARABÉNS! 🎉
              </h2>
              
              <div className="mb-6">
                <p className="text-2xl font-bold mb-2">Você conseguiu!</p>
                <p className="text-lg text-gray-600">{selectedImage.name}</p>
              </div>
              
              <div className="bg-yellow-100 rounded-lg p-4 mb-6">
                <p className="text-lg font-bold text-yellow-800 mb-2">Pontuação:</p>
                <p>Pontos Base: {selectedImage.points}</p>
                <p>Bônus de Tempo: {Math.max(0, 300 - timeElapsed) * 2}</p>
                <p>Bônus de Movimentos: {Math.max(0, (gridSize * gridSize * 2) - moves) * 5}</p>
                <p className="text-2xl font-bold text-yellow-900 mt-2">
                  Total: {selectedImage.points + Math.max(0, 300 - timeElapsed) * 2 + Math.max(0, (gridSize * gridSize * 2) - moves) * 5} pontos!
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg text-lg font-bold hover:bg-purple-600"
                >
                  Escolher Outro
                </button>
                <button
                  onClick={() => {
                    setIsComplete(false);
                    processImage(selectedImage);
                  }}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-bold hover:bg-green-600"
                >
                  Jogar Novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Canvas oculto */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );

  // Renderizar tela apropriada
  return currentScreen === 'welcome' ? <WelcomeScreen /> :
         currentScreen === 'menu' ? <MenuScreen /> :
         <GameScreen />;
};

export default PuzzleGame;
