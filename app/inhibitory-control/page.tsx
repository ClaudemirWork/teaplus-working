'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Trophy, RotateCcw, Zap, CheckCircle, XCircle, ArrowRightCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

// --- COMPONENTE DO CABEÇALHO PADRÃO ---
const GameHeader = ({ onSave, isSaveDisabled, title, icon, showSaveButton }: {
    onSave?: () => void;
    isSaveDisabled?: boolean;
    title: string;
    icon: React.ReactNode;
    showSaveButton?: boolean;
}) => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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

// --- COMPONENTE DA ROLETA SVG ---
const RouletteWheel = ({ options, rotation, colorsMap, isSpinning, spinDuration }: {
    options: string[];
    rotation: number;
    colorsMap: { [key: string]: { bg: string, text: string } };
    isSpinning: boolean;
    spinDuration: number;
}) => {
    const sliceAngle = 360 / options.length;
    
    // Função para criar o caminho SVG de uma fatia
    const createSlicePath = (index: number) => {
        // IMPORTANTE: Vamos mapear corretamente as posições
        // A primeira cor (índice 0) deve começar no topo e ir no sentido horário
        // Começamos em -90 - sliceAngle/2 para centralizar a primeira fatia no topo
        const startAngle = index * sliceAngle - 90 - (sliceAngle / 2);
        const endAngle = startAngle + sliceAngle;
        
        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;
        
        const x1 = 150 + 140 * Math.cos(startAngleRad);
        const y1 = 150 + 140 * Math.sin(startAngleRad);
        const x2 = 150 + 140 * Math.cos(endAngleRad);
        const y2 = 150 + 140 * Math.sin(endAngleRad);
        
        const largeArcFlag = sliceAngle > 180 ? 1 : 0;
        
        return `M 150 150 L ${x1} ${y1} A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    };
    
    // Função para posicionar o texto no centro da fatia
    const getTextPosition = (index: number) => {
        // Centro de cada fatia - deve corresponder ao centro real da fatia
        const middleAngle = (index * sliceAngle - 90) * Math.PI / 180;
        const textRadius = 85;
        const x = 150 + textRadius * Math.cos(middleAngle);
        const y = 150 + textRadius * Math.sin(middleAngle);
        const textRotation = index * sliceAngle - 90;
        return { x, y, rotation: textRotation };
    };

    return (
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto my-8">
            {/* Indicador (seta) - PONTA PARA BAIXO, POSICIONADA EM CIMA */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
                <svg width="50" height="40" viewBox="0 0 50 40" className="drop-shadow-2xl">
                    <path d="M 25 40 L 0 0 L 50 0 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2"/>
                    <text x="25" y="15" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">▼</text>
                </svg>
            </div>
            
            {/* Container da roleta */}
            <div className="w-full h-full rounded-full shadow-2xl">
                <svg
                    width="300"
                    height="300"
                    viewBox="0 0 300 300"
                    className="w-full h-full"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning ? `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)` : 'none',
                    }}
                >
                    {/* Borda externa */}
                    <circle cx="150" cy="150" r="149" fill="none" stroke="#1f2937" strokeWidth="2"/>
                    
                    {/* Fatias da roleta */}
                    {options.map((color, index) => {
                        const textPos = getTextPosition(index);
                        return (
                            <g key={`${color}-${index}`}>
                                {/* Fatia colorida */}
                                <path
                                    d={createSlicePath(index)}
                                    fill={colorsMap[color].bg}
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                />
                                {/* Texto da cor */}
                                <text
                                    x={textPos.x}
                                    y={textPos.y}
                                    fill={colorsMap[color].text}
                                    fontSize="14"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    transform={`rotate(${textPos.rotation} ${textPos.x} ${textPos.y})`}
                                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
                                >
                                    {color}
                                </text>
                            </g>
                        );
                    })}
                    
                    {/* Centro da roleta */}
                    <circle cx="150" cy="150" r="25" fill="#1f2937" stroke="#ffffff" strokeWidth="3"/>
                    <circle cx="150" cy="150" r="15" fill="#374151"/>
                    <circle cx="150" cy="150" r="8" fill="#6b7280"/>
                </svg>
            </div>
        </div>
    );
};

// --- PÁGINA DA NOVA ATIVIDADE ---
export default function AttentionRoulettePage() {
    const router = useRouter();
    const supabase = createClient();

    type GameState = 'initial' | 'awaiting_spin' | 'spinning' | 'decision' | 'feedback' | 'finished';

    const [gameState, setGameState] = useState<GameState>('initial');
    const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(1);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    
    const [targetColor, setTargetColor] = useState('VERMELHO');
    const [rouletteResult, setRouletteResult] = useState('');
    const [rotation, setRotation] = useState(0);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [roundCount, setRoundCount] = useState(0); // Contador de rodadas para resetar rotação

    const [salvando, setSalvando] = useState(false);

    // Métricas
    const [goReactionTimes, setGoReactionTimes] = useState<number[]>([]);
    const [goOpportunities, setGoOpportunities] = useState(0);
    const [stopErrors, setStopErrors] = useState(0);
    const [stopOpportunities, setStopOpportunities] = useState(0);
    const [missedGo, setMissedGo] = useState(0);

    const decisionTimerRef = useRef<NodeJS.Timeout | null>(null);
    const reactionStartRef = useRef<number>(0);

    const niveis = [
        { id: 1, nome: "Nível 1", dificuldade: "4 Cores", options: ['VERMELHO', 'VERDE', 'AZUL', 'AMARELO'], spinDuration: 3000, decisionTime: 4000, icone: "🎨" },
        { id: 2, nome: "Nível 2", dificuldade: "6 Cores", options: ['VERMELHO', 'VERDE', 'AZUL', 'AMARELO', 'ROXO', 'LARANJA'], spinDuration: 2500, decisionTime: 3000, icone: "🖌️" },
        { id: 3, nome: "Nível 3", dificuldade: "8 Cores", options: ['VERMELHO', 'VERDE', 'AZUL', 'AMARELO', 'ROXO', 'LARANJA', 'ROSA', 'TURQUESA'], spinDuration: 2000, decisionTime: 2500, icone: "🖼️" },
    ];
    
    const colorsMap: { [key: string]: { bg: string, text: string } } = {
        'VERMELHO': { bg: '#dc2626', text: '#ffffff' }, 
        'VERDE': { bg: '#16a34a', text: '#ffffff' }, 
        'AZUL': { bg: '#2563eb', text: '#ffffff' }, 
        'AMARELO': { bg: '#eab308', text: '#000000' },
        'ROXO': { bg: '#9333ea', text: '#ffffff' }, 
        'LARANJA': { bg: '#ea580c', text: '#ffffff' }, 
        'ROSA': { bg: '#ec4899', text: '#ffffff' }, 
        'TURQUESA': { bg: '#06b6d4', text: '#ffffff' }
    };
    
    const currentConfig = niveis.find(n => n.id === currentLevel) || niveis[0];

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (gameState !== 'initial' && gameState !== 'finished' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setGameState('finished');
        }
        return () => { if (timer) clearTimeout(timer); };
    }, [gameState, timeLeft]);

    const startNewRound = () => {
        const newTarget = currentConfig.options[Math.floor(Math.random() * currentConfig.options.length)];
        setTargetColor(newTarget);
        setGameState('awaiting_spin');
        setRoundCount(prev => prev + 1);
    };

    const handleSpin = () => {
        if (gameState !== 'awaiting_spin') return;
        
        setGameState('spinning');
        
        // Escolher aleatoriamente a cor que vai parar
        const resultIndex = Math.floor(Math.random() * currentConfig.options.length);
        const resultColor = currentConfig.options[resultIndex];
        
        // Debug
        console.log('=== NOVO GIRO ===');
        console.log('COR ALVO (deve clicar se for):', targetColor);
        console.log('COR SORTEADA:', resultColor, `(índice ${resultIndex})`);
        console.log('Opções:', currentConfig.options.join(', '));
        
        // Cálculo da rotação SIMPLIFICADO
        const sliceAngle = 360 / currentConfig.options.length;
        
        // Para posicionar a cor de índice X no topo:
        // - A primeira cor (índice 0) começa no topo
        // - Para colocar índice 1 no topo: girar -90° (sentido anti-horário)
        // - Para colocar índice 2 no topo: girar -180°
        // - Para colocar índice 3 no topo: girar -270°
        
        const targetAngle = -resultIndex * sliceAngle;
        
        // Adicionar voltas completas
        const spins = 5 + Math.floor(Math.random() * 4); // 5-8 voltas
        const totalRotation = (360 * spins) + targetAngle;
        
        console.log(`Girando ${spins} voltas + ${targetAngle}° = ${totalRotation}° total`);
        
        // Usar rotação acumulativa
        setRotation(prev => prev + totalRotation);

        setTimeout(() => {
            console.log('=== PAROU ===');
            console.log('Sistema diz:', resultColor);
            console.log('Verifique se visual corresponde!');
            
            setRouletteResult(resultColor);
            setGameState('decision');
            reactionStartRef.current = performance.now();

            if (resultColor === targetColor) {
                setGoOpportunities(prev => prev + 1);
            } else {
                setStopOpportunities(prev => prev + 1);
            }

            decisionTimerRef.current = setTimeout(() => {
                if (resultColor !== targetColor) {
                    setIsCorrect(true);
                } else {
                    setIsCorrect(false);
                    setMissedGo(prev => prev + 1);
                }
                setGameState('feedback');
                setTimeout(startNewRound, 1500);
            }, currentConfig.decisionTime);

        }, currentConfig.spinDuration);
    };

    const handleActionClick = () => {
        if (gameState !== 'decision' || !rouletteResult) return;
        if (decisionTimerRef.current) clearTimeout(decisionTimerRef.current);

        const reactionTime = performance.now() - reactionStartRef.current;
        const wasCorrectClick = rouletteResult === targetColor;
        
        // Debug claro
        console.log('');
        console.log('=== CLIQUE DO USUÁRIO ===');
        console.log('Cor alvo:', targetColor);
        console.log('Cor da roleta:', rouletteResult);
        console.log('Ação correta?', wasCorrectClick ? 'SIM ✅' : 'NÃO ❌');

        if (wasCorrectClick) {
            // Clicou quando ERA a cor alvo = CORRETO
            setGoReactionTimes(prev => [...prev, reactionTime]);
            setScore(prev => prev + 100);
            setIsCorrect(true);
            console.log('→ ACERTOU! Clicou na cor certa. +100 pontos');
        } else {
            // Clicou quando NÃO era a cor alvo = ERRO
            setStopErrors(prev => prev + 1);
            setIsCorrect(false);
            console.log('→ ERROU! Clicou na cor errada.');
        }
        console.log('==========================');

        setGameState('feedback');
        setTimeout(startNewRound, 1500);
    };

    const startGame = () => {
        if (nivelSelecionado === null) return;
        setCurrentLevel(nivelSelecionado);
        setTimeLeft(120);
        setScore(0);
        setRotation(0);
        setRoundCount(0);
        setGoReactionTimes([]);
        setGoOpportunities(0);
        setStopErrors(0);
        setStopOpportunities(0);
        setMissedGo(0);
        startNewRound();
    };

    const resetGame = () => {
        // Reset completo de todos os estados
        setGameState('initial');
        setRotation(0);
        setRoundCount(0);
        setScore(0);
        setTimeLeft(120);
        setTargetColor('VERMELHO');
        setRouletteResult('');
        setIsCorrect(null);
        setGoReactionTimes([]);
        setGoOpportunities(0);
        setStopErrors(0);
        setStopOpportunities(0);
        setMissedGo(0);
        setNivelSelecionado(1);
        
        // Limpar timers pendentes
        if (decisionTimerRef.current) {
            clearTimeout(decisionTimerRef.current);
            decisionTimerRef.current = null;
        }
    };

    const handleSaveSession = async () => {
        setSalvando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                const sessionData = {
                    user_id: user.id,
                    game_type: 'attention_roulette',
                    level: currentLevel,
                    score: score,
                    metrics: {
                        avg_reaction_time: calculateMetrics().avgRT,
                        go_accuracy: calculateMetrics().goAccuracy,
                        stop_accuracy: calculateMetrics().stopAccuracy,
                        stop_errors: stopErrors,
                        missed_go: missedGo,
                        go_opportunities: goOpportunities,
                        stop_opportunities: stopOpportunities
                    },
                    created_at: new Date().toISOString()
                };
                
                const { error } = await supabase
                    .from('game_sessions')
                    .insert([sessionData]);
                    
                if (error) {
                    console.error('Erro ao salvar sessão:', error);
                } else {
                    console.log('Sessão salva com sucesso!');
                }
            }
        } catch (error) {
            console.error('Erro ao salvar sessão:', error);
        } finally {
            setSalvando(false);
            router.push('/dashboard');
        }
    };

    const calculateMetrics = () => {
        const avgRT = goReactionTimes.length > 0 ? goReactionTimes.reduce((a, b) => a + b, 0) / goReactionTimes.length : 0;
        const goAccuracy = goOpportunities > 0 ? ((goOpportunities - missedGo) / goOpportunities) * 100 : 0;
        const stopAccuracy = stopOpportunities > 0 ? ((stopOpportunities - stopErrors) / stopOpportunities) * 100 : 0;
        return { avgRT, goAccuracy, stopAccuracy };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <GameHeader 
                title="Roleta da Atenção"
                icon={<Zap size={22} />}
                onSave={handleSaveSession}
                isSaveDisabled={salvando}
                showSaveButton={gameState === 'finished'}
            />
            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {gameState === 'initial' && (
                     <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🎯 Objetivo:</h3>
                                    <p className="text-sm text-gray-600">
                                        Treinar a atenção seletiva e o controle inibitório, focando em um alvo específico enquanto ignora estímulos distratores apresentados de forma dinâmica.
                                    </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> 🕹️ Como Jogar:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        <li>Observe a cor alvo indicada na tela.</li>
                                        <li>Clique em "Girar" para rodar a roleta.</li>
                                        <li>Se a roleta parar na cor alvo, clique no botão de ação.</li>
                                        <li>Se parar em outra cor, <strong>não clique</strong> e aguarde a próxima rodada.</li>
                                    </ul>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-1"> ⭐ Avaliação:</h3>
                                    <p className="text-sm text-gray-600">
                                        Sua performance é medida pela velocidade dos acertos (clicar no alvo) e pela sua capacidade de não clicar nos distratores (controle de impulso).
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Selecione o Nível de Dificuldade</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {niveis.map((nivel) => (
                                    <button
                                        key={nivel.id}
                                        onClick={() => setNivelSelecionado(nivel.id)}
                                        className={`p-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                                            nivelSelecionado === nivel.id 
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                    >
                                        <div className="text-2xl mb-1">{nivel.icone}</div>
                                        <div className="text-sm">{nivel.nome}</div>
                                        <div className="text-xs opacity-80">{nivel.dificuldade}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-center pt-4">
                            <button 
                                onClick={startGame} 
                                disabled={nivelSelecionado === null} 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                            >
                                🚀 Iniciar Atividade
                            </button>
                        </div>
                    </div>
                )}
                
                {(gameState !== 'initial' && gameState !== 'finished') && (
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-3xl mx-auto">
                        {/* Aviso de DEBUG temporário */}
                        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                            ⚠️ MODO DEBUG: As cores estão sendo mostradas para verificação. Remover depois de testar.
                        </div>
                        
                        <div className="flex justify-between items-center mb-6">
                            <span className="bg-purple-100 text-purple-800 font-medium px-4 py-2 rounded-lg">Nível {currentLevel}</span>
                            <span className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded-lg">Pontos: {score}</span>
                            <span className="bg-red-100 text-red-800 font-medium px-4 py-2 rounded-lg">Tempo: {timeLeft}s</span>
                        </div>

                        <h2 className="text-2xl font-bold mb-4">
                            Clique se a roleta parar em: 
                            <span 
                                className="inline-block ml-2 px-4 py-2 rounded-lg shadow-md" 
                                style={{ 
                                    backgroundColor: colorsMap[targetColor]?.bg, 
                                    color: colorsMap[targetColor]?.text 
                                }}
                            >
                                {targetColor}
                            </span>
                        </h2>
                        
                        {/* Indicação visual TEMPORÁRIA para debug */}
                        {gameState === 'decision' && rouletteResult && (
                            <div className="mb-4 p-3 bg-gray-100 border-2 border-gray-300 rounded-lg">
                                <p className="text-sm font-semibold text-gray-700">
                                    🎯 Cor alvo: <span style={{ backgroundColor: colorsMap[targetColor]?.bg, color: colorsMap[targetColor]?.text }} className="px-2 py-1 rounded">{targetColor}</span>
                                </p>
                                <p className="text-sm font-semibold text-gray-700 mt-1">
                                    🎰 Roleta parou em: <span style={{ backgroundColor: colorsMap[rouletteResult]?.bg, color: colorsMap[rouletteResult]?.text }} className="px-2 py-1 rounded">{rouletteResult}</span>
                                </p>
                                <p className="text-sm mt-2">
                                    {rouletteResult === targetColor ? (
                                        <span className="text-green-600 font-bold">✅ CLIQUE AGORA! (é a cor alvo)</span>
                                    ) : (
                                        <span className="text-red-600 font-bold">⛔ NÃO CLIQUE! (não é a cor alvo)</span>
                                    )}
                                </p>
                            </div>
                        )}
                        
                        <RouletteWheel 
                            options={currentConfig.options}
                            rotation={rotation}
                            colorsMap={colorsMap}
                            isSpinning={gameState === 'spinning'}
                            spinDuration={currentConfig.spinDuration}
                        />

                        <div className="h-24 flex items-center justify-center">
                            {gameState === 'awaiting_spin' && (
                                <button 
                                    onClick={handleSpin} 
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-10 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all"
                                >
                                    🎲 Girar Roleta
                                </button>
                            )}
                            {gameState === 'spinning' && (
                                <p className="text-xl animate-pulse text-gray-500">Girando...</p>
                            )}
                            {gameState === 'decision' && (
                                <button 
                                    onClick={handleActionClick} 
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-lg text-xl animate-bounce shadow-lg"
                                >
                                    ✋ É esta cor!
                                </button>
                            )}
                            {gameState === 'feedback' && (
                                <div className="text-center">
                                    {isCorrect ? (
                                        <div className="animate-bounce">
                                            <CheckCircle size={56} className="text-green-500 mx-auto mb-2" />
                                            <span className="text-2xl font-bold text-green-600">ACERTOU!</span>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {rouletteResult === targetColor ? 'Clicou na cor certa!' : 'Não clicou na cor errada!'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="animate-bounce">
                                            <XCircle size={56} className="text-red-500 mx-auto mb-2" />
                                            <span className="text-2xl font-bold text-red-600">ERROU!</span>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {rouletteResult === targetColor ? 'Deveria ter clicado!' : 'Não deveria ter clicado!'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {gameState === 'finished' && (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto">
                        <Trophy className="mx-auto text-yellow-500 mb-4" size={48}/>
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Sessão Concluída!</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-blue-800">{score}</div>
                                <div className="text-sm text-blue-600">Pontos</div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-green-800">{calculateMetrics().avgRT.toFixed(0)}ms</div>
                                <div className="text-sm text-green-600">RT Médio (Go)</div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-purple-800">{calculateMetrics().goAccuracy.toFixed(0)}%</div>
                                <div className="text-sm text-purple-600">Precisão (Go)</div>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-indigo-800">{calculateMetrics().stopAccuracy.toFixed(0)}%</div>
                                <div className="text-sm text-indigo-600">Precisão (Stop)</div>
                            </div>
                            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-red-800">{stopErrors}</div>
                                <div className="text-sm text-red-600">Erros de Impulso</div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-orange-800">{missedGo}</div>
                                <div className="text-sm text-orange-600">Omissões (Go)</div>
                            </div>
                        </div>
                        <button 
                            onClick={resetGame} 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 mx-auto shadow-lg"
                        >
                           <RotateCcw size={20}/>
                           Jogar Novamente
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
