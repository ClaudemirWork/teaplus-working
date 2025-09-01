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

/* Continua com o resto do CSS... */
