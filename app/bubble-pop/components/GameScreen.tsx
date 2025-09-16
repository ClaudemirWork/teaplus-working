// app/bubble-pop/components/GameScreen.tsx
'use client';
import React, { forwardRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';

// Componente do Header
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }: any) => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
                <Link href="/dashboard" className="flex items-center text-teal-600 hover:text-teal-700 transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                    <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                </Link>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </h1>
                {showSaveButton && onSave ? (
                    <button
                        onClick={onSave}
                        disabled={isSaveDisabled}
                        className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${
                            !isSaveDisabled
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <Save size={18} />
                        <span className="hidden sm:inline">{isSaveDisabled ? 'Salvando...' : 'Salvar'}</span>
                    </button>
                ) : (
                    <div className="w-24"></div>
                )}
            </div>
        </div>
    </header>
);

export const GameScreen = forwardRef<HTMLDivElement, any>((props, ref) => {
    const {
        isPlaying, score, combo, oxygenLevel, bubbles, particles, currentLevel,
        showResults, salvando, poppedBubbles, bubblesRemaining, showLevelTransition,
        levelMessage, levelConfigs, completedLevels, handleInteraction,
        handleSaveSession, voltarInicio, jogoIniciado, startActivity,
        namingFish, nameFish, unlockedGear, activeGearItems
    } = props;

    const [fishName, setFishName] = React.useState('');
    const currentLevelConfig = levelConfigs[currentLevel - 1];

    if (!jogoIniciado) {
        return (
            <div className="min-h-screen bg-gray-50">
                <GameHeader title="Oceano de Bolhas" icon="🌊" />
                <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
                            <div className="text-center mb-6">
                                <img
                                    src="https://raw.githubusercontent.com/ClaudemirWork/teaplus-working/main/public/images/mila_boas_vindas_resultado.webp"
                                    alt="Mila"
                                    className="w-32 h-32 mx-auto rounded-full border-4 border-blue-400 shadow-lg"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                                <h2 className="text-2xl font-bold text-blue-800 mt-4">
                                    Mila convida você para uma aventura submarina!
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                                    <p className="text-sm text-gray-600">
                                        Colete bolhas coloridas e peixes especiais!
                                    </p>
                                </div>
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 sm:p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">🫧 Pontuação:</h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>🐡 Baiacu = 75 pts</li>
                                        <li>⭐ Estrela = 80 pts</li>
                                        <li>🐙 Polvo = 90 pts</li>
                                        <li>💎 Pérola = 100 pts!</li>
                                    </ul>
                                </div>
                                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">🤿 Equipamentos:</h3>
                                    <p className="text-sm text-gray-600">
                                        Colete equipamentos de mergulho em cada nível!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={startActivity}
                                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                                🤿 Mergulhar no Oceano
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (showResults) {
        return null; // ResultsScreen será renderizada pelo page.tsx
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader
                title="Oceano de Bolhas"
                icon="🌊"
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={false}
            />

            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                <div className="space-y-4">
                    {/* Nome da Fase */}
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-blue-700">
                            {currentLevelConfig.name}
                        </h2>
                    </div>

                    {/* Status */}
                    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
                        <div className="grid grid-cols-5 gap-2">
                            <div className="text-center">
                                <div className="text-xl font-bold text-indigo-800">
                                    {currentLevelConfig.depth}
                                </div>
                                <div className="text-xs text-indigo-600">Profundidade</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-blue-800">{score}</div>
                                <div className="text-xs text-blue-600">Pontos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-orange-800">x{combo}</div>
                                <div className="text-xs text-orange-600">Combo</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-green-800">{poppedBubbles}</div>
                                <div className="text-xs text-green-600">Coletadas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-purple-800">{bubblesRemaining}</div>
                                <div className="text-xs text-purple-600">Restantes</div>
                            </div>
                        </div>
                    </div>

                    {/* Equipamentos desbloqueados */}
                    {unlockedGear.length > 0 && (
                        <div className="bg-white rounded-lg p-2 flex items-center justify-center gap-2">
                            <span className="text-sm font-bold">Equipamentos:</span>
                            {unlockedGear.map((gear, idx) => (
                                <span key={idx} className="text-xl" title={gear.item}>
                                    {gear.icon}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Barra de Oxigênio */}
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
                        </div>
                    </div>

                    {/* Área do jogo */}
                    <div
                        ref={ref}
                        className={`relative bg-gradient-to-b ${currentLevelConfig.bgGradient} rounded-xl shadow-lg overflow-hidden cursor-crosshair`}
                        style={{ height: '500px' }}
                        onMouseDown={handleInteraction}
                        onTouchStart={handleInteraction}
                    >
                        {/* Transição de nível */}
                        {showLevelTransition && (
                            <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-30">
                                <div className="text-center animate-bounce">
                                    <div className="text-6xl mb-2">🌊</div>
                                    <div className="text-3xl font-bold text-blue-600">
                                        {levelMessage}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal de nomear peixe/pérola */}
                        {namingFish && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
                                <div className="bg-white rounded-xl p-6 max-w-sm">
                                    <h3 className="text-lg font-bold mb-4">
                                        Dê um nome para sua {namingFish.type === 'pearl' ? 'pérola' : 'descoberta'}!
                                    </h3>
                                    <input
                                        type="text"
                                        value={fishName}
                                        onChange={(e) => setFishName(e.target.value)}
                                        className="w-full p-2 border rounded mb-4"
                                        placeholder="Digite um nome..."
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => {
                                            if (fishName.trim()) {
                                                nameFish(namingFish.id, fishName);
                                                setFishName('');
                                            }
                                        }}
                                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                                    >
                                        Confirmar Nome
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Itens de mergulho ativos */}
                        {activeGearItems.map((gear, index) => (
                            <div
                                key={index}
                                className="absolute cursor-pointer animate-bounce"
                                style={{
                                    left: `${gear.x}px`,
                                    top: `${gear.y}px`,
                                    fontSize: '2.5rem',
                                    filter: 'drop-shadow(0 0 8px rgba(255,255,0,0.8))'
                                }}
                            >
                                {gear.icon}
                            </div>
                        ))}

                        {/* Renderizar bolhas e partículas */}
                        {bubbles.map(bubble => (
                            <div
                                key={bubble.id}
                                className={`absolute rounded-full transition-opacity ${
                                    bubble.popped ? 'pointer-events-none' : 'cursor-pointer'
                                }`}
                                style={{
                                    left: `${bubble.x}px`,
                                    top: `${bubble.y}px`,
                                    width: `${bubble.size}px`,
                                    height: `${bubble.size}px`,
                                    background: bubble.color,
                                    opacity: bubble.opacity,
                                    transform: `scale(${bubble.popped ? 1.5 : 1})`,
                                }}
                            />
                        ))}

                        {particles.map(particle => (
                            <div
                                key={particle.id}
                                className="absolute rounded-full pointer-events-none"
                                style={{
                                    left: `${particle.x}px`,
                                    top: `${particle.y}px`,
                                    width: '6px',
                                    height: '6px',
                                    background: particle.color,
                                    opacity: particle.life
                                }}
                            />
                        ))}
                    </div>

                    {/* Indicador de níveis */}
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                            <div
                                key={level}
                                className={`w-16 h-10 rounded-lg flex flex-col items-center justify-center text-xs font-bold
                                    ${completedLevels.includes(level) ? 'bg-blue-500 text-white' :
                                    level === currentLevel ? 'bg-cyan-400 text-black animate-pulse' :
                                    'bg-gray-300 text-gray-600'}`}
                            >
                                <div>{levelConfigs[level - 1].depth}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
});

GameScreen.displayName = 'GameScreen';
