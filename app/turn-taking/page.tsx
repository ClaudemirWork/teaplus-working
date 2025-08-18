'use client';

import Link from 'next/link';
import { useState } from 'react';

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
      
      // Atualizar nível baseado nos pontos
      if (points >= 20 && level === 1) setLevel(2);
      if (points >= 40 && level === 2) setLevel(3);
    }
  };

  const currentExerciseData = exercises[currentExercise];
  const isCorrectAnswer = selectedAnswer && currentExerciseData?.options.find(opt => opt.id === selectedAnswer)?.correct;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-blue-50">
      {/* Header Fixo */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Voltar</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔄</span>
              <div className="text-right">
                <div className="font-bold text-gray-800">Revezamento</div>
                <div className="text-sm text-gray-600">Pontuação Total</div>
              </div>
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-bold">
                {points} pts
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!gameStarted ? (
          // Tela Inicial
          <div className="space-y-8">
            {/* Título */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-6xl">🔄</span>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Revezamento</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Desenvolver paciência e habilidades de esperar a vez através de situações 
                práticas de filas, jogos e atividades em grupo
              </p>
            </div>

            {/* Cards Informativos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Objetivo */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-l-4 border-red-400 p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🎯</span>
                  <h3 className="text-xl font-bold text-red-600">Objetivo:</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Desenvolver paciência e habilidades de esperar a vez através de situações 
                  práticas de filas, jogos e atividades em grupo
                </p>
              </div>

              {/* Pontuação */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-l-4 border-blue-400 p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">👑</span>
                  <h3 className="text-xl font-bold text-blue-600">Pontuação:</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Cada resposta correta = +10 pontos. Você precisa de 50 pontos 
                  para completar a atividade com sucesso
                </p>
              </div>

              {/* Níveis */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-l-4 border-purple-400 p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">📊</span>
                  <h3 className="text-xl font-bold text-purple-600">Níveis:</h3>
                </div>
                <div className="text-gray-700 space-y-1">
                  <p><strong className="text-purple-600">Nível 1:</strong> Filas e espera básica em locais públicos</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> Jogos e atividades com turnos organizados</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> Situações complexas e regras de fairness</p>
                </div>
              </div>

              {/* Final */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-l-4 border-green-400 p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🏁</span>
                  <h3 className="text-xl font-bold text-green-600">Final:</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Complete os 3 níveis com 50 pontos para finalizar a atividade 
                  e dominar as habilidades de revezamento e paciência
                </p>
              </div>
            </div>

            {/* Botão Começar */}
            <div className="text-center">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Começar Atividade
              </button>
            </div>

            {/* Base Científica */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🧠</span>
                <h3 className="text-xl font-bold text-gray-800">Base Científica:</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Este exercício é baseado em princípios de autocontrole e regulação comportamental da terapia ABA 
                para pessoas com TEA. O treino sistemático de habilidades de espera e revezamento desenvolve 
                paciência, tolerância à frustração e competências sociais fundamentais para a convivência em grupo.
              </p>
            </div>
          </div>
        ) : (
          // Conteúdo do Jogo
          <div className="max-w-4xl mx-auto">
            {/* Info do Jogo */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl">🔄</span>
                    <h2 className="text-2xl font-bold text-gray-800">Revezamento</h2>
                  </div>
                  <p className="text-gray-600">
                    Nível {level} | Pontos: {points} | Exercício {currentExercise + 1}/{exercises.length}
                  </p>
                </div>
                
                <button 
                  onClick={() => setGameStarted(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors self-start sm:self-auto"
                >
                  ← Voltar
                </button>
              </div>
            </div>

            {/* Exercício */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                  {currentExerciseData.title}
                </h2>
                
                {!exerciseStarted ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg text-left">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {currentExerciseData.scenario}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleStartExercise}
                      className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      Iniciar Exercício
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-6 text-left">
                      <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        {currentExerciseData.scenario}
                      </p>
                      <p className="text-gray-800 font-semibold text-lg">
                        {currentExerciseData.question}
                      </p>
                    </div>

                    {/* Opções de Resposta - CORRIGIDO APENAS A VISIBILIDADE */}
                    <div className="grid grid-cols-1 gap-4">
                      {currentExerciseData.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleAnswerSelect(option.id)}
                          disabled={showFeedback}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
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
                        className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                      >
                        Confirmar Resposta
                      </button>
                    )}

                    {/* Feedback */}
                    {showFeedback && (
                      <div className={`p-6 rounded-xl ${
                        isCorrectAnswer 
                          ? 'bg-green-50 border-l-4 border-green-400' 
                          : 'bg-yellow-50 border-l-4 border-yellow-400'
                      }`}>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-2xl">
                            {isCorrectAnswer ? '🎉' : '💡'}
                          </span>
                          <h3 className="text-lg font-semibold">
                            {isCorrectAnswer ? 'Muito bem! +10 pontos' : 'Vamos aprender!'}
                          </h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
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
                            className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                          >
                            Próximo Exercício →
                          </button>
                        ) : (
                          <Link
                            href="/dashboard"
                            className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 inline-block"
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
