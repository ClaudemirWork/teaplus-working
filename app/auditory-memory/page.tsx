'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Target, Award, Brain, BookOpen, Trophy, RotateCcw, CheckCircle, XCircle, Volume2, VolumeX } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function MemoriaAuditiva() {
  const router = useRouter()
  const [showActivity, setShowActivity] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [sequence, setSequence] = useState<number[]>([])
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [gamePhase, setGamePhase] = useState<'ready' | 'playing' | 'input' | 'feedback'>('ready')
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTone, setCurrentTone] = useState<number | null>(null)

  const [shouldPlaySequence, setShouldPlaySequence] = useState(false)

  const levelConfig = {
    1: { sequenceLength: 3, toneCount: 4, target: 50 },
    2: { sequenceLength: 4, toneCount: 5, target: 50 },
    3: { sequenceLength: 6, toneCount: 6, target: 50 }
  }

  // Reproduz a sequência quando ela estiver pronta
  useEffect(() => {
    const runPlaySequence = async () => {
      if (shouldPlaySequence && sequence.length > 0) {
        setShouldPlaySequence(false)
        await playSequence()
      }
    }
    runPlaySequence()
  }, [shouldPlaySequence, sequence])

  const tones = [
    { frequency: 440, color: 'bg-red-500', name: 'Dó' },      // A4
    { frequency: 523, color: 'bg-blue-500', name: 'Ré' },     // C5
    { frequency: 587, color: 'bg-green-500', name: 'Mi' },    // D5
    { frequency: 659, color: 'bg-yellow-500', name: 'Fá' },   // E5
    { frequency: 784, color: 'bg-purple-500', name: 'Sol' },  // G5
    { frequency: 880, color: 'bg-pink-500', name: 'Lá' }      // A5
  ]

  const playTone = (frequency: number, duration: number = 500) => {
    if (typeof window === 'undefined') return

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
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration / 1000)
    } catch (error) {
      console.log('Audio não suportado neste navegador')
    }
  }

  const generateSequence = () => {
    const config = levelConfig[currentLevel as keyof typeof levelConfig]
    const newSequence: number[] = []
    
    for (let i = 0; i < config.sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * config.toneCount))
    }
    
    console.log('Nova sequência gerada:', newSequence)
    setSequence(newSequence)
    setUserSequence([])
  }

  const playSequence = async () => {
    setIsPlaying(true)
    setGamePhase('playing')
    
    for (let i = 0; i < sequence.length; i++) {
      setCurrentTone(sequence[i])
      playTone(tones[sequence[i]].frequency, 600)
      await new Promise(resolve => setTimeout(resolve, 800))
      setCurrentTone(null)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    setIsPlaying(false)
    setGamePhase('input')
  }

  const startRound = () => {
    setFeedback(null)
    generateSequence()
    // Aguarda um momento e então sinaliza para reproduzir a sequência
    setTimeout(() => {
      setShouldPlaySequence(true)
    }, 1000)
  }

  const handleToneClick = (toneIndex: number) => {
    if (gamePhase !== 'input' || isPlaying) return
    
    console.log('Clique no tom:', toneIndex)
    playTone(tones[toneIndex].frequency, 300)
    setUserSequence(prev => {
      const newSequence = [...prev, toneIndex]
      console.log('Nova sequência do usuário:', newSequence)
      return newSequence
    })
  }

  const clearSequence = () => {
    setUserSequence([])
  }

  const checkAnswer = () => {
    // Debug: logs para verificar as sequências
    console.log('Sequência original:', sequence)
    console.log('Sequência do usuário:', userSequence)
    
    // Verifica se as sequências têm o mesmo tamanho e mesmos elementos na mesma ordem
    const isCorrect = sequence.length === userSequence.length && 
                     sequence.every((tone, index) => tone === userSequence[index])
    
    console.log('Resposta correta?', isCorrect)
    
    setAttempts(prev => prev + 1)
    
    if (isCorrect) {
      setScore(prev => prev + 10)
      setFeedback({
        correct: true,
        message: "Excelente! Sequência correta!"
      })
    } else {
      setFeedback({
        correct: false,
        message: "Incorreto. Tente novamente!"
      })
    }
    
    setGamePhase('feedback')
  }

  const replaySequence = () => {
    if (gamePhase === 'input' && !isPlaying) {
      playSequence()
    }
  }

  const nextRound = () => {
    if (score >= 50 && currentLevel < 3) {
      setCurrentLevel(prev => prev + 1)
      setScore(0)
    }
    setGamePhase('ready')
  }

  const resetActivity = () => {
    setCurrentLevel(1)
    setScore(0)
    setAttempts(0)
    setGamePhase('ready')
    setFeedback(null)
    setShouldPlaySequence(false)
    setShowActivity(false)
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
              <h1 className="text-2xl font-bold text-gray-800">Memória Auditiva</h1>
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
                Desenvolver e fortalecer a capacidade de memória auditiva através da 
                retenção e reprodução de sequências sonoras. Melhorar o processamento 
                auditivo sequencial e a capacidade de manter informações sonoras na memória de trabalho.
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
                  <h3 className="font-semibold text-blue-600">Nível 1: Sequências Básicas</h3>
                  <p className="text-gray-600 text-sm">3 tons em sequência com 4 tons diferentes</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Iniciante
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 2: Sequências Intermediárias</h3>
                  <p className="text-gray-600 text-sm">4 tons em sequência com 5 tons diferentes</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Intermediário
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 3: Sequências Avançadas</h3>
                  <p className="text-gray-600 text-sm">6 tons em sequência com 6 tons diferentes</p>
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
              dominar as habilidades de memória auditiva, fortalecendo 
              significativamente sua capacidade de processamento auditivo sequencial.
            </p>
          </div>

          {/* Base Científica */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-pink-400">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-semibold text-gray-800">Base Científica:</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Este exercício é baseado em testes de memória auditiva sequencial utilizados 
              em neuropsicologia e audiologia. Estudos demonstram que o treinamento de 
              sequências auditivas fortalece a alça fonológica da memória de trabalho e 
              melhora o processamento temporal auditivo, fundamentais para a linguagem e aprendizagem.
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
              <h1 className="text-2xl font-bold text-gray-800">Memória Auditiva</h1>
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
                Nível {currentLevel}: Memorize sequências de {levelConfig[currentLevel as keyof typeof levelConfig].sequenceLength} tons
              </h2>
              <p className="text-gray-600 mb-6">
                Uma sequência de tons musicais será reproduzida. Escute atentamente e 
                reproduza a sequência clicando nos tons na ordem correta.
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

          {gamePhase === 'playing' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-6">Escute a sequência:</h2>
              <div className="flex justify-center gap-4 mb-6">
                {tones.slice(0, levelConfig[currentLevel as keyof typeof levelConfig].toneCount).map((tone, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-200 ${
                      currentTone === index ? 'scale-110 shadow-lg ' + tone.color : 'bg-gray-300'
                    }`}
                  >
                    {currentTone === index && <Volume2 className="w-6 h-6" />}
                  </div>
                ))}
              </div>
              <p className="text-gray-600">Reproduzindo sequência...</p>
            </div>
          )}

          {gamePhase === 'input' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-6">Reproduza a sequência clicando nos tons:</h2>
              <div className="flex justify-center gap-4 mb-6">
                {tones.slice(0, levelConfig[currentLevel as keyof typeof levelConfig].toneCount).map((tone, index) => (
                  <button
                    key={index}
                    onClick={() => handleToneClick(index)}
                    disabled={isPlaying}
                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold transition-all duration-200 hover:scale-105 ${tone.color} hover:shadow-lg disabled:opacity-50`}
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">
                  Sua sequência ({userSequence.length}/{sequence.length}):
                </p>
                <div className="flex justify-center gap-2">
                  {userSequence.map((toneIndex, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded ${tones[toneIndex].color} border-2 border-white`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-x-4">
                <button
                  onClick={replaySequence}
                  disabled={isPlaying}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  🔄 Ouvir Novamente
                </button>
                <button
                  onClick={clearSequence}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  Limpar
                </button>
                <button
                  onClick={checkAnswer}
                  disabled={userSequence.length !== sequence.length}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                >
                  Verificar Resposta
                </button>
              </div>
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
              
              {!feedback.correct && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Sequência correta:</p>
                  <div className="flex justify-center gap-2">
                    {sequence.map((toneIndex, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded ${tones[toneIndex].color} border-2 border-white`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {score >= 50 ? (
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 text-yellow-600 mb-2">
                    <Trophy className="w-6 h-6" />
                    <span className="font-semibold">Nível {currentLevel} Concluído!</span>
                  </div>
                  {currentLevel < 3 ? (
                    <p className="text-gray-600">Parabéns! Você desbloqueou o próximo nível.</p>
                  ) : (
                    <p className="text-gray-600">Excelente! Você concluiu todos os níveis!</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 mb-6">
                  Continue praticando! Você precisa de {50 - score} pontos para completar este nível.
                </p>
              )}
              
              <button
                onClick={nextRound}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
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