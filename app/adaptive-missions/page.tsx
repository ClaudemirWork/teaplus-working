'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Mission {
  id: string;
  type: 'attention' | 'social' | 'executive' | 'memory' | 'emotion';
  title: string;
  description: string;
  difficulty: number; // 1-10
  timeLimit: number; // segundos
  completed: boolean;
  score: number;
  attempts: number;
}

interface UserProfile {
  level: number;
  strengths: string[];
  challenges: string[];
  averageScore: number;
  completedMissions: number;
  errorPatterns: { [key: string]: number }; // Track specific error types
  preferredTopics: string[];
  adaptiveSettings: {
    preferredDifficulty: number;
    attentionSpan: number;
    needsBreaks: boolean;
    visualSupport: boolean;
  };
}

interface Challenge {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  type: string;
  explanation: string;
  tags: string[];
  usedAt?: number; // timestamp to avoid repetition
}

// ============= CONTENT POOLS (50+ exercises per category) =============

const ATTENTION_POOL = [
  // Visual Pattern Recognition
  { base: 'pattern_sequence', variants: 20, difficulty: [1,2,3] },
  { base: 'color_detection', variants: 15, difficulty: [1,2] },
  { base: 'shape_focus', variants: 12, difficulty: [2,3] },
  { base: 'movement_tracking', variants: 18, difficulty: [3,4,5] },
  { base: 'selective_attention', variants: 25, difficulty: [2,3,4] }
];

const SOCIAL_POOL = [
  // Body Language & Emotions
  { base: 'facial_expressions', variants: 30, difficulty: [1,2,3] },
  { base: 'body_language', variants: 25, difficulty: [2,3,4] },
  { base: 'social_contexts', variants: 20, difficulty: [3,4,5] },
  { base: 'conversation_cues', variants: 15, difficulty: [4,5] },
  { base: 'group_dynamics', variants: 10, difficulty: [5,6] }
];

const EXECUTIVE_POOL = [
  // Planning & Organization
  { base: 'task_prioritization', variants: 20, difficulty: [2,3,4] },
  { base: 'time_management', variants: 18, difficulty: [3,4,5] },
  { base: 'resource_allocation', variants: 15, difficulty: [4,5,6] },
  { base: 'problem_solving', variants: 22, difficulty: [2,3,4,5] },
  { base: 'decision_making', variants: 12, difficulty: [5,6,7] }
];

const MEMORY_POOL = [
  // Working Memory & Recall
  { base: 'sequence_recall', variants: 30, difficulty: [1,2,3,4] },
  { base: 'pattern_memory', variants: 25, difficulty: [2,3,4] },
  { base: 'spatial_memory', variants: 20, difficulty: [3,4,5] },
  { base: 'verbal_memory', variants: 18, difficulty: [2,3,4] },
  { base: 'working_memory', variants: 15, difficulty: [4,5,6] }
];

const EMOTION_POOL = [
  // Emotional Regulation
  { base: 'coping_strategies', variants: 25, difficulty: [1,2,3] },
  { base: 'emotion_identification', variants: 20, difficulty: [1,2] },
  { base: 'trigger_management', variants: 18, difficulty: [3,4,5] },
  { base: 'social_emotions', variants: 15, difficulty: [4,5] },
  { base: 'stress_response', variants: 12, difficulty: [5,6] }
];

// ============= AI INTEGRATION STRUCTURE =============
interface AIResponse {
  success: boolean;
  content?: Challenge;
  error?: string;
}

class AIService {
  static async generateChallenge(type: string, difficulty: number, userProfile: UserProfile): Promise<AIResponse> {
    // TODO: Replace with actual API call when ready
    // const response = await fetch('/api/ai/generate-challenge', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type, difficulty, userProfile })
    // });
    
    // For now, return null to use procedural generation
    return { success: false, error: 'AI service not connected' };
  }

  static async analyzeUserPattern(userHistory: any): Promise<AIResponse> {
    // TODO: AI analysis of user learning patterns
    return { success: false, error: 'AI analysis not connected' };
  }
}

