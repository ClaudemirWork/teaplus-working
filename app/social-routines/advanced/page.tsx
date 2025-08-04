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
    title: "Navegando Sarcasmo e Ironia",
    situation: "Um colega faz um comentário que pode ser sarcástico sobre seu trabalho: 'Nossa, que ideia brilhante!' com tom duvidoso",
    icon: "🎭",
    visualSteps: [
      { step: 1, description: "Analise o tom de voz", visual: "🎵" },
      { step: 2, description: "Observe expressões faciais", visual: "😏" },
      { step: 3, description: "Considere o contexto", visual: "🔍" },
      { step: 4, description: "Avalie a linguagem corporal", visual: "👁️" },
      { step: 5, description: "Responda apropriadamente", visual: "💭" },
      { step: 6, description: "Mantenha profissionalismo", visual: "🤝" }
    ],
    options: [
      { id: "a", text: "Obrigado! Realmente acho que vai funcionar bem.", isCorrect: false, feedback: "Cuidado! Pode ter sido sarcasmo. Melhor verificar a intenção antes de assumir elogio." },
      { id: "b", text: "Percebi um tom diferente. Você tem alguma preocupação sobre a ideia?", isCorrect: true, feedback: "Excelente! Reconheceu a possível ironia e abriu espaço para diálogo construtivo." },
      { id: "c", text: "Não precisa ser irônico. Se não gosta, só falar.", isCorrect: false, feedback: "Muito direto e pode gerar conflito. Melhor abordar com mais diplomacia." }
    ]
  },
  {
    id: 2,
    title: "Recebendo Críticas Construtivas",
    situation: "Seu supervisor te chama para conversar sobre aspectos do seu trabalho que precisam melhorar",
    icon: "📈",
    visualSteps: [
      { step: 1, description: "Mantenha mente aberta", visual: "🧠" },
      { step: 2, description: "Escute ativamente", visual: "👂" },
      { step: 3, description: "Controle reações defensivas", visual: "🛡️" },
      { step: 4, description: "Faça perguntas clarificadoras", visual: "❓" },
      { step: 5, description: "Demonstre receptividade", visual: "✅" },
      { step: 6, description: "Planeje ações de melhoria", visual: "📋" }
    ],
    options: [
      { id: "a", text: "Mas eu sempre fiz assim e nunca deu problema!", isCorrect: false, feedback: "Resposta defensiva. Foque em entender o feedback e crescer com ele." },
      { id: "b", text: "Entendo. Pode me dar exemplos específicos para eu melhorar?", isCorrect: true, feedback: "Perfeito! Demonstra maturidade e vontade genuína de melhorar." },
      { id: "c", text: "Tá bom, vou tentar mudar.", isCorrect: false, feedback: "Muito passivo. Mostre mais engajamento e busque entender detalhes." }
    ]
  },
  {
    id: 3,
    title: "Mediando Conflito Entre Amigos",
    situation: "Dois amigos seus estão brigados e ambos vêm desabafar com você, esperando que você 'tome um lado'",
    icon: "⚖️",
    visualSteps: [
      { step: 1, description: "Mantenha neutralidade", visual: "🏳️" },
      { step: 2, description: "Ouça ambos os lados", visual: "👥" },
      { step: 3, description: "Identifique pontos em comum", visual: "🔗" },
      { step: 4, description: "Evite tomar partido", visual: "🚫" },
      { step: 5, description: "Sugira comunicação direta", visual: "🗨️" },
      { step: 6, description: "Ofereça suporte imparcial", visual: "🤲" }
    ],
    options: [
      { id: "a", text: "Vocês dois são meus amigos. Que tal conversarem diretamente?", isCorrect: true, feedback: "Excelente! Manteve neutralidade e incentivou resolução direta do conflito." },
      { id: "b", text: "O [nome] está certo mesmo, você deveria pedir desculpas.", isCorrect: false, feedback: "Evite tomar partido. Isso pode prejudicar sua amizade com ambos." },
      { id: "c", text: "Não quero me meter nessa briga de vocês.", isCorrect: false, feedback: "Muito frio. Você pode ajudar sem tomar partido, oferecendo apoio." }
    ]
  },
  {
    id: 4,
    title: "Liderando uma Apresentação em Grupo",
    situation: "Você foi escolhido para liderar uma apresentação importante onde um membro da equipe está nervoso e outro dominando demais",
    icon: "👨‍💼",
    visualSteps: [
      { step: 1, description: "Estabeleça o tom inclusivo", visual: "🌟" },
      { step: 2, description: "Distribua tempo equitativamente", visual: "⏰" },
      { step: 3, description: "Encoraje participação equilibrada", visual: "⚖️" },
      { step: 4, description: "Gerencie dinâmicas do grupo", visual: "🎯" },
      { step: 5, description: "Apoie membros hesitantes", visual: "🤗" },
      { step: 6, description: "Mantenha foco nos objetivos", visual: "🏆" }
    ],
    options: [
      { id: "a", text: "João, que tal você continuar? E Maria, vamos ouvir sua parte agora.", isCorrect: true, feedback: "Ótima gestão! Redirecionou diplomaticamente e incluiu todos os membros." },
      { id: "b", text: "João, você já falou muito. Deixa os outros falarem.", isCorrect: false, feedback: "Muito direto e pode constranger. Use abordagem mais diplomática." },
      { id: "c", text: "Deixa cada um falar o que quiser, não vou controlar.", isCorrect: false, feedback: "Como líder, você precisa facilitar participação equilibrada de todos." }
    ]
  },
  {
    id: 5,
    title: "Negociando em Situação de Tensão",
    situation: "Você precisa negociar um prazo de projeto com um cliente irritado que ameaça cancelar o contrato",
    icon: "🤝",
    visualSteps: [
      { step: 1, description: "Reconheça as emoções", visual: "❤️" },
      { step: 2, description: "Mantenha calma e profissionalismo", visual: "😌" },
      { step: 3, description: "Identifique necessidades reais", visual: "🔍" },
      { step: 4, description: "Apresente alternativas viáveis", visual: "🎯" },
      { step: 5, description: "Busque soluções win-win", visual: "🏅" },
      { step: 6, description: "Confirme acordos claramente", visual: "📝" }
    ],
    options: [
      { id: "a", text: "Entendo sua frustração. Vamos ver que opções temos para resolver isso.", isCorrect: true, feedback: "Perfeito! Validou os sentimentos e focou em soluções colaborativas." },
      { id: "b", text: "Se quiser cancelar, cancele. Não vou aceitar chantagem.", isCorrect: false, feedback: "Muito confrontativo. Em negociações, foque em resolver problemas, não vencer." },
      { id: "c", text: "Desculpa, vou fazer tudo que você quiser.", isCorrect: false, feedback: "Muito submisso. Busque soluções equilibradas que atendam ambas as partes." }
    ]
  },
  {
    id: 6,
    title: "Interpretando Sinais Sociais Sutis",
    situation: "Em uma reunião social, você nota que alguém está com braços cruzados, olhando o relógio e respondendo com monossílabos",
    icon: "🕵️",
    visualSteps: [
      { step: 1, description: "Observe múltiplos sinais", visual: "👀" },
      { step: 2, description: "Considere o contexto situacional", visual: "🏢" },
      { step: 3, description: "Avalie padrões de comportamento", visual: "📊" },
      { step: 4, description: "Teste hipóteses discretamente", visual: "🧪" },
      { step: 5, description: "Ajuste sua abordagem", visual: "🔄" },
      { step: 6, description: "Respeite limites percebidos", visual: "🚪" }
    ],
    options: [
      { id: "a", text: "Você parece ter algo em mente. Quer conversar em particular?", isCorrect: true, feedback: "Excelente leitura social! Ofereceu abertura respeitosa para diálogo." },
      { id: "b", text: "Por que você está sendo tão antissocial hoje?", isCorrect: false, feedback: "Muito direto e potencialmente ofensivo. Aborde com mais sensibilidade." },
      { id: "c", text: "Ignora os sinais e continua conversando normalmente", isCorrect: false, feedback: "Importante ler sinais sociais. A pessoa pode estar desconfortável ou precisando de espaço." }
    ]
  }
];

