'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './styles.css';

export default function LuditeaMusical() {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [musicNotes, setMusicNotes] = useState<Array<{id: number, note: string, left: string, delay: number}>>([]);
  
  useEffect(() => {
    // Carregamento inicial
    setTimeout(() => setIsLoading(false), 1000);
    
    // Criar MUITAS notas musicais flutuantes
    const notes = ['♪', '♫', '♬', '♩', '🎵', '🎶', '🎼', '🎤', '🎸', '🥁', '🎹', '🎺'];
    const newNotes = Array.from({length: 20}, (_, i) => ({
      id: i,
      note: notes[Math.floor(Math.random() * notes.length)],
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 10
    }));
    setMusicNotes(newNotes);
  }, []);

  // Tela de Boas-Vindas com Mila
  if (showWelcome && !isLoading) {
    return (
      <div className="musical-game-container">
        <div className="music-notes">
          {musicNotes.map((note) => (
            <span 
              key={note.id} 
              className="note" 
              style={{
                left: note.left,
                animationDelay: `${note.delay}s`,
                fontSize: `${1.5 + Math.random() * 2}rem`
              }}
            >
              {note.note}
            </span>
          ))}
        </div>
        
        <div className="welcome-screen">
          <h1 className="game-title">🎵 LudiTEA Musical 🎵</h1>
          
          <div className="mascot-container">
            <Image 
              src="/images/mascotes/mila/mila_boas_vindas_resultado.webp"
              alt="Mila - Mascote do LudiTEA"
              width={300}
              height={300}
              className="mascot-image"
              priority
            />
            <div className="speech-bubble">
              <p>Olá! Eu sou a Mila! 🎭</p>
              <p>Vamos criar música juntos?</p>
              <p>Arraste os instrumentos para os personagens e monte sua banda!</p>
            </div>
          </div>
          
          <button 
            className="play-button"
            onClick={() => setShowWelcome(false)}
          >
            🎮 Vamos Tocar!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="musical-game-container">
      <div className="music-notes">
        {musicNotes.map((note) => (
          <span 
            key={note.id} 
            className="note" 
            style={{
              left: note.left,
              animationDelay: `${note.delay}s`,
              fontSize: `${1.5 + Math.random() * 2}rem`
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
              <div className="stage-area">
                {/* Aqui vamos adicionar os personagens */}
                <h3>🎭 Palco dos Personagens 🎭</h3>
                <div className="characters-container">
                  {/* Personagens virão aqui */}
                </div>
              </div>
              
              <div className="instruments-area">
                {/* Aqui vamos adicionar os instrumentos */}
                <h3>🎸 Instrumentos Disponíveis 🎸</h3>
                <div className="instruments-container">
                  {/* Instrumentos virão aqui */}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
