'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgivenessWorkshopPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [scenarioType, setScenarioType] = useState<'apologize' | 'accept'>('apologize');
  const router = useRouter();

  const scenarios = [
    {
      id: 1,
      title: "Quebrou o Brinquedo do Amigo",
      description: "Você estava brincando com o carrinho do seu amigo e ele quebrou acidentalmente. Seu amigo está chateado.",
      image: "🚗",
      context: "Situação onde você precisa pedir desculpas",
      type: 'apologize' as const,
      responses: [
        { id: 'a', text: "Não foi culpa minha, ele já estava quebrado!", correct: false, type: 'negação' },
        { id: 'b', text: "Desculpa, foi sem querer. Posso ajudar a consertar ou emprestar o meu?", correct: true, type: 'responsabilidade' },
        { id: 'c', text: "Foi só um acidente, não precisa ficar bravo.", correct: false, type: 'minimização' },
        { id: 'd', text: "Você devia ter me avisado que era frágil.", correct: false, type: 'culpabilização' }
      ],
      explanation: "Um pedido de desculpas sincero inclui: reconhecer o erro, mostrar empatia e oferecer reparação."
    },
    {
      id: 2,
      title: "Amigo Pediu Desculpas",
      description: "Seu amigo esqueceu do seu aniversário e está se desculpando. Ele parece genuinamente arrependido.",
      image: "🎂",
      context: "Situação onde você precisa aceitar desculpas",
      type: 'accept' as const,
      responses: [
        { id: 'a', text: "Não acredito que você esqueceu! Nossa amizade não significa nada para você!", correct: false, type: 'rejeição' },
        { id: 'b', text: "Tudo bem, eu entendo. Acontece. Obrigado por se desculpar.", correct: true, type: 'aceitação' },
        { id: 'c', text: "Você vai ter que me compensar de alguma forma.", correct: false, type: 'condicional' },
        { id: 'd', text: "Tanto faz, não era importante mesmo.", correct: false, type: 'passivo_agressivo' }
      ],
      explanation: "Aceitar desculpas genuínas fortalece relacionamentos e mostra maturidade emocional."
    },
    {
      id: 3,
      title: "Disse Algo que Machucou",
      description: "Você fez uma piada sobre o cabelo da sua colega, mas ela ficou muito triste. Outras pessoas riram.",
      image: "😢",
      context: "Situação onde você precisa pedir desculpas",
      type: 'apologize' as const,
      responses: [
        { id: 'a', text: "Era só uma brincadeira! Você é muito sensível.", correct: false, type: 'invalidação' },
        { id: 'b', text: "Desculpa, não queria te magoar. Minha piada foi inadequada e me arrependo.", correct: true, type: 'empatia' },
        { id: 'c', text: "Todo mundo riu, não fui só eu.", correct: false, type: 'justificativa' },
        { id: 'd', text: "Desculpa se você se sentiu ofendida.", correct: false, type: 'falsa_responsabilidade' }
      ],
      explanation: "Pedidos de desculpas eficazes reconhecem o impacto das nossas ações nos sentimentos dos outros."
    },
    {
      id: 4,
      title: "Colega Se Desculpou por Empurrão",
      description: "Na fila, um colega te empurrou sem querer e se desculpou imediatamente. Você ficou irritado.",
      image: "👥",
      context: "Situação onde você precisa aceitar desculpas",
      type: 'accept' as const,
      responses: [
        { id: 'a', text: "Você tem que prestar mais atenção! Isso dói!", correct: false, type: 'represália' },
        { id: 'b', text: "Tudo bem, eu vi que foi sem querer. Obrigado por se desculpar.", correct: true, type: 'compreensão' },
        { id: 'c', text: "Da próxima vez olha onde pisa!", correct: false, type: 'agressivo' },
        { id: 'd', text: "Hmm... ok.", correct: false, type: 'frio' }
      ],
      explanation: "Aceitar desculpas por acidentes genuínos demonstra compreensão e evita conflitos desnecessários."
    },
    {
      id: 5,
      title: "Mentiu para o Professor",
      description: "Você disse que terminou a tarefa mas não era verdade. O professor descobriu e você foi chamado para conversar.",
      image: "📝",
      context: "Situação onde você precisa pedir desculpas",
      type: 'apologize' as const,
      responses: [
        { id: 'a', text: "Eu ia terminar em casa, mas esqueci.", correct: false, type: 'desculpa_fraca' },
        { id: 'b', text: "Desculpe, professor. Eu menti porque estava com medo. Vou terminar a tarefa agora.", correct: true, type: 'honestidade' },
        { id: 'c', text: "Todo mundo faz isso às vezes.", correct: false, type: 'normalização' },
        { id: 'd', text: "Não é mentira, eu comecei a fazer.", correct: false, type: 'persistência_erro' }
      ],
      explanation: "Honestidade e assumir responsabilidade são fundamentais para reconstruir a confiança."
    },
    {
      id: 6,
      title: "Irmão Pediu Desculpas por Bagunça",
      description: "Seu irmão mexeu nos seus desenhos e bagunçou tudo. Agora ele está pedindo desculpas e oferecendo ajuda para organizar.",
      image: "🎨",
      context: "Situação onde você precisa aceitar desculpas",
      type: 'accept' as const,
      responses: [
        { id: 'a', text: "Você sempre faz isso! Não confio mais em você!", correct: false, type: 'generalização' },
        { id: 'b', text: "Aceito suas desculpas. Vamos organizar juntos e depois você pode me ajudar a refazer.", correct: true, type: 'colaboração' },
        { id: 'c', text: "Você vai ter que refazer tudo do zero para mim.", correct: false, type: 'punição' },
        { id: 'd', text: "Não quero sua ajuda, você só piora.", correct: false, type: 'recusa' }
      ],
      explanation: "Aceitar desculpas e trabalhar juntos na solução fortalece relacionamentos familiares."
    }
  ];

  const handleSelectResponse = (responseId: string) => {
    setSelectedResponse(responseId);
    setShowResult(false);
    setFeedback('');
  };

  const handleSubmit = () => {
    if (!selectedResponse) return;
    
    const currentResponse = scenarios[currentScenario].responses.find(response => response.id === selectedResponse);
    if (currentResponse?.correct) {
      setScore(score + 10);
      setFeedback('🎉 Excelente! Essa é uma resposta madura e construtiva.');
    } else {
      const responseType = currentResponse?.type;
      let specificFeedback = '';
      switch(responseType) {
        case 'negação':
        case 'minimização':
          specificFeedback = '❌ Evite negar ou minimizar. Reconheça sua parte na situação.';
          break;
        case 'rejeição':
        case 'represália':
          specificFeedback = '💔 Rejeitar desculpas genuínas pode danificar relacionamentos.';
          break;
        case 'invalidação':
          specificFeedback = '😔 Invalidar sentimentos dos outros não resolve o problema.';
          break;
        case 'passivo_agressivo':
          specificFeedback = '🤐 Respostas passivo-agressivas não promovem reconciliação.';
          break;
        default:
          specificFeedback = '🤔 Essa resposta pode não ser a mais construtiva. Que tal tentar algo mais empático?';
      }
      setFeedback(specificFeedback);
    }
    setShowResult(true);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedResponse(null);
      setShowResult(false);
      setFeedback('');
    }
  };

  const restartActivity = () => {
    setCurrentScenario(0);
    setSelectedResponse(null);
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
    const isApologizeScenario = scenario.type === 'apologize';

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
        {/* Header fixo */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Botão Voltar */}
              <button 
                onClick={() => setGameStarted(false)}
                className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors group"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium hidden sm:inline">Voltar</span>
                <span className="font-medium sm:hidden">Voltar</span>
              </button>

              {/* Título central */}
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🤲</span>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">Oficina do Perdão</h1>
              </div>

              {/* Pontuação */}
              <div className="text-right">
                <div className="text-sm text-gray-500">Pontuação</div>
                <div className="text-lg font-bold text-pink-600">{score} pts</div>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Barra de progresso */}
            <div className="bg-gray-100 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Cenário {currentScenario + 1} de {scenarios.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentScenario + 1) / scenarios.length) * 100)}% concluído
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Badge do tipo de cenário */}
            <div className="px-4 sm:px-6 pt-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                {isApologizeScenario ? (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    🙏 Pedir Desculpas
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    ❤️ Aceitar Desculpas
                  </span>
                )}
              </div>
            </div>

            {/* Cenário */}
            <div className="p-4 sm:p-6">
              <div className="text-center mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{scenario.title}</h2>
                <div className="text-4xl sm:text-6xl mb-4">{scenario.image}</div>
                <div className="bg-pink-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 font-medium text-sm sm:text-base">{scenario.description}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">📍 {scenario.context}</p>
                </div>
              </div>

              {/* Pergunta */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                  {isApologizeScenario ? '🙏 Como você se desculparia?' : '❤️ Como você reagiria ao pedido de desculpas?'}
                </h3>
                <p className="text-blue-700 text-xs sm:text-sm">
                  {isApologizeScenario 
                    ? 'Escolha a forma mais sincera e construtiva de pedir desculpas.'
                    : 'Escolha a resposta mais madura para aceitar as desculpas.'
                  }
                </p>
              </div>

              {/* Opções de resposta */}
              <div className="space-y-3 mb-6">
                {scenario.responses.map((response) => (
                  <button
                    key={response.id}
                    onClick={() => handleSelectResponse(response.id)}
                    className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all text-sm sm:text-base ${
                      selectedResponse === response.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="font-medium text-gray-800">{response.text}</span>
                  </button>
                ))}
              </div>

              {/* Botão Verificar */}
              {selectedResponse && !showResult && (
                <button
                  onClick={handleSubmit}
                  className="w-full bg-pink-500 text-white font-semibold py-3 rounded-lg hover:bg-pink-600 transition-colors text-sm sm:text-base"
                >
                  Verificar Resposta
                </button>
              )}

              {/* Feedback */}
              {showResult && (
                <div className="mt-4 space-y-4">
                  <div className={`p-4 rounded-lg ${
                    feedback.includes('Excelente') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <p className="font-medium text-sm sm:text-base">{feedback}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">💡 Por que isso funciona:</h4>
                    <p className="text-gray-600 text-sm sm:text-base">{scenario.explanation}</p>
                  </div>

                  {/* Navegação */}
                  <div className="flex space-x-3">
                    {currentScenario < scenarios.length - 1 ? (
                      <button
                        onClick={nextScenario}
                        className="flex-1 bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                      >
                        Próximo Cenário →
                      </button>
                    ) : (
                      <div className="flex-1 space-y-3">
                        <div className="bg-purple-100 text-purple-800 p-4 rounded-lg text-center">
                          <h3 className="font-bold text-base sm:text-lg">🎉 Oficina Concluída!</h3>
                          <p className="text-sm sm:text-base">Pontuação final: {score}/60 pontos</p>
                          <p className="text-xs sm:text-sm mt-2">
                            {score >= 50 ? 'Perfeito! Você domina a arte do perdão e da reconciliação!' :
                             score >= 30 ? 'Muito bom! Você entende bem como lidar com desculpas.' :
                             'Continue praticando! Perdoar e pedir perdão são habilidades importantes.'}
                          </p>
                        </div>
                        <button
                          onClick={restartActivity}
                          className="w-full bg-pink-500 text-white font-semibold py-3 rounded-lg hover:bg-pink-600 transition-colors text-sm sm:text-base"
                        >
                          🔄 Praticar Novamente
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Seção de dicas */}
          <div className="mt-6 bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">💡</span>
              Guia do Perdão
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">🙏 Pedindo Desculpas:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Reconheça o que fez de errado</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Mostre que entende como a pessoa se sentiu</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Ofereça uma forma de consertar</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Prometa tentar não repetir</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">❤️ Aceitando Desculpas:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Ouça com atenção</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Considere se as desculpas são sinceras</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Expresse seus sentimentos se necessário</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Seja aberto à reconciliação</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header fixo */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Botão Voltar */}
            <Link 
              href="/dashboard"
              className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium hidden sm:inline">Voltar</span>
              <span className="font-medium sm:hidden">Voltar</span>
            </Link>

            {/* Título central */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🤲</span>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Oficina do Perdão</h1>
            </div>

            {/* Espaço para balanceamento */}
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Descrição da atividade */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-base sm:text-lg">
            Pratique perdão e reconciliação em situações de conflito
          </p>
        </div>

        {/* Cards informativos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8">
          {/* Objetivo */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-red-400">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🎯</span>
              Objetivo:
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Desenvolver habilidades para pedir desculpas sinceras e aceitar desculpas de forma 
              madura através de role-play de situações de conflito.
            </p>
          </div>

          {/* Pontuação */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-yellow-400">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">⭐</span>
              Pontuação:
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Cada resposta construtiva = +10 pontos. Você precisa de 50 pontos para se tornar 
              um especialista em perdão e reconciliação.
            </p>
          </div>

          {/* Níveis */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-purple-400">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">📊</span>
              Níveis:
            </h2>
            <div className="space-y-2 text-gray-700 text-sm sm:text-base">
              <p><strong>Nível 1:</strong> Desculpas simples (fácil)</p>
              <p><strong>Nível 2:</strong> Conflitos interpessoais (médio)</p>
              <p><strong>Nível 3:</strong> Reconciliação complexa (difícil)</p>
            </div>
          </div>

          {/* Final */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-green-400">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🏁</span>
              Final:
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Complete todos os cenários com 50+ pontos para dominar a arte do perdão 
              e fortalecer seus relacionamentos.
            </p>
          </div>
        </div>

        {/* Emoji central */}
        <div className="text-center mb-8">
          <div className="text-6xl sm:text-8xl mb-4">🤲</div>
        </div>

        {/* Botão Iniciar */}
        <div className="text-center mb-8">
          <button
            onClick={startGame}
            className="bg-pink-500 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-pink-600 transition-colors inline-flex items-center w-full sm:w-auto justify-center"
          >
            <span className="mr-2">🚀</span>
            Iniciar Jogo
          </button>
        </div>

        {/* Base científica */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🧠</span>
            Base Científica:
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            Este exercício é baseado em técnicas de <strong>role-play terapêutico</strong> e 
            <strong>resolução de conflitos interpessoais</strong>. Os cenários foram desenvolvidos seguindo 
            princípios de comunicação empática e reparação social validados para desenvolvimento 
            de habilidades de reconciliação em pessoas com TEA e TDAH.
          </p>
        </div>
      </main>
    </div>
  );
}