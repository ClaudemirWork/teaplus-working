'use client'

import React from 'react';

interface SessionData {
  id: number
  atividade_nome: string
  pontuacao_final: number
  data_fim: string
  detalhes: any
  paciente_id: number
}

interface DashboardChartsProps {
  sessions: SessionData[]
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ sessions = [] }) => {
  // Cores do TeaPlus
  const colors = {
    tea: '#10B981',
    tdah: '#3B82F6',
    intersection: '#8B5CF6',
    background: '#F0F9FF',
    text: '#1F2937'
  };

  // Calcular métricas reais
  const calculateMetrics = () => {
    const totalSessions = sessions.length;
    
    // Agrupar por atividade
    const byActivity = sessions.reduce((acc, session) => {
      if (!acc[session.atividade_nome]) {
        acc[session.atividade_nome] = {
          count: 0,
          totalScore: 0,
          scores: []
        };
      }
      acc[session.atividade_nome].count++;
      acc[session.atividade_nome].totalScore += session.pontuacao_final;
      acc[session.atividade_nome].scores.push(session.pontuacao_final);
      return acc;
    }, {} as Record<string, any>);

    // Calcular médias
    const averages = Object.entries(byActivity).reduce((acc, [name, data]) => {
      acc[name] = Math.round(data.totalScore / data.count);
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSessions,
      byActivity,
      averages
    };
  };

  const metrics = calculateMetrics();
  
  // Classificar atividades por categoria
  const teaActivities = ['CAA', 'Contato Visual Progressivo', 'Expressões Faciais', 'Tom de Voz'];
  const tdahActivities = ['Atenção Sustentada', 'Escuta Ativa'];
  const intersectionActivities = ['Iniciando Conversas', 'Diálogos em Cenas'];

  // Calcular médias por categoria
  const getAverageByCategory = (activities: string[]) => {
    const scores = activities
      .filter(act => metrics.byActivity[act])
      .flatMap(act => metrics.byActivity[act].scores);
    
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const teaAverage = getAverageByCategory(teaActivities);
  const tdahAverage = getAverageByCategory(tdahActivities);
  const intersectionAverage = getAverageByCategory(intersectionActivities);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard de Progresso TeaPlus
        </h1>
        <p className="text-gray-600">
          Total de {metrics.totalSessions} sessões registradas
        </p>
      </div>

      {/* Cards de Resumo REAIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Progresso TEA</h3>
          <div className="text-3xl font-bold text-green-600">{teaAverage}%</div>
          <p className="text-sm text-gray-500 mt-1">Média das atividades TEA</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Progresso TDAH</h3>
          <div className="text-3xl font-bold text-blue-600">{tdahAverage}%</div>
          <p className="text-sm text-gray-500 mt-1">Média das atividades TDAH</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Zona de Interseção</h3>
          <div className="text-3xl font-bold text-purple-600">{intersectionAverage}%</div>
          <p className="text-sm text-gray-500 mt-1">Atividades combinadas</p>
        </div>
      </div>

      {/* Detalhamento por Atividade */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Desempenho por Atividade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(metrics.byActivity).map(([name, data]: [string, any]) => (
            <div key={name} className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-700">{name}</h3>
              <div className="mt-2">
                <span className="text-2xl font-bold text-gray-800">
                  {metrics.averages[name]}%
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  ({data.count} sessões)
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Última: {data.scores[data.scores.length - 1]}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estatísticas Adicionais */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          📊 Estatísticas Gerais
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {metrics.totalSessions}
            </div>
            <div className="text-sm text-gray-600">Total de Sessões</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {Object.keys(metrics.byActivity).length}
            </div>
            <div className="text-sm text-gray-600">Atividades Diferentes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {Math.round((teaAverage + tdahAverage + intersectionAverage) / 3)}%
            </div>
            <div className="text-sm text-gray-600">Média Geral</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">
              {sessions.length > 0 ? Math.max(...sessions.map(s => s.pontuacao_final)) : 0}%
            </div>
            <div className="text-sm text-gray-600">Melhor Pontuação</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
