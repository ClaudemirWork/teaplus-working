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
    emoji: '',
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
    emoji: '',
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
      'menina_japao_1', 'menina_japao_1', 'menina_indigena_1', 'menino_indigena_1'
    ]
  }
};

// Configurações de dificuldade
const DIFFICULTY_SETTINGS = {
  easy: {
    name: 'Fácil',
    pairs: 4,
    gridCols: 4,
    gridRows: 2,
    time: 60,
    emoji: '😊'
  },
  medium: {
    name: 'Médio',
    pairs: 6,
    gridCols: 4,
    gridRows: 3,
    time: 90,
    emoji: '🎯'
  },
  hard: {
    name: 'Difícil',
    pairs: 8,
    gridCols: 4,
    gridRows: 4,
    time: 120,
    emoji: ''
  }
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
    let canvas: HTMLCanvasElement | null = document.createElement('canvas');
    canvas.style.position = 'fixed'; 
    canvas.style.top = '0'; 
    canvas.style.left = '0';
    canvas.style.width = '100vw'; 
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none'; 
    canvas.style.zIndex = '1000';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let particles: any[] = [];
    const colors = ["#ffca3a", "#ff595e", "#8ac926", "#1982c4", "#6a4c93"];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 10 + 5,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.vy += 0.05; p.y += p.vy; p.x += p.vx;
        if (p.y > window.innerHeight) particles.splice(i, 1);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size * 2);
      });
      if (particles.length > 0) requestAnimationFrame(animate);
      else if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
    animate();
    return () => { if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas); };
  }, []);
  return null;
});

