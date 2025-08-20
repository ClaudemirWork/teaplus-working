'use client'

import React, { useState, useEffect, useRef } from 'react'
// IMPORT CORRIGIDO: Adicionado ChevronLeft
import { Play, Pause, RotateCcw, Award, Target, Clock, Brain, CheckCircle, Save, BrainCircuit, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient'

// Componente do Cabeçalho Padrão
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }) => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
                {/* 1. Botão Voltar (Esquerda) */}
                <Link
                    href="/dashboard"
                    className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                </Link>

                {/* 2. Título Centralizado (Meio) */}
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                    {icon}
                    <span>{title}</span>
                </h1>

                {/* 3. Botão de Ação ou Espaçador (Direita) */}
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
                    // Espaçador para manter o título centralizado
                    <div className="w-24"></div>
                )}
            </div>
        </div>
    </header>
);


const InhibitoryControlPage = () => {
    const router = useRouter();
    const supabase = createClient();

    const [gameState, setGameState] = useState<'intro' | 'instructions' | 'playing' | 'paused' | 'finished'>('intro')
    const [currentRound, setCurrentRound] = useState(0)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(60)
    const [currentStimulus, setCurrentStimulus] = useState<{ color: string, word: string, isCongruent: boolean } | null>(null)
    const [responses, setResponses] = useState<{correct: number, incorrect: number, missed: number}>({correct: 0, incorrect: 0, missed: 0})
    const [showStimulus, setShowStimulus] = useState(false)
    const [level, setLevel] = useState(1)
    const [salvando, setSalvando] = useState(false);
    
    const stimulusTimerRef = useRef<NodeJS.Timeout | null>(null)
    const gameTimerRef = useRef<NodeJS.Timeout | null>(null)

    const colors = ['VERMELHO', 'AZUL', 'VERDE', 'AMARELO']
    const colorClasses = {
        'VERMELHO': 'text-red-500',
        'AZUL': 'text-blue-500', 
        'VERDE': 'text-green-500',
        'AMARELO': 'text-yellow-500'
    }

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            gameTimerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (timeLeft === 0 && gameState === 'playing') {
            finishGame()
        }

        return () => {
            if (gameTimerRef.current) clearTimeout(gameTimerRef.current)
        }
    }, [timeLeft, gameState])

    const generateStimulus = () => {
        const colorWord = colors[Math.floor(Math.random() * colors.length)]
        const displayColor = colors[Math.floor(Math.random() * colors.length)]
        const isCongruent = Math.random() > 0.5
        
        return {
            word: colorWord,
            color: isCongruent ? colorWord : displayColor,
            isCongruent
        }
    }

    const startRound = () => {
        if (gameState !== 'playing') return;
        const stimulus = generateStimulus()
        setCurrentStimulus(stimulus)
        setShowStimulus(true)
        setCurrentRound(prev => prev + 1)

        const delay = Math.max(1500 - (level * 100), 800)
        stimulusTimerRef.current = setTimeout(() => {
            setShowStimulus(false)
            setResponses(prev => ({ ...prev, missed: prev.missed + 1 }))
            setTimeout(() => startRound(), 500)
        }, delay)
    }

    const handleResponse = (selectedColor: string) => {
        if (!currentStimulus || !showStimulus) return

        if (stimulusTimerRef.current) {
            clearTimeout(stimulusTimerRef.current)
        }

        const isCorrect = selectedColor === currentStimulus.color

        if (isCorrect) {
            setScore(prev => prev + 10 + (level * 5))
            setResponses(prev => ({ ...prev, correct: prev.correct + 1 }))
            
            if (responses.correct > 0 && (responses.correct + 1) % 10 === 0) {
                setLevel(prev => Math.min(prev + 1, 5)) // Limita ao nível 5
            }
        } else {
            setResponses(prev => ({ ...prev, incorrect: prev.incorrect + 1 }))
        }

        setShowStimulus(false)
        setTimeout(() => startRound(), 800)
    }

    const startGame = () => {
        setGameState('playing')
        setTimeLeft(60)
        setCurrentRound(0)
        setScore(0)
        setResponses({correct: 0, incorrect: 0, missed: 0})
        setLevel(1)
        startRound()
    }

    const pauseGame = () => {
        setGameState('paused')
        if (stimulusTimerRef.current) clearTimeout(stimulusTimerRef.current)
        if (gameTimerRef.current) clearTimeout(gameTimerRef.current)
    }

    const resumeGame = () => {
        setGameState('playing')
    }

    const finishGame = () => {
        setGameState('finished')
        if (stimulusTimerRef.current) clearTimeout(stimulusTimerRef.current)
        if (gameTimerRef.current) clearTimeout(gameTimerRef.current)
    }

    const resetGame = () => {
        setGameState('instructions') // Volta para as instruções ao invés do início
        setCurrentRound(0)
        setScore(0)
        setResponses({correct: 0, incorrect: 0, missed: 0})
        setCurrentStimulus(null)
        setShowStimulus(false)
        setLevel(1)
    }
    
    // FUNÇÃO DE SALVAMENTO - ADICIONADA E PADRONIZADA
    const handleSaveSession = async () => {
        if (currentRound === 0) {
            alert('Complete pelo menos uma rodada antes de salvar.');
            return;
        }

        setSalvando(true);
        
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                console.error('Erro ao obter usuário:', userError);
                alert('Erro: Sessão expirada. Por favor, faça login novamente.');
                router.push('/login');
                return;
            }
            
            const { data, error } = await supabase
                .from('sessoes')
                .insert([{
                    usuario_id: user.id,
                    atividade_nome: 'Controle Inibitório',
                    pontuacao_final: score,
                    data_fim: new Date().toISOString(),
                    // Opcional: pode-se salvar mais métricas em uma coluna 'metadata' JSON
                }]);

            if (error) {
                console.error('Erro ao salvar:', error);
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!
                
📊 Resumo:
• Pontuação Final: ${score}
• Precisão: ${accuracy}%
• Nível Alcançado: ${level}
• Respostas Corretas: ${responses.correct}
• Respostas Incorretas: ${responses.incorrect}`);
                
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error('Erro inesperado:', error);
            alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setSalvando(false);
        }
    };


    const accuracy = responses.correct + responses.incorrect > 0 
        ? Math.round((responses.correct / (responses.correct + responses.incorrect)) * 100)
        : 0

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header PADRONIZADO implementado */}
            <GameHeader 
                title="Controle Inibitório"
                icon={<BrainCircuit size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={gameState === 'finished'}
            />

            {/* HEADER ANTIGO REMOVIDO */}

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Intro */}
                {gameState === 'intro' && (
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl p-8 border border-gray-200">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                                    <Brain className="w-8 h-8 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Sobre este exercício</h2>
                                    <p className="text-gray-600">Teste de Stroop para controle inibitório</p>
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-red-500" />
                                        Objetivo
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Desenvolver controle inibitório através do famoso teste de Stroop, 
                                        onde você deve inibir a resposta automática de ler a palavra e focar na cor do texto.
                                    </p>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        Benefícios
                                    </h3>
                                    <ul className="text-gray-700 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            Fortalece controle inibitório
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            Melhora atenção seletiva
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            Desenvolve flexibilidade mental
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => setGameState('instructions')}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-colors"
                            >
                                Ver instruções
                            </button>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                {gameState === 'instructions' && (
                    <div className="space-y-8 bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">📋 Como jogar</h2>
                        
                        <div className="space-y-8">
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 Regra principal</h3>
                                <p className="text-blue-800 leading-relaxed">
                                    Palavras de cores aparecerão na tela. Você deve responder baseado na <strong>COR do texto</strong>, não na palavra escrita.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                    <h3 className="text-lg font-semibold text-green-800 mb-4">✅ Exemplo correto</h3>
                                    <div className="text-center mb-4">
                                        <span className="text-5xl font-bold text-blue-500">VERMELHO</span>
                                    </div>
                                    <p className="text-green-700 text-center">
                                        Resposta correta: <strong>AZUL</strong><br/>
                                        <span className="text-sm">(cor do texto, não a palavra)</span>
                                    </p>
                                </div>

                                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                                    <h3 className="text-lg font-semibold text-red-800 mb-4">❌ Erro comum</h3>
                                    <div className="text-center mb-4">
                                        <span className="text-5xl font-bold text-green-500">AZUL</span>
                                    </div>
                                    <p className="text-red-700 text-center">
                                        Resposta errada: AZUL<br/>
                                        Resposta certa: <strong>VERDE</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center pt-6">
                            <button
                                onClick={() => setGameState('intro')}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-medium transition-colors"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={startGame}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors flex items-center gap-2"
                            >
                                <Play className="w-5 h-5" />
                                Iniciar exercício
                            </button>
                        </div>
                    </div>
                )}

                {/* Game */}
                {(gameState === 'playing' || gameState === 'paused') && (
                    <div className="space-y-6 bg-white p-8 rounded-xl shadow-lg">

                         <div className="grid grid-cols-3 gap-4 text-center mb-4">
                             <div>
                                 <div className="text-sm font-medium text-gray-500">Tempo</div>
                                 <div className="text-2xl font-bold text-gray-900">{timeLeft}s</div>
                             </div>
                             <div>
                                 <div className="text-sm font-medium text-gray-500">Pontuação</div>
                                 <div className="text-2xl font-bold text-blue-600">{score}</div>
                             </div>
                             <div>
                                 <div className="text-sm font-medium text-gray-500">Nível</div>
                                 <div className="text-2xl font-bold text-purple-600">{level}</div>
                             </div>
                         </div>
                    
                        {gameState === 'paused' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                                <div className="text-lg font-semibold text-yellow-800 mb-4">⏸️ Jogo pausado</div>
                                <button
                                    onClick={resumeGame}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                                >
                                    Continuar
                                </button>
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center min-h-[250px] flex items-center justify-center">
                            {showStimulus && currentStimulus && gameState === 'playing' ? (
                                <div className="space-y-4">
                                    <div className={`text-7xl sm:text-8xl font-bold ${colorClasses[currentStimulus.color as keyof typeof colorClasses]}`}>
                                        {currentStimulus.word}
                                    </div>
                                    <div className="text-base text-gray-600 font-medium">
                                        Qual é a COR desta palavra?
                                    </div>
                                </div>
                            ) : gameState === 'playing' ? (
                                <div className="text-gray-500 text-xl">Prepare-se...</div>
                            ) : null}
                        </div>

                        {showStimulus && gameState === 'playing' ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                <button
                                    onClick={() => handleResponse('VERMELHO')}
                                    className="bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold transition-colors text-center"
                                >VERMELHO</button>
                                <button
                                    onClick={() => handleResponse('AZUL')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition-colors text-center"
                                >AZUL</button>
                                <button
                                    onClick={() => handleResponse('VERDE')}
                                    className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold transition-colors text-center"
                                >VERDE</button>
                                <button
                                    onClick={() => handleResponse('AMARELO')}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 py-4 rounded-xl font-semibold transition-colors text-center"
                                >AMARELO</button>
                            </div>
                        ) : <div className="min-h-[72px]"></div> }


                        <div className="flex justify-center gap-4 pt-4">
                            {gameState === 'playing' && (
                                <button
                                    onClick={pauseGame}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center gap-2"
                                >
                                    <Pause className="w-4 h-4" />
                                    Pausar
                                </button>
                            )}
                            <button
                                onClick={finishGame}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Finalizar
                            </button>
                        </div>
                    </div>
                )}

                {/* Finished */}
                {gameState === 'finished' && (
                    <div className="space-y-8 bg-white p-8 rounded-xl shadow-lg">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Award className="w-10 h-10 text-green-600" />
                            </div>
                            
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Exercício concluído!</h2>
                            <p className="text-gray-600 mb-8">Parabéns! Você completou o teste de controle inibitório.</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-2xl mx-auto">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">{score}</div>
                                    <div className="text-sm font-medium text-gray-600">Pontuação</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="text-3xl font-bold text-green-600 mb-2">{accuracy}%</div>
                                    <div className="text-sm font-medium text-gray-600">Precisão</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">{level}</div>
                                    <div className="text-sm font-medium text-gray-600">Nível</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="text-3xl font-bold text-orange-600 mb-2">{currentRound}</div>
                                    <div className="text-sm font-medium text-gray-600">Rodadas</div>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={resetGame}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors"
                                >
                                    Jogar novamente
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default InhibitoryControlPage
