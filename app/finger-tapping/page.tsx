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

// Tipo para os blocos
interface Block {
  id: number;
  offset: number;
  quality: 'perfect' | 'good' | 'poor';
  isSpecial: boolean;
}

export default function FingerTapping() {
  const router = useRouter();
  const supabase = createClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [taps, setTaps] = useState<number[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showResults, setShowResults] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const levels = [
    { id: 1, name: 'Nível 1', duration: 20, description: 'Iniciante (20s)' },
    { id: 2, name: 'Nível 2', duration: 30, description: 'Básico (30s)' },
    { id: 3, name: 'Nível 3', duration: 40, description: 'Intermediário (40s)' },
    { id: 4, name: 'Nível 4', duration: 50, description: 'Avançado (50s)' },
    { id: 5, name: 'Nível 5', duration: 60, description: 'Expert (60s)' }
  ];

  const startActivity = () => {
    const duration = levels[selectedLevel - 1].duration;
    setTimeLeft(duration);
    setIsPlaying(true);
    setTaps([]);
    setBlocks([]);
    setStartTime(Date.now());
    setShowResults(false);
    setJogoIniciado(true);
    setPontuacao(0);
    setCurrentLevel(1);
  };

  const handleTap = () => {
    if (!isPlaying || showResults) return;
    
    const currentTime = Date.now();
    const newTaps = [...taps, currentTime - startTime];
    setTaps(newTaps);
    
    // Calcular qualidade do bloco baseado na consistência
    let offset = 0;
    let quality: 'perfect' | 'good' | 'poor' = 'perfect';
    
    if (newTaps.length > 1) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const lastInterval = newTaps[newTaps.length - 1] - newTaps[newTaps.length - 2];
      const deviation = Math.abs(lastInterval - avgInterval) / avgInterval;
      
      if (deviation < 0.15) {
        quality = 'perfect';
        offset = 0;
        setPontuacao(prev => prev + 30);
      } else if (deviation < 0.3) {
        quality = 'good';
        offset = (Math.random() - 0.5) * 20;
        setPontuacao(prev => prev + 20);
      } else {
        quality = 'poor';
        offset = (Math.random() - 0.5) * 40;
        setPontuacao(prev => prev + 10);
      }
    } else {
      setPontuacao(prev => prev + 30);
    }
    
    // Adicionar novo bloco
    const newBlock: Block = {
      id: newTaps.length,
      offset: offset,
      quality: quality,
      isSpecial: newTaps.length % 10 === 0
    };
    
    setBlocks(prev => [...prev, newBlock]);
    
    // Verificar mudança de nível da torre (a cada 15 blocos)
    if (newTaps.length % 15 === 0 && newTaps.length > 0) {
      setCurrentLevel(prev => prev + 1);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2000);
    }
    
    // Som de construção
    playBuildSound();
  };

  const playBuildSound = () => {
    // Criar som simples de "toc"
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setShowResults(true);
    }
  }, [isPlaying, timeLeft]);

  const calcularMetricas = () => {
    if (taps.length < 2) return { avgInterval: 0, consistency: 0, stability: 0 };
    
    const intervals = [];
    for (let i = 1; i < taps.length; i++) {
      intervals.push(taps[i] - taps[i - 1]);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => 
      sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    const consistency = Math.max(0, 100 - (Math.sqrt(variance) / avgInterval * 100));
    
    // Calcular estabilidade da torre
    const avgOffset = blocks.reduce((sum, block) => sum + Math.abs(block.offset), 0) / blocks.length;
    const stability = Math.max(0, 100 - avgOffset * 2);
    
    return { 
      avgInterval: Math.round(avgInterval), 
      consistency: Math.round(consistency),
      stability: Math.round(stability)
    };
  };

  const metrics = calcularMetricas();

  const handleSaveSession = async () => {
    if (taps.length === 0) {
      alert('Complete pelo menos algumas tentativas antes de salvar.');
      return;
    }

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
          atividade_nome: 'Torre do Ritmo',
          pontuacao_final: pontuacao,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!
        
🏗️ Torre Construída:
- Altura: ${blocks.length} blocos
- Estabilidade: ${metrics.stability}%
- Consistência: ${metrics.consistency}%
- Nível da Torre: ${currentLevel}
- ${pontuacao} pontos`);
        
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

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader 
        title="Torre do Ritmo"
        icon="🏗️"
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
                    Construa a torre mais alta mantendo um ritmo constante de toques.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Toque para adicionar blocos</li>
                    <li>Ritmo constante = torre reta</li>
                    <li>Ritmo irregular = torre torta</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                  <p className="text-sm text-gray-600">
                    Medimos altura, estabilidade e consistência do seu ritmo.
                  </p>
                </div>
              </div>
            </div>

            {/* Seleção de Nível */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Tempo de Construção</h2>
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
                    <div className="text-2xl mb-1">🏗️</div>
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
                🚀 Iniciar Construção
              </button>
            </div>
          </div>
        ) : !showResults ? (
          // Área de jogo - Torre
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-800">{blocks.length}</div>
                  <div className="text-xs text-orange-600">Blocos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-800">{timeLeft}s</div>
                  <div className="text-xs text-blue-600">Tempo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">{currentLevel}</div>
                  <div className="text-xs text-green-600">Nível Torre</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-800">{pontuacao}</div>
                  <div className="text-xs text-purple-600">Pontos</div>
                </div>
              </div>
            </div>

            {/* Área da Torre */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden relative" style={{ height: '500px' }}>
              {/* Mensagem de Level Up */}
              {showLevelUp && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold text-xl animate-bounce">
                    🎉 Nível {currentLevel} Alcançado!
                  </div>
                </div>
              )}
              
              {/* Container da Torre */}
              <div className="absolute bottom-0 left-0 right-0" style={{ height: '450px' }}>
                <div className="relative h-full flex flex-col-reverse items-center">
                  {/* Blocos da Torre */}
                  {blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className={`absolute transition-all duration-300 ${
                        block.isSpecial ? 'animate-pulse' : ''
                      }`}
                      style={{
                        bottom: `${index * 12}px`,
                        left: `calc(50% + ${block.offset}px)`,
                        transform: 'translateX(-50%)',
                        zIndex: blocks.length - index
                      }}
                    >
                      <div
                        className={`w-20 h-10 rounded border-2 ${
                          block.quality === 'perfect' 
                            ? 'bg-green-500 border-green-600' 
                            : block.quality === 'good'
                            ? 'bg-blue-500 border-blue-600'
                            : 'bg-gray-400 border-gray-500'
                        } ${block.isSpecial ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : ''}`}
                        style={{
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                      >
                        {block.isSpecial && (
                          <div className="text-white text-xs font-bold text-center leading-10">
                            ⭐
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Plataforma Base */}
                  <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-gray-800 to-gray-600 border-t-4 border-gray-900">
                    <div className="text-white text-center font-bold leading-12">
                      FUNDAÇÃO
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão de Construir */}
              <button
                onClick={handleTap}
                className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95"
              >
                🔨 ADICIONAR BLOCO
              </button>

              {/* Medidor de Estabilidade */}
              <div className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                <div className="text-xs mb-1">Estabilidade</div>
                <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      metrics.stability > 70 ? 'bg-green-500' : 
                      metrics.stability > 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${metrics.stability}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Tela de resultados
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {blocks.length > 30 ? '🏆' : blocks.length > 20 ? '🎉' : '💪'}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Torre de {blocks.length} blocos!
              </h3>
              
              <p className="text-gray-600">
                {metrics.stability > 70 ? 'Construção muito estável!' : 
                 metrics.stability > 40 ? 'Boa estabilidade!' : 'Torre precisa de mais firmeza!'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-purple-800">{blocks.length}</div>
                <div className="text-xs text-purple-600">Altura Total</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-800">{metrics.stability}%</div>
                <div className="text-xs text-blue-600">Estabilidade</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-800">{metrics.consistency}%</div>
                <div className="text-xs text-green-600">Consistência</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-orange-800">{pontuacao}</div>
                <div className="text-xs text-orange-600">Pontos</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={voltarInicio}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                🔄 Construir Novamente
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
