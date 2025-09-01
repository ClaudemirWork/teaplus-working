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
  { id: 'shaker', icon: '🪇', name: 'Chocalho', color: '#FFB6C1' },
  { id: 'synth', icon: '🎛️', name: 'Sintetizador', color: '#E0BBE4' },
  { id: 'cymbal', icon: '🔔', name: 'Prato', color: '#FDB863' },
  { id: 'tambourine', icon: '🪘', name: 'Pandeiro', color: '#B4E7CE' },
  { id: 'bass', icon: '🎵', name: 'Bumbo', color: '#957DAD' },
];

export default function LuditeaMusical() {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [characters, setCharacters] = useState<Character[]>(
    Array.from({ length: 8 }, (_, i) => ({ id: i + 1, instrument: null }))
  );
  const [availableInstruments, setAvailableInstruments] = useState<Instrument[]>(instruments);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const speakWelcomeText = () => {
    if ('speechSynthesis' in window && !isSpeaking) {
      setIsSpeaking(true);
      const text = 'Bem-vindo ao desafio musical! Você pode criar músicas e avançar nas fases do jogo, se tornando músico e conquistar o violão dourado. Basta clicar no instrumento que aparece abaixo dos personagens, e clicar em seguida em qualquer um deles. Pronto, este personagem começa a tocar aquele instrumento. E vá selecionando o instrumento primeiro, e quem deve tocar em seguida. Ao final, terá uma música criada por você. Vamos lá?';
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleInstrumentClick = (instrument: Instrument) => {
    if (availableInstruments.find(i => i.id === instrument.id)) {
      setSelectedInstrument(instrument);
    }
  };

  const handleCharacterClick = (characterId: number) => {
    const character = characters.find(c => c.id === characterId);
    
    if (character?.instrument) {
      setAvailableInstruments([...availableInstruments, character.instrument]);
      setCharacters(characters.map(c => 
        c.id === characterId ? { ...c, instrument: null } : c
      ));
      return;
    }
    
    if (selectedInstrument) {
      setCharacters(characters.map(c => 
        c.id === characterId ? { ...c, instrument: selectedInstrument } : c
      ));
      setAvailableInstruments(availableInstruments.filter(i => i.id !== selectedInstrument.id));
      setSelectedInstrument(null);
    }
  };

  const handleReset = () => {
    setCharacters(Array.from({ length: 8 }, (_, i) => ({ id: i + 1, instrument: null })));
    setAvailableInstruments(instruments);
    setSelectedInstrument(null);
    setIsPlaying(false);
  };

  if (showWelcome && !isLoading) {
    return (
      <div className="musical-game-container welcome-gradient">
        <div className="welcome-screen-mobile">
          <h1 className="title-mobile">🎵 Desafio Musical 🎵</h1>
          
          <div className="mila-container-mobile">
            <Image 
              src="/images/mascotes/mila/MIla_bateria.png"
              alt="Mila com Bateria"
              width={250}
              height={250}
              className="mila-image animated-bounce"
              priority
            />
            <div className="speech-bubble-mobile">
              <p className="welcome-text">
                <strong>Bem-vindo ao desafio musical!</strong> 🎉
              </p>
              <p className="welcome-text">
                Você pode criar músicas e avançar nas fases do jogo, se tornando músico e conquistar o <span className="golden-text">violão dourado</span>! 🏆
              </p>
              <p className="welcome-text">
                Basta clicar no instrumento que aparece abaixo dos personagens, e clicar em seguida em qualquer um deles - pronto!
              </p>
              <p className="welcome-text">
                Ao final, terá uma música criada por você. Vamos lá? 🎸
              </p>
              
              <button 
                className="audio-button"
                onClick={isSpeaking ? stopSpeaking : speakWelcomeText}
              >
                {isSpeaking ? '⏸️ Pausar' : '🔊 Ouvir Instruções'}
              </button>
            </div>
          </div>
          
          <button 
            className="play-button-mobile animated-pulse"
            onClick={() => {
              stopSpeaking();
              setShowWelcome(false);
            }}
          >
            🎮 COMEÇAR DESAFIO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="musical-game-container game-gradient">
      <header className="game-header-mobile">
        <h1>🎵 Desafio Musical 🎵</h1>
        <div className="score-display">
          🏆 Fase: 1 | 🎸 Pontos: 0
        </div>
      </header>
      
      {isLoading ? (
        <div className="loading">🎵 Afinando instrumentos...</div>
      ) : (
        <div className="game-area-mobile">
          <div className="characters-grid">
            {characters.map((character) => (
              <div 
                key={character.id}
                className={`character-card ${character.instrument ? 'has-instrument' : ''} ${character.instrument && isPlaying ? 'playing' : ''}`}
                onClick={() => handleCharacterClick(character.id)}
                style={{
                  backgroundColor: character.instrument ? character.instrument.color : '#f0f0f0'
                }}
              >
                <div className="character-display">
                  {character.instrument ? (
                    <>
                      <span className="character-instrument animated-music">
                        {character.instrument.icon}
                      </span>
                      <span className="character-label">{character.instrument.name}</span>
                    </>
                  ) : (
                    <>
                      <span className="character-empty">🎭</span>
                      <span className="character-label">Vazio</span>
                    </>
                  )}
                </div>
                <span className="character-id">{character.id}</span>
              </div>
            ))}
          </div>
          
          <div className="instruments-section">
            <p className="instruction-text">
              {selectedInstrument 
                ? `✨ ${selectedInstrument.name} selecionado! Escolha um personagem.`
                : '👇 Escolha um instrumento para começar'}
            </p>
            
            <div className="instruments-scroll">
              <div className="instruments-grid-expanded">
                {availableInstruments.map((instrument) => (
                  <div 
                    key={instrument.id}
                    className={`instrument-card ${
                      selectedInstrument?.id === instrument.id ? 'selected glowing' : ''
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
          </div>
          
          <div className="controls-mobile">
            <button 
              className={`control-button play ${isPlaying ? 'playing' : ''}`}
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
            <button 
              className="control-button volume"
              onClick={() => console.log('Volume control')}
            >
              🔊 SOM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
