'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BookText, Sparkles, Wand2 } from 'lucide-react';

// --- Interfaces do Jogo ---
interface Card {
    id: string;
    displayLabel: string;
    sentenceLabel: string;
    image: string;
    category: 'personagens' | 'acoes' | 'emocoes' | 'lugares' | 'objetos' | 'tempo';
}

interface StorySegment {
    text: string;
    type: Card['category'];
    options: number;
    selectedCard?: Card;
}

interface StoryLevel {
    level: number;
    name: string;
    storiesToComplete: number;
    templates: StorySegment[][];
}

// --- BANCO DE CARDS NARRATIVOS (MAPEAMENTO FIEL E AUDITADO) ---
const narrativeCards: { [key in Card['category']]: Card[] } = {
    personagens: [
        { id: 'cachorro', displayLabel: 'Cachorro', sentenceLabel: 'um cachorro', image: '/images/cards/animais/cachorro.webp', category: 'personagens' },
        { id: 'gato', displayLabel: 'Gato', sentenceLabel: 'um gato', image: '/images/cards/animais/gato.webp', category: 'personagens' },
        { id: 'cavalo', displayLabel: 'Cavalo', sentenceLabel: 'um cavalo', image: '/images/cards/animais/cavalo.webp', category: 'personagens' },
        { id: 'eu', displayLabel: 'Eu', sentenceLabel: 'eu', image: '/images/cards/core/eu.webp', category: 'personagens' },
        { id: 'voce', displayLabel: 'Você', sentenceLabel: 'você', image: '/images/cards/core/voce.webp', category: 'personagens' },
    ],
    acoes: [
        { id: 'brincar', displayLabel: 'Brincar', sentenceLabel: 'brincar', image: '/images/cards/rotina/brincar.webp', category: 'acoes' },
        { id: 'caminhar', displayLabel: 'Caminhar', sentenceLabel: 'caminhar', image: '/images/cards/acoes/caminhar.webp', category: 'acoes' },
        { id: 'beber', displayLabel: 'Beber', sentenceLabel: 'beber', image: '/images/cards/acoes/beber.webp', category: 'acoes' },
        { id: 'estudar', displayLabel: 'Estudar', sentenceLabel: 'estudar', image: '/images/cards/rotina/estudar.webp', category: 'acoes' },
        { id: 'ler_livro', displayLabel: 'Ler Livro', sentenceLabel: 'ler um livro', image: '/images/cards/acoes/ler_livro.webp', category: 'acoes' },
        { id: 'conversar', displayLabel: 'Conversar', sentenceLabel: 'conversar', image: '/images/cards/acoes/conversar.webp', category: 'acoes' },
        { id: 'escrever', displayLabel: 'Escrever', sentenceLabel: 'escrever', image: '/images/cards/acoes/escrever.webp', category: 'acoes' },
        { id: 'comer', displayLabel: 'Comer', sentenceLabel: 'comer', image: '/images/cards/acoes/mastigar.webp', category: 'acoes' },
    ],
    emocoes: [
        { id: 'saltar', displayLabel: 'Saltar', sentenceLabel: 'saltar de alegria', image: '/images/cards/acoes/saltar.webp', category: 'emocoes' },
        { id: 'pensar', displayLabel: 'Pensar', sentenceLabel: 'ficar pensativo(a)', image: '/images/cards/acoes/Pensar.webp', category: 'emocoes' },
        { id: 'gritar', displayLabel: 'Gritar', sentenceLabel: 'gritar de raiva', image: '/images/cards/acoes/gritar.webp', category: 'emocoes' },
        { id: 'aplaudir', displayLabel: 'Aplaudir', sentenceLabel: 'aplaudir animadamente', image: '/images/cards/acoes/aplaudir.webp', category: 'emocoes' },
    ],
    lugares: [
        { id: 'sofa', displayLabel: 'Sofá', sentenceLabel: 'no sofá', image: '/images/cards/casa/sofa.webp', category: 'lugares' },
        { id: 'cama', displayLabel: 'Cama', sentenceLabel: 'na cama', image: '/images/cards/casa/cama.webp', category: 'lugares' },
        { id: 'mesa', displayLabel: 'Mesa', sentenceLabel: 'na mesa', image: '/images/cards/casa/mesa.webp', category: 'lugares' },
    ],
    objetos: [
        { id: 'livro', displayLabel: 'Livro', sentenceLabel: 'o livro', image: '/images/cards/escola/livro.webp', category: 'objetos' },
        { id: 'maca', displayLabel: 'Maçã', sentenceLabel: 'a maçã', image: '/images/cards/alimentos/maca.webp', category: 'objetos' },
        { id: 'lapis', displayLabel: 'Lápis', sentenceLabel: 'o lápis', image: '/images/cards/escola/lapis.webp', category: 'objetos' },
        { id: 'caderno', displayLabel: 'Caderno', sentenceLabel: 'o caderno', image: '/images/cards/escola/caderno.webp', category: 'objetos' },
    ],
    tempo: [
        { id: 'hoje', displayLabel: 'Hoje', sentenceLabel: 'Hoje', image: '/images/cards/rotina/hoje.webp', category: 'tempo' },
        { id: 'manha', displayLabel: 'Manhã', sentenceLabel: 'de manhã', image: '/images/cards/rotina/manha.webp', category: 'tempo' },
        { id: 'noite', displayLabel: 'Noite', sentenceLabel: 'de noite', image: '/images/cards/rotina/noite.webp', category: 'tempo' },
        { id: 'tarde', displayLabel: 'Tarde', sentenceLabel: 'de tarde', image: '/images/cards/rotina/Tarde.webp', category: 'tempo' },
    ]
};

