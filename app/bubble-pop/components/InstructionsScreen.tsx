'use client';

import React, { useEffect, useState } from 'react';
import { GameAudioManager } from '@/utils/gameAudioManager';

interface InstructionsScreenProps {
  onPlay: () => void;
}

const instrucoes = [
  { emoji: '🫧', texto: "Estoure as bolhas clicando nelas!" },
  { emoji: '🐠', texto: "Colete vários itens, salve peixes e outros animais marinhos." },
  { emoji: '💣', texto: "Evite as minas submarinas (bombas)! Elas fazem perder pontos e você reiniciar o nível. Cuidado!!" },
  { emoji: '🦪', texto: "Colete pérolas, tesouros e artefatos de mergulho, ganhando pontos e podendo chegar no nível secreto da fase 11, com incríveis surpresas." }
];

export function InstructionsScreen({ onPlay }: InstructionsScreenProps) {
  const [milaFalando, setMilaFalando] = useState(true);
  const [falaConcluida, setFalaConcluida] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function falarFrase(frase: string) {
      return new Promise<void>(resolve => {
        GameAudioManager.getInstance().falarMila(frase, () => resolve());
      });
    }

    async function narrarInstrucoes() {
      setMilaFalando(true);
      for (const item of instrucoes) {
        if (cancelled) return;
        await falarFrase(item.texto);
        await new Promise(resolve => setTimeout(resolve, 500)); // pequeno delay extra
      }
      setFalaConcluida(true);
      setMilaFalando(false);
    }

    narrarInstrucoes();

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-cyan-200 to-teal-200">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-blue-600">Como Jogar</h2>
        
        <ul className="text-lg text-gray-700 space-y-4 mb-8 text-left list-none">
          {instrucoes.map((item, idx) => (
            <li key={idx}>
              <span className="text-2xl mr-2">{item.emoji}</span>
              <span>{item.texto}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={onPlay}
          disabled={!falaConcluida}
          className={`w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl
            hover:scale-105 transition-transform ${!falaConcluida ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {milaFalando ? "Aguarde a Mila terminar..." : "Vamos jogar! 🚀"}
        </button>
      </div>
    </div>
  );
}
