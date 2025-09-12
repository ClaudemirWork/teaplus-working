'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// --- Configurações do Jogo ---

// 1. A paleta de cores. O primeiro item (índice 0) é o "vazio".
const COLORS = [
  'bg-gray-200 hover:bg-gray-300', // 0: Vazio
  'bg-blue-500',                   // 1: Azul
  'bg-yellow-400',                 // 2: Amarelo
  'bg-green-500',                  // 3: Verde
];

// 2. O padrão que a criança deve copiar. Usamos os índices do array COLORS.
// Este é um padrão simples de "casa".
const MODEL_PATTERN = [
  [0, 0, 2, 0, 0],
  [0, 2, 2, 2, 0],
  [2, 2, 2, 2, 2],
  [0, 1, 1, 1, 0],
  [0, 1, 0, 1, 0],
];

// --- Componente do Jogo ---

export default function PatternExplorerPOC() {
  // Cria um grid inicial para o jogador, todo "vazio" (preenchido com 0)
  const initialPlayerPattern = Array(MODEL_PATTERN.length)
    .fill(0)
    .map(() => Array(MODEL_PATTERN[0].length).fill(0));

  const [playerPattern, setPlayerPattern] = useState(initialPlayerPattern);
  const [isComplete, setIsComplete] = useState(false);

  // Função para lidar com o clique em um quadrado
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (isComplete) return; // Não permite mais cliques após completar

    // Cria uma cópia do grid do jogador para não modificar o estado diretamente
    const newPlayerPattern = playerPattern.map(row => [...row]);

    // Pega a cor atual e calcula a próxima
    const currentColorIndex = newPlayerPattern[rowIndex][colIndex];
    const nextColorIndex = (currentColorIndex + 1) % COLORS.length;

    // Atualiza o grid com a nova cor
    newPlayerPattern[rowIndex][colIndex] = nextColorIndex;
    setPlayerPattern(newPlayerPattern);
  };

  // Efeito que roda toda vez que o jogador clica em um quadrado
  useEffect(() => {
    // Compara o grid do jogador com o modelo
    const playerGridString = JSON.stringify(playerPattern);
    const modelGridString = JSON.stringify(MODEL_PATTERN);

    if (playerGridString === modelGridString) {
      setIsComplete(true);
      // Dispara uma celebração!
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [playerPattern]);

  // Função para renderizar um grid (seja o modelo ou o do jogador)
  const renderGrid = (pattern: number[][], isInteractive: boolean) => (
    <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
      <div className="grid grid-cols-5 gap-1">
        {pattern.map((row, rowIndex) =>
          row.map((colorIndex, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-md transition-colors duration-150 ${COLORS[colorIndex]} ${
                isInteractive ? 'cursor-pointer' : ''
              }`}
              onClick={() => isInteractive && handleCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Protótipo: Exploradores de Padrões</h1>
        <p className="text-gray-600 mt-2">Clique nos quadrados para mudar a cor e recriar o modelo.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Grid do Modelo */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Modelo</h2>
          {renderGrid(MODEL_PATTERN, false)}
        </div>

        {/* Grid do Jogador */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Seu Mosaico</h2>
          {renderGrid(playerPattern, true)}
        </div>
      </div>

      {/* Mensagem de Sucesso */}
      {isComplete && (
        <div className="mt-8 bg-green-100 border-2 border-green-500 text-green-800 font-bold text-2xl p-6 rounded-xl shadow-lg animate-bounce">
          🎉 Parabéns, você conseguiu! 🎉
        </div>
      )}
    </div>
  );
}
