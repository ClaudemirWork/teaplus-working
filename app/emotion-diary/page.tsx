'use client';

import { useState } from 'react';

export default function EmotionDiaryPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(0);
  const [points, setPoints] = useState(0);
  const [entryStarted, setEntryStarted] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [intensity, setIntensity] = useState(0);
  const [situation, setSituation] = useState('');
  const [reflection, setReflection] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const diaryPrompts = [
    {
      title: 'Entrada da Manhã',
      timeframe: 'Como você está se sentindo hoje ao acordar?',
      guidance: 'Reflita sobre como começou o dia e o que pode ter influenciado seu estado emocional.',
      color: 'from-yellow-400 to-orange-500',
      icon: '🌅'
    },
    {
      title: 'Momento de Stress',
      timeframe: 'Descreva uma situação desafiadora que aconteceu.',
      guidance: 'Analise o que causou stress e como você reagiu emocionalmente.',
      color: 'from-red-400 to-pink-500',
      icon: '⚡'
    },
    {
      title: 'Interação Social',
      timeframe: 'Como foi uma conversa ou encontro que você teve?',
      guidance: 'Reflita sobre como as interações sociais afetaram suas emoções.',
      color: 'from-blue-400 to-cyan-500',
      icon: '👥'
    },
    {
      title: 'Momento de Alegria',
      timeframe: 'Lembre-se de algo positivo que aconteceu.',
      guidance: 'Identifique o que trouxe felicidade e como isso fez você se sentir.',
      color: 'from-green-400 to-emerald-500',
      icon: '😊'
    },
    {
      title: 'Reflexão do Dia',
      timeframe: 'Como você se sente agora ao final do dia?',
      guidance: 'Faça um balanço das emoções vividas e o que aprendeu sobre si mesmo.',
      color: 'from-purple-400 to-indigo-500',
      icon: '🌙'
    }
  ];

  const emotions = [
    { name: 'Alegria', color: 'bg-yellow-400', emoji: '😊' },
    { name: 'Tristeza', color: 'bg-blue-400', emoji: '😢' },
    { name: 'Raiva', color: 'bg-red-400', emoji: '😡' },
    { name: 'Medo', color: 'bg-gray-400', emoji: '😨' },
    { name: 'Ansiedade', color: 'bg-purple-400', emoji: '😰' },
    { name: 'Surpresa', color: 'bg-pink-400', emoji: '😲' },
    { name: 'Calma', color: 'bg-green-400', emoji: '😌' },
    { name: 'Confusão', color: 'bg-orange-400', emoji: '😕' }
  ];

  const currentPrompt = diaryPrompts[currentEntry];

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentEntry(0);
    setPoints(0);
    setEntryStarted(false);
    resetEntry();
  };

  const handleStartEntry = () => {
    setEntryStarted(true);
    resetEntry();
  };

  const resetEntry = () => {
    setSelectedEmotion('');
    setIntensity(0);
    setSituation('');
    setReflection('');
    setShowFeedback(false);
  };

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleIntensitySelect = (level) => {
    setIntensity(level);
  };

  const handleSubmitEntry = () => {
    if (selectedEmotion && intensity > 0 && situation.length > 10 && reflection.length > 10) {
      setShowFeedback(true);
      setPoints(points + 10);
    }
  };

  const handleNext = () => {
    if (currentEntry < diaryPrompts.length - 1) {
      setCurrentEntry(currentEntry + 1);
      setEntryStarted(false);
      resetEntry();
    }
  };

  const isComplete = selectedEmotion && intensity > 0 && situation.length > 10 && reflection.length > 10;

  const getIntensityColor = (level) => {
    if (level <= 2) return 'bg-green-400';
    if (level <= 4) return 'bg-yellow-400';
    if (level <= 6) return 'bg-orange-400';
    if (level <= 8) return 'bg-red-400';
    return 'bg-red-600';
  };

  const getSelectedEmotionData = () => {
    return emotions.find(e => e.name === selectedEmotion);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()}
                className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                ← Voltar para TEA
              </button>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">📓</span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Diário Emocional</h1>
              </div>
            </div>
            
            {gameStarted && (
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Pontos: <span className="font-bold text-blue-600">{points}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Entrada <span className="font-bold">{currentEntry + 1}</span>/{diaryPrompts.length}
                </div>
              </div>
            )}
          </div>
          
          {gameStarted && (
            <button
              onClick={() => setGameStarted(false)}
              className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ← Voltar ao Início
            </button>
          )}
        </div>

        {!gameStarted ? (
          <div>
            {/* Description */}
            <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Desenvolva autoconsciência emocional através do registro sistemático de emoções, 
              situações e reflexões pessoais
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg border-l-4 border-red-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🎯</span>
                  <h3 className="text-lg font-semibold text-red-600">Objetivo:</h3>
                </div>
                <p className="text-gray-700">
                  Desenvolver autoconsciência emocional através do registro sistemático de emoções, 
                  situações e reflexões pessoais
                </p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-blue-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">👑</span>
                  <h3 className="text-lg font-semibold text-blue-600">Pontuação:</h3>
                </div>
                <p className="text-gray-700">
                  Cada entrada completa = +10 pontos. Você precisa de 50 pontos 
                  para completar a atividade com sucesso
                </p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-purple-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">📊</span>
                  <h3 className="text-lg font-semibold text-purple-600">Níveis:</h3>
                </div>
                <div className="text-gray-700">
                  <p><strong className="text-purple-600">Nível 1:</strong> Identificação básica de emoções e situações</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> Análise de padrões e triggers emocionais</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> Reflexão profunda e autoconhecimento</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-green-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🏁</span>
                  <h3 className="text-lg font-semibold text-green-600">Final:</h3>
                </div>
                <p className="text-gray-700">
                  Complete os 3 níveis com 50 pontos para finalizar a atividade 
                  e desenvolver o hábito de reflexão emocional
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center mb-8">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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
                O diário emocional é baseado em princípios da Terapia Cognitivo-Comportamental e psicologia positiva. 
                A escrita reflexiva sobre emoções melhora a autorregulação, reduz stress e desenvolve 
                inteligência emocional através do automonitoramento sistemático.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{currentPrompt.icon}</span>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {currentPrompt.title}
                </h2>
              </div>
              
              {!entryStarted ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                    <p className="text-gray-700 text-lg leading-relaxed mb-3">
                      <strong>{currentPrompt.timeframe}</strong>
                    </p>
                    <p className="text-gray-600">
                      {currentPrompt.guidance}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleStartEntry}
                    className={`w-full md:w-auto bg-gradient-to-r ${currentPrompt.color} text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                  >
                    Escrever Entrada
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      <strong>{currentPrompt.timeframe}</strong>
                    </p>
                  </div>

                  {/* Emotion Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">1. Qual emoção você está sentindo?</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {emotions.map((emotion) => (
                        <button
                          key={emotion.name}
                          onClick={() => handleEmotionSelect(emotion.name)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            selectedEmotion === emotion.name
                              ? `${emotion.color} text-white border-gray-400`
                              : 'bg-white hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="text-2xl mb-1">{emotion.emoji}</div>
                          <div className="text-sm font-medium">{emotion.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Intensity Scale */}
                  {selectedEmotion && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        2. Qual a intensidade da sua {selectedEmotion.toLowerCase()}? (1-10)
                      </h3>
                      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                          <button
                            key={level}
                            onClick={() => handleIntensitySelect(level)}
                            className={`h-12 rounded-lg text-white font-bold transition-all duration-200 transform hover:scale-105 ${
                              intensity === level
                                ? `${getIntensityColor(level)} ring-4 ring-blue-300 scale-105`
                                : `${getIntensityColor(level)} hover:ring-2 hover:ring-blue-200`
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Muito Baixo</span>
                        <span>Muito Alto</span>
                      </div>
                    </div>
                  )}

                  {/* Situation Description */}
                  {intensity > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">3. Descreva a situação que gerou essa emoção:</h3>
                      <textarea
                        value={situation}
                        onChange={(e) => setSituation(e.target.value)}
                        placeholder="O que aconteceu? Onde você estava? Quem estava presente?"
                        className="w-full p-4 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                      <p className="text-sm text-gray-500">
                        Mínimo 10 caracteres ({situation.length}/10)
                      </p>
                    </div>
                  )}

                  {/* Reflection */}
                  {situation.length > 10 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">4. Reflexão pessoal:</h3>
                      <textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder="Como essa emoção afetou você? O que aprendeu sobre si mesmo? Como poderia lidar diferente no futuro?"
                        className="w-full p-4 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                      />
                      <p className="text-sm text-gray-500">
                        Mínimo 10 caracteres ({reflection.length}/10)
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  {isComplete && !showFeedback && (
                    <button
                      onClick={handleSubmitEntry}
                      className={`w-full md:w-auto bg-gradient-to-r ${currentPrompt.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
                    >
                      Salvar Entrada no Diário
                    </button>
                  )}

                  {/* Entry Summary */}
                  {showFeedback && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-xl">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-2xl">🎉</span>
                        <h3 className="text-lg font-semibold">
                          Entrada registrada! +10 pontos
                        </h3>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg mb-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`w-8 h-8 rounded-full ${getSelectedEmotionData()?.color} flex items-center justify-center text-white text-sm font-bold`}>
                            {getSelectedEmotionData()?.emoji}
                          </span>
                          <span className="font-semibold">{selectedEmotion}</span>
                          <span className="text-gray-500">- Intensidade: {intensity}/10</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Situação:</strong> {situation.substring(0, 100)}...
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Reflexão:</strong> {reflection.substring(0, 100)}...
                        </p>
                      </div>
                      
                      <p className="text-gray-700">
                        Excelente trabalho de autoconhecimento! O registro consistente de emoções 
                        ajuda a identificar padrões e desenvolver estratégias de autorregulação.
                      </p>
                    </div>
                  )}

                  {/* Navigation */}
                  {showFeedback && (
                    <div className="flex justify-center">
                      {currentEntry < diaryPrompts.length - 1 ? (
                        <button
                          onClick={handleNext}
                          className={`w-full md:w-auto bg-gradient-to-r ${currentPrompt.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
                        >
                          Próxima Entrada →
                        </button>
                      ) : (
                        <button
                          onClick={() => window.history.back()}
                          className={`w-full md:w-auto bg-gradient-to-r ${currentPrompt.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
                        >
                          Finalizar Atividade ✓
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