'use client'

import { useState, useEffect } from 'react'

interface ReflectionEntry {
  id: string
  date: string
  situation: string
  emotions: string[]
  thoughts: string
  impulse: string
  reflection: string
  betterAction: string
  completed: boolean
}

interface ReflectionPrompt {
  id: string
  question: string
  placeholder: string
  type: 'text' | 'textarea' | 'emotions' | 'scale'
  required: boolean
}

const emotionsList = [
  '😡 Raiva', '😢 Tristeza', '😰 Ansiedade', '😤 Frustração',
  '😕 Desapontamento', '😳 Vergonha', '😔 Culpa', '😖 Irritação',
  '🙄 Tédio', '😌 Calma', '😊 Alegria', '😃 Animação',
  '🤔 Confusão', '😮 Surpresa', '😌 Alívio', '💪 Determinação'
]

const reflectionPrompts: ReflectionPrompt[] = [
  {
    id: 'situation',
    question: '🎭 O que aconteceu? Descreva a situação que gerou uma reação emocional forte.',
    placeholder: 'Ex: Meu amigo cancelou nossos planos de última hora...',
    type: 'textarea',
    required: true
  },
  {
    id: 'emotions',
    question: '💭 Quais emoções você sentiu? (Selecione todas que se aplicam)',
    placeholder: '',
    type: 'emotions',
    required: true
  },
  {
    id: 'thoughts',
    question: '🧠 Que pensamentos passaram pela sua cabeça no momento?',
    placeholder: 'Ex: Ele não liga para mim, sempre faz isso...',
    type: 'textarea',
    required: true
  },
  {
    id: 'impulse',
    question: '⚡ Qual foi seu primeiro impulso? O que você queria fazer imediatamente?',
    placeholder: 'Ex: Mandar uma mensagem brava, parar de falar com ele...',
    type: 'textarea',
    required: true
  },
  {
    id: 'reflection',
    question: '🤔 Agora, parando para pensar: Existe outra forma de ver essa situação?',
    placeholder: 'Ex: Talvez ele tenha um motivo válido, posso não saber toda a história...',
    type: 'textarea',
    required: true
  },
  {
    id: 'betterAction',
    question: '✨ Que ação mais pensada você poderia ter tomado ou pode tomar agora?',
    placeholder: 'Ex: Perguntar se está tudo bem, propor reagendar...',
    type: 'textarea',
    required: true
  }
]

