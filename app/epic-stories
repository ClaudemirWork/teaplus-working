'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- Interfaces do Jogo ---
interface Card {
  id: string;
  label: string;
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
  templates: StorySegment[][]; // Array de templates de história
}

// --- BANCO DE CARDS NARRATIVOS (Baseado no seu log) ---
// OBS: Este é um banco inicial. Precisamos expandi-lo com todos os seus cards.
const narrativeCards: { [key in Card['category']]: Card[] } = {
  personagens: [
    { id: 'cachorro', label: 'um cachorro', image: '/images/cards/animais/cachorro.webp', category: 'personagens' },
    { id: 'gato', label: 'um gato', image: '/images/cards/animais/gato.webp', category: 'personagens' },
    { id: 'cavalo', label: 'um cavalo', image: '/images/cards/animais/cavalo.webp', category: 'personagens' },
    { id: 'elefante', label: 'um elefante', image: '/images/cards/animais/elefante.webp', category: 'personagens' },
    { id: 'eu', label: 'Eu', image: '/images/cards/core/eu.webp', category: 'personagens' },
    { id: 'voce', label: 'Você', image: '/images/cards/core/voce.webp', category: 'personagens' },
  ],
  acoes: [
    { id: 'brincar', label: 'brincar', image: '/images/cards/rotina/brincar.webp', category: 'acoes' },
    { id: 'caminhar', label: 'caminhar', image: '/images/cards/acoes/caminhar.webp', category: 'acoes' },
    { id: 'beber', label: 'beber', image: '/images/cards/acoes/beber.webp', category: 'acoes' },
    { id: 'estudar', label: 'estudar', image: '/images/cards/rotina/estudar.webp', category: 'acoes' },
    { id: 'ler_livro', label: 'ler um livro', image: '/images/cards/acoes/ler_livro.webp', category: 'acoes' },
    { id: 'conversar', label: 'conversar', image: '/images/cards/acoes/conversar.webp', category: 'acoes' },
  ],
  emocoes: [
    // Usando cards de 'acoes' como placeholder para emoções
    { id: 'feliz', label: 'feliz', image: '/images/cards/acoes/saltar.webp', category: 'emocoes' },
    { id: 'triste', label: 'triste', image: '/images/cards/acoes/pensar.webp', category: 'emocoes' },
    { id: 'bravo', label: 'bravo', image: '/images/cards/acoes/gritar.webp', category: 'emocoes' },
  ],
  lugares: [
    { id: 'casa', label: 'em casa', image: '/images/cards/casa/casa.webp', category: 'lugares' }, // Exemplo
    { id: 'escola', label: 'na escola', image: '/images/cards/escola/escola.webp', category: 'lugares' },// Exemplo
    { id: 'jardim', label: 'no jardim', image: '/images/cards/casa/jardim.webp', category: 'lugares' },
  ],
  objetos: [
    { id: 'livro', label: 'o livro', image: '/images/cards/escola/livro.webp', category: 'objetos' },
    { id: 'maca', label: 'a maçã', image: '/images/cards/alimentos/maca.webp', category: 'objetos' },
    { id: 'cama', label: 'a cama', image: '/images/cards/casa/cama.webp', category: 'objetos' },
    { id: 'mesa', label: 'a mesa', image: '/images/cards/casa/mesa.webp', category: 'objetos' },
  ],
  tempo: [
    { id: 'hoje', label: 'Hoje', image: '/images/cards/rotina/hoje.webp', category: 'tempo' },
    { id: 'manha', label: 'de manhã', image: '/images/cards/rotina/manha.webp', category: 'tempo' },
    { id: 'noite', label: 'de noite', image: '/images/cards/rotina/noite.webp', category: 'tempo' },
    { id: 'ontem', label: 'Ontem', image: '/images/cards/rotina/Ontem.webp', category: 'tempo' },
  ]
};

