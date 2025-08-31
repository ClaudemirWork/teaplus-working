'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Volume2, VolumeX, Brain, ArrowLeft, Trophy, Play, Star, Heart } from 'lucide-react';

// --- COMPONENTES DE UI ---

const ToneButton = ({ tone, onClick, isActive, disabled, index }) => {
    const buttonStyle = {
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transform: isActive ? 'scale(1.1) translateY(-10px)' : 'scale(1)',
        boxShadow: isActive ? `0 0 40px 15px ${tone.glowColor}` : '0 5px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.2s ease',
        height: tone.height
    };

    return (
        <button
            onClick={() => !disabled && onClick()}
            className={`tone-button ${tone.colorClass}`}
            style={buttonStyle}
            disabled={disabled}
        >
            <div className="button-shine"></div>
            <span className="button-label">{tone.name}</span>
            <span className="button-number">{index + 1}</span>
        </button>
    );
};

const MusicalNotesBackground = () => (
    <div className="musical-notes-bg">
        {Array.from({ length: 20 }).map((_, i) => {
            const style = {
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 2 + 1}rem`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${Math.random() * 15 + 15}s`,
            };
            const note = ['♪', '♫', '♩', '♬'][Math.floor(Math.random() * 4)];
            return <span key={i} style={style}>{note}</span>;
        })}
    </div>
);

const SplashScreen = ({ onContinue }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    
    return (
        <div className="screen-center splash-container">
            <MusicalNotesBackground />
            <div className="splash-content">
                <h1 className="splash-title">🎵 Eco Sonoro 🎵</h1>
                
                <div 
                    className="mascot-container"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <img 
                        src="/images/mascotes/mila/mila_sinal_positivo_resultado.webp" 
                        alt="Mila - Mascote TeaPlus"
                        className="mascot-image"
                        style={{
                            transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                            transition: 'transform 0.3s ease'
                        }}
                    />
                    <p className="mascot-message">Olá! Vamos testar sua memória musical?</p>
                </div>
                
                <button onClick={onContinue} className="splash-button">
                    <span style={{position: 'relative', zIndex: 1}}>Começar</span>
                </button>
            </div>
        </div>
    );
};

const IntroScreen = ({ onStart }) => (
    <div className="screen-center intro-container">
        <MusicalNotesBackground />
        <div className="intro-content">
            <h1 className="intro-title">🎵 Eco Sonoro 🎵</h1>
            <p className="intro-subtitle">Teste sua memória musical!</p>
            
            <div className="instructions">
                <h3>Como Jogar:</h3>
                <ul>
                    <li>🎶 Escute a sequência de notas</li>
                    <li>🎹 Repita tocando as teclas na ordem correta</li>
                    <li>⭐ A cada acerto, uma nova nota é adicionada</li>
                    <li>❤️ Você tem 3 vidas - use com sabedoria!</li>
                </ul>
            </div>
            
            <button onClick={onStart} className="start-button">
                <Play className="w-6 h-6" />
                Começar o Desafio
            </button>
        </div>
    </div>
);

const GameOverScreen = ({ score, highScore, level, onRestart, onHome }) => (
    <div className="screen-center game-over-container">
        <MusicalNotesBackground />
        <div className="game-over-content">
            <Trophy className="w-32 h-32 text-yellow-400 trophy-icon" />
            <h2 className="game-over-title">Fim de Jogo!</h2>
            
            <div className="score-display">
                <div className="score-item">
                    <span className="score-label">Pontuação Final</span>
                    <span className="score-value">{score}</span>
                </div>
                <div className="score-item">
                    <span className="score-label">Nível Alcançado</span>
                    <span className="score-value">{level}</span>
                </div>
                <div className="score-item">
                    <span className="score-label">Recorde</span>
                    <span className="score-value">{highScore}</span>
                </div>
            </div>
            
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                <button onClick={onRestart} className="restart-button">
                    Jogar Novamente
                </button>
                <button onClick={onHome} className="restart-button secondary">
                    Voltar ao Início
                </button>
            </div>
        </div>
    </div>
);

const StatusIndicator = ({ isPlayerTurn, isPlaying }) => {
    if (!isPlaying) return null;
    
    return (
        <div className="status-indicator">
            {isPlayerTurn ? (
                <span className="status-text player-turn">🎹 Sua vez de tocar!</span>
            ) : (
                <span className="status-text computer-turn">👂 Escute com atenção...</span>
            )}
        </div>
    );
};

