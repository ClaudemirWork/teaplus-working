'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

export default function FacialExpressionsGame() {
  const router = useRouter();
  const supabase = createClient();
  
  const [pontuacao, setPontuacao] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [atividadeIniciada, setAtividadeIniciada] = useState(false);
  const [atividadeConcluida, setAtividadeConcluida] = useState(false);
  const [emocaoAtual, setEmocaoAtual] = useState('');
  const [emocaoPergunta, setEmocaoPergunta] = useState('');
  const [salvando, setSalvando] = useState(false);
  
  // Métricas
  const [tempoInicio, setTempoInicio] = useState<Date | null>(null);
  const [tentativas, setTentativas] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [temposResposta, setTemposResposta] = useState<number[]>([]);
  const [tempoPerguntaAtual, setTempoPerguntaAtual] = useState<Date | null>(null);
  
  const emocoes: { [key: number]: string[] } = {
    1: ['😊', '😢', '😮'], // Básico
    2: ['😊', '😢', '😮', '😠', '😨'], // Intermediário
    3: ['😊', '😢', '😮', '😠', '😨', '😐', '🤢', '🤔'] // Avançado
  };

  const nomesEmocoes: { [key: string]: string } = {
    '😊': 'Feliz', '😢': 'Triste', '😮': 'Surpreso', '😠': 'Bravo',
    '😨': 'Com Medo', '😐': 'Neutro', '🤢': 'Com Nojo', '🤔': 'Pensativo'
  };

  useEffect(() => {
    if (atividadeIniciada && !atividadeConcluida) {
      gerarPergunta();
    }
  }, [nivel, atividadeIniciada]);

  useEffect(() => {
    if (nivel === 3 && pontuacao >= 50) {
      finalizarAtividade();
    }
  }, [pontuacao]);

  const iniciarAtividade = () => {
    setAtividadeIniciada(true);
    setAtividadeConcluida(false);
    setPontuacao(0);
    setNivel(1);
    setAcertos(0);
    setErros(0);
    setTentativas(0);
    setTemposResposta([]);
    setTempoInicio(new Date());
  };

  const gerarPergunta = () => {
    const emocoesNivel = emocoes[nivel];
    const emocaoAleatoria = emocoesNivel[Math.floor(Math.random() * emocoesNivel.length)];
    setEmocaoAtual(emocaoAleatoria);
    setEmocaoPergunta(nomesEmocoes[emocaoAleatoria]);
    setTempoPerguntaAtual(new Date());
  };

  const verificarResposta = (emocaoSelecionada: string) => {
    if (atividadeConcluida) return;
    
    if (tempoPerguntaAtual) {
      const tempoResposta = (new Date().getTime() - tempoPerguntaAtual.getTime()) / 1000;
      setTemposResposta(prev => [...prev, tempoResposta]);
    }
    
    setTentativas(prev => prev + 1);
    
    if (emocaoSelecionada === emocaoAtual) {
      setAcertos(prev => prev + 1);
      const novaPontuacao = pontuacao + 10;
      setPontuacao(novaPontuacao);

      if (novaPontuacao >= 50 && nivel < 3) {
        setNivel(prev => prev + 1);
        setPontuacao(0);
      } else if (novaPontuacao < 50 || nivel < 3) {
        gerarPergunta();
      }
    } else {
      setErros(prev => prev + 1);
      setTimeout(() => gerarPergunta(), 1000);
    }
  };

  const finalizarAtividade = () => {
    setAtividadeConcluida(true);
  };

  const getNomeNivel = (level = nivel) => {
    const nomes: { [key: number]: string } = { 1: 'Básico', 2: 'Intermediário', 3: 'Avançado' };
    return nomes[level];
  };

  const handleSaveSession = async () => {
    if (!atividadeConcluida) {
      alert('Complete a atividade antes de salvar.');
      return;
    }
    
    setSalvando(true);
    
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
          atividade_nome: 'Expressões Faciais',
          pontuacao_final: (acertos * 10) + (nivel * 30),
          data_fim: new Date().toISOString(),
          metricas: {
            taxaAcerto: tentativas > 0 ? (acertos / tentativas * 100) : 0,
            tempoTotal: tempoInicio ? Math.floor((new Date().getTime() - tempoInicio.getTime()) / 1000) : 0,
            nivelAlcancado: nivel,
            totalTentativas: tentativas,
          }
        }]);

      if (error) throw error;

      alert(`Sessão salva com sucesso!`);
      router.push('/dashboard');
    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  const GameHeader = () => (
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
            😊 Expressões Faciais
          </h1>
          <button
            onClick={handleSaveSession}
            disabled={salvando || !atividadeConcluida}
            className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${
              atividadeConcluida 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save size={18} />
            <span className="hidden sm:inline">{salvando ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <GameHeader />
      <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {/* Cards de Instruções e Progresso */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Cards de info aqui */}
          </div>
          {atividadeIniciada && !atividadeConcluida && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso do Nível {nivel} ({getNomeNivel()})</span>
                <span>{pontuacao}/50 pontos</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-500 rounded-full"
                  style={{ width: `${(pontuacao / 50) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Área do Jogo */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="min-h-[400px] flex items-center justify-center">
            {!atividadeIniciada ? (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Reconhecimento de Expressões Faciais</h3>
                <button 
                  onClick={iniciarAtividade}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl text-lg"
                >
                  🎮 Iniciar Atividade
                </button>
              </div>
            ) : atividadeConcluida ? (
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600 mb-4">🎉 Parabéns! Atividade Concluída!</h3>
                <button 
                  onClick={iniciarAtividade}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg"
                >
                  🔄 Jogar Novamente
                </button>
              </div>
            ) : (
              <div className="text-center w-full">
                <div className="bg-purple-50 p-6 rounded-lg mb-6 border border-purple-200">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Clique na face que está:</h3>
                  <p className="text-3xl font-bold text-purple-600">{emocaoPergunta}</p>
                </div>
                <div className={`grid gap-4 ${
                  nivel === 1 ? 'grid-cols-3' : 
                  nivel === 2 ? 'grid-cols-3 sm:grid-cols-5' : 
                  'grid-cols-2 sm:grid-cols-4'
                }`}>
                  {emocoes[nivel].map((emocao, index) => (
                    <button
                      key={index}
                      onClick={() => verificarResposta(emocao)}
                      className="text-6xl p-4 bg-gray-50 rounded-lg hover:bg-purple-100 transition-transform transform hover:scale-110"
                    >
                      {emocao}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
