// Componente visual do assistente Leo
// Interface conversacional + Avatar animado + Controles TTS + Auto-Hide

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, MessageCircle, X, Lightbulb, Star, Settings } from 'lucide-react';
import { useLeoMessages, useLeoAnalytics } from '../hooks/useLeoMessages';
import { UserContext } from '../data/leoContextualMessages';

interface LeoAssistantProps {
  userContext: UserContext;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  enableAutoTriggers?: boolean;
  debugMode?: boolean;
  onMessageDismiss?: () => void;
}

const LEO_AVATAR_STATES = {
  idle: '🦁',
  speaking: '🗣️🦁',
  thinking: '🤔🦁', 
  celebrating: '🎉🦁',
  sleeping: '😴🦁'
};

export function LeoAssistant({ 
  userContext, 
  position = 'bottom-right',
  enableAutoTriggers = true,
  debugMode = false,
  onMessageDismiss 
}: LeoAssistantProps) {
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [avatarState, setAvatarState] = useState<keyof typeof LEO_AVATAR_STATES>('idle');
  const [showSettings, setShowSettings] = useState(false);

  const {
    currentMessage,
    triggerMessage,
    speakMessage,
    dismissMessage,
    messageHistory,
    isLoading,
    error
  } = useLeoMessages({ 
    userContext, 
    enableTTS: ttsEnabled, 
    debugMode 
  });

  const { trackMessageShown, trackMessageInteraction } = useLeoAnalytics();

  // Animação do avatar baseada no estado
  useEffect(() => {
    if (isLoading) {
      setAvatarState('speaking');
    } else if (currentMessage) {
      setAvatarState('thinking');
    } else {
      setAvatarState('idle');
    }
  }, [isLoading, currentMessage]);

  // Auto-expansão quando há mensagem nova
  useEffect(() => {
    if (currentMessage && enableAutoTriggers) {
      setIsExpanded(true);
      setIsCollapsed(false); // Garantir que sai do modo colapsado
      trackMessageShown(currentMessage.id, currentMessage.trigger);
    }
  }, [currentMessage, enableAutoTriggers, trackMessageShown]);

  // Auto-hide: colapsar após 10 segundos
  useEffect(() => {
    if (currentMessage && isExpanded && !isCollapsed) {
      const autoHideTimer = setTimeout(() => {
        setIsCollapsed(true);
        setIsExpanded(false);
      }, 10000); // 10 segundos

      return () => clearTimeout(autoHideTimer);
    }
  }, [currentMessage, isExpanded, isCollapsed]);

  // Posicionamento CSS
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const handleDismiss = () => {
    if (currentMessage) {
      trackMessageInteraction(currentMessage.id, 'dismissed');
    }
    dismissMessage();
    setIsExpanded(false);
    setIsCollapsed(true);
    onMessageDismiss?.();
  };

  const handleSpeak = async () => {
    if (currentMessage) {
      trackMessageInteraction(currentMessage.id, 'spoke');
      await speakMessage();
    }
  };

  const handleToggleTTS = () => {
    setTtsEnabled(!ttsEnabled);
    trackMessageInteraction(currentMessage?.id || 'settings', 'tts_toggle');
  };

  const handleIndicatorClick = () => {
    setIsCollapsed(false);
    setIsExpanded(true);
    if (currentMessage) {
      trackMessageInteraction(currentMessage.id, 'expanded_from_indicator');
    }
  };

  // Menu de triggers manuais (modo debug)
  const debugTriggers = [
    'app_start', 'task_completion', 'level_up', 'streak_achievement',
    'main_screen_load', 'empty_day_view', 'activity_added'
  ];

  // Componente do Indicador Pequeno
  const SmallIndicator = () => (
    <button
      onClick={handleIndicatorClick}
      className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center relative"
      title="Leo tem uma mensagem para você!"
    >
      <span className="text-lg">🦁</span>
      
      {/* Indicador de nova mensagem */}
      {currentMessage && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
          <span className="sr-only">Nova mensagem</span>
        </div>
      )}
      
      {/* Anel de notificação */}
      {currentMessage && (
        <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping">
        </div>
      )}
    </button>
  );

  // Componente do Leo Completo
  const FullLeoAssistant = () => (
    <>
      {/* Balão de mensagem */}
      {isExpanded && currentMessage && (
        <div className="mb-4 max-w-sm bg-white rounded-2xl shadow-lg border-2 border-blue-200 relative animate-bounce-in">
          
          {/* Cabeçalho da mensagem */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{LEO_AVATAR_STATES[avatarState]}</span>
              <span className="text-white font-bold text-sm">Leo</span>
              {currentMessage.priority === 'high' && (
                <Star className="w-4 h-4 text-yellow-300 fill-current" />
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Botão TTS */}
              <button
                onClick={handleSpeak}
                disabled={isLoading}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                title="Ouvir mensagem"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
              
              {/* Botão fechar */}
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                title="Dispensar mensagem"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Conteúdo da mensagem */}
          <div className="p-4">
            <p className="text-gray-800 text-sm leading-relaxed">
              {currentMessage.text}
            </p>
            
            {/* Categoria e contexto */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentMessage.category === 'tutorial' ? 'bg-blue-100 text-blue-800' :
                  currentMessage.category === 'motivation' ? 'bg-green-100 text-green-800' :
                  currentMessage.category === 'guidance' ? 'bg-purple-100 text-purple-800' :
                  currentMessage.category === 'insight' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currentMessage.category}
                </span>
                <span className="text-xs text-gray-500">
                  {currentMessage.progressLevel}
                </span>
              </div>
              
              <Lightbulb className="w-4 h-4 text-yellow-500" />
            </div>
          </div>

          {/* Seta do balão */}
          <div className={`absolute top-full ${
            position.includes('right') ? 'right-8' : 'left-8'
          } w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-200`} />
        </div>
      )}

      {/* Avatar principal */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
            currentMessage 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse' 
              : 'bg-gradient-to-br from-blue-400 to-purple-500 hover:scale-110'
          } flex items-center justify-center`}
          title={isExpanded ? 'Fechar Leo' : 'Abrir Leo'}
        >
          <span className="text-2xl">
            {LEO_AVATAR_STATES[avatarState]}
          </span>
          
          {/* Indicador de mensagem nova */}
          {currentMessage && !isExpanded && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          )}
        </button>

        {/* Menu de configurações */}
        {showSettings && (
          <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg border p-3 min-w-48 z-10">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Voz automática</label>
                <button
                  onClick={handleToggleTTS}
                  className={`w-8 h-4 rounded-full transition-colors ${
                    ttsEnabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                    ttsEnabled ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              {/* Triggers de debug */}
              {debugMode && (
                <div className="border-t pt-2">
                  <p className="text-xs text-gray-500 mb-2">Debug Triggers:</p>
                  <div className="grid grid-cols-2 gap-1">
                    {debugTriggers.map(trigger => (
                      <button
                        key={trigger}
                        onClick={() => triggerMessage(trigger)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                      >
                        {trigger.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botão de configurações */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute -top-2 -left-2 w-6 h-6 bg-gray-500 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
          title="Configurações do Leo"
        >
          <Settings className="w-3 h-3 text-white" />
        </button>
      </div>
    </>
  );

  return (
    <div className={`fixed z-50 ${positionClasses[position]}`}>
      
      {/* Mostrar indicador pequeno ou Leo completo */}
      {isCollapsed ? (
        <SmallIndicator />
      ) : (
        <FullLeoAssistant />
      )}

      {/* Erro display */}
      {error && !isCollapsed && (
        <div className="absolute bottom-full mb-2 right-0 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}

// Estilos CSS personalizados (adicionar ao globals.css)
export const leoAssistantStyles = `
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(20px);
  }
  50% {
    opacity: 1;
    transform: scale(1.05) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
`;
