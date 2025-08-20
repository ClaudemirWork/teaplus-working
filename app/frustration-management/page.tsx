'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

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
// 2. PÁGINA DA ATIVIDADE "GESTÃO DAS FRUSTRAÇÕES"
// ============================================================================
export default function FrustrationManagementPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [points, setPoints] = useState(0);
  const [nivelSelecionado, setNivelSelecionado] = useState(1);
  const router = useRouter();

  // --- Estados específicos da atividade ---
  const [isActive, setIsActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [breathingCount, setBreathingCount] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);

  // --- Dados da Atividade ---
  const exercises = [
    { id: 1, title: "Respiração 4-7-8", type: "breathing", description: "Técnica para acalmar o sistema nervoso.", instruction: "Concentre-se no círculo e siga o ritmo para ativar a resposta de relaxamento." },
    { id: 2, title: "Identificando Pensamentos Distorcidos", type: "reframing", description: "Reconhecer padrões que intensificam a frustração.", instruction: "Examine os exemplos de como nossos pensamentos podem nos enganar quando estamos frustrados." },
    { id: 3, title: "Reescrevendo a Narrativa", type: "reflection", description: "Transformar pensamentos negativos em perspectivas equilibradas.", instruction: "Responda às perguntas para praticar uma visão mais realista e gentil sobre os problemas." },
    { id: 4, title: "Técnica STOP", type: "action-plan", description: "Estratégia prática para o momento da frustração.", instruction: "Memorize os 4 passos para usar quando sentir a raiva ou frustração crescendo." },
  ];
  
  const frustratingScenarios = [
    { situation: "Seu chefe criticou seu trabalho na frente dos colegas", distortedThought: "Ele me odeia e quer me demitir. Sou um fracasso.", reframedThought: "Ele pode estar estressado ou ter um estilo de comunicação direto. Posso aprender com o feedback e conversar em particular." },
    { situation: "Você perdeu uma oportunidade importante por 5 minutos de atraso", distortedThought: "Sempre acontece isso comigo. Nunca vou conseguir nada.", reframedThought: "Foi frustrante, mas imprevistos acontecem. Posso me preparar melhor para próximas oportunidades." },
    { situation: "Alguém cortou sua fila no supermercado", distortedThought: "As pessoas são sempre desrespeitosas comigo. Ninguém me respeita.", reframedThought: "Pode ter sido um mal-entendido ou a pessoa pode estar com pressa por alguma emergência." }
  ];

  // Lógica de respiração
  useEffect(() => {
    let breathTimer: NodeJS.Timeout | null = null;
    if (isActive && exercises[currentExercise].type === 'breathing') {
      breathTimer = setInterval(() => {
        setBreathingCount(prev => {
          const newCount = prev + 1;
          if (breathingPhase === 'inhale' && newCount >= 4) {
            setBreathingPhase('hold'); return 0;
          } else if (breathingPhase === 'hold' && newCount >= 7) {
            setBreathingPhase('exhale'); return 0;
          } else if (breathingPhase === 'exhale' && newCount >= 8) {
            setCurrentCycle(cycle => {
              const newCycle = cycle + 1;
              if (newCycle >= 4) {
                setIsActive(false); setBreathingPhase('rest'); return 0;
              }
              setBreathingPhase('inhale');
              return newCycle;
            });
            return 0;
          }
          return newCount;
        });
      }, 1000);
    }
    return () => { if (breathTimer) clearInterval(breathTimer); };
  }, [isActive, breathingPhase, currentExercise]);

  const startBreathing = () => {
    setIsActive(true);
    setBreathingPhase('inhale');
    setBreathingCount(0);
    setCurrentCycle(0);
  };
  
  const stopExercise = () => {
    setIsActive(false);
    setBreathingPhase('rest');
  };

  const getBreathingInstruction = () => {
    if(!isActive) return "Iniciar";
    switch (breathingPhase) {
      case 'inhale': return `Inspire... ${breathingCount + 1}`;
      case 'hold': return `Segure... ${breathingCount + 1}`;
      case 'exhale': return `Expire... ${breathingCount + 1}`;
      default: return 'Pronto';
    }
  };

  const getBreathingStyle = () => {
    switch (breathingPhase) {
      case 'inhale': return 'scale-110 bg-blue-500';
      case 'hold': return 'scale-110 bg-purple-500';
      case 'exhale': return 'scale-100 bg-teal-500';
      default: return 'scale-100 bg-gray-300';
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentExercise(0);
    setPoints(0);
    setCompletedExercises([]);
  };

  const completeCurrentExercise = () => {
    if (!completedExercises.includes(exercises[currentExercise].id)) {
      setCompletedExercises(prev => [...prev, exercises[currentExercise].id]);
      setPoints(p => p + 10);
    }
  };

  const nextExercise = () => { if (currentExercise < exercises.length - 1) setCurrentExercise(c => c + 1) };
  const prevExercise = () => { if (currentExercise > 0) setCurrentExercise(c => c - 1) };

  // ============================================================================
  // RENDERIZAÇÃO DA ATIVIDADE EM SI
  // ============================================================================
  if (gameStarted) {
    const exercise = exercises[currentExercise];
    const isCompleted = completedExercises.includes(exercise.id);

    return (
      <div className="min-h-screen bg-gray-50">
        <GameHeader title="Gestão da Frustração" icon={<ShieldCheck size={24} />} />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-6">
                <div className="text-sm text-gray-600">Pontos: <span className="font-bold text-teal-600">{points}</span></div>
                <div className="w-full max-w-xs mx-auto">
                    <p className="text-center text-sm text-gray-600 mb-1">Exercício {currentExercise + 1} de {exercises.length}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-teal-500 h-2 rounded-full" style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}></div></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{exercise.title}</h2>
                    <p className="text-gray-600 mt-1">{exercise.description}</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md"><p className="text-gray-700">{exercise.instruction}</p></div>

                {/* --- CONTEÚDO CORRIGIDO DOS EXERCÍCIOS --- */}
                {exercise.type === 'breathing' && (
                    <div className="text-center p-4 space-y-6">
                        <div className="flex justify-center items-center">
                            <div className={`w-48 h-48 rounded-full flex items-center justify-center text-white font-bold text-2xl transition-all duration-1000 ${getBreathingStyle()}`}>
                                {getBreathingInstruction()}
                            </div>
                        </div>
                        <button onClick={!isActive ? startBreathing : stopExercise} className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${!isActive ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}`}>
                            {!isActive ? "Iniciar Respiração" : "Parar"}
                        </button>
                    </div>
                )}
                {exercise.type === 'reframing' && (
                    <div className="space-y-4">
                        {frustratingScenarios.map((scenario, index) => (
                            <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-2">
                                <p><span className="font-bold">Situação:</span> {scenario.situation}</p>
                                <p className="p-2 rounded bg-red-100 text-red-800"><span className="font-bold">Pensamento Distorcido:</span> "{scenario.distortedThought}"</p>
                                <p className="p-2 rounded bg-green-100 text-green-800"><span className="font-bold">Pensamento Reenquadrado:</span> "{scenario.reframedThought}"</p>
                            </div>
                        ))}
                    </div>
                )}
                {exercise.type === 'reflection' && (<textarea className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-teal-500" placeholder="Escreva sua reflexão aqui..."></textarea>)}
                {exercise.type === 'action-plan' && (
                     <ul className="list-inside space-y-2 p-4 bg-yellow-50 rounded-lg text-lg">
                        <li className="font-bold">S - PARE</li>
                        <li className="font-bold">T - RESPIRE</li>
                        <li className="font-bold">O - OBSERVE</li>
                        <li className="font-bold">P - PROSSIGA</li>
                     </ul>
                )}
                
                <div className="text-center border-t pt-6">
                    <button onClick={completeCurrentExercise} disabled={isCompleted} className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors text-lg ${isCompleted ? 'bg-green-500 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}>
                        {isCompleted ? '✅ Concluído' : 'Concluir Exercício'}
                    </button>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button onClick={prevExercise} disabled={currentExercise === 0} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
                <button onClick={nextExercise} disabled={currentExercise === exercises.length - 1} className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Próximo</button>
            </div>
        </main>
      </div>
    );
  }

  // ============================================================================
  // RENDERIZAÇÃO DA TELA INICIAL
  // ============================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Gestão da Frustração" icon={<ShieldCheck size={24} />} />
      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {/* ... (código da tela inicial permanece o mesmo) ... */}
      </main>
    </div>
  );
}
