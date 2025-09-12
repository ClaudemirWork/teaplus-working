'use client';

import React, { useState, useEffect, useRef } from 'react';

// Mapeamento de sílabas essenciais por letra, conforme suas pastas no GitHub
const syllableMap: { [letter: string]: string[] } = {
  B: ['ba', 'be', 'bi', 'bo', 'bu'],
  C: ['ca', 'ce', 'ci', 'co', 'cu'],
  D: ['da', 'de', 'di', 'do', 'du'],
  F: ['fa', 'fe', 'fi', 'fo', 'fu'],
  L: ['la', 'le', 'li', 'lo', 'lu'],
  M: ['ma', 'me', 'mi', 'mo', 'mu'],
  N: ['na', 'ne', 'ni', 'no', 'nu'],
  P: ['pa', 'pe', 'pi', 'po', 'pu'],
  R: ['ra', 're', 'ri', 'ro', 'ru'],
  S: ['sa', 'se', 'si', 'so', 'su'],
  T: ['ta', 'te', 'ti', 'to', 'tu'],
  V: ['va', 've', 'vi', 'vo', 'vu'],
};

export default function SyllableRepeat() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const letters = Object.keys(syllableMap);
  const currentLetter = letters[currentLetterIndex];
  const syllables = syllableMap[currentLetter];
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState('');

  const audioFolder = '/audio/syllables/essenciais/'; // caminho para as pastas no repo
  const audioRef = useRef<HTMLAudioElement>(null);

  // Referências para o microfone e análise de áudio
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafIdRef = useRef<number | null>(null);

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
        setMessage('Erro ao acessar microfone.');
      }
    }
    setupMic();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Verifica o volume vinda do microfone para detectar tentativa vocal
  function checkVolume() {
    if (!analyserRef.current || !dataArrayRef.current) return;
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const avgVolume = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
    if (avgVolume > 20) {
      setMessage('Tentativa detectada! Muito bem!');
      stopListening();
      nextSyllable();
    } else {
      rafIdRef.current = requestAnimationFrame(checkVolume);
    }
  }

  function startListening() {
    setMessage('Escutando... tente repetir a sílaba!');
    setListening(true);
    rafIdRef.current = requestAnimationFrame(checkVolume);
  }

  function stopListening() {
    setListening(false);
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
  }

  function onAudioEnded() {
    startListening();
  }

  function nextSyllable() {
    if (currentSyllableIndex + 1 < syllables.length) {
      setCurrentSyllableIndex(currentSyllableIndex + 1);
    } else if (currentLetterIndex + 1 < letters.length) {
      setCurrentLetterIndex(currentLetterIndex + 1);
      setCurrentSyllableIndex(0);
    } else {
      setMessage('Parabéns, você completou todas as sílabas!');
      // Reiniciar ou desativar o jogo aqui se quiser
      // setCurrentLetterIndex(0);
      // setCurrentSyllableIndex(0);
    }
    setMessage('');
  }

  const currentSyllable = syllables[currentSyllableIndex];
  const audioSrc = `${audioFolder}${currentLetter}/${currentSyllable}.mp3`;

  return (
    <main className="p-8 max-w-md mx-auto text-center font-sans">
      <h1 className="text-2xl font-bold mb-4">Jogo de Repetição de Sílabas</h1>
      <p className="mb-2">Conjunto atual: <b>{currentLetter}</b></p>
      <p className="mb-4">Ouça e repita a sílaba. O microfone detectará sua tentativa!</p>

      <audio
        ref={audioRef}
        src={audioSrc}
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
          Ouvir Sílabas {currentSyllable}
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
