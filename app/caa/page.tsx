"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  RefreshCcw,
  Play,
  ArrowLeft,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * HISTÓRIAS ÉPICAS — versão unificada (“golden”)
 *
 * ✔️ Next.js App Router + TailwindCSS
 * ✔️ Deploy seguro no Netlify (sem variáveis não inicializadas)
 * ✔️ SpeechSynthesis protegido contra SSR
 * ✔️ Estrutura de fases, slots, pontuação, vidas
 * ✔️ Mascote Leo com balão de fala (desktop + mobile)
 * ✔️ Cards carregados de /public/images/cards
 */

// --- Tipos ---
interface Card {
  id: string;
  label: string;
  image: string;
  category: "acoes" | "rotina" | "alimentos" | "animais" | "core";
}

interface StorySlot {
  id: string;
  title: string;
  categories: Card["category"][];
  maxOptions?: number;
}

interface StoryTemplate {
  id: string;
  title: string;
  prompt: string;
  slots: StorySlot[];
  baseText: string[];
}

// --- Catálogo de cards ---
const CARDS: Card[] = [
  // Rotina & Ações
  {
    id: "brincar",
    label: "Brincar",
    image: "/images/cards/rotina/brincar.webp",
    category: "rotina",
  },
  {
    id: "estudar",
    label: "Estudar",
    image: "/images/cards/rotina/estudar.webp",
    category: "rotina",
  },
  {
    id: "ver_tv",
    label: "Ver Televisão",
    image: "/images/cards/rotina/ver_televisao.webp",
    category: "rotina",
  },
  {
    id: "caminhar",
    label: "Caminhar",
    image: "/images/cards/acoes/caminhar.webp",
    category: "acoes",
  },
  {
    id: "saltar",
    label: "Saltar",
    image: "/images/cards/acoes/saltar.webp",
    category: "acoes",
  },
  {
    id: "ler_livro",
    label: "Ler Livro",
    image: "/images/cards/acoes/ler_livro.webp",
    category: "acoes",
  },

  // Alimentos
  {
    id: "pizza",
    label: "Pizza",
    image: "/images/cards/alimentos/pizza.webp",
    category: "alimentos",
  },
  {
    id: "banana",
    label: "Banana",
    image: "/images/cards/alimentos/banana.webp",
    category: "alimentos",
  },
  {
    id: "salada",
    label: "Salada",
    image: "/images/cards/alimentos/salada.webp",
    category: "alimentos",
  },
  {
    id: "suco_laranja",
    label: "Suco de Laranja",
    image: "/images/cards/alimentos/suco_laranja.webp",
    category: "alimentos",
  },

  // Animais
  {
    id: "cachorro",
    label: "Cachorro",
    image: "/images/cards/animais/cachorro.webp",
    category: "animais",
  },
  {
    id: "gato",
    label: "Gato",
    image: "/images/cards/animais/gato.webp",
    category: "animais",
  },
  {
    id: "coelho",
    label: "Coelho",
    image: "/images/cards/animais/coelho.webp",
    category: "animais",
  },
  {
    id: "elefante",
    label: "Elefante",
    image: "/images/cards/animais/elefante.webp",
    category: "animais",
  },

  // Núcleo
  {
    id: "obrigado",
    label: "Obrigado",
    image: "/images/cards/core/obrigado.webp",
    category: "core",
  },
  {
    id: "sim",
    label: "Sim",
    image: "/images/cards/core/sim.webp",
    category: "core",
  },
  {
    id: "mais",
    label: "Mais",
    image: "/images/cards/core/mais.webp",
    category: "core",
  },
];

