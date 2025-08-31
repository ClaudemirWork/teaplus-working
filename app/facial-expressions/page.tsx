'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Trophy } from 'lucide-react';

// Função para gerar confetes diretamente no código.
const confetti = (opts) => {
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
    const particleCount = opts.particleCount || 50;
    const origin = opts.origin || { x: 0.5, y: 0.5 };
    const spread = opts.spread || 90;
    const startVelocity = opts.startVelocity || 45;

    const randomRange = (min, max) => Math.random() * (max - min) + min;

    class Particle {
        constructor() {
            this.x = W * origin.x;
            this.y = H * origin.y;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.size = randomRange(5, 10);
            this.velocity = {
                x: randomRange(-spread / 2, spread / 2),
                y: randomRange(-startVelocity, -startVelocity / 2)
            };
            this.gravity = 0.5;
            this.friction = 0.99;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = randomRange(5, 10);
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

const Card = ({ emotion, onClick, isSelected, isCorrect, isWrong, isDisabled }) => (
    <motion.button
        className={`relative flex flex-col items-center justify-center p-2 sm:p-4 rounded-3xl shadow-lg transition-all duration-300 transform ${
            isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95'
        } ${isCorrect ? 'bg-green-300 scale-110' : ''} ${isWrong ? 'bg-red-300 animate-shake' : ''}`}
        onClick={onClick}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        layout
    >
        <motion.img
            src={emotion.path}
            alt={emotion.label}
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
        <span className="mt-2 text-xs sm:text-sm font-bold text-gray-700">{emotion.label}</span>
    </motion.button>
);

const SOUNDS = {
    correct: 'https://cdn.pixabay.com/audio/2021/08/04/audio_34d1b84964.mp3', // Som de acerto
    wrong: 'https://cdn.pixabay.com/audio/2022/03/10/audio_f507b98d36.mp3', // Som de erro
    levelComplete: 'https://cdn.pixabay.com/audio/2022/10/18/audio_22ac8b3558.mp3' // Som de nível completo
};

const playSound = (soundName, volume = 0.3) => {
    try {
        const audio = new Audio(SOUNDS[soundName]);
        audio.volume = volume;
        audio.play().catch(() => {});
    } catch (error) {
        console.error('Falha ao carregar o som:', soundName, error);
    }
};

const EMOTION_IMAGES = {
    homem_feliz: '/cards/emocoes/homem_feliz.webp',
    homem_triste: '/cards/emocoes/homem_triste.webp',
    homem_medo: '/cards/emocoes/homem_medo.webp',
    homem_surpreso: '/cards/emocoes/homem_surpreso.webp',
    homem_furioso: '/cards/emocoes/homem_furioso.webp',
    homem_animado: '/cards/emocoes/homem_animado.webp',
    homem_calmo: '/cards/emocoes/homem_calmo.webp',
    homem_confuso: '/cards/emocoes/homem_confuso.webp',
    homem_preocupado: '/cards/emocoes/homem_preocupado.webp',
    homem_focado: '/cards/emocoes/homem_focado.webp',
    homem_gargalhando: '/cards/emocoes/homem_gargalhando.webp',
    homem_ciumento: '/cards/emocoes/homem_ciumento.webp',
    homem_desgostoso: '/cards/emocoes/homem_desgostoso.webp',
    mulher_feliz: '/cards/emocoes/mulher_feliz.webp',
    mulher_triste: '/cards/emocoes/mulher_triste.webp',
    mulher_medo: '/cards/emocoes/mulher_medo.webp',
    mulher_surpresa: '/cards/emocoes/mulher_surpresa.webp',
    mulher_furiosa: '/cards/emocoes/mulher_furiosa.webp',
    mulher_animada: '/cards/emocoes/mulher_animada.webp',
    mulher_calma: '/cards/emocoes/mulher_calma.webp',
    mulher_confusa: '/cards/emocoes/mulher_confusa.webp',
    mulher_preocupada: '/cards/emocoes/mulher_preocupada.webp',
    mulher_focada: '/cards/emocoes/mulher_focada.webp',
    mulher_gargalhando: '/cards/emocoes/mulher_gargalhando.webp',
    mulher_ciumenta: '/cards/emocoes/mulher_ciumenta.webp',
    mulher_risada_engracada: '/cards/emocoes/mulher_risada_engracada.webp',
    assustado: '/cards/emocoes/assustado.webp'
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
    const numCards = Math.min(2 + Math.floor(currentLevel / 5), 6);
    const questionsPerLevel = 3 + Math.floor(currentLevel / 5);
    const pointsPerCorrect = 100 + (levelNumber * 10);
    return { levelNumber, numCards, questionsPerLevel, pointsPerCorrect };
};

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

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

    const levelConfig = useMemo(() => getNextLevelConfig(currentLevel), [currentLevel]);
    const { levelNumber, numCards, questionsPerLevel, pointsPerCorrect } = levelConfig;

    const prepareLevel = useCallback(() => {
        const shuffledEmotions = shuffleArray(EMOTION_CARDS);
        const cardsForLevel = shuffledEmotions.slice(0, numCards);
        setCurrentCards(cardsForLevel);
        const randomCard = cardsForLevel[Math.floor(Math.random() * cardsForLevel.length)];
        setTargetCard(randomCard);
        setFeedback(null);
        setSelectedCard(null);
        setIsDisabled(false);
    }, [numCards]);

    useEffect(() => {
        if (gameState === 'playing') {
            prepareLevel();
        }
    }, [gameState, prepareLevel]);

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

    const selectCard = (cardId) => {
        if (isDisabled) return;

        setIsDisabled(true);
        setSelectedCard(cardId);

        const isCorrect = cardId === targetCard.id;

        if (isCorrect) {
            setFeedback('correct');
            let points = pointsPerCorrect;
            const newCombo = combo + 1;
            if (newCombo >= 3) points *= 1.5;
            setScore(prev => prev + points);
            setTotalScore(prev => prev + points);
            setCombo(newCombo);
            if (soundEnabled) playSound('correct');

            setTimeout(() => {
                if (currentQuestion < questionsPerLevel - 1) {
                    setCurrentQuestion(prev => prev + 1);
                    prepareLevel();
                    setIsDisabled(false);
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

    const ConfettiEffect = () => {
        useEffect(() => {
            const defaults = {
                origin: { y: 0.7 }
            };
            const fire = (particleRatio, opts) => {
                const count = 200 * particleRatio;
                confetti({ ...defaults, particleCount: Math.floor(count), ...opts });
            };
            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            fire(0.2, {
                spread: 60,
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }, []);
        return null;
    };

    const renderGameScreen = () => (
        <>
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
                <div className="w-full max-w-lg mb-8 bg-white/90 rounded-2xl p-4 shadow-xl text-center">
                    <motion.h2
                        key={targetCard?.label}
                        className="text-2xl sm:text-3xl font-extrabold text-gray-800"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Encontre: <span className="text-teal-600">{targetCard?.label}</span>
                    </motion.h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
                    <AnimatePresence>
                        {currentCards.map((card) => (
                            <Card
                                key={card.id}
                                emotion={card}
                                onClick={() => selectCard(card.id)}
                                isSelected={selectedCard === card.id}
                                isCorrect={feedback === 'correct' && card.id === targetCard.id}
                                isWrong={feedback === 'wrong' && selectedCard === card.id}
                                isDisabled={isDisabled}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm sm:text-base font-medium text-gray-600">
                    <div className="bg-white/80 px-4 py-2 rounded-full shadow-md">
                        Nível: {levelNumber}
                    </div>
                    <div className="bg-white/80 px-4 py-2 rounded-full shadow-md">
                        Pontos: {score}
                    </div>
                    <div className="bg-white/80 px-4 py-2 rounded-full shadow-md">
                        Total: {totalScore}
                    </div>
                </div>
            </div>
        </>
    );

    const renderLevelCompleteScreen = () => (
        <div className="flex items-center justify-center min-h-[80vh]">
            <ConfettiEffect />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl border-4 border-yellow-400"
            >
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-800">
                    Nível {levelNumber} Completo!
                </h2>
                <div className="text-6xl sm:text-8xl mb-4 animate-pulse">🎉</div>
                <div className="space-y-2 mb-6 text-gray-700">
                    <p className="text-lg">Pontos do Nível: <span className="font-bold text-xl text-green-600">{score}</span></p>
                    <p className="text-xl font-bold">
                        Pontuação Total: <span className="text-2xl text-teal-600">{totalScore}</span>
                    </p>
                </div>
                <button
                    onClick={nextLevel}
                    className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-green-700 transition transform hover:scale-105 shadow-lg"
                >
                    Próximo Nível
                </button>
            </motion.div>
        </div>
    );

    const renderGameCompleteScreen = () => (
        <div className="flex items-center justify-center min-h-[80vh]">
            <ConfettiEffect />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl border-4 border-yellow-400"
            >
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-4xl font-extrabold mb-4 text-teal-600">
                    PARABÉNS!
                </h2>
                <p className="text-xl mb-4 text-gray-800">
                    Você completou todos os níveis!
                </p>
                <p className="text-3xl font-bold text-teal-600 mb-6">
                    Pontuação Final: {totalScore}
                </p>
                <button
                    onClick={startGame}
                    className="bg-teal-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-teal-700 transition transform hover:scale-105 shadow-lg"
                >
                    Jogar Novamente
                </button>
            </motion.div>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-blue-200 to-green-200 min-h-screen font-sans antialiased text-gray-800 relative overflow-hidden">
            <header className="sticky top-0 z-50 p-4 bg-white/50 backdrop-blur-lg shadow-md rounded-b-xl flex justify-between items-center max-w-7xl mx-auto mt-2 mb-4">
                <a href="/dashboard" className="p-2 rounded-full hover:bg-gray-200 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                </a>
                <h1 className="text-xl sm:text-2xl font-extrabold text-teal-600 drop-shadow-md">
                    😊 Expressões Faciais
                </h1>
                <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-full hover:bg-gray-200 transition">
                    {soundEnabled ? <Volume2 className="h-6 w-6 text-gray-600" /> : <VolumeX className="h-6 w-6 text-gray-600" />}
                </button>
            </header>

            <main className="container mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    {gameState === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="flex flex-col items-center justify-center min-h-[70vh] text-center"
                        >
                            <motion.h2
                                className="text-4xl sm:text-6xl font-extrabold text-teal-600 mb-4 drop-shadow-lg"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                Vamos Jogar!
                            </motion.h2>
                            <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-prose">
                                Clique na emoção correta e ajude os personagens a se expressarem!
                            </p>
                            <motion.button
                                onClick={startGame}
                                className="bg-teal-500 text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-teal-600 transition transform hover:scale-105"
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Começar
                            </motion.button>
                        </motion.div>
                    )}
                    {gameState === 'playing' && renderGameScreen()}
                    {gameState === 'levelComplete' && renderLevelCompleteScreen()}
                    {gameState === 'gameComplete' && renderGameCompleteScreen()}
                </AnimatePresence>
            </main>
        </div>
    );
}
