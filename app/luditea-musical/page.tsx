'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './styles.css';
import { SoundEngine } from './soundEngine';

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

interface Challenge {
  level: number;
  name: string;
  description: string;
  requiredInstruments: string[];
  reward: string;
  completed: boolean;
}

const instruments: Instrument[] = [
  { id: 'guitar', icon: '🎸', name: 'Guitarra Rock', color: '#FF6B6B' },
  { id: 'drums', icon: '🥁', name: 'Bateria', color: '#4ECDC4' },
  { id: 'piano', icon: '🎹', name: 'Piano', color: '#95E77E' },
  { id: 'saxofone', icon: '🎷', name: 'Saxofone', color: '#FFD93D' },
  { id: 'violin', icon: '🎻', name: 'Violino', color: '#A8E6CF' },
  { id: 'shaker', icon: '🪇', name: 'Chocalho', color: '#FFB6C1' },
  { id: 'coral', icon: '🎤', name: 'Coral', color: '#FF69B4' },
  { id: 'flauta', icon: '🪈', name: 'Flauta', color: '#87CEEB' },
  { id: 'tambor', icon: '🪘', name: 'Tambor Tribal', color: '#8B4513' },
  { id: 'violao', icon: '🎸', name: 'Violão', color: '#D2691E' },
  { id: 'synth', icon: '🎛️', name: 'Sintetizador', color: '#E0BBE4' },
  { id: 'cymbal', icon: '🔔', name: 'Prato', color: '#FDB863' },
  { id: 'tambourine', icon: '🪘', name: 'Pandeiro', color: '#B4E7CE' },
];

// DESAFIOS DO JOGO
const challenges: Challenge[] = [
  {
    level: 1,
    name: "Primeira Banda",
    description: "Monte uma banda com 2 instrumentos!",
    requiredInstruments: ['any', 'any'],
    reward: "⭐",
    completed: false
  },
  {
    level: 2,
    name: "Trio Musical",
    description: "Use Bateria + mais 2 instrumentos!",
    requiredInstruments: ['drums', 'any', 'any'],
    reward: "⭐⭐",
    completed: false
  },
  {
    level: 3,
    name: "Banda de Rock",
    description: "Monte: Bateria + Guitarra + Violão!",
    requiredInstruments: ['drums', 'guitar', 'violao'],
    reward: "🏆",
    completed: false
  },
  {
    level: 4,
    name: "Orquestra",
    description: "Use: Violino + Flauta + Piano + Coral!",
    requiredInstruments: ['violin', 'flauta', 'piano', 'coral'],
    reward: "💎",
    completed: false
  },
  {
    level: 5,
    name: "Grande Maestro",
    description: "Use 6 instrumentos diferentes!",
    requiredInstruments: ['any', 'any', 'any', 'any', 'any', 'any'],
    reward: "👑",
    completed: false
  }
];

