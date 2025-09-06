'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BookText, Star } from 'lucide-react';

// --- INTERFACES ---
interface Card {
    id: string;
    displayLabel: string;
    image: string;
    category: 'personagens' | 'acoes' | 'objetos' | 'lugares' | 'tempo' | 'emocoes';
    sentenceLabel?: string; 
    characterType?: 'human' | 'animal';
    person?: 'eu' | 'voce' | 'ele_ela';
    compatibleWithTypes?: ('human' | 'animal')[];
    verb?: {
        infinitive: string;
        preposition?: string;
    };
}

interface Level {
    level: number;
    name: string;
    phrasesToComplete: number;
    structure: Card['category'][];
}

// --- MOTOR GRAMATICAL ---
const conjugateVerb = (infinitive: string, person: 'eu' | 'voce' | 'ele_ela'): string => {
    const irregulars: { [key: string]: { [key: string]: string } } = {
        'ler': { eu: 'leio', voce: 'lê', ele_ela: 'lê' },
        'ver': { eu: 'vejo', voce: 'vê', ele_ela: 'vê' },
        'ir': { eu: 'vou', voce: 'vai', ele_ela: 'vai' }
    };

    if (irregulars[infinitive]) {
        return irregulars[infinitive][person];
    }
    const ending = infinitive.slice(-2);
    const root = infinitive.slice(0, -2);
    if (ending === 'ar') {
        if (person === 'eu') return root + 'o';
        if (person === 'voce' || person === 'ele_ela') return root + 'a';
    }
    if (ending === 'er') {
        if (person === 'eu') return root + 'o';
        if (person === 'voce' || person === 'ele_ela') return root + 'e';
    }
    if (ending === 'ir') {
        if (person === 'eu') return root + 'o';
        if (person === 'voce' || person === 'ele_ela') return root + 'e';
    }
    return infinitive; 
};

// --- BANCO DE CARDS ---
const allCards: { [key in Card['category']]: Card[] } = {
    personagens: [
        { id: 'eu_homem', displayLabel: 'Eu', sentenceLabel: 'eu', image: '/narrative_cards/personagens/eu_homem.webp', category: 'personagens', characterType: 'human', person: 'eu' },
        { id: 'gatinho', displayLabel: 'Gatinho', sentenceLabel: 'o gatinho', image: '/narrative_cards/personagens/gatinho.webp', category: 'personagens', characterType: 'animal', person: 'ele_ela' },
        { id: 'professora', displayLabel: 'Professora', sentenceLabel: 'a professora', image: '/narrative_cards/personagens/professora.webp', category: 'personagens', characterType: 'human', person: 'ele_ela' },
        { id: 'medico', displayLabel: 'Médico', sentenceLabel: 'o médico', image: '/narrative_cards/personagens/medico.webp', category: 'personagens', characterType: 'human', person: 'ele_ela' },
    ],
    acoes: [
        { id: 'comer', displayLabel: 'Comer', image: '/narrative_cards/acoes/comer.webp', category: 'acoes', compatibleWithTypes: ['human', 'animal'], verb: { infinitive: 'comer' } },
        { id: 'brincar', displayLabel: 'Brincar', image: '/narrative_cards/acoes/brincar.webp', category: 'acoes', compatibleWithTypes: ['human', 'animal'], verb: { infinitive: 'brincar', preposition: 'com' } },
        { id: 'ler', displayLabel: 'Ler', image: '/narrative_cards/acoes/ler_livro.webp', category: 'acoes', compatibleWithTypes: ['human'], verb: { infinitive: 'ler' } },
    ],
    objetos: [
        { id: 'bola', displayLabel: 'Bola', sentenceLabel: 'a bola', image: '/narrative_cards/objetos/bola_praia.webp', category: 'objetos' },
        { id: 'livro', displayLabel: 'Livro', sentenceLabel: 'o livro', image: '/narrative_cards/objetos/livro.webp', category: 'objetos' },
    ],
    lugares: [], emocoes: [], tempo: []
};

// --- NÍVEIS ---
const gameLevels: Level[] = [
    { level: 1, name: "Primeiras Frases", phrasesToComplete: 10, structure: ['personagens', 'acoes'] },
    { level: 2, name: "O Que Acontece?", phrasesToComplete: 15, structure: ['personagens', 'acoes', 'objetos'] },
];

const Confetti = () => (
    <div className="confetti-container">
        {[...Array(50)].map((_, i) => <div key={i} className={`confetti-piece piece-${i % 5}`} />)}
    </div>
);

