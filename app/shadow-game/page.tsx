'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './shadowgame.css';
import Image from 'next/image';
import { Trophy, Star, ArrowLeft, Volume2, VolumeX } from 'lucide-react';

// ======================
// TIPOS E DADOS
// ======================
type GameState = 'loading' | 'intro' | 'instructions' | 'phase-selection' | 'playing' | 'phaseComplete' | 'gameComplete';
type RoundType = 'imageToShadow' | 'shadowToImage';
type SoundType = 'correct' | 'error' | 'click' | 'combo';

const imageNames = [
    'abacate', 'abelha', 'abelha_feliz', 'abelha_voando', 'abelhinha', 'aguia', 'amigos', 
    'apresentacao', 'arvore_natal', 'baleia', 'bananas', 'barraca', 'beagle', 'berinjela', 
    'bike', 'biscoito', 'boneca', 'borboleta', 'brincando', 'brinquedo', 'brocolis', 
    'cachorro', 'cachorro_banho', 'cactus', 'cactus_vaso', 'caranguejo', 'carro_laranja', 
    'carro_vermelho', 'carta', 'casa', 'casa_balao', 'casal', 'cavalinho', 'cegonha', 
    'cerebro', 'cerejas', 'cobra', 'coco', 'coelho_chocolate', 'coelho_pascoa', 
    'coelho_pelucia', 'cone', 'coral', 'criancas', 'crocodilo', 'crocodilo_escola', 
    'crocodilo_feliz', 'detetive', 'doutor', 'elefante', 'elefantinho', 'enfeite_natal', 
    'esquilo', 'estudando', 'fantasminha', 'formiga', 'forte', 'franguinho', 'fusca', 
    'galinha', 'gata_danca', 'gatinho', 'gatinho_cores', 'gato', 'gato_balao', 
    'gato_branco', 'gato_caixa', 'gato_cores', 'gato_pretao', 'gato_preto', 'gel', 
    'genial', 'girafa', 'homem_neve', 'inseto', 'irmaos_crocodilos', 'leao', 'leitura', 
    'limao', 'maca_nervosa', 'melancia', 'melancia_pedaco', 'menina', 'menina_amor', 
    'menino', 'menino_cao', 'milkshake', 'motoca', 'mulher', 'mulher_gato', 'mundo', 
    'panda', 'papai_noel', 'pardal', 'passaro_azul', 'passaro_preto', 'passaros_fio', 
    'peixe_louco', 'penguim', 'pirata_pau', 'pote_ouro', 'preguica', 'professor', 
    'professora', 'puffy', 'relax', 'rosto', 'sapao', 'sapo', 'super_macaco', 'tartaruga', 
    'tenis', 'tenis_azul', 'tigre', 'tigre_feliz', 'trem', 'tres_crocodilos', 'tubarao', 
    'tulipas', 'turma', 'uniconio_rosa', 'unicornino', 'urso_branco', 'vegetais', 'violao', 
    'violino', 'vulcao', 'zebra'
];

const shuffleArray = (array: any[]) => { /* ...código sem alteração... */ };
const ConfettiEffect = () => { /* ...código sem alteração... */ };
const ROUNDS_PER_PHASE = 20;

