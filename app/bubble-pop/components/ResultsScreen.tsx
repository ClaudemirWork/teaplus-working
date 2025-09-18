'use client';
import React, { useEffect } from 'react';
import { Save } from 'lucide-react';
import { GameAudioManager } from '@/utils/gameAudioManager';

interface ResultsScreenProps {
  score: number;
  maxCombo: number;
  completedLevels?: number[];
  salvando: boolean;
  onRestart: () => void;
  handleSaveSession: () => void;
  accuracy: number;
  poppedBubbles: number;
  fishCollection?: Array<{ id: number; name: string; type: string }>;
  unlockedGear?: Array<{ level: number; item: string; icon: string }>;
  levelConfigs?: Array<{ name: string; depth: string }>;
}

export const ResultsScreen = React.memo(function ResultsScreen({
  score,
  maxCombo,
  completedLevels = [],
  salvando,
  onRestart,
  handleSaveSession,
  accuracy,
  poppedBubbles,
  fishCollection = [],
  unlockedGear = [],
  levelConfigs = [],
}: ResultsScreenProps) {
  // Safe fallback sempre
  const maxLevelReached = Math.max(...(completedLevels.length ? completedLevels : [1]));
  const allLevelsCompleted = completedLevels.length === 5;

  // Narração curta ao abrir resultados
  useEffect(() => {
    const audio = GameAudioManager.getInstance();
    if (!audio.getAudioEnabled()) return;

    // Resume caso a tela de resultados abra após alguma transição
    audio.forceInitialize().catch(() => {});

    const depth = levelConfigs[maxLevelReached - 1]?.depth ?? '0 metros';
    const resumo = `Resultado. Pontos: ${score}. Combo máximo: ${maxCombo}. Precisão: ${Math.round(accuracy)} por cento. Profundidade: ${depth}.`;
    // Anti-spam leve
    if (audio.shouldSpeak('results', 1500)) {
      audio.falarMila(resumo, undefined, 1);
    }
  }, [score, maxCombo, accuracy, maxLevelReached, levelConfigs]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl sm:text-6xl mb-4">
            {allLevelsCompleted ? '👑' : completedLevels.length >= 3 ? '🏆' : fishCollection.length > 5 ? '🐠' : '🌊'}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {allLevelsCompleted ? 'HERÓI DO OCEANO!' : accuracy > 80 ? 'Mergulhador Experiente!' : 'Aventura Concluída!'}
          </h3>
          <p className="text-sm text-gray-600">
            Profundidade máxima: {levelConfigs[maxLevelReached - 1]?.depth ?? '0m'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-800">{score}</div>
            <div className="text-xs text-blue-600">Pontuação Final</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-800">{poppedBubbles}</div>
            <div className="text-xs text-green-600">Bolhas Coletadas</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-orange-800">x{maxCombo}</div>
            <div className="text-xs text-orange-600">Combo Máximo</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-800">{Math.round(accuracy)}%</div>
            <div className="text-xs text-purple-600">Precisão</div>
          </div>
        </div>

        {/* Peixes e criaturas coletadas */}
        {(fishCollection?.length ?? 0) > 0 && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 mb-4">
            <h4 className="font-bold text-gray-800 mb-2 text-sm">🐠 Criaturas Nomeadas ({fishCollection.length}):</h4>
            <div className="flex flex-wrap gap-2">
              {fishCollection.map((fish, idx) => (
                <span key={idx} className="text-xs bg-white px-2 py-1 rounded">
                  {fish.type === 'pearl' ? '🦪' : fish.type === 'treasure' ? '💰' : '🐠'} {fish.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Equipamentos desbloqueados */}
        {(unlockedGear?.length ?? 0) > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <h4 className="font-bold text-gray-800 mb-2 text-sm">🤿 Equipamentos Coletados:</h4>
            <div className="flex flex-wrap gap-2">
              {unlockedGear.map((gear, idx) => (
                <span key={idx} className="text-xs bg-white px-2 py-1 rounded">
                  {gear.icon} {gear.item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Relatório de Níveis */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="font-bold text-gray-800 mb-2 text-sm">🌊 Níveis Completados:</h4>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-bold ${
                  completedLevels?.includes(level) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                }`}
              >
                {level}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 text-base"
          >
            🔄 Jogar Novamente
          </button>
          <button
            onClick={handleSaveSession}
            disabled={salvando}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              !salvando ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save size={18} />
            <span>{salvando ? 'Salvando...' : 'Salvar Sessão'}</span>
          </button>
        </div>
      </div>
    </div>
  );
});