const storyLevels: StoryLevel[] = [
    {
        level: 1, name: "Primeiras Aventuras", storiesToComplete: 3,
        templates: [
            [{ text: "Era uma vez", type: "personagens", options: 3 }, { text: "que estava a", type: "emocoes", options: 3 }, { text: ".", type: "acoes", options: 0 }],
            [{ text: "", type: "tempo", options: 3 }, { text: "", type: "personagens", options: 3 }, { text: "foi", type: "acoes", options: 4 }, { text: ".", type: "acoes", options: 0 }],
            [{ text: "Eu vi", type: "personagens", options: 4 }, { text: "a", type: "acoes", options: 4 }, { text: "", type: "lugares", options: 3 }, { text: ".", type: "acoes", options: 0 }],
        ]
    },
    {
        level: 2, name: "Mundo de Descobertas", storiesToComplete: 4,
        templates: [
            [{ text: "Certo dia,", type: "personagens", options: 4 }, { text: "foi para", type: "lugares", options: 3 }, { text: "para", type: "acoes", options: 4 }, { text: ".", type: "acoes", options: 0 }],
            [{ text: "Na escola, eu gosto de", type: "acoes", options: 4 }, { text: "com", type: "objetos", options: 3 }, { text: "e fico a", type: "emocoes", options: 3 }, { text: ".", type: "acoes", options: 0 }],
            [{ text: "De repente, ", type: "personagens", options: 3 }, { text: "encontrou", type: "objetos", options: 3 }, { text: "e decidiu", type: "emocoes", options: 3 }, { text: ".", type: "acoes", options: 0 }]
        ]
    }
];

