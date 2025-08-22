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

interface Point {
  x: number;
  y: number;
}

interface CurveSegment {
  type: 'line' | 'curve';
  points: Point[];
  controlPoints?: Point[]; // Para curvas Bézier
}

interface Shape {
  id: number;
  name: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  segments: CurveSegment[];
}

export default function ShapeTracing() {
  const router = useRouter();
  const supabase = createClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userPath, setUserPath] = useState<Point[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [completionTime, setCompletionTime] = useState<number>(0);
  const [totalAccuracy, setTotalAccuracy] = useState(0);
  const [totalTremor, setTotalTremor] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [levelScores, setLevelScores] = useState<{level: number, accuracy: number, tremor: number}[]>([]);
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [levelMessage, setLevelMessage] = useState('');
  const [totalShapesCompleted, setTotalShapesCompleted] = useState(0);

  // Formas com CURVAS para cada nível
  const allShapes: { [key: number]: Shape[] } = {
    1: [ // Nível 1 - Linhas simples
      { 
        id: 1, name: 'Linha Horizontal', icon: '➖', difficulty: 'easy',
        segments: [{
          type: 'line',
          points: [{x: 20, y: 50}, {x: 80, y: 50}]
        }]
      },
      { 
        id: 2, name: 'Linha Vertical', icon: '|', difficulty: 'easy',
        segments: [{
          type: 'line',
          points: [{x: 50, y: 20}, {x: 50, y: 80}]
        }]
      },
      { 
        id: 3, name: 'Diagonal', icon: '/', difficulty: 'easy',
        segments: [{
          type: 'line',
          points: [{x: 20, y: 80}, {x: 80, y: 20}]
        }]
      },
    ],
    2: [ // Nível 2 - Introdução às curvas
      { 
        id: 4, name: 'Arco Simples', icon: '⌒', difficulty: 'medium',
        segments: [{
          type: 'curve',
          points: [{x: 20, y: 50}, {x: 80, y: 50}],
          controlPoints: [{x: 50, y: 20}]
        }]
      },
      { 
        id: 5, name: 'Onda Suave', icon: '〰️', difficulty: 'medium',
        segments: [{
          type: 'curve',
          points: [{x: 20, y: 50}, {x: 50, y: 50}, {x: 80, y: 50}],
          controlPoints: [{x: 35, y: 30}, {x: 65, y: 70}]
        }]
      },
      { 
        id: 6, name: 'Círculo', icon: '⭕', difficulty: 'medium',
        segments: [
          {
            type: 'curve',
            points: [{x: 50, y: 20}, {x: 80, y: 50}, {x: 50, y: 80}, {x: 20, y: 50}, {x: 50, y: 20}],
            controlPoints: [
              {x: 70, y: 20}, {x: 80, y: 30},
              {x: 80, y: 70}, {x: 70, y: 80},
              {x: 30, y: 80}, {x: 20, y: 70},
              {x: 20, y: 30}, {x: 30, y: 20}
            ]
          }
        ]
      },
    ],
    3: [ // Nível 3 - Formas complexas
      { 
        id: 7, name: 'Espiral', icon: '🌀', difficulty: 'hard',
        segments: [{
          type: 'curve',
          points: generateSpiralPoints(),
          controlPoints: generateSpiralControlPoints()
        }]
      },
      { 
        id: 8, name: 'Coração', icon: '❤️', difficulty: 'hard',
        segments: [{
          type: 'curve',
          points: [
            {x: 50, y: 75}, {x: 20, y: 35}, {x: 30, y: 20}, {x: 50, y: 35},
            {x: 70, y: 20}, {x: 80, y: 35}, {x: 50, y: 75}
          ],
          controlPoints: [
            {x: 35, y: 65}, {x: 10, y: 45},
            {x: 20, y: 15}, {x: 40, y: 15},
            {x: 60, y: 15}, {x: 80, y: 15},
            {x: 90, y: 45}, {x: 65, y: 65}
          ]
        }]
      },
      { 
        id: 9, name: 'Estrela', icon: '⭐', difficulty: 'hard',
        segments: generateStarSegments()
      },
    ],
    4: [ // Nível 4 - Misto de retas e curvas
      { 
        id: 10, name: 'Casa', icon: '🏠', difficulty: 'hard',
        segments: [
          { type: 'line', points: [{x: 30, y: 70}, {x: 30, y: 50}] },
          { type: 'line', points: [{x: 30, y: 50}, {x: 50, y: 30}] },
          { type: 'line', points: [{x: 50, y: 30}, {x: 70, y: 50}] },
          { type: 'line', points: [{x: 70, y: 50}, {x: 70, y: 70}] },
          { type: 'line', points: [{x: 70, y: 70}, {x: 30, y: 70}] },
        ]
      },
      { 
        id: 11, name: 'Flor', icon: '🌸', difficulty: 'hard',
        segments: generateFlowerSegments()
      },
      { 
        id: 12, name: 'Infinito', icon: '♾️', difficulty: 'hard',
        segments: [{
          type: 'curve',
          points: generateInfinityPoints(),
          controlPoints: generateInfinityControlPoints()
        }]
      },
    ],
    5: [ // Nível 5 - Desafio máximo
      { 
        id: 13, name: 'Mandala Simples', icon: '🔆', difficulty: 'hard',
        segments: generateMandalaSegments()
      },
      { 
        id: 14, name: 'Borboleta', icon: '🦋', difficulty: 'hard',
        segments: generateButterflySegments()
      },
      { 
        id: 15, name: 'Labirinto', icon: '🌐', difficulty: 'hard',
        segments: generateMazeSegments()
      },
    ]
  };

  // Funções para gerar formas complexas
  function generateSpiralPoints(): Point[] {
    const points: Point[] = [];
    const centerX = 50, centerY = 50;
    let radius = 5;
    
    for (let angle = 0; angle < Math.PI * 6; angle += Math.PI / 8) {
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
      radius += 1.5;
    }
    return points;
  }

  function generateSpiralControlPoints(): Point[] {
    const points = generateSpiralPoints();
    const controls: Point[] = [];
    
    for (let i = 0; i < points.length - 1; i++) {
      const midX = (points[i].x + points[i + 1].x) / 2;
      const midY = (points[i].y + points[i + 1].y) / 2;
      controls.push({ x: midX + (Math.random() - 0.5) * 5, y: midY + (Math.random() - 0.5) * 5 });
    }
    return controls;
  }

  function generateStarSegments(): CurveSegment[] {
    const segments: CurveSegment[] = [];
    const cx = 50, cy = 50;
    const outerRadius = 30, innerRadius = 15;
    const points: Point[] = [];
    
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      points.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
      });
    }
    points.push(points[0]); // Fechar estrela
    
    segments.push({ type: 'line', points });
    return segments;
  }

  function generateFlowerSegments(): CurveSegment[] {
    const segments: CurveSegment[] = [];
    const cx = 50, cy = 50;
    
    // Centro da flor
    segments.push({
      type: 'curve',
      points: [{x: cx - 5, y: cy}, {x: cx, y: cy - 5}, {x: cx + 5, y: cy}, {x: cx, y: cy + 5}, {x: cx - 5, y: cy}],
      controlPoints: [
        {x: cx - 5, y: cy - 5}, {x: cx + 5, y: cy - 5},
        {x: cx + 5, y: cy + 5}, {x: cx - 5, y: cy + 5}
      ]
    });
    
    // Pétalas
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const petalX = cx + Math.cos(angle) * 20;
      const petalY = cy + Math.sin(angle) * 20;
      
      segments.push({
        type: 'curve',
        points: [{x: cx, y: cy}, {x: petalX, y: petalY}, {x: cx, y: cy}],
        controlPoints: [
          {x: cx + Math.cos(angle - 0.3) * 15, y: cy + Math.sin(angle - 0.3) * 15},
          {x: cx + Math.cos(angle + 0.3) * 15, y: cy + Math.sin(angle + 0.3) * 15}
        ]
      });
    }
    
    return segments;
  }

  function generateInfinityPoints(): Point[] {
    const points: Point[] = [];
    for (let t = 0; t <= Math.PI * 2; t += Math.PI / 16) {
      const x = 50 + 25 * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
      const y = 50 + 25 * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
      points.push({x, y});
    }
    return points;
  }

  function generateInfinityControlPoints(): Point[] {
    const points = generateInfinityPoints();
    return points.map((p, i) => ({
      x: p.x + (Math.random() - 0.5) * 3,
      y: p.y + (Math.random() - 0.5) * 3
    }));
  }

  function generateMandalaSegments(): CurveSegment[] {
    const segments: CurveSegment[] = [];
    const cx = 50, cy = 50;
    
    // Círculos concêntricos
    for (let r = 10; r <= 30; r += 10) {
      const points: Point[] = [];
      for (let angle = 0; angle <= Math.PI * 2; angle += Math.PI / 8) {
        points.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r
        });
      }
      segments.push({ type: 'curve', points, controlPoints: [] });
    }
    
    return segments;
  }

  function generateButterflySegments(): CurveSegment[] {
    return [{
      type: 'curve',
      points: [
        {x: 50, y: 50}, {x: 30, y: 30}, {x: 25, y: 40}, {x: 30, y: 50},
        {x: 50, y: 50}, {x: 70, y: 30}, {x: 75, y: 40}, {x: 70, y: 50},
        {x: 50, y: 50}
      ],
      controlPoints: []
    }];
  }

  function generateMazeSegments(): CurveSegment[] {
    const segments: CurveSegment[] = [];
    
    // Padrão de labirinto simples
    segments.push({ type: 'line', points: [{x: 20, y: 20}, {x: 80, y: 20}] });
    segments.push({ type: 'line', points: [{x: 80, y: 20}, {x: 80, y: 40}] });
    segments.push({ type: 'line', points: [{x: 80, y: 40}, {x: 40, y: 40}] });
    segments.push({ type: 'line', points: [{x: 40, y: 40}, {x: 40, y: 60}] });
    segments.push({ type: 'line', points: [{x: 40, y: 60}, {x: 60, y: 60}] });
    segments.push({ type: 'line', points: [{x: 60, y: 60}, {x: 60, y: 80}] });
    segments.push({ type: 'line', points: [{x: 60, y: 80}, {x: 20, y: 80}] });
    
    return segments;
  }

  const startActivity = () => {
    setJogoIniciado(true);
    setCurrentLevel(1);
    setCurrentShapeIndex(0);
    setCompletedLevels([]);
    setLevelScores([]);
    setPontuacao(0);
    setStartTime(Date.now());
    setShowResults(false);
    setTotalShapesCompleted(0);
    drawShape();
    setFeedback('Comece no ponto verde!');
  };

  const drawShape = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const currentShape = allShapes[currentLevel][currentShapeIndex];
    if (!currentShape) return;

    // Desenhar cada segmento
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    
    currentShape.segments.forEach(segment => {
      ctx.beginPath();
      
      if (segment.type === 'line') {
        // Linhas retas
        const points = segment.points.map(p => ({
          x: (p.x / 100) * canvas.width,
          y: (p.y / 100) * canvas.height
        }));
        
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      } else if (segment.type === 'curve' && segment.controlPoints) {
        // Curvas Bézier
        const points = segment.points.map(p => ({
          x: (p.x / 100) * canvas.width,
          y: (p.y / 100) * canvas.height
        }));
        const controls = segment.controlPoints.map(p => ({
          x: (p.x / 100) * canvas.width,
          y: (p.y / 100) * canvas.height
        }));
        
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 0; i < points.length - 1; i++) {
          if (controls[i]) {
            ctx.quadraticCurveTo(
              controls[i].x, controls[i].y,
              points[i + 1].x, points[i + 1].y
            );
          } else {
            ctx.lineTo(points[i + 1].x, points[i + 1].y);
          }
        }
      }
      
      ctx.stroke();
    });
    
    ctx.setLineDash([]);

    // Desenhar pontos inicial e final
    const firstSegment = currentShape.segments[0];
    const lastSegment = currentShape.segments[currentShape.segments.length - 1];
    
    const startPoint = {
      x: (firstSegment.points[0].x / 100) * canvas.width,
      y: (firstSegment.points[0].y / 100) * canvas.height
    };
    const endPoint = {
      x: (lastSegment.points[lastSegment.points.length - 1].x / 100) * canvas.width,
      y: (lastSegment.points[lastSegment.points.length - 1].y / 100) * canvas.height
    };

    // Ponto inicial (verde)
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Ponto final (vermelho)
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(endPoint.x, endPoint.y, 10, 0, Math.PI * 2);
    ctx.fill();
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

    // Calcular precisão
    const accuracy = Math.random() * 30 + 70; // Simulação - implementar cálculo real
    const tremor = Math.random() * 30 + 70;
    
    // Feedback
    if (accuracy > 80) {
      setFeedback('🎉 Excelente!');
      playSound(true);
    } else if (accuracy > 60) {
      setFeedback('👍 Bom trabalho!');
      playSound(true);
    } else {
      setFeedback('💪 Continue tentando!');
      playSound(false);
    }

    // Atualizar pontuação
    const shapeScore = Math.round((accuracy + tremor) / 2);
    setPontuacao(prev => prev + shapeScore);
    setTotalShapesCompleted(prev => prev + 1);

    // Próxima forma ou próximo nível
    setTimeout(() => {
      if (currentShapeIndex < allShapes[currentLevel].length - 1) {
        // Próxima forma no mesmo nível
        setCurrentShapeIndex(prev => prev + 1);
        setUserPath([]);
        drawShape();
        setFeedback('Continue traçando!');
      } else {
        // Completou o nível
        completedLevel(accuracy, tremor);
      }
    }, 1500);
  };

  const completedLevel = (accuracy: number, tremor: number) => {
    setCompletedLevels(prev => [...prev, currentLevel]);
    setLevelScores(prev => [...prev, {
      level: currentLevel,
      accuracy: Math.round(accuracy),
      tremor: Math.round(tremor)
    }]);

    if (currentLevel < 5) {
      // Avançar para próximo nível
      setLevelMessage(`🎉 Nível ${currentLevel} Completo!`);
      setShowLevelTransition(true);
      
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setCurrentShapeIndex(0);
        setUserPath([]);
        setShowLevelTransition(false);
        drawShape();
        setFeedback(`Nível ${currentLevel + 1} - Vamos lá!`);
      }, 2500);
    } else {
      // Completou todos os níveis
      finishActivity();
    }
  };

  const finishActivity = () => {
    const totalTime = (Date.now() - startTime) / 1000;
    setCompletionTime(totalTime);
    
    // Calcular médias
    const avgAccuracy = levelScores.reduce((sum, s) => sum + s.accuracy, 0) / levelScores.length;
    const avgTremor = levelScores.reduce((sum, s) => sum + s.tremor, 0) / levelScores.length;
    
    setTotalAccuracy(Math.round(avgAccuracy));
    setTotalTremor(Math.round(avgTremor));
    
    setShowResults(true);
    setFeedback('🏆 Parabéns! Todos os níveis completos!');
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
- Níveis Completados: ${completedLevels.length}/5
- Formas Traçadas: ${totalShapesCompleted}
- Precisão Média: ${totalAccuracy}%
- Controle Motor: ${totalTremor}%
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
    setCurrentLevel(1);
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
      
      if (jogoIniciado && !showResults && !showLevelTransition) {
        drawShape();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [jogoIniciado, currentShapeIndex, showResults, currentLevel, showLevelTransition]);

  // Redesenhar quando mudar de forma ou nível
  useEffect(() => {
    if (jogoIniciado && !showResults && !showLevelTransition) {
      drawShape();
    }
  }, [currentShapeIndex, currentLevel]);

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
                    Trace formas progredindo por 5 níveis automaticamente!
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>Comece no ponto verde</li>
                    <li>Siga linhas e curvas</li>
                    <li>Avança sozinho!</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">⭐ Níveis:</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    1-2: Linhas | 3-4: Curvas | 5: Desafio!
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startActivity}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-colors"
              >
                🚀 Iniciar Jornada Completa
              </button>
              <p className="text-sm text-gray-600 mt-2">5 níveis progressivos sem parar!</p>
            </div>
          </div>
        ) : !showResults ? (
          // Área de desenho
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-purple-800">
                    Nível {currentLevel}/5
                  </div>
                  <div className="text-xs text-purple-600">Fase</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-blue-800">
                    {allShapes[currentLevel][currentShapeIndex].name}
                  </div>
                  <div className="text-xs text-blue-600">Forma Atual</div>
                </div>
                <div className="text-center">
                  <div className="text-base sm:text-xl font-bold text-green-800">
                    {currentShapeIndex + 1}/{allShapes[currentLevel].length}
                  </div>
                  <div className="text-xs text-green-600">Progresso</div>
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
              {/* Mensagem de transição de nível */}
              {showLevelTransition && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-20">
                  <div className="text-center animate-bounce">
                    <div className="text-4xl sm:text-6xl mb-2">🎉</div>
                    <div className="text-xl sm:text-3xl font-bold text-blue-600">
                      {levelMessage}
                    </div>
                  </div>
                </div>
              )}
              
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

            {/* Indicador de níveis */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold
                    ${completedLevels.includes(level) ? 'bg-green-500 text-white' :
                      level === currentLevel ? 'bg-yellow-400 text-black animate-pulse' :
                      'bg-gray-300 text-gray-600'}`}
                >
                  {level}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Tela de resultados
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="text-5xl sm:text-6xl mb-4">
                {completedLevels.length === 5 ? '🏆' : 
                 completedLevels.length >= 3 ? '🎉' : '💪'}
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {completedLevels.length === 5 ? 'Mestre do Traçado!' : 
                 completedLevels.length >= 3 ? 'Muito Bem!' : 'Bom Começo!'}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600">
                {completedLevels.length} níveis completos | {totalShapesCompleted} formas traçadas
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-blue-800">
                  {totalAccuracy}%
                </div>
                <div className="text-xs text-blue-600">Precisão</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-green-800">
                  {totalTremor}%
                </div>
                <div className="text-xs text-green-600">Controle</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-purple-800">
                  {completionTime.toFixed(1)}s
                </div>
                <div className="text-xs text-purple-600">Tempo</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-xl font-bold text-orange-800">{pontuacao}</div>
                <div className="text-xs text-orange-600">Pontuação</div>
              </div>
            </div>

            {/* Detalhes por nível */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">📊 Progresso por Nível:</h4>
              <div className="space-y-2">
                {levelScores.map((score) => (
                  <div key={score.level} className="flex items-center justify-between text-xs sm:text-sm">
                    <span>Nível {score.level}</span>
                    <span className="text-gray-600">
                      Precisão: {score.accuracy}% | Controle: {score.tremor}%
                    </span>
                  </div>
                ))}
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
