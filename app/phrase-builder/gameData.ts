// Arquivo: app/phrase-builder/gameData.ts

// ==================================================================
// INTERFACES (A "forma" dos nossos dados)
// ==================================================================
export interface GameElement {
  id: number;
  type: 'image'; // Por enquanto, todos os elementos são imagens
  content: string; // O caminho para a imagem (ex: /illustrations/...)
  correctOrder: number;
}

export interface GamePhase {
  id:string;
  level: 'iniciante' | 'intermediario';
  title: string;
  stimulusImage: string; // A imagem principal do desafio
  elements: GameElement[]; // Os cartões que a criança vai ordenar
  completionMessage: string;
}

// ==================================================================
// LISTA DE SUBSTANTIVOS (O coração do jogo, baseado 100% nos seus arquivos)
// ==================================================================
const substantivos = [
    // Animals (34)
    { base: 'cachorro', genero: 'm', adjetivo: 'marrom', categoria: 'animals' },
    { base: 'camelo', genero: 'm', adjetivo: 'amarelo', categoria: 'animals' },
    { base: 'camundongo', genero: 'm', adjetivo: 'cinza', categoria: 'animals' },
    { base: 'canguru', genero: 'm', adjetivo: 'marrom', categoria: 'animals' },
    { base: 'carneiro', genero: 'm', adjetivo: 'branco', categoria: 'animals' },
    { base: 'cavalo', genero: 'm', adjetivo: 'marrom', categoria: 'animals' },
    { base: 'cisne', genero: 'm', adjetivo: 'branco', categoria: 'animals' },
    { base: 'coelho', genero: 'm', adjetivo: 'branco', categoria: 'animals' },
    { base: 'coelho', genero: 'm', adjetivo: 'marrom', categoria: 'animals' },
    { base: 'elefante', genero: 'm', adjetivo: 'cinza', categoria: 'animals' },
    { base: 'galinha', genero: 'f', adjetivo: 'marrom', categoria: 'animals' },
    { base: 'galo', genero: 'm', adjetivo: 'marrom', categoria: 'animals' },
    { base: 'ganso', genero: 'm', adjetivo: 'branco', categoria: 'animals' },
    { base: 'gato', genero: 'm', adjetivo: 'amarelo', categoria: 'animals' },
    { base: 'gato', genero: 'm', adjetivo: 'branco', categoria: 'animals' },
    { base: 'girafa', genero: 'f', adjetivo: 'laranja', categoria: 'animals' },
    { base: 'gorila', genero: 'm', adjetivo: 'cinza', categoria: 'animals' },
    { base: 'hipopotamo', genero: 'm', adjetivo: 'cinza', categoria: 'animals' },
    { base: 'jacare', genero: 'm', adjetivo: 'verde', categoria: 'animals' },
    { base: 'macaco', genero: 'm', adjetivo: 'marrom', categoria: 'animals' },
    { base: 'onca', genero: 'f', adjetivo: 'amarelo', categoria: 'animals' },
    { base: 'ovelha', genero: 'f', adjetivo: 'branca', categoria: 'animals' },
    { base: 'pavao', genero: 'm', adjetivo: 'colorido', categoria: 'animals' },
    { base: 'peixe', genero: 'm', adjetivo: 'amarelo', categoria: 'animals' },
    { base: 'pintinho', genero: 'm', adjetivo: 'amarelo', categoria: 'animals' },
    { base: 'pomba', genero: 'f', adjetivo: 'branca', categoria: 'animals' },
    { base: 'ra', genero: 'f', adjetivo: 'marrom', categoria: 'animals' },
    { base: 'raposa', genero: 'f', adjetivo: 'laranja', categoria: 'animals' },
    { base: 'rato', genero: 'm', adjetivo: 'marrom', categoria: 'animals' },
    { base: 'sapo', genero: 'm', adjetivo: 'verde', categoria: 'animals' },
    { base: 'tigre', genero: 'm', adjetivo: 'amarelo', categoria: 'animals' },
    { base: 'urso', genero: 'm', adjetivo: 'branco', categoria: 'animals' },
    { base: 'urso', genero: 'm', adjetivo: 'marrom', categoria: 'animals' },
  
    // Clothes (16)
    { base: 'bikini', genero: 'm', adjetivo: 'rosa', categoria: 'clothes' },
    { base: 'blusa', genero: 'f', adjetivo: 'rosa', categoria: 'clothes' },
    { base: 'blusa', genero: 'f', adjetivo: 'verde', categoria: 'clothes' },
    { base: 'blusa', genero: 'f', adjetivo: 'vermelho', categoria: 'clothes' },
    { base: 'bone', genero: 'm', adjetivo: 'colorido', categoria: 'clothes' },
    { base: 'calca', genero: 'f', adjetivo: 'azul', categoria: 'clothes' },
    { base: 'camiseta', genero: 'f', adjetivo: 'azul', categoria: 'clothes' },
    { base: 'camisola', genero: 'f', adjetivo: 'amarelo', categoria: 'clothes' },
    { base: 'capa_chuva', genero: 'f', adjetivo: 'amarelo', categoria: 'clothes' },
    { base: 'casaco', genero: 'm', adjetivo: 'marrom', categoria: 'clothes' },
    { base: 'cueca', genero: 'f', adjetivo: 'azul', categoria: 'clothes' },
    { base: 'gorro', genero: 'm', adjetivo: 'colorido', categoria: 'clothes' },
    { base: 'jaqueta', genero: 'f', adjetivo: 'marrom', categoria: 'clothes' },
    { base: 'pijama_bebe', genero: 'm', adjetivo: 'azul', categoria: 'clothes' },
    { base: 'shorts', genero: 'm', adjetivo: 'verde', categoria: 'clothes' },
    { base: 'vestido', genero: 'm', adjetivo: 'azul', categoria: 'clothes' },
  
    // Fruits (25)
    { base: 'abacate', genero: 'm', adjetivo: 'verde', categoria: 'fruits' },
    { base: 'abacaxi', genero: 'm', adjetivo: 'amarelo', categoria: 'fruits' },
    { base: 'abobora', genero: 'f', adjetivo: 'laranja', categoria: 'fruits' },
    { base: 'ameixa', genero: 'f', adjetivo: 'roxo', categoria: 'fruits' },
    { base: 'banana', genero: 'f', adjetivo: 'amarelo', categoria: 'fruits' },
    { base: 'cereja', genero: 'f', adjetivo: 'vermelho', categoria: 'fruits' },
    { base: 'cranberries', genero: 'm', adjetivo: 'vermelho', categoria: 'fruits' },
    { base: 'damasco', genero: 'm', adjetivo: 'laranja', categoria: 'fruits' },
    { base: 'figo', genero: 'm', adjetivo: 'roxo', categoria: 'fruits' },
    { base: 'figo', genero: 'm', adjetivo: 'verde', categoria: 'fruits' },
    { base: 'kiwi', genero: 'm', adjetivo: 'verde', categoria: 'fruits' },
    { base: 'laranja', genero: 'f', adjetivo: 'laranja', categoria: 'fruits' },
    { base: 'limao', genero: 'm', adjetivo: 'amarelo', categoria: 'fruits' },
    { base: 'limao', genero: 'm', adjetivo: 'verde', categoria: 'fruits' },
    { base: 'maca', genero: 'f', adjetivo: 'verde', categoria: 'fruits' },
    { base: 'maca', genero: 'f', adjetivo: 'vermelho', categoria: 'fruits' },
    { base: 'manga', genero: 'f', adjetivo: 'verde', categoria: 'fruits' },
    { base: 'melancia', genero: 'f', adjetivo: 'verde', categoria: 'fruits' },
    { base: 'melao', genero: 'm', adjetivo: 'verde', categoria: 'fruits' },
    { base: 'morango', genero: 'm', adjetivo: 'vermelho', categoria: 'fruits' },
    { base: 'pera', genero: 'f', adjetivo: 'verde', categoria: 'fruits' },
    { base: 'pessego', genero: 'm', adjetivo: 'laranja', categoria: 'fruits' },
    { base: 'tomate', genero: 'm', adjetivo: 'vermelho', categoria: 'fruits' },
    { base: 'uva', genero: 'f', adjetivo: 'roxo', categoria: 'fruits' },
    { base: 'uva', genero: 'f', adjetivo: 'verde', categoria: 'fruits' },
  
    // Insects (8)
    { base: 'abelha', genero: 'f', adjetivo: 'amarelo', categoria: 'insects' },
    { base: 'aranha', genero: 'f', adjetivo: 'marrom', categoria: 'insects' },
    { base: 'besouro', genero: 'm', adjetivo: 'verde', categoria: 'insects' },
    { base: 'borboleta', genero: 'f', adjetivo: 'amarelo', categoria: 'insects' },
    { base: 'formiga', genero: 'f', adjetivo: 'vermelho', categoria: 'insects' },
    { base: 'grilo', genero: 'm', adjetivo: 'amarelo', categoria: 'insects' },
    { base: 'libelula', genero: 'f', adjetivo: 'cinza', categoria: 'insects' },
    { base: 'mosca', genero: 'f', adjetivo: 'preto', categoria: 'insects' },
  
    // Toys (13)
    { base: 'balao', genero: 'm', adjetivo: 'rosa', categoria: 'toys' },
    { base: 'bola basquete', genero: 'f', adjetivo: 'laranja', categoria: 'toys' },
    { base: 'bola_futebol', genero: 'f', adjetivo: 'colorido', categoria: 'toys' },
    { base: 'bola_praia', genero: 'f', adjetivo: 'colorido', categoria: 'toys' },
    { base: 'bola', genero: 'f', adjetivo: 'vermelha', categoria: 'toys' },
    { base: 'brinquedos', genero: 'm', adjetivo: 'colorido', categoria: 'toys' },
    { base: 'cubo', genero: 'm', adjetivo: 'colorido', categoria: 'toys' },
    { base: 'joystick', genero: 'm', adjetivo: 'colorido', categoria: 'toys' },
    { base: 'pecas_lego', genero: 'f', adjetivo: 'colorido', categoria: 'toys' },
    { base: 'pipa', genero: 'f', adjetivo: 'vermelho', categoria: 'toys' },
    { base: 'piscina_bolinha', genero: 'f', adjetivo: 'colorido', categoria: 'toys' },
    { base: 'playstation', genero: 'm', adjetivo: 'cinza', categoria: 'toys' },
    { base: 'quebra_cabeca', genero: 'm', adjetivo: 'colorido', categoria: 'toys' },
  
    // Vegetables (16)
    { base: 'Berinjela', genero: 'f', adjetivo: 'roxo', categoria: 'vegetables' },
    { base: 'abobrinha', genero: 'f', adjetivo: 'verde', categoria: 'vegetables' },
    { base: 'alface', genero: 'f', adjetivo: 'verde', categoria: 'vegetables' },
    { base: 'aspargos', genero: 'm', adjetivo: 'verde', categoria: 'vegetables' },
    { base: 'azeitona', genero: 'f', adjetivo: 'verde', categoria: 'vegetables' },
    { base: 'brocolis', genero: 'm', adjetivo: 'verde', categoria: 'vegetables' },
    { base: 'cenoura', genero: 'f', adjetivo: 'laranja', categoria: 'vegetables' },
    { base: 'chuchu', genero: 'm', adjetivo: 'verde', categoria: 'vegetables' },
    { base: 'ervilha', genero: 'f', adjetivo: 'verde', categoria: 'vegetables' },
    { base: 'milho', genero: 'm', adjetivo: 'amarelo', categoria: 'vegetables' },
    { base: 'pepino', genero: 'm', adjetivo: 'verde', categoria: 'vegetables' },
    { base: 'pimenta', genero: 'f', adjetivo: 'vermelho', categoria: 'vegetables' },
    { base: 'pimentao', genero: 'm', adjetivo: 'amarelo', categoria: 'vegetables' },
    { base: 'pimentao', genero: 'm', adjetivo: 'verde', categoria: 'vegetables' },
    { base: 'pimentao', genero: 'm', adjetivo: 'vermelho', categoria: 'vegetables' },
    { base: 'repolho', genero: 'm', adjetivo: 'verde', categoria: 'vegetables' },
  ];

