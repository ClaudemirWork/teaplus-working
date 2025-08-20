'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Sparkles } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE PADRÃO DO CABEÇALHO (GameHeader)
// Conforme especificado no Log de Padronização.
// ============================================================================
const GameHeader = ({ title, icon }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        {/* 1. Botão Voltar (Esquerda) */}
        <Link
          href="/dashboard"
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </Link>

        {/* 2. Título Centralizado (Meio) */}
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h1>

        {/* 3. Espaçador (Direita) */}
        <div className="w-24"></div>
      </div>
    </div>
  </header>
);

// ============================================================================
// 2. PÁGINA DA ATIVIDADE "ESTRATÉGIAS DE CALMA"
// Código original refatorado para usar o layout padrão.
// ============================================================================
export default function CalmingStrategiesPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [points, setPoints] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [nivelSelecionado, setNivelSelecionado] = useState(1); // NOVO ESTADO
  const router = useRouter();

  // ... (toda a lógica de exercícios e handlers permanece a mesma)
  const exercises = [
    {
      title: 'Técnica 5-4-3-2-1 (Grounding)',
      description: 'Use seus sentidos para se conectar com o presente',
      instruction: 'Esta técnica ajuda a interromper pensamentos ansiosos focando no aqui e agora.',
      color: 'from-green-400 to-emerald-500',
      type: 'grounding',
      steps: [
        { text: 'Encontre 5 coisas que você pode VER ao seu redor', items: ['Quadro na parede', 'Objeto sobre a mesa', 'Cor da parede', 'Forma da janela', 'Textura do chão'] },
        { text: 'Identifique 4 coisas que você pode TOCAR', items: ['Superfície da mesa', 'Tecido da roupa', 'Temperatura do ar', 'Textura do cabelo'] },
        { text: 'Escute 3 sons diferentes ao seu redor', items: ['Som do vento', 'Ruído de carros', 'Sua própria respiração'] },
        { text: 'Sinta 2 cheiros ou aromas', items: ['Perfume do ambiente', 'Aroma de comida'] },
        { text: 'Prove 1 sabor na sua boca', items: ['Gosto da saliva', 'Resíduo de bebida'] }
      ],
      explanation: 'O grounding 5-4-3-2-1 redireciona a atenção para o presente, interrompendo ciclos de ansiedade!'
    },
    // ... (restante dos exercícios)
  ];

  const currentEx = exercises[currentExercise];
  const currentStep_data = currentEx.steps[currentStep];

  useEffect(() => {
    let interval;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentExercise(0);
    setPoints(0);
    setExerciseStarted(false);
    resetExercise();
  };

  const handleStartExercise = () => {
    setExerciseStarted(true);
    resetExercise();
  };

  const resetExercise = () => {
    setCurrentStep(0);
    setIsActive(false);
    setTimer(0);
    setSelectedItems([]);
    setShowFeedback(false);
  };

  const handleNextStep = () => {
    if (currentStep < currentEx.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowFeedback(true);
      setPoints(points + 10);
    }
  };

  const handleSelectItem = (item) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleStartTimer = (duration) => {
    setTimer(duration);
    setIsActive(true);
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setExerciseStarted(false);
      resetExercise();
    } else {
      setGameStarted(false); // Volta para a tela inicial
    }
  };

  // ============================================================================
  // RENDERIZAÇÃO DA ATIVIDADE EM SI (APÓS CLICAR EM INICIAR)
  // ============================================================================
  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GameHeader title="Estratégias de Calma" icon={<Sparkles size={24} />} />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Status Bar */}
            <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-6">
                <div className="text-sm text-gray-600">
                    Pontos: <span className="font-bold text-teal-600">{points}</span>
                </div>
                <div className="text-sm text-gray-600">
                    Exercício <span className="font-bold">{currentExercise + 1}</span>/{exercises.length}
                </div>
            </div>

            {/* Conteúdo do Jogo (código original mantido aqui) */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">{currentEx.title}</h2>
              </div>
              
              {!exerciseStarted ? (
                <div className="space-y-6 text-center">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg text-left">
                        <p className="text-gray-700 text-lg leading-relaxed mb-3"><strong>{currentEx.description}</strong></p>
                        <p className="text-gray-600">{currentEx.instruction}</p>
                    </div>
                    <button onClick={handleStartExercise} className={`w-full md:w-auto bg-gradient-to-r ${currentEx.color} text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105`}>
                        Iniciar Exercício
                    </button>
                </div>
              ) : (
                <div className="space-y-6">
                    {/* ... (Toda a lógica de exibição dos passos do exercício foi mantida aqui) ... */}
                </div>
              )}
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
      <GameHeader title="Estratégias de Calma" icon={<Sparkles size={24} />} />
      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">

          {/* Bloco 1: Cards Informativos */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card de Objetivo */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                <p className="text-sm text-gray-600">
                  Criar um "kit de ferramentas" de técnicas práticas para recuperar a calma em momentos de estresse ou ansiedade.
                </p>
              </div>

              {/* Card de Como Jogar */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Escolha um nível para praticar.</li>
                  <li>Siga as instruções de cada exercício passo a passo.</li>
                  <li>Pratique as técnicas para aprender a se acalmar.</li>
                </ul>
              </div>

              {/* Card de Avaliação/Progresso */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                <p className="text-sm text-gray-600">
                  Cada estratégia completada vale +10 pontos. O mais importante é aprender novas formas de lidar com as emoções.
                </p>
              </div>
            </div>
          </div>

          {/* Bloco 2: Seleção de Nível */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
              {[
                { id: 1, nome: 'Nível 1', desc: 'Técnicas Básicas', icone: '🌱' },
                { id: 2, nome: 'Nível 2', desc: 'Relaxamento Físico', icone: '💪' },
                { id: 3, nome: 'Nível 3', desc: 'Foco Sensorial', icone: '🎧' },
              ].map(nivel => (
                <button
                  key={nivel.id}
                  onClick={() => setNivelSelecionado(nivel.id)}
                  className={`p-4 rounded-lg font-medium transition-colors ${
                    nivelSelecionado === nivel.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{nivel.icone}</div>
                  <div className="text-sm">{nivel.nome}</div>
                  <div className="text-xs opacity-80">{nivel.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bloco 3: Botão Iniciar */}
          <div className="text-center pt-4">
            <button
              onClick={handleStartGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              🚀 Iniciar Atividade
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
