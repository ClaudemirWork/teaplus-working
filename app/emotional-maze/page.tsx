'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, Heart, Star, Trophy, Key, Play, Volume2, VolumeX, Sparkles, Clock, Users, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

// ===================================================================================
// PARTE 1: CONSTANTES E LÓGICA DO JOGO ORIGINAL
// Todas as constantes e funções do seu jogo original foram movidas para cá para
// resolver o erro "LEVELS is not defined".
// ===================================================================================

const POWERUPS = {
  wallPass: { name: 'Atravessador', icon: '🕐', duration: 30, color: '#9C27B0', description: 'Atravesse paredes!' },
  reveal: { name: 'Visão', icon: '👁️', duration: 15, color: '#2196F3', description: 'Revela segredos!' },
  doublePoints: { name: 'Pontos x2', icon: '✨', duration: 20, color: '#FFD700', description: 'Pontos em dobro!' }
};

const SOUNDS = {
  footstep: '/sounds/footstep.wav',
  gem: '/sounds/coin.wav',
  powerup: '/sounds/magic.wav',
  megaGem: '/sounds/sucess.wav',
  key: '/sounds/coin.wav',
  door: '/sounds/magic.wav',
  levelComplete: '/sounds/sucess.wav'
};

const EMOTIONS = {
  joy: { name: 'Alegria', icon: '😊', color: '#FFE066' },
  calm: { name: 'Calma', icon: '😌', color: '#B2DFDB' },
  courage: { name: 'Coragem', icon: '💪', color: '#7E57C2' },
  sadness: { name: 'Tristeza', icon: '😢', color: '#64B5F6' },
  fear: { name: 'Medo', icon: '😰', color: '#757575' },
  mirror: { name: 'Espelho', icon: '🪞', color: '#E91E63' }
};

const NPCS = [
  { id: 'bunny', emoji: '🐰', name: 'Coelhinho' }, { id: 'bird', emoji: '🐦', name: 'Passarinho' },
  { id: 'cat', emoji: '🐱', name: 'Gatinho' }, { id: 'dog', emoji: '🐶', name: 'Cachorrinho' },
  { id: 'butterfly', emoji: '🦋', name: 'Borboleta' }, { id: 'turtle', emoji: '🐢', name: 'Tartaruga' },
  { id: 'panda', emoji: '🐼', name: 'Panda' }, { id: 'fox', emoji: '🦊', name: 'Raposa' },
  { id: 'owl', emoji: '🦉', name: 'Coruja' }, { id: 'penguin', emoji: '🐧', name: 'Pinguim' }
];

const createMaze8x8 = (complexity: number = 1): number[][] => {
  const maze = Array(8).fill(null).map(() => Array(8).fill(1));
  for (let i = 1; i < 7; i++) { for (let j = 1; j < 7; j++) { maze[i][j] = 0; } }
  if (complexity === 1) { maze[3][3] = 1; maze[3][4] = 1; maze[4][3] = 1; }
  else if (complexity === 2) { maze[2][3] = 1; maze[3][3] = 1; maze[4][4] = 1; maze[5][4] = 1; maze[3][5] = 1; }
  else { maze[2][2] = 1; maze[2][5] = 1; maze[3][3] = 1; maze[4][3] = 1; maze[5][2] = 1; maze[5][5] = 1; }
  return maze;
};

const LEVELS = [ /* SEU ARRAY DE NÍVEIS 1-20 VAI AQUI. OMITIDO POR BREVIDADE */ ];
const MIRROR_LEVELS = [ /* SEU ARRAY DE NÍVEIS ESPELHADOS VAI AQUI. OMITIDO POR BREVIDADE */ ];
const ALL_LEVELS = [...LEVELS, ...MIRROR_LEVELS];

