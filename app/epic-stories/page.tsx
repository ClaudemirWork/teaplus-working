'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookText, Sparkles, Wand2 } from 'lucide-react'; // Ícones para o cabeçalho

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

// --- BANCO DE CARDS NARRATIVOS (Expandido e Mapeado com seus cards) ---
const narrativeCards: { [key in Card['category']]: Card[] } = {
  personagens: [
    { id: 'cachorro', label: 'um cachorro', image: '/images/cards/animais/cachorro.webp', category: 'personagens' },
    { id: 'gato', label: 'um gato', image: '/images/cards/animais/gato.webp', category: 'personagens' },
    { id: 'cavalo', label: 'um cavalo', image: '/images/cards/animais/cavalo.webp', category: 'personagens' },
    { id: 'elefante', label: 'um elefante', image: '/images/cards/animais/elefante.webp', category: 'personagens' },
    { id: 'eu', label: 'Eu', image: '/images/cards/core/eu.webp', category: 'personagens' },
    { id: 'voce', label: 'Você', image: '/images/cards/core/voce.webp', category: 'personagens' },
    { id: 'menina', label: 'uma menina', image: '/images/cards/pessoas/menina.webp', category: 'personagens' },
    { id: 'menino', label: 'um menino', image: '/images/cards/pessoas/menino.webp', category: 'personagens' },
    { id: 'professora', label: 'a professora', image: '/images/cards/escola/professora.webp', category: 'personagens' },
    { id: 'amigo', label: 'um amigo', image: '/images/cards/pessoas/amigo.webp', category: 'personagens' },
  ],
  acoes: [
    { id: 'brincar', label: 'brincar', image: '/images/cards/rotina/brincar.webp', category: 'acoes' },
    { id: 'caminhar', label: 'caminhar', image: '/images/cards/acoes/caminhar.webp', category: 'acoes' },
    { id: 'beber', label: 'beber', image: '/images/cards/acoes/beber.webp', category: 'acoes' },
    { id: 'estudar', label: 'estudar', image: '/images/cards/rotina/estudar.webp', category: 'acoes' },
    { id: 'ler_livro', label: 'ler um livro', image: '/images/cards/acoes/ler_livro.webp', category: 'acoes' },
    { id: 'conversar', label: 'conversar', image: '/images/cards/acoes/conversar.webp', category: 'acoes' },
    { id: 'correr', label: 'correr', image: '/images/cards/acoes/correr.webp', category: 'acoes' },
    { id: 'comer', label: 'comer', image: '/images/cards/acoes/mastigar.webp', category: 'acoes' },
    { id: 'escrever', label: 'escrever', image: '/images/cards/acoes/escrever.webp', category: 'acoes' },
    { id: 'ajudar', label: 'ajudar', image: '/images/cards/acoes/entregar.webp', category: 'acoes' }, // Exemplo de 'entregar' como 'ajudar'
  ],
  emocoes: [
    // Mapeamento usando seus cards, com rótulos mais específicos para contexto narrativo.
    { id: 'feliz', label: 'feliz', image: '/images/cards/descritivo/feliz.webp', category: 'emocoes' },
    { id: 'triste', label: 'triste', image: '/images/cards/descritivo/triste.webp', category: 'emocoes' },
    { id: 'bravo', label: 'bravo', image: '/images/cards/descritivo/bravo.webp', category: 'emocoes' },
    { id: 'com_medo', label: 'com medo', image: '/images/cards/descritivo/com_medo.webp', category: 'emocoes' }, // Supondo card existe
    { id: 'animado', label: 'animado', image: '/images/cards/descritivo/animado.webp', category: 'emocoes' }, // Supondo card existe
    { id: 'calmo', label: 'calmo', image: '/images/cards/descritivo/calmo.webp', category: 'emocoes' }, // Supondo card existe
  ],
  lugares: [
    { id: 'casa', label: 'em casa', image: '/images/cards/casa/casa.webp', category: 'lugares' },
    { id: 'escola', label: 'na escola', image: '/images/cards/escola/escola.webp', category: 'lugares' },
    { id: 'jardim', label: 'no jardim', image: '/images/cards/casa/jardim.webp', category: 'lugares' },
    { id: 'parque', label: 'no parque', image: '/images/cards/lugares/parque.webp', category: 'lugares' },
    { id: 'quarto', label: 'no quarto', image: '/images/cards/casa/quarto.webp', category: 'lugares' },
  ],
  objetos: [
    { id: 'livro', label: 'o livro', image: '/images/cards/escola/livro.webp', category: 'objetos' },
    { id: 'maca', label: 'a maçã', image: '/images/cards/alimentos/maca.webp', category: 'objetos' },
    { id: 'cama', label: 'a cama', image: '/images/cards/casa/cama.webp', category: 'objetos' },
    { id: 'mesa', label: 'a mesa', image: '/images/cards/casa/mesa.webp', category: 'objetos' },
    { id: 'bola', label: 'a bola', image: '/images/cards/brinquedos/bola.webp', category: 'objetos' }, // Supondo card existe
    { id: 'lapis', label: 'o lápis', image: '/images/cards/escola/lapis.webp', category: 'objetos' },
  ],
  tempo: [
    { id: 'hoje', label: 'Hoje', image: '/images/cards/rotina/hoje.webp', category: 'tempo' },
    { id: 'manha', label: 'de manhã', image: '/images/cards/rotina/manha.webp', category: 'tempo' },
    { id: 'noite', label: 'de noite', image: '/images/cards/rotina/noite.webp', category: 'tempo' },
    { id: 'ontem', label: 'Ontem', image: '/images/cards/rotina/Ontem.webp', category: 'tempo' },
    { id: 'tarde', label: 'de tarde', image: '/images/cards/rotina/tarde.webp', category: 'tempo' }, // Supondo card existe
  ]
};

