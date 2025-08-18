'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient'; // IMPORT CORRETO

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
  
  // Métricas para salvar
  const [tempoInicio, setTempoInicio] = useState<Date | null>(null);
  const [tentativas, setTentativas] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [historicoRespostas, setHistoricoRespostas] = useState<any[]>([]);
  const [temposResposta, setTemposResposta] = useState<number[]>([]);
  const [tempoPerguntaAtual, setTempoPerguntaAtual] = useState<Date | null>(null);
  
  // Emoções baseadas em pesquisa científica (NEPSY-II e estudos TEA)
  const emocoes: { [key: number]: string[] } = {
    1: ['😊', '😢', '😮'], // Básico: feliz, triste, surpreso
    2: ['😊', '😢', '😮', '😠', '😨'], // Intermediário: + bravo, medo
    3: ['😊', '😢', '😮', '😠', '😨', '😐', '🤢', '🤔'] // Avançado: + neutro, nojo, pensativo
  };

  const nomesEmocoes: { [key: string]: string } = {
    '😊': 'Feliz',
    '😢': 'Triste', 
    '😮': 'Surpreso',
    '😠': 'Bravo',
    '😨': 'Com Medo',
    '😐': 'Neutro',
    '🤢': 'Com Nojo',
    '🤔': 'Pensativo'
  };

  // Atualizar pergunta quando nível muda
  useEffect(() => {
    if (atividadeIniciada && !atividadeConcluida) {
      gerarPergunta();
    }
  }, [nivel]);

  // Verificar se atividade foi concluída
  useEffect(() => {
    if (nivel === 3 && pontuacao >= 50) {
      finalizarAtividade();
    }
  }, [nivel, pontuacao]);

  const iniciarAtividade = () => {
    setAtividadeIniciada(true);
    setAtividadeConcluida(false);
    setPontuacao(0);
    setNivel(1);
    setAcertos(0);
    setErros(0);
    setTentativas(0);
    setHistoricoRespostas([]);
    setTemposResposta([]);
    setTempoInicio(new Date());
    gerarPergunta();
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
    
    // Calcular tempo de resposta
    if (tempoPerguntaAtual) {
      const tempoResposta = (new Date().getTime() - tempoPerguntaAtual.getTime()) / 1000;
      setTemposResposta(prev => [...prev, tempoResposta]);
    }
    
    setTentativas(prev => prev + 1);
    
    const resposta = {
      nivel,
      emocaoPergunta: emocaoPergunta,
      emocaoSelecionada: nomesEmocoes[emocaoSelecionada],
      correto: emocaoSelecionada === emocaoAtual,
      timestamp: new Date()
    };
    
    setHistoricoRespostas(prev => [...prev, resposta]);
    
    if (emocaoSelecionada === emocaoAtual) {
      setAcertos(prev => prev + 1);
      
      if (pontuacao >= 40 && nivel < 3) {
        // Avançar de nível
        setPontuacao(0);
        setNivel(prev => prev + 1);
      } else if (pontuacao < 50) {
        const novaPontuacao = pontuacao + 10;
        setPontuacao(novaPontuacao);
        
        if (novaPontuacao < 50 || nivel < 3) {
          gerarPergunta();
        }
      }
    } else {
      setErros(prev => prev + 1);
      // Gerar nova pergunta mesmo com erro
      setTimeout(() => gerarPergunta(), 1000);
    }
  };

  const finalizarAtividade = () => {
    setAtividadeConcluida(true);
  };

  const getNomeNivel = () => {
    const nomes: { [key: number]: string } = { 1: 'Básico', 2: 'Intermediário', 3: 'Avançado' };
    return nomes[nivel];
  };

  const getProgressoPorcentagem = () => {
    return Math.min((pontuacao / 50) * 100, 100);
  };

  const calcularMetricas = () => {
    const tempoTotal = tempoInicio ? 
      Math.floor((new Date().getTime() - tempoInicio.getTime()) / 1000) : 0;
    
    const tempoMedioResposta = temposResposta.length > 0 ?
      temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length : 0;
    
    const taxaAcerto = tentativas > 0 ? (acertos / tentativas * 100) : 0;
    
    return {
      tempoTotal,
      tempoMedioResposta,
      taxaAcerto,
      nivelMaximo: nivel,
      pontuacaoFinal: pontuacao,
      totalTentativas: tentativas,
      totalAcertos: acertos,
      totalErros: erros
    };
  };

  // FUNÇÃO DE SALVAMENTO - IDÊNTICA AO CAA/EYE-CONTACT
  const handleSaveSession = async () => {
    if (!atividadeConcluida) {
      alert('Complete a atividade antes de salvar.');
      return;
    }
    
    setSalvando(true);
    
    try {
      // Obter o usuário atual - EXATAMENTE COMO NO CAA
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Erro ao obter usuário:', userError);
        alert('Erro: Sessão expirada. Por favor, faça login novamente.');
        router.push('/login');
        return;
      }
      
      const metricas = calcularMetricas();
      
      // Salvar na tabela sessoes - MESMA TABELA DO CAA
      const { data, error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Expressões Faciais',
          pontuacao_final: (acertos * 10) + (nivel * 30),
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!
        
📊 Resumo:
• Taxa de Acerto: ${metricas.taxaAcerto.toFixed(1)}%
• Tempo Total: ${metricas.tempoTotal}s
• Nível Alcançado: ${nivel} (${getNomeNivel()})
• Total de Tentativas: ${tentativas}`);
        
        router.push('/tea');
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error);
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* HEADER IDÊNTICO AO CAA/EYE-CONTACT */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
          >
            <ChevronLeft size={20} />
            <span className="text-sm sm:text-base">Voltar</span>
          </Link>
          
          {/* BOTÃO SALVAR - CLASSES IDÊNTICAS AO EYE-CONTACT */}
          <button
            onClick={handleSaveSession}
            disabled={salvando || !atividadeConcluida}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors ${
              atividadeConcluida 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            <Save size={20} />
            <span>{salvando ? 'Salvando...' : 'Finalizar e Salvar'}</span>
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        
        {/* Título */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            😊 Expressões Faciais
          </h1>
        </div>
        
        {/* Cards de Instruções - PADRÃO CAA */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">🎯 Objetivo:</h3>
            <p className="text-gray-600 text-sm">
              Identifique corretamente as expressões faciais apresentadas
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">📊 Níveis:</h3>
            <p className="text-gray-600 text-sm">
              3 níveis progressivos com emoções básicas e complexas
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">🏆 Pontuação:</h3>
            <p className="text-gray-600 text-sm">
              10 pontos por acerto. 50 pontos para avançar de nível
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">📚 Base Científica:</h3>
            <p className="text-gray-600 text-sm">
              Baseado em NEPSY-II e ADOS-2 para avaliação TEA
            </p>
          </div>
        </div>

        {/* Progresso da Sessão - PADRÃO CAA */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            📊 Progresso da Sessão
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{nivel}</div>
              <div className="text-sm text-gray-600">Nível Atual</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{acertos}</div>
              <div className="text-sm text-gray-600">Acertos</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {tentativas > 0 ? (acertos/tentativas*100).toFixed(0) : 0}%
              </div>
              <div className="text-sm text-gray-600">Taxa de Acerto</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{erros}</div>
              <div className="text-sm text-gray-600">Erros</div>
            </div>
          </div>
          
          {/* Barra de Progresso */}
          {atividadeIniciada && !atividadeConcluida && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso do Nível {nivel}</span>
                <span>{pontuacao}/50 pontos</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-500"
                  style={{ width: `${getProgressoPorcentagem()}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Área do Jogo */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="relative min-h-[400px] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center">
            
            {!atividadeIniciada ? (
              <div className="text-center">
                <div className="text-6xl mb-6">😊</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Reconhecimento de Expressões Faciais
                </h3>
                <p className="text-gray-600 mb-6">
                  Pratique identificar diferentes emoções através de expressões faciais
                </p>
                <button 
                  onClick={iniciarAtividade}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 text-lg"
                >
                  🎮 Iniciar Atividade
                </button>
              </div>
            ) : atividadeConcluida ? (
              <div className="text-center">
                <div className="text-6xl mb-6">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">
                  Parabéns! Atividade Concluída!
                </h3>
                <div className="bg-green-50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">📊 Resultados:</h4>
                  <div className="text-left space-y-2">
                    <p className="text-gray-700">✅ Taxa de Acerto: {(acertos/tentativas*100).toFixed(1)}%</p>
                    <p className="text-gray-700">⏱️ Tempo Total: {Math.floor((new Date().getTime() - (tempoInicio?.getTime() || 0)) / 1000)}s</p>
                    <p className="text-gray-700">🎯 Nível Alcançado: {nivel} ({getNomeNivel()})</p>
                    <p className="text-gray-700">📈 Tentativas: {tentativas}</p>
                  </div>
                </div>
                <button 
                  onClick={iniciarAtividade}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔄 Jogar Novamente
                </button>
              </div>
            ) : (
              <div className="text-center w-full max-w-2xl">
                {/* Pergunta */}
                <div className="bg-purple-50 p-6 rounded-lg mb-6 border border-purple-200">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    Clique na face que está:
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">{emocaoPergunta}</p>
                </div>

                {/* Opções de Resposta */}
                <div className={`grid gap-4 mb-6 ${
                  nivel === 1 ? 'grid-cols-3' : 
                  nivel === 2 ? 'grid-cols-3 sm:grid-cols-5' : 
                  'grid-cols-2 sm:grid-cols-4'
                }`}>
                  {emocoes[nivel].map((emocao, index) => (
                    <button
                      key={index}
                      onClick={() => verificarResposta(emocao)}
                      className="text-6xl p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-all duration-200 border-2 hover:border-purple-300 min-h-[80px]"
                    >
                      {emocao}
                    </button>
                  ))}
                </div>

                {/* Informações da Sessão */}
                <div className="bg-blue-50 p-4 rounded-lg max-w-sm mx-auto">
                  <p className="text-sm text-blue-800">
                    🎯 Acertos: {acertos} | ❌ Erros: {erros} | 📊 Taxa: {tentativas > 0 ? (acertos/tentativas*100).toFixed(0) : 0}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informações Científicas */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-2">📚 Fundamentação Científica</h3>
          <p className="text-gray-600 text-sm">
            Esta atividade é baseada nos protocolos NEPSY-II (Affect Recognition) e ADOS-2, 
            instrumentos validados para avaliação de reconhecimento de expressões faciais em TEA. 
            As 7 emoções básicas utilizadas são cientificamente validadas para avaliação do 
            processamento emocional em indivíduos no espectro autista.
          </p>
        </div>
      </main>
    </div>
  );
}
