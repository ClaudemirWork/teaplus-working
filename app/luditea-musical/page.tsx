'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './styles.css';

interface Instrument {
  id: string;
  icon: string;
  name: string;
  color: string;
}

interface Character {
  id: number;
  instrument: Instrument | null;
}

const instruments: Instrument[] = [
  { id: 'guitar', icon: '🎸', name: 'Guitarra', color: '#FF6B6B' },
  { id: 'drums', icon: '🥁', name: 'Bateria', color: '#4ECDC4' },
  { id: 'piano', icon: '🎹', name: 'Piano', color: '#95E77E' },
  { id: 'trumpet', icon: '🎺', name: 'Trompete', color: '#FFD93D' },
  { id: 'violin', icon: '🎻', name: 'Violino', color: '#A8E6CF' },
  { id: 'mic', icon: '🎤', name: 'Microfone', color: '#C9B6FF' },
];

export default function LuditeaMusical() {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [characters, setCharacters] = useState<Character[]>(
    Array.from({ length: 6 }, (_, i) => ({ id: i + 1, instrument: null }))
  );
  const [availableInstruments, setAvailableInstruments] = useState<Instrument[]>(instruments);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleInstrumentClick = (instrument: Instrument) => {
    if (availableInstruments.find(i => i.id === instrument.id)) {
      setSelectedInstrument(instrument);
    }
  };

  const handleCharacterClick = (characterId: number) => {
    const character = characters.find(c => c.id === characterId);
    
    // Se o personagem já tem instrumento, remove
    if (character?.instrument) {
      setAvailableInstruments([...availableInstruments, character.instrument]);
      setCharacters(characters.map(c => 
        c.id === characterId ? { ...c, instrument: null } : c
      ));
      return;
    }
    
    // Se há instrumento selecionado, adiciona ao personagem
    if (selectedInstrument) {
      setCharacters(characters.map(c => 
        c.id === characterId ? { ...c, instrument: selectedInstrument } : c
      ));
      setAvailableInstruments(availableInstruments.filter(i => i.id !== selectedInstrument.id));
      setSelectedInstrument(null);
      
      // Aqui iniciaria o som do instrumento
      console.log(`Personagem ${characterId} agora toca ${selectedInstrument.name}`);
    }
  };

  const handleReset = () => {
    setCharacters(Array.from({ length: 6 }, (_, i) => ({ id: i + 1, instrument: null })));
    setAvailableInstruments(instruments);
    setSelectedInstrument(null);
    setIsPlaying(false);
  };

  // Tela de Boas-Vindas com Mila
  if (showWelcome && !isLoading) {
    return (
      <div className="musical-game-container">
        <div className="welcome-screen-mobile">
          <h1 className="title-mobile">LudiTEA Musical</h1>
          
          <div className="mila-container-mobile">
            <Image 
              src="/images/mascotes/mila/mila_boas_vindas_resultado.webp"
              alt="Mila"
              width={200}
              height={200}
              className="mila-image"
              priority
            />
            <div className="speech-bubble-mobile">
              <p>Olá! Eu sou a Mila! 🎭</p>
              <p>Toque nos instrumentos e depois nos personagens para criar sua banda!</p>
            </div>
          </div>
          
          <button 
            className="play-button-mobile"
            onClick={() => setShowWelcome(false)}
          >
            🎮 JOGAR
          </button>
        </div>
      </div>
    );
  }

  // Tela Principal do Jogo
  return (
    <div className="musical-game-container">
      <header className="game-header-mobile">
        <h1>🎵 LudiTEA Musical 🎵</h1>
      </header>
      
      {isLoading ? (
        <div className="loading">Preparando...</div>
      ) : (
        <div className="game-area-mobile">
          {/* Área dos Personagens - Grade 2x3 */}
          <div className="characters-grid">
            {characters.map((character) => (
              <div 
                key={character.id}
                className={`character-card ${character.instrument ? 'has-instrument' : ''}`}
                onClick={() => handleCharacterClick(character.id)}
                style={{
                  backgroundColor: character.instrument ? character.instrument.color : '#f0f0f0'
                }}
              >
                <div className="character-display">
                  {character.instrument ? (
                    <>
                      <span className="character-instrument">{character.instrument.icon}</span>
                      <span className="character-label">{character.instrument.name}</span>
                    </>
                  ) : (
                    <>
                      <span className="character-empty">👤</span>
                      <span className="character-label">Vazio</span>
                    </>
                  )}
                </div>
                <span className="character-id">{character.id}</span>
              </div>
            ))}
          </div>
          
          {/* Área dos Instrumentos */}
          <div className="instruments-section">
            <p className="instruction-text">
              {selectedInstrument 
                ? `📍 ${selectedInstrument.name} selecionado! Toque em um personagem.`
                : '👇 Escolha um instrumento abaixo'}
            </p>
            
            <div className="instruments-grid">
              {availableInstruments.map((instrument) => (
                <div 
                  key={instrument.id}
                  className={`instrument-card ${
                    selectedInstrument?.id === instrument.id ? 'selected' : ''
                  }`}
                  onClick={() => handleInstrumentClick(instrument)}
                  style={{
                    opacity: selectedInstrument?.id === instrument.id ? 1 : 0.6,
                    backgroundColor: selectedInstrument?.id === instrument.id 
                      ? instrument.color 
                      : '#f5f5f5'
                  }}
                >
                  <span className="instrument-emoji">{instrument.icon}</span>
                  <span className="instrument-label">{instrument.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Controles */}
          <div className="controls-mobile">
            <button 
              className="control-button play"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? '⏸️ PAUSAR' : '▶️ TOCAR'}
            </button>
            <button 
              className="control-button reset"
              onClick={handleReset}
            >
              🔄 LIMPAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
