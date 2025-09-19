'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './shadowgame.css';
import Image from 'next/image';
import { Volume2, VolumeX, Trophy, Star, ArrowLeft, Zap, Flame, Award, Crown, Medal } from 'lucide-react';
import type { GameAudioManager } from '@/utils/gameAudioManager';

// --- DADOS DO JOGO (Mantidos do seu original) ---
const imageNames = [
    'abacate', 'abelha', 'abelha_feliz', 'abelha_voando', 'abelhinha', 'aguia', 'amigos', 'apresentacao', 'arvore_natal', 'baleia', 'bananas', 'barraca', 'beagle', 'berinjela', 'bike', 'biscoito', 'boneca', 'borboleta', 'brincando', 'brinquedo', 'brocolis', 'cachorro', 'cachorro_banho', 'cactus', 'cactus_vaso', 'caranguejo', 'carro_laranja', 'carro_vermelho', 'carta', 'casa', 'casa_balao', 'casal', 'cavalinho', 'cegonha', 'cerebro', 'cerejas', 'cobra', 'coco', 'coelho_chocolate', 'coelho_pascoa', 'coelho_pelucia', 'cone', 'coral', 'criancas', 'crocodilo', 'crocodilo_escola', 'crocodilo_feliz', 'detetive', 'doutor', 'elefante', 'elefantinho', 'enfeite_natal', 'esquilo', 'estudando', 'fantasminha', 'formiga', 'forte', 'franguinho', 'fusca', 'galinha', 'gata_danca', 'gatinho', 'gatinho_cores', 'gato', 'gato_balao', 'gato_branco', 'gato_caixa', 'gato_cores', 'gato_pretao', 'gato_preto', 'gel', 'genial', 'girafa', 'homem_neve', 'inseto', 'irmaos_crocodilos', 'leao', 'leitura', 'limao', 'maca_nervosa', 'melancia', 'melancia_pedaco', 'menina', 'menina_amor', 'menino', 'menino_cao', 'milkshake', 'motoca', 'mulher', 'mulher_gato', 'mundo', 'panda', 'papai_noel', 'pardal', 'passaro_azul', 'passaro_preto', 'passaros_fio', 'peixe_louco', 'penguim', 'pirata_pau', 'pote_ouro', 'preguica', 'professor', 'professora', 'puffy', 'relax', 'rosto', 'sapao', 'sapo', 'super_macaco', 'tartaruga', 'tenis', 'tenis_azul', 'tigre', 'tigre_feliz', 'trem', 'tres_crocodilos', 'tubarao', 'tulipas', 'turma', 'uniconio_rosa', 'unicornino', 'urso_branco', 'vegetais', 'violao', 'violino', 'vulcao', 'zebra'
];

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

type GameState = 'titleScreen' | 'instructions' | 'phase-selection' | 'playing';
type RoundType = 'imageToShadow' | 'shadowToImage';

