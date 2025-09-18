'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Trophy, ArrowLeft } from 'lucide-react';
import { GameAudioManager } from '../utils/gameAudioManager'; // Ajuste o caminho se necessário

// --- EFEITO DE CONFETE (sem alterações) ---
// ...

// --- COMPONENTES DE UI (sem alterações) ---
// ...

// --- CONFIGURAÇÕES E DADOS DO JOGO (sem alterações) ---
// ...

// --- COMPONENTE PRINCIPAL DO JOGO ---
export default function FacialExpressionsGame() {
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

  const leoSpeak = useCallback((message, callback) => {
    setLeoMessage(message);
    if (soundEnabled) {
      audioManager.falarLeo(message, callback);
    } else {
        callback?.();
    }
  }, [soundEnabled, audioManager]);

  const handleStartIntro = async () => {
    await audioManager.forceInitialize();
    setGameState('intro');
    leoSpeak("Bem-vindo ao mundo das Expressões Faciais!", () => {
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
  
  // ALTERADO: Removido o playSoundEffect, a narração é o único feedback necessário.
  useEffect(() => {
    if (gameState === 'phaseComplete') {
        const phaseInfo = GAME_PHASES[currentPhaseIndex];
        const message = `Fase ${phaseInfo.phase} completa! Você ganhou ${phaseInfo.points} pontos!`;
        leoSpeak(message);
        // REMOVIDO: audioManager.playSoundEffect('levelComplete');
    } else if (gameState === 'gameComplete') {
        const message = `Incrível! Você completou todas as fases e fez ${totalScore} pontos! Parabéns!`;
        leoSpeak(message);
    }
  }, [gameState, currentPhaseIndex, totalScore, leoSpeak]);


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
    
    const startMessage = phaseIndex > 0 
      ? `Muito bem! Agora com ${phaseConfig.numCards} emoções. Encontre ${sequence[0].label}`
      : `Vamos começar! Encontre ${sequence[0].label}`;
    
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

  // ALTERADO: Lógica de feedback de acerto e erro agora usa a voz do Leo.
  const selectCard = useCallback((card) => {
    if (isDisabled) return;

    setIsDisabled(true);
    setSelectedCardId(card.id);

    const currentTarget = targetSequence[currentTargetIndex];
    const isCorrect = card.id === currentTarget.id;

    if (isCorrect) {
      setFeedback('correct');
      setTotalScore(prev => prev + GAME_PHASES[currentPhaseIndex].points);
      
      // ALTERADO: Leo dá o feedback de acerto.
      leoSpeak("Isso mesmo!");

      setTimeout(() => {
        const nextTargetIndex = currentTargetIndex + 1;
        if (nextTargetIndex < targetSequence.length) {
          setCurrentTargetIndex(nextTargetIndex);
          setFeedback(null);
          setSelectedCardId(null);
          setIsDisabled(false);
          leoSpeak(targetSequence[nextTargetIndex].label);
        } else {
          setGameState('phaseComplete');
        }
      }, 1200);
    } else {
      setFeedback('wrong');
      
      // ALTERADO: Leo dá o feedback de erro.
      leoSpeak("Opa, tente de novo.");

      setTimeout(() => {
        setFeedback(null);
        setSelectedCardId(null);
        setIsDisabled(false);
        // A instrução visual (leoMessage) permanece na tela, então não precisamos repeti-la aqui.
      }, 1000);
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

  const toggleSound = () => {
    const isNowEnabled = audioManager.toggleAudio();
    setSoundEnabled(isNowEnabled);
  }

  // --- RENDERIZAÇÃO (sem alterações) ---
  // ... (todo o código de renderTitleScreen, renderIntroScreen, etc., permanece o mesmo) ...

  return (
    <div className={`game-container ${gameState === 'titleScreen' || gameState === 'intro' ? 'intro-mode' : ''}`}>
      <style>{/* ...css... */}</style>
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
          {/* ... renderContent() ... */}
        </AnimatePresence>
      </main>
    </div>
  );
}
