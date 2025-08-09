'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SocialCluesPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [points, setPoints] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const exercises = [
    {
      title: 'Detetive: Interesse Real ou Fingido?',
      scenario: '🔍 CASO: Você está contando sobre seu hobby para um colega. PISTAS OBSERVADAS: Ele mantém contato visual, acena com a cabeça, faz perguntas como "Que legal! Como você começou?", se inclina para frente e guarda o celular.',
      question: 'INVESTIGAÇÃO: Baseado nas pistas, qual é o interesse real desta pessoa?',
      options: [
        { id: 'a', text: 'Está fingindo interesse por educação', correct: false },
        { id: 'b', text: 'Demonstra interesse genuíno e ativo', correct: true },
        { id: 'c', text: 'Está totalmente desinteressada', correct: false },
        { id: 'd', text: 'Está com pressa para terminar a conversa', correct: false }
      ],
      explanation: '🕵️ SOLUÇÃO: Todas as pistas apontam para interesse genuíno! Contato visual + perguntas + postura inclinada + celular guardado = atenção total!'
    },
    {
      title: 'Detetive: Sinais de Desconforto',
      scenario: '🔍 CASO: Durante uma conversa em grupo, uma pessoa apresenta estes comportamentos: evita contato visual, cruza os braços, dá respostas curtas como "hum" e "ah tá", olha frequentemente para a saída, e seu corpo está virado para longe do grupo.',
      question: 'INVESTIGAÇÃO: O que essas pistas revelam sobre o estado da pessoa?',
      options: [
        { id: 'a', text: 'Está muito confortável e relaxada', correct: false },
        { id: 'b', text: 'Sente desconforto e quer sair da situação', correct: true },
        { id: 'c', text: 'Está extremamente interessada na conversa', correct: false },
        { id: 'd', text: 'Está apenas cansada fisicamente', correct: false }
      ],
      explanation: '🕵️ SOLUÇÃO: Múltiplas pistas de desconforto! Evitar contato + braços cruzados + respostas curtas + olhar para saída = desejo de escape!'
    },
    {
      title: 'Detetive: Convite Social Sutil',
      scenario: '🔍 CASO: Um colega comenta: "Nossa, esse filme parece incrível, queria muito assistir" enquanto mostra o trailer no celular, te olha e pergunta "Você já viu?". Quando você diz que não, ele responde "Ah, que pena... seria legal assistir com alguém que entende de cinema como você".',
      question: 'INVESTIGAÇÃO: Qual é a pista social escondida nesta conversa?',
      options: [
        { id: 'a', text: 'Ele está apenas fazendo um comentário casual', correct: false },
        { id: 'b', text: 'Está indiretamente te convidando para assistir juntos', correct: true },
        { id: 'c', text: 'Quer que você indique onde assistir', correct: false },
        { id: 'd', text: 'Está testando seu conhecimento sobre filmes', correct: false }
      ],
      explanation: '🕵️ SOLUÇÃO: Convite indireto clássico! "Queria assistir" + "seria legal com alguém" + elogio = convite sutil para atividade social!'
    },
    {
      title: 'Detetive: Sinais de Pressa',
      scenario: '🔍 CASO: Durante uma conversa, a pessoa demonstra: olha o relógio repetidamente, bate o pé no chão, dá respostas rápidas, diz "Nossa, que interessante..." mas muda de assunto rapidamente, e fica mudando o peso de uma perna para outra.',
      question: 'INVESTIGAÇÃO: Que mensagem social essas pistas transmitem?',
      options: [
        { id: 'a', text: 'Está muito interessada e quer saber mais', correct: false },
        { id: 'b', text: 'Tem pressa e precisa encerrar a conversa', correct: true },
        { id: 'c', text: 'Está nervosa mas quer continuar falando', correct: false },
        { id: 'd', text: 'Está perfeitamente à vontade com o tempo', correct: false }
      ],
      explanation: '🕵️ SOLUÇÃO: Sinais claros de urgência! Olhar o relógio + inquietação física + respostas rápidas = pessoa com pressa querendo se retirar!'
    },
    {
      title: 'Detetive: Aprovação ou Desaprovação?',
      scenario: '🔍 CASO: Você sugere uma ideia para o projeto do grupo. Uma pessoa reage assim: franzindo ligeiramente a testa, fazendo uma pequena pausa, dizendo "Hmm... interessante..." em tom hesitante, evitando contato visual direto, e mudando sutilmente de posição.',
      question: 'INVESTIGAÇÃO: Qual é a real opinião desta pessoa sobre sua ideia?',
      options: [
        { id: 'a', text: 'Aprova completamente a ideia', correct: false },
        { id: 'b', text: 'Tem reservas ou dúvidas sobre a ideia', correct: true },
        { id: 'c', text: 'Está neutro, sem opinião formada', correct: false },
        { id: 'd', text: 'Ficou empolgada mas tenta disfarçar', correct: false }
      ],
      explanation: '🕵️ SOLUÇÃO: Desaprovação disfarçada! Franzir testa + hesitação + "interessante" sem entusiasmo + evitar contato = dúvidas educadas!'
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50">
      {/* Header fixo */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Botão Voltar */}
            <Link 
              href="/tea"
              className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 transition-colors group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium hidden sm:inline">Voltar para TEA</span>
              <span className="font-medium sm:hidden">Voltar</span>
            </Link>

            {/* Título central */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔍</span>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Pistas Sociais</h1>
            </div>

            {/* Pontuação */}
            <div className="text-right">
              <div className="text-sm text-gray-500">Pontuação Total</div>
              <div className="text-lg font-bold text-cyan-600">{points} pts</div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!gameStarted ? (
          <div className="space-y-6">
            {/* Descrição da atividade */}
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg">
                Desenvolva habilidades de detetive social
              </p>
            </div>

            {/* Cards informativos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Objetivo */}
              <div className="bg-white rounded-xl border-l-4 border-red-400 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🎯</span>
                  <h3 className="text-lg font-semibold text-red-600">Objetivo:</h3>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  Desenvolver habilidades de detetive social para identificar pistas não-verbais 
                  e interpretar mensagens sociais sutis em conversas e interações
                </p>
              </div>

              {/* Pontuação */}
              <div className="bg-white rounded-xl border-l-4 border-blue-400 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">👑</span>
                  <h3 className="text-lg font-semibold text-blue-600">Pontuação:</h3>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  Cada pista decifrada = +10 pontos. Você precisa de 50 pontos 
                  para completar a atividade com sucesso
                </p>
              </div>

              {/* Níveis */}
              <div className="bg-white rounded-xl border-l-4 border-purple-400 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">📊</span>
                  <h3 className="text-lg font-semibold text-purple-600">Níveis:</h3>
                </div>
                <div className="text-gray-700 text-sm sm:text-base space-y-1">
                  <p><strong className="text-purple-600">Nível 1:</strong> Interesse e desconforto básicos</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> Convites sutis e sinais de pressa</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> Aprovação disfarçada e sinais complexos</p>
                </div>
              </div>

              {/* Final */}
              <div className="bg-white rounded-xl border-l-4 border-green-400 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🏁</span>
                  <h3 className="text-lg font-semibold text-green-600">Final:</h3>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">
                  Complete os 3 níveis com 50 pontos para finalizar a atividade 
                  e tornar-se um expert em pistas sociais
                </p>
              </div>
            </div>

            {/* Botão Começar */}
            <div className="text-center py-6">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
              >
                🕵️ Começar Investigação Social
              </button>
            </div>

            {/* Base Científica */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <span className="text-xl mr-2">🧠</span>
                <h3 className="text-lg font-semibold text-gray-800">Base Científica:</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Este exercício é baseado em pesquisas sobre cognição social e teoria da mente. A habilidade de 
                detectar pistas sociais sutis é fundamental para navegação social eficaz, especialmente para 
                pessoas com TEA que podem se beneficiar do treino sistemático de identificação de sinais não-verbais.
              </p>
            </div>
          </div>
        ) : (
          // Área do jogo
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
            {/* Progresso */}
            <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
              <span>🕵️ Caso {currentExercise + 1}/{exercises.length}</span>
              <span>Pontos: {points}</span>
            </div>

            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                🕵️ {currentEx.title}
              </h2>
              
              {!exerciseStarted ? (
                <div className="space-y-6">
                  <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 sm:p-6 rounded-lg">
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                      {currentEx.scenario}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleStartExercise}
                    className="bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                  >
                    🔍 Iniciar Investigação
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 sm:p-6 rounded-lg mb-6">
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                      {currentEx.scenario}
                    </p>
                    <p className="text-gray-800 font-semibold text-base sm:text-lg">
                      {currentEx.question}
                    </p>
                  </div>

                  {/* Opções de resposta - CORRIGIDO APENAS A VISIBILIDADE */}
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {currentEx.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerSelect(option.id)}
                        disabled={showFeedback}
                        className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 text-sm sm:text-base ${
                          selectedAnswer === option.id
                            ? showFeedback
                              ? option.correct
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : 'border-red-500 bg-red-50 text-red-800'
                              : 'border-cyan-500 bg-cyan-50 text-cyan-800'
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
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                    >
                      🔍 Revelar Solução
                    </button>
                  )}

                  {/* Feedback */}
                  {showFeedback && (
                    <div className={`p-4 sm:p-6 rounded-xl ${
                      isCorrect 
                        ? 'bg-green-50 border-l-4 border-green-400' 
                        : 'bg-yellow-50 border-l-4 border-yellow-400'
                    }`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl">
                          {isCorrect ? '🎉' : '🔍'}
                        </span>
                        <h3 className="text-base sm:text-lg font-semibold">
                          {isCorrect ? 'Caso resolvido! +10 pontos' : 'Vamos analisar as pistas!'}
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {currentEx.explanation}
                      </p>
                    </div>
                  )}

                  {/* Navegação */}
                  {showFeedback && (
                    <div className="flex justify-center">
                      {currentExercise < exercises.length - 1 ? (
                        <button
                          onClick={handleNext}
                          className="bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
                        >
                          🕵️ Próximo Caso →
                        </button>
                      ) : (
                        <Link
                          href="/tea"
                          className="bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 inline-block text-center w-full sm:w-auto"
                        >
                          ✅ Finalizar Investigação
                        </Link>
                      )}
                    </div>
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
