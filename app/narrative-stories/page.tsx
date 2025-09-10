// Este é o seu arquivo page.tsx (ex: app/narrative-stories/historias-epicas/page.tsx)

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BookText, Star } from 'lucide-react';

// --- COMPONENTE DE GAMIFICAÇÃO: CONFETES ---
// Reintegrando o componente de confetes que tínhamos no início
const Confetti = () => (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }}>
        {[...Array(100)].map((_, i) => {
            const style = {
                position: 'absolute',
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 20 + 10}px`,
                backgroundColor: ['#ffD700', '#00c4ff', '#ff007c', '#00ff8c'][i % 4],
                top: '-50px',
                left: `${Math.random() * 100}%`,
                animation: `fall ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s infinite`,
                transform: `rotate(${Math.random() * 360}deg)`,
            };
            return <div key={i} style={style as React.CSSProperties} />;
        })}
        <style jsx global>{`
            @keyframes fall {
                to {
                    transform: translateY(105vh) rotate(720deg);
                }
            }
        `}</style>
    </div>
);


// --- INTERFACES E DADOS ---
interface Card {
    id: string; displayLabel: string; image: string; category: string; sentenceLabel?: string;
}

// ATENÇÃO: Adicione TODOS os seus cards aqui para o jogo ter acesso a eles.
const allCards: { [key: string]: Card[] } = {
    personagens: [ { id: 'menino', displayLabel: 'Menino', sentenceLabel: 'o menino', image: '/narrative_cards/personagens/filho.webp', category: 'personagens' }, { id: 'menina', displayLabel: 'Menina', sentenceLabel: 'a menina', image: '/narrative_cards/personagens/filha.webp', category: 'personagens' }, { id: 'cachorro', displayLabel: 'Cachorro', sentenceLabel: 'o cachorro', image: '/narrative_cards/personagens/cachorro.webp', category: 'personagens' }, { id: 'gatinho', displayLabel: 'Gatinho', sentenceLabel: 'o gatinho', image: '/narrative_cards/personagens/gatinho.webp', category: 'personagens' }, { id: 'professora', displayLabel: 'Professora', sentenceLabel: 'a professora', image: '/narrative_cards/personagens/professora.webp', category: 'personagens' }, { id: 'medico', displayLabel: 'Médico', sentenceLabel: 'o médico', image: '/narrative_cards/personagens/medico.webp', category: 'personagens' }, { id: 'policial', displayLabel: 'Policial', sentenceLabel: 'o policial', image: '/narrative_cards/personagens/policial.webp', category: 'personagens' } ],
    acoes: [ { id: 'comer', displayLabel: 'Comer', sentenceLabel: 'come', image: '/narrative_cards/acoes/comer.webp', category: 'acoes' }, { id: 'brincar', displayLabel: 'Brincar', sentenceLabel: 'brinca', image: '/narrative_cards/acoes/brincar.webp', category: 'acoes' }, { id: 'ler', displayLabel: 'Ler', sentenceLabel: 'lê', image: '/narrative_cards/acoes/ler_livro.webp', category: 'acoes' }, { id: 'dormir', displayLabel: 'Dormir', sentenceLabel: 'dorme', image: '/narrative_cards/acoes/dormir_lado.webp', category: 'acoes' }, { id: 'correr', displayLabel: 'Correr', sentenceLabel: 'corre', image: '/narrative_cards/acoes/correr.webp', category: 'acoes' }, { id: 'dirigir', displayLabel: 'Dirigir', sentenceLabel: 'dirige', image: '/narrative_cards/acoes/dirigir.webp', category: 'acoes' }, { id: 'cozinhar', displayLabel: 'Cozinhar', sentenceLabel: 'cozinha', image: '/narrative_cards/acoes/cozinhar.webp', category: 'acoes' } ],
    objetos: [ { id: 'bola', displayLabel: 'Bola', sentenceLabel: 'com a bola', image: '/narrative_cards/objetos/bola_praia.webp', category: 'objetos' }, { id: 'livro', displayLabel: 'Livro', sentenceLabel: 'o livro', image: '/narrative_cards/objetos/papel_lapis.webp', category: 'objetos' }, { id: 'pizza', displayLabel: 'Pizza', sentenceLabel: 'pizza', image: '/narrative_cards/objetos/pizza.webp', category: 'objetos' }, { id: 'carrinho', displayLabel: 'Carrinho', sentenceLabel: 'o carrinho', image: '/narrative_cards/objetos/carrinho_brinquedo.webp', category: 'objetos' } ],
    lugares: [ { id: 'casa', displayLabel: 'Em Casa', sentenceLabel: 'em casa', image: '/narrative_cards/lugares/casa.webp', category: 'lugares' }, { id: 'escola', displayLabel: 'Na Escola', sentenceLabel: 'na escola', image: '/narrative_cards/lugares/escola.webp', category: 'lugares' }, { id: 'jardim', displayLabel: 'No Jardim', sentenceLabel: 'no jardim', image: '/narrative_cards/lugares/jardim.webp', category: 'lugares' }, { id: 'praia', displayLabel: 'Na Praia', sentenceLabel: 'na praia', image: '/narrative_cards/lugares/praia.webp', category: 'lugares' } ],
    emocoes: [ { id: 'feliz', displayLabel: 'Feliz', sentenceLabel: 'feliz', image: '/narrative_cards/emocoes/homem_feliz.webp', category: 'emocoes' }, { id: 'triste', displayLabel: 'Triste', sentenceLabel: 'triste', image: '/narrative_cards/emocoes/homem_triste.webp', category: 'emocoes' } ],
};

// --- NOVA ESTRUTURA DE DADOS AMPLIADA ---
interface Desafio { fase: 'Personagens' | 'Ações' | 'Objetos' | 'Lugares' | 'Emoções'; frase: string; cardCorretoId: string; cardsDistratoresIds: string[]; }

const desafios: Desafio[] = [
    // FASE 1: PERSONAGENS (8 desafios)
    { fase: 'Personagens', frase: '{BLANK} adora brincar com a bola.', cardCorretoId: 'cachorro', cardsDistratoresIds: ['pizza', 'escola'] },
    { fase: 'Personagens', frase: '{BLANK} gosta de ler livros para os alunos.', cardCorretoId: 'professora', cardsDistratoresIds: ['bola', 'jardim'] },
    { fase: 'Personagens', frase: '{BLANK} corre muito rápido no parque.', cardCorretoId: 'menino', cardsDistratoresIds: ['livro', 'casa'] },
    { fase: 'Personagens', frase: '{BLANK} dorme tranquilamente no sofá.', cardCorretoId: 'gatinho', cardsDistratoresIds: ['correr', 'feliz'] },
    { fase: 'Personagens', frase: '{BLANK} cuida das pessoas doentes.', cardCorretoId: 'medico', cardsDistratoresIds: ['dirigir', 'praia'] },
    { fase: 'Personagens', frase: '{BLANK} usa um vestido bonito na festa.', cardCorretoId: 'menina', cardsDistratoresIds: ['dormir', 'triste'] },
    { fase: 'Personagens', frase: '{BLANK} organiza o trânsito na cidade.', cardCorretoId: 'policial', cardsDistratoresIds: ['cozinhar', 'livro'] },
    { fase: 'Personagens', frase: '{BLANK} está aprendendo a andar de bicicleta.', cardCorretoId: 'menino', cardsDistratoresIds: ['gatinho', 'pizza'] },

    // FASE 2: AÇÕES (8 desafios)
    { fase: 'Ações', frase: 'O cachorro adora {BLANK} no parque.', cardCorretoId: 'correr', cardsDistratoresIds: ['menino', 'casa'] },
    { fase: 'Ações', frase: 'A menina gosta de {BLANK} com a boneca.', cardCorretoId: 'brincar', cardsDistratoresIds: ['professora', 'livro'] },
    { fase: 'Ações', frase: 'Depois de um longo dia, o gatinho vai {BLANK}.', cardCorretoId: 'dormir', cardsDistratoresIds: ['feliz', 'escola'] },
    { fase: 'Ações', frase: 'A professora vai {BLANK} uma nova história.', cardCorretoId: 'ler', cardsDistratoresIds: ['cachorro', 'bola'] },
    { fase: 'Ações', frase: 'O menino faminto quer {BLANK} uma fatia de pizza.', cardCorretoId: 'comer', cardsDistratoresIds: ['jardim', 'triste'] },
    { fase: 'Ações', frase: 'O policial precisa {BLANK} o carro de polícia.', cardCorretoId: 'dirigir', cardsDistratoresIds: ['medico', 'praia'] },
    { fase: 'Ações', frase: 'O médico vai {BLANK} para aprender mais.', cardCorretoId: 'ler', cardsDistratoresIds: ['policial', 'carrinho'] },
    { fase: 'Ações', frase: 'A mamãe vai {BLANK} um bolo delicioso.', cardCorretoId: 'cozinhar', cardsDistratoresIds: ['brincar', 'escola'] },
    
    // FASE 3: OBJETOS (6 desafios)
    { fase: 'Objetos', frase: 'Para jogar futebol, o menino chuta a {BLANK}.', cardCorretoId: 'bola', cardsDistratoresIds: ['casa', 'menina'] },
    { fase: 'Objetos', frase: 'A professora lê um {BLANK} muito interessante.', cardCorretoId: 'livro', cardsDistratoresIds: ['gatinho', 'correr'] },
    { fase: 'Objetos', frase: 'No jantar, nós vamos comer {BLANK}.', cardCorretoId: 'pizza', cardsDistratoresIds: ['jardim', 'policial'] },
    { fase: 'Objetos', frase: 'O menino brinca com seu {BLANK} azul.', cardCorretoId: 'carrinho', cardsDistratoresIds: ['medico', 'feliz'] },
    { fase: 'Objetos', frase: 'Para a escola, eu levo meu material no {BLANK}.', cardCorretoId: 'mochila', cardsDistratoresIds: ['praia', 'dirigir'] }, // Supondo que você tenha o card 'mochila'
    { fase: 'Objetos', frase: 'O cachorro adora morder a {BLANK} de borracha.', cardCorretoId: 'bola', cardsDistratoresIds: ['livro', 'dormir'] },
    
    // FASE 4: LUGARES (6 desafios)
    { fase: 'Lugares', frase: 'Depois da aula, as crianças voltam para {BLANK}.', cardCorretoId: 'casa', cardsDistratoresIds: ['feliz', 'livro'] },
    { fase: 'Lugares', frase: 'A professora ensina as crianças na {BLANK}.', cardCorretoId: 'escola', cardsDistratoresIds: ['casa', 'cachorro'] },
    { fase: 'Lugares', frase: 'O cachorro corre feliz no {BLANK} florido.', cardCorretoId: 'jardim', cardsDistratoresIds: ['escola', 'pizza'] },
    { fase: 'Lugares', frase: 'Nas férias, nós vamos brincar na areia da {BLANK}.', cardCorretoId: 'praia', cardsDistratoresIds: ['policial', 'carrinho'] },
    { fase: 'Lugares', frase: 'Eu gosto de dormir quentinho na minha {BLANK}.', cardCorretoId: 'casa', cardsDistratoresIds: ['jardim', 'ler'] },
    { fase: 'Lugares', frase: 'O balanço das crianças fica no {BLANK}.', cardCorretoId: 'jardim', cardsDistratoresIds: ['praia', 'triste'] },

    // FASE 5: EMOÇÕES (4 desafios)
    { fase: 'Emoções', frase: 'A criança ficou muito {BLANK} quando ganhou o presente.', cardCorretoId: 'feliz', cardsDistratoresIds: ['triste', 'menino'] },
    { fase: 'Emoções', frase: 'Ele ficou {BLANK} porque seu brinquedo quebrou.', cardCorretoId: 'triste', cardsDistratoresIds: ['feliz', 'bola'] },
    { fase: 'Emoções', frase: 'Ao ver o cachorrinho, a menina abriu um sorriso {BLANK}.', cardCorretoId: 'feliz', cardsDistratoresIds: ['triste', 'escola'] },
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
    const [cardSelecionado, setCardSelecionado] = useState<Card | null>(null);
    const [feedback, setFeedback] = useState<'acerto' | 'erro' | null>(null);
    const [score, setScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false); // Estado para os confetes

    const leoSpeak = useCallback((message: string) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const carregarProximoDesafio = () => {
        setShowConfetti(false);
        setFeedback(null);
        setCardSelecionado(null);

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
    };
    
    const handleCardSelection = (card: Card) => {
        if (feedback) return;

        const desafioAtual = desafiosDaFase[desafioAtualIndex];
        if (card.id === desafioAtual.cardCorretoId) {
            setFeedback('acerto');
            setCardSelecionado(card);
            setScore(s => s + 10);
            setShowConfetti(true);
            const fraseCompleta = desafioAtual.frase.replace('{BLANK}', card.sentenceLabel || card.displayLabel);
            
            // GARANTINDO A LEITURA DA FRASE AO FINAL
            setTimeout(() => {
                leoSpeak(`Perfeito! ${fraseCompleta}`);
            }, 700);
            
            setTimeout(carregarProximoDesafio, 4000);
        } else {
            setFeedback('erro');
            setTimeout(() => setFeedback(null), 1000);
            leoSpeak('Ops, essa não parece ser a palavra certa. Tente de novo.');
        }
    };

    useEffect(() => {
        if (gameState === 'jogando') {
            const faseAtual = fasesDoJogo[faseAtualIndex];
            const desafiosFiltrados = desafios.filter(d => d.fase === faseAtual).sort(() => Math.random() - 0.5);
            setDesafiosDaFase(desafiosFiltrados);
            setDesafioAtualIndex(0);
        }
    }, [gameState, faseAtualIndex]);

    useEffect(() => {
        if (gameState === 'jogando' && desafiosDaFase.length > 0) {
            const desafioAtual = desafiosDaFase[desafioAtualIndex];
            const cardCorreto = todosOsCardsMap.get(desafioAtual.cardCorretoId);
            const cardsDistratores = desafioAtual.cardsDistratoresIds.map(id => todosOsCardsMap.get(id));
            if (cardCorreto) {
                const todasOpcoes = [cardCorreto, ...cardsDistratores].filter(Boolean) as Card[];
                setOpcoesDeCards(todasOpcoes.sort(() => Math.random() - 0.5));
            }
        }
    }, [gameState, desafiosDaFase, desafioAtualIndex]);

    const renderTitulo = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-yellow-200 via-orange-300 to-amber-400">
             {/* ... JSX da tela de título, sem alterações ... */}
        </div>
    );
    const renderInstrucoes = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-sky-200 to-blue-400">
             {/* ... JSX da tela de instruções, sem alterações ... */}
        </div>
    );

    const renderJogo = () => {
        const desafioAtual = desafiosDaFase[desafioAtualIndex];
        if (!desafioAtual) return <div className="w-full h-screen flex justify-center items-center"><p>Carregando...</p></div>;

        const [parte1, parte2] = desafioAtual.frase.split('{BLANK}');
        
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-green-200 to-yellow-200">
                {showConfetti && <Confetti />}
                <div className="w-full max-w-4xl bg-white/90 p-6 rounded-2xl shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-purple-700">Fase: {desafioAtual.fase}</h2>
                        <div className="flex items-center gap-2 text-2xl font-bold text-yellow-600 bg-yellow-100 px-4 py-2 rounded-full">
                            <Star fill="currentColor" /> {score}
                        </div>
                    </div>
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-8 mb-8 text-center min-h-[120px] flex items-center justify-center">
                        <p className="text-4xl font-semibold text-slate-800 leading-relaxed">
                            {parte1}
                            {cardSelecionado ? (
                                <span className="text-blue-600 font-bold px-2 underline decoration-blue-500 decoration-4 underline-offset-4">{cardSelecionado.sentenceLabel || cardSelecionado.displayLabel}</span>
                            ) : (
                                <span className="inline-block bg-slate-300 w-48 h-10 rounded-md mx-2 animate-pulse"></span>
                            )}
                            {parte2}
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        {opcoesDeCards.map(card => {
                            let animationClass = '';
                            if (feedback === 'acerto' && card.id === cardSelecionado?.id) {
                                animationClass = 'animate-card-correct';
                            } else if (feedback === 'erro') {
                                // Animação de erro agora se aplica ao card clicado incorretamente
                                // (Esta lógica pode ser aprimorada para rastrear o ID exato do card clicado)
                                animationClass = 'animate-card-incorrect';
                            }
                            return (
                                <button key={card.id} onClick={() => handleCardSelection(card)} disabled={!!feedback} className={`p-4 bg-white rounded-xl shadow-lg border-4 transition-all ${feedback === 'acerto' && card.id === cardSelecionado?.id ? 'border-green-500' : 'border-transparent'} ${animationClass}`}>
                                    <Image src={card.image} alt={card.displayLabel} width={200} height={200} className="w-full h-auto aspect-square object-contain" />
                                    <p className="mt-2 text-center text-xl font-bold text-slate-800">{card.displayLabel}</p>
                                </button>
                            );
})}
                    </div>
                </div>
            </div>
        );
    };

    const renderTelaFinal = (titulo: string, mensagem: string, proximaAcao: () => void, textoBotao: string) => (
         <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-green-300 to-purple-400">
            {/* ... JSX das telas finais, sem alterações ... */}
         </div>
    );

    if (gameState === 'titulo') return renderTitulo();
    if (gameState === 'instrucoes') return renderInstrucoes();
    if (gameState === 'jogando') return renderJogo();
    if (gameState === 'fimDeFase') return renderTelaFinal('Fase Completa!', `Você foi ótimo na fase de ${fasesDoJogo[faseAtualIndex]}!`, () => { setFaseAtualIndex(f => f + 1); setDesafioAtualIndex(0); setGameState('jogando'); }, 'Próxima Fase');
    if (gameState === 'fimDeJogo') return renderTelaFinal('Você Conseguiu!', 'Você completou todas as histórias!', () => { setGameState('titulo'); setFaseAtualIndex(0); setDesafioAtualIndex(0); setScore(0); }, 'Jogar Novamente');

    return renderTitulo();
}
