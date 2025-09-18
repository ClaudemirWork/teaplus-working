'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Volume2, VolumeX, Trophy, ArrowLeft, Smile, User } from 'lucide-react';
// Certifique-se de que o caminho para GameAudioManager está correto para seu projeto
import { GameAudioManager } from '@/utils/gameAudioManager';
import styles from './emotionrecognition.module.css';

// --- EFEITOS E COMPONENTES AUXILIARES ---

// Efeito de confete simplificado
const confetti = () => {
  if (typeof window === 'undefined') return;
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!canvas || !ctx) return;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const COLORS = ['#FFC107', '#FF9800', '#FF5722', '#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#4CAF50'];
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: W * 0.5,
        y: H * 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        vx: (Math.random() - 0.5) * 20,
        vy: Math.random() * -15 - 5,
        opacity: 1
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.3;
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.008;
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        if (p.opacity <= 0) particles.splice(i, 1);
      }
      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(canvas);
      }
    };
    animate();
  } catch (error) {
    console.warn('Erro no confetti:', error);
  }
};

const ConfettiEffect = React.memo(() => {
    useEffect(() => {
        confetti();
    }, []);
    return null;
});

const ProgressBar = React.memo(({ current, total }: { current: number, total: number }) => {
    const progress = total > 0 ? (current / total) * 100 : 0;
    return (
        <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}>
                {Math.round(progress)}%
            </div>
        </div>
    );
});

// --- COMPONENTE CARD UNIVERSAL ---
const Card = React.memo(({ emotion, onClick, isCorrect, isWrong, isDisabled }: { emotion: any, onClick: () => void, isCorrect: boolean, isWrong: boolean, isDisabled: boolean }) => {
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`${styles.emotionCard} ${isCorrect ? styles.cardCorrect : ''} ${isWrong ? styles.cardWrong : ''}`}
        >
            <div className={styles.cardImageWrapper}>
                <img
                    src={emotion.path}
                    alt={emotion.label}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/150x150/EBF4FA/333?text=?'; }}
                />
            </div>
            <span className={styles.cardLabel}>{emotion.label}</span>
        </button>
    );
});


// --- DADOS DO JOGO ---
const FACES_BASE_PATH = '/images/cards/emocoes/';
const EMOJI_BASE_PATH = '/emoji_cards/'; // <<< CAMINHO CORRIGIDO!

// MODO 1: FACES (ILUSTRAÇÕES)
const FACES_CARDS = [
    { id: 'homem_feliz', label: 'Feliz', path: `${FACES_BASE_PATH}homem_feliz.webp` },
    { id: 'homem_triste', label: 'Triste', path: `${FACES_BASE_PATH}homem_triste.webp` },
    { id: 'homem_medo', label: 'Medo', path: `${FACES_BASE_PATH}homem_medo.webp` },
    { id: 'homem_surpreso', label: 'Surpreso', path: `${FACES_BASE_PATH}homem_surpreso.webp` },
    { id: 'homem_furioso', label: 'Furioso', path: `${FACES_BASE_PATH}homem_furioso.webp` },
    { id: 'mulher_animada', label: 'Animada', path: `${FACES_BASE_PATH}mulher_animada.webp` },
    { id: 'mulher_calma', label: 'Calma', path: `${FACES_BASE_PATH}mulher_calma.webp` },
    { id: 'homem_confuso', label: 'Confuso', path: `${FACES_BASE_PATH}homem_confuso.webp` },
    { id: 'mulher_preocupada', label: 'Preocupada', path: `${FACES_BASE_PATH}mulher_preocupada.webp` },
    { id: 'homem_focado', label: 'Focado', path: `${FACES_BASE_PATH}homem_focado.webp` },
];

