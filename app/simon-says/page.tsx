'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Crystal {
  id: number;
  emoji: string;
  sound: string;
  gradient: string;
}

const crystals: Crystal[] = [
  { id: 0, emoji: '🔵', sound: 'C4', gradient: 'from-blue-400 to-blue-600' },
  { id: 1, emoji: '🔴', sound: 'D4', gradient: 'from-red-400 to-red-600' },
  { id: 2, emoji: '🟢', sound: 'E4', gradient: 'from-green-400 to-green-600' },
  { id: 3, emoji: '🟡', sound: 'F4', gradient: 'from-yellow-400 to-yellow-600' },
  { id: 4, emoji: '🟣', sound: 'G4', gradient: 'from-purple-400 to-purple-600' },
  { id: 5, emoji: '🟠', sound: 'A4', gradient: 'from-orange-400 to-orange-600' },
  { id: 6, emoji: '💎', sound: 'B4', gradient: 'from-pink-400 to-pink-600' },
];

export default function SimonSaysGame() {
  const audioCtx = useRef<AudioContext | null>(null);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Olá! Eu sou o Leo, seu mascote mágico. Vamos começar?');
  const [activeCrystal, setActiveCrystal] = useState<number | null>(null);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [powerUps, setPowerUps] = useState({ replay: 1, slow: 1 });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const playNote = useCallback((note: string) => {
    if (!audioCtx.current) return;
    const frequencies: Record<string, number> = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
      G4: 392.00, A4: 440.00, B4: 493.88,
    };
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequencies[note] || 440;
    gain.gain.setValueAtTime(0.3, audioCtx.current.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.4);
  }, []);

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setPowerUps({ replay: 1, slow: 1 });
    setShowModal(false);
    setMessage('Observe a sequência com atenção!');
    speak('Observe a sequência com atenção!');
    const newSeq = [Math.floor(Math.random() * crystals.length)];
    setSequence(newSeq);
    setPlayerSequence([]);
    setTimeout(() => showSequence(newSeq), 1000);
  };

  const showSequence = async (seq: number[]) => {
    setIsShowingSequence(true);
    for (let i = 0; i < seq.length; i++) {
      const id = seq[i];
      setActiveCrystal(id);
      playNote(crystals[id].sound);
      await new Promise(res => setTimeout(res, 400));
      setActiveCrystal(null);
      await new Promise(res => setTimeout(res, speed));
    }
    setIsShowingSequence(false);
    setIsPlaying(true);
    setMessage('Sua vez! Repita a sequência.');
    speak('Sua vez! Repita a sequência.');
  };

  const handleClick = (id: number) => {
    if (!isPlaying || isShowingSequence) return;
    playNote(crystals[id].sound);
    setActiveCrystal(id);
    setTimeout(() => setActiveCrystal(null), 300);
    const nextIndex = playerSequence.length;
    const correctId = sequence[nextIndex];
    const newPlayerSeq = [...playerSequence, id];
    setPlayerSequence(newPlayerSeq);

    if (id === correctId) {
      setMessage(`Boa! Você clicou no cristal ${crystals[id].emoji}.`);
      speak(message);
      if (newPlayerSeq.length === sequence.length) {
        const newLevel = level + 1;
        const newScore = score + newLevel * 10;
        setLevel(newLevel);
        setScore(newScore);
        setIsPlaying(false);
        setMessage('Excelente! Prepare-se para a próxima rodada.');
        speak(message);
        const nextSeq = [...sequence, Math.floor(Math.random() * crystals.length)];
        setSequence(nextSeq);
        setPlayerSequence([]);
        setTimeout(() => showSequence(nextSeq), 1500);
      }
    } else {
      setMessage('Ops! Você errou. Vamos tentar de novo.');
      speak(message);
      setIsPlaying(false);
      setShowModal(true);
    }
  };

  const usePowerUp = (type: 'replay' | 'slow') => {
    if (powerUps[type] <= 0 || isShowingSequence || !isPlaying) return;
    setPowerUps(prev => ({ ...prev, [type]: prev[type] - 1 }));
    if (type === 'replay') {
      setMessage('Repetindo a sequência...');
      speak(message);
      showSequence(sequence);
    } else {
      setSpeed(1000);
      setMessage('Velocidade reduzida ativada!');
      speak(message);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setSequence([]);
    setPlayerSequence([]);
    setPowerUps({ replay: 1, slow: 1 });
    setSpeed(600);
    setShowModal(false);
    setMessage('Jogo reiniciado! Clique em começar.');
    speak(message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 text-white p-6 font-sans">
      <h1 className="text-4xl font-bold text-center mb-4">💠 Desafio dos Cristais Mágicos</h1>
      <p className="text-center mb-2">Nível: {level} | Pontos: {score}</p>
      <div className="bg-white text-gray-900 rounded-xl p-4 mb-6 max-w-xl mx-auto shadow-lg">
        <p className="text-lg">🦁 Leo diz: {message}</p>
        <img src="/mascoteleo.webp" alt="Mascote Leo" className="w-24 mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
        {crystals.map((crystal) => (
          <button
            key={crystal.id}
            onClick={() => handleClick(crystal.id)}
            disabled={!isPlaying || isShowingSequence}
            className={`aspect-square rounded-xl flex items-center justify-center text-4xl font-bold shadow-md transition-transform ${
              activeCrystal === crystal.id ? 'scale-110 ring-4 ring-white' : ''
            } ${!isPlaying || isShowingSequence ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            style={{ backgroundImage: `linear-gradient(to bottom right, ${crystal.gradient})` }}
          >
            {cr
