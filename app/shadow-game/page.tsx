'use client';
import React, { useState, useEffect, useRef } from 'react';
import './shadowgame.css';
import Image from 'next/image';
import { Trophy, Star, ArrowLeft, Volume2, VolumeX } from 'lucide-react';

// ======================
// TIPOS
// ======================
type GameState = 'loading' | 'intro' | 'instructions' | 'phase-selection' | 'playing';
type RoundType = 'imageToShadow' | 'shadowToImage';

// ======================
// LISTA DE IMAGENS
// ======================
const imageNames = [
  'abacate', 'abelha', 'abelha_voando', 'aguia', 'amigos',
  'arvore_natal', 'baleia', 'bicicleta', 'borboleta', 'cachorro',
  'casa', 'cavalo', 'elefante', 'flor', 'gato', 'girassol',
  'leao', 'passaro', 'peixe', 'sol', 'tartaruga', 'urso',
  'vaca', 'zebra', 'coelho', 'formiga', 'galinha'
];

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// ======================
// COMPONENTE PRINCIPAL
// ======================
export default function ShadowGamePage() {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [roundData, setRoundData] = useState<{ mainItem: string; options: string[]; correctAnswer: string } | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioManagerRef = useRef<any>(null);

  // ======================
  // INICIALIZAÇÃO
  // ======================
  useEffect(() => {
    const init = async () => {
      try {
        const { GameAudioManager } = await import('@/utils/gameAudioManager');
        audioManagerRef.current = GameAudioManager.getInstance();
        console.log('🎮 GameAudioManager pronto');
      } catch (err) {
        console.warn('⚠️ GameAudioManager não carregado:', err);
      }
      setGameState('intro');
    };
    init();
  }, []);

  // ======================
  // VOZ DO LEO
  // ======================
  const leoSpeak = (text: string, onEnd?: () => void) => {
    if (!soundEnabled || !audioManagerRef.current) {
      onEnd?.();
      return;
    }
    try {
      audioManagerRef.current.falarLeo(text, onEnd);
    } catch (err) {
      console.error('Erro no leoSpeak:', err);
      onEnd?.();
    }
  };

  // ======================
  // RODADAS
  // ======================
  const startNewRound = (phase: number) => {
    let availableImages = [...imageNames];
    const correctImage = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
    const wrong1 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
    const wrong2 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];

    let roundType: RoundType = phase === 1 ? 'imageToShadow' : phase === 2 ? 'shadowToImage' : (Math.random() < 0.5 ? 'imageToShadow' : 'shadowToImage');
    let mainItem, correctAnswer, options;

    if (roundType === 'imageToShadow') {
      mainItem = `/shadow-game/images/${correctImage}.webp`;
      correctAnswer = `/shadow-game/shadows/${correctImage}_black.webp`;
      options = shuffleArray([
        correctAnswer,
        `/shadow-game/shadows/${wrong1}_black.webp`,
        `/shadow-game/shadows/${wrong2}_black.webp`
      ]);
    } else {
      mainItem = `/shadow-game/shadows/${correctImage}_black.webp`;
      correctAnswer = `/shadow-game/images/${correctImage}.webp`;
      options = shuffleArray([
        correctAnswer,
        `/shadow-game/images/${wrong1}.webp`,
        `/shadow-game/images/${wrong2}.webp`
      ]);
    }

    setRoundData({ mainItem, options, correctAnswer });
  };

  // ======================
  // TELAS
  // ======================

  // Loading
  const LoadingScreen = () => (
    <div className="screen-container loading-screen">
      <h1 className="main-title">Jogo das Sombras</h1>
      <p>Carregando...</p>
    </div>
  );

  // Intro
  const IntroScreen = () => {
    const handleClick = () => {
      leoSpeak("Olá! Eu sou o Léo! Vamos jogar com sombras?", () => {
        setGameState('instructions');
      });
      // fallback em 5s caso a voz não dispare
      setTimeout(() => setGameState('instructions'), 5000);
    };

    return (
      <div className="screen-container intro-screen">
        <Image src="/shadow-game/leo_abertura.webp" alt="Mascote Léo" width={250} height={250} priority />
        <h1 className="main-title">Jogo das Sombras</h1>
        <p className="subtitle">Associe cada imagem com sua sombra!</p>
        <button onClick={handleClick} className="start-button">
          Começar a Jogar
        </button>
      </div>
    );
  };

  // Instruções
  const InstructionsScreen = () => {
    const handleClick = () => {
      leoSpeak("É super fácil! Clique na sombra certa para cada figura!", () => {
        setGameState('phase-selection');
      });
      setTimeout(() => setGameState('phase-selection'), 5000);
    };

    return (
      <div className="screen-container explanation-screen">
        <Image src="/shadow-game/leo_abertura.webp" alt="Léo explicando" width={200} height={200} />
        <div className="speech-bubble">
          <p>É super fácil! Clique na sombra certa para cada figura!</p>
        </div>
        <button onClick={handleClick} className="start-button">
          Entendi, vamos lá!
        </button>
      </div>
    );
  };

  // Seleção de fase
  const PhaseSelectionScreen = () => (
    <div className="screen-container phase-selection-screen">
      <h2>Escolha seu desafio</h2>
      <div className="phase-container">
        <button onClick={() => { setSelectedPhase(1); setGameState('playing'); startNewRound(1); }}>🔍 Fase 1</button>
        <button onClick={() => { setSelectedPhase(2); setGameState('playing'); startNewRound(2); }}>🌟 Fase 2</button>
        <button onClick={() => { setSelectedPhase(3); setGameState('playing'); startNewRound(3); }}>🏆 Fase 3</button>
      </div>
    </div>
  );

  // Tela do jogo
  const GameScreen = () => {
    if (!roundData) return null;

    const handleOptionClick = (opt: string) => {
      if (opt === roundData.correctAnswer) {
        setScore(score + 100);
        setStreak(streak + 1);
        leoSpeak("Muito bem!");
        startNewRound(selectedPhase!);
      } else {
        setStreak(0);
        leoSpeak("Ops, tente de novo!");
      }
    };

    return (
      <div className="playing-screen">
        <div className="top-bar">
          <button onClick={() => setGameState('phase-selection')} className="back-button">
            <ArrowLeft size={20} /> Voltar
          </button>
          <div className="score-display"><Trophy size={20} /> {score}</div>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="sound-button">
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        <div className="main-item-container">
          <Image src={roundData.mainItem} alt="Item principal" width={250} height={250} />
        </div>

        <div className="options-container">
          {roundData.options.map((opt, i) => (
            <button key={i} onClick={() => handleOptionClick(opt)} className="option-button">
              <Image src={opt} alt={`Opção ${i + 1}`} width={100} height={100} />
            </button>
          ))}
        </div>

        <div className="stats-display">
          <div>⭐ {streak}</div>
          <div>🏆 {score}</div>
        </div>
      </div>
    );
  };

  // ======================
  // RENDER
  // ======================
  const renderContent = () => {
    switch (gameState) {
      case 'loading': return <LoadingScreen />;
      case 'intro': return <IntroScreen />;
      case 'instructions': return <InstructionsScreen />;
      case 'phase-selection': return <PhaseSelectionScreen />;
      case 'playing': return <GameScreen />;
      default: return <LoadingScreen />;
    }
  };

  return (
    <main className="shadow-game-main">
      {renderContent()}
    </main>
  );
}
