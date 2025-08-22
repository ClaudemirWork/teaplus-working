'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { ChevronLeft, Save } from 'lucide-react';
import { createClient } from '../utils/supabaseClient'

// Componente do Cabeçalho Padrão (DENTRO do arquivo)
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

interface Point {
  x: number;
  y: number;
}

interface Shape {
  id: number;
  name: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: Point[];
}

export default function ShapeTracing() {
  const router = useRouter();
  const supabase = createClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userPath, setUserPath] = useState<Point[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [completionTime, setCompletionTime] = useState<number>(0);
  const [accuracy, setAccuracy] = useState(0);
  const [tremor, setTremor] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [completedShapes, setCompletedShapes] = useState<number[]>([]);
  const [shapeScores, setShapeScores] = useState<{accuracy: number, tremor: number, time: number}[]>([]);

  // Formas para cada nível
  const shapes: { [key: number]: Shape[] } = {
    1: [ // Nível 1 - Formas básicas
      { id: 1, name: 'Linha Horizontal', icon: '➖', difficulty: 'easy', 
        points: [{x: 20, y: 50}, {x: 80, y: 50}] },
      { id: 2, name: 'Linha Vertical', icon: '|', difficulty: 'easy',
        points: [{x: 50, y: 20}, {x: 50, y: 80}] },
      { id: 3, name: 'Diagonal', icon: '/', difficulty: 'easy',
        points: [{x: 20, y: 80}, {x: 80, y: 20}] },
    ],
    2: [ // Nível 2 - Formas geométricas
      { id: 4, name: 'Círculo', icon: '⭕', difficulty: 'medium',
        points: generateCirclePoints(50, 50, 30, 20) },
      { id: 5, name: 'Quadrado', icon: '⬜', difficulty: 'medium',
        points: [{x: 25, y: 25}, {x: 75, y: 25}, {x: 75, y: 75}, {x: 25, y: 75}, {x: 25, y: 25}] },
      { id: 6, name: 'Triângulo', icon: '🔺', difficulty: 'medium',
        points: [{x: 50, y: 20}, {x: 80, y: 70}, {x: 20, y: 70}, {x: 50, y: 20}] },
    ],
    3: [ // Nível 3 - Formas complexas
      { id: 7, name: 'Estrela', icon: '⭐', difficulty: 'hard',
        points: generateStarPoints(50, 50, 30, 15, 5) },
      { id: 8, name: 'Coração', icon: '❤️', difficulty: 'hard',
        points: generateHeartPoints(50, 50, 25) },
      { id: 9, name: 'Onda', icon: '〰️', difficulty: 'hard',
        points: generateWavePoints() },
    ]
  };

  // Funções auxiliares para gerar pontos de formas
  function generateCirclePoints(cx: number, cy: number, radius: number, segments: number): Point[] {
    const points: Point[] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
      });
    }
    return points;
  }

  function generateStarPoints(cx: number, cy: number, outerRadius: number, innerRadius: number, points: number): Point[] {
    const result: Point[] = [];
    const angle = Math.PI / points;
    for (let i = 0; i < 2 * points; i++) {
      const r = i & 1 ? innerRadius : outerRadius;
      result.push({
        x: cx + Math.cos(i * angle - Math.PI / 2) * r,
        y: cy + Math.sin(i * angle - Math.PI / 2) * r
      });
    }
    result.push(result[0]); // Fechar a estrela
    return result;
  }

  function generateHeartPoints(cx: number, cy: number, size: number): Point[] {
    const points: Point[] = [];
    for (let t = 0; t <= Math.PI * 2; t += 0.1) {
      const x = cx + size * (16 * Math.pow(Math.sin(t), 3)) / 16;
      const y = cy - size * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) / 16;
      points.push({x, y});
    }
    return points;
  }

  function generateWavePoints(): Point[] {
    const points: Point[] = [];
    for (let x = 10; x <= 90; x += 2) {
      const y = 50 + Math.sin((x - 10) * Math.PI / 20) * 20;
      points.push({x, y});
    }
    return points;
  }

  const levels = [
    { id: 1, name: 'Básico', description: 'Linhas simples', icon: '📐' },
    { id: 2, name: 'Intermediário', description: 'Formas geométricas', icon: '📏' },
    { id: 3, name: 'Avançado', description: 'Formas complexas', icon: '🎨' }
  ];

  const startActivity = () => {
    setJogoIniciado(true);
    setCurrentShapeIndex(0);
    setCompletedShapes([]);
    setShapeScores([]);
    setPontuacao(0);
    setStartTime(Date.now());
    setShowResults(false);
    drawShape();
  };

  const drawShape = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const currentShape = shapes[selectedLevel][currentShapeIndex];
    if (!currentShape) return;

    // Converter percentuais para pixels
    const points = currentShape.points.map(p => ({
      x: (p.x / 100) * canvas.width,
      y: (p.y / 100) * canvas.height
    }));

    // Desenhar forma guia (linha pontilhada)
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Desenhar ponto inicial
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Desenhar ponto final
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(points[points.length - 1].x, points[points.length - 1].y, 10, 0, Math.PI * 2);
    ctx.fill();

    setFeedback('Comece no ponto verde e termine no vermelho!');
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const point = 'touches' in e ? 
      { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top } :
      { x: e.clientX - rect.left, y: e.clientY - rect.top };

    setIsDrawing(true);
    setUserPath([point]);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const point = 'touches' in e ? 
      { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top } :
      { x: e.clientX - rect.left, y: e.clientY - rect.top };

    setUserPath(prev => [...prev, point]);

    // Desenhar linha do usuário
    const ctx = canvas.getContext('2d');
    if (!ctx || userPath.length === 0) return;

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(userPath[userPath.length - 1].x, userPath[userPath.length - 1].y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const handleEnd = () => {
    if (!isDrawing || userPath.length < 2) return;
    
    setIsDrawing(false);
    analyzeDrawing();
  };

  const analyzeDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentShape = shapes[selectedLevel][currentShapeIndex];
    const targetPoints = currentShape.points.map(p => ({
      x: (p.x / 100) * canvas.width,
      y: (p.y / 100) * canvas.height
    }));

    // Calcular precisão (distância média dos pontos)
    let totalDistance = 0;
    let matchedPoints = 0;

    userPath.forEach(userPoint => {
      let minDistance = Infinity;
      targetPoints.forEach(targetPoint => {
        const dist = Math.sqrt(
          Math.pow(userPoint.x - targetPoint.x, 2) + 
          Math.pow(userPoint.y - targetPoint.y, 2)
        );
        minDistance = Math.min(minDistance, dist);
      });
      if (minDistance < 50) matchedPoints++;
      totalDistance += minDistance;
    });

    const accuracyScore = Math.max(0, Math.min(100, 100 - (totalDistance / userPath.length)));
    
    // Calcular tremor (variação na suavidade)
    let tremorScore = 0;
    for (let i = 2; i < userPath.length; i++) {
      const angle1 = Math.atan2(
        userPath[i-1].y - userPath[i-2].y,
        userPath[i-1].x - userPath[i-2].x
      );
      const angle2 = Math.atan2(
        userPath[i].y - userPath[i-1].y,
        userPath[i].x - userPath[i-1].x
      );
      tremorScore += Math.abs(angle2 - angle1);
    }
    tremorScore = Math.max(0, Math.min(100, 100 - tremorScore * 10));

    // Salvar resultados da forma
    const shapeTime = (Date.now() - startTime) / 1000;
    setShapeScores(prev => [...prev, {
      accuracy: Math.round(accuracyScore),
      tremor: Math.round(tremorScore),
      time: shapeTime
    }]);

    // Feedback
    if (accuracyScore > 80) {
      setFeedback('🎉 Excelente! Muito preciso!');
      playSound(true);
    } else if (accuracyScore > 60) {
      setFeedback('👍 Bom trabalho! Continue assim!');
      playSound(true);
    } else {
      setFeedback('💪 Tente seguir mais de perto a linha!');
      playSound(false);
    }

    // Próxima forma ou finalizar
    setTimeout(() => {
      if (currentShapeIndex < shapes[selectedLevel].length - 1) {
        setCurrentShapeIndex(prev => prev + 1);
        setUserPath([]);
        drawShape();
      } else {
        finishActivity();
      }
    }, 2000);
  };

  const finishActivity = () => {
    const totalTime = (Date.now() - startTime) / 1000;
    setCompletionTime(totalTime);
    
    // Calcular médias
    const avgAccuracy = shapeScores.reduce((sum, s) => sum + s.accuracy, 0) / shapeScores.length;
    const avgTremor = shapeScores.reduce((sum, s) => sum + s.tremor, 0) / shapeScores.length;
    
    setAccuracy(Math.round(avgAccuracy));
    setTremor(Math.round(avgTremor));
    
    // Pontuação final
    const score = Math.round((avgAccuracy * 0.6 + avgTremor * 0.4) * 10);
    setPontuacao(score);
    
    setShowResults(true);
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
          atividade_nome: 'Traçado de Formas',
          pontuacao_final: pontuacao,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!
        
✏️ Resultado do Traçado:
- Precisão: ${accuracy}%
- Controle Motor: ${tremor}%
- Tempo Total: ${completionTime.toFixed(1)}s
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
    setCurrentShapeIndex(0);
    setUserPath([]);
  };

  // Redimensionar canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      if (jogoIniciado && !showResults) {
        drawShape();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [jogoIniciado, currentShapeIndex, showResults]);

  // Redesenhar quando mudar de forma
  useEffect(() => {
    if (jogoIniciado && !showResults) {
      drawShape();
    }
  }, [currentShapeIndex]);

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader 
        title="Traçado de Formas"
        icon="✏️"
        onSave={handleSaveSession}
        isSaveDisabled={salvando}
        showSaveButton={showResults}
      />

      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {!jogoIniciado ? (
          // Tela inicial
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">🎯 Objetivo:</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Trace as formas seguindo as linhas guia com precisão.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>Comece no ponto verde</li>
                    <li>Siga a linha pontilhada</li>
                    <li>Termine no ponto vermelho</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">⭐ Avaliação:</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Medimos precisão, controle motor e tempo de execução.
                  </p>
                </div>
              </div>
            </div>

            {/* Seleção de Nível */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    <div className="text-2xl mb-1">{level.icon}</div>
                    <div className="text-sm">{level.name}</div>
                    <div className="text-xs opacity-80">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startActivity}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-colors"
              >
                🚀 Iniciar Atividade
              </button>
            </div>
          </div>
        ) : !showResults ? (
          // Área de desenho
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-blue-800">
                    {shapes[selectedLevel][currentShapeIndex].name}
                  </div>
                  <div className="text-xs text-blue-600">Forma Atual</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-green-800">
                    {currentShapeIndex + 1}/{shapes[selectedLevel].length}
                  </div>
                  <div className="text-xs text-green-600">Progresso</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">
                    {shapes[selectedLevel][currentShapeIndex].icon}
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="text-center">
                <div className="inline-block bg-yellow-400/90 text-black px-4 py-2 rounded-lg font-bold text-sm sm:text-base">
                  {feedback}
                </div>
              </div>
            )}

            {/* Canvas de desenho */}
            <div 
              ref={containerRef}
              className="bg-white rounded-xl shadow-lg p-4 relative"
              style={{ height: window.innerWidth < 640 ? '350px' : '450px' }}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-crosshair touch-none"
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
              />
            </div>

            {/* Indicador de formas */}
            <div className="flex justify-center gap-2">
              {shapes[selectedLevel].map((shape, index) => (
                <div
                  key={shape.id}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${index < currentShapeIndex ? 'bg-green-500' :
                      index === currentShapeIndex ? 'bg-yellow-400 animate-pulse' :
                      'bg-gray-300'}`}
                >
                  {shape.icon}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Tela de resultados
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="text-5xl sm:text-6xl mb-4">
                {accuracy > 80 ? '🏆' : accuracy > 60 ? '🎉' : '💪'}
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {accuracy > 80 ? 'Excelente Precisão!' : 
                 accuracy > 60 ? 'Muito Bem!' : 'Continue Praticando!'}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600">
                Você completou todas as formas do nível {selectedLevel}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-blue-800">
                  {accuracy}%
                </div>
                <div className="text-xs text-blue-600">Precisão</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-green-800">
                  {tremor}%
                </div>
                <div className="text-xs text-green-600">Controle Motor</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-purple-800">
                  {completionTime.toFixed(1)}s
                </div>
                <div className="text-xs text-purple-600">Tempo Total</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-orange-800">{pontuacao}</div>
                <div className="text-xs text-orange-600">Pontuação</div>
              </div>
            </div>

            {/* Detalhes por forma */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">📊 Desempenho por Forma:</h4>
              <div className="space-y-2">
                {shapes[selectedLevel].map((shape, index) => {
                  const score = shapeScores[index];
                  if (!score) return null;
                  return (
                    <div key={shape.id} className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{shape.icon}</span>
                        {shape.name}
                      </span>
                      <span className="text-gray-600">
                        Precisão: {score.accuracy}% | Tremor: {score.tremor}%
                      </span>
                    </div>
                  );
                })}
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
