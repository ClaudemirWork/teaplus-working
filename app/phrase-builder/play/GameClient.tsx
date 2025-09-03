'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Home, ChevronRight, RotateCcw, Trophy, Sparkles, CheckCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { GamePhase, GameElement, gerarFasesDeJogo } from '../gameData';
import styles from '../PhraseBuilder.module.css'; 
import ReactConfetti from 'react-confetti';

export default function GameClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = searchParams.get('level') as 'iniciante' | 'intermediario' | null;

  const [allPhases, setAllPhases] = useState<GamePhase[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [availableElements, setAvailableElements] = useState<GameElement[]>([]);
  const [userSequence, setUserSequence] = useState<GameElement[]>([]);
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string; correctSentence?: string }>({ 
    show: false, 
    correct: false, 
    message: '' 
  });
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Gerenciar tamanho da janela para confetti
  useEffect(() => {
    const handleResize = () => setWindowSize({ 
      width: window.innerWidth, 
      height: window.innerHeight 
    });
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carregar fases do nível
  useEffect(() => {
    if (level) {
      const todasAsFases = gerarFasesDeJogo();
      const fasesDoNivel = todasAsFases.filter(fase => fase.level === level);
      setAllPhases(fasesDoNivel);
      setCurrentPhaseIndex(0);
    }
  }, [level]);

  const currentPhase = useMemo(() => allPhases[currentPhaseIndex], [allPhases, currentPhaseIndex]);

  // Inicializar elementos quando a fase mudar
  useEffect(() => {
    if (currentPhase) {
      const elementsToShuffle = [...currentPhase.elements];
      setAvailableElements(elementsToShuffle.sort(() => Math.random() - 0.5));
      setUserSequence([]);
      setFeedback({ show: false, correct: false, message: '' });
      setShowConfetti(false);
    }
  }, [currentPhase]);

  // Mover elemento para a sequência
  const handleSelectElement = (element: GameElement) => {
    if (feedback.show) return;
    
    setAvailableElements(prev => prev.filter(el => el.id !== element.id));
    setUserSequence(prev => [...prev, element]);
  };

  // Remover elemento da sequência
  const handleDeselectElement = (element: GameElement) => {
    if (feedback.show) return;
    
    setUserSequence(prev => prev.filter(el => el.id !== element.id));
    setAvailableElements(prev => {
      const newAvailable = [...prev, element];
      return newAvailable.sort((a, b) => a.id - b.id);
    });
  };

  // Verificar sequência
  const checkSequence = () => {
    if (!currentPhase || userSequence.length !== currentPhase.elements.length) return;
    
    const isCorrect = userSequence.every((element, index) => 
      element.correctOrder === index + 1
    );
    
    if (isCorrect) {
      setFeedback({ 
        show: true, 
        correct: true, 
        message: currentPhase.completionMessage, 
        correctSentence: currentPhase.title 
      });
      setScore(prev => prev + 100);
      setShowConfetti(true);
      
      // Salvar progresso para desbloquear próximo nível
      if (level === 'iniciante' && typeof window !== 'undefined') {
        localStorage.setItem('phraseBuilderInicianteCompleto', 'true');
      }
    } else {
      setFeedback({ 
        show: true, 
        correct: false, 
        message: 'Ops! A ordem não está certa. Tente de novo!' 
      });
    }
  };

  // Próxima fase
  const nextPhase = () => {
    if (currentPhaseIndex < allPhases.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
    } else {
      alert('🎉 Parabéns! Você completou todas as fases deste nível!');
      router.push('/phrase-builder');
    }
  };
  
  // Recomeçar atividade
  const resetActivity = () => {
    if (!currentPhase) return;
    
    const elementsToShuffle = [...currentPhase.elements];
    setAvailableElements(elementsToShuffle.sort(() => Math.random() - 0.5));
    setUserSequence([]);
    setFeedback({ show: false, correct: false, message: '' });
    setShowConfetti(false);
  };

  // Verificação de carregamento
  if (!level || !currentPhase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
        <div className="text-white text-2xl">Carregando jogo...</div>
      </div>
    );
  }

  const isSequenceComplete = availableElements.length === 0;

  return (
    <div className={styles.playPageContainer}>
      {/* Confetti */}
      {showConfetti && (
        <ReactConfetti 
          width={windowSize.width} 
          height={windowSize.height} 
          recycle={false} 
          numberOfPieces={400} 
        />
      )}
      
      {/* Header */}
      <header className={styles.playHeader}>
        <button 
          onClick={() => router.push('/phrase-builder')} 
          className={styles.headerButton}
        >
          <Home className="w-5 h-5" /> 
          Menu
        </button>
        
        <div className={styles.headerTitle}>
          <h1>{currentPhase.title}</h1>
          <p>História {currentPhaseIndex + 1} de {allPhases.length}</p>
        </div>
        
        <div className={styles.headerScore}>
          <Trophy className="w-5 h-5 text-yellow-500" />
          {score}
        </div>
      </header>
      
      <div className={styles.gameContainer}>
        {/* Imagem Estímulo */}
        <div className={styles.stimulusArea}>
          <Image 
            src={currentPhase.stimulusImage} 
            alt={currentPhase.title} 
            width={200} 
            height={200} 
            className={styles.stimulusImage} 
          />
        </div>

        {/* Grid Principal */}
        <div className={styles.gameGrid}>
          {/* Painel Esquerdo - Figuras Disponíveis */}
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>
              <Sparkles className="w-5 h-5 text-green-500"/>
              Partes da Figura
            </h3>
            
            <div className={styles.cardArea}>
              {availableElements.map(element => (
                <button 
                  key={element.id} 
                  onClick={() => handleSelectElement(element)} 
                  className={styles.cardButton}
                >
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <Image 
                    src={element.content} 
                    alt={element.label} 
                    width={60} 
                    height={60} 
                    className={styles.cardImage} 
                  />
                  <span className={styles.cardLabel}>{element.label}</span>
                </button>
              ))}
              
              {isSequenceComplete && !feedback.show && (
                <p className={styles.emptyAreaText}>
                  Ótimo! Agora clique em Verificar.
                </p>
              )}
            </div>
          </div>

          {/* Painel Direito - Monte a Sequência */}
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>
              📖 Monte a Sequência na Ordem
            </h3>
            
            <div className={styles.dropZone}>
              {userSequence.map((element, index) => (
                <button 
                  key={element.id} 
                  onClick={() => handleDeselectElement(element)} 
                  className={styles.cardButtonInSequence}
                >
                  <div className={styles.sequenceNumber}>{index + 1}°</div>
                  <Image 
                    src={element.content} 
                    alt={element.label} 
                    width={60} 
                    height={60} 
                    className={styles.cardImage} 
                  />
                  <span className={styles.cardLabel}>{element.label}</span>
                </button>
              ))}
              
              {userSequence.length === 0 && (
                <p className={styles.emptyAreaText}>
                  Clique nas figuras para adicioná-las aqui na ordem certa.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Barra de Ações/Feedback */}
        <div className={styles.bottomBar}>
          {!feedback.show ? (
            <div className={styles.actionButtonsContainer}>
              <button 
                onClick={checkSequence} 
                disabled={!isSequenceComplete} 
                className={styles.verifyButton}
              >
                <CheckCircle className="w-5 h-5" /> 
                Verificar Sequência
              </button>
              
              <button 
                onClick={resetActivity} 
                className={styles.resetButton}
              >
                <RotateCcw className="w-5 h-5" /> 
                Recomeçar
              </button>
            </div>
          ) : (
            <div className={`${styles.feedbackArea} ${
              feedback.correct ? styles.feedbackCorrect : styles.feedbackIncorrect
            }`}>
              <div className={styles.feedbackText}>
                <p>{feedback.message}</p>
                {feedback.correctSentence && (
                  <strong className={styles.correctSentence}>
                    {feedback.correctSentence}
                  </strong>
                )}
              </div>
              
              {feedback.correct ? (
                <button onClick={nextPhase} className={styles.nextPhaseButton}>
                  Próxima História 
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button onClick={resetActivity} className={styles.resetButton}>
                  <RotateCcw className="w-5 h-5" /> 
                  Tentar Novamente
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
