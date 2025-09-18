'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Trophy, ArrowLeft } from 'lucide-react';
import { GameAudioManager } from '@/utils/gameAudioManager';

// Confete simplificado e estável
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

// UI auxiliares
const Card = React.memo(function Card({ emotion, onClick, isCorrect, isWrong, isDisabled }: any) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      className={`emotionCard ${isCorrect ? 'cardCorrect' : ''} ${isWrong ? 'cardWrong' : ''}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="card-image-wrapper">
        <img
          src={emotion.path}
          alt={emotion.label}
          onError={(e: any) => { e.currentTarget.src = 'https://placehold.co/150x150/EBF4FA/333?text=?'; }}
        />
      </div>
      <span className="card-label">{emotion.label}</span>
    </motion.button>
  );
});

const ProgressBar = React.memo(function ProgressBar({ current, total }: any) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="progressBar">
      <div className="progressFill" style={{ width: `${progress}%` }}>{Math.round(progress)}%</div>
    </div>
  );
});

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

// Efeitos simples
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

  // TTS Leo
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
    for (let i = 0; i < phase.numRounds; i++) seq.push(show[Math.floor(Math.random()*show.length)]);

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
    <div className="screen-center">
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
      <ProgressBar current={currentTargetIndex + 1} total={targetSequence.length} />
      <div className="game-area">
        <div className="instruction-container speaking">
          <img src="/images/mascotes/leo/leo_rosto_resultado.webp" alt="Leo" className="instruction-mascot" />
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

  const renderContent = () => {
    switch (gameState) {
      case 'title': return <TitleView />;
      case 'intro': return <IntroUnifiedView />;
      case 'playing': return <GameView />;
      case 'phaseComplete': return <PhaseCompleteView />;
      case 'gameComplete': return <GameCompleteView />;
      default: return <TitleView />;
    }
  };

  // CSS completo (mesmo do arquivo “efeitos especiais”, com ajustes finais)
  const cssStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');
    .game-container { font-family: 'Nunito', sans-serif; min-height: 100vh; background: linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%); position: relative; overflow: hidden; color: #333; }
    .game-header { position: sticky; top: 10px; left: 50%; transform: translateX(-50%); z-index: 50; padding: 10px 20px; background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 20px; display: flex; justify-content: space-between; align-items: center; max-width: 95%; width: 600px; margin: 0 auto; }
    .header-button { background: none; border: none; padding: 8px; border-radius: 50%; cursor: pointer; transition: background-color 0.2s; color: #555; }
    .header-button:hover { background-color: rgba(0,0,0,0.1); }
    .game-title { font-size: 1.5rem; font-weight: 900; color: #00796B; display: flex; align-items: center; gap: 8px; }
    .header-score { font-size: 1.2rem; font-weight: 900; color: #004D40; }
    .stars-bg { position: absolute; top:0; left:0; width:100%; height:100%; background-image: radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(2px 2px at 90% 70%, white, transparent), radial-gradient(2px 2px at 30% 90%, white, transparent); background-repeat: repeat; background-size: 300px 300px; opacity: 0.8; animation: zoom 40s infinite; }
    @keyframes zoom { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
    .intro-mascot { max-width: 70vw; max-height: 400px; filter: drop-shadow(0 15px 30px rgba(0,0,0,0.4)); object-fit: contain; }
    .title-mascot { width: clamp(250px, 40vw, 450px); height: auto; margin-bottom: -20px; }
    .intro-main-title { font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 900; color: #ffeb3b; text-shadow: 0px 4px 10px rgba(0,0,0,0.4); margin: 20px 0 10px 0; }
    .intro-main-subtitle { font-size: clamp(1rem, 3vw, 1.25rem); color: #e3f2fd; margin-bottom: 2.5rem; text-shadow: 1px 1px 3px rgba(0,0,0,0.5); max-width: 600px; text-align: center; line-height: 1.4; }
    .intro-start-button { background-image: linear-gradient(45deg, #ffeb3b, #fbc02d); color: #3f2a14; font-size: clamp(1.2rem, 4vw, 1.5rem); font-weight: 700; padding: 15px 40px; border-radius: 50px; border: none; box-shadow: 0 5px 20px rgba(251, 192, 45, 0.4); cursor: pointer; transition: all 0.3s ease; animation: introPulse 2.5s infinite; }
    .intro-explanation { background: linear-gradient(135deg, #a8e0ff 0%, #c4f5c7 100%); }
    .intro-content-wrapper { display: flex; flex-direction: column; align-items: center; gap: 1rem; max-width: 600px; margin: 0 auto; padding: 0 20px; }
    .intro-mascot-container { width: clamp(150px, 30vw, 180px); }
    .speech-bubble { background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); position: relative; max-width: 480px; text-align: center; font-size: clamp(1rem, 3vw, 1.2rem); color: #333; line-height: 1.5; }
    .speech-bubble::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border-width: 15px; border-style: solid; border-color: white transparent transparent transparent; }
    .intro-next-button { margin-top: 2rem; background: #4CAF50; color: white; padding: 12px 30px; border-radius: 30px; font-size: clamp(1rem, 3vw, 1.2rem); font-weight: 700; border: none; box-shadow: 0 4px 10px rgba(0,0,0,0.2); cursor: pointer; transition: all 0.3s ease; }
    .intro-next-button:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.3); }
    @keyframes float { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-15px);} }
    @keyframes introPulse { 0%,100%{ transform: scale(1);} 50%{ transform: scale(1.05);} }
    .animate-float { animation: float 4s ease-in-out infinite; }
    .screen-center { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 20px; }
    .progressBar { position: sticky; top: 85px; left: 50%; transform: translateX(-50%); width: 80%; max-width: 500px; height: 25px; background: rgba(255,255,255,0.8); border-radius: 15px; overflow: hidden; z-index: 40; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border: 2px solid white; margin-bottom: 1rem; }
    .progressFill { height: 100%; background: linear-gradient(90deg, #81C784, #4CAF50); transition: width 0.5s ease; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; }
    .instruction-container { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .instruction-mascot { width: clamp(60px, 10vw, 80px); height: clamp(60px, 10vw, 80px); border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .instruction-box { background: rgba(255,255,255,0.9); border-radius: 20px; padding: 15px 30px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 400px; }
    .instruction-box h2 { font-size: clamp(1.2rem, 4vw, 2rem); font-weight: 900; color: #00796B; text-transform: capitalize; margin: 0; }
    .game-area { padding: 10px; max-width: 900px; margin: auto; }
    .cards-grid { display: grid; gap: 15px; justify-content: center; }
    .cols-1 { grid-template-columns: repeat(2, 1fr); }
    .cols-2 { grid-template-columns: repeat(2, 1fr); }
    .cols-3 { grid-template-columns: repeat(3, 1fr); }
    .cols-4 { grid-template-columns: repeat(4, 1fr); }
    @media (max-width: 600px) { .cols-3, .cols-4 { grid-template-columns: repeat(2, 1fr); } }
    .emotionCard { border-radius: 20px; background: white; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 4px solid transparent; display: flex; flex-direction: column; padding: 8px; align-items: center; justify-content: center; aspect-ratio: 1 / 1; min-width: 100px; max-width: 180px; }
    .emotionCard:not([disabled]):hover { transform: translateY(-8px) scale(1.05); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
    .card-image-wrapper { width: 70%; height: 70%; }
    .emotionCard img { width: 100%; height: 100%; object-fit: contain; }
    .card-label { margin-top: 8px; font-weight: 700; color: #333; font-size: clamp(0.8rem, 2vw, 1rem); text-transform: capitalize; }
    .cardCorrect { animation: correctPulse 0.5s ease; border-color: #4CAF50; background: #C8E6C9; }
    .cardWrong { animation: wrongShake 0.5s ease; border-color: #F44336; background: #FFCDD2; }
    @keyframes correctPulse { 0%,100%{ transform: scale(1);} 50%{ transform: scale(1.1);} }
    @keyframes wrongShake { 0%,100%{ transform: translateX(0);} 20%{ transform: translateX(-8px);} 40%{ transform: translateX(8px);} 60%{ transform: translateX(-8px);} 80%{ transform: translateX(8px);} }
    .modal-container { background: rgba(255,255,255,0.95); backdrop-filter: blur(15px); border-radius: 30px; padding: 30px 40px; max-width: 90vw; width: 500px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); border: 3px solid white; text-align: center; }
    .modal-title { font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 900; margin-bottom: 1rem; color: #004D40; }
    .modal-title.congrats { color: #FFA000; }
    .modal-icon { font-size: clamp(3rem, 8vw, 5rem); margin-bottom: 1rem; }
    .modal-trophy { width: clamp(60px, 15vw, 80px); height: clamp(60px, 15vw, 80px); color: #FFC107; margin: 0 auto 1rem auto; animation: trophyBounce 2s infinite; }
    .total-score-highlight, .final-score { font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 900; color: #00796B; margin-bottom: 1.5rem; display: block; }
    .modal-button { color: white; font-size: clamp(1rem, 3vw, 1.2rem); font-weight: 700; padding: 12px 30px; border-radius: 50px; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.2); cursor: pointer; transition: all 0.3s ease; transform: scale(1); }
    .modal-button:hover { transform: scale(1.05); }
    .modal-button.next-level { background-image: linear-gradient(45deg, #66BB6A, #4CAF50); }
    .modal-button.play-again { background-image: linear-gradient(45deg, #26C6DA, #00ACC1); }
    @keyframes trophyBounce { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-15px);} }
    @media (max-width: 480px) {
      .intro-content-wrapper { padding: 0 15px; }
      .instruction-container { flex-direction: column; gap: 0.5rem; }
      .cards-grid { gap: 10px; }
      .emotionCard { min-width: 80px; }
      .modal-container { padding: 20px 25px; }
    }
    /* Acessibilidade / movimento reduzido */
    @media (prefers-reduced-motion: reduce) {
      .animate-float, .intro-start-button, .modal-trophy, .progressFill,
      .emotionCard:not([disabled]):hover, .stars-bg { animation: none !important; transition: none !important; transform: none !important; }
      .intro-main-title { animation: none !important; }
    }
    .speaking { outline: 3px solid rgba(33,150,243,0.35); box-shadow: 0 0 0 6px rgba(33,150,243,0.15) !important; }
    .speaking .instruction-box, .speaking .speech-bubble { box-shadow: 0 0 0 4px rgba(33,150,243,0.25), 0 4px 15px rgba(0,0,0,0.1) !important; }
    .intro-next-button[aria-disabled="true"] { opacity: .6; cursor: not-allowed; }
    .startButton:focus, .intro-next-button:focus, .modal-button:focus, .emotionCard:focus { outline: 3px solid #1976D2; outline-offset: 3px; }
  `;

  return (
    <div className={`game-container ${gameState === 'title' || gameState === 'intro' ? 'intro-mode' : ''}`}>
      <style>{cssStyles}</style>

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
            {(() => {
              switch (gameState) {
                case 'title': return <TitleView />;
                case 'intro': return <IntroUnifiedView />;
                case 'playing': return <GameView />;
                case 'phaseComplete': return <PhaseCompleteView />;
                case 'gameComplete': return <GameCompleteView />;
                default: return <TitleView />;
              }
            })()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
