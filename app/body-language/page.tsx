'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BodyLanguagePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [points, setPoints] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const exercises = [
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

  const handleAnswerSelect = (answerId) => {
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

  const isCorrect = selectedAnswer && currentEx.options.find(opt => opt.id === selectedAnswer)?.correct;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header fixo */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Botão Voltar */}
            <Link 
              href="/tea"
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium hidden sm:inline">Voltar para TEA</span>
              <span className="font-medium sm:hidden">Voltar</span>
            </Link>

            {/* Título central */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🤷</span>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Linguagem Corporal</h1>
            </div>

            {/* Pontuação */}
            <div className="text-right">
              <div className="text-sm text-gray-500">Pontuação Total</div>
              <div className="text-lg font-bold text-orange-600">{points} pts</div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!gameStarted ? (
          <div className="space-y-6">
            {/* Descrição da atividade */}
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg">
                Leitura de sinais corporais e posturas
              </p>
            </div>

            {/* Cards informativos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Objetivo */}
              <div className="bg-white rounded-xl border-l-4 border-red-400 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🎯</span>
                  <h3 className="text-lg font-semibold text-red-600">Objetivo:</h3>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  Desenvolver habilidades de interpretação de gestos, posturas e sinais corporais 
                  para melhorar a compreensão da comunicação não-verbal
                </p>
              </div>

              {/* Pontuação */}
              <div className="bg-white rounded-xl border-l-4 border-blue-400 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">👑</span>
                  <h3 className="text-lg font-semibold text-blue-600">Pontuação:</h3>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  Cada interpretação correta = +10 pontos. Você precisa de 50 pontos 
                  para completar a atividade com sucesso
                </p>
              </div>

              {/* Níveis */}
              <div className="bg-white rounded-xl border-l-4 border-purple-400 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">📊</span>
                  <h3 className="text-lg font-semibold text-purple-600">Níveis:</h3>
                </div>
                <div className="text-gray-700 text-sm sm:text-base space-y-1">
                  <p><strong className="text-purple-600">Nível 1:</strong> Posturas básicas (confiança, defensiva)</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> Gestos e contato visual</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> Espaço pessoal e transparência</p>
                </div>
              </div>

              {/* Final */}
              <div className="bg-white rounded-xl border-l-4 border-green-400 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🏁</span>
                  <h3 className="text-lg font-semibold text-green-600">Final:</h3>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  Complete os 3 níveis com 50 pontos para finalizar a atividade 
                  e dominar a leitura de linguagem corporal
                </p>
              </div>
            </div>

            {/* Botão Começar */}
            <div className="text-center py-6">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
              >
                Começar Atividade
              </button>
            </div>

            {/* Base Científica */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <span className="text-xl mr-2">🧠</span>
                <h3 className="text-lg font-semibold text-gray-800">Base Científica:</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Este exercício é baseado em pesquisas de Albert Mehrabian sobre comunicação não-verbal 
                e estudos de kinésica. A linguagem corporal representa 55% da comunicação humana, 
                sendo essencial para pessoas com TEA desenvolverem habilidades de leitura de sinais corporais.
              </p>
            </div>
          </div>
        ) : (
          // Área do jogo
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
            {/* Progresso */}
            <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
              <span>Exercício {currentExercise + 1}/{exercises.length}</span>
              <span>Pontos: {points}</span>
            </div>

            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                {currentEx.title}
              </h2>
              
              {!exerciseStarted ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg">
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                      {currentEx.scenario}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleStartExercise}
                    className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                  >
                    Iniciar Exercício
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg mb-6">
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                      {currentEx.scenario}
                    </p>
                    <p className="text-gray-800 font-semibold text-base sm:text-lg">
                      {currentEx.question}
                    </p>
                  </div>

                  {/* Opções de resposta */}
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {currentEx.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerSelect(option.id)}
                        disabled={showFeedback}
                        className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 text-sm sm:text-base ${
                          selectedAnswer === option.id
                            ? showFeedback
                              ? option.correct
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : 'border-red-500 bg-red-50 text-red-800'
                              : 'border-blue-500 bg-blue-50 text-blue-800'
                            : showFeedback && option.correct
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{option.id.toUpperCase()}) </span>
                        {option.text}
                        {showFeedback && option.correct && (
                          <span className="ml-2 text-green-600">✓</span>
                        )}
                        {showFeedback && selectedAnswer === option.id && !option.correct && (
                          <span className="ml-2 text-red-600">✗</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Botão Confirmar */}
                  {!showFeedback && selectedAnswer && (
                    <button
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                    >
                      Confirmar Resposta
                    </button>
                  )}

                  {/* Feedback */}
                  {showFeedback && (
                    <div className={`p-4 sm:p-6 rounded-xl ${
                      isCorrect 
                        ? 'bg-green-50 border-l-4 border-green-400' 
                        : 'bg-yellow-50 border-l-4 border-yellow-400'
                    }`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl">
                          {isCorrect ? '🎉' : '💡'}
                        </span>
                        <h3 className="text-base sm:text-lg font-semibold">
                          {isCorrect ? 'Excelente leitura corporal! +10 pontos' : 'Vamos aprender juntos!'}
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {currentEx.explanation}
                      </p>
                    </div>
                  )}

                  {/* Navegação */}
                  {showFeedback && (
                    <div className="flex justify-center">
                      {currentExercise < exercises.length - 1 ? (
                        <button
                          onClick={handleNext}
                          className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                        >
                          Próximo Exercício →
                        </button>
                      ) : (
                        <Link
                          href="/tea"
                          className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 inline-block text-center w-full sm:w-auto"
                        >
                          Finalizar Atividade ✓
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}