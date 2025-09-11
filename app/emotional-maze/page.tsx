'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, Heart, Star, Trophy, Key, Play, Volume2, VolumeX, Sparkles, Clock, Users, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

// ===================================================================================
// PARTE 1: CONSTANTES E LÓGICA DO JOGO ORIGINAL
//
// COPIE E COLE AQUI SUAS CONSTANTES E FUNÇÕES AUXILIARES DO JOGO ORIGINAL.
// ISSO INCLUI `POWERUPS`, `SOUNDS`, `EMOTIONS`, `NPCS`, `createMaze8x8`, `LEVELS`, etc.
// ESTA É A ETAPA MAIS IMPORTANTE PARA O JOGO FUNCIONAR.
// ===================================================================================

// EXEMPLO - SUBSTITUA PELAS SUAS CONSTANTES REAIS:
const EMOTIONS = { joy: { name: 'Alegria', icon: '😊' } };
const createMaze8x8 = () => Array(8).fill(Array(8).fill(0)); // Função de exemplo
const ALL_LEVELS = [
    { id: 1, name: 'Primeiro Passo', story: 'Apenas chegue ao final!', emotion: 'joy', size: 8, grid: createMaze8x8(1), start: { x: 1, y: 1 }, end: { x: 6, y: 6 }, npcs: [], gems: [], specialGems: [], megaGems: [], powerups: [], keys: [], doors: [], perfectTime: 30 },
    // ... cole o restante dos seus níveis aqui
];
const playSound = (sound: string, volume: number = 0.3) => { /* sua função de som */ };


