'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BookText, Star } from 'lucide-react';
import './HistoriasEpicas.css'; // NOVO: Importando o arquivo CSS

// --- INTERFACES E DADOS ---
// As interfaces (Card, Level, StoryTemplate) e os dados (allCards, gameLevels) permanecem os mesmos da nossa versão anterior.
// O que muda drasticamente é o conteúdo do `storyTemplates`.

// NOVO: BANCO DE HISTÓRIAS AMPLIADO PARA O BETA-TESTE (52 HISTÓRIAS)
const storyTemplates = [
    // --- NÍVEL 1: Reconhecimento (10 Histórias) ---
    { level: 1, parts: { 'personagens': 'menino' }, prompts: { 'personagens': 'Quem está na história?' } },
    { level: 1, parts: { 'personagens': 'menina' }, prompts: { 'personagens': 'Encontre a personagem.' } },
    { level: 1, parts: { 'personagens': 'cachorro' }, prompts: { 'personagens': 'Qual animal vemos aqui?' } },
    { level: 1, parts: { 'personagens': 'gatinho' }, prompts: { 'personagens': 'Mostre o gatinho.' } },
    { level: 1, parts: { 'personagens': 'professora' }, prompts: { 'personagens': 'Onde está a professora?' } },
    { level: 1, parts: { 'personagens': 'medico' }, prompts: { 'personagens': 'Quem está aqui?' } },
    { level: 1, parts: { 'personagens': 'eu_homem' }, prompts: { 'personagens': 'Aponte para "Eu".' } },
    { level: 1, parts: { 'personagens': 'voce' }, prompts: { 'personagens': 'Encontre "Você".' } },
    { level: 1, parts: { 'personagens': 'filha' }, prompts: { 'personagens': 'Onde está a menina?' } },
    { level: 1, parts: { 'personagens': 'filho' }, prompts: { 'personagens': 'Mostre o menino.' } },

    // --- NÍVEL 2: Personagem + Ação (12 Histórias) ---
    { level: 2, parts: { 'personagens': 'gatinho', 'acoes': 'dormir' }, prompts: { 'personagens': 'Quem está dormindo?', 'acoes': 'O que o gatinho está fazendo?' } },
    { level: 2, parts: { 'personagens': 'menino', 'acoes': 'correr' }, prompts: { 'personagens': 'Quem está correndo?', 'acoes': 'O que o menino faz?' } },
    { level: 2, parts: { 'personagens': 'cachorro', 'acoes': 'brincar' }, prompts: { 'personagens': 'Quem quer brincar?', 'acoes': 'O que o cachorro faz?' } },
    { level: 2, parts: { 'personagens': 'professora', 'acoes': 'ler' }, prompts: { 'personagens': 'Quem está com um livro?', 'acoes': 'O que a professora está fazendo?' } },
    { level: 2, parts: { 'personagens': 'medico', 'acoes': 'estudar' }, prompts: { 'personagens': 'Quem está estudando?', 'acoes': 'O que o médico faz?' } },
    { level: 2, parts: { 'personagens': 'eu_homem', 'acoes': 'comer' }, prompts: { 'personagens': 'Quem está com fome?', 'acoes': 'O que eu estou fazendo?' } },
    { level: 2, parts: { 'personagens': 'menina', 'acoes': 'estudar' }, prompts: { 'personagens': 'Quem está na mesa?', 'acoes': 'O que a menina faz?' } },
    { level: 2, parts: { 'personagens': 'filho', 'acoes': 'correr' }, prompts: { 'personagens': 'Quem está correndo?', 'acoes': 'Qual a ação do menino?' } },
    { level: 2, parts: { 'personagens': 'gatinho', 'acoes': 'comer' }, prompts: { 'personagens': 'Quem está comendo?', 'acoes': 'O que o gatinho está fazendo?' } },
    { level: 2, parts: { 'personagens': 'voce', 'acoes': 'ler' }, prompts: { 'personagens': 'Quem está lendo?', 'acoes': 'O que você faz?' } },
    { level: 2, parts: { 'personagens': 'cachorro', 'acoes': 'dormir' }, prompts: { 'personagens': 'Quem está com sono?', 'acoes': 'O que o cachorro está fazendo?' } },
    { level: 2, parts: { 'personagens': 'menino', 'acoes': 'brincar' }, prompts: { 'personagens': 'Quem está feliz?', 'acoes': 'O que o menino faz?' } },
    
    // --- NÍVEL 3: Personagem + Ação + Objeto (14 Histórias) ---
    { level: 3, parts: { 'personagens': 'menina', 'acoes': 'comer', 'objetos': 'pizza' }, prompts: { 'personagens': 'Quem come?', 'acoes': 'O que ela faz?', 'objetos': 'O que ela come?' } },
    { level: 3, parts: { 'personagens': 'cachorro', 'acoes': 'brincar', 'objetos': 'bola' }, prompts: { 'personagens': 'Quem brinca?', 'acoes': 'O que ele faz?', 'objetos': 'Com o que ele brinca?' } },
    { level: 3, parts: { 'personagens': 'professora', 'acoes': 'ler', 'objetos': 'livro' }, prompts: { 'personagens': 'Quem lê?', 'acoes': 'O que ela faz?', 'objetos': 'O que ela lê?' } },
    { level: 3, parts: { 'personagens': 'menino', 'acoes': 'brincar', 'objetos': 'carrinho' }, prompts: { 'personagens': 'Quem brinca?', 'acoes': 'O que ele faz?', 'objetos': 'Qual o brinquedo dele?' } },
    { level: 3, parts: { 'personagens': 'eu_homem', 'acoes': 'estudar', 'objetos': 'livro' }, prompts: { 'personagens': 'Quem estuda?', 'acoes': 'O que eu faço?', 'objetos': 'Onde eu estudo?' } },
    { level: 3, parts: { 'personagens': 'voce', 'acoes': 'comer', 'objetos': 'pizza' }, prompts: { 'personagens': 'Quem come?', 'acoes': 'O que você faz?', 'objetos': 'O que você come?' } },
    { level: 3, parts: { 'personagens': 'gatinho', 'acoes': 'brincar', 'objetos': 'bola' }, prompts: { 'personagens': 'Quem brinca?', 'acoes': 'O que ele faz?', 'objetos': 'Com o que o gatinho brinca?' } },
    { level: 3, parts: { 'personagens': 'medico', 'acoes': 'ler', 'objetos': 'livro' }, prompts: { 'personagens': 'Quem lê?', 'acoes': 'O que o médico faz?', 'objetos': 'O que ele está lendo?' } },
    { level: 3, parts: { 'personagens': 'menina', 'acoes': 'brincar', 'objetos': 'bola' }, prompts: { 'personagens': 'Quem está com a bola?', 'acoes': 'O que ela faz?', 'objetos': 'Qual é o objeto?' } },
    { level: 3, parts: { 'personagens': 'menino', 'acoes': 'comer', 'objetos': 'pizza' }, prompts: { 'personagens': 'Quem está comendo?', 'acoes': 'O que ele faz?', 'objetos': 'Qual a comida?' } },
    { level: 3, parts: { 'personagens': 'filha', 'acoes': 'estudar', 'objetos': 'livro' }, prompts: { 'personagens': 'Quem está estudando?', 'acoes': 'O que a menina faz?', 'objetos': 'O que ela usa para estudar?' } },
    { level: 3, parts: { 'personagens': 'filho', 'acoes': 'brincar', 'objetos': 'bola' }, prompts: { 'personagens': 'Quem quer brincar?', 'acoes': 'O que o menino faz?', 'objetos': 'Com o que ele brinca?' } },
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
    { level: 4, parts: { 'personagens': 'filho', 'acoes': 'brincar', 'lugares': 'jardim' }, prompts: { 'personagens': 'Quem está no jardim?', 'acoes': 'O que o menino está fazendo?', 'lugares': 'Onde ele está?' } },
    
    // --- NÍVEL 5: História Completa (8 Histórias) ---
    { level: 5, parts: { 'tempo': 'hoje', 'personagens': 'eu_homem', 'acoes': 'estudar', 'objetos': 'livro', 'lugares': 'casa'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'Fazendo o quê?', 'objetos': 'Com o quê?', 'lugares': 'Onde?' } },
    { level: 5, parts: { 'tempo': 'manha', 'personagens': 'menino', 'acoes': 'brincar', 'objetos': 'bola', 'lugares': 'jardim'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'O quê?', 'objetos': 'Com qual objeto?', 'lugares': 'Em que lugar?' } },
    { level: 5, parts: { 'tempo': 'hoje', 'personagens': 'menina', 'acoes': 'comer', 'objetos': 'pizza', 'lugares': 'casa'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'Ação?', 'objetos': 'O quê?', 'lugares': 'Onde?' } },
    { level: 5, parts: { 'tempo': 'manha', 'personagens': 'professora', 'acoes': 'ler', 'objetos': 'livro', 'lugares': 'escola'}, prompts: { 'tempo': 'Quando acontece?', 'personagens': 'Quem está na história?', 'acoes': 'O que ela faz?', 'objetos': 'O que ela usa?', 'lugares': 'Onde ela está?' } },
    { level: 5, parts: { 'tempo': 'hoje', 'personagens': 'cachorro', 'acoes': 'brincar', 'objetos': 'bola', 'lugares': 'jardim'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'Fazendo o quê?', 'objetos': 'Com o quê?', 'lugares': 'Onde?' } },
    { level: 5, parts: { 'tempo': 'manha', 'personagens': 'gatinho', 'acoes': 'dormir', 'objetos': 'livro', 'lugares': 'casa'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'O quê?', 'objetos': 'Perto do quê?', 'lugares': 'Onde?' } }, // O gatinho dorme perto do livro
    { level: 5, parts: { 'tempo': 'hoje', 'personagens': 'medico', 'acoes': 'estudar', 'objetos': 'livro', 'lugares': 'escola'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'Fazendo o quê?', 'objetos': 'O quê?', 'lugares': 'Onde?' } },
    { level: 5, parts: { 'tempo': 'manha', 'personagens': 'voce', 'acoes': 'correr', 'objetos': 'mochila', 'lugares': 'escola'}, prompts: { 'tempo': 'Quando?', 'personagens': 'Quem?', 'acoes': 'O que você faz?', 'objetos': 'Com o quê?', 'lugares': 'Para onde?' } }, // Você corre com a mochila para a escola
];


