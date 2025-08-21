'use client';

import Link from 'next/link'; // LINHA ADICIONADA
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, BookText, History } from 'lucide-react';

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
// 2. PÁGINA DA ATIVIDADE "DIÁRIO DA REFLEXÃO"
// ============================================================================
export default function ReflectionDiaryPage() {
  const [view, setView] = useState<'home' | 'new_entry' | 'history'>('home');
  const [currentStep, setCurrentStep] = useState(0);
  const [entries, setEntries] = useState<any[]>([]);
  const [currentEntry, setCurrentEntry] = useState<any>({ emotions: [] });

  const emotionsList = [
    '😡 Raiva', '😢 Tristeza', '😰 Ansiedade', '😤 Frustração', '😕 Desapontamento', 
    '😳 Vergonha', '😔 Culpa', '😖 Irritação', '😌 Calma', '😊 Alegria', '🤔 Confusão', '😮 Surpresa'
  ];

  const reflectionPrompts = [
    { id: 'situation', question: '🎭 O que aconteceu? Descreva a situação que gerou uma reação forte.', placeholder: 'Ex: Meu amigo cancelou nossos planos de última hora...', type: 'textarea' },
    { id: 'emotions', question: '💭 Quais emoções você sentiu?', placeholder: '', type: 'emotions' },
    { id: 'thoughts', question: '🧠 Que pensamentos passaram pela sua cabeça no momento?', placeholder: 'Ex: Ele não liga para mim, sempre faz isso...', type: 'textarea' },
    { id: 'impulse', question: '⚡ Qual foi seu primeiro impulso?', placeholder: 'Ex: Mandar uma mensagem brava...', type: 'textarea' },
    { id: 'reflection', question: '🤔 Existe outra forma de ver essa situação?', placeholder: 'Ex: Talvez ele tenha um motivo válido...', type: 'textarea' },
    { id: 'betterAction', question: '✨ Que ação mais pensada você poderia ter tomado?', placeholder: 'Ex: Perguntar se está tudo bem, propor reagendar...', type: 'textarea' }
  ];

  useEffect(() => {
    // Simular carregamento de entradas salvas
    const savedEntries = [{ id: '1', date: '2025-07-08', situation: 'Meu colega de trabalho levou crédito por uma ideia minha na reunião.', emotions: ['😡 Raiva', '😤 Frustração'], thoughts: 'Ele fez isso de propósito, quer me prejudicar.', impulse: 'Queria interromper a reunião e falar que a ideia era minha.', reflection: 'Talvez ele não tenha percebido. Ou pode ter sido nervosismo.', betterAction: 'Conversar com ele depois da reunião de forma privada e educada.' }];
    setEntries(savedEntries);
  }, []);

  const handleInputChange = (field: string, value: any) => setCurrentEntry(prev => ({ ...prev, [field]: value }));
  const handleEmotionToggle = (emotion: string) => {
    const currentEmotions = currentEntry.emotions || [];
    const newEmotions = currentEmotions.includes(emotion) ? currentEmotions.filter(e => e !== emotion) : [...currentEmotions, emotion];
    handleInputChange('emotions', newEmotions);
  };

  const nextStep = () => {
    if (currentStep < reflectionPrompts.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeEntry();
    }
  };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1) };

  const completeEntry = () => {
    const newEntry = { ...currentEntry, id: Date.now().toString(), date: new Date().toISOString().split('T')[0] };
    setEntries(prev => [newEntry, ...prev]);
    setCurrentEntry({ emotions: [] });
    setCurrentStep(0);
    setView('history'); // Vai para o histórico após salvar
  };

  const startNewEntry = () => {
    setCurrentEntry({ emotions: [] });
    setCurrentStep(0);
    setView('new_entry');
  };

  const currentPrompt = reflectionPrompts[currentStep];
  const isStepComplete = () => {
    const value = currentEntry[currentPrompt.id as keyof typeof currentEntry];
    if (currentPrompt.id === 'emotions') return Array.isArray(value) && value.length > 0;
    return value && value.toString().trim().length > 3; // Mínimo de 4 caracteres
  };

  // TELA INICIAL
  if (view === 'home') {
    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader title="Diário da Reflexão" icon={<BookText size={24} />} />
            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3>
                                <p className="text-sm text-gray-600">Aprender a pausar e refletir sobre reações emocionais fortes, desenvolvendo autoconsciência e autocontrole.</p>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-1">📝 Como Funciona:</h3>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>Siga os 6 passos guiados para analisar uma situação.</li>
                                    <li>Seja honesto(a) sobre seus sentimentos e pensamentos.</li>
                                    <li>Suas reflexões ficam salvas no histórico.</li>
                                </ul>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-1">🧠 Benefício:</h3>
                                <p className="text-sm text-gray-600">Esta técnica de TCC ajuda a quebrar padrões de reação impulsiva e a escolher respostas mais conscientes e saudáveis.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                        <button onClick={startNewEntry} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center gap-2">
                            ✏️ Iniciar Nova Reflexão
                        </button>
                        <button onClick={() => setView('history')} className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center gap-2">
                            <History size={20} /> Ver Histórico
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
  }

  // TELA DE HISTÓRICO
  if (view === 'history') {
    return (
        <div className="min-h-screen bg-gray-50">
            <GameHeader title="Histórico de Reflexões" icon={<History size={24} />} />
            <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
                <div className="text-center mb-6">
                    <button onClick={startNewEntry} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        ✏️ Adicionar Nova Reflexão
                    </button>
                </div>
                <div className="space-y-6">
                    {entries.map(entry => (
                        <div key={entry.id} className="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 className="font-bold text-lg text-gray-800 mb-3">{new Date(entry.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500 mb-1">Situação:</h4>
                                    <p className="text-gray-700">{entry.situation}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500 mb-1">Emoções:</h4>
                                    <div className="flex flex-wrap gap-2">{entry.emotions.map((e, i) => <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">{e}</span>)}</div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-500 mb-1">Ação Sugerida:</h4>
                                    <p className="text-green-700 font-semibold">{entry.betterAction}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
  }

  // TELA DE NOVA ENTRADA
  return (
    <div className="min-h-screen bg-gray-50">
        <GameHeader title="Nova Reflexão" icon={<BookText size={24} />} />
        <main className="p-4 sm:p-6 max-w-3xl mx-auto w-full">
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
                <div className="h-2 bg-teal-500 rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / reflectionPrompts.length) * 100}%` }}></div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
                <p className="text-lg font-semibold text-gray-800">{currentPrompt.question}</p>
                {currentPrompt.type === 'emotions' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {emotionsList.map(emotion => (
                            <button key={emotion} onClick={() => handleEmotionToggle(emotion)} className={`p-3 rounded-lg border-2 transition-all text-sm text-center ${(currentEntry.emotions || []).includes(emotion) ? 'border-purple-500 bg-purple-50 text-purple-800' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                                {emotion}
                            </button>
                        ))}
                    </div>
                ) : (
                    <textarea value={currentEntry[currentPrompt.id as keyof typeof currentEntry] || ''} onChange={(e) => handleInputChange(currentPrompt.id, e.target.value)} placeholder={currentPrompt.placeholder} className="w-full min-h-[150px] p-3 border-2 border-gray-200 rounded-lg text-base leading-relaxed resize-none focus:border-purple-500 focus:outline-none transition-colors" />
                )}
            </div>
            <div className="flex justify-between mt-6">
                <button onClick={prevStep} disabled={currentStep === 0} className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold">Anterior</button>
                <button onClick={nextStep} disabled={!isStepComplete()} className="px-6 py-3 rounded-lg font-semibold text-white transition-colors bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    {currentStep === reflectionPrompts.length - 1 ? 'Finalizar Reflexão' : 'Próximo'}
                </button>
            </div>
        </main>
    </div>
  )
}
