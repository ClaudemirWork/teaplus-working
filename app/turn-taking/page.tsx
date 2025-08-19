'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function TurnTakingPage() {
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
      title: 'Fila do Parquinho',
      scenario: 'Você está no parque e quer usar o escorregador, mas há uma fila de outras crianças esperando a vez.',
      question: 'Qual é a atitude correta?',
      options: [
        { id: 'a', text: 'Furar a fila porque você está com pressa', correct: false },
        { id: 'b', text: 'Entrar no final da fila e esperar sua vez', correct: true },
        { id: 'c', text: 'Tentar convencer alguém a te deixar passar na frente', correct: false },
        { id: 'd', text: 'Ir embora sem brincar', correct: false }
      ],
      explanation: 'Respeitar a ordem da fila mostra consideração pelos outros e é uma regra importante da convivência social!'
    },
    {
      id: 2,
      title: 'Jogo de Tabuleiro com Amigos',
      scenario: 'Você está jogando um jogo de tabuleiro com seus amigos. É a vez do seu colega jogar, mas ele está demorando para decidir.',
      question: 'Como você deve agir?',
      options: [
        { id: 'a', text: 'Pegar os dados e jogar no lugar dele', correct: false },
        { id: 'b', text: 'Esperar pacientemente e talvez oferecer ajuda se ele pedir', correct: true },
        { id: 'c', text: 'Reclamar que ele está demorando muito', correct: false },
        { id: 'd', text: 'Parar de jogar porque está chato', correct: false }
      ],
      explanation: 'Paciência e respeito pelo tempo dos outros torna os jogos mais divertidos para todos!'
    },
    {
      id: 3,
      title: 'Hora de Falar na Aula',
      scenario: 'Durante uma discussão em sala de aula, vários alunos querem falar ao mesmo tempo, incluindo você.',
      question: 'Qual é a melhor estratégia?',
      options: [
        { id: 'a', text: 'Falar mais alto que os outros para ser ouvido', correct: false },
        { id: 'b', text: 'Levantar a mão e esperar ser chamado pela professora', correct: true },
        { id: 'c', text: 'Interromper quem está falando', correct: false },
        { id: 'd', text: 'Desistir de participar', correct: false }
      ],
      explanation: 'Esperar a vez de falar permite que todos sejam ouvidos e contribuam para a discussão!'
    },
    {
      id: 4,
      title: 'Videogame em Casa de Amigo',
      scenario: 'Você está na casa de um amigo com mais 3 pessoas. Há apenas 2 controles de videogame e todos querem jogar.',
      question: 'Como organizar para todos se divertirem?',
      options: [
        { id: 'a', text: 'Quem chegou primeiro joga até cansar', correct: false },
        { id: 'b', text: 'Estabelecer um tempo limite para cada dupla jogar', correct: true },
        { id: 'c', text: 'Só os donos da casa podem jogar', correct: false },
        { id: 'd', text: 'Brigar para ver quem fica com o controle', correct: false }
      ],
      explanation: 'Organizar turnos justos garante que todos tenham oportunidade de se divertir e mantém a harmonia do grupo!'
    },
    {
      id: 5,
      title: 'Escolhendo a Música na Festa',
      scenario: 'Na festa da escola, há uma playlist colaborativa onde cada pessoa pode escolher uma música. Você já escolheu a sua.',
      question: 'Seu amigo quer que você escolha mais uma música para ele. O que fazer?',
      options: [
        { id: 'a', text: 'Escolher quantas músicas você quiser', correct: false },
        { id: 'b', text: 'Explicar que cada pessoa tem direito a uma música para ser justo', correct: true },
        { id: 'c', text: 'Aceitar e escolher outra música', correct: false },
        { id: 'd', text: 'Remover a música de outra pessoa para colocar a do seu amigo', correct: false }
      ],
      explanation: 'Manter regras justas para todos evita conflitos e garante que cada pessoa seja respeitada igualmente!'
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
      
      if (points >= 20 && level === 1) setLevel(2);
      if (points >= 40 && level === 2) setLevel(3);
    }
  };

  const currentExerciseData = exercises[currentExercise];
  const isCorrectAnswer = selectedAnswer && currentExerciseData?.options.find(opt => opt.id === selectedAnswer)?.correct;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-blue-50">
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/dashboard" 
              className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
              🔄
              <span>Respeitando a Vez</span>
            </h1>
            <div className="text-right w-24">
              <div className="text-xs text-gray-500">Pontuação</div>
              <div className="text-xl font-bold text-orange-600">{points}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!gameStarted ? (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">Respeitando a Vez</h1>
              <p className="text-xl text-gray-600">Aprenda a importância de esperar e revezar em diferentes situações.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-l-4 border-red-400 p-6 shadow-lg">
              <h3 className="text-xl font-bold text-red-600 mb-2">🎯 Objetivo:</h3>
              <p className="text-gray-700">Desenvolver paciência e habilidades de esperar a vez em filas, jogos e atividades em grupo.</p>
            </div>
            <div className="text-center">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-transform transform hover:scale-105"
              >
                Começar Atividade
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">{currentExerciseData.title}</h2>
              
              {!exerciseStarted ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg text-left">
                    <p className="text-gray-700 text-lg">{currentExerciseData.scenario}</p>
                  </div>
                  <button onClick={handleStartExercise} className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg">
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
                      <div className="flex justify-center">
                        {currentExercise < exercises.length - 1 ? (
                          <button onClick={handleNextExercise} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600">
                            Próximo Exercício →
                          </button>
                        ) : (
                          <Link href="/dashboard" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 inline-block">
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
  );
}
