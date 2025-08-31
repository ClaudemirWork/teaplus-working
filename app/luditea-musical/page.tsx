'use client';

import { useState, useEffect } from 'react';
import './styles.css'; // vamos criar este arquivo depois

export default function LuditeaMusical() {
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  
  useEffect(() => {
    // Simular carregamento inicial
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <div className="musical-game-container">
      <h1 className="game-title">🎵 LudiTEA Musical 🎵</h1>
      
      {isLoading ? (
        <div className="loading">Carregando instrumentos...</div>
      ) : (
        <div className="game-area">
          {!gameStarted ? (
            <button 
              className="start-button"
              onClick={() => setGameStarted(true)}
            >
              🎮 Começar Jogo Musical
            </button>
          ) : (
            <div className="game-content">
              <p>Jogo iniciado! Vamos adicionar os personagens aqui.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
