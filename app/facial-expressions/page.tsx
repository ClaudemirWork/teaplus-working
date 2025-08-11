'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

export default function FacialExpressionsGame() {
  const [pontuacao, setPontuacao] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [atividadeIniciada, setAtividadeIniciada] = useState(false);
  const [atividadeConcluida, setAtividadeConcluida] = useState(false);
  const [emocaoAtual, setEmocaoAtual] = useState('');
  const [emocaoPergunta, setEmocaoPergunta] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [salvamentoConfirmado, setSalvamentoConfirmado] = useState(false);
  const [erroSalvamento, setErroSalvamento] = useState('');
  
  // Métricas para salvar
  const [tempoInicio, setTempoInicio] = useState<Date | null>(null);
  const [tentativas, setTentativas] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [historicoRespostas, setHistoricoRespostas] = useState<any[]>([]);
  const [temposResposta, setTemposResposta] = useState<number[]>([]);
  const [tempoPerguntaAtual, setTempoPerguntaAtual] = useState<Date | null>(null);
  
  const router = useRouter();
  
  // Inicializar Supabase - mesmo padrão do CAA/eye-contact
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Emoções baseadas em pesquisa científica (NEPSY-II e estudos TEA)
  const emocoes = {
    1: ['😊', '😢', '😮'], // Básico: feliz, triste, surpreso
    2: ['😊', '😢', '😮', '😠', '😨'], // Intermediário: + bravo, medo
    3: ['😊', '😢', '😮', '😠', '😨', '😐', '🤢', '🤔'] // Avançado: + neutro, nojo, pensativo
  };

  const nomesEmocoes = {
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
    setSalvamentoConfirmado(false);
    setErroSalvamento('');
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
        const novaPontuacao = 0;
        const novoNivel = nivel + 1;
        setPontuacao(novaPontuacao);
        setNivel(novoNivel);
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
    const nomes = { 1: 'Básico', 2: 'Intermediário', 3: 'Avançado' };
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
    
    // Análise por emoção
    const acertosPorEmocao: Record<string, { acertos: number; tentativas: number }> = {};
    historicoRespostas.forEach(resp => {
      if (!acertosPorEmocao[resp.emocaoPergunta]) {
        acertosPorEmocao[resp.emocaoPergunta] = { acertos: 0, tentativas: 0 };
      }
      acertosPorEmocao[resp.emocaoPergunta].tentativas++;
      if (resp.correto) {
        acertosPorEmocao[resp.emocaoPergunta].acertos++;
      }
    });
    
    return {
      tempoTotal,
      tempoMedioResposta,
      taxaAcerto,
      nivelMaximo: nivel,
      pontuacaoFinal: pontuacao,
      totalTentativas: tentativas,
      totalAcertos: acertos,
      totalErros: erros,
      acertosPorEmocao,
      atividadeCompleta: atividadeConcluida
    };
  };

  const handleSaveSession = async () => {
    if (!atividadeConcluida || salvando) return;
    
    setSalvando(true);
    setErroSalvamento('');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const metricas = calcularMetricas();
      
      const { error } = await supabase
        .from('tea_activities')
        .insert({
          user_id: user.id,
          activity_type: 'facial_expressions',
          metrics: {
            ...metricas,
            detalhesRespostas: historicoRespostas,
            temposIndividuais: temposResposta,
            timestamp: new Date().toISOString()
          },
          completed_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setSalvamentoConfirmado(true);
      
      setTimeout(() => {
        router.push('/tea');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setErroSalvamento('Erro ao salvar atividade. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header Padrão - SEMPRE VISÍVEL */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <a 
              href="/tea" 
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors min-h-[44px] px-2 -ml-2"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-sm sm:text-base font-medium">Voltar</span>
            </a>
            
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4">
              😊 Expressões Faciais
            </h1>
            
            {/* BOTÃO SALVAR - SEMPRE VISÍVEL */}
            <button
              onClick={handleSaveSession}
              disabled={salvando || !atividadeConcluida}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all min-h-[44px] ${
                atividadeConcluida && !salvando
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {salvando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Salvando...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">💾</span>
                  <span className="text-sm">Finalizar e Salvar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mensagens de Feedback */}
      {salvamentoConfirmado && (
        <div className="fixed top-20 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center">
            <span className="text-xl mr-2">✅</span>
            <div>
              <p className="font-semibold">Atividade salva com sucesso!</p>
              <p className="text-sm">Redirecionando para TEA...</p>
            </div>
          </div>
        </div>
      )}

      {erroSalvamento && (
        <div className="fixed top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <span className="text-xl mr-2">❌</span>
            <p>{erroSalvamento}</p>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Cards de Instruções */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">🎯 Objetivo:</h3>
            <p className="text-red-700 text-sm sm:text-base">
              Identifique corretamente as expressões faciais apresentadas
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">📊 Níveis:</h3>
            <p className="text-blue-700 text-sm sm:text-base">
              3 níveis progressivos com emoções básicas e complexas
            </p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
            <h3 className="text-base sm:text-lg font-semibold text-purple-800 mb-2">🏆 Pontuação:</h3>
            <p className="text-purple-700 text-sm sm:text-base">
              10 pontos por acerto. 50 pontos para avançar de nível
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2">📚 Base Científica:</h3>
            <p className="text-green-700 text-sm sm:text-base">
              Baseado em NEPSY-II e ADOS-2 para avaliação TEA
            </p>
          </div>
        </div>

        {/* Área do Jogo */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
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
                  className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors min-h-[48px]"
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
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
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

                {/* Status do Jogo */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4 max-w-sm mx-auto">
                  <p className="text-lg font-semibold text-gray-800">
                    Nível: {nivel} ({getNomeNivel()})
                  </p>
                  <p className="text-lg text-gray-700">Pontuação: {pontuacao}/50</p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3 overflow-hidden">
                    <div 
                      className="bg-purple-600 h-3 rounded-full transition-all duration-500" 
                      style={{width: `${getProgressoPorcentagem()}%`}}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {getProgressoPorcentagem().toFixed(0)}%
                  </div>
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
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">📚 Fundamentação Científica</h3>
          <p className="text-gray-600 text-sm">
            Esta atividade é baseada nos protocolos NEPSY-II (Affect Recognition) e ADOS-2, 
            instrumentos validados para avaliação de reconhecimento de expressões faciais em TEA. 
            As 7 emoções básicas utilizadas são cientificamente validadas para avaliação do 
            processamento emocional em indivíduos no espectro autista.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
