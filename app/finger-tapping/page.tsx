'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { ChevronLeft, Save } from 'lucide-react';
import { createClient } from '../utils/supabaseClient'

// Componente do Cabeçalho Padrão (igual ao Stop-Go)
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }: any) => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">

                {/* 1. Botão Voltar (Esquerda) */}
                <Link
                    href="/dashboard"
                    className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                </Link>

                {/* 2. Título Centralizado (Meio) */}
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </h1>

                {/* 3. Botão de Ação ou Espaçador (Direita) */}
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
                    // Espaçador para manter o título centralizado
                    <div className="w-24"></div>
                )}
            </div>
        </div>
    </header>
);

export default function FingerTapping() {
  const router = useRouter();
  const supabase = createClient();
  
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [taps, setTaps] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showResults, setShowResults] = useState(false);
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);

  const levels = [
    { id: 1, name: 'Nível 1', duration: 10, description: 'Iniciante (10s)' },
    { id: 2, name: 'Nível 2', duration: 15, description: 'Básico (15s)' },
    { id: 3, name: 'Nível 3', duration: 20, description: 'Intermediário (20s)' },
    { id: 4, name: 'Nível 4', duration: 25, description: 'Avançado (25s)' },
    { id: 5, name: 'Nível 5', duration: 30, description: 'Expert (30s)' }
  ];

  const startActivity = () => {
    const duration = levels[selectedLevel - 1].duration;
    setTimeLeft(duration);
    setIsPlaying(true);
    setTaps([]);
    setStartTime(Date.now());
    setShowResults(false);
    setJogoIniciado(true);
    setPontuacao(0);
  };

  const handleTap = () => {
    if (!isPlaying || showResults) return;
    const currentTime = Date.now();
    setTaps([...taps, currentTime - startTime]);
    setPontuacao(prev => prev + (10 * selectedLevel));
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
    if (taps.length < 2) return { avgInterval: 0, consistency: 0 };
    
    const intervals = [];
    for (let i = 1; i < taps.length; i++) {
      intervals.push(taps[i] - taps[i - 1]);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => 
      sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    const consistency = Math.max(0, 100 - (Math.sqrt(variance) / avgInterval * 100));
    
    return { avgInterval: Math.round(avgInterval), consistency: Math.round(consistency) };
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
          atividade_nome: 'Toque Rítmico',
          pontuacao_final: pontuacao,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!
        
📊 Resumo da Avaliação:
- Total de Toques: ${taps.length}
- Média: ${(taps.length / levels[selectedLevel - 1].duration).toFixed(1)} toques/segundo
- Consistência: ${metrics.consistency}%
- Intervalo médio: ${metrics.avgInterval}ms
- Nível ${selectedLevel} completado
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
      {/* Header PADRONIZADO */}
      <GameHeader 
        title="Toque Rítmico"
        icon="🎯"
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
                    Desenvolver coordenação motora fina tocando rapidamente na tela com ritmo consistente.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Toque rapidamente na área azul</li>
                    <li>Mantenha ritmo constante</li>
                    <li>Continue até o tempo acabar</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                  <p className="text-sm text-gray-600">
                    Medimos quantidade de toques, ritmo e consistência do movimento.
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
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-sm">{level.name}</div>
                    <div className="text-xs opacity-80">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Botão Iniciar */}
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
          <div className="space-y-6">
            {/* Progresso */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Progresso da Sessão</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-orange-800">{pontuacao}</div>
                  <div className="text-xs text-orange-600">Pontos</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-800">{timeLeft}s</div>
                  <div className="text-xs text-blue-600">Tempo</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-800">{taps.length}</div>
                  <div className="text-xs text-green-600">Toques</div>
                </div>
              </div>
            </div>

            {/* Área de Toque */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={handleTap}
                className="w-full h-80 bg-blue-500 text-white text-4xl font-bold hover:bg-blue-600 active:bg-blue-700 transition-colors"
              >
                TOQUE AQUI!
              </button>
            </div>
          </div>
        ) : (
          // Tela de resultados
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {metrics.consistency > 80 ? '🏆' : metrics.consistency > 60 ? '🎉' : '💪'}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {metrics.consistency > 80 ? 'Ritmo Excelente!' : metrics.consistency > 60 ? 'Muito Bem!' : 'Continue Praticando!'}
              </h3>
            </div>
            
            {/* Resultados Detalhados */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-purple-800">{taps.length}</div>
                <div className="text-xs text-purple-600">Total de Toques</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-800">
                  {(taps.length / levels[selectedLevel - 1].duration).toFixed(1)}/s
                </div>
                <div className="text-xs text-blue-600">Toques/Segundo</div>
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
            
            {/* Botões */}
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
