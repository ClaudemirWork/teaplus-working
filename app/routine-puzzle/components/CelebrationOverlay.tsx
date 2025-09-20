'use client';

import React, { useEffect, useState } from 'react';

interface CelebrationOverlayProps {
  celebrationQueue: string[];
  onCelebrationComplete?: () => void;
}

export default function CelebrationOverlay({ 
  celebrationQueue, 
  onCelebrationComplete 
}: CelebrationOverlayProps) {
  const [currentCelebration, setCurrentCelebration] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [showGoldenGem, setShowGoldenGem] = useState(false);

  useEffect(() => {
    if (celebrationQueue.length > 0 && !currentCelebration) {
      const celebration = celebrationQueue[0];
      setCurrentCelebration(celebration);
      triggerCelebrationAnimation(celebration);
    }
  }, [celebrationQueue, currentCelebration]);

  const triggerCelebrationAnimation = (type: string) => {
    switch (type) {
      case 'task':
        // Animação simples para completar tarefa
        setShowStars(true);
        playSuccessSound();
        setTimeout(() => {
          setShowStars(false);
          completeCelebration();
        }, 1500);
        break;

      case 'streak':
        // Animação de confetes para sequência
        setShowConfetti(true);
        playMagicSound();
        setTimeout(() => {
          setShowConfetti(false);
          completeCelebration();
        }, 3000);
        break;

      case 'day':
        // Animação de gema dourada para dia completo
        setShowGoldenGem(true);
        playMagicSound();
        setTimeout(() => {
          setShowGoldenGem(false);
          completeCelebration();
        }, 4000);
        break;

      case 'level':
        // Animação completa para subir de nível
        setShowGoldenGem(true);
        setShowConfetti(true);
        playMagicSound();
        setTimeout(() => {
          setShowGoldenGem(false);
          setShowConfetti(false);
          completeCelebration();
        }, 5000);
        break;

      default:
        completeCelebration();
        break;
    }
  };

  const completeCelebration = () => {
    setCurrentCelebration(null);
    if (onCelebrationComplete) {
      onCelebrationComplete();
    }
  };

  const playSuccessSound = () => {
    try {
      const audio = new Audio('/sounds/sucess.wav');
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Não foi possível tocar o som:', e));
    } catch (error) {
      console.log('Som não disponível');
    }
  };

  const playMagicSound = () => {
    try {
      const audio = new Audio('/sounds/magic.wav');
      audio.volume = 0.4;
      audio.play().catch(e => console.log('Não foi possível tocar o som:', e));
    } catch (error) {
      console.log('Som não disponível');
    }
  };

  const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    const confettiElements = [];

    for (let i = 0; i < 50; i++) {
      const confetti = {
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
        animationDelay: Math.random() * 3,
        animationDuration: 3 + Math.random() * 2
      };
      confettiElements.push(confetti);
    }

    return confettiElements;
  };

  const createStars = () => {
    const starElements = [];
    const positions = [
      { x: -100, y: -100 },
      { x: 100, y: -100 },
      { x: -100, y: 100 },
      { x: 100, y: 100 },
      { x: 0, y: -120 },
      { x: -120, y: 0 },
      { x: 120, y: 0 },
      { x: 0, y: 120 }
    ];

    positions.forEach((pos, index) => {
      starElements.push({
        id: index,
        x: pos.x,
        y: pos.y,
        delay: index * 0.1
      });
    });

    return starElements;
  };

  const getCelebrationMessage = (type: string): string => {
    switch (type) {
      case 'task':
        return 'Tarefa Completa!';
      case 'streak':
        return 'Sequência Incrível!';
      case 'day':
        return 'Dia Completo!';
      case 'level':
        return 'Subiu de Nível!';
      default:
        return 'Parabéns!';
    }
  };

  if (!currentCelebration) return null;

  return (
    <>
      {/* Confetti Container */}
      {showConfetti && (
        <div className="confetti-container">
          {createConfetti().map(confetti => (
            <div
              key={confetti.id}
              className="confetti"
              style={{
                backgroundColor: confetti.color,
                left: `${confetti.left}%`,
                animationDelay: `${confetti.animationDelay}s`,
                animationDuration: `${confetti.animationDuration}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Stars Celebration */}
      {showStars && (
        <div className="stars-celebration">
          {createStars().map(star => (
            <div
              key={star.id}
              className="star"
              style={{
                '--x': `${star.x}px`,
                '--y': `${star.y}px`,
                animationDelay: `${star.delay}s`
              } as React.CSSProperties}
            >
              ⭐
            </div>
          ))}
        </div>
      )}

      {/* Golden Gem */}
      {showGoldenGem && (
        <div className="golden-gem-container">
          <div className="golden-gem">💎</div>
          <div className="gem-message">
            {getCelebrationMessage(currentCelebration)}
          </div>
        </div>
      )}

      {/* Simple Success Notification */}
      {currentCelebration === 'task' && !showGoldenGem && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-bold animate-bounce shadow-2xl">
            ✓ {getCelebrationMessage(currentCelebration)}
          </div>
        </div>
      )}
    </>
  );
}
