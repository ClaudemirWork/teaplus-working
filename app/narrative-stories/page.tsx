'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BookText, Star } from 'lucide-react';
import './HistoriasEpicas.css'; // Importando o arquivo CSS

// --- INTERFACES E DADOS ---
interface Card {
    id: string;
    displayLabel: string;
    image: string;
    category: 'personagens' | 'acoes' | 'objetos' | 'lugares' | 'tempo' | 'emocoes';
    sentenceLabel?: string;
    characterType?: 'human' | 'animal';
    person?: 'eu' | 'voce' | 'ele_ela';
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
}

interface StoryTemplate {
    level: number;
    parts: {
        [key in Card['category']]?: string;
    };
    prompts: {
        [key in Card['category']]?: string;
    }
}

const allCards: { [key in Card['category']]: Card[] } = {
    personagens: [ { id: 'eu_homem', displayLabel: 'Eu', sentenceLabel: 'Eu', image: '/narrative_cards/personagens/eu_homem.webp', category: 'personagens', characterType: 'human', person: 'eu' }, { id: 'voce', displayLabel: 'Você', sentenceLabel: 'Você', image: '/narrative_cards/personagens/voce.webp', category: 'personagens', characterType: 'human', person: 'voce' }, { id: 'cachorro', displayLabel: 'Cachorro', sentenceLabel: 'O cachorro', image: '/narrative_cards/personagens/cachorro.webp', category: 'personagens', characterType: 'animal', person: 'ele_ela' }, { id: 'gatinho', displayLabel: 'Gatinho', sentenceLabel: 'O gatinho', image: '/narrative_cards/personagens/gatinho.webp', category: 'personagens', characterType: 'animal', person: 'ele_ela' }, { id: 'professora', displayLabel: 'Professora', sentenceLabel: 'A professora', image: '/narrative_cards/personagens/professora.webp', category: 'personagens', characterType: 'human', person: 'ele_ela' }, { id: 'medico', displayLabel: 'Médico', sentenceLabel: 'O médico', image: '/narrative_cards/personagens/medico.webp', category: 'personagens', characterType: 'human', person: 'ele_ela' }, { id: 'menino', displayLabel: 'Menino', sentenceLabel: 'O menino', image: '/narrative_cards/personagens/filho.webp', category: 'personagens', characterType: 'human', person: 'ele_ela' }, { id: 'menina', displayLabel: 'Menina', sentenceLabel: 'A menina', image: '/narrative_cards/personagens/filha.webp', category: 'personagens', characterType: 'human', person: 'ele_ela' } ],
    acoes: [ { id: 'comer', displayLabel: 'Comer', image: '/narrative_cards/acoes/comer.webp', category: 'acoes', verb: { infinitive: 'comer', acceptsObjectType: 'comida' } }, { id: 'brincar', displayLabel: 'Brincar', image: '/narrative_cards/acoes/brincar.webp', category: 'acoes', verb: { infinitive: 'brincar', acceptsObjectType: 'brinquedo' } }, { id: 'ler', displayLabel: 'Ler', image: '/narrative_cards/acoes/ler_livro.webp', category: 'acoes', verb: { infinitive: 'ler', acceptsObjectType: 'leitura' } }, { id: 'dormir', displayLabel: 'Dormir', image: '/narrative_cards/acoes/dormir_lado.webp', category: 'acoes', verb: { infinitive: 'dormir' } }, { id: 'correr', displayLabel: 'Correr', image: '/narrative_cards/acoes/correr.webp', category: 'acoes', verb: { infinitive: 'correr' } }, { id: 'estudar', displayLabel: 'Estudar', image: '/narrative_cards/acoes/estudar.webp', category: 'acoes', verb: { infinitive: 'estudar', acceptsObjectType: 'leitura' } }, ],
    objetos: [ { id: 'bola', displayLabel: 'Bola', sentenceLabel: 'a bola', image: '/narrative_cards/objetos/bola_praia.webp', category: 'objetos', objectType: 'brinquedo' }, { id: 'livro', displayLabel: 'Livro', sentenceLabel: 'o livro', image: '/narrative_cards/objetos/papel_lapis.webp', category: 'objetos', objectType: 'leitura' }, { id: 'pizza', displayLabel: 'Pizza', sentenceLabel: 'a pizza', image: '/narrative_cards/objetos/pizza.webp', category: 'objetos', objectType: 'comida' }, { id: 'carrinho', displayLabel: 'Carrinho', sentenceLabel: 'o carrinho', image: '/narrative_cards/objetos/carrinho_brinquedo.webp', category: 'objetos', objectType: 'brinquedo' }, { id: 'mochila', displayLabel: 'Mochila', sentenceLabel: 'a mochila', image: '/narrative_cards/objetos/mochila_escola.webp', category: 'objetos', objectType: 'escolar' }, ],
    lugares: [ { id: 'casa', displayLabel: 'Em Casa', sentenceLabel: 'em casa', image: '/narrative_cards/lugares/casa.webp', category: 'lugares' },{ id: 'escola', displayLabel: 'Na Escola', sentenceLabel: 'na escola', image: '/narrative_cards/lugares/escola.webp', category: 'lugares' },{ id: 'jardim', displayLabel: 'No Jardim', sentenceLabel: 'no jardim', image: '/narrative_cards/lugares/jardim.webp', category: 'lugares' }, ],
    tempo: [ { id: 'hoje', displayLabel: 'Hoje', sentenceLabel: 'Hoje', image: '/narrative_cards/tempo/hoje.webp', category: 'tempo' },{ id: 'manha', displayLabel: 'De Manhã', sentenceLabel: 'de manhã', image: '/narrative_cards/tempo/manha.webp', category: 'tempo' }, ],
    emocoes: [ { id: 'feliz', displayLabel: 'Feliz', sentenceLabel: 'feliz', image: '/narrative_cards/emocoes/homem_feliz.webp', category: 'emocoes' },{ id: 'triste', displayLabel: 'Triste', sentenceLabel: 'triste', image: '/narrative_cards/emocoes/homem_triste.webp', category: 'emocoes' }, ]
};

