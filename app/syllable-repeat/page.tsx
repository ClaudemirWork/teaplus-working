'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Volume2, Mic, Star, Trophy, Play, LoaderCircle, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './syllable-repeat.module.css';

const syllableMap: { [letter: string]: string[] } = {
    A: ['a', 'e', 'i', 'o', 'u'], B: ['ba', 'bê', 'bi', 'bó', 'bu'], C: ['ca', 'ce', 'ci', 'co', 'cu'],
    D: ['da', 'dê', 'di', 'dó', 'du'], F: ['fa', 'fe', 'fi', 'fo', 'fu'], G: ['ga', 'ge', 'gi', 'go', 'gu'],
    J: ['ja', 'je', 'ji', 'jo', 'ju'], L: ['la', 'le', 'li', 'lo', 'lu'], M: ['ma', 'me', 'mi', 'mo', 'mu'],
    N: ['na', 'ne', 'ni', 'no', 'nu'], P: ['pa', 'pe', 'pi', 'po', 'pu'], R: ['ra', 're', 'ri', 'ro', 'ru'],
    S: ['sa', 'se', 'si', 'so', 'su'], T: ['ta', 'te', 'ti', 'to', 'tu'], V: ['va', 've', 'vi', 'vo', 'vu'],
};

const sequenceLevels: { name: string, displayText: string, audioFile: string }[] = [
    { name: "Sequência de Vogais", displayText: "a - e - i - o - u", audioFile: "vogais.mp3" },
    { name: "Família do B", displayText: "ba - be - bi - bo - bu", audioFile: "familia-b.mp3" },
    { name: "Família do M", displayText: "ma - me - mi - mo - mu", audioFile: "familia-m.mp3" },
];

