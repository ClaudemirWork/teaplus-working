'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Heart, Star, Trophy, Key, Play, Volume2, VolumeX, Sparkles, Clock, Users, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

// ===================================================================================
// PARTE 1: CONSTANTES E LÓGICA DO JOGO (INTEGRADO)
// ===================================================================================

const POWERUPS = {
    wallPass: { name: 'Atravessador', icon: '🕐', duration: 30, color: '#9C27B0', description: 'Atravesse paredes!' },
    reveal: { name: 'Visão', icon: '👁️', duration: 15, color: '#2196F3', description: 'Revela segredos!' },
    doublePoints: { name: 'Pontos x2', icon: '✨', duration: 20, color: '#FFD700', description: 'Pontos em dobro!' }
};
const SOUNDS = {
    footstep: '/sounds/footstep.wav', gem: '/sounds/coin.wav', powerup: '/sounds/magic.wav',
    megaGem: '/sounds/sucess.wav', key: '/sounds/coin.wav', door: '/sounds/magic.wav', levelComplete: '/sounds/sucess.wav'
};
const EMOTIONS = {
    joy: { name: 'Alegria', icon: '😊', color: '#FFE066' }, calm: { name: 'Calma', icon: '😌', color: '#B2DFDB' },
    courage: { name: 'Coragem', icon: '💪', color: '#7E57C2' }, sadness: { name: 'Tristeza', icon: '😢', color: '#64B5F6' },
    fear: { name: 'Medo', icon: '😰', color: '#757575' }, mirror: { name: 'Espelho', icon: '🪞', color: '#E91E63' }
};
const NPCS = [
    { id: 'bunny', emoji: '🐰', name: 'Coelhinho' }, { id: 'bird', emoji: '🐦', name: 'Passarinho' }, { id: 'cat', emoji: '🐱', name: 'Gatinho' },
    { id: 'dog', emoji: '🐶', name: 'Cachorrinho' }, { id: 'butterfly', emoji: '🦋', name: 'Borboleta' }, { id: 'turtle', emoji: '🐢', name: 'Tartaruga' },
    { id: 'panda', emoji: '🐼', name: 'Panda' }, { id: 'fox', emoji: '🦊', name: 'Raposa' }, { id: 'owl', emoji: '🦉', name: 'Coruja' }, { id: 'penguin', emoji: '🐧', name: 'Pinguim' }
];
const MOTIVATIONAL_MESSAGES = ['INCRÍVEL!', 'SENSACIONAL!', 'FANTÁSTICO!', 'VOCÊ É DEMAIS!', 'SUPER!', 'ESPETACULAR!', 'MARAVILHOSO!', 'GENIAL!'];

const createMaze8x8 = (complexity: number = 1): number[][] => {
    const maze = Array(8).fill(null).map(() => Array(8).fill(1));
    for (let i = 1; i < 7; i++) { for (let j = 1; j < 7; j++) { maze[i][j] = 0; } }
    if (complexity === 1) { maze[3][3] = 1; maze[3][4] = 1; maze[4][3] = 1; }
    else if (complexity === 2) { maze[2][3] = 1; maze[3][3] = 1; maze[4][4] = 1; maze[5][4] = 1; maze[3][5] = 1; }
    else { maze[2][2] = 1; maze[2][5] = 1; maze[3][3] = 1; maze[4][3] = 1; maze[5][2] = 1; maze[5][5] = 1; }
    return maze;
};

// COLE SEU ARRAY "LEVELS" COMPLETO AQUI PARA QUE O JOGO FUNCIONE
const LEVELS: any[] = [
    // MUNDO 1 (Níveis 1-10)
    { id: 1, name: 'Primeiro Passo', story: 'Apenas chegue ao final! Sem pressão!', emotion: 'joy', size: 8, grid: createMaze8x8(1), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [], gems: [], specialGems: [], megaGems: [], powerups: [], keys: [], doors: [], perfectTime: 30 },
    { id: 2, name: 'Primeira Gema', story: 'Pegue sua primeira gema!', emotion: 'joy', size: 8, grid: createMaze8x8(1), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [], gems: [{ x: 4, y: 4, type: 'normal' }], specialGems: [], megaGems: [], powerups: [], keys: [], doors: [], perfectTime: 35 },
    // ... COLE O RESTANTE DOS SEUS NÍVEIS AQUI ...
    // É ESSENCIAL QUE TODOS OS 30 NÍVEIS ESTEJAM AQUI.
];

