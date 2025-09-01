/* Grade de instrumentos - 3 colunas no mobile */
.instruments-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px 0;
}

/* Personagens com visual melhorado */
.character-card {
  aspect-ratio: 1;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.character-empty {
  font-size: 2.5rem;
}

/* Tablets - 4 colunas */
@media (min-width: 768px) {
  .instruments-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
}
