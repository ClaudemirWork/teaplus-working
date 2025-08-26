'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Volume2, Star, Heart, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MagicWordsGame() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [currentNeed, setCurrentNeed] = useState('sede');
  const [milaMessage, setMilaMessage] = useState("Olá! Eu sou a Mila! Clique no card que representa o que o personagem precisa!");
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const [level, setLevel] = useState(1);

  // NPCs e suas necessidades
  const scenarios = [
    {
      npc: { name: "João", avatar: "👦" },
      message: "Estou com sede!",
      correctCard: "estou_com_sede",
      category: "necessidades"
    },
    {
      npc: { name: "Maria", avatar: "👧" },
      message: "Quero comer!",
      correctCard: "comer",
      category: "necessidades"
    },
    {
      npc: { name: "Ana", avatar: "👩" },
      message: "Preciso ir ao banheiro!",
      correctCard: "ir_ao_banheiro",
      category: "necessidades"
    },
    {
      npc: { name: "Pedro", avatar: "🧑" },
      message: "Estou feliz!",
      correctCard: "homem_feliz",
      category: "emocoes"
    },
    {
      npc: { name: "Carla", avatar: "👱‍♀️" },
      message: "Estou triste!",
      correctCard: "mulher_triste",
      category: "emocoes"
    }
  ];

  const [currentScenario, setCurrentScenario] = useState(0);
  const scenario = scenarios[currentScenario];

  // Cards disponíveis para escolher (simplificado)
  const availableCards = [
    // Necessidades
    { id: "estou_com_sede", text: "Sede", image: "/images/cards/necessidades/estou_com_sede.webp", category: "necessidades" },
    { id: "comer", text: "Comer", image: "/images/cards/necessidades/comer.webp", category: "necessidades" },
    { id: "ir_ao_banheiro", text: "Banheiro", image: "/images/cards/necessidades/ir_ao_banheiro.webp", category: "necessidades" },
    { id: "descansar", text: "Descansar", image: "/images/cards/necessidades/descansar.webp", category: "necessidades" },
    
    // Emoções
    { id: "homem_feliz", text: "Feliz", image: "/images/cards/emocoes/homem_feliz.webp", category: "emocoes" },
    { id: "mulher_triste", text: "Triste", image: "/images/cards/emocoes/mulher_triste.webp", category: "emocoes" },
    { id: "homem_medo", text: "Medo", image: "/images/cards/emocoes/homem_medo.webp", category: "emocoes" },
    { id: "mulher_animada", text: "Animada", image: "/images/cards/emocoes/mulher_animada.webp", category: "emocoes" },
    
    // Core
    { id: "sim", text: "Sim", image: "/images/cards/core/sim.webp", category: "core" },
    { id: "nao", text: "Não", image: "/images/cards/core/não.webp", category: "core" },
    { id: "obrigado", text: "Obrigado", image: "/images/cards/core/obrigado.webp", category: "core" },
    { id: "por_favor", text: "Por Favor", image: "/images/cards/core/por favor.webp", category: "core" }
  ];

  // Filtrar cards pela categoria do cenário atual
  const currentCards = availableCards.filter(card => 
    card.category === scenario.category || card.category === "core"
  );

  // Função de fala
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Mila fala
  const milaSpeak = useCallback((message: string) => {
    setMilaMessage(message);
    speak(message);
  }, [speak]);

  // Selecionar card
  const selectCard = useCallback((cardId: string, cardText: string) => {
    speak(cardText);
    
    if (cardId === scenario.correctCard) {
      // Resposta correta!
      setShowCorrectFeedback(true);
      setScore(prev => prev + 100);
      milaSpeak(`Muito bem! ${scenario.npc.name} agradece sua ajuda!`);
      
      setTimeout(() => {
        setShowCorrectFeedback(false);
        // Próximo cenário
        if (currentScenario < scenarios.length - 1) {
          setCurrentScenario(prev => prev + 1);
          milaSpeak("Vamos ajudar outra pessoa!");
        } else {
          // Completou todos!
          milaSpeak("Parabéns! Você ajudou todo mundo! Você é incrível!");
          setTimeout(() => {
            setCurrentScenario(0);
            setLevel(prev => prev + 1);
          }, 3000);
        }
      }, 2000);
    } else {
      // Resposta errada
      setShowWrongFeedback(true);
      setHearts(prev => Math.max(0, prev - 1));
      milaSpeak("Ops! Não é isso. Tente novamente!");
      
      setTimeout(() => {
        setShowWrongFeedback(false);
        if (hearts <= 1) {
          milaSpeak("Não desista! Vou te dar uma dica: olhe bem o que a pessoa está pedindo!");
          setHearts(3);
        }
      }, 1500);
    }
  }, [scenario, currentScenario, hearts, milaSpeak]);

  // Inicializar
  useEffect(() => {
    milaSpeak("Olá! Vamos ajudar as pessoas? Clique no card que mostra o que cada pessoa precisa!");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-300 via-pink-200 to-yellow-100">
      {/* Header fixo no topo */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto p-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-purple-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            <h1 className="text-xl md:text-2xl font-bold text-purple-600">
              🏰 Palavras Mágicas
            </h1>
            
            <div className="flex gap-2">
              <div className="bg-yellow-400 text-white px-3 py-1 rounded-full text-sm md:text-base">
                <Star className="inline w-4 h-4" /> {score}
              </div>
              <div className="bg-red-400 text-white px-3 py-1 rounded-full text-sm md:text-base">
                <Heart className="inline w-4 h-4" /> {hearts}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Área principal */}
      <div className="max-w-7xl mx-auto p-4 pb-40 md:pb-4">
        {/* NPC e pedido */}
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-4 shadow-xl">
          <div className="flex items-center justify-center gap-4">
            <div className="text-5xl md:text-7xl animate-bounce">{scenario.npc.avatar}</div>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 flex-1 max-w-md">
              <p className="font-bold text-purple-700 text-sm md:text-base">{scenario.npc.name} diz:</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 mt-1">{scenario.message}</p>
            </div>
          </div>
        </div>

        {/* Instrução clara */}
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-3 mb-4 text-center">
          <p className="text-base md:text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Escolha o card que mostra o que {scenario.npc.name} precisa:
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="bg-white rounded-2xl p-4 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {currentCards.map((card) => (
              <button
                key={card.id}
                onClick={() => selectCard(card.id, card.text)}
                onMouseEnter={() => speak(card.text)}
                className={`
                  relative bg-white rounded-xl border-3 p-3 md:p-4
                  transform transition-all duration-300 hover:scale-105 active:scale-95
                  ${showCorrectFeedback && card.id === scenario.correctCard ? 'border-green-500 bg-green-50 animate-pulse' : 'border-purple-300 hover:border-purple-500'}
                  ${showWrongFeedback && card.id !== scenario.correctCard ? 'opacity-50' : ''}
                `}
              >
                <div className="aspect-square w-full mb-2 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img 
                    src={card.image}
                    alt={card.text}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<span class="text-3xl md:text-5xl">${card.text.charAt(0)}</span>`;
                    }}
                  />
                </div>
                <p className="text-sm md:text-base font-bold text-center">{card.text}</p>
                
                {/* Ícone de som */}
                <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity">
                  <Volume2 className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mila - Desktop: canto direito, Mobile: bottom fixo */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-4 md:right-4 md:left-auto md:w-auto z-40">
        <div className="bg-white/95 backdrop-blur-sm md:bg-transparent p-3 md:p-0 border-t-2 border-purple-300 md:border-0">
          <div className="flex items-center gap-3 md:block">
            {/* Imagem da Mila */}
            <div className="w-20 h-20 md:w-64 md:h-64 flex-shrink-0">
              <img 
                src="/images/mascotes/mila/mila_feiticeira_resultado.webp"
                alt="Mila"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/images/mascotes/mila/mila_apoio_resultado.webp';
                }}
              />
            </div>
            
            {/* Balão de fala */}
            <div className="flex-1 md:absolute md:bottom-full md:mb-2 md:right-0 bg-white rounded-xl p-3 md:p-4 shadow-lg border-2 border-purple-400 md:min-w-[280px] md:max-w-[350px]">
              <p className="text-sm md:text-base font-semibold text-gray-800">{milaMessage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback de acerto */}
      {showCorrectFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full text-xl md:text-2xl font-bold animate-bounce">
            ✨ Muito Bem! +100 pontos! ✨
          </div>
        </div>
      )}
    </div>
  );
}
