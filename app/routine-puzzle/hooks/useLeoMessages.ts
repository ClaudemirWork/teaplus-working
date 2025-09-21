// Hook para integrar o sistema de mensagens contextuais do Leo
// Conecta com Azure TTS + GameSystem + Analytics

import { useState, useEffect, useCallback } from 'react';
import { 
  LEO_CONTEXTUAL_MESSAGES, 
  ContextualMessage, 
  UserContext,
  getContextualMessage,
  calculateProgressLevel,
  isMessageOnCooldown,
  setMessageCooldown
} from '../data/leoContextualMessages';

interface UseLeoMessagesProps {
  userContext: UserContext;
  enableTTS?: boolean;
  debugMode?: boolean;
}

interface LeoMessagesReturn {
  currentMessage: ContextualMessage | null;
  triggerMessage: (trigger: string) => void;
  speakMessage: (text?: string) => Promise<void>;
  dismissMessage: () => void;
  getAvailableMessages: () => ContextualMessage[];
  messageHistory: ContextualMessage[];
  isLoading: boolean;
  error: string | null;
}

// Função para sintetizar voz (integração Azure TTS)
async function synthesizeSpeech(text: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    // Verificar se Azure Speech SDK está disponível
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not available');
      return;
    }

    // Cancelar fala anterior
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    // Configurações específicas para crianças
    const voices = window.speechSynthesis.getVoices();
    const brazilianVoice = voices.find(voice => 
      voice.lang.includes('pt-BR') || voice.lang.includes('pt')
    );
    
    if (brazilianVoice) {
      utterance.voice = brazilianVoice;
    }

    // Promise para aguardar conclusão
    return new Promise((resolve, reject) => {
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);
      window.speechSynthesis.speak(utterance);
    });

  } catch (error) {
    console.error('Erro na síntese de voz:', error);
  }
}

export function useLeoMessages({ 
  userContext, 
  enableTTS = true, 
  debugMode = false 
}: UseLeoMessagesProps): LeoMessagesReturn {
  
  const [currentMessage, setCurrentMessage] = useState<ContextualMessage | null>(null);
  const [messageHistory, setMessageHistory] = useState<ContextualMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular nível de progresso automaticamente
  const progressLevel = calculateProgressLevel(userContext);
  const enhancedUserContext = { ...userContext, progressLevel };

  // Função para disparar mensagem baseada em trigger
  const triggerMessage = useCallback((trigger: string) => {
    try {
      setError(null);
      
      if (debugMode) {
        console.log('🎭 Leo Trigger:', trigger, 'UserContext:', enhancedUserContext);
      }

      const message = getContextualMessage(trigger, enhancedUserContext);
      
      if (!message) {
        if (debugMode) {
          console.log('🎭 Leo: Nenhuma mensagem encontrada para trigger:', trigger);
        }
        return;
      }

      // Verificar cooldown
      if (isMessageOnCooldown(message.id)) {
        if (debugMode) {
          console.log('🎭 Leo: Mensagem em cooldown:', message.id);
        }
        return;
      }

      setCurrentMessage(message);
      setMessageHistory(prev => [...prev, message].slice(-20)); // Manter apenas últimas 20
      setMessageCooldown(message.id);

      // Disparar TTS automaticamente se habilitado
      if (enableTTS) {
        speakMessage(message.text);
      }

      if (debugMode) {
        console.log('🎭 Leo Mensagem:', message);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao disparar mensagem do Leo:', err);
    }
  }, [enhancedUserContext, enableTTS, debugMode]);

  // Função para falar mensagem (manual ou automática)
  const speakMessage = useCallback(async (text?: string) => {
    if (!enableTTS) return;

    setIsLoading(true);
    try {
      const textToSpeak = text || currentMessage?.text;
      if (textToSpeak) {
        await synthesizeSpeech(textToSpeak);
      }
    } catch (err) {
      setError('Erro na síntese de voz');
      console.error('Erro TTS:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentMessage, enableTTS]);

  // Função para dispensar mensagem atual
  const dismissMessage = useCallback(() => {
    setCurrentMessage(null);
    setError(null);
  }, []);

  // Função para obter mensagens disponíveis (debug/admin)
  const getAvailableMessages = useCallback(() => {
    return LEO_CONTEXTUAL_MESSAGES.filter(message => 
      (message.userMode === 'both' || message.userMode === enhancedUserContext.userMode) &&
      message.progressLevel === enhancedUserContext.progressLevel
    );
  }, [enhancedUserContext]);

  // Triggers automáticos baseados em mudanças no contexto
  useEffect(() => {
    // Trigger de primeira visita
    if (userContext.totalTasks === 0 && userContext.daysUsing === 0) {
      triggerMessage('app_start');
    }
  }, [userContext.totalTasks, userContext.daysUsing, triggerMessage]);

  useEffect(() => {
    // Trigger de progresso
    if (userContext.level > 1 && userContext.totalTasks > 0) {
      triggerMessage('level_up');
    }
  }, [userContext.level, triggerMessage]);

  useEffect(() => {
    // Trigger de sequência (streak)
    if (userContext.streakDays >= 7) {
      triggerMessage('streak_achievement');
    }
  }, [userContext.streakDays, triggerMessage]);

  return {
    currentMessage,
    triggerMessage,
    speakMessage,
    dismissMessage,
    getAvailableMessages,
    messageHistory,
    isLoading,
    error
  };
}

// Hook auxiliar para analytics do Leo
export function useLeoAnalytics() {
  const trackMessageShown = useCallback((messageId: string, trigger: string) => {
    // Implementar tracking de analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'leo_message_shown', {
        message_id: messageId,
        trigger: trigger,
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  const trackMessageInteraction = useCallback((messageId: string, action: 'dismissed' | 'spoke' | 'clicked') => {
    // Implementar tracking de interações
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'leo_message_interaction', {
        message_id: messageId,
        action: action,
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  return {
    trackMessageShown,
    trackMessageInteraction
  };
}
