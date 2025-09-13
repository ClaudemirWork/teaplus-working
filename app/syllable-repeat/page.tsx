'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Volume2, Mic, Star, Trophy } from 'lucide-react';

// Mapeamento das sílabas
const syllableMap: { [letter: string]: string[] } = {
  A: ['a', 'e', 'i', 'o', 'u'],
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

export default function SpeechPracticeGame() {
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [totalStarsCollected, setTotalStarsCollected] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [listening, setListening] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showCelebration, setCelebrationMessage] = useState('');
  const [showResults, setShowResults] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const letters = Object.keys(syllableMap);
  const currentLetter = letters[currentLetterIndex] || 'A';
  const syllables = syllableMap[currentLetter] || [];
  const currentSyllable = syllables[currentSyllableIndex] || 'a';

  // Carrega dados salvos
  useEffect(() => {
    try {
      const savedStars = localStorage.getItem('speechGame_totalStars');
      const savedBest = localStorage.getItem('speechGame_bestStreak');
      if (savedStars) setTotalStarsCollected(parseInt(savedStars));
      if (savedBest) setBestStreak(parseInt(savedBest));
    } catch (e) {
      console.log('Erro ao carregar dados salvos:', e);
    }
  }, []);

  // Configuração do microfone
  useEffect(() => {
    setupMicrophone();
    return () => {
      cleanup();
    };
  }, []);

  const setupMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      
      analyser.fftSize = 2048;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      mediaStreamRef.current = stream;
    } catch (error) {
      setMessage('Microfone não disponível. O jogo funcionará apenas com reprodução de áudio.');
    }
  };

  const cleanup = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const getAudioPath = () => {
    if (currentLetter === 'A') {
      return `/audio/syllables/vogais/${currentSyllable}.mp3`;
    } else {
      return `/audio/syllables/essenciais/${currentLetter}/${currentSyllable}.mp3`;
    }
  };

  const playAudio = () => {
    if (audioPlaying) return;
    
    setAudioPlaying(true);
    setMessage('🔊 Escute com atenção...');
    
    // Usa síntese de voz como método principal
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentSyllable);
      utterance.lang = 'pt-BR';
      utterance.rate = playbackRate;
      utterance.onend = () => {
        setAudioPlaying(false);
        setMessage('✨ Agora clique em "Gravar Minha Voz" e repita!');
      };
      utterance.onerror = () => {
        setAudioPlaying(false);
        setMessage('Erro no áudio. Tente novamente.');
      };
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback para arquivo MP3
      if (audioRef.current) {
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.play().catch(() => {
          setAudioPlaying(false);
          setMessage('Arquivo de áudio não encontrado. Usando voz sintética.');
        });
      }
    }
  };

  const startListening = () => {
    if (!analyserRef.current) {
      setMessage('Microfone não disponível');
      return;
    }
    
    setListening(true);
    setMessage('🎤 Escutando... Fale a sílaba agora!');
    checkSpeech();
  };

  const stopListening = () => {
    setListening(false);
    setMessage('');
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
  };

  const checkSpeech = () => {
    if (!analyserRef.current || !dataArrayRef.current || !listening) return;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    let totalVolume = 0;
    let peakVolume = 0;
    
    for (let i = 10; i < 100; i++) {
      totalVolume += dataArrayRef.current[i];
      if (dataArrayRef.current[i] > peakVolume) {
        peakVolume = dataArrayRef.current[i];
      }
    }
    
    const avgVolume = totalVolume / 90;
    
    if (avgVolume > 25 && peakVolume > 50) {
      handleSpeechDetected();
    } else {
      rafIdRef.current = requestAnimationFrame(checkSpeech);
    }
  };

  const handleSpeechDetected = () => {
    setListening(false);
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    
    const points = 10 + (streak * 5);
    setScore(prev => prev + points);
    setStreak(prev => prev + 1);
    setMaxStreak(prev => Math.max(prev, streak + 1));
    setStarsEarned(prev => prev + 1);
    
    if (streak >= 4) {
      setCelebrationMessage('🔥 INCRÍVEL! Sequência perfeita!');
    } else if (streak >= 2) {
      setCelebrationMessage('✨ Muito bem! Continue assim!');
    } else {
      setCelebrationMessage('👏 Ótimo! Você conseguiu!');
    }
    
    playSuccessSound();
    
    setTimeout(() => {
      setCelebrationMessage('');
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
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      // Falha silenciosa
    }
  };

  const nextSyllable = () => {
    if (currentSyllableIndex + 1 < syllables.length) {
      setCurrentSyllableIndex(prev => prev + 1);
    } else if (currentLetterIndex + 1 < letters.length) {
      setCurrentLetterIndex(prev => prev + 1);
      setCurrentSyllableIndex(0);
      setScore(prev => prev + 50);
      setStarsEarned(prev => prev + 2);
      setCelebrationMessage('🌟 Letra completa! Bônus!');
      setTimeout(() => setCelebrationMessage(''), 2000);
    } else {
      completeGame();
    }
    setMessage('');
  };

  const completeGame = () => {
    setShowResults(true);
    
    const newStars = totalStarsCollected + starsEarned;
    setTotalStarsCollected(newStars);
    localStorage.setItem('speechGame_totalStars', newStars.toString());
    
    if (maxStreak > bestStreak) {
      setBestStreak(maxStreak);
      localStorage.setItem('speechGame_bestStreak', maxStreak.toString());
    }
  };

  const startGame = () => {
    setCurrentScreen('game');
    setCurrentLetterIndex(0);
    setCurrentSyllableIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setStarsEarned(0);
    setMessage('');
    setShowResults(false);
  };

  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6">
          <img 
            src="/images/mascotes/Leo_mila_conversa.webp" 
            alt="Leo e Mila conversando" 
            className="w-[280px] h-auto rounded-full shadow-2xl" 
          />
        </div>
        
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Minha Fala
        </h1>
        
        <p className="text-xl text-white/90 mb-6">
          🗣️ Pratique sílabas de forma divertida! 🎯
        </p>
        
        {(totalStarsCollected > 0 || bestStreak > 0) && (
          <div className="bg-white/80 rounded-2xl p-4 mb-6">
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
          className="text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-12 py-5 shadow-xl hover:scale-105 transition-transform"
        >
          Vamos Praticar!
        </button>
      </div>
    </div>
  );

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
            <span className="text-4xl">🏆</span>
            <span><b>Sequências</b> - Acerte seguido para bônus especiais!</span>
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

  const GameScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setCurrentScreen('title')}
            className="flex items-center text-purple-600 hover:text-purple-700"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="ml-1 font-medium">Voltar</span>
          </button>

          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🗣️ Minha Fala
          </h1>

          <div className="w-24"></div>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        {!showResults ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 text-center min-h-[500px] relative">
              
              {showCelebration && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-white/95 rounded-3xl p-6 shadow-2xl animate-bounce">
                    <div className="text-4xl mb-2">🎉</div>
                    <div className="text-lg font-bold text-purple-600">
                      {showCelebration}
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                {currentLetter === 'A' ? 'Vogais' : `Letra ${currentLetter}`} - 
                Sílaba {currentSyllableIndex + 1} de {syllables.length}
              </h2>
              
              <div className="text-8xl font-bold text-purple-600 mb-6 animate-pulse">
                {currentSyllable}
              </div>

              <div className="mb-6 bg-white/80 rounded-2xl p-4">
                <div className="flex items-center justify-center gap-8 text-sm">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-1">👂</div>
                    <div className="font-bold">1. Escutar</div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-1">🎤</div>
                    <div className="font-bold">2. Gravar</div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-1">🎉</div>
                    <div className="font-bold">3. Celebrar</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 mb-6">
                <audio
                  ref={audioRef}
                  src={getAudioPath()}
                  preload="auto"
                  onEnded={() => {
                    setAudioPlaying(false);
                    setMessage('✨ Agora clique em "Gravar Minha Voz"!');
                  }}
                />
                
                <button
                  onClick={playAudio}
                  disabled={audioPlaying}
                  className={`flex items-center gap-2 px-8 py-4 rounded-full text-xl font-bold transition-all ${
                    audioPlaying
                      ? 'bg-gray-400 text-gray-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 animate-pulse'
                  }`}
                >
                  <Volume2 className="w-6 h-6" />
                  {audioPlaying ? 'Reproduzindo...' : 'Ouvir Sílaba'}
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Velocidade:</span>
                  <select
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                    className="px-3 py-1 border rounded-lg text-sm"
                  >
                    <option value="0.5">0.5x (Muito Lento)</option>
                    <option value="0.75">0.75x (Lento)</option>
                    <option value="1.0">1.0x (Normal)</option>
                    <option value="1.25">1.25x (Rápido)</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                {!listening ? (
                  <button
                    onClick={startListening}
                    className="flex items-center gap-2 px-8 py-4 rounded-full text-xl font-bold bg-green-500 text-white hover:bg-green-600 hover:scale-105 animate-pulse"
                  >
                    <Mic className="w-6 h-6" />
                    Gravar Minha Voz
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-red-500 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-bold">GRAVANDO</span>
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <button
                      onClick={stopListening}
                      className="flex items-center gap-2 px-8 py-4 rounded-full text-xl font-bold bg-red-500 text-white hover:bg-red-600"
                    >
                      <Mic className="w-6 h-6 animate-bounce" />
                      Escutando... Fale agora!
                    </button>
                    
                    <button
                      onClick={stopListening}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm"
                    >
                      Parar Gravação
                    </button>
                  </div>
                )}
              </div>

              {message && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 font-bold">
                  {message}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{score}</div>
                  <div className="text-xs text-gray-500">Pontos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{streak}</div>
                  <div className="text-xs text-gray-500">Sequência</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{starsEarned}</div>
                  <div className="text-xs text-gray-500">Estrelas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{maxStreak}</div>
                  <div className="text-xs text-gray-500">Melhor</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold text-purple-600 mb-4">Parabéns!</h3>
            <p className="text-lg text-gray-600 mb-6">
              Você completou todas as sílabas!
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-purple-500">Pontos Totais</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{maxStreak}</div>
                <div className="text-sm text-green-500">Melhor Sequência</div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform"
              >
                🔄 Praticar Novamente
              </button>
              <button
                onClick={() => setCurrentScreen('title')}
                className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600"
              >
                🏠 Início
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  if (currentScreen === 'title') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
}
