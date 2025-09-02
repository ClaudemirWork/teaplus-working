'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Sparkles, ChevronRight, RotateCcw, Home, Brain, Shield, Globe, Award } from 'lucide-react';

// Interfaces
interface StoryElement {
  id: number;
  text: string;
  icon: string;
  correctOrder: number;
}
interface Story {
  id: string;
  title: string;
  category: string;
  narrator: 'Leo' | 'Mila';
  elements: StoryElement[];
  completionMessage: string;
  hint: string;
  skills: string[];
  complexity: 'emotional' | 'social' | 'cultural' | 'ethical';
}

// SUAS 20 HISTÓRIAS COMPLETAS DO NÍVEL AVANÇADO
const advancedStories: Story[] = [
    { id: 'emotional_1', title: 'Mudança de Escola', category: 'Jornadas Emocionais', narrator: 'Leo', complexity: 'emotional', elements: [ { id: 1, text: "Lucas recebeu a notícia de que mudaria de cidade", icon: "📦", correctOrder: 1 }, { id: 2, text: "Sentiu tristeza profunda ao pensar em deixar os amigos", icon: "😢", correctOrder: 2 }, { id: 3, text: "Despediu-se de cada amigo com um abraço especial", icon: "🤗", correctOrder: 3 }, { id: 4, text: "Chegou na escola nova sentindo-se muito nervoso", icon: "😰", correctOrder: 4 }, { id: 5, text: "Um colega sorriu e ofereceu ajuda com a escola", icon: "😊", correctOrder: 5 }, { id: 6, text: "Lucas fez o primeiro amigo no novo lugar", icon: "🤝", correctOrder: 6 }, { id: 7, text: "Percebeu que mudanças trazem novas oportunidades", icon: "🌟", correctOrder: 7 } ], completionMessage: "Incrível! Você compreendeu a jornada completa de adaptação!", hint: "Notícia → tristeza → despedida → chegada → nervosismo → acolhimento → aprendizado", skills: ["Resiliência Emocional", "Adaptação", "Abertura ao Novo", "Processamento de Perdas"] },
    // ... (cole suas outras 19 histórias aqui)
];

export default function AdvancedLevel() {
  const router = useRouter();
  
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [shuffledElements, setShuffledElements] = useState<StoryElement[]>([]);
  const [userSequence, setUserSequence] = useState<StoryElement[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [stars, setStars] = useState(0);

  const currentStory = advancedStories[currentStoryIndex];
  
  useEffect(() => {
    resetActivity();
  }, [currentStoryIndex]);

  const handleSelectElement = (elementToMove: StoryElement) => {
    setShuffledElements(prev => prev.filter(element => element.id !== elementToMove.id));
    setUserSequence(prev => [...prev, elementToMove]);
  };
  
  const handleDeselectElement = (elementToMove: StoryElement) => {
    setUserSequence(prev => prev.filter(element => element.id !== elementToMove.id));
    setShuffledElements(prev => [...prev, elementToMove].sort((a, b) => a.id - b.id));
  };

  const checkSequence = () => {
    if (userSequence.length !== currentStory.elements.length) return;
    const isCorrect = userSequence.every((element, index) => element.correctOrder === index + 1);
    setShowFeedback(true);
    if (isCorrect) {
      setStars(3);
      setTotalScore(prev => prev + 200);
      if (!completedStories.includes(currentStory.id)) {
        setCompletedStories(prev => [...prev, currentStory.id]);
      }
    } else {
      setStars(0);
    }
  };

  const resetActivity = () => {
    setUserSequence([]);
    setShuffledElements([...currentStory.elements].sort(() => Math.random() - 0.5));
    setShowFeedback(false);
    setStars(0);
  };
  
  const nextStory = () => {
    if (currentStoryIndex < advancedStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    }
  };

  const progressPercentage = (completedStories.length / advancedStories.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                  <button onClick={() => router.push('/sequential-narrative')} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"><Home className="w-5 h-5 mr-2" /> Menu</button>
                  <div className="text-center flex-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Nível Avançado</h1>
                      <p className="text-sm text-gray-600 mt-1">História {currentStoryIndex + 1} de {advancedStories.length}</p>
                  </div>
                  <div className="flex items-center gap-1"><Trophy className="w-5 h-5 text-yellow-500" /> <span className="font-bold text-lg">{totalScore}</span></div>
              </div>
              <div className="mt-4"><div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"><div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div></div>
          </div>
          
          {/* ESTRUTURA DE GRID CORRIGIDA */}
          <div className="grid lg:grid-cols-2 gap-6">
              {/* Coluna 1: Partes da História */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🧩 Elementos Complexos</h3>
                  <div className="space-y-3">
                      {shuffledElements.map(element => (<button key={element.id} onClick={() => handleSelectElement(element)} className="w-full text-left bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-3 shadow hover:shadow-md hover:scale-[1.03] transition-all transform"><div className="flex items-center"><span className="text-xl mx-2">{element.icon}</span><p className="text-gray-800 flex-1 text-sm">{element.text}</p></div></button>))}
                      {shuffledElements.length === 0 && (<div className="text-center py-16 text-gray-500"><p className="text-lg">Todos os elementos foram movidos!</p></div>)}
                  </div>
              </div>

              {/* Coluna 2: Monte a História */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📖 Narrativa Complexa</h3>
                  <div className="min-h-[250px] border-3 border-dashed border-purple-300 rounded-lg p-4 space-y-2 bg-purple-50/30">
                       {userSequence.map((element, index) => (<button key={element.id} onClick={() => handleDeselectElement(element)} className="w-full text-left bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 rounded-lg p-3 shadow hover:shadow-md hover:scale-[1.03] transition-all transform"><div className="flex items-center"><div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center mr-2 text-xs font-bold shadow-md">{index + 1}°</div><span className="text-xl mx-2">{element.icon}</span><p className="text-gray-800 flex-1 text-sm font-medium">{element.text}</p></div></button>))}
                       {userSequence.length === 0 && (<div className="text-center flex items-center justify-center h-full text-gray-400"><p className="text-lg">Clique nas partes para adicioná-las aqui na ordem certa.</p></div>)}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-6">
                      <button onClick={checkSequence} disabled={shuffledElements.length > 0 || showFeedback} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all transform ${shuffledElements.length === 0 && !showFeedback ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Verificar Narrativa</button>
                      <button onClick={resetActivity} className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Recomeçar</button>
                  </div>
              </div>
          </div>

          {/* Feedback */}
          {showFeedback && (
              <div className={`mt-6 rounded-xl border-2 p-6 ${stars > 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center justify-between">
                      <div><h3 className={`text-2xl font-bold ${stars > 0 ? 'text-green-600' : 'text-red-600'}`}>{stars > 0 ? '🎉 Narrativa Perfeita!' : '💪 Continue Tentando!'}</h3><p>{stars > 0 ? currentStory.completionMessage : 'Narrativas complexas exigem atenção aos detalhes emocionais!'}</p></div>
                      {stars > 0 && currentStoryIndex < advancedStories.length - 1 && (<button onClick={nextStory} className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold shadow-lg hover:bg-green-600 flex items-center gap-2">Próxima <ChevronRight/></button>)}
                      {stars > 0 && completedStories.length === advancedStories.length && (<button onClick={() => router.push('/sequential-narrative')} className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold shadow-lg hover:bg-blue-600 flex items-center gap-2">Voltar ao Menu <Home/></button>)}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
