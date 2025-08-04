'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RolePlayScenario {
  id: number;
  title: string;
  situation: string;
  icon: string;
  groupSize: string;
  complexity: string;
  roles: {
    leader: string;
    challenger: string;
    supporter: string;
    wildcard?: string;
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
    improvisation: number;
    leadership: number; // nova métrica: liderança 1-5
  }[];
}

const rolePlayScenarios: RolePlayScenario[] = [
  {
    id: 1,
    title: "Gerenciamento de Crise Organizacional",
    situation: "Uma crise inesperada atingiu a empresa. Stakeholders estão em pânico, mídia pressionando, e equipe precisa de direcionamento urgente.",
    icon: "🚨",
    groupSize: "8-12 pessoas",
    complexity: "Múltiplos stakeholders com interesses conflitantes",
    roles: {
      leader: "CEO em crise",
      challenger: "Jornalista agressivo",
      supporter: "Head de comunicação",
      wildcard: "Investidor preocupado"
    },
    visualSteps: [
      { step: 1, description: "Avalie rapidamente a situação", visual: "⚡" },
      { step: 2, description: "Assuma controle com transparência", visual: "🎯" },
      { step: 3, description: "Comunique-se com múltiplos públicos", visual: "📢" },
      { step: 4, description: "Gerencie emoções e expectativas", visual: "🧠" },
      { step: 5, description: "Mobilize recursos e soluções", visual: "🔧" },
      { step: 6, description: "Coordene esforços de recuperação", visual: "🤝" },
      { step: 7, description: "Estabeleça confiança renovada", visual: "🌟" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Reconheço a gravidade da situação. Assumo total responsabilidade e compartilho nosso plano de ação imediato. Transparência é nossa prioridade.",
        isCorrect: true, 
        feedback: "Liderança exemplar! Assumiu responsabilidade, demonstrou controle e compromisso com transparência.",
        naturalness: 5,
        improvisation: 4,
        leadership: 5
      },
      { 
        id: "b", 
        text: "Não foi culpa nossa, as circunstâncias eram imprevisíveis. Estamos fazendo o possível para resolver.",
        isCorrect: false, 
        feedback: "Defensivo e evasivo. Líderes em crise precisam assumir responsabilidade e focar em soluções.",
        naturalness: 2,
        improvisation: 2,
        leadership: 1
      },
      { 
        id: "c", 
        text: "Vamos aguardar mais informações antes de tomar qualquer decisão precipitada.",
        isCorrect: false, 
        feedback: "Passivo demais para uma crise. Stakeholders precisam de liderança decisiva e ação imediata.",
        naturalness: 3,
        improvisation: 1,
        leadership: 2
      }
    ]
  },
  {
    id: 2,
    title: "Negociação Multilateral Complexa",
    situation: "Fusão empresarial envolvendo 3 empresas, cada uma com culturas, expectativas e preocupações distintas.",
    icon: "🤝",
    groupSize: "9-12 pessoas",
    complexity: "Múltiplos interesses e culturas organizacionais",
    roles: {
      leader: "Mediador principal",
      challenger: "CEO resistente à fusão",
      supporter: "Advogado facilitador",
      wildcard: "Representante sindical"
    },
    visualSteps: [
      { step: 1, description: "Mapeie todos os interesses", visual: "🗺️" },
      { step: 2, description: "Estabeleça terreno comum", visual: "🏗️" },
      { step: 3, description: "Navegue diferenças culturais", visual: "🌍" },
      { step: 4, description: "Gerencie poder e influência", visual: "⚖️" },
      { step: 5, description: "Facilite concessões estratégicas", visual: "🎯" },
      { step: 6, description: "Construa consenso progressivo", visual: "🧩" },
      { step: 7, description: "Solidifique acordos win-win", visual: "🏆" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Cada empresa trouxe valor único. Vamos criar uma estrutura que preserve essas forças enquanto constrói sinergia. Ouçamos as preocupações específicas.",
        isCorrect: true, 
        feedback: "Excepcional! Valorizou diversidade, propôs integração sinérgica e criou espaço para todas as vozes.",
        naturalness: 5,
        improvisation: 5,
        leadership: 5
      },
      { 
        id: "b", 
        text: "Nossa empresa é líder de mercado. A fusão deve seguir nossos padrões e processos estabelecidos.",
        isCorrect: false, 
        feedback: "Dominante e inflexível. Negociações multilaterais exigem colaboração, não imposição.",
        naturalness: 3,
        improvisation: 2,
        leadership: 2
      },
      { 
        id: "c", 
        text: "Vamos dividir igualmente tudo: recursos, poder, responsabilidades. Meio a meio para todos.",
        isCorrect: false, 
        feedback: "Simplista demais. Fusões eficazes consideram competências, não apenas divisão matemática.",
        naturalness: 2,
        improvisation: 1,
        leadership: 2
      }
    ]
  },
  {
    id: 3,
    title: "Keynote para Audiência Diversa e Hostil",
    situation: "Você apresenta para 200+ pessoas com opiniões polarizadas sobre tema controverso. Alguns apoiam, outros são céticos ou hostis.",
    icon: "🎤",
    groupSize: "200+ pessoas (simulação com 8-10)",
    complexity: "Audiência grande, diversa e potencialmente hostil",
    roles: {
      leader: "Palestrante principal",
      challenger: "Questionador agressivo",
      supporter: "Admirador entusiasta",
      wildcard: "Especialista cético"
    },
    visualSteps: [
      { step: 1, description: "Conquiste credibilidade imediata", visual: "🏅" },
      { step: 2, description: "Reconheça diversidade de opiniões", visual: "🌈" },
      { step: 3, description: "Use storytelling envolvente", visual: "📖" },
      { step: 4, description: "Antecipe e endereçe objeções", visual: "🛡️" },
      { step: 5, description: "Mantenha controle da narrativa", visual: "🎭" },
      { step: 6, description: "Engaje com perguntas difíceis", visual: "❓" },
      { step: 7, description: "Encerre com call-to-action inspirador", visual: "🚀" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Sei que este tópico gera opiniões fortes. Respeito suas perspectivas. Compartilho dados, experiências, e depois ouviremos seus questionamentos.",
        isCorrect: true, 
        feedback: "Magistral! Reconheceu tensões, demonstrou respeito, estabeleceu autoridade e criou espaço para diálogo.",
        naturalness: 5,
        improvisation: 4,
        leadership: 5
      },
      { 
        id: "b", 
        text: "Sei que alguns discordam, mas os fatos são claros. Vou apresentar a verdade, gostem ou não.",
        isCorrect: false, 
        feedback: "Confrontativo e arrogante. Audiências hostis precisam de diplomacia, não imposição.",
        naturalness: 2,
        improvisation: 3,
        leadership: 2
      },
      { 
        id: "c", 
        text: "Tentarei não ofender ninguém. Se discordarem, tudo bem, cada um tem sua opinião.",
        isCorrect: false, 
        feedback: "Muito passivo e sem convicção. Líderes de opinião precisam de posicionamento claro mas respeitoso.",
        naturalness: 2,
        improvisation: 2,
        leadership: 1
      }
    ]
  },
  {
    id: 4,
    title: "Mediação de Conflito Organizacional Sistêmico",
    situation: "Departamentos em guerra há meses. Vendas vs Produto vs Operações. Produtividade caiu 40%, rotatividade aumentou.",
    icon: "🏢",
    groupSize: "10-15 pessoas",
    complexity: "Conflito estrutural com múltiplas camadas",
    roles: {
      leader: "Mediador externo",
      challenger: "Diretor de Vendas (agressivo)",
      supporter: "Head de RH (facilitador)",
      wildcard: "Funcionário junior (vítima do conflito)"
    },
    visualSteps: [
      { step: 1, description: "Diagnose raízes sistêmicas", visual: "🔍" },
      { step: 2, description: "Neutralize emoções acumuladas", visual: "❄️" },
      { step: 3, description: "Facilite escuta empática mútua", visual: "💭" },
      { step: 4, description: "Identifique interesses compartilhados", visual: "🎯" },
      { step: 5, description: "Redesenhe estruturas e processos", visual: "🔧" },
      { step: 6, description: "Estabeleça novos protocolos", visual: "📋" },
      { step: 7, description: "Monitore e ajuste continuamente", visual: "📊" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "O conflito revela problemas estruturais, não pessoais. Vamos redesenhar como colaboramos, com métricas compartilhadas e comunicação transparente.",
        isCorrect: true, 
        feedback: "Perspectiva sistêmica brilhante! Focou em estruturas, não culpados, e propôs soluções sustentáveis.",
        naturalness: 5,
        improvisation: 4,
        leadership: 5
      },
      { 
        id: "b", 
        text: "Vocês são adultos profissionais. Parem de brigar e façam seu trabalho. A empresa está perdendo dinheiro.",
        isCorrect: false, 
        feedback: "Superficial e autoritário. Conflitos sistêmicos precisam de intervenção estrutural, não sermão.",
        naturalness: 2,
        improvisation: 1,
        leadership: 1
      },
      { 
        id: "c", 
        text: "Vamos fazer dinâmicas de team building. Um happy hour pode melhorar a relação entre vocês.",
        isCorrect: false, 
        feedback: "Abordagem superficial. Conflitos organizacionais requerem mudanças estruturais, não apenas sociais.",
        naturalness: 3,
        improvisation: 2,
        leadership: 2
      }
    ]
  },
  {
    id: 5,
    title: "Evento Social com Múltiplas Dinâmicas",
    situation: "Gala beneficente com 150 convidados: políticos, empresários, celebridades, ativistas. Tensões sociais e políticas latentes.",
    icon: "🎭",
    groupSize: "150+ pessoas (simulação com 10-12)",
    complexity: "Múltiplas personalidades e agendas sociais/políticas",
    roles: {
      leader: "Anfitrião/Master de Cerimônias",
      challenger: "Político controverso",
      supporter: "Filantropo influente",
      wildcard: "Jornalista investigativo"
    },
    visualSteps: [
      { step: 1, description: "Orquestre atmosfera inclusiva", visual: "🎨" },
      { step: 2, description: "Navegue hierarquias sociais", visual: "🏛️" },
      { step: 3, description: "Facilite networking estratégico", visual: "🤝" },
      { step: 4, description: "Gerencie conversas sensíveis", visual: "🎪" },
      { step: 5, description: "Mantenha foco na causa", visual: "❤️" },
      { step: 6, description: "Mediate conflitos discretamente", visual: "🕊️" },
      { step: 7, description: "Inspire ação coletiva", visual: "🌟" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "Que privilégio ter todos unidos por uma causa maior que nossas diferenças. Esta noite celebramos nossa humanidade compartilhada.",
        isCorrect: true, 
        feedback: "Liderança inspiracional! Elevou o discurso, unificou propósito e transcendeu divisões políticas.",
        naturalness: 5,
        improvisation: 5,
        leadership: 5
      },
      { 
        id: "b", 
        text: "Bem-vindos! Vamos evitar tópicos polêmicos hoje e focar apenas na festa e diversão.",
        isCorrect: false, 
        feedback: "Evita responsabilidade. Líderes sociais usam eventos para inspirar, não apenas entreter.",
        naturalness: 3,
        improvisation: 2,
        leadership: 2
      },
      { 
        id: "c", 
        text: "Esta é uma oportunidade para discutirmos as questões importantes que dividem nossa sociedade.",
        isCorrect: false, 
        feedback: "Perigoso em evento social. Pode gerar conflitos desnecessários. Foque na causa unificadora.",
        naturalness: 2,
        improvisation: 3,
        leadership: 2
      }
    ]
  },
  {
    id: 6,
    title: "Situação de Emergência Social Coletiva",
    situation: "Emergência durante evento: incêndio em prédio com 500+ pessoas. Pânico, evacuação, comunicação com autoridades, gestão de trauma coletivo.",
    icon: "🚨",
    groupSize: "500+ pessoas (simulação com 12-15)",
    complexity: "Emergência real com múltiplas responsabilidades",
    roles: {
      leader: "Coordenador de emergência",
      challenger: "Pessoa em pânico extremo",
      supporter: "Bombeiro/Segurança",
      wildcard: "Criança perdida dos pais"
    },
    visualSteps: [
      { step: 1, description: "Mantenha calma absoluta", visual: "🧘" },
      { step: 2, description: "Assuma comando imediato", visual: "👑" },
      { step: 3, description: "Comunique instruções claras", visual: "📢" },
      { step: 4, description: "Coordene com autoridades", visual: "📞" },
      { step: 5, description: "Gerencie pânico coletivo", visual: "🫂" },
      { step: 6, description: "Priorize vidas vulneráveis", visual: "❤️" },
      { step: 7, description: "Acompanhe recuperação emocional", visual: "🌈" }
    ],
    dialogueOptions: [
      { 
        id: "a", 
        text: "ATENÇÃO! Emergência controlada. Sigam as luzes de saída, andem, não corram. Bombeiros a caminho. Mantenham calma, todos sairemos seguros.",
        isCorrect: true, 
        feedback: "Liderança de emergência perfeita! Comando claro, instruções específicas, tranquilizou sem minimizar.",
        naturalness: 5,
        improvisation: 5,
        leadership: 5
      },
      { 
        id: "b", 
        text: "CORRAM! SAIAM TODOS AGORA! RÁPIDO, RÁPIDO!",
        isCorrect: false, 
        feedback: "Aumenta pânico e pode causar acidentes. Líderes de emergência mantêm calma e direcionam com clareza.",
        naturalness: 1,
        improvisation: 1,
        leadership: 1
      },
      { 
        id: "c", 
        text: "Não sei o que está acontecendo, mas acho melhor sairmos devagar...",
        isCorrect: false, 
        feedback: "Insegurança em emergência pode ser fatal. Líderes devem assumir comando mesmo com informações limitadas.",
        naturalness: 2,
        improvisation: 2,
        leadership: 1
      }
    ]
  }
];

