'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface StoryElement {
  id: number;
  text: string;
  icon: string;
  correctOrder: number;
}

const storyElements: StoryElement[] = [
  {
    id: 1,
    text: "Pedro estava brincando sozinho no patio quando viu dois colegas discutindo",
    icon: "👦",
    correctOrder: 1
  },
  {
    id: 2,
    text: "Ele se aproximou e percebeu que era uma briga por causa de um jogo",
    icon: "👀",
    correctOrder: 2
  },
  {
    id: 3,
    text: "Pedro sugeriu que todos jogassem juntos seguindo regras claras",
    icon: "🤝",
    correctOrder: 3
  },
  {
    id: 4,
    text: "Os tres meninos concordaram e comecaram um novo jogo em equipe",
    icon: "⚽",
    correctOrder: 4
  },
  {
    id: 5,
    text: "No final, Pedro se sentiu orgulhoso por ter ajudado a resolver o conflito",
    icon: "😌",
    correctOrder: 5
  }
];

export default function IntermediateLevel() {
  const router = useRouter();
  const [shuffledElements, setShuffledElements] = useState<StoryElement[]>([]);
  const [userSequence, setUserSequence] = useState<StoryElement[]>([]);
  const [draggedItem, setDraggedItem] = useState<StoryElement | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Embaralhar elementos na inicializacao
    const shuffled = [...storyElements].sort(() => Math.random() - 0.5);
    setShuffledElements(shuffled);
  }, []);

  const handleDragStart = (element: StoryElement) => {
    setDraggedItem(element);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      const newSequence = [...userSequence, draggedItem];
      setUserSequence(newSequence);
      
      // Remove item da lista de elementos disponiveis
      setShuffledElements(prev => prev.filter(item => item.id !== draggedItem.id));
      setDraggedItem(null);
    }
  };

  const removeFromSequence = (elementToRemove: StoryElement) => {
    setUserSequence(prev => prev.filter(item => item.id !== elementToRemove.id));
    setShuffledElements(prev => [...prev, elementToRemove]);
  };

  const checkSequence = () => {
    console.log('Funcao checkSequence chamada!');
    
    if (userSequence.length !== 5) {
      alert('Por favor, organize todos os 5 elementos da historia!');
      return;
    }

    setAttempts(prev => prev + 1);
    
    // Verificar sequencia
    const userIds = userSequence.map(element => element.id);
    console.log('IDs do usuario:', userIds);
    
    // Sequencia correta: [1, 2, 3, 4, 5]
    const isCorrect = userIds[0] === 1 && userIds[1] === 2 && userIds[2] === 3 && userIds[3] === 4 && userIds[4] === 5;
    
    console.log('Sequencia correta?', isCorrect);

    if (isCorrect) {
      setScore(100);
      console.log('Score definido para 100');
    } else {
      setScore(50);
      console.log('Score definido para 50');
    }
    
    setShowFeedback(true);
    console.log('Feedback ativado!');
  };

  const resetActivity = () => {
    const shuffled = [...storyElements].sort(() => Math.random() - 0.5);
    setShuffledElements(shuffled);
    setUserSequence([]);
    setShowFeedback(false);
    setScore(0);
    setAttempts(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/sequential-narrative')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Voltar aos Niveis
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Narrativa Sequencial - Intermediario</h1>
            <p className="text-gray-600">Organize a historia sobre resolucao de conflitos</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Tentativas: {attempts}</div>
            {score > 0 && (
              <div className="text-lg font-semibold text-orange-600">Pontuacao: {score}</div>
            )}
          </div>
        </div>

        {/* Instrucoes */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">📝</span>
            Instrucoes
          </h2>
          <p className="text-gray-700 mb-2">
            <strong>1.</strong> Leia atentamente cada parte da historia sobre resolucao de conflitos
          </p>
          <p className="text-gray-700 mb-2">
            <strong>2.</strong> Arraste os 5 elementos para a area de sequencia na ordem correta
          </p>
          <p className="text-gray-700">
            <strong>3.</strong> Pense: Como o conflito comecou? O que aconteceu no meio? Como foi resolvido?
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Elementos Disponiveis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🧩</span>
              Elementos da Historia
            </h3>
            
            <div className="space-y-3">
              {shuffledElements.map((element) => (
                <div
                  key={element.id}
                  draggable
                  onDragStart={() => handleDragStart(element)}
                  className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 cursor-move hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{element.icon}</span>
                    <p className="text-gray-800 flex-1">{element.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {shuffledElements.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">✅</span>
                Todos os elementos foram organizados!
              </div>
            )}
          </div>

          {/* Area de Sequencia */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📖</span>
              Sua Sequencia da Historia
            </h3>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3"
            >
              {userSequence.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <span className="text-4xl mb-2 block">👆</span>
                  Arraste os 5 elementos aqui para organizar a historia
                </div>
              )}

              {userSequence.map((element, index) => (
                <div
                  key={element.id}
                  className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 relative"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-2xl mr-3">{element.icon}</span>
                    <p className="text-gray-800 flex-1">{element.text}</p>
                    <button
                      onClick={() => removeFromSequence(element)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Botoes de Acao */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  console.log('Botao clicado!');
                  checkSequence();
                }}
                disabled={userSequence.length !== 5}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  userSequence.length === 5
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Verificar Sequencia
              </button>
              
              <button
                onClick={resetActivity}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Recomecar
              </button>

              {/* Botao Proximo Nivel */}
              <button
                onClick={() => router.push('/sequential-narrative/advanced')}
                disabled={score !== 100}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  score === 100
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {score === 100 ? 'Proximo Nivel →' : 'Complete para avancar'}
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Simples */}
        {showFeedback && (
          <div className={`mt-8 rounded-xl border-2 p-6 ${
            score === 100 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`text-xl font-bold mb-3 ${
              score === 100 ? 'text-green-600' : 'text-red-600'
            }`}>
              {score === 100 ? 'Parabens! Sequencia correta! 🎉' : 'Tente novamente! 💪'}
            </h3>
            <p className={`${score === 100 ? 'text-green-700' : 'text-red-700'}`}>
              {score === 100 
                ? 'Voce organizou perfeitamente a historia sobre resolucao de conflitos!' 
                : 'Pense na progressao: problema inicial → observacao → acao → resolucao → reflexao'
              }
            </p>
            
            {score === 100 && (
              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">💡 Habilidades Desenvolvidas:</h4>
                <div className="text-green-700 text-sm">
                  <p>✓ <strong>Resolucao de conflitos:</strong> Identificar problemas e propor solucoes</p>
                  <p>✓ <strong>Empatia social:</strong> Compreender diferentes perspectivas</p>
                  <p>✓ <strong>Lideranca colaborativa:</strong> Mediar situacoes complexas</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}