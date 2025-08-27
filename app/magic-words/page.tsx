'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Interfaces ---
interface Card {
  id: string;
  label: string;
  image: string;
  category: string;
}

interface Phase {
  cards: number;
  rounds: number;
  name: string;
}

// --- BANCO DE CARDS COM IMAGENS REAIS ---
const allCardsData: Card[] = [
  // Rotinas - Cards mais comuns
  { id: 'ontem', label: 'Ontem', image: '/images/cards/rotinas/Ontem.webp', category: 'rotinas' },
  { id: 'hoje', label: 'Hoje', image: '/images/cards/rotinas/hoje.webp', category: 'rotinas' },
  { id: 'amanha', label: 'Amanhã', image: '/images/cards/rotinas/amanha.webp', category: 'rotinas' },
  { id: 'sem_escola_hoje', label: 'Sem Escola Hoje', image: '/images/cards/rotinas/sem_escola_hoje_resultado.webp', category: 'rotinas' },
  { id: 'manha', label: 'Manhã', image: '/images/cards/rotinas/manha.webp', category: 'rotinas' },
  { id: 'tarde', label: 'Tarde', image: '/images/cards/rotinas/Tarde.webp', category: 'rotinas' },
  { id: 'noite', label: 'Noite', image: '/images/cards/rotinas/noite.webp', category: 'rotinas' },
  
  // Alimentos
  { id: 'macarrao_bologhesa', label: 'Macarrão Bolonhesa', image: '/images/cards/alimentos/macarrao_bologhesa.webp', category: 'alimentos' },
  { id: 'suco_laranja', label: 'Suco de Laranja', image: '/images/cards/alimentos/suco_laranja.webp', category: 'alimentos' },
  { id: 'pizza', label: 'Pizza', image: '/images/cards/alimentos/pizza.webp', category: 'alimentos' },
  { id: 'sanduiche', label: 'Sanduíche', image: '/images/cards/alimentos/sanduiche.webp', category: 'alimentos' },
  
  // Core  
  { id: 'agora', label: 'Agora', image: '/images/cards/core/agora.webp', category: 'core' },
  { id: 'pare', label: 'Pare', image: '/images/cards/core/pare.webp', category: 'core' },
  { id: 'sim', label: 'Sim', image: '/images/cards/core/sim.webp', category: 'core' },
  { id: 'nao', label: 'Não', image: '/images/cards/core/não.webp', category: 'core' },
  
  // Animais
  { id: 'cisne', label: 'Cisne', image: '/images/cards/animais/cisne.webp', category: 'animais' },
  { id: 'sapo', label: 'Sapo', image: '/images/cards/animais/sapo.webp', category: 'animais' },
  { id: 'gato', label: 'Gato', image: '/images/cards/animais/gato.webp', category: 'animais' },
  { id: 'cachorro', label: 'Cachorro', image: '/images/cards/animais/cachorro.webp', category: 'animais' },
  
  // Ações
  { id: 'saltar', label: 'Saltar', image: '/images/cards/acoes/saltar.webp', category: 'acoes' },
  { id: 'sentar', label: 'Sentar', image: '/images/cards/acoes/sentar.webp', category: 'acoes' },
  { id: 'caminhar', label: 'Caminhar', image: '/images/cards/acoes/caminhar.webp', category: 'acoes' },
  { id: 'correr', label: 'Correr', image: '/images/cards/acoes/correr.webp', category: 'acoes' },
  { id: 'dormir', label: 'Dormir', image: '/images/cards/acoes/dormir.webp', category: 'acoes' },
  { id: 'comer', label: 'Comer', image: '/images/cards/acoes/comer.webp', category: 'acoes' },
  { id: 'beber', label: 'Beber', image: '/images/cards/acoes/beber.webp', category: 'acoes' },
  { id: 'olhar_espelho', label: 'Olhando no Espelho', image: '/images/cards/acoes/olhando_espelho.webp', category: 'acoes' },
  { id: 'tocar', label: 'Tocar', image: '/images/cards/acoes/tocar.webp', category: 'acoes' },
  
  // Casa
  { id: 'mesa', label: 'Mesa', image: '/images/cards/casa/mesa.webp', category: 'casa' },
  { id: 'copo', label: 'Copo', image: '/images/cards/casa/copo.webp', category: 'casa' },
  { id: 'prato', label: 'Prato', image: '/images/cards/casa/prato.webp', category: 'casa' },
  
  // Escola
  { id: 'lapis', label: 'Lápis', image: '/images/cards/escola/lapis.webp', category: 'escola' },
  { id: 'livro', label: 'Livro', image: '/images/cards/escola/livro.webp', category: 'escola' },
  { id: 'caderno', label: 'Caderno', image: '/images/cards/escola/caderno.webp', category: 'escola' },
];

