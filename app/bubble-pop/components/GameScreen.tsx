'use client';

import React, { forwardRef } from 'react';
import { Volume2, VolumeX, ChevronLeft } from 'lucide-react';
import { Bubble, Particle, Equipment, LevelConfig } from '@/app/types/bubble-pop';

interface GameScreenProps {
  isPlaying: boolean;
  score: number;
  combo: number;
  oxygenLevel: number;
  bubbles: Bubble[];
  particles: Particle[];
  currentLevel: number;
  bubblesRemaining: number;
  levelConfigs: LevelConfig[];
  handleInteraction: (e: React.MouseEvent | React.TouchEvent) => void;
  audioEnabled: boolean;
  toggleAudio: () => void;
  showLevelTransition: boolean;
  levelMessage: string;
  fishCollection: Array<{id: number, name: string, type: string}>;
  
  // NOVOS PROPS
  equipment: Equipment;
  savedFish: number;
  multiplier: number;
  multiplierTime: number;
  magnetActive: boolean;
  magnetTime: number;
  showBossLevel: boolean;
  bossDefeated: boolean;
  freedCreatures: string[];
  bubblesSpawned: number;
  levelCompleted: boolean;
}

export const GameScreen = forwardRef<HTMLDivElement, GameScreenProps>(({
  isPlaying,
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
  fishCollection,
  equipment,
  savedFish,
  multiplier,
  multiplierTime,
  magnetActive,
  magnetTime,
  showBossLevel,
  bossDefeated,
  freedCreatures,
  bubblesSpawned,
  levelCompleted
}, ref) => {
  const config = levelConfigs[currentLevel - 1];
  const progressPercentage = config ? ((bubblesSpawned / config.totalBubbles) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button className="flex items-center text-teal-600 hover:text-teal-700 transition-colors">
              <ChevronLeft className="h-6 w-6" />
              <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
            </button>

            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
              🌊 <span>Oceano de Bolhas</span>
            </h1>

            <button
              onClick={toggleAudio}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {audioEnabled ? 
                <Volume2 className="w-5 h-5" /> : 
                <VolumeX className="w-5 h-5" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-4">
          
          {/* STATUS EXPANDIDO - 6 INFORMAÇÕES */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <div className="grid grid-cols-6 gap-2">
              <div className="text-center">
                <div className="text-base sm:text-xl font-bold text-indigo-800">
                  Nv.{currentLevel}
                </div>
                <div className="text-xs text-indigo-600">Nível</div>
              </div>
              
              <div className="text-center">
                <div className="text-base sm:text-xl font-bold text-blue-800">
                  {score}
                </div>
                <div className="text-xs text-blue-600">Pontos</div>
              </div>
              
              <div className="text-center">
                <div className="text-base sm:text-xl font-bold text-orange-800">
                  x{combo}
                </div>
                <div className="text-xs text-orange-600">Combo</div>
              </div>
              
              <div className="text-center">
                <div className="text-base sm:text-xl font-bold text-green-800">
                  {savedFish}
                </div>
                <div className="text-xs text-green-600">🐠 Salvos</div>
              </div>
              
              <div className="text-center">
                <div className="text-base sm:text-xl font-bold text-purple-800">
                  {bubblesRemaining}
                </div>
                <div className="text-xs text-purple-600">Restantes</div>
              </div>
              
              <div className="text-center">
                <div className={`text-base sm:text-xl font-bold ${
                  multiplier > 1 ? 'text-yellow-500 animate-pulse' : 'text-gray-800'
                }`}>
                  x{multiplier}
                </div>
                <div className="text-xs text-gray-600">Multi</div>
              </div>
            </div>
          </div>

          {/* EQUIPAMENTOS MELHORADOS */}
          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <span className={`text-2xl ${equipment.mask ? '' : 'opacity-30'}`}>🥽</span>
                <span className="text-xs text-gray-600">Máscara</span>
                {equipment.mask && <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>}
              </div>
              
              <div className="flex flex-col items-center">
                <span className={`text-2xl ${equipment.fins ? '' : 'opacity-30'}`}>🦶</span>
                <span className="text-xs text-gray-600">Nadadeiras</span>
                {equipment.fins && <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>}
              </div>
              
              <div className="flex flex-col items-center">
                <span className={`text-2xl ${equipment.tank ? '' : 'opacity-30'}`}>🤿</span>
                <span className="text-xs text-gray-600">Tanque</span>
                {equipment.tank && <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>}
              </div>
              
              <div className="flex flex-col items-center">
                <span className={`text-2xl ${equipment.suit ? '' : 'opacity-30'}`}>👔</span>
                <span className="text-xs text-gray-600">Proteção</span>
                {equipment.suit && <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>}
              </div>
              
              <div className="flex flex-col items-center">
                <span className={`text-2xl ${equipment.light ? '' : 'opacity-30'}`}>🔦</span>
                <span className="text-xs text-gray-600">Lanterna</span>
                {equipment.light && <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>}
              </div>
            </div>
          </div>

          {/* BARRA DE PROGRESSO MELHORADA */}
          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">
                {config?.name} ({config?.depth})
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  progressPercentage >= 75 ? 'bg-green-500' :
                  progressPercentage >= 50 ? 'bg-yellow-500' :
                  progressPercentage >= 25 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              >
                {/* Marcadores de checkpoint */}
                <div className="relative h-full">
                  {[25, 50, 75].map(checkpoint => (
                    <div 
                      key={checkpoint}
                      className="absolute top-0 w-0.5 h-full bg-white opacity-50"
                      style={{ left: `${checkpoint}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BARRA DE OXIGÊNIO (não aparece no boss) */}
          {currentLevel !== 11 && (
            <div className="bg-white rounded-lg shadow p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">💨 Oxigênio:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      oxygenLevel > 60 ? 'bg-blue-500' :
                      oxygenLevel > 30 ? 'bg-yellow-500' :
                      'bg-red-500 animate-pulse'
                    }`}
                    style={{ width: `${oxygenLevel}%` }}
                  />
                </div>
                <span className="text-sm font-bold">{Math.round(oxygenLevel)}%</span>
                {equipment.tank && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Economia 50%
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ÁREA DO JOGO */}
          <div
            ref={ref}
            className={`relative bg-gradient-to-b ${config?.bgGradient || 'from-cyan-200 to-blue-400'} rounded-xl shadow-lg overflow-hidden cursor-crosshair`}
            style={{ height: '500px' }}
            onMouseDown={handleInteraction}
            onTouchStart={handleInteraction}
          >
            {/* Mensagens de nível */}
            {levelMessage && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-white/90 text-black px-6 py-3 rounded-full font-bold animate-bounce">
                  {levelMessage}
                </div>
              </div>
            )}

            {/* Transição de nível */}
            {showLevelTransition && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-blue/95 flex items-center justify-center z-30">
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl mb-2 animate-bounce">
                    {currentLevel === 11 ? '👑' : '🌊'}
                  </div>
                  <div className="text-xl sm:text-3xl font-bold text-blue-600">
                    {levelMessage}
                  </div>
                </div>
              </div>
            )}

            {/* Criaturas sendo libertadas (boss victory) */}
            {freedCreatures.length > 0 && (
              <div className="absolute inset-0 flex flex-wrap items-center justify-center z-25">
                {freedCreatures.map((creature, i) => (
                  <div
                    key={i}
                    className="text-4xl animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {creature}
                  </div>
                ))}
              </div>
            )}

            {/* BOLHAS */}
            {bubbles.map(bubble => (
              <div
                key={bubble.id}
                className={`absolute rounded-full transition-opacity ${
                  bubble.popped ? 'pointer-events-none' : 'cursor-pointer'
                } hover:scale-110 transition-transform`}
                style={{
                  left: `${bubble.x}px`,
                  top: `${bubble.y}px`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  background: bubble.type === 'mine'
                    ? 'radial-gradient(circle, #8B0000, #4B0000)'
                    : bubble.type === 'fish'
                    ? 'radial-gradient(circle, #87CEEB, #4682B4)'
                    : bubble.type === 'equipment'
                    ? 'radial-gradient(circle, #FFD700, #FFA500)'
                    : bubble.type === 'double'
                    ? 'radial-gradient(circle, #FFD700, #FF8C00)'
                    : bubble.type === 'triple'
                    ? 'radial-gradient(circle, #FF69B4, #FF1493)'
                    : bubble.type === 'shockwave'
                    ? 'radial-gradient(circle, #00FFFF, #0000FF)'
                    : bubble.type === 'magnet'
                    ? 'radial-gradient(circle, #9370DB, #4B0082)'
                    : bubble.color,
                  border: bubble.type === 'equipment' ? '3px solid #FFD700' :
                          bubble.type === 'mine' ? '2px solid #FF0000' :
                          bubble.type === 'fish' ? '2px solid #00CED1' :
                          '1px solid rgba(255,255,255,0.3)',
                  opacity: bubble.opacity,
                  boxShadow: bubble.type === 'equipment' ? '0 0 20px #FFD700' :
                            bubble.type === 'double' || bubble.type === 'triple' ? '0 0 15px #FFD700' :
                            '0 2px 8px rgba(0,0,0,0.2)',
                  transform: `scale(${bubble.popped ? 1.5 : 1})`,
                }}
              >
                {/* Ícones especiais das bolhas */}
                {bubble.type === 'mine' && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                    💣
                  </div>
                )}
                {bubble.type === 'fish' && (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    {bubble.fishType}
                  </div>
                )}
                {bubble.type === 'equipment' && (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">
                    {bubble.equipmentType === 'mask' && '🥽'}
                    {bubble.equipmentType === 'fins' && '🦶'}
                    {bubble.equipmentType === 'tank' && '🤿'}
                    {bubble.equipmentType === 'suit' && '👔'}
                    {bubble.equipmentType === 'light' && '🔦'}
                  </div>
                )}
                {bubble.type === 'double' && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                    x2
                  </div>
                )}
                {bubble.type === 'triple' && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                    x3
                  </div>
                )}
                {bubble.type === 'shockwave' && (
                  <div className="absolute inset-0 flex items-center justify-center text-xl">
                    💥
                  </div>
                )}
                {bubble.type === 'magnet' && (
                  <div className="absolute inset-0 flex items-center justify-center text-xl">
                    🧲
                  </div>
                )}
                {['air', 'oxygen', 'pink', 'purple', 'yellow', 'green', 'orange'].includes(bubble.type) && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                    +{bubble.points}
                  </div>
                )}
              </div>
            ))}

            {/* PARTÍCULAS */}
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${particle.x}px`,
                  top: `${particle.y}px`,
                  width: particle.type === 'star' ? '8px' : particle.type === 'fish' ? '20px' : '6px',
                  height: particle.type === 'star' ? '8px' : particle.type === 'fish' ? '20px' : '6px',
                  background: particle.color,
                  opacity: particle.life,
                  borderRadius: particle.type === 'star' ? '0' : '50%',
                  clipPath: particle.type === 'star' 
                    ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                    : 'none'
                }}
              >
                {particle.type === 'fish' && '🐠'}
              </div>
            ))}

            {/* INDICADORES DE POWER-UPS ATIVOS */}
            {multiplierTime > 0 && (
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold animate-pulse">
                  ⚡ x{multiplier} ({multiplierTime}s)
                </div>
              </div>
            )}

            {magnetActive && (
              <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
                <div className="bg-purple-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                  🧲 ÍMÃ ({magnetTime}s)
                </div>
              </div>
            )}

            {/* BOSS aparece no nível 11 */}
            {currentLevel === 11 && (
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                <div className="text-6xl animate-bounce">
                  👹
                </div>
                <div className="text-white font-bold text-center">
                  Senhor dos Mares
                </div>
              </div>
            )}
          </div>

          {/* INDICADOR DE PROGRESSO DOS NÍVEIS MELHORADO */}
          <div className="flex justify-center gap-1 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <div
                key={level}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                ${level < currentLevel ? 'bg-green-500 text-white' :
                  level === currentLevel ? 'bg-cyan-400 text-black animate-pulse' :
                  'bg-gray-300 text-gray-600'}`}
              >
                {level}
              </div>
            ))}
            
            {/* Nível Boss */}
            {showBossLevel && (
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                ${currentLevel === 11 ? 'bg-red-500 text-white animate-pulse' :
                  bossDefeated ? 'bg-gold-500 text-white' : 'bg-purple-500 text-white'}`}>
                👑
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
});

GameScreen.displayName = 'GameScreen';