// --- Fases ---
const TEMPLATES: StoryTemplate[] = [
  {
    id: "fase_1",
    title: "Capítulo 1 — A Primeira Aventura",
    prompt:
      "Era uma vez uma criança que queria {{acao_inicial}}. No caminho, encontrou um {{amigo}}. Juntos foram {{acao_juntos}} e depois comeram {{comida}}. No final disseram {{fecho}}.",
    baseText: [
      "Era uma vez uma criança que queria",
      "No caminho, encontrou um",
      "Juntos foram",
      "e depois comeram",
      "No final disseram",
    ],
    slots: [
      {
        id: "acao_inicial",
        title: "Escolha o começo",
        categories: ["rotina", "acoes"],
        maxOptions: 6,
      },
      {
        id: "amigo",
        title: "Quem encontrou?",
        categories: ["animais"],
        maxOptions: 6,
      },
      {
        id: "acao_juntos",
        title: "O que fizeram?",
        categories: ["acoes", "rotina"],
        maxOptions: 6,
      },
      {
        id: "comida",
        title: "O que comeram?",
        categories: ["alimentos"],
        maxOptions: 6,
      },
      { id: "fecho", title: "Como terminou?", categories: ["core"], maxOptions: 4 },
    ],
  },
  {
    id: "fase_2",
    title: "Capítulo 2 — Aventuras no Parque",
    prompt:
      "Hoje, a criança decidiu {{acao_inicial}}. Encontrou um {{amigo}}. Eles foram {{acao_juntos}} e beberam {{comida}}. No final disseram {{fecho}}.",
    baseText: [
      "Hoje, a criança decidiu",
      "Encontrou um",
      "Eles foram",
      "e beberam",
      "No final disseram",
    ],
    slots: [
      {
        id: "acao_inicial",
        title: "Começo",
        categories: ["acoes", "rotina"],
        maxOptions: 8,
      },
      { id: "amigo", title: "Quem?", categories: ["animais"], maxOptions: 8 },
      {
        id: "acao_juntos",
        title: "Fizeram o quê?",
        categories: ["acoes", "rotina"],
        maxOptions: 8,
      },
      {
        id: "comida",
        title: "Beberam/Comeram",
        categories: ["alimentos"],
        maxOptions: 8,
      },
      { id: "fecho", title: "Final", categories: ["core"], maxOptions: 4 },
    ],
  },
];

// Utilitário: embaralhar e pegar n itens
function pickRandom<T>(arr: T[], n: number) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.max(1, n));
}

