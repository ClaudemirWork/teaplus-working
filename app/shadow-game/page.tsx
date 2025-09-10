'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import './shadowgame.css';

// Lista completa com os nomes base de todas as imagens que você subiu.
const imageNames = [
  'abacate', 'abelha', 'abelha_feliz', 'abelha_voando', 'abelhinha', 'aguia', 'amigos', 'apresentacao',
  'arvore_natal', 'baleia', 'bananas', 'barraca', 'beagle', 'berinjela', 'bike', 'biscoito', 'boneca',
  'borboleta', 'brincando', 'brinquedo', 'brocolis', 'cachorro', 'cachorro_banho', 'cactus', 'cactus_vaso',
  'caranguejo', 'carro_laranja', 'carro_vermelho', 'carta', 'casa', 'casa_balao', 'casal', 'cavalinho',
  'cegonha', 'cerebro', 'cerejas', 'cobra', 'coco', 'coelho_chocolate', 'coelho_pascoa', 'coelho_pelucia',
  'cone', 'coral', 'criancas', 'crocodilo', 'crocodilo_escola', 'crocodilo_feliz', 'detetive', 'doutor',
  'elefante', 'elefantinho', 'enfeite_natal', 'esquilo', 'estudando', 'fantasminha', 'formiga', 'forte',
  'franguinho', 'fusca', 'galinha', 'gata_danca', 'gatinho', 'gatinho_cores', 'gato', 'gato_balao',
  'gato_branco', 'gato_caixa', 'gato_cores', 'gato_pretao', 'gato_preto', 'gel', 'genial', 'girafa',
  'homem_neve', 'inseto', 'irmaos_crocodilos', 'leao', 'leitura', 'limao', 'maca_nervosa', 'melancia',
  'melancia_pedaco', 'menina', 'menina_amor', 'menino', 'menino_cao', 'milkshake', 'motoca', 'mulher',
  'mulher_gato', 'mundo', 'panda', 'papai_noel', 'pardal', 'passaro_azul', 'passaro_preto', 'passaros_fio',
  'peixe_louco', 'penguim', 'pirata_pau', 'pote_ouro', 'preguica', 'professor', 'professora', 'puffy',
  'relax', 'rosto', 'sapao', 'sapo', 'super_macaco', 'tartaruga', 'tenis', 'tenis_azul', 'tigre',
  'tigre_feliz', 'trem', 'tres_crocodilos', 'tubarao', 'tulipas', 'turma', 'uniconio_rosa', 'unicornino',
  'urso_branco', 'vegetais', 'violao', 'violino', 'vulcao', 'zebra'
];

// Função para embaralhar um array (algoritmo Fisher-Yates)
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function ShadowGamePage() {
  const [gameState, setGameState] = useState('start');
  const [correctImage, setCorrectImage] = useState<string | null>(null);
  const [shadowOptions, setShadowOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ [key: string]: 'correct' | 'incorrect' }>({});
  
  // --- NOVOS ESTADOS PARA GAMIFICAÇÃO ---
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [pointsFeedback, setPointsFeedback] = useState<string | null>(null);

  // --- REFERÊNCIAS PARA OS ÁUDIOS ---
  const successAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  // A referência para o som de erro foi removida.

  useEffect(() => {
    // Prepara os áudios quando o componente montar
    successAudioRef.current = new Audio('/sounds/coin.wav'); 
    clickAudioRef.current = new Audio('/sounds/click.mp3'); 
    // A inicialização do som de erro foi removida.
  }, []);

  const startNewRound = () => {
    setFeedback({});
    setPointsFeedback(null);

    const availableImages = [...imageNames];
    const correctIndex = Math.floor(Math.random() * availableImages.length);
    const correctName = availableImages.splice(correctIndex, 1)[0];
    
    setCorrectImage(correctName);

    const incorrectName1 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];
    const incorrectName2 = availableImages.splice(Math.floor(Math.random() * availableImages.length), 1)[0];

    const options = [
      `/shadow-game/shadows/${correctName}_black.webp`,
      `/shadow-game/shadows/${incorrectName1}_black.webp`,
      `/shadow-game/shadows/${incorrectName2}_black.webp`,
    ];
    
    setShadowOptions(shuffleArray(options));
  };

  const handleShadowClick = (clickedShadow: string) => {
    clickAudioRef.current?.play(); // Toca o som de clique
    const correctShadowPath = `/shadow-game/shadows/${correctImage}_black.webp`;

    if (clickedShadow === correctShadowPath) {
      // --- ACERTOU ---
      const newStreak = streak + 1;
      let pointsGained = 100;

      if (newStreak >= 5) {
        pointsGained = 500;
      } else if (newStreak >= 2) {
        pointsGained = 200;
      }

      setScore(score + pointsGained);
      setStreak(newStreak);
      setPointsFeedback(`+${pointsGained}`);
      setFeedback({ [clickedShadow]: 'correct' });
      successAudioRef.current?.play();

      setTimeout(() => {
        startNewRound();
      }, 2000);

    } else {
      // --- ERROU ---
      // A linha que tocava o som de erro foi removida.
      setStreak(0); // Zera o combo
      setFeedback({ [clickedShadow]: 'incorrect' });
      setTimeout(() => setFeedback({}), 500);
    }
  };

  if (gameState === 'start') {
    return (
      <div className="shadow-game-container start-screen">
        <Image src="/shadow-game/leo_abertura.webp" alt="Mascote Léo" width={400} height={400} className="mascot-image" priority />
        <h1 className="game-title">Jogo das Sombras</h1>
        <p className="game-subtitle">Encontre a sombra correta!</p>
        <button className="start-button" onClick={() => setGameState('instructions')}>
          Iniciar
        </button>
      </div>
    );
  }

  if (gameState === 'instructions') {
    return (
      <div className="shadow-game-container instructions-screen">
        <h2 className="instructions-title">Como Jogar?</h2>
        <p className="instructions-text">
          Olhe para a figura colorida. <br />
          Depois, clique na sombra que for igual a ela.
        </p>
        <button className="start-button" onClick={() => { setGameState('playing'); startNewRound(); }}>
          Vamos lá!
        </button>
      </div>
    );
  }

  return (
    <div className="shadow-game-container game-screen">
      {Object.values(feedback)[0] === 'correct' && <div className="confetti-container" />}
      
      <div className="game-header">
        <div className="score-display">Pontos: {score}</div>
      </div>
      
      {correctImage && (
        <div className="main-image-container">
          {pointsFeedback && <div className="points-feedback">{pointsFeedback}</div>}
          <Image
            src={`/shadow-game/images/${correctImage}.webp`}
            alt="Figura colorida"
            width={350}
            height={350}
            className="main-image"
          />
        </div>
      )}

      <div className="shadow-options-container">
        {shadowOptions.map((shadowPath) => (
          <div
            key={shadowPath}
            className={`shadow-option 
                        ${feedback[shadowPath] === 'correct' ? 'correct' : ''} 
                        ${feedback[shadowPath] === 'incorrect' ? 'incorrect' : ''}`}
            onClick={() => handleShadowClick(shadowPath)}
          >
            <Image
              src={shadowPath}
              alt="Opção de sombra"
              width={200}
              height={200}
              className="shadow-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}



