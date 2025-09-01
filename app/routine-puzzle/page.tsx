'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Clock, Calendar, Plus, Trash2, Eye, Edit2, Filter, Grid, List } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

// MAPEAMENTO DOS CARDS PECS
const PECS_CARDS = {
  rotina: [
    { id: 'acordar', name: 'Acordar', image: '/images/cards/rotina/hora_acordar.webp', time: '07:00' },
    { id: 'cafe_manha', name: 'Café da Manhã', image: '/images/cards/rotina/cafe_manha.webp', time: '07:30' },
    { id: 'banho', name: 'Tomar Banho', image: '/images/cards/rotina/tomar_banho.webp', time: '08:00' },
    { id: 'escola', name: 'Ir para Escola', image: '/images/cards/rotina/mochila_escola.webp', time: '08:30' },
    { id: 'almoco', name: 'Almoço', image: '/images/cards/rotina/almoco.webp', time: '12:00' },
    { id: 'estudar', name: 'Estudar', image: '/images/cards/rotina/estudar.webp', time: '14:00' },
    { id: 'brincar', name: 'Brincar', image: '/images/cards/rotina/brincar.webp', time: '15:00' },
    { id: 'cafe_tarde', name: 'Café da Tarde', image: '/images/cards/rotina/cafe_tarde.webp', time: '16:00' },
    { id: 'licao', name: 'Lição de Casa', image: '/images/cards/rotina/licao_casa.webp', time: '17:00' },
    { id: 'televisao', name: 'Ver TV', image: '/images/cards/rotina/ver_televisao.webp', time: '18:00' },
    { id: 'jantar', name: 'Jantar', image: '/images/cards/rotina/jantar.webp', time: '19:00' },
    { id: 'dormir', name: 'Dormir', image: '/images/cards/rotina/hora_dormir.webp', time: '20:30' },
    { id: 'casa', name: 'Ir para Casa', image: '/images/cards/rotina/Ir para casa.webp', time: '17:30' },
  ],
  acoes: [
    { id: 'escovar_dentes', name: 'Escovar Dentes', image: '/images/cards/acoes/escovar os dentes.webp', time: '07:15' },
    { id: 'lavar_maos', name: 'Lavar as Mãos', image: '/images/cards/acoes/lavar as maos.webp', time: '11:50' },
    { id: 'vestir', name: 'Vestir Roupa', image: '/images/cards/acoes/vestindo_blusa.webp', time: '07:45' },
    { id: 'sentar', name: 'Sentar', image: '/images/cards/acoes/sentar.webp', time: '12:00' },
    { id: 'caminhar', name: 'Caminhar', image: '/images/cards/acoes/caminhar.webp', time: '08:15' },
    { id: 'abracar', name: 'Abraçar', image: '/images/cards/acoes/abraçar.webp', time: '20:00' },
    { id: 'conversar', name: 'Conversar', image: '/images/cards/acoes/conversar.webp', time: '18:30' },
    { id: 'ler', name: 'Ler Livro', image: '/images/cards/acoes/ler_livro.webp', time: '19:30' },
  ],
  alimentos: [
    { id: 'suco', name: 'Suco', image: '/images/cards/alimentos/suco_laranja.webp', time: '07:30' },
    { id: 'fruta', name: 'Fruta', image: '/images/cards/alimentos/banana.webp', time: '10:00' },
    { id: 'sanduiche', name: 'Sanduíche', image: '/images/cards/alimentos/sanduiche.webp', time: '16:00' },
    { id: 'salada', name: 'Salada', image: '/images/cards/alimentos/salada.webp', time: '12:00' },
    { id: 'macarrao', name: 'Macarrão', image: '/images/cards/alimentos/macarrao_bologhesa.webp', time: '19:00' },
  ],
  escola: [
    { id: 'caderno', name: 'Caderno', image: '/images/cards/escola/caderno.webp', time: '09:00' },
    { id: 'lapis', name: 'Lápis', image: '/images/cards/escola/lapis.webp', time: '09:00' },
    { id: 'livro', name: 'Livro', image: '/images/cards/escola/livro.webp', time: '14:00' },
  ],
  necessidades: [
    { id: 'beber_agua', name: 'Beber Água', image: '/images/cards/acoes/beber.webp', time: '10:30' },
    { id: 'descansar', name: 'Descansar', image: '/images/cards/acoes/sentar.webp', time: '13:00' },
  ]
};

