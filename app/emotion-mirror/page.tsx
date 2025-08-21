'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE PADRÃO DO CABEÇALHO (GameHeader)
// ============================================================================
const GameHeader = ({ title, icon }) => (
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
        <div className="w-24"></div>
      </div>
    </div>
  </header>
);

// ============================================================================
// 2. PÁGINA DA ATIVIDADE "ESPELHO DE EMOÇÕES"
// ============================================================================
export default function EmotionMirrorPage() {
    const [view, setView] = useState<'home' | 'game' | 'completed'>('home');
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentExercise, setCurrentExercise] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [completedLevels, setCompletedLevels] = useState<number[]>([]);
    const router = useRouter();
    
    const levels = [
        { id: 1, name: "Emoções Básicas", description: "Reconhecer emoções fundamentais", pointsRequired: 20, exercises: [
            { id: 1, title: "Alegria Genuína", emotion: "Felicidade", emotionIcon: "😊", facialDescription: "Olhos brilhantes, cantos da boca elevados, bochechas levantadas.", context: "Maria recebeu uma boa notícia.", skillFocus: "Reconhecimento de alegria", questions: [
                { id: 1, question: "Qual emoção esta pessoa está expressando?", options: ["Tristeza", "Felicidade", "Raiva"], correct: 1, explanation: "A expressão mostra felicidade: olhos brilhantes e sorriso natural." },
                { id: 2, question: "Como você sabe que a alegria é verdadeira?", options: ["Apenas os lábios sorriem", "Os olhos também 'sorriem'", "A testa está franzida"], correct: 1, explanation: "Na alegria genuína, os olhos se contraem levemente, criando o 'sorriso dos olhos'." }
            ]}
        ]},
        { id: 2, name: "Emoções Intermediárias", description: "Reconhecer emoções mais sutis", pointsRequired: 10, exercises: [
            { id: 3, title: "Nervosismo e Ansiedade", emotion: "Nervosismo", emotionIcon: "😰", facialDescription: "Olhos arregalados, sobrancelhas elevadas, lábios mordidos.", context: "Pedro está nervoso para a apresentação.", skillFocus: "Identificação de ansiedade", questions: [
              { id: 1, question: "Como identificar nervosismo?", options: ["Expressão relaxada", "Sinais de tensão sutil", "Sorriso constante"], correct: 1, explanation: "O nervosismo se manifesta através de tensão sutil: lábios entreabertos e sobrancelhas elevadas." }
            ]}
        ]},
        { id: 3, name: "Emoções Complexas", description: "Interpretar emoções mistas", pointsRequired: 10, exercises: [
            { id: 4, title: "Sarcasmo Sutil", emotion: "Sarcasmo", emotionIcon: "😏", facialDescription: "Meio sorriso assimétrico, sobrancelha elevada, olhar de lado.", context: "Roberto fez um comentário irônico.", skillFocus: "Reconhecimento de ironia", questions: [
              { id: 1, question: "Como reconhecer sarcasmo?", options: ["Sorriso simétrico", "Sorriso assimétrico", "Expressão neutra"], correct: 1, explanation: "O sarcasmo geralmente se manifesta por um sorriso assimétrico e olhar de lado." }
            ]}
        ]},
    ];

    const currentLevelData = levels.find(level => level.id === currentLevel);
    const currentExerciseData = currentLevelData?.exercises[currentExercise];
    const currentQuestionData = currentExerciseData?.questions[currentQuestion];

    const handleAnswer = (answerIndex: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(answerIndex);
        if (answerIndex === currentQuestionData?.correct) {
            const points = 10;
            setScore(score + points);
            setTotalScore(totalScore + points);
        }
        setShowExplanation(true);
    };

    // --- LÓGICA DE AVANÇO CORRIGIDA ---
    const nextStep = () => {
        const isLastQuestion = currentQuestion >= (currentExerciseData?.questions.length || 0) - 1;
        const isLastExercise = currentExercise >= (currentLevelData?.exercises.length || 0) - 1;

        setShowExplanation(false);
        setSelectedAnswer(null);

        if (!isLastQuestion) {
            setCurrentQuestion(q => q + 1);
        } else if (!isLastExercise) {
            setCurrentExercise(e => e + 1);
            setCurrentQuestion(0);
        } else { // Última questão do último exercício do nível
            if (currentLevel < levels.length) {
                setCurrentLevel(l => l + 1);
                setCurrentExercise(0);
                setCurrentQuestion(0);
                setScore(0);
            } else {
                setView('completed');
            }
        }
    };
    
    const startGame = () => setView('game');
    const resetGame = () => {
        setView('home');
        setCurrentLevel(1);
        setCurrentExercise(0);
        setCurrentQuestion(0);
        setScore(0);
        setTotalScore(0);
        setCompletedLevels([]);
    };

    if (view === 'home') {
        return (
            <div className="min-h-screen bg-gray-50">
                <GameHeader title="Espelho de Emoções" icon="🌟" />
                <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                                    <p className="text-sm text-gray-600">Aprender a identificar emoções em outras pessoas através de suas expressões faciais e do contexto da situação.</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Observe a expressão facial e leia o contexto.</li>
                                        <li>Responda às perguntas sobre a emoção.</li>
                                        <li>Avance pelos níveis para treinar sua percepção.</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">Cada resposta correta vale +10 pontos. Atingir a meta de pontos te leva para o próximo nível.</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-center pt-4">
                            <button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">🚀 Iniciar Atividade</button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (view === 'completed') {
        return (
            <div className="min-h-screen bg-gray-50">
                <GameHeader title="Atividade Concluída!" icon="🏆" />
                <main className="p-4 sm:p-6 max-w-2xl mx-auto w-full">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Parabéns!</h2>
                        <p className="text-lg text-gray-600">Você completou todos os níveis e se tornou um ótimo observador de emoções!</p>
                        <div className="bg-teal-50 p-4 rounded-lg">
                            <p className="text-sm text-teal-800">Pontuação Final</p>
                            <p className="text-4xl font-bold text-teal-600">{totalScore}</p>
                        </div>
                        <button onClick={resetGame} className="w-full py-3 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600">Jogar Novamente</button>
                    </div>
                </main>
            </div>
        );
    }

    if (!currentLevelData || !currentExerciseData || !currentQuestionData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <GameHeader title="Espelho de Emoções" icon="🌟" />
                <p>Carregando atividade...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader title="Espelho de Emoções" icon="🌟" />
            <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
                <div className="bg-white p-3 rounded-lg shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">Nível {currentLevel}: {currentLevelData.name}</span>
                        <span className="text-sm font-semibold text-gray-700">Pontos Totais: <span className="text-teal-600">{totalScore}</span></span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${(score / currentLevelData.pointsRequired) * 100}%` }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
                    <div className="text-center bg-gray-50 p-6 rounded-lg">
                        <div className="text-7xl mb-4">{currentExerciseData.emotionIcon}</div>
                        <h3 className="text-2xl font-bold text-gray-800">{currentExerciseData.title}</h3>
                        <p className="text-gray-600">{currentExerciseData.context}</p>
                    </div>
                    
                    <div className="space-y-4">
                        <p className="text-lg font-semibold text-gray-800">{currentQuestionData.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentQuestionData.options.map((option, index) => (
                                <button key={index} onClick={() => handleAnswer(index)} disabled={selectedAnswer !== null} className={`p-4 rounded-lg border-2 text-left font-medium transition-all disabled:cursor-not-allowed ${selectedAnswer !== null ? (index === currentQuestionData.correct ? 'bg-green-100 border-green-500 text-green-800' : (index === selectedAnswer ? 'bg-red-100 border-red-500 text-red-800' : 'bg-gray-100 text-gray-400')) : 'bg-white hover:bg-gray-100 border-gray-300'}`}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {showExplanation && (
                        <div className="p-4 rounded-lg bg-blue-50 text-blue-800">
                            <p className="font-semibold">💡 Explicação:</p>
                            <p>{currentQuestionData.explanation}</p>
                            <button onClick={nextStep} className="w-full mt-4 py-3 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600">
                                Continuar
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
