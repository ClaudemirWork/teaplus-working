'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './shadowgame.css';
import Image from 'next/image';
import { Trophy, Star, ArrowLeft, Volume2, VolumeX } from 'lucide-react';

// ======================
// TIPOS E DADOS
// ======================
type GameState = 'loading' | 'intro' | 'instructions' | 'phase-selection' | 'playing';
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

const shuffleArray = (array: any[]) => {
 const newArray = [...array];
 for (let i = newArray.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
 }
 return newArray;
};

// ======================
// EFEITO DE CONFETE
// ======================
const ConfettiEffect = () => {
    useEffect(() => {
        let canvas: HTMLCanvasElement | null = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1000';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: any[] = [];
        const colors = ["#ffca3a", "#ff595e", "#8ac926", "#1982c4", "#6a4c93"];
        
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * -window.innerHeight,
                vx: (Math.random() - 0.5) * 8,
                vy: Math.random() * 10 + 5,
                size: Math.random() * 5 + 2,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        const animate = () => {
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.vy += 0.05;
                p.y += p.vy;
                p.x += p.vx;
                if (p.y > window.innerHeight) {
                    particles.splice(i, 1);
                }
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size * 2);
            });
            if (particles.length > 0) {
                requestAnimationFrame(animate);
            } else {
                if(canvas && canvas.parentNode) {
                    canvas.parentNode.removeChild(canvas);
                    canvas = null;
                }
            }
        };
        animate();

        return () => {
            if (canvas && canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        };
    }, []);

    return null;
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
 const [showConfetti, setShowConfetti] = useState(false);

 const audioManagerRef = useRef<any>(null);
 const audioContextRef = useRef<AudioContext | null>(null);

 // ======================
 // INICIALIZAÇÃO
 // ======================
 useEffect(() => {
  const init = async () => {
   try {
    const { GameAudioManager } = await import('@/utils/gameAudioManager');
    audioManagerRef.current = GameAudioManager.getInstance();
    // @ts-ignore
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    console.log('🎮 GameAudioManager e AudioContext prontos');
   } catch (err) {
    console.warn('⚠️ Erro na inicialização de áudio:', err);
   }
   setGameState('intro');
  };
  init();
 }, []);

 // ======================
 // FUNÇÕES DE ÁUDIO
 // ======================
 const playSynthSound = useCallback((type: SoundType) => {
    if (!soundEnabled || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    gainNode.connect(ctx.destination);
    oscillator.connect(gainNode);
    
    switch (type) {
        case 'correct':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, ctx.currentTime);
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
            oscillator.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
            break;
        case 'error':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(200, ctx.currentTime);
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
            oscillator.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
            break;
        case 'click':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1);
            break;
        case 'combo':
             oscillator.type = 'triangle';
             gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
             [440, 550, 660, 880].forEach((freq, i) => {
                 oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
             });
             gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4);
             break;
    }

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
 }, [soundEnabled]);

 const leoSpeak = useCallback((text: string, onEnd?: () => void) => {
  if (!soundEnabled || !audioManagerRef.current) {
   onEnd?.();
   return;
  }
  audioManagerRef.current.falarLeo(text, onEnd);
 }, [soundEnabled]);

 // ======================
 // LÓGICA DO JOGO
 // ======================
 const startNewRound = useCallback((phase: number) => {
  let availableImages = [...imageNames];
  const correctImage = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
  const wrong1 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
  const wrong2 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
  let roundType: RoundType = phase === 1 ? 'imageToShadow' : phase === 2 ? 'shadowToImage' : (Math.random() < 0.5 ? 'imageToShadow' : 'shadowToImage');
  let mainItem, correctAnswer, options;
  if (roundType === 'imageToShadow') {
   mainItem = `/shadow-game/images/${correctImage}.webp`;
   correctAnswer = `/shadow-game/shadows/${correctImage}_black.webp`;
   options = shuffleArray([correctAnswer, `/shadow-game/shadows/${wrong1}_black.webp`, `/shadow-game/shadows/${wrong2}_black.webp`]);
  } else {
   mainItem = `/shadow-game/shadows/${correctImage}_black.webp`;
   correctAnswer = `/shadow-game/images/${correctImage}.webp`;
   options = shuffleArray([correctAnswer, `/shadow-game/images/${wrong1}.webp`, `/shadow-game/images/${wrong2}.webp`]);
  }
  setRoundData({ mainItem, options, correctAnswer });
 }, []);

 // ======================
 // TELAS (COMPONENTES)
 // ======================

 const LoadingScreen = () => (<div className="screen-container loading-screen"><h1 className="main-title">Jogo das Sombras</h1><p className="subtitle">Carregando...</p></div>);

 const IntroScreen = () => {
  const handleClick = () => {
    playSynthSound('click');
    const fallback = setTimeout(() => setGameState('instructions'), 5000);
    leoSpeak("Olá! Eu sou o Léo! Vamos jogar com sombras?", () => { clearTimeout(fallback); setGameState('instructions'); });
  };
  return (<div className="screen-container intro-screen"><Image src="/shadow-game/leo_abertura.webp" alt="Mascote Léo" width={250} height={250} priority /><h1 className="main-title">Jogo das Sombras</h1><p className="subtitle">Associe cada imagem com sua sombra!</p><button onClick={handleClick} className="start-button">Começar a Jogar</button></div>);
 };

 const InstructionsScreen = () => {
  const handleClick = () => {
    playSynthSound('click');
    const fallback = setTimeout(() => setGameState('phase-selection'), 5000);
    leoSpeak("É super fácil! Clique na sombra certa para cada figura!", () => { clearTimeout(fallback); setGameState('phase-selection'); });
  };
  return (<div className="screen-container explanation-screen"><Image src="/shadow-game/leo_abertura.webp" alt="Léo explicando" width={200} height={200} /><div className="speech-bubble"><p>É super fácil! Clique na sombra certa para cada figura!</p></div><button onClick={handleClick} className="start-button">Entendi, vamos lá!</button></div>);
 };

 const PhaseSelectionScreen = () => {
    const handleSelect = (phase: number) => {
        playSynthSound('click');
        setSelectedPhase(phase);
        setScore(0);
        setStreak(0);
        const messages: {[key: number]: string} = { 1: "Fase 1: Detetive Júnior! Boa Sorte!", 2: "Fase 2: Mestre das Sombras! Ficou mais difícil!", 3: "Fase 3: Desafio Final! Para os melhores!"};
        leoSpeak(messages[phase]);
        setGameState('playing');
        startNewRound(phase);
    };
    return (<div className="screen-container phase-selection-screen"><h2>Escolha seu desafio</h2><div className="phase-container"><button onClick={() => handleSelect(1)}>🔍 Fase 1</button><button onClick={() => handleSelect(2)}>🌟 Fase 2</button><button onClick={() => handleSelect(3)}>🏆 Fase 3</button></div></div>);
 };

 const GameScreen = () => {
  if (!roundData) return null;
  
  const leoStreakPhrases: {[key:number]: string[]} = {
      10: ["Aí sim! Sequência de 10!", "Você tem olhos de águia! Já são 10!"],
      20: ["Você é muito top! Sequência de 20!", "Caramba! 20 acertos seguidos!"],
      30: ["Impossível! Você atingiu uma sequência incrível de 30!", "Ninguém te segura! 30 em seguida!"]
  };

  const handleOptionClick = (opt: string) => {
   if (opt === roundData.correctAnswer) {
    const newStreak = streak + 1;
    setScore(score + 100);
    setStreak(newStreak);
    
    // NÍVEL 1 DE RECOMPENSA: Som de acerto sempre
    playSynthSound('correct');

    // NÍVEL 2 DE RECOMPENSA: Confete e som especial a cada 5
    if (newStreak % 5 === 0 && newStreak > 0) {
        setShowConfetti(true);
        playSynthSound('combo');
        setTimeout(() => setShowConfetti(false), 2000); // Confete dura 2s
    }

    // NÍVEL 3 DE RECOMPENSA: Fala do Leo a cada 10
    if (newStreak % 10 === 0 && newStreak > 0) {
        const phrases = leoStreakPhrases[newStreak];
        if (phrases) {
            leoSpeak(phrases[Math.floor(Math.random() * phrases.length)]);
        }
    }
    
    setTimeout(() => startNewRound(selectedPhase!), 300);

   } else {
    playSynthSound('error');
    setStreak(0);
    leoSpeak("Ops, tente de novo!");
   }
  };

  return (
   <div className="playing-screen">
    {showConfetti && <ConfettiEffect />}
    <div className="top-bar">
     <button onClick={() => { playSynthSound('click'); setGameState('phase-selection'); }} className="back-button">
      <ArrowLeft size={20} /> Voltar
     </button>
     <button onClick={() => { playSynthSound('click'); setSoundEnabled(!soundEnabled); }} className="sound-button">
      {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
     </button>
    </div>
    <div className="main-item-container"><Image src={roundData.mainItem} alt="Item principal" width={250} height={250} /></div>
    <div className="options-container">
     {roundData.options.map((opt, i) => (<button key={i} onClick={() => handleOptionClick(opt)} className="option-button"><Image src={opt} alt={`Opção ${i + 1}`} width={100} height={100} /></button>))}
    </div>
    <div className="stats-display">
     <div><Star color="#ffc700" fill="#ffc700" /> {streak}</div>
     <div><Trophy color="#ff9a00" fill="#ff9a00" /> {score}</div>
    </div>
   </div>
  );
 };

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

 return (<main className="shadow-game-main">{renderContent()}</main>);
}
