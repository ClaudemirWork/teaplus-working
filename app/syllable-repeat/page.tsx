'use client';

import React, { useState, useEffect, useRef } from 'react';

// Sílabas exemplo para o jogo (nomes dos arquivos de áudio em public/audio/syllables)
const syllables = ['ma', 'pa', 'ba', 'ta', 'da'];
const audioFolder = '/audio/syllables/';

export default function SyllableRepeat() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Inicializa áudio do microfone e Analyser para capturar volume
  useEffect(() => {
    async function setupMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;
        mediaStreamRef.current = stream;
      } catch {
        setMessage("Erro ao acessar microfone.");
      }
    }
    setupMic();

    // Limpeza ao desmontar componente
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Função que verifica volume do microfone periodicamente e detecta tentativa vocal
  function checkVolume() {
    if (!analyserRef.current || !dataArrayRef.current) return;
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const avgVolume = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
    if (avgVolume > 20) {  // Threshold simples para detectar tentativa
      setMessage('Tentativa detectada! Muito bem!');
      stopListening();
      nextSyllable();
    } else {
      rafIdRef.current = requestAnimationFrame(checkVolume);
    }
  }

  // Inicia escuta e análise do volume
  function startListening() {
    setMessage('Escutando... tente repetir a sílaba!');
    setListening(true);
    rafIdRef.current = requestAnimationFrame(checkVolume);
  }

  // Para escuta e análise do volume
  function stopListening() {
    setListening(false);
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
  }

  // Ao terminar áudio, inicia escuta
  function onAudioEnded() {
    startListening();
  }

  // Avança para próxima sílaba circularmente e limpa mensagem
  function nextSyllable() {
    setCurrentIndex((prev) => (prev + 1) % syllables.length);
    setMessage('');
  }

  return (
    <main className="p-8 max-w-md mx-auto text-center font-sans">
      <h1 className="text-2xl font-bold mb-4">Jogo de Repetição de Sílabas</h1>
      <p className="mb-4">Ouça e repita a sílaba. O microfone detectará sua tentativa!</p>

      <audio
        ref={audioRef}
        src={`${audioFolder}${syllables[currentIndex]}.mp3`}
        preload="auto"
        onEnded={onAudioEnded}
        controls
        autoPlay
      />

      <div className="my-6 text-xl font-semibold text-green-700">{message}</div>

      {!listening ? (
        <button
          onClick={() => {
            audioRef.current?.play();
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ouvir Sílabas {syllables[currentIndex]}
        </button>
      ) : (
        <button
          onClick={stopListening}
          className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Parar Audição
        </button>
      )}
    </main>
  );
}
