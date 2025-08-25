'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Jogo Simon Mágico — versão completa em uma única página
 * - Mascote Leo com balão de fala (imagem: /mascoteleo.webp)
 * - Sons via Web Audio API (sem arquivos .mp3)
 * - Sistema de voz (speechSynthesis) em pt-BR
 * - Sequência crescente de cristais e várias cores
 * - Orientação educativa a cada clique
 * - Layout moderno com Tailwind
 * - Power-ups: repetir sequência e reduzir velocidade
 * - Métricas: sequência máxima, acertos/erros, tempo médio, duração da sessão
 * - Modal de resultados com estrelas
 */

/* Tipos */
interface Crystal {
  id: number;
  name: string;
  emoji: string;
  note: string;
  gradient: string; // Tailwind gradient classes: from-... to-...
}

interface PowerUps {
  replay: number;
  slow: number;
}

interface GameMetrics {
  maxSequence: number;
  totalScore: number;
  correctAttempts: number;
  wrongAttempts: number;
  averageResponseTime: number; // ms
  sessionDuration: number;     // ms
  powerUpsUsed: number;
}

/* Constantes */
const CRYSTALS: Crystal[] = [
  { id: 0, name: 'azul',    emoji: '🔵', note: 'C4', gradient: 'from-blue-400 to-blue-600' },
  { id: 1, name: 'vermelho',emoji: '🔴', note: 'D4', gradient: 'from-red-400 to-red-600' },
  { id: 2, name: 'verde',   emoji: '🟢', note: 'E4', gradient: 'from-green-400 to-green-600' },
  { id: 3, name: 'amarelo', emoji: '🟡', note: 'F4', gradient: 'from-yellow-300 to-yellow-500' },
  { id: 4, name: 'roxo',    emoji: '🟣', note: 'G4', gradient: 'from-purple-400 to-purple-600' },
  { id: 5, name: 'laranja', emoji: '🟠', note: 'A4', gradient: 'from-orange-400 to-orange-600' },
  { id: 6, name: 'rosa',    emoji: '🌸', note: 'B4', gradient: 'from-pink-400 to-pink-600' },
  { id: 7, name: 'diamante',emoji: '💎', note: 'C5', gradient: 'from-cyan-300 to-indigo-500' },
];

const NOTE_FREQ: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25,
};

const INITIAL_SPEED_MS = 600;
const SLOW_SPEED_MS = 1000;
const MIN_SPEED_MS = 250;

