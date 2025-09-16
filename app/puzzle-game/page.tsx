'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Save, Star, Trophy, Timer, Target, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabaseClient'; // <-- CORREÇÃO REALIZADA AQUI
import Image from 'next/image';

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
  emoji: string;
}

const PuzzleGame: React.FC = () => {
  const router = useRouter();
  const supabase = createClient();

  // Imagens do puzzle organizadas
  const puzzleImages: PuzzleImage[] = [
    { id: 'cachorrinho', name: 'Cachorrinho', emoji: '🐶', url: '/images/puzzle/cachorrinho.png', difficulty: 'easy', points: 100 },
    { id: 'gatinho', name: 'Gatinho', emoji: '🐱', url: '/images/puzzle/gatinho.png', difficulty: 'easy', points: 100 },
    { id: 'patinho', name: 'Patinho', emoji: '🐤', url: '/images/puzzle/patinho.png', difficulty: 'easy', points: 100 },
    { id: 'pinguim', name: 'Pinguim', emoji: '🐧', url: '/images/puzzle/pinguim.png', difficulty: 'easy', points: 100 },
    { id: 'urso', name: 'Ursinho', emoji: '🧸', url: '/images/puzzle/urso.png', difficulty: 'easy', points: 100 },
    { id: 'macaco', name: 'Macaco', emoji: '🐵', url: '/images/puzzle/macaco.png', difficulty: 'medium', points: 200 },
    { id: 'menina', name: 'Menina', emoji: '👧', url: '/images/puzzle/menina.png', difficulty: 'medium', points: 200 },
    { id: 'sol', name: 'Sol', emoji: '☀️', url: '/images/puzzle/sol.png', difficulty: 'medium', points: 200 },
    { id: 'carrinho', name: 'Carrinho', emoji: '🚗', url: '/images/puzzle/carrinho.png', difficulty: 'medium', points: 200 },
    { id: 'fusca', name: 'Fusca', emoji: '🚙', url: '/images/puzzle/fusca.png', difficulty: 'hard', points: 300 },
    { id: 'caminhao', name: 'Caminhão', emoji: '🚛', url: '/images/puzzle/caminhao.png', difficulty: 'hard', points: 300 },
    { id: 'cavalo', name: 'Cavalinho', emoji: '🐴', url: '/images/puzzle/cavalo-madeira.png', difficulty: 'hard', points: 300 },
    { id: 'urso-panda', name: 'Panda', emoji: '🐼', url: '/images/puzzle/urso-panda.png', difficulty: 'hard', points: 300 }
  ];

  // NOVO: Controle de telas
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
  
  // Estados salvos (para mostrar na tela inicial)
  const [totalPuzzlesCompleted, setTotalPuzzlesCompleted] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Estados do jogo
  const [selectedImage, setSelectedImage] = useState<PuzzleImage | null>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [availablePieces, setAvailablePieces] = useState<PuzzlePiece[]>([]);
  const [gridSize, setGridSize] = useState(3);
  const [isComplete, setIsComplete] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [draggedFromAvailable, setDraggedFromAvailable] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedPuzzles = localStorage.getItem('puzzleGame_totalCompleted');
    const savedBest = localStorage.getItem('puzzleGame_bestScore');
    
    if (savedPuzzles) setTotalPuzzlesCompleted(parseInt(savedPuzzles));
    if (savedBest) setBestScore(parseInt(savedBest));
  }, []);

  // Timer do jogo
  useEffect(() => {
    if (isTimerRunning && gameStarted) {
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
  }, [isTimerRunning, gameStarted]);

  // Formatar tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startActivity = (image: PuzzleImage) => {
    setCurrentScreen('game');
    setSelectedImage(image);
    setGameStarted(false);
    setShowResults(false);
    setIsComplete(false);
    setMoves(0);
    setTimeElapsed(0);
    setIsTimerRunning(false);
    processImage(image);
  };

  // Processar imagem selecionada
  const processImage = (image: PuzzleImage) => {
    setIsLoading(true);
    const img = new window.Image();
    
    img.onerror = () => {
      console.error('Erro ao carregar imagem:', image.url);
      alert('Erro ao carregar a imagem. Verifique se o arquivo existe.');
      setIsLoading(false);
    };
    
    img.onload = () => {
      console.log('Imagem carregada com sucesso:', image.url);
      imageRef.current = img;
      cutImageIntoPieces(img);
      setIsLoading(false);
    };
    
    img.src = image.url;
  };

  // Cortar imagem em peças
  const cutImageIntoPieces = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 450;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Cores de fundo suaves
    const backgrounds = ['#FFE5E5', '#E5F3FF', '#E5FFE5', '#FFF9E5', '#F3E5FF'];
    ctx.fillStyle = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    ctx.fillRect(0, 0, size, size);

    // Centralizar e escalar imagem
    const scale = Math.min(size/img.width, size/img.height) * 0.9;
    const width = img.width * scale;
    const height = img.height * scale;
    const x = (size - width) / 2;
    const y = (size - height) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
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
            imageUrl: pieceCanvas.toDataURL('image/jpeg', 0.8)
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

  const startGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setIsTimerRunning(true);
    }
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, piece: PuzzlePiece, fromAvailable: boolean) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedPiece(piece);
    setDraggedFromAvailable(fromAvailable);
    startGame(); // Inicia o timer no primeiro movimento
    
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    if (!draggedPiece) return;

    const newPieces = [...pieces];
    const newAvailable = [...availablePieces];

    // Se está arrastando de volta para as peças disponíveis
    if (position === -1) {
      const gridIndex = newPieces.findIndex(p => p.id === draggedPiece.id);
      if (gridIndex !== -1) {
        newPieces[gridIndex] = {
          id: -1,
          correctPosition: gridIndex,
          currentPosition: gridIndex,
          imageUrl: '',
          isEmpty: true
        };
        newAvailable.push(draggedPiece);
      }
    } else {
      const existingPiece = newPieces[position];
      
      if (existingPiece && !existingPiece.isEmpty) {
        newAvailable.push(existingPiece);
      }

      if (!draggedFromAvailable) {
        const oldPosition = newPieces.findIndex(p => p.id === draggedPiece.id);
        if (oldPosition !== -1 && oldPosition !== position) {
          newPieces[oldPosition] = {
            id: -1,
            correctPosition: oldPosition,
            currentPosition: oldPosition,
            imageUrl: '',
            isEmpty: true
          };
        }
      } else {
        const availableIndex = newAvailable.findIndex(p => p.id === draggedPiece.id);
        if (availableIndex > -1) {
          newAvailable.splice(availableIndex, 1);
        }
      }

      newPieces[position] = {
        ...draggedPiece,
        currentPosition: position
      };
    }

    setPieces(newPieces);
    setAvailablePieces(newAvailable);
    setDraggedPiece(null);
    setDraggedFromAvailable(false);
    setMoves(moves + 1);

    checkCompletion(newPieces);
  };

  // Click para remover peça
  const handlePieceClick = (piece: PuzzlePiece, position: number) => {
    if (piece.isEmpty) return;
    
    startGame(); // Inicia o timer no primeiro clique
    
    const newPieces = [...pieces];
    const newAvailable = [...availablePieces];
    
    newPieces[position] = {
      id: -1,
      correctPosition: position,
      currentPosition: position,
      imageUrl: '',
      isEmpty: true
    };
    
    newAvailable.push(piece);
    
    setPieces(newPieces);
    setAvailablePieces(newAvailable);
    setMoves(moves + 1);
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent, piece: PuzzlePiece, fromAvailable: boolean) => {
    e.preventDefault();
    setDraggedPiece(piece);
    setDraggedFromAvailable(fromAvailable);
    startGame();
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
      setFinalScore(totalPoints);
      
      // Salvar recordes
      const newPuzzles = totalPuzzlesCompleted + 1;
      setTotalPuzzlesCompleted(newPuzzles);
      localStorage.setItem('puzzleGame_totalCompleted', newPuzzles.toString());
      
      if (totalPoints > bestScore) {
        setBestScore(totalPoints);
        localStorage.setItem('puzzleGame_bestScore', totalPoints.toString());
      }
      
      setShowResults(true);
      createConfetti();
    }
  };

  // Criar confete
  const createConfetti = () => {
    // Simular confete com elementos DOM temporários
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8cc8'];
    
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = 'confetti-fall 3s linear forwards';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
      }, i * 50);
    }
  };

  const handleSaveSession = async () => {
    setSalvando(true);
    
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
          atividade_nome: 'Quebra-Cabeça Mágico',
          pontuacao_final: finalScore,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!

🧩 Resultado do Quebra-Cabeça:
- Imagem: ${selectedImage?.name}
- Dificuldade: ${gridSize}x${gridSize}
- Movimentos: ${moves}
- Tempo: ${formatTime(timeElapsed)}
- Pontuação: ${finalScore} pontos`);
        
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error);
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  };

  const voltarInicio = () => {
    setCurrentScreen('title');
    setShowResults(false);
    setGameStarted(false);
    setIsComplete(false);
    setPieces([]);
    setAvailablePieces([]);
    setSelectedImage(null);
  };

  // TELAS DO JOGO
  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-orange-300 via-yellow-400 to-red-400 overflow-hidden">
      {/* Peças de puzzle animadas no fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              fontSize: `${20 + Math.random() * 20}px`
            }}
          >
            🧩
          </div>
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 animate-bounce-slow">
          <Image 
            src="/images/mascotes/mila/mila_puzzle.webp" 
            alt="Mila Puzzle" 
            width={400} 
            height={400} 
            className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl" 
            priority 
            style={{ 
              filter: 'drop-shadow(0 0 20px rgba(234, 88, 12, 0.3))',
            }}
          />
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-2">
          Quebra-Cabeça
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-6 drop-shadow-md">
          Monte puzzles incríveis com Mila!
        </p>
        
        {/* Mostra estatísticas na tela inicial */}
        {(totalPuzzlesCompleted > 0 || bestScore > 0) && (
          <div className="bg-white/90 rounded-2xl p-6 mb-6 shadow-xl backdrop-blur-sm border border-orange-200">
            <div className="flex items-center gap-6">
              {totalPuzzlesCompleted > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                  <span className="font-bold text-orange-800">{totalPuzzlesCompleted} puzzles</span>
                </div>
              )}
              {bestScore > 0 && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <span className="font-bold text-orange-800">Recorde: {bestScore}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setCurrentScreen('instructions')} 
          className="text-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1 hover:shadow-2xl"
        >
          Começar Aventura dos Puzzles
        </button>
      </div>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-300">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center backdrop-blur-sm">
        <h2 className="text-4xl font-bold mb-6 text-orange-600">Como Jogar</h2>
        <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
          <p className="flex items-center gap-4">
            <span className="text-4xl">🧩</span>
            <span><b>Escolha uma imagem</b> e a dificuldade do puzzle!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🖱️</span>
            <span><b>Arraste as peças</b> das peças disponíveis para o grid!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">👆</span>
            <span><b>Clique nas peças</b> no grid para removê-las!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">👁️</span>
            <span><b>Use o guia</b> para ver a imagem original transparente!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">⏱️</span>
            <span><b>Seja rápido</b> para ganhar bônus de tempo e movimentos!</span>
          </p>
        </div>
        
        <button 
          onClick={() => setCurrentScreen('game')} 
          className="w-full text-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform"
        >
          Vamos Montar Puzzles!
        </button>
      </div>
    </div>
  );

  const GameScreen = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-100">
        <header className="bg-white/90 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setCurrentScreen('title')}
                className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
              </button>

              <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center">
                Quebra-Cabeça Mágico
              </h1>

              {showResults ? (
                <button
                  onClick={handleSaveSession}
                  disabled={salvando}
                  className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${
                    !salvando
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save size={18} />
                  <span className="hidden sm:inline">{salvando ? 'Salvando...' : 'Salvar'}</span>
                </button>
              ) : (
                <div className="w-24"></div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {!showResults && !selectedImage ? (
            <div className="space-y-6">
              {/* Seleção de Dificuldade */}
              <div className="bg-white/90 rounded-2xl p-4 shadow-xl border border-orange-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Escolha a Dificuldade:</h3>
                <div className="flex justify-center gap-4">
                  {[
                    { size: 3, name: 'Fácil', color: 'from-green-500 to-emerald-500', emoji: '😊' },
                    { size: 4, name: 'Médio', color: 'from-yellow-500 to-orange-500', emoji: '🎯' },
                    { size: 5, name: 'Difícil', color: 'from-red-500 to-pink-500', emoji: '🔥' }
                  ].map(level => (
                    <button
                      key={level.size}
                      onClick={() => setGridSize(level.size)}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${
                        gridSize === level.size
                          ? `bg-gradient-to-r ${level.color} text-white scale-110 shadow-lg`
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="text-2xl mb-1">{level.emoji}</div>
                      <div>{level.name}</div>
                      <div className="text-sm">({level.size}x{level.size})</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seleção de Imagem */}
              <div className="bg-white/90 rounded-2xl p-4 shadow-xl border border-orange-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Escolha sua Imagem:</h3>
                
                {/* Agrupado por dificuldade */}
                {['easy', 'medium', 'hard'].map(difficulty => (
                  <div key={difficulty} className="mb-6">
                    <h4 className={`text-lg font-semibold mb-3 ${
                      difficulty === 'easy' ? 'text-green-600' :
                      difficulty === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {difficulty === 'easy' ? '🟢 Fácil (100 pontos)' :
                       difficulty === 'medium' ? '🟡 Médio (200 pontos)' :
                       '🔴 Difícil (300 pontos)'}
                    </h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {puzzleImages
                        .filter(img => img.difficulty === difficulty)
                        .map(image => (
                          <button
                            key={image.id}
                            onClick={() => startActivity(image)}
                            className="bg-white p-4 rounded-xl shadow-md hover:scale-105 transition-transform hover:shadow-lg border-2 hover:border-orange-300"
                          >
                            <div className="text-3xl mb-2">{image.emoji}</div>
                            <div className="font-bold text-sm text-gray-700">{image.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{image.points}pts</div>
                          </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !showResults ? (
            <div className="space-y-4">
              {/* Status do jogo */}
              {gameStarted && (
                <div className="bg-white/90 rounded-2xl p-3 md:p-4 shadow-xl border border-orange-200">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div className="text-2xl">{selectedImage?.emoji}</div>
                      <div>
                        <div className="text-xs text-gray-600">Imagem</div>
                        <div className="font-bold text-orange-800 text-sm">{selectedImage?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Target className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-600">Grid</div>
                        <div className="font-bold text-blue-800">{gridSize}x{gridSize}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-5 h-5 text-green-600 flex items-center justify-center">🔄</div>
                      <div>
                        <div className="text-xs text-gray-600">Moves</div>
                        <div className="font-bold text-green-800">{moves}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Timer className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="text-xs text-gray-600">Tempo</div>
                        <div className="font-bold text-purple-800">{formatTime(timeElapsed)}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                      <div>
                        <div className="text-xs text-gray-600">Peças</div>
                        <div className="font-bold text-yellow-600">{availablePieces.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading */}
              {isLoading && (
                <div className="text-center py-8 bg-white/90 rounded-2xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Preparando seu puzzle...</p>
                </div>
              )}

              {/* Área do jogo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Grid do Puzzle */}
                <div className="bg-white/90 p-4 rounded-2xl shadow-xl border border-orange-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">Monte seu Puzzle:</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowGuide(!showGuide)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        {showGuide ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="hidden sm:inline">{showGuide ? 'Esconder' : 'Mostrar'}</span>
                      </button>
                      <button
                        onClick={voltarInicio}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                      >
                        Sair
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div 
                      className="relative bg-gray-200 p-2 rounded-lg"
                      style={{ width: '320px', height: '320px' }}
                    >
                      {/* Grid das peças */}
                      <div 
                        className="grid gap-0.5 relative"
                        style={{
                          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                          width: '304px',
                          height: '304px'
                        }}
                      >
                        {/* Canvas guia */}
                        {showGuide && (
                          <canvas
                            ref={canvasRef}
                            className="absolute inset-0 opacity-20 pointer-events-none rounded"
                            style={{ width: '304px', height: '304px' }}
                          />
                        )}
                        
                        {pieces.map((piece, index) => (
                          <div
                            key={index}
                            className={`bg-white border-2 ${piece.isEmpty ? 'border-dashed border-gray-300' : 'border-solid border-gray-400'} relative cursor-pointer hover:border-orange-500 transition-colors rounded`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onTouchEnd={(e) => handleTouchEnd(e, index)}
                            onClick={() => handlePieceClick(piece, index)}
                            style={{
                              width: `${300/gridSize}px`,
                              height: `${300/gridSize}px`
                            }}
                          >
                            {!piece.isEmpty && (
                              <img
                                src={piece.imageUrl}
                                alt={`Peça ${piece.id}`}
                                className="absolute inset-0 w-full h-full cursor-move hover:brightness-110 transition-all rounded"
                                draggable
                                onDragStart={(e) => handleDragStart(e, piece, false)}
                                onDragEnd={handleDragEnd}
                                onTouchStart={(e) => handleTouchStart(e, piece, false)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Clique na peça para remover ou arraste para posicionar
                  </p>
                </div>

                {/* Peças Disponíveis */}
                <div className="bg-white/90 p-4 rounded-2xl shadow-xl border border-orange-200">
                  <h3 className="font-bold text-gray-800 mb-4">
                    Peças Disponíveis ({availablePieces.length} restantes):
                  </h3>
                  
                  <div 
                    className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 min-h-[300px] flex flex-wrap gap-2 content-start"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, -1)}
                  >
                    {availablePieces.map((piece) => (
                      <div
                        key={piece.id}
                        className="cursor-move hover:scale-110 transition-transform border-2 border-orange-300 rounded shadow-md"
                        style={{
                          width: `${Math.min(80, 280/gridSize)}px`,
                          height: `${Math.min(80, 280/gridSize)}px`
                        }}
                      >
                        <img
                          src={piece.imageUrl}
                          alt={`Peça ${piece.id}`}
                          className="w-full h-full rounded"
                          draggable
                          onDragStart={(e) => handleDragStart(e, piece, true)}
                          onDragEnd={handleDragEnd}
                          onTouchStart={(e) => handleTouchStart(e, piece, true)}
                        />
                      </div>
                    ))}
                    
                    {availablePieces.length === 0 && (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-400 text-center">
                          🎉 Todas as peças foram usadas!<br/>
                          <span className="text-sm">Arraste peças aqui para remover do grid</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Tela de resultados
            <div className="bg-white/95 rounded-xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm border border-orange-200">
              <div className="text-center mb-6">
                <div className="text-5xl sm:text-6xl mb-4 animate-bounce">
                  {isComplete ? '🎉' : '🧩'}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  {isComplete ? 'Parabéns! Puzzle Completo!' : 'Puzzle Montado!'}
                </h3>
                
                <p className="text-lg text-orange-600 font-medium">
                  {selectedImage?.name} • {gridSize}x{gridSize} • {selectedImage?.points} pontos base
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-orange-800">
                    {finalScore}
                  </div>
                  <div className="text-xs text-orange-600">Pontuação Final</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-blue-800">
                    {moves}
                  </div>
                  <div className="text-xs text-blue-600">Movimentos</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-purple-800">
                    {formatTime(timeElapsed)}
                  </div>
                  <div className="text-xs text-purple-600">Tempo</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-green-800">
                    {selectedImage?.points}
                  </div>
                  <div className="text-xs text-green-600">Pontos Base</div>
                </div>
              </div>

              {/* Breakdown da pontuação */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">📊 Detalhamento:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Pontos Base:</span>
                    <span className="font-bold">{selectedImage?.points}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bônus de Tempo:</span>
                    <span className="font-bold">{Math.max(0, 300 - timeElapsed) * 2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bônus de Movimentos:</span>
                    <span className="font-bold">{Math.max(0, (gridSize * gridSize * 2) - moves) * 5}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">{finalScore}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    if (selectedImage) {
                      startActivity(selectedImage);
                    }
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  🔄 Jogar Novamente
                </button>
                
                <button
                  onClick={voltarInicio}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  🏠 Menu Principal
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Canvas oculto para processamento */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  };

  // Renderização condicional das telas
  if (currentScreen === 'title') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
};

// CSS para animações
const styles = `
  @keyframes bounce-slow {
    0%, 100% { 
      transform: translateY(0);
    }
    50% { 
      transform: translateY(-20px);
    }
  }
  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }
  
  @keyframes confetti-fall {
    to {
      transform: translateY(100vh) rotate(360deg);
    }
  }
`;

export default PuzzleGame;
