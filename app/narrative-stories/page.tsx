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
    
    // Para Personagens
    sentenceLabel?: string; // Ex: "o gatinho", "eu", "a professora"
    characterType?: 'human' | 'animal';
    person?: 'eu' | 'voce' | 'ele_ela'; // Pessoa gramatical para conjugação

    // Para Ações
    compatibleWithTypes?: ('human' | 'animal')[]; // Com quais tipos de personagem a ação é compatível
    verb?: {
        infinitive: string; // Ex: "brincar", "comer", "ler"
        preposition?: string; // Ex: "com", "de"
    };

    // Para Objetos e Lugares
    // sentenceLabel continua a ser usado aqui. Ex: "a bola", "na escola"
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
        if (person === 'voce' || person === 'ele_ela') return root + 'e'; // Simplificado, mas funciona para muitos casos
    }
    return infinitive; // Retorna o infinitivo se a regra não for encontrada
};


// --- BANCO DE CARDS COM A NOVA ESTRUTURA INTELIGENTE ---
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


// --- NÍVEIS COM ESTRUTURA LÓGICA ---
const gameLevels: Level[] = [
    { level: 1, name: "Primeiras Frases", phrasesToComplete: 10, structure: ['personagens', 'acoes'] },
    { level: 2, name: "O Que Acontece?", phrasesToComplete: 15, structure: ['personagens', 'acoes', 'objetos'] },
];

// --- O RESTO DO COMPONENTE (COM LÓGICA ATUALIZADA) ---
export default function HistoriasEpicasGame() {
    const [gameState, setGameState] = useState<'titleScreen' | 'playing' | 'phraseComplete' | 'levelComplete' | 'gameOver'>('titleScreen');
    const [leoMessage, setLeoMessage] = useState('');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [phrasesCompletedInLevel, setPhrasesCompletedInLevel] = useState(0);
    const [currentPhrase, setCurrentPhrase] = useState<Card[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [cardOptions, setCardOptions] = useState<Card[]>([]);

    const leoSpeak = useCallback((message: string) => { /* ...código mantido... */ }, []);

    // --- LÓGICA DE GERAÇÃO DE OPÇÕES AGORA É INTELIGENTE ---
    const generateCardOptions = useCallback((category: Card['category'], previousCard?: Card) => {
        let potentialCards = allCards[category];

        // Se estamos a escolher uma AÇÃO, filtramos por compatibilidade
        if (category === 'acoes' && previousCard && previousCard.category === 'personagens') {
            potentialCards = potentialCards.filter(actionCard => 
                actionCard.compatibleWithTypes?.includes(previousCard.characterType!)
            );
        }
        
        const shuffled = [...potentialCards].sort(() => 0.5 - Math.random());
        setCardOptions(shuffled.slice(0, 4));
    }, []);
    
    // --- FUNÇÃO QUE CONSTRÓI A FRASE CORRETAMENTE ---
    const buildSentence = (phrase: Card[]): string => {
        const subject = phrase.find(c => c.category === 'personagens');
        const action = phrase.find(c => c.category === 'acoes');
        const object = phrase.find(c => c.category === 'objetos');

        if (!subject || !action) return "Frase incompleta.";

        const conjugated = conjugateVerb(action.verb!.infinitive, subject.person!);
        
        let sentence = `${subject.sentenceLabel} ${conjugated}`;
        if (action.verb?.preposition) {
            sentence += ` ${action.verb.preposition}`;
        }
        if (object) {
            sentence += ` ${object.sentenceLabel}`;
        }

        return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    };

    const loadNewPhrase = useCallback((levelIdx: number) => { /* ...código mantido... */ }, [generateCardOptions, leoSpeak]);
    const startGame = useCallback(() => { /* ...código mantido... */ }, [loadNewPhrase]);
    const handleStartIntro = () => { setGameState('playing'); startGame(); }; // Removido o Intro por simplicidade
    
    const handleCardSelection = (card: Card) => {
        if (gameState !== 'playing') return;

        const newPhrase = [...currentPhrase, card];
        setCurrentPhrase(newPhrase);
        const nextStepIndex = currentStepIndex + 1;
        const currentLevel = gameLevels[currentLevelIndex];

        if (nextStepIndex >= currentLevel.structure.length) {
            setGameState('phraseComplete');
            const finalSentence = buildSentence(newPhrase);
            
            leoSpeak(`Você formou: "${finalSentence}"! Ganhou uma estrela!`);
            setPhrasesCompletedInLevel(prev => prev + 1);
        } else {
            setCurrentStepIndex(nextStepIndex);
            const nextCategory = currentLevel.structure[nextStepIndex];
            generateCardOptions(nextCategory, card);
            leoSpeak("Perfeito! E agora?");
        }
    };

    const handleNext = () => { /* ...código mantido... */ };
    
    // As funções de renderização (renderTitleScreen, renderGame, etc.) são mantidas.
    // Apenas a lógica interna foi alterada.
    // ... (Cole aqui as funções renderTitleScreen, renderGame, renderContent e o return final do código anterior)
}
