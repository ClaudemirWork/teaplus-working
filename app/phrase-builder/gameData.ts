// ARQUIVO COMPLETO E CORRIGIDO
// Local: app/phrase-builder/play/GameClient.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Home, ChevronRight, RotateCcw, Trophy, Sparkles, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { GamePhase, GameElement, gerarFasesDeJogo } from '../gameData'; // <-- CAMINHO CORRIGIDO AQUI
import styles from '../PhraseBuilder.module.css'; 
import ReactConfetti from 'react-confetti';

export default function GameClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = searchParams.get('level') as 'iniciante' | 'intermediario' | null;

  const [allPhases, setAllPhases] = useState<GamePhase[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [shuffledElements, setShuffledElements] = useState<GameElement[]>([]);
  const [userSequence, setUserSequence] = useState<GameElement[]>([]);
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string; correctSentence?: string }>({ show: false, correct: false, message: '' });
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (level) {
      const todasAsFases = gerarFasesDeJogo();
      const fasesDoNivel = todasAsFases.filter(fase => fase.level === level);
      setAllPhases(fasesDoNivel);
      setCurrentPhaseIndex(0);
    }
  }, [level]);

  const currentPhase = useMemo(() => allPhases[currentPhaseIndex], [allPhases, currentPhaseIndex]);

  useEffect(() => {
    if (currentPhase) {
      const elementsToShuffle = [...currentPhase.elements];
      setShuffledElements(elementsToShuffle.sort(() => Math.random() - 0.5));
      setUserSequence([]);
      setFeedback({ show: false, correct: false, message: '' });
      setShowConfetti(false);
    }
  }, [currentPhase]);

  const handleSelectElement = (elementToMove: GameElement) => {
    if (feedback.show) return;
    setShuffledElements(prev => prev.filter(el => el.id !== elementToMove.id));
    setUserSequence(prev => [...prev, elementToMove]);
  };

  const handleDeselectElement = (elementToMove: GameElement) => {
    if (feedback.show) return;
    setUserSequence(prev => prev.filter(el => el.id !== elementToMove.id));
    setShuffledElements(prev => [...prev, elementToMove].sort((a,b) => a.id - b.id));
  };

  const checkSequence = () => {
    if (userSequence.length !== currentPhase.elements.length) return;
    const isCorrect = userSequence.every((element, index) => element.correctOrder === index + 1);
    
    if (isCorrect) {
      setFeedback({ show: true, correct: true, message: currentPhase.completionMessage, correctSentence: currentPhase.title });
      setScore(prev => prev + 100);
      setShowConfetti(true);
      if (level === 'iniciante' && typeof window !== 'undefined') {
          localStorage.setItem('phraseBuilderInicianteCompleto', 'true');
      }
    } else {
      setFeedback({ show: true, correct: false, message: 'Ops! A ordem não está certa. Tente de novo!' });
    }
  };

  const nextPhase = () => {
    if (currentPhaseIndex < allPhases.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
    } else {
      alert('Parabéns, você completou todas as fases deste nível!');
      router.push('/phrase-builder');
    }
  };
  
  const resetActivity = () => {
      const elementsToShuffle = [...currentPhase.elements];
      setShuffledElements(elementsToShuffle.sort(() => Math.random() - 0.5));
      setUserSequence([]);
      setFeedback({ show: false, correct: false, message: '' });
      setShowConfetti(false);
  }

  if (!level || !currentPhase) {
    return <div className="min-h-screen flex items-center justify-center">Carregando nível...</div>;
  }

  const isSequenceComplete = shuffledElements.length === 0;

  return (
    <div className={styles.playPageContainer}>
      {showConfetti && <ReactConfetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={400} />}
      <div className={styles.playHeader}>
        <button onClick={() => router.push('/phrase-builder')} className={styles.headerButton}><Home className="w-5 h-5 mr-2" /> Menu</button>
        <div className={styles.headerTitle}><h1>{currentPhase.title}</h1><p>Fase {currentPhaseIndex + 1} de {allPhases.length}</p></div>
        <div className={styles.headerScore}><Trophy className="w-5 h-5 text-yellow-500" /><span>{score}</span></div>
      </div>
      
      <div className={styles.stimulusArea}>
        <Image src={currentPhase.stimulusImage} alt={currentPhase.title} width={300} height={300} className={styles.stimulusImage} />
      </div>

      <div className={styles.gameGrid}>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}><Sparkles className="w-5 h-5 mr-2 text-blue-500"/>Figuras Disponíveis</h3>
          <div className={styles.cardArea}>
            {shuffledElements.map(element => (
              <button key={element.id} onClick={() => handleSelectElement(element)} className={styles.cardButton}>
                <Image src={element.content} alt={element.label} width={150} height={150} className={styles.cardImage} />
                <span className={styles.cardLabel}>{element.label}</span>
              </button>
            ))}
            {isSequenceComplete && !feedback.show && <p className={styles.emptyAreaText}>Ótimo! Agora clique em Verificar.</p>}
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>📖 Monte a Sequência na Ordem</h3>
          <div className={styles.dropZone}>
            {userSequence.map((element, index) => (
              <button key={element.id} onClick={() => handleDeselectElement(element)} className={styles.cardButtonInSequence}>
                 <div className={styles.sequenceNumber}>{index + 1}°</div>
                 <Image src={element.content} alt={element.label} width={120} height={120} className={styles.cardImage} />
                 <span className={styles.cardLabel}>{element.label}</span>
              </button>
            ))}
            {!isSequenceComplete && userSequence.length === 0 && <p className={styles.emptyAreaText}>Clique nas figuras para adicioná-las aqui.</p>}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        {!feedback.show ? (
            <div className={styles.actionButtonsContainer}>
                <button onClick={checkSequence} disabled={!isSequenceComplete} className={styles.verifyButton}>
                    <CheckCircle className="w-5 h-5 mr-2"/> Verificar
                </button>
                <button onClick={resetActivity} className={styles.resetButton}>
                    <RotateCcw className="w-4 h-4 mr-2" /> Recomeçar
                </button>
            </div>
        ) : (
            <div className={`${styles.feedbackArea} ${feedback.correct ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
                <div className={styles.feedbackText}>
                    <p>{feedback.message}</p>
                    {feedback.correctSentence && <strong className={styles.correctSentence}>{feedback.correctSentence}</strong>}
                </div>
                {feedback.correct && (
                    <button onClick={nextPhase} className={styles.nextPhaseButton}>Próxima Fase <ChevronRight /></button>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
