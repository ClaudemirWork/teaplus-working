'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, Award, Target, Clock, Brain, CheckCircle, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

const DecisionMakingPage = () => {
  const [gameState, setGameState] = useState<'intro' | 'instructions' | 'playing' | 'finished'>('intro')
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [scenarios, setScenarios] = useState<Array<{
    id: number,
    category: string,
    situation: string,
    options: Array<{text: string, points: number, explanation: string}>,
    timeLimit: number
  }>>([])
  const [responses, setResponses] = useState<Array<{
    scenarioId: number,
    choice: number,
    timeUsed: number,
    points: number
  }>>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [decisionSpeed, setDecisionSpeed] = useState(0)
  const [qualityScore, setQualityScore] = useState(0)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const scenarioData = [
    {
      id: 1,
      category: "Organização",
      situation: "Você tem 3 tarefas importantes para hoje, mas só conseguirá fazer 2 bem feitas. O que faz?",
      options: [
        {text: "Foco nas 2 mais importantes e deixo a terceira para amanhã", points: 10, explanation: "Excelente! Priorizar qualidade sobre quantidade é fundamental no TDAH."},
        {text: "Tento fazer as 3, mesmo que não fiquem perfeitas", points: 3, explanation: "Cuidado! Isso pode levar à sobrecarga e resultados ruins em todas."},
        {text: "Escolho a mais fácil para terminar rápido", points: 5, explanation: "Ok, mas pode não ser a estratégia mais eficaz a longo prazo."},
        {text: "Peço ajuda para conseguir fazer todas", points: 8, explanation: "Boa estratégia! Pedir ajuda é uma habilidade importante."}
      ],
      timeLimit: 20
    },
    {
      id: 2,
      category: "Social",
      situation: "Na reunião, você discorda da opinião do grupo. Como age?",
      options: [
        {text: "Exponho minha opinião de forma respeitosa", points: 10, explanation: "Perfeito! Assertividade respeitosa é uma habilidade valiosa."},
        {text: "Fico quieto para evitar conflito", points: 4, explanation: "Evitar sempre pode não ser a melhor estratégia para seu crescimento."},
        {text: "Falo impulsivamente o que penso", points: 2, explanation: "Cuidado! A impulsividade pode prejudicar relacionamentos."},
        {text: "Anoto para conversar depois individualmente", points: 8, explanation: "Boa estratégia! Timing é importante na comunicação."}
      ],
      timeLimit: 25
    },
    {
      id: 3,
      category: "Estudo/Trabalho",
      situation: "Você está estudando e percebe que não está entendendo o conteúdo. O que faz?",
      options: [
        {text: "Paro e procuro outro método de aprendizagem", points: 10, explanation: "Excelente! Flexibilidade de estratégias é fundamental."},
        {text: "Continuo insistindo no mesmo método", points: 2, explanation: "Insistir sem adaptar pode ser ineficiente e frustrante."},
        {text: "Desisto e faço outra coisa", points: 1, explanation: "Desistir facilmente não desenvolve resistência e persistência."},
        {text: "Busco ajuda de alguém que entende o assunto", points: 9, explanation: "Ótima decisão! Buscar suporte é inteligente e eficaz."}
      ],
      timeLimit: 18
    },
    {
      id: 4,
      category: "Emocional",
      situation: "Você cometeu um erro importante no trabalho. Como reage?",
      options: [
        {text: "Assumo o erro e proponho uma solução", points: 10, explanation: "Perfeita! Responsabilidade e proatividade são qualidades valiosas."},
        {text: "Fico ruminando sobre o erro o dia todo", points: 2, explanation: "Ruminar excessivamente não ajuda e pode piorar a situação."},
        {text: "Culpo fatores externos pelo erro", points: 1, explanation: "Evitar responsabilidade impede o aprendizado e crescimento."},
        {text: "Converso com alguém de confiança sobre isso", points: 8, explanation: "Boa estratégia! Buscar apoio emocional é importante."}
      ],
      timeLimit: 22
    }
  ]

  useEffect(() => {
    setScenarios(scenarioData)
  }, [])

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeOut()
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeLeft, gameState])

  const startGame = () => {
    setGameState('playing')
    setCurrentScenario(0)
    setScore(0)
    setResponses([])
    setSelectedOption(null)
    setShowExplanation(false)
    setTimeLeft(scenarios[0]?.timeLimit || 20)
  }

  const handleChoice = (optionIndex: number) => {
    if (selectedOption !== null || showExplanation) return

    const scenario = scenarios[currentScenario]
    const timeUsed = scenario.timeLimit - timeLeft
    const points = scenario.options[optionIndex].points
    
    setSelectedOption(optionIndex)
    setShowExplanation(true)
    setScore(prev => prev + points)
    
    const newResponse = {
      scenarioId: scenario.id,
      choice: optionIndex,
      timeUsed,
      points
    }
    
    setResponses(prev => [...prev, newResponse])

    setTimeout(() => {
      nextScenario()
    }, 4000)
  }

  const handleTimeOut = () => {
    const scenario = scenarios[currentScenario]
    setSelectedOption(-1)
    setShowExplanation(true)
    
    const newResponse = {
      scenarioId: scenario.id,
      choice: -1,
      timeUsed: scenario.timeLimit,
      points: 0
    }
    
    setResponses(prev => [...prev, newResponse])

    setTimeout(() => {
      nextScenario()
    }, 3000)
  }

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1)
      setSelectedOption(null)
      setShowExplanation(false)
      setTimeLeft(scenarios[currentScenario + 1].timeLimit)
    } else {
      finishGame()
    }
  }

  const finishGame = () => {
    setGameState('finished')
    calculateFinalScores()
  }

  const calculateFinalScores = () => {
    const avgTime = responses.reduce((sum, r) => sum + r.timeUsed, 0) / responses.length
    const speedScore = Math.max(0, 100 - (avgTime * 2))
    const qualityScore = (score / (scenarios.length * 10)) * 100
    
    setDecisionSpeed(Math.round(speedScore))
    setQualityScore(Math.round(qualityScore))
  }

  const resetGame = () => {
    setGameState('intro')
    setCurrentScenario(0)
    setScore(0)
    setResponses([])
    setSelectedOption(null)
    setShowExplanation(false)
    setDecisionSpeed(0)
    setQualityScore(0)
  }

  const getPerformanceLevel = () => {
    if (qualityScore >= 90) return { level: "Excelente", color: "text-green-600" }
    if (qualityScore >= 75) return { level: "Muito Bom", color: "text-blue-600" }
    if (qualityScore >= 60) return { level: "Bom", color: "text-yellow-600" }
    if (qualityScore >= 45) return { level: "Regular", color: "text-orange-600" }
    return { level: "Precisa Melhorar", color: "text-red-600" }
  }

  const currentScenarioData = scenarios[currentScenario]

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/tdah" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🤔 Tomada de Decisão</h1>
                <p className="text-gray-600 mt-1">Processos de escolha consciente</p>
              </div>
            </div>
            
            {gameState === 'playing' && (
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Cenário</div>
                  <div className="text-2xl font-bold text-gray-900">{currentScenario + 1}/{scenarios.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Tempo</div>
                  <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-gray-900'}`}>{timeLeft}s</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Pontuação</div>
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {gameState === 'intro' && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sobre este exercício</h2>
                  <p className="text-gray-600">Cenários para treinar tomada de decisão</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-500" />
                    Objetivo
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Desenvolver habilidades de tomada de decisão através de cenários realistas 
                    que envolvem situações comuns do dia a dia para pessoas com TDAH.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Benefícios
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Melhora processos decisórios
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Desenvolve pensamento crítico
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Treina priorização
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Fortalece autoconhecimento
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Duração</div>
                  <div className="text-sm text-gray-600">15-20 minutos</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Target className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Dificuldade</div>
                  <div className="text-sm text-gray-600">Avançado</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <Users className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 mb-1">Cenários</div>
                  <div className="text-sm text-gray-600">4 situações</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameState('instructions')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-colors"
              >
                Ver instruções
              </button>
            </div>
          </div>
        )}

        {gameState === 'instructions' && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">📋 Como fazer boas decisões</h2>
              
              <div className="space-y-8">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 Como funciona</h3>
                  <div className="space-y-3 text-blue-800">
                    <p>• Você receberá cenários diferentes baseados em situações reais</p>
                    <p>• Cada cenário tem um tempo limite para decisão</p>
                    <p>• Escolha a opção que considera mais adequada</p>
                    <p>• Receberá feedback imediato sobre sua escolha</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">✅ Critérios de avaliação</h3>
                  <div className="space-y-3 text-green-800">
                    <p>• <strong>Qualidade da decisão:</strong> Baseada em estratégias eficazes para TDAH</p>
                    <p>• <strong>Velocidade:</strong> Capacidade de decidir dentro do tempo</p>
                    <p>• <strong>Consistência:</strong> Padrão de escolhas ao longo dos cenários</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setGameState('intro')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-medium transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={startGame}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Iniciar exercício
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && currentScenarioData && (
          <div className="space-y-8">
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 text-center">
              <div className="text-sm font-medium text-indigo-600 mb-2">
                {currentScenarioData.category}
              </div>
              <div className="text-lg font-semibold text-indigo-900">
                Cenário {currentScenario + 1} de {scenarios.length}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Situação:</h3>
              <p className="text-lg text-gray-800 leading-relaxed">
                {currentScenarioData.situation}
              </p>
            </div>

            {!showExplanation ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">
                  Qual seria sua decisão?
                </h3>
                {currentScenarioData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(index)}
                    className="w-full bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-6 text-left transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="text-gray-800 font-medium">
                        {option.text}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {selectedOption === -1 ? (
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200 text-center">
                    <div className="text-xl font-bold text-red-800 mb-2">⏰ Tempo esgotado!</div>
                    <p className="text-red-700">
                      Não conseguiu decidir a tempo. Na vida real, às vezes é melhor uma decisão rápida do que nenhuma decisão.
                    </p>
                  </div>
                ) : (
                  <div className={`rounded-xl p-6 border ${
                    currentScenarioData.options[selectedOption].points >= 8 
                      ? 'bg-green-50 border-green-200' 
                      : currentScenarioData.options[selectedOption].points >= 5
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        currentScenarioData.options[selectedOption].points >= 8 
                          ? 'bg-green-100 text-green-600' 
                          : currentScenarioData.options[selectedOption].points >= 5
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {String.fromCharCode(65 + selectedOption)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 mb-2">Sua escolha:</div>
                        <div className="text-gray-800">
                          {currentScenarioData.options[selectedOption].text}
                        </div>
                      </div>
                    </div>
                    <div className={`text-lg font-medium mt-4 ${
                      currentScenarioData.options[selectedOption].points >= 8 
                        ? 'text-green-800' 
                        : currentScenarioData.options[selectedOption].points >= 5
                        ? 'text-yellow-800'
                        : 'text-red-800'
                    }`}>
                      {currentScenarioData.options[selectedOption].explanation}
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-sm text-gray-600">Pontos obtidos: </span>
                      <span className="font-bold text-lg text-indigo-600">
                        +{currentScenarioData.options[selectedOption].points}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-gray-500">
                    {currentScenario < scenarios.length - 1 
                      ? 'Próximo cenário em alguns segundos...' 
                      : 'Finalizando exercício...'
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {gameState === 'finished' && (
          <div className="space-y-8">
            <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-200 text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-indigo-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Exercício concluído!</h2>
              <p className="text-gray-600 mb-8">Parabéns! Você completou todos os cenários de tomada de decisão.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{score}</div>
                  <div className="text-sm font-medium text-gray-600">Pontuação total</div>
                  <div className="text-xs text-gray-500 mt-1">de {scenarios.length * 10} possíveis</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className={`text-3xl font-bold mb-2 ${getPerformanceLevel().color}`}>{qualityScore}%</div>
                  <div className="text-sm font-medium text-gray-600">Qualidade das decisões</div>
                  <div className={`text-xs mt-1 ${getPerformanceLevel().color}`}>{getPerformanceLevel().level}</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{decisionSpeed}%</div>
                  <div className="text-sm font-medium text-gray-600">Velocidade de decisão</div>
                  <div className="text-xs text-gray-500 mt-1">Rapidez vs qualidade</div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors"
                >
                  Fazer novamente
                </button>
                <Link href="/tdah">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-8 rounded-xl font-semibold transition-colors">
                    Voltar ao menu
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DecisionMakingPage