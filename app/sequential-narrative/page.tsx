'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Sparkles, ChevronRight, RotateCcw, Home, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
}

// COLE AQUI A SUA LISTA COMPLETA DE 50 HISTÓRIAS
const beginnerStories: Story[] = [
  { id: 'routine_1', title: 'Acordando para o Dia', category: 'Rotinas Diárias', narrator: 'Leo', elements: [ { id: 1, text: "O despertador tocou bem cedinho", icon: "⏰", correctOrder: 1 }, { id: 2, text: "João abriu os olhos e espreguiçou", icon: "👁️", correctOrder: 2 }, { id: 3, text: "Levantou da cama pronto para o dia", icon: "🛏️", correctOrder: 3 } ], completionMessage: "Muito bem! Você organizou a rotina de acordar!", hint: "Pense: o que acontece primeiro quando acordamos?" },
  { id: 'routine_2', title: 'Hora do Banho', category: 'Rotinas Diárias', narrator: 'Mila', elements: [ { id: 1, text: "Maria tirou a roupa suja", icon: "👕", correctOrder: 1 }, { id: 2, text: "Ensaboou o corpo todo com cuidado", icon: "🧼", correctOrder: 2 }, { id: 3, text: "Secou-se com a toalha macia", icon: "🏖️", correctOrder: 3 } ], completionMessage: "Parabéns! A sequência do banho está perfeita!", hint: "O que fazemos antes de entrar no chuveiro?" },
  // ... E ASSIM POR DIANTE ATÉ A ÚLTIMA ...
  { id: 'emotion_7', title: 'Cachorro Amigo', category: 'Emoções', narrator: 'Mila', elements: [ { id: 1, text: "Viu o cachorro fofinho", icon: "🐕", correctOrder: 1 }, { id: 2, text: "Fez carinho na cabeça", icon: "✋", correctOrder: 2 }, { id: 3, text: "Ganhou uma lambida", icon: "💕", correctOrder: 3 } ], completionMessage: "Amizade! Que cachorro carinhoso!", hint: "Vemos o cachorro antes de fazer carinho!" }
];

function SortableItem({ element, isInSequence }: { element: StoryElement, isInSequence: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const bgColor = isInSequence 
    ? "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300" 
    : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200";

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={`rounded-lg p-3 shadow cursor-grab active:cursor-grabbing border-2 ${bgColor}`}>
      <div className="flex items-center">
        <div {...listeners} className="p-1 touch-none">
            <GripVertical className="h-6 w-6 text-gray-400" />
        </div>
        <span className="text-3xl mx-2">{element.icon}</span>
        <p className="text-gray-800 flex-1">{element.text}</p>
      </div>
    </div>
  );
}

export default function BeginnerLevel() {
  const router = useRouter();
  
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [shuffledElements, setShuffledElements] = useState<StoryElement[]>([]);
  const [userSequence, setUserSequence] = useState<StoryElement[]>([]);
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [stars, setStars] = useState(0);
  
  const currentStory = beginnerStories[currentStoryIndex];
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    resetActivity();
  }, [currentStoryIndex]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = active.data.current?.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;
    
    if (activeContainer === overContainer) {
        // Reordenando dentro da mesma lista
        if (activeContainer === 'shuffled-list') {
            setShuffledElements(items => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        } else if (activeContainer === 'sequence-list') {
            setUserSequence(items => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    } else {
        // Movendo entre listas
        let draggedItem: StoryElement;
        // Remove da lista de origem
        if (activeContainer === 'shuffled-list') {
            draggedItem = shuffledElements.find(item => item.id === active.id)!;
            setShuffledElements(items => items.filter(item => item.id !== active.id));
        } else {
            draggedItem = userSequence.find(item => item.id === active.id)!;
            setUserSequence(items => items.filter(item => item.id !== active.id));
        }
        // Adiciona à lista de destino
        if (overContainer === 'shuffled-list') {
            setShuffledElements(items => [...items, draggedItem]);
        } else {
            setUserSequence(items => [...items, draggedItem]);
        }
    }
  }

  const checkSequence = () => {
    if (userSequence.length !== currentStory.elements.length) return;
    const isCorrect = userSequence.every((element, index) => element.correctOrder === index + 1);
    setShowFeedback(true);
    if (isCorrect) {
      setStars(3);
      setTotalScore(prev => prev + 100);
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
    if (currentStoryIndex < beginnerStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    }
  };

  const progressPercentage = (completedStories.length / beginnerStories.length) * 100;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4"><button onClick={() => router.push('/sequential-narrative')} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"><Home className="w-5 h-5 mr-2" /> Menu</button><div className="text-center flex-1"><h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Nível Iniciante</h1><p className="text-sm text-gray-600 mt-1">História {currentStoryIndex + 1} de {beginnerStories.length}</p></div><div className="flex items-center gap-1"><Trophy className="w-5 h-5 text-yellow-500" /> <span className="font-bold text-lg">{totalScore}</span></div></div>
                <div className="mt-4"><div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"><div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🧩 Partes da História</h3>
                    <div className="space-y-3">
                        <SortableContext items={shuffledElements} id="shuffled-list">
                            {shuffledElements.map(element => <SortableItem key={element.id} element={element} isInSequence={false} />)}
                        </SortableContext>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📖 Monte a História na Ordem</h3>
                    <div className="min-h-[250px] border-3 border-dashed border-purple-300 rounded-lg p-4 space-y-3 bg-purple-50/30">
                        <SortableContext items={userSequence} id="sequence-list">
                           {userSequence.map(element => <SortableItem key={element.id} element={element} isInSequence={true} />)}
                        </SortableContext>
                        {userSequence.length === 0 && (<div className="text-center py-16 text-gray-400"><p className="text-lg">Arraste as partes aqui</p></div>)}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-6"><button onClick={checkSequence} disabled={shuffledElements.length > 0 || showFeedback} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all transform ${shuffledElements.length === 0 && !showFeedback ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Verificar História</button><button onClick={resetActivity} className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Tentar de Novo</button></div>
                </div>
            </div>
            {showFeedback && (<div className={`mt-6 rounded-xl border-2 p-6 ${stars > 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}><div className="flex items-center justify-between"><div><h3 className={`text-2xl font-bold ${stars > 0 ? 'text-green-600' : 'text-red-600'}`}>{stars > 0 ? '🎉 Parabéns!' : '💪 Quase lá!'}</h3><p>{stars > 0 ? currentStory.completionMessage : 'A ordem não está certa. Tente de novo!'}</p></div>{stars > 0 && currentStoryIndex < beginnerStories.length - 1 && (<button onClick={nextStory} className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold shadow-lg hover:bg-green-600 flex items-center gap-2">Próxima História <ChevronRight/></button>)}</div></div>)}
        </div>
      </div>
    </DndContext>
  );
}
