// app/bubble-pop/components/GameScreen.tsx
// ... (imports existentes)

export function GameScreen() {
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const {
        isPlaying, score, combo, oxygenLevel, bubbles, particles, currentLevel,
        showResults, salvando, poppedBubbles, bubblesRemaining, accuracy, maxCombo,
        showLevelTransition, levelMessage, levelConfigs, completedLevels,
        startActivity, handleInteraction, handleSaveSession, voltarInicio,
        toggleAudio, audioEnabled, jogoIniciado,
        fishCollection, namingFish, nameFish, unlockedGear, activeGearItems, collectGear
    } = useBubblePopGame(gameAreaRef);

    // ... (restante do código existente)

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader
                title="Oceano de Bolhas"
                icon="🌊"
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={showResults}
            />

            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {!jogoIniciado ? (
                    // Tela inicial (sem alterações)
                ) : !showResults ? (
                    <div className="space-y-4">
                        {/* Status (sem alterações) */}

                        {/* Barra de Oxigênio (sem alterações) */}

                        {/* Área do jogo */}
                        <div
                            ref={gameAreaRef}
                            className={`relative bg-gradient-to-b ${levelConfigs[currentLevel - 1].bgGradient} rounded-xl shadow-lg overflow-hidden cursor-crosshair`}
                            style={{ height: '500px' }}
                            onMouseDown={handleInteraction}
                            onTouchStart={handleInteraction}
                        >
                            {/* ... (elementos existentes) */}

                            {/* Itens de mergulho ativos */}
                            {activeGearItems.map((gear, index) => (
                                <div
                                    key={index}
                                    className="absolute cursor-pointer animate-bounce"
                                    style={{
                                        left: `${gear.x}px`,
                                        top: `${gear.y}px`,
                                        fontSize: '2.5rem',
                                        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        collectGear(gear.level);
                                    }}
                                >
                                    {gear.icon}
                                </div>
                            ))}

                            {/* Bolhas */}
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
                                        background: bubble.type === 'mine'
                                            ? 'radial-gradient(circle, #8B0000, #4B0000)'
                                            : bubble.type === 'treasure'
                                            ? 'radial-gradient(circle, #FFD700, #FFA500)'
                                            : bubble.type === 'pearl'
                                            ? 'radial-gradient(circle, #FFF0F5, #FFB6C1)'
                                            : bubble.type === 'pufferfish'
                                            ? 'radial-gradient(circle, #FF6B6B, #FF4444)'
                                            : bubble.type === 'starfish'
                                            ? 'radial-gradient(circle, #FFD93D, #FFB000)'
                                            : bubble.type === 'octopus'
                                            ? 'radial-gradient(circle, #6BCF7F, #4CAF50)'
                                            : bubble.color,
                                        border: bubble.type === 'pearl' ? '2px solid #FFD700' :
                                            bubble.type === 'treasure' ? '2px solid #FFA500' :
                                            bubble.type === 'mine' ? '2px solid #FF0000' :
                                            bubble.type === 'pufferfish' ? '2px solid #FF4444' :
                                            bubble.type === 'starfish' ? '2px solid #FFB000' :
                                            bubble.type === 'octopus' ? '2px solid #4CAF50' :
                                            '1px solid rgba(255,255,255,0.3)',
                                        opacity: bubble.opacity,
                                        boxShadow: bubble.type === 'pearl' ? '0 0 20px #FFF0F5' :
                                            bubble.type === 'treasure' ? '0 0 15px #FFD700' :
                                            bubble.type === 'pufferfish' ? '0 0 15px #FF6B6B' :
                                            bubble.type === 'starfish' ? '0 0 15px #FFD93D' :
                                            bubble.type === 'octopus' ? '0 0 15px #6BCF7F' :
                                            '0 2px 8px rgba(0,0,0,0.2)',
                                        transform: `scale(${bubble.popped ? 1.5 : 1})`,
                                    }}
                                >
                                    {/* Ícones nas bolhas especiais */}
                                    {bubble.type === 'mine' && (
                                        <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                                            💣
                                        </div>
                                    )}
                                    {bubble.type === 'pearl' && (
                                        <div className="absolute inset-0 flex items-center justify-center text-xl">
                                            🦪
                                        </div>
                                    )}
                                    {bubble.type === 'treasure' && (
                                        <div className="absolute inset-0 flex items-center justify-center text-xl">
                                            💰
                                        </div>
                                    )}
                                    {bubble.type === 'pufferfish' && (
                                        <div className="absolute inset-0 flex items-center justify-center text-xl">
                                            🐡
                                        </div>
                                    )}
                                    {bubble.type === 'starfish' && (
                                        <div className="absolute inset-0 flex items-center justify-center text-xl">
                                            ⭐
                                        </div>
                                    )}
                                    {bubble.type === 'octopus' && (
                                        <div className="absolute inset-0 flex items-center justify-center text-xl">
                                            🐙
                                        </div>
                                    )}
                                    {/* Mostrar pontos nas bolhas coloridas */}
                                    {!['mine', 'pearl', 'treasure', 'pufferfish', 'starfish', 'octopus'].includes(bubble.type) && (
                                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                                            +{bubble.points}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* ... (partículas e outros elementos existentes) */}
                        </div>

                        {/* Indicador de profundidade (sem alterações) */}
                    </div>
                ) : (
                    // Tela de resultados (sem alterações)
                )}
            </main>
        </div>
    );
}
