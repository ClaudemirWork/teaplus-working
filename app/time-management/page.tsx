'use client'

import { useState, useEffect, useRef } from 'react'
import { Clock, Timer, Target, Brain, Play, Pause, RotateCcw, Trophy } from 'lucide-react'
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE PADRÃO "GAMEHEADER"
// ============================================================================
const GameHeader = ({ title, icon }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <Link
          href="/dashboard"
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
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
// 2. INTERFACES E DADOS DA ATIVIDADE
// ============================================================================
interface TimeEstimate {
  task: string
  estimatedTime: number
  actualTime: number
  accuracy: number
}

const tasks = [
  "Ler um email importante", "Organizar a mesa de trabalho", "Fazer uma ligação rápida",
  "Escrever um parágrafo", "Procurar um documento", "Responder uma mensagem",
  "Verificar a agenda do dia", "Fazer um lanche rápido"
];

// ============================================================================
// 3. COMPONENTE PRINCIPAL DA ATIVIDADE "GESTÃO DE TEMPO"
// ============================================================================
export default function GestaoTempoPage() {
  const [gameStarted, setGameStarted] = useState(false)
  const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(null)
  const [score, setScore] = useState(0)

  // Estados da Técnica de Foco (Nível 1)
  const [focusTime, setFocusTime] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentSession, setCurrentSession] = useState<'work' | 'break'>('work')
  const [completedSessions, setCompletedSessions] = useState(0)
  
  // Estados da Estimativa de Tempo (Nível 2)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(1)
  const [actualTime, setActualTime] = useState(0)
  const [isTimingTask, setIsTimingTask] = useState(false)
  const [timeEstimates, setTimeEstimates] = useState<TimeEstimate[]>([])
  
  // Estados da Percepção Temporal (Nível 3)
  const [targetDuration, setTargetDuration] = useState(30)
  const [userDuration, setUserDuration] = useState(0)
  const [isCountingTime, setIsCountingTime] = useState(false)
  const [perceptionResults, setPerceptionResults] = useState<Array<{target: number, actual: number, accuracy: number}>>([])
  const [confusingTime, setConfusingTime] = useState('00'); // NOVO ESTADO PARA O CRONÔMETRO CONFUSO

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Efeito principal para controlar todos os timers
  useEffect(() => {
    if (!gameStarted) {
        if(intervalRef.current) clearInterval(intervalRef.current);
        return;
    }

    if (nivelSelecionado === 1 && isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setFocusTime(prev => {
          if (prev <= 1) {
            if (currentSession === 'work') {
              setCompletedSessions(s => s + 1);
              setCurrentSession('break');
              setScore(s => s + 25);
              return 5 * 60;
            } else {
              setCurrentSession('work');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } 
    else if (nivelSelecionado === 2 && isTimingTask) {
        intervalRef.current = setInterval(() => setActualTime(t => t + 1), 1000);
    }
    // LÓGICA ATUALIZADA PARA O NÍVEL 3
    else if (nivelSelecionado === 3 && isCountingTime) {
        intervalRef.current = setInterval(() => {
            setUserDuration(d => d + 1);
            // Atualiza o cronômetro confuso a cada 100ms para um efeito mais dinâmico
            setConfusingTime(Math.floor(Math.random() * 90 + 10).toString());
        }, 100);
    }
    else {
        if(intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [gameStarted, nivelSelecionado, isRunning, isPaused, isTimingTask, isCountingTime, currentSession]);

  // Funções de controle do jogo
  const handleStartActivity = () => {
    if (nivelSelecionado !== null) {
      setGameStarted(true);
      setScore(0);
      if (nivelSelecionado === 1) {
          setFocusTime(25 * 60); setCurrentSession('work'); setCompletedSessions(0); setIsRunning(false); setIsPaused(false);
      } else if (nivelSelecionado === 2) {
          setCurrentTaskIndex(0); setTimeEstimates([]); setEstimatedTime(1);
      } else if (nivelSelecionado === 3) {
          setPerceptionResults([]); setTargetDuration(20 + Math.floor(Math.random() * 25)); // Alvo entre 20 e 45s
      }
    }
  };

  const handleReturnToMenu = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setGameStarted(false);
    setNivelSelecionado(null);
  };
  
  // Funções do Nível 1: Foco
  const startFocusSession = () => setIsRunning(true);
  const pauseFocusSession = () => setIsPaused(!isPaused);
  const resetFocusSession = () => {
    setIsRunning(false); setIsPaused(false); setFocusTime(currentSession === 'work' ? 25 * 60 : 5 * 60);
  };

  // Funções do Nível 2: Estimativa
  const startTaskTiming = () => setIsTimingTask(true);
  const finishTask = () => {
    setIsTimingTask(false);
    const actualMinutes = actualTime / 60;
    const accuracy = Math.max(0, 100 - (Math.abs(estimatedTime - actualMinutes) / estimatedTime) * 100);
    setTimeEstimates(prev => [...prev, { task: tasks[currentTaskIndex], estimatedTime, actualTime: actualMinutes, accuracy }]);
    setScore(prev => prev + Math.round(accuracy / 4));
    
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1); setEstimatedTime(1); setActualTime(0);
    } else {
        setCurrentTaskIndex(tasks.length);
    }
  };

  // Funções do Nível 3: Percepção
  const startTimePerception = () => { setUserDuration(0); setIsCountingTime(true); };
  const stopTimePerception = () => {
    if (intervalRef.current) clearInterval(intervalRef.current); // Garante que o timer rápido pare
    setIsCountingTime(false);
    // O tempo real é userDuration / 10 por causa do intervalo de 100ms
    const realUserDuration = userDuration / 10;
    const accuracy = Math.max(0, 100 - (Math.abs(targetDuration - realUserDuration) / targetDuration) * 100);
    setPerceptionResults(prev => [...prev, { target: targetDuration, actual: realUserDuration, accuracy }]);
    setScore(prev => prev + Math.round(accuracy / 5));
    setTargetDuration(20 + Math.floor(Math.random() * 25)); // Novo alvo
  };

  // ============================================================================
  // 4. RENDERIZAÇÃO DO COMPONENTE
  // ============================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Gestão de Tempo" icon={<Clock className="w-6 h-6 text-gray-700" />} />
      
      {gameStarted ? (
        <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-md text-center"><h3 className="text-sm font-medium text-gray-500">Pontuação</h3><p className="text-2xl font-bold text-orange-600">{score}</p></div>
                {nivelSelecionado === 1 && <div className="bg-white rounded-xl p-4 shadow-md text-center"><h3 className="text-sm font-medium text-gray-500">Sessões</h3><p className="text-2xl font-bold text-red-600">{completedSessions}</p></div>}
                {nivelSelecionado === 2 && <div className="bg-white rounded-xl p-4 shadow-md text-center"><h3 className="text-sm font-medium text-gray-500">Tarefas</h3><p className="text-2xl font-bold text-red-600">{currentTaskIndex}/{tasks.length}</p></div>}
                {nivelSelecionado === 3 && <div className="bg-white rounded-xl p-4 shadow-md text-center"><h3 className="text-sm font-medium text-gray-500">Rodadas</h3><p className="text-2xl font-bold text-red-600">{perceptionResults.length}</p></div>}
                <div className="bg-white rounded-xl p-4 shadow-md text-center col-span-2 md:col-span-1"><h3 className="text-sm font-medium text-gray-500">Nível</h3><p className="text-lg font-bold text-purple-600">{nivelSelecionado === 1 ? 'Técnica de Foco' : nivelSelecionado === 2 ? 'Estimativa' : 'Percepção'}</p></div>
                <button onClick={handleReturnToMenu} className="flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:bg-red-50 text-red-600 transition-colors font-semibold"><RotateCcw className="w-4 h-4" />Sair</button>
            </div>
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            {nivelSelecionado === 1 && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-6 text-red-600">{currentSession === 'work' ? '🎯 Sessão de Foco' : '☕ Pausa Rápida'}</h2>
                    <div className={`text-6xl font-mono font-bold mb-8 ${currentSession === 'work' ? 'text-gray-800' : 'text-green-600'}`}>{formatTime(focusTime)}</div>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        {!isRunning ? (<button onClick={startFocusSession} className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-green-600 transition-colors"><Play className="w-5 h-5" />Iniciar</button>) : (<button onClick={pauseFocusSession} className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-yellow-600 transition-colors"><Pause className="w-5 h-5" />{isPaused ? 'Continuar' : 'Pausar'}</button>)}
                        <button onClick={resetFocusSession} className="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-600 transition-colors"><RotateCcw className="w-5 h-5" />Reset</button>
                    </div>
                </div>
            )}
            {nivelSelecionado === 2 && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-6 text-orange-600">📊 Estimativa de Tempo</h2>
                    {currentTaskIndex < tasks.length ? (
                        <div>
                            <div className="bg-orange-50 p-6 rounded-xl mb-6"><h3 className="text-xl font-semibold">Tarefa: <span className="font-normal">{tasks[currentTaskIndex]}</span></h3></div>
                            {!isTimingTask ? (
                                <div>
                                    <p className="mb-4">Quantos minutos você acha que levará?</p>
                                    <input type="number" value={estimatedTime} onChange={(e) => setEstimatedTime(Number(e.target.value))} className="w-24 p-2 border border-gray-300 rounded-lg text-center text-lg mb-6" min="1" max="60"/>
                                    <button onClick={startTaskTiming} className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors">Começar a Tarefa</button>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-4xl font-mono font-bold text-gray-800 mb-6">⏱️ {formatTime(actualTime)}</p>
                                    <button onClick={finishTask} className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors">Tarefa Concluída!</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-4">Estimativas Concluídas!</h3>
                            <div className="space-y-2 text-left">
                                {timeEstimates.map((e, i) => <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="text-sm font-semibold">{e.task}</span><span className={`text-sm font-bold ${e.accuracy > 70 ? 'text-green-600' : 'text-red-600'}`}>Precisão: {e.accuracy.toFixed(0)}%</span></div>)}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {nivelSelecionado === 3 && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-6 text-purple-600">🧠 Percepção Temporal</h2>
                    <div className="bg-purple-50 p-6 rounded-xl mb-6">
                        <p className="text-lg mb-2">Desafio: Pare o cronômetro o mais perto possível de <span className="font-bold text-purple-700">{targetDuration} segundos</span>.</p>
                        <p className="text-sm text-gray-600">Use sua intuição, não conte os segundos!</p>
                    </div>
                    {!isCountingTime ? (
                        <button onClick={startTimePerception} className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors">Iniciar Contagem</button>
                    ) : (
                        <div>
                            <p className="text-4xl font-mono font-bold text-gray-800 mb-6 animate-pulse">
                                ⏱️ {confusingTime}s
                            </p>
                            <button onClick={stopTimePerception} className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">Parar Agora!</button>
                        </div>
                    )}
                    {perceptionResults.length > 0 && (
                        <div className="mt-8"><h4 className="font-semibold mb-4 text-left">Últimos Resultados:</h4><div className="space-y-2">{perceptionResults.slice(-5).reverse().map((r, i)=><div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="text-sm">Meta: {r.target}s | Você: {r.actual.toFixed(1)}s</span><span className={`text-sm font-bold ${r.accuracy>70 ? 'text-green-600':'text-red-600'}`}>Precisão: {r.accuracy.toFixed(0)}%</span></div>)}</div></div>
                    )}
                </div>
            )}
            </div>
        </main>
      ) : (
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3><p className="text-sm text-gray-600">Melhorar a capacidade de planejar, focar e controlar o tempo através de exercícios práticos de foco, estimativa e percepção temporal.</p></div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3><ul className="list-disc list-inside text-sm text-gray-600 space-y-1"><li>Escolha um dos três níveis (Foco, Estimativa ou Percepção).</li><li>Siga as instruções para completar sessões de trabalho ou desafios.</li><li>Ganhe pontos com base no seu desempenho e precisão.</li></ul></div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3><p className="text-sm text-gray-600">Você pontua ao completar sessões de foco (Pomodoro), ao estimar corretamente a duração de tarefas e ao acertar sua percepção de tempo.</p></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => setNivelSelecionado(1)} className={`p-4 rounded-lg font-medium transition-colors text-left ${nivelSelecionado === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}><div className="text-2xl mb-1"><Timer /></div><div className="text-sm font-bold">Nível 1: Técnica de Foco</div><div className="text-xs opacity-80">Treine concentração (Pomodoro)</div></button>
                <button onClick={() => setNivelSelecionado(2)} className={`p-4 rounded-lg font-medium transition-colors text-left ${nivelSelecionado === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}><div className="text-2xl mb-1"><Target /></div><div className="text-sm font-bold">Nível 2: Estimativa de Tempo</div><div className="text-xs opacity-80">Aprenda a prever durações</div></button>
                <button onClick={() => setNivelSelecionado(3)} className={`p-4 rounded-lg font-medium transition-colors text-left ${nivelSelecionado === 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}><div className="text-2xl mb-1"><Brain /></div><div className="text-sm font-bold">Nível 3: Percepção Temporal</div><div className="text-xs opacity-80">Calibre seu relógio interno</div></button>
              </div>
            </div>

            <div className="text-center pt-4">
              <button onClick={handleStartActivity} disabled={nivelSelecionado === null} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed">🚀 Iniciar Atividade</button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