export default function HistoriasEpicasGame() {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'storyComplete' | 'levelComplete' | 'gameOver'>('intro');
    const [introStep, setIntroStep] = useState(0);
    const [leoMessage, setLeoMessage] = useState('');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [storiesCompletedInLevel, setStoriesCompletedInLevel] = useState(0);
    const [currentStoryTemplate, setCurrentStoryTemplate] = useState<StorySegment[]>([]);
    const [storyProgress, setStoryProgress] = useState<StorySegment[]>([]);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [cardOptions, setCardOptions] = useState<Card[]>([]);

    const introMessages = [
        "Bem vindo ao jogo 'Histórias Épicas', aqui eu vou te ajudar a construir suas próprias estórias...",
        "O jogo é bem simples. No alto, temos a frase que é o começo da sua estória...",
        "Ao escolher o card, vou ler a parte da história que você montou. Quando terminar, seguimos em frente.",
        "Vamos comigo, escrever histórias lindas?"
    ];

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

    useEffect(() => {
        if (gameState === 'intro') {
            leoSpeak(introMessages[0]);
        }
    }, [gameState, leoSpeak]);

    const handleIntroNext = () => {
        const nextStep = introStep + 1;
        if (nextStep < introMessages.length) {
            setIntroStep(nextStep);
            leoSpeak(introMessages[nextStep]);
        } else {
            startGame();
        }
    };

    const startGame = useCallback(() => {
        setGameState('playing');
        setCurrentLevelIndex(0);
        setStoriesCompletedInLevel(0);
        loadNewStory(0);
    }, []);

    const loadNewStory = useCallback((levelIndex: number) => {
        const level = storyLevels[levelIndex];
        if (!level) {
            setGameState('gameOver');
            leoSpeak("Parabéns! Você completou todas as fases de Histórias Épicas!");
            return;
        }
        const randomTemplate = [...level.templates[Math.floor(Math.random() * level.templates.length)]];
        const initialProgress = randomTemplate.map(segment => ({ ...segment, selectedCard: undefined }));
        setCurrentStoryTemplate(randomTemplate);
        setStoryProgress(initialProgress);
        setCurrentSegmentIndex(0);
        if (randomTemplate[0] && randomTemplate[0].options > 0) {
            generateCardOptions(randomTemplate[0]);
        } else {
            setCardOptions([]);
        }
        setGameState('playing');
        const firstSegmentText = randomTemplate[0] ? randomTemplate[0].text : "Começando...";
        leoSpeak(`Vamos criar uma nova história! ${firstSegmentText}...`);
    }, [leoSpeak]);

    const generateCardOptions = useCallback((segment: StorySegment) => {
        const { type, options } = segment;
        const allCardsInCategory = narrativeCards[type];
        if (!allCardsInCategory || allCardsInCategory.length === 0) {
            setCardOptions([]);
            return;
        }
        const shuffled = [...allCardsInCategory].sort(() => 0.5 - Math.random());
        setCardOptions(shuffled.slice(0, options));
    }, []);

    const handleCardSelection = (card: Card) => {
        if (gameState !== 'playing') return;
        const updatedProgress = [...storyProgress];
        updatedProgress[currentSegmentIndex].selectedCard = card;
        setStoryProgress(updatedProgress);
        const nextSegmentIndex = currentSegmentIndex + 1;
        const preenchableSegments = currentStoryTemplate.filter(s => s.options > 0);
        const isStoryFinished = nextSegmentIndex >= preenchableSegments.length;
        if (isStoryFinished) {
            const finalStoryText = updatedProgress
                .map(s => `${s.text} ${s.selectedCard ? s.selectedCard.sentenceLabel : ''}`)
                .join(' ').replace(/\s+/g, ' ').trim();
            leoSpeak(`Sua história ficou assim: "${finalStoryText}". Incrível!`);
            setStoriesCompletedInLevel(prev => prev + 1);
            setGameState('storyComplete');
        } else {
            setCurrentSegmentIndex(nextSegmentIndex);
            const nextSegment = currentStoryTemplate[nextSegmentIndex];
            if (nextSegment && nextSegment.options > 0) {
                generateCardOptions(nextSegment);
                leoSpeak(`Perfeito! Agora, ${nextSegment.text || '...'} `);
            }
        }
    };

    const handleNextStoryOrLevel = useCallback(() => {
        const level = storyLevels[currentLevelIndex];
        if (storiesCompletedInLevel >= level.storiesToComplete) {
            const nextLevelIndex = currentLevelIndex + 1;
            if (nextLevelIndex < storyLevels.length) {
                setCurrentLevelIndex(nextLevelIndex);
                setStoriesCompletedInLevel(0);
                leoSpeak(`Parabéns! Você completou a fase ${level.name}! Vamos para a próxima aventura!`);
                setTimeout(() => loadNewStory(nextLevelIndex), 3000);
            } else {
                setGameState('gameOver');
                leoSpeak("Uau! Você completou todas as histórias! Você é um escritor épico!");
            }
        } else {
            loadNewStory(currentLevelIndex);
        }
    }, [currentLevelIndex, storiesCompletedInLevel, loadNewStory, leoSpeak]);

    const AnimatedBackground = () => (
        <div className="absolute inset-0 z-[-1] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-300 via-pink-200 to-orange-200 opacity-80 animate-gradient-shift"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-blue-300 via-green-200 to-yellow-200 opacity-80 animate-gradient-shift-reverse blur-3xl"></div>
        </div>
    );

    const renderIntro = () => (
        <div className="flex flex-col items-center text-center p-6 bg-white/95 rounded-3xl shadow-2xl max-w-xl mx-auto border-4 border-violet-400 animate-scale-in">
            <div className="w-48 h-auto drop-shadow-xl mb-4">
                <Image src="/images/mascotes/leo/leo_mago_resultado.webp" alt="Leo Mago" width={200} height={200} className="w-full h-full object-contain" priority/>
            </div>
            <h1 className="text-3xl font-bold text-orange-600 mb-4">Como Jogar</h1>
            <p className="text-base text-gray-700 mb-8 min-h-[100px] flex items-center justify-center">{leoMessage}</p>
            <button onClick={handleIntroNext} className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                {introStep < introMessages.length - 1 ? 'Entendi, próximo! →' : 'Vamos Começar!'}
            </button>
        </div>
    );

    const renderGame = () => {
        const level = storyLevels[currentLevelIndex];
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl w-full max-w-6xl mx-auto border-4 border-violet-300 animate-fade-in">
                <div className="flex justify-between items-center bg-gradient-to-r from-violet-200 to-pink-200 p-3 rounded-t-xl -m-4 md:-m-6 mb-6 shadow-md">
                    <div className="flex items-center gap-2 text-purple-700 font-bold text-lg md:text-xl"><BookText size={24} /> Fase {level.level}: {level.name}</div>
                    <div className="flex items-center gap-2 text-pink-700 font-bold text-lg md:text-xl"><Wand2 size={24} /> Histórias: {storiesCompletedInLevel} / {level.storiesToComplete}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl mb-6 border-2 border-yellow-300 min-h-[100px] flex items-center justify-center text-center shadow-inner">
                    <p className="text-xl md:text-2xl text-gray-800 font-semibold leading-relaxed">
                        {storyProgress.map((segment, index) => (
                            <span key={index} className={index === currentSegmentIndex && gameState === 'playing' ? 'font-bold text-blue-700 animate-pulse-text' : ''}>
                                {segment.text}{' '}
                                {segment.selectedCard ? (<span className="inline-block bg-white px-2 py-1 rounded-md shadow-sm font-bold text-purple-700 text-xl md:text-2xl border border-purple-200 mx-1">{segment.selectedCard.displayLabel}</span>) : (segment.options > 0 && <span className="text-gray-400 text-xl md:text-2xl">_____</span>)}
                                {' '}
                            </span>
                        ))}
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 my-6 justify-center">
                    <div className="w-28 h-28 md:w-36 md:h-36 relative flex-shrink-0">
                        <Image src="/images/mascotes/leo/leo_rosto_resultado.webp" alt="Leo" fill sizes="(max-width: 768px) 112px, 144px" className="rounded-full border-4 border-orange-500 shadow-lg animate-float" />
                    </div>
                    <div className="relative bg-white p-4 rounded-lg shadow-md flex-1 text-center min-h-[80px] flex items-center justify-center">
                        <p className="text-lg md:text-xl font-medium text-gray-800">{leoMessage}</p>
                    </div>
                </div>
                {gameState === 'playing' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6 animate-fade-in-up">
                        {cardOptions.map(card => (
                            <button key={card.id} onClick={() => handleCardSelection(card)} className="p-3 bg-white rounded-xl shadow-lg border-3 border-purple-200 hover:border-purple-500 hover:scale-105 transition-all transform focus:outline-none focus:ring-4 focus:ring-purple-300 active:scale-98 relative overflow-hidden group">
                                <div className="aspect-square relative bg-white rounded-md overflow-hidden border border-gray-100">
                                    <Image src={card.image} alt={card.displayLabel} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" className="object-contain p-1 group-hover:scale-105 transition-transform duration-200" />
                                </div>
                                <p className="mt-2 text-center font-bold text-sm md:text-base text-gray-800 group-hover:text-purple-700 transition-colors">{card.displayLabel}</p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className='text-center mt-8 animate-fade-in-up'>
                        <button onClick={handleNextStoryOrLevel} className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xl rounded-full shadow-xl hover:shadow-2xl animate-pulse-fade hover:scale-105 transition-all duration-300">
                            {storiesCompletedInLevel >= level.storiesToComplete ? 'Próxima Fase!' : 'Próxima História!'}
                        </button>
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className="min-h-screen relative font-sans overflow-hidden flex justify-center items-center p-4">
            <AnimatedBackground />
            {gameState === 'intro' ? renderIntro() : renderGame()}

            <style jsx global>{`
                /* Adicionando animações globais para reutilização */
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
                .animate-scale-in { animation: scale-in 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; }
                /* ...outras animações... */
            `}</style>
        </div>
    );
}
