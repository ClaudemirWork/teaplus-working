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
    placePreposition?: string;
    emotionType?: 'feeling' | 'state';
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

// --- BANCO DE CARDS COMPLETO ---
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
        // ... (o resto do banco de cards continua o mesmo)
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
                requiresObject: false
            } 
        },
       // ... (o resto do banco de cards continua o mesmo)
    ],
    objetos: [
        // ... (o resto do banco de cards continua o mesmo)
    ],
    lugares: [
        // ... (o resto do banco de cards continua o mesmo)
    ],
    tempo: [
       // ... (o resto do banco de cards continua o mesmo)
    ],
    emocoes: [
       // ... (o resto do banco de cards continua o mesmo)
    ]
};

// --- NÍVEIS PEDAGÓGICOS PROGRESSIVOS ---
const gameLevels: Level[] = [
   // ... (os níveis continuam os mesmos)
];

const Confetti = () => (
    // ... (componente Confetti continua o mesmo)
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

    // ... (todas as funções como leoSpeak, generateCardOptions, buildSentence, etc. continuam as mesmas)

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
                    TESTE JOGO CORRETO
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
    
    // ... (as funções renderStarReward e renderGame continuam as mesmas)
    
    return (
        <>
            {gameState === 'titleScreen' ? renderTitleScreen() : renderGame()}
            
            <style jsx global>{`
                {/* ... (o CSS continua o mesmo) */}
            `}</style>
        </>
    );
}
