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
    
    const options = [randomChallenge, ...distractors].sort(() => 0.5 - Math.random());
    
    setCurrentChallenge(randomChallenge);
    setCurrentPhrase(randomPhrase);
    setCardOptions(options);
    setSelectedCard(null);
    setIsCorrectAnswer(false);
    
    // Fala do Leo
    const messages = [
      'Qual cartão completa a frase?',
      'Escolha o cartão certo!',
      'Vamos lá, você consegue!',
      'Leia com atenção e escolha!',
      'Que cartão encaixa aqui?'
    ];
    leoSpeak(messages[Math.floor(Math.random() * messages.length)]);
  }, [leoSpeak]);

  // Função para calcular pontos baseado em acertos consecutivos
  const calculatePoints = (consecutive: number): number => {
    if (consecutive >= 5) return 1000;
    if (consecutive === 4) return 500;
    if (consecutive === 3) return 300;
    if (consecutive === 2) return 200;
    return 100;
  };

  // Função para lidar com a seleção de um card
  const handleCardSelection = (selected: Challenge) => {
    if (selectedCard) return; // Evita múltiplos cliques
    
    setSelectedCard(selected.id);
    
    if (selected.id === currentChallenge?.id) {
      // Resposta correta!
      setIsCorrectAnswer(true);
      const newConsecutive = consecutiveHits + 1;
      setConsecutiveHits(newConsecutive);
      
      const points = calculatePoints(newConsecutive);
      setScore(prev => prev + points);
      setTotalPhrases(prev => prev + 1);
      
      // Mostra confetes e bônus
      setShowConfetti(true);
      setBonusAmount(points);
      setShowBonus(true);
      
      // Cria a frase completa
      const phrase = currentPhrase.replace('_______', selected.displayLabel);
      
      // Primeiro: Leo diz parabéns rapidamente
      const congratulations = [
        'Perfeito!',
        'Isso mesmo!',
        'Muito bem!',
        'Excelente!',
        'Parabéns!'
      ];
      const congrats = congratulations[Math.floor(Math.random() * congratulations.length)];
      leoSpeak(congrats);
      
      // Depois de 1.5 segundos: Leo lê a frase completa pausadamente
      setTimeout(() => {
        // Lê a frase completa com taxa de fala mais lenta para aprendizado
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(phrase);
          utterance.lang = 'pt-BR';
          utterance.rate = 0.7; // Mais lento para a criança aprender
          utterance.pitch = 1.1;
          utterance.volume = 1.0;
          speechRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        }
        setLeoMessage(phrase);
      }, 1500);
      
      // Próxima frase após 6 segundos (tempo para ouvir e aprender)
      setTimeout(() => {
        setShowConfetti(false);
        setShowBonus(false);
        loadNewChallenge();
      }, 6000);
      
    } else {
      // Resposta errada
      setIsCorrectAnswer(false);
      setConsecutiveHits(0);
      
      const wrongMessages = [
        'Ops! Tente novamente!',
        'Não foi dessa vez, continue tentando!',
        'Quase lá! Escolha outro cartão!',
        'Vamos tentar de novo!'
      ];
      leoSpeak(wrongMessages[Math.floor(Math.random() * wrongMessages.length)]);
      
      // Permite nova tentativa após 2 segundos
      setTimeout(() => {
        setSelectedCard(null);
      }, 2000);
    }
  };

  // Iniciar o jogo
  const startGame = () => {
    setGameState('instructions');
    leoSpeak('Vamos aprender as instruções do jogo!');
  };

  const startPlaying = () => {
    setGameState('playing');
    setScore(0);
    setConsecutiveHits(0);
    setTotalPhrases(0);
    loadNewChallenge();
  };

  const endGame = () => {
    // Salvar pontuação máxima
    if (score > maxScore) {
      setMaxScore(score);
      localStorage.setItem('historiasEpicasMaxScore', score.toString());
    }
    setGameState('gameOver');
    leoSpeak(`Parabéns! Você fez ${score} pontos!`);
  };

  const resetGame = () => {
    setGameState('titleScreen');
  };

  // Renderização das telas
  const renderTitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            <Star size={30} className="text-yellow-200 opacity-50" fill="currentColor" />
          </div>
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6">
          <Image 
            src="/images/mascotes/leo/leo_feliz_resultado.webp" 
            alt="Leo" 
            width={350} 
            height={350} 
            className="w-[250px] h-auto sm:w-[300px] md:w-[350px] drop-shadow-2xl animate-bounce-slow"
            priority 
          />
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg mb-4">
          Histórias Épicas
        </h1>
        
        <p className="text-xl sm:text-2xl text-purple-800 mb-8 drop-shadow-md">
          Complete as frases e ganhe pontos!
        </p>
        
        {maxScore > 0 && (
          <div className="mb-4 bg-white/80 rounded-full px-6 py-2">
            <p className="text-lg font-bold text-purple-600">
              🏆 Recorde: {maxScore} pontos
            </p>
          </div>
        )}
        
        <button 
          onClick={startGame}
          className="text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95"
        >
          Começar Aventura
        </button>
      </div>
    </div>
  );

  const renderInstructions = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-300 via-green-300 to-yellow-300">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">
          Como Jogar
        </h2>
        
        <div className="text-lg text-gray-700 space-y-4 mb-8">
          <p className="flex items-start">
            <span className="text-2xl mr-2">📖</span>
            Complete cada frase que aparecer na tela com a figura do cartão correto
          </p>
          <p className="flex items-start">
            <span className="text-2xl mr-2">🎯</span>
            Cada acerto vale pontos e bônus especiais!
          </p>
          <p className="flex items-start">
            <span className="text-2xl mr-2">🔥</span>
            Acerte várias seguidas para ganhar mais pontos:
          </p>
          <div className="ml-8 space-y-2 text-base">
            <p>• 1 acerto = 100 pontos</p>
            <p>• 2 seguidos = 200 pontos</p>
            <p>• 3 seguidos = 300 pontos</p>
            <p>• 5 seguidos = 500 pontos</p>
            <p>• Mais de 5 = 1000 pontos!</p>
          </div>
          <p className="flex items-start">
            <span className="text-2xl mr-2">💡</span>
            Preste atenção para não errar. Se errar, continue tentando!
          </p>
        </div>
        
        <button 
          onClick={startPlaying}
          className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl transition-all duration-300 hover:scale-105"
        >
          Vamos Jogar!
        </button>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="relative w-full h-screen flex flex-col p-4 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      {showConfetti && <Confetti />}
      
      {showBonus && (
        <div className="fixed inset-0 pointer-events-none z-50 flex justify-center items-center">
          <div className="bg-yellow-400 text-white text-4xl font-bold rounded-full px-8 py-4 animate-bounce-in shadow-2xl">
            +{bonusAmount} pontos!
          </div>
        </div>
      )}
      
      {/* Header com pontuação */}
      <div className="bg-white/90 rounded-2xl p-4 mb-4 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pontos</p>
              <p className="text-2xl font-bold text-purple-600">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Sequência</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Zap
                    key={i}
                    size={20}
                    className={i < consecutiveHits ? 'text-yellow-500' : 'text-gray-300'}
                    fill={i < consecutiveHits ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Frases</p>
              <p className="text-2xl font-bold text-green-600">{totalPhrases}</p>
            </div>
          </div>
          
          <button
            onClick={endGame}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            Finalizar
          </button>
        </div>
      </div>
      
      {/* Área principal do jogo */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="bg-white/95 rounded-3xl p-6 shadow-2xl w-full max-w-4xl">
          {/* Frase para completar */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6 shadow-inner">
            <p className="text-2xl md:text-3xl font-bold text-center text-purple-800">
              {currentPhrase}
            </p>
          </div>
          
          {/* Mensagem do Leo */}
          <div className="bg-yellow-50 rounded-xl p-4 mb-6 flex items-center gap-4">
            <Image 
              src="/images/mascotes/leo/leo_feliz_resultado.webp" 
              alt="Leo" 
              width={60} 
              height={60}
              className="rounded-full"
            />
            <p className="text-lg font-medium text-gray-700 flex-1">{leoMessage}</p>
          </div>
          
          {/* Cards de opções */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cardOptions.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardSelection(card)}
                disabled={selectedCard !== null}
                className={`
                  relative p-4 bg-white rounded-xl shadow-lg transition-all duration-300
                  ${selectedCard === null ? 'hover:scale-105 hover:shadow-xl' : ''}
                  ${selectedCard === card.id && isCorrectAnswer ? 'ring-4 ring-green-500 bg-green-50 scale-110' : ''}
                  ${selectedCard === card.id && !isCorrectAnswer ? 'ring-4 ring-red-500 bg-red-50 animate-shake' : ''}
                  ${selectedCard && selectedCard !== card.id && isCorrectAnswer && card.id === currentChallenge?.id ? 'ring-4 ring-green-500 bg-green-50' : ''}
                `}
              >
                <div className="aspect-square relative mb-2">
                  <Image 
                    src={card.image} 
                    alt={card.displayLabel}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="25vw"
                  />
                </div>
                <p className="text-sm font-bold text-gray-800">{card.displayLabel}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGameOver = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300">
      <div className="bg-white/95 rounded-3xl p-8 shadow-2xl text-center max-w-md">
        <Trophy size={100} className="text-yellow-500 mx-auto mb-4" fill="currentColor" />
        
        <h2 className="text-4xl font-bold text-purple-600 mb-4">
          Parabéns!
        </h2>
        
        <div className="space-y-2 mb-6">
          <p className="text-2xl font-bold text-gray-800">
            Você fez {score} pontos!
          </p>
          <p className="text-lg text-gray-600">
            Completou {totalPhrases} frases
          </p>
          {score > maxScore && (
            <p className="text-xl font-bold text-green-600 animate-pulse">
              🎉 Novo Recorde! 🎉
            </p>
          )}
        </div>
        
        <div className="space-y-3">
          <button
            onClick={startPlaying}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
          >
            Jogar Novamente
          </button>
          <button
            onClick={resetGame}
            className="w-full py-3 bg-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-400 transition-colors"
          >
            Menu Principal
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {gameState === 'titleScreen' && renderTitleScreen()}
      {gameState === 'instructions' && renderInstructions()}
      {gameState === 'playing' && renderGame()}
      {gameState === 'gameOver' && renderGameOver()}
      
      <style jsx global>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 100;
        }
        
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -20px;
          animation: confetti-fall 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .piece-0 { background: #ff6b6b; }
        .piece-1 { background: #4ecdc4; }
        .piece-2 { background: #45b7d1; }
        .piece-3 { background: #96ceb4; }
        .piece-4 { background: #feca57; }
        .piece-5 { background: #ff9ff3; }
        
        @keyframes confetti-fall {
          to {
            transform: translateY(120vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        ${[...Array(60)].map((_, i) => `
          .confetti-piece:nth-child(${i + 1}) {
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 0.5}s;
            animation-duration: ${3 + Math.random() * 2}s;
          }
        `).join('')}
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0) rotate(0); }
          50% { transform: scale(1.2) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}
