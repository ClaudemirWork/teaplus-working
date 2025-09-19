'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import './shadowgame.css';
import Image from 'next/image';
import { Volume2, VolumeX, Trophy, Star, ArrowLeft, Zap, Flame, Award, Crown, Medal } from 'lucide-react';
// A importação estática do GameAudioManager foi REMOVIDA daqui para ser importada dinamicamente.
// import { GameAudioManager } from '@/utils/gameAudioManager'; 
import type { GameAudioManager } from '@/utils/gameAudioManager'; // Importamos apenas o TIPO, o que é seguro.


// --- DADOS DO JOGO (Nomes das imagens) ---
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

type GameState = 'titleScreen' | 'introWelcome' | 'introExplanation' | 'phaseSelection' | 'playing';
type RoundType = 'imageToShadow' | 'shadowToImage';

export default function ShadowGamePage() {
    const [gameState, setGameState] = useState<GameState>('titleScreen');
    const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
    const [roundData, setRoundData] = useState<{ mainItem: string; options: string[]; correctAnswer: string; } | null>(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [pointsFeedback, setPointsFeedback] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({});
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [highScore, setHighScore] = useState(0);
    const [totalStars, setTotalStars] = useState(0);
    const [isInteracting, setIsInteracting] = useState(false);
    const [currentNarration, setCurrentNarration] = useState("");
    const [isReady, setIsReady] = useState(false); // NOVO ESTADO: controla se o jogo está pronto
    
    const audioManagerRef = useRef<GameAudioManager | null>(null);

    // CORREÇÃO: useEffect agora carrega o AudioManager dinamicamente
    useEffect(() => {
        const initialize = async () => {
            // Importa o AudioManager apenas no lado do cliente
            const { GameAudioManager } = await import('@/utils/gameAudioManager');
            audioManagerRef.current = GameAudioManager.getInstance();

            // O código de localStorage pode continuar aqui pois já está seguro
            const savedHighScore = localStorage.getItem('shadowGameHighScore');
            const savedStars = localStorage.getItem('shadowGameTotalStars');
            if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
            if (savedStars) setTotalStars(parseInt(savedStars, 10));

            // Avisa que o áudio e os dados estão prontos
            setIsReady(true);
        };

        initialize();
    }, []);

    const leoSpeak = useCallback((text: string, onEnd?: () => void) => {
        setCurrentNarration(text);
        audioManagerRef.current?.falarLeo(text, onEnd);
    }, []);

    const playSound = useCallback((soundName: string, volume: number = 0.5) => {
        audioManagerRef.current?.playSoundEffect(soundName, volume);
    }, []);
    
    useEffect(() => {
        if (gameState === 'introWelcome') {
            leoSpeak("Olá! Eu sou o Leo! Preparado para um desafio de detetive com sombras?", () => {
                setGameState('introExplanation');
            });
        } else if (gameState === 'introExplanation') {
            leoSpeak("É super fácil! Vou te mostrar uma figura, e você tem que achar a sombra certa. Vamos testar seus olhos de águia!", () => {
                setIsInteracting(false);
                setGameState('phaseSelection');
            });
        }
    }, [gameState, leoSpeak]);

    const handleIntro = useCallback(async () => {
        if (isInteracting || !isReady) return;
        setIsInteracting(true);
        playSound('click_start', 0.7);
        await audioManagerRef.current?.forceInitialize();
        setGameState('introWelcome');
    }, [isInteracting, isReady, playSound]);

    // O resto do código permanece o mesmo...

    const startNewRound = useCallback(/* ...código sem alterações... */);
    const handlePhaseSelect = useCallback(/* ...código sem alterações... */);
    const handleOptionClick = useCallback(/* ...código sem alterações... */);
    
    // --- RENDERIZAÇÃO ---
    
    const renderContent = () => {
        switch (gameState) {
            case 'titleScreen':
                return (
                    <div className="screen-container title-screen">
                        <div className="stars-bg"></div>
                        <div className="leo-container"> 
                            <Image src="/shadow-game/leo_abertura.webp" alt="Mascote Léo" width={300} height={300} priority />
                        </div>
                        <h1 className="main-title">Jogo das Sombras</h1>
                        <p className="subtitle">Associe cada imagem com sua sombra!</p>
                        {/* BOTÃO ATUALIZADO para esperar o áudio carregar */}
                        <button onClick={handleIntro} disabled={!isReady || isInteracting} className="start-button">
                            {!isReady ? 'Carregando Áudio...' : (isInteracting ? 'Aguarde...' : 'Começar a Jogar')}
                        </button>
                    </div>
                );
            // ...O resto dos `cases` de renderização permanece o mesmo
            case 'introWelcome':
            case 'introExplanation':
                 return (
                    <div className="screen-container explanation-screen">
                        <div className="stars-bg"></div>
                        <div className="leo-container">
                            <Image src="/shadow-game/leo_abertura.webp" alt="Mascote Léo" width={200} height={200} />
                        </div>
                        <div className="speech-bubble">
                            <p>{currentNarration || "Preparando..."}</p>
                        </div>
                    </div>
                );
            case 'phaseSelection':
                return (
                    <div className="screen-container phase-selection-screen">
                        <h2>Escolha seu Desafio!</h2>
                        <div className="phase-container">
                            <button onClick={() => handlePhaseSelect(1)} disabled={isInteracting} className="phase-button phase-1">
                                <h3>Fase 1: Detetive Júnior</h3>
                                <p>Encontre a sombra correta para cada imagem.</p>
                            </button>
                            <button onClick={() => handlePhaseSelect(2)} disabled={isInteracting} className="phase-button phase-2">
                                <h3>Fase 2: Mestre das Sombras</h3>
                                <p>Encontre a imagem correta para cada sombra.</p>
                            </button>
                            <button onClick={() => handlePhaseSelect(3)} disabled={isInteracting} className="phase-button phase-3">
                                <h3>Fase 3: Desafio Final!</h3>
                                <p>Tudo misturado para testar suas habilidades!</p>
                            </button>
                        </div>
                    </div>
                );
            case 'playing':
                if (!roundData) return <div>Carregando...</div>;
                const comboIcons: { [key: string]: React.ElementType } = { '20': Crown, '15': Award, '10': Medal, '5': Flame, '2': Zap };
                const comboLevel = Object.keys(comboIcons).reverse().find(key => streak >= parseInt(key)) || '1';
                const ComboIcon = comboIcons[comboLevel] || Star;

                return (
                    <div className="playing-screen">
                        <div className="top-bar">
                            <button onClick={() => setGameState('phaseSelection')} className="back-button"><ArrowLeft size={20} /> Fases</button>
                            <div className="score-display"><Trophy size={20} /> {score}</div>
                            <button onClick={() => setSoundEnabled(!soundEnabled)} className="sound-button">
                                {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                            </button>
                        </div>
                        {pointsFeedback && <div className="points-feedback fade-out-up">{pointsFeedback}</div>}
                        <div className="main-item-container">
                            <Image src={roundData.mainItem} alt="Item principal" width={250} height={250} />
                        </div>
                        <div className="options-container">
                            {roundData.options.map((optionSrc, index) => (
                                <button
                                    key={index}
                                    className={`option-button ${feedback[optionSrc] || ''}`}
                                    onClick={() => handleOptionClick(optionSrc)}
                                >
                                    <Image src={optionSrc} alt={`Opção ${index + 1}`} width={100} height={100} />
                                </button>
                            ))}
                        </div>
                        <div className="streak-display">
                            Combo: <ComboIcon className="combo-icon" /> {streak}x
                        </div>
                    </div>
                );
            default:
                return <p>Carregando...</p>;
        }
    };

    return <main className="shadow-game-main">{renderContent()}</main>;
}
