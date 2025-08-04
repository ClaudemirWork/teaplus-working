'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RolePlayScenario {
  id: number;
  title: string;
  situation: string;
  icon: string;
  groupSize: string;
  roles: {
    primary: string;
    secondary: string;
    observer?: string;
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
    naturalness: number;
    improvisation: number; // novo: nível de improvisação 1-5
  }[];
}

const rolePlayScenarios: RolePlayScenario[] = [
  {
    id: 1,
    title: "Reunião de Trabalho em Equipe",
    situation: "Você participa de uma reunião para decidir estratégias para um projeto importante. Há discordâncias na equipe.",
    icon: "💼",
    groupSize: "3-4 pessoas",
    roles: {
      primary: "Coordenador da discussão",
      secondary: "Membro com opinião divergente",
      observer: "Mediador neutro"
    },
    visualSteps: [
      { step: 1, description: "Estabeleça ambiente respeitoso", visual: "🤝" },
      { step: 2, description: "Ouça todas as perspectivas", visual: "👂" },
      { step: 3, description: "Gerencie divergências diplomaticamente", visual: "⚖️" },
      { step: 4, description: "Proponha soluções criativas", visual: "💡" },
      { step: 5, description: "Busque consenso ou compromisso", visual: "🎯" },
      { step: 6, description: "Defina próximos passos claros", visual: "📋" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Entendo as preocupações de todos. Que tal explorarmos uma abordagem híbrida que combine essas ideias?", 
        isCorrect: true, 
        feedback: "Excelente! Validou opiniões divergentes e propôs solução criativa e colaborativa.",
        naturalness: 5,
        improvisation: 4
      },
      { 
        id: "b", 
        text: "Acho que devemos votar e a maioria decide. É mais prático.", 
        isCorrect: false, 
        feedback: "Muito direto e pode gerar ressentimento. Busque consenso antes de partir para votação.",
        naturalness: 3,
        improvisation: 2
      },
      { 
        id: "c", 
        text: "Vocês estão complicando demais. A minha proposta inicial é a melhor mesmo.", 
        isCorrect: false, 
        feedback: "Inflexível e descarta contribuições dos outros. Seja mais colaborativo e aberto.",
        naturalness: 2,
        improvisation: 1
      }
    ]
  },
  {
    id: 2,
    title: "Organizando Festa de Aniversário Surpresa",
    situation: "Você e amigos estão planejando uma festa surpresa. Precisam coordenar tarefas e manter sigilo.",
    icon: "🎂",
    groupSize: "4-5 pessoas",
    roles: {
      primary: "Organizador principal",
      secondary: "Responsável por logística",
      observer: "Guardião do sigilo"
    },
    visualSteps: [
      { step: 1, description: "Distribua responsabilidades claramente", visual: "📝" },
      { step: 2, description: "Estabeleça canais de comunicação seguros", visual: "🤫" },
      { step: 3, description: "Coordene timeline e deadlines", visual: "⏰" },
      { step: 4, description: "Gerencie imprevistos com flexibilidade", visual: "🔄" },
      { step: 5, description: "Mantenha entusiasmo do grupo", visual: "✨" },
      { step: 6, description: "Execute plano com precisão", visual: "🎯" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Pessoal, vamos criar um grupo só nosso para combinar tudo. Maria, você pode ficar com decoração? João, que tal cuidar da música?", 
        isCorrect: true, 
        feedback: "Perfeito! Organizou comunicação, delegou tarefas específicas e envolveu todos ativamente.",
        naturalness: 5,
        improvisation: 3
      },
      { 
        id: "b", 
        text: "Eu organizo tudo sozinho, vocês só me ajudem quando eu pedir, ok?", 
        isCorrect: false, 
        feedback: "Muito centralizador. Eventos de grupo funcionam melhor com responsabilidades compartilhadas.",
        naturalness: 2,
        improvisation: 1
      },
      { 
        id: "c", 
        text: "Vamos improvisar no dia, vai ficar mais espontâneo e divertido!", 
        isCorrect: false, 
        feedback: "Festas surpresa precisam de planejamento. Improvisação excessiva pode gerar problemas.",
        naturalness: 3,
        improvisation: 5
      }
    ]
  },
  {
    id: 3,
    title: "Mediando Conflito Entre Amigos",
    situation: "Dois amigos próximos brigaram e você precisa ajudar a resolver, mantendo neutralidade.",
    icon: "🕊️",
    groupSize: "3 pessoas",
    roles: {
      primary: "Mediador imparcial",
      secondary: "Amigo A (chateado)",
      observer: "Amigo B (defensivo)"
    },
    visualSteps: [
      { step: 1, description: "Crie ambiente seguro para diálogo", visual: "🏠" },
      { step: 2, description: "Estabeleça regras de comunicação", visual: "📏" },
      { step: 3, description: "Facilite escuta ativa mútua", visual: "👂" },
      { step: 4, description: "Identifique pontos de convergência", visual: "🔍" },
      { step: 5, description: "Guie para soluções construtivas", visual: "🌉" },
      { step: 6, description: "Consolide reconciliação", visual: "🤗" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Vocês dois são importantes para mim. Vamos tentar entender o que realmente aconteceu, cada um fala sua versão sem interrupções.", 
        isCorrect: true, 
        feedback: "Excelente mediação! Demonstrou cuidado, estabeleceu processo justo e criou espaço seguro.",
        naturalness: 5,
        improvisation: 4
      },
      { 
        id: "b", 
        text: "Cara, vocês são adultos, resolvam isso sozinhos. Não vou me meter.", 
        isCorrect: false, 
        feedback: "Evitou responsabilidade. Amigos próximos às vezes precisam de ajuda para mediar conflitos.",
        naturalness: 2,
        improvisation: 1
      },
      { 
        id: "c", 
        text: "Eu já sei quem está certo nessa história. [Nome], você deveria pedir desculpas.", 
        isCorrect: false, 
        feedback: "Tomou partido prematuramente. Mediadores eficazes mantêm neutralidade e facilitam compreensão mútua.",
        naturalness: 3,
        improvisation: 2
      }
    ]
  },
  {
    id: 4,
    title: "Apresentação de Projeto para Cliente",
    situation: "Você lidera uma apresentação importante para cliente em potencial, com sua equipe presente.",
    icon: "📊",
    groupSize: "3-4 pessoas + cliente",
    roles: {
      primary: "Líder da apresentação",
      secondary: "Especialista técnico",
      observer: "Cliente crítico"
    },
    visualSteps: [
      { step: 1, description: "Aqueça ambiente e rapport", visual: "🔥" },
      { step: 2, description: "Estruture apresentação claramente", visual: "🏗️" },
      { step: 3, description: "Integre participações da equipe", visual: "🎭" },
      { step: 4, description: "Responda objeções com segurança", visual: "🛡️" },
      { step: 5, description: "Demonstre valor e benefícios", visual: "💎" },
      { step: 6, description: "Encaminhe próximos passos", visual: "🚀" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Obrigado por seu tempo. Preparamos uma apresentação focada em suas necessidades específicas. João vai começar com análise técnica.", 
        isCorrect: true, 
        feedback: "Perfeito! Agradeceu, contextualizou valor, e integrou equipe de forma natural e profissional.",
        naturalness: 5,
        improvisation: 3
      },
      { 
        id: "b", 
        text: "Vamos direto ao que interessa: nosso produto é o melhor do mercado e você precisa dele.", 
        isCorrect: false, 
        feedback: "Muito agressivo e presunçoso. Clientes valorizam abordagens consultivas, não vendas pressão.",
        naturalness: 2,
        improvisation: 2
      },
      { 
        id: "c", 
        text: "Hm... então... preparamos uma apresentação... não sei se vai interessar muito, mas...", 
        isCorrect: false, 
        feedback: "Insegurança excessiva mina credibilidade. Seja confiante sobre valor que você oferece.",
        naturalness: 1,
        improvisation: 1
      }
    ]
  },
  {
    id: 5,
    title: "Workshop Criativo com Divergências",
    situation: "Você facilita workshop de brainstorming onde as ideias estão muito dispersas e há tensão criativa.",
    icon: "🎨",
    groupSize: "5-6 pessoas",
    roles: {
      primary: "Facilitador criativo",
      secondary: "Participante crítico",
      observer: "Idealista sonhador"
    },
    visualSteps: [
      { step: 1, description: "Energize e alinhe objetivos", visual: "⚡" },
      { step: 2, description: "Estabeleça ambiente de abertura", visual: "🌈" },
      { step: 3, description: "Facilite geração livre de ideias", visual: "💭" },
      { step: 4, description: "Gerencie críticas construtivamente", visual: "🔧" },
      { step: 5, description: "Sintetize e priorize conceitos", visual: "🎯" },
      { step: 6, description: "Engaje todos na construção", visual: "🏗️" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Vamos parar um momento e ouvir todas as perspectivas. Críticas são valiosas, mas que tal reformularmos como 'como podemos melhorar'?", 
        isCorrect: true, 
        feedback: "Excelente facilitação! Reorientou críticas para construção e manteve ambiente criativo positivo.",
        naturalness: 5,
        improvisation: 5
      },
      { 
        id: "b", 
        text: "Gente, vamos focar! Estamos perdendo tempo com discussões. Decidam logo uma ideia.", 
        isCorrect: false, 
        feedback: "Muito impaciente. Workshops criativos precisam de tempo para exploração e desenvolvimento de ideias.",
        naturalness: 3,
        improvisation: 2
      },
      { 
        id: "c", 
        text: "Tudo bem, cada um trabalha na sua ideia preferida e depois vemos o que saiu.", 
        isCorrect: false, 
        feedback: "Perdeu oportunidade de colaboração. Facilitadores devem promover trabalho conjunto, não isolado.",
        naturalness: 2,
        improvisation: 3
      }
    ]
  },
  {
    id: 6,
    title: "Jantar com Família Estendida",
    situation: "Reunião familiar onde há gerações diferentes, opiniões políticas divergentes e alguns conflitos antigos.",
    icon: "🍽️",
    groupSize: "6-8 pessoas",
    roles: {
      primary: "Mediador familiar",
      secondary: "Parente polêmico",
      observer: "Jovem desconfortável"
    },
    visualSteps: [
      { step: 1, description: "Crie atmosfera acolhedora", visual: "🏡" },
      { step: 2, description: "Redirecione tópicos sensíveis", visual: "🧭" },
      { step: 3, description: "Inclua todos nas conversas", visual: "👨‍👩‍👧‍👦" },
      { step: 4, description: "Valorize pontos em comum", visual: "❤️" },
      { step: 5, description: "Desvie de conflitos desnecessários", visual: "🛤️" },
      { step: 6, description: "Encerre com harmonia", visual: "🕊️" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Que bom ter todo mundo aqui! Vó, conta aquela história engraçada da sua juventude. A Ana ainda não conhece!", 
        isCorrect: true, 
        feedback: "Perfeito! Redirecionou para tópico familiar positivo e incluiu quem está de fora das conversas.",
        naturalness: 5,
        improvisation: 4
      },
      { 
        id: "b", 
        text: "Tio, você sempre tem essas opiniões polêmicas. Não podemos ter uma refeição em paz?", 
        isCorrect: false, 
        feedback: "Confrontou diretamente e pode escalar conflito. Melhor redirecionar sutilmente para outros tópicos.",
        naturalness: 2,
        improvisation: 2
      },
      { 
        id: "c", 
        text: "Fica quieto e espera a situação se resolver sozinha", 
        isCorrect: false, 
        feedback: "Perdeu oportunidade de facilitar harmonia familiar. Mediadores ativos ajudam criar ambiente positivo.",
        naturalness: 1,
        improvisation: 1
      }
    ]
  }
];

