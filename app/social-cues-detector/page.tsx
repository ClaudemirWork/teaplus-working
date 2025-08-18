'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SocialCuesDetectorPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedCue, setSelectedCue] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);

  const scenarios = [
    {
      id: 1,
      title: "Na Escola - Recreio",
      description: "Maria está sozinha no canto do pátio, olhando para baixo, com os braços cruzados.",
      image: "👧",
      context: "Recreio escolar - outros alunos brincando ao fundo",
      cues: [
        { id: 'a', text: "Ela está feliz e quer brincar", correct: false },
        { id: 'b', text: "Ela pode estar triste ou se sentindo excluída", correct: true },
        { id: 'c', text: "Ela está com raiva de alguém", correct: false },
        { id: 'd', text: "Ela está apenas cansada", correct: false }
      ],
      explanation: "Postura corporal fechada (braços cruzados) + olhar para baixo + isolamento = sinais de tristeza ou exclusão social."
    },
    {
      id: 2,
      title: "Em Casa - Jantar",
      description: "Papai está na mesa, mas não está conversando. Ele suspira várias vezes e mexe pouco na comida.",
      image: "👨",
      context: "Mesa de jantar em família",
      cues: [
        { id: 'a', text: "Ele está muito satisfeito com a comida", correct: false },
        { id: 'b', text: "Ele está preocupado ou estressado", correct: true },
        { id: 'c', text: "Ele está brincando de não falar", correct: false },
        { id: 'd', text: "Ele não gosta da família", correct: false }
      ],
      explanation: "Suspiros + silêncio + pouco apetite = sinais de preocupação, estresse ou algo incomodando."
    },
    {
      id: 3,
      title: "Na Rua - Encontro",
      description: "Seu amigo te encontra na rua, sorri largo, acena energicamente e vem correndo em sua direção.",
      image: "👦",
      context: "Calçada da rua - encontro casual",
      cues: [
        { id: 'a', text: "Ele está feliz em te ver", correct: true },
        { id: 'b', text: "Ele está com pressa para ir embora", correct: false },
        { id: 'c', text: "Ele está fingindo que gosta de você", correct: false },
        { id: 'd', text: "Ele quer pedir algo emprestado", correct: false }
      ],
      explanation: "Sorriso largo + aceno energético + aproximação rápida = entusiasmo e alegria genuína pelo encontro."
    },
    {
      id: 4,
      title: "Na Sala - Apresentação",
      description: "Durante sua apresentação, a professora olha o relógio várias vezes e tamboriila os dedos na mesa.",
      image: "👩‍🏫",
      context: "Sala de aula - apresentação do aluno",
      cues: [
        { id: 'a', text: "Ela está muito interessada na apresentação", correct: false },
        { id: 'b', text: "Ela está impaciente ou com pressa", correct: true },
        { id: 'c', text: "Ela está nervosa com sua apresentação", correct: false },
        { id: 'd', text: "Ela está comemorando internamente", correct: false }
      ],
      explanation: "Olhar o relógio repetidamente + tamborilar dedos = sinais de impaciência, pressa ou tédio."
    }
  ];

  const handleSelectCue = (cueId: string) => {
    setSelectedCue(cueId);
    setShowResult(false);
    setFeedback('');
  };

  const handleSubmit = () => {
    if (!selectedCue) return;
    
    const currentCue = scenarios[currentScenario].cues.find(cue => cue.id === selectedCue);
    if (currentCue?.correct) {
      setScore(score + 10);
      setFeedback('🎉 Correto! Você interpretou bem as pistas sociais.');
    } else {
      setFeedback('🤔 Não foi dessa vez. Vamos analisar as pistas mais cuidadosamente.');
    }
    setShowResult(true);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedCue(null);
      setShowResult(false);
      setFeedback('');
    }
  };

  const restartActivity = () => {
    setCurrentScenario(0);
    setSelectedCue(null);
    setScore(0);
    setShowResult(false);
    setFeedback('');
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  if (gameStarted) {
    const scenario = scenarios[currentScenario];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header Mobile */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Botão Voltar */}
              <button 
                onClick={() => setGameStarted(false)}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors min-h-[44px] px-2 -ml-2"
              >
                <span className="text-xl mr-2">←</span>
                <span className="text-sm sm:text-base font-medium">Voltar</span>
              </button>
              
              {/* Título */}
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4 flex items-center justify-center gap-2">
                <span className="text-xl sm:text-2xl">🕵️</span>
                <span>Detector de Pistas</span>
              </h1>
              
              {/* Pontuação */}
              <div className="text-right">
                <div className="text-xs sm:text-sm text-gray-600">Pontuação</div>
                <div className="text-base sm:text-xl font-bold text-blue-600">{score} pts</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-100 p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                <span className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">
                  Cenário {currentScenario + 1} de {scenarios.length}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  {Math.round(((currentScenario + 1) / scenarios.length) * 100)}% concluído
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Scenario */}
            <div className="p-4 sm:p-6">
              <div className="text-center mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{scenario.title}</h2>
                <div className="text-4xl sm:text-6xl mb-4">{scenario.image}</div>
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4">
                  <p className="text-gray-700 font-medium text-sm sm:text-base">{scenario.description}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">📍 {scenario.context}</p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">O que essas pistas sociais indicam?</h3>
                {scenario.cues.map((cue) => (
                  <button
                    key={cue.id}
                    onClick={() => handleSelectCue(cue.id)}
                    className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all min-h-[48px] touch-manipulation ${
                      selectedCue === cue.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium text-gray-800 text-sm sm:text-base">{cue.text}</span>
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              {selectedCue && !showResult && (
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors min-h-[48px] touch-manipulation"
                >
                  Verificar Resposta
                </button>
              )}

              {/* Feedback */}
              {showResult && (
                <div className="mt-4 space-y-4">
                  <div className={`p-4 rounded-lg ${
                    feedback.includes('Correto') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <p className="font-medium text-sm sm:text-base">{feedback}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">💡 Explicação:</h4>
                    <p className="text-gray-600 text-sm sm:text-base">{scenario.explanation}</p>
                  </div>

                  {/* Navigation */}
                  <div className="flex space-x-3">
                    {currentScenario < scenarios.length - 1 ? (
                      <button
                        onClick={nextScenario}
                        className="flex-1 bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors min-h-[48px] touch-manipulation"
                      >
                        Próximo Cenário →
                      </button>
                    ) : (
                      <div className="flex-1 space-y-3">
                        <div className="bg-purple-100 text-purple-800 p-4 rounded-lg text-center">
                          <h3 className="font-bold text-base sm:text-lg">🎉 Atividade Concluída!</h3>
                          <p className="text-sm sm:text-base">Pontuação final: {score}/40 pontos</p>
                          <p className="text-xs sm:text-sm mt-2">
                            {score >= 30 ? 'Excelente! Você é um ótimo detector de pistas sociais!' :
                             score >= 20 ? 'Muito bom! Continue praticando a observação.' :
                             'Continue praticando! A observação melhora com o treino.'}
                          </p>
                        </div>
                        <button
                          onClick={restartActivity}
                          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors min-h-[48px] touch-manipulation"
                        >
                          🔄 Treinar Novamente
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Mobile */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Botão Voltar */}
            <a 
              href="/dashboard" 
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors min-h-[44px] px-2 -ml-2"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-sm sm:text-base font-medium">Voltar</span>
            </a>
            
            {/* Título */}
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4 flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl">🕵️</span>
              <span>Detector de Pistas Sociais</span>
            </h1>
            
            {/* Espaço para balanceamento */}
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Objetivo */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-red-400">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🎯</span>
              Objetivo:
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Desenvolver a habilidade de interpretar linguagem corporal, expressões faciais e 
              contexto social através da análise de cenários do dia a dia.
            </p>
          </div>

          {/* Pontuação */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-yellow-400">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">⭐</span>
              Pontuação:
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Cada interpretação correta = +10 pontos. Você precisa de 30 pontos para avançar de nível 
              e se tornar um especialista em pistas sociais.
            </p>
          </div>

          {/* Níveis */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-purple-400">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">📊</span>
              Níveis:
            </h2>
            <div className="space-y-2 text-gray-700 text-sm sm:text-base">
              <p><strong>Nível 1:</strong> Cenários simples (fácil)</p>
              <p><strong>Nível 2:</strong> Situações complexas (médio)</p>
              <p><strong>Nível 3:</strong> Contextos avançados (difícil)</p>
            </div>
          </div>

          {/* Final */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-green-400">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🏁</span>
              Final:
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Complete todos os cenários com 30+ pontos para dominar a arte de detectar 
              pistas sociais com sucesso.
            </p>
          </div>
        </div>

        {/* Emoji */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-6xl sm:text-8xl mb-4">🕵️</div>
        </div>

        {/* Start Button */}
        <div className="text-center mb-6 sm:mb-8">
          <button
            onClick={startGame}
            className="bg-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-600 active:bg-blue-700 transition-colors inline-flex items-center min-h-[48px] touch-manipulation"
          >
            <span className="mr-2">🚀</span>
            Iniciar Jogo
          </button>
        </div>

        {/* Scientific Foundation */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🧠</span>
            Base Científica:
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            Este exercício é baseado em técnicas de <strong>comunicação não-verbal</strong> e 
            <strong>análise de contexto social</strong>. As situações foram desenvolvidas seguindo 
            princípios de interpretação de sinais sociais validados para desenvolvimento 
            de habilidades de leitura social em pessoas com TEA e TDAH.
          </p>
        </div>
      </div>
    </div>
  );
}