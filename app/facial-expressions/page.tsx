// app/facial-expressions/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Volume2, VolumeX, Star, Trophy, Heart, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './emotionrecognition.module.css';

// Configuração de sons
const SOUNDS = {
  correct: '/sounds/coin.wav',
  wrong: '/sounds/footstep.wav',
  powerup: '/sounds/magic.wav',
  levelComplete: '/sounds/sucess.wav',
  emotionFreed: '/sounds/sucess.wav'
};

// Função para tocar som
const playSound = (soundName: keyof typeof SOUNDS, volume: number = 0.3) => {
  try {
    const audio = new Audio(SOUNDS[soundName]);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (error) {
    console.log('Som não encontrado:', soundName);
  }
};

// Configuração dos Cards CAA
const CARD_CATEGORIES = {
  emocoes: [
    { id: 'feliz', label: 'Feliz', emoji: '😊' },
    { id: 'triste', label: 'Triste', emoji: '😢' },
    { id: 'bravo', label: 'Bravo', emoji: '😡' },
    { id: 'medo', label: 'Medo', emoji: '😨' },
    { id: 'surpreso', label: 'Surpreso', emoji: '😮' },
    { id: 'cansado', label: 'Cansado', emoji: '😴' },
    { id: 'doente', label: 'Doente', emoji: '🤒' },
    { id: 'amor', label: 'Amor', emoji: '🥰' }
  ],
  acoes: [
    { id: 'comer', label: 'Comer', emoji: '🍽️' },
    { id: 'beber', label: 'Beber', emoji: '🥤' },
    { id: 'dormir', label: 'Dormir', emoji: '😴' },
    { id: 'brincar', label: 'Brincar', emoji: '🎮' },
    { id: 'correr', label: 'Correr', emoji: '🏃' },
    { id: 'pular', label: 'Pular', emoji: '🦘' },
    { id: 'sentar', label: 'Sentar', emoji: '🪑' },
    { id: 'andar', label: 'Andar', emoji: '🚶' }
  ],
  expressoes: [
    { id: 'chorando', label: 'Chorando', emoji: '😭' },
    { id: 'rindo', label: 'Rindo', emoji: '😂' },
    { id: 'pensando', label: 'Pensando', emoji: '🤔' },
    { id: 'confuso', label: 'Confuso', emoji: '😕' }
  ],
  atividades: [
    { id: 'bicicleta', label: 'Bicicleta', emoji: '🚴' },
    { id: 'carro', label: 'Carro', emoji: '🚗' },
    { id: 'nadando', label: 'Nadando', emoji: '🏊' },
    { id: 'jogando', label: 'Jogando', emoji: '⚽' }
  ]
};

// Marcos de libertação
const LIBERATION_MILESTONES = [
  { points: 1000, emotion: 'ALEGRIA', emoji: '😊', message: 'ALEGRIA FOI LIBERTADA!' },
  { points: 2500, emotion: 'CORAGEM', emoji: '💪', message: 'CORAGEM FOI LIBERTADA!' },
  { points: 5000, emotion: 'AMOR', emoji: '❤️', message: 'AMOR FOI LIBERTADO!' },
  { points: 7500, emotion: 'ESPERANÇA', emoji: '🌟', message: 'ESPERANÇA FOI LIBERTADA!' },
  { points: 10000, emotion: 'TODAS', emoji: '🌈', message: 'VOCÊ LIBERTOU TODAS AS EMOÇÕES DO MUNDO!' }
];

// Configuração dos níveis
const generateLevels = () => {
  const levels = [];
  
  // Mundo 1 - Emoções Básicas (1-10)
  for (let i = 1; i <= 10; i++) {
    const numCards = Math.min(2 + Math.floor(i / 3), 4);
    levels.push({
      id: i,
      world: 1,
      name: `Emoções ${i}`,
      category: 'emocoes',
      numCards: numCards,
      questionsPerLevel: 3 + Math.floor(i / 2),
      pointsPerCorrect: 100,
      requiredPoints: 100 * (3 + Math.floor(i / 2))
    });
  }
  
  // Mundo 2 - Ações (11-20)
  for (let i = 11; i <= 20; i++) {
    const numCards = Math.min(3 + Math.floor((i - 10) / 3), 5);
    levels.push({
      id: i,
      world: 2,
      name: `Ações ${i - 10}`,
      category: 'acoes',
      numCards: numCards,
      questionsPerLevel: 4 + Math.floor((i - 10) / 2),
      pointsPerCorrect: 150,
      requiredPoints: 150 * (4 + Math.floor((i - 10) / 2))
    });
  }
  
  // Mundo 3 - Expressões (21-30)
  for (let i = 21; i <= 30; i++) {
    const numCards = Math.min(4 + Math.floor((i - 20) / 3), 6);
    levels.push({
      id: i,
      world: 3,
      name: `Expressões ${i - 20}`,
      category: 'expressoes',
      numCards: numCards,
      questionsPerLevel: 5 + Math.floor((i - 20) / 2),
      pointsPerCorrect: 200,
      requiredPoints: 200 * (5 + Math.floor((i - 20) / 2))
    });
  }
  
  // Mundo 4 - Atividades (31-40)
  for (let i = 31; i <= 40; i++) {
    const numCards = Math.min(4 + Math.floor((i - 30) / 2), 7);
    levels.push({
      id: i,
      world: 4,
      name: `Atividades ${i - 30}`,
      category: 'atividades',
      numCards: numCards,
      questionsPerLevel: 6 + Math.floor((i - 30) / 2),
      pointsPerCorrect: 250,
      requiredPoints: 250 * (6 + Math.floor((i - 30) / 2))
    });
  }
  
  // Mundo 5 - Mix Total (41-50)
  for (let i = 41; i <= 50; i++) {
    levels.push({
      id: i,
      world: 5,
      name: `Desafio ${i - 40}`,
      category: 'mix',
      numCards: Math.min(6 + Math.floor((i - 40) / 2), 8),
      questionsPerLevel: 8 + Math.floor((i - 40) / 2),
      pointsPerCorrect: 300,
      requiredPoints: 300 * (8 + Math.floor((i - 40) / 2))
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
  const [liberatedEmotions, setLiberatedEmotions] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const level = LEVELS[currentLevel];

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    // Criar estrelas se combo alto
    if (combo >= 5) {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const star = document.createElement('div');
          star.className = styles.starParticle;
          star.style.left = `${x + (Math.random() - 0.5) * 100}px`;
          star.style.top = `${y}px`;
          document.body.appendChild(star);
          
          setTimeout(() => {
            document.body.removeChild(star);
          }, 3000);
        }, i * 50);
      }
    }
  }, [combo]);

  // Criar chuva de emoções
  const createEmotionRain = useCallback(() => {
    const emotions = ['😊', '😢', '😡', '😨', '😮', '🥰', '😎', '🤗', '💪', '❤️', '🌟', '🌈'];
    
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const emotion = document.createElement('div');
        emotion.className = styles.emotionRain;
        emotion.textContent = emotions[Math.floor(Math.random() * emotions.length)];
        emotion.style.left = `${Math.random() * 100}%`;
        emotion.style.fontSize = `${30 + Math.random() * 20}px`;
        document.body.appendChild(emotion);
        
        setTimeout(() => {
          document.body.removeChild(emotion);
        }, 4000);
      }, i * 100);
    }
  }, []);

  // Mostrar mensagem de libertação
  const showLiberationMessage = useCallback((message: string, emoji: string) => {
    const msg = document.createElement('div');
    msg.className = styles.liberationMessage;
    msg.innerHTML = `${emoji}<br/>${message}`;
    document.body.appendChild(msg);
    
    if (soundEnabled) playSound('emotionFreed', 0.5);
    
    // Confete especial
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FF69B4', '#00CED1', '#98FB98']
    });
    
    setTimeout(() => {
      document.body.removeChild(msg);
    }, 3000);
  }, [soundEnabled]);

  // Verificar marcos de libertação
  useEffect(() => {
    LIBERATION_MILESTONES.forEach(milestone => {
      if (totalScore >= milestone.points && !liberatedEmotions.includes(milestone.emotion)) {
        setLiberatedEmotions(prev => [...prev, milestone.emotion]);
        showLiberationMessage(milestone.message, milestone.emoji);
        
        if (milestone.emotion === 'TODAS') {
          createEmotionRain();
          setTimeout(() => {
            setGameState('gameComplete');
          }, 5000);
        }
      }
    });
  }, [totalScore, liberatedEmotions, showLiberationMessage, createEmotionRain]);

  // Preparar cards para o nível
  const prepareLevel = useCallback(() => {
    const cards: any[] = [];
    let availableCards: any[] = [];
    
    if (level.category === 'mix') {
      // Mix de todas as categorias
      Object.values(CARD_CATEGORIES).forEach(category => {
        availableCards = [...availableCards, ...category];
      });
    } else {
      availableCards = [...CARD_CATEGORIES[level.category as keyof typeof CARD_CATEGORIES]];
    }
    
    // Embaralhar e selecionar cards
    const shuffled = availableCards.sort(() => Math.random() - 0.5);
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
    setLiberatedEmotions([]);
    setGameState('playing');
    prepareLevel();
  };

  // Selecionar card
  const selectCard = useCallback((cardId: string, event: React.MouseEvent) => {
    if (feedback) return; // Já tem feedback, aguarde
    
    setSelectedCard(cardId);
    setAttempts(prev => prev + 1);
    
    if (cardId === targetCard.id) {
      // Acertou!
      setFeedback('correct');
      
      // Calcular pontos com base nas tentativas e combo
      let points = level.pointsPerCorrect;
      if (attempts === 0) points *= 2; // Primeira tentativa vale mais
      if (combo >= 3) points *= 1.5;
      if (combo >= 5) points *= 2;
      
      setScore(prev => prev + points);
      setTotalScore(prev => prev + points);
      setCombo(prev => prev + 1);
      
      if (soundEnabled) playSound('correct');
      
      // Criar explosão de pontos
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      createPointsExplosion(points, rect.left + rect.width / 2, rect.top);
      
      // Próxima pergunta após 1.5s
      setTimeout(() => {
        if (currentQuestion < level.questionsPerLevel - 1) {
          setCurrentQuestion(prev => prev + 1);
          nextQuestion();
        } else {
          // Nível completo
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
      
      // Destacar o correto após 1s
      setTimeout(() => {
        setFeedback(null);
        setSelectedCard(null);
        // Mesma pergunta, nova tentativa
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
      // Jogo completo
      createEmotionRain();
      setGameState('gameComplete');
    }
  };

  // Reiniciar jogo
  const restartGame = () => {
    window.location.reload();
  };

  return (
    <div className={styles.gameContainer}>
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/dashboard" className="flex items-center text-teal-600 hover:text-teal-700">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              😊 Liberte as Emoções
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
            <h2 className="text-3xl font-bold mb-4 text-purple-600">
              Liberte as Emoções! 
            </h2>
            <div className="text-6xl mb-4">🎭</div>
            <p className="text-gray-700 mb-6">
              As emoções do mundo foram aprisionadas! 
              Identifique corretamente para libertá-las!
            </p>
            <div className="bg-yellow-100 rounded-lg p-4 mb-6">
              <p className="text-sm font-bold text-gray-800">Marcos de Libertação:</p>
              <div className="text-xs text-gray-600 mt-2 space-y-1">
                <div>1.000 pontos - Liberta ALEGRIA 😊</div>
                <div>2.500 pontos - Liberta CORAGEM 💪</div>
                <div>5.000 pontos - Liberta AMOR ❤️</div>
                <div>10.000 pontos - TODAS AS EMOÇÕES! 🌈</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl text-lg font-bold hover:scale-105 transition"
            >
              Começar Aventura
            </button>
          </motion.div>
        </div>
      )}

      {gameState === 'playing' && level && (
        <>
          {/* Barra de Progresso */}
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(totalScore / 10000) * 100}%` }}
            >
              {totalScore} / 10000
            </div>
          </div>

          {/* Contador de Combo */}
          {combo > 0 && (
            <div className={styles.comboCounter}>
              <div className="text-sm text-gray-600">COMBO</div>
              <div className={styles.comboNumber}>x{combo}</div>
            </div>
          )}

          {/* Área de Jogo */}
          <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
            {/* Pergunta */}
            <motion.div 
              key={targetCard?.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 rounded-xl p-4 mb-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Encontre: {targetCard?.label}
              </h2>
              <div className="text-4xl text-center mt-2">{targetCard?.emoji}</div>
            </motion.div>

            {/* Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl">
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
                  <div className="text-5xl mb-2">{card.emoji}</div>
                  <div className={styles.emotionLabel}>{card.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Info do Nível */}
            <div className="mt-8 flex gap-4 text-sm text-white">
              <div className="bg-white/20 px-3 py-1 rounded">
                Nível {level.id}
              </div>
              <div className="bg-white/20 px-3 py-1 rounded">
                Pergunta {currentQuestion + 1}/{level.questionsPerLevel}
              </div>
              <div className="bg-white/20 px-3 py-1 rounded">
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
              <p className="text-lg">Pontos do Nível: {score}</p>
              <p className="text-xl font-bold text-purple-600">
                Total: {totalScore} pontos
              </p>
            </div>
            
            {/* Emoções Libertadas */}
            {liberatedEmotions.length > 0 && (
              <div className="bg-purple-100 rounded-lg p-3 mb-4">
                <p className="text-sm font-bold text-purple-800">Emoções Libertadas:</p>
                <div className="flex justify-center gap-2 mt-2">
                  {liberatedEmotions.map(emotion => (
                    <span key={emotion} className="text-2xl">
                      {LIBERATION_MILESTONES.find(m => m.emotion === emotion)?.emoji}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={nextLevel}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
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
            <h2 className="text-3xl font-bold mb-4 text-purple-600">
              PARABÉNS!
            </h2>
            <div className="text-6xl mb-4">🌈</div>
            <p className="text-xl mb-4 text-gray-800">
              Você libertou TODAS as emoções do mundo!
            </p>
            <p className="text-2xl font-bold text-purple-600 mb-6">
              Pontuação Final: {totalScore}
            </p>
            <div className="flex justify-center gap-3 mb-6">
              {['😊', '💪', '❤️', '🌟', '😎', '🤗', '🥰'].map((emoji, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-3xl"
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
            >
              Jogar Novamente
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
