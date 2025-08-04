'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const [gameTimer, setGameTimer] = useState(120); // 2 minutos por nível
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Inicializar jogadores baseado na quantidade selecionada
  const initializePlayers = (count: number) => {
    const playerConfigs = [
      { id: 'player1', name: 'Jogador 1', color: 'blue', isActive: true },
      { id: 'player2', name: 'Jogador 2', color: 'green', isActive: true },
      { id: 'player3', name: 'Jogador 3', color: 'purple', isActive: true }
    ];
    
    setPlayers(playerConfigs.slice(0, count));
    setActivePlayer('player1');
  };

  // Atualizar jogadores quando número muda
  useEffect(() => {
    initializePlayers(numberOfPlayers);
  }, [numberOfPlayers]);
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const shapes = ['circle', 'square', 'triangle', 'diamond', 'star', 'heart'];

  // Inicializar padrões baseado no nível
  const initializePatterns = () => {
    // Complexidade adaptada ao número de jogadores
    let gridSize: number;
    let activePercentage: number;
    
    if (numberOfPlayers === 1) {
      // Modo individual: mais complexo desde o início
      gridSize = Math.min(3 + currentLevel, 5); // 3x3 até 5x5
      activePercentage = 0.4 + (currentLevel * 0.1); // 40% a 90% das células ativas
    } else {
      // Modo colaborativo: progressão mais suave
      gridSize = Math.min(2 + currentLevel, 4); // 2x2 até 4x4
      activePercentage = 0.3 + (currentLevel * 0.05); // 30% a 55% das células ativas
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
        active: Math.random() < activePercentage, // Baseado na porcentagem calculada
        touchedBy: []
      };

      newPatterns.push({
        ...pattern,
        active: false,
        touchedBy: []
      });

      newTargetPattern.push(pattern);
    }

    setPatterns(newPatterns);
    setTargetPattern(newTargetPattern);
  };

  // Timer do jogo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && gameTimer > 0) {
      interval = setInterval(() => {
        setGameTimer(prev => prev - 1);
      }, 1000);
    } else if (gameTimer === 0) {
      // Tempo esgotado
      setFeedback('⏰ Tempo esgotado! Tente novamente.');
      setTimeout(() => {
        initializePatterns();
        const resetTime = numberOfPlayers === 1 ? 90 : 120;
        setGameTimer(resetTime);
        setFeedback('');
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, gameTimer]);

  // Handle touch/click no padrão
  const handlePatternTouch = (patternId: string, playerId: string) => {
    setPatterns(prev => prev.map(pattern => {
      if (pattern.id === patternId) {
        if (numberOfPlayers === 1) {
          // Modo individual: clique direto alterna o estado
          return {
            ...pattern,
            touchedBy: [], // Limpar touches no modo individual
            active: !pattern.active // Simplesmente alterna
          };
        } else {
          // Modo colaborativo
          const alreadyTouched = pattern.touchedBy.includes(playerId);
          const newTouchedBy = alreadyTouched 
            ? pattern.touchedBy.filter(id => id !== playerId)
            : [...pattern.touchedBy, playerId];

          let shouldActivate = pattern.active; // Manter estado atual por padrão
          
          if (numberOfPlayers === 2) {
            // 2 jogadores: ambos devem tocar
            if (newTouchedBy.length === 2) {
              shouldActivate = !pattern.active;
            }
          } else if (numberOfPlayers === 3) {
            // 3 jogadores: pelo menos 2 devem tocar
            if (newTouchedBy.length >= 2) {
              shouldActivate = !pattern.active;
            }
          }
          
          return {
            ...pattern,
            touchedBy: newTouchedBy,
            active: shouldActivate
          };
        }
      }
      return pattern;
    }));

    // Verificar se padrão foi completado após um pequeno delay
    setTimeout(() => checkPatternCompletion(), 100);
  };

  // Verificar se padrão atual coincide com target
  const checkPatternCompletion = () => {
    const isComplete = patterns.every((pattern, index) => 
      pattern.active === targetPattern[index]?.active
    );

    if (isComplete) {
      const levelPoints = currentLevel * (numberOfPlayers === 1 ? 75 : 50); // Mais pontos no modo individual
      setScore(prev => prev + levelPoints);
      setCompletedPatterns(prev => prev + 1);
      setFeedback(`🎉 Padrão completado! +${levelPoints} pontos`);
      
      // Próximo nível ou vitória
      setTimeout(() => {
        if (currentLevel < 5) {
          setCurrentLevel(prev => prev + 1);
          // Resetar timer baseado no modo
          const newTime = numberOfPlayers === 1 ? 90 : 120;
          setGameTimer(newTime);
          setFeedback('');
        } else {
          setGamePhase('completed');
        }
      }, 1500);
    }
  };

  // Reinicializar quando nível muda
  useEffect(() => {
    if (gamePhase === 'playing') {
      initializePatterns();
    }
  }, [currentLevel, gamePhase]);

  // Iniciar jogo
  const startGame = () => {
    setGamePhase('playing');
    setIsTimerActive(true);
    initializePatterns();
    setChatMessages([]);
    
    // Timer adaptativo baseado no número de jogadores
    const initialTime = numberOfPlayers === 1 ? 90 : 120; // 1.5min individual, 2min colaborativo
    setGameTimer(initialTime);
    
    // Feedback baseado no número de jogadores
    if (numberOfPlayers === 1) {
      setFeedback('🎯 Clique nas células para reproduzir o padrão alvo! Desafio individual intenso!');
    } else if (numberOfPlayers === 2) {
      setFeedback('👥 Trabalhem juntos! Ambos devem tocar a mesma célula para ativá-la.');
    } else {
      setFeedback('👥👥👥 Coordenação tripla! Pelo menos 2 jogadores devem tocar simultaneamente.');
    }
  };

  // Enviar mensagem no chat
  const sendMessage = () => {
    if (newMessage.trim()) {
      const playerName = players.find(p => p.id === activePlayer)?.name;
      setChatMessages(prev => [...prev, `${playerName}: ${newMessage}`]);
      setNewMessage('');
      // Alternar jogador ativo
      setActivePlayer(prev => prev === 'player1' ? 'player2' : 'player1');
    }
  };

  // Resetar nível
  const resetLevel = () => {
    initializePatterns();
    const resetTime = numberOfPlayers === 1 ? 90 : 120;
    setGameTimer(resetTime);
    setFeedback('');
    setPatterns(prev => prev.map(p => ({ ...p, active: false, touchedBy: [] })));
  };

  // Renderizar forma baseada no tipo
  const renderShape = (color: string, shape: string, isActive: boolean) => {
    const baseClasses = `w-full h-full transition-all duration-300 ${
      isActive ? 'scale-110 shadow-lg' : 'scale-100'
    }`;
    
    const colorClasses = {
      red: isActive ? 'bg-red-500' : 'bg-red-200',
      blue: isActive ? 'bg-blue-500' : 'bg-blue-200', 
      green: isActive ? 'bg-green-500' : 'bg-green-200',
      yellow: isActive ? 'bg-yellow-500' : 'bg-yellow-200',
      purple: isActive ? 'bg-purple-500' : 'bg-purple-200',
      orange: isActive ? 'bg-orange-500' : 'bg-orange-200'
    };

    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-lg',
      triangle: 'rounded-lg transform rotate-45',
      diamond: 'rounded-lg transform rotate-45',
      star: 'rounded-full',
      heart: 'rounded-full'
    };

    return (
      <div 
        className={`${baseClasses} ${colorClasses[color as keyof typeof colorClasses]} ${shapeClasses[shape as keyof typeof shapeClasses]}`}
      />
    );
  };

  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        {/* Header */}
        <div className="bg-white shadow-md px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/combined')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="mr-2">←</span>
              Voltar ao Dashboard
            </button>
            <h1 className="text-xl font-bold text-gray-800">TeaPlus</h1>
          </div>
        </div>

        {/* Conteúdo da Introdução */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              🧩
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Padrões Colaborativos
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Desenvolva concentração individual ou trabalhem em equipe para reproduzir padrões visuais
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Objetivo */}
            <div className="bg-red-100 rounded-xl p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                🎯 Objetivo:
              </h3>
              <p className="text-red-700">
                Desenvolver concentração, reconhecimento de padrões e, opcionalmente, 
                coordenação e comunicação em equipe. Escolha entre 1, 2 ou 3 jogadores 
                para diferentes níveis de desafio colaborativo.
              </p>
            </div>

            {/* Pontuação */}
            <div className="bg-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                🏆 Pontuação:
              </h3>
              <p className="text-blue-700">
                <strong>Modo Individual:</strong> 75 × nível atual (mais desafiador!).
                <strong>Modo Colaborativo:</strong> 50 × nível atual. 
                Coordenação perfeita e rapidez rendem pontos extras!
              </p>
            </div>

            {/* Níveis */}
            <div className="bg-purple-100 rounded-xl p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                📊 Níveis:
              </h3>
              <div className="text-purple-700 space-y-1">
                <p><strong>Individual:</strong> 3×3 até 5×5, alta complexidade</p>
                <p><strong>Colaborativo:</strong> 2×2 até 4×4, coordenação crescente</p>
                <p><strong>Nível 1-2:</strong> Cores básicas</p>
                <p><strong>Nível 3+:</strong> Formas variadas + mais células ativas</p>
                <p><strong>Nível 4-5:</strong> Padrões complexos desafiadores</p>
              </div>
            </div>

            {/* Final */}
            <div className="bg-green-100 rounded-xl p-6 border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                🏁 Final:
              </h3>
              <p className="text-green-700">
                Complete todos os 5 níveis trabalhando em perfeita coordenação 
                para desbloquear conquistas especiais de trabalho em equipe.
              </p>
            </div>
          </div>

          {/* Botão Iniciar */}
          <div className="text-center">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              🚀 Iniciar Desafio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Parabéns, Equipe!
          </h2>
          <p className="text-gray-600 mb-6">
            Vocês completaram todos os níveis trabalhando em perfeita coordenação!
          </p>
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg mb-6">
            <p className="text-lg font-semibold">Pontuação Final: {score} pontos</p>
            <p className="text-sm">Padrões Completados: {completedPatterns}</p>
          </div>
          <button
            onClick={() => router.push('/combined')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const gridSize = numberOfPlayers === 1 
    ? Math.min(3 + currentLevel, 5) 
    : Math.min(2 + currentLevel, 4);
    
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3', 
    4: 'grid-cols-4',
    5: 'grid-cols-5'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/combined')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Voltar ao Dashboard
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-600">
              Nível {currentLevel} |⏱️ {Math.floor(gameTimer/60)}:{(gameTimer%60).toString().padStart(2,'0')} | 🏆 {score}pts
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Padrão Alvo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              🎯 Padrão Alvo
            </h3>
            <div className={`grid ${gridCols[gridSize as keyof typeof gridCols]} gap-2 max-w-80 mx-auto`}>
              {targetPattern.map((pattern, index) => (
                <div
                  key={`target-${index}`}
                  className="aspect-square border-2 border-gray-200 rounded-lg flex items-center justify-center p-2"
                >
                  {renderShape(pattern.color, pattern.shape, pattern.active)}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Reproduzam este padrão trabalhando juntos
            </p>
          </div>

          {/* Area de Jogo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              🧩 Área Colaborativa
            </h3>
            <div className={`grid ${gridCols[gridSize as keyof typeof gridCols]} gap-2 max-w-80 mx-auto mb-4`}>
              {patterns.map((pattern, index) => (
                <button
                  key={pattern.id}
                  onClick={() => handlePatternTouch(pattern.id, activePlayer)}
                  className={`aspect-square border-2 rounded-lg flex items-center justify-center p-2 transition-all duration-200 ${
                    pattern.touchedBy.length > 0 
                      ? 'border-yellow-400 bg-yellow-50' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {renderShape(pattern.color, pattern.shape, pattern.active)}
                  {/* Indicadores de toque */}
                  {numberOfPlayers > 1 && (
                    <div className="absolute -top-1 -right-1 flex">
                      {pattern.touchedBy.includes('player1') && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
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
            
            {/* Feedback */}
            {feedback && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-blue-800 text-sm">
                {feedback}
              </div>
            )}
            
            {/* Controles */}
            <div className="flex justify-center space-x-2 mt-4">
              <button
                onClick={resetLevel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
              >
                🔄 Resetar
              </button>
            </div>
          </div>

          {/* Chat e Controles */}
          <div className="space-y-6">
            {/* Jogadores */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">👥 Jogadores</h3>
                <select
                  value={numberOfPlayers}
                  onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 Jogador</option>
                  <option value={2}>2 Jogadores</option>
                  <option value={3}>3 Jogadores</option>
                </select>
              </div>
              <div className="space-y-3">
                {players.map(player => (
                  <div 
                    key={player.id}
                    className={`flex items-center p-3 rounded-lg ${
                      activePlayer === player.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      player.color === 'blue' ? 'bg-blue-500' : 
                      player.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="font-medium text-gray-700">{player.name}</span>
                    {activePlayer === player.id && numberOfPlayers > 1 && (
                      <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        Sua vez
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💬 Chat da Equipe</h3>
              <div className="bg-gray-50 rounded-lg p-3 h-32 overflow-y-auto mb-3 text-sm">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-500 text-center">Use o chat para se coordenarem!</p>
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

            {/* Instruções */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Como Jogar</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {numberOfPlayers === 1 && (
                  <>
                    <p>• <strong>Modo Individual Intenso:</strong> Clique nas células para ativá-las</p>
                    <p>• <strong>Complexidade:</strong> Grids 3×3 até 5×5, mais células ativas</p>
                    <p>• <strong>Foco:</strong> Concentração máxima e reconhecimento de padrões</p>
                    <p>• <strong>Tempo:</strong> 1,5 minutos por nível (desafio intenso!)</p>
                    <p>• <strong>Pontuação:</strong> +50% de pontos por nível completado</p>
                  </>
                )}
                {numberOfPlayers === 2 && (
                  <>
                    <p>• <strong>Coordenação:</strong> Ambos devem tocar a célula para ativá-la</p>
                    <p>• <strong>Objetivo:</strong> Reproduzir o padrão alvo exatamente</p>
                    <p>• <strong>Comunicação:</strong> Usem o chat para se organizarem</p>
                    <p>• <strong>Indicadores:</strong> Círculos azul/verde mostram quem tocou</p>
                    <p>• <strong>Tempo:</strong> 2 minutos por nível</p>
                  </>
                )}
                {numberOfPlayers === 3 && (
                  <>
                    <p>• <strong>Coordenação Tripla:</strong> Pelo menos 2 de 3 devem tocar simultaneamente</p>
                    <p>• <strong>Objetivo:</strong> Reproduzir o padrão alvo exatamente</p>
                    <p>• <strong>Comunicação:</strong> Coordenação é essencial!</p>
                    <p>• <strong>Indicadores:</strong> Círculos coloridos mostram quem tocou</p>
                    <p>• <strong>Tempo:</strong> 2 minutos por nível</p>
                  </>
                )}
                <p>• <strong>Progressão:</strong> 5 níveis de dificuldade crescente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}