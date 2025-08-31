// app/facial-expressions/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Volume2, VolumeX, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './emotionrecognition.module.css';

// Sons
const SOUNDS = {
  correct: '/sounds/coin.wav',
  wrong: '/sounds/footstep.wav',
  levelComplete: '/sounds/sucess.wav'
};

const playSound = (soundName: keyof typeof SOUNDS, volume: number = 0.3) => {
  try {
    const audio = new Audio(SOUNDS[soundName]);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (error) {
    console.log('Som não encontrado:', soundName);
  }
};

// CARDS DE EMOÇÕES - NOMES CORRETOS
const EMOTION_CARDS = [
  // Homem
  { id: 'homem_feliz', label: 'Feliz', path: '/cards/emocoes/homem_feliz.webp' },
  { id: 'homem_triste', label: 'Triste', path: '/cards/emocoes/homem_triste.webp' },
  { id: 'homem_medo', label: 'Medo', path: '/cards/emocoes/homem_medo.webp' },
  { id: 'homem_surpreso', label: 'Surpreso', path: '/cards/emocoes/homem_surpreso.webp' },
  { id: 'homem_furioso', label: 'Furioso', path: '/cards/emocoes/homem_furioso.webp' },
  { id: 'homem_animado', label: 'Animado', path: '/cards/emocoes/homem_animado.webp' },
  { id: 'homem_calmo', label: 'Calmo', path: '/cards/emocoes/homem_calmo.webp' },
  { id: 'homem_confuso', label: 'Confuso', path: '/cards/emocoes/homem_confuso.webp' },
  { id: 'homem_preocupado', label: 'Preocupado', path: '/cards/emocoes/homem_preocupado.webp' },
  { id: 'homem_focado', label: 'Focado', path: '/cards/emocoes/homem_focado.webp' },
  { id: 'homem_gargalhando', label: 'Gargalhando', path: '/cards/emocoes/homem_gargalhando.webp' },
  { id: 'homem_ciumento', label: 'Ciumento', path: '/cards/emocoes/homem_ciumento.webp' },
  { id: 'homem_desgostoso', label: 'Desgostoso', path: '/cards/emocoes/homem_desgostoso.webp' },
  // Mulher
  { id: 'mulher_feliz', label: 'Feliz', path: '/cards/emocoes/mulher_feliz.webp' },
  { id: 'mulher_triste', label: 'Triste', path: '/cards/emocoes/mulher_triste.webp' },
  { id: 'mulher_medo', label: 'Medo', path: '/cards/emocoes/mulher_medo.webp' },
  { id: 'mulher_surpresa', label: 'Surpresa', path: '/cards/emocoes/mulher_surpresa.webp' },
  { id: 'mulher_furiosa', label: 'Furiosa', path: '/cards/emocoes/mulher_furiosa.webp' },
  { id: 'mulher_animada', label: 'Animada', path: '/cards/emocoes/mulher_animada.webp' },
  { id: 'mulher_calma', label: 'Calma', path: '/cards/emocoes/mulher_calma.webp' },
  { id: 'mulher_confusa', label: 'Confusa', path: '/cards/emocoes/mulher_confusa.webp' },
  { id: 'mulher_preocupada', label: 'Preocupada', path: '/cards/emocoes/mulher_preocupada.webp' },
  { id: 'mulher_focada', label: 'Focada', path: '/cards/emocoes/mulher_focada.webp' },
  { id: 'mulher_gargalhando', label: 'Gargalhando', path: '/cards/emocoes/mulher_gargalhando.webp' },
  { id: 'mulher_ciumenta', label: 'Ciumenta', path: '/cards/emocoes/mulher_ciumenta.webp' },
  { id: 'mulher_risada_engracada', label: 'Engraçada', path: '/cards/emocoes/mulher_risada_engracada.webp' },
  // Assustado
  { id: 'assustado', label: 'Assustado', path: '/cards/emocoes/assustado.webp' }
];

// Níveis simplificados
const generateLevels = () => {
  const levels = [];
  
  // 30 níveis progressivos
  for (let i = 1; i <= 30; i++) {
    const numCards = Math.min(2 + Math.floor((i - 1) / 5), 6);
    levels.push({
      id: i,
      name: `Nível ${i}`,
      numCards: numCards,
      questionsPerLevel: 3 + Math.floor((i - 1) / 5),
      pointsPerCorrect: 100 + (i * 10)
    });
  }
  
  return levels;
};

const LEVELS = generateLevels();

export default function FacialExpressions() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelComplete' | 'gameComplete'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentCards, setCurrentCards] = useState<any[]>([]);
  const [targetCard, setTargetCard] = useState<any>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [attempts, setAttempts] = useState(0);

  const level = LEVELS[currentLevel];

  // Criar explosão de pontos
  const createPointsExplosion = useCallback((points: number, x: number, y: number) => {
    const explosion = document.createElement('div');
    explosion.className = styles.pointsExplosion;
    explosion.textContent = `+${points}`;
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    document.body.appendChild(explosion);
    
    setTimeout(() => {
      document.body.removeChild(explosion);
    }, 1500);
  }, []);

  // Preparar cards para o nível
  const prepareLevel = useCallback(() => {
    const cards: any[] = [];
    const shuffled = [...EMOTION_CARDS].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(level.numCards, shuffled.length); i++) {
      cards.push(shuffled[i]);
    }
    
    setCurrentCards(cards);
    nextQuestion(cards);
  }, [level]);

  // Próxima pergunta
  const nextQuestion = useCallback((cards?: any[]) => {
    const cardsToUse = cards || currentCards;
    if (cardsToUse.length === 0) return;
    
    const randomCard = cardsToUse[Math.floor(Math.random() * cardsToUse.length)];
    setTargetCard(randomCard);
    setSelectedCard(null);
    setFeedback(null);
    setAttempts(0);
  }, [currentCards]);

  // Iniciar jogo
  const startGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setTotalScore(0);
    setCombo(0);
    setCurrentQuestion(0);
    setGameState('playing');
    setTimeout(prepareLevel, 100);
  };

  // Selecionar card
  const selectCard = useCallback((cardId: string, event: React.MouseEvent) => {
    if (feedback) return;
    
    setSelectedCard(cardId);
    setAttempts(prev => prev + 1);
    
    if (cardId === targetCard.id) {
      // Acertou!
      setFeedback('correct');
      
      let points = level.pointsPerCorrect;
      if (attempts === 0) points *= 2;
      if (combo >= 3) points = Math.floor(points * 1.5);
      
      setScore(prev => prev + points);
      setTotalScore(prev => prev + points);
      setCombo(prev => prev + 1);
      
      if (soundEnabled) playSound('correct');
      
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      createPointsExplosion(points, rect.left + rect.width / 2, rect.top);
      
      setTimeout(() => {
        if (currentQuestion < level.questionsPerLevel - 1) {
          setCurrentQuestion(prev => prev + 1);
          nextQuestion();
        } else {
          if (soundEnabled) playSound('levelComplete');
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          setGameState('levelComplete');
        }
      }, 1500);
    } else {
      // Errou
      setFeedback('wrong');
      setCombo(0);
      if (soundEnabled) playSound('wrong', 0.2);
      
      setTimeout(() => {
        setFeedback(null);
        setSelectedCard(null);
      }, 1500);
    }
  }, [feedback, targetCard, attempts, level, combo, soundEnabled, currentQuestion, createPointsExplosion, nextQuestion]);

  // Próximo nível
  const nextLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setCurrentQuestion(0);
      setScore(0);
      setGameState('playing');
      setTimeout(prepareLevel, 100);
    } else {
      setGameState('gameComplete');
    }
  };

  return (
    <div className={styles.gameContainer}>
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/dashboard" className="flex items-center text-teal-600 hover:text-teal-700">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-base sm:text-xl font-bold text-gray-800">
              😊 Expressões Faciais
            </h1>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/50"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {gameState === 'intro' && (
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 rounded-2xl p-8 max-w-md mx-4 text-center"
          >
            <h2 className="text-3xl font-bold mb-4 text-teal-600">
              Expressões Faciais
            </h2>
            <p className="text-gray-700 mb-6">
              Identifique as emoções corretamente!
            </p>
            <button
              onClick={startGame}
              className="bg-teal-500 text-white px-8 py-3 rounded-xl text-lg font-bold hover:bg-teal-600 transition"
            >
              Começar
            </button>
          </motion.div>
        </div>
      )}

      {gameState === 'playing' && level && (
        <>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(currentQuestion / level.questionsPerLevel) * 100}%` }}
            >
              {currentQuestion}/{level.questionsPerLevel}
            </div>
          </div>

          {combo > 0 && (
            <div className={styles.comboCounter}>
              <div className="text-sm text-gray-600">COMBO</div>
              <div className={styles.comboNumber}>x{combo}</div>
            </div>
          )}

          <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
            <motion.div 
              key={targetCard?.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 rounded-xl p-4 mb-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Encontre: {targetCard?.label}
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl">
              {currentCards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => selectCard(card.id, e)}
                  className={`
                    ${styles.emotionCard}
                    ${selectedCard === card.id && feedback === 'correct' ? styles.cardCorrect : ''}
                    ${selectedCard === card.id && feedback === 'wrong' ? styles.cardWrong : ''}
                    ${feedback === 'wrong' && card.id === targetCard.id ? styles.cardCorrect : ''}
                  `}
                >
                  <Image 
                    src={card.path}
                    alt={card.label}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex gap-4 text-sm text-gray-600">
              <div className="bg-white/80 px-3 py-1 rounded">
                Nível {level.id}/30
              </div>
              <div className="bg-white/80 px-3 py-1 rounded">
                Pontos: {score}
              </div>
            </div>
          </div>
        </>
      )}

      {gameState === 'levelComplete' && (
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 rounded-2xl p-8 max-w-md mx-4 text-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Nível {level?.id} Completo!
            </h2>
            <div className="text-6xl mb-4">🌟</div>
            <div className="space-y-2 mb-6">
              <p className="text-lg">Pontos: {score}</p>
              <p className="text-xl font-bold text-teal-600">
                Total: {totalScore}
              </p>
            </div>
            <button
              onClick={nextLevel}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition"
            >
              Próximo Nível
            </button>
          </motion.div>
        </div>
      )}

      {gameState === 'gameComplete' && (
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 rounded-2xl p-8 max-w-md mx-4 text-center"
          >
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-teal-600">
              PARABÉNS!
            </h2>
            <p className="text-xl mb-4 text-gray-800">
              Você completou todos os níveis!
            </p>
            <p className="text-2xl font-bold text-teal-600 mb-6">
              Pontuação Final: {totalScore}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-600 transition"
            >
              Jogar Novamente
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
