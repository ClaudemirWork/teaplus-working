'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Star, Trophy, Zap } from 'lucide-react';
// Importa o arquivo de dados da mesma pasta
import { challengesData, type Challenge } from './historiasEpicasData';

// Componente de Confetes
const Confetti = () => (
  <div className="confetti-container">
    {[...Array(60)].map((_, i) => (
      <div key={i} className={`confetti-piece piece-${i % 6}`} />
    ))}
  </div>
);

// ===== COMPONENTE PRINCIPAL =====
export default function HistoriasEpicasGame() {
  const [gameState, setGameState] = useState<'titleScreen' | 'instructions' | 'playing' | 'gameOver'>('titleScreen');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState<string>('');
  const [cardOptions, setCardOptions] = useState<Challenge[]>([]);
  const [score, setScore] = useState(0);
  const [consecutiveHits, setConsecutiveHits] = useState(0);
  const [totalPhrases, setTotalPhrases] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [leoMessage, setLeoMessage] = useState('Vamos começar nossa aventura!');
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [maxScore, setMaxScore] = useState(0);

  // Referência para evitar múltiplas falas simultâneas
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Carregar pontuação máxima do localStorage
  useEffect(() => {
    const savedMaxScore = localStorage.getItem('historiasEpicasMaxScore');
    if (savedMaxScore) {
      setMaxScore(parseInt(savedMaxScore));
    }
  }, []);

  // Função para falar com o Leo
  const leoSpeak = useCallback((message: string) => {
    setLeoMessage(message);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Função para selecionar uma nova frase aleatória
  const loadNewChallenge = useCallback(() => {
    // Seleciona um desafio aleatório
    const randomChallenge = challengesData[Math.floor(Math.random() * challengesData.length)];
    
    // Seleciona uma frase aleatória do desafio
    const randomPhrase = randomChallenge.phrases[Math.floor(Math.random() * randomChallenge.phrases.length)];
    
    // Cria opções de cards (1 correto + 3 distratores aleatórios)
    const distractors = challengesData
      .filter(c => c.id !== randomChallenge.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const options = [randomChallenge, ...distractors].sort(() => 0.5 - Math.random())
