// utils/gameAudioManager.ts
type SpeechItem = {
  text: string;
  voice: 'mila' | 'leo';
  priority: number;
  onEnd?: () => void;
};

type VoiceProfile = 'neutral' | 'soft';

export class GameAudioManager {
  private static instance: GameAudioManager;

  private isEnabled: boolean = true;
  private azureKey: string;
  private azureRegion: string;

  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;
  private currentSource: AudioBufferSourceNode | null = null;

  private queue: SpeechItem[] = [];
  private isSpeaking: boolean = false;
  private lastSpokenAt: Record<string, number> = {};

  private outputFormat: string = 'audio-24khz-160kbitrate-mono-mp3';
  private userAgent: string = 'LudiTEA-App/1.0';

  // Perfil de voz (padrão neutro e seguro)
  private milaProfile: VoiceProfile = 'neutral';

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

  // Permite alternar perfis se quiser testar depois
  setMilaProfile(profile: VoiceProfile) {
    this.milaProfile = profile;
  }

  async forceInitialize(): Promise<void> {
    await this.initializeAudioContext();
  }

  private async initializeAudioContext(): Promise<void> {
    if (this.isInitialized && this.audioContext?.state === 'running') return;
    try {
      // @ts-ignore
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

  shouldSpeak(tag: string, windowMs: number = 2000): boolean {
    const now = Date.now();
    const last = this.lastSpokenAt[tag] || 0;
    if (now - last < windowMs) return false;
    this.lastSpokenAt[tag] = now;
    return true;
  }

  private enqueue(item: SpeechItem) {
    if (!item.text || !item.text.trim()) return;
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
      const voiceName = next.voice === 'mila' ? 'pt-BR-FranciscaNeural' : 'pt-BR-AntonioNeural';
      const buffer = await this.synthesizeAzureSpeech(next.text, voiceName);
      await this.playAudioBuffer(buffer, () => next.onEnd?.());
    } catch (e) {
      console.error('❌ Falha ao falar item da fila:', e);
      next.onEnd?.();
    } finally {
      this.isSpeaking = false;
      if (this.queue.length > 0) setTimeout(() => this.processQueue(), 120);
    }
  }

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

  playSoundEffect(soundName: string, volume: number = 0.5): void {
    if (!this.isEnabled) return;
    try {
      const sound = new Audio(`/audio/effects/${soundName}.mp3`);
      sound.volume = volume;
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
      } catch {}
      this.currentSource = null;
    }
  }

  // ====== Azure TTS ======
  private buildSSML(texto: string, voiceName: string): string {
    const sanitized = texto.replace(/\s+/g, ' ').trim();

    // Perfil neutro: leve ajuste de rate, pitch neutro
    if (this.milaProfile === 'neutral' && voiceName === 'pt-BR-FranciscaNeural') {
      return `
<speak version="1.0" xml:lang="pt-BR">
  <voice name="${voiceName}">
    <prosody rate="85%" pitch="+0st">
      ${sanitized}
    </prosody>
  </voice>
</speak>`.trim();
    }

    // Perfil suave (opcional): um pouco mais lento, sem mexer em pitch
    if (this.milaProfile === 'soft' && voiceName === 'pt-BR-FranciscaNeural') {
      return `
<speak version="1.0" xml:lang="pt-BR">
  <voice name="${voiceName}">
    <prosody rate="80%" pitch="+0st">
      ${sanitized}
    </prosody>
  </voice>
</speak>`.trim();
    }

    // Leo e demais vozes: neutro
    return `
<speak version="1.0" xml:lang="pt-BR">
  <voice name="${voiceName}">
    <prosody rate="100%" pitch="+0st">
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
      this.pararTodos();
      const audioBuffer = await this.decodeArrayBuffer(buffer);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      this.currentSource = source;
      source.onended = () => {
        if (this.currentSource === source) this.currentSource = null;
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
    return await new Promise((resolve, reject) => {
      try {
        const cloned = buffer.slice(0);
        // @ts-ignore
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
