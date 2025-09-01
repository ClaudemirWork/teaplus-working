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
    setTimeout(() => setIsLoading(false), 1000);
    
    const notes = ['♪', '♫', '♬', '♩', '🎵', '🎶', '🎼', '🎤', '🎸', '🥁', '🎹', '🎺'];
    const newNotes = Array.from({length: 25}, (_, i) => ({
      id: i,
      note: notes[Math.floor(Math.random() * notes.length)],
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 15
    }));
    setMusicNotes(newNotes);
  }, []);

  // Tela de Boas-Vindas Melhorada
  if (showWelcome && !isLoading) {
    return (
      <div className="musical-game-container">
        <div className="music-notes-background">
          {musicNotes.map((note) => (
            <span 
              key={note.id} 
              className="floating-note" 
              style={{
                left: note.left,
                animationDelay: `${note.delay}s`,
                fontSize: `${1 + Math.random() * 1.5}rem`
              }}
            >
              {note.note}
            </span>
          ))}
        </div>
        
        <div className="welcome-content">
          <div className="title-section">
            <h1 className="main-title">LudiTEA Musical</h1>
            <div className="title-decoration">
              <span>🎸</span>
              <span>🎹</span>
              <span>🥁</span>
              <span>🎺</span>
              <span>🎤</span>
              <span>🎻</span>
            </div>
          </div>
          
          <div className="mila-section">
            <Image 
              src="/images/mascotes/mila/mila_boas_vindas_resultado.webp"
              alt="Mila"
              width={250}
              height={250}
              className="mila-welcome"
              priority
            />
            <div className="mila-speech">
              <h2>Olá, eu sou a Mila! 🎭</h2>
              <p>Vamos criar músicas incríveis juntos!</p>
              <p>Monte sua banda arrastando instrumentos!</p>
            </div>
          </div>
          
          <button 
            className="start-game-btn"
            onClick={() => setShowWelcome(false)}
          >
            <span className="btn-icon">🎮</span>
            <span className="btn-text">JOGAR AGORA</span>
          </button>
        </div>
      </div>
    );
  }

  // Tela do Jogo Principal
  return (
    <div className="musical-game-container">
      <div className="music-notes-background">
        {musicNotes.map((note) => (
          <span 
            key={note.id} 
            className="floating-note" 
            style={{
              left: note.left,
              animationDelay: `${note.delay}s`,
              fontSize: `${0.8 + Math.random() * 1}rem`,
              opacity: 0.1
            }}
          >
            {note.note}
          </span>
        ))}
      </div>
      
      <div className="game-header">
        <h1 className="game-logo">🎵 LudiTEA Musical 🎵</h1>
      </div>
      
      {isLoading ? (
        <div className="loading">
          🎸 Preparando o palco... 🥁
        </div>
      ) : (
        <>
          {!gameStarted ? (
            <div className="pre-game">
              <button 
                className="big-play-btn"
                onClick={() => setGameStarted(true)}
              >
                ▶️ INICIAR
              </button>
            </div>
          ) : (
            <div className="game-stage">
              {/* Área dos Personagens */}
              <div className="characters-row">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="character-slot">
                    <div className="character-body">
                      <div className="character-face">
                        {/* Rosto simples */}
                        <div className="eyes">
                          <span>👀</span>
                        </div>
                        <div className="character-number">{num}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Área dos Instrumentos - ABAIXO dos personagens */}
              <div className="instruments-row">
                <div className="instrument-item" draggable="true">
                  <span className="instrument-icon">🎸</span>
                  <span className="instrument-name">Guitarra</span>
                </div>
                <div className="instrument-item" draggable="true">
                  <span className="instrument-icon">🥁</span>
                  <span className="instrument-name">Bateria</span>
                </div>
                <div className="instrument-item" draggable="true">
                  <span className="instrument-icon">🎹</span>
                  <span className="instrument-name">Piano</span>
                </div>
                <div className="instrument-item" draggable="true">
                  <span className="instrument-icon">🎺</span>
                  <span className="instrument-name">Trompete</span>
                </div>
                <div className="instrument-item" draggable="true">
                  <span className="instrument-icon">🎻</span>
                  <span className="instrument-name">Violino</span>
                </div>
                <div className="instrument-item" draggable="true">
                  <span className="instrument-icon">🎤</span>
                  <span className="instrument-name">Microfone</span>
                </div>
              </div>
              
              {/* Controles do Jogo */}
              <div className="game-controls">
                <button className="control-btn play-btn">▶️ TOCAR</button>
                <button className="control-btn pause-btn">⏸️ PAUSAR</button>
                <button className="control-btn reset-btn">🔄 LIMPAR</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
