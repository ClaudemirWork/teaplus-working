// app/bubble-pop/hooks/useBubblePopGame.ts
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'; // <-- CORREÇÃO AQUI
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabaseClient';
import { GameAudioManager } from '@/utils/gameAudioManager';
import { Bubble, Particle } from '@/app/types/bubble-pop';

export function useBubblePopGame(gameAreaRef: React.RefObject<HTMLDivElement>) {
    const router = useRouter();
    const supabase = createClient();
    const animationRef = useRef<number>();
    const audioManager = useRef<GameAudioManager | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
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
    const [showLevelTransition, setShowLevelTransition] = useState(false);
    const [levelMessage, setLevelMessage] = useState('');
    const [completedLevels, setCompletedLevels] = useState<number[]>([]);
    const [bubblesRemaining, setBubblesRemaining] = useState(0);
    const [bubblesSpawned, setBubblesSpawned] = useState(0);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [jogoIniciado, setJogoIniciado] = useState(false);


    const levelConfigs = [
        { level: 1, name: 'Superfície (0-10m)', depth: '0-10m', totalBubbles: 200, minePercentage: 0.05, spawnRate: 400, oxygenDrain: 0.3, bgGradient: 'from-cyan-300 to-blue-400' },
        { level: 2, name: 'Águas Rasas (10-30m)', depth: '10-30m', totalBubbles: 150, minePercentage: 0.15, spawnRate: 450, oxygenDrain: 0.5, bgGradient: 'from-blue-400 to-blue-500' },
        { level: 3, name: 'Zona Média (30-60m)', depth: '30-60m', totalBubbles: 100, minePercentage: 0.30, spawnRate: 500, oxygenDrain: 0.7, bgGradient: 'from-blue-500 to-blue-700' },
        { level: 4, name: 'Águas Fundas (60-100m)', depth: '60-100m', totalBubbles: 60, minePercentage: 0.45, spawnRate: 550, oxygenDrain: 0.9, bgGradient: 'from-blue-700 to-indigo-900' },
        { level: 5, name: 'Zona Abissal (100m+)', depth: '100m+', totalBubbles: 40, minePercentage: 0.60, spawnRate: 600, oxygenDrain: 1.1, bgGradient: 'from-indigo-900 to-black' }
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
                const freqMap: { [key: string]: number } = { air: 600, oxygen: 700, pink: 800, purple: 900, yellow: 1000, green: 1100, orange: 1200 };
                oscillator.frequency.value = freqMap[type as keyof typeof freqMap] || 600;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.05);
            }
        } catch (e) { console.error("Web Audio API error:", e); }
    }, [audioEnabled]);
    
    const createParticles = useCallback((x: number, y: number, color: string, isExplosion: boolean = false) => {
        const newParticles: Particle[] = [];
        const particleCount = isExplosion ? 20 : 10;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = isExplosion ? Math.random() * 5 + 3 : Math.random() * 3 + 2;
            newParticles.push({
                id: Date.now() + i, x, y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color: isExplosion ? '#FF4500' : color, life: 1,
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
    }, []);

    const popBubble = useCallback((bubble: Bubble, x: number, y: number) => {
        if (bubble.popped) return;

        setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, popped: true } : b));
        playPopSound(bubble.type);

        if (bubble.type === 'mine') {
            createParticles(x, y, bubble.color, true);
            setScore(prev => Math.max(0, prev + bubble.points));
            setCombo(0);
            setOxygenLevel(prev => Math.max(0, prev - 10));
        } else {
            createParticles(x, y, bubble.color);
            setPoppedBubbles(prev => prev + 1);
            
            const newCombo = combo + 1;
            setCombo(newCombo);
            setMaxCombo(max => Math.max(max, newCombo));

            const comboMultiplier = 1 + (combo * 0.1);
            const finalPoints = Math.round(bubble.points * comboMultiplier);
            setScore(prev => prev + finalPoints);

            if (bubble.type === 'oxygen') setOxygenLevel(prev => Math.min(100, prev + 10));
            else if (bubble.type === 'pearl') setOxygenLevel(prev => Math.min(100, prev + 20));
            else setOxygenLevel(prev => Math.min(100, prev + 3));
        }
    }, [combo, createParticles, playPopSound]);

    const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!gameAreaRef.current || !isPlaying) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        bubbles.forEach(bubble => {
            if (bubble.popped) return;
            const bubbleCenterX = bubble.x + bubble.size / 2;
            const bubbleCenterY = bubble.y + bubble.size / 2;
            const distance = Math.sqrt(Math.pow(x - bubbleCenterX, 2) + Math.pow(y - bubbleCenterY, 2));
            if (distance <= bubble.size / 2) {
                popBubble(bubble, x, y);
            }
        });
    }, [isPlaying, bubbles, popBubble, gameAreaRef]);

    const { endGame, startActivity, voltarInicio, handleSaveSession } = useMemo(() => {
        const endGame = () => {
            setIsPlaying(false);
            setShowResults(true);
            if (currentLevel === 5 && bubblesSpawned >= levelConfigs[4].totalBubbles) {
                setCompletedLevels(prev => [...prev, currentLevel]);
            }
            const totalAttempts = poppedBubbles + missedBubbles;
            const acc = totalAttempts > 0 ? Math.round((poppedBubbles / totalAttempts) * 100) : 0;
            setAccuracy(acc);
        };

        const startActivity = () => {
            audioManager.current?.forceInitialize();
            setJogoIniciado(true);
            setIsPlaying(true);
            setCurrentLevel(1);
            setScore(0);
            setCombo(0);
            setMaxCombo(0);
            setBubbles([]);
            setParticles([]);
            setOxygenLevel(100);
            setShowResults(false);
            setPoppedBubbles(0);
            setMissedBubbles(0);
            setCompletedLevels([]);
            setBubblesSpawned(0);
            setBubblesRemaining(levelConfigs[0].totalBubbles);
        };
        
        const voltarInicio = () => {
            setJogoIniciado(false);
            setShowResults(false);
            setIsPlaying(false);
        };

        const handleSaveSession = async () => {
            setSalvando(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }
                await supabase.from('sessoes').insert([{
                    usuario_id: user.id,
                    atividade_nome: 'Oceano de Bolhas',
                    pontuacao_final: score,
                    data_fim: new Date().toISOString()
                }]);
                router.push('/dashboard');
            } catch (error) {
                console.error("Erro ao salvar sessão:", error);
            } finally {
                setSalvando(false);
            }
        };

        return { endGame, startActivity, voltarInicio, handleSaveSession };
    }, [currentLevel, bubblesSpawned, poppedBubbles, missedBubbles, supabase, router, score, accuracy, maxCombo, completedLevels]);
    
    const createBubble = useCallback(() => {
        // ... (lógica do createBubble, que não usa o endGame)
    }, [isPlaying, currentLevel, bubblesSpawned, gameAreaRef]);
    
    useEffect(() => {
        if (!isPlaying) return;

        const config = levelConfigs[currentLevel - 1];

        if (bubblesSpawned >= config.totalBubbles && bubbles.length === 0) {
            if (currentLevel < 5) {
                setCompletedLevels(prev => [...prev, currentLevel]);
                setLevelMessage(`🌊 Profundidade ${config.depth} Completa!`);
                setShowLevelTransition(true);

                setTimeout(() => {
                    const nextLevel = currentLevel + 1;
                    const nextConfig = levelConfigs[nextLevel - 1];
                    setCurrentLevel(nextLevel);
                    setShowLevelTransition(false);
                    setBubbles([]);
                    setParticles([]);
                    setCombo(0);
                    setBubblesSpawned(0);
                    setBubblesRemaining(nextConfig.totalBubbles);
                    setOxygenLevel(100);
                }, 2500);
            } else {
                endGame();
            }
        }
    }, [isPlaying, currentLevel, bubblesSpawned, bubbles, endGame]);

    // ... (restante dos useEffects)
    const toggleAudio = useCallback(() => {
        if (audioManager.current) {
            const newState = audioManager.current.toggleAudio();
            setAudioEnabled(newState);
            if (newState) {
                audioManager.current.falarMila("Áudio ligado!");
            }
        }
    }, []);

    return {
        isPlaying, score, combo, oxygenLevel, bubbles, particles, currentLevel,
        showResults, salvando, poppedBubbles, bubblesRemaining, accuracy, maxCombo,
        showLevelTransition, levelMessage, levelConfigs, completedLevels,
        startActivity, handleInteraction, handleSaveSession, voltarInicio,
        toggleAudio, audioEnabled, jogoIniciado
    };
}
