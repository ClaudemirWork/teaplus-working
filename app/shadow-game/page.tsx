'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './shadowgame.css';
import Image from 'next/image';
import { Volume2, VolumeX, Trophy, Star, ArrowLeft, Zap, Flame, Award, Crown, Medal } from 'lucide-react';

const imageNames = [
  'abacate', 'abelha', 'abelha_feliz', 'abelha_voando', 'abelhinha', 'aguia', 'amigos', 'apresentacao', 'arvore_natal', 'baleia',
  'bicicleta', 'borboleta', 'cachorro', 'casa', 'cavalo', 'elefante', 'flor', 'gato', 'girassol', 'leao',
  'passaro', 'peixe', 'sol', 'tartaruga', 'urso', 'vaca', 'zebra', 'coelho', 'formiga', 'galinha'
];

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

type GameState = 'loading' | 'intro' | 'instructions' | 'phase-selection' | 'playing';
type RoundType = 'imageToShadow' | 'shadowToImage';

export default function ShadowGamePage() {
  const [gameState, setGameState] = useState<GameState>('loading');
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [roundData, setRoundData] = useState<{ mainItem: string; options: string[]; correctAnswer: string; } | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [pointsFeedback, setPointsFeedback] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highScore, setHighScore] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);

  const audioManagerRef = useRef<any>(null);
  const hasInitialized = useRef(false);

  // Inicialização
  useEffect(() => {
    const initializeGame = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        await new Promise(resolve => setTimeout(resolve, 100));

        if (typeof window !== 'undefined') {
          const savedHighScore = localStorage.getItem('shadowGameHighScore');
          const savedStars = localStorage.getItem('shadowGameTotalStars');
          if (savedHighScore) setHighScore(Number(savedHighScore));
          if (savedStars) setTotalStars(Number(savedStars));
        }

        try {
          const { GameAudioManager } = await import('@/utils/gameAudioManager');
          audioManagerRef.current = GameAudioManager.getInstance();
        } catch (error) {
          console.warn('GameAudioManager não disponível, continuando sem áudio:', error);
        }

        setGameState('intro');
      } catch (error) {
        console.error('Erro na inicialização:', error);
        setGameState('intro');
      }
    };

    initializeGame();
  }, []);

  const leoSpeak = useCallback((text: string, onEnd?: () => void) => {
    if (!soundEnabled || !audioManagerRef.current) {
      onEnd?.();
      return;
    }
    try {
      audioManagerRef.current.falarLeo(text, onEnd);
    } catch (error) {
      console.warn('Erro no leoSpeak:', error);
      onEnd?.();
    }
  }, [soundEnabled]);

  const playSound = useCallback((soundName: string, volume: number = 0.5) => {
    if (!soundEnabled || !audioManagerRef.current) return;
    try {
      audioManagerRef.current.playSoundEffect(soundName, volume);
    } catch (error) {
      console.warn('Erro no playSound:', error);
    }
  }, [soundEnabled]);

  const startNewRound = (phase: number) => {
    if (imageNames.length < 3) {
      console.error('Não há imagens suficientes para o jogo');
      return;
    }

    setFeedback({});
    setPointsFeedback(null);

    let availableImages = [...imageNames];
    const correctImageName = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];

    let roundType: RoundType;
    if (phase === 1) roundType = 'imageToShadow';
    else if (phase === 2) roundType = 'shadowToImage';
    else roundType = Math.random() < 0.5 ? 'imageToShadow' : 'shadowToImage';

    const wrongImageName1 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
    const wrongImageName2 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];

    let mainItem: string, correctAnswer: string, options: string[];

    if (roundType === 'imageToShadow') {
      mainItem = `/shadow-game/images/${correctImageName}.webp`;
      correctAnswer = `/shadow-game/shadows/${correctImageName}_black.webp`;
      options = [
        correctAnswer,
        `/shadow-game/shadows/${wrongImageName1}_black.webp`,
        `/shadow-game/shadows/${wrongImageName2}_black.webp`
      ];
    } else {
      mainItem = `/shadow-game/shadows/${correctImageName}_black.webp`;
      correctAnswer = `/shadow-game/images/${correctImageName}.webp`;
      options = [
        correctAnswer,
        `/shadow-game/images/${wrongImageName1}.webp`,
        `/shadow-game/images/${wrongImageName2}.webp`
      ];
    }

    setRoundData({ mainItem, options: shuffleArray(options), correctAnswer });
  };

  // --- CORRIGIDO: garante que a introdução sempre avança ---
  const handleIntroClick = () => {
    if (isIntroPlaying) return;

    setIsIntroPlaying(true);
    playSound('click_select');

    let moved = false;
    const goNext = () => {
      if (moved) return;
      moved = true;
      setIsIntroPlaying(false);
      setGameState('instructions');
    };

    // tenta falar com o Leo
    leoSpeak("Olá! Eu sou o Léo! Vamos jogar com sombras?", goNext);

    // segurança: se o Azure falhar, avança de qualquer jeito
    setTimeout(goNext, 5000);
  };

  const handlePhaseSelect = (phase: number) => {
    playSound('click_select');
    setSelectedPhase(phase);
    setScore(0);
    setStreak(0);

    const phaseMessages: { [key: number]: string } = {
      1: "Detetive Júnior! Vamos começar!",
      2: "Mestre das Sombras! Ficou mais difícil!",
      3: "Desafio Final! Para os melhores!"
    };

    leoSpeak(phaseMessages[phase]);
    setGameState('playing');
    startNewRound(phase);
  };

  const handleOptionClick = (clickedOption: string) => {
    if (Object.keys(feedback).length > 0 || !selectedPhase) return;

    if (clickedOption === roundData?.correctAnswer) {
      playSound('correct_chime', 0.4);

      const newStreak = streak + 1;
      let pointsGained = 100;
      if (newStreak >= 20) pointsGained = 3000;
      else if (newStreak >= 15) pointsGained = 2000;
      else if (newStreak >= 10) pointsGained = 1000;
      else if (newStreak >= 5) pointsGained = 500;
      else if (newStreak >= 2) pointsGained = 200;

      const currentScore = score + pointsGained;
      setScore(currentScore);
      setStreak(newStreak);
      setPointsFeedback(`+${pointsGained}`);

      const newTotalStars = totalStars + 1;
      setTotalStars(newTotalStars);
      if (typeof window !== 'undefined') {
        localStorage.setItem('shadowGameTotalStars', newTotalStars.toString());
      }

      if (currentScore > highScore) {
        setHighScore(currentScore);
        if (typeof window !== 'undefined') {
          localStorage.setItem('shadowGameHighScore', currentScore.toString());
        }
      }

      const comboMessages: { [key: number]: string } = {
        5: `UAU! Combo de ${newStreak} acertos!`,
        10: `INCRÍVEL! Sequência de ${newStreak}!`,
        15: `FANTÁSTICO! ${newStreak} seguidos!`,
        20: `LENDÁRIO! ${newStreak} acertos em sequência!`
      };

      const comboMessageEntry = Object.entries(comboMessages).find(([key]) => newStreak === parseInt(key));
      if (comboMessageEntry) {
        leoSpeak(comboMessageEntry[1]);
      }

      setFeedback({ [clickedOption]: 'correct' });
      setTimeout(() => startNewRound(selectedPhase), 1500);
    } else {
      playSound('error_short', 0.4);
      setStreak(0);
      setFeedback({ [clickedOption]: 'incorrect' });
      leoSpeak("Opa, não foi essa. Tente de novo!");
      setTimeout(() => setFeedback({}), 800);
    }
  };

  // --- TELAS ---
  const LoadingScreen = () => (
    <div className="screen-container loading-screen">
      <div className="stars-bg"></div>
      <div className="loading-indicator">
        <div className="spinner"></div>
        <h1 className="main-title">Jogo das Sombras</h1>
        <p>Preparando o jogo...</p>
      </div>
    </div>
  );

  const IntroScreen = () => (
    <div className="screen-container intro-screen">
      <div className="stars-bg"></div>
      <div className="leo-container animate-float">
        <Image 
          src="/shadow-game/leo_abertura.webp" 
          alt="Mascote Léo" 
          width={300} 
          height={300} 
          priority 
        />
      </div>
      <h1 className="main-title">Jogo das Sombras</h1>
      <p className="subtitle">Associe cada imagem com sua sombra!</p>
      <button 
        onClick={handleIntroClick}
        disabled={isIntroPlaying}
        className={`start-button ${isIntroPlaying ? 'playing' : ''}`}
      >
        {isIntroPlaying ? 'Olá! Sou o Léo!' : 'Começar a Jogar'}
      </button>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="screen-container explanation-screen">
      <div className="stars-bg"></div>
      <div className="leo-container animate-float">
        <Image 
          src="/shadow-game/leo_abertura.webp" 
          alt="Mascote Léo explicando" 
          width={200} 
          height={200} 
        />
      </div>
      <div className="speech-bubble">
        <p>É super fácil! Clique na sombra certa para cada figura e marque muitos pontos!</p>
      </div>
      <button 
        onClick={() => {
          playSound("click_select");
          setGameState('phase-selection');
        }} 
        className="start-button"
      >
        Entendi, vamos lá!
      </button>
    </div>
  );

  const PhaseSelectionScreen = () => (
    <div className="screen-container phase-selection-screen">
      <div className="stars-bg"></div>
      <h2>Escolha seu Desafio!</h2>
      <div className="phase-container">
        <button onClick={() => handlePhaseSelect(1)} className="phase-button phase-1">
          <h3>🔍 Fase 1: Detetive Júnior</h3>
          <p>Encontre a sombra correta para cada imagem.</p>
        </button>
        <button onClick={() => handlePhaseSelect(2)} className="phase-button phase-2">
          <h3>🌟 Fase 2: Mestre das Sombras</h3>
          <p>Encontre a imagem correta para cada sombra.</p>
        </button>
        <button onClick={() => handlePhaseSelect(3)} className="phase-button phase-3">
          <h3>🏆 Fase 3: Desafio Final!</h3>
          <p>Tudo misturado para testar suas habilidades!</p>
        </button>
      </div>
    </div>
  );

  const GameScreen = () => {
    if (!roundData) return null;

    const comboIcons: { [key: string]: React.ElementType } = {
      '20': Crown,
      '15': Award,
      '10': Medal,
      '5': Flame,
      '2': Zap
    };

    const comboLevel = Object.keys(comboIcons).reverse().find(key => streak >= parseInt(key)) || '1';
    const ComboIcon = comboIcons[comboLevel] || Star;

    return (
      <div className="playing-screen">
        <div className="top-bar">
          <button 
            onClick={() => setGameState('phase-selection')} 
            className="back-button"
          >
            <ArrowLeft size={20} />
            Fases
          </button>
          <div className="score-display">
            <Trophy size={20} />
            {score}
          </div>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className="sound-button"
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        {pointsFeedback && (
          <div className="points-feedback fade-out-up">
            {pointsFeedback}
          </div>
        )}

        <div className="main-item-container">
          <Image 
            src={roundData.mainItem} 
            alt="Item principal" 
            width={250} 
            height={250}
            onError={() => {
              console.error('Erro ao carregar imagem:', roundData.mainItem);
            }}
          />
        </div>

        <div className="options-container">
          {roundData.options.map((optionSrc, index) => (
            <button 
              key={index} 
              className={`option-button ${feedback[optionSrc] || ''}`} 
              onClick={() => handleOptionClick(optionSrc)}
            >
              <Image 
                src={optionSrc} 
                alt={`Opção ${index + 1}`} 
                width={100} 
                height={100}
                onError={() => {
                  console.error('Erro ao carregar opção:', optionSrc);
                }}
              />
            </button>
          ))}
        </div>

        <div className="streak-display">
          <span>Combo:</span>
          <ComboIcon className="combo-icon" />
          <span>{streak}x</span>
        </div>

        <div className="stats-display">
          <div>⭐ {totalStars}</div>
          <div>🏆 Record: {highScore}</div>
        </div>
      </div>
    );
  };

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
