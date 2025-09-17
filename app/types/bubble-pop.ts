'use client';
import { useRef } from 'react';
import { useBubblePopGame } from '@/hooks/useBubblePopGame';

export default function BubblePopGame() {
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const {
        isPlaying,
        score,
        combo,
        oxygenLevel,
        bubbles,
        particles,
        currentLevel,
        showResults,
        salvando,
        poppedBubbles,
        bubblesRemaining,
        accuracy,
        maxCombo,
        showLevelTransition,
        levelMessage,
        levelConfigs,
        completedLevels,
        startActivity,
        handleInteraction,
        handleSaveSession,
        voltarInicio,
        toggleAudio,
        audioEnabled,
        jogoIniciado,
    } = useBubblePopGame(gameAreaRef);

    // Se o jogo não foi iniciado, mostra tela inicial
    if (!jogoIniciado) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-cyan-300 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white p-8">
                    <h1 className="text-4xl font-bold mb-4">🫧 Oceano de Bolhas 🫧</h1>
                    <p className="text-lg mb-6">Estoure as bolhas e mergulhe cada vez mais fundo!</p>
                    <button
                        onClick={startActivity}
                        className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-xl font-semibold transition-colors"
                    >
                        Iniciar Jogo
                    </button>
                </div>
            </div>
        );
    }

    // Se os resultados estão sendo mostrados
    if (showResults) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-900 flex items-center justify-center">
                <div className="bg-white/90 rounded-lg p-8 max-w-md mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">🎯 Fim de Jogo!</h2>
                    <div className="space-y-2 mb-6">
                        <p className="text-xl">Pontuação Final: <strong>{score}</strong></p>
                        <p>Bolhas Estouradas: {poppedBubbles}</p>
                        <p>Combo Máximo: {maxCombo}</p>
                        <p>Precisão: {accuracy}%</p>
                        <p>Níveis Completados: {completedLevels.length}/5</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={voltarInicio}
                            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            Menu Inicial
                        </button>
                        <button
                            onClick={handleSaveSession}
                            disabled={salvando}
                            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            {salvando ? 'Salvando...' : 'Salvar e Sair'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Tela de transição de nível
    if (showLevelTransition) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-800 flex items-center justify-center">
                <div className="text-center text-white animate-pulse">
                    <h2 className="text-4xl font-bold mb-4">{levelMessage}</h2>
                    <p className="text-2xl">Preparando próximo nível...</p>
                </div>
            </div>
        );
    }

    // Área principal do jogo
    const config = levelConfigs[currentLevel - 1];

    return (
        <div className={`min-h-screen bg-gradient-to-b ${config.bgGradient} relative overflow-hidden`}>
            {/* HUD - Interface do Jogo */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4">
                <div className="flex justify-between items-start text-white">
                    <div className="bg-black/30 rounded-lg p-3">
                        <p className="text-lg font-bold">Pontos: {score}</p>
                        <p className="text-sm">Combo: x{combo}</p>
                    </div>
                    
                    <div className="bg-black/30 rounded-lg p-3 text-center">
                        <p className="text-sm">{config.name}</p>
                        <p className="text-xs">Bolhas: {bubblesRemaining}</p>
                    </div>
                    
                    <button
                        onClick={toggleAudio}
                        className="bg-black/30 rounded-lg p-3"
                    >
                        {audioEnabled ? '🔊' : '🔇'}
                    </button>
                </div>
                
                {/* Barra de Oxigênio */}
                <div className="mt-4 mx-auto max-w-md">
                    <div className="bg-black/30 rounded-full h-6 overflow-hidden">
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

            {/* ÁREA DO JOGO - CONFIGURAÇÃO CORRETA DOS EVENTOS */}
            <div
                ref={gameAreaRef}
                className="absolute inset-0 touch-none" // IMPORTANTE: touch-none previne comportamentos indesejados
                onClick={handleInteraction}
                onTouchStart={handleInteraction}
                onTouchEnd={(e) => e.preventDefault()} // Previne comportamentos padrão do touch
                onTouchMove={(e) => e.preventDefault()} // Previne scroll acidental durante o jogo
                style={{
                    WebkitTouchCallout: 'none',  // Desabilita callout no iOS
                    WebkitUserSelect: 'none',    // Desabilita seleção de texto
                    userSelect: 'none',           // Desabilita seleção de texto
                    touchAction: 'none',          // Desabilita ações de toque padrão
                    cursor: isPlaying ? 'crosshair' : 'default' // Muda cursor para indicar área clicável
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
                            pointerEvents: 'none', // Importante: evita interferência com detecção de clique
                        }}
                    >
                        <div
                            className={`w-full h-full rounded-full ${
                                bubble.type === 'mine' ? 'animate-pulse' : ''
                            }`}
                            style={{
                                backgroundColor: bubble.color,
                                boxShadow: bubble.type === 'mine' 
                                    ? '0 0 20px rgba(255, 0, 0, 0.5)' 
                                    : '0 4px 6px rgba(0, 0, 0, 0.1)',
                                border: bubble.type === 'pearl' 
                                    ? '2px solid rgba(255, 255, 255, 0.7)' 
                                    : 'none'
                            }}
                        >
                            {/* Ícone especial para alguns tipos */}
                            {bubble.type === 'mine' && (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                    💣
                                </div>
                            )}
                            {bubble.type === 'treasure' && (
                                <div className="w-full h-full flex items-center justify-center">
                                    💰
                                </div>
                            )}
                            {bubble.type === 'pearl' && (
                                <div className="w-full h-full flex items-center justify-center">
                                    🦪
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Renderização das Partículas */}
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            left: `${particle.x}px`,
                            top: `${particle.y}px`,
                            backgroundColor: particle.color,
                            opacity: particle.life,
                            pointerEvents: 'none',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
