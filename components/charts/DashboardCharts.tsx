'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { format, subDays, isAfter, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronDown, ChevronUp, Search, Filter, TrendingUp, TrendingDown, Activity, Brain, Heart, Eye, MessageSquare, Target } from 'lucide-react';

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

// Mini componente Sparkline
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
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle expansão de domínio
  const toggleDomain = (domain: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domain)) {
      newExpanded.delete(domain);
    } else {
      newExpanded.add(domain);
    }
    setExpandedDomains(newExpanded);
  };

  // Ícones por domínio
  const domainIcons = {
    'Comunicação': <MessageSquare className="w-5 h-5" />,
    'Interação Social': <Heart className="w-5 h-5" />,
    'Atenção/Foco': <Target className="w-5 h-5" />,
    'Regulação': <Activity className="w-5 h-5" />,
    'Funções Executivas': <Brain className="w-5 h-5" />,
    'Memória': <Brain className="w-5 h-5" />,
    'Comportamento Adaptativo': <Eye className="w-5 h-5" />,
    'Habilidades Motoras': <Activity className="w-5 h-5" />,
    'Linguagem': <MessageSquare className="w-5 h-5" />
  };
  
  // CONFIGURAÇÃO COMPLETA COM 92 ATIVIDADES
  const conditionConfig = {
    'TEA': {
      name: 'Transtorno do Espectro Autista',
      color: '#3B82F6',
      domains: {
        'Comunicação': [
          'CAA', 'Tom de Voz', 'Iniciando Conversas', 'Turnos de Conversação',
          'Perguntas e Respostas', 'Narrativa Pessoal', 'Descrição de Objetos',
          'Comunicação Não-Verbal', 'Gestos Comunicativos', 'Pedidos Funcionais',
          'Comentários Sociais', 'Protesto Apropriado', 'Escolhas', 'Reciprocidade Verbal',
          'Manutenção de Tópico'
        ],
        'Interação Social': [
          'Contato Visual Progressivo', 'Expressões Faciais', 'Diálogos em Cenas',
          'Reconhecimento Emocional', 'Imitação Social', 'Brincadeira Compartilhada',
          'Atenção Conjunta', 'Teoria da Mente', 'Interpretação de Contexto',
          'Leitura de Pistas Sociais', 'Resolução de Conflitos', 'Empatia'
        ],
        'Regulação': [
          'Escuta Ativa', 'Autorregulação Emocional', 'Tolerância à Frustração',
          'Flexibilidade Cognitiva', 'Transições', 'Espera', 'Compartilhamento',
          'Seguir Regras', 'Automonitoramento'
        ],
        'Comportamento Adaptativo': [
          'Rotinas Diárias', 'Higiene Pessoal', 'Alimentação', 'Vestuário',
          'Organização Pessoal', 'Segurança', 'Uso de Tecnologia', 'Mobilidade'
        ],
        'Habilidades Motoras': [
          'Coordenação Motora Fina', 'Coordenação Motora Grossa', 'Praxia',
          'Integração Bilateral', 'Planejamento Motor', 'Equilíbrio'
        ],
        'Linguagem': [
          'Vocabulário Receptivo', 'Vocabulário Expressivo', 'Sintaxe',
          'Pragmática', 'Prosódia', 'Compreensão de Instruções'
        ]
      }
    },
    'TDAH': {
      name: 'Transtorno do Déficit de Atenção',
      color: '#10B981',
      domains: {
        'Atenção': [
          'Atenção Sustentada', 'Foco Seletivo', 'Atenção Dividida',
          'Vigilância', 'Tempo de Reação', 'Detecção de Estímulos',
          'Rastreamento Visual', 'Atenção Auditiva', 'Filtro Atencional'
        ],
        'Funções Executivas': [
          'Controle Inibitório', 'Planejamento Executivo', 'Flexibilidade Cognitiva',
          'Tomada de Decisão', 'Resolução de Problemas', 'Organização',
          'Priorização', 'Gerenciamento de Tempo', 'Estabelecimento de Metas',
          'Automonitoramento', 'Iniciação de Tarefas', 'Conclusão de Tarefas'
        ],
        'Memória': [
          'Memória de Trabalho', 'Memória de Curto Prazo', 'Memória Sequencial',
          'Memória Visual', 'Memória Auditiva', 'Memória Prospectiva'
        ],
        'Controle Motor': [
          'Controle de Impulsos Motores', 'Precisão Motora', 'Tempo de Resposta',
          'Coordenação', 'Ritmo Motor', 'Inibição Motora'
        ],
        'Regulação Emocional': [
          'Controle Emocional', 'Tolerância ao Estresse', 'Manejo da Ansiedade',
          'Regulação do Humor', 'Resiliência', 'Autocalmante'
        ]
      }
    },
    'TEA+TDAH': {
      name: 'Condição Combinada',
      color: '#8B5CF6',
      domains: {
        'Comunicação e Linguagem': [
          'CAA', 'Tom de Voz', 'Iniciando Conversas', 'Turnos de Conversação',
          'Pragmática', 'Vocabulário', 'Narrativa'
        ],
        'Interação Social': [
          'Contato Visual Progressivo', 'Expressões Faciais', 'Diálogos em Cenas',
          'Reconhecimento Emocional', 'Teoria da Mente', 'Empatia'
        ],
        'Atenção e Foco': [
          'Atenção Sustentada', 'Foco Seletivo', 'Atenção Dividida',
          'Vigilância', 'Filtro Atencional'
        ],
        'Funções Executivas': [
          'Controle Inibitório', 'Planejamento', 'Flexibilidade Cognitiva',
          'Memória de Trabalho', 'Organização', 'Automonitoramento'
        ],
        'Regulação': [
          'Autorregulação Emocional', 'Tolerância à Frustração',
          'Controle de Impulsos', 'Manejo da Ansiedade'
        ],
        'Habilidades Adaptativas': [
          'Rotinas', 'Organização Pessoal', 'Transições', 'Seguir Regras'
        ]
      }
    }
  };

  // Configuração atual
  const currentConfig = conditionConfig[conditionFilter];
  const currentDomains = currentConfig.domains;
  
  // ESCALAS (para as 92 atividades)
  const activityScales = {
    // Comunicação (15 atividades)
    'CAA': { min: 0, max: 10, tipo: 'acertos', meta: 70, color: '#10B981' },
    'Tom de Voz': { min: 0, max: 300, tipo: 'pontos', meta: 70, color: '#EF4444' },
    'Iniciando Conversas': { min: 0, max: 300, tipo: 'pontos', meta: 65, color: '#84CC16' },
    'Turnos de Conversação': { min: 0, max: 100, tipo: 'turnos', meta: 75, color: '#0EA5E9' },
    'Perguntas e Respostas': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#F59E0B' },
    'Narrativa Pessoal': { min: 0, max: 100, tipo: 'pontos', meta: 65, color: '#8B5CF6' },
    'Descrição de Objetos': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#EC4899' },
    'Comunicação Não-Verbal': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#06B6D4' },
    'Gestos Comunicativos': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#10B981' },
    'Pedidos Funcionais': { min: 0, max: 100, tipo: 'pontos', meta: 80, color: '#F59E0B' },
    'Comentários Sociais': { min: 0, max: 100, tipo: 'pontos', meta: 65, color: '#8B5CF6' },
    'Protesto Apropriado': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#EF4444' },
    'Escolhas': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#84CC16' },
    'Reciprocidade Verbal': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#0EA5E9' },
    'Manutenção de Tópico': { min: 0, max: 100, tipo: 'pontos', meta: 65, color: '#EC4899' },
    
    // Interação Social (12 atividades)
    'Contato Visual Progressivo': { min: 0, max: 300, tipo: 'segundos', meta: 80, color: '#8B5CF6' },
    'Expressões Faciais': { min: 0, max: 300, tipo: 'pontos', meta: 70, color: '#F59E0B' },
    'Diálogos em Cenas': { min: 0, max: 200, tipo: 'pontos', meta: 65, color: '#EC4899' },
    'Reconhecimento Emocional': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#F97316' },
    'Imitação Social': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#10B981' },
    'Brincadeira Compartilhada': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#3B82F6' },
    'Atenção Conjunta': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#EF4444' },
    'Teoria da Mente': { min: 0, max: 100, tipo: 'pontos', meta: 60, color: '#8B5CF6' },
    'Interpretação de Contexto': { min: 0, max: 100, tipo: 'pontos', meta: 65, color: '#06B6D4' },
    'Leitura de Pistas Sociais': { min: 0, max: 100, tipo: 'pontos', meta: 65, color: '#F59E0B' },
    'Resolução de Conflitos': { min: 0, max: 100, tipo: 'pontos', meta: 60, color: '#84CC16' },
    'Empatia': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#EC4899' },
    
    // Atenção/TDAH (9 atividades existentes + expansão)
    'Atenção Sustentada': { min: 0, max: 600, tipo: 'segundos', meta: 75, color: '#3B82F6' },
    'Foco Seletivo': { min: 0, max: 100, tipo: 'pontos', meta: 80, color: '#14B8A6' },
    'Atenção Dividida': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#F59E0B' },
    'Vigilância': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#8B5CF6' },
    'Tempo de Reação': { min: 0, max: 2000, tipo: 'ms', meta: 80, color: '#06B6D4' },
    'Detecção de Estímulos': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#10B981' },
    'Rastreamento Visual': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#EF4444' },
    'Atenção Auditiva': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#F59E0B' },
    'Filtro Atencional': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#8B5CF6' },
    
    // Funções Executivas (12 atividades)
    'Controle Inibitório': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#F59E0B' },
    'Planejamento Executivo': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#8B5CF6' },
    'Flexibilidade Cognitiva': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#10B981' },
    'Memória de Trabalho': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#EF4444' },
    'Tomada de Decisão': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#3B82F6' },
    'Resolução de Problemas': { min: 0, max: 100, tipo: 'pontos', meta: 65, color: '#F59E0B' },
    'Organização': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#8B5CF6' },
    'Priorização': { min: 0, max: 100, tipo: 'pontos', meta: 65, color: '#06B6D4' },
    'Gerenciamento de Tempo': { min: 0, max: 100, tipo: 'pontos', meta: 60, color: '#10B981' },
    'Estabelecimento de Metas': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#EC4899' },
    'Automonitoramento': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#F59E0B' },
    'Iniciação de Tarefas': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#84CC16' },
    
    // Regulação (9 atividades)
    'Escuta Ativa': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#06B6D4' },
    'Autorregulação Emocional': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#EF4444' },
    'Tolerância à Frustração': { min: 0, max: 100, tipo: 'pontos', meta: 65, color: '#F59E0B' },
    'Transições': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#8B5CF6' },
    'Espera': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#10B981' },
    'Compartilhamento': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#3B82F6' },
    'Seguir Regras': { min: 0, max: 100, tipo: 'pontos', meta: 75, color: '#F59E0B' },
    'Controle Emocional': { min: 0, max: 100, tipo: 'pontos', meta: 70, color: '#EF4444' },
    'Manejo da Ansiedade': { min: 0, max: 100, tipo: 'pontos', meta: 65, color: '#8B5CF6' }
  };

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

  // Calcular consistência
  const calculateConsistency = (scores: number[]): { level: string, cv: number, color: string } => {
    if (scores.length < 2) return { level: 'Insuficiente', cv: 0, color: 'text-gray-500' };
    
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const stdDev = calculateStandardDeviation(scores);
    const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
    
    if (cv < 15) return { level: 'Alta', cv, color: 'text-green-600' };
    if (cv < 30) return { level: 'Média', cv, color: 'text-yellow-600' };
    return { level: 'Baixa', cv, color: 'text-red-600' };
  };

  // Filtrar sessões
  const filteredSessions = useMemo(() => {
    let filtered = sessions;
    
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
    
    // Filtrar por busca
    if (searchQuery) {
      filtered = filtered.filter(session =>
        session.atividade_nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [sessions, periodFilter, searchQuery]);

  // Processar dados
  const processedData = filteredSessions.map(session => ({
    ...session,
    normalized_score: normalizeScore(session.pontuacao_final, session.atividade_nome)
  }));

  // Calcular métricas agregadas por domínio
  const calculateDomainMetrics = (domainName: string, activities: string[]) => {
    const domainSessions = processedData.filter(s => 
      activities.includes(s.atividade_nome)
    );
    
    if (domainSessions.length === 0) return {
      name: domainName,
      average: 0,
      trend: 'stable',
      sessions: 0,
      lastScore: 0,
      activities: activities.length,
      completedActivities: 0,
      consistency: { level: 'N/A', cv: 0, color: 'text-gray-500' }
    };

    const scores = domainSessions.map(s => s.normalized_score);
    const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Calcular tendência
    const recent = scores.slice(-3);
    const initial = scores.slice(0, 3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const initialAvg = initial.reduce((a, b) => a + b, 0) / initial.length;
    
    let trend = 'stable';
    if (recentAvg > initialAvg + 5) trend = 'improving';
    if (recentAvg < initialAvg - 5) trend = 'declining';

    // Contar atividades únicas praticadas
    const uniqueActivities = new Set(domainSessions.map(s => s.atividade_nome));

    return {
      name: domainName,
      average,
      trend,
      sessions: domainSessions.length,
      lastScore: scores[scores.length - 1] || 0,
      activities: activities.length,
      completedActivities: uniqueActivities.size,
      consistency: calculateConsistency(scores)
    };
  };

  // Métricas agregadas
  const domainMetrics = useMemo(() => {
    return Object.entries(currentDomains).map(([domain, activities]) => 
      calculateDomainMetrics(domain, activities)
    );
  }, [processedData, currentDomains]);

  // Análise detalhada de atividades (apenas para domínios expandidos)
  const getActivityDetails = (activities: string[]) => {
    return activities.map(activity => {
      const activitySessions = processedData.filter(s => s.atividade_nome === activity);
      const scores = activitySessions.map(s => s.normalized_score);
      
      if (scores.length === 0) {
        return {
          name: activity,
          sessions: 0,
          average: 0,
          lastScore: 0,
          trend: 'new',
          sparklineData: []
        };
      }
      
      const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const lastScore = scores[scores.length - 1] || 0;
      
      let trend = 'stable';
      if (scores.length >= 2) {
        const diff = lastScore - scores[scores.length - 2];
        if (diff > 5) trend = 'improving';
        if (diff < -5) trend = 'declining';
      }
      
      return {
        name: activity,
        sessions: activitySessions.length,
        average,
        lastScore,
        trend,
        sparklineData: scores.slice(-10),
        scale: activityScales[activity]
      };
    });
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (trend === 'declining') return <TrendingDown className="w-5 h-5 text-red-600" />;
    return <Activity className="w-5 h-5 text-gray-600" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'improving') return 'text-green-600';
    if (trend === 'declining') return 'text-red-600';
    return 'text-gray-600';
  };

  // Preparar dados para gráfico temporal
  const evolutionData = useMemo(() => {
    const groupedByDate = {};
    
    processedData.forEach(session => {
      const date = format(new Date(session.data_fim), 'dd/MM', { locale: ptBR });
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = { date };
        domainMetrics.forEach(domain => {
          groupedByDate[date][domain.name] = [];
        });
      }
      
      // Identificar domínio da atividade
      Object.entries(currentDomains).forEach(([domain, activities]) => {
        if (activities.includes(session.atividade_nome)) {
          if (groupedByDate[date][domain]) {
            groupedByDate[date][domain].push(session.normalized_score);
          }
        }
      });
    });
    
    // Calcular médias
    return Object.values(groupedByDate).map((item: any) => {
      const result: any = { date: item.date };
      
      domainMetrics.forEach(domain => {
        const scores = item[domain.name] || [];
        result[domain.name] = scores.length ? 
          Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
      });
      
      return result;
    });
  }, [processedData, currentDomains, domainMetrics]);

  // Cores dos domínios
  const domainColors = {
    'Comunicação': '#10B981',
    'Interação Social': '#8B5CF6',
    'Atenção/Foco': '#3B82F6',
    'Regulação': '#F59E0B',
    'Atenção': '#3B82F6',
    'Funções Executivas': '#EF4444',
    'Memória': '#06B6D4',
    'Comportamento Adaptativo': '#EC4899',
    'Habilidades Motoras': '#84CC16',
    'Linguagem': '#F97316',
    'Controle Motor': '#14B8A6',
    'Regulação Emocional': '#A855F7',
    'Comunicação e Linguagem': '#10B981',
    'Atenção e Foco': '#3B82F6',
    'Habilidades Adaptativas': '#EC4899'
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      
      {/* Header com Seletor */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Condição em Foco</h2>
              <p className="text-sm text-gray-600">Selecione para filtrar domínios e atividades</p>
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
                <span className="text-xs opacity-80">45 atividades</span>
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
                <span className="text-xs opacity-80">37 atividades</span>
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
                <span className="text-xs opacity-80">92 atividades</span>
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
          
          {/* Filtros e Busca */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar atividade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Filtros de Período */}
            <div className="flex gap-2">
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
        </div>
      </div>

      {/* Cards de Domínios AGREGADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {domainMetrics.map((domain) => (
          <div 
            key={domain.name} 
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => toggleDomain(domain.name)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span style={{ color: domainColors[domain.name] || '#666' }}>
                    {domainIcons[domain.name] || <Brain className="w-5 h-5" />}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">{domain.name}</h3>
                </div>
                {expandedDomains.has(domain.name) ? 
                  <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                }
              </div>
              
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <span className="text-3xl font-bold text-gray-800">
                    {domain.average}%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    média geral
                  </span>
                </div>
                {getTrendIcon(domain.trend)}
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-600">Atividades</p>
                  <p className="font-semibold text-gray-800">
                    {domain.completedActivities}/{domain.activities}
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-600">Sessões</p>
                  <p className="font-semibold text-gray-800">{domain.sessions}</p>
                </div>
              </div>
              
              {/* Barra de progresso do domínio */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${domain.average}%`,
                      backgroundColor: domainColors[domain.name] || '#3B82F6'
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Área expandida com atividades do domínio */}
            {expandedDomains.has(domain.name) && (
              <div className="border-t px-6 py-4 bg-gray-50 max-h-96 overflow-y-auto">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Atividades do Domínio ({currentDomains[domain.name].length})
                </h4>
                <div className="space-y-2">
                  {getActivityDetails(currentDomains[domain.name])
                    .sort((a, b) => b.average - a.average)
                    .map(activity => (
                      <div key={activity.name} className="bg-white rounded p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{activity.name}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">
                              {activity.sessions} sessões
                            </span>
                            <span className="text-xs font-semibold text-gray-700">
                              Média: {activity.average}%
                            </span>
                            {activity.lastScore > 0 && (
                              <span className="text-xs text-gray-500">
                                Última: {activity.lastScore}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-24">
                          {activity.sparklineData.length > 0 && (
                            <Sparkline 
                              data={activity.sparklineData} 
                              color={activity.scale?.color || '#3B82F6'}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  
                  {/* Atividades ainda não praticadas */}
                  {currentDomains[domain.name]
                    .filter(activity => !processedData.some(s => s.atividade_nome === activity))
                    .map(activity => (
                      <div key={activity} className="bg-gray-100 rounded p-3 opacity-60">
                        <p className="text-sm text-gray-600">{activity}</p>
                        <p className="text-xs text-gray-500 mt-1">Ainda não praticada</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gráfico de Evolução Temporal (apenas domínios com dados) */}
      {evolutionData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📈 Evolução Temporal dos Domínios
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {domainMetrics
                .filter(d => d.sessions > 0)
                .map(domain => (
                  <Line 
                    key={domain.name}
                    type="monotone" 
                    dataKey={domain.name} 
                    stroke={domainColors[domain.name] || '#666'} 
                    strokeWidth={2}
                    connectNulls
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Resumo Executivo */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          📊 Resumo Executivo - {currentConfig.name}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Estatísticas Gerais */}
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-700 mb-2">Estatísticas Gerais</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">
                Total de Sessões: <span className="font-semibold text-gray-800">{filteredSessions.length}</span>
              </p>
              <p className="text-gray-600">
                Domínios Ativos: <span className="font-semibold text-gray-800">
                  {domainMetrics.filter(d => d.sessions > 0).length}/{domainMetrics.length}
                </span>
              </p>
              <p className="text-gray-600">
                Atividades Praticadas: <span className="font-semibold text-gray-800">
                  {new Set(processedData.map(s => s.atividade_nome)).size}
                </span>
              </p>
              <p className="text-gray-600">
                Média Global: <span className="font-semibold text-gray-800">
                  {domainMetrics.length > 0 ? 
                    Math.round(domainMetrics.reduce((a, b) => a + b.average, 0) / domainMetrics.filter(d => d.average > 0).length) 
                    : 0}%
                </span>
              </p>
            </div>
          </div>
          
          {/* Domínios em Destaque */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-green-700 mb-2">Melhores Resultados</h3>
            <div className="space-y-1 text-sm">
              {domainMetrics
                .filter(d => d.average > 0)
                .sort((a, b) => b.average - a.average)
                .slice(0, 3)
                .map(domain => (
                  <p key={domain.name} className="text-gray-600">
                    {domain.name}: <span className="font-semibold text-green-700">{domain.average}%</span>
                  </p>
                ))}
            </div>
          </div>
          
          {/* Áreas de Atenção */}
          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-semibold text-orange-700 mb-2">Áreas para Desenvolvimento</h3>
            <div className="space-y-1 text-sm">
              {domainMetrics
                .filter(d => d.completedActivities > 0 && d.average < 60)
                .sort((a, b) => a.average - b.average)
                .slice(0, 3)
                .map(domain => (
                  <p key={domain.name} className="text-gray-600">
                    {domain.name}: <span className="font-semibold text-orange-700">{domain.average}%</span>
                  </p>
                ))}
              {domainMetrics.filter(d => d.completedActivities === 0).length > 0 && (
                <p className="text-gray-600">
                  <span className="font-semibold text-orange-700">
                    {domainMetrics.filter(d => d.completedActivities === 0).length} domínios
                  </span> ainda não iniciados
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
