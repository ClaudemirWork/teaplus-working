// app/simon-says/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Volume2, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Crystal {
  id: number;
  color: string;
  emoji: string;
  sound: string;
  gradient: string;
}

interface GameMetrics {
  maxSequence: number;
  totalScore: number;
  correctAttempts: number;
  wrongAttempts: number;
  averageResponseTime: number;
  sessionDuration: number;
  powerUpsUsed: number;
}

const crystals: Crystal[] = [
  { id: 0, color: 'blue', emoji: '💎', sound: 'C4', gradient: 'from-blue-400 to-blue-600' },
  { id: 1, color: 'red', emoji: '🔴', sound: 'E4', gradient: 'from-red-400 to-red-600' },
  { id: 2, color: 'green', emoji: '💚', sound: 'G4', gradient: 'from-green-400 to-green-600' },
  { id: 3, color: 'yellow', emoji: '⭐', sound: 'B4', gradient: 'from-yellow-400 to-yellow-600' },
];

export default function SimonSaysGame() {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeCrystal, setActiveCrystal] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState('Olá! Eu sou o Mago Simon! Vamos treinar sua memória mágica?');
  const [showResults, setShowResults] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [powerUps, setPowerUps] = useState({ replay: 1, slow: 1 });
  const [metrics, setMetrics] = useState<GameMetrics>({
    maxSequence: 0,
    totalScore: 0,
    correctAttempts: 0,
    wrongAttempts: 0,
    averageResponseTime: 0,
    sessionDuration: 0,
    powerUpsUsed: 0,
  });
  const responseTimes = useRef<number[]>([]);
  const startTime = useRef<number | null>(null);
  const sessionStart = useRef<number | null>(null);

  // Inicializa o contexto de áudio
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    // Inicializa áudio no primeiro clique
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

  // Sistema de voz
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Sistema de som
  const playNote = useCallback((sound: string) => {
    if (!audioContextRef.current) return;

    const noteMap: { [key: string]: number } = {
      'C4': 261.63,
      'E4': 329.63,
      'G4': 392.00,
      'B4': 493.88,
    };

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = noteMap[sound] || 440;

    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.5);
  }, []);

  // Feedback sonoro
  const playSuccess = useCallback(() => {
    if (!audioContextRef.current) return;
    [261.63, 329.63, 392.00].forEach((freq, i) => {
      setTimeout(() => {
        const osc = audioContextRef.current!.createOscillator();
        const gain = audioContextRef.current!.createGain();
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, audioContextRef.current!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current!.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioContextRef.current!.destination);
        osc.start();
        osc.stop(audioContextRef.current!.currentTime + 0.2);
      }, i * 100);
    });
  }, []);

  const playError = useCallback(() => {
    if (!audioContextRef.current) return;
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    osc.frequency.value = 200;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);
    osc.start();
    osc.stop(audioContextRef.current.currentTime + 0.3);
  }, []);

  // Iniciar jogo
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setScore(0);
    setShowResults(false);
    sessionStart.current = Date.now();
    responseTimes.current = [];
    
    setMessage('Observe a sequência mágica com atenção!');
    speak('Observe a sequência mágica com atenção!');
    
    setTimeout(() => nextRound(), 2000);
  }, [speak]);

  // Próxima rodada
  const nextRound = useCallback(() => {
    const newSequence = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setPlayerSequence([]);
    setMetrics(prev => ({
      ...prev,
      maxSequence: Math.max(prev.maxSequence, newSequence.length)
    }));
    
    showSequence(newSequence);
  }, [sequence]);

  // Mostrar sequência
  const showSequence = useCallback(async (seq: number[]) => {
    setIsShowingSequence(true);
    setMessage(`Memorize a sequência de ${seq.length} cristal${seq.length > 1 ? 'is' : ''}!`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (let i = 0; i < seq.length; i++) {
      setActiveCrystal(seq[i]);
      playNote(crystals[seq[i]].sound);
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveCrystal(null);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    setIsShowingSequence(false);
    startTime.current = Date.now();
    setMessage('Agora é sua vez! Repita a sequência!');
    speak('Agora é sua vez! Repita a sequência!');
  }, [speed, playNote, speak]);

  // Clique no cristal
  const handleCrystalClick = useCallback((crystalId: number) => {
    if (!isPlaying || isShowingSequence) return;

    // Registra tempo de resposta
    if (startTime.current) {
      responseTimes.current.push(Date.now() - startTime.current);
      startTime.current = Date.now();
    }

    const newPlayerSequence = [...playerSequence, crystalId];
    setPlayerSequence(newPlayerSequence);
    
    // Feedback visual e sonoro
    setActiveCrystal(crystalId);
    playNote(crystals[crystalId].sound);
    setTimeout(() => setActiveCrystal(null), 300);

    // Verifica se está correto
    const currentIndex = newPlayerSequence.length - 1;
    
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      // Erro
      handleError();
    } else if (newPlayerSequence.length === sequence.length) {
      // Sequência completa
      handleSuccess();
    } else {
      // Continua
      setMetrics(prev => ({
        ...prev,
        correctAttempts: prev.correctAttempts + 1
      }));
    }
  }, [isPlaying, isShowingSequence, playerSequence, sequence, playNote]);

  // Sucesso
  const handleSuccess = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      correctAttempts: prev.correctAttempts + 1
    }));

    // Calcula pontos
    let points = sequence.length * 10;
    if (responseTimes.current.length > 0) {
      const avgTime = responseTimes.current.reduce((a, b) => a + b, 0) / responseTimes.current.length;
      if (avgTime < 1000) points *= 2;
    }
    
    setScore(prev => prev + points);
    setLevel(Math.floor(sequence.length / 3) + 1);
    
    playSuccess();
    
    const messages = [
      'Fantástico! Você tem uma memória mágica!',
      'Incrível! O Mago Simon está impressionado!',
      'Maravilhoso! Você está ficando cada vez melhor!',
      'Excelente! Continue assim, jovem mago!'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
    speak(randomMessage);
    
    // Aumenta velocidade
    if (sequence.length % 5 === 0 && speed > 300) {
      setSpeed(prev => prev - 50);
    }
    
    setTimeout(() => nextRound(), 1500);
  }, [sequence, speed, nextRound, playSuccess, speak]);

  // Erro
  const handleError = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      wrongAttempts: prev.wrongAttempts + 1
    }));
    
    setIsPlaying(false);
    playError();
    
    const finalMessage = `Ops! Você chegou até a sequência ${sequence.length - 1}! Muito bem!`;
    setMessage(finalMessage);
    speak(finalMessage);
    
    setTimeout(() => endGame(), 1500);
  }, [sequence, playError, speak]);

  // Fim de jogo
  const endGame = useCallback(() => {
    const sessionDuration = sessionStart.current ? Date.now() - sessionStart.current : 0;
    const avgResponseTime = responseTimes.current.length > 0
      ? responseTimes.current.reduce((a, b) => a + b, 0) / responseTimes.current.length
      : 0;
    
    setMetrics(prev => ({
      ...prev,
      totalScore: score,
      sessionDuration,
      averageResponseTime: avgResponseTime
    }));
    
    setShowResults(true);
    
    // Aqui você salvaria no Supabase
    console.log('Métricas:', {
      maxSequence: metrics.maxSequence,
      score,
      sessionDuration,
      avgResponseTime
    });
  }, [score, metrics.maxSequence]);

  // Power-ups
  const usePowerUp = useCallback((type: 'replay' | 'slow') => {
    if (powerUps[type] <= 0 || !isPlaying || isShowingSequence) return;
    
    setPowerUps(prev => ({ ...prev, [type]: prev[type] - 1 }));
    setMetrics(prev => ({ ...prev, powerUpsUsed: prev.powerUpsUsed + 1 }));
    
    if (type === 'replay') {
      setMessage('Mostrando a sequência novamente!');
      speak('Mostrando a sequência novamente!');
      showSequence(sequence);
    } else if (type === 'slow') {
      setSpeed(1000);
      setMessage('Velocidade reduzida ativada!');
      speak('Velocidade reduzida ativada!');
    }
  }, [powerUps, isPlaying, isShowingSequence, sequence, showSequence, speak]);

  // Reset
  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setScore(0);
    setSpeed(600);
    setPowerUps({ replay: 1, slow: 1 });
    setShowResults(false);
    setMetrics({
      maxSequence: 0,
      totalScore: 0,
      correctAttempts: 0,
      wrongAttempts: 0,
      averageResponseTime: 0,
      sessionDuration: 0,
      powerUpsUsed: 0,
    });
    setMessage('Jogo reiniciado! Clique em COMEÇAR para jogar novamente!');
    speak('Jogo reiniciado! Clique em COMEÇAR para jogar novamente!');
  }, [speak]);

  // Calcular estrelas
  const calculateStars = () => {
    if (metrics.maxSequence >= 10) return 5;
    if (metrics.maxSequence >= 8) return 4;
    if (metrics.maxSequence >= 5) return 3;
    if (metrics.maxSequence >= 3) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl">
                  🧙
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Simon Mágico</h1>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-600">Nível</span>
                <p className="text-xl font-bold text-gray-800">{level}</p>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-600">Pontos</span>
                <p className="text-xl font-bold text-gray-800">{score}</p>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-600">Sequência</span>
                <p className="text-xl font-bold text-gray-800">{sequence.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Message Area */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-lg text-gray-800 flex-1">{message}</p>
            <button
              onClick={() => speak(message)}
              className="ml-4 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
              aria-label="Repetir instrução"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Crystals Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {crystals.map((crystal) => (
            <button
              key={crystal.id}
              onClick={() => handleCrystalClick(crystal.id)}
              disabled={!isPlaying || isShowingSequence}
              className={`
                aspect-square rounded-2xl flex items-center justify-center text-6xl
                bg-gradient-to-br ${crystal.gradient}
                transform transition-all duration-300 shadow-lg
                ${activeCrystal === crystal.id ? 'scale-110 ring-4 ring-white/50' : ''}
                ${!isPlaying || isShowingSequence ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
              `}
              aria-label={`Cristal ${crystal.color}`}
            >
              {crystal.emoji}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={startGame}
            disabled={isPlaying}
            className="flex-1 py-4 px-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors text-lg"
          >
            COMEÇAR
          </button>
          <button
            onClick={resetGame}
            className="flex-1 py-4 px-6 bg-white hover:bg-gray-100 text-purple-600 font-bold rounded-full transition-colors text-lg border-2 border-purple-600"
          >
            REINICIAR
          </button>
        </div>

        {/* Power-ups */}
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button
            onClick={() => usePowerUp('replay')}
            disabled={powerUps.replay === 0 || !isPlaying || isShowingSequence}
            className={`
              relative p-3 bg-white/95 rounded-xl shadow-lg transition-all
              ${powerUps.replay > 0 && isPlaying && !isShowingSequence 
                ? 'hover:scale-110 ring-2 ring-yellow-400' 
                : 'opacity-50 cursor-not-allowed'}
            `}
            aria-label="Repetir sequência"
          >
            <RotateCcw className="w-6 h-6 text-purple-600" />
            {powerUps.replay > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {powerUps.replay}
              </span>
            )}
          </button>
          
          <button
            onClick={() => usePowerUp('slow')}
            disabled={powerUps.slow === 0 || !isPlaying || isShowingSequence}
            className={`
              relative p-3 bg-white/95 rounded-xl shadow-lg transition-all
              ${powerUps.slow > 0 && isPlaying && !isShowingSequence 
                ? 'hover:scale-110 ring-2 ring-yellow-400' 
                : 'opacity-50 cursor-not-allowed'}
            `}
            aria-label="Velocidade lenta"
          >
            <Clock className="w-6 h-6 text-purple-600" />
            {powerUps.slow > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {powerUps.slow}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-bounce-in">
            <h2 className="text-3xl font-bold text-purple-600 text-center mb-4">
              🎉 Parabéns!
            </h2>
            
            <div className="text-5xl text-center mb-6">
              {'⭐'.repeat(calculateStars())}
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Sequência máxima:</span>
                <strong className="text-gray-800">{metrics.maxSequence}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pontuação total:</span>
                <strong className="text-gray-800">{score}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tempo médio:</span>
                <strong className="text-gray-800">
                  {metrics.averageResponseTime ? 
                    `${(metrics.averageResponseTime / 1000).toFixed(1)}s` : 'N/A'}
                </strong>
              </div>
            </div>
            
            <button
              onClick={resetGame}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-colors"
            >
              JOGAR NOVAMENTE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
