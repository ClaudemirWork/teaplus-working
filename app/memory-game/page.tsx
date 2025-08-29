/* app/components/activities/memory-game/MemoryGame.module.css */

/* Container da carta com perspectiva */
.cardContainer {
  perspective: 1000px;
  cursor: pointer;
  width: 100%;
  aspect-ratio: 1 / 1.2;
  user-select: none;
}

/* Desabilitar clique em cartas combinadas */
.cardContainer.matched {
  cursor: default;
  pointer-events: none;
}

/* Elemento interno que realiza a rotação */
.cardInner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

/* Rotação quando a carta está virada */
.flipped {
  transform: rotateY(180deg);
}

/* Estilo base para ambos os lados da carta */
.cardFace {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 3px solid white;
  overflow: hidden;
}

/* Verso da carta - Gradiente mágico */
.cardBack {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

/* Efeito de brilho no verso */
.cardBack::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: rotate(45deg);
  animation: shimmer 3s infinite;
}

/* Frente da carta */
.cardFront {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  transform: rotateY(180deg);
  padding: 0.5rem;
}

/* Estado quando o par foi encontrado */
.matched {
  animation: matchPulse 0.6s ease-out;
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  border-color: #22c55e;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
}

/* Animações */
@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

@keyframes matchPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}

.animateFadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Responsividade */
@media (max-width: 640px) {
  .cardContainer {
    aspect-ratio: 1 / 1.1;
  }
}

@media (max-width: 480px) {
  .cardContainer {
    aspect-ratio: 1 / 1;
  }
  
  .cardFace {
    border-radius: 0.75rem;
    border-width: 2px;
  }
}

/* Hover effects */
.cardContainer:hover .cardInner:not(.flipped) {
  transform: translateY(-4px);
}

.cardContainer:hover .cardBack {
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.2);
}

/* Acessibilidade - Foco */
.cardContainer:focus-visible {
  outline: 3px solid #fbbf24;
  outline-offset: 2px;
  border-radius: 1rem;
}
