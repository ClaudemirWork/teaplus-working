'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SocialScenario {
  id: number;
  title: string;
  situation: string;
  icon: string;
  visualSteps: {
    step: number;
    description: string;
    visual: string;
  }[];
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const socialScenarios: SocialScenario[] = [
  {
    id: 1,
    title: "Cumprimento ao Chegar na Escola",
    situation: "Voce acabou de chegar na escola e ve um colega conhecido no corredor",
    icon: "🏫",
    visualSteps: [
      { step: 1, description: "Faca contato visual", visual: "👀" },
      { step: 2, description: "Sorria de forma amigavel", visual: "😊" },
      { step: 3, description: "Diga uma saudacao adequada", visual: "💬" },
      { step: 4, description: "Aguarde a resposta", visual: "⏱️" }
    ],
    options: [
      { id: "a", text: "Oi! Como voce esta?", isCorrect: true, feedback: "Perfeito! Cumprimento caloroso e pergunta sobre bem-estar." },
      { id: "b", text: "...", isCorrect: false, feedback: "Ignorar nao e adequado. Sempre cumprimente pessoas conhecidas." },
      { id: "c", text: "Voce parece cansado hoje", isCorrect: false, feedback: "Evite comentarios sobre aparencia logo no cumprimento." }
    ]
  },
  {
    id: 2,
    title: "Pedindo Ajuda ao Professor",
    situation: "Voce nao entendeu a explicacao e precisa de ajuda do professor",
    icon: "👨‍🏫",
    visualSteps: [
      { step: 1, description: "Levante a mao educadamente", visual: "✋" },
      { step: 2, description: "Aguarde ser chamado", visual: "⏳" },
      { step: 3, description: "Explique sua duvida claramente", visual: "🗣️" },
      { step: 4, description: "Agradeca pela ajuda", visual: "🙏" }
    ],
    options: [
      { id: "a", text: "Professor, interrompe! Nao entendi nada!", isCorrect: false, feedback: "Muito direto e interruptivo. Use maneiras mais educadas." },
      { id: "b", text: "Com licenca, poderia me ajudar com esta questao?", isCorrect: true, feedback: "Excelente! Educado, claro e respeitoso." },
      { id: "c", text: "Nao fala nada e fica confuso", isCorrect: false, feedback: "Importante pedir ajuda quando necessario. Nao tenha vergonha!" }
    ]
  },
  {
    id: 3,
    title: "Agradecendo por um Favor",
    situation: "Um colega te emprestou um lapis que voce precisava",
    icon: "✏️",
    visualSteps: [
      { step: 1, description: "Olhe para a pessoa", visual: "👁️" },
      { step: 2, description: "Use tom de voz sincero", visual: "🎵" },
      { step: 3, description: "Diga 'obrigado' claramente", visual: "💖" },
      { step: 4, description: "Ofereça retribuir o favor", visual: "🤝" }
    ],
    options: [
      { id: "a", text: "Obrigado! Se precisar de algo, pode contar comigo", isCorrect: true, feedback: "Perfeito! Gratidao sincera e oferta de reciprocidade." },
      { id: "b", text: "Ta bom", isCorrect: false, feedback: "Muito casual. Demonstre mais gratidao pelo favor recebido." },
      { id: "c", text: "Obrigado, voce e muito legal", isCorrect: true, feedback: "Bom! Gratidao com elogio genuino e adequado." }
    ]
  }
];

