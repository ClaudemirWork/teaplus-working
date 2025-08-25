'use client';
import { useState, useEffect } from 'react';
import MascoteLeo from '@/components/MascoteLeo';

const gemColors = ['🔵', '🔴', '🟢', '🟡'];
const goldGem = '💎'; // Cristal mágico

export default function SimonSaysGame() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showLeo, setShowLeo] = useState(true);
  const [message, setMessage] = useState('Memorize a sequência das gemas mágicas!');

  useEffect(() => {
    startNewLevel();
  }, [level]);

  const startNewLevel = () => {
    const newSequence = Array.from({ length: level + 1 }, () =>
      Math.random() < 0.2 ? goldGem : gemColors[Math.floor(Math.random() * gemColors.length)]
    );
    setSequence(newSequence);
    setUserSequence([]);
    setMessage(`Nível ${level}: Prepare-se!`);
    speak(message);
    playSequence(newSequence);
  };

  const playSequence = (seq: string[]) => {
    let delay = 0;
    seq.forEach((gem, index) => {
      setTimeout(() => {
        playSound(gem);
      }, delay);
      delay += 800;
    });
  };

  const playSound = (gem: string) => {
    const audio = new Audio('/sounds/ping.mp3'); // Som genérico
    audio.play();
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClick = (gem: string) => {
    playSound(gem);
    const nextIndex = userSequence.length;
    const correctGem = sequence[nextIndex];

    if (gem === correctGem) {
      const bonus = gem === goldGem ? 3 : 1;
      setScore(score + bonus);
      const newUserSequence = [...userSequence, gem];
      setUserSequence(newUserSequence);

      if (newUserSequence.length === sequence.length) {
        setMessage('Você acertou! Vamos para o próximo nível!');
        speak(message);
        setTimeout(() => setLevel(level + 1), 1500);
      }
    } else {
      setMessage('Ops! Tente novamente.');
      speak(message);
      setTimeout(() => setLevel(1), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white p-6 text-center">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">Desafio das Gemas</h1>
      <p className="text-lg text-gray-700 mb-2">Nível: {level} | Pontos: {score}</p>

      <div className="flex justify-center flex-wrap gap-4 mt-6">
        {[...gemColors, goldGem].map((gem, index) => (
          <button
            key={index}
            onClick={() => handleClick(gem)}
            className="text-6xl p-4 rounded-full bg-white shadow-lg hover:scale-110 transition-transform"
          >
            {gem}
          </button>
        ))}
      </div>

      {showLeo && <MascoteLeo fala={message} />}
    </div>
  );
}
