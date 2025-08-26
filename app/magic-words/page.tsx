'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Interfaces (Tipos de Dados) ---
interface Card {
  id: string;
  label: string;
  image: string;
  gesture: string;
  gestureDesc: string;
}

interface Phase {
  cards: number;
  rounds: number;
  name: string;
}

// --- Configuração Central do Jogo ---
const gameConfig = {
  phases: [
    { cards: 4, rounds: 5, name: "Tradutor Iniciante" },
    { cards: 6, rounds: 7, name: "Intérprete Aprendiz" },
    { cards: 8, rounds: 8, name: "Mestre dos Gestos" },
    { cards: 12, rounds: 10, name: "Feiticeiro das Palavras" }
  ] as Phase[],
  cards: [
    { id: 'sede', label: 'Sede', image: '/images/cards/sede.webp', gesture: '👉💧', gestureDesc: 'apontando para a garganta' },
    { id: 'fome', label: 'Fome', image: '/images/cards/fome.webp', gesture: '🤲🍽️', gestureDesc: 'com as mãos na barriga' },
    { id: 'banheiro', label: 'Banheiro', image: '/images/cards/banheiro.webp', gesture: '🚽', gestureDesc: 'se contorcendo um pouquinho' },
    { id: 'sono', label: 'Sono', image: '/images/cards/sono.webp', gesture: '😴', gestureDesc: 'bocejando e com soninho' },
    { id: 'doente', label: 'Dodói', image: '/images/cards/doente.webp', gesture: '🤒', gestureDesc: 'com a mão na testa, parecendo febril' },
    { id: 'frio', label: 'Frio', image: '/images/cards/frio.webp', gesture: '🥶', gestureDesc: 'tremendo de frio' },
    { id: 'calor', label: 'Calor', image: '/images/cards/calor.webp', gesture: '🥵', gestureDesc: 'se abanando com a mão' },
    { id: 'ajuda', label: 'Ajuda', image: '/images/cards/ajuda.webp', gesture: '🙏', gestureDesc: 'com as mãos juntas, pedindo ajuda' },
    { id: 'triste', label: 'Triste', image: '/images/cards/triste.webp', gesture: '😢', gestureDesc: 'enxugando uma lágrima do rosto' },
    { id: 'feliz', label: 'Feliz', image: '/images/cards/feliz.webp', gesture: '😄', gestureDesc: 'com um sorriso bem grande' },
    { id: 'brincar', label: 'Brincar', image: '/images/cards/brincar.webp', gesture: '🎉', gestureDesc: 'pulando de alegria' },
    { id: 'dor', label: 'Dor', image: '/images/cards/dor.webp', gesture: '🤕', gestureDesc: 'apontando para onde dói' },
  ] as Card[],
  npcNames: ['Maria', 'João', 'Ana', 'Lucas', 'Sofia', 'Pedro']
};

