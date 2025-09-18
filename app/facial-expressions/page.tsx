'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Trophy, ArrowLeft } from 'lucide-react';

// --- SIMULAÇÃO DO GAMEAUDIOMANAGER ---
class GameAudioManager {
  static instance = null;
  
  static getInstance() {
    if (!GameAudioManager.instance) {
      GameAudioManager.instance = new GameAudioManager();
    }
    return GameAudioManager.instance;
  }
  
  constructor() {
    this.audioEnabled = true;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  }
  
  async forceInitialize() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
  
  falarLeo(texto, callback) {
    if (!this.audioEnabled || !this.synth) {
      callback?.();
      return;
    }
    
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    utterance.onend = () => callback?.();
    utterance.onerror = () => callback?.();
    
    this.synth.speak(utterance);
  }
  
  playSound(type) {
    if (!this.audioEnabled) return;
    
    // Simula sons usando Web Audio API ou fallback
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    } else if (type === 'wrong') {
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
      oscillator.frequency.setValueAtTime(185, audioContext.currentTime + 0.15); // F#3
    } else if (type === 'explosion') {
      // Som de explosão/confete
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    }
    
    oscillator.type = type === 'explosion' ? 'sawtooth' : 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + (type === 'explosion' ? 0.3 : 0.2));
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + (type === 'explosion' ? 0.3 : 0.2));
  }
  
  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    if (!this.audioEnabled && this.synth) {
      this.synth.cancel();
    }
    return this.audioEnabled;
  }
}

// --- EFEITO DE CONFETE ---
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

    const COLORS = ['#FFC107', '#FF9800', '#FF5722', '#F44336', '#E91E63', 
                   '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', 
                   '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B'];

    const particles = [];
    const particleCount = opts.particleCount || 150;
    const origin = opts.origin || { x: 0.5, y: 0.5 };
    const spread = opts.spread || 90;
    const startVelocity = opts.startVelocity || 45;
    const decay = opts.decay || 0.92;
    const gravity = opts.gravity || 0.7;

    const randomRange = (min, max) => Math.random() * (max - min) + min;

    class Particle {
      constructor() {
        this.x = W * origin.x;
        this.y = H * origin.y;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.size = randomRange(5, 12);
        this.velocity = { 
          x: randomRange(-spread / 2, spread / 2), 
          y: randomRange(-startVelocity, -startVelocity / 2) 
        };
        this.gravity = gravity;
        this.friction = decay;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = randomRange(-5, 5);
        this.opacity = 1;
      }

      update() {
        this.velocity.y += this.gravity;
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.01;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((particle, i) => {
        if (particle.opacity > 0) { 
          particle.update(); 
          particle.draw(); 
        } else { 
          particles.splice(i, 1); 
        }
      });

      if (particles.length > 0) { 
        requestAnimationFrame(animate); 
      } else { 
        if (document.body.contains(canvas)) {
          document.body.removeChild(canvas); 
        }
      }
    };

    for (let i = 0; i < particleCount; i++) { 
      particles.push(new Particle()); 
    }

    animate();
  } catch (error) {
    console.warn('Erro no confetti:', error);
  }
};

const ConfettiEffect = () => {
  const audioManager = useMemo(() => GameAudioManager.getInstance(), []);
  
  useEffect(() => {
    try {
      // Som de explosão/confete
      audioManager.playSound('explosion');
      
      const fire = (p, o) => confetti({ particleCount: Math.floor(200*p), ...o });
      fire(0.25, { spread: 30, startVelocity: 60, origin: { x: 0, y: 0.7 } });
      fire(0.2, { spread: 60, origin: { x: 0.5, y: 0.6 } });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, origin: { x: 1, y: 0.7 } });
    } catch (error) {
      console.warn('Erro no ConfettiEffect:', error);
    }
  }, [audioManager]);

  return null;
};

