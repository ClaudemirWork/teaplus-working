// app/bubble-pop/components/InstructionsScreen.tsx
'use client';

import React from 'react';

interface InstructionsScreenProps {
  onPlay: () => void;
}

export function InstructionsScreen({ onPlay }: InstructionsScreenProps) {
  return (
    <div className="relative w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-200 via-cyan-200 to-teal-200">
      <div className="bg-white/95 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-blue-600">Como Jogar</h2>
        <ul className="text-lg text-gray-700 space-y-4 mb-8 text-left list-disc list-inside">
            <li>Estoure as bolhas clicando nelas!</li>
            <li>Colete bolhas especiais (Azul escura, Pérola, Tesouro)</li>
            <li>Evite as minas submarinas vermelhas!</li>
            <li>Fique de olho no oxigênio! Bolhas azuis recuperam mais!</li>
            <li>Pérolas e tesouros valem muitos pontos!</li>
        </ul>
        <button
          onClick={onPlay} // A função onPlay é chamada aqui
          className="w-full text-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full py-4 shadow-xl hover:scale-105 transition-transform"
        >
          Vamos jogar! 🚀
        </button>
      </div>
    </div>
  );
}
