"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Info, Play } from "lucide-react";

type Screen = "landing" | "instructions" | "levels" | "game";
type Level = "iniciante" | "intermediario" | "avancado";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [selectedLevel, setSelectedLevel] = useState<Level>("iniciante");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-200 to-blue-200 p-4">
      {currentScreen === "landing" && (
        <LandingScreen onStart={() => setCurrentScreen("instructions")} />
      )}
      {currentScreen === "instructions" && (
        <InstructionsScreen onNext={() => setCurrentScreen("levels")} />
      )}
      {currentScreen === "levels" && (
        <LevelsScreen
          onLevelSelect={(level) => {
            setSelectedLevel(level);
            setCurrentScreen("game");
          }}
        />
      )}
      {currentScreen === "game" && <GameScreen level={selectedLevel} />}
    </main>
  );
}

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl p-6 text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.img
        src="/logo.png"
        alt="Logo Estórias Embaralhadas"
        className="w-32 h-32 mx-auto mb-4 object-contain"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
      />
      <h1 className="text-2xl font-bold text-purple-700 mb-2">
        Estórias Embaralhadas
      </h1>
      <p className="text-gray-600 mb-6">
        O jogo divertido de organizar sequências e montar histórias!
      </p>
      <button
        onClick={onStart}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 w-full"
      >
        <BookOpen size={20} />
        Descobrir Como Jogar
      </button>
    </motion.div>
  );
}

function InstructionsScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
        <Info size={20} /> Como Jogar
      </h2>
      <ul className="text-gray-700 space-y-3 mb-6 text-sm">
        <li>📌 Você receberá cartas com partes de uma história.</li>
        <li>🧩 Seu objetivo é organizá-las na ordem correta.</li>
        <li>🏆 Se acertar, a história completa aparece para você.</li>
      </ul>
      <button
        onClick={onNext}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 w-full"
      >
        <ArrowRight size={20} />
        Escolher Nível
      </button>
    </motion.div>
  );
}

function LevelsScreen({ onLevelSelect }: { onLevelSelect: (level: Level) => void }) {
  return (
    <motion.div
      className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold text-purple-700 mb-6 text-center">
        Escolha seu Nível
      </h2>

      {/* Iniciante detalhado */}
      <div className="mb-6 p-4 border rounded-xl bg-purple-50">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">
          🌱 Iniciante
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Histórias curtas, poucas cartas. Ideal para começar.
        </p>
        <button
          onClick={() => onLevelSelect("iniciante")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 w-full"
        >
          <Play size={18} />
          Jogar Iniciante
        </button>
      </div>

      {/* Outros níveis só cards fechados */}
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => onLevelSelect("intermediario")}
          className="p-4 border rounded-xl hover:bg-blue-50 transition text-left"
        >
          <h3 className="font-semibold text-blue-700">⚡ Intermediário</h3>
          <p className="text-xs text-gray-500">Desafio maior, mais cartas.</p>
        </button>

        <button
          onClick={() => onLevelSelect("avancado")}
          className="p-4 border rounded-xl hover:bg-red-50 transition text-left"
        >
          <h3 className="font-semibold text-red-700">🔥 Avançado</h3>
          <p className="text-xs text-gray-500">Histórias complexas e longas.</p>
        </button>
      </div>
    </motion.div>
  );
}

function GameScreen({ level }: { level: Level }) {
  return (
    <motion.div
      className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl p-6 text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold text-purple-700 mb-4">
        Jogando: {level === "iniciante" && "🌱 Iniciante"}
        {level === "intermediario" && "⚡ Intermediário"}
        {level === "avancado" && "🔥 Avançado"}
      </h2>
      <p className="text-gray-600 mb-4">
        (Aqui vamos colocar as cartas para arrastar e ordenar)
      </p>
      <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-400">
        Área do jogo
      </div>
    </motion.div>
  );
}
