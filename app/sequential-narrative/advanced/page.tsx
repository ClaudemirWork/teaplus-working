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
    text: "Ana notou que sua amiga Sofia estava sempre sozinha durante o recreio",
    icon: "👧",
    correctOrder: 1
  },
  {
    id: 2,
    text: "Ela observou que outros colegas evitavam Sofia por causa de sua timidez",
    icon: "👀",
    correctOrder: 2
  },
  {
    id: 3,
    text: "Ana decidiu conversar com Sofia para entender como ela se sentia",
    icon: "💬",
    correctOrder: 3
  },
  {
    id: 4,
    text: "Sofia confessou que tinha medo de ser rejeitada pelos outros",
    icon: "😔",
    correctOrder: 4
  },
  {
    id: 5,
    text: "Ana criou um plano para incluir Sofia gradualmente no grupo",
    icon: "💡",
    correctOrder: 5
  },
  {
    id: 6,
    text: "Ela apresentou Sofia aos poucos para diferentes colegas da turma",
    icon: "🤝",
    correctOrder: 6
  },
  {
    id: 7,
    text: "No final do mes, Sofia tinha varios amigos e se sentia parte do grupo",
    icon: "🌟",
    correctOrder: 7
  }
];

export default function AdvancedLevel() {
  const router = useRouter();
  const [shuffledElements, setShuffledElements] = useState<StoryElement[]>([]);
  const [userSequence, setUserSequence] = useState<StoryElement[]>([]);
  const [draggedItem, setDraggedItem] = useState<StoryElement | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
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
    
    if (userSequence.length !== 7) {
      alert('Por favor, organize todos os 7 elementos da historia!');
      return;
    }

    setAttempts(prev => prev + 1);
    
    // Verificar sequencia
    const userIds = userSequence.map(element => element.id);
    console.log('IDs do usuario:', userIds);
    
    // Sequencia correta: [1, 2, 3, 4, 5, 6, 7]
    const isCorrect = userIds[0] === 1 && userIds[1] === 2 && userIds[2] === 3 && 
                     userIds[3] === 4 && userIds[4] === 5 && userIds[5] === 6 && userIds[6] === 7;
    
    console.log('Sequencia correta?', isCorrect);

    if (isCorrect) {
      setScore(100);
      setShowFeedback(true);
      // Mostrar modal de conclusao apos 2 segundos
      setTimeout(() => {
        setShowCompletionModal(true);
      }, 2000);
      console.log('Score definido para 100');
    } else {
      setScore(50);
      setShowFeedback(true);
      console.log('Score definido para 50');
    }
  };

  const resetActivity = () => {
    const shuffled = [...storyElements].sort(() => Math.random() - 0.5);
    setShuffledElements(shuffled);
    setUserSequence([]);
    setShowFeedback(false);
    setShowCompletionModal(false);
    setScore(0);
    setAttempts(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
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
            <h1 className="text-3xl font-bold text-gray-800">Narrativa Sequencial - Avancado</h1>
            <p className="text-gray-600">Organize a historia complexa sobre inclusao social</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Tentativas: {attempts}</div>
            {score > 0 && (
              <div className="text-lg font-semibold text-purple-600">Pontuacao: {score}</div>
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
            <strong>1.</strong> Leia cada parte da historia sobre inclusao social e multiplas perspectivas
          </p>
          <p className="text-gray-700 mb-2">
            <strong>2.</strong> Arraste os 7 elementos para a area de sequencia na ordem cronologica
          </p>
          <p className="text-gray-700">
            <strong>3.</strong> Considere: observacao → compreensao → acao → implementacao → resultado
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Elementos Disponiveis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🧩</span>
              Elementos da Historia
            </h3>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {shuffledElements.map((element) => (
                <div
                  key={element.id}
                  draggable
                  onDragStart={() => handleDragStart(element)}
                  className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 cursor-move hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{element.icon}</span>
                    <p className="text-gray-800 flex-1 text-sm">{element.text}</p>
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
              className="min-h-[500px] border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-2 overflow-y-auto"
            >
              {userSequence.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <span className="text-4xl mb-2 block">👆</span>
                  Arraste os 7 elementos aqui para organizar a historia
                </div>
              )}

              {userSequence.map((element, index) => (
                <div
                  key={element.id}
                  className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3 relative"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-xl mr-3">{element.icon}</span>
                    <p className="text-gray-800 flex-1 text-sm">{element.text}</p>
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
                disabled={userSequence.length !== 7}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  userSequence.length === 7
                    ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-md hover:shadow-lg'
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

              {/* Botao de Conclusao */}
              <button
                onClick={() => setShowCompletionModal(true)}
                disabled={score !== 100}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  score === 100
                    ? 'bg-gold-500 hover:bg-gold-600 text-white shadow-md hover:shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {score === 100 ? 'Atividade Concluida! 🏆' : 'Complete para finalizar'}
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
              {score === 100 ? 'Parabens! Sequencia perfeita! 🎉' : 'Tente novamente! 💪'}
            </h3>
            <p className={`${score === 100 ? 'text-green-700' : 'text-red-700'}`}>
              {score === 100 
                ? 'Voce dominou a narrativa complexa sobre inclusao social com multiplas perspectivas!' 
                : 'Pense na progressao: observacao → analise → decisao → acao → implementacao → resultado → reflexao'
              }
            </p>
            
            {score === 100 && (
              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🎯 Habilidades Masterizadas:</h4>
                <div className="text-green-700 text-sm space-y-1">
                  <p>✓ <strong>Pensamento multiperspectivo:</strong> Compreender diferentes pontos de vista</p>
                  <p>✓ <strong>Planejamento social complexo:</strong> Criar estrategias de inclusao</p>
                  <p>✓ <strong>Lideranca empática:</strong> Implementar mudancas sociais positivas</p>
                  <p>✓ <strong>Sequenciamento narrativo avancado:</strong> Organizar historias complexas</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal de Conclusao */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Parabens! Atividade Finalizada!
              </h2>
              <p className="text-gray-600 mb-6">
                Voce completou todos os niveis da <strong>Narrativa Sequencial</strong> com sucesso! 
                Suas habilidades de organizacao de historias e mentalizacao foram desenvolvidas.
              </p>
              
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-purple-800 mb-2">🎉 Conquistas Desbloqueadas:</h3>
                <div className="text-sm text-purple-700 space-y-1">
                  <p>🥉 Narrativas Simples (Beginner)</p>
                  <p>🥈 Resolucao de Conflitos (Intermediate)</p>
                  <p>🥇 Inclusao Social Complexa (Advanced)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Voltar ao Dashboard
                </button>
                
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    router.push('/sequential-narrative');
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Repetir Atividade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}