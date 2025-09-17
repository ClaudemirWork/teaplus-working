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

        {/* ÁREA DO JOGO - CONFIGURAÇÃO CRÍTICA DOS EVENTOS */}
        <div
          ref={ref}
          className="absolute inset-0 touch-none select-none" // Importante: touch-none e select-none
          onClick={handleInteraction}
          onTouchStart={handleInteraction}
          onTouchEnd={(e) => e.preventDefault()} // Previne comportamentos padrão
          onTouchMove={(e) => e.preventDefault()} // Previne scroll durante o jogo
          onContextMenu={(e) => e.preventDefault()} // Previne menu de contexto
          style={{
            WebkitTouchCallout: 'none', // Desabilita callout no iOS
            WebkitUserSelect: 'none', // Desabilita seleção no WebKit
            MozUserSelect: 'none', // Desabilita seleção no Firefox
            msUserSelect: 'none', // Desabilita seleção no IE/Edge
            userSelect: 'none', // Desabilita seleção de texto
            touchAction: 'none', // Desabilita ações de toque padrão
            cursor: 'crosshair', // Cursor de mira para indicar área interativa
            WebkitTapHighlightColor: 'transparent', // Remove highlight no tap (mobile)
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
                pointerEvents: 'none', // Crítico: evita interferência com detecção
                transform: 'translate3d(0,0,0)', // Hardware acceleration
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
                
                {/* Pontos das bolhas - PRINCIPAL CORREÇÃO */}
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
                transform: 'translate3d(0,0,0)', // Hardware acceleration
                boxShadow: '0 0 4px rgba(255,255,255,0.5)',
              }}
            />
          ))}

          {/* Indicador de Clique/Toque (Debug - remover em produção) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute bottom-4 left-4 text-white text-xs bg-black/50 p-2 rounded">
              Debug: Clique/Toque para estourar bolhas
            </div>
          )}
        </div>
      </div>
    );
  }
);

GameScreen.displayName = 'GameScreen';
