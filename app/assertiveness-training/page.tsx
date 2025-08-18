'use client'

import { useState, useEffect } from 'react'

interface Scenario {
  id: number
  title: string
  context: string
  situation: string
  responses: {
    passive: string
    aggressive: string
    assertive: string
  }
  feedback: {
    passive: string
    aggressive: string
    assertive: string
  }
  tips: string[]
  category: 'dizer-nao' | 'expressar-opiniao' | 'pedir-ajuda' | 'estabelecer-limites' | 'receber-criticas'
  difficulty: 'iniciante' | 'intermediario' | 'avancado'
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Colega pedindo favor no trabalho",
    context: "Você está sobrecarregado com suas próprias tarefas",
    situation: "Um colega te pede para fazer parte do trabalho dele porque 'você é muito bom nisso'. Você já tem muito trabalho para fazer.",
    responses: {
      passive: "Tudo bem, eu faço. Não tem problema.",
      aggressive: "Você sempre empurra trabalho para os outros! Faça você mesmo!",
      assertive: "Entendo que você precisa de ajuda, mas no momento estou com muitas tarefas. Talvez possamos conversar com o supervisor sobre redistribuir as demandas."
    },
    feedback: {
      passive: "Resposta passiva: Você aceitou mais trabalho mesmo sobrecarregado. Isso pode levar ao esgotamento e ressentimento.",
      aggressive: "Resposta agressiva: Você atacou a pessoa, o que pode danificar o relacionamento profissional.",
      assertive: "Resposta assertiva: Você foi claro sobre seus limites e ofereceu uma solução construtiva. Perfeito!"
    },
    tips: [
      "Use 'eu' ao invés de 'você' para não soar acusativo",
      "Reconheça a necessidade da outra pessoa antes de estabelecer seus limites",
      "Ofereça alternativas quando possível"
    ],
    category: 'dizer-nao',
    difficulty: 'iniciante'
  },
  {
    id: 2,
    title: "Discordando em reunião de família",
    context: "Discussão sobre planos para as férias familiares",
    situation: "Sua família está decidindo o destino das férias. Todos querem praia, mas você prefere montanha. Sua opinião está sendo ignorada.",
    responses: {
      passive: "Tanto faz, vocês decidem. Praia está bom.",
      aggressive: "Vocês nunca me escutam! Sempre é o que vocês querem!",
      assertive: "Eu entendo que a maioria quer praia, mas gostaria que considerassem a montanha também. Posso explicar por que acho que seria uma boa opção para todos?"
    },
    feedback: {
      passive: "Resposta passiva: Você desistiu da sua opinião sem nem tentar expressá-la adequadamente.",
      aggressive: "Resposta agressiva: Você atacou a família, criando conflito desnecessário.",
      assertive: "Resposta assertiva: Você expressou sua opinião de forma respeitosa e pediu espaço para ser ouvido. Excelente!"
    },
    tips: [
      "Valide a opinião dos outros antes de expressar a sua",
      "Peça permissão para ser ouvido",
      "Ofereça explicações, não apenas exigências"
    ],
    category: 'expressar-opiniao',
    difficulty: 'intermediario'
  },
  {
    id: 3,
    title: "Pedindo ajuda no trabalho",
    context: "Você está com dificuldade em uma tarefa complexa",
    situation: "Você está lutando com um projeto há dias e não está conseguindo avançar. Precisa de ajuda, mas tem medo de parecer incompetente.",
    responses: {
      passive: "Vou continuar tentando sozinho. Talvez eu consiga descobrir.",
      aggressive: "Esse projeto é impossível! Ninguém conseguiria fazer isso!",
      assertive: "Estou enfrentando alguns desafios neste projeto e gostaria de conversar com alguém para ter uma segunda opinião. Você teria um tempo para me orientar?"
    },
    feedback: {
      passive: "Resposta passiva: Você pode perder prazos e se estressar desnecessariamente por não pedir ajuda.",
      aggressive: "Resposta agressiva: Você culpou o projeto ao invés de buscar soluções construtivas.",
      assertive: "Resposta assertiva: Você reconheceu suas limitações e pediu ajuda de forma profissional. Ótimo!"
    },
    tips: [
      "Pedir ajuda demonstra maturidade, não incompetência",
      "Seja específico sobre que tipo de ajuda você precisa",
      "Mostre que você já tentou algumas abordagens"
    ],
    category: 'pedir-ajuda',
    difficulty: 'intermediario'
  },
  {
    id: 4,
    title: "Estabelecendo limites com amigo",
    context: "Amigo que sempre chega atrasado",
    situation: "Seu amigo sempre chega 30-45 minutos atrasado nos encontros, fazendo você esperar. Hoje ele chegou 1 hora atrasado novamente.",
    responses: {
      passive: "Não tem problema, eu estava com tempo mesmo.",
      aggressive: "Você é um desrespeitoso! Sempre atrasa e não liga para o meu tempo!",
      assertive: "Eu valorizo nossa amizade, mas preciso falar sobre os atrasos. Quando você chega muito atrasado, eu me sinto desrespeitado. Podemos combinar horários mais realistas ou você pode me avisar se vai se atrasar?"
    },
    feedback: {
      passive: "Resposta passiva: Você não comunicou seu desconforto, e o comportamento provavelmente continuará.",
      aggressive: "Resposta agressiva: Você atacou o caráter da pessoa, o que pode prejudicar a amizade.",
      assertive: "Resposta assertiva: Você expressou seus sentimentos e propôs soluções. Comunicação perfeita!"
    },
    tips: [
      "Use 'quando você... eu me sinto...' para expressar o impacto",
      "Proponha soluções específicas",
      "Reafirme o valor do relacionamento"
    ],
    category: 'estabelecer-limites',
    difficulty: 'avancado'
  },
  {
    id: 5,
    title: "Recebendo crítica no trabalho",
    context: "Supervisor apontando erro em relatório",
    situation: "Seu supervisor disse que seu último relatório 'estava confuso e mal estruturado'. Você se sentiu atacado, mas sabe que pode haver pontos válidos.",
    responses: {
      passive: "Você está certo, eu sou péssimo com relatórios. Desculpa.",
      aggressive: "Meu relatório estava perfeito! Você que não entendeu!",
      assertive: "Obrigado pelo feedback. Posso entender melhor quais partes específicas ficaram confusas para eu melhorar nos próximos relatórios?"
    },
    feedback: {
      passive: "Resposta passiva: Você se diminuiu desnecessariamente ao invés de buscar aprender.",
      aggressive: "Resposta agressiva: Você rejeitou totalmente o feedback, perdendo a chance de crescer.",
      assertive: "Resposta assertiva: Você recebeu a crítica construtivamente e buscou informações específicas para melhorar. Excelente atitude!"
    },
    tips: [
      "Agradeça o feedback, mesmo que doa",
      "Peça exemplos específicos para entender melhor",
      "Foque no comportamento, não na sua identidade"
    ],
    category: 'receber-criticas',
    difficulty: 'avancado'
  },
  {
    id: 6,
    title: "Dizendo não para convite social",
    context: "Amigos convidando para festa, mas você quer descansar",
    situation: "Seus amigos te convidaram para uma festa no sábado, mas você está exausto da semana e precisa de um tempo para recarregar as energias.",
    responses: {
      passive: "Ah, tá bom... eu vou. Só vou ficar um pouquinho.",
      aggressive: "Vocês não entendem que eu tenho outras coisas para fazer? Não posso sair toda semana!",
      assertive: "Obrigado pelo convite! Eu realmente preciso de um tempo para descansar neste sábado, mas adoraria marcar algo na próxima semana. Que tal?"
    },
    feedback: {
      passive: "Resposta passiva: Você vai fazer algo que não quer, o que pode gerar ressentimento e cansaço.",
      aggressive: "Resposta agressiva: Você pode ter magoado seus amigos com a reação exagerada.",
      assertive: "Resposta assertiva: Você foi honesto sobre suas necessidades e ofereceu uma alternativa. Perfeito!"
    },
    tips: [
      "Agradeça o convite antes de declinar",
      "Seja honesto sobre suas necessidades",
      "Ofereça alternativas quando apropriado"
    ],
    category: 'dizer-nao',
    difficulty: 'iniciante'
  }
]

