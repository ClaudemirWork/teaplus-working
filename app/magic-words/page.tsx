'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BookText, Sparkles, Wand2 } from 'lucide-react';

// --- Interfaces do Jogo (mantidas as mesmas) ---
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

// --- BANCO DE CARDS NARRATIVOS (Pode ser ajustado para o Palavras Mágicas) ---
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
    ],
    emocoes: [
        { id: 'saltar', displayLabel: 'Saltar', sentenceLabel: 'saltar de alegria', image: '/images/cards/acoes/saltar.webp', category: 'emocoes' },
        { id: 'pensar', displayLabel: 'Pensar', sentenceLabel: 'ficar pensativo(a)', image: '/images/cards/acoes/Pensar.webp', category: 'emocoes' },
        { id: 'gritar', displayLabel: 'Gritar', sentenceLabel: 'gritar de raiva', image: '/images/cards/acoes/gritar.webp', category: 'emocoes' },
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
    ],
    tempo: [
        { id: 'hoje', displayLabel: 'Hoje', sentenceLabel: 'Hoje', image: '/images/cards/rotina/hoje.webp', category: 'tempo' },
        { id: 'manha', displayLabel: 'Manhã', sentenceLabel: 'de manhã', image: '/images/cards/rotina/manha.webp', category: 'tempo' },
        { id: 'noite', displayLabel: 'Noite', sentenceLabel: 'de noite', image: '/images/cards/rotina/noite.webp', category: 'tempo' },
    ]
};

// --- NÍVEIS DO JOGO (Pode ser ajustado para o Palavras Mágicas) ---
const storyLevels: StoryLevel[] = [
    {
        level: 1, name: "Primeiras Palavras", storiesToComplete: 3,
        templates: [
            [{ text: "Era uma vez", type: "personagens", options: 3 }, { text: "que gostava de", type: "acoes", options: 3 }, { text: ".", type: "acoes", options: 0 }],
            [{ text: "", type: "tempo", options: 3 }, { text: "", type: "personagens", options: 3 }, { text: "foi", type: "acoes", options: 4 }, { text: ".", type: "acoes", options: 0 }],
            [{ text: "Eu vi", type: "personagens", options: 4 }, { text: "a", type: "acoes", options: 4 }, { text: "", type: "lugares", options: 3 }, { text: ".", type: "acoes", options: 0 }],
        ]
    },
    {
        level: 2, name: "Mundo da Fantasia", storiesToComplete: 4,
        templates: [
            [{ text: "Certo dia,", type: "personagens", options: 4 }, { text: "foi para", type: "lugares", options: 3 }, { text: "para", type: "acoes", options: 4 }, { text: ".", type: "acoes", options: 0 }],
            [{ text: "Na escola, eu gosto de", type: "acoes", options: 4 }, { text: "com", type: "objetos", options: 3 }, { text: "e fico a", type: "emocoes", options: 3 }, { text: ".", type: "acoes", options: 0 }],
        ]
    }
];

