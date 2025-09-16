// app/bubble-pop/components/GameScreen.tsx
'use client';

import React from 'react';
import { ChevronLeft, VolumeX, Volume2 } from 'lucide-react';
import { Bubble, Particle, Equipment, ScoreEffect, FishEffect } from '@/app/types/bubble-pop';
import styles from '../bubble-pop.module.css';

// ... (Interface GameScreenProps permanece a mesma)

export const GameScreen = React.forwardRef<HTMLDivElement, GameScreenProps>((props, ref) => {
    // ... (Desestruturação das props permanece a mesma)
    const {
        score, combo, oxygenLevel, bubbles, particles,
        scoreEffects, fishEffects, // Pegando a prop fishEffects
        currentLevel,
        // ... resto das props
    } = props;
    
    // ... (código do cabeçalho e status permanece o mesmo)
    
    return (
        // ...
        <div ref={ref} className={`...`} style={{...}} onMouseDown={handleInteraction} onTouchStart={handleInteraction}>
            {/* Renderização das Bolhas */}
            {bubbles.map(bubble => (
                <div key={bubble.id} /* ... */ >
                    {/* Lógica de ícones DENTRO da bolha */}
                    {bubble.type === 'mine' && <div className="absolute inset-0 flex items-center justify-center text-xl">💣</div>}
                    {/* ========================================================== */}
                    {/* USA O EMOJI DO PEIXE SORTEADO */}
                    {/* ========================================================== */}
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

            {/* ... (renderização de partículas e scoreEffects permanece a mesma) ... */}

            {/* Efeito de peixe salvo */}
            {fishEffects.map((effect) => (
                <div
                    key={effect.id}
                    className={styles.fishEffect}
                    style={{
                        left: effect.x,
                        top: effect.y,
                        opacity: effect.opacity,
                    }}
                >
                    {/* ========================================================== */}
                    {/* USA O EMOJI DO PEIXE SALVO */}
                    {/* ========================================================== */}
                    {effect.emoji}
                </div>
            ))}
        </div>
        // ...
    );
});

GameScreen.displayName = 'GameScreen';
