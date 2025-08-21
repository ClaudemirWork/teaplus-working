'use client';

import { useState } from 'react';
import Link from 'next/link'; // Mantido para o Link Final, se necessário
import { GameHeader } from '@/components/GameHeader';
import { Users, Trophy, Gamepad2 } from 'lucide-react';

// Interfaces e dados do exercício permanecem os mesmos
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

export default function TurnTakingPage() {
  // ESTADOS PADRONIZADOS
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
      setGameFinished(true); // Ativa a tela de finalização
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

  // TELA DE RESULTADOS (quando o jogo termina)
  if (gameFinished) {
    return (
      <>
        <GameHeader title="Respeitando a Vez" icon={<Users className="h-6 w-6" />} />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-blue-50">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div className="max-w-2xl text-center">
              <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl">
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-4xl">🏆</div>
                  <h1 className="mb-4 text-4xl font-bold text-gray-900">Atividade Concluída!</h1>
                  <p className="text-xl text-gray-600">Você aprendeu a importância de respeitar a vez dos outros.</p>
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
      <GameHeader title="Respeitando a Vez" icon={<Users className="h-6 w-6" />} showSaveButton={false} />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-blue-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {!gameStarted ? (
            // TELA INICIAL PADRÃO
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:</h3>
                    <p className="text-sm text-gray-600">Desenvolver paciência e a habilidade de esperar a sua vez em filas, jogos e atividades em grupo, entendendo a importância do revezamento.</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Leia cada cenário com atenção.</li>
                      <li>Pense na atitude mais correta e respeitosa.</li>
                      <li>Escolha a alternativa que melhor representa essa atitude.</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                    <p className="text-sm text-gray-600">Cada resposta correta vale 10 pontos. O objetivo é demonstrar compreensão sobre a importância de esperar a vez.</p>
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