export default function AssertivenessTraining() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [selectedResponse, setSelectedResponse] = useState<'passive' | 'aggressive' | 'assertive' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState({ passive: 0, aggressive: 0, assertive: 0 })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState<'iniciante' | 'intermediario' | 'avancado'>('iniciante')
  const [showTips, setShowTips] = useState(false)

  const filteredScenarios = scenarios.filter(s => s.difficulty === currentDifficulty)

  const handleResponseSelect = (responseType: 'passive' | 'aggressive' | 'assertive') => {
    setSelectedResponse(responseType)
    setShowFeedback(true)
    setScore(prev => ({ ...prev, [responseType]: prev[responseType] + 1 }))
  }

  const nextScenario = () => {
    if (currentScenario < filteredScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
      setSelectedResponse(null)
      setShowFeedback(false)
      setShowTips(false)
    } else {
      setGameCompleted(true)
    }
  }

  const resetGame = () => {
    setCurrentScenario(0)
    setSelectedResponse(null)
    setShowFeedback(false)
    setScore({ passive: 0, aggressive: 0, assertive: 0 })
    setGameStarted(false)
    setGameCompleted(false)
    setShowTips(false)
  }

  const startGame = () => {
    setGameStarted(true)
  }

  const getScoreMessage = () => {
    const total = filteredScenarios.length
    const assertivePercentage = (score.assertive / total) * 100
    
    if (assertivePercentage >= 80) return "🏆 Excelente! Você domina a comunicação assertiva!"
    if (assertivePercentage >= 60) return "👏 Muito bom! Você está no caminho certo da assertividade!"
    if (assertivePercentage >= 40) return "📈 Bom progresso! Continue praticando a assertividade!"
    return "💪 Continue praticando! A assertividade se desenvolve com o tempo!"
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dizer-nao': return '🛑'
      case 'expressar-opiniao': return '💭'
      case 'pedir-ajuda': return '🤝'
      case 'estabelecer-limites': return '🚧'
      case 'receber-criticas': return '📝'
      default: return '💪'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'dizer-nao': return 'Dizer Não'
      case 'expressar-opiniao': return 'Expressar Opinião'
      case 'pedir-ajuda': return 'Pedir Ajuda'
      case 'estabelecer-limites': return 'Estabelecer Limites'
      case 'receber-criticas': return 'Receber Críticas'
      default: return 'Assertividade'
    }
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header com navegação */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => window.history.back()}
              className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              ← Voltar
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-xl md:text-2xl">
                💪
              </div>
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Treino de Assertividade
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  Desenvolva habilidades para <strong>defender opiniões, dizer não e expressar necessidades</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Módulo Info */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border-l-4 border-orange-500 mb-6">
            <h3 className="text-orange-700 mb-2 flex items-center gap-2 text-sm md:text-base font-semibold">
              ❤️ MÓDULO 3: REGULAÇÃO EMOCIONAL
            </h3>
            <p className="text-gray-600 text-xs md:text-sm">Base: Controle de Impulsos + Assertividade | Simulações de Situações Sociais</p>
          </div>

          {/* Objetivo */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
            <h3 className="mb-4 flex items-center gap-2 text-base md:text-lg font-semibold">
              🎯 Objetivo do Treino
            </h3>
            <p className="text-gray-800 mb-4 text-sm md:text-base leading-relaxed">
              A assertividade é a habilidade de expressar seus pensamentos, sentimentos e necessidades de forma 
              <strong> clara, honesta e respeitosa</strong>, sem ser passivo nem agressivo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="text-yellow-800 mb-2 text-sm md:text-base font-semibold">😔 Comunicação Passiva</h4>
                <p className="text-xs md:text-sm text-yellow-700">Evita conflitos, mas não expressa necessidades</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="text-red-800 mb-2 text-sm md:text-base font-semibold">😡 Comunicação Agressiva</h4>
                <p className="text-xs md:text-sm text-red-700">Expressa necessidades, mas desrespeita outros</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="text-green-800 mb-2 text-sm md:text-base font-semibold">💪 Comunicação Assertiva</h4>
                <p className="text-xs md:text-sm text-green-700">Expressa necessidades respeitando a todos</p>
              </div>
            </div>
          </div>

          {/* Categorias */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
            <h3 className="mb-4 flex items-center gap-2 text-base md:text-lg font-semibold">
              📚 Categorias de Treinamento
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['dizer-nao', 'expressar-opiniao', 'pedir-ajuda', 'estabelecer-limites', 'receber-criticas'].map((category) => (
                <div key={category} className="bg-gray-50 p-3 md:p-4 rounded-lg text-center">
                  <div className="text-2xl md:text-3xl mb-2">{getCategoryIcon(category)}</div>
                  <h4 className="text-gray-800 text-xs md:text-sm font-medium">{getCategoryName(category)}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Seletor de Dificuldade */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
            <h3 className="mb-4 text-base md:text-lg font-semibold">🎚️ Escolha o Nível</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { level: 'iniciante', desc: '2 situações básicas', color: 'green' },
                { level: 'intermediario', desc: '2 situações moderadas', color: 'yellow' },
                { level: 'avancado', desc: '2 situações complexas', color: 'red' }
              ].map(({ level, desc, color }) => (
                <button
                  key={level}
                  onClick={() => setCurrentDifficulty(level as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    currentDifficulty === level
                      ? color === 'green' ? 'bg-green-500 text-white border-green-500' :
                        color === 'yellow' ? 'bg-yellow-500 text-white border-yellow-500' :
                        'bg-red-500 text-white border-red-500'
                      : color === 'green' ? 'bg-white text-gray-800 border-green-500 hover:bg-green-50' :
                        color === 'yellow' ? 'bg-white text-gray-800 border-yellow-500 hover:bg-yellow-50' :
                        'bg-white text-gray-800 border-red-500 hover:bg-red-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-sm md:text-base capitalize">{level}</div>
                    <div className="text-xs md:text-sm opacity-75 mt-1">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Botão Iniciar */}
          <div className="text-center">
            <button 
              onClick={startGame} 
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              💪 Iniciar Treino de Assertividade
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header com navegação */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => window.history.back()}
              className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              ← Voltar
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-xl md:text-2xl">
                💪
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Treino Concluído!</h1>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-4xl md:text-6xl">🏆</span>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Resultado Final</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-xl md:text-2xl font-bold text-yellow-700">{score.passive}</div>
                <div className="text-xs md:text-sm text-yellow-600">Passivas</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-xl md:text-2xl font-bold text-red-700">{score.aggressive}</div>
                <div className="text-xs md:text-sm text-red-600">Agressivas</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-xl md:text-2xl font-bold text-green-700">{score.assertive}</div>
                <div className="text-xs md:text-sm text-green-600">Assertivas</div>
              </div>
            </div>

            <p className="text-base md:text-lg mb-6 text-gray-800">{getScoreMessage()}</p>
            
            <div className="bg-blue-50 p-4 md:p-6 rounded-lg border border-blue-200 mb-6">
              <h3 className="text-blue-800 mb-3 text-sm md:text-base font-semibold">💡 Lembre-se</h3>
              <p className="text-blue-800 text-xs md:text-sm leading-relaxed">
                A assertividade é uma habilidade que se desenvolve com a prática. Continue aplicando essas 
                técnicas no seu dia a dia e observe como seus relacionamentos e autoestima melhoram!
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={resetGame} 
                className="bg-white text-gray-800 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                🔄 Treinar Novamente
              </button>
              <button 
                onClick={() => window.history.back()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voltar ao Módulo
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const scenario = filteredScenarios[currentScenario]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header do Jogo */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.history.back()}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              ← Voltar
            </button>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-lg md:text-xl">
              💪
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-800">Treino de Assertividade</h1>
              <p className="text-sm text-gray-600">Situação {currentScenario + 1} de {filteredScenarios.length}</p>
            </div>
          </div>
          
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold flex items-center gap-1">
            {getCategoryIcon(scenario.category)} {getCategoryName(scenario.category)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div 
            className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentScenario + 1) / filteredScenarios.length) * 100}%` }}
          ></div>
        </div>

        {/* Cenário */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
          <h3 className="mb-2 text-gray-800 text-base md:text-lg font-semibold">{scenario.title}</h3>
          <p className="text-gray-600 text-sm mb-4">
            <strong>Contexto:</strong> {scenario.context}
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm md:text-base leading-relaxed text-gray-800">
              {scenario.situation}
            </p>
          </div>
        </div>

        {/* Opções de Resposta */}
        <div className="mb-8">
          <h3 className="text-base md:text-lg font-semibold mb-4">Como você responderia?</h3>
          
          <div className="space-y-3">
            {(['passive', 'aggressive', 'assertive'] as const).map((responseType) => (
              <button
                key={responseType}
                onClick={() => !showFeedback && handleResponseSelect(responseType)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedResponse === responseType
                    ? responseType === 'passive' ? 'border-yellow-500 bg-yellow-50' :
                      responseType === 'aggressive' ? 'border-red-500 bg-red-50' :
                      'border-green-500 bg-green-50'
                    : responseType === 'passive' ? 'border-yellow-200 bg-white hover:border-yellow-300' :
                      responseType === 'aggressive' ? 'border-red-200 bg-white hover:border-red-300' :
                      'border-green-200 bg-white hover:border-green-300'
                } ${!showFeedback ? 'hover:shadow-md' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    responseType === 'passive' ? 'bg-yellow-400 text-white' :
                    responseType === 'aggressive' ? 'bg-red-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {responseType === 'passive' ? '😔' : responseType === 'aggressive' ? '😡' : '💪'}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold mb-1 text-sm md:text-base ${
                      responseType === 'passive' ? 'text-yellow-800' :
                      responseType === 'aggressive' ? 'text-red-800' :
                      'text-green-800'
                    }`}>
                      {responseType === 'passive' ? 'Resposta Passiva' : 
                       responseType === 'aggressive' ? 'Resposta Agressiva' : 
                       'Resposta Assertiva'}
                    </div>
                    <div className="text-gray-800 text-sm md:text-base leading-relaxed">
                      "{scenario.responses[responseType]}"
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && selectedResponse && (
          <div className={`bg-white rounded-xl p-4 md:p-6 shadow-sm border-l-4 ${
            selectedResponse === 'assertive' ? 'border-green-500' :
            selectedResponse === 'aggressive' ? 'border-red-500' :
            'border-yellow-500'
          } mb-6`}>
            <h3 className={`mb-4 text-base md:text-lg font-semibold ${
              selectedResponse === 'assertive' ? 'text-green-800' :
              selectedResponse === 'aggressive' ? 'text-red-800' :
              'text-yellow-800'
            }`}>
              {selectedResponse === 'assertive' ? '🎉 Excelente escolha!' : 
               selectedResponse === 'aggressive' ? '⚠️ Vamos refletir sobre isso' : 
               '🤔 Vamos pensar em outra abordagem'}
            </h3>
            <p className="mb-4 leading-relaxed text-gray-800 text-sm md:text-base">
              {scenario.feedback[selectedResponse]}
            </p>

            {selectedResponse === 'assertive' && !showTips && (
              <button
                onClick={() => setShowTips(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors mb-4 text-sm md:text-base"
              >
                💡 Ver Dicas de Comunicação Assertiva
              </button>
            )}

            {showTips && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h4 className="text-blue-800 mb-3 text-sm md:text-base font-semibold">💡 Dicas para essa situação:</h4>
                <ul className="text-blue-800 space-y-1 text-xs md:text-sm leading-relaxed">
                  {scenario.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button 
              onClick={nextScenario} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base font-semibold"
            >
              {currentScenario < filteredScenarios.length - 1 ? 'Próxima Situação →' : 'Ver Resultado Final'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}