export default function SpeechPracticeGame() {
    const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
    const [gameMode, setGameMode] = useState<'syllables' | 'sequences'>('syllables');
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    // << ALTERAÇÃO AQUI >> Estado para guardar o índice da sílaba de forma estável
    const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [stars, setStars] = useState(0);
    const [gems, setGems] = useState(0);
    const [message, setMessage] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [recordingStatus, setRecordingStatus] = useState<'idle' | 'initializing' | 'recording'>('idle');
    const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
    const [audioPlaying, setAudioPlaying] = useState<'model' | 'user' | null>(null);
    const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
    const [audioLevel, setAudioLevel] = useState(0);
    const [lastReward, setLastReward] = useState<{ points: number, stars: number, gems: number } | null>(null);
    const [showStarBurst, setShowStarBurst] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const modelAudioRef = useRef<HTMLAudioElement | null>(null);

    const letters = Object.keys(syllableMap);
    // << ALTERAÇÃO AQUI >> Lógica de sílaba agora usa o estado estável
    const currentSyllableData = gameMode === 'syllables' && letters[currentLevelIndex] ? {
        letter: letters[currentLevelIndex],
        syllables: syllableMap[letters[currentLevelIndex]],
        syllable: syllableMap[letters[currentLevelIndex]][currentSyllableIndex],
    } : null;
    const currentSequenceData = gameMode === 'sequences' ? sequenceLevels[currentLevelIndex] : null;

    const requestMicPermission = async () => { /* ... (código mantido) ... */ };
    
    // << ALTERAÇÃO AQUI >> Função setupLevel agora sorteia e guarda o índice da sílaba
    const setupLevel = (levelIndex: number) => {
        const letter = letters[levelIndex];
        const syllablesForLetter = syllableMap[letter] || [];
        const randomIndex = Math.floor(Math.random() * syllablesForLetter.length);
        setCurrentSyllableIndex(randomIndex);
    };

    const playModelAudio = useCallback(async () => {
        if (audioPlaying) return;
        let audioSrc = '';
        if (gameMode === 'syllables' && currentSyllableData) {
            const { letter, syllable } = currentSyllableData;
            audioSrc = letter === 'A' ? `/audio/syllables/vogais/${syllable}.mp3` : `/audio/syllables/essenciais/${letter}/${syllable}.mp3`;
        } else if (gameMode === 'sequences' && currentSequenceData) {
            audioSrc = `/audio/sequences/${currentSequenceData.audioFile}`;
        }
        if (!audioSrc) return;
        setAudioPlaying('model');
        setMessage('🔊 Escute com atenção...');
        try {
            if (!modelAudioRef.current) modelAudioRef.current = new Audio();
            modelAudioRef.current.src = audioSrc;
            await modelAudioRef.current.play();
            modelAudioRef.current.onended = () => {
                setAudioPlaying(null);
                setMessage('✨ Agora é sua vez! Clique para gravar.');
            };
        } catch (error) {
            setAudioPlaying(null);
            setMessage('Erro ao carregar o áudio. Tente novamente.');
        }
    }, [audioPlaying, gameMode, currentSyllableData, currentSequenceData]);
    
    const startRecording = async () => { /* ... (código da versão anterior mantido) ... */ };
    const stopRecording = () => { /* ... (código da versão anterior mantido) ... */ };
    const playRecording = () => { /* ... (código da versão anterior mantido) ... */ };
    
    const handleConfirm = () => {
        const newStreak = streak + 1;
        const points = 10 + (newStreak * 2);
        const newStars = 1;
        const newGems = newStreak > 0 && newStreak % 5 === 0 ? 1 : 0;
        setScore(s => s + points);
        setStreak(newStreak);
        setStars(s => s + newStars);
        setGems(g => g + newGems);
        setLastReward({ points, stars: newStars, gems: newGems });
        setShowStarBurst(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setRecordedAudioUrl(null);
        setTimeout(() => {
            setLastReward(null);
            nextLevel();
        }, 2000);
        setTimeout(() => setShowStarBurst(false), 1000);
    };

    // << ALTERAÇÃO AQUI >> nextLevel agora chama setupLevel para a próxima letra
    const nextLevel = () => {
        setRecordedAudioUrl(null);
        setMessage('');
        if (gameMode === 'syllables') {
            const nextIndex = currentLevelIndex + 1;
            if (nextIndex >= letters.length) {
                setGameMode('sequences');
                setCurrentLevelIndex(0);
                setMessage('DESAFIO FINAL: Juntando os sons!');
            } else {
                setCurrentLevelIndex(nextIndex);
                setupLevel(nextIndex); // Sorteia uma nova sílaba para a nova letra
            }
        } else if (gameMode === 'sequences') {
            const nextIndex = currentLevelIndex + 1;
            if (nextIndex >= sequenceLevels.length) {
                setShowResults(true);
            } else {
                setCurrentLevelIndex(nextIndex);
            }
        }
    };
    
    // << ALTERAÇÃO AQUI >> startGameFlow agora chama setupLevel para o primeiro nível
    const startGameFlow = () => {
        if (micPermission === 'prompt') requestMicPermission();
        setGameMode('syllables');
        setCurrentScreen('game');
        setCurrentLevelIndex(0);
        setupLevel(0); // Sorteia a primeira sílaba
        setScore(0);
        setStreak(0);
        setStars(0);
        setGems(0);
        setMessage('Clique em "Ouvir" para começar!');
        setShowResults(false);
    };

    // ... O resto do código (componentes de tela, useEffects de animação, etc.) continua igual ...
    const StarBurstEffect = () => (
        <div className={styles.starBurstContainer}>
            <div className={`${styles.star} ${styles.star1}`}></div> <div className={`${styles.star} ${styles.star2}`}></div> <div className={`${styles.star} ${styles.star3}`}></div> <div className={`${styles.star} ${styles.star4}`}></div> <div className={`${styles.star} ${styles.star5}`}></div> <div className={`${styles.star} ${styles.star6}`}></div> <div className={`${styles.star} ${styles.star7}`}></div>
        </div>
    );
    const TitleScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6"><img src="/images/mascotes/Leo_mila_conversa.webp" alt="Leo e Mila conversando" className="w-[280px] h-auto rounded-full shadow-2xl"/></div>
                <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg">Minha Fala</h1>
                <p className="text-xl text-white/90 mb-6">🗣️ Pratique sílabas de forma divertida! 🎯</p>
                <button onClick={() => setCurrentScreen('instructions')} className="text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-12 py-5 shadow-xl hover:scale-105 transition-transform">Vamos Praticar!</button>
            </div>
        </div>
    );
    const InstructionsScreen = () => (
        <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300">
            <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center">
                <h2 className="text-4xl font-bold mb-6 text-purple-600">Como Funciona</h2>
                <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
                    <p className="flex items-center gap-4"><span className="text-4xl">🔊</span><span><b>1. Ouça</b> - Clique para escutar a pronúncia correta.</span></p>
                    <p className="flex items-center gap-4"><span className="text-4xl">🎤</span><span><b>2. Grave</b> - Clique no microfone e repita em voz alta.</span></p>
                    <p className="flex items-center gap-4"><span className="text-4xl">👂</span><span><b>3. Compare</b> - Ouça sua gravação e veja se ficou parecida.</span></p>
                    <p className="flex items-center gap-4"><span className="text-4xl">✅</span><span><b>4. Confirme</b> - Se gostou, confirme para ganhar pontos e avançar!</span></p>
                </div>
                <button onClick={startGameFlow} className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform">Começar Prática! 🚀</button>
            </div>
        </div>
    );
    const GameScreen = () => (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => setCurrentScreen('title')} className="flex items-center text-purple-600 hover:text-purple-700"><ChevronLeft className="h-6 w-6" /><span className="ml-1 font-medium">Voltar</span></button>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">🗣️ Minha Fala</h1>
                    <div className="w-24"></div>
                </div>
            </header>
            <main className="p-4 max-w-2xl mx-auto">
                {!showResults ? (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 text-center relative overflow-hidden min-h-[500px]">
                            {showStarBurst && <StarBurstEffect />}
                            <AnimatePresence>
                                {lastReward && (
                                    <motion.div initial={{ opacity: 0, y: 50, scale: 0.3 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }} className={`absolute top-1/2 left-1/2 z-30 bg-white/90 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-2 ${styles.rewardPopup}`}>
                                        <div className="text-2xl font-bold text-green-600">+{lastReward.points} Pontos!</div>
                                        <div className="flex gap-4">
                                            {lastReward.stars > 0 && <div className="text-xl font-medium text-yellow-500 flex items-center gap-1">+{lastReward.stars} <Star size={20}/></div>}
                                            {lastReward.gems > 0 && <div className="text-xl font-medium text-purple-500 flex items-center gap-1">+{lastReward.gems} <Gem size={20}/></div>}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <h2 className="text-2xl font-bold text-purple-800 mb-4">
                                {gameMode === 'syllables' ? `Letra ${currentSyllableData?.letter}` : currentSequenceData?.name}
                            </h2>
                            <div className="text-6xl sm:text-8xl font-bold text-purple-600 mb-6 drop-shadow-md h-24 flex items-center justify-center">
                                {gameMode === 'syllables' ? currentSyllableData?.syllable : currentSequenceData?.displayText}
                            </div>
                            <div className="space-y-4">
                                <button onClick={playModelAudio} disabled={!!audioPlaying || recordingStatus !== 'idle'} className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-xl font-bold transition-all ${!audioPlaying && recordingStatus === 'idle' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}>
                                    <Volume2 className="w-6 h-6" /> {audioPlaying === 'model' ? 'Reproduzindo...' : 'Ouvir'}
                                </button>
                                <button onClick={recordingStatus === 'recording' ? stopRecording : startRecording} disabled={!!audioPlaying} className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-xl font-bold transition-all ${!!audioPlaying ? 'bg-gray-400 text-gray-600 cursor-not-allowed' :
                                    recordingStatus === 'recording' ? 'bg-red-500 text-white animate-pulse' :
                                    recordingStatus === 'initializing' ? 'bg-yellow-500 text-white' :
                                    'bg-green-500 text-white hover:bg-green-600'
                                }`}>
                                    {recordingStatus === 'recording' ? <><Mic className="w-6 h-6" /> Parar Gravação</> :
                                     recordingStatus === 'initializing' ? <><LoaderCircle className="w-6 h-6 animate-spin" /> Iniciando...</> :
                                     <><Mic className="w-6 h-6" /> Gravar Voz</>}
                                </button>
                                {recordingStatus === 'recording' && (
                                    <div className="w-full h-12 bg-white/50 rounded-lg overflow-hidden flex items-center justify-center">
                                        <div className="bg-green-400 h-full transition-all duration-100" style={{ width: `${Math.min(100, audioLevel * 2)}%` }}></div>
                                    </div>
                                )}
                                {recordedAudioUrl && (
                                    <div className="bg-white/60 p-4 rounded-2xl space-y-3 animate-fade-in">
                                        <button onClick={playRecording} disabled={!!audioPlaying} className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-lg font-bold transition-all ${!audioPlaying ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-400 text-gray-600'}`}>
                                            <Play className="w-5 h-5" /> {audioPlaying === 'user' ? 'Reproduzindo...' : 'Ouvir Gravação'}
                                        </button>
                                        <button onClick={handleConfirm} disabled={!!audioPlaying} className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-lg font-bold bg-teal-500 text-white hover:bg-teal-600 disabled:bg-gray-400 ${styles.confirmButton}`}>
                                            ✅ Confirmar e Avançar
                                        </button>
                                    </div>
                                )}
                            </div>
                            {message && <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 font-bold">{message}</div>}
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-4">
                            <div className="grid grid-cols-4 gap-4 text-center">
                                <div><div className="text-2xl font-bold text-purple-600">{score}</div><div className="text-xs text-gray-500">Pontos</div></div>
                                <div><div className="text-2xl font-bold text-green-600">{streak}</div><div className="text-xs text-gray-500">Sequência</div></div>
                                <div><div className="text-2xl font-bold text-yellow-600">{stars}</div><div className="text-xs text-gray-500">Estrelas</div></div>
                                <div><div className="text-2xl font-bold text-fuchsia-600">{gems}</div><div className="text-xs text-gray-500">Gemas</div></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-3xl font-bold text-purple-600 mb-4">Parabéns!</h3>
                        <p className="text-lg text-gray-600 mb-6">Você concluiu todos os desafios de fala!</p>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4"><div className="text-2xl font-bold text-purple-600">{score}</div><div className="text-sm text-purple-500">Pontos Totais</div></div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"><div className="text-2xl font-bold text-yellow-600">{stars}</div><div className="text-sm text-yellow-500">Estrelas</div></div>
                            <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-lg p-4 col-span-2"><div className="text-2xl font-bold text-fuchsia-600">{gems}</div><div className="text-sm text-fuchsia-500">Gemas Mágicas</div></div>
                        </div>
                        <div className="flex justify-center gap-4">
                            <button onClick={startGameFlow} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform">🔄 Praticar Novamente</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
    
    // Omitido para brevidade: useEffects de animação e permissão, funções auxiliares
    useEffect(() => { /* ... animação de partículas ... */ }, []);
    useEffect(() => { /* ... verificação de mobile ... */ }, []);
    useEffect(() => { /* ... criação de partículas pós-clique ... */ }, [lastReward, createParticles]);

    const renderScreen = () => {
        switch (currentScreen) {
            case 'title': return <TitleScreen />;
            case 'instructions': return <InstructionsScreen />;
            case 'game': return <GameScreen />;
            default: return <TitleScreen />;
        }
    };

    return (
        <div className="w-screen h-screen font-sans">
            {renderScreen()}
            {particles.map(p => ( <div key={p.id} className="absolute rounded-full pointer-events-none" style={{ left: p.x, top: p.y, width: 10, height: 10, backgroundColor: p.color, opacity: p.life, transform: `translate(-50%, -50%) scale(${1 + (1 - p.life)})`, zIndex: 9999 }}/> ))}
        </div>
    );
}
