'use client';

import React,- { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Volume2, Mic, Star, Trophy, Play } from 'lucide-react';

// Mapeamento das sílabas (mantido)
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
    const [message, setMessage] = useState('');
    const [showCelebration, setCelebrationMessage] = useState('');
    const [showResults, setShowResults] = useState(false);
    
    // NOVO: Estados para gravação
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
    const [audioPlaying, setAudioPlaying] = useState<'model' | 'user' | null>(null);
    const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
    const [audioLevel, setAudioLevel] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const modelAudioRef = useRef<HTMLAudioElement | null>(null);

    const letters = Object.keys(syllableMap);
    const currentLetter = letters[currentLetterIndex] || 'A';
    const syllables = syllableMap[currentLetter] || [];
    const currentSyllable = syllables[currentSyllableIndex] || 'a';

    // Pede permissão para o microfone
    const requestMicPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Apenas para permissão, não usamos o stream agora
            setMicPermission('granted');
            setMessage('Microfone pronto!');
        } catch (error) {
            setMicPermission('denied');
            setMessage('Microfone negado. A gravação não funcionará.');
        }
    };

    // Função para tocar o áudio do modelo (SEU MP3)
    const playModelAudio = useCallback(async () => {
        if (audioPlaying) return;

        let audioSrc = '';
        if (currentLetter === 'A') {
            audioSrc = `/audio/syllables/vogais/${currentSyllable}.mp3`;
        } else {
            audioSrc = `/audio/syllables/essenciais/${currentLetter}/${currentSyllable}.mp3`;
        }
        
        try {
            setAudioPlaying('model');
            setMessage('🔊 Escute com atenção...');
            if (!modelAudioRef.current) {
                modelAudioRef.current = new Audio();
            }
            modelAudioRef.current.src = audioSrc;
            await modelAudioRef.current.play();
        } catch (error) {
            console.error("Erro ao tocar MP3, tentando voz sintética:", error);
            // Fallback para voz sintética se o MP3 falhar
            const utterance = new SpeechSynthesisUtterance(currentSyllable);
            utterance.lang = 'pt-BR';
            window.speechSynthesis.speak(utterance);
        } finally {
             // Adiciona um listener para quando o áudio terminar
             if(modelAudioRef.current) {
                modelAudioRef.current.onended = () => {
                    setAudioPlaying(null);
                    setMessage('✨ Agora clique em "Gravar Minha Voz" e repita!');
                };
             }
        }
    }, [audioPlaying, currentSyllable, currentLetter]);

    // Lógica de Gravação
    const startRecording = async () => {
        if (isRecording || micPermission !== 'granted') {
            if (micPermission === 'prompt') requestMicPermission();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            // Visualizador de áudio
            if (!audioContextRef.current) audioContextRef.current = new AudioContext();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 512;
            source.connect(analyserRef.current);
            dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
            
            const draw = () => {
                if (!analyserRef.current || !dataArrayRef.current) return;
                analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                const avg = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
                setAudioLevel(avg);
                rafIdRef.current = requestAnimationFrame(draw);
            };
            draw();

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setRecordedAudioUrl(audioUrl);
                stream.getTracks().forEach(track => track.stop()); // Desliga o microfone
                if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
                setAudioLevel(0);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordedAudioUrl(null);
            setMessage('🎤 Gravando... Fale a sílaba agora!');
        } catch (error) {
            setMessage('Não foi possível iniciar a gravação.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setMessage('Gravação concluída! Ouça e confirme.');
        }
    };

    const playRecording = () => {
        if (recordedAudioUrl && !audioPlaying) {
            setAudioPlaying('user');
            const audio = new Audio(recordedAudioUrl);
            audio.play();
            audio.onended = () => setAudioPlaying(null);
        }
    };

    // Lógica do jogo
    const handleConfirm = () => {
        const points = 10 + (streak * 2);
        setScore(prev => prev + points);
        setStreak(prev => prev + 1);
        setMaxStreak(prev => Math.max(prev, streak + 1));
        setStarsEarned(prev => prev + 1);
        setRecordedAudioUrl(null);
        setCelebrationMessage('👏 Ótimo! Você conseguiu!');
        
        setTimeout(() => {
            setCelebrationMessage('');
            nextSyllable();
        }, 1500);
    };

    const nextSyllable = () => {
        if (currentSyllableIndex + 1 < syllables.length) {
            setCurrentSyllableIndex(prev => prev + 1);
        } else if (currentLetterIndex + 1 < letters.length) {
            setCurrentLetterIndex(prev => prev + 1);
            setCurrentSyllableIndex(0);
        } else {
            setShowResults(true); // Fim do jogo
        }
        setMessage('');
    };
    
    const startGameFlow = () => {
        if (micPermission === 'prompt') {
            requestMicPermission();
        }
        setCurrentScreen('game');
        setCurrentLetterIndex(0);
        setCurrentSyllableIndex(0);
        setScore(0);
        setStreak(0);
        setMaxStreak(0);
        setStarsEarned(0);
        setMessage('Clique em "Ouvir Sílaba" para começar!');
        setShowResults(false);
    };

    // --- TELAS ---
    
    const TitleScreen = () => (
      <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
        <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6">
                <img src="/images/mascotes/Leo_mila_conversa.webp" alt="Leo e Mila conversando" className="w-[280px] h-auto rounded-full shadow-2xl"/>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg">Minha Fala</h1>
            <p className="text-xl text-white/90 mb-6">🗣️ Pratique sílabas de forma divertida! 🎯</p>
            <button onClick={() => setCurrentScreen('instructions')} className="text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-12 py-5 shadow-xl hover:scale-105 transition-transform">
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
                <p className="flex items-center gap-4"><span className="text-4xl">🔊</span><span><b>1. Ouça a sílaba</b> - Clique para escutar a pronúncia correta.</span></p>
                <p className="flex items-center gap-4"><span className="text-4xl">🎤</span><span><b>2. Grave sua voz</b> - Clique no microfone e repita a sílaba em voz alta.</span></p>
                <p className="flex items-center gap-4"><span className="text-4xl">👂</span><span><b>3. Ouça sua gravação</b> - Compare sua pronúncia com a do modelo.</span></p>
                <p className="flex items-center gap-4"><span className="text-4xl">✅</span><span><b>4. Confirme</b> - Se estiver satisfeito, confirme para ganhar pontos e avançar!</span></p>
            </div>
            <button onClick={startGameFlow} className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform">
                Começar Prática! 🚀
            </button>
        </div>
      </div>
    );
    
    const GameScreen = () => (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => setCurrentScreen('title')} className="flex items-center text-purple-600 hover:text-purple-700">
                        <ChevronLeft className="h-6 w-6" /><span className="ml-1 font-medium">Voltar</span>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">🗣️ Minha Fala</h1>
                    <div className="w-24"></div>
                </div>
            </header>

            <main className="p-4 max-w-2xl mx-auto">
                {!showResults ? (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 text-center relative overflow-hidden">
                            {showCelebration && (
                                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
                                    <div className="bg-white rounded-3xl p-6 shadow-2xl animate-bounce text-lg font-bold text-purple-600">🎉 {showCelebration} 🎉</div>
                                </div>
                            )}

                            <h2 className="text-2xl font-bold text-purple-800 mb-4">
                                {currentLetter === 'A' ? 'Vogais' : `Letra ${currentLetter}`} - Sílaba {currentSyllableIndex + 1} de {syllables.length}
                            </h2>
                            <div className="text-8xl font-bold text-purple-600 mb-6 drop-shadow-md">{currentSyllable}</div>

                            {/* --- PAINEL DE AÇÕES --- */}
                            <div className="space-y-4">
                                {/* OUVIR MODELO */}
                                <button onClick={playModelAudio} disabled={!!audioPlaying} className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-xl font-bold transition-all ${!audioPlaying ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-400 text-gray-600'}`}>
                                    <Volume2 className="w-6 h-6" /> {audioPlaying === 'model' ? 'Reproduzindo...' : 'Ouvir Sílaba'}
                                </button>
                                
                                {/* GRAVAR / PARAR */}
                                {!isRecording ? (
                                    <button onClick={startRecording} disabled={!!audioPlaying || micPermission !== 'granted'} className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-xl font-bold transition-all ${micPermission !== 'granted' ? 'bg-yellow-500 text-white' : !audioPlaying ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-400 text-gray-600'}`}>
                                        <Mic className="w-6 h-6" /> {micPermission === 'prompt' ? 'Permitir Microfone' : micPermission === 'denied' ? 'Microfone Negado' : 'Gravar Minha Voz'}
                                    </button>
                                ) : (
                                    <button onClick={stopRecording} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-xl font-bold bg-red-500 text-white animate-pulse">
                                        <Mic className="w-6 h-6" /> Parar Gravação
                                    </button>
                                )}

                                {/* VISUALIZADOR DE ÁUDIO */}
                                {isRecording && (
                                    <div className="w-full h-12 bg-white/50 rounded-lg overflow-hidden flex items-center justify-center">
                                        <div className="bg-green-400 h-full transition-all duration-100" style={{ width: `${audioLevel * 2}%` }}></div>
                                    </div>
                                )}
                                
                                {/* OUVIR GRAVAÇÃO E CONFIRMAR */}
                                {recordedAudioUrl && (
                                    <div className="bg-white/60 p-4 rounded-2xl space-y-3 animate-fade-in">
                                        <button onClick={playRecording} disabled={!!audioPlaying} className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-lg font-bold transition-all ${!audioPlaying ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-400 text-gray-600'}`}>
                                            <Play className="w-5 h-5" /> {audioPlaying === 'user' ? 'Reproduzindo...' : 'Ouvir Minha Gravação'}
                                        </button>
                                        <button onClick={handleConfirm} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-lg font-bold bg-teal-500 text-white hover:bg-teal-600">
                                            ✅ Confirmar e Avançar
                                        </button>
                                    </div>
                                )}
                            </div>

                            {message && <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 font-bold">{message}</div>}
                        </div>
                        
                        {/* PAINEL DE PONTOS */}
                        <div className="bg-white rounded-xl shadow-lg p-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div><div className="text-2xl font-bold text-purple-600">{score}</div><div className="text-xs text-gray-500">Pontos</div></div>
                                <div><div className="text-2xl font-bold text-green-600">{streak}</div><div className="text-xs text-gray-500">Sequência</div></div>
                                <div><div className="text-2xl font-bold text-yellow-600">{starsEarned}</div><div className="text-xs text-gray-500">Estrelas</div></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-3xl font-bold text-purple-600 mb-4">Parabéns!</h3>
                        <p className="text-lg text-gray-600 mb-6">Você completou todas as sílabas!</p>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4"><div className="text-2xl font-bold text-purple-600">{score}</div><div className="text-sm text-purple-500">Pontos Totais</div></div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4"><div className="text-2xl font-bold text-green-600">{maxStreak}</div><div className="text-sm text-green-500">Melhor Sequência</div></div>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button onClick={startGameFlow} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform">🔄 Praticar Novamente</button>
                            <button onClick={() => setCurrentScreen('title')} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600">🏠 Início</button>
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
