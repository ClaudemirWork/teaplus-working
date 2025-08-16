'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Pause, RotateCcw, Zap, Timer, Target, Trophy, AlertTriangle, CheckCircle, Clock, Brain } from 'lucide-react';

interface Task {
  id: number;
  type: 'math' | 'memory' | 'reaction' | 'pattern';
  content: any;
  priority: 'low' | 'medium' | 'high';
  timeLeft: number;
  maxTime: number;
  completed: boolean;
  failed: boolean;
}

export default function MultitaskChallenge() {
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [failedTasks, setFailedTasks] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [efficiency, setEfficiency] = useState(100);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [memorySequence, setMemorySequence] = useState<number[]>([]);
  const [showingMemorySequence, setShowingMemorySequence] = useState(false);

  const taskIdRef = useRef(1);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const taskTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getLevelConfig = () => {
    switch(level) {
      case 1: return { maxTasks: 2, taskInterval: 8000, taskTime: 15 };
      case 2: return { maxTasks: 3, taskInterval: 6000, taskTime: 12 };
      case 3: return { maxTasks: 4, taskInterval: 4000, taskTime: 10 };
      default: return { maxTasks: 2, taskInterval: 8000, taskTime: 15 };
    }
  };

  const generateMathTask = () => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer;
    switch(operation) {
      case '+': answer = a + b; break;
      case '-': answer = Math.abs(a - b); break;
      case '×': answer = a * b; break;
      default: answer = a + b;
    }
    
    return {
      question: `${a} ${operation} ${b} = ?`,
      answer: answer,
      userAnswer: ''
    };
  };

  const generateMemoryTask = () => {
    const sequence = Array.from({length: 4}, () => Math.floor(Math.random() * 6) + 1);
    return {
      sequence: sequence,
      userSequence: [],
      revealed: false
    };
  };

  const generateReactionTask = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    const currentColor = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      targetColor,
      currentColor,
      clicked: false
    };
  };

  const generatePatternTask = () => {
    const patterns = [
      [1, 2, 3, '?'],
      [2, 4, 6, '?'],
      [1, 1, 2, '?'],
      [5, 4, 3, '?']
    ];
    const answers = [4, 8, 3, 2];
    const patternIndex = Math.floor(Math.random() * patterns.length);
    
    return {
      pattern: patterns[patternIndex],
      answer: answers[patternIndex],
      userAnswer: ''
    };
  };

  const createNewTask = useCallback(() => {
    const config = getLevelConfig();
    const taskTypes: Task['type'][] = ['math', 'memory', 'reaction', 'pattern'];
    const priorities: Task['priority'][] = ['low', 'medium', 'high'];
    
    const type = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    let content;
    switch(type) {
      case 'math': content = generateMathTask(); break;
      case 'memory': content = generateMemoryTask(); break;
      case 'reaction': content = generateReactionTask(); break;
      case 'pattern': content = generatePatternTask(); break;
    }

    const task: Task = {
      id: taskIdRef.current++,
      type,
      content,
      priority,
      timeLeft: config.taskTime,
      maxTime: config.taskTime,
      completed: false,
      failed: false
    };

    return task;
  }, [level]);

  const addNewTask = useCallback(() => {
    const config = getLevelConfig();
    setTasks(prevTasks => {
      const activeTasks = prevTasks.filter(t => !t.completed && !t.failed);
      if (activeTasks.length >= config.maxTasks) return prevTasks;
      
      return [...prevTasks, createNewTask()];
    });
  }, [createNewTask]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && timeRemaining > 0 && !gameCompleted) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsPlaying(false);
      setGameCompleted(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeRemaining, gameCompleted]);

  useEffect(() => {
    if (isPlaying) {
      const config = getLevelConfig();
      
      // Add initial tasks
      const initialTasks = Array.from({length: Math.min(2, config.maxTasks)}, () => createNewTask());
      setTasks(initialTasks);
      
      // Set up task generation interval
      gameTimerRef.current = setInterval(() => {
        addNewTask();
      }, config.taskInterval);

      // Set up task countdown timer
      taskTimerRef.current = setInterval(() => {
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.completed || task.failed) return task;
            
            const newTimeLeft = task.timeLeft - 1;
            if (newTimeLeft <= 0) {
              setFailedTasks(prev => prev + 1);
              setEfficiency(prev => Math.max(0, prev - 15));
              return { ...task, failed: true, timeLeft: 0 };
            }
            return { ...task, timeLeft: newTimeLeft };
          })
        );
      }, 1000);
    }

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (taskTimerRef.current) clearInterval(taskTimerRef.current);
    };
  }, [isPlaying, addNewTask, createNewTask]);

  const startActivity = () => {
    setIsPlaying(true);
    setTimeRemaining(120);
    setScore(0);
    setLevel(1);
    setTasks([]);
    setCompletedTasks(0);
    setFailedTasks(0);
    setCurrentTaskId(null);
    setGameCompleted(false);
    setEfficiency(100);
    taskIdRef.current = 1;
  };

  const pauseActivity = () => {
    setIsPlaying(false);
  };

  const resetActivity = () => {
    setIsPlaying(false);
    setTimeRemaining(120);
    setScore(0);
    setLevel(1);
    setTasks([]);
    setCompletedTasks(0);
    setFailedTasks(0);
    setCurrentTaskId(null);
    setGameCompleted(false);
    setEfficiency(100);
    taskIdRef.current = 1;
  };

  const completeTask = useCallback((taskId: number, success: boolean = true) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          if (success) {
            const priorityMultiplier = { low: 1, medium: 1.5, high: 2 }[task.priority];
            const timeBonus = Math.floor(task.timeLeft / task.maxTime * 20);
            const points = Math.floor((30 * priorityMultiplier + timeBonus) * level);
            
            setScore(prev => prev + points);
            setCompletedTasks(prev => prev + 1);
            setFeedbackMessage(`+${points} pontos!`);
          } else {
            setFailedTasks(prev => prev + 1);
            setEfficiency(prev => Math.max(0, prev - 10));
            setFeedbackMessage('Tarefa falhada!');
          }
          
          setShowFeedback(true);
          setTimeout(() => setShowFeedback(false), 1500);
          
          return { ...task, completed: success, failed: !success };
        }
        return task;
      })
    );
    
    setCurrentTaskId(null);
  }, [level]);

  const handleTaskAction = (taskId: number, action: any) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    switch(task.type) {
      case 'math':
        if (action.answer === task.content.answer) {
          completeTask(taskId, true);
        } else {
          completeTask(taskId, false);
        }
        break;
        
      case 'memory':
        if (JSON.stringify(action.sequence) === JSON.stringify(task.content.sequence)) {
          completeTask(taskId, true);
        } else {
          completeTask(taskId, false);
        }
        break;
        
      case 'reaction':
        if (action.clicked && task.content.currentColor === task.content.targetColor) {
          completeTask(taskId, true);
        } else if (action.clicked) {
          completeTask(taskId, false);
        }
        break;
        
      case 'pattern':
        if (action.answer === task.content.answer) {
          completeTask(taskId, true);
        } else {
          completeTask(taskId, false);
        }
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch(priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch(priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
    }
  };

  const renderTaskContent = (task: Task) => {
    switch(task.type) {
      case 'math':
        return (
          <div className="space-y-2">
            <p className="font-medium">{task.content.question}</p>
            <div className="flex space-x-2">
              <input
                type="number"
                className="border rounded px-2 py-1 w-20"
                onChange={(e) => {
                  const answer = parseInt(e.target.value);
                  if (!isNaN(answer)) {
                    handleTaskAction(task.id, { answer });
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const answer = parseInt((e.target as HTMLInputElement).value);
                    if (!isNaN(answer)) {
                      handleTaskAction(task.id, { answer });
                    }
                  }
                }}
              />
            </div>
          </div>
        );
        
      case 'memory':
        return (
          <div className="space-y-2">
            <p className="font-medium">Memorize: {task.content.sequence.join(' - ')}</p>
            <div className="grid grid-cols-4 gap-1">
              {[1,2,3,4,5,6].map(num => (
                <button
                  key={num}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  onClick={() => {
                    const newSequence = [...task.content.userSequence, num];
                    if (newSequence.length === task.content.sequence.length) {
                      handleTaskAction(task.id, { sequence: newSequence });
                    } else {
                      setTasks(prev => prev.map(t => 
                        t.id === task.id ? {...t, content: {...t.content, userSequence: newSequence}} : t
                      ));
                    }
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-sm">Sua sequência: {task.content.userSequence.join(' - ')}</p>
          </div>
        );
        
      case 'reaction':
        return (
          <div className="space-y-2">
            <p className="font-medium">Clique quando a cor for: {task.content.targetColor}</p>
            <button
              className={`w-16 h-16 rounded border-4 transition-colors bg-${task.content.currentColor}-500`}
              onClick={() => handleTaskAction(task.id, { clicked: true })}
            >
            </button>
            <p className="text-sm">Cor atual: {task.content.currentColor}</p>
          </div>
        );
        
      case 'pattern':
        return (
          <div className="space-y-2">
            <p className="font-medium">Complete: {task.content.pattern.join(' - ')}</p>
            <input
              type="number"
              className="border rounded px-2 py-1 w-20"
              onChange={(e) => {
                const answer = parseInt(e.target.value);
                if (!isNaN(answer)) {
                  handleTaskAction(task.id, { answer });
                }
              }}
            />
          </div>
        );
    }
  };

  const activeTasks = tasks.filter(t => !t.completed && !t.failed);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>← Voltar</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 rounded-full bg-purple-500 text-white font-medium flex items-center space-x-2">
                <Zap size={16} />
                <span>Desafio Multitarefa</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <Zap className="mr-3 text-purple-600" size={40} />
              Desafio Multitarefa
            </h1>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Objetivo */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-red-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  🎯 Objetivo:
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Gerencie múltiplas tarefas simultaneamente: matemática, memória, reação e padrões. Priorize com base na urgência e complete antes do tempo limite. Desenvolva atenção dividida e função executiva.
                </p>
              </div>
            </div>

            {/* Pontuação */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  👥 Pontuação:
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Tarefa completada = +30 pontos × prioridade × nível. Bônus de tempo: +20% dos pontos baseado no tempo restante. Prioridade: Baixa (×1), Média (×1.5), Alta (×2).
                </p>
              </div>
            </div>

            {/* Níveis */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-purple-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  📊 Níveis:
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <p><strong className="text-purple-600">Nível 1:</strong> 2 tarefas simultâneas, 15s cada (fácil)</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> 3 tarefas simultâneas, 12s cada (médio)</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> 4 tarefas simultâneas, 10s cada (difícil)</p>
                </div>
              </div>
            </div>

            {/* Final */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-green-500 text-white px-6 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                  🏁 Final:
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Gerencie tarefas por 2 minutos mantendo alta eficiência. Tarefas não completadas reduzem sua eficiência. Mantenha acima de 70% para sucesso.
                </p>
              </div>
            </div>
          </div>

          {/* Game Area */}
          {isPlaying || gameCompleted ? (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              {/* Game Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 px-4 py-2 rounded-lg">
                    <span className="text-purple-800 font-medium">Nível {level}/3</span>
                  </div>
                  <div className="bg-blue-100 px-4 py-2 rounded-lg">
                    <span className="text-blue-800 font-medium">Pontos: {score}</span>
                  </div>
                  <div className="bg-green-100 px-4 py-2 rounded-lg">
                    <span className="text-green-800 font-medium">Eficiência: {efficiency}%</span>
                  </div>
                  <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                    <span className="text-yellow-800 font-medium">Completadas: {completedTasks}</span>
                  </div>
                </div>
                <div className="bg-red-100 px-4 py-2 rounded-lg flex items-center">
                  <Timer className="mr-2 text-red-600" size={16} />
                  <span className="text-red-800 font-medium">{formatTime(timeRemaining)}</span>
                </div>
              </div>

              {/* Game Completed */}
              {gameCompleted && (
                <div className="text-center mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Trophy className="mx-auto text-green-600 mb-2" size={32} />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Desafio Completo!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Pontuação final: {score} pontos | Eficiência: {efficiency}% | Tarefas completadas: {completedTasks}
                  </p>
                </div>
              )}

              {/* Feedback */}
              {showFeedback && (
                <div className="text-center mb-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-purple-800 font-medium">{feedbackMessage}</p>
                  </div>
                </div>
              )}

              {/* Active Tasks */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {activeTasks.map(task => (
                  <div
                    key={task.id}
                    className={`border-2 rounded-lg p-4 ${getPriorityColor(task.priority)} transition-all duration-200`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getPriorityIcon(task.priority)}</span>
                        <span className="font-medium capitalize">{task.type}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span className="text-sm font-medium">{task.timeLeft}s</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(task.timeLeft / task.maxTime) * 100}%` }}
                      ></div>
                    </div>
                    
                    {renderTaskContent(task)}
                  </div>
                ))}
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={pauseActivity}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  disabled={gameCompleted}
                >
                  <Pause size={20} />
                  <span>Pausar</span>
                </button>
                <button
                  onClick={resetActivity}
                  className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <RotateCcw size={20} />
                  <span>Reiniciar</span>
                </button>
              </div>
            </div>
          ) : (
            /* Start Screen */
            <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-6">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Pronto para o desafio multitarefa?
              </h3>
              <p className="text-gray-600 mb-6">
                Clique em "Iniciar Desafio" para começar a gestão de múltiplas tarefas simultâneas
              </p>
              <button
                onClick={startActivity}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-medium transition-colors mx-auto"
              >
                <Play size={20} />
                <span>Iniciar Desafio</span>
              </button>
            </div>
          )}

          {/* Base Científica */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              🧬 Base Científica:
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Este exercício é baseado em pesquisas sobre atenção dividida e função executiva. 
              Estimula redes neurais do córtex pré-frontal (controle executivo), córtex cingulado anterior (monitoramento de conflitos) e áreas parietais (atenção espacial). 
              O treinamento multitarefa melhora flexibilidade cognitiva, priorização e gestão de recursos atencionais, habilidades essenciais para pessoas com TDAH.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
