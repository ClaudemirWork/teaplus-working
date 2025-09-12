'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Save, Star, Trophy, Sparkles, Gem } from 'lucide-react';
import { createClient } from '../utils/supabaseClient';
import confetti from 'canvas-confetti';

// --- ESTRUTURA DOS NÍVEIS ---
interface Level {
  name: string;
  pattern: number[][];
  specialCell?: { row: number; col: number }; // Coordenada da "Gema Especial"
}

// Paleta de cores. O índice 0 é sempre o "vazio".
const COLORS = [
  'bg-gray-200 hover:bg-gray-300 border-gray-300',      // 0: Vazio
  'bg-blue-500 border-blue-700',                       // 1: Azul
  'bg-yellow-400 border-yellow-600',                   // 2: Amarelo
  'bg-green-500 border-green-700',                     // 3: Verde
  'bg-red-500 border-red-700',                         // 4: Vermelho
  'bg-purple-500 border-purple-700',                   // 5: Roxo
];

// Níveis do Jogo - FÁCIL DE ADICIONAR NOVOS!
const levels: Level[] = [
  {
    name: "Sorriso",
    pattern: [
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ],
    specialCell: { row: 3, col: 2 } // O centro do sorriso é especial
  },
  {
    name: "Casa",
    pattern: [
      [0, 0, 2, 0, 0],
      [0, 2, 2, 2, 0],
      [2, 2, 2, 2, 2],
      [0, 3, 3, 3, 0],
      [0, 3, 0, 3, 0],
    ],
    specialCell: { row: 4, col: 2 } // A porta é especial
  },
  {
    name: "Coração",
    pattern: [
      [0, 4, 4, 0, 4, 4, 0],
      [4, 4, 4, 4, 4, 4, 4],
      [4, 4, 4, 4, 4, 4, 4],
      [0, 4, 4, 4, 4, 4, 0],
      [0, 0, 4, 4, 4, 0, 0],
      [0, 0, 0, 4, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
    specialCell: { row: 1, col: 3 }
  },
];


// --- COMPONENTE PRINCIPAL ---
export default function PatternBuilderGame() {
  const router = useRouter();
  const supabase = createClient();
  const animationRef = useRef<number>();

  // Estados do Jogo
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [playerPattern, setPlayerPattern] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; life: number }[]>([]);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Inicializa o jogo
  const startGame = () => {
    setCurrentLevelIndex(0);
    setScore(0);
    setCombo(0);
    setupLevel(0);
    setShowGameComplete(false);
    setCurrentScreen('game');
  };
  
  // Configura um nível específico
  const setupLevel = (levelIndex: number) => {
    const level = levels[levelIndex];
    const initialPattern = Array(level.pattern.length)
      .fill(0)
      .map(() => Array(level.pattern[0].length).fill(0));
    setPlayerPattern(initialPattern);
    setShowLevelComplete(false);
  };
  
  // Avança para o próximo nível
  const nextLevel = () => {
    const nextIndex = currentLevelIndex + 1;
    if (nextIndex < levels.length) {
      setCurrentLevelIndex(nextIndex);
      setupLevel(nextIndex);
    } else {
      setShowGameComplete(true);
    }
  };
  
  // Efeitos e Sons (gerados por código, sem arquivos externos)
  const playSound = useCallback((type: 'click' | 'error' | 'gem' | 'complete') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

      switch(type) {
        case 'click':
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
          break;
        case 'error':
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
          oscillator.type = 'square';
          gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.2);
          break;
        case 'gem':
          oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.4);
          break;
        case 'complete':
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
          break;
      }
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch(e) {
      // Falha silenciosa se o AudioContext não for suportado
    }
  }, []);

  const createParticles = useCallback((element: HTMLElement, type: 'gem' | 'click') => {
    const rect = element.getBoundingClientRect();
    const newParticles = [];
    const count = type === 'gem' ? 30 : 5;
    const colors = type === 'gem' ? ['#fde047', '#f97316', '#ec4899'] : ['#a78bfa'];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random(),
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }
    setParticles(p => [...p, ...newParticles]);
  }, []);

  // Lógica de clique na célula
  const handleCellClick = (rowIndex: number, colIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (showLevelComplete || showGameComplete) return;

    const newPattern = playerPattern.map(r => [...r]);
    const currentVal = newPattern[rowIndex][colIndex];
    const nextVal = (currentVal + 1) % COLORS.length;
    newPattern[rowIndex][colIndex] = nextVal;
    setPlayerPattern(newPattern);

    const modelVal = levels[currentLevelIndex].pattern[rowIndex][colIndex];
    
    if (nextVal === modelVal && modelVal !== 0) {
      const isSpecial = levels[currentLevelIndex].specialCell?.row === rowIndex && levels[currentLevelIndex].specialCell?.col === colIndex;
      const points = isSpecial ? 100 + (combo * 10) : 10 + (combo * 2);
      setScore(s => s + points);
      setCombo(c => c + 1);
      playSound(isSpecial ? 'gem' : 'click');
      createParticles(event.currentTarget, isSpecial ? 'gem' : 'click');
    } else {
      setCombo(0);
      playSound('error');
    }
  };

  // Verificação de conclusão e animação de partículas
  useEffect(() => {
    // Evita a verificação se o playerPattern ainda não foi inicializado para o nível atual
    if (playerPattern.length === 0) return;

    const playerGridString = JSON.stringify(playerPattern);
    const modelGridString = JSON.stringify(levels[currentLevelIndex].pattern);

    if (playerGridString === modelGridString) {
      setShowLevelComplete(true);
      playSound('complete');
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      setTimeout(nextLevel, 2500); // Avança para o próximo nível após um tempo
    }
  }, [playerPattern, currentLevelIndex, playSound]);

  useEffect(() => {
    const animateParticles = () => {
      setParticles(currentParticles => 
        currentParticles.map(p => ({
          ...p,
          x: p.x + (Math.random() - 0.5) * 4,
          y: p.y + (Math.random() - 0.5) * 4 - 2,
          life: p.life - 0.03,
        })).filter(p => p.life > 0)
      );
      animationRef.current = requestAnimationFrame(animateParticles);
    };
    animationRef.current = requestAnimationFrame(animateParticles);
    return () => {
      if(animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- TELAS DO JOGO ---

  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-teal-200 via-cyan-300 to-sky-400 overflow-hidden">
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4">
          <Image src="/images/mascotes/leo/leo_torre.webp" alt="Leo Explorador" width={400} height={400} className="w-[280px] h-auto sm:w-[350px] drop-shadow-2xl animate-float" priority />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-lg mb-4">Exploradores de Padrões</h1>
        <p className="text-xl text-white/90 mt-2 mb-8 drop-shadow-md">🎨 Construa mosaicos coloridos e divertidos! 🎨</p>
        <button onClick={() => setCurrentScreen('instructions')} className="text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110">
          Começar a Explorar
        </button>
      </div>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-green-200 via-yellow-200 to-orange-200">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-teal-700">Como Jogar</h2>
        <div className="text-lg text-gray-700 space-y-6 mb-8 text-left">
          <p className="flex items-center gap-4"><span className="text-4xl">🎯</span><span>Seu objetivo é <b>copiar o mosaico do "Modelo"</b> na sua área de construção.</span></p>
          <p className="flex items-center gap-4"><span className="text-4xl">👆</span><span><b>Clique em um quadrado</b> na sua área para mudar a cor dele. Continue clicando para encontrar a cor certa!</span></p>
          <p className="flex items-center gap-4"><span className="text-4xl"><Gem className="text-purple-500 w-10 h-10"/></span><span>Encontre a <b>Gema Especial</b> (marcada com um brilho no modelo) para ganhar mais pontos e um efeito surpresa!</span></p>
          <p className="flex items-center gap-4"><span className="text-4xl">🏆</span><span>Complete todos os mosaicos para se tornar um Mestre Explorador!</span></p>
        </div>
        <button onClick={startGame} className="w-full text-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform">
          Vamos Construir! 🚀
        </button>
      </div>
    </div>
  );

  const GameScreen = () => {
    const level = levels[currentLevelIndex];
    if (!level || playerPattern.length === 0) return <div className="text-center p-8">Carregando nível...</div>;
    const patternSize = level.pattern[0].length;
    const cellSize = isMobile ? (patternSize > 5 ? 'w-10 h-10' : 'w-12 h-12') : 'w-16 h-16';

    const renderGrid = (pattern: number[][], isInteractive: boolean) => (
      <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
        <div className={`grid gap-1`} style={{gridTemplateColumns: `repeat(${patternSize}, minmax(0, 1fr))`}}>
          {pattern.map((row, rowIndex) =>
            row.map((colorIndex, colIndex) => {
              const isSpecial = !isInteractive && level.specialCell?.row === rowIndex && level.specialCell?.col === colIndex;
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`relative rounded-md border-2 transition-colors duration-150 ${cellSize} ${COLORS[colorIndex]} ${isInteractive && !showLevelComplete ? 'cursor-pointer' : ''}`}
                  // AQUI ESTÁ A CORREÇÃO PRINCIPAL
                  onMouseDown={(e) => isInteractive && handleCellClick(rowIndex, colIndex, e)}
                >
                  {isSpecial && <Sparkles className="absolute inset-0 m-auto w-1/2 h-1/2 text-white/70 animate-pulse-slow"/>}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
    
    if (showGameComplete) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <Trophy className="w-24 h-24 text-yellow-400 animate-bounce"/>
            <h2 className="text-4xl font-bold text-gray-800 mt-4">Parabéns, Mestre Explorador!</h2>
            <p className="text-xl text-gray-600 mt-2">Você completou todos os desafios!</p>
            <div className="text-3xl font-bold mt-4">Pontuação Final: <span className="text-blue-600">{score}</span></div>
            <button onClick={() => setCurrentScreen('title')} className="mt-8 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full px-8 py-4 shadow-xl transition-all duration-300 hover:scale-110">
              Jogar Novamente
            </button>
        </div>
      )
    }

    return (
      <div className="w-full h-full flex flex-col p-4">
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md mb-4">
          <div><span className="font-bold">Nível:</span> {currentLevelIndex + 1}/{levels.length} ({level.name})</div>
          <div><span className="font-bold">Pontuação:</span> {score}</div>
          <div><span className="font-bold">Combo:</span> x{combo}</div>
        </div>

        <div className={`flex-1 flex items-center justify-center gap-8 ${isMobile ? 'flex-col' : 'flex-row'}`}>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Modelo</h2>
            {renderGrid(level.pattern, false)}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Seu Mosaico</h2>
            {renderGrid(playerPattern, true)}
          </div>
        </div>

        {showLevelComplete && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <div className="bg-white p-8 rounded-xl shadow-2xl text-center animate-pop-in">
                    <h2 className="text-3xl font-bold text-green-600">Nível Completo!</h2>
                    <p className="mt-2 text-gray-600">Preparando próximo desafio...</p>
                </div>
            </div>
        )}
      </div>
    );
  };
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'title':
        return <TitleScreen />;
      case 'instructions':
        return <InstructionsScreen />;
      case 'game':
        return <GameScreen />;
      default:
        return <TitleScreen />;
    }
  };

  return (
    <div className="w-screen h-screen font-sans">
      {renderScreen()}
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full pointer-events-none" style={{
          left: p.x,
          top: p.y,
          width: 10,
          height: 10,
          backgroundColor: p.color,
          opacity: p.life,
          transform: `translate(-50%, -50%) scale(${1 + (1 - p.life)})`,
          zIndex: 9999,
        }}/>
      ))}
    </div>
  );
}
