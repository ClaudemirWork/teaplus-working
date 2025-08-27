'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, VolumeX, RefreshCcw, Play, ArrowLeft, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * HISTÓRIAS ÉPICAS — protótipo jogável
 *
 * ✔️ Feito para Next.js (App Router) + TailwindCSS
 * ✔️ Compatível com Netlify (sem acesso a FS; usa apenas client-side)
 * ✔️ Usa SpeechSynthesis (voz do Leo) e fallbacks visuais
 * ✔️ Estrutura de fases, pontuação, vidas e progressão
 * ✔️ Slots de história preenchidos por cartões (cards) com imagens do seu /public/images/cards
 * ✔️ Mascote Leo (mago) na tela com balão de fala
 *
 * Onde colocar:
 *  - Salve como `app/epic-stories/page.tsx` OU `app/jogos/epic-stories/page.tsx`
 *  - Tailwind já ativo no projeto (como no seu repositório)
 *  - As imagens devem existir em /public (os caminhos abaixo seguem seu padrão)
 */

// --- Tipos ---
interface Card {
  id: string;
  label: string;
  image: string; // caminho sob /public
  category: 'acoes' | 'rotina' | 'alimentos' | 'animais' | 'core';
}

interface StorySlot {
  id: string;                 // identificador do slot
  title: string;              // texto guia exibido ao jogador
  categories: Card['category'][]; // de quais categorias puxar cards
  maxOptions?: number;        // limita quantas opções aparecem no grid
}

interface StoryTemplate {
  id: string;
  title: string;          // título da fase
  prompt: string;         // texto com lacunas ({{slotId}}) – só para referência
  slots: StorySlot[];     // slots clicáveis
  baseText: string[];     // pedaços fixos que narram junto das escolhas
}

// --- Catálogo de cards (curado a partir da sua lista). Você pode expandir sem mexer no jogo. ---
// Mantive apenas itens VERIFICADOS no seu log para evitar 404 no Netlify.
const CARDS: Card[] = [
  // Ações
  { id: 'brincar', label: 'Brincar', image: '/images/cards/rotina/brincar.webp', category: 'rotina' },
  { id: 'estudar', label: 'Estudar', image: '/images/cards/rotina/estudar.webp', category: 'rotina' },
  { id: 'ver_tv', label: 'Ver Televisão', image: '/images/cards/rotina/ver_televisao.webp', category: 'rotina' },
  { id: 'caminhar', label: 'Caminhar', image: '/images/cards/acoes/caminhar.webp', category: 'acoes' },
  { id: 'saltar', label: 'Saltar', image: '/images/cards/acoes/saltar.webp', category: 'acoes' },
  { id: 'ler_livro', label: 'Ler Livro', image: '/images/cards/acoes/ler_livro.webp', category: 'acoes' },

  // Alimentos
  { id: 'pizza', label: 'Pizza', image: '/images/cards/alimentos/pizza.webp', category: 'alimentos' },
  { id: 'banana', label: 'Banana', image: '/images/cards/alimentos/banana.webp', category: 'alimentos' },
  { id: 'salada', label: 'Salada', image: '/images/cards/alimentos/salada.webp', category: 'alimentos' },
  { id: 'suco_laranja', label: 'Suco de Laranja', image: '/images/cards/alimentos/suco_laranja.webp', category: 'alimentos' },

  // Animais (para "encontrou seu amigo")
  { id: 'cachorro', label: 'Cachorro', image: '/images/cards/animais/cachorro.webp', category: 'animais' },
  { id: 'gato', label: 'Gato', image: '/images/cards/animais/gato.webp', category: 'animais' },
  { id: 'coelho', label: 'Coelho', image: '/images/cards/animais/coelho.webp', category: 'animais' },
  { id: 'elefante', label: 'Elefante', image: '/images/cards/animais/elefante.webp', category: 'animais' },

  // Núcleo (expressões simples que ajudam a fechar a história)
  { id: 'obrigado', label: 'Obrigado', image: '/images/cards/core/obrigado.webp', category: 'core' },
  { id: 'sim', label: 'Sim', image: '/images/cards/core/sim.webp', category: 'core' },
  { id: 'mais', label: 'Mais', image: '/images/cards/core/mais.webp', category: 'core' },
];

