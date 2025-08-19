'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

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
        tips: ["Use 'eu' ao invés de 'você'", "Reconheça a necessidade da outra pessoa", "Ofereça alternativas"],
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
            assertive: "Eu entendo que a maioria quer praia, mas gostaria que considerassem a montanha também. Posso explicar por que acho que seria uma boa opção?"
        },
        feedback: {
            passive: "Resposta passiva: Você desistiu da sua opinião sem nem tentar expressá-la.",
            aggressive: "Resposta agressiva: Você atacou a família, criando conflito.",
            assertive: "Resposta assertiva: Você expressou sua opinião de forma respeitosa e pediu espaço para ser ouvido. Excelente!"
        },
        tips: ["Valide a opinião dos outros", "Peça permissão para ser ouvido", "Ofereça explicações"],
        category: 'expressar-opiniao',
        difficulty: 'intermediario'
    },
    {
        id: 3,
        title: "Pedindo ajuda no trabalho",
        context: "Você está com dificuldade em uma tarefa complexa",
        situation: "Você está lutando com um projeto há dias e não está conseguindo avançar. Precisa de ajuda, mas tem medo de parecer incompetente.",
        responses: {
            passive: "Vou continuar tentando sozinho. Talvez eu consiga.",
            aggressive: "Esse projeto é impossível! Ninguém conseguiria fazer isso!",
            assertive: "Estou enfrentando alguns desafios neste projeto e gostaria de uma segunda opinião. Você teria um tempo para me orientar?"
        },
        feedback: {
            passive: "Resposta passiva: Você pode perder prazos e se estressar por não pedir ajuda.",
            aggressive: "Resposta agressiva: Você culpou o projeto ao invés de buscar soluções.",
            assertive: "Resposta assertiva: Você reconheceu suas limitações e pediu ajuda de forma profissional. Ótimo!"
        },
        tips: ["Pedir ajuda demonstra maturidade", "Seja específico sobre a ajuda que precisa", "Mostre o que você já tentou"],
        category: 'pedir-ajuda',
        difficulty: 'intermediario'
    },
    {
        id: 4,
        title: "Estabelecendo limites com amigo",
        context: "Amigo que sempre chega atrasado",
        situation: "Seu amigo sempre chega 30-45 minutos atrasado nos encontros. Hoje ele chegou 1 hora atrasado novamente.",
        responses: {
            passive: "Não tem problema, eu estava com tempo mesmo.",
            aggressive: "Você é um desrespeitoso! Sempre atrasa!",
            assertive: "Eu valorizo nossa amizade, mas preciso falar sobre os atrasos. Quando você chega muito atrasado, eu me sinto desrespeitado. Podemos combinar horários mais realistas?"
        },
        feedback: {
            passive: "Resposta passiva: Você não comunicou seu desconforto, e o comportamento provavelmente continuará.",
            aggressive: "Resposta agressiva: Você atacou o caráter da pessoa, o que pode prejudicar a amizade.",
            assertive: "Resposta assertiva: Você expressou seus sentimentos e propôs soluções. Perfeito!"
        },
        tips: ["Use 'quando você... eu me sinto...'", "Proponha soluções específicas", "Reafirme o valor do relacionamento"],
        category: 'estabelecer-limites',
        difficulty: 'avancado'
    },
    {
        id: 5,
        title: "Recebendo crítica no trabalho",
        context: "Supervisor apontando erro em relatório",
        situation: "Seu supervisor disse que seu último relatório 'estava confuso e mal estruturado'.",
        responses: {
            passive: "Você está certo, eu sou péssimo com relatórios. Desculpa.",
            aggressive: "Meu relatório estava perfeito! Você que não entendeu!",
            assertive: "Obrigado pelo feedback. Pode me mostrar quais partes específicas ficaram confusas para eu melhorar nos próximos?"
        },
        feedback: {
            passive: "Resposta passiva: Você se diminuiu ao invés de buscar aprender.",
            aggressive: "Resposta agressiva: Você rejeitou o feedback, perdendo a chance de crescer.",
            assertive: "Resposta assertiva: Você recebeu a crítica construtivamente e buscou informações para melhorar. Excelente!"
        },
        tips: ["Agradeça o feedback", "Peça exemplos específicos", "Foque no comportamento, não em você"],
        category: 'receber-criticas',
        difficulty: 'avancado'
    }
];