// --- Componente principal ---
export default function EpicStoriesGame() {
  const router = useRouter();

  const [templateIdx, setTemplateIdx] = useState(0);
  const [selected, setSelected] = useState<Record<string, Card | null>>({});
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [soundOn, setSoundOn] = useState(true);
  const [leoSpeech, setLeoSpeech] = useState(
    "Olá! Eu sou o Leo. Vamos criar uma história juntos?"
  );
  const audioInitRef = useRef(false);

  const template = TEMPLATES[templateIdx];

  // opções para cada slot
  const slotOptions = useMemo(() => {
    const map: Record<string, Card[]> = {};
    template.slots.forEach((slot) => {
      const pool = CARDS.filter((c) => slot.categories.includes(c.category));
      map[slot.id] = pickRandom(pool, slot.maxOptions ?? 6);
    });
    return map;
  }, [template]);

  // resetar escolhas ao trocar capítulo
  useEffect(() => {
    const init: Record<string, Card | null> = {};
    template.slots.forEach((s) => (init[s.id] = null));
    setSelected(init);
  }, [template]);

  // inicializar contexto de áudio
  useEffect(() => {
    const handler = () => {
      if (audioInitRef.current) return;
      audioInitRef.current = true;
    };
    if (typeof document !== "undefined") {
      document.addEventListener("click", handler, { once: true });
      return () => document.removeEventListener("click", handler);
    }
  }, []);

  // fala do Leo
  function speak(text: string) {
    setLeoSpeech(text);
    if (typeof window === "undefined") return;
    if (!soundOn || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-BR";
    utter.rate = 0.98;
    utter.pitch = 1.05;
    window.speechSynthesis.speak(utter);
  }

  function handlePick(slotId: string, card: Card | null) {
    setSelected((prev) => ({ ...prev, [slotId]: card }));
    if (card) speak(card.label);
  }

  function isStoryComplete() {
    return template.slots.every((s) => selected[s.id]);
  }

  function narrateStory() {
    const text = [
      `${template.baseText[0]} ${selected["acao_inicial"]?.label}.`,
      `${template.baseText[1]} ${selected["amigo"]?.label}.`,
      `${template.baseText[2]} ${selected["acao_juntos"]?.label}`,
      `${template.baseText[3]} ${selected["comida"]?.label}.`,
      `${template.baseText[4]} ${selected["fecho"]?.label}!`,
    ]
      .filter(Boolean)
      .join(" ");
    speak(text);
    setScore((s) => s + 300);
  }

  function nextChapter() {
    if (templateIdx + 1 < TEMPLATES.length) {
      setTemplateIdx((i) => i + 1);
      setScore((s) => s + 150);
      speak("Maravilha! Vamos para o próximo capítulo.");
    } else {
      speak("Você terminou as histórias desta versão! Em breve teremos mais capítulos.");
    }
  }

  function resetChapter() {
    const init: Record<string, Card | null> = {};
    template.slots.forEach((s) => (init[s.id] = null));
    setSelected(init);
    setLives(3);
    speak("Vamos recomeçar este capítulo. Escolha novamente os cards.");
  }

  // --- UI ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-violet-200 to-pink-200">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-violet-200">
        <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-lg hover:bg-violet-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-yellow-400 text-white font-bold shadow">
              <span className="text-xs">Pontos</span>{" "}
              <span className="ml-1">{score}</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-rose-400 text-white font-bold shadow">
              <span className="text-xs">Vidas</span>{" "}
              <span className="ml-1">{"❤️".repeat(lives)}</span>
            </div>
            <button
              onClick={() => setSoundOn((s) => !s)}
              className="p-2 rounded-lg hover:bg-violet-100"
            >
              {soundOn ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-3 md:p-6">
        {/* Título & Progresso */}
        <div className="bg-white/90 border-2 border-violet-200 rounded-2xl p-4 shadow-lg mb-4">
          <h1 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">
            Histórias Épicas — {TEMPLATES[templateIdx].title}
          </h1>
          <div className="mt-2 w-full bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-sky-400 text-white text-xs font-bold flex items-center justify-center"
              style={{
                width: `${((templateIdx + 1) / TEMPLATES.length) * 100}%`,
              }}
            >
              Capítulo {templateIdx + 1} / {TEMPLATES.length}
            </div>
          </div>
        </div>

        {/* Balão do Leo (mobile) */}
        <div className="relative mb-4">
          <div className="md:hidden flex items-center gap-3">
            <LeoBubble text={leoSpeech} />
          </div>
        </div>

        {/* Frase com lacunas */}
        <div className="bg-white/90 border-2 border-pink-200 rounded-2xl shadow-xl p-4 md:p-6 mb-6">
          <SentenceView template={template} selected={selected} />

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white font-bold hover:bg-green-600"
              onClick={() =>
                speak("Escolha os cards para completar a história.")
              }
            >
              <Play className="w-4 h-4" /> Ouça dica
            </button>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-600 text-white font-bold hover:bg-gray-700"
              onClick={resetChapter}
            >
              <RefreshCcw className="w-4 h-4" /> Recomeçar capítulo
            </button>
            {isStoryComplete() && (
              <>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                  onClick={narrateStory}
                >
                  <Volume2 className="w-4 h-4" /> Ouvir a história
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-white font-bold hover:bg-amber-600"
                  onClick={nextChapter}
                >
                  <Star className="w-4 h-4" /> Próximo capítulo
                </button>
              </>
            )}
          </div>
        </div>

        {/* Seleção de slots */}
        {template.slots.map((slot) => (
          <div
            key={slot.id}
            className="bg-white/90 border-2 border-violet-200 rounded-2xl shadow p-4 mb-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">{slot.title}</h3>
              {selected[slot.id] && (
                <button
                  className="text-sm text-rose-600 hover:underline"
                  onClick={() => handlePick(slot.id, null)}
                >
                  limpar escolha
                </button>
              )}
            </div>

            {!selected[slot.id] ? (
              <CardsGrid
                options={slotOptions[slot.id]}
                onPick={(c) => handlePick(slot.id, c)}
              />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl border">
                <CardThumb card={selected[slot.id] as Card} />
                <span className="text-sm text-gray-700">
                  Escolha feita. Você pode limpar e escolher outra.
                </span>
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Leo fixo no canto desktop */}
      <div className="hidden md:block fixed bottom-2 left-2 pointer-events-none z-30">
        <LeoCharacter text={leoSpeech} />
      </div>
    </div>
  );
}

// --- Subcomponentes ---
function SentenceView({
  template,
  selected,
}: {
  template: StoryTemplate;
  selected: Record<string, Card | null>;
}) {
  const pieces = [
    { text: template.baseText[0], slot: "acao_inicial" },
    { text: template.baseText[1], slot: "amigo" },
    { text: template.baseText[2], slot: "acao_juntos" },
    { text: template.baseText[3], slot: "comida" },
    { text: template.baseText[4], slot: "fecho" },
  ];
  return (
    <p className="text-lg leading-relaxed">
      {pieces.map((p, i) => (
        <span key={i} className="mr-2">
          {p.text}{" "}
          {selected[p.slot] ? (
            <strong className="text-indigo-600">
              {selected[p.slot]?.label}
            </strong>
          ) : (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
              [____]
            </span>
          )}
        </span>
      ))}
    </p>
  );
}

function CardsGrid({
  options,
  onPick,
}: {
  options: Card[];
  onPick: (c: Card) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {options.map((card) => (
        <button
          key={card.id}
          onClick={() => onPick(card)}
          className="flex flex-col items-center p-2 bg-white rounded-xl shadow hover:bg-violet-50 border"
        >
          <img
            src={card.image}
            alt={card.label}
            className="w-20 h-20 object-contain mb-1"
            onError={(e) =>
              ((e.target as HTMLImageElement).src =
                "/images/fallback-card.png")
            }
          />
          <span className="text-sm text-gray-700">{card.label}</span>
        </button>
      ))}
    </div>
  );
}

function CardThumb({ card }: { card: Card }) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={card.image}
        alt={card.label}
        className="w-16 h-16 object-contain"
        onError={(e) =>
          ((e.target as HTMLImageElement).src = "/images/fallback-card.png")
        }
      />
      <span className="text-xs text-gray-700">{card.label}</span>
    </div>
  );
}

function LeoCharacter({ text }: { text: string }) {
  return (
    <div className="flex items-end gap-2">
      <img
        src="/images/mascotes/leo/leo_mago_resultado.webp"
        alt="Leo"
        className="w-28 h-28 object-contain drop-shadow-xl"
        onError={(e) =>
          ((e.target as HTMLImageElement).src = "/images/fallback-leo.png")
        }
      />
      <div className="bg-white border-2 border-violet-300 rounded-xl p-3 shadow max-w-xs">
        <p className="text-sm text-gray-700">{text}</p>
      </div>
    </div>
  );
}

function LeoBubble({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/images/mascotes/leo/leo_mago_resultado.webp"
        alt="Leo"
        className="w-16 h-16 object-contain drop-shadow"
        onError={(e) =>
          ((e.target as HTMLImageElement).src = "/images/fallback-leo.png")
        }
      />
      <div className="bg-white border border-violet-200 rounded-lg p-2 shadow">
        <p className="text-xs text-gray-700">{text}</p>
      </div>
    </div>
  );
}