// MODO 2: EMOJIS (COM OS NOMES DE ARQUIVO QUE VOCÊ FORNECEU)
const EMOJI_CARDS = [
    { id: 'emoji_abracando', label: 'Abraçando', path: `${EMOJI_BASE_PATH}abraçando.webp` },
    { id: 'emoji_apaixonado', label: 'Apaixonado', path: `${EMOJI_BASE_PATH}apaixonado.webp` },
    { id: 'emoji_apavorado', label: 'Apavorado', path: `${EMOJI_BASE_PATH}apavorado.webp` },
    { id: 'emoji_cabeca_explodindo', label: 'Cabeça Explodindo', path: `${EMOJI_BASE_PATH}cabeça_explodindo.webp` },
    { id: 'emoji_chateado', label: 'Chateado', path: `${EMOJI_BASE_PATH}chateado.webp` },
    { id: 'emoji_chorando_lagrimas', label: 'Chorando', path: `${EMOJI_BASE_PATH}chorando_lagrimas.webp` },
    { id: 'emoji_desconfiado', label: 'Desconfiado', path: `${EMOJI_BASE_PATH}desconfiado.webp` },
    { id: 'emoji_dormindo', label: 'Dormindo', path: `${EMOJI_BASE_PATH}dormindo.webp` },
    { id: 'emoji_enjoado', label: 'Enjoado', path: `${EMOJI_BASE_PATH}enjoado.webp` },
    { id: 'emoji_entediado', label: 'Entediado', path: `${EMOJI_BASE_PATH}entediado.webp` },
    { id: 'emoji_envergonhado', label: 'Envergonhado', path: `${EMOJI_BASE_PATH}envergonhado.webp` },
    { id: 'emoji_espantado', label: 'Espantado', path: `${EMOJI_BASE_PATH}espantado.webp` },
    { id: 'emoji_fazendo_festa', label: 'Fazendo Festa', path: `${EMOJI_BASE_PATH}fazendo_festa.webp` },
    { id: 'emoji_feliz', label: 'Feliz', path: `${EMOJI_BASE_PATH}feliz.webp` },
    { id: 'emoji_feliz_radiante', label: 'Radiante', path: `${EMOJI_BASE_PATH}feliz_radiante.webp` },
    { id: 'emoji_fome_desejo', label: 'Com Fome', path: `${EMOJI_BASE_PATH}fome_desejo.webp` },
    { id: 'emoji_furioso', label: 'Furioso', path: `${EMOJI_BASE_PATH}furioso.webp` },
    { id: 'emoji_gargalhando', label: 'Gargalhando', path: `${EMOJI_BASE_PATH}gargalhando.webp` },
    { id: 'emoji_maluco', label: 'Maluco', path: `${EMOJI_BASE_PATH}maluco.webp` },
    { id: 'emoji_medroso', label: 'Medroso', path: `${EMOJI_BASE_PATH}medroso.webp` },
    { id: 'emoji_mentindo', label: 'Mentindo', path: `${EMOJI_BASE_PATH}mentindo.webp` },
    { id: 'emoji_morrendo_rir', label: 'Morrendo de Rir', path: `${EMOJI_BASE_PATH}morrendo_rir.webp` },
    { id: 'emoji_muito_bravo', label: 'Muito Bravo', path: `${EMOJI_BASE_PATH}muito_bravo.webp` },
    { id: 'emoji_nojo', label: 'Nojo', path: `${EMOJI_BASE_PATH}nojo.webp` },
    { id: 'emoji_olhos_rosto_sorrindo', label: 'Sorrindo', path: `${EMOJI_BASE_PATH}olhos e rosto sorrindo.webp` },
    { id: 'emoji_pensativo', label: 'Pensativo', path: `${EMOJI_BASE_PATH}pensativo.webp` },
    { id: 'emoji_piscando', label: 'Piscando', path: `${EMOJI_BASE_PATH}piscando.webp` },
    { id: 'emoji_preocupado', label: 'Preocupado', path: `${EMOJI_BASE_PATH}preocupado.webp` },
    { id: 'emoji_recusado', label: 'Recusado', path: `${EMOJI_BASE_PATH}recusado.webp` },
    { id: 'emoji_refletindo', label: 'Refletindo', path: `${EMOJI_BASE_PATH}refletindo.webp` },
    { id: 'emoji_rosto_neutro', label: 'Neutro', path: `${EMOJI_BASE_PATH}rosto_neutro.webp` },
    { id: 'emoji_silencio', label: 'Silêncio', path: `${EMOJI_BASE_PATH}silencio.webp` },
    { id: 'emoji_sorrindo', label: 'Sorrindo', path: `${EMOJI_BASE_PATH}sorrindo.webp` },
    { id: 'emoji_surpreso', label: 'Surpreso', path: `${EMOJI_BASE_PATH}surpreso.webp` },
    { id: 'emoji_timido', label: 'Tímido', path: `${EMOJI_BASE_PATH}timido.webp` },
    { id: 'emoji_triste', label: 'Triste', path: `${EMOJI_BASE_PATH}triste.webp` },
    { id: 'emoji_xingando', label: 'Xingando', path: `${EMOJI_BASE_PATH}xingando.webp` },
    { id: 'emoji_zangado', label: 'Zangado', path: `${EMOJI_BASE_PATH}zangado.webp` },
];

