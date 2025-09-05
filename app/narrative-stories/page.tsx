'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BookText, Star } from 'lucide-react';

// --- INTERFACES ATUALIZADAS ---
interface Card {
    id: string;
    displayLabel: string;
    sentenceLabel: string;
    image: string;
    category: 'personagens' | 'acoes' | 'emocoes' | 'lugares' | 'objetos' | 'tempo';
    compatibleWith?: {
        category: Card['category'];
        ids: string[];
    };
}

interface Level {
    level: number;
    name: string;
    phrasesToComplete: number;
    structure: Card['category'][];
}

// --- BANCO DE CARDS COMPLETO (MAPEADO DOS SEUS ARQUIVOS) ---
// Certifique-se que esta lista está completa com todos os seus cards!
const allCards: { [key in Card['category']]: Card[] } = {
    personagens: [
        { id: 'cachorro', displayLabel: 'Cachorro', sentenceLabel: 'o cachorro', image: '/narrative_cards/personagens/cachorro.webp', category: 'personagens' },
        { id: 'gatinho', displayLabel: 'Gatinho', sentenceLabel: 'o gatinho', image: '/narrative_cards/personagens/gatinho.webp', category: 'personagens' },
        { id: 'eu_homem', displayLabel: 'Eu', sentenceLabel: 'eu', image: '/narrative_cards/personagens/eu_homem.webp', category: 'personagens' },
        { id: 'eu_mulher', displayLabel: 'Eu', sentenceLabel: 'eu', image: '/narrative_cards/personagens/eu_mulher.webp', category: 'personagens' },
        { id: 'voce', displayLabel: 'Você', sentenceLabel: 'você', image: '/narrative_cards/personagens/voce.webp', category: 'personagens' },
        { id: 'medico', displayLabel: 'Médico', sentenceLabel: 'o médico', image: '/narrative_cards/personagens/medico.webp', category: 'personagens' },
        { id: 'policial', displayLabel: 'Policial', sentenceLabel: 'o policial', image: '/narrative_cards/personagens/policial.webp', category: 'personagens' },
        { id: 'professor', displayLabel: 'Professor', sentenceLabel: 'o professor', image: '/narrative_cards/personagens/professor.webp', category: 'personagens' },
        { id: 'professora', displayLabel: 'Professora', sentenceLabel: 'a professora', image: '/narrative_cards/personagens/professora.webp', category: 'personagens' },
    ],
    acoes: [
        { id: 'comer', displayLabel: 'Comer', sentenceLabel: 'come', image: '/narrative_cards/acoes/comer.webp', category: 'acoes', compatibleWith: { category: 'objetos', ids: ['hamburguer_fritas', 'pizza', 'sopa_vegetais', 'biscoito_chocolate', 'cachorro_quente'] } },
        { id: 'brincar', displayLabel: 'Brincar', sentenceLabel: 'brinca com', image: '/narrative_cards/acoes/brincar.webp', category: 'acoes', compatibleWith: { category: 'objetos', ids: ['bola_praia', 'brinquedo_menina', 'carrinho_brinquedo', 'video_game'] } },
        { id: 'dirigir', displayLabel: 'Dirigir', sentenceLabel: 'dirige', image: '/narrative_cards/acoes/dirigir.webp', category: 'acoes', compatibleWith: { category: 'objetos', ids: ['carro_mae', 'carro_pai', 'jeep', 'micro_onibus'] } },
        { id: 'ler_livro', displayLabel: 'Ler', sentenceLabel: 'lê', image: '/narrative_cards/acoes/ler_livro.webp', category: 'acoes', compatibleWith: { category: 'objetos', ids: ['livro'] } },
        { id: 'sentar', displayLabel: 'Sentar', sentenceLabel: 'senta', image: '/narrative_cards/acoes/sentar.webp', category: 'acoes', compatibleWith: { category: 'lugares', ids: ['cadeira_mesa', 'sofa_dois_lugares', 'cama', 'banqueta'] } },
        { id: 'dormir_lado', displayLabel: 'Dormir', sentenceLabel: 'dorme', image: '/narrative_cards/acoes/dormir_lado.webp', category: 'acoes', compatibleWith: { category: 'lugares', ids: ['cama', 'sofa_dois_lugares'] } },
        { id: 'caminhar', displayLabel: 'Caminhar', sentenceLabel: 'caminha', image: '/narrative_cards/acoes/caminhar.webp', category: 'acoes' },
        { id: 'correr', displayLabel: 'Correr', sentenceLabel: 'corre', image: '/narrative_cards/acoes/correr.webp', category: 'acoes' },
        { id: 'beber', displayLabel: 'Beber', sentenceLabel: 'bebe', image: '/narrative_cards/acoes/beber.webp', category: 'acoes', compatibleWith: { category: 'objetos', ids: ['suco_laranja', 'suco_uva', 'chocolate_quente', 'xicara_cafe'] } },
        { id: 'estudar', displayLabel: 'Estudar', sentenceLabel: 'estuda', image: '/narrative_cards/acoes/estudar.webp', category: 'acoes' },
    ],
    objetos: [
        { id: 'bola_praia', displayLabel: 'Bola', sentenceLabel: 'a bola', image: '/narrative_cards/objetos/bola_praia.webp', category: 'objetos' },
        { id: 'hamburguer_fritas', displayLabel: 'Hambúrguer', sentenceLabel: 'o hambúrguer', image: '/narrative_cards/objetos/hamburguer_fritas.webp', category: 'objetos' },
        { id: 'pizza', displayLabel: 'Pizza', sentenceLabel: 'a pizza', image: '/narrative_cards/objetos/pizza.webp', category: 'objetos' },
        { id: 'carro_pai', displayLabel: 'Carro', sentenceLabel: 'o carro', image: '/narrative_cards/objetos/carro_pai.webp', category: 'objetos' },
        { id: 'livro', displayLabel: 'Livro', sentenceLabel: 'o livro', image: '/narrative_cards/objetos/livro.webp', category: 'objetos' },
    ],
    lugares: [
        { id: 'cama', displayLabel: 'Cama', sentenceLabel: 'na cama', image: '/narrative_cards/lugares/cama.webp', category: 'lugares' },
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
    { level: 3, name: "Onde Acontece?", phrasesToComplete: 20, structure: ['personagens', 'acoes', 'lugares'] },
];

// --- COMPONENTE DO JOGO COMPLETO ---
export default function HistoriasEpicasGame() {
    const [gameState, setGameState] = useState<'titleScreen' | 'intro' | 'playing' | 'phraseComplete' | 'levelComplete' | 'gameOver'>('titleScreen');
    const [introStep, setIntroStep] = useState(0);
    const [leoMessage, setLeoMessage] = useState('');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [phrasesCompletedInLevel, setPhrasesCompletedInLevel] = useState(0);
    const [currentPhrase, setCurrentPhrase] = useState<Card[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [cardOptions, setCardOptions] = useState<Card[]>([]);

    const introMessages = [
        "Bem-vindo ao novo Histórias Épicas! Vamos montar frases juntos!",
        "Primeiro, escolha uma peça para começar a frase.",
        "Depois, vamos completar a ideia. Eu vou ler a frase que você criar no final.",
        "A cada frase, você ganha uma estrela! Vamos começar?",
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

    const generateCardOptions = useCallback((category: Card['category'], previousCard?: Card) => {
        let potentialCards = allCards[category];
        if (potentialCards.length === 0) {
            console.error(`A categoria "${category}" não tem cards definidos em 'allCards'.`);
            setCardOptions([]);
            return;
        }

        if (previousCard?.compatibleWith && previousCard.compatibleWith.category === category) {
            potentialCards = potentialCards.filter(card => previousCard.compatibleWith!.ids.includes(card.id));
        }

        const shuffled = [...potentialCards].sort(() => 0.5 - Math.random());
        setCardOptions(shuffled.slice(0, 4));
    }, []);
    
    const loadNewPhrase = useCallback((levelIdx: number) => {
        const level = gameLevels[levelIdx];
        setCurrentPhrase([]);
        setCurrentStepIndex(0);
        setGameState('playing');
        generateCardOptions(level.structure[0]);
        leoSpeak(`Nível ${level.level}: ${level.name}. Vamos começar a frase!`);
    }, [generateCardOptions, leoSpeak]);

    const startGame = useCallback(() => {
        setCurrentLevelIndex(0);
        setPhrasesCompletedInLevel(0);
        loadNewPhrase(0);
    }, [loadNewPhrase]);

    const handleStartIntro = () => { setGameState('intro'); leoSpeak(introMessages[0]); };
    
    const handleIntroNext = () => {
        const nextStep = introStep + 1;
        if (nextStep < introMessages.length) {
            setIntroStep(nextStep);
            leoSpeak(introMessages[nextStep]);
        } else {
            startGame();
        }
    };
    
    const handleCardSelection = (card: Card) => {
        if (gameState !== 'playing') return;

        const newPhrase = [...currentPhrase, card];
        setCurrentPhrase(newPhrase);
        const nextStepIndex = currentStepIndex + 1;
        const currentLevel = gameLevels[currentLevelIndex];

        if (nextStepIndex >= currentLevel.structure.length) {
            setGameState('phraseComplete');
            const finalSentence = newPhrase.map(c => c.sentenceLabel).join(' ').trim() + ".";
            const capitalizedSentence = finalSentence.charAt(0).toUpperCase() + finalSentence.slice(1);
            
            leoSpeak(`Você formou: "${capitalizedSentence}"! Ganhou uma estrela!`);
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
        <div className="relative w-full h-screen flex justify-center items-center bg-gradient-to-b from-[#1e0c42] to-[#431d6d] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full stars-bg animate-zoom"></div>
            <div className="relative z-10 flex flex-col items-center text-center text-white animate-fade-in">
                <div className="animate-float">
                    <Image src="/images/mascotes/leo/leo_mago_resultado.webp" alt="Leo Mago" width={350} height={350} className="w-[200px] h-auto sm:w-[300px] md:w-[350px] drop-shadow-2xl mb-[-20px]" priority/>
                </div>
                <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-bold text-yellow-400 title-text-shadow tracking-wider">Histórias Épicas</h1>
                <p className="text-lg sm:text-xl text-gray-200 mt-4 mb-10 drop-shadow-md">Uma aventura de criação e fantasia</p>
                <button onClick={handleStartIntro} className="text-xl font-bold text-[#1e0c42] bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-10 py-4 shadow-lg cta-shadow transition-transform duration-300 ease-in-out hover:scale-105 animate-pulse">
                    Começar Aventura
                </button>
            </div>
        </div>
    );

    const renderIntro = () => (
        <div className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-300 via-pink-200 to-orange-200">
            <div className="relative z-10 flex flex-col items-center text-center p-6 bg-white/95 rounded-3xl shadow-2xl max-w-xl mx-auto border-4 border-violet-400 animate-scale-in">
                <div className="w-48 h-auto drop-shadow-xl mb-4">
                    <Image src="/images/mascotes/leo/leo_mago_resultado.webp" alt="Leo Mago" width={200} height={200} className="w-full h-full object-contain" priority/>
                </div>
                <h1 className="text-3xl font-bold text-orange-600 mb-4">Como Jogar</h1>
                <p className="text-base text-gray-700 mb-8 min-h-[100px] flex items-center justify-center">{leoMessage}</p>
                <button onClick={handleIntroNext} className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                    {introStep < introMessages.length - 1 ? 'Entendi, próximo! →' : 'Vamos Começar!'}
                </button>
            </div>
        </div>
    );
    
    const renderGame = () => {
        if (!gameLevels[currentLevelIndex]) {
            return <div>Nível não encontrado.</div>; // Fallback
        }
        const level = gameLevels[currentLevelIndex];
        const progressPercentage = (phrasesCompletedInLevel / level.phrasesToComplete) * 100;

        return (
            <div className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200">
                <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl w-full max-w-6xl mx-auto border-4 border-violet-300 animate-fade-in">
                    <div className="mb-4">
                        <div className="flex justify-between items-center text-purple-700 font-bold text-lg md:text-xl mb-2">
                            <div><BookText size={24} className="inline-block mr-2"/> Fase {level.level}: {level.name}</div>
                            <div className="flex items-center gap-1 text-yellow-500"><Star size={24}/> {phrasesCompletedInLevel} / {level.phrasesToComplete}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner"><div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl mb-6 border-2 border-yellow-300 min-h-[100px] flex items-center justify-center text-center shadow-inner">
                        <p className="text-xl md:text-2xl text-gray-800 font-semibold leading-relaxed">
                            {level.structure.map((category, index) => (
                                currentPhrase[index] ? 
                                <span key={index} className="inline-block bg-white px-2 py-1 rounded-md shadow-sm font-bold text-purple-700 border border-purple-200 mx-1 animate-scale-in">{currentPhrase[index].displayLabel}</span> : 
                                <span key={index} className={`inline-block mx-1 text-gray-400 ${index === currentStepIndex ? 'animate-pulse-text' : ''}`}>_______</span>
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
                    {(gameState === 'playing') ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 animate-fade-in-up">
                            {cardOptions.map(card => (
                                <button key={card.id} onClick={() => handleCardSelection(card)} className="p-3 bg-white rounded-xl shadow-lg border-3 border-purple-200 hover:border-purple-500 hover:scale-105 transition-all transform focus:outline-none focus:ring-4 focus:ring-purple-300 active:scale-98 group">
                                    <div className="aspect-square relative rounded-md overflow-hidden"><Image src={card.image} alt={card.displayLabel} fill sizes="25vw" className="object-contain p-1"/></div>
                                    <p className="mt-2 text-center font-bold text-sm md:text-base text-gray-800 group-hover:text-purple-700">{card.displayLabel}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                         <div className='text-center mt-8 animate-fade-in-up'>
                             <button onClick={handleNext} className="px-10 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-xl rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
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
            case 'intro': return renderIntro();
            default: return renderGame();
        }
    };
    
    return (
        <>
            {renderContent()}
            <style jsx global>{`
                .font-display { font-family: 'MedievalSharp', cursive, sans-serif; }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                @keyframes pulse { 0%, 100% { transform: scale(1); box-shadow: 0 0 15px #ffd700, 0 0 25px #ffd700; } 50% { transform: scale(1.03); box-shadow: 0 0 25px #ffd700, 0 0 40px #ffac4d; } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes zoom { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse-fade { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
                @keyframes pulse-text { 0%, 100% { color: #2563eb; } 50% { color: #1d4ed8; } }
                @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-float { animation: float 4s ease-in-out infinite; }
                .animate-pulse { animation: pulse 2.5s infinite; }
                .animate-fade-in { animation: fadeIn 1s ease-in-out; }
                .animate-zoom { animation: zoom 40s infinite; }
                .animate-fade-in-up { animation: fade-in-up 0.7s ease-out forwards; }
                .animate-pulse-fade { animation: pulse-fade 2s infinite ease-in-out; }
                .animate-pulse-text { animation: pulse-text 1.5s infinite alternate ease-in-out; }
                .animate-scale-in { animation: scale-in 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; }
                .stars-bg::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(2px 2px at 90% 70%, white, transparent), radial-gradient(2px 2px at 30% 90%, white, transparent), radial-gradient(1px 1px at 10% 80%, white, transparent); background-repeat: repeat; background-size: 300px 300px; opacity: 0.8; }
                .title-text-shadow { text-shadow: 0 0 8px rgba(255, 215, 0, 0.7), 0 0 16px rgba(255, 172, 77, 0.5), 0 0 24px rgba(255, 0, 153, 0.5); }
                .cta-shadow { box-shadow: 0 0 15px rgba(255, 215, 0, 0.6), 0 0 25px rgba(255, 215, 0, 0.4); }
            `}</style>
        </>
    );
}
