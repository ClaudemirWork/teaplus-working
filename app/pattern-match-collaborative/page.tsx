'use client';

import { useState, useEffect } from 'react';
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

  // ### INÍCIO DO BLOCO DE LÓGICA RESTAURADO ###
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const shapes = ['circle', 'square', 'triangle', 'diamond', 'star', 'heart'];

  const initializePlayers = (count: number) => {
    const playerConfigs = [
      { id: 'player1', name: 'Jogador 1', color: 'blue', isActive: true },
      { id: 'player2', name: 'Jogador 2', color: 'green', isActive: true },
      { id: 'player3', name: 'Jogador 3', color: 'purple', isActive: true }
    ];
    setPlayers(playerConfigs.slice(0, count));
    setActivePlayer('player1');
  };

  useEffect(() => {
    initializePlayers(numberOfPlayers);
  }, [numberOfPlayers]);

  const initializePatterns = () => {
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
      const shapeIndex = currentLevel > 2 ? Math.floor(Math.random() * shapes.length) : 0;
      const pattern = {
        id: `pattern-${i}`,
        color: colors[colorIndex],
        shape: currentLevel > 2 ? shapes[shapeIndex] : 'circle',
        active: Math.random() < activePercentage,
        touchedBy: []
      };
      newPatterns.push({ ...pattern, active: false, touchedBy: [] });
      newTargetPattern.push(pattern);
    }
    setPatterns(newPatterns);
    setTargetPattern(newTargetPattern);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && gameTimer > 0) {
      interval = setInterval(() => {
        setGameTimer(prev => prev - 1);
      }, 1000);
    } else if (gameTimer === 0 && gamePhase === 'playing') {
      setFeedback('⏰ Tempo esgotado! Tente novamente.');
      setIsTimerActive(false);
      setTimeout(() => {
        setGamePhase('intro'); // Volta para o menu inicial
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, gameTimer, gamePhase]);

  const checkPatternCompletion = () => {
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
  };

  const handlePatternTouch = (patternId: string, playerId: string) => {
    if (!isTimerActive) return;
    setPatterns(prev => prev.map(pattern => {
      if (pattern.id === patternId) {
        if (numberOfPlayers === 1) {
          return { ...pattern, touchedBy: [], active: !pattern.active };
        } else {
          const alreadyTouched = pattern.touchedBy.includes(playerId);
          const newTouchedBy = alreadyTouched ? pattern.touchedBy.filter(id => id !== playerId) : [...pattern.touchedBy, playerId];
          let shouldActivate = pattern.active;
          if (numberOfPlayers === 2 && newTouchedBy.length === 2) { shouldActivate = !pattern.active; }
          if (numberOfPlayers === 3 && newTouchedBy.length >= 2) { shouldActivate = !pattern.active; }
          return { ...pattern, touchedBy: newTouchedBy, active: shouldActivate };
        }
      }
      return pattern;
    }));
    setTimeout(() => checkPatternCompletion(), 100);
  };
  
  useEffect(() => {
    if (gamePhase === 'playing') {
      initializePatterns();
    }
  }, [currentLevel]);

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

  const sendMessage = () => {
    if (newMessage.trim()) {
      const playerName = players.find(p => p.id === activePlayer)?.name;
      setChatMessages(prev => [...prev, `${playerName}: ${newMessage}`]);
      setNewMessage('');
      const currentPlayerIndex = players.findIndex(p => p.id === activePlayer);
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      setActivePlayer(players[nextPlayerIndex].id);
    }
  };
  
  const renderShape = (color: string, shape: string, isActive: boolean) => {
    const baseClasses = `w-full h-full transition-all duration-300 ${isActive ? 'scale-110 shadow-lg' : 'scale-100'}`;
    const colorClasses: { [key: string]: string } = { red: isActive ? 'bg-red-500' : 'bg-red-200', blue: isActive ? 'bg-blue-500' : 'bg-blue-200', green: isActive ? 'bg-green-500' : 'bg-green-200', yellow: isActive ? 'bg-yellow-500' : 'bg-yellow-200', purple: isActive ? 'bg-purple-500' : 'bg-purple-200', orange: isActive ? 'bg-orange-500' : 'bg-orange-200' };
    const shapeClasses: { [key: string]: string } = { circle: 'rounded-full', square: 'rounded-lg', triangle: 'clip-triangle', diamond: 'clip-diamond', star: 'clip-star', heart: 'clip-heart' }; // Usando classes para clip-path
    return <div className={`${baseClasses} ${colorClasses[color]} ${shapeClasses[shape]}`} />;
  };
  // ### FIM DO BLOCO DE LÓGICA RESTAURADO ###

  if (gamePhase === 'intro') {
    return (
        <>
        <GameHeader title="Padrões Colaborativos" icon={<LayoutGrid className="h-6 w-6" />} showSaveButton={false} />
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:</h3><p className="text-sm text-gray-600">Desenvolver concentração, reconhecimento de padrões e, no modo multi-jogador, aprimorar a coordenação e comunicação em equipe.</p></div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:</h3><ul className="list-disc list-inside text-sm text-gray-600 space-y-1"><li>Escolha o modo: Individual ou Colaborativo.</li><li>Observe o "Padrão Alvo".</li><li>Clique/toque nas células da "Área Colaborativa" para recriar o padrão.</li><li>Comuniquem-se pelo chat para coordenar!</li></ul></div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">⭐ Regras:</h3><p className="text-sm text-gray-600"><strong>1 Jogador:</strong> Clique para ativar/desativar.<br/><strong>2 Jogadores:</strong> Ambos precisam tocar.<br/><strong>3 Jogadores:</strong> Pelo menos 2 precisam tocar.</p></div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Selecione o Modo de Jogo</h2>
                <select value={numberOfPlayers} onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))} className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value={1}>1 Jogador (Individual)</option>
                    <option value={2}>2 Jogadores (Colaborativo)</option>
                    <option value={3}>3 Jogadores (Colaborativo)</option>
                </select>
                </div>
            </div>
            <div className="text-center pt-4">
                <button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg">🚀 Iniciar Desafio</button>
            </div>
            </div>
        </main>
        </>
    );
  }

  if (gamePhase === 'completed') {
    return (
      <>
        <GameHeader title="Padrões Colaborativos" icon={<LayoutGrid className="h-6 w-6" />} />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Parabéns, Equipe!</h2>
            <p className="text-gray-600 mb-6">Vocês completaram todos os níveis trabalhando em perfeita coordenação!</p>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg mb-6">
              <p className="text-lg font-semibold">Pontuação Final: {score} pontos</p>
              <p className="text-sm">Padrões Completados: {completedPatterns}</p>
            </div>
            <button onClick={() => { setGamePhase('intro'); setScore(0); setCompletedPatterns(0); setCurrentLevel(1); }} className="w-full mt-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg">
              🔄 Jogar Novamente
            </button>
          </div>
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
                        <button key={pattern.id} onClick={() => handlePatternTouch(pattern.id, activePlayer)} className={`relative aspect-square border-2 rounded-lg flex items-center justify-center p-2 transition-all duration-200 ${pattern.touchedBy.length > 0 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 hover:border-blue-400'}`}>
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
                    {targetPattern.map((pattern, index) => (<div key={`target-${index}`} className="aspect-square border-2 border-gray-200 rounded-lg flex items-center justify-center p-2">{renderShape(pattern.color, pattern.shape, pattern.active)}</div>))}
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">Reproduzam este padrão trabalhando juntos</p>
            </div>

            <div className="space-y-6 lg:order-3">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">👥 Jogadores</h3>
                        <div className="text-sm font-medium">⏱️ {Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, '0')}</div>
                    </div>
                    <div className="space-y-3">
                        {players.map(player => (
                            <div key={player.id} className={`flex items-center p-3 rounded-lg ${activePlayer === player.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                                <div className={`w-4 h-4 rounded-full mr-3 ${player.color === 'blue' ? 'bg-blue-500' : player.color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                                <span className="font-medium text-gray-700">{player.name}</span>
                                {activePlayer === player.id && numberOfPlayers > 1 && (<span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Sua vez</span>)}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">💬 Chat da Equipe</h3>
                    <div className="bg-gray-50 rounded-lg p-3 h-32 overflow-y-auto mb-3 text-sm">
                        {chatMessages.length === 0 ? (<p className="text-gray-500 text-center">Use o chat para se coordenarem!</p>) : (chatMessages.map((msg, index) => (<p key={index} className="mb-1 text-gray-700">{msg}</p>)))}
                    </div>
                    <div className="flex">
                        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Digite sua mensagem..." className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r-lg text-sm hover:bg-blue-600 transition-colors">Enviar</button>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
