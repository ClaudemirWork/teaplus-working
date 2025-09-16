// app/bubble-pop/hooks/useBubblePopGame.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabaseClient';
import { GameAudioManager } from '@/utils/gameAudioManager';
import { Bubble, Particle, Equipment, ScoreEffect, FishEffect } from '@/app/types/bubble-pop';
import dynamic from 'next/dynamic';

const confetti = dynamic(() => import('canvas-confetti'), { ssr: false });

// ==========================================================
// LISTA DE PEIXES ADICIONADA
// ==========================================================
const FISH_TYPES = [
    { name: 'Baiacu', emoji: '🐡' },
    { name: 'Polvo', emoji: '🐙' },
    { name: 'Peixe-palhaço', emoji: '🐠' },
    { name: 'Tartaruga', emoji: '🐢' },
    { name: 'Cavalo-marinho', emoji: '🐴' }
];

const levelConfigs = [
    // ... (levelConfigs permanece o mesmo)
];
const coloredBubbles = {
    // ... (coloredBubbles permanece o mesmo)
};
// ==========================================================
// PRONÚNCIA CORRIGIDA
// ==========================================================
const comboPhrases = ["Uruuuul!", "Incrível!", "Mandou bem!", "Continue assim!", "Que demais!"];


export function useBubblePopGame(gameAreaRef: React.RefObject<HTMLDivElement>) {
    // ... (declarações de estado e refs permanecem as mesmas) ...
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
    const [freedCreatures, setFreedCreatures] = useState<string[]>([]);
    const [bossDefeated, setBossDefeated] = useState(false);


    useEffect(() => {
        if (!audioManager.current) {
            audioManager.current = GameAudioManager.getInstance();
        }
    }, []);
    
    // ... (playPopSound e outras funções permanecem as mesmas até createBubble)
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
                    yellow: 1000, green: 1100, orange: 1200, fish: 850
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
        let fishType = null;

        if (rand < config.minePercentage) {
            type = 'mine';
            bubbleConfig = { color: '#8B0000', points: -20, size: 45 };
        } else {
            const featureRand = Math.random();
            if (config.features.includes('fish_rescue') && featureRand < 0.15) {
                type = 'fish';
                bubbleConfig = { color: '#87CEEB', points: 50, size: 55 };
                // ==========================================================
                // LÓGICA DE SORTEIO DO PEIXE
                // ==========================================================
                fishType = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
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
            fishType: fishType // Adiciona o tipo de peixe à bolha
        };

        setBubbles(prev => [...prev, newBubble]);
        setBubblesSpawned(prev => prev + 1);
    }, [isPlaying, levelCompleted, currentLevel, bubblesSpawned, gameAreaRef]);

    const popBubble = useCallback((bubble: Bubble) => {
        if (bubble.popped) return;

        setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, popped: true } : b));
        
        playPopSound(bubble.type);

        // ... (lógica de partículas permanece a mesma) ...
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

        if (bubble.type === 'fish' && bubble.fishType) {
            // ==========================================================
            // FALA PERSONALIZADA DO PEIXE
            // ==========================================================
            audioManager.current?.falarMila(`Você salvou um ${bubble.fishType.name}!`);

            setFishEffects(prev => [...prev, {
                id: bubble.id, x: bubble.x, y: bubble.y, opacity: 1, emoji: bubble.fishType.emoji
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

    useEffect(() => {
        if (isPlaying && !levelCompleted && bubblesSpawned >= levelConfigs[currentLevel - 1].totalBubbles && bubbles.length === 0) {
            setLevelCompleted(true);
            const completedConfig = levelConfigs[currentLevel - 1];
            
            // Adiciona o nível aos completados
            setCompletedLevels(prev => [...prev, completedConfig.level]);

            // ==========================================================
            // LÓGICA PARA ATIVAR EQUIPAMENTO
            // ==========================================================
            if (completedConfig.equipment) {
                setEquipment(prev => ({ ...prev, [completedConfig.equipment]: true }));
                audioManager.current?.falarMila(`Equipamento novo! Você encontrou nadadeiras!`); // Exemplo
            }

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

    // ... (O resto do hook: startActivity, voltarInicio, etc., não precisa de mais alterações) ...
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

    // ... restante do hook sem alterações
    // ...

    return {
        // ... (retorno permanece o mesmo)
    };
}
