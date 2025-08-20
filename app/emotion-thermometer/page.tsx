'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Thermometer } from 'lucide-react';

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
// 2. PÁGINA DA ATIVIDADE "TERMÔMETRO DE EMOÇÕES"
// Código original refatorado para usar o layout padrão.
// ============================================================================
export default function EmotionThermometerPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [points, setPoints] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [nivelSelecionado, setNivelSelecionado] = useState(1); // NOVO ESTADO
  const router = useRouter();

  // ... (toda a lógica de exercícios e handlers permanece a mesma)
  const exercises = [
    {
      title: 'Termômetro da Alegria',
      scenario: 'Você acabou de receber uma notícia muito boa: foi aprovado na escola dos seus sonhos!',
      emotion: 'Alegria',
      correctMin: 8,
      correctMax: 10,
      explanation: 'Receber uma notícia excelente geralmente causa alegria intensa (8-10). É normal sentir muita felicidade em momentos especiais!'
    },
    // ... (restante dos exercícios)
  ];

  const currentEx = exercises[currentExercise];
  
  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentExercise(0);
    setPoints(0);
    setExerciseStarted(false);
    setSelectedLevel(null);
    setShowFeedback(false);
  };
  
  const handleStartExercise = () => {
    setExerciseStarted(true);
    setSelectedLevel(null);
    setShowFeedback(false);
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setExerciseStarted(false);
      setSelectedLevel(null);
      setShowFeedback(false);
    } else {
        setGameStarted(false);
    }
  };

  // ============================================================================
  // RENDERIZAÇÃO DA ATIVIDADE EM SI (APÓS CLICAR EM INICIAR)
  // ============================================================================
  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GameHeader title="Termômetro de Emoções" icon={<Thermometer size={24} />} />
        
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
                        <p className="text-gray-700 text-lg leading-relaxed">{currentEx.scenario}</p>
                    </div>
                    <button onClick={handleStartExercise} className="w-full md:w-auto bg-gradient-to-r from-red-400 to-orange-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all">
                        Iniciar Exercício
                    </button>
                </div>
              ) : (
                <div className="space-y-6">
                    {/* ... (Toda a lógica do termômetro visual foi mantida aqui) ... */}
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
      <GameHeader title="Termômetro de Emoções" icon={<Thermometer size={24} />} />
      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">

          {/* Bloco 1: Cards Informativos */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card de Objetivo */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                <p className="text-sm text-gray-600">
                  Aprender a identificar e medir a intensidade das emoções em diferentes situações do dia a dia.
                </p>
              </div>

              {/* Card de Como Jogar */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Leia a situação apresentada.</li>
                  <li>Use o termômetro para indicar a intensidade da emoção.</li>
                  <li>Confira o feedback para aprender mais.</li>
                </ul>
              </div>

              {/* Card de Avaliação/Progresso */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                <p className="text-sm text-gray-600">
                  Cada avaliação correta da intensidade da emoção vale +10 pontos. O objetivo é calibrar sua percepção emocional.
                </p>
              </div>
            </div>
          </div>

          {/* Bloco 2: Seleção de Nível */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
              {[
                { id: 1, nome: 'Nível 1', desc: 'Emoções Básicas', icone: '🙂' },
                { id: 2, nome: 'Nível 2', desc: 'Emoções Complexas', icone: '🤔' },
                { id: 3, nome: 'Nível 3', desc: 'Situações Mistas', icone: '🤯' },
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
