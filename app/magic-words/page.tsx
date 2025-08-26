'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Volume2, Star, Heart, Sparkles, Trophy, Lock, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

// LOG COMPLETO DE TODOS OS CARDS ORGANIZADOS POR CATEGORIA
const CARDS_DATABASE = {
  acoes: [
    'Pensar', 'abraçar', 'abrir a maçaneta', 'abrir a porta', 'abrir_fechadura',
    'acenar com a cabeça', 'agachar', 'andar_bicicleta', 'aplaudir', 'assoando o nariz',
    'beber', 'beijo no ar', 'bocejar', 'cair', 'caminhar', 'cantando', 'carregando_livros',
    'chamar', 'conversar', 'cruzando os deos', 'curvar', 'dançar a dois', 'dançar sozinho',
    'dar_maos', 'descer as escadas', 'desligar a luz', 'desligar', 'dirigir um carro',
    'empurrar', 'engasgar', 'entrando pela porta', 'entregar', 'escovar o gatinho',
    'escovar os cabelos', 'escovar os dentes', 'escrever', 'esperando', 'falar ao telefone',
    'falar', 'fechar a porta', 'fumando', 'gritar', 'jogar cartas', 'lavar as maos',
    'lavar cabelos', 'lavar o rosto', 'ler de pé', 'ler sentado', 'ler_livro',
    'levantar_cabeça', 'ligar a luz', 'ligar', 'limpar sapatos', 'martelando', 'mastigar',
    'mudar de idéia', 'olhando', 'olhando_espelho', 'olhar para baixo', 'orar', 'ouvindo',
    'pegando_onibus', 'procurar', 'puxar', 'recebendo bencao', 'saindo pela porta',
    'saltar', 'secar as mãos', 'secar no varal', 'secar o rosto', 'secar os cabelos',
    'sentar', 'sentar_chao', 'sonhar_acordado', 'suando', 'subir a árvore', 'sussurrar',
    'teclando', 'tirar a blusa', 'tocar', 'tocar_campainha', 'trocar as fraldas',
    'venha', 'vestindo_blusa', 'voltar'
  ],
  alimentos: [
    'abacate', 'abacaxi', 'abobora', 'abobrinha', 'alcachofra', 'alface', 'amendoim',
    'aspago', 'azeitonas', 'banana', 'batata', 'bebida_quente', 'berinjela', 'brocolis',
    'cachorro_quente', 'cafe_manha_suco', 'cafe_quente', 'cebola', 'chuchu', 'cogumelo',
    'copos_suco', 'couve_bruxelas', 'damasco', 'ervilha', 'fruta_amoras', 'fruta_figo',
    'fruta_groselha', 'fruta_kiwi', 'fruta_laranja', 'fruta_lima', 'fruta_limao_siciliano',
    'fruta_pitaia', 'frutal_limao', 'frutas_amoras', 'jantar_frio', 'jantar_quente',
    'lunch_box', 'maca', 'macarrao_bologhesa', 'manga', 'melancia', 'melao', 'milkshake',
    'milkshake_chocolate', 'milkshake_morango', 'mix_frutas', 'molho_maca', 'morango',
    'ovo_frito', 'paes_forma', 'pao_alho', 'pao_crocante', 'pao_forma', 'pao_recheado',
    'paozinho', 'paozinho_gergelim', 'penca_bananas', 'pepino', 'pera', 'pessego',
    'pizza', 'rabanete', 'repolho', 'rocambole', 'ruibarbo', 'salada', 'sanduiche',
    'sanduiche_suco_frutas', 'suco_abacaxi', 'suco_amoras', 'suco_groselha', 'suco_laranja',
    'suco_lima', 'suco_maca', 'suco_tomate', 'suco_uva', 'tomate', 'torta_maca',
    'uvas_verdes', 'vegetais'
  ],
  animais: [
    'Vaca', 'abelha', 'abutre', 'antilope', 'avestruz', 'besouro', 'bufalo', 'cachorro',
    'calopsita', 'camaleão', 'camelo', 'camundongo', 'canguru', 'carpa', 'cascavel',
    'cavalo', 'cavalo_marinho', 'chimpanzé', 'cisne', 'coelho', 'cordeiro', 'coruja',
    'corça', 'dinossauro', 'elefante', 'esquilo', 'flamingo', 'furão', 'gaivota', 'galo',
    'ganso', 'gato', 'girafa', 'gorila', 'hipopotámo', 'lagarto', 'lebre', 'leitoa',
    'leopardo', 'leão', 'leão_marinho', 'lobo', 'morcego', 'ovelha', 'paca', 'papagaio',
    'pato', 'peixe', 'peixe_tropical', 'peru', 'pinguim', 'pintinho', 'porco_da_india',
    'porco_espínho', 'rato', 'rena', 'rinoceronte', 'sapo', 'tamanduá', 'tartaruga',
    'tigre', 'trena', 'urso', 'urso_coala', 'urso_panda', 'urso_polar', 'zebra'
  ],
  casa: [
    'abajur', 'acucareiro', 'alicate', 'aspirador_po', 'aspirador_portatil', 'banqueta',
    'batedeira', 'cabide', 'chave_fenda', 'cortador_pizza', 'espatula', 'espatula_estreita',
    'espatula_larga', 'filtro_cafe_papel', 'frigideira', 'funil', 'galinheiro',
    'garrafa_leite', 'guarda_roupa', 'instrumentos_musicais', 'jardim', 'lanterna',
    'leite_longa_vida', 'lixeira_papel', 'maquina_lavar_roupa', 'mesa', 'pa', 'panela',
    'parafuso', 'sofa_dois_lugares', 'sofa_tres_lugares', 'sombinha', 'telefone_antigo',
    'tesoura', 'toalha_cha', 'toalha_mesa', 'toalha_praia', 'toalhas_papel',
    'ursinho_teddy', 'vaso', 'vaso_planta', 'vaso_quebrado', 'vassoura', 'video_game_wii'
  ],
  core: [
    'Basta', 'Duvida', 'Espere', 'Estou_doente', 'Fim', 'O_que', 'Olá', 'agora',
    'com_companhia', 'correto', 'ela', 'estou_aqui', 'eu', 'mais', 'me ajude',
    'me mostre', 'muito_mais', 'não', 'não_quero_falar', 'obrigado', 'onde', 'pare',
    'perguntar', 'por favor', 'qual', 'quando', 'quero', 'sim', 'voce'
  ],
  descritivo: [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Hospital', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'barulhento',
    'botas_borracha', 'branco', 'carteira', 'casa', 'cem', 'chuveiro', 'cinco pontos',
    'cinco', 'cinquenta por cento', 'cinquenta', 'cobra', 'copo_vidro', 'cor_amarelo',
    'cor_azul', 'cor_azul_claro', 'cor_cinza', 'cor_cinza_claro', 'cor_laranja',
    'cor_magenta', 'cor_marrom', 'cor_preta', 'cor_rosa', 'cor_rosa_pálido', 'cor_roxo',
    'cor_terracota', 'cor_verde', 'cor_verde_claro', 'dez', 'dezenove', 'dezesseis',
    'dezessete', 'dezoito', 'divisão', 'dois pontos', 'dois terços', 'dois', 'doze',
    'escola', 'estetoscopio', 'formiga', 'loja', 'menu_reciclado', 'mil', 'mix_cores',
    'mostrar_lingua', 'mulher_sabor_gostoso', 'mulher_sabor_ruim', 'multiplicação',
    'nove pontos', 'nove', 'noventa', 'oitenta', 'oito', 'oito_pontos', 'onze',
    'pelicano', 'pensando corretamente', 'pensando de forma errada', 'percentual',
    'placa_proibido_fumar', 'predio_escritorio', 'presente', 'quarenta', 'quatorze',
    'quatro', 'quatro_pontos', 'quinze', 'roxo', 'sala_de_aula', 'seis pontos', 'seis',
    'sessenta', 'sete pontos', 'sete', 'setenta e cinco por cento', 'setenta',
    'silencio', 'soma', 'sonhando', 'subtração', 'tres quartos', 'treze', 'trinta',
    'três', 'três_pontos', 'um meio', 'um ponto', 'um', 'universidade', 'vermelho',
    'vinte e cinco por cento', 'vinte', 'zero'
  ],
  emocoes: [
    'assustado', 'homem_animado', 'homem_calmo', 'homem_ciumento', 'homem_confuso',
    'homem_desgostoso', 'homem_feliz', 'homem_focado', 'homem_furioso', 'homem_gargalhando',
    'homem_medo', 'homem_preocupado', 'homem_surpreso', 'homem_triste', 'mulher_animada',
    'mulher_calma', 'mulher_ciumenta', 'mulher_confusa', 'mulher_feliz', 'mulher_focada',
    'mulher_furiosa', 'mulher_gargalhando', 'mulher_medo', 'mulher_preocupada',
    'mulher_risada_engracada', 'mulher_surpresa', 'mulher_triste'
  ],
  escola: [
    'apontador_lapis', 'apontador_lapis_mesa', 'caderno', 'caixa_lapis', 'caneta_papel',
    'clips_papel', 'furador_papel', 'grampeador', 'grampeador_pequeno', 'lapis',
    'lapis_papel', 'livro', 'livro_colorir', 'palete_pintura', 'papel', 'post-it',
    'quebra_cabeça', 'quebra_cabeça_montando'
  ],
  necessidades: [
    'bandana', 'banheira', 'banheiro', 'boca', 'cilios', 'comer', 'dentes', 'descansar',
    'descarga_vaso_sanitario', 'dor_cabeca', 'dor_estomago', 'enxague_bucal',
    'escova_dente_eletrica', 'escova_dentes', 'estomago', 'estou_com_sede', 'eyes_resultado',
    'frasco_perfume', 'gel_banho', 'homem_dormindo', 'hora_cafe_manha', 'hora_jantar',
    'ir_ao_banheiro', 'jantar_dois', 'jantar_tres', 'lavar_maos', 'mulher_dormindo',
    'narina', 'olhos_azuis', 'olhos_castanhos', 'olhos_fechados', 'olhos_verdes',
    'papel_higienico', 'pasta_dentes', 'pes', 'sabao_liquido', 'sabonete', 'shampoo',
    'toalha', 'tomar banho', 'touca_banho', 'usando_vaso_sanitario', 'vaso_sanitario',
    'vaso_sanitario_deficientes', 'vaso_sanitario_feminino', 'vaso_sanitario_masculino'
  ],
  objetos: [
    'balao', 'blackberry', 'bola_basquete', 'bola_praia', 'bolsa', 'bowling_resultado',
    'carro de policia', 'cubo', 'dado_jogo', 'escovao', 'fantoche_dedo', 'fita_colorida',
    'gol_futebol', 'gravador_antigo', 'lapis_sobrancelha', 'lixa_mao', 'luva_bola_baseball',
    'mala_viagem', 'maleta_viagem', 'maquina_fotografica', 'papel_presente', 'papel_toalha',
    'peteca', 'pilao_socador', 'pinca', 'piscina_bolinhas', 'prego', 'relogio',
    'taco_bola_baseball', 'talao_cheques_antigo', 'yo-yo'
  ],
  pessoas: [
    'avó', 'avô', 'cantor de natal', 'cantor', 'carteiro', 'chefe de cozinha', 'cozinheira',
    'dentista', 'enfermeira', 'enteada', 'enteado', 'entregador', 'familia', 'faxineira',
    'fazendeiro', 'filha', 'filho', 'fisioterapeuta', 'florista', 'garçom de mesa',
    'garçon', 'grupo de trabalho', 'idoso', 'irmã', 'irmão', 'jardineiro', 'jornaleiro',
    'leiteiro', 'lixeiro', 'madrasta', 'marinheiro', 'medico', 'meia_irmã', 'meio_irmão',
    'musico', 'mãe', 'old_person_2_resultado', 'padeira', 'padrasto', 'pai', 'pais',
    'piloto de aviao', 'policial', 'professor', 'professor_universitário', 'secretaria',
    'soldado', 'taxista', 'tia_materna', 'tia_paterna', 'tio_materno', 'tio_paterno'
  ],
  rotina: [
    'Ir para casa', 'Ontem', 'Tarde', 'almoco', 'amanha', 'arco_iris', 'aula_algebra_resultado',
    'aula_ciencias_resultado', 'aula_educacao_fisica_resultado', 'aula_musica_resultado',
    'aula_natacao_resultado', 'brincar', 'cafe_manha', 'cafe_tarde', 'chuva', 'domingo',
    'ensolarado', 'estudar', 'estudar_computacao', 'estudar_computador_casa',
    'estudar_geografia', 'estudar_historia', 'estudar_ingles', 'estudar_matematica',
    'hoje', 'hora_acordar', 'hora_dormir', 'jantar', 'licao_casa', 'manha', 'mochila_escola',
    'mudanca_tempo', 'noite', 'quarta_feira', 'quinta_feira', 'sabado', 'segunda_feira',
    'sem_escola_hoje_resultado', 'semana', 'sexta_feira', 'terca_feira', 'tomar_banho',
    'ver_televisao'
  ],
  roupas: [
    'calcas', 'camisa', 'camiseta', 'capa_chuva', 'casaco', 'colete', 'gravata',
    'meia_cano_alto', 'meias', 'moletom', 'sapato_feminino', 'sapato_masculino', 'vestido'
  ],
  transportes: [
    'aviao_comercial', 'aviao_jato', 'carro_azul', 'carro_vermelho', 'guincho', 'metro',
    'micro_onibus', 'onibus_dois_andares', 'trem', 'viagem'
  ]
};

