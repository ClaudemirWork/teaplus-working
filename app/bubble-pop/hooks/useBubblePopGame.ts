// app/bubble-pop/hooks/useBubblePopGame.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabaseClient';
import { GameAudioManager } from '@/utils/gameAudioManager';
import { Bubble, Particle, Equipment, ScoreEffect, FishEffect } from '@/app/types/bubble-pop';
import dynamic from 'next/dynamic';

const confetti = dynamic(() => import('canvas-confetti'), { ssr: false });

const levelConfigs = [
    { level: 1, name: 'Superfície - Bolhas Coloridas', depth: '0-10m', totalBubbles: 100, minePercentage: 0.05, spawnRate: 600, oxygenDrain: 0.3, bgGradient: 'from-cyan-300 to-blue-400', equipment: null, features: ['colored_bubbles']},
    { level: 2, name: 'Águas Rasas - Salvando Peixes', depth: '10-20m', totalBubbles: 110, minePercentage: 0.1, spawnRate: 580, oxygenDrain: 0.4, bgGradient: 'from-blue-400 to-blue-500', equipment: 'mask', features: ['colored_bubbles', 'fish_rescue']},
    { level: 3, name: 'Zona Clara - Multiplicadores', depth: '20-30m', totalBubbles: 120, minePercentage: 0.15, spawnRate: 560, oxygenDrain: 0.5, bgGradient: 'from-blue-500 to-blue-600', equipment: 'fins', features: ['colored_bubbles', 'fish_rescue', 'multipliers']},
    { level: 4, name: 'Águas Médias - Power-ups', depth: '30-40m', totalBubbles: 130, minePercentage: 0.2, spawnRate: 540, oxygenDrain: 0.6, bgGradient: 'from-blue-600 to-blue-700', equipment: 'tank', features: ['colored_bubbles', 'fish_rescue', 'multipliers', 'powerups']},
    { level: 5, name: 'Zona Mista - Todos Elementos', depth: '40-50m', totalBubbles: 140, minePercentage: 0.25, spawnRate: 520, oxygenDrain: 0.7, bgGradient: 'from-blue-700 to-indigo-700', equipment: 'suit', features: ['all']},
    { level: 6, name: 'Correntes Marinhas', depth: '50-60m', totalBubbles: 150, minePercentage: 0.3, spawnRate: 500, oxygenDrain: 0.8, bgGradient: 'from-indigo-700 to-indigo-800', equipment: 'light', features: ['all', 'currents']},
    { level: 7, name: 'Zona Escura', depth: '60-70m', totalBubbles: 140, minePercentage: 0.35, spawnRate: 480, oxygenDrain: 0.9, bgGradient: 'from-indigo-800 to-indigo-900', equipment: null, features: ['all', 'darkness']},
    { level: 8, name: 'Águas Profundas', depth: '70-80m', totalBubbles: 130, minePercentage: 0.4, spawnRate: 460, oxygenDrain: 1.0, bgGradient: 'from-indigo-900 to-purple-900', equipment: null, features: ['all', 'predators']},
    { level: 9, name: 'Zona Abissal', depth: '80-90m', totalBubbles: 120, minePercentage: 0.45, spawnRate: 440, oxygenDrain: 1.1, bgGradient: 'from-purple-900 to-black', equipment: null, features: ['all', 'extreme']},
    { level: 10, name: 'Portal do Abismo', depth: '90-100m', totalBubbles: 100, minePercentage: 0.5, spawnRate: 420, oxygenDrain: 1.2, bgGradient: 'from-black to-purple-950', equipment: null, features: ['all', 'portal']},
    { level: 11, name: 'Reino do Senhor dos Mares', depth: 'ABISMO', totalBubbles: 150, minePercentage: 0.3, spawnRate: 400, oxygenDrain: 0, bgGradient: 'from-purple-950 via-black to-red-950', equipment: null, features: ['boss_battle']}
];

const coloredBubbles = {
    air: { color: '#E0F2FE', points: 5, size: 40 },
    oxygen: { color: '#60A5FA', points: 15, size: 55 },
    pink: { color: '#F9A8D4', points: 20, size: 45 },
    purple: { color: '#C084FC', points: 25, size: 45 },
    yellow: { color: '#FDE047', points: 30, size: 45 },
    green: { color: '#86EFAC', points: 35, size: 45 },
    orange: { color: '#FB923C', points: 40, size: 45 },
    treasure: { color: '#FFD700', points: 50, size: 50 },
    pearl: { color: '#FFF0F5', points: 100, size: 40 }
};

const comboPhrases = ["Uhuuuu!", "Incrível!", "Mandou bem!", "Continue assim!", "Que demais!"];

