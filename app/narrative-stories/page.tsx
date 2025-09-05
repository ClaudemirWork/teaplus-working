'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BookText, Sparkles, Wand2, Star } from 'lucide-react';

// --- INTERFACES ATUALIZADAS ---
interface Card {
    id: string;
    displayLabel: string;
    sentenceLabel: string;
    image: string;
    category: 'personagens' | 'acoes' | 'emocoes' | 'lugares' | 'objetos' | 'tempo';
    // NOVO: Propriedade para criar frases lógicas
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
// ATENÇÃO: Verifique se os caminhos '/narrative_cards/' correspondem à sua pasta 'public'
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
        { id: 'pai_mae', displayLabel: 'Papai e Mamãe', sentenceLabel: 'o papai e a mamãe', image: '/narrative_cards/personagens/pai_mae.webp', category: 'personagens' },
        { id: 'irmao', displayLabel: 'Irmão', sentenceLabel: 'o irmão', image: '/narrative_cards/personagens/irmao.webp', category: 'personagens' },
        { id: 'irma', displayLabel: 'Irmã', sentenceLabel: 'a irmã', image: '/narrative_cards/personagens/irma.webp', category: 'personagens' },
        // Adicione outros personagens aqui...
    ],
    acoes: [
        { id: 'comer', displayLabel: 'Comer', sentenceLabel: 'come', image: '/narrative_cards/acoes/comer.webp', category: 'acoes', compatibleWith: { category: 'objetos', ids: ['hamburguer_fritas', 'pizza', 'sopa_vegetais', 'biscoito_chocolate', 'cachorro_quente', 'espaguete_almondegas', 'omelete', 'rocambole', 'sanduiche_tostado', 'sopa_cebola', 'sopa_tomato', 'pao_forma'] } },
        { id: 'brincar', displayLabel: 'Brincar', sentenceLabel: 'brinca com', image: '/narrative_cards/acoes/brincar.webp', category: 'acoes', compatibleWith: { category: 'objetos', ids: ['bola_praia', 'brinquedo_menina', 'carrinho_brinquedo', 'cubo_colorido', 'soldado_brinquedo', 'video_game'] } },
        { id: 'dirigir', displayLabel: 'Dirigir', sentenceLabel: 'dirige', image: '/narrative_cards/acoes/dirigir.webp', category: 'acoes', compatibleWith: { category: 'objetos', ids: ['carro_mae', 'carro_pai', 'jeep', 'micro_onibus', 'taxi_uber', 'van_escolar'] } },
        { id: 'ler_livro', displayLabel: 'Ler', sentenceLabel: 'lê', image: '/narrative_cards/acoes/ler_livro.webp', category: 'acoes', compatibleWith: { category: 'objetos', ids: ['livro'] } }, // Supondo que você tenha um objeto 'livro.webp'
        { id: 'sentar', displayLabel: 'Sentar', sentenceLabel: 'senta', image: '/narrative_cards/acoes/sentar.webp', category: 'acoes', compatibleWith: { category: 'lugares', ids: ['cadeira_mesa', 'sofa_dois_lugares', 'cama', 'banqueta'] } },
        { id: 'dormir_lado', displayLabel: 'Dormir', sentenceLabel: 'dorme', image: '/narrative_cards/acoes/dormir_lado.webp', category: 'acoes', compatibleWith: { category: 'lugares', ids: ['cama', 'sofa_dois_lugares'] } },
        { id: 'caminhar', displayLabel: 'Caminhar', sentenceLabel: 'caminha', image: '/narrative_cards/acoes/caminhar.webp', category: 'acoes' },
        { id: 'correr', displayLabel: 'Correr', sentenceLabel: 'corre', image: '/narrative_cards/acoes/correr.webp', category: 'acoes' },
        { id: 'beber', displayLabel: 'Beber', sentenceLabel: 'bebe', image: '/narrative_cards/acoes/beber.webp', category: 'acoes', compatibleWith: { category: 'objetos', ids: ['suco_laranja', 'suco_uva', 'chocolate_quente', 'xicara_cafe'] } },
        { id: 'estudar', displayLabel: 'Estudar', sentenceLabel: 'estuda', image: '/narrative_cards/acoes/estudar.webp', category: 'acoes' },
        // Adicione todas as 97 ações aqui...
    ],
    objetos: [
        { id: 'bola_praia', displayLabel: 'Bola', sentenceLabel: 'a bola', image: '/narrative_cards/objetos/bola_praia.webp', category: 'objetos' },
        { id: 'hamburguer_fritas', displayLabel: 'Hambúrguer', sentenceLabel: 'o hambúrguer', image: '/narrative_cards/objetos/hamburguer_fritas.webp', category: 'objetos' },
        { id: 'pizza', displayLabel: 'Pizza', sentenceLabel: 'a pizza', image: '/narrative_cards/objetos/pizza.webp', category: 'objetos' },
        { id: 'carro_pai', displayLabel: 'Carro', sentenceLabel: 'o carro', image: '/narrative_cards/objetos/carro_pai.webp', category: 'objetos' },
        { id: 'livro', displayLabel: 'Livro', sentenceLabel: 'o livro', image: '/narrative_cards/objetos/livro.webp', category: 'objetos' }, // Exemplo
        // Adicione todos os 72 objetos aqui...
    ],
    lugares: [
        { id: 'cama', displayLabel: 'Cama', sentenceLabel: 'na cama', image: '/narrative_cards/lugares/cama.webp', category: 'lugares' },
        { id: 'escola', displayLabel: 'Escola', sentenceLabel: 'na escola', image: '/narrative_cards/lugares/escola.webp', category: 'lugares' },
        { id: 'casa', displayLabel: 'Casa', sentenceLabel: 'em casa', image: '/narrative_cards/lugares/casa.webp', category: 'lugares' },
        { id: 'jardim', displayLabel: 'Jardim', sentenceLabel: 'no jardim', image: '/narrative_cards/lugares/jardim.webp', category: 'lugares' },
        { id: 'praia', displayLabel: 'Praia', sentenceLabel: 'na praia', image: '/narrative_cards/lugares/praia.webp', category: 'lugares' },
        { id: 'cadeira_mesa', displayLabel: 'Cadeira', sentenceLabel: 'na cadeira', image: '/narrative_cards/lugares/cadeira_mesa.webp', category: 'lugares' },
        // Adicione todos os 48 lugares aqui...
    ],
    emocoes: [
        { id: 'homem_feliz', displayLabel: 'Feliz', sentenceLabel: 'está feliz', image: '/narrative_cards/emocoes/homem_feliz.webp', category: 'emocoes' },
        { id: 'mulher_triste', displayLabel: 'Triste', sentenceLabel: 'está triste', image: '/narrative_cards/emocoes/mulher_triste.webp', category: 'emocoes' },
        // Adicione as 38 emoções aqui...
    ],
    tempo: [
        { id: 'hoje', displayLabel: 'Hoje', sentenceLabel: 'hoje', image: '/narrative_cards/tempo/hoje.webp', category: 'tempo' },
        { id: 'ontem', displayLabel: 'Ontem', sentenceLabel: 'ontem', image: '/narrative_cards/tempo/ontem.webp', category: 'tempo' },
        // Adicione os 35 tempos aqui...
    ]
};