// Interface para Card
interface Card {
  id: string;
  text: string;
  image: string;
  category: string;
  unlocked: boolean;
  timesUsed: number;
}

// Interface para NPC
interface NPC {
  name: string;
  avatar: string;
  need: string;
  needImage: string;
  responses: string[];
  satisfied: boolean;
}

// Interface para Level
interface Level {
  id: number;
  name: string;
  description: string;
  npcs: NPC[];
  completed: boolean;
  stars: number;
}

export default function MagicWordsGame() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [currentNPC, setCurrentNPC] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [milaMessage, setMilaMessage] = useState("Olá! Eu sou a Mila! O Reino das Palavras precisa de você!");
  const [isPlaying, setIsPlaying] = useState(false);
  const [unlockedCards, setUnlockedCards] = useState<Set<string>>(new Set());
  const [totalStars, setTotalStars] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('necessidades');

  // Função para criar um card a partir do nome do arquivo
  const createCard = (filename: string, category: string, unlocked: boolean = false): Card => {
    const text = filename
      .replace(/_/g, ' ')
      .replace(/\.webp$/, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      id: filename.replace('.webp', ''),
      text: text,
      image: `/images/cards/${category}/${filename}.webp`,
      category: category,
      unlocked: unlocked,
      timesUsed: 0
    };
  };

  // Criar cards iniciais de cada categoria
  const getInitialCards = () => {
    const cards: Card[] = [];
    
    // Pegar 3 cards de cada categoria principal
    ['necessidades', 'core', 'emocoes', 'rotina'].forEach(category => {
      const categoryCards = CARDS_DATABASE[category as keyof typeof CARDS_DATABASE] || [];
      categoryCards.slice(0, 3).forEach((cardName, index) => {
        cards.push(createCard(cardName, category, index === 0));
      });
    });
    
    return cards;
  };

  // Níveis do jogo
  const levels: Level[] = [
    {
      id: 1,
      name: "Vila das Palavras",
      description: "Ajude os moradores com suas necessidades básicas!",
      npcs: [
        {
          name: "João",
          avatar: "👦",
          need: "Estou com sede",
          needImage: '/images/cards/necessidades/estou_com_sede.webp',
          responses: ['estou_com_sede'],
          satisfied: false
        },
        {
          name: "Maria",
          avatar: "👧",
          need: "Preciso ir ao banheiro",
          needImage: '/images/cards/necessidades/ir_ao_banheiro.webp',
          responses: ['ir_ao_banheiro'],
          satisfied: false
        },
        {
          name: "Pedro",
          avatar: "🧑",
          need: "Quero comer",
          needImage: '/images/cards/necessidades/comer.webp',
          responses: ['comer'],
          satisfied: false
        }
      ],
      completed: false,
      stars: 0
    },
    {
      id: 2,
      name: "Floresta das Emoções",
      description: "Ajude a identificar sentimentos!",
      npcs: [
        {
          name: "Ana",
          avatar: "👩",
          need: "Estou feliz!",
          needImage: '/images/cards/emocoes/mulher_feliz.webp',
          responses: ['mulher_feliz'],
          satisfied: false
        },
        {
          name: "Carlos",
          avatar: "👨",
          need: "Estou triste",
          needImage: '/images/cards/emocoes/homem_triste.webp',
          responses: ['homem_triste'],
          satisfied: false
        }
      ],
      completed: false,
      stars: 0
    }
  ];

  const [gameState, setGameState] = useState({
    levels: levels,
    currentCards: getInitialCards()
  });

  // Função de fala
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Mila fala
  const milaSpeak = useCallback((message: string) => {
    setMilaMessage(message);
    speak(message);
  }, [speak]);

  // Iniciar jogo
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setCurrentLevel(0);
    setCurrentNPC(0);
    milaSpeak("Vamos ajudar os habitantes do Reino das Palavras! Escolha o card correto para cada pedido!");
  }, [milaSpeak]);

  // Selecionar card
  const selectCard = useCallback((card: Card) => {
    speak(card.text);
    setSelectedCards([card]);
    
    const level = gameState.levels[currentLevel];
    const npc = level.npcs[currentNPC];
    
    if (npc.responses.includes(card.id)) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  }, [currentLevel, currentNPC, gameState.levels, speak]);

  // Resposta correta
  const handleCorrectAnswer = useCallback(() => {
    setScore(prev => prev + 100);
    setStars(prev => prev + 1);
    
    // Desbloqueia um novo card aleatório
    const lockedCards = gameState.currentCards.filter(c => !c.unlocked && !unlockedCards.has(c.id));
    if (lockedCards.length > 0) {
      const randomCard = lockedCards[Math.floor(Math.random() * lockedCards.length)];
      setUnlockedCards(prev => new Set(prev).add(randomCard.id));
      milaSpeak(`Parabéns! Você desbloqueou o card "${randomCard.text}"!`);
    } else {
      milaSpeak("Muito bem! Você acertou!");
    }
    
    const updatedLevels = [...gameState.levels];
    updatedLevels[currentLevel].npcs[currentNPC].satisfied = true;
    setGameState(prev => ({ ...prev, levels: updatedLevels }));
    
    setTimeout(() => {
      if (currentNPC < gameState.levels[currentLevel].npcs.length - 1) {
        setCurrentNPC(prev => prev + 1);
        setSelectedCards([]);
      } else {
        completeLevel();
      }
    }, 2000);
  }, [currentLevel, currentNPC, gameState, milaSpeak]);

  // Resposta errada
  const handleWrongAnswer = useCallback(() => {
    setHearts(prev => Math.max(0, prev - 1));
    milaSpeak("Ops! Não foi dessa vez. Tente outro card!");
    setSelectedCards([]);
    
    if (hearts <= 1) {
      milaSpeak("Não desista! Vamos tentar novamente!");
      setHearts(3);
    }
  }, [hearts, milaSpeak]);

  // Completar nível
  const completeLevel = useCallback(() => {
    setShowReward(true);
    const starsEarned = hearts;
    setTotalStars(prev => prev + starsEarned);
    
    milaSpeak(`Incrível! Você completou o nível e ganhou ${starsEarned} estrelas!`);
    
    const updatedLevels = [...gameState.levels];
    updatedLevels[currentLevel].completed = true;
    updatedLevels[currentLevel].stars = starsEarned;
    setGameState(prev => ({ ...prev, levels: updatedLevels }));
    
    setTimeout(() => {
      setShowReward(false);
      if (currentLevel < gameState.levels.length - 1) {
        setCurrentLevel(prev => prev + 1);
        setCurrentNPC(0);
        setHearts(3);
        setSelectedCards([]);
      } else {
        milaSpeak("Parabéns! Você salvou o Reino das Palavras!");
        setIsPlaying(false);
      }
    }, 3000);
  }, [currentLevel, hearts, gameState.levels, milaSpeak]);

  // Cards disponíveis para seleção
  const getAvailableCards = () => {
    const categoryCards = CARDS_DATABASE[selectedCategory as keyof typeof CARDS_DATABASE] || [];
    return categoryCards.slice(0, 12).map(cardName => {
      const card = createCard(cardName, selectedCategory);
      card.unlocked = true; // Para testes, todos desbloqueados
      return card;
    });
  };

  const level = gameState.levels[currentLevel];
  const npc = level?.npcs[currentNPC];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-300 via-pink-200 to-yellow-100 relative overflow-hidden">
      {/* Nuvens animadas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full opacity-70 animate-pulse" />
        <div className="absolute top-40 right-20 w-40 h-24 bg-white rounded-full opacity-60 animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-3xl p-4 mb-6 shadow-xl border-4 border-purple-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-purple-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
                🏰 Palavras Mágicas 🏰
              </h1>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span className="font-bold">{totalStars}</span>
              </div>
              <div className="bg-gradient-to-br from-red-400 to-pink-400 text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span className="font-bold">{hearts}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Área principal do jogo */}
        {!isPlaying ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-purple-200">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4 text-purple-600">🌟 Reino das Palavras 🌟</h2>
              <p className="text-xl text-gray-700 mb-6">
                Ajude os habitantes a se comunicarem usando os Cristais de Comunicação!
              </p>
              
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-2xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                <Sparkles className="inline w-6 h-6 mr-2" />
                Começar Aventura
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* NPC e necessidade */}
            {npc && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-xl border-4 border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{npc.avatar}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-purple-600">{npc.name}</h3>
                      <p className="text-lg text-gray-700">{npc.need}</p>
                    </div>
                  </div>
                  <div className="w-32 h-32 rounded-2xl border-4 border-purple-300 overflow-hidden bg-white p-2">
                    <img 
                      src={npc.needImage} 
                      alt="Necessidade"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Seletor de categoria */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 mb-4 shadow-xl border-4 border-purple-200">
              <div className="flex flex-wrap justify-center gap-2">
                {Object.keys(CARDS_DATABASE).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade de Cards */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-purple-200">
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {getAvailableCards().map((card) => (
                  <button
                    key={card.id}
                    onClick={() => selectCard(card)}
                    onMouseEnter={() => speak(card.text)}
                    className="relative group transform transition-all duration-300 hover:scale-110"
                  >
                    <div className="bg-white rounded-xl border-2 border-purple-300 p-2 shadow-lg group-hover:shadow-xl">
                      <img 
                        src={card.image}
                        alt={card.text}
                        className="w-full h-20 object-contain mb-1"
                        onError={(e) => {
                          const img = e.currentTarget;
                          img.style.display = 'none';
                        }}
                      />
                      <p className="text-xs font-semibold text-center">{card.text}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(card.text);
                      }}
                      className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mila Mascote */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-3xl opacity-50" />
          
          <div className="relative w-48 h-48">
            <img 
              src="/images/mascotes/mila/mila_feiticeira_resultado.webp"
              alt="Mila Mascote"
              className="w-full h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                const img = e.currentTarget;
                img.src = '/images/mascotes/mila/mila_apoio_resultado.webp';
              }}
            />
          </div>
          
          <div className="absolute bottom-full mb-4 right-0 bg-white p-4 rounded-2xl shadow-xl min-w-[250px] max-w-[350px] border-3 border-purple-400">
            <p className="text-gray-800 font-semibold">{milaMessage}</p>
          </div>
        </div>
      </div>

      {/* Modal de Recompensa */}
      {showReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full transform animate-bounce border-4 border-yellow-400">
            <h2 className="text-4xl font-bold text-center mb-4">🎉 Nível Completo! 🎉</h2>
            <div className="text-6xl text-center mb-4">
              {[...Array(hearts)].map((_, i) => (
                <Star key={i} className="inline w-12 h-12 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
