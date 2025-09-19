'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, Volume2, VolumeX, Save, Star, Trophy, Timer, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabaseClient';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import styles from './memory-game.module.css';

// Mundos em ordem de progressão
const WORLD_ORDER = ['starter', 'sports', 'fantasy', 'heroes', 'digital', 'multicultural'];

// Avatares organizados por mundo/categoria
const AVATAR_WORLDS = {
  starter: {
    name: 'Mundo Inicial',
    emoji: '🌟',
    avatars: [
      'Cartoon_2', 'Funny_1', 'Funny_4', 'Face_1', 'Face_4', 'Pet_2',
      'Cartoon_1', 'Funny_2', 'Funny_3', 'Face_2', 'Face_3', 'Pet_1'
    ]
  },
  sports: {
    name: 'Arena dos Campeões',
    emoji: '⚽',
    avatars: [
      'Basquete_1', 'Basquete_2', 'Futebol_1', 'Futebol_4', 'Chess_1', 'Chess_3',
      'Basquete_3', 'Futebol_2', 'Futebol_3', 'Chess_2', 'Chess_4', 'Player_16bits_1'
    ]
  },
  fantasy: {
    name: 'Reino Encantado',
    emoji: '🏰',
    avatars: [
      'Fada_2', 'Fada_4', 'princesa_1', 'princesa_2', 'Guerreiro_2', 'Guerreiro_3',
      'Fada_1', 'Fada_3', 'princesa_3', 'princesa_4', 'Guerreiro_1', 'Guerreiro_4'
    ]
  },
  heroes: {
    name: 'Liga dos Heróis',
    emoji: '🦸',
    avatars: [
      'Heroi_2', 'Heroi_4', 'Heroi_6', 'Heroi_8', 'Fighting_2', 'Fighting_3',
      'Heroi_1', 'Heroi_3', 'Heroi_5', 'Heroi_7', 'Fighting_1', 'Fighting_4'
    ]
  },
  digital: {
    name: 'Mundo Digital',
    emoji: '🎮',
    avatars: [
      'Minecraft_1', 'Minecraft_3', 'Roblox_2', 'Roblox_3', 'Player_16bits_2', 'Player_16bits_3',
      'Minecraft_2', 'Minecraft_4', 'Roblox_1', 'Roblox_4', 'Player_16bits_4', 'Player_16bits_5'
    ]
  },
  multicultural: {
    name: 'Aldeia Global',
    emoji: '🌍',
    avatars: [
      'menina_brasil_1', 'menino_brasil_2', 'menina_japao_3', 'menino_japao_2', 
      'menina_indigena_2', 'menino_indigena_2', 'menina_brasil_2', 'menino_brasil_1',
      'menina_japao_1', 'menino_japao_1', 'menina_indigena_1', 'menino_indigena_1'
    ]
  }
};

// Configurações de dificuldade
const DIFFICULTY_SETTINGS = {
  easy: { name: 'Fácil', pairs: 4, gridCols: 4, gridRows: 2, time: 60, emoji: '😊' },
  medium: { name: 'Médio', pairs: 6, gridCols: 4, gridRows: 3, time: 90, emoji: '🎯' },
  hard: { name: 'Difícil', pairs: 8, gridCols: 4, gridRows: 4, time: 120, emoji: '🔥' }
};

interface Card {
  id: string;
  avatar: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'loading' | 'intro' | 'instructions' | 'playing' | 'worldComplete' | 'gameComplete';

// Componente de Confetti
const ConfettiEffect = React.memo(() => {
  useEffect(() => {
    // ... (código do confetti inalterado) ...
  }, []);
  return null;
});

// Componente de Trofeu Explodindo
const TrophyExplosion = React.memo(() => {
  useEffect(() => {
    confetti({ /* ... */ });
  }, []);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="text-center animate-pulse">
        <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-4 animate-bounce" />
        <h2 className="text-4xl font-bold text-white mb-2">MUNDO COMPLETO!</h2>
        <p className="text-xl text-yellow-300">Preparando próximo desafio...</p>
      </div>
    </div>
  );
});