export default function RolePlayAdvanced() {
  const router = useRouter();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedRole, setSelectedRole] = useState<'leader' | 'challenger' | 'supporter' | 'wildcard'>('leader');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [naturalness, setNaturalness] = useState(0);
  const [improvisation, setImprovisation] = useState(0);
  const [leadership, setLeadership] = useState(0);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const [showTrophy, setShowTrophy] = useState(false);

  const scenario = rolePlayScenarios[currentScenario];

  const handleRoleSelect = (role: 'leader' | 'challenger' | 'supporter' | 'wildcard') => {
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
    if (option?.leadership) {
      setLeadership(prev => prev + option.leadership);
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
    setLeadership(0);
    setShowRoleSelection(true);
    setShowTrophy(false);
  };

  const finalScore = Math.round((score / rolePlayScenarios.length) * 100);
  const averageNaturalness = Math.round(naturalness / rolePlayScenarios.length);
  const averageImprovisation = Math.round(improvisation / rolePlayScenarios.length);
  const averageLeadership = Math.round(leadership / rolePlayScenarios.length);
  const isCompleted = currentScenario === rolePlayScenarios.length - 1 && showFeedback;
  const hasEarnedTrophy = finalScore >= 80; // Nível avançado exige 80%

  useEffect(() => {
    if (isCompleted && hasEarnedTrophy) {
      const timer = setTimeout(() => setShowTrophy(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, hasEarnedTrophy]);

  const getRoleLabel = () => {
    switch(selectedRole) {
      case 'leader': return scenario.roles.leader;
      case 'challenger': return scenario.roles.challenger;
      case 'supporter': return scenario.roles.supporter;
      case 'wildcard': return scenario.roles.wildcard || 'Papel especial';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Trophy Modal */}
        {showTrophy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center animate-bounce">
              <div className="text-8xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">PARABÉNS!</h3>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Mestre da Dramatização e Liderança!</h4>
              <p className="text-gray-600 mb-4">
                Você dominou todos os níveis do Role-Play Estruturado!
              </p>
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-purple-800">
                  <strong>Conquista Desbloqueada:</strong><br/>
                  "Expert em Performance e Liderança Social"<br/>
                  Score Final: {finalScore}%<br/>
                  Liderança: {averageLeadership}/5 ⭐
                </p>
              </div>
              <button
                onClick={() => setShowTrophy(false)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

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
            <h1 className="text-3xl font-bold text-gray-800">Role-Play - Avançado</h1>
            <p className="text-gray-600">Dramatizações complexas e liderança situacional</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Cenário: {currentScenario + 1}/{rolePlayScenarios.length}</div>
            <div className="text-lg font-semibold text-purple-600">Score: {score}/{rolePlayScenarios.length}</div>
          </div>
        </div>

        {/* Progresso */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progresso Dramatização Avançada</span>
            <span className="text-sm text-gray-600">{Math.round(((currentScenario + (showFeedback ? 1 : 0)) / rolePlayScenarios.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-400 to-indigo-500 h-3 rounded-full transition-all duration-300"
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
              <div className="flex justify-center gap-4 text-sm">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">👥 {scenario.groupSize}</span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">🧠 {scenario.complexity}</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-3">
              <button
                onClick={() => handleRoleSelect('leader')}
                className="bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 rounded-lg p-4 transition-all"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">👑</div>
                  <h3 className="font-bold text-purple-800 mb-1">Líder</h3>
                  <p className="text-purple-700 text-xs">{scenario.roles.leader}</p>
                </div>
              </button>
              
              <button
                onClick={() => handleRoleSelect('challenger')}
                className="bg-red-100 hover:bg-red-200 border-2 border-red-300 rounded-lg p-4 transition-all"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-bold text-red-800 mb-1">Desafiador</h3>
                  <p className="text-red-700 text-xs">{scenario.roles.challenger}</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('supporter')}
                className="bg-green-100 hover:bg-green-200 border-2 border-green-300 rounded-lg p-4 transition-all"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🤝</div>
                  <h3 className="font-bold text-green-800 mb-1">Apoiador</h3>
                  <p className="text-green-700 text-xs">{scenario.roles.supporter}</p>
                </div>
              </button>

              {scenario.roles.wildcard && (
                <button
                  onClick={() => handleRoleSelect('wildcard')}
                  className="bg-orange-100 hover:bg-orange-200 border-2 border-orange-300 rounded-lg p-4 transition-all"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎲</div>
                    <h3 className="font-bold text-orange-800 mb-1">Wildcard</h3>
                    <p className="text-orange-700 text-xs">{scenario.roles.wildcard}</p>
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
              <div className="flex justify-center gap-3 flex-wrap">
                <div className="bg-purple-50 rounded-lg p-2">
                  <p className="text-purple-800 font-semibold text-sm">
                    🎭 {getRoleLabel()}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="text-blue-800 font-semibold text-sm">
                    👥 {scenario.groupSize}
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-2">
                  <p className="text-indigo-800 font-semibold text-sm">
                    🧠 {scenario.complexity}
                  </p>
                </div>
              </div>
            </div>

            {/* Script Visual Avançado */}
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Estratégia de Liderança - 7 dimensões avançadas:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {scenario.visualSteps.map((step) => (
                  <div key={step.step} className="text-center">
                    <div className="bg-white rounded-lg p-3 border-2 border-purple-200 h-full">
                      <div className="text-xl mb-2">{step.visual}</div>
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xs font-bold">
                        {step.step}
                      </div>
                      <p className="text-xs text-gray-700">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opções de Diálogo Avançadas */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🗣️ Como você lideraria esta situação complexa?
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
                        : 'border-gray-200 hover:border-purple-300 text-gray-800'
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

            {/* Feedback Avançado */}
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
                  {scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.isCorrect ? 'Liderança excepcional! 👑' : 'Vamos refinar a liderança 🎭'}
                </h4>
                <p className={scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.isCorrect ? 'text-green-700' : 'text-red-700'}>
                  {scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.feedback}
                </p>
                <div className="mt-3 bg-white bg-opacity-50 rounded p-3 grid grid-cols-3 gap-4">
                  <p className="text-sm text-gray-700">
                    <strong>Naturalidade:</strong> {scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.naturalness}/5 ⭐
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Improvisação:</strong> {scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.improvisation}/5 🎨
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Liderança:</strong> {scenario.dialogueOptions.find(opt => opt.id === selectedOption)?.leadership}/5 👑
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
                      className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
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
                    onClick={() => router.push('/structured-roleplay')}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Voltar ao Menu
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Resultado Final */}
        {isCompleted && (
          <div className={`rounded-xl border-2 p-6 ${
            hasEarnedTrophy ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <h3 className={`text-xl font-bold mb-3 ${
              hasEarnedTrophy ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {hasEarnedTrophy ? 'Maestria em Liderança e Dramatização! 🏆' : 'Continue desenvolvendo sua liderança! 👑'}
            </h3>
            <p className={`mb-4 ${hasEarnedTrophy ? 'text-green-700' : 'text-yellow-700'}`}>
              Performance: {score} de {rolePlayScenarios.length} cenários ({finalScore}%)
              <br />
              Naturalidade: {averageNaturalness}/5 ⭐ | Improvisação: {averageImprovisation}/5 🎨 | Liderança: {averageLeadership}/5 👑
            </p>
            
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🎭 Competências Avançadas de Liderança Desenvolvidas:</h4>
              <div className="text-gray-700 text-sm space-y-1">
                <p>✓ <strong>Liderança de crise:</strong> Gestão eficaz em situações de emergência e pressão</p>
                <p>✓ <strong>Negociação multilateral:</strong> Mediação entre múltiplos stakeholders complexos</p>
                <p>✓ <strong>Oratória avançada:</strong> Apresentação para audiências grandes e hostis</p>
                <p>✓ <strong>Mediação sistêmica:</strong> Resolução de conflitos organizacionais estruturais</p>
                <p>✓ <strong>Facilitação social:</strong> Orquestração de eventos com múltiplas dinâmicas</p>
                <p>✓ <strong>Comando emergencial:</strong> Liderança decisiva em situações críticas</p>
                <p>✓ <strong>Inteligência situacional:</strong> Adaptação instantânea a contextos complexos</p>
              </div>
              
              {hasEarnedTrophy && (
                <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                  <p className="text-purple-800 font-semibold text-center">
                    🎉 CONQUISTA DESBLOQUEADA: "Mestre da Dramatização e Liderança" 🎉
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}