// --- ESTRUTURA DAS FASES E TEMPLATES DE HISTÓRIAS ---
const storyLevels: StoryLevel[] = [
    {
        level: 1,
        name: "Minhas Primeiras Histórias",
        storiesToComplete: 3,
        templates: [
            [{ text: "Era uma vez", type: "personagens", options: 3 }, { text: "que estava se sentindo", type: "emocoes", options: 3 }, { text: ".", type: "acoes", options: 0 }],
            [{ text: "Hoje", type: "tempo", options: 3 }, { text: "", type: "personagens", options: 3 }, { text: "foi", type: "acoes", options: 4 }, { text: ".", type: "acoes", options: 0 }],
            [{ text: "Eu vi", type: "personagens", options: 4 }, { text: "", type: "acoes", options: 4 }, { text: "na", type: "lugares", options: 3 }, { text: ".", type: "acoes", options: 0 }],
        ]
    },
    {
        level: 2,
        name: "Aventuras do Dia a Dia",
        storiesToComplete: 4,
        templates: [
            [{ text: "Certo dia,", type: "personagens", options: 4 }, { text: "foi para a", type: "lugares", options: 3 }, { text: "para", type: "acoes", options: 4 }, { text: ".", type: "acoes", options: 0 }],
            [{ text: "Na escola, eu gosto de", type: "acoes", options: 4 }, { text: "com", type: "objetos", options: 3 }, { text: "e fico", type: "emocoes", options: 3 }, { text: ".", type: "acoes", options: 0 }],
        ]
    }
];

