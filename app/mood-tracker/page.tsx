'use client';

import { useState } from 'react';

export default function MoodTrackerPage() {
  const [activeSection, setActiveSection] = useState('main');
  const [moods, setMoods] = useState([
    { date: '2025-08-01', mood: 4, note: 'Dia produtivo' },
    { date: '2025-07-31', mood: 3, note: 'Normal' },
    { date: '2025-07-30', mood: 5, note: 'Excelente!' },
    { date: '2025-07-29', mood: 2, note: 'Um pouco baixo' },
  ]);
  const [reflections, setReflections] = useState([
    { date: '2025-08-01', title: 'Reflexão sobre produtividade', content: 'Hoje consegui completar todas as tarefas...' },
  ]);
  const [goals, setGoals] = useState([
    { id: 1, title: 'Meditar 10 min/dia', progress: 70, target: 30, current: 21 },
    { id: 2, title: 'Exercitar-se 3x/semana', progress: 50, target: 12, current: 6 },
  ]);

  const [newMood, setNewMood] = useState({ mood: 3, note: '' });
  const [newReflection, setNewReflection] = useState({ title: '', content: '' });
  const [newGoal, setNewGoal] = useState({ title: '', target: '' });

  const moodEmojis = ['😞', '😔', '😐', '😊', '😄'];
  const moodLabels = ['Muito baixo', 'Baixo', 'Neutro', 'Bom', 'Excelente'];

  const handleMoodSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    setMoods([{ date: today, mood: newMood.mood, note: newMood.note }, ...moods]);
    setNewMood({ mood: 3, note: '' });
    setActiveSection('main');
  };

  const handleReflectionSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    setReflections([{ date: today, title: newReflection.title, content: newReflection.content }, ...reflections]);
    setNewReflection({ title: '', content: '' });
    setActiveSection('main');
  };

  const handleGoalSubmit = () => {
    const newId = goals.length + 1;
    setGoals([...goals, { id: newId, title: newGoal.title, progress: 0, target: parseInt(newGoal.target), current: 0 }]);
    setNewGoal({ title: '', target: '' });
    setActiveSection('main');
  };

  const averageMood = moods.length > 0 ? (moods.reduce((sum, mood) => sum + mood.mood, 0) / moods.length).toFixed(1) : 0;

  if (activeSection === 'mood') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setActiveSection('main')}
              className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              ← Voltar
            </button>
            <h2 className="text-2xl font-bold text-gray-800">📊 Registrar Humor</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Como você está se sentindo hoje?</h3>
            
            <div className="grid grid-cols-5 gap-4 mb-6">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setNewMood({...newMood, mood: index + 1})}
                  className={`p-4 text-4xl rounded-lg border-2 transition-all ${
                    newMood.mood === index + 1 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {emoji}
                  <div className="text-xs text-gray-600 mt-2">{moodLabels[index]}</div>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adicione uma nota (opcional)
              </label>
              <textarea
                value={newMood.note}
                onChange={(e) => setNewMood({...newMood, note: e.target.value})}
                placeholder="Como foi seu dia? O que influenciou seu humor?"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24"
              />
            </div>

            <button
              onClick={handleMoodSubmit}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Salvar Registro
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'reflections') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setActiveSection('main')}
              className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              ← Voltar
            </button>
            <h2 className="text-2xl font-bold text-gray-800">💭 Nova Reflexão</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título da reflexão
              </label>
              <input
                type="text"
                value={newReflection.title}
                onChange={(e) => setNewReflection({...newReflection, title: e.target.value})}
                placeholder="Ex: Reflexão sobre o dia, Aprendizados..."
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suas reflexões
              </label>
              <textarea
                value={newReflection.content}
                onChange={(e) => setNewReflection({...newReflection, content: e.target.value})}
                placeholder="Escreva sobre seus pensamentos, sentimentos, aprendizados do dia..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32"
              />
            </div>

            <button
              onClick={handleReflectionSubmit}
              disabled={!newReflection.title || !newReflection.content}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400"
            >
              Salvar Reflexão
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Reflexões Anteriores</h3>
            {reflections.map((reflection, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{reflection.title}</h4>
                  <span className="text-sm text-gray-500">{reflection.date}</span>
                </div>
                <p className="text-gray-600 text-sm">{reflection.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'goals') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setActiveSection('main')}
              className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              ← Voltar
            </button>
            <h2 className="text-2xl font-bold text-gray-800">🎯 Metas de Bem-estar</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4">Criar Nova Meta</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição da meta
              </label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="Ex: Meditar todos os dias, Exercitar-se 3x por semana"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta numérica (dias/vezes)
              </label>
              <input
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                placeholder="30"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              onClick={handleGoalSubmit}
              disabled={!newGoal.title || !newGoal.target}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400"
            >
              Criar Meta
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Suas Metas</h3>
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                  <span className="text-sm text-gray-500">{goal.current}/{goal.target}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{width: `${goal.progress}%`}}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-2">{goal.progress}% concluído</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'reports') {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setActiveSection('main')}
              className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              ← Voltar
            </button>
            <h2 className="text-2xl font-bold text-gray-800">📈 Relatórios</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Estatísticas Gerais</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Humor médio:</span>
                  <span className="font-semibold">{averageMood}/5 {moodEmojis[Math.round(averageMood) - 1]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registros totais:</span>
                  <span className="font-semibold">{moods.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reflexões:</span>
                  <span className="font-semibold">{reflections.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Metas ativas:</span>
                  <span className="font-semibold">{goals.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Progresso das Metas</h3>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 truncate">{goal.title}</span>
                      <span className="font-semibold">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${goal.progress}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Histórico de Humor</h3>
            <div className="space-y-3">
              {moods.slice(0, 7).map((mood, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{moodEmojis[mood.mood - 1]}</span>
                    <div>
                      <div className="font-medium">{mood.date}</div>
                      <div className="text-sm text-gray-600">{mood.note}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {moodLabels[mood.mood - 1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => window.history.back()}
            className="mr-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            ← Voltar
          </button>
          <div className="flex items-center">
            <span className="text-3xl mr-3">🌟</span>
            <h1 className="text-3xl font-bold text-gray-800">Rastreador de Humor</h1>
          </div>
        </div>

        <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
          Monitore seu bem-estar emocional, registre reflexões e defina metas para uma vida mais equilibrada
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Monitoramento Diário</h3>
            <p className="text-gray-600 mb-4">Registre seu humor todos os dias e acompanhe padrões</p>
            <button 
              onClick={() => setActiveSection('mood')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Registrar Humor
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Relatórios</h3>
            <p className="text-gray-600 mb-4">Visualize seu progresso e estatísticas</p>
            <button 
              onClick={() => setActiveSection('reports')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Relatório
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">💭</div>
            <h3 className="text-xl font-semibold mb-2">Reflexões</h3>
            <p className="text-gray-600 mb-4">Escreva sobre seu dia e seus sentimentos</p>
            <button 
              onClick={() => setActiveSection('reflections')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Nova Reflexão
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Metas</h3>
            <p className="text-gray-600 mb-4">Defina objetivos de bem-estar e acompanhe o progresso</p>
            <button 
              onClick={() => setActiveSection('goals')}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Criar Meta
            </button>
          </div>
        </div>

        {moods.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Resumo Rápido</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{averageMood}</div>
                <div className="text-sm text-gray-600">Humor Médio</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{moods.length}</div>
                <div className="text-sm text-gray-600">Registros</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{reflections.length}</div>
                <div className="text-sm text-gray-600">Reflexões</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{goals.length}</div>
                <div className="text-sm text-gray-600">Metas</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}