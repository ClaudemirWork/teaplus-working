// app/bubble-pop/components/InstructionsScreen.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { GameAudioManager } from '@/utils/gameAudioManager';

interface InstructionsScreenProps {
    onPlay: () => void;
}

export const InstructionsScreen = React.memo(({ onPlay }: InstructionsScreenProps) => {
    const [speechComplete, setSpeechComplete] = useState(false);
    const speechStartedRef = useRef(false);

    // Efeito para iniciar a fala automaticamente ao entrar na tela
    useEffect(() => {
        // Esta "bandeira" (ref) garante que a fala só seja iniciada uma única vez
        if (speechStartedRef.current) return;
        speechStartedRef.current = true;
        
        const audioManager = GameAudioManager.getInstance();
        audioManager.pararTodos();
        audioManager.falarMila("Vou te ensinar como jogar! Estoure as bolhas clicando nelas!", () => {
            setTimeout(() => {
                audioManager.falarMila("Salve os peixes, evite as bombas e colete os equipamentos dourados!", () => {
                    setSpeechComplete(true);
                });
            }, 1500);
        });
    }, []);

    return (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-300 via-cyan-300 to-teal-300">
            <div className="bg-white/95 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-blue-600">Como Jogar</h2>
                <div className="text-base sm:text-lg text-gray-700 space-y-4 sm:space-y-6 mb-6 text-left">
                    <p className="flex items-center gap-4"><span className="text-3xl sm:text-4xl">🫧</span><span><b>Estoure as bolhas</b> clicando nelas!</span></p>
                    <p className="flex items-center gap-4"><span className="text-3xl sm:text-4xl">🐠</span><span><b>Salve os peixes</b> presos em bolhas!</span></p>
                    <p className="flex items-center gap-4"><span className="text-3xl sm:text-4xl">💣</span><span><b>Evite as bombas</b> para não reiniciar!</span></p>
                    <p className="flex items-center gap-4"><span className="text-3xl sm:text-4xl">🤿</span><span><b>Colete os equipamentos</b> dourados!</span></p>
                    <p className="flex items-center gap-4"><span className="text-3xl sm:text-4xl">💨</span><span><b>Fique de olho no oxigênio!</b></span></p>
                </div>

                {!speechComplete && (
                    <div className="flex flex-col items-center justify-center h-24">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-blue-600 mt-4 font-medium">Mila está explicando...</p>
                    </div>
                )}

                {speechComplete && (
                    <button onClick={onPlay} className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform animate-pulse">
                        Vamos jogar! 🚀
                    </button>
                )}
            </div>
        </div>
    );
});

InstructionsScreen.displayName = 'InstructionsScreen';