// --- LÓGICA DO JOGO ---

export default function AuditoryMemoryGame() {
    const [gameState, setGameState] = useState('splash');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [combo, setCombo] = useState(1);
    const [lives, setLives] = useState(3);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const [sequence, setSequence] = useState([]);
    const [playerSequence, setPlayerSequence] = useState([]);
    const [activeTone, setActiveTone] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [isPlayingSequence, setIsPlayingSequence] = useState(false);
    const [showMessage, setShowMessage] = useState('');
    
    const tones = useMemo(() => [
        { name: 'Dó', audioSrc: '/sounds/xylophone/C5.wav', colorClass: 'bg-red-500', glowColor: '#ef4444', height: '200px', frequency: 523.25 },
        { name: 'Ré', audioSrc: '/sounds/xylophone/D5.wav', colorClass: 'bg-blue-500', glowColor: '#3b82f6', height: '190px', frequency: 587.33 },
        { name: 'Mi', audioSrc: '/sounds/xylophone/E5.wav', colorClass: 'bg-green-500', glowColor: '#22c55e', height: '180px', frequency: 659.25 },
        { name: 'Fá', audioSrc: '/sounds/xylophone/F5.wav', colorClass: 'bg-yellow-400', glowColor: '#facc15', height: '170px', frequency: 698.46 },
        { name: 'Sol', audioSrc: '/sounds/xylophone/G5.wav', colorClass: 'bg-purple-500', glowColor: '#a855f7', height: '160px', frequency: 783.99 },
        { name: 'Lá', audioSrc: '/sounds/xylophone/A5.wav', colorClass: 'bg-pink-500', glowColor: '#ec4899', height: '150px', frequency: 880.00 },
    ], []);

    const audioContext = useRef(null);
    const audioRefs = useRef({});
    
    // Inicializa o contexto de áudio e pré-carrega os sons
    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
            
            tones.forEach((tone) => {
                const audio = new Audio(tone.audioSrc);
                audio.preload = 'auto';
                audio.volume = 0.7;
                audioRefs.current[tone.audioSrc] = audio;
            });
        }
        
        // Carrega o high score do localStorage
        const savedHighScore = localStorage.getItem('ecoSonoroHighScore');
        if (savedHighScore) {
            setHighScore(parseInt(savedHighScore));
        }
        
        return () => {
            if (audioContext.current) {
                audioContext.current.close();
            }
        };
    }, [tones]);

    // Função aprimorada para tocar tons
    const playTone = useCallback((index, useWebAudio = false) => {
        if (!soundEnabled) return;
        
        if (useWebAudio && audioContext.current) {
            // Usa Web Audio API para som mais suave
            const oscillator = audioContext.current.createOscillator();
            const gainNode = audioContext.current.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.current.destination);
            
            oscillator.frequency.value = tones[index].frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.current.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.current.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.5);
            
            oscillator.start(audioContext.current.currentTime);
            oscillator.stop(audioContext.current.currentTime + 0.5);
        } else {
            // Usa arquivos de áudio
            const audio = audioRefs.current[tones[index].audioSrc];
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(e => {
                    console.error("Erro ao tocar áudio:", e);
                    // Fallback para Web Audio API
                    if (audioContext.current) {
                        playTone(index, true);
                    }
                });
            }
        }
    }, [soundEnabled, tones]);

    // Função para reproduzir a sequência completa
    const playSequence = useCallback(async () => {
        setIsPlayerTurn(false);
        setIsPlayingSequence(true);
        setPlayerSequence([]);
        
        // Aguarda um momento antes de começar
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Toca cada nota da sequência
        for (let i = 0; i < sequence.length; i++) {
            if (gameState !== 'playing') break;
            
            const toneIndex = sequence[i];
            setActiveTone(toneIndex);
            playTone(toneIndex);
            
            // Tempo que a nota fica ativa (diminui com o nível)
            const noteDuration = Math.max(400, 600 - (level * 20));
            await new Promise(resolve => setTimeout(resolve, noteDuration));
            
            setActiveTone(null);
            
            // Intervalo entre notas (diminui com o nível)
            const noteGap = Math.max(200, 400 - (level * 15));
            await new Promise(resolve => setTimeout(resolve, noteGap));
        }
        
        setIsPlayingSequence(false);
        setIsPlayerTurn(true);
        setShowMessage('Sua vez!');
        setTimeout(() => setShowMessage(''), 2000);
    }, [sequence, gameState, playTone, level]);

    // Navega da splash para as instruções
    const goToIntro = useCallback(() => {
        setGameState('intro');
    }, []);

    // Inicia um novo jogo
    const startGame = useCallback(() => {
        setScore(0);
        setLevel(1);
        setCombo(1);
        setLives(3);
        setPlayerSequence([]);
        
        // Gera primeira sequência com 1 nota
        const firstTone = Math.floor(Math.random() * tones.length);
        setSequence([firstTone]);
        
        setGameState('playing');
    // Reinicia o jogo voltando para a splash
    const restartToSplash = useCallback(() => {
        setGameState('splash');
        setScore(0);
        setLevel(1);
        setCombo(1);
        setLives(3);
        setPlayerSequence([]);
        setSequence([]);
    }, []);

    // Efeito para tocar a sequência quando o jogo inicia ou nova sequência é criada
    useEffect(() => {
        if (gameState === 'playing' && sequence.length > 0 && !isPlayerTurn && !isPlayingSequence) {
            playSequence();
        }
    }, [gameState, sequence, isPlayerTurn, isPlayingSequence, playSequence]);

    // Verifica fim de jogo
    useEffect(() => {
        if (lives <= 0 && gameState === 'playing') {
            // Salva o high score
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('ecoSonoroHighScore', score.toString());
            }
            setGameState('gameOver');
        }
    }, [lives, gameState, score, highScore]);

    // Lida com a escolha do jogador
    const handleUserChoice = useCallback((chosenIndex) => {
        if (!isPlayerTurn || isPlayingSequence) return;
        
        playTone(chosenIndex);
        setActiveTone(chosenIndex);
        setTimeout(() => setActiveTone(null), 200);
        
        const newPlayerSequence = [...playerSequence, chosenIndex];
        setPlayerSequence(newPlayerSequence);
        
        const currentIndex = newPlayerSequence.length - 1;
        
        if (chosenIndex === sequence[currentIndex]) {
            // Acertou a nota
            if (newPlayerSequence.length === sequence.length) {
                // Completou a sequência!
                setShowMessage('Perfeito! 🎉');
                setTimeout(() => setShowMessage(''), 1500);
                
                // Calcula pontos
                const points = 10 * combo * sequence.length;
                setScore(prev => prev + points);
                setCombo(prev => Math.min(prev + 1, 10));
                setLevel(prev => prev + 1);
                
                // Cria nova sequência após delay
                setTimeout(() => {
                    const nextTone = Math.floor(Math.random() * tones.length);
                    setSequence(prev => [...prev, nextTone]);
                    setPlayerSequence([]);
                    setIsPlayerTurn(false);
                }, 1500);
            }
        } else {
            // Errou a nota
            setShowMessage('Ops! Tente novamente 😅');
            setTimeout(() => setShowMessage(''), 1500);
            
            setLives(prev => prev - 1);
            setCombo(1);
            setPlayerSequence([]);
            
            // Reproduz a sequência novamente após erro
            setTimeout(() => {
                if (lives > 1) {
                    setIsPlayerTurn(false);
                }
            }, 1500);
        }
    }, [isPlayerTurn, isPlayingSequence, playerSequence, sequence, combo, playTone, tones.length, lives]);

    const cssStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');
        
        :root { 
            --main-bg: #1a237e; 
            --secondary-bg: #283593;
            --accent: #ffeb3b;
        }
        
        * { box-sizing: border-box; }
        
        .game-container { 
            font-family: 'Nunito', sans-serif; 
            min-height: 100vh; 
            background: linear-gradient(135deg, var(--main-bg) 0%, #3949ab 50%, #5c6bc0 100%);
            color: white; 
            display: flex; 
            flex-direction: column;
            position: relative;
            overflow: hidden;
        }
        
        /* --- ANIMAÇÕES --- */
        @keyframes float-notes { 
            from { 
                transform: translateY(100vh) rotate(0deg); 
                opacity: 0; 
            } 
            10% { opacity: 1; }
            90% { opacity: 1; }
            to { 
                transform: translateY(-100vh) rotate(360deg); 
                opacity: 0; 
            } 
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        /* --- TELA SPLASH --- */
        .splash-container {
            position: relative;
            width: 100%;
            max-width: 500px;
        }
        
        .splash-content {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(15px);
            padding: 3rem 2rem;
            border-radius: 40px;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
            position: relative;
            z-index: 2;
            animation: slideIn 0.8s ease;
        }
        
        .splash-title {
            font-size: clamp(3rem, 7vw, 5rem);
            font-weight: 900;
            margin-bottom: 2rem;
            background: linear-gradient(45deg, #fff, var(--accent), #fff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 6px 15px rgba(0,0,0,0.4));
            animation: slideIn 0.6s ease;
        }
        
        .mascot-container {
            margin: 2rem 0;
            animation: fadeInUp 1s ease forwards, float 3s ease-in-out infinite 1s;
        }
        
        .mascot-image {
            width: 100%;
            max-width: 350px;
            height: auto;
            filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5));
        }
        
        .mascot-message {
            font-size: 1.3rem;
            color: #e0e0e0;
            margin-top: 1.5rem;
            font-weight: 600;
            animation: fadeInUp 1.5s ease 0.8s backwards;
        }
        
        .splash-button {
            background: linear-gradient(135deg, var(--accent), #ffc107);
            color: var(--main-bg);
            font-size: 1.8rem;
            font-weight: 900;
            padding: 20px 60px;
            border-radius: 60px;
            border: none;
            box-shadow: 0 15px 40px rgba(255, 235, 59, 0.4);
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 2rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            overflow: hidden;
            animation: fadeInUp 1.2s ease 0.5s backwards;
        }
        
        .splash-button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .splash-button:hover::before {
            width: 300px;
            height: 300px;
        }
        
        .splash-button:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 20px 50px rgba(255, 235, 59, 0.6);
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeInUp {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* --- TELAS DE INTRO E FIM --- */
        .screen-center { 
            flex-grow: 1; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            text-align: center; 
            padding: 20px;
            position: relative;
        }
        
        .intro-container, .game-over-container { 
            position: relative; 
            width: 100%;
            max-width: 600px;
        }
        
        .intro-content, .game-over-content {
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            padding: 3rem;
            border-radius: 30px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            position: relative;
            z-index: 2;
        }
        
        .intro-title { 
            font-size: clamp(2.5rem, 6vw, 4rem); 
            font-weight: 900; 
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #fff, var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
        }
        
        .intro-subtitle { 
            font-size: 1.5rem; 
            color: #e0e0e0; 
            margin-bottom: 2rem;
        }
        
        .instructions {
            background: rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            border-radius: 15px;
            margin: 2rem 0;
            text-align: left;
        }
        
        .instructions h3 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            text-align: center;
        }
        
        .instructions ul {
            list-style: none;
            padding: 0;
        }
        
        .instructions li {
            padding: 0.5rem 0;
            font-size: 1.1rem;
        }
        
        .start-button, .restart-button { 
            background: white; 
            color: var(--main-bg); 
            font-size: 1.3rem; 
            font-weight: 700; 
            padding: 18px 40px; 
            border-radius: 50px; 
            border: none; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.3); 
            cursor: pointer; 
            display: inline-flex; 
            align-items: center; 
            gap: 12px;
            transition: all 0.3s ease;
            margin-top: 1rem;
        }
        
        .start-button:hover, .restart-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
            background: var(--accent);
        }
        
        .restart-button.secondary {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        }
        
        .restart-button.secondary:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .trophy-icon {
            animation: pulse 2s infinite;
            margin-bottom: 1rem;
        }
        
        .game-over-title { 
            font-size: 3rem; 
            font-weight: 900; 
            margin: 1rem 0 2rem;
        }
        
        .score-display {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .score-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            border-radius: 15px;
        }
        
        .score-label {
            display: block;
            font-size: 1rem;
            color: #b0b0b0;
            margin-bottom: 0.5rem;
        }
        
        .score-value {
            display: block;
            font-size: 2.5rem;
            font-weight: 900;
            color: var(--accent);
        }
        
        /* Fundo de Notas Musicais */
        .musical-notes-bg { 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            overflow: hidden; 
            z-index: 1;
            pointer-events: none;
        }
        
        .musical-notes-bg span { 
            position: absolute; 
            color: rgba(255, 255, 255, 0.15); 
            animation: float-notes 20s linear infinite;
            font-size: 2rem;
        }
        
        /* --- HEADER DO JOGO --- */
        .game-header { 
            padding: 20px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            position: relative;
            z-index: 10;
        }
        
        .header-left, .header-right {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .header-title { 
            font-weight: 900; 
            font-size: 2rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        
        .header-item { 
            background: rgba(0,0,0,0.3); 
            padding: 10px 20px; 
            border-radius: 25px; 
            font-weight: 700; 
            font-size: 1.1rem; 
            display: flex; 
            align-items: center; 
            gap: 10px;
            backdrop-filter: blur(10px);
        }
        
        .header-item.lives { 
            color: #ff6b6b;
        }
        
        .header-item.score { 
            color: var(--accent);
        }
        
        .header-item.level {
            color: #69f0ae;
        }
        
        .header-button { 
            background: rgba(0,0,0,0.3); 
            backdrop-filter: blur(10px);
            border-radius: 50%; 
            padding: 12px; 
            border: none; 
            color: white; 
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .header-button:hover {
            background: rgba(255,255,255,0.2);
            transform: scale(1.1);
        }
        
        /* --- STATUS INDICATOR --- */
        .status-indicator {
            position: absolute;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 20;
            animation: slideIn 0.5s ease;
        }
        
        .status-text {
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 1.3rem;
            font-weight: 700;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .player-turn {
            background: linear-gradient(135deg, #4caf50, #8bc34a);
        }
        
        .computer-turn {
            background: linear-gradient(135deg, #ff9800, #ffc107);
        }
        
        /* --- MENSAGEM DE FEEDBACK --- */
        .message-display {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            font-weight: 900;
            padding: 20px 40px;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            z-index: 100;
            animation: slideIn 0.3s ease;
        }
        
        /* --- COMBO METER --- */
        .combo-meter { 
            text-align: center;
            background: rgba(0,0,0,0.3);
            padding: 15px 25px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        
        .combo-text { 
            font-size: 1rem; 
            font-weight: 700; 
            color: #e0e0e0;
            letter-spacing: 2px;
        }
        
        .combo-number { 
            font-size: 2.5rem; 
            font-weight: 900; 
            color: var(--accent); 
            line-height: 1; 
            text-shadow: 0 0 20px var(--accent);
        }
        
        /* --- ÁREA DO JOGO --- */
        .game-board { 
            flex-grow: 1; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center; 
            padding: 20px;
            gap: 2rem;
            position: relative;
        }
        
        .xylophone-container { 
            display: flex; 
            justify-content: center; 
            align-items: flex-end; 
            gap: 15px; 
            padding: 30px; 
            background: rgba(0,0,0,0.3); 
            border-radius: 30px; 
            box-shadow: 0 20px 60px rgba(0,0,0,0.4), inset 0 2px 10px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            width: 100%;
            max-width: 700px;
        }
        
        .tone-button { 
            flex: 1;
            min-width: 80px;
            border-radius: 15px 15px 10px 10px; 
            border: none; 
            cursor: pointer; 
            position: relative; 
            overflow: hidden;
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: flex-end; 
            padding: 15px 10px;
            transition: all 0.2s ease;
        }
        
        .tone-button:hover:not(:disabled) {
            transform: translateY(-5px);
        }
        
        .tone-button:active:not(:disabled) {
            transform: translateY(0);
        }
        
        .button-shine { 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 40%; 
            background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
            pointer-events: none;
        }
        
        .button-label { 
            font-size: 1.4rem; 
            font-weight: 900; 
            color: white; 
            text-shadow: 0 2px 5px rgba(0,0,0,0.5);
            margin-bottom: 5px;
        }
        
        .button-number {
            font-size: 0.9rem;
            opacity: 0.7;
            font-weight: 600;
        }
        
        /* Cores dos botões */
        .bg-red-500 { background: linear-gradient(135deg, #f44336, #e91e63); }
        .bg-blue-500 { background: linear-gradient(135deg, #2196f3, #03a9f4); }
        .bg-green-500 { background: linear-gradient(135deg, #4caf50, #8bc34a); }
        .bg-yellow-400 { background: linear-gradient(135deg, #ffc107, #ffeb3b); }
        .bg-purple-500 { background: linear-gradient(135deg, #9c27b0, #ba68c8); }
        .bg-pink-500 { background: linear-gradient(135deg, #e91e63, #f06292); }
        
        /* --- LAYOUT MOBILE --- */
        @media (max-width: 768px) {
            .splash-content {
                padding: 2rem 1.5rem;
            }
            
            .splash-title {
                font-size: 2.5rem;
            }
            
            .mascot-image {
                max-width: 280px;
            }
            
            .mascot-message {
                font-size: 1.1rem;
            }
            
            .mascot-message {
                font-size: 1rem;
            }
            
            .splash-button {
                font-size: 1.4rem;
                padding: 16px 40px;
            }
            
            .game-header {
                flex-wrap: wrap;
                gap: 10px;
                padding: 15px;
            }
            
            .header-title {
                font-size: 1.5rem;
                width: 100%;
                text-align: center;
                order: -1;
            }
            
            .header-left, .header-right {
                flex: 1;
                justify-content: space-between;
            }
            
            .header-item {
                padding: 8px 15px;
                font-size: 1rem;
            }
            
            .intro-content, .game-over-content {
                padding: 2rem 1.5rem;
            }
            
            .instructions {
                padding: 1rem;
            }
            
            .instructions li {
                font-size: 1rem;
            }
            
            .status-indicator {
                top: 140px;
            }
            
            .status-text {
                font-size: 1.1rem;
                padding: 12px 24px;
            }
            
            .game-board {
                padding: 10px;
            }
            
            .xylophone-container {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(2, 1fr);
                gap: 12px;
                padding: 20px;
                width: 95%;
                max-width: 400px;
            }
            
            .tone-button {
                height: 120px !important;
                border-radius: 12px;
            }
            
            .button-label {
                font-size: 1.2rem;
            }
            
            .combo-meter {
                padding: 10px 20px;
            }
            
            .combo-number {
                font-size: 2rem;
            }
            
            .message-display {
                font-size: 1.5rem;
                padding: 15px 30px;
            }
        }
        
        @media (max-width: 480px) {
            .splash-title {
                font-size: 2rem;
            }
            
            .mascot-image {
                max-width: 220px;
            }
            
            .mascot-message {
                font-size: 1rem;
            }
            
            .splash-button {
                font-size: 1.2rem;
                padding: 14px 35px;
            }
            
            .xylophone-container {
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(3, 1fr);
            }
            
            .tone-button {
                height: 100px !important;
            }
            
            .intro-title {
                font-size: 2rem;
            }
            
            .game-over-title {
                font-size: 2rem;
            }
            
            .score-value {
                font-size: 2rem;
            }
        }
    `;

    return (
        <div className="game-container">
            <style>{cssStyles}</style>
            
            {gameState === 'splash' && (
                <SplashScreen onContinue={goToIntro} />
            )}
            
            {gameState === 'intro' && (
                <IntroScreen onStart={startGame} />
            )}
            
            {gameState === 'playing' && (
                <>
                    <header className="game-header">
                        <div className="header-left">
                            <a href="/dashboard" className="header-button">
                                <ArrowLeft size={24} />
                            </a>
                            <div className="header-item lives">
                                <Heart size={20} />
                                {lives}
                            </div>
                        </div>
                        
                        <h2 className="header-title">🎵 Eco Sonoro 🎵</h2>
                        
                        <div className="header-right">
                            <div className="header-item level">
                                Nível {level}
                            </div>
                            <div className="header-item score">
                                <Star size={20} />
                                {score}
                            </div>
                            <button 
                                onClick={() => setSoundEnabled(!soundEnabled)} 
                                className="header-button"
                            >
                                {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                            </button>
                        </div>
                    </header>
                    
                    <StatusIndicator isPlayerTurn={isPlayerTurn} isPlaying={!isPlayingSequence} />
                    
                    {showMessage && (
                        <div className="message-display">
                            {showMessage}
                        </div>
                    )}
                    
                    <main className="game-board">
                        {combo > 2 && (
                            <div className="combo-meter">
                                <div className="combo-text">COMBO</div>
                                <div className="combo-number">x{combo}</div>
                            </div>
                        )}
                        
                        <div className="xylophone-container">
                            {tones.map((tone, index) => (
                                <ToneButton
                                    key={index}
                                    tone={tone}
                                    index={index}
                                    onClick={() => handleUserChoice(index)}
                                    isActive={activeTone === index}
                                    disabled={!isPlayerTurn || isPlayingSequence}
                                />
                            ))}
                        </div>
                    </main>
                </>
            )}
            
            {gameState === 'gameOver' && (
                <GameOverScreen 
                    score={score} 
                    highScore={highScore}
                    level={level}
                    onRestart={startGame}
                    onHome={restartToSplash}
                />
            )}
        </div>
    );
}
