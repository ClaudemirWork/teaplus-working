// app/bubble-pop/components/TitleScreen.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Trophy, Volume2, VolumeX, Play } from 'lucide-react';
import { GameAudioManager } from '@/utils/gameAudioManager';

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

    const handleStartIntroSpeech = async () => {
        setUserInteracted(true);
        const audioManager = GameAudioManager.getInstance();
        await audioManager.forceInitialize(); // Garante que o AudioContext está ativo
        audioManager.pararTodos();
        audioManager.falarMila("Olá! Eu sou a Mila! Vamos estourar bolhas e salvar o mundo marinho!", () => {
            setTimeout(() => {
                audioManager.falarMila("Será uma aventura incrível no fundo do oceano!", () => {
                    setIntroSpeechComplete(true);
                });
            }, 1500);
        });
    };

    // Timeout para mostrar o botão de começar mesmo sem interação
    useEffect(() => {
        if (!userInteracted) {
            const timer = setTimeout(() => {
                if (!introSpeechComplete) {
                    setIntroSpeechComplete(true);
                }
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [userInteracted, introSpeechComplete]);

    return (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-cyan-300 via-blue-400 to-blue-600 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="absolute animate-pulse" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, animationDuration: `${3 + Math.random() * 2}s` }}>
                        <Star className="w-6 h-6 text-white opacity-30" fill="currentColor" />
                    </div>
                ))}
            </div>
            <button onClick={toggleAudio} className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors">
                {audioEnabled ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
            </button>
            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-4 animate-bounce-slow">
                    <Image src="/images/mascotes/mila/Mila_roupa_mergulho.png" alt="Mila" width={400} height={400} className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl" priority />
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
                    Oceano de Bolhas
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-6 drop-shadow-md">
                    🌊 Salve o reino oceânico! 🐠
                </p>
                
                {(totalStarsCollected > 0 || bestScore > 0) && (
                    <div className="bg-white/80 rounded-2xl p-4 mb-6 shadow-xl">
                        <div className="flex items-center justify-center gap-4">
                            {totalStarsCollected > 0 && (
                                <div className="flex items-center gap-2"><Star className="w-6 h-6 text-yellow-500" fill="currentColor" /><span className="font-bold text-blue-800">{totalStarsCollected} estrelas</span></div>
                            )}
                            {bestScore > 0 && (
                                <div className="flex items-center gap-2"><Trophy className="w-6 h-6 text-yellow-600" /><span className="font-bold text-blue-800">Recorde: {bestScore}</span></div>
                            )}
                        </div>
                    </div>
                )}
                
                {!userInteracted && (
                    <button onClick={handleStartIntroSpeech} className="flex items-center gap-2 text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full px-8 py-4 shadow-xl transition-all duration-300 hover:scale-110 animate-pulse">
                        <Play className="w-6 h-6" /> Ouvir Mila
                    </button>
                )}
                
                {introSpeechComplete && (
                    <button onClick={onStart} className="text-xl font-bold text-white bg-gradient-to-r from-green-500 to-cyan-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1 animate-pulse">
                        Começar Aventura
                    </button>
                )}
                
                {userInteracted && !introSpeechComplete && (
                    <div className="mt-8 flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white mt-4 font-medium">A Mila está falando...</p>
                    </div>
                )}
            </div>
        </div>
    );
});

TitleScreen.displayName = 'TitleScreen';
