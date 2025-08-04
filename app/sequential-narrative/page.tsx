'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SequentialNarrative() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const handleStartActivity = () => {
    if (selectedLevel) {
      router.push(`/sequential-narrative/${selectedLevel}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Botao Voltar - Topo */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/combined')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Voltar ao Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Narrativa Sequencial</h1>
          <p className="text-lg text-gray-600">Desenvolva habilidades de organizacao de historias e comunicacao</p>
        </div>

        {/* Objetivo da Atividade */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">🎯</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Objetivo da Atividade</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Desenvolver habilidades de <strong>sequenciamento narrativo</strong> e <strong>mentalizacao</strong>, 
            aprendendo a organizar eventos em ordem cronologica, expressar pensamentos e emocoes, 
            e compreender perspectivas de diferentes personagens nas historias.
          </p>
        </div>

        {/* Tres Tipos de Coerencia */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">📍</span>
              <h3 className="font-semibold text-blue-800">CONTEXTUAL</h3>
            </div>
            <p className="text-blue-700 text-sm">Quando e onde aconteceu a historia</p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">⏰</span>
              <h3 className="font-semibold text-green-800">CRONOLOGICA</h3>
            </div>
            <p className="text-green-700 text-sm">Sequencia temporal dos eventos</p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">💭</span>
              <h3 className="font-semibold text-orange-800">TEMATICA</h3>
            </div>
            <p className="text-orange-700 text-sm">Reflexoes pessoais e emocoes</p>
          </div>
        </div>

        {/* Como Funciona */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">⚙️</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Como Funciona</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-purple-600 font-semibold">1</span>
              </div>
              <div>
                <p className="text-gray-700">Voce recebera uma historia desordenada ou elementos para criar uma narrativa</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-purple-600 font-semibold">2</span>
              </div>
              <div>
                <p className="text-gray-700">Organize os eventos em ordem cronologica (inicio, meio, fim)</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <div>
                <p className="text-gray-700">Adicione detalhes contextuais (quando, onde, quem)</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-purple-600 font-semibold">4</span>
              </div>
              <div>
                <p className="text-gray-700">Inclua pensamentos, emocoes e reflexoes dos personagens</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-purple-600 font-semibold">5</span>
              </div>
              <div>
                <p className="text-gray-700">Receba feedback sobre coerencia e sugestoes de melhoria</p>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">✨</span>
            Beneficios desta Atividade
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Melhora organizacao de pensamentos</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Desenvolve habilidades de comunicacao</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Aumenta compreensao de perspectivas</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Fortalece memoria sequencial</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Pratica mentalizacao (teoria da mente)</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Reduz ansiedade em interacoes sociais</span>
            </div>
          </div>
        </div>

        {/* Escolha o Nivel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">🎚️</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Escolha o Nivel</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedLevel('beginner')}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedLevel === 'beginner'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 text-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🌟</div>
                <h3 className="font-semibold mb-2">Iniciante</h3>
                <p className="text-sm">3 elementos para sequenciar</p>
                <p className="text-xs mt-1">Historias simples do cotidiano</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedLevel('intermediate')}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedLevel === 'intermediate'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-orange-300 text-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">⭐</div>
                <h3 className="font-semibold mb-2">Intermediario</h3>
                <p className="text-sm">5 elementos para sequenciar</p>
                <p className="text-xs mt-1">Historias com conflitos sociais</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedLevel('advanced')}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedLevel === 'advanced'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-purple-300 text-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-semibold mb-2">Avancado</h3>
                <p className="text-sm">7 elementos para sequenciar</p>
                <p className="text-xs mt-1">Narrativas complexas multiperspectiva</p>
              </div>
            </button>
          </div>
        </div>

        {/* Botao Iniciar */}
        <div className="text-center">
          <button
            onClick={handleStartActivity}
            disabled={!selectedLevel}
            className={`px-8 py-4 rounded-full text-white font-semibold text-lg transition-all ${
              selectedLevel
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedLevel ? '▶ Iniciar Atividade de Narrativa' : 'Selecione um nivel primeiro'}
          </button>
        </div>
      </div>
    </div>
  );
}