const GAME_PHASES = [
    { phase: 1, numCards: 2, numRounds: 3, points: 100 },
    { phase: 2, numCards: 3, numRounds: 4, points: 120 },
    { phase: 3, numCards: 4, numRounds: 4, points: 140 },
    { phase: 4, numCards: 5, numRounds: 5, points: 160 },
    { phase: 5, numCards: 6, numRounds: 5, points: 180 },
    { phase: 6, numCards: 7, numRounds: 6, points: 200 },
    { phase: 7, numCards: 8, numRounds: 6, points: 220 },
    { phase: 8, numCards: 9, numRounds: 7, points: 240 },
    { phase: 9, numCards: 10, numRounds: 7, points: 260 },
    { phase: 10, numCards: 10, numRounds: 8, points: 300 },
];

const PHASE_COMPLETION_MESSAGES = [
    "Isso aí amigão, agora vamos para a fase 2!",
    "Você é um super craque, vamos para a fase 3!",
    "Você é um detetive de emoções, vamos para a fase 4!",
    "Incrível! Você está dominando, fase 5 te espera!",
    "Vou contratar você para ser perito! Fase 6!",
    "Que talento! As emoções não têm segredos para você! Fase 7!",
    "Estamos diante de um campeão mundial! Fase 8!",
    "Você é uma máquina de identificar emoções! Rumo à fase 9!",
    "Espetacular! Você é o mestre das expressões! Última fase!",
    "INACREDITÁVEL! Você completou todas as fases!"
];

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

