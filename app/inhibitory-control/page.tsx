'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Award, Save, BrainCircuit, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient' // Ajuste o caminho se necessário

// --- COMPONENTE DO CABEÇALHO PADRÃO ---
// Reintegrado diretamente no arquivo para garantir sua exibição.
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }: {
    onSave?: () => void;
    isSaveDisabled?: boolean;
    title: string;
    icon: React.ReactNode;
    showSaveButton?: boolean;
}) => (
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
                    <div className="w-24"></div> // Espaçador para manter o título centralizado
                )}
            </div>
        </div>
    </header>
);


// --- PÁGINA DA ATIVIDADE ---
const InhibitoryControlPage = () => {
    const router = useRouter();
    const supabase = createClient();

    const [gameState, setGameState] = useState<'initial' | 'playing' | 'paused' | 'finished'>('initial')
    const [currentRound, setCurrentRound] = useState(0)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(90)
    const [currentStimulus, setCurrentStimulus] = useState<{ color: string, word: string, isCongruent: boolean } | null>(null)
    const [responses, setResponses] = useState<{ correct: number, incorrect: number, missed: number }>({ correct: 0, incorrect: 0, missed: 0 })
    const [showStimulus, setShowStimulus] = useState(false)
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(1);
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

    const niveis = [
        { id: 1, nome: "Nível 1", dificuldade: "Iniciante", duracao: 1.5, icone: "🚦" },
        { id: 2, nome: "Nível 2", dificuldade: "Fácil", duracao: 1.5, icone: "🚗" },
        { id: 3, nome: "Nível 3", dificuldade: "Médio", duracao: 2, icone: "✈️" },
        { id: 4, nome: "Nível 4", dificuldade: "Difícil", duracao: 2, icone: "🚀" },
        { id: 5, nome: "Nível 5", dificuldade: "Expert", duracao: 2.5, icone: "🌟" }
    ];

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

    useEffect(() => {
        if (gameState === 'playing') {
            startRound();
        }
    }, [gameState]);

    const handleNivelSelect = (nivel: any) => {
        setNivelSelecionado(nivel.id);
        setTimeLeft(nivel.duracao * 60);
    };

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
        if (gameState !== 'playing' || timeLeft === 0) return;

        const stimulus = generateStimulus()
        setCurrentStimulus(stimulus)
        setShowStimulus(true)
        setCurrentRound(prev => prev + 1)

        const delay = Math.max(2000 - (nivelSelecionado! * 150), 800)
        stimulusTimerRef.current = setTimeout(() => {
            if (stimulusTimerRef.current) {
                setShowStimulus(false)
                setResponses(prev => ({ ...prev, missed: prev.missed + 1 }))
                setTimeout(() => startRound(), 500)
            }
        }, delay)
    }

    const handleResponse = (selectedColor: string) => {
        if (!currentStimulus || !showStimulus) return

        if (stimulusTimerRef.current) {
            clearTimeout(stimulusTimerRef.current)
            stimulusTimerRef.current = null;
        }

        const isCorrect = selectedColor === currentStimulus.color

        if (isCorrect) {
            setScore(prev => prev + 10 + (nivelSelecionado! * 5))
            setResponses(prev => ({ ...prev, correct: prev.correct + 1 }))
        } else {
            setScore(prev => Math.max(0, prev - 5));
            setResponses(prev => ({ ...prev, incorrect: prev.incorrect + 1 }))
        }

        setShowStimulus(false)
        setTimeout(() => startRound(), 500)
    }

    const startGame = () => {
        if (nivelSelecionado === null) {
            alert("Por favor, selecione um nível para começar.");
            return;
        }
        setCurrentRound(0)
        setScore(0)
        setResponses({ correct: 0, incorrect: 0, missed: 0 })
        setGameState('playing')
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
        setGameState('initial')
        setCurrentRound(0)
        setScore(0)
        setResponses({ correct: 0, incorrect: 0, missed: 0 })
        setCurrentStimulus(null)
        setShowStimulus(false)
        setNivelSelecionado(1);
        setTimeLeft(90);
    }

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
            const { error } = await supabase
                .from('sessoes')
                .insert([{
                    usuario_id: user.id,
                    atividade_nome: 'Controle Inibitório',
                    pontuacao_final: score,
                    data_fim: new Date().toISOString(),
                    nivel_final: nivelSelecionado,
                    detalhes: {
                        precisao: accuracy,
                        respostas_corretas: responses.correct,
                        respostas_incorretas: responses.incorrect,
                        respostas_perdidas: responses.missed,
                        rodadas_totais: currentRound,
                    }
                }]);

            if (error) {
                console.error('Erro ao salvar:', error);
                alert(`Erro ao salvar: ${error.message}`);
            } else {
                alert(`Sessão salva com sucesso!`);
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
            {/* O GameHeader agora é renderizado aqui, garantindo que apareça em todas as telas */}
            <GameHeader 
                title="Controle Inibitório"
                icon={<BrainCircuit size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={gameState === 'finished'}
            />

            {gameState === 'initial' && (
                <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                    <div className="space-y-6">
                        {/* Bloco 1: Cards Informativos */}
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🎯 Objetivo:</h3>
                                    <p className="text-sm text-gray-600">
                                        Desenvolver controle inibitório, inibindo a resposta automática de ler a palavra para focar na cor do texto.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Palavras de cores aparecerão na tela.</li>
                                        <li>Clique no botão que corresponde à <strong>cor da tinta</strong> da palavra.</li>
                                        <li>Ignore o que a palavra diz. Seja rápido e preciso!</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                        Sua pontuação é baseada na velocidade e precisão. Acertos aumentam a pontuação, enquanto erros a diminuem.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bloco 2: Seleção de Nível */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {niveis.map((nivel) => (
                                    <button
                                        key={nivel.id}
                                        onClick={() => handleNivelSelect(nivel)}
                                        className={`p-4 rounded-lg font-medium transition-colors ${nivelSelecionado === nivel.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{nivel.icone}</div>
                                        <div className="text-sm">{nivel.nome}</div>
                                        <div className="text-xs opacity-80">{`${nivel.dificuldade} (${nivel.duracao}min)`}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bloco 3: Botão Iniciar */}
                        <div className="text-center pt-4">
                            <button
                                onClick={startGame}
                                disabled={nivelSelecionado === null}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                🚀 Iniciar Atividade
                            </button>
                        </div>
                    </div>
                </main>
            )}

            {(gameState === 'playing' || gameState === 'paused') && (
                <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
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
                                      <div className="text-2xl font-bold text-purple-600">{nivelSelecionado}</div>
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
                                      <button onClick={() => handleResponse('VERMELHO')} className="bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold transition-colors text-center">VERMELHO</button>
                                      <button onClick={() => handleResponse('AZUL')} className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition-colors text-center">AZUL</button>
                                      <button onClick={() => handleResponse('VERDE')} className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold transition-colors text-center">VERDE</button>
                                      <button onClick={() => handleResponse('AMARELO')} className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 py-4 rounded-xl font-semibold transition-colors text-center">AMARELO</button>
                                  </div>
                              ) : <div className="min-h-[72px]"></div> }
                              <div className="flex justify-center gap-4 pt-4">
                                  {gameState === 'playing' && (
                                      <button onClick={pauseGame} className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center gap-2">
                                          <Pause className="w-4 h-4" />
                                          Pausar
                                      </button>
                                  )}
                                  <button onClick={finishGame} className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center gap-2">
                                      <RotateCcw className="w-4 h-4" />
                                      Finalizar
                                  </button>
                              </div>
                          </div>
                </main>
            )}
            
            {gameState === 'finished' && (
                <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
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
                                    <div className="text-3xl font-bold text-purple-600 mb-2">{nivelSelecionado}</div>
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
                </main>
            )}
        </div>
    )
}

export default InhibitoryControlPage;
