'use client';
import React, { useState } from 'react';
import { BookOpen, Trophy, Gamepad2, Star, Sparkles, ChevronRight, Award, Target, Lock } from 'lucide-react';

type Screen = 'landing' | 'instructions' | 'levels' | 'game';
type LevelId = 'beginner' | 'intermediate' | 'advanced';

export default function SequentialNarrativeGame() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedLevel, setSelectedLevel] = useState<LevelId | ''>('');

  /** -------------------- TELA 1: LANDING -------------------- */
  const LandingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center p-4">
      {/* Largura pensada para mobile: */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
          {/* Título */}
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Estórias Embaralhadas
            </h1>
            <div className="flex justify-center gap-1.5 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400"
                />
              ))}
            </div>
          </div>

          {/* Imagem (sem overflow no mobile) */}
          <div className="relative mb-6 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl blur-2xl opacity-40" />
            <img
              src="/images/mascotes/Leo-Mila-perdidos.png"
              alt="Leo e Mila"
              className="relative w-full h-auto mx-auto rounded-2xl shadow-xl"
            />

            {/* Balões: escondidos no mobile pra não cortar */}
            <div className="hidden sm:block">
              <div className="absolute top-4 left-4 bg-yellow-300 rounded-full p-3 shadow-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="absolute top-4 right-4 bg-pink-300 rounded-full p-3 shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
              <div className="absolute bottom-4 left-6 bg-blue-300 rounded-full p-3 shadow-lg">
                <span className="text-2xl">🎮</span>
              </div>
            </div>
          </div>

          {/* Botão Iniciar */}
          <div className="text-center">
            <button
              onClick={() => setCurrentScreen('instructions')}
              className="relative inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl py-5 rounded-full shadow-2xl active:scale-[0.98] transition"
            >
              <Sparkles className="h-6 w-6" />
              <span>Iniciar Aventura</span>
              <ChevronRight className="h-6 w-6" />
              <div className="absolute inset-0 rounded-full bg-white/10" />
            </button>
            <p className="mt-3 text-xs text-gray-500">Toque para começar sua jornada!</p>
          </div>
        </div>
      </div>
    </div>
  );

  /** -------------------- TELA 2: INSTRUÇÕES -------------------- */
  const InstructionsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">Como Jogar</h2>
          <p className="text-white/90 text-sm">Aprenda a organizar histórias de forma divertida!</p>
        </div>

        {/* Cards compactos, mobile-first */}
        <div className="space-y-4 mb-6">
          {/* O que é */}
          <div className="bg-white/95 rounded-2xl shadow-xl p-5">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2.5 rounded-xl">
                <BookOpen className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">O que é?</h3>
                <p className="text-gray-600 text-sm">
                  Você recebe cartões com partes de uma história fora de ordem. Seu desafio é colocá-los na sequência correta.
                </p>
              </div>
            </div>
          </div>

          {/* Como funciona */}
          <div className="bg-white/95 rounded-2xl shadow-xl p-5">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2.5 rounded-xl">
                <Gamepad2 className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Como funciona?</h3>
                <ol className="text-gray-600 text-sm space-y-1 list-decimal list-inside">
                  <li>Escolha o nível</li>
                  <li>Veja as cartas (eventos)</li>
                  <li>Ordene na sequência correta</li>
                  <li>Confirme para ver o resultado</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Níveis */}
          <div className="bg-white/95 rounded-2xl shadow-xl p-5">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2.5 rounded-xl">
                <Target className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Níveis</h3>
                <div className="text-gray-600 text-sm space-y-1">
                  <p>🌟 <b>Iniciante</b>: 3 elementos</p>
                  <p>⭐ <b>Intermediário</b>: 5 elementos</p>
                  <p>🏆 <b>Avançado</b>: 7 elementos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recompensas */}
          <div className="bg-white/95 rounded-2xl shadow-xl p-5">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 p-2.5 rounded-xl">
                <Trophy className="h-7 w-7 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Recompensas</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li className="flex items-center gap-2"><Award className="h-4 w-4 text-yellow-500" /> Ganhe estrelas</li>
                  <li className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" /> Desbloqueie novos temas</li>
                  <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-yellow-500" /> Badges especiais</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Jogar */}
        <div className="text-center pb-6">
          <button
            onClick={() => {
              setSelectedLevel('beginner'); // já deixa o iniciante pré-selecionado
              setCurrentScreen('levels');
            }}
            className="relative inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg py-4 rounded-full shadow-2xl active:scale-[0.98] transition"
          >
            <Gamepad2 className="h-6 w-6" />
            <span>Vamos Jogar!</span>
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );

  /** -------------------- TELA 3: NÍVEIS -------------------- */
  const LevelsScreen = () => {
    const levels: Array<{
      id: LevelId;
      name: string;
      icon: string;
      unlocked: boolean;
      colorHeader: string;
      details?: string;
      description?: string;
      stories?: string[];
    }> = [
      {
        id: 'beginner',
        name: 'Iniciante',
        icon: '🌟',
        unlocked: true,
        colorHeader: 'from-green-400 to-blue-400',
        details: '3 elementos • 50 histórias',
        description: 'Rotinas diárias, brincadeiras e emoções simples',
        stories: ['Acordando', 'Tomando banho', 'Indo à escola', 'Brincando'],
      },
      {
        id: 'intermediate',
        name: 'Intermediário',
        icon: '⭐',
        unlocked: false,
        colorHeader: 'from-blue-400 to-purple-400',
      },
      {
        id: 'advanced',
        name: 'Avançado',
        icon: '🏆',
        unlocked: false,
        colorHeader: 'from-purple-400 to-pink-400',
      },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 mb-5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentScreen('instructions')}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 transition"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
                <span>Voltar</span>
              </button>
              <h2 className="text-lg font-bold text-gray-800">Escolha seu Nível</h2>
              <div className="bg-yellow-100 px-2.5 py-0.5 rounded-full">
                <span className="text-xs font-semibold text-yellow-700">0 ⭐</span>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {levels.map((level) =>
              level.unlocked ? (
                // Iniciante (detalhado)
                <div
                  key={level.id}
                  className={`rounded-2xl overflow-hidden shadow-xl ring-2 ${
                    selectedLevel === level.id ? 'ring-blue-500' : 'ring-transparent'
                  }`}
                >
                  <button
                    onClick={() => setSelectedLevel(level.id)}
                    className="w-full text-left"
                  >
                    <div className={`bg-gradient-to-r ${level.colorHeader} p-5 text-white text-center`}>
                      <div className="text-4xl mb-1">{level.icon}</div>
                      <h3 className="text-xl font-bold">{level.name}</h3>
                      <p className="text-xs opacity-90 mt-1">{level.details}</p>
                    </div>
                    <div className="bg-white p-5">
                      <p className="text-gray-700 text-sm mb-3">{level.description}</p>
                      <div>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-1">
                          Exemplos de histórias
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {level.stories?.map((s, i) => (
                            <span key={i} className="text-[11px] px-2 py-1 rounded-full bg-green-50 border border-green-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t flex items-center justify-center text-green-600">
                        <Sparkles className="h-4 w-4 mr-1" />
                        <span className="text-sm font-semibold">Desbloqueado</span>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                // Intermediário / Avançado (box simples bloqueado)
                <div
                  key={level.id}
                  className="rounded-2xl overflow-hidden shadow-lg"
                >
                  <div className={`bg-gradient-to-r ${level.colorHeader} p-5 text-white text-center`}>
                    <div className="text-3xl mb-1">{level.icon}</div>
                    <h3 className="text-lg font-bold">{level.name}</h3>
                  </div>
                  <div className="bg-white p-4">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm">Complete o nível anterior</span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Botão Iniciar Jogo (só quando Iniciante estiver selecionado) */}
          {selectedLevel === 'beginner' && (
            <div className="text-center mt-6 pb-6">
              <button
                onClick={() => setCurrentScreen('game')}
                className="relative inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg py-4 rounded-full shadow-2xl active:scale-[0.98] transition"
              >
                <Gamepad2 className="h-6 w-6" />
                <span>Começar Aventura</span>
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  /** -------------------- TELA 4: GAME (placeholder) -------------------- */
  const GameScreen = ({ level }: { level: LevelId }) => {
    const nivelNome = level === 'beginner' ? '🌟 Iniciante' : level === 'intermediate' ? '⭐ Intermediário' : '🏆 Avançado';
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentScreen('levels')}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 transition"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
                <span>Voltar</span>
              </button>
              <h2 className="text-lg font-bold text-gray-800">Jogo — {nivelNome}</h2>
              <div />
            </div>
          </div>

          {/* Área do jogo (por enquanto placeholder) */}
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <p className="text-gray-600 mb-4">
              Aqui vai a área de cartas para ordenar. (Pronta para integrar drag & drop.)
            </p>
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-gray-400">
              Área do jogo
            </div>
          </div>
        </div>
      </div>
    );
  };

  /** -------------------- RENDER -------------------- */
  return (
    <div className="min-h-screen">
      {currentScreen === 'landing' && <LandingScreen />}
      {currentScreen === 'instructions' && <InstructionsScreen />}
      {currentScreen === 'levels' && <LevelsScreen />}
      {currentScreen === 'game' && selectedLevel && <GameScreen level={selectedLevel} />}
    </div>
  );
}
