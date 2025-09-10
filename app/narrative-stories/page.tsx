'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BookText, Star } from 'lucide-react';
import styles from './HistoriasEpicas.module.css';

// --- COMPONENTE DE GAMIFICAÇÃO: CONFETES ---
const Confetti = () => {
    const colors = ['#ffD700', '#00c4ff', '#ff007c', '#00ff8c', '#ffa500'];
    return (
        <div className={styles.confettiContainer}>
            {[...Array(100)].map((_, i) => (
                <div
                    key={i}
                    className={styles.confettiPiece}
                    style={{
                        left: `${Math.random() * 100}%`,
                        backgroundColor: colors[i % colors.length],
                        animationName: 'fall',
                        animationDuration: `${Math.random() * 3 + 3}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                />
            ))}
        </div>
    );
};

// --- INTERFACES E DADOS ---
interface Card { id: string; displayLabel: string; image: string; category: string; sentenceLabel?: string; }
const allCards: { [key: string]: Card[] } = {
    personagens: [ { id: 'menino', displayLabel: 'Menino', sentenceLabel: 'o menino', image: '/narrative_cards/personagens/filho.webp', category: 'personagens' }, { id: 'menina', displayLabel: 'Menina', sentenceLabel: 'a menina', image: '/narrative_cards/personagens/filha.webp', category: 'personagens' }, { id: 'cachorro', displayLabel: 'Cachorro', sentenceLabel: 'o cachorro', image: '/narrative_cards/personagens/cachorro.webp', category: 'personagens' }, { id: 'gatinho', displayLabel: 'Gatinho', sentenceLabel: 'o gatinho', image: '/narrative_cards/personagens/gatinho.webp', category: 'personagens' }, { id: 'professora', displayLabel: 'Professora', sentenceLabel: 'a professora', image: '/narrative_cards/personagens/professora.webp', category: 'personagens' }, { id: 'medico', displayLabel: 'Médico', sentenceLabel: 'o médico', image: '/narrative_cards/personagens/medico.webp', category: 'personagens' }, { id: 'policial', displayLabel: 'Policial', sentenceLabel: 'o policial', image: '/narrative_cards/personagens/policial.webp', category: 'personagens' } ],
    acoes: [ { id: 'comer', displayLabel: 'Comer', sentenceLabel: 'come', image: '/narrative_cards/acoes/comer.webp', category: 'acoes' }, { id: 'brincar', displayLabel: 'Brincar', sentenceLabel: 'brinca', image: '/narrative_cards/acoes/brincar.webp', category: 'acoes' }, { id: 'ler', displayLabel: 'Ler', sentenceLabel: 'lê', image: '/narrative_cards/acoes/ler_livro.webp', category: 'acoes' }, { id: 'dormir', displayLabel: 'Dormir', sentenceLabel: 'dorme', image: '/narrative_cards/acoes/dormir_lado.webp', category: 'acoes' }, { id: 'correr', displayLabel: 'Correr', sentenceLabel: 'corre', image: '/narrative_cards/acoes/correr.webp', category: 'acoes' }, { id: 'dirigir', displayLabel: 'Dirigir', sentenceLabel: 'dirige', image: '/narrative_cards/acoes/dirigir.webp', category: 'acoes' }, { id: 'cozinhar', displayLabel: 'Cozinhar', sentenceLabel: 'cozinha', image: '/narrative_cards/acoes/cozinhar.webp', category: 'acoes' } ],
    objetos: [ { id: 'bola', displayLabel: 'Bola', sentenceLabel: 'a bola', image: '/narrative_cards/objetos/bola_praia.webp', category: 'objetos' }, { id: 'livro', displayLabel: 'Livro', sentenceLabel: 'o livro', image: '/narrative_cards/objetos/papel_lapis.webp', category: 'objetos' }, { id: 'pizza', displayLabel: 'Pizza', sentenceLabel: 'a pizza', image: '/narrative_cards/objetos/pizza.webp', category: 'objetos' }, { id: 'carrinho', displayLabel: 'Carrinho', sentenceLabel: 'o carrinho', image: '/narrative_cards/objetos/carrinho_brinquedo.webp', category: 'objetos' } ],
    lugares: [ { id: 'casa', displayLabel: 'Em Casa', sentenceLabel: 'em casa', image: '/narrative_cards/lugares/casa.webp', category: 'lugares' }, { id: 'escola', displayLabel: 'Na Escola', sentenceLabel: 'na escola', image: '/narrative_cards/lugares/escola.webp', category: 'lugares' }, { id: 'jardim', displayLabel: 'No Jardim', sentenceLabel: 'no jardim', image: '/narrative_cards/lugares/jardim.webp', category: 'lugares' }, { id: 'praia', displayLabel: 'Na Praia', sentenceLabel: 'na praia', image: '/narrative_cards/lugares/praia.webp', category: 'lugares' } ],
    emocoes: [ { id: 'feliz', displayLabel: 'Feliz', sentenceLabel: 'feliz', image: '/narrative_cards/emocoes/homem_feliz.webp', category: 'emocoes' }, { id: 'triste', displayLabel: 'Triste', sentenceLabel: 'triste', image: '/narrative_cards/emocoes/homem_triste.webp', category: 'emocoes' } ],
};
interface Desafio { fase: 'Personagens' | 'Ações' | 'Objetos' | 'Lugares' | 'Emoções'; frase: string; cardCorretoId: string; cardsDistratoresIds: string[]; }

const desafios: Desafio[] = [
    { fase: 'Personagens', frase: '{BLANK} adora brincar com a bola.', cardCorretoId: 'cachorro', cardsDistratoresIds: ['pizza', 'escola'] },
    { fase: 'Personagens', frase: '{BLANK} gosta de ler livros para os alunos.', cardCorretoId: 'professora', cardsDistratoresIds: ['bola', 'jardim'] },
    { fase: 'Personagens', frase: '{BLANK} corre muito rápido no parque.', cardCorretoId: 'menino', cardsDistratoresIds: ['livro', 'casa'] },
    { fase: 'Personagens', frase: '{BLANK} dorme tranquilamente no sofá.', cardCorretoId: 'gatinho', cardsDistratoresIds: ['correr', 'feliz'] },
    { fase: 'Personagens', frase: '{BLANK} cuida das pessoas doentes.', cardCorretoId: 'medico', cardsDistratoresIds: ['dirigir', 'praia'] },
    { fase: 'Personagens', frase: '{BLANK} usa um vestido bonito na festa.', cardCorretoId: 'menina', cardsDistratoresIds: ['dormir', 'triste'] },
    { fase: 'Personagens', frase: '{BLANK} organiza o trânsito na cidade.', cardCorretoId: 'policial', cardsDistratoresIds: ['cozinhar', 'livro'] },
    { fase: 'Personagens', frase: '{BLANK} está aprendendo a andar de bicicleta.', cardCorretoId: 'menino', cardsDistratoresIds: ['gatinho', 'pizza'] },
    { fase: 'Ações', frase: 'O cachorro adora {BLANK} no parque.', cardCorretoId: 'correr', cardsDistratoresIds: ['menino', 'casa'] },
    { fase: 'Ações', frase: 'A menina gosta de {BLANK} com a boneca.', cardCorretoId: 'brincar', cardsDistratoresIds: ['professora', 'livro'] },
    { fase: 'Ações', frase: 'Depois de um longo dia, o gatinho vai {BLANK}.', cardCorretoId: 'dormir', cardsDistratoresIds: ['feliz', 'escola'] },
    { fase: 'Ações', frase: 'A professora vai {BLANK} uma nova história.', cardCorretoId: 'ler', cardsDistratoresIds: ['cachorro', 'bola'] },
    { fase: 'Ações', frase: 'O menino faminto quer {BLANK} uma fatia de pizza.', cardCorretoId: 'comer', cardsDistratoresIds: ['jardim', 'triste'] },
    { fase: 'Ações', frase: 'O policial precisa {BLANK} o carro de polícia.', cardCorretoId: 'dirigir', cardsDistratoresIds: ['medico', 'praia'] },
    { fase: 'Ações', frase: 'O médico vai {BLANK} para aprender mais.', cardCorretoId: 'ler', cardsDistratoresIds: ['policial', 'carrinho'] },
    { fase: 'Ações', frase: 'A mamãe vai {BLANK} um bolo delicioso.', cardCorretoId: 'cozinhar', cardsDistratoresIds: ['brincar', 'escola'] },
    { fase: 'Objetos', frase: 'Para jogar futebol, o menino chuta a {BLANK}.', cardCorretoId: 'bola', cardsDistratoresIds: ['casa', 'menina'] },
    { fase: 'Objetos', frase: 'A professora lê um {BLANK} muito interessante.', cardCorretoId: 'livro', cardsDistratoresIds: ['gatinho', 'correr'] },
    { fase: 'Objetos', frase: 'No jantar, nós vamos comer {BLANK}.', cardCorretoId: 'pizza', cardsDistratoresIds: ['jardim', 'policial'] },
    { fase: 'Objetos', frase: 'O menino brinca com seu {BLANK} azul.', cardCorretoId: 'carrinho', cardsDistratoresIds: ['medico', 'feliz'] },
    { fase: 'Objetos', frase: 'O cachorro adora morder a {BLANK} de borracha.', cardCorretoId: 'bola', cardsDistratoresIds: ['livro', 'dormir'] },
    { fase: 'Lugares', frase: 'Depois da aula, as crianças voltam para {BLANK}.', cardCorretoId: 'casa', cardsDistratoresIds: ['feliz', 'livro'] },
    { fase: 'Lugares', frase: 'A professora ensina as crianças na {BLANK}.', cardCorretoId: 'escola', cardsDistratoresIds: ['casa', 'cachorro'] },
    { fase: 'Lugares', frase: 'O cachorro corre feliz no {BLANK} florido.', cardCorretoId: 'jardim', cardsDistratoresIds: ['escola', 'pizza'] },
    { fase: 'Lugares', frase: 'Nas férias, vamos brincar na areia da {BLANK}.', cardCorretoId: 'praia', cardsDistratoresIds: ['policial', 'carrinho'] },
    { fase: 'Lugares', frase: 'Eu gosto de dormir quentinho na minha {BLANK}.', cardCorretoId: 'casa', cardsDistratoresIds: ['jardim', 'ler'] },
    { fase: 'Emoções', frase: 'A criança ficou muito {BLANK} quando ganhou o presente.', cardCorretoId: 'feliz', cardsDistratoresIds: ['triste', 'menino'] },
    { fase: 'Emoções', frase: 'Ele ficou {BLANK} porque seu brinquedo quebrou.', cardCorretoId: 'triste', cardsDistratoresIds: ['feliz', 'bola'] },
    { fase: 'Emoções', frase: 'Ao ver o palhaço, a menina abriu um sorriso {BLANK}.', cardCorretoId: 'feliz', cardsDistratoresIds: ['triste', 'escola'] },
    { fase: 'Emoções', frase: 'O menino ficou {BLANK} porque não podia ir à praia.', cardCorretoId: 'triste', cardsDistratoresIds: ['feliz', 'dirigir'] },
];

const todosOsCardsMap = new Map<string, Card>(Object.values(allCards).flat().map(card => [card.id, card]));
const fasesDoJogo: Desafio['fase'][] = ['Personagens', 'Ações', 'Objetos', 'Lugares', 'Emoções'];

export default function HistoriasEpicasPage() {
    const [gameState, setGameState] = useState<'titulo' | 'instrucoes' | 'jogando' | 'fimDeFase' | 'fimDeJogo'>('titulo');
    const [faseAtualIndex, setFaseAtualIndex] = useState(0);
    const [desafiosDaFase, setDesafiosDaFase] = useState<Desafio[]>([]);
    const [desafioAtualIndex, setDesafioAtualIndex] = useState(0);
    const [opcoesDeCards, setOpcoesDeCards] = useState<Card[]>([]);
    const [cardClicado, setCardClicado] = useState<Card | null>(null);
    const [feedback, setFeedback] = useState<'acerto' | 'erro' | null>(null);
    const [score, setScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    const leoSpeak = useCallback((message: string) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const carregarProximoDesafio = useCallback(() => {
        setShowConfetti(false);
        setFeedback(null);
        setCardClicado(null);

        const proximoIndex = desafioAtualIndex + 1;
        if (proximoIndex < desafiosDaFase.length) {
            setDesafioAtualIndex(proximoIndex);
        } else {
            const proximaFaseIndex = faseAtualIndex + 1;
            if (proximaFaseIndex < fasesDoJogo.length) {
                setGameState('fimDeFase');
                leoSpeak(`Parabéns! Você completou a fase de ${fasesDoJogo[faseAtualIndex]}! Vamos para a próxima!`);
            } else {
                setGameState('fimDeJogo');
                leoSpeak('Incrível! Você completou todos os desafios e virou um mestre das histórias!');
            }
        }
    }, [desafioAtualIndex, desafiosDaFase, faseAtualIndex]);

    const handleCardSelection = (card: Card) => {
        if (feedback) return;

        setCardClicado(card);
        const desafioAtual = desafiosDaFase[desafioAtualIndex];

        if (card.id === desafioAtual.cardCorretoId) {
            setFeedback('acerto');
            setScore(s => s + 10);
            setShowConfetti(true);
            const fraseCompleta = desafioAtual.frase.replace('{BLANK}', card.sentenceLabel || card.displayLabel);
            setTimeout(() => leoSpeak(`Perfeito! ${fraseCompleta}`), 700);
            setTimeout(carregarProximoDesafio, 4000);
        } else {
            setFeedback('erro');
            setTimeout(() => {
                setFeedback(null);
                setCardClicado(null);
            }, 1000);
            leoSpeak('Ops, essa não parece ser a palavra certa. Tente de novo.');
        }
    };

    const iniciarFase = (index: number) => {
        setFaseAtualIndex(index);
        const faseAtual = fasesDoJogo[index];
        const desafiosFiltrados = desafios.filter(d => d.fase === faseAtual).sort(() => Math.random() - 0.5);
        setDesafiosDaFase(desafiosFiltrados);
        setDesafioAtualIndex(0);
        setGameState('jogando');
    };
    
    useEffect(() => {
        if (gameState === 'jogando' && desafiosDaFase.length > 0) {
            const desafioAtual = desafiosDaFase[desafioAtualIndex];
            if (!desafioAtual) return;
            const cardCorreto = todosOsCardsMap.get(desafioAtual.cardCorretoId);
            const cardsDistratores = desafioAtual.cardsDistratoresIds.map(id => todosOsCardsMap.get(id));
            if (cardCorreto) {
                const todasOpcoes = [cardCorreto, ...cardsDistratores].filter(Boolean) as Card[];
                setOpcoesDeCards(todasOpcoes.sort(() => Math.random() - 0.5));
            }
        }
    }, [gameState, desafiosDaFase, desafioAtualIndex]);

    const renderTitulo = () => (
        <div className={`${styles.screen} ${styles.titleScreen}`}>
            <div className={styles.panel}>
                <Image src="/images/mascotes/leo/leo_feliz_resultado.webp" alt="Leo" width={300} height={300} priority />
                <h1 className={styles.title}>Histórias Épicas</h1>
                <p className={styles.subtitle}>Vamos completar as frases juntos!</p>
                <button onClick={() => setGameState('instrucoes')} className={`${styles.button} ${styles.buttonPrimary}`}>Começar</button>
            </div>
        </div>
    );

    const renderInstrucoes = () => (
        <div className={`${styles.screen} ${styles.instructionsScreen}`}>
            <div className={styles.panel}>
                <BookText size={64} style={{ margin: '0 auto 1rem', color: '#2563eb' }} />
                <h2 className={styles.title} style={{ color: '#1e3a8a' }}>Como Jogar</h2>
                <p className={styles.subtitle} style={{ color: '#334155' }}>Escolha o card que melhor completa a frase para terminar a história. Preste atenção na dica e escolha a figura certa!</p>
                <button onClick={() => iniciarFase(0)} className={`${styles.button} ${styles.buttonSecondary}`}>Vamos Lá!</button>
            </div>
        </div>
    );

    const renderJogo = () => {
        const desafioAtual = desafiosDaFase[desafioAtualIndex];
        if (!desafioAtual) return <div className={styles.gameScreen}><p>Carregando...</p></div>;
        const [parte1, parte2] = desafioAtual.frase.split('{BLANK}');
        return (
            <div className={styles.gameScreen}>
                {showConfetti && <Confetti />}
                <div className={styles.gameContainer}>
                    <div className={styles.header}>
                        <h2 className={styles.faseTitle}>Fase: {desafioAtual.fase}</h2>
                        <div className={styles.scoreBox}><Star fill="currentColor" /> {score}</div>
                    </div>
                    <div className={styles.sentenceContainer}>
                        <p className={styles.sentenceText}>
                            {parte1}
                            {feedback === 'acerto' ? <span className={styles.filledWord}>{cardClicado?.sentenceLabel || cardClicado?.displayLabel}</span> : <span className={styles.blankSpace}></span>}
                            {parte2}
                        </p>
                    </div>
                    <div className={styles.optionsGrid}>
                        {opcoesDeCards.map(card => {
                            let animationClass = '';
                            if (card.id === cardClicado?.id) {
                                if (feedback === 'acerto') animationClass = styles.cardCorrect;
                                if (feedback === 'erro') animationClass = styles.cardIncorrect;
                            }
                            return (
                                <button key={card.id} onClick={() => handleCardSelection(card)} disabled={!!feedback} className={`${styles.cardButton} ${animationClass}`}>
                                    <Image src={card.image} alt={card.displayLabel} width={200} height={200} className={styles.cardImage} />
                                    <p className={styles.cardLabel}>{card.displayLabel}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderTelaFinal = (titulo: string, mensagem: string, proximaAcao: () => void, textoBotao: string) => (
         <div className={`${styles.screen} ${styles.finalScreen}`}>
             <div className={styles.panel}>
                 <Star size={80} style={{ margin: '0 auto 1rem', color: '#f59e0b', fill: '#f59e0b' }} />
                 <h2 className={styles.title} style={{ color: '#5b21b6' }}>{titulo}</h2>
                 <p className={styles.subtitle} style={{ color: '#4a044e' }}>{mensagem}</p>
                 <button onClick={proximaAcao} className={`${styles.button} ${styles.buttonPrimary}`}>{textoBotao}</button>
            </div>
         </div>
    );

    switch(gameState) {
        case 'titulo': return renderTitulo();
        case 'instrucoes': return renderInstrucoes();
        case 'jogando': return renderJogo();
        case 'fimDeFase': return renderTelaFinal('Fase Completa!', `Você foi ótimo na fase de ${fasesDoJogo[faseAtualIndex]}!`, () => iniciarFase(faseAtualIndex + 1), 'Próxima Fase');
        case 'fimDeJogo': return renderTelaFinal('Você Conseguiu!', 'Você completou todas as histórias!', () => { setGameState('titulo'); setFaseAtualIndex(0); setDesafioAtualIndex(0); setScore(0); }, 'Jogar Novamente');
        default: return renderTitulo();
    }
}
