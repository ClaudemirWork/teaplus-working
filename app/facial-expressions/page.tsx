'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Trophy, ArrowLeft } from 'lucide-react';
import { GameAudioManager } from '@/utils/gameAudioManager';
import styles from './emotionrecognition.module.css';

// Confete simples e estável
const confetti = (opts: any = {}) => {
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

    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    const COLORS = ['#FFC107','#FF9800','#FF5722','#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50','#8BC34A','#CDDC39','#FFEB3B'];

    const particles: any[] = [];
    const particleCount = opts.particleCount || 150;
    const origin = opts.origin || { x: 0.5, y: 0.5 };
    const spread = opts.spread || 90;
    const startVelocity = opts.startVelocity || 45;
    const decay = opts.decay || 0.92;
    const gravity = opts.gravity || 0.7;

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    class Particle {
      x: number; y: number; color: string; size: number;
      vx: number; vy: number; rot: number; rotSpeed: number; op: number;
      constructor() {
        this.x = W * origin.x; this.y = H * origin.y;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.size = rand(5, 12);
        this.vx = rand(-spread / 2, spread / 2);
        this.vy = rand(-startVelocity, -startVelocity / 2);
        this.rot = Math.random() * 360;
        this.rotSpeed = rand(-5, 5);
        this.op = 1;
      }
      update() {
        this.vy += gravity;
        this.vx *= decay; this.vy *= decay;
        this.x += this.vx; this.y += this.vy;
        this.rot += this.rotSpeed;
        this.op -= 0.01;
      }
      draw() {
        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate((this.rot * Math.PI) / 180);
        ctx!.globalAlpha = this.op;
        ctx!.fillStyle = this.color;
        ctx!.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx!.restore();
      }
    }

    const animate = () => {
      ctx!.clearRect(0,0,W,H);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.op > 0) { p.update(); p.draw(); }
        else particles.splice(i,1);
      }
      if (particles.length > 0) requestAnimationFrame(animate);
      else if (document.body.contains(canvas)) document.body.removeChild(canvas);
    };

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    animate();
  } catch {}
};

const ConfettiEffect = () => {
  useEffect(() => {
    const fire = (p: number, o: any) => confetti({ particleCount: Math.floor(200*p), ...o });
    fire(0.25, { spread: 30, startVelocity: 60, origin: { x: 0, y: 0.7 } });
    fire(0.2, { spread: 60, origin: { x: 0.5, y: 0.6 } });
    fire(0.35, { spread: 100, decay: 0.91, origin: { x: 1, y: 0.7 } });
  }, []);
  return null;
};

// Dados
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

