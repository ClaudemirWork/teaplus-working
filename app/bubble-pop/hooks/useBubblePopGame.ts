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
    const [totalBubbles, setTotalBubbles] = useState(0);
    
    // Estados para controle de cliques
    const [lastClickTime, setLastClickTime] = useState(0);
    const [lastClickedBubble, setLastClickedBubble] = useState<number | null>(null);

    // Estados dos equipamentos de mergulho
    const [unlockedGear, setUnlockedGear] = useState<{level: number, item: string, icon: string}[]>([]);
    const [activeGearItems, setActiveGearItems] = useState<{level: number, item: string, icon: string, x: number, y: number}[]>([]);

    // Configuração dos níveis
    const levelConfigs = [
        {
            level: 1,
            name: 'Superfície (0-10m)',
            depth: '0-10m',
            totalBubbles: 200,
            minePercentage: 0.05,
            spawnRate: 400,
            oxygenDrain: 0.3,
            bgGradient: 'from-cyan-300 to-blue-400'
        },
        {
            level: 2,
            name: 'Águas Rasas (10-30m)',
            depth: '10-30m',
            totalBubbles: 150,
            minePercentage: 0.15,
            spawnRate: 450,
            oxygenDrain: 0.5,
            bgGradient: 'from-blue-400 to-blue-500'
        },
        {
            level: 3,
            name: 'Zona Média (30-60m)',
            depth: '30-60m',
            totalBubbles: 100,
            minePercentage: 0.30,
            spawnRate: 500,
            oxygenDrain: 0.7,
            bgGradient: 'from-blue-500 to-blue-700'
        },
        {
            level: 4,
            name: 'Águas Fundas (60-100m)',
            depth: '60-100m',
            totalBubbles: 60,
            minePercentage: 0.45,
            spawnRate: 550,
            oxygenDrain: 0.9,
            bgGradient: 'from-blue-700 to-indigo-900'
        },
        {
            level: 5,
            name: 'Zona Abissal (100m+)',
            depth: '100m+',
            totalBubbles: 40,
            minePercentage: 0.60,
            spawnRate: 600,
            oxygenDrain: 1.1,
            bgGradient: 'from-indigo-900 to-black'
        }
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

    // Criar nova bolha com velocidade variável
    const createBubble = useCallback(() => {
        if (!isPlaying || !gameAreaRef.current) {
            return;
        }

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
                if (colorRand < 0.5) type = 'air';
                else if (colorRand < 0.7) type = 'oxygen';
                else if (colorRand < 0.85) type = 'pink';
                else if (colorRand < 0.95) type = 'purple';
                else type = 'treasure';
            } else if (currentLevel === 2) {
                if (colorRand < 0.3) type = 'air';
                else if (colorRand < 0.5) type = 'oxygen';
                else if (colorRand < 0.65) type = 'pink';
                else if (colorRand < 0.75) type = 'purple';
                else if (colorRand < 0.85) type = 'yellow';
                else if (colorRand < 0.95) type = 'green';
                else type = 'treasure';
            } else if (currentLevel === 3) {
                if (colorRand < 0.2) type = 'air';
                else if (colorRand < 0.35) type = 'oxygen';
                else if (colorRand < 0.5) type = 'pink';
                else if (colorRand < 0.6) type = 'purple';
                else if (colorRand < 0.7) type = 'yellow';
                else if (colorRand < 0.8) type = 'green';
                else if (colorRand < 0.9) type = 'orange';
                else if (colorRand < 0.97) type = 'treasure';
                else type = 'pearl';
            } else {
                if (colorRand < 0.1) type = 'air';
                else if (colorRand < 0.2) type = 'oxygen';
                else if (colorRand < 0.35) type = 'purple';
                else if (colorRand < 0.5) type = 'yellow';
                else if (colorRand < 0.65) type = 'green';
                else if (colorRand < 0.75) type = 'orange';
                else if (colorRand < 0.9) type = 'treasure';
                else type = 'pearl';
            }

            bubbleConfig = coloredBubbles[type as keyof typeof coloredBubbles];

            if (type === 'pearl' || type === 'treasure') {
                horizontalMovement = (Math.random() - 0.5) * 1.5;
            }
        }

        // Velocidade baseada no nível e com variação aleatória
        const baseSpeed = 3 + (currentLevel * 0.5);
        const speedVariation = Math.random() * 2 - 1; // Variação entre -1 e 1
        const finalSpeed = baseSpeed + speedVariation;

        const newBubble: Bubble = {
            id: Date.now() + Math.random(),
            x: Math.random() * (gameArea.width - bubbleConfig.size),
            y: gameArea.height + bubbleConfig.size,
            size: bubbleConfig.size + (Math.random() * 10 - 5),
            speed: finalSpeed, // VELOCIDADE VARIÁVEL
            color: bubbleConfig.color,
            points: bubbleConfig.points,
            type: type,
            popped: false,
            opacity: 1,
            horizontalMovement: horizontalMovement
        };

        setBubbles(prev => [...prev, newBubble]);
        setTotalBubbles(prev => prev + 1);
        setBubblesSpawned(prev => prev + 1);
        setBubblesRemaining(prev => prev - 1);
    }, [isPlaying, currentLevel, bubblesSpawned, gameAreaRef]);

    // Atualizar posição das bolhas com remoção imediata
    const updateBubbles = useCallback(() => {
        if (!gameAreaRef.current) return;

        const gameArea = gameAreaRef.current.getBoundingClientRect();
        
        setBubbles(prev => {
            const updatedBubbles = prev.map(bubble => {
                if (bubble.popped) {
                    return { ...bubble, opacity: bubble.opacity - 0.05 };
                }

                // Calcular nova posição
                const newY = bubble.y - bubble.speed;
                let newX = bubble.x;

                if (bubble.horizontalMovement) {
                    newX += bubble.horizontalMovement;
                    if (newX <= 0 || newX >= gameArea.width - bubble.size) {
                        bubble.horizontalMovement = -bubble.horizontalMovement;
                        newX = Math.max(0, Math.min(gameArea.width - bubble.size, newX));
                    }
                }

                // Se a bolha saiu da tela, marcar para remoção
                if (newY < -bubble.size) {
                    if (!bubble.popped && bubble.type !== 'mine') {
                        setMissedBubbles(prev => prev + 1);
                        setCombo(0);
                        setOxygenLevel(prev => Math.max(0, prev - 1));
                    }
                    return { ...bubble, opacity: 0 }; // Marcar para remoção
                }

                return { ...bubble, y: newY, x: newX };
            });
            
            // Remover bolhas com opacidade 0 ou que saíram da tela
            return updatedBubbles.filter(bubble => bubble.opacity > 0);
        });
    }, [gameAreaRef]);

    // Atualizar partículas
    const updateParticles = useCallback(() => {
        setParticles(prev => prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.2,
            life: particle.life - 0.03
        })).filter(particle => particle.life > 0));
    }, []);

    // Criar partículas de explosão
    const createParticles = useCallback((x: number, y: number, color: string, isExplosion: boolean = false) => {
        const newParticles: Particle[] = [];
        const particleCount = isExplosion ? 20 : 10;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = isExplosion ? Math.random() * 5 + 3 : Math.random() * 3 + 2;
            newParticles.push({
                id: Date.now() + i,
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color: isExplosion ? '#FF4500' : color,
                life: 1
            });
        }
        
        setParticles(prev => [...prev, ...newParticles]);
    }, []);

    // Som de estouro
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
                    air: 600,
                    oxygen: 700,
                    pink: 800,
                    purple: 900,
                    yellow: 1000,
                    green: 1100,
                    orange: 1200
                };
                oscillator.frequency.value = freqMap[type as keyof typeof freqMap] || 600;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.05);
            }
        } catch (e) {
            // Silently fail
        }
    }, [audioEnabled]);

    // Estourar bolha com feedback visual imediato
    const popBubble = useCallback((bubble: Bubble, x: number, y: number) => {
        if (bubble.popped) return;

        // Marcar a bolha como estourada imediatamente
        setBubbles(prev => prev.map(b =>
            b.id === bubble.id ? { ...b, popped: true } : b
        ));

        // Criar partículas imediatamente no local do clique
        createParticles(x, y, bubble.color, bubble.type === 'mine');

        // Tocar som
        playPopSound(bubble.type);

        // Atualizar estado do jogo
        if (bubble.type === 'mine') {
            setScore(prev => Math.max(0, prev + bubble.points));
            setCombo(0);
            setOxygenLevel(prev => Math.max(0, prev - 10));
            if (audioManager.current && audioEnabled) {
                audioManager.current.falarMila("Cuidado! Era uma mina!");
            }
        } else {
            setPoppedBubbles(prev => prev + 1);
            
            setCombo(prev => {
                const newCombo = prev + 1;
                setMaxCombo(max => Math.max(max, newCombo));
                return newCombo;
            });

            const comboMultiplier = 1 + (combo * 0.1);
            const finalPoints = Math.round(bubble.points * comboMultiplier);
            setScore(prev => prev + finalPoints);

            // Recuperar oxigênio baseado no tipo
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
            } else {
                setOxygenLevel(prev => Math.min(100, prev + 3));
            }
        }
    }, [combo, createParticles, playPopSound, audioEnabled]);

    // Handle de clique/toque otimizado com detecção de colisão aprimorada
    const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!gameAreaRef.current || !isPlaying) return;

        e.preventDefault(); // Prevenir comportamento padrão
        
        const rect = gameAreaRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Encontrar a bolha mais próxima do clique
        let closestBubble: Bubble | null = null;
        let closestDistance = Infinity;

        // Otimização: usar for loop em vez de forEach para melhor performance
        for (let i = 0; i < bubbles.length; i++) {
            const bubble = bubbles[i];
            if (bubble.popped) continue;

            const bubbleCenterX = bubble.x + bubble.size / 2;
            const bubbleCenterY = bubble.y + bubble.size / 2;
            const distance = Math.sqrt(
                Math.pow(x - bubbleCenterX, 2) +
                Math.pow(y - bubbleCenterY, 2)
            );

            // Considerar uma margem de erro (aumentar o raio em 30% para facilitar o clique)
            const hitRadius = bubble.size / 2 * 1.3;

            if (distance <= hitRadius && distance < closestDistance) {
                closestDistance = distance;
                closestBubble = bubble;
            }
        }

        if (closestBubble) {
            const now = Date.now();
            // Verificar se a mesma bolha não foi clicada nos últimos 150ms
            if (lastClickedBubble !== closestBubble.id || now - lastClickTime > 150) {
                popBubble(closestBubble, x, y);
                setLastClickedBubble(closestBubble.id);
                setLastClickTime(now);
            }
        }
    }, [isPlaying, bubbles, popBubble, gameAreaRef, lastClickedBubble, lastClickTime]);

    // Game loop otimizado com controle de FPS
    useEffect(() => {
        if (!isPlaying) return;

        let lastTime = 0;
        const targetFPS = 60;
        const frameInterval = 1000 / targetFPS;

        const gameLoop = (timestamp: number) => {
            if (!lastTime || timestamp - lastTime >= frameInterval) {
                updateBubbles();
                updateParticles();
                lastTime = timestamp;
            }
            animationRef.current = requestAnimationFrame(gameLoop);
        };

        animationRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying, updateBubbles, updateParticles]);

    // Spawn de bolhas com taxa ajustada por nível
    useEffect(() => {
        if (!isPlaying) return;

        const config = levelConfigs[currentLevel - 1];
        
        // Ajustar a taxa de spawn com base no nível
        const adjustedSpawnRate = Math.max(200, config.spawnRate - (currentLevel * 50));
        
        const spawnInterval = setInterval(() => {
            if (bubblesSpawned < config.totalBubbles) {
                createBubble();
            } else {
                // Parar de gerar bolhas quando atingir o limite
                clearInterval(spawnInterval);
            }
        }, adjustedSpawnRate);

        return () => clearInterval(spawnInterval);
    }, [isPlaying, currentLevel, bubblesSpawned, createBubble]);

    // Drenar oxigênio
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
    }, [isPlaying, currentLevel]);

    // Verificar fim do nível
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
    }, [isPlaying, currentLevel, bubblesSpawned, bubbles]);

    const endGame = useCallback(() => {
        setIsPlaying(false);
        setShowResults(true);
        if (currentLevel === 5 && bubblesSpawned >= levelConfigs[4].totalBubbles) {
            setCompletedLevels(prev => [...prev, currentLevel]);
        }
        const totalAttempts = poppedBubbles + missedBubbles;
        const acc = totalAttempts > 0 ? Math.round((poppedBubbles / totalAttempts) * 100) : 0;
        setAccuracy(acc);
    }, [currentLevel, bubblesSpawned, poppedBubbles, missedBubbles]);

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
        setTotalBubbles(0);
        setPoppedBubbles(0);
        setMissedBubbles(0);
        setCompletedLevels([]);
        setBubblesSpawned(0);
        setBubblesRemaining(levelConfigs[0].totalBubbles);
        setLastClickedBubble(null);
        setLastClickTime(0);
    }, []);

    const voltarInicio = useCallback(() => {
        setJogoIniciado(false);
        setShowResults(false);
        setIsPlaying(false);
        setBubbles([]);
        setParticles([]);
        setLastClickedBubble(null);
        setLastClickTime(0);
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
                atividade_nome: 'Oceano de Bolhas',
                pontuacao_final: score,
                data_fim: new Date().toISOString()
            }]);

            router.push('/dashboard');
        } catch (error) {
            console.error('Erro ao salvar sessão:', error);
        } finally {
            setSalvando(false);
        }
    }, [supabase, router, score]);

    const toggleAudio = useCallback(() => {
        if (audioManager.current) {
            const newState = audioManager.current.toggleAudio();
            setAudioEnabled(newState);
            if (newState) {
                audioManager.current.falarMila("Áudio ligado!");
            }
        }
    }, []);

    // Memoizar a lista de bolhas e partículas para melhor performance
    const memoizedBubbles = useMemo(() => bubbles, [bubbles]);
    const memoizedParticles = useMemo(() => particles, [particles]);

    return {
        isPlaying,
        score,
        combo,
        oxygenLevel,
        bubbles: memoizedBubbles,
        particles: memoizedParticles,
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
        activeGearItems
    };
}
