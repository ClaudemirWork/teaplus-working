'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importe o useRouter

export default function EmotionThermometerPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [points, setPoints] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const router = useRouter(); // Inicie o router

  const exercises = [
    {
      title: 'Termômetro da Alegria',
      scenario: 'Você acabou de receber uma notícia muito boa: foi aprovado na escola dos seus sonhos!',
      emotion: 'Alegria',
      correctMin: 8,
      correctMax: 10,
      explanation: 'Receber uma notícia excelente geralmente causa alegria intensa (8-10). É normal sentir muita felicidade em momentos especiais!'
    },
    {
      title: 'Termômetro da Ansiedade',
      scenario: 'Você tem uma apresentação importante amanhã e ainda não terminou de preparar. Está começando a se preocupar.',
      emotion: 'Ansiedade',
      correctMin: 5,
      correctMax: 7,
      explanation: 'Preocupações com responsabilidades futuras causam ansiedade moderada (5-7). É uma reação normal que nos motiva a nos preparar!'
    },
    {
      title: 'Termômetro da Tristeza',
      scenario: 'Seu melhor amigo se mudou para outra cidade e vocês se despediram hoje. Você está sentindo sua falta.',
      emotion: 'Tristeza',
      correctMin: 6,
      correctMax: 8,
      explanation: 'Separações de pessoas queridas causam tristeza considerável (6-8). É natural sentir saudade quando perdemos conexões importantes!'
    },
    {
      title: 'Termômetro da Raiva',
      scenario: 'Alguém pegou seu lanche sem pedir e quando você foi procurar, não encontrou. Descobriu que foi jogado fora.',
      emotion: 'Raiva',
      correctMin: 4,
      correctMax: 6,
      explanation: 'Situações de desrespeito geram raiva moderada (4-6). É importante reconhecer a raiva para escolher como expressá-la adequadamente!'
    },
    {
      title: 'Termômetro do Medo',
      scenario: 'Você está sozinho em casa à noite e ouve um barulho estranho vindo do quintal.',
      emotion: 'Medo',
      correctMin: 6,
      correctMax: 8,
      explanation: 'Situações desconhecidas e potencialmente perigosas geram medo moderado a alto (6-8). O medo nos protege nos alertando para possíveis perigos!'
    }
  ];

  const currentEx = exercises[currentExercise];

  const getButtonColor = (level) => {
    if (level <= 2) return 'bg-green-400 hover:bg-green-500';
    if (level <= 4) return 'bg-yellow-400 hover:bg-yellow-500';
    if (level <= 6) return 'bg-orange-400 hover:bg-orange-500';
    if (level <= 8) return 'bg-red-400 hover:bg-red-500';
    return 'bg-red-600 hover:bg-red-700';
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentExercise(0);
    setPoints(0);
    setExerciseStarted(false);
    setSelectedLevel(null);
    setShowFeedback(false);
  };

  const handleStartExercise = () => {
    setExerciseStarted(true);
    setSelectedLevel(null);
    setShowFeedback(false);
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
  };

  const handleSubmit = () => {
    if (selectedLevel === null) return;
    
    setShowFeedback(true);
    const isCorrect = selectedLevel >= currentEx.correctMin && selectedLevel <= currentEx.correctMax;
    
    if (isCorrect) {
      setPoints(points + 10);
    }
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setExerciseStarted(false);
      setSelectedLevel(null);
      setShowFeedback(false);
    }
  };

  const isCorrect = selectedLevel !== null && selectedLevel >= currentEx.correctMin && selectedLevel <= currentEx.correctMax;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* ===== BOTÃO 1 CORRIGIDO ===== */}
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center"
              >
                <span className="text-xl">←</span>
                <span className="ml-2">Voltar</span>
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🌡️</span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Termômetro de Emoções</h1>
              </div>
            </div>
            
            {gameStarted && (
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Pontos: <span className="font-bold text-red-600">{points}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Exercício <span className="font-bold">{currentExercise + 1}</span>/{exercises.length}
                </div>
              </div>
            )}
          </div>
          
          {gameStarted && (
            // ===== BOTÃO 2 CORRIGIDO =====
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <span className="text-xl">←</span>
              <span className="ml-2">Voltar</span>
            </button>
          )}
        </div>

        {!gameStarted ? (
          <div>
            {/* Description */}
            <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Desenvolva consciência emocional através da identificação e medição da intensidade 
              das emoções em diferentes situações do dia a dia
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg border-l-4 border-red-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🎯</span>
                  <h3 className="text-lg font-semibold text-red-600">Objetivo:</h3>
                </div>
                <p className="text-gray-700">
                  Desenvolver consciência emocional através da identificação e medição da intensidade 
                  das emoções em diferentes situações do dia a dia
                </p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-blue-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">👑</span>
                  <h3 className="text-lg font-semibold text-blue-600">Pontuação:</h3>
                </div>
                <p className="text-gray-700">
                  Cada avaliação correta = +10 pontos. Você precisa de 50 pontos 
                  para completar a atividade com sucesso
                </p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-purple-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">📊</span>
                  <h3 className="text-lg font-semibold text-purple-600">Níveis:</h3>
                </div>
                <div className="text-gray-700">
                  <p><strong className="text-purple-600">Nível 1:</strong> Emoções básicas (alegria, tristeza, raiva)</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> Emoções complexas (ansiedade, frustração)</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> Situações mistas e autoavaliação avançada</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-green-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🏁</span>
                  <h3 className="text-lg font-semibold text-green-600">Final:</h3>
                </div>
                <p className="text-gray-700">
                  Complete os 3 níveis com 50 pontos para finalizar a atividade 
                  e dominar a identificação emocional
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center mb-8">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-red-400 to-orange-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Começar Atividade
              </button>
            </div>

            {/* Base Científica */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <span className="text-xl mr-2">🧠</span>
                <h3 className="text-lg font-semibold text-gray-800">Base Científica:</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Este exercício é baseado em princípios de Inteligência Emocional e terapias cognitivo-comportamentais 
                para pessoas com TEA. O desenvolvimento da consciência emocional através de escalas visuais 
                melhora significativamente a autorregulação e a comunicação de estados internos.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                {currentEx.title}
              </h2>
              
              {!exerciseStarted ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {currentEx.scenario}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleStartExercise}
                    className="w-full md:w-auto bg-gradient-to-r from-red-400 to-orange-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Iniciar Exercício
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-6">
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                      {currentEx.scenario}
                    </p>
                    <p className="text-gray-800 font-semibold text-lg">
                      Em uma escala de 1 a 10, qual o nível da sua <strong>{currentEx.emotion}</strong> nesta situação?
                    </p>
                  </div>

                  {/* Termômetro Visual */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-center mb-4">Termômetro da {currentEx.emotion}</h3>
                    
                    {/* Grid responsivo para mobile */}
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3 max-w-4xl mx-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <button
                          key={level}
                          onClick={() => handleLevelSelect(level)}
                          disabled={showFeedback}
                          className={`h-12 md:h-14 rounded-lg text-white font-bold transition-all duration-200 transform hover:scale-105 text-sm md:text-base ${
                            selectedLevel === level
                              ? `${getButtonColor(level)} ring-4 ring-blue-300 scale-105`
                              : `${getButtonColor(level)} hover:ring-2 hover:ring-blue-200`
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600 mt-2 max-w-4xl mx-auto">
                      <span>Muito Baixo</span>
                      <span className="hidden md:inline">Moderado</span>
                      <span>Muito Alto</span>
                    </div>

                    {/* Legenda de cores para mobile */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
                        <span>1-2: Muito Baixo</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
                        <span>3-4: Baixo</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-orange-400 rounded mr-2"></div>
                        <span>5-6: Moderado</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
                        <span>7-8: Alto</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
                        <span>9-10: Muito Alto</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  {!showFeedback && selectedLevel !== null && (
                    <button
                      onClick={handleSubmit}
                      className="w-full md:w-auto bg-gradient-to-r from-red-400 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Confirmar Nível
                    </button>
                  )}

                  {/* Feedback */}
                  {showFeedback && (
                    <div className={`p-6 rounded-xl ${
                      isCorrect 
                        ? 'bg-green-50 border-l-4 border-green-400' 
                        : 'bg-yellow-50 border-l-4 border-yellow-400'
                    }`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl">
                          {isCorrect ? '🎉' : '💡'}
                        </span>
                        <h3 className="text-lg font-semibold">
                          {isCorrect ? 'Excelente percepção! +10 pontos' : 'Vamos refletir juntos!'}
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        {currentEx.explanation}
                      </p>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Faixa esperada:</strong> {currentEx.correctMin} a {currentEx.correctMax}
                          <br />
                          <strong>Sua resposta:</strong> {selectedLevel}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  {showFeedback && (
                    <div className="flex justify-center">
                      {currentExercise < exercises.length - 1 ? (
                        <button
                          onClick={handleNext}
                          className="w-full md:w-auto bg-gradient-to-r from-red-400 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                        >
                          Próximo Exercício →
                        </button>
                      ) : (
                        // ===== BOTÃO 3 CORRIGIDO =====
                        <button
                          onClick={() => router.push('/dashboard')}
                          className="w-full md:w-auto bg-gradient-to-r from-red-400 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                        >
                          Finalizar e Voltar ✓
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
