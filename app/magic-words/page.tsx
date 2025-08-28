'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Interfaces ---
interface Card {
  id: string;
  label: string;
  image: string;
  category: string;
}

interface Phase {
  cards: number;
  rounds: number;
  name: string;
}

// --- BANCO COMPLETO DE CARDS (Seu banco original, intacto) ---
const allCardsData: Card[] = [
    // ... (SEUS 690+ CARDS VÊM AQUI - O código é muito longo para colar, mas use o seu original)
    // Exemplo:
    { id: 'pensar', label: 'Pensar', image: '/images/cards/acoes/Pensar.webp', category: 'acoes' },
    { id: 'abracar', label: 'Abraçar', image: '/images/cards/acoes/abraçar.webp', category: 'acoes' },
    // ... etc
];

// --- Configuração do jogo (Sua configuração original) ---
const gameConfig = {
  phases: [
    { cards: 4, rounds: 5, name: "Tradutor Iniciante" },
    { cards: 6, rounds: 7, name: "Intérprete Aprendiz" },
    { cards: 9, rounds: 10, name: "Mestre dos Gestos" },
    { cards: 12, rounds: 12, name: "Feiticeiro das Palavras" }
  ] as Phase[],
  cards: allCardsData,
  npcNames: ['Maria', 'João', 'Ana', 'Lucas', 'Sofia', 'Pedro']
};

