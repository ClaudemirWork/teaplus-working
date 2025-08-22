'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GameHeader } from '@/components/GameHeader';
import { Search, Trophy, Gamepad2 } from 'lucide-react';

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

export default function SocialCluesPage() {
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
    setGameFinished(false);
  };

  const handleStartExercise = () => { setExerciseStarted(true); setSelectedAnswer(''); setShowFeedback(false); };
  const handleAnswerSelect = (answerId: string) => { setSelectedAnswer(answerId); }; // Corrigido para adicionar o tipo string
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
        <GameHeader title="Pistas Sociais" icon={<Search className="h-6 w-6" />} />
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div className="max-w-2xl text-center">
              <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl">
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-4xl">🕵️</div>
                  <h1 className="mb-4 text-4xl font-bold text-gray-900">Investigação Concluída!</h1>
                  <p className="text-xl text-gray-600">Você se tornou um ótimo detetive de pistas sociais.</p>
                </div>
                <div className="mb-8 space-y-4">
                  <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">Pontuação Final</h3>
                    <p className="text-3xl font-bold text-blue-600">{points} / {exercises.length * 10} pontos</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <button onClick={resetGame} className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg">
                    🔄 Nova Investigação
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
      <GameHeader title="Pistas Sociais" icon={<Search className="h-6 w-6" />} showSaveButton={false} />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {!gameStarted ? (
            // TELA INICIAL PADRÃO
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:</h3>
                    <p className="text-sm text-gray-600">Treinar a identificação de pistas não-verbais e mensagens sutis em interações sociais para se tornar um "detetive social".</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Leia o "caso" e as "pistas observadas".</li>
                      <li>Conduza a "investigação" respondendo à pergunta.</li>
                      <li>Confira a "solução" para aprender com cada caso.</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                    <p className="text-sm text-gray-600">Cada caso resolvido corretamente vale 10 pontos. O objetivo é aprimorar sua capacidade de leitura do ambiente social.</p>
                  </div>
                </div>
              </div>
              <div className="text-center pt-4">
                <button
                  onClick={handleStartGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg"
                >
                  🚀 Começar Investigação
                </button>
              </div>
            </div>
          ) : (
            // LAYOUT DO JOGO (lógica interna preservada)
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
              <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                <span>🕵️ Caso {currentExercise + 1}/{exercises.length}</span>
                <span>Pontos: {points}</span>
              </div>
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">{currentEx.title}</h2>
                {!exerciseStarted ? (
                  <div className="space-y-6">
                    <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 sm:p-6 rounded-lg text-left">
                      <p className="text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">{currentEx.scenario}</p>
                    </div>
                    <button onClick={handleStartExercise} className="bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full sm:w-auto">
                      🔍 Iniciar Investigação
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 sm:p-6 rounded-lg mb-6 text-left">
                      <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 whitespace-pre-line">{currentEx.scenario}</p>
                      <p className="text-gray-800 font-semibold text-base sm:text-lg">{currentEx.question}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {currentEx.options.map((option) => (
                        <button key={option.id} onClick={() => handleAnswerSelect(option.id)} disabled={showFeedback} className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 text-sm sm:text-base ${selectedAnswer === option.id ? 'border-cyan-500 bg-cyan-50 text-cyan-800' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 bg-white'}`}>
                          <span className="font-medium">{option.id.toUpperCase()}) </span>
                          {option.text}
                        </button>
                      ))}
                    </div>
                    {!showFeedback && selectedAnswer && (
                      <button onClick={handleSubmit} className="bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 w-full sm:w-auto">
                        🔍 Revelar Solução
                      </button>
                    )}
                    {showFeedback && (
                      <>
                        <div className={`p-4 sm:p-6 rounded-xl text-left ${isCorrect ? 'bg-green-50 border-l-4 border-green-400' : 'bg-yellow-50 border-l-4 border-yellow-400'}`}>
                          <div className="flex items-center space-x-2 mb-3">
                            <h3 className="text-base sm:text-lg font-semibold">{isCorrect ? '🎉 Caso resolvido! +10 pontos' : '🔍 Vamos analisar as pistas!'}</h3>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">{currentEx.explanation}</p>
                        </div>
                        <div className="flex justify-center mt-4">
                          {currentExercise < exercises.length - 1 ? (
                            <button onClick={handleNext} className="bg-gradient-to-r from-cyan-400 to-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 w-full sm:w-auto">
                              🕵️ Próximo Caso →
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
