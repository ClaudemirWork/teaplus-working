'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BookText, Star } from 'lucide-react';

// --- INTERFACES (ATUALIZADAS) ---
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
        acceptsObjectType?: 'comida' | 'brinquedo' | 'leitura' | 'escolar';
    };
    objectType?: 'comida' | 'brinquedo' | 'leitura' | 'escolar';
}

interface Level {
    level: number;
    name: string;
    description: string;
    phrasesToComplete: number;
    structure: Card['category'][];
    isRecognitionOnly?: boolean;
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

    if (irregulars[infinitive]) return irregulars[infinitive][person];
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

// --- BANCO DE CARDS COMPLETO (COM ETIQUETAS) ---
const allCards: { [key in Card['category']]: Card[] } = {
    personagens: [
        { id: 'eu_homem', displayLabel: 'Eu', sentenceLabel: 'Eu', image: '/narrative_cards/personagens/eu_homem.webp', category: 'personagens', characterType: 'human', person: 'eu' },
        { id: 'voce', displayLabel: 'Você', sentenceLabel: 'Você', image: '/narrative_cards/personagens/voce.webp', category: 'personagens', characterType: 'human', person: 'voce' },
        { id: 'cachorro', displayLabel: 'Cachorro', sentenceLabel: 'O cachorro', image: '/narrative_cards/personagens/cachorro.webp', category: 'personagens', characterType: 'animal', person: 'ele_ela' },
        { id: 'gatinho', displayLabel: 'Gatinho', sentenceLabel: 'O gatinho', image: '/narrative_cards/personagens/gatinho.webp', category: 'personagens', characterType: 'animal', person: 'ele_ela' },
        { id: 'professora', displayLabel: 'Professora', sentenceLabel: 'A professora', image: '/narrative_cards/personagens/professora.webp', category: 'personagens', characterType: 'human', person: 'ele_ela' },
        { id: 'medico', displayLabel: 'Médico', sentenceLabel: 'O médico', image: '/narrative_cards/personagens/medico.webp', category: 'personagens', characterType: 'human', person: 'ele_ela' },
        { id: 'menino', displayLabel: 'Menino', sentenceLabel: 'O menino', image: '/narrative_cards/personagens/menino.webp', category: 'personagens', characterType: 'human', person: 'ele_ela' },
        { id: 'menina', displayLabel: 'Menina', sentenceLabel: 'A menina', image: '/narrative_cards/personagens/menina.webp', category: 'personagens', characterType: 'human', person: 'ele_ela' }
    ],
    acoes: [
        { id: 'comer', displayLabel: 'Comer', image: '/narrative_cards/acoes/comer.webp', category: 'acoes', compatibleWithTypes: ['human', 'animal'], verb: { infinitive: 'comer', acceptsObjectType: 'comida' } },
        { id: 'brincar', displayLabel: 'Brincar', image: '/narrative_cards/acoes/brincar.webp', category: 'acoes', compatibleWithTypes: ['human', 'animal'], verb: { infinitive: 'brincar', acceptsObjectType: 'brinquedo' } },
        { id: 'ler', displayLabel: 'Ler', image: '/narrative_cards/acoes/ler_livro.webp', category: 'acoes', compatibleWithTypes: ['human'], verb: { infinitive: 'ler', acceptsObjectType: 'leitura' } },
        { id: 'dormir', displayLabel: 'Dormir', image: '/narrative_cards/acoes/dormir_lado.webp', category: 'acoes', compatibleWithTypes: ['human', 'animal'], verb: { infinitive: 'dormir' } },
        { id: 'correr', displayLabel: 'Correr', image: '/narrative_cards/acoes/correr.webp', category: 'acoes', compatibleWithTypes: ['human', 'animal'], verb: { infinitive: 'correr' } },
        { id: 'estudar', displayLabel: 'Estudar', image: '/narrative_cards/acoes/estudar.webp', category: 'acoes', compatibleWithTypes: ['human'], verb: { infinitive: 'estudar' } },
    ],
    objetos: [
        { id: 'bola', displayLabel: 'Bola', sentenceLabel: 'a bola', image: '/narrative_cards/objetos/bola_praia.webp', category: 'objetos', objectType: 'brinquedo' },
        { id: 'livro', displayLabel: 'Livro', sentenceLabel: 'o livro', image: '/narrative_cards/objetos/livro.webp', category: 'objetos', objectType: 'leitura' },
        { id: 'pizza', displayLabel: 'Pizza', sentenceLabel: 'a pizza', image: '/narrative_cards/objetos/pizza.webp', category: 'objetos', objectType: 'comida' },
        { id: 'carrinho', displayLabel: 'Carrinho', sentenceLabel: 'o carrinho', image: '/narrative_cards/objetos/carrinho_brinquedo.webp', category: 'objetos', objectType: 'brinquedo' },
        { id: 'mochila', displayLabel: 'Mochila', sentenceLabel: 'a mochila', image: '/narrative_cards/objetos/mochila_escola.webp', category: 'objetos', objectType: 'escolar' },
    ],
    lugares: [
        { id: 'casa', displayLabel: 'Em Casa', sentenceLabel: 'em casa', image: '/narrative_cards/lugares/casa.webp', category: 'lugares' },
        { id: 'escola', displayLabel: 'Na Escola', sentenceLabel: 'na escola', image: '/narrative_cards/lugares/escola.webp', category: 'lugares' },
        { id: 'jardim', displayLabel: 'No Jardim', sentenceLabel: 'no jardim', image: '/narrative_cards/lugares/jardim.webp', category: 'lugares' },
    ],
    tempo: [
        { id: 'hoje', displayLabel: 'Hoje', sentenceLabel: 'Hoje', image: '/narrative_cards/tempo/hoje.webp', category: 'tempo' },
        { id: 'manha', displayLabel: 'De Manhã', sentenceLabel: 'de manhã', image: '/narrative_cards/tempo/manha.webp', category: 'tempo' },
    ],
    emocoes: [
        { id: 'feliz', displayLabel: 'Feliz', sentenceLabel: 'feliz', image: '/narrative_cards/emocoes/homem_feliz.webp', category: 'emocoes' },
        { id: 'triste', displayLabel: 'Triste', sentenceLabel: 'triste', image: '/narrative_cards/emocoes/homem_triste.webp', category: 'emocoes' },
    ]
};

// --- NÍVEIS COMPLETOS ---
const gameLevels: Level[] = [
    { level: 1, name: "Reconhecimento", description: "Identifique quem está na história", phrasesToComplete: 5, structure: ['personagens'], isRecognitionOnly: true },
    { level: 2, name: "Ação Simples", description: "Quem faz o quê?", phrasesToComplete: 5, structure: ['personagens', 'acoes'] },
    { level: 3, name: "Com Objetos", description: "Complete a ação com um objeto", phrasesToComplete: 6, structure: ['personagens', 'acoes', 'objetos'] },
    { level: 4, name: "Onde Acontece", description: "Adicione o lugar na história", phrasesToComplete: 6, structure: ['personagens', 'acoes', 'lugares'] },
    { level: 5, name: "História Completa", description: "Crie uma história com tempo e lugar", phrasesToComplete: 7, structure: ['tempo', 'personagens', 'acoes', 'objetos', 'lugares'] },
];

const Confetti = () => (
    <div className="confetti-container">
        {[...Array(50)].map((_, i) => <div key={i} className={`confetti-piece piece-${i % 5}`} />)}
    </div>
);

// --- COMPONENTE PRINCIPAL DO JOGO ---
export default function HistoriasEpicasGame() {
    const [gameState, setGameState] = useState<'titleScreen' | 'playing' | 'phraseComplete' | 'levelComplete' | 'gameOver'>('titleScreen');
    const [leoMessage, setLeoMessage] = useState('Vamos começar nossa aventura de criar histórias!');
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
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const generateCardOptions = useCallback((category: Card['category'], phrase: Card[]) => {
        let potentialCards = [...allCards[category]];

        if (category === 'objetos') {
            const actionCard = phrase.find(c => c.category === 'acoes');
            const requiredObjectType = actionCard?.verb?.acceptsObjectType;
            if (requiredObjectType) {
                potentialCards = potentialCards.filter(objectCard => objectCard.objectType === requiredObjectType);
            }
        }
        
        if (category === 'acoes') {
            const subjectCard = phrase.find(c => c.category === 'personagens');
            if (subjectCard) {
                potentialCards = potentialCards.filter(actionCard => 
                    actionCard.compatibleWithTypes?.includes(subjectCard.characterType!)
                );
            }
        }
        
        const shuffled = potentialCards.sort(() => 0.5 - Math.random());
        setCardOptions(shuffled.slice(0, 4));
    }, []);
    
    const buildSentence = useCallback((phrase: Card[], isComplete: boolean = false): string => {
        if (phrase.length === 0) return "";
        let parts: string[] = [];
        const structure = gameLevels[currentLevelIndex].structure;
        
        // Constrói a frase na ordem da estrutura do nível
        structure.forEach(category => {
            const card = phrase.find(c => c.category === category);
            if (card) {
                if (card.category === 'acoes') {
                    const subject = phrase.find(c => c.category === 'personagens');
                    if (subject?.person) {
                        parts.push(conjugateVerb(card.verb!.infinitive, subject.person));
                    }
                } else {
                    parts.push(card.sentenceLabel || card.displayLabel);
                }
            }
        });
        
        let sentence = parts.join(" ");
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        if (isComplete) sentence += ".";
        return sentence;
    }, [currentLevelIndex]);

    const getInstruction = useCallback((phrase: Card[], level: Level): string => {
        const nextCategoryIndex = phrase.length;
        if (nextCategoryIndex >= level.structure.length) return "Frase completa!";
        const nextCategory = level.structure[nextCategoryIndex];

        switch(nextCategory) {
            case 'personagens': return "Escolha um personagem para começar a história.";
            case 'acoes': 
                const subject = phrase.find(c => c.category === 'personagens');
                return subject ? `O que ${subject.displayLabel.toLowerCase()} faz?` : "Agora, escolha uma ação.";
            case 'objetos': return "Com o quê?";
            case 'lugares': return "Onde?";
            case 'tempo': return "Quando?";
            case 'emocoes': return "Como se sente?";
            default: return "Continue a história!";
        }
    }, []);
    
    const loadNewPhrase = useCallback((levelIdx: number) => {
        const level = gameLevels[levelIdx];
        setCurrentPhrase([]);
        setGameState('playing');
        generateCardOptions(level.structure[0], []);
        leoSpeak(getInstruction([], level));
    }, [generateCardOptions, getInstruction, leoSpeak]);

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
            setGameState('phraseComplete');
            setPhrasesCompletedInLevel(prev => prev + 1);
            const finalSentence = buildSentence(newPhrase, true);
            leoSpeak(`Excelente! Você formou: ${finalSentence}`);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            if ((phrasesCompletedInLevel + 1) % 3 === 0) {
                setShowStarReward(true);
            }
        } else {
            const nextCategory = currentLevel.structure[nextStepIndex];
            generateCardOptions(nextCategory, newPhrase);
            leoSpeak(getInstruction(newPhrase, currentLevel));
        }
    };

    const handleNext = () => {
        setShowStarReward(false);
        const currentLevel = gameLevels[currentLevelIndex];
        if (phrasesCompletedInLevel >= currentLevel.phrasesToComplete) {
            const nextLevelIndex = currentLevelIndex + 1;
            if (nextLevelIndex < gameLevels.length) {
                setCurrentLevelIndex(nextLevelIndex);
                setPhrasesCompletedInLevel(0);
                setGameState('levelComplete');
                leoSpeak(`Parabéns! Você passou para o Nível ${nextLevelIndex + 1}: ${gameLevels[nextLevelIndex].name}!`);
                setTimeout(() => loadNewPhrase(nextLevelIndex), 3500);
            } else {
                setGameState('gameOver');
                leoSpeak("Uau! Você completou todos os níveis e se tornou um mestre das histórias épicas!");
            }
        } else {
            loadNewPhrase(currentLevelIndex);
        }
    };
    
    const renderTitleScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-yellow-200 via-orange-300 to-amber-400 overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center">
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
                    Começar a Aventura
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
                    Recompensa!
                </p>
            </div>
        </div>
    );
    
    const renderGame = () => {
        const level = gameLevels[currentLevelIndex];
        if (!level) return <div>Carregando...</div>;
        const progressPercentage = (phrasesCompletedInLevel / level.phrasesToComplete) * 100;
        const displayedSentence = buildSentence(currentPhrase, false);
    
        return (
            <div className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200">
                {showConfetti && <Confetti />}
                {showStarReward && renderStarReward()}
                <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl w-full max-w-6xl mx-auto border-4 border-violet-300">
                    <div className="mb-4">
                        <div className="flex justify-between items-center text-purple-700 font-bold text-lg md:text-xl mb-2">
                            <div className='flex items-center gap-2'><BookText size={24} /> Nível {level.level}: {level.name}</div>
                            <div className="flex items-center gap-1 text-yellow-500"><Star size={24} fill="currentColor"/> {phrasesCompletedInLevel} / {level.phrasesToComplete}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner"><div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div>
                         <p className="text-center text-sm text-gray-600 mt-2">{level.description}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl mb-4 border-2 border-yellow-300 min-h-[100px] flex items-center justify-center text-center shadow-inner">
                        <p className="text-2xl md:text-4xl text-purple-800 font-bold leading-relaxed">{displayedSentence || "..."}</p>
                    </div>
                    <div className="relative bg-white p-3 rounded-lg shadow-md text-center mb-4 min-h-[60px] flex items-center justify-center">
                        <p className="text-lg md:text-xl font-medium text-gray-800">{leoMessage}</p>
                    </div>
                    {gameState === 'playing' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {cardOptions.map((card, index) => (
                                <button key={card.id + index} onClick={() => handleCardSelection(card)} className="group p-3 bg-white rounded-xl shadow-lg border-2 border-purple-200 hover:border-purple-500 hover:scale-105 transition-transform">
                                    <div className="aspect-square relative rounded-md overflow-hidden"><Image src={card.image} alt={card.displayLabel} fill sizes="25vw" className="object-contain p-1"/></div>
                                    <p className="mt-2 text-center font-bold text-sm md:text-base text-gray-800">{card.displayLabel}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center mt-6'>
                            <button onClick={handleNext} className="px-10 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-xl rounded-full shadow-xl hover:scale-105 transition-transform">
                                {gameState === 'levelComplete' ? 'Próximo Nível!' : gameState === 'gameOver' ? 'Jogar Novamente' : 'Próxima Frase!'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    return (
        <>
            {gameState === 'titleScreen' ? renderTitleScreen() : renderGame()}
            
            <style jsx global>{`
                .confetti-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100; }
                .confetti-piece { position: absolute; width: 12px; height: 24px; top: -30px; animation: fall 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; }
                .piece-0 { background: linear-gradient(45deg, #ffD700, #ffa500); } 
                .piece-1 { background: linear-gradient(45deg, #00c4ff, #0099ff); }
                .piece-2 { background: linear-gradient(45deg, #ff007c, #ff4c94); } 
                .piece-3 { background: linear-gradient(45deg, #00ff8c, #00d68f); }
                .piece-4 { background: linear-gradient(45deg, #ff6c00, #ff9a00); }
                @keyframes fall { to { transform: translateY(120vh) rotate(720deg); opacity: 0; } }
                ${[...Array(50)].map((_, i) => `.confetti-piece:nth-child(${i+1}) { left: ${Math.random()*100}%; animation-delay: ${Math.random()*3}s; animation-duration: ${3 + Math.random()*2}s; }`).join('')}
                .star-reward-animate { animation: star-pop 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; }
                @keyframes star-pop { 
                    0% { transform: scale(0) rotate(0deg); opacity: 0; } 
                    50% { transform: scale(1.2) rotate(180deg); }
                    100% { transform: scale(1) rotate(360deg); opacity: 1; } 
                }
            `}</style>
        </>
    );
}
