'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Volume2, VolumeX, Trophy, ArrowLeft } from 'lucide-react';
import { GameAudioManager } from '@/utils/gameAudioManager';
import styles from './FacialExpressions.module.css';

// --- EFEITO DE CONFETE SIMPLIFICADO ---
const confetti = (opts = {}) => {
  if (typeof window === 'undefined') return;
  
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const COLORS = ['#FFC107', '#FF9800', '#FF5722', '#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#4CAF50'];

    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: W * 0.5,
        y: H * 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        vx: (Math.random() - 0.5) * 20,
        vy: Math.random() * -15 - 5,
        opacity: 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.3; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.008;
        
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        
        if (p.opacity <= 0) particles.splice(i, 1);
      }

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(canvas);
      }
    };

    animate();
  } catch (error) {
    console.warn('Erro no confetti:', error);
  }
};

const ConfettiEffect = () => {
  const audioManager = useMemo(() => GameAudioManager.getInstance(), []);
  
  useEffect(() => {
    try {
      // audioManager.playSoundEffect('celebration', 0.6); // Desabilitado temporariamente
      confetti();
    } catch (error) {
      console.warn('Erro no ConfettiEffect:', error);
    }
  }, [audioManager]);

  return null;
};

// --- COMPONENTES SIMPLIFICADOS ---
const Card = React.memo(({ emotion, onClick, isCorrect, isWrong, isDisabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${styles.emotionCard} ${isCorrect ? styles.cardCorrect : ''} ${isWrong ? styles.cardWrong : ''}`}
    >
      <div className={styles.cardImageWrapper}>
        <img 
          src={emotion.path} 
          alt={emotion.label} 
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150/EBF4FA/333?text=?'; }} 
        />
      </div>
      <span className={styles.cardLabel}>{emotion.label}</span>
    </button>
  );
});

const ProgressBar = React.memo(({ current, total }) => {
  const progress = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className={styles.progressBar}>
      <div className={styles.progressFill} style={{ width: `${progress}%` }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
});

// --- DADOS DO JOGO ---
const IMAGE_BASE_PATH = '/images/cards/emocoes/';

const EMOTION_CARDS = [
  { id: 'homem_feliz', label: 'Feliz', path: `${IMAGE_BASE_PATH}homem_feliz.webp` },
  { id: 'homem_triste', label: 'Triste', path: `${IMAGE_BASE_PATH}homem_triste.webp` },
  { id: 'homem_medo', label: 'Medo', path: `${IMAGE_BASE_PATH}homem_medo.webp` },
  { id: 'homem_surpreso', label: 'Surpreso', path: `${IMAGE_BASE_PATH}homem_surpreso.webp` },
  { id: 'homem_furioso', label: 'Furioso', path: `${IMAGE_BASE_PATH}homem_furioso.webp` },
  { id: 'mulher_animada', label: 'Animada', path: `${IMAGE_BASE_PATH}mulher_animada.webp` },
  { id: 'mulher_calma', label: 'Calma', path: `${IMAGE_BASE_PATH}mulher_calma.webp` },
  { id: 'homem_confuso', label: 'Confuso', path: `${IMAGE_BASE_PATH}homem_confuso.webp` },
  { id: 'mulher_preocupada', label: 'Preocupada', path: `${IMAGE_BASE_PATH}mulher_preocupada.webp` },
  { id: 'homem_focado', label: 'Focado', path: `${IMAGE_BASE_PATH}homem_focado.webp` },
];

const GAME_PHASES = [
  { phase: 1, numCards: 2, numRounds: 3, points: 100 },
  { phase: 2, numCards: 3, numRounds: 4, points: 120 },
  { phase: 3, numCards: 4, numRounds: 4, points: 140 },
  { phase: 4, numCards: 5, numRounds: 5, points: 160 },
  { phase: 5, numCards: 6, numRounds: 5, points: 180 },
  { phase: 6, numCards: 7, numRounds: 6, points: 200 },
  { phase: 7, numCards: 8, numRounds: 6, points: 220 },
  { phase: 8, numCards: 9, numRounds: 7, points: 240 },
  { phase: 9, numCards: 10, numRounds: 7, points: 260 },
  { phase: 10, numCards: 10, numRounds: 8, points: 300 },
];

const PHASE_COMPLETION_MESSAGES = [
  "Isso aí amigão, agora vamos para a fase 2!",
  "Você é um super craque na identificação de emoções, vamos para a fase 3!",
  "Meu amigo, você é um detetive de emoções, caramba, vamos para a fase 4!",
  "Incrível! Você está dominando as emoções, fase 5 te espera!",
  "Nem preciso dizer, vou contratar você para ser perito nesta área! Fase 6!",
  "Que talento impressionante! As emoções não têm segredos para você! Fase 7!",
  "Agora sim, estamos diante de um campeão mundial de detectar emoções! Fase 8!",
  "Você é uma máquina de identificar emoções! Rumo à fase 9!",
  "Simplesmente espetacular! Você é o mestre das expressões! Última fase!",
  "INACREDITÁVEL! Você completou todas as fases! Você é o CAMPEÃO das emoções!"
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// --- COMPONENTE PRINCIPAL ---
export default function FacialExpressionsGame() {
  const audioManager = useMemo(() => GameAudioManager.getInstance(), []);

  const [gameState, setGameState] = useState('titleScreen');
  const [autoIntroStep, setAutoIntroStep] = useState(0);
  const [leoMessage, setLeoMessage] = useState('');
  const [leoSpeaking, setLeoSpeaking] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [cardsForPhase, setCardsForPhase] = useState([]);
  const [targetSequence, setTargetSequence] = useState([]);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const introMessages = [
    "Olá, eu sou o Leo e vou te ajudar a identificar várias emoções, e fazer isto, de forma divertida!",
    "É bem fácil! Eu vou mostrar cartões com rostos e as emoções que eles estão exprimindo. Eu vou falar uma emoção, como 'feliz', ou 'triste', e você só precisa identificar o cartão correspondente na tela, e clicar nele, marcando pontos.",
    "E posso pedir o mesmo cartão da emoção, mais de uma vez, fique atento!",
    "Vamos começar e ficar craques, para identificar as emoções!"
  ];

  const leoSpeak = useCallback((message, callback) => {
    setLeoMessage(message);
    setLeoSpeaking(true);
    
    if (soundEnabled) {
      audioManager.falarLeo(message, () => {
        setLeoSpeaking(false);
        callback?.();
      });
    } else {
      setLeoSpeaking(false);
      setTimeout(() => callback?.(), 1000);
    }
  }, [soundEnabled, audioManager]);

  const handleStartIntro = async () => {
    await audioManager.forceInitialize();
    setGameState('autoIntro');
    setAutoIntroStep(0);
    
    leoSpeak("Bem-vindo ao incrível mundo das Expressões Faciais! Prepare-se para uma aventura emocionante!", () => {
      setTimeout(() => {
        setAutoIntroStep(1);
        leoSpeak(introMessages[0], () => {
          setTimeout(() => {
            setAutoIntroStep(2);
            leoSpeak(introMessages[1], () => {
              setTimeout(() => {
                setAutoIntroStep(3);
                leoSpeak(introMessages[2], () => {
                  setTimeout(() => {
                    setAutoIntroStep(4);
                    leoSpeak(introMessages[3], () => {
                      setTimeout(() => startGame(), 2000);
                    });
                  }, 2000);
                });
              }, 2000);
            });
          }, 1500);
        });
      }, 1000);
    });
  };

  const preparePhase = useCallback((phaseIndex) => {
    const phaseConfig = GAME_PHASES[phaseIndex];
    const shuffledAllCards = shuffleArray(EMOTION_CARDS);
    const cardsToDisplay = shuffledAllCards.slice(0, phaseConfig.numCards);

    let sequence = [];
    for (let i = 0; i < phaseConfig.numRounds; i++) {
      sequence.push(cardsToDisplay[Math.floor(Math.random() * cardsToDisplay.length)]);
    }

    setCardsForPhase(cardsToDisplay);
    setTargetSequence(sequence);
    setCurrentTargetIndex(0);
    setFeedback(null);
    setSelectedCardId(null);
    setIsDisabled(false);
    
    const startMessage = phaseIndex === 0 
      ? `Vamos começar! Encontre: ${sequence[0].label}`
      : `Fase ${phaseConfig.phase}! Agora com ${phaseConfig.numCards} emoções. Encontre: ${sequence[0].label}`;
    
    leoSpeak(startMessage);
  }, [leoSpeak]);

  const startGame = () => {
    setCurrentPhaseIndex(0);
    setTotalScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      preparePhase(currentPhaseIndex);
    }
  }, [gameState, currentPhaseIndex, preparePhase]);

  const selectCard = useCallback((card) => {
    if (isDisabled) return;

    setIsDisabled(true);
    setSelectedCardId(card.id);

    const currentTarget = targetSequence[currentTargetIndex];
    const isCorrect = card.id === currentTarget.id;

    if (isCorrect) {
      setFeedback('correct');
      setTotalScore(prev => prev + GAME_PHASES[currentPhaseIndex].points);
      
      // audioManager.playSoundEffect('correct', 0.4); // Desabilitado temporariamente
      
      setTimeout(() => {
        const nextTargetIndex = currentTargetIndex + 1;
        if (nextTargetIndex < targetSequence.length) {
          setCurrentTargetIndex(nextTargetIndex);
          setFeedback(null);
          setSelectedCardId(null);
          setIsDisabled(false);
          leoSpeak(`Agora encontre: ${targetSequence[nextTargetIndex].label}`);
        } else {
          setGameState('phaseComplete');
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      
      // audioManager.playSoundEffect('wrong', 0.4); // Desabilitado temporariamente
      leoSpeak("Ops, tente novamente!");

      setTimeout(() => {
        setFeedback(null);
        setSelectedCardId(null);
        setIsDisabled(false);
      }, 1500);
    }
  }, [isDisabled, targetSequence, currentTargetIndex, currentPhaseIndex, leoSpeak, audioManager]);

  const nextPhase = () => {
    const nextPhaseIndex = currentPhaseIndex + 1;
    if (nextPhaseIndex < GAME_PHASES.length) {
      setCurrentPhaseIndex(nextPhaseIndex);
      setGameState('playing');
    } else {
      setGameState('gameComplete');
    }
  };

  useEffect(() => {
    if (gameState === 'phaseComplete') {
      const message = PHASE_COMPLETION_MESSAGES[currentPhaseIndex] || 
                     `Fase ${GAME_PHASES[currentPhaseIndex].phase} completa! Você ganhou ${GAME_PHASES[currentPhaseIndex].points} pontos!`;
      leoSpeak(message);
    } else if (gameState === 'gameComplete') {
      const message = `INACREDITÁVEL! Você completou todas as 10 fases e fez ${totalScore} pontos! Você é o verdadeiro CAMPEÃO das emoções!`;
      leoSpeak(message);
    }
  }, [gameState, currentPhaseIndex, totalScore, leoSpeak]);

  const toggleSound = () => {
    const isNowEnabled = audioManager.toggleAudio();
    setSoundEnabled(isNowEnabled);
  };

  // --- RENDERIZAÇÃO ---
  const renderTitleScreen = () => (
    <div className={styles.screenCenter}>
      <div className={styles.starsBg}></div>
      <div className={`${styles.titleLeoContainer} ${styles.animateFloat}`}>
        <img 
          src="/images/mascotes/leo/Leo_emocoes_espelho.webp"
          alt="Leo Mascote Emoções" 
          className={`${styles.introMascot} ${styles.titleMascot}`}
          style={{
            transform: leoSpeaking ? 'scale(1.05)' : 'scale(1)',
            filter: leoSpeaking ? 'drop-shadow(0 0 20px #4CAF50)' : 'drop-shadow(0 15px 30px rgba(0,0,0,0.4))',
            transition: 'all 0.5s ease'
          }}
        />
        {leoMessage && (
          <div className={styles.titleSpeechBubble}>
            <p>{leoMessage}</p>
          </div>
        )}
      </div>
      <h1 className={styles.introMainTitle}>Expressões Faciais</h1>
      <p className={styles.introMainSubtitle}>Aprenda e divirta-se com as emoções!</p>
      <button 
        onClick={handleStartIntro}
        className={styles.introStartButton}
        disabled={gameState !== 'titleScreen'}
      >
        Começar Aventura
      </button>
    </div>
  );

  const renderAutoIntroScreen = () => (
    <div className={`${styles.screenCenter} ${styles.introExplanation}`}>
      <div className={styles.introContentWrapper}>
        <div className={styles.introMascotContainer}>
          <img 
            src="/images/mascotes/leo/Leo_apoio.webp" 
            alt="Leo" 
            className={styles.introMascot}
            style={{
              transform: leoSpeaking ? 'scale(1.1)' : 'scale(1)',
              filter: leoSpeaking ? 'drop-shadow(0 0 15px #4CAF50)' : 'none',
              transition: 'all 0.5s ease'
            }}
          />
        </div>
        <div className={styles.speechBubble}>
          <p>{leoMessage}</p>
        </div>
      </div>
      <div className={styles.introProgress}>
        <div className={styles.introDots}>
          {[1,2,3,4].map(dot => (
            <div 
              key={dot}
              className={`${styles.introDot} ${autoIntroStep >= dot ? styles.active : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderGameScreen = () => (
    <>
      <ProgressBar current={currentTargetIndex + 1} total={targetSequence.length} />
      <div className={styles.gameArea}>
        <div className={styles.instructionContainer}>
          <img 
            src="/images/mascotes/leo/leo_rosto_resultado.webp" 
            alt="Leo" 
            className={styles.instructionMascot}
            style={{
              transform: leoSpeaking ? 'scale(1.1)' : 'scale(1)',
              filter: leoSpeaking ? 'drop-shadow(0 0 10px #4CAF50)' : 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))',
              transition: 'all 0.5s ease'
            }}
          />
          <div className={`${styles.instructionBox} ${leoSpeaking ? styles.speaking : ''}`}>
            <h2>{leoMessage}</h2>
          </div>
        </div>
        <div className={`${styles.cardsGrid} ${styles[`cols${Math.min(Math.ceil(cardsForPhase.length / 2), 5)}`]}`}>
          {cardsForPhase.map((card) => (
            <Card 
              key={card.id} 
              emotion={card} 
              onClick={() => selectCard(card)}
              isCorrect={feedback === 'correct' && card.id === selectedCardId}
              isWrong={feedback === 'wrong' && card.id === selectedCardId}
              isDisabled={isDisabled}
            />
          ))}
        </div>
      </div>
    </>
  );

  const renderPhaseCompleteScreen = () => (
    <div className={styles.screenCenter}>
      <ConfettiEffect />
      <div className={styles.modalContainer}>
        <img 
          src="/images/mascotes/leo/Leo_apoio.webp" 
          alt="Leo Comemorando"
          className={styles.modalMascot}
        />
        <h2 className={styles.modalTitle}>Fase {GAME_PHASES[currentPhaseIndex].phase} Completa!</h2>
        <div className={styles.modalIcon}>🎉</div>
        <p>Pontuação Total: <span className={styles.totalScoreHighlight}>{totalScore}</span></p>
        <button 
          onClick={nextPhase} 
          className={`${styles.modalButton} ${styles.nextLevel}`}
        >
          {currentPhaseIndex < GAME_PHASES.length - 1 ? 'Próxima Fase' : 'Fase Final'}
        </button>
      </div>
    </div>
  );

  const renderGameCompleteScreen = () => (
    <div className={styles.screenCenter}>
      <ConfettiEffect />
      <div className={styles.modalContainer}>
        <img 
          src="/images/mascotes/leo/Leo_emocoes_espelho.webp" 
          alt="Leo Campeão"
          className={`${styles.modalMascot} ${styles.champion}`}
        />
        <Trophy className={styles.modalTrophy} />
        <h2 className={`${styles.modalTitle} ${styles.congrats}`}>CAMPEÃO DAS EMOÇÕES!</h2>
        <p className={styles.finalScore}>Pontuação Final: {totalScore}</p>
        <p className={styles.completionMessage}>Você dominou todas as 10 fases!</p>
        <button 
          onClick={startGame} 
          className={`${styles.modalButton} ${styles.playAgain}`}
        >
          Jogar Novamente
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (gameState) {
      case 'titleScreen': return renderTitleScreen();
      case 'autoIntro': return renderAutoIntroScreen();
      case 'playing': return renderGameScreen();
      case 'phaseComplete': return renderPhaseCompleteScreen();
      case 'gameComplete': return renderGameCompleteScreen();
      default: return renderTitleScreen();
    }
  };

  return (
    <div className={`${styles.gameContainer} ${gameState === 'titleScreen' || gameState === 'autoIntro' ? styles.introMode : ''}`}>
      <header className={styles.gameHeader}>
        <a href="/dashboard" className={styles.headerButton}><ArrowLeft size={24} /></a>
        <h1 className={styles.gameTitle}>😊 Expressões</h1>
        <div className={styles.headerScore}>🏆 {totalScore}</div>
        <button onClick={toggleSound} className={styles.headerButton}>
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </header>
      <main>
        {renderContent()}
      </main>
    </div>
  );
}
