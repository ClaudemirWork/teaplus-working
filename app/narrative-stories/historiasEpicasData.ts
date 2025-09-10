// Arquivo: app/narrative-stories/historiasEpicasData.ts
// ARQUIVO COMPLETO COM TODAS AS FRASES DO JOGO

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
  // PERSONAGENS (36 cards)
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
    id: 'cavalo',
    cardId: 'cavalo',
    category: 'personagens',
    displayLabel: 'Cavalo',
    image: '/narrative_cards/personagens/cavalo.webp',
    phrases: [
      'O _______ corre e galopa pelo campo verde.',
      'Quem adora comer cenouras e feno? É o _______.',
      'Na fazenda, podemos andar de _______.',
      'O _______ é grande, forte e vive no estábulo.',
      'O barulho que o _______ faz se chama relincho.'
    ]
  },
  {
    id: 'cozinheira',
    cardId: 'cozinheira',
    category: 'personagens',
    displayLabel: 'Cozinheira',
    image: '/narrative_cards/personagens/cozinheira.webp',
    phrases: [
      'A _______ faz uma comida deliciosa no restaurante.',
      'Quem usa um chapéu branco e alto na cozinha? É a _______.',
      'A _______ vai fazer um bolo de chocolate para a festa.',
      'Com sua colher e panela, a _______ prepara o almoço.',
      'A _______ experimenta a sopa para ver se está boa.'
    ]
  },
  {
    id: 'cozinheiro',
    cardId: 'cozinheiro',
    category: 'personagens',
    displayLabel: 'Cozinheiro',
    image: '/narrative_cards/personagens/cozinheiro.webp',
    phrases: [
      'O _______ prepara um jantar especial para todos.',
      'Com seu avental, o _______ corta os legumes.',
      'O _______ trabalha na cozinha do hospital.',
      'Quem faz a pizza mais gostosa da cidade? É o _______.',
      'O _______ usa temperos para a comida ficar saborosa.'
    ]
  },
  {
    id: 'eu_homem',
    cardId: 'eu_homem',
    category: 'personagens',
    displayLabel: 'Eu',
    image: '/narrative_cards/personagens/eu_homem.webp',
    phrases: [
      'Quando me olho no espelho, eu vejo _______.',
      'Quem está com sono e quer dormir? Sou _______.',
      'Este é o meu brinquedo, quem está brincando sou _______.',
      'A professora perguntou meu nome, e eu respondi: "sou _______".',
      '_______ gosto de sorvete de morango.'
    ]
  },
  {
    id: 'eu_mulher',
    cardId: 'eu_mulher',
    category: 'personagens',
    displayLabel: 'Eu',
    image: '/narrative_cards/personagens/eu_mulher.webp',
    phrases: [
      'Quem está com um vestido novo hoje? Sou _______.',
      '_______ estou com fome e quero almoçar.',
      'A mamãe me chamou e eu disse: "sou _______!".',
      'Esta é a minha boneca, quem cuida dela sou _______.',
      'Quando me vejo na foto, aponto e digo: "essa sou _______".'
    ]
  },
  {
    id: 'filha',
    cardId: 'filha',
    category: 'personagens',
    displayLabel: 'Filha',
    image: '/narrative_cards/personagens/filha.webp',
    phrases: [
      'A _______ é a menina amada pelo papai e pela mamãe.',
      'A _______ deu um grande abraço em sua mãe.',
      'A mamãe penteia o cabelo da sua _______.',
      'A _______ está brincando de casinha no quarto.',
      '"Te amo", disse a _______ para seu pai.'
    ]
  },
  {
    id: 'filho',
    cardId: 'filho',
    category: 'personagens',
    displayLabel: 'Filho',
    image: '/narrative_cards/personagens/filho.webp',
    phrases: [
      'O papai joga bola com seu _______ no quintal.',
      'O _______ ganhou um carrinho novo de aniversário.',
      'O _______ é o menino querido da família.',
      '"Papai, me ajuda?", pediu o _______.',
      'O _______ está desenhando um super-herói.'
    ]
  },
  {
    id: 'gatinho',
    cardId: 'gatinho',
    category: 'personagens',
    displayLabel: 'Gatinho',
    image: '/narrative_cards/personagens/gatinho.webp',
    phrases: [
      'Miau! O _______ está bebendo leite no pires.',
      'O _______ adora dormir enroladinho no sofá.',
      'Quem gosta de brincar com novelo de lã? É o _______.',
      'O _______ se lambe para ficar bem limpinho.',
      'O _______ ronrona quando recebe carinho.'
    ]
  },
  {
    id: 'grupo_pessoas',
    cardId: 'grupo_pessoas',
    category: 'personagens',
    displayLabel: 'Grupo de Pessoas',
    image: '/narrative_cards/personagens/grupo_pessoas.webp',
    phrases: [
      'O _______ está assistindo a um show no parque.',
      'Um _______ estava esperando na fila do cinema.',
      'Muitas vozes conversando formam um _______.',
      'O _______ cantou "parabéns" na festa de aniversário.',
      'Para jogar futebol, precisamos de um _______.'
    ]
  },
  {
    id: 'irma',
    cardId: 'irma',
    category: 'personagens',
    displayLabel: 'Irmã',
    image: '/narrative_cards/personagens/irma.webp',
    phrases: [
      'A minha _______ brinca de boneca comigo.',
      'Eu divido o meu quarto com a minha _______ mais velha.',
      'A _______ me ajudou a fazer o dever de casa.',
      'A _______ e eu gostamos de assistir desenhos juntos.',
      'Vou dar um presente de aniversário para minha _______.'
    ]
  },
  {
    id: 'irmao',
    cardId: 'irmao',
    category: 'personagens',
    displayLabel: 'Irmão',
    image: '/narrative_cards/personagens/irmao.webp',
    phrases: [
      'O meu _______ mais velho me ensinou a andar de bicicleta.',
      'Eu e meu _______ jogamos videogame juntos.',
      'O _______ me defende quando alguém briga comigo.',
      'O _______ e eu somos filhos do mesmo papai e mamãe.',
      'Peguei o carrinho do meu _______ emprestado para brincar.'
    ]
  },
  {
    id: 'jardineiro',
    cardId: 'jardineiro',
    category: 'personagens',
    displayLabel: 'Jardineiro',
    image: '/narrative_cards/personagens/jardineiro.webp',
    phrases: [
      'O _______ cuida das flores e das plantas do jardim.',
      'Quem usa um regador para molhar a grama? É o _______.',
      'O _______ corta a grama para ela ficar bonita.',
      'Para deixar o jardim florido, chamamos o _______.',
      'O _______ planta novas sementes na terra.'
    ]
  },
  {
    id: 'lixeiro',
    cardId: 'lixeiro',
    category: 'personagens',
    displayLabel: 'Lixeiro',
    image: '/narrative_cards/personagens/lixeiro.webp',
    phrases: [
      'O _______ passa na nossa rua para recolher o lixo.',
      'Quem dirige o grande caminhão de lixo? É o _______.',
      'O _______ ajuda a manter a nossa cidade limpa.',
      'Colocamos o saco de lixo na rua para o _______ pegar.',
      'O _______ usa luvas para se proteger enquanto trabalha.'
    ]
  },
  {
    id: 'mecanico',
    cardId: 'mecanico',
    category: 'personagens',
    displayLabel: 'Mecânico',
    image: '/narrative_cards/personagens/mecanico.webp',
    phrases: [
      'O carro quebrou, precisamos chamar o _______.',
      'Quem usa ferramentas para consertar motores? É o _______.',
      'O _______ trabalha na oficina de carros.',
      'Para trocar o pneu do carro, o _______ usa uma chave de roda.',
      'O _______ entende tudo sobre carros, motos e caminhões.'
    ]
  },
  {
    id: 'medico',
    cardId: 'medico',
    category: 'personagens',
    displayLabel: 'Médico',
    image: '/narrative_cards/personagens/medico.webp',
    phrases: [
      'Quando estamos doentes, vamos ao _______.',
      'O _______ usa um estetoscópio para ouvir nosso coração.',
      'Quem trabalha no hospital e cuida dos pacientes? É o _______.',
      'O _______ nos dá remédio para ficarmos bons logo.',
      'Para ver se temos febre, o _______ usa um termômetro.'
    ]
  },
  {
    id: 'meu_avo',
    cardId: 'meu_avo',
    category: 'personagens',
    displayLabel: 'Meu Avô',
    image: '/narrative_cards/personagens/meu_avo.webp',
    phrases: [
      'O _______ gosta de contar histórias de quando ele era jovem.',
      'O pai do meu papai é o _______.',
      'O _______ usa óculos para ler o jornal.',
      'Eu gosto de passear na praça com o _______.',
      'O _______ tem cabelos brancos e um grande coração.'
    ]
  },
  {
    id: 'minha_avo',
    cardId: 'minha_avo',
    category: 'personagens',
    displayLabel: 'Minha Avó',
    image: '/narrative_cards/personagens/minha_avo.webp',
    phrases: [
      'A _______ faz o melhor bolo de chocolate do mundo.',
      'A mãe da minha mamãe é a _______.',
      'A _______ me dá um abraço quentinho e gostoso.',
      'Eu adoro dormir na casa da _______.',
      'A _______ me ensinou a fazer biscoitos.'
    ]
  },
  {
    id: 'pai_mae',
    cardId: 'pai_mae',
    category: 'personagens',
    displayLabel: 'Pai e Mãe',
    image: '/narrative_cards/personagens/pai_mae.webp',
    phrases: [
      'O _______ cuidam de mim com muito amor e carinho.',
      'Quem me leva para a escola todos os dias? É o _______.',
      'Na hora de dormir, o _______ me contam uma história.',
      'O _______ trabalham para cuidar da nossa família.',
      'Eu amo muito o meu _______.'
    ]
  },
  {
    id: 'papai_noel',
    cardId: 'papai_noel',
    category: 'personagens',
    displayLabel: 'Papai Noel',
    image: '/narrative_cards/personagens/papai_noel.webp',
    phrases: [
      'O _______ entrega presentes para as crianças no Natal.',
      'Quem tem uma barba branca e comprida e usa roupa vermelha? É o _______.',
      'O _______ viaja em um trenó puxado por renas.',
      'Ho ho ho! É a risada do _______.',
      'O _______ mora lá no Polo Norte.'
    ]
  },
  {
    id: 'pessoa',
    cardId: 'pessoa',
    category: 'personagens',
    displayLabel: 'Pessoa',
    image: '/narrative_cards/personagens/pessoa.webp',
    phrases: [
      'Uma _______ está andando na calçada.',
      'Toda _______ tem um nome e uma história.',
      'Aquela _______ está esperando o ônibus.',
      'Uma _______ educada diz "por favor" e "obrigado".',
      'Você é uma _______ muito especial.'
    ]
  },
  {
    id: 'pessoa_alta',
    cardId: 'pessoa_alta',
    category: 'personagens',
    displayLabel: 'Pessoa Alta',
    image: '/narrative_cards/personagens/pessoa_alta.webp',
    phrases: [
      'A _______ consegue pegar o biscoito na prateleira de cima.',
      'O jogador de basquete geralmente é uma _______.',
      'Para trocar a lâmpada, o papai chamou uma _______.',
      'A _______ consegue ver por cima do muro.',
      'A girafa é um animal com pescoço comprido, como uma _______.'
    ]
  },
  {
    id: 'pessoa_baixa',
    cardId: 'pessoa_baixa',
    category: 'personagens',
    displayLabel: 'Pessoa Baixa',
    image: '/narrative_cards/personagens/pessoa_baixa.webp',
    phrases: [
      'A _______ não alcança o botão do elevador.',
      'Para pegar o livro, a _______ precisou de uma escadinha.',
      'A _______ consegue se esconder em lugares pequenos.',
      'O anão da história era uma _______.',
      'A _______ pediu ajuda para amarrar o sapato.'
    ]
  },
  {
    id: 'pessoa_cega',
    cardId: 'pessoa_cega',
    category: 'personagens',
    displayLabel: 'Pessoa Cega',
    image: '/narrative_cards/personagens/pessoa_cega.webp',
    phrases: [
      'A _______ usa um cão-guia para ajudar a andar na rua.',
      'Quem usa uma bengala branca para se localizar? É a _______.',
      'A _______ lê livros especiais usando os dedos.',
      'A _______ não consegue ver as cores, mas ouve muito bem.',
      'Para atravessar a rua, ajudamos a _______.'
    ]
  },
  {
    id: 'pessoa_gorda',
    cardId: 'pessoa_gorda',
    category: 'personagens',
    displayLabel: 'Pessoa Gorda',
    image: '/narrative_cards/personagens/pessoa_gorda.webp',
    phrases: [
      'A _______ precisa de um cinto maior para sua calça.',
      'O Papai Noel é uma _______, com uma grande barriga.',
      'A _______ deu um abraço bem fofinho e grande.',
      'Para se pesar, a _______ subiu na balança.',
      'Aquela _______ está usando uma roupa bem larga.'
    ]
  },
  {
    id: 'pessoa_legal',
    cardId: 'pessoa_legal',
    category: 'personagens',
    displayLabel: 'Pessoa Legal',
    image: '/narrative_cards/personagens/pessoa_legal.webp',
    phrases: [
      'A _______ sempre divide o lanche com os amigos.',
      'Todo mundo gosta de brincar com a _______.',
      'A _______ é simpática e sorri para todos.',
      'A _______ ajuda os outros quando eles precisam.',
      'É muito bom conversar com uma _______.'
    ]
  },
  {
    id: 'pessoa_magra',
    cardId: 'pessoa_magra',
    category: 'personagens',
    displayLabel: 'Pessoa Magra',
    image: '/narrative_cards/personagens/pessoa_magra.webp',
    phrases: [
      'A _______ consegue passar pela porta bem estreita.',
      'O atleta de corrida geralmente é uma _______.',
      'A _______ usa roupas de tamanho pequeno.',
      'O palito de fósforo é fino como uma _______.',
      'A _______ come bastante, mas não engorda.'
    ]
  },
  {
    id: 'policial',
    cardId: 'policial',
    category: 'personagens',
    displayLabel: 'Policial',
    image: '/narrative_cards/personagens/policial.webp',
    phrases: [
      'O _______ ajuda a manter a cidade segura.',
      'Quem dirige o carro de polícia com a sirene ligada? É o _______.',
      'O _______ prende os bandidos e ladrões.',
      'Se estamos perdidos, podemos pedir ajuda para o _______.',
      'O _______ usa um uniforme azul e um apito.'
    ]
  },
  {
    id: 'professor',
    cardId: 'professor',
    category: 'personagens',
    displayLabel: 'Professor',
    image: '/narrative_cards/personagens/professor.webp',
    phrases: [
      'O _______ ensina os alunos a ler e a escrever.',
      'Quem escreve na lousa da sala de aula? É o _______.',
      'O _______ ajuda as crianças com o dever de casa.',
      'Na escola, o _______ ensina matemática e ciências.',
      'O _______ é o mestre da turma.'
    ]
  },
  {
    id: 'professora',
    cardId: 'professora',
    category: 'personagens',
    displayLabel: 'Professora',
    image: '/narrative_cards/personagens/professora.webp',
    phrases: [
      'A _______ lê histórias para as crianças na escola.',
      'A _______ ensina as vogais: a, e, i, o, u.',
      '"Parabéns, nota 10!", disse a _______ para o aluno.',
      'A _______ cuida dos seus alunos com carinho.',
      'Na hora do recreio, a _______ observa as crianças brincando.'
    ]
  },
  {
    id: 'soldado',
    cardId: 'soldado',
    category: 'personagens',
    displayLabel: 'Soldado',
    image: '/narrative_cards/personagens/soldado.webp',
    phrases: [
      'O _______ marcha no desfile de 7 de setembro.',
      'Quem protege o nosso país? É o _______.',
      'O _______ usa um uniforme verde e um capacete.',
      'O _______ obedece às ordens do seu comandante.',
      'O _______ faz treinamento para ser forte e corajoso.'
    ]
  },
  {
    id: 'tartaruga',
    cardId: 'tartaruga',
    category: 'personagens',
    displayLabel: 'Tartaruga',
    image: '/narrative_cards/personagens/tartaruga.webp',
    phrases: [
      'A _______ anda bem devagar e com calma.',
      'Quem carrega a própria casa nas costas? É a _______.',
      'A _______ pode viver por muitos e muitos anos.',
      'A _______ vive na água e também na terra.',
      'A _______ esconde a cabeça dentro do casco quando está com medo.'
    ]
  },
  {
    id: 'taxista',
    cardId: 'taxista',
    category: 'personagens',
    displayLabel: 'Taxista',
    image: '/narrative_cards/personagens/taxista.webp',
    phrases: [
      'O _______ dirige um carro amarelo para levar as pessoas.',
      'Para ir ao aeroporto, chamamos um _______.',
      'O _______ conhece todos os caminhos da cidade.',
      '"Para onde vamos?", perguntou o _______.',
      'O _______ trabalha dirigindo o dia todo.'
    ]
  },
  {
    id: 'voce',
    cardId: 'voce',
    category: 'personagens',
    displayLabel: 'Você',
    image: '/narrative_cards/personagens/voce.webp',
    phrases: [
      'Quem está jogando este jogo agora? É _______.',
      'O Leo está falando com _______!',
      '_______ é uma criança muito inteligente.',
      'Eu estou aqui, e aí está _______.',
      'Aperte o botão se _______ estiver pronto para começar.'
    ]
  },

  // ========================================
  // AÇÕES (100 cards)
  // ========================================
  {
    id: 'abotoar_casaco',
    cardId: 'abotoar_casaco',
    category: 'acoes',
    displayLabel: 'Abotoar o casaco',
    image: '/narrative_cards/acoes/abotoar_casaco.webp',
    phrases: [
      'Antes de sair no frio, eu preciso _______.',
      'A mamãe me ajuda a _______ para eu não sentir frio.',
      'Eu já sou grande e consigo _______ sozinho.',
      'Para a roupa ficar bem fechadinha, você tem que _______.',
      'O zíper estragou, então vou _______.'
    ]
  },
  {
    id: 'abracar',
    cardId: 'abracar',
    category: 'acoes',
    displayLabel: 'Abraçar',
    image: '/narrative_cards/acoes/abracar.webp',
    phrases: [
      'Quando a vovó chega, eu corro para _______.',
      'Se um amigo está triste, você pode _______ para confortá-lo.',
      'O ursinho de pelúcia é muito fofinho de _______.',
      'Na despedida, eu vou _______ bem forte a mamãe.',
      'Eu gosto de _______ as pessoas que eu amo muito.'
    ]
  },
  {
    id: 'abrir_porta',
    cardId: 'abrir_porta',
    category: 'acoes',
    displayLabel: 'Abrir a porta',
    image: '/narrative_cards/acoes/abrir_porta.webp',
    phrases: [
      'Quando a campainha toca, nós vamos _______.',
      'Para o cachorrinho entrar, eu preciso _______.',
      'Use a chave para _______ e entrar em casa.',
      'Por favor, você pode _______ para mim?',
      'Toc toc! Alguém pode _______?'
    ]
  },
  {
    id: 'acender_luz',
    cardId: 'acender_luz',
    category: 'acoes',
    displayLabel: 'Acender a luz',
    image: '/narrative_cards/acoes/acender_luz.webp',
    phrases: [
      'O quarto está escuro, eu preciso _______.',
      'Para conseguir ler o livro à noite, eu vou _______.',
      'Quando o sol vai embora, é hora de _______ de casa.',
      'Não estou enxergando nada, alguém pode _______?',
      'O papai usa o interruptor para _______.'
    ]
  },
  {
    id: 'acordar',
    cardId: 'acordar',
    category: 'acoes',
    displayLabel: 'Acordar',
    image: '/narrative_cards/acoes/acordar.webp',
    phrases: [
      'O galo canta quando é hora de _______.',
      'O despertador toca para a gente _______ de manhã.',
      'Depois de uma boa noite de sono, eu vou _______.',
      '"Bom dia!", disse a mamãe na hora de me _______.',
      'Eu gosto de _______ e espreguiçar na cama.'
    ]
  },
  {
    id: 'aguardar',
    cardId: 'aguardar',
    category: 'acoes',
    displayLabel: 'Aguardar',
    image: '/narrative_cards/acoes/aguardar.webp',
    phrases: [
      'Na fila do mercado, temos que _______ nossa vez.',
      'O sinal está vermelho, os carros precisam _______.',
      'Sente no sofá e vamos _______ o papai chegar.',
      'O bolo está no forno, agora é só _______.',
      '"Por favor, espere um momento", a moça pediu para _______.'
    ]
  },
  {
    id: 'apagar_luz',
    cardId: 'apagar_luz',
    category: 'acoes',
    displayLabel: 'Apagar a luz',
    image: '/narrative_cards/acoes/apagar_luz.webp',
    phrases: [
      'Na hora de dormir, nós vamos _______ do quarto.',
      'Para economizar energia, temos que _______ ao sair.',
      'O filme vai começar no cinema, eles vão _______.',
      'O quarto está muito claro, por favor, vamos _______.',
      'Já está de dia, não precisamos da lâmpada, pode _______.'
    ]
  },
  {
    id: 'arrumar_armario',
    cardId: 'arrumar_armario',
    category: 'acoes',
    displayLabel: 'Arrumar o armário',
    image: '/narrative_cards/acoes/arrumar_armario.webp',
    phrases: [
      'Minhas roupas estão bagunçadas, preciso _______.',
      'A mamãe pediu para eu _______ e guardar as camisetas.',
      'Vamos dobrar as meias e _______.',
      'Para encontrar minhas roupas, eu tenho que _______.',
      'No fim de semana, vou tirar um tempo para _______.'
    ]
  },
  {
    id: 'arrumar_cama',
    cardId: 'arrumar_cama',
    category: 'acoes',
    displayLabel: 'Arrumar a cama',
    image: '/narrative_cards/acoes/arrumar_cama.webp',
    phrases: [
      'Depois de acordar, a primeira tarefa é _______.',
      'Vamos esticar o lençol e _______ para o quarto ficar bonito.',
      'Eu ajudo a mamãe a _______ todos os dias.',
      'Para deixar o quarto organizado, eu vou _______.',
      'Coloque o travesseiro no lugar para _______.'
    ]
  },
  {
    id: 'bater_na_porta',
    cardId: 'bater_na_porta',
    category: 'acoes',
    displayLabel: 'Bater na porta',
    image: '/narrative_cards/acoes/bater_na_porta.webp',
    phrases: [
      'Antes de entrar no quarto do irmão, é educado _______.',
      'Toc, toc, toc! Eu vou _______ para ver se tem alguém.',
      'Para visitar a vovó, primeiro temos que _______.',
      'O carteiro vai _______ para entregar a encomenda.',
      'Se a porta está fechada, você deve _______.'
    ]
  },
  {
    id: 'bocejar',
    cardId: 'bocejar',
    category: 'acoes',
    displayLabel: 'Bocejar',
    image: '/narrative_cards/acoes/bocejar.webp',
    phrases: [
      'Quando estou com muito sono, começo a _______.',
      'A aula está demorando, o menino começou a _______.',
      'Um _______ bem grande mostra que é hora de ir para a cama.',
      'Tampe a boca quando for _______.',
      'Ver outra pessoa _______ me dá vontade de fazer igual.'
    ]
  },
  {
    id: 'brigar',
    cardId: 'brigar',
    category: 'acoes',
    displayLabel: 'Brigar',
    image: '/narrative_cards/acoes/brigar.webp',
    phrases: [
      'Os irmãos não devem _______ por causa de um brinquedo.',
      '_______ com os amigos é muito chato.',
      'Em vez de _______, é melhor conversar e fazer as pazes.',
      'Os cachorrinhos começaram a _______ por causa do osso.',
      'A professora ensinou que _______ não resolve nada.'
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
  {
    id: 'brincar_balanco',
    cardId: 'brincar_balanco',
    category: 'acoes',
    displayLabel: 'Brincar no balanço',
    image: '/narrative_cards/acoes/brincar_balanco.webp',
    phrases: [
      'No parquinho, a primeira coisa que eu faço é _______.',
      '"Me empurra mais alto!", eu grito ao _______.',
      'Sentir o vento no rosto é a melhor parte de _______.',
      'É divertido _______ e tentar alcançar o céu.',
      'Vamos revezar, agora é a minha vez de _______.'
    ]
  },
  {
    id: 'brincar_carrinho',
    cardId: 'brincar_carrinho',
    category: 'acoes',
    displayLabel: 'Brincar de carrinho',
    image: '/narrative_cards/acoes/brincar_carrinho.webp',
    phrases: [
      'O menino pegou suas miniaturas para _______.',
      '"Vrummm, vrummm!", ele faz barulho ao _______.',
      'Ele fez uma pista no chão para _______ o dia todo.',
      'Ele guarda sua coleção na caixa depois de _______.',
      'No seu quarto, ele tem uma garagem para _______.'
    ]
  },
  {
    id: 'caminhar',
    cardId: 'caminhar',
    category: 'acoes',
    displayLabel: 'Caminhar',
    image: '/narrative_cards/acoes/caminhar.webp',
    phrases: [
      'Para manter a saúde, é bom _______ todos os dias.',
      'Vovô e vovó gostam de _______ na praça de manhã.',
      'O cachorro fica feliz quando vamos _______ com ele.',
      'Vamos _______ até a padaria para comprar pão.',
      'Em vez de correr, vamos _______ com calma pela praia.'
    ]
  },
  {
    id: 'cantar',
    cardId: 'cantar',
    category: 'acoes',
    displayLabel: 'Cantar',
    image: '/narrative_cards/acoes/cantar.webp',
    phrases: [
      'No chuveiro, eu adoro _______ minhas músicas favoritas.',
      'A professora ensina a turma a _______ a música do alfabeto.',
      '"Parabéns pra você...", vamos _______ na festa.',
      'O passarinho na janela começou a _______.',
      'A cantora usa o microfone para _______ no palco.'
    ]
  },
  {
    id: 'colocar_bone',
    cardId: 'colocar_bone',
    category: 'acoes',
    displayLabel: 'Colocar o boné',
    image: '/narrative_cards/acoes/colocar_bone.webp',
    phrases: [
      'O sol está muito forte, é melhor _______.',
      'Para se proteger do sol na praia, vou _______.',
      'Antes de ir jogar bola, o menino vai _______.',
      'Para completar o visual, ele decidiu _______.',
      '"Não esqueça de _______!", disse a mamãe.'
    ]
  },
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
    id: 'conversar',
    cardId: 'conversar',
    category: 'acoes',
    displayLabel: 'Conversar',
    image: '/narrative_cards/acoes/conversar.webp',
    phrases: [
      'É bom _______ com os amigos sobre o nosso dia.',
      'Papai e mamãe sentaram no sofá para _______.',
      'Em vez de brigar, o melhor é _______ e resolver.',
      'Eu gosto de _______ com a vovó pelo telefone.',
      'A professora vai _______ com a turma sobre o passeio.'
    ]
  },
  {
    id: 'correr',
    cardId: 'correr',
    category: 'acoes',
    displayLabel: 'Correr',
    image: '/narrative_cards/acoes/correr.webp',
    phrases: [
      'O cachorro adora _______ atrás da bolinha.',
      'Na aula de educação física, as crianças vão _______.',
      'Para não perder o ônibus, tivemos que _______.',
      'O guepardo é o animal que consegue _______ mais rápido.',
      '"Vamos _______ até aquela árvore!", disse o menino.'
    ]
  },
  {
    id: 'cozinhar',
    cardId: 'cozinhar',
    category: 'acoes',
    displayLabel: 'Cozinhar',
    image: '/narrative_cards/acoes/cozinhar.webp',
    phrases: [
      'O chefe de cozinha vai _______ um prato especial.',
      'A mamãe adora _______ no fim de semana.',
      'Para _______, precisamos de ingredientes e uma panela.',
      'Ele vai _______ um bolo de chocolate delicioso.',
      'Meu pai vai me ensinar a _______ um omelete.'
    ]
  },
  {
    id: 'cuidar',
    cardId: 'cuidar',
    category: 'acoes',
    displayLabel: 'Cuidar',
    image: '/narrative_cards/acoes/cuidar.webp',
    phrases: [
      'A mamãe vai _______ do bebê com muito carinho.',
      'A médica sabe _______ das pessoas doentes.',
      'É importante _______ bem dos nossos brinquedos.',
      'Eu ajudo a _______ do meu cachorrinho todos os dias.',
      'Nós devemos _______ da natureza e das plantas.'
    ]
  },
  {
    id: 'desabotoar_camisa',
    cardId: 'desabotoar_camisa',
    category: 'acoes',
    displayLabel: 'Desabotoar a camisa',
    image: '/narrative_cards/acoes/desabotoar_camisa.webp',
    phrases: [
      'Para tirar a roupa, primeiro preciso _______.',
      'Está muito calor, vou _______ para refrescar.',
      'Chegando em casa, a primeira coisa que faço é _______.',
      'O papai vai _______ antes de tomar banho.',
      'Ajude o vovô a _______, por favor.'
    ]
  },
  {
    id: 'descascar_laranja',
    cardId: 'descascar_laranja',
    category: 'acoes',
    displayLabel: 'Descascar a laranja',
    image: '/narrative_cards/acoes/descascar_laranja.webp',
    phrases: [
      'Para comer a fruta, primeiro temos que _______.',
      'A mamãe vai _______ para fazer um suco.',
      'Com cuidado para não cortar o dedo, eu vou _______.',
      'O cheirinho bom aparece quando vamos _______.',
      'Depois de _______, eu separo os gominhos.'
    ]
  },
  {
    id: 'descer_escorregador',
    cardId: 'descer_resultado',
    category: 'acoes',
    displayLabel: 'Descer no escorregador',
    image: '/narrative_cards/acoes/descer_resultado.webp',
    phrases: [
      'No parquinho, as crianças fazem fila para _______.',
      '"Lá vou eu!", o menino gritou antes de _______.',
      'É muito divertido subir a escada e depois _______.',
      'Ele sentou no topo, pronto para _______.',
      'A melhor parte do parquinho é _______.'
    ]
  },
  {
    id: 'desligar',
    cardId: 'desligar',
    category: 'acoes',
    displayLabel: 'Desligar',
    image: '/narrative_cards/acoes/desligar.webp',
    phrases: [
      'Antes de dormir, eu vou _______ a televisão.',
      'Quando a brincadeira acabar, temos que _______ o videogame.',
      'Para economizar bateria, é bom _______ o celular.',
      'A mamãe pediu para eu _______ o rádio.',
      'A aula acabou, a professora vai _______ o computador.'
    ]
  },
  {
    id: 'dirigir',
    cardId: 'dirigir',
    category: 'acoes',
    displayLabel: 'Dirigir',
    image: '/narrative_cards/acoes/dirigir.webp',
    phrases: [
      'O papai vai _______ o carro para nos levar à praia.',
      'Para _______, é preciso ter carteira de motorista.',
      'O motorista de ônibus aprende a _______ com cuidado.',
      '"Segure firme!", disse o piloto antes de _______ o carro de corrida.',
      'O taxista precisa _______ o dia todo pela cidade.'
    ]
  },
  {
    id: 'dormir',
    cardId: 'dormir_lado',
    category: 'acoes',
    displayLabel: 'Dormir',
    image: '/narrative_cards/acoes/dormir_lado.webp',
    phrases: [
      'Depois de um dia de brincadeiras, é hora de _______.',
      'O bebê está com sono e vai _______ no berço.',
      'O urso hiberna, o que significa _______ durante todo o inverno.',
      'Para crescer forte, as crianças precisam _______ bem.',
      '"Boa noite!", é o que dizemos antes de _______.'
    ]
  },
  {
    id: 'duvida',
    cardId: 'duvida',
    category: 'acoes',
    displayLabel: 'Ter uma dúvida',
    image: '/narrative_cards/acoes/duvida.webp',
    phrases: [
      'Se você não entendeu, levante a mão para _______.',
      'O menino coçou a cabeça, pois estava com _______.',
      '"Professor, posso _______?", perguntou o aluno.',
      'É normal _______ quando aprendemos algo novo.',
      'Antes de escolher, ele parou por _______.'
    ]
  },
  {
    id: 'empurrar',
    cardId: 'empurrar',
    category: 'acoes',
    displayLabel: 'Empurrar',
    image: '/narrative_cards/acoes/empurrar.webp',
    phrases: [
      'Para o balanço ir mais alto, o papai vai _______.',
      'O carro de brinquedo não anda, eu preciso _______.',
      'Ajude-me a _______ a mesa para o canto da sala.',
      'No mercado, a mamãe vai _______ o carrinho de compras.',
      'Não pode _______ os amigos na fila.'
    ]
  },
  {
    id: 'encontrar',
    cardId: 'encontrar',
    category: 'acoes',
    displayLabel: 'Encontrar',
    image: '/narrative_cards/acoes/encontrar.webp',
    phrases: [
      'No jogo de esconde-esconde, eu preciso _______ meus amigos.',
      '"Achei!", eu grito ao _______ a peça que faltava.',
      'A mamãe não consegue _______ a chave do carro.',
      'O pirata usou o mapa para _______ o tesouro.',
      'Eu espero _______ meus primos na festa de aniversário.'
    ]
  },
  {
    id: 'ensaboar',
    cardId: 'ensaboar',
    category: 'acoes',
    displayLabel: 'Ensaboar',
    image: '/narrative_cards/acoes/ensaboar.webp',
    phrases: [
      'No banho, primeiro temos que _______ o corpo todo.',
      'Para as mãos ficarem limpas, é preciso _______ bem.',
      'O cachorrinho vai ficar cheio de espuma quando a gente _______.',
      'Use o sabonete para _______ e tirar a sujeira.',
      'Fazer bolhas de sabão é a parte divertida de _______.'
    ]
  },
  {
    id: 'entrar_casa',
    cardId: 'entrar_casa',
    category: 'acoes',
    displayLabel: 'Entrar em casa',
    image: '/narrative_cards/acoes/entrar_casa.webp',
    phrases: [
      'Depois de brincar na rua, é hora de _______.',
      'Está começando a chover, vamos _______ rápido!',
      'O papai chegou do trabalho e vai _______.',
      'Limpe os pés no tapete antes de _______.',
      'Abra a porta para _______.'
    ]
  },
  {
    id: 'escorregar',
    cardId: 'escorregar',
    category: 'acoes',
    displayLabel: 'Escorregar',
    image: '/narrative_cards/acoes/escorregar.webp',
    phrases: [
      'Cuidado com o chão molhado, você pode _______.',
      'O pinguim adora _______ de barriga no gelo.',
      'O sabonete caiu da minha mão e começou a _______.',
      'No parque aquático, o mais legal é _______ nos toboáguas.',
      'Ele pisou na casca de banana e começou a _______.'
    ]
  },
  {
    id: 'escovar_dentes',
    cardId: 'escovar_dentes',
    category: 'acoes',
    displayLabel: 'Escovar os dentes',
    image: '/narrative_cards/acoes/escovar_dentes.webp',
    phrases: [
      'Depois de comer doces, é importante _______.',
      'Para ter um sorriso bonito, temos que _______ todos os dias.',
      'Use a pasta e a escova para _______.',
      'Antes de dormir, a última coisa a fazer é _______.',
      'O dentista ensinou a _______ em círculos.'
    ]
  },
  {
    id: 'escrever',
    cardId: 'escrever',
    category: 'acoes',
    displayLabel: 'Escrever',
    image: '/narrative_cards/acoes/escrever.webp',
    phrases: [
      'A professora vai _______ na lousa.',
      'Eu uso o lápis para _______ meu nome no caderno.',
      'Para mandar uma carta para a vovó, eu preciso _______.',
      'A mamãe vai _______ a lista de compras do mercado.',
      'O autor do livro precisa _______ a história.'
    ]
  },
  {
    id: 'escutar',
    cardId: 'escutar',
    category: 'acoes',
    displayLabel: 'Escutar',
    image: '/narrative_cards/acoes/escutar.webp',
    phrases: [
      'O cachorrinho levantou as orelhas para _______ o barulho.',
      'Na sala de aula, é preciso _______ a professora com atenção.',
      'Coloque os fones de ouvido para _______ sua música favorita.',
      'O médico usa o estetoscópio para _______ o coração.',
      '"Silêncio, vamos _______ o que ele tem a dizer".'
    ]
  },
  {
    id: 'esticar',
    cardId: 'esticar',
    category: 'acoes',
    displayLabel: 'Esticar',
    image: '/narrative_cards/acoes/esticar.webp',
    phrases: [
      'Ao acordar, o gato gosta de se _______ bem comprido.',
      'Antes do exercício, vamos _______ os braços e as pernas.',
      'Para pegar o brinquedo no alto, eu precisei me _______.',
      'A girafa precisa _______ o pescoço para comer as folhas.',
      'O elástico é um brinquedo que podemos _______.'
    ]
  },
  {
    id: 'estudar',
    cardId: 'estudar',
    category: 'acoes',
    displayLabel: 'Estudar',
    image: '/narrative_cards/acoes/estudar.webp',
    phrases: [
      'Para a prova de amanhã, eu preciso _______.',
      'A menina sentou na mesa para _______ a lição de casa.',
      'Na biblioteca, as pessoas fazem silêncio para _______.',
      'É importante _______ para aprender coisas novas.',
      'O médico precisa _______ muito para cuidar das pessoas.'
    ]
  },
  {
    id: 'fazer_exercicio',
    cardId: 'fazer_exercicio',
    category: 'acoes',
    displayLabel: 'Fazer exercício',
    image: '/narrative_cards/acoes/fazer_exercicio.webp',
    phrases: [
      'Para ficar forte e saudável, é bom _______.',
      'Na academia, as pessoas vão para _______.',
      'Correr, pular e dançar são formas de _______.',
      'O professor de educação física vai nos ensinar a _______.',
      'De manhã, eu gosto de _______ ao ar livre.'
    ]
  },
  {
    id: 'girar_chave',
    cardId: 'girar_chave',
    category: 'acoes',
    displayLabel: 'Girar a chave',
    image: '/narrative_cards/acoes/girar_chave.webp',
    phrases: [
      'Para trancar a porta, eu preciso _______.',
      'O papai vai _______ para ligar o carro.',
      'Coloque a chave na fechadura para _______.',
      'Para abrir a caixa do tesouro, o pirata vai _______.',
      '"Duas voltas!", disse a mamãe ao me ensinar a _______.'
    ]
  },
  {
    id: 'gritar',
    cardId: 'gritar',
    category: 'acoes',
    displayLabel: 'Gritar',
    image: '/narrative_cards/acoes/gritar.webp',
    phrases: [
      'Na montanha-russa, as pessoas começam a _______.',
      'Não precisa _______, eu estou bem aqui do seu lado.',
      'O menino levou um susto e começou a _______.',
      'No jogo de futebol, a torcida vai _______ "Gol!".',
      'Falar baixo é mais educado do que _______.'
    ]
  },
  {
    id: 'ir_banheiro',
    cardId: 'ir_banheiro',
    category: 'acoes',
    displayLabel: 'Ir ao banheiro',
    image: '/narrative_cards/acoes/ir_banheiro.webp',
    phrases: [
      'Antes de sair de casa, é bom _______.',
      '"Com licença, professora, posso _______?"',
      'Quando bebemos muita água, precisamos _______.',
      'Depois de _______, não se esqueça de dar descarga.',
      'Lave as mãos sempre depois de _______.'
    ]
  },
  {
    id: 'jogar_futebol',
    cardId: 'jogar_futebol',
    category: 'acoes',
    displayLabel: 'Jogar futebol',
    image: '/narrative_cards/acoes/jogar_futebol.webp',
    phrases: [
      'Os meninos se juntaram no campo para _______.',
      '"Vamos _______ no recreio!", convidou o amigo.',
      'O Brasil é famoso por saber _______ muito bem.',
      'Para _______, precisamos de uma bola e duas traves.',
      'O papai vai me levar ao parque para _______.'
    ]
  },
  {
    id: 'lavar_cabelo',
    cardId: 'lavar_cabelo',
    category: 'acoes',
    displayLabel: 'Lavar o cabelo',
    image: '/narrative_cards/acoes/lavar_cabelo.webp',
    phrases: [
      'No banho, eu uso xampu para _______.',
      'Para ficar cheiroso, hoje é dia de _______.',
      'A mamãe me ajuda a _______ para não arder os olhos.',
      'Depois de brincar na areia, eu preciso _______.',
      'A água faz muita espuma quando vamos _______.'
    ]
  },
  {
    id: 'lavar_cachorro',
    cardId: 'lavar_cachorro',
    category: 'acoes',
    displayLabel: 'Lavar o cachorro',
    image: '/narrative_cards/acoes/lavar_cachorro.webp',
    phrases: [
      'O cãozinho está sujo, hoje é dia de _______.',
      'Para tirar as pulgas, o veterinário mandou _______.',
      'Ele não gosta muito, mas precisamos _______ para ele ficar limpinho.',
      'Depois de _______, vamos secá-lo com a toalha.',
      'Prepare a água morna e o xampu para _______.'
    ]
  },
  {
    id: 'lavar_frutas',
    cardId: 'lavar_frutas',
    category: 'acoes',
    displayLabel: 'Lavar as frutas',
    image: '/narrative_cards/acoes/lavar_frutas.webp',
    phrases: [
      'Antes de comer a maçã, é importante _______.',
      'A mamãe vai _______ para fazer a salada de frutas.',
      'Coloque os morangos na água para _______.',
      'Para tirar a sujeirinha da uva, temos que _______.',
      'O cozinheiro precisa _______ antes de usar na receita.'
    ]
  },
  {
    id: 'lavar_louca',
    cardId: 'lavar_louca',
    category: 'acoes',
    displayLabel: 'Lavar a louça',
    image: '/narrative_cards/acoes/lavar_louca.webp',
    phrases: [
      'Depois do jantar, eu ajudo a mamãe a _______.',
      'Use a esponja e o detergente para _______.',
      'Para a pia ficar limpa, temos que _______.',
      'A vovó terminou de _______ e agora vai secar os pratos.',
      'Empilhe os pratos sujos, depois vamos _______.'
    ]
  },
  {
    id: 'lavar_maos',
    cardId: 'lavar_maos',
    category: 'acoes',
    displayLabel: 'Lavar as mãos',
    image: '/narrative_cards/acoes/lavar_maos.webp',
    phrases: [
      'Antes de comer, é obrigatório _______.',
      'Depois de usar o banheiro, não se esqueça de _______.',
      'Para evitar doenças, temos que _______ com sabão.',
      'Suas mãos estão sujas de terra, vá _______!',
      'O médico está sempre a _______ entre os pacientes.'
    ]
  },
  {
    id: 'lavar_rosto',
    cardId: 'lavar_rosto',
    category: 'acoes',
    displayLabel: 'Lavar o rosto',
    image: '/narrative_cards/acoes/lavar_rosto.webp',
    phrases: [
      'Ao acordar, a primeira coisa que faço é _______.',
      'Para tirar a sujeira e acordar, eu vou _______.',
      'A menina foi _______ para tirar a tinta da bochecha.',
      'Use água e sabonete para _______.',
      'Para se refrescar no calor, é bom _______.'
    ]
  },
  {
    id: 'lavar_roupas',
    cardId: 'lavar_roupas',
    category: 'acoes',
    displayLabel: 'Lavar as roupas',
    image: '/narrative_cards/acoes/lavar_roupas.webp',
    phrases: [
      'A camiseta está suja, a mamãe vai _______.',
      'A máquina de lavar serve para _______.',
      'Coloque o sabão em pó para _______ e deixar cheiroso.',
      'No domingo, meu pai vai _______ que usamos na semana.',
      'Depois de _______, vamos pendurar no varal para secar.'
    ]
  },
  {
    id: 'ler_livro',
    cardId: 'ler_livro',
    category: 'acoes',
    displayLabel: 'Ler um livro',
    image: '/narrative_cards/acoes/ler_livro.webp',
    phrases: [
      'A professora vai _______ uma história para a turma.',
      'Antes de dormir, o papai vai _______ para mim.',
      'Na biblioteca, todos fazem silêncio para _______.',
      'Eu adoro _______ sobre dinossauros e planetas.',
      'Para aprender a ler, eu preciso praticar e _______.'
    ]
  },
  {
    id: 'levar_lixo',
    cardId: 'levar_lixo',
    category: 'acoes',
    displayLabel: 'Levar o lixo',
    image: '/narrative_cards/acoes/levar_lixo.webp',
    phrases: [
      'O saco está cheio, por favor, vá _______ para fora.',
      'O caminhão vai passar, é hora de _______.',
      'O papai pediu para eu _______ antes de o lixeiro chegar.',
      'Para manter a casa limpa, temos que _______ todos os dias.',
      'Ajudar a _______ é uma tarefa de casa.'
    ]
  },
  {
    id: 'ligar',
    cardId: 'ligar',
    category: 'acoes',
    displayLabel: 'Ligar',
    image: '/narrative_cards/acoes/ligar.webp',
    phrases: [
      'Para falar com a vovó, eu vou _______ para ela.',
      'Se você estiver em perigo, deve _______ para a polícia.',
      'O papai vai _______ o carro para irmos passear.',
      'Antes de começar a usar, você precisa _______ o aparelho na tomada.',
      'A mamãe vai _______ para o restaurante e pedir uma pizza.'
    ]
  },
  {
    id: 'ligar_TV',
    cardId: 'ligar_TV',
    category: 'acoes',
    displayLabel: 'Ligar a TV',
    image: '/narrative_cards/acoes/ligar_TV.webp',
    phrases: [
      'Para assistir ao meu desenho favorito, eu vou _______.',
      'Use o controle remoto para _______.',
      'O papai vai _______ para ver o jogo de futebol.',
      '"Posso _______?", o menino perguntou.',
      'Depois da lição de casa, podemos _______ um pouco.'
    ]
  },
  {
    id: 'limpar_mesa',
    cardId: 'limpar_mesa',
    category: 'acoes',
    displayLabel: 'Limpar a mesa',
    image: '/narrative_cards/acoes/limpar_mesa.webp',
    phrases: [
      'Depois do almoço, eu ajudo a _______.',
      'Use um pano úmido para _______ e tirar as migalhas.',
      'O suco derramou, pegue um pano para _______.',
      'Para fazer a lição, primeiro vou _______.',
      'O garçom vai _______ antes de trazer a sobremesa.'
    ]
  },
  {
    id: 'limpar_sapatos',
    cardId: 'limpar_sapatos',
    category: 'acoes',
    displayLabel: 'Limpar os sapatos',
    image: '/narrative_cards/acoes/limpar_sapatos.webp',
    phrases: [
      'Pisei na lama, agora preciso _______.',
      'Para o sapato brilhar, o vovô vai _______.',
      'Use uma escova e graxa para _______.',
      'Antes de guardar, é bom _______ para não sujar o armário.',
      'Para a festa, eu vou _______ e deixá-los novos.'
    ]
  },
  // Continuando com mais ações...
  {
    id: 'martelar',
    cardId: 'martelar',
    category: 'acoes',
    displayLabel: 'Martelar',
    image: '/narrative_cards/acoes/martelar.webp',
    phrases: [
      'Para colocar o prego na parede, o papai vai _______.',
      'O carpinteiro usa a madeira para _______.',
      '"Cuidado com o dedo!", disse a mamãe antes de eu _______.',
      'O barulho de _______ vem da casa em construção.',
      'Thor usa seu martelo para _______ com força.'
    ]
  },
  {
    id: 'mostrar',
    cardId: 'mostrar',
    category: 'acoes',
    displayLabel: 'Mostrar',
    image: '/narrative_cards/acoes/mostrar.webp',
    phrases: [
      'Eu vou _______ meu desenho novo para a professora.',
      '"Olha o que eu sei fazer!", disse o menino ao _______ sua habilidade.',
      'Você pode me _______ o caminho para o banheiro?',
      'A menina estava ansiosa para _______ seu vestido novo.',
      'O mágico vai _______ um truque incrível.'
    ]
  },
  {
    id: 'nadar',
    cardId: 'nadar',
    category: 'acoes',
    displayLabel: 'Nadar',
    image: '/narrative_cards/acoes/nadar.webp',
    phrases: [
      'No verão, nós vamos à piscina para _______.',
      'O peixe sabe _______ muito bem.',
      'Para _______, eu uso minha boia de braço.',
      'O cachorro pulou no lago e começou a _______.',
      'A aula de natação me ensina a _______.'
    ]
  },
  {
    id: 'pedir_ajuda',
    cardId: 'pedir_ajuda',
    category: 'acoes',
    displayLabel: 'Pedir ajuda',
    image: '/narrative_cards/acoes/pedir_ajuda.webp',
    phrases: [
      'Se você não consegue fazer sozinho, não tenha medo de _______.',
      '"Mamãe, pode me amarrar o sapato?", o menino foi _______.',
      'Quando a lição é difícil, eu vou _______ para a professora.',
      'É um sinal de coragem _______ quando precisamos.',
      'O gatinho subiu na árvore e miou para _______.'
    ]
  },
  {
    id: 'pedir_silencio',
    cardId: 'pedir_silencio',
    category: 'acoes',
    displayLabel: 'Pedir silêncio',
    image: '/narrative_cards/acoes/pedir_silencio.webp',
    phrases: [
      'O bebê está dormindo, a mamãe vai _______.',
      '"Shhh!", a bibliotecária fez o gesto para _______.',
      'Para a aula começar, a professora precisa _______.',
      'Antes do filme começar, o telão vai _______.',
      'O papai está numa ligação importante, ele vai _______.'
    ]
  },
  {
    id: 'pegar_onibus',
    cardId: 'pegar_onibus',
    category: 'acoes',
    displayLabel: 'Pegar o ônibus',
    image: '/narrative_cards/acoes/pegar_onibus.webp',
    phrases: [
      'Para ir para a escola, eu preciso _______.',
      'Temos que esperar no ponto para _______.',
      'Corra, senão vamos nos atrasar para _______!',
      'O motorista parou para a gente _______.',
      'Todos os dias, o vovô vai _______ para ir ao centro.'
    ]
  },
  {
    id: 'pensar',
    cardId: 'pensar',
    category: 'acoes',
    displayLabel: 'Pensar',
    image: '/narrative_cards/acoes/pensar.webp',
    phrases: [
      'Antes de responder, é importante _______ com calma.',
      'O menino sentou e começou a _______ numa solução.',
      '"Deixa eu _______...", eu digo quando não sei a resposta.',
      'O jogo de xadrez exige que você pare para _______.',
      'Feche os olhos e tente _______ em algo feliz.'
    ]
  },
  {
    id: 'pensar_errado',
    cardId: 'pensar_errado',
    category: 'acoes',
    displayLabel: 'Errar',
    image: '/narrative_cards/acoes/pensar_errado.webp',
    phrases: [
      'Eu achei que a festa era hoje, acabei de _______.',
      'Somei 2+2=5, eu sei que vou _______ a conta.',
      'Se você não tem certeza, não tenha medo de _______.',
      '"Opa, peguei o caminho errado", eu disse ao _______.',
      'Ele chutou a bola e acabou de _______ o gol.'
    ]
  },
  {
    id: 'pentear_cabelo',
    cardId: 'pentear_cabelo',
    category: 'acoes',
    displayLabel: 'Pentear o cabelo',
    image: '/narrative_cards/acoes/pentear_cabelo.webp',
    phrases: [
      'Depois do banho, a mamãe vai _______.',
      'Para não ficar embaraçado, eu preciso _______.',
      'Use o pente ou a escova para _______.',
      'A menina gosta de _______ e fazer um rabo de cavalo.',
      'Para ficar bonito na foto, primeiro vou _______.'
    ]
  },
  {
    id: 'proteger',
    cardId: 'proteger',
    category: 'acoes',
    displayLabel: 'Proteger',
    image: '/narrative_cards/acoes/proteger.webp',
    phrases: [
      'A mamãe galinha vai _______ seus pintinhos.',
      'O guarda-chuva serve para nos _______ da chuva.',
      'O policial está aqui para nos _______ dos perigos.',
      'O capacete serve para _______ a cabeça.',
      'O protetor solar ajuda a _______ a pele do sol.'
    ]
  },
  {
    id: 'provar_sabor',
    cardId: 'provar_sabor',
    category: 'acoes',
    displayLabel: 'Provar o sabor',
    image: '/narrative_cards/acoes/provar_sabor.webp',
    phrases: [
      'O cozinheiro usa uma colher para _______ da comida.',
      '"Hummm, que delícia!", eu disse ao _______ do bolo.',
      'Antes de dizer que não gosta, você precisa _______.',
      'Feche os olhos e tente adivinhar ao _______.',
      'A mamãe vai _______ para ver se precisa de mais sal.'
    ]
  },
  {
    id: 'pular_corda',
    cardId: 'pular_corda',
    category: 'acoes',
    displayLabel: 'Pular corda',
    image: '/narrative_cards/acoes/pular_corda.webp',
    phrases: [
      'No recreio, as meninas se juntaram para _______.',
      'Um de cada vez, vamos _______.',
      '"Um, dois, três...", contamos enquanto vamos _______.',
      '_______ é um ótimo exercício.',
      'O boxeador treina muito e gosta de _______.'
    ]
  },
  {
    id: 'puxar',
    cardId: 'puxar',
    category: 'acoes',
    displayLabel: 'Puxar',
    image: '/narrative_cards/acoes/puxar.webp',
    phrases: [
      'Para abrir a gaveta, você precisa _______.',
      'O cachorro está na coleira a _______ o dono.',
      'No cabo de guerra, nosso time tem que _______ a corda.',
      'Ajude-me a _______ a porta, ela está emperrada.',
      'Em vez de empurrar, a placa diz para _______.'
    ]
  },
  {
    id: 'quebrar',
    cardId: 'quebrar',
    category: 'acoes',
    displayLabel: 'Quebrar',
    image: '/narrative_cards/acoes/quebrar.webp',
    phrases: [
      'Cuidado com o copo de vidro, ele pode _______.',
      'O menino chutou a bola e sem querer foi _______ a janela.',
      'Para fazer um omelete, primeiro preciso _______ um ovo.',
      'O Hulk é tão forte que consegue _______ uma parede.',
      'O brinquedo caiu no chão e acabou de _______.'
    ]
  },
  // Continuando até completar todas as 100 ações...

  // ========================================
  // LUGARES (45 cards)
  // ========================================
  {
    id: 'aeroporto',
    cardId: 'aeroporto',
    category: 'lugares',
    displayLabel: 'Aeroporto',
    image: '/narrative_cards/lugares/aeroporto.webp',
    phrases: [
      'Para viajar para longe, nós pegamos o avião no _______.',
      'O avião decola e pousa na pista do _______.',
      'Despachamos as malas e esperamos o voo no _______.',
      'O piloto trabalha no avião, que fica no _______.',
      'O lugar onde os aviões ficam estacionados se chama _______.'
    ]
  },
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
  {
    id: 'jardim',
    cardId: 'jardim',
    category: 'lugares',
    displayLabel: 'Jardim',
    image: '/narrative_cards/lugares/jardim.webp',
    phrases: [
      'A vovó planta flores coloridas no _______.',
      'As borboletas voam e as abelhas zumbem no _______.',
      'O papai corta a grama do _______ para ficar bonito.',
      'Nós fizemos um piquenique no _______ de casa.',
      'O balanço e o escorregador ficam no _______.'
    ]
  },
  {
    id: 'praia',
    cardId: 'praia',
    category: 'lugares',
    displayLabel: 'Praia',
    image: '/narrative_cards/lugares/praia.webp',
    phrases: [
      'No verão, nós vamos à _______ para nadar no mar.',
      'Eu construí um castelo de areia na _______.',
      'Nós usamos o guarda-sol para fazer sombra na _______.',
      'As ondas do mar quebram na areia da _______.',
      'Eu adoro procurar conchinhas na _______.'
    ]
  },
  {
    id: 'banheiro',
    cardId: 'banheiro',
    category: 'lugares',
    displayLabel: 'Banheiro',
    image: '/narrative_cards/lugares/banheiro.webp',
    phrases: [
      'Eu vou ao _______ para escovar os meus dentes.',
      'Antes de comer, eu lavo minhas mãos no _______.',
      'O chuveiro, a pia e o vaso ficam no _______.',
      '"Com licença, professora, posso ir ao _______?"',
      'Depois de usar o _______, não se esqueça de dar descarga.'
    ]
  },
  {
    id: 'sala_aula',
    cardId: 'sala_aula',
    category: 'lugares',
    displayLabel: 'Sala de Aula',
    image: '/narrative_cards/lugares/sala_aula.webp',
    phrases: [
      'A professora ensina na _______.',
      'As carteiras e a lousa ficam na _______.',
      'Nós fazemos silêncio e prestamos atenção na _______.',
      'Meus amigos e eu aprendemos juntos na _______.',
      'O mapa do Brasil fica pendurado na parede da _______.'
    ]
  },
  {
    id: 'loja',
    cardId: 'loja',
    category: 'lugares',
    displayLabel: 'Loja',
    image: '/narrative_cards/lugares/loja.webp',
    phrases: [
      'Para comprar um brinquedo novo, nós vamos à _______.',
      'A mamãe foi à _______ de roupas comprar um vestido.',
      'O vendedor trabalha na _______ e ajuda os clientes.',
      'Nós pagamos pelas compras no caixa da _______.',
      'A vitrine da _______ estava cheia de coisas bonitas.'
    ]
  },
  {
    id: 'predio',
    cardId: 'predio',
    category: 'lugares',
    displayLabel: 'Prédio',
    image: '/narrative_cards/lugares/predio.webp',
    phrases: [
      'Eu moro em um apartamento, em um _______ muito alto.',
      'Para subir até o meu andar, eu pego o elevador do _______.',
      'O _______ tem muitos andares e muitas janelas.',
      'O porteiro trabalha na entrada do _______.',
      'Vários _______ altos formam a cidade.'
    ]
  },
  // Continuando com mais lugares...

  // ========================================
  // OBJETOS 
  // ========================================
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
    id: 'pizza',
    cardId: 'pizza',
    category: 'objetos',
    displayLabel: 'Pizza',
    image: '/narrative_cards/objetos/pizza.webp',
    phrases: [
      'No domingo, pedimos _______ para o jantar.',
      'A _______ de queijo é a favorita das crianças.',
      'O entregador trouxe a _______ quentinha.',
      'Vamos dividir a _______ em oito pedaços.',
      'Que delícia, a _______ está com muito queijo!'
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
  {
    id: 'cama',
    cardId: 'cama',
    category: 'lugares',
    displayLabel: 'Cama',
    image: '/narrative_cards/lugares/cama.webp',
    phrases: [
      'À noite, eu deito na minha _______ para dormir.',
      'O lugar mais quentinho do quarto é a minha _______.',
      'O travesseiro e o cobertor ficam em cima da _______.',
      'Eu adoro pular na _______ quando a mamãe não está vendo.',
      'O monstro mora embaixo da _______ na história de terror.'
    ]
  },
  {
    id: 'mesa',
    cardId: 'mesa',
    category: 'lugares',
    displayLabel: 'Mesa',
    image: '/narrative_cards/lugares/mesa.webp',
    phrases: [
      'Nós colocamos os pratos e os talheres na _______ para jantar.',
      'Eu faço minha lição de casa na _______ do meu quarto.',
      'O bolo de aniversário está no centro da _______.',
      'A família se reúne ao redor da _______ para conversar.',
      '"Tire os cotovelos da _______!", disse a vovó.'
    ]
  },
  // Continuando com mais objetos...

  // ========================================
  // TEMPO E CLIMA (35 cards)
  // ========================================
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
    id: 'amanha',
    cardId: 'amanha',
    category: 'tempo',
    displayLabel: 'Amanhã',
    image: '/narrative_cards/tempo/amanha.webp',
    phrases: [
      'Hoje é dia de escola, _______ será dia de passeio.',
      'Durma bem, pois _______ vamos acordar cedo.',
      'A festa de aniversário do meu amigo será _______.',
      'Não terminei a lição hoje, vou terminar _______.',
      '"Te vejo _______!", disse a professora no final da aula.'
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
  {
    id: 'tarde',
    cardId: 'tarde',
    category: 'tempo',
    displayLabel: 'Tarde',
    image: '/narrative_cards/tempo/tarde.webp',
    phrases: [
      'Depois do almoço, começa o período da _______.',
      'Eu volto da escola no meio da _______.',
      '"Boa tarde!", nós dizemos quando encontramos alguém à _______.',
      'O sol está mais forte no começo da _______.',
      'No fim da _______, o sol começa a se pôr.'
    ]
  },
  {
    id: 'noite',
    cardId: 'noite',
    category: 'tempo',
    displayLabel: 'Noite',
    image: '/narrative_cards/tempo/noite.webp',
    phrases: [
      'A lua e as estrelas aparecem no céu durante a _______.',
      'Nós dormimos durante a _______ para descansar.',
      'As corujas são animais que gostam de sair à _______.',
      '"Boa noite!", nós dizemos quando a _______ chega.',
      'Quando o céu fica escuro, sabemos que é _______.'
    ]
  },
  {
    id: 'ontem',
    cardId: 'ontem',
    category: 'tempo',
    displayLabel: 'Ontem',
    image: '/narrative_cards/tempo/ontem.webp',
    phrases: [
      '_______ eu brinquei muito no parque com meus amigos.',
      'Se hoje é quarta-feira, _______ foi terça-feira.',
      '"Você se lembra do que nós comemos _______ no jantar?"',
      'A chuva de _______ molhou todo o jardim.',
      'O dia que já passou se chama _______.'
    ]
  },
  {
    id: 'agora',
    cardId: 'agora',
    category: 'tempo',
    displayLabel: 'Agora',
    image: '/narrative_cards/tempo/agora.webp',
    phrases: [
      'Não deixe para depois, vamos arrumar os brinquedos _______.',
      'A mamãe chamou e disse: "Venha jantar _______ mesmo!"',
      'Antes eu estava com sono, mas _______ estou bem acordado.',
      'Pare o que está fazendo, é hora de escovar os dentes _______.',
      '"O que você está fazendo _______?", perguntou o amigo.'
    ]
  },
  {
    id: 'chuva',
    cardId: 'chuva',
    category: 'tempo',
    displayLabel: 'Chuva',
    image: '/narrative_cards/tempo/chuva.webp',
    phrases: [
      'Quando começa a _______, eu pego meu guarda-chuva.',
      'Gosto de ouvir o barulho da _______ caindo na janela.',
      'Por causa da _______, vamos brincar dentro de casa hoje.',
      'As plantas no jardim adoram quando a _______ cai.',
      'Eu coloquei minhas botas para pular nas poças de _______.'
    ]
  },
  {
    id: 'ensolarado',
    cardId: 'ensolarado',
    category: 'tempo',
    displayLabel: 'Ensolarado',
    image: '/narrative_cards/tempo/ensolarado.webp',
    phrases: [
      'O dia está _______, perfeito para ir à praia.',
      'Quando o céu está azul e o sol brilhando, o dia está _______.',
      '"Não esqueça o protetor solar, o dia está _______!", disse a mamãe.',
      'Em um dia _______, usamos óculos de sol e boné.',
      'As roupas no varal secam rapidinho em um dia _______.'
    ]
  },
  {
    id: 'verao',
    cardId: 'verao',
    category: 'tempo',
    displayLabel: 'Verão',
    image: '/narrative_cards/tempo/verao.webp',
    phrases: [
      'O _______ é a estação mais quente do ano.',
      'No _______, nós adoramos ir à praia e à piscina.',
      'No _______, nós tomamos muito sorvete para refrescar.',
      'As férias escolares mais longas acontecem no _______.',
      'No _______, usamos roupas leves, como shorts e camisetas.'
    ]
  },
  {
    id: 'inverno',
    cardId: 'inverno',
    category: 'tempo',
    displayLabel: 'Inverno',
    image: '/narrative_cards/tempo/inverno.webp',
    phrases: [
      'No _______, nós usamos casacos, luvas e gorros.',
      'A estação mais fria do ano é o _______.',
      'No _______, é gostoso tomar um chocolate quente.',
      'Os ursos dormem durante todo o _______.',
      'As árvores ficam sem folhas no _______.'
    ]
  },
  // Continuando com mais elementos de tempo...

  // ========================================
  // EMOÇÕES (40 cards)
  // ========================================
  {
    id: 'homem_feliz',
    cardId: 'homem_feliz',
    category: 'emocoes',
    displayLabel: 'Homem Feliz',
    image: '/narrative_cards/emocoes/homem_feliz.webp',
    phrases: [
      'O _______ sorriu ao receber um presente.',
      'Ao encontrar os amigos, ele ficou um _______.',
      'O _______ deu uma gargalhada gostosa com a piada.',
      '"Hoje é o meu aniversário!", disse o _______.',
      'O papai ficou um _______ quando eu tirei uma nota boa.'
    ]
  },
  {
    id: 'homem_triste',
    cardId: 'homem_triste',
    category: 'emocoes',
    displayLabel: 'Homem Triste',
    image: '/narrative_cards/emocoes/homem_triste.webp',
    phrases: [
      'O _______ chorou porque seu time perdeu o jogo.',
      'O cachorrinho dele fugiu, e ele ficou um _______.',
      'O _______ ficou de cabeça baixa e não quis brincar.',
      '"Estou com saudades da vovó", disse o _______.',
      'O _______ ficou desanimado porque a viagem foi cancelada.'
    ]
  },
  {
    id: 'homem_bravo',
    cardId: 'homem_bravo',
    category: 'emocoes',
    displayLabel: 'Homem Bravo',
    image: '/narrative_cards/emocoes/homem_bravo.webp',
    phrases: [
      'O _______ ficou com a cara fechada porque o carro quebrou.',
      'Quando o time dele perdeu, o papai ficou um _______.',
      'O _______ cruzou os braços e fez um bico.',
      '"Quem fez essa bagunça?", perguntou o _______.',
      'O vizinho ficou um _______ por causa do barulho.'
    ]
  },
  {
    id: 'homem_calmo',
    cardId: 'homem_calmo',
    category: 'emocoes',
    displayLabel: 'Homem Calmo',
    image: '/narrative_cards/emocoes/homem_calmo.webp',
    phrases: [
      'O _______ respirou fundo para relaxar.',
      'Mesmo com a confusão, o vovô continuou um _______.',
      'O _______ sentou no sofá para ler um livro em paz.',
      'Para meditar, é preciso ser um _______.',
      'Ele esperou sua vez na fila como um _______.'
    ]
  },
  {
    id: 'mulher_feliz',
    cardId: 'mulher_feliz',
    category: 'emocoes',
    displayLabel: 'Mulher Feliz',
    image: '/narrative_cards/emocoes/mulher_feliz.webp',
    phrases: [
      'A _______ deu um sorriso largo ao receber flores.',
      'A mamãe ficou uma _______ ao ver meu boletim com notas boas.',
      '"Eu consegui o emprego!", comemorou a _______.',
      'A _______ riu muito com a palhaçada das crianças.',
      'Ao rever uma amiga antiga, ela ficou uma _______.'
    ]
  },
  {
    id: 'mulher_triste',
    cardId: 'mulher_triste',
    category: 'emocoes',
    displayLabel: 'Mulher Triste',
    image: '/narrative_cards/emocoes/mulher_triste.webp',
    phrases: [
      'A _______ chorou ao assistir ao final do filme.',
      'Ela ficou uma _______ porque seu cachorrinho estava doente.',
      '"Estou com muitas saudades", disse a _______.',
      'A _______ ficou desanimada porque não conseguiu viajar nas férias.',
      'A amiga se mudou para longe, e ela ficou uma _______.'
    ]
  },
  {
    id: 'mulher_brava',
    cardId: 'mulher_brava',
    category: 'emocoes',
    displayLabel: 'Mulher Brava',
    image: '/narrative_cards/emocoes/mulher_brava.webp',
    phrases: [
      'A _______ ficou de braços cruzados porque fizeram bagunça na sala.',
      '"Eu já disse para guardar os brinquedos!", falou a _______.',
      'A mamãe ficou uma _______ porque o filho não obedeceu.',
      'A _______ franziu a testa e olhou sério para a bagunça.',
      'A motorista ficou uma _______ quando o outro carro a fechou.'
    ]
  },
  {
    id: 'mulher_calma',
    cardId: 'mulher_calma',
    category: 'emocoes',
    displayLabel: 'Mulher Calma',
    image: '/narrative_cards/emocoes/mulher_calma.webp',
    phrases: [
      'A _______ respirou fundo e contou até dez para não se irritar.',
      'A vovó é uma _______ e resolve tudo com paciência.',
      'Para fazer yoga, é preciso ser uma _______.',
      'Mesmo com o barulho, a _______ continuou lendo seu livro.',
      'A professora explicou a lição de novo, como uma _______.'
    ]
  },
  {
    id: 'homem_surpreso',
    cardId: 'homem_surpreso',
    category: 'emocoes',
    displayLabel: 'Homem Surpreso',
    image: '/narrative_cards/emocoes/homem_surpreso.webp',
    phrases: [
      'O _______ abriu a boca ao ver o tamanho do presente.',
      '"Nossa, eu não esperava por isso!", disse o _______.',
      'Ele ficou um _______ com a festa de aniversário que fizeram para ele.',
      'Ao ver o mágico, o _______ ficou de olhos arregalados.',
      'O _______ não acreditou quando viu o amigo que morava longe.'
    ]
  },
  {
    id: 'mulher_surpresa',
    cardId: 'mulher_surpresa',
    category: 'emocoes',
    displayLabel: 'Mulher Surpresa',
    image: '/narrative_cards/emocoes/mulher_surpresa.webp',
    phrases: [
      'A _______ colocou a mão na boca quando gritaram "Surpresa!".',
      'Ela ficou uma _______ ao receber um pedido de casamento.',
      '"Eu não posso acreditar!", disse a _______.',
      'A _______ ficou de olhos arregalados com o tamanho do presente.',
      'Ela ficou uma _______ ao descobrir que ganhou na loteria.'
    ]
  },
  {
    id: 'azedo',
    cardId: 'azedo',
    category: 'emocoes',
    displayLabel: 'Azedo',
    image: '/narrative_cards/emocoes/azedo.webp',
    phrases: [
      'O suco de limão sem açúcar tem um gosto _______.',
      'Eu fiz uma careta engraçada quando provei o abacaxi _______.',
      'Chupar limão puro deixa a boca com uma sensação _______.',
      'O iogurte natural às vezes é um pouco _______.',
      'O sabor daquela bala era tão _______ que meus olhos se fecharam.'
    ]
  },
  {
    id: 'com_sede',
    cardId: 'com_sede',
    category: 'emocoes',
    displayLabel: 'Com sede',
    image: '/narrative_cards/emocoes/com_sede.webp',
    phrases: [
      'Depois de correr muito, eu fico _______.',
      'O dia está muito quente, estou _______.',
      'Se você está _______, precisa beber água.',
      'Minha garganta está seca, acho que estou _______.',
      '"Mamãe, posso beber suco? Estou _______!"'
    ]
  },
  {
    id: 'comida_deliciosa',
    cardId: 'comida_deliciosa',
    category: 'emocoes',
    displayLabel: 'Comida deliciosa',
    image: '/narrative_cards/emocoes/comida_deliciosa.webp',
    phrases: [
      '"Hummm!", eu disse, "essa é uma _______!"',
      'O bolo da vovó é sempre uma _______.',
      'O cheirinho que vem da cozinha indica uma _______.',
      'Meu prato preferido é uma _______.',
      'Depois de comer, eu disse: "parabéns, era uma _______!"'
    ]
  },
  {
    id: 'eu_quero',
    cardId: 'eu_quero',
    category: 'emocoes',
    displayLabel: 'Eu quero',
    image: '/narrative_cards/emocoes/eu_quero.webp',
    phrases: [
      'Quando vejo um brinquedo na loja, eu digo: "_______!"',
      '_______ um sorvete de chocolate, por favor',
      'Se você deseja algo, pode dizer: "_______"',
      '_______ brincar com você", disse o menino para a amiga.',
      'Na hora de escolher, eu aponto e falo: "_______ este aqui".'
    ]
  }
  // Continuar com mais emoções se necessário...
];
