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
  // CATEGORIA: PERSONAGENS
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
    id: 'construtor',
    cardId: 'construtor',
    category: 'personagens',
    displayLabel: 'Construtor',
    image: '/narrative_cards/personagens/construtor.webp',
    phrases: [
      'O _______ usa capacete amarelo para trabalhar.',
      'Quem constrói as casas e prédios? É o _______.',
      'O _______ sabe usar o martelo e a furadeira.',
      'O _______ trabalha com tijolos e cimento.',
      'Para fazer uma casa nova, precisamos de um _______.'
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
    id: 'dentista',
    cardId: 'dentista',
    category: 'personagens',
    displayLabel: 'Dentista',
    image: '/narrative_cards/personagens/dentista.webp',
    phrases: [
      'O _______ cuida dos nossos dentes.',
      'Vamos ao _______ para manter os dentes saudáveis.',
      'O _______ ensina a escovar os dentes direito.',
      'O _______ usa uma cadeira que sobe e desce.',
      'Quando o dente dói, procuramos o _______.'
    ]
  },
  {
    id: 'elefante',
    cardId: 'elefante',
    category: 'personagens',
    displayLabel: 'Elefante',
    image: '/narrative_cards/personagens/elefante.webp',
    phrases: [
      'O _______ tem uma tromba muito comprida.',
      'O _______ é o maior animal terrestre.',
      'O _______ usa a tromba para pegar comida.',
      'O _______ vive em grupos na savana.',
      'As orelhas do _______ são enormes!'
    ]
  },
  {
    id: 'gato',
    cardId: 'gato',
    category: 'personagens',
    displayLabel: 'Gato',
    image: '/narrative_cards/personagens/gato.webp',
    phrases: [
      'Miau! O _______ está miando na janela.',
      'O _______ gosta de brincar com novelo de lã.',
      'O _______ dorme o dia todo no sofá.',
      'O _______ tem bigodes compridos.',
      'O _______ caça ratinhos à noite.'
    ]
  },
  {
    id: 'homem',
    cardId: 'homem',
    category: 'personagens',
    displayLabel: 'Homem',
    image: '/narrative_cards/personagens/homem.webp',
    phrases: [
      'O _______ está caminhando no parque.',
      'O _______ lê o jornal todas as manhãs.',
      'O _______ trabalha no escritório.',
      'O _______ usa gravata para trabalhar.',
      'O _______ gosta de assistir futebol.'
    ]
  },
  {
    id: 'menina',
    cardId: 'menina',
    category: 'personagens',
    displayLabel: 'Menina',
    image: '/narrative_cards/personagens/menina.webp',
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
    image: '/narrative_cards/personagens/menino.webp',
    phrases: [
      'O _______ joga bola com os amigos.',
      'O _______ anda de bicicleta no parque.',
      'O _______ faz a lição de casa.',
      'O _______ gosta de videogame.',
      'O _______ coleciona figurinhas.'
    ]
  },
  {
    id: 'mulher',
    cardId: 'mulher',
    category: 'personagens',
    displayLabel: 'Mulher',
    image: '/narrative_cards/personagens/mulher.webp',
    phrases: [
      'A _______ compra frutas na feira.',
      'A _______ trabalha no computador.',
      'A _______ pratica yoga pela manhã.',
      'A _______ leva os filhos à escola.',
      'A _______ prepara o jantar da família.'
    ]
  },
  {
    id: 'passarinho',
    cardId: 'passarinho',
    category: 'personagens',
    displayLabel: 'Passarinho',
    image: '/narrative_cards/personagens/passarinho.webp',
    phrases: [
      'O _______ canta na árvore.',
      'O _______ faz seu ninho nos galhos.',
      'O _______ voa bem alto no céu.',
      'O _______ come sementes e frutas.',
      'O _______ acorda cedo e canta.'
    ]
  },
  {
    id: 'peixe',
    cardId: 'peixe',
    category: 'personagens',
    displayLabel: 'Peixe',
    image: '/narrative_cards/personagens/peixe.webp',
    phrases: [
      'O _______ nada no aquário.',
      'O _______ respira debaixo da água.',
      'O _______ tem escamas brilhantes.',
      'O _______ come ração especial.',
      'O _______ faz bolhas na água.'
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
  // CATEGORIA: AÇÕES
  // ========================================
  {
    id: 'abrir',
    cardId: 'abrir',
    category: 'acoes',
    displayLabel: 'Abrir',
    image: '/narrative_cards/acoes/abrir.webp',
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
    image: '/narrative_cards/acoes/andar.webp',
    phrases: [
      'Vamos _______ até o parque.',
      'O bebê aprendeu a _______ sozinho.',
      'Gosto de _______ na praia.',
      'Vou _______ de mãos dadas com você.',
      'É bom _______ depois de comer.'
    ]
  },
  {
    id: 'beber',
    cardId: 'beber',
    category: 'acoes',
    displayLabel: 'Beber',
    image: '/narrative_cards/acoes/beber.webp',
    phrases: [
      'Vou _______ água porque estou com sede.',
      'É importante _______ suco de laranja.',
      'O gato vai _______ leite.',
      'Depois de correr, preciso _______ água.',
      'Vamos _______ um milk-shake gelado.'
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
    id: 'dar',
    cardId: 'dar',
    category: 'acoes',
    displayLabel: 'Dar',
    image: '/narrative_cards/acoes/dar.webp',
    phrases: [
      'Vou _______ um presente para você.',
      'Quero _______ comida para o cachorro.',
      'Vamos _______ um abraço na mamãe.',
      'Posso _______ um beijo no papai.',
      'É bom _______ carinho nos animais.'
    ]
  },
  {
    id: 'dormir',
    cardId: 'dormir',
    category: 'acoes',
    displayLabel: 'Dormir',
    image: '/narrative_cards/acoes/dormir.webp',
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
    id: 'fechar',
    cardId: 'fechar',
    category: 'acoes',
    displayLabel: 'Fechar',
    image: '/narrative_cards/acoes/fechar.webp',
    phrases: [
      'Vou _______ a porta do quarto.',
      'Preciso _______ a janela, está frio.',
      'Vamos _______ o livro agora.',
      'É hora de _______ os olhos para dormir.',
      'Não esqueça de _______ a torneira.'
    ]
  },
  {
    id: 'jogar',
    cardId: 'jogar',
    category: 'acoes',
    displayLabel: 'Jogar',
    image: '/narrative_cards/acoes/jogar.webp',
    phrases: [
      'Vamos _______ futebol!',
      'Quero _______ videogame.',
      'Vou _______ a bola para você.',
      'É divertido _______ com os amigos.',
      'Sei _______ xadrez.'
    ]
  },
  {
    id: 'lavar',
    cardId: 'lavar',
    category: 'acoes',
    displayLabel: 'Lavar',
    image: '/narrative_cards/acoes/lavar.webp',
    phrases: [
      'Vou _______ as mãos antes de comer.',
      'Preciso _______ o rosto.',
      'Vamos _______ a louça juntos.',
      'É importante _______ os dentes.',
      'Quero _______ meu carrinho.'
    ]
  },
  {
    id: 'ler',
    cardId: 'ler',
    category: 'acoes',
    displayLabel: 'Ler',
    image: '/narrative_cards/acoes/ler.webp',
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
    image: '/narrative_cards/acoes/ouvir.webp',
    phrases: [
      'Vamos _______ música.',
      'Quero _______ uma história.',
      'É importante _______ a professora.',
      'Gosto de _______ os passarinhos.',
      'Vou _______ com atenção.'
    ]
  },
  {
    id: 'pegar',
    cardId: 'pegar',
    category: 'acoes',
    displayLabel: 'Pegar',
    image: '/narrative_cards/acoes/pegar.webp',
    phrases: [
      'Vou _______ a bola.',
      'Posso _______ seu brinquedo?',
      'Vamos _______ as folhas do chão.',
      'Quero _______ a minha mochila.',
      'O cachorro vai _______ o osso.'
    ]
  },
  {
    id: 'pintar',
    cardId: 'pintar',
    category: 'acoes',
    displayLabel: 'Pintar',
    image: '/narrative_cards/acoes/pintar.webp',
    phrases: [
      'Vou _______ um desenho bonito.',
      'Quero _______ com tinta colorida.',
      'Vamos _______ o sol de amarelo.',
      'Gosto de _______ com lápis de cor.',
      'A artista vai _______ um quadro.'
    ]
  },
  {
    id: 'pular',
    cardId: 'pular',
    category: 'acoes',
    displayLabel: 'Pular',
    image: '/narrative_cards/acoes/pular.webp',
    phrases: [
      'Vou _______ bem alto!',
      'O coelho sabe _______ rápido.',
      'Vamos _______ corda.',
      'Quero _______ na cama elástica.',
      'É divertido _______ poças de água.'
    ]
  },

  // ========================================
  // CATEGORIA: LUGARES
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
    id: 'hospital',
    cardId: 'hospital',
    category: 'lugares',
    displayLabel: 'Hospital',
    image: '/narrative_cards/lugares/hospital.webp',
    phrases: [
      'O médico trabalha no _______.',
      'Vamos ao _______ fazer exames.',
      'O _______ cuida das pessoas doentes.',
      'No _______ tem muitos médicos.',
      'A ambulância leva para o _______.'
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
    image: '/narrative_cards/lugares/mercado.webp',
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
    image: '/narrative_cards/lugares/parque.webp',
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
    image: '/narrative_cards/lugares/quarto.webp',
    phrases: [
      'Durmo no meu _______ todas as noites.',
      'Meu _______ tem uma cama confortável.',
      'Guardo os brinquedos no _______.',
      'O _______ está arrumado.',
      'Gosto de ler no meu _______.'
    ]
  },
  {
    id: 'rua',
    cardId: 'rua',
    category: 'lugares',
    displayLabel: 'Rua',
    image: '/narrative_cards/lugares/rua.webp',
    phrases: [
      'Não pode correr na _______.',
      'A _______ está movimentada.',
      'Olhe dos dois lados antes de atravessar a _______.',
      'Moro em uma _______ tranquila.',
      'Os carros passam pela _______.'
    ]
  },
  {
    id: 'sala',
    cardId: 'sala',
    category: 'lugares',
    displayLabel: 'Sala',
    image: '/narrative_cards/lugares/sala.webp',
    phrases: [
      'A família se reúne na _______.',
      'Vamos assistir TV na _______.',
      'A _______ tem um sofá grande.',
      'Recebemos visitas na _______.',
      'Na _______ tem uma mesa de centro.'
    ]
  },

  // ========================================
  // CATEGORIA: OBJETOS
  // ========================================
  {
    id: 'bola',
    cardId: 'bola',
    category: 'objetos',
    displayLabel: 'Bola',
    image: '/narrative_cards/objetos/bola.webp',
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
    image: '/narrative_cards/objetos/boneca.webp',
    phrases: [
      'A _______ tem um vestido rosa.',
      'Vou pentear o cabelo da _______.',
      'Minha _______ dorme comigo.',
      'A _______ está na caixa de brinquedos.',
      'Ganhei uma _______ nova.'
    ]
  },
  {
    id: 'cadeira',
    cardId: 'cadeira',
    category: 'objetos',
    displayLabel: 'Cadeira',
    image: '/narrative_cards/objetos/cadeira.webp',
    phrases: [
      'Sento na _______ para estudar.',
      'A _______ é de madeira.',
      'Cada um tem sua _______ na mesa.',
      'A _______ da vovó balança.',
      'Coloque a _______ no lugar.'
    ]
  },
  {
    id: 'cama',
    cardId: 'cama',
    category: 'objetos',
    displayLabel: 'Cama',
    image: '/narrative_cards/objetos/cama.webp',
    phrases: [
      'Durmo na minha _______ quentinha.',
      'A _______ tem lençol azul.',
      'Vou arrumar a _______.',
      'O gato subiu na _______.',
      'A _______ é macia e confortável.'
    ]
  },
  {
    id: 'carrinho',
    cardId: 'carrinho',
    category: 'objetos',
    displayLabel: 'Carrinho',
    image: '/narrative_cards/objetos/carrinho.webp',
    phrases: [
      'Meu _______ é vermelho e rápido.',
      'O _______ tem quatro rodas.',
      'Vou brincar com o _______ na pista.',
      'O _______ de controle remoto é legal.',
      'Coleciono _______ de corrida.'
    ]
  },
  {
    id: 'computador',
    cardId: 'computador',
    category: 'objetos',
    displayLabel: 'Computador',
    image: '/narrative_cards/objetos/computador.webp',
    phrases: [
      'Uso o _______ para estudar.',
      'O _______ está na mesa.',
      'Vou ligar o _______.',
      'No _______ posso jogar.',
      'O _______ tem teclado e mouse.'
    ]
  },
  {
    id: 'livro',
    cardId: 'livro',
    category: 'objetos',
    displayLabel: 'Livro',
    image: '/narrative_cards/objetos/livro.webp',
    phrases: [
      'O _______ conta uma história linda.',
      'Vou ler este _______ novo.',
      'O _______ tem muitas páginas.',
      'Guardo o _______ na estante.',
      'O _______ tem figuras coloridas.'
    ]
  },
  {
    id: 'mesa',
    cardId: 'mesa',
    category: 'objetos',
    displayLabel: 'Mesa',
    image: '/narrative_cards/objetos/mesa.webp',
    phrases: [
      'Comemos na _______ juntos.',
      'A _______ está posta para o jantar.',
      'Faço a lição na _______.',
      'A _______ tem quatro cadeiras.',
      'Coloque o prato na _______.'
    ]
  },
  {
    id: 'telefone',
    cardId: 'telefone',
    category: 'objetos',
    displayLabel: 'Telefone',
    image: '/narrative_cards/objetos/telefone.webp',
    phrases: [
      'O _______ está tocando!',
      'Vou ligar no _______ para a vovó.',
      'O _______ está carregando.',
      'Atenda o _______, por favor.',
      'Meu _______ tem jogos.'
    ]
  },
  {
    id: 'televisao',
    cardId: 'televisao',
    category: 'objetos',
    displayLabel: 'Televisão',
    image: '/narrative_cards/objetos/televisao.webp',
    phrases: [
      'Vamos assistir desenho na _______.',
      'A _______ está ligada.',
      'A _______ mostra as notícias.',
      'Desligue a _______ para dormir.',
      'A _______ é grande e nova.'
    ]
  },

  // ========================================
  // CATEGORIA: TEMPO
  // ========================================
  {
    id: 'dia',
    cardId: 'dia',
    category: 'tempo',
    displayLabel: 'Dia',
    image: '/narrative_cards/tempo/dia.webp',
    phrases: [
      'Durante o _______ o sol brilha.',
      'O _______ está lindo e ensolarado.',
      'Brincamos o _______ todo.',
      'O _______ tem 24 horas.',
      'Hoje o _______ está nublado.'
    ]
  },
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
    id: 'cedo',
    cardId: 'cedo',
    category: 'tempo',
    displayLabel: 'Cedo',
    image: '/narrative_cards/tempo/cedo.webp',
    phrases: [
      'Acordo _______ para ir à escola.',
      'O galo canta bem _______.',
      'É bom chegar _______ na festa.',
      'Saímos _______ de casa.',
      'Os passarinhos cantam bem _______ .'
    ]
  },
  {
    id: 'tarde_tempo',
    cardId: 'tarde_tempo',
    category: 'tempo',
    displayLabel: 'Tarde (tempo)',
    image: '/narrative_cards/tempo/tarde_tempo.webp',
    phrases: [
      'Chegamos _______ na escola.',
      'Já é _______ , vamos dormir.',
      'Acordei _______ hoje.',
      'É _______ demais para brincar.',
      'Não fique acordado até _______.'
    ]
  },

  // ========================================
  // CATEGORIA: EMOÇÕES
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
    image: '/narrative_cards/emocoes/homem_assustado.webp',
    phrases: [
      'Fiquei _______ com o trovão.',
      'O gatinho está _______ com o barulho.',
      'Não precisa ficar _______.',
      'Ela ficou _______ no escuro.',
      'O passarinho está _______ na gaiola.'
    ]
  },
  {
    id: 'cansado',
    cardId: 'homem_cansado',
    category: 'emocoes',
    displayLabel: 'Cansado',
    image: '/narrative_cards/emocoes/homem_cansado.webp',
    phrases: [
      'Estou _______ depois de correr.',
      'O papai está _______ do trabalho.',
      'Fico _______ no final do dia.',
      'O cachorro está _______ de brincar.',
      'Quando estou _______, vou descansar.'
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
    id: 'orgulhoso',
    cardId: 'homem_orgulhoso',
    category: 'emocoes',
    displayLabel: 'Orgulhoso',
    image: '/narrative_cards/emocoes/homem_orgulhoso.webp',
    phrases: [
      'Estou _______ do meu desenho.',
      'A mamãe está _______ de mim.',
      'Fico _______ quando acerto tudo.',
      'O papai está _______ do filho.',
      'Sinto-me _______ quando ajudo alguém.'
    ]
  },
  {
    id: 'envergonhado',
    cardId: 'homem_envergonhado',
    category: 'emocoes',
    displayLabel: 'Envergonhado',
    image: '/narrative_cards/emocoes/homem_envergonhado.webp',
    phrases: [
      'Fiquei _______ quando errei.',
      'Ela está _______ de falar.',
      'Não precisa ficar _______.',
      'O menino ficou _______ na apresentação.',
      'Às vezes fico _______ de pedir ajuda.'
    ]
  }
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
    averagePhrasesPerCard: (totalPhrases / totalCards).toFixed(1)
  };
};

// Log das estatísticas para debug
console.log('📊 Estatísticas do Histórias Épicas:', getDataStats());
