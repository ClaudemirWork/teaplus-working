export class GameAudioManager {
  private static instance: GameAudioManager;
  private isEnabled: boolean = true;
  private azureKey: string = 'Es1mnBWS4tl8GHA9c3v2gPY4HNQhrYTp7oGa7g7lt3aNrJTNJ364khJQQJ99BIACZoyftXJ3w3AAAYACOG1ErH';
  private azureRegion: string = 'brazilsouth';
  
  // ✅ CORREÇÃO: Contexto único e reutilizável
  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;

  constructor() {
    console.log('🔊 GameAudioManager inicializado - Azure TTS Only');
    console.log('Azure Key válida:', this.azureKey.substring(0, 10) + '...');
    console.log('Azure Region:', this.azureRegion);
  }

  static getInstance(): GameAudioManager {
    if (!GameAudioManager.instance) {
      GameAudioManager.instance = new GameAudioManager();
    }
    return GameAudioManager.instance;
  }

  // ✅ CORREÇÃO: Inicializar contexto após interação do usuário
  private async initializeAudioContext(): Promise<void> {
    if (this.isInitialized && this.audioContext?.state === 'running') {
      return;
    }

    try {
      // Criar contexto apenas uma vez
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('🎵 AudioContext criado:', this.audioContext.state);
      }

      // Verificar e resumir se necessário
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

  // ✅ CORREÇÃO: Endpoint Azure correto e headers otimizados
  private async synthesizeAzureSpeech(texto: string, voiceName: string): Promise<ArrayBuffer> {
    // Endpoint correto conforme documentação Azure 2025
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
        headers: Object.fromEntries(response.headers)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Azure TTS Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          endpoint
        });
        
        // Erros específicos do Azure
        if (response.status === 401) {
          throw new Error('Chave do Azure inválida ou expirada');
        } else if (response.status === 429) {
          throw new Error('Limite de requisições do Azure excedido');
        } else if (response.status === 400) {
          throw new Error('Formato de requisição inválido');
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

  // ✅ CORREÇÃO: Reprodução de áudio robusta
  private async playAudioBuffer(buffer: ArrayBuffer, callback?: () => void): Promise<void> {
    try {
      // Garantir que o contexto está inicializado
      await this.initializeAudioContext();
      
      if (!this.audioContext) {
        throw new Error('AudioContext não disponível');
      }

      console.log('🎵 Decodificando áudio...');

      // Decodificar áudio
      const audioBuffer = await this.audioContext.decodeAudioData(buffer.slice(0));
      
      console.log('✅ Áudio decodificado:', {
        duration: audioBuffer.duration,
        channels: audioBuffer.numberOfChannels,
        sampleRate: audioBuffer.sampleRate
      });

      // Criar source e reproduzir
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      // Callback quando terminar
      source.onended = () => {
        console.log('🎵 Reprodução finalizada');
        callback?.();
      };
      
      // Iniciar reprodução
      source.start(0);
      console.log('▶️ Reprodução iniciada');

    } catch (error: any) {
      console.error('❌ Erro ao reproduzir áudio:', error);
      
      // Callback mesmo com erro para não travar o fluxo
      callback?.();
      
      // Re-throw para tratamento específico
      throw new Error(`Erro de reprodução: ${error.message}`);
    }
  }

  // ✅ CORREÇÃO: Método público com tratamento robusto
  async falarMila(texto: string, callback?: () => void): Promise<void> {
    if (!this.isEnabled) {
      console.log('🔇 Áudio desabilitado');
      callback?.();
      return;
    }

    if (!texto || texto.trim().length === 0) {
      console.warn('⚠️ Texto vazio fornecido');
      callback?.();
      return;
    }

    console.log('🎤 Iniciando fala da Mila:', texto);

    try {
      // Tentar Azure TTS
      const audioBuffer = await this.synthesizeAzureSpeech(texto, 'pt-BR-FranciscaNeural');
      await this.playAudioBuffer(audioBuffer, callback);
      console.log('✅ Fala da Mila concluída com sucesso');

    } catch (error: any) {
      console.error('❌ Erro completo na fala da Mila:', error);
      
      // Chamar callback mesmo com erro
      callback?.();
      
      // Para debug - não mascarar erros em desenvolvimento
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        throw error;
      }
    }
  }

  // ✅ CORREÇÃO: Método para Leo (caso necessite)
  async falarLeo(texto: string, callback?: () => void): Promise<void> {
    if (!this.isEnabled) {
      console.log('🔇 Áudio desabilitado');
      callback?.();
      return;
    }

    if (!texto || texto.trim().length === 0) {
      console.warn('⚠️ Texto vazio fornecido');
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
      
      // Chamar callback mesmo com erro
      callback?.();
      
      // Para debug - não mascarar erros em desenvolvimento
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        throw error;
      }
    }
  }

  // ✅ MÉTODO: Parar todas as reproduções
  pararTodos(): void {
    console.log('🛑 Parando todas as reproduções');
    
    if (this.audioContext && this.audioContext.state === 'running') {
      // Suspender contexto temporariamente para parar tudo
      this.audioContext.suspend();
      
      // Resumir após um breve momento
      setTimeout(() => {
        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
      }, 100);
    }
  }

  // ✅ MÉTODO: Toggle de áudio
  toggleAudio(): boolean {
    this.isEnabled = !this.isEnabled;
    console.log('🔊 Áudio', this.isEnabled ? 'LIGADO' : 'DESLIGADO');
    
    if (!this.isEnabled) {
      this.pararTodos();
    }
    
    return this.isEnabled;
  }

  // ✅ MÉTODO: Status do áudio
  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  // ✅ MÉTODO: Status do contexto
  getAudioContextState(): string {
    return this.audioContext?.state || 'not-initialized';
  }

  // ✅ MÉTODO: Forçar inicialização (para debug)
  async forceInitialize(): Promise<void> {
    await this.initializeAudioContext();
  }
}
