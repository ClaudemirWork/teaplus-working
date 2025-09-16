// app/bubble-pop/page.tsx
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

  // O motor do jogo é chamado aqui!
  const game = useBubblePopGame(gameAreaRef);

  // Lógica para transição de telas
  const handleStart = () => setCurrentScreen('instructions');
  const handlePlay = () => {
    game.startActivity();
    setCurrentScreen('game');
  };
  const handleRestart = () => {
    game.voltarInicio();
    setCurrentScreen('title');
  };

  // Detecta quando o jogo acaba para mostrar os resultados
  useEffect(() => {
    if (game.showResults) {
      setCurrentScreen('results');
    }
  }, [game.showResults]);

  // Renderização condicional
  if (currentScreen === 'title') {
    return <TitleScreen onStart={handleStart} toggleAudio={game.toggleAudio} audioEnabled={game.audioEnabled} />;
  }

  if (currentScreen === 'instructions') {
    return <InstructionsScreen onPlay={handlePlay} />;
  }
  
  if (currentScreen === 'game') {
    return <GameScreen ref={gameAreaRef} {...game} onBack={handleRestart} />;
  }
  
  if (currentScreen === 'results') {
    return <ResultsScreen {...game} onRestart={handleRestart} />;
  }

  return null;
}