// ===================================================================================
// COMPONENTE PRINCIPAL DO JOGO
// ===================================================================================
export default function EmotionMazeGame() {

    const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');

    // ===================================================================================
    // PARTE 2: ESTADOS (useState) E LÓGICA (useCallback, useEffect) DO JOGO
    //
    // COPIE E COLE AQUI TODOS OS SEUS `useState`, `useRef`, `useCallback` e `useEffect`
    // DO SEU COMPONENTE ORIGINAL DO LABIRINTO.
    // ===================================================================================
    const [gameState, setGameState] = useState<'intro' | 'story' | 'playing' | 'levelComplete' | 'gameComplete' | 'mirrorUnlocked'>('intro');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
    const [totalScore, setTotalScore] = useState(0);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [stars, setStars] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showCutscene, setShowCutscene] = useState(false);
    const [cutsceneContent, setCutsceneContent] = useState({ title: '', text: '', image: '' });
    const [collectedItems, setCollectedItems] = useState({
        gems: new Set<string>(), specialGems: new Set<string>(), megaGems: new Set<string>(),
        powerups: new Set<string>(), keys: new Set<string>(), npcs: new Set<string>()
    });
     const [openedDoors, setOpenedDoors] = useState(new Set<string>());
     const [activePowerup, setActivePowerup] = useState<string | null>(null);
     const [powerupTimeLeft, setPowerupTimeLeft] = useState(0);

    const level = ALL_LEVELS[currentLevel];
    const currentEmotion = level?.emotion || 'joy';

    // FUNÇÕES DO JOGO - COLE AS SUAS VERSÕES COMPLETAS AQUI
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
        setShowCutscene(true);
        setCutsceneContent({ title: newLevel.name, text: newLevel.story, image: EMOTIONS[newLevel.emotion as keyof typeof EMOTIONS].icon });
    }, []);

    const completeLevel = useCallback(() => {
        // ... sua lógica original de completeLevel aqui ...
        if (soundEnabled) playSound('levelComplete');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setGameState('levelComplete');
    }, [soundEnabled]);

    const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameState !== 'playing') return;
        // ... sua lógica original de movePlayer aqui ...
        // Certifique-se de que no final ela chama completeLevel() ao chegar no objetivo.
    }, [gameState, playerPosition, level, collectedItems, openedDoors, activePowerup, soundEnabled, completeLevel]);
    
    // EFEITOS DO JOGO - COLE OS SEUS AQUI
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const keyMap: { [key: string]: 'up' | 'down' | 'left' | 'right' } = { 'ArrowUp': 'up', 'w': 'up', 'ArrowDown': 'down', 's': 'down', 'ArrowLeft': 'left', 'a': 'left', 'ArrowRight': 'right', 'd': 'right' };
            if (keyMap[e.key]) movePlayer(keyMap[e.key]);
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [movePlayer]);

    // LÓGICA DE TRANSIÇÃO DE TELA
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

    // --- TELAS DE INTERFACE (Layout do Bubble Pop) ---

    const TitleScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="absolute animate-pulse" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, animationDuration: `${3 + Math.random() * 2}s` }}>
                        <Star className="w-6 h-6 text-white opacity-20" fill="currentColor" />
                    </div>
                ))}
            </div>
            <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, type: 'spring', stiffness: 100 }} className="mb-4">
                    <img src="/images/mascotes/leo/jogo do labirinto tela.webp" alt="Mascote Léo no Labirinto" className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl animate-bounce-slow" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4, type: 'spring', stiffness: 100 }}>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-2">Labirinto das Emoções</h1>
                    <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-6 drop-shadow-md">🧭 Ajude Léo a encontrar os tesouros e amigos perdidos!</p>
                    <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl max-w-xs mx-auto">
                        <div className="flex items-center justify-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-100" />
                            <span className="font-bold text-white">30 Níveis de Aventura</span>
                        </div>
                    </div>
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
            <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <button onClick={handleResetAndGoHome} className="flex items-center text-teal-600 hover:text-teal-700"><ChevronLeft className="h-5 w-5" /> <span className="hidden sm:inline">Menu</span></button>
                        <h1 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2"><Compass className="text-blue-500 h-5 w-5" /><span>Nível {currentLevel + 1}</span></h1>
                        <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-white/50">{soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}</button>
                    </div>
                </div>
            </header>
            
            <main className="flex-1 p-4 flex flex-col items-center justify-center">
                {/* COLE AQUI O CONTEÚDO DA SUA TAG <main> ORIGINAL.
                    Isso inclui os condicionais para `gameState`, o grid do labirinto, etc.
                    Abaixo está um exemplo da estrutura que você deve colar:
                */}
                <AnimatePresence>
                    {gameState === 'story' && showCutscene && (
                        <motion.div /* Sua tela de história aqui */ >
                            <button onClick={() => setGameState('playing')}>Começar</button>
                        </motion.div>
                    )}
                    {gameState === 'playing' && (
                        <div>
                            {/* Seus paineis de score, tempo, etc. aqui */}
                            <div className="grid" style={{ gridTemplateColumns: `repeat(${level.size}, 1fr)`}}>
                                {/* Seu .map() para renderizar as células do labirinto aqui */}
                            </div>
                            {/* Seus controles mobile aqui */}
                        </div>
                    )}
                    {gameState === 'levelComplete' && (
                        <motion.div /* Sua tela de nível completo aqui */ >
                            <button onClick={() => {/* Lógica para próximo nível */}}>Próximo Nível</button>
                        </motion.div>
                    )}
                    {gameState === 'gameComplete' && (
                         <motion.div /* Sua tela de jogo completo aqui */ >
                            <button onClick={handleResetAndGoHome}>Jogar Novamente</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            
            <style jsx global>{`
                .animate-bounce-slow { animation: bounce-slow 3s infinite; }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(-3%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
                }
                /* COLE SEUS OUTROS ESTILOS CSS AQUI, SE HOUVER */
            `}</style>
        </div>
    );

    // --- Renderização Principal ---
    if (currentScreen === 'title') return <TitleScreen />;
    if (currentScreen === 'instructions') return <InstructionsScreen />;
    return <GameScreen />;
}

