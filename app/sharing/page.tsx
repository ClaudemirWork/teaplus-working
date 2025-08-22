'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GameHeader } from '@/components/GameHeader';
import { Gift, Trophy, Gamepad2 } from 'lucide-react';

// Interfaces e dados do exercício
interface Option {
  id: string;
  text: string;
  correct: boolean;
}

interface Exercise {
  id: number;
  title: string;
  scenario: string;
  question: string;
  options: Option[];
  explanation: string;
}

export default function SharingPage() {
  // Estados padronizados
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  // Estados internos do jogo
  const [currentExercise, setCurrentExercise] = useState(0);
  const [points, setPoints] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);

  const exercises: Exercise[] = [
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

  const currentExerciseData = exercises[currentExercise];

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

  const isCorrectAnswer = selectedAnswer && currentExerciseData?.options.find(opt => opt.id === selectedAnswer)?.correct;

  // TELA DE RESULTADOS
  if (gameFinished) {
    return (
      <>
        <GameHeader title="Compartilhando" icon={<Gift className="h-6 w-6" />} />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div className="max-w-2xl text-center">
              <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl">
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-4xl">🏆</div>
                  <h1 className="mb-4 text-4xl font-bold text-gray-900">Atividade Concluída!</h1>
                  <p className="text-xl text-gray-600">Você praticou a importante habilidade de compartilhar.</p>
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
      <GameHeader title="Compartilhando" icon={<Gift className="h-6 w-6" />} showSaveButton={false} />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {!gameStarted ? (
            // TELA INICIAL PADRÃO
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:</h3>
                    <p className="text-sm text-gray-600">Praticar e entender a importância de compartilhar brinquedos, lanches, espaços e a atenção em diversas situações sociais.</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Leia cada cenário sobre compartilhar.</li>
                      <li>Escolha a atitude mais generosa e colaborativa.</li>
                      <li>Aprenda porque compartilhar é importante.</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                    <p className="text-sm text-gray-600">Cada atitude correta de compartilhamento vale 10 pontos. O objetivo é fortalecer a empatia e a convivência.</p>
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                <span>Exercício {currentExercise + 1}/{exercises.length}</span>
                <span>Pontos: {points}</span>
              </div>
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">{currentExerciseData.title}</h2>
                {!exerciseStarted ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg text-left">
                      <p className="text-gray-700 text-lg">{currentExerciseData.scenario}</p>
                    </div>
                    <button onClick={handleStartExercise} className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg">
                      Iniciar Exercício
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-6 text-left">
                      <p className="text-gray-700 text-lg mb-4">{currentExerciseData.scenario}</p>
                      <p className="text-gray-800 font-semibold text-lg">{currentExerciseData.question}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {currentExerciseData.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleAnswerSelect(option.id)}
                          disabled={showFeedback}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selectedAnswer === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="font-medium">{option.id.toUpperCase()}) </span>
                          {option.text}
                        </button>
                      ))}
                    </div>
                    {!showFeedback && selectedAnswer && (
                      <button onClick={handleSubmitAnswer} className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 w-full sm:w-auto">
                        Confirmar Resposta
                      </button>
                    )}
                    {showFeedback && (
                      <>
                        <div className={`p-6 rounded-xl ${isCorrectAnswer ? 'bg-green-50 border-green-400' : 'bg-yellow-50 border-yellow-400'} border-l-4`}>
                          <h3 className="text-lg font-semibold mb-2">{isCorrectAnswer ? '🎉 Muito bem! +10 pontos' : '💡 Vamos aprender!'}</h3>
                          <p className="text-gray-700">{currentExerciseData.explanation}</p>
                        </div>
                        <div className="flex justify-center mt-4">
                          {currentExercise < exercises.length - 1 ? (
                            <button onClick={handleNextExercise} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600">
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
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