export default function PalavrasMagicasGame() {
    const [gameState, setGameState] = useState<'titleScreen' | 'intro' | 'playing' | 'storyComplete' | 'levelComplete' | 'gameOver'>('titleScreen');
    const [introStep, setIntroStep] = useState(0);
    const [milaMessage, setMilaMessage] = useState('');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [storiesCompletedInLevel, setStoriesCompletedInLevel] = useState(0);
    const [currentStoryTemplate, setCurrentStoryTemplate] = useState<StorySegment[]>([]);
    const [storyProgress, setStoryProgress] = useState<StorySegment[]>([]);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [cardOptions, setCardOptions] = useState<Card[]>([]);

    const introMessages = [
        "Bem-vindo ao 'Palavras Mágicas'! Eu sou a Mila e vou te ajudar a formar frases incríveis!",
        "É super fácil! No alto, vamos ter o começo de uma frase...",
        "Você escolhe um card para continuar a frase, e eu leio como ficou. Vamos avançando até o final!",
        "Pronto para começar a magia das palavras comigo?"
    ];

    const milaSpeak = useCallback((message: string) => {
        setMilaMessage(message);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.0; // A Mila pode falar um pouquinho mais rápido
            window.speechSynthesis.speak(utterance);
        }
    }, []);

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
            milaSpeak("Incrível! Você completou todas as fases de Palavras Mágicas!");
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
        const firstSegmentText = randomTemplate[0] ? randomTemplate[0].text : "Vamos lá...";
        milaSpeak(`Vamos criar uma nova frase! ${firstSegmentText}...`);
    }, [milaSpeak]);

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
        let nextSegmentIndex = currentSegmentIndex + 1;
        
        // Pula segmentos que não precisam de cards (como o ponto final)
        while(nextSegmentIndex < currentStoryTemplate.length && currentStoryTemplate[nextSegmentIndex].options === 0) {
            nextSegmentIndex++;
        }

        const isStoryFinished = nextSegmentIndex >= currentStoryTemplate.length;
        if (isStoryFinished) {
            const finalStoryText = updatedProgress
                .map(s => `${s.text} ${s.selectedCard ? s.selectedCard.sentenceLabel : ''}`)
                .join(' ').replace(/\s+/g, ' ').trim();
            milaSpeak(`Sua frase ficou assim: "${finalStoryText}". Perfeito!`);
            setStoriesCompletedInLevel(prev => prev + 1);
            setGameState('storyComplete');
        } else {
            setCurrentSegmentIndex(nextSegmentIndex);
            const nextSegment = currentStoryTemplate[nextSegmentIndex];
            if (nextSegment && nextSegment.options > 0) {
                generateCardOptions(nextSegment);
                milaSpeak(`Ótimo! Agora, ${nextSegment.text || '...'} `);
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
                milaSpeak(`Eba! Você completou a fase ${level.name}! Vamos para a próxima!`);
                setTimeout(() => loadNewStory(nextLevelIndex), 3000);
            } else {
                setGameState('gameOver');
                milaSpeak("Uau! Você completou tudo! Você é um mestre das palavras mágicas!");
            }
        } else {
            loadNewStory(currentLevelIndex);
        }
    }, [currentLevelIndex, storiesCompletedInLevel, loadNewStory, milaSpeak]);
    
    // --- COMPONENTES DE RENDERIZAÇÃO ---

    const renderTitleScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center bg-gradient-to-b from-[#2a0c42] to-[#6d1d61] overflow-hidden">
            {/* Efeitos de Partículas Mágicas com Tailwind */}
            <div className="absolute top-0 left-0 w-full h-full particles-bg animate-zoom"></div>

            <div className="relative z-10 flex flex-col items-center text-center text-white animate-fade-in">
                <div className="animate-float">
                    <Image
                        src="/images/mascotes/mila/mila_fada_resultado.webp" // <-- Mascote MILA
                        alt="Mila Fada"
                        width={380}
                        height={380}
                        className="w-[220px] h-auto sm:w-[320px] md:w-[380px] drop-shadow-2xl mb-[-25px]"
                        priority
                    />
                </div>
                <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-bold text-pink-300 title-text-shadow-magic tracking-wider">
                    Palavras Mágicas
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 mt-4 mb-10 drop-shadow-md">
                    Uma aventura de letras e descobertas
                </p>
                <button 
                    onClick={handleStartIntro} 
                    className="text-xl font-bold text-[#2a0c42] bg-gradient-to-r from-pink-400 to-purple-400 rounded-full px-10 py-4 shadow-lg cta-shadow-magic transition-transform duration-300 ease-in-out hover:scale-105 animate-pulse-magic"
                >
                    Começar a Magia
                </button>
            </div>
        </div>
    );

    const renderIntro = () => (
        <div className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-300 via-pink-200 to-orange-200">
            <div className="relative z-10 flex flex-col items-center text-center p-6 bg-white/95 rounded-3xl shadow-2xl max-w-xl mx-auto border-4 border-pink-400 animate-scale-in">
                <div className="w-48 h-auto drop-shadow-xl mb-4">
                    <Image src="/images/mascotes/mila/mila_fada_resultado.webp" alt="Mila Fada" width={200} height={200} className="w-full h-full object-contain" priority/>
                </div>
                <h1 className="text-3xl font-bold text-purple-600 mb-4">Como Jogar</h1>
                <p className="text-base text-gray-700 mb-8 min-h-[100px] flex items-center justify-center">{milaMessage}</p>
                <button onClick={handleIntroNext} className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                    {introStep < introMessages.length - 1 ? 'Entendi, vamos lá! →' : 'Começar!'}
                </button>
            </div>
        </div>
    );

    const renderGame = () => {
        const level = storyLevels[currentLevelIndex];
        return (
            <div className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
                <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl w-full max-w-6xl mx-auto border-4 border-pink-300 animate-fade-in">
                    <div className="flex justify-between items-center bg-gradient-to-r from-pink-200 to-purple-200 p-3 rounded-t-xl -m-4 md:-m-6 mb-6 shadow-md">
                        <div className="flex items-center gap-2 text-purple-700 font-bold text-lg md:text-xl"><BookText size={24} /> Fase {level.level}: {level.name}</div>
                        <div className="flex items-center gap-2 text-pink-700 font-bold text-lg md:text-xl"><Wand2 size={24} /> Frases: {storiesCompletedInLevel} / {level.storiesToComplete}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl mb-6 border-2 border-purple-200 min-h-[100px] flex items-center justify-center text-center shadow-inner">
                        <p className="text-xl md:text-2xl text-gray-800 font-semibold leading-relaxed">
                            {storyProgress.map((segment, index) => (
                                <span key={index} className={index === currentSegmentIndex && gameState === 'playing' ? 'font-bold text-purple-700 animate-pulse-text' : ''}>
                                    {segment.text}{' '}
                                    {segment.selectedCard ? (<span className="inline-block bg-white px-2 py-1 rounded-md shadow-sm font-bold text-pink-700 text-xl md:text-2xl border border-pink-200 mx-1">{segment.selectedCard.displayLabel}</span>) : (segment.options > 0 && <span className="text-gray-400 text-xl md:text-2xl">_____</span>)}
                                    {' '}
                                </span>
                            ))}
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 my-6 justify-center">
                        <div className="w-28 h-28 md:w-36 md:h-36 relative flex-shrink-0">
                            <Image src="/images/mascotes/mila/mila_rosto_resultado.webp" alt="Mila" fill sizes="(max-width: 768px) 112px, 144px" className="rounded-full border-4 border-pink-500 shadow-lg animate-float" />
                        </div>
                        <div className="relative bg-white p-4 rounded-lg shadow-md flex-1 text-center min-h-[80px] flex items-center justify-center">
                            <p className="text-lg md:text-xl font-medium text-gray-800">{milaMessage}</p>
                        </div>
                    </div>
                    {gameState === 'playing' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6 animate-fade-in-up">
                            {cardOptions.map(card => (
                                <button key={card.id} onClick={() => handleCardSelection(card)} className="p-3 bg-white rounded-xl shadow-lg border-3 border-pink-200 hover:border-pink-500 hover:scale-105 transition-all transform focus:outline-none focus:ring-4 focus:ring-pink-300 active:scale-98 relative overflow-hidden group">
                                    <div className="aspect-square relative bg-white rounded-md overflow-hidden border border-gray-100">
                                        <Image src={card.image} alt={card.displayLabel} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" className="object-contain p-1 group-hover:scale-105 transition-transform duration-200" />
                                    </div>
                                    <p className="mt-2 text-center font-bold text-sm md:text-base text-gray-800 group-hover:text-purple-700 transition-colors">{card.displayLabel}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center mt-8 animate-fade-in-up'>
                            <button onClick={handleNextStoryOrLevel} className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xl rounded-full shadow-xl hover:shadow-2xl animate-pulse-fade hover:scale-105 transition-all duration-300">
                                {storiesCompletedInLevel >= level.storiesToComplete ? 'Próxima Fase!' : 'Próxima Frase!'}
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
            case 'intro': return renderIntro();
            default: return renderGame();
        }
    };
    
    return (
        <>
            {renderContent()}
            <style jsx global>{`
                /* Dica: Para a fonte do título ficar perfeita, importe no seu layout.tsx ou no global.css */
                /* @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap'); */
                .font-display {
                    font-family: 'Patrick Hand', cursive, sans-serif; /* Fonte mais amigável */
                }

                /* Animações e Estilos Compartilhados */
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes zoom { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse-fade { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
                @keyframes pulse-text { 0%, 100% { color: #8b5cf6; } 50% { color: #7c3aed; } }
                @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

                .animate-float { animation: float 4s ease-in-out infinite; }
                .animate-fade-in { animation: fadeIn 1s ease-in-out; }
                .animate-zoom { animation: zoom 40s infinite; }
                .animate-fade-in-up { animation: fade-in-up 0.7s ease-out forwards; }
                .animate-pulse-fade { animation: pulse-fade 2s infinite ease-in-out; }
                .animate-pulse-text { animation: pulse-text 1.5s infinite alternate ease-in-out; }
                .animate-scale-in { animation: scale-in 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; }
                
                /* Animação específica do botão da tela de título */
                @keyframes pulse-magic { 
                  0%, 100% { 
                    transform: scale(1); 
                    box-shadow: 0 0 15px #f472b6, 0 0 25px #c084fc; 
                  } 
                  50% { 
                    transform: scale(1.03); 
                    box-shadow: 0 0 25px #f472b6, 0 0 40px #a855f7; 
                  } 
                }

                .animate-pulse-magic {
                    animation: pulse-magic 2.5s infinite;
                }

                /* Estilo do fundo de partículas mágicas */
                .particles-bg::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(1.5px 1.5px at 15% 35%, #f9a8d4, transparent),
                        radial-gradient(1px 1px at 70% 15%, white, transparent),
                        radial-gradient(2px 2px at 50% 60%, #e9d5ff, transparent),
                        radial-gradient(1.5px 1.5px at 85% 80%, #f9a8d4, transparent),
                        radial-gradient(2.5px 2.5px at 25% 85%, white, transparent),
                        radial-gradient(1px 1px at 5% 5%, #e9d5ff, transparent);
                    background-repeat: repeat;
                    background-size: 250px 250px;
                    opacity: 0.9;
                }
                
                .title-text-shadow-magic {
                    text-shadow: 0 0 8px rgba(244, 114, 182, 0.7), 0 0 16px rgba(192, 132, 252, 0.5), 0 0 24px rgba(233, 213, 255, 0.5);
                }
                .cta-shadow-magic {
                    box-shadow: 0 0 15px rgba(244, 114, 182, 0.6), 0 0 25px rgba(192, 132, 252, 0.4);
                }
            `}</style>
        </>
    );
}
