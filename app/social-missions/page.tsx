'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GameHeader } from '@/components/GameHeader';
import { Target, Trophy, Gamepad2 } from 'lucide-react';

// Interfaces (se necessário, podem ser extraídas para um arquivo types.ts)
interface Mission {
  id: number;
  title: string;
  description: string;
  image: string;
  context: string;
  steps: string[];
  timeLimit: number;
  points: number;
  category: string;
}

export default function SocialMissionsPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentMission, setCurrentMission] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [missionStatus, setMissionStatus] = useState(''); // '' | 'em_andamento' | 'completa'

  const missions: Mission[] = [
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
      timeLimit: 300,
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
      timeLimit: 600,
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
      timeLimit: 240,
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
      timeLimit: 480,
      points: 18,
      category: "compromisso"
    }
  ];

  const mission = missions[currentMission];
  
  const startMission = (missionIndex: number) => {
    setCurrentMission(missionIndex);
    setMissionStatus('em_andamento');
  };

  const completeMission = () => {
    setCompletedMissions([...completedMissions, mission.id]);
    setScore(score + mission.points);
    setMissionStatus('completa');
  };

  const nextMission = () => {
    // Encontra a próxima missão não completada
    const nextMissionIndex = missions.findIndex(m => !completedMissions.includes(m.id) && m.id > mission.id);
    if (nextMissionIndex !== -1) {
        setCurrentMission(nextMissionIndex);
    } else {
        // Se não houver próxima, volta para a primeira não completada
        const firstIncomplete = missions.findIndex(m => !completedMissions.includes(m.id));
        setCurrentMission(firstIncomplete !== -1 ? firstIncomplete : 0);
    }
    setMissionStatus('');
  };

  const restartActivity = () => {
    setCurrentMission(0);
    setCompletedMissions([]);
    setScore(0);
    setMissionStatus('');
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const isMissionCompleted = (missionId: number) => completedMissions.includes(missionId);
  const allMissionsCompleted = completedMissions.length === missions.length;
  const totalPossiblePoints = missions.reduce((sum, mission) => sum + mission.points, 0);

  return (
    <>
      <GameHeader
        title="Missões Sociais"
        icon={<Target className="h-6 w-6" />}
        showSaveButton={false}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {!gameStarted ? (
            // TELA INICIAL PADRÃO
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:</h3>
                    <p className="text-sm text-gray-600">Desenvolver responsabilidade social e pessoal através do cumprimento de compromissos e cuidado com ambientes coletivos.</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Escolha uma missão no painel.</li>
                      <li>Leia os passos para completá-la.</li>
                      <li>Cumpra a missão na vida real.</li>
                      <li>Marque como completa e ganhe pontos!</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                    <p className="text-sm text-gray-600">A pontuação é baseada na conclusão das missões, incentivando atitudes proativas e de responsabilidade no dia a dia.</p>
                  </div>
                </div>
              </div>
              <div className="text-center pt-4">
                <button
                  onClick={startGame}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg"
                >
                  🚀 Começar Missões
                </button>
              </div>
            </div>
          ) : (
            // LAYOUT DO JOGO (lógica interna preservada)
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Painel de Missões ({score}/{totalPossiblePoints} pts)</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {missions.map((m, index) => (
                    <button
                      key={m.id}
                      onClick={() => !isMissionCompleted(m.id) && startMission(index)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                        isMissionCompleted(m.id) 
                          ? 'bg-green-100 border-green-300 cursor-default opacity-70' 
                          : currentMission === index 
                            ? 'bg-orange-100 border-orange-300 ring-2 ring-orange-400'
                            : 'bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      <div className="text-xl sm:text-2xl mb-2">{m.image}</div>
                      <div className="font-semibold text-xs sm:text-sm mb-1">{m.title.replace('Missão: ', '')}</div>
                      {isMissionCompleted(m.id) && <span className="text-green-600 text-xs font-bold">✓ Concluída</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-orange-100 p-4 sm:p-6 border-b text-center">
                  <div className="text-4xl sm:text-6xl mb-2">{mission.image}</div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{mission.title}</h2>
                  <p className="text-gray-600 text-sm sm:text-base">{mission.description}</p>
                </div>

                <div className="p-4 sm:p-6">
                  {missionStatus !== 'completa' ? (
                    <>
                      <h3 className="font-semibold text-gray-700 mb-4 text-sm sm:text-base">Passos para completar a missão:</h3>
                      <div className="space-y-3 mb-6">
                        {mission.steps.map((step, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</div>
                            <span className="text-gray-700 text-sm sm:text-base">{step}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={completeMission}
                        disabled={isMissionCompleted(mission.id)}
                        className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        ✅ Marcar Missão como Completa! (+{mission.points} pts)
                      </button>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="bg-green-100 text-green-800 p-4 sm:p-6 rounded-lg">
                        <h3 className="font-bold text-base sm:text-lg mb-2">🎉 Missão Completa!</h3>
                        <p className="mb-2 text-sm sm:text-base">Você ganhou {mission.points} pontos!</p>
                      </div>
                      {!allMissionsCompleted ? (
                        <button onClick={nextMission} className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base">
                          Próxima Missão →
                        </button>
                      ) : (
                        <div className="bg-purple-100 text-purple-800 p-4 rounded-lg">
                          <h3 className="font-bold text-base sm:text-lg">🏆 Todas as Missões Concluídas!</h3>
                          <p className="text-sm sm:text-base mt-2">Parabéns! Você é um herói da responsabilidade social!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
