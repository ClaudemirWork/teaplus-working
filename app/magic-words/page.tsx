'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

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

interface Npc {
  name: string;
  image: string;
}

// --- BANCO COMPLETO DE CARDS (mantenho o mesmo) ---
const allCardsData: Card[] = [
  // [Todo o array de cards permanece o mesmo - omitido por brevidade]
  // AÇÕES (86 cards)
  { id: 'pensar', label: 'Pensar', image: '/images/cards/acoes/Pensar.webp', category: 'acoes' },
  { id: 'abracar', label: 'Abraçar', image: '/images/cards/acoes/abraçar.webp', category: 'acoes' },
  // ... [resto dos cards igual ao código anterior]
];

// Configuração do jogo
const gameConfig = {
  phases: [
    { cards: 4, rounds: 5, name: "Tradutor Iniciante" },
    { cards: 6, rounds: 7, name: "Intérprete Aprendiz" },
    { cards: 9, rounds: 10, name: "Mestre dos Gestos" },
    { cards: 12, rounds: 12, name: "Feiticeiro das Palavras" }
  ] as Phase[],
  cards: allCardsData,
  npcs: [
    { name: 'Mila', image: '/images/mascotes/mila/mila_rosto_resultado.webp' },
    { name: 'Léo', image: '/images/mascotes/leo/leo_rosto_resultado.webp' }, // Ajustei o caminho do Léo
  ]
};

