'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GameHeader } from '@/components/GameHeader';
import { LayoutGrid, Trophy, Gamepad2, Bot, User } from 'lucide-react';

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
  isBot?: boolean;
}

export default function PatternMatchCollaborativePage() {
  const router = useRouter();
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [targetPattern, setTargetPattern] = useState<Pattern[]>([]);
  const [gameMode, setGameMode] = useState<'solo' | 'computer' | 'multiplayer'>('solo');
  const [numberOfPlayers, setNumberOfPlayers] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayer, setActivePlayer] = useState('player1');
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [completedPatterns, setCompletedPatterns] = useState(0);
  const [gameTimer, setGameTimer] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [computerThinking, setComputerThinking] = useState(false);
  const computerTimeoutRef = useRef<NodeJS.Timeout>();

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const shapes = ['circle', 'square'];

  const initializePlayers = useCallback((mode: string) => {
    if (mode === 'solo') {
      setPlayers([
        { id: 'player1', name: 'Você', color: 'blue', isActive: true }
      ]);
      setNumberOfPlayers(1);
    } else if (mode === 'computer') {
      setPlayers([
        { id: 'player1', name: 'Você', color: 'blue', isActive: true },
        { id: 'computer', name: 'Assistente IA', color: 'green', isActive: true, isBot: true }
      ]);
      setNumberOfPlayers(2);
    } else {
      const playerCount = numberOfPlayers;
      const playerConfigs = [
        { id: 'player1', name: 'Jogador 1', color: 'blue', isActive: true },
        { id: 'player2', name: 'Jogador 2', color: 'green', isActive: true },
        { id: 'player3', name: 'Jogador 3', color: 'purple', isActive: true }
      ];
      setPlayers(playerConfigs.slice(0, playerCount));
    }
    setActivePlayer('player1');
  }, [numberOfPlayers]);

  const initializePatterns = useCallback(() => {
    let gridSize: number;
    let activePercentage: number;
    
    if (gameMode === 'solo') {
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
      const shapeIndex = Math.floor(Math.random() * shapes.length);
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
  }, [currentLevel, gameMode]);

  // Lógica da IA do computador
  const computerMove = useCallback(() => {
    if (!isTimerActive || gamePhase !== 'playing') return;
    
    setComputerThinking(true);
    
    // Simula tempo de pensamento da IA
    computerTimeoutRef.current = setTimeout(() => {
      // Encontra uma célula que precisa ser mudada
      const incorrectPatterns = patterns.filter((p, idx) => 
        p.active !== targetPattern[idx].active
      );
      
      if (incorrectPatterns.length > 0) {
        // Escolhe uma célula incorreta aleatória para ajudar
        const randomPattern = incorrectPatterns[Math.floor(Math.random() * incorrectPatterns.length)];
        const patternIndex = patterns.findIndex(p => p.id === randomPattern.id);
        
        // Verifica se já foi tocada pelo jogador
        const needsComputerTouch = patterns[patternIndex].touchedBy.includes('player1');
        
        if (needsComputerTouch || Math.random() > 0.3) { // 70% de chance de ajudar
          handlePatternTouch(randomPattern.id, 'computer');
          
          // Adiciona mensagem de dica no chat
          const hints = [
            `Toquei na célula ${patternIndex + 1}! 🎯`,
            `Acho que essa célula precisa mudar! 💡`,
            `Vamos tentar essa aqui! 🤖`,
            `Essa parece promissora! ✨`
          ];
          setChatMessages(prev => [...prev, `🤖 IA: ${hints[Math.floor(Math.random() * hints.length)]}`]);
        } else {
          // Às vezes dá dicas sem tocar
          const tips = [
            `Hmm, estou analisando o padrão... 🤔`,
            `Precisamos trabalhar juntos nessa! 🤝`,
            `Vejo algumas diferenças interessantes... 👀`,
            `Continue assim! Estamos quase lá! 💪`
          ];
          setChatMessages(prev => [...prev, `🤖 IA: ${tips[Math.floor(Math.random() * tips.length)]}`]);
        }
      }
      
      setComputerThinking(false);
    }, 1000 + Math.random() * 2000); // Entre 1-3 segundos
  }, [patterns, targetPattern, isTimerActive, gamePhase]);

  // Ativa movimentos do computador periodicamente
  useEffect(() => {
    if (gameMode === 'computer' && gamePhase === 'playing' && isTimerActive && !computerThinking) {
      const interval = setInterval(() => {
        computerMove();
      }, 4000); // Move a cada 4 segundos
      
      return () => clearInterval(interval);
    }
  }, [gameMode, gamePhase, isTimerActive, computerThinking, computerMove]);

  useEffect(() => {
    initializePlayers(gameMode);
  }, [gameMode, initializePlayers]);
  
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
    const isComplete = patterns.every((pattern, index) => 
      pattern.active === targetPattern[index]?.active
    );
    
    if (isComplete) {
      const levelPoints = currentLevel * (gameMode === 'solo' ? 75 : 50);
      setScore(prev => prev + levelPoints);
      setCompletedPatterns(prev => prev + 1);
      setFeedback(`🎉 Padrão completado! +${levelPoints} pontos`);
      setIsTimerActive(false);
      
      if (gameMode === 'computer') {
        setChatMessages(prev => [...prev, `🤖 IA: Ótimo trabalho! Fizemos uma excelente equipe! 🎉`]);
      }
      
      setTimeout(() => {
        if (currentLevel < 5) {
          setCurrentLevel(prev => prev + 1);
          const newTime = gameMode === 'solo' ? 90 : 120;
          setGameTimer(newTime);
          setFeedback('');
          setIsTimerActive(true);
          
          if (gameMode === 'computer') {
            setChatMessages(prev => [...prev, `🤖 IA: Vamos para o próximo nível! Estou pronto! 💪`]);
          }
        } else {
          setGamePhase('completed');
        }
      }, 1500);
    }
  }, [patterns, targetPattern, currentLevel, gameMode]);

  const handlePatternTouch = useCallback((patternId: string, playerId: string) => {
    if (!isTimerActive) return;
    
    setPatterns(prev => prev.map(pattern => {
      if (pattern.id === patternId) {
        if (gameMode === 'solo') {
          return { ...pattern, touchedBy: [], active: !pattern.active };
        } else {
          const alreadyTouched = pattern.touchedBy.includes(playerId);
          const newTouchedBy = alreadyTouched 
            ? pattern.touchedBy.filter(id => id !== playerId) 
            : [...pattern.touchedBy, playerId];
          
          let shouldActivate = pattern.active;
          
          // No modo com computador ou 2 jogadores
          if ((gameMode === 'computer' || numberOfPlayers === 2) && newTouchedBy.length === 2) {
            shouldActivate = !pattern.active;
            newTouchedBy.length = 0;
          }
          
          // No modo 3 jogadores
          if (numberOfPlayers === 3 && newTouchedBy.length >= 2) {
            shouldActivate = !pattern.active;
            newTouchedBy.length = 0;
          }
          
          return { ...pattern, touchedBy: newTouchedBy, active: shouldActivate };
        }
      }
      return pattern;
    }));
    
    setTimeout(() => checkPatternCompletion(), 100);
  }, [isTimerActive, gameMode, numberOfPlayers, checkPatternCompletion]);

  const startGame = () => {
    setGamePhase('playing');
    setIsTimerActive(true);
    setCurrentLevel(1);
    setScore(0);
    setCompletedPatterns(0);
    setChatMessages([]);
    const initialTime = gameMode === 'solo' ? 90 : 120;
    setGameTimer(initialTime);
    
    if (gameMode === 'solo') {
      setFeedback('🎯 Clique nas células para reproduzir o padrão alvo!');
    } else if (gameMode === 'computer') {
      setFeedback('🤖 Trabalhe com a IA! Ambos devem tocar a mesma célula.');
      setChatMessages([`🤖 IA: Olá! Vamos trabalhar juntos para completar os padrões! 👋`]);
    } else if (numberOfPlayers === 2) {
      setFeedback('👥 Ambos devem tocar a mesma célula para ativá-la.');
    } else {
      setFeedback('👥👥👥 Pelo menos 2 jogadores devem tocar para ativar.');
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const playerName = players.find(p => p.id === activePlayer)?.name;
      setChatMessages(prev => [...prev, `${playerName}: ${newMessage}`]);
      setNewMessage('');
      
      // No modo com computador, a IA responde
      if (gameMode === 'computer') {
        setTimeout(() => {
          const responses = [
            "Boa ideia! Vamos tentar! 👍",
            "Estou analisando o padrão... 🤔",
            "Concordo! Vamos focar nessa área! 🎯",
            "Você está indo muito bem! Continue! 💪"
          ];
          setChatMessages(prev => [...prev, `🤖 IA: ${responses[Math.floor(Math.random() * responses.length)]}`]);
        }, 500);
      } else if (gameMode === 'multiplayer') {
        const currentPlayerIndex = players.findIndex(p => p.id === activePlayer);
        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
        setActivePlayer(players[nextPlayerIndex].id);
      }
    }
  };
  
  const renderShape = (color: string, shape: string, isActive: boolean) => {
    const baseClasses = `w-full h-full transition-all duration-300 ${
      isActive ? 'scale-100 shadow-lg' : 'scale-90'
    }`;
    
    const colorClasses: { [key: string]: string } = {
      red: isActive ? 'bg-red-500' : 'bg-red-200',
      blue: isActive ? 'bg-blue-500' : 'bg-blue-200',
      green: isActive ? 'bg-green-500' : 'bg-green-200',
      yellow: isActive ? 'bg-yellow-500' : 'bg-yellow-200',
      purple: isActive ? 'bg-purple-500' : 'bg-purple-200',
      orange: isActive ? 'bg-orange-500' : 'bg-orange-200'
    };
    
    const shapeClasses: { [key: string]: string } = {
      circle: 'rounded-full',
      square: 'rounded-lg'
    };
    
    return (
      <div className={`${baseClasses} ${colorClasses[color] || 'bg-gray-200'} ${shapeClasses[shape] || 'rounded-lg'}`} />
    );
  };

  // TELA DE INTRODUÇÃO
  if (gamePhase === 'intro') {
    return (
      <>
        <GameHeader 
          title="Padrões Colaborativos" 
          icon={<LayoutGrid className="h-6 w-6" />} 
          showSaveButton={false} 
        />
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:
                  </h3>
                  <p className="text-sm text-gray-600">
                    Desenvolver concentração, reconhecimento de padrões e aprimorar coordenação.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                    <Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Escolha seu modo de jogo preferido</li>
                    <li>Observe o "Padrão Alvo"</li>
                    <li>Clique nas células para recriar o padrão</li>
                    <li>Use o chat para coordenação!</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Regras:</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Solo:</strong> Clique para ativar/desativar.<br/>
                    <strong>Com IA:</strong> Você e a IA tocam juntos.<br/>
                    <strong>Multiplayer:</strong> Coordene com outros jogadores.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Modo de Jogo</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setGameMode('solo')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    gameMode === 'solo' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold">Individual</h3>
                  <p className="text-sm text-gray-600 mt-1">Jogue sozinho</p>
                </button>
                
                <button
                  onClick={() => setGameMode('computer')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    gameMode === 'computer' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Bot className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold">Com IA</h3>
                  <p className="text-sm text-gray-600 mt-1">Jogue com assistente</p>
                </button>
                
                <button
                  onClick={() => setGameMode('multiplayer')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    gameMode === 'multiplayer' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Gamepad2 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold">Multiplayer</h3>
                  <p className="text-sm text-gray-600 mt-1">2-3 jogadores locais</p>
                </button>
              </div>
              
              {gameMode === 'multiplayer' && (
                <div className="mt-4 flex items-center justify-center">
                  <label className="text-sm font-medium text-gray-700 mr-3">
                    Número de jogadores:
                  </label>
                  <select
                    value={numberOfPlayers}
                    onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={2}>2 Jogadores</option>
                    <option value={3}>3 Jogadores</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="text-center pt-4">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🚀 Iniciar Desafio
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // TELA DE CONCLUSÃO
  if (gamePhase === 'completed') {
    return (
      <>
        <GameHeader 
          title="Padrões Colaborativos" 
          icon={<LayoutGrid className="h-6 w-6" />} 
        />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {gameMode === 'computer' ? 'Parabéns, Equipe!' : 'Parabéns!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {gameMode === 'computer' 
                ? 'Você e a IA completaram todos os níveis em perfeita sincronia!'
                : gameMode === 'solo'
                ? 'Você completou todos os níveis com maestria!'
                : 'Vocês completaram todos os níveis trabalhando em perfeita coordenação!'}
            </p>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg mb-6">
              <p className="text-lg font-semibold">Pontuação Final: {score} pontos</p>
              <p className="text-sm">Padrões Completados: {completedPatterns}</p>
            </div>
            <button
              onClick={() => {
                setGamePhase('intro');
                setScore(0);
                setCompletedPatterns(0);
                setCurrentLevel(1);
              }}
              className="w-full mt-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg"
            >
              🔄 Jogar Novamente
            </button>
          </div>
        </div>
      </>
    );
  }

  // TELA DO JOGO (gamePhase === 'playing')
  const gridSize = gameMode === 'solo' 
    ? Math.min(3 + currentLevel, 5) 
    : Math.min(2 + currentLevel, 4);
  const gridCols: { [key: number]: string } = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5'
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <GameHeader
        title={`Padrões Colaborativos - Nível ${currentLevel}`}
        icon={<LayoutGrid className="h-6 w-6" />}
      />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Área Colaborativa */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:order-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              🧩 Área Colaborativa
            </h3>
            <div className={`grid ${gridCols[gridSize]} gap-2 max-w-xs mx-auto mb-4`}>
              {patterns.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => handlePatternTouch(pattern.id, activePlayer)}
                  className={`relative aspect-square border-2 rounded-lg flex items-center justify-center p-1 transition-all duration-200 ${
                    pattern.touchedBy.length > 0 
                      ? 'border-yellow-400 bg-yellow-50' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {renderShape(pattern.color, pattern.shape, pattern.active)}
                  {gameMode !== 'solo' && (
                    <div className="absolute -top-1 -right-1 flex">
                      {pattern.touchedBy.includes('player1') && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                      )}
                      {pattern.touchedBy.includes('computer') && (
                        <div className="w-3 h-3 bg-green-500 rounded-full border border-white -ml-1">
                          <Bot className="w-2 h-2 text-white" />
                        </div>
                      )}
                      {pattern.touchedBy.includes('player2') && (
                        <div className="w-3 h-3 bg-green-500 rounded-full border border-white -ml-1"></div>
                      )}
                      {pattern.touchedBy.includes('player3') && (
                        <div className="w-3 h-3 bg-purple-500 rounded-full border border-white -ml-1"></div>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
            {feedback && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-blue-800 text-sm">
                {feedback}
              </div>
            )}
          </div>
          
          {/* Padrão Alvo */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:order-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              🎯 Padrão Alvo
            </h3>
            <div className={`grid ${gridCols[gridSize]} gap-2 max-w-xs mx-auto`}>
              {targetPattern.map((pattern, index) => (
                <div
                  key={`target-${index}`}
                  className="aspect-square border-2 border-gray-200 rounded-lg flex items-center justify-center p-1"
                >
                  {renderShape(pattern.color, pattern.shape, pattern.active)}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              {gameMode === 'computer' 
                ? 'Trabalhe com a IA para reproduzir este padrão'
                : gameMode === 'solo'
                ? 'Reproduza este padrão'
                : 'Reproduzam este padrão trabalhando juntos'}
            </p>
          </div>
          
          {/* Painel Lateral */}
          <div className="space-y-6 lg:order-3">
            {/* Status dos Jogadores */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {gameMode === 'computer' ? '🤝 Equipe' : '👥 Jogadores'}
                </h3>
                <div className="text-sm font-medium">
                  ⏱️ {Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="space-y-3">
                {players.map(player => (
                  <div
                    key={player.id}
                    className={`flex items-center p-3 rounded-lg ${
                      activePlayer === player.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full mr-3 ${
                        player.color === 'blue' 
                          ? 'bg-blue-500' 
                          : player.color === 'green' 
                          ? 'bg-green-500' 
                          : 'bg-purple-500'
                      }`}
                    >
                      {player.isBot && (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-700">{player.name}</span>
                    {player.isBot && computerThinking && (
                      <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded animate-pulse">
                        Pensando...
                      </span>
                    )}
                    {!player.isBot && activePlayer === player.id && gameMode === 'multiplayer' && (
                      <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        Sua vez
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Pontuação */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pontuação:</span>
                  <span className="font-semibold text-gray-800">{score} pts</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Nível:</span>
                  <span className="font-semibold text-gray-800">{currentLevel}/5</span>
                </div>
              </div>
            </div>
            
            {/* Chat */}
            {(gameMode === 'computer' || gameMode === 'multiplayer') && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  💬 {gameMode === 'computer' ? 'Chat com IA' : 'Chat da Equipe'}
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 h-32 overflow-y-auto mb-3 text-sm">
                  {chatMessages.length === 0 ? (
                    <p className="text-gray-500 text-center">
                      {gameMode === 'computer' 
                        ? 'Converse com a IA para coordenar!'
                        : 'Use o chat para se coordenarem!'}
                    </p>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <p key={index} className="mb-1 text-gray-700">{msg}</p>
                    ))
                  )}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
