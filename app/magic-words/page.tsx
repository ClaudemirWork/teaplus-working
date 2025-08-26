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
  const [selectedCards, setSelectedCards] = useState([]);

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
    ],
    alimentos: [
      {id: 'agua', icon: '💧', label: 'Água', gesture: '💧', gestureDesc: 'bebendo'},
      {id: 'leite', icon: '🥛', label: 'Leite', gesture: '🥛', gestureDesc: 'segurando copo'},
      {id: 'pao', icon: '🍞', label: 'Pão', gesture: '🍞', gestureDesc: 'mastigando'},
      {id: 'fruta', icon: '🍎', label: 'Fruta', gesture: '🍎', gestureDesc: 'mordendo'},
      {id: 'suco', icon: '🧃', label: 'Suco', gesture: '🧃', gestureDesc: 'sugando canudo'},
      {id: 'biscoito', icon: '🍪', label: 'Biscoito', gesture: '🍪', gestureDesc: 'pegando'},
      {id: 'sorvete', icon: '🍦', label: 'Sorvete', gesture: '🍦', gestureDesc: 'lambendo'},
      {id: 'pizza', icon: '🍕', label: 'Pizza', gesture: '🍕', gestureDesc: 'abrindo a boca'}
    ],
    animais: [
      {id: 'cachorro', icon: '🐕', label: 'Cachorro', gesture: '🐕', gestureDesc: 'latindo'},
      {id: 'gato', icon: '🐈', label: 'Gato', gesture: '🐈', gestureDesc: 'miando'},
      {id: 'passaro', icon: '🦜', label: 'Pássaro', gesture: '🦜', gestureDesc: 'batendo asas'},
      {id: 'peixe', icon: '🐠', label: 'Peixe', gesture: '🐠', gestureDesc: 'nadando'},
      {id: 'coelho', icon: '🐰', label: 'Coelho', gesture: '🐰', gestureDesc: 'pulando'},
      {id: 'cavalo', icon: '🐴', label: 'Cavalo', gesture: '🐴', gestureDesc: 'galopando'},
      {id: 'vaca', icon: '🐄', label: 'Vaca', gesture: '🐄', gestureDesc: 'mugindo'},
      {id: 'galinha', icon: '🐓', label: 'Galinha', gesture: '🐓', gestureDesc: 'bicando'}
    ]
  };

  const npcNames = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Sofia', 'Gabriel', 'Julia'];

  const tutorialSteps = [
    { text: "Olá! Eu sou a Mila, a feiticeira das palavras! 🌟", speak: true },
    { text: "O Reino perdeu a voz mágica! Todos fazem gestos agora! 😱", speak: true },
    { text: "Você será o tradutor mágico que entende os gestos! 🎭", speak: true },
    { text: "Veja! João está apontando para a garganta... 👉💧", speak: true, showExample: true },
    { text: "Clique no card SEDE para ajudá-lo! 💧", speak: true, highlight: 'sede' },
    { text: "Muito bem! Agora você já sabe jogar! Vamos começar! 🎮", speak: true, endTutorial: true }
  ];

  // Speech synthesis
  const speak = (text) => {
    if (!gameState.soundEnabled) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
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
      setGameState(JSON.parse(savedState));
    } else if (gameState.tutorialStep === 0) {
      // Start tutorial for new players
      setTimeout(() => {
        setTutorialActive(true);
        setCurrentScreen('tutorial');
      }, 500);
    }
  }, []);

  // Save game state
  useEffect(() => {
    if (currentScreen === 'game') {
      localStorage.setItem('palavrasMagicasState', JSON.stringify(gameState));
    }
  }, [gameState, currentScreen]);

  // Start game
  const startGame = () => {
    setCurrentScreen('game');
    loadLevel(gameState.currentLevel);
  };

  // Load level
  const loadLevel = (level) => {
    const categories = ['necessidades', 'emocoes', 'alimentos', 'animais'];
    
    if (level >= 5 && level <= 8) {
      setGameState(prev => ({ ...prev, isStoryMode: true }));
      setCurrentScreen('story');
      return;
    }
    
    const categoryIndex = level <= 4 ? level - 1 : Math.floor(Math.random() * 4);
    const category = categories[categoryIndex];
    const numCards = level <= 4 ? [4, 6, 8, 12][level - 1] : 16;
    
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
  const handleCardClick = (card, cardElement) => {
    const isCorrect = card.id === correctCardId;
    
    if (isCorrect) {
      cardElement.classList.add('animate-correct');
      speak("Muito bem! Acertou!");
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + 100,
        correctStreak: prev.correctStreak + 1,
        cardsDiscovered: new Set([...prev.cardsDiscovered, card.id])
      }));
      
      // Check for special rewards
      if (gameState.correctStreak === 2) {
        showReward('Card Dourado', '⭐', 'Vale 500 pontos extras!');
        setGameState(prev => ({ ...prev, score: prev.score + 500 }));
      } else if (gameState.correctStreak === 4) {
        showReward('Card Arco-íris', '🌈', 'Vale 1000 pontos extras!');
        setGameState(prev => ({ ...prev, score: prev.score + 1000 }));
      }
      
      // Next round or complete level
      setTimeout(() => {
        if (gameState.currentRound < 10) {
          const level = gameState.currentLevel;
          const categories = ['necessidades', 'emocoes', 'alimentos', 'animais'];
          const categoryIndex = level <= 4 ? level - 1 : Math.floor(Math.random() * 4);
          const category = categories[categoryIndex];
          const numCards = level <= 4 ? [4, 6, 8, 12][level - 1] : 16;
          startRound(category, numCards);
        } else {
          completeLevel();
        }
      }, 1500);
    } else {
      cardElement.classList.add('animate-wrong');
      speak("Ops! Tente novamente!");
      
      setGameState(prev => ({
        ...prev,
        lives: prev.lives - 1,
        correctStreak: 0
      }));
      
      if (gameState.lives <= 1) {
        setTimeout(() => {
          showReward('Fim de Jogo', '😢', `Pontuação final: ${gameState.score} pontos`);
          setTimeout(() => setCurrentScreen('menu'), 3000);
        }, 1000);
      }
      
      setTimeout(() => {
        cardElement.classList.remove('animate-wrong');
      }, 500);
    }
  };

  // Complete level
  const completeLevel = () => {
    const bonus = gameState.lives * 200;
    
    showReward(
      `Fase ${gameState.currentLevel} Completa!`,
      '🏆',
      `Bônus de vida: ${bonus} pontos!`
    );
    
    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      score: prev.score + bonus,
      currentRound: 0,
      lives: 3
    }));
    
    if (gameState.score >= 1000 && gameState.currentLevel === 4) {
      showReward('Modo História Desbloqueado!', '📖', 'Agora você pode criar suas próprias histórias!');
    }
    
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
        const wrongCards = displayedCards.filter(c => c.id !== correctCardId);
        const toHide = shuffleArray(wrongCards).slice(0, 2);
        setDisplayedCards(prev => prev.map(card => ({
          ...card,
          hidden: toHide.includes(card)
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
      if (currentStep.speak) {
        speak(currentStep.text);
      }
      
      if (currentStep.endTutorial) {
        setTimeout(() => {
          setTutorialActive(false);
          setCurrentScreen('menu');
          setGameState(prev => ({ ...prev, tutorialStep: tutorialSteps.length }));
        }, 3000);
      }
    }, [step, currentStep]);
    
    return (
      <div className="tutorial-overlay">
        <div className="mila-container">
          <div className="mila">
            <div className="mila-hat">⭐</div>
            <div className="mila-face">
              <div className="eyes">
                <div className="eye"></div>
                <div className="eye"></div>
              </div>
              <div className="mouth"></div>
            </div>
            <div className="sparkles">✨</div>
          </div>
        </div>
        
        <div className="speech-bubble">
          <p>{currentStep.text}</p>
        </div>
        
        {step < tutorialSteps.length - 1 && (
          <button 
            className="continue-btn"
            onClick={() => setStep(step + 1)}
          >
            Continuar ➡️
          </button>
        )}
      </div>
    );
  };

  // Menu screen
  const MenuScreen = () => (
    <div className="menu-screen">
      <h1 className="game-logo">🎪 Palavras Mágicas</h1>
      <p className="game-subtitle">Uma aventura CAA gamificada</p>
      
      <div className="menu-buttons">
        <button className="menu-btn primary" onClick={startGame}>
          🎮 Jogar
        </button>
        <button className="menu-btn" onClick={() => {
          const discovered = gameState.cardsDiscovered.size;
          const total = Object.values(cardDatabase).flat().length;
          showReward('Minha Coleção', '📚', `${discovered}/${total} cards descobertos!`);
        }}>
          📚 Minha Coleção
        </button>
        <button className="menu-btn" onClick={() => {
          setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
          showReward('Configurações', '⚙️', `Som: ${gameState.soundEnabled ? 'Ligado' : 'Desligado'}`);
        }}>
          ⚙️ Configurações
        </button>
        <button className="menu-btn" onClick={() => {
          showReward('Sobre', 'ℹ️', 'Palavras Mágicas v1.0 - Um jogo CAA gamificado');
        }}>
          ℹ️ Sobre
        </button>
      </div>
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
            style={{ width: `${(gameState.currentRound / 10) * 100}%` }}
          >
            {gameState.currentRound}/10
          </div>
        </div>
      </div>
      
      {currentNPC && (
        <div className="npc-area">
          <div className="npc-character"></div>
          <div className="npc-name">{currentNPC.name}</div>
          <div className="npc-gesture">{currentNPC.gesture}</div>
        </div>
      )}
      
      <div className="cards-grid">
        {displayedCards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.hidden ? 'hidden' : ''}`}
            onClick={(e) => !card.hidden && handleCardClick(card, e.currentTarget)}
          >
            <div className="card-icon">{card.icon}</div>
            <div className="card-label">{card.label}</div>
          </div>
        ))}
      </div>
      
      <div className="powerups">
        <button 
          className={`powerup ${gameState.powerups.hint === 0 ? 'disabled' : ''}`}
          onClick={() => usePowerup('hint')}
          disabled={gameState.powerups.hint === 0}
        >
          💡 ({gameState.powerups.hint})
        </button>
        <button 
          className={`powerup ${gameState.powerups.time === 0 ? 'disabled' : ''}`}
          onClick={() => usePowerup('time')}
          disabled={gameState.powerups.time === 0}
        >
          ⏱️ ({gameState.powerups.time})
        </button>
        <button 
          className={`powerup ${gameState.powerups.life === 0 ? 'disabled' : ''}`}
          onClick={() => usePowerup('life')}
          disabled={gameState.powerups.life === 0}
        >
          💚 ({gameState.powerups.life})
        </button>
      </div>
      
      <button className="album-btn" onClick={() => {
        const discovered = gameState.cardsDiscovered.size;
        const total = Object.values(cardDatabase).flat().length;
        showReward('Minha Coleção', '📚', `${discovered}/${total} cards descobertos!`);
      }}>
        📚
      </button>
    </div>
  );

  // Story mode screen
  const StoryScreen = () => {
    const [storyStep, setStoryStep] = useState(0);
    const storyTemplates = [
      "Era uma vez um/uma ",
      " que morava em ",
      ". Um dia estava ",
      " porque ",
      ". Então ",
      " e ficou ",
      "!"
    ];
    
    const storyOptions = [
      ['menino', 'menina', 'animal'],
      ['casa', 'escola', 'parque'],
      ['feliz', 'triste', 'assustado'],
      ['choveu', 'encontrou amigo', 'perdeu brinquedo'],
      ['brincou', 'correu', 'abraçou'],
      ['alegre', 'cansado', 'satisfeito']
    ];
    
    const handleStoryChoice = (choice) => {
      setStoryText(prev => prev + choice + (storyTemplates[storyStep + 1] || ''));
      setStoryStep(prev => prev + 1);
      speak(choice);
      
      if (storyStep >= storyOptions.length - 1) {
        setTimeout(() => {
          showReward('História Criada!', '📚', 'Sua história foi salva!');
          const stories = JSON.parse(localStorage.getItem('savedStories') || '[]');
          stories.push({
            text: storyText + choice + '!',
            date: new Date().toLocaleDateString('pt-BR'),
            level: gameState.currentLevel
          });
          localStorage.setItem('savedStories', JSON.stringify(stories));
        }, 1000);
      }
    };
    
    return (
      <div className="story-screen">
        <header className="game-header">
          <div className="level-info">
            <span className="level-badge">Modo História</span>
          </div>
          <button 
            className="back-btn"
            onClick={() => setCurrentScreen('menu')}
          >
            Voltar
          </button>
        </header>
        
        <div className="story-mode">
          <div className="story-canvas">
            <p className="story-text">{storyText}</p>
          </div>
          
          <div className="story-cards">
            {storyStep < storyOptions.length && storyOptions[storyStep].map((option) => (
              <button
                key={option}
                className="story-card"
                onClick={() => handleStoryChoice(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="game-container">
      <style jsx>{`
        .game-container {
          width: 100%;
          max-width: 480px;
          height: 100vh;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        /* Tutorial Overlay */
        .tutorial-overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.95) 70%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Mila Character */
        .mila-container {
          position: relative;
          margin-bottom: 30px;
        }

        .mila {
          width: 180px;
          height: 180px;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          border-radius: 50%;
          position: relative;
          animation: float 3s ease-in-out infinite;
          box-shadow: 0 20px 40px rgba(240, 147, 251, 0.4);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .mila-hat {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 40px;
        }

        .mila-face {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .eyes {
          display: flex;
          gap: 30px;
          margin-bottom: 20px;
        }

        .eye {
          width: 15px;
          height: 20px;
          background: white;
          border-radius: 50%;
          animation: blink 4s infinite;
        }

        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }

        .mouth {
          width: 30px;
          height: 15px;
          border-bottom: 3px solid white;
          border-radius: 0 0 30px 30px;
          margin: 0 auto;
          animation: talk 0.5s ease-in-out infinite alternate;
        }

        @keyframes talk {
          from { width: 30px; }
          to { width: 25px; }
        }

        .sparkles {
          position: absolute;
          top: -20px;
          right: -20px;
          font-size: 30px;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* Speech Bubble */
        .speech-bubble {
          background: white;
          border-radius: 20px;
          padding: 20px 30px;
          margin: 0 20px 30px;
          position: relative;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          animation: slideUp 0.5s ease;
          max-width: 300px;
          text-align: center;
        }

        .speech-bubble::before {
          content: '';
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          border-bottom: 20px solid white;
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Buttons */
        .continue-btn, .menu-btn {
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          cursor: pointer;
          animation: pulse 2s infinite;
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;
        }

        .continue-btn:hover, .menu-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        /* Menu Screen */
        .menu-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }

        .game-logo {
          font-size: 48px;
          font-weight: bold;
          color: white;
          margin-bottom: 10px;
          text-align: center;
          text-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .game-subtitle {
          font-size: 20px;
          color: rgba(255,255,255,0.9);
          margin-bottom: 40px;
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
          color: #667eea;
          font-weight: bold;
        }

        .menu-btn.primary {
          background: linear-gradient(135deg, #f093fb, #f5576c);
          color: white;
          font-size: 22px;
        }

        /* Game Screen */
        .game-screen {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #1a1a2e;
        }

        .game-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }

        .level-badge {
          background: rgba(255,255,255,0.2);
          padding: 5px 15px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
        }

        .score {
          background: rgba(255,255,255,0.2);
          padding: 8px 15px;
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
        }

        /* Progress Bar */
        .progress-section {
          padding: 15px 20px;
          background: rgba(255,255,255,0.1);
        }

        .progress-bar {
          background: rgba(255,255,255,0.2);
          height: 30px;
          border-radius: 15px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f093fb, #f5576c);
          border-radius: 15px;
          transition: width 0.5s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        /* NPC Area */
        .npc-area {
          background: linear-gradient(135deg, #a8edea, #fed6e3);
          margin: 20px;
          padding: 30px;
          border-radius: 20px;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .npc-character {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #ffecd2, #fcb69f);
          border-radius: 50%;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .npc-name {
          margin-top: 15px;
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }

        .npc-gesture {
          margin-top: 10px;
          font-size: 60px;
          animation: gesture 1s ease-in-out infinite alternate;
        }

        @keyframes gesture {
          from { transform: rotate(-10deg) scale(1); }
          to { transform: rotate(10deg) scale(1.1); }
        }

        /* Cards Grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 15px;
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .card {
          background: white;
          border-radius: 15px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          min-height: 120px;
        }

        .card:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        .card.hidden {
          opacity: 0.3;
          pointer-events: none;
        }

        .card.animate-correct {
          background: linear-gradient(135deg, #84fab0, #8fd3f4);
          animation: correctPulse 0.6s ease;
        }

        @keyframes correctPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .card.animate-wrong {
          background: linear-gradient(135deg, #ff6b6b, #feca57);
          animation: shake 0.5s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .card-icon {
          font-size: 40px;
          margin-bottom: 8px;
        }

        .card-label {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          text-align: center;
        }

        /* Power-ups */
        .powerups {
          position: fixed;
          bottom: 20px;
          left: 20px;
          display: flex;
          gap: 10px;
          z-index: 100;
        }

        .powerup {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #84fab0, #8fd3f4);
          border-radius: 50%;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }

        .powerup:hover:not(.disabled) {
          transform: scale(1.1);
        }

        .powerup.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Album Button */
        .album-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 5px 20px rgba(0,0,0,0.3);
          z-index: 100;
        }

        /* Story Mode */
        .story-screen {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #1a1a2e;
        }

        .back-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          padding: 8px 15px;
          border-radius: 20px;
          color: white;
          cursor: pointer;
        }

        .story-mode {
          flex: 1;
          padding: 20px;
          background: linear-gradient(135deg, #ffecd2, #fcb69f);
          border-radius: 20px 20px 0 0;
          margin-top: 20px;
        }

        .story-canvas {
          background: white;
          border-radius: 15px;
          padding: 20px;
          min-height: 200px;
          margin-bottom: 20px;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
        }

        .story-text {
          font-size: 18px;
          line-height: 1.8;
          color: #333;
        }

        .story-cards {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .story-card {
          background: white;
          border: 2px solid #667eea;
          border-radius: 10px;
          padding: 12px 20px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .story-card:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        /* Responsive */
        @media (max-width: 480px) {
          .cards-grid {
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          }
          
          .card {
            min-height: 100px;
            padding: 10px;
          }
          
          .card-icon {
            font-size: 30px;
          }
          
          .card-label {
            font-size: 12px;
          }
        }
      `}</style>

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
            <button className="continue-btn" onClick={() => setRewardModal(null)}>
              Continuar
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .reward-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }

        .reward-content {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 40px;
          border-radius: 30px;
          text-align: center;
          color: white;
          animation: zoomIn 0.5s ease;
          max-width: 90%;
        }

        @keyframes zoomIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        .reward-icon {
          font-size: 80px;
          margin-bottom: 20px;
          animation: rotate 2s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .reward-title {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .reward-description {
          font-size: 18px;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
