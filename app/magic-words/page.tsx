'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function PalavrasMagicas() {
  // Game State
  const [gameState, setGameState] = useState({
    currentLevel: 1,
    score: 0,
    lives: 3,
    cardsDiscovered: new Set(),
    tutorialStep: 0,
    currentRound: 0,
    correctStreak: 0,
    powerups: {
      hint: 3,
      time: 2,
      life: 1
    },
    isStoryMode: false,
    storyPhase: 5,
    soundEnabled: true
  });

  const [currentScreen, setCurrentScreen] = useState('menu');
  const [tutorialActive, setTutorialActive] = useState(false);
  const [currentNPC, setCurrentNPC] = useState(null);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [correctCardId, setCorrectCardId] = useState(null);
  const [rewardModal, setRewardModal] = useState(null);
  const [storyText, setStoryText] = useState('Era uma vez...');

  // Card Database
  const cardDatabase = {
    necessidades: [
      {id: 'sede', icon: '💧', label: 'Sede', gesture: '👉💧', gestureDesc: 'apontando para a garganta'},
      {id: 'fome', icon: '🍽️', label: 'Fome', gesture: '🤲🍽️', gestureDesc: 'mãos na barriga'},
      {id: 'banheiro', icon: '🚽', label: 'Banheiro', gesture: '🚽', gestureDesc: 'se contorcendo'},
      {id: 'sono', icon: '😴', label: 'Sono', gesture: '😴', gestureDesc: 'bocejando'},
      {id: 'doente', icon: '🤒', label: 'Doente', gesture: '🤒', gestureDesc: 'mão na testa'},
      {id: 'frio', icon: '🥶', label: 'Frio', gesture: '🥶', gestureDesc: 'tremendo'},
      {id: 'calor', icon: '🥵', label: 'Calor', gesture: '🥵', gestureDesc: 'se abanando'},
      {id: 'ajuda', icon: '🆘', label: 'Ajuda', gesture: '🙏', gestureDesc: 'mãos juntas'}
    ],
    emocoes: [
      {id: 'feliz', icon: '😊', label: 'Feliz', gesture: '😊', gestureDesc: 'sorrindo'},
      {id: 'triste', icon: '😢', label: 'Triste', gesture: '😢', gestureDesc: 'enxugando lágrimas'},
      {id: 'bravo', icon: '😠', label: 'Bravo', gesture: '😠', gestureDesc: 'punhos cerrados'},
      {id: 'medo', icon: '😨', label: 'Medo', gesture: '😨', gestureDesc: 'se encolhendo'},
      {id: 'surpreso', icon: '😲', label: 'Surpreso', gesture: '😲', gestureDesc: 'boca aberta'},
      {id: 'confuso', icon: '😕', label: 'Confuso', gesture: '😕', gestureDesc: 'coçando a cabeça'},
      {id: 'amigo', icon: '🤝', label: 'Amigo', gesture: '🤝', gestureDesc: 'estendendo a mão'},
      {id: 'amor', icon: '❤️', label: 'Amor', gesture: '❤️', gestureDesc: 'mãos no coração'}
    ]
  };

  const npcNames = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Sofia'];

  const tutorialSteps = [
    { 
      text: "Olá! Eu sou a Mila, a feiticeira das palavras!", 
      cleanText: "Olá! Eu sou a Mila, a feiticeira das palavras!",
      showMila: true 
    },
    { 
      text: "O Reino perdeu a voz mágica! Todos fazem gestos agora!", 
      cleanText: "O Reino perdeu a voz mágica! Todos fazem gestos agora!",
      showMila: true 
    },
    { 
      text: "Você será o tradutor mágico que entende os gestos!", 
      cleanText: "Você será o tradutor mágico que entende os gestos!",
      showMila: true 
    },
    { 
      text: "Veja! João está apontando para a garganta...", 
      cleanText: "Veja! João está apontando para a garganta",
      showMila: true,
      showExample: true 
    },
    { 
      text: "Clique no card SEDE para ajudá-lo!", 
      cleanText: "Clique no card SEDE para ajudá-lo!",
      showMila: true,
      showExample: true,
      highlight: 'sede' 
    },
    { 
      text: "Muito bem! Agora você já sabe jogar! Vamos começar!", 
      cleanText: "Muito bem! Agora você já sabe jogar! Vamos começar!",
      showMila: true,
      endTutorial: true 
    }
  ];

  // Speech synthesis - only clean text without emojis
  const speak = (text) => {
    if (!gameState.soundEnabled) return;
    
    if ('speechSynthesis' in window) {
      // Remove emojis and special characters for speech
      const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.85;
      utterance.pitch = 1.2;
      utterance.volume = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Shuffle array utility
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize game
  useEffect(() => {
    const savedState = localStorage.getItem('palavrasMagicasState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setGameState({...parsed, cardsDiscovered: new Set(parsed.cardsDiscovered)});
    } else {
      // Start tutorial for new players
      setTimeout(() => {
        setTutorialActive(true);
        setCurrentScreen('tutorial');
      }, 500);
    }
  }, []);

  // Start game
  const startGame = () => {
    setCurrentScreen('game');
    loadLevel(gameState.currentLevel);
  };

  // Load level
  const loadLevel = (level) => {
    if (level >= 5 && level <= 8) {
      setGameState(prev => ({ ...prev, isStoryMode: true }));
      setCurrentScreen('story');
      return;
    }
    
    const category = level <= 2 ? 'necessidades' : 'emocoes';
    const numCards = level <= 2 ? 4 : 6;
    
    startRound(category, numCards);
  };

  // Start round
  const startRound = (category, numCards) => {
    const availableCards = [...cardDatabase[category]];
    const roundCards = shuffleArray(availableCards).slice(0, numCards);
    const correctCard = roundCards[Math.floor(Math.random() * roundCards.length)];
    
    const npcName = npcNames[Math.floor(Math.random() * npcNames.length)];
    
    setCurrentNPC({
      name: npcName,
      gesture: correctCard.gesture,
      gestureDesc: correctCard.gestureDesc
    });
    
    setDisplayedCards(shuffleArray(roundCards));
    setCorrectCardId(correctCard.id);
    
    speak(`${npcName} está ${correctCard.gestureDesc}. O que será?`);
    
    setGameState(prev => ({
      ...prev,
      currentRound: prev.currentRound + 1
    }));
  };

  // Handle card click
  const handleCardClick = (card) => {
    const isCorrect = card.id === correctCardId;
    
    if (isCorrect) {
      speak("Muito bem! Você acertou!");
      
      const newDiscovered = new Set(gameState.cardsDiscovered);
      newDiscovered.add(card.id);
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + 100,
        correctStreak: prev.correctStreak + 1,
        cardsDiscovered: newDiscovered
      }));
      
      // Check for special rewards
      if (gameState.correctStreak === 2) {
        showReward('Card Dourado', '⭐', 'Vale 500 pontos extras!');
        setGameState(prev => ({ ...prev, score: prev.score + 500 }));
      }
      
      // Next round or complete level
      setTimeout(() => {
        if (gameState.currentRound < 5) {
          const category = gameState.currentLevel <= 2 ? 'necessidades' : 'emocoes';
          const numCards = gameState.currentLevel <= 2 ? 4 : 6;
          startRound(category, numCards);
        } else {
          completeLevel();
        }
      }, 2000);
    } else {
      speak("Ops! Tente novamente!");
      
      setGameState(prev => ({
        ...prev,
        lives: Math.max(0, prev.lives - 1),
        correctStreak: 0
      }));
      
      if (gameState.lives <= 1) {
        setTimeout(() => {
          showReward('Fim de Jogo', '😢', `Pontuação: ${gameState.score} pontos`);
          setTimeout(() => {
            setCurrentScreen('menu');
            setGameState(prev => ({...prev, currentRound: 0, lives: 3}));
          }, 3000);
        }, 1000);
      }
    }
  };

  // Complete level
  const completeLevel = () => {
    const bonus = gameState.lives * 200;
    
    showReward(
      `Fase ${gameState.currentLevel} Completa!`,
      '🏆',
      `Bônus: ${bonus} pontos!`
    );
    
    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      score: prev.score + bonus,
      currentRound: 0,
      lives: 3
    }));
    
    setTimeout(() => {
      loadLevel(gameState.currentLevel + 1);
    }, 3000);
  };

  // Use power-up
  const usePowerup = (type) => {
    if (gameState.powerups[type] <= 0) return;
    
    setGameState(prev => ({
      ...prev,
      powerups: {
        ...prev.powerups,
        [type]: prev.powerups[type] - 1
      }
    }));
    
    switch(type) {
      case 'hint':
        // Remove 2 wrong cards
        const wrongCards = displayedCards.filter(c => c.id !== correctCardId);
        const toHide = shuffleArray(wrongCards).slice(0, 2);
        setDisplayedCards(prev => prev.map(card => ({
          ...card,
          hidden: toHide.some(h => h.id === card.id)
        })));
        speak("Dica da Mila ativada!");
        break;
      case 'life':
        if (gameState.lives < 3) {
          setGameState(prev => ({ ...prev, lives: prev.lives + 1 }));
          speak("Vida restaurada!");
        }
        break;
      case 'time':
        speak("Tempo extra!");
        break;
    }
  };

  // Show reward
  const showReward = (title, icon, description) => {
    setRewardModal({ title, icon, description });
    speak(title);
  };

  // Tutorial component
  const TutorialScreen = () => {
    const [step, setStep] = useState(0);
    const currentStep = tutorialSteps[step];
    
    useEffect(() => {
      if (currentStep.cleanText) {
        speak(currentStep.cleanText);
      }
      
      if (currentStep.endTutorial) {
        setTimeout(() => {
          setTutorialActive(false);
          setCurrentScreen('menu');
          setGameState(prev => ({ ...prev, tutorialStep: tutorialSteps.length }));
        }, 3000);
      }
    }, [step]);
    
    return (
      <div className="tutorial-screen">
        {currentStep.showMila && (
          <div className="mila-container">
            <div className="mila-character">
              <div className="mila-hat">
                <div className="star">⭐</div>
              </div>
              <div className="mila-body">
                <div className="mila-face">
                  <div className="mila-eyes">
                    <div className="eye left"></div>
                    <div className="eye right"></div>
                  </div>
                  <div className="mila-mouth"></div>
                </div>
                <div className="mila-arms">
                  <div className="arm left"></div>
                  <div className="arm right"></div>
                </div>
              </div>
              <div className="magic-sparkles">
                <span className="sparkle s1">✨</span>
                <span className="sparkle s2">✨</span>
                <span className="sparkle s3">✨</span>
              </div>
            </div>
            
            <div className="speech-bubble">
              <p className="bubble-text">{currentStep.text}</p>
            </div>
          </div>
        )}
        
        {currentStep.showExample && (
          <div className="example-container">
            <div className="npc-demo">
              <div className="npc-avatar">
                <div className="npc-head"></div>
                <div className="npc-body"></div>
              </div>
              <div className="npc-name">João</div>
              <div className="npc-gesture-demo">👉💧</div>
            </div>
            
            {currentStep.highlight === 'sede' && (
              <div className="cards-demo">
                <div className={`card-demo ${currentStep.highlight === 'sede' ? 'highlight' : ''}`}>
                  <span className="card-icon">💧</span>
                  <span className="card-label">Sede</span>
                </div>
                <div className="card-demo disabled">
                  <span className="card-icon">🍽️</span>
                  <span className="card-label">Fome</span>
                </div>
                <div className="card-demo disabled">
                  <span className="card-icon">😴</span>
                  <span className="card-label">Sono</span>
                </div>
                <div className="card-demo disabled">
                  <span className="card-icon">🆘</span>
                  <span className="card-label">Ajuda</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {step < tutorialSteps.length - 1 && !currentStep.endTutorial && (
          <button 
            className="continue-btn"
            onClick={() => setStep(step + 1)}
          >
            Continuar ➡️
          </button>
        )}

        <style jsx>{`
          .tutorial-screen {
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, #87CEEB 0%, #98E4D6 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            z-index: 1000;
          }

          .mila-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
            animation: fadeIn 0.5s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }

          .mila-character {
            position: relative;
            width: 200px;
            height: 250px;
          }

          .mila-hat {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 40px solid transparent;
            border-right: 40px solid transparent;
            border-bottom: 60px solid #4B0082;
            z-index: 10;
          }

          .star {
            position: absolute;
            top: 15px;
            left: -10px;
            font-size: 30px;
            animation: twinkle 2s infinite;
          }

          @keyframes twinkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.9); }
          }

          .mila-body {
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 150px;
            background: linear-gradient(135deg, #FF69B4, #FFB6C1);
            border-radius: 50%;
            box-shadow: 0 10px 30px rgba(255, 105, 180, 0.3);
          }

          .mila-face {
            position: absolute;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
          }

          .mila-eyes {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
          }

          .eye {
            width: 20px;
            height: 25px;
            background: white;
            border-radius: 50%;
            position: relative;
            animation: blink 4s infinite;
          }

          .eye::after {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            background: #333;
            border-radius: 50%;
            top: 10px;
            left: 5px;
          }

          @keyframes blink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }

          .mila-mouth {
            width: 30px;
            height: 15px;
            border-bottom: 3px solid #333;
            border-radius: 0 0 30px 30px;
            margin: 0 auto;
            animation: talk 0.8s infinite alternate;
          }

          @keyframes talk {
            from { width: 30px; }
            to { width: 20px; }
          }

          .mila-arms {
            position: absolute;
            top: 80px;
            width: 150px;
          }

          .arm {
            position: absolute;
            width: 30px;
            height: 60px;
            background: linear-gradient(135deg, #FF69B4, #FFB6C1);
            border-radius: 15px;
          }

          .arm.left {
            left: -10px;
            transform: rotate(-20deg);
            animation: wave 2s infinite;
          }

          .arm.right {
            right: -10px;
            transform: rotate(20deg);
          }

          @keyframes wave {
            0%, 100% { transform: rotate(-20deg); }
            50% { transform: rotate(-40deg); }
          }

          .magic-sparkles {
            position: absolute;
            width: 100%;
            height: 100%;
          }

          .sparkle {
            position: absolute;
            font-size: 25px;
            animation: float-sparkle 3s infinite;
          }

          .sparkle.s1 {
            top: -20px;
            right: -30px;
            animation-delay: 0s;
          }

          .sparkle.s2 {
            bottom: 20px;
            left: -30px;
            animation-delay: 1s;
          }

          .sparkle.s3 {
            top: 60px;
            right: -40px;
            animation-delay: 2s;
          }

          @keyframes float-sparkle {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
          }

          .speech-bubble {
            background: white;
            border-radius: 20px;
            padding: 20px 30px;
            position: relative;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            max-width: 350px;
            animation: slideUp 0.5s ease;
          }

          .speech-bubble::before {
            content: '';
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-bottom: 15px solid white;
          }

          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          .bubble-text {
            font-size: 20px;
            color: #333;
            text-align: center;
            line-height: 1.4;
            font-weight: 500;
          }

          .example-container {
            margin-top: 30px;
            animation: fadeIn 0.5s ease;
          }

          .npc-demo {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
          }

          .npc-avatar {
            width: 100px;
            height: 100px;
            position: relative;
          }

          .npc-head {
            width: 60px;
            height: 60px;
            background: #FFE4B5;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 20px;
          }

          .npc-body {
            width: 80px;
            height: 50px;
            background: #4169E1;
            border-radius: 20px 20px 10px 10px;
            position: absolute;
            bottom: 0;
            left: 10px;
          }

          .npc-name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-top: 10px;
          }

          .npc-gesture-demo {
            font-size: 50px;
            margin-top: 10px;
            animation: gesture-demo 1.5s infinite;
          }

          @keyframes gesture-demo {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.2) rotate(10deg); }
          }

          .cards-demo {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 20px;
            padding: 0 20px;
          }

          .card-demo {
            background: white;
            border-radius: 15px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
          }

          .card-demo.highlight {
            background: linear-gradient(135deg, #90EE90, #98FB98);
            transform: scale(1.1);
            box-shadow: 0 5px 20px rgba(144, 238, 144, 0.5);
            animation: pulse-highlight 1s infinite;
          }

          @keyframes pulse-highlight {
            0%, 100% { transform: scale(1.1); }
            50% { transform: scale(1.15); }
          }

          .card-demo.disabled {
            opacity: 0.3;
          }

          .card-icon {
            font-size: 35px;
            margin-bottom: 5px;
          }

          .card-label {
            font-size: 14px;
            font-weight: bold;
            color: #333;
          }

          .continue-btn {
            margin-top: 30px;
            padding: 15px 40px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            border: none;
            border-radius: 30px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
            transition: all 0.3s ease;
          }

          .continue-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
          }
        `}</style>
      </div>
    );
  };

  // Menu screen
  const MenuScreen = () => (
    <div className="menu-screen">
      <div className="logo-container">
        <h1 className="game-logo">🎪 Palavras Mágicas</h1>
        <p className="game-subtitle">Uma aventura CAA gamificada</p>
      </div>
      
      <div className="menu-buttons">
        <button className="menu-btn primary" onClick={startGame}>
          🎮 Jogar
        </button>
        <button className="menu-btn" onClick={() => {
          const discovered = gameState.cardsDiscovered.size;
          const total = Object.values(cardDatabase).flat().length;
          showReward('Minha Coleção', '📚', `${discovered}/${total} cards descobertos!`);
        }}>
          📚 Coleção
        </button>
        <button className="menu-btn" onClick={() => {
          setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
          showReward('Configurações', '⚙️', `Som: ${gameState.soundEnabled ? 'Desligado' : 'Ligado'}`);
        }}>
          ⚙️ Som: {gameState.soundEnabled ? 'ON' : 'OFF'}
        </button>
        <button className="menu-btn" onClick={() => {
          showReward('Sobre', 'ℹ️', 'Desenvolvido com amor para crianças especiais');
        }}>
          ℹ️ Sobre
        </button>
      </div>

      <style jsx>{`
        .menu-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #87CEEB 0%, #98E4D6 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .logo-container {
          text-align: center;
          margin-bottom: 40px;
        }

        .game-logo {
          font-size: 42px;
          font-weight: bold;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          margin-bottom: 10px;
        }

        .game-subtitle {
          font-size: 18px;
          color: white;
          opacity: 0.95;
        }

        .menu-buttons {
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 100%;
          max-width: 300px;
        }

        .menu-btn {
          padding: 18px 30px;
          background: white;
          color: #2196F3;
          border: none;
          border-radius: 30px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .menu-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .menu-btn.primary {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          font-size: 22px;
        }
      `}</style>
    </div>
  );

  // Game screen
  const GameScreen = () => (
    <div className="game-screen">
      <header className="game-header">
        <div className="level-info">
          <span className="level-badge">Fase {gameState.currentLevel}</span>
        </div>
        <div className="score">⭐ {gameState.score}</div>
        <div className="lives">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={`heart ${i >= gameState.lives ? 'lost' : ''}`}>
              {i < gameState.lives ? '❤️' : '💔'}
            </span>
          ))}
        </div>
      </header>
      
      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(gameState.currentRound / 5) * 100}%` }}
          >
            {gameState.currentRound}/5
          </div>
        </div>
      </div>
      
      {currentNPC && (
        <div className="npc-area">
          <div className="npc-container">
            <div className="npc-character">
              <div className="npc-head"></div>
              <div className="npc-body"></div>
              <div className="npc-arms">
                <div className="npc-arm left"></div>
                <div className="npc-arm right"></div>
              </div>
            </div>
            <div className="npc-info">
              <div className="npc-name">{currentNPC.name}</div>
              <div className="npc-gesture">{currentNPC.gesture}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="cards-grid">
        {displayedCards.map((card) => (
          <div
            key={card.id}
            className={`game-card ${card.hidden ? 'hidden' : ''} ${card.id === correctCardId ? 'correct-card' : ''}`}
            onClick={() => !card.hidden && handleCardClick(card)}
          >
            <div className="card-content">
              <span className="card-icon">{card.icon}</span>
              <span className="card-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="powerups">
        <button 
          className={`powerup ${gameState.powerups.hint === 0 ? 'disabled' : ''}`}
          onClick={() => usePowerup('hint')}
          disabled={gameState.powerups.hint === 0}
        >
          <span className="powerup-icon">💡</span>
          <span className="powerup-count">{gameState.powerups.hint}</span>
        </button>
        <button 
          className={`powerup ${gameState.powerups.time === 0 ? 'disabled' : ''}`}
          onClick={() => usePowerup('time')}
          disabled={gameState.powerups.time === 0}
        >
          <span className="powerup-icon">⏱️</span>
          <span className="powerup-count">{gameState.powerups.time}</span>
        </button>
        <button 
          className={`powerup ${gameState.powerups.life === 0 ? 'disabled' : ''}`}
          onClick={() => usePowerup('life')}
          disabled={gameState.powerups.life === 0}
        >
          <span className="powerup-icon">💚</span>
          <span className="powerup-count">{gameState.powerups.life}</span>
        </button>
      </div>

      <style jsx>{`
        .game-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #F0F8FF 0%, #E6F3FF 100%);
          display: flex;
          flex-direction: column;
        }

        .game-header {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        }

        .level-badge {
          background: rgba(255,255,255,0.3);
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          font-size: 16px;
        }

        .score {
          background: rgba(255,255,255,0.3);
          padding: 8px 20px;
          border-radius: 20px;
          color: white;
          font-size: 18px;
          font-weight: bold;
        }

        .lives {
          display: flex;
          gap: 5px;
        }

        .heart {
          font-size: 24px;
          transition: all 0.3s ease;
        }

        .heart.lost {
          opacity: 0.3;
          filter: grayscale(1);
        }

        .progress-section {
          padding: 15px 20px;
          background: rgba(255,255,255,0.8);
        }

        .progress-bar {
          background: #E0E0E0;
          height: 30px;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50, #8BC34A);
          border-radius: 15px;
          transition: width 0.5s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }

        .npc-area {
          padding: 20px;
          display: flex;
          justify-content: center;
        }

        .npc-container {
          background: white;
          border-radius: 20px;
          padding: 20px 40px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .npc-character {
          width: 100px;
          height: 120px;
          position: relative;
        }

        .npc-head {
          width: 60px;
          height: 60px;
          background: #FFE4B5;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 20px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }

        .npc-head::before {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
          top: 20px;
          left: 15px;
        }

        .npc-head::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
          top: 20px;
          right: 15px;
        }

        .npc-body {
          width: 80px;
          height: 60px;
          background: #4169E1;
          border-radius: 20px 20px 10px 10px;
          position: absolute;
          bottom: 0;
          left: 10px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }

        .npc-arms {
          position: absolute;
          top: 60px;
          width: 100px;
        }

        .npc-arm {
          position: absolute;
          width: 20px;
          height: 40px;
          background: #4169E1;
          border-radius: 10px;
        }

        .npc-arm.left {
          left: 5px;
          transform: rotate(-15deg);
          animation: wave-arm 2s infinite;
        }

        .npc-arm.right {
          right: 5px;
          transform: rotate(15deg);
        }

        @keyframes wave-arm {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(-30deg); }
        }

        .npc-info {
          text-align: center;
        }

        .npc-name {
          font-size: 20px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }

        .npc-gesture {
          font-size: 50px;
          animation: gesture-anim 1.5s infinite;
        }

        @keyframes gesture-anim {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(5deg); }
        }

        .cards-grid {
          flex: 1;
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          max-width: 600px;
          margin: 0 auto;
        }

        .game-card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .game-card:hover:not(.hidden) {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }

        .game-card.hidden {
          opacity: 0.3;
          pointer-events: none;
          background: #f0f0f0;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .card-icon {
          font-size: 40px;
        }

        .card-label {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }

        .powerups {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
          background: white;
          padding: 10px;
          border-radius: 30px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }

        .powerup {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #81C784, #66BB6A);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .powerup:hover:not(.disabled) {
          transform: scale(1.1);
        }

        .powerup.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #ccc;
        }

        .powerup-icon {
          font-size: 24px;
        }

        .powerup-count {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: white;
          color: #333;
          font-size: 12px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );

  // Story mode screen
  const StoryScreen = () => (
    <div className="story-screen">
      <header className="game-header">
        <div className="level-info">
          <span className="level-badge">Modo História</span>
        </div>
        <button className="back-btn" onClick={() => setCurrentScreen('menu')}>
          Voltar
        </button>
      </header>
      
      <div className="story-content">
        <div className="story-canvas">
          <p className="story-text">{storyText}</p>
        </div>
        
        <div className="story-options">
          <button className="story-option" onClick={() => {
            setStoryText(prev => prev + " menino");
            speak("menino");
          }}>menino</button>
          <button className="story-option" onClick={() => {
            setStoryText(prev => prev + " menina");
            speak("menina");
          }}>menina</button>
          <button className="story-option" onClick={() => {
            setStoryText(prev => prev + " animal");
            speak("animal");
          }}>animal</button>
        </div>
      </div>

      <style jsx>{`
        .story-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #FFE4E1 0%, #FFDAB9 100%);
          display: flex;
          flex-direction: column;
        }

        .back-btn {
          background: rgba(255,255,255,0.3);
          border: none;
          padding: 8px 20px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .story-content {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .story-canvas {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          min-height: 200px;
        }

        .story-text {
          font-size: 20px;
          line-height: 1.6;
          color: #333;
        }

        .story-options {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .story-option {
          background: white;
          border: 3px solid #4CAF50;
          border-radius: 15px;
          padding: 12px 25px;
          font-size: 18px;
          font-weight: bold;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .story-option:hover {
          background: #4CAF50;
          color: white;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );

  return (
    <div 
      className="game-container"
      style={{
        width: '100%',
        maxWidth: '768px',
        margin: '0 auto',
        position: 'relative',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {currentScreen === 'tutorial' && <TutorialScreen />}
      {currentScreen === 'menu' && <MenuScreen />}
      {currentScreen === 'game' && <GameScreen />}
      {currentScreen === 'story' && <StoryScreen />}
      
      {rewardModal && (
        <div className="reward-modal" onClick={() => setRewardModal(null)}>
          <div className="reward-content">
            <div className="reward-icon">{rewardModal.icon}</div>
            <h2 className="reward-title">{rewardModal.title}</h2>
            <p className="reward-description">{rewardModal.description}</p>
            <button className="close-btn" onClick={() => setRewardModal(null)}>
              Fechar
            </button>
          </div>

          <style jsx>{`
            .reward-modal {
              position: fixed;
              inset: 0;
              background: rgba(0,0,0,0.7);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 2000;
              padding: 20px;
            }

            .reward-content {
              background: white;
              padding: 30px;
              border-radius: 20px;
              text-align: center;
              max-width: 90%;
              animation: zoomIn 0.3s ease;
            }

            @keyframes zoomIn {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }

            .reward-icon {
              font-size: 60px;
              margin-bottom: 15px;
            }

            .reward-title {
              font-size: 24px;
              color: #333;
              margin-bottom: 10px;
            }

            .reward-description {
              font-size: 16px;
              color: #666;
              margin-bottom: 20px;
            }

            .close-btn {
              padding: 10px 30px;
              background: linear-gradient(135deg, #4CAF50, #45a049);
              color: white;
              border: none;
              border-radius: 20px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
            }
          `}</style>
        </div>
      )}

    </div>
  );
}
