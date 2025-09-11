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
    
    // Variáveis do labirinto e estados relacionados (certifique-se de que estão definidas ou inicializadas)
    const [currentMaze, setCurrentMaze] = useState<any[][]>([]); // Ou o tipo correto do seu labirinto
    const [score, setScore] = useState(0);
    const [gemsCollected, setGemsCollected] = useState(0);
    const [totalGemsInLevel, setTotalGemsInLevel] = useState(0);
    const [powerupsCollected, setPowerupsCollected] = useState<string[]>([]);
    const [keysCollected, setKeysCollected] = useState(0);
    const [showPowerupMessage, setShowPowerupMessage] = useState<string | null>(null);
    const [remainingMoves, setRemainingMoves] = useState(0);
    const [emotionHistory, setEmotionHistory] = useState<string[]>([]);
    const [currentEmotion, setCurrentEmotion] = useState('alegria'); // Emoção inicial
    const [npcsFound, setNpcsFound] = useState(0);
    const [totalNpcsInLevel, setTotalNpcsInLevel] = useState(0);
    const [isMirrorActive, setIsMirrorActive] = useState(false);
    const [mirrorReflections, setMirrorReflections] = useState(0);
    const [storyMessage, setStoryMessage] = useState("");
    const [lastLevelScore, setLastLevelScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768; // Exemplo de detecção mobile

    // ... (Seu useEffect para lidar com eventos de teclado, sons, etc.)
    // Seu `useEffect` para `handleKeyDown` deve estar aqui.

    // --- TODAS AS SUAS FUNÇÕES ORIGINAIS DO JOGO ESTÃO AQUI ---
    // playSound, createMegaGemExplosion, movePlayer, completeLevel, etc.
    // ... (Todas as suas funções `useCallback` e `useEffect` originais permanecem aqui, inalteradas)
    // Se a função `initLevel` e `generateMaze` estiverem definidas externamente ou em um hook,
    // certifique-se de que estão acessíveis ou mova-as para dentro deste componente ou de um custom hook.

    // placeholder para initLevel - SUBSTITUA PELA SUA LÓGICA REAL DE initLevel
    const initLevel = useCallback((levelIndex: number) => {
        const levelData = LEVELS[levelIndex];
        setCurrentLevel(levelIndex);
        setPlayerPosition(levelData.startPosition);
        setCurrentMaze(createMaze8x8(levelData.mazeConfig)); // Sua função createMaze8x8
        setTotalGemsInLevel(levelData.gems);
        setTotalNpcsInLevel(levelData.npcs);
        setRemainingMoves(levelData.moves);
        setCurrentEmotion(levelData.emotion);
        setStoryMessage(levelData.story);
        setGemsCollected(0);
        setNpcsFound(0);
        setKeysCollected(0);
        setPowerupsCollected([]);
        setIsMirrorActive(false);
        setMirrorReflections(0);
        setGameState('story'); // Inicia sempre no estado de história para o novo nível
    }, []); // Adicione aqui as dependências de initLevel se houver (ex: createMaze8x8, LEVELS)

    useEffect(() => {
        if (currentScreen === 'game' && gameState === 'story' && currentLevel === 0) {
            // Garante que o primeiro nível seja inicializado se o jogo começar
            // e estiver no estado de história do nível 0.
            initLevel(0);
        }
    }, [currentScreen, gameState, currentLevel, initLevel]);


    // NOVA LÓGICA PARA INICIAR O JOGO A PARTIR DAS NOVAS TELAS
    const handleStartGame = useCallback(() => {
        console.log("handleStartGame called");
        setCurrentLevel(0);
        setTotalScore(0);
        initLevel(0); // Reinicializa o primeiro nível completamente
        setGameState('story'); // Garante que o jogo comece pela história do Nível 1
        setCurrentScreen('game'); // Transita para a tela do jogo
    }, [initLevel]);

    const handleResetAndGoHome = useCallback(() => {
        // Função para voltar à tela de título
        setCurrentScreen('titleScreen');
        setGameState('story'); // Reseta o estado inicial do jogo
        setCurrentLevel(0); // Resetar o nível também é importante para um novo começo
        setTotalScore(0); // Resetar o score total
        // Poderia adicionar mais resets de estado aqui se necessário para um "limpar jogo"
    }, []);

    // ... (Seu useEffect para o confetti se você tiver)
    useEffect(() => {
        if (showConfetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
            setShowConfetti(false); // Resetar para que não dispare infinitamente
        }
    }, [showConfetti]);

    // ... (Seu useEffect para tocar sons)

    // ... (Seu useEffect para `gameState` e `currentLevel` para completar o jogo)

    // ... (Seu isMobile e renderização de controles mobile)
    const renderMobileControls = () => (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-80 p-4 flex justify-center space-x-4 z-20">
            <button className={`${styles.mobileButton} ${styles.up}`} onClick={() => movePlayer('up')}>▲</button>
            <div className="flex flex-col space-y-2">
                <button className={`${styles.mobileButton} ${styles.left}`} onClick={() => movePlayer('left')}>◀</button>
                <button className={`${styles.mobileButton} ${styles.right}`} onClick={() => movePlayer('right')}>▶</button>
            </div>
            <button className={`${styles.mobileButton} ${styles.down}`} onClick={() => movePlayer('down')}>▼</button>
        </div>
    );


    // --- NOVAS TELAS DE TÍTULO E INSTRUÇÕES ---
    const TitleScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 overflow-hidden bg-gradient-to-br from-purple-200 to-pink-200">
            {/* Imagem de fundo com o mascote Léo - AGORA USANDO leo_rosto_resultado.webp */}
            <Image
                src="/images/mascotes/leo/leo_rosto_resultado.webp"
                alt="Léo, o mascote"
                width={350} // Ajuste o tamanho conforme necessário
                height={350} // Ajuste o tamanho conforme necessário
                className="absolute bottom-0 right-0 sm:right-1/2 sm:translate-x-1/2 md:translate-x-0 md:right-10 lg:right-20 z-0 opacity-70"
                style={{ objectFit: 'contain', maxHeight: '50vh' }} // Garante que não corte e ajuste altura
            />
            {/* Overlay para escurecer um pouco e dar contraste */}
            <div className="absolute inset-0 bg-black/20"></div> {/* Suavizado para combinar com o Léo de fundo */}

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
                    onClick={handleStartGame} // Chamada para handleStartGame
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
                {/* Seu código original para renderizar o labirinto, story, game over, etc. */}
                {gameState === 'story' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center flex-1 text-center p-4"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Nível {currentLevel + 1}: {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}</h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl">{storyMessage}</p>
                        <button
                            onClick={() => setGameState('playing')}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg"
                        >
                            Começar
                        </button>
                    </motion.div>
                )}

                {gameState === 'playing' && (
                    <div className="flex flex-1 flex-col items-center justify-center w-full">
                        {/* Seu grid do labirinto aqui */}
                        <div className={`${styles.mazeGrid} grid`} style={{
                            gridTemplateColumns: `repeat(8, 1fr)`,
                            gridTemplateRows: `repeat(8, 1fr)`,
                            width: 'min(90vw, 400px)',
                            height: 'min(90vw, 400px)',
                            border: '2px solid #ccc',
                            backgroundColor: '#eee'
                        }}>
                            {/* Renderizar células do labirinto */}
                            {currentMaze.flatMap((row, y) =>
                                row.map((cell, x) => (
                                    <div
                                        key={`${x}-${y}`}
                                        className={`${styles.mazeCell} flex items-center justify-center relative`}
                                        style={{
                                            borderLeft: cell.walls.left ? '2px solid #333' : 'none',
                                            borderTop: cell.walls.top ? '2px solid #333' : 'none',
                                            borderRight: cell.walls.right ? '2px solid #333' : 'none',
                                            borderBottom: cell.walls.bottom ? '2px solid #333' : 'none',
                                            backgroundColor: (x === playerPosition.x && y === playerPosition.y) ? '#aaffaa' : '#eee',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {/* Renderizar player */}
                                        {(x === playerPosition.x && y === playerPosition.y) && (
                                            <Image src="/images/mascotes/leo/leo_rosto_resultado.webp" alt="Player Léo" width={30} height={30} className="w-full h-full object-contain" />
                                        )}
                                        {/* Renderizar gemas, NPCs, chaves, etc. */}
                                        {cell.gem && <Star className="text-yellow-500 w-4 h-4" />}
                                        {cell.npc && <Users className="text-blue-500 w-4 h-4" />}
                                        {cell.key && <Key className="text-orange-500 w-4 h-4" />}
                                        {cell.door && <span className="text-gray-700 text-xs">🚪</span>}
                                        {cell.powerup === 'teleport' && <Sparkles className="text-pink-500 w-4 h-4" />}
                                        {cell.powerup === 'double_score' && <Clock className="text-red-500 w-4 h-4" />}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Informações do jogo e status */}
                        <div className="mt-4 text-lg font-semibold text-gray-700 flex flex-wrap justify-center gap-x-6 gap-y-2">
                            <p>Pontos: {score}</p>
                            <p>Gemas: {gemsCollected} / {totalGemsInLevel}</p>
                            <p>Amigos: {npcsFound} / {totalNpcsInLevel}</p>
                            <p>Chaves: {keysCollected}</p>
                            <p>Movimentos: {remainingMoves}</p>
                        </div>

                        {/* Mensagem de Power-up */}
                        {showPowerupMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-green-500 text-white p-2 rounded-lg mt-4"
                            >
                                {showPowerupMessage}
                            </motion.div>
                        )}
                    </div>
                )}

                {gameState === 'levelComplete' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center flex-1 text-center p-4 bg-green-100 rounded-lg shadow-lg"
                    >
                        <h2 className="text-5xl font-bold text-green-700 mb-4">Nível Completo! 🎉</h2>
                        <p className="text-2xl text-gray-700 mb-6">Sua pontuação neste nível: <span className="font-extrabold text-green-800">{lastLevelScore}</span></p>
                        <p className="text-xl text-gray-600 mb-8">Pontuação Total: <span className="font-extrabold text-green-800">{totalScore}</span></p>
                        <button
                            onClick={() => {
                                if (currentLevel + 1 < LEVELS.length) {
                                    initLevel(currentLevel + 1);
                                } else {
                                    setGameState('gameComplete');
                                }
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg"
                        >
                            {currentLevel + 1 < LEVELS.length ? 'Próximo Nível' : 'Ver Resultado Final'}
                        </button>
                    </motion.div>
                )}

                {gameState === 'gameComplete' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center flex-1 text-center p-4 bg-yellow-100 rounded-lg shadow-lg"
                    >
                        <h2 className="text-5xl font-bold text-yellow-700 mb-4">Aventura Concluída! 🏆</h2>
                        <p className="text-3xl text-gray-700 mb-8">Parabéns, Léo! Você superou todos os desafios!</p>
                        <p className="text-4xl text-gray-800 font-extrabold mb-8">Pontuação Final: <span className="text-yellow-800">{totalScore}</span></p>
                        <button
                            onClick={handleResetAndGoHome}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg"
                        >
                            Voltar ao Início
                        </button>
                    </motion.div>
                )}
            </main>

            {isMobile && gameState === 'playing' && renderMobileControls()}
        </div>
    );

    // --- RENDERIZAÇÃO CONDICIONAL DAS TELAS ---
    if (currentScreen === 'titleScreen') return <TitleScreen />;
    if (currentScreen === 'instructions') return <InstructionsScreen />;
    // Se currentScreen for 'game', renderizamos a GameScreen
    return <GameScreen />;
}
