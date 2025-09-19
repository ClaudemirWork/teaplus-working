'use client';
import React, { useState, useEffect, useRef } from 'react';
import './shadowgame.css';
import Image from 'next/image';
import { Trophy, Star, ArrowLeft, Volume2, VolumeX } from 'lucide-react';

// ======================
// TIPOS E DADOS
// ======================
type GameState = 'loading' | 'intro' | 'instructions' | 'phase-selection' | 'playing';
type RoundType = 'imageToShadow' | 'shadowToImage';

// NOVA LISTA DE IMAGENS - SINCRONIZADA COM SEUS ARQUIVOS REAIS
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


const shuffleArray = (array: any[]) => {
 const newArray = [...array];
 for (let i = newArray.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
 }
 return newArray;
};

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

 const audioManagerRef = useRef<any>(null);

 // ======================
 // INICIALIZAÇÃO
 // ======================
 useEffect(() => {
  const init = async () => {
   try {
    const { GameAudioManager } = await import('@/utils/gameAudioManager');
    audioManagerRef.current = GameAudioManager.getInstance();
    console.log('🎮 GameAudioManager pronto');
   } catch (err) {
    console.warn('⚠️ GameAudioManager não carregado:', err);
   }
   setGameState('intro');
  };
  init();
 }, []);

 // ======================
 // FUNÇÕES DE ÁUDIO
 // ======================
 const leoSpeak = (text: string, onEnd?: () => void) => {
  if (!soundEnabled || !audioManagerRef.current) {
   onEnd?.();
   return;
  }
  try {
   audioManagerRef.current.falarLeo(text, onEnd);
  } catch (err) {
   console.error('Erro no leoSpeak:', err);
   onEnd?.();
  }
 };

 const playSound = (soundName: string, volume: number = 0.5) => {
    if (!soundEnabled || !audioManagerRef.current) return;
    try {
        audioManagerRef.current.playSoundEffect(soundName, volume);
    } catch(err) {
        console.error("Erro ao tocar som:", err);
    }
 }

 // ======================
 // LÓGICA DO JOGO
 // ======================
 const startNewRound = (phase: number) => {
  let availableImages = [...imageNames];
  const correctImage = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
  const wrong1 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
  const wrong2 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];

  let roundType: RoundType = phase === 1 ? 'imageToShadow' : phase === 2 ? 'shadowToImage' : (Math.random() < 0.5 ? 'imageToShadow' : 'shadowToImage');
  let mainItem, correctAnswer, options;

  if (roundType === 'imageToShadow') {
   mainItem = `/shadow-game/images/${correctImage}.webp`;
   correctAnswer = `/shadow-game/shadows/${correctImage}_black.webp`;
   options = shuffleArray([
    correctAnswer,
    `/shadow-game/shadows/${wrong1}_black.webp`,
    `/shadow-game/shadows/${wrong2}_black.webp`
   ]);
  } else {
   mainItem = `/shadow-game/shadows/${correctImage}_black.webp`;
   correctAnswer = `/shadow-game/images/${correctImage}.webp`;
   options = shuffleArray([
    correctAnswer,
    `/shadow-game/images/${wrong1}.webp`,
    `/shadow-game/images/${wrong2}.webp`
   ]);
  }

  setRoundData({ mainItem, options, correctAnswer });
 };

 // ======================
 // TELAS (COMPONENTES)
 // ======================

 const LoadingScreen = () => (
  <div className="screen-container loading-screen">
   <h1 className="main-title">Jogo das Sombras</h1>
   <p className="subtitle">Carregando...</p>
  </div>
 );

 const IntroScreen = () => {
  const handleClick = () => {
    playSound('click_start', 0.7);
    const fallback = setTimeout(() => setGameState('instructions'), 5000);
    leoSpeak("Olá! Eu sou o Léo! Vamos jogar com sombras?", () => {
      clearTimeout(fallback);
      setGameState('instructions');
    });
  };

  return (
   <div className="screen-container intro-screen">
    <Image src="/shadow-game/leo_abertura.webp" alt="Mascote Léo" width={250} height={250} priority />
    <h1 className="main-title">Jogo das Sombras</h1>
    <p className="subtitle">Associe cada imagem com sua sombra!</p>
    <button onClick={handleClick} className="start-button">
     Começar a Jogar
    </button>
   </div>
  );
 };

 const InstructionsScreen = () => {
  const handleClick = () => {
    playSound('click_select');
    const fallback = setTimeout(() => setGameState('phase-selection'), 5000);
    leoSpeak("É super fácil! Clique na sombra certa para cada figura!", () => {
      clearTimeout(fallback);
      setGameState('phase-selection');
    });
  };

  return (
   <div className="screen-container explanation-screen">
    <Image src="/shadow-game/leo_abertura.webp" alt="Léo explicando" width={200} height={200} />
    <div className="speech-bubble">
     <p>É super fácil! Clique na sombra certa para cada figura!</p>
    </div>
    <button onClick={handleClick} className="start-button">
     Entendi, vamos lá!
    </button>
   </div>
  );
 };

 const PhaseSelectionScreen = () => {
    const handleSelect = (phase: number) => {
        playSound('click_start');
        setSelectedPhase(phase);
        setScore(0);
        setStreak(0);

        const messages: {[key: number]: string} = {
            1: "Fase 1: Detetive Júnior! Boa Sorte!",
            2: "Fase 2: Mestre das Sombras! Ficou mais difícil!",
            3: "Fase 3: Desafio Final! Para os melhores!"
        };
        leoSpeak(messages[phase]);

        setGameState('playing');
        startNewRound(phase);
    };

    return (
        <div className="screen-container phase-selection-screen">
            <h2>Escolha seu desafio</h2>
            <div className="phase-container">
                <button onClick={() => handleSelect(1)}>🔍 Fase 1</button>
                <button onClick={() => handleSelect(2)}>🌟 Fase 2</button>
                <button onClick={() => handleSelect(3)}>🏆 Fase 3</button>
            </div>
        </div>
    );
 };

 const GameScreen = () => {
  if (!roundData) return null;

  const handleOptionClick = (opt: string) => {
   if (opt === roundData.correctAnswer) {
    playSound('correct_chime', 0.4);
    setScore(score + 100);
    setStreak(streak + 1);
    
    if ((streak + 1) % 5 === 0 && streak > 0) {
        leoSpeak(`Uau! Sequência de ${streak + 1}!`);
    }

    setTimeout(() => startNewRound(selectedPhase!), 300);

   } else {
    playSound('error_short', 0.4);
    setStreak(0);
    leoSpeak("Ops, tente de novo!");
   }
  };

  return (
   <div className="playing-screen">
    <div className="top-bar">
     <button onClick={() => setGameState('phase-selection')} className="back-button">
      <ArrowLeft size={20} /> Voltar
     </button>
     <button onClick={() => setSoundEnabled(!soundEnabled)} className="sound-button">
      {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
     </button>
    </div>

    <div className="main-item-container">
     <Image src={roundData.mainItem} alt="Item principal" width={250} height={250} />
    </div>

    <div className="options-container">
     {roundData.options.map((opt, i) => (
      <button key={i} onClick={() => handleOptionClick(opt)} className="option-button">
       <Image src={opt} alt={`Opção ${i + 1}`} width={100} height={100} />
      </button>
     ))}
    </div>

    <div className="stats-display">
     <div><Star color="#ffc700" fill="#ffc700" /> {streak}</div>
     <div><Trophy color="#ff9a00" fill="#ff9a00" /> {score}</div>
    </div>
   </div>
  );
 };

 // ======================
 // RENDERIZADOR PRINCIPAL
 // ======================
 const renderContent = () => {
  switch (gameState) {
   case 'loading': return <LoadingScreen />;
   case 'intro': return <IntroScreen />;
   case 'instructions': return <InstructionsScreen />;
   case 'phase-selection': return <PhaseSelectionScreen />;
   case 'playing': return <GameScreen />;
   default: return <LoadingScreen />;
  }
 };

 return (
  <main className="shadow-game-main">
   {renderContent()}
  </main>
 );
}
