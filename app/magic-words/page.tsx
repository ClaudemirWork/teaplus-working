'use client'

import React, { useState, useEffect, useRef } from 'react'

interface Card {
  id: string
  label: string
  image: string
  gesture: string
  gestureDesc: string
}

interface GameState {
  currentLevel: number
  score: number
  lives: number
  tutorialStep: number
  currentRound: number
  soundEnabled: boolean
  correctCardId: string | null
}

export default function MagicWordsPage() {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    lives: 3,
    tutorialStep: 0,
    currentRound: 1,
    soundEnabled: true,
    correctCardId: null
  })

  const [showTutorial, setShowTutorial] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showGame, setShowGame] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ icon: '🏆', title: 'Parabéns!', description: 'Você completou a fase!' })
  const [currentCards, setCurrentCards] = useState<Card[]>([])
  const [npcInfo, setNpcInfo] = useState({ name: 'Maria', gesture: '👉💧' })
  const [cardStates, setCardStates] = useState<{ [key: string]: string }>({})

  const cards = {
    necessidades: [
      {
        id: 'sede',
        label: 'Sede',
        image: 'https://api.arasaac.org/v1/pictograms/2439?color=true&download=false',
        gesture: '👉💧',
        gestureDesc: 'apontando para a garganta'
      },
      {
        id: 'fome',
        label: 'Fome',
        image: 'https://api.arasaac.org/v1/pictograms/11738?color=true&download=false',
        gesture: '🤲🍽️',
        gestureDesc: 'mãos na barriga'
      },
      {
        id: 'banheiro',
        label: 'Banheiro',
        image: 'https://api.arasaac.org/v1/pictograms/8975?color=true&download=false',
        gesture: '🚽',
        gestureDesc: 'se contorcendo'
      },
      {
        id: 'sono',
        label: 'Sono',
        image: 'https://api.arasaac.org/v1/pictograms/6246?color=true&download=false',
        gesture: '😴',
        gestureDesc: 'bocejando'
      },
      {
        id: 'doente',
        label: 'Doente',
        image: 'https://api.arasaac.org/v1/pictograms/11439?color=true&download=false',
        gesture: '🤒',
        gestureDesc: 'mão na testa'
      },
      {
        id: 'frio',
        label: 'Frio',
        image: 'https://api.arasaac.org/v1/pictograms/6369?color=true&download=false',
        gesture: '🥶',
        gestureDesc: 'tremendo'
      },
      {
        id: 'calor',
        label: 'Calor',
        image: 'https://api.arasaac.org/v1/pictograms/5467?color=true&download=false',
        gesture: '🥵',
        gestureDesc: 'se abanando'
      },
      {
        id: 'ajuda',
        label: 'Ajuda',
        image: 'https://api.arasaac.org/v1/pictograms/7421?color=true&download=false',
        gesture: '🙏',
        gestureDesc: 'mãos juntas pedindo'
      }
    ]
  }

  const npcNames = ['João', 'Maria', 'Pedro', 'Ana', 'Lucas', 'Sofia']

  const tutorialSteps = [
    { text: "Olá! Eu sou a Mila, a feiticeira das palavras!", showMila: true },
    { text: "O Reino perdeu a voz mágica! Todos fazem gestos agora!", showMila: true },
    { text: "Você será o tradutor mágico que entende os gestos!", showMila: true },
    { text: "Veja! João está apontando para a garganta...", showMila: true, showExample: true },
    { text: "Clique no card SEDE para ajudá-lo!", showMila: true, showExample: true, showCards: true, highlight: 'sede' }
  ]

  const speak = (text: string) => {
    if (!gameState.soundEnabled) return
    
    const cleanText = text.replace(/[^\w\sÀ-ÿ.,!?]/g, '')
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.lang = 'pt-BR'
      utterance.rate = 0.9
      utterance.pitch = 1.1
      window.speechSynthesis.speak(utterance)
    }
  }

  const startTutorial = () => {
    setGameState(prev => ({ ...prev, tutorialStep: 0 }))
    setShowTutorial(true)
    speak(tutorialSteps[0].text)
  }

  const nextTutorialStep = () => {
    const nextStep = gameState.tutorialStep + 1
    
    if (nextStep < tutorialSteps.length) {
      setGameState(prev => ({ ...prev, tutorialStep: nextStep }))
      speak(tutorialSteps[nextStep].text)
    } else {
      setShowTutorial(false)
      setShowMenu(true)
      speak("Agora você já sabe jogar! Vamos começar!")
    }
  }

  const startGame = () => {
    setShowMenu(false)
    setShowGame(true)
    setGameState(prev => ({ ...prev, currentRound: 1, lives: 3 }))
    loadRound()
  }

  const loadRound = () => {
    const availableCards = [...cards.necessidades]
    const roundCards = availableCards.slice(0, 4)
    const correctCard = roundCards[Math.floor(Math.random() * roundCards.length)]
    
    setGameState(prev => ({ ...prev, correctCardId: correctCard.id }))
    setCurrentCards(roundCards)
    setCardStates({})
    
    const npcName = npcNames[Math.floor(Math.random() * npcNames.length)]
    setNpcInfo({ name: npcName, gesture: correctCard.gesture })
    
    speak(`${npcName} está ${correctCard.gestureDesc}. O que será?`)
  }

  const checkCard = (cardId: string) => {
    if (cardId === gameState.correctCardId) {
      setCardStates(prev => ({ ...prev, [cardId]: 'correct' }))
      speak("Muito bem! Você acertou!")
      
      const newScore = gameState.score + 100
      setGameState(prev => ({ ...prev, score: newScore }))
      
      setTimeout(() => {
        if (gameState.currentRound < 5) {
          setGameState(prev => ({ ...prev, currentRound: prev.currentRound + 1 }))
          loadRound()
        } else {
          completeLevel()
        }
      }, 1500)
    } else {
      setCardStates(prev => ({ ...prev, [cardId]: 'wrong' }))
      speak("Ops! Tente novamente!")
      
      const newLives = gameState.lives - 1
      setGameState(prev => ({ ...prev, lives: newLives }))
      
      setTimeout(() => {
        setCardStates(prev => ({ ...prev, [cardId]: '' }))
      }, 500)
      
      if (newLives <= 0) {
        gameOver()
      }
    }
  }

  const completeLevel = () => {
    setModalContent({
      icon: '🏆',
      title: 'Fase Completa!',
      description: `Você ganhou ${gameState.score} pontos!`
    })
    setShowModal(true)
    speak('Fase Completa!')
    setGameState(prev => ({ ...prev, currentLevel: prev.currentLevel + 1 }))
  }

  const gameOver = () => {
    setModalContent({
      icon: '😢',
      title: 'Fim de Jogo',
      description: `Pontuação final: ${gameState.score}`
    })
    setShowModal(true)
    speak('Fim de Jogo')
  }

  const closeModal = () => {
    setShowModal(false)
    setShowGame(false)
    setShowMenu(true)
  }

  const toggleSound = () => {
    setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))
  }

  const showCollection = () => {
    setModalContent({
      icon: '📚',
      title: 'Minha Coleção',
      description: 'Em breve: Veja todos os cards descobertos!'
    })
    setShowModal(true)
  }

  const showAbout = () => {
    setModalContent({
      icon: 'ℹ️',
      title: 'Sobre',
      description: 'Palavras Mágicas - Um jogo CAA gamificado para crianças especiais'
    })
    setShowModal(true)
  }

  useEffect(() => {
    const timer = setTimeout(() => startTutorial(), 500)
    return () => clearTimeout(timer)
  }, [])

  const currentTutorialStep = tutorialSteps[gameState.tutorialStep] || tutorialSteps[0]

  return (
    <div className="game-container">
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        body {
          font-family: 'Segoe UI', system-ui, sans-serif;
          overflow: hidden;
          background: #000;
        }

        .game-container {
          width: 100%;
          max-width: 480px;
          height: 100vh;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }

        .tutorial-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(135, 206, 235, 0.3) 0%, rgba(0, 0, 0, 0.95) 60%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 3000;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .mila-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          animation: slideDown 0.8s ease;
        }

        @keyframes slideDown {
          from { transform: translateY(-100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .mila {
          width: 180px;
          height: 180px;
          background: linear-gradient(135deg, #FF69B4, #FFB6C1);
          border-radius: 50%;
          position: relative;
          animation: float 3s ease-in-out infinite;
          box-shadow: 0 20px 40px rgba(255, 105, 180, 0.4);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .mila-hat {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 40px solid transparent;
          border-right: 40px solid transparent;
          border-bottom: 60px solid #4B0082;
          z-index: 10;
        }

        .mila-hat::after {
          content: '⭐';
          position: absolute;
          top: 15px;
          left: -10px;
          font-size: 30px;
          animation: twinkle 2s infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.6; transform: scale(0.9) rotate(180deg); }
        }

        .mila-face {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
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

        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
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

        @keyframes talk {
          from { width: 30px; }
          to { width: 20px; }
        }

        .speech-bubble {
          background: white;
          border-radius: 20px;
          padding: 25px 35px;
          position: relative;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          max-width: 350px;
          animation: bubbleUp 0.5s ease 0.3s both;
        }

        @keyframes bubbleUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
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

        .speech-text {
          font-size: 22px;
          line-height: 1.5;
          color: #333;
          text-align: center;
          font-weight: 500;
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
          animation: pulse 2s infinite;
          box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .menu-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #87CEEB 0%, #98E4D6 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
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
          color: #2196F3;
          border: none;
          border-radius: 30px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }

        .menu-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .menu-btn.primary {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          font-size: 22px;
        }

        .game-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #F0F8FF 0%, #E6F3FF 100%);
        }

        .game-header {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }

        .level-badge {
          background: rgba(255,255,255,0.3);
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
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
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
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
          min-width: 50px;
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
          text-align: center;
        }

        .npc-character {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #FFE4C4, #FFDAB9);
          border-radius: 50%;
          margin: 0 auto 15px;
          position: relative;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .npc-name {
          font-size: 20px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }

        .npc-gesture {
          font-size: 60px;
          animation: gestureAnim 1.5s infinite;
        }

        @keyframes gestureAnim {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(5deg); }
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        .card {
          background: white;
          border-radius: 15px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
          min-height: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }

        .card.correct {
          background: linear-gradient(135deg, #84fab0, #8fd3f4);
          animation: correctPulse 0.6s ease;
        }

        @keyframes correctPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .card.wrong {
          background: linear-gradient(135deg, #ff6b6b, #feca57);
          animation: shake 0.5s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .card-image {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin-bottom: 8px;
        }

        .card-label {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          text-align: center;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }

        .modal-content {
          background: white;
          padding: 40px;
          border-radius: 30px;
          text-align: center;
          max-width: 90%;
          animation: zoomIn 0.5s ease;
        }

        @keyframes zoomIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        .modal-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 28px;
          margin-bottom: 10px;
          color: #333;
        }

        .modal-description {
          font-size: 18px;
          color: #666;
          margin-bottom: 20px;
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
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
          opacity: 0.3;
          transition: all 0.3s ease;
        }

        .card-demo.highlight {
          background: linear-gradient(135deg, #90EE90, #98FB98);
          transform: scale(1.1);
          box-shadow: 0 5px 20px rgba(144, 238, 144, 0.5);
          animation: pulseHighlight 1s infinite;
          opacity: 1;
        }

        @keyframes pulseHighlight {
          0%, 100% { transform: scale(1.1); }
          50% { transform: scale(1.15); }
        }
      `}</style>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="mila-container">
            <div className="mila">
              <div className="mila-hat"></div>
              <div className="mila-face">
                <div className="mila-eyes">
                  <div className="eye"></div>
                  <div className="eye"></div>
                </div>
                <div className="mila-mouth"></div>
              </div>
            </div>
            
            <div className="speech-bubble">
              <p className="speech-text">{currentTutorialStep.text}</p>
            </div>
          </div>
          
          {currentTutorialStep.showExample && (
            <div className="example-container">
              <div className="npc-demo">
                <div className="npc-container">
                  <div className="npc-character"></div>
                  <div className="npc-name">João</div>
                  <div className="npc-gesture">👉💧</div>
                </div>
              </div>
              
              {currentTutorialStep.showCards && (
                <div className="cards-demo">
                  {['sede', 'fome', 'sono', 'banheiro'].map((id) => {
                    const card = cards.necessidades.find(c => c.id === id)
                    return card ? (
                      <div key={id} className={`card-demo ${currentTutorialStep.highlight === id ? 'highlight' : ''}`}>
                        <img src={card.image} width={50} alt={card.label} />
                        <span>{card.label}</span>
                      </div>
                    ) : null
                  })}
                </div>
              )}
            </div>
          )}
          
          <button className="continue-btn" onClick={nextTutorialStep}>
            Continuar ➡️
          </button>
        </div>
      )}

      {/* Menu Screen */}
      {showMenu && (
        <div className="menu-screen">
          <h1 className="game-logo">🎪 Palavras Mágicas</h1>
          <p className="game-subtitle">Uma aventura CAA gamificada</p>
          
          <div className="menu-buttons">
            <button className="menu-btn primary" onClick={startGame}>
              🎮 Jogar
            </button>
            <button className="menu-btn" onClick={showCollection}>
              📚 Minha Coleção
            </button>
            <button className="menu-btn" onClick={toggleSound}>
              🔊 Som: {gameState.soundEnabled ? 'ON' : 'OFF'}
            </button>
            <button className="menu-btn" onClick={showAbout}>
              ℹ️ Sobre
            </button>
          </div>
        </div>
      )}

      {/* Game Screen */}
      {showGame && (
        <div className="game-screen">
          <div className="game-header">
            <div className="level-badge">Fase {gameState.currentLevel}</div>
            <div className="score">⭐ {gameState.score}</div>
            <div className="lives">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="heart" style={i >= gameState.lives ? {opacity: 0.3} : {}}>
                  {i < gameState.lives ? '❤️' : '💔'}
                </span>
              ))}
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${(gameState.currentRound / 5) * 100}%`}}
              >
                <span>{gameState.currentRound}/5</span>
              </div>
            </div>
          </div>

          <div className="npc-area">
            <div className="npc-container">
              <div className="npc-character"></div>
              <div className="npc-name">{npcInfo.name}</div>
              <div className="npc-gesture">{npcInfo.gesture}</div>
            </div>
          </div>

          <div className="cards-grid">
            {currentCards.map(card => (
              <div 
                key={card.id}
                className={`card ${cardStates[card.id] || ''}`}
                onClick={() => checkCard(card.id)}
              >
                <img src={card.image} alt={card.label} className="card-image" />
                <div className="card-label">{card.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-icon">{modalContent.icon}</div>
            <h2 className="modal-title">{modalContent.title}</h2>
            <p className="modal-description">{modalContent.description}</p>
            <button className="continue-btn" onClick={closeModal}>
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
