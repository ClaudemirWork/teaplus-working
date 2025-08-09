'use client'

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale, ArcElement, BarElement } from 'chart.js';
import { Line, Radar, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  BarElement
);

const DashboardCharts: React.FC = () => {
  // Configurações de cores do TeaPlus
  const colors = {
    tea: '#10B981', // Verde TEA
    tdah: '#3B82F6', // Azul TDAH
    intersection: '#8B5CF6', // Roxo Interseção
    background: '#F0F9FF',
    text: '#1F2937'
  };

  // Dados para gráfico de evolução temporal
  const evolutionData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Progresso TEA',
        data: [45, 52, 58, 65, 70, 75],
        borderColor: colors.tea,
        backgroundColor: `${colors.tea}20`,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Progresso TDAH',
        data: [40, 48, 55, 62, 67, 70],
        borderColor: colors.tdah,
        backgroundColor: `${colors.tdah}20`,
        tension: 0.4,
        fill: true,
      }
    ],
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dashboard de Progresso TeaPlus
        </h1>
        <p className="text-gray-600">
          Acompanhamento integrado TEA + TDAH
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Progresso TEA</h3>
          <div className="text-3xl font-bold text-green-600">73%</div>
          <p className="text-sm text-gray-500 mt-1">Média geral</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Progresso TDAH</h3>
          <div className="text-3xl font-bold text-blue-600">68%</div>
          <p className="text-sm text-gray-500 mt-1">Média geral</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Zona de Interseção</h3>
          <div className="text-3xl font-bold text-purple-600">78%</div>
          <p className="text-sm text-gray-500 mt-1">Atividades combinadas</p>
        </div>
      </div>

      {/* Mensagem temporária */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🚀 Dashboard em Desenvolvimento
        </h2>
        <p className="text-gray-600 mb-4">
          Gráficos interativos serão implementados após instalação das dependências.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-green-800 font-semibold">📊 Evolução</div>
            <div className="text-sm text-green-600">Temporal TEA vs TDAH</div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="text-blue-800 font-semibold">🎯 Radar</div>
            <div className="text-sm text-blue-600">Habilidades específicas</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <div className="text-purple-800 font-semibold">⚡ Interseção</div>
            <div className="text-sm text-purple-600">Atividades combinadas</div>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg">
            <div className="text-orange-800 font-semibold">📈 Progresso</div>
            <div className="text-sm text-orange-600">Semanal e mensal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
