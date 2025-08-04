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
    title: "Iniciando uma Conversa no Recreio",
    situation: "Voce ve um grupo de colegas conversando no recreio e gostaria de participar da conversa",
    icon: "👥",
    visualSteps: [
      { step: 1, description: "Observe a linguagem corporal do grupo", visual: "👀" },
      { step: 2, description: "Aproxime-se educadamente", visual: "🚶" },
      { step: 3, description: "Aguarde uma pausa natural", visual: "⏸️" },
      { step: 4, description: "Participe de forma relevante", visual: "💬" },
      { step: 5, description: "Contribua para o topico", visual: "🤝" }
    ],
    options: [
      { id: "a", text: "Com licenca, posso participar da conversa?", isCorrect: true, feedback: "Excelente! Pediu permissao educadamente e de forma direta." },
      { id: "b", text: "Oi pessoal! Sobre o que estao falando?", isCorrect: true, feedback: "Bom! Cumprimento amigavel com interesse genuino no topico." },
      { id: "c", text: "Interrompe e muda o assunto completamente", isCorrect: false, feedback: "Evite interromper e mudar o assunto. Primeiro escute e se adapte ao topico." }
    ]
  },
  {
    id: 2,
    title: "Lidando com um Desacordo",
    situation: "Voce e um colega tem opinioes diferentes sobre um projeto escolar e a discussao esta ficando tensa",
    icon: "🤔",
    visualSteps: [
      { step: 1, description: "Mantenha a calma e respire", visual: "😌" },
      { step: 2, description: "Escute a perspectiva do outro", visual: "👂" },
      { step: 3, description: "Valide os pontos validos", visual: "✅" },
      { step: 4, description: "Expresse sua visao respeitosamente", visual: "🗣️" },
      { step: 5, description: "Busque um meio termo", visual: "🤝" }
    ],
    options: [
      { id: "a", text: "Voce esta completamente errado!", isCorrect: false, feedback: "Muito confrontativo. Evite invalidar completamente a perspectiva do outro." },
      { id: "b", text: "Entendo seu ponto, mas eu penso diferente porque...", isCorrect: true, feedback: "Perfeito! Reconhece a opiniao do outro antes de apresentar a sua." },
      { id: "c", text: "Tanto faz, faca do seu jeito", isCorrect: false, feedback: "Evitar o conflito assim pode gerar ressentimento. E melhor dialogar." }
    ]
  },
  {
    id: 3,
    title: "Convidando Alguem para uma Atividade",
    situation: "Voce quer convidar um colega para participar de uma atividade extracurricular, mas nao tem certeza se ele vai aceitar",
    icon: "🎯",
    visualSteps: [
      { step: 1, description: "Escolha o momento apropriado", visual: "⏰" },
      { step: 2, description: "Seja especifico sobre a atividade", visual: "📋" },
      { step: 3, description: "Explique por que pensou nele", visual: "💭" },
      { step: 4, description: "De opcoes e flexibilidade", visual: "🔄" },
      { step: 5, description: "Aceite a resposta graciosamente", visual: "😊" }
    ],
    options: [
      { id: "a", text: "Quer participar do clube de xadrez? Acho que voce se daria bem!", isCorrect: true, feedback: "Otimo! Convite especifico com uma justificativa positiva." },
      { id: "b", text: "Voce tem que participar do clube comigo!", isCorrect: false, feedback: "Muito impositivo. De espaco para a pessoa escolher livremente." },
      { id: "c", text: "Se quiser, tem uma coisa... mas se nao quiser tudo bem...", isCorrect: false, feedback: "Muito hesitante. Seja mais confiante e claro no convite." }
    ]
  },
  {
    id: 4,
    title: "Demonstrando Empatia",
    situation: "Voce percebe que um colega esta triste depois de receber uma nota baixa em uma prova",
    icon: "💙",
    visualSteps: [
      { step: 1, description: "Observe os sinais emocionais", visual: "👁️" },
      { step: 2, description: "Aproxime-se com cuidado", visual: "🤲" },
      { step: 3, description: "Reconheca os sentimentos", visual: "❤️" },
      { step: 4, description: "Ofereça apoio genuino", visual: "🤗" },
      { step: 5, description: "Respeite se precisar de espaco", visual: "🕊️" }
    ],
    options: [
      { id: "a", text: "Pelo menos nao foi zero! Poderia ser pior!", isCorrect: false, feedback: "Minimizar sentimentos nao ajuda. Reconheca que a pessoa esta chateada." },
      { id: "b", text: "Vi que voce ficou chateado. Quer conversar sobre isso?", isCorrect: true, feedback: "Excelente! Reconhece o sentimento e oferece apoio sem pressionar." },
      { id: "c", text: "Nao esquenta! Todo mundo tira nota baixa as vezes", isCorrect: false, feedback: "Embora bem intencionado, minimiza os sentimentos. Seja mais empático." }
    ]
  },
  {
    id: 5,
    title: "Mantendo uma Conversa Fluindo",
    situation: "Voce esta conversando com alguem novo e a conversa esta ficando com pausas desconfortaveis",
    icon: "💬",
    visualSteps: [
      { step: 1, description: "Observe pistas contextuais", visual: "🔍" },
      { step: 2, description: "Faca perguntas abertas", visual: "❓" },
      { step: 3, description: "Compartilhe algo relacionado", visual: "🔗" },
      { step: 4, description: "Mostre interesse genuino", visual: "😊" },
      { step: 5, description: "Use linguagem corporal positiva", visual: "👍" }
    ],
    options: [
      { id: "a", text: "E entao... que tempo estranho hoje, ne?", isCorrect: true, feedback: "Bom! Comentario neutro sobre algo compartilhado pode reacender a conversa." },
      { id: "b", text: "Fica em silencio e espera o outro falar", isCorrect: false, feedback: "Silencios longos podem ser desconfortaveis. Tome iniciativa para retomar." },
      { id: "c", text: "Voce e muito quieto, ne? Por que nao fala mais?", isCorrect: false, feedback: "Evite comentarios sobre personalidade. Pode deixar a pessoa constrangida." }
    ]
  }
];