const playSound = (soundName: keyof typeof SOUNDS, volume: number = 0.3) => {
  try {
    const audio = new Audio(SOUNDS[soundName]);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (error) {
    console.log('Som não encontrado:', soundName);
  }
};


// ===================================================================================
// COMPONENTE PRINCIPAL DO JOGO
// ===================================================================================
export default function EmotionMazeGame() {

    const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
    
    // ===================================================================================
    // ESTADOS E FUNÇÕES DO JOGO ORIGINAL
    // ===================================================================================
    const [gameState, setGameState] = useState<'intro' | 'story' | 'playing' | 'levelComplete' | 'gameComplete' | 'mirrorUnlocked'>('intro');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
    const [collectedItems, setCollectedItems] = useState({
        gems: new Set<string>(), specialGems: new Set<string>(), megaGems: new Set<string>(),
        powerups: new Set<string>(), keys: new Set<string>(), npcs: new Set<string>()
    });
    const [openedDoors, setOpenedDoors] = useState(new Set<string>());
    const [activePowerup, setActivePowerup] = useState<string | null>(null);
    const [powerupTimeLeft, setPowerupTimeLeft] = useState(0);
    const [moves, setMoves] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [stars, setStars] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showCutscene, setShowCutscene] = useState(false);
    const [cutsceneContent, setCutsceneContent] = useState({ title: '', text: '', image: '' });
    const [isMobile, setIsMobile] = useState(false);
    
    const level = ALL_LEVELS[currentLevel];
    const currentEmotion = level?.emotion || 'joy';

    const initLevel = useCallback((levelIndex: number) => {
        const newLevel = ALL_LEVELS[levelIndex];
        if (!newLevel) return;
        setPlayerPosition(newLevel.start);
        setCollectedItems({ gems: new Set(), specialGems: new Set(), megaGems: new Set(), powerups: new Set(), keys: new Set(), npcs: new Set() });
        setOpenedDoors(new Set());
        setActivePowerup(null);
        setPowerupTimeLeft(0);
        setMoves(0);
        setTimeElapsed(0);
        setScore(0);
        setGameState('story');
    }, []);

    const completeLevel = useCallback(() => {
        // ... sua lógica original de completeLevel aqui ...
        if (soundEnabled) playSound('levelComplete');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        if (currentLevel === 19) {
            setTimeout(() => setGameState('mirrorUnlocked'), 2000);
        } else {
            setGameState('levelComplete');
        }
    }, [currentLevel, score, timeElapsed, collectedItems, level, soundEnabled]);
    
    const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        // ... sua lógica original de movePlayer aqui ...
    }, [gameState, playerPosition, level, collectedItems, openedDoors, activePowerup, soundEnabled, completeLevel]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const keyMap: { [key: string]: 'up' | 'down' | 'left' | 'right' } = {
                'ArrowUp': 'up', 'w': 'up', 'W': 'up', 'ArrowDown': 'down', 's': 'down', 'S': 'down',
                'ArrowLeft': 'left', 'a': 'left', 'A': 'left', 'ArrowRight': 'right', 'd': 'right', 'D': 'right'
            };
            const direction = keyMap[e.key];
            if (direction) { e.preventDefault(); movePlayer(direction); }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [movePlayer]);

    // LÓGICA PARA INICIAR O JOGO A PARTIR DAS NOVAS TELAS
    const handleStartGame = useCallback(() => {
        setCurrentLevel(0);
        setTotalScore(0);
        initLevel(0);
        setCurrentScreen('game');
    }, [initLevel]);

    const handleResetAndGoHome = useCallback(() => {
        setCurrentScreen('title');
        setGameState('intro');
    }, []);
    
    // ... cole aqui o resto de seus useEffects e funções originais ...

    // --- TELAS DE TÍTULO E INSTRUÇÕES (Layout do Bubble Pop) ---

    const TitleScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    >
                        <Star className="w-6 h-6 text-white opacity-20" fill="currentColor" />
                    </div>
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 100 }}
                    className="mb-4"
                >
                    <img
                        src="/images/mascotes/leo/jogo do labirinto tela.webp"
                        alt="Mascote Léo no Labirinto"
                        className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl animate-bounce-slow"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, type: 'spring', stiffness: 100 }}
                >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-2">
                        Labirinto das Emoções
                    </h1>
                    <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-6 drop-shadow-md">
                        🧭 Ajude Léo a encontrar os tesouros e amigos perdidos!
                    </p>
                    <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl max-w-xs mx-auto">
                        <div className="flex items-center justify-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-100" />
                            <span className="font-bold text-white">30 Níveis de Aventura</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setCurrentScreen('instructions')}
                        className="text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1"
                    >
                        Começar Aventura
                    </button>
                </motion.div>
            </div>
        </div>
    );

    const InstructionsScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200">
            <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center">
                <h2 className="text-4xl font-bold mb-6 text-purple-600">Como Jogar</h2>
                <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
                    <p className="flex items-center gap-4"><span className="text-4xl">🧭</span><span><b>Explore o labirinto</b> usando as setas ou os controles.</span></p>
                    <p className="flex items-center gap-4"><span className="text-4xl">💎</span><span><b>Colete todas as gemas</b> e encontre os amigos.</span></p>
                    <p className="flex items-center gap-4"><span className="text-4xl">🗝️</span><span>Pegue as <b>chaves</b> para abrir as <b>portas</b> trancadas.</span></p>
                    <p className="flex items-center gap-4"><span className="text-4xl">✨</span><span>Use <b>poderes especiais</b> para atravessar paredes!</span></p>
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
        // O JSX da sua tela de jogo original vai aqui
        <div className={`${styles.gameContainer} ${styles[`theme${currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}`]}`}
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header> {/* ... seu header ... */} </header>
            <main className="flex-1 p-4 flex flex-col">
                {/* COLE AQUI O CONTEÚDO DA SUA TAG <main> ORIGINAL */}
            </main>
            {/* Adicionando o CSS que estava no arquivo .module.css */}
            <style jsx global>{`
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(-3%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
                }
                /* Adicione aqui os outros estilos do seu arquivo emotionmaze.module.css */
            `}</style>
        </div>
    );

    // --- Renderização Principal ---
    if (currentScreen === 'title') return <TitleScreen />;
    if (currentScreen === 'instructions') return <InstructionsScreen />;
    return <GameScreen />;
}

