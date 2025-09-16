export class GameAudioManager {
  private static instance: GameAudioManager;
  private isEnabled: boolean = true;
  private azureKey: string = 'Es1mnBWS4tl8GHA9c3v2gPY4HNQhrYTp7oGa7g7lt3aNrJTNJ364khJQQJ99BIACZoyftXJ3w3AAAYACOG1ErH';
  private azureRegion: string = 'brazilsouth';

  constructor() {
    console.log('GameAudioManager inicializado - AZURE ONLY');
    console.log('Azure Key (primeiros 10 chars):', this.azureKey.substring(0, 10));
    console.log('Azure Region:', this.azureRegion);
  }

  static getInstance(): GameAudioManager {
    if (!GameAudioManager.instance) {
      GameAudioManager.instance = new GameAudioManager();
    }
    return GameAudioManager.instance;
  }

  private async synthesizeAzureSpeech(texto: string, voiceName: string): Promise<ArrayBuffer> {
    const endpoint = `https://${this.azureRegion}.api.cognitive.microsoft.com/cognitiveservices/v1`;
    
    console.log('Azure TTS Request:', {
      endpoint,
      voiceName,
      texto: texto.substring(0, 50) + '...',
      keyPrefix: this.azureKey.substring(0, 8)
    });

    const ssml = `<speak version='1.0' xml:lang='pt-BR'>
  <voice xml:lang='pt-BR' name='${voiceName}'>
    <prosody rate="0.9" pitch="0%">
      ${texto}
    </prosody>
  </voice>
</speak>`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.azureKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'User-Agent': 'TeaPlus/1.0'
      },
      body: ssml
    });

    console.log('Azure Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure TTS Failed:', {
        status: response.status,
        error: errorText
      });
      throw new Error(`Azure TTS Error: ${response.status} - ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('Azure TTS Success - Audio size:', arrayBuffer.byteLength, 'bytes');
    return arrayBuffer;
  }

  private playAudioBuffer(buffer: ArrayBuffer, callback?: () => void): void {
    console.log('Reproduzindo áudio Azure...');
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    audioContext.decodeAudioData(buffer, (audioBuffer) => {
      console.log('Áudio decodificado com sucesso');
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        console.log('Reprodução Azure finalizada');
        callback?.();
      };
      
      source.start(0);
      console.log('Iniciando reprodução...');
      
    }, (error) => {
      console.error('Erro ao decodificar áudio:', error);
      throw new Error(`Erro de decodificação: ${error}`);
    });
  }

  async falarMila(texto: string, callback?: () => void): Promise<void> {
    if (!this.isEnabled) {
      console.log('Áudio desabilitado');
      callback?.();
      return;
    }

    console.log('🎤 falarMila (Francisca):', texto);

    try {
      const audioBuffer = await this.synthesizeAzureSpeech(texto, 'pt-BR-FranciscaNeural');
      this.playAudioBuffer(audioBuffer, callback);
    } catch (error) {
      console.error('❌ Erro na falarMila:', error);
      throw error; // Não mascarar o erro
    }
  }

  async falarLeo(texto: string, callback?: () => void): Promise<void> {
    if (!this.isEnabled) {
      console.log('Áudio desabilitado');
      callback?.();
      return;
    }

    console.log('🎤 falarLeo (Antonio):', texto);

    try {
      const audioBuffer = await this.synthesizeAzureSpeech(texto, 'pt-BR-AntonioNeural');
      this.playAudioBuffer(audioBuffer, callback);
    } catch (error) {
      console.error('❌ Erro na falarLeo:', error);
      throw error; // Não mascarar o erro
    }
  }

  pararTodos(): void {
    console.log('🛑 pararTodos - Azure TTS (sem ação necessária)');
    // Azure TTS não precisa de cancelamento como Web Speech API
  }

  toggleAudio(): boolean {
    this.isEnabled = !this.isEnabled;
    console.log('🔊 Áudio', this.isEnabled ? 'LIGADO' : 'DESLIGADO');
    return this.isEnabled;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }
}
