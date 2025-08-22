'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameHeader } from '@/components/GameHeader';
import { ListChecks, Trophy, Gamepad2, CheckCircle, XCircle, Plus, Trash2, Edit3, Save, Clock, Flag } from 'lucide-react';

// Interfaces
interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: number;
  category?: string;
  notes?: string;
}

interface Checklist {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  category: 'daily' | 'project' | 'travel' | 'health' | 'work' | 'custom';
  created: Date;
  completed: boolean;
  completionRate: number;
}

export default function ChecklistCreatorPage() {
  const router = useRouter();
  const [showActivity, setShowActivity] = useState(false);
  const [currentMode, setCurrentMode] = useState<'templates' | 'create' | 'manage'>('templates');
  const [score, setScore] = useState(0);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [currentChecklist, setCurrentChecklist] = useState<Checklist | null>(null);
  const [newItem, setNewItem] = useState<Partial<ChecklistItem>>({});
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Seus dados de templates e categorias foram mantidos
  const templates = [
    {
      title: "Rotina Matinal Produtiva",
      description: "Começar o dia com energia e foco",
      category: "daily" as const,
      items: [
        { text: "Acordar no horário planejado", priority: "high" as const, estimatedTime: 1 },
        { text: "Beber um copo de água", priority: "high" as const, estimatedTime: 2 },
        { text: "Fazer 5 min de alongamento", priority: "medium" as const, estimatedTime: 5 },
        { text: "Tomar banho", priority: "high" as const, estimatedTime: 15 },
        { text: "Vestir roupa do dia", priority: "high" as const, estimatedTime: 5 },
        { text: "Tomar café da manhã", priority: "high" as const, estimatedTime: 15 },
        { text: "Revisar agenda do dia", priority: "medium" as const, estimatedTime: 5 },
        { text: "Preparar materiais de trabalho", priority: "medium" as const, estimatedTime: 10 }
      ]
    },
    // ... (restante dos seus templates)
  ];
  const categories = [ /* ... seus dados de categorias ... */ ];

  // Todas as suas funções de lógica (createFromTemplate, addItem, getStats, etc.)
  // foram 100% PRESERVADAS. Eu as omiti aqui para a resposta não ficar gigantesca,
  // mas elas devem ser mantidas no seu arquivo exatamente como estavam.
  const createFromTemplate = (templateIndex: number) => { /* ... sua lógica ... */ };
  const createEmptyChecklist = () => { /* ... sua lógica ... */ };
  const addItem = () => { /* ... sua lógica ... */ };
  const removeItem = (itemId: string) => { /* ... sua lógica ... */ };
  const toggleItem = (itemId: string) => { /* ... sua lógica ... */ };
  const saveChecklist = () => { /* ... sua lógica ... */ };
  const duplicateChecklist = (checklist: Checklist) => { /* ... sua lógica ... */ };
  const getStats = () => { /* ... sua lógica ... */ };
  const analyzeTaskBreakdown = (text: string) => { /* ... sua lógica ... */ };
  const resetActivity = () => {
    setScore(0);
    setChecklists([]);
    setCurrentChecklist(null);
    setNewItem({});
    setEditingItem(null);
    setCurrentMode('templates');
    setShowActivity(false); // Retorna para a tela de introdução
  };
  const stats = getStats();

  if (!showActivity) {
    // TELA INICIAL PADRONIZADA
    return (
      <>
        <GameHeader
          title="Criador de Listas"
          icon={<ListChecks className="h-6 w-6" />}
        />
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:</h3>
                  <p className="text-sm text-gray-600">Aprender a quebrar tarefas complexas em passos simples e acionáveis, desenvolvendo habilidades de organização para reduzir a sobrecarga mental.</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Usar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Use templates prontos para rotinas comuns.</li>
                    <li>Crie suas próprias listas personalizadas.</li>
                    <li>Adicione, complete e gerencie suas tarefas.</li>
                    <li>Receba feedback para criar tarefas mais eficazes.</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Pontuação:</h3>
                  <p className="text-sm text-gray-600">Ganhe pontos ao usar templates, criar listas, adicionar itens e, o mais importante, completar suas tarefas. Transforme a organização em um hábito!</p>
                </div>
              </div>
            </div>
            <div className="text-center pt-4">
              <button
                onClick={() => setShowActivity(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg"
              >
                🚀 Começar Atividade
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // A FERRAMENTA DE CHECKLIST EM SI (Layout principal preservado)
  return (
    <>
      <GameHeader
        title="Criador de Listas"
        icon={<ListChecks className="h-6 w-6" />}
        // Botão de salvar poderia ser ativado em certos modos, se desejado
        showSaveButton={false} 
      />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <main className="max-w-6xl mx-auto">
            {/* O botão de voltar para o menu inicial foi mantido aqui */}
            <div className="flex items-center justify-end mb-4">
                 <button
                    onClick={resetActivity}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-sm text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <RotateCcw className="w-4 h-4" />
                    Voltar e Reiniciar
                </button>
            </div>
          
            {/* O restante da sua lógica e JSX da ferramenta de checklist foi 100% preservado */}
            {/* Status */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
                {/* ... seu JSX de stats ... */}
            </div>

            {/* Navegação e Conteúdo Principal */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                {/* ... seu JSX de navegação (templates, criar, gerenciar) ... */}
                {/* ... seu JSX para cada modo ... */}
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mt-6">
                {/* ... seu JSX de progresso ... */}
            </div>
        </main>
      </div>
    </>
  );
}
