'use client';

import React, { useState, useEffect, useRef } from 'react';

// CSS completo como objeto JavaScript para evitar problemas com styled-jsx
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.9); }
  }
  
  @keyframes blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }
  
  @keyframes talk {
    from { width: 30px; }
    to { width: 20px; }
  }
  
  @keyframes wave {
    0%, 100% { transform: rotate(-20deg); }
    50% { transform: rotate(-40deg); }
  }
  
  @keyframes float-sparkle {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
    50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes gesture-demo {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.2) rotate(10deg); }
  }
  
  @keyframes pulse-highlight {
    0%, 100% { transform: scale(1.1); }
    50% { transform: scale(1.15); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes correctPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); background: linear-gradient(135deg, #84fab0, #8fd3f4); }
    100% { transform: scale(1); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  @keyframes zoomIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', system-ui, sans-serif;
    overflow: hidden;
  }
  
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
    animation: fadeIn 0.5s ease;
  }
  
  .mila-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
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
    animation: float 3s ease-in-out infinite;
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
  
  .mila-mouth {
    width: 30px;
    height: 15px;
    border-bottom: 3px solid #333;
    border-radius: 0 0 30px 30px;
    margin: 0 auto;
    animation: talk 0.8s infinite alternate;
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
  
  .bubble-text {
    font-size: 22px;
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
    opacity: 0.3;
  }
  
  .card-demo.highlight {
    background: linear-gradient(135deg, #90EE90, #98FB98);
    transform: scale(1.1);
    box-shadow: 0 5px 20px rgba(144, 238, 144, 0.5);
    animation: pulse-highlight 1s infinite;
    opacity: 1;
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
  
  .game-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-height: 120px;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .game-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  }
  
  .game-card.correct {
    animation: correctPulse 0.6s ease;
  }
  
  .game-card.wrong {
    background: linear-gradient(135deg, #ff6b6b, #feca57);
    animation: shake 0.5s ease;
  }
  
  .npc-character {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #ffecd2, #fcb69f);
    border-radius: 50%;
    animation: bounce 2s ease-in-out infinite;
  }
`;

export default function PalavrasMagicas() {
  // Estados do jogo
  const [gameState, setGameState] = useState({
    currentLevel: 1,
    score: 0,
    lives: 3,
    cardsDiscovered: new Set(),
    tutorialStep: 0,
    currentRound: 0,
    correctStreak: 0,
    powerups: { hint: 3, time: 2, life: 1 },
    soundEnabled: true
  });

  const [currentScreen, setCurrentScreen] = useState('menu');
  const [currentNPC, setCurrentNPC] = useState(null);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [correctCardId, setCorrectCardId] = useState(null);
  const [rewardModal, setRewardModal] = useState(null);
  const [cardStates, setCardStates] = useState({});

  // Base de dados dos cards
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
      {id: 'medo', icon: '😨', label: 'Medo', gesture: '😨', gestureDesc: 'se encolhendo'}
    ]
  };

  const npcNames = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Sofia'];

  const tutorialSteps = [
    { 
      text: "Olá! Eu sou a Mila, a feiticeira das palavras!",
      showMila: true 
    },
    { 
      text: "O Reino perdeu a voz mágica! Todos fazem gestos agora!",
      showMila: true 
    },
    { 
      text: "Você será o tradutor mágico que entende os gestos!",
      showMila: true 
    },
    { 
      text: "Veja! João está apontando para a garganta...",
      showMila: true,
      showExample: true 
    },
    { 
      text: "Clique no card SEDE para ajudá-lo!",
      showMila: true,
      showExample: true,
      highlight: 'sede' 
    },
    { 
      text: "Muito bem! Agora você já sabe jogar! Vamos começar!",
      showMila: true,
      endTutorial: true 
    }
  ];

  // Síntese de voz
  const speak = (text) => {
    if (!gameState.soundEnabled) return;
    
    if ('speechSynthesis' in window) {
      const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.85;
      utterance.pitch = 1.2;
      utterance.volume = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Embaralhar array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Inicializar jogo
  useEffect(() => {
    // Adicionar estilos globais
    const styleSheet = document.createElement('style');
    styleSheet.textContent = globalStyles + animationStyles;
    document.head.appendChild(styleSheet);
    
    // Carregar estado salvo
    const savedState = localStorage.getItem('palavrasMagicasState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setGameState({...parsed, cardsDiscovered: new Set(parsed.cardsDiscovered)});
    } else {
      setTimeout(() => setCurrentScreen('tutorial'), 500);
    }
    
    return () => {
      if (styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
    };
  }, []);

  // Iniciar jogo
  const startGame = () => {
    setCurrentScreen('game');
    loadLevel(gameState.currentLevel);
  };

  // Carregar nível
  const loadLevel = (level) => {
    const category = level <= 2 ? 'necessidades' : 'emocoes';
    const numCards = level <= 2 ? 4 : 6;
    startRound(category, numCards);
  };

  // Iniciar rodada
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
    setCardStates({});
    
    speak(`${npcName} está ${correctCard.gestureDesc}. O que será?`);
    
    setGameState(prev => ({
      ...prev,
      currentRound: prev.currentRound + 1
    }));
  };

  // Lidar com clique no card
  const handleCardClick = (card) => {
    const isCorrect = card.id === correctCardId;
    
    setCardStates(prev => ({
      ...prev,
      [card.id]: isCorrect ? 'correct' : 'wrong'
    }));
    
    if (isCorrect) {
      speak("Muito bem! Você acertou!");
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + 100,
        correctStreak: prev.correctStreak + 1,
        cardsDiscovered: new Set([...prev.cardsDiscovered, card.id])
      }));
      
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
      
      setTimeout(() => {
        setCardStates(prev => ({
          ...prev,
          [card.id]: ''
        }));
      }, 500);
      
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

  // Completar nível
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

  // Mostrar recompensa
  const showReward = (title, icon, description) => {
    setRewardModal({ title, icon, description });
    speak(title);
  };

  // Componente Tutorial
  const TutorialScreen = () => {
    const [step, setStep] = useState(0);
    const currentStep = tutorialSteps[step];
    
    useEffect(() => {
      speak(currentStep.text);
      
      if (currentStep.endTutorial) {
        setTimeout(() => {
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
                <div className={`card-demo highlight`}>
                  <span className="card-icon">💧</span>
                  <span className="card-label">Sede</span>
                </div>
                <div className="card-demo">
                  <span className="card-icon">🍽️</span>
                  <span className="card-label">Fome</span>
                </div>
                <div className="card-demo">
                  <span className="card-icon">😴</span>
                  <span className="card-label">Sono</span>
                </div>
                <div className="card-demo">
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
      </div>
    );
  };

  // Componente Menu
  const MenuScreen = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #87CEEB 0%, #98E4D6 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '42px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '10px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
      }}>🎪 Palavras Mágicas</h1>
      
      <p style={{
        fontSize: '18px',
        color: 'white',
        marginBottom: '40px',
        opacity: 0.95
      }}>Uma aventura CAA gamificada</p>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '100%',
        maxWidth: '300px'
      }}>
        <button 
          style={{
            padding: '18px 30px',
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontSize: '22px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
          onClick={startGame}
        >
          🎮 Jogar
        </button>
        
        <button 
          style={{
            padding: '18px 30px',
            background: 'white',
            color: '#2196F3',
            border: 'none',
            borderRadius: '30px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
          onClick={() => {
            const discovered = gameState.cardsDiscovered.size;
            const total = Object.values(cardDatabase).flat().length;
            showReward('Minha Coleção', '📚', `${discovered}/${total} cards descobertos!`);
          }}
        >
          📚 Coleção
        </button>
        
        <button 
          style={{
            padding: '18px 30px',
            background: 'white',
            color: '#2196F3',
            border: 'none',
            borderRadius: '30px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
          onClick={() => showReward('Sobre', 'ℹ️', 'Jogo educativo CAA para crianças especiais')}
        >
          ℹ️ Sobre
        </button>
      </div>
    </div>
  );

  // Componente Game
  const GameScreen = () => (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F0F8FF 0%, #E6F3FF 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #4CAF50, #45a049)',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.3)',
          padding: '8px 16px',
          borderRadius: '20px',
          color: 'white',
          fontWeight: 'bold'
        }}>
          Fase {gameState.currentLevel}
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.3)',
          padding: '8px 20px',
          borderRadius: '20px',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          ⭐ {gameState.score}
        </div>
        
        <div style={{ display: 'flex', gap: '5px', fontSize: '24px' }}>
          {[...Array(3)].map((_, i) => (
            <span key={i} style={{ opacity: i < gameState.lives ? 1 : 0.3 }}>
              {i < gameState.lives ? '❤️' : '💔'}
            </span>
          ))}
        </div>
      </div>
      
      <div style={{
        padding: '15px 20px',
        background: 'rgba(255,255,255,0.8)'
      }}>
        <div style={{
          background: '#E0E0E0',
          height: '30px',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
            borderRadius: '15px',
            width: `${(gameState.currentRound / 5) * 100}%`,
            transition: 'width 0.5s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {gameState.currentRound}/5
          </div>
        </div>
      </div>
      
      {currentNPC && (
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px 40px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div className="npc-character"></div>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginTop: '10px'
            }}>
              {currentNPC.name}
            </div>
            <div style={{
              fontSize: '50px',
              marginTop: '10px',
              animation: 'gesture-demo 1.5s infinite'
            }}>
              {currentNPC.gesture}
            </div>
          </div>
        </div>
      )}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '15px',
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {displayedCards.map(card => (
          <div
            key={card.id}
            className={`game-card ${cardStates[card.id] || ''}`}
            onClick={() => handleCardClick(card)}
          >
            <span style={{ fontSize: '40px' }}>{card.icon}</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
              {card.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // Componente Modal
  const Modal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }} onClick={() => setRewardModal(null)}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        textAlign: 'center',
        maxWidth: '90%',
        animation: 'zoomIn 0.3s ease'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: '60px', marginBottom: '15px' }}>
          {rewardModal.icon}
        </div>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '10px' }}>
          {rewardModal.title}
        </h2>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
          {rewardModal.description}
        </p>
        <button style={{
          padding: '10px 30px',
          background: 'linear-gradient(135deg, #4CAF50, #45a049)',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }} onClick={() => {
          setRewardModal(null);
          if (rewardModal.title === 'Fim de Jogo' || rewardModal.title.includes('Fase')) {
            setCurrentScreen('menu');
            setGameState({...gameState, currentRound: 0, lives: 3});
          }
        }}>
          Fechar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      width: '100%',
      maxWidth: '768px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative'
    }}>
      {currentScreen === 'menu' && <MenuScreen />}
      {currentScreen === 'tutorial' && <TutorialScreen />}
      {currentScreen === 'game' && <GameScreen />}
      {rewardModal && <Modal />}
    </div>
  );
}
