'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Trophy, ArrowLeft } from 'lucide-react';

// --- EFEITO DE CONFETE ---
// Função para gerar confetes diretamente no código.
const confetti = (opts) => {
    // Implementação do confete... (O código original do confete permanece aqui)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    const COLORS = ['#FFC107', '#FF9800', '#FF5722', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B'];
    const particles = [];
    const particleCount = opts.particleCount || 150;
    const origin = opts.origin || { x: 0.5, y: 0.5 };
    const spread = opts.spread || 90;
    const startVelocity = opts.startVelocity || 45;
    const decay = opts.decay || 0.92;
    const gravity = opts.gravity || 0.7;

    const randomRange = (min, max) => Math.random() * (max - min) + min;

    class Particle {
        constructor() {
            this.x = W * origin.x;
            this.y = H * origin.y;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.size = randomRange(5, 12);
            this.velocity = {
                x: randomRange(-spread / 2, spread / 2),
                y: randomRange(-startVelocity, -startVelocity / 2)
            };
            this.gravity = gravity;
            this.friction = decay;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = randomRange(-5, 5);
            this.opacity = 1;
        }

        update() {
            this.velocity.y += this.gravity;
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.rotation += this.rotationSpeed;
            this.opacity -= 0.01;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    const animate = () => {
        ctx.clearRect(0, 0, W, H);
        particles.forEach((particle, i) => {
            if (particle.opacity > 0) {
                particle.update();
                particle.draw();
            } else {
                particles.splice(i, 1);
            }
        });
        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            document.body.removeChild(canvas);
        }
    };

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    animate();
};

const ConfettiEffect = () => {
    useEffect(() => {
        const fire = (particleRatio, opts) => {
            const count = 200 * particleRatio;
            confetti({ particleCount: Math.floor(count), ...opts });
        };
        fire(0.25, { spread: 30, startVelocity: 60, origin: { x: 0, y: 0.7 } });
        fire(0.2, { spread: 60, origin: { x: 0.5, y: 0.6 } });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, origin: { x: 1, y: 0.7 } });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }, []);
    return null;
};


// --- COMPONENTES DE UI ---

const Card = ({ emotion, onClick, isCorrect, isWrong, isDisabled }) => (
    <motion.button
        onClick={onClick}
        disabled={isDisabled}
        className={`emotionCard ${isCorrect ? 'cardCorrect' : ''} ${isWrong ? 'cardWrong' : ''}`}
        initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.5, rotateY: -180 }}
        transition={{ duration: 0.5 }}
        layout
    >
        <img src={emotion.path} alt={emotion.label} />
    </motion.button>
);

const ProgressBar = ({ current, total }) => {
    const progress = total > 0 ? (current / total) * 100 : 0;
    return (
        <div className="progressBar">
            <div className="progressFill" style={{ width: `${progress}%` }}>
                {Math.round(progress)}%
            </div>
        </div>
    );
};

const ComboCounter = ({ count }) => {
    if (count < 2) return null;
    return (
        <AnimatePresence>
            <motion.div
                className="comboCounter"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
            >
                <span className="comboText">COMBO</span>
                <span className="comboNumber">x{count}</span>
            </motion.div>
        </AnimatePresence>
    );
};

