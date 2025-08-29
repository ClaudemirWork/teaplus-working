'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './memory-game.module.css';

// Avatares organizados por mundo/categoria
const AVATAR_WORLDS = {
  starter: {
    name: 'Mundo Inicial',
    avatars: [
      'Cartoon_2', 'Funny_1', 'Funny_4', 'Face_1', 'Face_4', 'Pet_2'
    ]
  },
  sports: {
    name: 'Arena dos Campeões',
    avatars: [
      'Basquete_1', 'Basquete_2', 'Futebol_1', 'Futebol_4', 'Chess_1', 'Chess_3'
    ]
  },
  fantasy: {
    name: 'Reino Encantado',
    avatars: [
      'Fada_2', 'Fada_4', 'princesa_1', 'princesa_2', 'Guerreiro_2', 'Guerreiro_3'
    ]
  },
  heroes: {
    name: 'Liga dos Heróis',
    avatars: [
      'Heroi_2', 'Heroi_4', 'Heroi_6', 'Heroi_8', 'Fighting_2', 'Fighting_3'
    ]
  },
  digital: {
    name: 'Mundo Digital',
    avatars: [
      'Minecraft_1', 'Minecraft_3', 'Roblox_2', 'Roblox_3', 'Player_16bits_2', 'Player_16bits_3'
    ]
  },
  multicultural: {
    name: 'Aldeia Global',
    avatars: [
      'menina_brasil_1', 'menino_brasil_2', 'menina_japao_3', 'menino_japao_2', 
      'menina_indigena_2', 'menino_indigena_2'
    ]
  }
};

// Imagens dos mascotes disponíveis
const MASCOT_IMAGES = {
  leo: {
    intro: 'leo_boas_vindas_resultado',
    happy: 'leo_feliz_resultado',
    strong: 'leo_forca_resultado',
    thumbsUp: 'leo_joinha_resultado',
    magic: 'leo_mago_resultado',
    surprised: 'leo_surpreso_resultado',
    pointing: 'leo_apontando_resultado'
  },
  mila: {
    intro: 'mila_boas_vindas_resultado',
    strong: 'mila_forca_resultado',
    thumbsUp: 'mila_joinha_resultado',
    magic: 'mila_feiticeira_resultado',
    pointing: 'mila_apontando_resultado'
  }
};

// Configurações de dificuldade
const DIFFICULTY_SETTINGS = {
  easy: {
    pairs: 4,
    gridCols: 4,
    gridRows: 2,
    time: 60
  },
  medium: {
    pairs: 6,
    gridCols: 4,
    gridRows: 3,
    time: 90
  },
  hard: {
    pairs: 8,
    gridCols: 4,
    gridRows: 4,
    time: 120
  }
};

