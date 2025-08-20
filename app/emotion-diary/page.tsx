'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, BookHeart } from 'lucide-react';

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
// 2. PÁGINA DA ATIVIDADE "DIÁRIO DE EMOÇÕES"
// Código original refatorado para usar o layout padrão.
// ============================================================================
export default function EmotionDiaryPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(0);
  const [points, setPoints] = useState(0);
  const [entryStarted, setEntryStarted] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [intensity, setIntensity] = useState(0);
  const [situation, setSituation] = useState('');
  const [reflection, setReflection] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [nivelSelecionado, setNivelSelecionado] = useState(1); // NOVO ESTADO
  const router = useRouter();

  // ... (toda a lógica de diário e handlers permanece a mesma)
  const diaryPrompts = [
    {
      title: 'Entrada da Manhã',
      timeframe: 'Como você está se sentindo hoje ao acordar?',
      guidance: 'Reflita sobre como começou o dia e o que pode ter influenciado seu estado emocional.',
      color: 'from-yellow-400 to-orange-500',
      icon: '🌅'
    },
    // ... (restante dos prompts)
  ];
  
  const emotions = [
    { name: 'Alegria', color: 'bg-yellow-400', emoji: '😊' },
    { name: 'Tristeza', color: 'bg-blue-400', emoji: '😢' },
    { name: 'Raiva', color: 'bg-red-400', emoji: '😡' },
    { name: 'Medo', color: 'bg-gray-400', emoji: '😨' },
    // ... (restante das emoções)
  ];

  const currentPrompt = diaryPrompts[currentEntry];
  
  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentEntry(0);
    setPoints(0);
    setEntryStarted(false);
    resetEntry();
  };

  const handleStartEntry = () => {
    setEntryStarted(true);
    resetEntry();
  };

  const resetEntry = () => {
    setSelectedEmotion('');
    setIntensity(0);
    setSituation('');
    setReflection('');
    setShowFeedback(false);
  };
  
  const handleSubmitEntry = () => {
    if (selectedEmotion && intensity > 0 && situation.length > 10 && reflection.length > 10) {
      setShowFeedback(true);
      setPoints(points + 10);
    }
  };

  const handleNext = () => {
    if (currentEntry < diaryPrompts.length - 1) {
      setCurrentEntry(currentEntry + 1);
      setEntryStarted(false);
      resetEntry();
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
        <GameHeader title="Diário de Emoções" icon={<BookHeart size={24} />} />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Status Bar */}
            <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-6">
                <div className="text-sm text-gray-600">
                    Pontos: <span className="font-bold text-teal-600">{points}</span>
                </div>
                <div className="text-sm text-gray-600">
                    Entrada <span className="font-bold">{currentEntry + 1}</span>/{diaryPrompts.length}
                </div>
            </div>

            {/* Conteúdo do Jogo (código original mantido aqui) */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{currentPrompt.icon}</span>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{currentPrompt.title}</h2>
                </div>
                
                {!entryStarted ? (
                    <div className="space-y-6 text-center">
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg text-left">
                            <p className="text-gray-700 text-lg leading-relaxed mb-3"><strong>{currentPrompt.timeframe}</strong></p>
                            <p className="text-gray-600">{currentPrompt.guidance}</p>
                        </div>
                        <button onClick={handleStartEntry} className={`w-full md:w-auto bg-gradient-to-r ${currentPrompt.color} text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all`}>
                            Escrever Entrada
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* ... (Toda a lógica de seleção de emoção, intensidade e texto foi mantida aqui) ... */}
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
      <GameHeader title="Diário de Emoções" icon={<BookHeart size={24} />} />
      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">

          {/* Bloco 1: Cards Informativos */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card de Objetivo */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                <p className="text-sm text-gray-600">
                  Desenvolver autoconsciência registrando emoções, situações e reflexões para entender melhor a si mesmo.
                </p>
              </div>

              {/* Card de Como Jogar */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Escolha uma situação para registrar.</li>
                  <li>Selecione a emoção principal e sua intensidade.</li>
                  <li>Descreva o que aconteceu e reflita sobre isso.</li>
                </ul>
              </div>

              {/* Card de Avaliação/Progresso */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                <p className="text-sm text-gray-600">
                  Cada entrada completa no diário vale +10 pontos, incentivando o hábito da auto-observação e reflexão.
                </p>
              </div>
            </div>
          </div>

          {/* Bloco 2: Seleção de Nível */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
              {[
                { id: 1, nome: 'Nível 1', desc: 'Identificação Básica', icone: '🧐' },
                { id: 2, nome: 'Nível 2', desc: 'Análise de Padrões', icone: '📈' },
                { id: 3, nome: 'Nível 3', desc: 'Reflexão Profunda', icone: '🧘' },
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
