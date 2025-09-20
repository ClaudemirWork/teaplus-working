'use client';

import React from 'react';
import { Check, Star } from 'lucide-react';
import { WEEKDAYS } from '../data/categories';
import type { RoutineItem } from '../types';

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
  
  const currentWeekday = WEEKDAYS.find(d => d.id === selectedDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 p-4">
      {/* Header Criança */}
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{currentWeekday?.emoji}</div>
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
            <div className="bg-yellow-100 rounded-full p-4 mb-2">
              <Star className="w-8 h-8 text-yellow-500" />
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
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Atividades */}
      {todayActivities.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <div className="text-8xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Nenhuma atividade hoje
          </h2>
          <p className="text-gray-500">
            Peça para um adulto adicionar suas atividades!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {todayActivities.map((activity) => (
            <div
              key={activity.uniqueId}
              className={`bg-white rounded-3xl shadow-xl p-6 transition-all duration-300 ${
                activity.completed ? 'bg-green-50 border-4 border-green-300' : 'border-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-6">
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
                </div>

                {/* Botão de Conclusão */}
                <button
                  onClick={() => onCompleteTask(selectedDay, activity.uniqueId)}
                  className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                    activity.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  {activity.completed && <Check className="w-8 h-8" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensagem de Parabéns */}
      {completedCount === totalCount && totalCount > 0 && (
        <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-3xl shadow-xl p-8 mt-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-orange-600 mb-2">
            Parabéns!
          </h2>
          <p className="text-xl text-orange-700">
            Você completou todas as atividades de hoje!
          </p>
        </div>
      )}
    </div>
  );
}