const Game = () => {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Estados do jogo
  const [gameStatus, setGameStatus] = useState<'intro' | 'playing' | 'victory' | 'gameOver'>('intro');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isUiBlocked, setIsUiBlocked] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const [correctCard, setCorrectCard] = useState<Card | null>(null);
  const [currentNpc, setCurrentNpc] = useState<Npc | null>(null);
  const [cardFeedback, setCardFeedback] = useState<{ [key: string]: 'correct' | 'wrong' }>({});

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [milaMessage, setMilaMessage] = useState("");
  const [introStep, setIntroStep] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const introMessages = [
    "Olá, me chamo Mila, e sou a feiticeira da floresta deste mundo encantando. Sou uma feiticeira do bem, e quero lhe convidar a ajudar a pessoas a encontrar objetos que estão escondidos na floresta, e que eles não acham.",
    "Não se preocupe, eu vou ajudá-lo nesta tarefa, e você ao acertar as cartas com o que cada cidadão está procurando, ganha pontos, e bônus extras, podendo libertar poderes especiais no jogo.",
    "Basta seguir minha voz, e procurar o card que está sendo solicitado, e clicar nele. Se acertar, ganha pontos, mas se errar, não tem problema, não perde nada e pode começar de novo.",
    "Vamos comigo nesta aventura?"
  ];

  const gameMessages = {
    start: "Vamos começar! Preste atenção!",
    correct: ["Isso mesmo!", "Você encontrou!", "Excelente!"],
    error: "Ops, não foi esse. Tente novamente!",
    phaseComplete: (phaseName: string) => `Parabéns! Você completou a fase ${phaseName}!`,
    gameOver: "Não foi dessa vez, mas você foi incrível!"
  };

  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
        setCurrentNpc(gameConfig.npcs[0]); 
        milaSpeak(introMessages[0]);
        setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    const initAudio = () => {
      if (typeof window !== 'undefined' && !audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    if (typeof window !== 'undefined') {
      document.addEventListener('click', initAudio, { once: true });
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('click', initAudio);
        audioContextRef.current?.close();
      }
    };
  }, []);

  const milaSpeak = useCallback((message: string) => {
    setMilaMessage(message);
    if (isSoundOn && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.replace(/[🎉⭐🌟❤️✨😊]/g, ''));
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, [isSoundOn]);

  const playSound = useCallback((type: 'correct' | 'wrong' | 'win') => {
    if (!isSoundOn || typeof window === 'undefined' || !audioContextRef.current) return;
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
    } else if (type === 'win') {
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        playNote(freq, now + i * 0.1, 0.15);
      });
    }
  }, [isSoundOn]);

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
    
    const randomNpc = gameConfig.npcs[Math.floor(Math.random() * gameConfig.npcs.length)];
    setCurrentNpc(randomNpc);

    setTimeout(() => {
        if(correct) {
          milaSpeak(`${randomNpc.name} quer o card '${correct.label}'. Encontre!`);
        }
        setIsUiBlocked(false);
    }, 1200);
  }, [milaSpeak]);

  const startGame = useCallback(() => {
    setGameStatus('playing');
    setCurrentPhaseIndex(0);
    setScore(0);
    setRoundsCompleted(0);
    setLives(3);
    if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
    }
    setMilaMessage(gameMessages.start);
    setTimeout(() => nextRound(0), 2000);
  }, [gameMessages, nextRound]);

  const handleIntroStep = () => {
    if (introStep < introMessages.length - 1) {
      setIntroStep(prev => prev + 1);
      milaSpeak(introMessages[introStep + 1]);
    } else {
      startGame();
    }
  };

  const handleCardClick = (card: Card) => {
    if (isUiBlocked || gameStatus !== 'playing') return;
    setIsUiBlocked(true);

    if (card.id === correctCard?.id) {
      setScore(prev => prev + 100);
      setCardFeedback({ [card.id]: 'correct' });
      playSound('correct');
      const randomMessage = gameMessages.correct[Math.floor(Math.random() * gameMessages.correct.length)];
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
      milaSpeak(gameMessages.error);
      
      const newLives = lives - 1;
      if (newLives <= 0) {
        setTimeout(() => {
          setGameStatus('gameOver');
          milaSpeak(gameMessages.gameOver);
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
      milaSpeak(gameMessages.phaseComplete(phase.name));
    }
    setGameStatus('victory');
  };

  const nextPhase = useCallback(() => {
    const newPhaseIndex = currentPhaseIndex + 1;
    setGameStatus('playing');
    
    if (newPhaseIndex >= gameConfig.phases.length) {
      milaSpeak("Parabéns! Você completou o jogo!");
      setGameStatus('gameOver');
    } else {
      setCurrentPhaseIndex(newPhaseIndex);
      setRoundsCompleted(0);
      setLives(3);
      setTimeout(() => nextRound(newPhaseIndex), 1000);
    }
  }, [currentPhaseIndex, nextRound, milaSpeak]);

  const renderGameContent = () => {
    const phase = gameConfig.phases[currentPhaseIndex];
    const progress = phase ? (roundsCompleted / phase.rounds) * 100 : 0;
  
    return (
      <div className="h-screen flex flex-col">
        {/* HEADER FIXO COM PERSONAGENS E CARTA ALVO */}
        <div className="bg-gradient-to-r from-violet-500 to-pink-500 p-3 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* Mila e Léo */}
            <div className="flex items-center gap-3">
              <img 
                src="/images/mascotes/mila/mila_rosto_resultado.webp"
                alt="Mila"
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border-3 border-white shadow-lg"
              />
              <img 
                src="/images/mascotes/leo/leo_rosto_resultado.webp"
                alt="Léo"
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border-3 border-white shadow-lg"
              />
            </div>

            {/* Balão com a carta procurada */}
            {correctCard && (
              <div className="bg-white rounded-2xl p-3 shadow-xl flex items-center gap-3 relative">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 
                  border-t-[10px] border-t-transparent 
                  border-r-[15px] border-r-white 
                  border-b-[10px] border-b-transparent">
                </div>
                <div className="text-center">
                  <p className="text-xs md:text-sm font-bold text-gray-600 mb-1">Procure:</p>
                  <img 
                    src={correctCard.image}
                    alt={correctCard.label}
                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  />
                  <p className="text-sm md:text-base font-bold text-violet-600 mt-1">
                    {correctCard.label}
                  </p>
                </div>
              </div>
            )}

            {/* Status do jogo */}
            <div className="text-white text-right">
              <div className="text-xs md:text-sm">Pontos: {score}</div>
              <div className="text-xs md:text-sm">Vidas: {'❤️'.repeat(lives)}</div>
            </div>
          </div>
        </div>

        {/* ÁREA DO JOGO */}
        <div className="flex-1 overflow-auto bg-gradient-to-b from-sky-200 via-violet-200 to-pink-200 p-4">
          <div className="max-w-6xl mx-auto">
            {/* Barra de progresso */}
            <div className="bg-white/90 rounded-xl p-3 mb-4 shadow-lg">
              <h2 className="text-center text-sm md:text-lg font-bold text-gray-800 mb-2">
                Fase {currentPhaseIndex + 1}: {phase.name}
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-sky-400 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
                  style={{ width: `${progress}%` }}
                >
                  {roundsCompleted}/{phase.rounds}
                </div>
              </div>
            </div>

            {/* Grade de cards */}
            <div className={`
              grid gap-2 md:gap-3 transition-opacity duration-500
              ${isUiBlocked ? 'opacity-50' : 'opacity-100'}
              ${phase.cards <= 4 ? 'grid-cols-2 md:grid-cols-4' : ''}
              ${phase.cards === 6 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3' : ''}
              ${phase.cards === 9 ? 'grid-cols-3 md:grid-cols-3' : ''}
              ${phase.cards >= 12 ? 'grid-cols-3 md:grid-cols-4' : ''}
            `}>
              {currentCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  disabled={isUiBlocked}
                  className={`
                    p-2 bg-white rounded-xl shadow-lg border-3 transition-all duration-300 transform 
                    ${isUiBlocked ? 'cursor-wait' : 'hover:scale-105 hover:shadow-xl active:scale-95'}
                    ${cardFeedback[card.id] === 'correct' ? 'border-green-400 scale-110 animate-pulse' : ''}
                    ${cardFeedback[card.id] === 'wrong' ? 'border-red-400 animate-shake' : ''}
                    ${!cardFeedback[card.id] ? 'border-violet-200' : ''}
                  `}
                >
                  <div className="aspect-square relative">
                    <img 
                      src={card.image} 
                      alt={card.label}
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <p className="mt-1 text-center font-bold text-[10px] md:text-xs">{card.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderIntroScreen = () => {
    const isLastStep = introStep === introMessages.length - 1;

    return (
      <div className="flex flex-col items-center justify-end md:justify-center p-4 min-h-screen">
        <div className="w-full md:max-w-4xl flex flex-col md:flex-row items-center justify-center gap-4">
          
          <div className="md:w-1/2 flex justify-center order-2 md:order-1">
            <div className="w-[80%] h-[auto] max-w-[300px] drop-shadow-2xl animate-fade-in-up">
              <img 
                src="/images/mascotes/mila/mila_feiticeira_resultado.webp"
                alt="Mila Feiticeira"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
  
          <div className="md:w-1/2 flex justify-center order-1 md:order-2">
            <div className="bg-white p-6 rounded-2xl shadow-xl border-4 border-violet-400 relative w-full max-w-xl animate-scale-in">
              <h1 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500 mb-4">
                Boas-Vindas ao Palavras Mágicas!
              </h1>
              <p className="text-gray-700 text-base md:text-lg font-medium text-center mb-6">
                {milaMessage}
              </p>
              
              <div className="flex justify-center">
                {isLastStep ? (
                  <button
                    onClick={startGame}
                    className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    Começar
                  </button>
                ) : (
                  <button
                    onClick={handleIntroStep}
                    className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    Continuar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderModals = () => (
    <>
      {gameStatus === 'victory' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-4">
              Fase Completa!
            </h2>
            <p className="text-base text-gray-700 mb-4">+250 pontos de bônus!</p>
            <button 
              onClick={nextPhase} 
              className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold rounded-full"
            >
              {currentPhaseIndex + 1 >= gameConfig.phases.length ? 'Finalizar' : 'Próxima Fase'}
            </button>
          </div>
        </div>
      )}
      
      {gameStatus === 'gameOver' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Fim de Jogo</h2>
            <p className="text-base text-gray-700 mb-4">
              Pontuação: <span className="font-bold">{score}</span>
            </p>
            <button 
              onClick={startGame} 
              className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold rounded-full"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-violet-200 to-pink-200 relative overflow-hidden">
      {gameStatus === 'intro' ? (
        renderIntroScreen()
      ) : (
        renderGameContent()
      )}
      {renderModals()}
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Game;
