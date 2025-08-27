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

// --- BANCO DE CARDS - Usando EXATAMENTE os nomes do arquivo original ---
const allCardsData: Card[] = [
  // Ações verificadas
  { id: 'pensar', label: 'Pensar', image: '/images/cards/acoes/Pensar.webp', category: 'acoes' },
  { id: 'abracar', label: 'Abraçar', image: '/images/cards/acoes/abraçar.webp', category: 'acoes' },
  { id: 'beber', label: 'Beber', image: '/images/cards/acoes/beber.webp', category: 'acoes' },
  { id: 'caminhar', label: 'Caminhar', image: '/images/cards/acoes/caminhar.webp', category: 'acoes' },
  { id: 'conversar', label: 'Conversar', image: '/images/cards/acoes/conversar.webp', category: 'acoes' },
  { id: 'escrever', label: 'Escrever', image: '/images/cards/acoes/escrever.webp', category: 'acoes' },
  { id: 'falar', label: 'Falar', image: '/images/cards/acoes/falar.webp', category: 'acoes' },
  { id: 'ler_livro', label: 'Ler Livro', image: '/images/cards/acoes/ler_livro.webp', category: 'acoes' },
  { id: 'ouvindo', label: 'Ouvindo', image: '/images/cards/acoes/ouvindo.webp', category: 'acoes' },
  { id: 'saltar', label: 'Saltar', image: '/images/cards/acoes/saltar.webp', category: 'acoes' },
  { id: 'sentar', label: 'Sentar', image: '/images/cards/acoes/sentar.webp', category: 'acoes' },
  { id: 'tocar', label: 'Tocar', image: '/images/cards/acoes/tocar.webp', category: 'acoes' },
  
  // Core - arquivos verificados
  { id: 'agora', label: 'Agora', image: '/images/cards/core/agora.webp', category: 'core' },
  { id: 'sim', label: 'Sim', image: '/images/cards/core/sim.webp', category: 'core' },
  { id: 'nao', label: 'Não', image: '/images/cards/core/não.webp', category: 'core' },
  { id: 'pare', label: 'Pare', image: '/images/cards/core/pare.webp', category: 'core' },
  { id: 'quando', label: 'Quando?', image: '/images/cards/core/quando.webp', category: 'core' },
  { id: 'onde', label: 'Onde?', image: '/images/cards/core/onde.webp', category: 'core' },
  { id: 'qual', label: 'Qual?', image: '/images/cards/core/qual.webp', category: 'core' },
  { id: 'eu', label: 'Eu', image: '/images/cards/core/eu.webp', category: 'core' },
  { id: 'voce', label: 'Você', image: '/images/cards/core/voce.webp', category: 'core' },
  { id: 'mais', label: 'Mais', image: '/images/cards/core/mais.webp', category: 'core' },
  { id: 'obrigado', label: 'Obrigado', image: '/images/cards/core/obrigado.webp', category: 'core' },
  
  // Rotinas - CUIDADO com maiúsculas/minúsculas
  { id: 'ontem', label: 'Ontem', image: '/images/cards/rotinas/Ontem.webp', category: 'rotinas' },
  { id: 'hoje', label: 'Hoje', image: '/images/cards/rotinas/hoje.webp', category: 'rotinas' },
  { id: 'tarde', label: 'Tarde', image: '/images/cards/rotinas/Tarde.webp', category: 'rotinas' },
  { id: 'manha', label: 'Manhã', image: '/images/cards/rotinas/manha.webp', category: 'rotinas' },
  { id: 'noite', label: 'Noite', image: '/images/cards/rotinas/noite.webp', category: 'rotinas' },
  { id: 'almoco', label: 'Almoço', image: '/images/cards/rotinas/almoco.webp', category: 'rotinas' },
  { id: 'jantar', label: 'Jantar', image: '/images/cards/rotinas/jantar.webp', category: 'rotinas' },
  { id: 'cafe_manha', label: 'Café da Manhã', image: '/images/cards/rotinas/cafe_manha.webp', category: 'rotinas' },
  { id: 'brincar', label: 'Brincar', image: '/images/cards/rotinas/brincar.webp', category: 'rotinas' },
  { id: 'estudar', label: 'Estudar', image: '/images/cards/rotinas/estudar.webp', category: 'rotinas' },
  { id: 'ver_televisao', label: 'Ver Televisão', image: '/images/cards/rotinas/ver_televisao.webp', category: 'rotinas' },
  { id: 'segunda_feira', label: 'Segunda-feira', image: '/images/cards/rotinas/segunda_feira.webp', category: 'rotinas' },
  { id: 'terca_feira', label: 'Terça-feira', image: '/images/cards/rotinas/terca_feira.webp', category: 'rotinas' },
  { id: 'quarta_feira', label: 'Quarta-feira', image: '/images/cards/rotinas/quarta_feira.webp', category: 'rotinas' },
  { id: 'quinta_feira', label: 'Quinta-feira', image: '/images/cards/rotinas/quinta_feira.webp', category: 'rotinas' },
  { id: 'sexta_feira', label: 'Sexta-feira', image: '/images/cards/rotinas/sexta_feira.webp', category: 'rotinas' },
  { id: 'sabado', label: 'Sábado', image: '/images/cards/rotinas/sabado.webp', category: 'rotinas' },
  { id: 'domingo', label: 'Domingo', image: '/images/cards/rotinas/domingo.webp', category: 'rotinas' },
  
  // Alimentos
  { id: 'macarrao', label: 'Macarrão Bolonhesa', image: '/images/cards/alimentos/macarrao_bologhesa.webp', category: 'alimentos' },
  { id: 'pizza', label: 'Pizza', image: '/images/cards/alimentos/pizza.webp', category: 'alimentos' },
  { id: 'suco_laranja', label: 'Suco de Laranja', image: '/images/cards/alimentos/suco_laranja.webp', category: 'alimentos' },
  { id: 'sanduiche', label: 'Sanduíche', image: '/images/cards/alimentos/sanduiche.webp', category: 'alimentos' },
  { id: 'banana', label: 'Banana', image: '/images/cards/alimentos/banana.webp', category: 'alimentos' },
  { id: 'maca', label: 'Maçã', image: '/images/cards/alimentos/maca.webp', category: 'alimentos' },
  { id: 'salada', label: 'Salada', image: '/images/cards/alimentos/salada.webp', category: 'alimentos' },
  
  // Animais
  { id: 'cachorro', label: 'Cachorro', image: '/images/cards/animais/cachorro.webp', category: 'animais' },
  { id: 'gato', label: 'Gato', image: '/images/cards/animais/gato.webp', category: 'animais' },
  { id: 'cavalo', label: 'Cavalo', image: '/images/cards/animais/cavalo.webp', category: 'animais' },
  { id: 'vaca', label: 'Vaca', image: '/images/cards/animais/Vaca.webp', category: 'animais' },
  { id: 'coelho', label: 'Coelho', image: '/images/cards/animais/coelho.webp', category: 'animais' },
  { id: 'pato', label: 'Pato', image: '/images/cards/animais/pato.webp', category: 'animais' },
  { id: 'cisne', label: 'Cisne', image: '/images/cards/animais/cisne.webp', category: 'animais' },
  { id: 'elefante', label: 'Elefante', image: '/images/cards/animais/elefante.webp', category: 'animais' },
  
  // Casa
  { id: 'mesa', label: 'Mesa', image: '/images/cards/casa/mesa.webp', category: 'casa' },
  { id: 'cadeira', label: 'Cadeira', image: '/images/cards/casa/cadeira.webp', category: 'casa' },
  { id: 'cama', label: 'Cama', image: '/images/cards/casa/cama.webp', category: 'casa' },
  { id: 'sofa', label: 'Sofá', image: '/images/cards/casa/sofa.webp', category: 'casa' },
  
  // Escola
  { id: 'livro', label: 'Livro', image: '/images/cards/escola/livro.webp', category: 'escola' },
  { id: 'caderno', label: 'Caderno', image: '/images/cards/escola/caderno.webp', category: 'escola' },
  { id: 'lapis', label: 'Lápis', image: '/images/cards/escola/lapis.webp', category: 'escola' },
];

