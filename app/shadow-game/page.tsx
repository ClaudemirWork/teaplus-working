'use client';
import React, { useState, useEffect, useRef } from 'react';
import './shadowgame.css';
import Image from 'next/image';
import { Volume2, VolumeX, Play, Star, Trophy, Zap, Gift, Award, Crown, Medal, Target, Flame } from 'lucide-react';

// Lista de nomes base das imagens.
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

// Função para embaralhar um array
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
  const [roundData, setRoundData] = useState<{
    mainItem: string;
    options: string[];
    correctAnswer: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [pointsFeedback, setPointsFeedback] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highScore, setHighScore] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [isPlayingIntro, setIsPlayingIntro] = useState(false);
  const [isPlayingInstructions, setIsPlayingInstructions] = useState(false);
  
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Carregar estatísticas salvas
  useEffect(() => {
    const savedHighScore = localStorage.getItem('shadowGameHighScore');
    const savedStars = localStorage.getItem('shadowGameTotalStars');
    
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
    if (savedStars) setTotalStars(parseInt(savedStars));
    
    // Inicializar áudios
    successAudioRef.current = new Audio('/sounds/coin.wav');
    errorAudioRef.current = new Audio('/sounds/error.wav');
  }, []);
  
  // Funções de áudio
  const playAudioWithFallback = async (audioPath: string, text: string) => {
    try {
      const audio = new Audio(audioPath);
      await audio.play();
    } catch (error) {
      console.error("Erro ao tocar MP3, usando voz sintética:", error);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const narrateText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };
  
  const playSoundEffect = (soundName: string) => {
    try {
      const audio = new Audio(`/audio/sounds/${soundName}.mp3`);
      audio.play().catch(e => console.log("Erro ao tocar efeito sonoro:", e));
    } catch (error) {
      console.error("Erro ao tocar efeito sonoro:", error);
    }
  };
  
  const startNewRound = (phase: number) => {
    setFeedback({});
    setPointsFeedback(null);
    let availableImages = [...imageNames];
    const correctImageName = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
    
    let roundType: RoundType;
    if (phase === 1) roundType = 'imageToShadow';
    else if (phase === 2) roundType = 'shadowToImage';
    else roundType = Math.random() < 0.5 ? 'imageToShadow' : 'shadowToImage';
    
    let mainItem: string, correctAnswer: string, options: string[] = [];
    const wrongImageName1 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
    const wrongImageName2 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
    
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
    setSelectedPhase(phase);
    setScore(0);
    setStreak(0);
    setGameState('playing');
    
    // Narrar a fase selecionada
    if (phase === 1) {
      narrateText("Fase 1: Encontre a sombra correta para cada imagem");
    } else if (phase === 2) {
      narrateText("Fase 2: Encontre a imagem correta para cada sombra");
    } else if (phase === 3) {
      narrateText("Fase 3: Desafio misto - preste muita atenção!");
    }
    
    startNewRound(phase);
  };
  
  const handleOptionClick = (clickedOption: string) => {
    if (Object.keys(feedback).length > 0 || !selectedPhase) return;
    
    playSoundEffect("click");
    
    if (clickedOption === roundData?.correctAnswer) {
      const newStreak = streak + 1;
      let pointsGained = 100;
      if (newStreak >= 5) pointsGained = 500;
      else if (newStreak >= 2) pointsGained = 200;
      
      setScore(score + pointsGained);
      setStreak(newStreak);
      setPointsFeedback(`+${pointsGained}`);
      
      // Atualizar estatísticas
      const newTotalStars = totalStars + 1;
      setTotalStars(newTotalStars);
      localStorage.setItem('shadowGameTotalStars', newTotalStars.toString());
      
      const newHighScore = Math.max(score + pointsGained, highScore);
      setHighScore(newHighScore);
      localStorage.setItem('shadowGameHighScore', newHighScore.toString());
      
      // Narrar pontos e combo
      if (newStreak >= 5) {
        narrateText(`Combo de 5 acertos! ${pointsGained} pontos!`);
      } else if (newStreak >= 2) {
        narrateText(`Muito bem! ${pointsGained} pontos!`);
      } else {
        narrateText(`Correto! ${pointsGained} pontos!`);
      }
      
      if (soundEnabled && successAudioRef.current) {
        successAudioRef.current.play();
      }
      
      setFeedback({ [clickedOption]: 'correct' });
      setTimeout(() => {
        startNewRound(selectedPhase);
      }, 1500);
    } else {
      setStreak(0);
      setFeedback({ [clickedOption]: 'incorrect' });
      
      // Narrar erro
      narrateText("Ops! Essa não é a sombra correta!");
      
      if (soundEnabled && errorAudioRef.current) {
        errorAudioRef.current.play();
      }
      
      setTimeout(() => setFeedback({}), 800);
    }
  };
  
  const resetGame = () => {
    setGameState('titleScreen');
    setSelectedPhase(null);
    setRoundData(null);
    setScore(0);
    setStreak(0);
    setFeedback({});
    setPointsFeedback(null);
  };
  
  // Tela inicial melhorada
  const TitleScreen = () => {
    const handlePlayIntro = () => {
      setIsPlayingIntro(true);
      playSoundEffect("click");
      
      // Reproduzir a apresentação do Leo
      narrateText("Olá! Sou o Leo! Vamos jogar com sombras!");
      
      // Após a narração, ir para a tela de instruções
      setTimeout(() => {
        setIsPlayingIntro(false);
        setGameState('instructions');
      }, 4000);
    };

    return (
      <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-500 overflow-hidden">
        {/* Bolhas flutuantes (similar ao bubble-pop) */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float"
              style={{
                width: `${10 + Math.random() * 40}px`,
                height: `${10 + Math.random() * 40}px`,
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 20}%`,
                animationDuration: `${10 + Math.random() * 20}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        {/* Estrelas de fundo animadas */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <Star className="w-6 h-6 text-yellow-200 opacity-50" fill="currentColor" />
            </div>
          ))}
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Leo sem box branco, maior e mais destacado */}
          <div className="mb-4 animate-bounce-slow">
            <Image 
              src="/shadow-game/leo_abertura.webp" 
              alt="Mascote Léo" 
              width={400} 
              height={400} 
              className="w-[300px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl" 
              priority 
            />
          </div>
          
          {/* Título melhorado */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
            Jogo das Sombras
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-6 drop-shadow-md">
            Associe cada imagem com sua sombra correspondente!
          </p>
          
          {/* Mostra estatísticas na tela inicial */}
          {(totalStars > 0 || highScore > 0) && (
            <div className="bg-white/80 rounded-2xl p-4 mb-6 shadow-xl">
              <div className="flex items-center gap-4">
                {totalStars > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                    <span className="font-bold text-purple-800">{totalStars} estrelas</span>
                  </div>
                )}
                {highScore > 0 && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                    <span className="font-bold text-purple-800">Recorde: {highScore}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <button 
            onClick={handlePlayIntro}
            disabled={isPlayingIntro}
            className={`text-xl font-bold text-white rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1 ${
              isPlayingIntro 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
          >
            {isPlayingIntro ? 'Reproduzindo...' : '🔊 Ouvir Leo'}
          </button>
        </div>
      </div>
    );
  };
  
  // Tela de instruções
  const InstructionsScreen = () => {
    const handlePlayInstructions = () => {
      setIsPlayingInstructions(true);
      playSoundEffect("click");
      
      // Reproduzir as instruções
      narrateText("Associe cada imagem com sua sombra correspondente! Escolha uma fase para começar.");
      
      // Após a narração, habilitar o botão de começar
      setTimeout(() => {
        setIsPlayingInstructions(false);
      }, 4000);
    };

    return (
      <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300">
        {/* Elementos decorativos animados */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float"
              style={{
                width: `${5 + Math.random() * 30}px`,
                height: `${5 + Math.random() * 30}px`,
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 20}%`,
                animationDuration: `${8 + Math.random() * 15}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-purple-600">Como Jogar</h2>
          <div className="text-lg text-gray-700 space-y-6 mb-6 text-left">
            <p className="flex items-center gap-4">
              <span className="text-4xl">🖼️</span>
              <span><b>Associe cada imagem</b> com sua sombra correspondente!</span>
            </p>
            <p className="flex items-center gap-4">
              <span className="text-4xl">🎯</span>
              <span><b>Acerte consecutivamente</b> para ganhar mais pontos!</span>
            </p>
            <p className="flex items-center gap-4">
              <span className="text-4xl">⭐</span>
              <span><b>Ganhe estrelas</b> a cada acerto!</span>
            </p>
            <p className="flex items-center gap-4">
              <span className="text-4xl">🏆</span>
              <span><b>Desbloqueie conquistas</b> e bata recordes!</span>
            </p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handlePlayInstructions}
              disabled={isPlayingInstructions}
              className={`w-full text-xl font-bold text-white rounded-full py-4 shadow-xl transition-transform ${
                isPlayingInstructions 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105'
              }`}
            >
              {isPlayingInstructions ? 'Reproduzindo...' : '🔊 Ouvir Instruções'}
            </button>
            
            <button 
              onClick={() => {
                playSoundEffect("click");
                setGameState('phase-selection');
              }} 
              className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform"
            >
              Escolher Fase 🚀
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Tela de seleção de fases
  const PhaseSelectionScreen = () => {
    return (
      <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-green-300 via-blue-300 to-purple-300">
        {/* Elementos decorativos animados */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float"
              style={{
                width: `${5 + Math.random() * 30}px`,
                height: `${5 + Math.random() * 30}px`,
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 20}%`,
                animationDuration: `${8 + Math.random() * 15}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        <div className="bg-white/95 rounded-3xl p-8 max-w-3xl shadow-2xl text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-purple-600">Escolha uma Fase</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <button 
              onClick={() => {
                playSoundEffect("click");
                handlePhaseSelect(1);
              }}
              className="phase-button bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold text-blue-700 mb-3">Fase 1</h3>
              <p className="text-blue-600">Encontre a sombra correta para cada imagem</p>
              <div className="mt-4 flex justify-center">
                <div className="w-16 h-16 bg-blue-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🖼️</span>
                </div>
                <span className="mx-2 text-2xl">→</span>
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🌑</span>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => {
                playSoundEffect("click");
                handlePhaseSelect(2);
              }}
              className="phase-button bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold text-green-700 mb-3">Fase 2</h3>
              <p className="text-green-600">Encontre a imagem correta para cada sombra</p>
              <div className="mt-4 flex justify-center">
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🌑</span>
                </div>
                <span className="mx-2 text-2xl">→</span>
                <div className="w-16 h-16 bg-green-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🖼️</span>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => {
                playSoundEffect("click");
                handlePhaseSelect(3);
              }}
              className="phase-button bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold text-purple-700 mb-3">Fase 3: Desafio!</h3>
              <p className="text-purple-600">Desafio misto - preste muita atenção!</p>
              <div className="mt-4 flex justify-center">
                <div className="w-16 h-16 bg-purple-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">❓</span>
                </div>
                <span className="mx-2 text-2xl">→</span>
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">❓</span>
                </div>
              </div>
            </button>
          </div>
          
          <button 
            onClick={() => {
              playSoundEffect("click");
              setGameState('titleScreen');
            }} 
            className="text-xl font-bold text-white bg-gradient-to-r from-gray-500 to-gray-600 rounded-full px-8 py-3 shadow-xl hover:scale-105 transition-transform"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  };
  
  // Tela do jogo
  const GameScreen = () => {
    if (!roundData) return <div>Carregando...</div>;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="top-bar bg-white/20 backdrop-blur rounded-2xl p-4 mb-4 flex justify-between items-center">
            <button 
              onClick={() => {
                playSoundEffect("click");
                setGameState('phase-selection');
              }} 
              className="text-white flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 transition-all"
            >
              &larr; Voltar
            </button>
            <div className="text-white text-xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Pontos: {score}
            </div>
            <button 
              onClick={() => {
                playSoundEffect("click");
                setSoundEnabled(!soundEnabled);
              }}
              className="text-white"
            >
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
          </div>
          
          {pointsFeedback && (
            <div className="points-feedback text-center text-2xl font-bold text-yellow-400 mb-4 animate-bounce">
              {pointsFeedback}
            </div>
          )}
          
          <div className="main-item-container bg-white/10 backdrop-blur rounded-3xl p-8 mb-6 flex justify-center items-center">
            <Image 
              src={roundData.mainItem} 
              alt="Item principal" 
              width={300} 
              height={300} 
              className="max-w-full max-h-[300px] object-contain" 
            />
          </div>
          
          <div className="options-container grid grid-cols-3 gap-4 mb-6">
            {roundData.options.map((optionSrc, index) => (
              <button
                key={index}
                className={`option-button bg-white/10 backdrop-blur rounded-2xl p-4 transition-all ${
                  feedback[optionSrc] === 'correct' ? 'ring-4 ring-green-400 scale-105' : 
                  feedback[optionSrc] === 'incorrect' ? 'ring-4 ring-red-400' : 
                  'hover:bg-white/20 hover:scale-105'
                }`}
                onClick={() => handleOptionClick(optionSrc)}
              >
                <Image 
                  src={optionSrc} 
                  alt={`Opção ${index + 1}`} 
                  width={150} 
                  height={150} 
                  className="max-w-full max-h-[150px] object-contain" 
                />
              </button>
            ))}
          </div>
          
          <div className="text-center text-white mb-4">
            <div className="flex items-center justify-center gap-2">
              <span>Combo:</span>
              {streak >= 5 && (
                <>
                  <Flame className="w-6 h-6 text-orange-400" />
                  <span className="font-bold text-xl">5x (500 pontos)</span>
                </>
              )}
              {streak >= 2 && streak < 5 && (
                <>
                  <Star className="w-6 h-6 text-yellow-400" fill="currentColor" />
                  <span className="font-bold text-xl">{streak}x (200 pontos)</span>
                </>
              )}
              {streak < 2 && (
                <span className="font-bold text-xl">{streak}x (100 pontos)</span>
              )}
            </div>
          </div>
          
          {feedback[roundData.correctAnswer] === 'correct' && (
            <div className="confetti fixed inset-0 pointer-events-none z-50"></div>
          )}
        </div>
      </div>
    );
  };
  
  // Renderização condicional das telas
  const renderContent = () => {
    switch (gameState) {
      case 'titleScreen':
        return <TitleScreen />;
      case 'instructions':
        return <InstructionsScreen />;
      case 'phase-selection':
        return <PhaseSelectionScreen />;
      case 'playing':
        return <GameScreen />;
      default:
        return <TitleScreen />;
    }
  };
  
  return <main className="shadow-game-main">{renderContent()}</main>;
}
