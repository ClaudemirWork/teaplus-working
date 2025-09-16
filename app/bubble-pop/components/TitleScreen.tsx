// app/bubble-pop/components/TitleScreen.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Trophy, Volume2, VolumeX, Play } from 'lucide-react';
import { GameAudioManager } from '@/utils/gameAudioManager'; // Ajuste o caminho

interface TitleScreenProps {
    onStart: () => void;
    toggleAudio: () => void;
    audioEnabled: boolean;
    totalStarsCollected: number;
    bestScore: number;
}

export const TitleScreen = React.memo(({ onStart, toggleAudio, audioEnabled, totalStarsCollected, bestScore }: TitleScreenProps) => {
    const [introSpeechComplete, setIntroSpeechComplete] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);

    const handleStartIntroSpeech = () => {
        setUserInteracted(true);
        const audioManager = GameAudioManager.getInstance();
        audioManager.pararTodos();
        audioManager.falarMila("Olá! Eu sou a Mila! Vamos estourar bolhas e salvar o mundo marinho!", () => {
            setTimeout(() => {
                audioManager.falarMila("Será uma aventura incrível no fundo do oceano!", () => {
                    setIntroSpeechComplete(true);
                });
            }, 1500);
        });
    };

    return (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-cyan-300 via-blue-400 to-blue-600 overflow-hidden">
            {/* ... (JSX da tela de título) ... */}
        </div>
    );
});
