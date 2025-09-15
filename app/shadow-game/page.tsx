@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100vh) translateX(20px);
    opacity: 0;
  }
}

.animate-float {
  animation: float linear infinite;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

/* Melhorias para mobile */
@media (max-width: 640px) {
  .shadow-game-main {
    padding: 1rem;
  }
  
  .game-screen, .phase-selection-screen, .playing-screen {
    padding: 0.5rem;
  }
  
  .main-item-container {
    padding: 1rem;
  }
  
  .options-container {
    gap: 0.5rem;
  }
  
  .option-button {
    padding: 0.5rem;
  }
}
