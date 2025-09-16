// app/bubble-pop/hooks/useBubblePopGame.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabaseClient';
import { GameAudioManager } from '@/utils/gameAudioManager';
import { Bubble, Particle, Equipment } from '@/app/types/bubble-pop';
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
    air: { color: '#E0F2FE', points: 5, size: 40 }, oxygen: { color: '#60A5FA', points: 15, size: 55 },
    pink: { color: '#F9A8D4', points: 20, size: 45 }, purple: { color: '#C084FC', points: 25, size: 45 },
    yellow: { color: '#FDE047', points: 30, size: 45 }, green: { color: '#86EFAC', points: 35, size: 45 },
    orange: { color: '#FB923C', points: 40, size: 45 }, treasure: { color: '#FFD700', points: 50, size: 50 },
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
    // ... (restante dos estados)
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [particles, setParticles] = useState<Particle[]>([]);
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
    const [multiplierTime, setMultiplierTime] = useState(0);
    const [magnetActive, setMagnetActive] = useState(false);
    const [magnetTime, setMagnetTime] = useState(0);
    const [bossDefeated, setBossDefeated] = useState(false);
    const [freedCreatures, setFreedCreatures] = useState<string[]>([]);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioManager.current = GameAudioManager.getInstance();
        }
    }, []);

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
        if (typeof confetti !== 'function') return;
        try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (e) { console.error('Erro ao criar confetti:', e); }
    }, []);

    const resetLevel = useCallback(() => {
        // Lógica de reset
    }, [currentLevel]);
    
    // ... (Todas as outras funções de lógica: popBubble, createBubble, etc., movidas para cá)

    // Lembre-se de retornar todos os estados e funções que a UI precisa
    return {
        isPlaying, score, combo, oxygenLevel, bubbles, particles, currentLevel,
        levelMessage, showLevelTransition, equipment, savedFish, bubblesRemaining,
        multiplier, multiplierTime, magnetActive, magnetTime, showResults, maxCombo,
        completedLevels, bossDefeated, freedCreatures, salvando, accuracy,
        //...
        audioEnabled,
        toggleAudio,
    };
}
