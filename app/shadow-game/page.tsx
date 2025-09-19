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

const ConfettiEffect = React.memo(() => {
    useEffect(() => {
        let canvas: HTMLCanvasElement | null = document.createElement('canvas');
        canvas.style.position = 'fixed'; canvas.style.top = '0'; canvas.style.left = '0';
        canvas.style.width = '100vw'; canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none'; canvas.style.zIndex = '1000';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let particles: any[] = [];
        const colors = ["#ffca3a", "#ff595e", "#8ac926", "#1982c4", "#6a4c93"];
        for (let i = 0; i < 150; i++) { particles.push({ x: Math.random() * window.innerWidth, y: Math.random() * -window.innerHeight, vx: (Math.random() - 0.5) * 8, vy: Math.random() * 10 + 5, size: Math.random() * 5 + 2, color: colors[Math.floor(Math.random() * colors.length)] }); }
        const animate = () => {
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.vy += 0.05; p.y += p.vy; p.x += p.vx;
                if (p.y > window.innerHeight) particles.splice(i, 1);
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size * 2);
            });
            if (particles.length > 0) requestAnimationFrame(animate);
            else if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
        };
        animate();
        return () => { if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas); };
    }, []);
    return null;
});

const ROUNDS_PER_PHASE = 20;

// =============================================================
// SUB-COMPONENTES COM RESPONSIVIDADE MOBILE
// =============================================================
const LoadingScreen = () => (
    <div className="screen-container loading-screen" style={{ 
        minHeight: '100vh', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <h1 className="main-title" style={{ 
            fontSize: 'clamp(1.8rem, 8vw, 3rem)',
            textAlign: 'center',
            marginBottom: '1rem'
        }}>Jogo das Sombras</h1>
        <p className="subtitle" style={{ 
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',
            textAlign: 'center'
        }}>Carregando...</p>
    </div>
);

const IntroScreen = ({ onStart, isReady, isInteracting }: { onStart: () => void, isReady: boolean, isInteracting: boolean }) => (
    <div className="screen-container intro-screen" style={{ 
        minHeight: '100vh', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem'
    }}>
        <Image 
            src="/shadow-game/leo_abertura.webp" 
            alt="Mascote Léo" 
            width={200} 
            height={200} 
            priority 
            style={{ 
                width: 'clamp(150px, 40vw, 250px)', 
                height: 'auto' 
            }}
        />
        <h1 className="main-title" style={{ 
            fontSize: 'clamp(1.8rem, 8vw, 3rem)',
            textAlign: 'center',
            margin: '0'
        }}>Jogo das Sombras</h1>
        <p className="subtitle" style={{ 
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',
            textAlign: 'center',
            margin: '0'
        }}>Associe cada imagem com sua sombra!</p>
        <button 
            onClick={onStart} 
            disabled={!isReady || isInteracting} 
            className="start-button"
            style={{
                fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                padding: 'clamp(0.8rem, 3vw, 1.2rem) clamp(1.5rem, 6vw, 2rem)',
                minWidth: '200px',
                maxWidth: '90vw'
            }}
        >
            {!isReady ? 'Carregando Áudio...' : (isInteracting ? 'Ouvindo...' : 'Começar a Jogar')}
        </button>
    </div>
);

const InstructionsScreen = ({ onNext }: { onNext: () => void }) => (
    <div className="screen-container explanation-screen" style={{ 
        minHeight: '100vh', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem'
    }}>
        <Image 
            src="/shadow-game/leo_abertura.webp" 
            alt="Léo explicando" 
            width={150} 
            height={150}
            style={{ 
                width: 'clamp(120px, 30vw, 200px)', 
                height: 'auto' 
            }}
        />
        <div className="speech-bubble" style={{ 
            padding: 'clamp(1rem, 4vw, 1.5rem)',
            fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
            maxWidth: '90vw',
            textAlign: 'center'
        }}>
            <p>É super fácil! Clique na sombra certa para cada figura!</p>
        </div>
        <button 
            onClick={onNext} 
            className="start-button"
            style={{
                fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                padding: 'clamp(0.8rem, 3vw, 1.2rem) clamp(1.5rem, 6vw, 2rem)',
                minWidth: '200px',
                maxWidth: '90vw'
            }}
        >
            Entendi, vamos lá!
        </button>
    </div>
);

const PhaseSelectionScreen = ({ onSelectPhase }: { onSelectPhase: (phase: number) => void }) => (
    <div className="screen-container phase-selection-screen" style={{ 
        minHeight: '100vh', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem'
    }}>
        <h2 style={{ 
            fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
            textAlign: 'center',
            margin: '0'
        }}>Escolha seu desafio</h2>
        <div className="phase-container" style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '300px'
        }}>
            <button 
                onClick={() => onSelectPhase(1)}
                style={{
                    fontSize: 'clamp(1.1rem, 4.5vw, 1.4rem)',
                    padding: 'clamp(1rem, 4vw, 1.5rem)',
                    width: '100%',
                    minHeight: '60px'
                }}
            >
                🔍 Fase 1
            </button>
            <button 
                onClick={() => onSelectPhase(2)}
                style={{
                    fontSize: 'clamp(1.1rem, 4.5vw, 1.4rem)',
                    padding: 'clamp(1rem, 4vw, 1.5rem)',
                    width: '100%',
                    minHeight: '60px'
                }}
            >
                🌟 Fase 2
            </button>
            <button 
                onClick={() => onSelectPhase(3)}
                style={{
                    fontSize: 'clamp(1.1rem, 4.5vw, 1.4rem)',
                    padding: 'clamp(1rem, 4vw, 1.5rem)',
                    width: '100%',
                    minHeight: '60px'
                }}
            >
                🏆 Fase 3
            </button>
        </div>
    </div>
);