const gameLevels: Level[] = [
    { level: 1, name: "Reconhecimento", description: "Identifique o personagem da história", phrasesToComplete: 5, structure: ['personagens'] },
    { level: 2, name: "Ação Simples", description: "Quem faz o quê?", phrasesToComplete: 5, structure: ['personagens', 'acoes'] },
    { level: 3, name: "Com Objetos", description: "Complete a ação com um objeto", phrasesToComplete: 6, structure: ['personagens', 'acoes', 'objetos'] },
    { level: 4, name: "Onde Acontece", description: "Adicione o lugar na história", phrasesToComplete: 6, structure: ['personagens', 'acoes', 'lugares'] },
    { level: 5, name: "História Completa", description: "Crie uma história com tempo e lugar", phrasesToComplete: 7, structure: ['tempo', 'personagens', 'acoes', 'objetos', 'lugares'] },
];

const storyTemplates: StoryTemplate[] = [
    // --- NÍVEL 1: Reconhecimento (10 Histórias) ---
    { level: 1, parts: { 'personagens': 'menino' }, prompts: { 'personagens': 'Quem está na história?' } },
    { level: 1, parts: { 'personagens': 'menina' }, prompts: { 'personagens': 'Encontre a personagem.' } },
    { level: 1, parts: { 'personagens': 'cachorro' }, prompts: { 'personagens': 'Qual animal vemos aqui?' } },
    { level: 1, parts: { 'personagens': 'gatinho' }, prompts: { 'personagens': 'Mostre o gatinho.' } },
    { level: 1, parts: { 'personagens': 'professora' }, prompts: { 'personagens': 'Onde está a professora?' } },
    { level: 1, parts: { 'personagens': 'medico' }, prompts: { 'personagens': 'Quem está aqui?' } },
    { level: 1, parts: { 'personagens': 'eu_homem' }, prompts: { 'personagens': 'Aponte para "Eu".' } },
    { level: 1, parts: { 'personagens': 'voce' }, prompts: { 'personagens': 'Encontre "Você".' } },
    { level: 1, parts: { 'personagens': 'menina' }, prompts: { 'personagens': 'Onde está a menina?' } }, // Repetido para mais variedade
    { level: 1, parts: { 'personagens': 'menino' }, prompts: { 'personagens': 'Mostre o menino.' } }, // Repetido para mais variedade

    // --- NÍVEL 2: Personagem + Ação (12 Histórias) ---
    { level: 2, parts: { 'personagens': 'gatinho', 'acoes': 'dormir' }, prompts: { 'personagens': 'Quem está dormindo?', 'acoes': 'O que o gatinho está fazendo?' } },
    { level: 2, parts: { 'personagens': 'menino', 'acoes': 'correr' }, prompts: { 'personagens': 'Quem está correndo?', 'acoes': 'O que o menino faz?' } },
    { level: 2, parts: { 'personagens': 'cachorro', 'acoes': 'brincar' }, prompts: { 'personagens': 'Quem quer brincar?', 'acoes': 'O que o cachorro faz?' } },
    { level: 2, parts: { 'personagens': 'professora', 'acoes': 'ler' }, prompts: { 'personagens': 'Quem está com um livro?', 'acoes': 'O que a professora está fazendo?' } },
    { level: 2, parts: { 'personagens': 'medico', 'acoes': 'estudar' }, prompts: { 'personagens': 'Quem está estudando?', 'acoes': 'O que o médico faz?' } },
    { level: 2, parts: { 'personagens': 'eu_homem', 'acoes': 'comer' }, prompts: { 'personagens': 'Quem está com fome?', 'acoes': 'O que eu estou fazendo?' } },
    { level: 2, parts: { 'personagens': 'menina', 'acoes': 'estudar' }, prompts: { 'personagens': 'Quem está na mesa?', 'acoes': 'O que a menina faz?' } },
    { level: 2, parts: { 'personagens': 'menino', 'acoes': 'correr' }, prompts: { 'personagens': 'Quem está correndo?', 'acoes': 'Qual a ação do menino?' } },
    { level: 2, parts: { 'personagens': 'gatinho', 'acoes': 'comer' }, prompts: { 'personagens': 'Quem está comendo?', 'acoes': 'O que o gatinho está fazendo?' } },
    { level: 2, parts: { 'personagens': 'voce', 'acoes': 'ler' }, prompts: { 'personagens': 'Quem está lendo?', 'acoes': 'O que você faz?' } },
    { level: 2, parts: { 'personagens': 'cachorro', 'acoes': 'dormir' }, prompts: { 'personagens': 'Quem está com sono?', 'acoes': 'O que o cachorro está fazendo?' } },
    { level: 2, parts: { 'personagens': 'menino', 'acoes': 'brincar' }, prompts: { 'personagens': 'Quem está feliz?', 'acoes': 'O que o menino faz?' } },
    
    // --- NÍVEL 3: Personagem + Ação + Objeto (14 Histórias) ---
    { level: 3, parts: { 'personagens': 'menina', 'acoes': 'comer', 'objetos': 'pizza' }, prompts: { 'personagens': 'Quem come?', 'acoes': 'O que ela faz?', 'objetos': 'O que ela come?' } },
    { level: 3, parts: { 'personagens': 'cachorro', 'acoes': 'brincar', 'objetos': 'bola' }, prompts: { 'personagens': 'Quem brinca?', 'acoes': 'O que ele faz?', 'objetos': 'Com o que ele brinca?' } },
    { level: 3, parts: { 'personagens': 'professora', 'acoes': 'ler', 'objetos': 'livro' }, prompts: { 'personagens': 'Quem lê?', 'acoes': 'O que ela faz?', 'objetos': 'O que ela lê?' } },
    { level: 3, parts: { 'personagens': 'menino', 'acoes': 'brincar', 'objetos': 'carrinho' }, prompts: { 'personagens': 'Quem brinca?', 'acoes': 'O que ele faz?', 'objetos': 'Qual o brinquedo dele?' } },
    { level: 3, parts: { 'personagens': 'eu_homem', 'acoes': 'estudar', 'objetos': 'livro' }, prompts: { 'personagens': 'Quem estuda?', 'acoes': 'O que eu faço?', 'objetos': 'O que eu estudo?' } },
    { level: 3, parts: { 'personagens': 'voce', 'acoes': 'comer', 'objetos': 'pizza' }, prompts: { 'personagens': 'Quem come?', 'acoes': 'O que você faz?', 'objetos': 'O que você come?' } },
    { level: 3, parts: { 'personagens': 'gatinho', 'acoes': 'brincar', 'objetos': 'bola' }, prompts: { 'personagens': 'Quem brinca?', 'acoes': 'O que ele faz?', 'objetos': 'Com o que o gatinho brinca?' } },
    { level: 3, parts: { 'personagens': 'medico', 'acoes': 'ler', 'objetos': 'livro' }, prompts: { 'personagens': 'Quem lê?', 'acoes': 'O que o médico faz?', 'objetos': 'O que ele está lendo?' } },
    { level: 3, parts: { 'personagens': 'menina', 'acoes': 'brincar', 'objetos': 'bola' }, prompts: { 'personagens': 'Quem está com a bola?', 'acoes': 'O que ela faz?', 'objetos': 'Qual é o objeto?' } },
    { level: 3, parts: { 'personagens': 'menino', 'acoes': 'comer', 'objetos': 'pizza' }, prompts: { 'personagens': 'Quem está comendo?', 'acoes': 'O que ele faz?', 'objetos': 'Qual a comida?' } },
    { level: 3, parts: { 'personagens': 'menina', 'acoes': 'estudar', 'objetos': 'livro' }, prompts: { 'personagens': 'Quem está estudando?', 'acoes': 'O que a menina faz?', 'objetos': 'O que ela usa para estudar?' } },
    { level: 3, parts: { 'personagens': 'menino', 'acoes': 'brincar', 'objetos': 'bola' }, prompts: { 'personagens': 'Quem quer brincar?', 'acoes': 'O que o menino faz?', 'objetos': 'Com o que ele brinca?' } },
    { level: 3, parts: { 'personagens': 'professora', 'acoes': 'estudar', 'objetos': 'livro' }, prompts: { 'personagens': 'Quem está na mesa?', 'acoes': 'O que ela faz?', 'objetos': 'O que ela estuda?' } },
    { level: 3, parts: { 'personagens': 'cachorro', 'acoes': 'comer', 'objetos': 'pizza' }, prompts: { 'personagens': 'Quem está com fome?', 'acoes': 'O que o cachorro faz?', 'objetos': 'O que ele come?' } },

    // --- NÍVEL 4: Personagem + Ação + Lugar (8 Histórias) ---
    { level: 4, parts: { 'personagens': 'professora', 'acoes': 'ler', 'lugares': 'escola' }, prompts: { 'personagens': 'Quem lê?', 'acoes': 'O que ela faz?', 'lugares': 'Onde ela lê?' } },
    { level: 4, parts: { 'personagens': 'cachorro', 'acoes': 'correr', 'lugares': 'jardim' }, prompts: { 'personagens': 'Quem corre?', 'acoes': 'O que ele faz?', 'lugares': 'Onde ele corre?' } },
    { level: 4, parts: { 'personagens': 'menino', 'acoes': 'brincar', 'lugares': 'casa' }, prompts: { 'personagens': 'Quem brinca?', 'acoes': 'O que ele faz?', 'lugares': 'Onde ele brinca?' } },
    { level: 4, parts: { 'personagens': 'gatinho', 'acoes': 'dormir', 'lugares': 'casa' }, prompts: { 'personagens': 'Quem dorme?', 'acoes': 'O que ele faz?', 'lugares': 'Onde o gatinho dorme?' } },
    { level: 4, parts: { 'personagens': 'menina', 'acoes': 'estudar', 'lugares': 'escola' }, prompts: { 'personagens': 'Quem estuda?', 'acoes': 'O que ela faz?', 'lugares': 'Onde ela estuda?' } },
    { level: 4, parts: { 'personagens': 'eu_homem', 'acoes': 'correr', 'lugares': 'jardim' }, prompts: { 'personagens': 'Quem corre?', 'acoes': 'O que eu faço?', 'lugares': 'Onde eu corro?' } },
    { level: 4, parts: { 'personagens': 'medico', 'acoes': 'ler', 'lugares': 'casa' }, prompts: { 'personagens': 'Quem está lendo?', 'acoes': 'O que o médico faz?', 'lugares': 'Onde ele está?' } },
    { level: 4, parts: { 'personagens': 'menino', 'acoes': 'brincar', 'lugares': 'jardim' }, prompts: { 'personagens': 'Quem está no jardim?', 'acoes': 'O que o menino está fazendo?', 'lugares': 'Onde ele está?' } },
    
    // --- NÍVEL 5: História Completa (8 Histórias) ---
    { level: 5, parts: { 'tempo': 'hoje', 'personagens': 'eu_homem', 'acoes': 'estudar', 'objetos': 'livro', 'lugares': 'casa'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'Fazendo o quê?', 'objetos': 'Com o quê?', 'lugares': 'Onde?' } },
    { level: 5, parts: { 'tempo': 'manha', 'personagens': 'menino', 'acoes': 'brincar', 'objetos': 'bola', 'lugares': 'jardim'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'O quê?', 'objetos': 'Com qual objeto?', 'lugares': 'Em que lugar?' } },
    { level: 5, parts: { 'tempo': 'hoje', 'personagens': 'menina', 'acoes': 'comer', 'objetos': 'pizza', 'lugares': 'casa'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'Ação?', 'objetos': 'O quê?', 'lugares': 'Onde?' } },
    { level: 5, parts: { 'tempo': 'manha', 'personagens': 'professora', 'acoes': 'ler', 'objetos': 'livro', 'lugares': 'escola'}, prompts: { 'tempo': 'Quando acontece?', 'personagens': 'Quem está na história?', 'acoes': 'O que ela faz?', 'objetos': 'O que ela usa?', 'lugares': 'Onde ela está?' } },
    { level: 5, parts: { 'tempo': 'hoje', 'personagens': 'cachorro', 'acoes': 'brincar', 'objetos': 'bola', 'lugares': 'jardim'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'Fazendo o quê?', 'objetos': 'Com o quê?', 'lugares': 'Onde?' } },
    { level: 5, parts: { 'tempo': 'manha', 'personagens': 'gatinho', 'acoes': 'dormir', 'objetos': 'livro', 'lugares': 'casa'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'O quê?', 'objetos': 'Perto do quê?', 'lugares': 'Onde?' } },
    { level: 5, parts: { 'tempo': 'hoje', 'personagens': 'medico', 'acoes': 'estudar', 'objetos': 'livro', 'lugares': 'escola'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'Fazendo o quê?', 'objetos': 'O quê?', 'lugares': 'Onde?' } },
    { level: 5, parts: { 'tempo': 'manha', 'personagens': 'voce', 'acoes': 'correr', 'objetos': 'mochila', 'lugares': 'escola'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'O que você faz?', 'objetos': 'Com o quê?', 'lugares': 'Para onde?' } },
];

