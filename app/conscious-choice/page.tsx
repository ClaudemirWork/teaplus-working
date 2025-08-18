'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConsciousChoicePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSituation, setCurrentSituation] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const router = useRouter();

  const situations = [
    {
      id: 1,
      title: "Conflito no Playground",
      description: "Seu amigo quer brincar de futebol, mas você quer jogar videogame. Vocês estão discutindo.",
      image: "⚽",
      context: "Recreio escolar - decisão sobre atividade",
      choices: [
        { id: 'a', text: "Gritar que futebol é chato e sair correndo", correct: false, type: 'agressivo' },
        { id: 'b', text: "Propor: 'Que tal 15 min de futebol e depois videogame?'", correct: true, type: 'negociacao' },
        { id: 'c', text: "Aceitar jogar futebol mesmo não querendo", correct: false, type: 'passivo' },
        { id: 'd', text: "Ignorar o amigo e ir jogar videogame sozinho", correct: false, type: 'evitativo' }
      ],
      explanation: "A negociação permite que ambos tenham suas preferências atendidas. Propor alternativas é uma habilidade social importante."
    },
    {
      id: 2,
      title: "Tarefa em Grupo",
      description: "Na escola, seu grupo não está fazendo a parte deles do trabalho. O prazo está chegando.",
      image: "📚",
      context: "Projeto escolar em equipe",
      choices: [
        { id: 'a', text: "Fazer todo o trabalho sozinho sem reclamar", correct: false, type: 'passivo' },
        { id: 'b', text: "Conversar: 'Pessoal, vamos organizar as tarefas para entregar no prazo?'", correct: true, type: 'assertivo' },
        { id: 'c', text: "Reclamar com a professora sobre os colegas", correct: false, type: 'evitativo' },
        { id: 'd', text: "Gritar com o grupo que eles são irresponsáveis", correct: false, type: 'agressivo' }
      ],
      explanation: "Comunicação assertiva e proposta de organização ajudam a resolver o problema sem criar conflitos desnecessários."
    },
    {
      id: 3,
      title: "Brinquedo Emprestado",
      description: "Você emprestou seu jogo favorito para um amigo há uma semana, mas ele ainda não devolveu.",
      image: "🎮",
      context: "Situação de empréstimo entre amigos",
      choices: [
        { id: 'a', text: "Não falar nada e ficar triste", correct: false, type: 'passivo' },
        { id: 'b', text: "Perguntar gentilmente: 'Ei, posso pegar meu jogo de volta?'", correct: true, type: 'assertivo' },
        { id: 'c', text: "Falar para outros amigos que ele é ladrão", correct: false, type: 'agressivo' },
        { id: 'd', text: "Pegar outro brinquedo dele sem permissão", correct: false, type: 'vingativo' }
      ],
      explanation: "Comunicação direta e gentil é a melhor forma de resolver mal-entendidos sem danificar a amizade."
    },
    {
      id: 4,
      title: "Fila do Lanche",
      description: "Alguém passou na sua frente na fila da cantina. Você estava esperando há 10 minutos.",
      image: "🍎",
      context: "Cantina escolar - situação de fila",
      choices: [
        { id: 'a', text: "Empurrar a pessoa de volta", correct: false, type: 'agressivo' },
        { id: 'b', text: "Dizer educadamente: 'Desculpe, mas eu estava na fila antes'", correct: true, type: 'assertivo' },
        { id: 'c', text: "Sair da fila irritado sem falar nada", correct: false, type: 'passivo' },
        { id: 'd', text: "Reclamar alto para todo mundo ouvir", correct: false, type: 'dramático' }
      ],
      explanation: "Defender seus direitos com educação e clareza é a melhor forma de resolver a situação sem criar conflito maior."
    }
  ];

  const handleSelectChoice = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setShowResult(false);
    setFeedback('');
  };

  const handleSubmit = () => {
    if (!selectedChoice) return;
    
    const currentChoiceData = situations[currentSituation].choices.find(choice => choice.id === selectedChoice);
    if (currentChoiceData?.correct) {
      setScore(score + 10);
      setFeedback('🎉 Excelente escolha! Você usou uma estratégia construtiva para resolver o conflito.');
    } else {
      const choiceType = currentChoiceData?.type;
      let specificFeedback = '';
      switch(choiceType) {
        case 'agressivo':
          specificFeedback = '⚠️ Essa abordagem pode piorar o conflito. Que tal tentar algo mais gentil?';
          break;
        case 'passivo':
          specificFeedback = '😔 Não expressar suas necessidades pode gerar frustração. Tente ser mais assertivo.';
          break;
        case 'evitativo':
          specificFeedback = '🤷 Evitar o problema não o resolve. Comunicação direta e gentil funciona melhor.';
          break;
        default:
          specificFeedback = '🤔 Essa não foi a melhor escolha. Vamos pensar em alternativas mais construtivas.';
      }
      setFeedback(specificFeedback);
    }
    setShowResult(true);
  };

  const nextSituation = () => {
    if (currentSituation < situations.length - 1) {
      setCurrentSituation(currentSituation + 1);
      setSelectedChoice(null);
      setShowResult(false);
      setFeedback('');
    }
  };

  const restartActivity = () => {
    setCurrentSituation(0);
    setSelectedChoice(null);
    setScore(0);
    setShowResult(false);
    setFeedback('');
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  if (gameStarted) {
    const situation = situations[currentSituation];

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Header fixo */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Botão Voltar */}
              <button 
                onClick={() => setGameStarted(false)}
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors group"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium hidden sm:inline">Voltar</span>
                <span className="font-medium sm:hidden">Voltar</span>
              </button>

              {/* Título central */}
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚖️</span>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">Escolha Consciente</h1>
              </div>

              {/* Pontuação */}
              <div className="text-right">
                <div className="text-sm text-gray-500">Pontuação</div>
                <div className="text-lg font-bold text-green-600">{score} pts</div>
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
                  Situação {currentSituation + 1} de {situations.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentSituation + 1) / situations.length) * 100)}% concluído
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSituation + 1) / situations.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Situação */}
            <div className="p-4 sm:p-6">
              <div className="text-center mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{situation.title}</h2>
                <div className="text-4xl sm:text-6xl mb-4">{situation.image}</div>
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 font-medium text-sm sm:text-base">{situation.description}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">📍 {situation.context}</p>
                </div>
              </div>

              {/* Opções */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">Como você reagiria nesta situação?</h3>
                {situation.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice.id)}
                    className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all text-sm sm:text-base ${
                      selectedChoice === choice.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="font-medium text-gray-800">{choice.text}</span>
                  </button>
                ))}
              </div>

              {/* Botão Confirmar */}
              {selectedChoice && !showResult && (
                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base"
                >
                  Confirmar Escolha
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
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">💡 Por que essa é a melhor escolha:</h4>
                    <p className="text-gray-600 text-sm sm:text-base">{situation.explanation}</p>
                  </div>

                  {/* Navegação */}
                  <div className="flex space-x-3">
                    {currentSituation < situations.length - 1 ? (
                      <button
                        onClick={nextSituation}
                        className="flex-1 bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                      >
                        Próxima Situação →
                      </button>
                    ) : (
                      <div className="flex-1 space-y-3">
                        <div className="bg-purple-100 text-purple-800 p-4 rounded-lg text-center">
                          <h3 className="font-bold text-base sm:text-lg">🎉 Parabéns! Atividade Concluída!</h3>
                          <p className="text-sm sm:text-base">Pontuação final: {score}/40 pontos</p>
                          <p className="text-xs sm:text-sm mt-2">
                            {score >= 30 ? 'Excelente! Você domina a arte da resolução de conflitos!' :
                             score >= 20 ? 'Muito bom! Continue praticando essas habilidades.' :
                             'Continue treinando! Resolver conflitos é uma habilidade que melhora com a prática.'}
                          </p>
                        </div>
                        <button
                          onClick={restartActivity}
                          className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base"
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

          {/* Seção de dicas */}
          <div className="mt-6 bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">💡</span>
              Estratégias para Resolução de Conflitos
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">✅ Faça:</h4>
                <ul className="space-y-1">
                  <li>• Escute o outro lado</li>
                  <li>• Proponha soluções</li>
                  <li>• Mantenha a calma</li>
                  <li>• Seja respeitoso</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">❌ Evite:</h4>
                <ul className="space-y-1">
                  <li>• Gritar ou ofender</li>
                  <li>• Ignorar o problema</li>
                  <li>• Ser muito passivo</li>
                  <li>• Tomar decisões impulsivas</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header fixo */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Botão Voltar */}
            <Link 
              href="/dashboard"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium hidden sm:inline">Voltar</span>
              <span className="font-medium sm:hidden">Voltar</span>
            </Link>

            {/* Título central */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚖️</span>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Escolha Consciente</h1>
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
            Desenvolva habilidades para negociar soluções
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
              Desenvolver habilidades para discutir sem brigar e negociar soluções através 
              de estratégias construtivas de resolução de conflitos.
            </p>
          </div>

          {/* Pontuação */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-yellow-400">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">⭐</span>
              Pontuação:
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Cada escolha construtiva = +10 pontos. Você precisa de 30 pontos para se tornar 
              um especialista em resolução de conflitos.
            </p>
          </div>

          {/* Níveis */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-purple-400">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">📊</span>
              Níveis:
            </h2>
            <div className="space-y-2 text-gray-700 text-sm sm:text-base">
              <p><strong>Nível 1:</strong> Conflitos simples (fácil)</p>
              <p><strong>Nível 2:</strong> Situações complexas (médio)</p>
              <p><strong>Nível 3:</strong> Negociações avançadas (difícil)</p>
            </div>
          </div>

          {/* Final */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-green-400">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🏁</span>
              Final:
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Complete todas as situações com 30+ pontos para dominar a arte de 
              resolver conflitos com sabedoria e empatia.
            </p>
          </div>
        </div>

        {/* Emoji central */}
        <div className="text-center mb-8">
          <div className="text-6xl sm:text-8xl mb-4">⚖️</div>
        </div>

        {/* Botão Iniciar */}
        <div className="text-center mb-8">
          <button
            onClick={startGame}
            className="bg-green-500 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-green-600 transition-colors inline-flex items-center w-full sm:w-auto justify-center"
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
            Este exercício é baseado em técnicas de <strong>resolução construtiva de conflitos</strong> e 
            <strong>comunicação assertiva</strong>. As situações foram desenvolvidas seguindo 
            princípios de negociação e mediação validados para desenvolvimento 
            de habilidades sociais em pessoas com TEA e TDAH.
          </p>
        </div>
      </main>
    </div>
  );
}