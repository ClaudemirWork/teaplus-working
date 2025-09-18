// utils/gameAudioManager.ts
type SpeechItem = { text: string; voice: 'mila' | 'leo'; priority: number; onEnd?: () => void; };

export class GameAudioManager {
  private static instance: GameAudioManager;
  private isEnabled = true;
  private azureKey: string;
  private azureRegion: string;

  private audioContext: AudioContext | null = null;
  private isInitialized = false;
  private currentSource: AudioBufferSourceNode | null = null;

  private queue: SpeechItem[] = [];
  private isSpeaking = false;
  private lastSpokenAt: Record<string, number> = {};
  private outputFormat = 'audio-24khz-160kbitrate-mono-mp3';
  private userAgent = 'LudiTEA-App/1.0';

  static getInstance(): GameAudioManager {
    if (!GameAudioManager.instance) GameAudioManager.instance = new GameAudioManager();
    return GameAudioManager.instance;
  }

  private constructor() {
    this.azureKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '';
    this.azureRegion = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || '';
  }

  getAudioEnabled() { return this.isEnabled; }
  toggleAudio() { this.isEnabled = !this.isEnabled; if (!this.isEnabled) { this.flushQueue(); this.pararTodos(); } return this.isEnabled; }

  async forceInitialize() { await this.initializeAudioContext(); }
  private async initializeAudioContext() {
    if (this.isInitialized && this.audioContext?.state === 'running') return;
    // @ts-ignore
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!this.audioContext || this.audioContext.state === 'closed') this.audioContext = new Ctx();
    if (this.audioContext.state === 'suspended') await this.audioContext.resume();
    this.isInitialized = true;
  }

  shouldSpeak(tag: string, windowMs = 2000) {
    const now = Date.now(); const last = this.lastSpokenAt[tag] || 0;
    if (now - last < windowMs) return false; this.lastSpokenAt[tag] = now; return true;
  }

  private enqueue(item: SpeechItem) {
    if (!item.text?.trim()) return;
    let i = 0, inserted = false;
    for (; i < this.queue.length; i++) if (item.priority > this.queue[i].priority) { this.queue.splice(i, 0, item); inserted = true; break; }
    if (!inserted) this.queue.push(item);
    this.processQueue();
  }
  private flushQueue() { this.queue = []; this.isSpeaking = false; }

  private async processQueue() {
    if (this.isSpeaking) return;
    if (!this.isEnabled) { this.flushQueue(); return; }
    const next = this.queue.shift(); if (!next) return;
    this.isSpeaking = true;
    try {
      const voiceName = next.voice === 'mila' ? 'pt-BR-FranciscaNeural' : 'pt-BR-AntonioNeural';
      const buffer = await this.synthesizeAzureSpeech(next.text, voiceName);
      await this.playAudioBuffer(buffer, () => next.onEnd?.());
    } catch (e) { next.onEnd?.(); }
    finally {
      this.isSpeaking = false;
      if (this.queue.length > 0) setTimeout(() => this.processQueue(), 250); // pausa entre falas
    }
  }

  async falarMila(texto: string, onEnd?: () => void, priority = 1) {
    if (!this.isEnabled) { onEnd?.(); return; }
    this.enqueue({ text: texto, voice: 'mila', priority, onEnd });
  }
  async falarLeo(texto: string, onEnd?: () => void, priority = 1) {
    if (!this.isEnabled) { onEnd?.(); return; }
    this.enqueue({ text: texto, voice: 'leo', priority, onEnd });
  }

  playSoundEffect(soundName: string, volume = 0.5) {
    if (!this.isEnabled) return;
    const sound = new Audio(`/audio/effects/${soundName}.mp3`);
    sound.volume = volume; sound.play().catch(() => {});
  }
  pararTodos() {
    if (this.currentSource) { try { this.currentSource.onended = null; this.currentSource.stop(); this.currentSource.disconnect(); } catch {} this.currentSource = null; }
  }

  private buildSSML(texto: string, voiceName: string) {
    const sanitized = texto.replace(/\s+/g, ' ').trim();
    // Francisca mais calma e natural
    const mila = `
<speak version="1.0" xml:lang="pt-BR">
  <voice name="${voiceName}">
    <prosody rate="68%" pitch="+0st">
      ${sanitized}
    </prosody>
  </voice>
</speak>`.trim();

    // Leo neutro
    const leo = `
<speak version="1.0" xml:lang="pt-BR">
  <voice name="${voiceName}">
    <prosody rate="95%" pitch="+0st">
      ${sanitized}
    </prosody>
  </voice>
</speak>`.trim();

    return voiceName === 'pt-BR-FranciscaNeural' ? mila : leo;
  }

  private async synthesizeAzureSpeech(texto: string, voiceName: string) {
    if (!this.azureKey || !this.azureRegion) throw new Error('Azure TTS não configurado');
    const endpoint = `https://${this.azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const ssml = this.buildSSML(texto, voiceName);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': this.azureKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': this.outputFormat,
        'User-Agent': this.userAgent,
      },
      body: ssml,
    });
    if (!res.ok) throw new Error(`Azure TTS Error: ${res.status} - ${await res.text().catch(()=> '')}`);
    return await res.arrayBuffer();
  }

  private async playAudioBuffer(buffer: ArrayBuffer, onEnd?: () => void) {
    await this.initializeAudioContext();
    if (!this.audioContext) throw new Error('AudioContext não disponível');
    this.pararTodos();
    const audioBuffer = await this.decodeArrayBuffer(buffer);
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer; source.connect(this.audioContext.destination);
    this.currentSource = source;
    source.onended = () => { if (this.currentSource === source) this.currentSource = null; onEnd?.(); };
    source.start(0);
  }

  private async decodeArrayBuffer(buffer: ArrayBuffer): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('AudioContext não disponível');
    return await new Promise((resolve, reject) => {
      const cloned = buffer.slice(0);
      // @ts-ignore
      this.audioContext!.decodeAudioData(cloned, (d: AudioBuffer) => resolve(d), (e: any) => reject(e));
    });
  }
}
