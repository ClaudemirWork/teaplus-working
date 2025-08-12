'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { format, subDays, isAfter, differenceInDays, startOfWeek, endOfWeek } from 'date-fns';
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

// Componente Sparkline MELHORADO
const Sparkline: React.FC<{ data: number[], color?: string }> = ({ data, color = '#3B82F6' }) => {
  // Sem dados
  if (data.length === 0) {
    return (
      <div className="h-12 flex items-center justify-center text-xs text-gray-400 bg-gray-50 rounded">
        Sem dados
      </div>
    );
  }

  // Apenas 1 sessão - mostrar como barra única
  if (data.length === 1) {
    const value = data[0];
    return (
      <div className="h-12 flex flex-col justify-center bg-gray-50 rounded p-1">
        <div className="flex items-end h-8">
          <div 
            className="w-full rounded-t"
            style={{ 
              height: `${Math.max(10, value)}%`,
              backgroundColor: color,
              opacity: 0.8
            }}
          />
        </div>
        <div className="text-xs text-center text-gray-500 mt-1">1 sessão: {value}%</div>
      </div>
    );
  }

  // 2 ou mais sessões - mostrar gráfico de área
  const chartData = data.map((value, index) => ({
    index,
    value
  }));

  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          fill={color} 
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload[0]) {
              return (
                <div className="bg-white px-2 py-1 text-xs border rounded shadow">
                  {payload[0].value}%
                </div>
              );
            }
            return null;
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const DashboardCharts: React.FC<DashboardChartsProps> = ({ sessions = [] }) => {
  
  // Estado para filtro de período
  const [periodFilter, setPeriodFilter] = useState('all');
  
  // Detectar se é mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // NORMALIZAÇÃO: Cada atividade tem escala diferente
  const activityScales = {
    'CAA': { min: 0, max: 10, tipo: 'acertos', meta: 70, color: '#10B981' },
    'Atenção Sustentada': { min: 0, max: 600, tipo: 'segundos', meta: 75, color: '#3B82F6' },
    'Contato Visual Progressivo': { min: 0, max: 300, tipo: 'segundos', meta: 80, color: '#8B5CF6' },
    'Expressões Faciais': { min: 0, max: 300, tipo: 'pontos', meta: 70, color: '#F59E0B' },
    'Tom de Voz': { min: 0, max: 300, tipo: 'pontos', meta: 70, color: '#EF4444' },
    'Escuta Ativa': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#06B6D4' },
    'Iniciando Conversas': { min: 0, max: 300, tipo: 'pontos', meta: 65, color: '#84CC16' },
    'Diálogos em Cenas': { min: 0, max: 200, tipo: 'pontos', meta: 65, color: '#EC4899' }
  };

  // Função para normalizar pontuação (0-100%)
  const normalizeScore = (score: number, activityName: string): number => {
    const scale = activityScales[activityName];
    if (!scale) return 0;
    
    const normalized = ((score - scale.min) / (scale.max - scale.min)) * 100;
    return Math.min(100, Math.max(0, Math.round(normalized)));
  };

  // Calcular desvio padrão
  const calculateStandardDeviation = (values: number[]): number => {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  };

  // Calcular Coeficiente de Variação (CV) para consistência
  const calculateConsistency = (scores: number[]): { level: string, cv: number, color: string } => {
    if (scores.length < 2) return { level: 'Insuficiente', cv: 0, color: 'text-gray-500' };
    
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const stdDev = calculateStandardDeviation(scores);
    const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
    
    if (cv < 15) return { level: 'Alta', cv, color: 'text-green-600' };
    if (cv < 30) return { level: 'Média', cv, color: 'text-yellow-600' };
    return { level: 'Baixa', cv, color: 'text-red-600' };
  };

  // Calcular frequência de prática
  const calculateFrequency = (sessionDates: Date[]): { sessionsPerWeek: number, maxGap: number, regularityScore: string } => {
    if (sessionDates.length < 2) return { sessionsPerWeek: 0, maxGap: 0, regularityScore: 'Novo' };
    
    const sortedDates = sessionDates.sort((a, b) => a.getTime() - b.getTime());
    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];
    const totalDays = differenceInDays(lastDate, firstDate) + 1;
    const totalWeeks = Math.max(1, totalDays / 7);
    
    const sessionsPerWeek = sessionDates.length / totalWeeks;
    
    // Calcular maior gap entre sessões
    let maxGap = 0;
    for (let i = 1; i < sortedDates.length; i++) {
      const gap = differenceInDays(sortedDates[i], sortedDates[i - 1]);
      maxGap = Math.max(maxGap, gap);
    }
    
    // Determinar regularidade
    let regularityScore = 'Irregular';
    if (sessionsPerWeek >= 3) regularityScore = 'Excelente';
    else if (sessionsPerWeek >= 2) regularityScore = 'Boa';
    else if (sessionsPerWeek >= 1) regularityScore = 'Regular';
    
    return { sessionsPerWeek: Math.round(sessionsPerWeek * 10) / 10, maxGap, regularityScore };
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
  }, [processedData, domains]);

  // Análise Multidimensional por Atividade
  const multidimensionalAnalysis = useMemo(() => {
    return Object.keys(activityScales).map(activity => {
      const activitySessions = processedData.filter(s => s.atividade_nome === activity);
      const scores = activitySessions.map(s => s.normalized_score);
      const dates = activitySessions.map(s => new Date(s.data_fim));
      
      // Métricas básicas
      const average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const lastScore = scores[scores.length - 1] || 0;
      
      // Consistência
      const consistency = calculateConsistency(scores);
      
      // Frequência
      const frequency = calculateFrequency(dates);
      
      // Velocidade de progresso (últimas 5 vs primeiras 5 sessões)
      let progressRate = 0;
      if (scores.length >= 5) {
        const firstFive = scores.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
        const lastFive = scores.slice(-5).reduce((a, b) => a + b, 0) / 5;
        progressRate = Math.round(lastFive - firstFive);
      } else if (scores.length >= 2) {
        // Se tiver menos de 5 sessões mas pelo menos 2, comparar primeira com última
        progressRate = Math.round(scores[scores.length - 1] - scores[0]);
      }
      
      // Distância até a meta
      const meta = activityScales[activity].meta;
      const distanceToGoal = meta - average;
      
      // Sparkline data (últimas 10 sessões)
      const sparklineData = scores.slice(-10);
      
      return {
        name: activity,
        sessions: activitySessions.length,
        average,
        lastScore,
        consistency,
        frequency,
        progressRate,
        meta,
        distanceToGoal,
        scale: activityScales[activity],
        sparklineData
      };
    });
  }, [processedData, activityScales]);

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
      
      {/* Header com Contexto e Filtros */}
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
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setPeriodFilter('7days')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                periodFilter === '7days' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setPeriodFilter('30days')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                periodFilter === '30days' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              30 dias
            </button>
            <button
              onClick={() => setPeriodFilter('90days')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                periodFilter === '90days' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              3 meses
            </button>
            <button
              onClick={() => setPeriodFilter('all')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
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
            <strong>📊 Metodologia:</strong> Análise multidimensional baseada em evidências científicas para TEA e TDAH
          </p>
        </div>
      </div>

      {/* Cards por Domínio Clínico - MANTIDO */}
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

      {/* Tabela Detalhada - MANTIDA */}
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

      {/* ANÁLISE MULTIDIMENSIONAL COM SPARKLINES MELHORADOS */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          🔬 Análise Multidimensional com Tendências
        </h2>
        <div className="space-y-4">
          {multidimensionalAnalysis.map(activity => (
            <div key={activity.name} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                  <span className="text-sm text-gray-500">{activity.sessions} sessões</span>
                </div>
                
                {/* Sparkline MELHORADO */}
                <div className="w-32 ml-4">
                  <div className="text-xs text-gray-500 mb-1 text-right">
                    {activity.sparklineData.length > 1 ? 'Últimas sessões' : 'Sessão única'}
                  </div>
                  <Sparkline 
                    data={activity.sparklineData} 
                    color={activity.scale.color}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Consistência */}
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-600 mb-1">Consistência</div>
                  <div className={`font-semibold ${activity.consistency.color}`}>
                    {activity.consistency.level}
                  </div>
                  <div className="text-xs text-gray-500">
                    {activity.consistency.cv > 0 ? `CV: ${activity.consistency.cv.toFixed(1)}%` : 'N/A'}
                  </div>
                </div>
                
                {/* Frequência */}
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-600 mb-1">Frequência</div>
                  <div className="font-semibold text-gray-800">
                    {activity.frequency.sessionsPerWeek > 0 ? `${activity.frequency.sessionsPerWeek}/sem` : '0/sem'}
                  </div>
                  <div className="text-xs text-gray-500">{activity.frequency.regularityScore}</div>
                </div>
                
                {/* Progresso */}
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-600 mb-1">Velocidade</div>
                  <div className={`font-semibold ${activity.progressRate > 0 ? 'text-green-600' : activity.progressRate < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {activity.progressRate > 0 ? '+' : ''}{activity.progressRate}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {activity.sessions >= 5 ? 'Últimas 5 sessões' : activity.sessions >= 2 ? 'Primeira vs Última' : 'N/A'}
                  </div>
                </div>
                
                {/* Meta */}
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-600 mb-1">Meta</div>
                  <div className="font-semibold text-gray-800">
                    {activity.average}/{activity.meta}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {activity.distanceToGoal > 0 ? `Faltam ${activity.distanceToGoal}%` : '✅ Atingida'}
                  </div>
                </div>
              </div>
              
              {/* Barra de progresso até a meta */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progresso até a meta</span>
                  <span>{Math.min(100, Math.round((activity.average / activity.meta) * 100))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500`}
                    style={{ 
                      width: `${Math.min(100, (activity.average / activity.meta) * 100)}%`,
                      backgroundColor: activity.average >= activity.meta ? '#10B981' : activity.scale.color
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interpretação Clínica - MANTIDA */}
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
