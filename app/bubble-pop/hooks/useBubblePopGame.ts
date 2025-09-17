'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

    const [unlockedGear] = useState<Array<{level: number, item: string, icon: string}>>([]);
    const [activeGearItems] = useState<Array<{x: number, y: number, icon: string}>>([]);
    const [fishCollection] = useState<Array<{id: number, name: string, type: string}>>([]);

    const levelConfigs = useMemo(() => [
        { level: 1, name: 'Superfície (0-10m)', depth: '0-10m', totalBubbles: 80, minePercentage: 0.05, spawnRate: 950, oxygenDrain: 0.12, bgGradient: 'from-cyan-300 to-blue-400' },
        { level: 2, name: 'Águas Rasas (10-30m)', depth: '10-30m', totalBubbles: 60, minePercentage: 0.12, spawnRate: 1000, oxygenDrain: 0.195, bgGradient: 'from-blue-400 to-blue-500' },
        { level: 3, name: 'Zona Média (30-60m)', depth: '30-60m', totalBubbles: 36, minePercentage: 0.18, spawnRate: 1050, oxygenDrain: 0.28, bgGradient: 'from-blue-500 to-blue-700' },
        { level: 4, name: 'Águas Fundas (60-100m)', depth: '60-100m', totalBubbles: 20, minePercentage: 0.25, spawnRate: 1050, oxygenDrain: 0.33, bgGradient: 'from-blue-700 to-indigo-900' },
        { level: 5, name: 'Zona Abissal (100m+)', depth: '100m+', totalBubbles: 11, minePercentage: 0.4, spawnRate: 1100, oxygenDrain: 0.45, bgGradient: 'from-indigo-900 to-black' }
    ], []);

    const coloredBubbles = useMemo(() => ({
        air: { color: '#E0F2FE', points: 5, size: 40, speed: 1.15 },
        oxygen: { color: '#60A5FA', points: 15, size: 55, speed: 1.1 },
        pink: { color: '#F9A8D4', points: 20, size: 45, speed: 1.15 },
        purple: { color: '#C084FC', points: 25, size: 45, speed: 1.05 },
        yellow: { color: '#FDE047', points: 30, size: 45, speed: 1.04 },
        green: { color: '#86EFAC', points: 35, size: 45, speed: 1 },
        orange: { color: '#FB923C', points: 40, size: 45, speed: 1.18 },
        treasure: { color: '#FFD700', points: 50, size: 50, speed: 1 },
        pearl: { color: '#FFF0F5', points: 100, size: 40, speed: 1 }
    }), []);

    // --- AUDIO ---
    useEffect(() => {
        if (!audioManager.current) {
            audioManager.current = GameAudioManager.getInstance();
        }
    }, []);

    const playPopSound = useCallback(() => {
        if (!audioEnabled) return;
        try {
            GameAudioManager.getInstance().playSoundEffect("pop", 0.8);
        } catch {}
    }, [audioEnabled]);

    // --- PARTICLES ---
    const createParticles = useCallback((x: number, y: number, color: string, isExplosion: boolean = false) => {
        const newParticles: Particle[] = [];
        const particleCount = isExplosion ? 12 : 6;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = isExplosion ? Math.random() * 4 + 1.5 : Math.random() * 2 + 0.7;
            newParticles.push({
                id: Date.now() + i, x, y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color: isExplosion ? '#FF4500' : color, life: 1,
            });
        }
        setParticles(prev => [...prev, ...newParticles]);
    }, []);

    // --- POP ---
    const popBubble = useCallback((bubble: Bubble, x: number, y: number) => {
        setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, popped: true } : b));
        playPopSound();
        createParticles(x, y, bubble.color, bubble.type === 'mine');
        setPoppedBubbles(prev => prev + 1);
        setScore(prev => prev + bubble.points);
        if (bubble.type === 'mine') {
            setOxygenLevel(prev => Math.max(0, prev - 10));
            setCombo(0);
        } else {
            setCombo(c => {
                const nc = c + 1;
                setMaxCombo(mc => Math.max(mc, nc));
                return nc;
            });
            setOxygenLevel(prev => {
                if (bubble.type === 'oxygen') return Math.min(100, prev + 12);
                if (bubble.type === 'pearl') return Math.min(100, prev + 25);
                return Math.min(100, prev + 2);
            });
        }
    }, [playPopSound, createParticles]);

    // --- CLICK HANDLER ---
    const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!gameAreaRef.current || !isPlaying) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
        for (const bubble of bubbles) {
            if (bubble.popped) continue;
            const bubbleCenterX = bubble.x + bubble.size / 2;
            const bubbleCenterY = bubble.y + bubble.size / 2;
            const distance = Math.sqrt(Math.pow(x - bubbleCenterX, 2) + Math.pow(y - bubbleCenterY, 2));
            if (distance <= bubble.size / 2) {
                popBubble(bubble, x, y);
                break;
            }
        }
    }, [isPlaying, bubbles, popBubble, gameAreaRef]);

    // ----------- SPAWN LOOP -----------
    useEffect(() => {
        if (!isPlaying) return;
        const config = levelConfigs[currentLevel - 1];

        let spawnInterval: NodeJS.Timeout | null = null;

        function spawnBubble() {
            if (!gameAreaRef.current) return;
            if (bubblesSpawned >= config.totalBubbles) return;
            const gameArea = gameAreaRef.current.getBoundingClientRect();
            let type: Bubble['type'] = 'air';
            let bubbleConf = coloredBubbles.air;
            let horizontalMovement = 0;
            if (Math.random() < config.minePercentage) {
                type = 'mine';
                bubbleConf = { color: '#8B0000', points: -20, size: 45, speed: 1.1 };
            } else {
                const v = Math.random();
                if (currentLevel === 1) {
                    if (v < 0.5) type = 'air';
                    else if (v < 0.7) type = 'oxygen';
                    else if (v < 0.83) type = 'pink';
                    else if (v < 0.93) type = 'purple';
                    else type = 'treasure';
                } else if (currentLevel === 2) {
                    if (v < 0.33) type = 'air';
                    else if (v < 0.5) type = 'oxygen';
                    else if (v < 0.68) type = 'pink';
                    else if (v < 0.78) type = 'purple';
                    else if (v < 0.88) type = 'yellow';
                    else if (v < 0.95) type = 'green';
                    else type = 'treasure';
                } else {
                    type = 'green';
                }
                bubbleConf = coloredBubbles[type as keyof typeof coloredBubbles] || coloredBubbles.air;
                if (type === 'pearl' || type === 'treasure') horizontalMovement = (Math.random() - 0.5) * 2.5;
            }
            const newBubble: Bubble = {
                id: Date.now() + Math.random(),
                x: Math.random() * ((gameArea.width ?? 310) - bubbleConf.size),
                y: (gameArea.height ?? 500) + bubbleConf.size,
                size: bubbleConf.size + (Math.random() * 10 - 5),
                speed: bubbleConf.speed,
                color: bubbleConf.color,
                points: bubbleConf.points,
                type: type,
                popped: false,
                opacity: 1,
                horizontalMovement
            };
            setBubbles(prev => [...prev, newBubble]);
            setBubblesSpawned(prev => prev + 1);
            setBubblesRemaining(prev => prev - 1);
        }

        spawnInterval = setInterval(() => {
            if (bubblesSpawned < config.totalBubbles) {
                spawnBubble();
            }
        }, config.spawnRate);

        return () => { if (spawnInterval) clearInterval(spawnInterval); };
    }, [isPlaying, currentLevel, bubblesSpawned, levelConfigs, coloredBubbles, gameAreaRef]);

    // -------- MOVIMENTO GLOBAL -----------
    useEffect(() => {
        if (!isPlaying) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            return;
        }
        const updateBubbles = () => {
            if (!gameAreaRef.current) return;
            const gameArea = gameAreaRef.current.getBoundingClientRect();
            setBubbles(prev => prev.map(bubble => {
                if (bubble.popped) {
                    return { ...bubble, opacity: Math.max(0, bubble.opacity - 0.2) };
                }
                let newY = bubble.y - (bubble.speed || 1);
                let newX = bubble.x;
                if (bubble.horizontalMovement) {
                    newX += bubble.horizontalMovement;
                }
                if (newY < -bubble.size) {
                    if (!bubble.popped && bubble.type !== 'mine') {
                        setMissedBubbles(v => v + 1);
                        setCombo(0);
                        setOxygenLevel(v => Math.max(0, v - 8));
                    }
                    return { ...bubble, opacity: 0 };
                }
                return { ...bubble, y: newY, x: newX };
            }).filter(bubble => bubble.opacity > 0));
        };
        const updateParticles = () => {
            setParticles(prev => prev.map(p => ({
                ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.2, life: p.life - 0.05
            })).filter(p => p.life > 0));
        };
        const gameLoop = () => {
            updateBubbles();
            updateParticles();
            animationRef.current = requestAnimationFrame(gameLoop);
        };
        animationRef.current = requestAnimationFrame(gameLoop);
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [isPlaying, gameAreaRef]);

    // -------- OXIGÊNIO -----------
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
        }, 900);
        return () => clearInterval(drainInterval);
    }, [isPlaying, currentLevel, levelConfigs]);

    // -------- RESOLVE FIM DE FASE / INÍCIO DE NOVO NÍVEL -----------
    useEffect(() => {
        if (!isPlaying) return;
        const config = levelConfigs[currentLevel - 1];
        if (bubblesSpawned >= config.totalBubbles && bubbles.length === 0) {
            if (currentLevel < 5) {
                setCompletedLevels(prev => [...prev, currentLevel]);
                setLevelMessage(`🌊 Profundidade ${config.depth} Completa!`);
                setShowLevelTransition(true);
                setTimeout(() => {
                    setCurrentLevel(prev => prev + 1);
                    setShowLevelTransition(false);
                    setBubbles([]);
                    setParticles([]);
                    setCombo(0);
                    setBubblesSpawned(0);
                    setBubblesRemaining(levelConfigs[currentLevel]?.totalBubbles || 0);
                    setOxygenLevel(100);
                }, 2200);
            } else {
                endGame();
            }
        }
    }, [isPlaying, bubbles, currentLevel, bubblesSpawned, levelConfigs]);

    // -------- FIM DE JOGO --------
    const endGame = useCallback(() => {
        setIsPlaying(false);
        setShowResults(true);
        const totalAttempts = poppedBubbles + missedBubbles;
        setAccuracy(totalAttempts > 0 ? Math.round((poppedBubbles / totalAttempts) * 100) : 0);
    }, [poppedBubbles, missedBubbles]);

    // --------- INICIALIZAÇÃO/RESET DE JOGO ----------
    const startActivity = useCallback(() => {
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
    }, [levelConfigs]);

    const voltarInicio = useCallback(() => {
        setJogoIniciado(false);
        setShowResults(false);
        setIsPlaying(false);
    }, []);

    // --------- SALVA SESSÃO (opcional) --------------
    const handleSaveSession = useCallback(async () => {
        setSalvando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/login'); return; }
            await supabase.from('sessoes').insert([{
                usuario_id: user.id,
                atividade_nome: 'Oceano de Bolhas',
                pontuacao_final: score,
                data_fim: new Date().toISOString()
            }]);
            router.push('/dashboard');
        } catch (error) { console.error("Erro ao salvar sessão:", error); }
        finally { setSalvando(false); }
    }, [supabase, router, score]);

    const toggleAudio = useCallback(() => {
        if (audioManager.current) {
            const newState = audioManager.current.toggleAudio();
            setAudioEnabled(newState);
        }
    }, []);

    return {
        isPlaying, score, combo, oxygenLevel, bubbles, particles, currentLevel,
        showResults, salvando, poppedBubbles, bubblesRemaining, accuracy, maxCombo,
        showLevelTransition, levelMessage, levelConfigs, completedLevels,
        unlockedGear, fishCollection, activeGearItems,
        startActivity, handleInteraction, handleSaveSession, voltarInicio,
        toggleAudio, audioEnabled, jogoIniciado
    };
}