// Componente de Trofeu Explodindo
const TrophyExplosion = React.memo(() => {
  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FFFF00', '#FF8C00']
    });
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

  // Getter para mundo atual
  const getCurrentWorld = () => WORLD_ORDER[currentWorldIndex];
  const getCurrentWorldData = () => AVATAR_WORLDS[getCurrentWorld() as keyof typeof AVATAR_WORLDS];

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

  // Leo falar - CORRIGIDO
  const leoSpeak = useCallback((text: string, onEnd?: () => void) => {
    if (!isSoundOn || !audioManagerRef.current) {
      onEnd?.();
      return;
    }
    
    // Garantir que o callback seja chamado apenas uma vez
    let called = false;
    const wrappedCallback = () => {
      if (!called) {
        called = true;
        onEnd?.();
      }
    };
    
    try {
      audioManagerRef.current.falarLeo(text, wrappedCallback);
    } catch (error) {
      console.error('Erro ao chamar falarLeo:', error);
      wrappedCallback();
    }
  }, [isSoundOn]);

  // Sons do jogo
  const playSound = useCallback((type: 'flip' | 'match' | 'error' | 'victory' | 'celebration') => {
    if (!isSoundOn || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'flip':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        break;

      case 'match':
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;

      case 'error':
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        break;

      case 'victory':
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

      case 'celebration':
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        [440, 550, 660, 880].forEach((freq, i) => {
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.07);
        });
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
        break;
    }
  }, [isSoundOn]);

  // Handler da tela inicial - CORRIGIDO
  const handleStartIntro = async () => {
    if (isInteracting || !isReady) return;
    setIsInteracting(true);
    try {
      if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();
      if (audioManagerRef.current) await audioManagerRef.current.forceInitialize();

      leoSpeak("Olá! Sou o Leo, e agora, vamos nos divertir e exercitar nossa memória. Vamos nos tornar um super cérebro!", () => {
        setIsInteracting(false);
        setGameState('instructions');
      });
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
      setIsInteracting(false);
      setGameState('instructions');
    }
  };

  // Handler de instruções - CORRIGIDO
  const handleNextInstruction = () => {
    if (isInteracting) return;
    setIsInteracting(true);
    try {
      leoSpeak("Vamos explorar mundos incríveis juntos! Começaremos pelo Mundo Inicial no modo fácil, depois médio, depois difícil. Quando completarmos um mundo inteiro, passaremos automaticamente para o próximo desafio. Vamos nessa jornada!", () => {
        setIsInteracting(false);
        startCurrentWorld();
      });
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      setIsInteracting(false);
      startCurrentWorld();
    }
  };

  // Iniciar mundo atual - CORRIGIDO
  const startCurrentWorld = () => {
    setDifficulty('easy');
    const worldData = getCurrentWorldData();
    try {
      leoSpeak(`Bem-vindo ao ${worldData.name}! Vamos começar no modo fácil!`, () => {
        setGameState('playing');
        initializeGame();
      });
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      setGameState('playing');
      initializeGame();
    }
  };

  // Inicializar jogo
  const initializeGame = useCallback(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const world = getCurrentWorldData();

    if (!world) return;

    console.log(`Iniciando jogo - Dificuldade: ${difficulty}, Pares: ${settings.pairs}`);

    // Garantir que temos avatares suficientes
    const availableAvatars = [...world.avatars];
    if (availableAvatars.length < settings.pairs) {
      console.warn(`Não há avatares suficientes no mundo ${getCurrentWorld()}`);
      return;
    }

    // Selecionar exatamente o número correto de avatares únicos
    const selectedAvatars = availableAvatars
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.pairs);

    console.log(`Avatares selecionados:`, selectedAvatars);

    // Criar exatamente 2 cartas para cada avatar (1 par)
    const gameCards: Card[] = [];
    selectedAvatars.forEach((avatar, index) => {
      gameCards.push(
        { id: `${avatar}-1-${index}`, avatar, isFlipped: false, isMatched: false },
        { id: `${avatar}-2-${index}`, avatar, isFlipped: false, isMatched: false }
      );
    });

    console.log(`Total de cartas criadas: ${gameCards.length} (${gameCards.length / 2} pares)`);

    // Embaralhar as cartas
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);

    // Reset do estado do jogo
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
  }, [difficulty, currentWorldIndex]);

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && gameStarted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameStarted && gameState === 'playing') {
      handleGameOver();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTimerActive, timeLeft, gameStarted, gameState]);

  // Verificar vitória
  useEffect(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    console.log(`Checando vitória - Matches: ${matches}, Required: ${settings.pairs}, GameStarted: ${gameStarted}, GameState: ${gameState}`);

    if (matches === settings.pairs && matches > 0 && gameStarted && gameState === 'playing') {
      console.log('VITÓRIA DETECTADA!');
      handleVictory();
    }
  }, [matches, difficulty, gameStarted, gameState]);

  // Clique na carta
  const handleCardClick = (cardId: string) => {
    if (selectedCards.length >= 2) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    if (!gameStarted) {
      setGameStarted(true);
      setIsTimerActive(true);
    }

    playSound('flip');

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

  // Verificar par
  const checkMatch = (selected: string[]) => {
    const [first, second] = selected.map(id =>
      cards.find(c => c.id === id)
    );

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
        if (newCombo > maxCombo) {
          setMaxCombo(newCombo);
        }

        if (newCombo === 5) {
          leoSpeak("Incrível! Combo de 5 acertos seguidos!");
          setShowConfetti(true);
          playSound('celebration');
          setTimeout(() => setShowConfetti(false), 3000);
        } else if (newCombo === 3) {
          leoSpeak("Muito bem! Combo de 3!");
        }

        const newMatches = matches + 1;
        console.log(`Novo match! Total: ${newMatches}`);
        setMatches(newMatches);
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
  };

  // Lógica de vitória e progressão
  const handleVictory = () => {
    console.log(`Vitória! Dificuldade atual: ${difficulty}`);
    setIsTimerActive(false);

    playSound('victory');
    setShowConfetti(true);

    // Salvar recordes
    const newPairs = totalPairsFound + matches;
    setTotalPairsFound(newPairs);
    localStorage.setItem('memoryGame_totalPairs', newPairs.toString());

    const currentScore = totalScore + score;
    setTotalScore(currentScore);

    if (currentScore > bestScore) {
      setBestScore(currentScore);
      localStorage.setItem('memoryGame_bestScore', currentScore.toString());
    }

    // Progressão: Fácil → Médio → Difícil → Próximo Mundo
    if (difficulty === 'easy') {
      setTimeout(() => {
        leoSpeak("Parabéns! Agora vamos para o nível médio. Vai ficar mais desafiador!", () => {
          console.log('Mudando para médio');
          setDifficulty('medium');
          setTimeout(() => {
            initializeGame();
            setTimeout(() => {
              setGameStarted(true);
              setIsTimerActive(true);
            }, 500);
          }, 100);
        });
      }, 2000);
    } else if (difficulty === 'medium') {
      setTimeout(() => {
        leoSpeak("Incrível! Agora vamos para o modo difícil. Este é o último desafio deste mundo!", () => {
          console.log('Mudando para difícil');
          setDifficulty('hard');
          setTimeout(() => {
            initializeGame();
            setTimeout(() => {
              setGameStarted(true);
              setIsTimerActive(true);
            }, 500);
          }, 100);
        });
      }, 2000);
    } else {
      // Completou modo difícil - próximo mundo ou fim
      setTimeout(() => {
        if (currentWorldIndex < WORLD_ORDER.length - 1) {
          // Há próximo mundo
          setShowTrophyExplosion(true);
          leoSpeak("Fantástico! Você completou todo o mundo! Vamos para o próximo desafio!", () => {
            setTimeout(() => {
              setShowTrophyExplosion(false);
              setCurrentWorldIndex(prev => prev + 1);
              setDifficulty('easy');
              setGameState('worldComplete');
            }, 2000);
          });
        } else {
          // Completou todos os mundos
          leoSpeak("Isso aí amigão! Você é um verdadeiro mestre da memória! Completou todos os mundos!", () => {
            setGameState('gameComplete');
          });
        }
      }, 2000);
    }

    setTimeout(() => setShowConfetti(false), 4000);
  };

  // Game Over
  const handleGameOver = () => {
    setIsTimerActive(false);

    leoSpeak("Que pena, o tempo acabou! Mas você fez um ótimo trabalho. Vamos tentar de novo?", () => {
      // Reinicia a mesma fase após 2 segundos
      setTimeout(() => {
        initializeGame();
        setTimeout(() => {
          setGameStarted(true);
          setIsTimerActive(true);
        }, 500);
      }, 2000);
    });
  };

  // Continuar para próximo mundo
  const handleContinueToNextWorld = () => {
    startCurrentWorld();
  };

  const handleSaveSession = async () => {
    setSalvando(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('Erro: Sessão expirada. Por favor, faça login novamente.');
        router.push('/login');
        return;
      }

      const { error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Jogo da Memória',
          pontuacao_final: totalScore,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Progresso salvo com sucesso!

🧠 Progresso do Jogo da Memória:
- Mundos Completados: ${currentWorldIndex}/${WORLD_ORDER.length}
- Pontuação Total: ${totalScore} pontos
- Pares Encontrados: ${totalPairsFound}`);

        handleContinueToNextWorld();
      }
    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  };

  // Renderização das telas
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
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg rotate-45"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm sm:max-w-md">
          <div className="mb-4 animate-bounce-slow">
            <Image
              src="/images/mascotes/leo/leo_memoria.webp"
              alt="Leo Memória"
              width={280}
              height={280}
              className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 drop-shadow-2xl"
              priority
            />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">
            Jogo da Memória
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-6 drop-shadow-md">
            Encontre todos os pares com Leo!
          </p>

          {(totalPairsFound > 0 || bestScore > 0) && (
            <div className="bg-white/90 rounded-2xl p-4 mb-6 shadow-xl backdrop-blur-sm border border-purple-200 w-full max-w-xs">
              <div className="flex items-center justify-center gap-4 text-sm">
                {totalPairsFound > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                    <span className="font-bold text-purple-800">{totalPairsFound} pares</span>
                  </div>
                )}
                {bestScore > 0 && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <span className="font-bold text-purple-800">{bestScore}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleStartIntro}
            disabled={!isReady || isInteracting}
            className="w-full max-w-xs text-base sm:text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full px-6 py-3 sm:py-4 shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {!isReady ? 'Carregando Áudio...' : (isInteracting ? 'Ouvindo Leo...' : 'Começar Aventura da Memória')}
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'instructions') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-300 via-indigo-300 to-blue-300">
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 max-w-lg sm:max-w-2xl w-full shadow-2xl text-center backdrop-blur-sm">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-indigo-600">Mundos da Memória</h2>

          {/* Preview dos mundos */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {WORLD_ORDER.map((worldKey) => {
              const world = AVATAR_WORLDS[worldKey as keyof typeof AVATAR_WORLDS];
              return (
                <div key={worldKey} className="bg-gray-100 rounded-lg p-2 text-center">
                  <div className="text-2xl mb-1">{world.emoji}</div>
                  <div className="text-xs font-medium text-gray-600">{world.name}</div>
                </div>
              );
            })}
          </div>

          <div className="text-base sm:text-lg text-gray-700 space-y-4 sm:space-y-6 mb-4 sm:mb-6 text-left">
            <p className="flex items-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-4xl">🃏</span>
              <span><b>Clique nas cartas</b> para virá-las e revelar os avatares!</span>
            </p>
            <p className="flex items-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-4xl">🌍</span>
              <span><b>Explore 6 mundos</b> - cada um com 3 níveis de dificuldade!</span>
            </p>
            <p className="flex items-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-4xl">🚀</span>
              <span><b>Progressão automática</b> - complete cada mundo para avançar!</span>
            </p>
            <p className="flex items-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-4xl">🔥</span>
              <span><b>Faça combos</b> para ganhar mais pontos!</span>
            </p>
          </div>

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

        <header className="bg-white/90 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setGameState('intro')}
                className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="ml-1 font-medium">Voltar</span>
              </button>

              <div className="text-center">
                <h1 className="text-lg font-bold text-gray-800">
                  {getCurrentWorldData().emoji} {getCurrentWorldData().name}
                </h1>
                <p className="text-sm text-gray-600">
                  {DIFFICULTY_SETTINGS[difficulty].emoji} {DIFFICULTY_SETTINGS[difficulty].name} - {DIFFICULTY_SETTINGS[difficulty].pairs} pares
                </p>
              </div>

              <button
                onClick={() => setIsSoundOn(!isSoundOn)}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 max-w-7xl mx-auto">
          <div className="bg-white/90 rounded-2xl p-4 shadow-xl border border-purple-200 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Target className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-xs text-gray-600">Pares</div>
                  <div className="font-bold text-purple-800">{matches}/{DIFFICULTY_SETTINGS[difficulty].pairs}</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="w-5 h-5 text-blue-600 flex items-center justify-center">🔄</div>
                <div>
                  <div className="text-xs text-gray-600">Moves</div>
                  <div className="font-bold text-blue-800">{moves}</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                <div>
                  <div className="text-xs text-gray-600">Pontos</div>
                  <div className="font-bold text-yellow-600">{totalScore + score}</div>
                </div>
              </div>
              {combo > 1 && (
                <div className="flex items-center justify-center gap-1">
                  <div className="w-5 h-5 text-orange-500 flex items-center justify-center">🔥</div>
                  <div>
                    <div className="text-xs text-gray-600">Combo</div>
                    <div className="font-bold text-orange-500 animate-pulse">x{combo}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center gap-1">
                <Timer className={`w-5 h-5 ${timeLeft < 20 ? 'text-red-500' : 'text-green-600'}`} />
                <div>
                  <div className="text-xs text-gray-600">Tempo</div>
                  <div className={`font-bold ${timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
        <ConfettiEffect />

        <div className="bg-white/95 rounded-xl shadow-2xl p-8 backdrop-blur-sm border border-green-200 max-w-lg w-full text-center">
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4 animate-bounce" />

          <h3 className="text-3xl font-bold text-gray-800 mb-2">Mundo Completo!</h3>

          <p className="text-lg text-green-600 font-medium mb-6">
            Próximo: {getCurrentWorldData().emoji} {getCurrentWorldData().name}
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-gray-800 mb-3">Progresso Geral:</h4>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-800">{currentWorldIndex + 1}/{WORLD_ORDER.length}</div>
                <div className="text-xs text-gray-600">Mundos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800">{totalScore}</div>
                <div className="text-xs text-green-600">Pontos Total</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleContinueToNextWorld}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              🚀 Continuar Aventura
            </button>

            <button
              onClick={handleSaveSession}
              disabled={salvando}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                !salvando
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save size={18} />
              <span>{salvando ? 'Salvando...' : 'Salvar Progresso'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'gameComplete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 flex items-center justify-center p-4">
        <ConfettiEffect />

        <div className="bg-white/95 rounded-xl shadow-2xl p-8 backdrop-blur-sm border border-yellow-200 max-w-lg w-full text-center">
          <div className="text-8xl mb-4 animate-pulse">🏆</div>

          <h3 className="text-4xl font-bold text-gray-800 mb-2">MESTRE DA MEMÓRIA!</h3>

          <p className="text-xl text-orange-600 font-medium mb-6">
            Você completou todos os {WORLD_ORDER.length} mundos!
          </p>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 mb-6">
            <h4 className="font-bold text-gray-800 mb-3">🌟 Conquista Final:</h4>
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-800">{totalScore}</div>
                <div className="text-sm text-orange-600">Pontos Finais</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-800">{totalPairsFound}</div>
                <div className="text-sm text-purple-600">Pares Totais</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleSaveSession}
              disabled={salvando}
              className={`flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-semibold transition-colors ${
                !salvando
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save size={20} />
              <span>{salvando ? 'Salvando...' : 'Salvar Conquista Final'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentWorldIndex(0);
                setDifficulty('easy');
                setTotalScore(0);
                setGameState('intro');
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              🏠 Nova Jornada
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
