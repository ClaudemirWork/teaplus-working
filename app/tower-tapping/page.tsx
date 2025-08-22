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
  const [currentTowerLevel, setCurrentTowerLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [targetInterval, setTargetInterval] = useState<number | null>(null);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);

  const levels = [
    { id: 1, name: 'Nível 1', duration: 30, description: 'Iniciante (30s)' },
    { id: 2, name: 'Nível 2', duration: 40, description: 'Básico (40s)' },
    { id: 3, name: 'Nível 3', duration: 50, description: 'Intermediário (50s)' },
    { id: 4, name: 'Nível 4', duration: 60, description: 'Avançado (60s)' },
    { id: 5, name: 'Nível 5', duration: 90, description: 'Expert (90s)' }
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
    setCurrentTowerLevel(1);
    setTargetInterval(null);
    setLastTapTime(null);
    setMotivationalMessage('Comece a construir!');
  };

  const showMotivation = (message: string) => {
    setMotivationalMessage(message);
    setTimeout(() => {
      if (isPlaying) {
        setMotivationalMessage('');
      }
    }, 2000);
  };

  const handleTap = () => {
    if (!isPlaying || showResults) return;
    
    const currentTime = Date.now();
    const tapTime = currentTime - startTime;
    const newTaps = [...taps, tapTime];
    setTaps(newTaps);
    
    // Calcular intervalo desde último toque
    let currentInterval = 0;
    if (lastTapTime !== null) {
      currentInterval = currentTime - lastTapTime;
    }
    setLastTapTime(currentTime);
    
    // Estabelecer ritmo alvo após 3 toques
    if (newTaps.length === 3 && targetInterval === null) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      setTargetInterval(avgInterval);
      showMotivation('Ritmo estabelecido! Mantenha!');
    }
    
    // Calcular qualidade do bloco
    let offset = 0;
    let quality: 'perfect' | 'good' | 'poor' = 'perfect';
    
    if (targetInterval && currentInterval > 0) {
      const deviation = Math.abs(currentInterval - targetInterval) / targetInterval;
      
      if (deviation < 0.15) {
        quality = 'perfect';
        offset = (Math.random() - 0.5) * 5; // Muito pequeno
        setPontuacao(prev => prev + 30);
        if (newTaps.length % 5 === 0) showMotivation('🔥 Ritmo Perfeito!');
      } else if (deviation < 0.3) {
        quality = 'good';
        offset = (Math.random() - 0.5) * 30;
        setPontuacao(prev => prev + 20);
        if (currentInterval < targetInterval) {
          showMotivation('⚡ Muito rápido!');
        } else {
          showMotivation('🐌 Acelere um pouco!');
        }
      } else {
        quality = 'poor';
        offset = (Math.random() - 0.5) * 60;
        setPontuacao(prev => prev + 10);
        showMotivation('⚠️ Ajuste o ritmo!');
      }
    } else {
      // Primeiros toques sempre centralizados
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
    
    // Mudança de nível da torre a cada 15 blocos
    if (newTaps.length % 15 === 0 && newTaps.length > 0) {
      const newLevel = Math.floor(newTaps.length / 15) + 1;
      setCurrentTowerLevel(newLevel);
      setShowLevelUp(true);
      showMotivation(`🎉 Torre Nível ${newLevel}!`);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    
    // Som de construção
    playBuildSound();
  };

  const playBuildSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 600;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {
      // Silently fail if audio doesn't work
    }
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setShowResults(true);
      setMotivationalMessage('');
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
- Nível da Torre: ${currentTowerLevel}
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
                    Construa uma torre mantendo ritmo constante. Torre reta = ritmo bom!
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Toque no botão com ritmo constante</li>
                    <li>Blocos alinhados = ritmo bom</li>
                    <li>Blocos tortos = ajuste o ritmo</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                  <p className="text-sm text-gray-600">
                    A cada 15 blocos você sobe de nível. Mantenha o ritmo para pontos extras!
                  </p>
                </div>
              </div>
            </div>

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
          // Área de jogo - Torre CORRIGIDA
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
                  <div className="text-2xl font-bold text-green-800">{currentTowerLevel}</div>
                  <div className="text-xs text-green-600">Nível Torre</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-800">{pontuacao}</div>
                  <div className="text-xs text-purple-600">Pontos</div>
                </div>
              </div>
            </div>

            {/* Área da Torre */}
            <div className="bg-gradient-to-b from-blue-100 to-blue-50 rounded-xl shadow-lg overflow-hidden relative" style={{ height: '400px' }}>
              
              {/* Mensagem Motivacional DENTRO da tela do jogo */}
              {motivationalMessage && (
                <div className="absolute top-4 left-4 z-20 animate-pulse">
                  <div className="bg-yellow-400/90 backdrop-blur-sm text-black px-4 py-2 rounded-lg font-bold shadow-lg">
                    {motivationalMessage}
                  </div>
                </div>
              )}
              
              {/* Linha guia central */}
              <div className="absolute left-1/2 top-0 bottom-12 w-0.5 bg-red-300 opacity-50" />
              
              {/* Container da Torre */}
              <div className="absolute bottom-12 left-0 right-0" style={{ height: '340px' }}>
                <div className="relative h-full flex flex-col-reverse items-center overflow-hidden">
                  {/* Blocos da Torre */}
                  {blocks.slice(-25).map((block, index) => (
                    <div
                      key={block.id}
                      className={`absolute transition-all duration-300 ${
                        block.isSpecial ? 'animate-pulse' : ''
                      }`}
                      style={{
                        bottom: `${index * 13}px`,
                        left: `calc(50% + ${block.offset}px)`,
                        transform: 'translateX(-50%)',
                        zIndex: blocks.length - index
                      }}
                    >
                      <div
                        className={`w-24 h-11 rounded-sm border-2 flex items-center justify-center ${
                          block.quality === 'perfect' 
                            ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-600' 
                            : block.quality === 'good'
                            ? 'bg-gradient-to-r from-blue-400 to-blue-500 border-blue-600'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500 border-gray-600'
                        } ${block.isSpecial ? 'bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-600' : ''}`}
                        style={{
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        {block.isSpecial && (
                          <div className="text-white text-sm font-bold">
                            ⭐
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plataforma Base */}
              <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-gray-800 to-gray-600 border-t-4 border-gray-900">
                <div className="text-white text-center font-bold pt-2">
                  FUNDAÇÃO
                </div>
              </div>

              {/* Medidor de Estabilidade */}
              <div className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-lg">
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

            {/* Botão de Construir MOVIDO PARA BAIXO */}
            <div className="text-center">
              <button
                onClick={handleTap}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95 text-white px-12 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                🔨 ADICIONAR BLOCO
              </button>
              {targetInterval && (
                <div className="text-sm text-gray-600 mt-2">
                  Ritmo ideal: {(targetInterval / 1000).toFixed(1)}s entre toques
                </div>
              )}
            </div>
          </div>
        ) : (
          // Tela de resultados
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {blocks.length > 40 ? '🏆' : blocks.length > 25 ? '🎉' : '💪'}
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
