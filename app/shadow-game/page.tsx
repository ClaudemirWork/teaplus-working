'use client';

import React, { useState, useEffect, useRef } from 'react';
import './shadowgame.css';
import Image from 'next/image';

// Lista de nomes base das imagens. Adicione ou remova nomes aqui.
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

// Função para embaralhar um array (algoritmo Fisher-Yates)
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

type GameState = 'start' | 'instructions' | 'playing';
type RoundType = 'imageToShadow' | 'shadowToImage';

export default function ShadowGamePage() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [roundData, setRoundData] = useState<{
    mainItem: string;
    options: string[];
    correctAnswer: string;
    type: RoundType;
  } | null>(null);

  // --- LÓGICA DE PONTUAÇÃO E FASES ---
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [pointsFeedback, setPointsFeedback] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({});
  const successAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Prepara o áudio quando o componente montar
    successAudioRef.current = new Audio('/sounds/coin.wav');
  }, []);

  const startNewRound = () => {
    setFeedback({});
    setPointsFeedback(null);
    let availableImages = [...imageNames];

    const correctImageName = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
    
    // Define o tipo de rodada com base na fase
    let roundType: RoundType;
    if (currentPhase === 1) {
      roundType = 'imageToShadow';
    } else if (currentPhase === 2) {
      roundType = 'shadowToImage';
    } else { // Fase 3
      roundType = Math.random() < 0.5 ? 'imageToShadow' : 'shadowToImage';
    }

    let mainItem: string;
    let correctAnswer: string;
    let options: string[] = [];

    // Escolhe duas opções incorretas
    const wrongImageName1 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
    const wrongImageName2 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];

    if (roundType === 'imageToShadow') {
      mainItem = `/shadow-game/images/${correctImageName}.webp`;
      correctAnswer = `/shadow-game/shadows/${correctImageName}_black.webp`;
      options = [
        correctAnswer,
        `/shadow-game/shadows/${wrongImageName1}_black.webp`,
        `/shadow-game/shadows/${wrongImageName2}_black.webp`,
      ];
    } else { // shadowToImage
      mainItem = `/shadow-game/shadows/${correctImageName}_black.webp`;
      correctAnswer = `/shadow-game/images/${correctImageName}.webp`;
      options = [
        correctAnswer,
        `/shadow-game/images/${wrongImageName1}.webp`,
        `/shadow-game/images/${wrongImageName2}.webp`,
      ];
    }

    setRoundData({
      mainItem,
      options: shuffleArray(options),
      correctAnswer,
      type: roundType,
    });
  };

  const handleOptionClick = (clickedOption: string) => {
    if (Object.keys(feedback).length > 0) return; // Impede múltiplos cliques

    if (clickedOption === roundData?.correctAnswer) {
      // --- ACERTOU ---
      const newStreak = streak + 1;
      let pointsGained = 100;
      if (newStreak >= 5) pointsGained = 500;
      else if (newStreak >= 2) pointsGained = 200;

      setScore(score + pointsGained);
      setStreak(newStreak);
      setPointsFeedback(`+${pointsGained}`);
      successAudioRef.current?.play();
      setFeedback({ [clickedOption]: 'correct' });

      // Lógica de progressão de fase
      const newCorrectCount = correctAnswersCount + 1;
      setCorrectAnswersCount(newCorrectCount);
      if (newCorrectCount % 5 === 0) {
        if (currentPhase < 3) {
          setCurrentPhase(currentPhase + 1);
        }
      }

      setTimeout(() => {
        startNewRound();
      }, 1500);
    } else {
      // --- ERROU ---
      setStreak(0);
      setFeedback({ [clickedOption]: 'incorrect' });
      setTimeout(() => setFeedback({}), 800);
    }
  };

  const startGame = () => {
    setGameState('playing');
    // Resetar tudo para um novo jogo
    setScore(0);
    setStreak(0);
    setCurrentPhase(1);
    setCorrectAnswersCount(0);
    startNewRound();
  };

  // Renderização condicional com base no estado do jogo
  const renderContent = () => {
    switch (gameState) {
      case 'start':
        return (
          <div className="game-screen start-screen">
            <Image src="/shadow-game/leo_abertura.webp" alt="Mascote Léo" width={250} height={250} className="mascot-image" />
            <h1>Jogo das Sombras</h1>
            <p>Encontre a sombra correta!</p>
            <button className="start-button" onClick={() => setGameState('instructions')}>Iniciar</button>
          </div>
        );
      case 'instructions':
        return (
          <div className="game-screen instructions-screen">
            <h2>Como Jogar</h2>
            <div className='instructions-text-container'>
                <p><strong>Este jogo é composto de 3 fases:</strong></p>
                <p><strong>Fase 1:</strong> Encontre a sombra correta que corresponde à imagem em destaque na parte superior.</p>
                <p><strong>Fase 2:</strong> Encontre a imagem correta que corresponde à sombra da parte superior.</p>
                <p><strong>Fase 3:</strong> Desafie sua atenção, ora encontrando a sombra correta da imagem acima e ora encontrando a imagem a partir da sombra. Seja o campeão de observação!</p>
            </div>
            <button className="start-button" onClick={startGame}>Começar a Jogar!</button>
          </div>
        );
      case 'playing':
        if (!roundData) return <div>Carregando...</div>;
        return (
          <div className="game-screen playing-screen">
            <div className="score-container">
              <div className="score-display">Pontos: {score}</div>
              <div className="phase-display">Fase: {currentPhase}</div>
            </div>
            {pointsFeedback && <div className="points-feedback fade-out-up">{pointsFeedback}</div>}
            
            <div className="main-item-container">
              <Image src={roundData.mainItem} alt="Item principal" layout="fill" objectFit="contain" />
            </div>

            <div className="options-container">
              {roundData.options.map((optionSrc, index) => (
                <button
                  key={index}
                  className={`option-button ${feedback[optionSrc] || ''}`}
                  onClick={() => handleOptionClick(optionSrc)}
                >
                  <Image src={optionSrc} alt={`Opção ${index + 1}`} layout="fill" objectFit="contain" />
                </button>
              ))}
            </div>
            {feedback[roundData.correctAnswer] === 'correct' && <div className="confetti"></div>}
          </div>
        );
    }
  };

  return <main className="shadow-game-main">{renderContent()}</main>;
}

