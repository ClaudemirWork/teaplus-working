'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Heart, Star, Users, Compass, Play, Volume2, VolumeX, Sparkles, Clock, Gem, Trophy, Key, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './emotionmaze.module.css';

// Sistema de Power-ups SIMPLIFICADO
const POWERUPS = {
  wallPass: {
    name: 'Atravessador',
    icon: '🕐',
    duration: 30,
    color: '#9C27B0',
    description: 'Atravesse paredes!'
  },
  reveal: {
    name: 'Visão',
    icon: '👁️',
    duration: 15,
    color: '#2196F3',
    description: 'Revela segredos!'
  },
  doublePoints: {
    name: 'Pontos x2',
    icon: '✨',
    duration: 20,
    color: '#FFD700',
    description: 'Pontos em dobro!'
  }
};

// Configuração de sons
const SOUNDS = {
  footstep: '/sounds/footstep.wav',
  gem: '/sounds/coin.wav',
  powerup: '/sounds/magic.wav',
  megaGem: '/sounds/sucess.wav',
  key: '/sounds/coin.wav',
  door: '/sounds/magic.wav',
  levelComplete: '/sounds/sucess.wav'
};

// Função para tocar som
const playSound = (soundName: keyof typeof SOUNDS, volume: number = 0.3) => {
  try {
    const audio = new Audio(SOUNDS[soundName]);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (error) {
    console.log('Som não encontrado:', soundName);
  }
};

// Mensagens motivacionais
const MOTIVATIONAL_MESSAGES = [
  'INCRÍVEL!',
  'SENSACIONAL!',
  'FANTÁSTICO!',
  'VOCÊ É DEMAIS!',
  'SUPER!',
  'ESPETACULAR!',
  'MARAVILHOSO!',
  'GENIAL!'
];

// Tipos de emoções
const EMOTIONS = {
  joy: { name: 'Alegria', icon: '😊', color: '#FFE066' },
  calm: { name: 'Calma', icon: '😌', color: '#B2DFDB' },
  courage: { name: 'Coragem', icon: '💪', color: '#7E57C2' },
  sadness: { name: 'Tristeza', icon: '😢', color: '#64B5F6' },
  fear: { name: 'Medo', icon: '😰', color: '#757575' },
  mirror: { name: 'Espelho', icon: '🪞', color: '#E91E63' }
};

// NPCs
const NPCS = [
  { id: 'bunny', emoji: '🐰', name: 'Coelhinho' },
  { id: 'bird', emoji: '🐦', name: 'Passarinho' },
  { id: 'cat', emoji: '🐱', name: 'Gatinho' },
  { id: 'dog', emoji: '🐶', name: 'Cachorrinho' },
  { id: 'butterfly', emoji: '🦋', name: 'Borboleta' },
  { id: 'turtle', emoji: '🐢', name: 'Tartaruga' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'fox', emoji: '🦊', name: 'Raposa' },
  { id: 'owl', emoji: '🦉', name: 'Coruja' },
  { id: 'penguin', emoji: '🐧', name: 'Pinguim' }
];

// Função para criar labirinto 8x8 básico
const createMaze8x8 = (complexity: number = 1): number[][] => {
  const maze = Array(8).fill(null).map(() => Array(8).fill(1));
  
  if (complexity === 1) {
    // Labirinto muito simples - caminho direto
    for (let i = 1; i < 7; i++) {
      for (let j = 1; j < 7; j++) {
        maze[i][j] = 0;
      }
    }
    // Adiciona algumas paredes internas
    maze[3][3] = 1;
    maze[3][4] = 1;
    maze[4][3] = 1;
  } else if (complexity === 2) {
    // Labirinto médio
    for (let i = 1; i < 7; i++) {
      for (let j = 1; j < 7; j++) {
        maze[i][j] = 0;
      }
    }
    maze[2][3] = 1;
    maze[3][3] = 1;
    maze[4][4] = 1;
    maze[5][4] = 1;
    maze[3][5] = 1;
  } else {
    // Labirinto complexo
    for (let i = 1; i < 7; i++) {
      for (let j = 1; j < 7; j++) {
        maze[i][j] = 0;
      }
    }
    maze[2][2] = 1;
    maze[2][5] = 1;
    maze[3][3] = 1;
    maze[4][3] = 1;
    maze[5][2] = 1;
    maze[5][5] = 1;
  }
  
  return maze;
};

// CONFIGURAÇÃO DOS 30 NÍVEIS - PROGRESSÃO CORRIGIDA
const LEVELS = [
  // MUNDO 1 - INTRODUÇÃO PROGRESSIVA (Níveis 1-10)
  {
    id: 1,
    name: 'Primeiro Passo',
    story: 'Apenas chegue ao final! Sem pressão!',
    emotion: 'joy',
    size: 8,
    grid: createMaze8x8(1),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [],
    gems: [], // SEM ITENS!
    specialGems: [],
    megaGems: [],
    powerups: [],
    keys: [],
    doors: [],
    perfectTime: 30
  },
  {
    id: 2,
    name: 'Primeira Gema',
    story: 'Pegue sua primeira gema!',
    emotion: 'joy',
    size: 8,
    grid: createMaze8x8(1),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [],
    gems: [{ x: 4, y: 4, type: 'normal' }], // APENAS 1 GEMA
    specialGems: [],
    megaGems: [],
    powerups: [],
    keys: [],
    doors: [],
    perfectTime: 35
  },
  {
    id: 3,
    name: 'Três Tesouros',
    story: 'Agora são 3 gemas para coletar!',
    emotion: 'joy',
    size: 8,
    grid: createMaze8x8(1),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [],
    gems: [
      { x: 2, y: 2, type: 'normal' },
      { x: 5, y: 3, type: 'normal' },
      { x: 3, y: 5, type: 'normal' }
    ], // 3 GEMAS
    specialGems: [],
    megaGems: [],
    powerups: [],
    keys: [],
    doors: [],
    perfectTime: 40
  },
  {
    id: 4,
    name: 'Conhecendo Amigos',
    story: 'O Coelhinho precisa de ajuda!',
    emotion: 'joy',
    size: 8,
    grid: createMaze8x8(1),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[0], x: 4, y: 2 }], // Primeiro NPC
    gems: [
      { x: 2, y: 3, type: 'normal' },
      { x: 5, y: 4, type: 'normal' },
      { x: 3, y: 1, type: 'normal' }
    ],
    specialGems: [],
    megaGems: [],
    powerups: [],
    keys: [],
    doors: [],
    perfectTime: 45
  },
  {
    id: 5,
    name: 'Poder Mágico',
    story: 'Use o poder para atravessar paredes!',
    emotion: 'calm',
    size: 8,
    grid: createMaze8x8(2),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[1], x: 5, y: 5 }],
    gems: [
      { x: 2, y: 2, type: 'normal' },
      { x: 4, y: 1, type: 'normal' },
      { x: 3, y: 3, type: 'normal' } // Dentro da parede!
    ],
    specialGems: [],
    megaGems: [],
    powerups: [{ x: 1, y: 5, type: 'wallPass' }], // Power-up para pegar gema na parede
    keys: [],
    doors: [],
    perfectTime: 50
  },
  {
    id: 6,
    name: 'Gema Especial',
    story: 'Uma gema especial vale 500 pontos!',
    emotion: 'calm',
    size: 8,
    grid: createMaze8x8(2),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[2], x: 3, y: 2 }],
    gems: [
      { x: 2, y: 4, type: 'normal' },
      { x: 5, y: 2, type: 'normal' }
    ],
    specialGems: [{ x: 4, y: 5, type: 'special' }], // Primeira gema especial
    megaGems: [],
    powerups: [{ x: 1, y: 3, type: 'doublePoints' }],
    keys: [],
    doors: [],
    perfectTime: 55
  },
  {
    id: 7,
    name: 'MEGA GEMA!',
    story: 'A MEGA GEMA vale 1000 pontos!',
    emotion: 'courage',
    size: 8,
    grid: createMaze8x8(2),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[3], x: 4, y: 4 }],
    gems: [
      { x: 2, y: 2, type: 'normal' },
      { x: 5, y: 3, type: 'normal' },
      { x: 1, y: 4, type: 'normal' }
    ],
    specialGems: [{ x: 6, y: 1, type: 'special' }],
    megaGems: [{ x: 3, y: 6, type: 'mega' }], // Primeira MEGA GEMA!
    powerups: [],
    keys: [],
    doors: [],
    perfectTime: 60
  },
  {
    id: 8,
    name: 'Porta e Chave',
    story: 'Pegue a chave para abrir a porta!',
    emotion: 'courage',
    size: 8,
    grid: (() => {
      const maze = createMaze8x8(2);
      // Cria um caminho bloqueado
      maze[4][2] = 0;
      maze[4][3] = 0;
      maze[4][4] = 0;
      maze[4][5] = 0;
      return maze;
    })(),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[4], x: 5, y: 5 }],
    gems: [
      { x: 2, y: 2, type: 'normal' },
      { x: 5, y: 4, type: 'normal' }
    ],
    specialGems: [],
    megaGems: [],
    powerups: [],
    keys: [{ x: 1, y: 5, id: 'key1' }], // Chave acessível
    doors: [{ x: 4, y: 3, keyId: 'key1' }], // Porta no caminho
    perfectTime: 65
  },
  {
    id: 9,
    name: 'Desafio Completo',
    story: 'Use tudo que aprendeu!',
    emotion: 'sadness',
    size: 8,
    grid: createMaze8x8(3),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[5], x: 3, y: 4 }],
    gems: [
      { x: 2, y: 1, type: 'normal' },
      { x: 4, y: 2, type: 'normal' },
      { x: 5, y: 5, type: 'normal' }
    ],
    specialGems: [{ x: 1, y: 3, type: 'special' }],
    megaGems: [{ x: 6, y: 2, type: 'mega' }],
    powerups: [
      { x: 3, y: 1, type: 'doublePoints' },
      { x: 5, y: 3, type: 'wallPass' }
    ],
    keys: [],
    doors: [],
    perfectTime: 70
  },
  {
    id: 10,
    name: 'Teste Final',
    story: 'Complete o primeiro mundo!',
    emotion: 'fear',
    size: 8,
    grid: createMaze8x8(3),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[6], x: 4, y: 3 }],
    gems: [
      { x: 2, y: 2, type: 'normal' },
      { x: 3, y: 5, type: 'normal' },
      { x: 5, y: 1, type: 'normal' },
      { x: 6, y: 4, type: 'normal' }
    ],
    specialGems: [
      { x: 1, y: 4, type: 'special' },
      { x: 4, y: 6, type: 'special' }
    ],
    megaGems: [{ x: 3, y: 3, type: 'mega' }], // Dentro da parede!
    powerups: [
      { x: 1, y: 2, type: 'wallPass' }, // Para pegar a mega gema
      { x: 6, y: 5, type: 'doublePoints' }
    ],
    keys: [{ x: 2, y: 6, id: 'key1' }],
    doors: [{ x: 5, y: 4, keyId: 'key1' }],
    perfectTime: 80
  },

  // MUNDO 2 - DESAFIOS (Níveis 11-20)
  {
    id: 11,
    name: 'Novo Desafio',
    story: 'O segundo mundo começa!',
    emotion: 'joy',
    size: 8,
    grid: createMaze8x8(2),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[7], x: 3, y: 3 }],
    gems: [
      { x: 2, y: 3, type: 'normal' },
      { x: 4, y: 2, type: 'normal' },
      { x: 5, y: 5, type: 'normal' }
    ],
    specialGems: [{ x: 1, y: 5, type: 'special' }],
    megaGems: [],
    powerups: [{ x: 6, y: 1, type: 'reveal' }],
    keys: [],
    doors: [],
    perfectTime: 70
  },
  {
    id: 12,
    name: 'Dupla Porta',
    story: 'Duas portas, duas chaves!',
    emotion: 'calm',
    size: 8,
    grid: (() => {
      const maze = createMaze8x8(2);
      maze[3][1] = 0;
      maze[3][2] = 0;
      maze[3][4] = 0;
      maze[3][5] = 0;
      maze[3][6] = 0;
      return maze;
    })(),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[8], x: 4, y: 4 }],
    gems: [
      { x: 2, y: 2, type: 'normal' },
      { x: 5, y: 3, type: 'normal' },
      { x: 3, y: 5, type: 'normal' }
    ],
    specialGems: [
      { x: 6, y: 2, type: 'special' }
    ],
    megaGems: [{ x: 1, y: 6, type: 'mega' }],
    powerups: [{ x: 4, y: 1, type: 'doublePoints' }],
    keys: [
      { x: 1, y: 2, id: 'key1' },
      { x: 6, y: 5, id: 'key2' }
    ],
    doors: [
      { x: 3, y: 2, keyId: 'key1' },
      { x: 3, y: 5, keyId: 'key2' }
    ],
    perfectTime: 80
  },
  {
    id: 13,
    name: 'Labirinto Secreto',
    story: 'Descubra os segredos escondidos!',
    emotion: 'courage',
    size: 8,
    grid: createMaze8x8(3),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[9], x: 5, y: 4 }],
    gems: [
      { x: 2, y: 1, type: 'normal' },
      { x: 3, y: 4, type: 'normal' },
      { x: 5, y: 2, type: 'normal' },
      { x: 4, y: 5, type: 'normal' }
    ],
    specialGems: [
      { x: 1, y: 3, type: 'special' },
      { x: 6, y: 3, type: 'special' }
    ],
    megaGems: [],
    powerups: [
      { x: 2, y: 5, type: 'wallPass' },
      { x: 5, y: 1, type: 'reveal' }
    ],
    keys: [],
    doors: [],
    perfectTime: 85
  },
  {
    id: 14,
    name: 'Tesouro Protegido',
    story: 'A mega gema está protegida!',
    emotion: 'sadness',
    size: 8,
    grid: (() => {
      const maze = createMaze8x8(3);
      // Área protegida para mega gema
      maze[5][5] = 0;
      maze[5][6] = 0;
      maze[6][5] = 0;
      return maze;
    })(),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[0], x: 3, y: 2 }],
    gems: [
      { x: 2, y: 3, type: 'normal' },
      { x: 4, y: 1, type: 'normal' },
      { x: 3, y: 5, type: 'normal' }
    ],
    specialGems: [
      { x: 1, y: 4, type: 'special' },
      { x: 5, y: 3, type: 'special' }
    ],
    megaGems: [
      { x: 5, y: 5, type: 'mega' } // Atrás da porta!
    ],
    powerups: [
      { x: 2, y: 1, type: 'doublePoints' },
      { x: 4, y: 4, type: 'wallPass' }
    ],
    keys: [{ x: 1, y: 6, id: 'key1' }],
    doors: [{ x: 4, y: 5, keyId: 'key1' }],
    perfectTime: 90
  },
  {
    id: 15,
    name: 'Três Chaves',
    story: 'Três chaves, três portas!',
    emotion: 'fear',
    size: 8,
    grid: createMaze8x8(3),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[1], x: 4, y: 3 }],
    gems: [
      { x: 2, y: 2, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
      { x: 5, y: 4, type: 'normal' }
    ],
    specialGems: [
      { x: 1, y: 5, type: 'special' },
      { x: 6, y: 2, type: 'special' }
    ],
    megaGems: [{ x: 3, y: 6, type: 'mega' }],
    powerups: [
      { x: 2, y: 4, type: 'reveal' },
      { x: 5, y: 1, type: 'doublePoints' }
    ],
    keys: [
      { x: 1, y: 2, id: 'key1' },
      { x: 6, y: 1, id: 'key2' },
      { x: 1, y: 6, id: 'key3' }
    ],
    doors: [
      { x: 2, y: 3, keyId: 'key1' },
      { x: 4, y: 2, keyId: 'key2' },
      { x: 3, y: 5, keyId: 'key3' }
    ],
    perfectTime: 95
  },
  {
    id: 16,
    name: 'Gemas Escondidas',
    story: 'Use o poder para encontrar tudo!',
    emotion: 'joy',
    size: 8,
    grid: createMaze8x8(3),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[2], x: 3, y: 4 }],
    gems: [
      { x: 2, y: 1, type: 'normal' },
      { x: 4, y: 2, type: 'normal' },
      { x: 5, y: 5, type: 'normal' },
      { x: 3, y: 3, type: 'normal' }, // Dentro da parede
      { x: 4, y: 3, type: 'normal' }  // Dentro da parede
    ],
    specialGems: [
      { x: 1, y: 3, type: 'special' },
      { x: 6, y: 4, type: 'special' }
    ],
    megaGems: [],
    powerups: [
      { x: 1, y: 5, type: 'wallPass' }, // Essencial para gemas nas paredes
      { x: 6, y: 1, type: 'doublePoints' }
    ],
    keys: [],
    doors: [],
    perfectTime: 100
  },
  {
    id: 17,
    name: 'Dupla Mega',
    story: 'Duas mega gemas em um nível!',
    emotion: 'calm',
    size: 8,
    grid: createMaze8x8(3),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[3], x: 4, y: 4 }],
    gems: [
      { x: 2, y: 3, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
      { x: 5, y: 3, type: 'normal' }
    ],
    specialGems: [
      { x: 1, y: 4, type: 'special' },
      { x: 6, y: 1, type: 'special' },
      { x: 3, y: 5, type: 'special' }
    ],
    megaGems: [
      { x: 2, y: 2, type: 'mega' }, // Dentro da parede
      { x: 5, y: 5, type: 'mega' }  // Dentro da parede
    ],
    powerups: [
      { x: 1, y: 2, type: 'wallPass' },
      { x: 4, y: 1, type: 'doublePoints' },
      { x: 6, y: 3, type: 'reveal' }
    ],
    keys: [],
    doors: [],
    perfectTime: 110
  },
  {
    id: 18,
    name: 'Labirinto Complexo',
    story: 'O desafio aumenta!',
    emotion: 'courage',
    size: 8,
    grid: createMaze8x8(3),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[4], x: 3, y: 3 }],
    gems: [
      { x: 1, y: 2, type: 'normal' },
      { x: 2, y: 4, type: 'normal' },
      { x: 4, y: 1, type: 'normal' },
      { x: 5, y: 3, type: 'normal' },
      { x: 6, y: 5, type: 'normal' }
    ],
    specialGems: [
      { x: 2, y: 6, type: 'special' },
      { x: 4, y: 5, type: 'special' },
      { x: 5, y: 2, type: 'special' }
    ],
    megaGems: [
      { x: 3, y: 6, type: 'mega' },
      { x: 6, y: 1, type: 'mega' }
    ],
    powerups: [
      { x: 1, y: 3, type: 'wallPass' },
      { x: 3, y: 1, type: 'doublePoints' }
    ],
    keys: [{ x: 2, y: 5, id: 'key1' }],
    doors: [{ x: 4, y: 4, keyId: 'key1' }],
    perfectTime: 120
  },
  {
    id: 19,
    name: 'Penúltimo Desafio',
    story: 'Quase no final do segundo mundo!',
    emotion: 'sadness',
    size: 8,
    grid: createMaze8x8(3),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[5], x: 5, y: 4 }],
    gems: [
      { x: 2, y: 1, type: 'normal' },
      { x: 3, y: 2, type: 'normal' },
      { x: 4, y: 4, type: 'normal' },
      { x: 5, y: 5, type: 'normal' }
    ],
    specialGems: [
      { x: 1, y: 3, type: 'special' },
      { x: 3, y: 5, type: 'special' },
      { x: 6, y: 2, type: 'special' }
    ],
    megaGems: [
      { x: 2, y: 5, type: 'mega' }, // Dentro da parede
      { x: 5, y: 1, type: 'mega' }
    ],
    powerups: [
      { x: 1, y: 5, type: 'wallPass' },
      { x: 3, y: 1, type: 'doublePoints' },
      { x: 6, y: 4, type: 'reveal' }
    ],
    keys: [
      { x: 1, y: 6, id: 'key1' },
      { x: 6, y: 1, id: 'key2' }
    ],
    doors: [
      { x: 3, y: 4, keyId: 'key1' },
      { x: 5, y: 3, keyId: 'key2' }
    ],
    perfectTime: 130
  },
  {
    id: 20,
    name: 'Grande Final',
    story: 'O último desafio antes do mundo espelhado!',
    emotion: 'fear',
    size: 8,
    grid: createMaze8x8(3),
    start: { x: 1, y: 1 },
    end: { x: 6, y: 6 },
    npcs: [{ type: NPCS[6], x: 4, y: 3 }],
    gems: [
      { x: 1, y: 2, type: 'normal' },
      { x: 2, y: 4, type: 'normal' },
      { x: 3, y: 1, type: 'normal' },
      { x: 4, y: 5, type: 'normal' },
      { x: 5, y: 3, type: 'normal' },
      { x: 6, y: 4, type: 'normal' }
    ],
    specialGems: [
      { x: 2, y: 6, type: 'special' },
      { x: 3, y: 2, type: 'special' },
      { x: 5, y: 1, type: 'special' },
      { x: 6, y: 5, type: 'special' }
    ],
    megaGems: [
      { x: 2, y: 2, type: 'mega' }, // Dentro da parede
      { x: 3, y: 3, type: 'mega' }, // Dentro da parede
      { x: 5, y: 5, type: 'mega' }  // Dentro da parede
    ],
    powerups: [
      { x: 1, y: 3, type: 'wallPass' },
      { x: 2, y: 5, type: 'doublePoints' },
      { x: 6, y: 2, type: 'reveal' }
    ],
    keys: [
      { x: 1, y: 5, id: 'key1' },
      { x: 6, y: 1, id: 'key2' },
      { x: 1, y: 6, id: 'key3' }
    ],
    doors: [
      { x: 2, y: 3, keyId: 'key1' },
      { x: 4, y: 2, keyId: 'key2' },
      { x: 5, y: 4, keyId: 'key3' }
    ],
    perfectTime: 150
  }
];

