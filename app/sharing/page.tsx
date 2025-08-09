'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SharingPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);

  const exercises = [
    {
      id: 1,
      title: 'Compartilhando Brinquedos',
      scenario: 'Você está brincando com um carrinho muito legal. Seu amigo se aproxima e quer brincar também.',
      question: 'O que você deve fazer?',
      options: [
        { id: 'a', text: 'Guardar o carrinho e não deixar ninguém brincar', correct: false },
        { id: 'b', text: 'Oferecer para brincar juntos ou revezar', correct: true },
        { id: 'c', text: 'Ignorar o amigo e continuar brincando sozinho', correct: false },
        { id: 'd', text: 'Esconder o brinquedo', correct: false }
      ],
      explanation: 'Compartilhar brinquedos fortalece amizades e torna a brincadeira mais divertida para todos!'
    },
    {
      id: 2,
      title: 'Dividindo um Lanche',
      scenario: 'Você trouxe biscoitos deliciosos para o lanche. Seus colegas estão olhando com vontade.',
      question: 'Como você pode compartilhar?',
      options: [
        { id: 'a', text: 'Comer todos os biscoitos rapidamente', correct: false },
        { id: 'b', text: 'Oferecer alguns biscoitos para os colegas', correct: true },
        { id: 'c', text: 'Esconder os biscoitos na mochila', correct: false },
        { id: 'd', text: 'Comer apenas na frente dos outros', correct: false }
      ],
      explanation: 'Compartilhar comida é um gesto de gentileza que demonstra cuidado com os outros!'
    },
    {
      id: 3,
      title: 'Emprestando Material Escolar',
      scenario: 'Seu colega esqueceu o lápis de cor e precisa para fazer a atividade. Você tem vários.',
      question: 'Qual é a melhor atitude?',
      options: [
        { id: 'a', text: 'Fingir que não tem lápis de cor', correct: false },
        { id: 'b', text: 'Emprestar alguns lápis de cor', correct: true },
        { id: 'c', text: 'Falar que ele deveria ter trazido', correct: false },
        { id: 'd', text: 'Usar todos os lápis ao mesmo tempo', correct: false }
      ],
      explanation: 'Ajudar os colegas emprestando material mostra que você é uma pessoa colaborativa!'
    },
    {
      id: 4,
      title: 'Compartilhando Espaço',
      scenario: 'No recreio, você está em um local legal para brincar. Outros colegas querem usar o mesmo espaço.',
      question: 'Como resolver essa situação?',
      options: [
        { id: 'a', text: 'Dizer que chegou primeiro e o espaço é seu', correct: false },
        { id: 'b', text: 'Convidar para brincar juntos no espaço', correct: true },
        { id: 'c', text: 'Sair do local chateado', correct: false },
        { id: 'd', text: 'Ignorar os outros colegas', correct: false }
      ],
      explanation: 'Compartilhar espaços permite que todos se divirtam e façam novos amigos!'
    },
    {
      id: 5,
      title: 'Dividindo Atenção',
      scenario: 'Você está contando uma história interessante. Outro colega também quer contar sua história.',
      question: 'O que fazer para compartilhar a atenção?',
      options: [
        { id: 'a', text: 'Continuar falando sem parar', correct: false },
        { id: 'b', text: 'Terminar sua história e dar a vez para o colega', correct: true },
        { id: 'c', text: 'Falar mais alto que o colega', correct: false },
        { id: 'd', text: 'Parar de falar e ficar chateado', correct: false }
      ],
      explanation: 'Dar a vez para outros falarem mostra respeito e interesse pelas pessoas ao nosso redor!'
    }
  ];

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentExercise(0);
    setPoints(0);
    setLevel(1);
    setExerciseStarted(false);
  };

  const handleStartExercise = () => {
    setExerciseStarted(true);
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    setShowFeedback(true);
    const isCorrect = exercises[currentExercise].options.find(opt => opt.id === selectedAnswer)?.correct;
    
    if (isCorrect) {
      setPoints(points + 10);
    }
  };

  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setExerciseStarted(false);
      setSelectedAnswer('');
      setShowFeedback(false);
      
      // Atualizar nível baseado nos pontos
      if (points >= 20 && level === 1) setLevel(2);
      if (points >= 40 && level === 2) setLevel(3);
    }
  };

  const currentExerciseData = exercises[currentExercise];
  const isCorrectAnswer = selectedAnswer && currentExerciseData?.options.find(opt => opt.id === selectedAnswer)?.correct;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      {/* Header Fixo - MELHORADO PARA MOBILE */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link 
              href="/tea" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium text-sm sm:text-base">Voltar para TEA</span>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xl sm:text-2xl">🤝</span>
              <div className="text-right">
                <div className="font-bold text-gray-800 text-sm sm:text-base">Compartilhamento</div>
                <div className="text-xs sm:text-sm text-gray-600">Pontuação Total</div>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 sm:px-3 rounded-full font-bold text-sm">
                {points} pts
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal - PADDING RESPONSIVO MELHORADO */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {!gameStarted ? (
          // Tela Inicial - LAYOUT MOBILE OTIMIZADO
          <div className="space-y-6 sm:space-y-8">
            {/* Título - RESPONSIVO COM CLAMP */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
                <span style={{ fontSize: 'clamp(3rem, 8vw, 4rem)' }}>🤝</span>
                <h1 style={{ 
                  fontSize: 'clamp(2rem, 6vw, 3rem)', 
                  fontWeight: 'bold',
                  color: '#1f2937',
                  lineHeight: '1.2',
                  textAlign: 'center'
                }}>
                  Compartilhamento
                </h1>
              </div>
              <p style={{ 
                fontSize: 'clamp(1rem, 3.5vw, 1.25rem)', 
                color: '#4b5563',
                lineHeight: '1.6',
                padding: '0 1rem',
                maxWidth: '48rem',
                margin: '0 auto'
              }}>
                Praticar habilidades de compartilhamento através de situações do dia a dia, 
                aprendendo a dividir brinquedos, espaços e atenção de forma positiva
              </p>
            </div>

            {/* Cards Informativos - GRID RESPONSIVO MELHORADO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Objetivo */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-l-4 border-red-400 p-4 sm:p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }} className="mr-3">🎯</span>
                  <h3 style={{ 
                    fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
                    fontWeight: 'bold', 
                    color: '#dc2626' 
                  }}>
                    Objetivo:
                  </h3>
                </div>
                <p style={{ 
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
                  color: '#374151',
                  lineHeight: '1.6'
                }}>
                  Praticar habilidades de compartilhamento através de situações do dia a dia, 
                  aprendendo a dividir brinquedos, espaços e atenção de forma positiva
                </p>
              </div>

              {/* Pontuação */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-l-4 border-blue-400 p-4 sm:p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }} className="mr-3">👑</span>
                  <h3 style={{ 
                    fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
                    fontWeight: 'bold', 
                    color: '#2563eb' 
                  }}>
                    Pontuação:
                  </h3>
                </div>
                <p style={{ 
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
                  color: '#374151',
                  lineHeight: '1.6'
                }}>
                  Cada resposta correta = +10 pontos. Você precisa de 50 pontos 
                  para completar a atividade com sucesso
                </p>
              </div>

              {/* Níveis */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-l-4 border-purple-400 p-4 sm:p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }} className="mr-3">📊</span>
                  <h3 style={{ 
                    fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
                    fontWeight: 'bold', 
                    color: '#7c3aed' 
                  }}>
                    Níveis:
                  </h3>
                </div>
                <div className="space-y-1">
                  <p style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', color: '#374151' }}>
                    <strong className="text-purple-600">Nível 1:</strong> Situações básicas de compartilhamento
                  </p>
                  <p style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', color: '#374151' }}>
                    <strong className="text-purple-600">Nível 2:</strong> Cenários de grupo e cooperação
                  </p>
                  <p style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', color: '#374151' }}>
                    <strong className="text-purple-600">Nível 3:</strong> Resolução de conflitos de compartilhamento
                  </p>
                </div>
              </div>

              {/* Final */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-l-4 border-green-400 p-4 sm:p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }} className="mr-3">🏁</span>
                  <h3 style={{ 
                    fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
                    fontWeight: 'bold', 
                    color: '#059669' 
                  }}>
                    Final:
                  </h3>
                </div>
                <p style={{ 
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
                  color: '#374151',
                  lineHeight: '1.6'
                }}>
                  Complete os 3 níveis com 50 pontos para finalizar a atividade 
                  e desenvolver suas habilidades de compartilhamento
                </p>
              </div>
            </div>

            {/* Botão Começar - RESPONSIVO */}
            <div className="text-center">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 min-h-[48px] touch-manipulation"
                style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}
              >
                Começar Atividade
              </button>
            </div>

            {/* Base Científica - LAYOUT RESPONSIVO */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }} className="mr-3">🧠</span>
                <h3 style={{ 
                  fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', 
                  fontWeight: 'bold', 
                  color: '#1f2937' 
                }}>
                  Base Científica:
                </h3>
              </div>
              <p style={{ 
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
                color: '#374151',
                lineHeight: '1.6'
              }}>
                Este exercício é baseado em terapias ABA (Applied Behavior Analysis) para desenvolvimento 
                de habilidades de compartilhamento em pessoas com TEA e outras necessidades especiais. 
                O treino sistemático de situações sociais aumenta a capacidade de cooperação e interação positiva.
              </p>
            </div>
          </div>
        ) : (
          // Conteúdo do Jogo - LAYOUT MOBILE OTIMIZADO
          <div className="max-w-4xl mx-auto">
            {/* Info do Jogo - RESPONSIVO */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>🤝</span>
                    <h2 style={{ 
                      fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      Compartilhamento
                    </h2>
                  </div>
                  <p style={{ 
                    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
                    color: '#4b5563'
                  }}>
                    Nível {level} | Pontos: {points} | Exercício {currentExercise + 1}/{exercises.length}
                  </p>
                </div>
                
                <button 
                  onClick={() => setGameStarted(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors self-start sm:self-auto min-h-[44px] touch-manipulation"
                  style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
                >
                  ← Voltar
                </button>
              </div>
            </div>

            {/* Exercício - CONTAINER COM ALTURA DINÂMICA */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 min-h-[60vh]">
              <div className="text-center">
                <h2 style={{ 
                  fontSize: 'clamp(1.25rem, 4vw, 2rem)', 
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: 'clamp(1.5rem, 4vw, 3rem)',
                  lineHeight: '1.3'
                }}>
                  {currentExerciseData.title}
                </h2>
                
                {!exerciseStarted ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg text-left">
                      <p style={{ 
                        fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                        color: '#374151',
                        lineHeight: '1.6'
                      }}>
                        {currentExerciseData.scenario}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleStartExercise}
                      className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 min-h-[48px] touch-manipulation"
                      style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}
                    >
                      Iniciar Exercício
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 text-left">
                      <p style={{ 
                        fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                        color: '#374151',
                        lineHeight: '1.6',
                        marginBottom: '1rem'
                      }}>
                        {currentExerciseData.scenario}
                      </p>
                      <p style={{ 
                        fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                        color: '#1f2937',
                        fontWeight: '600'
                      }}>
                        {currentExerciseData.question}
                      </p>
                    </div>

                    {/* Opções de Resposta - CORRIGIDO APENAS A VISIBILIDADE */}
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {currentExerciseData.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleAnswerSelect(option.id)}
                          disabled={showFeedback}
                          className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 min-h-[60px] touch-manipulation ${
                            selectedAnswer === option.id
                              ? showFeedback
                                ? option.correct
                                  ? 'border-green-500 bg-green-50 text-green-800'
                                  : 'border-red-500 bg-red-50 text-red-800'
                                : 'border-blue-500 bg-blue-50 text-blue-800'
                              : showFeedback && option.correct
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 bg-white'
                          }`}
                          style={{ 
                            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                            lineHeight: '1.5'
                          }}
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
                        onClick={handleSubmitAnswer}
                        className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 min-h-[48px] touch-manipulation"
                        style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}
                      >
                        Confirmar Resposta
                      </button>
                    )}

                    {/* Feedback - RESPONSIVO */}
                    {showFeedback && (
                      <div className={`p-4 sm:p-6 rounded-xl ${
                        isCorrectAnswer 
                          ? 'bg-green-50 border-l-4 border-green-400' 
                          : 'bg-yellow-50 border-l-4 border-yellow-400'
                      }`}>
                        <div className="flex items-center space-x-2 mb-3">
                          <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                            {isCorrectAnswer ? '🎉' : '💡'}
                          </span>
                          <h3 style={{ 
                            fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                            fontWeight: '600'
                          }}>
                            {isCorrectAnswer ? 'Muito bem! +10 pontos' : 'Vamos aprender!'}
                          </h3>
                        </div>
                        <p style={{ 
                          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
                          color: '#374151',
                          lineHeight: '1.6'
                        }}>
                          {currentExerciseData.explanation}
                        </p>
                      </div>
                    )}

                    {/* Navegação */}
                    {showFeedback && (
                      <div className="flex justify-center">
                        {currentExercise < exercises.length - 1 ? (
                          <button
                            onClick={handleNextExercise}
                            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 min-h-[48px] touch-manipulation"
                            style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}
                          >
                            Próximo Exercício →
                          </button>
                        ) : (
                          <Link
                            href="/tea"
                            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 inline-block min-h-[48px] touch-manipulation flex items-center"
                            style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)' }}
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
          </div>
        )}
      </main>
    </div>
  );
}
