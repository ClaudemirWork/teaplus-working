'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, Trash2, Save, Target, Brain, Edit3, User, Zap, Coffee } from 'lucide-react'
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE PADRÃO "GAMEHEADER"
// ============================================================================
const GameHeader = ({ title, icon }) => (
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
        <div className="w-24"></div>
      </div>
    </div>
  </header>
);

// ============================================================================
// 2. INTERFACES E DADOS DA ATIVIDADE
// ============================================================================
interface TimeBlock {
  id: string; title: string; startTime: string; endTime: string;
  category: 'work' | 'personal' | 'health' | 'family' | 'learning' | 'rest' | 'routine';
  priority: 'high' | 'medium' | 'low'; color: string;
}
interface DaySchedule { date: string; dayName: string; blocks: TimeBlock[]; }
interface WeekPlan { id: string; title: string; days: DaySchedule[]; goals: string[]; }
interface Template { name: string; description: string; defaultBlocks: Omit<TimeBlock, 'id' | 'color'>[]; }

const categories = [
    { id: 'work', name: 'Trabalho', color: '#3B82F6', icon: '💼' }, { id: 'personal', name: 'Pessoal', color: '#10B981', icon: '🏠' },
    { id: 'health', name: 'Saúde', color: '#EF4444', icon: '🏃' }, { id: 'family', name: 'Família', color: '#8B5CF6', icon: '👨‍👩‍👧‍👦' },
    { id: 'learning', name: 'Aprendizado', color: '#F59E0B', icon: '📚' }, { id: 'rest', name: 'Descanso', color: '#6B7280', icon: '😴' },
    { id: 'routine', name: 'Rotina', color: '#EC4899', icon: '🔄' }
] as const;

const templates: Template[] = [
    { name: 'Profissional Equilibrado', description: 'Para quem trabalha em horário comercial', defaultBlocks: [
        { title: 'Rotina Matinal', startTime: '07:00', endTime: '08:30', category: 'routine', priority: 'high' },
        { title: 'Trabalho Focado', startTime: '09:00', endTime: '12:00', category: 'work', priority: 'high' },
        { title: 'Almoço', startTime: '12:00', endTime: '13:00', category: 'health', priority: 'medium' },
        { title: 'Trabalho - Reuniões', startTime: '13:00', endTime: '17:00', category: 'work', priority: 'medium' },
        { title: 'Exercícios', startTime: '18:00', endTime: '19:00', category: 'health', priority: 'medium' },
    ]},
    { name: 'Estudante Dedicado', description: 'Focado em estudos e desenvolvimento', defaultBlocks: [
        { title: 'Estudos - Manhã', startTime: '08:00', endTime: '11:00', category: 'learning', priority: 'high' },
        { title: 'Intervalo Ativo', startTime: '11:00', endTime: '11:30', category: 'health', priority: 'medium' },
        { title: 'Estudos - Tarde', startTime: '14:00', endTime: '17:00', category: 'learning', priority: 'high' },
        { title: 'Atividade Física', startTime: '17:30', endTime: '18:30', category: 'health', priority: 'medium' },
    ]}
];

