'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GameHeader } from '@/components/GameHeader';
import { Users, Trophy, Gamepad2 } from 'lucide-react';

// Interfaces e dados do exercício permanecem os mesmos
interface Option {
  id: string;
  text: string;
  correct: boolean;
}

interface Exercise {
  title: string;
  scenario: string;
  question: string;
  options: Option[];
  explanation: string;
}

export default function BodyLanguagePage() {
  // NOVO ESTADO para controlar a tela de finalização
  const [gameFinished, setGameFinished] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [points, setPoints] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const exercises: Exercise[] = [
    {
      title: 'Posturas de Confiança',
      scenario: 'Você vê uma pessoa em pé, com ombros para trás, peito aberto, mãos nos quadris e pés firmes no chão.',
      question: 'Essa postura corporal indica:',
      options: [
        { id: 'a', text: 'Nervosismo e insegurança', correct: false },
        { id: 'b', text: 'Confiança e autoridade', correct: true },
        { id: 'c', text: 'Pressa para sair', correct: false },
        { id: 'd', text: 'Desinteresse', correct: false }
      ],
      explanation: 'Essa postura expansiva com ombros para trás e mãos nos quadris é um sinal clássico de confiança e presença!'
    },
    // ... (restante dos exercícios)
  ];

  const currentEx = exercises[currentExercise];

  const handleStartGame = () => {
    setGameStarted(true);
    // Zera os estados para um novo jogo
    setCurrentExercise(0);
    setPoints(0);
    setExerciseStarted(false);
    setSelectedAnswer('');
    setShowFeedback(false);
    setGameFinished(false);
  };

  const handleStartExercise = () => {
    setExerciseStarted(true);
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setShowFeedback(true);
    const isCorrect = currentEx.options.find(opt => opt.id === selectedAnswer)?.correct;
    if (isCorrect) {
      setPoints(points + 10);
    }
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setExerciseStarted(false);
      setSelectedAnswer('');
      setShowFeedback(false);
    } else {
      // Quando o último exercício termina, ativa a tela de finalização
      setGameFinished(true);
    }
  };

  // NOVA FUNÇÃO para reiniciar tudo e voltar ao menu inicial
  const resetGame = () => {
    setGameStarted(false);
    setGameFinished(false);
    setCurrentExercise(0);
    setPoints(0);
    setExerciseStarted(false);
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  const isCorrect = selectedAnswer && currentEx.options.find(opt => opt.id === selectedAnswer)?.correct;
  
  // TELA DE RESULTADOS (quando o jogo termina)
  if (gameFinished) {
    return (
      <>
        <GameHeader
          title="Linguagem Corporal"
          icon={<Users className="h-6 w-6" />}
        />
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <div className="max-w-2xl text-center">
                    <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl">
                        <div className="mb-8">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-4xl">
                                🏆
                            </div>
                            <h1 className="mb-4 text-4xl font-bold text-gray-900">Atividade Concluída!</h1>
                            <p className="text-xl text-gray-600">Você completou todos os cenários de linguagem corporal.</p>
                        </div>
                        <div className="mb-8 space-y-4">
                            <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">Pontuação Final</h3>
                                <p className="text-3xl font-bold text-blue-600">{points} / {exercises.length * 10} pontos</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <button onClick={resetGame} className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg">
                                🔄 Jogar Novamente
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
      </>
    )
  }

  // TELA INICIAL E TELA DO JOGO
  return (
    <>
      <GameHeader
        title="Linguagem Corporal"
        icon={<Users className="h-6 w-6" />}
        showSaveButton={false}
      />
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {!gameStarted ? (
            // Tela Inicial Padronizada
            <div className="space-y-6">
              {/* ... Bloco 1: Cards e Bloco 2: Botão Iniciar ... */}
            </div>
          ) : (
            // Layout do Jogo
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                <span>Exercício {currentExercise + 1}/{exercises.length}</span>
                <span>Pontos: {points}</span>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentEx.title}</h2>
                {/* ... (lógica de !exerciseStarted e exerciseStarted) ... */}
                {showFeedback && (
                  <>
                    {/* ... (div de feedback) ... */}
                    <div className="flex justify-center mt-4">
                      {/* LÓGICA DO BOTÃO FINAL CORRIGIDA */}
                      {currentExercise < exercises.length - 1 ? (
                        <button onClick={handleNext} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors">
                          Próximo Exercício →
                        </button>
                      ) : (
                        <button onClick={() => setGameFinished(true)} className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors">
                          Ver Resultados ✓
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
