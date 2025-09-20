// Sistema avançado de Text-to-Speech com seleção inteligente de voz masculina
class AzureTTSService {
  private isEnabled: boolean = true;
  private volume: number = 0.7;
  private isMuted: boolean = false;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isInitialized: boolean = false;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private preferredVoiceId: string | null = null;

  constructor() {
    // Inicialização será lazy
  }

  // Inicialização lazy - só quando efetivamente usar
  private ensureInitialized(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    this.initializeVoices();
    this.isInitialized = true;
  }

  // Inicializar e catalogar todas as vozes disponíveis
  private initializeVoices(): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    const loadVoices = () => {
      this.availableVoices = window.speechSynthesis.getVoices();
      console.log('🎤 Vozes disponíveis:', this.availableVoices.length);
      
      // Listar todas as vozes para debug
      this.availableVoices.forEach((voice, index) => {
        console.log(`${index + 1}. ${voice.name} (${voice.lang}) - ${voice.gender || 'unknown'}`);
      });

      this.selectedVoice = this.selectBestMaleVoice();
      
      if (this.selectedVoice) {
        console.log('🎯 Voz do Leo selecionada:', this.selectedVoice.name, this.selectedVoice.lang);
      } else {
        console.log('⚠️ Nenhuma voz adequada encontrada');
      }
    };

    // Tentar carregar vozes imediatamente
    loadVoices();
    
