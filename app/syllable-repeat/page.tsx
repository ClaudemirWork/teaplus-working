'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Volume2, Mic, MicOff, Star, Trophy } from 'lucide-react';

// Mapeamento das sílabas conforme os arquivos existentes
const syllableMap: { [letter: string]: string[] } = {
  A: ['a', 'e', 'i', 'o', 'u'], // Vogais primeiro
  B: ['ba', 'bê', 'bi', 'bó', 'bu', 'bô'],
  C: ['ca', 'cê', 'ci', 'co', 'cu'],
  D: ['da', 'dê', 'di', 'dó', 'du', 'dô'],
  F: ['fa', 'fe', 'fi', 'fo', 'fu'],
  G: ['ga', 'ge', 'gi', 'go', 'gu'],
  J: ['já', 'jê', 'ji', 'jó', 'ju', 'jô'],
  L: ['la', 'le', 'li', 'ló', 'lu', 'lé'],
  M: ['ma', 'me', 'mi', 'mo', 'mu'],
  N: ['na', 'né', 'ni', 'nó', 'nu', 'nê'],
  P: ['pa', 'pê', 'pi', 'pó', 'pu'],
  R: ['ra', 're', 'ri', 'ro', 'ru'],
  S: ['sa', 'se', 'si', 'so', 'su', 'sô'],
  T: ['ta', 'tê', 'ti', 'tó', 'tu', 'tô'],
  V: ['va', 'vê', 'vi', 'vó', 'vu', 'vô'],
};

interface GameStats {
  score: number;
  totalAttempts: number;
  successfulAttempts: number;
  streak: number;
  maxStreak: number;
  starsEarned: number;
}