export default function ReflectionDiary() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [entries, setEntries] = useState<ReflectionEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState<Partial<ReflectionEntry>>({
    emotions: []
  })

  useEffect(() => {
    // Simular carregamento de entradas salvas
    const savedEntries = [
      {
        id: '1',
        date: '2025-07-08',
        situation: 'Meu colega de trabalho levou crédito por uma ideia minha na reunião.',
        emotions: ['😡 Raiva', '😤 Frustração', '😳 Vergonha'],
        thoughts: 'Ele fez isso de propósito, quer me prejudicar. Nunca vou conseguir crescer aqui.',
        impulse: 'Queria interromper a reunião e falar que a ideia era minha.',
        reflection: 'Talvez ele não tenha percebido que estava tomando crédito. Ou pode ter sido nervosismo.',
        betterAction: 'Conversar com ele depois da reunião de forma privada e educada.',
        completed: true
      }
    ]
    setEntries(savedEntries)
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setCurrentEntry(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEmotionToggle = (emotion: string) => {
    const currentEmotions = currentEntry.emotions || []
    const newEmotions = currentEmotions.includes(emotion)
      ? currentEmotions.filter(e => e !== emotion)
      : [...currentEmotions, emotion]
    
    handleInputChange('emotions', newEmotions)
  }

  const nextStep = () => {
    if (currentStep < reflectionPrompts.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeEntry()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeEntry = () => {
    const newEntry: ReflectionEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      situation: currentEntry.situation || '',
      emotions: currentEntry.emotions || [],
      thoughts: currentEntry.thoughts || '',
      impulse: currentEntry.impulse || '',
      reflection: currentEntry.reflection || '',
      betterAction: currentEntry.betterAction || '',
      completed: true
    }

    setEntries(prev => [newEntry, ...prev])
    setCurrentEntry({ emotions: [] })
    setCurrentStep(0)
  }

  const startNewEntry = () => {
    setCurrentEntry({ emotions: [] })
    setCurrentStep(0)
    setShowHistory(false)
  }

  const currentPrompt = reflectionPrompts[currentStep]
  const isStepComplete = () => {
    const field = currentPrompt.id
    const value = currentEntry[field as keyof typeof currentEntry]
    
    if (field === 'emotions') {
      return Array.isArray(value) && value.length > 0
    }
    return value && value.toString().trim().length > 0
  }

  if (showHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-yellow-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header com navegação */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()}
                className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                ← Voltar para TEA
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xl md:text-2xl">
                  📔
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">Histórico de Reflexões</h1>
                  <p className="text-sm md:text-base text-gray-600">Suas jornadas de autoconhecimento</p>
                </div>
              </div>
            </div>
            <button 
              onClick={startNewEntry}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              ✏️ Nova Reflexão
            </button>
          </div>

          {/* Entradas */}
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-gray-800 text-lg font-semibold">
                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-600 text-xs md:text-sm font-semibold mb-2 uppercase tracking-wide">Situação:</h4>
                    <p className="text-gray-800 text-sm md:text-base leading-relaxed">{entry.situation}</p>
                  </div>

                  <div>
                    <h4 className="text-gray-600 text-xs md:text-sm font-semibold mb-2 uppercase tracking-wide">Emoções:</h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.emotions.map((emotion, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs md:text-sm">
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-gray-600 text-xs md:text-sm font-semibold mb-2 uppercase tracking-wide">Reflexão:</h4>
                    <p className="text-gray-800 text-sm md:text-base leading-relaxed">{entry.reflection}</p>
                  </div>

                  <div>
                    <h4 className="text-gray-600 text-xs md:text-sm font-semibold mb-2 uppercase tracking-wide">Ação Melhor:</h4>
                    <p className="text-green-700 text-sm md:text-base leading-relaxed font-medium">{entry.betterAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {entries.length === 0 && (
            <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-200 text-center">
              <div className="text-4xl md:text-6xl mb-4">📝</div>
              <h3 className="text-gray-600 text-lg md:text-xl mb-2">Nenhuma reflexão ainda</h3>
              <p className="text-gray-500 mb-6">Comece sua primeira jornada de autoconhecimento!</p>
              <button 
                onClick={startNewEntry} 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Primeira Reflexão
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-yellow-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header com navegação */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => window.history.back()}
            className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            ← Voltar para TEA
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xl md:text-2xl">
              📔
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Diário de Reflexão Guiada
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Desenvolva o <strong>autocontrole</strong> através da reflexão estruturada
              </p>
            </div>
          </div>
        </div>

        {/* Módulo Info */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border-l-4 border-purple-500 mb-6">
          <h3 className="text-purple-700 mb-2 flex items-center gap-2 text-sm md:text-base font-semibold">
            ❤️ MÓDULO 3: REGULAÇÃO EMOCIONAL
          </h3>
          <p className="text-gray-600 text-xs md:text-sm">Base: Controle de Impulsos + Assertividade | Baseado em CBT for ADHD/ASD</p>
        </div>

        {/* Objetivo */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
          <h3 className="mb-4 flex items-center gap-2 text-base md:text-lg font-semibold">
            🎯 Objetivo da Técnica
          </h3>
          <p className="text-gray-800 mb-4 text-sm md:text-base leading-relaxed">
            A técnica CBT (Terapia Cognitivo-Comportamental) ajuda pessoas com TDAH/TEA a <strong>pausar e refletir</strong> 
            antes de reagir impulsivamente, desenvolvendo maior autorregulação emocional.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-gray-800 mb-3 text-sm md:text-base font-semibold">Como funciona:</h4>
            <ul className="text-gray-700 space-y-1 text-xs md:text-sm leading-relaxed">
              <li><strong>Situação:</strong> Identifique o gatilho emocional</li>
              <li><strong>Emoções:</strong> Reconheça o que está sentindo</li>
              <li><strong>Pensamentos:</strong> Observe seus pensamentos automáticos</li>
              <li><strong>Impulso:</strong> Note sua primeira reação</li>
              <li><strong>Reflexão:</strong> Questione e reframe seus pensamentos</li>
              <li><strong>Ação:</strong> Escolha uma resposta mais equilibrada</li>
            </ul>
          </div>
        </div>

        {/* Controles de Navegação */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <button 
            onClick={() => setShowHistory(true)}
            className="w-full md:w-auto bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            📚 Ver Histórico
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">
              Passo {currentStep + 1} de {reflectionPrompts.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div 
            className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / reflectionPrompts.length) * 100}%` }}
          ></div>
        </div>

        {/* Formulário de Reflexão */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
          <h3 className="mb-4 text-gray-800 text-base md:text-lg leading-relaxed">
            {currentPrompt.question}
          </h3>

          {currentPrompt.type === 'emotions' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {emotionsList.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => handleEmotionToggle(emotion)}
                  className={`p-3 rounded-lg border-2 transition-all text-xs md:text-sm text-center ${
                    (currentEntry.emotions || []).includes(emotion)
                      ? 'border-purple-500 bg-purple-50 text-purple-800'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={currentEntry[currentPrompt.id as keyof typeof currentEntry] || ''}
              onChange={(e) => handleInputChange(currentPrompt.id, e.target.value)}
              placeholder={currentPrompt.placeholder}
              className="w-full min-h-[120px] p-3 border-2 border-gray-200 rounded-lg text-sm md:text-base leading-relaxed resize-none focus:border-purple-500 focus:outline-none transition-colors"
            />
          )}

          {/* Navegação */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`w-full md:w-auto px-6 py-3 rounded-lg border transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              ← Anterior
            </button>

            <button
              onClick={nextStep}
              disabled={!isStepComplete()}
              className={`w-full md:w-auto px-6 py-3 rounded-lg transition-colors ${
                isStepComplete()
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === reflectionPrompts.length - 1 ? 'Finalizar Reflexão' : 'Próximo →'}
            </button>
          </div>
        </div>

        {/* Dica */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-800 mb-2 text-sm font-semibold">💡 Dica:</h4>
          <p className="text-blue-800 text-xs md:text-sm leading-relaxed">
            Seja honesto(a) consigo mesmo(a). Não existe resposta certa ou errada. O objetivo é desenvolver 
            autoconsciência sobre seus padrões emocionais e de pensamento.
          </p>
        </div>
      </div>
    </div>
  )
}