'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { ChevronLeft, Save } from 'lucide-react';
import { createClient } from '../utils/supabaseClient'

// Componente do Cabeçalho Padrão
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }: any) => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
                <Link
                    href="/dashboard"
                    className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                </Link>

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

interface Circle {
  id: number;
  label: string;
  xPercent: number;  // Mudou para percentual
  yPercent: number;  // Mudou para percentual
  connected: boolean;
}

export default function TrailMaking() {
  const router = useRouter();
  const supabase = createClient();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [connections, setConnections] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [completionTime, setCompletionTime] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameAreaDimensions, setGameAreaDimensions] = useState({ width: 0, height: 0 });

  const levels = [
    { id: 1, name: 'Nível 1', count: 5, type: 'numbers', description: 'Números 1-5' },
    { id: 2, name: 'Nível 2', count: 8, type: 'numbers', description: 'Números 1-8' },
    { id: 3, name: 'Nível 3', count: 12, type: 'numbers', description: 'Números 1-12' },
    { id: 4, name: 'Nível 4', count: 15, type: 'numbers', description: 'Números 1-15' },
    { id: 5, name: 'Nível 5', count: 8, type: 'mixed', description: '1-A-2-B-3-C...' }
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

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
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
    setConnections([]);
    setErrors(0);
    setStartTime(Date.now());
    setShowResults(false);
    setJogoIniciado(true);
    setPontuacao(0);
    setFeedback('Conecte os círculos em ordem!');
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
        // Completou!
        const time = Date.now() - startTime;
        setCompletionTime(time);
        setIsPlaying(false);
        setShowResults(true);
        
        // Calcular pontuação
        const baseScore = 1000;
        const timeBonus = Math.max(0, 500 - Math.floor(time / 100));
        const errorPenalty = errors * 50;
        const levelBonus = selectedLevel * 100;
        setPontuacao(baseScore + timeBonus - errorPenalty + levelBonus);
        
        setFeedback('🎉 Parabéns! Completou!');
      } else {
        setCurrentIndex(currentIndex + 1);
        setFeedback(`✅ Correto! Próximo: ${circles[currentIndex + 1].label}`);
      }
    } else {
      // Erro!
      setErrors(errors + 1);
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
- Tempo: ${(completionTime / 1000).toFixed(1)}s
- Erros: ${errors}
- Nível: ${selectedLevel}
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
        setStartTime(startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, startTime]);

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
          // Tela inicial
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                  <p className="text-sm text-gray-600">
                    Conecte os círculos em ordem sequencial o mais rápido possível.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Clique nos círculos em ordem</li>
                    <li>Números: 1→2→3...</li>
                    <li>Misto: 1→A→2→B...</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                  <p className="text-sm text-gray-600">
                    Medimos velocidade de processamento e flexibilidade cognitiva.
                  </p>
                </div>
              </div>
            </div>

            {/* Seleção de Nível */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`p-4 rounded-lg font-medium transition-colors ${
                      selectedLevel === level.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">
                      {level.type === 'mixed' ? '🔤' : '🔢'}
                    </div>
                    <div className="text-sm">{level.name}</div>
                    <div className="text-xs opacity-80">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startActivity}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                🚀 Iniciar Atividade
              </button>
            </div>
          </div>
        ) : !showResults ? (
          // Área de jogo
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-blue-800">
                    {currentIndex + 1}/{circles.length}
                  </div>
                  <div className="text-xs text-blue-600">Progresso</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-green-800">
                    {circles[currentIndex]?.label}
                  </div>
                  <div className="text-xs text-green-600">Próximo</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-red-800">{errors}</div>
                  <div className="text-xs text-red-600">Erros</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-purple-800">
                    {isPlaying ? Math.floor((Date.now() - startTime) / 1000) : 0}s
                  </div>
                  <div className="text-xs text-purple-600">Tempo</div>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="text-center">
                <div className="inline-block bg-yellow-400/90 text-black px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base">
                  {feedback}
                </div>
              </div>
            )}

            {/* Área do Jogo RESPONSIVA */}
            <div 
              className="bg-white rounded-xl shadow-lg p-2 sm:p-4 relative" 
              style={{ 
                height: window.innerWidth < 640 ? '400px' : '450px',
                minHeight: '350px'
              }}
              ref={gameAreaRef}
            >
              
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
                const isMobile = window.innerWidth < 640;
                const circleSize = isMobile ? 'w-12 h-12 text-base' : 'w-14 h-14 text-lg';
                
                return (
                  <button
                    key={circle.id}
                    id={`circle-${circle.id}`}
                    onClick={() => handleCircleClick(circle)}
                    className={`absolute ${circleSize} rounded-full border-3 font-bold
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
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="text-5xl sm:text-6xl mb-4">
                {errors === 0 ? '🏆' : errors <= 2 ? '🎉' : '💪'}
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {errors === 0 ? 'Perfeito!' : errors <= 2 ? 'Muito Bem!' : 'Completou!'}
              </h3>
              
              <p className="text-gray-600">
                Trilha concluída em {(completionTime / 1000).toFixed(1)} segundos
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-blue-800">
                  {(completionTime / 1000).toFixed(1)}s
                </div>
                <div className="text-xs text-blue-600">Tempo Total</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-red-800">{errors}</div>
                <div className="text-xs text-red-600">Erros</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-green-800">
                  {selectedLevel === 5 ? 'Misto' : `${circles.length} números`}
                </div>
                <div className="text-xs text-green-600">Tipo</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-purple-800">{pontuacao}</div>
                <div className="text-xs text-purple-600">Pontuação</div>
              </div>
            </div>

            {/* Análise de Desempenho */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-blue-800 mb-2">📊 Análise:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Velocidade: {completionTime < 20000 ? '✅ Excelente' : completionTime < 40000 ? '⚠️ Boa' : '🔴 Precisa melhorar'}</p>
                <p>• Precisão: {errors === 0 ? '✅ Perfeita' : errors <= 2 ? '⚠️ Boa' : '🔴 Precisa atenção'}</p>
                <p>• Nível: {selectedLevel === 5 ? '✅ Máximo (Misto)' : `${selectedLevel}/5`}</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={voltarInicio}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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
