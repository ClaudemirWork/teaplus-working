'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Target, Award, Brain, BookOpen, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Stimulus {
  position: number
  sound: number
  index: number
}

interface Response {
  positionPressed: boolean
  soundPressed: boolean
  correctPosition: boolean
  correctSound: boolean
}

export default function DualNBack() {
  const router = useRouter()
  const [showActivity, setShowActivity] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [stimuli, setStimuli] = useState<Stimulus[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Response[]>([])
  const [gamePhase, setGamePhase] = useState<'ready' | 'playing' | 'feedback'>('ready')
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [hasResponded, setHasResponded] = useState<{position: boolean, sound: boolean}>({position: false, sound: false})

  const [isPlaying, setIsPlaying] = useState(false)

  const levelConfig = {
    1: { nBack: 1, stimuliCount: 10, target: 50 },
    2: { nBack: 2, stimuliCount: 12, target: 50 },
    3: { nBack: 3, stimuliCount: 15, target: 50 }
  }

  // 9 posições em grid 3x3
  const positions = [
    { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
    { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
    { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }
  ]

  // 4 sons diferentes (frequências)
  const sounds = [440, 523, 659, 784] // A4, C5, E5, G5

  const playSound = (frequency: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)
    } catch (error) {
      console.log('Audio não suportado')
    }
  }

  const generateStimuli = () => {
    const config = levelConfig[currentLevel as keyof typeof levelConfig]
    const newStimuli: Stimulus[] = []
    
    for (let i = 0; i < config.stimuliCount; i++) {
      newStimuli.push({
        position: Math.floor(Math.random() * 9),
        sound: Math.floor(Math.random() * 4),
        index: i
      })
    }
    
    console.log('=== ESTÍMULOS GERADOS ===')
    console.log(`Nível ${currentLevel} - N-Back ${config.nBack}`)
    console.log(`Total de estímulos: ${newStimuli.length}`)
    console.log(newStimuli)
    console.log('========================')
    
    setStimuli(newStimuli)
    setResponses(Array(config.stimuliCount).fill({
      positionPressed: false,
      soundPressed: false,
      correctPosition: false,
      correctSound: false
    }))
    // NÃO resetar currentIndex aqui - será feito no startGame
  }

  // useEffect para controlar o timing dos estímulos
  useEffect(() => {
    if (gamePhase === 'playing' && stimuli.length > 0 && isPlaying) {
      console.log(`useEffect: currentIndex=${currentIndex}, stimuli.length=${stimuli.length}`)
      
      if (currentIndex >= stimuli.length) {
        console.log('Fim da sequência - parando jogo')
        setIsPlaying(false)
        endGame()
        return
      }

      const stimulus = stimuli[currentIndex]
      console.log(`Mostrando estímulo ${currentIndex}: Pos=${stimulus.position}, Som=${stimulus.sound}`)
      
      // Reset responses para este estímulo
      setHasResponded({position: false, sound: false})
      
      // Toca o som
      playSound(sounds[stimulus.sound])
      
      // Timer para avançar para próximo estímulo
      const timer = setTimeout(() => {
        console.log(`Avançando de ${currentIndex} para ${currentIndex + 1}`)
        setCurrentIndex(prev => prev + 1)
      }, 2000) // 2 segundos por estímulo
      
      return () => clearTimeout(timer)
    }
  }, [currentIndex, gamePhase, stimuli, isPlaying])

  const startGame = () => {
    console.log('=== INICIANDO JOGO ===')
    setCurrentIndex(0)
    setHasResponded({position: false, sound: false})
    setFeedback(null)
    
    generateStimuli()
    setGamePhase('playing')
    
    // Inicia o loop de estímulos
    setTimeout(() => {
      setIsPlaying(true)
    }, 100)
  }

  const handleResponse = (type: 'position' | 'sound') => {
    if (hasResponded[type] || currentIndex === 0) return

    const config = levelConfig[currentLevel as keyof typeof levelConfig]
    const currentStimulus = stimuli[currentIndex]
    
    // Só pode responder se houver estímulos suficientes para comparar
    if (currentIndex < config.nBack) {
      console.log(`Muito cedo para N-Back ${config.nBack}`)
      return
    }

    const compareIndex = currentIndex - config.nBack
    const compareStimulus = stimuli[compareIndex]
    
    let isCorrect = false
    if (type === 'position') {
      isCorrect = currentStimulus.position === compareStimulus.position
      setHasResponded(prev => ({...prev, position: true}))
    } else {
      isCorrect = currentStimulus.sound === compareStimulus.sound
      setHasResponded(prev => ({...prev, sound: true}))
    }
    
    console.log(`Resposta ${type}: ${isCorrect}`)
    console.log(`Atual: pos=${currentStimulus.position} som=${currentStimulus.sound}`)
    console.log(`Comparar com índice ${compareIndex}: pos=${compareStimulus.position} som=${compareStimulus.sound}`)
    
    // Atualiza resposta
    const newResponses = [...responses]
    newResponses[currentIndex] = {
      ...newResponses[currentIndex],
      [`${type}Pressed`]: true,
      [`correct${type.charAt(0).toUpperCase() + type.slice(1)}`]: isCorrect
    }
    setResponses(newResponses)
    
    if (isCorrect) {
      setScore(prev => prev + 5) // 5 pontos por acerto
    }
  }

  const endGame = () => {
    console.log('=== FIM DO JOGO ===')
    setIsPlaying(false)
    setGamePhase('feedback')
    setAttempts(prev => prev + 1)
    
    // Calcula estatísticas
    const config = levelConfig[currentLevel as keyof typeof levelConfig]
    const validResponses = responses.slice(config.nBack) // Só conta a partir de onde N-back é possível
    
    const positionHits = validResponses.filter(r => r.positionPressed && r.correctPosition).length
    const soundHits = validResponses.filter(r => r.soundPressed && r.correctSound).length
    const totalHits = positionHits + soundHits
    
    console.log('=== RESULTADO FINAL ===')
    console.log(`Acertos posição: ${positionHits}`)
    console.log(`Acertos som: ${soundHits}`)
    console.log(`Total: ${totalHits}`)
    console.log(`Pontuação: ${score}`)
    console.log('======================')
    
    if (score >= config.target) {
      setFeedback({
        correct: true,
        message: `Excelente! ${totalHits} acertos!`
      })
    } else {
      setFeedback({
        correct: false,
        message: `Continue praticando! ${totalHits} acertos.`
      })
    }
  }

  const nextRound = () => {
    console.log('=== NOVA RODADA ===')
    
    // Para qualquer loop em execução
    setIsPlaying(false)
    
    if (score >= levelConfig[currentLevel as keyof typeof levelConfig].target && currentLevel < 3) {
      setCurrentLevel(prev => prev + 1)
      setScore(0)
    }
    
    // Limpa TODOS os estados
    setStimuli([])
    setResponses([])
    setCurrentIndex(0)
    setHasResponded({position: false, sound: false})
    setGamePhase('ready')
    setFeedback(null)
    
    console.log('Estados limpos - pronto para nova rodada')
  }

  const resetActivity = () => {
    console.log('=== RESET COMPLETO ===')
    
    // Para qualquer loop em execução
    setIsPlaying(false)
    
    setCurrentLevel(1)
    setScore(0)
    setAttempts(0)
    setStimuli([])
    setResponses([])
    setCurrentIndex(0)
    setHasResponded({position: false, sound: false})
    setGamePhase('ready')
    setFeedback(null)
    setShowActivity(false)
    
    console.log('Reset completo realizado')
  }

  if (!showActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Botão Voltar ao TDAH */}
          <div className="mb-4">
            <button 
              onClick={() => router.push('/tdah')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao TDAH
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
              <h1 className="text-2xl font-bold text-gray-800">Dual N-Back</h1>
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
                Desenvolver a capacidade máxima de memória de trabalho através do treinamento 
                Dual N-Back. Detecte quando a posição visual ou o som auditivo atual é igual 
                ao apresentado N posições atrás, exercitando simultaneamente múltiplos sistemas da memória.
              </p>
            </div>

            {/* Pontuação */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-400">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">Pontuação:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Cada detecção correta = +5 pontos. Você precisa de 50 pontos 
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
                  <h3 className="font-semibold text-blue-600">Nível 1: Single N-Back</h3>
                  <p className="text-gray-600 text-sm">Detecte quando atual = 1 posição atrás</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Iniciante
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 2: Dual N-Back</h3>
                  <p className="text-gray-600 text-sm">Detecte quando atual = 2 posições atrás</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Intermediário
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 3: Triple N-Back</h3>
                  <p className="text-gray-600 text-sm">Detecte quando atual = 3 posições atrás</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Avançado
                </span>
              </div>
            </div>
          </div>

          {/* Final */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-green-400">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">🏁</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Final:</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Complete os 3 níveis com 50 pontos para finalizar a atividade e 
              dominar o treinamento mais avançado de memória de trabalho, fortalecendo 
              significativamente sua capacidade cognitiva executiva.
            </p>
          </div>

          {/* Base Científica */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-pink-400">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-semibold text-gray-800">Base Científica:</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              O Dual N-Back é considerado o "padrão ouro" para treinamento de memória de trabalho. 
              Estudos demonstram que este exercício pode aumentar a inteligência fluida (Gf) 
              e fortalecer redes neurais do córtex pré-frontal. É amplamente utilizado em 
              pesquisas de neuroplasticidade e melhoria cognitiva.
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
              <h1 className="text-2xl font-bold text-gray-800">Dual N-Back</h1>
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
            <h3 className="text-sm font-medium text-gray-500">Nível (N-Back)</h3>
            <p className="text-2xl font-bold text-blue-600">{currentLevel}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Pontuação</h3>
            <p className="text-2xl font-bold text-green-600">{score}/50</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <h3 className="text-sm font-medium text-gray-500">Progresso</h3>
            <p className="text-2xl font-bold text-purple-600">{currentIndex}/{stimuli.length}</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
          {gamePhase === 'ready' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Nível {currentLevel}: {currentLevel}-Back ({levelConfig[currentLevel as keyof typeof levelConfig].stimuliCount} estímulos)
              </h2>
              <p className="text-gray-600 mb-6">
                Pressione "Posição N-Back" quando a posição atual for igual à posição de {currentLevel} estímulo(s) atrás.
                Pressione "Som N-Back" quando o som atual for igual ao som de {currentLevel} estímulo(s) atrás.
              </p>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-shadow"
              >
                <Play className="w-5 h-5" />
                Iniciar {currentLevel}-Back
              </button>
            </div>
          )}

          {gamePhase === 'playing' && stimuli.length === 0 && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Preparando estímulos...</h2>
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          )}

          {gamePhase === 'playing' && stimuli.length > 0 && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-6">
                Estímulo {currentIndex + 1}/{stimuli.length} - Detecte {currentLevel}-Back
              </h2>
              
              {/* Grid 3x3 para mostrar posição */}
              <div className="grid grid-cols-3 gap-2 w-48 h-48 mx-auto mb-6">
                {Array.from({length: 9}, (_, i) => (
                  <div
                    key={i}
                    className={`border-2 border-gray-300 rounded-lg transition-all duration-200 ${
                      stimuli[currentIndex]?.position === i ? 'bg-blue-500 shadow-lg' : 'bg-gray-100'
                    }`}
                  />
                ))}
              </div>

              <div className="space-x-4">
                <button
                  onClick={() => handleResponse('position')}
                  disabled={hasResponded.position || currentIndex < levelConfig[currentLevel as keyof typeof levelConfig].nBack}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                >
                  Posição {currentLevel}-Back
                </button>
                
                <button
                  onClick={() => handleResponse('sound')}
                  disabled={hasResponded.sound || currentIndex < levelConfig[currentLevel as keyof typeof levelConfig].nBack}
                  className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
                >
                  Som {currentLevel}-Back
                </button>
                
                {/* Botão de debug para parar */}
                <button
                  onClick={() => {
                    setIsPlaying(false)
                    console.log('Jogo pausado manualmente')
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
                >
                  Pausar
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                {currentIndex < levelConfig[currentLevel as keyof typeof levelConfig].nBack 
                  ? `Aguarde ${levelConfig[currentLevel as keyof typeof levelConfig].nBack - currentIndex} estímulos para começar a responder`
                  : 'Pressione os botões quando detectar correspondências'
                }
              </p>
              
              <div className="mt-4 text-xs text-gray-400">
                Debug: Pos={stimuli[currentIndex]?.position}, Som={stimuli[currentIndex]?.sound}
                {isPlaying && <span className="ml-2 text-green-600">⏸ Executando...</span>}
              </div>
              
              {/* Barra de progresso do estímulo atual */}
              {isPlaying && (
                <div className="mt-2 w-32 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          )}

          {gamePhase === 'feedback' && feedback && (
            <div className="text-center">
              <div className={`flex items-center justify-center gap-3 mb-4 ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                {feedback.correct ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
                <h2 className="text-xl font-semibold">{feedback.message}</h2>
              </div>
              
              {score >= levelConfig[currentLevel as keyof typeof levelConfig].target ? (
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 text-yellow-600 mb-2">
                    <Trophy className="w-6 h-6" />
                    <span className="font-semibold">Nível {currentLevel} Concluído!</span>
                  </div>
                  {currentLevel < 3 ? (
                    <p className="text-gray-600">Parabéns! Você desbloqueou o próximo nível.</p>
                  ) : (
                    <p className="text-gray-600">Excelente! Você dominou o Dual N-Back!</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 mb-6">
                  Continue praticando! Você precisa de {levelConfig[currentLevel as keyof typeof levelConfig].target - score} pontos para completar este nível.
                </p>
              )}
              
              <button
                onClick={nextRound}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                {score >= levelConfig[currentLevel as keyof typeof levelConfig].target && currentLevel < 3 ? 'Próximo Nível' : 'Nova Rodada'}
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
              style={{ width: `${Math.min((score / levelConfig[currentLevel as keyof typeof levelConfig].target) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{score}/{levelConfig[currentLevel as keyof typeof levelConfig].target} pontos</p>
        </div>
      </div>
    </div>
  )
}