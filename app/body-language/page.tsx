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
    {
      title: 'Braços Cruzados',
      scenario: 'Durante uma conversa, a pessoa cruza os braços na frente do peito e se afasta ligeiramente.',
      question: 'O que isso pode significar?',
      options: [
        { id: 'a', text: 'Está com frio', correct: false },
        { id: 'b', text: 'Está defensiva ou desconfortável', correct: true },
        { id: 'c', text: 'Está muito interessada', correct: false },
        { id: 'd', text: 'Quer um abraço', correct: false }
      ],
      explanation: 'Braços cruzados geralmente indicam uma barreira defensiva, sugerindo desconforto ou resistência!'
    },
    {
      title: 'Contato Visual',
      scenario: 'Uma pessoa mantém contato visual direto, pisca normalmente e inclina ligeiramente a cabeça enquanto você fala.',
      question: 'Essa linguagem corporal demonstra:',
      options: [
        { id: 'a', text: 'Desconfiança e suspeita', correct: false },
        { id: 'b', text: 'Interesse genuíno e atenção', correct: true },
        { id: 'c', text: 'Tédio e distração', correct: false },
        { id: 'd', text: 'Agressividade', correct: false }
      ],
      explanation: 'Contato visual mantido com inclinação da cabeça são sinais claros de interesse e escuta ativa!'
    },
    {
      title: 'Espaço Pessoal',
      scenario: 'Alguém se aproxima muito de você durante uma conversa casual, ficando a menos de 50cm de distância.',
      question: 'Como interpretar essa proximidade?',
      options: [
        { id: 'a', text: 'Comportamento normal para qualquer situação', correct: false },
        { id: 'b', text: 'Pode estar invadindo o espaço pessoal', correct: true },
        { id: 'c', text: 'Demonstra educação', correct: false },
        { id: 'd', text: 'Mostra timidez', correct: false }
      ],
      explanation: 'A distância íntima (menos de 50cm) é reservada para pessoas muito próximas. Com conhecidos, o ideal é manter distância social!'
    },
    {
      title: 'Gestos com as Mãos',
      scenario: 'Durante uma explicação, a pessoa esconde as mãos nos bolsos ou atrás das costas.',
      question: 'O que isso pode indicar?',
      options: [
        { id: 'a', text: 'Total transparência', correct: false },
        { id: 'b', text: 'Possível nervosismo ou algo a esconder', correct: true },
        { id: 'c', text: 'Máxima confiança', correct: false },
        { id: 'd', text: 'Alegria extrema', correct: false }
      ],
      explanation: 'Mãos escondidas podem indicar nervosismo ou falta de transparência. Mãos visíveis transmitem mais confiança!'
    }
  ];

  const currentEx = exercises[currentExercise];

  // ### INÍCIO DO BLOCO DE LÓGICA RESTAURADO ###
  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentExercise(0);
    setPoints(0);
    setExerciseStarted(false);
    setSelectedAnswer('');
    setShowFeedback(false);
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
    }
  };
  // ### FIM DO BLOCO DE LÓGICA RESTAURADO ###

  const isCorrect = selectedAnswer && currentEx.options.find(opt => opt.id === selectedAnswer)?.correct;

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
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:</h3>
                    <p className="text-sm text-gray-600">Desenvolver a habilidade de interpretar gestos, posturas e sinais corporais para entender melhor as intenções e emoções das outras pessoas.</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Leia o cenário descrito.</li>
                      <li>Analise a pergunta sobre a situação.</li>
                      <li>Escolha a alternativa que melhor interpreta a linguagem corporal.</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                    <p className="text-sm text-gray-600">Cada resposta correta vale 10 pontos. Ao final, você terá um resumo do seu desempenho na interpretação de sinais não-verbais.</p>
                  </div>
                </div>
              </div>
              <div className="text-center pt-4">
                <button
                  onClick={handleStartGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg"
                >
                  🚀 Começar Atividade
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                <span>Exercício {currentExercise + 1}/{exercises.length}</span>
                <span>Pontos: {points}</span>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentEx.title}</h2>
                
                {!exerciseStarted ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                      <p className="text-gray-700 text-lg">{currentEx.scenario}</p>
                    </div>
                    <button onClick={handleStartExercise} className="bg-orange-500 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-orange-600 transition-colors">
                      Iniciar Exercício
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                      <p className="text-gray-700 text-lg mb-4">{currentEx.scenario}</p>
                      <p className="text-gray-800 font-semibold text-lg">{currentEx.question}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {currentEx.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleAnswerSelect(option.id)}
                          disabled={showFeedback}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selectedAnswer === option.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="font-medium">{option.id.toUpperCase()}) </span>
                          {option.text}
                        </button>
                      ))}
                    </div>
                    {!showFeedback && selectedAnswer && (
                      <button onClick={handleSubmit} className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors w-full sm:w-auto">
                        Confirmar Resposta
                      </button>
                    )}
                    {showFeedback && (
                      <>
                        <div className={`p-6 rounded-xl ${isCorrect ? 'bg-green-50 border-green-400' : 'bg-yellow-50 border-yellow-400'} border-l-4`}>
                          <h3 className="text-lg font-semibold mb-2">{isCorrect ? '🎉 Excelente! +10 pontos' : '💡 Vamos aprender!'}</h3>
                          <p className="text-gray-700">{currentEx.explanation}</p>
                        </div>
                        <div className="flex justify-center mt-4">
                          {currentExercise < exercises.length - 1 ? (
                            <button onClick={handleNext} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors">
                              Próximo Exercício →
                            </button>
                          ) : (
                            <Link href="/dashboard" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors inline-block">
                              Finalizar Atividade ✓
                            </Link>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