// --- COMPONENTES DE UI ---
const Card = React.memo(({ emotion, onClick, isCorrect, isWrong, isDisabled }) => {
  const audioManager = useMemo(() => GameAudioManager.getInstance(), []);
  
  const handleClick = () => {
    if (!isDisabled) {
      // Som de clique na carta
      audioManager.playSound(isCorrect ? 'correct' : 'wrong');
      onClick();
    }
  };
  
  return (
    <motion.button
      onClick={handleClick}
      disabled={isDisabled}
      className={`emotionCard ${isCorrect ? 'cardCorrect' : ''} ${isWrong ? 'cardWrong' : ''}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.4 }}
      layout
    >
      <div className="card-image-wrapper">
        <img 
          src={emotion.path} 
          alt={emotion.label} 
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/150x150/EBF4FA/333?text=?'; }} 
        />
      </div>
      <span className="card-label">{emotion.label}</span>
    </motion.button>
  );
});

const ProgressBar = React.memo(({ current, total }) => {
  const progress = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="progressBar">
      <div className="progressFill" style={{ width: `${progress}%` }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
});

// --- CONFIGURAÇÕES E DADOS DO JOGO ---
const IMAGE_BASE_PATH = 'https://placehold.co/150x150/';

const EMOTION_CARDS = [
  { id: 'homem_feliz', label: 'Feliz', path: `${IMAGE_BASE_PATH}FFD54F/333?text=😊` },
  { id: 'homem_triste', label: 'Triste', path: `${IMAGE_BASE_PATH}90CAF9/333?text=😢` },
  { id: 'homem_medo', label: 'Medo', path: `${IMAGE_BASE_PATH}FFAB91/333?text=😨` },
  { id: 'homem_surpreso', label: 'Surpreso', path: `${IMAGE_BASE_PATH}CE93D8/333?text=😲` },
  { id: 'homem_furioso', label: 'Furioso', path: `${IMAGE_BASE_PATH}FFCDD2/333?text=😡` },
  { id: 'mulher_animada', label: 'Animada', path: `${IMAGE_BASE_PATH}C8E6C9/333?text=🤩` },
  { id: 'mulher_calma', label: 'Calma', path: `${IMAGE_BASE_PATH}B2DFDB/333?text=😌` },
  { id: 'homem_confuso', label: 'Confuso', path: `${IMAGE_BASE_PATH}FFF9C4/333?text=😕` },
  { id: 'mulher_preocupada', label: 'Preocupada', path: `${IMAGE_BASE_PATH}F8BBD9/333?text=😟` },
  { id: 'homem_focado', label: 'Focado', path: `${IMAGE_BASE_PATH}E1BEE7/333?text=🧐` },
];

// EXPANDIDO PARA 10 FASES
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

// MENSAGENS DE INCENTIVO VARIADAS
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

// --- COMPONENTE PRINCIPAL DO JOGO ---
export default function FacialExpressionsGame() {
  const audioManager = useMemo(() => GameAudioManager.getInstance(), []);

  const [gameState, setGameState] = useState('titleScreen');
  const [autoIntroStep, setAutoIntroStep] = useState(0);
  const [leoMessage, setLeoMessage] = useState('');
  const [leoSpeaking, setLeoSpeaking] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // State da rodada
  const [cardsForPhase, setCardsForPhase] = useState([]);
  const [targetSequence, setTargetSequence] = useState([]);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  // NOVOS TEXTOS MELHORADOS
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
    
    // Mensagem inicial da primeira página
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
      
      // Som de acerto já tocado no componente Card
      
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
      
      // Som de erro já tocado no componente Card
      leoSpeak("Ops, tente novamente!");

      setTimeout(() => {
        setFeedback(null);
        setSelectedCardId(null);
        setIsDisabled(false);
      }, 1500);
    }
  }, [isDisabled, targetSequence, currentTargetIndex, currentPhaseIndex, leoSpeak]);

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
    <div className="screen-center">
      <div className="stars-bg"></div>
      <motion.div 
        className="title-leo-container animate-float" 
        style={{zIndex: 10}}
        animate={{ 
          scale: leoSpeaking ? [1, 1.05, 1] : 1,
          filter: leoSpeaking ? "drop-shadow(0 0 20px #4CAF50)" : "drop-shadow(0 15px 30px rgba(0,0,0,0.4))"
        }}
        transition={{ duration: leoSpeaking ? 0.5 : 2, repeat: leoSpeaking ? Infinity : 0 }}
      >
        <img 
          src="https://placehold.co/300x400/4CAF50/ffffff?text=LEO+😊"
          alt="Leo Mascote Emoções" 
          className="intro-mascot title-mascot" 
        />
        {leoMessage && (
          <div className="title-speech-bubble">
            <p>{leoMessage}</p>
          </div>
        )}
      </motion.div>
      <h1 className="intro-main-title">Expressões Faciais</h1>
      <p className="intro-main-subtitle">Aprenda e divirta-se com as emoções!</p>
      <motion.button 
        onClick={handleStartIntro}
        className="intro-start-button" 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={gameState !== 'titleScreen'}
      >
        Começar Aventura
      </motion.button>
    </div>
  );

  const renderAutoIntroScreen = () => (
    <div className="screen-center intro-explanation">
      <div className="intro-content-wrapper">
        <div className="intro-mascot-container">
          <motion.img 
            src="https://placehold.co/200x200/4CAF50/ffffff?text=LEO+😊" 
            alt="Leo" 
            className="intro-mascot"
            animate={{ 
              scale: leoSpeaking ? [1, 1.1, 1] : 1,
              filter: leoSpeaking ? "drop-shadow(0 0 15px #4CAF50)" : "none"
            }}
            transition={{ duration: 0.5, repeat: leoSpeaking ? Infinity : 0 }}
          />
        </div>
        <motion.div 
          className="speech-bubble"
          key={autoIntroStep}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p>{leoMessage}</p>
        </motion.div>
      </div>
      <div className="intro-progress">
        <div className="intro-dots">
          {[1,2,3,4].map(dot => (
            <div 
              key={dot}
              className={`intro-dot ${autoIntroStep >= dot ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderGameScreen = () => (
    <>
      <ProgressBar current={currentTargetIndex + 1} total={targetSequence.length} />
      <div className="game-area">
        <div className="instruction-container">
          <motion.img 
            src="https://placehold.co/80x80/4CAF50/ffffff?text=LEO+😊" 
            alt="Leo" 
            className="instruction-mascot"
            animate={{ 
              scale: leoSpeaking ? [1, 1.1, 1] : 1,
              filter: leoSpeaking ? "drop-shadow(0 0 10px #4CAF50)" : "drop-shadow(0 4px 10px rgba(0,0,0,0.1))"
            }}
            transition={{ duration: 0.5, repeat: leoSpeaking ? Infinity : 0 }}
          />
          <div className={`instruction-box ${leoSpeaking ? 'speaking' : ''}`}>
            <h2>{leoMessage}</h2>
          </div>
        </div>
        <div className={`cards-grid cols-${Math.min(Math.ceil(cardsForPhase.length / 2), 5)}`}>
          <AnimatePresence>
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
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  const renderPhaseCompleteScreen = () => (
    <div className="screen-center">
      <ConfettiEffect />
      <motion.div 
        initial={{ opacity: 0, scale: 0.7 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="modal-container"
      >
        <motion.img 
          src="https://placehold.co/100x100/FFD700/333?text=🏆" 
          alt="Leo Comemorando"
          className="modal-mascot"
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <h2 className="modal-title">Fase {GAME_PHASES[currentPhaseIndex].phase} Completa!</h2>
        <div className="modal-icon">🎉</div>
        <p>Pontuação Total: <span className="total-score-highlight">{totalScore}</span></p>
        <motion.button 
          onClick={nextPhase} 
          className="modal-button next-level"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentPhaseIndex < GAME_PHASES.length - 1 ? 'Próxima Fase' : 'Fase Final'}
        </motion.button>
      </motion.div>
    </div>
  );

  const renderGameCompleteScreen = () => (
    <div className="screen-center">
      <ConfettiEffect />
      <motion.div 
        initial={{ opacity: 0, scale: 0.7 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="modal-container"
      >
        <motion.img 
          src="https://placehold.co/120x120/FFD700/333?text=🏆👑" 
          alt="Leo Campeão"
          className="modal-mascot champion"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.2, 1],
            filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <Trophy className="modal-trophy" />
        <h2 className="modal-title congrats">CAMPEÃO DAS EMOÇÕES!</h2>
        <p className="final-score">Pontuação Final: {totalScore}</p>
        <p className="completion-message">Você dominou todas as 10 fases!</p>
        <motion.button 
          onClick={startGame} 
          className="modal-button play-again"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Jogar Novamente
        </motion.button>
      </motion.div>
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

  const cssStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');
    
    .game-container { 
      font-family: 'Nunito', sans-serif; 
      min-height: 100vh; 
      background: linear-gradient(135deg, #a8e0ff 0%, #c4f5c7 100%); 
      position: relative; 
      overflow: hidden; 
      color: #333; 
    }
    
    .game-header { 
      position: sticky; 
      top: 10px; 
      left: 50%; 
      transform: translateX(-50%); 
      z-index: 50; 
      padding: 10px 20px; 
      background: rgba(255, 255, 255, 0.7); 
      backdrop-filter: blur(10px); 
      box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
      border-radius: 20px; 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      max-width: 95%; 
      width: 600px; 
      margin: 0 auto; 
    }
    
    .header-button { 
      background: none; 
      border: none; 
      padding: 8px; 
      border-radius: 50%; 
      cursor: pointer; 
      transition: all 0.3s ease; 
      color: #555; 
    }
    
    .header-button:hover { 
      background-color: rgba(0,0,0,0.1); 
      transform: scale(1.1);
    }
    
    .game-title { 
      font-size: 1.5rem; 
      font-weight: 900; 
      color: #00796B; 
      display: flex; 
      align-items: center; 
      gap: 8px; 
    }
    
    .header-score { 
      font-size: 1.2rem; 
      font-weight: 900; 
      color: #004D40; 
    }
    
    /* MELHORIAS NA TELA DE TÍTULO */
    .game-container.intro-mode { 
      background: linear-gradient(160deg, #1d2b64 0%, #3f51b5 100%); 
    }
    
    .game-container.intro-mode .game-header { display: none; }
    
    .stars-bg { 
      position: absolute; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      background-image: 
        radial-gradient(1px 1px at 20% 30%, white, transparent), 
        radial-gradient(1px 1px at 80% 10%, white, transparent), 
        radial-gradient(1px 1px at 50% 50%, white, transparent), 
        radial-gradient(2px 2px at 90% 70%, white, transparent), 
        radial-gradient(2px 2px at 30% 90%, white, transparent); 
      background-repeat: repeat; 
      background-size: 300px 300px; 
      opacity: 0.8; 
      animation: zoom 40s infinite; 
    }
    
    .title-leo-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .title-speech-bubble {
      position: absolute;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 15px 20px;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      max-width: 300px;
      text-align: center;
      font-weight: 600;
      color: #333;
      z-index: 15;
    }
    
    .title-speech-bubble::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 10px;
      border-style: solid;
      border-color: white transparent transparent transparent;
    }
    
    .intro-mascot { 
      max-width: 70vw; 
      max-height: 400px;
      object-fit: contain;
      border-radius: 20px;
    }
    
    .title-mascot { 
      width: clamp(250px, 40vw, 350px); 
      height: auto;
      margin-bottom: -20px; 
    }
    
    .intro-main-title { 
      font-size: clamp(2.5rem, 8vw, 4.5rem); 
      font-weight: 900; 
      color: #ffeb3b; 
      text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4); 
      margin: 20px 0 10px 0; 
    }
    
    .intro-main-subtitle { 
      font-size: clamp(1rem, 3vw, 1.25rem); 
      color: #e3f2fd; 
      margin-bottom: 2.5rem; 
      text-shadow: 1px 1px 3px rgba(0,0,0,0.5); 
      max-width: 600px;
      text-align: center;
      line-height: 1.4;
    }
    
    .intro-start-button { 
      background-image: linear-gradient(45deg, #ffeb3b, #fbc02d); 
      color: #3f2a14; 
      font-size: clamp(1.2rem, 4vw, 1.5rem); 
      font-weight: 700; 
      padding: 15px 40px; 
      border-radius: 50px; 
      border: none; 
      box-shadow: 0 5px 20px rgba(251, 192, 45, 0.4); 
      cursor: pointer; 
      transition: all 0.3s ease; 
      animation: introPulse 2.5s infinite; 
    }
    
    .intro-start-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      animation: none;
    }
    
    .intro-explanation { 
      background: linear-gradient(135deg, #a8e0ff 0%, #c4f5c7 100%); 
    }
    
    .intro-content-wrapper { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 1.5rem; 
      max-width: 600px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .intro-mascot-container { 
      width: clamp(150px, 30vw, 200px); 
    }
    
    .speech-bubble { 
      background: white; 
      padding: 25px 30px; 
      border-radius: 20px; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
      position: relative; 
      max-width: 500px; 
      text-align: center; 
      font-size: clamp(1rem, 3vw, 1.3rem); 
      color: #333; 
      line-height: 1.6;
      font-weight: 600;
      border: 3px solid #4CAF50;
    }
    
    .speech-bubble::after { 
      content: ''; 
      position: absolute; 
      top: 100%; 
      left: 50%; 
      transform: translateX(-50%); 
      border-width: 15px; 
      border-style: solid; 
      border-color: white transparent transparent transparent; 
    }
    
    .intro-progress {
      margin-top: 2rem;
    }
    
    .intro-dots {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    
    .intro-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      transition: all 0.3s ease;
    }
    
    .intro-dot.active {
      background: #4CAF50;
      transform: scale(1.3);
    }
    
    @keyframes zoom { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
    @keyframes introPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    
    .animate-float { animation: float 4s ease-in-out infinite; }
    
    .screen-center { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      min-height: 100vh; 
      text-align: center; 
      padding: 20px; 
    }
    
    /* MELHORIAS NO JOGO */
    .progressBar { 
      position: sticky; 
      top: 85px; 
      left: 50%; 
      transform: translateX(-50%); 
      width: 80%; 
      max-width: 500px; 
      height: 25px; 
      background: rgba(255,255,255,0.8); 
      border-radius: 15px; 
      overflow: hidden; 
      z-index: 40; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
      border: 2px solid white; 
      margin-bottom: 1rem; 
    }
    
    .progressFill { 
      height: 100%; 
      background: linear-gradient(90deg, #81C784, #4CAF50); 
      transition: width 0.5s ease; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      color: white; 
      font-weight: bold; 
      font-size: 14px; 
    }
    
    .instruction-container { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: 1rem; 
      margin-bottom: 2rem; 
      flex-wrap: wrap;
    }
    
    .instruction-mascot { 
      width: clamp(60px, 10vw, 80px); 
      height: clamp(60px, 10vw, 80px); 
      border-radius: 50%; 
      border: 4px solid white; 
      box-shadow: 0 4px 10px rgba(0,0,0,0.1); 
      transition: all 0.3s ease;
    }
    
    .instruction-box { 
      background: rgba(255, 255, 255, 0.9); 
      border-radius: 20px; 
      padding: 15px 30px; 
      text-align: center; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
      max-width: 400px;
      transition: all 0.3s ease;
    }
    
    .instruction-box.speaking {
      background: rgba(76, 175, 80, 0.1);
      border: 2px solid #4CAF50;
      box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
    }
    
    .instruction-box h2 { 
      font-size: clamp(1.2rem, 4vw, 2rem); 
      font-weight: 900; 
      color: #00796B; 
      text-transform: capitalize; 
      margin: 0;
    }
    
    .game-area { 
      padding: 10px; 
      max-width: 900px; 
      margin: auto; 
    }
    
    .cards-grid { 
      display: grid; 
      gap: 15px; 
      justify-content: center; 
    }
    
    .cols-1 { grid-template-columns: repeat(2, 1fr); }
    .cols-2 { grid-template-columns: repeat(2, 1fr); }
    .cols-3 { grid-template-columns: repeat(3, 1fr); }
    .cols-4 { grid-template-columns: repeat(4, 1fr); }
    .cols-5 { grid-template-columns: repeat(5, 1fr); }
    
    @media (max-width: 600px) { 
      .cols-3, .cols-4, .cols-5 { grid-template-columns: repeat(2, 1fr); } 
    }
    
    /* CARDS COM SONS */
    .emotionCard { 
      border-radius: 20px; 
      background: white; 
      cursor: pointer; 
      transition: all 0.3s ease; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
      border: 4px solid transparent; 
      display: flex; 
      flex-direction: column; 
      padding: 8px; 
      align-items: center; 
      justify-content: center; 
      aspect-ratio: 1 / 1; 
      min-width: 100px;
      max-width: 180px;
    }
    
    .emotionCard:not([disabled]):hover { 
      transform: translateY(-8px) scale(1.05); 
      box-shadow: 0 8px 25px rgba(0,0,0,0.15); 
    }
    
    .card-image-wrapper { 
      width: 70%; 
      height: 70%; 
    }
    
    .emotionCard img { 
      width: 100%; 
      height: 100%; 
      object-fit: cover; 
      border-radius: 10px;
    }
    
    .card-label { 
      margin-top: 8px; 
      font-weight: 700; 
      color: #333; 
      font-size: clamp(0.8rem, 2vw, 1rem); 
      text-transform: capitalize; 
    }
    
    .cardCorrect { 
      animation: correctPulse 0.8s ease; 
      border-color: #4CAF50; 
      background: #C8E6C9; 
      box-shadow: 0 0 30px rgba(76, 175, 80, 0.6);
    }
    
    .cardWrong { 
      animation: wrongShake 0.8s ease; 
      border-color: #F44336; 
      background: #FFCDD2; 
      box-shadow: 0 0 30px rgba(244, 67, 54, 0.6);
    }
    
    @keyframes correctPulse { 
      0%, 100% { transform: scale(1); } 
      25% { transform: scale(1.15); } 
      50% { transform: scale(1.1); } 
      75% { transform: scale(1.15); } 
    }
    
    @keyframes wrongShake { 
      0%, 100% { transform: translateX(0); } 
      10% { transform: translateX(-10px) rotate(-2deg); } 
      20% { transform: translateX(10px) rotate(2deg); } 
      30% { transform: translateX(-10px) rotate(-2deg); } 
      40% { transform: translateX(10px) rotate(2deg); } 
      50% { transform: translateX(-8px) rotate(-1deg); } 
      60% { transform: translateX(8px) rotate(1deg); } 
      70% { transform: translateX(-6px); } 
      80% { transform: translateX(6px); } 
      90% { transform: translateX(-4px); } 
    }
    
    /* MODAIS MELHORADOS */
    .modal-container { 
      background: rgba(255, 255, 255, 0.95); 
      backdrop-filter: blur(15px); 
      border-radius: 30px; 
      padding: 30px 40px; 
      max-width: 90vw; 
      width: 500px; 
      box-shadow: 0 10px 40px rgba(0,0,0,0.2); 
      border: 3px solid white; 
      text-align: center;
    }
    
    .modal-mascot {
      width: clamp(80px, 20vw, 120px);
      height: clamp(80px, 20vw, 120px);
      margin: 0 auto 1rem auto;
      border-radius: 50%;
      border: 4px solid #FFD700;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    }
    
    .modal-mascot.champion {
      border: 4px solid #FF6B6B;
      box-shadow: 0 0 30px rgba(255, 107, 107, 0.7);
    }
    
    .modal-title { 
      font-size: clamp(1.8rem, 5vw, 2.5rem); 
      font-weight: 900; 
      margin-bottom: 1rem; 
      color: #004D40; 
    }
    
    .modal-title.congrats { 
      color: #FFA000; 
      text-shadow: 0 2px 4px rgba(255, 160, 0, 0.3);
    }
    
    .modal-icon { 
      font-size: clamp(3rem, 8vw, 5rem); 
      margin-bottom: 1rem; 
    }
    
    .modal-trophy { 
      width: clamp(60px, 15vw, 80px); 
      height: clamp(60px, 15vw, 80px); 
      color: #FFC107; 
      margin: 0 auto 1rem auto; 
      animation: trophyBounce 2s infinite; 
    }
    
    .total-score-highlight, .final-score { 
      font-size: clamp(1.5rem, 4vw, 2rem); 
      font-weight: 900; 
      color: #00796B; 
      margin-bottom: 1.5rem; 
      display: block; 
    }
    
    .completion-message {
      font-size: clamp(1rem, 3vw, 1.2rem);
      color: #666;
      margin-bottom: 2rem;
      font-weight: 600;
    }
    
    .modal-button { 
      color: white; 
      font-size: clamp(1rem, 3vw, 1.2rem); 
      font-weight: 700; 
      padding: 12px 30px; 
      border-radius: 50px; 
      border: none; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.2); 
      cursor: pointer; 
      transition: all 0.3s ease; 
      transform: scale(1); 
    }
    
    .modal-button:hover { transform: scale(1.05); }
    
    .modal-button.next-level { 
      background-image: linear-gradient(45deg, #66BB6A, #4CAF50); 
    }
    
    .modal-button.play-again { 
      background-image: linear-gradient(45deg, #26C6DA, #00ACC1); 
    }
    
    @keyframes trophyBounce { 
      0%, 100% { transform: translateY(0); } 
      50% { transform: translateY(-15px); } 
    }

    /* RESPONSIVIDADE ADICIONAL */
    @media (max-width: 480px) {
      .intro-content-wrapper {
        padding: 0 15px;
      }
      
      .instruction-container {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .cards-grid {
        gap: 10px;
      }
      
      .emotionCard {
        min-width: 80px;
      }
      
      .modal-container {
        padding: 20px 25px;
      }
      
      .title-speech-bubble {
        position: static;
        transform: none;
        margin-bottom: 20px;
      }
    }
    
    /* PREFERS REDUCED MOTION */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  return (
    <div className={`game-container ${gameState === 'titleScreen' || gameState === 'autoIntro' ? 'intro-mode' : ''}`}>
      <style>{cssStyles}</style>
      <header className="game-header">
        <a href="/dashboard" className="header-button"><ArrowLeft size={24} /></a>
        <h1 className="game-title">😊 Expressões</h1>
        <div className="header-score">🏆 {totalScore}</div>
        <button onClick={toggleSound} className="header-button">
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </header>
      <main>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
}
