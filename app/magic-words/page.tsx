'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

// --- BANCO DE DADOS COMPLETO DE CARDS ---
// Mapeado a partir da sua estrutura de arquivos no GitHub
const allCardsData: Card[] = [
  // Acoes
  { id: 'pensar', label: 'Pensar', image: '/images/cards/acoes/Pensar.webp', category: 'acoes' },
  { id: 'abracar', label: 'Abraçar', image: '/images/cards/acoes/abracar.webp', category: 'acoes' },
  { id: 'abrir_a_macaneta', label: 'Abrir a Maçaneta', image: '/images/cards/acoes/abrir a maçaneta.webp', category: 'acoes' },
  { id: 'abrir_a_porta', label: 'Abrir a Porta', image: '/images/cards/acoes/abrir a porta.webp', category: 'acoes' },
  { id: 'abrir_fechadura', label: 'Abrir Fechadura', image: '/images/cards/acoes/abrir_fechadura.webp', category: 'acoes' },
  { id: 'caminhar', label: 'Caminhar', image: '/images/cards/acoes/caminhar.webp', category: 'acoes' },
  { id: 'beber', label: 'Beber', image: '/images/cards/acoes/beber.webp', category: 'acoes' },
  { id: 'dancar_sozinho', label: 'Dançar', image: '/images/cards/acoes/dançar sozinho.webp', category: 'acoes' },
  { id: 'escrever', label: 'Escrever', image: '/images/cards/acoes/escrever.webp', category: 'acoes' },
  { id: 'falar', label: 'Falar', image: '/images/cards/acoes/falar.webp', category: 'acoes' },
  { id: 'ler_livro', label: 'Ler Livro', image: '/images/cards/acoes/ler_livro.webp', category: 'acoes' },
  { id: 'olhando', label: 'Olhar', image: '/images/cards/acoes/olhando.webp', category: 'acoes' },
  { id: 'sentar', label: 'Sentar', image: '/images/cards/acoes/sentar.webp', category: 'acoes' },
  { id: 'tocar', label: 'Tocar', image: '/images/cards/acoes/tocar.webp', category: 'acoes' },

  // Alimentos
  { id: 'abacate', label: 'Abacate', image: '/images/cards/alimentos/abacate.webp', category: 'alimentos' },
  { id: 'abacaxi', label: 'Abacaxi', image: '/images/cards/alimentos/abacaxi.webp', category: 'alimentos' },
  { id: 'banana', label: 'Banana', image: '/images/cards/alimentos/banana.webp', category: 'alimentos' },
  { id: 'batata', label: 'Batata', image: '/images/cards/alimentos/batata.webp', category: 'alimentos' },
  { id: 'cachorro_quente', label: 'Cachorro Quente', image: '/images/cards/alimentos/cachorro_quente.webp', category: 'alimentos' },
  { id: 'fruta_laranja', label: 'Laranja', image: '/images/cards/alimentos/fruta_laranja.webp', category: 'alimentos' },
  { id: 'maca', label: 'Maçã', image: '/images/cards/alimentos/maca.webp', category: 'alimentos' },
  { id: 'macarrao_bologhesa', label: 'Macarrão', image: '/images/cards/alimentos/macarrao_bologhesa.webp', category: 'alimentos' },
  { id: 'melancia', label: 'Melancia', image: '/images/cards/alimentos/melancia.webp', category: 'alimentos' },
  { id: 'morango', label: 'Morango', image: '/images/cards/alimentos/morango.webp', category: 'alimentos' },
  { id: 'ovo_frito', label: 'Ovo Frito', image: '/images/cards/alimentos/ovo_frito.webp', category: 'alimentos' },
  { id: 'pizza', label: 'Pizza', image: '/images/cards/alimentos/pizza.webp', category: 'alimentos' },
  { id: 'sanduiche', label: 'Sanduíche', image: '/images/cards/alimentos/sanduiche.webp', category: 'alimentos' },
  { id: 'suco_laranja', label: 'Suco de Laranja', image: '/images/cards/alimentos/suco_laranja.webp', category: 'alimentos' },
  { id: 'tomate', label: 'Tomate', image: '/images/cards/alimentos/tomate.webp', category: 'alimentos' },
  { id: 'uvas_verdes', label: 'Uva', image: '/images/cards/alimentos/uvas_verdes.webp', category: 'alimentos' },

  // Animais
  { id: 'vaca', label: 'Vaca', image: '/images/cards/animais/Vaca.webp', category: 'animais' },
  { id: 'abelha', label: 'Abelha', image: '/images/cards/animais/abelha.webp', category: 'animais' },
  { id: 'cachorro', label: 'Cachorro', image: '/images/cards/animais/cachorro.webp', category: 'animais' },
  { id: 'cavalo', label: 'Cavalo', image: '/images/cards/animais/cavalo.webp', category: 'animais' },
  { id: 'coelho', label: 'Coelho', image: '/images/cards/animais/coelho.webp', category: 'animais' },
  { id: 'coruja', label: 'Coruja', image: '/images/cards/animais/coruja.webp', category: 'animais' },
  { id: 'elefante', label: 'Elefante', image: '/images/cards/animais/elefante.webp', category: 'animais' },
  { id: 'gato', label: 'Gato', image: '/images/cards/animais/gato.webp', category: 'animais' },
  { id: 'girafa', label: 'Girafa', image: '/images/cards/animais/girafa.webp', category: 'animais' },
  { id: 'leao', label: 'Leão', image: '/images/cards/animais/leão.webp', category: 'animais' },
  { id: 'ovelha', label: 'Ovelha', image: '/images/cards/animais/ovelha.webp', category: 'animais' },
  { id: 'pato', label: 'Pato', image: '/images/cards/animais/pato.webp', category: 'animais' },
  { id: 'peixe', label: 'Peixe', image: '/images/cards/animais/peixe.webp', category: 'animais' },
  { id: 'pinguim', label: 'Pinguim', image: '/images/cards/animais/pinguim.webp', category: 'animais' },
  { id: 'sapo', label: 'Sapo', image: '/images/cards/animais/sapo.webp', category: 'animais' },
  { id: 'tartaruga', label: 'Tartaruga', image: '/images/cards/animais/tartaruga.webp', category: 'animais' },
  { id: 'tigre', label: 'Tigre', image: '/images/cards/animais/tigre.webp', category: 'animais' },
  { id: 'urso', label: 'Urso', image: '/images/cards/animais/urso.webp', category: 'animais' },
  { id: 'zebra', label: 'Zebra', image: '/images/cards/animais/zebra.webp', category: 'animais' },
  
  // Casa
  { id: 'abajur', label: 'Abajur', image: '/images/cards/casa/abajur.webp', category: 'casa' },
  { id: 'mesa', label: 'Mesa', image: '/images/cards/casa/mesa.webp', category: 'casa' },
  { id: 'panela', label: 'Panela', image: '/images/cards/casa/panela.webp', category: 'casa' },
  { id: 'sofa_dois_lugares', label: 'Sofá', image: '/images/cards/casa/sofa_dois_lugares.webp', category: 'casa' },
  { id: 'tesoura', label: 'Tesoura', image: '/images/cards/casa/tesoura.webp', category: 'casa' },
  { id: 'vaso_planta', label: 'Vaso de Planta', image: '/images/cards/casa/vaso_planta.webp', category: 'casa' },
  { id: 'vassoura', label: 'Vassoura', image: '/images/cards/casa/vassoura.webp', category: 'casa' },
  
  // Necessidades
  { id: 'banheiro', label: 'Banheiro', image: '/images/cards/necessidades/banheiro.webp', category: 'necessidades' },
  { id: 'comer', label: 'Comer', image: '/images/cards/necessidades/comer.webp', category: 'necessidades' },
  { id: 'descansar', label: 'Descansar', image: '/images/cards/necessidades/descansar.webp', category: 'necessidades' },
  { id: 'dor_cabeca', label: 'Dor de Cabeça', image: '/images/cards/necessidades/dor_cabeca.webp', category: 'necessidades' },
  { id: 'estou_com_sede', label: 'Estou com Sede', image: '/images/cards/necessidades/estou_com_sede.webp', category: 'necessidades' },
  { id: 'homem_dormindo', label: 'Dormir', image: '/images/cards/necessidades/homem_dormindo.webp', category: 'necessidades' },
  { id: 'tomar_banho', label: 'Tomar Banho', image: '/images/cards/necessidades/tomar banho.webp', category: 'necessidades' },
  
  // Emoções
  { id: 'homem_feliz', label: 'Feliz', image: '/images/cards/emocoes/homem_feliz.webp', category: 'emocoes' },
  { id: 'homem_triste', label: 'Triste', image: '/images/cards/emocoes/homem_triste.webp', category: 'emocoes' },
  { id: 'homem_furioso', label: 'Bravo', image: '/images/cards/emocoes/homem_furioso.webp', category: 'emocoes' },
  { id: 'homem_surpreso', label: 'Surpreso', image: '/images/cards/emocoes/homem_surpreso.webp', category: 'emocoes' },
  { id: 'assustado', label: 'Assustado', image: '/images/cards/emocoes/assustado.webp', category: 'emocoes' },

  // Roupas
  { id: 'calcas', label: 'Calças', image: '/images/cards/roupas/calcas.webp', category: 'roupas' },
  { id: 'camisa', label: 'Camisa', image: '/images/cards/roupas/camisa.webp', category: 'roupas' },
  { id: 'camiseta', label: 'Camiseta', image: '/images/cards/roupas/camiseta.webp', category: 'roupas' },
  { id: 'casaco', label: 'Casaco', image: '/images/cards/roupas/casaco.webp', category: 'roupas' },
  { id: 'meias', label: 'Meias', image: '/images/cards/roupas/meias.webp', category: 'roupas' },
  { id: 'vestido', label: 'Vestido', image: '/images/cards/roupas/vestido.webp', category: 'roupas' },
  
  // Transportes
  { id: 'aviao_comercial', label: 'Avião', image: '/images/cards/transportes/aviao_comercial.webp', category: 'transportes' },
  { id: 'carro_azul', label: 'Carro', image: '/images/cards/transportes/carro_azul.webp', category: 'transportes' },
  { id: 'metro', label: 'Metrô', image: '/images/cards/transportes/metro.webp', category: 'transportes' },
  { id: 'micro_onibus', label: 'Ônibus', image: '/images/cards/transportes/micro_onibus.webp', category: 'transportes' },
  { id: 'trem', label: 'Trem', image: '/images/cards/transportes/trem.webp', category: 'transportes' },
];


