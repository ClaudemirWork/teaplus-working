'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BookText, Star } from 'lucide-react';

// --- INTERFACES ATUALIZADAS E MAIS INTELIGENTES ---
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

// --- FUNÇÃO DE CONJUGAÇÃO VERBAL (O MOTOR GRAMATICAL) ---
const conjugateVerb = (infinitive: string, person: 'eu' | 'voce' | 'ele_ela'): string => {
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

// --- BANCO DE CARDS COM A NOVA ESTRUTURA INTELIGENTE ---
// Lembre-se de preencher esta lista com todos os seus cards!
const allCards: { [key in Card['category']]: Card[] } = {
    personagens: [
        { id: 'eu_homem', displayLabel: 'Eu', sentenceLabel: 'eu', image: '/narrative_cards/personagens/eu_homem.webp', category: 'personagens', characterType: 'human', person: 'eu' },
        { id: 'gatinho', displayLabel: 'Gatinho', sentenceLabel: 'o gatinho', image: '/narrative_cards/personagens/gatinho.webp', category: 'personagens', characterType: 'animal', person: 'ele_ela' },
        { id: 'cachorro', displayLabel: 'Cachorro', sentenceLabel: 'o cachorro', image: '/narrative_cards/personagens/cachorro.webp', category: 'personagens', characterType: 'animal', person: 'ele_ela' },
        { id: 'professora', displayLabel: 'Professora', sentenceLabel: 'a professora', image: '/narrative_cards/personagens/professora.webp', category: 'personagens', characterType: 'human', person: 'ele_ela' },
        { id: 'medico', displayLabel: 'Médico', sentenceLabel: 'o médico', image: '/narrative_cards/personagens/medico.webp', category: 'personagens', characterType: 'human', person: 'ele_ela' },
    ],
    acoes: [
        { id: 'comer', displayLabel: 'Comer', image: '/narrative_cards/acoes/comer.webp', category: 'acoes', compatibleWithTypes: ['human', 'animal'], verb: { infinitive: 'comer' } },
        { id: 'brincar', displayLabel: 'Brincar', image: '/narrative_cards/acoes/brincar.webp', category: 'acoes', compatibleWithTypes: ['human', 'animal'], verb: { infinitive: 'brincar', preposition: 'com' } },
        { id: 'ler', displayLabel: 'Ler', image: '/narrative_cards/acoes/ler_livro.webp', category: 'acoes', compatibleWithTypes: ['human'], verb: { infinitive: 'ler' } },
        { id: 'estudar', displayLabel: 'Estudar', image: '/narrative_cards/acoes/estudar.webp', category: 'acoes', compatibleWithTypes: ['human'], verb: { infinitive: 'estudar' } },
        { id: 'dormir', displayLabel: 'Dormir', image: '/narrative_cards/acoes/dormir_lado.webp', category: 'acoes', compatibleWithTypes: ['human', 'animal'], verb: { infinitive: 'dormir' } },
        { id: 'correr', displayLabel: 'Correr', image: '/narrative_cards/acoes/correr.webp', category: 'acoes', compatibleWithTypes: ['human', 'animal'], verb: { infinitive: 'correr' } },
    ],
    objetos: [
        { id: 'bola', displayLabel: 'Bola', sentenceLabel: 'a bola', image: '/narrative_cards/objetos/bola_praia.webp', category: 'objetos' },
        { id: 'livro', displayLabel: 'Livro', sentenceLabel: 'o livro', image: '/narrative_cards/objetos/livro.webp', category: 'objetos' },
        { id: 'hamburguer', displayLabel: 'Hambúrguer', sentenceLabel: 'o hambúrguer', image: '/narrative_cards/objetos/hamburguer_fritas.webp', category: 'objetos' },
    ],
    lugares: [
        { id: 'escola', displayLabel: 'Escola', sentenceLabel: 'na escola', image: '/narrative_cards/lugares/escola.webp', category: 'lugares' },
        { id: 'casa', displayLabel: 'Casa', sentenceLabel: 'em casa', image: '/narrative_cards/lugares/casa.webp', category: 'lugares' },
    ],
    emocoes: [],
    tempo: [],
};

const gameLevels: Level[] = [
    { level: 1, name: "Primeiras Frases", phrasesToComplete: 10, structure: ['personagens', 'acoes'] },
    { level: 2, name: "O Que Acontece?", phrasesToComplete: 15, structure: ['personagens', 'acoes', 'objetos'] },
];

export default function HistoriasEpicasGame() {
    const [gameState, setGameState] = useState<'titleScreen' | 'playing' | 'phraseComplete' | 'levelComplete' | 'gameOver'>('titleScreen');
    const [leoMessage, setLeoMessage] = useState('');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [phrasesCompletedInLevel, setPhrasesCompletedInLevel] = useState(0);
    const [currentPhrase, setCurrentPhrase] = useState<Card[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [cardOptions, setCardOptions] = useState<Card[]>([]);

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
            if (action.verb.preposition) {
                sentence += ` ${action.verb.preposition}`;
            }
        }
        
        if (object?.sentenceLabel) {
            sentence += ` ${object.sentenceLabel}`;
        }

        let formattedSentence = sentence.trim();
        formattedSentence = formattedSentence.charAt(0).toUpperCase() + formattedSentence.slice(1);
        
        if (isComplete) {
            return formattedSentence + ".";
        }
        
        return formattedSentence;
    }, []);

    const loadNewPhrase = useCallback((levelIdx: number) => {
        const level = gameLevels[levelIdx];
        setCurrentPhrase([]);
        setCurrentStepIndex(0);
        setGameState('playing');
        generateCardOptions(level.structure[0]);
        leoSpeak(`Nível ${level.level}: ${level.name}. Vamos começar!`);
    }, [generateCardOptions]);

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
        const nextStepIndex = currentStepIndex + 1;
        const currentLevel = gameLevels[currentLevelIndex];

        if (nextStepIndex >= currentLevel.structure.length) {
            setGameState('phraseComplete');
            const finalSentence = buildSentence(newPhrase, true);
            leoSpeak(`Você formou: "${finalSentence}"! Ganhou uma estrela!`);
            setPhrasesCompletedInLevel(prev => prev + 1);
        } else {
            setCurrentStepIndex(nextStepIndex);
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
                    <Image 
                        src="/images/mascotes/leo/leo_feliz_resultado.webp" 
                        alt="Leo, o Leão Amigável" 
                        width={400} 
                        height={400} 
                        className="w-[250px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl" 
                        priority
                    />
                </div>
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-orange-900/80 drop-shadow-lg" style={{ fontFamily: "'Comic Sans MS', 'cursive', 'sans-serif'"}}>
                    Histórias Épicas
                </h1>
                <p className="text-xl sm:text-2xl text-orange-900/70 mt-4 mb-10 drop-shadow-md">
                    Uma aventura de criar e aprender
                </p>
                <button onClick={handleStartGame} className="text-xl font-bold text-white bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full px-12 py-5 shadow-xl transition-transform duration-300 ease-in-out hover:scale-105">
                    Começar a Brincar
                </button>
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
                <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl w-full max-w-6xl mx-auto border-4 border-violet-300">
                    <div className="mb-4">
                        <div className="flex justify-between items-center text-purple-700 font-bold text-lg md:text-xl mb-2">
                            <div><BookText size={24} className="inline-block mr-2"/> Fase {level.level}: {level.name}</div>
                            <div className="flex items-center gap-1 text-yellow-500"><Star size={24}/> {phrasesCompletedInLevel} / {level.phrasesToComplete}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner"><div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl mb-6 border-2 border-yellow-300 min-h-[100px] flex items-center justify-center text-center shadow-inner">
                        <p className="text-2xl md:text-4xl text-purple-800 font-bold leading-relaxed">
                            {displayedSentence || "..."}
                        </p>
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
        </>
    );
}