// ======================
// COMPONENTE PRINCIPAL
// ======================
export default function ShadowGamePage() {
 const [gameState, setGameState] = useState<GameState>('loading');
 const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
 const [roundData, setRoundData] = useState<{ mainItem: string; options: string[]; correctAnswer: string } | null>(null);
 const [score, setScore] = useState(0);
 const [streak, setStreak] = useState(0);
 const [soundEnabled, setSoundEnabled] = useState(true);
 const [showConfetti, setShowConfetti] = useState(false);
 const [roundCount, setRoundCount] = useState(0);

 const audioManagerRef = useRef<any>(null);
 const audioContextRef = useRef<AudioContext | null>(null);

 useEffect(() => { /* ...código de inicialização sem alteração... */ }, []);
 const playSynthSound = useCallback((type: SoundType) => { /* ...código sem alteração... */ }, [soundEnabled]);
 const leoSpeak = useCallback((text: string, onEnd?: () => void) => { /* ...código sem alteração... */ }, [soundEnabled]);
 const startNewRound = useCallback((phase: number) => { /* ...código sem alteração... */ }, []);

 // ======================
 // TELAS (COMPONENTES)
 // ======================

 const LoadingScreen = () => (<div className="screen-container loading-screen"><h1 className="main-title">Jogo das Sombras</h1><p className="subtitle">Carregando...</p></div>);
 const IntroScreen = () => { /* ...código sem alteração... */ };
 const InstructionsScreen = () => { /* ...código sem alteração... */ };
 const PhaseSelectionScreen = () => { /* ...código sem alteração... */ };

 const GameScreen = () => {
  if (!roundData) return null;
  
  // FRASES DO LEO ATUALIZADAS E MAIS VARIADAS
  const leoStreakPhrases: {[key:number]: string[]} = {
      10: ["Aí sim, sequência de 10!", "Você tem olhar de águia! Já são 10!", "Continue assim, 10 seguidos!"],
      20: ["Você é muito top, sequência de 20!", "Caramba! 20 acertos seguidos!", "Que mira perfeita! 20!"],
      30: ["Impossível! Você atingiu uma sequência incrível de 30!", "Ninguém te segura! 30 em seguida!", "Você é um Mestre das Sombras! 30!"]
  };

  const leoErrorPhrases = ["Ops, tente de novo!", "Essa não foi a certa, mas não desista!", "Quase! Tente a outra sombra."];

  const handleOptionClick = (opt: string) => {
   if (opt === roundData.correctAnswer) {
    const newStreak = streak + 1;
    const newRoundCount = roundCount + 1;
    setScore(score + 100);
    setStreak(newStreak);
    setRoundCount(newRoundCount);
    playSynthSound('correct');

    if (newStreak % 5 === 0 && newStreak > 0) {
        setShowConfetti(true);
        playSynthSound('combo');
        setTimeout(() => setShowConfetti(false), 2000);
    }

    // LÓGICA DE TRANSIÇÃO ATUALIZADA
    if (newRoundCount >= ROUNDS_PER_PHASE) {
        if (selectedPhase === 3) { setGameState('gameComplete'); } 
        else { setGameState('phaseComplete'); }
        return; // IMPORTANTE: Interrompe a função aqui para não falar a frase de combo
    }
    
    // As falas de combo só acontecem se o jogo NÃO terminou
    const phrases = leoStreakPhrases[newStreak];
    if (phrases) {
        leoSpeak(phrases[Math.floor(Math.random() * phrases.length)]);
    }
    
    setTimeout(() => startNewRound(selectedPhase!), 300);

   } else {
    playSynthSound('error');
    setStreak(0);
    // Usa uma frase de erro aleatória
    leoSpeak(leoErrorPhrases[Math.floor(Math.random() * leoErrorPhrases.length)]);
   }
  };

  return (
   <div className="playing-screen">
    {showConfetti && <ConfettiEffect />}
    <div className="top-bar">
     <button onClick={() => { playSynthSound('click'); setGameState('phase-selection'); }} className="back-button"><ArrowLeft size={20} /> Fases</button>
     <div className="progress-bar"><div className="progress-fill" style={{ width: `${(roundCount / ROUNDS_PER_PHASE) * 100}%` }}></div></div>
     <button onClick={() => { playSynthSound('click'); setSoundEnabled(!soundEnabled); }} className="sound-button">{soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}</button>
    </div>
    <div className="main-item-container"><Image src={roundData.mainItem} alt="Item principal" width={250} height={250} /></div>
    <div className="options-container">{roundData.options.map((opt, i) => (<button key={i} onClick={() => handleOptionClick(opt)} className="option-button"><Image src={opt} alt={`Opção ${i + 1}`} width={100} height={100} /></button>))}</div>
    <div className="stats-display"><div><Star color="#ffc700" fill="#ffc700" /> {streak}</div><div><Trophy color="#ff9a00" fill="#ff9a00" /> {score}</div></div>
   </div>
  );
 };

 const PhaseCompleteScreen = () => { /* ...código sem alteração... */ };
 
 const GameCompleteScreen = () => {
    // CORREÇÃO DO LOOPING: Adicionamos uma "trava" para garantir que a fala rode só uma vez.
    const hasTriggeredCelebration = useRef(false);

    useEffect(() => {
        if (!hasTriggeredCelebration.current) {
            leoSpeak("Parabéns! Você se tornou um verdadeiro Mestre das Sombras!");
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 4000);
            hasTriggeredCelebration.current = true; // Ativa a trava
            return () => clearTimeout(timer);
        }
    }, []);

    const playAgain = () => { playSynthSound('click'); setGameState('phase-selection'); };
    return (<div className="screen-container game-complete-screen">{showConfetti && <ConfettiEffect />}<h2 className="main-title">CAMPEÃO!</h2><Trophy className="trophy-icon" size={200} /><p className="subtitle" style={{color: '#fff', marginTop: '1rem'}}>Você é um Mestre das Sombras!</p><p className="final-score">Pontuação Final: {score}</p><button onClick={playAgain} className="start-button">Jogar Novamente</button></div>);
 };

 const renderContent = () => {
  switch (gameState) {
   case 'loading': return <LoadingScreen />;
   case 'intro': return <IntroScreen />;
   case 'instructions': return <InstructionsScreen />;
   case 'phase-selection': return <PhaseSelectionScreen />;
   case 'playing': return <GameScreen />;
   case 'phaseComplete': return <PhaseCompleteScreen />;
   case 'gameComplete': return <GameCompleteScreen />;
   default: return <LoadingScreen />;
  }
 };

 return (<main className="shadow-game-main">{renderContent()}</main>);
}
