'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Configuração Supabase com verificação
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas')
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

interface AudioExercise {
  id: number
  title: string
  instruction: string
  audioDescription: string
  speaker: string
  speakerEmotion: string
  message: string
  questions: {
    id: number
    question: string
    options: string[]
    correct: number
    explanation: string
  }[]
  listeningSkill: string
  complexity: 'simple' | 'complex' | 'inferential' // Para métricas CELF-5
}

interface Level {
  id: number
  name: string
  description: string
  exercises: AudioExercise[]
  pointsRequired: number
}

export default function ActiveListening() {
  const router = useRouter()
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [completedLevels, setCompletedLevels] = useState<number[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [sessionStartTime] = useState(Date.now())
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  // Métricas baseadas em CELF-5, TILLS e ADOS-2
  const [metrics, setMetrics] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    simpleComprehension: 0, // Compreensão de instruções simples
    complexComprehension: 0, // Compreensão de contexto complexo
    inferentialComprehension: 0, // Compreensão inferencial/sarcasmo
    audioRepeats: 0, // Solicitações de repetição (atenção sustentada)
    responseTime: [] as number[], // Tempo de resposta para cada questão
    listenerFeedback: 0, // Vezes que ouviu o áudio completo
  })

  const questionStartTime = useRef<number>(Date.now())

  // Inicializar vozes do navegador e verificar sessões pendentes
  useEffect(() => {
    // Verificar autenticação ao carregar o componente
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('Usuário não autenticado ao carregar a página')
        console.log('Recomenda-se fazer login para salvar o progresso')
        setIsAuthenticated(false)
      } else {
        console.log('Usuário autenticado:', user.email)
        setIsAuthenticated(true)
        
        // Verificar se há sessões locais para sincronizar
        const localSessions = JSON.parse(localStorage.getItem('tea_sessions_temp') || '[]')
        if (localSessions.length > 0) {
          console.log(`Encontradas ${localSessions.length} sessões locais para sincronizar`)
          
          for (const session of localSessions) {
            try {
              await supabase
                .from('sessoes')
                .insert([{ ...session, usuario_id: user.id }])
              
              console.log('Sessão local sincronizada com sucesso')
            } catch (error) {
              console.error('Erro ao sincronizar sessão local:', error)
            }
          }
          
          // Limpar sessões locais após sincronização
          localStorage.removeItem('tea_sessions_temp')
        }
      }
    }
    
    checkAuth()
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          console.log('Vozes disponíveis:', voices.filter(v => v.lang.includes('pt')))
        }
      }
      
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const levels: Level[] = [
    {
      id: 1,
      name: "Escuta Básica",
      description: "Compreender mensagens simples e identificar informações principais",
      pointsRequired: 30,
      exercises: [
        {
          id: 1,
          title: "Apresentação Pessoal",
          instruction: "Ouça atentamente a apresentação e responda as perguntas",
          audioDescription: "Ana se apresenta de forma amigável",
          speaker: "Ana",
          speakerEmotion: "😊",
          message: "Oi! Meu nome é Ana, tenho 16 anos e estudo no Colégio Santos. Moro aqui em São Paulo com minha família. Gosto muito de ler livros e tocar violão nas horas livres.",
          listeningSkill: "Identificação de informações pessoais",
          complexity: 'simple',
          questions: [
            {
              id: 1,
              question: "Qual é o nome da pessoa que se apresentou?",
              options: ["Maria", "Ana", "Clara", "Sofia"],
              correct: 1,
              explanation: "A pessoa disse claramente: 'Meu nome é Ana'."
            },
            {
              id: 2,
              question: "Quantos anos Ana tem?",
              options: ["15 anos", "16 anos", "17 anos", "18 anos"],
              correct: 1,
              explanation: "Ana disse: 'tenho 16 anos'."
            },
            {
              id: 3,
              question: "Quais são os hobbies de Ana?",
              options: ["Ler e tocar violão", "Desenhar e cantar", "Dançar e nadar", "Cozinhar e correr"],
              correct: 0,
              explanation: "Ana mencionou: 'Gosto muito de ler livros e tocar violão nas horas livres'."
            }
          ]
        },
        {
          id: 2,
          title: "Instruções Escolares",
          instruction: "Escute as instruções do professor e identifique o que foi solicitado",
          audioDescription: "Professor dando instruções para próxima aula",
          speaker: "Professor",
          speakerEmotion: "📚",
          message: "Pessoal, para a próxima aula vocês precisam trazer o livro de matemática, uma calculadora e fazer os exercícios da página 45. A prova será na sexta-feira.",
          listeningSkill: "Compreensão de instruções",
          complexity: 'complex',
          questions: [
            {
              id: 1,
              question: "O que os alunos devem trazer para a próxima aula?",
              options: ["Livro e lápis", "Livro e calculadora", "Caderno e régua", "Apenas o livro"],
              correct: 1,
              explanation: "O professor disse: 'precisam trazer o livro de matemática, uma calculadora'."
            },
            {
              id: 2,
              question: "Qual tarefa de casa foi solicitada?",
              options: ["Página 40", "Página 45", "Página 50", "Página 35"],
              correct: 1,
              explanation: "Foi mencionado: 'fazer os exercícios da página 45'."
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Escuta Interpretativa",
      description: "Compreender significados implícitos e intenções nas mensagens",
      pointsRequired: 40,
      exercises: [
        {
          id: 3,
          title: "Detectando Sarcasmo",
          instruction: "Identifique o verdadeiro significado da mensagem",
          audioDescription: "Pessoa usando tom irônico ao olhar pela janela em dia chuvoso",
          speaker: "Carlos",
          speakerEmotion: "😏",
          message: "Nossa, que dia lindo para um piquenique! Está chovendo tanto que mal consigo ver a rua.",
          listeningSkill: "Interpretação de sarcasmo e ironia",
          complexity: 'inferential',
          questions: [
            {
              id: 1,
              question: "Qual é o verdadeiro significado da frase?",
              options: [
                "A pessoa realmente acha o dia bom", 
                "A pessoa está sendo sarcástica sobre o mau tempo", 
                "A pessoa está feliz", 
                "A pessoa quer fazer piquenique"
              ],
              correct: 1,
              explanation: "O tom irônico e a menção à chuva indicam sarcasmo sobre o mau tempo."
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Escuta Empática",
      description: "Identificar emoções e necessidades emocionais nas mensagens",
      pointsRequired: 50,
      exercises: [
        {
          id: 4,
          title: "Detectando Tristeza",
          instruction: "Identifique as emoções por trás das palavras",
          audioDescription: "Estudante com tom baixo e hesitante",
          speaker: "João",
          speakerEmotion: "😔",
          message: "Ah, tudo bem... a prova foi normal, eu acho... não sei... talvez eu devesse ter estudado mais...",
          listeningSkill: "Reconhecimento de estados emocionais",
          complexity: 'inferential',
          questions: [
            {
              id: 1,
              question: "Como a pessoa realmente se sente?",
              options: ["Muito feliz", "Confiante", "Preocupada/triste", "Indiferente"],
              correct: 2,
              explanation: "O tom baixo, hesitação e incerteza indicam preocupação ou tristeza."
            }
          ]
        }
      ]
    }
  ]

  const currentLevelData = levels.find(level => level.id === currentLevel)
  const currentExerciseData = currentLevelData?.exercises[currentExercise]
  const currentQuestionData = currentExerciseData?.questions[currentQuestion]

  const simulateAudioPlay = () => {
    if (!currentExerciseData) return
    
    setIsListening(true)
    
    // Incrementar métrica de listener feedback
    setMetrics(prev => ({
      ...prev,
      listenerFeedback: prev.listenerFeedback + 1
    }))
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(currentExerciseData.message)
      
      const voices = window.speechSynthesis.getVoices()
      const ptBrVoice = voices.find(voice => 
        voice.lang.includes('pt-BR') || voice.lang.includes('pt')
      )
      
      if (ptBrVoice) {
        utterance.voice = ptBrVoice
      }
      
      utterance.rate = 1.0
      utterance.pitch = 1.0
      
      utterance.onend = () => {
        setIsListening(false)
      }
      
      utterance.onerror = () => {
        setIsListening(false)
      }
      
      window.speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => {
        setIsListening(false)
      }, 3000)
    }
  }

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsListening(false)
  }

  const repeatAudio = () => {
    // Registrar repetição (métrica de atenção)
    setMetrics(prev => ({
      ...prev,
      audioRepeats: prev.audioRepeats + 1
    }))
    simulateAudioPlay()
  }

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    // Calcular tempo de resposta
    const responseTime = Date.now() - questionStartTime.current
    
    setSelectedAnswer(answerIndex)
    setShowResult(true)

    const isCorrect = answerIndex === currentQuestionData?.correct

    // Atualizar métricas
    setMetrics(prev => {
      const newMetrics = {
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        responseTime: [...prev.responseTime, responseTime]
      }

      if (isCorrect) {
        newMetrics.correctAnswers = prev.correctAnswers + 1
        
        // Categorizar por tipo de compreensão
        if (currentExerciseData?.complexity === 'simple') {
          newMetrics.simpleComprehension = prev.simpleComprehension + 1
        } else if (currentExerciseData?.complexity === 'complex') {
          newMetrics.complexComprehension = prev.complexComprehension + 1
        } else if (currentExerciseData?.complexity === 'inferential') {
          newMetrics.inferentialComprehension = prev.inferentialComprehension + 1
        }
      }

      return newMetrics
    })

    if (isCorrect) {
      const points = 10
      setScore(score + points)
      setTotalScore(totalScore + points)
    }

    setTimeout(() => {
      setShowExplanation(true)
    }, 1500)
  }

  const nextQuestion = () => {
    stopAudio()
    
    // Resetar tempo para próxima questão
    questionStartTime.current = Date.now()
    
    if (!currentExerciseData || !currentQuestionData) return

    if (currentQuestion < currentExerciseData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      if (currentExercise < (currentLevelData?.exercises.length || 0) - 1) {
        setCurrentExercise(currentExercise + 1)
        setCurrentQuestion(0)
      } else {
        if (score >= (currentLevelData?.pointsRequired || 0)) {
          setCompletedLevels([...completedLevels, currentLevel])
          
          if (currentLevel < levels.length) {
            setCurrentLevel(currentLevel + 1)
            setCurrentExercise(0)
            setCurrentQuestion(0)
            setScore(0)
          } else {
            setGameCompleted(true)
          }
        } else {
          setCurrentExercise(0)
          setCurrentQuestion(0)
          setScore(0)
        }
      }
    }

    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
  }

  const resetGame = () => {
    stopAudio()
    setCurrentLevel(1)
    setCurrentExercise(0)
    setCurrentQuestion(0)
    setScore(0)
    setTotalScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setCompletedLevels([])
    setGameCompleted(false)
    setIsListening(false)
    setMetrics({
      totalQuestions: 0,
      correctAnswers: 0,
      simpleComprehension: 0,
      complexComprehension: 0,
      inferentialComprehension: 0,
      audioRepeats: 0,
      responseTime: [],
      listenerFeedback: 0,
    })
  }

  const saveSession = async () => {
    try {
      console.log('Iniciando salvamento da sessão...')
      
      // Verificar se há dados para salvar
      if (metrics.totalQuestions === 0) {
        alert('Você precisa responder pelo menos uma questão antes de salvar.')
        return
      }
      
      const sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000)
      const avgResponseTime = metrics.responseTime.length > 0 
        ? Math.floor(metrics.responseTime.reduce((a, b) => a + b, 0) / metrics.responseTime.length / 1000)
        : 0

      const sessionData = {
        tipo_atividade: 'escuta_ativa',
        pontuacao: totalScore,
        tempo_sessao: sessionTime,
        dados_sessao: {
          exercicios_completados: metrics.totalQuestions,
          respostas_corretas: metrics.correctAnswers,
          taxa_acerto: Math.round((metrics.correctAnswers / Math.max(metrics.totalQuestions, 1)) * 100),
          compreensao_simples: metrics.simpleComprehension,
          compreensao_complexa: metrics.complexComprehension,
          compreensao_inferencial: metrics.inferentialComprehension,
          repeticoes_audio: metrics.audioRepeats,
          tempo_resposta_medio: avgResponseTime,
          feedback_ouvinte: metrics.listenerFeedback,
          niveis_completados: completedLevels.length,
          metricas_celf5: {
            compreensao_auditiva: metrics.correctAnswers,
            processamento_linguagem: metrics.complexComprehension + metrics.inferentialComprehension
          },
          metricas_ados2: {
            resposta_comunicativa: metrics.listenerFeedback,
            atencao_sustentada: metrics.audioRepeats < 3 ? 'adequada' : 'necessita_suporte'
          }
        },
        created_at: new Date().toISOString()
      }
      
      // Verificar autenticação
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Erro de autenticação:', authError)
      }
      
      if (!user) {
        console.log('Usuário não autenticado - salvando localmente')
        
        // Salvar no localStorage temporariamente
        const localSessions = JSON.parse(localStorage.getItem('tea_sessions_temp') || '[]')
        localSessions.push(sessionData)
        localStorage.setItem('tea_sessions_temp', JSON.stringify(localSessions))
        
        // Mostrar resumo
        const resumo = `
⚠️ Sessão Salva Localmente (Faça login para salvar permanentemente)

📊 Métricas da Sessão:
• Exercícios Completados: ${metrics.totalQuestions}
• Taxa de Acerto: ${Math.round((metrics.correctAnswers / Math.max(metrics.totalQuestions, 1)) * 100)}%
• Tempo Total: ${Math.floor(sessionTime / 60)}min ${sessionTime % 60}s

Para salvar permanentemente, faça login e a sessão será sincronizada.
        `
        
        alert(resumo)
        
        // Perguntar se deseja fazer login
        if (confirm('Deseja fazer login agora para salvar permanentemente?')) {
          router.push('/login')
        } else {
          router.push('/tea')
        }
        return
      }

      console.log('Usuário autenticado:', user.id)
      
      // Adicionar usuario_id aos dados
      const sessionDataWithUser = {
        ...sessionData,
        usuario_id: user.id
      }

      console.log('Dados da sessão preparados:', sessionDataWithUser)

      const { data, error } = await supabase
        .from('sessoes')
        .insert([sessionDataWithUser])
        .select()

      if (error) {
        console.error('Erro ao salvar no Supabase:', error)
        
        // Se falhar, salvar localmente
        const localSessions = JSON.parse(localStorage.getItem('tea_sessions_temp') || '[]')
        localSessions.push(sessionData)
        localStorage.setItem('tea_sessions_temp', JSON.stringify(localSessions))
        
        alert('Erro ao salvar no servidor. Sessão salva localmente.')
        throw error
      }

      console.log('Sessão salva com sucesso:', data)

      // Limpar sessões locais se existirem
      localStorage.removeItem('tea_sessions_temp')

      // Mostrar resumo
      const resumo = `
✅ Sessão Salva com Sucesso!

📊 Métricas da Sessão:
• Exercícios Completados: ${metrics.totalQuestions}
• Taxa de Acerto: ${Math.round((metrics.correctAnswers / Math.max(metrics.totalQuestions, 1)) * 100)}%
• Tempo Total: ${Math.floor(sessionTime / 60)}min ${sessionTime % 60}s
• Compreensão Simples: ${metrics.simpleComprehension}
• Compreensão Complexa: ${metrics.complexComprehension}
• Compreensão Inferencial: ${metrics.inferentialComprehension}
• Repetições de Áudio: ${metrics.audioRepeats}
• Tempo de Resposta Médio: ${avgResponseTime}s

🎯 Métricas Científicas:
• CELF-5 (Compreensão Auditiva): ${metrics.correctAnswers}/${metrics.totalQuestions}
• ADOS-2 (Atenção): ${metrics.audioRepeats < 3 ? 'Adequada' : 'Necessita Suporte'}
• Listener Feedback: ${metrics.listenerFeedback} interações
      `
      
      alert(resumo)
      
      // Aguardar um pouco antes de redirecionar
      setTimeout(() => {
        router.push('/tea')
      }, 500)
      
    } catch (error) {
      console.error('Erro ao salvar sessão:', error)
      alert(`Erro ao salvar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
        {/* Header com Botão Finalizar */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/tea" 
                className="flex items-center text-teal-600 hover:text-teal-700 transition-colors min-h-[44px] px-2 -ml-2"
              >
                <span className="text-xl mr-2">←</span>
                <span className="text-sm sm:text-base font-medium">Voltar</span>
              </Link>
              
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                👂 Escuta Ativa
                {isAuthenticated === false && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Não logado
                  </span>
                )}
              </h1>
              
              <button
                onClick={saveSession}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                💾 Salvar
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="max-w-2xl text-center">
              <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl">
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-3xl sm:text-4xl">
                    🏆
                  </div>
                  <h1 className="mb-4 text-2xl sm:text-4xl font-bold text-gray-900">
                    Parabéns! Atividade Concluída!
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600">
                    Você dominou a arte da escuta ativa!
                  </p>
                </div>

                <div className="mb-8 space-y-4">
                  <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6">
                    <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">Pontuação Final</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{totalScore} pontos</p>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6">
                    <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">Taxa de Acerto</h3>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                      {Math.round((metrics.correctAnswers / Math.max(metrics.totalQuestions, 1)) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={saveSession}
                    className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:from-green-600 hover:to-green-700 hover:shadow-lg"
                  >
                    💾 Salvar Sessão
                  </button>
                  <button
                    onClick={resetGame}
                    className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:from-teal-600 hover:to-blue-700 hover:shadow-lg"
                  >
                    🔄 Jogar Novamente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      {/* Header com Botão Finalizar Sempre Visível */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/tea" 
              className="flex items-center text-teal-600 hover:text-teal-700 transition-colors min-h-[44px] px-2 -ml-2"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-sm sm:text-base font-medium">Voltar</span>
            </Link>
            
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              👂 Escuta Ativa
              {isAuthenticated === false && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Não logado
                </span>
              )}
            </h1>
            
            <button
              onClick={saveSession}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              💾 Salvar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Cards de Instrução - Layout Padronizado */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white p-4 shadow-lg border-l-4 border-red-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">🎯</span>
              <h3 className="text-base sm:text-lg font-semibold text-red-600">Objetivo:</h3>
            </div>
            <p className="text-sm text-gray-700">
              Desenvolver compreensão auditiva, processamento de linguagem e identificação de sinais emocionais na fala
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-lg border-l-4 border-blue-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">🎮</span>
              <h3 className="text-base sm:text-lg font-semibold text-blue-600">Como se Joga:</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Clique no ▶️ para ouvir</li>
              <li>• Escolha a resposta correta</li>
              <li>• Repita se necessário 🔁</li>
            </ul>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-lg border-l-4 border-purple-500">
            <div className="mb-3 flex items-center">
              <span className="mr-2 text-xl sm:text-2xl">📊</span>
              <h3 className="text-base sm:text-lg font-semibold text-purple-600">Níveis:</h3>
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <div className={completedLevels.includes(1) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                Nível 1: Escuta básica
              </div>
              <div className={completedLevels.includes(2) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                Nível 2: Interpretativa
              </div>
              <div className={completedLevels.includes(3) ? 'text-green-600 font-semibold' : 'text-gray-700'}>
                Nível 3: Empática
              </div>
            </div>
          </div>
        </div>

        {/* Progresso da Sessão - 4 Métricas */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Progresso da Sessão</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((metrics.correctAnswers / Math.max(metrics.totalQuestions, 1)) * 100)}%
              </div>
              <div className="text-xs text-gray-600">Taxa de Acerto</div>
            </div>
            <div className="bg-green-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics.totalQuestions}
              </div>
              <div className="text-xs text-gray-600">Questões Respondidas</div>
            </div>
            <div className="bg-purple-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.audioRepeats}
              </div>
              <div className="text-xs text-gray-600">Repetições de Áudio</div>
            </div>
            <div className="bg-orange-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {completedLevels.length}/3
              </div>
              <div className="text-xs text-gray-600">Níveis Completos</div>
            </div>
          </div>
        </div>

        {/* Área Principal do Jogo */}
        <div className="rounded-xl bg-white p-4 sm:p-8 shadow-xl">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="mb-2 sm:mb-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Nível {currentLevel}: {currentLevelData?.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">{currentLevelData?.description}</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-gray-500">Pontos do Nível</div>
                <div className="text-lg sm:text-xl font-bold text-purple-600">
                  {score}/{currentLevelData?.pointsRequired}
                </div>
              </div>
            </div>
            
            <div className="mt-4 h-2 sm:h-3 rounded-full bg-gray-200">
              <div 
                className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500"
                style={{ 
                  width: `${Math.min((score / (currentLevelData?.pointsRequired || 1)) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>

          {currentExerciseData && currentQuestionData && (
            <div className="mb-6">
              <div className="mb-6 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 p-4 sm:p-6">
                <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">{currentExerciseData.title}</h3>
                <p className="mb-4 text-sm sm:text-base text-gray-700">{currentExerciseData.instruction}</p>
                <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs sm:text-sm font-medium text-teal-600">
                  Habilidade: {currentExerciseData.listeningSkill}
                </div>
              </div>

              <div className="mb-6 rounded-xl bg-gray-50 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-blue-500 text-xl sm:text-2xl text-white mr-3 flex-shrink-0">
                      {currentExerciseData.speakerEmotion}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">{currentExerciseData.speaker}</div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {isListening ? 'Reproduzindo áudio...' : 'Clique para ouvir a mensagem'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center sm:justify-end">
                    <button
                      onClick={simulateAudioPlay}
                      disabled={isListening}
                      className={`rounded-full p-2 sm:p-3 transition-all min-h-[44px] min-w-[44px] touch-manipulation ${
                        isListening 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white'
                      }`}
                      title="Reproduzir áudio"
                    >
                      {isListening ? '🔊' : '▶️'}
                    </button>
                    <button
                      onClick={repeatAudio}
                      disabled={isListening}
                      className="rounded-full p-2 sm:p-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white transition-all min-h-[44px] min-w-[44px] touch-manipulation"
                      title="Repetir áudio"
                    >
                      🔁
                    </button>
                    {isListening && (
                      <button
                        onClick={stopAudio}
                        className="rounded-full p-2 sm:p-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white transition-all min-h-[44px] min-w-[44px] touch-manipulation"
                        title="Parar áudio"
                      >
                        ⏹️
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="rounded-lg bg-white p-3 sm:p-4 border border-gray-200">
                  <div className="text-gray-600 text-xs sm:text-sm mb-2">Mensagem de {currentExerciseData.speaker}:</div>
                  <div className="text-gray-800 font-medium text-sm sm:text-base">"{currentExerciseData.message}"</div>
                  <div className="text-gray-500 text-xs mt-2">
                    💡 Contexto: {currentExerciseData.audioDescription}
                  </div>
                </div>
                
                {isListening && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-teal-100 text-teal-800 rounded-lg text-sm">
                      <div className="animate-pulse mr-2">🎧</div>
                      Reproduzindo áudio... (Escute com atenção!)
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h4 className="mb-4 text-base sm:text-lg font-semibold text-gray-900">
                  Pergunta {currentQuestion + 1}: {currentQuestionData.question}
                </h4>

                <div className="space-y-3">
                  {currentQuestionData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full rounded-xl p-3 sm:p-4 text-left transition-all min-h-[48px] touch-manipulation ${
                        selectedAnswer === null
                          ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-lg active:bg-gray-200'
                          : selectedAnswer === index
                          ? index === currentQuestionData.correct
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : 'bg-red-100 text-red-800 border-2 border-red-300'
                          : index === currentQuestionData.correct
                          ? 'bg-green-100 text-green-800 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              {showResult && (
                <div className={`mb-4 rounded-xl p-4 ${
                  selectedAnswer === currentQuestionData.correct
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedAnswer === currentQuestionData.correct ? (
                    <div className="flex items-center">
                      <span className="mr-2 text-xl sm:text-2xl">✅</span>
                      <span className="text-base sm:text-lg font-semibold">Excelente escuta! +10 pontos</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2 text-xl sm:text-2xl">👂</span>
                      <span className="text-base sm:text-lg font-semibold">Boa tentativa! Vamos aprimorar a escuta.</span>
                    </div>
                  )}
                </div>
              )}

              {showExplanation && (
                <div className="mb-6 rounded-xl bg-blue-50 p-4 sm:p-6">
                  <h4 className="mb-2 text-sm sm:text-base font-semibold text-blue-900">💡 Dica de Escuta:</h4>
                  <p className="text-sm sm:text-base text-blue-800">{currentQuestionData.explanation}</p>
                </div>
              )}

              {showExplanation && (
                <div className="text-center">
                  <button
                    onClick={nextQuestion}
                    className="rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:from-teal-600 hover:to-blue-700 hover:shadow-lg min-h-[48px] touch-manipulation"
                  >
                    {currentQuestion < (currentExerciseData?.questions.length || 0) - 1 
                      ? 'Próxima Pergunta'
                      : currentExercise < (currentLevelData?.exercises.length || 0) - 1
                      ? 'Próximo Exercício'
                      : score >= (currentLevelData?.pointsRequired || 0)
                      ? currentLevel < levels.length ? 'Próximo Nível' : 'Finalizar'
                      : 'Tentar Nível Novamente'
                    }
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Indicadores de Progresso */}
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: currentLevelData?.exercises.length || 0 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full ${
                  idx < currentExercise 
                    ? 'bg-green-500'
                    : idx === currentExercise
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="mt-4 text-center text-xs sm:text-sm text-gray-500">
            Exercício {currentExercise + 1} de {currentLevelData?.exercises.length} • 
            Pergunta {currentQuestion + 1} • 
            Nível {currentLevel} de {levels.length}
          </div>
        </div>
      </div>
    </div>
  )
}
