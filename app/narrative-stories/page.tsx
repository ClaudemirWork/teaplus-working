'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BookText, Star } from 'lucide-react';

// --- INTERFACES (sem alterações) ---
interface Card { /* ... */ }
interface Level { /* ... */ }

// --- MOTOR GRAMATICAL ATUALIZADO ---
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
// Lembre-se de preencher esta lista com todos os seus cards!
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
    // ... outras categorias ...
    lugares: [], emocoes: [], tempo: []
};

// --- NÍVEIS ---
const gameLevels: Level[] = [
    { level: 1, name: "Primeiras Frases", phrasesToComplete: 10, structure: ['personagens', 'acoes'] },
    { level: 2, name: "O Que Acontece?", phrasesToComplete: 15, structure: ['personagens', 'acoes', 'objetos'] },
];

// --- COMPONENTE DE RECOMPENSA: CONFETES ---
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
    
    // Estados para as novas recompensas
    const [showConfetti, setShowConfetti] = useState(false);
    const [showStarReward, setShowStarReward] = useState(false);

    // ... (funções leoSpeak, generateCardOptions, startGame, etc. sem alterações significativas)

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
            // A PREPOSIÇÃO SÓ É ADICIONADA SE EXISTIR UM OBJETO
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
    }, []);
    
    const handleCardSelection = (card: Card) => {
        // ... (lógica inicial mantida)
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
            
            // Ativar confetes e som
            setShowConfetti(true);
            const successSound = new Audio('/sounds/success.mp3'); // Verifique o caminho do seu som
            successSound.play();
            setTimeout(() => setShowConfetti(false), 3000); // Remove confetes após 3s

            // Ativar a estrela grande a cada 3 frases
            if (newCount > 0 && newCount % 3 === 0) {
                setShowStarReward(true);
            }

        } else {
            // ... (lógica para próxima etapa mantida)
        }
    };
    
    const renderStarReward = () => (
        <div 
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={() => setShowStarReward(false)} // Fecha ao clicar
        >
            <div className="text-yellow-400 star-reward-animate">
                <Star size={200} fill="currentColor" />
                <p className="text-white text-3xl font-bold text-center mt-4">Parabéns!</p>
            </div>
        </div>
    );

    const renderGame = () => {
        // ... (lógica do renderGame mantida)
        const displayedSentence = buildSentence(currentPhrase, false);
        return (
            <div className="w-full h-screen ...">
                {showConfetti && <Confetti />}
                {showStarReward && renderStarReward()}
                {/* O resto do JSX do jogo aqui... */}
                <p className="text-2xl md:text-4xl ...">{displayedSentence || "..."}</p>
                {/* ... */}
            </div>
        )
    }

    // ... (todas as outras funções de renderização e o return final)

    return (
        <>
            {renderContent()}
            <style jsx global>{`
                /* ... (estilos anteriores) ... */
                
                /* ESTILOS PARA OS CONFETES */
                .confetti-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100; }
                .confetti-piece { position: absolute; width: 10px; height: 20px; background: #f00; top: -20px; animation: fall 3s linear infinite; }
                .piece-0 { background: #ffD700; } .piece-1 { background: #00c4ff; }
                .piece-2 { background: #ff007c; } .piece-3 { background: #00ff8c; }
                .piece-4 { background: #ff6c00; }
                
                @keyframes fall {
                    to { transform: translateY(100vh) rotate(360deg); opacity: 0; }
                }
                
                /* Posicionamento aleatório dos confetes */
                ${[...Array(50)].map((_, i) => `.confetti-piece:nth-child(${i+1}) { left: ${Math.random()*100}%; animation-delay: ${Math.random()*3}s; }`).join('')}

                /* ANIMAÇÃO PARA A ESTRELA GRANDE */
                .star-reward-animate {
                    animation: star-pop 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
                }
                @keyframes star-pop {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </>
    );
}
