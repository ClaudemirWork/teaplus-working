'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, Volume2, VolumeX, Save, Timer, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabaseClient';
import Image from 'next/image';
import confetti from 'canvas-confetti';

// Mundos em ordem de progressão
const WORLD_ORDER = ['starter', 'sports', 'fantasy', 'heroes', 'digital', 'multicultural'];

// Avatares REAIS E VERIFICADOS (baseados na lista fornecida)
const AVATAR_WORLDS = {
  starter: {
    name: 'Mundo Inicial',
    emoji: '🌟',
    avatars: [
      'Face_1', 'Face_4', 'Funny_1', 'Funny_4', 
      'Pet_2', 'Pet_4', 'Doctor_1', 'Cartoon_2',
      // Incluindo Leo e Mila no mundo inicial
      'mascotes/leo/leo_feliz_resultado', 'mascotes/mila/mila_joinha_resultado'
    ]
  },
  sports: {
    name: 'Arena dos Campeões',
    emoji: '⚽',
    avatars: [
      'Basquete_1', 'Basquete_2', 'Futebol_1', 'Futebol_4',
      'Chess_1', 'Chess_3', 'Player_16bits_2', 'Player_16bits_3',
      // Leo e Mila esportivos
      'mascotes/leo/leo_joinha_resultado', 'mascotes/mila/mila_apoio_resultado'
    ]
  },
  fantasy: {
    name: 'Reino Encantado',
    emoji: '🏰',
    avatars: [
      'Fada_2', 'Fada_4', 'princesa_1', 'princesa_2',
      'Guerreiro_2', 'Guerreiro_3', 'Manga_2', 'Manga_3',
      // Leo e Mila mágicos
      'mascotes/leo/leo_mago_resultado', 'mascotes/mila/mila_feiticeira_resultado'
    ]
  },
  heroes: {
    name: 'Liga dos Heróis',
    emoji: '🦸',
    avatars: [
      'Heroi_2', 'Heroi_4', 'Heroi_6', 'Heroi_8',
      'Fighting_2', 'Fighting_3', 'Futurista_2', 'Futurista_3',
      // Leo e Mila heróicos
      'mascotes/leo/leo_apontando_resultado', 'mascotes/mila/mila_forca_resultado'
    ]
  },
  digital: {
    name: 'Mundo Digital',
    emoji: '🎮',
    avatars: [
      'Minecraft_1', 'Minecraft_3', 'Roblox_2', 'Roblox_3',
      'Mascote PC_1', 'Mascote PC_3', 'Teenager_1', 'Teenager_2',
      // Leo e Mila digitais
      'mascotes/leo/leo_torre', 'mascotes/mila/mila_puzzle'
    ]
  },
  multicultural: {
    name: 'Aldeia Global',
    emoji: '🌍',
    avatars: [
      'menina_brasil_1', 'menino_brasil_2', 'menina_japao_3', 'menino_japao_2',
      'menina_indigena_2', 'menino_indigena_2', 'menina_chinesa_1', 'menino_chines_2',
      // Leo e Mila multiculturais
      'mascotes/leo/leo_boas_vindas_resultado', 'mascotes/mila/mila_boas_vindas_resultado'
    ]
  }
};

// Configurações de dificuldade
const DIFFICULTY_SETTINGS = {
  easy: { name: 'Fácil', pairs: 2, gridCols: 2, time: 60, emoji: '😊' },
  medium: { name: 'Médio', pairs: 3, gridCols: 3, time: 90, emoji: '🎯' },
  hard: { name: 'Difícil', pairs: 4, gridCols: 4, time: 120, emoji: '🔥' }
};

