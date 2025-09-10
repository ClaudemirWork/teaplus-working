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
  // ========================================
  // CATEGORIA: PERSONAGENS (10 cards)
  // ========================================
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
  {
    id: 'cozinheiro',
    cardId: 'cozinheiro',
    category: 'personagens',
    displayLabel: 'Cozinheiro',
    image: '/narrative_cards/personagens/cozinheiro.webp',
    phrases: [
      'O _______ usa um chapéu branco bem alto.',
      'Quem prepara a comida deliciosa? É o _______.',
      'O _______ corta os legumes com muito cuidado.',
      'O _______ faz o bolo de chocolate mais gostoso.',
      'No restaurante, o _______ cozinha para todos.'
    ]
  },
  {
    id: 'gato',
    cardId: 'gatinho',
    category: 'personagens',
    displayLabel: 'Gato',
    image: '/narrative_cards/personagens/gatinho.webp',
    phrases: [
      'Miau! O _______ está miando na janela.',
      'O _______ gosta de brincar com novelo de lã.',
      'O _______ dorme o dia todo no sofá.',
      'O _______ tem bigodes compridos.',
      'O _______ caça ratinhos à noite.'
    ]
  },
  {
    id: 'menina',
    cardId: 'menina',
    category: 'personagens',
    displayLabel: 'Menina',
    image: '/narrative_cards/personagens/filha.webp', // CORRIGIDO
    phrases: [
      'A _______ brinca com sua boneca favorita.',
      'A _______ usa vestido colorido.',
      'A _______ pula corda no recreio.',
      'A _______ desenha flores no caderno.',
      'A _______ canta músicas alegres.'
    ]
  },
  {
    id: 'menino',
    cardId: 'menino',
    category: 'personagens',
    displayLabel: 'Menino',
    image: '/narrative_cards/personagens/filho.webp', // CORRIGIDO
    phrases: [
      'O _______ joga bola com os amigos.',
      'O _______ anda de bicicleta no parque.',
      'O _______ faz a lição de casa.',
      'O _______ gosta de videogame.',
      'O _______ coleciona figurinhas.'
    ]
  },
  {
    id: 'passarinho',
    cardId: 'passarinho',
    category: 'personagens',
    displayLabel: 'Passarinho',
    image: '/narrative_cards/personagens/tartaruga.webp', // Passarinho não existe, usando tartaruga como placeholder de animal pequeno
    phrases: [
      'O _______ canta na árvore.',
      'O _______ faz seu ninho nos galhos.',
      'O _______ voa bem alto no céu.',
      'O _______ come sementes e frutas.',
      'O _______ acorda cedo e canta.'
    ]
  },
  {
    id: 'policial',
    cardId: 'policial',
    category: 'personagens',
    displayLabel: 'Policial',
    image: '/narrative_cards/personagens/policial.webp',
    phrases: [
      'O _______ protege as pessoas.',
      'O _______ usa uniforme azul.',
      'O _______ dirige a viatura.',
      'O _______ ajuda quem precisa.',
      'O _______ cuida da segurança da cidade.'
    ]
  },
  {
    id: 'professor',
    cardId: 'professor',
    category: 'personagens',
    displayLabel: 'Professor',
    image: '/narrative_cards/personagens/professor.webp',
    phrases: [
      'O _______ ensina na escola.',
      'O _______ escreve no quadro.',
      'O _______ explica a matéria.',
      'O _______ corrige as provas.',
      'O _______ ajuda os alunos a aprender.'
    ]
  },
  {
    id: 'professora',
    cardId: 'professora',
    category: 'personagens',
    displayLabel: 'Professora',
    image: '/narrative_cards/personagens/professora.webp',
    phrases: [
      'A _______ conta histórias para a turma.',
      'A _______ ensina a ler e escrever.',
      'A _______ organiza as atividades.',
      'A _______ abraça os alunos.',
      'A _______ prepara aulas divertidas.'
    ]
  },

  // ========================================
  // CATEGORIA: AÇÕES (12 cards)
  // ========================================
  {
    id: 'abrir',
    cardId: 'abrir',
    category: 'acoes',
    displayLabel: 'Abrir',
    image: '/narrative_cards/acoes/abrir_porta.webp', // CORRIGIDO
    phrases: [
      'Vamos _______ a porta para entrar.',
      'É hora de _______ o presente de aniversário!',
      'Preciso _______ a janela, está calor.',
      'Vou _______ o livro para ler a história.',
      'Quero _______ a caixa de brinquedos.'
    ]
  },
  {
    id: 'andar',
    cardId: 'andar',
    category: 'acoes',
    displayLabel: 'Andar',
    image: '/narrative_cards/acoes/caminhar.webp', // CORRIGIDO
    phrases: [
      'Vamos _______ até o parque.',
      'O bebê aprendeu a _______ sozinho.',
      'Gosto de _______ na praia.',
      'Vou _______ de mãos dadas com você.',
      'É bom _______ depois de comer.'
    ]
  },
  {
    id: 'brincar',
    cardId: 'brincar',
    category: 'acoes',
    displayLabel: 'Brincar',
    image: '/narrative_cards/acoes/brincar.webp',
    phrases: [
      'Vamos _______ no parquinho!',
      'Quero _______ de esconde-esconde.',
      'É divertido _______ com os amigos.',
      'Vou _______ com meus brinquedos.',
      'Adoro _______ na hora do recreio.'
    ]
  },
  {
    id: 'comer',
    cardId: 'comer',
    category: 'acoes',
    displayLabel: 'Comer',
    image: '/narrative_cards/acoes/comer.webp',
    phrases: [
      'Vamos _______ o almoço juntos.',
      'Quero _______ pizza hoje.',
      'É hora de _______ a fruta.',
      'O coelho gosta de _______ cenoura.',
      'Preciso _______ verduras para crescer.'
    ]
  },
  {
    id: 'correr',
    cardId: 'correr',
    category: 'acoes',
    displayLabel: 'Correr',
    image: '/narrative_cards/acoes/correr.webp',
    phrases: [
      'Vou _______ bem rápido!',
      'O cachorro adora _______ no jardim.',
      'Não pode _______ na escola.',
      'Vamos _______ até a árvore.',
      'Gosto de _______ com meus amigos.'
    ]
  },
  {
    id: 'dormir',
    cardId: 'dormir',
    category: 'acoes',
    displayLabel: 'Dormir',
    image: '/narrative_cards/acoes/dormir_lado.webp', // CORRIGIDO
    phrases: [
      'É hora de _______ , boa noite!',
      'O bebê vai _______ no berço.',
      'Vou _______ cedo hoje.',
      'O gato gosta de _______ no sofá.',
      'Preciso _______ para descansar.'
    ]
  },
  {
    id: 'escrever',
    cardId: 'escrever',
    category: 'acoes',
    displayLabel: 'Escrever',
    image: '/narrative_cards/acoes/escrever.webp',
    phrases: [
      'Vou _______ meu nome no caderno.',
      'Quero _______ uma carta.',
      'A professora vai _______ no quadro.',
      'Vamos _______ a lista de compras.',
      'Sei _______ o alfabeto todo.'
    ]
  },
  {
    id: 'estudar',
    cardId: 'estudar',
    category: 'acoes',
    displayLabel: 'Estudar',
    image: '/narrative_cards/acoes/estudar.webp',
    phrases: [
      'Preciso _______ para a prova.',
      'Vou _______ matemática.',
      'É importante _______ todos os dias.',
      'Vamos _______ juntos.',
      'Gosto de _______ com música.'
    ]
  },
  {
    id: 'jogar',
    cardId: 'jogar',
    category: 'acoes',
    displayLabel: 'Jogar',
    image: '/narrative_cards/acoes/jogar_futebol.webp', // CORRIGIDO
    phrases: [
      'Vamos _______ futebol!',
      'Quero _______ videogame.',
      'Vou _______ a bola para você.',
      'É divertido _______ com os amigos.',
      'Sei _______ xadrez.'
    ]
  },
  {
    id: 'ler',
    cardId: 'ler',
    category: 'acoes',
    displayLabel: 'Ler',
    image: '/narrative_cards/acoes/ler_livro.webp', // CORRIGIDO
    phrases: [
      'Vou _______ uma história.',
      'Gosto de _______ antes de dormir.',
      'A mamãe vai _______ para mim.',
      'Sei _______ palavras grandes.',
      'Vamos _______ juntos.'
    ]
  },
  {
    id: 'ouvir',
    cardId: 'ouvir',
    category: 'acoes',
    displayLabel: 'Ouvir',
    image: '/narrative_cards/acoes/escutar.webp', // CORRIGIDO
    phrases: [
      'Vamos _______ música.',
      'Quero _______ uma história.',
      'É importante _______ a professora.',
      'Gosto de _______ os passarinhos.',
      'Vou _______ com atenção.'
    ]
  },
  {
    id: 'pular',
    cardId: 'pular',
    category: 'acoes',
    displayLabel: 'Pular',
    image: '/narrative_cards/acoes/saltar.webp', // CORRIGIDO
    phrases: [
      'Vou _______ bem alto!',
      'O coelho sabe _______ rápido.',
      'Vamos _______ corda.',
      'Quero _______ na cama elástica.',
      'É divertido _______ poças de água.'
    ]
  },

  // ========================================
  // CATEGORIA: LUGARES (7 cards)
  // ========================================
  {
    id: 'casa',
    cardId: 'casa',
    category: 'lugares',
    displayLabel: 'Casa',
    image: '/narrative_cards/lugares/casa.webp',
    phrases: [
      'Moro em uma _______ bonita.',
      'Vamos voltar para _______.',
      'A _______ tem um jardim grande.',
      'Na minha _______ tem três quartos.',
      'Gosto de ficar em _______ com a família.'
    ]
  },
  {
    id: 'escola',
    cardId: 'escola',
    category: 'lugares',
    displayLabel: 'Escola',
    image: '/narrative_cards/lugares/escola.webp',
    phrases: [
      'Vou para a _______ estudar.',
      'Na _______ aprendo muitas coisas.',
      'A _______ tem uma quadra grande.',
      'Tenho muitos amigos na _______.',
      'A _______ abre às 7 horas.'
    ]
  },
  {
    id: 'jardim',
    cardId: 'jardim',
    category: 'lugares',
    displayLabel: 'Jardim',
    image: '/narrative_cards/lugares/jardim.webp',
    phrases: [
      'No _______ tem flores coloridas.',
      'Vou regar as plantas do _______.',
      'O _______ está cheio de borboletas.',
      'Gosto de brincar no _______.',
      'O _______ da vovó é lindo.'
    ]
  },
  {
    id: 'mercado',
    cardId: 'mercado',
    category: 'lugares',
    displayLabel: 'Mercado',
    image: '/narrative_cards/lugares/loja.webp', // CORRIGIDO
    phrases: [
      'Vamos ao _______ comprar comida.',
      'No _______ tem muitas frutas.',
      'O _______ vende pão fresquinho.',
      'Encontrei meu amigo no _______.',
      'O _______ abre cedo.'
    ]
  },
  {
    id: 'parque',
    cardId: 'parque',
    category: 'lugares',
    displayLabel: 'Parque',
    image: '/narrative_cards/lugares/jardim.webp', // Parque não existe, usando Jardim
    phrases: [
      'Vamos brincar no _______!',
      'O _______ tem balanços e escorregador.',
      'No _______ posso andar de bicicleta.',
      'O _______ está cheio de crianças.',
      'Tem um lago no _______.'
    ]
  },
  {
    id: 'praia',
    cardId: 'praia',
    category: 'lugares',
    displayLabel: 'Praia',
    image: '/narrative_cards/lugares/praia.webp',
    phrases: [
      'Na _______ tem areia e mar.',
      'Vou fazer castelo de areia na _______.',
      'A _______ está cheia de gente.',
      'Gosto de nadar na _______.',
      'O sol brilha na _______.'
    ]
  },
  {
    id: 'quarto',
    cardId: 'quarto',
    category: 'lugares',
    displayLabel: 'Quarto',
    image: '/narrative_cards/lugares/dentro_quarto.webp', // CORRIGIDO
    phrases: [
      'Durmo no meu _______ todas as noites.',
      'Meu _______ tem uma cama confortável.',
      'Guardo os brinquedos no _______.',
      'O _______ está arrumado.',
      'Gosto de ler no meu _______.'
    ]
  },

  // ========================================
  // CATEGORIA: OBJETOS (3 cards)
  // ========================================
  {
    id: 'bola',
    cardId: 'bola',
    category: 'objetos',
    displayLabel: 'Bola',
    image: '/narrative_cards/objetos/bola_praia.webp', // CORRIGIDO
    phrases: [
      'A _______ é redonda e colorida.',
      'Vou chutar a _______ no gol.',
      'A _______ pulou o muro.',
      'Brincamos com a _______ no parque.',
      'O cachorro pegou a _______.'
    ]
  },
  {
    id: 'boneca',
    cardId: 'boneca',
    category: 'objetos',
    displayLabel: 'Boneca',
    image: '/narrative_cards/objetos/brinquedo_menina.webp', // CORRIGIDO
    phrases: [
      'A _______ tem um vestido rosa.',
      'Vou pentear o cabelo da _______.',
      'Minha _______ dorme comigo.',
      'A _______ está na caixa de brinquedos.',
      'Ganhei uma _______ nova.'
    ]
  },
  {
    id: 'carrinho',
    cardId: 'carrinho',
    category: 'objetos',
    displayLabel: 'Carrinho',
    image: '/narrative_cards/objetos/carrinho_brinquedo.webp', // CORRIGIDO
    phrases: [
      'Meu _______ é vermelho e rápido.',
      'O _______ tem quatro rodas.',
      'Vou brincar com o _______ na pista.',
      'O _______ de controle remoto é legal.',
      'Coleciono _______ de corrida.'
    ]
  },

  // ========================================
  // CATEGORIA: TEMPO (7 cards)
  // ========================================
  {
    id: 'noite',
    cardId: 'noite',
    category: 'tempo',
    displayLabel: 'Noite',
    image: '/narrative_cards/tempo/noite.webp',
    phrases: [
      'À _______ aparecem as estrelas.',
      'Dormimos durante a _______.',
      'A _______ está escura.',
      'A lua brilha à _______.',
      'Boa _______! Vamos dormir.'
    ]
  },
  {
    id: 'manha',
    cardId: 'manha',
    category: 'tempo',
    displayLabel: 'Manhã',
    image: '/narrative_cards/tempo/manha.webp',
    phrases: [
      'De _______ tomamos café.',
      'O sol nasce de _______.',
      'Acordo cedo de _______.',
      'A _______ está fresquinha.',
      'Vou à escola de _______.'
    ]
  },
  {
    id: 'tarde',
    cardId: 'tarde',
    category: 'tempo',
    displayLabel: 'Tarde',
    image: '/narrative_cards/tempo/tarde.webp',
    phrases: [
      'À _______ fazemos a lição.',
      'O sol esquenta à _______.',
      'Lancho à _______.',
      'À _______ brincamos no parque.',
      'A _______ passa rápido.'
    ]
  },
  {
    id: 'hoje',
    cardId: 'hoje',
    category: 'tempo',
    displayLabel: 'Hoje',
    image: '/narrative_cards/tempo/hoje.webp',
    phrases: [
      '_______ é um dia especial.',
      '_______ vamos ao cinema.',
      '_______ está chovendo.',
      '_______ é meu aniversário.',
      '_______ aprendi algo novo.'
    ]
  },
  {
    id: 'amanha',
    cardId: 'amanha',
    category: 'tempo',
    displayLabel: 'Amanhã',
    image: '/narrative_cards/tempo/amanha.webp',
    phrases: [
      '_______ vamos viajar.',
      '_______ tem aula de educação física.',
      '_______ é sábado.',
      'Vejo você _______.',
      '_______ será um novo dia.'
    ]
  },
  {
    id: 'ontem',
    cardId: 'ontem',
    category: 'tempo',
    displayLabel: 'Ontem',
    image: '/narrative_cards/tempo/ontem.webp',
    phrases: [
      '_______ foi muito divertido.',
      '_______ choveu o dia todo.',
      '_______ fui ao parque.',
      '_______ comi pizza.',
      '_______ aprendi a andar de bicicleta.'
    ]
  },
  {
    id: 'chuva',
    cardId: 'chuva',
    category: 'tempo',
    displayLabel: 'Chuva',
    image: '/narrative_cards/tempo/chuva.webp',
    phrases: [
      'A _______ molha as plantas.',
      'Gosto do barulho da _______.',
      'Não esqueça o guarda-_______!',
      'A _______ forma poças na rua.',
      'Hoje o dia está com _______.'
    ]
  },
  
  // ========================================
  // CATEGORIA: EMOÇÕES (8 cards)
  // ========================================
  {
    id: 'feliz',
    cardId: 'homem_feliz',
    category: 'emocoes',
    displayLabel: 'Feliz',
    image: '/narrative_cards/emocoes/homem_feliz.webp',
    phrases: [
      'Estou _______ porque ganhei um presente.',
      'O cachorro fica _______ quando vê o dono.',
      'As crianças estão _______ brincando.',
      'Fico _______ quando como chocolate.',
      'A mamãe está _______ hoje.'
    ]
  },
  {
    id: 'triste',
    cardId: 'homem_triste',
    category: 'emocoes',
    displayLabel: 'Triste',
    image: '/narrative_cards/emocoes/homem_triste.webp',
    phrases: [
      'Fiquei _______ quando perdi meu brinquedo.',
      'O menino está _______ porque choveu.',
      'Não fique _______, vou te ajudar.',
      'O gatinho parece _______.',
      'Ela chorou porque estava _______.'
    ]
  },
  {
    id: 'bravo',
    cardId: 'homem_bravo',
    category: 'emocoes',
    displayLabel: 'Bravo',
    image: '/narrative_cards/emocoes/homem_bravo.webp',
    phrases: [
      'O papai ficou _______ com a bagunça.',
      'Não fique _______ comigo.',
      'O leão está _______ e rugindo.',
      'Ela está _______ porque perdeu o jogo.',
      'Quando fico _______, respiro fundo.'
    ]
  },
  {
    id: 'assustado',
    cardId: 'homem_assustado',
    category: 'emocoes',
    displayLabel: 'Assustado',
    image: '/narrative_cards/emocoes/homem_medo.webp', // CORRIGIDO
    phrases: [
      'Fiquei _______ com o trovão.',
      'O gatinho está _______ com o barulho.',
      'Não precisa ficar _______.',
      'Ela ficou _______ no escuro.',
      'O passarinho está _______ na gaiola.'
    ]
  },
  {
    id: 'surpreso',
    cardId: 'homem_surpreso',
    category: 'emocoes',
    displayLabel: 'Surpreso',
    image: '/narrative_cards/emocoes/homem_surpreso.webp',
    phrases: [
      'Fiquei _______ com a festa!',
      'Que _______! Não esperava isso.',
      'Ela está _______ com o presente.',
      'O menino ficou _______ com a notícia.',
      'Todos ficaram _______ com a mágica.'
    ]
  },
  {
    id: 'calmo',
    cardId: 'homem_calmo',
    category: 'emocoes',
    displayLabel: 'Calmo',
    image: '/narrative_cards/emocoes/homem_calmo.webp',
    phrases: [
      'Fico _______ quando ouço música.',
      'O mar está _______ hoje.',
      'Respire fundo para ficar _______.',
      'O bebê está _______ dormindo.',
      'O jardim deixa todos _______.'
    ]
  },
  {
    id: 'animado',
    cardId: 'homem_animado',
    category: 'emocoes',
    displayLabel: 'Animado',
    image: '/narrative_cards/emocoes/homem_animado.webp',
    phrases: [
      'Estou _______ para a festa!',
      'As crianças estão _______ com o passeio.',
      'Fico _______ quando vou viajar.',
      'O cachorro está _______ para passear.',
      'Todos estão _______ com o jogo.'
    ]
  },
  {
    id: 'confuso',
    cardId: 'homem_confuso',
    category: 'emocoes',
    displayLabel: 'Confuso',
    image: '/narrative_cards/emocoes/homem_confuso.webp',
    phrases: [
      'Estou _______ com esta lição.',
      'O mapa me deixou _______.',
      'Ele ficou _______ com a pergunta.',
      'A mágica me deixou _______.',
      'Não entendi, estou _______.'
    ]
  },

];

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

