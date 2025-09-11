'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, Heart, Star, Trophy, Key, Play, Volume2, VolumeX, Sparkles, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './emotionmaze.module.css';

// ↓↓↓↓ COPIE SUAS CONSTANTES (LEVELS, NPCS, EMOTIONS, etc.) PARA CÁ ↓↓↓↓
// Exemplo:
// const POWERUPS = { ... };
// const SOUNDS = { ... };
// const EMOTIONS = { ... };
// const NPCS = [ ... ];
// const createMaze8x8 = (complexity) => { ... };
// const LEVELS = [ ... ];
// const ALL_LEVELS = [ ... ]; // Se você tiver esta também

// COMPONENTE PRINCIPAL REESTRUTURADO
export default function EmotionMazeGame() {
    const [currentScreen, setCurrentScreen] = useState<'titleScreen' | 'instructions' | 'game'>('titleScreen');

    // --- COPIE TODOS OS SEUS ESTADOS ORIGINAIS DO JOGO PARA CÁ ---
    const [gameState, setGameState] = useState<'story' | 'playing' | 'levelComplete' | 'gameComplete' | 'mirrorUnlocked'>('story');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
    // ... (cole aqui o resto dos seus useState, useRef, etc.)
    const [totalScore, setTotalScore] = useState(0);

    // --- COPIE TODAS AS SUAS FUNÇÕES ORIGINAIS DO JOGO PARA CÁ ---
    // Exemplo:
    const initLevel = useCallback((levelIndex: number) => {
        // ... sua lógica original de initLevel
    }, []); // Adicione as dependências corretas

    // ... (cole aqui movePlayer, completeLevel, etc.)

    // LÓGICA PARA INICIAR O JOGO A PARTIR DAS NOVAS TELAS
    const handleStartGame = useCallback(() => {
        setCurrentLevel(0);
        setTotalScore(0);
        initLevel(0);
        setGameState('story');
        setCurrentScreen('game');
    }, [initLevel]); // Garanta que initLevel esteja nas dependências

    const handleResetAndGoHome = useCallback(() => {
        setCurrentScreen('titleScreen');
        setGameState('story');
        setCurrentLevel(0);
        setTotalScore(0);
    }, []);

    // --- NOVAS TELAS DE TÍTULO E INSTRUÇÕES ---

    const TitleScreen = () => (
        <div className="relative w-full h-screen flex flex-col justify-center items-center p-4 overflow-hidden bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center"
            >
                {/* Imagem do Mascote ACIMA do texto */}
                <Image
                    src="/images/mascotes/leo/leo_rosto_resultado.webp"
                    alt="Mascote Léo"
                    width={200}
                    height={200}
                    className="w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-4 drop-shadow-lg"
                    priority
                />

                <h1 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-lg mb-2">
                    Labirinto das Emoções
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mt-2 mb-6 drop-shadow-md">
                    Ajude Léo a encontrar os tesouros e amigos perdidos!
                </p>

                <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl max-w-xs mx-auto">
                    <div className="flex items-center justify-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-100" />
                        <span className="font-bold text-white">30 Níveis de Aventura</span>
                    </div>
                </div>

                <button
                    onClick={() => setCurrentScreen('instructions')}
                    className="text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1"
                >
                    Começar Aventura
                </button>
            </motion.div>
        </div>
    );

    const InstructionsScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200">
            <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center">
                <h2 className="text-4xl font-bold mb-6 text-purple-600">Como Jogar</h2>
                <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
                    <p className="flex items-center gap-4">
                        <span className="text-4xl">🧭</span>
                        <span><b>Explore o labirinto</b> usando as setas do teclado ou os controles na tela.</span>
                    </p>
                    <p className="flex items-center gap-4">
                        <span className="text-4xl">💎</span>
                        <span><b>Colete todas as gemas</b> e encontre os amigos perdidos para ganhar mais pontos.</span>
                    </p>
                    <p className="flex items-center gap-4">
                        <span className="text-4xl">🗝️</span>
                        <span>Pegue as <b>chaves</b> para abrir as <b>portas</b> trancadas no seu caminho.</span>
                    </p>
                    <p className="flex items-center gap-4">
                        <span className="text-4xl">✨</span>
                        <span>Use <b>poderes especiais</b> para atravessar paredes ou ganhar pontos em dobro!</span>
                    </p>
                </div>

                <button
                    onClick={handleStartGame}
                    className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform"
                >
                    Vamos jogar! 🚀
                </button>
            </div>
        </div>
    );

    const GameScreen = () => (
        // Cole aqui o JSX da sua GameScreen original. Exemplo:
        <div className={`${styles.gameContainer} ${styles.themeJoy /* Adapte para a emoção atual */}`}
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header> {/* ... seu header original ... */} </header>
            <main> {/* ... sua main original com a lógica de renderização do labirinto ... */} </main>
        </div>
    );

    // --- RENDERIZAÇÃO CONDICIONAL DAS TELAS ---
    if (currentScreen === 'titleScreen') {
        return <TitleScreen />;
    }
    if (currentScreen === 'instructions') {
        return <InstructionsScreen />;
    }
    // Se não for nenhuma das telas acima, é a tela do jogo
    return <GameScreen />;
}
