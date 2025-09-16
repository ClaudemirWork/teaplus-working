'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, Volume2, VolumeX, Save, Star, Trophy, Timer, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabaseClient'; // <-- CORREÇÃO REALIZADA AQUI
import Image from 'next/image';
import confetti from 'canvas-confetti';

// Avatares organizados por mundo/categoria
const AVATAR_WORLDS = {
  starter: {
    name: 'Mundo Inicial',
    emoji: '🌟',
    avatars: [
      'Cartoon_2', 'Funny_1', 'Funny_4', 'Face_1', 'Face_4', 'Pet_2'
    ]
  },
  sports: {
    name: 'Arena dos Campeões',
    emoji: '⚽',
    avatars: [
      'Basquete_1', 'Basquete_2', 'Futebol_1', 'Futebol_4', 'Chess_1', 'Chess_3'
    ]
  },
  fantasy: {
    name: 'Reino Encantado',
    emoji: '🏰',
    avatars: [
      'Fada_2', 'Fada_4', 'princesa_1', 'princesa_2', 'Guerreiro_2', 'Guerreiro_3'
    ]
  },
  heroes: {
    name: 'Liga dos Heróis',
    emoji: '🦸',
    avatars: [
      'Heroi_2', 'Heroi_4', 'Heroi_6', 'Heroi_8', 'Fighting_2', 'Fighting_3'
    ]
  },
  digital: {
    name: 'Mundo Digital',
    emoji: '🎮',
    avatars: [
      'Minecraft_1', 'Minecraft_3', 'Roblox_2', 'Roblox_3', 'Player_16bits_2', 'Player_16bits_3'
    ]
  },
  multicultural: {
    name: 'Aldeia Global',
    emoji: '🌍',
    avatars: [
      'menina_brasil_1', 'menino_brasil_2', 'menina_japao_3', 'menino_japao_2', 
      'menina_indigena_2', 'menino_indigena_2'
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
    emoji: '🔥'
  }
};

interface Card {
  id: string;
  avatar: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';

export default function MemoryGame() {
  const router = useRouter();
  const supabase = createClient();
  const audioContextRef = useRef<AudioContext | null>(null);

  // NOVO: Controle de telas
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
  
  // Estados salvos (para mostrar na tela inicial)
  const [totalPairsFound, setTotalPairsFound] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  
  // Estados do jogo
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
  const [gameStarted, setGameStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  useEffect(() => {
    const savedPairs = localStorage.getItem('memoryGame_totalPairs');
    const savedBest = localStorage.getItem('memoryGame_bestScore');
    
    if (savedPairs) setTotalPairsFound(parseInt(savedPairs));
    if (savedBest) setBestScore(parseInt(savedBest));
  }, []);

  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    document.addEventListener('click', initAudio, { once: true });
    return () => {
      document.removeEventListener('click', initAudio);
      audioContextRef.current?.close();
    };
  }, []);

  // Função para criar e tocar sons
  const playSound = useCallback((type: 'flip' | 'match' | 'error' | 'victory') => {
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
    }
  }, [isSoundOn]);

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
    setGameStarted(false);
    setShowResults(false);
  }, [difficulty, currentWorld]);

  const startActivity = () => {
    setCurrentScreen('game');
    initializeGame();
  };

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && gameStarted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameStarted) {
      handleGameOver();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTimerActive, timeLeft, gameStarted]);

  // Verificar vitória
  useEffect(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    if (matches === settings.pairs && gameStarted && !showResults) {
      handleVictory();
    }
  }, [matches, difficulty, gameStarted, showResults]);

  // Lidar com clique na carta
  const handleCardClick = (cardId: string) => {
    if (selectedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    // Iniciar timer no primeiro clique
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
      }, 1000);
    }
  };

  // Vitória
  const handleVictory = () => {
    setIsTimerActive(false);
    setShowResults(true);
    
    playSound('victory');
    
    // Salvar recordes
    const newPairs = totalPairsFound + matches;
    setTotalPairsFound(newPairs);
    localStorage.setItem('memoryGame_totalPairs', newPairs.toString());
    
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('memoryGame_bestScore', score.toString());
    }
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Game Over
  const handleGameOver = () => {
    setIsTimerActive(false);
    setShowResults(true);
    
    // Salvar recordes mesmo em game over
    const newPairs = totalPairsFound + matches;
    setTotalPairsFound(newPairs);
    localStorage.setItem('memoryGame_totalPairs', newPairs.toString());
    
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('memoryGame_bestScore', score.toString());
    }
  };

  const handleSaveSession = async () => {
    setSalvando(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Erro ao obter usuário:', userError);
        alert('Erro: Sessão expirada. Por favor, faça login novamente.');
        router.push('/login');
        return;
      }
      
      const { error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Jogo da Memória',
          pontuacao_final: score,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!

🧠 Resultado do Jogo da Memória:
- Mundo: ${AVATAR_WORLDS[currentWorld as keyof typeof AVATAR_WORLDS].name}
- Dificuldade: ${DIFFICULTY_SETTINGS[difficulty].name}
- Pares Encontrados: ${matches}/${DIFFICULTY_SETTINGS[difficulty].pairs}
- Pontuação: ${score} pontos
- Combo Máximo: ${maxCombo}x`);
        
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error);
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  };

  const voltarInicio = () => {
    setCurrentScreen('title');
    setShowResults(false);
    setGameStarted(false);
    setCards([]);
    setSelectedCards([]);
  };

  // TELAS DO JOGO
  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-indigo-300 via-purple-400 to-pink-400 overflow-hidden">
      {/* Partículas de memória no fundo */}
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
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 animate-bounce-slow">
          <Image 
            src="/images/mascotes/leo/leo_memoria.webp" 
            alt="Leo Memória" 
            width={400} 
            height={400} 
            className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl" 
            priority 
            style={{ 
              filter: 'drop-shadow(0 0 20px rgba(79, 70, 229, 0.3))',
            }}
          />
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-2">
          Jogo da Memória
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-6 drop-shadow-md">
          Encontre todos os pares com Leo!
        </p>
        
        {/* Mostra estatísticas na tela inicial */}
        {(totalPairsFound > 0 || bestScore > 0) && (
          <div className="bg-white/90 rounded-2xl p-6 mb-6 shadow-xl backdrop-blur-sm border border-purple-200">
            <div className="flex items-center gap-6">
              {totalPairsFound > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                  <span className="font-bold text-purple-800">{totalPairsFound} pares</span>
                </div>
              )}
              {bestScore > 0 && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <span className="font-bold text-purple-800">Recorde: {bestScore}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setCurrentScreen('instructions')} 
          className="text-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1 hover:shadow-2xl"
        >
          Começar Aventura da Memória
        </button>
      </div>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-300 via-indigo-300 to-blue-300">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center backdrop-blur-sm">
        <h2 className="text-4xl font-bold mb-6 text-indigo-600">Como Jogar</h2>
        <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
          <p className="flex items-center gap-4">
            <span className="text-4xl">🃏</span>
            <span><b>Clique nas cartas</b> para virá-las e revelar os avatares!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">👯</span>
            <span><b>Encontre os pares</b> - duas cartas com o mesmo avatar!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">⏰</span>
            <span><b>Corra contra o tempo</b> para encontrar todos os pares!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🔥</span>
            <span><b>Faça combos</b> encontrando pares consecutivos para mais pontos!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🌍</span>
            <span><b>Explore diferentes mundos</b> com avatares únicos!</span>
          </p>
        </div>
        
        <button 
          onClick={startActivity} 
          className="w-full text-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform"
        >
          Vamos Jogar!
        </button>
      </div>
    </div>
  );

  const GameScreen = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
        <header className="bg-white/90 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setCurrentScreen('title')}
                className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
              </button>

              <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center">
                Jogo da Memória
              </h1>

              {showResults ? (
                <button
                  onClick={handleSaveSession}
                  disabled={salvando}
                  className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${
                    !salvando
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save size={18} />
                  <span className="hidden sm:inline">{salvando ? 'Salvando...' : 'Salvar'}</span>
                </button>
              ) : (
                <div className="w-24"></div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {!showResults ? (
            <div className="space-y-4">
              {/* Configurações do jogo */}
              {!gameStarted && (
                <div className="bg-white/90 rounded-2xl p-4 shadow-xl border border-purple-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Seleção de Mundo */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Escolha o Mundo:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(AVATAR_WORLDS).map(([key, world]) => (
                          <button
                            key={key}
                            onClick={() => setCurrentWorld(key)}
                            className={`p-3 rounded-xl text-sm font-medium transition-all ${
                              currentWorld === key
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white scale-105'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <div className="text-lg mb-1">{world.emoji}</div>
                            <div className="text-xs">{world.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Seleção de Dificuldade */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Dificuldade:</h3>
                      <div className="space-y-2">
                        {(['easy', 'medium', 'hard'] as const).map(level => (
                          <button
                            key={level}
                            onClick={() => setDifficulty(level)}
                            className={`w-full p-3 rounded-xl font-medium transition-all flex items-center justify-between ${
                              difficulty === level
                                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white scale-105'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <span>{DIFFICULTY_SETTINGS[level].emoji} {DIFFICULTY_SETTINGS[level].name}</span>
                            <span className="text-sm">{DIFFICULTY_SETTINGS[level].pairs} pares</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => {
                        initializeGame();
                        setGameStarted(true);
                        setIsTimerActive(true);
                      }}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-lg font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                      Começar Jogo!
                    </button>
                  </div>
                </div>
              )}

              {/* Status do jogo */}
              {gameStarted && (
                <div className="bg-white/90 rounded-2xl p-3 md:p-4 shadow-xl border border-purple-200">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 text-center">
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
                        <div className="font-bold text-yellow-600">{score}</div>
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

                  {/* Botão de som */}
                  <div className="mt-3 flex justify-center">
                    <button 
                      onClick={() => setIsSoundOn(!isSoundOn)} 
                      className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Grade de cartas */}
              {gameStarted && (
                <div className="bg-white/30 backdrop-blur rounded-2xl p-4">
                  <div 
                    className="grid gap-3 max-w-2xl mx-auto"
                    style={{
                      gridTemplateColumns: `repeat(${DIFFICULTY_SETTINGS[difficulty].gridCols}, 1fr)`,
                    }}
                  >
                    {cards.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        disabled={card.isMatched}
                        className={`aspect-square rounded-xl shadow-lg transition-all duration-300 transform relative overflow-hidden ${
                          card.isMatched ? 'scale-95 opacity-75' : 'hover:scale-105 active:scale-95'
                        }`}
                        style={{ 
                          perspective: '1000px',
                        }}
                      >
                        <div 
                          className={`w-full h-full transition-transform duration-600 relative preserve-3d ${
                            card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                          }`}
                          style={{ 
                            transformStyle: 'preserve-3d',
                            transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)'
                          }}
                        >
                          {/* Verso da carta */}
                          <div 
                            className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex flex-col items-center justify-center text-white backface-hidden border-2 border-white/20"
                            style={{ backfaceVisibility: 'hidden' }}
                          >
                            <div className="text-2xl mb-1">🧠</div>
                            <div className="text-xs font-bold">LudiTEA</div>
                          </div>
                          
                          {/* Frente da carta */}
                          <div 
                            className={`absolute inset-0 w-full h-full bg-white rounded-xl p-1 rotate-y-180 backface-hidden border-2 ${
                              card.isMatched ? 'border-green-400' : 'border-gray-200'
                            }`}
                            style={{ 
                              backfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)'
                            }}
                          >
                            <img
                              src={`/images/avatares/${card.avatar}.webp`}
                              alt="Avatar"
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/avatares/Face_1.webp';
                              }}
                            />
                            {card.isMatched && (
                              <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg">
                                <span className="text-3xl animate-bounce">✅</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Tela de resultados
            <div className="bg-white/95 rounded-xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm border border-purple-200">
              <div className="text-center mb-6">
                <div className="text-5xl sm:text-6xl mb-4 animate-bounce">
                  {timeLeft > 0 && matches === DIFFICULTY_SETTINGS[difficulty].pairs ? '🏆' : 
                  timeLeft > 0 ? '🎯' : '⏰'}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  {timeLeft > 0 && matches === DIFFICULTY_SETTINGS[difficulty].pairs ? 'Parabéns! Você venceu!' : 
                  timeLeft > 0 ? 'Boa tentativa!' : 'Tempo Esgotado!'}
                </h3>
                
                <p className="text-lg text-indigo-600 font-medium">
                  Mundo: {AVATAR_WORLDS[currentWorld as keyof typeof AVATAR_WORLDS].name} • 
                  Dificuldade: {DIFFICULTY_SETTINGS[difficulty].name}
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-purple-800">
                    {score}
                  </div>
                  <div className="text-xs text-purple-600">Pontuação</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-green-800">
                    {matches}/{DIFFICULTY_SETTINGS[difficulty].pairs}
                  </div>
                  <div className="text-xs text-green-600">Pares</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-blue-800">
                    {moves}
                  </div>
                  <div className="text-xs text-blue-600">Movimentos</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-orange-800">
                    x{maxCombo}
                  </div>
                  <div className="text-xs text-orange-600">Combo Máx</div>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">📊 Desempenho:</h4>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3].map(star => (
                    <span
                      key={star}
                      className="text-3xl"
                    >
                      {star <= Math.min(3, Math.ceil(score / 300)) ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    initializeGame();
                    setShowResults(false);
                    setGameStarted(true);
                    setIsTimerActive(true);
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  🔄 Jogar Novamente
                </button>
                
                <button
                  onClick={voltarInicio}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  🏠 Menu Principal
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  // Renderização condicional das telas
  if (currentScreen === 'title') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
}

// CSS customizado para animações 3D
const customStyles = `
  .preserve-3d {
    transform-style: preserve-3d;
  }
  
  .backface-hidden {
    backface-visibility: hidden;
  }
  
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  
  @keyframes bounce-slow {
    0%, 100% { 
      transform: translateY(0);
    }
    50% { 
      transform: translateY(-20px);
    }
  }
  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }
`;
