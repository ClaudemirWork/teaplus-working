'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SocialRoutines() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const handleStartActivity = () => {
    if (selectedLevel) {
      router.push(`/social-routines/${selectedLevel}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Botao Voltar - Topo */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Voltar ao Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rotinas Sociais</h1>
          <p className="text-lg text-gray-600">Aprenda e pratique interacoes sociais estruturadas</p>
        </div>

        {/* Objetivo da Atividade */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">🎯</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Objetivo da Atividade</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Desenvolver <strong>rotinas sociais estruturadas</strong> através de scripts visuais e práticas guiadas, 
            aprendendo a navegar situações sociais comuns com confiança e previsibilidade, 
            reduzindo ansiedade e melhorando interações interpessoais.
          </p>
        </div>

        {/* Elementos das Rotinas Sociais */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">📝</span>
              <h3 className="font-semibold text-blue-800">SCRIPTS SOCIAIS</h3>
            </div>
            <p className="text-blue-700 text-sm">Sequencias estruturadas para interacoes</p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🔄</span>
              <h3 className="font-semibold text-green-800">PRATICA REPETIDA</h3>
            </div>
            <p className="text-green-700 text-sm">Exercicios consistentes para automatizacao</p>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🌱</span>
              <h3 className="font-semibold text-orange-800">GENERALIZACAO</h3>
            </div>
            <p className="text-orange-700 text-sm">Aplicacao em novos contextos sociais</p>
          </div>
        </div>

        {/* Como Funciona */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-lg">⚙️</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Como Funciona</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-green-600 font-semibold">1</span>
              </div>
              <div>
                <p className="text-gray-700">Observe o script visual da interacao social passo a passo</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-green-600 font-semibold">2</span>
              </div>
              <div>
                <p className="text-gray-700">Pratique cada etapa da rotina social em ambiente seguro</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-green-600 font-semibold">3</span>
              </div>
              <div>
                <p className="text-gray-700">Escolha as respostas adequadas para cada situacao</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-green-600 font-semibold">4</span>
              </div>
              <div>
                <p className="text-gray-700">Receba feedback imediato sobre suas escolhas sociais</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-green-600 font-semibold">5</span>
              </div>
              <div>
                <p className="text-gray-700">Pratique a generalizacao para contextos similares</p>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">✨</span>
            Beneficios desta Atividade
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Reduz ansiedade social</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Melhora previsibilidade das interacoes</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Desenvolve scripts automaticos</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Aumenta confianca em contextos sociais</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Facilita inclusao em grupos</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Promove independencia social</span>
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
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-green-300 text-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">👋</div>
                <h3 className="font-semibold mb-2">Iniciante</h3>
                <p className="text-sm">Cumprimentos basicos</p>
                <p className="text-xs mt-1">Scripts simples de saudacao</p>
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
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold mb-2">Intermediario</h3>
                <p className="text-sm">Conversa social</p>
                <p className="text-xs mt-1">Interacoes mais elaboradas</p>
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
                <div className="text-3xl mb-2">🎭</div>
                <h3 className="font-semibold mb-2">Avancado</h3>
                <p className="text-sm">Situacoes complexas</p>
                <p className="text-xs mt-1">Contextos sociais desafiadores</p>
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
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedLevel ? '▶ Iniciar Rotinas Sociais' : 'Selecione um nivel primeiro'}
          </button>
        </div>
      </div>
    </div>
  );
}