// --- ESTRUTURA DAS FASES E TEMPLATES DE HISTÓRIAS ---
const storyLevels: StoryLevel[] = [
    {
        level: 1,
        name: "Primeiras Aventuras",
        storiesToComplete: 3,
        templates: [
            // Template 1.1: Personagem + Emoção
            [{ text: "Era uma vez", type: "personagens", options: 3 }, { text: "que estava se sentindo", type: "emocoes", options: 3 }, { text: ".", type: "acoes", options: 0 }],
            // Template 1.2: Tempo + Personagem + Ação
            [{ text: "Hoje", type: "tempo", options: 3 }, { text: "", type: "personagens", options: 3 }, { text: "foi", type: "acoes", options: 4 }, { text: ".", type: "acoes", options: 0 }],
            // Template 1.3: Ver + Ação + Lugar
            [{ text: "Eu vi", type: "personagens", options: 4 }, { text: "", type: "acoes", options: 4 }, { text: "na", type: "lugares", options: 3 }, { text: ".", type: "acoes", options: 0 }],
        ]
    },
    {
        level: 2,
        name: "Mundo de Descobertas",
        storiesToComplete: 4,
        templates: [
            // Template 2.1: Personagem + Lugar + Ação
            [{ text: "Certo dia,", type: "personagens", options: 4 }, { text: "foi para a", type: "lugares", options: 3 }, { text: "para", type: "acoes", options: 4 }, { text: ".", type: "acoes", options: 0 }],
            // Template 2.2: O que eu gosto de fazer
            [{ text: "Na escola, eu gosto de", type: "acoes", options: 4 }, { text: "com", type: "objetos", options: 3 }, { text: "e fico", type: "emocoes", options: 3 }, { text: ".", type: "acoes", options: 0 }],
            // Template 2.3: Encontrando um objeto
            [{ text: "De repente, ", type: "personagens", options: 3 }, {text: "encontrou", type: "objetos", options: 3}, {text: "e ficou muito", type: "emocoes", options: 3}, {text: ".", type: "acoes", options: 0}]
        ]
    }
    // Adicionar mais fases aqui
];

