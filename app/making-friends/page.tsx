'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MakingFriendsPage() {
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
      title: 'Aproximando-se de Alguém Novo',
      scenario: 'Você vê um colega da sua idade brincando sozinho no parque. Ele parece legal e você gostaria de fazer amizade.',
      question: 'Qual é a melhor forma de se aproximar?',
      options: [
        { id: 'a', text: 'Chegar correndo e pegar o brinquedo dele', correct: false },
        { id: 'b', text: 'Se aproximar devagar e dizer "Oi, posso brincar com você?"', correct: true },
        { id: 'c', text: 'Ficar olhando de longe sem fazer nada', correct: false },
        { id: 'd', text: 'Gritar o nome dele de longe', correct: false }
      ],
      explanation: 'Uma aproximação gentil e educada mostra respeito e abre caminho para uma nova amizade!'
    },
    {
      id: 2,
      title: 'Iniciando uma Conversa',
      scenario: 'Você quer conversar com um colega novo da escola, mas não sabe sobre o que falar.',
      question: 'Qual é um bom assunto para começar uma conversa?',
      options: [
        { id: 'a', text: 'Reclamar de outras pessoas', correct: false },
        { id: 'b', text: 'Perguntar sobre os hobbies e interesses dele', correct: true },
        { id: 'c', text: 'Contar todos os seus problemas pessoais', correct: false },
        { id: 'd', text: 'Falar apenas sobre você mesmo', correct: false }
      ],
      explanation: 'Demonstrar interesse genuíno pelos outros cria conexões verdadeiras e duradouras!'
    },
    {
      id: 3,
      title: 'Descobrindo Interesses em Comum',
      scenario: 'Você descobriu que seu novo amigo também gosta de desenhar. Vocês querem fazer algo juntos.',
      question: 'Como vocês podem usar esse interesse em comum?',
      options: [
        { id: 'a', text: 'Competir para ver quem desenha melhor', correct: false },
        { id: 'b', text: 'Combinar de desenhar juntos e compartilhar ideias', correct: true },
        { id: 'c', text: 'Desenhar sozinho e mostrar depois', correct: false },
        { id: 'd', text: 'Criticar os desenhos um do outro', correct: false }
      ],
      explanation: 'Atividades compartilhadas baseadas em interesses comuns fortalecem amizades e criam memórias especiais!'
    },
    {
      id: 4,
      title: 'Mantendo a Amizade',
      scenario: 'Você fez um amigo há algumas semanas, mas ultimamente vocês não têm se falado muito.',
      question: 'Como manter a amizade viva?',
      options: [
        { id: 'a', text: 'Esperar ele te procurar primeiro', correct: false },
        { id: 'b', text: 'Chamar para fazer algo divertido juntos', correct: true },
        { id: 'c', text: 'Fingir que não se importa', correct: false },
        { id: 'd', text: 'Fazer amizade com outras pessoas para provocar ciúme', correct: false }
      ],
      explanation: 'Amizades precisam de cuidado e atenção. Tomar a iniciativa mostra que você valoriza a pessoa!'
    },
    {
      id: 5,
      title: 'Resolvendo Conflitos entre Amigos',
      scenario: 'Você e seu melhor amigo tiveram uma pequena discussão por causa de um mal-entendido.',
      question: 'Qual é a melhor maneira de resolver a situação?',
      options: [
        { id: 'a', text: 'Nunca mais falar com ele', correct: false },
        { id: 'b', text: 'Conversar abertamente e pedir desculpas se necessário', correct: true },
        { id: 'c', text: 'Espalhar fofocas sobre ele', correct: false },
        { id: 'd', text: 'Fingir que nada aconteceu', correct: false }
      ],
      explanation: 'Amizades verdadeiras superam conflitos através de diálogo honesto, compreensão e perdão!'
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
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
              <span className="text-2xl">👫</span>
              <div className="text-right">
                <div className="font-bold text-gray-800">Fazendo Amigos</div>
                <div className="text-sm text-gray-600">Pontuação Total</div>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
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
                <span className="text-6xl">👫</span>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Fazendo Amigos</h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Aprender estratégias para iniciar, desenvolver e manter amizades saudáveis 
                através de situações sociais realísticas do dia a dia
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
                  Aprender estratégias para iniciar, desenvolver e manter amizades saudáveis 
                  através de situações sociais realísticas do dia a dia
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
                  <p><strong className="text-purple-600">Nível 1:</strong> Primeiras aproximações e conversas iniciais</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> Desenvolvendo conexões e interesses comuns</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> Mantendo amizades e resolvendo conflitos</p>
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
                  e dominar as habilidades de fazer e manter amizades
                </p>
              </div>
            </div>

            {/* Botão Começar */}
            <div className="text-center">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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
                Este exercício é baseado em teorias de psicologia social e terapias comportamentais para desenvolvimento 
                de habilidades de amizade em pessoas com TEA. O treino de competências sociais através de cenários 
                estruturados melhora significativamente a capacidade de formar e manter relacionamentos interpessoais.
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
                    <span className="text-3xl">👫</span>
                    <h2 className="text-2xl font-bold text-gray-800">Fazendo Amigos</h2>
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
                      className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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
                        className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
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
                            className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                          >
                            Próximo Exercício →
                          </button>
                        ) : (
                          <Link
                            href="/tea"
                            className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 inline-block"
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
