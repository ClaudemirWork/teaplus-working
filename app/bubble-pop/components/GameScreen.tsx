// app/bubble-pop/components/GameScreen.tsx
'use client';

import React from 'react';
import { ChevronLeft, VolumeX, Volume2 } from 'lucide-react';
import { Bubble, Particle } from '@/app/types/bubble-pop';
import styles from '../bubble-pop.module.css';

interface GameScreenProps {
    score: number;
    combo: number;
    oxygenLevel: number;
    bubbles: Bubble[];
    particles: Particle[];
    currentLevel: number;
    poppedBubbles: number;
    bubblesRemaining: number;
    showLevelTransition: boolean;
    levelMessage: string;
    levelConfigs: any[];
    handleInteraction: (e: React.MouseEvent | React.TouchEvent) => void;
    onBack: () => void;
    toggleAudio: () => void;
    audioEnabled: boolean;
}

export const GameScreen = React.forwardRef<HTMLDivElement, GameScreenProps>((props, ref) => {
    const {
        score, combo, oxygenLevel, bubbles, particles, currentLevel,
        poppedBubbles, bubblesRemaining, showLevelTransition, levelMessage,
        levelConfigs, handleInteraction, onBack, toggleAudio, audioEnabled
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
                    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
                        <div className="grid grid-cols-5 gap-2 text-center">
                            <div><div className="text-base sm:text-xl font-bold text-indigo-800">{levelConfigs[currentLevel - 1]?.depth}</div><div className="text-xs text-indigo-600">Profundidade</div></div>
                            <div><div className="text-base sm:text-xl font-bold text-blue-800">{score}</div><div className="text-xs text-blue-600">Pontos</div></div>
                            <div><div className="text-base sm:text-xl font-bold text-orange-800">x{combo}</div><div className="text-xs text-orange-600">Combo</div></div>
                            <div><div className="text-base sm:text-xl font-bold text-green-800">{poppedBubbles}</div><div className="text-xs text-green-600">Coletadas</div></div>
                            <div><div className="text-base sm:text-xl font-bold text-purple-800">{bubblesRemaining < 0 ? 0 : bubblesRemaining}</div><div className="text-xs text-purple-600">Restantes</div></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">💨 Oxigênio:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                                <div className={`h-full transition-all duration-300 ${oxygenLevel > 60 ? 'bg-blue-500' : oxygenLevel > 30 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} style={{ width: `${oxygenLevel}%` }} />
                            </div>
                            <span className="text-sm font-bold">{Math.round(oxygenLevel)}%</span>
                        </div>
                    </div>

                    <div ref={ref} className={`relative bg-gradient-to-b ${levelConfigs[currentLevel - 1]?.bgGradient} rounded-xl shadow-lg overflow-hidden cursor-crosshair`} style={{ height: isMobile ? '450px' : '500px' }} onMouseDown={handleInteraction} onTouchStart={handleInteraction}>
                        {showLevelTransition && (
                            <div className={styles.levelTransition}>
                                <div className="text-center animate-bounce">
                                    <div className="text-4xl sm:text-6xl mb-2">🌊</div>
                                    <div className="text-xl sm:text-3xl font-bold text-blue-600">{levelMessage}</div>
                                    <div className="text-sm sm:text-base text-gray-600 mt-2">Descendo para: {levelConfigs[currentLevel]?.name}</div>
                                </div>
                            </div>
                        )}
                        
                        {bubbles.map(bubble => (
                            <div
                                key={bubble.id}
                                className={`absolute rounded-full transition-opacity ${styles.bubbleContainer}`}
                                style={{
                                    left: `${bubble.x}px`, top: `${bubble.y}px`, width: `${bubble.size}px`, height: `${bubble.size}px`,
                                    background: bubble.color, opacity: bubble.opacity,
                                    border: `1px solid rgba(255,255,255,0.3)`,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    transform: `scale(${bubble.popped ? 1.5 : 1})`,
                                }}
                            >
                                {bubble.type === 'mine' && <div className="absolute inset-0 flex items-center justify-center text-xl">💣</div>}
                                {bubble.type === 'pearl' && <div className="absolute inset-0 flex items-center justify-center text-xl">🦪</div>}
                                {bubble.type === 'treasure' && <div className="absolute inset-0 flex items-center justify-center text-xl">💰</div>}
                                {!['mine', 'pearl', 'treasure'].includes(bubble.type) && (
                                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                                        +{bubble.points}
                                    </div>
                                )}
                            </div>
                        ))}

                        {particles.map(particle => (
                            <div key={particle.id} className="absolute rounded-full pointer-events-none"
                                style={{
                                    left: `${particle.x}px`, top: `${particle.y}px`, width: '6px', height: '6px',
                                    background: particle.color, opacity: particle.life
                                }}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
});

GameScreen.displayName = 'GameScreen';