let soundEngine: SoundEngine | null = null;

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
  
  // ESTADOS DA GAMIFICAÇÃO
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      soundEngine = new SoundEngine();
    }
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // VERIFICAR DESAFIOS
  const checkChallenges = () => {
    const activeInstruments = characters
      .filter(c => c.instrument)
      .map(c => c.instrument!.id);
    
    if (activeInstruments.length === 0) return;
    
    challenges.forEach((challenge, index) => {
      if (completedChallenges.includes(challenge.level)) return;
      
      let isCompleted = false;
      
      if (challenge.level === 1 && activeInstruments.length >= 2) {
        isCompleted = true;
      } else if (challenge.level === 2) {
        isCompleted = activeInstruments.includes('drums') && activeInstruments.length >= 3;
      } else if (challenge.level === 3) {
        isCompleted = activeInstruments.includes('drums') && 
                     activeInstruments.includes('guitar') && 
                     activeInstruments.includes('violao');
      } else if (challenge.level === 4) {
        isCompleted = activeInstruments.includes('violin') && 
                     activeInstruments.includes('flauta') && 
                     activeInstruments.includes('piano') && 
                     activeInstruments.includes('coral');
      } else if (challenge.level === 5 && activeInstruments.length >= 6) {
        isCompleted = true;
      }
      
      if (isCompleted && !completedChallenges.includes(challenge.level)) {
        celebrateSuccess(challenge);
      }
    });
  };

  // CELEBRAÇÃO!
  const celebrateSuccess = (challenge: Challenge) => {
    setCompletedChallenges([...completedChallenges, challenge.level]);
    setScore(score + (challenge.level * 100));
    setRewardMessage(`PARABÉNS! ${challenge.name} Completo! ${challenge.reward}`);
    setShowReward(true);
    
    // Tocar som de sucesso
    const audio = new Audio('/sounds/sucess.wav');
    audio.play();
    
    setTimeout(() => setShowReward(false), 3000);
    
    if (challenge.level < 5) {
      setCurrentLevel(challenge.level + 1);
    }
  };

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
      if (soundEngine) {
        soundEngine.playFeedback('select');
      }
    }
  };

  const handleCharacterClick = (characterId: number) => {
    const character = characters.find(c => c.id === characterId);
    
    if (character?.instrument) {
      setAvailableInstruments([...availableInstruments, character.instrument]);
      setCharacters(characters.map(c => 
        c.id === characterId ? { ...c, instrument: null } : c
      ));
      
      if (soundEngine && isPlaying) {
        soundEngine.stopInstrumentLoop(character.instrument.id);
      }
      
      if (soundEngine) {
        soundEngine.playFeedback('remove');
      }
      return;
    }
    
    if (selectedInstrument) {
      const newCharacters = characters.map(c => 
        c.id === characterId ? { ...c, instrument: selectedInstrument } : c
      );
      setCharacters(newCharacters);
      setAvailableInstruments(availableInstruments.filter(i => i.id !== selectedInstrument.id));
      
      if (soundEngine && isPlaying) {
        soundEngine.startInstrumentLoop(selectedInstrument.id);
      }
      
      if (soundEngine) {
        soundEngine.playFeedback('place');
      }
      
      setSelectedInstrument(null);
      
      // Verificar desafios após adicionar instrumento
      setTimeout(() => checkChallenges(), 500);
    }
  };

  const handleReset = () => {
    setCharacters(Array.from({ length: 8 }, (_, i) => ({ id: i + 1, instrument: null })));
    setAvailableInstruments(instruments);
    setSelectedInstrument(null);
    setIsPlaying(false);
    if (soundEngine) {
      soundEngine.stopAll();
    }
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
      {/* EXPLOSÃO DE RECOMPENSA! */}
      {showReward && (
        <div className="reward-explosion">
          <div className="reward-message">{rewardMessage}</div>
          <div className="sparkles">✨💎⭐🎉🏆✨</div>
        </div>
      )}
      
      <header className="game-header-mobile">
        <h1>🎵 Desafio Musical 🎵</h1>
        <div className="score-display">
          🏆 Nível: {currentLevel} | ⭐ Pontos: {score}
        </div>
      </header>
      
      {/* CAIXA DE DESAFIO ATUAL */}
      <div className="challenge-box">
        <h3>🎯 Desafio Atual: {challenges[currentLevel - 1]?.name}</h3>
        <p>{challenges[currentLevel - 1]?.description}</p>
        <div className="progress-bar">
          {completedChallenges.map(level => (
            <span key={level} className="completed-star">⭐</span>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading">🎵 Afinando instrumentos...</div>
      ) : (
        <div className="game-area-mobile">
          <div className="characters-grid">
            {characters.map((character) => (
              <div 
                key={character.id}
                className={`character-card ${character.instrument ? 'has-instrument' : ''}`}
                onClick={() => handleCharacterClick(character.id)}
                style={{
                  backgroundColor: character.instrument ? character.instrument.color : '#74b9ff'
                }}
              >
                <div className="character-display">
                  {character.instrument ? (
                    <>
                      <span className="character-instrument">
                        {character.instrument.icon}
                      </span>
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
          
          <div className="instruments-section">
            <p className="instruction-text">
              {selectedInstrument 
                ? `✨ ${selectedInstrument.name} selecionado! Escolha um personagem.`
                : '👇 Escolha um instrumento para começar'}
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
          
          <div className="controls-mobile">
            <button 
              className={`control-button play ${isPlaying ? 'playing' : ''}`}
              onClick={() => {
                const newIsPlaying = !isPlaying;
                setIsPlaying(newIsPlaying);
                
                if (soundEngine) {
                  if (newIsPlaying) {
                    characters.forEach(char => {
                      if (char.instrument) {
                        soundEngine.startInstrumentLoop(char.instrument.id);
                      }
                    });
                  } else {
                    soundEngine.stopAll();
                  }
                }
              }}
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