interface Card {
  id: string;
  avatar: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type GameState = 'intro' | 'playing' | 'victory';
type Difficulty = 'easy' | 'medium' | 'hard';
type Mascot = 'leo' | 'mila';

export default function MemoryGame() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [currentWorld, setCurrentWorld] = useState('starter');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentMascot, setCurrentMascot] = useState<Mascot>('leo');
  const [mascotImage, setMascotImage] = useState('intro');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Narração dos mascotes
  const MASCOT_NARRATIONS = {
    leo: {
      intro: "Olá, amigo! Eu sou o Leo! As memórias dos habitantes do mundo mágico foram embaralhadas! Vamos ajudá-los encontrando os pares corretos?",
      start: "Vamos começar! Clique nas cartas para virá-las e encontre os pares iguais!",
      firstMatch: "Muito bem! Você encontrou o primeiro par! Continue assim!",
      combo: "Incrível! Você está em sequência!",
      struggling: "Não desista! Respire fundo e tente lembrar onde viu cada avatar!",
      halfWay: "Metade do caminho! Você está indo muito bem!",
      almostThere: "Quase lá! Só faltam poucos pares!",
      victory: "Parabéns! Você restaurou todas as memórias! Os habitantes agradecem sua ajuda!",
      timeWarning: "Cuidado! O tempo está acabando!"
    },
    mila: {
      intro: "Oi! Sou a Mila! Que confusão! Todas as memórias se misturaram! Que tal ajudarmos nossos amigos a se reencontrarem?",
      start: "Preparado? Memorize bem onde está cada avatar e encontre os pares!",
      firstMatch: "Eba! Primeiro par encontrado! Você tem ótima memória!",
      combo: "Uau! Sequência perfeita!",
      struggling: "Calma! Às vezes é bom parar e pensar onde viu cada personagem!",
      halfWay: "Metade concluída! Está indo super bem!",
      almostThere: "Falta pouco! Você consegue!",
      victory: "Fantástico! Todas as memórias foram restauradas! Você é demais!",
      timeWarning: "Atenção! O tempo está voando!"
    }
  };

  // Inicializar AudioContext
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Função para criar e tocar sons
  const playSound = (type: 'flip' | 'match' | 'error' | 'victory') => {
    if (!isSoundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'flip':
        // Som de virar carta - suave
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      
      case 'match':
        // Som de acerto - alegre
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      
      case 'error':
        // Som de erro - suave
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      
      case 'victory':
        // Som de vitória - fanfarra
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
          gain.gain.setValueAtTime(0.3, audioContext.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);
          osc.start(audioContext.currentTime + i * 0.1);
          osc.stop(audioContext.currentTime + i * 0.1 + 0.3);
        });
        break;
    }
  };

  // Função para falar o texto
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      // Aguardar as vozes carregarem
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const ptVoices = voices.filter(voice => voice.lang.includes('pt'));
        
        if (ptVoices.length > 0) {
          if (currentMascot === 'mila') {
            const femaleVoice = ptVoices.find(voice => 
              voice.name.toLowerCase().includes('female') || 
              voice.name.includes('Maria') ||
              voice.name.includes('Fernanda')
            );
            if (femaleVoice) utterance.voice = femaleVoice;
          } else {
            const maleVoice = ptVoices.find(voice => 
              voice.name.toLowerCase().includes('male') || 
              voice.name.includes('Daniel') ||
              voice.name.includes('Ricardo')
            );
            if (maleVoice) utterance.voice = maleVoice;
          }
        }
      };
      
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Falar quando mudar a tela
  useEffect(() => {
    if (gameState === 'intro') {
      setTimeout(() => {
        speakText(MASCOT_NARRATIONS[currentMascot].intro);
      }, 500);
    }
  }, [gameState, currentMascot]);

  // Inicializar jogo
  const initializeGame = useCallback(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const world = AVATAR_WORLDS[currentWorld as keyof typeof AVATAR_WORLDS];
    
    if (!world) {
      console.error('World not found:', currentWorld);
      return;
    }
    
    const selectedAvatars = [...world.avatars]
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.pairs);
    
    const gameCards: Card[] = [];
    selectedAvatars.forEach((avatar, index) => {
      gameCards.push(
        {
          id: `${avatar}-1-${index}`,
          avatar,
          isFlipped: false,
          isMatched: false
        },
        {
          id: `${avatar}-2-${index}`,
          avatar,
          isFlipped: false,
          isMatched: false
        }
      );
    });
    
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setSelectedCards([]);
    setMoves(0);
    setMatches(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(settings.time);
    setIsTimerActive(false);
    
    const mascot = Math.random() > 0.5 ? 'leo' : 'mila';
    setCurrentMascot(mascot);
    setMascotImage('intro');
  }, [difficulty, currentWorld]);

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleGameOver();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTimerActive, timeLeft, gameState]);

  // Verificar vitória
  useEffect(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    if (matches === settings.pairs && gameState === 'playing') {
      handleVictory();
    }
  }, [matches, difficulty, gameState]);

  // Lidar com clique na carta
  const handleCardClick = (cardId: string) => {
    if (selectedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    // Som de virar carta
    playSound('flip');
    
    if (!isTimerActive && moves === 0) {
      setIsTimerActive(true);
      speakText(MASCOT_NARRATIONS[currentMascot].start);
    }
    
    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    
    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);
    
    if (newSelected.length === 2) {
      setMoves(moves + 1);
      checkMatch(newSelected);
    }
  };

  // Verificar se é par
  const checkMatch = (selected: string[]) => {
    const [first, second] = selected.map(id => 
      cards.find(c => c.id === id)
    );
    
    if (first && second && first.avatar === second.avatar) {
      // Par encontrado!
      setTimeout(() => {
        playSound('match');
        
        setCards(prev => prev.map(c => 
          c.id === first.id || c.id === second.id 
            ? { ...c, isMatched: true }
            : c
        ));
        
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxCombo) {
          setMaxCombo(newCombo);
        }
        
        const newMatches = matches + 1;
        setMatches(newMatches);
        setScore(prev => prev + (100 * newCombo));
        setSelectedCards([]);
        
        // Narração especial
        if (matches === 0) {
          speakText(MASCOT_NARRATIONS[currentMascot].firstMatch);
          setMascotImage('happy');
        } else if (newCombo > 2) {
          speakText(MASCOT_NARRATIONS[currentMascot].combo);
          setMascotImage('magic');
        } else {
          setMascotImage('thumbsUp');
        }
        
        // Verificar progresso
        const settings = DIFFICULTY_SETTINGS[difficulty];
        if (newMatches === Math.floor(settings.pairs / 2)) {
          speakText(MASCOT_NARRATIONS[currentMascot].halfWay);
        } else if (newMatches === settings.pairs - 1) {
          speakText(MASCOT_NARRATIONS[currentMascot].almostThere);
        }
      }, 600);
    } else {
      // Não é par
      setTimeout(() => {
        playSound('error');
        
        setCards(prev => prev.map(c => 
          c.id === first?.id || c.id === second?.id 
            ? { ...c, isFlipped: false }
            : c
        ));
        setCombo(0);
        setSelectedCards([]);
        
        if (moves > 10 && matches < 2) {
          speakText(MASCOT_NARRATIONS[currentMascot].struggling);
          setMascotImage('strong');
        }
      }, 1000);
    }
  };

  // Vitória
  const handleVictory = () => {
    setIsTimerActive(false);
    setGameState('victory');
    setMascotImage('happy');
    
    playSound('victory');
    speakText(MASCOT_NARRATIONS[currentMascot].victory);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Game Over
  const handleGameOver = () => {
    setIsTimerActive(false);
    setGameState('victory');
    setMascotImage('surprised');
    speakText("O tempo acabou! Mas não desista, você pode tentar novamente!");
  };

  // Iniciar jogo
  const startGame = () => {
    initializeGame();
    setGameState('playing');
    setMascotImage('pointing');
  };

  // Função para obter caminho correto da imagem do mascote
  const getMascotImagePath = () => {
    const mascotData = currentMascot === 'leo' ? MASCOT_IMAGES.leo : MASCOT_IMAGES.mila;
    const imageName = mascotData[mascotImage as keyof typeof mascotData] || mascotData.intro;
    return `https://raw.githubusercontent.com/ClaudemirWork/teaplus-working/main/public/images/${imageName}.webp`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-4">
      <AnimatePresence mode="wait">
        {/* Tela de Introdução */}
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
              <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🌟 Portal das Memórias Perdidas 🌟
              </h1>
              
              {/* Mascote e Narração */}
              <div className="flex items-center justify-center mb-6 relative">
                <div className="relative">
                  <img 
                    src={getMascotImagePath()}
                    alt={currentMascot}
                    className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-lg object-cover"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2"
                  >
                    {currentMascot === 'leo' ? '🦁' : '🦊'}
                  </motion.div>
                </div>
                
                {/* Botão de áudio */}
                <button
                  onClick={() => speakText(MASCOT_NARRATIONS[currentMascot].intro)}
                  className="absolute top-0 right-0 p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors"
                  aria-label="Repetir narração"
                >
                  🔊
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6">
                <p className="text-lg text-gray-800 text-center">
                  {MASCOT_NARRATIONS[currentMascot].intro}
                </p>
              </div>
              
              {/* Botão de Som */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isSoundEnabled 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {isSoundEnabled ? '🔊 Som Ligado' : '🔇 Som Desligado'}
                </button>
              </div>
              
              {/* Seleção de Mundo */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-center">Escolha o Mundo:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(AVATAR_WORLDS).map(([key, world]) => (
                    <button
                      key={key}
                      onClick={() => setCurrentWorld(key)}
                      className={`p-3 rounded-xl transition-all ${
                        currentWorld === key
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {world.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Seleção de Dificuldade */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-center">Dificuldade:</h3>
                <div className="flex justify-center gap-4">
                  {(['easy', 'medium', 'hard'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        difficulty === level
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white scale-105'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {level === 'easy' ? '😊 Fácil' : level === 'medium' ? '🎯 Médio' : '🔥 Difícil'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Botão Iniciar */}
              <motion.button
                onClick={startGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                🎮 Começar Aventura!
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Tela do Jogo */}
        {gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-5xl mx-auto"
          >
            {/* HUD - Informações do Jogo */}
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 mb-4 shadow-lg">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex flex-wrap gap-4">
                  <span className="text-lg font-semibold">
                    🎯 Pares: {matches}/{DIFFICULTY_SETTINGS[difficulty].pairs}
                  </span>
                  <span className="text-lg font-semibold">
                    🔄 Movimentos: {moves}
                  </span>
                  {combo > 1 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lg font-bold text-orange-500"
                    >
                      🔥 Combo x{combo}
                    </motion.span>
                  )}
                </div>
                <div className="flex gap-4">
                  <span className="text-lg font-semibold">
                    ⭐ Pontos: {score}
                  </span>
                  <span className={`text-lg font-bold ${timeLeft < 20 ? 'text-red-500 animate-pulse' : ''}`}>
                    ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Grade de Cartas */}
            <div 
              className="grid gap-3 p-4 bg-white/30 backdrop-blur rounded-2xl"
              style={{
                gridTemplateColumns: `repeat(${DIFFICULTY_SETTINGS[difficulty].gridCols}, 1fr)`,
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                  whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                  className={`${styles.cardContainer} ${card.isMatched ? styles.matched : ''}`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div className={`${styles.cardInner} ${card.isFlipped || card.isMatched ? styles.flipped : ''}`}>
                    {/* Verso da Carta */}
                    <div className={`${styles.cardFace} ${styles.cardBack}`}>
                      <div className="text-white text-center">
                        <div className="text-3xl mb-2">✨</div>
                        <span className="font-bold text-sm">LudiTEA</span>
                      </div>
                    </div>
                    
                    {/* Frente da Carta */}
                    <div className={`${styles.cardFace} ${styles.cardFront} ${card.isMatched ? styles.matched : ''}`}>
                      <img
                        src={`https://raw.githubusercontent.com/ClaudemirWork/teaplus-working/main/public/images/avatares/${card.avatar}.webp`}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://raw.githubusercontent.com/ClaudemirWork/teaplus-working/main/public/images/avatares/Face_1.webp';
                        }}
                      />
                      {card.isMatched && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg"
                        >
                          <span className="text-4xl">✅</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tela de Vitória */}
        {gameState === 'victory' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl text-center">
              <motion.h2
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
              >
                {timeLeft > 0 ? '🎉 Fase Concluída! 🎉' : '⏰ Tempo Esgotado!'}
              </motion.h2>
              
              {/* Mascote comemorando */}
              <div className="flex justify-center mb-6">
                <motion.img
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  src={getMascotImagePath()}
                  alt={currentMascot}
                  className="w-40 h-40 rounded-full border-4 border-yellow-400 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://raw.githubusercontent.com/ClaudemirWork/teaplus-working/main/public/images/leo_feliz_resultado.webp';
                  }}
                />
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 mb-6">
                <p className="text-xl font-semibold mb-4">
                  {timeLeft > 0 ? MASCOT_NARRATIONS[currentMascot].victory : "Não foi dessa vez, mas você pode tentar novamente!"}
                </p>
                
                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-600">Movimentos</p>
                    <p className="text-2xl font-bold">{moves}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-600">Pontuação</p>
                    <p className="text-2xl font-bold">{score}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-600">Pares</p>
                    <p className="text-2xl font-bold">{matches}/{DIFFICULTY_SETTINGS[difficulty].pairs}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-600">Combo Máximo</p>
                    <p className="text-2xl font-bold">x{maxCombo}</p>
                  </div>
                </div>
                
                {/* Estrelas */}
                {timeLeft > 0 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {[1, 2, 3].map(star => (
                      <motion.span
                        key={star}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: star * 0.2 }}
                        className="text-5xl"
                      >
                        {star <= Math.min(3, Math.ceil(score / 500)) ? '⭐' : '☆'}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Botões de Ação */}
              <div className="flex gap-4">
                <motion.button
                  onClick={() => {
                    initializeGame();
                    setGameState('playing');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl"
                >
                  🔄 Jogar Novamente
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    setGameState('intro');
                    initializeGame();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl"
                >
                  🏠 Menu Principal
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
