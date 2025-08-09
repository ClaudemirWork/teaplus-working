'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, X, Volume2, CornerLeftUp, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CAAActivityPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('necessidades');
    const [message, setMessage] = useState('');
    const [selectedSymbols, setSelectedSymbols] = useState([]);
    
    // Estrutura de dados para os símbolos organizada por categorias
    const symbols = {
        necessidades: [
            { text: 'Quero comer', icon: '🍔' },
            { text: 'Quero beber', icon: '🥤' },
            { text: 'Preciso de ajuda', icon: '🤝' },
            { text: 'Quero ir ao banheiro', icon: '🚽' },
            { text: 'Quero ir para casa', icon: '🏠' },
            { text: 'Quero ir para a escola', icon: '🏫' },
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
            { text: 'Carro', icon: '🚗' },
            { text: 'Supermercado', icon: '🛒' },
            { text: 'Parque', icon: '🌳' },
            { text: 'Brinquedo', icon: '🧸' },
            { text: 'Celular', icon: '📱' },
        ],
        comidas: [
            { text: 'Maçã', icon: '🍎' },
            { text: 'Banana', icon: '🍌' },
            { text: 'Leite', icon: '🥛' },
            { text: 'Pão', icon: '🍞' },
            { text: 'Pizza', icon: '🍕' },
            { text: 'Doce', icon: '🍬' },
            { text: 'Água', icon: '💧' },
        ],
        saude: [
            { text: 'Banho', icon: '🚿' },
            { text: 'Escovar os dentes', icon: '🦷' },
            { text: 'Remédio', icon: '💊' },
            { text: 'Febre', icon: '🌡️' },
            { text: 'Dormir', icon: '😴' },
            { text: 'Curativo', icon: '🩹' },
        ],
        tempo: [
            { text: 'Sol', icon: '☀️' },
            { text: 'Lua', icon: '🌙' },
            { text: 'Relógio', icon: '⏰' },
            { text: 'Calendário', icon: '🗓️' },
            { text: 'Escola', icon: '🏫' },
            { text: 'Família', icon: '👨‍👩‍👧‍👦' },
        ],
    };

    const activityInfo = {
        title: 'Comunicação Aumentativa e Alternativa (CAA)',
        objective: 'Praticar a comunicação de necessidades e sentimentos usando símbolos visuais e frases curtas.',
        levels: [
            'Nível 1: Símbolos básicos',
            'Nível 2: Mais símbolos e conceitos',
            'Nível 3: Símbolos com frases curtas'
        ],
        howToPlay: [
            'Selecione uma categoria para ver os símbolos.',
            'Clique nos ícones para adicionar palavras à sua frase.',
            'Use os botões abaixo para falar, desfazer ou limpar a frase.'
        ],
        scientificBase: 'Este exercício é baseado em princípios de Comunicação Aumentativa e Alternativa (CAA) e PECS (Picture Exchange Communication System), comprovados cientificamente para o desenvolvimento da linguagem e redução da frustração.'
    };

    const speakText = (text) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSymbolClick = (symbol) => {
        setSelectedSymbols(prevSymbols => [...prevSymbols, symbol]);
        speakText(symbol.text);
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
        } else {
            setMessage('Selecione um símbolo primeiro.');
        }
    };

    const handleUndo = () => {
        setSelectedSymbols(prevSymbols => prevSymbols.slice(0, -1));
        setMessage('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="p-3 sm:p-4 flex items-center justify-between">
                    <Link
                        href="/tea"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
                    >
                        <ChevronLeft size={20} />
                        <span className="text-sm sm:text-base">Voltar para TEA</span>
                    </Link>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <span className="text-sm font-semibold text-gray-800">
                            {activityInfo.title}
                        </span>
                    </div>
                </div>
            </header>

            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {/* Cabeçalho da Atividade (Objetivo, Como se Joga, Níveis) */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{activityInfo.title}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                            <p className="text-sm text-gray-600">{activityInfo.objective}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">🕹️ Como se Joga:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {activityInfo.howToPlay.map((instruction, index) => (
                                    <li key={index}>{instruction}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">⭐ Níveis:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {activityInfo.levels.map((level, index) => (
                                    <li key={index}>{level}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Área de construção da frase e controles */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-gray-100 rounded-lg min-h-[64px]">
                        {selectedSymbols.length === 0 ? (
                            <span className="text-gray-400 italic">Selecione os símbolos para montar sua frase...</span>
                        ) : (
                            selectedSymbols.map((symbol, index) => (
                                <div key={index} className="flex items-center space-x-1 p-2 bg-white rounded-md border border-gray-200">
                                    <span className="text-xl">{symbol.icon}</span>
                                    <span className="text-sm text-gray-800">{symbol.text}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                        <button
                            onClick={handleSpeakSentence}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Volume2 size={20} />
                            <span>Falar Frase</span>
                        </button>
                        <button
                            onClick={handleUndo}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-500 text-white font-medium hover:bg-gray-600 transition-colors"
                        >
                            <CornerLeftUp size={20} />
                            <span>Desfazer</span>
                        </button>
                        <button
                            onClick={handleClearSentence}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                        >
                            <X size={20} />
                            <span>Limpar</span>
                        </button>
                    </div>
                    {message && (
                        <div className="mt-4 p-4 text-center rounded-lg bg-blue-100 text-blue-800 font-semibold">
                            {message}
                        </div>
                    )}
                </div>

                {/* Prancha de Comunicação com categorias */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Selecione uma categoria e depois os ícones</h2>

                    {/* Botões de Categoria */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {Object.keys(symbols).map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Ícones da categoria selecionada */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                        {symbols[selectedCategory].map((symbol, index) => (
                            <button
                                key={index}
                                onClick={() => handleSymbolClick(symbol)}
                                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white hover:bg-gray-100 transition-colors border-2 border-gray-200 min-h-[120px] shadow-sm touch-manipulation"
                            >
                                <span className="text-4xl mb-2">{symbol.icon}</span>
                                <span className="text-sm sm:text-base font-semibold text-gray-800">{symbol.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
                {/* Base Científica - no final da página */}
                <div className="mt-6 bg-white rounded-xl shadow-lg p-6 sm:p-8">
                     <h3 className="text-xl font-bold text-gray-800 mb-2">👩‍🔬 Base Científica:</h3>
                     <p className="text-sm text-gray-600">{activityInfo.scientificBase}</p>
                </div>
            </main>
        </div>
    );
}
