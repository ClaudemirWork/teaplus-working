'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function StructuredRoleplay() {
  const router = useRouter();

  const levels = [
    {
      id: 'beginner',
      number: 1,
      title: 'Básico',
      color: 'green',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
      textColor: 'text-green-800',
      description: 'Situações simples do cotidiano com scripts estruturados. Foco em papéis básicos e diálogos dirigidos.',
      available: true
    },
    {
      id: 'intermediate', 
      number: 2,
      title: 'Intermediário',
      color: 'orange',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-300', 
      textColor: 'text-orange-800',
      description: 'Dramatizações em grupos pequenos e situações semi-estruturadas. Introdução de improvisação controlada.',
      available: true
    },
    {
      id: 'advanced',
      number: 3, 
      title: 'Avançado',
      color: 'red',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
      textColor: 'text-red-800', 
      description: 'Situações sociais complexas, grupos maiores e dramatizações espontâneas. Habilidades avançadas.',
      available: true
    }
  ];

  const handleLevelClick = (levelId: string) => {
    router.push(`/structured-roleplay/${levelId}`);
  };

  const handleStartActivity = () => {
    router.push('/structured-roleplay/beginner');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              🎭 Role-Play Estruturado
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">
              Desenvolvendo habilidades sociais através de dramatização dirigida
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-3">Objetivo da Atividade</h2>
                <p className="text-blue-700 mb-4">
                  Aprender estratégias eficazes para interações sociais, desenvolvendo scripts comportamentais e aumentando a confiança.
                </p>
                <div className="bg-blue-100 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <span className="mr-2">📚</span> O que você vai aprender:
                  </h3>
                  <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
                    <li>Como interpretar diferentes papéis sociais</li>
                    <li>Scripts estruturados para situações diversas</li>
                    <li>Leitura de linguagem corporal e expressões</li>
                    <li>Técnicas de improvisação controlada</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleStartActivity}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all"
            >
              Iniciar Atividades
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Níveis de Dificuldade</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {levels.map((level) => (
              <div
                key={level.id}
                onClick={() => handleLevelClick(level.id)}
                className={`${level.bgColor} ${level.borderColor} border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105`}
              >
                <div className="text-center mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                    level.color === 'green' ? 'bg-green-500' : 
                    level.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                  } text-white font-bold text-lg mb-3`}>
                    {level.number}
                  </div>
                  <h3 className={`text-xl font-bold ${level.textColor} mb-2`}>
                    Nível {level.number}: {level.title}
                  </h3>
                </div>
                <p className={`${level.textColor} text-sm text-center leading-relaxed`}>
                  {level.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