// --- Configuração Central do Jogo ---
const gameConfig = {
  phases: [
    { cards: 4, rounds: 5, name: "Tradutor Iniciante" },
    { cards: 6, rounds: 7, name: "Intérprete Aprendiz" },
    { cards: 8, rounds: 8, name: "Mestre dos Gestos" },
    { cards: 12, rounds: 10, name: "Feiticeiro das Palavras" }
  ] as Phase[],
  cards: allCardsData,
  npcNames: ['Maria', 'João', 'Ana', 'Lucas', 'Sofia', 'Pedro']
};

export default function MagicWordsGame() {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- Estados do Jogo ---
  const [currentPhase, setCurrentPhase] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUiBlocked, setIsUiBlocked] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const [correctCard, setCorrectCard] = useState<Card | null>(null);
  const [npcName, setNpcName] = useState('Maria');
  const [cardFeedback, setCardFeedback] = useState<{ [key: string]: 'correct' | 'wrong' }>({});

  const [milaMessage, setMilaMessage] = useState("Olá! Sou a Mila! Vamos descobrir o que as pessoas querem?");
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // --- Mensagens da Mila ---
  const milaMessages = {
    start: "Vamos começar! Preste atenção no que eu vou pedir.",
    nextRound: ["Observe com atenção!", "Qual card o(a) nosso(a) amigo(a) quer?", "Você consegue encontrar!"],
    correct: ["Isso mesmo! 🎉", "Você encontrou! ⭐", "Excelente! 🌟", "Continue assim! 💪"],
    error: "Ops, não foi esse. Mas não desista! ❤️",
    phaseComplete: "Uau! Você completou a fase e ganhou mais pontos! ✨",
    gameOver: "Não foi dessa vez, mas você foi incrível! Vamos tentar de novo? 😊"
  };

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
    setCurrentPhase(0);
    setScore(0);
    setRoundsCompleted(0);
    setLives(3);
    setIsPlaying(true);
    setShowGameOverModal(false);
    setShowVictoryModal(false);
    milaSpeak(milaMessages.start);
    setTimeout(() => nextRound(0), 2000);
  }, [milaSpeak]);

  const nextRound = useCallback((phaseIndex: number) => {
    setIsUiBlocked(true);
    const phase = gameConfig.phases[phaseIndex];
    
    const shuffledDeck = [...gameConfig.cards].sort(() => 0.5 - Math.random());
    
    const correct = shuffledDeck[0];
    const distractors = shuffledDeck.slice(1, phase.cards);
    
    const roundCards = [correct, ...distractors].sort(() => 0.5 - Math.random());
    
    setCorrectCard(correct);
    setCurrentCards(roundCards);
    setCardFeedback({});
    
    const randomNpcName = gameConfig.npcNames[Math.floor(Math.random() * gameConfig.npcNames.length)];
    setNpcName(randomNpcName);

    setTimeout(() => {
        milaSpeak(`${randomNpcName} quer o card que mostra... '${correct.label}'. Você consegue encontrar?`);
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
        const phase = gameConfig.phases[currentPhase];
        if (newRoundsCompleted >= phase.rounds) {
          handlePhaseComplete();
        } else {
          nextRound(currentPhase);
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
          nextRound(currentPhase);
        }, 2500);
      }
    }
  };

  const handlePhaseComplete = () => {
    playSound('win');
    setScore(prev => prev + 250); // Bônus
    milaSpeak(milaMessages.phaseComplete);
    setShowVictoryModal(true);
  };
  
  const nextPhase = useCallback(() => {
    const newPhase = currentPhase + 1;
    setShowVictoryModal(false);
    
    if (newPhase >= gameConfig.phases.length) {
      startGame();
    } else {
      setCurrentPhase(newPhase);
      setRoundsCompleted(0);
      setLives(3);
      setTimeout(() => nextRound(newPhase), 1000);
    }
  }, [currentPhase, nextRound, startGame]);


  const phase = gameConfig.phases[currentPhase];
  const progress = phase ? (roundsCompleted / phase.rounds) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-violet-200 to-pink-200 relative overflow-hidden text-gray-800">
      <div className="relative z-10 max-w-4xl mx-auto p-2 md:p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 mb-4 shadow-lg border-2 border-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => router.push('/')} className="p-2 hover:bg-sky-100 rounded-xl transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">
                ✨ Palavras Mágicas ✨
              </h1>
            </div>
            <div className="flex gap-2 md:gap-3 items-center">
              <div className="bg-gradient-to-br from-red-400 to-pink-400 text-white px-3 py-1.5 rounded-xl shadow-md text-center">
                <div className="text-xs">Vidas</div>
                <div className="text-xl font-bold">{'❤️'.repeat(lives)}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white px-4 py-1.5 rounded-xl shadow-md text-center">
                <div className="text-xs">Pontos</div>
                <div className="text-xl font-bold">{score}</div>
              </div>
               <button onClick={() => setIsSoundOn(!isSoundOn)} className="p-2 hover:bg-sky-100 rounded-xl transition-colors">
                {isSoundOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isPlaying ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl border-2 border-violet-200">
          <div className="text-center mb-4">
            <h2 className="text-lg md:text-2xl font-bold mb-2">
             🌟 Fase {currentPhase + 1}: {phase.name} 🌟
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-6 border border-gray-300">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-sky-400 flex items-center justify-center text-white text-sm font-bold transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              >
                {roundsCompleted}/{phase.rounds}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center my-4 md:my-6">
              <div className="bg-white p-4 rounded-2xl shadow-md text-center border-2 border-pink-200 animate-fade-in">
                  <div className="text-6xl md:text-8xl animate-bounce">🤔</div>
                  <p className="font-bold mt-2 text-lg">{npcName}</p>
              </div>
          </div>

          <div className={`grid gap-3 md:gap-4 transition-opacity duration-500 ${isUiBlocked ? 'opacity-50' : 'opacity-100'}`}
               style={{ gridTemplateColumns: `repeat(${phase.cards <= 6 ? 3 : 4}, 1fr)`}}>
            {currentCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={isUiBlocked}
                className={`
                  p-2 bg-white rounded-2xl shadow-lg border-4 transition-all duration-300 transform 
                  ${isUiBlocked ? 'cursor-wait' : 'hover:scale-105 hover:shadow-xl'}
                  ${cardFeedback[card.id] === 'correct' ? 'border-green-400 scale-110 animate-pulse' : ''}
                  ${cardFeedback[card.id] === 'wrong' ? 'border-red-400 animate-shake' : ''}
                  ${!cardFeedback[card.id] ? 'border-white' : ''}
                `}
              >
                <img src={card.image} alt={card.label} className="w-full h-auto object-contain aspect-square" />
                <p className="mt-2 text-center font-bold text-sm md:text-base">{card.label}</p>
              </button>
            ))}
          </div>
        </div>
        ) : (
        <div className="text-center p-8 bg-white/90 rounded-3xl mt-16 animate-fade-in">
             <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500 mb-4">
               Bem-vindo!
             </h2>
             <p className="text-lg mb-8">Ajude a Mila a entender o que as pessoas querem dizer.</p>
             <button
              onClick={startGame}
              className="px-12 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-2xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              🚀 Começar a Jogar
            </button>
        </div>
        )}
      </div>

      <div className="fixed bottom-0 -left-4 md:left-2 z-20 w-48 md:w-80 pointer-events-none">
           <img src="/images/mascotes/mila/mila_apoio_resultado.webp" alt="Mila Mascote" className="w-full h-full object-contain drop-shadow-2xl" />
      </div>
      <div className="fixed bottom-10 md:bottom-24 left-36 md:left-72 z-30 max-w-md">
        <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-2xl border-2 border-violet-400 relative">
            <p className="text-center font-semibold text-base md:text-lg">{milaMessage}</p>
            <div className="absolute -bottom-3 left-0 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-white transform -translate-x-full"></div>
        </div>
      </div>
      
      {showVictoryModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full transform animate-bounce border-4 border-yellow-400 text-center">
             <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-4">🎉 Fase Completa! 🎉</h2>
             <p className="text-xl text-gray-700 mb-4">Você é incrível! Ganhou +250 pontos bônus!</p>
             <button onClick={nextPhase} className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                {currentPhase + 1 >= gameConfig.phases.length ? '🏆 Jogar Novamente' : '🚀 Próxima Fase'}
             </button>
           </div>
         </div>
      )}
      {showGameOverModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full transform animate-bounce border-4 border-red-400 text-center">
             <h2 className="text-4xl font-bold text-red-500 mb-4">😢 Fim de Jogo 😢</h2>
             <p className="text-xl text-gray-700 mb-2">Sua pontuação final foi: <span className="font-bold text-violet-600">{score}</span></p>
             <p className="text-gray-600 mb-6">Não desanime! A prática leva à perfeição.</p>
             <button onClick={startGame} className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                 Tentar Novamente
             </button>
           </div>
         </div>
      )}
    </div>
  );
}