// --- NÍVEIS COM ESTRUTURA LÓGICA ---
const gameLevels: Level[] = [
    { level: 1, name: "Primeiras Frases", phrasesToComplete: 10, structure: ['personagens', 'acoes'] },
    { level: 2, name: "O Que Acontece?", phrasesToComplete: 15, structure: ['personagens', 'acoes', 'objetos'] },
    { level: 3, name: "Onde Acontece?", phrasesToComplete: 20, structure: ['personagens', 'acoes', 'lugares'] },
    // Você pode adicionar mais níveis aqui, como:
    // { level: 4, name: "Quando Acontece?", phrasesToComplete: 25, structure: ['tempo', 'personagens', 'acoes', 'objetos'] },
];

// --- COMPONENTE DO JOGO REFATORADO ---
export default function HistoriasEpicasGame() {
    const [gameState, setGameState] = useState<'titleScreen' | 'intro' | 'playing' | 'phraseComplete' | 'levelComplete' | 'gameOver'>('titleScreen');
    const [introStep, setIntroStep] = useState(0);
    const [leoMessage, setLeoMessage] = useState('');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [phrasesCompletedInLevel, setPhrasesCompletedInLevel] = useState(0);
    const [currentPhrase, setCurrentPhrase] = useState<Card[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [cardOptions, setCardOptions] = useState<Card[]>([]);
    const [lastStar, setLastStar] = useState(0);

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

        // LÓGICA DE COMPATIBILIDADE PARA FRASES INTELIGENTES
        if (previousCard?.compatibleWith && previousCard.compatibleWith.category === category) {
            potentialCards = potentialCards.filter(card => previousCard.compatibleWith!.ids.includes(card.id));
        }

        const shuffled = [...potentialCards].sort(() => 0.5 - Math.random());
        setCardOptions(shuffled.slice(0, 4)); // Mostra 4 opções por vez
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
        setLastStar(0);
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
            
            leoSpeak(`Uau! Você formou: "${capitalizedSentence}"! Você ganhou uma estrela!`);
            setPhrasesCompletedInLevel(prev => prev + 1);
            setLastStar(prev => prev + 1);
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
                leoSpeak(`Incrível! Você completou o nível ${currentLevel.name}! Vamos para o próximo!`);
                setTimeout(() => loadNewPhrase(nextLevelIndex), 4000);
            } else {
                setGameState('gameOver');
                leoSpeak("Parabéns! Você é um mestre das frases e completou todo o jogo!");
            }
        } else {
            loadNewPhrase(currentLevelIndex);
        }
    };
    
    // --- RENDERIZAÇÃO ---
    // Os componentes de renderização (renderTitleScreen, renderIntro, etc.) podem ser mantidos
    // com pequenas adaptações. Abaixo, uma versão adaptada do renderGame.

    const renderGame = () => {
        const level = gameLevels[currentLevelIndex];
        const progressPercentage = (phrasesCompletedInLevel / level.phrasesToComplete) * 100;

        return (
            <div className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200">
                <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl w-full max-w-6xl mx-auto border-4 border-violet-300 animate-fade-in">
                    
                    {/* CABEÇALHO COM GAMIFICAÇÃO */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center text-purple-700 font-bold text-lg md:text-xl mb-2">
                            <div><BookText size={24} className="inline-block mr-2"/> Fase {level.level}: {level.name}</div>
                            <div className="flex items-center gap-1 text-yellow-500"><Star size={24}/> {phrasesCompletedInLevel} / {level.phrasesToComplete}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>

                    {/* ÁREA DE CONSTRUÇÃO DA FRASE */}
                    <div className="bg-yellow-50 p-4 rounded-xl mb-6 border-2 border-yellow-300 min-h-[100px] flex items-center justify-center text-center shadow-inner">
                        <p className="text-xl md:text-2xl text-gray-800 font-semibold leading-relaxed">
                            {level.structure.map((category, index) => {
                                const card = currentPhrase[index];
                                return card ? (
                                    <span key={index} className="inline-block bg-white px-2 py-1 rounded-md shadow-sm font-bold text-purple-700 border border-purple-200 mx-1 animate-scale-in">
                                        {card.displayLabel}
                                    </span>
                                ) : (
                                    <span key={index} className={`inline-block mx-1 text-gray-400 ${index === currentStepIndex ? 'animate-pulse-text' : ''}`}>
                                        _______
                                    </span>
                                );
                            })}
                        </p>
                    </div>

                    {/* MASCOTE E MENSAGEM */}
                    <div className="flex flex-col md:flex-row items-center gap-4 my-6 justify-center">
                        <div className="w-28 h-28 md:w-36 md:h-36 relative flex-shrink-0">
                            <Image src="/images/mascotes/leo/leo_rosto_resultado.webp" alt="Leo" fill sizes="(max-width: 768px) 112px, 144px" className="rounded-full border-4 border-orange-500 shadow-lg animate-float" />
                        </div>
                        <div className="relative bg-white p-4 rounded-lg shadow-md flex-1 text-center min-h-[80px] flex items-center justify-center">
                            <p className="text-lg md:text-xl font-medium text-gray-800">{leoMessage}</p>
                        </div>
                    </div>

                    {/* OPÇÕES DE CARDS OU BOTÃO DE PRÓXIMO */}
                    {gameState === 'playing' ? (
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
                                 Próxima Frase!
                             </button>
                         </div>
                    )}
                </div>
            </div>
        );
    }
    
    // Cole aqui as funções renderTitleScreen() e renderIntro() do seu código anterior,
    // e a função renderContent() e o return final com o <style jsx global>.
    // Eles não precisam de grandes alterações.
}
