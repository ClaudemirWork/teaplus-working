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
        requiresObject?: boolean;
        withPreposition?: string;
    };
    objectType?: string;
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
        'ir': { eu: 'vou', voce: 'vai', ele_ela: 'vai' },
        'ser': { eu: 'sou', voce: 'é', ele_ela: 'é' },
        'estar': { eu: 'estou', voce: 'está', ele_ela: 'está' },
        'ter': { eu: 'tenho', voce: 'tem', ele_ela: 'tem' }
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

// --- BANCO DE CARDS COM IMAGENS CORRETAS ---
const allCards: { [key in Card['category']]: Card[] } = {
    personagens: [
        { 
            id: 'eu_homem', 
            displayLabel: 'Eu', 
            sentenceLabel: 'Eu', 
            image: '/narrative_cards/personagens/eu_homem.webp', 
            category: 'personagens', 
            characterType: 'human', 
            person: 'eu' 
        },
        { 
            id: 'cachorro', 
            displayLabel: 'Cachorro', 
            sentenceLabel: 'O cachorro', 
            image: '/narrative_cards/personagens/cachorro.webp', 
            category: 'personagens', 
            characterType: 'animal', 
            person: 'ele_ela' 
        },
        { 
            id: 'gatinho', 
            displayLabel: 'Gatinho', 
            sentenceLabel: 'O gatinho', 
            image: '/narrative_cards/personagens/gatinho.webp', 
            category: 'personagens', 
            characterType: 'animal', 
            person: 'ele_ela' 
        },
        { 
            id: 'professora', 
            displayLabel: 'Professora', 
            sentenceLabel: 'A professora', 
            image: '/narrative_cards/personagens/professora.webp', 
            category: 'personagens', 
            characterType: 'human', 
            person: 'ele_ela' 
        },
        { 
            id: 'medico', 
            displayLabel: 'Médico', 
            sentenceLabel: 'O médico', 
            image: '/narrative_cards/personagens/medico.webp', 
            category: 'personagens', 
            characterType: 'human', 
            person: 'ele_ela' 
        },
        { 
            id: 'filho', 
            displayLabel: 'Menino', 
            sentenceLabel: 'O menino', 
            image: '/narrative_cards/personagens/filho.webp', 
            category: 'personagens', 
            characterType: 'human', 
            person: 'ele_ela' 
        },
        { 
            id: 'filha', 
            displayLabel: 'Menina', 
            sentenceLabel: 'A menina', 
            image: '/narrative_cards/personagens/filha.webp', 
            category: 'personagens', 
            characterType: 'human', 
            person: 'ele_ela' 
        }
    ],
    acoes: [
        { 
            id: 'comer', 
            displayLabel: 'Comer', 
            image: '/narrative_cards/acoes/comer.webp', 
            category: 'acoes', 
            compatibleWithTypes: ['human', 'animal'], 
            verb: { 
                infinitive: 'comer',
                requiresObject: false 
            } 
        },
        { 
            id: 'brincar', 
            displayLabel: 'Brincar', 
            image: '/narrative_cards/acoes/brincar.webp', 
            category: 'acoes', 
            compatibleWithTypes: ['human', 'animal'], 
            verb: { 
                infinitive: 'brincar',
                requiresObject: false,
                withPreposition: 'com'
            } 
        },
        { 
            id: 'ler', 
            displayLabel: 'Ler', 
            image: '/narrative_cards/acoes/ler_livro.webp', 
            category: 'acoes', 
            compatibleWithTypes: ['human'], 
            verb: { 
                infinitive: 'ler',
                requiresObject: false 
            } 
        },
        { 
            id: 'dormir', 
            displayLabel: 'Dormir', 
            image: '/narrative_cards/acoes/dormir_lado.webp', 
            category: 'acoes', 
            compatibleWithTypes: ['human', 'animal'], 
            verb: { 
                infinitive: 'dormir',
                requiresObject: false 
            } 
        },
        { 
            id: 'correr', 
            displayLabel: 'Correr', 
            image: '/narrative_cards/acoes/correr.webp', 
            category: 'acoes', 
            compatibleWithTypes: ['human', 'animal'], 
            verb: { 
                infinitive: 'correr',
                requiresObject: false 
            } 
        },
        { 
            id: 'estudar', 
            displayLabel: 'Estudar', 
            image: '/narrative_cards/acoes/estudar.webp', 
            category: 'acoes', 
            compatibleWithTypes: ['human'], 
            verb: { 
                infinitive: 'estudar',
                requiresObject: false 
            } 
        }
    ],
    objetos: [
        { 
            id: 'bola', 
            displayLabel: 'Bola', 
            sentenceLabel: 'a bola', 
            image: '/narrative_cards/objetos/bola_praia.webp', 
            category: 'objetos',
            objectType: 'brinquedo'
        },
        { 
            id: 'papel', 
            displayLabel: 'Papel', 
            sentenceLabel: 'o papel', 
            image: '/narrative_cards/objetos/papel_lapis.webp', 
            category: 'objetos',
            objectType: 'leitura'
        },
        { 
            id: 'pizza', 
            displayLabel: 'Pizza', 
            sentenceLabel: 'a pizza', 
            image: '/narrative_cards/objetos/pizza.webp', 
            category: 'objetos',
            objectType: 'comida'
        },
        { 
            id: 'carrinho', 
            displayLabel: 'Carrinho', 
            sentenceLabel: 'o carrinho', 
            image: '/narrative_cards/objetos/carrinho_brinquedo.webp', 
            category: 'objetos',
            objectType: 'brinquedo'
        },
        { 
            id: 'cubo', 
            displayLabel: 'Cubo', 
            sentenceLabel: 'o cubo', 
            image: '/narrative_cards/objetos/cubo_colorido.webp', 
            category: 'objetos',
            objectType: 'brinquedo'
        }
    ],
    lugares: [], 
    emocoes: [], 
    tempo: []
};

