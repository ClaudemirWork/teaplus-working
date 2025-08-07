'use client';

import { useState, useEffect } from 'react';

export default function CalmingStrategiesPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [points, setPoints] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const exercises = [
    {
      title: 'Técnica 5-4-3-2-1 (Grounding)',
      description: 'Use seus sentidos para se conectar com o presente',
      instruction: 'Esta técnica ajuda a interromper pensamentos ansiosos focando no aqui e agora.',
      color: 'from-green-400 to-emerald-500',
      type: 'grounding',
      steps: [
        { text: 'Encontre 5 coisas que você pode VER ao seu redor', items: ['Quadro na parede', 'Objeto sobre a mesa', 'Cor da parede', 'Forma da janela', 'Textura do chão'] },
        { text: 'Identifique 4 coisas que você pode TOCAR', items: ['Superfície da mesa', 'Tecido da roupa', 'Temperatura do ar', 'Textura do cabelo'] },
        { text: 'Escute 3 sons diferentes ao seu redor', items: ['Som do vento', 'Ruído de carros', 'Sua própria respiração'] },
        { text: 'Sinta 2 cheiros ou aromas', items: ['Perfume do ambiente', 'Aroma de comida'] },
        { text: 'Prove 1 sabor na sua boca', items: ['Gosto da saliva', 'Resíduo de bebida'] }
      ],
      explanation: 'O grounding 5-4-3-2-1 redirecioná a atenção para o presente, interrompendo ciclos de ansiedade!'
    },
    {
      title: 'Lugar Seguro Mental',
      description: 'Visualize um local onde você se sente completamente seguro',
      instruction: 'Crie uma imagem mental detalhada de um lugar que transmite paz e segurança.',
      color: 'from-blue-400 to-cyan-500',
      type: 'visualization',
      steps: [
        { text: 'Escolha seu lugar seguro ideal', options: ['Praia tranquila', 'Floresta silenciosa', 'Quarto aconchegante', 'Jardim florido', 'Montanha serena'] },
        { text: 'Visualize as cores deste lugar', guidance: 'Que cores você vê? Como elas fazem você se sentir?' },
        { text: 'Imagine os sons do ambiente', guidance: 'Que sons relaxantes você escuta neste lugar?' },
        { text: 'Sinta a temperatura e texturas', guidance: 'Como é a sensação de estar neste lugar?' },
        { text: 'Conecte-se com o sentimento de segurança', guidance: 'Absorva toda a paz e tranquilidade deste local' }
      ],
      explanation: 'A visualização ativa áreas do cérebro relacionadas ao relaxamento e bem-estar!'
    },
    {
      title: 'Relaxamento Muscular Progressivo',
      description: 'Tensione e relaxe diferentes grupos musculares',
      instruction: 'Contraia cada parte do corpo por 5 segundos, depois relaxe completamente.',
      color: 'from-purple-400 to-pink-500',
      type: 'progressive',
      steps: [
        { text: 'Tensione os músculos dos pés e panturrilhas', duration: 5 },
        { text: 'Tensione os músculos das coxas e glúteos', duration: 5 },
        { text: 'Tensione os músculos do abdômen', duration: 5 },
        { text: 'Tensione os músculos dos braços e mãos', duration: 5 },
        { text: 'Tensione os músculos do rosto e pescoço', duration: 5 },
        { text: 'Relaxe todo o corpo completamente', duration: 10 }
      ],
      explanation: 'O relaxamento progressivo reduz a tensão física e mental, promovendo calma profunda!'
    },
    {
      title: 'Sons Calmantes',
      description: 'Use sons da natureza para relaxar a mente',
      instruction: 'Concentre-se completamente nos sons, deixando que acalmem sua mente.',
      color: 'from-indigo-400 to-purple-500',
      type: 'sounds',
      steps: [
        { text: 'Escolha seu som calmante preferido', options: ['Chuva suave', 'Ondas do mar', 'Vento nas árvores', 'Pássaros cantando', 'Água corrente'] },
        { text: 'Feche os olhos e escute atentamente', duration: 30 },
        { text: 'Respire no ritmo do som escolhido', guidance: 'Sincronize sua respiração com o ritmo natural' },
        { text: 'Deixe o som preencher sua mente', guidance: 'Permita que outros pensamentos se afastem' },
        { text: 'Absorva a tranquilidade do som', duration: 30 }
      ],
      explanation: 'Sons da natureza ativam o sistema nervoso parassimpático, reduzindo stress e ansiedade!'
    },
    {
      title: 'Contagem Regressiva Calmante',
      description: 'Use números para focar a mente e criar calma',
      instruction: 'Conte de forma lenta e concentrada, associando cada número à tranquilidade.',
      color: 'from-orange-400 to-red-500',
      type: 'counting',
      steps: [
        { text: 'Conte lentamente de 10 a 1', guidance: 'A cada número, sinta-se mais relaxado' },
        { text: 'Respire profundamente entre cada número', guidance: 'Use a respiração para amplificar o relaxamento' },
        { text: 'Visualize cada número se dissolvendo', guidance: 'Veja as preocupações desaparecendo com os números' },
        { text: 'Ao chegar no 1, sinta-se completamente calmo', guidance: 'Absorva toda a tranquilidade alcançada' }
      ],
      explanation: 'A contagem focalizada ocupa a mente com uma tarefa simples, interrompendo pensamentos estressantes!'
    }
  ];

  const currentEx = exercises[currentExercise];

  useEffect(() => {
    let interval;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentExercise(0);
    setPoints(0);
    setExerciseStarted(false);
    resetExercise();
  };

  const handleStartExercise = () => {
    setExerciseStarted(true);
    resetExercise();
  };

  const resetExercise = () => {
    setCurrentStep(0);
    setIsActive(false);
    setTimer(0);
    setSelectedItems([]);
    setShowFeedback(false);
  };

  const handleNextStep = () => {
    if (currentStep < currentEx.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowFeedback(true);
      setPoints(points + 10);
    }
  };

  const handleSelectItem = (item) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleStartTimer = (duration) => {
    setTimer(duration);
    setIsActive(true);
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setExerciseStarted(false);
      resetExercise();
    }
  };

  const currentStep_data = currentEx.steps[currentStep];

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
                <span className="text-3xl">🧘</span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Estratégias de Calma</h1>
              </div>
            </div>
            
            {gameStarted && (
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Pontos: <span className="font-bold text-green-600">{points}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Exercício <span className="font-bold">{currentExercise + 1}</span>/{exercises.length}
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
              Desenvolver um kit de ferramentas práticas para recuperar a calma em momentos 
              de stress, ansiedade ou sobrecarga emocional
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg border-l-4 border-red-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🎯</span>
                  <h3 className="text-lg font-semibold text-red-600">Objetivo:</h3>
                </div>
                <p className="text-gray-700">
                  Desenvolver um kit de ferramentas práticas para recuperar a calma em momentos 
                  de stress, ansiedade ou sobrecarga emocional
                </p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-blue-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">👑</span>
                  <h3 className="text-lg font-semibold text-blue-600">Pontuação:</h3>
                </div>
                <p className="text-gray-700">
                  Cada estratégia praticada = +10 pontos. Você precisa de 50 pontos 
                  para completar a atividade com sucesso
                </p>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-purple-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">📊</span>
                  <h3 className="text-lg font-semibold text-purple-600">Níveis:</h3>
                </div>
                <div className="text-gray-700">
                  <p><strong className="text-purple-600">Nível 1:</strong> Técnicas básicas (grounding, visualização)</p>
                  <p><strong className="text-purple-600">Nível 2:</strong> Relaxamento físico e mental avançado</p>
                  <p><strong className="text-purple-600">Nível 3:</strong> Estratégias de emergência e autossuficiência</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border-l-4 border-green-400 p-6 shadow-sm">
                <div className="flex items-center mb-3">
                  <span className="text-xl mr-2">🏁</span>
                  <h3 className="text-lg font-semibold text-green-600">Final:</h3>
                </div>
                <p className="text-gray-700">
                  Complete os 3 níveis com 50 pontos para finalizar a atividade 
                  e construir sua caixa de ferramentas de calma
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center mb-8">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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
                Este exercício combina técnicas validadas de Mindfulness, Terapia Cognitivo-Comportamental 
                e Relaxamento Progressivo. As estratégias ativam o sistema nervoso parassimpático, 
                reduzem cortisol e promovem autorregulação emocional através de práticas baseadas em evidências.
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
                    <p className="text-gray-700 text-lg leading-relaxed mb-3">
                      <strong>{currentEx.description}</strong>
                    </p>
                    <p className="text-gray-600">
                      {currentEx.instruction}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleStartExercise}
                    className={`w-full md:w-auto bg-gradient-to-r ${currentEx.color} text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                  >
                    Iniciar Exercício
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Progress */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Passo {currentStep + 1} de {currentEx.steps.length}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${currentEx.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${((currentStep + 1) / currentEx.steps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Current Step */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {currentStep_data.text}
                    </h3>
                    
                    {currentStep_data.guidance && (
                      <p className="text-gray-600 mb-4">
                        {currentStep_data.guidance}
                      </p>
                    )}

                    {currentStep_data.items && (
                      <div className="grid grid-cols-1 gap-2 mb-4">
                        {currentStep_data.items.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleSelectItem(item)}
                            className={`p-3 rounded-lg text-left transition-colors text-sm md:text-base ${
                              selectedItems.includes(item)
                                ? 'bg-green-100 text-green-800 border-green-300 border'
                                : 'text-gray-800 bg-white hover:bg-gray-50 border border-gray-200'
                            }`}
                          >
                            {selectedItems.includes(item) && '✓ '}{item}
                          </button>
                        ))}
                      </div>
                    )}

                    {currentStep_data.options && (
                      <div className="grid grid-cols-1 gap-2 mb-4">
                        {currentStep_data.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleSelectItem(option)}
                            className={`p-3 rounded-lg text-left transition-colors text-sm md:text-base ${
                              selectedItems.includes(option)
                                ? 'bg-blue-100 text-blue-800 border-blue-300 border'
                                : 'text-gray-800 bg-white hover:bg-gray-50 border border-gray-200'
                            }`}
                          >
                            {selectedItems.includes(option) && '✓ '}{option}
                          </button>
                        ))}
                      </div>
                    )}

                    {currentStep_data.duration && (
                      <div className="text-center mb-4">
                        {!isActive ? (
                          <button
                            onClick={() => handleStartTimer(currentStep_data.duration)}
                            className={`w-full md:w-auto bg-gradient-to-r ${currentEx.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
                          >
                            Iniciar Timer ({currentStep_data.duration}s)
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${currentEx.color} bg-clip-text text-transparent`}>
                              {timer}s
                            </div>
                            <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2">
                              <div 
                                className={`bg-gradient-to-r ${currentEx.color} h-2 rounded-full transition-all duration-1000`}
                                style={{ width: `${((currentStep_data.duration - timer) / currentStep_data.duration) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Next Button */}
                  {!isActive && (
                    <button
                      onClick={handleNextStep}
                      className={`w-full md:w-auto bg-gradient-to-r ${currentEx.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
                    >
                      {currentStep < currentEx.steps.length - 1 ? 'Próximo Passo →' : 'Concluir Exercício ✓'}
                    </button>
                  )}

                  {/* Feedback */}
                  {showFeedback && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-xl">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-2xl">🎉</span>
                        <h3 className="text-lg font-semibold">
                          Estratégia concluída! +10 pontos
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {currentEx.explanation}
                      </p>
                    </div>
                  )}

                  {/* Navigation */}
                  {showFeedback && (
                    <div className="flex justify-center">
                      {currentExercise < exercises.length - 1 ? (
                        <button
                          onClick={handleNext}
                          className={`w-full md:w-auto bg-gradient-to-r ${currentEx.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
                        >
                          Próximo Exercício →
                        </button>
                      ) : (
                        <button
                          onClick={() => window.history.back()}
                          className={`w-full md:w-auto bg-gradient-to-r ${currentEx.color} text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200`}
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
