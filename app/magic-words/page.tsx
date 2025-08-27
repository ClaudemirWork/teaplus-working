import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';

// --- Interfaces (Tipos de Dados) ---
interface Card {
  id: string;
  label: string;
  image: string;
  category: string;
}

interface Phase {
  cards: number;
  rounds: number;
  name: string;
}

// --- BANCO DE DADOS CORRIGIDO DE CARDS ---
// Removidos cards problemáticos e corrigidos caminhos
const allCardsData: Card[] = [
  // Ações - Cards mais usados e testados
  { id: 'pensar', label: 'Pensar', image: '/images/cards/acoes/Pensar.webp', category: 'acoes' },
  { id: 'abracar', label: 'Abraçar', image: '/images/cards/acoes/abraçar.webp', category: 'acoes' },
  { id: 'aplaudir', label: 'Aplaudir', image: '/images/cards/acoes/aplaudir.webp', category: 'acoes' },
  { id: 'beber', label: 'Beber', image: '/images/cards/acoes/beber.webp', category: 'acoes' },
  { id: 'caminhar', label: 'Caminhar', image: '/images/cards/acoes/caminhar.webp', category: 'acoes' },
  { id: 'comer', label: 'Comer', image: '/images/cards/acoes/comer.webp', category: 'acoes' },
  { id: 'correr', label: 'Correr', image: '/images/cards/acoes/correr.webp', category: 'acoes' },
  { id: 'dormir', label: 'Dormir', image: '/images/cards/acoes/dormir.webp', category: 'acoes' },
  { id: 'escrever', label: 'Escrever', image: '/images/cards/acoes/escrever.webp', category: 'acoes' },
  { id: 'falar', label: 'Falar', image: '/images/cards/acoes/falar.webp', category: 'acoes' },
  { id: 'ler', label: 'Ler', image: '/images/cards/acoes/ler_livro.webp', category: 'acoes' },
  { id: 'ouvir', label: 'Ouvir', image: '/images/cards/acoes/ouvindo.webp', category: 'acoes' },
  { id: 'pular', label: 'Pular', image: '/images/cards/acoes/saltar.webp', category: 'acoes' },
  { id: 'sentar', label: 'Sentar', image: '/images/cards/acoes/sentar.webp', category: 'acoes' },
  
  // Animais - Cards básicos
  { id: 'cachorro', label: 'Cachorro', image: '/images/cards/animais/cachorro.webp', category: 'animais' },
  { id: 'gato', label: 'Gato', image: '/images/cards/animais/gato.webp', category: 'animais' },
  { id: 'cavalo', label: 'Cavalo', image: '/images/cards/animais/cavalo.webp', category: 'animais' },
  { id: 'vaca', label: 'Vaca', image: '/images/cards/animais/Vaca.webp', category: 'animais' },
  { id: 'leao', label: 'Leão', image: '/images/cards/animais/leão.webp', category: 'animais' },
  { id: 'elefante', label: 'Elefante', image: '/images/cards/animais/elefante.webp', category: 'animais' },
  { id: 'girafa', label: 'Girafa', image: '/images/cards/animais/girafa.webp', category: 'animais' },
  { id: 'peixe', label: 'Peixe', image: '/images/cards/animais/peixe.webp', category: 'animais' },
  { id: 'passaro', label: 'Pássaro', image: '/images/cards/animais/papagaio.webp', category: 'animais' },
  { id: 'coelho', label: 'Coelho', image: '/images/cards/animais/coelho.webp', category: 'animais' },
  
  // Objetos - Cards do dia a dia
  { id: 'bola', label: 'Bola', image: '/images/cards/objetos/bola_basquete.webp', category: 'objetos' },
  { id: 'livro', label: 'Livro', image: '/images/cards/escola/livro.webp', category: 'objetos' },
  { id: 'caderno', label: 'Caderno', image: '/images/cards/escola/caderno.webp', category: 'objetos' },
  { id: 'lapis', label: 'Lápis', image: '/images/cards/escola/lapis.webp', category: 'objetos' },
  { id: 'mesa', label: 'Mesa', image: '/images/cards/casa/mesa.webp', category: 'objetos' },
  { id: 'cadeira', label: 'Cadeira', image: '/images/cards/casa/banqueta.webp', category: 'objetos' },
  { id: 'relogio', label: 'Relógio', image: '/images/cards/objetos/relogio.webp', category: 'objetos' },
  { id: 'telefone', label: 'Telefone', image: '/images/cards/casa/telefone_antigo.webp', category: 'objetos' },
  
  // Alimentos básicos
  { id: 'maca', label: 'Maçã', image: '/images/cards/alimentos/maca.webp', category: 'alimentos' },
  { id: 'banana', label: 'Banana', image: '/images/cards/alimentos/banana.webp', category: 'alimentos' },
  { id: 'laranja', label: 'Laranja', image: '/images/cards/alimentos/fruta_laranja.webp', category: 'alimentos' },
  { id: 'pao', label: 'Pão', image: '/images/cards/alimentos/paozinho.webp', category: 'alimentos' },
  { id: 'leite', label: 'Leite', image: '/images/cards/casa/garrafa_leite.webp', category: 'alimentos' },
  { id: 'agua', label: 'Água', image: '/images/cards/alimentos/bebida_quente.webp', category: 'alimentos' },
  
  // Rotinas
  { id: 'acordar', label: 'Acordar', image: '/images/cards/rotinas/hora_acordar.webp', category: 'rotinas' },
  { id: 'dormir_rotina', label: 'Dormir', image: '/images/cards/rotinas/hora_dormir.webp', category: 'rotinas' },
  { id: 'cafe_manha', label: 'Café da Manhã', image: '/images/cards/rotinas/cafe_manha.webp', category: 'rotinas' },
  { id: 'almoco', label: 'Almoço', image: '/images/cards/rotinas/almoco.webp', category: 'rotinas' },
  { id: 'jantar', label: 'Jantar', image: '/images/cards/rotinas/jantar.webp', category: 'rotinas' },
  { id: 'escola', label: 'Escola', image: '/images/cards/descritivo/escola.webp', category: 'rotinas' },
  { id: 'brincar', label: 'Brincar', image: '/images/cards/rotinas/brincar.webp', category: 'rotinas' },
  
  // Core - Palavras essenciais
  { id: 'sim', label: 'Sim', image: '/images/cards/core/sim.webp', category: 'core' },
  { id: 'nao', label: 'Não', image: '/images/cards/core/não.webp', category: 'core' },
  { id: 'ola', label: 'Olá', image: '/images/cards/core/Olá.webp', category: 'core' },
  { id: 'obrigado', label: 'Obrigado', image: '/images/cards/core/obrigado.webp', category: 'core' },
  { id: 'por_favor', label: 'Por Favor', image: '/images/cards/core/por favor.webp', category: 'core' },
  { id: 'eu', label: 'Eu', image: '/images/cards/core/eu.webp', category: 'core' },
  { id: 'voce', label: 'Você', image: '/images/cards/core/voce.webp', category: 'core' },
  { id: 'mais', label: 'Mais', image: '/images/cards/core/mais.webp', category: 'core' },
  { id: 'quero', label: 'Quero', image: '/images/cards/core/quero.webp', category: 'core' },
];

