export class GameAudioManager {
  private static instance: GameAudioManager;
  private maleVoice: SpeechSynthesisVoice | null = null;
  private femaleVoice: SpeechSynthesisVoice | null = null;
  private isReady: boolean = false;
  private isEnabled: boolean = true;

  constructor() {
    this.initVoices();
  }

  static getInstance(): GameAudioManager {
    if (!GameAudioManager.instance) {
      GameAudioManager.instance = new GameAudioManager();
    }
    return GameAudioManager.instance;
  }

  private initVoices() {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log('Vozes disponíveis:', voices.map(v => `${v.name} - ${v.lang}`));
      
      // Encontrar vozes brasileiras - priorizar Google
      const ptBRVoices = voices.filter(v => v.lang.includes('pt-BR'));
      
      // Tentar encontrar vozes específicas do Google primeiro
      this.maleVoice = ptBRVoices.find(v => 
        v.name.toLowerCase().includes('male') || 
        v.name.toLowerCase().includes('masculino') ||
        v.name.toLowerCase().includes('wavenet-b') ||
        v.name.toLowerCase().includes('neural2-b')
      ) || ptBRVoices[0] || voices[0];

      this.femaleVoice = ptBRVoices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('feminino') ||
        v.name.toLowerCase().includes('wavenet-a') ||
        v.name.toLowerCase().includes('neural2-a')
      ) || ptBRVoices[1] || ptBRVoices[0] || voices[1] || voices[0];

      console.log('Voz Leo:', this.maleVoice?.name);
      console.log('Voz Mila:', this.femaleVoice?.name);
      
      this.isReady = true;
    };

    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      // Fallback para dispositivos que não disparam o evento
      setTimeout(loadVoices, 1000);
    }
  }

  falarLeo(texto: string, callback?: () => void): void {
    if (!this.isReady || !this.isEnabled) {
      callback?.();
      return;
    }
    
    // Parar qualquer fala anterior
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.voice = this.maleVoice;
    utterance.pitch = 0.9;  // Tom mais grave para Leo
    utterance.rate = 0.85;
    utterance.volume = 0.8;
    utterance.lang = 'pt-BR';
    
    if (callback) {
      utterance.onend = callback;
      utterance.onerror = callback; // Chamar callback mesmo em caso de erro
    }
    
    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Erro ao falar (Leo):', error);
      callback?.();
    }
  }

  falarMila(texto: string, callback?: () => void): void {
    if (!this.isReady || !this.isEnabled) {
      callback?.();
      return;
    }
    
    // Parar qualquer fala anterior
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.voice = this.femaleVoice;
    utterance.pitch = 1.2;  // Tom mais agudo para Mila
    utterance.rate = 0.85;
    utterance.volume = 0.8;
    utterance.lang = 'pt-BR';
    
    if (callback) {
      utterance.onend = callback;
      utterance.onerror = callback; // Chamar callback mesmo em caso de erro
    }
    
    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Erro ao falar (Mila):', error);
      callback?.();
    }
  }

  pararTodos(): void {
    speechSynthesis.cancel();
  }

  toggleAudio(): boolean {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.pararTodos();
    }
    return this.isEnabled;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }
}