// Função para espelhar níveis
const mirrorLevel = (level: any, newId: number) => {
  const mirrored = { ...level };
  mirrored.id = newId;
  mirrored.name = `${level.name} (Espelhado)`;
  mirrored.story = `Versão espelhada: ${level.story}`;
  mirrored.emotion = 'mirror';
  
  const mirrorX = (x: number) => 7 - x;
  
  mirrored.start = { x: mirrorX(level.start.x), y: level.start.y };
  mirrored.end = { x: mirrorX(level.end.x), y: level.end.y };
  
  mirrored.npcs = level.npcs.map((npc: any) => ({
    ...npc,
    type: NPCS[9 - (NPCS.indexOf(npc.type) % 10)],
    x: mirrorX(npc.x),
    y: npc.y
  }));
  
  mirrored.gems = level.gems.map((gem: any) => ({
    ...gem,
    x: mirrorX(gem.x)
  }));
  
  mirrored.specialGems = level.specialGems.map((gem: any) => ({
    ...gem,
    x: mirrorX(gem.x)
  }));
  
  mirrored.megaGems = level.megaGems.map((gem: any) => ({
    ...gem,
    x: mirrorX(gem.x)
  }));
  
  mirrored.powerups = level.powerups.map((p: any) => ({
    ...p,
    x: mirrorX(p.x)
  }));
  
  mirrored.keys = level.keys.map((k: any) => ({
    ...k,
    x: mirrorX(k.x)
  }));
  
  mirrored.doors = level.doors.map((d: any) => ({
    ...d,
    x: mirrorX(d.x)
  }));
  
  mirrored.grid = level.grid.map((row: number[]) => [...row].reverse());
  
  return mirrored;
};

