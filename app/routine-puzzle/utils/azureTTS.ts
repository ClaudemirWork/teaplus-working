// Sistema de Text-to-Speech com seleção inteligente de voz masculina
class AzureTTSService {
  private isEnabled: boolean = true;
  private volume: number = 0.7;
  private isMuted: boolean = false;
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    // Inicializar vozes quando disponíveis
    this.initializeVoices();
  }

  // Inicializar e selecionar melhor voz masculina
  private initializeVoices(): void {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      this.selectedVoice = this.selectBestMaleVoice(voices);
    };

    // Carregar vozes imediatamente se disponíveis
    loadVoices();
    
    // Também escutar evento de vozes carregadas
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  // Selecionar melhor voz masculina brasileira
  private selectBestMaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    // Prioridade 1: Voz masculina brasileira específica
    let voice = voices.find(v => 
      v.lang.includes('pt-BR') && 
      (v.name.toLowerCase().includes('male') || 
       v.name.toLowerCase().includes('masculin') ||
       v.name.toLowerCase().includes('antonio') ||
       v.name.toLowerCase().includes('ricardo') ||
       v.name.toLowerCase().includes('felipe'))
    );

    // Prioridade 2: Qualquer voz portuguesa (pode ser masculina)
    if (!voice) {
      voice = voices.find(v => v.lang.includes('pt-BR'));
    }

    // Prioridade 3: Voz portuguesa geral
    if (!voice) {
      voice = voices.find(v => v.lang.includes('pt'));
    }

    // Prioridade 4: Voz em inglês masculina (último recurso)
    if (!voice) {
      voice = voices.find(v => 
        v.lang.includes('en') && 
        (v.name.toLowerCase().includes('male') || 
         v.name.toLowerCase().includes('david') ||
         v.name.toLowerCase().includes('mark'))
      );
    }

    // Último recurso: primeira voz disponível
    if (!voice && voices.length > 0) {
      voice = voices[0];
    }

    console.log('Leo Voice Selected:', voice?.name, voice?.lang);
    return voice;
  }

  // Método principal para falar texto
  async speak(text: string, options?: { 
    priority?: 'low' | 'high';
    interrupt?: boolean;
  }): Promise<void> {
    if (this.isMuted || !this.isEnabled || !text.trim()) {
      return;
    }

    try {
      if (this.isWebSpeechSupported()) {
        await this.speakWithWebAPI(text, options);
      } else {
        console.log('Text-to-Speech não suportado neste navegador');
      }
    } catch (error) {
      console.error('Erro no Text-to-Speech:', error);
    }
  }

  // Web Speech API melhorada
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
      
      // Usar voz selecionada ou tentar encontrar uma nova
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      } else {
        // Tentar novamente selecionar voz se não encontrou antes
        const voices = window.speechSynthesis.getVoices();
        this.selectedVoice = this.selectBestMaleVoice(voices);
        if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }
      }

      utterance.lang = 'pt-BR';
      utterance.volume = this.volume;
      utterance.rate = 0.85; // Mais devagar para crianças
      utterance.pitch = 0.8; // Tom mais grave para Leo

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event.error);

      // Log para debug
      console.log('Leo falando:', text, 'Voz:', utterance.voice?.name);

      window.speechSynthesis.speak(utterance);
    });
  }

  // Verificar se Web Speech API está disponível
  private isWebSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 
           'speechSynthesis' in window && 
           'SpeechSynthesisUtterance' in window;
  }

  // Listar vozes disponíveis (para debug)
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return window.speechSynthesis?.getVoices() || [];
  }

  // Testar voz atual
  async testVoice(): Promise<void> {
    await this.speak('Olá! Eu sou o Leo e esta é minha voz!', { priority: 'high' });
  }

  // Forçar re-seleção de voz
  refreshVoiceSelection(): void {
    const voices = window.speechSynthesis?.getVoices() || [];
    this.selectedVoice = this.selectBestMaleVoice(voices);
    console.log('Nova voz selecionada:', this.selectedVoice?.name);
  }

  // Métodos de controle (mantidos iguais)
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
export const testLeoVoice = () => azureTTS.testVoice();
export const refreshVoice = () => azureTTS.refreshVoiceSelection();
export const getVoices = () => azureTTS.getAvailableVoices();