interface Card {
  id: string;
  avatar: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type Screen = 'title' | 'instructions' | 'game' | 'results';

export default function MemoryGame() {
  const router = useRouter();
  const supabase = createClient();
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioManagerRef = useRef<any>(null);

  // Estados SIMPLIFICADOS
  const [currentScreen, setCurrentScreen] = useState<Screen>('title');
  const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('easy');
  const [totalScore, setTotalScore] = useState(0);
  const [completedWorlds, setCompletedWorlds] = useState<number[]>([]);
  
  // Estados do jogo
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
  const [isReady, setIsReady] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Obter mundo atual
  const getCurrentWorld = () => WORLD_ORDER[currentWorldIndex];
  const getCurrentWorldData = () => AVATAR_WORLDS[getCurrentWorld() as keyof typeof AVATAR_WORLDS];

  // INICIALIZAÇÃO OTIMIZADA DO ÁUDIO (reduzindo delay)
  useEffect(() => {
    const initAudio = async () => {
      try {
        const enableAudio = () => {
          try {
            const { GameAudioManager } = require('@/utils/gameAudioManager');
            audioManagerRef.current = GameAudioManager.getInstance();
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            setIsReady(true);
            console.log('✅ Áudio inicializado com sucesso');
          } catch (err) {
            console.warn('⚠️ Erro na inicialização de áudio:', err);
            setIsReady(true);
          }
          document.removeEventListener('click', enableAudio);
          document.removeEventListener('touchstart', enableAudio);
        };
        
        document.addEventListener('click', enableAudio);
        document.addEventListener('touchstart', enableAudio);
        
        // TIMEOUT REDUZIDO - de 1000ms para 300ms
        setTimeout(() => {
          if (!isReady) {
            try {
              const { GameAudioManager } = require('@/utils/gameAudioManager');
              audioManagerRef.current = GameAudioManager.getInstance();
              audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
              setIsReady(true);
              console.log('✅ Áudio inicializado via fallback');
            } catch (err) {
              console.warn('⚠️ Erro na inicialização de áudio via fallback:', err);
              setIsReady(true);
            }
          }
        }, 300); // REDUZIDO!
      } catch (err) {
        console.warn('⚠️ Erro na inicialização de áudio:', err);
        setIsReady(true);
      }
    };
    
    initAudio();
  }, [isReady]);

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

  // Função CORRIGIDA para o Leo falar (sem "corrida de cavalos")
  const leoSpeak = useCallback((text: string, onEnd?: () => void) => {
    if (!isSoundOn || !audioManagerRef.current) {
      console.log('🔇 Áudio desativado, executando callback imediatamente');
      onEnd?.();
      return;
    }
    
    try {
      console.log('🎤 Leo falando:', text);
      // TIMEOUT MAIS GENEROSO - baseado no tamanho do texto
      const estimatedTime = Math.max(2000, text.length * 50); // ~50ms por caractere, mínimo 2s
      const timeout = setTimeout(() => {
        console.log('⏰ Timeout na fala do Leo, prosseguindo...');
        onEnd?.();
      }, estimatedTime);
      
      audioManagerRef.current.falarLeo(text, () => {
        clearTimeout(timeout);
        onEnd?.();
      });
    } catch (error) {
      console.error('❌ Erro ao chamar falarLeo:', error);
      onEnd?.();
    }
  }, [isSoundOn]);

  // FUNÇÃO PARA OBTER CAMINHO CORRETO DA IMAGEM
  const getImagePath = useCallback((avatar: string) => {
    if (avatar.startsWith('mascotes/')) {
      return `/images/${avatar}.webp`;
    }
    return `/images/avatares/${avatar}.webp`;
  }, []);

  // FUNÇÃO PRINCIPAL PARA CRIAR JOGO - AGORA COM AVATARES ÚNICOS GARANTIDOS
  const createGameWithConfig = useCallback((worldIndex: number, difficulty: Difficulty) => {
    console.log('🎮 === CRIANDO JOGO ===');
    console.log('Mundo:', worldIndex, 'Dificuldade:', difficulty);
    
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const worldKey = WORLD_ORDER[worldIndex];
    const world = AVATAR_WORLDS[worldKey as keyof typeof AVATAR_WORLDS];
    
    console.log('Settings:', settings);
    console.log('Mundo data:', world);
    
    if (!world) {
      console.error('❌ World not found:', worldKey);
      return [];
    }
    
    // GARANTIR AVATARES ÚNICOS - embaralhar e selecionar sem repetição
    const availableAvatars = [...world.avatars];
    
    if (availableAvatars.length < settings.pairs) {
      console.warn(`⚠️ Poucos avatares disponíveis! Mundo: ${world.name}, Disponíveis: ${availableAvatars.length}, Necessários: ${settings.pairs}`);
    }
    
    // Embaralhar e selecionar avatares únicos
    const shuffledAvatars = availableAvatars.sort(() => Math.random() - 0.5);
    const selectedAvatars = shuffledAvatars.slice(0, settings.pairs);
    
    // VERIFICAR SE TEMOS AVATARES ÚNICOS
    const uniqueAvatars = [...new Set(selectedAvatars)];
    if (uniqueAvatars.length !== selectedAvatars.length) {
      console.warn('⚠️ Avatares duplicados detectados! Removendo duplicatas...');
    }
    
    console.log('✅ Avatares selecionados (únicos):', uniqueAvatars);
    console.log('Pares necessários:', settings.pairs);
    
    // Criar pares com avatares únicos
    const gameCards: Card[] = [];
    uniqueAvatars.slice(0, settings.pairs).forEach((avatar, index) => {
      gameCards.push({
        id: `${difficulty}-${worldIndex}-${avatar}-1-${Date.now()}-${index}`,
        avatar,
        isFlipped: false,
        isMatched: false
      });
      gameCards.push({
        id: `${difficulty}-${worldIndex}-${avatar}-2-${Date.now()}-${index}`,
        avatar,
        isFlipped: false,
        isMatched: false
      });
    });
    
    // Embaralhar cartas finais
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    
    console.log('🃏 === CARTAS FINAIS ===');
    console.log('Total:', shuffledCards.length, 'Esperado:', settings.pairs * 2);
    console.log('Avatares únicos usados:', uniqueAvatars.length);
    console.log('Cartas:', shuffledCards.map(c => ({ id: c.id, avatar: c.avatar })));
    
    return shuffledCards;
  }, []);

  // FUNÇÃO PARA INICIALIZAR JOGO COMPLETO
  const initializeGameComplete = useCallback((worldIndex: number, difficulty: Difficulty, keepScore: boolean = false) => {
    console.log('🚀 INICIALIZANDO JOGO COMPLETO');
    console.log('Mundo:', worldIndex, 'Dificuldade:', difficulty, 'Manter Score:', keepScore);
    
    // Criar cartas
    const newCards = createGameWithConfig(worldIndex, difficulty);
    
    // Atualizar todos os estados
    setCurrentWorldIndex(worldIndex);
    setCurrentDifficulty(difficulty);
    setCards(newCards);
    setSelectedCards([]);
    setMoves(0);
    setMatches(0);
    setCombo(0);
    setTimeLeft(DIFFICULTY_SETTINGS[difficulty].time);
    setIsTimerActive(false);
    setGameStarted(false);
    setShowResults(false);
    
    if (!keepScore) {
      setScore(0);
    }
    
    console.log('✅ JOGO INICIALIZADO - Cartas criadas:', newCards.length);
  }, [createGameWithConfig]);

  // FUNÇÃO PARA INICIAR ATIVIDADE
  const startActivity = useCallback(() => {
    console.log('🚀 INICIANDO ATIVIDADE');
    initializeGameComplete(0, 'easy', false); // Começar do zero
    setGameStarted(true);
    setIsTimerActive(true);
    
    // FALA MAIS RÁPIDA COM FALLBACK
    leoSpeak("Bem-vindo ao Mundo Inicial! Vamos começar!");
  }, [initializeGameComplete, leoSpeak]);

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
    const settings = DIFFICULTY_SETTINGS[currentDifficulty];
    if (matches === settings.pairs && gameStarted && !showResults) {
      console.log('🏆 VITÓRIA DETECTADA!');
      handleVictory();
    }
  }, [matches, currentDifficulty, gameStarted, showResults]);

  // Clique na carta
  const handleCardClick = (cardId: string) => {
    if (selectedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
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
      // Par encontrado
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

  // VITÓRIA - AGORA TOTALMENTE SÍNCRONA
  const handleVictory = () => {
    console.log('🎊 PROCESSANDO VITÓRIA');
    
    setIsTimerActive(false);
    playSound('victory');
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTotalScore(prev => prev + score);
    
    // PROGRESSÃO SÍNCRONA OTIMIZADA
    if (currentDifficulty === 'easy') {
      console.log('📈 PROGREDINDO PARA MÉDIO');
      setTimeout(() => {
        leoSpeak("Parabéns! Agora vamos para o nível médio!", () => {
          initializeGameComplete(currentWorldIndex, 'medium', true);
          setGameStarted(true);
          setIsTimerActive(true);
        });
      }, 1500); // REDUZIDO de 2000 para 1500
    } else if (currentDifficulty === 'medium') {
      console.log('📈 PROGREDINDO PARA DIFÍCIL');
      setTimeout(() => {
        leoSpeak("Incrível! Agora vamos para o modo difícil!", () => {
          initializeGameComplete(currentWorldIndex, 'hard', true);
          setGameStarted(true);
          setIsTimerActive(true);
        });
      }, 1500);
    } else {
      // Completou mundo
      if (currentWorldIndex < WORLD_ORDER.length - 1) {
        console.log('🌍 PROGREDINDO PARA PRÓXIMO MUNDO');
        setCompletedWorlds(prev => [...prev, currentWorldIndex]);
        setTimeout(() => {
          leoSpeak("Fantástico! Vamos para o próximo mundo!", () => {
            initializeGameComplete(currentWorldIndex + 1, 'easy', true);
            setGameStarted(true);
            setIsTimerActive(true);
          });
        }, 1500);
      } else {
        console.log('🏁 JOGO COMPLETO');
        setCompletedWorlds(prev => [...prev, currentWorldIndex]);
        setTimeout(() => {
          leoSpeak("Você é um mestre da memória!", () => {
            setShowResults(true);
          });
        }, 1500);
      }
    }
  };

  // Game Over
  const handleGameOver = () => {
    setIsTimerActive(false);
    
    leoSpeak("Que pena, o tempo acabou! Vamos tentar de novo?", () => {
      setTimeout(() => {
        initializeGameComplete(currentWorldIndex, currentDifficulty, false);
        setGameStarted(true);
        setIsTimerActive(true);
      }, 1000);
    });
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
          pontuacao_final: totalScore,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!

🧠 Resultado do Jogo da Memória:
- Mundos Completados: ${completedWorlds.length}
- Pontuação Total: ${totalScore} pontos
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
    setCurrentWorldIndex(0);
    setCurrentDifficulty('easy');
    setTotalScore(0);
    setScore(0);
    setCompletedWorlds([]);
  };

  // Handler da tela inicial CORRIGIDO (Leo termina de falar antes de prosseguir)
  const handleStartIntro = async () => {
    if (isInteracting || !isReady) return;
    setIsInteracting(true);
    
    try {
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      if (audioManagerRef.current) {
        await audioManagerRef.current.forceInitialize();
      }

      // FRASE MAIS LONGA E NATURAL DO LEO
      leoSpeak("Eu sou o Léo, e vamos praticar o jogo da memória", () => {
        console.log('✅ Leo terminou de falar na tela inicial');
        // DELAY ADICIONAL para garantir que terminou
        setTimeout(() => {
          setIsInteracting(false);
          setCurrentScreen('instructions');
        }, 500); // Meio segundo extra de segurança
      });
      
      // Fallback de segurança - se Leo demorar muito, continuar após 8 segundos
      setTimeout(() => {
        if (isInteracting) {
          console.log('⏰ Fallback: Leo demorou muito, prosseguindo...');
          setIsInteracting(false);
          setCurrentScreen('instructions');
        }
      }, 8000);
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
      setIsInteracting(false);
      setCurrentScreen('instructions');
    }
  };

  // Toggle de áudio
  const toggleAudio = useCallback(() => {
    const enabled = audioManagerRef.current?.toggleAudio() ?? true;
    setIsSoundOn(enabled);
  }, []);

  // TELAS DO JOGO

  // Tela inicial
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
        <div className="mb-8 animate-bounce-slow">
          <Image 
            src="/images/mascotes/leo/leo_memoria.webp" 
            alt="Leo Memória" 
            width={400} 
            height={400} 
            className="w-[300px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl" 
            priority 
            style={{ 
              filter: 'drop-shadow(0 0 20px rgba(79, 70, 229, 0.3))',
            }}
          />
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
          Jogo da Memória
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-12 drop-shadow-md">
          Encontre todos os pares com Leo!
        </p>
        
        <button 
          onClick={handleStartIntro}
          disabled={!isReady || isInteracting}
          className="text-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full px-12 py-6 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1 hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {!isReady ? 'Carregando...' : (isInteracting ? 'Ouvindo Leo...' : 'Começar Aventura da Memória')}
        </button>
      </div>
    </div>
  );

  // Tela de instruções CORRIGIDA (sem "corrida de cavalos")
  const InstructionsScreen = () => {
    const [leoFalando, setLeoFalando] = useState(true);
    const [falaConcluida, setFalaConcluida] = useState(false);

    const instrucoes = [
      { emoji: '🃏', texto: "Clique nas cartas para virá-las!" },
      { emoji: '👯', texto: "Encontre os pares iguais!" },
      { emoji: '⏰', texto: "Corra contra o tempo!" },
      { emoji: '🔥', texto: "Faça combos para mais pontos!" }
    ];

    useEffect(() => {
      let cancelled = false;

      async function falarFrase(frase: string) {
        return new Promise<void>(resolve => {
          leoSpeak(frase, () => {
            console.log('✅ Frase concluída:', frase);
            resolve();
          });
        });
      }

      async function narrarInstrucoes() {
        setLeoFalando(true);
        
        for (const item of instrucoes) {
          if (cancelled) return;
          console.log('🎯 Iniciando frase:', item.texto);
          await falarFrase(item.texto);
          // DELAY ADEQUADO entre frases para evitar sobreposição
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo entre frases
        }
        
        if (!cancelled) {
          console.log('🏁 Todas as instruções concluídas');
          setFalaConcluida(true);
          setLeoFalando(false);
        }
      }

      narrarInstrucoes();

      // Fallback de segurança - se demorar mais que 20 segundos, liberar botão
      const fallbackTimer = setTimeout(() => {
        if (!falaConcluida) {
          console.log('⏰ Fallback: liberando botão após 20s');
          setFalaConcluida(true);
          setLeoFalando(false);
        }
      }, 20000);

      return () => { 
        cancelled = true;
        clearTimeout(fallbackTimer);
      };
    }, []);

    return (
      <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-300 via-indigo-300 to-blue-300">
        <div className="bg-white/95 rounded-3xl p-6 max-w-2xl w-full mx-4 shadow-2xl text-center backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6 text-indigo-600">Como Jogar</h2>
          
          <ul className="text-base text-gray-700 space-y-4 mb-6 text-left list-none">
            {instrucoes.map((item, idx) => (
              <li key={idx}>
                <span className="text-2xl mr-2">{item.emoji}</span>
                <span>{item.texto}</span>
              </li>
            ))}
          </ul>
          
          <button
            onClick={() => {
              setCurrentScreen('game');
              startActivity();
            }}
            disabled={!falaConcluida}
            className={`w-full text-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full py-4 shadow-xl
              hover:scale-105 transition-transform ${!falaConcluida ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {leoFalando ? "Aguarde o Leo terminar..." : "Vamos jogar! 🚀"}
          </button>
          
          {/* Indicador de progresso das instruções */}
          {leoFalando && (
            <div className="mt-4 text-sm text-gray-500">
              Leo está explicando as regras... 🎤
            </div>
          )}
        </div>
      </div>
    );
  };

  const GameScreen = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
        <header className="bg-white/90 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <button
                onClick={() => setCurrentScreen('title')}
                className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-1 font-medium text-sm">Voltar</span>
              </button>

              <h1 className="text-base sm:text-lg font-bold text-gray-800 text-center">
                {getCurrentWorldData().emoji} {getCurrentWorldData().name} - {DIFFICULTY_SETTINGS[currentDifficulty].name}
              </h1>

              <button
                onClick={toggleAudio}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-4 max-w-4xl mx-auto w-full">
          <div className="space-y-3">
            {/* Status do jogo */}
            {gameStarted && (
              <div className="bg-white/90 rounded-xl p-3 shadow-lg border border-purple-200">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <Target className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-xs text-gray-600">Pares</div>
                      <div className="font-bold text-purple-800">{matches}/{DIFFICULTY_SETTINGS[currentDifficulty].pairs}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-4 h-4 text-blue-600 flex items-center justify-center text-xs">🔄</div>
                    <div>
                      <div className="text-xs text-gray-600">Moves</div>
                      <div className="font-bold text-blue-800">{moves}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-4 h-4 text-yellow-500 flex items-center justify-center text-xs">⭐</div>
                    <div>
                      <div className="text-xs text-gray-600">Pontos</div>
                      <div className="font-bold text-yellow-600">{score}</div>
                    </div>
                  </div>
                  {combo > 1 && (
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-4 h-4 text-orange-500 flex items-center justify-center text-xs">🔥</div>
                      <div>
                        <div className="text-xs text-gray-600">Combo</div>
                        <div className="font-bold text-orange-500 animate-pulse">x{combo}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-1">
                    <Timer className={`w-4 h-4 ${timeLeft < 20 ? 'text-red-500' : 'text-green-600'}`} />
                    <div>
                      <div className="text-xs text-gray-600">Tempo</div>
                      <div className={`font-bold ${timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DEBUG INFO - removível em produção */}
            {process.env.NODE_ENV === 'development' && gameStarted && (
              <div className="bg-green-100 p-2 rounded text-xs">
                <div><strong>✅ DEBUG INFO:</strong></div>
                <div>Cartas: {cards.length} | Esperado: {DIFFICULTY_SETTINGS[currentDifficulty].pairs * 2}</div>
                <div>Dificuldade: {currentDifficulty} | Mundo: {currentWorldIndex}</div>
                <div>Avatares únicos: {[...new Set(cards.map(c => c.avatar))].length}</div>
              </div>
            )}

            {/* Grade de cartas */}
            {gameStarted && cards.length > 0 && (
              <div className="bg-white/30 backdrop-blur rounded-xl p-3">
                <div 
                  className="grid gap-2 max-w-lg mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${DIFFICULTY_SETTINGS[currentDifficulty].gridCols}, 1fr)`,
                  }}
                >
                  {cards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      disabled={card.isMatched}
                      className={`aspect-square rounded-lg shadow-lg transition-all duration-300 transform relative overflow-hidden ${
                        card.isMatched ? 'scale-95 opacity-75' : 'hover:scale-105 active:scale-95'
                      }`}
                      style={{ 
                        perspective: '1000px',
                      }}
                    >
                      <div 
                        className={`w-full h-full transition-transform duration-600 relative ${
                          card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                        }`}
                        style={{ 
                          transformStyle: 'preserve-3d',
                          transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        }}
                      >
                        {/* Verso da carta */}
                        <div 
                          className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex flex-col items-center justify-center text-white backface-hidden border-2 border-white/20"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <div className="text-lg mb-1">🧠</div>
                          <div className="text-xs font-bold">LudiTEA</div>
                        </div>
                        
                        {/* Frente da carta */}
                        <div 
                          className={`absolute inset-0 w-full h-full bg-white rounded-lg p-1 backface-hidden border-2 ${
                            card.isMatched ? 'border-green-400' : 'border-gray-200'
                          }`}
                          style={{ 
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)'
                          }}
                        >
                          <img
                            src={getImagePath(card.avatar)}
                            alt={`Avatar ${card.avatar}`}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              console.warn(`❌ Erro ao carregar: ${card.avatar}`);
                              console.warn(`🔧 Tentando carregar: ${getImagePath(card.avatar)}`);
                              // Fallback para Face_1 que sabemos que existe
                              target.src = '/images/avatares/Face_1.webp';
                            }}
                          />
                          {card.isMatched && (
                            <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded">
                              <span className="text-2xl animate-bounce">✅</span>
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
        </main>
      </div>
    );
  };

  const ResultsScreen = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl sm:text-6xl mb-4">
            {completedWorlds.length === WORLD_ORDER.length ? '👑' : '🏆'}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {completedWorlds.length === WORLD_ORDER.length ? 'MESTRE DA MEMÓRIA!' : 'Parabéns!'}
          </h3>
          <p className="text-sm text-gray-600">
            Mundos completados: {completedWorlds.length}/{WORLD_ORDER.length}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-800">{totalScore}</div>
            <div className="text-xs text-purple-600">Pontuação Total</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-orange-800">x{maxCombo}</div>
            <div className="text-xs text-orange-600">Combo Máximo</div>
          </div>
        </div>

        {/* Mundos completados */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="font-bold text-gray-800 mb-2 text-sm">🌍 Mundos Explorados:</h4>
          <div className="flex gap-1">
            {WORLD_ORDER.map((worldKey, index) => {
              const world = AVATAR_WORLDS[worldKey as keyof typeof AVATAR_WORLDS];
              return (
                <div
                  key={worldKey}
                  className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-bold ${
                    completedWorlds.includes(index) ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {world.emoji}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={voltarInicio}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 text-sm"
          >
            🔄 Jogar Novamente
          </button>
          
          <button
            onClick={handleSaveSession}
            disabled={salvando}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
              !salvando
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save size={16} />
            <span>{salvando ? 'Salvando...' : 'Salvar Sessão'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Efeito para detectar quando mostrar resultados
  useEffect(() => {
    if (showResults) {
      setCurrentScreen('results');
    }
  }, [showResults]);

  // Renderização condicional das telas
  if (currentScreen === 'title') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  if (currentScreen === 'game') return <GameScreen />;
  if (currentScreen === 'results') return <ResultsScreen />;
  
  return null;
}
