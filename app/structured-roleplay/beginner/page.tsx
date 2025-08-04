'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RolePlayScenario {
  id: number;
  title: string;
  situation: string;
  icon: string;
  roles: {
    protagonist: string;
    supporting: string;
  };
  visualSteps: {
    step: number;
    description: string;
    visual: string;
  }[];
  dialogueOptions: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
    naturalness: number; // 1-5 scale
  }[];
}

const rolePlayScenarios: RolePlayScenario[] = [
  {
    id: 1,
    title: "Comprando na Padaria",
    situation: "Você precisa comprar pão para o café da manhã em uma padaria local",
    icon: "🥖",
    roles: {
      protagonist: "Cliente (você)",
      supporting: "Atendente da padaria"
    },
    visualSteps: [
      { step: 1, description: "Entre na padaria cumprimentando", visual: "🚪" },
      { step: 2, description: "Observe os produtos disponíveis", visual: "👀" },
      { step: 3, description: "Faça seu pedido claramente", visual: "🗣️" },
      { step: 4, description: "Confirme o valor e pague", visual: "💰" },
      { step: 5, description: "Agradeça e se despeça", visual: "😊" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Bom dia! Eu queria dois pães franceses, por favor.", 
        isCorrect: true, 
        feedback: "Perfeito! Cumprimento educado e pedido claro e direto.",
        naturalness: 5
      },
      { 
        id: "b", 
        text: "Oi... hm... você tem pão?", 
        isCorrect: false, 
        feedback: "Muito vago e hesitante. Seja mais específico sobre o que deseja.",
        naturalness: 2
      },
      { 
        id: "c", 
        text: "Quero pão. Quanto custa?", 
        isCorrect: false, 
        feedback: "Muito direto e sem cortesia. Adicione cumprimento e 'por favor'.",
        naturalness: 2
      }
    ]
  },
  {
    id: 2,
    title: "Pedindo Informação na Rua",
    situation: "Você está perdido e precisa perguntar a um transeunte como chegar ao banco",
    icon: "🏦",
    roles: {
      protagonist: "Pessoa perdida (você)",
      supporting: "Transeunte na rua"
    },
    visualSteps: [
      { step: 1, description: "Aproxime-se educadamente", visual: "🚶" },
      { step: 2, description: "Peça licença antes de interromper", visual: "✋" },
      { step: 3, description: "Explique sua necessidade", visual: "🗺️" },
      { step: 4, description: "Escute atentamente as direções", visual: "👂" },
      { step: 5, description: "Agradeça pela ajuda", visual: "🙏" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Com licença, você poderia me ajudar? Estou procurando o banco mais próximo.", 
        isCorrect: true, 
        feedback: "Excelente! Pediu licença, foi educado e específico sobre sua necessidade.",
        naturalness: 5
      },
      { 
        id: "b", 
        text: "Ei! Onde fica o banco?", 
        isCorrect: false, 
        feedback: "Muito abrupto. Sempre peça licença antes de interromper alguém na rua.",
        naturalness: 1
      },
      { 
        id: "c", 
        text: "Desculpa incomodar... você sabe onde... hm... tem um banco por aqui?", 
        isCorrect: false, 
        feedback: "Boa educação, mas muito hesitante. Seja mais claro e confiante.",
        naturalness: 3
      }
    ]
  },
  {
    id: 3,
    title: "Se Apresentando para um Novo Colega",
    situation: "Um novo colega chegou na sua turma/trabalho e você quer se apresentar",
    icon: "👋",
    roles: {
      protagonist: "Você se apresentando",
      supporting: "Novo colega"
    },
    visualSteps: [
      { step: 1, description: "Aproxime-se com sorriso", visual: "😊" },
      { step: 2, description: "Faça contato visual adequado", visual: "👁️" },
      { step: 3, description: "Apresente-se com nome", visual: "🏷️" },
      { step: 4, description: "Demonstre interesse genuíno", visual: "❓" },
      { step: 5, description: "Ofereça ajuda ou convite", visual: "🤝" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Oi! Eu sou João. Bem-vindo à equipe! Como você está se sentindo até agora?", 
        isCorrect: true, 
        feedback: "Perfeito! Apresentação calorosa, acolhedora e demonstra interesse genuíno.",
        naturalness: 5
      },
      { 
        id: "b", 
        text: "Oi, eu sou João.", 
        isCorrect: false, 
        feedback: "Muito básico. Adicione boas-vindas e demonstre interesse na pessoa.",
        naturalness: 3
      },
      { 
        id: "c", 
        text: "Você é o cara novo, né? Eu sou João. Esse lugar é meio chato, você vai ver.", 
        isCorrect: false, 
        feedback: "Negativo demais! Seja acolhedor e positivo ao receber alguém novo.",
        naturalness: 2
      }
    ]
  },
  {
    id: 4,
    title: "Atendendo o Telefone em Casa",
    situation: "O telefone toca em casa e você precisa atender profissionalmente",
    icon: "📞",
    roles: {
      protagonist: "Você atendendo",
      supporting: "Pessoa ligando"
    },
    visualSteps: [
      { step: 1, description: "Atenda até o 3º toque", visual: "⏰" },
      { step: 2, description: "Cumprimente adequadamente", visual: "👋" },
      { step: 3, description: "Identifique-se se necessário", visual: "🏷️" },
      { step: 4, description: "Escute a solicitação", visual: "👂" },
      { step: 5, description: "Responda ou transfira adequadamente", visual: "🔄" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Alô! Bom dia, residência da família Silva.", 
        isCorrect: true, 
        feedback: "Excelente! Cumprimento claro e identificação adequada para ligações residenciais.",
        naturalness: 5
      },
      { 
        id: "b", 
        text: "Fala aí!", 
        isCorrect: false, 
        feedback: "Muito informal para atender telefone. Use cumprimentos mais educados.",
        naturalness: 1
      },
      { 
        id: "c", 
        text: "Alô... quem é?", 
        isCorrect: false, 
        feedback: "Abrupto e pouco acolhedor. Primeiro cumprimente, depois pergunte educadamente.",
        naturalness: 2
      }
    ]
  },
  {
    id: 5,
    title: "Parabenizando um Amigo",
    situation: "Seu amigo passou numa prova importante e você quer parabenizá-lo pessoalmente",
    icon: "🎉",
    roles: {
      protagonist: "Você parabenizando",
      supporting: "Amigo que passou na prova"
    },
    visualSteps: [
      { step: 1, description: "Aproxime-se com entusiasmo", visual: "😄" },
      { step: 2, description: "Use linguagem corporal positiva", visual: "🙌" },
      { step: 3, description: "Expresse genuinamente a felicidade", visual: "💖" },
      { step: 4, description: "Reconheça o esforço dele", visual: "💪" },
      { step: 5, description: "Ofereça celebração ou apoio", visual: "🎊" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Parabéns! Eu sabia que você conseguiria! Todo seu esforço valeu a pena!", 
        isCorrect: true, 
        feedback: "Perfeito! Parabenização calorosa que reconhece o esforço e demonstra confiança.",
        naturalness: 5
      },
      { 
        id: "b", 
        text: "Ah, parabéns... que bom pra você.", 
        isCorrect: false, 
        feedback: "Muito frio e desinteressado. Demonstre mais entusiasmo e felicidade genuína.",
        naturalness: 2
      },
      { 
        id: "c", 
        text: "Nossa, você passou? Nossa, que surpresa! Não esperava mesmo!", 
        isCorrect: false, 
        feedback: "Soa como se você duvidasse da capacidade dele. Seja mais positivo e confiante.",
        naturalness: 1
      }
    ]
  }
];