/* Componente principal */
export default function SimonSaysGame() {
  /* Áudio e tempo */
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const responseStartRef = useRef<number | null>(null);
  const responseTimesRef = useRef<number[]>([]);

  /* Estado do jogo */
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeCrystal, setActiveCrystal] = useState<number | null>(null);

  /* Progresso e feedback */
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(INITIAL_SPEED_MS);
  const [message, setMessage] = useState('Olá! Eu sou o Leo, seu mascote mágico. Vamos treinar sua memória?');

  /* Power-ups e métricas */
  const [powerUps, setPowerUps] = useState<PowerUps>({ replay: 1, slow: 1 });
  const [metrics, setMetrics] = useState<GameMetrics>({
    maxSequence: 0,
    totalScore: 0,
    correctAttempts: 0,
    wrongAttempts: 0,
    averageResponseTime: 0,
    sessionDuration: 0,
    powerUpsUsed: 0,
  });

  /* Modal de resultados */
  const [showResults, setShowResults] = useState(false);

  /* Inicialização do AudioContext no primeiro gesto do usuário */
  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    const onFirstInteract = () => {
      initAudio();
      document.removeEventListener('pointerdown', onFirstInteract);
      document.removeEventListener('keydown', onFirstInteract);
    };
    document.addEventListener('pointerdown', onFirstInteract);
    document.addEventListener('keydown', onFirstInteract);
    return () => {
      document.removeEventListener('pointerdown', onFirstInteract);
      document.removeEventListener('keydown', onFirstInteract);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  /* Fala (voz) */
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'pt-BR';
      u.rate = 0.95;
      u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    }
  }, []);

  /* Tocar nota (Web Audio) */
  const playNote = useCallback((note: string, duration = 0.4) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = NOTE_FREQ[note] || 440;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, []);

  /* Efeitos de sucesso e erro */
  const playSuccess = useCallback(() => {
    if (!audioCtxRef.current) return;
    ['E4', 'G4', 'C5'].forEach((n, i) => setTimeout(() => playNote(n, 0.18), i * 120));
  }, [playNote]);

  const playError = useCallback(() => {
    if (!audioCtxRef.current) return;
    playNote('D4', 0.3);
    setTimeout(() => playNote('C4', 0.3), 140);
  }, [playNote]);

  /* Iniciar jogo */
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setShowResults(false);
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setLevel(1);
    setSpeed(INITIAL_SPEED_MS);
    setPowerUps({ replay: 1, slow: 1 });
    setMetrics({
      maxSequence: 0,
      totalScore: 0,
      correctAttempts: 0,
      wrongAttempts: 0,
      averageResponseTime: 0,
      sessionDuration: 0,
      powerUpsUsed: 0,
    });
    responseTimesRef.current = [];
    sessionStartRef.current = Date.now();
    const intro = 'Observe com atenção. Eu vou mostrar a sequência dos cristais!';
    setMessage(intro);
    speak(intro);
    setTimeout(() => nextRound([]), 1200);
  }, [speak]);

  /* Próxima rodada: adiciona 1 cristal aleatório e mostra sequência */
  const nextRound = useCallback((currentSeq?: number[]) => {
    const base = currentSeq ?? sequence;
    const next = [...base, Math.floor(Math.random() * CRYSTALS.length)];
    setSequence(next);
    setPlayerSequence([]);
    setMetrics(prev => ({ ...prev, maxSequence: Math.max(prev.maxSequence, next.length) }));
    showSequence(next);
  }, [sequence, showSequence]);

  /* Mostrar sequência (com bloqueio de input) */
  const showSequence = useCallback(async (seq: number[]) => {
    setIsShowingSequence(true);
    const msg = `Memorize a sequência de ${seq.length} cristal${seq.length > 1 ? 'is' : ''}.`;
    setMessage(msg);
    speak(msg);
    await pause(700);

    for (let i = 0; i < seq.length; i++) {
      const id = seq[i];
      setActiveCrystal(id);
      playNote(CRYSTALS[id].note, 0.35);
      await pause(320);
      setActiveCrystal(null);
      await pause(speed);
    }

    setIsShowingSequence(false);
    const yourTurn = 'Sua vez! Toque nos cristais na mesma ordem.';
    setMessage(yourTurn);
    speak(yourTurn);
    responseStartRef.current = Date.now();
  }, [playNote, speak, speed]);

  /* Utilitário de pausa */
  function pause(ms: number) {
    return new Promise<void>(res => setTimeout(res, ms));
  }

  /* Clique no cristal */
  const handleCrystalClick = useCallback((id: number) => {
    if (!isPlaying || isShowingSequence) return;

    // Registrar tempo de resposta entre cliques
    if (responseStartRef.current) {
      const delta = Date.now() - responseStartRef.current;
      responseTimesRef.current.push(delta);
      responseStartRef.current = Date.now();
    }

    // Feedback imediato
    setActiveCrystal(id);
    playNote(CRYSTALS[id].note, 0.35);
    setTimeout(() => setActiveCrystal(null), 220);

    // Atualiza sequência do jogador
    const newPlayerSeq = [...playerSequence, id];
    setPlayerSequence(newPlayerSeq);

    // Verificação
    const idx = newPlayerSeq.length - 1;
    const isCorrect = newPlayerSeq[idx] === sequence[idx];

    if (!isCorrect) {
      handleError();
      return;
    }

    // Acerto parcial
    setMetrics(prev => ({ ...prev, correctAttempts: prev.correctAttempts + 1 }));

    // Mensagem educativa contextual
    const tip = `Muito bem! Você tocou o cristal ${CRYSTALS[id].emoji} ${CRYSTALS[id].name}.`;
    setMessage(tip);
    speak(tip);

    // Sequência completa
    if (newPlayerSeq.length === sequence.length) {
      handleSuccess();
    }
  }, [isPlaying, isShowingSequence, playerSequence, sequence, playNote, speak]);

  /* Sucesso da rodada */
  const handleSuccess = useCallback(() => {
    playSuccess();

    // Pontuação: base por comprimento + bônus se média < 1s
    let roundPoints = sequence.length * 10;
    if (responseTimesRef.current.length > 0) {
      const avg = responseTimesRef.current.reduce((a, b) => a + b, 0) / responseTimesRef.current.length;
      if (avg < 1000) roundPoints += 10; // bônus
    }
    setScore(prev => prev + roundPoints);

    // Aumenta nível a cada 3 cristais para mostrar progressão
    const newLevel = Math.floor(sequence.length / 3) + 1;
    setLevel(newLevel);

    // Acelera um pouco a cada 5 cristais, com mínimo
    if (sequence.length % 5 === 0) {
      setSpeed(prev => Math.max(MIN_SPEED_MS, prev - 50));
    }

    // Mensagem positiva aleatória
    const msgs = [
      'Excelente! Sua memória está brilhando!',
      'Fantástico! Continue assim!',
      'Uau! O Leo está orgulhoso!',
      'Perfeito! Próxima rodada!',
    ];
    const text = msgs[Math.floor(Math.random() * msgs.length)];
    setMessage(text);
    speak(text);

    // Próxima rodada
    setTimeout(() => nextRound(), 1200);
  }, [sequence.length, playSuccess, nextRound, speak]);

  /* Erro finaliza a sessão */
  const handleError = useCallback(() => {
    playError();
    setIsPlaying(false);

    const sessionDuration = sessionStartRef.current ? Date.now() - sessionStartRef.current : 0;
    const avgResp =
      responseTimesRef.current.length > 0
        ? responseTimesRef.current.reduce((a, b) => a + b, 0) / responseTimesRef.current.length
        : 0;

    setMetrics(prev => ({
      ...prev,
      wrongAttempts: prev.wrongAttempts + 1,
      totalScore: score,
      sessionDuration,
      averageResponseTime: avgResp,
    }));

    const endMsg = `Ops! Quase! Você acertou ${sequence.length - 1} cristais.`;
    setMessage(endMsg);
    speak(endMsg);

    setTimeout(() => setShowResults(true), 800);
  }, [playError, score, speak, sequence.length]);

  /* Encerrar e reiniciar */
  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setScore(0);
    setSpeed(INITIAL_SPEED_MS);
    setPowerUps({ replay: 1, slow: 1 });
    setShowResults(false);
    setMetrics({
      maxSequence: 0,
      totalScore: 0,
      correctAttempts: 0,
      wrongAttempts: 0,
      averageResponseTime: 0,
      sessionDuration: 0,
      powerUpsUsed: 0,
    });
    responseTimesRef.current = [];
    sessionStartRef.current = null;
    responseStartRef.current = null;

    const txt = 'Jogo reiniciado! Clique em começar para uma nova aventura.';
    setMessage(txt);
    speak(txt);
  }, [speak]);

  /* Power-ups */
  const usePowerUp = useCallback((type: keyof PowerUps) => {
    if (!isPlaying || isShowingSequence) return;
    if (powerUps[type] <= 0) return;

    setPowerUps(prev => ({ ...prev, [type]: prev[type] - 1 }));
    setMetrics(prev => ({ ...prev, powerUpsUsed: prev.powerUpsUsed + 1 }));

    if (type === 'replay') {
      const txt = 'Repetindo a sequência. Preste atenção nos detalhes!';
      setMessage(txt);
      speak(txt);
      showSequence(sequence);
    } else if (type === 'slow') {
      const txt = 'Velocidade reduzida ativada. Respire e observe com calma.';
      setSpeed(SLOW_SPEED_MS);
      setMessage(txt);
      speak(txt);
    }
  }, [isPlaying, isShowingSequence, powerUps, sequence, showSequence, speak]);

  /* Estrelas do resultado */
  const calculateStars = useCallback(() => {
    const len = metrics.maxSequence;
    if (len >= 15) return 5;
    if (len >= 10) return 4;
    if (len >= 7) return 3;
    if (len >= 4) return 2;
    return 1;
  }, [metrics.maxSequence]);

  /* UI */
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl">
                🧙
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Simon Mágico</h1>
            </div>
            <div className="flex gap-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-600">Nível</span>
                <p className="text-xl font-bold text-gray-800">{level}</p>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-600">Pontos</span>
                <p className="text-xl font-bold text-gray-800">{score}</p>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm text-gray-600">Sequência</span>
                <p className="text-xl font-bold text-gray-800">{sequence.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Container principal */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Mensagem + mascote */}
        <div className="grid md:grid-cols-[1fr,240px] gap-6 items-start">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <p className="text-lg text-gray-800 flex-1">
                {message}
              </p>
              <button
                onClick={() => speak(message)}
                className="shrink-0 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
                aria-label="Ouvir mensagem"
                title="Ouvir mensagem"
              >
                🔊
              </button>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl flex flex-col items-center">
            <div className="w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-amber-200 to-pink-200 flex items-center justify-center">
              <img
                src="/mascoteleo.webp"
                alt="Mascote Leo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 text-center text-sm text-gray-700">
              🦁 Leo: “Estou com você! Foque na sequência e confie na sua memória.”
            </div>
          </div>
        </div>

        {/* Grade de cristais */}
        <div className="grid sm:grid-cols-3 grid-cols-2 gap-6 my-8">
          {CRYSTALS.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCrystalClick(c.id)}
              disabled={!isPlaying || isShowingSequence}
              className={[
                'aspect-square rounded-2xl flex items-center justify-center text-5xl',
                'bg-gradient-to-br', c.gradient,
                'transform transition-all duration-200 shadow-lg select-none',
                activeCrystal === c.id ? 'scale-110 ring-4 ring-white/60' : '',
                !isPlaying || isShowingSequence ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
              ].join(' ')}
              aria-label={`Cristal ${c.name}`}
              title={`Cristal ${c.name}`}
            >
              {c.emoji}
            </button>
          ))}
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={startGame}
            disabled={isPlaying || isShowingSequence}
            className="flex-1 min-w-[200px] py-4 px-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors text-lg"
          >
            COMEÇAR
          </button>
          <button
            onClick={resetGame}
            className="flex-1 min-w-[200px] py-4 px-6 bg-white hover:bg-gray-100 text-purple-700 font-bold rounded-full transition-colors text-lg border-2 border-purple-600"
          >
            REINICIAR
          </button>
        </div>

        {/* Power-ups */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-40">
          <button
            onClick={() => usePowerUp('replay')}
            disabled={powerUps.replay === 0 || !isPlaying || isShowingSequence}
            className={[
              'relative p-3 bg-white/95 rounded-xl shadow-lg transition-all',
              powerUps.replay > 0 && isPlaying && !isShowingSequence ? 'hover:scale-110 ring-2 ring-yellow-400' : 'opacity-50 cursor-not-allowed'
            ].join(' ')}
            aria-label="Repetir sequência"
            title="Repetir sequência"
          >
            🔁
            {powerUps.replay > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {powerUps.replay}
              </span>
            )}
          </button>

          <button
            onClick={() => usePowerUp('slow')}
            disabled={powerUps.slow === 0 || !isPlaying || isShowingSequence}
            className={[
              'relative p-3 bg-white/95 rounded-xl shadow-lg transition-all',
              powerUps.slow > 0 && isPlaying && !isShowingSequence ? 'hover:scale-110 ring-2 ring-yellow-400' : 'opacity-50 cursor-not-allowed'
            ].join(' ')}
            aria-label="Velocidade lenta"
            title="Velocidade lenta"
          >
            🐢
            {powerUps.slow > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {powerUps.slow}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Modal de resultados */}
      {showResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-3xl font-bold text-purple-700 text-center mb-4">
              🎉 Parabéns!
            </h2>

            <div className="text-5xl text-center mb-6">
              {'⭐'.repeat(calculateStars())}
            </div>

            <div className="bg-gray-100 rounded-lg p-4 space-y-2 mb-6 text-gray-800">
              <div className="flex justify-between">
                <span className="text-gray-600">Sequência máxima:</span>
                <strong>{metrics.maxSequence}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pontuação total:</span>
                <strong>{metrics.totalScore || score}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Acertos:</span>
                <strong>{metrics.correctAttempts}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Erros:</span>
                <strong>{metrics.wrongAttempts}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tempo médio de resposta:</span>
                <strong>
                  {metrics.averageResponseTime ? `${(metrics.averageResponseTime / 1000).toFixed(1)}s` : 'N/A'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duração da sessão:</span>
                <strong>
                  {metrics.sessionDuration ? `${(metrics.sessionDuration / 1000).toFixed(1)}s` : 'N/A'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Power-ups usados:</span>
                <strong>{metrics.powerUpsUsed}</strong>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-colors"
            >
              JOGAR NOVAMENTE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
