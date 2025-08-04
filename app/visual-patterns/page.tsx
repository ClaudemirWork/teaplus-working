'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Target, Award, Brain, BookOpen, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PadroesVisuais() {
  const router = useRouter()
  const [showActivity, setShowActivity] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [pattern, setPattern] = useState<number[]>([])
  const [userPattern, setUserPattern] = useState<number[]>([])
  const [showPattern, setShowPattern] = useState(false)
  const [gamePhase, setGamePhase] = useState<'ready' | 'showing' | 'input' | 'feedback'>('ready')
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)
  const [attempts, setAttempts] = useState(0)

  const levelConfig = {
    1: { gridSize: 3, patternLength: 3, time: 2000, target: 50 },
    2: { gridSize: 4, patternLength: 4, time: 2500, target: 50 },
    3: { gridSize: 4, patternLength: 6, time: 3000, target: 50 }
  }

  const generatePattern = () => {
    const config = levelConfig[currentLevel as keyof typeof levelConfig]
    const totalCells = config.gridSize * config.gridSize
    const newPattern: number[] = []
    
    while (newPattern.length < config.patternLength) {
      const randomCell = Math.floor(Math.random() * totalCells)
      if (!newPattern.includes(randomCell)) {
        newPattern.push(randomCell)
      }
    }
    
    setPattern(newPattern)
    setUserPattern([])
  }

  const startRound = () => {
    generatePattern()
    setGamePhase('showing')
    setShowPattern(true)
    setFeedback(null)
    
    setTimeout(() => {
      setShowPattern(false)
      setGamePhase('input')
    }, levelConfig[currentLevel as keyof typeof levelConfig].time)
  }

  const handleCellClick = (cellIndex: number) => {
    if (gamePhase !== 'input') return
    
    const newUserPattern = [...userPattern]
    if (newUserPattern.includes(cellIndex)) {
      // Remove se já está selecionado
      setUserPattern(newUserPattern.filter(index => index !== cellIndex))
    } else {
      // Adiciona se não está selecionado
      setUserPattern([...newUserPattern, cellIndex])
    }
  }

  const checkAnswer = () => {
    const isCorrect = pattern.length === userPattern.length && 
                     pattern.every(cell => userPattern.includes(cell))
    
    setAttempts(prev => prev + 1)
    
    if (isCorrect) {
      setScore(prev => prev + 10)
      setFeedback({
        correct: true,
        message: "Excelente! Padrão correto!"
      })
    } else {
      setFeedback({
        correct: false,
        message: "Incorreto. Tente novamente!"
      })
    }
    
    setGamePhase('feedback')
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
    setShowActivity(false)
  }

  const renderGrid = (isShowingPattern: boolean) => {
    const config = levelConfig[currentLevel as keyof typeof levelConfig]
    const gridSize = config.gridSize
    const cells = Array(gridSize * gridSize).fill(0).map((_, index) => index)

    return (
      <div 
        className="grid gap-2 mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: `${gridSize * 60 + (gridSize - 1) * 8}px`
        }}
      >
        {cells.map((cellIndex) => {
          const isPatternCell = pattern.includes(cellIndex)
          const isSelectedByUser = userPattern.includes(cellIndex)
          
          let cellClass = "w-14 h-14 rounded-lg border-2 cursor-pointer transition-all duration-200 "
          
          if (isShowingPattern && isPatternCell) {
            cellClass += "bg-blue-500 border-blue-600"
          } else if (gamePhase === 'input' && isSelectedByUser) {
            cellClass += "bg-green-500 border-green-600"
          } else if (gamePhase === 'feedback') {
            if (isPatternCell && isSelectedByUser) {
              cellClass += "bg-green-500 border-green-600" // Correto
            } else if (isPatternCell && !isSelectedByUser) {
              cellClass += "bg-red-500 border-red-600" // Perdeu este
            } else if (!isPatternCell && isSelectedByUser) {
              cellClass += "bg-orange-500 border-orange-600" // Selecionou errado
            } else {
              cellClass += "bg-gray-200 border-gray-300"
            }
          } else {
            cellClass += "bg-gray-200 border-gray-300 hover:bg-gray-300"
          }
          
          return (
            <div
              key={cellIndex}
              className={cellClass}
              onClick={() => handleCellClick(cellIndex)}
            />
          )
        })}
      </div>
    )
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
              <h1 className="text-2xl font-bold text-gray-800">Padrões Visuais</h1>
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
                Fortalecer a memória visual de trabalho através do reconhecimento e reprodução 
                de padrões visuais em grade. Desenvolver a capacidade de manter informações 
                visuais na mente e reproduzi-las com precisão após breve exposição.
              </p>
            </div>

            {/* Pontuação */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-400">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-800">Pontuação:</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Cada padrão reproduzido corretamente = +10 pontos. Você precisa de 50 pontos 
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
                  <h3 className="font-semibold text-blue-600">Nível 1: Padrões Básicos</h3>
                  <p className="text-gray-600 text-sm">Grade 3x3 com 3 células destacadas</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Iniciante
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 2: Padrões Intermediários</h3>
                  <p className="text-gray-600 text-sm">Grade 4x4 com 4 células destacadas</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Intermediário
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-blue-600">Nível 3: Padrões Avançados</h3>
                  <p className="text-gray-600 text-sm">Grade 4x4 com 6 células destacadas</p>
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
              dominar as habilidades de reconhecimento de padrões visuais, fortalecendo 
              significativamente sua memória visual de trabalho.
            </p>
          </div>

          {/* Base Científica */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6 border-l-4 border-pink-400">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-semibold text-gray-800">Base Científica:</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Esta atividade é baseada no teste de Corsi Block e em estudos de memória 
              visuoespacial. Pesquisas neuropsicológicas demonstram que o treinamento de 
              padrões visuais fortalece o esboço visuoespacial da memória de trabalho, 
              melhorando a capacidade de processar e reter informações visuais complexas.
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
              <h1 className="text-2xl font-bold text-gray-800">Padrões Visuais</h1>
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
                Nível {currentLevel}: Memorize padrões visuais em grade {levelConfig[currentLevel as keyof typeof levelConfig].gridSize}x{levelConfig[currentLevel as keyof typeof levelConfig].gridSize}
              </h2>
              <p className="text-gray-600 mb-6">
                Um padrão de células destacadas aparecerá por {levelConfig[currentLevel as keyof typeof levelConfig].time / 1000} segundos. 
                Memorize as posições e reproduza clicando nas células corretas.
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
              <h2 className="text-xl font-semibold mb-6">Memorize este padrão:</h2>
              {renderGrid(true)}
              <p className="text-gray-600 mt-6">Padrão será ocultado em breve...</p>
            </div>
          )}

          {gamePhase === 'input' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-6">Clique nas células que estavam destacadas:</h2>
              {renderGrid(false)}
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => setUserPattern([])}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  Limpar
                </button>
                <button
                  onClick={checkAnswer}
                  disabled={userPattern.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                >
                  Verificar Resposta
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Células selecionadas: {userPattern.length}/{pattern.length}
              </p>
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
              
              {renderGrid(false)}
              
              <div className="mt-6">
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