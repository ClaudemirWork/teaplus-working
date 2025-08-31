/* Estilos do Quebra-Cabeça */
.puzzle-grid {
  position: relative;
  user-select: none;
}

.puzzle-cell {
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}

.puzzle-cell:hover {
  border-color: #9333ea !important;
  transform: scale(1.02);
}

.puzzle-cell.drag-over {
  background-color: #e9d5ff;
  border-color: #9333ea;
}

/* Animações */
@keyframes pieceSnap {
  0% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.piece-snap {
  animation: pieceSnap 0.3s ease-out;
}

/* Confete */
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
  width: 12px;
  height: 12px;
  animation: confettiFall 3s ease-out forwards;
  z-index: 1000;
  border-radius: 2px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .puzzle-grid {
    width: 280px !important;
    height: 280px !important;
  }
}
