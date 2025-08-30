// app/facial-expressions/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

// Configuração dos Cards CAA - USANDO IMAGENS REAIS
const CARD_CATEGORIES = {
  emocoes: [
    { id: 'feliz', label: 'Feliz', path: '/cards/emocoes/feliz.webp' },
    { id: 'triste', label: 'Triste', path: '/cards/emocoes/triste.webp' },
    { id: 'bravo', label: 'Bravo', path: '/cards/emocoes/bravo.webp' },
    { id: 'medo', label: 'Medo', path: '/cards/emocoes/medo.webp' },
    { id: 'surpreso', label: 'Surpreso', path: '/cards/emocoes/surpreso.webp' },
    { id: 'cansado', label: 'Cansado', path: '/cards/emocoes/cansado.webp' },
    { id: 'doente', label: 'Doente', path: '/cards/emocoes/doente.webp' },
    { id: 'amor', label: 'Amor', path: '/cards/emocoes/amor.webp' },
    { id: 'animado', label: 'Animado', path: '/cards/emocoes/animado.webp' },
    { id: 'preocupado', label: 'Preocupado', path: '/cards/emocoes/preocupado.webp' }
  ],
  acoes: [
    { id: 'comer', label: 'Comer', path: '/cards/acoes/comer.webp' },
    { id: 'beber', label: 'Beber', path: '/cards/acoes/beber.webp' },
    { id: 'dormir', label: 'Dormir', path: '/cards/acoes/dormir.webp' },
    { id: 'brincar', label: 'Brincar', path: '/cards/acoes/brincar.webp' },
    { id: 'correr', label: 'Correr', path: '/cards/acoes/correr.webp' },
    { id: 'pular', label: 'Pular', path: '/cards/acoes/pular.webp' },
    { id: 'sentar', label: 'Sentar', path: '/cards/acoes/sentar.webp' },
    { id: 'andar', label: 'Andar', path: '/cards/acoes/andar.webp' },
    { id: 'abracar', label: 'Abraçar', path: '/cards/acoes/abracar.webp' },
    { id: 'chorar', label: 'Chorar', path: '/cards/acoes/chorar.webp' },
    { id: 'rir', label: 'Rir', path: '/cards/acoes/rir.webp' },
    { id: 'escovar', label: 'Escovar', path: '/cards/acoes/escovar.webp' }
  ],
  necessidades: [
    { id: 'fome', label: 'Fome', path: '/cards/necessidades/fome.webp' },
    { id: 'sede', label: 'Sede', path: '/cards/necessidades/sede.webp' },
    { id: 'banheiro', label: 'Banheiro', path: '/cards/necessidades/banheiro.webp' },
    { id: 'ajuda', label: 'Ajuda', path: '/cards/necessidades/ajuda.webp' },
    { id: 'parar', label: 'Parar', path: '/cards/necessidades/parar.webp' },
    { id: 'mais', label: 'Mais', path: '/cards/necessidades/mais.webp' },
    { id: 'acabou', label: 'Acabou', path: '/cards/necessidades/acabou.webp' },
    { id: 'quero', label: 'Quero', path: '/cards/necessidades/quero.webp' }
  ],
  pessoas: [
    { id: 'mae', label: 'Mãe', path: '/cards/pessoas/mae.webp' },
    { id: 'pai', label: 'Pai', path: '/cards/pessoas/pai.webp' },
    { id: 'irmao', label: 'Irmão', path: '/cards/pessoas/irmao.webp' },
    { id: 'irma', label: 'Irmã', path: '/cards/pessoas/irma.webp' },
    { id: 'amigo', label: 'Amigo', path: '/cards/pessoas/amigo.webp' },
    { id: 'professora', label: 'Professora', path: '/cards/pessoas/professora.webp' },
    { id: 'medico', label: 'Médico', path: '/cards/pessoas/medico.webp' },
    { id: 'eu', label: 'Eu', path: '/cards/pessoas/eu.webp' }
  ],
  escola: [
    { id: 'escola', label: 'Escola', path: '/cards/escola/escola.webp' },
    { id: 'sala', label: 'Sala', path: '/cards/escola/sala.webp' },
    { id: 'livro', label: 'Livro', path: '/cards/escola/livro.webp' },
    { id: 'lapis', label: 'Lápis', path: '/cards/escola/lapis.webp' },
    { id: 'recreio', label: 'Recreio', path: '/cards/escola/recreio.webp' },
    { id: 'lanche', label: 'Lanche', path: '/cards/escola/lanche.webp' },
    { id: 'mochila', label: 'Mochila', path: '/cards/escola/mochila.webp' },
    { id: 'tarefa', label: 'Tarefa', path: '/cards/escola/tarefa.webp' }
  ],
  rotina: [
    { id: 'acordar', label: 'Acordar', path: '/cards/rotina/acordar.webp' },
    { id: 'banho', label: 'Banho', path: '/cards/rotina/banho.webp' },
    { id: 'cafe', label: 'Café', path: '/cards/rotina/cafe.webp' },
    { id: 'almoco', label: 'Almoço', path: '/cards/rotina/almoco.webp' },
    { id: 'jantar', label: 'Jantar', path: '/cards/rotina/jantar.webp' },
    { id: 'dormir_rotina', label: 'Dormir', path: '/cards/rotina/dormir.webp' },
    { id: 'segundafeira', label: 'Segunda', path: '/cards/rotina/segundafeira.webp' },
    { id: 'tercafeira', label: 'Terça', path: '/cards/rotina/tercafeira.webp' }
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

// Configuração dos níveis - EXPANDIDO E PROGRESSIVO
const generateLevels = () => {
  const levels = [];
  
  // MUNDO 1 - Emoções Básicas (1-15)
  for (let i = 1; i <= 15; i++) {
    const numCards = Math.min(2 + Math.floor((i - 1) / 3), 5);
    levels.push({
      id: i,
      world: 1,
      name: `Emoções ${i}`,
      categories: ['emocoes'],
      numCards: numCards,
      questionsPerLevel: 3 + Math.floor((i - 1) / 3),
      pointsPerCorrect: 100,
      description: 'Identifique as emoções'
    });
  }
  
  // MUNDO 2 - Ações (16-30)
  for (let i = 16; i <= 30; i++) {
    const numCards = Math.min(3 + Math.floor((i - 16) / 3), 6);
    levels.push({
      id: i,
      world: 2,
      name: `Ações ${i - 15}`,
      categories: ['acoes'],
      numCards: numCards,
      questionsPerLevel: 4 + Math.floor((i - 16) / 3),
      pointsPerCorrect: 120,
      description: 'Identifique as ações'
    });
  }
  
  // MUNDO 3 - Emoções + Ações (31-45)
  for (let i = 31; i <= 45; i++) {
    const numCards = Math.min(4 + Math.floor((i - 31) / 3), 7);
    levels.push({
      id: i,
      world: 3,
      name: `Mix ${i - 30}`,
      categories: ['emocoes', 'acoes'],
      numCards: numCards,
      questionsPerLevel: 5 + Math.floor((i - 31) / 4),
      pointsPerCorrect: 150,
      description: 'Emoções e Ações misturadas'
    });
  }
  
  // MUNDO 4 - Necessidades + Pessoas (46-60)
  for (let i = 46; i <= 60; i++) {
    const numCards = Math.min(4 + Math.floor((i - 46) / 3), 8);
    levels.push({
      id: i,
      world: 4,
      name: `Social ${i - 45}`,
      categories: ['necessidades', 'pessoas'],
      numCards: numCards,
      questionsPerLevel: 6 + Math.floor((i - 46) / 4),
      pointsPerCorrect: 180,
      description: 'Necessidades e Pessoas'
    });
  }
  
  // MUNDO 5 - Escola + Rotina (61-75)
  for (let i = 61; i <= 75; i++) {
    const numCards = Math.min(5 + Math.floor((i - 61) / 3), 8);
    levels.push({
      id: i,
      world: 5,
      name: `Dia a Dia ${i - 60}`,
      categories: ['escola', 'rotina'],
      numCards: numCards,
      questionsPerLevel: 7 + Math.floor((i - 61) / 4),
      pointsPerCorrect: 200,
      description: 'Escola e Rotina'
    });
  }
  
  // MUNDO 6 - Mix Total (76-100)
  for (let i = 76; i <= 100; i++) {
    const numCards = Math.min(6 + Math.floor((i - 76) / 4), 10);
    levels.push({
      id: i,
      world: 6,
      name: `Desafio Final ${i - 75}`,
      categories: ['emocoes', 'acoes', 'necessidades', 'pessoas', 'escola', 'rotina'],
      numCards: numCards,
      questionsPerLevel: 8 + Math.floor((i - 76) / 5),
      pointsPerCorrect: 250,
      description: 'Todas as categorias!'
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
  const [imagesLoaded, setImagesLoaded] = useState(false);

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

  // Pré-carregar imagens
  useEffect(() => {
    if (level && currentCards.length > 0) {
      const imagePromises = currentCards.map(card => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.src = card.path;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      Promise.all(imagePromises).then(() => {
        setImagesLoaded(true);
      }).catch(err => {
        console.log('Erro ao carregar imagens:', err);
        setImagesLoaded(true); // Continua mesmo com erro
      });
    }
  }, [currentCards, level]);

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
    
    // Pegar cards das categorias do nível
    level.categories.forEach(category => {
      if (CARD_CATEGORIES[category as keyof typeof CARD_CATEGORIES]) {
        availableCards = [...availableCards, ...CARD_CATEGORIES[category as keyof typeof CARD_CATEGORIES]];
      }
    });
    
    // Embaralhar e selecionar cards
    const shuffled = availableCards.sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(level.numCards, shuffled.length); i++) {
      cards.push(shuffled[i]);
    }
    
    setCurrentCards(cards);
    setImagesLoaded(false);
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
    setTimeout(prepareLevel, 100);
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
      if (combo >= 3) points = Math.floor(points * 1.5);
      if (combo >= 5) points = Math.floor(points * 2);
      
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
            <h2 className="text-3xl font-bold mb-4 text-purple-600">
              Liberte as Emoções! 
            </h2>
            <div className="text-6xl mb-4">🎭</div>
            <p className="text-gray-700 mb-6">
              As emoções do mundo foram aprisionadas! 
              Identifique corretamente para libertá-las!
            </p>
            <div className="bg-yellow-100 rounded-lg p-4 mb-6">
              <p className="text-sm font-bold text-gray-800">100 Níveis de Aventura!</p>
              <div className="text-xs text-gray-600 mt-2 space-y-1">
                <div>Mundo 1: Emoções (15 níveis)</div>
                <div>Mundo 2: Ações (15 níveis)</div>
                <div>Mundo 3: Emoções + Ações (15 níveis)</div>
                <div>Mundo 4: Necessidades + Pessoas (15 níveis)</div>
                <div>Mundo 5: Escola + Rotina (15 níveis)</div>
                <div>Mundo 6: Desafio Final (25 níveis)</div>
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
            </motion.div>

            {/* Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl">
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
                    width={80}
                    height={80}
                    className="object-contain"
                    onError={(e: any) => {
                      e.target.src = '/cards/placeholder.webp'; // Fallback
                    }}
                  />
                  <div className={styles.emotionLabel}>{card.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Info do Nível */}
            <div className="mt-8 flex flex-wrap gap-2 justify-center text-sm text-white">
              <div className="bg-white/20 px-3 py-1 rounded">
                Mundo {level.world}
              </div>
              <div className="bg-white/20 px-3 py-1 rounded">
                Nível {level.id}/100
              </div>
              <div className="bg-white/20 px-3 py-1 rounded">
                {level.description}
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
              <p className="text-sm text-gray-600">
                Mundo {level?.world}: {level?.description}
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
              Você completou todos os 100 níveis!
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
