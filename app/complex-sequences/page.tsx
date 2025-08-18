'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Target, Award, Brain, BookOpen, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SequenceItem {
  color: string
  shape: string
  position: number
}

export default function SequenciasComplexas() {
  const router = useRouter()
  const [showActivity, setShowActivity] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  
  // Estados principais da sequência
  const [correctSequence, setCorrectSequence] = useState<SequenceItem[]>([])
  const [userSequence, setUserSequence] = useState<SequenceItem[]>([])
  
  // Estados do jogo
  const [gamePhase, setGamePhase] = useState<'ready' | 'showing' | 'input' | 'feedback'>('ready')
  const [showingIndex, setShowingIndex] = useState(0)
  
  // Estados de entrada (3 etapas)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [inputStep, setInputStep] = useState<'color' | 'shape' | 'position'>('color')
  
  // Feedback
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)

  const levelConfig = {
    1: { length: 3, showTime: 1000, target: 50 },
    2: { length: 4, showTime: 1200, target: 50 },
    3: { length: 5, showTime: 1400, target: 50 }
  }

  const COLORS = [
    { name: 'Vermelho', class: 'bg-red-500' },
    { name: 'Azul', class: 'bg-blue-500' },
    { name: 'Verde', class: 'bg-green-500' },
    { name: 'Amarelo', class: 'bg-yellow-500' }
  ]

  const SHAPES = [
    { name: 'Círculo', symbol: '●' },
    { name: 'Quadrado', symbol: '■' },
    { name: 'Triângulo', symbol: '▲' },
    { name: 'Estrela', symbol: '★' }
  ]

  const POSITIONS = ['Esquerda', 'Centro', 'Direita']

  // Função para criar deep copy
  const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj))

  // Gerar sequência nova
  const generateNewSequence = () => {
    const config = levelConfig[currentLevel as keyof typeof levelConfig]
    const newSequence: SequenceItem[] = []
    
    for (let i = 0; i < config.length; i++) {
      newSequence.push({
        color: COLORS[Math.floor(Math.random() * COLORS.length)].name,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)].name,
        position: Math.floor(Math.random() * 3)
      })
    }
    
    console.log('🎯 NOVA SEQUÊNCIA GERADA:', newSequence)
    return deepCopy(newSequence)
  }

  // Resetar tudo
  const resetRound = () => {
    setCorrectSequence([])
    setUserSequence([])
    setSelectedColor(null)
    setSelectedShape(null)
    setInputStep('color')
    setShowingIndex(0)
    setFeedback(null)
    console.log('🔄 ROUND RESETADO')
  }

  // Iniciar rodada
  const startRound = () => {
    resetRound()
    const newSequence = generateNewSequence()
    setCorrectSequence(newSequence)
    setGamePhase('showing')
    setShowingIndex(0)
    
    // Mostrar cada elemento da sequência
    showSequenceElements(newSequence)
  }

  // Mostrar elementos da sequência um por vez
  const showSequenceElements = (sequence: SequenceItem[]) => {
    let index = 0
    const config = levelConfig[currentLevel as keyof typeof levelConfig]
    
    const showNext = () => {
      if (index < sequence.length) {
        setShowingIndex(index)
        console.log(`👁️ MOSTRANDO ELEMENTO ${index + 1}:`, sequence[index])
        index++
        setTimeout(showNext, config.showTime)
      } else {
        console.log('✅ SEQUÊNCIA COMPLETA MOSTRADA')
        setGamePhase('input')
        setInputStep('color')
      }
    }
    
    showNext()
  }

  // Selecionar cor
  const selectColor = (color: string) => {
    setSelectedColor(color)
    setInputStep('shape')
    console.log('🎨 COR SELECIONADA:', color)
  }

  // Selecionar forma
  const selectShape = (shape: string) => {
    setSelectedShape(shape)
    setInputStep('position')
    console.log('📐 FORMA SELECIONADA:', shape)
  }

  // Selecionar posição (completa o elemento)
  const selectPosition = (position: number) => {
    if (!selectedColor || !selectedShape) return
    
    const newElement: SequenceItem = {
      color: selectedColor,
      shape: selectedShape,
      position: position
    }
    
    const newUserSequence = [...userSequence, newElement]
    setUserSequence(newUserSequence)
    
    console.log('📍 POSIÇÃO SELECIONADA:', POSITIONS[position])
    console.log('✨ ELEMENTO COMPLETO:', newElement)
    console.log('📝 SEQUÊNCIA DO USUÁRIO:', newUserSequence)
    
    // Reset para próximo elemento
    setSelectedColor(null)
    setSelectedShape(null)
    setInputStep('color')
    
    // Verificar se completou a sequência
    if (newUserSequence.length === correctSequence.length) {
      setTimeout(() => verifyAnswer(newUserSequence), 500)
    }
  }

  // Verificar resposta
  const verifyAnswer = (userSeq: SequenceItem[]) => {
    console.log('🔍 VERIFICANDO RESPOSTA...')
    console.log('🎯 SEQUÊNCIA CORRETA:', correctSequence)
    console.log('👤 SEQUÊNCIA DO USUÁRIO:', userSeq)
    
    if (correctSequence.length !== userSeq.length) {
      console.log('❌ TAMANHOS DIFERENTES')
      setFeedback({ correct: false, message: 'Sequência incompleta!' })
      setGamePhase('feedback')
      return
    }
    
    let allCorrect = true
    for (let i = 0; i < correctSequence.length; i++) {
      const correct = correctSequence[i]
      const user = userSeq[i]
      
      const isElementCorrect = 
        correct.color === user.color &&
        correct.shape === user.shape &&
        correct.position === user.position
      
      console.log(`🔎 ELEMENTO ${i + 1}:`)
      console.log(`   Correto: ${correct.color} ${correct.shape} ${POSITIONS[correct.position]}`)
      console.log(`   Usuário: ${user.color} ${user.shape} ${POSITIONS[user.position]}`)
      console.log(`   Match: ${isElementCorrect}`)
      
      if (!isElementCorrect) {
        allCorrect = false
      }
    }
    
    console.log(`🏆 RESULTADO FINAL: ${allCorrect ? 'CORRETO' : 'INCORRETO'}`)
    
    setAttempts(prev => prev + 1)
    
    if (allCorrect) {
      setScore(prev => prev + 10)
      setFeedback({ correct: true, message: 'Perfeito! Sequência correta!' })
    } else {
      setFeedback({ correct: false, message: 'Incorreto. Tente novamente!' })
    }
    
    setGamePhase('feedback')
  }

  // Próxima rodada
  const nextRound = () => {
    if (score >= 50 && currentLevel < 3) {
      setCurrentLevel(prev => prev + 1)
      setScore(0)
      console.log(`🆙 SUBINDO PARA NÍVEL ${currentLevel + 1}`)
    }
    setGamePhase('ready')
    resetRound()
  }

  // Reset completo da atividade
  const resetActivity = () => {
    setCurrentLevel(1)
    setScore(0)
    setAttempts(0)
    setGamePhase('ready')
    resetRound()
    setShowActivity(false)
    console.log('🔄 ATIVIDADE RESETADA COMPLETAMENTE')
  }

  // Helpers para UI
  const getColorClass = (colorName: string) => {
    return COLORS.find(c => c.name === colorName)?.class || 'bg-gray-500'
  }

  const getShapeSymbol = (shapeName: string) => {
    return SHAPES.find(s => s.name === shapeName)?.symbol || '●'
  }

  const getCurrentElement = () => {
    if (gamePhase === 'showing' && correctSequence.length > 0) {
      return correctSequence[showingIndex]
    }
    return null
  }

  if (!showActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Botão Voltar */}
          <div className="mb-4">
            <button 
              onClick={() => router.push('/tdah')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </div>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Sequências Complexas</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Objetivo */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-400">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-800">Objetivo:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Desenvolver a capacidade de memória de trabalho multi-modal através da memorização 
                de sequências que combinam múltiplos atributos visuais (cor, forma e posição). 
                Esta atividade desafia a capacidade de processar e reter informações complexas simultaneamente.
              </p>
            </div>

            {/* Pontuação */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-400">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">Pontuação:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Cada sequência reproduzida corretamente = +10 pontos. Você precisa de 50 pontos 
                para completar a atividade com sucesso e avançar para o próximo nível.
              </p>
            </div>
          </div>

          {/* Níveis */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-purple-400">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">📊</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Níveis:</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 1: Complexidade Básica</h3>
                  <p className="text-gray-600 text-sm">3 elementos com cor + forma + posição</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Iniciante
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 2: Complexidade Intermediária</h3>
                  <p className="text-gray-600 text-sm">4 elementos com cor + forma + posição</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Intermediário
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 3: Complexidade Avançada</h3>
                  <p className="text-gray-600 text-sm">5 elementos com cor + forma + posição</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Avançado
                </span>
              </div>
            </div>
          </div>

          {/* Base Científica */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-pink-400">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-semibold text-gray-800">Base Científica:</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Esta atividade baseia-se em estudos sobre processamento multi-modal da memória de trabalho. 
              A necessidade de manter e manipular simultaneamente múltiplos atributos visuais 
              (cor, forma, posição) recruta extensivamente tanto o esboço visuoespacial quanto 
              o executivo central, proporcionando um treino abrangente da memória de trabalho.
            </p>
          </div>

          {/* Botão Começar */}
          <div className="mt-8 text-center">
            <button 
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto"
              onClick={() => setShowActivity(true)}
            >
              <Play className="w-5 h-5" />
              Começar Atividade
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowActivity(false)}
              className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Sequências Complexas</h1>
            </div>
          </div>
          
          <button
            onClick={resetActivity}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
        </div>

        {/* Status */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Nível</h3>
            <p className="text-2xl font-bold text-blue-600">{currentLevel}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Pontuação</h3>
            <p className="text-2xl font-bold text-green-600">{score}/50</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Tentativas</h3>
            <p className="text-2xl font-bold text-purple-600">{attempts}</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          {gamePhase === 'ready' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Nível {currentLevel}: Memorize {levelConfig[currentLevel as keyof typeof levelConfig].length} elementos complexos
              </h2>
              <p className="text-gray-600 mb-6">
                Uma sequência aparecerá mostrando elementos com COR + FORMA + POSIÇÃO. 
                Memorize e reproduza em 3 etapas: primeiro a cor, depois a forma, e por último a posição.
              </p>
              <button
                onClick={startRound}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-shadow"
              >
                <Play className="w-5 h-5" />
                Iniciar Rodada
              </button>
            </div>
          )}

          {gamePhase === 'showing' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-6">
                Memorize esta sequência - Elemento {showingIndex + 1}/{correctSequence.length}:
              </h2>
              
              {getCurrentElement() && (
                <div className="mb-8">
                  <div className="text-lg mb-4 font-semibold text-blue-600">
                    {getCurrentElement()!.color} {getCurrentElement()!.shape} na {POSITIONS[getCurrentElement()!.position]}
                  </div>
                  
                  <div className={`flex ${getCurrentElement()!.position === 0 ? 'justify-start' : getCurrentElement()!.position === 1 ? 'justify-center' : 'justify-end'} w-full max-w-md mx-auto`}>
                    <div className={`w-20 h-20 ${getColorClass(getCurrentElement()!.color)} rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                      {getShapeSymbol(getCurrentElement()!.shape)}
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-600">Aguarde... mostrando todos os elementos</p>
            </div>
          )}

          {gamePhase === 'input' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-6">
                Reproduza o elemento {userSequence.length + 1}/{correctSequence.length}
              </h2>
              
              {/* Progresso da seleção atual */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Seleção atual:</p>
                <div className="flex items-center justify-center gap-2">
                  <span className={selectedColor ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                    {selectedColor || 'Cor'}
                  </span>
                  <span className="text-gray-300">→</span>
                  <span className={selectedShape ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                    {selectedShape || 'Forma'}
                  </span>
                  <span className="text-gray-300">→</span>
                  <span className="text-gray-400">Posição</span>
                </div>
              </div>

              {/* Etapa 1: Selecionar Cor */}
              {inputStep === 'color' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">1. Escolha a COR:</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => selectColor(color.name)}
                        className={`p-4 ${color.class} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all`}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Etapa 2: Selecionar Forma */}
              {inputStep === 'shape' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">2. Escolha a FORMA:</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {SHAPES.map((shape) => (
                      <button
                        key={shape.name}
                        onClick={() => selectShape(shape.name)}
                        className="p-4 bg-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-2xl"
                      >
                        <div>
                          <div className="text-3xl mb-2">{shape.symbol}</div>
                          <div className="text-sm">{shape.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Etapa 3: Selecionar Posição */}
              {inputStep === 'position' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">3. Escolha a POSIÇÃO:</h3>
                  <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                    {POSITIONS.map((position, index) => (
                      <button
                        key={position}
                        onClick={() => selectPosition(index)}
                        className="p-4 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                      >
                        {position}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sequência do usuário até agora */}
              {userSequence.length > 0 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Sua sequência:</h4>
                  {userSequence.map((item, index) => (
                    <div key={index} className="text-sm text-gray-700">
                      {index + 1}. {item.color} {item.shape} na {POSITIONS[item.position]}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {gamePhase === 'feedback' && feedback && (
            <div className="text-center">
              <div className={`flex items-center justify-center gap-3 mb-6 ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                {feedback.correct ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                <h2 className="text-xl font-semibold">{feedback.message}</h2>
              </div>
              
              {!feedback.correct && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Comparação:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-green-600 mb-2">Sequência Correta:</h5>
                      {correctSequence.map((item, index) => (
                        <div key={index} className="text-sm">
                          {index + 1}. {item.color} {item.shape} na {POSITIONS[item.position]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <h5 className="font-medium text-red-600 mb-2">Sua Resposta:</h5>
                      {userSequence.map((item, index) => (
                        <div key={index} className="text-sm">
                          {index + 1}. {item.color} {item.shape} na {POSITIONS[item.position]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {score >= 50 ? (
                <div className="mb-6">
                  <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <p className="font-semibold">Nível {currentLevel} Concluído!</p>
                </div>
              ) : (
                <p className="mb-6">Pontos necessários: {50 - score}</p>
              )}
              
              <button
                onClick={nextRound}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                {score >= 50 && currentLevel < 3 ? 'Próximo Nível' : 'Nova Rodada'}
              </button>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Progresso do Nível {currentLevel}</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((score / 50) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{score}/50 pontos</p>
        </div>
      </div>
    </div>
  )
}