// Efeitos breves
const SOUNDS = {
  correct: 'https://freesound.org/data/previews/391/391715_5674468-lq.mp3',
  wrong: 'https://freesound.org/data/previews/174/174414_3229994-lq.mp3',
  levelComplete: 'https://freesound.org/data/previews/270/270333_5123851-lq.mp3',
};
const playSound = (name: keyof typeof SOUNDS) => { try { const a = new Audio(SOUNDS[name]); a.play().catch(()=>{}); } catch {} };

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

  // Fala do Leo via Azure
  const sayLeo = useCallback(async (text: string, priority = 1) => {
    const audio = GameAudioManager.getInstance();
    if (!audio.getAudioEnabled() || !soundEnabled) return;
    await audio.forceInitialize().catch(()=>{});
    audio.falarLeo(text, undefined, priority);
    setLeoMessage(text);
  }, [soundEnabled]);

  const handleStartIntro = useCallback(async () => {
    setGameState('intro');
    const audio = GameAudioManager.getInstance();
    await audio.forceInitialize().catch(()=>{});
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
      if (soundEnabled) playSound('correct');
      setTimeout(() => {
        const next = currentTargetIndex + 1;
        if (next < targetSequence.length) {
          setCurrentTargetIndex(next);
          setFeedback(null);
          setSelectedCardId(null);
          setIsDisabled(false);
          sayLeo(targetSequence[next].label, 2);
        } else {
          if (soundEnabled) playSound('levelComplete');
          setGameState('phaseComplete');
        }
      }, 900);
    } else {
      setFeedback('wrong');
      if (soundEnabled) playSound('wrong');
      setTimeout(() => {
        setFeedback(null);
        setSelectedCardId(null);
        setIsDisabled(false);
      }, 800);
    }
  }, [isDisabled, targetSequence, currentTargetIndex, currentPhaseIndex, soundEnabled, sayLeo]);

  const nextPhase = useCallback(() => {
    const next = currentPhaseIndex + 1;
    if (next < GAME_PHASES.length) { setCurrentPhaseIndex(next); setGameState('playing'); }
    else setGameState('gameComplete');
  }, [currentPhaseIndex]);

  // Views
  const TitleView = () => (
    <div className={styles.screenCenter}>
      <div className="stars-bg"></div>
      <motion.div className="animate-float" style={{ zIndex: 10 }}>
        <img src="/images/mascotes/leo/Leo_emocoes_espelho.webp" alt="Leo Mascote Emoções" className="intro-mascot title-mascot" />
      </motion.div>
      <h1 className="intro-main-title">Expressões Faciais</h1>
      <p className="intro-main-subtitle">Aprenda e divirta-se com as emoções!</p>
      <motion.button onClick={handleStartIntro} className="intro-start-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        Ouvir Introdução
      </motion.button>
    </div>
  );

  const IntroUnifiedView = () => (
    <div className="screen-center intro-explanation">
      <div className="intro-content-wrapper speaking">
        <div className="intro-mascot-container">
          <img src="/images/mascotes/leo/Leo_apoio.webp" alt="Leo" className="intro-mascot" />
        </div>
        <div className="speech-bubble">
          <p style={{ marginBottom: 8 }}>Olá! Eu sou o Leo. Vamos aprender sobre as emoções juntos?</p>
          <p style={{ marginBottom: 8 }}>Eu vou falar uma emoção, como Feliz, ou Triste.</p>
          <p style={{ marginBottom: 8 }}>Encontre a imagem certa que aparece na tela.</p>
          <p style={{ margin: 0 }}>A cada fase, mais emoções aparecem. Preparado?</p>
        </div>
      </div>
      <button onClick={startGame} className="intro-next-button" disabled={!introDone} aria-disabled={!introDone}>
        {!introDone ? 'Aguarde…' : 'Vamos Começar!'}
      </button>
    </div>
  );

  const GameView = () => (
    <>
      <div className="progressBar">
        <div className="progressFill" style={{ width: `${targetSequence.length ? ((currentTargetIndex + 1) / targetSequence.length) * 100 : 0}%` }}>
          {targetSequence.length ? Math.round(((currentTargetIndex + 1) / targetSequence.length) * 100) : 0}%
        </div>
      </div>
      <div className="game-area">
        <div className="instruction-container speaking">
          <img src="/images/mascotes/leo/leo_rosto_resultado.webp" alt="Leo" className="instruction-mascot" />
          <div className="instruction-box"><h2>{leoMessage}</h2></div>
        </div>
        <div className={`cards-grid cols-${Math.ceil(cardsForPhase.length / 2)}`}>
          <AnimatePresence>
            {cardsForPhase.map((card) => (
              <motion.div key={card.id} layout>
                <button
                  className={`emotionCard ${feedback === 'correct' && card.id === selectedCardId ? 'cardCorrect' : ''} ${feedback === 'wrong' && card.id === selectedCardId ? 'cardWrong' : ''}`}
                  onClick={() => selectCard(card)}
                  disabled={isDisabled}
                >
                  <div className="card-image-wrapper">
                    <img src={card.path} alt={card.label} onError={(e: any) => { e.currentTarget.src = 'https://placehold.co/150x150/EBF4FA/333?text=?'; }} />
                  </div>
                  <span className="card-label">{card.label}</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  const PhaseCompleteView = () => (
    <div className="screen-center">
      <ConfettiEffect />
      <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className="modal-container">
        <h2 className="modal-title">Fase {GAME_PHASES[currentPhaseIndex].phase} Completa!</h2>
        <div className="modal-icon">🎉</div>
        <p> Pontuação: <span className="total-score-highlight">{totalScore}</span> </p>
        <button onClick={nextPhase} className="modal-button next-level">Próxima Fase</button>
      </motion.div>
    </div>
  );

  const GameCompleteView = () => (
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

  return (
    <div className={`game-container ${gameState === 'title' || gameState === 'intro' ? 'intro-mode' : ''}`}>
      <header className="game-header">
        <a href="/dashboard" className="header-button"><ArrowLeft size={24} /></a>
        <h1 className="game-title">😊 Expressões</h1>
        <div className="header-score">🏆 {totalScore}</div>
        <button
          onClick={() => { const enabled = GameAudioManager.getInstance().toggleAudio(); setSoundEnabled(enabled); }}
          className="header-button" aria-label="Alternar som"
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
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
