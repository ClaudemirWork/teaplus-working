'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, Save, Star, Trophy } from 'lucide-react';
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

let soundEngine: SoundEngine | null = null;

export default function LuditeaMusical() {
  // NOVO: Controle de telas
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
  
  // Estados existentes do jogo
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [characters, setCharacters] = useState<Character[]>(
    Array.from({ length: 8 }, (_, i) => ({ id: i + 1, instrument: null }))
  );
  const [availableInstruments, setAvailableInstruments] = useState<Instrument[]>(instruments);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [showGoldenGuitar, setShowGoldenGuitar] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  // Estados para estatísticas (salvos localmente)
  const [totalSongsCreated, setTotalSongsCreated] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      soundEngine = new SoundEngine();
      
      // Carregar estatísticas salvas
      const savedSongs = localStorage.getItem('luditeaMusical_totalSongs');
      const savedBest = localStorage.getItem('luditeaMusical_bestScore');
      
      if (savedSongs) setTotalSongsCreated(parseInt(savedSongs));
      if (savedBest) setBestScore(parseInt(savedBest));
    }
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const launchConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  };

  const checkAchievement = () => {
    const activeInstruments = characters.filter(c => c.instrument).length;
    
    if (activeInstruments === 2 && score === 0) {
      setScore(100);
      setRewardMessage('⭐ Primeira Banda! +100 pontos! ⭐');
      setShowReward(true);
      launchConfetti();
      
      // Tocar som de sucesso
      const audio = new Audio('/sounds/sucess.wav');
      audio.play();
      
      setTimeout(() => setShowReward(false), 3000);
      
    } else if (activeInstruments === 4 && score === 100) {
      setScore(300);
      setRewardMessage('⭐⭐ Banda Completa! +200 pontos! ⭐⭐');
      setShowReward(true);
      launchConfetti();
      
      const audio = new Audio('/sounds/sucess.wav');
      audio.play();
      
      setTimeout(() => setShowReward(false), 3000);
      
    } else if (activeInstruments === 6 && score === 300) {
      setScore(600);
      setShowGoldenGuitar(true);
      launchConfetti();
      
      // Salvar nova música criada
      const newTotal = totalSongsCreated + 1;
      setTotalSongsCreated(newTotal);
      localStorage.setItem('luditeaMusical_totalSongs', newTotal.toString());
      
      // Salvar melhor pontuação
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem('luditeaMusical_bestScore', score.toString());
      }
      
      const audio = new Audio('/sounds/sucess.wav');
      audio.play();
      
      setTimeout(() => setShowGoldenGuitar(false), 5000);
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
      setCharacters(characters.map(c => 
        c.id === characterId ? { ...c, instrument: selectedInstrument } : c
      ));
      setAvailableInstruments(availableInstruments.filter(i => i.id !== selectedInstrument.id));
      
      if (soundEngine && isPlaying) {
        soundEngine.startInstrumentLoop(selectedInstrument.id);
      }
      
      if (soundEngine) {
        soundEngine.playFeedback('place');
      }
      
      setSelectedInstrument(null);
      
      setTimeout(() => checkAchievement(), 500);
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

  const startActivity = () => {
    setCurrentScreen('game');
    setScore(0);
    handleReset(); // Reset do jogo
  };

  const voltarInicio = () => {
    setCurrentScreen('title');
    handleReset();
  };

  // TELAS DO JOGO
  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 overflow-hidden">
      {/* Notas musicais de fundo animadas */}
      <div className="absolute inset-0 overflow-hidden">
        {['🎵', '🎶', '🎼', '♪', '♫'].map((note, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
              fontSize: '2rem',
              opacity: 0.3
            }}
          >
            {note}
          </div>
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 animate-bounce-slow">
          <Image 
            src="/images/mascotes/mila/MIla_bateria.png" 
            alt="Mila com Bateria" 
            width={450} 
            height={450} 
            className="w-[300px] h-auto sm:w-[380px] md:w-[450px] drop-shadow-2xl filter brightness-110" 
            priority 
          />
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
          Desafio Musical
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-4 drop-shadow-md max-w-2xl">
          🎵 Crie sua banda e toque músicas incríveis! 🎶
        </p>
        
        {/* Mostra estatísticas na tela inicial */}
        {(totalSongsCreated > 0 || bestScore > 0) && (
          <div className="bg-white/80 rounded-2xl p-4 mb-4 shadow-xl">
            <div className="flex items-center gap-4">
              {totalSongsCreated > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎵</span>
                  <span className="font-bold text-purple-800">{totalSongsCreated} músicas criadas</span>
                </div>
              )}
              {bestScore > 0 && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <span className="font-bold text-purple-800">Melhor: {bestScore} pontos</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setCurrentScreen('instructions')} 
          className="text-xl font-bold text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1"
        >
          Começar Aventura Musical
        </button>
      </div>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-purple-600">Como Jogar</h2>
        <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
          <p className="flex items-center gap-4">
            <span className="text-4xl">🎸</span>
            <span><b>Escolha um instrumento</b> clicando nele!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">👤</span>
            <span><b>Clique em um personagem</b> para ele tocar o instrumento!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🎵</span>
            <span><b>Monte sua banda</b> adicionando mais músicos!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">▶️</span>
            <span><b>Aperte TOCAR</b> para ouvir sua criação musical!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🏆</span>
            <span><b>Conquiste o violão dourado</b> criando bandas completas!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🔊</span>
            <span><b>Use fones de ouvido</b> para uma experiência melhor!</span>
          </p>
        </div>
        
        <button 
          onClick={startActivity} 
          className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform"
        >
          Vamos criar música! 🎼
        </button>
      </div>
    </div>
  );

  const GameScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      {/* CONFETES */}
      {confettiActive && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffd93d', '#95e77e', '#a8e6cf'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}
      
      {/* MENSAGEM DE RECOMPENSA */}
      {showReward && (
        <div className="reward-popup">
          <div className="reward-message-animated">
            {rewardMessage}
          </div>
        </div>
      )}
      
      {/* VIOLÃO DOURADO */}
      {showGoldenGuitar && (
        <div className="golden-guitar-container">
          <div className="golden-guitar">🎸</div>
          <div className="golden-message">
            🌟 PARABÉNS! VOCÊ É UM MÚSICO! 🌟
            <br/>
            <span className="golden-subtitle">Conquistou o Violão Dourado!</span>
          </div>
          <div className="stars-decoration">
            ⭐ ⭐ ⭐ ⭐ ⭐
          </div>
        </div>
      )}

      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={voltarInicio}
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
            </button>

            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
              🎵
              <span>Desafio Musical</span>
            </h1>

            <div className="flex items-center gap-2">
              <div className="bg-purple-100 px-3 py-1 rounded-full">
                <span className="text-purple-800 font-bold">🏆 {score} pontos</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-2xl text-purple-600 animate-pulse">🎵 Afinando instrumentos...</div>
        </div>
      ) : (
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            {/* Grid de Personagens */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎭 Sua Banda Musical</h3>
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
            </div>
            
            {/* Instrumentos Disponíveis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎼 Instrumentos Disponíveis</h3>
              <p className="instruction-text text-center mb-4">
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
                      opacity: selectedInstrument?.id === instrument.id ? 1 : 0.8,
                      backgroundColor: selectedInstrument?.id === instrument.id 
                        ? instrument.color 
                        : '#f8f9fa',
                      transform: selectedInstrument?.id === instrument.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <span className="instrument-emoji">{instrument.icon}</span>
                    <span className="instrument-label">{instrument.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Controles */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎮 Controles</h3>
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
                <button 
                  className="control-button audio"
                  onClick={isSpeaking ? stopSpeaking : speakWelcomeText}
                >
                  {isSpeaking ? '⏸️ Pausar' : '🔊 Instruções'}
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .characters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          max-width: 800px;
          margin: 0 auto;
        }

        .character-card {
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          position: relative;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .character-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .character-display {
          text-align: center;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .character-instrument, .character-empty {
          font-size: 2.5rem;
          margin-bottom: 8px;
        }

        .character-label {
          font-weight: 700;
          color: white;
          font-size: 0.9rem;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .character-id {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255,255,255,0.8);
          color: #333;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
        }

        .instruments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          max-width: 900px;
          margin: 0 auto;
        }

        .instrument-card {
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
          border: 3px solid transparent;
        }

        .instrument-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        .instrument-card.selected {
          border-color: #666;
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
        }

        .instrument-emoji {
          font-size: 2rem;
          margin-bottom: 8px;
          display: block;
        }

        .instrument-label {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }

        .controls-mobile {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .control-button {
          padding: 12px 24px;
          border-radius: 25px;
          border: none;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          min-width: 140px;
        }

        .control-button.play {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
        }

        .control-button.play.playing {
          background: linear-gradient(45deg, #FF9800, #F57C00);
        }

        .control-button.reset {
          background: linear-gradient(45deg, #f44336, #d32f2f);
          color: white;
        }

        .control-button.audio {
          background: linear-gradient(45deg, #2196F3, #1976D2);
          color: white;
        }

        .control-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .instruction-text {
          font-size: 1.1rem;
          color: #555;
          font-weight: 500;
        }

        /* Animações de recompensa */
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s linear forwards;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .reward-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2000;
          pointer-events: none;
        }

        .reward-message-animated {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #333;
          padding: 20px 30px;
          border-radius: 20px;
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          animation: reward-bounce 0.6s ease-out;
        }

        @keyframes reward-bounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .golden-guitar-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2000;
          text-align: center;
          pointer-events: none;
        }

        .golden-guitar {
          font-size: 8rem;
          animation: golden-spin 2s ease-in-out infinite;
        }

        .golden-message {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #333;
          padding: 30px;
          border-radius: 20px;
          font-size: 1.8rem;
          font-weight: bold;
          margin-top: 20px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }

        .golden-subtitle {
          font-size: 1.2rem;
          display: block;
          margin-top: 10px;
        }

        .stars-decoration {
          font-size: 2rem;
          margin-top: 15px;
          animation: sparkle 1s ease-in-out infinite alternate;
        }

        @keyframes golden-spin {
          0%, 100% { transform: rotateZ(0deg) scale(1); }
          50% { transform: rotateZ(10deg) scale(1.1); }
        }

        @keyframes sparkle {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        /* Responsividade */
        @media (max-width: 640px) {
          .characters-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          
          .instruments-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          
          .control-button {
            min-width: 120px;
            font-size: 0.9rem;
            padding: 10px 20px;
          }
          
          .golden-guitar {
            font-size: 5rem;
          }
          
          .golden-message {
            font-size: 1.3rem;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );

  // Renderização condicional das telas
  if (currentScreen === 'title') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
}
