// app/bubble-pop/components/GameScreen.tsx
'use client';

import React from 'react';
import { ChevronLeft, VolumeX, Volume2 } from 'lucide-react';
import { Bubble, Particle, Equipment, ScoreEffect, FishEffect } from '@/app/types/bubble-pop';
import styles from '../bubble-pop.module.css';

interface GameScreenProps {
    isPlaying: boolean;
    score: number;
    combo: number;
    oxygenLevel: number;
    bubbles: Bubble[];
    particles: Particle[];
    scoreEffects: ScoreEffect[];
    fishEffects: FishEffect[];
    currentLevel: number;
    levelMessage: string;
    showLevelTransition: boolean;
    equipment: Equipment;
    savedFish: number;
    bubblesRemaining: number;
    multiplier: number;
    completedLevels: number[];
    levelConfigs: any[];
    handleInteraction: (e: React.MouseEvent | React.TouchEvent) => void;
    onBack: () => void;
    toggleAudio: () => void;
    audioEnabled: boolean;
}

export const GameScreen = React.forwardRef<HTMLDivElement, GameScreenProps>((props, ref) => {
    const {
        score, combo, oxygenLevel, bubbles, particles,
        scoreEffects, fishEffects,
        currentLevel,
        levelMessage, showLevelTransition, equipment, savedFish, bubblesRemaining,
        multiplier, levelConfigs, handleInteraction,
        onBack, toggleAudio, audioEnabled
    } = props;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-700 transition-colors">
                            <ChevronLeft className="h-6 w-6" />
                            <span className="ml-1 font-medium text-sm sm:text-base">Sair</span>
                        </button>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                            🌊<span>Oceano de Bolhas</span>
                        </h1>
                        <div className="flex items-center gap-2 w-28 justify-end">
                            <button onClick={toggleAudio} className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-2 sm:p-6 max-w-7xl mx-auto w-full">
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-lg p-2 sm:p-4">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                            <div><div className="text-base sm:text-xl font-bold text-indigo-800">Nv.{currentLevel}</div><div className="text-xs text-indigo-600">Nível</div></div>
                            <div><div className="text-base sm:text-xl font-bold text-blue-800">{score}</div><div className="text-xs text-blue-600">Pontos</div></div>
                            <div><div className="text-base sm:text-xl font-bold text-orange-800">x{combo}</div><div className="text-xs text-orange-600">Combo</div></div>
                            <div><div className="text-base sm:text-xl font-bold text-green-800">{savedFish}</div><div className="text-xs text-green-600">🐠 Salvos</div></div>
                            <div><div className="text-base sm:text-xl font-bold text-purple-800">{bubblesRemaining < 0 ? 0 : bubblesRemaining}</div><div className="text-xs text-purple-600">Faltam</div></div>
                            <div><div className={`text-base sm:text-xl font-bold ${multiplier > 1 ? 'text-yellow-500 animate-pulse' : 'text-gray-800'}`}>x{multiplier}</div><div className="text-xs text-gray-600">Multi</div></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-2 flex justify-center gap-3">
                        <span className={`text-2xl ${equipment.mask ? '' : 'opacity-30'}`}>🥽</span>
                        <span className={`text-2xl ${equipment.fins ? '' : 'opacity-30'}`}>🦶</span>
                        <span className={`text-2xl ${equipment.tank ? '' : 'opacity-30'}`}>🤿</span>
                        <span className={`text-2xl ${equipment.suit ? '' : 'opacity-30'}`}>👔</span>
                        <span className={`text-2xl ${equipment.light ? '' : 'opacity-30'}`}>🔦</span>
                    </div>

                    {currentLevel !== 11 && (
                        <div className="bg-white rounded-lg shadow p-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold">💨 Oxigênio:</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                                    <div className={`h-full transition-all duration-300 ${oxygenLevel > 60 ? 'bg-blue-500' : oxygenLevel > 30 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} style={{ width: `${oxygenLevel}%` }} />
                                </div>
                                <span className="text-sm font-bold">{Math.round(oxygenLevel)}%</span>
                            </div>
                        </div>
                    )}

                    <div ref={ref} className={`relative bg-gradient-to-b ${levelConfigs[currentLevel - 1]?.bgGradient} rounded-xl shadow-lg overflow-hidden cursor-crosshair`} style={{ height: isMobile ? 'calc(100vh - 300px)' : '550px' }} onMouseDown={handleInteraction} onTouchStart={handleInteraction}>
                        {bubbles.map(bubble => (
                            <div key={bubble.id} className={`${styles.bubbleContainer} absolute rounded-full transition-opacity`} style={{ left: `${bubble.x}px`, top: `${bubble.y}px`, width: `${bubble.size}px`, height: `${bubble.size}px`, background: bubble.color, opacity: bubble.opacity, border: `1px solid rgba(255,255,255,0.3)` }}>
                                {bubble.type === 'mine' && <div className="absolute inset-0 flex items-center justify-center text-xl">💣</div>}
                                {bubble.type === 'fish' && bubble.fishType && <div className="absolute inset-0 flex items-center justify-center text-2xl">{bubble.fishType.emoji}</div>}
                                {bubble.type === 'treasure' && <div className="absolute inset-0 flex items-center justify-center text-xl">💰</div>}
                                {bubble.type === 'pearl' && <div className="absolute inset-0 flex items-center justify-center text-xl">🦪</div>}
                                {!['mine', 'pearl', 'treasure', 'fish', 'oxygen'].includes(bubble.type) && (
                                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                                        +{bubble.points}
                                    </div>
                                )}
                            </div>
                        ))}

                        {particles.map((p) => (
                            <div
                                key={p.id}
                                className="absolute rounded-full"
                                style={{
                                    left: p.x, top: p.y, width: p.size, height: p.size,
                                    background: p.color, opacity: p.opacity, pointerEvents: 'none',
                                }}
                            />
                        ))}
                        {scoreEffects.map((effect) => (
                            <div
                                key={effect.id}
                                className={styles.scoreEffect}
                                style={{ left: effect.x, top: effect.y, opacity: effect.opacity }}
                            >
                                +{effect.points}
                            </div>
                        ))}
                        {fishEffects.map((effect) => (
                            <div
                                key={effect.id}
                                className={styles.fishEffect}
                                style={{ left: effect.x, top: effect.y, opacity: effect.opacity }}
                            >
                                {effect.emoji}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
});

GameScreen.displayName = 'GameScreen';
