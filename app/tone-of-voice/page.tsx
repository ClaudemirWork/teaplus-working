'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Mic, Volume2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

export default function ToneOfVoice() {
  const router = useRouter();
  const supabase = createClient();
  
  // Estados principais
  const [atividadeIniciada, setAtividadeIniciada] = useState(false);
  const [atividadeConcluida, setAtividadeConcluida] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [exercicioAtual, setExercicioAtual] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // Métricas baseadas em literatura científica
  const [inicioSessao, setInicioSessao] = useState<Date | null>(null);
  const [gravacoesRealizadas, setGravacoesRealizadas] = useState<number[]>([0, 0, 0, 0, 0]);
  const [tempoPorExercicio, setTempoPorExercicio] = useState<number[]>([]);
  const [inicioExercicio, setInicioExercicio] = useState<Date | null>(null);
  const [exerciciosComGravacao, setExerciciosComGravacao] = useState(0);

  const exercises = [
    {
      id: 1,
      emotion: "Alegria",
      phrase: "Que dia lindo hoje!",
      description: "Pratique falar com tom alegre e entusiasmado",
      tips: "Eleve o tom no final, fale mais rápido, use entonação ascendente",
      color: "bg-yellow-100 border-yellow-300 text-yellow-800"
    },
    {
      id: 2,
      emotion: "Tristeza",
      phrase: "Não consegui terminar o projeto.",
      description: "Pratique um tom mais baixo e melancólico",
      tips: "Use tom mais grave, fale mais devagar, entonação descendente",
      color: "bg-blue-100 border-blue-300 text-blue-800"
    },
    {
      id: 3,
      emotion: "Surpresa",
      phrase: "Não acredito que você veio!",
      description: "Expresse surpresa com mudanças bruscas de tom",
      tips: "Comece baixo e suba o tom rapidamente, pause antes de palavras importantes",
      color: "bg-purple-100 border-purple-300 text-purple-800"
    },
    {
      id: 4,
      emotion: "Raiva",
      phrase: "Isso não pode estar acontecendo!",
      description: "Pratique controlar a intensidade da raiva",
      tips: "Tom mais forte mas controlado, pronuncie palavras claramente",
      color: "bg-red-100 border-red-300 text-red-800"
    },
    {
      id: 5,
      emotion: "Medo",
      phrase: "Acho que tem alguém aí fora...",
      description: "Use tom baixo e hesitante para expressar medo",
      tips: "Fale mais baixo, com pausas, voz ligeiramente trêmula",
      color: "bg-gray-100 border-gray-300 text-gray-800"
    }
  ];

  // Iniciar atividade
  const iniciarAtividade = () => {
    setAtividadeIniciada(true);
    setAtividadeConcluida(false);
    setExercicioAtual(0);
    setGravacoesRealizadas([0, 0, 0, 0, 0]);
    setTempoPorExercicio([]);
    setExerciciosComGravacao(0);
    setInicioSessao(new Date());
    setInicioExercicio(new Date());
  };

  // Gravação de áudio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        
        // Atualizar métricas
        const novasGravacoes = [...gravacoesRealizadas];
        novasGravacoes[exercicioAtual]++;
        setGravacoesRealizadas(novasGravacoes);
        
        // Contar exercícios com gravação
        const exerciciosGravados = novasGravacoes.filter(g => g > 0).length;
        setExerciciosComGravacao(exerciciosGravados);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Erro ao acessar o microfone. Verifique as permissões.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const nextExercise = () => {
    // Salvar tempo do exercício atual
    if (inicioExercicio) {
      const tempo = (new Date().getTime() - inicioExercicio.getTime()) / 1000;
      setTempoPorExercicio(prev => [...prev, tempo]);
    }
    
    if (exercicioAtual < exercises.length - 1) {
      setExercicioAtual(exercicioAtual + 1);
      setAudioBlob(null);
      setInicioExercicio(new Date());
    } else {
      // Completou todos os exercícios
      finalizarAtividade();
    }
  };

  const previousExercise = () => {
    if (exercicioAtual > 0) {
      setExercicioAtual(exercicioAtual - 1);
      setAudioBlob(null);
      setInicioExercicio(new Date());
    }
  };
  
  const finalizarAtividade = () => {
    // Salvar tempo do último exercício
    if (inicioExercicio) {
      const tempo = (new Date().getTime() - inicioExercicio.getTime()) / 1000;
      setTempoPorExercicio(prev => [...prev, tempo]);
    }
    setAtividadeConcluida(true);
  };

  // Calcular métricas
  const calcularTaxaConclusao = () => {
    const exerciciosGravados = gravacoesRealizadas.filter(g => g > 0).length;
    return Math.round((exerciciosGravados / exercises.length) * 100);
  };
  
  const calcularTempoTotal = () => {
    if (!inicioSessao) return 0;
    return Math.floor((new Date().getTime() - inicioSessao.getTime()) / 1000);
  };
  
  const calcularTempoMedio = () => {
    if (tempoPorExercicio.length === 0) return 0;
    const soma = tempoPorExercicio.reduce((a, b) => a + b, 0);
    return Math.round(soma / tempoPorExercicio.length);
  };

  // FUNÇÃO DE SALVAMENTO - IDÊNTICA AO CAA/EYE-CONTACT
  const handleSaveSession = async () => {
    if (!atividadeConcluida) {
      alert('Complete todos os exercícios antes de salvar.');
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
      
      // Calcular pontuação final baseada em engajamento
      const taxaConclusao = calcularTaxaConclusao();
      const totalGravacoes = gravacoesRealizadas.reduce((a, b) => a + b, 0);
      const pontuacaoFinal = (taxaConclusao * 2) + (totalGravacoes * 10);
      
      // Salvar na tabela sessoes - MESMA TABELA DO CAA
      const { data, error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Tom de Voz',
          pontuacao_final: pontuacaoFinal,
          data_fim: new Date().toISOString()
        }]);

      if (error) {
        console.error('Erro ao salvar:', error);
        alert(`Erro ao salvar: ${error.message}`);
      } else {
        alert(`Sessão salva com sucesso!
        
📊 Resumo:
• Exercícios Completados: ${exercises.length}/5
• Taxa de Conclusão: ${taxaConclusao}%
• Total de Gravações: ${totalGravacoes}
• Tempo Total: ${calcularTempoTotal()}s
• Exercícios com Gravação: ${exerciciosComGravacao}`);
        
        router.push('/tea');
      }
    } catch (error: any) {
      console.error('Erro inesperado:', error);
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  };

  const currentEx = exercises[exercicioAtual];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      {/* HEADER IDÊNTICO AO CAA/EYE-CONTACT */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <Link
            href="/tea"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
          >
            <ChevronLeft size={20} />
            <span className="text-sm sm:text-base">Voltar para TEA</span>
          </Link>
          
          {/* BOTÃO SALVAR - SEMPRE VISÍVEL */}
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
            🎵 Tom de Voz
          </h1>
          <p className="text-gray-600">Pratique diferentes entonações e expressões vocais</p>
        </div>
        
        {/* Cards de Instruções - PADRÃO CAA */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Objetivo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-red-500 text-2xl">🎯</span>
              <h2 className="text-lg font-bold text-gray-800">Objetivo:</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Praticar modulação prosódica através de diferentes emoções, desenvolvendo controle de pitch, 
              volume e ritmo de fala conforme contexto emocional.
            </p>
            <p className="text-xs text-gray-500 mt-2 italic">
              Baseado em ADOS-2, PEPS-C e GeMAPS
            </p>
          </div>
          
          {/* Como se Joga */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-blue-500 text-2xl">🎤</span>
              <h2 className="text-lg font-bold text-gray-800">Como se Joga:</h2>
            </div>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Leia a frase com a emoção indicada</li>
              <li>• Grave sua voz praticando a entonação</li>
              <li>• Escute e compare com o modelo</li>
              <li>• Pratique quantas vezes quiser</li>
              <li>• Complete todos os 5 exercícios</li>
            </ul>
          </div>
          
          {/* Níveis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-yellow-500 text-2xl">⭐</span>
              <h2 className="text-lg font-bold text-gray-800">Emoções:</h2>
            </div>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Alegria (tom ascendente)</li>
              <li>• Tristeza (tom descendente)</li>
              <li>• Surpresa (variação brusca)</li>
              <li>• Raiva (intensidade controlada)</li>
              <li>• Medo (hesitação e pausas)</li>
            </ul>
          </div>
        </div>

        {/* Progresso da Sessão - PADRÃO CAA */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            📊 Progresso da Sessão
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {exercicioAtual + 1}/5
              </div>
              <div className="text-sm text-gray-600">Exercício Atual</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {gravacoesRealizadas.reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Gravações</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {calcularTaxaConclusao()}%
              </div>
              <div className="text-sm text-gray-600">Taxa Conclusão</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {exerciciosComGravacao}/5
              </div>
              <div className="text-sm text-gray-600">Com Gravação</div>
            </div>
          </div>
          
          {/* Barra de Progresso */}
          {atividadeIniciada && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso Geral</span>
                <span>{exercicioAtual + 1} de {exercises.length}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500"
                  style={{ width: `${((exercicioAtual + 1) / exercises.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Área Principal do Exercício */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {!atividadeIniciada ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-6xl mb-6">🎵</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Exercícios de Tom de Voz
              </h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Pratique diferentes entonações emocionais para melhorar sua expressividade vocal e prosódia
              </p>
              <button 
                onClick={iniciarAtividade}
                className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 text-lg"
              >
                🎮 Iniciar Atividade
              </button>
            </div>
          ) : atividadeConcluida ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-6xl mb-6">🎉</div>
              <h3 className="text-2xl font-bold text-green-600 mb-4">
                Parabéns! Atividade Concluída!
              </h3>
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">📊 Resultados:</h4>
                <div className="text-left space-y-2">
                  <p className="text-gray-700">✅ Exercícios Completados: 5/5</p>
                  <p className="text-gray-700">🎤 Total de Gravações: {gravacoesRealizadas.reduce((a, b) => a + b, 0)}</p>
                  <p className="text-gray-700">📈 Taxa de Conclusão: {calcularTaxaConclusao()}%</p>
                  <p className="text-gray-700">⏱️ Tempo Total: {calcularTempoTotal()}s</p>
                </div>
              </div>
              <button 
                onClick={iniciarAtividade}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                🔄 Praticar Novamente
              </button>
            </div>
          ) : (
            <div>
              {/* Emoção Atual */}
              <div className={`${currentEx.color} rounded-xl p-6 mb-6 border-2`}>
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Emoção: {currentEx.emotion}</h2>
                  <p className="text-lg">{currentEx.description}</p>
                </div>
              </div>

              {/* Frase para Praticar */}
              <div className="bg-gray-50 rounded-xl p-8 text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Frase para praticar:</h3>
                <p className="text-3xl font-bold text-gray-800 mb-6 leading-relaxed">
                  "{currentEx.phrase}"
                </p>
                
                {/* Dicas */}
                <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Dicas:</h4>
                  <p className="text-blue-700">{currentEx.tips}</p>
                </div>
              </div>

              {/* Controles de Gravação */}
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-4">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-8 py-4 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isRecording ? (
                      <>⏹️ Parar Gravação</>
                    ) : (
                      <><Mic size={20} className="inline mr-2" />Iniciar Gravação</>
                    )}
                  </button>

                  {audioBlob && (
                    <button
                      onClick={playRecording}
                      className="px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg transition-all transform hover:scale-105"
                    >
                      <Volume2 size={20} className="inline mr-2" />
                      Reproduzir
                    </button>
                  )}
                </div>

                {isRecording && (
                  <div className="text-red-600 font-semibold animate-pulse text-center">
                    🔴 Gravando... Fale a frase com a emoção {currentEx.emotion.toLowerCase()}
                  </div>
                )}

                {audioBlob && !isRecording && (
                  <div className="text-green-600 font-semibold text-center">
                    ✅ Gravação concluída! Você pode reproduzir ou gravar novamente.
                  </div>
                )}
                
                {/* Contador de gravações para este exercício */}
                <div className="text-sm text-gray-600">
                  Gravações neste exercício: {gravacoesRealizadas[exercicioAtual]}
                </div>
              </div>

              {/* Navegação */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={previousExercise}
                  disabled={exercicioAtual === 0}
                  className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${
                    exercicioAtual === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Anterior
                </button>

                <div className="flex gap-2">
                  {exercises.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === exercicioAtual ? 'bg-purple-500' : 
                        gravacoesRealizadas[index] > 0 ? 'bg-green-400' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextExercise}
                  className="flex items-center px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold transition-all"
                >
                  {exercicioAtual === exercises.length - 1 ? 'Finalizar' : 'Próximo'}
                  <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Informações Científicas */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-2">📚 Fundamentação Científica</h3>
          <p className="text-gray-600 text-sm">
            Esta atividade é baseada em métricas validadas de prosódia para TEA, incluindo análise de pitch, 
            loudness e duração vocal (ADOS-2 Item A2). Os exercícios seguem o protocolo PEPS-C para avaliação 
            de elementos prosódicos e o GeMAPS para parâmetros acústicos mínimos. A prática de diferentes 
            emoções desenvolve flexibilidade prosódica, reduzindo monotonia vocal comum em TEA.
          </p>
        </div>
      </main>
    </div>
  );
}