export default function SocialRoutinesIntermediate() {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6">
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
            <h1 className="text-3xl font-bold text-gray-800">Rotinas Sociais - Intermediario</h1>
            <p className="text-gray-600">Conversas sociais e interacoes elaboradas</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Cenario: {currentScenario + 1}/{socialScenarios.length}</div>
            <div className="text-lg font-semibold text-orange-600">Acertos: {score}/{socialScenarios.length}</div>
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
              className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-300"
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
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Script Visual - Estrategia em 5 passos:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {scenario.visualSteps.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="bg-white rounded-lg p-3 border-2 border-orange-200 h-full">
                    <div className="text-2xl mb-2">{step.visual}</div>
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
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
              Como voce lidaria com esta situacao?
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
                      : 'border-gray-200 hover:border-orange-300 text-gray-800'
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
                {scenario.options.find(opt => opt.id === selectedOption)?.isCorrect ? 'Excelente escolha! 🎉' : 'Vamos refletir sobre isso 🤔'}
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
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
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
                  onClick={() => router.push('/social-routines/advanced')}
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
              {finalScore >= 70 ? 'Parabens! Nivel intermediario concluido! 🎉' : 'Continue praticando! 💪'}
            </h3>
            <p className={`mb-4 ${finalScore >= 70 ? 'text-green-700' : 'text-yellow-700'}`}>
              Voce acertou {score} de {socialScenarios.length} cenarios ({finalScore}%)
              {finalScore >= 70 
                ? ' - Voce demonstrou boa habilidade em conversas sociais elaboradas!'
                : ' - Continue praticando para aprimorar suas competencias sociais.'
              }
            </p>
            
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🎯 Habilidades Desenvolvidas:</h4>
              <div className="text-gray-700 text-sm space-y-1">
                <p>✓ <strong>Inclusao em grupos:</strong> Como participar de conversas em andamento</p>
                <p>✓ <strong>Gestao de conflitos:</strong> Lidar com desacordos de forma construtiva</p>
                <p>✓ <strong>Iniciativa social:</strong> Fazer convites e propostas com confianca</p>
                <p>✓ <strong>Empatia ativa:</strong> Reconhecer e responder a emocoes dos outros</p>
                <p>✓ <strong>Manutencao de conversa:</strong> Manter dialogos fluindo naturalmente</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}