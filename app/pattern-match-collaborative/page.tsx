'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GameHeader } from '@/components/GameHeader';
import { LayoutGrid, Trophy, Gamepad2, Bot, Lightbulb, Brain } from 'lucide-react';

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
  isBot?: boolean;
}

export default function PatternMatchCollaborativePage() {
  const router = useRouter();
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [targetPattern, setTargetPattern] = useState<Pattern[]>([]);
  const [players, setPlayers] = useState<Player[]>([
    { id: 'player1', name: 'Você', color: 'blue' },
    { id: 'computer', name: 'Assistente IA', color: 'green', isBot: true }
  ]);
  const [currentTip, setCurrentTip] = useState('');
  const [tipHistory, setTipHistory] = useState<string[]>([]);
  const [completedPatterns, setCompletedPatterns] = useState(0);
  const [gameTimer, setGameTimer] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [computerThinking, setComputerThinking] = useState(false);
  const [lastComputerMove, setLastComputerMove] = useState(0);
  const computerTimeoutRef = useRef<NodeJS.Timeout>();

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const shapes = ['circle', 'square'];

  const initializePatterns = useCallback(() => {
    const gridSize = Math.min(2 + currentLevel, 4);
    const activePercentage = 0.3 + (currentLevel * 0.05);
    
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
  }, [currentLevel]);

  // Sistema de dicas contextuais da IA
  const generateTip = useCallback(() => {
    const incorrectPatterns = patterns.filter((p, idx) => 
      p.active !== targetPattern[idx].active
    );
    
    const correctPatterns = patterns.filter((p, idx) => 
      p.active === targetPattern[idx].active
    );
    
    const totalPatterns = patterns.length;
    const correctCount = correctPatterns.length;
    const percentage = Math.round((correctCount / totalPatterns) * 100);
    
    let tips: string[] = [];
    
    if (percentage < 30) {
      tips = [
        `💡 Observe o padrão alvo com calma. Há ${incorrectPatterns.length} células para ajustar.`,
        `🎯 Foque nas cores primeiro, depois nas formas.`,
        `👀 Compare lado a lado - quais células estão diferentes?`,
        `🔍 Vamos começar pelos cantos, são mais fáceis de identificar.`
      ];
    } else if (percentage < 60) {
      tips = [
        `✨ Bom progresso! ${correctCount} de ${totalPatterns} células corretas.`,
        `🎯 Faltam apenas ${incorrectPatterns.length} ajustes.`,
        `💪 Estamos quase na metade! Continue assim.`,
        `🧩 Verifique as células do centro, geralmente são as mais difíceis.`
      ];
    } else if (percentage < 90) {
      tips = [
        `🔥 Excelente! Apenas ${incorrectPatterns.length} células para a vitória!`,
        `⭐ ${percentage}% completo - quase lá!`,
        `🎉 Últimos ajustes! Revise com cuidado.`,
        `✅ Confira novamente as bordas, às vezes passam despercebidas.`
      ];
    } else {
      tips = [
        `🏁 Tão perto! Apenas ${incorrectPatterns.length} célula${incorrectPatterns.length > 1 ? 's' : ''} restante${incorrectPatterns.length > 1 ? 's' : ''}!`,
        `💯 Última verificação - compare cada célula cuidadosamente.`,
        `🎯 Foco total! A vitória está ao alcance.`
      ];
    }
    
    // Se a IA já tocou em alguma célula, mencionar
    const touchedByPlayer = patterns.filter(p => p.touchedBy.includes('player1'));
    if (touchedByPlayer.length > 0 && Math.random() > 0.5) {
      tips.push(`🤝 Você já marcou ${touchedByPlayer.length} célula${touchedByPlayer.length > 1 ? 's' : ''}. Preciso ajudar com as mesmas!`);
    }
    
    const selectedTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(selectedTip);
    setTipHistory(prev => [selectedTip, ...prev].slice(0, 5)); // Mantém só as últimas 5 dicas
  }, [patterns, targetPattern]);

  // Lógica da IA do computador - mais rápida e inteligente
  const computerMove = useCallback(() => {
    if (!isTimerActive || gamePhase !== 'playing') return;
    
    setComputerThinking(true);
    
    // Tempo de resposta mais rápido: 0.5-1.5 segundos
    computerTimeoutRef.current = setTimeout(() => {
      const incorrectPatterns = patterns.filter((p, idx) => 
        p.active !== targetPattern[idx].active
      );
      
      if (incorrectPatterns.length > 0) {
        // IA mais inteligente - sempre ajuda quando necessário
        const needsHelp = incorrectPatterns.filter(p => 
          p.touchedBy.includes('player1')
        );
        
        let targetPattern: Pattern;
        
        if (needsHelp.length > 0) {
          // Prioriza ajudar onde o jogador já tocou
          targetPattern = needsHelp[0];
        } else {
          // Escolhe uma célula incorreta estrategicamente
          // Prefere células mais próximas do centro ou cantos (mais fáceis de ver)
          targetPattern = incorrectPatterns[Math.floor(Math.random() * Math.min(3, incorrectPatterns.length))];
        }
        
        handlePatternTouch(targetPattern.id, 'computer');
        
        // Gera nova dica após o movimento
        setTimeout(() => generateTip(), 300);
      }
      
      setComputerThinking(false);
      setLastComputerMove(Date.now());
    }, 500 + Math.random() * 1000); // Mais rápido: 0.5-1.5 segundos
  }, [patterns, targetPattern, isTimerActive, gamePhase, generateTip]);

  // IA move mais frequentemente - a cada 2.5 segundos
  useEffect(() => {
    if (gamePhase === 'playing' && isTimerActive && !computerThinking) {
      const timeSinceLastMove = Date.now() - lastComputerMove;
      
      if (timeSinceLastMove > 2500) { // Reduzido de 4000 para 2500ms
        computerMove();
      }
      
      const interval = setInterval(() => {
        computerMove();
      }, 2500);
      
      return () => clearInterval(interval);
    }
  }, [gamePhase, isTimerActive, computerThinking, computerMove, lastComputerMove]);

  // Gera dicas periodicamente
  useEffect(() => {
    if (gamePhase === 'playing' && isTimerActive) {
      const interval = setInterval(() => {
        generateTip();
      }, 5000); // Nova dica a cada 5 segundos
      
      return () => clearInterval(interval);
    }
  }, [gamePhase, isTimerActive, generateTip]);

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
      setFeedback('⏰ Tempo esgotado! Tente novamente.');
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
      const levelPoints = currentLevel * 50;
      setScore(prev => prev + levelPoints);
      setCompletedPatterns(prev => prev + 1);
      setFeedback(`🎉 Padrão completado! +${levelPoints} pontos`);
      setIsTimerActive(false);
      setCurrentTip('🏆 Perfeito! Vocês formam uma excelente equipe!');
      
      setTimeout(() => {
        if (currentLevel < 5) {
          setCurrentLevel(prev => prev + 1);
          setGameTimer(120);
          setFeedback('');
          setIsTimerActive(true);
          setCurrentTip('🚀 Novo nível! Vamos trabalhar juntos novamente!');
          setTipHistory([]);
        } else {
          setGamePhase('completed');
        }
      }, 1500);
    }
  }, [patterns, targetPattern, currentLevel]);

  const handlePatternTouch = useCallback((patternId: string, playerId: string) => {
    if (!isTimerActive) return;
    
    setPatterns(prev => prev.map(pattern => {
      if (pattern.id === patternId) {
        const alreadyTouched = pattern.touchedBy.includes(playerId);
        const newTouchedBy = alreadyTouched 
          ? pattern.touchedBy.filter(id => id !== playerId) 
          : [...pattern.touchedBy, playerId];
        
        let shouldActivate = pattern.active;
        
        // Ambos precisam tocar para ativar/desativar
        if (newTouchedBy.length === 2) {
          shouldActivate = !pattern.active;
          newTouchedBy.length = 0;
        }
        
        return { ...pattern, touchedBy: newTouchedBy, active: shouldActivate };
      }
      return pattern;
    }));
    
    setTimeout(() => checkPatternCompletion(), 100);
  }, [isTimerActive, checkPatternCompletion]);

  const startGame = () => {
    setGamePhase('playing');
    setIsTimerActive(true);
    setCurrentLevel(1);
    setScore(0);
    setCompletedPatterns(0);
    setGameTimer(120);
    setTipHistory([]);
    setCurrentTip('🤖 Olá! Vamos trabalhar juntos. Toque nas células e eu ajudo!');
    setFeedback('🤝 Você e a IA devem tocar a mesma célula para ativá-la.');
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
          title="Padrões Colaborativos com IA" 
          icon={<Brain className="h-6 w-6" />} 
          showSaveButton={false} 
        />
        <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl shadow-lg p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md mb-4">
                  <Bot className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Jogue com Assistente IA
                </h2>
                <p className="text-gray-600">
                  Trabalhe em equipe com a inteligência artificial para reproduzir padrões!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" /> 
                    Objetivo
                  </h3>
                  <p className="text-sm text-gray-600">
                    Reproduza o padrão alvo trabalhando em sincronia com a IA. 
                    Desenvolva concentração e coordenação.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Gamepad2 className="h-5 w-5 mr-2 text-blue-500" /> 
                    Como Jogar
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Observe o padrão alvo</li>
                    <li>• Toque nas células para marcar</li>
                    <li>• A IA tocará junto com você</li>
                    <li>• Ambos ativam a célula</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-purple-500" /> 
                    Dicas da IA
                  </h3>
                  <p className="text-sm text-gray-600">
                    A IA fornecerá dicas contextuais durante o jogo para ajudar 
                    você a identificar os padrões.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Como funciona a colaboração:
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <p className="text-xs text-gray-600">Você toca</p>
                  </div>
                  <span className="text-2xl text-gray-400">+</span>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-xs text-gray-600">IA toca</p>
                  </div>
                  <span className="text-2xl text-gray-400">=</span>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <p className="text-xs text-gray-600">Célula ativa</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
              >
                <Bot className="h-6 w-6 mr-2" />
                Iniciar com IA
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
          title="Padrões Colaborativos com IA" 
          icon={<Brain className="h-6 w-6" />} 
        />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Parabéns pela Parceria!
            </h2>
            <p className="text-gray-600 mb-6">
              Você e a IA completaram todos os níveis em perfeita sincronia!
            </p>
            
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg mb-4">
              <p className="text-lg font-semibold">Pontuação Final</p>
              <p className="text-3xl font-bold mt-1">{score} pontos</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Padrões</p>
                <p className="text-xl font-semibold text-gray-800">{completedPatterns}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Níveis</p>
                <p className="text-xl font-semibold text-gray-800">5/5</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setGamePhase('intro');
                setScore(0);
                setCompletedPatterns(0);
                setCurrentLevel(1);
              }}
              className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg inline-flex items-center justify-center"
            >
              <Bot className="h-6 w-6 mr-2" />
              Jogar Novamente
            </button>
          </div>
        </div>
      </>
    );
  }

  // TELA DO JOGO
  const gridSize = Math.min(2 + currentLevel, 4);
  const gridCols: { [key: number]: string } = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <GameHeader
        title={`Nível ${currentLevel} - Padrões com IA`}
        icon={<Brain className="h-6 w-6" />}
      />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Área Colaborativa */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:order-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center flex items-center justify-center">
              <Bot className="h-5 w-5 mr-2 text-green-600" />
              Área Colaborativa
            </h3>
            <div className={`grid ${gridCols[gridSize]} gap-2 max-w-xs mx-auto mb-4`}>
              {patterns.map((pattern, index) => (
                <button
                  key={pattern.id}
                  onClick={() => handlePatternTouch(pattern.id, 'player1')}
                  className={`relative aspect-square border-2 rounded-lg flex items-center justify-center p-1 transition-all duration-200 ${
                    pattern.touchedBy.length > 0 
                      ? 'border-yellow-400 bg-yellow-50 shadow-md' 
                      : 'border-gray-300 hover:border-blue-400 hover:shadow-sm'
                  }`}
                >
                  {renderShape(pattern.color, pattern.shape, pattern.active)}
                  
                  {/* Indicadores de toque */}
                  {pattern.touchedBy.length > 0 && (
                    <div className="absolute -top-2 -right-2 flex">
                      {pattern.touchedBy.includes('player1') && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                      )}
                      {pattern.touchedBy.includes('computer') && (
                        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm -ml-1 flex items-center justify-center">
                          <Bot className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Número da célula para referência */}
                  <div className="absolute top-1 left-1 text-xs text-gray-400 font-semibold">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
            
            {feedback && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-blue-800 text-sm animate-pulse">
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
                  className="relative aspect-square border-2 border-gray-300 rounded-lg flex items-center justify-center p-1 bg-gray-50"
                >
                  {renderShape(pattern.color, pattern.shape, pattern.active)}
                  <div className="absolute top-1 left-1 text-xs text-gray-400 font-semibold">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Reproduza este padrão com ajuda da IA
            </p>
          </div>
          
          {/* Painel Lateral */}
          <div className="space-y-4 lg:order-3">
            {/* Status do Jogo */}
            <div className="bg-white rounded-xl shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Status</h3>
                <div className="text-lg font-bold text-blue-600">
                  ⏱️ {Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, '0')}
                </div>
              </div>
              
              {/* Jogadores */}
              <div className="space-y-2 mb-4">
                {players.map(player => (
                  <div
                    key={player.id}
                    className={`flex items-center p-2 rounded-lg bg-gray-50`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full mr-3 ${
                        player.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                      } flex items-center justify-center`}
                    >
                      {player.isBot && (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-gray-700 text-sm">{player.name}</span>
                    {player.isBot && computerThinking && (
                      <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-1 rounded animate-pulse">
                        Analisando...
                      </span>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Pontuação */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Pontos</p>
                  <p className="text-xl font-bold text-gray-800">{score}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Nível</p>
                  <p className="text-xl font-bold text-gray-800">{currentLevel}/5</p>
                </div>
              </div>
            </div>
            
            {/* Dicas da IA */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                Dicas da IA
              </h3>
              
              {/* Dica atual - destaque */}
              {currentTip && (
                <div className="bg-white rounded-lg p-3 mb-3 shadow-sm border-l-4 border-green-500">
                  <p className="text-sm text-gray-700 font-medium">{currentTip}</p>
                </div>
              )}
              
              {/* Histórico de dicas */}
              {tipHistory.length > 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-1">Dicas anteriores:</p>
                  {tipHistory.slice(1, 3).map((tip, index) => (
                    <div key={index} className="bg-white/50 rounded p-2">
                      <p className="text-xs text-gray-600">{tip}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Indicador de progresso */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progresso do Padrão</span>
                  <span>
                    {patterns.filter((p, idx) => p.active === targetPattern[idx].active).length}/{patterns.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(patterns.filter((p, idx) => p.active === targetPattern[idx].active).length / patterns.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