// --- Fases/Modelos de Histórias ---
const TEMPLATES: StoryTemplate[] = [
  {
    id: 'fase_1',
    title: 'Capítulo 1 — A Primeira Aventura',
    // Referência de como o texto é composto (não exibimos com {{}}).
    prompt: 'Era uma vez uma criança que queria {{acao_inicial}}. No caminho, encontrou um {{amigo}}. Juntos foram {{acao_juntos}} e depois comeram {{comida}}. No final disseram {{fecho}}.',
    baseText: [
      'Era uma vez uma criança que queria',
      'No caminho, encontrou um',
      'Juntos foram',
      'e depois comeram',
      'No final disseram'
    ],
    slots: [
      { id: 'acao_inicial', title: 'Escolha o começo', categories: ['rotina', 'acoes'], maxOptions: 6 },
      { id: 'amigo', title: 'Quem encontrou?', categories: ['animais'], maxOptions: 6 },
      { id: 'acao_juntos', title: 'O que fizeram?', categories: ['acoes', 'rotina'], maxOptions: 6 },
      { id: 'comida', title: 'O que comeram?', categories: ['alimentos'], maxOptions: 6 },
      { id: 'fecho', title: 'Como terminou?', categories: ['core'], maxOptions: 4 },
    ],
  },
  {
    id: 'fase_2',
    title: 'Capítulo 2 — Aventuras no Parque',
    prompt: 'Hoje, a criança decidiu {{acao_inicial}}. Encontrou um {{amigo}} no caminho. Eles foram {{acao_juntos}} e beberam {{comida}}. No final disseram {{fecho}}.',
    baseText: [
      'Hoje, a criança decidiu',
      'Encontrou um',
      'Eles foram',
      'e beberam',
      'No final disseram'
    ],
    slots: [
      { id: 'acao_inicial', title: 'Começo', categories: ['acoes', 'rotina'], maxOptions: 8 },
      { id: 'amigo', title: 'Quem?', categories: ['animais'], maxOptions: 8 },
      { id: 'acao_juntos', title: 'Fizeram o quê?', categories: ['acoes', 'rotina'], maxOptions: 8 },
      { id: 'comida', title: 'Beberam/Comeram', categories: ['alimentos'], maxOptions: 8 },
      { id: 'fecho', title: 'Final', categories: ['core'], maxOptions: 4 },
    ],
  },
];

// Utilitário simples para tirar X itens aleatórios
function pickRandom<T>(arr: T[], n: number) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.max(1, n));
}

