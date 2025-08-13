'use client'
import { useState } from 'react'
import { AppProvider, useAppContext } from '@/contexts/AppContext'

// ✅ Componente do semáforo que usa o context
function SemaforoGameComponent() {
  const { currentSection, userProfile, backUrl } = useAppContext()
  const [currentLight, setCurrentLight] = useState<'red' | 'yellow' | 'green' | null>(null)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // ✅ SIMULA SALVAMENTO (sem Supabase por enquanto)
  const saveMetrics = (gameData: any) => {
    console.log('✅ Métricas que seriam salvas:', {
      section: currentSection,
      score: gameData.score,
      user_id: userProfile?.id || 'guest'
    })
  }

  const handleLightClick = (color: 'red' | 'yellow' | 'green') => {
    if (!isPlaying) return
    
    setCurrentLight(color)
    
    // Lógica simples de pontuação
    if (color === 'green') {
      setScore(prev => prev + 10)
    }
    
    // Simula salvamento com contexto
    saveMetrics({
      score: score + 10,
      interactions: 1,
      accuracy: 100
    })
  }

  const startGame = () => {
    setIsPlaying(true)
    setScore(0)
    setCurrentLight(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      {/* ✅ HEADER COM CONTEXTO */}
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">🚦 Semáforo - {currentSection}</h1>
            <div className="text-sm text-gray-600">
              Score: {score}
            </div>
          </div>
          
          {/* ✅ INDICADOR DE CONTEXTO */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <p className="text-sm text-blue-700">
              <strong>Contexto:</strong> {currentSection} | 
              <strong> Volta:</strong> {backUrl}
            </p>
          </div>
        </div>

        {/* ✅ JOGO DO SEMÁFORO */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="bg-gray-800 rounded-lg p-4 inline-block">
              {/* Luz Vermelha */}
              <div 
                className={`w-16 h-16 rounded-full mb-2 cursor-pointer transition-all ${
                  currentLight === 'red' ? 'bg-red-500 shadow-red-500/50 shadow-lg' : 'bg-gray-600'
                }`}
                onClick={() => handleLightClick('red')}
              />
              
              {/* Luz Amarela */}
              <div 
                className={`w-16 h-16 rounded-full mb-2 cursor-pointer transition-all ${
                  currentLight === 'yellow' ? 'bg-yellow-500 shadow-yellow-500/50 shadow-lg' : 'bg-gray-600'
                }`}
                onClick={() => handleLightClick('yellow')}
              />
              
              {/* Luz Verde */}
              <div 
                className={`w-16 h-16 rounded-full cursor-pointer transition-all ${
                  currentLight === 'green' ? 'bg-green-500 shadow-green-500/50 shadow-lg' : 'bg-gray-600'
                }`}
                onClick={() => handleLightClick('green')}
              />
            </div>
          </div>

          {/* ✅ CONTROLES */}
          <div className="text-center space-y-4">
            {!isPlaying ? (
              <button
                onClick={startGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Iniciar Jogo
              </button>
            ) : (
              <p className="text-gray-600">Clique nas luzes do semáforo!</p>
            )}
            
            {/* ✅ BOTÃO VOLTAR COM CONTEXT */}
            <button
              onClick={() => window.location.href = backUrl}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ← Voltar para {currentSection}
            </button>
          </div>
        </div>

        {/* ✅ DEBUG INFO */}
        <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
          <p className="text-xs text-green-700">
            🧪 <strong>TESTE:</strong> Context Provider funcionando | 
            Console mostra métricas com seção: {currentSection}
          </p>
        </div>
      </div>
    </div>
  )
}

// ✅ PÁGINA PRINCIPAL COM PROVIDER
export default function TesteSemaforoPage() {
  return (
    <AppProvider 
      section="TEA" 
      userProfile={{ id: 1, nome: 'Usuário Teste' }}
    >
      <SemaforoGameComponent />
    </AppProvider>
  )
}
