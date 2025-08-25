// app/simon-says/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

// IMPORTANTE: A imagem do Leo mascote está em:
// public/images/mascotes/leo/Leo_apoio.webp
// (Note que "Leo_apoio" tem L maiúsculo)

interface Phase {
  gems: number;
  sequences: number;
  name: string;
}

export default function SimonGemsGame() {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Configuração do jogo com emojis de gemas reais
  const gameConfig = {
    phases: [
      { gems: 2, sequences: 6, name: "Iniciante" },
      { gems: 4, sequences: 6, name: "Aprendiz" },
      { gems: 6, sequences: 6, name: "Mestre" },
      { gems: 8, sequences: 6, name: "Lendário" }
    ],
    gems: [
      { emoji: '💎', color: 'blue', gradient: 'from-blue-400 to-cyan-400', shadow: 'shadow-blue-500/50', frequency: 261.63 },
      { emoji: '❤️', color: 'red', gradient: 'from-red-400 to-pink-400', shadow: 'shadow-red-500/50', frequency: 293.66 },
      { emoji: '💚', color: 'green', gradient: 'from-green-400 to-emerald-400', shadow: 'shadow-green-500/50', frequency: 329.63 },
      { emoji: '💛', color: 'yellow', gradient: 'from-yellow-300 to-amber-400', shadow: 'shadow-yellow-500/50', frequency: 349.23 },
      { emoji: '💜', color: 'purple', gradient: 'from-purple-400 to-violet-400', shadow: 'shadow-purple-500/50', frequency: 392.00 },
      { emoji: '🧡', color: 'orange', gradient: 'from-orange-400 to-amber-500', shadow: 'shadow-orange-500/50', frequency: 440.00 },
      { emoji: '💙', color: 'lightblue', gradient: 'from-sky-300 to-blue-400', shadow: 'shadow-sky-500/50', frequency: 493.88 },
      { emoji: '💖', color: 'pink', gradient: 'from-pink-300 to-rose-400', shadow: 'shadow-pink-500/50', frequency: 523.25 }
    ],
    goldenGem: { emoji: '⭐', frequency: 659.25 }
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
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [confetti, setConfetti] = useState<Array<{id: number, x: number, y: number, color: string}>>([]);

  // Frases do Leo
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

  // Mensagem inicial do Leo ao carregar
  useEffect(() => {
    const timer = setTimeout(() => {
      leoSpeak("Olá! Eu sou o Leo! Vamos brincar com as gemas mágicas?");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [leoSpeak]); // Inclui leoSpeak nas dependências

  // Sistema de fala do Leo com velocidade ajustada
  const leoSpeak = useCallback((message: string) => {
    setLeoMessage(message);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.replace(/[🎉⭐🌟💪🎊🏁😊🎮]/g, ''));
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8; // Mais devagar para ser mais claro
      utterance.pitch = 1.2;
      utterance.volume = 1.0; // Volume máximo
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
    gainNode.gain.linearRampToValueAtTime(0.4, audioContextRef.current.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration/1000);

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration/1000);
  }, []);

  // Som de sucesso
  const playSuccessSound = useCallback(() => {
    if (!audioContextRef.current) return;
    [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
      setTimeout(() => playNote(freq, 200), i * 100);
    });
  }, [playNote]);

  // Criar partículas
  const createParticles = useCallback((x: number, y: number) => {
    const newParticles = Array.from({length: 10}, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  }, []);

  // Iniciar jogo com timing melhorado
  const startGame = useCallback(() => {
    setCurrentPhase(0);
    setScore(0);
    setSequence([]);
    setPlayerSequence([]);
    setSequencesCompleted(0);
    setIsPlaying(true);
    setShowGoldenGem(false);
    leoSpeak(leoMessages.start);
    // Espera mais tempo para a fala inicial
    setTimeout(() => nextRound(), 3000);
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

  // Mostrar sequência com timing melhorado
  const showSequence = useCallback(async (seq: number[]) => {
    setIsShowingSequence(true);
    leoSpeak(leoMessages.watching);
    
    // Espera mais tempo para a fala do Leo terminar
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    for (let i = 0; i < seq.length; i++) {
      setActiveGem(seq[i]);
      playNote(gameConfig.gems[seq[i]].frequency);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveGem(null);
      await new Promise(resolve => setTimeout(resolve, 700));
    }
    
    // Pequena pausa antes de falar novamente
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsShowingSequence(false);
    leoSpeak(leoMessages.yourTurn);
  }, [leoSpeak, playNote]);

  // Lidar com clique na gema
  const handleGemClick = useCallback((index: number, event: React.MouseEvent) => {
    if (isShowingSequence || !isPlaying) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    createParticles(rect.left + rect.width/2, rect.top + rect.height/2);
    
    setActiveGem(index);
    playNote(gameConfig.gems[index].frequency);
    
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
  }, [isShowingSequence, isPlaying, playerSequence, sequence, playNote, createParticles]);

  // Lidar com sucesso com timing melhorado
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
      // Mais tempo entre as rodadas
      setTimeout(() => nextRound(), 2500);
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

  // Criar confete para celebração
  const createConfetti = useCallback(() => {
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#98FB98', '#DDA0DD'];
    const newConfetti = Array.from({length: 50}, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: -50,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setConfetti(newConfetti);
    setTimeout(() => {
      setConfetti([]);
    }, 3000);
  }, []);

  // Lidar com fase completa com melhor timing
  const handlePhaseComplete = useCallback(() => {
    // Primeiro mostra a gema dourada
    setShowGoldenGem(true);
    setScore(prev => prev + 100);
    
    // Cria confete para celebração
    createConfetti();
    
    // Toca o som especial da gema dourada
    playNote(gameConfig.goldenGem.frequency, 1500);
    playSuccessSound();
    
    // Espera um pouco antes de falar
    setTimeout(() => {
      leoSpeak(leoMessages.phaseComplete);
    }, 1000);
    
    // Mostra o modal depois de um tempo maior
    setTimeout(() => {
      setShowVictoryModal(true);
      setShowGoldenGem(false); // Remove a gema quando o modal aparece
    }, 4000);
  }, [leoSpeak, playNote, playSuccessSound, createConfetti]);

  // Próxima fase
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
      {/* Nuvens animadas no fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full opacity-70 animate-pulse" />
        <div className="absolute top-20 right-20 w-40 h-24 bg-white rounded-full opacity-60 animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-20 left-1/3 w-36 h-22 bg-white rounded-full opacity-65 animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Partículas animadas */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: particle.x,
            top: particle.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
      ))}

      {/* Confete de celebração */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="fixed pointer-events-none animate-bounce"
          style={{
            left: piece.x,
            top: piece.y,
            animation: 'confettiFall 3s ease-out forwards',
            zIndex: 100
          }}
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: piece.color,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
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
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
                <div className="text-xs">Fase</div>
                <div className="text-xl font-bold">{currentPhase + 1}</div>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-emerald-400 text-white px-4 py-2 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
                <div className="text-xs">Pontos</div>
                <div className="text-xl font-bold">{score}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white px-4 py-2 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
                <div className="text-xs">Sequência</div>
                <div className="text-xl font-bold">{sequence.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Área do jogo */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-blue-200">
          {/* Indicador de fase */}
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              🌟 {phase.name}: {phase.gems} Gemas Mágicas 🌟
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden border-2 border-gray-300">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 flex items-center justify-center text-white font-bold transition-all duration-500 shadow-inner"
                style={{ width: `${progress}%` }}
              >
                {sequencesCompleted}/{phase.sequences}
              </div>
            </div>
          </div>

          {/* Container das gemas */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 p-4 min-h-[200px]">
            {!showGoldenGem && [...Array(phase.gems)].map((_, i) => (
              <button
                key={i}
                onClick={(e) => handleGemClick(i, e)}
                disabled={!isPlaying || isShowingSequence}
                className={`
                  relative group transform transition-all duration-300
                  ${activeGem === i ? 'scale-125 rotate-12' : 'hover:scale-110'}
                  ${!isPlaying || isShowingSequence ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Brilho de fundo */}
                <div className={`
                  absolute inset-0 rounded-full blur-xl opacity-50 bg-gradient-to-br ${gameConfig.gems[i].gradient}
                  ${activeGem === i ? 'animate-pulse' : 'group-hover:animate-pulse'}
                `} />
                
                {/* Emoji da gema */}
                <div className={`
                  relative text-6xl md:text-7xl filter drop-shadow-lg
                  ${activeGem === i ? 'animate-bounce' : ''}
                `}
                style={{
                  animation: activeGem !== i ? `float ${3 + i * 0.5}s ease-in-out infinite` : undefined,
                  animationDelay: `${i * 0.2}s`
                }}>
                  {gameConfig.gems[i].emoji}
                </div>
                
                {/* Efeito de brilho 3D */}
                <div className={`
                  absolute inset-0 rounded-full pointer-events-none
                  ${activeGem === i ? 'bg-white/40' : 'bg-white/20'}
                `} />
              </button>
            ))}
          </div>
          {/* Gema dourada ESPECIAL - MAIS DESTACADA */}
          {showGoldenGem && (
            <div className="fixed inset-0 flex items-center justify-center z-[90] pointer-events-none">
              <div className="relative animate-bounce">
                {/* Raios de luz animados */}
                <div className="absolute inset-0 w-40 h-40 md:w-56 md:h-56">
                  <div className="absolute inset-0 bg-yellow-300 opacity-30 rounded-full animate-ping" />
                  <div className="absolute inset-0 bg-yellow-400 opacity-20 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
                </div>
                
                {/* Brilho dourado intenso */}
                <div className="absolute inset-0 w-32 h-32 md:w-48 md:h-48 rounded-full blur-3xl opacity-90 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 animate-pulse" />
                
                {/* Estrela dourada gigante */}
                <div className="relative text-[8rem] md:text-[12rem] filter drop-shadow-2xl animate-spin" style={{animationDuration: '3s'}}>
                  ⭐
                </div>
                
                {/* Texto de bônus */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-2 rounded-full font-bold text-xl shadow-2xl animate-pulse">
                  +100 BÔNUS!
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Controles */}
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

      {/* Leo Mascote - TAMANHO DOBRADO E MELHOR POSICIONADO */}
      <div className="fixed bottom-2 left-2 md:bottom-4 md:left-4 z-50">
        <div className="relative">
          {/* Círculo de fundo para o Leo */}
          <div className="absolute inset-0 w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-2xl opacity-60 animate-pulse" />
          
          {/* Mascote Leo - Imagem real MAIOR */}
          <div className="relative w-40 h-40 md:w-56 md:h-56 animate-bounce">
            <img 
              src="/images/mascotes/leo/Leo_apoio.webp"
              alt="Leo Mascote"
              className="w-full h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                const img = e.currentTarget;
                // Tenta com letra minúscula se falhar
                if (img.src.includes('Leo_apoio')) {
                  img.src = '/images/mascotes/leo/leo_apoio.webp';
                } else {
                  // Se nenhum funcionar, usa um placeholder
                  img.style.display = 'none';
                  img.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-8xl">🦁</div>';
                }
              }}
            />
          </div>
          
          {/* Balão de fala MAIOR e MAIS DESTACADO */}
          <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-white to-yellow-50 p-4 rounded-3xl shadow-2xl min-w-[280px] max-w-[450px] border-4 border-yellow-400">
            <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-yellow-50" />
            <p className="text-gray-800 text-lg md:text-xl font-bold text-center leading-relaxed">
              {leoMessage}
            </p>
          </div>
        </div>
      </div>
        <div className="relative">
          {/* Círculo de fundo para o Leo */}
          <div className="absolute inset-0 w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-2xl opacity-60 animate-pulse" />
          
          {/* Mascote Leo - Imagem real MAIOR */}
          <div className="relative w-40 h-40 md:w-56 md:h-56 animate-bounce">
            <img 
              src="/images/mascotes/leo/Leo_apoio.webp"
              alt="Leo Mascote"
              className="w-full h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                const img = e.currentTarget;
                // Tenta com letra minúscula se falhar
                if (img.src.includes('Leo_apoio')) {
                  img.src = '/images/mascotes/leo/leo_apoio.webp';
                } else {
                  // Se nenhum funcionar, usa um placeholder
                  img.style.display = 'none';
                  img.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-8xl">🦁</div>';
                }
              }}
            />
          </div>
          
          {/* Balão de fala MAIOR e MAIS DESTACADO */}
          <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-white to-yellow-50 p-4 rounded-3xl shadow-2xl min-w-[280px] max-w-[450px] border-4 border-yellow-400">
            <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-yellow-50" />
            <p className="text-gray-800 text-lg md:text-xl font-bold text-center leading-relaxed">
              {leoMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Vitória */}
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

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        @keyframes confettiFall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