export default function SocialRoutinesBeginner() {
  const router = useRouter();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState(0);

  const scenario = socialScenarios[currentScenario];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    const option = scenario.options.find(opt => opt.id === optionId);
    if (option?.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextScenario = () => {
    if (currentScenario < socialScenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedOption('');
      setShowFeedback(false);
      setCompletedScenarios(prev => prev + 1);
    }
  };

  const resetActivity = () => {
    setCurrentScenario(0);
    setSelectedOption('');
    setShowFeedback(false);
    setScore(0);
    setCompletedScenarios(0);
  };

  const finalScore = Math.round((score / socialScenarios.length) * 100);
  const isCompleted = currentScenario === socialScenarios.length - 1 && showFeedback;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/social-routines')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Voltar aos Niveis
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Rotinas Sociais - Iniciante</h1>
            <p className="text-gray-600">Cumprimentos basicos e scripts simples</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Cenario: {currentScenario + 1}/{socialScenarios.length}</div>
            <div className="text-lg font-semibold text-green-600">Acertos: {score}/{socialScenarios.length}</div>
          </div>
        </div>

        {/* Progresso */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progresso</span>
            <span className="text-sm text-gray-600">{Math.round(((currentScenario + (showFeedback ? 1 : 0)) / socialScenarios.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentScenario + (showFeedback ? 1 : 0)) / socialScenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Cenario Atual */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{scenario.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{scenario.title}</h2>
            <p className="text-gray-600 text-lg">{scenario.situation}</p>
          </div>

          {/* Script Visual */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Script Visual - Siga estes passos:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {scenario.visualSteps.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="bg-white rounded-lg p-3 border-2 border-green-200">
                    <div className="text-3xl mb-2">{step.visual}</div>
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                      {step.step}
                    </div>
                    <p className="text-xs text-gray-700">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opcoes de Resposta */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              O que voce diria nesta situacao?
            </h3>
            <div className="space-y-3">
              {scenario.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedOption === option.id
                      ? option.isCorrect
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-red-500 bg-red-50 text-red-800'
                      : 'border-gray-200 hover:border-green-300 text-gray-800'
                  } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <span className="font-semibold mr-3 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                      {option.id.toUpperCase()}
                    </span>
                    <span className="flex-1">{option.text}</span>
                    {showFeedback && selectedOption === option.id && (
                      <span className="ml-2">
                        {option.isCorrect ? '✅' : '❌'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`rounded-lg p-4 mb-6 ${
              scenario.options.find(opt => opt.id === selectedOption)?.isCorrect
                ? 'bg-green-100 border border-green-300'
                : 'bg-red-100 border border-red-300'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                scenario.options.find(opt => opt.id === selectedOption)?.isCorrect
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}>
                {scenario.options.find(opt => opt.id === selectedOption)?.isCorrect ? 'Muito bem! 🎉' : 'Vamos refletir 🤔'}
              </h4>
              <p className={scenario.options.find(opt => opt.id === selectedOption)?.isCorrect ? 'text-green-700' : 'text-red-700'}>
                {scenario.options.find(opt => opt.id === selectedOption)?.feedback}
              </p>
            </div>
          )}

          {/* Botoes de Acao */}
          <div className="flex gap-4 justify-center">
            {!isCompleted ? (
              <>
                {showFeedback && currentScenario < socialScenarios.length - 1 && (
                  <button
                    onClick={handleNextScenario}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Proximo Cenario →
                  </button>
                )}
                
                <button
                  onClick={resetActivity}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Recomecar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={resetActivity}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Recomecar
                </button>

                <button
                  onClick={() => router.push('/social-routines/intermediate')}
                  disabled={finalScore < 70}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    finalScore >= 70
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {finalScore >= 70 ? 'Proximo Nivel →' : 'Pratique mais para avancar'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Resultado Final */}
        {isCompleted && (
          <div className={`rounded-xl border-2 p-6 ${
            finalScore >= 70 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <h3 className={`text-xl font-bold mb-3 ${
              finalScore >= 70 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {finalScore >= 70 ? 'Parabens! Nivel concluido! 🎉' : 'Continue praticando! 💪'}
            </h3>
            <p className={`mb-4 ${finalScore >= 70 ? 'text-green-700' : 'text-yellow-700'}`}>
              Voce acertou {score} de {socialScenarios.length} cenarios ({finalScore}%)
              {finalScore >= 70 
                ? ' - Voce demonstrou boa compreensao dos cumprimentos basicos!'
                : ' - Continue praticando para melhorar suas habilidades sociais.'
              }
            </p>
            
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">📚 Habilidades Praticadas:</h4>
              <div className="text-gray-700 text-sm space-y-1">
                <p>✓ <strong>Cumprimentos adequados:</strong> Como iniciar interacoes sociais</p>
                <p>✓ <strong>Comunicacao respeitosa:</strong> Pedir ajuda de forma educada</p>
                <p>✓ <strong>Gratidao social:</strong> Agradecer e retribuir favores</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}