const GameScreen = (props: any) => {
    const { roundData, onOptionClick, onBack, onToggleSound, soundEnabled, roundCount, streak, score, showConfetti } = props;
    if (!roundData) return null;
    
    return (
        <div className="playing-screen" style={{ 
            minHeight: '100vh', 
            display: 'flex',
            flexDirection: 'column',
            padding: '0.5rem'
        }}>
            {showConfetti && <ConfettiEffect />}
            
            {/* Top Bar */}
            <div className="top-bar" style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                gap: '0.5rem'
            }}>
                <button 
                    onClick={onBack} 
                    className="back-button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: 'clamp(0.8rem, 3vw, 1rem)',
                        padding: 'clamp(0.5rem, 2vw, 0.8rem)',
                        minWidth: 'auto'
                    }}
                >
                    <ArrowLeft size={16} /> Fases
                </button>
                
                <div className="progress-bar" style={{ 
                    flex: 1,
                    height: 'clamp(8px, 2vw, 12px)',
                    backgroundColor: '#ddd',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    margin: '0 0.5rem'
                }}>
                    <div 
                        className="progress-fill" 
                        style={{ 
                            width: `${(roundCount / ROUNDS_PER_PHASE) * 100}%`,
                            height: '100%',
                            backgroundColor: '#4CAF50',
                            transition: 'width 0.3s ease'
                        }}
                    ></div>
                </div>
                
                <button 
                    onClick={onToggleSound} 
                    className="sound-button"
                    style={{
                        padding: 'clamp(0.5rem, 2vw, 0.8rem)',
                        minWidth: 'auto'
                    }}
                >
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
            </div>

            {/* Main Item */}
            <div className="main-item-container" style={{ 
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                flex: '0 0 auto'
            }}>
                <Image 
                    src={roundData.mainItem} 
                    alt="Item principal" 
                    width={200} 
                    height={200}
                    style={{ 
                        width: 'clamp(150px, 50vw, 250px)', 
                        height: 'auto',
                        borderRadius: '10px'
                    }}
                />
            </div>

            {/* Options */}
            <div className="options-container" style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: 'clamp(0.5rem, 2vw, 1rem)',
                justifyContent: 'center',
                maxWidth: '400px',
                margin: '0 auto 1.5rem auto',
                flex: '1'
            }}>
                {roundData.options.map((opt: string, i: number) => (
                    <button 
                        key={i} 
                        onClick={() => onOptionClick(opt)} 
                        className="option-button"
                        style={{
                            padding: 'clamp(0.5rem, 2vw, 0.8rem)',
                            border: 'none',
                            borderRadius: '10px',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            aspectRatio: '1'
                        }}
                        onTouchStart={(e) => {
                            e.currentTarget.style.transform = 'scale(0.95)';
                        }}
                        onTouchEnd={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <Image 
                            src={opt} 
                            alt={`Opção ${i + 1}`} 
                            width={80} 
                            height={80}
                            style={{ 
                                width: '100%', 
                                height: 'auto',
                                borderRadius: '5px'
                            }}
                        />
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="stats-display" style={{ 
                display: 'flex',
                justifyContent: 'center',
                gap: 'clamp(1rem, 5vw, 2rem)',
                alignItems: 'center',
                fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
                fontWeight: 'bold',
                marginTop: 'auto',
                paddingBottom: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Star color="#ffc700" fill="#ffc700" size={20} /> {streak}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Trophy color="#ff9a00" fill="#ff9a00" size={20} /> {score}
                </div>
            </div>
        </div>
    );
};

const PhaseCompleteScreen = ({ onNextPhase, selectedPhase }: { onNextPhase: () => void, selectedPhase: number | null }) => (
    <div className="screen-container phase-complete-screen" style={{ 
        minHeight: '100vh', 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem'
    }}>
        <Image 
            src="/shadow-game/leo_abertura.webp" 
            alt="Léo Comemorando" 
            width={200} 
            height={200}
            style={{ 
                width: 'clamp(150px, 40vw, 250px)', 
                height: 'auto' 
            }}
        />
        <h2 className="main-title" style={{ 
            fontSize: 'clamp(1.8rem, 8vw, 3rem)',
            textAlign: 'center',
            margin: '0'
        }}>Fase Completa!</h2>
        <button 
            onClick={onNextPhase} 
            className="start-button"
            style={{
                fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                padding: 'clamp(0.8rem, 3vw, 1.2rem) clamp(1.5rem, 6vw, 2rem)',
                minWidth: '200px',
                maxWidth: '90vw'
            }}
        >
            {selectedPhase === 1 ? 'Ir para Fase 2' : 'Ir para a Fase Final'}
        </button>
    </div>
);

const GameCompleteScreen = ({ onPlayAgain, score }: { onPlayAgain: () => void, score: number }) => {
    const hasCelebrated = useRef(false);
    useEffect(() => {
        if (!hasCelebrated.current) {
            hasCelebrated.current = true;
        }
    }, []);
    
    return (
        <div className="screen-container game-complete-screen" style={{ 
            minHeight: '100vh', 
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem'
        }}>
            <ConfettiEffect />
            <h2 className="main-title" style={{ 
                fontSize: 'clamp(2rem, 10vw, 4rem)',
                textAlign: 'center',
                margin: '0'
            }}>CAMPEÃO!</h2>
            <Trophy 
                className="trophy-icon" 
                size={150}
                style={{ 
                    width: 'clamp(100px, 25vw, 200px)', 
                    height: 'auto' 
                }}
            />
            <p className="subtitle" style={{ 
                color: '#fff', 
                fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                textAlign: 'center',
                margin: '0'
            }}>Você é um Mestre das Sombras!</p>
            <p className="final-score" style={{ 
                fontSize: 'clamp(1.2rem, 5vw, 1.5rem)',
                textAlign: 'center',
                fontWeight: 'bold',
                margin: '0'
            }}>Pontuação Final: {score}</p>
            <button 
                onClick={onPlayAgain} 
                className="start-button"
                style={{
                    fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                    padding: 'clamp(0.8rem, 3vw, 1.2rem) clamp(1.5rem, 6vw, 2rem)',
                    minWidth: '200px',
                    maxWidth: '90vw'
                }}
            >
                Jogar Novamente
            </button>
        </div>
    );
};

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

    const playSynthSound = useCallback((type: SoundType) => {
        if (!soundEnabled || !audioContextRef.current) return;
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') { ctx.resume(); }
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        gainNode.connect(ctx.destination);
        oscillator.connect(gainNode);
        switch (type) {
            case 'correct':
                oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(600, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                oscillator.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
                break;
            case 'error':
                oscillator.type = 'square'; oscillator.frequency.setValueAtTime(200, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                oscillator.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.15);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
                break;
            case 'click':
                oscillator.type = 'triangle'; oscillator.frequency.setValueAtTime(800, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
                break;
            case 'combo':
                 oscillator.type = 'triangle'; gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                 [440, 550, 660, 880].forEach((freq, i) => { oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07); });
                 gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4);
                 break;
        }
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
    }, [soundEnabled]);
    
    const leoSpeak = useCallback((text: string, onEnd?: () => void) => {
        if (!soundEnabled || !audioManagerRef.current) { onEnd?.(); return; }
        audioManagerRef.current.falarLeo(text, onEnd);
    }, [soundEnabled]);
    
    const startNewRound = useCallback((phase: number) => {
        let availableImages = [...imageNames];
        const correctImage = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
        const wrong1 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
        const wrong2 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
        let roundType: RoundType = phase === 1 ? 'imageToShadow' : phase === 2 ? 'shadowToImage' : (Math.random() < 0.5 ? 'imageToShadow' : 'shadowToImage');
        let mainItem, correctAnswer, options;
        if (roundType === 'imageToShadow') {
            mainItem = `/shadow-game/images/${correctImage}.webp`;
            correctAnswer = `/shadow-game/shadows/${correctImage}_black.webp`;
            options = shuffleArray([correctAnswer, `/shadow-game/shadows/${wrong1}_black.webp`, `/shadow-game/shadows/${wrong2}_black.webp`]);
        } else {
            mainItem = `/shadow-game/shadows/${correctImage}_black.webp`;
            correctAnswer = `/shadow-game/images/${correctImage}.webp`;
            options = shuffleArray([correctAnswer, `/shadow-game/images/${wrong1}.webp`, `/shadow-game/images/${wrong2}.webp`]);
        }
        setRoundData({ mainItem, options, correctAnswer });
    }, []);

    // Handlers
    const handleStartIntro = async () => {
        if(isInteracting || !isReady) return;
        setIsInteracting(true);
        if (audioContextRef.current?.state === 'suspended') await audioContextRef.current.resume();
        if (audioManagerRef.current) await audioManagerRef.current.forceInitialize();
        playSynthSound('click');
        const fallback = setTimeout(() => { setIsInteracting(false); setGameState('instructions'); }, 4000);
        leoSpeak("Olá! Eu sou o Léo! Vamos jogar com sombras?", () => { clearTimeout(fallback); setIsInteracting(false); setGameState('instructions'); });
    };
    
    const handleNextInstruction = () => {
        playSynthSound('click');
        const fallback = setTimeout(() => setGameState('phase-selection'), 4000);
        leoSpeak("É super fácil! Clique na sombra certa para cada figura!", () => { clearTimeout(fallback); setGameState('phase-selection'); });
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
            if (newStreak % 5 === 0 && newStreak > 0) { setShowConfetti(true); playSynthSound('combo'); setTimeout(() => setShowConfetti(false), 2000); }
            if (newRoundCount >= ROUNDS_PER_PHASE) {
                if (selectedPhase === 3) { setGameState('gameComplete'); } 
                else { setGameState('phaseComplete'); }
                return;
            }
            const leoStreakPhrases: {[key:number]: string[]} = { 10: ["Aí sim, sequência de 10!", "Você tem olhar de águia! Já são 10!"], 20: ["Você é muito top, sequência de 20!", "Caramba! 20 acertos seguidos!", "Impossível, que sequência incrível!"] };
            const phrases = leoStreakPhrases[newStreak];
            if (phrases) { leoSpeak(phrases[Math.floor(Math.random() * phrases.length)]); }
            setTimeout(() => startNewRound(selectedPhase!), 300);
        } else {
            playSynthSound('error');
            setStreak(0);
            const errorPhrases = ["Ops, tente de novo!", "Essa não foi a certa, mas não desista!", "Quase! Tente a outra sombra."];
            leoSpeak(errorPhrases[Math.floor(Math.random() * errorPhrases.length)]);
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

    return (
        <main className="shadow-game-main" style={{
            width: '100vw',
            minHeight: '100vh',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {renderContent()}
        </main>
    );
}