export default function MemoryGame() {
  const router = useRouter();
  const supabase = createClient();
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioManagerRef = useRef<any>(null);

  // Estados de controle
  const [gameState, setGameState] = useState<GameState>('loading');
  const [isReady, setIsReady] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTrophyExplosion, setShowTrophyExplosion] = useState(false);
  
  // Estados de progressão
  const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [totalScore, setTotalScore] = useState(0);
  
  // Estados salvos
  const [totalPairsFound, setTotalPairsFound] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  
  // Estados do jogo atual
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // Inicialização
  useEffect(() => {
    const init = async () => {
      try {
        const { GameAudioManager } = await import('@/utils/gameAudioManager');
        audioManagerRef.current = GameAudioManager.getInstance();
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const savedPairs = localStorage.getItem('memoryGame_totalPairs');
        const savedBest = localStorage.getItem('memoryGame_bestScore');
        
        if (savedPairs) setTotalPairsFound(parseInt(savedPairs));
        if (savedBest) setBestScore(parseInt(savedBest));
        
      } catch (err) { 
        console.warn('Erro na inicialização de áudio:', err); 
      }
      setIsReady(true);
      setGameState('intro');
    };
    init();
  }, []);

  // --- FUNÇÕES MEMORIZADAS COM useCallback ---

  const getCurrentWorld = useCallback(() => WORLD_ORDER[currentWorldIndex], [currentWorldIndex]);
  const getCurrentWorldData = useCallback(() => AVATAR_WORLDS[getCurrentWorld() as keyof typeof AVATAR_WORLDS], [getCurrentWorld]);

  const leoSpeak = useCallback((text: string, onEnd?: () => void) => {
    if (!isSoundOn || !audioManagerRef.current) { 
      onEnd?.(); 
      return; 
    }
    audioManagerRef.current.falarLeo(text, onEnd);
  }, [isSoundOn]);

  const playSound = useCallback((type: 'flip' | 'match' | 'error' | 'victory' | 'celebration') => {
      // ... (código do playSound inalterado) ...
  }, [isSoundOn]);
  
  const initializeGame = useCallback(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const world = getCurrentWorldData();
    
    if (!world) return;
    
    console.log(`Iniciando jogo - Dificuldade: ${difficulty}, Pares: ${settings.pairs}`);
    
    const availableAvatars = [...world.avatars];
    if (availableAvatars.length < settings.pairs) {
      console.warn(`Não há avatares suficientes no mundo ${getCurrentWorld()}`);
      return;
    }
    
    const selectedAvatars = availableAvatars.sort(() => Math.random() - 0.5).slice(0, settings.pairs);
    
    const gameCards: Card[] = selectedAvatars.flatMap((avatar, index) => [
        { id: `${avatar}-1-${index}`, avatar, isFlipped: false, isMatched: false },
        { id: `${avatar}-2-${index}`, avatar, isFlipped: false, isMatched: false }
    ]);
    
    console.log(`Total de cartas criadas: ${gameCards.length} (${gameCards.length / 2} pares)`);
    
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
    setGameStarted(false);
  }, [difficulty, getCurrentWorld, getCurrentWorldData]);
  
  const startCurrentWorld = useCallback(() => {
    setDifficulty('easy');
    const worldData = getCurrentWorldData();
    leoSpeak(`Bem-vindo ao ${worldData.name}! Vamos começar no modo fácil!`, () => {
      setGameState('playing');
      initializeGame();
    });
  }, [getCurrentWorldData, initializeGame, leoSpeak]);
  
  const handleStartIntro = useCallback(async () => {
    if (isInteracting || !isReady) return;
    setIsInteracting(true);
    if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();
    if (audioManagerRef.current) await audioManagerRef.current.forceInitialize();
    
    leoSpeak("Olá! Sou o Leo, e agora, vamos nos divertir e exercitar nossa memória. Vamos nos tornar um super cérebro!", () => { 
      setIsInteracting(false); 
      setGameState('instructions'); 
    });
  }, [isInteracting, isReady, leoSpeak]);

  const handleNextInstruction = useCallback(() => {
    if (isInteracting) return;
    setIsInteracting(true);
    leoSpeak("Vamos explorar mundos incríveis juntos! Começaremos pelo Mundo Inicial no modo fácil, depois médio, depois difícil. Quando completarmos um mundo inteiro, passaremos automaticamente para o próximo desafio. Vamos nessa jornada!", () => { 
      setIsInteracting(false);
      startCurrentWorld();
    });
  }, [isInteracting, leoSpeak, startCurrentWorld]);

  const handleVictory = useCallback(() => {
    console.log(`Vitória! Dificuldade atual: ${difficulty}`);
    setIsTimerActive(false);
    
    playSound('victory');
    setShowConfetti(true);
    
    const newPairs = totalPairsFound + matches;
    setTotalPairsFound(newPairs);
    localStorage.setItem('memoryGame_totalPairs', newPairs.toString());
    
    const currentScore = totalScore + score;
    setTotalScore(currentScore);
    
    if (currentScore > bestScore) {
      setBestScore(currentScore);
      localStorage.setItem('memoryGame_bestScore', currentScore.toString());
    }
    
    const nextAction = () => {
      if (difficulty === 'easy') {
        leoSpeak("Parabéns! Agora vamos para o nível médio. Vai ficar mais desafiador!", () => {
          console.log('Mudando para médio');
          setDifficulty('medium');
        });
      } else if (difficulty === 'medium') {
        leoSpeak("Incrível! Agora vamos para o modo difícil. Este é o último desafio deste mundo!", () => {
          console.log('Mudando para difícil');
          setDifficulty('hard');
        });
      } else {
        if (currentWorldIndex < WORLD_ORDER.length - 1) {
          setShowTrophyExplosion(true);
          leoSpeak("Fantástico! Você completou todo o mundo! Vamos para o próximo desafio!", () => {
            setTimeout(() => {
              setShowTrophyExplosion(false);
              setCurrentWorldIndex(prev => prev + 1);
              setGameState('worldComplete');
            }, 2000);
          });
        } else {
          leoSpeak("Isso aí amigão! Você é um verdadeiro mestre da memória! Completou todos os mundos!", () => {
            setGameState('gameComplete');
          });
        }
      }
    };

    setTimeout(nextAction, 2000);
    setTimeout(() => setShowConfetti(false), 4000);
  }, [difficulty, matches, score, totalScore, bestScore, totalPairsFound, currentWorldIndex, leoSpeak, playSound]);
  
  // Efeito para re-inicializar o jogo quando a dificuldade muda após a vitória
  useEffect(() => {
    if (gameState === 'playing' && (difficulty === 'medium' || difficulty === 'hard')) {
        setTimeout(() => {
            initializeGame();
            setTimeout(() => {
                setGameStarted(true);
                setIsTimerActive(true);
            }, 500);
        }, 100);
    }
  }, [difficulty, gameState, initializeGame]);


  const handleGameOver = useCallback(() => {
    setIsTimerActive(false);
    
    leoSpeak("Que pena, o tempo acabou! Mas você fez um ótimo trabalho. Vamos tentar de novo?", () => {
      setTimeout(() => {
        initializeGame();
      }, 2000);
    });
  }, [initializeGame, leoSpeak]);
  
  const checkMatch = useCallback((selected: string[]) => {
    const [first, second] = selected.map(id => cards.find(c => c.id === id));
    
    if (first && second && first.avatar === second.avatar) {
      setTimeout(() => {
        playSound('match');
        
        setCards(prev => prev.map(c => 
          c.id === first.id || c.id === second.id 
            ? { ...c, isMatched: true }
            : c
        ));
        
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxCombo) setMaxCombo(newCombo);
        
        if (newCombo === 5) {
          leoSpeak("Incrível! Combo de 5 acertos seguidos!");
          setShowConfetti(true);
          playSound('celebration');
          setTimeout(() => setShowConfetti(false), 3000);
        } else if (newCombo === 3) {
          leoSpeak("Muito bem! Combo de 3!");
        }
        
        setMatches(prev => prev + 1);
        setScore(prev => prev + (100 * newCombo));
        setSelectedCards([]);
      }, 600);
    } else {
      setTimeout(() => {
        playSound('error');
        setCards(prev => prev.map(c => 
          c.id === first?.id || c.id === second?.id 
            ? { ...c, isFlipped: false }
            : c
        ));
        setCombo(0);
        setSelectedCards([]);
      }, 1000);
    }
  }, [cards, combo, maxCombo, leoSpeak, playSound]);

  const handleCardClick = useCallback((cardId: string) => {
    if (selectedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    if (!gameStarted) {
      setGameStarted(true);
      setIsTimerActive(true);
    }
    
    playSound('flip');
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    
    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);
    
    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      checkMatch(newSelected);
    }
  }, [selectedCards, cards, gameStarted, playSound, checkMatch]);

  const handleContinueToNextWorld = useCallback(() => {
    startCurrentWorld();
  }, [startCurrentWorld]);

  const handleSaveSession = useCallback(async () => {
    setSalvando(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        alert('Erro: Sessão expirada. Por favor, faça login novamente.');
        router.push('/login');
        return;
      }
      
      const { error } = await supabase.from('sessoes').insert([{
        usuario_id: user.id,
        atividade_nome: 'Jogo da Memória',
        pontuacao_final: totalScore,
        data_fim: new Date().toISOString()
      }]);

      if (error) {
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Progresso salvo com sucesso!\n\n🧠 Progresso do Jogo da Memória:\n- Mundos Completados: ${currentWorldIndex}/${WORLD_ORDER.length}\n- Pontuação Total: ${totalScore} pontos\n- Pares Encontrados: ${totalPairsFound}`);
        handleContinueToNextWorld();
      }
    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  }, [supabase, router, totalScore, currentWorldIndex, totalPairsFound, handleContinueToNextWorld]);

  // --- EFEITOS (useEffect) ---

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && gameStarted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameStarted && gameState === 'playing') {
      handleGameOver();
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [isTimerActive, timeLeft, gameStarted, gameState, handleGameOver]);

  useEffect(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    if (matches === settings.pairs && matches > 0 && gameStarted && gameState === 'playing') {
      console.log('VITÓRIA DETECTADA!');
      handleVictory();
    }
  }, [matches, difficulty, gameStarted, gameState, handleVictory]);

  
  // --- RENDERIZAÇÃO ---
  
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-300 via-purple-400 to-pink-400">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Jogo da Memória</h1>
          <p className="text-xl text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-indigo-300 via-purple-400 to-pink-400 overflow-hidden">
        {/* ... (código da tela de intro inalterado) ... */}
         <button 
           onClick={handleStartIntro} 
           disabled={!isReady || isInteracting}
           className="w-full max-w-xs text-base sm:text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full px-6 py-3 sm:py-4 shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
         >
           {!isReady ? 'Carregando Áudio...' : (isInteracting ? 'Ouvindo Leo...' : 'Começar Aventura da Memória')}
         </button>
      </div>
    );
  }

  if (gameState === 'instructions') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-300 via-indigo-300 to-blue-300">
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 max-w-lg sm:max-w-2xl w-full shadow-2xl text-center backdrop-blur-sm">
          {/* ... (código da tela de instruções inalterado) ... */}
           <button 
             onClick={handleNextInstruction} 
             disabled={isInteracting}
             className="w-full text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full py-3 sm:py-4 shadow-xl hover:scale-105 transition-transform disabled:opacity-60"
           >
             {isInteracting ? 'Leo está explicando...' : 'Vamos Começar a Aventura!'}
           </button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
        {showConfetti && <ConfettiEffect />}
        {showTrophyExplosion && <TrophyExplosion />}
        
        <header>
            {/* ... (código do header inalterado) ... */}
        </header>

        <main className="p-4 max-w-7xl mx-auto">
          {/* ... (código do painel de status inalterado) ... */}

          <div className="bg-white/30 backdrop-blur rounded-2xl p-4">
            <div 
              className="grid gap-3 max-w-4xl mx-auto"
              style={{
                gridTemplateColumns: `repeat(${DIFFICULTY_SETTINGS[difficulty].gridCols}, 1fr)`,
              }}
            >
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`${styles.cardContainer} ${card.isMatched ? styles.matched : ''}`}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div className={`${styles.cardInner} ${card.isFlipped || card.isMatched ? styles.flipped : ''}`}>
                    <div className={`${styles.cardFace} ${styles.cardBack}`}>
                      <span>🧠</span>
                      <span>LudiTEA</span>
                    </div>
                    <div className={`${styles.cardFace} ${styles.cardFront}`}>
                      <img
                        src={`/images/avatares/${card.avatar}.webp`}
                        alt="Avatar"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/avatares/Face_1.webp';
                        }}
                      />
                      {card.isMatched && <span>✅</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (gameState === 'worldComplete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 flex items-center justify-center p-4">
        {/* ... (código da tela de mundo completo inalterado) ... */}
      </div>
    );
  }

  if (gameState === 'gameComplete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gold-200 via-yellow-200 to-orange-200 flex items-center justify-center p-4">
        {/* ... (código da tela de jogo completo inalterado) ... */}
      </div>
    );
  }

  return null;
}
