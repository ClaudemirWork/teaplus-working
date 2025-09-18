// utils/gameAudioManager.ts
type SpeechItem = {
  text: string;
  voice: 'mila' | 'leo';
  priority: number; // 0=baixo, 1=normal, 2=alto (alertas)
  onEnd?: () => void;
};

export class GameAudioManager {
  private static instance: GameAudioManager;

  // Estado global de áudio (fonte da verdade)
  private isEnabled: boolean = true;

  // Credenciais Azure (ambiente)
  private azureKey: string;
  private azureRegion: string;

  // Áudio
  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;
  private currentSource: AudioBufferSourceNode | null = null;

  // Fila de TTS
  private queue: SpeechItem[] = [];
  private isSpeaking: boolean = false;

  // Timestamps para debounce por etiqueta (ex.: 'levelComplete')
  private lastSpokenAt: Record<string, number> = {};

  // Configurações
  private outputFormat: string = 'audio-16khz-128kbitrate-mono-mp3';
  private userAgent: string = 'LudiTEA-App/1.0';

  private constructor() {
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

  // Expor estado atual (para UI)
  getAudioEnabled(): boolean {
    return this.isEnabled;
  }

  toggleAudio(): boolean {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.flushQueue();
      this.pararTodos();
    }
    return this.isEnabled;
  }

  // Inicialização segura (chamar após primeiro clique/toque)
  async forceInitialize(): Promise<void> {
    await this.initializeAudioContext();
  }

  private async initializeAudioContext(): Promise<void> {
    if (this.isInitialized && this.audioContext?.state === 'running') return;

    try {
      // @ts-ignore - webkitAudioContext em iOS
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new Ctx();
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

  // Debounce por etiqueta de evento (ajuda a evitar spam)
  shouldSpeak(tag: string, windowMs: number = 2000): boolean {
    const now = Date.now();
    const last = this.lastSpokenAt[tag] || 0;
    if (now - last < windowMs) return false;
    this.lastSpokenAt[tag] = now;
    return true;
  }

  // Enfileirar fala (prioridade mais alta entra na frente)
  private enqueue(item: SpeechItem) {
    if (!item.text || !item.text.trim()) return;
    // Inserção por prioridade (2 > 1 > 0)
    let inserted = false;
    for (let i = 0; i < this.queue.length; i++) {
      if (item.priority > this.queue[i].priority) {
        this.queue.splice(i, 0, item);
        inserted = true;
        break;
      }
    }
    if (!inserted) this.queue.push(item);
    this.processQueue();
  }

  private flushQueue() {
    this.queue = [];
    this.isSpeaking = false;
  }

  private async processQueue() {
    if (this.isSpeaking) return;
    if (!this.isEnabled) {
      this.flushQueue();
      return;
    }
    const next = this.queue.shift();
    if (!next) return;

    this.isSpeaking = true;

    try {
      const voiceName =
        next.voice === 'mila' ? 'pt-BR-FranciscaNeural' : 'pt-BR-AntonioNeural';
      const buffer = await this.synthesizeAzureSpeech(next.text, voiceName);
      await this.playAudioBuffer(buffer, () => {
        next.onEnd?.();
      });
    } catch (e) {
      console.error('❌ Falha ao falar item da fila:', e);
      next.onEnd?.();
    } finally {
      this.isSpeaking = false;
      // Processa o próximo
      if (this.queue.length > 0) {
        // Pequena pausa entre falas para não parecer colado
        setTimeout(() => this.processQueue(), 120);
      }
    }
  }

  // Fala pública (prioridade normal)
  async falarMila(texto: string, onEnd?: () => void, priority: number = 1): Promise<void> {
    if (!this.isEnabled) {
      onEnd?.();
      return;
    }
    this.enqueue({ text: texto, voice: 'mila', priority, onEnd });
  }

  async falarLeo(texto: string, onEnd?: () => void, priority: number = 1): Promise<void> {
    if (!this.isEnabled) {
      onEnd?.();
      return;
    }
    this.enqueue({ text: texto, voice: 'leo', priority, onEnd });
  }

  // Efeitos sonoros: separados do TTS
  playSoundEffect(soundName: string, volume: number = 0.5): void {
    if (!this.isEnabled) return;
    try {
      const sound = new Audio(`/audio/effects/${soundName}.mp3`);
      sound.volume = volume;
      // Evita bloquear por autoplay (depende de interação prévia)
      sound.play().catch((e) => console.error('Erro ao tocar efeito:', e));
    } catch (error) {
      console.error(`❌ Erro ao carregar o som: ${soundName}`, error);
    }
  }

  pararTodos(): void {
    if (this.currentSource) {
      try {
        this.currentSource.onended = null;
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch {
        // no-op
      }
      this.currentSource = null;
    }
  }

  // ====== Azure TTS ======
  private buildSSML(texto: string, voiceName: string): string {
    // Prosódia levemente lenta e pausas suaves para compreensão
    // Inserimos pequenas pausas após pontos e vírgulas
    const sanitized = texto
      .replace(/\s+/g, ' ')
      .replace(/([,.!?;:])\s*/g, '$1 <break time="300ms"/> ');

    return `
<speak version="1.0" xml:lang="pt-BR">
  <voice name="${voiceName}">
    <prosody rate="85%" pitch="+2st">
      ${sanitized}
    </prosody>
  </voice>
</speak>`.trim();
  }

  private async synthesizeAzureSpeech(texto: string, voiceName: string): Promise<ArrayBuffer> {
    if (!this.azureKey || !this.azureRegion) {
      throw new Error('Azure TTS não configurado');
    }
    const endpoint = `https://${this.azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const ssml = this.buildSSML(texto, voiceName);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.azureKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': this.outputFormat,
          'User-Agent': this.userAgent,
        },
        body: ssml,
      });

      if (!response.ok) {
        const errTxt = await response.text().catch(() => '');
        throw new Error(`Azure TTS Error: ${response.status} - ${errTxt}`);
      }
      return await response.arrayBuffer();
    } catch (error) {
      console.error('❌ Azure TTS Network Error:', error);
      throw error;
    }
  }

  private async playAudioBuffer(buffer: ArrayBuffer, onEnd?: () => void): Promise<void> {
    try {
      await this.initializeAudioContext();
      if (!this.audioContext) throw new Error('AudioContext não disponível');

      // Para a fala anterior (não afeta efeitos sonoros via <audio>)
      this.pararTodos();

      const audioBuffer = await this.decodeArrayBuffer(buffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      this.currentSource = source;

      source.onended = () => {
        if (this.currentSource === source) {
          this.currentSource = null;
        }
        onEnd?.();
      };

      source.start(0);
    } catch (error) {
      console.error('❌ Erro ao reproduzir áudio:', error);
      this.currentSource = null;
      onEnd?.();
    }
  }

  private async decodeArrayBuffer(buffer: ArrayBuffer): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('AudioContext não disponível');
    // Em alguns navegadores, decodeAudioData com Promise exige cópia
    return await new Promise((resolve, reject) => {
      try {
        const cloned = buffer.slice(0);
        // @ts-ignore - assinaturas diferentes em browsers
        this.audioContext!.decodeAudioData(
          cloned,
          (decoded: AudioBuffer) => resolve(decoded),
          (err: any) => reject(err)
        );
      } catch (e) {
        reject(e);
      }
    });
  }
}
