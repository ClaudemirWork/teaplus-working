'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { azureTTS, speakWelcome, speakCompletion, speakLevelUp, toggleMute, isMuted } from '../utils/azureTTS';

interface LeoMascotProps {
  isVisible?: boolean;
  mood?: 'happy' | 'excited' | 'proud' | 'encouraging' | 'celebration';
  message?: string;
  showVolumeControl?: boolean;
  onMessageComplete?: () => void;
}

export default function LeoMascot({ 
  isVisible = true,
  mood = 'happy',
  message = '',
  showVolumeControl = true,
  onMessageComplete
}: LeoMascotProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeMuted, setVolumeMuted] = useState(false);

  // Frases do Leo baseadas no humor
  const leoMessages = {
    happy: [
      'Olá! Eu sou o Leo!',
      'Vamos organizar sua rotina?',
      'Estou aqui para te ajudar!',
      'Que bom te ver!'
    ],
    excited: [
      'Isso aí! Vamos começar!',
      'Que animação!',
      'Adoro quando você fica empolgado!',
      'Vamos fazer isso juntos!'
    ],
    proud: [
      'Muito bem! Estou orgulhoso!',
      'Você é incrível!',
      'Que trabalho fantástico!',
      'Continue assim!'
    ],
    encouraging: [
      'Você consegue!',
      'Não desista!',
      'Cada passo importa!',
      'Estou torcendo por você!'
    ],
    celebration: [
      'Parabéns! Que vitória!',
      'Você arrasou!',
      'Hora da festa!',
      'Que conquista incrível!'
    ]
  };

  // Escolher imagem do Leo baseada no humor
  const getLeoImage = () => {
    const basePath = '/images/mascotes/leo/';
    switch (mood) {
      case 'excited':
      case 'celebration':
        return `${basePath}leo_forca_resultado.webp`;
      case 'proud':
        return `${basePath}leo_forca_resultado.webp`;
      case 'encouraging':
        return `${basePath}leo_forca_resultado.webp`;
      default:
        return `${basePath}leo_forca_resultado.webp`;
    }
  };

  // Falar mensagem
  const speakMessage = async (text: string) => {
    if (!text.trim()) return;
    
    setIsSpeaking(true);
    try {
      await azureTTS.speak(text, { priority: 'high', interrupt: true });
    } catch (error) {
      console.log('Erro ao falar:', error);
    } finally {
      setIsSpeaking(false);
      if (onMessageComplete) {
        onMessageComplete();
      }
    }
  };

  // Animar Leo quando ele fala
  const animateLeo = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  // Falar mensagem aleatória baseada no humor
  const speakRandomMessage = () => {
    const messages = leoMessages[mood];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMessage(randomMessage);
    speakMessage(randomMessage);
    animateLeo();
  };

  // Efeito para falar mensagem customizada
  useEffect(() => {
    if (message && message !== currentMessage) {
      setCurrentMessage(message);
      speakMessage(message);
      animateLeo();
    }
  }, [message]);

  // Toggle mute
  const handleToggleMute = () => {
    const newMutedState = toggleMute();
    setVolumeMuted(newMutedState);
  };

  // Verificar estado do mute
  useEffect(() => {
    setVolumeMuted(isMuted());
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative">
      {/* Container do Leo */}
      <div className="flex flex-col items-center">
        {/* Imagem do Leo */}
        <div 
          className={`relative transition-all duration-500 cursor-pointer ${
            isAnimating ? 'animate-bounce scale-110' : 'hover:scale-105'
          } ${isSpeaking ? 'animate-pulse' : ''}`}
          onClick={speakRandomMessage}
        >
          <img
            src={getLeoImage()}
            alt="Leo Mascot"
            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
          />
          
          {/* Indicador de fala */}
          {isSpeaking && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
          )}
          
          {/* Efeito de brilho quando animando */}
          {isAnimating && (
            <div className="absolute inset-0 bg-yellow-300 opacity-20 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Balão de fala */}
        {currentMessage && (
          <div className="relative mt-4 max-w-xs">
            <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-blue-200">
              <p className="text-sm md:text-base font-medium text-gray-800 text-center">
                {currentMessage}
              </p>
              
              {/* Pontinha do balão */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l-2 border-t-2 border-blue-200 rotate-45"></div>
            </div>
          </div>
        )}

        {/* Controle de Volume */}
        {showVolumeControl && (
          <button
            onClick={handleToggleMute}
            className={`mt-4 p-2 rounded-full transition-all ${
              volumeMuted 
                ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-500 hover:bg-blue-200'
            }`}
            title={volumeMuted ? 'Ativar som do Leo' : 'Silenciar Leo'}
          >
            {volumeMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}

        {/* Dicas de interação */}
        <p className="text-xs text-gray-500 mt-2 text-center">
          Clique no Leo para ouvir uma mensagem!
        </p>
      </div>

      {/* Efeitos especiais de celebração */}
      {mood === 'celebration' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce text-2xl"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            >
              {['🎉', '⭐', '🏆', '🎊', '✨', '🌟'][i]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente simplificado para modo criança
export function LeoMascotChild({ 
  mood = 'happy', 
  message = '',
  onMessageComplete 
}: {
  mood?: LeoMascotProps['mood'];
  message?: string;
  onMessageComplete?: () => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <LeoMascot
        isVisible={true}
        mood={mood}
        message={message}
        showVolumeControl={false}
        onMessageComplete={onMessageComplete}
      />
    </div>
  );
}

// Hook para controlar Leo facilmente
export function useLeoMascot() {
  const [leoMood, setLeoMood] = useState<LeoMascotProps['mood']>('happy');
  const [leoMessage, setLeoMessage] = useState('');
  const [showLeo, setShowLeo] = useState(true);

  const celebrateTask = (taskName: string) => {
    setLeoMood('celebration');
    setLeoMessage(`Parabéns! Você completou: ${taskName}!`);
    speakCompletion(taskName);
  };

  const encourageUser = () => {
    setLeoMood('encouraging');
    setLeoMessage('Você consegue! Continue assim!');
  };

  const celebrateLevelUp = (newLevel: number) => {
    setLeoMood('celebration');
    setLeoMessage(`Incrível! Você subiu para o nível ${newLevel}!`);
    speakLevelUp(newLevel);
  };

  const greetUser = () => {
    setLeoMood('happy');
    setLeoMessage('Olá! Eu sou o Leo e vou te ajudar com sua rotina hoje!');
    speakWelcome();
  };

  return {
    leoMood,
    leoMessage,
    showLeo,
    setLeoMood,
    setLeoMessage,
    setShowLeo,
    celebrateTask,
    encourageUser,
    celebrateLevelUp,
    greetUser
  };
}
