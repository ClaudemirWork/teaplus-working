// app/bubble-pop/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBubblePopGame } from './hooks/useBubblePopGame';
import { TitleScreen } from './components/TitleScreen';
import { InstructionsScreen } from './components/InstructionsScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';
import styles from './bubble-pop.module.css';

export default function BubblePopPage() {
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game' | 'results'>('title');
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [totalStars, setTotalStars] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const game = useBubblePopGame(gameAreaRef);

  useEffect(() => {
    const savedBest = localStorage.getItem('bubblePop_bestScore');
    if (savedBest) setBestScore(parseInt(savedBest));
  }, []);

  const handleStart = () => setCurrentScreen('instructions');

  const handlePlay = () => {
    game.startGame(); // ✅ FUNÇÃO CORRETA
    setCurrentScreen('game');
  };

  const handleRestart = () => {
    game.restartGame(); // ✅ FUNÇÃO CORRETA
    setCurrentScreen('title');
  };

  useEffect(() => {
    if (game.showResults) {
      if (game.score > bestScore) {
        localStorage.setItem('bubblePop_bestScore', game.score.toString());
        setBestScore(game.score);
      }
      setCurrentScreen('results');
    }
  }, [game.showResults, game.score, bestScore]);

  if (currentScreen === 'title') {
    return (
      <TitleScreen 
        onStart={handleStart} 
        toggleAudio={game.toggleAudio}
        audioEnabled={game.audioEnabled}
        totalStarsCollected={totalStars}
        bestScore={bestScore} 
      />
    );
  }

  if (currentScreen === 'instructions') {
    return <InstructionsScreen onPlay={handlePlay} />;
  }

  if (currentScreen === 'game') {
    return (
      <GameScreen 
        ref={gameAreaRef} 
        {...game} 
      />
    );
  }

  if (currentScreen === 'results') {
    return (
      <ResultsScreen 
        {...game} 
        onRestart={handleRestart} 
      />
    );
  }

  return null;
}
