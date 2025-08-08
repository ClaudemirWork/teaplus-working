'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CAAActivityPage() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(null);

    // Dados da atividade para o cabeçalho
    const activityInfo = {
        title: 'Comunicação Aumentativa e Alternativa (CAA)',
        objective: 'Praticar a comunicação de necessidades e sentimentos usando símbolos visuais.',
        levels: [
            'Nível 1: Símbolos básicos (sentimentos e necessidades)',
            'Nível 2: Símbolos avançados (comida, atividades)',
            'Nível 3: Símbolos com frases curtas'
        ],
        scientificBase: 'Este exercício é baseado em princípios de Comunicação Aumentativa e Alternativa (CAA) e PECS (Picture Exchange Communication System), comprovados cientificamente para o desenvolvimento da linguagem e redução da frustração.'
    };

    // Ícones de domínio público ou emojis
    const symbols = [
        { text: 'Quero comer', icon: '🍔' },
        { text: 'Quero beber', icon: '🥤' },
        { text: 'Estou feliz', icon: '😊' },
        { text: 'Estou triste', icon: '😢' },
        { text: 'Quero brincar', icon: '🪁' },
        { text: 'Quero ir ao banheiro', icon: '🚽' },
        { text: 'Dói aqui', icon: '🤕' },
        { text: 'Preciso de ajuda', icon: '🤝' },
    ];

    const speakMessage = (text) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleIconClick = (symbol) => {
        setSelectedIcon(symbol.icon);
        setMessage(`Você selecionou: ${symbol.text}`);
        speakMessage(symbol.text);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header com botão de voltar */}
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

            {/* Conteúdo da Atividade */}
            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {/* Cabeçalho da Atividade (Objetivo, Níveis, etc.) */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{activityInfo.title}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                            <p className="text-sm text-gray-600">{activityInfo.objective}</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">⭐ Níveis:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {activityInfo.levels.map((level, index) => (
                                    <li key={index}>{level}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">👩‍🔬 Base Científica:</h3>
                            <p className="text-sm text-gray-600">{activityInfo.scientificBase}</p>
                        </div>
                    </div>
                </div>

                {/* Prancha de Comunicação */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Selecione um ícone para se comunicar</h2>
                    {/* Exibir mensagem */}
                    {message && (
                        <div className="p-4 text-center rounded-lg bg-blue-100 text-blue-800 font-semibold mb-4">
                            {message}
                        </div>
                    )}
                    <div id="caa-board" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                        {symbols.map((symbol, index) => (
                            <button
                                key={index}
                                onClick={() => handleIconClick(symbol)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl bg-white hover:bg-gray-100 transition-colors border-2 ${selectedIcon === symbol.icon ? 'border-blue-500 shadow-lg' : 'border-gray-200'} min-h-[120px] shadow-sm touch-manipulation`}
                            >
                                <span className="text-4xl mb-2">{symbol.icon}</span>
                                <span className="text-sm sm:text-base font-semibold text-gray-800">{symbol.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

