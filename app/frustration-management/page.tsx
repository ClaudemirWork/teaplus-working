'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE PADRÃO DO CABEÇALHO (GameHeader)
// ============================================================================
const GameHeader = ({ title, icon }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center text-teal-600 hover:text-teal-700 transition-colors">
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </Link>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h1>
        <div className="w-24"></div>
      </div>
    </div>
  </header>
);

// ============================================================================
// 2. PÁGINA DA ATIVIDADE "GESTÃO DAS FRUSTRAÇÕES"
// ============================================================================
export default function FrustrationManagementPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [points, setPoints] = useState(0); // PONTUAÇÃO ADICIONADA
  const [nivelSelecionado, setNivelSelecionado] = useState(1);
  const router = useRouter();
  
  // A lógica interna de cada exercício foi mantida
  const exercises = [
    { id: 1, title: "Respiração 4-7-8", type: "breathing", description: "Técnica para acalmar o sistema nervoso.", instruction: "Siga o ritmo para ativar a resposta de relaxamento." },
    { id: 2, title: "Identificando Pensamentos Distorcidos", type: "reframing", description: "Reconhecer padrões que intensificam a frustração.", instruction: "Examine os exemplos de como nossos pensamentos podem nos enganar quando estamos frustrados." },
    { id: 3, title: "Reescrevendo a Narrativa", type: "reflection", description: "Transformar pensamentos negativos em perspectivas equilibradas.", instruction: "Responda às perguntas para praticar uma visão mais realista e gentil sobre os problemas." },
    { id: 4, title: "Técnica STOP", type: "action-plan", description: "Estratégia prática para o momento da frustração.", instruction: "Memorize os 4 passos para usar quando sentir a raiva ou frustração crescendo." },
  ];

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentExercise(0);
    setPoints(0);
    setCompletedExercises([]);
  };

  const completeCurrentExercise = () => {
    if (!completedExercises.includes(exercises[currentExercise].id)) {
      setCompletedExercises(prev => [...prev, exercises[currentExercise].id]);
      setPoints(p => p + 10); // Adiciona pontos
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  // ============================================================================
  // RENDERIZAÇÃO DA ATIVIDADE EM SI (APÓS CLICAR EM INICIAR)
  // ============================================================================
  if (gameStarted) {
    const exercise = exercises[currentExercise];
    const isCompleted = completedExercises.includes(exercise.id);

    return (
      <div className="min-h-screen bg-gray-50">
        <GameHeader title="Gestão da Frustração" icon={<ShieldCheck size={24} />} />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Status Bar */}
            <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-6">
                <div className="text-sm text-gray-600">
                    Pontos: <span className="font-bold text-teal-600">{points}</span>
                </div>
                <div className="w-full max-w-xs mx-auto">
                    <p className="text-center text-sm text-gray-600 mb-1">Exercício {currentExercise + 1} de {exercises.length}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Conteúdo do Exercício */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{exercise.title}</h2>
                    <p className="text-gray-600 mt-1">{exercise.description}</p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                    <p className="text-gray-700">{exercise.instruction}</p>
                </div>

                {/* Renderização Específica de Cada Exercício */}
                {exercise.type === 'breathing' && (
                    <div className="text-center p-4 border rounded-lg bg-gray-50">
                        <p className="font-semibold text-lg mb-4">Pratique a respiração 4-7-8.</p>
                        {/* Componente de respiração pode ser adicionado aqui */}
                    </div>
                )}
                {exercise.type === 'reframing' && (
                    <div className="space-y-3">
                       {/* Exemplos de reframing podem ser listados aqui */}
                       <p className="text-center text-gray-500">Leia e reflita sobre os exemplos.</p>
                    </div>
                )}
                {exercise.type === 'reflection' && (
                    <textarea className="w-full p-3 border border-gray-300 rounded-lg h-32" placeholder="Escreva sua reflexão aqui..."></textarea>
                )}
                {exercise.type === 'action-plan' && (
                     <ul className="list-disc list-inside space-y-2 p-4 bg-yellow-50 rounded-lg">
                        <li><span className="font-bold">S</span> - PARE o que está fazendo</li>
                        <li><span className="font-bold">T</span> - RESPIRE fundo 3 vezes</li>
                        <li><span className="font-bold">O</span> - OBSERVE seus pensamentos e sentimentos</li>
                        <li><span className="font-bold">P</span> - PROSSIGA com uma ação mais consciente</li>
                     </ul>
                )}
                
                <div className="text-center">
                    <button onClick={completeCurrentExercise} disabled={isCompleted} className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${isCompleted ? 'bg-green-500 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}>
                        {isCompleted ? '✅ Exercício Concluído' : 'Concluir Exercício'}
                    </button>
                </div>
            </div>

            {/* Navegação */}
            <div className="flex justify-between mt-6">
                <button onClick={prevExercise} disabled={currentExercise === 0} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    Anterior
                </button>
                <button onClick={nextExercise} disabled={currentExercise === exercises.length - 1} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    Próximo
                </button>
            </div>
        </main>
      </div>
    );
  }

  // ============================================================================
  // RENDERIZAÇÃO DA TELA INICIAL (PADRONIZADA)
  // ============================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Gestão da Frustração" icon={<ShieldCheck size={24} />} />
      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                <p className="text-sm text-gray-600">
                  Aprender e praticar técnicas eficazes para lidar com frustrações, críticas e raiva de forma construtiva.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Navegue pelos diferentes exercícios.</li>
                  <li>Pratique as técnicas de respiração e reflexão.</li>
                  <li>Marque cada exercício como concluído para ganhar pontos.</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                <p className="text-sm text-gray-600">
                  Cada exercício concluído vale +10 pontos. O objetivo é construir um repertório de estratégias para momentos difíceis.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                    { id: 1, nome: 'Nível 1', desc: 'Acalmar o Corpo', icone: '🫁' },
                    { id: 2, nome: 'Nível 2', desc: 'Mudar o Pensamento', icone: '🧠' },
                    { id: 3, nome: 'Nível 3', desc: 'Agir com Consciência', icone: '⚡' },
                ].map(nivel => (
                    <button key={nivel.id} onClick={() => setNivelSelecionado(nivel.id)} className={`p-4 rounded-lg font-medium transition-colors ${nivelSelecionado === nivel.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                        <div className="text-2xl mb-1">{nivel.icone}</div>
                        <div className="text-sm">{nivel.nome}</div>
                        <div className="text-xs opacity-80">{nivel.desc}</div>
                    </button>
                ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <button onClick={handleStartGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
              🚀 Iniciar Atividade
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
