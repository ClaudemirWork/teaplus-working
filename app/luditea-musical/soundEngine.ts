export class SoundEngine {
  private audioContext: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private sources: Map<string, AudioBufferSourceNode> = new Map();
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.loadAllSounds();
    }
  }
  
  async loadAllSounds() {
    if (!this.audioContext) return;
    
    const soundFiles = {
      guitar: '/sounds/guitarra-loop.wav',
      drums: '/sounds/bateria-loop.wav',
      piano: '/sounds/piano-loop.wav',
      trumpet: '/sounds/sintetizador-loop.wav',
      violin: '/sounds/violino-loop.wav',
      shaker: '/sounds/chocalho-loop.wav',
      synth: '/sounds/sintetizador-loop.wav',
      cymbal: '/sounds/prato-loop.wav',
      tambourine: '/sounds/tamborin-loop.wav',
      bass: '/sounds/bateria-loop.wav'
    };
    
    for (const [name, url] of Object.entries(soundFiles)) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.buffers.set(name, audioBuffer);
      } catch (error) {
        console.error(`Erro: ${name}`, error);
      }
    }
  }
  
  startInstrumentLoop(instrumentId: string) {
    if (!this.audioContext) return;
    
    const buffer = this.buffers.get(instrumentId);
    if (!buffer) return;
    
    this.stopInstrumentLoop(instrumentId);
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.audioContext.destination);
    source.start(0);
    
    this.sources.set(instrumentId, source);
  }
  
  stopInstrumentLoop(instrumentId: string) {
    const source = this.sources.get(instrumentId);
    if (source) {
      source.stop();
      this.sources.delete(instrumentId);
    }
  }
  
  stopAll() {
    this.sources.forEach(source => source.stop());
    this.sources.clear();
  }
  
  playFeedback(type: string) {
    // Já está implementado
  }
}
