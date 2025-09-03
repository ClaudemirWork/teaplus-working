// Arquivo: app/data/gameData.ts (VERSÃO ATUALIZADA)

export interface GameElement {
  id: number;
  type: 'image'; 
  content: string; 
  label: string; // NOVO CAMPO: o texto que vai abaixo da imagem
  correctOrder: number;
}
// ... resto das interfaces (GamePhase) igual ao anterior

const substantivos = [ /* ... SUA LISTA GIGANTE DE 112 SUBSTANTIVOS ... */ ]; // Mantenha sua lista de substantivos aqui

export function gerarFasesDeJogo(): GamePhase[] {
  const todasAsFases: GamePhase[] = [];
  let idCounter = 1;

  for (const item of substantivos) {
    const artigoCorreto = item.genero === 'm' ? 'o' : 'a';
    const baseFileName = item.base.replace(' ', '_');
    const adjetivoFileName = item.adjetivo.replace(' ', '_');
    const imagemComposta = `/illustrations/${item.categoria}/${baseFileName}_${adjetivoFileName}.webp`;

    // --- FASE INICIANTE ---
    todasAsFases.push({
      id: `iniciante_${idCounter}`,
      level: 'iniciante',
      title: `${item.base} ${item.adjetivo}`,
      stimulusImage: imagemComposta,
      elements: [
        { id: 1, type: 'image', content: imagemComposta, label: item.base.replace('_', ' '), correctOrder: 1 }, 
        { id: 2, type: 'image', content: `/illustrations/colors/${adjetivoFileName}.webp`, label: item.adjetivo, correctOrder: 2 },
      ],
      completionMessage: `Isso mesmo!`,
    });

    // --- FASE INTERMEDIÁRIO ---
    todasAsFases.push({
      id: `intermediario_${idCounter}`,
      level: 'intermediario',
      title: `${artigoCorreto} ${item.base} ${item.adjetivo}`,
      stimulusImage: imagemComposta,
      elements: [
        { id: 1, type: 'image', content: `/illustrations/articles/artigo_${artigoCorreto}.webp`, label: artigoCorreto.toUpperCase(), correctOrder: 1 },
        { id: 2, type: 'image', content: imagemComposta, label: item.base.replace('_', ' '), correctOrder: 2 }, 
        { id: 3, type: 'image', content: `/illustrations/colors/${adjetivoFileName}.webp`, label: item.adjetivo, correctOrder: 3 },
      ],
      completionMessage: `Perfeito!`,
    });

    idCounter++;
  }
  return todasAsFases.sort(() => Math.random() - 0.5);
}
