// Sistema de Som para o Desafio Musical
export class SoundEngine {
  private audioContext: AudioContext | null = null;
  private isPlaying: boolean = false;
  private oscillators: Map<string, OscillatorNode> = new Map();
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }
  
  // Sons simples para cada instrumento
  private instrumentNotes: Record<string, number> = {
    guitar: 329.63,    // E4
    drums: 100,        // Som grave
    piano: 261.63,     // C4
    trumpet: 440,      // A4
    violin: 493.88,    // B4
    shaker: 800,       // Som agudo
    synth: 196,        // G3
    cymbal: 1000,      // Som muito agudo
    tambourine: 600,   // Som médio-agudo
    bass: 82.41,       // E2 - Bem grave
  };
  
  // Toca um som de feedback rápido
  playFeedback(type: 'select' | 'place' | 'remove') {
    if (!this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    switch(type) {
      case 'select':
        osc.frequency.value = 523.25; // C5
        gain.gain.value = 0.3;
        break;
      case 'place':
        osc.frequency.value = 659.25; // E5
        gain.gain.value = 0.4;
        break;
      case 'remove':
        osc.frequency.value = 392; // G4
        gain.gain.value = 0.2;
        break;
    }
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }
  
  // Inicia um loop para um instrumento
  startInstrumentLoop(instrumentId: string) {
    if (!this.audioContext || this.oscillators.has(instrumentId)) return;
    
    const frequency = this.instrumentNotes[instrumentId] || 440;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    // Tipo de onda baseado no instrumento
    switch(instrumentId) {
      case 'guitar':
      case 'violin':
        osc.type = 'sawtooth';
        break;
      case 'piano':
      case 'synth':
        osc.type = 'triangle';
        break;
      case 'trumpet':
        osc.type = 'square';
        break;
      default:
        osc.type = 'sine';
    }
    
    osc.frequency.value = frequency;
    gain.gain.value = 0.2; // Volume baixo para não incomodar
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    
    this.oscillators.set(instrumentId, osc);
  }
  
  // Para um instrumento específico
  stopInstrumentLoop(instrumentId: string) {
    const osc = this.oscillators.get(instrumentId);
    if (osc) {
      osc.stop();
      this.oscillators.delete(instrumentId);
    }
  }
  
  // Para todos os sons
  stopAll() {
    this.oscillators.forEach(osc => osc.stop());
    this.oscillators.clear();
    this.isPlaying = false;
  }
  
  // Inicia a música com todos os instrumentos ativos
  startMusic() {
    this.isPlaying = true;
  }
  
  // Pausa a música
  pauseMusic() {
    this.isPlaying = false;
    this.stopAll();
  }
  
  getIsPlaying() {
    return this.isPlaying;
  }
}
