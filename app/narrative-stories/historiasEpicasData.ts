// Arquivo: app/narrative-stories/historiasEpicasData.ts

export interface Challenge {
  id: string;
  cardId: string;
  category: 'personagens' | 'acoes' | 'lugares' | 'objetos' | 'tempo' | 'emocoes';
  displayLabel: string;
  image: string;
  phrases: string[];
}

export const challengesData: Challenge[] = [
  // ========== PERSONAGENS ==========
  {
    id: 'cachorro',
    cardId: 'cachorro',
    category: 'personagens',
    displayLabel: 'Cachorro',
    image: '/narrative_cards/personagens/cachorro.webp',
    phrases: [
      'Au au! O _______ está latindo no portão.',
      'O _______ adora correr atrás da bolinha no parque.',
      'Quem balança o rabo quando está feliz? É o _______.',
      'O _______ come ração em sua tigela.',
      'O melhor amigo do menino é o seu _______.'
    ]
  },
  {
    id: 'carteiro',
    cardId: 'carteiro',
    category: 'personagens',
    displayLabel: 'Carteiro',
    image: '/narrative_cards/personagens/carteiro.webp',
    phrases: [
      'O _______ entrega as cartas em nossa casa todos os dias.',
      'Quem usa uma bolsa cheia de correspondências? É o _______.',
      'O _______ toca a campainha para entregar uma encomenda.',
      'O _______ conhece todas as ruas do bairro.',
      'Para enviar um presente para a vovó, chamamos o _______.'
    ]
  },
  // Adicione todos os outros cards aqui seguindo o mesmo padrão...
  // Por enquanto, vou colocar apenas alguns exemplos de cada categoria

  // AÇÕES
  {
    id: 'comer',
    cardId: 'comer',
    category: 'acoes',
    displayLabel: 'Comer',
    image: '/narrative_cards/acoes/comer.webp',
    phrases: [
      'Na hora do almoço, toda a família senta para _______.',
      'Estou com muita fome, preciso _______ alguma coisa.',
      'A Magali adora _______ melancia.',
      'O bebê já aprendeu a _______ a papinha sozinho.',
      'Lave as mãos antes de _______.'
    ]
  },
  {
    id: 'brincar',
    cardId: 'brincar',
    category: 'acoes',
    displayLabel: 'Brincar',
    image: '/narrative_cards/acoes/brincar.webp',
    phrases: [
      'No recreio da escola, as crianças vão _______.',
      'O gatinho adora _______ com um novelo de lã.',
      'Depois de fazer a lição, eu posso _______ lá fora.',
      'Vamos chamar os amigos para _______ de esconde-esconde.',
      'Meu irmão e eu gostamos de _______ com carrinhos.'
    ]
  },

  // LUGARES
  {
    id: 'escola',
    cardId: 'escola',
    category: 'lugares',
    displayLabel: 'Escola',
    image: '/narrative_cards/lugares/escola.webp',
    phrases: [
      'Eu aprendo a ler e a escrever na _______.',
      'Meus amigos e minha professora ficam na _______.',
      'Na hora do recreio, eu brinco no pátio da _______.',
      'Todo dia de manhã, a mamãe me leva para a _______.',
      'Eu levo minha mochila e meu lanche para a _______.'
    ]
  },
  {
    id: 'casa',
    cardId: 'casa',
    category: 'lugares',
    displayLabel: 'Casa',
    image: '/narrative_cards/lugares/casa.webp',
    phrases: [
      'O lugar onde eu moro com minha família é a minha _______.',
      'Depois da escola, eu sempre volto para _______.',
      '"Não há lugar como a nossa _______", disse a Dorothy.',
      'Eu me sinto seguro e feliz dentro da minha _______.',
      'No fim de semana, eu gosto de brincar em _______.'
    ]
  },

  // OBJETOS
  {
    id: 'bola',
    cardId: 'bola_praia',
    category: 'objetos',
    displayLabel: 'Bola',
    image: '/narrative_cards/objetos/bola_praia.webp',
    phrases: [
      'No parque, as crianças jogam com a _______.',
      'A _______ colorida rola pelo campo.',
      'O cachorro adora buscar a _______.',
      'Para jogar futebol, precisamos de uma _______.',
      'A _______ de praia é leve e divertida.'
    ]
  },
  {
    id: 'mochila',
    cardId: 'mochila_escola',
    category: 'objetos',
    displayLabel: 'Mochila',
    image: '/narrative_cards/objetos/mochila_escola.webp',
    phrases: [
      'Eu carrego meus livros na _______.',
      'A _______ da escola tem muitos compartimentos.',
      'Não esqueça sua _______ antes de sair.',
      'A _______ está pesada com tantos cadernos.',
      'Minha _______ nova é azul e vermelha.'
    ]
  },

  // TEMPO
  {
    id: 'hoje',
    cardId: 'hoje',
    category: 'tempo',
    displayLabel: 'Hoje',
    image: '/narrative_cards/tempo/hoje.webp',
    phrases: [
      '_______ é o meu aniversário, vou ganhar um bolo!',
      'Ontem foi terça-feira, _______ é quarta-feira.',
      '"O que vamos almoçar _______?", perguntei para a mamãe.',
      '_______ o dia está ensolarado e bonito.',
      'A lição de casa de _______ já está feita.'
    ]
  },
  {
    id: 'manha',
    cardId: 'manha',
    category: 'tempo',
    displayLabel: 'Manhã',
    image: '/narrative_cards/tempo/manha.webp',
    phrases: [
      'O sol nasce e o dia começa de _______.',
      'Eu vou para a escola no período da _______.',
      '"Bom dia!", nós dizemos quando encontramos alguém de _______.',
      'Os passarinhos cantam bem alto de _______.',
      'O galo canta para anunciar que a _______ chegou.'
    ]
  },

  // EMOÇÕES
  {
    id: 'feliz',
    cardId: 'homem_feliz',
    category: 'emocoes',
    displayLabel: 'Feliz',
    image: '/narrative_cards/emocoes/homem_feliz.webp',
    phrases: [
      'O menino ficou _______ ao ganhar um presente.',
      'Quando recebo um abraço, eu fico _______.',
      'As crianças estão _______ brincando no parque.',
      'O cachorro fica _______ quando o dono chega.',
      'Estou muito _______ com minha nota boa!'
    ]
  },
  {
    id: 'triste',
    cardId: 'homem_triste',
    category: 'emocoes',
    displayLabel: 'Triste',
    image: '/narrative_cards/emocoes/homem_triste.webp',
    phrases: [
      'O menino ficou _______ porque perdeu seu brinquedo.',
      'Quando chove no dia do passeio, ficamos _______.',
      'O gatinho está _______ longe da mamãe.',
      'Não fique _______, vamos brincar juntos!',
      'Ela chorou porque estava muito _______.'
    ]
  }
];

// Função auxiliar para embaralhar arrays
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Função para obter desafios por categoria
export const getChallengesByCategory = (category: Challenge['category']): Challenge[] => {
  return challengesData.filter(challenge => challenge.category === category);
};

// Função para obter um desafio aleatório
export const getRandomChallenge = (): Challenge => {
  return challengesData[Math.floor(Math.random() * challengesData.length)];
};

// Função para obter distratores (cards incorretos)
export const getDistractors = (correctChallenge: Challenge, count: number = 3): Challenge[] => {
  const distractors = challengesData
    .filter(c => c.id !== correctChallenge.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
  return distractors;
};
