'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GameHeader } from '@/components/GameHeader';
import { Milestone, Trophy, Gamepad2 } from 'lucide-react';

// Interfaces e dados do exercício
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

export default function SocialContextPage() {
  // Estados padronizados
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  
  // Estados internos do jogo
  const [currentExercise, setCurrentExercise] = useState(0);
  const [points, setPoints] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const exercises: Exercise[] = [
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
    setGameFinished(false);
  };

  const handleStartExercise = () => { setExerciseStarted(true); setSelectedAnswer(''); setShowFeedback(false); };
  const handleAnswerSelect = (answerId: string) => { setSelectedAnswer(answerId); };
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
      setGameFinished(true);
    }
  };
  
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

  // TELA DE RESULTADOS
  if (gameFinished) {
    return (
      <>
        <GameHeader title="Contexto Social" icon={<Milestone className="h-6 w-6" />} />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div className="max-w-2xl text-center">
              <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl">
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-4xl">🏆</div>
                  <h1 className="mb-4 text-4xl font-bold text-gray-900">Atividade Concluída!</h1>
                  <p className="text-xl text-gray-600">Você se tornou um mestre em adaptar-se a diferentes contextos sociais.</p>
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

  // TELA INICIAL E JOGO
  return (
    <>
      <GameHeader title="Contexto Social" icon={<Milestone className="h-6 w-6" />} showSaveButton={false} />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {!gameStarted ? (
            // TELA INICIAL PADRÃO
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:</h3>
                    <p className="text-sm text-gray-600">Compreender como diferentes contextos (escola, festa, etc.) exigem adaptações no comportamento, linguagem e vestimenta.</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Leia o cenário que descreve uma situação social.</li>
                      <li>Analise o comportamento da pessoa no contexto.</li>
                      <li>Escolha a melhor explicação para a situação.</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                    <p className="text-sm text-gray-600">Cada interpretação correta do contexto vale 10 pontos, aprimorando sua flexibilidade e inteligência social.</p>
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
            // LAYOUT DO JOGO (lógica interna preservada)
            <div className="bg-white rounded-xl sm:rounded-3xl shadow-xl p-4 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">{currentEx.title}</h2>
                {!exerciseStarted ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg">
                      <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{currentEx.scenario}</p>
                    </div>
                    <button onClick={handleStartExercise} className="bg-gradient-to-r from-purple-400 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 min-h-[48px] touch-manipulation">
                      Iniciar Exercício
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
                      <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">{currentEx.scenario}</p>
                      <p className="text-gray-800 font-semibold text-base sm:text-lg">{currentEx.question}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {currentEx.options.map((option) => (
                        <button key={option.id} onClick={() => handleAnswerSelect(option.id)} disabled={showFeedback} className={`w-full p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 min-h-[48px] touch-manipulation flex items-center ${selectedAnswer === option.id ? showFeedback ? option.correct ? 'border-green-500 bg-green-50 text-green-800' : 'border-red-500 bg-red-50 text-red-800' : 'border-blue-500 bg-blue-50 text-blue-800' : showFeedback && option.correct ? 'border-green-500 bg-green-50 text-green-800' : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100'}`}>
                          <div className="w-full">
                            <span className="font-medium text-sm sm:text-base">{option.id.toUpperCase()}) </span>
                            <span className="text-sm sm:text-base">{option.text}</span>
                            {showFeedback && option.correct && (<span className="ml-2 text-green-600">✓</span>)}
                            {showFeedback && selectedAnswer === option.id && !option.correct && (<span className="ml-2 text-red-600">✗</span>)}
                          </div>
                        </button>
                      ))}
                    </div>
                    {!showFeedback && selectedAnswer && (
                      <div className="text-center">
                        <button onClick={handleSubmit} className="bg-gradient-to-r from-purple-400 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 active:scale-95 min-h-[48px] touch-manipulation">
                          Confirmar Resposta
                        </button>
                      </div>
                    )}
                    {showFeedback && (
                      <>
                        <div className={`p-4 sm:p-6 rounded-xl ${isCorrect ? 'bg-green-50 border-l-4 border-green-400' : 'bg-yellow-50 border-l-4 border-yellow-400'}`}>
                          <div className="flex items-center space-x-2 mb-3">
                            <h3 className="text-base sm:text-lg font-semibold">{isCorrect ? '🎉 Excelente adaptação contextual! +10 pontos' : '💡 Vamos entender melhor!'}</h3>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{currentEx.explanation}</p>
                        </div>
                        <div className="flex justify-center mt-4">
                          {currentExercise < exercises.length - 1 ? (
                            <button onClick={handleNext} className="bg-gradient-to-r from-purple-400 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 active:scale-95 min-h-[48px] touch-manipulation">
                              Próximo Exercício →
                            </button>
                          ) : (
                            <button onClick={() => setGameFinished(true)} className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors">
                              Ver Resultados Finais ✓
                            </button>
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
