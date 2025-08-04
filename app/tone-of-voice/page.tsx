'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';

export default function ToneOfVoice() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setAudioBlob(null);
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setAudioBlob(null);
    }
  };

  const currentEx = exercises[currentExercise];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      {/* Header Mobile */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Botão Voltar */}
            <a 
              href="/tea" 
              className="flex items-center text-pink-600 hover:text-pink-700 transition-colors min-h-[44px] px-2 -ml-2"
            >
              <span className="text-xl mr-2">←</span>
              <span className="text-sm sm:text-base font-medium">Voltar para TEA</span>
            </a>
            
            {/* Título */}
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4 flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl">🎵</span>
              <span>Tom de Voz</span>
            </h1>
            
            {/* Espaço para balanceamento */}
            <div className="w-20"></div>
          </div>
          
          {/* Subtítulo */}
          <p className="text-center text-sm sm:text-base text-gray-600 mt-2">Pratique diferentes entonações e expressões vocais</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Progress */}
        <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">Progresso</h3>
            <span className="text-sm text-gray-600 mt-1 sm:mt-0">
              Exercício {currentExercise + 1} de {exercises.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Exercise */}
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 mb-6">
          <div className={`${currentEx.color} rounded-xl p-4 sm:p-6 mb-6 border-2`}>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Emoção: {currentEx.emotion}</h2>
              <p className="text-sm sm:text-lg">{currentEx.description}</p>
            </div>
          </div>

          {/* Phrase to Practice */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-8 text-center mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">Frase para praticar:</h3>
            <p className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 leading-relaxed">"{currentEx.phrase}"</p>
            
            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">💡 Dicas:</h4>
              <p className="text-blue-700 text-sm sm:text-base">{currentEx.tips}</p>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-bold text-base sm:text-lg transition-all transform hover:scale-105 active:scale-95 min-h-[48px] touch-manipulation ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isRecording ? '⏹️ Parar Gravação' : '🎤 Iniciar Gravação'}
              </button>

              {audioBlob && (
                <button
                  onClick={playRecording}
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-base sm:text-lg transition-all transform hover:scale-105 active:scale-95 min-h-[48px] touch-manipulation"
                >
                  ▶️ Reproduzir
                </button>
              )}
            </div>

            {isRecording && (
              <div className="text-red-600 font-semibold animate-pulse text-center text-sm sm:text-base">
                🔴 Gravando... Fale agora a frase com a emoção adequada
              </div>
            )}

            {audioBlob && (
              <div className="text-green-600 font-semibold text-center text-sm sm:text-base max-w-md">
                ✅ Gravação concluída! Você pode reproduzir ou passar para o próximo exercício.
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={previousExercise}
            disabled={currentExercise === 0}
            className={`px-4 sm:px-6 py-3 rounded-xl font-bold transition-all min-h-[48px] touch-manipulation order-2 sm:order-1 ${
              currentExercise === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700'
            }`}
          >
            ← Anterior
          </button>

          <div className="flex gap-2 order-1 sm:order-2">
            {exercises.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                  index === currentExercise ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>

          <button
            onClick={nextExercise}
            disabled={currentExercise === exercises.length - 1}
            className={`px-4 sm:px-6 py-3 rounded-xl font-bold transition-all min-h-[48px] touch-manipulation order-3 ${
              currentExercise === exercises.length - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white'
            }`}
          >
            Próximo →
          </button>
        </div>

        {/* Completion Message */}
        {currentExercise === exercises.length - 1 && audioBlob && (
          <div className="mt-6 bg-green-100 border border-green-200 rounded-xl p-4 sm:p-6 text-center">
            <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-2">🎉 Parabéns!</h3>
            <p className="text-green-700 text-sm sm:text-base">Você completou todos os exercícios de Tom de Voz!</p>
            <p className="text-green-600 text-xs sm:text-sm mt-2">Continue praticando essas habilidades no seu dia a dia.</p>
          </div>
        )}
      </div>
    </div>
  );
}