// ==================================================================
// FUNÇÃO GERADORA DE FASES
// ==================================================================
export function gerarFasesDeJogo(): GamePhase[] {
  const todasAsFases: GamePhase[] = [];
  let idCounter = 1;

  for (const item of substantivos) {
    const artigoCorreto = item.genero === 'm' ? 'o' : 'a';
    
    // Prepara os nomes para o caminho do arquivo, trocando espaços por underscores se houver
    const baseFileName = item.base.replace(' ', '_');
    const adjetivoFileName = item.adjetivo.replace(' ', '_');

    const imagemComposta = `/illustrations/${item.categoria}/${baseFileName}_${adjetivoFileName}.webp`;

    // --- FASE INICIANTE (2 Figuras) ---
    todasAsFases.push({
      id: `iniciante_${idCounter}`,
      level: 'iniciante',
      title: `${item.base} ${item.adjetivo}`,
      stimulusImage: imagemComposta,
      elements: [
        { id: 1, type: 'image', content: imagemComposta, correctOrder: 1 },
        { id: 2, type: 'image', content: `/illustrations/colors/${adjetivoFileName}.webp`, correctOrder: 2 },
      ],
      completionMessage: `Isso mesmo!`,
    });

    // --- FASE INTERMEDIÁRIO (3 Figuras) ---
    todasAsFases.push({
      id: `intermediario_${idCounter}`,
      level: 'intermediario',
      title: `${artigoCorreto} ${item.base} ${item.adjetivo}`,
      stimulusImage: imagemComposta,
      elements: [
        { id: 1, type: 'image', content: `/illustrations/articles/artigo_${artigoCorreto}.webp`, correctOrder: 1 },
        { id: 2, type: 'image', content: imagemComposta, correctOrder: 2 },
        { id: 3, type: 'image', content: `/illustrations/colors/${adjetivoFileName}.webp`, correctOrder: 3 },
      ],
      completionMessage: `Perfeito!`,
    });

    idCounter++;
  }

  // Embaralha a ordem final das fases para que não venham sempre na mesma sequência
  return todasAsFases.sort(() => Math.random() - 0.5);
}
