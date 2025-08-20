'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Play, Target, Award, Brain, Trophy, RotateCcw, CheckCircle, XCircle, Save, Shapes } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

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

export default function PadroesVisuais() {
    const router = useRouter();
    const supabase = createClient();

    const [showActivity, setShowActivity] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [pattern, setPattern] = useState<number[]>([]);
    const [userPattern, setUserPattern] = useState<number[]>([]);
    const [gamePhase, setGamePhase] = useState<'ready' | 'showing' | 'input' | 'feedback'>('ready');
    const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const levelConfig = {
        1: { gridSize: 3, patternLength: 3, time: 2000, target: 50 },
        2: { gridSize: 4, patternLength: 4, time: 2500, target: 50 },
        3: { gridSize: 4, patternLength: 6, time: 3000, target: 50 }
    };

    const generatePattern = (level: number) => {
        const config = levelConfig[level as keyof typeof levelConfig];
        const totalCells = config.gridSize * config.gridSize;
        const newPattern: number[] = [];
        while (newPattern.length < config.patternLength) {
            const randomCell = Math.floor(Math.random() * totalCells);
            if (!newPattern.includes(randomCell)) {
                newPattern.push(randomCell);
            }
        }
        setPattern(newPattern);
        setUserPattern([]);
    };

    const startRound = () => {
        generatePattern(currentLevel);
        setGamePhase('showing');
        setFeedback(null);
        setTimeout(() => {
            setGamePhase('input');
        }, levelConfig[currentLevel as keyof typeof levelConfig].time);
    };

    const handleCellClick = (cellIndex: number) => {
        if (gamePhase !== 'input') return;
        const newUserPattern = userPattern.includes(cellIndex)
            ? userPattern.filter(index => index !== cellIndex)
            : [...userPattern, cellIndex];
        setUserPattern(newUserPattern);
    };

    const checkAnswer = () => {
        const isCorrect = pattern.length === userPattern.length && pattern.every(cell => userPattern.includes(cell));
        setAttempts(prev => prev + 1);
        if (isCorrect) {
            setScore(prev => prev + 10);
            setFeedback({ correct: true, message: "Excelente! Padrão correto!" });
        } else {
            setFeedback({ correct: false, message: "Incorreto. Veja a correção." });
        }
        setGamePhase('feedback');
    };

    const nextRound = () => {
        if (score >= 50) {
            if (currentLevel < 3) {
                const newLevel = currentLevel + 1;
                setCurrentLevel(newLevel);
                setScore(0);
                setAttempts(0);
                generatePattern(newLevel);
            } else {
                setIsGameFinished(true);
            }
        }
        setGamePhase('ready');
    };

    const resetActivity = () => {
        setCurrentLevel(1);
        setScore(0);
        setAttempts(0);
        setGamePhase('ready');
        setFeedback(null);
        setIsGameFinished(false);
        setShowActivity(false); // Volta para a tela de instruções
    };

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
                atividade_nome: 'Padrões Visuais',
                pontuacao_final: score + ((currentLevel - 1) * 50), // Pontuação total
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
    
    const renderGrid = () => {
        const config = levelConfig[currentLevel as keyof typeof levelConfig];
        const gridSize = config.gridSize;
        const cells = Array.from({ length: gridSize * gridSize }, (_, i) => i);

        return (
            <div className="grid gap-2 mx-auto" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, width: `${gridSize * 60}px` }}>
                {cells.map(cellIndex => {
                    const isPatternCell = pattern.includes(cellIndex);
                    const isSelectedByUser = userPattern.includes(cellIndex);
                    let cellClass = "w-14 h-14 rounded-lg border-2 transition-all duration-200 ";
                    if (gamePhase === 'showing' && isPatternCell) cellClass += "bg-blue-500 border-blue-600";
                    else if (gamePhase === 'input' && isSelectedByUser) cellClass += "bg-green-400 border-green-500";
                    else if (gamePhase === 'feedback') {
                        if (isPatternCell && isSelectedByUser) cellClass += "bg-green-500 border-green-600"; // Acerto
                        else if (isPatternCell && !isSelectedByUser) cellClass += "bg-red-400 border-red-500 animate-pulse"; // Erro: Faltou
                        else if (!isPatternCell && isSelectedByUser) cellClass += "bg-yellow-400 border-yellow-500"; // Erro: Sobrou
                        else cellClass += "bg-gray-200 border-gray-300";
                    } else cellClass += "bg-gray-200 border-gray-300 hover:bg-gray-300 cursor-pointer";
                    return <div key={cellIndex} className={cellClass} onClick={() => handleCellClick(cellIndex)} />;
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader 
                title="Padrões Visuais"
                icon={<Shapes size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={isGameFinished}
            />
            <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
                {!showActivity ? (
                    // TELA DE INSTRUÇÕES
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                             <h2 className="text-xl font-bold text-gray-800 mb-3">🎯 Objetivo</h2>
                             <p className="text-gray-700">Fortalecer a memória visual de trabalho reproduzindo padrões em uma grade após uma breve visualização.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                             <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Níveis</h2>
                             <div className="space-y-3">
                                 <p><strong className="text-blue-600">Nível 1:</strong> Grade 3x3, padrão de 3 células.</p>
                                 <p><strong className="text-blue-600">Nível 2:</strong> Grade 4x4, padrão de 4 células.</p>
                                 <p><strong className="text-blue-600">Nível 3:</strong> Grade 4x4, padrão de 6 células.</p>
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
                    // TELA DO JOGO
                    <div>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                             <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm font-medium text-gray-500">Nível</h3><p className="text-2xl font-bold text-blue-600">{currentLevel}</p></div>
                             <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm font-medium text-gray-500">Pontuação</h3><p className="text-2xl font-bold text-green-600">{score}/{levelConfig[currentLevel as keyof typeof levelConfig].target}</p></div>
                             <div className="bg-white rounded-xl p-4 shadow-lg text-center"><h3 className="text-sm font-medium text-gray-500">Tentativas</h3><p className="text-2xl font-bold text-purple-600">{attempts}</p></div>
                         </div>
                         <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                            {isGameFinished ? (
                                <div>
                                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-gray-800">Parabéns!</h2>
                                    <p className="text-gray-600 mt-2">Você completou todos os níveis com sucesso.</p>
                                    <button onClick={resetActivity} className="mt-6 px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center gap-2 mx-auto"><RotateCcw className="w-5 h-5" />Reiniciar</button>
                                </div>
                            ) : gamePhase === 'ready' ? (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Nível {currentLevel}: Pronto para começar?</h2>
                                    <p className="text-gray-600 mb-6">Um padrão de {levelConfig[currentLevel as keyof typeof levelConfig].patternLength} células será exibido por alguns segundos.</p>
                                    <button onClick={startRound} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-shadow"><Play className="w-5 h-5" />Iniciar Rodada</button>
                                </div>
                            ) : gamePhase === 'showing' ? (
                                <div>
                                    <h2 className="text-xl font-semibold mb-6">Memorize este padrão:</h2>
                                    {renderGrid()}
                                </div>
                            ) : gamePhase === 'input' ? (
                                <div>
                                    <h2 className="text-xl font-semibold mb-6">Reproduza o padrão:</h2>
                                    {renderGrid()}
                                    <button onClick={checkAnswer} disabled={userPattern.length === 0} className="mt-6 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow">Verificar</button>
                                </div>
                            ) : gamePhase === 'feedback' && feedback && (
                                <div>
                                    <div className={`flex items-center justify-center gap-3 mb-4 text-2xl font-bold ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                                        {feedback.correct ? <CheckCircle /> : <XCircle />}
                                        <h2>{feedback.message}</h2>
                                    </div>
                                    {renderGrid()}
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
    );
}