// ============================================================================
// 3. COMPONENTE PRINCIPAL "PLANEJAMENTO DE TEMPO"
// ============================================================================
export default function PlanejamentoTempoPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [nivelSelecionado, setNivelSelecionado] = useState<number | null>(null);
  
  const [currentView, setCurrentView] = useState<'templates' | 'daily' | 'weekly' | 'analysis'>('templates');
  const [weekPlans, setWeekPlans] = useState<WeekPlan[]>([]);
  const [currentWeek, setCurrentWeek] = useState<WeekPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [newBlock, setNewBlock] = useState<Partial<Omit<TimeBlock, 'id' | 'color'>>>({ category: 'personal', priority: 'medium'});
  const [weeklyGoals, setWeeklyGoals] = useState<string[]>(['', '', '']);

  const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const createEmptyWeek = (): WeekPlan => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    return {
      id: Date.now().toString(), title: `Semana de ${startOfWeek.toLocaleDateString()}`,
      days: daysOfWeek.map((dayName, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        return { date: date.toISOString().split('T')[0], dayName, blocks: [] };
      }),
      goals: [],
    };
  };

  const applyTemplate = (template: Template) => {
    const newWeek = createEmptyWeek();
    for (let dayIndex = 1; dayIndex <= 5; dayIndex++) { // Seg a Sex
      newWeek.days[dayIndex].blocks = template.defaultBlocks.map((block, i) => ({
        ...block,
        id: `${dayIndex}-${i}-${Date.now()}`,
        color: categories.find(c => c.id === block.category)!.color,
      }));
    }
    setCurrentWeek(newWeek);
    setCurrentView('weekly');
  };
  
  const addTimeBlock = () => {
    if (!currentWeek || !newBlock.title || !newBlock.startTime || !newBlock.endTime) return;
    const block: TimeBlock = {
      id: `${selectedDay}-${Date.now()}`, title: newBlock.title, startTime: newBlock.startTime, endTime: newBlock.endTime,
      category: newBlock.category || 'personal', priority: newBlock.priority || 'medium',
      color: categories.find(c => c.id === (newBlock.category || 'personal'))!.color,
    };
    const updatedWeek = { ...currentWeek };
    updatedWeek.days[selectedDay].blocks.push(block);
    updatedWeek.days[selectedDay].blocks.sort((a, b) => a.startTime.localeCompare(b.startTime));
    setCurrentWeek(updatedWeek);
    setNewBlock({ category: 'personal', priority: 'medium' });
  };
  
  const removeTimeBlock = (dayIndex: number, blockId: string) => {
      if (!currentWeek) return;
      const updatedWeek = { ...currentWeek };
      updatedWeek.days[dayIndex].blocks = updatedWeek.days[dayIndex].blocks.filter(b => b.id !== blockId);
      setCurrentWeek(updatedWeek);
  };
  
  const handleStartActivity = () => {
      if(nivelSelecionado === null) return;
      const newWeek = createEmptyWeek();
      setCurrentWeek(newWeek);
      if(nivelSelecionado === 1){ // Começar do zero
          setCurrentView('daily');
      } else { // Começar com template
          setCurrentView('templates');
      }
      setGameStarted(true);
  }

  // RENDERIZAÇÃO DOS SUB-COMPONENTES DA FERRAMENTA
  const renderPlanner = () => (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
      <div className="flex gap-2 mb-4 border-b border-gray-200 pb-4">
        {['templates', 'daily', 'weekly', 'analysis'].map(view => (
          <button key={view} onClick={() => setCurrentView(view as any)} className={`px-3 py-2 text-sm rounded-lg font-semibold whitespace-nowrap transition-colors ${currentView === view ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
      {/* Conteúdo das abas aqui */}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader title="Planejamento de Tempo" icon={<Calendar className="w-6 h-6 text-gray-700" />} />
      
      {gameStarted && currentWeek ? (
          // RENDERIZAÇÃO DA FERRAMENTA DE PLANEJAMENTO
          <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
                <div className="flex border-b border-gray-200 pb-4 mb-4 overflow-x-auto">
                    {['templates', 'daily', 'weekly'].map(view => (
                        <button key={view} onClick={() => setCurrentView(view as any)} className={`px-4 py-2 text-sm rounded-lg font-semibold whitespace-nowrap transition-colors mr-2 ${currentView === view ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                           {view === 'templates' && '🚀 Templates'}
                           {view === 'daily' && '🗓️ Visão Diária'}
                           {view === 'weekly' && '📅 Visão Semanal'}
                        </button>
                    ))}
                </div>
                {/* Views */}
                {currentView === 'templates' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates.map((t, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl p-4 flex flex-col">
                                <h4 className="font-bold text-blue-700">{t.name}</h4>
                                <p className="text-sm text-gray-600 flex-grow">{t.description}</p>
                                <button onClick={() => applyTemplate(t)} className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Usar Template</button>
                            </div>
                        ))}
                    </div>
                )}
                 {currentView === 'daily' && (
                    <div>
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                            {daysOfWeek.map((day, i) => <button key={i} onClick={() => setSelectedDay(i)} className={`px-3 py-2 rounded-lg text-sm font-semibold ${selectedDay === i ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>{day}</button>)}
                        </div>
                        {/* Adicionar bloco */}
                        <div className="bg-gray-50 p-4 rounded-xl mb-4">
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                <input type="text" placeholder="Título" value={newBlock.title || ''} onChange={e => setNewBlock(p=>({...p, title:e.target.value}))} className="p-2 border rounded"/>
                                <input type="time" value={newBlock.startTime || ''} onChange={e => setNewBlock(p=>({...p, startTime:e.target.value}))} className="p-2 border rounded"/>
                                <input type="time" value={newBlock.endTime || ''} onChange={e => setNewBlock(p=>({...p, endTime:e.target.value}))} className="p-2 border rounded"/>
                                <select value={newBlock.category} onChange={e => setNewBlock(p=>({...p, category:e.target.value as any}))} className="p-2 border rounded">
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                                </select>
                                <button onClick={addTimeBlock} className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2"><Plus size={16}/> Adicionar</button>
                             </div>
                        </div>
                        {/* Blocos do dia */}
                        <div className="space-y-2">
                            {currentWeek.days[selectedDay].blocks.map(b => (
                                <div key={b.id} className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4" style={{borderColor: b.color}}>
                                    <div>
                                        <p className="font-semibold">{b.title}</p>
                                        <p className="text-xs text-gray-500">{b.startTime} - {b.endTime}</p>
                                    </div>
                                    <button onClick={() => removeTimeBlock(selectedDay, b.id)} className="p-1 text-red-500 hover:bg-red-100 rounded"><Trash2 size={16}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}
                 {currentView === 'weekly' && (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                         {currentWeek.days.map((day, i) => (
                             <div key={i} className="bg-gray-50 p-4 rounded-xl">
                                 <h4 className="font-bold text-center border-b pb-2 mb-2">{day.dayName}</h4>
                                 <div className="space-y-2">
                                     {day.blocks.map(b => (
                                         <div key={b.id} className="p-2 rounded text-xs text-white" style={{backgroundColor: b.color}}>
                                             <p className="font-semibold">{b.title}</p>
                                             <p>{b.startTime} - {b.endTime}</p>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
            </div>
          </main>
      ) : (
        // RENDERIZAÇÃO DA TELA INICIAL PADRONIZADA
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">🎯 Objetivo:</h3><p className="text-sm text-gray-600">Aprender a criar cronogramas semanais e diários que sejam estruturados, mas flexíveis, para melhorar a organização e reduzir a sobrecarga cognitiva.</p></div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">🕹️ Como Jogar:</h3><ul className="list-disc list-inside text-sm text-gray-600 space-y-1"><li>Escolha um modo: com um template pronto ou do zero.</li><li>Adicione ou remova blocos de tempo para cada dia.</li><li>Organize sua semana de forma visual e intuitiva.</li></ul></div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4"><h3 className="font-semibold text-gray-800 mb-1">⭐ Avaliação:</h3><p className="text-sm text-gray-600">Pontos são ganhos ao criar e organizar sua semana. O objetivo principal é a prática de estruturar seu tempo de forma consciente e visual.</p></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Como você quer começar?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button onClick={() => setNivelSelecionado(0)} className={`p-4 rounded-lg font-medium transition-colors text-left ${nivelSelecionado === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}><div className="text-2xl mb-1">🚀</div><div className="text-sm font-bold">Início Rápido (com Templates)</div><div className="text-xs opacity-80">Use modelos prontos para acelerar.</div></button>
                <button onClick={() => setNivelSelecionado(1)} className={`p-4 rounded-lg font-medium transition-colors text-left ${nivelSelecionado === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}><div className="text-2xl mb-1">✏️</div><div className="text-sm font-bold">Começar do Zero</div><div className="text-xs opacity-80">Crie sua semana com total liberdade.</div></button>
              </div>
            </div>

            <div className="text-center pt-4">
              <button onClick={handleStartActivity} disabled={nivelSelecionado === null} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed">🚀 Iniciar Atividade</button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
