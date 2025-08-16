'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Pause, RotateCcw, Music, Timer, Target, Trophy, Volume2 } from 'lucide-react';

export default function RhythmAttention() {
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [currentSequence, setCurrentSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowingPattern, setIsShowingPattern] = useState(false);
  const [isWaitingInput, setIsWaitingInput] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [lives, setLives] = useState(3);
  const [sequenceLength, setSequenceLength] = useState(3);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const audioContext = useRef<AudioContext | null>(null);

  // Rhythm patterns for different difficulty levels
  const rhythmButtons = [
    { id: 1, color: 'bg-red-500', sound: 261.63, label: '🔴' }, // C4
    { id: 2, color: 'bg-blue-500', sound: 329.63, label: '🔵' }, // E4
    { id: 3, color: 'bg-green-500', sound: 392.00, label: '🟢' }, // G4
    { id: 4, color: 'bg-yellow-500', sound: 523.25, label: '🟡' }  // C5
  ];

  const getLevelConfig = () => {
    switch(level) {
      case 1: return { sequenceLength: 3, speed: 800, buttons: 3, timeBonus: 100 };
      case 2: return { sequenceLength: 4, speed: 600, buttons: 4, timeBonus: 150 };
      case 3: return { sequenceLength: 5, speed: 500, buttons: 4, timeBonus: 200 };
      default: return { sequenceLength: 3, speed: 800, buttons: 3, timeBonus: 100 };
    }
  };

  // Initialize audio context
  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && timeRemaining > 0 && !gameCompleted) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsPlaying(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeRemaining, gameCompleted]);

  const playSound = useCallback((frequency: number, duration: number = 200) => {
    if (audioContext.current) {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration / 1000);
      
      oscillator.start(audioContext.current.currentTime);
      oscillator.stop(audioContext.current.currentTime + duration / 1000);
    }
  }, []);

  const generateSequence = useCallback(() => {
    const config = getLevelConfig();
    const sequence = [];
    for (let i = 0; i < config.sequenceLength; i++) {
      sequence.push(Math.floor(Math.random() * config.buttons) + 1);
    }
    return sequence;
  }, [level]);

  const showPattern = useCallback((sequence: number[]) => {
    setIsShowingPattern(true);
    setCurrentStep(0);
    
    const config = getLevelConfig();
    
    sequence.forEach((buttonId, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
        const button = rhythmButtons.find(b => b.id === buttonId);
        if (button) {
          playSound(button.sound);
        }
        
        if (index === sequence.length - 1) {
          setTimeout(() => {
            setIsShowingPattern(false);
            setIsWaitingInput(true);
            setCurrentStep(0);
          }, config.speed);
        }
      }, index * config.speed);
    });
  }, [playSound, level]);

  const startNewRound = useCallback(() => {
    const newSequence = generateSequence();
    setCurrentSequence(newSequence);
    setUserSequence([]);
    showPattern(newSequence);
  }, [generateSequence, showPattern]);

  const startActivity = () => {
    setIsPlaying(true);
    setTimeRemaining(90);
    setScore(0);
    setLevel(1);
    setLives(3);
    setAccuracy(100);
    setGameCompleted(false);
    startNewRound();
  };

  const pauseActivity = () => {
    setIsPlaying(false);
  };

  const resetActivity = () => {
    setIsPlaying(false);
    setTimeRemaining(90);
    setScore(0);
    setLevel(1);
    setLives(3);
    setAccuracy(100);
    setGameCompleted(false);
    setCurrentSequence([]);
    setUserSequence([]);
    setIsShowingPattern(false);
    setIsWaitingInput(false);
    setCurrentStep(0);
  };

  const handleButtonClick = useCallback((buttonId: number) => {
    if (!isWaitingInput || isShowingPattern) return;

    const newUserSequence = [...userSequence, buttonId];
    setUserSequence(newUserSequence);

    const button = rhythmButtons.find(b => b.id === buttonId);
    if (button) {
      playSound(button.sound, 150);
    }

    // Check if the current input is correct
    const isCorrect = newUserSequence[newUserSequence.length - 1] === currentSequence[newUserSequence.length - 1];
    
    if (!isCorrect) {
      setLives(prev => prev - 1);
      setAccuracy(prev => Math.max(0, prev - 10));
      setFeedbackMessage('❌ Sequência incorreta!');
      setShowFeedback(true);
      
      setTimeout(() => setShowFeedback(false), 1000);
      
      if (lives <= 1) {
        setIsPlaying(false);
        setGameCompleted(true);
        return;
      }
      
      // Restart the round
      setTimeout(() => {
        startNewRound();
      }, 1500);
      return;
    }

    // Check if sequence is completed
    if (newUserSequence.length === currentSequence.length) {
      const config = getLevelConfig();
      const basePoints = 50 * level;
      const timeBonus = Math.floor(timeRemaining / 5) * 2;
      const accuracyBonus = Math.floor(accuracy / 10) * 5;
      
      setScore(prev => prev + basePoints + timeBonus + accuracyBonus);
      setFeedbackMessage('✅ Perfeito!');
      setShowFeedback(true);
      
      setTimeout(() => setShowFeedback(false), 1000);
      
      // Check if level completed (5 successful sequences)
      if (score + basePoints + timeBonus + accuracyBonus >= level * 300) {
        if (level < 3) {
          setTimeout(() => {
            setLevel(prev => prev + 1);
            setLives(3);
            setAccuracy(100);
            startNewRound();
          }, 1500);
        } else {
          setGameCompleted(true);
          setIsPlaying(false);
        }
      } else {
        // Next sequence in same level
        setTimeout(() => {
          startNewRound();
        }, 1500);
      }
    }
  }, [isWaitingInput, isShowingPattern, userSequence, currentSequence, playSound, lives, level, score, timeRemaining, accuracy, startNewRound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getButtonClass = (buttonId: number) => {
    const button = rhythmButtons.find(b => b.id === buttonId);
    if (!button) return '';
    
    const baseClass = `w-20 h-20 rounded-full border-4 transition-all duration-200 flex items-center justify-center text-2xl font-bold ${button.color} text-white`;
    
    if (isShowingPattern && currentStep > 0 && currentSequence[currentStep - 1] === buttonId) {
      return `${baseClass} scale-110 border-white shadow-lg`;
    }
    
    return `${baseClass} border-gray-300 hover:scale-105 active:scale-95`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>← Voltar</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 rounded-full bg-purple-500 text-white font-medium flex items-center space-x-2">
                <Music size={16} />
                <span>Ritmo e Atenção</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <Music className="mr-3 text-purple-600" size={40} />
              Ritmo e Atenção
            </h1>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Objetivo */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-red-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  🎯 Objetivo:
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Observe a sequência de cores/sons apresentada e reproduza-a exatamente na mesma ordem. Desenvolva atenção auditiva, memória sequencial e coordenação temporal.
                </p>
              </div>
            </div>

            {/* Pontuação */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  👥 Pontuação:
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Sequência correta = +50 pontos × nível. Bônus de tempo: +2 pontos por cada 5 segundos restantes. Bônus de precisão: +5 pontos por cada 10% de acurácia. Meta: 300 pontos por nível.
                </p>
              </div>
            </div>

            {/* Níveis */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-purple-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  📊 Níveis:
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <p><strong className="text-purple-600">Nível 1:</strong> 3 tons, sequência de 3 (fácil)</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> 4 tons, sequência de 4 (médio)</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> 4 tons, sequência de 5 (difícil)</p>
                </div>
              </div>
            </div>

            {/* Final */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-green-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  🏁 Final:
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Complete todos os 3 níveis atingindo 300 pontos em cada um. Você tem 3 vidas por nível. Mantenha alta precisão para maximizar os bônus.
                </p>
              </div>
            </div>
          </div>

          {/* Game Area */}
          {isPlaying || gameCompleted ? (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {/* Game Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 px-4 py-2 rounded-lg">
                    <span className="text-purple-800 font-medium">Nível {level}/3</span>
                  </div>
                  <div className="bg-blue-100 px-4 py-2 rounded-lg">
                    <span className="text-blue-800 font-medium">Pontos: {score}</span>
                  </div>
                  <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                    <span className="text-yellow-800 font-medium">Precisão: {accuracy}%</span>
                  </div>
                  <div className="bg-green-100 px-4 py-2 rounded-lg">
                    <span className="text-green-800 font-medium">Vidas: {'❤️'.repeat(lives)}</span>
                  </div>
                </div>
                <div className="bg-red-100 px-4 py-2 rounded-lg flex items-center">
                  <Timer className="mr-2 text-red-600" size={16} />
                  <span className="text-red-800 font-medium">{formatTime(timeRemaining)}</span>
                </div>
              </div>

              {/* Game Completed */}
              {gameCompleted && (
                <div className="text-center mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Trophy className="mx-auto text-green-600 mb-2" size={32} />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    {lives > 0 ? 'Jogo Completo!' : 'Fim de Jogo!'}
                  </h3>
                  <p className="text-green-700 mb-4">
                    {lives > 0 
                      ? `Parabéns! Pontuação final: ${score} pontos com ${accuracy}% de precisão.`
                      : `Suas vidas acabaram! Pontuação final: ${score} pontos.`
                    }
                  </p>
                </div>
              )}

              {/* Status Messages */}
              <div className="text-center mb-6">
                {isShowingPattern && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <Volume2 className="mx-auto text-blue-600 mb-2" size={24} />
                    <p className="text-blue-800 font-medium">🎵 Observe a sequência... {currentStep}/{currentSequence.length}</p>
                  </div>
                )}
                
                {isWaitingInput && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 font-medium">🎯 Agora reproduza a sequência!</p>
                    <p className="text-yellow-600 text-sm">Progresso: {userSequence.length}/{currentSequence.length}</p>
                  </div>
                )}

                {showFeedback && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <p className="text-purple-800 font-medium text-lg">{feedbackMessage}</p>
                  </div>
                )}
              </div>

              {/* Rhythm Buttons */}
              <div className="flex justify-center space-x-6 mb-6">
                {rhythmButtons.slice(0, getLevelConfig().buttons).map((button) => (
                  <button
                    key={button.id}
                    onClick={() => handleButtonClick(button.id)}
                    className={getButtonClass(button.id)}
                    disabled={isShowingPattern || !isWaitingInput || gameCompleted}
                  >
                    {button.label}
                  </button>
                ))}
              </div>

              {/* Current Sequence Display */}
              {userSequence.length > 0 && (
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-2">Sua sequência:</p>
                  <div className="flex justify-center space-x-2">
                    {userSequence.map((buttonId, index) => {
                      const button = rhythmButtons.find(b => b.id === buttonId);
                      return (
                        <div key={index} className="text-2xl">
                          {button?.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={pauseActivity}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  disabled={gameCompleted}
                >
                  <Pause size={20} />
                  <span>Pausar</span>
                </button>
                <button
                  onClick={resetActivity}
                  className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <RotateCcw size={20} />
                  <span>Reiniciar</span>
                </button>
              </div>
            </div>
          ) : (
            /* Start Screen */
            <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-6">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Pronto para o desafio rítmico?
              </h3>
              <p className="text-gray-600 mb-6">
                Clique em "Iniciar Ritmo" para começar o treino de atenção auditiva e memória sequencial
              </p>
              <button
                onClick={startActivity}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium transition-colors mx-auto"
              >
                <Play size={20} />
                <span>Iniciar Ritmo</span>
              </button>
            </div>
          )}

          {/* Base Científica */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              🧬 Base Científica:
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Este exercício é baseado em terapias de processamento auditivo e timing neural. 
              Estimula o córtex auditivo primário (processamento de sons), cerebelo (timing e coordenação) e áreas pré-frontais (memória de trabalho). 
              O treinamento rítmico melhora atenção sustentada, processamento temporal e sincronização neural, aspectos críticos para pessoas com TDAH.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