export default function EpicStoriesGame() {
  const router = useRouter();

  // Estado de jogo
  const [templateIdx, setTemplateIdx] = useState(0);
  const [selected, setSelected] = useState<Record<string, Card | null>>({});
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [soundOn, setSoundOn] = useState(true);
  const [leoSpeech, setLeoSpeech] = useState('Olá! Eu sou o Leo. Vamos criar uma história juntos?');
  const audioInitRef = useRef(false);

  const template = TEMPLATES[templateIdx];

  // Opções por slot (filtradas e randomizadas a cada mudança de slot/template)
  const slotOptions = useMemo(() => {
    const map: Record<string, Card[]> = {};
    template.slots.forEach((slot) => {
      const pool = CARDS.filter((c) => slot.categories.includes(c.category));
      map[slot.id] = pickRandom(pool, slot.maxOptions ?? 6);
    });
    return map;
  }, [template]);

  // Inicializa seleção dos slots ao trocar de template
  useEffect(() => {
    const init: Record<string, Card | null> = {};
    template.slots.forEach((s) => (init[s.id] = null));
    setSelected(init);
  }, [template]);

  // Inicializa contexto de áudio no primeiro clique (evita bloqueio iOS/Chrome)
  useEffect(() => {
    const handler = () => {
      if (audioInitRef.current) return;
      audioInitRef.current = true;
      // nada a fazer além de marcar; SpeechSynthesis já funciona assim
    };
    document.addEventListener('click', handler, { once: true });
    return () => document.removeEventListener('click', handler);
  }, []);

  // Falar com o Leo
  function speak(text: string) {
    setLeoSpeech(text);
    if (typeof window === 'undefined') return;
    if (!soundOn || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    utter.rate = 0.98;
    utter.pitch = 1.05;
    window.speechSynthesis.speak(utter);
  }

  function handlePick(slotId: string, card: Card) {
    setSelected((prev) => ({ ...prev, [slotId]: card }));
    speak(`${card.label}`);
  }

  function isStoryComplete() {
    return template.slots.every((s) => selected[s.id]);
  }

  function narrateStory() {
    // Junta a narrativa final com as escolhas
    const text = [
      `${template.baseText[0]} ${selected['acao_inicial']?.label}.`,
      `${template.baseText[1]} ${selected['amigo']?.label}.`,
      `${template.baseText[2]} ${selected['acao_juntos']?.label}`,
      `${template.baseText[3]} ${selected['comida']?.label}.`,
      `${template.baseText[4]} ${selected['fecho']?.label}!`,
    ]
      .filter(Boolean)
      .join(' ');

    speak(text);
    setScore((s) => s + 300); // bônus por história completa
  }

  function nextChapter() {
    if (templateIdx + 1 < TEMPLATES.length) {
      setTemplateIdx((i) => i + 1);
      setScore((s) => s + 150); // recompensa por avançar
      speak('Maravilha! Vamos para o próximo capítulo.');
    } else {
      speak('Você terminou as histórias desta versão! Em breve teremos mais capítulos.');
    }
  }

  function resetChapter() {
    const init: Record<string, Card | null> = {};
    template.slots.forEach((s) => (init[s.id] = null));
    setSelected(init);
    setLives(3);
    speak('Vamos recomeçar este capítulo. Escolha novamente os cards.');
  }

  // --- UI ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-violet-200 to-pink-200">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-violet-200">
        <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between">
          <button onClick={() => router.push('/')} className="p-2 rounded-lg hover:bg-violet-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-lg bg-yellow-400 text-white font-bold shadow">
              <span className="text-xs">Pontos</span> <span className="ml-1">{score}</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-rose-400 text-white font-bold shadow">
              <span className="text-xs">Vidas</span> <span className="ml-1">{'❤️'.repeat(lives)}</span>
            </div>
            <button onClick={() => setSoundOn((s) => !s)} className="p-2 rounded-lg hover:bg-violet-100">
              {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
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
              style={{ width: `${((templateIdx + 1) / TEMPLATES.length) * 100}%` }}
            >
              Capítulo {templateIdx + 1} / {TEMPLATES.length}
            </div>
          </div>
        </div>

        {/* Balão do Leo (narrador) */}
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
              onClick={() => speak('Escolha os cards para completar a história.')}>
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
          <div key={slot.id} className="bg-white/90 border-2 border-violet-200 rounded-2xl shadow p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">{slot.title}</h3>
              {selected[slot.id] && (
                <button
                  className="text-sm text-rose-600 hover:underline"
                  onClick={() => handlePick(slot.id, null as unknown as Card)}
                >
                  limpar escolha
                </button>
              )}
            </div>

            {!selected[slot.id] ? (
              <CardsGrid options={slotOptions[slot.id]} onPick={(c) => handlePick(slot.id, c)} />
            ) : (
              <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl border">
                <CardThumb card={selected[slot.id] as Card} />
                <span className="text-sm text-gray-700">Escolha feita. Você pode limpar e escolher outra.</span>
              </div>
            )}
          </div>
        ))}
      </main>

      {/* Leo fixo no canto no desktop */}
      <div className="hidden md:block fixed bottom-2 left-2 pointer-events-none z-30">
        <LeoCharacter text={leoSpeech} />
      </div>
    </div>
  );
}

