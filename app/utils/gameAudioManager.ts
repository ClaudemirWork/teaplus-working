// Arquivo: utils/gameAudioManager.ts

export class GameAudioManager {
  private static instance: GameAudioManager;
  private isEnabled: boolean = true;
  
  // ✅ CORREÇÃO: Ler as variáveis de ambiente
  private azureKey: string;
  private azureRegion: string;

  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;

  constructor() {
    // ✅ CORREÇÃO: Atribuir as variáveis no construtor
    this.azureKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || '';
    this.azureRegion = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || '';

    console.log('🔊 GameAudioManager inicializado');

    // ✅ CORREÇÃO: Adicionar verificação se as chaves existem
    if (!this.azureKey || !this.azureRegion) {
      console.error('❌ ERRO CRÍTICO: Chaves do Azure não encontradas nas variáveis de ambiente!');
      console.log('Verifique seu arquivo .env.local ou as configurações do Netlify.');
    } else {
      console.log('Azure Key válida:', this.azureKey.substring(0, 4) + '...');
      console.log('Azure Region:', this.azureRegion);
    }
  }

  // ... o resto do arquivo pode continuar igual
  // ...
}
