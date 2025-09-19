'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './shadowgame.css';
import Image from 'next/image';
import { Trophy, Star, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import type { GameAudioManager } from '@/utils/gameAudioManager';

// ======================
// TIPOS E DADOS
// ======================
type GameState = 'loading' | 'intro' | 'instructions' | 'phase-selection' | 'playing' | 'phaseComplete' | 'gameComplete';
type RoundType = 'imageToShadow' | 'shadowToImage';
type SoundType = 'correct' | 'error' | 'click' | 'combo';

const imageNames = [
    'abacate', 'abelha', 'abelha_feliz', 'abelha_voando', 'abelhinha', 'aguia', 'amigos', 
    'apresentacao', 'arvore_natal', 'baleia', 'bananas', 'barraca', 'beagle', 'berinjela', 
    'bike', 'biscoito', 'boneca', 'borboleta', 'brincando', 'brinquedo', 'brocolis', 
    'cachorro', 'cachorro_banho', 'cactus', 'cactus_vaso', 'caranguejo', 'carro_laranja', 
    'carro_vermelho', 'carta', 'casa', 'casa_balao', 'casal', 'cavalinho', 'cegonha', 
    'cerebro', 'cerejas', 'cobra', 'coco', 'coelho_chocolate', 'coelho_pascoa', 
    'coelho_pelucia', 'cone', 'coral', 'criancas', 'crocodilo', 'crocodilo_escola', 
    'crocodilo_feliz', 'detetive', 'doutor', 'elefante', 'elefantinho', 'enfeite_natal', 
    'esquilo', 'estudando', 'fantasminha', 'formiga', 'forte', 'franguinho', 'fusca', 
    'galinha', 'gata_danca', 'gatinho', 'gatinho_cores', 'gato', 'gato_balao', 
    'gato_branco', 'gato_caixa', 'gato_cores', 'gato_pretao', 'gato_preto', 'gel', 
    'genial', 'girafa', 'homem_neve', 'inseto', 'irmaos_crocodilos', 'leao', 'leitura', 
    'limao', 'maca_nervosa', 'melancia', 'melancia_pedaco', 'menina', 'menina_amor', 
    'menino', 'menino_cao', 'milkshake', 'motoca', 'mulher', 'mulher_gato', 'mundo', 
    'panda', 'papai_noel', 'pardal', 'passaro_azul', 'passaro_preto', 'passaros_fio', 
    'peixe_louco', 'penguim', 'pirata_pau', 'pote_ouro', 'preguica', 'professor', 
    'professora', 'puffy', 'relax', 'rosto', 'sapao', 'sapo', 'super_macaco', 'tartaruga', 
    'tenis', 'tenis_azul', 'tigre', 'tigre_feliz', 'trem', 'tres_crocodilos', 'tubarao', 
    'tulipas', 'turma', 'uniconio_rosa', 'unicornino', 'urso_branco', 'vegetais', 'violao', 
    'violino', 'vulcao', 'zebra'
];

const shuffleArray = (array: any[]) => { /* ...código sem alteração... */ };
const ConfettiEffect = () => { /* ...código sem alteração... */ };
const ROUNDS_PER_PHASE = 20;

// =============================================================
// SUB-COMPONENTES
// =============================================================
const LoadingScreen = () => (/* ...código sem alteração... */);
const IntroScreen = ({ onStart, isReady, isInteracting }: { onStart: () => void, isReady: boolean, isInteracting: boolean }) => (/* ...código sem alteração... */);
const InstructionsScreen = ({ onNext }: { onNext: () => void }) => (/* ...código sem alteração... */);
const PhaseSelectionScreen = ({ onSelectPhase }: { onSelectPhase: (phase: number) => void }) => (/* ...código sem alteração... */);
const GameScreen = (props: any) => { /* ...código sem alteração... */ };
const PhaseCompleteScreen = ({ onNextPhase, selectedPhase }: { onNextPhase: () => void, selectedPhase: number | null }) => { /* ...código sem alteração... */ };
const GameCompleteScreen = ({ onPlayAgain, score }: { onPlayAgain: () => void, score: number }) => { /* ...código sem alteração... */ };


// ======================
// COMPONENTE PRINCIPAL
// ======================
export default function ShadowGamePage() {
    const [gameState, setGameState] = useState<GameState>('loading');
    const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
    const [roundData, setRoundData] = useState<{ mainItem: string; options: string[]; correctAnswer: string } | null>(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);
    const [roundCount, setRoundCount] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);

    const audioManagerRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const hasCelebratedCompletion = useRef(false);

    useEffect(() => {
        const init = async () => {
            try {
                const { GameAudioManager } = await import('@/utils/gameAudioManager');
                audioManagerRef.current = GameAudioManager.getInstance();
                // @ts-ignore
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            } catch (err) { console.warn('⚠️ Erro na inicialização de áudio:', err); }
            setIsReady(true);
            setGameState('intro');
        };
        init();
    }, []);

    const playSynthSound = useCallback((type: SoundType) => { /* ...código sem alteração... */ }, [soundEnabled]);
    const leoSpeak = useCallback((text: string, onEnd?: () => void) => { /* ...código sem alteração... */ }, [soundEnabled]);
    const startNewRound = useCallback((phase: number) => { /* ...código sem alteração... */ }, []);

    // Handlers
    const handleStartIntro = async () => {
        if(isInteracting || !isReady) return;
        setIsInteracting(true);

        // CORREÇÃO: Força o início/reconexão dos contextos de áudio no primeiro clique
        try {
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }
            if (audioManagerRef.current) {
                await audioManagerRef.current.forceInitialize();
            }
        } catch (error) {
            console.error("Erro ao 'acordar' o áudio:", error);
        }

        playSynthSound('click');
        leoSpeak("Olá! Eu sou o Léo! Vamos jogar com sombras?", () => {
            setIsInteracting(false);
            setGameState('instructions');
        });
    };
    
    const handleNextInstruction = () => {
        playSynthSound('click');
        leoSpeak("É super fácil! Clique na sombra certa para cada figura!", () => {
            setGameState('phase-selection');
        });
    };

    const handlePhaseSelect = (phase: number) => { /* ...código sem alteração... */ };
    const handleOptionClick = (opt: string) => { /* ...código sem alteração... */ };
    const handleNextPhase = () => { /* ...código sem alteração... */ };
    const handlePlayAgain = () => { /* ...código sem alteração... */ };

    useEffect(() => { /* ...código sem alteração... */ }, [gameState, leoSpeak]);


    const renderContent = () => {
        switch (gameState) {
            case 'intro': return <IntroScreen onStart={handleStartIntro} isReady={isReady} isInteracting={isInteracting} />;
            case 'instructions': return <InstructionsScreen onNext={handleNextInstruction} />;
            case 'phase-selection': return <PhaseSelectionScreen onSelectPhase={handlePhaseSelect} />;
            case 'playing': return <GameScreen roundData={roundData} onOptionClick={handleOptionClick} onBack={() => setGameState('phase-selection')} onToggleSound={() => setSoundEnabled(!soundEnabled)} soundEnabled={soundEnabled} roundCount={roundCount} streak={streak} score={score} showConfetti={showConfetti} />;
            case 'phaseComplete': return <PhaseCompleteScreen onNextPhase={handleNextPhase} selectedPhase={selectedPhase} />;
            case 'gameComplete': return <GameCompleteScreen onPlayAgain={handlePlayAgain} score={score} />;
            default: return <LoadingScreen />;
        }
    };

    return (<main className="shadow-game-main">{renderContent()}</main>);
}
