'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GameHeader } from '@/components/GameHeader';
import { Puzzle, Trophy, Gamepad2 } from 'lucide-react';

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

export default function TeamworkPage() {
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
        <GameHeader title="Trabalho em Equipe" icon={<Puzzle className="h-6 w-6" />} />
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div className="max-w-2xl text-center">
              <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl">
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-4xl">🏆</div>
                  <h1 className="mb-4 text-4xl font-bold text-gray-900">Atividade Concluída!</h1>
                  <p className="text-xl text-gray-600">Você praticou habilidades essenciais para a colaboração em equipe.</p>
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
      <GameHeader title="Trabalho em Equipe" icon={<Puzzle className="h-6 w-6" />} showSaveButton={false} />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {!gameStarted ? (
            // TELA INICIAL PADRÃO
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:</h3>
                    <p className="text-sm text-gray-600">Desenvolver habilidades de colaboração, comunicação e resolução de problemas em grupo através de cenários práticos.</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Analise a situação de equipe apresentada.</li>
                      <li>Escolha a ação que melhor promove a colaboração.</li>
                      <li>Aprenda com as explicações de cada cenário.</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                    <p className="text-sm text-gray-600">Cada escolha colaborativa vale 10 pontos. O objetivo é entender os pilares de um bom trabalho em equipe.</p>
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
                          <p className="text-gray-700">{isCorrectAnswer}</p>
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