export default function RolePlayBeginner() {
  const router = useRouter();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedRole, setSelectedRole] = useState<'protagonist' | 'supporting'>('protagonist');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [naturalness, setNaturalness] = useState(0);
  const [showRoleSelection, setShowRoleSelection] = useState(true);

  const scenario = rolePlayScenarios[currentScenario];

  const handleRoleSelect = (role: 'protagonist' | 'supporting') => {
    setSelectedRole(role);
    setShowRoleSelection(false);
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    const option = scenario.dialogueOptions.find(opt => opt.id === optionId);
    if (option?.isCorrect) {
      setScore(prev => prev + 1);
    }
    if (option?.naturalness) {
      setNaturalness(prev => prev + option.naturalness);
    }
  };

  const handleNextScenario = () => {
    if (currentScenario < rolePlayScenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedOption('');
      setShowFeedback(false);
      setShowRoleSelection(true);
    }
  };

  const resetActivity = () => {
    setCurrentScenario(0);
    setSelectedOption('');
    setShowFeedback(false);
    setScore(0);
    setNaturalness(0);
    setShowRoleSelection(true);
  };

  const finalScore = Math.round((score / rolePlayScenarios.length) * 100);
  const averageNaturalness = Math.round(naturalness / rolePlayScenarios.length);
  const isCompleted = currentScenario === rolePlayScenarios.length - 1 && showFeedback;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/structured-roleplay')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Voltar aos Níveis
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Role-Play - Básico</h1>
            <p className="text-gray-600">Dramatizações estruturadas para situações cotidianas</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Cenário: {currentScenario + 1}/{rolePlayScenarios.length}</div>
            <div className="text-lg font-semibold text-green-600">Score: {score}/{rolePlayScenarios.length}</div>
          </div>
        </div>

        {/* Progresso */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progresso da Dramatização</span>
            <span className="text-sm text-gray-600">{Math.round(((currentScenario + (showFeedback ? 1 : 0)) / rolePlayScenarios.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentScenario + (showFeedback ? 1 : 0)) / rolePlayScenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Seleção de Papel */}
        {showRoleSelection && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🎭 Escolha seu Papel</h2>
              <p className="text-gray-600">Para esta dramatização: "{scenario.title}"</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect('protagonist')}
                className="bg-green-100 hover:bg-green-200 border-2 border-green-300 rounded-lg p-4 transition-all"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🌟</div>
                  <h3 className="font-bold text-green-800 mb-1">Papel Principal</h3>
                  <p className="text-green-700 text-sm">{scenario.roles.protagonist}</p>
                </div>
              </button>
              
              <button
                onClick={() => handleRoleSelect('supporting')}
                className="bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-lg p-4 transition-all"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🎪</div>
                  <h3 className="font-bold text-blue-800 mb-1">Papel Secundário</h3>
                  <p className="text-blue-700 text-sm">{scenario.roles.supporting}</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Cenário Principal */}
        {!showRoleSelection && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{scenario.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{scenario.title}</h2>
              <p className="text-gray-600 text-lg mb-4">{scenario.situation}</p>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-green-800 font-semibold">
                  🎭 Seu papel: {selectedRole === 'protagonist' ? scenario.roles.protagonist : scenario.roles.supporting}
                </p>
              </div>
            </div>

            {/* Script Visual */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Script de Atuação - 5 passos estruturados:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {scenario.visualSteps.map((step) => (
                  <div key={step.step} className="text-center">
                    <div className="bg-white rounded-lg p-3 border-2 border-green-200 h-full">
                      <div className="text-2xl mb-2">{step.visual}</div>
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                        {step.step}
                      </div>
                      <p className="text-xs text-gray-700">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opções de Diálogo */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🗣️ Como você iniciaria esta interação?
              </h3>
              <div className="space-y-3">
                {scenario.dialogueOptions.map((option) => (
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
                      <span className="flex-1">"{option.text}"</span>
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
                scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.isCorrect
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-red-100 border border-red-300'
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.isCorrect
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}>
                  {scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.isCorrect ? 'Atuação natural! 🎭' : 'Vamos melhorar a interpretação 🎪'}
                </h4>
                <p className={scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.isCorrect ? 'text-green-700' : 'text-red-700'}>
                  {scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.feedback}
                </p>
                <div className="mt-3 bg-white bg-opacity-50 rounded p-2">
                  <p className="text-sm text-gray-700">
                    <strong>Naturalidade:</strong> {scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.naturalness}/5 ⭐
                  </p>
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-4 justify-center">
              {!isCompleted ? (
                <>
                  {showFeedback && currentScenario < rolePlayScenarios.length - 1 && (
                    <button
                      onClick={handleNextScenario}
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Próxima Dramatização →
                    </button>
                  )}
                  
                  <button
                    onClick={resetActivity}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Recomeçar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={resetActivity}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Recomeçar
                  </button>

                  <button
                    onClick={() => router.push('/structured-roleplay/intermediate')}
                    disabled={finalScore < 70}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      finalScore >= 70
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {finalScore >= 70 ? 'Próximo Nível →' : 'Pratique mais para avançar'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Resultado Final */}
        {isCompleted && (
          <div className={`rounded-xl border-2 p-6 ${
            finalScore >= 70 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <h3 className={`text-xl font-bold mb-3 ${
              finalScore >= 70 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {finalScore >= 70 ? 'Parabéns! Dramatização básica concluída! 🎭' : 'Continue praticando suas habilidades! 🎪'}
            </h3>
            <p className={`mb-4 ${finalScore >= 70 ? 'text-green-700' : 'text-yellow-700'}`}>
              Performance: {score} de {rolePlayScenarios.length} cenários ({finalScore}%)
              <br />
              Naturalidade média: {averageNaturalness}/5 ⭐
            </p>
            
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🎭 Habilidades de Dramatização Desenvolvidas:</h4>
              <div className="text-gray-700 text-sm space-y-1">
                <p>✓ <strong>Interpretação básica:</strong> Assumir papéis sociais de forma natural</p>
                <p>✓ <strong>Scripts estruturados:</strong> Seguir roteiros para situações cotidianas</p>
                <p>✓ <strong>Diálogos adequados:</strong> Escolher linguagem apropriada para cada contexto</p>
                <p>✓ <strong>Expressão natural:</strong> Comunicar de forma fluida e espontânea</p>
                <p>✓ <strong>Confiança social:</strong> Praticar interações em ambiente seguro</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}