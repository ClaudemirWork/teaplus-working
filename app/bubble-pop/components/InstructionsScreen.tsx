// app/bubble-pop/components/InstructionsScreen.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { GameAudioManager } from '@/utils/gameAudioManager'; // Ajuste o caminho

interface InstructionsScreenProps {
    onPlay: () => void;
}

export const InstructionsScreen = React.memo(({ onPlay }: InstructionsScreenProps) => {
    const [speechComplete, setSpeechComplete] = useState(false);

    useEffect(() => {
        const audioManager = GameAudioManager.getInstance();
        audioManager.pararTodos();
        audioManager.falarMila("Vou te ensinar como jogar! Estoure as bolhas clicando nelas! Salve os peixes, evite as bombas e colete os equipamentos dourados!", () => {
            setSpeechComplete(true);
        });
    }, []);

    return (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-300 via-cyan-300 to-teal-300">
            {/* ... (JSX da tela de instruções) ... */}
        </div>
    );
});