const Confetti = () => (<div className="confetti-container">{[...Array(50)].map((_, i) => <div key={i} className={`confetti-piece piece-${i % 5}`} />)}</div>);
const conjugateVerb = (infinitive: string, person: 'eu' | 'voce' | 'ele_ela'): string => { const irregulars: { [key: string]: { [key: string]: string } } = { 'ler':{eu:'leio',voce:'lê',ele_ela:'lê'},'ver':{eu:'vejo',voce:'vê',ele_ela:'vê'},'ir':{eu:'vou',voce:'vai',ele_ela:'vai'},'ser':{eu:'sou',voce:'é',ele_ela:'é'},'estar':{eu:'estou',voce:'está',ele_ela:'está'},'ter':{eu:'tenho',voce:'tem',ele_ela:'tem'} }; if(irregulars[infinitive]) return irregulars[infinitive][person]; const ending = infinitive.slice(-2); const root = infinitive.slice(0,-2); if(ending==='ar'){ if(person==='eu')return root+'o'; if(person==='voce'||person==='ele_ela')return root+'a';} if(ending==='er'){ if(person==='eu')return root+'o'; if(person==='voce'||person==='ele_ela')return root+'e';} if(ending==='ir'){ if(person==='eu')return root+'o'; if(person==='voce'||person==='ele_ela')return root+'e';} return infinitive; };