// --- Configuração ---
const gameConfig = {
  phases: [
    { cards: 4, rounds: 4, name: "Tradutor Iniciante" },
    { cards: 6, rounds: 5, name: "Intérprete Aprendiz" },
    { cards: 8, rounds: 6, name: "Mestre dos Gestos" },
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

  const milaMessages = {
    intro: "Olá! Sou a Mila, a Feiticeira. Vamos descobrir o que as pessoas querem?",
    start: "Vamos começar! Preste atenção no que eu vou pedir.",
    correct: ["Isso mesmo! 🎉", "Você encontrou! ⭐", "Excelente! 🌟", "Continue assim! 💪"],
    error: "Ops, não foi esse. Mas não desista! ❤️",
    phaseComplete: (phaseName: string) => `Uau! Você completou a fase ${phaseName}! ✨`,
    gameOver: "Não foi dessa vez, mas você foi incrível! Vamos tentar de novo? 😊"
  };

  useEffect(() => {
    if (!isPlaying && milaMessage === "") {
      milaSpeak(milaMessages.intro);
    }
  }, [isPlaying, milaMessage]);

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
  
  const milaSpeak = useCallback((message: string) => {
    setMilaMessage(message);
    if (isSoundOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.replace(/[🎉⭐🌟💪✨❤️😊]/g, ''));
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, [isSoundOn]);

  const playSound = useCallback((type: 'correct' | 'wrong' | 'win') => {
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
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-violet-200 to-pink-200 relative overflow-hidden">
      {/* Desktop Layout */}
      <div className="relative z-10 max-w-6xl mx-auto p-2 md:p-4">
        {/* Header compacto */}
        <div className="bg-white/90 rounded-2xl p-2 md:p-3 mb-3 md:mb-4 shadow-xl border-2 border-pink-300">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/')}
                className="p-1 md:p-1.5 hover:bg-pink-100 rounded-lg transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-sm md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">
                ✨ Palavras Mágicas ✨
              </h1>
            </div>
            
            <div className="flex gap-1 md:gap-2">
              <div className="bg-gradient-to-br from-red-400 to-pink-400 text-white px-2 md:px-3 py-1 rounded-lg shadow-lg">
                <div className="text-[9px] md:text-[10px]">Vidas</div>
                <div className="text-sm md:text-base font-bold">{'❤️'.repeat(lives)}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white px-2 md:px-3 py-1 rounded-lg shadow-lg">
                <div className="text-[9px] md:text-[10px]">Pontos</div>
                <div className="text-sm md:text-base font-bold">{score}</div>
              </div>
              <button onClick={() => setIsSoundOn(!isSoundOn)} className="p-1 hover:bg-pink-100 rounded-lg transition-colors">
                {isSoundOn ? <Volume2 className="w-4 h-4 md:w-5 md:h-5" /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Área principal mais compacta */}
        {isPlaying && phase ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 md:p-5 shadow-xl border-2 border-violet-200">
            {/* Progress bar mais compacta */}
            <div className="text-center mb-3">
              <h2 className="text-sm md:text-lg font-bold text-gray-800 mb-2">
                🌟 Fase {currentPhaseIndex + 1}: {phase.name} 🌟
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden border border-gray-300">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-sky-400 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
                  style={{ width: `${progress}%` }}
                >
                  {roundsCompleted}/{phase.rounds}
                </div>
              </div>
            </div>

            {/* NPC menor */}
            <div className="flex justify-center my-3">
              <div className="bg-white p-2 md:p-3 rounded-xl shadow-md text-center border-2 border-pink-200">
                <div className="text-3xl md:text-4xl animate-bounce">🤔</div>
                <p className="font-bold mt-1 text-xs md:text-sm">{npcName}</p>
              </div>
            </div>

            {/* Grid de cards otimizado para desktop */}
            <div className={`
              grid gap-2 md:gap-3 transition-opacity duration-500 max-w-4xl mx-auto
              ${isUiBlocked ? 'opacity-50' : 'opacity-100'}
              ${phase.cards <= 4 ? 'grid-cols-2 md:grid-cols-4' : ''}
              ${phase.cards === 6 ? 'grid-cols-2 md:grid-cols-3' : ''}
              ${phase.cards === 8 ? 'grid-cols-2 md:grid-cols-4' : ''}
              ${phase.cards >= 10 ? 'grid-cols-2 md:grid-cols-5' : ''}
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
                      onError={(e) => {
                        const img = e.currentTarget;
                        const parent = img.parentElement;
                        if (parent && !parent.querySelector('.fallback')) {
                          img.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'fallback absolute inset-0 bg-gradient-to-br from-violet-100 to-pink-100 rounded flex items-center justify-center';
                          const emoji = card.category === 'animais' ? '🐾' : 
                                       card.category === 'acoes' ? '👋' : 
                                       card.category === 'alimentos' ? '🍎' : 
                                       card.category === 'rotinas' ? '⏰' : 
                                       card.category === 'core' ? '💬' : 
                                       card.category === 'casa' ? '🏠' :
                                       card.category === 'escola' ? '📚' : '📦';
                          fallback.innerHTML = `<span class="text-2xl md:text-3xl">${emoji}</span>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                  <p className="mt-1 text-center font-bold text-[10px] md:text-xs">{card.label}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-6 bg-white/90 rounded-3xl mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500 mb-4">
              Bem-vindo!
            </h2>
            <p className="text-sm md:text-base mb-6">Ajude a Mila a entender o que as pessoas querem dizer.</p>
            <button
              onClick={startGame}
              className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-base md:text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              🚀 Começar a Jogar
            </button>
          </div>
        )}
      </div>

      {/* Mila no Desktop - Tamanho maior */}
      <div className="hidden md:block fixed bottom-0 left-0 z-50 pointer-events-none">
        <div className="relative">
          <div className="relative w-64 h-64 ml-2 mb-2">
            <img 
              src="/images/mascotes/mila/mila_feiticeira_resultado.webp"
              alt="Mila Feiticeira"
              className="w-full h-full object-contain drop-shadow-2xl pointer-events-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                      <span class="text-6xl">🧙‍♀️</span>
                    </div>
                  `;
                }
              }}
            />
          </div>
          
          {milaMessage && (
            <div className="absolute bottom-full mb-2 left-4 bg-white p-3 rounded-2xl shadow-2xl min-w-[280px] max-w-[400px] border-3 border-violet-400 pointer-events-auto">
              <div className="absolute bottom-[-10px] left-16 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white" />
              <p className="text-gray-800 text-sm font-semibold text-center">
                {milaMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mila no Mobile - Mantém como estava */}
      <div className="md:hidden relative mt-4 px-3 pb-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32">
            <img 
              src="/images/mascotes/mila/mila_feiticeira_resultado.webp"
              alt="Mila Feiticeira"
              className="w-full h-full object-contain drop-shadow-xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `
                  <div class="w-28 h-28 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                    <span class="text-4xl">🧙‍♀️</span>
                  </div>
                `;
              }}
            />
          </div>
          
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
          <div className="bg-white rounded-3xl p-6 max-w-md w-full transform animate-bounce border-4 border-yellow-400 text-center">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-4">
              🎉 Fase Completa! 🎉
            </h2>
            <p className="text-base text-gray-700 mb-4">
              Você ganhou +250 pontos!
            </p>
            <button 
              onClick={nextPhase} 
              className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-base rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              {currentPhaseIndex + 1 >= gameConfig.phases.length ? '🏆 Concluído!' : '🚀 Próxima Fase'}
            </button>
          </div>
        </div>
      )}
      
      {showGameOverModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-red-400 text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Fim de Jogo</h2>
            <p className="text-base text-gray-700 mb-2">
              Pontuação: <span className="font-bold text-violet-600">{score}</span>
            </p>
            <button 
              onClick={startGame} 
              className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-base rounded-full shadow-xl hover:scale-105 transition-transform"
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
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