// Adiciona os níveis espelhados (21-30)
const MIRROR_LEVELS = LEVELS.slice(0, 10).map((level, index) => 
  mirrorLevel(level, 21 + index)
);

// Todos os níveis juntos
const ALL_LEVELS = [...LEVELS, ...MIRROR_LEVELS];

// COMPONENTE PRINCIPAL
export default function EmotionMaze() {
  const [gameState, setGameState] = useState<'intro' | 'story' | 'playing' | 'levelComplete' | 'gameComplete' | 'mirrorUnlocked'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
  const [collectedItems, setCollectedItems] = useState({
    gems: new Set<string>(),
    specialGems: new Set<string>(),
    megaGems: new Set<string>(),
    powerups: new Set<string>(),
    keys: new Set<string>(),
    npcs: new Set<string>()
  });
  const [openedDoors, setOpenedDoors] = useState(new Set<string>());
  const [activePowerup, setActivePowerup] = useState<string | null>(null);
  const [powerupTimeLeft, setPowerupTimeLeft] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCutscene, setShowCutscene] = useState(false);
  const [cutsceneContent, setCutsceneContent] = useState({ title: '', text: '', image: '' });
  const [isMobile, setIsMobile] = useState(false);

  const level = ALL_LEVELS[currentLevel];
  const currentEmotion = level?.emotion || 'joy';

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Power-up timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activePowerup && powerupTimeLeft > 0) {
      interval = setInterval(() => {
        setPowerupTimeLeft(prev => {
          if (prev <= 1) {
            setActivePowerup(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePowerup, powerupTimeLeft]);

  // Inicializar nível
  const initLevel = useCallback((levelIndex: number) => {
    const newLevel = ALL_LEVELS[levelIndex];
    setPlayerPosition(newLevel.start);
    setCollectedItems({
      gems: new Set(),
      specialGems: new Set(),
      megaGems: new Set(),
      powerups: new Set(),
      keys: new Set(),
      npcs: new Set()
    });
    setOpenedDoors(new Set());
    setActivePowerup(null);
    setPowerupTimeLeft(0);
    setMoves(0);
    setTimeElapsed(0);
    setScore(0);
  }, []);

  // Começar jogo
  const startGame = () => {
    setCurrentLevel(0);
    initLevel(0);
    setTotalScore(0);
    setGameState('story');
    
    setCutsceneContent({
      title: 'O Labirinto das Emoções',
      text: 'Ajude nossos amigos a coletar tesouros incríveis!',
      image: '🌈'
    });
    setShowCutscene(true);
  };

  // Começar nível
  const startLevel = () => {
    setShowCutscene(false);
    setGameState('playing');
  };

  // Criar explosão de mega gema
  const createMegaGemExplosion = () => {
    if (soundEnabled) playSound('megaGem', 0.5);
    
    const explosion = document.createElement('div');
    explosion.className = styles.megaGemExplosion;
    explosion.innerHTML = '🌟';
    document.body.appendChild(explosion);
    
    setTimeout(() => {
      document.body.removeChild(explosion);
    }, 1500);
    
    const container = document.querySelector(`.${styles.gameContainer}`);
    if (container) {
      container.classList.add(styles.screenShake);
      setTimeout(() => {
        container.classList.remove(styles.screenShake);
      }, 500);
    }
    
    const message = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    const messageEl = document.createElement('div');
    messageEl.className = styles.motivationalMessage;
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      document.body.removeChild(messageEl);
    }, 2000);
    
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = styles.goldParticle;
        particle.style.left = `${50 + (Math.random() - 0.5) * 30}%`;
        particle.style.top = '50%';
        particle.style.setProperty('--particle-x', `${(Math.random() - 0.5) * 200}px`);
        document.body.appendChild(particle);
        
        setTimeout(() => {
          document.body.removeChild(particle);
        }, 2000);
      }, i * 50);
    }
    
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FF6347']
    });
  };

  // Mover jogador - CORRIGIDO
  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState !== 'playing') return;

    const newPos = { ...playerPosition };
    
    // SEMPRE move 1 casa por vez
    switch(direction) {
      case 'up': 
        newPos.y = Math.max(0, newPos.y - 1); 
        break;
      case 'down': 
        newPos.y = Math.min(7, newPos.y + 1); 
        break;
      case 'left': 
        newPos.x = Math.max(0, newPos.x - 1); 
        break;
      case 'right': 
        newPos.x = Math.min(7, newPos.x + 1); 
        break;
    }

    // Verifica paredes
    const canPassWalls = activePowerup === 'wallPass';
    if (level.grid[newPos.y][newPos.x] === 1 && !canPassWalls) {
      return;
    }

    // Verifica portas CORRIGIDO
    const door = level.doors?.find(d => d.x === newPos.x && d.y === newPos.y);
    if (door) {
      if (!openedDoors.has(door.keyId)) {
        // Porta fechada
        if (collectedItems.keys.has(door.keyId)) {
          // Tem a chave - abre a porta
          setOpenedDoors(prev => new Set(prev).add(door.keyId));
          if (soundEnabled) playSound('door');
          // Agora pode passar
        } else {
          // Não tem a chave - não pode passar
          return;
        }
      }
      // Porta já aberta - pode passar normalmente
    }

    // Move o jogador
    setPlayerPosition(newPos);
    setMoves(prev => prev + 1);
    if (soundEnabled) playSound('footstep', 0.1);

    // Coleta de itens
    const posKey = `${newPos.x},${newPos.y}`;

    // Gemas normais
    const gem = level.gems?.find(g => g.x === newPos.x && g.y === newPos.y);
    if (gem && !collectedItems.gems.has(posKey)) {
      setCollectedItems(prev => ({
        ...prev,
        gems: new Set(prev.gems).add(posKey)
      }));
      const points = activePowerup === 'doublePoints' ? 200 : 100;
      setScore(prev => prev + points);
      if (soundEnabled) playSound('gem');
    }

    // Gemas especiais
    const specialGem = level.specialGems?.find(g => g.x === newPos.x && g.y === newPos.y);
    if (specialGem && !collectedItems.specialGems.has(posKey)) {
      setCollectedItems(prev => ({
        ...prev,
        specialGems: new Set(prev.specialGems).add(posKey)
      }));
      const points = activePowerup === 'doublePoints' ? 1000 : 500;
      setScore(prev => prev + points);
      if (soundEnabled) playSound('gem', 0.4);
      
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.5 }
      });
    }

    // MEGA GEMAS
    const megaGem = level.megaGems?.find(g => g.x === newPos.x && g.y === newPos.y);
    if (megaGem && !collectedItems.megaGems.has(posKey)) {
      setCollectedItems(prev => ({
        ...prev,
        megaGems: new Set(prev.megaGems).add(posKey)
      }));
      const points = activePowerup === 'doublePoints' ? 2000 : 1000;
      setScore(prev => prev + points);
      createMegaGemExplosion();
    }

    // Power-ups
    const powerup = level.powerups?.find(p => p.x === newPos.x && p.y === newPos.y);
    if (powerup && !collectedItems.powerups.has(posKey)) {
      setCollectedItems(prev => ({
        ...prev,
        powerups: new Set(prev.powerups).add(posKey)
      }));
      const powerupData = POWERUPS[powerup.type as keyof typeof POWERUPS];
      setActivePowerup(powerup.type);
      setPowerupTimeLeft(powerupData.duration);
      setScore(prev => prev + 50);
      if (soundEnabled) playSound('powerup');
    }

    // Chaves
    const key = level.keys?.find(k => k.x === newPos.x && k.y === newPos.y);
    if (key && !collectedItems.keys.has(key.id)) {
      setCollectedItems(prev => ({
        ...prev,
        keys: new Set(prev.keys).add(key.id)
      }));
      setScore(prev => prev + 25);
      if (soundEnabled) playSound('key');
    }

    // NPCs
    const npc = level.npcs?.find(n => n.x === newPos.x && n.y === newPos.y);
    if (npc && !collectedItems.npcs.has(posKey)) {
      setCollectedItems(prev => ({
        ...prev,
        npcs: new Set(prev.npcs).add(posKey)
      }));
      const points = activePowerup === 'doublePoints' ? 200 : 100;
      setScore(prev => prev + points);
      if (soundEnabled) playSound('gem', 0.5);
    }

    // Verifica fim do nível
    if (newPos.x === level.end.x && newPos.y === level.end.y) {
      completeLevel();
    }
  }, [gameState, playerPosition, level, collectedItems, openedDoors, activePowerup, soundEnabled]);

  // Completar nível
  const completeLevel = () => {
    const timeBonus = Math.max(0, level.perfectTime - timeElapsed) * 5;
    const finalScore = score + timeBonus;
    
    setScore(finalScore);
    setTotalScore(prev => prev + finalScore);
    
    let earnedStars = 1;
    const totalGems = (level.gems?.length || 0) + 
                      (level.specialGems?.length || 0) + 
                      (level.megaGems?.length || 0);
    const collectedGems = collectedItems.gems.size + 
                         collectedItems.specialGems.size + 
                         collectedItems.megaGems.size;
    
    if (collectedGems === totalGems && collectedItems.npcs.size === level.npcs?.length) {
      earnedStars = 3;
    } else if (timeElapsed <= level.perfectTime) {
      earnedStars = 2;
    }
    
    setStars(earnedStars);
    
    if (soundEnabled) playSound('levelComplete');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    if (currentLevel === 19) {
      setTimeout(() => {
        setGameState('mirrorUnlocked');
      }, 2000);
    } else {
      setGameState('levelComplete');
    }
  };

  // Próximo nível
  const nextLevel = () => {
    if (currentLevel < ALL_LEVELS.length - 1) {
      const nextLevelIndex = currentLevel + 1;
      setCurrentLevel(nextLevelIndex);
      initLevel(nextLevelIndex);
      setGameState('story');
      
      const nextLevelData = ALL_LEVELS[nextLevelIndex];
      setCutsceneContent({
        title: nextLevelData.name,
        text: nextLevelData.story,
        image: EMOTIONS[nextLevelData.emotion as keyof typeof EMOTIONS].icon
      });
      setShowCutscene(true);
    } else {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      });
      setGameState('gameComplete');
    }
  };

  // Controles do teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const keyMap: { [key: string]: 'up' | 'down' | 'left' | 'right' } = {
        'ArrowUp': 'up', 'w': 'up', 'W': 'up',
        'ArrowDown': 'down', 's': 'down', 'S': 'down',
        'ArrowLeft': 'left', 'a': 'left', 'A': 'left',
        'ArrowRight': 'right', 'd': 'right', 'D': 'right'
      };
      
      const direction = keyMap[e.key];
      if (direction) {
        e.preventDefault();
        movePlayer(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  // Renderizar célula
  const renderCell = (x: number, y: number) => {
    const isWall = level.grid[y][x] === 1;
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    const isEnd = x === level.end.x && y === level.end.y;
    
    const gem = level.gems?.find(g => g.x === x && g.y === y && !collectedItems.gems.has(`${x},${y}`));
    const specialGem = level.specialGems?.find(g => g.x === x && g.y === y && !collectedItems.specialGems.has(`${x},${y}`));
    const megaGem = level.megaGems?.find(g => g.x === x && g.y === y && !collectedItems.megaGems.has(`${x},${y}`));
    const powerup = level.powerups?.find(p => p.x === x && p.y === y && !collectedItems.powerups.has(`${x},${y}`));
    const key = level.keys?.find(k => k.x === x && k.y === y && !collectedItems.keys.has(k.id));
    const door = level.doors?.find(d => d.x === x && d.y === y);
    const doorIsOpen = door ? openedDoors.has(door.keyId) : false;
    const npc = level.npcs?.find(n => n.x === x && n.y === y && !collectedItems.npcs.has(`${x},${y}`));
    
    let className = styles.cell;
    
    if (isWall) {
      className += ` ${styles.cellWall}`;
    } else {
      className += ` ${styles.cellPath}`;
    }
    
    // Destacar porta fechada
    if (door && !doorIsOpen) {
      className += ` ${styles.door}`;
    }
    
    const cellSize = isMobile ? '35px' : '45px';
    const fontSize = isMobile ? '16px' : '20px';
    
    return (
      <div 
        key={`${x}-${y}`} 
        className={className}
        style={{ 
          width: cellSize, 
          height: cellSize,
          fontSize: fontSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: door && !doorIsOpen ? '#8B4513' : undefined,
          opacity: door && doorIsOpen ? 0.5 : 1
        }}
      >
        {isPlayer && <span className={styles.player} style={{ fontSize }}>🧑</span>}
        {isEnd && !isPlayer && <span style={{ fontSize }}>🎯</span>}
        {npc && !isPlayer && <span className={styles.npc} style={{ fontSize }}>{npc.type.emoji}</span>}
        {gem && !isPlayer && <span style={{ fontSize }}>💎</span>}
        {specialGem && !isPlayer && <span className={styles.specialGem} style={{ fontSize }}>💎✨</span>}
        {megaGem && !isPlayer && <span className={styles.megaGem} style={{ fontSize }}>🌟</span>}
        {powerup && !isPlayer && <span style={{ fontSize }}>{POWERUPS[powerup.type as keyof typeof POWERUPS].icon}</span>}
        {key && !isPlayer && <span className={styles.key} style={{ fontSize }}>🗝️</span>}
        {door && !doorIsOpen && !isPlayer && (
          <span style={{ fontSize, filter: 'brightness(1.5)' }}>🚪</span>
        )}
      </div>
    );
  };

  const emotionTheme = EMOTIONS[currentEmotion as keyof typeof EMOTIONS];

  return (
    <div className={`${styles.gameContainer} ${styles[`theme${currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}`]}`}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/dashboard" className="flex items-center text-teal-600 hover:text-teal-700">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="text-red-500 h-5 w-5" />
              <span>Nível {currentLevel + 1}</span>
            </h1>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/50"
              style={{ touchAction: 'manipulation' }}
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {gameState === 'playing' && (
        <>
          <div className="bg-white/90 rounded-lg px-3 py-1 m-2 inline-block">
            <span className="text-sm font-bold text-gray-800">
              {emotionTheme.icon} {emotionTheme.name}
            </span>
          </div>
          
          {activePowerup && (
            <div className="bg-purple-600 text-white rounded-lg px-3 py-1 m-2 inline-block">
              <span className="text-sm font-bold">
                {POWERUPS[activePowerup as keyof typeof POWERUPS].icon} {powerupTimeLeft}s
              </span>
            </div>
          )}
        </>
      )}

      <main className="flex-1 p-4 flex flex-col" style={{ paddingBottom: isMobile ? '150px' : '20px' }}>
        {gameState === 'intro' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl max-w-3xl mx-auto">
              <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-gray-800">
                O Labirinto das Emoções
              </h1>
              
              <div className="flex justify-center gap-4 mb-4">
                <div className="text-5xl">🦁</div>
                <div className="text-5xl">🦄</div>
              </div>
              
              <p className="text-sm sm:text-lg text-gray-700 mb-4">
                30 níveis de aventura! Colete gemas e ajude os amigos!
              </p>
              
              <div className="bg-yellow-100 rounded-lg p-3 mb-4">
                <p className="text-sm font-bold text-gray-800">🌟 MEGA GEMAS = 1000 pontos!</p>
                <p className="text-xs text-gray-700">Procure por elas em cada nível!</p>
              </div>
              
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl text-lg font-bold"
                style={{ touchAction: 'manipulation' }}
              >
                <Play className="inline mr-2" />
                Começar
              </button>
            </div>
          </motion.div>
        )}

        {showCutscene && (
          <div className="flex items-center justify-center flex-1">
            <motion.div 
              className="bg-white/90 rounded-2xl p-6 max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-5xl mb-4 text-center">{cutsceneContent.image}</div>
              <h2 className="text-xl font-bold mb-3 text-gray-800 text-center">{cutsceneContent.title}</h2>
              <p className="text-sm text-gray-700 mb-4 text-center">{cutsceneContent.text}</p>
              {level.keys && level.keys.length > 0 && (
                <div className="bg-yellow-100 rounded p-2 mb-3">
                  <p className="text-xs font-bold text-center">
                    🗝️ Pegue as chaves para abrir as 🚪 portas!
                  </p>
                </div>
              )}
              {level.powerups?.some(p => p.type === 'wallPass') && (
                <div className="bg-purple-100 rounded p-2 mb-3">
                  <p className="text-xs font-bold text-center">
                    🕐 Use o poder para atravessar paredes!
                  </p>
                </div>
              )}
              <button
                onClick={startLevel}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
                style={{ touchAction: 'manipulation' }}
              >
                Vamos lá!
              </button>
            </motion.div>
          </div>
        )}

        {gameState === 'playing' && level && (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              <div className="bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-800">
                ⭐ {score}
              </div>
              <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-800">
                💎 {collectedItems.gems.size + collectedItems.specialGems.size + collectedItems.megaGems.size}/
                {(level.gems?.length || 0) + (level.specialGems?.length || 0) + (level.megaGems?.length || 0)}
              </div>
              {level.npcs && level.npcs.length > 0 && (
                <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-800">
                  🐾 {collectedItems.npcs.size}/{level.npcs.length}
                </div>
              )}
              {level.keys && level.keys.length > 0 && (
                <div className="bg-white/90 px-2 py-1 rounded text-xs text-gray-800">
                  🗝️ {collectedItems.keys.size}/{level.keys.length}
                </div>
              )}
            </div>

            <div className="flex justify-center items-center flex-1">
              <div 
                className={styles.mazeGrid}
                style={{ 
                  gridTemplateColumns: 'repeat(8, 1fr)'
                }}
              >
                {level.grid.map((row, y) =>
                  row.map((_, x) => renderCell(x, y))
                )}
              </div>
            </div>

            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 rounded-xl p-3 shadow-lg">
              <div className="grid grid-cols-3 gap-1 w-32">
                <div></div>
                <button
                  onClick={() => movePlayer('up')}
                  className={`bg-blue-500 text-white p-3 rounded-lg active:bg-blue-600 ${styles.controlButton}`}
                  style={{ touchAction: 'manipulation' }}
                >
                  ↑
                </button>
                <div></div>
                <button
                  onClick={() => movePlayer('left')}
                  className={`bg-blue-500 text-white p-3 rounded-lg active:bg-blue-600 ${styles.controlButton}`}
                  style={{ touchAction: 'manipulation' }}
                >
                  ←
                </button>
                <button
                  onClick={() => movePlayer('down')}
                  className={`bg-blue-500 text-white p-3 rounded-lg active:bg-blue-600 ${styles.controlButton}`}
                  style={{ touchAction: 'manipulation' }}
                >
                  ↓
                </button>
                <button
                  onClick={() => movePlayer('right')}
                  className={`bg-blue-500 text-white p-3 rounded-lg active:bg-blue-600 ${styles.controlButton}`}
                  style={{ touchAction: 'manipulation' }}
                >
                  →
                </button>
              </div>
            </div>
          </>
        )}

        {gameState === 'mirrorUnlocked' && (
          <div className="flex items-center justify-center flex-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/90 rounded-2xl p-6 max-w-md text-center"
            >
              <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3 text-purple-600">
                MUNDO ESPELHADO!
              </h2>
              <p className="text-gray-700 mb-4">
                10 níveis espelhados desbloqueados!
              </p>
              <button
                onClick={() => setGameState('levelComplete')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold"
                style={{ touchAction: 'manipulation' }}
              >
                Continuar!
              </button>
            </motion.div>
          </div>
        )}

        {gameState === 'levelComplete' && (
          <div className="flex items-center justify-center flex-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/90 rounded-2xl p-6 max-w-md text-center"
            >
              <h2 className="text-2xl font-bold mb-3 text-gray-800">Nível Completo!</h2>
              
              <div className="flex justify-center gap-2 mb-3">
                {[1, 2, 3].map(i => (
                  <Star
                    key={i}
                    className={`w-10 h-10 ${i <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              
              <div className="text-sm text-gray-700 space-y-1 mb-4">
                <p>Movimentos: {moves}</p>
                <p>Tempo: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</p>
                <p className="text-xl font-bold text-gray-800">Pontos: {score}</p>
              </div>
              
              <button
                onClick={nextLevel}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold w-full"
                style={{ touchAction: 'manipulation' }}
              >
                {currentLevel === 19 ? 'Mundo Espelhado!' : 'Próximo Nível'}
              </button>
            </motion.div>
          </div>
        )}

        {gameState === 'gameComplete' && (
          <div className="flex items-center justify-center flex-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/90 rounded-2xl p-6 max-w-md text-center"
            >
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-3 text-purple-600">
                VOCÊ VENCEU!
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Completou todos os 30 níveis!
              </p>
              <p className="text-2xl font-bold text-gray-800 mb-4">
                Pontuação Total: {totalScore}
              </p>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold w-full"
                style={{ touchAction: 'manipulation' }}
              >
                Jogar Novamente
              </button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