export default function AssertivenessTraining() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [selectedResponse, setSelectedResponse] = useState<'passive' | 'aggressive' | 'assertive' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState({ passive: 0, aggressive: 0, assertive: 0 })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState<'iniciante' | 'intermediario' | 'avancado'>('iniciante')
  
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
  }

  const startGame = (difficulty: 'iniciante' | 'intermediario' | 'avancado') => {
    setCurrentDifficulty(difficulty);
    setCurrentScenario(0); // Reset scenario index for the selected difficulty
    setScore({ passive: 0, aggressive: 0, assertive: 0 }); // Reset score
    setGameCompleted(false);
    setShowFeedback(false);
    setSelectedResponse(null);
    setGameStarted(true);
  }

  const getScoreMessage = () => {
    const total = filteredScenarios.length
    if (total === 0) return "Continue praticando!";
    const assertivePercentage = (score.assertive / total) * 100
    
    if (assertivePercentage >= 80) return "🏆 Excelente! Você domina a comunicação assertiva!"
    if (assertivePercentage >= 50) return "👏 Muito bom! Você está no caminho certo!"
    return "💪 Continue praticando! A assertividade se desenvolve com o tempo!"
  }

  const scenario = filteredScenarios[currentScenario]

  const GameHeader = () => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
                <Link 
                    href="/dashboard" 
                    className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                </Link>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                    💪 Treino de Assertividade
                </h1>
                <div className="w-24"></div>
            </div>
        </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <GameHeader />
      <main className="max-w-4xl mx-auto p-6">
        {!gameStarted ? (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-center mb-6">Como ser Assertivo?</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-center">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800">😔 Passivo</h4>
                <p className="text-sm text-yellow-700">Evita conflitos, mas não expressa necessidades.</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800">😡 Agressivo</h4>
                <p className="text-sm text-red-700">Expressa necessidades, mas desrespeita outros.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">💪 Assertivo</h4>
                <p className="text-sm text-green-700">Expressa necessidades com respeito.</p>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Escolha um nível para começar</h3>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button onClick={() => startGame('iniciante')} className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600">Iniciante</button>
              <button onClick={() => startGame('intermediario')} className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600">Intermediário</button>
              <button onClick={() => startGame('avancado')} className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600">Avançado</button>
            </div>
          </div>
        ) : gameCompleted ? (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <h2 className="text-2xl font-bold mb-4">Resultado Final ({currentDifficulty})</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 p-4 rounded-lg"><div className="text-2xl font-bold text-yellow-700">{score.passive}</div><div className="text-sm">Passivas</div></div>
                <div className="bg-red-50 p-4 rounded-lg"><div className="text-2xl font-bold text-red-700">{score.aggressive}</div><div className="text-sm">Agressivas</div></div>
                <div className="bg-green-50 p-4 rounded-lg"><div className="text-2xl font-bold text-green-700">{score.assertive}</div><div className="text-sm">Assertivas</div></div>
            </div>
            <p className="text-lg mb-6">{getScoreMessage()}</p>
            <button onClick={resetGame} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Voltar ao Início
            </button>
          </div>
        ) : (
          <div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: `${((currentScenario + 1) / filteredScenarios.length) * 100}%` }} />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-2">{scenario.title}</h3>
              <p className="text-sm text-gray-600 mb-4"><strong>Contexto:</strong> {scenario.context}</p>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p>{scenario.situation}</p>
              </div>
            </div>
            <div className="space-y-3">
              {(['passive', 'aggressive', 'assertive'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => !showFeedback && handleResponseSelect(type)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${selectedResponse === type ? 'bg-blue-50 border-blue-500' : 'hover:border-gray-300'}`}
                >
                    <p>"{scenario.responses[type]}"</p>
                </button>
              ))}
            </div>
            {showFeedback && selectedResponse && (
                <div className={`mt-6 p-6 rounded-lg border-l-4 ${selectedResponse === 'assertive' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                    <h3 className="font-semibold mb-2">{selectedResponse === 'assertive' ? '🎉 Excelente escolha!' : '🤔 Vamos refletir'}</h3>
                    <p>{scenario.feedback[selectedResponse]}</p>
                    <button onClick={nextScenario} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        {currentScenario < filteredScenarios.length - 1 ? 'Próxima Situação →' : 'Ver Resultado'}
                    </button>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