// Categorias
const CATEGORIES = [
  { id: 'rotina', name: 'Rotina Diária', icon: '📅', color: 'bg-blue-100 border-blue-400' },
  { id: 'acoes', name: 'Ações', icon: '👋', color: 'bg-green-100 border-green-400' },
  { id: 'alimentos', name: 'Alimentação', icon: '🍎', color: 'bg-orange-100 border-orange-400' },
  { id: 'escola', name: 'Escola', icon: '🎒', color: 'bg-purple-100 border-purple-400' },
  { id: 'necessidades', name: 'Necessidades', icon: '💙', color: 'bg-pink-100 border-pink-400' },
];

// Tipos
interface PECSCard {
  id: string;
  name: string;
  image: string;
  time: string;
  category?: string;
}

interface RoutineItem extends PECSCard {
  uniqueId: string;
}

export default function RoutineVisualPage() {
  const router = useRouter();
  const supabase = createClient();
  
  // Estados
  const [selectedCategory, setSelectedCategory] = useState('rotina');
  const [myRoutine, setMyRoutine] = useState<RoutineItem[]>([]);
  const [viewMode, setViewMode] = useState<'edit' | 'view'>('edit');
  const [viewStyle, setViewStyle] = useState<'timeline' | 'grid'>('timeline');
  const [routineName, setRoutineName] = useState('Minha Rotina Visual');
  const [isSaving, setIsSaving] = useState(false);
  const [draggedCard, setDraggedCard] = useState<PECSCard | null>(null);

  // Adicionar card à rotina
  const addToRoutine = (card: PECSCard) => {
    const routineItem: RoutineItem = {
      ...card,
      uniqueId: `${card.id}_${Date.now()}`,
      category: selectedCategory
    };
    
    setMyRoutine(prev => {
      const updated = [...prev, routineItem];
      return updated.sort((a, b) => a.time.localeCompare(b.time));
    });
  };

  // Remover da rotina
  const removeFromRoutine = (uniqueId: string) => {
    setMyRoutine(prev => prev.filter(item => item.uniqueId !== uniqueId));
  };

  // Atualizar horário
  const updateTime = (uniqueId: string, newTime: string) => {
    setMyRoutine(prev => {
      const updated = prev.map(item => 
        item.uniqueId === uniqueId ? { ...item, time: newTime } : item
      );
      return updated.sort((a, b) => a.time.localeCompare(b.time));
    });
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, card: PECSCard) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedCard) {
      addToRoutine(draggedCard);
      setDraggedCard(null);
    }
  };

  // Salvar rotina
  const saveRoutine = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const routineData = {
          user_id: user.id,
          routine_name: routineName,
          routine_type: 'visual',
          activities: myRoutine.map(item => ({
            activity_id: item.id,
            name: item.name,
            image: item.image,
            time: item.time,
            category: item.category
          })),
          is_active: true,
          created_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('daily_routines')
          .insert([routineData]);
          
        if (!error) {
          alert('Rotina salva com sucesso!');
          setViewMode('view');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Gerar horários sugeridos
  const timeOptions = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      timeOptions.push(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/dashboard"
              className="flex items-center text-teal-600 hover:text-teal-700"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="ml-1 font-medium">Voltar</span>
            </Link>
            
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Rotina Visual com PECS
            </h1>
            
            {myRoutine.length > 0 && (
              <button
                onClick={saveRoutine}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                <Save size={18} />
                Salvar
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="p-4 max-w-7xl mx-auto">
        {/* Controles */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <input
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
              placeholder="Nome da Rotina"
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'edit' ? 'view' : 'edit')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                {viewMode === 'edit' ? <Eye className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                {viewMode === 'edit' ? 'Visualizar' : 'Editar'}
              </button>
              
              <button
                onClick={() => setViewStyle(viewStyle === 'timeline' ? 'grid' : 'timeline')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                {viewStyle === 'timeline' ? <Grid className="w-5 h-5" /> : <List className="w-5 h-5" />}
                {viewStyle === 'timeline' ? 'Grade' : 'Timeline'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Painel de Cards Disponíveis */}
          {viewMode === 'edit' && (
            <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Cards Disponíveis
              </h2>
              
              {/* Abas de Categorias */}
              <div className="flex flex-wrap gap-2 mb-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
              
              {/* Cards da Categoria */}
              <div className="grid grid-cols-2 gap-2 max-h-[600px] overflow-y-auto">
                {PECS_CARDS[selectedCategory as keyof typeof PECS_CARDS]?.map(card => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card)}
                    onClick={() => addToRoutine(card)}
                    className="p-2 bg-gray-50 rounded-lg hover:bg-blue-50 hover:scale-105 transition-all cursor-pointer border-2 border-gray-200 hover:border-blue-300"
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-20 object-contain mb-1"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.webp';
                      }}
                    />
                    <p className="text-xs text-center font-medium">{card.name}</p>
                    <p className="text-xs text-center text-gray-500">{card.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Área da Rotina */}
          <div 
            className={`${viewMode === 'edit' ? 'md:col-span-2' : 'md:col-span-3'}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Minha Rotina do Dia
              </h2>

              {myRoutine.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">
                    {viewMode === 'edit' 
                      ? 'Clique ou arraste os cards para montar sua rotina'
                      : 'Nenhuma atividade na rotina ainda'}
                  </p>
                </div>
              ) : viewStyle === 'timeline' ? (
                /* Timeline View */
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-400"></div>
                  
                  {myRoutine.map((item, index) => (
                    <div key={item.uniqueId} className="relative flex items-center mb-6">
                      {/* Horário */}
                      <div className="w-16 text-right pr-4">
                        {viewMode === 'edit' ? (
                          <select
                            value={item.time}
                            onChange={(e) => updateTime(item.uniqueId, e.target.value)}
                            className="text-sm font-bold text-blue-600 border rounded px-1"
                          >
                            {timeOptions.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm font-bold text-blue-600">{item.time}</span>
                        )}
                      </div>
                      
                      {/* Ponto na linha */}
                      <div className="absolute left-7 w-3 h-3 bg-white border-2 border-purple-400 rounded-full z-10"></div>
                      
                      {/* Card */}
                      <div className={`ml-6 flex items-center gap-3 p-3 rounded-lg border-2 ${
                        CATEGORIES.find(c => c.id === item.category)?.color || 'bg-gray-50 border-gray-300'
                      }`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder.webp';
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {CATEGORIES.find(c => c.id === item.category)?.name}
                          </p>
                        </div>
                        
                        {viewMode === 'edit' && (
                          <button
                            onClick={() => removeFromRoutine(item.uniqueId)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Grid View */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {myRoutine.map(item => (
                    <div
                      key={item.uniqueId}
                      className={`relative p-3 rounded-lg border-2 ${
                        CATEGORIES.find(c => c.id === item.category)?.color || 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      {viewMode === 'edit' && (
                        <button
                          onClick={() => removeFromRoutine(item.uniqueId)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      
                      <div className="text-center font-bold text-blue-600 mb-2">
                        {item.time}
                      </div>
                      
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-20 object-contain mb-2"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.webp';
                        }}
                      />
                      
                      <p className="text-xs text-center font-medium">{item.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
