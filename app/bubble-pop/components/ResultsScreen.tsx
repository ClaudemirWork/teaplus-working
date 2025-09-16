// app/bubble-pop/components/ResultsScreen.tsx
'use client';

import React from 'react';
import styles from '../bubble-pop.module.css';
import { Equipment } from '@/app/types/bubble-pop';
import { Save } from 'lucide-react';

interface ResultsScreenProps {
    score: number;
    savedFish: number;
    maxCombo: number;
    completedLevels: number[];
    equipment: Equipment;
    bossDefeated: boolean;
    salvando: boolean;
    onRestart: () => void;
    handleSaveSession: () => void;
    accuracy: number;
}

export const ResultsScreen = React.memo(({ score, savedFish, maxCombo, completedLevels, equipment, bossDefeated, salvando, onRestart, handleSaveSession, accuracy }: ResultsScreenProps) => {
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className={`text-5xl sm:text-6xl mb-4 ${bossDefeated ? styles.victoryAnimation : ''}`}>
                        {bossDefeated ? '👑' : completedLevels.length >= 10 ? '🏆' : savedFish > 10 ? '🐠' : '🌊'}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                        {bossDefeated ? 'HERÓI DO OCEANO!' : 'Aventura Concluída!'}
                    </h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 text-center">
                        <div className="text-lg sm:text-xl font-bold text-blue-800">{score}</div>
                        <div className="text-xs text-blue-600">Pontuação Final</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 text-center">
                        <div className="text-lg sm:text-xl font-bold text-green-800">{savedFish}</div>
                        <div className="text-xs text-green-600">Peixes Salvos</div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 text-center">
                        <div className="text-lg sm:text-xl font-bold text-orange-800">x{maxCombo}</div>
                        <div className="text-xs text-orange-600">Combo Máximo</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 text-center">
                        <div className="text-lg sm:text-xl font-bold text-purple-800">{accuracy}%</div>
                        <div className="text-xs text-purple-600">Precisão</div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <button onClick={onRestart} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 text-base">
                        🔄 Jogar Novamente
                    </button>
                    <button onClick={handleSaveSession} disabled={salvando} className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${!salvando ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                        <Save size={18} />
                        <span>{salvando ? 'Salvando...' : 'Salvar Sessão'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

ResultsScreen.displayName = 'ResultsScreen';
