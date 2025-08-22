'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameHeader } from '@/components/GameHeader';
import { LayoutGrid, Trophy, Gamepad2 } from 'lucide-react';

// Interfaces
interface Pattern {
  id: string;
  color: string;
  shape: string;
  active: boolean;
  touchedBy: string[];
}

interface Player {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

export default function PatternMatchCollaborativePage() {
  const router = useRouter();
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [targetPattern, setTargetPattern] = useState<Pattern[]>([]);
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayer, setActivePlayer] = useState('player1');
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [completedPatterns, setCompletedPatterns] = useState(0);
  const [gameTimer, setGameTimer] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Toda a sua lógica de jogo (initializePlayers, initializePatterns, handlePatternTouch, etc.)
  // foi 100% PRESERVADA. Eu a omiti aqui para a resposta não ficar gigantesca,
  // mas ela deve ser mantida no seu arquivo exatamente como estava.
  
  const initializePlayers = (count: number) => { /* ... sua lógica ... */ };
  useEffect(() => { initializePlayers(numberOfPlayers); }, [numberOfPlayers]);
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const shapes = ['circle', 'square', 'triangle', 'diamond', 'star', 'heart'];
  const initializePatterns = () => { /* ... sua lógica ... */ };
  useEffect(() => { /* ... sua lógica do timer ... */ }, [isTimerActive, gameTimer]);
  const handlePatternTouch = (patternId: string, playerId: string) => { /* ... sua lógica ... */ };
  const checkPatternCompletion = () => { /* ... sua lógica ... */ };
  useEffect(() => { if (gamePhase === 'playing') { initializePatterns(); } }, [currentLevel, gamePhase]);
  const sendMessage = () => { /* ... sua lógica ... */ };
  const resetLevel = () => { /* ... sua lógica ... */ };
  const renderShape = (color: string, shape: string, isActive: boolean) => { /* ... sua lógica ... */ };


  // Função de INICIAR o jogo foi mantida
  const startGame = () => {
    setGamePhase('playing');
    setIsTimerActive(true);
    initializePatterns();
    setChatMessages([]);
    const initialTime = numberOfPlayers === 1 ? 90 : 120;
    setGameTimer(initialTime);
    // ... resto da sua função
  };

  if (gamePhase === 'intro') {
    // TELA INICIAL PADRONIZADA
    return (
      <>
        <GameHeader
          title="Padrões Colaborativos"
          icon={<LayoutGrid className="h-6 w-6" />}
          showSaveButton={false}
        />
        <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Trophy className="h-5 w-5 mr-2 text-teal-600" /> Objetivo:</h3>
                  <p className="text-sm text-gray-600">Desenvolver concentração, reconhecimento de padrões e, no modo multi-jogador, aprimorar a coordenação e comunicação em equipe.</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 flex items-center"><Gamepad2 className="h-5 w-5 mr-2 text-blue-600" /> Como Jogar:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Escolha o modo: Individual ou Colaborativo.</li>
                    <li>Observe o "Padrão Alvo" à esquerda.</li>
                    <li>Clique nas células da "Área Colaborativa" para recriar o padrão.</li>
                    <li>Comuniquem-se pelo chat para coordenar as ações!</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">⭐ Regras:</h3>
                  <p className="text-sm text-gray-600">
                    <strong>1 Jogador:</strong> Clique para ativar/desativar a célula.
                    <strong>2 Jogadores:</strong> Ambos precisam tocar para ativar.
                    <strong>3 Jogadores:</strong> Pelo menos 2 precisam tocar.
                  </p>
                </div>
              </div>
            </div>

            {/* Bloco de Configuração de Jogadores (mantido do original) */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Selecione o Modo de Jogo</h2>
                <select
                  value={numberOfPlayers}
                  onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 Jogador (Individual)</option>
                  <option value={2}>2 Jogadores (Colaborativo)</option>
                  <option value={3}>3 Jogadores (Colaborativo)</option>
                </select>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={startGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg"
              >
                🚀 Iniciar Desafio
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (gamePhase === 'completed') {
    // TELA DE CONCLUSÃO (mantida a sua, que é ótima)
    return (
      <>
        <GameHeader
          title="Padrões Colaborativos"
          icon={<LayoutGrid className="h-6 w-6" />}
        />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Parabéns, Equipe!</h2>
            <p className="text-gray-600 mb-6">Vocês completaram todos os níveis trabalhando em perfeita coordenação!</p>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg mb-6">
              <p className="text-lg font-semibold">Pontuação Final: {score} pontos</p>
              <p className="text-sm">Padrões Completados: {completedPatterns}</p>
            </div>
            {/* O GameHeader já tem o botão de voltar, mas podemos adicionar um botão de jogar novamente */}
            <button
                onClick={() => setGamePhase('intro')}
                className="w-full mt-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg">
                🔄 Jogar Novamente
            </button>
          </div>
        </div>
      </>
    );
  }

  // TELA DO JOGO (lógica e layout principal preservados)
  const gridSize = numberOfPlayers === 1 ? Math.min(3 + currentLevel, 5) : Math.min(2 + currentLevel, 4);
  const gridCols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5' };

  return (
    <>
      <GameHeader
        title={`Padrões Colaborativos - Nível ${currentLevel}`}
        icon={<LayoutGrid className="h-6 w-6" />}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* O seu layout de jogo com 3 colunas foi preservado aqui */}
          {/* ... (todo o seu JSX da tela 'playing') ... */}
        </main>
      </div>
    </>
  );
}
