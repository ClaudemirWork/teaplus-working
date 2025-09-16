// Arquivo: utils/gameAudioManager.ts

export class GameAudioManager {
  private static instance: GameAudioManager;
  private isEnabled: boolean = true;
  private azureKey: string;
  private azureRegion: string;

  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;
  
  // ✅ NOVO: Guarda a referência do som que está tocando
  private currentSource: AudioBufferSourceNode | null = null;

  constructor() {
    this.azureKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '';
    this.azureRegion = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || '';

    console.log('🔊 GameAudioManager inicializado');

    if (!this.azureKey || !this.azureRegion) {
      console.error('❌ ERRO CRÍTICO: Chaves do Azure não encontradas!');
    } else {
      console.log('Azure Key válida:', this.azureKey.substring(0, 4) + '...');
      console.log('Azure Region:', this.azureRegion);
    }
  }

  static getInstance(): GameAudioManager {
    if (!GameAudioManager.instance) {
      GameAudioManager.instance = new GameAudioManager();
    }
    return GameAudioManager.instance;
  }

  private async initializeAudioContext(): Promise<void> {
    if (this.isInitialized && this.audioContext?.state === 'running') {
      return;
    }
    try {
      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('🎵 AudioContext criado:', this.audioContext.state);
      }
      if (this.audioContext.state === 'suspended') {
        console.log('🔓 Resumindo AudioContext...');
        await this.audioContext.resume();
        console.log('✅ AudioContext resumed:', this.audioContext.state);
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Erro ao inicializar AudioContext:', error);
      throw error;
    }
  }

  private async synthesizeAzureSpeech(texto: string, voiceName: string): Promise<ArrayBuffer> {
    const endpoint = `https://${this.azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const ssml = `<speak version='1.0' xml:lang='pt-BR'><voice name='${voiceName}'><prosody rate="0.9" pitch="medium">${texto}</prosody></voice></speak>`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.azureKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'LudiTEA-BubblePop/1.0',
        },
        body: ssml
      });

      if (!response.ok) {
        throw new Error(`Azure TTS Error: ${response.status} - ${await response.text()}`);
      }
      return await response.arrayBuffer();
    } catch (error: any) {
      console.error('❌ Azure TTS Network Error:', error);
      throw error;
    }
  }

  private async playAudioBuffer(buffer: ArrayBuffer, callback?: () => void): Promise<void> {
    try {
      await this.initializeAudioContext();
      if (!this.audioContext) throw new Error('AudioContext não disponível');

      // ✅ NOVO: Para qualquer som que já esteja tocando
      this.pararTodos();

      const audioBuffer = await this.audioContext.decodeAudioData(buffer.slice(0));
      
      // ✅ NOVO: Guarda a referência da nova fonte de áudio
      this.currentSource = this.audioContext.createBufferSource();
      this.currentSource.buffer = audioBuffer;
      this.currentSource.connect(this.audioContext.destination);
      
      this.currentSource.onended = () => {
        console.log('🎵 Reprodução finalizada');
        this.currentSource = null; // Limpa a referência
        callback?.();
      };
      
      this.currentSource.start(0);
      console.log('▶️ Reprodução iniciada');
    } catch (error: any) {
      console.error('❌ Erro ao reproduzir áudio:', error);
      this.currentSource = null;
      callback?.();
      throw error;
    }
  }

  // ✅ MÉTODO CORRIGIDO: Agora só para o som atual, não desliga o motor
  pararTodos(): void {
    if (this.currentSource) {
      console.log('🛑 Parando reprodução atual...');
      this.currentSource.onended = null; // Evita que o callback seja chamado ao parar manualmente
      this.currentSource.stop();
      this.currentSource.disconnect();
      this.currentSource = null;
    }
  }
  
  async falarMila(texto: string, callback?: () => void): Promise<void> {
    if (!this.isEnabled || !texto || texto.trim().length === 0) {
      callback?.();
      return;
    }
    try {
      const audioBuffer = await this.synthesizeAzureSpeech(texto, 'pt-BR-FranciscaNeural');
      await this.playAudioBuffer(audioBuffer, callback);
    } catch (error: any) {
      console.error('❌ Erro completo na fala da Mila:', error);
      callback?.();
    }
  }

  async falarLeo(texto: string, callback?: () => void): Promise<void> {
    // Implementação similar a falarMila
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
  
  async forceInitialize(): Promise<void> {
    await this.initializeAudioContext();
  }
}
