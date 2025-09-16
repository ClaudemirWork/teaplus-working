// app/bubble-pop/components/GameScreen.tsx
'use client';

import React from 'react';
import { ChevronLeft, Save, Volume2, VolumeX } from 'lucide-react';
import { Bubble, Particle, Equipment } from '@/app/types/bubble-pop'; // Ajuste
import styles from '../bubble-pop.module.css';

// ... (Definição de props) ...

export const GameScreen = React.forwardRef<HTMLDivElement, GameScreenProps>((props, ref) => {
    // ... (JSX da tela de jogo) ...
});

GameScreen.displayName = 'GameScreen';
