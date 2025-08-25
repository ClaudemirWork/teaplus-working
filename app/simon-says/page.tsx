// app/simon-says/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Phase {
  gems: number;
  sequences: number;
  name: string;
}

interface GemConfig {
  color: string;
  frequency: number;
}

export default function SimonGemsGame() {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Configuração do jogo
  const gameConfig = {
    phases: [
      { gems: 2, sequences: 6, name: "Iniciante" },
      { gems: 4, sequences: 6, name: "Aprendiz" },
      { gems: 6, sequences: 6, name: "Mestre" },
      { gems: 8, sequences: 6, name: "Lendário" }
    ],
    gemColors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan', 'pink'],
    sounds: {
      red: 261.63,    // C4
      blue: 293.66,   // D4
      green: 329.63,  // E4
      yellow: 349.23, // F4
      purple: 392.00, // G4
      orange: 440.00, // A4
      cyan: 493.88,   // B4
      pink: 523.25,   // C5
      golden: 659.25  // E5
    }
  };

  // Estado do jogo
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

  // Frases do Leo
  const leoMessages = {
    start: "Vamos começar nossa aventura!",
    watching: "Observe com atenção!",
    yourTurn: "Agora é sua vez!",
    correct: ["Muito bem!", "Você está indo bem!", "Excelente!", "Continue assim!", "Fantástico!"],
    almostDone: "Estamos quase no final da fase!",
    phaseComplete: "Iupiiii! Vamos para a próxima gema dourada!",
    error: "Ops! Vamos tentar de novo!",
    gameOver: "Você foi incrível! Vamos jogar mais?"
  };

  // Inicializar áudio
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

  // Sistema de fala do Leo
  const leoSpeak = useCallback((message: string) => {
    setLeoMessage(message);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Tocar nota musical
  const playNote = useCallback((frequency: number, duration: number = 500) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration/1000);

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration/1000);
  }, []);

  // Iniciar jogo
  const startGame = useCallback(() => {
    setCurrentPhase(0);
    setScore(0);
    setSequence([]);
    setPlayerSequence([]);
    setSequencesCompleted(0);
    setIsPlaying(true);
    setShowGoldenGem(false);
    leoSpeak(leoMessages.start);
    setTimeout(() => nextRound(), 2000);
  }, [leoSpeak]);

  // Próxima rodada
  const nextRound = useCallback(() => {
    const phase = gameConfig.phases[currentPhase];
    const maxGem = phase.gems;
    const newSequence = [...sequence, Math.floor(Math.random() * maxGem)];
    setSequence(newSequence);
    setPlayerSequence([]);
    showSequence(newSequence);
  }, [currentPhase, sequence]);

  // Mostrar sequência
  const showSequence = useCallback(async (seq: number[]) => {
    setIsShowingSequence(true);
    leoSpeak(leoMessages.watching);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    for (let i = 0; i < seq.length; i++) {
      setActiveGem(seq[i]);
      const color = gameConfig.gemColors[seq[i]];
      playNote(gameConfig.sounds[color as keyof typeof gameConfig.sounds]);
      
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveGem(null);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    setIsShowingSequence(false);
    leoSpeak(leoMessages.yourTurn);
  }, [leoSpeak, playNote]);

  // Lidar com clique na gema
  const handleGemClick = useCallback((index: number) => {
    if (isShowingSequence || !isPlaying) return;
    
    setActiveGem(index);
    const color = gameConfig.gemColors[index];
    playNote(gameConfig.sounds[color as keyof typeof gameConfig.sounds]);
    
    setTimeout(() => setActiveGem(null), 300);
    
    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);
    
    // Verificar sequência
    const currentIndex = newPlayerSequence.length - 1;
    
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      // Erro
      handleError();
    } else if (newPlayerSequence.length === sequence.length) {
      // Sequência completa
      handleSuccess();
    }
  }, [isShowingSequence, isPlaying, playerSequence, sequence, playNote]);

  // Lidar com sucesso
  const handleSuccess = useCallback(() => {
    setScore(prev => prev + sequence.length * 10);
    setSequencesCompleted(prev => prev + 1);
    
    const phase = gameConfig.phases[currentPhase];
    const newSequencesCompleted = sequencesCompleted + 1;
    
    if (newSequencesCompleted >= phase.sequences) {
      // Fase completa
      handlePhaseComplete();
    } else {
      if (newSequencesCompleted === phase.sequences - 1) {
        leoSpeak(leoMessages.almostDone);
      } else {
        const randomMessage = leoMessages.correct[Math.floor(Math.random() * leoMessages.correct.length)];
        leoSpeak(randomMessage);
      }
      setTimeout(() => nextRound(), 1500);
    }
  }, [sequence, currentPhase, sequencesCompleted, leoSpeak, nextRound]);

  // Lidar com erro
  const handleError = useCallback(() => {
    leoSpeak(leoMessages.error);
    setSequence([]);
    setPlayerSequence([]);
    setSequencesCompleted(0);
    setIsPlaying(false);
  }, [leoSpeak]);

  // Lidar com fase completa
  const handlePhaseComplete = useCallback(() => {
    setShowGoldenGem(true);
    setScore(prev => prev + 100); // Bônus da gema dourada
    leoSpeak(leoMessages.phaseComplete);
    playNote(gameConfig.sounds.golden, 1000);
    
    setTimeout(() => {
      setShowVictoryModal(true);
    }, 2000);
  }, [leoSpeak, playNote]);

  // Próxima fase
  const nextPhase = useCallback(() => {
    const newPhase = currentPhase + 1;
    
    if (newPhase >= gameConfig.phases.length) {
      // Jogo completo
      leoSpeak(leoMessages.gameOver);
      setCurrentPhase(0);
      setIsPlaying(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden">
      {/* Estrelas animadas no fundo */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🌟 Aventura das Gemas Mágicas 🌟
              </h1>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg">
                <div className="text-xs opacity-90">Fase</div>
                <div className="text-2xl font-bold">{currentPhase + 1}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg">
                <div className="text-xs opacity-90">Pontos</div>
                <div className="text-2xl font-bold">{score}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg">
                <div className="text-xs opacity-90">Sequência</div>
                <div className="text-2xl font-bold">{sequence.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Área do jogo */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          {/* Indicador de fase */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Fase {currentPhase + 1}: {phase.gems} Gemas Mágicas
            </h2>
            <div className="w-full bg-white/20 rounded-full h-8 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold transition-all duration-500"
                style={{ width: `${progress}%` }}
              >
                {sequencesCompleted}/{phase.sequences}
              </div>
            </div>
          </div>

          {/* Container das gemas */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {[...Array(phase.gems)].map((_, i) => (
              <button
                key={i}
                onClick={() => handleGemClick(i)}
                disabled={!isPlaying || isShowingSequence}
                className={`
                  relative w-24 h-24 md:w-32 md:h-32 transform transition-all duration-300 hover:scale-110
                  ${activeGem === i ? 'scale-125 animate-pulse' : ''}
                  ${!isPlaying || isShowingSequence ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`
                }}
              >
                <div className={`
                  w-full h-full rounded-2xl shadow-2xl transform rotate-45
                  ${gameConfig.gemColors[i] === 'red' ? 'bg-gradient-to-br from-red-400 to-red-600' : ''}
                  ${gameConfig.gemColors[i] === 'blue' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : ''}
                  ${gameConfig.gemColors[i] === 'green' ? 'bg-gradient-to-br from-green-400 to-green-600' : ''}
                  ${gameConfig.gemColors[i] === 'yellow' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : ''}
                  ${gameConfig.gemColors[i] === 'purple' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : ''}
                  ${gameConfig.gemColors[i] === 'orange' ? 'bg-gradient-to-br from-orange-400 to-orange-600' : ''}
                  ${gameConfig.gemColors[i] === 'cyan' ? 'bg-gradient-to-br from-cyan-400 to-cyan-600' : ''}
                  ${gameConfig.gemColors[i] === 'pink' ? 'bg-gradient-to-br from-pink-400 to-pink-600' : ''}
                `}>
                  <div className="absolute inset-0 bg-white/30 rounded-2xl transform rotate-0" />
                  <div className="absolute inset-2 bg-white/20 rounded-xl transform rotate-0" />
                </div>
              </button>
            ))}
            
            {/* Gema dourada */}
            {showGoldenGem && (
              <div className="relative w-24 h-24 md:w-32 md:h-32 animate-bounce">
                <div className="w-full h-full rounded-2xl shadow-2xl transform rotate-45 bg-gradient-to-br from-yellow-300 to-yellow-500 animate-pulse">
                  <div className="absolute inset-0 bg-white/50 rounded-2xl transform rotate-0" />
                  <div className="absolute inset-2 bg-white/30 rounded-xl transform rotate-0" />
                </div>
              </div>
            )}
          </div>

          {/* Controles */}
          <div className="flex justify-center">
            <button
              onClick={startGame}
              disabled={isPlaying}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? 'Jogando...' : 'Começar Aventura'}
            </button>
          </div>
        </div>
      </div>

      {/* Leo Mascote */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-2xl flex items-center justify-center animate-bounce">
            <img 
              src="https://github.com/ClaudemirWork/teaplus-working/blob/main/public/images/mascotes/leo.webp?raw=true"
              alt="Leo Mascote"
              className="w-20 h-20 md:w-28 md:h-28 object-contain"
            />
          </div>
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-2xl shadow-xl min-w-[200px] max-w-[300px]">
            <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
            <p className="text-gray-800 text-sm md:text-base font-medium text-center">
              {leoMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Vitória */}
      {showVictoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full transform animate-bounce">
            <h2 className="text-4xl font-bold text-purple-600 text-center mb-4">
              🎉 Parabéns! 🎉
            </h2>
            <div className="text-6xl text-center mb-6">
              ⭐⭐⭐⭐⭐
            </div>
            <p className="text-xl text-gray-700 text-center mb-6">
              Você completou a fase {currentPhase + 1}!
            </p>
            <button
              onClick={nextPhase}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              {currentPhase + 1 >= gameConfig.phases.length ? 'Jogar Novamente' : 'Próxima Fase'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
