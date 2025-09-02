'use client';
import React, { useState } from 'react';
import { BookOpen, Trophy, Gamepad2, Star, Sparkles, ChevronRight, Award, Clock, Target, Users } from 'lucide-react';

export default function SequentialNarrativeGame() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing', 'instructions', 'levels'
  const [selectedLevel, setSelectedLevel] = useState('');

  // Tela 1: Landing Page com Mascotes
  const LandingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Container principal com animação */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
          
          {/* Título do Jogo com efeito */}
          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-pulse">
              Estórias Embaralhadas
            </h1>
            <div className="flex justify-center gap-2 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400 animate-bounce" style={{animationDelay: `${i * 0.1}s`}} />
              ))}
            </div>
          </div>

          {/* Imagem dos Mascotes */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl blur-2xl opacity-50"></div>
            <img 
              src="/images/mascotes/Leo-Mila-perdidos.png" 
              alt="Leo e Mila" 
              className="relative w-full max-w-md mx-auto rounded-2xl shadow-xl transform hover:rotate-1 transition-transform duration-300"
            />
            
            {/* Balões de fala animados */}
            <div className="absolute top-4 left-4 bg-yellow-300 rounded-full p-3 shadow-lg animate-bounce">
              <span className="text-2xl">📚</span>
            </div>
            <div className="absolute top-4 right-4 bg-pink-300 rounded-full p-3 shadow-lg animate-bounce" style={{animationDelay: '0.5s'}}>
              <span className="text-2xl">✨</span>
            </div>
            <div className="absolute bottom-4 left-8 bg-blue-300 rounded-full p-3 shadow-lg animate-bounce" style={{animationDelay: '1s'}}>
              <span className="text-2xl">🎮</span>
            </div>
          </div>

          {/* Botão Iniciar */}
          <div className="text-center">
            <button
              onClick={() => setCurrentScreen('instructions')}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-2xl py-6 px-12 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
            >
              <Sparkles className="h-8 w-8 animate-spin-slow" />
              <span>Iniciar Aventura</span>
              <ChevronRight className="h-8 w-8 group-hover:translate-x-2 transition-transform" />
              
              {/* Efeito de brilho */}
              <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
            </button>
          </div>

          {/* Indicador de rolagem */}
          <div className="text-center mt-6 text-gray-500">
            <p className="text-sm animate-pulse">Clique para começar sua jornada narrativa!</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Tela 2: Instruções e Como Jogar
  const InstructionsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Como Jogar</h2>
          <p className="text-white/90 text-lg">Aprenda a organizar histórias e desenvolva suas habilidades narrativas!</p>
        </div>

        {/* Grid de Cards Informativos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Card 1: O que é */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">O que são Estórias Embaralhadas?</h3>
                <p className="text-gray-600">
                  Um jogo divertido onde você recebe histórias com eventos fora de ordem. 
                  Sua missão é reorganizar os acontecimentos na sequência correta, 
                  criando narrativas que fazem sentido!
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Como Jogar */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Gamepad2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Como Funciona?</h3>
                <ol className="text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Escolha seu nível de dificuldade</li>
                  <li>Receba cartões com partes da história</li>
                  <li>Arraste os cartões para a ordem correta</li>
                  <li>Confirme e veja sua pontuação!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Card 3: Níveis */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Níveis de Dificuldade</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌟</span>
                    <span><strong>Iniciante:</strong> 3 elementos, histórias do dia a dia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span><strong>Intermediário:</strong> 5 elementos, situações sociais</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    <span><strong>Avançado:</strong> 7 elementos, narrativas complexas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Recompensas */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Conquistas e Prêmios</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span>Ganhe estrelas por cada história organizada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>Desbloqueie novos temas e histórias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <span>Conquiste badges especiais de narrador</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Benefícios */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Por que jogar Estórias Embaralhadas?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Desenvolve noção temporal</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Melhora habilidades sociais</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Amplia vocabulário</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full p-4 w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-pink-600" />
              </div>
              <p className="text-sm text-gray-600">Estimula criatividade</p>
            </div>
          </div>
        </div>

        {/* Botão Jogar */}
        <div className="text-center pb-8">
          <button
            onClick={() => setCurrentScreen('levels')}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl py-5 px-10 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
          >
            <Gamepad2 className="h-7 w-7" />
            <span>Vamos Jogar!</span>
            <ChevronRight className="h-7 w-7 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  // Tela 3: Seleção de Níveis (Melhorada)
  const LevelsScreen = () => {
    const levels = [
      { 
        id: 'beginner', 
        name: 'Iniciante', 
        icon: '🌟', 
        color: 'from-green-400 to-blue-400',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        details: '3 elementos • 50 histórias',
        description: 'Rotinas diárias, brincadeiras e emoções simples',
        stories: ['Acordando', 'Tomando banho', 'Indo à escola', 'Brincando']
      },
      { 
        id: 'intermediate', 
        name: 'Intermediário', 
        icon: '⭐',
        color: 'from-blue-400 to-purple-400', 
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        details: '5 elementos • 30 histórias',
        description: 'Situações sociais e resolução de problemas',
        stories: ['Fazendo amigos', 'Pedindo desculpas', 'Ajudando colegas', 'Festas']
      },
      { 
        id: 'advanced', 
        name: 'Avançado', 
        icon: '🏆',
        color: 'from-purple-400 to-pink-400',
        bgColor: 'bg-purple-50', 
        borderColor: 'border-purple-300',
        details: '7 elementos • 20 histórias',
        description: 'Narrativas complexas com múltiplas emoções',
        stories: ['Mudança de escola', 'Superando medos', 'Projetos em equipe', 'Descobertas']
      },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header com Navegação */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentScreen('instructions')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
                <span>Voltar</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Escolha seu Nível</h2>
              <div className="flex gap-2">
                {/* Placeholder para pontuação ou perfil */}
                <div className="bg-yellow-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-yellow-700">0 ⭐</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Níveis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {levels.map((level, index) => (
              <div
                key={level.id}
                className={`relative transform hover:scale-105 transition-all duration-300 ${
                  selectedLevel === level.id ? 'scale-105' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card do Nível */}
                <div
                  onClick={() => setSelectedLevel(level.id)}
                  className={`cursor-pointer rounded-2xl overflow-hidden shadow-xl ${
                    selectedLevel === level.id 
                      ? 'ring-4 ring-offset-2 ring-blue-500' 
                      : ''
                  }`}
                >
                  {/* Header Gradiente */}
                  <div className={`bg-gradient-to-r ${level.color} p-6 text-white text-center`}>
                    <div className="text-5xl mb-2">{level.icon}</div>
                    <h3 className="text-2xl font-bold">{level.name}</h3>
                    <p className="text-sm opacity-90 mt-1">{level.details}</p>
                  </div>

                  {/* Conteúdo */}
                  <div className="bg-white p-6">
                    <p className="text-gray-700 font-medium mb-3">{level.description}</p>
                    
                    {/* Preview das histórias */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Exemplos de histórias:</p>
                      <div className="flex flex-wrap gap-2">
                        {level.stories.map((story, i) => (
                          <span 
                            key={i}
                            className={`text-xs px-2 py-1 rounded-full ${level.bgColor} ${level.borderColor} border`}
                          >
                            {story}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status de Desbloqueio */}
                    <div className="mt-4 pt-4 border-t">
                      {level.id === 'beginner' ? (
                        <div className="flex items-center justify-center text-green-600">
                          <Sparkles className="h-4 w-4 mr-1" />
                          <span className="text-sm font-semibold">Desbloqueado</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-gray-400">
                          <Trophy className="h-4 w-4 mr-1" />
                          <span className="text-sm">Complete o nível anterior</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Iniciar Jogo */}
          {selectedLevel && (
            <div className="text-center mt-8 pb-8">
              <button
                onClick={() => console.log('Iniciando jogo no nível:', selectedLevel)}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl py-5 px-10 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
              >
                <Gamepad2 className="h-7 w-7 animate-pulse" />
                <span>Começar Aventura</span>
                <ChevronRight className="h-7 w-7 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderização condicional das telas
  return (
    <div className="min-h-screen">
      {currentScreen === 'landing' && <LandingScreen />}
      {currentScreen === 'instructions' && <InstructionsScreen />}
      {currentScreen === 'levels' && <LevelsScreen />}
    </div>
  );
}
