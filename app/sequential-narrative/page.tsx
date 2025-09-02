'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Trophy, Gamepad2, Star, Sparkles, ChevronRight, Award, Lock, ArrowLeft } from 'lucide-react';

export default function SequentialNarrativeGame() {
  const router = useRouter(); 

  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [unlockedLevels, setUnlockedLevels] = useState(['beginner']);

  const levelsData = [
    { id: 'beginner', name: 'Iniciante', icon: <Star className="h-12 w-12 text-yellow-400 fill-yellow-400" />, color: 'from-green-400 to-blue-400', description: 'Rotinas diárias, brincadeiras e emoções simples.', details: '3 elementos • 50 histórias', stories: ['Acordando', 'Tomando banho', 'Indo à escola', 'Brincando'] },
    { id: 'intermediate', name: 'Intermediário', icon: <Star className="h-12 w-12 text-gray-400" />, color: 'from-gray-300 to-gray-400', description: 'Situações sociais e resolução de problemas.', details: '5 elementos • 30 histórias' },
    { id: 'advanced', name: 'Avançado', icon: <Trophy className="h-12 w-12 text-gray-400" />, color: 'from-gray-300 to-gray-400', description: 'Narrativas complexas com múltiplas emoções.', details: '7 elementos • 20 histórias' },
  ];

  // TELA INICIAL COM NOVO DESIGN APLICADO
  const LandingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-sm">
        <div className="relative bg-white/90 backdrop-blur-xl rounded-[40px] shadow-2xl p-6 text-center transition-transform duration-300 hover:scale-[1.03]">
          {/* Elementos decorativos flutuantes */}
          <div className="absolute -top-5 -left-5 w-16 h-16 bg-yellow-300 rounded-full opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-8 -right-4 w-20 h-20 bg-pink-300 rounded-full opacity-60 animate-pulse delay-75"></div>

          {/* Título com Novo Estilo */}
          <div className="mb-4 inline-block">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 flex flex-col items-center gap-2">
              <span className="bg-purple-200 px-4 py-1 rounded-xl shadow-md transform -rotate-2">
                Estórias
              </span>
              <span className="bg-pink-200 px-4 py-1 rounded-xl shadow-md transform rotate-2">
                Embaralhadas
              </span>
            </h1>
          </div>

          <div className="flex justify-center gap-1.5 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>

          {/* Card dos Mascotes Melhorado */}
          <div className="relative mb-4">
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-3 shadow-inner z-10">
               <img
                src="/images/mascotes/Leo-Mila-perdidos.png"
                alt="Leo e Mila parecendo confusos"
                className="w-full rounded-2xl"
              />
            </div>
          </div>
          
          {/* Botão */}
          <div className="relative z-20">
            <button
              onClick={() => setCurrentScreen('instructions')}
              className="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-2xl py-4 px-8 rounded-full shadow-xl transform hover:scale-105 active:scale-100 transition-all duration-300"
            >
              <Sparkles className="h-7 w-7 transition-transform group-hover:rotate-12" />
              <span>Iniciar Aventura</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4 pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Como Jogar</h2>
          <p className="text-white/90 text-md md:text-lg">Organize as histórias para ganhar estrelas!</p>
        </div>
        <div className="space-y-4">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-xl"><BookOpen className="h-8 w-8 text-purple-600" /></div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sua Missão</h3>
                <p className="text-gray-600">
                  Você receberá cartões com partes de uma história fora de ordem. Sua missão é arrastá-los para a sequência certa!
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-xl"><Trophy className="h-8 w-8 text-yellow-600" /></div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Conquistas e Prêmios</h3>
                <ul className="text-gray-600 space-y-2 list-disc list-inside">
                  <li>Ganhe estrelas por cada história organizada.</li>
                  <li>Desbloqueie níveis mais desafiadores.</li>
                  <li>Conquiste badges especiais de narrador.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 pb-8">
          <button
            onClick={() => setCurrentScreen('levels')}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl py-4 px-10 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
          >
            <Gamepad2 className="h-7 w-7" />
            <span>Vamos Jogar!</span>
          </button>
        </div>
      </div>
    </div>
  );

  const LevelsScreen = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between p-4 mb-6">
            <button
              onClick={() => setCurrentScreen('instructions')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Voltar</span>
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Escolha seu Nível</h2>
            <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1">
              <span className="text-lg font-bold text-yellow-700">0</span>
              <Star className="h-5 w-5 text-yellow-600 fill-yellow-500" />
            </div>
          </div>
          <div className="space-y-6">
            {levelsData.map((level) => {
              const isUnlocked = unlockedLevels.includes(level.id);
              const isSelected = selectedLevel === level.id;
              return (
                <div
                  key={level.id}
                  onClick={() => isUnlocked && setSelectedLevel(level.id)}
                  className={`rounded-2xl shadow-lg border-4 transition-all duration-300 ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed bg-gray-100'} ${isSelected && isUnlocked ? 'border-blue-500 scale-105' : 'border-transparent'}`}
                >
                  <div className={`flex flex-col md:flex-row items-center p-4 rounded-t-xl bg-gradient-to-r ${isUnlocked ? level.color : 'from-gray-300 to-gray-400'}`}>
                    <div className="mb-2 md:mb-0 md:mr-6">{level.icon}</div>
                    <div className="text-center md:text-left text-white">
                      <h3 className="text-2xl font-bold">{level.name}</h3>
                      <p className="text-sm opacity-90">{level.details}</p>
                    </div>
                    {!isUnlocked && (<div className="md:ml-auto mt-2 md:mt-0"><Lock className="h-8 w-8 text-white/70" /></div>)}
                  </div>
                  {isUnlocked && (
                    <div className="bg-white p-6 rounded-b-xl">
                      <p className="text-gray-700 font-medium">{level.description}</p>
                      {level.stories && (<div className="flex flex-wrap gap-2 mt-4">{level.stories.map((story, i) => (<span key={i} className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">{story}</span>))}</div>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8 pb-8">
            <button
              onClick={() => {
                if (selectedLevel) {
                  router.push(`/sequential-narrative/${selectedLevel}`);
                }
              }}
              disabled={!selectedLevel || !unlockedLevels.includes(selectedLevel)}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl py-4 px-10 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            >
              <Gamepad2 className="h-7 w-7" />
              <span>Começar Aventura</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'landing' && <LandingScreen />}
      {currentScreen === 'instructions' && <InstructionsScreen />}
      {currentScreen === 'levels' && <LevelsScreen />}
    </div>
  );
}
