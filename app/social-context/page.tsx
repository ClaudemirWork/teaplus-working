'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, MessageCircle, Home, Book, Target, Star } from 'lucide-react';

// Dados dos exercícios
const exercises = [
  {
    id: 1,
    title: "Situação: Na escola - Hora do recreio",
    description: "João vê um grupo de colegas brincando de futebol no pátio. Ele gostaria de participar da brincadeira.",
    image: "⚽",
    situation: "playground",
    question: "Qual seria a melhor forma de João se juntar à brincadeira?",
    options: [
      {
        id: 'a',
        text: "Entrar no campo e começar a jogar sem falar nada",
        feedback: "Isso pode incomodar os outros jogadores. É melhor perguntar primeiro.",
        correct: false
      },
      {
        id: 'b',
        text: "Perguntar: 'Posso jogar com vocês?'",
        feedback: "Excelente! Pedir permissão mostra respeito e educação.",
        correct: true
      },
      {
        id: 'c',
        text: "Ficar esperando alguém chamá-lo",
        feedback: "Às vezes é bom tomar iniciativa. Perguntar educadamente funciona melhor.",
        correct: false
      },
      {
        id: 'd',
        text: "Gritar para chamar atenção dos colegas",
        feedback: "Gritar não é apropriado. Uma abordagem mais calma é melhor.",
        correct: false
      }
    ]
  },
  {
    id: 2,
    title: "Situação: Em casa - Jantar em família",
    description: "Durante o jantar, Maria quer contar sobre algo interessante que aconteceu na escola, mas seus pais estão conversando.",
    image: "🍽️",
    situation: "family_dinner",
    question: "Como Maria deveria agir nesta situação?",
    options: [
      {
        id: 'a',
        text: "Interromper a conversa falando alto",
        feedback: "Interromper não é educado. É melhor esperar uma pausa.",
        correct: false
      },
      {
        id: 'b',
        text: "Esperar uma pausa na conversa e dizer 'Com licença, posso contar algo?'",
        feedback: "Perfeito! Esperar uma pausa e pedir licença mostra boas maneiras.",
        correct: true
      },
      {
        id: 'c',
        text: "Sair da mesa sem falar nada",
        feedback: "Não é necessário sair. É melhor aguardar o momento certo para falar.",
        correct: false
      },
      {
        id: 'd',
        text: "Continuar falando mesmo se ninguém estiver prestando atenção",
        feedback: "Se ninguém está prestando atenção, é melhor aguardar o momento adequado.",
        correct: false
      }
    ]
  },
  {
    id: 3,
    title: "Situação: Na loja - Pedindo ajuda",
    description: "Pedro está em uma loja com sua mãe e não consegue encontrar um brinquedo que quer comprar.",
    image: "🏪",
    situation: "store",
    question: "Qual a melhor maneira de Pedro pedir ajuda?",
    options: [
      {
        id: 'a',
        text: "Procurar um funcionário e perguntar educadamente onde encontrar o brinquedo",
        feedback: "Excelente! Pedir ajuda educadamente aos funcionários é apropriado.",
        correct: true
      },
      {
        id: 'b',
        text: "Mexer em todos os produtos até encontrar",
        feedback: "Mexer em tudo pode bagunçar a loja. É melhor pedir ajuda.",
        correct: false
      },
      {
        id: 'c',
        text: "Gritar 'Mãe, não acho!' bem alto",
        feedback: "Gritar em público não é apropriado. Falar em tom normal é melhor.",
        correct: false
      },
      {
        id: 'd',
        text: "Desistir e sair da loja chateado",
        feedback: "Não precisa desistir! Pedir ajuda pode resolver o problema.",
        correct: false
      }
    ]
  },
  {
    id: 4,
    title: "Situação: Na sala de aula - Trabalho em grupo",
    description: "Ana foi escolhida para fazer um trabalho em grupo, mas tem uma ideia diferente dos colegas sobre como fazer.",
    image: "📚",
    situation: "classroom",
    question: "Como Ana deveria expressar sua ideia?",
    options: [
      {
        id: 'a',
        text: "Insistir que sua ideia é a melhor e que os outros estão errados",
        feedback: "Insistir não ajuda o trabalho em equipe. É melhor explicar a ideia calmamente.",
        correct: false
      },
      {
        id: 'b',
        text: "Não falar nada e aceitar as ideias dos outros sem contribuir",
        feedback: "Sua contribuição é importante! Compartilhar ideias enriquece o trabalho.",
        correct: false
      },
      {
        id: 'c',
        text: "Dizer: 'Eu tenho uma ideia diferente, posso compartilhar?'",
        feedback: "Perfeito! Pedir para compartilhar sua ideia mostra respeito e colaboração.",
        correct: true
      },
      {
        id: 'd',
        text: "Fazer o trabalho sozinha do seu jeito",
        feedback: "Trabalho em grupo requer colaboração. É melhor discutir as ideias juntos.",
        correct: false
      }
    ]
  },
  {
    id: 5,
    title: "Situação: Festa de aniversário - Chegada",
    description: "Carlos chega à festa de aniversário de um colega e vê muitas pessoas que não conhece bem.",
    image: "🎉",
    situation: "party",
    question: "Qual seria uma boa forma de Carlos se integrar à festa?",
    options: [
      {
        id: 'a',
        text: "Ficar num canto sozinho o tempo todo",
        feedback: "Ficar sozinho não ajuda a se integrar. Tente uma abordagem mais social.",
        correct: false
      },
      {
        id: 'b',
        text: "Cumprimentar o aniversariante e se apresentar para algumas pessoas",
        feedback: "Excelente! Cumprimentar o aniversariante e se apresentar é muito apropriado.",
        correct: true
      },
      {
        id: 'c',
        text: "Criticar a decoração ou a comida da festa",
        feedback: "Críticas em festas são inadequadas. É melhor focar nos aspectos positivos.",
        correct: false
      },
      {
        id: 'd',
        text: "Tentar ser o centro das atenções o tempo todo",
        feedback: "A festa é do aniversariante. É melhor ser sociável sem exagerar.",
        correct: false
      }
    ]
  }
];

