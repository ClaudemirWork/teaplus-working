'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Volume2, Mic, Star, Trophy, Play, Sparkles, Crown, Gift } from 'lucide-react';
import { createClient } from '../utils/supabaseClient';
import confetti from 'canvas-confetti';
import Image from 'next/image';

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
    const router = useRouter();
    const supabase = createClient();
    
    const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [starsEarned, setStarsEarned] = useState(0);
    const [gemsEarned, setGemsEarned] = useState(0);
    const [message, setMessage] = useState('');
    const [showCelebration, setCelebrationMessage] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [salvando, setSalvando] = useState(false);
    
    // Estados otimizados para áudio
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
    const [audioPlaying, setAudioPlaying] = useState<'model' | 'user' | null>(null);
    const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
    
    // Estados para gamificação
    const [showSpecialEffect, setShowSpecialEffect] = useState<'star' | 'gem' | 'crown' | null>(null);
    const [totalStarsCollected, setTotalStarsCollected] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const modelAudioRef = useRef<HTMLAudioElement | null>(null);
    const letters = Object.keys(syllableMap);
    const currentLetter = letters[currentLetterIndex] || 'A';
    const syllables = syllableMap[currentLetter] || [];
    const currentSyllable = syllables[currentSyllableIndex] || 'a';
    
    // Carregar estatísticas salvas
    useEffect(() => {
        const savedStars = localStorage.getItem('speechGame_totalStars');
        const savedBest = localStorage.getItem('speechGame_bestScore');
        
        if (savedStars) setTotalStarsCollected(parseInt(savedStars));
        if (savedBest) setBestScore(parseInt(savedBest));
    }, []);
    
    // Funções de áudio adicionadas
    const playAudioWithFallback = async (audioPath: string, text: string) => {
        try {
            const audio = new Audio(audioPath);
            await audio.play();
        } catch (error) {
            console.error("Erro ao tocar MP3, usando voz sintética:", error);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            window.speechSynthesis.speak(utterance);
        }
    };
    
    const narrateText = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };
    
    const playSoundEffect = (soundName: string) => {
        try {
            const audio = new Audio(`/audio/sounds/${soundName}.mp3`);
            audio.play().catch(e => console.log("Erro ao tocar efeito sonoro:", e));
        } catch (error) {
            console.error("Erro ao tocar efeito sonoro:", error);
        }
    };
    
    // Otimização: Solicitar permissão do microfone sem delay
    const requestMicPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { 
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                } 
            });
            stream.getTracks().forEach(track => track.stop());
            setMicPermission('granted');
            setMessage('🎤 Microfone pronto para usar!');
            return true;
        } catch (error) {
            setMicPermission('denied');
            setMessage('❌ Microfone negado. A gravação não funcionará.');
            return false;
        }
    };
    
    const playModelAudio = useCallback(async () => {
        if (audioPlaying) return;
        
        const audioSrc = currentLetter === 'A' 
            ? `/audio/syllables/vogais/${currentSyllable}.mp3` 
            : `/audio/syllables/essenciais/${currentLetter}/${currentSyllable}.mp3`;
        
        try {
            setAudioPlaying('model');
            setMessage('🔊 Escute com atenção...');
            
            if (!modelAudioRef.current) modelAudioRef.current = new Audio();
            modelAudioRef.current.src = audioSrc;
            
            await modelAudioRef.current.play();
            
            modelAudioRef.current.onended = () => {
                setAudioPlaying(null);
                setMessage('✨ Agora clique em "Gravar" e repita a sílaba!');
            };
        } catch (error) {
            console.error("Erro ao tocar MP3, usando voz sintética:", error);
            const utterance = new SpeechSynthesisUtterance(currentSyllable);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            
            utterance.onend = () => {
                setAudioPlaying(null);
                setMessage('✨ Agora clique em "Gravar" e repita a sílaba!');
            };
            
            window.speechSynthesis.speak(utterance);
        }
    }, [audioPlaying, currentSyllable, currentLetter]);
    
    // Otimização: Gravação simplificada e mais rápida
    const startRecording = async () => {
        if (isRecording || audioPlaying) return;
        if (micPermission !== 'granted') {
            const granted = await requestMicPermission();
            if (!granted) return;
        }
        setRecordedAudioUrl(null);
        setMessage('🎤 Gravando... Fale a sílaba agora!');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { 
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                } 
            });
            // Configuração otimizada do MediaRecorder
            const options = { mimeType: 'audio/webm;codecs=opus' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options.mimeType = 'audio/webm';
            }
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options.mimeType = 'audio/wav';
            }
            mediaRecorderRef.current = new MediaRecorder(stream, options);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { 
                    type: mediaRecorderRef.current?.mimeType || 'audio/wav' 
                });
                const audioUrl = URL.createObjectURL(audioBlob);
                setRecordedAudioUrl(audioUrl);
                setMessage('✅ Gravação concluída! Ouça e confirme se ficou bom.');
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
            // Auto-parar após 3 segundos
            setTimeout(() => {
                if (mediaRecorderRef.current && isRecording) {
                    stopRecording();
                }
            }, 3000);
        } catch (error) {
            console.error('Erro na gravação:', error);
            setMessage('❌ Não foi possível iniciar a gravação.');
        }
    };
    
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
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
    
    // Sistema de gamificação aprimorado
    const createCelebrationBurst = (type: 'normal' | 'streak' | 'perfect' = 'normal') => {
        const colors = type === 'streak' 
            ? ['#FFD700', '#FFA500', '#FF69B4']
            : type === 'perfect'
            ? ['#9D4EDD', '#C77DFF', '#E0AAFF']
            : ['#06D6A0', '#118AB2', '#073B4C'];
        confetti({
            particleCount: type === 'perfect' ? 150 : type === 'streak' ? 100 : 50,
            spread: type === 'perfect' ? 100 : 70,
            origin: { y: 0.6 },
            colors: colors
        });
        if (type === 'perfect') {
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 100,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });
            }, 300);
        }
    };
    
    const handleConfirm = () => {
        const basePoints = 10;
        const streakBonus = streak * 2;
        const points = basePoints + streakBonus;
        
        setScore(prev => prev + points);
        setStreak(prev => prev + 1);
        setMaxStreak(prev => Math.max(prev, streak + 1));
        setStarsEarned(prev => prev + 1);
        
        // Sistema de recompensas aprimorado
        if (streak > 0 && (streak + 1) % 10 === 0) {
            // A cada 10 acertos consecutivos = coroa
            setGemsEarned(prev => prev + 5);
            setShowSpecialEffect('crown');
            setCelebrationMessage('👑 SEQUÊNCIA REAL! +5 Gemas Mágicas!');
            createCelebrationBurst('perfect');
            // Adicionar áudio com a frase específica
            narrateText("Incrível! Sequência de 10 acertos! Você é um rei da fala!");
            playSoundEffect("crown");
        } else if (streak > 0 && (streak + 1) % 5 === 0) {
            // A cada 5 acertos consecutivos = gema especial
            setGemsEarned(prev => prev + 2);
            setShowSpecialEffect('gem');
            setCelebrationMessage('💎 SEQUÊNCIA ESPECIAL! +2 Gemas!');
            createCelebrationBurst('streak');
            // Adicionar áudio com a frase específica
            narrateText("SEQUÊNCIA ESPECIAL! +2 Gemas!");
            playSoundEffect("gem");
        } else {
            // Acerto normal = estrela
            setShowSpecialEffect('star');
            setCelebrationMessage(`⭐ Perfeito! +${points} pontos!`);
            createCelebrationBurst('normal');
            // Adicionar áudio
            narrateText("Perfeito! Você ganhou uma estrela!");
            playSoundEffect("star");
        }
        
        setRecordedAudioUrl(null);
        
        setTimeout(() => {
            setCelebrationMessage('');
            setShowSpecialEffect(null);
            nextSyllable();
        }, 2000);
    };
    
    const nextSyllable = () => {
        if (currentSyllableIndex + 1 < syllables.length) {
            setCurrentSyllableIndex(prev => prev + 1);
        } else if (currentLetterIndex + 1 < letters.length) {
            setCurrentLetterIndex(prev => prev + 1);
            setCurrentSyllableIndex(0);
            
            // Celebração especial ao completar uma letra
            const nextLetter = letters[currentLetterIndex + 1];
            setMessage(`🎉 Letra ${currentLetter} completa! Próxima: ${nextLetter}`);
            createCelebrationBurst('streak');
            // Adicionar áudio com a frase específica
            narrateText(`Parabéns! Dominou a letra ${currentLetter}! Agora vamos para ${nextLetter}!`);
            playSoundEffect("level_complete");
            
            setTimeout(() => {
                setMessage('Clique em "Ouvir Sílaba" para continuar!');
            }, 2000);
        } else {
            // Fim do jogo
            createCelebrationBurst('perfect');
            setShowResults(true);
            // Adicionar áudio com a frase específica
            narrateText("Fantástico! Você se tornou um verdadeiro campeão da pronúncia!");
            playSoundEffect("game_complete");
        }
    };
    
    const startGameFlow = () => {
        if (micPermission === 'prompt') requestMicPermission();
        setCurrentScreen('game');
        setCurrentLetterIndex(0);
        setCurrentSyllableIndex(0);
        setScore(0);
        setStreak(0);
        setMaxStreak(0);
        setStarsEarned(0);
        setGemsEarned(0);
        setMessage('🎯 Clique em "Ouvir Sílaba" para começar!');
        setShowResults(false);
    };
    
    const handleSaveSession = async () => {
        setSalvando(true);
        
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                alert('Erro: Sessão expirada. Por favor, faça login novamente.');
                router.push('/login');
                return;
            }
            // Salvar recordes localmente
            const newStars = totalStarsCollected + starsEarned;
            setTotalStarsCollected(newStars);
            localStorage.setItem('speechGame_totalStars', newStars.toString());
            
            if (score > bestScore) {
                setBestScore(score);
                localStorage.setItem('speechGame_bestScore', score.toString());
            }
            
            const { data, error } = await supabase
                .from('sessoes')
                .insert([{
                    usuario_id: user.id,
                    atividade_nome: 'Minha Fala - Prática de Pronúncia',
                    pontuacao_final: score,
                    data_fim: new Date().toISOString()
                }]);
            if (error) {
                console.error('Erro ao salvar:', error);
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!
                
🗣️ Resultado da Prática de Fala:
- Pontuação Final: ${score} pontos
- Melhor Sequência: ${maxStreak} acertos
- Estrelas Ganhas: ${starsEarned}
- Gemas Mágicas: ${gemsEarned}
- Total de Estrelas: ${newStars}`);
                
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error('Erro inesperado:', error);
            alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setSalvando(false);
        }
    };
    
    const voltarInicio = () => {
        setCurrentScreen('title');
        setShowResults(false);
    };
    
    const TitleScreen = () => {
        const [isPlayingIntro, setIsPlayingIntro] = useState(false);

        const handlePlayIntro = () => {
            setIsPlayingIntro(true);
            playSoundEffect("click");
            
            // Reproduzir a apresentação da dupla
            narrateText("Olá! Somos Leo e Mila! Vamos praticar sua fala!");
            
            // Após a narração, ir para a tela de instruções
            setTimeout(() => {
                setIsPlayingIntro(false);
                setCurrentScreen('instructions');
            }, 4000); // Tempo aproximado da narração
        };

        return (
            <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-pink-300 via-purple-400 to-indigo-500 overflow-hidden">
                {/* Estrelas de fundo animadas */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 2}s`,
                            }}
                        >
                            <Star className="w-6 h-6 text-white opacity-30" fill="currentColor" />
                        </div>
                    ))}
                </div>
                
                {/* Bolhas flutuantes (similar ao bubble-pop) */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white/20 animate-float"
                            style={{
                                width: `${10 + Math.random() * 40}px`,
                                height: `${10 + Math.random() * 40}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${100 + Math.random() * 20}%`,
                                animationDuration: `${10 + Math.random() * 20}s`,
                                animationDelay: `${Math.random() * 5}s`,
                            }}
                        />
                    ))}
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-4 animate-bounce-slow">
                        <Image 
                            src="/images/mascotes/Leo_mila_conversa.webp" 
                            alt="Leo e Mila conversando" 
                            width={400} 
                            height={400} 
                            className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl rounded-full" 
                            priority 
                        />
                    </div>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
                        Minha Fala
                    </h1>
                    <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-6 drop-shadow-md">
                        🗣️ Pratique sílabas de forma divertida! 🎯
                    </p>
                    
                    {/* Estatísticas na tela inicial */}
                    {(totalStarsCollected > 0 || bestScore > 0) && (
                        <div className="bg-white/80 rounded-2xl p-4 mb-6 shadow-xl">
                            <div className="flex items-center gap-4">
                                {totalStarsCollected > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                                        <span className="font-bold text-purple-800">{totalStarsCollected} estrelas</span>
                                    </div>
                                )}
                                {bestScore > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-6 h-6 text-yellow-600" />
                                        <span className="font-bold text-purple-800">Recorde: {bestScore}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <button 
                        onClick={handlePlayIntro}
                        disabled={isPlayingIntro}
                        className={`text-xl font-bold text-white rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1 ${
                            isPlayingIntro 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}
                    >
                        {isPlayingIntro ? 'Reproduzindo...' : '🔊 Ouvir Leo e Mila'}
                    </button>
                </div>
            </div>
        );
    };
    
    const InstructionsScreen = () => {
        const [isPlayingInstructions, setIsPlayingInstructions] = useState(false);

        const handlePlayInstructions = () => {
            setIsPlayingInstructions(true);
            playSoundEffect("click");
            
            // Reproduzir as instruções
            narrateText("Primeiro ouça, depois grave, compare e confirme!");
            
            // Após a narração, habilitar o botão de começar
            setTimeout(() => {
                setIsPlayingInstructions(false);
            }, 3500); // Tempo aproximado da narração
        };

        return (
            <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300">
                {/* Elementos decorativos animados */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white/20 animate-float"
                            style={{
                                width: `${5 + Math.random() * 30}px`,
                                height: `${5 + Math.random() * 30}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${100 + Math.random() * 20}%`,
                                animationDuration: `${8 + Math.random() * 15}s`,
                                animationDelay: `${Math.random() * 5}s`,
                            }}
                        />
                    ))}
                </div>
                
                <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center relative z-10">
                    <h2 className="text-4xl font-bold mb-6 text-purple-600">Como Funciona</h2>
                    <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
                        <p className="flex items-center gap-4">
                            <span className="text-4xl">🔊</span>
                            <span><b>1. Ouça a sílaba</b> - Clique para escutar a pronúncia correta</span>
                        </p>
                        <p className="flex items-center gap-4">
                            <span className="text-4xl">🎤</span>
                            <span><b>2. Grave sua voz</b> - Clique no microfone e repita a sílaba</span>
                        </p>
                        <p className="flex items-center gap-4">
                            <span className="text-4xl">👂</span>
                            <span><b>3. Ouça sua gravação</b> - Compare sua pronúncia com o modelo</span>
                        </p>
                        <p className="flex items-center gap-4">
                            <span className="text-4xl">⭐</span>
                            <span><b>4. Ganhe recompensas!</b> - Estrelas, gemas mágicas e coroas!</span>
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <button 
                            onClick={handlePlayInstructions}
                            disabled={isPlayingInstructions}
                            className={`w-full text-xl font-bold text-white rounded-full py-4 shadow-xl transition-transform ${
                                isPlayingInstructions 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105'
                            }`}
                        >
                            {isPlayingInstructions ? 'Reproduzindo...' : '🔊 Ouvir Instruções'}
                        </button>
                        
                        <button 
                            onClick={() => {
                                playSoundEffect("click");
                                startGameFlow();
                            }} 
                            className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform"
                        >
                            Começar Prática! 🚀
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    
    const GameScreen = () => {
        // Adicionar áudio quando a tela de resultados for exibida
        useEffect(() => {
            if (showResults) {
                narrateText("Fantástico! Você se tornou um verdadeiro campeão da pronúncia!");
            }
        }, [showResults]);

        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between h-16">
                            <button
                                onClick={() => {
                                    playSoundEffect("click");
                                    setCurrentScreen('title');
                                }}
                                className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
                            >
                                <ChevronLeft className="h-6 w-6" />
                                <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                            </button>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                                🗣️
                                <span>Minha Fala</span>
                            </h1>
                            {showResults ? (
                                <button
                                    onClick={() => {
                                        playSoundEffect("click");
                                        handleSaveSession();
                                    }}
                                    disabled={salvando}
                                    className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${
                                        !salvando
                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <Save size={18} />
                                    <span className="hidden sm:inline">{salvando ? 'Salvando...' : 'Salvar'}</span>
                                </button>
                            ) : (
                                <div className="w-24"></div>
                            )}
                        </div>
                    </div>
                </header>
                <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
                    {!showResults ? (
                        <div className="space-y-4">
                            {/* Status com gamificação */}
                            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
                                <div className="grid grid-cols-5 gap-2">
                                    <div className="text-center">
                                        <div className="text-base sm:text-xl font-bold text-purple-800">
                                            {currentLetter}
                                        </div>
                                        <div className="text-xs text-purple-600">Letra</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-base sm:text-xl font-bold text-blue-800">
                                            {score}
                                        </div>
                                        <div className="text-xs text-blue-600">Pontos</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-base sm:text-xl font-bold text-orange-800">
                                            {streak}
                                        </div>
                                        <div className="text-xs text-orange-600">Sequência</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-base sm:text-xl font-bold text-yellow-800">
                                            {starsEarned}
                                        </div>
                                        <div className="text-xs text-yellow-600">⭐ Estrelas</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-base sm:text-xl font-bold text-pink-800">
                                            {gemsEarned}
                                        </div>
                                        <div className="text-xs text-pink-600">💎 Gemas</div>
                                    </div>
                                </div>
                            </div>
                            {/* Área principal do jogo */}
                            <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 rounded-3xl p-6 text-center relative overflow-hidden shadow-xl">
                                {/* Efeitos especiais de celebração */}
                                {showCelebration && (
                                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
                                        <div className="bg-white rounded-3xl p-6 shadow-2xl animate-bounce text-lg font-bold">
                                            {showSpecialEffect === 'crown' && (
                                                <div className="text-6xl mb-2">👑</div>
                                            )}
                                            {showSpecialEffect === 'gem' && (
                                                <div className="text-6xl mb-2">💎</div>
                                            )}
                                            {showSpecialEffect === 'star' && (
                                                <div className="text-6xl mb-2">⭐</div>
                                            )}
                                            <div className="text-purple-600">{showCelebration}</div>
                                        </div>
                                    </div>
                                )}
                                {/* Progresso da letra atual */}
                                <div className="mb-4">
                                    <h2 className="text-lg sm:text-2xl font-bold text-purple-800 mb-2">
                                        {currentLetter === 'A' ? 'Vogais' : `Letra ${currentLetter}`}
                                    </h2>
                                    <div className="text-sm text-purple-600">
                                        Sílaba {currentSyllableIndex + 1} de {syllables.length}
                                    </div>
                                    
                                    {/* Barra de progresso */}
                                    <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                                        <div 
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${((currentSyllableIndex + 1) / syllables.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                {/* Sílaba atual com destaque */}
                                <div className="bg-white/80 rounded-2xl p-8 mb-6 shadow-inner">
                                    <div className="text-6xl sm:text-8xl font-bold text-purple-600 mb-2 drop-shadow-lg animate-pulse">
                                        {currentSyllable}
                                    </div>
                                    <div className="text-lg text-purple-700 font-medium">
                                        Repita esta sílaba
                                    </div>
                                </div>
                                {/* Controles de áudio otimizados */}
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => {
                                            playSoundEffect("click");
                                            playModelAudio();
                                        }} 
                                        disabled={!!audioPlaying || isRecording} 
                                        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 ${
                                            !audioPlaying && !isRecording 
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl' 
                                                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        }`}
                                    >
                                        <Volume2 className="w-6 h-6" />
                                        {audioPlaying === 'model' ? 'Reproduzindo modelo...' : 'Ouvir Sílaba'}
                                    </button>
                                    
                                    <button 
                                        onClick={() => {
                                            playSoundEffect("click");
                                            if (isRecording) {
                                                stopRecording();
                                            } else {
                                                startRecording();
                                            }
                                        }} 
                                        disabled={!!audioPlaying} 
                                        className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 ${
                                            !!audioPlaying 
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' :
                                                isRecording 
                                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-lg' :
                                                'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl'
                                        }`}
                                    >
                                        <Mic className="w-6 h-6" />
                                        {isRecording ? '🔴 Gravando... (Clique para parar)' : 'Gravar Minha Voz'}
                                    </button>
                                    {/* Visualização da gravação */}
                                    {recordedAudioUrl && (
                                        <div className="bg-white/80 p-4 rounded-2xl space-y-3 animate-slide-up shadow-inner">
                                            <button 
                                                onClick={() => {
                                                    playSoundEffect("click");
                                                    playRecording();
                                                }} 
                                                disabled={!!audioPlaying} 
                                                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-lg font-bold transition-all ${
                                                    !audioPlaying 
                                                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-105 shadow-lg' 
                                                        : 'bg-gray-400 text-gray-600'
                                                }`}
                                            >
                                                <Play className="w-5 h-5" />
                                                {audioPlaying === 'user' ? 'Reproduzindo...' : 'Ouvir Minha Gravação'}
                                            </button>
                                            
                                            <button 
                                                onClick={() => {
                                                    playSoundEffect("click");
                                                    handleConfirm();
                                                }} 
                                                disabled={!!audioPlaying} 
                                                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-lg font-bold bg-gradient-to-r from-teal-500 to-green-500 text-white hover:scale-105 transition-all shadow-lg disabled:bg-gray-400"
                                            >
                                                <Sparkles className="w-6 h-6" />
                                                Confirmar e Ganhar Estrela!
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {/* Mensagens do jogo */}
                                {message && (
                                    <div className="mt-4 bg-blue-50/80 border-2 border-blue-300 rounded-xl p-3 text-blue-800 font-bold shadow-inner">
                                        {message}
                                    </div>
                                )}
                            </div>
                            
                            {/* Progresso geral das letras */}
                            <div className="flex justify-center gap-1 flex-wrap">
                                {letters.map((letter, index) => (
                                    <div
                                        key={letter}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all
                                            ${index < currentLetterIndex ? 'bg-green-500 text-white shadow-lg' :
                                            index === currentLetterIndex ? 'bg-purple-400 text-white animate-pulse shadow-lg' :
                                            'bg-gray-300 text-gray-600'}`}
                                    >
                                        {letter}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Tela de resultados com gamificação completa
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                            <div className="text-center mb-6">
                                <div className="text-6xl mb-4 animate-bounce">🏆</div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                                    Parabéns, Campeão da Fala!
                                </h3>
                                <p className="text-lg text-purple-500">
                                    Você completou todas as sílabas com maestria!
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 text-center">
                                    <div className="text-lg sm:text-xl font-bold text-purple-800">{score}</div>
                                    <div className="text-xs text-purple-600">Pontuação</div>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 text-center">
                                    <div className="text-lg sm:text-xl font-bold text-orange-800">{maxStreak}</div>
                                    <div className="text-xs text-orange-600">Melhor Sequência</div>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3 text-center">
                                    <div className="text-lg sm:text-xl font-bold text-yellow-800">{starsEarned}</div>
                                    <div className="text-xs text-yellow-600">⭐ Estrelas</div>
                                </div>
                                <div className="bg-pink-50 border border-pink-200 rounded-lg p-2 sm:p-3 text-center">
                                    <div className="text-lg sm:text-xl font-bold text-pink-800">{gemsEarned}</div>
                                    <div className="text-xs text-pink-600">💎 Gemas</div>
                                </div>
                            </div>
                            {/* Conquistas especiais */}
                            {gemsEarned > 0 && (
                                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-6 border border-purple-200">
                                    <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                                        <Crown className="w-5 h-5" />
                                        Conquistas Especiais
                                    </h4>
                                    <div className="text-sm text-purple-700 space-y-1">
                                        {Math.floor(gemsEarned / 5) > 0 && (
                                            <div>👑 {Math.floor(gemsEarned / 5)} Sequência(s) Real(is) - 10+ acertos consecutivos!</div>
                                        )}
                                        {Math.floor((gemsEarned % 5) / 2) > 0 && (
                                            <div>💎 {Math.floor((gemsEarned % 5) / 2)} Sequência(s) Especial(is) - 5+ acertos consecutivos!</div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => {
                                        playSoundEffect("click");
                                        voltarInicio();
                                    }}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
                                >
                                    🔄 Nova Prática
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        );
    };
    
    // Renderização condicional das telas
    if (currentScreen === 'title') return <TitleScreen />;
    if (currentScreen === 'instructions') return <InstructionsScreen />;
    return <GameScreen />;
}