export default function HistoriasEpicasGame() {
    // --- ESTADOS DO JOGO ---
    const [gameState, setGameState] = useState<'titleScreen' | 'playing' | 'phraseComplete' | 'levelComplete' | 'gameOver'>('titleScreen');
    const [leoMessage, setLeoMessage] = useState<string>('Vamos começar nossa aventura de criar histórias!'); // TSX
    const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0); // TSX
    const [phrasesCompletedInLevel, setPhrasesCompletedInLevel] = useState<number>(0); // TSX
    const [currentPhrase, setCurrentPhrase] = useState<Card[]>([]); // TSX
    const [cardOptions, setCardOptions] = useState<Card[]>([]); // TSX
    const [showConfetti, setShowConfetti] = useState<boolean>(false); // TSX
    const [showStarReward, setShowStarReward] = useState<boolean>(false); // TSX
    const [currentStory, setCurrentStory] = useState<StoryTemplate | null>(null); // TSX

    // Estados para gamificação
    const [score, setScore] = useState<number>(0); // TSX
    const [scoreUpdateKey, setScoreUpdateKey] = useState<number>(0); // TSX
    const [animationState, setAnimationState] = useState<{ cardId: string | null; type: 'correct' | 'incorrect' | null }>({ cardId: null, type: null }); // TSX

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

    const buildSentence = useCallback((phrase: Card[], level: Level): string => { // TSX
        if (phrase.length === 0) return "";
        let parts: string[] = [];
        const structure = level.structure;
        
        structure.forEach(category => {
            const card = phrase.find(c => c.category === category);
            if (card) {
                if (card.category === 'acoes') {
                    const subject = phrase.find(c => c.category === 'personagens');
                    if (subject?.person) parts.push(conjugateVerb(card.verb!.infinitive, subject.person));
                } else {
                    parts.push(card.sentenceLabel || card.displayLabel);
                }
            }
        });
        
        let sentence = parts.join(" ");
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        return sentence;
    }, []);

    const startNewPhrase = useCallback(() => {
        const level = gameLevels[currentLevelIndex];
        const possibleStories = storyTemplates.filter(s => s.level === level.level);
        const randomStory = possibleStories[Math.floor(Math.random() * possibleStories.length)];
        
        setCurrentStory(randomStory);
        setCurrentPhrase([]);
        setGameState('playing');
    }, [currentLevelIndex]);

    const startGame = useCallback(() => {
        setCurrentLevelIndex(0);
        setPhrasesCompletedInLevel(0);
        setScore(0);
        startNewPhrase();
    }, [startNewPhrase]);

    const handleCardSelection = (selectedCard: Card) => { // TSX
        if (gameState !== 'playing' || animationState.cardId) return;

        const level = gameLevels[currentLevelIndex];
        const nextStepIndex = currentPhrase.length;
        const nextCategory = level.structure[nextStepIndex];
        const correctCardId = currentStory?.parts[nextCategory];

        if (selectedCard.id === correctCardId) {
            const pointsGained = 10;
            setScore(prev => prev + pointsGained);
            setScoreUpdateKey(prev => prev + 1);
            setAnimationState({ cardId: selectedCard.id, type: 'correct' });
            leoSpeak(`Isso! Mais ${pointsGained} pontos!`);
            
            setTimeout(() => {
                setCurrentPhrase(prev => [...prev, selectedCard]);
                setAnimationState({ cardId: null, type: null });
            }, 700);
        } else {
            setAnimationState({ cardId: selectedCard.id, type: 'incorrect' });
            leoSpeak("Ops, tente outra vez.");
            
            setTimeout(() => {
                setAnimationState({ cardId: null, type: null });
            }, 500);
        }
    };
    
    useEffect(() => {
        if (gameState !== 'playing' || !currentStory) return;

        const level = gameLevels[currentLevelIndex];
        const nextStepIndex = currentPhrase.length;

        if (nextStepIndex >= level.structure.length) {
            setGameState('phraseComplete');
            setPhrasesCompletedInLevel(prev => prev + 1);
            const finalSentence = buildSentence(currentPhrase, level) + ".";
            leoSpeak(`Excelente! Você formou: ${finalSentence}`);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            if ((phrasesCompletedInLevel + 1) % 3 === 0) {
                setShowStarReward(true);
            }
        } else {
            const nextCategory = level.structure[nextStepIndex];
            const correctCardId = currentStory.parts[nextCategory];
            const correctCard = Object.values(allCards).flat().find(c => c.id === correctCardId);

            if (!correctCard) return;

            const allOtherCards = Object.values(allCards).flat().filter(c => c.id !== correctCardId);
            const distractors = allOtherCards.filter(c => c.category !== correctCard.category).sort(() => 0.5 - Math.random()).slice(0, 2);
            if(distractors.length < 2) {
                 distractors.push(...allOtherCards.sort(() => 0.5 - Math.random()).slice(0, 2 - distractors.length));
            }
            const options = [correctCard, ...distractors].sort(() => 0.5 - Math.random());
            setCardOptions(options);
            const instruction = currentStory.prompts[nextCategory] || `Complete a história.`;
            leoSpeak(instruction);
        }
    }, [currentPhrase, currentStory, gameState, currentLevelIndex, buildSentence, leoSpeak, phrasesCompletedInLevel]);

    const handleNext = () => {
        setShowStarReward(false);
        const currentLevel = gameLevels[currentLevelIndex];
        if (phrasesCompletedInLevel >= currentLevel.phrasesToComplete) {
            const nextLevelIndex = currentLevelIndex + 1;
            if (nextLevelIndex < gameLevels.length) {
                setGameState('levelComplete');
                leoSpeak(`Parabéns! Você passou para o Nível ${nextLevelIndex + 1}!`);
                setTimeout(() => {
                    setCurrentLevelIndex(nextLevelIndex);
                    setPhrasesCompletedInLevel(0);
                    startNewPhrase();
                }, 3500);
            } else {
                setGameState('gameOver');
                leoSpeak("Uau! Você completou todos os níveis!");
            }
        } else {
            startNewPhrase();
        }
    };
    
    const renderTitleScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-yellow-200 via-orange-300 to-amber-400 overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-4">
                    <Image src="/images/mascotes/leo/leo_feliz_resultado.webp" alt="Leo" width={400} height={400} className="w-[250px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl" priority />
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-orange-900 drop-shadow-lg mb-4">Histórias Épicas</h1>
                <p className="text-xl sm:text-2xl text-orange-800 mt-2 mb-8 drop-shadow-md">Crie frases e aprenda brincando!</p>
                <button onClick={startGame} className="text-xl font-bold text-white bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95">
                    Começar a Aventura
                </button>
            </div>
        </div>
    );
    
    const renderGame = () => {
        const level = gameLevels[currentLevelIndex];
        if (!level) return <div>Carregando...</div>;
        const progressPercentage = (phrasesCompletedInLevel / level.phrasesToComplete) * 100;
        const displayedSentence = buildSentence(currentPhrase, level);
        const finalSentence = buildSentence(currentPhrase, level) + ".";

        return (
            <div className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200">
                {showConfetti && <Confetti />}
                {showStarReward && <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" onClick={() => setShowStarReward(false)}><div className="star-reward-animate text-yellow-400"><Star size={200} fill="currentColor" /><p className="text-white text-4xl font-bold text-center mt-4">Recompensa!</p></div></div>}
                <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl w-full max-w-6xl mx-auto border-4 border-violet-300">
                    <div className="mb-4">
                        <div className="flex justify-between items-center text-purple-700 font-bold text-lg md:text-xl mb-2">
                            <div className='flex items-center gap-2'><BookText size={24} /> Nível {level.level}: {level.name}</div>
                            <div key={scoreUpdateKey} className={`score-container-update flex items-center gap-2 text-xl font-bold text-yellow-600 bg-yellow-100 px-4 py-2 rounded-full`}>
                                <Star size={24} className="text-yellow-500" />
                                <span>{score} Pontos</span>
                                {scoreUpdateKey > 0 && <span className="score-pop-animation absolute -top-4 right-4 text-green-500 font-bold">+10</span>}
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500"><Star size={24} fill="currentColor"/> {phrasesCompletedInLevel} / {level.phrasesToComplete}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner"><div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl mb-4 border-2 border-yellow-300 min-h-[100px] flex items-center justify-center text-center shadow-inner">
                        <p className="text-2xl md:text-4xl text-purple-800 font-bold leading-relaxed">{gameState === 'phraseComplete' ? finalSentence : displayedSentence || '...'}</p>
                    </div>
                    <div className="relative bg-white p-3 rounded-lg shadow-md text-center mb-4 min-h-[60px] flex items-center justify-center">
                        <p className="text-lg md:text-xl font-medium text-gray-800">{leoMessage}</p>
                    </div>
                    {gameState === 'playing' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {cardOptions.map((card) => {
                                const isAnimating = animationState.cardId === card.id;
                                let animationClass = '';
                                if (isAnimating) {
                                    animationClass = animationState.type === 'correct' ? 'card-correct-animation' : 'card-incorrect-animation';
                                }

                                return (
                                <button 
                                    key={card.id} 
                                    onClick={() => handleCardSelection(card)} 
                                    disabled={!!animationState.cardId}
                                    className={`group p-3 bg-white rounded-xl shadow-lg border-2 border-purple-200 transition-transform duration-200 hover:scale-105 hover:border-purple-500 ${animationClass}`}
                                >
                                    <div className="aspect-square relative w-full h-full">
                                        <Image src={card.image} alt={card.displayLabel} fill style={{ objectFit: 'contain', padding: '0.25rem' }} sizes="25vw" />
                                    </div>
                                    <p className="mt-2 text-center font-bold text-sm md:text-base text-gray-800">{card.displayLabel}</p>
                                </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className='text-center mt-6'>
                            <button onClick={handleNext} className="px-10 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-xl rounded-full shadow-xl hover:scale-105 transition-transform">
                                {gameState === 'gameOver' ? 'Jogar Novamente' : 'Próxima História!'}
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
        </>
    );
}