// --- Configuração do Jogo ---
const gameConfig = {
  phases: [
    { cards: 4, rounds: 5, name: "Tradutor Iniciante" },
    { cards: 6, rounds: 6, name: "Intérprete Aprendiz" },
    { cards: 8, rounds: 7, name: "Mestre dos Gestos" },
    { cards: 10, rounds: 8, name: "Feiticeiro das Palavras" }
  ] as Phase[],
  cards: allCardsData,
  npcNames: ['Maria', 'João', 'Ana', 'Lucas', 'Sofia', 'Pedro']
};

export default function MagicWordsGame() {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- Estados ---
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUiBlocked, setIsUiBlocked] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const [correctCard, setCorrectCard] = useState<Card | null>(null);
  const [npcName, setNpcName] = useState('Maria');
  const [cardFeedback, setCardFeedback] = useState<{ [key: string]: 'correct' | 'wrong' }>({});

  const [milaMessage, setMilaMessage] = useState("");
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // --- Mensagens ---
  const milaMessages = {
    intro: "Olá! Sou a Mila, a Feiticeira. Vamos descobrir o que as pessoas querem?",
    start: "Vamos começar! Preste atenção no que eu vou pedir.",
    nextRound: ["Observe com atenção!", "Qual card nosso amigo quer?", "Você consegue encontrar!"],
    correct: ["Isso mesmo! 🎉", "Você encontrou! ⭐", "Excelente! 🌟", "Continue assim! 💪"],
    error: "Ops, não foi esse. Mas não desista! ❤️",
    phaseComplete: (phaseName: string) => `Uau! Você completou a fase ${phaseName}! Ganhou uma Gema Mágica! ✨`,
    gameOver: "Não foi dessa vez, mas você foi incrível! Vamos tentar de novo? 😊"
  };

  useEffect(() => {
    if (!isPlaying && milaMessage === "") {
      milaSpeak(milaMessages.intro);
    }
  }, [isPlaying, milaMessage]);

  // --- Áudio ---
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
  
  // --- Funções ---
  const milaSpeak = useCallback((message: string) => {
    setMilaMessage(message);
    if (isSoundOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.replace(/[🎉⭐🌟💪✨❤️😊🤔]/g, ''));
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, [isSoundOn]);

  const playSound = useCallback((type: 'correct' | 'wrong' | 'start' | 'win') => {
    if (!isSoundOn || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    
    const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    if (type === 'correct') {
      playNote(523.25, now, 0.15);
      playNote(659.25, now + 0.15, 0.2);
    } else if (type === 'wrong') {
      playNote(164.81, now, 0.2);
      playNote(155.56, now + 0.2, 0.2);
    } else if (type === 'win') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            playNote(freq, now + i * 0.1, 0.15);
        });
    }
  }, [isSoundOn]);
  
  const startGame = useCallback(() => {
    setCurrentPhaseIndex(0);
    setScore(0);
    setRoundsCompleted(0);
    setLives(3);
    setIsPlaying(true);
    setShowGameOverModal(false);
    setShowVictoryModal(false);
    milaSpeak(milaMessages.start);
    setTimeout(() => nextRound(0), 2000);
  }, [milaSpeak]);

  const nextRound = useCallback((phaseIdx: number) => {
    setIsUiBlocked(true);
    const currentPhaseConfig = gameConfig.phases[phaseIdx];
    
    if (!currentPhaseConfig) return;

    const shuffledDeck = [...gameConfig.cards].sort(() => 0.5 - Math.random());
    
    const correct = shuffledDeck[0];
    const distractors = shuffledDeck.slice(1, currentPhaseConfig.cards);
    
    const roundCards = [correct, ...distractors].sort(() => 0.5 - Math.random());
    
    setCorrectCard(correct);
    setCurrentCards(roundCards);
    setCardFeedback({});
    
    const randomNpcName = gameConfig.npcNames[Math.floor(Math.random() * gameConfig.npcNames.length)];
    setNpcName(randomNpcName);

    setTimeout(() => {
        if(correct) {
            milaSpeak(`${randomNpcName} quer o card que mostra... '${correct.label}'. Você consegue encontrar?`);
        }
        setIsUiBlocked(false);
    }, 1200);

  }, [milaSpeak]);

  const handleCardClick = (card: Card) => {
    if (isUiBlocked || !isPlaying) return;
    setIsUiBlocked(true);

    if (card.id === correctCard?.id) {
      setScore(prev => prev + 100);
      setCardFeedback({ [card.id]: 'correct' });
      playSound('correct');
      const randomMessage = milaMessages.correct[Math.floor(Math.random() * milaMessages.correct.length)];
      milaSpeak(randomMessage);
      
      const newRoundsCompleted = roundsCompleted + 1;
      setRoundsCompleted(newRoundsCompleted);

      setTimeout(() => {
        const phase = gameConfig.phases[currentPhaseIndex];
        if (phase && newRoundsCompleted >= phase.rounds) {
          handlePhaseComplete();
        } else {
          nextRound(currentPhaseIndex);
        }
      }, 2000);

    } else {
      setLives(prev => prev - 1);
      setCardFeedback({ [card.id]: 'wrong', [correctCard!.id]: 'correct' });
      playSound('wrong');
      milaSpeak(milaMessages.error);
      
      const newLives = lives - 1;
      if (newLives <= 0) {
        setTimeout(() => {
          setIsPlaying(false);
          setShowGameOverModal(true);
          milaSpeak(milaMessages.gameOver);
        }, 2000);
      } else {
        setTimeout(() => {
          nextRound(currentPhaseIndex);
        }, 2500);
      }
    }
  };

  const handlePhaseComplete = () => {
    const phase = gameConfig.phases[currentPhaseIndex];
    playSound('win');
    setScore(prev => prev + 250);
    if(phase) {
        milaSpeak(milaMessages.phaseComplete(phase.name));
    }
    setShowVictoryModal(true);
  };
  
  const nextPhase = useCallback(() => {
    const newPhaseIndex = currentPhaseIndex + 1;
    setShowVictoryModal(false);
    
    if (newPhaseIndex >= gameConfig.phases.length) {
      milaSpeak("Parabéns! Você completou todas as fases! 🎉");
      setIsPlaying(false);
    } else {
      setCurrentPhaseIndex(newPhaseIndex);
      setRoundsCompleted(0);
      setLives(3);
      setTimeout(() => nextRound(newPhaseIndex), 1000);
    }
  }, [currentPhaseIndex, nextRound, milaSpeak]);

  const phase = gameConfig.phases[currentPhaseIndex];
  const progress = phase ? (roundsCompleted / phase.rounds) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-violet-200 to-pink-200 text-gray-800 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto p-2 md:p-4">
        <div className="bg-white/90 rounded-2xl md:rounded-3xl p-3 md:p-4 mb-4 md:mb-6 shadow-xl border-2 md:border-3 border-pink-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
              <button
                onClick={() => router.push('/')}
                className="p-1.5 md:p-2 hover:bg-pink-100 rounded-lg md:rounded-xl transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
              </button>
              <h1 className="text-lg md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">
                ✨ Palavras Mágicas ✨
              </h1>
            </div>
            
            <div className="flex gap-2 md:gap-3">
              <div className="bg-gradient-to-br from-red-400 to-pink-400 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl shadow-lg">
                <div className="text-[10px] md:text-xs">Vidas</div>
                <div className="text-base md:text-xl font-bold">{'❤️'.repeat(lives)}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl shadow-lg">
                <div className="text-[10px] md:text-xs">Pontos</div>
                <div className="text-base md:text-xl font-bold">{score}</div>
              </div>
              <button onClick={() => setIsSoundOn(!isSoundOn)} className="p-1.5 md:p-2 hover:bg-pink-100 rounded-xl transition-colors">
                {isSoundOn ? <Volume2 className="w-5 h-5 md:w-6 md:h-6" /> : <VolumeX className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Área do jogo */}
        {isPlaying && phase ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl md:shadow-2xl border-2 md:border-3 border-violet-200">
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-base md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
                🌟 Fase {currentPhaseIndex + 1}: {phase.name} 🌟
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-6 md:h-8 overflow-hidden border md:border-2 border-gray-300">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-sky-400 flex items-center justify-center text-white text-sm md:text-base font-bold transition-all duration-500"
                  style={{ width: `${progress}%` }}
                >
                  {roundsCompleted}/{phase.rounds}
                </div>
              </div>
            </div>

            {/* NPC */}
            <div className="flex justify-center my-4 md:my-6">
              <div className="bg-white p-3 md:p-4 rounded-2xl shadow-md text-center border-2 border-pink-200">
                <div className="text-4xl md:text-6xl animate-bounce">🤔</div>
                <p className="font-bold mt-1 md:mt-2 text-sm md:text-lg">{npcName}</p>
              </div>
            </div>

            {/* Grid de cards com imagens reais */}
            <div className={`
              grid gap-2 md:gap-4 transition-opacity duration-500 
              ${isUiBlocked ? 'opacity-50' : 'opacity-100'}
              ${phase.cards <= 4 ? 'grid-cols-2' : ''}
              ${phase.cards === 6 ? 'grid-cols-2 sm:grid-cols-3' : ''}
              ${phase.cards === 8 ? 'grid-cols-2 sm:grid-cols-4' : ''}
              ${phase.cards >= 10 ? 'grid-cols-2 sm:grid-cols-5' : ''}
            `}>
              {currentCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  disabled={isUiBlocked}
                  className={`
                    p-2 md:p-3 bg-white rounded-xl md:rounded-2xl shadow-lg border-4 transition-all duration-300 transform 
                    ${isUiBlocked ? 'cursor-wait' : 'hover:scale-105 hover:shadow-xl active:scale-95'}
                    ${cardFeedback[card.id] === 'correct' ? 'border-green-400 scale-110 animate-pulse' : ''}
                    ${cardFeedback[card.id] === 'wrong' ? 'border-red-400 animate-shake' : ''}
                    ${!cardFeedback[card.id] ? 'border-violet-200' : ''}
                  `}
                >
                  <img 
                    src={card.image} 
                    alt={card.label}
                    className="w-full h-auto aspect-square object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'aspect-square bg-gradient-to-br from-violet-100 to-pink-100 rounded-lg flex items-center justify-center';
                        fallback.innerHTML = `
                          <span class="text-3xl md:text-5xl">
                            ${card.category === 'animais' ? '🐾' : 
                              card.category === 'acoes' ? '👋' : 
                              card.category === 'alimentos' ? '🍎' : 
                              card.category === 'rotinas' ? '⏰' : 
                              card.category === 'core' ? '💬' : '📦'}
                          </span>
                        `;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  <p className="mt-1 md:mt-2 text-center font-bold text-xs md:text-sm">{card.label}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-6 md:p-8 bg-white/90 rounded-3xl mt-8 animate-fade-in">
            <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500 mb-4">
              Bem-vindo!
            </h2>
            <p className="text-base md:text-lg mb-6 md:mb-8">Ajude a Mila a entender o que as pessoas querem dizer.</p>
            <button
              onClick={startGame}
              className="px-8 py-3 md:px-12 md:py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg md:text-2xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              🚀 Começar a Jogar
            </button>
          </div>
        )}
      </div>

      {/* Mila no Desktop - Fixed no canto inferior esquerdo com balão acima */}
      <div className="hidden md:block fixed bottom-0 left-0 z-50 pointer-events-none">
        <div className="relative">
          {/* Mila */}
          <div className="relative w-48 h-48 ml-4 mb-2">
            <img 
              src="/images/mascotes/mila/mila_feiticeira_resultado.webp"
              alt="Mila Feiticeira"
              className="w-full h-full object-contain drop-shadow-2xl pointer-events-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl animate-bounce';
                  fallback.innerHTML = '<span class="text-5xl">🧙‍♀️</span>';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          
          {/* Balão de fala ACIMA da Mila */}
          {milaMessage && (
            <div className="absolute bottom-full mb-4 left-8 bg-white p-4 rounded-2xl shadow-2xl min-w-[250px] max-w-[350px] border-3 border-violet-400 pointer-events-auto">
              <div className="absolute bottom-[-10px] left-12 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white" />
              <p className="text-gray-800 text-base font-semibold text-center">
                {milaMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mila no Mobile - No final do conteúdo, não fixa */}
      <div className="md:hidden relative mt-4 px-3 pb-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32">
              <img 
                src="/images/mascotes/mila/mila_feiticeira_resultado.webp"
                alt="Mila Feiticeira"
                className="w-full h-full object-contain drop-shadow-xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-28 h-28 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-xl animate-bounce';
                    fallback.innerHTML = '<span class="text-4xl">🧙‍♀️</span>';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          </div>
          
          {/* Balão mobile */}
          {milaMessage && (
            <div className="mt-3 bg-white p-3 rounded-2xl shadow-lg w-full max-w-xs border-2 border-violet-400">
              <p className="text-gray-800 text-sm font-semibold text-center">
                {milaMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      {showVictoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full transform animate-bounce border-4 border-yellow-400 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-4">
              🎉 Fase Completa! 🎉
            </h2>
            <p className="text-base md:text-xl text-gray-700 mb-4">
              Você ganhou uma Gema Mágica e +250 pontos!
            </p>
            <button 
              onClick={nextPhase} 
              className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-base md:text-lg rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              {currentPhaseIndex + 1 >= gameConfig.phases.length ? '🏆 Concluído!' : '🚀 Próxima Fase'}
            </button>
          </div>
        </div>
      )}
      
      {showGameOverModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full transform animate-bounce border-4 border-red-400 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-red-500 mb-4">😢 Fim de Jogo</h2>
            <p className="text-base md:text-xl text-gray-700 mb-2">
              Pontuação: <span className="font-bold text-violet-600">{score}</span>
            </p>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              A prática leva à perfeição!
            </p>
            <button 
              onClick={startGame} 
              className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-base md:text-lg rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
