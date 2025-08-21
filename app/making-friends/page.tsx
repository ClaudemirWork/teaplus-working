'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GameHeader } from '@/components/GameHeader';
import { Users2, Trophy, Gamepad2 } from 'lucide-react';

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

export default function MakingFriendsPage() {
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
        <GameHeader title="Fazendo Amigos" icon={<Users2 className="h-6 w-6" />} />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div className="max-w-2xl text-center">
              <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl">
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-4xl">🏆</div>
                  <h1 className="mb-4 text-4xl font-bold text-gray-900">Atividade Concluída!</h1>
                  <p className="text-xl text-gray-600">Você praticou importantes habilidades para fazer e manter amizades.</p>
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
      <GameHeader title="Fazendo Amigos" icon={<Users2 className="h-6 w-6" />} showSaveButton={false} />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {!gameStarted ? (
            // TELA INICIAL PADRÃO
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:</h3>
                    <p className="text-sm text-gray-600">Aprender e praticar estratégias para iniciar, desenvolver e manter amizades saudáveis em situações do dia a dia.</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Leia cada cenário social.</li>
                      <li>Escolha a atitude que você considera a mais positiva e eficaz.</li>
                      <li>Aprenda com as explicações ao final de cada exercício.</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                    <p className="text-sm text-gray-600">Cada escolha correta vale 10 pontos. O objetivo é refletir sobre as melhores formas de interagir e construir amizades.</p>
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
