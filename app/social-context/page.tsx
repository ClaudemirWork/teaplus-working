'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SocialContextPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [points, setPoints] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const exercises = [
    {
      title: 'Contexto Escolar vs Social',
      scenario: 'Você está na escola durante uma aula e depois vai para uma festa de aniversário com os mesmos colegas. Na aula, todo mundo está quieto e prestando atenção. Na festa, as mesmas pessoas estão falando alto, rindo e brincando.',
      question: 'Por que o comportamento das pessoas muda tanto entre esses dois contextos?',
      options: [
        { id: 'a', text: 'As pessoas são falsas e fingem na escola', correct: false },
        { id: 'b', text: 'Cada contexto tem regras sociais e expectativas diferentes', correct: true },
        { id: 'c', text: 'Na festa elas estão mal-educadas', correct: false },
        { id: 'd', text: 'Não há diferença real no comportamento', correct: false }
      ],
      explanation: 'Cada ambiente social tem suas próprias regras não-escritas. Na escola é esperado silêncio e atenção, na festa é normal ser mais expressivo!'
    },
    {
      title: 'Linguagem Formal vs Informal',
      scenario: 'João fala "E aí, beleza?" para seu melhor amigo, mas diz "Bom dia, como está?" para o diretor da escola.',
      question: 'Por que João muda sua forma de falar?',
      options: [
        { id: 'a', text: 'Ele está sendo falso com o diretor', correct: false },
        { id: 'b', text: 'Ele adapta a linguagem ao nível de formalidade do contexto', correct: true },
        { id: 'c', text: 'Ele não gosta do diretor', correct: false },
        { id: 'd', text: 'Ele esqueceu como falar normalmente', correct: false }
      ],
      explanation: 'Adaptar a linguagem ao contexto é uma habilidade social importante. Contextos formais pedem linguagem mais respeitosa!'
    },
    {
      title: 'Volume de Voz Contextual',
      scenario: 'Marina fala baixinho na biblioteca, em volume normal na cantina, e mais alto na quadra de esportes.',
      question: 'O que determina o volume da voz de Marina?',
      options: [
        { id: 'a', text: 'Seu humor do momento', correct: false },
        { id: 'b', text: 'As normas sonoras apropriadas para cada ambiente', correct: true },
        { id: 'c', text: 'A quantidade de pessoas no local', correct: false },
        { id: 'd', text: 'Ela tem problemas de audição', correct: false }
      ],
      explanation: 'Diferentes ambientes têm expectativas diferentes sobre ruído. Bibliotecas pedem silêncio, quadras permitem mais volume!'
    },
    {
      title: 'Vestimenta e Contexto',
      scenario: 'Pedro usa uniforme na escola, roupa casual no shopping, roupa social em um casamento, e roupa de banho na praia.',
      question: 'O que isso demonstra sobre as regras sociais?',
      options: [
        { id: 'a', text: 'Pedro gosta de variedade na roupa', correct: false },
        { id: 'b', text: 'Cada contexto social tem códigos de vestimenta apropriados', correct: true },
        { id: 'c', text: 'Pedro está sempre tentando impressionar', correct: false },
        { id: 'd', text: 'Não importa o que vestir em cada lugar', correct: false }
      ],
      explanation: 'A vestimenta adequada varia conforme o contexto social. Cada ambiente tem expectativas sobre aparência apropriada!'
    },
    {
      title: 'Tópicos de Conversa Contextuais',
      scenario: 'Ana fala sobre desenhos animados com crianças de 6 anos, sobre estudos com colegas da escola, sobre trabalho com adultos, e sobre música com amigos próximos.',
      question: 'Por que Ana muda os assuntos conforme as pessoas?',
      options: [
        { id: 'a', text: 'Ela é uma pessoa muito confusa', correct: false },
        { id: 'b', text: 'Ela adapta os tópicos aos interesses e idade do grupo', correct: true },
        { id: 'c', text: 'Ela não tem personalidade própria', correct: false },
        { id: 'd', text: 'Ela quer agradar todo mundo', correct: false }
      ],
      explanation: 'Escolher tópicos apropriados para cada grupo é sensibilidade social. Diferentes pessoas têm diferentes interesses e capacidades!'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Header Mobile */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Botão Voltar */}
            <a 
              href="/tea" 
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors min-h-[44px] px-2 -ml-2"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-sm sm:text-base font-medium">Voltar para TEA</span>
            </a>
            
            {/* Título */}
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4 flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl">🏢</span>
              <span>Contexto Social</span>
            </h1>
            
            {/* Info do Jogo */}
            <div className="text-right">
              {gameStarted && (
                <div className="text-xs sm:text-sm text-gray-600">
                  <div>Pontos: {points}</div>
                  <div>{currentExercise + 1}/{exercises.length}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {!gameStarted ? (
          <div>
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div className="bg-white rounded-lg border-l-4 border-red-400 p-4 sm:p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🎯</span>
                  <h3 className="text-base sm:text-lg font-semibold text-red-600">Objetivo:</h3>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  Compreender como diferentes contextos sociais exigem adaptações no comportamento, 
                  linguagem e apresentação pessoal
                </p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-blue-400 p-4 sm:p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">👑</span>
                  <h3 className="text-base sm:text-lg font-semibold text-blue-600">Pontuação:</h3>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  Cada adaptação correta = +10 pontos. Você precisa de 50 pontos 
                  para completar a atividade com sucesso
                </p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-purple-400 p-4 sm:p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">📊</span>
                  <h3 className="text-base sm:text-lg font-semibold text-purple-600">Níveis:</h3>
                </div>
                <div className="text-gray-700 text-sm sm:text-base">
                  <p><strong className="text-purple-600">Nível 1:</strong> Contextos básicos (escola vs social)</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> Linguagem e comunicação adaptativa</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> Vestimenta e tópicos contextuais</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-green-400 p-4 sm:p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🏁</span>
                  <h3 className="text-base sm:text-lg font-semibold text-green-600">Final:</h3>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  Complete os 3 níveis com 50 pontos para finalizar a atividade 
                  e dominar a adaptação contextual
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center mb-6 sm:mb-8">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-purple-400 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 min-h-[48px] touch-manipulation"
              >
                Começar Atividade
              </button>
            </div>

            {/* Base Científica */}
            <div className="bg-white rounded-lg p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <span className="text-xl mr-2">🧠</span>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Base Científica:</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Este exercício é baseado na Teoria dos Scripts Sociais e pesquisas sobre cognição social contextual. 
                A capacidade de adaptar comportamentos a diferentes contextos é fundamental para a competência social 
                e é especialmente importante para pessoas com TEA desenvolverem flexibilidade comportamental.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl sm:rounded-3xl shadow-xl p-4 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                {currentEx.title}
              </h2>
              
              {!exerciseStarted ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg">
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                      {currentEx.scenario}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleStartExercise}
                    className="bg-gradient-to-r from-purple-400 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 min-h-[48px] touch-manipulation"
                  >
                    Iniciar Exercício
                  </button>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                      {currentEx.scenario}
                    </p>
                    <p className="text-gray-800 font-semibold text-base sm:text-lg">
                      {currentEx.question}
                    </p>
                  </div>

                  {/* Answer Options */}
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {currentEx.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerSelect(option.id)}
                        disabled={showFeedback}
                        className={`p-4 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 min-h-[56px] touch-manipulation flex items-start gap-2 ${
                          selectedAnswer === option.id
                            ? showFeedback
                              ? option.correct
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : 'border-red-500 bg-red-50 text-red-800'
                              : 'border-blue-500 bg-blue-50 text-blue-800'
                            : showFeedback && option.correct
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <span className="font-medium text-base">{option.id.toUpperCase()})</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-base leading-6 block">{option.text}</span>
                        </div>
                        <div className="flex-shrink-0">
                          {showFeedback && option.correct && (
                            <span className="ml-2 text-green-600 text-lg">✓</span>
                          )}
                          {showFeedback && selectedAnswer === option.id && !option.correct && (
                            <span className="ml-2 text-red-600 text-lg">✗</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Submit Button */}
                  {!showFeedback && selectedAnswer && (
                    <div className="text-center">
                      <button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-purple-400 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 active:scale-95 min-h-[48px] touch-manipulation"
                      >
                        Confirmar Resposta
                      </button>
                    </div>
                  )}

                  {/* Feedback */}
                  {showFeedback && (
                    <div className={`p-4 sm:p-6 rounded-xl ${
                      isCorrect 
                        ? 'bg-green-50 border-l-4 border-green-400' 
                        : 'bg-yellow-50 border-l-4 border-yellow-400'
                    }`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xl sm:text-2xl">
                          {isCorrect ? '🎉' : '💡'}
                        </span>
                        <h3 className="text-base sm:text-lg font-semibold">
                          {isCorrect ? 'Excelente adaptação contextual! +10 pontos' : 'Vamos entender melhor!'}
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {currentEx.explanation}
                      </p>
                    </div>
                  )}

                  {/* Navigation */}
                  {showFeedback && (
                    <div className="flex justify-center">
                      {currentExercise < exercises.length - 1 ? (
                        <button
                          onClick={handleNext}
                          className="bg-gradient-to-r from-purple-400 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 active:scale-95 min-h-[48px] touch-manipulation"
                        >
                          Próximo Exercício →
                        </button>
                      ) : (
                        
                          href="/tea"
                          className="bg-gradient-to-r from-purple-400 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 active:scale-95 min-h-[48px] touch-manipulation inline-block"
                        >
                          Finalizar Atividade ✓
                        </a>
                      )}
                    </div>
                  )}

                  {/* Voltar para Menu durante o jogo */}
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setGameStarted(false)}
                      className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors min-h-[44px] touch-manipulation"
                    >
                      ← Voltar ao Menu
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
