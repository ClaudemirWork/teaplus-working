'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, X, Volume2, CornerLeftUp, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

export default function CAAActivityPage() {
    const router = useRouter();
    const supabase = createClient();
    const [selectedCategory, setSelectedCategory] = useState('necessidades');
    const [message, setMessage] = useState('');
    const [selectedSymbols, setSelectedSymbols] = useState<{ text: string; icon: string }[]>([]);
    const [salvando, setSalvando] = useState(false);
    
    // Estados para métricas
    const [totalAtosComunicativos, setTotalAtosComunicativos] = useState(0);
    const [categoriasUtilizadas, setCategoriasUtilizadas] = useState(new Set<string>());
    const [simbolosUnicos, setSimbolosUnicos] = useState(new Set<string>());
    const [inicioSessao] = useState(new Date());

    const symbols: { [key: string]: { text: string; icon: string }[] } = {
        necessidades: [
            { text: 'Quero comer', icon: '🍔' },
            { text: 'Quero beber', icon: '🥤' },
            { text: 'Preciso de ajuda', icon: '🤝' },
            { text: 'Quero ir ao banheiro', icon: '🚽' },
            { text: 'Quero ir para casa', icon: '🏠' },
            { text: 'Estou com sono', icon: '😴' },
        ],
        sentimentos: [
            { text: 'Estou feliz', icon: '😊' },
            { text: 'Estou triste', icon: '😢' },
            { text: 'Estou com raiva', icon: '😡' },
            { text: 'Estou com medo', icon: '😨' },
            { text: 'Me sinto doente', icon: '🤒' },
            { text: 'Estou com dor', icon: '🤕' },
        ],
        acoes: [
            { text: 'Quero brincar', icon: '🪁' },
            { text: 'Quero desenhar', icon: '🎨' },
            { text: 'Quero ler um livro', icon: '📖' },
            { text: 'Quero música', icon: '🎵' },
            { text: 'Quero ir lá fora', icon: '🚶' },
            { text: 'Vamos brincar agora', icon: '🎲' },
        ],
        pessoas: [
            { text: 'Mamãe', icon: '👩' },
            { text: 'Papai', icon: '👨' },
            { text: 'Amigo', icon: '👫' },
            { text: 'Professor', icon: '🧑‍🏫' },
            { text: 'Eu', icon: '🙋' },
        ],
        lugares: [
            { text: 'Sala', icon: '🛋️' },
            { text: 'Quarto', icon: '🛏️' },
            { text: 'Escola', icon: '🏫' },
            { text: 'Supermercado', icon: '🛒' },
            { text: 'Parque', icon: '🌳' },
            { text: 'Carro', icon: '🚗' },
        ],
        comidas: [
            { text: 'Maçã', icon: '🍎' },
            { text: 'Banana', icon: '🍌' },
            { text: 'Leite', icon: '🥛' },
            { text: 'Pão', icon: '🍞' },
            { text: 'Pizza', icon: '🍕' },
            { text: 'Água', icon: '💧' },
        ],
    };

    const speakText = (text: string) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSymbolClick = (symbol: { text: string; icon: string }) => {
        setSelectedSymbols(prevSymbols => [...prevSymbols, symbol]);
        speakText(symbol.text);
        setTotalAtosComunicativos(prev => prev + 1);
        setCategoriasUtilizadas(prev => new Set(prev).add(selectedCategory));
        setSimbolosUnicos(prev => new Set(prev).add(symbol.text));
    };

    const handleClearSentence = () => {
        setSelectedSymbols([]);
        setMessage('');
    };

    const handleSpeakSentence = () => {
        if (selectedSymbols.length > 0) {
            const sentence = selectedSymbols.map(s => s.text).join(' ');
            speakText(sentence);
            setMessage(`Frase: ${sentence}`);
            setTotalAtosComunicativos(prev => prev + 1);
        } else {
            setMessage('Selecione um símbolo primeiro.');
        }
    };

    const handleUndo = () => {
        setSelectedSymbols(prevSymbols => prevSymbols.slice(0, -1));
        setMessage('');
    };
    
    const handleSaveSession = async () => {
        if (totalAtosComunicativos === 0) {
            alert('Nenhuma interação foi registrada para salvar.');
            return;
        }
        
        setSalvando(true);
        
        const fimSessao = new Date();
        const duracaoMinutos = (fimSessao.getTime() - inicioSessao.getTime()) / 60000;
        const atosPorMinuto = duracaoMinutos > 0 ? (totalAtosComunicativos / duracaoMinutos) : 0;
        
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                alert('Erro: Sessão expirada. Por favor, faça login novamente.');
                router.push('/login');
                return;
            }
            
            const { error } = await supabase
                .from('sessoes')
                .insert([{
                    usuario_id: user.id,
                    atividade_nome: 'CAA',
                    pontuacao_final: totalAtosComunicativos,
                    data_fim: fimSessao.toISOString(),
                    metricas: {
                      totalAtosComunicativos,
                      atosPorMinuto: parseFloat(atosPorMinuto.toFixed(2)),
                      categoriasUtilizadas: categoriasUtilizadas.size,
                      simbolosUnicos: simbolosUnicos.size
                    }
                }]);

            if (error) {
                throw error;
            }

            alert(`Sessão salva com sucesso!\n\n📊 Resumo:\n• ${totalAtosComunicativos} atos comunicativos\n• ${categoriasUtilizadas.size} categorias exploradas`);
            router.push('/dashboard');
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message}`);
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
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
                  
                  <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center">
                    🗣️ Comunicação Alternativa
                  </h1>
                  
                  <button
                    onClick={handleSaveSession}
                    disabled={salvando}
                    className="flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors disabled:bg-green-400"
                  >
                    <Save size={18} />
                    <span className="hidden sm:inline">{salvando ? 'Salvando...' : 'Salvar'}</span>
                  </button>
                </div>
              </div>
            </header>

            <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                            <p className="text-sm text-gray-600">Praticar a comunicação de necessidades e sentimentos usando símbolos visuais.</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                <li>Selecione uma categoria.</li>
                                <li>Clique nos ícones para montar sua frase.</li>
                                <li>Use os botões para falar ou limpar.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-gray-100 rounded-lg min-h-[64px]">
                        {selectedSymbols.length === 0 ? (
                            <span className="text-gray-400 italic px-2">Sua frase aparecerá aqui...</span>
                        ) : (
                            selectedSymbols.map((symbol, index) => (
                                <div key={index} className="flex items-center space-x-1 p-2 bg-white rounded-md border">
                                    <span className="text-xl">{symbol.icon}</span>
                                    <span className="text-sm text-gray-800">{symbol.text}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                        <button onClick={handleSpeakSentence} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700">
                            <Volume2 size={20} />
                            <span>Falar Frase</span>
                        </button>
                        <button onClick={handleUndo} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-500 text-white font-medium hover:bg-gray-600">
                            <CornerLeftUp size={20} />
                            <span>Desfazer</span>
                        </button>
                        <button onClick={handleClearSentence} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600">
                            <X size={20} />
                            <span>Limpar</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Categorias</h2>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {Object.keys(symbols).map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                    selectedCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                        {symbols[selectedCategory].map((symbol, index) => (
                            <button
                                key={index}
                                onClick={() => handleSymbolClick(symbol)}
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white hover:bg-blue-50 transition-colors border-2 min-h-[120px]"
                            >
                                <span className="text-4xl mb-2">{symbol.icon}</span>
                                <span className="text-sm text-center font-semibold text-gray-800">{symbol.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