export default function HistoriasEpicasGame() {
  // Estados do Jogo
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'storyComplete' | 'levelComplete'>('intro');
  const [introStep, setIntroStep] = useState(0);
  const [leoMessage, setLeoMessage] = useState('');
  
  // Estados da História
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [storiesCompletedInLevel, setStoriesCompletedInLevel] = useState(0);
  const [currentStoryTemplate, setCurrentStoryTemplate] = useState<StorySegment[]>([]);
  const [storyProgress, setStoryProgress] = useState<StorySegment[]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [cardOptions, setCardOptions] = useState<Card[]>([]);

  const introMessages = [
    "Bem vindo ao jogo 'Histórias épicas', aqui eu vou te ajudar a construir suas próprias estórias, e com isto, ajudar a todos neste mundo mágico, a ter um final feliz.",
    "O jogo é bem simples, no alto, temos uma frase que é o resumo de cada estória no nível 1, e existe uma palavra que você deve escolher dos cards abaixo, que completa o sentimento ou a ação do personagem central.",
    "Ao escolher o card, vou ler a frase resumo da sua história, e se concordar, salvamos e seguimos em frente para outras histórias.",
    "Vamos comigo, escrever histórias lindas?"
  ];

  // --- FUNÇÕES DE CONTROLE DO JOGO ---
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
    leoSpeak(introMessages[0]);
  }, [leoSpeak]);
  
  const handleIntroNext = () => {
    const nextStep = introStep + 1;
    if (nextStep < introMessages.length) {
      setIntroStep(nextStep);
      leoSpeak(introMessages[nextStep]);
    } else {
      startGame();
    }
  };

  const startGame = () => {
    setGameState('playing');
    loadNewStory();
  };
  
  const loadNewStory = () => {
    const level = storyLevels[currentLevelIndex];
    // Escolhe um template aleatório do nível atual
    const randomTemplate = [...level.templates[Math.floor(Math.random() * level.templates.length)]];
    
    setCurrentStoryTemplate(randomTemplate);
    setStoryProgress(randomTemplate.map(segment => ({ ...segment, selectedCard: undefined })));
    setCurrentSegmentIndex(0);
    generateCardOptions(randomTemplate[0]);
    setGameState('playing');
    leoSpeak(`Vamos criar uma nova história! ${randomTemplate[0].text}...`);
  };

  const generateCardOptions = (segment: StorySegment) => {
    const { type, options } = segment;
    const allCardsInCategory = narrativeCards[type];
    const shuffled = [...allCardsInCategory].sort(() => 0.5 - Math.random());
    setCardOptions(shuffled.slice(0, options));
  };
  
  const handleCardSelection = (card: Card) => {
    const updatedProgress = [...storyProgress];
    updatedProgress[currentSegmentIndex].selectedCard = card;
    setStoryProgress(updatedProgress);

    const nextSegmentIndex = currentSegmentIndex + 1;
    const isStoryFinished = nextSegmentIndex >= currentStoryTemplate.filter(s => s.options > 0).length;

    if (isStoryFinished) {
      const finalStoryText = updatedProgress
        .map(s => `${s.text} ${s.selectedCard ? s.selectedCard.label : ''}`)
        .join(' ')
        .replace(/\s+/g, ' ').trim();
      
      leoSpeak(`Sua história ficou assim: "${finalStoryText}"... Incrível!`);
      setStoriesCompletedInLevel(prev => prev + 1);
      setGameState('storyComplete');
    } else {
      setCurrentSegmentIndex(nextSegmentIndex);
      generateCardOptions(currentStoryTemplate[nextSegmentIndex]);
      leoSpeak(`Perfeito! Agora, ${currentStoryTemplate[nextSegmentIndex].text}...`);
    }
  };

  const handleNext = () => {
      const level = storyLevels[currentLevelIndex];
      if(storiesCompletedInLevel >= level.storiesToComplete) {
          // Lógica para avançar de nível
          const nextLevelIndex = currentLevelIndex + 1;
          if(nextLevelIndex < storyLevels.length) {
              setCurrentLevelIndex(nextLevelIndex);
              setStoriesCompletedInLevel(0);
              leoSpeak(`Parabéns! Você completou a fase ${level.name}! Vamos para a próxima!`);
              loadNewStory();
          } else {
              leoSpeak("Uau! Você completou todas as histórias! Você é um escritor épico!");
              // Fim de jogo
          }
      } else {
          loadNewStory();
      }
  }

  // --- RENDERIZAÇÃO DOS COMPONENTES VISUAIS ---
  
  const renderIntro = () => (
    <div className="flex flex-col items-center text-center p-6 bg-white/90 rounded-3xl shadow-2xl max-w-lg mx-auto">
      <img src="/images/mascotes/leo/leo_mago.webp" alt="Leo Mago" className="w-48 drop-shadow-lg mb-4"/>
      <h1 className="text-3xl font-bold text-orange-600 mb-4">Histórias Épicas</h1>
      <p className="text-base text-gray-700 mb-6 min-h-[100px] flex items-center justify-center">{leoMessage}</p>
      <button onClick={handleIntroNext} className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
        {introStep < introMessages.length - 1 ? 'Continuar →' : 'Vamos Começar!'}
      </button>
    </div>
  );

  const renderGame = () => {
    const level = storyLevels[currentLevelIndex];
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl w-full max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Fase {level.level}: {level.name}</h2>
            <p className="text-sm text-gray-600">Histórias completas: {storiesCompletedInLevel} de {level.storiesToComplete}</p>
        </div>

        {/* Visualizador da História */}
        <div className="bg-yellow-50 p-4 rounded-xl mb-6 border-2 border-yellow-200 min-h-[80px]">
          <p className="text-lg md:text-xl text-gray-800">
            {storyProgress.map((segment, index) => (
              <span key={index} className={index === currentSegmentIndex && gameState === 'playing' ? 'font-bold text-blue-600' : ''}>
                {segment.text}{' '}
                {segment.selectedCard ? (
                  <span className="inline-block bg-white p-1 rounded-md shadow-sm font-semibold text-blue-700">
                    {segment.selectedCard.label}
                  </span>
                ) : (
                  segment.options > 0 && <span className="text-gray-400">_____</span>
                )}
                {' '}
              </span>
            ))}
          </p>
        </div>
        
        {/* Balão de Fala do Leo */}
        <div className="flex items-center gap-4 my-4 justify-center">
           <img src="/images/mascotes/leo/leo_rosto.webp" alt="Leo" className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-orange-400"/>
           <div className="relative bg-white p-3 rounded-lg shadow-md flex-1">
              <p className="text-center font-medium text-gray-700">{leoMessage}</p>
           </div>
        </div>

        {/* Área de Ação (Cards ou Botão de Próxima) */}
        {gameState === 'playing' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {cardOptions.map(card => (
              <button 
                key={card.id}
                onClick={() => handleCardSelection(card)}
                className="p-2 bg-white rounded-xl shadow-lg border-3 border-violet-200 hover:border-violet-500 hover:scale-105 transition-all transform focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <div className="aspect-square bg-white rounded-md overflow-hidden">
                  <img src={card.image} alt={card.label} className="w-full h-full object-contain"/>
                </div>
                <p className="mt-2 text-center font-bold text-sm text-gray-800">{card.label}</p>
              </button>
            ))}
          </div>
        ) : (
            <div className='text-center mt-6'>
                <button onClick={handleNext} className="px-8 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold text-lg rounded-full shadow-xl animate-pulse">
                    Próxima História!
                </button>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-200 to-red-200 p-4 flex items-center justify-center font-sans">
      {gameState === 'intro' ? renderIntro() : renderGame()}
    </div>
  );
}
