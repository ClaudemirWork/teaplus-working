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

    // Estados principais do jogo
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

    // Estados dos equipamentos de mergulho
    const [unlockedGear, setUnlockedGear] = useState<{level: number, item: string, icon: string}[]>([]);
    const [activeGearItems, setActiveGearItems] = useState<{level: number, item: string, icon: string, x: number, y: number}[]>([]);

    // Configuração dos níveis - VELOCIDADE AJUSTADA
    const levelConfigs = [
        { level: 1, name: 'Superfície (0-10m)', depth: '0-10m', totalBubbles: 200, minePercentage: 0.05, spawnRate: 500, oxygenDrain: 0.3, bgGradient: 'from-cyan-300 to-blue-400' },
        { level: 2, name: 'Águas Rasas (10-30m)', depth: '10-30m', totalBubbles: 150, minePercentage: 0.15, spawnRate: 600, oxygenDrain: 0.5, bgGradient: 'from-blue-400 to-blue-500' },
        { level: 3, name: 'Zona Média (30-60m)', depth: '30-60m', totalBubbles: 100, minePercentage: 0.30, spawnRate: 700, oxygenDrain: 0.7, bgGradient: 'from-blue-500 to-blue-700' },
        { level: 4, name: 'Águas Fundas (60-100m)', depth: '60-100m', totalBubbles: 60, minePercentage: 0.45, spawnRate: 800, oxygenDrain: 0.9, bgGradient: 'from-blue-700 to-indigo-900' },
        { level: 5, name: 'Zona Abissal (100m+)', depth: '100m+', totalBubbles: 40, minePercentage: 0.60, spawnRate: 900, oxygenDrain: 1.1, bgGradient: 'from-indigo-900 to-black' }
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
        pufferfish: { color: '#FF6B6B', points: 75, size: 50 },
        starfish: { color: '#FFD93D', points: 80, size: 45 },
        octopus: { color: '#6BCF7F', points: 90, size: 55 }
    };

    const divingGear = [
        { level: 1, item: 'Máscara Básica', icon: '🤿' },
        { level: 2, item: 'Nadadeiras Simples', icon: '🦶' },
        { level: 3, item: 'Óculos de Mergulho', icon: '🥽' },
        { level: 4, item: 'Cilindro de Oxigênio', icon: '⛽' },
        { level: 5, item: 'Traje Completo', icon: '🛟' }
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
            if (audioManager.current && audioEnabled) {
                audioManager.current.falarMila("Cuidado! Era uma mina!");
            }
        } else {
            createParticles(x, y, bubble.color);
            setPoppedBubbles(prev => prev + 1);
            
            const newCombo = combo + 1;
            setCombo(newCombo);
            setMaxCombo(max => Math.max(max, newCombo));

            const comboMultiplier = 1 + (combo * 0.1);
            const finalPoints = Math.round(bubble.points * comboMultiplier);
            setScore(prev => prev + finalPoints);

            // Recuperar oxigênio e narrar descobertas
            if (bubble.type === 'oxygen') {
                setOxygenLevel(prev => Math.min(100, prev + 10));
                if (audioManager.current && audioEnabled) {
                    audioManager.current.falarMila("Oxigênio recuperado!");
                }
            } else if (bubble.type === 'pearl') {
                setOxygenLevel(prev => Math.min(100, prev + 20));
                if (audioManager.current && audioEnabled) {
                    audioManager.current.falarMila("Uma pérola brilhante! Vale 100 pontos!");
                }
            } else if (bubble.type === 'treasure' && audioManager.current && audioEnabled) {
                audioManager.current.falarMila("Tesouro dourado encontrado!");
            } else if (bubble.type === 'pufferfish' && audioManager.current && audioEnabled) {
                audioManager.current.falarMila("Um baiacu colorido!");
            } else if (bubble.type === 'starfish' && audioManager.current && audioEnabled) {
                audioManager.current.falarMila("Uma estrela do mar!");
            } else if (bubble.type === 'octopus' && audioManager.current && audioEnabled) {
                audioManager.current.falarMila("Um polvo esperto!");
            } else {
                setOxygenLevel(prev => Math.min(100, prev + 3));
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

    const spawnBubble = useCallback(() => {
        if (!isPlaying || bubblesSpawned >= levelConfigs[currentLevel - 1].totalBubbles) return;

        const config = levelConfigs[currentLevel - 1];
        const isMine = Math.random() < config.minePercentage;
        
        let bubbleType: Bubble['type'] = 'air';
        if (isMine) {
            bubbleType = 'mine';
        } else {
            const types = Object.keys(coloredBubbles).filter(t => t !== 'mine') as Bubble['type'][];
            bubbleType = types[Math.floor(Math.random() * types.length)];
        }

        const bubbleConfig = coloredBubbles[bubbleType];
        const size = bubbleConfig.size;
        const x = Math.random() * (gameAreaRef.current?.clientWidth || 800 - size);
        // VELOCIDADE AJUSTADA - mais rápida que antes
        const speed = 1.2 + Math.random() * 0.8; // Velocidade entre 1.2 e 2.0

        const newBubble: Bubble = {
            id: Date.now() + Math.random(),
            type: bubbleType,
            x,
            y: gameAreaRef.current?.clientHeight || 600,
            size,
            speed,
            color: bubbleConfig.color,
            points: bubbleConfig.points,
            popped: false,
        };

        setBubbles(prev => [...prev, newBubble]);
        setBubblesSpawned(prev => prev + 1);
    }, [isPlaying, currentLevel, bubblesSpawned, gameAreaRef]);

    const updateBubbles = useCallback(() => {
        if (!isPlaying) return;

        setBubbles(prev => {
            // Remover bolhas estouradas após um tempo para evitar acúmulo
            const now = Date.now();
            const updated = prev
                .map(bubble => {
                    if (bubble.popped) {
                        // Manter bolhas estouradas por 300ms para animação
                        if (now - (bubble.poppedAt || 0) > 300) {
                            return null;
                        }
                        return bubble;
                    }
                    // Mover bolhas não estouradas
                    return { ...bubble, y: bubble.y - bubble.speed };
                })
                .filter(bubble => {
                    if (!bubble) return false; // Remover bolhas nulas (estouradas há mais de 300ms)
                    
                    // Remover bolhas que saíram da tela
                    if (bubble.y < -bubble.size) {
                        if (!bubble.popped && bubble.type !== 'mine') {
                            setMissedBubbles(prev => prev + 1);
                            setCombo(0);
                        }
                        return false;
                    }
                    return true;
                });
            
            return updated;
        });

        setParticles(prev => {
            return prev
                .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.02 }))
                .filter(p => p.life > 0);
        });

        // Drenar oxigênio lentamente
        setOxygenLevel(prev => Math.max(0, prev - levelConfigs[currentLevel - 1].oxygenDrain / 60));

        // Verificar condições de fim de jogo
        const remaining = levelConfigs[currentLevel - 1].totalBubbles - bubblesSpawned;
        setBubblesRemaining(remaining);

        if (oxygenLevel <= 0) {
            endGame(false);
        } else if (bubblesSpawned >= levelConfigs[currentLevel - 1].totalBubbles && bubbles.length === 0) {
            completeLevel();
        }
    }, [isPlaying, currentLevel, bubblesSpawned, oxygenLevel]);

    const completeLevel = useCallback(() => {
        setIsPlaying(false);
        setShowLevelTransition(true);
        setCompletedLevels(prev => [...prev, currentLevel]);
        
        // Desbloquear equipamento
        const gear = divingGear.find(g => g.level === currentLevel);
        if (gear) {
            setUnlockedGear(prev => [...prev, gear]);
            setActiveGearItems(prev => [...prev, {
                level: gear.level,
                item: gear.item,
                icon: gear.icon,
                x: Math.random() * (gameAreaRef.current?.clientWidth || 800 - 60),
                y: Math.random() * (gameAreaRef.current?.clientHeight || 600 - 60)
            }]);
            
            if (audioManager.current && audioEnabled) {
                audioManager.current.falarMila(`Parabéns! Você completou o nível ${currentLevel} e desbloqueou ${gear.item}!`);
            }
        }

        setLevelMessage(`Nível ${currentLevel} Completo!`);
        setTimeout(() => {
            setShowLevelTransition(false);
            if (currentLevel < levelConfigs.length) {
                setCurrentLevel(prev => prev + 1);
                setOxygenLevel(100);
                setBubblesSpawned(0);
                setPoppedBubbles(0);
                setMissedBubbles(0);
                setCombo(0);
            } else {
                endGame(true);
            }
        }, 3000);
    }, [currentLevel, audioEnabled, gameAreaRef]);

    const endGame = useCallback((completed: boolean) => {
        setIsPlaying(false);
        setShowResults(true);
        setAccuracy(poppedBubbles > 0 ? Math.round((poppedBubbles / (poppedBubbles + missedBubbles)) * 100) : 0);
        
        if (audioManager.current && audioEnabled) {
            if (completed) {
                audioManager.current.falarMila("Parabéns! Você completou todos os níveis do jogo!");
            } else {
                audioManager.current.falarMila("O oxigênio acabou! Tente novamente!");
            }
        }
    }, [poppedBubbles, missedBubbles, audioEnabled]);

    const startActivity = useCallback(() => {
        setIsPlaying(true);
        setJogoIniciado(true);
        setShowResults(false);
        setScore(0);
        setOxygenLevel(100);
        setBubbles([]);
        setParticles([]);
        setPoppedBubbles(0);
        setMissedBubbles(0);
        setCombo(0);
        setMaxCombo(0);
        setCompletedLevels([]);
        setBubblesSpawned(0);
        setUnlockedGear([]);
        setActiveGearItems([]);
        setCurrentLevel(1);
        
        if (audioManager.current && audioEnabled) {
            audioManager.current.falarMila("Vamos começar! Estou pronta para mergulhar!");
        }
    }, [audioEnabled]);

    const handleSaveSession = useCallback(async () => {
        setSalvando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não autenticado");

            const { error } = await supabase
                .from('game_sessions')
                .insert([{
                    user_id: user.id,
                    game_type: 'bubble_pop',
                    score,
                    max_level: currentLevel,
                    completed_levels: completedLevels,
                    accuracy,
                    max_combo: maxCombo,
                    bubbles_popped: poppedBubbles,
                    bubbles_missed: missedBubbles
                }]);

            if (error) throw error;
            
            if (audioManager.current && audioEnabled) {
                audioManager.current.falarMila("Sua sessão foi salva com sucesso!");
            }
            
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (error) {
            console.error("Erro ao salvar sessão:", error);
            if (audioManager.current && audioEnabled) {
                audioManager.current.falarMila("Ocorreu um erro ao salvar sua sessão. Tente novamente.");
            }
        } finally {
            setSalvando(false);
        }
    }, [supabase, score, currentLevel, completedLevels, accuracy, maxCombo, poppedBubbles, missedBubbles, router, audioEnabled]);

    const voltarInicio = useCallback(() => {
        setIsPlaying(false);
        setJogoIniciado(false);
        setShowResults(false);
        if (audioManager.current && audioEnabled) {
            audioManager.current.falarMila("Voltando ao início...");
        }
    }, [audioEnabled]);

    const toggleAudio = useCallback(() => {
        setAudioEnabled(prev => !prev);
        if (audioManager.current) {
            audioManager.current.setEnabled(!audioEnabled);
        }
    }, [audioEnabled]);

    // Loop do jogo
    useEffect(() => {
        if (!isPlaying) return;

        const gameLoop = () => {
            updateBubbles();
            animationRef.current = requestAnimationFrame(gameLoop);
        };

        animationRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, updateBubbles]);

    // Spawn de bolhas
    useEffect(() => {
        if (!isPlaying) return;

        const spawnInterval = setInterval(() => {
            spawnBubble();
        }, levelConfigs[currentLevel - 1].spawnRate);

        return () => clearInterval(spawnInterval);
    }, [isPlaying, currentLevel, spawnBubble]);

    return {
        isPlaying,
        score,
        combo,
        oxygenLevel,
        bubbles,
        particles,
        currentLevel,
        showResults,
        salvando,
        poppedBubbles,
        bubblesRemaining,
        accuracy,
        maxCombo,
        showLevelTransition,
        levelMessage,
        levelConfigs,
        completedLevels,
        startActivity,
        handleInteraction,
        handleSaveSession,
        voltarInicio,
        toggleAudio,
        audioEnabled,
        jogoIniciado,
        unlockedGear,
        activeGearItems,
        collectGear
    };
}
