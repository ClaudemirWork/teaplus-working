// app/bubble-pop/hooks/useBubblePopGame.ts
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

    // Estados existentes
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

    // Estados para funcionalidades adicionais
    const [fishCollection, setFishCollection] = useState<{id: number, name: string, type: string}[]>([]);
    const [namingFish, setNamingFish] = useState<{id: number, type: string} | null>(null);
    const [unlockedGear, setUnlockedGear] = useState<{level: number, item: string, icon: string}[]>([]);
    const [activeGearItems, setActiveGearItems] = useState<{level: number, item: string, icon: string, x: number, y: number}[]>([]);

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
        pearl: { color: '#FFF0F5', points: 100, size: 40 },
        // Peixes especiais
        pufferfish: { color: '#FF6B6B', points: 75, size: 50 },
        starfish: { color: '#FFD93D', points: 80, size: 45 },
        octopus: { color: '#6BCF7F', points: 90, size: 55 }
    };

    const divingGear = [
        { level: 1, item: 'Máscara Básica', icon: '🤿' },
        { level: 2, item: 'Nadadeiras Simples', icon: '🐟' },
        { level: 3, item: 'Óculos de Mergulho', icon: '👓' },
        { level: 4, item: 'Cilindro de Oxigênio', icon: '⛽' },
        { level: 5, item: 'Traje Completo', icon: '🤿‍♂️' }
    ];

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
                    air: 600, oxygen: 700, pink: 800, purple: 900, yellow: 1000, 
                    green: 1100, orange: 1200, pufferfish: 500, starfish: 700, octopus: 400 
                };
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

    const nameFish = useCallback((fishId: number, name: string) => {
        const fish = namingFish;
        if (fish) {
            setFishCollection(prev => [...prev, {id: fishId, name, type: fish.type}]);
            setNamingFish(null);
            
            if (audioManager.current && audioEnabled) {
                const message = `Você nomeou sua ${fish.type === 'pearl' ? 'pérola' : fish.type === 'treasure' ? 'tesouro' : 'descoberta'} como ${name}`;
                audioManager.current.falarMila(message);
            }
        }
    }, [namingFish, audioEnabled]);

    const collectGear = useCallback((gearLevel: number) => {
        setActiveGearItems(prev => prev.filter(item => item.level !== gearLevel));
        
        const gear = divingGear.find(g => g.level === gearLevel);
        if (gear && audioManager.current && audioEnabled) {
            audioManager.current.falarMila(`Você equipou ${gear.item}! Agora está mais preparado para as profundezas!`);
        }
    }, [audioEnabled]);

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
            else if (bubble.type === 'pearl') {
                setOxygenLevel(prev => Math.min(100, prev + 20));
                if (audioManager.current && audioEnabled) {
                    audioManager.current.falarMila("Oba! Você ganhou uma pérola!");
                }
            }
            else setOxygenLevel(prev => Math.min(100, prev + 3));
            
            // Voz para peixes especiais
            if (bubble.type === 'pufferfish' && audioManager.current && audioEnabled) {
                audioManager.current.falarMila("Um baiacu! Cuidado com os espinhos!");
            } else if (bubble.type === 'starfish' && audioManager.current && audioEnabled) {
                audioManager.current.falarMila("Uma estrela do mar! Que bela descoberta!");
            } else if (bubble.type === 'octopus' && audioManager.current && audioEnabled) {
                audioManager.current.falarMila("Um polvo! Que criatura inteligente!");
            }
            
            // Acionar nomeação para bolhas especiais
            if (bubble.type === 'pearl' || bubble.type === 'treasure') {
                setNamingFish({id: bubble.id, type: bubble.type});
            }
        }
    }, [combo, createParticles, playPopSound, audioEnabled]);

    const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!gameAreaRef.current || !isPlaying) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        // Verificar clique em itens de mergulho
        activeGearItems.forEach(gear => {
            const distance = Math.sqrt(Math.pow(x - gear.x, 2) + Math.pow(y - gear.y, 2));
            if (distance <= 30) {
                collectGear(gear.level);
                return;
            }
        });

        // Verificar clique em bolhas
        bubbles.forEach(bubble => {
            if (bubble.popped) return;
            const bubbleCenterX = bubble.x + bubble.size / 2;
            const bubbleCenterY = bubble.y + bubble.size / 2;
            const distance = Math.sqrt(Math.pow(x - bubbleCenterX, 2) + Math.pow(y - bubbleCenterY, 2));
            if (distance <= bubble.size / 2) {
                popBubble(bubble, x, y);
            }
        });
    }, [isPlaying, bubbles, popBubble, gameAreaRef, activeGearItems, collectGear]);

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
            setFishCollection([]);
            setNamingFish(null);
            setUnlockedGear([]);
            setActiveGearItems([]);
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
        if (!isPlaying || !gameAreaRef.current) return;

        const config = levelConfigs[currentLevel - 1];

        if (bubblesSpawned >= config.totalBubbles) return;

        const gameArea = gameAreaRef.current.getBoundingClientRect();
        const rand = Math.random();
        let type: Bubble['type'] = 'air';
        let bubbleConfig = coloredBubbles.air;
        let horizontalMovement = 0;

        if (rand < config.minePercentage) {
            type = 'mine';
            bubbleConfig = { color: '#8B0000', points: -20, size: 45 };
        } else {
            const colorRand = Math.random();

            if (currentLevel === 1) {
                if (colorRand < 0.4) type = 'air';
                else if (colorRand < 0.6) type = 'oxygen';
                else if (colorRand < 0.75) type = 'pink';
                else if (colorRand < 0.85) type = 'purple';
                else if (colorRand < 0.92) type = 'treasure';
                else if (colorRand < 0.96) type = 'pufferfish';
                else type = 'starfish';
            } else if (currentLevel === 2) {
                if (colorRand < 0.3) type = 'air';
                else if (colorRand < 0.5) type = 'oxygen';
                else if (colorRand < 0.65) type = 'pink';
                else if (colorRand < 0.75) type = 'purple';
                else if (colorRand < 0.82) type = 'yellow';
                else if (colorRand < 0.88) type = 'green';
                else if (colorRand < 0.93) type = 'treasure';
                else if (colorRand < 0.96) type = 'pufferfish';
                else type = 'octopus';
            } else if (currentLevel === 3) {
                if (colorRand < 0.2) type = 'air';
                else if (colorRand < 0.35) type = 'oxygen';
                else if (colorRand < 0.5) type = 'pink';
                else if (colorRand < 0.6) type = 'purple';
                else if (colorRand < 0.7) type = 'yellow';
                else if (colorRand < 0.8) type = 'green';
                else if (colorRand < 0.87) type = 'orange';
                else if (colorRand < 0.92) type = 'treasure';
                else if (colorRand < 0.95) type = 'pufferfish';
                else if (colorRand < 0.97) type = 'starfish';
                else type = 'pearl';
            } else {
                if (colorRand < 0.15) type = 'air';
                else if (colorRand < 0.25) type = 'oxygen';
                else if (colorRand < 0.4) type = 'purple';
                else if (colorRand < 0.55) type = 'yellow';
                else if (colorRand < 0.7) type = 'green';
                else if (colorRand < 0.8) type = 'orange';
                else if (colorRand < 0.88) type = 'treasure';
                else if (colorRand < 0.92) type = 'pufferfish';
                else if (colorRand < 0.95) type = 'starfish';
                else if (colorRand < 0.97) type = 'octopus';
                else type = 'pearl';
            }

            bubbleConfig = coloredBubbles[type as keyof typeof coloredBubbles];

            if (type === 'pearl' || type === 'treasure' || type === 'pufferfish' || type === 'starfish' || type === 'octopus') {
                horizontalMovement = (Math.random() - 0.5) * 1.5;
            }
        }

        const newBubble: Bubble = {
            id: Date.now() + Math.random(),
            x: Math.random() * (gameArea.width - bubbleConfig.size),
            y: gameArea.height + bubbleConfig.size,
            size: bubbleConfig.size + (Math.random() * 10 - 5),
            speed: 2,
            color: bubbleConfig.color,
            points: bubbleConfig.points,
            type: type,
            popped: false,
            opacity: 1,
            horizontalMovement: horizontalMovement
        };

        setBubbles(prev => [...prev, newBubble]);
        setBubblesSpawned(prev => prev + 1);
        setBubblesRemaining(prev => prev - 1);
    }, [isPlaying, currentLevel, bubblesSpawned, gameAreaRef]);
    
    useEffect(() => {
        if (!isPlaying) return;

        const config = levelConfigs[currentLevel - 1];

        if (bubblesSpawned >= config.totalBubbles && bubbles.length === 0) {
            if (currentLevel < 5) {
                setCompletedLevels(prev => [...prev, currentLevel]);
                setLevelMessage(`🌊 Profundidade ${config.depth} Completa!`);
                setShowLevelTransition(true);

                // Desbloquear equipamento
                const newGear = divingGear.find(gear => gear.level === currentLevel);
                if (newGear && !unlockedGear.some(g => g.level === currentLevel)) {
                    setUnlockedGear(prev => [...prev, newGear]);
                    
                    // Adicionar item ativo na tela
                    if (gameAreaRef.current) {
                        const gameArea = gameAreaRef.current.getBoundingClientRect();
                        const x = Math.random() * (gameArea.width - 100) + 50;
                        const y = Math.random() * (gameArea.height - 100) + 50;
                        setActiveGearItems(prev => [...prev, {...newGear, x, y}]);
                    }
                    
                    if (audioManager.current && audioEnabled) {
                        const message = `Parabéns! Você desbloqueou ${newGear.item}. Clique nele para equipar!`;
                        audioManager.current.falarMila(message);
                    }
                }

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
    }, [isPlaying, currentLevel, bubblesSpawned, bubbles, endGame, unlockedGear, audioEnabled, gameAreaRef]);

    useEffect(() => {
        if (!isPlaying) return;

        const gameLoop = () => {
            setBubbles(prev => prev.map(bubble => {
                if (bubble.popped) {
                    return { ...bubble, opacity: bubble.opacity - 0.05 };
                }

                let newY = bubble.y - bubble.speed;
                let newX = bubble.x;

                if (bubble.horizontalMovement) {
                    newX += bubble.horizontalMovement;
                    if (!gameAreaRef.current) return bubble;
                    const gameArea = gameAreaRef.current.getBoundingClientRect();
                    if (newX <= 0 || newX >= gameArea.width - bubble.size) {
                        bubble.horizontalMovement = -bubble.horizontalMovement;
                        newX = Math.max(0, Math.min(gameArea.width - bubble.size, newX));
                    }
                }

                if (newY < -bubble.size) {
                    if (!bubble.popped && bubble.type !== 'mine') {
                        setMissedBubbles(prev => prev + 1);
                        setCombo(0);
                        setOxygenLevel(prev => Math.max(0, prev - 1));
                    }
                    return { ...bubble, y: newY, opacity: 0 };
                }

                return { ...bubble, y: newY, x: newX };
            }).filter(bubble => bubble.opacity > 0));

            setParticles(prev => prev.map(particle => ({
                ...particle,
                x: particle.x + particle.vx,
                y: particle.y + particle.vy,
                vy: particle.vy + 0.2,
                life: particle.life - 0.03
            })).filter(particle => particle.life > 0));

            animationRef.current = requestAnimationFrame(gameLoop);
        };

        animationRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying) return;

        const config = levelConfigs[currentLevel - 1];
        const spawnInterval = setInterval(() => {
            if (bubblesSpawned < config.totalBubbles) {
                createBubble();
            }
        }, config.spawnRate);

        return () => clearInterval(spawnInterval);
    }, [isPlaying, currentLevel, bubblesSpawned, createBubble]);

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
        toggleAudio, audioEnabled, jogoIniciado,
        fishCollection, namingFish, nameFish, unlockedGear, activeGearItems, collectGear
    };
}
