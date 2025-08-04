'use client';

import { useState, useEffect } from 'react';

export default function EyeContactGame() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [eyeSize, setEyeSize] = useState('large');

  // ✅ CORREÇÃO: Atualizar tamanho dos olhos quando level mudar
  useEffect(() => {
    updateEyeSize(level);
  }, [level]);

  const handleEyeClick = () => {
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
      }, 500);
    }
  };

  const updateEyeSize = (currentLevel) => {
    if (currentLevel === 1) setEyeSize('large');
    if (currentLevel === 2) setEyeSize('medium');
    if (currentLevel === 3) setEyeSize('small');
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setLevel(1);
    setEyeSize('large');
  };

  const getEyeStyle = () => {
    const sizes = {
      // ✅ CORREÇÃO: Tamanhos mais distintos e responsivos
      large: 'w-8 h-8 sm:w-10 sm:h-10',    // Maior em mobile
      medium: 'w-6 h-6 sm:w-7 sm:h-7',     // Médio mais visível
      small: 'w-4 h-4 sm:w-5 sm:h-5'       // Pequeno mas clicável
    };
    return sizes[eyeSize];
  };

  const getLevelName = () => {
    const names = {
      1: 'Básico',
      2: 'Intermediário',
      3: 'Avançado'
    };
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Mobile */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Botão Voltar */}
            <a 
              href="/tea" 
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors min-h-[44px] px-2 -ml-2"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-sm sm:text-base font-medium">Voltar para TEA</span>
            </a>
            
            {/* Título */}
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4">
              👁️ Contato Visual Progressivo
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
            <p className="text-red-700 text-sm sm:text-base">Praticar o contato visual clicando nos olhos do rosto quando aparecerem na tela</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">🏆 Pontuação:</h3>
            <p className="text-blue-700 text-sm sm:text-base">Cada clique nos olhos = +10 pontos. Você precisa de 50 pontos para avançar de nível.</p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
            <h3 className="text-base sm:text-lg font-semibold text-purple-800 mb-2">📊 Níveis:</h3>
            <div className="text-purple-700 text-sm sm:text-base space-y-1">
              <p><strong>Nível 1:</strong> Olhos grandes (fácil)</p>
              <p><strong>Nível 2:</strong> Olhos médios</p>
              <p><strong>Nível 3:</strong> Olhos pequenos (difícil)</p>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2">🏁 Final:</h3>
            <p className="text-green-700 text-sm sm:text-base">Complete o Nível 3 com 50 pontos para finalizar o jogo com sucesso</p>
          </div>
        </div>

        {/* Base Científica */}
        <div className="bg-gray-50 border border-gray-200 p-4 mb-6 rounded-lg">
          <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">📚 Base Científica:</h3>
          <p className="text-gray-600 text-sm sm:text-base">Este exercício é baseado em terapias ABA (Applied Behavior Analysis) para desenvolvimento de habilidades de contato visual em pessoas com TEA e TDAH.</p>
        </div>

        {/* Área do Jogo */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
            {!gameActive ? (
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-6">😊</div>
                <button 
                  onClick={startGame}
                  className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors min-h-[48px] touch-manipulation"
                >
                  🎮 Iniciar Jogo
                </button>
              </div>
            ) : (
              <div className="text-center w-full">
                {/* Personagem */}
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-yellow-300 rounded-full flex items-center justify-center relative">
                    {/* Olhos clicáveis - ✅ CORREÇÃO: Aplicar estilos dinâmicos */}
                    <div className="flex space-x-3 sm:space-x-4">
                      <button 
                        onClick={handleEyeClick}
                        disabled={score >= 50}
                        className={`${getEyeStyle()} bg-blue-500 rounded-full hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 cursor-pointer touch-manipulation ${score >= 50 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <button 
                        onClick={handleEyeClick}
                        disabled={score >= 50}
                        className={`${getEyeStyle()} bg-blue-500 rounded-full hover:bg-blue-600 active:bg-blue-700 transition-all duration-300 cursor-pointer touch-manipulation ${score >= 50 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                    </div>
                    {/* Boca */}
                    <div className="absolute bottom-4 sm:bottom-6 w-3 h-2 sm:w-4 sm:h-2 bg-red-400 rounded-full" />
                  </div>
                  
                  {/* ✅ CORREÇÃO: Indicador visual do tamanho atual */}
                  <div className="mt-2 text-xs text-gray-500">
                    Tamanho: {eyeSize === 'large' ? 'Grande' : eyeSize === 'medium' ? 'Médio' : 'Pequeno'}
                  </div>
                </div>

                {/* Status do Jogo */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4 max-w-sm mx-auto">
                  <p className="text-base sm:text-lg font-semibold text-gray-800">Nível: {level} ({getLevelName()})</p>
                  <p className="text-base sm:text-lg text-gray-700">Pontuação: {score}/50</p>
                  
                  {/* ✅ CORREÇÃO: Barra de progresso limitada */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                      style={{width: `${getProgressPercentage()}%`}}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {getProgressPercentage().toFixed(0)}%
                  </div>
                </div>

                {/* ✅ CORREÇÃO: Status baseado no estado atual */}
                {!isGameCompleted() ? (
                  <div className="bg-blue-50 p-4 rounded-lg max-w-sm mx-auto">
                    <p className="text-sm sm:text-base text-blue-800">
                      🎯 Clique nos olhos para praticar o contato visual!
                    </p>
                    <p className="text-xs sm:text-sm text-blue-600 mt-1">
                      {getLevelName()} - {50-score} pontos para {level < 3 ? 'próximo nível' : 'completar'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-100 p-4 rounded-lg border border-green-200 max-w-sm mx-auto">
                    <h3 className="text-lg font-bold text-green-800">🎉 Parabéns!</h3>
                    <p className="text-green-700">Você completou todos os níveis!</p>
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
            Nível atual: {level} | Pontos: {score} | 
            {isGameCompleted() ? ' ✅ Completado!' : ` Próxima meta: ${50-score} pontos`}
          </p>
        </div>
      </div>
    </div>
  );
}