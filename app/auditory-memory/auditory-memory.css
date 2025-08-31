/* ========================================
   AUDITORY MEMORY GAME - EFEITOS ESPECIAIS
   ======================================== */

/* Botões sempre visíveis e vibrantes */
.musical-button {
  backdrop-filter: blur(10px);
  background-blend-mode: screen;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.3);
  border: 2px solid rgba(255,255,255,0.2);
}

.musical-button:not(:disabled) {
  cursor: pointer;
  animation: subtle-glow 2s ease-in-out infinite;
}

@keyframes subtle-glow {
  0%, 100% { 
    box-shadow: 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.3);
  }
  50% { 
    box-shadow: 0 4px 30px rgba(255,255,255,0.2), inset 0 1px 1px rgba(255,255,255,0.5);
  }
}

/* Estados dos botões mais visíveis */
.btn-red { background: linear-gradient(135deg, #ff6b6b 0%, #ff4444 100%) !important; }
.btn-orange { background: linear-gradient(135deg, #ff9f43 0%, #ff6348 100%) !important; }
.btn-yellow { background: linear-gradient(135deg, #ffe66d 0%, #ffcc00 100%) !important; }
.btn-green { background: linear-gradient(135deg, #6bcf7f 0%, #4cd137 100%) !important; }
.btn-blue { background: linear-gradient(135deg, #4ecdc4 0%, #0097e6 100%) !important; }
.btn-purple { background: linear-gradient(135deg, #a8a4e6 0%, #7c3aed 100%) !important; }

/* Animação dos Mascotes */
@keyframes mascotBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
}

@keyframes mascotPulse {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* Explosão de Confete */
@keyframes confettiFall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(120vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti-piece {
  position: fixed;
  width: 10px;
  height: 10px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #ffe66d, #a8e6cf);
  animation: confettiFall 3s ease-out forwards;
  z-index: 1000;
}

/* Moedas Douradas */
@keyframes coinFall {
  0% {
    transform: translateY(-100px) rotateY(0deg) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    transform: translateY(100vh) rotateY(1080deg) scale(1);
    opacity: 1;
  }
}

@keyframes coinShine {
  0%, 100% { box-shadow: 0 0 20px #FFD700; }
  50% { box-shadow: 0 0 40px #FFD700, 0 0 60px #FFA500; }
}

.coin {
  position: fixed;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #FFD700, #FFA500);
  border-radius: 50%;
  animation: coinFall 2s ease-in forwards, coinShine 0.5s ease-in-out infinite;
  cursor: pointer;
  z-index: 999;
  border: 3px solid #FFD700;
}

/* Botões Musicais Coloridos */
.musical-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.musical-button:active::before {
  width: 300px;
  height: 300px;
}

/* Efeito de Botão Ativo */
.btn-active {
  animation: buttonPulse 0.5s ease-out;
  transform: scale(1.2) !important;
}

@keyframes buttonPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  50% {
    transform: scale(1.2);
    box-shadow: 0 0 30px 20px rgba(255, 255, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

/* Explosão de Estrelas */
@keyframes starBurst {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(3) rotate(180deg);
    opacity: 0;
  }
}

.star-burst {
  position: fixed;
  width: 50px;
  height: 50px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FFD700"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>');
  animation: starBurst 1s ease-out forwards;
  z-index: 1001;
}

/* Modo Combo - Arco-íris */
@keyframes rainbowBackground {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.combo-mode {
  background: linear-gradient(270deg, #ff6b6b, #ff9f43, #ffe66d, #6bcf7f, #4ecdc4, #a8a4e6);
  background-size: 600% 600%;
  animation: rainbowBackground 3s ease infinite;
}

/* Tela Tremendo */
@keyframes screenShake {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5px, -5px); }
  20% { transform: translate(5px, -5px); }
  30% { transform: translate(-5px, 5px); }
  40% { transform: translate(5px, 5px); }
  50% { transform: translate(0, 0); }
}

.shake-screen {
  animation: screenShake 0.5s ease-out;
}

/* Baú Surpresa */
@keyframes chestBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  25% { transform: translateY(-30px) scale(1.1) rotate(-5deg); }
  75% { transform: translateY(-30px) scale(1.1) rotate(5deg); }
}

.treasure-chest {
  position: fixed;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 10px;
  animation: chestBounce 2s ease-in-out infinite;
  cursor: pointer;
  z-index: 998;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
}

/* Power-ups Flutuando */
@keyframes floatPowerUp {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.power-up {
  animation: floatPowerUp 3s ease-in-out infinite;
}

/* Partículas de Sucesso */
@keyframes particleFloat {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), var(--y)) scale(0);
    opacity: 0;
  }
}

.success-particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #FFD700, #FFA500);
  border-radius: 50%;
  animation: particleFloat 1s ease-out forwards;
}

/* Texto Animado de Pontos */
@keyframes scorePopup {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  50% {
    transform: translateY(-50px) scale(1.5);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

.score-popup {
  position: fixed;
  font-size: 48px;
  font-weight: bold;
  color: #FFD700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  animation: scorePopup 2s ease-out forwards;
  z-index: 1002;
  pointer-events: none;
}

/* Fogos de Artifício */
@keyframes firework {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.firework {
  position: fixed;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, transparent, #ff6b6b, #ffe66d, #4ecdc4, transparent);
  border-radius: 50%;
  animation: firework 1s ease-out forwards;
  z-index: 999;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .musical-button {
    min-height: 80px;
    font-size: 24px !important;
  }
  
  .coin {
    width: 35px;
    height: 35px;
  }
  
  .treasure-chest {
    width: 60px;
    height: 60px;
  }
  
  .score-popup {
    font-size: 36px;
  }
  
  @keyframes mascotBounce {
    0%, 100% { transform: translateY(0) scale(0.9); }
    50% { transform: translateY(-15px) scale(1); }
  }
}

/* Animação de Loading */
@keyframes loadingPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.loading-note {
  animation: loadingPulse 1s ease-in-out infinite;
}

/* Efeito Neon para Modo Especial */
.neon-glow {
  animation: neonPulse 1.5s ease-in-out infinite;
}

@keyframes neonPulse {
  0%, 100% {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073;
  }
  50% {
    text-shadow: 0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4da6, 0 0 50px #ff4da6;
  }
}

/* Transições Suaves */
* {
  -webkit-tap-highlight-color: transparent;
}

.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Desabilita seleção de texto no jogo */
.game-container {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