export default function HistoriasEpicasGame() {
    // --- ESTADOS DO JOGO ---
    const [gameState, setGameState] = useState<'titleScreen' | 'playing' | 'phraseComplete' | 'levelComplete' | 'gameOver'>('titleScreen');
    const [leoMessage, setLeoMessage] = useState('Vamos começar nossa aventura de criar histórias!');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [phrasesCompletedInLevel, setPhrasesCompletedInLevel] = useState(0);
    const [currentPhrase, setCurrentPhrase] = useState([]);
    const [cardOptions, setCardOptions] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showStarReward, setShowStarReward] = useState(false);
    const [currentStory, setCurrentStory] = useState(null);
    
    // NOVO: Estados para gamificação
    const [score, setScore] = useState(0);
    const [scoreUpdateKey, setScoreUpdateKey] = useState(0); // Para re-acionar a animação de score
    const [animationState, setAnimationState] = useState({ cardId: null, type: null }); // 'correct' ou 'incorrect'

    // ... Funções leoSpeak, buildSentence, conjugateVerb, Confetti ...
    // (Cole aqui as funções que não mudaram para manter o código completo)

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
        setScore(0); // NOVO: Reseta o placar
        startNewPhrase();
    }, [startNewPhrase]);

    // ALTERADO: Lógica de seleção com pontos e animações
    const handleCardSelection = (selectedCard) => {
        if (gameState !== 'playing' || animationState.cardId) return;

        const level = gameLevels[currentLevelIndex];
        const nextStepIndex = currentPhrase.length;
        const nextCategory = level.structure[nextStepIndex];
        const correctCardId = currentStory?.parts[nextCategory];

        if (selectedCard.id === correctCardId) {
            const pointsGained = 10;
            setScore(prev => prev + pointsGained);
            setScoreUpdateKey(prev => prev + 1); // NOVO: Força a re-renderização da animação
            setAnimationState({ cardId: selectedCard.id, type: 'correct' });
            leoSpeak(`Isso! Mais ${pointsGained} pontos!`);
            
            setTimeout(() => {
                setCurrentPhrase(prev => [...prev, selectedCard]);
                setAnimationState({ cardId: null, type: null });
            }, 700); // Duração da animação de explosão
        } else {
            setAnimationState({ cardId: selectedCard.id, type: 'incorrect' });
            leoSpeak("Ops, tente outra vez.");
            
            setTimeout(() => {
                setAnimationState({ cardId: null, type: null });
            }, 500); // Duração da animação de shake
        }
    };
    
    // ... useEffect principal (sem grandes alterações, já está correto) ...
    
    const handleNext = () => {
        // ... (lógica de avançar nível ou frase, sem alterações) ...
    };
    
    // ... renderTitleScreen (sem alterações) ...

    const renderGame = () => {
        const level = gameLevels[currentLevelIndex];
        if (!level) return <div>Carregando...</div>;
        
        return (
            <div className="w-full h-screen ...">
                {/* ... Confetti e StarReward ... */}
                <div className="relative z-10 bg-white/95 ...">
                    <div className="flex justify-between items-center ...">
                        {/* ... Info do Nível ... */}
                        
                        {/* NOVO: Placar de pontos com animação */}
                        <div key={scoreUpdateKey} className={`score-container-update flex items-center gap-2 text-xl font-bold text-yellow-600 bg-yellow-100 px-4 py-2 rounded-full`}>
                            <Star size={24} className="text-yellow-500" />
                            <span>{score} Pontos</span>
                            <span className="score-pop-animation absolute -top-4 right-4 text-green-500 font-bold">+10</span>
                        </div>

                        {/* ... Progresso de frases completas ... */}
                    </div>
                    {/* ... O resto da UI do jogo (caixa de texto, mensagem do Leo) ... */}
                    {gameState === 'playing' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {cardOptions.map((card) => {
                                // NOVO: Lógica de classes de animação
                                const isAnimating = animationState.cardId === card.id;
                                let animationClass = '';
                                if (isAnimating) {
                                    animationClass = animationState.type === 'correct' 
                                        ? 'card-correct-animation' 
                                        : 'card-incorrect-animation';
                                }

                                return (
                                <button 
                                    key={card.id} 
                                    onClick={() => handleCardSelection(card)} 
                                    disabled={!!animationState.cardId}
                                    className={`group p-3 bg-white rounded-xl shadow-lg border-2 border-purple-200 transition-transform duration-200 hover:scale-105 hover:border-purple-500 ${animationClass}`}
                                >
                                    <div className="aspect-square ...">
                                        <Image src={card.image} alt={card.displayLabel} ... />
                                    </div>
                                    <p className="mt-2 ...">{card.displayLabel}</p>
                                </button>
                                );
                            })}
                        </div>
                    ) : (
                        // ... Botão de Próxima História ...
                    )}
                </div>
            </div>
        );
    }
    
    return (
        <>
            {gameState === 'titleScreen' ? renderTitleScreen() : renderGame()}
            {/* O CSS agora está no arquivo importado, então a tag <style> pode ser removida se todas as regras foram migradas */}
        </>
    );
}
