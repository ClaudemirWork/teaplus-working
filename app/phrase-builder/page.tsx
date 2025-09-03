'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GamePhase, gerarFasesDeJogo } from './gameData';
import styles from './PhraseBuilder.module.css';
import ReactConfetti from 'react-confetti';

export default function PhraseBuilderPage() {
  // Estado para controlar se estamos na tela de boas-vindas ou jogando
  const [gameState, setGameState] = useState<'welcome' | 'playing'>('welcome');

  // Estado para armazenar todas as fases do jogo
  const [allPhases, setAllPhases] = useState<GamePhase[]>([]);
  // Estado para saber em qual fase estamos
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  
  // Estado para o feedback de acerto e para disparar os confetes
  const [showSuccess, setShowSuccess] = useState(false);

  // Este efeito roda uma única vez quando a página é carregada
  useEffect(() => {
    // Gera e embaralha todas as 224 fases e as guarda para o jogo
    const fasesGeradas = gerarFasesDeJogo();
    setAllPhases(fasesGeradas);
  }, []);

  // ==================================================================
  // TELA DE ABERTURA / BEM-VINDO
  // ==================================================================
  if (gameState === 'welcome') {
    return (
      <div className={styles.welcomeContainer}>
        
        {/* Imagem dos mascotes */}
        <Image
          src="/images/mascotes/Leo-Mila-perdidos.png"
          alt="Mascotes Leo e Mila com expressões de confusão"
          width={250} // IMPORTANTE: Ajuste a largura para o tamanho real da sua imagem
          height={250} // IMPORTANTE: Ajuste a altura para o tamanho real da sua imagem
          priority 
        />

        <h1 className={styles.welcomeTitle}>Figuras Trocadas</h1>
        <p className={styles.welcomeSubtitle}>Organize as figuras na ordem certa!</p>
        
        {/* Regras do Jogo */}
        <div className={styles.rulesContainer}>
            <h2>Como Jogar:</h2>
            <ul>
                <li>Olhe com atenção para a imagem principal.</li>
                <li>Clique nas figuras na ordem correta para descrevê-la.</li>
                <li>Acerte para avançar e ganhar confetes!</li>
            </ul>
        </div>

        <button 
          className={styles.playButton} 
          onClick={() => setGameState('playing')}
        >
          Iniciar Aventura
        </button>
      </div>
    );
  }

  // ==================================================================
  // TELA PRINCIPAL DO JOGO
  // ==================================================================
  
  // Pega a fase atual da lista de fases que foi carregada
  const currentPhase = allPhases[currentPhaseIndex];

  // Se as fases ainda não foram carregadas, mostra uma mensagem temporária
  if (!currentPhase) {
    return <div>Carregando o jogo...</div>;
  }

  // Se já carregou, mostra o jogo
  return (
    <div className={styles.gameContainer}>
      {/* Mostra os confetes se o estado showSuccess for verdadeiro */}
      {showSuccess && <ReactConfetti />}
      
      <h1 className={styles.gameTitle}>Nível: {currentPhase.level}</h1>
      <p>Organize as figuras para descrever a imagem!</p>

      {/* --- ÁREA DE ESTÍMULO (IMAGEM PRINCIPAL) --- */}
      <div className={styles.stimulusArea}>
        <img src={currentPhase.stimulusImage} alt={currentPhase.title} className={styles.stimulusImage} />
      </div>

      {/* --- ÁREA DOS CARTÕES EMBARALHADOS (A FAZER) --- */}
      <div className={styles.shuffledArea}>
        <p>Aqui ficarão os cartões para clicar.</p>
        {/* A lógica para mostrar os elementos embaralhados virá aqui */}
      </div>

      {/* --- ÁREA DE RESPOSTA (A FAZER) --- */}
      <div className={styles.answerArea}>
        <p>Aqui ficarão os cartões que o usuário escolher.</p>
        {/* A lógica para mostrar os elementos selecionados virá aqui */}
      </div>

       {/* --- BOTÕES DE AÇÃO (A FAZER) --- */}
       <div className={styles.actions}>
        <button>Verificar</button>
        <button>Próxima Fase</button>
       </div>
    </div>
  );
}