// --- COMPONENTE PRINCIPAL DO JOGO ---
export default function HistoriasEpicasGame() {
    const [gameState, setGameState] = useState<'titleScreen' | 'playing' | 'phraseComplete' | 'levelComplete' | 'gameOver'>('titleScreen');
    const [leoMessage, setLeoMessage] = useState('');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [phrasesCompletedInLevel, setPhrasesCompletedInLevel] = useState(0);
    const [currentPhrase, setCurrentPhrase] = useState<Card[]>([]);
    const [cardOptions, setCardOptions] = useState<Card[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showStarReward, setShowStarReward] = useState(false);

    const leoSpeak = useCallback((message: string) => {
        setLeoMessage(message);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const generateCardOptions = useCallback((category: Card['category'], previousCard?: Card) => {
        let potentialCards = allCards[category];
        if (category === 'acoes' && previousCard?.category === 'personagens') {
            potentialCards = potentialCards.filter(actionCard => 
                actionCard.compatibleWithTypes?.includes(previousCard.characterType!)
            );
        }
        const shuffled = [...potentialCards].sort(() => 0.5 - Math.random());
        setCardOptions(shuffled.slice(0, 4));
    }, []);
    
    const buildSentence = useCallback((phrase: Card[], isComplete: boolean = false): string => {
        if (phrase.length === 0) return "";
        const subject = phrase.find(c => c.category === 'personagens');
        const action = phrase.find(c => c.category === 'acoes');
        const object = phrase.find(c => c.category === 'objetos');
        if (!subject) return "";
        let sentence = subject.sentenceLabel || "";
        if (action?.verb) {
            const conjugated = conjugateVerb(action.verb.infinitive, subject.person!);
            sentence += ` ${conjugated}`;
            if (action.verb.preposition && object) {
                sentence += ` ${action.verb.preposition}`;
            }
        }
        if (object?.sentenceLabel) {
            sentence += ` ${object.sentenceLabel}`;
        }
        let formattedSentence = sentence.trim();
        formattedSentence = formattedSentence.charAt(0).toUpperCase() + formattedSentence.slice(1);
        return isComplete ? formattedSentence + "." : formattedSentence;
    }, [currentLevelIndex]);

    const loadNewPhrase = useCallback((levelIdx: number) => {
        const level = gameLevels[levelIdx];
        setCurrentPhrase([]);
        setGameState('playing');
        generateCardOptions(level.structure[0]);
        leoSpeak(`Nível ${level.level}: ${level.name}. Vamos começar!`);
    }, [generateCardOptions, leoSpeak]);

    const startGame = useCallback(() => {
        setCurrentLevelIndex(0);
        setPhrasesCompletedInLevel(0);
        loadNewPhrase(0);
    }, [loadNewPhrase]);

    const handleStartGame = () => {
        setGameState('playing');
        startGame();
    };
    
    const handleCardSelection = (card: Card) => {
        if (gameState !== 'playing') return;
        const newPhrase = [...currentPhrase, card];
        setCurrentPhrase(newPhrase);
        const nextStepIndex = newPhrase.length;
        const currentLevel = gameLevels[currentLevelIndex];

        if (nextStepIndex >= currentLevel.structure.length) {
            const newCount = phrasesCompletedInLevel + 1;
            setGameState('phraseComplete');
            const finalSentence = buildSentence(newPhrase, true);
            leoSpeak(`Você formou: "${finalSentence}"! Ganhou uma estrela!`);
            setPhrasesCompletedInLevel(newCount);
            setShowConfetti(true);
            try {
                const successSound = new Audio('/sounds/success.mp3');
                successSound.play();
            } catch (error) {
                console.error("Erro ao tocar o som:", error);
            }
            setTimeout(() => setShowConfetti(false), 3000);
            if (newCount > 0 && newCount % 3 === 0) {
                setShowStarReward(true);
            }
        } else {
            const nextCategory = currentLevel.structure[nextStepIndex];
            generateCardOptions(nextCategory, card);
            leoSpeak("Perfeito! E agora?");
        }
    };

    const handleNext = () => {
        const currentLevel = gameLevels[currentLevelIndex];
        if (phrasesCompletedInLevel >= currentLevel.phrasesToComplete) {
            const nextLevelIndex = currentLevelIndex + 1;
            if (nextLevelIndex < gameLevels.length) {
                setCurrentLevelIndex(nextLevelIndex);
                setPhrasesCompletedInLevel(0);
                setGameState('levelComplete');
                leoSpeak(`Incrível! Você completou o nível ${currentLevel.name}!`);
                setTimeout(() => loadNewPhrase(nextLevelIndex), 3000);
            } else {
                setGameState('gameOver');
                leoSpeak("Parabéns! Você completou o jogo!");
            }
        } else {
            loadNewPhrase(currentLevelIndex);
        }
    };

    const renderTitleScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-yellow-200 via-orange-300 to-amber-400 overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center text-white">
                <div className="mb-4">
                    <Image src="/images/mascotes/leo/leo_feliz_resultado.webp" alt="Leo, o Leão Amigável" width={400} height={400} className="w-[250px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl" priority/>
                </div>
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-orange-900/80 drop-shadow-lg" style={{ fontFamily: "'Comic Sans MS', 'cursive', 'sans-serif'"}}>Histórias Épicas</h1>
                <p className="text-xl sm:text-2xl text-orange-900/70 mt-4 mb-10 drop-shadow-md">Uma aventura de criar e aprender</p>
                <button onClick={handleStartGame} className="text-xl font-bold text-white bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full px-12 py-5 shadow-xl transition-transform duration-300 ease-in-out hover:scale-105">Começar a Brincar</button>
            </div>
        </div>
    );
    
    const renderStarReward = () => (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={() => setShowStarReward(false)}>
            <div className="text-yellow-400 star-reward-animate">
                <Star size={200} fill="currentColor" />
                <p className="text-white text-3xl font-bold text-center mt-4">Parabéns!</p>
            </div>
        </div>
    );
    
    const renderGame = () => {
        const level = gameLevels[currentLevelIndex];
        if (!level) return <div>Carregando nível...</div>;
        const progressPercentage = (phrasesCompletedInLevel / level.phrasesToComplete) * 100;
        const displayedSentence = buildSentence(currentPhrase, false);

        return (
            <div className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200">
                {showConfetti && <Confetti />}
                {showStarReward && renderStarReward()}
                <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl w-full max-w-6xl mx-auto border-4 border-violet-300">
                    <div className="mb-4">
                        <div className="flex justify-between items-center text-purple-700 font-bold text-lg md:text-xl mb-2">
                            <div><BookText size={24} className="inline-block mr-2"/> Fase {level.level}: {level.name}</div>
                            <div className="flex items-center gap-1 text-yellow-500"><Star size={24}/> {phrasesCompletedInLevel} / {level.phrasesToComplete}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner"><div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl mb-6 border-2 border-yellow-300 min-h-[100px] flex items-center justify-center text-center shadow-inner">
                        <p className="text-2xl md:text-4xl text-purple-800 font-bold leading-relaxed">{displayedSentence || "..."}</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 my-6 justify-center">
                        <div className="relative bg-white p-4 rounded-lg shadow-md flex-1 text-center min-h-[80px] flex items-center justify-center">
                            <p className="text-lg md:text-xl font-medium text-gray-800">{leoMessage}</p>
                        </div>
                    </div>
                    {(gameState === 'playing') ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                            {cardOptions.map(card => (
                                <button key={card.id} onClick={() => handleCardSelection(card)} className="p-3 bg-white rounded-xl shadow-lg border-2 border-purple-200 hover:border-purple-500 hover:scale-105 transition-transform">
                                    <div className="aspect-square relative rounded-md overflow-hidden"><Image src={card.image} alt={card.displayLabel} fill sizes="25vw" className="object-contain p-1"/></div>
                                    <p className="mt-2 text-center font-bold text-sm md:text-base text-gray-800">{card.displayLabel}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                         <div className='text-center mt-8'>
                             <button onClick={handleNext} className="px-10 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-xl rounded-full shadow-xl hover:scale-105 transition-transform">
                                 {gameState === 'levelComplete' ? 'Próximo Nível!' : gameState === 'gameOver' ? 'Jogar Novamente' : 'Próxima Frase!'}
                             </button>
                         </div>
                    )}
                </div>
            </div>
        );
    }
    
    const renderContent = () => {
        switch (gameState) {
            case 'titleScreen': return renderTitleScreen();
            default: return renderGame();
        }
    };
    
    return (
        <>
            {renderContent()}
            <style jsx global>{`
                /* ESTILOS PARA OS CONFETES */
                .confetti-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100; }
                .confetti-piece { position: absolute; width: 10px; height: 20px; background: #f00; top: -20px; animation: fall 3s linear infinite; }
                .piece-0 { background: #ffD700; } .piece-1 { background: #00c4ff; }
                .piece-2 { background: #ff007c; } .piece-3 { background: #00ff8c; }
                .piece-4 { background: #ff6c00; }
                @keyframes fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }
                ${[...Array(50)].map((_, i) => `.confetti-piece:nth-child(${i+1}) { left: ${Math.random()*100}%; animation-delay: ${Math.random()*3}s; }`).join('')}
                /* ANIMAÇÃO PARA A ESTRELA GRANDE */
                .star-reward-animate { animation: star-pop 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; }
                @keyframes star-pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </>
    );
}

