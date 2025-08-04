'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function TeamworkPage() {
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
      title: 'Montando um Quebra-cabeças em Grupo',
      scenario: 'Você e seus colegas estão montando um quebra-cabeças de 100 peças. Cada um tem algumas peças diferentes.',
      question: 'Qual é a melhor estratégia para trabalhar em equipe?',
      options: [
        { id: 'a', text: 'Cada um monta sua parte separadamente', correct: false },
        { id: 'b', text: 'Compartilhar peças e ajudar uns aos outros', correct: true },
        { id: 'c', text: 'Competir para ver quem monta mais rápido', correct: false },
        { id: 'd', text: 'Desistir se não encontrar suas peças', correct: false }
      ],
      explanation: 'Trabalhar em equipe significa colaborar, compartilhar recursos e ajudar uns aos outros para alcançar um objetivo comum!'
    },
    {
      id: 2,
      title: 'Preparando uma Apresentação Escolar',
      scenario: 'Sua turma precisa fazer uma apresentação sobre animais. Cada pessoa tem uma tarefa diferente: pesquisar, desenhar, falar.',
      question: 'Como garantir que o trabalho em equipe seja eficiente?',
      options: [
        { id: 'a', text: 'Fazer tudo sozinho para ter controle', correct: false },
        { id: 'b', text: 'Combinar prazos e ajudar quem estiver com dificuldade', correct: true },
        { id: 'c', text: 'Deixar cada um fazer sua parte sem se comunicar', correct: false },
        { id: 'd', text: 'Criticar o trabalho dos outros', correct: false }
      ],
      explanation: 'Comunicação clara, prazos definidos e apoio mútuo são fundamentais para o sucesso de qualquer equipe!'
    },
    {
      id: 3,
      title: 'Organizando uma Festa da Turma',
      scenario: 'A turma decidiu fazer uma festa de final de ano. Há muitas tarefas: decoração, comida, música, jogos.',
      question: 'Como organizar as tarefas em equipe?',
      options: [
        { id: 'a', text: 'Uma pessoa decide tudo pelos outros', correct: false },
        { id: 'b', text: 'Dividir tarefas baseado nos interesses e habilidades de cada um', correct: true },
        { id: 'c', text: 'Todos fazem tudo ao mesmo tempo', correct: false },
        { id: 'd', text: 'Deixar para a última hora', correct: false }
      ],
      explanation: 'Distribuir tarefas considerando os pontos fortes de cada pessoa maximiza a eficiência e satisfação da equipe!'
    },
    {
      id: 4,
      title: 'Resolvendo um Conflito na Equipe',
      scenario: 'Durante um projeto em grupo, dois colegas discordam sobre qual ideia usar. A tensão está aumentando.',
      question: 'Qual é a melhor forma de mediar essa situação?',
      options: [
        { id: 'a', text: 'Ignorar o conflito e esperar passar', correct: false },
        { id: 'b', text: 'Ouvir ambos os lados e buscar uma solução conjunta', correct: true },
        { id: 'c', text: 'Escolher um lado e apoiar apenas ele', correct: false },
        { id: 'd', text: 'Desistir do projeto', correct: false }
      ],
      explanation: 'Conflitos são naturais em equipes. O importante é ouvir, respeitar diferentes opiniões e encontrar soluções que beneficiem todos!'
    },
    {
      id: 5,
      title: 'Celebrando o Sucesso da Equipe',
      scenario: 'Sua equipe completou com sucesso um projeto desafiador. Todos contribuíram de formas diferentes.',
      question: 'Como celebrar de forma que valorize todo mundo?',
      options: [
        { id: 'a', text: 'Só parabenizar quem teve mais destaque', correct: false },
        { id: 'b', text: 'Reconhecer a contribuição única de cada membro', correct: true },
        { id: 'c', text: 'Não celebrar para não criar expectativas', correct: false },
        { id: 'd', text: 'Focar apenas no resultado final', correct: false }
      ],
      explanation: 'Reconhecer as contribuições individuais fortalece a equipe e motiva todos a continuarem colaborando em futuros projetos!'
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header Fixo */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/tea" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Voltar para TEA</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🧩</span>
              <div className="text-right">
                <div className="font-bold text-gray-800">Trabalho em Equipe</div>
                <div className="text-sm text-gray-600">Pontuação Total</div>
              </div>
              <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
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
                <span className="text-6xl">🧩</span>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Trabalho em Equipe</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Desenvolver habilidades de colaboração, comunicação e resolução conjunta de problemas 
                através de cenários de trabalho em equipe do dia a dia
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
                  Desenvolver habilidades de colaboração, comunicação e resolução conjunta de problemas 
                  através de cenários de trabalho em equipe do dia a dia
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
                  <p><strong className="text-purple-600">Nível 1:</strong> Colaboração básica e divisão de tarefas</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> Comunicação e coordenação em grupo</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> Resolução de conflitos e liderança</p>
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
                  e dominar as habilidades de trabalho em equipe
                </p>
              </div>
            </div>

            {/* Botão Começar */}
            <div className="text-center">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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
                Este exercício é baseado em teorias de aprendizagem colaborativa e terapias de grupo para desenvolvimento 
                de habilidades sociais em pessoas com TEA. O treino de competências de trabalho em equipe melhora 
                a capacidade de cooperação, comunicação e adaptação social.
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
                    <span className="text-3xl">🧩</span>
                    <h2 className="text-2xl font-bold text-gray-800">Trabalho em Equipe</h2>
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
                      className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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

                    {/* Opções de Resposta */}
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
                        onClick={handleSubmitAnswer}
                        className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
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
                            className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                          >
                            Próximo Exercício →
                          </button>
                        ) : (
                          <Link
                            href="/tea"
                            className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 inline-block"
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