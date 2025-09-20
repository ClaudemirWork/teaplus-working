'use client';

import React, { useEffect } from 'react';
import { Check, Star, ArrowRight } from 'lucide-react';
import { WEEKDAYS } from '../data/categories';
import type { RoutineItem } from '../types';
import { LeoMascotChild, useLeoMascot } from './LeoMascot';
import { GameAudioManager } from '@/utils/gameAudioManager';

interface ChildModeProps {
  selectedDay: string;
  weeklyRoutine: { [key: string]: RoutineItem[] };
  onCompleteTask: (day: string, uniqueId: string) => void;
  totalPoints: number;
}

export default function ChildMode({ 
  selectedDay, 
  weeklyRoutine, 
  onCompleteTask, 
  totalPoints 
}: ChildModeProps) {
  const todayActivities = weeklyRoutine[selectedDay] || [];
  const completedCount = todayActivities.filter(activity => activity.completed).length;
  const totalCount = todayActivities.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  const currentWeekday = WEEKDAYS.find(d => d.id === selectedDay);
  
  // Hook do Leo
  const {
    leoMood,
    leoMessage,
    showLeo,
    celebrateTask,
    encourageUser,
    greetUser,
    setLeoMessage,
    setLeoMood
  } = useLeoMascot();

  // Próxima tarefa não completada
  const nextTask = todayActivities.find(activity => !activity.completed);

  // Saudação inicial do Leo
  useEffect(() => {
    const timer = setTimeout(() => {
      greetUser();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Verificar se o dia foi completado
  useEffect(() => {
    if (completedCount === totalCount && totalCount > 0) {
      setTimeout(() => {
        setLeoMood('celebration');
        setLeoMessage('Parabéns! Você completou todas as atividades do dia! Leo está muito orgulhoso!');
        GameAudioManager.getInstance().falarLeo('Parabéns! Você completou todas as atividades do dia! Leo está muito orgulhoso!');
      }, 1500);
    }
  }, [completedCount, totalCount]);

  // Função para completar tarefa com celebração do Leo
  const handleCompleteTask = async (uniqueId: string) => {
    const task = todayActivities.find(t => t.uniqueId === uniqueId);
    if (!task) return;

    onCompleteTask(selectedDay, uniqueId);
    
    // Se está completando (não descompletando)
    if (!task.completed) {
      // Leo celebra
      celebrateTask(task.name);
      
      // Narrar próxima tarefa se houver
      setTimeout(() => {
        const remainingTasks = todayActivities.filter(t => 
          t.uniqueId !== uniqueId && !t.completed
        );
        
        if (remainingTasks.length > 0) {
          const nextTask = remainingTasks.sort((a, b) => a.time.localeCompare(b.time))[0];
          GameAudioManager.getInstance().falarLeo(`Próxima atividade: ${nextTask.name}`);
          setLeoMood('encouraging');
          setLeoMessage(`Próxima atividade: ${nextTask.name}`);
        }
      }, 3000);
    }
  };

  // Função para falar nome da próxima tarefa
  const handleNextTask = () => {
    if (nextTask) {
      GameAudioManager.getInstance().falarLeo(`Vamos fazer: ${nextTask.name}`);
      setLeoMood('encouraging');
      setLeoMessage(`Vamos fazer: ${nextTask.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 p-4 relative overflow-hidden">
      {/* Padrão de fundo divertido */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl animate-bounce">⭐</div>
        <div className="absolute top-32 right-20 text-4xl animate-pulse">🌈</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce" style={{animationDelay: '1s'}}>🎉</div>
        <div className="absolute bottom-32 right-10 text-4xl animate-pulse" style={{animationDelay: '2s'}}>✨</div>
      </div>

      {/* Header Criança */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-6xl animate-pulse">{currentWeekday?.emoji}</div>
            <div>
              <h1 className="text-3xl font-bold text-purple-600">
                {currentWeekday?.name}
              </h1>
              <p className="text-lg text-gray-600">
                Minha Rotina de Hoje
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full p-4 mb-2 animate-bounce">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{totalPoints}</p>
            <p className="text-sm text-gray-500">Estrelas</p>
          </div>
        </div>

        {/* Progresso */}
        {totalCount > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-gray-700">
                Progresso do Dia
              </span>
              <span className="text-lg font-bold text-purple-600">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-6 rounded-full transition-all duration-1000 relative"
                style={{ width: `${progressPercentage}%` }}
              >
                {progressPercentage > 0 && (
                  <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
                )}
              </div>
            </div>
            
            {/* Próxima tarefa */}
            {nextTask && (
              <div className="mt-4 p-3 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 text-white p-2 rounded-full">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Próxima:</p>
                      <p className="font-bold text-blue-800">{nextTask.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleNextTask}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition-colors"
                  >
                    Ouvir
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lista de Atividades */}
      {todayActivities.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center relative z-10">
          <div className="text-8xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Nenhuma atividade hoje
          </h2>
          <p className="text-gray-500">
            Peça para um adulto adicionar suas atividades!
          </p>
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          {todayActivities.map((activity, index) => (
            <div
              key={activity.uniqueId}
              className={`bg-white rounded-3xl shadow-xl transition-all duration-500 ${
                activity.completed 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-300 scale-98' 
                  : 'border-4 border-transparent hover:border-purple-200 hover:scale-102'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center gap-6">
                  {/* Número da Atividade */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    activity.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Horário */}
                  <div className="bg-blue-100 rounded-2xl p-4 text-center min-w-[80px]">
                    <p className="text-xl font-bold text-blue-600">
                      {activity.time}
                    </p>
                  </div>

                  {/* Imagem da Atividade */}
                  <div className="flex-shrink-0">
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-20 h-20 object-contain rounded-xl"
                    />
                  </div>

                  {/* Nome da Atividade */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                      {activity.name}
                    </h3>
                    {activity.completed && (
                      <p className="text-green-600 font-medium flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Completado!
                      </p>
                    )}
                  </div>

                  {/* Botão de Conclusão */}
                  <button
                    onClick={() => handleCompleteTask(activity.uniqueId)}
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                      activity.completed
                        ? 'bg-green-500 border-green-500 text-white scale-110 animate-pulse'
                        : 'bg-white border-gray-300 hover:border-green-400 hover:bg-green-50 hover:scale-110'
                    }`}
                  >
                    {activity.completed ? (
                      <Check className="w-8 h-8" />
                    ) : (
                      <div className="w-8 h-8 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensagem de Parabéns */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-3xl shadow-xl p-8 mt-6 text-center relative z-10 animate-bounce">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-orange-600 mb-2">
            Parabéns!
          </h2>
          <p className="text-xl text-orange-700">
            Você completou todas as atividades de hoje!
          </p>
          <div className="flex justify-center mt-4 gap-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="w-8 h-8 text-yellow-500 fill-yellow-500 animate-bounce" 
                style={{animationDelay: `${i * 0.2}s`}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Leo Mascot */}
      {showLeo && (
        <LeoMascotChild
          mood={leoMood}
          message={leoMessage}
          onMessageComplete={() => {
            // Callback quando Leo termina de falar
          }}
        />
      )}
    </div>
  );
}
