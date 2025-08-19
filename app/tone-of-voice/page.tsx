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
  
  // Métricas
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
      tips: "Eleve o tom no final, fale mais rápido, use entonação ascendente.",
      color: "bg-yellow-100 border-yellow-300 text-yellow-800"
    },
    {
      id: 2,
      emotion: "Tristeza",
      phrase: "Não consegui terminar o projeto.",
      description: "Pratique um tom mais baixo e melancólico",
      tips: "Use tom mais grave, fale mais devagar, entonação descendente.",
      color: "bg-blue-100 border-blue-300 text-blue-800"
    },
    {
      id: 3,
      emotion: "Surpresa",
      phrase: "Não acredito que você veio!",
      description: "Expresse surpresa com mudanças bruscas de tom",
      tips: "Comece baixo e suba o tom rapidamente, pause antes de palavras importantes.",
      color: "bg-purple-100 border-purple-300 text-purple-800"
    },
    {
      id: 4,
      emotion: "Raiva",
      phrase: "Isso não pode estar acontecendo!",
      description: "Pratique controlar a intensidade da raiva",
      tips: "Tom mais forte mas controlado, pronuncie palavras claramente.",
      color: "bg-red-100 border-red-300 text-red-800"
    },
    {
      id: 5,
      emotion: "Medo",
      phrase: "Acho que tem alguém aí fora...",
      description: "Use tom baixo e hesitante para expressar medo",
      tips: "Fale mais baixo, com pausas, voz ligeiramente trêmula.",
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
        
        const novasGravacoes = [...gravacoesRealizadas];
        novasGravacoes[exercicioAtual]++;
        setGravacoesRealizadas(novasGravacoes);
        
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
    if (inicioExercicio) {
      const tempo = (new Date().getTime() - inicioExercicio.getTime()) / 1000;
      setTempoPorExercicio(prev => [...prev, tempo]);
    }
    
    if (exercicioAtual < exercises.length - 1) {
      setExercicioAtual(exercicioAtual + 1);
      setAudioBlob(null);
      setInicioExercicio(new Date());
    } else {
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
    if (inicioExercicio) {
      const tempo = (new Date().getTime() - inicioExercicio.getTime()) / 1000;
      setTempoPorExercicio(prev => [...prev, tempo]);
    }
    setAtividadeConcluida(true);
  };

  // Funções de cálculo de métricas
  const calcularTaxaConclusao = () => Math.round((exerciciosComGravacao / exercises.length) * 100);
  const calcularTempoTotal = () => inicioSessao ? Math.floor((new Date().getTime() - inicioSessao.getTime()) / 1000) : 0;
  
  // Função de salvamento
  const handleSaveSession = async () => {
    if (!atividadeConcluida) {
      alert('Complete todos os exercícios antes de salvar.');
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
      
      const taxaConclusao = calcularTaxaConclusao();
      const totalGravacoes = gravacoesRealizadas.reduce((a, b) => a + b, 0);
      const pontuacaoFinal = (taxaConclusao * 2) + (totalGravacoes * 10);
      
      const { error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Tom de Voz',
          pontuacao_final: pontuacaoFinal,
          data_fim: new Date().toISOString(),
          metricas: {
            taxaConclusao,
            totalGravacoes,
            tempoTotal: calcularTempoTotal(),
            exerciciosComGravacao,
            gravacoesPorExercicio: gravacoesRealizadas
          }
        }]);

      if (error) {
        throw error;
      }

      alert(`Sessão salva com sucesso! Pontuação: ${pontuacaoFinal}`);
      router.push('/dashboard'); // Redirecionamento corrigido
    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };
  
  const currentEx = exercises[exercicioAtual];

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
            🎵 Tom de Voz
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <GameHeader />
      <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {/* Cards de Instruções */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">🎯 Objetivo</h2>
            <p className="text-gray-600 text-sm">Praticar modulação prosódica, desenvolvendo controle de tom, volume e ritmo de fala.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">🎤 Como Jogar</h2>
            <ul className="text-gray-600 text-sm list-disc list-inside space-y-1">
              <li>Leia a frase com a emoção</li>
              <li>Grave sua voz</li>
              <li>Escute e compare</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">⭐ Emoções</h2>
            <ul className="text-gray-600 text-sm list-disc list-inside space-y-1">
              <li>Alegria, Tristeza, Surpresa, Raiva e Medo</li>
            </ul>
          </div>
        </div>

        {/* Progresso da Sessão */}
        {atividadeIniciada && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Progresso da Sessão</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Métricas aqui */}
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full mt-4">
              <div 
                className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500 rounded-full"
                style={{ width: `${((exercicioAtual + 1) / exercises.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Área Principal */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {!atividadeIniciada ? (
            <div className="text-center min-h-[300px] flex flex-col justify-center items-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Exercícios de Tom de Voz</h3>
              <p className="text-gray-600 mb-6 max-w-md">Pratique diferentes entonações para melhorar sua expressividade vocal.</p>
              <button 
                onClick={iniciarAtividade}
                className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
              >
                🎮 Iniciar Atividade
              </button>
            </div>
          ) : atividadeConcluida ? (
            <div className="text-center min-h-[300px] flex flex-col justify-center items-center">
              <h3 className="text-2xl font-bold text-green-600 mb-4">🎉 Atividade Concluída!</h3>
              <button 
                onClick={iniciarAtividade}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                🔄 Praticar Novamente
              </button>
            </div>
          ) : (
            <div>
              <div className={`${currentEx.color} rounded-xl p-6 mb-6 border-2 text-center`}>
                <h2 className="text-2xl font-bold mb-2">Emoção: {currentEx.emotion}</h2>
                <p className="text-lg">{currentEx.description}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Frase para praticar:</h3>
                <p className="text-3xl font-bold text-gray-800">"{currentEx.phrase}"</p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-4">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-8 py-4 rounded-xl text-white font-bold text-lg transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
                  >
                    {isRecording ? '⏹️ Parar' : '🎤 Gravar'}
                  </button>
                  {audioBlob && (
                    <button
                      onClick={playRecording}
                      className="px-8 py-4 rounded-xl bg-blue-500 text-white font-bold text-lg"
                    >
                      <Volume2 size={20} className="inline mr-2" />
                      Ouvir
                    </button>
                  )}
                </div>
                {audioBlob && !isRecording && (
                  <div className="text-green-600 font-semibold">✅ Gravação concluída!</div>
                )}
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={previousExercise}
                  disabled={exercicioAtual === 0}
                  className="flex items-center px-6 py-3 rounded-xl font-bold disabled:bg-gray-200 disabled:text-gray-400 bg-gray-300 hover:bg-gray-400"
                >
                  <ArrowLeft size={20} className="mr-2" /> Anterior
                </button>
                <button
                  onClick={nextExercise}
                  className="flex items-center px-6 py-3 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-600"
                >
                  {exercicioAtual === exercises.length - 1 ? 'Finalizar' : 'Próximo'} <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