export default function MagicWordsGame() {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- Estados do Jogo ---
  const [currentPhase, setCurrentPhase] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUiBlocked, setIsUiBlocked] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const [correctCard, setCorrectCard] = useState<Card | null>(null);
  const [npcName, setNpcName] = useState('Maria');
  const [cardFeedback, setCardFeedback] = useState<{ [key: string]: 'correct' | 'wrong' }>({});

  const [milaMessage, setMilaMessage] = useState("Olá! Sou a Mila! Vamos traduzir os gestos mágicos?");
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // --- Mensagens da Mila ---
  const milaMessages = {
    start: "Vamos começar! Preste atenção no gesto.",
    nextRound: ["Observe com atenção!", "O que será que ele(a) quer dizer?", "Você consegue traduzir este gesto!"],
    correct: ["Isso mesmo! 🎉", "Você é um ótimo tradutor! ⭐", "Excelente! 🌟", "Continue assim! 💪"],
    error: "Ops, não foi esse. Mas não desista! ❤️",
    phaseComplete: "Uau! Você completou a fase e ganhou mais pontos! ✨",
    gameOver: "Não foi dessa vez, mas você foi incrível! Vamos tentar de novo? 😊"
  };

  // --- Inicialização do Áudio ---
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
  
  // --- Funções de Som e Narração ---
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
  
  // --- Lógica Principal do Jogo ---
  const startGame = useCallback(() => {
    setCurrentPhase(0);
    setScore(0);
    setRoundsCompleted(0);
    setLives(3);
    setIsPlaying(true);
    setShowGameOverModal(false);
    setShowVictoryModal(false);
    milaSpeak(milaMessages.start);
    setTimeout(() => nextRound(0), 2000);
  }, [milaSpeak]);

  const nextRound = useCallback((phaseIndex: number) => {
    setIsUiBlocked(true);
    const phase = gameConfig.phases[phaseIndex];
    
    // 1. Pega todos os cards disponíveis e embaralha
    const shuffledDeck = [...gameConfig.cards].sort(() => 0.5 - Math.random());
    
    // 2. Seleciona o card correto e os distratores
    const correct = shuffledDeck[0];
    const distractors = shuffledDeck.slice(1, phase.cards);
    
    // 3. Monta os cards da rodada e embaralha novamente
    const roundCards = [correct, ...distractors].sort(() => 0.5 - Math.random());
    
    setCorrectCard(correct);
    setCurrentCards(roundCards);
    setCardFeedback({});
    
    const randomNpcName = gameConfig.npcNames[Math.floor(Math.random() * gameConfig.npcNames.length)];
    setNpcName(randomNpcName);

    const randomMessage = milaMessages.nextRound[Math.floor(Math.random() * milaMessages.nextRound.length)];
    setTimeout(() => {
        milaSpeak(`${randomNpcName} está ${correct.gestureDesc}. ${randomMessage}`);
        setIsUiBlocked(false);
    }, 1200);

  }, [milaSpeak]);

  const handleCardClick = (card: Card) => {
    if (isUiBlocked || !isPlaying) return;
    setIsUiBlocked(true);

    if (card.id === correctCard?.id) {
      // --- ACERTOU ---
      setScore(prev => prev + 100);
      setCardFeedback({ [card.id]: 'correct' });
      playSound('correct');
      const randomMessage = milaMessages.correct[Math.floor(Math.random() * milaMessages.correct.length)];
      milaSpeak(randomMessage);
      
      const newRoundsCompleted = roundsCompleted + 1;
      setRoundsCompleted(newRoundsCompleted);

      setTimeout(() => {
        const phase = gameConfig.phases[currentPhase];
        if (newRoundsCompleted >= phase.rounds) {
          handlePhaseComplete();
        } else {
          nextRound(currentPhase);
        }
      }, 2000);

    } else {
      // --- ERROU ---
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
          nextRound(currentPhase);
        }, 2500);
      }
    }
  };

  const handlePhaseComplete = () => {
    playSound('win');
    setScore(prev => prev + 250); // Bônus
    milaSpeak(milaMessages.phaseComplete);
    setShowVictoryModal(true);
  };
  
  const nextPhase = useCallback(() => {
    const newPhase = currentPhase + 1;
    setShowVictoryModal(false);
    
    if (newPhase >= gameConfig.phases.length) {
      // Venceu o jogo!
      startGame(); // Por enquanto, recomeça
    } else {
      setCurrentPhase(newPhase);
      setRoundsCompleted(0);
      setLives(3);
      setTimeout(() => nextRound(newPhase), 1000);
    }
  }, [currentPhase, nextRound, startGame]);


  const phase = gameConfig.phases[currentPhase];
  const progress = phase ? (roundsCompleted / phase.rounds) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-violet-200 to-pink-200 relative overflow-hidden text-gray-800">
      <div className="relative z-10 max-w-4xl mx-auto p-2 md:p-4">
        {/* --- CABEÇALHO --- */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 mb-4 shadow-lg border-2 border-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => router.push('/')} className="p-2 hover:bg-sky-100 rounded-xl transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">
                ✨ Palavras Mágicas ✨
              </h1>
            </div>
            <div className="flex gap-2 md:gap-3 items-center">
              <div className="bg-gradient-to-br from-red-400 to-pink-400 text-white px-3 py-1.5 rounded-xl shadow-md text-center">
                <div className="text-xs">Vidas</div>
                <div className="text-xl font-bold">{'❤️'.repeat(lives)}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white px-4 py-1.5 rounded-xl shadow-md text-center">
                <div className="text-xs">Pontos</div>
                <div className="text-xl font-bold">{score}</div>
              </div>
               <button onClick={() => setIsSoundOn(!isSoundOn)} className="p-2 hover:bg-sky-100 rounded-xl transition-colors">
                {isSoundOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* --- ÁREA PRINCIPAL DO JOGO --- */}
        {isPlaying ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl border-2 border-violet-200">
          <div className="text-center mb-4">
            <h2 className="text-lg md:text-2xl font-bold mb-2">
             🌟 Fase {currentPhase + 1}: {phase.name} 🌟
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-6 border border-gray-300">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-sky-400 flex items-center justify-center text-white text-sm font-bold transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              >
                {roundsCompleted}/{phase.rounds}
              </div>
            </div>
          </div>
          
          {/* --- NPC e Gesto --- */}
          <div className="flex justify-center my-4 md:my-6">
              <div className="bg-white p-4 rounded-2xl shadow-md text-center border-2 border-pink-200 animate-fade-in">
                  <div className="text-6xl md:text-8xl animate-bounce">{correctCard?.gesture}</div>
                  <p className="font-bold mt-2 text-lg">{npcName}</p>
              </div>
          </div>

          {/* --- GRID DE CARDS --- */}
          <div className={`grid gap-3 md:gap-4 transition-opacity duration-500 ${isUiBlocked ? 'opacity-50' : 'opacity-100'}`}
               style={{ gridTemplateColumns: `repeat(${phase.cards <= 6 ? phase.cards / 2 : Math.ceil(phase.cards / 2)}, 1fr)`}}>
            {currentCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={isUiBlocked}
                className={`
                  p-2 bg-white rounded-2xl shadow-lg border-4 transition-all duration-300 transform 
                  ${isUiBlocked ? 'cursor-wait' : 'hover:scale-105 hover:shadow-xl'}
                  ${cardFeedback[card.id] === 'correct' ? 'border-green-400 scale-110 animate-pulse' : ''}
                  ${cardFeedback[card.id] === 'wrong' ? 'border-red-400 animate-shake' : ''}
                  ${!cardFeedback[card.id] ? 'border-white' : ''}
                `}
              >
                <img src={card.image} alt={card.label} className="w-full h-auto object-contain aspect-square" />
                <p className="mt-2 text-center font-bold text-sm md:text-base">{card.label}</p>
              </button>
            ))}
          </div>
        </div>
        ) : (
        // --- TELA DE INÍCIO ---
        <div className="text-center p-8 bg-white/90 rounded-3xl mt-16 animate-fade-in">
             <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500 mb-4">
               Bem-vindo!
             </h2>
             <p className="text-lg mb-8">Ajude a Mila a entender o que as pessoas querem dizer com seus gestos.</p>
             <button
              onClick={startGame}
              className="px-12 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-2xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              🚀 Começar a Jogar
            </button>
        </div>
        )}
      </div>

      {/* --- MASCOTE MILA --- */}
      <div className="fixed bottom-0 -left-4 md:left-2 z-20 w-48 md:w-80 pointer-events-none">
           <img src="/images/mascotes/mila/Mila_apoio.webp" alt="Mila Mascote" className="w-full h-full object-contain drop-shadow-2xl" />
      </div>
      <div className="fixed bottom-10 md:bottom-24 left-36 md:left-72 z-30 max-w-md">
        <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-2xl border-2 border-violet-400 relative">
            <p className="text-center font-semibold text-base md:text-lg">{milaMessage}</p>
            <div className="absolute -bottom-3 left-0 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-white transform -translate-x-full"></div>
        </div>
      </div>
      
      {/* --- MODAIS --- */}
      {showVictoryModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full transform animate-bounce border-4 border-yellow-400 text-center">
             <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-4">🎉 Fase Completa! 🎉</h2>
             <p className="text-xl text-gray-700 mb-4">Você é incrível! Ganhou +250 pontos bônus!</p>
             <button onClick={nextPhase} className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                {currentPhase + 1 >= gameConfig.phases.length ? '🏆 Jogar Novamente' : '🚀 Próxima Fase'}
             </button>
           </div>
         </div>
      )}
      {showGameOverModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full transform animate-bounce border-4 border-red-400 text-center">
             <h2 className="text-4xl font-bold text-red-500 mb-4">😢 Fim de Jogo 😢</h2>
             <p className="text-xl text-gray-700 mb-2">Sua pontuação final foi: <span className="font-bold text-violet-600">{score}</span></p>
             <p className="text-gray-600 mb-6">Não desanime! A prática leva à perfeição.</p>
             <button onClick={startGame} className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                 Tentar Novamente
             </button>
           </div>
         </div>
      )}
    </div>
  );
}
