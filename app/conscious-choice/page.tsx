'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Scale } from 'lucide-react'; // ÍCONE CORRIGIDO DE 'Balance' PARA 'Scale'

// ============================================================================
// 1. COMPONENTE PADRÃO DO CABEÇALHO (GameHeader)
// ============================================================================
const GameHeader = ({ title, icon }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center text-teal-600 hover:text-teal-700 transition-colors">
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </Link>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h1>
        <div className="w-24"></div>
      </div>
    </div>
  </header>
);

// ============================================================================
// 2. PÁGINA DA ATIVIDADE "ESCOLHA CONSCIENTE"
// ============================================================================
export default function ConsciousChoicePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSituation, setCurrentSituation] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [nivelSelecionado, setNivelSelecionado] = useState(1);
  const router = useRouter();

  const situations = [
    { id: 1, title: "Conflito no Playground", description: "Seu amigo quer brincar de futebol, mas você quer jogar videogame. Vocês estão discutindo.", image: "⚽", context: "Recreio escolar", choices: [
      { id: 'a', text: "Gritar que futebol é chato e sair correndo", correct: false, type: 'agressivo' },
      { id: 'b', text: "Propor: 'Que tal 15 min de futebol e depois videogame?'", correct: true, type: 'negociacao' },
      { id: 'c', text: "Aceitar jogar futebol mesmo não querendo", correct: false, type: 'passivo' },
      { id: 'd', text: "Ignorar o amigo e ir jogar videogame sozinho", correct: false, type: 'evitativo' }
    ], explanation: "A negociação permite que ambos tenham suas preferências atendidas. Propor alternativas é uma habilidade social importante." },
     { id: 2, title: "Tarefa em Grupo", description: "Na escola, seu grupo não está fazendo a parte deles do trabalho. O prazo está chegando.", image: "📚", context: "Projeto escolar em equipe", choices: [
       { id: 'a', text: "Fazer todo o trabalho sozinho sem reclamar", correct: false, type: 'passivo' },
       { id: 'b', text: "Conversar: 'Pessoal, vamos organizar as tarefas para entregar no prazo?'", correct: true, type: 'assertivo' },
       { id: 'c', text: "Reclamar com a professora sobre os colegas", correct: false, type: 'evitativo' },
       { id: 'd', text: "Gritar com o grupo que eles são irresponsáveis", correct: false, type: 'agressivo' }
     ], explanation: "Comunicação assertiva e proposta de organização ajudam a resolver o problema sem criar conflitos desnecessários." },
     { id: 3, title: "Brinquedo Emprestado", description: "Você emprestou seu jogo favorito para um amigo há uma semana, mas ele ainda não devolveu.", image: "🎮", context: "Situação de empréstimo entre amigos", choices: [
       { id: 'a', text: "Não falar nada e ficar triste", correct: false, type: 'passivo' },
       { id: 'b', text: "Perguntar gentilmente: 'Ei, posso pegar meu jogo de volta?'", correct: true, type: 'assertivo' },
       { id: 'c', text: "Falar para outros amigos que ele é ladrão", correct: false, type: 'agressivo' },
       { id: 'd', text: "Pegar outro brinquedo dele sem permissão", correct: false, type: 'vingativo' }
     ], explanation: "Comunicação direta e gentil é a melhor forma de resolver mal-entendidos sem danificar a amizade." },
     { id: 4, title: "Fila do Lanche", description: "Alguém passou na sua frente na fila da cantina. Você estava esperando há 10 minutos.", image: "🍎", context: "Cantina escolar - situação de fila", choices: [
       { id: 'a', text: "Empurrar a pessoa de volta", correct: false, type: 'agressivo' },
       { id: 'b', text: "Dizer educadamente: 'Desculpe, mas eu estava na fila antes'", correct: true, type: 'assertivo' },
       { id: 'c', text: "Sair da fila irritado sem falar nada", correct: false, type: 'passivo' },
       { id: 'd', text: "Reclamar alto para todo mundo ouvir", correct: false, type: 'dramático' }
     ], explanation: "Defender seus direitos com educação e clareza é a melhor forma de resolver a situação sem criar conflito maior." }
  ];

  const handleSelectChoice = (choiceId: string) => { setSelectedChoice(choiceId); setShowResult(false); setFeedback(''); };
  const handleSubmit = () => {
    if (!selectedChoice) return;
    const currentChoiceData = situations[currentSituation].choices.find(choice => choice.id === selectedChoice);
    if (currentChoiceData?.correct) {
      setScore(score + 10);
      setFeedback('🎉 Excelente escolha! Você usou uma estratégia construtiva.');
    } else {
      setFeedback('🤔 Essa não foi a melhor escolha. Vamos pensar em alternativas.');
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

  const restartActivity = () => { setGameStarted(false); setCurrentSituation(0); setScore(0); setSelectedChoice(null); setShowResult(false); };
  const startGame = () => { setGameStarted(true); };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GameHeader title="Escolha Consciente" icon={<Scale size={24} />} />
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                  <p className="text-sm text-gray-600">Desenvolver habilidades para negociar soluções e resolver conflitos de forma construtiva, sem discussões.</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Leia a situação de conflito apresentada.</li>
                    <li>Analise as 4 opções de resposta.</li>
                    <li>Escolha a mais construtiva e veja o feedback.</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                  <p className="text-sm text-gray-600">Cada escolha construtiva vale +10 pontos. O objetivo é treinar a comunicação assertiva e a empatia.</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[ { id: 1, nome: 'Nível 1', desc: 'Conflitos Simples', icone: '😊' }, { id: 2, nome: 'Nível 2', desc: 'Situações Complexas', icone: '🤔' }, { id: 3, nome: 'Nível 3', desc: 'Negociações Avançadas', icone: '🤝' } ].map(nivel => (
                  <button key={nivel.id} onClick={() => setNivelSelecionado(nivel.id)} className={`p-4 rounded-lg font-medium transition-colors ${nivelSelecionado === nivel.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                    <div className="text-2xl mb-1">{nivel.icone}</div>
                    <div className="text-sm">{nivel.nome}</div>
                    <div className="text-xs opacity-80">{nivel.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center pt-4">
              <button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">🚀 Iniciar Atividade</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const situation = situations[currentSituation];
  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Escolha Consciente" icon={<Scale size={24} />} />
      <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-6">
          <div className="text-sm font-semibold text-gray-700">Situação {currentSituation + 1} de {situations.length}</div>
          <div className="text-sm font-semibold text-gray-700">Pontuação: <span className="text-teal-600">{score}</span></div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{situation.image}</div>
            <h2 className="text-xl font-bold text-gray-800">{situation.title}</h2>
            <p className="text-gray-600">{situation.description}</p>
          </div>
          <div className="space-y-3">
            {situation.choices.map(choice => (
              <button key={choice.id} onClick={() => handleSelectChoice(choice.id)} disabled={showResult} className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all disabled:cursor-not-allowed ${selectedChoice === choice.id ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:border-teal-400'}`}>
                {choice.text}
              </button>
            ))}
          </div>
          {!showResult && selectedChoice && (
            <button onClick={handleSubmit} className="w-full py-3 rounded-lg bg-teal-500 text-white font-bold hover:bg-teal-600">Confirmar Escolha</button>
          )}
          {showResult && (
            <div className="space-y-4 pt-4 border-t">
              <div className={`p-4 rounded-lg ${feedback.includes('Excelente') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                <p className="font-semibold">{feedback}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-100">
                <p className="font-semibold text-gray-800">💡 Aprendizado:</p>
                <p className="text-gray-700">{situation.explanation}</p>
              </div>
              {currentSituation < situations.length - 1 ? (
                <button onClick={nextSituation} className="w-full py-3 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600">Próxima Situação</button>
              ) : (
                <div className="text-center p-4 bg-purple-100 rounded-lg">
                  <h3 className="font-bold text-lg text-purple-800">🎉 Parabéns! Atividade Concluída!</h3>
                  <p className="text-purple-700">Pontuação final: {score}/{situations.length * 10} pontos</p>
                  <button onClick={restartActivity} className="mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">Jogar Novamente</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
