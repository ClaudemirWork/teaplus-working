'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Brain, ArrowLeft, Trophy, Play, Star } from 'lucide-react';

// --- COMPONENTES DE UI ---

const ToneButton = ({ tone, onClick, isActive }) => (
    <motion.button
        onClick={onClick}
        className={`tone-button ${tone.colorClass}`}
        style={{ height: tone.height }}
        animate={{ scale: isActive ? 1.1 : 1, boxShadow: isActive ? `0 0 30px 10px ${tone.glowColor}` : '0 5px 15px rgba(0,0,0,0.2)' }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        whileTap={{ scale: 0.95 }}
    >
        <div className="button-shine"></div>
        <span className="button-label">{tone.name}</span>
    </motion.button>
);

const MusicalNotesBackground = () => (
    <div className="musical-notes-bg">
        {Array.from({ length: 15 }).map((_, i) => {
            const style = {
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 1.5 + 0.8}rem`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
            };
            const note = ['♪', '♫', '♩'][Math.floor(Math.random() * 3)];
            return <span key={i} style={style}>{note}</span>;
        })}
    </div>
);

const IntroScreen = ({ onStart }) => (
    <div className="screen-center intro-container">
        <MusicalNotesBackground />
        <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 50, delay: 0.2 }}
            className="intro-mascot"
        >
            <img 
                src="/images/mascotes/mila/mila_boas_vindas_resultado.webp" 
                alt="Mila Boas Vindas" 
            />
        </motion.div>

        <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="intro-title"
        >
            Eco Sonoro
        </motion.h1>
        <motion.p 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="intro-subtitle"
        >
            Acha que consegue seguir o ritmo?
        </motion.p>
        <motion.button
            onClick={onStart}
            className="start-button"
            whileHover={{ scale: 1.05, boxShadow: '0px 10px 30px rgba(255, 255, 255, 0.2)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: 'spring' }}
        >
            <Play className="w-6 h-6" />
            Começar o Desafio
        </motion.button>
    </div>
);


const GameOverScreen = ({ score, onRestart }) => (
     <div className="screen-center game-over-container">
        <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Trophy className="w-24 h-24 text-yellow-300" />
            <h2 className="game-over-title">Fim de Jogo!</h2>
            <p className="final-score">Sua Pontuação Final:</p>
            <p className="final-score-number">{score}</p>
            <button onClick={onRestart} className="restart-button">
                Jogar Novamente
            </button>
        </motion.div>
    </div>
);


// --- LÓGICA DO JOGO ---

export default function AuditoryMemoryGame() {
    const [gameState, setGameState] = useState('intro'); // intro, playing, gameOver
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(1);
    const [lives, setLives] = useState(3);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const [sequence, setSequence] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTone, setActiveTone] = useState(null); // Index do tom ativo
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    
    // **CORREÇÃO 1:** Trocamos 'audio: new Audio(...)' por 'audioSrc: "..."'
    // Isto evita que o servidor tente criar um objeto 'Audio'.
    const tones = useMemo(() => [
        { name: 'Dó', audioSrc: 'https://cdn.jsdelivr.net/gh/dev-rafael-antonio/assets-teaplus/assets/sounds/xylophone/C5.mp3', colorClass: 'bg-red-500', glowColor: '#ef4444', height: '200px' },
        { name: 'Ré', audioSrc: 'https://cdn.jsdelivr.net/gh/dev-rafael-antonio/assets-teaplus/assets/sounds/xylophone/D5.mp3', colorClass: 'bg-blue-500', glowColor: '#3b82f6', height: '190px' },
        { name: 'Mi', audioSrc: 'https://cdn.jsdelivr.net/gh/dev-rafael-antonio/assets-teaplus/assets/sounds/xylophone/E5.mp3', colorClass: 'bg-green-500', glowColor: '#22c55e', height: '180px' },
        { name: 'Fá', audioSrc: 'https://cdn.jsdelivr.net/gh/dev-rafael-antonio/assets-teaplus/assets/sounds/xylophone/F5.mp3', colorClass: 'bg-yellow-400', glowColor: '#facc15', height: '170px' },
        { name: 'Sol', audioSrc: 'https://cdn.jsdelivr.net/gh/dev-rafael-antonio/assets-teaplus/assets/sounds/xylophone/G5.mp3', colorClass: 'bg-purple-500', glowColor: '#a855f7', height: '160px' },
        { name: 'Lá', audioSrc: 'https://cdn.jsdelivr.net/gh/dev-rafael-antonio/assets-teaplus/assets/sounds/xylophone/A5.mp3', colorClass: 'bg-pink-500', glowColor: '#ec4899', height: '150px' },
    ], []);

    const gameSpeed = useMemo(() => Math.max(300, 1000 - (score / 20)), [score]);
    
    // **CORREÇÃO 2:** Criamos o objeto 'new Audio()' aqui dentro,
    // que só é executado no browser.
    const playTone = useCallback((index) => {
        if (!soundEnabled || typeof window === 'undefined') return;
        try {
            const tone = tones[index];
            const audio = new Audio(tone.audioSrc);
            audio.play().catch(e => console.error("Erro ao tocar áudio:", e));
        } catch (e) {
            console.error("Não foi possível tocar o som.");
        }
    }, [soundEnabled, tones]);

    const playSequence = useCallback(async () => {
        setIsPlayerTurn(false);
        await new Promise(res => setTimeout(res, 700)); // Pequena pausa antes de começar
        for (let i = 0; i < sequence.length; i++) {
            const toneIndex = sequence[i];
            setActiveTone(toneIndex);
            playTone(toneIndex);
            await new Promise(res => setTimeout(res, gameSpeed));
            setActiveTone(null);
            await new Promise(res => setTimeout(res, 100));
        }
        setIsPlayerTurn(true);
    }, [sequence, playTone, gameSpeed]);

    useEffect(() => {
        if (gameState === 'playing' && sequence.length > 0 && !isPlayerTurn) {
            playSequence();
        }
    }, [gameState, sequence, isPlayerTurn, playSequence]);

    const startGame = useCallback(() => {
        setScore(0);
        setCombo(1);
        setLives(3);
        const firstTone = Math.floor(Math.random() * tones.length);
        setSequence([firstTone]);
        setCurrentIndex(0);
        setGameState('playing');
        setIsPlayerTurn(false);
    }, [tones.length]);
    
     useEffect(() => {
        if (lives <= 0) {
            setGameState('gameOver');
        }
    }, [lives]);

    const handleUserChoice = (chosenIndex) => {
        if (!isPlayerTurn) return;

        playTone(chosenIndex);
        setActiveTone(chosenIndex);
        setTimeout(() => setActiveTone(null), 200);

        if (chosenIndex === sequence[currentIndex]) {
            const newIndex = currentIndex + 1;
            if (newIndex >= sequence.length) {
                // Acertou a sequência toda
                setScore(prev => prev + (10 * combo * sequence.length));
                setCombo(prev => prev + 1);
                setCurrentIndex(0);
                setIsPlayerTurn(false);
                // Adiciona nova nota e toca a nova sequência
                const nextTone = Math.floor(Math.random() * tones.length);
                setSequence(prev => [...prev, nextTone]);
            } else {
                // Acertou a nota, espera a próxima
                setCurrentIndex(newIndex);
            }
        } else {
            // Errou
            setLives(prev => prev - 1);
            setCombo(1);
            setCurrentIndex(0);
            setIsPlayerTurn(false);
            // Toca a mesma sequência novamente após um erro
            setTimeout(() => {
                if(lives - 1 > 0) playSequence();
            }, 1000);
        }
    };
    
    const cssStyles = `
        :root { --main-bg: #1a237e; --secondary-bg: #283593; }
        .game-container { font-family: 'Nunito', sans-serif; min-height: 100vh; background-color: var(--main-bg); background-image: linear-gradient(160deg, var(--main-bg) 0%, #3f51b5 100%); color: white; display: flex; flex-direction: column; }
        
        /* --- TELA DE INTRO E FIM DE JOGO --- */
        .screen-center { flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; }
        .intro-container { background: radial-gradient(circle, var(--secondary-bg) 0%, var(--main-bg) 100%); position: relative; overflow: hidden; }
        .intro-mascot { width: 90%; max-width: 350px; height: auto; margin-bottom: -2rem; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.3)); z-index: 1; }
        .intro-title { font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 900; letter-spacing: -2px; text-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 1; }
        .intro-subtitle { font-size: 1.2rem; color: #c5cae9; margin-bottom: 3rem; z-index: 1; }
        .start-button, .restart-button { background: white; color: var(--main-bg); font-size: 1.2rem; font-weight: 700; padding: 15px 30px; border-radius: 50px; border: none; box-shadow: 0 5px 20px rgba(0,0,0,0.2); cursor: pointer; display: flex; align-items: center; gap: 10px; z-index: 1; }
        .game-over-title { font-size: 3rem; font-weight: 900; margin: 1rem 0; }
        .final-score { font-size: 1.2rem; color: #c5cae9; }
        .final-score-number { font-size: 4rem; font-weight: 900; color: #ffeb3b; margin-bottom: 2rem; }

        /* Fundo de Notas Musicais */
        .musical-notes-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 0; }
        .musical-notes-bg span { position: absolute; color: rgba(255, 255, 255, 0.1); animation: float-notes 15s linear infinite; bottom: -50px; }
        @keyframes float-notes { from { transform: translateY(0) rotate(0deg); opacity: 1; } to { transform: translateY(-100vh) rotate(360deg); opacity: 0; } }

        /* --- UI DO JOGO --- */
        .game-header { padding: 15px; display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 900px; margin: 0 auto; z-index: 10; }
        .header-title { font-weight: 900; font-size: 1.8rem; }
        .header-item { background: rgba(0,0,0,0.2); padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 1.2rem; display: flex; align-items: center; gap: 8px; }
        .header-item.score { color: #ffeb3b; }
        .header-item.lives { color: #ff8a80; }
        .header-button { background: rgba(0,0,0,0.2); border-radius: 50%; padding: 10px; border: none; color: white; cursor: pointer; }
        
        .combo-meter { position: absolute; top: 100px; right: 20px; text-align: center; }
        .combo-text { font-size: 1rem; font-weight: 700; color: #e0e0e0; }
        .combo-number { font-size: 3rem; font-weight: 900; color: #ffeb3b; line-height: 1; text-shadow: 0 0 15px #ffeb3b; }
        
        .game-board { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .xylophone-container { display: flex; justify-content: center; align-items: flex-end; gap: 10px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 20px; box-shadow: inset 0 4px 10px rgba(0,0,0,0.4); height: 250px; }

        .tone-button { width: 60px; border-radius: 10px; border: none; cursor: pointer; position: relative; overflow: hidden; transition: transform 0.1s; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 10px; }
        .button-shine { position: absolute; top: 0; left: 0; width: 100%; height: 50%; background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent); }
        .button-label { font-size: 1.2rem; font-weight: 700; color: white; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
        
        /* Cores dos Botões */
        .bg-red-500 { background-color: #f44336; }
        .bg-blue-500 { background-color: #2196f3; }
        .bg-green-500 { background-color: #4caf50; }
        .bg-yellow-400 { background-color: #facc15; }
        .bg-purple-500 { background-color: #9c27b0; }
        .bg-pink-500 { background-color: #e91e63; }
    `;

    return (
        <div className="game-container">
            <style>{cssStyles}</style>
            
            <AnimatePresence mode="wait">
                {gameState === 'intro' && <IntroScreen onStart={startGame} key="intro" />}
                
                {gameState === 'playing' && (
                    <motion.div key="playing" className="flex flex-col h-full" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                        <header className="game-header">
                           <a href="/dashboard" className="header-button"><ArrowLeft /></a>
                           <h2 className="header-title">Eco Sonoro</h2>
                           <div className="flex items-center gap-4">
                                <div className="header-item lives">{'❤️'.repeat(lives)}</div>
                                <div className="header-item score"><Star className="text-yellow-400" /> {score}</div>
                                <button onClick={() => setSoundEnabled(!soundEnabled)} className="header-button">
                                    {soundEnabled ? <Volume2 /> : <VolumeX />}
                                </button>
                           </div>
                        </header>
                         <main className="game-board">
                            <AnimatePresence>
                                {combo > 2 && (
                                    <motion.div 
                                        className="combo-meter"
                                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        exit={{ scale: 0.5, opacity: 0, y: 50 }}
                                    >
                                        <span className="combo-text">COMBO</span>
                                        <span className="combo-number">x{combo}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="xylophone-container">
                                {tones.map((tone, index) => (
                                    <ToneButton 
                                        key={index} 
                                        tone={tone} 
                                        onClick={() => handleUserChoice(index)}
                                        isActive={activeTone === index}
                                    />
                                ))}
                            </div>
                        </main>
                    </motion.div>
                )}

                {gameState === 'gameOver' && <GameOverScreen score={score} onRestart={startGame} key="gameOver" />}
            </AnimatePresence>
        </div>
    );
}

