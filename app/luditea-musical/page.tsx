'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import './styles.css';
import { SoundEngine } from './soundEngine';

interface Instrument {
  id: string;
  icon: string;
  name: string;
  color: string;
}

interface Character {
  id: number;
  instrument: Instrument | null;
}

const instruments: Instrument[] = [
  { id: 'guitar', icon: '🎸', name: 'Guitarra Rock', color: '#FF6B6B' },
  { id: 'drums', icon: '🥁', name: 'Bateria', color: '#4ECDC4' },
  { id: 'piano', icon: '🎹', name: 'Piano', color: '#95E77E' },
  { id: 'saxofone', icon: '🎷', name: 'Saxofone', color: '#FFD93D' },
  { id: 'violin', icon: '🎻', name: 'Violino', color: '#A8E6CF' },
  { id: 'shaker', icon: '🪇', name: 'Chocalho', color: '#FFB6C1' },
  { id: 'coral', icon: '🎤', name: 'Coral', color: '#FF69B4' },
  { id: 'flauta', icon: '🪈', name: 'Flauta', color: '#87CEEB' },
  { id: 'tambor', icon: '🪘', name: 'Tambor Tribal', color: '#8B4513' },
  { id: 'violao', icon: '🎸', name: 'Violão', color: '#D2691E' },
  { id: 'synth', icon: '🎛️', name: 'Sintetizador', color: '#E0BBE4' },
  { id: 'cymbal', icon: '🔔', name: 'Prato', color: '#FDB863' },
  { id: 'tambourine', icon: '🪘', name: 'Pandeiro', color: '#B4E7CE' },
];

let soundEngine: SoundEngine | null = null;

export default function LuditeaMusical() {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [characters, setCharacters] = useState<Character[]>(
    Array.from({ length: 8 }, (_, i) => ({ id: i + 1, instrument: null }))
  );
  const [availableInstruments, setAvailableInstruments] = useState<Instrument[]>(instruments);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      soundEngine = new SoundEngine();
    }
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const speakWelcomeText = () => {
    if ('speechSynthesis' in window && !isSpeaking) {
      setIsSpeaking(true);
      const text = 'Bem-vindo ao desafio musical! Você pode criar músicas e avançar nas fases do jogo, se tornando músico e conquistar o violão dourado. Basta clicar no instrumento que aparece abaixo dos personagens, e clicar em seguida em qualquer um deles. Pronto, este personagem começa a tocar aquele instrumento. E vá selecionando o instrumento primeiro, e quem deve tocar em seguida. Ao final, terá uma música criada por você. Vamos lá?';
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleInstrumentClick = (instrument: Instrument) => {
    if (availableInstruments.find(i => i.id === instrument.id)) {
      setSelectedInstrument(instrument);
      if (soundEngine) {
        soundEngine.playFeedback('select');
      }
    }
  };

  const handleCharacterClick = (characterId: number) => {
    const character = characters.find(c => c.id === characterId);
    
    if (character?.instrument) {
      setAvailableInstruments([...availableInstruments, character.instrument]);
      setCharacters(characters.map(c => 
        c.id === characterId ? { ...c, instrument: null } : c
      ));
      
      if (soundEngine && isPlaying) {
        soundEngine.stopInstrumentLoop(character.instrument.id);
      }
      
      if (soundEngine) {
        soundEngine.playFeedback('remove');
      }
      return;
    }
    
    if (selectedInstrument) {
      setCharacters(characters.map(c => 
        c.id === characterId ? { ...c, instrument: selectedInstrument } : c
      ));
      setAvailableInstruments(availableInstruments.filter(i => i.id !== selectedInstrument.id));
      
      if (soundEngine && isPlaying) {
        soundEngine.startInstrumentLoop(selectedInstrument.id);
      }
      
      if (soundEngine) {
        soundEngine.playFeedback('place');
      }
      
      setSelectedInstrument(null);
    }
  };

  const handleReset = () => {
    setCharacters(Array.from({ length: 8 }, (_, i) => ({ id: i + 1, instrument: null })));
    setAvailableInstruments(instruments);
    setSelectedInstrument(null);
    setIsPlaying(false);
    if (soundEngine) {
      soundEngine.stopAll();
    }
  };

  if (showWelcome && !isLoading) {
    return (
      <div className="musical-game-container welcome-gradient">
        <div className="welcome-screen-mobile">
          <h1 className="title-mobile">🎵 Desafio Musical 🎵</h1>
          
          <div className="mila-container-mobile">
            <Image 
              src="/images/mascotes/mila/MIla_bateria.png"
              alt="Mila com Bateria"
              width={250}
              height={250}
              className="mila-image animated-bounce"
              priority
            />
            <div className="speech-bubble-mobile">
              <p className="welcome-text">
                <strong>Bem-vindo ao desafio musical!</strong> 🎉
              </p>
              <p className="welcome-text">
                Você pode criar músicas e avançar nas fases do jogo, se tornando músico e conquistar o
