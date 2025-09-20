'use client';

import React from 'react';
import { Star, Trophy, Target, TrendingUp } from 'lucide-react';
import type { GameState } from '../types';

interface GameHUDProps {
  gameState: GameState;
  isChildMode?: boolean;
  showDetails?: boolean;
}

export default function GameHUD({ 
  gameState, 
  isChildMode = false, 
  showDetails = true 
}: GameHUDProps) {
  
  // Calcular progresso para próximo nível
  const currentLevelStars = (gameState.level - 1) * 50;
  const nextLevelStars = gameState.level * 50;
  const levelProgress = gameState.stars - currentLevelStars;
  const levelProgressMax = nextLevelStars - currentLevelStars;
  const levelProgressPercentage = (levelProgress / levelProgressMax) * 100;

  // Renderização para modo criança (simplificado e grande)
  if (isChildMode) {
    return (
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-center gap-6">
          {/* Estrelas */}
          <div className="text-center">
            <div className="bg-yellow-500 rounded-full p-3 mb-2 mx-auto w-16 h-16 flex items-center justify-center">
              <Star className="w-8 h-8 text-white fill-white" />
            </div>
            <p className="text-3xl font-bold text-yellow-600">{gameState.stars}</p>
            <p className="text-sm text-yellow-700">Estrelas</p>
          </div>

          {/* Nível */}
          <div className="text-center">
            <div className="bg-purple-500 rounded-full p-3 mb-2 mx-auto w-16 h-16 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{gameState.level}</p>
            <p className="text-sm text-purple-700">Nível</p>
          </div>

          {/* Sequência */}
          {gameState.streak > 0 && (
            <div className="text-center">
              <div className="bg-green-500 rounded-full p-3 mb-2 mx-auto w-16 h-16 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-green-600">{gameState.streak}</p>
              <p className="text-sm text-green-700">Dias</p>
            </div>
          )}
        </div>

        {/* Barra de Progresso do Nível */}
        {showDetails && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">
                Próximo Nível
              </span>
              <span className="text-sm font-bold text-gray-700">
                {levelProgress}/{levelProgressMax}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(levelProgressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Renderização para modo pai (compacto e informativo)
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Progresso do Jogo</h3>
        <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-yellow-700">{gameState.stars}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Nível */}
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-purple-600">{gameState.level}</p>
          <p className="text-xs text-purple-500">Nível</p>
        </div>

        {/* Tarefas Hoje */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <Target className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-blue-600">{gameState.completedToday}</p>
          <p className="text-xs text-blue-500">Hoje</p>
        </div>

        {/* Sequência */}
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-green-600">{gameState.streak}</p>
          <p className="text-xs text-green-500">Dias</p>
        </div>
      </div>

      {/* Progresso do Nível */}
      {showDetails && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Nível {gameState.level} → {gameState.level + 1}
            </span>
            <span className="text-sm text-gray-500">
              {levelProgress}/{levelProgressMax}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(levelProgressPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Math.max(0, levelProgressMax - levelProgress)} estrelas para o próximo nível
          </p>
        </div>
      )}

      {/* Conquistas Recentes */}
      {gameState.streak >= 7 && (
        <div className="mt-4 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-700 font-medium">
            🏆 Conquista: {gameState.streak >= 30 ? 'Mestre do Mês!' : 'Guerreiro da Semana!'}
          </p>
        </div>
      )}

      {/* Penalidades (se houver) */}
      {gameState.penalties > 0 && (
        <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
          <p className="text-xs text-red-600">
            ⚠️ Penalidades: {gameState.penalties}
          </p>
        </div>
      )}
    </div>
  );
}
