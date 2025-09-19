'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, Volume2, VolumeX, Save, Star, Trophy, Timer, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabaseClient';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import styles from './memory-game.module.css';

// Mundos em ordem de progressão
const WORLD_ORDER = ['starter', 'sports', 'fantasy', 'heroes', 'digital', 'multicultural'];

// Avatares organizados por mundo/categoria
const AVATAR_WORLDS = {
    // ... (código original mantido)
};

// Configurações de dificuldade
const DIFFICULTY_SETTINGS = {
    // ... (código original mantido)
};

interface Card {
    id: string;
    avatar: string;
    isFlipped: boolean;
    isMatched: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'loading' | 'intro' | 'instructions' | 'playing' | 'worldComplete' | 'gameComplete';

// Componente de Confetti
const ConfettiEffect = React.memo(() => {
    // ... (código original mantido)
});

// Componente de Trofeu Explodindo
const TrophyExplosion = React.memo(() => {
    // ... (código original mantido)
});

export default function MemoryGame() {
    const router = useRouter();
    const supabase = createClient();
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioManagerRef = useRef<any>(null);

    // Estados de controle
    const [gameState, setGameState] = useState<GameState>('loading');
    const [isReady, setIsReady] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showTrophyExplosion, setShowTrophyExplosion] = useState(false);

    // Estados de progressão
    const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [totalScore, setTotalScore] = useState(0);

    // Estados salvos
    const [totalPairsFound, setTotalPairsFound] = useState(0);
    const [bestScore, setBestScore] = useState(0);

    // Estados do jogo atual
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(true);

    // Getter para mundo atual
    const getCurrentWorld = () => WORLD_ORDER[currentWorldIndex];
    const getCurrentWorldData = () => AVATAR_WORLDS[getCurrentWorld() as keyof typeof AVATAR_WORLDS];

    // Inicialização
    useEffect(() => {
        const init = async () => {
            try {
                const { GameAudioManager } = await import('@/utils/gameAudioManager');
                const gameAudioManager = GameAudioManager.getInstance();
                if (gameAudioManager) {
                    audioManagerRef.current = gameAudioManager;
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                } else {
                    console.warn('GameAudioManager não foi inicializado corretamente');
                }

                const savedPairs = localStorage.getItem('memoryGame_totalPairs');
                const savedBest = localStorage.getItem('memoryGame_bestScore');

                if (savedPairs) setTotalPairsFound(parseInt(savedPairs));
                if (savedBest) setBestScore(parseInt(savedBest));

            } catch (err) {
                console.warn('Erro na inicialização de áudio:', err);
            }
            setIsReady(true);
            setGameState('intro');
        };
        init();
    }, []);

    // Leo falar - CORRIGIDO
    const leoSpeak = useCallback((text: string, onEnd?: () => void) => {
        if (!isSoundOn || !audioManagerRef.current) {
            onEnd?.();
            return;
        }
        
        // Garantir que o callback seja chamado apenas uma vez
        let called = false;
        const wrappedCallback = () => {
            if (!called) {
                called = true;
                onEnd?.();
            }
        };
        
        audioManagerRef.current.falarLeo(text, wrappedCallback);
    }, [isSoundOn]);

    // Sons do jogo
    const playSound = useCallback((type: 'flip' | 'match' | 'error' | 'victory' | 'celebration') => {
        // ... (código original mantido)
    }, [isSoundOn]);

    // Handler da tela inicial - CORRIGIDO
    const handleStartIntro = async () => {
        if (isInteracting || !isReady) return;
        setIsInteracting(true);
        try {
            if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();
            if (audioManagerRef.current) await audioManagerRef.current.forceInitialize();

            leoSpeak("Olá! Sou o Leo, e agora, vamos nos divertir e exercitar nossa memória. Vamos nos tornar um super cérebro!", () => {
                setIsInteracting(false);
                setGameState('instructions');
            });
        } catch (error) {
            console.error('Erro ao inicializar áudio:', error);
            setIsInteracting(false);
            setGameState('instructions');
        }
    };

    // Handler de instruções - CORRIGIDO
    const handleNextInstruction = () => {
        if (isInteracting) return;
        setIsInteracting(true);
        try {
            leoSpeak("Vamos explorar mundos incríveis juntos! Começaremos pelo Mundo Inicial no modo fácil, depois médio, depois difícil. Quando completarmos um mundo inteiro, passaremos automaticamente para o próximo desafio. Vamos nessa jornada!", () => {
                setIsInteracting(false);
                startCurrentWorld();
            });
        } catch (error) {
            console.error('Erro ao reproduzir áudio:', error);
            setIsInteracting(false);
            startCurrentWorld();
        }
    };

    // Iniciar mundo atual - CORRIGIDO
    const startCurrentWorld = () => {
        setDifficulty('easy');
        const worldData = getCurrentWorldData();
        try {
            leoSpeak(`Bem-vindo ao ${worldData.name}! Vamos começar no modo fácil!`, () => {
                setGameState('playing');
                initializeGame();
            });
        } catch (error) {
            console.error('Erro ao reproduzir áudio:', error);
            setGameState('playing');
            initializeGame();
        }
    };

    // Inicializar jogo
    const initializeGame = useCallback(() => {
        // ... (código original mantido)
    }, [difficulty, currentWorldIndex]);

    // Timer
    useEffect(() => {
        // ... (código original mantido)
    }, [isTimerActive, timeLeft, gameStarted, gameState]);

    // Verificar vitória
    useEffect(() => {
        // ... (código original mantido)
    }, [matches, difficulty, gameStarted, gameState]);

    // Clique na carta
    const handleCardClick = (cardId: string) => {
        // ... (código original mantido)
    };

    // Verificar par
    const checkMatch = (selected: string[]) => {
        // ... (código original mantido)
    };

    // Lógica de vitória e progressão
    const handleVictory = () => {
        // ... (código original mantido)
    };

    // Game Over
    const handleGameOver = () => {
        // ... (código original mantido)
    };

    // Continuar para próximo mundo
    const handleContinueToNextWorld = () => {
        startCurrentWorld();
    };

    const handleSaveSession = async () => {
        // ... (código original mantido)
    };

    // Renderização das telas
    if (gameState === 'loading') {
        return (
            // ... (código original mantido)
        );
    }

    if (gameState === 'intro') {
        return (
            // ... (código original mantido)
        );
    }

    if (gameState === 'instructions') {
        return (
            // ... (código original mantido)
        );
    }

    if (gameState === 'playing') {
        return (
            // ... (código original mantido)
        );
    }

    if (gameState === 'worldComplete') {
        return (
            // ... (código original mantido)
        );
    }

    if (gameState === 'gameComplete') {
        return (
            // ... (código original mantido)
        );
    }

    return null;
}