const PointsExplosion = ({ points, position }) => {
    if (!points || !position) return null;
    return (
        <motion.div
            className="pointsExplosion"
            style={{ top: position.y, left: position.x }}
            initial={{ opacity: 1, y: 0, scale: 0 }}
            animate={{ opacity: 0, y: -100, scale: 1.5 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
        >
            +{points}
        </motion.div>
    );
};


// --- CONFIGURAÇÕES E DADOS DO JOGO ---

const SOUNDS = {
    correct: 'https://cdn.pixabay.com/audio/2021/08/04/audio_34d1b84964.mp3',
    wrong: 'https://cdn.pixabay.com/audio/2022/03/10/audio_f507b98d36.mp3',
    levelComplete: 'https://cdn.pixabay.com/audio/2022/10/18/audio_22ac8b3558.mp3'
};

const playSound = (soundName, volume = 0.3) => {
    try {
        const audio = new Audio(SOUNDS[soundName]);
        audio.volume = volume;
        audio.play().catch(() => { });
    } catch (error) {
        console.error('Falha ao carregar o som:', soundName, error);
    }
};

// Define um caminho base para as imagens para facilitar a manutenção
const IMAGE_BASE_PATH = 'https://raw.githubusercontent.com/Ludi-TEA/LudiTEA/main/public/cards/emocoes/';

const EMOTION_IMAGES = {
    homem_feliz: `${IMAGE_BASE_PATH}homem_feliz.webp`,
    homem_triste: `${IMAGE_BASE_PATH}homem_triste.webp`,
    homem_medo: `${IMAGE_BASE_PATH}homem_medo.webp`,
    homem_surpreso: `${IMAGE_BASE_PATH}homem_surpreso.webp`,
    homem_furioso: `${IMAGE_BASE_PATH}homem_furioso.webp`,
    homem_animado: `${IMAGE_BASE_PATH}homem_animado.webp`,
    homem_calmo: `${IMAGE_BASE_PATH}homem_calmo.webp`,
    homem_confuso: `${IMAGE_BASE_PATH}homem_confuso.webp`,
    homem_preocupado: `${IMAGE_BASE_PATH}homem_preocupado.webp`,
    homem_focado: `${IMAGE_BASE_PATH}homem_focado.webp`,
    homem_gargalhando: `${IMAGE_BASE_PATH}homem_gargalhando.webp`,
    homem_ciumento: `${IMAGE_BASE_PATH}homem_ciumento.webp`,
    homem_desgostoso: `${IMAGE_BASE_PATH}homem_desgostoso.webp`,
    mulher_feliz: `${IMAGE_BASE_PATH}mulher_feliz.webp`,
    mulher_triste: `${IMAGE_BASE_PATH}mulher_triste.webp`,
    mulher_medo: `${IMAGE_BASE_PATH}mulher_medo.webp`,
    mulher_surpresa: `${IMAGE_BASE_PATH}mulher_surpresa.webp`,
    mulher_furiosa: `${IMAGE_BASE_PATH}mulher_furiosa.webp`,
    mulher_animada: `${IMAGE_BASE_PATH}mulher_animada.webp`,
    mulher_calma: `${IMAGE_BASE_PATH}mulher_calma.webp`,
    mulher_confusa: `${IMAGE_BASE_PATH}mulher_confusa.webp`,
    mulher_preocupada: `${IMAGE_BASE_PATH}mulher_preocupada.webp`,
    mulher_focada: `${IMAGE_BASE_PATH}mulher_focada.webp`,
    mulher_gargalhando: `${IMAGE_BASE_PATH}mulher_gargalhando.webp`,
    mulher_ciumenta: `${IMAGE_BASE_PATH}mulher_ciumenta.webp`,
    mulher_risada_engracada: `${IMAGE_BASE_PATH}mulher_risada_engracada.webp`,
    assustado: `${IMAGE_BASE_PATH}assustado.webp`
};

const EMOTION_CARDS = [
    { id: 'homem_feliz', label: 'Feliz', path: EMOTION_IMAGES.homem_feliz },
    { id: 'homem_triste', label: 'Triste', path: EMOTION_IMAGES.homem_triste },
    { id: 'homem_medo', label: 'Medo', path: EMOTION_IMAGES.homem_medo },
    { id: 'homem_surpreso', label: 'Surpreso', path: EMOTION_IMAGES.homem_surpreso },
    { id: 'homem_furioso', label: 'Furioso', path: EMOTION_IMAGES.homem_furioso },
    { id: 'homem_animado', label: 'Animado', path: EMOTION_IMAGES.homem_animado },
    { id: 'homem_calmo', label: 'Calmo', path: EMOTION_IMAGES.homem_calmo },
    { id: 'homem_confuso', label: 'Confuso', path: EMOTION_IMAGES.homem_confuso },
    { id: 'homem_preocupado', label: 'Preocupado', path: EMOTION_IMAGES.homem_preocupado },
    { id: 'homem_focado', label: 'Focado', path: EMOTION_IMAGES.homem_focado },
    { id: 'homem_gargalhando', label: 'Gargalhando', path: EMOTION_IMAGES.homem_gargalhando },
    { id: 'homem_ciumento', label: 'Ciumento', path: EMOTION_IMAGES.homem_ciumento },
    { id: 'homem_desgostoso', label: 'Desgostoso', path: EMOTION_IMAGES.homem_desgostoso },
    { id: 'mulher_feliz', label: 'Feliz', path: EMOTION_IMAGES.mulher_feliz },
    { id: 'mulher_triste', label: 'Triste', path: EMOTION_IMAGES.mulher_triste },
    { id: 'mulher_medo', label: 'Medo', path: EMOTION_IMAGES.mulher_medo },
    { id: 'mulher_surpresa', label: 'Surpresa', path: EMOTION_IMAGES.mulher_surpresa },
    { id: 'mulher_furiosa', label: 'Furiosa', path: EMOTION_IMAGES.mulher_furiosa },
    { id: 'mulher_animada', label: 'Animada', path: EMOTION_IMAGES.mulher_animada },
    { id: 'mulher_calma', label: 'Calma', path: EMOTION_IMAGES.mulher_calma },
    { id: 'mulher_confusa', label: 'Confusa', path: EMOTION_IMAGES.mulher_confusa },
    { id: 'mulher_preocupada', label: 'Preocupada', path: EMOTION_IMAGES.mulher_preocupada },
    { id: 'mulher_focada', label: 'Focada', path: EMOTION_IMAGES.mulher_focada },
    { id: 'mulher_gargalhando', label: 'Gargalhando', path: EMOTION_IMAGES.mulher_gargalhando },
    { id: 'mulher_ciumenta', label: 'Ciumenta', path: EMOTION_IMAGES.mulher_ciumenta },
    { id: 'mulher_risada_engracada', label: 'Engraçada', path: EMOTION_IMAGES.mulher_risada_engracada },
    { id: 'assustado', label: 'Assustado', path: EMOTION_IMAGES.assustado }
];

const getNextLevelConfig = (currentLevel) => {
    const levelNumber = currentLevel + 1;
    const numCards = Math.min(2 + Math.floor(currentLevel / 4), 8);
    const questionsPerLevel = 4 + Math.floor(currentLevel / 5);
    const pointsPerCorrect = 100 + (currentLevel * 10);
    return { levelNumber, numCards, questionsPerLevel, pointsPerCorrect };
};

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// --- COMPONENTE PRINCIPAL DO JOGO ---

export default function FacialExpressionsGame() {
    const [gameState, setGameState] = useState('intro');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [currentCards, setCurrentCards] = useState([]);
    const [targetCard, setTargetCard] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [pointsEffect, setPointsEffect] = useState(null);

    const levelConfig = useMemo(() => getNextLevelConfig(currentLevel), [currentLevel]);
    const { levelNumber, numCards, questionsPerLevel, pointsPerCorrect } = levelConfig;

    const prepareLevel = useCallback(() => {
        const uniqueLabels = [...new Set(EMOTION_CARDS.map(c => c.label))];
        const shuffledLabels = shuffleArray(uniqueLabels);
        const targetLabel = shuffledLabels[0];

        const targetOptions = EMOTION_CARDS.filter(c => c.label === targetLabel);
        const newTargetCard = shuffleArray(targetOptions)[0];

        const otherCards = EMOTION_CARDS.filter(c => c.label !== targetLabel);
        const shuffledOthers = shuffleArray(otherCards);

        const cardsForLevel = shuffleArray([newTargetCard, ...shuffledOthers.slice(0, numCards - 1)]);

        setCurrentCards(cardsForLevel);
        setTargetCard(newTargetCard);
        setFeedback(null);
        setSelectedCard(null);
        setIsDisabled(false);
    }, [numCards]);

    useEffect(() => {
        if (gameState === 'playing') {
            prepareLevel();
        }
    }, [gameState, currentLevel]); // Adicionado currentLevel para preparar novo nível

    const startGame = () => {
        setCurrentLevel(0);
        setScore(0);
        setTotalScore(0);
        setCombo(0);
        setCurrentQuestion(0);
        setGameState('playing');
    };

    const nextLevel = () => {
        if (currentLevel < 29) { // Nível máximo 30
            setCurrentLevel(prev => prev + 1);
            setCurrentQuestion(0);
            setScore(0);
            setGameState('playing');
        } else {
            setGameState('gameComplete');
        }
    };

    const selectCard = (card, event) => {
        if (isDisabled) return;

        setIsDisabled(true);
        setSelectedCard(card.id);

        const isCorrect = card.label === targetCard.label;

        if (isCorrect) {
            setFeedback('correct');
            const newCombo = combo + 1;
            let points = pointsPerCorrect;
            if (newCombo >= 3) points = Math.round(points * (1 + (newCombo * 0.1)));

            setScore(prev => prev + points);
            setTotalScore(prev => prev + points);
            setCombo(newCombo);
            if (soundEnabled) playSound('correct');

            // Efeito de pontos
            const rect = event.currentTarget.getBoundingClientRect();
            setPointsEffect({ points, position: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } });
            setTimeout(() => setPointsEffect(null), 1500);

            setTimeout(() => {
                if (currentQuestion < questionsPerLevel - 1) {
                    setCurrentQuestion(prev => prev + 1);
                    prepareLevel();
                } else {
                    if (soundEnabled) playSound('levelComplete');
                    setGameState('levelComplete');
                }
            }, 1500);
        } else {
            setFeedback('wrong');
            setCombo(0);
            if (soundEnabled) playSound('wrong');
            setTimeout(() => {
                setFeedback(null);
                setSelectedCard(null);
                setIsDisabled(false);
            }, 1000);
        }
    };

    // --- RENDERIZAÇÃO DAS TELAS ---

    const renderIntroScreen = () => (
        <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="screen-center"
        >
            <motion.div className="animate-float">
                <img
                    src="https://raw.githubusercontent.com/Ludi-TEA/LudiTEA/main/public/images/mascotes/leo/leo_boas_vindas_resultado.webp"
                    alt="Mascote Leo"
                    width={280}
                    height={280}
                    className="intro-mascot"
                />
            </motion.div>
            <h1 className="intro-main-title">
                Expressões Faciais
            </h1>
            <p className="intro-main-subtitle">
                Aprenda e divirta-se com as emoções!
            </p>
            <motion.button
                onClick={startGame}
                className="intro-start-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Começar a Jogar
            </motion.button>
        </motion.div>
    );

    const renderGameScreen = () => (
        <>
            <div className="game-hud">
                <div className="hud-item">Nível: <strong>{levelNumber}</strong></div>
                <div className="hud-item">Pontos: <strong>{score}</strong></div>
                <div className="hud-item">Total: <strong>{totalScore}</strong></div>
            </div>
            <ProgressBar current={currentQuestion + 1} total={questionsPerLevel} />
            <ComboCounter count={combo} />
            <PointsExplosion {...pointsEffect} />

            <div className="game-area">
                <motion.div
                    key={targetCard?.label}
                    className="instruction-box"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2>Encontre: <span className="target-emotion">{targetCard?.label}</span></h2>
                </motion.div>

                <div className={`cards-grid cols-${Math.min(numCards, 4)}`}>
                    <AnimatePresence>
                        {currentCards.map((card) => (
                            <Card
                                key={card.id}
                                emotion={card}
                                onClick={(e) => selectCard(card, e)}
                                isCorrect={feedback === 'correct' && card.id === selectedCard}
                                isWrong={feedback === 'wrong' && card.id === selectedCard}
                                isDisabled={isDisabled}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );

    const renderLevelCompleteScreen = () => (
        <div className="screen-center">
            <ConfettiEffect />
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                className="modal-container"
            >
                <h2 className="modal-title">Nível {levelNumber} Completo!</h2>
                <div className="modal-icon">🎉</div>
                <div className="modal-info">
                    <p>Pontos do Nível: <span className="score-highlight">{score}</span></p>
                    <p className="total-score">Pontuação Total: <span className="total-score-highlight">{totalScore}</span></p>
                </div>
                <button onClick={nextLevel} className="modal-button next-level">
                    Próximo Nível
                </button>
            </motion.div>
        </div>
    );

    const renderGameCompleteScreen = () => (
        <div className="screen-center">
            <ConfettiEffect />
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                className="modal-container"
            >
                <Trophy className="modal-trophy" />
                <h2 className="modal-title congrats">PARABÉNS!</h2>
                <p className="modal-text">Você completou todos os níveis!</p>
                <p className="final-score">Pontuação Final: {totalScore}</p>
                <button onClick={startGame} className="modal-button play-again">
                    Jogar Novamente
                </button>
            </motion.div>
        </div>
    );

    const cssStyles = `
        /* FONTES E ESTILOS GLOBAIS */
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');
        
        .game-container {
            font-family: 'Nunito', sans-serif;
            min-height: 100vh;
            background: linear-gradient(135deg, #a8e0ff 0%, #c4f5c7 100%);
            position: relative;
            overflow: hidden;
            color: #333;
            transition: background 0.7s ease-in-out;
        }

        /* CABEÇALHO */
        .game-header {
            position: sticky;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 50;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border-radius: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 95%;
            width: 500px;
            margin: 0 auto;
        }
        .game-title {
            font-size: 1.5rem;
            font-weight: 900;
            color: #00796B;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .header-button {
            background: none;
            border: none;
            padding: 8px;
            border-radius: 50%;
            cursor: pointer;
            transition: background-color 0.2s;
            color: #555;
        }
        .header-button:hover {
            background-color: rgba(0,0,0,0.1);
        }

        /* TELAS (INTRO, LEVEL COMPLETE, ETC) */
        
        /* Muda o fundo e esconde o header na tela de intro */
        .game-container.intro-mode {
            background: linear-gradient(160deg, #1d2b64 0%, #3f51b5 100%);
        }
        .game-container.intro-mode .game-header {
            display: none;
        }
        .game-container.intro-mode .screen-center {
            min-height: 100vh;
        }

        .intro-mascot {
            width: 250px;
            height: auto;
            max-width: 60vw;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
            margin-bottom: -10px;
        }
        .intro-main-title {
            font-family: 'Nunito', sans-serif;
            font-size: clamp(2.5rem, 10vw, 4.5rem);
            font-weight: 900;
            color: #ffeb3b;
            text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.4);
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
        }
        .intro-main-subtitle {
            font-size: clamp(1rem, 4vw, 1.25rem);
            color: #e3f2fd;
            margin-bottom: 2.5rem;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
        }
        .intro-start-button {
            background-image: linear-gradient(45deg, #ffeb3b, #fbc02d);
            color: #3f2a14;
            font-size: 1.5rem;
            font-weight: 700;
            padding: 15px 40px;
            border-radius: 50px;
            border: none;
            box-shadow: 0 5px 20px rgba(251, 192, 45, 0.4);
            cursor: pointer;
            transition: all 0.3s ease;
            animation: introPulse 2.5s infinite;
        }
        
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes introPulse { 0%, 100% { transform: scale(1); box-shadow: 0 5px 20px rgba(251, 192, 45, 0.4); } 50% { transform: scale(1.05); box-shadow: 0 8px 30px rgba(251, 192, 45, 0.6); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        
        .screen-center {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: calc(100vh - 100px);
            text-align: center;
            padding: 20px;
        }
        
        /* MODAL (Level Complete / Game Over) */
        .modal-container {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(15px);
            border-radius: 30px;
            padding: 30px 40px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            border: 3px solid white;
        }
        .modal-title { font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem; color: #004D40; }
        .modal-title.congrats { color: #FFA000; }
        .modal-icon { font-size: 5rem; margin-bottom: 1rem; }
        .modal-trophy { width: 80px; height: 80px; color: #FFC107; margin: 0 auto 1rem auto; animation: trophyBounce 2s infinite; }
        .modal-info { margin-bottom: 2rem; font-size: 1.2rem; color: #444; }
        .score-highlight { font-weight: 700; color: #4CAF50; }
        .total-score { font-size: 1.4rem; font-weight: 700; }
        .total-score-highlight, .final-score { font-size: 2rem; font-weight: 900; color: #00796B; }
        .modal-button {
            color: white;
            font-size: 1.2rem;
            font-weight: 700;
            padding: 12px 30px;
            border-radius: 50px;
            border: none;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            cursor: pointer;
            transition: all 0.3s ease;
            transform: scale(1);
        }
        .modal-button:hover { transform: scale(1.05); }
        .modal-button.next-level { background-image: linear-gradient(45deg, #66BB6A, #4CAF50); }
        .modal-button.play-again { background-image: linear-gradient(45deg, #26C6DA, #00ACC1); }

        @keyframes trophyBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

        /* HUD DO JOGO */
        .game-hud {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 15px auto;
            flex-wrap: wrap;
        }
        .hud-item {
            background: rgba(255,255,255,0.7);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 1rem;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        /* ÁREA PRINCIPAL DO JOGO */
        .game-area { padding: 20px; }
        .instruction-box {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            padding: 15px 30px;
            max-width: 500px;
            margin: 0 auto 30px auto;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .instruction-box h2 {
            font-size: 1.8rem;
            font-weight: 700;
            color: #333;
        }
        .target-emotion {
            color: #00796B;
            font-weight: 900;
        }
        
        /* GRID DE CARDS */
        .cards-grid {
            display: grid;
            gap: 20px;
            justify-content: center;
            max-width: 800px;
            margin: 0 auto;
        }
        .cols-2 { grid-template-columns: repeat(2, 1fr); }
        .cols-3 { grid-template-columns: repeat(3, 1fr); }
        .cols-4 { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 600px) {
            .cols-3, .cols-4 { grid-template-columns: repeat(2, 1fr); }
        }

        /* CARD DE EMOÇÃO */
        .emotionCard {
            width: 150px;
            height: 150px;
            border-radius: 25px;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            position: relative;
            padding: 10px;
            border: 4px solid transparent;
        }
        .emotionCard:not([disabled]):hover {
            transform: translateY(-8px) scale(1.05);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .emotionCard:disabled { cursor: not-allowed; opacity: 0.7; }
        .emotionCard img { width: 100%; height: 100%; object-fit: contain; }

        /* FEEDBACK DE ACERTO/ERRO */
        .cardCorrect { animation: correctPulse 0.5s ease; border-color: #4CAF50; background: #C8E6C9; }
        .cardWrong { animation: wrongShake 0.5s ease; border-color: #F44336; background: #FFCDD2; }
        @keyframes correctPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        @keyframes wrongShake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px) rotate(-3deg); } 40% { transform: translateX(8px) rotate(3deg); } 60% { transform: translateX(-8px) rotate(-3deg); } 80% { transform: translateX(8px) rotate(3deg); } }

        /* EXPLOSÃO DE PONTOS */
        .pointsExplosion {
            position: fixed;
            font-size: 2.5rem;
            font-weight: 900;
            color: #4CAF50;
            z-index: 9999;
            pointer-events: none;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        /* BARRA DE PROGRESSO */
        .progressBar {
            position: sticky;
            top: 85px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            max-width: 400px;
            height: 25px;
            background: rgba(255,255,255,0.8);
            border-radius: 15px;
            overflow: hidden;
            z-index: 40;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border: 2px solid white;
        }
        .progressFill {
            height: 100%;
            background: linear-gradient(90deg, #81C784, #4CAF50);
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
        }

        /* CONTADOR DE COMBO */
        .comboCounter {
            position: fixed;
            top: 120px;
            right: 20px;
            background: white;
            padding: 10px 20px;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            z-index: 100;
            text-align: center;
            border: 3px solid #FFA000;
        }
        .comboText { display: block; font-size: 0.8rem; font-weight: 700; color: #EF6C00; }
        .comboNumber { font-size: 2rem; font-weight: 900; color: #F57C00; line-height: 1; }
    `;

    return (
        <div className={`game-container ${gameState === 'intro' ? 'intro-mode' : ''}`}>
            <style>{cssStyles}</style>
            <header className="game-header">
                <a href="/dashboard" className="header-button">
                    <ArrowLeft size={24} />
                </a>
                <h1 className="game-title">😊 Expressões</h1>
                <button onClick={() => setSoundEnabled(!soundEnabled)} className="header-button">
                    {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
            </header>

            <main>
                <AnimatePresence mode="wait">
                    {gameState === 'intro' && renderIntroScreen()}
                    {gameState === 'playing' && renderGameScreen()}
                    {gameState === 'levelComplete' && renderLevelCompleteScreen()}
                    {gameState === 'gameComplete' && renderGameCompleteScreen()}
                </AnimatePresence>
            </main>
        </div>
    );
}

