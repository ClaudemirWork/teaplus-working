'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Volume2, Star, Heart, HelpCircle, Sparkles, Trophy, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Card {
  id: string;
  text: string;
  image: string;
  category: string;
  unlocked: boolean;
  timesUsed: number;
}

interface NPC {
  name: string;
  avatar: string;
  need: string;
  needImage: string;
  responses: string[];
  satisfied: boolean;
}

interface Level {
  id: number;
  name: string;
  description: string;
  npcs: NPC[];
  completed: boolean;
  stars: number;
}

export default function MagicWordsGame() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [currentNPC, setCurrentNPC] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [milaMessage, setMilaMessage] = useState("Olá! Eu sou a Mila! O Reino das Palavras precisa de você!");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [unlockedCards, setUnlockedCards] = useState<Set<string>>(new Set());
  const [totalStars, setTotalStars] = useState(0);

  // Cards disponíveis (amostra dos 121)
  const allCards: Card[] = [
    // Necessidades básicas
    { id: 'casa', text: 'Casa', image: '/images/cards/descritivos/casa.webp', category: 'lugares', unlocked: true, timesUsed: 0 },
    { id: 'escola', text: 'Escola', image: '/images/cards/descritivos/escola.webp', category: 'lugares', unlocked: true, timesUsed: 0 },
    { id: 'hospital', text: 'Hospital', image: '/images/cards/descritivos/Hospital.webp', category: 'lugares', unlocked: false, timesUsed: 0 },
    
    // Cores
    { id: 'cor_azul', text: 'Azul', image: '/images/cards/descritivos/cor_azul.webp', category: 'cores', unlocked: true, timesUsed: 0 },
    { id: 'cor_verde', text: 'Verde', image: '/images/cards/descritivos/cor_verde.webp', category: 'cores', unlocked: true, timesUsed: 0 },
    { id: 'cor_amarelo', text: 'Amarelo', image: '/images/cards/descritivos/cor_amarelo.webp', category: 'cores', unlocked: false, timesUsed: 0 },
    { id: 'cor_rosa', text: 'Rosa', image: '/images/cards/descritivos/cor_rosa.webp', category: 'cores', unlocked: false, timesUsed: 0 },
    
    // Números
    { id: 'um', text: 'Um', image: '/images/cards/descritivos/um.webp', category: 'numeros', unlocked: true, timesUsed: 0 },
    { id: 'dois', text: 'Dois', image: '/images/cards/descritivos/dois.webp', category: 'numeros', unlocked: true, timesUsed: 0 },
    { id: 'tres', text: 'Três', image: '/images/cards/descritivos/três.webp', category: 'numeros', unlocked: false, timesUsed: 0 },
    
    // Objetos
    { id: 'loja', text: 'Loja', image: '/images/cards/descritivos/loja.webp', category: 'lugares', unlocked: false, timesUsed: 0 },
    { id: 'presente', text: 'Presente', image: '/images/cards/descritivos/presente.webp', category: 'objetos', unlocked: false, timesUsed: 0 },
    { id: 'chuveiro', text: 'Chuveiro', image: '/images/cards/descritivos/chuveiro.webp', category: 'objetos', unlocked: true, timesUsed: 0 },
    
    // Ações/Sentimentos
    { id: 'sonhando', text: 'Sonhando', image: '/images/cards/descritivos/sonhando.webp', category: 'sentimentos', unlocked: false, timesUsed: 0 },
    { id: 'silencio', text: 'Silêncio', image: '/images/cards/descritivos/silencio.webp', category: 'acoes', unlocked: true, timesUsed: 0 },
    { id: 'pensando', text: 'Pensando', image: '/images/cards/descritivos/pensando corretamente.webp', category: 'sentimentos', unlocked: false, timesUsed: 0 },
  ];

  // Níveis do jogo
  const levels: Level[] = [
    {
      id: 1,
      name: "Vila das Palavras",
      description: "Ajude os moradores a se comunicarem!",
      npcs: [
        {
          name: "João",
          avatar: "👦",
          need: "Preciso ir para casa",
          needImage: '/images/cards/descritivos/casa.webp',
          responses: ['casa'],
          satisfied: false
        },
        {
          name: "Maria",
          avatar: "👧",
          need: "Quero ir à escola",
          needImage: '/images/cards/descritivos/escola.webp',
          responses: ['escola'],
          satisfied: false
        },
        {
          name: "Pedro",
          avatar: "🧑",
          need: "Preciso de silêncio",
          needImage: '/images/cards/descritivos/silencio.webp',
          responses: ['silencio'],
          satisfied: false
        }
      ],
      completed: false,
      stars: 0
    },
    {
      id: 2,
      name: "Floresta Colorida",
      description: "Descubra as cores mágicas!",
      npcs: [
        {
          name: "Fada Azul",
          avatar: "🧚",
          need: "Procuro algo azul",
          needImage: '/images/cards/descritivos/cor_azul.webp',
          responses: ['cor_azul'],
          satisfied: false
        },
        {
          name: "Duende Verde",
          avatar: "🧝",
          need: "Quero a cor verde",
          needImage: '/images/cards/descritivos/cor_verde.webp',
          responses: ['cor_verde'],
          satisfied: false
        }
      ],
      completed: false,
      stars: 0
    }
  ];

  const [gameState, setGameState] = useState({
    levels: levels,
    currentCards: allCards
  });

  // Função de fala
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Mila fala
  const milaSpeak = useCallback((message: string) => {
    setMilaMessage(message);
    speak(message);
  }, [speak]);

  // Iniciar jogo
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setCurrentLevel(0);
    setCurrentNPC(0);
    milaSpeak("Vamos ajudar os habitantes do Reino das Palavras! Clique nos cards para responder!");
  }, [milaSpeak]);

  // Selecionar card
  const selectCard = useCallback((card: Card) => {
    // Fala o nome do card
    speak(card.text);
    
    // Adiciona à seleção
    setSelectedCards([card]);
    
    // Verifica se é a resposta correta
    const level = gameState.levels[currentLevel];
    const npc = level.npcs[currentNPC];
    
    if (npc.responses.includes(card.id)) {
      // Resposta correta!
      handleCorrectAnswer();
    } else {
      // Resposta errada
      handleWrongAnswer();
    }
  }, [currentLevel, currentNPC, gameState.levels, speak]);

  // Resposta correta
  const handleCorrectAnswer = useCallback(() => {
    setScore(prev => prev + 100);
    setStars(prev => prev + 1);
    
    // Desbloqueia novos cards
    const randomLocked = gameState.currentCards.find(c => !c.unlocked);
    if (randomLocked) {
      setUnlockedCards(prev => new Set(prev).add(randomLocked.id));
      milaSpeak(`Parabéns! Você desbloqueou o card ${randomLocked.text}!`);
    } else {
      milaSpeak("Muito bem! Você acertou!");
    }
    
    // Marca NPC como satisfeito
    const updatedLevels = [...gameState.levels];
    updatedLevels[currentLevel].npcs[currentNPC].satisfied = true;
    setGameState(prev => ({ ...prev, levels: updatedLevels }));
    
    // Próximo NPC ou nível
    setTimeout(() => {
      if (currentNPC < gameState.levels[currentLevel].npcs.length - 1) {
        setCurrentNPC(prev => prev + 1);
        setSelectedCards([]);
      } else {
        // Completou o nível
        completeLevel();
      }
    }, 2000);
  }, [currentLevel, currentNPC, gameState, milaSpeak]);

  // Resposta errada
  const handleWrongAnswer = useCallback(() => {
    setHearts(prev => Math.max(0, prev - 1));
    milaSpeak("Ops! Não foi dessa vez. Tente outro card!");
    setSelectedCards([]);
    
    if (hearts <= 1) {
      milaSpeak("Não desista! Vamos tentar novamente!");
      setHearts(3);
    }
  }, [hearts, milaSpeak]);

  // Completar nível
  const completeLevel = useCallback(() => {
    setShowReward(true);
    const starsEarned = hearts; // Estrelas baseadas nos corações restantes
    setTotalStars(prev => prev + starsEarned);
    
    milaSpeak(`Incrível! Você completou o nível e ganhou ${starsEarned} estrelas!`);
    
    const updatedLevels = [...gameState.levels];
    updatedLevels[currentLevel].completed = true;
    updatedLevels[currentLevel].stars = starsEarned;
    setGameState(prev => ({ ...prev, levels: updatedLevels }));
    
    setTimeout(() => {
      setShowReward(false);
      if (currentLevel < gameState.levels.length - 1) {
        setCurrentLevel(prev => prev + 1);
        setCurrentNPC(0);
        setHearts(3);
        setSelectedCards([]);
      } else {
        // Fim do jogo
        milaSpeak("Parabéns! Você salvou o Reino das Palavras!");
        setIsPlaying(false);
      }
    }, 3000);
  }, [currentLevel, hearts, gameState.levels, milaSpeak]);

  // Hover no card - fala o nome
  const handleCardHover = useCallback((card: Card) => {
    speak(card.text);
  }, [speak]);

  // Cards disponíveis para o nível atual
  const availableCards = gameState.currentCards.filter(card => {
    return card.unlocked || unlockedCards.has(card.id);
  });

  const level = gameState.levels[currentLevel];
  const npc = level?.npcs[currentNPC];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-300 via-pink-200 to-yellow-100 relative overflow-hidden">
      {/* Nuvens animadas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full opacity-70 animate-pulse" />
        <div className="absolute top-40 right-20 w-40 h-24 bg-white rounded-full opacity-60 animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-20 left-1/4 w-36 h-22 bg-white rounded-full opacity-65 animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-3xl p-4 mb-6 shadow-xl border-4 border-purple-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-purple-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
                🏰 Palavras Mágicas 🏰
              </h1>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span className="font-bold">{totalStars}</span>
              </div>
              <div className="bg-gradient-to-br from-red-400 to-pink-400 text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span className="font-bold">{hearts}</span>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white px-4 py-2 rounded-2xl shadow-lg">
                <span className="font-bold">Nível {currentLevel + 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Área principal do jogo */}
        {!isPlaying ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-purple-200">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4 text-purple-600">🌟 Reino das Palavras 🌟</h2>
              <p className="text-xl text-gray-700 mb-6">
                O reino perdeu sua voz mágica! Ajude os habitantes a se comunicarem usando os Cristais de Comunicação!
              </p>
              
              {/* Níveis disponíveis */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {gameState.levels.map((lvl, idx) => (
                  <div 
                    key={lvl.id}
                    className={`p-4 rounded-2xl border-2 ${
                      lvl.completed 
                        ? 'bg-green-100 border-green-400' 
                        : idx === 0 
                          ? 'bg-purple-100 border-purple-400' 
                          : 'bg-gray-100 border-gray-300 opacity-50'
                    }`}
                  >
                    <h3 className="font-bold text-lg">{lvl.name}</h3>
                    <p className="text-sm text-gray-600">{lvl.description}</p>
                    {lvl.completed && (
                      <div className="flex justify-center mt-2">
                        {[...Array(lvl.stars)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-2xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                <Sparkles className="inline w-6 h-6 mr-2" />
                Começar Aventura
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Área do NPC */}
            {npc && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-xl border-4 border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{npc.avatar}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-purple-600">{npc.name}</h3>
                      <p className="text-lg text-gray-700">{npc.need}</p>
                    </div>
                  </div>
                  <div className="w-32 h-32 rounded-2xl border-4 border-purple-300 overflow-hidden bg-white p-2">
                    <img 
                      src={npc.needImage} 
                      alt="Necessidade"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Grade de Cards */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-purple-200">
              <h3 className="text-xl font-bold text-center mb-4 text-purple-600">
                Escolha o Cristal de Comunicação:
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                {availableCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => selectCard(card)}
                    onMouseEnter={() => handleCardHover(card)}
                    className={`relative group transform transition-all duration-300 hover:scale-110 ${
                      card.unlocked || unlockedCards.has(card.id) ? '' : 'opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!card.unlocked && !unlockedCards.has(card.id)}
                  >
                    <div className="bg-white rounded-xl border-2 border-purple-300 p-2 shadow-lg group-hover:shadow-xl">
                      {card.unlocked || unlockedCards.has(card.id) ? (
                        <>
                          <img 
                            src={card.image}
                            alt={card.text}
                            className="w-full h-20 object-contain mb-1"
                          />
                          <p className="text-xs font-semibold text-center">{card.text}</p>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24">
                          <Lock className="w-8 h-8 text-gray-400" />
                          <p className="text-xs text-gray-400 mt-1">Bloqueado</p>
                        </div>
                      )}
                    </div>
                    {(card.unlocked || unlockedCards.has(card.id)) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(card.text);
                        }}
                        className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mila Mascote */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-3xl opacity-50" />
          
          <div className="relative w-48 h-48">
            <img 
              src="/images/mascotes/mia/mila_feliz.webp"
              alt="Mila Mascote"
              className="w-full h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                const img = e.currentTarget;
                img.src = '/images/mascotes/mia/Mila_feliz.webp';
              }}
            />
          </div>
          
          <div className="absolute bottom-full mb-4 right-0 bg-white p-4 rounded-2xl shadow-xl min-w-[250px] max-w-[350px] border-3 border-purple-400">
            <div className="absolute bottom-[-10px] right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white" />
            <p className="text-gray-800 font-semibold">
              {milaMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Recompensa */}
      {showReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full transform animate-bounce border-4 border-yellow-400">
            <h2 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              🎉 Nível Completo! 🎉
            </h2>
            <div className="text-6xl text-center mb-4">
              {[...Array(hearts)].map((_, i) => (
                <Star key={i} className="inline w-12 h-12 text-yellow-400 fill-yellow-400 animate-pulse" />
              ))}
            </div>
            <p className="text-xl text-center text-gray-700">
              Você ganhou {hearts} estrelas!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
