'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardCharts from '@/components/charts/DashboardCharts';
import { fetchAllSessions } from './dashboardUtils';

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const data = await fetchAllSessions();
    setSessions(data);
    setLoading(false);
  };

  const handleBack = () => {
    router.push('/profileselection');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com botão voltar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
              <span className="font-medium">Voltar</span>
            </button>
            
            <h1 className="text-lg font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
              Dashboard de Progresso
            </h1>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>
      
      {/* Conteúdo do Dashboard */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando dados...</p>
        </div>
      ) : (
        <DashboardCharts sessions={sessions} />
      )}
    </div>
  );
}
