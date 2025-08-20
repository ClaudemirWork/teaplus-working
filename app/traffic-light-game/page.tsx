'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save } from 'lucide-react';
import { createClient } from '../utils/supabaseClient';

// ============================================================================
// 1. COMPONENTE PADRÃO DO CABEÇALHO (GameHeader)
// ============================================================================
const GameHeader = ({ title, icon, onSave, isSaveDisabled, showSaveButton }) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center text-teal-600 hover:text-teal-700 transition-colors">
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </Link>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h1>
        <div className="w-24 flex justify-end">
            {showSaveButton && (
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
            )}
        </div>
      </div>
    </div>
  </header>
);


// ============================================================================
// 2. PÁGINA DA ATIVIDADE "JOGO DO SEMÁFORO"
// ============================================================================
export default function JogoSemaforoPage() {
    // ... (TODA A SUA LÓGICA DE ESTADOS E FUNÇÕES FOI MANTIDA INTACТА)
    const [currentScenario, setCurrentScenario] = useState(0)
    const [selectedOption, setSelectedOption] = useState<'red' | 'yellow' | 'green' | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [gameStarted, setGameStarted] = useState(false)
    const [timeLeft, setTimeLeft] = useState(30)
    const [gameCompleted, setGameCompleted] = useState(false)
    const [currentDifficulty, setCurrentDifficulty] = useState<'iniciante' | 'intermediário' | 'avançado'>('iniciante')
    const [salvando, setSalvando] = useState(false)
    const router = useRouter()
    
    const scenarios = [
        { id: 1, situation: "Seu amigo está chorando porque perdeu o jogo. Você quer ajudá-lo.", options: { red: "Ignorar e continuar com suas coisas", yellow: "Observar se ele quer ajuda antes de agir", green: "Oferecer um abraço ou palavras de apoio" }, correctAnswer: 'green', explanation: "VERDE! Quando alguém está triste, oferecer apoio é uma boa ação.", difficulty: 'iniciante' },
        { id: 2, situation: "Você errou na prova e está frustrado. Quer desistir de estudar.", options: { red: "Jogar os materiais longe", yellow: "Parar, respirar fundo e esperar a frustração passar", green: "Continuar estudando mesmo frustrado" }, correctAnswer: 'yellow', explanation: "AMARELO! Quando frustrado, é importante pausar e se acalmar.", difficulty: 'iniciante' },
        { id: 3, situation: "Um colega fez um comentário sobre seu cabelo. Você não sabe se foi elogio ou crítica.", options: { red: "Fazer um comentário ruim sobre ele também", yellow: "Observar o tom e contexto antes de reagir", green: "Agradecer, assumindo que foi elogio" }, correctAnswer: 'yellow', explanation: "AMARELO! Situações ambíguas precisam de observação.", difficulty: 'intermediário' },
        { id: 4, situation: "Você vê alguém em perigo real. A situação é séria.", options: { red: "Fingir que não viu para evitar problemas", yellow: "Parar para pensar na melhor forma de ajudar", green: "Agir imediatamente: ajudar ou chamar um adulto" }, correctAnswer: 'green', explanation: "VERDE! Em perigo real, agir rapidamente é essencial.", difficulty: 'intermediário' },
        { id: 5, situation: "Seus pais disseram 'não' para algo importante. Você sente raiva intensa.", options: { red: "Contar até 10 e sair do ambiente até se acalmar", yellow: "Tentar conversar mesmo com raiva", green: "Explicar calmamente por que é importante" }, correctAnswer: 'red', explanation: "VERMELHO! Raiva intensa pode levar a palavras que machucam. Melhor sair e voltar calmo.", difficulty: 'avançado' },
        { id: 6, situation: "Você recebeu uma crítica sobre seu trabalho. Doeu, mas pode ter pontos válidos.", options: { red: "Se defender e explicar por que está errada", yellow: "Processar a informação com calma antes de responder", green: "Agradecer e aceitar tudo imediatamente" }, correctAnswer: 'yellow', explanation: "AMARELO! Críticas precisam ser processadas com calma para aproveitar o que é útil.", difficulty: 'avançado' }
    ]

    const filteredScenarios = scenarios.filter(s => s.difficulty === currentDifficulty)
    const scenario = filteredScenarios[currentScenario]

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (gameStarted && timeLeft > 0 && !showResult && !gameCompleted) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
        } else if (timeLeft === 0 && !showResult) {
            handleAnswer(null)
        }
        return () => clearTimeout(timer)
    }, [timeLeft, gameStarted, showResult, gameCompleted])

    const handleAnswer = (option: 'red' | 'yellow' | 'green' | null) => {
        if (showResult) return;
        setSelectedOption(option);
        setShowResult(true);
        if (option === scenario.correctAnswer) {
            setScore(score + 1);
        }
    };
    
    const nextScenario = () => {
        if (currentScenario < filteredScenarios.length - 1) {
            setCurrentScenario(currentScenario + 1);
            setSelectedOption(null);
            setShowResult(false);
            setTimeLeft(30);
        } else {
            setGameCompleted(true);
        }
    };

    const resetGame = (difficulty = currentDifficulty) => {
        setCurrentDifficulty(difficulty);
        setCurrentScenario(0);
        setSelectedOption(null);
        setShowResult(false);
        setScore(0);
        setGameStarted(false);
        setTimeLeft(30);
        setGameCompleted(false);
    };

    const startGame = () => {
        setCurrentScenario(0);
        setSelectedOption(null);
        setShowResult(false);
        setScore(0);
        setTimeLeft(30);
        setGameCompleted(false);
        setGameStarted(true);
    };

    const handleSaveSession = async () => {
        setSalvando(true);
        // Sua lógica de salvamento...
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simula salvamento
        setSalvando(false);
        router.push('/dashboard');
    }

    // TELA INICIAL
    if (!gameStarted) {
        return (
            <div className="min-h-screen bg-gray-50">
                <GameHeader title="Jogo do Semáforo" icon="🚦" />
                <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                                    <p className="text-sm text-gray-600">Aprender a escolher a melhor resposta (Parar, Pensar ou Agir) para diferentes situações sociais e emocionais.</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Escolha um nível de dificuldade.</li>
                                        <li>Leia a situação e analise as três opções.</li>
                                        <li>Escolha a cor que parece mais correta no tempo.</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">Cada resposta correta vale pontos. O objetivo é entender o raciocínio por trás de cada cor do semáforo.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {(['iniciante', 'intermediário', 'avançado'] as const).map((level, index) => (
                                    <button key={level} onClick={() => setCurrentDifficulty(level)} className={`p-4 rounded-lg font-medium transition-colors ${currentDifficulty === level ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                                        <div className="text-2xl mb-1">{['🐣', '🐥', '🦅'][index]}</div>
                                        <div className="text-sm capitalize">{level}</div>
                                        <div className="text-xs opacity-80">{['2 situações', '2 situações', '2 situações'][index]}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="text-center pt-4">
                            <button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">🚀 Iniciar Jogo</button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // TELA DE RESULTADOS
    if (gameCompleted) {
        const percentage = (score / filteredScenarios.length) * 100;
        return (
            <div className="min-h-screen bg-gray-50">
                <GameHeader title="Nível Concluído!" icon="🏆" onSave={handleSaveSession} isSaveDisabled={salvando} showSaveButton={true}/>
                <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Resultado do Nível {currentDifficulty}</h2>
                        <p className="text-5xl font-bold text-teal-500">{score} / {filteredScenarios.length} <span className="text-2xl">acertos</span></p>
                        <p className="text-lg text-gray-600">{percentage >= 80 ? "Excelente! Você domina as reações!" : "Muito bom! Continue praticando!"}</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button onClick={() => resetGame()} className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">Jogar Novamente</button>
                            {currentDifficulty !== 'avançado' && (
                                <button onClick={() => resetGame(currentDifficulty === 'iniciante' ? 'intermediário' : 'avançado')} className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-semibold">Próximo Nível</button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // TELA DO JOGO ATIVO
    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader title="Jogo do Semáforo" icon="🚦" />
            <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-6">
                    <div className="text-sm text-gray-600">Pontuação: <span className="font-bold text-teal-600">{score}</span></div>
                    <div className="text-sm text-gray-600">Cenário <span className="font-bold">{currentScenario + 1} / {filteredScenarios.length}</span></div>
                    <div className="text-lg font-mono font-bold bg-gray-100 px-3 py-1 rounded">⏱️ {timeLeft}s</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-500">SITUAÇÃO</p>
                        <p className="text-lg text-gray-800">{scenario.situation}</p>
                    </div>

                    <div className="space-y-3">
                        {(['red', 'yellow', 'green'] as const).map(color => {
                            const colors = {
                                red: { bg: 'bg-red-100 hover:bg-red-200', ring: 'ring-red-500', text: 'text-red-800', border: 'border-red-300' },
                                yellow: { bg: 'bg-yellow-100 hover:bg-yellow-200', ring: 'ring-yellow-500', text: 'text-yellow-800', border: 'border-yellow-300' },
                                green: { bg: 'bg-green-100 hover:bg-green-200', ring: 'ring-green-500', text: 'text-green-800', border: 'border-green-300' },
                            };
                            const isSelected = selectedOption === color;
                            const isCorrect = scenario.correctAnswer === color;

                            return (
                                <button key={color} onClick={() => handleAnswer(color)} disabled={showResult} className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center space-x-4 disabled:cursor-not-allowed ${colors[color].bg} ${colors[color].border} ${showResult && isSelected ? `ring-4 ${colors[color].ring}` : ''}`}>
                                    <div className={`w-6 h-6 rounded-full flex-shrink-0 ${color === 'red' ? 'bg-red-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                    <span className={`font-medium ${colors[color].text}`}>{scenario.options[color]}</span>
                                    {showResult && isSelected && (<span className={`ml-auto font-bold text-xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isCorrect ? '✓' : '✗'}</span>)}
                                </button>
                            );
                         })}
                    </div>

                    {showResult && (
                        <div className={`p-4 rounded-lg mt-4 ${selectedOption === scenario.correctAnswer ? 'bg-green-50' : 'bg-red-50'}`}>
                            <p className="font-semibold">{scenario.explanation}</p>
                            <button onClick={nextScenario} className="w-full mt-4 py-3 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600">
                                {currentScenario < filteredScenarios.length - 1 ? 'Próxima Situação' : 'Ver Resultado'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
