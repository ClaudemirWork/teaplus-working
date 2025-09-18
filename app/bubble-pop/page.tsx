'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBubblePopGame } from './hooks/useBubblePopGame';
import { TitleScreen } from './components/TitleScreen';
import { InstructionsScreen } from './components/InstructionsScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';

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
    game.startActivity();
    setCurrentScreen('game');
  };

  const handleRestart = () => {
    game.voltarInicio();
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
        isPlaying={game.isPlaying}
        score={game.score}
        combo={game.combo}
        oxygenLevel={game.oxygenLevel}
        bubbles={game.bubbles}
        particles={game.particles}
        currentLevel={game.currentLevel}
        bubblesRemaining={game.bubblesRemaining}
        levelConfigs={game.levelConfigs}
        handleInteraction={game.handleInteraction}
        audioEnabled={game.audioEnabled}
        toggleAudio={game.toggleAudio}
        showLevelTransition={game.showLevelTransition}
        levelMessage={game.levelMessage}
        fishCollection={game.fishCollection}
        equipment={game.equipment}
        savedFish={game.savedFish}
        multiplier={game.multiplier}
        multiplierTime={game.multiplierTime}
        magnetActive={game.magnetActive}
        magnetTime={game.magnetTime}
        showBossLevel={game.showBossLevel}
        bossDefeated={game.bossDefeated}
        freedCreatures={game.freedCreatures}
        bubblesSpawned={game.bubblesSpawned}
        levelCompleted={game.levelCompleted}
      />
    );
  }

  if (currentScreen === 'results') {
    return (
      <ResultsScreen
        score={game.score}
        maxCombo={game.maxCombo}
        completedLevels={game.completedLevels}
        salvando={game.salvando}
        onRestart={handleRestart}
        handleSaveSession={game.handleSaveSession}
        accuracy={game.accuracy}
        poppedBubbles={game.poppedBubbles}
        fishCollection={game.fishCollection}
        unlockedGear={game.unlockedGear}
        levelConfigs={game.levelConfigs}
      />
    );
  }

  return null;
}
