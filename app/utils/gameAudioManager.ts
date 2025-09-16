// Arquivo: utils/gameAudioManager.ts

// A palavra "export" aqui garante que estamos exportando a CLASSE,
// o que nos dá acesso ao método estático .getInstance()
export class GameAudioManager {
  private static instance: GameAudioManager;
  private isEnabled: boolean = true;
  
  // As chaves agora são lidas das variáveis de ambiente
  private azureKey: string;
  private azureRegion: string;

  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;

  constructor() {
    // As variáveis de ambiente são carregadas aqui quando a classe é instanciada
    this.azureKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '';
    this.azureRegion = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || '';

    console.log('🔊 GameAudioManager inicializado');

    // Checagem para garantir que as chaves foram carregadas
    if (!this.azureKey || !this.azureRegion) {
      console.error('❌ ERRO CRÍTICO: Chaves do Azure não encontradas nas variáveis de ambiente!');
      console.log('Verifique o arquivo .env.local (para ambiente local) ou as configurações do Netlify (para produção).');
    } else {
      console.log('Azure Key válida:', this.azureKey.substring(0, 4) + '...');
      console.log('Azure Region:', this.azureRegion);
    }
  }

  // Este método estático precisa da CLASSE para ser chamado, por isso o "export class" é crucial
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
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('🎵 AudioContext criado:', this.audioContext.state);
      }

      if (this.audioContext.state === 'suspended') {
        console.log('🔓 Resumindo AudioContext...');
        await this.audioContext.resume();
        console.log('✅ AudioContext resumed:', this.audioContext.state);
      }

      this.isInitialized = true;
      console.log('✅ AudioContext inicializado e pronto');
    } catch (error) {
      console.error('❌ Erro ao inicializar AudioContext:', error);
      throw error;
    }
  }

  private async synthesizeAzureSpeech(texto: string, voiceName: string): Promise<ArrayBuffer> {
    const endpoint = `https://${this.azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    
    console.log('🎤 Azure TTS Request:', {
      endpoint,
      voiceName,
      texto: texto.substring(0, 50) + '...',
      region: this.azureRegion
    });

    const ssml = `<speak version='1.0' xml:lang='pt-BR' xmlns='http://www.w3.org/2001/10/synthesis'>
  <voice name='${voiceName}'>
    <prosody rate="0.9" pitch="medium">
      ${texto.replace(/[<>&"']/g, (match) => {
        const entities: {[key: string]: string} = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&apos;'
        };
        return entities[match];
      })}
    </prosody>
  </voice>
</speak>`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.azureKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'LudiTEA-BubblePop/1.0',
          'Accept': '*/*',
          'Cache-Control': 'no-cache'
        },
        body: ssml
      });

      console.log('📡 Azure Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Azure TTS Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          endpoint
        });
        
        if (response.status === 401) {
          throw new Error('Chave do Azure inválida ou expirada');
        }
        throw new Error(`Azure TTS Error: ${response.status} - ${errorText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength === 0) {
        throw new Error('Azure retornou áudio vazio');
      }
      console.log('✅ Azure TTS Success - Audio size:', arrayBuffer.byteLength, 'bytes');
      return arrayBuffer;

    } catch (error: any) {
      console.error('❌ Azure TTS Network Error:', error);
      throw new Error(`Erro de conexão Azure: ${error.message}`);
    }
  }

  private async playAudioBuffer(buffer: ArrayBuffer, callback?: () => void): Promise<void> {
    try {
      await this.initializeAudioContext();
      if (!this.audioContext) throw new Error('AudioContext não disponível');

      const audioBuffer = await this.audioContext.decodeAudioData(buffer.slice(0));
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => {
        console.log('🎵 Reprodução finalizada');
        callback?.();
      };
      
      source.start(0);
      console.log('▶️ Reprodução iniciada');
    } catch (error: any) {
      console.error('❌ Erro ao reproduzir áudio:', error);
      callback?.();
      throw new Error(`Erro de reprodução: ${error.message}`);
    }
  }

  async falarMila(texto: string, callback?: () => void): Promise<void> {
    if (!this.isEnabled || !texto || texto.trim().length === 0) {
      callback?.();
      return;
    }

    console.log('🎤 Iniciando fala da Mila:', texto);
    try {
      const audioBuffer = await this.synthesizeAzureSpeech(texto, 'pt-BR-FranciscaNeural');
      await this.playAudioBuffer(audioBuffer, callback);
      console.log('✅ Fala da Mila concluída com sucesso');
    } catch (error: any) {
      console.error('❌ Erro completo na fala da Mila:', error);
      callback?.();
    }
  }

  async falarLeo(texto: string, callback?: () => void): Promise<void> {
    if (!this.isEnabled || !texto || texto.trim().length === 0) {
      callback?.();
      return;
    }

    console.log('🎤 Iniciando fala do Leo:', texto);
    try {
      const audioBuffer = await this.synthesizeAzureSpeech(texto, 'pt-BR-AntonioNeural');
      await this.playAudioBuffer(audioBuffer, callback);
      console.log('✅ Fala do Leo concluída com sucesso');
    } catch (error: any) {
      console.error('❌ Erro completo na fala do Leo:', error);
      callback?.();
    }
  }

  pararTodos(): void {
    console.log('🛑 Parando todas as reproduções');
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.close().then(() => {
        this.audioContext = null;
        this.isInitialized = false;
        console.log('AudioContext fechado e resetado.');
      });
    }
  }

  toggleAudio(): boolean {
    this.isEnabled = !this.isEnabled;
    console.log('🔊 Áudio', this.isEnabled ? 'LIGADO' : 'DESLIGADO');
    if (!this.isEnabled) {
      this.pararTodos();
    }
    return this.isEnabled;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }
  
  getAudioContextState(): string {
    return this.audioContext?.state || 'not-initialized';
  }
  
  async forceInitialize(): Promise<void> {
    await this.initializeAudioContext();
  }
}
