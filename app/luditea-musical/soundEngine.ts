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
    
    // MAPEAMENTO CORRIGIDO - IDs devem bater com o page.tsx
    const soundFiles = {
      guitar: '/sounds/guitarra-rock-loop.wav',
      drums: '/sounds/bateria-loop.wav',
      piano: '/sounds/piano-loop.wav',
      saxofone: '/sounds/saxofone-loop.wav',  // CORRIGIDO
      violin: '/sounds/violino-loop.wav',
      shaker: '/sounds/chocalho-loop.wav',
      coral: '/sounds/coral-loop.wav',        // CORRIGIDO
      flauta: '/sounds/flauta-loop.wav',      // CORRIGIDO
      tambor: '/sounds/tambor-tribal-loop.wav', // CORRIGIDO
      violao: '/sounds/violao-loop.wav',      // CORRIGIDO
      synth: '/sounds/sintetizador-loop.wav',
      cymbal: '/sounds/prato-loop.wav',
      tambourine: '/sounds/tamborin-loop.wav'
    };
    
    for (const [name, url] of Object.entries(soundFiles)) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.buffers.set(name, audioBuffer);
        console.log(`✅ Som carregado: ${name}`);
      } catch (error) {
        console.error(`❌ Erro ao carregar ${name}:`, error);
      }
    }
    
    console.log('🎵 Total de sons carregados:', this.buffers.size);
  }
  
  startInstrumentLoop(instrumentId: string) {
    if (!this.audioContext) return;
    
    const buffer = this.buffers.get(instrumentId);
    if (!buffer) {
      console.log(`❌ Som não encontrado: ${instrumentId}`);
      return;
    }
    
    this.stopInstrumentLoop(instrumentId);
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;  // LOOP ATIVADO!
    source.connect(this.audioContext.destination);
    source.start(0);
    
    this.sources.set(instrumentId, source);
    console.log(`▶️ Tocando: ${instrumentId}`);
  }
  
  stopInstrumentLoop(instrumentId: string) {
    const source = this.sources.get(instrumentId);
    if (source) {
      source.stop();
      this.sources.delete(instrumentId);
      console.log(`⏹️ Parado: ${instrumentId}`);
    }
  }
  
  stopAll() {
    this.sources.forEach((source, id) => {
      source.stop();
      console.log(`⏹️ Parando: ${id}`);
    });
    this.sources.clear();
  }
  
  playFeedback(type: 'select' | 'place' | 'remove') {
    if (!this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    switch(type) {
      case 'select':
        osc.frequency.value = 523.25;
        gain.gain.value = 0.3;
        break;
      case 'place':
        osc.frequency.value = 659.25;
        gain.gain.value = 0.4;
        break;
      case 'remove':
        osc.frequency.value = 392;
        gain.gain.value = 0.2;
        break;
    }
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }
}
