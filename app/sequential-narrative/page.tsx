'use client';
import React, { useState } from 'react';
import { BookOpen, Trophy, Gamepad2, Star, Sparkles, ChevronRight, Award, Lock, ArrowLeft } from 'lucide-react';

export default function SequentialNarrativeGame() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing', 'instructions', 'levels', 'gameplay'
  const [selectedLevel, setSelectedLevel] = useState('beginner'); // Nível iniciante selecionado por padrão
  const [unlockedLevels, setUnlockedLevels] = useState(['beginner']); // Apenas o iniciante está desbloqueado

  // --- DADOS DOS NÍVEIS ---
  const levelsData = [
    {
      id: 'beginner',
      name: 'Iniciante',
      icon: <Star className="h-12 w-12 text-yellow-400 fill-yellow-400" />,
      color: 'from-green-400 to-blue-400',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300',
      details: '3 elementos • 50 histórias',
      description: 'Rotinas diárias, brincadeiras e emoções simples.',
      stories: ['Acordando', 'Tomando banho', 'Indo à escola', 'Brincando']
    },
    {
      id: 'intermediate',
      name: 'Intermediário',
      icon: <Star className="h-12 w-12 text-gray-400" />, // Ícone cinza para bloqueado
      color: 'from-gray-300 to-gray-400',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-500',
      borderColor: 'border-gray-200',
      details: '5 elementos • 30 histórias',
      description: 'Situações sociais e resolução de problemas.',
      stories: ['Fazendo amigos', 'Pedindo desculpas', 'Ajudando colegas', 'Festas']
    },
    {
      id: 'advanced',
      name: 'Avançado',
      icon: <Trophy className="h-12 w-12 text-gray-400" />, // Ícone cinza para bloqueado
      color: 'from-gray-300 to-gray-400',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-500',
      borderColor: 'border-gray-200',
      details: '7 elementos • 20 histórias',
      description: 'Narrativas complexas com múltiplas emoções.',
      stories: ['Mudança de escola', 'Superando medos', 'Projetos em equipe', 'Descobertas']
    },
  ];

  // --- TELA 1: LANDING PAGE (RESPONSIVA) ---
  const LandingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="text-center mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-pulse">
              Estórias Embaralhadas
            </h1>
            <div className="flex justify-center gap-2 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 fill-yellow-400 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>

          <div className="relative mb-6">
            <img
              src="/images/mascotes/Leo-Mila-perdidos.png" // Verifique se o caminho da imagem está correto
              alt="Leo e Mila parecendo confusos"
              className="relative w-full max-w-sm mx-auto rounded-2xl shadow-xl"
            />
            <div className="absolute top-2 left-2 bg-yellow-300 rounded-full p-2 sm:p-3 shadow-lg animate-bounce">
              <span className="text-xl sm:text-2xl">📚</span>
            </div>
            <div className="absolute top-2 right-2 bg-pink-300 rounded-full p-2 sm:p-3 shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
              <span className="text-xl sm:text-2xl">✨</span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentScreen('instructions')}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl sm:text-2xl py-4 px-8 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
              <span>Iniciar Aventura</span>
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 hidden sm:inline-block group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- TELA 2: INSTRUÇÕES (SIMPLIFICADA) ---
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

  // --- TELA 3: SELEÇÃO DE NÍVEIS (OTIMIZADA) ---
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
                  className={`
                    rounded-2xl shadow-lg border-4 transition-all duration-300
                    ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed bg-gray-100'}
                    ${isSelected && isUnlocked ? 'border-blue-500 scale-105' : 'border-transparent'}
                  `}
                >
                  <div className={`flex flex-col md:flex-row items-center p-4 rounded-t-xl bg-gradient-to-r ${isUnlocked ? level.color : 'from-gray-300 to-gray-400'}`}>
                    <div className="mb-2 md:mb-0 md:mr-6">{level.icon}</div>
                    <div className="text-center md:text-left text-white">
                      <h3 className="text-2xl font-bold">{level.name}</h3>
                      <p className="text-sm opacity-90">{level.details}</p>
                    </div>
                    {!isUnlocked && (
                      <div className="md:ml-auto mt-2 md:mt-0">
                        <Lock className="h-8 w-8 text-white/70" />
                      </div>
                    )}
                  </div>
                  
                  {isUnlocked && (
                    <div className="bg-white p-6 rounded-b-xl">
                      <p className="text-gray-700 font-medium mb-4">{level.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {level.stories.map((story, i) => (
                          <span key={i} className={`text-xs font-semibold px-3 py-1 rounded-full ${level.bgColor} ${level.textColor}`}>
                            {story}
                          </span>
                        ))}
                      </div>
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
                      // AQUI É ONDE A MÁGICA ACONTECE E O JOGO COMEÇA
                      setCurrentScreen('gameplay');
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

  // --- TELA 4: GAMEPLAY (PLACEHOLDER) ---
  const GamePlayScreen = () => {
    const currentLevelData = levelsData.find(l => l.id === selectedLevel);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
             <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Aventura Começou!</h2>
                <p className="text-lg text-gray-600 mb-2">
                    Nível selecionado: <span className="font-bold text-purple-600">{currentLevelData?.name}</span>
                </p>
                <p className="text-gray-500">
                    (Aqui você irá construir a lógica do seu jogo de arrastar e soltar os cartões da história)
                </p>
                <button
                    onClick={() => setCurrentScreen('levels')}
                    className="mt-8 flex items-center gap-2 text-white font-semibold bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Voltar para Níveis
                </button>
             </div>
        </div>
    );
  };


  // --- RENDERIZAÇÃO PRINCIPAL ---
  return (
    <div className="min-h-screen">
      {currentScreen === 'landing' && <LandingScreen />}
      {currentScreen === 'instructions' && <InstructionsScreen />}
      {currentScreen === 'levels' && <LevelsScreen />}
      {currentScreen === 'gameplay' && <GamePlayScreen />}
    </div>
  );
}
