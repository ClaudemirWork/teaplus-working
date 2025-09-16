export class GameAudioManager {
  private static instance: GameAudioManager;
  private isEnabled: boolean = true;
  private azureKey: string = 'Es1mnBWS4tl8GHA9c3v2gPY4HNQhrYTp7oGa7g7lt3aNrJTNJ364khJQQJ99BIACZoyftXJ3w3AAAYACOG1ErH';
  private azureRegion: string = 'brazilsouth';

  constructor() {
    // Inicialização simples - Azure não precisa de carregamento de vozes
  }

  static getInstance(): GameAudioManager {
    if (!GameAudioManager.instance) {
      GameAudioManager.instance = new GameAudioManager();
    }
    return GameAudioManager.instance;
  }

  private async synthesizeAzureSpeech(texto: string, voiceName: string): Promise<ArrayBuffer> {
    const endpoint = `https://${this.azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    
    const ssml = `
      <speak version='1.0' xml:lang='pt-BR'>
        <voice xml:lang='pt-BR' name='${voiceName}'>
          <prosody rate="0.9" pitch="0%">
            ${texto}
          </prosody>
        </voice>
      </speak>
    `;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.azureKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3'
        },
        body: ssml
      });

      if (!response.ok) {
        throw new Error(`Azure TTS Error: ${response.status}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Erro Azure TTS:', error);
      throw error;
    }
  }

  private playAudioBuffer(buffer: ArrayBuffer, callback?: () => void): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      audioContext.decodeAudioData(buffer, (audioBuffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        source.onended = () => {
          callback?.();
        };
        
        source.start(0);
      }, (error) => {
        console.error('Erro ao decodificar áudio:', error);
        callback?.();
      });
    } catch (error) {
      console.error('Erro ao tocar áudio:', error);
      callback?.();
    }
  }

  async falarMila(texto: string, callback?: () => void): Promise<void> {
    if (!this.isEnabled) {
      callback?.();
      return;
    }

    try {
      // Usar Francisca - voz feminina brasileira
      const audioBuffer = await this.synthesizeAzureSpeech(texto, 'pt-BR-FranciscaNeural');
      this.playAudioBuffer(audioBuffer, callback);
    } catch (error) {
      console.error('Erro falarMila:', error);
      callback?.();
    }
  }

  async falarLeo(texto: string, callback?: () => void): Promise<void> {
    if (!this.isEnabled) {
      callback?.();
      return;
    }

    try {
      // Usar Antonio - voz masculina brasileira  
      const audioBuffer = await this.synthesizeAzureSpeech(texto, 'pt-BR-AntonioNeural');
      this.playAudioBuffer(audioBuffer, callback);
    } catch (error) {
      console.error('Erro falarLeo:', error);
      callback?.();
    }
  }

  pararTodos(): void {
    // Com Azure, cada áudio é independente - não há fila global para parar
    console.log('Parar todos - Azure TTS');
  }

  toggleAudio(): boolean {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }
}