export default function SocialContextPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [showAllFeedback, setShowAllFeedback] = useState(false);

  const currentEx = exercises[currentExercise];
  const progress = ((currentExercise + 1) / exercises.length) * 100;

  useEffect(() => {
    setSelectedAnswer('');
    setShowFeedback(false);
    setShowAllFeedback(false);
  }, [currentExercise]);

  const handleAnswerSelect = (answerId: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerId);
    setShowFeedback(true);
    setShowAllFeedback(true);

    const isCorrect = currentEx.options.find(opt => opt.id === answerId)?.correct;
    if (isCorrect && !completedExercises.includes(currentEx.id)) {
      setScore(score + 20);
      setCompletedExercises([...completedExercises, currentEx.id]);
    }
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const handleReset = () => {
    setCurrentExercise(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setShowAllFeedback(false);
    setScore(0);
    setCompletedExercises([]);
  };

  const isCorrect = selectedAnswer && currentEx.options.find(opt => opt.id === selectedAnswer)?.correct;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Voltar</span>
              </Link>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-purple-600" />
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                  Contexto Social
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-700 text-sm">{score}</span>
              </div>
              <button
                onClick={handleReset}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Reiniciar"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Barra de Progresso */}
          <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Exercício {currentExercise + 1} de {exercises.length}</span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          {/* Header do Exercício */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
              <span className="text-4xl" role="img" aria-label="Situação">
                {currentEx.image}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentEx.title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              {currentEx.description}
            </p>
          </div>

          {/* Pergunta */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">?</span>
              </div>
              <h3 className="text-lg font-semibold text-blue-800">
                Pergunta:
              </h3>
            </div>
            <p className="text-blue-700 text-lg pl-11">
              {currentEx.question}
            </p>
          </div>

          {/* Opções de Resposta */}
          <div className="space-y-4 mb-8">
            {currentEx.options.map((option, index) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrectOption = option.correct;
              const shouldShowFeedback = showAllFeedback;
              
              let buttonStyle = "border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50";
              let iconColor = "text-gray-400";
              let icon = null;
              
              if (shouldShowFeedback) {
                if (isCorrectOption) {
                  buttonStyle = "border-2 border-green-500 bg-green-50";
                  iconColor = "text-green-600";
                  icon = <CheckCircle2 className={`w-6 h-6 ${iconColor}`} />;
                } else if (isSelected && !isCorrectOption) {
                  buttonStyle = "border-2 border-red-500 bg-red-50";
                  iconColor = "text-red-600";
                  icon = <XCircle className={`w-6 h-6 ${iconColor}`} />;
                }
              } else if (isSelected) {
                buttonStyle = "border-2 border-purple-500 bg-purple-50";
                iconColor = "text-purple-600";
              }

              return (
                <div key={option.id} className="space-y-3">
                  <button
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={showFeedback}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${buttonStyle} ${
                      showFeedback ? 'cursor-default' : 'cursor-pointer hover:shadow-md active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
                        {icon || (
                          <span className={`font-bold ${iconColor}`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-800 font-medium leading-relaxed">
                        {option.text}
                      </span>
                    </div>
                  </button>

                  {/* Balão de Feedback - SEMPRE VISÍVEL quando showAllFeedback for true */}
                  {shouldShowFeedback && (
                    <div className={`ml-12 p-4 rounded-lg border-l-4 animate-fade-in ${
                      isCorrectOption 
                        ? 'bg-green-50 border-green-400' 
                        : isSelected 
                          ? 'bg-red-50 border-red-400'
                          : 'bg-gray-50 border-gray-300'
                    }`}>
                      <div className="flex items-start gap-2">
                        <MessageCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          isCorrectOption 
                            ? 'text-green-600' 
                            : isSelected 
                              ? 'text-red-600'
                              : 'text-gray-500'
                        }`} />
                        <p className={`text-sm leading-relaxed ${
                          isCorrectOption 
                            ? 'text-green-700' 
                            : isSelected 
                              ? 'text-red-700'
                              : 'text-gray-600'
                        }`}>
                          {option.feedback}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Botões de Navegação */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentExercise === 0}
              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            >
              Anterior
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {showFeedback && isCorrect ? (
                  <span className="text-green-600 font-medium">✓ Resposta correta!</span>
                ) : showFeedback && !isCorrect ? (
                  <span className="text-red-600 font-medium">✗ Tente novamente na próxima vez!</span>
                ) : (
                  'Selecione uma opção'
                )}
              </p>
            </div>

            <button
              onClick={handleNext}
              disabled={currentExercise === exercises.length - 1}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
            >
              {currentExercise === exercises.length - 1 ? 'Finalizar' : 'Próximo'}
            </button>
          </div>
        </div>

        {/* Navegação Rápida */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Navegação Rápida
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {exercises.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentExercise(index)}
                className={`aspect-square rounded-lg font-semibold transition-all duration-200 ${
                  index === currentExercise
                    ? 'bg-purple-600 text-white shadow-lg'
                    : completedExercises.includes(exercises[index].id)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CSS para animações */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
