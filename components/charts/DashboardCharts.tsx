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
  
  // NORMALIZAÇÃO: Cada atividade tem escala diferente
  const activityScales = {
    'CAA': { min: 0, max: 10, tipo: 'acertos' },
    'Atenção Sustentada': { min: 0, max: 600, tipo: 'segundos' },
    'Contato Visual Progressivo': { min: 0, max: 300, tipo: 'segundos' },
    'Expressões Faciais': { min: 0, max: 300, tipo: 'pontos' },
    'Tom de Voz': { min: 0, max: 300, tipo: 'pontos' },
    'Escuta Ativa': { min: 0, max: 100, tipo: 'pontos' },
    'Iniciando Conversas': { min: 0, max: 300, tipo: 'pontos' },
    'Diálogos em Cenas': { min: 0, max: 200, tipo: 'pontos' }
  };

  // Função para normalizar pontuação (0-100%)
  const normalizeScore = (score: number, activityName: string): number => {
    const scale = activityScales[activityName];
    if (!scale) return 0;
    
    const normalized = ((score - scale.min) / (scale.max - scale.min)) * 100;
    return Math.min(100, Math.max(0, Math.round(normalized)));
  };

  // Processar dados com normalização
  const processedData = sessions.map(session => ({
    ...session,
    normalized_score: normalizeScore(session.pontuacao_final, session.atividade_nome)
  }));

  // Agrupar por domínio clínico
  const domains = {
    'Comunicação': ['CAA', 'Tom de Voz', 'Iniciando Conversas'],
    'Interação Social': ['Contato Visual Progressivo', 'Expressões Faciais', 'Diálogos em Cenas'],
    'Atenção/Foco': ['Atenção Sustentada', 'Escuta Ativa']
  };

  // Calcular métricas por domínio
  const calculateDomainMetrics = (domainActivities: string[]) => {
    const domainSessions = processedData.filter(s => 
      domainActivities.includes(s.atividade_nome)
    );
    
    if (domainSessions.length === 0) return {
      average: 0,
      trend: 'stable',
      sessions: 0,
      lastScore: 0
    };

    const scores = domainSessions.map(s => s.normalized_score);
    const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Calcular tendência (últimas 3 vs primeiras 3 sessões)
    const recent = scores.slice(-3);
    const initial = scores.slice(0, 3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const initialAvg = initial.reduce((a, b) => a + b, 0) / initial.length;
    
    let trend = 'stable';
    if (recentAvg > initialAvg + 5) trend = 'improving';
    if (recentAvg < initialAvg - 5) trend = 'declining';

    return {
      average,
      trend,
      sessions: domainSessions.length,
      lastScore: scores[scores.length - 1] || 0
    };
  };

  // Calcular progresso por atividade individual
  const activityProgress = Object.keys(activityScales).map(activity => {
    const activitySessions = processedData.filter(s => s.atividade_nome === activity);
    const scores = activitySessions.map(s => s.normalized_score);
    
    return {
      name: activity,
      sessions: activitySessions.length,
      average: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      lastScore: scores[scores.length - 1] || 0,
      scale: activityScales[activity]
    };
  });

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return '📈';
    if (trend === 'declining') return '📉';
    return '➡️';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'improving') return 'text-green-600';
    if (trend === 'declining') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      
      {/* Header com Contexto */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard de Progresso Terapêutico
        </h1>
        <p className="text-gray-600 mb-2">
          Análise baseada em {sessions.length} sessões registradas
        </p>
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-800">
            <strong>📊 Metodologia:</strong> Scores normalizados (0-100%) considerando a escala específica de cada atividade
          </p>
        </div>
      </div>

      {/* Cards por Domínio Clínico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(domains).map(([domain, activities]) => {
          const metrics = calculateDomainMetrics(activities);
          return (
            <div key={domain} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{domain}</h3>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-bold text-gray-800">
                  {metrics.average}%
                </span>
                <span className={`text-2xl ${getTrendColor(metrics.trend)}`}>
                  {getTrendIcon(metrics.trend)}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>📊 {metrics.sessions} sessões totais</p>
                <p>🎯 Última: {metrics.lastScore}%</p>
                <p className={getTrendColor(metrics.trend)}>
                  Tendência: {
                    metrics.trend === 'improving' ? 'Melhorando' :
                    metrics.trend === 'declining' ? 'Requer atenção' :
                    'Estável'
                  }
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalhamento por Atividade */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Análise Detalhada por Atividade
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2">Atividade</th>
                <th className="pb-2">Sessões</th>
                <th className="pb-2">Média</th>
                <th className="pb-2">Última</th>
                <th className="pb-2">Escala Original</th>
              </tr>
            </thead>
            <tbody>
              {activityProgress.map(activity => (
                <tr key={activity.name} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{activity.name}</td>
                  <td className="py-3">{activity.sessions}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${activity.average}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{activity.average}%</span>
                    </div>
                  </td>
                  <td className="py-3">{activity.lastScore}%</td>
                  <td className="py-3 text-sm text-gray-600">
                    {activity.scale.min}-{activity.scale.max} {activity.scale.tipo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interpretação Clínica */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          💡 Interpretação dos Resultados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-green-700">Pontos Fortes</h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              {activityProgress
                .filter(a => a.average >= 70)
                .map(a => (
                  <li key={a.name}>✓ {a.name}: {a.average}% de desempenho</li>
                ))}
            </ul>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-semibold text-orange-700">Áreas para Desenvolvimento</h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              {activityProgress
                .filter(a => a.average < 50 && a.sessions > 0)
                .map(a => (
                  <li key={a.name}>• {a.name}: {a.average}% - Considerar estratégias adicionais</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
