'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Trophy, ArrowLeft } from 'lucide-react';
// NOVO: Importando nosso gerenciador de áudio
import { GameAudioManager } from '../utils/gameAudioManager'; // Ajuste o caminho se necessário

// --- EFEITO DE CONFETE (sem alterações) ---
const confetti = (opts = {}) => {
  // ... (código do confete permanece o mesmo)
};
const ConfettiEffect = () => {
  useEffect(() => {
    // ... (código do ConfettiEffect permanece o mesmo)
  }, []);
  return null;
};


// --- COMPONENTES DE UI (sem alterações) ---
const Card = React.memo(({ emotion, onClick, isCorrect, isWrong, isDisabled }) => (
  <motion.button
    onClick={onClick}
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
));

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
// REMOVIDO: Objeto SOUNDS não é mais necessário, o AudioManager cuida disso.
// const SOUNDS = { ... };

// REMOVIDO: Função playSound foi substituída pelo AudioManager.
// const playSound = (soundName) => { ... };

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
  { phase: 1, numCards: 2, numRounds: 2, points: 100 },
  { phase: 2, numCards: 3, numRounds: 3, points: 120 },
  { phase: 3, numCards: 4, numRounds: 3, points: 140 },
  { phase: 4, numCards: 5, numRounds: 5, points: 160 },
  { phase: 5, numCards: 6, numRounds: 5, points: 180 },
  { phase: 6, numCards: 8, numRounds: 6, points: 200 },
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// --- COMPONENTE PRINCIPAL DO JOGO ---
export default function FacialExpressionsGame() {
  // NOVO: Instância única do nosso gerenciador de áudio
  const audioManager = useMemo(() => GameAudioManager.getInstance(), []);

  const [gameState, setGameState] = useState('titleScreen');
  const [introStep, setIntroStep] = useState(0);
  const [leoMessage, setLeoMessage] = useState('');
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

  const introMessages = [
    "Olá! Eu sou o Leo. Vamos aprender sobre as emoções juntos?",
    "É bem fácil! Eu vou falar uma emoção, como 'Feliz' ou 'Triste'.",
    "Você só precisa de clicar na imagem certa que aparece no ecrã.",
    "A cada fase, mais emoções aparecem! Vamos começar a diversão?"
  ];

  // ALTERADO: leoSpeak agora usa o GameAudioManager com a voz do Leo (Azure)
  const leoSpeak = useCallback((message, callback) => {
    setLeoMessage(message);
    if (soundEnabled) {
      audioManager.falarLeo(message, callback);
    } else {
        callback?.();
    }
  }, [soundEnabled, audioManager]);

  const handleStartIntro = async () => {
    // NOVO: Inicializa o contexto de áudio com um gesto do usuário
    await audioManager.forceInitialize();
    setGameState('intro');
    // NOVO: Narração de boas-vindas na tela inicial
    leoSpeak("Bem-vindo ao mundo das Expressões Faciais!", () => {
        // A introdução normal começa após a saudação
        setTimeout(() => leoSpeak(introMessages[0]), 500);
    });
  };

  const handleIntroNext = () => {
    const nextStep = introStep + 1;
    if (nextStep < introMessages.length) {
      setIntroStep(nextStep);
      leoSpeak(introMessages[nextStep]);
    } else {
      startGame();
    }
  };
  
  // NOVO: Hook para narrar eventos de conclusão de fase e jogo
  useEffect(() => {
    if (gameState === 'phaseComplete') {
        const phaseInfo = GAME_PHASES[currentPhaseIndex];
        const message = `Fase ${phaseInfo.phase} completa! Você ganhou ${phaseInfo.points} pontos!`;
        leoSpeak(message);
        if(soundEnabled) audioManager.playSoundEffect('levelComplete');
    } else if (gameState === 'gameComplete') {
        const message = `Incrível! Você completou todas as fases e fez ${totalScore} pontos! Parabéns!`;
        leoSpeak(message);
    }
  }, [gameState, currentPhaseIndex, totalScore, leoSpeak, soundEnabled, audioManager]);


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

    // NOVO: Anúncio da dificuldade e progresso da fase
    const startMessage = phaseIndex > 0 
      ? `Muito bem! Agora com ${phaseConfig.numCards} emoções. Encontre ${sequence[0].label}`
      : `Vamos começar! Encontre ${sequence[0].label}`;
    
    leoSpeak(startMessage);

  }, [leoSpeak]);

  const startGame = () => {
    setCurrentPhaseIndex(0);
    setTotalScore(0);
    setGameState('playing');
    // preparePhase é chamado pelo useEffect abaixo
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
      if (soundEnabled) audioManager.playSoundEffect('correct'); // ALTERADO

      setTimeout(() => {
        const nextTargetIndex = currentTargetIndex + 1;
        if (nextTargetIndex < targetSequence.length) {
          setCurrentTargetIndex(nextTargetIndex);
          setFeedback(null);
          setSelectedCardId(null);
          setIsDisabled(false);
          leoSpeak(targetSequence[nextTargetIndex].label);
        } else {
          // A transição para 'phaseComplete' agora é silenciosa,
          // pois o useEffect cuidará da narração.
          setGameState('phaseComplete');
        }
      }, 1200);
    } else {
      setFeedback('wrong');
      if (soundEnabled) audioManager.playSoundEffect('wrong'); // ALTERADO
      setTimeout(() => {
        setFeedback(null);
        setSelectedCardId(null);
        setIsDisabled(false);
        // Opcional: repetir a instrução em caso de erro
        leoSpeak(`Opa, tente de novo. Onde está ${currentTarget.label}?`);
      }, 1000);
    }
  }, [isDisabled, targetSequence, currentTargetIndex, currentPhaseIndex, soundEnabled, leoSpeak, audioManager]);

  const nextPhase = () => {
    const nextPhaseIndex = currentPhaseIndex + 1;
    if (nextPhaseIndex < GAME_PHASES.length) {
      setCurrentPhaseIndex(nextPhaseIndex);
      setGameState('playing');
    } else {
      setGameState('gameComplete');
    }
  };

  // NOVO: Função para controlar o som globalmente
  const toggleSound = () => {
    const isNowEnabled = audioManager.toggleAudio();
    setSoundEnabled(isNowEnabled);
  }

  // --- RENDERIZAÇÃO ---
  // (Nenhuma alteração nos blocos de renderização, apenas a lógica acima foi modificada)
  const renderTitleScreen = () => (
    <div className="screen-center">
      <div className="stars-bg"></div>
      <motion.div className="animate-float" style={{zIndex: 10}}>
        <img src="/images/mascotes/leo/Leo_emocoes_espelho.webp" alt="Leo Mascote Emoções" className="intro-mascot title-mascot" />
      </motion.div>
      <h1 className="intro-main-title">Expressões Faciais</h1>
      <p className="intro-main-subtitle">Aprenda e divirta-se com as emoções!</p>
      <motion.button 
        onClick={handleStartIntro}
        className="intro-start-button" 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Começar Aventura
      </motion.button>
    </div>
  );

  const renderIntroScreen = () => (
     <div className="screen-center intro-explanation">
      <div className="intro-content-wrapper">
        <div className="intro-mascot-container">
          <img src="/images/mascotes/leo/Leo_apoio.webp" alt="Leo" className="intro-mascot" />
        </div>
        <div className="speech-bubble"><p>{leoMessage}</p></div>
      </div>
      <button onClick={handleIntroNext} className="intro-next-button">
        {introStep < introMessages.length - 1 ? 'Próximo →' : 'Vamos Começar!'}
      </button>
    </div>
  );

  const renderGameScreen = () => (
    <>
      <ProgressBar current={currentTargetIndex + 1} total={targetSequence.length} />
      <div className="game-area">
        <div className="instruction-container">
          <img src="/images/mascotes/leo/leo_rosto_resultado.webp" alt="Leo" className="instruction-mascot"/>
          <div className="instruction-box"><h2>{leoMessage}</h2></div>
        </div>
        <div className={`cards-grid cols-${Math.ceil(cardsForPhase.length / 2)}`}>
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
      <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className="modal-container">
        <h2 className="modal-title">Fase {GAME_PHASES[currentPhaseIndex].phase} Completa!</h2>
        <div className="modal-icon">🎉</div>
        <p>Pontuação: <span className="total-score-highlight">{totalScore}</span></p>
        <button onClick={nextPhase} className="modal-button next-level">Próxima Fase</button>
      </motion.div>
    </div>
  );

  const renderGameCompleteScreen = () => (
    <div className="screen-center">
      <ConfettiEffect />
      <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className="modal-container">
        <Trophy className="modal-trophy" />
        <h2 className="modal-title congrats">PARABÉNS!</h2>
        <p className="final-score">Pontuação Final: {totalScore}</p>
        <button onClick={startGame} className="modal-button play-again">Jogar Novamente</button>
      </motion.div>
    </div>
  );
  
  const renderContent = () => {
    // ... (código sem alterações)
  };

  const cssStyles = `
    // ... (código CSS sem alterações)
  `;

  return (
    <div className={`game-container ${gameState === 'titleScreen' || gameState === 'intro' ? 'intro-mode' : ''}`}>
      <style>{cssStyles}</style>
      <header className="game-header">
        <a href="/dashboard" className="header-button"><ArrowLeft size={24} /></a>
        <h1 className="game-title">😊 Expressões</h1>
        <div className="header-score">🏆 {totalScore}</div>
        {/* ALTERADO: Botão agora usa a função toggleSound */}
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
