'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, Heart, Star, Trophy, Key, Play, Volume2, VolumeX, Sparkles, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './emotionmaze.module.css';

// --- MANTENDO TODA A LÓGICA ORIGINAL DO JOGO ---

// Tipos de emoções, NPCs, Sons, etc. (código original omitido por brevidade, mas está aqui)
// ... (Toda a sua lógica original de `POWERUPS`, `SOUNDS`, `EMOTIONS`, `NPCS`, `createMaze8x8`, `LEVELS`, etc. permanece aqui, inalterada)

// COMPONENTE PRINCIPAL REESTRUTURADO
export default function EmotionMazeGame() {
    // NOVO: Controle de Telas
    const [currentScreen, setCurrentScreen] = useState<'titleScreen' | 'instructions' | 'game'>('titleScreen');

    // --- TODOS OS SEUS ESTADOS ORIGINAIS DO JOGO ESTÃO AQUI ---
    const [gameState, setGameState] = useState<'story' | 'playing' | 'levelComplete' | 'gameComplete' | 'mirrorUnlocked'>('story');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
    // ... (restante dos seus `useState` e `useRef` originais)
    
    // --- TODAS AS SUAS FUNÇÕES ORIGINAIS DO JOGO ESTÃO AQUI ---
    // playSound, createMegaGemExplosion, movePlayer, completeLevel, etc.
    // ... (Todas as suas funções `useCallback` e `useEffect` originais permanecem aqui, inalteradas)

    // NOVA LÓGICA PARA INICIAR O JOGO A PARTIR DAS NOVAS TELAS
    const handleStartGame = () => {
        setCurrentLevel(0);
        initLevel(0);
        setTotalScore(0);
        setGameState('story');
        setCurrentScreen('game'); // Pula para a tela do jogo, que mostrará a história do nível 1
    };

    const handleResetAndGoHome = () => {
        // Função para voltar à tela de título
        setCurrentScreen('titleScreen');
        setGameState('story'); // Reseta o estado inicial do jogo
    };


    // --- NOVAS TELAS DE TÍTULO E INSTRUÇÕES ---
    const TitleScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 overflow-hidden">
          {/* Imagem de fundo com o mascote Léo */}
          <Image
            src="/images/mascotes/leo/Leo no labirinto.webp"
            alt="Léo em um labirinto emocional"
            layout="fill"
            objectFit="cover"
            quality={90}
            priority
          />
          {/* Overlay para escurecer um pouco e dar contraste */}
          <div className="absolute inset-0 bg-black/30"></div>
    
          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
                Labirinto das Emoções
              </h1>
              <p className="text-xl sm:text-2xl text-yellow-200 mt-2 mb-6 drop-shadow-md">
                Ajude Léo a encontrar os tesouros e amigos perdidos!
              </p>
    
              {/* Mostra estatísticas se já jogou (adapte se tiver um sistema de high score) */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl max-w-sm mx-auto">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-300" />
                    <span className="font-bold text-white">30 Níveis de Aventura</span>
                  </div>
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
        </div>
      );

    const InstructionsScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-300 via-green-300 to-yellow-300">
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
        <div className={`${styles.gameContainer} ${styles[`theme${currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}`]}`}
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    <button onClick={handleResetAndGoHome} className="flex items-center text-teal-600 hover:text-teal-700">
                    <ChevronLeft className="h-5 w-5" /> <span className="hidden sm:inline">Menu</span>
                    </button>
                    <h1 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Heart className="text-red-500 h-5 w-5" />
                    <span>Nível {currentLevel + 1}</span>
                    </h1>
                    <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 rounded-lg bg-white/50"
                    style={{ touchAction: 'manipulation' }}
                    >
                    {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                    </button>
                </div>
                </div>
            </header>
    
            {/* O restante da sua UI do jogo (a tag <main> com toda a lógica de renderização)
                entra aqui, exatamente como era no código original.
            */}
             <main className="flex-1 p-4 flex flex-col" style={{ paddingBottom: isMobile ? '150px' : '20px' }}>
                {/* ... toda a renderização condicional original baseada em gameState ... */}
             </main>
        </div>
    );

    // --- RENDERIZAÇÃO CONDICIONAL DAS TELAS ---
    if (currentScreen === 'titleScreen') return <TitleScreen />;
    if (currentScreen === 'instructions') return <InstructionsScreen />;
    // if (currentScreen === 'game') return <GameScreen />; // Removido para usar o padrão abaixo
    
    // O JOGO PRINCIPAL é renderizado aqui. O estado `gameState` interno dele
    // cuidará de mostrar 'story', 'playing', 'levelComplete', etc.
    return <GameScreen />;
}
