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
    const [totalStars, setTotalStars] = useState(0);
    const [bestScore, setBestScore] = useState(0);

    // 1. O "motor" do jogo é chamado aqui e nos dá tudo que precisamos.
    const game = useBubblePopGame(gameAreaRef);

    // Efeito para carregar dados salvos do localStorage apenas uma vez
    useEffect(() => {
        const savedStars = localStorage.getItem('bubblePop_totalStars');
        const savedBest = localStorage.getItem('bubblePop_bestScore');
        if (savedStars) setTotalStars(parseInt(savedStars));
        if (savedBest) setBestScore(parseInt(savedBest));
    }, []);

    // 2. Funções simples para controlar qual tela é mostrada
    const handleStart = () => setCurrentScreen('instructions');
    
    const handlePlay = () => {
        game.startActivity();
        setCurrentScreen('game');
    };
    
    const handleRestart = () => {
        game.voltarInicio();
        setCurrentScreen('title');
    };

    // 3. Efeito que observa o estado do jogo e muda para a tela de resultados quando o jogo termina
    useEffect(() => {
        if (game.showResults) {
            // Atualiza os recordes no final do jogo
            // ALTERADO: Agora calcula estrelas baseado na pontuação (100 pontos = 1 estrela)
            const newStars = totalStars + Math.floor(game.score / 100);
            localStorage.setItem('bubblePop_totalStars', newStars.toString());
            setTotalStars(newStars);

            if (game.score > bestScore) {
                localStorage.setItem('bubblePop_bestScore', game.score.toString());
                setBestScore(game.score);
            }
            setCurrentScreen('results');
        }
    }, [game.showResults, game.score, totalStars, bestScore]);

    // 4. Lógica de renderização: mostra um componente de cada vez
    if (currentScreen === 'title') {
        return <TitleScreen onStart={handleStart} toggleAudio={game.toggleAudio} audioEnabled={game.audioEnabled} totalStarsCollected={totalStars} bestScore={bestScore} />;
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

    return null; // Tela de carregamento, se necessário
}