export default function AdaptiveMissionsPage() {
  const router = useRouter();
  const [gamePhase, setGamePhase] = useState<'intro' | 'dashboard' | 'mission' | 'results'>('intro');
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [currentChallenges, setCurrentChallenges] = useState<Challenge[]>([]);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [sessionScore, setSessionScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [usedChallengeIds, setUsedChallengeIds] = useState<Set<string>>(new Set());

  const [userProfile, setUserProfile] = useState<UserProfile>({
    level: 1,
    strengths: [],
    challenges: ['attention', 'executive'],
    averageScore: 0,
    completedMissions: 0,
    errorPatterns: {},
    preferredTopics: [],
    adaptiveSettings: {
      preferredDifficulty: 3,
      attentionSpan: 60,
      needsBreaks: true,
      visualSupport: true
    }
  });

  const [availableMissions, setAvailableMissions] = useState<Mission[]>([
    {
      id: 'attention-focus',
      type: 'attention',
      title: 'Foco Sustentado',
      description: 'Desenvolva atenção seletiva e sustentada',
      difficulty: 2,
      timeLimit: 120,
      completed: false,
      score: 0,
      attempts: 0
    },
    {
      id: 'social-cues',
      type: 'social',
      title: 'Sinais Sociais',
      description: 'Interprete emoções e contextos sociais',
      difficulty: 3,
      timeLimit: 90,
      completed: false,
      score: 0,
      attempts: 0
    },
    {
      id: 'executive-planning',
      type: 'executive',
      title: 'Funções Executivas',
      description: 'Melhore planejamento e organização',
      difficulty: 4,
      timeLimit: 150,
      completed: false,
      score: 0,
      attempts: 0
    },
    {
      id: 'memory-working',
      type: 'memory',
      title: 'Memória de Trabalho',
      description: 'Fortaleça memória operacional',
      difficulty: 3,
      timeLimit: 100,
      completed: false,
      score: 0,
      attempts: 0
    },
    {
      id: 'emotion-regulation',
      type: 'emotion',
      title: 'Regulação Emocional',
      description: 'Desenvolva estratégias de autorregulação',
      difficulty: 2,
      timeLimit: 80,
      completed: false,
      score: 0,
      attempts: 0
    }
  ]);

  // ============= PROCEDURAL CHALLENGE GENERATION =============
  
  const generateUniqueChallenge = (type: string, difficulty: number, attempt: number = 0): Challenge => {
    const pools = {
      attention: ATTENTION_POOL,
      social: SOCIAL_POOL,
      executive: EXECUTIVE_POOL,
      memory: MEMORY_POOL,
      emotion: EMOTION_POOL
    };

    const pool = pools[type as keyof typeof pools] || ATTENTION_POOL;
    const suitableExercises = pool.filter(ex => ex.difficulty.includes(difficulty));
    const exercise = suitableExercises[Math.floor(Math.random() * suitableExercises.length)];
    
    // Generate unique challenge based on type and variant
    const variant = Math.floor(Math.random() * exercise.variants) + 1;
    const challengeId = `${exercise.base}_${variant}_${attempt}`;
    
    // If already used recently, try different variant
    if (usedChallengeIds.has(challengeId) && attempt < 5) {
      return generateUniqueChallenge(type, difficulty, attempt + 1);
    }

    switch (exercise.base) {
      case 'pattern_sequence':
      case 'color_detection':
      case 'shape_focus':
      case 'movement_tracking':
      case 'selective_attention':
        return generatePatternChallenge(challengeId, difficulty, variant);
      
      case 'facial_expressions':
      case 'social_contexts':
      case 'conversation_cues':
      case 'group_dynamics':
        return generateEmotionChallenge(challengeId, difficulty, variant);
      
      case 'body_language':
        return generateBodyLanguageChallenge(challengeId, difficulty, variant);
      
      case 'task_prioritization':
      case 'problem_solving':
      case 'decision_making':
      case 'resource_allocation':
        return generatePriorityChallenge(challengeId, difficulty, variant);
      
      case 'time_management':
        return generateTimeChallenge(challengeId, difficulty, variant);
      
      case 'sequence_recall':
      case 'pattern_memory':
      case 'verbal_memory':
      case 'working_memory':
        return generateMemoryChallenge(challengeId, difficulty, variant);
      
      case 'spatial_memory':
        return generateSpatialChallenge(challengeId, difficulty, variant);
      
      case 'coping_strategies':
      case 'emotion_identification':
      case 'social_emotions':
      case 'stress_response':
        return generateCopingChallenge(challengeId, difficulty, variant);
      
      case 'trigger_management':
        return generateTriggerChallenge(challengeId, difficulty, variant);
      
      default:
        // Fallback para um gerador funcional em vez do default
        return generatePatternChallenge(challengeId, difficulty, variant);
    }
  };

  const generatePatternChallenge = (id: string, difficulty: number, variant: number): Challenge => {
    const patterns = ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠', '⭐', '❤️', '🔺', '🔲'];
    const length = Math.min(3 + difficulty, 8);
    const sequence = Array.from({length}, () => patterns[Math.floor(Math.random() * (4 + difficulty))]);
    
    // Create one wrong pattern
    const wrongIndex = Math.floor(Math.random() * length);
    const wrongSequence = [...sequence];
    wrongSequence[wrongIndex] = patterns[Math.floor(Math.random() * patterns.length)];
    
    const options = [
      sequence.join(''),
      wrongSequence.join(''),
      sequence.slice().reverse().join(''),
      sequence.map(() => patterns[Math.floor(Math.random() * patterns.length)]).join('')
    ];

    // Shuffle options
    const correctAnswer = 0;
    const shuffled = shuffleArrayWithCorrect(options, correctAnswer);
    
    return {
      id,
      question: `Qual sequência segue o padrão lógico correto? (Variação ${variant})`,
      options: shuffled.options,
      correctAnswer: shuffled.correctIndex,
      type: 'pattern-recognition',
      explanation: `A sequência correta mantém o padrão visual estabelecido: ${sequence.join('')}`,
      tags: ['visual', 'pattern', 'attention', `difficulty-${difficulty}`]
    };
  };

  const generateEmotionChallenge = (id: string, difficulty: number, variant: number): Challenge => {
    const emotions = [
      { emotion: 'ansioso', signs: 'inquietação, fala rápida, gestos nervosos', response: 'respiração profunda e mindfulness' },
      { emotion: 'irritado', signs: 'cenho franzido, punhos fechados, tom elevado', response: 'pausa e contagem até 10' },
      { emotion: 'triste', signs: 'ombros caídos, evita contato visual, fala baixa', response: 'buscar apoio social e atividades prazerosas' },
      { emotion: 'empolgado', signs: 'gestos amplos, fala rápida, sorriso largo', response: 'canalizar energia de forma construtiva' },
      { emotion: 'confuso', signs: 'sobrancelhas franzidas, pausa nas falas, olhar perdido', response: 'fazer perguntas esclarecedoras' },
      { emotion: 'entediado', signs: 'bocejo, olhar distante, postura relaxada demais', response: 'buscar nova atividade estimulante' }
    ];

    const emotion = emotions[variant % emotions.length];
    const wrongResponses = emotions.filter(e => e !== emotion).map(e => e.response);
    
    const options = [
      emotion.response,
      ...wrongResponses.slice(0, 3)
    ];

    const shuffled = shuffleArrayWithCorrect(options, 0);

    return {
      id,
      question: `Uma pessoa apresenta: ${emotion.signs}. Qual a melhor estratégia de resposta?`,
      options: shuffled.options,
      correctAnswer: shuffled.correctIndex,
      type: 'emotion-recognition',
      explanation: `Quando alguém está ${emotion.emotion}, ${emotion.response} é a abordagem mais eficaz.`,
      tags: ['social', 'emotion', 'recognition', `difficulty-${difficulty}`]
    };
  };

  const generatePriorityChallenge = (id: string, difficulty: number, variant: number): Challenge => {
    const tasks = [
      { task: 'Terminar projeto com prazo hoje', urgency: 5, importance: 5 },
      { task: 'Responder emails não urgentes', urgency: 2, importance: 3 },
      { task: 'Planejar férias para ano que vem', urgency: 1, importance: 2 },
      { task: 'Revisar apresentação de amanhã', urgency: 4, importance: 4 },
      { task: 'Organizar mesa de trabalho', urgency: 1, importance: 2 },
      { task: 'Ligar para cliente irritado', urgency: 5, importance: 4 },
      { task: 'Fazer exercício físico', urgency: 2, importance: 4 },
      { task: 'Estudar para certificação', urgency: 3, importance: 5 }
    ];

    const selectedTasks = tasks.slice(variant % 4, (variant % 4) + 4);
    const sortedByPriority = [...selectedTasks].sort((a, b) => (b.urgency + b.importance) - (a.urgency + a.importance));
    
    const options = [
      sortedByPriority[0].task,
      selectedTasks[1].task,
      selectedTasks[2].task,
      selectedTasks[3].task
    ];

    const shuffled = shuffleArrayWithCorrect(options, 0);

    return {
      id,
      question: `Você tem estas tarefas. Qual deve ser sua PRIMEIRA prioridade?`,
      options: shuffled.options,
      correctAnswer: shuffled.correctIndex,
      type: 'priority-matrix',
      explanation: `"${sortedByPriority[0].task}" tem maior combinação de urgência e importância (Matriz de Eisenhower).`,
      tags: ['executive', 'planning', 'priority', `difficulty-${difficulty}`]
    };
  };

  const generateMemoryChallenge = (id: string, difficulty: number, variant: number): Challenge => {
    const elements = ['🎵', '⚡', '🌟', '🎨', '🔮', '🎪', '🌈', '🎭', '🎯', '🎲', '🎸', '🎺'];
    const sequenceLength = Math.min(4 + difficulty, 9);
    const sequence = Array.from({length: sequenceLength}, () => elements[Math.floor(Math.random() * elements.length)]);
    
    // Create distractors
    const shuffle1 = [...sequence].sort(() => Math.random() - 0.5);
    const shuffle2 = [...sequence]; shuffle2[0] = elements[Math.floor(Math.random() * elements.length)];
    const shuffle3 = sequence.slice(1).concat(sequence[0]); // rotate
    
    const options = [
      sequence.join(' '),
      shuffle1.join(' '),
      shuffle2.join(' '),
      shuffle3.join(' ')
    ];

    const shuffled = shuffleArrayWithCorrect(options, 0);

    return {
      id,
      question: `Memorize por 3 segundos: ${sequence.join(' ')}\n\nAgora escolha a sequência CORRETA:`,
      options: shuffled.options,
      correctAnswer: shuffled.correctIndex,
      type: 'sequence-memory',
      explanation: `A sequência correta era: ${sequence.join(' ')}. Use técnicas de visualização para melhorar a memória.`,
      tags: ['memory', 'sequence', 'working-memory', `difficulty-${difficulty}`]
    };
  };

  const generateCopingChallenge = (id: string, difficulty: number, variant: number): Challenge => {
    const situations = [
      { situation: 'Você está nervoso antes de uma apresentação importante', coping: 'Praticar respiração 4-7-8 e visualização positiva', why: 'reduz ansiedade de performance' },
      { situation: 'Alguém te critica duramente em público', coping: 'Pausar, respirar e responder com calma depois', why: 'evita escalada de conflito' },
      { situation: 'Você cometeu um erro grave no trabalho', coping: 'Assumir responsabilidade e focar na solução', why: 'constrói confiança e resolve problemas' },
      { situation: 'Está se sentindo sobrecarregado com muitas tarefas', coping: 'Listar prioridades e pedir ajuda se necessário', why: 'organiza a mente e reduz estresse' },
      { situation: 'Recebeu uma notícia muito triste', coping: 'Permitir-se sentir e buscar apoio emocional', why: 'processamento saudável do luto' },
      { situation: 'Está com raiva de um amigo próximo', coping: 'Esperar a emoção diminuir antes de conversar', why: 'preserva relacionamentos importantes' }
    ];

    const situation = situations[variant % situations.length];
    const wrongCopings = [
      'Ignorar completamente a situação',
      'Reagir impulsivamente no momento',
      'Culpar outros pelas circunstâncias',
      'Evitar o problema indefinidamente'
    ];

    const options = [
      situation.coping,
      ...wrongCopings.slice(0, 3)
    ];

    const shuffled = shuffleArrayWithCorrect(options, 0);

    return {
      id,
      question: `Situação: ${situation.situation}. Qual a melhor estratégia?`,
      options: shuffled.options,
      correctAnswer: shuffled.correctIndex,
      type: 'coping-strategy',
      explanation: `${situation.coping} é eficaz porque ${situation.why}.`,
      tags: ['emotion', 'coping', 'regulation', `difficulty-${difficulty}`]
    };
  };

  const generateBodyLanguageChallenge = (id: string, difficulty: number, variant: number): Challenge => {
    const bodyLanguages = [
      { description: 'Braços cruzados, olhar desviado, pé batendo', emotion: 'Desconforto ou impaciência', sign: 'defensiva' },
      { description: 'Inclinação para frente, contato visual, palmas abertas', emotion: 'Interesse genuíno', sign: 'engajamento' },
      { description: 'Ombros tensos, mandíbula contraída, punhos fechados', emotion: 'Tensão ou raiva contida', sign: 'estresse' },
      { description: 'Postura ereta, sorriso natural, gestos abertos', emotion: 'Confiança e abertura', sign: 'positiva' },
      { description: 'Olhar baixo, ombros caídos, voz baixa', emotion: 'Tristeza ou desânimo', sign: 'melancolia' },
      { description: 'Inquietação, fala rápida, gestos nervosos', emotion: 'Ansiedade ou nervosismo', sign: 'agitação' }
    ];

    const bodyLang = bodyLanguages[variant % bodyLanguages.length];
    const wrongEmotions = bodyLanguages.filter(b => b !== bodyLang).map(b => b.emotion);

    const options = [
      bodyLang.emotion,
      ...wrongEmotions.slice(0, 3)
    ];

    const shuffled = shuffleArrayWithCorrect(options, 0);

    return {
      id,
      question: `Uma pessoa apresenta: ${bodyLang.description}. Isso geralmente indica:`,
      options: shuffled.options,
      correctAnswer: shuffled.correctIndex,
      type: 'body-language',
      explanation: `${bodyLang.description} são sinais típicos de ${bodyLang.emotion.toLowerCase()}, indicando uma postura ${bodyLang.sign}.`,
      tags: ['social', 'body-language', 'nonverbal', `difficulty-${difficulty}`]
    };
  };

  const generateTimeChallenge = (id: string, difficulty: number, variant: number): Challenge => {
    const scenarios = [
      { task: 'Projeto importante com prazo em 2 horas', time: '2h', priority: 'Começar imediatamente e focar 100%' },
      { task: 'Email não urgente que chegou agora', time: 'agora', priority: 'Anotar para responder em bloco de emails' },
      { task: 'Reunião daqui a 30 minutos', time: '30min', priority: 'Revisar agenda e preparar pontos principais' },
      { task: 'Tarefa que demora 3 horas, prazo amanhã', time: '1 dia', priority: 'Bloquear tempo na agenda ainda hoje' },
      { task: 'Ligação de 5 minutos para cliente', time: '5min', priority: 'Fazer agora se não interromper foco atual' },
      { task: 'Relatório mensal, prazo na próxima semana', time: '1 semana', priority: 'Agendar 2-3 blocos de trabalho profundo' }
    ];

    const scenario = scenarios[variant % scenarios.length];
    const wrongPriorities = scenarios.filter(s => s !== scenario).map(s => s.priority);

    const options = [
      scenario.priority,
      ...wrongPriorities.slice(0, 3)
    ];

    const shuffled = shuffleArrayWithCorrect(options, 0);

    return {
      id,
      question: `Você tem: "${scenario.task}". Qual a melhor abordagem de tempo?`,
      options: shuffled.options,
      correctAnswer: shuffled.correctIndex,
      type: 'time-management',
      explanation: `Para tarefas com prazo ${scenario.time}, ${scenario.priority.toLowerCase()} é a estratégia mais eficiente.`,
      tags: ['executive', 'time', 'planning', `difficulty-${difficulty}`]
    };
  };

  const generateSpatialChallenge = (id: string, difficulty: number, variant: number): Challenge => {
    const shapes = ['🔴', '🔵', '🟡', '🟢'];
    const positions = ['superior esquerdo', 'superior direito', 'inferior esquerdo', 'inferior direito', 'centro'];
    
    const gridSize = Math.min(2 + difficulty, 4);
    const numShapes = Math.min(3 + difficulty, 6);
    
    const arrangement = Array.from({length: numShapes}, (_, i) => ({
      shape: shapes[i % shapes.length],
      position: positions[i % positions.length]
    }));

    const description = arrangement.map(a => `${a.shape} no ${a.position}`).join(', ');
    
    // Create variations
    const correct = description;
    const wrong1 = arrangement.map(a => `${a.shape} no ${positions[(positions.indexOf(a.position) + 1) % positions.length]}`).join(', ');
    const wrong2 = arrangement.map((a, i) => `${shapes[(shapes.indexOf(a.shape) + 1) % shapes.length]} no ${a.position}`).join(', ');
    const wrong3 = arrangement.slice().reverse().map(a => `${a.shape} no ${a.position}`).join(', ');

    const options = [correct, wrong1, wrong2, wrong3];
    const shuffled = shuffleArrayWithCorrect(options, 0);

    return {
      id,
      question: `Memorize esta disposição por 5 segundos:\n\n${description}\n\nQual era a disposição correta?`,
      options: shuffled.options,
      correctAnswer: shuffled.correctIndex,
      type: 'spatial-memory',
      explanation: `A disposição correta era: ${correct}. Use marcos visuais para melhorar memória espacial.`,
      tags: ['memory', 'spatial', 'visual', `difficulty-${difficulty}`]
    };
  };

  const generateTriggerChallenge = (id: string, difficulty: number, variant: number): Challenge => {
    const triggers = [
      { trigger: 'Críticas em público', strategy: 'Respirar fundo e lembrar que a crítica é sobre ação, não pessoa', why: 'separa identidade do comportamento' },
      { trigger: 'Estar atrasado', strategy: 'Focar no que ainda pode controlar e aceitar o que passou', why: 'reduz ansiedade sobre passado imutável' },
      { trigger: 'Ruídos altos repentinos', strategy: 'Usar técnica de grounding 5-4-3-2-1 para se acalmar', why: 'reconecta com o presente e reduz alerta' },
      { trigger: 'Multidões ou espaços lotados', strategy: 'Encontrar um ponto focal e respirar pausadamente', why: 'diminui sensação de sobrecarga sensorial' },
      { trigger: 'Mudanças de planos de última hora', strategy: 'Pausar e reajustar expectativas mentalmente', why: 'aumenta flexibilidade cognitiva' },
      { trigger: 'Pressão para decidir rapidamente', strategy: 'Pedir um momento e listar rapidamente prós e contras', why: 'ativa pensamento racional sobre emocional' }
    ];

    const trigger = triggers[variant % triggers.length];
    const wrongStrategies = [
      'Reagir imediatamente com primeira reação',
      'Evitar completamente a situação sempre',
      'Culpar outros pela situação desconfortável',
      'Fingir que não está afetado'
    ];

    const options = [
      trigger.strategy,
      ...wrongStrategies.slice(0, 3)
    ];

    const shuffled = shuffleArrayWithCorrect(options, 0);

    return {
      id,
      question: `Trigger: ${trigger.trigger}. Qual estratégia mais eficaz?`,
      options: shuffled.options,
      correctAnswer: shuffled.correctIndex,
      type: 'trigger-management',
      explanation: `${trigger.strategy} funciona porque ${trigger.why}.`,
      tags: ['emotion', 'trigger', 'self-regulation', `difficulty-${difficulty}`]
    };
  };

  const generateDefaultChallenge = (id: string, type: string, difficulty: number, variant: number): Challenge => {
    // Fallback melhorado - sempre gera um exercício funcional
    const fallbackQuestions = {
      attention: [
        {
          question: "Qual destas sequências está organizada em ordem crescente?",
          options: ["1, 3, 5, 7, 9", "9, 7, 5, 3, 1", "1, 5, 3, 9, 7", "3, 1, 7, 5, 9"],
          correctAnswer: 0,
          explanation: "A primeira sequência segue ordem crescente: 1, 3, 5, 7, 9."
        },
        {
          question: "Em qual posição está o círculo verde? 🔴🟡🟢🔵",
          options: ["Primeira", "Segunda", "Terceira", "Quarta"],
          correctAnswer: 2,
          explanation: "O círculo verde está na terceira posição da sequência."
        }
      ],
      social: [
        {
          question: "Se alguém está com os braços cruzados e não faz contato visual, provavelmente está:",
          options: ["Confortável e relaxado", "Desconfortável ou defensivo", "Com sono", "Com fome"],
          correctAnswer: 1,
          explanation: "Braços cruzados e evitar contato visual são sinais de desconforto ou postura defensiva."
        }
      ],
      executive: [
        {
          question: "Qual tarefa deve ser feita PRIMEIRO?",
          options: ["Tarefa fácil e prazerosa", "Tarefa urgente e importante", "Tarefa que demora pouco", "Tarefa menos importante"],
          correctAnswer: 1,
          explanation: "Tarefas urgentes e importantes sempre têm prioridade máxima (Matriz de Eisenhower)."
        }
      ],
      memory: [
        {
          question: "Memorize: A-B-C-D. Qual é a sequência correta?",
          options: ["A-B-C-D", "D-C-B-A", "A-C-B-D", "B-A-D-C"],
          correctAnswer: 0,
          explanation: "A sequência correta é A-B-C-D, conforme apresentada inicialmente."
        }
      ],
      emotion: [
        {
          question: "Quando você está muito nervoso, qual é a melhor estratégia?",
          options: ["Ignorar o nervosismo", "Respirar fundo várias vezes", "Ficar mais agitado", "Culpar outros"],
          correctAnswer: 1,
          explanation: "Respiração profunda ativa o sistema nervoso parassimpático, reduzindo a ansiedade."
        }
      ]
    };

    const typeQuestions = fallbackQuestions[type as keyof typeof fallbackQuestions] || fallbackQuestions.attention;
    const question = typeQuestions[variant % typeQuestions.length];
    
    return {
      id,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      type: 'fallback',
      explanation: question.explanation,
      tags: [type, `difficulty-${difficulty}`, 'fallback']
    };
  };

  // Helper function to shuffle options while tracking correct answer
  const shuffleArrayWithCorrect = (array: string[], correctIndex: number) => {
    const correctValue = array[correctIndex];
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffled.indexOf(correctValue);
    
    return {
      options: shuffled,
      correctIndex: newCorrectIndex
    };
  };

  // ============= ADAPTIVE INTELLIGENCE SYSTEM =============
  
  const analyzeUserPatterns = (answers: number[], challenges: Challenge[]): { [key: string]: number } => {
    const patterns: { [key: string]: number } = {};
    
    challenges.forEach((challenge, index) => {
      const isCorrect = answers[index] === challenge.correctAnswer;
      const errorType = isCorrect ? 'correct' : `error_${challenge.type}`;
      
      challenge.tags.forEach(tag => {
        patterns[`${errorType}_${tag}`] = (patterns[`${errorType}_${tag}`] || 0) + 1;
      });
    });
    
    return patterns;
  };

  const getAdaptiveDifficulty = (mission: Mission, userPatterns: { [key: string]: number }): number => {
    const missionType = mission.type;
    const errorCount = userPatterns[`error_${missionType}`] || 0;
    const correctCount = userPatterns[`correct_${missionType}`] || 0;
    const total = errorCount + correctCount;
    
    if (total === 0) return mission.difficulty;
    
    const accuracy = correctCount / total;
    let newDifficulty = mission.difficulty;
    
    if (accuracy >= 0.9) newDifficulty += 2;
    else if (accuracy >= 0.75) newDifficulty += 1;
    else if (accuracy < 0.5) newDifficulty -= 1;
    else if (accuracy < 0.3) newDifficulty -= 2;
    
    return Math.max(1, Math.min(10, newDifficulty));
  };

  // ============= MISSION SYSTEM =============
  
  const generateAdaptiveChallenges = async (mission: Mission): Promise<Challenge[]> => {
    const numChallenges = Math.min(5 + Math.floor(mission.difficulty / 2), 10);
    const challenges: Challenge[] = [];
    const adaptiveDifficulty = getAdaptiveDifficulty(mission, userProfile.errorPatterns);
    
    // Try AI first, fallback to procedural
    for (let i = 0; i < numChallenges; i++) {
      let challenge: Challenge;
      
      // TODO: Try AI generation first
      const aiResponse = await AIService.generateChallenge(mission.type, adaptiveDifficulty, userProfile);
      
      if (aiResponse.success && aiResponse.content) {
        challenge = aiResponse.content;
      } else {
        // Fallback to procedural generation with difficulty variation
        const difficultyVariation = Math.max(1, adaptiveDifficulty + Math.floor(Math.random() * 3) - 1);
        challenge = generateUniqueChallenge(mission.type, difficultyVariation, i);
      }
      
      challenges.push(challenge);
      setUsedChallengeIds(prev => new Set([...prev, challenge.id]));
    }
    
    return challenges;
  };

  // Sistema adaptativo - ajustar dificuldade baseado na performance
  const adaptDifficulty = (mission: Mission, score: number, patterns: { [key: string]: number }) => {
    const percentage = (score / (currentChallenges.length * (10 + mission.difficulty))) * 100;
    let newDifficulty = mission.difficulty;
    
    // Análise mais sofisticada baseada em padrões de erro
    const errorRate = Object.keys(patterns).filter(k => k.startsWith('error')).length / Object.keys(patterns).length;
    
    if (percentage >= 90 && errorRate < 0.1) {
      newDifficulty = Math.min(10, mission.difficulty + 2);
      setFeedback('🚀 Excepcional! Aumentando significativamente o desafio!');
    } else if (percentage >= 80 && errorRate < 0.2) {
      newDifficulty = Math.min(10, mission.difficulty + 1);
      setFeedback('🎯 Excelente! Subindo o nível de dificuldade.');
    } else if (percentage >= 60) {
      setFeedback('👍 Bom trabalho! Mantendo nível atual.');
    } else if (percentage >= 40) {
      newDifficulty = Math.max(1, mission.difficulty - 1);
      setFeedback('💪 Ajustando para seu ritmo atual. Continue praticando!');
    } else {
      newDifficulty = Math.max(1, mission.difficulty - 2);
      setFeedback('🌱 Vamos focar em fortalecer a base. Você está aprendendo!');
    }

    // Atualizar perfil do usuário com padrões de erro
    setUserProfile(prev => ({
      ...prev,
      errorPatterns: { ...prev.errorPatterns, ...patterns },
      adaptiveSettings: {
        ...prev.adaptiveSettings,
        preferredDifficulty: newDifficulty
      }
    }));

    return newDifficulty;
  };

  // Recomendar próxima missão baseada no perfil e padrões de erro
  const getRecommendedMissions = (): Mission[] => {
    const challenges = userProfile.challenges;
    const errorPatterns = userProfile.errorPatterns;
    
    return availableMissions
      .filter(mission => !mission.completed)
      .sort((a, b) => {
        // Priorizar áreas com mais erros recentes
        const aErrors = errorPatterns[`error_${a.type}`] || 0;
        const bErrors = errorPatterns[`error_${b.type}`] || 0;
        
        if (aErrors !== bErrors) return bErrors - aErrors;
        
        // Depois priorizar áreas de desafio conhecidas
        const aPriority = challenges.includes(a.type) ? 2 : 1;
        const bPriority = challenges.includes(b.type) ? 2 : 1;
        
        if (aPriority !== bPriority) return bPriority - aPriority;
        
        // Por último, dificuldade próxima ao preferido
        const aDiffDist = Math.abs(a.difficulty - userProfile.adaptiveSettings.preferredDifficulty);
        const bDiffDist = Math.abs(b.difficulty - userProfile.adaptiveSettings.preferredDifficulty);
        
        return aDiffDist - bDiffDist;
      })
      .slice(0, 3);
  };

  // Timer da missão
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      completeMission();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Iniciar missão
  const startMission = async (mission: Mission) => {
    setCurrentMission(mission);
    setFeedback('🧠 Gerando desafios personalizados...');
    
    const challenges = await generateAdaptiveChallenges(mission);
    setCurrentChallenges(challenges);
    setChallengeIndex(0);
    setTimeLeft(mission.timeLimit);
    setIsTimerActive(true);
    setUserAnswers([]);
    setSessionScore(0);
    setGamePhase('mission');
    setFeedback('');

    // Atualizar tentativas
    setAvailableMissions(prev => prev.map(m => 
      m.id === mission.id ? { ...m, attempts: m.attempts + 1 } : m
    ));
  };

  // Responder desafio
  const answerChallenge = (answerIndex: number) => {
    if (!currentMission || challengeIndex >= currentChallenges.length) return;

    const currentChallenge = currentChallenges[challengeIndex];
    const isCorrect = answerIndex === currentChallenge.correctAnswer;
    const points = isCorrect ? (10 + currentMission.difficulty) : 0;
    
    setUserAnswers(prev => [...prev, answerIndex]);
    setSessionScore(prev => prev + points);

    // Feedback imediato mais rico
    if (isCorrect) {
      const encouragements = ['Perfeito!', 'Excelente!', 'Muito bem!', 'Correto!', 'Parabéns!'];
      const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      setFeedback(`✅ ${encouragement} ${currentChallenge.explanation}`);
    } else {
      setFeedback(`❌ ${currentChallenge.explanation}`);
    }

    // Próximo desafio ou completar missão
    setTimeout(() => {
      if (challengeIndex + 1 < currentChallenges.length) {
        setChallengeIndex(challengeIndex + 1);
        setFeedback('');
      } else {
        completeMission();
      }
    }, 2500);
  };

  // Completar missão
  const completeMission = () => {
    if (!currentMission) return;

    setIsTimerActive(false);
    
    // Calcular score final baseado em acertos e tempo
    const timeBonus = Math.max(0, timeLeft * 0.5);
    const finalScore = Math.round(sessionScore + timeBonus);
    
    // Analisar padrões de resposta
    const patterns = analyzeUserPatterns(userAnswers, currentChallenges);
    
    // Atualizar missão
    setAvailableMissions(prev => prev.map(m => 
      m.id === currentMission.id 
        ? { ...m, completed: true, score: Math.max(m.score, finalScore) }
        : m
    ));

    // Adaptar dificuldade com análise inteligente
    const newDifficulty = adaptDifficulty(currentMission, finalScore, patterns);
    
    // Atualizar perfil do usuário
    setUserProfile(prev => ({
      ...prev,
      completedMissions: prev.completedMissions + 1,
      averageScore: Math.round((prev.averageScore * prev.completedMissions + finalScore) / (prev.completedMissions + 1)),
      errorPatterns: { ...prev.errorPatterns, ...patterns }
    }));

    setGamePhase('results');
  };

  // Clean up used challenges periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      setUsedChallengeIds(prev => {
        const now = Date.now();
        const cutoff = now - (30 * 60 * 1000); // 30 minutes ago
        const current = Array.from(prev);
        return new Set(current.filter(id => {
          const timestamp = parseInt(id.split('_').pop() || '0');
          return timestamp > cutoff;
        }));
      });
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(cleanup);
  }, []);

  // Formatação de tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cor baseada no tipo de missão
  const getMissionColor = (type: string) => {
    const colors = {
      attention: 'blue',
      social: 'green', 
      executive: 'purple',
      memory: 'yellow',
      emotion: 'red'
    };
    return colors[type as keyof typeof colors] || 'gray';
  };

  // Ícone baseado no tipo
  const getMissionIcon = (type: string) => {
    const icons = {
      attention: '🎯',
      social: '👥',
      executive: '⚡',
      memory: '🧠',
      emotion: '❤️'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  // Resetar nível
  const resetLevel = async () => {
    if (!currentMission) return;
    
    setFeedback('🔄 Regenerando desafios...');
    const challenges = await generateAdaptiveChallenges(currentMission);
    setCurrentChallenges(challenges);
    setChallengeIndex(0);
    setTimeLeft(currentMission.timeLimit);
    setUserAnswers([]);
    setSessionScore(0);
    setFeedback('');
  };

  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-white shadow-md px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="mr-2">←</span>
              Voltar ao Dashboard
            </button>
            <h1 className="text-xl font-bold text-gray-800">TeaPlus</h1>
          </div>
        </div>

        {/* Conteúdo da Introdução */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              🎯
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Missões Adaptativas
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sistema inteligente que gera desafios únicos e se adapta ao seu progresso individual
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Objetivo */}
            <div className="bg-red-100 rounded-xl p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                🎯 Objetivo:
              </h3>
              <p className="text-red-700">
                Desenvolver habilidades cognitivas e sociais através de missões que se adaptam 
                automaticamente ao seu nível, com exercícios únicos gerados em tempo real.
              </p>
            </div>

            {/* Pontuação */}
            <div className="bg-blue-100 rounded-xl p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                🏆 Pontuação:
              </h3>
              <p className="text-blue-700">
                Pontos baseados em acertos + bônus de tempo + dificuldade adaptativa. 
                Sistema aprende seus padrões de erro para otimizar aprendizado.
              </p>
            </div>

            {/* Níveis */}
            <div className="bg-purple-100 rounded-xl p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                🧠 Inteligência Adaptativa:
              </h3>
              <div className="text-purple-700 space-y-1">
                <p><strong>🎯 Atenção:</strong> 200+ variações de foco</p>
                <p><strong>👥 Social:</strong> Cenários únicos de interação</p>
                <p><strong>⚡ Executivo:</strong> Situações reais de planejamento</p>
                <p><strong>🧠 Memória:</strong> Sequências sempre diferentes</p>
                <p><strong>❤️ Emocional:</strong> Estratégias personalizadas</p>
              </div>
            </div>

            {/* Final */}
            <div className="bg-green-100 rounded-xl p-6 border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                🏁 Personalização IA:
              </h3>
              <p className="text-green-700">
                Cada sessão é única! O sistema analisa seus padrões de resposta e 
                gera novos desafios focados em suas áreas de melhoria específicas.
              </p>
            </div>
          </div>

          {/* Botão Iniciar */}
          <div className="text-center">
            <button
              onClick={() => setGamePhase('dashboard')}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              🚀 Acessar Missões Inteligentes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'dashboard') {
    const recommendedMissions = getRecommendedMissions();

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-white shadow-md px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setGamePhase('intro')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="mr-2">←</span>
              Voltar
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-600">
                Nível {userProfile.level} | 🏆 {userProfile.averageScore}pts médios | ✅ {userProfile.completedMissions} missões
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Perfil Adaptativo */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🧠 IA Adaptativa</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Dificuldade Otimizada</p>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 rounded-full h-2 transition-all duration-500" 
                      style={{ width: `${(userProfile.adaptiveSettings.preferredDifficulty / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Nível {userProfile.adaptiveSettings.preferredDifficulty}/10</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Padrões de Aprendizado</p>
                  <div className="space-y-1 text-xs">
                    {Object.entries(userProfile.errorPatterns).slice(0, 4).map(([pattern, count]) => {
                      const isError = pattern.startsWith('error');
                      return (
                        <div key={pattern} className={`flex justify-between p-1 rounded ${isError ? 'bg-red-50' : 'bg-green-50'}`}>
                          <span className={isError ? 'text-red-600' : 'text-green-600'}>
                            {pattern.replace('error_', '❌ ').replace('correct_', '✅ ')}
                          </span>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Áreas de Foco IA</p>
                  <div className="flex flex-wrap gap-1">
                    {userProfile.challenges.map(challenge => (
                      <span key={challenge} className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">
                        🎯 {challenge}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>🤖 IA Status:</strong> Sistema analisando padrões e gerando desafios personalizados
                  </p>
                </div>
              </div>
            </div>

            {/* Missões Recomendadas pela IA */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Missões Recomendadas pela IA</h3>
              
              <div className="grid gap-4">
                {recommendedMissions.map(mission => (
                  <div key={mission.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-${getMissionColor(mission.type)}-100 rounded-lg flex items-center justify-center text-2xl`}>
                          {getMissionIcon(mission.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{mission.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{mission.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>🎯 Dificuldade: {mission.difficulty}/10</span>
                            <span>⏱️ {formatTime(mission.timeLimit)}</span>
                            <span>🔄 {mission.attempts} tentativas</span>
                            {mission.score > 0 && <span>🏆 Melhor: {mission.score}pts</span>}
                          </div>
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                              🧠 IA Recomenda
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => startMission(mission)}
                        className={`px-4 py-2 bg-${getMissionColor(mission.type)}-500 text-white rounded-lg text-sm hover:bg-${getMissionColor(mission.type)}-600 transition-colors shadow-md hover:shadow-lg`}
                      >
                        {mission.completed ? '🔄 Nova Sessão' : '▶️ Iniciar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Todas as Missões */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Todas as Missões</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {availableMissions.map(mission => (
                    <div key={mission.id} className={`bg-white rounded-lg shadow p-4 transition-all hover:shadow-md ${
                      mission.completed ? 'border-2 border-green-200' : ''
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 bg-${getMissionColor(mission.type)}-100 rounded-lg flex items-center justify-center text-lg`}>
                            {getMissionIcon(mission.type)}
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-800 text-sm">{mission.title}</h5>
                            <p className="text-gray-500 text-xs capitalize">{mission.type}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {mission.completed && <span className="text-green-500 text-xs">✅</span>}
                              <span className="text-xs text-gray-400">Nível {mission.difficulty}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => startMission(mission)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-medium transition-colors"
                        >
                          {mission.completed ? 'Refazer' : 'Iniciar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'mission' && currentMission && currentChallenges.length > 0) {
    const currentChallenge = currentChallenges[challengeIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header da Missão */}
        <div className="bg-white shadow-md px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setGamePhase('dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="mr-2">←</span>
              Abandonar Missão
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-600">
                {getMissionIcon(currentMission.type)} {currentMission.title}
              </div>
              <div className="text-sm font-medium text-indigo-600">
                ⏱️ {formatTime(timeLeft)}
              </div>
              <div className="text-sm font-medium text-green-600">
                🏆 {sessionScore}pts
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo da Missão */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Progresso */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Progresso da Missão</span>
                <span className="text-sm text-gray-500">{challengeIndex + 1} de {currentChallenges.length}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${((challengeIndex + 1) / currentChallenges.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Desafio Atual */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mb-2">
                  🎯 {currentChallenge.type} | 🏷️ {currentChallenge.tags.join(', ')}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-4 whitespace-pre-line">
                {currentChallenge.question}
              </h3>
              
              {/* Feedback */}
              {feedback && (
                <div className={`p-4 rounded-lg mb-6 transition-all duration-300 ${
                  feedback.includes('✅') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {feedback}
                </div>
              )}
            </div>

            {/* Opções de Resposta */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {currentChallenge.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => answerChallenge(index)}
                  disabled={feedback !== ''}
                  className={`p-6 text-left rounded-xl border-2 transition-all duration-200 min-h-[80px] ${
                    feedback === '' 
                      ? 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md' 
                      : feedback.includes('✅') && index === currentChallenge.correctAnswer
                        ? 'border-green-300 bg-green-50 shadow-md'
                        : feedback.includes('❌') && index === currentChallenge.correctAnswer
                          ? 'border-green-300 bg-green-50 shadow-md'
                          : userAnswers[challengeIndex] === index && feedback.includes('❌')
                            ? 'border-red-300 bg-red-50 shadow-md'
                            : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm flex-shrink-0 ${
                      feedback === ''
                        ? 'border-gray-300 text-gray-600'
                        : index === currentChallenge.correctAnswer
                          ? 'border-green-500 bg-green-500 text-white'
                          : userAnswers[challengeIndex] === index
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-gray-300 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-gray-800 font-medium leading-tight">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Controles */}
            <div className="flex justify-center space-x-3">
              <button
                onClick={resetLevel}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
              >
                🔄 Gerar Novos Desafios
              </button>
            </div>

            {/* Dicas Adaptativas */}
            {userProfile.adaptiveSettings.visualSupport && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Dica IA:</strong> Leia todas as opções com calma. Baseado no seu perfil, você se sai melhor quando analisa antes de decidir.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'results' && currentMission) {
    const totalPossible = currentChallenges.length * (10 + currentMission.difficulty);
    const percentage = Math.round((sessionScore / totalPossible) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 text-center">
          <div className="text-6xl mb-4">
            {percentage >= 90 ? '🏆' : percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Missão {currentMission.completed ? 'Completada' : 'Finalizada'}!
          </h2>
          
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-lg mb-6">
            <p className="text-lg font-semibold mb-2">Pontuação Final: {sessionScore} pontos</p>
            <p className="text-sm opacity-90">Aproveitamento: {percentage}%</p>
            <p className="text-xs opacity-75 mt-2">Desafios únicos gerados pela IA</p>
          </div>

          <div className="text-left mb-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Missão:</span>
              <span className="font-medium">{currentMission.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium">{getMissionIcon(currentMission.type)} {currentMission.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dificuldade:</span>
              <span className="font-medium">{currentMission.difficulty}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Desafios Únicos:</span>
              <span className="font-medium">{currentChallenges.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tempo Restante:</span>
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Feedback Adaptativo */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">🧠 Análise IA:</h4>
            <p className="text-blue-800 text-sm">{feedback}</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setGamePhase('dashboard')}
              className="flex-1 bg-indigo-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
            >
              🏠 Dashboard
            </button>
            <button
              onClick={() => startMission(currentMission)}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              🔄 Novos Desafios
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}