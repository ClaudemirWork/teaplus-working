// app/bubble-pop/components/GameScreen.tsx
'use client';

import React, { forwardRef } from 'react';
import styles from '../bubble-pop.module.css';

interface GameScreenProps {
  isPlaying: boolean;
  score: number;
  combo: number;
  oxygenLevel: number;
  bubbles: any[];
  particles: any[];
  currentLevel: number;
  bubblesRemaining: number;
  levelConfigs: any[];
  handleInteraction: (e: React.MouseEvent | React.TouchEvent) => void;
  audioEnabled: boolean;
  toggleAudio: () => void;
  showLevelTransition: boolean;
  levelMessage: string;
  fishCollection?: Array<{id: number, name: string, type: string}>;
}

export const GameScreen = forwardRef<HTMLDivElement, GameScreenProps>(
  (props, ref) => {
    const {
      score,
      combo,
      oxygenLevel,
      bubbles,
      particles,
      currentLevel,
      bubblesRemaining,
      levelConfigs,
      handleInteraction,
      audioEnabled,
      toggleAudio,
      showLevelTransition,
      levelMessage,
      fishCollection = [],
    } = props;

    const config = levelConfigs[currentLevel - 1];

    // Tela de transição de nível
    if (showLevelTransition) {
      return (
        <div className={`min-h-screen bg-gradient-to-b ${config.bgGradient} flex items-center justify-center`}>
          <div className="text-center text-white animate-pulse">
            <h2 className="text-4xl font-bold mb-4">{levelMessage}</h2>
            <p className="text-2xl">Preparando próximo nível...</p>
          </div>
        </div>
      );
    }

    // ✅ FUNÇÃO SEGURA DE INTERAÇÃO
    const handleSafeInteraction = (e: React.MouseEvent | React.TouchEvent) => {
      try {
        e.preventDefault();
        e.stopPropagation();
        handleInteraction(e);
      } catch (error) {
        console.log('Erro na interação:', error);
      }
    };

    return (
      <div className={`min-h-screen bg-gradient-to-b ${config.bgGradient} relative overflow-hidden`}>
        {/* HUD - Interface do Jogo */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4">
          <div className="flex justify-between items-start text-white">
            <div className="bg-black/30 backdrop-blur rounded-lg p-3">
              <p className="text-lg font-bold">Pontos: {score}</p>
              <p className="text-sm">Combo: x{combo}</p>
            </div>

            <div className="bg-black/30 backdrop-blur rounded-lg p-3 text-center">
              <p className="text-sm font-semibold">{config.name}</p>
              <p className="text-xs">Bolhas: {bubblesRemaining}</p>
            </div>

            <button
              onClick={toggleAudio}
              className="bg-black/30 backdrop-blur rounded-lg p-3 hover:bg-black/40 transition-colors"
              aria-label="Toggle audio"
            >
              {audioEnabled ? '🔊' : '🔇'}
            </button>
          </div>

          {/* Barra de Oxigênio */}
          <div className="mt-4 mx-auto max-w-md">
            <div className="bg-black/30 backdrop-blur rounded-full h-6 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  oxygenLevel > 30 ? 'bg-blue-400' : 'bg-red-500 animate-pulse'
                }`}
                style={{ width: `${oxygenLevel}%` }}
              />
            </div>
            <p className="text-center text-white text-sm mt-1">
              Oxigênio: {Math.round(oxygenLevel)}%
            </p>
          </div>
        </div>

        {/* Peixes Salvos (Contador) */}
        {fishCollection.length > 0 && (
          <div className="absolute top-24 left-4 z-10">
            <div className="bg-cyan-500/80 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
              <span>🐠</span>
              <span>Salvos: {fishCollection.length}</span>
            </div>
          </div>
        )}

        {/* ✅ ÁREA DO JOGO - SEM ERROS DE PREVENTDEFAULT */}
        <div
          ref={ref}
          className="absolute inset-0 cursor-crosshair"
          onMouseDown={handleSafeInteraction}
          onTouchStart={handleSafeInteraction}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          {/* Renderização das Bolhas */}
          {bubbles.map(bubble => (
            <div
              key={bubble.id}
              className="absolute transition-opacity duration-300"
              style={{
                left: `${bubble.x}px`,
                top: `${bubble.y}px`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                opacity: bubble.opacity,
                pointerEvents: 'none',
                transform: 'translate3d(0,0,0)',
              }}
            >
              <div
                className={`w-full h-full rounded-full flex flex-col items-center justify-center ${
                  bubble.type === 'mine' ? 'animate-pulse' : ''
                }`}
                style={{
                  backgroundColor: bubble.color,
                  boxShadow: bubble.type === 'mine'
                    ? '0 0 20px rgba(255, 0, 0, 0.6), inset 0 0 10px rgba(0,0,0,0.3)'
                    : bubble.type === 'pearl'
                    ? '0 0 15px rgba(255, 255, 255, 0.7), inset 0 0 10px rgba(255,255,255,0.3)'
                    : bubble.type === 'treasure'
                    ? '0 0 15px rgba(255, 215, 0, 0.6), inset 0 0 10px rgba(255,215,0,0.3)'
                    : '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255,255,255,0.2)',
                  border: bubble.type === 'pearl'
                    ? '2px solid rgba(255, 255, 255, 0.7)'
                    : bubble.type === 'treasure'
                    ? '2px solid rgba(255, 215, 0, 0.5)'
                    : 'none',
                  backgroundImage: bubble.type === 'oxygen'
                    ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent)'
                    : 'none',
                }}
              >
                {/* Ícones dos animais e bolhas especiais */}
                <span className="text-lg select-none leading-none" style={{ userSelect: 'none' }}>
                  {bubble.type === 'mine' && '💣'}
                  {bubble.type === 'treasure' && '💰'}
                  {bubble.type === 'pearl' && '🦪'}
                  {bubble.type === 'oxygen' && '💙'}
                  {bubble.type === 'pufferfish' && '🐡'}
                  {bubble.type === 'starfish' && '⭐'}
                  {bubble.type === 'octopus' && '🐙'}
                  {bubble.type === 'whale' && '🐋'}
                  {bubble.type === 'shark' && '🦈'}
                  {bubble.type === 'turtle' && '🐢'}
                  {bubble.type === 'dolphin' && '🐬'}
                  {bubble.type === 'air' && '🫧'}
                  {bubble.type === 'pink' && '🔮'}
                  {bubble.type === 'purple' && '💜'}
                  {bubble.type === 'yellow' && '💛'}
                  {bubble.type === 'green' && '💚'}
                  {bubble.type === 'orange' && '🧡'}
                </span>
                
                {/* Pontos das bolhas */}
                <span className={`text-xs font-bold ${bubble.points < 0 ? 'text-red-200' : 'text-white'} drop-shadow-md leading-none mt-1 select-none`} style={{ userSelect: 'none' }}>
                  {bubble.points > 0 ? '+' : ''}{bubble.points}
                </span>
              </div>
            </div>
          ))}

          {/* Renderização das Partículas */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: '8px',
                height: '8px',
                backgroundColor: particle.color,
                opacity: particle.life,
                pointerEvents: 'none',
                transform: 'translate3d(0,0,0)',
                boxShadow: '0 0 4px rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      </div>
    );
  }
);

GameScreen.displayName = 'GameScreen';
