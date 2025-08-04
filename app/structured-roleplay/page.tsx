'use client';

import { useRouter } from 'next/navigation';

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
      description: 'Situações sociais complexas, grupos maiores e dramatizações espontâneas. Habilidades avançadas de interpretação.',
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header com botão voltar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/combined')}
            className="flex items-center text-white hover:text-purple-200 transition-colors"
          >
            <span className="mr-2">←</span>
            Voltar à seleção
          </button>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          {/* Título e Descrição */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-6xl mr-4">🎭</span>
              <h1 className="text-4xl font-bold text-gray-800">Role-Play Estruturado</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Desenvolvendo habilidades sociais através de dramatização dirigida
            </p>
          </div>

          {/* Objetivo da Atividade */}
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-3">Objetivo da Atividade</h2>
                <p className="text-blue-700 mb-4">
                  Aprender estratégias eficazes para interações sociais através de dramatização estruturada, 
                  desenvolvendo scripts comportamentais e aumentando a confiança em situações interpessoais.
                </p>
                
                <div className="bg-blue-100 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <span className="mr-2">📚</span>
                    O que você vai aprender:
                  </h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Como interpretar diferentes papéis sociais de forma natural</li>
                    <li>• Scripts estruturados para situações interpessoais diversas</li>
                    <li>• Leitura de linguagem corporal e expressões faciais</li>
                    <li>• Técnicas de improvisação controlada e adaptação</li>
                    <li>• Estratégias para superar ansiedade social através da prática</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Iniciar Atividades */}
          <div className="text-center mb-8">
            <button
              onClick={handleStartActivity}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Iniciar Atividades
            </button>
          </div>

          {/* Níveis de Dificuldade */}
          <div className="mb-6">
            <div className="flex items-center justify-center mb-6">
              <span className="text-3xl mr-3">🎮</span>
              <h2 className="text-2xl font-bold text-gray-800">Níveis de Dificuldade</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {levels.map((level) => (
                <div
                  key={level.id}
                  onClick={() => handleLevelClick(level.id)}
                  className={`${level.bgColor} ${level.borderColor} border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${!level.available ? 'opacity-50 cursor-not-allowed' : ''}`}
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

                  {level.available && (
                    <div className="text-center mt-4">
                      <span className={`${level.textColor} text-xs font-semibold bg-white bg-opacity-50 px-3 py-1 rounded-full`}>
                        Disponível
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé Informativo */}
        <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
          <h3 className="text-white font-bold text-lg mb-2">💡 Dica Importante</h3>
          <p className="text-white text-sm opacity-90">
            O Role-Play Estruturado é uma ferramenta poderosa para desenvolvimento social. 
            Pratique em ambiente seguro antes de aplicar as habilidades em situações reais.
          </p>
        </div>
      </div>
    </div>
  );
}