export default function SpeechPracticeGame() {
  // Estados principais
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Estados de progresso
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const letters = Object.keys(syllableMap);
  const currentLetter = letters[currentLetterIndex] || 'A';
  const syllables = syllableMap[currentLetter] || [];
  const currentSyllable = syllables[currentSyllableIndex] || 'a';
  
  // Estados de áudio
  const [listening, setListening] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const [playbackRate, setPlaybackRate] = useState(1.0);
  
  // Estados de gamificação
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    totalAttempts: 0,
    successfulAttempts: 0,
    streak: 0,
    maxStreak: 0,
    starsEarned: 0
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  
  // Estados salvos
  const [totalStarsCollected, setTotalStarsCollected] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  
  // Referências
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Carrega dados salvos
  useEffect(() => {
    const savedStars = localStorage.getItem('speechGame_totalStars');
    const savedBest = localStorage.getItem('speechGame_bestStreak');
    
    if (savedStars) setTotalStarsCollected(parseInt(savedStars));
    if (savedBest) setBestStreak(parseInt(savedBest));
  }, []);

  // Configuração do microfone
  useEffect(() => {
    async function setupMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.8;
        
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        mediaStreamRef.current = stream;
      } catch (error) {
        console.error('Erro ao acessar microfone:', error);
        setMessage('Erro ao acessar microfone. Verifique as permissões.');
      }
    }
    
    setupMic();
    
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkSpeech = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    const dataArray = dataArrayRef.current;
    let totalVolume = 0;
    let peakVolume = 0;
    let speechFrequencies = 0;
    
    for (let i = 10; i < 100; i++) {
      totalVolume += dataArray[i];
      if (dataArray[i] > peakVolume) peakVolume = dataArray[i];
      if (dataArray[i] > 30) speechFrequencies++;
    }
    
    const avgVolume = totalVolume / 90;
    const speechRatio = speechFrequencies / 90;
    
    if (avgVolume > 25 && peakVolume > 50 && speechRatio > 0.3) {
      handleSpeechDetected();
    } else {
      rafIdRef.current = requestAnimationFrame(checkSpeech);
    }
  };

  const handleSpeechDetected = () => {
    setListening(false);
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    
    const points = 10 + (gameStats.streak * 5) + (playbackRate < 1 ? 5 : 0);
    
    setGameStats(prev => ({
      ...prev,
      score: prev.score + points,
      totalAttempts: prev.totalAttempts + 1,
      successfulAttempts: prev.successfulAttempts + 1,
      streak: prev.streak + 1,
      maxStreak: Math.max(prev.maxStreak, prev.streak + 1),
      starsEarned: prev.starsEarned + Math.floor(points / 20)
    }));
    
    if (gameStats.streak >= 4) {
      setCelebrationMessage('🔥 INCRÍVEL! Sequência perfeita!');
    } else if (gameStats.streak >= 2) {
      setCelebrationMessage('✨ Muito bem! Continue assim!');
    } else {
      setCelebrationMessage('👏 Ótimo! Você conseguiu!');
    }
    
    setShowCelebration(true);
    playSuccessSound();
    
    setTimeout(() => {
      setShowCelebration(false);
      nextSyllable();
    }, 2000);
  };

  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Falha silenciosa
    }
  };

  const startListening = () => {
    if (!analyserRef.current) {
      setMessage('Microfone não está disponível');
      return;
    }
    
    setListening(true);
    setMessage('🎤 Agora é sua vez! Repita a sílaba!');
    rafIdRef.current = requestAnimationFrame(checkSpeech);
  };

  const stopListening = () => {
    setListening(false);
    setMessage('');
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
  };

  const playAudio = () => {
    if (!audioRef.current || audioPlaying) return;
    
    setAudioPlaying(true);
    setMessage('🔊 Escute com atenção...');
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.play().catch(error => {
      console.error('Erro ao reproduzir áudio:', error);
      setMessage('Erro ao reproduzir áudio. Tente novamente.');
      setAudioPlaying(false);
    });
  };

  const onAudioEnded = () => {
    setAudioPlaying(false);
    setMessage('✨ Perfeito! Agora clique no microfone e repita!');
  };

  const nextSyllable = () => {
    if (currentSyllableIndex + 1 < syllables.length) {
      setCurrentSyllableIndex(currentSyllableIndex + 1);
    } else if (currentLetterIndex + 1 < letters.length) {
      setCurrentLetterIndex(currentLetterIndex + 1);
      setCurrentSyllableIndex(0);
      
      setGameStats(prev => ({
        ...prev,
        score: prev.score + 50,
        starsEarned: prev.starsEarned + 2
      }));
      
      setCelebrationMessage('🌟 Letra completa! Bônus de 50 pontos!');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    } else {
      completeGame();
    }
    
    setMessage('');
  };

  const completeGame = () => {
    setIsPlaying(false);
    setShowResults(true);
    
    const newStars = totalStarsCollected + gameStats.starsEarned;
    setTotalStarsCollected(newStars);
    localStorage.setItem('speechGame_totalStars', newStars.toString());
    
    if (gameStats.maxStreak > bestStreak) {
      setBestStreak(gameStats.maxStreak);
      localStorage.setItem('speechGame_bestStreak', gameStats.maxStreak.toString());
    }
  };

  const startGame = () => {
    setCurrentScreen('game');
    setIsPlaying(true);
    setShowResults(false);
    setCurrentLetterIndex(0);
    setCurrentSyllableIndex(0);
    setGameStats({
      score: 0,
      totalAttempts: 0,
      successfulAttempts: 0,
      streak: 0,
      maxStreak: 0,
      starsEarned: 0
    });
    setMessage('');
  };

  const restartGame = () => {
    startGame();
  };

  const goToTitle = () => {
    setCurrentScreen('title');
    setIsPlaying(false);
    setShowResults(false);
    stopListening();
  };

  // Gerar caminho do áudio
  const getAudioPath = () => {
    if (currentLetter === 'A') {
      return `/audio/syllables/${currentSyllable}.mp3`;
    } else {
      return `/audio/syllables/essenciais/${currentLetter}/${currentSyllable}.mp3`;
    }
  };

  // Tela do título
  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Star className="w-6 h-6 text-white opacity-30" fill="currentColor" />
          </div>
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 animate-bounce-slow">
          <img 
            src="/images/mascotes/Leo_mila_conversa.webp" 
            alt="Leo e Mila conversando" 
            className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl rounded-full" 
          />
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
          Minha Fala
        </h1>
        
        <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-6 drop-shadow-md">
          🗣️ Pratique sílabas de forma divertida! 🎯
        </p>
        
        {(totalStarsCollected > 0 || bestStreak > 0) && (
          <div className="bg-white/80 rounded-2xl p-4 mb-6 shadow-xl">
            <div className="flex items-center gap-4">
              {totalStarsCollected > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                  <span className="font-bold text-purple-800">{totalStarsCollected} estrelas</span>
                </div>
              )}
              {bestStreak > 0 && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  <span className="font-bold text-purple-800">Sequência: {bestStreak}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setCurrentScreen('instructions')} 
          className="text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1"
        >
          Vamos Praticar!
        </button>
      </div>
    </div>
  );

  // Tela de instruções
  const InstructionsScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-purple-600">Como Funciona</h2>
        
        <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
          <p className="flex items-center gap-4">
            <span className="text-4xl">🔊</span>
            <span><b>Ouça a sílaba</b> - Clique no botão para escutar</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🎤</span>
            <span><b>Repita em voz alta</b> - Fale claramente no microfone</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">⭐</span>
            <span><b>Ganhe pontos</b> - Cada acerto vale pontos e estrelas!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🔄</span>
            <span><b>Velocidade</b> - Ajuste para ouvir mais devagar</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🏆</span>
            <span><b>Sequências</b> - Acerte seguido para bônus especiais!</span>
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-semibold">
            💡 Dica: Fale bem próximo ao microfone e de forma clara!
          </p>
        </div>
        
        <button 
          onClick={startGame} 
          className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform"
        >
          Começar Prática! 🚀
        </button>
      </div>
    </div>
  );

  // Tela do jogo
  const GameScreen = () => {
    const audioSrc = getAudioPath();
    const progress = ((currentLetterIndex * syllables.length + currentSyllableIndex + 1) / 
                     (letters.length * syllables.length)) * 100;
    
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={goToTitle}
                className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
              </button>

              <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                🗣️
                <span>Minha Fala</span>
              </h1>

              <div className="w-24"></div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-4xl mx-auto">
          {!showResults ? (
            <div className="space-y-6">
              {/* Área do jogo principal */}
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl shadow-lg p-8 text-center overflow-hidden"
                   style={{ minHeight: '500px' }}>

                {/* Celebração */}
                {showCelebration && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="bg-white/95 rounded-3xl p-6 shadow-2xl animate-bounce">
                      <div className="text-4xl mb-2">🎉</div>
                      <div className="text-lg font-bold text-purple-600">
                        {celebrationMessage}
                      </div>
                    </div>
                  </div>
                )}

                {/* Conteúdo principal */}
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-purple-800 mb-4">
                    {currentLetter === 'A' ? 'Vogais' : `Letra ${currentLetter}`} - 
                    Sílaba {currentSyllableIndex + 1} de {syllables.length}
                  </h2>
                  
                  <div className="text-8xl font-bold text-purple-600 mb-6 animate-pulse">
                    {currentSyllable}
                  </div>

                  {/* Instruções visuais */}
                  <div className="mb-6 bg-white/80 rounded-2xl p-4">
                    <div className="flex items-center justify-center gap-8 text-sm">
                      <div className="flex flex-col items-center">
                        <div className="text-2xl mb-1">👂</div>
                        <div className="font-bold">1. Escutar</div>
                      </div>
                      <div className="text-2xl">→</div>
                      <div className="flex flex-col items-center">
                        <div className="text-2xl mb-1">🎤</div>
                        <div className="font-bold">2. Repetir</div>
                      </div>
                      <div className="text-2xl">→</div>
                      <div className="flex flex-col items-center">
                        <div className="text-2xl mb-1">🎉</div>
                        <div className="font-bold">3. Celebrar</div>
                      </div>
                    </div>
                  </div>

                  {/* Controles de áudio */}
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <audio
                      ref={audioRef}
                      src={audioSrc}
                      preload="auto"
                      onEnded={onAudioEnded}
                    />
                    
                    <button
                      onClick={playAudio}
                      disabled={audioPlaying || listening}
                      className={`flex items-center gap-2 px-8 py-4 rounded-full text-xl font-bold transition-all ${
                        audioPlaying || listening
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 animate-pulse'
                      }`}
                    >
                      <Volume2 className="w-6 h-6" />
                      {audioPlaying ? 'Reproduzindo...' : 'Ouvir Sílaba'}
                    </button>

                    {/* Controle de velocidade */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Velocidade:</span>
                      <select
                        value={playbackRate}
                        onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        disabled={audioPlaying || listening}
                      >
                        <option value="0.5">0.5x (Muito Lento)</option>
                        <option value="0.75">0.75x (Lento)</option>
                        <option value="1.0">1.0x (Normal)</option>
                        <option value="1.25">1.25x (Rápido)</option>
                      </select>
                    </div>
                  </div>

                  {/* Botão do microfone */}
                  <div className="mb-6">
                    {!listening ? (
                      <button
                        onClick={startListening}
                        disabled={audioPlaying}
                        className={`flex items-center gap-2 px-8 py-4 rounded-full text-xl font-bold transition-all ${
                          audioPlaying
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 animate-pulse'
                        }`}
                      >
                        <Mic className="w-6 h-6" />
                        Repetir Sílaba
                      </button>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={stopListening}
                          className="flex items-center gap-2 px-8 py-4 rounded-full text-xl font-bold bg-red-500 text-white hover:bg-red-600 animate-pulse"
                        >
                          <Mic className="w-6 h-6 animate-bounce" />
                          Escutando... Fale agora!
                        </button>
                        <button
                          onClick={stopListening}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                        >
                          Parar
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Mensagem de status */}
                  {message && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-lg font-bold text-blue-800">
                      {message}
                    </div>
                  )}
                </div>
              </div>

              {/* Estatísticas */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{gameStats.score}</div>
                    <div className="text-xs text-gray-500">Pontos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{gameStats.streak}</div>
                    <div className="text-xs text-gray-500">Sequência</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{gameStats.starsEarned}</div>
                    <div className="text-xs text-gray-500">Estrelas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {gameStats.totalAttempts > 0 ? Math.round((gameStats.successfulAttempts / gameStats.totalAttempts) * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-500">Precisão</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">{gameStats.maxStreak}</div>
                    <div className="text-xs text-gray-500">Melhor</div>
                  </div>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Progresso Geral</span>
                  <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            // Tela de resultados
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-3xl font-bold text-purple-600 mb-4">Parabéns!</h3>
              <p className="text-lg text-gray-600 mb-6">
                Você completou todas as sílabas!
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{gameStats.score}</div>
                  <div className="text-sm text-purple-500">Pontos Totais</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{gameStats.maxStreak}</div>
                  <div className="text-sm text-green-500">Melhor Sequência</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">{gameStats.starsEarned}</div>
                  <div className="text-sm text-yellow-500">Estrelas Ganhas</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((gameStats.successfulAttempts / gameStats.totalAttempts) * 100) || 0}%
                  </div>
                  <div className="text-sm text-blue-500">Precisão</div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={restartGame}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform"
                >
                  🔄 Praticar Novamente
                </button>
                <button
                  onClick={goToTitle}
                  className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  🏠 Início
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  // Renderização condicional
  if (currentScreen === 'title') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
}
