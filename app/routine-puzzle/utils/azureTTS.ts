// Sistema de Text-to-Speech com Azure e fallback para Web Speech API
class AzureTTSService {
  private isEnabled: boolean = true;
  private volume: number = 0.7;
  private isMuted: boolean = false;

  // Configuração do Azure Speech (para futuro)
  private azureConfig = {
    subscriptionKey: process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '',
    region: process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || 'brazilsouth',
    language: 'pt-BR',
    voice: 'pt-BR-AntonioNeural' // Voz masculina brasileira para o Leo
  };

  // Método principal para falar texto
  async speak(text: string, options?: { 
    priority?: 'low' | 'high';
    interrupt?: boolean;
  }): Promise<void> {
    if (this.isMuted || !this.isEnabled || !text.trim()) {
      return;
    }

    try {
      // Primeiro tenta Web Speech API (mais simples e funciona offline)
      if (this.isWebSpeechSupported()) {
        await this.speakWithWebAPI(text, options);
      } else {
        console.log('Text-to-Speech não suportado neste navegador');
      }
    } catch (error) {
      console.error('Erro no Text-to-Speech:', error);
    }
  }

  // Web Speech API (fallback nativo do navegador)
  private async speakWithWebAPI(text: string, options?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('SpeechSynthesis não suportado'));
        return;
      }

      // Para navegadores que precisam de interrupção
      if (options?.interrupt) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configurar voz masculina em português brasileiro
      const voices = window.speechSynthesis.getVoices();
      const malePortugueseVoice = voices.find(voice => 
        (voice.lang.includes('pt-BR') || voice.lang.includes('pt')) &&
        (voice.name.toLowerCase().includes('male') || 
         voice.name.toLowerCase().includes('antonio') ||
         voice.name.toLowerCase().includes('ricardo'))
      );
      
      if (malePortugueseVoice) {
        utterance.voice = malePortugueseVoice;
      }

      utterance.lang = 'pt-BR';
      utterance.volume = this.volume;
      utterance.rate = 0.9; // Falar um pouco mais devagar para crianças
      utterance.pitch = 0.9; // Tom mais grave e amigável para o Leo

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event.error);

      window.speechSynthesis.speak(utterance);
    });
  }

  // Verificar se Web Speech API está disponível
  private isWebSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 
           'speechSynthesis' in window && 
           'SpeechSynthesisUtterance' in window;
  }

  // Métodos de controle
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.volume;
  }

  mute(): void {
    this.isMuted = true;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  unmute(): void {
    this.isMuted = false;
  }

  toggleMute(): boolean {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
    return this.isMuted;
  }

  isMutedState(): boolean {
    return this.isMuted;
  }

  // Parar fala atual
  stop(): void {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // Frases específicas do Leo para o routine-puzzle
  async speakTaskName(taskName: string): Promise<void> {
    await this.speak(`Próxima atividade: ${taskName}`, { priority: 'high' });
  }

  async speakTaskCompleted(taskName: string): Promise<void> {
    const encouragements = [
      'Muito bem!',
      'Parabéns!',
      'Você conseguiu!',
      'Excelente trabalho!',
      'Que legal!',
      'Leo está orgulhoso de você!'
    ];
    
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    await this.speak(`${randomEncouragement} Você completou: ${taskName}`, { priority: 'high', interrupt: true });
  }

  async speakWelcome(): Promise<void> {
    await this.speak('Olá! Eu sou o Leo e vou te ajudar com sua rotina hoje!', { priority: 'high' });
  }

  async speakDayCompleted(): Promise<void> {
    await this.speak('Parabéns! Você completou todas as atividades do dia! Leo está muito orgulhoso!', { priority: 'high' });
  }

  async speakLevelUp(newLevel: number): Promise<void> {
    await this.speak(`Incrível! Você subiu para o nível ${newLevel}! Continue assim!`, { priority: 'high', interrupt: true });
  }
}

// Instância singleton
export const azureTTS = new AzureTTSService();

// Funções de conveniência para usar no app
export const speakTask = (taskName: string) => azureTTS.speakTaskName(taskName);
export const speakCompletion = (taskName: string) => azureTTS.speakTaskCompleted(taskName);
export const speakWelcome = () => azureTTS.speakWelcome();
export const speakDayComplete = () => azureTTS.speakDayCompleted();
export const speakLevelUp = (level: number) => azureTTS.speakLevelUp(level);
export const toggleMute = () => azureTTS.toggleMute();
export const isMuted = () => azureTTS.isMutedState();