export default function MagicWordsGame() {
    const router = useRouter();
    const audioContextRef = useRef<AudioContext | null>(null);

    // --- ESTADOS DO JOGO (ATUALIZADO PARA O FLUXO COMPLETO) ---
    const [gameState, setGameState] = useState<'titleScreen' | 'intro' | 'playing' | 'gameOver' | 'victory'>('titleScreen');
    const [introStep, setIntroStep] = useState(0);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isUiBlocked, setIsUiBlocked] = useState(false);
    const [roundsCompleted, setRoundsCompleted] = useState(0);
    const [currentCards, setCurrentCards] = useState<Card[]>([]);
    const [correctCard, setCorrectCard] = useState<Card | null>(null);
    const [npcName, setNpcName] = useState('Maria');
    const [cardFeedback, setCardFeedback] = useState<{ [key: string]: 'correct' | 'wrong' }>({});
    const [milaMessage, setMilaMessage] = useState("");
    const [showVictoryModal, setShowVictoryModal] = useState(false);
    const [showGameOverModal, setShowGameOverModal] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(true);

    // --- NOVAS MENSAGENS DA INTRODUÇÃO ---
    const introMessages = [
        "Olá, sou a Mila, a feiticeira que protege o reino mágico das palavras.",
        "Porém, um bruxo do mal, lançou um feitiço e fez com que todos aqui da vila, perdessem a voz. Preciso de sua ajuda, para devolver a voz a todos os habitantes da vila.",
        "Para isto, basta seguir minhas instruções, e encontrar os cartões com as palavras que cada habitante perdeu, e ao clicar sobre ela, acertando, imediatamente devolve a voz para a pessoa.",
        "Se acertar e passar de fase, terminando o jogo, o encanto é quebrado, e você devolve a voz para todos na vila.",
        "Vamos começar comigo esta aventura?"
    ];

    const milaSpeak = useCallback((message: string) => {
        setMilaMessage(message);
        if (isSoundOn && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }, [isSoundOn]);

    // --- Sua lógica de jogo original ---
    // ... (useEffect de áudio, playSound, etc. - mantidos como no seu código)

    const startGame = useCallback(() => {
        setGameState('playing');
        setCurrentPhaseIndex(0);
        setScore(0);
        setRoundsCompleted(0);
        setLives(3);
        setShowGameOverModal(false);
        setShowVictoryModal(false);
        milaSpeak(`Vamos começar! Preste atenção!`);
        setTimeout(() => nextRound(0), 1500);
    }, [milaSpeak]);
    
    // ... (Restante da sua lógica: nextRound, handleCardClick, etc., intacta)

    // --- NOVAS FUNÇÕES DE CONTROLE DE FLUXO ---
    const handleStartIntro = () => {
        setGameState('intro');
        milaSpeak(introMessages[0]);
    };

    const handleIntroNext = () => {
        const nextStep = introStep + 1;
        if (nextStep < introMessages.length) {
            setIntroStep(nextStep);
            milaSpeak(introMessages[nextStep]);
        } else {
            startGame();
        }
    };

    // --- COMPONENTES DE RENDERIZAÇÃO ---

    const renderTitleScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center bg-gradient-to-b from-[#2a0c42] to-[#6d1d61] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full particles-bg animate-zoom"></div>
            <div className="relative z-10 flex flex-col items-center text-center text-white animate-fade-in">
                <div className="animate-float">
                    <Image
                        src="/images/mascotes/mila/mila_feiticeira_resultado.webp"
                        alt="Mila Feiticeira"
                        width={380} height={380}
                        className="w-[220px] h-auto sm:w-[320px] md:w-[380px] drop-shadow-2xl mb-[-25px]"
                        priority
                    />
                </div>
                <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-bold text-pink-300 title-text-shadow-magic tracking-wider">
                    Palavras Mágicas
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 mt-4 mb-10 drop-shadow-md">
                    Ajude a quebrar o feitiço e devolver a voz ao reino!
                </p>
                <button 
                    onClick={handleStartIntro}
                    className="text-xl font-bold text-[#2a0c42] bg-gradient-to-r from-pink-400 to-purple-400 rounded-full px-10 py-4 shadow-lg cta-shadow-magic transition-transform duration-300 ease-in-out hover:scale-105 animate-pulse-magic"
                >
                    Começar Aventura
                </button>
            </div>
        </div>
    );
    
    const renderIntro = () => (
        <div className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-300 via-pink-200 to-orange-200">
            <div className="relative z-10 flex flex-col items-center text-center p-6 bg-white/95 rounded-3xl shadow-2xl max-w-xl mx-auto border-4 border-pink-400 animate-scale-in">
                <div className="w-48 h-auto drop-shadow-xl mb-4">
                    <Image src="/images/mascotes/mila/mila_feiticeira_resultado.webp" alt="Mila Feiticeira" width={200} height={200} className="w-full h-full object-contain" priority/>
                </div>
                <h1 className="text-3xl font-bold text-purple-600 mb-4">A Missão Mágica</h1>
                <p className="text-base text-gray-700 mb-8 min-h-[120px] flex items-center justify-center">{milaMessage}</p>
                <button onClick={handleIntroNext} className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                    {introStep < introMessages.length - 1 ? 'Continuar →' : 'Vamos Começar!'}
                </button>
            </div>
        </div>
    );

    const renderGame = () => (
        // AQUI ENTRA TODO O JSX DO SEU JOGO ORIGINAL
        // (o div principal, o header, a área de cards, os modais, a mila falante, etc.)
        <div className="min-h-screen bg-gradient-to-b from-sky-200 via-violet-200 to-pink-200 relative overflow-hidden">
            {/* ... Todo o seu código de renderização do jogo vai aqui ... */}
        </div>
    );
    
    const renderContent = () => {
        switch (gameState) {
            case 'titleScreen':
                return renderTitleScreen();
            case 'intro':
                return renderIntro();
            default: // 'playing', 'gameOver', 'victory'
                return renderGame();
        }
    };

    return (
        <>
            {renderContent()}
            {/* Estilos para a Abertura e a Introdução */}
            <style jsx global>{`
                /* ... (Cole aqui os estilos CSS da resposta anterior para .font-display, .particles-bg, animações, etc.) ... */
            `}</style>
            {/* Seus estilos originais para o jogo */}
            <style jsx>{`
                /* ... (Cole aqui o seu @keyframes shake, etc.) ... */
            `}</style>
        </>
    );
}