// --- NÍVEIS ---
const gameLevels: Level[] = [
    { 
        level: 1, 
        name: "Primeiras Frases", 
        phrasesToComplete: 5, 
        structure: ['personagens', 'acoes'] 
    },
    { 
        level: 2, 
        name: "Frases com Objetos", 
        phrasesToComplete: 8, 
        structure: ['personagens', 'acoes', 'objetos'] 
    },
];

const Confetti = () => (
    <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
            <div key={i} className={`confetti-piece piece-${i % 5}`} />
        ))}
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
    const [totalStars, setTotalStars] = useState(0);

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
            
            // Só adiciona preposição quando tem objeto
            if (object) {
                if (action.verb.withPreposition && object.objectType === 'brinquedo') {
                    sentence += ` ${action.verb.withPreposition} ${object.sentenceLabel}`;
                } else {
                    sentence += ` ${object.sentenceLabel}`;
                }
            }
        }
        
        let formattedSentence = sentence.trim();
        formattedSentence = formattedSentence.charAt(0).toUpperCase() + formattedSentence.slice(1).toLowerCase();
        
        return isComplete ? formattedSentence + "." : formattedSentence;
    }, []);

    const loadNewPhrase = useCallback((levelIdx: number) => {
        const level = gameLevels[levelIdx];
        setCurrentPhrase([]);
        setGameState('playing');
        generateCardOptions(level.structure[0]);
        
        const encouragements = [
            "Vamos criar uma nova frase!",
            "Que tal mais uma história?",
            "Você está indo muito bem!",
            "Vamos continuar criando!",
            "Mais uma frase incrível!"
        ];
        
        const randomMessage = encouragements[Math.floor(Math.random() * encouragements.length)];
        leoSpeak(randomMessage);
    }, [generateCardOptions, leoSpeak]);

    const startGame = useCallback(() => {
        setCurrentLevelIndex(0);
        setPhrasesCompletedInLevel(0);
        setTotalStars(0);
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
            setPhrasesCompletedInLevel(newCount);
            setTotalStars(totalStars + 1);
            setGameState('phraseComplete');
            
            const finalSentence = buildSentence(newPhrase, true);
            leoSpeak(`Muito bem! Você formou: "${finalSentence}". Ganhou uma estrela!`);
            
            setShowConfetti(true);
            
            try {
                const audio = new Audio('/sounds/success.mp3');
                audio.volume = 0.5;
                audio.play().catch(e => console.log('Erro ao tocar som:', e));
            } catch (error) {
                console.error("Erro ao criar áudio:", error);
            }
            
            setTimeout(() => setShowConfetti(false), 3000);
            
            if (totalStars > 0 && (totalStars + 1) % 3 === 0) {
                setTimeout(() => setShowStarReward(true), 500);
            }
        } else {
            const nextCategory = currentLevel.structure[nextStepIndex];
            generateCardOptions(nextCategory, card);
            
            const encouragements = [
                "Ótima escolha!",
                "Muito bem!",
                "Continue assim!",
                "Perfeito!",
                "Excelente!"
            ];
            
            const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
            leoSpeak(randomEncouragement);
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
                leoSpeak(`Parabéns! Você completou o nível ${currentLevel.level}! Vamos para o próximo desafio!`);
                setTimeout(() => loadNewPhrase(nextLevelIndex), 3000);
            } else {
                setGameState('gameOver');
                leoSpeak(`Incrível! Você completou todos os níveis! Você é um campeão! Total de ${totalStars} estrelas!`);
            }
        } else {
            loadNewPhrase(currentLevelIndex);
        }
    };
    
    const handlePlayAgain = () => {
        startGame();
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
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-orange-900 drop-shadow-lg mb-4">
                    Histórias Épicas
                </h1>
                <p className="text-xl sm:text-2xl text-orange-800 mt-2 mb-8 drop-shadow-md">
                    Crie frases e aprenda brincando!
                </p>
                <button 
                    onClick={handleStartGame} 
                    className="text-xl font-bold text-white bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95"
                >
                    Começar a Brincar
                </button>
            </div>
        </div>
    );
    
    const renderStarReward = () => (
        <div 
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50" 
            onClick={() => setShowStarReward(false)}
        >
            <div className="star-reward-animate">
                <div className="text-yellow-400 flex justify-center">
                    <Star size={200} fill="currentColor" />
                </div>
                <p className="text-white text-4xl font-bold text-center mt-4">
                    Parabéns!
                </p>
                <p className="text-white text-2xl text-center mt-2">
                    Você ganhou {totalStars} estrelas!
                </p>
            </div>
        </div>
    );
    
    const renderGame = () => {
        const level = gameLevels[currentLevelIndex];
        if (!level) return <div>Carregando nível...</div>;
        
        const progressPercentage = (phrasesCompletedInLevel / level.phrasesToComplete) * 100;
        const displayedSentence = currentPhrase.length === 0 
            ? "Escolha as cartas para formar uma frase!" 
            : buildSentence(currentPhrase, false);

        return (
            <div className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200">
                {showConfetti && <Confetti />}
                {showStarReward && renderStarReward()}
                
                <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-6xl mx-auto border-4 border-purple-300">
                    <div className="mb-6">
                        <div className="flex justify-between items-center text-purple-700 font-bold text-lg md:text-xl mb-3">
                            <div className="flex items-center gap-2">
                                <BookText size={28} />
                                <span>Nível {level.level}: {level.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-yellow-500">
                                <Star size={28} fill="currentColor" />
                                <span className="text-xl">{phrasesCompletedInLevel} / {level.phrasesToComplete}</span>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-5 shadow-inner">
                            <div 
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-5 rounded-full transition-all duration-700 ease-out shadow-md"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl mb-6 border-3 border-yellow-300 min-h-[120px] flex items-center justify-center shadow-lg">
                        <p className="text-3xl md:text-5xl text-purple-800 font-bold text-center leading-relaxed">
                            {displayedSentence}
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative bg-white p-4 rounded-2xl shadow-lg max-w-2xl w-full">
                            <div className="flex items-center gap-4">
                                <Image 
                                    src="/images/mascotes/leo/leo_icon.webp" 
                                    alt="Leo" 
                                    width={60} 
                                    height={60} 
                                    className="rounded-full"
                                />
                                <p className="text-lg md:text-xl font-medium text-gray-700 flex-1">
                                    {leoMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {gameState === 'playing' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                            {cardOptions.map((card, index) => (
                                <button 
                                    key={card.id}
                                    onClick={() => handleCardSelection(card)}
                                    className="group relative p-4 bg-white rounded-2xl shadow-lg border-3 border-purple-200 hover:border-purple-500 hover:scale-105 transition-all duration-200 hover:shadow-xl active:scale-95"
                                    style={{
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                >
                                    <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-50">
                                        <Image 
                                            src={card.image} 
                                            alt={card.displayLabel} 
                                            fill 
                                            sizes="(max-width: 640px) 50vw, 25vw"
                                            className="object-contain p-2"
                                        />
                                    </div>
                                    <p className="mt-3 text-center font-bold text-base md:text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                                        {card.displayLabel}
                                    </p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center mt-8">
                            <button 
                                onClick={gameState === 'gameOver' ? handlePlayAgain : handleNext}
                                className="px-12 py-5 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-2xl rounded-full shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 active:scale-95"
                            >
                                {gameState === 'levelComplete' 
                                    ? 'Próximo Nível!' 
                                    : gameState === 'gameOver' 
                                        ? 'Jogar Novamente' 
                                        : 'Próxima Frase!'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };
    
    return (
        <>
            {gameState === 'titleScreen' ? renderTitleScreen() : renderGame()}
            
            <style jsx global>{`
                .confetti-container { 
                    position: fixed; 
                    top: 0; 
                    left: 0; 
                    width: 100%; 
                    height: 100%; 
                    pointer-events: none; 
                    z-index: 100; 
                }
                
                .confetti-piece { 
                    position: absolute; 
                    width: 12px; 
                    height: 24px; 
                    background: linear-gradient(45deg, #ffD700, #ff6c00);
                    top: -30px; 
                    animation: fall 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; 
                }
                
                .piece-0 { background: linear-gradient(45deg, #ffD700, #ffa500); } 
                .piece-1 { background: linear-gradient(45deg, #00c4ff, #0099ff); }
                .piece-2 { background: linear-gradient(45deg, #ff007c, #ff4c94); } 
                .piece-3 { background: linear-gradient(45deg, #00ff8c, #00d68f); }
                .piece-4 { background: linear-gradient(45deg, #ff6c00, #ff9a00); }
                
                @keyframes fall { 
                    to { 
                        transform: translateY(120vh) rotate(720deg); 
                        opacity: 0; 
                    } 
                }
                
                ${[...Array(50)].map((_, i) => `
                    .confetti-piece:nth-child(${i+1}) { 
                        left: ${Math.random()*100}%; 
                        animation-delay: ${Math.random()*3}s;
                        animation-duration: ${3 + Math.random()*2}s;
                    }`).join('')}
                
                .star-reward-animate { 
                    animation: star-pop 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; 
                }
                
                @keyframes star-pop { 
                    0% { 
                        transform: scale(0) rotate(0deg); 
                        opacity: 0; 
                    } 
                    50% {
                        transform: scale(1.2) rotate(180deg);
                    }
                    100% { 
                        transform: scale(1) rotate(360deg); 
                        opacity: 1; 
                    } 
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .group {
                    animation: slideIn 0.4s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </>
    );
}