const ALL_LEVELS = [...LEVELS]; // Adicione os MIRROR_LEVELS se os tiver

const playSound = (soundName: keyof typeof SOUNDS, volume: number = 0.3) => { try { const audio = new Audio(SOUNDS[soundName]); audio.volume = volume; audio.play().catch(() => {}); } catch (e) {} };


// ===================================================================================
// COMPONENTE PRINCIPAL DO JOGO
// ===================================================================================
export default function EmotionMazeGame() {

    const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
    
    // Estados do Jogo
    const [gameState, setGameState] = useState<'intro' | 'story' | 'playing' | 'levelComplete' | 'gameComplete' | 'mirrorUnlocked'>('intro');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
    const [collectedItems, setCollectedItems] = useState({ gems: new Set<string>(), specialGems: new Set<string>(), megaGems: new Set<string>(), powerups: new Set<string>(), keys: new Set<string>(), npcs: new Set<string>() });
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

    const completeLevel = useCallback(() => {
        const timeBonus = Math.max(0, level.perfectTime - timeElapsed) * 5;
        const finalScore = score + timeBonus;
        setScore(finalScore);
        setTotalScore(prev => prev + finalScore);
        
        let earnedStars = 1;
        const totalGems = (level.gems?.length || 0) + (level.specialGems?.length || 0) + (level.megaGems?.length || 0);
        const collectedGems = collectedItems.gems.size + collectedItems.specialGems.size + collectedItems.megaGems.size;
        if (collectedGems === totalGems && collectedItems.npcs.size === level.npcs?.length) { earnedStars = 3; }
        else if (timeElapsed <= level.perfectTime) { earnedStars = 2; }
        setStars(earnedStars);

        if (soundEnabled) playSound('levelComplete');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setGameState('levelComplete');
    }, [score, timeElapsed, level, collectedItems, soundEnabled]);

    const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameState !== 'playing') return;
        const newPos = { ...playerPosition };
        switch(direction) {
            case 'up': newPos.y = Math.max(0, newPos.y - 1); break;
            case 'down': newPos.y = Math.min(7, newPos.y + 1); break;
            case 'left': newPos.x = Math.max(0, newPos.x - 1); break;
            case 'right': newPos.x = Math.min(7, newPos.x + 1); break;
        }
        if (level.grid[newPos.y][newPos.x] === 1 && activePowerup !== 'wallPass') return;
        setPlayerPosition(newPos);
        setMoves(prev => prev + 1);
        if (soundEnabled) playSound('footstep', 0.1);
        if (newPos.x === level.end.x && newPos.y === level.end.y) { completeLevel(); }
    }, [gameState, playerPosition, level, activePowerup, soundEnabled, completeLevel]);
    
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
        setCutsceneContent({ title: newLevel.name, text: newLevel.story, image: EMOTIONS[newLevel.emotion as keyof typeof EMOTIONS].icon });
        setShowCutscene(true);
    }, []);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (gameState === 'playing') {
                const keyMap: { [key: string]: 'up' | 'down' | 'left' | 'right' } = { 'ArrowUp': 'up', 'w': 'up', 'ArrowDown': 'down', 's': 'down', 'ArrowLeft': 'left', 'a': 'left', 'ArrowRight': 'right', 'd': 'right' };
                if (keyMap[e.key]) movePlayer(keyMap[e.key]);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [movePlayer, gameState]);

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

    const nextLevel = () => {
        if (currentLevel < ALL_LEVELS.length - 1) {
            const nextLevelIndex = currentLevel + 1;
            setCurrentLevel(nextLevelIndex);
            initLevel(nextLevelIndex);
        } else {
            setGameState('gameComplete');
        }
    };
    
    const renderCell = (x: number, y: number) => {
        const isWall = level.grid[y][x] === 1;
        const isPlayer = playerPosition.x === x && playerPosition.y === y;
        const isEnd = x === level.end.x && y === level.end.y;
        const cellSize = isMobile ? '35px' : '45px';
        const fontSize = isMobile ? '16px' : '20px';
    
        return (
            <div key={`${x}-${y}`} className={`flex items-center justify-center relative ${isWall ? 'bg-gray-700' : 'bg-gray-200'}`} style={{ width: cellSize, height: cellSize, fontSize: fontSize }}>
                {isPlayer && <span className="text-2xl">🧑</span>}
                {isEnd && !isPlayer && <span>🎯</span>}
                {/* Adicione a renderização de gemas, npcs, etc. aqui */}
            </div>
        );
    };

    // --- TELAS DE INTERFACE ---
    const TitleScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (<div key={i} className="absolute animate-pulse" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, animationDuration: `${3 + Math.random() * 2}s` }}><Star className="w-6 h-6 text-white opacity-20" fill="currentColor" /></div>))}
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 100 }} className="mb-4">
                    <img src="/images/mascotes/leo/jogo do labirinto tela.webp" alt="Mascote Léo no Labirinto" className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl animate-bounce-slow" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4, type: 'spring', stiffness: 100 }}>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-2">Labirinto das Emoções</h1>
                    <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-6 drop-shadow-md">🧭 Ajude Léo a encontrar os tesouros e amigos perdidos!</p>
                    <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl max-w-xs mx-auto"><div className="flex items-center justify-center gap-2"><Trophy className="w-6 h-6 text-yellow-100" /><span className="font-bold text-white">30 Níveis de Aventura</span></div></div>
                    <button onClick={() => setCurrentScreen('instructions')} className="text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1">Começar Aventura</button>
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
                <button onClick={handleStartGame} className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform">Vamos jogar! 🚀</button>
            </div>
        </div>
    );

    const GameScreen = () => (
        <div className={`flex flex-col min-h-screen bg-gray-100`}>
            <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10"><div className="max-w-7xl mx-auto px-4"><div className="flex items-center justify-between h-14"><button onClick={handleResetAndGoHome} className="flex items-center text-teal-600 hover:text-teal-700"><ChevronLeft className="h-5 w-5" /> <span className="hidden sm:inline">Menu</span></button><h1 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2"><Compass className="text-blue-500 h-5 w-5" /><span>Nível {currentLevel + 1}</span></h1><button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-white/50">{soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}</button></div></div></header>
            <main className="flex-1 p-4 flex flex-col items-center justify-center">
                <AnimatePresence>
                    {gameState === 'story' && showCutscene && (
                        <motion.div key="cutscene" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center bg-white/80 p-8 rounded-2xl shadow-lg max-w-md">
                            <div className="text-5xl mb-4">{cutsceneContent.image}</div>
                            <h2 className="text-2xl font-bold mb-3 text-gray-800">{cutsceneContent.title}</h2>
                            <p className="text-md text-gray-700 mb-6">{cutsceneContent.text}</p>
                            <button onClick={() => { setGameState('playing'); setShowCutscene(false); }} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors">Começar</button>
                        </motion.div>
                    )}
                    {gameState === 'playing' && level && (
                        <motion.div key="gameplay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="grid" style={{ gridTemplateColumns: `repeat(${level.size}, 1fr)` }}>
                                {level.grid.map((row: any[], y: number) => row.map((cell: any, x: number) => renderCell(x, y)))}
                            </div>
                        </motion.div>
                    )}
                    {gameState === 'levelComplete' && ( <motion.div key="levelComplete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white/80 p-8 rounded-2xl shadow-lg max-w-md"><h2 className="text-3xl font-bold mb-4 text-green-600">Nível Completo!</h2><p>Pontos: {score}</p><button onClick={nextLevel} className="w-full mt-4 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors">Próximo Nível</button></motion.div> )}
                    {gameState === 'gameComplete' && ( <motion.div key="gameComplete" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white/80 p-8 rounded-2xl shadow-lg max-w-md"><h2 className="text-3xl font-bold mb-4 text-yellow-500">Jogo Concluído!</h2><p>Pontuação Final: {totalScore}</p><button onClick={handleResetAndGoHome} className="w-full mt-4 bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors">Jogar Novamente</button></motion.div> )}
                </AnimatePresence>
            </main>
            <style jsx global>{`
                .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
                @keyframes bounce-slow { 0%, 100% { transform: translateY(-4%); } 50% { transform: translateY(0); } }
            `}</style>
        </div>
    );

    if (currentScreen === 'title') return <TitleScreen />;
    if (currentScreen === 'instructions') return <InstructionsScreen />;
    return <GameScreen />;
}