    // Também escutar evento de vozes carregadas (alguns navegadores precisam)
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Forçar carregamento após 1 segundo se necessário
    setTimeout(loadVoices, 1000);
  }

  // Algoritmo inteligente para selecionar voz masculina
  private selectBestMaleVoice(): SpeechSynthesisVoice | null {
    if (this.availableVoices.length === 0) {
      return null;
    }

    // Se usuário já escolheu uma voz, usar ela
    if (this.preferredVoiceId) {
      const preferredVoice = this.availableVoices.find(v => 
        `${v.name}-${v.lang}` === this.preferredVoiceId
      );
      if (preferredVoice) {
        return preferredVoice;
      }
    }

    // Critérios de prioridade para Leo (voz masculina)
    const criteria = [
      // 1º Prioridade: Vozes explicitamente masculinas em português brasileiro
      {
        filter: (v: SpeechSynthesisVoice) => 
          v.lang.includes('pt-BR') && 
          (v.name.toLowerCase().includes('male') || 
           v.name.toLowerCase().includes('masculin') ||
           v.name.toLowerCase().includes('antonio') ||
           v.name.toLowerCase().includes('ricardo') ||
           v.name.toLowerCase().includes('daniel') ||
           v.name.toLowerCase().includes('felipe') ||
           v.name.toLowerCase().includes('carlos') ||
           v.name.toLowerCase().includes('marcos')),
        priority: 10
      },
      
      // 2º Prioridade: Qualquer voz brasileira (pode ser masculina)
      {
        filter: (v: SpeechSynthesisVoice) => v.lang.includes('pt-BR'),
        priority: 8
      },
      
      // 3º Prioridade: Voz portuguesa
      {
        filter: (v: SpeechSynthesisVoice) => v.lang.includes('pt-PT'),
        priority: 6
      },
      
      // 4º Prioridade: Qualquer português
      {
        filter: (v: SpeechSynthesisVoice) => v.lang.includes('pt'),
        priority: 5
      },
      
      // 5º Prioridade: Vozes masculinas em inglês
      {
        filter: (v: SpeechSynthesisVoice) => 
          v.lang.includes('en') && 
          (v.name.toLowerCase().includes('male') ||
           v.name.toLowerCase().includes('david') ||
           v.name.toLowerCase().includes('mark') ||
           v.name.toLowerCase().includes('alex') ||
           v.name.toLowerCase().includes('tom')),
        priority: 3
      },
      
      // 6º Prioridade: Primeira voz disponível
      {
        filter: () => true,
        priority: 1
      }
    ];

    // Encontrar melhor voz baseada nos critérios
    for (const criterion of criteria) {
      const candidates = this.availableVoices.filter(criterion.filter);
      if (candidates.length > 0) {
        // Se múltiplas candidatas, preferir a primeira
        return candidates[0];
      }
    }

    return this.availableVoices[0] || null;
  }

  // Método para usuário escolher voz manualmente
  setPreferredVoice(voiceId: string): void {
    this.preferredVoiceId = voiceId;
    const voice = this.availableVoices.find(v => 
      `${v.name}-${v.lang}` === voiceId
    );
    
    if (voice) {
      this.selectedVoice = voice;
      console.log('🎯 Nova voz do Leo:', voice.name);
      
      // Salvar preferência no localStorage
      try {
        localStorage.setItem('leo-preferred-voice', voiceId);
      } catch (e) {
        console.log('Não foi possível salvar preferência de voz');
      }
    }
  }

  // Carregar preferência salva
  private loadPreferredVoice(): void {
    try {
      const saved = localStorage.getItem('leo-preferred-voice');
      if (saved) {
        this.preferredVoiceId = saved;
      }
    } catch (e) {
      console.log('Não foi possível carregar preferência de voz');
    }
  }

  // Método principal para falar texto
  async speak(text: string, options?: { 
    priority?: 'low' | 'high';
    interrupt?: boolean;
  }): Promise<void> {
    if (typeof window === 'undefined') {
      console.log('TTS: Não está no browser');
      return;
    }

    this.ensureInitialized();

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

  // Web Speech API otimizada
  private async speakWithWebAPI(text: string, options?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        reject(new Error('SpeechSynthesis não suportado'));
        return;
      }

      // Interromper fala anterior se necessário
      if (options?.interrupt) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Usar voz selecionada
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
        console.log(`🎤 Leo falando com: ${this.selectedVoice.name}`);
      } else {
        console.log('⚠️ Usando voz padrão do sistema');
      }

      // Configurações otimizadas para Leo
      utterance.lang = 'pt-BR';
      utterance.volume = this.volume;
      utterance.rate = 0.9; // Velocidade natural
      utterance.pitch = 0.85; // Tom ligeiramente mais grave para Leo

      utterance.onend = () => {
        console.log('✅ Leo terminou de falar');
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('❌ Erro na fala do Leo:', event.error);
        reject(event.error);
      };

      utterance.onstart = () => {
        console.log('🎙️ Leo começou a falar:', text);
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  // Verificar se Web Speech API está disponível
  private isWebSpeechSupported(): boolean {
    return typeof window !== 'undefined' && 
           'speechSynthesis' in window && 
           'SpeechSynthesisUtterance' in window;
  }

  // Listar todas as vozes disponíveis para UI
  getAvailableVoices(): Array<{id: string, name: string, lang: string, recommended?: boolean}> {
    if (typeof window === 'undefined') return [];
    
    return this.availableVoices.map(voice => ({
      id: `${voice.name}-${voice.lang}`,
      name: voice.name,
      lang: voice.lang,
      recommended: voice.lang.includes('pt-BR') && 
                  (voice.name.toLowerCase().includes('male') || 
                   voice.name.toLowerCase().includes('antonio') ||
                   voice.name.toLowerCase().includes('daniel'))
    }));
  }

  // Testar uma voz específica
  async testVoice(voiceId: string): Promise<void> {
    const originalVoice = this.selectedVoice;
    this.setPreferredVoice(voiceId);
    
    try {
      await this.speak('Olá! Eu sou o Leo. Esta é minha voz!', { priority: 'high', interrupt: true });
    } catch (error) {
      console.error('Erro ao testar voz:', error);
      this.selectedVoice = originalVoice;
    }
  }

  // Métodos de controle (mantidos)
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.volume;
  }

  mute(): void {
    this.isMuted = true;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
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
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // Frases específicas do Leo
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
      'Leo está orgulhoso de você!',
      'Fantástico!',
      'Você é incrível!'
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
export const testLeoVoice = () => azureTTS.testVoice;
export const getAvailableVoices = () => azureTTS.getAvailableVoices();
export const setLeoVoice = (voiceId: string) => azureTTS.setPreferredVoice(voiceId);
