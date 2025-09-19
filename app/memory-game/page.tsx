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
      'menina_japao_1', 'menino_japao_1', 'menina_indigena_1', 'menino_indigena_1'
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
    canvas.style.position = 'fixed'; canvas.style.top = '0'; canvas.style.left = '0';
    canvas.style.width = '100vw'; canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none'; canvas.style.zIndex = '1000';
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

  // Lock para não permitir múltiplos leoSpeak simultâneos
  const speakingRef = useRef(false);

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

      // Se já tem progresso salvo, pule a intro para não forçar re-execução toda hora
      const hasProgress = !!localStorage.getItem('memoryGame_totalPairs') || !!localStorage.getItem('memoryGame_bestScore');
      setGameState(hasProgress ? 'instructions' : 'intro');
    };
    init();
    // só roda uma vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Leo falar - com proteção contra reentrância
  const leoSpeak = useCallback((text: string, onEnd?: () => void) => {
    // se já está falando, ignora nova fala
    if (speakingRef.current) {
      // ainda assim, garantir callback síncrono para evitar bloqueio do fluxo
      onEnd?.();
      return;
    }

    speakingRef.current = true;

    const finalize = () => {
      speakingRef.current = false;
      onEnd?.();
    };

    if (!isSoundOn || !audioManagerRef.current) {
      // sem áudio: não travar, só chamar finalize
      finalize();
      return;
    }

    try {
      // audioManager deve aceitar callback
      audioManagerRef.current.falarLeo(text, () => {
        finalize();
      });
    } catch (err) {
      console.warn('Erro ao falarLeo:', err);
      finalize();
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

  // Handler da tela inicial sem loop
  const handleStartIntro = async () => {
    if (isInteracting || !isReady) return;
    setIsInteracting(true);

    try {
      if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();
    } catch (e) {
      console.warn('Erro ao resumir AudioContext', e);
    }

    if (audioManagerRef.current?.forceInitialize) {
      try { await audioManagerRef.current.forceInitialize(); } catch (e) { /* não crítico */ }
    }

    leoSpeak("Olá! Sou o Leo, e agora, vamos nos divertir e exercitar nossa memória. Vamos nos tornar um super cérebro!", () => {
      setGameState('instructions');
      // segura um pouquinho até liberar interação — evita eventuais reentrâncias rápidas
      setTimeout(() => setIsInteracting(false), 250);
    });
  };

  const handleNextInstruction = () => {
    if (isInteracting) return;
    setIsInteracting(true);

    leoSpeak("Vamos explorar mundos incríveis juntos! Começaremos pelo Mundo Inicial no modo fácil, depois médio, depois difícil. Quando completarmos um mundo inteiro, passaremos automaticamente para o próximo desafio. Vamos nessa jornada!", () => {
      // startCurrentWorld já faz setGameState('playing') — chamar depois
      startCurrentWorld();
      setTimeout(() => setIsInteracting(false), 300);
    });
  };

  // Iniciar mundo atual
  const startCurrentWorld = () => {
    setDifficulty('easy');
    const worldData = getCurrentWorldData();

    leoSpeak(`Bem-vindo ao ${worldData.name}! Vamos começar no modo fácil!`, () => {
      setGameState('playing');
      initializeGame();
      // não liberar interação automática; jogo controla quando starter começa (ao clicar/virar cartas)
      setTimeout(() => {
        setGameStarted(false);
        setIsTimerActive(false);
      }, 200);
    });
  };

  // Inicializar jogo com número correto de cartas
  const initializeGame = useCallback(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const world = getCurrentWorldData();

    if (!world) return;

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

    // Criar exatamente 2 cartas para cada avatar (1 par)
    const gameCards: Card[] = [];
    selectedAvatars.forEach((avatar, index) => {
      gameCards.push(
        { id: `${avatar}-1-${index}`, avatar, isFlipped: false, isMatched: false },
        { id: `${avatar}-2-${index}`, avatar, isFlipped: false, isMatched: false }
      );
    });

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
    return () => { if (timer) clearTimeout(timer); };
  }, [isTimerActive, timeLeft, gameStarted, gameState]);

  // Verificar vitória corretamente
  useEffect(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    if (matches === settings.pairs && matches > 0 && gameStarted && gameState === 'playing') {
      handleVictory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const newCards = cards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    setCards(newCards);

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1);
      checkMatch(newSelected);
    }
  };

  // Verificar par
  const checkMatch = (selected: string[]) => {
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
        setMaxCombo(prev => Math.max(prev, newCombo));

        if (newCombo === 5) {
          leoSpeak("Incrível! Combo de 5 acertos seguidos!");
          setShowConfetti(true);
          playSound('celebration');
          setTimeout(() => setShowConfetti(false), 3000);
        } else if (newCombo === 3) {
          leoSpeak("Muito bem! Combo de 3!");
        }

        const newMatches = matches + 1;
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

  // Lógica de vitória e progressão corrigida
  const handleVictory = () => {
    setIsTimerActive(false);
    playSound('victory');
    setShowConfetti(true);

    // Salvar recordes locais
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
          setDifficulty('medium');
          // reinicia o jogo no novo nível
          setTimeout(() => {
            initializeGame();
            // manter gameStarted falso até a primeira interação
            setGameStarted(false);
            setIsTimerActive(false);
          }, 100);
        });
      }, 600);
    } else if (difficulty === 'medium') {
      setTimeout(() => {
        leoSpeak("Incrível! Agora vamos para o modo difícil. Este é o último desafio deste mundo!", () => {
          setDifficulty('hard');
          setTimeout(() => {
            initializeGame();
            setGameStarted(false);
            setIsTimerActive(false);
          }, 100);
        });
      }, 600);
    } else {
      // Completou modo difícil - próximo mundo ou fim
      setTimeout(() => {
        if (currentWorldIndex < WORLD_ORDER.length - 1) {
          setShowTrophyExplosion(true);
          leoSpeak("Fantástico! Você completou todo o mundo! Vamos para o próximo desafio!", () => {
            setTimeout(() => {
              setShowTrophyExplosion(false);
              setCurrentWorldIndex(prev => prev + 1);
              setDifficulty('easy');
              setGameState('worldComplete');
            }, 300);
          });
        } else {
          // Completou todos os mundos
          leoSpeak("Isso aí amigão! Você é um verdadeiro mestre da memória! Completou todos os mundos!", () => {
            setGameState('gameComplete');
          });
        }
      }, 600);
    }

    setTimeout(() => setShowConfetti(false), 4000);
  };

  // Game Over
  const handleGameOver = () => {
    setIsTimerActive(false);

    leoSpeak("Que pena, o tempo acabou! Mas você fez um ótimo trabalho. Vamos tentar de novo?", () => {
      // Reinicia a mesma fase após 1.5 segundos
      setTimeout(() => {
        initializeGame();
        setTimeout(() => {
          setGameStarted(false);
          setIsTimerActive(false);
        }, 300);
      }, 1500);
    });
  };

  // Continuar para próximo mundo
  const handleContinueToNextWorld = () => {
    // garantir que worldIndex já foi atualizado
    const nextIndex = Math.min(currentWorldIndex, WORLD_ORDER.length - 1);
    setCurrentWorldIndex(nextIndex);
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
