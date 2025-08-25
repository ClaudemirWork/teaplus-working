<div className="fixed bottom-1 left-1 md:bottom-2 md:left-2 z-50">
        <div className="relative">
          <div className="absolute -inset-4 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-3xl opacity-50" />
          
          <div className="relative w-60 h-60 md:w-80 md:h-80">
            <img 
              src="/images/mascotes/leo/Leo_apoio.webp"
              alt="Leo Mascote"
              className="w-full h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src.includes('Leo_apoio')) {
                  img.src = '/images/mascotes/leo/leo_apoio.webp';
                }
              }}
            />
          </div>
          
          <div className="absolute bottom-full mb-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-white to-yellow-50 p-5 rounded-3xl shadow-2xl min-w-[340px] max-w-[500px] border-4 border-yellow-400">
            <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-yellow-50" />
            <p className="text-gray-800 text-xl md:text-2xl font-bold text-center leading-relaxed">
              {leoMessage}
            </p>
          </div>
        </div>
      </div>'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Phase {
  gems: number;
  sequences: number;
  name: string;
}

interface Gem {
  emoji: string;
  color: string;
  gradient: string;
  shadow: string;
  frequency: number;
}

export default function SimonGemsGame() {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const gameConfig = {
    phases: [
      { gems: 2, sequences: 6, name: "Iniciante" },
      { gems: 4, sequences: 6, name: "Aprendiz" },
      { gems: 6, sequences: 6, name: "Mestre" },
      { gems: 8, sequences: 6, name: "Lendário" }
    ] as Phase[],
    gems: [
      { emoji: '💎', color: 'blue', gradient: 'from-blue-400 to-cyan-400', shadow: 'shadow-blue-500/50', frequency: 261.63 },
      { emoji: '❤️', color: 'red', gradient: 'from-red-400 to-pink-400', shadow: 'shadow-red-500/50', frequency: 293.66 },
      { emoji: '💚', color: 'green', gradient: 'from-green-400 to-emerald-400', shadow: 'shadow-green-500/50', frequency: 329.63 },
      { emoji: '💛', color: 'yellow', gradient: 'from-yellow-300 to-amber-400', shadow: 'shadow-yellow-500/50', frequency: 349.23 },
      { emoji: '💜', color: 'purple', gradient: 'from-purple-400 to-violet-400', shadow: 'shadow-purple-500/50', frequency: 392.00 },
      { emoji: '🧡', color: 'orange', gradient: 'from-orange-400 to-amber-500', shadow: 'shadow-orange-500/50', frequency: 440.00 },
      { emoji: '💙', color: 'lightblue', gradient: 'from-sky-300 to-blue-400', shadow: 'shadow-sky-500/50', frequency: 493.88 },
      { emoji: '💖', color: 'pink', gradient: 'from-pink-300 to-rose-400', shadow: 'shadow-pink-500/50', frequency: 523.25 }
    ] as Gem[],
    goldenGem: { emoji: '⭐', frequency: 659.25 }
  };

  const [currentPhase, setCurrentPhase] = useState(0);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [sequencesCompleted, setSequencesCompleted] = useState(0);
  const [activeGem, setActiveGem] = useState<number | null>(null);
  const [leoMessage, setLeoMessage] = useState("Olá! Eu sou o Leo! Vamos brincar com as gemas mágicas?");
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showGoldenGem, setShowGoldenGem] = useState(false);

  const leoMessages = {
    start: "Vamos começar nossa aventura mágica!",
    watching: "Preste atenção nas gemas brilhantes!",
    yourTurn: "Agora é sua vez! Toque nas gemas!",
    correct: ["Muito bem! 🎉", "Você está arrasando! ⭐", "Excelente! 🌟", "Continue assim! 💪", "Fantástico! 🎊"],
    almostDone: "Uau! Estamos quase terminando esta fase! 🏁",
    phaseComplete: "Iupiiii! Você ganhou uma estrela dourada! ⭐",
    error: "Ops! Não foi dessa vez! Vamos tentar de novo? 😊",
    gameOver: "Você foi incrível! Que tal mais uma aventura? 🎮"
  };

  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const leoSpeak = useCallback((message: string) => {
    setLeoMessage(message);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.replace(/[🎉⭐🌟💪🎊🏁😊🎮]/g, ''));
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const playNote = useCallback((frequency: number, duration: number = 500) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration/1000);

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration/1000);
  }, []);

  const playSuccessSound = useCallback(() => {
    if (!audioContextRef.current) return;
    [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
      setTimeout(() => playNote(freq, 200), i * 100);
    });
  }, [playNote]);

  const startGame = useCallback(() => {
    setCurrentPhase(0);
    setScore(0);
    setSequence([]);
    setPlayerSequence([]);
    setSequencesCompleted(0);
    setIsPlaying(true);
    setShowGoldenGem(false);
    leoSpeak(leoMessages.start);
    setTimeout(() => nextRound(), 3000);
  }, [leoSpeak]);

  const nextRound = useCallback(() => {
    const phase = gameConfig.phases[currentPhase];
    const maxGem = phase.gems;
    const newSequence = [...sequence, Math.floor(Math.random() * maxGem)];
    setSequence(newSequence);
    setPlayerSequence([]);
    showSequence(newSequence);
  }, [currentPhase, sequence]);

  const showSequence = useCallback(async (seq: number[]) => {
    setIsShowingSequence(true);
    leoSpeak(leoMessages.watching);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    for (let i = 0; i < seq.length; i++) {
      setActiveGem(seq[i]);
      playNote(gameConfig.gems[seq[i]].frequency);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveGem(null);
      await new Promise(resolve => setTimeout(resolve, 700));
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsShowingSequence(false);
    leoSpeak(leoMessages.yourTurn);
  }, [leoSpeak, playNote]);

  const handleGemClick = useCallback((index: number) => {
    if (isShowingSequence || !isPlaying) return;
    
    setActiveGem(index);
    playNote(gameConfig.gems[index].frequency);
    
    setTimeout(() => setActiveGem(null), 300);
    
    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);
    
    const currentIndex = newPlayerSequence.length - 1;
    
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      handleError();
    } else if (newPlayerSequence.length === sequence.length) {
      handleSuccess();
    }
  }, [isShowingSequence, isPlaying, playerSequence, sequence, playNote]);

  const handleSuccess = useCallback(() => {
    setScore(prev => prev + sequence.length * 10);
    setSequencesCompleted(prev => prev + 1);
    
    const phase = gameConfig.phases[currentPhase];
    const newSequencesCompleted = sequencesCompleted + 1;
    
    if (newSequencesCompleted >= phase.sequences) {
      handlePhaseComplete();
    } else {
      if (newSequencesCompleted === phase.sequences - 1) {
        leoSpeak(leoMessages.almostDone);
      } else {
        const randomMessage = leoMessages.correct[Math.floor(Math.random() * leoMessages.correct.length)];
        leoSpeak(randomMessage);
      }
      setTimeout(() => nextRound(), 2500);
    }
  }, [sequence, currentPhase, sequencesCompleted, leoSpeak, nextRound]);

  const handleError = useCallback(() => {
    leoSpeak(leoMessages.error);
    setSequence([]);
    setPlayerSequence([]);
    setSequencesCompleted(0);
    setIsPlaying(false);
  }, [leoSpeak]);

  const handlePhaseComplete = useCallback(() => {
    setShowGoldenGem(true);
    setScore(prev => prev + 100);
    
    playNote(gameConfig.goldenGem.frequency, 1500);
    playSuccessSound();
    
    setTimeout(() => {
      leoSpeak(leoMessages.phaseComplete);
    }, 1000);
    
    setTimeout(() => {
      setShowVictoryModal(true);
      setShowGoldenGem(false);
    }, 4000);
  }, [leoSpeak, playNote, playSuccessSound]);

  const nextPhase = useCallback(() => {
    const newPhase = currentPhase + 1;
    
    if (newPhase >= gameConfig.phases.length) {
      leoSpeak(leoMessages.gameOver);
      setCurrentPhase(0);
      setIsPlaying(false);
      setSequence([]);
      setSequencesCompleted(0);
    } else {
      setCurrentPhase(newPhase);
      setSequence([]);
      setPlayerSequence([]);
      setSequencesCompleted(0);
      setShowGoldenGem(false);
      setTimeout(() => nextRound(), 2000);
    }
    
    setShowVictoryModal(false);
  }, [currentPhase, leoSpeak, nextRound]);

  const phase = gameConfig.phases[currentPhase];
  const progress = (sequencesCompleted / phase.sequences) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-blue-200 to-cyan-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full opacity-70 animate-pulse" />
        <div className="absolute top-20 right-20 w-40 h-24 bg-white rounded-full opacity-60 animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-20 left-1/3 w-36 h-22 bg-white rounded-full opacity-65 animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-3xl p-4 mb-6 shadow-xl border-4 border-yellow-300">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-yellow-100 rounded-xl transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400">
                ✨ Aventura das Gemas Mágicas ✨
              </h1>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-2xl shadow-lg">
                <div className="text-xs">Fase</div>
                <div className="text-xl font-bold">{currentPhase + 1}</div>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-emerald-400 text-white px-4 py-2 rounded-2xl shadow-lg">
                <div className="text-xs">Pontos</div>
                <div className="text-xl font-bold">{score}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white px-4 py-2 rounded-2xl shadow-lg">
                <div className="text-xs">Sequência</div>
                <div className="text-xl font-bold">{sequence.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-blue-200">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              🌟 {phase.name}: {phase.gems} Gemas Mágicas 🌟
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden border-2 border-gray-300">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 flex items-center justify-center text-white font-bold transition-all duration-500"
                style={{ width: `${progress}%` }}
              >
                {sequencesCompleted}/{phase.sequences}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 p-4 min-h-[200px]">
            {!showGoldenGem && [...Array(phase.gems)].map((_, i) => (
              <button
                key={i}
                onClick={() => handleGemClick(i)}
                disabled={!isPlaying || isShowingSequence}
                className={`
                  relative group transform transition-all duration-300
                  ${activeGem === i ? 'scale-125 rotate-12' : 'hover:scale-110'}
                  ${!isPlaying || isShowingSequence ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className={`
                  absolute inset-0 rounded-full blur-xl opacity-50 bg-gradient-to-br ${gameConfig.gems[i].gradient}
                  ${activeGem === i ? 'animate-pulse' : 'group-hover:animate-pulse'}
                `} />
                
                <div className={`
                  relative text-6xl md:text-7xl filter drop-shadow-lg
                  ${activeGem === i ? 'animate-bounce' : ''}
                `}>
                  {gameConfig.gems[i].emoji}
                </div>
              </button>
            ))}
          </div>

          {showGoldenGem && (
            <div className="fixed inset-0 flex items-center justify-center z-[90] pointer-events-none">
              <div className="relative animate-bounce">
                <div className="absolute inset-0 w-40 h-40 md:w-56 md:h-56">
                  <div className="absolute inset-0 bg-yellow-300 opacity-30 rounded-full animate-ping" />
                  <div className="absolute inset-0 bg-yellow-400 opacity-20 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
                </div>
                
                <div className="absolute inset-0 w-32 h-32 md:w-48 md:h-48 rounded-full blur-3xl opacity-90 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 animate-pulse" />
                
                <div className="relative text-[8rem] md:text-[12rem] filter drop-shadow-2xl animate-spin" style={{animationDuration: '3s'}}>
                  ⭐
                </div>
                
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-2 rounded-full font-bold text-xl shadow-2xl animate-pulse">
                  +100 BÔNUS!
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={startGame}
              disabled={isPlaying}
              className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-lg md:text-xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white"
            >
              {isPlaying ? '🎮 Jogando...' : '🚀 Começar Aventura'}
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 left-2 md:bottom-4 md:left-4 z-50">
        <div className="relative">
          <div className="absolute inset-0 w-60 h-60 md:w-80 md:h-80 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-2xl opacity-60 animate-pulse" />
          
          <div className="relative w-60 h-60 md:w-80 md:h-80">
            <img 
              src="/images/mascotes/leo/Leo_apoio.webp"
              alt="Leo Mascote"
              className="w-full h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src.includes('Leo_apoio')) {
                  img.src = '/images/mascotes/leo/leo_apoio.webp';
                }
              }}
            />
          </div>
          
          <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-white to-yellow-50 p-5 rounded-3xl shadow-2xl min-w-[320px] max-w-[500px] border-4 border-yellow-400">
            <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-yellow-50" />
            <p className="text-gray-800 text-xl md:text-2xl font-bold text-center leading-relaxed">
              {leoMessage}
            </p>
          </div>
        </div>
      </div>

      {showVictoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full transform animate-bounce border-4 border-yellow-400">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 text-center mb-4">
              🎉 Parabéns! 🎉
            </h2>
            <div className="text-5xl md:text-6xl text-center mb-6 animate-pulse">
              ⭐⭐⭐⭐⭐
            </div>
            <p className="text-lg md:text-xl text-gray-700 text-center mb-6">
              Você completou a fase {currentPhase + 1}!
            </p>
            <div className="text-center mb-6">
              <p className="text-2xl md:text-3xl font-bold text-yellow-500">
                +100 pontos bônus!
              </p>
            </div>
            <button
              onClick={nextPhase}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all border-2 border-white"
            >
              {currentPhase + 1 >= gameConfig.phases.length ? '🎮 Jogar Novamente' : '🚀 Próxima Fase'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
