'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GameHeader } from '@/components/GameHeader';
import { LayoutGrid, Trophy, Gamepad2 } from 'lucide-react';

// Interfaces
interface Pattern {
  id: string;
  color: string;
  shape: string;
  active: boolean;
  touchedBy: string[];
}

interface Player {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

export default function PatternMatchCollaborativePage() {
  const router = useRouter();
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [targetPattern, setTargetPattern] = useState<Pattern[]>([]);
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayer, setActivePlayer] = useState('player1');
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [completedPatterns, setCompletedPatterns] = useState(0);
  const [gameTimer, setGameTimer] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [feedback, setFeedback] = useState('');

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  // Simplificado para formas que o Tailwind suporta nativamente
  const shapes = ['circle', 'square'];

  const initializePlayers = useCallback((count: number) => {
    const playerConfigs = [
      { id: 'player1', name: 'Jogador 1', color: 'blue', isActive: true },
      { id: 'player2', name: 'Jogador 2', color: 'green', isActive: true },
      { id: 'player3', name: 'Jogador 3', color: 'purple', isActive: true }
    ];
    setPlayers(playerConfigs.slice(0, count));
    setActivePlayer('player1');
  }, []);

  const initializePatterns = useCallback(() => {
    let gridSize: number;
    let activePercentage: number;
    if (numberOfPlayers === 1) {
      gridSize = Math.min(3 + currentLevel, 5);
      activePercentage = 0.4 + (currentLevel * 0.1);
    } else {
      gridSize = Math.min(2 + currentLevel, 4);
      activePercentage = 0.3 + (currentLevel * 0.05);
    }
    const newPatterns: Pattern[] = [];
    const newTargetPattern: Pattern[] = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      const colorIndex = Math.floor(Math.random() * Math.min(3 + currentLevel, colors.length));
      const shapeIndex = Math.floor(Math.random() * shapes.length); // Usando formas simplificadas
      const pattern = {
        id: `pattern-${i}`,
        color: colors[colorIndex],
        shape: shapes[shapeIndex],
        active: Math.random() < activePercentage,
        touchedBy: []
      };
      newPatterns.push({ ...pattern, active: false, touchedBy: [] });
      newTargetPattern.push(pattern);
    }
    setPatterns(newPatterns);
    setTargetPattern(newTargetPattern);
  }, [currentLevel, numberOfPlayers]);

  useEffect(() => {
    initializePlayers(numberOfPlayers);
  }, [numberOfPlayers, initializePlayers]);
  
  useEffect(() => {
    if (gamePhase === 'playing') {
      initializePatterns();
    }
  }, [currentLevel, gamePhase, initializePatterns]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;
    if (isTimerActive && gameTimer > 0) {
      interval = setInterval(() => {
        setGameTimer(prev => prev - 1);
      }, 1000);
    } else if (gameTimer === 0 && gamePhase === 'playing') {
      setIsTimerActive(false);
      setFeedback('⏰ Tempo esgotado! Voltando ao menu inicial.');
      setTimeout(() => {
        setGamePhase('intro');
        setFeedback('');
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, gameTimer, gamePhase]);

  const checkPatternCompletion = useCallback(() => {
    const isComplete = patterns.every((pattern, index) => pattern.active === targetPattern[index]?.active);
    if (isComplete) {
      const levelPoints = currentLevel * (numberOfPlayers === 1 ? 75 : 50);
      setScore(prev => prev + levelPoints);
      setCompletedPatterns(prev => prev + 1);
      setFeedback(`🎉 Padrão completado! +${levelPoints} pontos`);
      setIsTimerActive(false);
      setTimeout(() => {
        if (currentLevel < 5) {
          setCurrentLevel(prev => prev + 1);
          const newTime = numberOfPlayers === 1 ? 90 : 120;
          setGameTimer(newTime);
          setFeedback('');
          setIsTimerActive(true);
        } else {
          setGamePhase('completed');
        }
      }, 1500);
    }
  }, [patterns, targetPattern, currentLevel, numberOfPlayers]);

  const handlePatternTouch = useCallback((patternId: string, playerId: string) => {
    if (!isTimerActive) return;
    setPatterns(prev => prev.map(pattern => {
      if (pattern.id === patternId) {
        if (numberOfPlayers === 1) {
          return { ...pattern, touchedBy: [], active: !pattern.active };
        } else {
          const alreadyTouched = pattern.touchedBy.includes(playerId);
          const newTouchedBy = alreadyTouched ? pattern.touchedBy.filter(id => id !== playerId) : [...pattern.touchedBy, playerId];
          let shouldActivate = pattern.active;
          if (numberOfPlayers === 2 && newTouchedBy.length === 2) { shouldActivate = !pattern.active; newTouchedBy.length = 0; }
          if (numberOfPlayers === 3 && newTouchedBy.length >= 2) { shouldActivate = !pattern.active; newTouchedBy.length = 0; }
          return { ...pattern, touchedBy: newTouchedBy, active: shouldActivate };
        }
      }
      return pattern;
    }));
    setTimeout(() => checkPatternCompletion(), 100);
  }, [isTimerActive, numberOfPlayers, checkPatternCompletion]);

  const startGame = () => {
    setGamePhase('playing');
    setIsTimerActive(true);
    setCurrentLevel(1);
    setScore(0);
    setCompletedPatterns(0);
    setChatMessages([]);
    const initialTime = numberOfPlayers === 1 ? 90 : 120;
    setGameTimer(initialTime);
    if (numberOfPlayers === 1) { setFeedback('🎯 Clique nas células para reproduzir o padrão alvo!'); }
    else if (numberOfPlayers === 2) { setFeedback('👥 Ambos devem tocar a mesma célula para ativá-la.'); }
    else { setFeedback('👥👥👥 Pelo menos 2 jogadores devem tocar para ativar.'); }
  };
  
  const sendMessage = () => { /* ... sua função ... */ };
  
  // FUNÇÃO DE RENDERIZAÇÃO CORRIGIDA
  const renderShape = (color: string, shape: string, isActive: boolean) => {
    const baseClasses = `w-full h-full transition-all duration-300 ${isActive ? 'scale-100 shadow-lg' : 'scale-90'}`;
    const colorClasses: { [key: string]: string } = { red: isActive ? 'bg-red-500' : 'bg-red-200', blue: isActive ? 'bg-blue-500' : 'bg-blue-200', green: isActive ? 'bg-green-500' : 'bg-green-200', yellow: isActive ? 'bg-yellow-500' : 'bg-yellow-200', purple: isActive ? 'bg-purple-500' : 'bg-purple-200', orange: isActive ? 'bg-orange-500' : 'bg-orange-200' };
    const shapeClasses: { [key: string]: string } = { circle: 'rounded-full', square: 'rounded-lg' };
    return <div className={`${baseClasses} ${colorClasses[color] || 'bg-gray-200'} ${shapeClasses[shape] || 'rounded-lg'}`} />;
  };

  if (gamePhase === 'intro') {
    return (
      <>
        <GameHeader title="Padrões Colaborativos" icon={<LayoutGrid className="h-6 w-6" />} showSaveButton={false} />
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          {/* ... JSX da tela de introdução que já estava funcionando ... */}
        </main>
      </>
    );
  }

  if (gamePhase === 'completed') {
    return (
      <>
        <GameHeader title="Padrões Colaborativos" icon={<LayoutGrid className="h-6 w-6" />} />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
            {/* ... JSX da tela de conclusão ... */}
        </div>
      </>
    );
  }

  // TELA DO JOGO
  const gridSize = numberOfPlayers === 1 ? Math.min(3 + currentLevel, 5) : Math.min(2 + currentLevel, 4);
  const gridCols: { [key: number]: string } = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5' };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <GameHeader title={`Padrões Colaborativos - Nível ${currentLevel}`} icon={<LayoutGrid className="h-6 w-6" />} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 lg:order-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">🧩 Área Colaborativa</h3>
                <div className={`grid ${gridCols[gridSize]} gap-2 max-w-xs mx-auto mb-4`}>
                    {patterns.map((pattern) => (
                        <button key={pattern.id} onClick={() => handlePatternTouch(pattern.id, activePlayer)} className={`relative aspect-square border-2 rounded-lg flex items-center justify-center p-1 transition-all duration-200 ${pattern.touchedBy.length > 0 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 hover:border-blue-400'}`}>
                            {renderShape(pattern.color, pattern.shape, pattern.active)}
                            {numberOfPlayers > 1 && (
                                <div className="absolute -top-1 -right-1 flex">
                                    {pattern.touchedBy.includes('player1') && (<div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>)}
                                    {pattern.touchedBy.includes('player2') && (<div className="w-3 h-3 bg-green-500 rounded-full border border-white -ml-1"></div>)}
                                    {pattern.touchedBy.includes('player3') && (<div className="w-3 h-3 bg-purple-500 rounded-full border border-white -ml-1"></div>)}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
                {feedback && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-blue-800 text-sm">{feedback}</div>)}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 lg:order-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">🎯 Padrão Alvo</h3>
                <div className={`grid ${gridCols[gridSize]} gap-2 max-w-xs mx-auto`}>
                    {targetPattern.map((pattern, index) => (<div key={`target-${index}`} className="aspect-square border-2 border-gray-200 rounded-lg flex items-center justify-center p-1">{renderShape(pattern.color, pattern.shape, pattern.active)}</div>))}
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">Reproduzam este padrão trabalhando juntos</p>
            </div>

            <div className="space-y-6 lg:order-3">
                {/* ... JSX do painel de jogadores e chat ... */}
            </div>
        </div>
      </main>
    </div>
  );
}
