'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Image from 'next/image';
import { ChevronLeft, Save, Star, Trophy } from 'lucide-react';
import { createClient } from '../utils/supabaseClient'

// Componente do Cabeçalho Padrão (foi movido para dentro do GameScreen para facilitar a lógica de "voltar")
// const GameHeader = ...

interface Circle {
  id: number;
  label: string;
  xPercent: number;
  yPercent: number;
  connected: boolean;
}

export default function TrailMaking() {
  const router = useRouter();
  const supabase = createClient();
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // NOVO: Controle de telas como no Bubble-Pop
  const [currentScreen, setCurrentScreen] = useState<'title' | 'instructions' | 'game'>('title');
  
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentGameLevel, setCurrentGameLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [connections, setConnections] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [levelStartTime, setLevelStartTime] = useState<number>(0);
  const [completionTime, setCompletionTime] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameAreaDimensions, setGameAreaDimensions] = useState({ width: 0, height: 0 });
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [levelMessage, setLevelMessage] = useState('');
  const [levelsCompleted, setLevelsCompleted] = useState<number[]>([]);

  const levels = [
    { id: 1, name: 'Nível 1', count: 5, type: 'numbers', description: 'Números 1-5' },
    { id: 2, name: 'Nível 2', count: 8, type: 'numbers', description: 'Números 1-8' },
    { id: 3, name: 'Nível 3', count: 12, type: 'numbers', description: 'Números 1-12' },
    { id: 4, name: 'Nível 4', count: 15, type: 'numbers', description: 'Números 1-15' },
    { id: 5, name: 'Nível 5', count: 8, type: 'mixed', description: '1-A-2-B...' }
  ];

  // Atualizar dimensões da área de jogo
  useEffect(() => {
    const updateDimensions = () => {
      if (gameAreaRef.current) {
        setGameAreaDimensions({
          width: gameAreaRef.current.offsetWidth,
          height: gameAreaRef.current.offsetHeight
        });
      }
    };

    if (isPlaying) {
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }
  }, [isPlaying]);

  const generateCircles = (level: number) => {
    const config = levels[level - 1];
    const newCircles: Circle[] = [];
    
    // Gerar labels
    const labels: string[] = [];
    if (config.type === 'numbers') {
      for (let i = 1; i <= config.count; i++) {
        labels.push(i.toString());
      }
    } else {
      // Mixed: 1-A-2-B-3-C-4-D
      const letters = ['A', 'B', 'C', 'D'];
      for (let i = 0; i < config.count; i++) {
        if (i % 2 === 0) {
          labels.push(Math.floor(i / 2 + 1).toString());
        } else {
          labels.push(letters[Math.floor(i / 2)]);
        }
      }
    }
    
    // Posicionar círculos em PERCENTUAIS (responsivo)
    const minDistance = 15; // Distância mínima em percentual
    const padding = 10; // Padding em percentual
    
    for (let i = 0; i < labels.length; i++) {
      let xPercent, yPercent;
      let attempts = 0;
      let validPosition = false;
      
      while (!validPosition && attempts < 50) {
        xPercent = Math.random() * (100 - padding * 2) + padding;
        yPercent = Math.random() * (100 - padding * 2) + padding;
        
        validPosition = true;
        for (let j = 0; j < newCircles.length; j++) {
          const distance = Math.sqrt(
            Math.pow(xPercent - newCircles[j].xPercent, 2) + 
            Math.pow(yPercent - newCircles[j].yPercent, 2)
          );
          if (distance < minDistance) {
            validPosition = false;
            break;
          }
        }
        attempts++;
      }
      
      newCircles.push({
        id: i,
        label: labels[i],
        xPercent: xPercent || Math.random() * 80 + 10,
        yPercent: yPercent || Math.random() * 80 + 10,
        connected: false
      });
    }
    
    return newCircles;
  };

  const startActivity = () => {
    const newCircles = generateCircles(selectedLevel);
    setCircles(newCircles);
    setIsPlaying(true);
    setCurrentIndex(0);
    setCurrentGameLevel(selectedLevel);
    setConnections([]);
    setErrors(0);
    setTotalErrors(0);
    setStartTime(Date.now());
    setLevelStartTime(Date.now());
    setShowResults(false);
    setJogoIniciado(true);
    setPontuacao(0);
    setLevelsCompleted([]);
    setFeedback('Conecte os círculos em ordem!');
  };

  const nextLevel = () => {
    const nextLevelNum = currentGameLevel + 1;
    
    if (nextLevelNum > 5) {
      // Completou todos os níveis!
      const time = Date.now() - startTime;
      setCompletionTime(time);
      setIsPlaying(false);
      setShowResults(true);
      
      // Calcular pontuação total
      const baseScore = 2000;
      const timeBonus = Math.max(0, 1000 - Math.floor(time / 100));
      const errorPenalty = totalErrors * 50;
      const levelBonus = levelsCompleted.length * 200;
      setPontuacao(baseScore + timeBonus - errorPenalty + levelBonus);
      
      setFeedback('🏆 Todos os níveis completados!');
    } else {
      // Próximo nível
      setCurrentGameLevel(nextLevelNum);
      const newCircles = generateCircles(nextLevelNum);
      setCircles(newCircles);
      setCurrentIndex(0);
      setConnections([]);
      setErrors(0);
      setLevelStartTime(Date.now());
      
      // Mostrar mensagem de transição
      setLevelMessage(`🎉 Nível ${nextLevelNum}!`);
      setShowLevelTransition(true);
      setFeedback(levels[nextLevelNum - 1].description);
      
      setTimeout(() => {
        setShowLevelTransition(false);
        setFeedback('Continue conectando!');
      }, 2500);
    }
  };

  const handleCircleClick = (circle: Circle) => {
    if (!isPlaying || circle.connected) return;
    
    const expectedLabel = circles[currentIndex].label;
    
    if (circle.label === expectedLabel) {
      // Correto!
      const updatedCircles = [...circles];
      updatedCircles[circle.id].connected = true;
      setCircles(updatedCircles);
      setConnections([...connections, circle.id]);
      
      // Som de sucesso
      playSound(true);
      
      if (currentIndex === circles.length - 1) {
        // Completou o nível atual!
        const levelTime = Date.now() - levelStartTime;
        setLevelsCompleted([...levelsCompleted, currentGameLevel]);
        
        // Pontuação do nível
        const levelScore = Math.max(100, 500 - Math.floor(levelTime / 100) - errors * 20);
        setPontuacao(prev => prev + levelScore);
        
        // Feedback e próximo nível
        setFeedback(`✅ Nível ${currentGameLevel} completo!`);
        
        // Aguardar um pouco e ir para próximo nível automaticamente
        setTimeout(() => {
          nextLevel();
        }, 1500);
        
      } else {
        setCurrentIndex(currentIndex + 1);
        setFeedback(`✅ Correto! Próximo: ${circles[currentIndex + 1].label}`);
      }
    } else {
      // Erro!
      setErrors(errors + 1);
      setTotalErrors(totalErrors + 1);
      playSound(false);
      setFeedback(`❌ Errado! Procure: ${expectedLabel}`);
      
      // Feedback visual
      const wrongCircle = document.getElementById(`circle-${circle.id}`);
      if (wrongCircle) {
        wrongCircle.classList.add('animate-shake');
        setTimeout(() => {
          wrongCircle.classList.remove('animate-shake');
        }, 500);
      }
    }
  };

  const playSound = (success: boolean) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = success ? 800 : 300;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Silently fail
    }
  };

  const handleSaveSession = async () => {
    setSalvando(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Erro ao obter usuário:', userError);
        alert('Erro: Sessão expirada. Por favor, faça login novamente.');
        router.push('/login');
        return;
      }
      
      const { data, error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Trilha Numérica',
          pontuacao_final: pontuacao,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!
        
📊 Resultado da Trilha:
- Tempo Total: ${(completionTime / 1000).toFixed(1)}s
- Erros Totais: ${totalErrors}
- Níveis Completados: ${levelsCompleted.length}
- Pontuação: ${pontuacao} pontos`);
        
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error);
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  };

  const voltarInicio = () => {
    setJogoIniciado(false);
    setShowResults(false);
    setIsPlaying(false);
  };

  // Timer para atualizar o tempo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && startTime > 0) {
      interval = setInterval(() => {
        // Força re-render para atualizar o timer
        setStartTime(s => s); // Apenas para forçar atualização
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, startTime]);


  // ==========================================================
  // NOVAS TELAS E COMPONENTES
  // ==========================================================

  const TitleScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-teal-200 via-blue-300 to-cyan-400 overflow-hidden">
      {/* Elementos decorativos de fundo */}
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
            <span className="text-white text-3xl opacity-20">{i % 2 === 0 ? '🔢' : '🔤'}</span>
          </div>
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4">
          <Image 
            src="/images/mascotes/mila/mila_trail.webp" 
            alt="Mascote Mila apontando" 
            width={400} 
            height={400} 
            className="w-[280px] h-auto sm:w-[350px] md:w-[400px] drop-shadow-2xl" 
            priority 
          />
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          Trilha Numérica
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mt-2 mb-8 drop-shadow-md">
         ✏️ Conecte os pontos e agilize a mente! 🧠
        </p>
        
        <button 
          onClick={() => setCurrentScreen('instructions')} 
          className="text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-teal-500 rounded-full px-12 py-5 shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-1"
        >
          Começar
        </button>
      </div>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-cyan-200 to-teal-200">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-blue-600">Como Jogar</h2>
        <div className="text-lg text-gray-700 space-y-6 mb-8 text-left">
          <p className="flex items-center gap-4">
            <span className="text-4xl">🎯</span>
            <span><b>Objetivo:</b> Clique nos círculos na ordem correta, o mais rápido que puder!</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🔢</span>
            <span>Nos primeiros níveis, a sequência é apenas de <b>números (1, 2, 3...)</b>.</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🔤</span>
            <span>No último nível, o desafio aumenta! A sequência alterna entre <b>números e letras (1, A, 2, B...)</b>.</span>
          </p>
          <p className="flex items-center gap-4">
            <span className="text-4xl">🏆</span>
            <span>Complete todos os 5 níveis seguidos para registrar sua pontuação!</span>
          </p>
        </div>
        
        <button 
          onClick={() => setCurrentScreen('game')} 
          className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform"
        >
          Entendi, vamos lá! 🚀
        </button>
      </div>
    </div>
  );
  
  const GameScreen = () => {
     // Componente do Cabeçalho Padrão
    const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }: any) => (
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <button
                        onClick={() => setCurrentScreen('title')} // MUDANÇA: Volta para a tela de título
                        className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6" />
                        <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                    </button>

                    <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                        {icon}
                        <span>{title}</span>
                    </h1>

                    {showSaveButton && onSave ? (
                        <button
                            onClick={onSave}
                            disabled={isSaveDisabled}
                            className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${
                                !isSaveDisabled
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <Save size={18} />
                            <span className="hidden sm:inline">{isSaveDisabled ? 'Salvando...' : 'Salvar'}</span>
                        </button>
                    ) : (
                        <div className="w-24"></div>
                    )}
                </div>
            </div>
        </header>
    );

    return (
        <div className="min-h-screen bg-gray-50">
        <GameHeader 
            title="Trilha Numérica"
            icon="🔢"
            onSave={handleSaveSession}
            isSaveDisabled={salvando}
            showSaveButton={showResults}
        />

        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {!jogoIniciado ? (
            // Tela de seleção de nível (antiga tela inicial)
            <div className="space-y-6">
                {/* Seleção de Nível Inicial */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4 text-center">Selecione o nível para começar a trilha!</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                    {levels.map((level) => (
                    <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`p-3 sm:p-4 rounded-lg font-medium transition-colors ${
                        selectedLevel === level.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                        <div className="text-xl sm:text-2xl mb-1">
                        {level.type === 'mixed' ? '🔤' : '🔢'}
                        </div>
                        <div className="text-xs sm:text-sm">{level.name}</div>
                        <div className="text-xs opacity-80">{level.description}</div>
                    </button>
                    ))}
                </div>
                </div>

                <div className="text-center">
                <button
                    onClick={startActivity}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-colors transform hover:scale-105"
                >
                    🚀 Iniciar Atividade
                </button>
                </div>
            </div>
            ) : !showResults ? (
            // Área de jogo
            <div className="space-y-3 sm:space-y-4">
                {/* Status */}
                <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                    <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-purple-800">
                        Nível {currentGameLevel}/5
                    </div>
                    <div className="text-xs text-purple-600">Fase</div>
                    </div>
                    <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-blue-800">
                        {currentIndex}/{circles.length}
                    </div>
                    <div className="text-xs text-blue-600">Progresso</div>
                    </div>
                    <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-green-800">
                        {circles[currentIndex]?.label || '🏁'}
                    </div>
                    <div className="text-xs text-green-600">Próximo</div>
                    </div>
                    <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-red-800">{totalErrors}</div>
                    <div className="text-xs text-red-600">Erros</div>
                    </div>
                    <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-orange-800">
                        {isPlaying ? Math.floor((Date.now() - startTime) / 1000) : 0}s
                    </div>
                    <div className="text-xs text-orange-600">Tempo</div>
                    </div>
                </div>
                </div>

                {/* Feedback */}
                {feedback && (
                <div className="text-center">
                    <div className="inline-block bg-yellow-400/90 text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-base">
                    {feedback}
                    </div>
                </div>
                )}

                {/* Área do Jogo RESPONSIVA */}
                <div 
                className="bg-white rounded-xl shadow-lg p-2 sm:p-4 relative" 
                style={{ 
                    height: 'calc(100vh - 320px)',
                    minHeight: '350px',
                    maxHeight: '500px'
                }}
                ref={gameAreaRef}
                >
                
                {/* Mensagem de Transição de Nível */}
                {showLevelTransition && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 animate-bounce">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-xl sm:text-3xl shadow-2xl">
                        {levelMessage}
                    </div>
                    </div>
                )}
                
                {/* Linhas conectando círculos */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 1 }}>
                    {connections.map((circleId, index) => {
                    if (index === 0) return null;
                    const prevCircle = circles[connections[index - 1]];
                    const currCircle = circles[circleId];
                    
                    // Converter percentual para pixels baseado no tamanho atual
                    const x1 = (prevCircle.xPercent / 100) * gameAreaDimensions.width;
                    const y1 = (prevCircle.yPercent / 100) * gameAreaDimensions.height;
                    const x2 = (currCircle.xPercent / 100) * gameAreaDimensions.width;
                    const y2 = (currCircle.yPercent / 100) * gameAreaDimensions.height;
                    
                    return (
                        <line
                        key={index}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        />
                    );
                    })}
                </svg>

                {/* Círculos RESPONSIVOS */}
                {circles.map((circle) => {
                    const circleSize = 'w-12 h-12 text-base sm:w-14 sm:h-14 sm:text-lg';
                    
                    return (
                    <button
                        key={circle.id}
                        id={`circle-${circle.id}`}
                        onClick={() => handleCircleClick(circle)}
                        className={`absolute flex items-center justify-center ${circleSize} rounded-full border-3 font-bold
                        transform -translate-x-1/2 -translate-y-1/2 transition-all
                        ${circle.connected 
                            ? 'bg-green-500 text-white border-green-600 scale-90' 
                            : circle.label === circles[currentIndex]?.label
                            ? 'bg-yellow-300 border-yellow-500 animate-pulse scale-110'
                            : 'bg-white border-blue-500 hover:bg-blue-50 hover:scale-105'
                        }`}
                        style={{
                        left: `${circle.xPercent}%`,
                        top: `${circle.yPercent}%`,
                        zIndex: 2
                        }}
                        disabled={circle.connected}
                    >
                        {circle.label}
                    </button>
                    );
                })}
                </div>

                {/* Indicador de níveis completados */}
                <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                    key={level}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                        levelsCompleted.includes(level)
                        ? 'bg-green-500 text-white'
                        : level === currentGameLevel
                        ? 'bg-yellow-400 text-black animate-pulse'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                    >
                    {level}
                    </div>
                ))}
                </div>

                <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translate(-50%, -50%) translateX(0); }
                    25% { transform: translate(-50%, -50%) translateX(-5px); }
                    75% { transform: translate(-50%, -50%) translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                }
                `}</style>
            </div>
            ) : (
            // Tela de resultados
            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8">
                <div className="text-center mb-6">
                <div className="text-5xl sm:text-6xl mb-4">
                    {levelsCompleted.length === 5 ? '🏆' : levelsCompleted.length >= 3 ? '🎉' : '💪'}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    {levelsCompleted.length === 5 ? 'Incrível! Todos os níveis!' : 
                    levelsCompleted.length >= 3 ? 'Muito Bem!' : 'Bom começo!'}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600">
                    {levelsCompleted.length} nível(s) completado(s) em {(completionTime / 1000).toFixed(1)} segundos
                </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold text-blue-800">
                    {(completionTime / 1000).toFixed(1)}s
                    </div>
                    <div className="text-xs text-blue-600">Tempo Total</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold text-red-800">{totalErrors}</div>
                    <div className="text-xs text-red-600">Erros Totais</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold text-green-800">
                    {levelsCompleted.length}/5
                    </div>
                    <div className="text-xs text-green-600">Níveis</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-lg sm:text-xl font-bold text-purple-800">{pontuacao}</div>
                    <div className="text-xs text-purple-600">Pontuação</div>
                </div>
                </div>

                {/* Análise de Desempenho */}
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-6">
                <h4 className="font-bold text-blue-800 mb-2 text-sm sm:text-base">📊 Análise:</h4>
                <div className="text-xs sm:text-sm text-blue-700 space-y-1">
                    <p>• Velocidade: {completionTime < 60000 ? '✅ Excelente' : completionTime < 120000 ? '⚠️ Boa' : '🔴 Precisa melhorar'}</p>
                    <p>• Precisão: {totalErrors <= 3 ? '✅ Ótima' : totalErrors <= 8 ? '⚠️ Boa' : '🔴 Precisa atenção'}</p>
                    <p>• Níveis: {levelsCompleted.includes(5) ? '✅ Completou o desafio misto!' : `Chegou até o nível ${Math.max(0, ...levelsCompleted)}`}</p>
                </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                <button
                    onClick={voltarInicio}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-colors text-sm sm:text-base"
                >
                    🔄 Jogar Novamente
                </button>
                </div>
            </div>
            )}
        </main>
        </div>
    );
  }

  // Renderização condicional das telas
  if (currentScreen === 'title') return <TitleScreen />;
  if (currentScreen === 'instructions') return <InstructionsScreen />;
  return <GameScreen />;
}