export default function ShadowGamePage() {
  const [gameState, setGameState] = useState<GameState>('titleScreen');
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [roundData, setRoundData] = useState<{ mainItem: string; options: string[]; correctAnswer: string; } | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [pointsFeedback, setPointsFeedback] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highScore, setHighScore] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [isReady, setIsReady] = useState(false); // Controla se o áudio está pronto
  const [isInteracting, setIsInteracting] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioManagerRef = useRef<GameAudioManager | null>(null);

  // Efeito que carrega TUDO que depende do navegador de forma segura
  useEffect(() => {
    const initializeClientSide = async () => {
      try {
        // Importa o AudioManager dinamicamente para não quebrar o build
        const { GameAudioManager } = await import('@/utils/gameAudioManager');
        audioManagerRef.current = GameAudioManager.getInstance();

        // Carrega os dados do localStorage
        const savedHighScore = localStorage.getItem('shadowGameHighScore');
        const savedStars = localStorage.getItem('shadowGameTotalStars');
        if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));
        if (savedStars) setTotalStars(parseInt(savedStars, 10));
      } catch (error) {
        console.error("Erro ao inicializar áudio:", error);
        setAudioError("Não foi possível carregar o áudio. O jogo continuará sem som.");
      } finally {
        // Avisa para a UI que o jogo está pronto para começar (mesmo com falhas)
        setIsReady(true);
      }
    };

    initializeClientSide();
  }, []);

  // Funções de áudio que usam o AudioManager de forma segura
  const leoSpeak = useCallback((text: string, onEnd?: () => void) => {
    if (!isReady || !soundEnabled) {
      onEnd?.();
      return;
    }
    try {
      audioManagerRef.current?.falarLeo(text, onEnd);
    } catch (error) {
      console.error("Erro ao reproduzir áudio do Leo:", error);
      onEnd?.();
    }
  }, [isReady, soundEnabled]);

  const playSound = useCallback((soundName: string, volume: number = 0.5) => {
    if (!isReady || !soundEnabled) return;
    try {
      audioManagerRef.current?.playSoundEffect(soundName, volume);
    } catch (error) {
      console.error(`Erro ao reproduzir som ${soundName}:`, error);
    }
  }, [isReady, soundEnabled]);

  const startNewRound = (phase: number) => {
    setFeedback({});
    setPointsFeedback(null);
    let availableImages = [...imageNames];
    const correctImageName = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
    let roundType: RoundType;
    if (phase === 1) roundType = 'imageToShadow';
    else if (phase === 2) roundType = 'shadowToImage';
    else roundType = Math.random() < 0.5 ? 'imageToShadow' : 'shadowToImage';
    const wrongImageName1 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
    const wrongImageName2 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
    let mainItem: string, correctAnswer: string, options: string[];
    if (roundType === 'imageToShadow') {
      mainItem = `/shadow-game/images/${correctImageName}.webp`;
      correctAnswer = `/shadow-game/shadows/${correctImageName}_black.webp`;
      options = [correctAnswer, `/shadow-game/shadows/${wrongImageName1}_black.webp`, `/shadow-game/shadows/${wrongImageName2}_black.webp`];
    } else {
      mainItem = `/shadow-game/shadows/${correctImageName}_black.webp`;
      correctAnswer = `/shadow-game/images/${correctImageName}.webp`;
      options = [correctAnswer, `/shadow-game/images/${wrongImageName1}.webp`, `/shadow-game/images/${wrongImageName2}.webp`];
    }
    setRoundData({ mainItem, options: shuffleArray(options), correctAnswer });
  };

  const handlePhaseSelect = (phase: number) => {
    playSound('click_select');
    setSelectedPhase(phase);
    setScore(0);
    setStreak(0);
    const phaseMessages: { [key: number]: string } = {
      1: "Detetive Júnior! Boa sorte!",
      2: "Mestre das Sombras! Ficou mais difícil!",
      3: "Desafio Final! Para os melhores!"
    };
    leoSpeak(phaseMessages[phase]);
    setGameState('playing');
    startNewRound(phase);
  };

  const handleOptionClick = (clickedOption: string) => {
    if (Object.keys(feedback).length > 0 || !selectedPhase) return;

    if (clickedOption === roundData?.correctAnswer) {
      playSound('correct_chime', 0.4);
      const newStreak = streak + 1;
      let pointsGained = 100;
      if (newStreak >= 20) pointsGained = 3000;
      else if (newStreak >= 15) pointsGained = 2000;
      else if (newStreak >= 10) pointsGained = 1000;
      else if (newStreak >= 5) pointsGained = 500;
      else if (newStreak >= 2) pointsGained = 200;
      const currentScore = score + pointsGained;
      setScore(currentScore);
      setStreak(newStreak);
      setPointsFeedback(`+${pointsGained}`);
      const newTotalStars = totalStars + 1;
      setTotalStars(newTotalStars);
      localStorage.setItem('shadowGameTotalStars', newTotalStars.toString());
      if (currentScore > highScore) {
        setHighScore(currentScore);
        localStorage.setItem('shadowGameHighScore', currentScore.toString());
      }
      const comboMessages: { [key: number]: string } = {
        5: `UAU! Combo de ${newStreak} acertos!`,
        10: `INCRÍVEL! Sequência de ${newStreak}!`,
      };
      const comboMessageEntry = Object.entries(comboMessages).find(([key]) => newStreak === parseInt(key));
      if (comboMessageEntry) leoSpeak(comboMessageEntry[1]);
      setFeedback({ [clickedOption]: 'correct' });
      setTimeout(() => startNewRound(selectedPhase), 1500);
    } else {
      playSound('error_short', 0.4);
      setStreak(0);
      setFeedback({ [clickedOption]: 'incorrect' });
      leoSpeak("Opa, não foi essa. Tente de novo!");
      setTimeout(() => setFeedback({}), 800);
    }
  };
  
  // --- COMPONENTES DE TELA ---
  const TitleScreen = () => {
    const handlePlayIntro = async () => {
      if (isInteracting || !isReady) {
        console.log("Botão desabilitado ou já em interação");
        return;
      }
      
      console.log("Botão clicado - Iniciando jogo");
      setIsInteracting(true);
      playSound('click_start', 0.7);
      
      try {
        console.log("Forçando inicialização do áudio...");
        await audioManagerRef.current?.forceInitialize();
        
        // Adicionar um timeout como fallback
        const timeoutId = setTimeout(() => {
          console.log("Timeout: prosseguindo sem áudio");
          setGameState('instructions');
          setIsInteracting(false);
        }, 5000);
        
        console.log("Tentando fazer Leo falar...");
        leoSpeak("Olá! Eu sou o Leo! Vamos jogar com sombras?", () => {
          clearTimeout(timeoutId);
          console.log("Leo terminou de falar, mudando para instruções");
          setGameState('instructions');
          setIsInteracting(false);
        });
      } catch (error) {
        console.error("Erro durante a inicialização:", error);
        setGameState('instructions');
        setIsInteracting(false);
      }
    };
    
    return (
      <div className="screen-container title-screen">
        <div className="stars-bg"></div>
        <div className="leo-container">
          <Image src="/shadow-game/leo_abertura.webp" alt="Mascote Léo" width={300} height={300} priority />
        </div>
        <h1 className="main-title">Jogo das Sombras</h1>
        <p className="subtitle">Associe cada imagem com sua sombra!</p>
        
        {audioError && (
          <div className="error-message" style={{ 
            color: '#ff6a6a', 
            backgroundColor: 'rgba(255,255,255,0.8)', 
            padding: '10px', 
            borderRadius: '10px', 
            margin: '10px 0' 
          }}>
            {audioError}
          </div>
        )}
        
        <button 
          onClick={handlePlayIntro} 
          disabled={!isReady || isInteracting} 
          className="start-button"
        >
          {!isReady ? 'Carregando...' : (isInteracting ? 'Iniciando...' : 'Começar a Jogar')}
        </button>
        
        {!isReady && (
          <div className="loading-indicator" style={{ marginTop: '20px' }}>
            <div className="spinner"></div>
            <p>Preparando o jogo...</p>
          </div>
        )}
      </div>
    );
  };

  const InstructionsScreen = () => (
    <div className="screen-container explanation-screen">
      <div className="stars-bg"></div>
      <div className="leo-container">
        <Image src="/shadow-game/leo_abertura.webp" alt="Mascote Léo" width={200} height={200} />
      </div>
      <div className="speech-bubble">
        <p>É super fácil! Clique na sombra certa para cada figura e marque muitos pontos!</p>
      </div>
      <button onClick={() => { playSound("click_select"); setGameState('phase-selection'); }} className="start-button" style={{ marginTop: '2rem' }}>
        Entendi, vamos lá!
      </button>
    </div>
  );

  const PhaseSelectionScreen = () => (
    <div className="screen-container phase-selection-screen">
      <h2>Escolha seu Desafio!</h2>
      <div className="phase-container">
        <button onClick={() => handlePhaseSelect(1)} className="phase-button phase-1">
          <h3>Fase 1: Detetive Júnior</h3>
          <p>Encontre a sombra correta para cada imagem.</p>
        </button>
        <button onClick={() => handlePhaseSelect(2)} className="phase-button phase-2">
          <h3>Fase 2: Mestre das Sombras</h3>
          <p>Encontre a imagem correta para cada sombra.</p>
        </button>
        <button onClick={() => handlePhaseSelect(3)} className="phase-button phase-3">
          <h3>Fase 3: Desafio Final!</h3>
          <p>Tudo misturado para testar suas habilidades!</p>
        </button>
      </div>
    </div>
  );
  
  const GameScreen = () => {
    if (!roundData) return null;
    const comboIcons: { [key: string]: React.ElementType } = { '20': Crown, '15': Award, '10': Medal, '5': Flame, '2': Zap };
    const comboLevel = Object.keys(comboIcons).reverse().find(key => streak >= parseInt(key)) || '1';
    const ComboIcon = comboIcons[comboLevel] || Star;
    return (
      <div className="playing-screen">
        <div className="top-bar">
          <button onClick={() => setGameState('phase-selection')} className="back-button"><ArrowLeft size={20} /> Fases</button>
          <div className="score-display"><Trophy size={20} /> {score}</div>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="sound-button">
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
        {pointsFeedback && <div className="points-feedback fade-out-up">{pointsFeedback}</div>}
        <div className="main-item-container">
          <Image src={roundData.mainItem} alt="Item principal" width={250} height={250} />
        </div>
        <div className="options-container">
          {roundData.options.map((optionSrc, index) => (
            <button key={index} className={`option-button ${feedback[optionSrc] || ''}`} onClick={() => handleOptionClick(optionSrc)}>
              <Image src={optionSrc} alt={`Opção ${index + 1}`} width={100} height={100} />
            </button>
          ))}
        </div>
        <div className="streak-display">
          Combo: <ComboIcon className="combo-icon" /> {streak}x
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (gameState) {
      case 'instructions': return <InstructionsScreen />;
      case 'phase-selection': return <PhaseSelectionScreen />;
      case 'playing': return <GameScreen />;
      default: return <TitleScreen />;
    }
  };
  
  return <main className="shadow-game-main">{renderContent()}</main>;
}