export function useBubblePopGame(gameAreaRef: React.RefObject<HTMLDivElement>) {
    const router = useRouter();
    const supabase = createClient();
    const animationRef = useRef<number>();
    const audioManager = useRef<GameAudioManager | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [scoreEffects, setScoreEffects] = useState<ScoreEffect[]>([]);
    const [fishEffects, setFishEffects] = useState<FishEffect[]>([]);
    const [oxygenLevel, setOxygenLevel] = useState(100);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [poppedBubbles, setPoppedBubbles] = useState(0);
    const [missedBubbles, setMissedBubbles] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [levelMessage, setLevelMessage] = useState('');
    const [showLevelTransition, setShowLevelTransition] = useState(false);
    const [completedLevels, setCompletedLevels] = useState<number[]>([]);
    const [bubblesRemaining, setBubblesRemaining] = useState(0);
    const [bubblesSpawned, setBubblesSpawned] = useState(0);
    const [equipment, setEquipment] = useState<Equipment>({ mask: false, fins: false, tank: false, suit: false, light: false });
    const [savedFish, setSavedFish] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [levelCompleted, setLevelCompleted] = useState(false);
    
    // LINHA QUE FALTAVA ADICIONADA AQUI
    const [freedCreatures, setFreedCreatures] = useState<string[]>([]);
    const [bossDefeated, setBossDefeated] = useState(false);

    useEffect(() => {
        if (!audioManager.current) {
            audioManager.current = GameAudioManager.getInstance();
        }
    }, []);

    const playPopSound = useCallback((type: Bubble['type']) => {
        if (!audioEnabled) return;
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (type === 'mine') {
                const noise = audioContext.createOscillator();
                const noiseGain = audioContext.createGain();
                noise.type = 'sawtooth';
                noise.frequency.value = 100;
                noise.connect(noiseGain);
                noiseGain.connect(audioContext.destination);
                noiseGain.gain.setValueAtTime(0.5, audioContext.currentTime);
                noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                noise.start(audioContext.currentTime);
                noise.stop(audioContext.currentTime + 0.3);

                oscillator.frequency.value = 50;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.7, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            } else if (type === 'pearl' || type === 'treasure') {
                oscillator.frequency.value = 1200;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } else {
                const freqMap: { [key: string]: number } = {
                    air: 600, oxygen: 700, pink: 800, purple: 900,
                    yellow: 1000, green: 1100, orange: 1200
                };
                oscillator.frequency.value = freqMap[type as keyof typeof freqMap] || 600;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.05);
            }
        } catch (e) {
            console.error("Web Audio API error:", e);
        }
    }, [audioEnabled]);

    const createBubble = useCallback(() => {
        if (!isPlaying || !gameAreaRef.current || levelCompleted) return;
        const config = levelConfigs[currentLevel - 1];
        if (bubblesSpawned >= config.totalBubbles) return;
    
        const gameArea = gameAreaRef.current.getBoundingClientRect();
        const rand = Math.random();
        let type: Bubble['type'] = 'air';
        let bubbleConfig: any = coloredBubbles.air;
    
        if (rand < config.minePercentage) {
            type = 'mine';
            bubbleConfig = { color: '#8B0000', points: -20, size: 45 };
        } else {
            const featureRand = Math.random();
            if (config.features.includes('fish_rescue') && featureRand < 0.15) {
                type = 'fish';
                bubbleConfig = { color: '#87CEEB', points: 50, size: 55 };
            } else {
                const colorRand = Math.random();
                const types = Object.keys(coloredBubbles) as (keyof typeof coloredBubbles)[];
                const selectedType = types[Math.floor(colorRand * types.length)];
                type = selectedType;
                bubbleConfig = coloredBubbles[selectedType];
            }
        }
    
        const newBubble: Bubble = {
            id: Date.now() + Math.random(),
            x: Math.random() * (gameArea.width - bubbleConfig.size),
            y: gameArea.height + bubbleConfig.size,
            size: bubbleConfig.size,
            speed: 1.2 + Math.random() * 0.5,
            color: bubbleConfig.color,
            points: bubbleConfig.points,
            type: type,
            popped: false,
            opacity: 1,
        };
    
        setBubbles(prev => [...prev, newBubble]);
        setBubblesSpawned(prev => prev + 1);
    }, [isPlaying, levelCompleted, currentLevel, bubblesSpawned, gameAreaRef]);
    
    // O resto do hook (popBubble, startActivity, etc.) continua o mesmo
    // ...
    const toggleAudio = useCallback(() => {
        if (audioManager.current) {
            const newState = audioManager.current.toggleAudio();
            setAudioEnabled(newState);
            if (newState) {
                audioManager.current.falarMila("Áudio ligado!");
            }
        }
    }, []);

    const createCelebrationBurst = useCallback(() => {
        const fireConfetti = async () => {
            const confettiInstance = await confetti;
            if (confettiInstance) {
                confettiInstance({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
        };
        fireConfetti();
    }, []);
    
    const endGame = useCallback((bossVictory = false) => {
        setIsPlaying(false);
        audioManager.current?.pararTodos();
        const totalAttempts = poppedBubbles + missedBubbles;
        const acc = totalAttempts > 0 ? Math.round((poppedBubbles / totalAttempts) * 100) : 0;
        setAccuracy(acc);
        setShowResults(true);

        if (score > (parseInt(localStorage.getItem('bubblePop_bestScore') || '0'))) {
             audioManager.current?.falarMila("Novo recorde! Parabéns!");
        }
    }, [poppedBubbles, missedBubbles, score]);

    const resetLevel = useCallback(() => {
        setIsPlaying(false);
        setLevelMessage('💣 BOMBA! Reiniciando nível...');
        setShowLevelTransition(true);
        audioManager.current?.falarMila("Vamos tentar de novo!");

        setTimeout(() => {
            const config = levelConfigs[currentLevel - 1];
            setBubbles([]);
            setParticles([]);
            setScoreEffects([]);
            setFishEffects([]);
            setCombo(0);
            setBubblesSpawned(0);
            setBubblesRemaining(config.totalBubbles);
            setOxygenLevel(100);
            setMultiplier(1);
            setShowLevelTransition(false);
            setIsPlaying(true);
            setLevelCompleted(false);
        }, 2000);
    }, [currentLevel]);
    
    const popBubble = useCallback((bubble: Bubble) => {
        if (bubble.popped) return;

        setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, popped: true } : b));
        
        playPopSound(bubble.type);

        const newParticles = [];
        for (let i = 0; i < 8; i++) {
            newParticles.push({
                id: Math.random(), x: bubble.x + bubble.size / 2, y: bubble.y + bubble.size / 2,
                size: Math.random() * 2 + 1, color: 'white',
                vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, opacity: 1,
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
        
        if (bubble.type === 'mine') {
            audioManager.current?.falarMila("Ops! Cuidado com a bomba!");
            resetLevel();
            return;
        }

        const finalPoints = Math.round(bubble.points * multiplier);
        setScore(prev => prev + finalPoints);
        setPoppedBubbles(prev => prev + 1);

        setScoreEffects(prev => [...prev, {
            id: bubble.id, points: finalPoints, x: bubble.x, y: bubble.y, opacity: 1,
        }]);

        if (bubble.type === 'fish') {
            setFishEffects(prev => [...prev, {
                id: bubble.id, x: bubble.x, y: bubble.y, opacity: 1,
            }]);
            setSavedFish(prev => prev + 1);
            setOxygenLevel(prev => Math.min(100, prev + 5));
        } else if (bubble.type === 'oxygen') {
            setOxygenLevel(prev => Math.min(100, prev + 10));
        } else {
            setOxygenLevel(prev => Math.min(100, prev + 3));
        }
        
        setCombo(prev => {
            const newCombo = prev + 1;
            setMaxCombo(max => Math.max(max, newCombo));
            if (newCombo >= 15 && newCombo % 5 === 0) {
              const randomPhrase = comboPhrases[Math.floor(Math.random() * comboPhrases.length)];
              audioManager.current?.falarMila(randomPhrase);
            }
            return newCombo;
        });

    }, [multiplier, resetLevel, playPopSound]);

    const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!gameAreaRef.current || !isPlaying) return;
        
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
        
        for (let i = bubbles.length - 1; i >= 0; i--) {
            const bubble = bubbles[i];
            if (bubble.popped) continue;

            const bubbleCenterX = bubble.x + bubble.size / 2;
            const bubbleCenterY = bubble.y + bubble.size / 2;
            const distance = Math.sqrt(Math.pow(x - bubbleCenterX, 2) + Math.pow(y - bubbleCenterY, 2));

            if (distance <= bubble.size / 2) {
                popBubble(bubble);
                break;
            }
        }
    }, [isPlaying, bubbles, popBubble, gameAreaRef]);

    const updateGameElements = useCallback(() => {
        if (!gameAreaRef.current) return;

        setBubbles(prev => 
            prev.map(bubble => {
                if (bubble.popped) {
                    return { ...bubble, opacity: bubble.opacity - 0.05 };
                }
                let newY = bubble.y - bubble.speed;
                if (newY < -bubble.size) {
                    if (bubble.type !== 'mine') {
                        setMissedBubbles(prevMissed => prevMissed + 1);
                        setCombo(0);
                    }
                    return { ...bubble, opacity: 0 };
                }
                return { ...bubble, y: newY };
            }).filter(bubble => bubble.opacity > 0)
        );

        setParticles(prev => prev.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.02,
        })).filter(p => p.opacity > 0));

        setScoreEffects(prev => prev.map(effect => ({
            ...effect,
            y: effect.y - 0.5,
            opacity: effect.opacity - 0.02,
        })).filter(effect => effect.opacity > 0));

        setFishEffects(prev => prev.map(effect => ({
            ...effect,
            x: effect.x + 1,
            opacity: effect.opacity - 0.015,
        })).filter(effect => effect.opacity > 0));

    }, [gameAreaRef]);

    useEffect(() => {
        if (isPlaying) {
            setBubblesRemaining(levelConfigs[currentLevel - 1].totalBubbles - bubblesSpawned);
        }
    }, [isPlaying, bubblesSpawned, currentLevel]);

    useEffect(() => {
        if (!isPlaying) return;
        const gameLoop = () => {
            updateGameElements(); 
            animationRef.current = requestAnimationFrame(gameLoop);
        };
        animationRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, updateGameElements]);

    useEffect(() => {
        if (!isPlaying || levelCompleted) return;
        const config = levelConfigs[currentLevel - 1];
        const spawnInterval = setInterval(() => {
            if (bubblesSpawned < config.totalBubbles) {
                createBubble();
            }
        }, config.spawnRate);
        return () => clearInterval(spawnInterval);
    }, [isPlaying, currentLevel, bubblesSpawned, levelCompleted, createBubble]);

    useEffect(() => {
        if (!isPlaying) return;
        const config = levelConfigs[currentLevel - 1];
        const drainInterval = setInterval(() => {
            setOxygenLevel(prev => {
                const newLevel = Math.max(0, prev - config.oxygenDrain);
                if (newLevel === 0) {
                    endGame();
                }
                return newLevel;
            });
        }, 1000);
        return () => clearInterval(drainInterval);
    }, [isPlaying, currentLevel, endGame]);
    
    useEffect(() => {
        if (isPlaying && !levelCompleted && bubblesSpawned >= levelConfigs[currentLevel - 1].totalBubbles && bubbles.length === 0) {
            setLevelCompleted(true);
            audioManager.current?.falarMila(`Você é fera! Terminou a fase ${currentLevel}!`);
            setShowLevelTransition(true);
            createCelebrationBurst();

            setTimeout(() => {
                const nextLevel = currentLevel + 1;
                if (nextLevel <= levelConfigs.length) {
                    setCurrentLevel(nextLevel);
                    setBubbles([]);
                    setParticles([]);
                    setScoreEffects([]);
                    setFishEffects([]);
                    setCombo(0);
                    setBubblesSpawned(0);
                    setBubblesRemaining(levelConfigs[nextLevel - 1].totalBubbles);
                    setOxygenLevel(100);
                    setLevelCompleted(false);
                    setShowLevelTransition(false);
                } else {
                    endGame();
                }
            }, 3000);
        }
    }, [isPlaying, bubbles, bubblesSpawned, currentLevel, levelCompleted, createCelebrationBurst, endGame]);
    
    const startActivity = useCallback(() => {
        audioManager.current?.forceInitialize();
        
        setIsPlaying(true);
        setShowResults(false);
        setCurrentLevel(1);
        setScore(0);
        setCombo(0);
        setMaxCombo(0);
        setBubbles([]);
        setParticles([]);
        setScoreEffects([]);
        setFishEffects([]);
        setOxygenLevel(100);
        setPoppedBubbles(0);
        setMissedBubbles(0);
        setCompletedLevels([]);
        setBubblesSpawned(0);
        setBubblesRemaining(levelConfigs[0].totalBubbles);
        setSavedFish(0);
        setMultiplier(1);
        setEquipment({ mask: false, fins: false, tank: false, suit: false, light: false });
        setLevelCompleted(false);
        setFreedCreatures([]);
        setBossDefeated(false);
    }, []);

    const voltarInicio = useCallback(() => {
        setIsPlaying(false);
        setShowResults(false);
    }, []);

    const handleSaveSession = useCallback(async () => {
        setSalvando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            await supabase.from('sessoes').insert([{
                usuario_id: user.id,
                atividade_nome: 'Oceano de Bolhas - Aventura Completa',
                pontuacao_final: score,
                data_fim: new Date().toISOString()
            }]);
            router.push('/dashboard');
        } catch (error) {
            console.error("Erro ao salvar sessão:", error);
        } finally {
            setSalvando(false);
        }
    }, [score, router, supabase]);

    return {
        isPlaying, score, combo, oxygenLevel, bubbles, particles,
        scoreEffects, fishEffects,
        currentLevel,
        levelMessage, showLevelTransition, equipment, savedFish, bubblesRemaining,
        multiplier, showResults, maxCombo,
        completedLevels, salvando, accuracy,
        startActivity,
        handleInteraction,
        handleSaveSession,
        voltarInicio,
        audioEnabled,
        toggleAudio,
        levelConfigs,
        bossDefeated, // Retornar esses estados também
        freedCreatures,
    };
}
