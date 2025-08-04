'use client';

import { useState, useEffect } from 'react';

export default function FacialExpressionsGame() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('😊');
  const [questionEmotion, setQuestionEmotion] = useState('');

  const emotions = {
    1: ['😊', '😢', '😮'], // Básico: feliz, triste, surpreso
    2: ['😊', '😢', '😮', '😠', '😨'], // Intermediário: + raiva, medo
    3: ['😊', '😢', '😮', '😠', '😨', '🤔', '😴', '🤢'] // Avançado: + pensativo, cansado, enjoado
  };

  const emotionNames = {
    '😊': 'Feliz',
    '😢': 'Triste', 
    '😮': 'Surpreso',
    '😠': 'Bravo',
    '😨': 'Com Medo',
    '🤔': 'Pensativo',
    '😴': 'Cansado',
    '🤢': 'Enjoado'
  };

  // ✅ CORREÇÃO: Atualizar pergunta quando level muda
  useEffect(() => {
    if (gameActive) {
      generateQuestion();
    }
  }, [level]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setLevel(1);
    generateQuestion();
  };

  const generateQuestion = () => {
    const levelEmotions = emotions[level];
    const randomEmotion = levelEmotions[Math.floor(Math.random() * levelEmotions.length)];
    setCurrentEmotion(randomEmotion);
    setQuestionEmotion(emotionNames[randomEmotion]);
  };

  const checkAnswer = (selectedEmotion) => {
    if (selectedEmotion === currentEmotion) {
      // ✅ CORREÇÃO: Não permitir score > 50
      if (score >= 50) return;

      const newScore = score + 10;
      setScore(newScore);
      
      // ✅ CORREÇÃO: Verificar mudança de nível APÓS atualizar score
      if (newScore >= 50 && level < 3) {
        // Pequeno delay para mostrar 50/50 antes de resetar
        setTimeout(() => {
          setLevel(level + 1);
          setScore(0);
        }, 800);
      } else {
        // ✅ CORREÇÃO: Gerar nova pergunta apenas se não mudou de nível
        if (newScore < 50) {
          generateQuestion();
        }
      }
    } else {
      // ✅ MELHORIA: Feedback visual para resposta incorreta
      // Pode adicionar shake animation ou highlight vermelho aqui
      generateQuestion(); // Nova pergunta mesmo com erro
    }
  };

  const getLevelName = () => {
    const names = { 1: 'Básico', 2: 'Intermediário', 3: 'Avançado' };
    return names[level];
  };

  // ✅ CORREÇÃO: Progresso limitado a 100%
  const getProgressPercentage = () => {
    return Math.min((score / 50) * 100, 100);
  };

  // ✅ CORREÇÃO: Verificar se jogo foi completado
  const isGameCompleted = () => {
    return level === 3 && score >= 50;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header Mobile */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Botão Voltar */}
            <a 
              href="/tea" 
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors min-h-[44px] px-2 -ml-2"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-sm sm:text-base font-medium">Voltar para TEA</span>
            </a>
            
            {/* Título */}
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4">
              😊 Expressões Faciais
            </h1>
            
            {/* Espaço para balanceamento */}
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Cards de Instruções */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">🎯 Objetivo:</h3>
            <p className="text-red-700 text-sm sm:text-base">Identifique a emoção correta clicando na expressão facial que corresponde ao nome mostrado</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">🏆 Pontuação:</h3>
            <p className="text-blue-700 text-sm sm:text-base">Cada resposta correta = +10 pontos. Você precisa de 50 pontos para avançar de nível.</p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
            <h3 className="text-base sm:text-lg font-semibold text-purple-800 mb-2">📊 Níveis:</h3>
            <div className="text-purple-700 text-sm sm:text-base space-y-1">
              <p><strong>Nível 1:</strong> 3 emoções básicas (feliz, triste, surpreso)</p>
              <p><strong>Nível 2:</strong> 5 emoções (+ bravo, com medo)</p>
              <p><strong>Nível 3:</strong> 8 emoções (+ pensativo, cansado, enjoado)</p>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2">🏁 Final:</h3>
            <p className="text-green-700 text-sm sm:text-base">Complete o Nível 3 com 50 pontos para dominar o reconhecimento de expressões faciais</p>
          </div>
        </div>

        {/* Base Científica */}
        <div className="bg-gray-50 border border-gray-200 p-4 mb-6 rounded-lg">
          <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">📚 Base Científica:</h3>
          <p className="text-gray-600 text-sm sm:text-base">Este exercício é baseado em estudos de neuropsicologia e terapias comportamentais para desenvolvimento de habilidades de reconhecimento emocional e teoria da mente em pessoas com TEA e TDAH.</p>
        </div>

        {/* Área do Jogo */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
            {!gameActive ? (
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-6">😊</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Jogo de Reconhecimento de Emoções</h3>
                <button 
                  onClick={startGame}
                  className="bg-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-purple-700 active:bg-purple-800 transition-colors min-h-[48px] touch-manipulation"
                >
                  🎮 Iniciar Jogo
                </button>
              </div>
            ) : (
              <div className="text-center w-full max-w-2xl">
                {/* Pergunta */}
                <div className="bg-purple-50 p-4 sm:p-6 rounded-lg mb-6 border border-purple-200">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">Clique na face que está:</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{questionEmotion}</p>
                </div>

                {/* Opções de Resposta */}
                <div className={`grid gap-3 sm:gap-4 mb-6 ${
                  level === 1 ? 'grid-cols-3' : 
                  level === 2 ? 'grid-cols-3 sm:grid-cols-5' : 
                  'grid-cols-2 sm:grid-cols-4'
                }`}>
                  {emotions[level].map((emotion, index) => (
                    <button
                      key={index}
                      onClick={() => checkAnswer(emotion)}
                      disabled={score >= 50}
                      className={`text-4xl sm:text-6xl p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-purple-50 active:bg-purple-100 transition-all duration-200 border-2 hover:border-purple-300 active:border-purple-400 min-h-[60px] sm:min-h-[80px] touch-manipulation ${
                        score >= 50 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>

                {/* Status do Jogo */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4 max-w-sm mx-auto">
                  <p className="text-base sm:text-lg font-semibold text-gray-800">Nível: {level} ({getLevelName()})</p>
                  <p className="text-base sm:text-lg text-gray-700">Pontuação: {score}/50</p>
                  
                  {/* ✅ CORREÇÃO: Barra de progresso limitada */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3 overflow-hidden">
                    <div 
                      className="bg-purple-600 h-3 rounded-full transition-all duration-500" 
                      style={{width: `${getProgressPercentage()}%`}}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {getProgressPercentage().toFixed(0)}%
                  </div>
                </div>

                {/* ✅ CORREÇÃO: Status baseado no estado atual */}
                {!isGameCompleted() ? (
                  <div className="bg-purple-50 p-4 rounded-lg max-w-sm mx-auto">
                    <p className="text-sm sm:text-base text-purple-800">
                      🎯 Identifique a emoção "<strong>{questionEmotion}</strong>" clicando na face correta!
                    </p>
                    <p className="text-xs sm:text-sm text-purple-600 mt-1">
                      {getLevelName()} - {50-score} pontos para {level < 3 ? 'próximo nível' : 'completar'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-100 p-4 rounded-lg border border-green-200 max-w-sm mx-auto">
                    <h3 className="text-lg font-bold text-green-800">🎉 Parabéns!</h3>
                    <p className="text-green-700">Você dominou o reconhecimento de expressões faciais!</p>
                    <button 
                      onClick={startGame}
                      className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      🔄 Jogar Novamente
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progresso */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">📈 Seu Progresso</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Nível atual: {level} ({getLevelName()}) | Pontos: {score} | 
            {isGameCompleted() ? ' ✅ Completado!' : ` Próxima meta: ${50-score} pontos`}
          </p>
        </div>
      </div>
    </div>
  );
}