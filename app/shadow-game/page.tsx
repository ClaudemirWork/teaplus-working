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

const shuffleArray = (array: any[]) => {
 const newArray = [...array];
 for (let i = newArray.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
 }
 return newArray;
};

const ConfettiEffect = () => { /* ...código de confete... */ };
const ROUNDS_PER_PHASE = 20;

// =============================================================
// SUB-COMPONENTES (Declarados fora para estabilidade)
// =============================================================

const LoadingScreen = () => (
    <div className="screen-container loading-screen">
        <h1 className="main-title">Jogo das Sombras</h1>
        <p className="subtitle">Carregando...</p>
    </div>
);

const IntroScreen = ({ onStart, isReady, isInteracting }: { onStart: () => void, isReady: boolean, isInteracting: boolean }) => (
    <div className="screen-container intro-screen">
        <Image src="/shadow-game/leo_abertura.webp" alt="Mascote Léo" width={250} height={250} priority />
        <h1 className="main-title">Jogo das Sombras</h1>
        <p className="subtitle">Associe cada imagem com sua sombra!</p>
        <button onClick={onStart} disabled={!isReady || isInteracting} className="start-button">
            {!isReady ? 'Carregando Áudio...' : (isInteracting ? 'Ouvindo...' : 'Começar a Jogar')}
        </button>
    </div>
);

const InstructionsScreen = ({ onNext }: { onNext: () => void }) => (
    <div className="screen-container explanation-screen">
        <Image src="/shadow-game/leo_abertura.webp" alt="Léo explicando" width={200} height={200} />
        <div className="speech-bubble">
            <p>É super fácil! Clique na sombra certa para cada figura!</p>
        </div>
        <button onClick={onNext} className="start-button">
            Entendi, vamos lá!
        </button>
    </div>
);

const PhaseSelectionScreen = ({ onSelectPhase }: { onSelectPhase: (phase: number) => void }) => (
    <div className="screen-container phase-selection-screen">
        <h2>Escolha seu desafio</h2>
        <div className="phase-container">
            <button onClick={() => onSelectPhase(1)}>🔍 Fase 1</button>
            <button onClick={() => onSelectPhase(2)}>🌟 Fase 2</button>
            <button onClick={() => onSelectPhase(3)}>🏆 Fase 3</button>
        </div>
    </div>
);

const GameScreen = (props: any) => {
    const { roundData, onOptionClick, onBack, onToggleSound, soundEnabled, roundCount, streak, score, showConfetti } = props;
    if (!roundData) return null;
    return (
        <div className="playing-screen">
            {showConfetti && <ConfettiEffect />}
            <div className="top-bar">
                <button onClick={onBack} className="back-button"><ArrowLeft size={20} /> Fases</button>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${(roundCount / ROUNDS_PER_PHASE) * 100}%` }}></div></div>
                <button onClick={onToggleSound} className="sound-button">{soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}</button>
            </div>
            <div className="main-item-container"><Image src={roundData.mainItem} alt="Item principal" width={250} height={250} /></div>
            <div className="options-container">{roundData.options.map((opt: string, i: number) => (<button key={i} onClick={() => onOptionClick(opt)} className="option-button"><Image src={opt} alt={`Opção ${i + 1}`} width={100} height={100} /></button>))}</div>
            <div className="stats-display"><div><Star color="#ffc700" fill="#ffc700" /> {streak}</div><div><Trophy color="#ff9a00" fill="#ff9a00" /> {score}</div></div>
        </div>
    );
};

const PhaseCompleteScreen = ({ onNextPhase, selectedPhase }: { onNextPhase: () => void, selectedPhase: number | null }) => (
    <div className="screen-container phase-complete-screen">
        <Image src="/shadow-game/leo_abertura.webp" alt="Léo Comemorando" width={250} height={250} />
        <h2 className="main-title">Fase Completa!</h2>
        <button onClick={onNextPhase} className="start-button">
            {selectedPhase === 1 ? 'Ir para Fase 2' : 'Ir para a Fase Final'}
        </button>
    </div>
);

const GameCompleteScreen = ({ onPlayAgain, score }: { onPlayAgain: () => void, score: number }) => (
    <div className="screen-container game-complete-screen">
        <ConfettiEffect />
        <h2 className="main-title">CAMPEÃO!</h2>
        <Trophy className="trophy-icon" size={200} />
        <p className="subtitle" style={{ color: '#fff', marginTop: '1rem' }}>Você é um Mestre das Sombras!</p>
        <p className="final-score">Pontuação Final: {score}</p>
        <button onClick={onPlayAgain} className="start-button">
            Jogar Novamente
        </button>
    </div>
);


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
        if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();
        if (audioManagerRef.current) await audioManagerRef.current.forceInitialize();
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

    const handlePhaseSelect = (phase: number) => {
        playSynthSound('click');
        setSelectedPhase(phase);
        setScore(0);
        setStreak(0);
        setRoundCount(0);
        const messages: {[key: number]: string} = { 1: "Fase 1: Detetive Júnior!", 2: "Fase 2: Mestre das Sombras!", 3: "Fase 3: Desafio Final!"};
        leoSpeak(messages[phase]);
        setGameState('playing');
        startNewRound(phase);
    };

    const handleOptionClick = (opt: string) => {
        if (opt === roundData?.correctAnswer) {
            const newStreak = streak + 1;
            const newRoundCount = roundCount + 1;
            setScore(prev => prev + 100);
            setStreak(newStreak);
            setRoundCount(newRoundCount);
            playSynthSound('correct');

            if (newStreak % 5 === 0 && newStreak > 0) {
                setShowConfetti(true);
                playSynthSound('combo');
                setTimeout(() => setShowConfetti(false), 2000);
            }

            if (newRoundCount >= ROUNDS_PER_PHASE) {
                if (selectedPhase === 3) { setGameState('gameComplete'); } 
                else { setGameState('phaseComplete'); }
                return;
            }
            
            const leoStreakPhrases: {[key:number]: string[]} = {
                10: ["Aí sim! Sequência de 10!", "Você tem olhar de águia! Já são 10!"],
                20: ["Você é muito top, sequência de 20!", "Caramba! 20 acertos seguidos!"]
            };
            const phrases = leoStreakPhrases[newStreak];
            if (phrases) {
                leoSpeak(phrases[Math.floor(Math.random() * phrases.length)]);
            }
            
            setTimeout(() => startNewRound(selectedPhase!), 300);
        } else {
            playSynthSound('error');
            setStreak(0);
            leoSpeak("Ops, tente de novo!");
        }
    };
    
    const handleNextPhase = () => {
        playSynthSound('click');
        const nextPhase = selectedPhase! + 1;
        const message = nextPhase === 2 ? "Você já está supimpa, e pode ir para a fase 2. Vamos lá?" : "Caramba, você está a um passo de se tornar mestre das sombras, vamos para a fase final!";
        leoSpeak(message, () => {
            setSelectedPhase(nextPhase);
            setRoundCount(0);
            setStreak(0);
            setGameState('playing');
            startNewRound(nextPhase);
        });
    };

    const handlePlayAgain = () => {
        playSynthSound('click');
        hasCelebratedCompletion.current = false;
        setGameState('phase-selection');
    };

    useEffect(() => {
        if(gameState === 'gameComplete' && !hasCelebratedCompletion.current) {
            leoSpeak("Parabéns! Você se tornou um verdadeiro Mestre das Sombras!");
            hasCelebratedCompletion.current = true;
        }
    }, [gameState, leoSpeak]);


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
