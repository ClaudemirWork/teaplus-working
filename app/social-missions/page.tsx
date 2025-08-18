'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SocialMissionsPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentMission, setCurrentMission] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [missionStatus, setMissionStatus] = useState('');
  const router = useRouter();

  const missions = [
    {
      id: 1,
      title: "Missão: Organizar a Mesa",
      description: "Você prometeu organizar sua mesa de estudos após usar. Está na hora de cumprir!",
      image: "📚",
      context: "Responsabilidade pessoal - ambiente de estudos",
      steps: [
        "Guardar todos os livros no lugar",
        "Organizar os lápis e canetas",
        "Limpar a superfície da mesa",
        "Verificar se tudo está no lugar certo"
      ],
      timeLimit: 300, // 5 minutos
      points: 15,
      category: "organização"
    },
    {
      id: 2,
      title: "Missão: Ajudar na Cozinha",
      description: "Você se ofereceu para ajudar com a limpeza após o jantar. É hora de mostrar responsabilidade!",
      image: "🍽️",
      context: "Compromisso familiar - colaboração doméstica",
      steps: [
        "Retirar os pratos da mesa",
        "Guardar os alimentos na geladeira",
        "Lavar a louça ou colocar na lava-louças",
        "Limpar a bancada da cozinha"
      ],
      timeLimit: 600, // 10 minutos
      points: 20,
      category: "colaboração"
    },
    {
      id: 3,
      title: "Missão: Cuidar do Ambiente",
      description: "Você notou lixo no pátio da escola. Vamos cuidar do nosso ambiente coletivo!",
      image: "🌱",
      context: "Responsabilidade ambiental - espaço coletivo",
      steps: [
        "Identificar os resíduos no ambiente",
        "Separar lixo reciclável do comum",
        "Colocar cada tipo na lixeira correta",
        "Verificar se o ambiente está limpo"
      ],
      timeLimit: 240, // 4 minutos
      points: 25,
      category: "ambiente"
    },
    {
      id: 4,
      title: "Missão: Devolver Material",
      description: "Você pegou emprestado material da biblioteca há uma semana. É hora de devolver!",
      image: "📖",
      context: "Compromisso social - responsabilidade com bens coletivos",
      steps: [
        "Localizar todos os materiais emprestados",
        "Verificar se estão em bom estado",
        "Ir até a biblioteca",
        "Devolver e agradecer o empréstimo"
      ],
      timeLimit: 480, // 8 minutos
      points: 18,
      category: "compromisso"
    }
  ];

  const startMission = (missionIndex: number) => {
    setCurrentMission(missionIndex);
    setShowResult(false);
    setMissionStatus('em_andamento');
  };

  const completeMission = () => {
    const mission = missions[currentMission];
    setCompletedMissions([...completedMissions, mission.id]);
    setScore(score + mission.points);
    setMissionStatus('completa');
    setShowResult(true);
  };

  const nextMission = () => {
    if (currentMission < missions.length - 1) {
      const nextIndex = currentMission + 1;
      setCurrentMission(nextIndex);
      setMissionStatus('');
      setShowResult(false);
    }
  };

  const restartActivity = () => {
    setCurrentMission(0);
    setCompletedMissions([]);
    setScore(0);
    setShowResult(false);
    setMissionStatus('');
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const isMissionCompleted = (missionId: number) => completedMissions.includes(missionId);
  const totalPossiblePoints = missions.reduce((sum, mission) => sum + mission.points, 0);

  if (gameStarted) {
    const mission = missions[currentMission];

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
        {/* Header fixo */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Botão Voltar */}
              <button 
                onClick={() => setGameStarted(false)}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors group"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium hidden sm:inline">Voltar</span>
                <span className="font-medium sm:hidden">Voltar</span>
              </button>

              {/* Título central */}
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">Missões Sociais</h1>
              </div>

              {/* Pontuação */}
              <div className="text-right">
                <div className="text-sm text-gray-500">Pontuação</div>
                <div className="text-lg font-bold text-orange-600">{score}/{totalPossiblePoints}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Painel de Missões */}
          <div className="mb-6">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Painel de Missões</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {missions.map((m, index) => (
                  <button
                    key={m.id}
                    onClick={() => !isMissionCompleted(m.id) && startMission(index)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                      isMissionCompleted(m.id) 
                        ? 'bg-green-100 border-green-300 cursor-default' 
                        : currentMission === index 
                          ? 'bg-orange-100 border-orange-300 hover:bg-orange-200'
                          : 'bg-white border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl mb-2">{m.image}</div>
                    <div className="font-semibold text-xs sm:text-sm mb-1">{m.title.replace('Missão: ', '')}</div>
                    <div className="text-xs text-gray-500 mb-2">{m.category}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-orange-600">{m.points} pts</span>
                      {isMissionCompleted(m.id) && <span className="text-green-600 text-sm">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detalhes da Missão Atual */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header da Missão */}
            <div className="bg-orange-100 p-4 sm:p-6 border-b">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-2">{mission.image}</div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{mission.title}</h2>
                <p className="text-gray-600 text-sm sm:text-base">{mission.description}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">📍 {mission.context}</p>
              </div>
            </div>

            {/* Passos da Missão */}
            <div className="p-4 sm:p-6">
              {missionStatus !== 'completa' ? (
                <>
                  <h3 className="font-semibold text-gray-700 mb-4 text-sm sm:text-base">Passos para completar a missão:</h3>
                  <div className="space-y-3 mb-6">
                    {mission.steps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 text-sm sm:text-base">{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-600">⏰</span>
                      <span className="font-semibold text-blue-800 text-sm sm:text-base">Tempo Sugerido:</span>
                    </div>
                    <p className="text-blue-700 text-sm sm:text-base">{Math.floor(mission.timeLimit / 60)} minutos para completar com calma</p>
                  </div>

                  {missionStatus !== 'em_andamento' ? (
                    <button
                      onClick={() => startMission(currentMission)}
                      className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
                    >
                      Iniciar Missão
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <p className="text-yellow-800 font-medium text-sm sm:text-base">⚡ Missão em andamento!</p>
                        <p className="text-yellow-700 text-xs sm:text-sm mt-1">Complete todos os passos e clique em "Missão Completa" quando terminar.</p>
                      </div>
                      <button
                        onClick={completeMission}
                        className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base"
                      >
                        ✅ Missão Completa!
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-green-100 text-green-800 p-4 sm:p-6 rounded-lg">
                    <h3 className="font-bold text-base sm:text-lg mb-2">🎉 Missão Completa!</h3>
                    <p className="mb-2 text-sm sm:text-base">Você ganhou {mission.points} pontos!</p>
                    <p className="text-xs sm:text-sm">Parabéns por cumprir seu compromisso e mostrar responsabilidade!</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg text-left">
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">💡 Impacto da sua ação:</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {mission.category === 'organização' && 'Manter o ambiente organizado ajuda você a ser mais produtivo e demonstra cuidado com seus pertences.'}
                      {mission.category === 'colaboração' && 'Ajudar em casa fortalece os vínculos familiares e mostra que você é uma pessoa confiável.'}
                      {mission.category === 'ambiente' && 'Cuidar do ambiente beneficia toda a comunidade e demonstra consciência social.'}
                      {mission.category === 'compromisso' && 'Cumprir promessas constrói confiança e mostra que você é uma pessoa responsável.'}
                    </p>
                  </div>

                  {currentMission < missions.length - 1 ? (
                    <button
                      onClick={nextMission}
                      className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                    >
                      Próxima Missão →
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-purple-100 text-purple-800 p-4 rounded-lg">
                        <h3 className="font-bold text-base sm:text-lg">🏆 Todas as Missões Concluídas!</h3>
                        <p className="text-sm sm:text-base">Pontuação final: {score}/{totalPossiblePoints} pontos</p>
                        <p className="text-xs sm:text-sm mt-2">
                          {score === totalPossiblePoints ? 'Perfeito! Você é um verdadeiro herói da responsabilidade social!' :
                           score >= totalPossiblePoints * 0.8 ? 'Excelente! Você demonstrou grande senso de responsabilidade.' :
                           'Muito bom! Continue praticando essas importantes habilidades sociais.'}
                        </p>
                      </div>
                      <button
                        onClick={restartActivity}
                        className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
                      >
                        🔄 Novas Missões
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Seção de Dicas */}
          <div className="mt-6 bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">💡</span>
              Dicas para Ser Socialmente Responsável
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">🎯 Compromissos:</h4>
                <ul className="space-y-1">
                  <li>• Cumpra o que promete</li>
                  <li>• Seja pontual</li>
                  <li>• Avise se houver imprevisto</li>
                  <li>• Assuma suas responsabilidades</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">🌍 Ambiente:</h4>
                <ul className="space-y-1">
                  <li>• Mantenha espaços limpos</li>
                  <li>• Recicle quando possível</li>
                  <li>• Cuide dos bens coletivos</li>
                  <li>• Seja exemplo para outros</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">🤝 Colaboração:</h4>
                <ul className="space-y-1">
                  <li>• Ofereça ajuda</li>
                  <li>• Trabalhe em equipe</li>
                  <li>• Seja proativo</li>
                  <li>• Reconheça esforços alheios</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Header fixo */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Botão Voltar */}
            <Link 
              href="/dashboard"
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium hidden sm:inline">Voltar</span>
              <span className="font-medium sm:hidden">Voltar</span>
            </Link>

            {/* Título central */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Missões Sociais</h1>
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
            Desenvolva responsabilidade através de compromissos
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
              Desenvolver responsabilidade social através do cumprimento de compromissos 
              e cuidado com o ambiente coletivo e pessoal.
            </p>
          </div>

          {/* Pontuação */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-yellow-400">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">⭐</span>
              Pontuação:
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Cada missão completada = pontos variáveis (15-25 pts). Complete todas as missões 
              para se tornar um herói da responsabilidade social.
            </p>
          </div>

          {/* Níveis */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-purple-400">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">📊</span>
              Níveis:
            </h2>
            <div className="space-y-2 text-gray-700 text-sm sm:text-base">
              <p><strong>Nível 1:</strong> Responsabilidade pessoal (fácil)</p>
              <p><strong>Nível 2:</strong> Colaboração familiar (médio)</p>
              <p><strong>Nível 3:</strong> Compromisso social (difícil)</p>
            </div>
          </div>

          {/* Final */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-green-400">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">🏁</span>
              Final:
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Complete todas as 4 missões para dominar as habilidades de responsabilidade 
              social e compromisso com a comunidade.
            </p>
          </div>
        </div>

        {/* Emoji central */}
        <div className="text-center mb-8">
          <div className="text-6xl sm:text-8xl mb-4">🎯</div>
        </div>

        {/* Botão Iniciar */}
        <div className="text-center mb-8">
          <button
            onClick={startGame}
            className="bg-orange-500 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-orange-600 transition-colors inline-flex items-center w-full sm:w-auto justify-center"
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
            Este exercício é baseado em <strong>Sistema de Economia de Fichas</strong> e 
            <strong>Suporte Comportamental Positivo</strong>. As missões foram desenvolvidas seguindo 
            princípios de responsabilidade social e desenvolvimento de compromissos validados 
            para fortalecimento de habilidades sociais em pessoas com TEA e TDAH.
          </p>
        </div>
      </main>
    </div>
  );
}