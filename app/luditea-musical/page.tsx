/* ... código anterior continua ... */

/* Gradientes específicos */
.welcome-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

.game-gradient {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 50%, #90dffe 100%);
}

/* Animações */
.animated-bounce {
  animation: bounce 2s ease-in-out infinite;
}

.animated-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animated-music {
  animation: musicNote 1s ease-in-out infinite;
}

@keyframes musicNote {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-5px) rotate(5deg); }
}

/* Texto dourado */
.golden-text {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}

/* Botão de áudio */
.audio-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  margin-top: 15px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: transform 0.2s;
}

.audio-button:active {
  transform: scale(0.95);
}

/* Score display */
.score-display {
  font-size: 0.9rem;
  color: #2d3436;
  margin-top: 5px;
  font-weight: 600;
}

/* Grade ajustada para 8 personagens */
.characters-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

/* Instrumentos com scroll horizontal */
.instruments-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 10px;
}

.instruments-grid-expanded {
  display: flex;
  gap: 10px;
  padding: 5px;
  min-width: min-content;
}

.instrument-card {
  min-width: 90px;
  flex-shrink: 0;
}

/* Efeito glowing para selecionado */
.glowing {
  animation: glowEffect 1s ease-in-out infinite;
}

@keyframes glowEffect {
  0%, 100% { 
    box-shadow: 0 0 5px rgba(102, 126, 234, 0.5),
                0 0 10px rgba(102, 126, 234, 0.3);
  }
  50% { 
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.8),
                0 0 30px rgba(102, 126, 234, 0.5);
  }
}

/* Personagem tocando */
.character-card.playing .character-instrument {
  animation: bounce 0.5s ease-in-out infinite;
}

/* Botão de volume */
.control-button.volume {
  background: #6c5ce7;
}

/* Tablets e telas maiores */
@media (min-width: 768px) {
  .characters-grid {
    grid-template-columns: repeat(4, 1fr);
    max-width: 600px;
    margin: 0 auto 25px;
  }
  
  .instruments-grid-expanded {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }
  
  .instruments-scroll {
    overflow: visible;
  }
}

@media (min-width: 1024px) {
  .characters-grid {
    grid-template-columns: repeat(4, 1fr);
    max-width: 800px;
  }
}

/* Welcome text styling */
.welcome-text {
  margin: 12px 0;
  line-height: 1.6;
  color: #2d3436;
}

.welcome-text strong {
  color: #6c5ce7;
  font-size: 1.1rem;
}
