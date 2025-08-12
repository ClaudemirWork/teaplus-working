'use client'

import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  
  // Estado para filtro de período
  const [periodFilter, setPeriodFilter] = useState('all');
  
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

  // Filtrar sessões por período
  const filteredSessions = useMemo(() => {
    if (periodFilter === 'all') return sessions;
    
    const now = new Date();
    let cutoffDate = now;
    
    switch(periodFilter) {
      case '7days':
        cutoffDate = subDays(now, 7);
        break;
      case '30days':
        cutoffDate = subDays(now, 30);
        break;
      case '90days':
        cutoffDate = subDays(now, 90);
        break;
    }
    
    return sessions.filter(session => 
      isAfter(new Date(session.data_fim), cutoffDate)
    );
  }, [sessions, periodFilter]);

  // Processar dados com normalização
  const processedData = filteredSessions.map(session => ({
    ...session,
    normalized_score: normalizeScore(session.pontuacao_final, session.atividade_nome)
  }));

  // Agrupar por domínio clínico
  const domains = {
    'Comunicação': ['CAA', 'Tom de Voz', 'Iniciando Conversas'],
    'Interação Social': ['Contato Visual Progressivo', 'Expressões Faciais', 'Diálogos em Cenas'],
    'Atenção/Foco': ['Atenção Sustentada', 'Escuta Ativa']
  };

  // Preparar dados para gráfico de evolução temporal
  const evolutionData = useMemo(() => {
    const groupedByDate = {};
    
    processedData.forEach(session => {
      const date = format(new Date(session.data_fim), 'dd/MM', { locale: ptBR });
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          Comunicação: [],
          'Interação Social': [],
          'Atenção/Foco': []
        };
      }
      
      // Identificar domínio da atividade
      Object.entries(domains).forEach(([domain, activities]) => {
        if (activities.includes(session.atividade_nome)) {
          groupedByDate[date][domain].push(session.normalized_score);
        }
      });
    });
    
    // Calcular médias por domínio
    return Object.values(groupedByDate).map((item: any) => ({
      date: item.date,
      Comunicação: item.Comunicação.length ? 
        Math.round(item.Comunicação.reduce((a, b) => a + b, 0) / item.Comunicação.length) : null,
      'Interação Social': item['Interação Social'].length ? 
        Math.round(item['Interação Social'].reduce((a, b) => a + b, 0) / item['Interação Social'].length) : null,
      'Atenção/Foco': item['Atenção/Foco'].length ? 
        Math.round(item['Atenção/Foco'].reduce((a, b) => a + b, 0) / item['Atenção/Foco'].length) : null,
    }));
  }, [processedData]);

  // Preparar dados para gráfico de barras
  const barData = useMemo(() => {
    const activityData = {};
    
    Object.keys(activityScales).forEach(activity => {
      const activitySessions = processedData.filter(s => s.atividade_nome === activity);
      if (activitySessions.length > 0) {
        const scores = activitySessions.map(s => s.normalized_score);
        activityData[activity] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      }
    });
    
    return Object.entries(activityData).map(([name, score]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      score,
      fullName: name
    }));
  }, [processedData]);

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Dashboard de Progresso Terapêutico
            </h1>
            <p className="text-gray-600">
              Análise baseada em {filteredSessions.length} sessões registradas
            </p>
          </div>
          
          {/* Filtros de Período */}
          <div className="flex gap-2">
            <button
              onClick={() => setPeriodFilter('7days')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                periodFilter === '7days' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setPeriodFilter('30days')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                periodFilter === '30days' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              30 dias
            </button>
            <button
              onClick={() => setPeriodFilter('90days')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                periodFilter === '90days' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              3 meses
            </button>
            <button
              onClick={() => setPeriodFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                periodFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Todos
            </button>
          </div>
        </div>
        
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded mt-4">
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
                <p className="text-gray-600">📊 {metrics.sessions} sessões totais</p>
                <p className="text-gray-600">🎯 Última: {metrics.lastScore}%</p>
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

      {/* Gráfico de Evolução Temporal */}
      {evolutionData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📈 Evolução Temporal por Domínio
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Comunicação" 
                stroke="#10B981" 
                strokeWidth={2}
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="Interação Social" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="Atenção/Foco" 
                stroke="#3B82F6" 
                strokeWidth={2}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Detalhamento por Atividade (Tabela) */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Análise Detalhada por Atividade
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 text-gray-800">Atividade</th>
                <th className="pb-2 text-gray-800">Sessões</th>
                <th className="pb-2 text-gray-800">Média</th>
                <th className="pb-2 text-gray-800">Última</th>
                <th className="pb-2 text-gray-800">Escala Original</th>
              </tr>
            </thead>
            <tbody>
              {activityProgress.map(activity => (
                <tr key={activity.name} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-800">{activity.name}</td>
                  <td className="py-3 text-gray-800">{activity.sessions}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${activity.average}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{activity.average}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-800">{activity.lastScore}%</td>
                  <td className="py-3 text-sm text-gray-600">
                    {activity.scale.min}-{activity.scale.max} {activity.scale.tipo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico de Barras Comparativo */}
      {barData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 Comparação entre Atividades
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    return (
                      <div className="bg-white p-2 border rounded shadow">
                        <p className="text-sm font-semibold">{payload[0].payload.fullName}</p>
                        <p className="text-sm">Score: {payload[0].value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

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
                  <li key={a.name} className="text-gray-600">✓ {a.name}: {a.average}% de desempenho</li>
                ))}
            </ul>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-semibold text-orange-700">Áreas para Desenvolvimento</h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              {activityProgress
                .filter(a => a.average < 50 && a.sessions > 0)
                .map(a => (
                  <li key={a.name} className="text-gray-600">• {a.name}: {a.average}% - Considerar estratégias adicionais</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
