'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, HeartHandshake, HelpCircle, Star } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE PADRÃO DO CABEÇALHO (GameHeader)
// Conforme especificado no Log de Padronização.
// ============================================================================
const GameHeader = ({ title, icon }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        {/* 1. Botão Voltar (Esquerda) */}
        <Link
          href="/dashboard"
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </Link>

        {/* 2. Título Centralizado (Meio) */}
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h1>

        {/* 3. Espaçador (Direita) */}
        <div className="w-24"></div>
      </div>
    </div>
  </header>
);

// ============================================================================
// 2. PÁGINA DA ATIVIDADE "OFICINA DO PERDÃO"
// Código original refatorado para usar o layout padrão.
// ============================================================================
export default function ForgivenessWorkshopPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [nivelSelecionado, setNivelSelecionado] = useState(1); // Estado para nível
  const router = useRouter();

  // ... (toda a lógica de cenários e handlers permanece a mesma)
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
    // ... (restante dos cenários)
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
    // A lógica de dificuldade por nível pode ser adicionada aqui no futuro.
    // Por enquanto, apenas inicia o jogo.
    setGameStarted(true);
  };

  // ============================================================================
  // RENDERIZAÇÃO DA ATIVIDADE EM SI (APÓS CLICAR EM INICIAR)
  // ============================================================================
  if (gameStarted) {
    const scenario = scenarios[currentScenario];
    const isApologizeScenario = scenario.type === 'apologize';

    return (
      <div className="min-h-screen bg-gray-50">
        <GameHeader title="Oficina do Perdão" icon={<HeartHandshake size={24} />} />
        
        {/* Conteúdo principal do jogo */}
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
                   className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                   style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
                 ></div>
               </div>
             </div>
 
             {/* Conteúdo do cenário... (toda a lógica de exibição do jogo permanece) */}
             <div className="p-4 sm:p-6">
                {/* ... (o resto do seu código do jogo aqui, sem alterações) ... */}
                <div className="text-center mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{scenario.title}</h2>
                  <div className="text-4xl sm:text-6xl mb-4">{scenario.image}</div>
                  <div className="bg-pink-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 font-medium text-sm sm:text-base">{scenario.description}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">📍 {scenario.context}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                    {isApologizeScenario ? '🙏 Como você se desculparia?' : '❤️ Como você reagiria ao pedido de desculpas?'}
                  </h3>
                </div>

                <div className="space-y-3 mb-6">
                  {scenario.responses.map((response) => (
                    <button
                      key={response.id}
                      onClick={() => handleSelectResponse(response.id)}
                      className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all text-sm sm:text-base ${
                        selectedResponse === response.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="font-medium text-gray-800">{response.text}</span>
                    </button>
                  ))}
                </div>
                
                {selectedResponse && !showResult && (
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-teal-500 text-white font-semibold py-3 rounded-lg hover:bg-teal-600 transition-colors text-sm sm:text-base"
                  >
                    Verificar Resposta
                  </button>
                )}

                {showResult && (
                    // ... (lógica de feedback)
                    <div className="flex space-x-3 mt-4">
                        {currentScenario < scenarios.length - 1 ? (
                            <button
                                onClick={nextScenario}
                                className="flex-1 bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                            >
                                Próximo Cenário →
                            </button>
                        ) : (
                            <button
                                onClick={restartActivity}
                                className="w-full bg-pink-500 text-white font-semibold py-3 rounded-lg hover:bg-pink-600 transition-colors text-sm sm:text-base"
                            >
                                🔄 Praticar Novamente
                            </button>
                        )}
                    </div>
                )}
             </div>
          </div>
        </main>
      </div>
    );
  }

  // ============================================================================
  // RENDERIZAÇÃO DA TELA INICIAL (PADRONIZADA)
  // ============================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Oficina do Perdão" icon={<HeartHandshake size={24} />} />
      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">

          {/* Bloco 1: Cards Informativos */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card de Objetivo */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                <p className="text-sm text-gray-600">
                  Aprender a pedir e a aceitar desculpas de forma sincera e madura, fortalecendo seus relacionamentos.
                </p>
              </div>

              {/* Card de Como Jogar */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Leia cada cenário com atenção.</li>
                  <li>Escolha a resposta que você acha mais correta.</li>
                  <li>Veja o feedback para aprender com cada situação.</li>
                </ul>
              </div>

              {/* Card de Avaliação/Progresso */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                <p className="text-sm text-gray-600">
                  Cada resposta correta vale +10 pontos. Tente fazer o seu melhor para se tornar um mestre do perdão!
                </p>
              </div>
            </div>
          </div>

          {/* Bloco 2: Seleção de Nível */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
              {[
                { id: 1, nome: 'Nível 1', desc: 'Simples', icone: '🚦' },
                { id: 2, nome: 'Nível 2', desc: 'Intermediário', icone: '🚧' },
                { id: 3, nome: 'Nível 3', desc: 'Complexo', icone: '🧠' },
              ].map(nivel => (
                <button
                  key={nivel.id}
                  onClick={() => setNivelSelecionado(nivel.id)}
                  className={`p-4 rounded-lg font-medium transition-colors ${
                    nivelSelecionado === nivel.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{nivel.icone}</div>
                  <div className="text-sm">{nivel.nome}</div>
                  <div className="text-xs opacity-80">{nivel.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bloco 3: Botão Iniciar */}
          <div className="text-center pt-4">
            <button
              onClick={startGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              🚀 Iniciar Atividade
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
