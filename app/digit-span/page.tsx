'use client'

import { useState } from 'react'
import { ArrowLeft, Play, Brain, Trophy, RotateCcw, CheckCircle, XCircle, Save, Hash, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient'
import Link from 'next/link'; // LINHA ADICIONADA

// Componente do Cabeçalho Padrão
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }) => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
                <Link
                    href="/dashboard"
                    className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                </Link>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </h1>
                {showSaveButton && onSave ? (
                    <button
                        onClick={onSave}
                        disabled={isSaveDisabled}
                        className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${
                            !isSaveDisabled
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <Save size={18} />
                        <span className="hidden sm:inline">{isSaveDisabled ? 'Salvando...' : 'Salvar'}</span>
                    </button>
                ) : (
                    <div className="w-24"></div>
                )}
            </div>
        </div>
    </header>
);

export default function SpanDigitos() {
    const router = useRouter()
    const supabase = createClient()

    const [showActivity, setShowActivity] = useState(false)
    const [currentLevel, setCurrentLevel] = useState(1)
    const [score, setScore] = useState(0)
    const [sequence, setSequence] = useState<number[]>([])
    const [userInput, setUserInput] = useState<string[]>([])
    const [gamePhase, setGamePhase] = useState<'ready' | 'showing' | 'input' | 'feedback'>('ready')
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)
    const [attempts, setAttempts] = useState(0)
    const [isGameFinished, setIsGameFinished] = useState(false)
    const [salvando, setSalvando] = useState(false)

    const levelConfig = {
        1: { length: 3, time: 2500, target: 50 },
        2: { length: 4, time: 3000, target: 50 },
        3: { length: 5, time: 3500, target: 50 }
    }

    const generateSequence = (level: number) => {
        const config = levelConfig[level as keyof typeof levelConfig]
        const newSequence = Array.from({ length: config.length }, () => Math.floor(Math.random() * 10))
        setSequence(newSequence)
        setUserInput(Array(config.length).fill(''))
    }

    const startRound = () => {
        generateSequence(currentLevel)
        setGamePhase('showing')
        setFeedback(null)
        setTimeout(() => {
            setGamePhase('input')
        }, levelConfig[currentLevel as keyof typeof levelConfig].time)
    }

    const handleInputChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newInput = [...userInput]
            newInput[index] = value
            setUserInput(newInput)
        }
    }

    const checkAnswer = () => {
        const reversedSequence = [...sequence].reverse()
        const isCorrect = userInput.every((digit, index) => digit === reversedSequence[index].toString())
        setAttempts(prev => prev + 1)

        if (isCorrect) {
            setScore(prev => prev + 10)
            setFeedback({ correct: true, message: "Excelente! Sequência inversa correta!" })
        } else {
            const correctSequence = reversedSequence.join(' ')
            setFeedback({ correct: false, message: `Incorreto. A sequência inversa era: ${correctSequence}` })
        }
        setGamePhase('feedback')
    }

    const nextRound = () => {
        if (score >= 50) {
            if (currentLevel < 3) {
                const newLevel = currentLevel + 1;
                setCurrentLevel(newLevel);
                setScore(0);
                generateSequence(newLevel);
            } else {
                setIsGameFinished(true);
            }
        }
        setGamePhase('ready');
    }

    const resetActivity = () => {
        setCurrentLevel(1)
        setScore(0)
        setAttempts(0)
        setGamePhase('ready')
        setFeedback(null)
        setIsGameFinished(false)
        setShowActivity(false)
    }

    const handleSaveSession = async () => {
        if (!isGameFinished) return;
        setSalvando(true);
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                alert('Sessão expirada. Faça login novamente.');
                router.push('/login');
                return;
            }
            const { error } = await supabase.from('sessoes').insert([{
                usuario_id: user.id,
                atividade_nome: 'Span de Dígitos',
                pontuacao_final: score + ((currentLevel - 1) * 50),
                data_fim: new Date().toISOString(),
                observacoes: { nivel_final: currentLevel, tentativas_total: attempts }
            }]);

            if (error) {
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert('Sessão salva com sucesso!');
                router.push('/dashboard');
            }
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Span de Dígitos"
                icon={<Hash size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={isGameFinished}
            />
            <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
                {!showActivity ? (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-400">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">🎯 Objetivo</h2>
                            <p className="text-gray-700">Fortalecer a memória de trabalho, exigindo não apenas memorização, mas o controle executivo para reverter sequências mentalmente.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Níveis</h2>
                            <div className="space-y-3">
                                <p><strong className="text-blue-600">Nível 1:</strong> 3 dígitos na ordem inversa.</p>
                                <p><strong className="text-blue-600">Nível 2:</strong> 4 dígitos na ordem inversa.</p>
                                <p><strong className="text-blue-600">Nível 3:</strong> 5 dígitos na ordem inversa.</p>
                            </div>
                        </div>
                        <div className="text-center pt-6">
                            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto" onClick={() => setShowActivity(true)}>
                                <Play className="w-5 h-5" />
                                Começar Atividade
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm font-medium text-gray-500">Nível</h3><p className="text-2xl font-bold text-blue-600">{currentLevel}</p></div>
                            <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm font-medium text-gray-500">Pontuação</h3><p className="text-2xl font-bold text-green-600">{score}/{levelConfig[currentLevel as keyof typeof levelConfig].target}</p></div>
                            <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm font-medium text-gray-500">Tentativas</h3><p className="text-2xl font-bold text-purple-600">{attempts}</p></div>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            {isGameFinished ? (
                                <div className="text-center">
                                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-gray-800">Parabéns!</h2>
                                    <p className="text-gray-600 mt-2">Você completou todos os níveis com sucesso.</p>
                                    <button onClick={resetActivity} className="mt-6 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center gap-2 mx-auto"><RotateCcw className="w-5 h-5" />Reiniciar</button>
                                </div>
                            ) : gamePhase === 'ready' ? (
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold mb-4">Nível {currentLevel}: Memorize a sequência e digite na ordem INVERSA.</h2>
                                    <button onClick={startRound} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-shadow"><Play className="w-5 h-5" />Iniciar Rodada</button>
                                </div>
                            ) : gamePhase === 'showing' ? (
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold mb-6">Memorize:</h2>
                                    <div className="flex justify-center gap-4">
                                        {sequence.map((digit, index) => <div key={index} className="w-16 h-16 bg-blue-500 text-white rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg">{digit}</div>)}
                                    </div>
                                </div>
                            ) : gamePhase === 'input' ? (
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold mb-6">Digite a sequência na ordem INVERSA:</h2>
                                    <div className="flex justify-center gap-2 sm:gap-4 mb-6">
                                        {userInput.map((digit, index) => <input key={index} type="text" value={digit} onChange={(e) => handleInputChange(index, e.target.value)} className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none" maxLength={1} />)}
                                    </div>
                                    <button onClick={checkAnswer} disabled={userInput.some(d => d === '')} className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow">Verificar</button>
                                </div>
                            ) : gamePhase === 'feedback' && feedback && (
                                <div className="text-center">
                                    <div className={`flex items-center justify-center gap-3 mb-4 text-2xl font-bold ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                                        {feedback.correct ? <CheckCircle /> : <XCircle />}
                                        <h2>{feedback.message}</h2>
                                    </div>
                                    <button onClick={nextRound} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow">
                                        {score >= 50 ? (currentLevel < 3 ? 'Próximo Nível' : 'Finalizar') : 'Próxima Rodada'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
