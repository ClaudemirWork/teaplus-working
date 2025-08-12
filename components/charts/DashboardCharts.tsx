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

// Componente Sparkline
const Sparkline: React.FC<{ data: number[], color?: string }> = ({ data, color = '#3B82F6' }) => {
  if (data.length === 0) {
    return (
      <div className="h-12 flex items-center justify-center text-xs text-gray-400 bg-gray-50 rounded">
        Sem dados
      </div>
    );
  }

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
  
  // Estados
  const [periodFilter, setPeriodFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState<'TEA' | 'TDAH' | 'TEA+TDAH'>('TEA');
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // CONFIGURAÇÃO POR CONDIÇÃO
  const conditionConfig = {
    'TEA': {
      name: 'Transtorno do Espectro Autista',
      color: '#3B82F6', // Azul
      activities: [
        'CAA',
        'Contato Visual Progressivo',
        'Expressões Faciais',
        'Tom de Voz',
        'Escuta Ativa',
        'Iniciando Conversas',
        'Diálogos em Cenas',
        // Futuras atividades TEA
        'Reconhecimento Emocional',
        'Turnos de Conversação',
        'Linguagem Não-Verbal'
      ],
      domains: {
        'Comunicação': ['CAA', 'Tom de Voz', 'Iniciando Conversas', 'Turnos de Conversação'],
        'Interação Social': ['Contato Visual Progressivo', 'Expressões Faciais', 'Diálogos em Cenas', 'Reconhecimento Emocional'],
        'Regulação': ['Escuta Ativa', 'Linguagem Não-Verbal']
      },
      metrics: {
        primary: 'Funcionamento Adaptativo',
        secondary: ['Comunicação Social', 'Comportamentos Repetitivos', 'Integração Sensorial']
      }
    },
    'TDAH': {
      name: 'Transtorno do Déficit de Atenção',
      color: '#10B981', // Verde
      activities: [
        'Atenção Sustentada',
        'Foco Seletivo',
        'Controle Inibitório',
        'Memória de Trabalho',
        'Planejamento Executivo',
        'Flexibilidade Cognitiva',
        'Tempo de Reação',
        'Organização Visual'
      ],
      domains: {
        'Atenção': ['Atenção Sustentada', 'Foco Seletivo', 'Tempo de Reação'],
        'Funções Executivas': ['Controle Inibitório', 'Planejamento Executivo', 'Flexibilidade Cognitiva'],
        'Memória': ['Memória de Trabalho', 'Organização Visual']
      },
      metrics: {
        primary: 'Controle Atencional',
        secondary: ['Impulsividade', 'Hiperatividade', 'Funções Executivas']
      }
    },
    'TEA+TDAH': {
      name: 'Condição Combinada',
      color: '#8B5CF6', // Roxo
      activities: [
        // Todas as atividades de TEA
        'CAA',
        'Contato Visual Progressivo',
        'Expressões Faciais',
        'Tom de Voz',
        'Escuta Ativa',
        'Iniciando Conversas',
        'Diálogos em Cenas',
        // Todas as atividades de TDAH
        'Atenção Sustentada',
        'Foco Seletivo',
        'Controle Inibitório',
        'Memória de Trabalho'
      ],
      domains: {
        'Comunicação': ['CAA', 'Tom de Voz', 'Iniciando Conversas'],
        'Interação Social': ['Contato Visual Progressivo', 'Expressões Faciais', 'Diálogos em Cenas'],
        'Atenção/Funções Executivas': ['Atenção Sustentada', 'Foco Seletivo', 'Controle Inibitório', 'Memória de Trabalho'],
        'Regulação': ['Escuta Ativa']
      },
      metrics: {
        primary: 'Integração Global',
        secondary: ['Comunicação Social', 'Controle Atencional', 'Regulação Emocional', 'Funções Executivas']
      }
    }
  };

  // Configuração atual baseada na condição selecionada
  const currentConfig = conditionConfig[conditionFilter];
  const currentDomains = currentConfig.domains;
  const allowedActivities = currentConfig.activities;
  
  // ESCALAS E METAS POR ATIVIDADE
  const activityScales = {
    // Atividades TEA
    'CAA': { min: 0, max: 10, tipo: 'acertos', meta: 70, color: '#10B981', condition: 'TEA' },
    'Contato Visual Progressivo': { min: 0, max: 300, tipo: 'segundos', meta: 80, color: '#8B5CF6', condition: 'TEA' },
    'Expressões Faciais': { min: 0, max: 300, tipo: 'pontos', meta: 70, color: '#F59E0B', condition: 'TEA' },
    'Tom de Voz': { min: 0, max: 300, tipo: 'pontos', meta: 70, color: '#EF4444', condition: 'TEA' },
    'Escuta Ativa': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#06B6D4', condition: 'TEA' },
    'Iniciando Conversas': { min: 0, max: 300, tipo: 'pontos', meta: 65, color: '#84CC16', condition: 'TEA' },
    'Diálogos em Cenas': { min: 0, max: 200, tipo: 'pontos', meta: 65, color: '#EC4899', condition: 'TEA' },
    'Reconhecimento Emocional': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#F97316', condition: 'TEA' },
    'Turnos de Conversação': { min: 0, max: 100, tipo: 'turnos', meta: 75, color: '#0EA5E9', condition: 'TEA' },
    'Linguagem Não-Verbal': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#A855F7', condition: 'TEA' },
    
    // Atividades TDAH
    'Atenção Sustentada': { min: 0, max: 600, tipo: 'segundos', meta: 75, color: '#3B82F6', condition: 'TDAH' },
    'Foco Seletivo': { min: 0, max: 100, tipo: 'pontos', meta: 80, color: '#14B8A6', condition: 'TDAH' },
    'Controle Inibitório': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#F59E0B', condition: 'TDAH' },
    'Memória de Trabalho': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#EF4444', condition: 'TDAH' },
    'Planejamento Executivo': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#8B5CF6', condition: 'TDAH' },
    'Flexibilidade Cognitiva': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#10B981', condition: 'TDAH' },
    'Tempo de Reação': { min: 0, max: 2000, tipo: 'ms', meta: 80, color: '#06B6D4', condition: 'TDAH' },
    'Organização Visual': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#EC4899', condition: 'TDAH' }
  };

  // Filtrar apenas atividades existentes nos dados
  const existingActivities = Object.keys(activityScales).filter(activity => 
    sessions.some(s => s.atividade_nome === activity)
  );

  // Função para normalizar pontuação
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

  // Calcular Coeficiente de Variação
  const calculateConsistency = (scores: number[]): { level: string, cv: number, color: string } => {
    if (scores.length < 2) return { level: 'Insuficiente', cv: 0, color: 'text-gray-500' };
    
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const stdDev = calculateStandardDeviation(scores);
    const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
    
    if (cv < 15) return { level: 'Alta', cv, color: 'text-green-600' };
    if (cv < 30) return { level: 'Média', cv, color: 'text-yellow-600' };
    return { level: 'Baixa', cv, color: 'text-red-600' };
  };

  // Calcular frequência
  const calculateFrequency = (sessionDates: Date[]): { sessionsPerWeek: number, maxGap: number, regularityScore: string } => {
    if (sessionDates.length < 2) return { sessionsPerWeek: 0, maxGap: 0, regularityScore: 'Novo' };
    
    const sortedDates = sessionDates.sort((a, b) => a.getTime() - b.getTime());
    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];
    const totalDays = differenceInDays(lastDate, firstDate) + 1;
    const totalWeeks = Math.max(1, totalDays / 7);
    
    const sessionsPerWeek = sessionDates.length / totalWeeks;
    
    let maxGap = 0;
    for (let i = 1; i < sortedDates.length; i++) {
      const gap = differenceInDays(sortedDates[i], sortedDates[i - 1]);
      maxGap = Math.max(maxGap, gap);
    }
    
    let regularityScore = 'Irregular';
    if (sessionsPerWeek >= 3) regularityScore = 'Excelente';
    else if (sessionsPerWeek >= 2) regularityScore = 'Boa';
    else if (sessionsPerWeek >= 1) regularityScore = 'Regular';
    
    return { sessionsPerWeek: Math.round(sessionsPerWeek * 10) / 10, maxGap, regularityScore };
  };

  // Filtrar sessões por período e condição
  const filteredSessions = useMemo(() => {
    let filtered = sessions;
    
    // Filtrar por condição (apenas atividades permitidas)
    filtered = filtered.filter(session => 
      allowedActivities.includes(session.atividade_nome)
    );
    
    // Filtrar por período
    if (periodFilter !== 'all') {
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
      
      filtered = filtered.filter(session => 
        isAfter(new Date(session.data_fim), cutoffDate)
      );
    }
    
    return filtered;
  }, [sessions, periodFilter, allowedActivities]);

  // Processar dados
  const processedData = filteredSessions.map(session => ({
    ...session,
    normalized_score: normalizeScore(session.pontuacao_final, session.atividade_nome)
  }));

  // Preparar dados para gráfico de evolução
  const evolutionData = useMemo(() => {
    const groupedByDate = {};
    
    processedData.forEach(session => {
      const date = format(new Date(session.data_fim), 'dd/MM', { locale: ptBR });
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = { date };
        Object.keys(currentDomains).forEach(domain => {
          groupedByDate[date][domain] = [];
        });
      }
      
      // Identificar domínio da atividade
      Object.entries(currentDomains).forEach(([domain, activities]) => {
        if (activities.includes(session.atividade_nome)) {
          groupedByDate[date][domain].push(session.normalized_score);
        }
      });
    });
    
    // Calcular médias por domínio
    return Object.values(groupedByDate).map((item: any) => {
      const result: any = { date: item.date };
      
      Object.keys(currentDomains).forEach(domain => {
        const scores = item[domain];
        result[domain] = scores.length ? 
          Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
      });
      
      return result;
    });
  }, [processedData, currentDomains]);

  // Análise Multidimensional
  const multidimensionalAnalysis = useMemo(() => {
    return existingActivities
      .filter(activity => allowedActivities.includes(activity))
      .map(activity => {
        const activitySessions = processedData.filter(s => s.atividade_nome === activity);
        const scores = activitySessions.map(s => s.normalized_score);
        const dates = activitySessions.map(s => new Date(s.data_fim));
        
        const average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const lastScore = scores[scores.length - 1] || 0;
        const consistency = calculateConsistency(scores);
        const frequency = calculateFrequency(dates);
        
        let progressRate = 0;
        if (scores.length >= 5) {
          const firstFive = scores.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
          const lastFive = scores.slice(-5).reduce((a, b) => a + b, 0) / 5;
          progressRate = Math.round(lastFive - firstFive);
        } else if (scores.length >= 2) {
          progressRate = Math.round(scores[scores.length - 1] - scores[0]);
        }
        
        const meta = activityScales[activity].meta;
        const distanceToGoal = meta - average;
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
  }, [processedData, existingActivities, allowedActivities, activityScales]);

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

  // Calcular progresso por atividade
  const activityProgress = existingActivities
    .filter(activity => allowedActivities.includes(activity))
    .map(activity => {
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

  // Cores dos domínios para os gráficos
  const domainColors = {
    'Comunicação': '#10B981',
    'Interação Social': '#8B5CF6',
    'Atenção/Foco': '#3B82F6',
    'Regulação': '#F59E0B',
    'Atenção': '#3B82F6',
    'Funções Executivas': '#EF4444',
    'Memória': '#06B6D4',
    'Atenção/Funções Executivas': '#14B8A6'
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      
      {/* Header com Seletor de Condição */}
      <div className="mb-8">
        {/* NOVO: Seletor de Condição */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Condição em Foco</h2>
              <p className="text-sm text-gray-600">Selecione para filtrar atividades e métricas específicas</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setConditionFilter('TEA')}
                className={`px-4 py-3 rounded-lg transition-all font-medium ${
                  conditionFilter === 'TEA' 
                    ? 'bg-blue-600 text-white shadow-lg scale-105' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                <span className="block text-sm">TEA</span>
                <span className="text-xs opacity-80">Espectro Autista</span>
              </button>
              <button
                onClick={() => setConditionFilter('TDAH')}
                className={`px-4 py-3 rounded-lg transition-all font-medium ${
                  conditionFilter === 'TDAH' 
                    ? 'bg-green-600 text-white shadow-lg scale-105' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                <span className="block text-sm">TDAH</span>
                <span className="text-xs opacity-80">Déficit de Atenção</span>
              </button>
              <button
                onClick={() => setConditionFilter('TEA+TDAH')}
                className={`px-4 py-3 rounded-lg transition-all font-medium ${
                  conditionFilter === 'TEA+TDAH' 
                    ? 'bg-purple-600 text-white shadow-lg scale-105' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                <span className="block text-sm">TEA+TDAH</span>
                <span className="text-xs opacity-80">Combinado</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Dashboard de Progresso Terapêutico
            </h1>
            <p className="text-gray-600">
              {currentConfig.name} - {filteredSessions.length} sessões registradas
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
            <strong>📊 Métricas Principais:</strong> {currentConfig.metrics.primary} | 
            <strong> Secundárias:</strong> {currentConfig.metrics.secondary.join(', ')}
          </p>
        </div>
      </div>

      {/* Cards por Domínio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(currentDomains).slice(0, 3).map(([domain, activities]) => {
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
              {Object.keys(currentDomains).map(domain => (
                <Line 
                  key={domain}
                  type="monotone" 
                  dataKey={domain} 
                  stroke={domainColors[domain] || '#666'} 
                  strokeWidth={2}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tabela Detalhada */}
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
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${activity.average}%`,
                            backgroundColor: activity.scale.color
                          }}
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

      {/* Análise Multidimensional */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          🔬 Análise Multidimensional - {currentConfig.name}
        </h2>
        <div className="space-y-4">
          {multidimensionalAnalysis.map(activity => (
            <div key={activity.name} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                  <span className="text-sm text-gray-500">{activity.sessions} sessões</span>
                </div>
                
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
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-600 mb-1">Consistência</div>
                  <div className={`font-semibold ${activity.consistency.color}`}>
                    {activity.consistency.level}
                  </div>
                  <div className="text-xs text-gray-500">
                    {activity.consistency.cv > 0 ? `CV: ${activity.consistency.cv.toFixed(1)}%` : 'N/A'}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-600 mb-1">Frequência</div>
                  <div className="font-semibold text-gray-800">
                    {activity.frequency.sessionsPerWeek > 0 ? `${activity.frequency.sessionsPerWeek}/sem` : '0/sem'}
                  </div>
                  <div className="text-xs text-gray-500">{activity.frequency.regularityScore}</div>
                </div>
                
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-xs text-gray-600 mb-1">Velocidade</div>
                  <div className={`font-semibold ${activity.progressRate > 0 ? 'text-green-600' : activity.progressRate < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {activity.progressRate > 0 ? '+' : ''}{activity.progressRate}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {activity.sessions >= 5 ? 'Últimas 5 sessões' : activity.sessions >= 2 ? 'Primeira vs Última' : 'N/A'}
                  </div>
                </div>
                
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

      {/* Interpretação Clínica */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          💡 Interpretação dos Resultados - {currentConfig.name}
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
        
        {/* Métricas Específicas por Condição */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">📊 Métricas Específicas para {currentConfig.name}</h4>
          <div className="text-sm text-gray-600">
            <p><strong>Foco Principal:</strong> {currentConfig.metrics.primary}</p>
            <p><strong>Áreas Secundárias:</strong> {currentConfig.metrics.secondary.join(' | ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