// Função para embaralhar arrays
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
  const sameCategory = challengesData.filter(
    c => c.category === correctChallenge.category && c.id !== correctChallenge.id
  );
  
  const otherCategories = challengesData.filter(
    c => c.category !== correctChallenge.category
  );
  
  // Prioriza distratores da mesma categoria
  let distractors = [...sameCategory];
  
  // Se não houver distratores suficientes da mesma categoria, adiciona de outras
  if (distractors.length < count) {
    distractors = [...distractors, ...otherCategories];
  }
  
  return shuffleArray(distractors).slice(0, count);
};

// Função para obter estatísticas dos dados
export const getDataStats = () => {
  const categories = {
    personagens: getChallengesByCategory('personagens').length,
    acoes: getChallengesByCategory('acoes').length,
    lugares: getChallengesByCategory('lugares').length,
    objetos: getChallengesByCategory('objetos').length,
    tempo: getChallengesByCategory('tempo').length,
    emocoes: getChallengesByCategory('emocoes').length
  };
  
  const totalCards = challengesData.length;
  const totalPhrases = challengesData.reduce((sum, card) => sum + card.phrases.length, 0);
  
  return {
    totalCards,
    totalPhrases,
    categories,
    averagePhrasesPerCard: (totalCards > 0 ? (totalPhrases / totalCards) : 0).toFixed(1)
  };
};

// Log das estatísticas para debug
console.log('📊 Estatísticas do Histórias Épicas (Versão Corrigida):', getDataStats());
