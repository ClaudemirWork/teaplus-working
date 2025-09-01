'use client';

import { useState, useEffect } from 'react';
import './styles.css';

export default function LuditeaMusical() {
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [musicNotes, setMusicNotes] = useState<Array<{id: number, note: string, left: string}>>([]);
  
  useEffect(() => {
    // Simular carregamento inicial
    setTimeout(() => setIsLoading(false), 1000);
    
    // Criar notas musicais flutuantes
    const notes = ['♪', '♫', '♬', '♩'];
    const newNotes = Array.from({length: 5}, (_, i) => ({
      id: i,
      note: notes[Math.floor(Math.random() * notes.length)],
      left: `${Math.random() * 100}%`
    }));
    setMusicNotes(newNotes);
  }, []);

  return (
    <div className="musical-game-container">
      <div className="music-notes">
        {musicNotes.map((note, index) => (
          <span 
            key={note.id} 
            className="note" 
            style={{
              left: note.left,
              animationDelay: `${index * 2}s`
            }}
          >
            {note.note}
          </span>
        ))}
      </div>
      
      <h1 className="game-title">🎵 LudiTEA Musical 🎵</h1>
      
      {isLoading ? (
        <div className="loading">
          🎸 Carregando instrumentos... 🥁
        </div>
      ) : (
        <div className="game-area">
          {!gameStarted ? (
            <div>
              <h2 style={{textAlign: 'center', color: '#2d3436', marginBottom: '20px'}}>
                🎼 Bem-vindo ao mundo musical! 🎼
              </h2>
              <p style={{textAlign: 'center', color: '#636e72', marginBottom: '30px'}}>
                Arraste instrumentos para os personagens e crie sua própria banda!
              </p>
              <button 
                className="start-button"
                onClick={() => setGameStarted(true)}
              >
                🎮 Começar Aventura Musical
              </button>
            </div>
          ) : (
            <div className="game-content">
              <p>🎭 Jogo iniciado! Vamos adicionar os personagens aqui.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