// --- COMPONENTE PRINCIPAL ---
export default function FacialExpressionsGame() {
    const [audioManager, setAudioManager] = useState<GameAudioManager | null>(null);
    const [gameState, setGameState] = useState('titleScreen');
    const [gameMode, setGameMode] = useState<'faces' | 'emojis' | null>(null);
    const [leoMessage, setLeoMessage] = useState('');
    const [leoSpeaking, setLeoSpeaking] = useState(false);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [cardsForPhase, setCardsForPhase] = useState<any[]>([]);
    const [targetSequence, setTargetSequence] = useState<any[]>([]);
    const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [isDisabled, setIsDisabled] = useState(false);

    const findPrompts = useMemo(() => [
        "Encontre:", "Onde está:", "Mostre-me:", "Aponte para:", "Qual deles é:",
    ], []);

    useEffect(() => {
        const initializeAudio = async () => {
            try {
                const manager = GameAudioManager.getInstance();
                setAudioManager(manager);
            } catch (error) {
                console.error('Erro ao inicializar o gerenciador de áudio:', error);
            }
        };
        initializeAudio();
    }, []);

    const leoSpeak = useCallback(async (message: string) => {
        setLeoMessage(message);
        setLeoSpeaking(true);
        return new Promise<void>((resolve) => {
            if (soundEnabled && audioManager) {
                audioManager.falarLeo(message, () => {
                    setLeoSpeaking(false);
                    resolve();
                });
            } else {
                setLeoSpeaking(false);
                setTimeout(resolve, 1000);
            }
        });
    }, [soundEnabled, audioManager]);

    const handleStartIntro = useCallback(async () => {
        if (audioManager) await audioManager.forceInitialize();
        setGameState('intro_welcome');
        await leoSpeak("Olá! Eu sou o Leo! Vamos aprender sobre as emoções juntos?");
        await new Promise(r => setTimeout(r, 400));
        setGameState('intro_explanation');
        await leoSpeak("É bem fácil! Eu vou pedir uma emoção e você clica na figura certa.");
        await new Promise(r => setTimeout(r, 400));
        setGameState('mode_select');
        await leoSpeak("Como você quer jogar hoje?");
    }, [leoSpeak, audioManager]);

    const handleSelectMode = (mode: 'faces' | 'emojis') => {
        setGameMode(mode);
        setCurrentPhaseIndex(0);
        setTotalScore(0);
        setGameState('playing');
    };
    
    const startGame = useCallback(() => {
        setGameMode(null);
        setCurrentPhaseIndex(0);
        setTotalScore(0);
        setGameState('mode_select');
        leoSpeak("Vamos jogar de novo? Como você quer jogar?");
    }, [leoSpeak]);


    const preparePhase = useCallback((phaseIndex: number, mode: 'faces' | 'emojis') => {
        const phaseConfig = GAME_PHASES[phaseIndex];
        const allCards = mode === 'faces' ? FACES_CARDS : EMOJI_CARDS;
        const shuffledAllCards = shuffleArray(allCards);
        const cardsToDisplay = shuffledAllCards.slice(0, phaseConfig.numCards);
        let sequence = [];
        for (let i = 0; i < phaseConfig.numRounds; i++) {
            sequence.push(cardsToDisplay[Math.floor(Math.random() * cardsToDisplay.length)]);
        }
        setCardsForPhase(cardsToDisplay);
        setTargetSequence(sequence);
        setCurrentTargetIndex(0);
        setFeedback(null);
        setSelectedCardId(null);
        setIsDisabled(false);
        const randomPrompt = findPrompts[Math.floor(Math.random() * findPrompts.length)];
        const startMessage = phaseIndex === 0
            ? `Vamos começar! ${randomPrompt} ${sequence[0].label}`
            : `Fase ${phaseConfig.phase}! ${randomPrompt} ${sequence[0].label}`;
        leoSpeak(startMessage);
    }, [leoSpeak, findPrompts]);

    useEffect(() => {
        if (gameState === 'playing' && gameMode) {
            preparePhase(currentPhaseIndex, gameMode);
        }
    }, [gameState, currentPhaseIndex, gameMode, preparePhase]);

    const selectCard = useCallback((card: any) => {
        if (isDisabled) return;
        setIsDisabled(true);
        setSelectedCardId(card.id);
        const currentTarget = targetSequence[currentTargetIndex];
        const isCorrect = card.id === currentTarget.id;
        if (isCorrect) {
            setFeedback('correct');
            setTotalScore(prev => prev + GAME_PHASES[currentPhaseIndex].points);
            setTimeout(() => {
                const nextTargetIndex = currentTargetIndex + 1;
                if (nextTargetIndex < targetSequence.length) {
                    setCurrentTargetIndex(nextTargetIndex);
                    setFeedback(null);
                    setSelectedCardId(null);
                    setIsDisabled(false);
                    const randomPrompt = findPrompts[Math.floor(Math.random() * findPrompts.length)];
                    leoSpeak(`${randomPrompt} ${targetSequence[nextTargetIndex].label}`);
                } else {
                    setGameState('phaseComplete');
                }
            }, 1500);
        } else {
            setFeedback('wrong');
            leoSpeak("Ops, tente novamente!");
            setTimeout(() => {
                setFeedback(null);
                setSelectedCardId(null);
                setIsDisabled(false);
            }, 1500);
        }
    }, [isDisabled, targetSequence, currentTargetIndex, currentPhaseIndex, leoSpeak, findPrompts]);

    const nextPhase = useCallback(() => {
        const nextPhaseIndex = currentPhaseIndex + 1;
        if (nextPhaseIndex < GAME_PHASES.length) {
            setCurrentPhaseIndex(nextPhaseIndex);
            setGameState('playing');
        } else {
            setGameState('gameComplete');
        }
    }, [currentPhaseIndex]);

    useEffect(() => {
        if (gameState === 'phaseComplete') {
            const message = PHASE_COMPLETION_MESSAGES[currentPhaseIndex];
            leoSpeak(message);
        } else if (gameState === 'gameComplete') {
            const message = `INACREDITÁVEL! Você fez ${totalScore} pontos e completou tudo! Você é CAMPEÃO das emoções!`;
            leoSpeak(message);
        }
    }, [gameState, currentPhaseIndex, totalScore, leoSpeak]);

    const toggleSound = useCallback(() => {
        if (audioManager) setSoundEnabled(audioManager.toggleAudio());
    }, [audioManager]);

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    const renderTitleScreen = () => (
        <div className={styles.screenCenter}>
            <div className={styles.starsBg}></div>
            <div className={`${styles.titleLeoContainer} ${styles.animateFloat}`}>
                <img src="/images/mascotes/leo/Leo_emocoes_espelho.webp" alt="Leo Mascote" className={`${styles.introMascot} ${styles.titleMascot}`} />
            </div>
            <h1 className={styles.introMainTitle}>Expressões Faciais</h1>
            <p className={styles.introMainSubtitle}>Aprenda e divirta-se com as emoções!</p>
            <button onClick={handleStartIntro} className={styles.introStartButton}>
                Começar Aventura
            </button>
        </div>
    );

    const renderIntroStep = (mascote: string, defaultMessage: string) => (
        <div className={`${styles.screenCenter} ${styles.introExplanation}`}>
            <div className={styles.introContentWrapper}>
                <div className={styles.introMascotContainer}>
                    <img
                        src={`/images/mascotes/leo/${mascote}.webp`}
                        alt="Leo"
                        className={styles.introMascot}
                        style={{ transform: leoSpeaking ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.5s ease' }}
                    />
                </div>
                <div className={styles.speechBubble}>
                    <p>{leoMessage || defaultMessage}</p>
                </div>
            </div>
        </div>
    );

    const renderModeSelectScreen = () => (
        <div className={`${styles.screenCenter} ${styles.introExplanation}`}>
            {renderIntroStep("Leo_apoio", "Como você quer jogar hoje?")}
            <div className={styles.modeSelectionContainer}>
                <button onClick={() => handleSelectMode('faces')} className={styles.modeSelectButton}>
                    <User size={40} />
                    <span>Faces</span>
                </button>
                <button onClick={() => handleSelectMode('emojis')} className={styles.modeSelectButton}>
                    <Smile size={40} />
                    <span>Emojis</span>
                </button>
            </div>
        </div>
    );

    const renderGameScreen = () => (
        <>
            <ProgressBar current={currentTargetIndex} total={targetSequence.length} />
            <div className={styles.gameArea}>
                <div className={styles.instructionContainer}>
                    <img src="/images/mascotes/leo/leo_rosto_resultado.webp" alt="Leo" className={styles.instructionMascot} style={{ transform: leoSpeaking ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.5s ease' }} />
                    <div className={`${styles.instructionBox} ${leoSpeaking ? styles.speaking : ''}`}>
                        <h2>{targetSequence.length > 0 ? findPrompts[0] + ' ' + targetSequence[currentTargetIndex].label : "Carregando..."}</h2>
                    </div>
                </div>
                <div className={`${styles.cardsGrid} ${styles[`cols${Math.min(Math.ceil(cardsForPhase.length / 2), 5)}`]}`}>
                    {cardsForPhase.map((card) => (
                        <Card
                            key={card.id}
                            emotion={card}
                            onClick={() => selectCard(card)}
                            isCorrect={feedback === 'correct' && card.id === selectedCardId}
                            isWrong={feedback === 'wrong' && card.id === selectedCardId}
                            isDisabled={isDisabled}
                        />
                    ))}
                </div>
            </div>
        </>
    );

    const renderPhaseCompleteScreen = () => (
        <div className={styles.screenCenter}>
            <ConfettiEffect />
            <div className={styles.modalContainer}>
                <img src="/images/mascotes/leo/Leo_apoio.webp" alt="Leo Comemorando" className={styles.modalMascot} />
                <h2 className={styles.modalTitle}>Fase {GAME_PHASES[currentPhaseIndex].phase} Completa!</h2>
                <div className={styles.modalIcon}>🎉</div>
                <p>Pontuação Total: <span className={styles.totalScoreHighlight}>{totalScore}</span></p>
                <button onClick={nextPhase} className={`${styles.modalButton} ${styles.nextLevel}`}>
                    {currentPhaseIndex < GAME_PHASES.length - 1 ? 'Próxima Fase' : 'Ver Resultado Final'}
                </button>
            </div>
        </div>
    );

    const renderGameCompleteScreen = () => (
        <div className={styles.screenCenter}>
            <ConfettiEffect />
            <div className={styles.modalContainer}>
                <img src="/images/mascotes/leo/Leo_emocoes_espelho.webp" alt="Leo Campeão" className={`${styles.modalMascot} ${styles.champion}`} />
                <Trophy className={styles.modalTrophy} />
                <h2 className={`${styles.modalTitle} ${styles.congrats}`}>CAMPEÃO!</h2>
                <p className={styles.finalScore}>Pontuação Final: {totalScore}</p>
                <p className={styles.completionMessage}>Você dominou todas as fases!</p>
                <button onClick={startGame} className={`${styles.modalButton} ${styles.playAgain}`}>
                    Jogar Novamente
                </button>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (gameState) {
            case 'titleScreen': return renderTitleScreen();
            case 'intro_welcome': return renderIntroStep("Leo_emocoes_espelho", "Olá! Vamos aprender sobre emoções?");
            case 'intro_explanation': return renderIntroStep("Leo_apoio", "Clique na figura que eu pedir!");
            case 'mode_select': return renderModeSelectScreen();
            case 'playing': return renderGameScreen();
            case 'phaseComplete': return renderPhaseCompleteScreen();
            case 'gameComplete': return renderGameCompleteScreen();
            default: return renderTitleScreen();
        }
    };

    return (
        <div className={`${styles.gameContainer} ${styles.emotionGameRoot} ${gameState.includes('intro') || gameState === 'titleScreen' || gameState === 'mode_select' ? styles.introMode : ''}`}>
             <header className={styles.gameHeader}>
                 <a href="/dashboard" className={styles.headerButton}><ArrowLeft size={24} /></a>
                 <h1 className={styles.gameTitle}>{gameMode === 'emojis' ? '😜' : '😊'} Expressões</h1>
                 <div className={styles.headerScore}>🏆 {totalScore}</div>
                 <button onClick={toggleSound} className={styles.headerButton}>
                     {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                 </button>
             </header>
             <main>
                 {renderContent()}
             </main>
        </div>
    );
}
