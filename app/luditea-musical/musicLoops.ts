import * as Tone from 'tone';

export class MusicLoops {
  private players: Map<string, Tone.Player> = new Map();
  private isInitialized = false;
  
  // URLs de sons gratuitos do Freesound (você precisa baixar e colocar em public/sounds/)
  private soundUrls: Record<string, string> = {
    guitar: '/sounds/guitar-loop.mp3',
    drums: '/sounds/drum-beat.mp3',
    piano: '/sounds/piano-melody.mp3',
    trumpet: '/sounds/trumpet-riff.mp3',
    violin: '/sounds/violin-loop.mp3',
    shaker: '/sounds/shaker-rhythm.mp3',
    synth: '/sounds/synth-bass.mp3',
    cymbal: '/sounds/cymbal-hit.mp3',
    tambourine: '/sounds/tambourine-shake.mp3',
    bass: '/sounds/bass-groove.mp3'
  };
  
  async initialize() {
    if (this.isInitialized) return;
    
    await Tone.start();
    Tone.Transport.bpm.value = 120;
    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = "2m";
    
    // Por enquanto, vamos criar ritmos com síntese
    this.createDrumPattern();
    this.createBassPattern();
    this.createMelodyPattern();
    
    this.isInitialized = true;
  }
  
  // Criar padrão de bateria
  private createDrumPattern() {
    const kick = new Tone.MembraneSynth().toDestination();
    const snare = new Tone.NoiseSynth().toDestination();
    
    const kickPattern = new Tone.Pattern((time) => {
      kick.triggerAttackRelease("C1", "8n", time);
    }, ["0", "0", null, "0"], "16n");
    
    const snarePattern = new Tone.Pattern((time) => {
      snare.triggerAttackRelease("8n", time);
    }, [null, null, "0", null], "16n");
    
    this.players.set('drums_kick', kickPattern as any);
    this.players.set('drums_snare', snarePattern as any);
  }
  
  // Criar padrão de baixo
  private createBassPattern() {
    const bass = new Tone.Synth({
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
    }).toDestination();
    
    const bassPattern = new Tone.Pattern((time, note) => {
      bass.triggerAttackRelease(note, "8n", time);
    }, ["C2", "C2", "G2", "Bb2"], "8n");
    
    this.players.set('bass', bassPattern as any);
  }
  
  // Criar melodia
  private createMelodyPattern() {
    const synth = new Tone.PolySynth().toDestination();
    
    const melody = new Tone.Pattern((time, note) => {
      synth.triggerAttackRelease(note, "16n", time);
    }, ["C4", "E4", "G4", "B4", "C5", "B4", "G4", "E4"], "16n");
    
    this.players.set('piano', melody as any);
  }
  
  async startInstrument(instrumentId: string) {
    await this.initialize();
    
    const player = this.players.get(instrumentId);
    if (player && 'start' in player) {
      (player as any).start();
    }
    
    // Se for bateria, inicia kick e snare
    if (instrumentId === 'drums') {
      const kick = this.players.get('drums_kick');
      const snare = this.players.get('drums_snare');
      if (kick) (kick as any).start();
      if (snare) (snare as any).start();
    }
  }
  
  stopInstrument(instrumentId: string) {
    const player = this.players.get(instrumentId);
    if (player && 'stop' in player) {
      (player as any).stop();
    }
    
    if (instrumentId === 'drums') {
      const kick = this.players.get('drums_kick');
      const snare = this.players.get('drums_snare');
      if (kick) (kick as any).stop();
      if (snare) (snare as any).stop();
    }
  }
  
  async startAll() {
    await this.initialize();
    Tone.Transport.start();
  }
  
  stopAll() {
    Tone.Transport.stop();
    this.players.forEach(player => {
      if ('stop' in player) {
        (player as any).stop();
      }
    });
  }
}