// --- Configuração Central do Jogo ---
const gameConfig = {
  phases: [
    { cards: 4, rounds: 3, name: "Tradutor Iniciante" },
    { cards: 6, rounds: 4, name: "Intérprete Aprendiz" },
    { cards: 8, rounds: 5, name: "Mestre dos Gestos" },
    { cards: 10, rounds: 6, name: "Feiticeiro das Palavras" }
  ] as Phase[],
  cards: allCardsData,
  npcNames: ['Maria', 'João', 'Ana', 'Lucas', 'Sofia', 'Pedro']
};

export default function MagicWordsGame() {
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- Estados do Jogo ---
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUiBlocked, setIsUiBlocked] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const [correctCard, setCorrectCard] = useState<Card | null>(null);
  const [npcName, setNpcName] = useState('Maria');
  const [cardFeedback, setCardFeedback] = useState<{ [key: string]: 'correct' | 'wrong' }>({});

  const [milaMessage, setMilaMessage] = useState("");
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // --- Mensagens da Mila ---
  const milaMessages = {
    intro: "Olá! Sou a Mila, a Feiticeira. Vamos descobrir o que as pessoas querem?",
    start: "Vamos começar! Preste atenção no que eu vou pedir.",
    nextRound: ["Observe com atenção!", "Qual card o(a) nosso(a) amigo(a) quer?", "Você consegue encontrar!"],
    correct: ["Isso mesmo! 🎉", "Você encontrou! ⭐", "Excelente! 🌟", "Continue assim! 💪"],
    error: "Ops, não foi esse. Mas não desista! ❤️",
    phaseComplete: (phaseName: string) => `Uau! Você completou a fase ${phaseName}! Ganhou uma Gema Mágica e mais pontos! ✨`,
    gameOver: "Não foi dessa vez, mas você foi incrível! Vamos tentar de novo? 😊"
  };

  useEffect(() => {
    if (!isPlaying && milaMessage === "") {
      milaSpeak(milaMessages.intro);
    }
  }, [isPlaying, milaMessage]);

  // --- Inicialização do Áudio ---
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    document.addEventListener('click', initAudio, { once: true });
    return () => {
      document.removeEventListener('click', initAudio);
      audioContextRef.current?.close();
    };
  }, []);
  
  // --- Funções de Som e Narração ---
  const milaSpeak = useCallback((message: string) => {
    setMilaMessage(message);
    if (isSoundOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.replace(/[🎉⭐🌟💪✨❤️😊🤔]/g, ''));
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, [isSoundOn]);

  const playSound = useCallback((type: 'correct' | 'wrong' | 'start' | 'win') => {
    if (!isSoundOn || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    
    const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    if (type === 'correct') {
      playNote(523.25, now, 0.15);
      playNote(659.25, now + 0.15, 0.2);
    } else if (type === 'wrong') {
      playNote(164.81, now, 0.2);
      playNote(155.56, now + 0.2, 0.2);
    } else if (type === 'win') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            playNote(freq, now + i * 0.1, 0.15);
        });
    }
  }, [isSoundOn]);
  
  // --- Lógica Principal do Jogo ---
  const startGame = useCallback(() => {
    setCurrentPhaseIndex(0);
    setScore(0);
    setRoundsCompleted(0);
    setLives(3);
    setIsPlaying(true);
    setShowGameOverModal(false);
    setShowVictoryModal(false);
    milaSpeak(milaMessages.start);
    setTimeout(() => nextRound(0), 2000);
  }, [milaSpeak]);

  const nextRound = useCallback((phaseIdx: number) => {
    setIsUiBlocked(true);
    const currentPhaseConfig = gameConfig.phases[phaseIdx];
    
    if (!currentPhaseConfig) return;

    if (gameConfig.cards.length < currentPhaseConfig.cards) {
        console.error("Não há cards suficientes para esta fase.");
        setIsPlaying(false);
        milaSpeak("Parece que faltam cards! Informe o criador do jogo.");
        return;
    }

    const shuffledDeck = [...gameConfig.cards].sort(() => 0.5 - Math.random());
    
    const correct = shuffledDeck[0];
    const distractors = shuffledDeck.slice(1, currentPhaseConfig.cards);
    
    const roundCards = [correct, ...distractors].sort(() => 0.5 - Math.random());
    
    setCorrectCard(correct);
    setCurrentCards(roundCards);
    setCardFeedback({});
    
    const randomNpcName = gameConfig.npcNames[Math.floor(Math.random() * gameConfig.npcNames.length)];
    setNpcName(randomNpcName);

    setTimeout(() => {
        if(correct) {
            milaSpeak(`${randomNpcName} quer o card que mostra... '${correct.label}'. Você consegue encontrar?`);
        }
        setIsUiBlocked(false);
    }, 1200);

  }, [milaSpeak]);

  const handleCardClick = (card: Card) => {
    if (isUiBlocked || !isPlaying) return;
    setIsUiBlocked(true);

    if (card.id === correctCard?.id) {
      setScore(prev => prev + 100);
      setCardFeedback({ [card.id]: 'correct' });
      playSound('correct');
      const randomMessage = milaMessages.correct[Math.floor(Math.random() * milaMessages.correct.length)];
      milaSpeak(randomMessage);
      
      const newRoundsCompleted = roundsCompleted + 1;
      setRoundsCompleted(newRoundsCompleted);

      setTimeout(() => {
        const phase = gameConfig.phases[currentPhaseIndex];
        if (phase && newRoundsCompleted >= phase.rounds) {
          handlePhaseComplete();
        } else {
          nextRound(currentPhaseIndex);
        }
      }, 2000);

    } else {
      setLives(prev => prev - 1);
      setCardFeedback({ [card.id]: 'wrong', [correctCard!.id]: 'correct' });
      playSound('wrong');
      milaSpeak(milaMessages.error);
      
      const newLives = lives - 1;
      if (newLives <= 0) {
        setTimeout(() => {
          setIsPlaying(false);
          setShowGameOverModal(true);
          milaSpeak(milaMessages.gameOver);
        }, 2000);
      } else {
        setTimeout(() => {
          nextRound(currentPhaseIndex);
        }, 2500);
      }
    }
  };

  const handlePhaseComplete = () => {
    const phase = gameConfig.phases[currentPhaseIndex];
    playSound('win');
    setScore(prev => prev + 250);
    if(phase) {
        milaSpeak(milaMessages.phaseComplete(phase.name));
    }
    setShowVictoryModal(true);
  };
  
  const nextPhase = useCallback(() => {
    const newPhaseIndex = currentPhaseIndex + 1;
    setShowVictoryModal(false);
    
    if (newPhaseIndex >= gameConfig.phases.length) {
      milaSpeak("Parabéns, Mago(a) das Palavras! Você desvendou todos os segredos! 🎉");
      setIsPlaying(false);
      setMilaMessage("Parabéns! Você completou todas as fases! 🎉");
    } else {
      setCurrentPhaseIndex(newPhaseIndex);
      setRoundsCompleted(0);
      setLives(3);
      setTimeout(() => nextRound(newPhaseIndex), 1000);
    }
  }, [currentPhaseIndex, nextRound, milaSpeak]);

  const phase = gameConfig.phases[currentPhaseIndex];
  const progress = phase ? (roundsCompleted / phase.rounds) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-200 via-violet-200 to-pink-200 text-gray-800 relative overflow-hidden">
      {/* Header fixo no topo */}
      <header className="w-full px-2 py-2 md:px-4 md:py-3 sticky top-0 z-30 bg-white/70 backdrop-blur-md shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button onClick={() => window.history.back()} className="p-1.5 md:p-2 hover:bg-sky-100 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <h1 className="text-base sm:text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">
                ✨ Palavras Mágicas
              </h1>
            </div>
            <div className="flex gap-1.5 md:gap-3 items-center">
              <div className="bg-gradient-to-br from-red-400 to-pink-400 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-xl shadow-md">
                <div className="text-[10px] md:text-xs">Vidas</div>
                <div className="text-sm md:text-lg font-bold">{'❤️'.repeat(lives)}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white px-2 py-1 md:px-4 md:py-1.5 rounded-xl shadow-md">
                <div className="text-[10px] md:text-xs">Pontos</div>
                <div className="text-sm md:text-lg font-bold">{score}</div>
              </div>
              <button onClick={() => setIsSoundOn(!isSoundOn)} className="p-1.5 md:p-2 hover:bg-sky-100 rounded-xl transition-colors">
                {isSoundOn ? <Volume2 className="w-5 h-5 md:w-6 md:h-6" /> : <VolumeX className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Área principal do jogo com padding inferior para a Mila */}
      <main className="flex-grow px-2 py-2 md:px-4 md:py-4 pb-32 md:pb-40">
        <div className="max-w-6xl mx-auto">
          {isPlaying && phase ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-xl">
              {/* Informações da fase */}
              <div className="text-center mb-3 md:mb-4">
                <h2 className="text-base md:text-xl font-bold mb-2">
                  🌟 Fase {currentPhaseIndex + 1}: {phase.name}
                </h2>
                <div className="w-full bg-gray-200 rounded-full h-5 md:h-6 border border-gray-300">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-sky-400 flex items-center justify-center text-white text-xs md:text-sm font-bold transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  >
                    {roundsCompleted}/{phase.rounds}
                  </div>
                </div>
              </div>
              
              {/* NPC que faz o pedido */}
              <div className="flex justify-center my-3 md:my-6">
                <div className="bg-white p-3 md:p-4 rounded-2xl shadow-md text-center border-2 border-pink-200">
                  <div className="text-4xl md:text-6xl animate-bounce">🤔</div>
                  <p className="font-bold mt-1 md:mt-2 text-sm md:text-lg">{npcName}</p>
                </div>
              </div>

              {/* Grid de cards ajustado para diferentes tamanhos */}
              <div className={`
                grid gap-2 md:gap-3 transition-opacity duration-500 
                ${isUiBlocked ? 'opacity-50' : 'opacity-100'}
                ${phase.cards <= 4 ? 'grid-cols-2' : ''}
                ${phase.cards === 6 ? 'grid-cols-2 sm:grid-cols-3' : ''}
                ${phase.cards === 8 ? 'grid-cols-2 sm:grid-cols-4' : ''}
                ${phase.cards >= 10 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' : ''}
              `}>
                {currentCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    disabled={isUiBlocked}
                    className={`
                      p-2 md:p-3 bg-white rounded-xl md:rounded-2xl shadow-lg border-4 transition-all duration-300 transform 
                      ${isUiBlocked ? 'cursor-wait' : 'hover:scale-105 hover:shadow-xl active:scale-95'}
                      ${cardFeedback[card.id] === 'correct' ? 'border-green-400 scale-110 animate-pulse' : ''}
                      ${cardFeedback[card.id] === 'wrong' ? 'border-red-400 animate-shake' : ''}
                      ${!cardFeedback[card.id] ? 'border-violet-200' : ''}
                    `}
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-2">
                      {/* Placeholder para imagem */}
                      <div className="aspect-square bg-gradient-to-br from-violet-100 to-pink-100 rounded-lg flex items-center justify-center text-3xl md:text-5xl">
                        {/* Emoji representativo baseado na categoria */}
                        {card.category === 'animais' && '🐾'}
                        {card.category === 'acoes' && '👋'}
                        {card.category === 'objetos' && '📦'}
                        {card.category === 'alimentos' && '🍎'}
                        {card.category === 'rotinas' && '⏰'}
                        {card.category === 'core' && '💬'}
                      </div>
                    </div>
                    <p className="mt-1 md:mt-2 text-center font-bold text-xs md:text-sm">{card.label}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 md:p-8 bg-white/90 rounded-3xl mt-8 animate-fade-in">
              <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500 mb-4">
                Bem-vindo!
              </h2>
              <p className="text-base md:text-lg mb-6 md:mb-8">Ajude a Mila a entender o que as pessoas querem dizer.</p>
              <button
                onClick={startGame}
                className="px-8 py-3 md:px-12 md:py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg md:text-2xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                🚀 Começar a Jogar
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer com a Mila - fixo no fundo */}
      <div className="fixed bottom-0 left-0 w-full z-20 pointer-events-none">
        <div className="max-w-6xl mx-auto relative h-28 md:h-36">
          {/* Imagem da Mila */}
          <div className="absolute bottom-0 left-2 md:left-4 w-24 md:w-32 pointer-events-auto">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <span className="text-4xl md:text-5xl">🧙‍♀️</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Balão de fala da Mila */}
          {milaMessage && (
            <div className="absolute bottom-4 left-28 md:left-40 right-4 md:right-auto md:max-w-md pointer-events-auto">
              <div className="bg-white px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-bl-none shadow-2xl border-2 border-violet-400 relative">
                <p className="text-xs md:text-base font-semibold text-center">{milaMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de vitória */}
      {showVictoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full transform animate-bounce border-4 border-yellow-400 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-4">
              🎉 Fase Completa! 🎉
            </h2>
            <p className="text-base md:text-xl text-gray-700 mb-4">
              Você é incrível! Ganhou uma Gema Mágica e +250 pontos bônus!
            </p>
            <button 
              onClick={nextPhase} 
              className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-base md:text-lg rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              {currentPhaseIndex + 1 >= gameConfig.phases.length ? '🏆 Aventura Concluída!' : '🚀 Próxima Fase'}
            </button>
          </div>
        </div>
      )}
      
      {/* Modal de game over */}
      {showGameOverModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full transform animate-bounce border-4 border-red-400 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-red-500 mb-4">😢 Fim de Jogo</h2>
            <p className="text-base md:text-xl text-gray-700 mb-2">
              Sua pontuação final foi: <span className="font-bold text-violet-600">{score}</span>
            </p>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Não desanime! A prática leva à perfeição.
            </p>
            <button 
              onClick={startGame} 
              className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-base md:text-lg rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
