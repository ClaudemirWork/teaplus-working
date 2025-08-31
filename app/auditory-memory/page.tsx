'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Play, RotateCcw, Trophy, Brain, Target, Zap, Music, Sparkles, ArrowRight } from 'lucide-react';

interface GameStats {
  level: number;
  score: number;
  highScore: number;
  correctSequences: number;
  totalAttempts: number;
}

interface GameConfig {
  sequenceLength: number;
  playbackSpeed: number;
  noteDuration: number;
  minFreq: number;
  maxFreq: number;
}

const AuditoryMemoryGame: React.FC = () => {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'game'>('welcome');
  
  // Game state
  const [gameState, setGameState] = useState<'idle' | 'demo' | 'input' | 'success' | 'fail'>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentNote, setCurrentNote] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  // Game statistics
  const [stats, setStats] = useState<GameStats>({
    level: 1,
    score: 0,
    highScore: 0,
    correctSequences: 0,
    totalAttempts: 0
  });

  // Game configuration based on level
  const [config, setConfig] = useState<GameConfig>({
    sequenceLength: 3,
    playbackSpeed: 600,
    noteDuration: 400,
    minFreq: 200,
    maxFreq: 800
  });

  // Audio context and oscillator refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Note frequencies (pentatonic scale for pleasant sounds)
  const frequencies = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25  // E5
  ];

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      // Load high score from localStorage
      const savedHighScore = localStorage.getItem('auditoryMemoryHighScore');
      if (savedHighScore) {
        setStats(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play a single note
  const playNote = useCallback((frequency: number, duration: number = 400) => {
    if (!soundEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    // Stop any existing oscillator
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }

    const oscillator = audioContextRef.current.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    
    oscillator.connect(gainNodeRef.current);
    
    // Envelope for smoother sound
    gainNodeRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime);
    gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNodeRef.current.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.01);
    gainNodeRef.current.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
    
    oscillatorRef.current = oscillator;
  }, [soundEnabled]);

  // Generate new sequence
  const generateSequence = useCallback(() => {
    const newSequence = [];
    for (let i = 0; i < config.sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * 8));
    }
    setSequence(newSequence);
    return newSequence;
  }, [config.sequenceLength]);

  // Play the sequence
  const playSequence = useCallback(async (seq: number[]) => {
    setIsPlaying(true);
    setGameState('demo');
    
    for (let i = 0; i < seq.length; i++) {
      setCurrentNote(seq[i]);
      playNote(frequencies[seq[i]], config.noteDuration);
      
      await new Promise(resolve => setTimeout(resolve, config.playbackSpeed));
      
      if (i < seq.length - 1) {
        setCurrentNote(null);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setCurrentNote(null);
    setIsPlaying(false);
    setGameState('input');
    setUserSequence([]);
  }, [playNote, config.noteDuration, config.playbackSpeed, frequencies]);

  // Start new game
  const startGame = useCallback(() => {
    const newSequence = generateSequence();
    setUserSequence([]);
    setShowSuccess(false);
    setShowError(false);
    playSequence(newSequence);
  }, [generateSequence, playSequence]);

  // Handle note button click
  const handleNoteClick = useCallback((noteIndex: number) => {
    if (gameState !== 'input' || isPlaying) return;
    
    playNote(frequencies[noteIndex], 300);
    const newUserSequence = [...userSequence, noteIndex];
    setUserSequence(newUserSequence);
    setCurrentNote(noteIndex);
    
    setTimeout(() => setCurrentNote(null), 300);
    
    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      const isCorrect = newUserSequence.every((note, index) => note === sequence[index]);
      
      setStats(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        correctSequences: isCorrect ? prev.correctSequences + 1 : prev.correctSequences
      }));
      
      if (isCorrect) {
        handleSuccess();
      } else {
        handleFailure();
      }
    }
  }, [gameState, isPlaying, userSequence, sequence, playNote, frequencies]);

  // Handle successful sequence
  const handleSuccess = useCallback(() => {
    setGameState('success');
    setShowSuccess(true);
    
    const pointsEarned = config.sequenceLength * 10 * stats.level;
    const newScore = stats.score + pointsEarned;
    const newHighScore = Math.max(newScore, stats.highScore);
    
    setStats(prev => ({
      ...prev,
      score: newScore,
      highScore: newHighScore
    }));
    
    // Save high score
    localStorage.setItem('auditoryMemoryHighScore', newHighScore.toString());
    
    // Success sound
    if (soundEnabled && audioContextRef.current && gainNodeRef.current) {
      setTimeout(() => playNote(523.25, 150), 100);
      setTimeout(() => playNote(659.25, 150), 250);
      setTimeout(() => playNote(783.99, 300), 400);
    }
    
    // Progress to next level
    setTimeout(() => {
      setShowSuccess(false);
      const newLevel = stats.level + 1;
      
      setStats(prev => ({ ...prev, level: newLevel }));
      
      // Increase difficulty
      if (newLevel % 3 === 0) {
        setConfig(prev => ({
          ...prev,
          sequenceLength: Math.min(prev.sequenceLength + 1, 12)
        }));
      }
      
      if (newLevel % 5 === 0) {
        setConfig(prev => ({
          ...prev,
          playbackSpeed: Math.max(prev.playbackSpeed - 50, 300)
        }));
      }
      
      startGame();
    }, 2000);
  }, [config.sequenceLength, stats.level, stats.score, stats.highScore, soundEnabled, playNote, startGame]);

  // Handle failed sequence
  const handleFailure = useCallback(() => {
    setGameState('fail');
    setShowError(true);
    
    // Error sound
    if (soundEnabled && audioContextRef.current) {
      playNote(185, 500);
    }
    
    setTimeout(() => {
      setShowError(false);
      playSequence(sequence);
    }, 2000);
  }, [soundEnabled, playNote, playSequence, sequence]);

  // Reset game
  const resetGame = () => {
    setGameState('idle');
    setSequence([]);
    setUserSequence([]);
    setCurrentNote(null);
    setIsPlaying(false);
    setShowSuccess(false);
    setShowError(false);
    setStats(prev => ({
      level: 1,
      score: 0,
      highScore: prev.highScore,
      correctSequences: 0,
      totalAttempts: 0
    }));
    setConfig({
      sequenceLength: 3,
      playbackSpeed: 600,
      noteDuration: 400,
      minFreq: 200,
      maxFreq: 800
    });
  };

  // Replay sequence
  const replaySequence = () => {
    if (!isPlaying && gameState === 'input' && sequence.length > 0) {
      setUserSequence([]);
      playSequence(sequence);
    }
  };

  // Calculate accuracy
  const accuracy = stats.totalAttempts > 0 
    ? Math.round((stats.correctSequences / stats.totalAttempts) * 100) 
    : 0;

  // Welcome Screen Component
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          {/* Mila Avatar - Using actual image */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="relative w-40 h-40 animate-bounce">
                <Image 
                  src="/images/mascotes/mila/mila_sinal_positivo_resultado.webp"
                  alt="Mila - Assistente Musical"
                  width={160}
                  height={160}
                  className="object-contain"
                  priority
                />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-blue-400 animate-pulse" />
              <Music className="absolute bottom-0 right-0 w-8 h-8 text-purple-400 animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Memória Auditiva
          </h1>
          
          {/* Mila's Introduction */}
          <div className="bg-white/10 rounded-2xl p-6 mb-6">
            <p className="text-blue-200 text-lg leading-relaxed mb-4">
              Olá! Eu sou a <span className="text-purple-300 font-bold">Mila</span>, sua assistente musical! 🎵
            </p>
            <p className="text-blue-200 text-lg leading-relaxed mb-4">
              Preparei um desafio incrível para treinar sua memória auditiva! Você vai ouvir sequências de notas musicais e precisará repeti-las na ordem correta.
            </p>
            <p className="text-blue-200 text-lg leading-relaxed">
              Quanto mais sequências você acertar, mais difícil fica o desafio! Vamos ver até onde sua memória musical pode chegar? 🌟
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 text-center">
              <Brain className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-300 font-semibold">Memória</p>
              <p className="text-green-200 text-sm">Fortaleça sua capacidade de memorização</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-300 font-semibold">Concentração</p>
              <p className="text-blue-200 text-sm">Melhore seu foco e atenção</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 text-center">
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-purple-300 font-semibold">Desafio</p>
              <p className="text-purple-200 text-sm">Supere seus limites a cada nível</p>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={() => setCurrentScreen('game')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-3"
          >
            Começar Aventura
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* High Score Preview */}
          {stats.highScore > 0 && (
            <div className="mt-4 text-center">
              <p className="text-yellow-400 text-sm">
                Seu recorde: <span className="font-bold text-lg">{stats.highScore}</span> pontos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Game Screen Component
  const GameScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="w-12 h-12 text-yellow-400" />
            Auditory Memory
          </h1>
          <p className="text-blue-200 text-lg">Train your musical memory and pattern recognition</p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-yellow-400 text-sm font-semibold">Level</div>
              <div className="text-white text-2xl font-bold">{stats.level}</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-sm font-semibold">Score</div>
              <div className="text-white text-2xl font-bold">{stats.score}</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 text-sm font-semibold">High Score</div>
              <div className="text-white text-2xl font-bold">{stats.highScore}</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 text-sm font-semibold">Accuracy</div>
              <div className="text-white text-2xl font-bold">{accuracy}%</div>
            </div>
            <div className="text-center">
              <div className="text-pink-400 text-sm font-semibold">Sequence</div>
              <div className="text-white text-2xl font-bold">{config.sequenceLength}</div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-6">
          {/* Note Buttons */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {frequencies.map((freq, index) => (
              <button
                key={index}
                onClick={() => handleNoteClick(index)}
                disabled={gameState !== 'input' || isPlaying}
                className={`
                  h-24 rounded-xl font-bold text-xl transition-all duration-200 transform
                  ${currentNote === index 
                    ? 'bg-yellow-400 text-gray-900 scale-110 shadow-2xl' 
                    : gameState === 'input' && !isPlaying
                      ? 'bg-white/20 hover:bg-white/30 text-white hover:scale-105'
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }
                  ${userSequence.includes(index) && gameState === 'input' ? 'ring-2 ring-green-400' : ''}
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Progress Indicator */}
          {gameState === 'input' && (
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70 text-sm">Progress</span>
                <span className="text-white text-sm font-semibold">
                  {userSequence.length} / {sequence.length}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(userSequence.length / sequence.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Status Messages */}
          {showSuccess && (
            <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-4 mb-6 text-center animate-pulse">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
              <p className="text-green-400 text-xl font-bold">Perfect! +{config.sequenceLength * 10 * (stats.level - 1)} points</p>
            </div>
          )}

          {showError && (
            <div className="bg-red-500/20 border-2 border-red-400 rounded-xl p-4 mb-6 text-center">
              <p className="text-red-400 text-xl font-bold">Try Again! Listen carefully...</p>
            </div>
          )}

          {gameState === 'idle' && (
            <div className="text-center text-white/70">
              <p className="text-lg mb-2">Press Start to begin your training!</p>
              <p className="text-sm">Listen to the sequence, then repeat it back.</p>
            </div>
          )}

          {gameState === 'demo' && (
            <div className="text-center text-yellow-400">
              <Zap className="w-12 h-12 mx-auto mb-2 animate-pulse" />
              <p className="text-xl font-semibold">Listen carefully...</p>
            </div>
          )}

          {gameState === 'input' && !showSuccess && !showError && (
            <div className="text-center text-blue-400">
              <Target className="w-12 h-12 mx-auto mb-2" />
              <p className="text-xl font-semibold">Your turn! Repeat the sequence.</p>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          {gameState === 'idle' && (
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Game
            </button>
          )}

          {gameState === 'input' && (
            <button
              onClick={replaySequence}
              disabled={isPlaying}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-5 h-5" />
              Replay
            </button>
          )}

          {gameState !== 'idle' && (
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Reset Game
            </button>
          )}

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors shadow-lg flex items-center gap-2"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <h2 className="text-white text-xl font-bold mb-3">How to Play:</h2>
          <ul className="text-blue-200 space-y-2">
            <li>• Listen carefully to the sequence of notes</li>
            <li>• Click the numbered buttons in the same order</li>
            <li>• Each successful round increases your score</li>
            <li>• The sequence gets longer as you progress</li>
            <li>• Challenge yourself to beat your high score!</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Main render
  return currentScreen === 'welcome' ? <WelcomeScreen /> : <GameScreen />;
};

export default AuditoryMemoryGame;