export default function HistoriasEpicasGame() {
  // Estados do Jogo
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'storyComplete' | 'levelComplete' | 'gameOver'>('intro');
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
    "Bem vindo ao jogo 'Histórias Épicas', aqui eu vou te ajudar a construir suas próprias estórias, e com isto, ajudar a todos neste mundo mágico, a ter um final feliz.",
    "O jogo é bem simples. No alto, temos a frase que é o começo da sua estória. Você deve escolher um card abaixo para completar o sentimento ou a ação do personagem central.",
    "Ao escolher o card, vou ler a parte da história que você montou. Quando terminar de preencher, salvamos e seguimos em frente para outras histórias.",
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

  const startGame = useCallback(() => {
    setGameState('playing');
    setStoriesCompletedInLevel(0); // Reinicia o contador para o nível atual
    loadNewStory(currentLevelIndex);
  }, [currentLevelIndex]); // currentLevelIndex como dependência

  const loadNewStory = useCallback((levelIndex: number) => {
    const level = storyLevels[levelIndex];
    if (!level) {
      setGameState('gameOver');
      leoSpeak("Parabéns! Você completou todas as fases de Histórias Épicas!");
      return;
    }

    // Escolhe um template aleatório do nível atual
    const randomTemplate = [...level.templates[Math.floor(Math.random() * level.templates.length)]];
    
    setCurrentStoryTemplate(randomTemplate);
    setStoryProgress(randomTemplate.map(segment => ({ ...segment, selectedCard: undefined })));
    setCurrentSegmentIndex(0);
    
    // Gera opções apenas se o primeiro segmento tiver opções
    if (randomTemplate[0] && randomTemplate[0].options > 0) {
      generateCardOptions(randomTemplate[0]);
    } else {
      setCardOptions([]); // Garante que não há opções se o segmento não precisa de card
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
      console.warn(`Nenhum card encontrado para a categoria: ${type}`);
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
    // Filtra segmentos que realmente precisam de um card para determinar o fim da história
    const preenchableSegments = currentStoryTemplate.filter(s => s.options > 0);
    const isStoryFinished = (currentSegmentIndex + 1) >= preenchableSegments.length;

    if (isStoryFinished) {
      // Reconstrói a história para a vocalização final
      const finalStoryText = updatedProgress
        .map(s => `${s.text} ${s.selectedCard ? s.selectedCard.label : ''}`)
        .join(' ')
        .replace(/\s+/g, ' ').trim(); // Remove espaços extras
      
      leoSpeak(`Sua história ficou assim: "${finalStoryText}". Incrível!`);
      setStoriesCompletedInLevel(prev => prev + 1);
      setGameState('storyComplete');
    } else {
      setCurrentSegmentIndex(nextSegmentIndex);
      // Garante que só gera opções para segmentos que precisam de card
      if (currentStoryTemplate[nextSegmentIndex] && currentStoryTemplate[nextSegmentIndex].options > 0) {
        generateCardOptions(currentStoryTemplate[nextSegmentIndex]);
        leoSpeak(`Perfeito! Agora, ${currentStoryTemplate[nextSegmentIndex].text}...`);
      } else {
         // Se o próximo segmento não tem opções (e.g., é um ponto final), avança direto
         handleCardSelection(card); // Chama recursivamente para simular a seleção
      }
    }
  };

  const handleNextStoryOrLevel = useCallback(() => {
      const level = storyLevels[currentLevelIndex];
      if (storiesCompletedInLevel >= level.storiesToComplete) {
          // Completou o nível, tenta ir para o próximo
          const nextLevelIndex = currentLevelIndex + 1;
          if (nextLevelIndex < storyLevels.length) {
              setCurrentLevelIndex(nextLevelIndex);
              setStoriesCompletedInLevel(0); // Reseta para o novo nível
              leoSpeak(`Parabéns! Você completou a fase ${level.name}! Vamos para a próxima aventura!`);
              // Pequeno atraso para a mensagem ser ouvida antes de carregar nova história
              setTimeout(() => loadNewStory(nextLevelIndex), 3000); 
          } else {
              // Todas as fases completas
              setGameState('gameOver');
              leoSpeak("Uau! Você completou todas as histórias! Você é um escritor épico!");
          }
      } else {
          // Apenas carrega uma nova história no nível atual
          loadNewStory(currentLevelIndex);
      }
  }, [currentLevelIndex, storiesCompletedInLevel, leoSpeak, loadNewStory]);
  
  // Renderiza o background animado
  const AnimatedBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-300 via-pink-200 to-orange-200 opacity-80 animate-gradient-shift"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-blue-300 via-green-200 to-yellow-200 opacity-80 animate-gradient-shift-reverse blur-3xl"></div>
    </div>
  );

  // --- RENDERIZAÇÃO DOS COMPONENTES VISUAIS ---
  
  const renderIntro = () => (
    <div className="relative z-10 flex flex-col items-center text-center p-6 bg-white/95 rounded-3xl shadow-2xl max-w-xl mx-auto border-4 border-violet-400 animate-scale-in">
      {/* Leo Mago GRANDE e em destaque */}
      <div className="w-56 h-auto drop-shadow-xl mb-4 animate-fade-in-up">
        <img src="/images/mascotes/leo/leo_mago_resultado.webp" alt="Leo Mago" className="w-full h-full object-contain"/>
      </div>
      
      {/* Cabeçalho Bonito */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-6 font-display animate-pulse-light">
        Histórias Épicas <Sparkles className="inline-block text-yellow-400 ml-2" size={32}/>
      </h1>
      <p className="text-base md:text-lg text-gray-700 mb-8 min-h-[100px] flex items-center justify-center font-medium leading-relaxed">
        {leoMessage}
      </p>
      <button onClick={handleIntroNext} className="px-10 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out">
        {introStep < introMessages.length - 1 ? 'Continuar →' : 'Vamos Começar!'}
      </button>
    </div>
  );

  const renderGame = () => {
    const level = storyLevels[currentLevelIndex];
    return (
      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl w-full max-w-6xl mx-auto border-4 border-violet-300 animate-fade-in">
        {/* Cabeçalho do Jogo */}
        <div className="flex justify-between items-center bg-gradient-to-r from-violet-200 to-pink-200 p-3 rounded-t-xl -mx-4 -mt-4 mb-6 shadow-md">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-lg md:text-xl">
                <BookText size={24}/> Fase {level.level}: {level.name}
            </div>
            <div className="flex items-center gap-2 text-pink-700 font-bold text-lg md:text-xl">
                <Wand2 size={24}/> Histórias: {storiesCompletedInLevel} / {level.storiesToComplete}
            </div>
        </div>

        {/* Visualizador da História */}
        <div className="bg-yellow-50 p-4 rounded-xl mb-6 border-2 border-yellow-300 min-h-[100px] flex items-center justify-center text-center shadow-inner">
          <p className="text-xl md:text-2xl text-gray-800 font-semibold leading-relaxed">
            {storyProgress.map((segment, index) => (
              <span key={index} className={index === currentSegmentIndex && gameState === 'playing' ? 'font-bold text-blue-700 animate-pulse-text' : ''}>
                {segment.text}{' '}
                {segment.selectedCard ? (
                  <span className="inline-block bg-white px-2 py-1 rounded-md shadow-sm font-bold text-purple-700 text-xl md:text-2xl border border-purple-200 mx-1">
                    {segment.selectedCard.label}
                  </span>
                ) : (
                  segment.options > 0 && <span className="text-gray-400 text-xl md:text-2xl">_____</span>
                )}
                {' '}
              </span>
            ))}
          </p>
        </div>
        
        {/* Balão de Fala do Leo GRANDE */}
        <div className="flex flex-col md:flex-row items-center gap-4 my-6 justify-center bg-white/80 p-4 rounded-xl shadow-inner border border-gray-100">
           {/* Leo com rosto - agora maior e centralizado */}
           <img src="/images/mascotes/leo/leo_rosto_resultado.webp" alt="Leo" className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-orange-500 shadow-lg flex-shrink-0 animate-float"/>
           <div className="relative bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg shadow-md flex-1 text-center md:text-left min-h-[80px] flex items-center justify-center animate-fade-in">
              <p className="text-lg md:text-xl font-medium text-gray-800">{leoMessage}</p>
              {/* Ponta do balão */}
              <div className="absolute left-1/2 md:left-[130px] top-full md:top-1/2 transform -translate-x-1/2 md:-translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-100 border-b-2 border-l-2 border-orange-300 rotate-45 -mt-2 md:-ml-2"></div>
           </div>
        </div>

        {/* Área de Ação (Cards ou Botão de Próxima) */}
        {gameState === 'playing' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6 animate-fade-in-up">
            {cardOptions.map(card => (
              <button 
                key={card.id}
                onClick={() => handleCardSelection(card)}
                className="p-3 bg-white rounded-xl shadow-lg border-3 border-purple-200 hover:border-purple-500 hover:scale-105 transition-all transform focus:outline-none focus:ring-4 focus:ring-purple-300 active:scale-98 relative overflow-hidden group"
              >
                <div className="aspect-square bg-white rounded-md overflow-hidden border border-gray-100">
                  <img src={card.image} alt={card.label} className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-200"/>
                </div>
                <p className="mt-2 text-center font-bold text-sm md:text-base text-gray-800 group-hover:text-purple-700 transition-colors">{card.label}</p>
                 <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl"></div>
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

        {/* Modal de Fim de Jogo */}
        {gameState === 'gameOver' && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-yellow-400 animate-scale-in">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 mb-4">Parabéns, Escritor Épico!</h2>
                    <p className="text-lg text-gray-700 mb-6">{leoMessage}</p>
                    <button onClick={() => window.location.reload()} className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transition-transform">
                        Jogar Novamente
                    </button>
                </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden p-4">
      <AnimatedBackground />
      {gameState === 'intro' ? renderIntro() : renderGame()}

      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gradient-shift-reverse {
          0% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-light {
          0%, 100% { text-shadow: 0 0 5px rgba(255,255,255,0.7); }
          50% { text-shadow: 0 0 10px rgba(255,255,255,0.9); }
        }
        @keyframes pulse-fade {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
        }
        @keyframes pulse-text {
            0%, 100% { color: #2563eb; } /* blue-600 */
            50% { color: #1d4ed8; } /* blue-700 */
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        .animate-gradient-shift-reverse {
          background-size: 200% 200%;
          animation: gradient-shift-reverse 15s ease infinite;
        }
        .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.7s ease-out forwards;
        }
        .animate-scale-in {
            animation: scale-in 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
        .animate-pulse-light {
            animation: pulse-light 2s infinite ease-in-out;
        }
        .font-display {
            font-family: 'Comic Sans MS', cursive, sans-serif; /* Uma fonte divertida */
        }
        .animate-pulse-fade {
            animation: pulse-fade 2s infinite ease-in-out;
        }
        .animate-float {
            animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-text {
            animation: pulse-text 1.5s infinite alternate;
        }
      `}</style>
    </div>
  );
}
