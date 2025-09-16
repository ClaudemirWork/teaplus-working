export class GameAudioManager {
  private static instance: GameAudioManager;
  private isEnabled: boolean = true;
  // NOVA: Chave do Azure (confirmar se está correta)
  private azureKey: string = 'Es1mnBWS4tl8GHA9c3v2gPY4HNQhrYTp7oGa7g7lt3aNrJTNJ364khJQQJ99BIACZoyftXJ3w3AAAYACOG1ErH';
  private azureRegion: string = 'brazilsouth';
  private useAzure: boolean = true; // Flag para alternar entre Azure e Web Speech

  constructor() {
    console.log('GameAudioManager inicializado');
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
    
    console.log('Tentando Azure TTS:', {
      endpoint,
      voiceName,
      texto: texto.substring(0, 50) + '...'
    });

    const ssml = `<speak version='1.0' xml:lang='pt-BR'>
  <voice xml:lang='pt-BR' name='${voiceName}'>
    <prosody rate="0.9" pitch="0%">
      ${texto}
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
          'User-Agent': 'TeaPlus/1.0'
        },
        body: ssml
      });

      console.log('Azure Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Azure TTS Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        // Se falhar, usar fallback
        this.useAzure = false;
        throw new Error(`Azure TTS Error: ${response.status} - ${errorText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      console.log('Azure TTS Success, audio size:', arrayBuffer.byteLength);
      return arrayBuffer;
      
    } catch (error) {
      console.error('Erro Azure TTS:', error);
      this.useAzure = false; // Desabilitar Azure se houver erro
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
          console.log('Áudio Azure finalizado');
          callback?.();
        };
        
        source.start(0);
        console.log('Tocando áudio Azure');
      }, (error) => {
        console.error('Erro ao decodificar áudio Azure:', error);
        this.fallbackToWebSpeech('Erro no áudio', callback);
      });
      
    } catch (error) {
      console.error('Erro ao tocar áudio Azure:', error);
      this.fallbackToWebSpeech('Erro de reprodução', callback);
    }
  }

  private fallbackToWebSpeech(texto: string, callback?: () => void): void {
    console.log('Usando fallback Web Speech API para:', texto.substring(0, 30));
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        if (callback) {
          utterance.onend = callback;
          utterance.onerror = callback;
        }
        
        try {
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('Erro no fallback Web Speech:', error);
          callback?.();
        }
      }, 100);
    } else {
      callback?.();
    }
  }

  async falarMila(texto: string, callback?: () => void): Promise<void> {
    if (!this.isEnabled) {
      console.log('Áudio desabilitado');
      callback?.();
      return;
    }

    console.log('falarMila chamada:', texto.substring(0, 30));

    // Tentar Azure primeiro (se habilitado)
    if (this.useAzure) {
      try {
        const audioBuffer = await this.synthesizeAzureSpeech(texto, 'pt-BR-FranciscaNeural');
        this.playAudioBuffer(audioBuffer, callback);
        return;
      } catch (error) {
        console.warn('Azure falhou, usando fallback:', error);
        this.useAzure = false; // Desabilitar Azure para próximas tentativas
      }
    }

    // Fallback para Web Speech API
    this.fallbackToWebSpeech(texto, callback);
  }

  async falarLeo(texto: string, callback?: () => void): Promise<void> {
    if (!this.isEnabled) {
      callback?.();
      return;
    }

    console.log('falarLeo chamada:', texto.substring(0, 30));

    // Tentar Azure primeiro (se habilitado)
    if (this.useAzure) {
      try {
        const audioBuffer = await this.synthesizeAzureSpeech(texto, 'pt-BR-AntonioNeural');
        this.playAudioBuffer(audioBuffer, callback);
        return;
      } catch (error) {
        console.warn('Azure falhou, usando fallback:', error);
        this.useAzure = false;
      }
    }

    // Fallback para Web Speech API
    this.fallbackToWebSpeech(texto, callback);
  }

  pararTodos(): void {
    console.log('pararTodos chamado');
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  toggleAudio(): boolean {
    this.isEnabled = !this.isEnabled;
    console.log('Áudio toggled:', this.isEnabled);
    
    if (!this.isEnabled) {
      this.pararTodos();
    }
    
    return this.isEnabled;
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  // NOVA: Método para resetar tentativa do Azure
  resetAzure(): void {
    this.useAzure = true;
    console.log('Azure TTS reabilitado');
  }

  // NOVA: Status do sistema de áudio
  getStatus(): { azure: boolean, enabled: boolean } {
    return {
      azure: this.useAzure,
      enabled: this.isEnabled
    };
  }
}