export default function SocialRoutinesAdvanced() {
  const router = useRouter();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState(0);
  const [showTrophy, setShowTrophy] = useState(false);

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
    setShowTrophy(false);
  };

  const finalScore = Math.round((score / socialScenarios.length) * 100);
  const isCompleted = currentScenario === socialScenarios.length - 1 && showFeedback;
  const hasEarnedTrophy = finalScore >= 80; // Nível avançado exige 80%

  useEffect(() => {
    if (isCompleted && hasEarnedTrophy) {
      const timer = setTimeout(() => setShowTrophy(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, hasEarnedTrophy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Trophy Modal */}
        {showTrophy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center animate-bounce">
              <div className="text-8xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">PARABÉNS!</h3>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Mestre das Competências Sociais!</h4>
              <p className="text-gray-600 mb-4">
                Você completou com sucesso todos os níveis das Rotinas Sociais!
              </p>
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-purple-800">
                  <strong>Conquista Desbloqueada:</strong><br/>
                  "Expert em Navegação Social"<br/>
                  Score Final: {finalScore}%
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
            onClick={() => router.push('/social-routines')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Voltar aos Níveis
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Rotinas Sociais - Avançado</h1>
            <p className="text-gray-600">Competências sociais complexas e liderança</p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Cenário: {currentScenario + 1}/{socialScenarios.length}</div>
            <div className="text-lg font-semibold text-purple-600">Acertos: {score}/{socialScenarios.length}</div>
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
              className="bg-gradient-to-r from-purple-400 to-indigo-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentScenario + (showFeedback ? 1 : 0)) / socialScenarios.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Cenário Atual */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{scenario.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{scenario.title}</h2>
            <p className="text-gray-600 text-lg">{scenario.situation}</p>
          </div>

          {/* Script Visual */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <span className="mr-2">🧠</span>
              Estratégia Avançada - 6 dimensões sociais:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {scenario.visualSteps.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="bg-white rounded-lg p-3 border-2 border-purple-200 h-full">
                    <div className="text-2xl mb-2">{step.visual}</div>
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                      {step.step}
                    </div>
                    <p className="text-xs text-gray-700">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opções de Resposta */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Como você demonstraria competência social avançada nesta situação?
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
                      : 'border-gray-200 hover:border-purple-300 text-gray-800'
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
                {scenario.options.find(opt => opt.id === selectedOption)?.isCorrect ? 'Competência social exemplar! 🌟' : 'Vamos analisar essa abordagem 🤔'}
              </h4>
              <p className={scenario.options.find(opt => opt.id === selectedOption)?.isCorrect ? 'text-green-700' : 'text-red-700'}>
                {scenario.options.find(opt => opt.id === selectedOption)?.feedback}
              </p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-center">
            {!isCompleted ? (
              <>
                {showFeedback && currentScenario < socialScenarios.length - 1 && (
                  <button
                    onClick={handleNextScenario}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Próximo Cenário →
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
                  onClick={() => router.push('/social-routines')}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Voltar ao Menu
                </button>
              </>
            )}
          </div>
        </div>

        {/* Resultado Final */}
        {isCompleted && (
          <div className={`rounded-xl border-2 p-6 ${
            hasEarnedTrophy ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <h3 className={`text-xl font-bold mb-3 ${
              hasEarnedTrophy ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {hasEarnedTrophy ? 'Excelência em Competências Sociais! 🏆' : 'Continue desenvolvendo suas habilidades! 💪'}
            </h3>
            <p className={`mb-4 ${hasEarnedTrophy ? 'text-green-700' : 'text-yellow-700'}`}>
              Você acertou {score} de {socialScenarios.length} cenários ({finalScore}%)
              {hasEarnedTrophy 
                ? ' - Você demonstrou maestria em situações sociais complexas!'
                : ' - Continue praticando para alcançar o nível de especialista (80%+).'
              }
            </p>
            
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🧠 Competências Avançadas Desenvolvidas:</h4>
              <div className="text-gray-700 text-sm space-y-1">
                <p>✓ <strong>Leitura social avançada:</strong> Interpretar sinais sutis e comunicação não-verbal</p>
                <p>✓ <strong>Gestão de conflitos complexos:</strong> Mediar situações tensas com diplomacia</p>
                <p>✓ <strong>Liderança social:</strong> Facilitar grupos e dinâmicas interpessoais</p>
                <p>✓ <strong>Negociação avançada:</strong> Encontrar soluções win-win em situações difíceis</p>
                <p>✓ <strong>Inteligência emocional:</strong> Navegar emoções próprias e alheias com maestria</p>
                <p>✓ <strong>Comunicação nuançada:</strong> Lidar com sarcasmo, ironia e entrelinhas</p>
              </div>
              
              {hasEarnedTrophy && (
                <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                  <p className="text-purple-800 font-semibold text-center">
                    🎉 CONQUISTA DESBLOQUEADA: "Mestre das Competências Sociais" 🎉
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