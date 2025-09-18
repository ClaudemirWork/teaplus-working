'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Trophy, ArrowLeft } from 'lucide-react';
import { GameAudioManager } from '@/utils/gameAudioManager';
import styles from './emotionrecognition.module.css';

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

const shuffleArray = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

export default function FacialExpressionsPage() {
  const [gameState, setGameState] = useState<'title'|'intro'|'playing'|'phaseComplete'|'gameComplete'>('title');
  const [leoMessage, setLeoMessage] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  const [cardsForPhase, setCardsForPhase] = useState<any[]>([]);
  const [targetSequence, setTargetSequence] = useState<any[]>([]);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState<string|null>(null);
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const sayLeo = useCallback(async (text: string, priority = 1) => {
    const audio = GameAudioManager.getInstance();
    if (!audio.getAudioEnabled() || !soundEnabled) return;
    await audio.forceInitialize().catch(()=>{});
    if (audio.shouldSpeak('leo', 300)) {
      audio.falarLeo(text, undefined, priority);
      setLeoMessage(text);
    }
  }, [soundEnabled]);

  const handleStartIntro = useCallback(async () => {
    setGameState('intro');
    const audio = GameAudioManager.getInstance();
    await audio.forceInitialize().catch(()=>{});
    audio.pararTodos();
    const parts = [
      'Olá! Eu sou o Leo. Vamos aprender sobre as emoções juntos?',
      'Eu vou falar uma emoção, como Feliz, ou Triste.',
      'Encontre a imagem certa que aparece na tela.',
      'A cada fase, mais emoções aparecem. Preparado?',
    ];
    parts.forEach((p, idx) => {
      audio.falarLeo(p, idx === parts.length - 1 ? () => setIntroDone(true) : undefined, 1);
    });
    setLeoMessage(parts[0]);
  }, []);

  const startGame = useCallback(() => {
    const audio = GameAudioManager.getInstance();
    audio.pararTodos();
    setCurrentPhaseIndex(0);
    setTotalScore(0);
    setGameState('playing');
  }, []);

  const preparePhase = useCallback((phaseIndex: number) => {
    const phase = GAME_PHASES[phaseIndex];
    const all = shuffleArray(EMOTION_CARDS);
    const show = all.slice(0, phase.numCards);
    const seq: any[] = [];
    for (let i = 0; i < phase.numRounds; i++) seq.push(show[Math.floor(Math.random() * show.length)]);
    setCardsForPhase(show);
    setTargetSequence(seq);
    setCurrentTargetIndex(0);
    setFeedback(null);
    setSelectedCardId(null);
    setIsDisabled(false);
    sayLeo(seq[0].label, 2);
  }, [sayLeo]);

  useEffect(() => {
    if (gameState === 'playing') preparePhase(currentPhaseIndex);
  }, [gameState, currentPhaseIndex, preparePhase]);

  const selectCard = useCallback((card: any) => {
    if (isDisabled) return;
    setIsDisabled(true);
    setSelectedCardId(card.id);
    const target = targetSequence[currentTargetIndex];
    const ok = card.id === target.id;

    if (ok) {
      setFeedback('correct');
      setTotalScore(p => p + GAME_PHASES[currentPhaseIndex].points);
      setTimeout(() => {
        const next = currentTargetIndex + 1;
        if (next < targetSequence.length) {
          setCurrentTargetIndex(next);
          setFeedback(null);
          setSelectedCardId(null);
          setIsDisabled(false);
          sayLeo(targetSequence[next].label, 2);
        } else {
          setGameState('phaseComplete');
        }
      }, 700);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setSelectedCardId(null);
        setIsDisabled(false);
      }, 600);
    }
  }, [isDisabled, targetSequence, currentTargetIndex, currentPhaseIndex, sayLeo]);

  const nextPhase = useCallback(() => {
    const next = currentPhaseIndex + 1;
    if (next < GAME_PHASES.length) { setCurrentPhaseIndex(next); setGameState('playing'); }
    else setGameState('gameComplete');
  }, [currentPhaseIndex]);

  const TitleView = () => (
    <div className={styles.screenCenter}>
      <div className={styles.starsBg}></div>
      <motion.div className={styles.animateFloat} style={{ zIndex: 10 }}>
        <img src="/images/mascotes/leo/Leo_emocoes_espelho.webp" alt="Leo Mascote Emoções" className={`${styles.introMascot} ${styles.titleMascot}`} />
      </motion.div>
      <h1 className={styles.introMainTitle}>Expressões Faciais</h1>
      <p className={styles.introMainSubtitle}>Aprenda e divirta-se com as emoções!</p>
      <motion.button onClick={handleStartIntro} className={styles.introStartButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        Ouvir Introdução
      </motion.button>
    </div>
  );

  const IntroUnifiedView = () => (
    <div className={`${styles.screenCenter} ${styles.introExplanation}`}>
      <div className={`${styles.introContentWrapper} ${styles.speaking}`}>
        <div className={styles.introMascotContainer}>
          <img src="/images/mascotes/leo/Leo_apoio.webp" alt="Leo" className={styles.introMascot} />
        </div>
        <div className={styles.speechBubble}>
          <p style={{ marginBottom: 8 }}>Olá! Eu sou o Leo. Vamos aprender sobre as emoções juntos?</p>
          <p style={{ marginBottom: 8 }}>Eu vou falar uma emoção, como Feliz, ou Triste.</p>
          <p style={{ marginBottom: 8 }}>Encontre a imagem certa que aparece na tela.</p>
          <p style={{ margin: 0 }}>A cada fase, mais emoções aparecem. Preparado?</p>
        </div>
      </div>
      <button onClick={startGame} className={styles.introNextButton} disabled={!introDone} aria-disabled={!introDone}>
        {!introDone ? 'Aguarde…' : 'Vamos Começar!'}
      </button>
    </div>
  );

  const GameView = () => (
    <>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${targetSequence.length ? ((currentTargetIndex + 1) / targetSequence.length) * 100 : 0}%` }}>
          {targetSequence.length ? Math.round(((currentTargetIndex + 1) / targetSequence.length) * 100) : 0}%
        </div>
      </div>
      <div className={styles.gameArea}>
        <div className={`${styles.instructionContainer} ${styles.speaking}`}>
          <img src="/images/mascotes/leo/leo_rosto_resultado.webp" alt="Leo" className={styles.instructionMascot} />
          <div className={styles.instructionBox}><h2>{leoMessage}</h2></div>
        </div>
        <div className={`${styles.cardsGrid} ${styles[`cols${Math.ceil(cardsForPhase.length / 2) > 4 ? 4 : Math.ceil(cardsForPhase.length / 2)}`]}`}>
          <AnimatePresence>
            {cardsForPhase.map((card) => (
              <motion.div key={card.id} layout>
                <button
                  className={`${styles.emotionCard} ${feedback === 'correct' && card.id === selectedCardId ? styles.cardCorrect : ''} ${feedback === 'wrong' && card.id === selectedCardId ? styles.cardWrong : ''}`}
                  onClick={() => selectCard(card)}
                  disabled={isDisabled}
                >
                  <div className={styles.cardImageWrapper}>
                    <img src={card.path} alt={card.label} onError={(e: any) => { e.currentTarget.src = 'https://placehold.co/150x150/EBF4FA/333?text=?'; }} />
                  </div>
                  <span className={styles.cardLabel}>{card.label}</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  const PhaseCompleteView = () => (
    <div className={styles.screenCenter}>
      <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className={styles.modalContainer}>
        <h2 className={styles.modalTitle}>Fase {GAME_PHASES[currentPhaseIndex].phase} Completa!</h2>
        <div className={styles.modalIcon}>🎉</div>
        <p> Pontuação: <span className={styles.totalScoreHighlight}>{totalScore}</span> </p>
        <button onClick={nextPhase} className={`${styles.modalButton} ${styles.nextLevel}`}>Próxima Fase</button>
      </motion.div>
    </div>
  );

  const GameCompleteView = () => (
    <div className={styles.screenCenter}>
      <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className={styles.modalContainer}>
        <Trophy className={styles.modalTrophy} />
        <h2 className={`${styles.modalTitle} ${styles.congrats}`}>PARABÉNS!</h2>
        <p className={styles.finalScore}>Pontuação Final: {totalScore}</p>
        <button onClick={startGame} className={`${styles.modalButton} ${styles.playAgain}`}>Jogar Novamente</button>
      </motion.div>
    </div>
  );

  return (
    <div className={`${styles.gameContainer} ${(gameState === 'title' || gameState === 'intro') ? styles.introMode : ''}`}>
      <header className={styles.gameHeader}>
        <a href="/dashboard" className={styles.headerButton}><ArrowLeft size={24} /></a>
        <h1 className={styles.gameTitle}>😊 Expressões</h1>
        <div className={styles.headerScore}>🏆 {totalScore}</div>
        <button
          onClick={() => { const enabled = GameAudioManager.getInstance().toggleAudio(); setSoundEnabled(enabled); }}
          className={styles.headerButton} aria-label="Alternar som"
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <motion.div key={gameState} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {gameState === 'title' && <TitleView />}
            {gameState === 'intro' && <IntroUnifiedView />}
            {gameState === 'playing' && <GameView />}
            {gameState === 'phaseComplete' && <PhaseCompleteView />}
            {gameState === 'gameComplete' && <GameCompleteView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