// --- Subcomponentes ---
function SentenceView({ template, selected }: { template: StoryTemplate; selected: Record<string, Card | null> }) {
  // Renderiza: [texto fixo] [chip selecionado ou lacuna]
  const pieces = [
    { text: template.baseText[0], slot: 'acao_inicial' },
    { text: template.baseText[1], slot: 'amigo' },
    { text: template.baseText[2], slot: 'acao_juntos' },
    { text: template.baseText[3], slot: 'comida' },
    { text: template.baseText[4], slot: 'fecho' },
  ];
  return (
    <div className="text-lg leading-relaxed text-gray-800">
      {pieces.map((p, idx) => (
        <span key={p.slot} className="mr-2">
          <span>{p.text} </span>
          <span className="inline-flex align-middle">
            {selected[p.slot] ? (
              <span className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-full px-3 py-1 text-sm font-semibold">
                <img src={(selected[p.slot] as Card).image}
                     alt={(selected[p.slot] as Card).label}
                     className="w-6 h-6 object-contain"
                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                {(selected[p.slot] as Card).label}
              </span>
            ) : (
              <span className="inline-block min-w-[90px] text-center italic text-gray-500 bg-gray-100 border border-dashed border-gray-300 rounded-full px-3 py-1">
                (escolha)
              </span>
            )}
          </span>
          {idx < pieces.length - 1 && ' '}
        </span>
      ))}
    </div>
  );
}

function CardsGrid({ options, onPick }: { options: Card[]; onPick: (c: Card) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {options.map((c) => (
        <button
          key={c.id}
          onClick={() => onPick(c)}
          className="p-2 bg-white rounded-xl shadow border-2 border-violet-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
        >
          <div className="aspect-square">
            <img
              src={c.image}
              alt={c.label}
              className="w-full h-full object-contain rounded"
              onError={(e) => {
                const img = e.currentTarget;
                img.style.display = 'none';
                const holder = img.parentElement;
                if (holder && !holder.querySelector('.fallback')) {
                  const div = document.createElement('div');
                  div.className = 'fallback w-full h-full rounded flex items-center justify-center bg-gradient-to-br from-violet-100 to-pink-100';
                  div.innerHTML = '<span class="text-2xl">🃏</span>';
                  holder.appendChild(div);
                }
              }}
            />
          </div>
          <p className="mt-1 text-center text-sm font-bold text-gray-700">{c.label}</p>
        </button>
      ))}
    </div>
  );
}

function CardThumb({ card }: { card: Card }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-12">
        <img src={card.image} alt={card.label} className="w-full h-full object-contain rounded"
             onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
      </div>
      <span className="font-semibold text-gray-800">{card.label}</span>
    </div>
  );
}

function LeoCharacter({ text }: { text: string }) {
  return (
    <div className="relative pointer-events-none">
      <div className="w-60 h-60">
        <img
          src="/images/mascotes/leo/leo_mago_resultado.webp"
          alt="Leo Mago"
          className="w-full h-full object-contain drop-shadow-2xl"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div className="absolute -top-2 left-52 bg-white border-2 border-amber-300 shadow-2xl rounded-2xl p-3 w-[320px]">
        <div className="absolute -left-3 bottom-6 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[12px] border-t-transparent border-b-transparent border-r-amber-300" />
        <p className="text-sm font-semibold text-gray-800">{text}</p>
      </div>
    </div>
  );
}

function LeoBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-20 h-20">
        <img
          src="/images/mascotes/leo/leo_mago_resultado.webp"
          alt="Leo Mago"
          className="w-full h-full object-contain drop-shadow"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <div className="flex-1 bg-white border-2 border-amber-300 rounded-2xl p-3">
        <p className="text-sm font-semibold text-gray-800">{text}</p>
      </div>
    </div>
  );
}
