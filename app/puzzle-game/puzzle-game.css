'use client';

import React, { useState, useEffect, useRef } from 'react';
import './puzzle-game.css';

interface PuzzlePiece {
  id: number;
  correctPosition: number;
  currentPosition: number | null;
  imageUrl: string;
  isEmpty?: boolean;
}

const PuzzleGame: React.FC = () => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [availablePieces, setAvailablePieces] = useState<PuzzlePiece[]>([]);
  const [gridSize, setGridSize] = useState(3);
  const [isComplete, setIsComplete] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Criar imagem de teste com Canvas
  useEffect(() => {
    createTestImage();
  }, [gridSize]);

  const createTestImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Tamanho da imagem completa
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Desenhar imagem de teste (um gatinho simples)
    // Fundo
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, size, size);

    // Sol
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(250, 50, 30, 0, Math.PI * 2);
    ctx.fill();

    // Grama
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, 200, size, 100);

    // Corpo do gato
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.ellipse(150, 150, 60, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cabeça do gato
    ctx.beginPath();
    ctx.arc(150, 100, 40, 0, Math.PI * 2);
    ctx.fill();

    // Orelhas
    ctx.beginPath();
    ctx.moveTo(120, 80);
    ctx.lineTo(110, 60);
    ctx.lineTo(130, 70);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(180, 80);
    ctx.lineTo(190, 60);
    ctx.lineTo(170, 70);
    ctx.fill();

    // Olhos
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(135, 95, 5, 0, Math.PI * 2);
    ctx.arc(165, 95, 5, 0, Math.PI * 2);
    ctx.fill();

    // Nariz
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.moveTo(150, 105);
    ctx.lineTo(145, 110);
    ctx.lineTo(155, 110);
    ctx.fill();

    // Bigodes
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(130, 105);
    ctx.moveTo(100, 110);
    ctx.lineTo(130, 110);
    ctx.moveTo(200, 100);
    ctx.lineTo(170, 105);
    ctx.moveTo(200, 110);
    ctx.lineTo(170, 110);
    ctx.stroke();

    // Cortar em peças
    cutImageIntoPieces(canvas, size);
  };

  const cutImageIntoPieces = (canvas: HTMLCanvasElement, size: number) => {
    const pieceSize = size / gridSize;
    const newPieces: PuzzlePiece[] = [];
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capturar imagem completa
    const fullImage = ctx.getImageData(0, 0, size, size);

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = pieceSize;
        pieceCanvas.height = pieceSize;
        const pieceCtx = pieceCanvas.getContext('2d');
        
        if (pieceCtx) {
          // Copiar pedaço da imagem
          pieceCtx.putImageData(
            fullImage,
            -col * pieceSize,
            -row * pieceSize
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

    // Embaralhar peças
    const shuffled = [...newPieces].sort(() => Math.random() - 0.5);
    setAvailablePieces(shuffled);

    // Criar grid vazio
    const emptyGrid = Array(gridSize * gridSize).fill(null).map((_, index) => ({
      id: -1,
      correctPosition: index,
      currentPosition: index,
      imageUrl: '',
      isEmpty: true
    }));
    setPieces(emptyGrid);
  };

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

    // Se já tem uma peça nessa posição, volta para disponíveis
    const existingPiece = newPieces[position];
    if (existingPiece && !existingPiece.isEmpty) {
      newAvailable.push(existingPiece);
    }

    // Colocar nova peça
    newPieces[position] = {
      ...draggedPiece,
      currentPosition: position
    };

    // Remover das disponíveis
    const availableIndex = newAvailable.findIndex(p => p.id === draggedPiece.id);
    if (availableIndex > -1) {
      newAvailable.splice(availableIndex, 1);
    }

    setPieces(newPieces);
    setAvailablePieces(newAvailable);
    setDraggedPiece(null);

    // Verificar se completou
    checkCompletion(newPieces);
  };

  const handlePieceClick = (piece: PuzzlePiece, fromGrid: boolean, position?: number) => {
    if (piece.isEmpty) return;

    const newPieces = [...pieces];
    const newAvailable = [...availablePieces];

    if (fromGrid && position !== undefined) {
      // Remover do grid e voltar para disponíveis
      newPieces[position] = {
        id: -1,
        correctPosition: position,
        currentPosition: position,
        imageUrl: '',
        isEmpty: true
      };
      newAvailable.push(piece);
    }

    setPieces(newPieces);
    setAvailablePieces(newAvailable);
  };

  const checkCompletion = (currentPieces: PuzzlePiece[]) => {
    const isCorrect = currentPieces.every((piece, index) => {
      if (piece.isEmpty) return false;
      return piece.correctPosition === index;
    });
    setIsComplete(isCorrect);
  };

  const resetGame = () => {
    createTestImage();
    setIsComplete(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            🧩 Quebra-Cabeça Teste
          </h1>
          <p className="text-gray-600">Arraste as peças para montar a imagem!</p>
        </div>

        {/* Controles */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {showGuide ? '👁️ Esconder' : '👁️ Mostrar'} Guia
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            🔄 Novo Jogo
          </button>
          <select
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="px-4 py-2 border-2 border-purple-300 rounded-lg"
          >
            <option value="3">3x3 (Fácil)</option>
            <option value="4">4x4 (Médio)</option>
            <option value="5">5x5 (Difícil)</option>
          </select>
        </div>

        {/* Área do Jogo */}
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
          
          {/* Grid do Quebra-Cabeça */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <div 
              className={`puzzle-grid grid gap-1 bg-gray-200 p-2 rounded-lg relative`}
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                width: '320px',
                height: '320px'
              }}
            >
              {/* Imagem guia de fundo */}
              {showGuide && (
                <canvas
                  ref={canvasRef}
                  className="absolute inset-2 opacity-20 pointer-events-none"
                  style={{ width: '304px', height: '304px' }}
                />
              )}
              
              {/* Células do grid */}
              {pieces.map((piece, index) => (
                <div
                  key={index}
                  className="puzzle-cell bg-white border-2 border-dashed border-gray-300 relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => handlePieceClick(piece, true, index)}
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
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Peças Disponíveis */}
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Peças Disponíveis:</h3>
            <div className="flex flex-wrap gap-2" style={{ maxWidth: '320px' }}>
              {availablePieces.map((piece) => (
                <div
                  key={piece.id}
                  className="cursor-move hover:scale-110 transition-transform border-2 border-purple-300 rounded"
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
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mensagem de Sucesso */}
        {isComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl text-center animate-bounce">
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                🎉 Parabéns! 🎉
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Você completou o quebra-cabeça!
              </p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg hover:bg-green-600"
              >
                Jogar Novamente
              </button>
            </div>
          </div>
        )}

        {/* Canvas oculto para processar imagem */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default PuzzleGame;