export default function RolePlayIntermediate() {
  const router = useRouter();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedRole, setSelectedRole] = useState<'primary' | 'secondary' | 'observer'>('primary');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [naturalness, setNaturalness] = useState(0);
  const [improvisation, setImprovisation] = useState(0);
  const [showRoleSelection, setShowRoleSelection] = useState(true);

  const scenario = rolePlayScenarios[currentScenario];

  const handleRoleSelect = (role: 'primary' | 'secondary' | 'observer') => {
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
    if (option?.improvisation) {
      setImprovisation(prev => prev + option.improvisation);
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
    setImprovisation(0);
    setShowRoleSelection(true);
  };

  const finalScore = Math.round((score / rolePlayScenarios.length) * 100);
  const averageNaturalness = Math.round(naturalness / rolePlayScenarios.length);
  const averageImprovisation = Math.round(improvisation / rolePlayScenarios.length);
  const isCompleted = currentScenario === rolePlayScenarios.length - 1 && showFeedback;

  const getRoleLabel = () => {
    switch(selectedRole) {
      case 'primary': return scenario.roles.primary;
      case 'secondary': return scenario.roles.secondary;
      case 'observer': return scenario.roles.observer || 'Observador';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-6">
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
            <h1 className="text-3xl font-bold text-gray-800">Role-Play - Intermediário</h1>
            <p className="text-gray-600">Dramatizações em grupo e improvisação controlada</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Cenário: {currentScenario + 1}/{rolePlayScenarios.length}</div>
            <div className="text-lg font-semibold text-orange-600">Score: {score}/{rolePlayScenarios.length}</div>
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
              className="bg-gradient-to-r from-orange-400 to-amber-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentScenario + (showFeedback ? 1 : 0)) / rolePlayScenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Seleção de Papel */}
        {showRoleSelection && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🎭 Escolha seu Papel</h2>
              <p className="text-gray-600 mb-2">"{scenario.title}"</p>
              <p className="text-sm text-orange-600">👥 Tamanho do grupo: {scenario.groupSize}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => handleRoleSelect('primary')}
                className="bg-orange-100 hover:bg-orange-200 border-2 border-orange-300 rounded-lg p-4 transition-all"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🌟</div>
                  <h3 className="font-bold text-orange-800 mb-1">Papel Principal</h3>
                  <p className="text-orange-700 text-sm">{scenario.roles.primary}</p>
                </div>
              </button>
              
              <button
                onClick={() => handleRoleSelect('secondary')}
                className="bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-lg p-4 transition-all"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🎪</div>
                  <h3 className="font-bold text-blue-800 mb-1">Papel Secundário</h3>
                  <p className="text-blue-700 text-sm">{scenario.roles.secondary}</p>
                </div>
              </button>

              {scenario.roles.observer && (
                <button
                  onClick={() => handleRoleSelect('observer')}
                  className="bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 rounded-lg p-4 transition-all"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">👁️</div>
                    <h3 className="font-bold text-purple-800 mb-1">Observador</h3>
                    <p className="text-purple-700 text-sm">{scenario.roles.observer}</p>
                  </div>
                </button>
              )}
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
              <div className="flex justify-center gap-4">
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-orange-800 font-semibold">
                    🎭 Seu papel: {getRoleLabel()}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-blue-800 font-semibold">
                    👥 Grupo: {scenario.groupSize}
                  </p>
                </div>
              </div>
            </div>

            {/* Script Visual */}
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Script de Facilitação - 6 passos estruturados:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
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

            {/* Opções de Diálogo */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🗣️ Como você facilitaria esta situação em grupo?
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
                        : 'border-gray-200 hover:border-orange-300 text-gray-800'
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
                  {scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.isCorrect ? 'Facilitação exemplar! 🎭' : 'Vamos refinar a abordagem 🎪'}
                </h4>
                <p className={scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.isCorrect ? 'text-green-700' : 'text-red-700'}>
                  {scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.feedback}
                </p>
                <div className="mt-3 bg-white bg-opacity-50 rounded p-3 grid grid-cols-2 gap-4">
                  <p className="text-sm text-gray-700">
                    <strong>Naturalidade:</strong> {scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.naturalness}/5 ⭐
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Improvisação:</strong> {scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.improvisation}/5 🎨
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
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
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
                    onClick={() => router.push('/structured-roleplay/advanced')}
                    disabled={finalScore < 70}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      finalScore >= 70
                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
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
            finalScore >= 70 ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <h3 className={`text-xl font-bold mb-3 ${
              finalScore >= 70 ? 'text-orange-600' : 'text-yellow-600'
            }`}>
              {finalScore >= 70 ? 'Parabéns! Facilitação em grupo dominada! 🎭' : 'Continue praticando facilitação! 🎪'}
            </h3>
            <p className={`mb-4 ${finalScore >= 70 ? 'text-orange-700' : 'text-yellow-700'}`}>
              Performance: {score} de {rolePlayScenarios.length} cenários ({finalScore}%)
              <br />
              Naturalidade: {averageNaturalness}/5 ⭐ | Improvisação: {averageImprovisation}/5 🎨
            </p>
            
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🎭 Habilidades de Facilitação Desenvolvidas:</h4>
              <div className="text-gray-700 text-sm space-y-1">
                <p>✓ <strong>Facilitação de grupos:</strong> Liderar e mediar discussões produtivas</p>
                <p>✓ <strong>Gestão de conflitos:</strong> Transformar tensões em colaboração</p>
                <p>✓ <strong>Improvisação controlada:</strong> Adaptar-se a situações inesperadas</p>
                <p>✓ <strong>Comunicação multi-dimensional:</strong> Gerenciar múltiplas perspectivas</p>
                <p>✓ <strong>Liderança situacional:</strong> Assumir papéis de acordo com necessidades</p>
                <p>✓ <strong>Inteligência social:</strong> Ler dinâmicas e responder adequadamente</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}