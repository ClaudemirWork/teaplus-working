'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Sparkles, ChevronRight, RotateCcw, Home, Brain, Shield, Globe, Award } from 'lucide-react';

// Interfaces (com sua nova propriedade 'complexity')
interface StoryElement {
  id: number;
  text: string;
  icon: string;
  correctOrder: number;
}
interface Story {
  id: string;
  title: string;
  category: string;
  narrator: 'Leo' | 'Mila';
  elements: StoryElement[];
  completionMessage: string;
  hint: string;
  skills: string[];
  complexity: 'emotional' | 'social' | 'cultural' | 'ethical';
}

// SUAS 20 HISTÓRIAS COMPLETAS DO NÍVEL AVANÇADO
const advancedStories: Story[] = [
  { id: 'emotional_1', title: 'Mudança de Escola', category: 'Jornadas Emocionais', narrator: 'Leo', complexity: 'emotional', elements: [ { id: 1, text: "Lucas recebeu a notícia de que mudaria de cidade", icon: "📦", correctOrder: 1 }, { id: 2, text: "Sentiu tristeza profunda ao pensar em deixar os amigos", icon: "😢", correctOrder: 2 }, { id: 3, text: "Despediu-se de cada amigo com um abraço especial", icon: "🤗", correctOrder: 3 }, { id: 4, text: "Chegou na escola nova sentindo-se muito nervoso", icon: "😰", correctOrder: 4 }, { id: 5, text: "Um colega sorriu e ofereceu ajuda com a escola", icon: "😊", correctOrder: 5 }, { id: 6, text: "Lucas fez o primeiro amigo no novo lugar", icon: "🤝", correctOrder: 6 }, { id: 7, text: "Percebeu que mudanças trazem novas oportunidades", icon: "🌟", correctOrder: 7 } ], completionMessage: "Incrível! Você compreendeu a jornada completa de adaptação!", hint: "Notícia → tristeza → despedida → chegada → nervosismo → acolhimento → aprendizado", skills: ["Resiliência Emocional", "Adaptação", "Abertura ao Novo", "Processamento de Perdas"] },
  { id: 'emotional_2', title: 'Competição Esportiva', category: 'Jornadas Emocionais', narrator: 'Mila', complexity: 'emotional', elements: [ { id: 1, text: "Maria treinou natação todos os dias por meses", icon: "🏊", correctOrder: 1 }, { id: 2, text: "Acordou no dia da competição com borboletas no estômago", icon: "🦋", correctOrder: 2 }, { id: 3, text: "Fez aquecimento respirando fundo para se concentrar", icon: "💨", correctOrder: 3 }, { id: 4, text: "Nadou com toda força ouvindo a torcida", icon: "💪", correctOrder: 4 }, { id: 5, text: "Cruzou a linha em segundo lugar", icon: "🥈", correctOrder: 5 }, { id: 6, text: "Sentiu orgulho por superar seu tempo pessoal", icon: "⏱️", correctOrder: 6 }, { id: 7, text: "Celebrou com a equipe valorizando o esforço de todos", icon: "🎉", correctOrder: 7 } ], completionMessage: "Excelente! Você entendeu que vitória vai além do primeiro lugar!", hint: "Preparação → ansiedade → concentração → esforço → resultado → reflexão → celebração", skills: ["Disciplina", "Gestão de Ansiedade", "Autoconhecimento", "Espírito de Equipe"] },
  { id: 'emotional_3', title: 'Cuidando do Irmãozinho', category: 'Jornadas Emocionais', narrator: 'Leo', complexity: 'emotional', elements: [ { id: 1, text: "O bebê chegou em casa e todos estavam felizes", icon: "👶", correctOrder: 1 }, { id: 2, text: "Pedro sentiu ciúmes quando todos davam atenção ao bebê", icon: "😤", correctOrder: 2 }, { id: 3, text: "Mamãe pediu ajuda para cuidar do irmãozinho", icon: "🤱", correctOrder: 3 }, { id: 4, text: "Pedro segurou o bebê com muito cuidado", icon: "🤲", correctOrder: 4 }, { id: 5, text: "O bebê sorriu pela primeira vez para Pedro", icon: "😄", correctOrder: 5 }, { id: 6, text: "Sentiu amor crescer no coração", icon: "💕", correctOrder: 6 }, { id: 7, text: "Virou o melhor irmão mais velho protetor", icon: "🦸", correctOrder: 7 } ], completionMessage: "Lindo! Você compreendeu a transformação do ciúme em amor!", hint: "Chegada → ciúme → responsabilidade → cuidado → conexão → amor → proteção", skills: ["Processamento de Emoções", "Responsabilidade", "Amor Fraternal", "Maturidade"] },
  { id: 'emotional_4', title: 'Projeto Escolar Desafiador', category: 'Jornadas Emocionais', narrator: 'Mila', complexity: 'emotional', elements: [ { id: 1, text: "Ana recebeu um projeto de ciências muito difícil", icon: "🔬", correctOrder: 1 }, { id: 2, text: "Pesquisou na biblioteca por horas sem entender", icon: "📚", correctOrder: 2 }, { id: 3, text: "Encontrou problemas com o experimento inicial", icon: "⚠️", correctOrder: 3 }, { id: 4, text: "Pediu ajuda ao professor que explicou pacientemente", icon: "👨‍🏫", correctOrder: 4 }, { id: 5, text: "Trabalhou com dedicação refazendo tudo", icon: "✍️", correctOrder: 5 }, { id: 6, text: "Apresentou o projeto para toda a turma", icon: "🎤", correctOrder: 6 }, { id: 7, text: "Recebeu aplausos e aprendeu sobre perseverança", icon: "👏", correctOrder: 7 } ], completionMessage: "Brilhante! Perseverança transforma desafios em conquistas!", hint: "Desafio → confusão → erro → busca de ajuda → dedicação → apresentação → reconhecimento", skills: ["Perseverança", "Busca de Conhecimento", "Humildade", "Comunicação"] },
  { id: 'emotional_5', title: 'Salvando um Animal', category: 'Jornadas Emocionais', narrator: 'Leo', complexity: 'emotional', elements: [ { id: 1, text: "João encontrou um passarinho caído do ninho", icon: "🐦", correctOrder: 1 }, { id: 2, text: "Sentiu preocupação ao ver a asa machucada", icon: "😟", correctOrder: 2 }, { id: 3, text: "Fez um ninho improvisado numa caixa de sapatos", icon: "📦", correctOrder: 3 }, { id: 4, text: "Deu água e comida com muito cuidado", icon: "💧", correctOrder: 4 }, { id: 5, text: "Cuidou do passarinho por vários dias", icon: "🗓️", correctOrder: 5 }, { id: 6, text: "Viu o passarinho melhorar e bater as asas", icon: "🪶", correctOrder: 6 }, { id: 7, text: "Soltou o pássaro que voou livre e feliz", icon: "🕊️", correctOrder: 7 } ], completionMessage: "Maravilhoso! Cuidar e libertar é o verdadeiro amor!", hint: "Encontro → preocupação → abrigo → cuidado → dedicação → recuperação → liberdade", skills: ["Compaixão", "Responsabilidade", "Paciência", "Desprendimento"] },
  { id: 'emotional_6', title: 'Superando o Bullying', category: 'Jornadas Emocionais', narrator: 'Mila', complexity: 'emotional', elements: [ { id: 1, text: "Carlos sofria provocações diárias na escola", icon: "😔", correctOrder: 1 }, { id: 2, text: "Sentiu-se cada vez mais triste e isolado", icon: "💔", correctOrder: 2 }, { id: 3, text: "Conversou com um adulto de confiança", icon: "🗣️", correctOrder: 3 }, { id: 4, text: "Aprendeu estratégias para se defender sem violência", icon: "🛡️", correctOrder: 4 }, { id: 5, text: "Confrontou os agressores com calma e firmeza", icon: "💪", correctOrder: 5 }, { id: 6, text: "Os provocadores pararam ao ver sua confiança", icon: "✋", correctOrder: 6 }, { id: 7, text: "Carlos recuperou sua autoestima e fez novos amigos", icon: "🌈", correctOrder: 7 } ], completionMessage: "Corajoso! Força interior vence qualquer intimidação!", hint: "Sofrimento → isolamento → busca de apoio → aprendizado → confronto → mudança → recuperação", skills: ["Coragem", "Comunicação Assertiva", "Resiliência", "Autoestima"] },
  { id: 'emotional_7', title: 'Descobrindo um Talento', category: 'Jornadas Emocionais', narrator: 'Leo', complexity: 'emotional', elements: [ { id: 1, text: "Sofia tentou tocar violão pela primeira vez", icon: "🎸", correctOrder: 1 }, { id: 2, text: "Falhou muitas vezes e ficou frustrada", icon: "😫", correctOrder: 2 }, { id: 3, text: "Quase desistiu pensando que não tinha talento", icon: "🚫", correctOrder: 3 }, { id: 4, text: "O professor incentivou dizendo que todos começam assim", icon: "👨‍🏫", correctOrder: 4 }, { id: 5, text: "Praticou todos os dias com determinação", icon: "📅", correctOrder: 5 }, { id: 6, text: "Melhorou gradualmente dominando as notas", icon: "🎵", correctOrder: 6 }, { id: 7, text: "Apresentou uma música no show da escola", icon: "🎤", correctOrder: 7 } ], completionMessage: "Inspirador! Talento nasce da prática e persistência!", hint: "Tentativa → fracasso → frustração → encorajamento → prática → progresso → realização", skills: ["Determinação", "Superação", "Disciplina", "Autoconfiança"] },
  { id: 'emotional_8', title: 'Amizade Testada', category: 'Jornadas Emocionais', narrator: 'Mila', complexity: 'emotional', elements: [ { id: 1, text: "Júlia contou um segredo importante para Laura", icon: "🤫", correctOrder: 1 }, { id: 2, text: "Outros colegas pediram insistentemente para Laura contar", icon: "👥", correctOrder: 2 }, { id: 3, text: "Laura sentiu pressão enorme do grupo", icon: "😣", correctOrder: 3 }, { id: 4, text: "Decidiu ser leal e não revelar o segredo", icon: "🤐", correctOrder: 4 }, { id: 5, text: "Júlia descobriu sobre a pressão que Laura sofreu", icon: "👂", correctOrder: 5 }, { id: 6, text: "Agradeceu emocionada pela lealdade da amiga", icon: "🙏", correctOrder: 6 }, { id: 7, text: "A amizade delas ficou ainda mais forte", icon: "💝", correctOrder: 7 } ], completionMessage: "Admirável! Lealdade verdadeira constrói amizades eternas!", hint: "Confiança → pressão → dilema → decisão → descoberta → gratidão → fortalecimento", skills: ["Lealdade", "Integridade", "Resistência à Pressão", "Amizade Verdadeira"] },
  { id: 'emotional_9', title: 'Medo Superado', category: 'Jornadas Emocionais', narrator: 'Leo', complexity: 'emotional', elements: [ { id: 1, text: "Daniel tinha pavor de altura desde pequeno", icon: "😨", correctOrder: 1 }, { id: 2, text: "Evitou lugares altos por muitos anos", icon: "🚫", correctOrder: 2 }, { id: 3, text: "Decidiu enfrentar o medo para ajudar o gatinho", icon: "🐱", correctOrder: 3 }, { id: 4, text: "Preparou-se mentalmente respirando profundamente", icon: "🧘", correctOrder: 4 }, { id: 5, text: "Subiu na árvore tremendo mas determinado", icon: "🌳", correctOrder: 5 }, { id: 6, text: "Conseguiu resgatar o gatinho assustado", icon: "✨", correctOrder: 6 }, { id: 7, text: "Celebrou a conquista sobre seu maior medo", icon: "🏆", correctOrder: 7 } ], completionMessage: "Heroico! Coragem é agir apesar do medo!", hint: "Medo → evitação → motivação → preparação → ação → sucesso → celebração", skills: ["Coragem", "Superação de Medos", "Altruísmo", "Força Mental"] },
  { id: 'emotional_10', title: 'Perdão Difícil', category: 'Jornadas Emocionais', narrator: 'Mila', complexity: 'emotional', elements: [ { id: 1, text: "Marcos quebrou o brinquedo favorito de Paulo", icon: "💔", correctOrder: 1 }, { id: 2, text: "Paulo ficou muito magoado e parou de falar com Marcos", icon: "😠", correctOrder: 2 }, { id: 3, text: "Passou dias sentindo raiva e tristeza", icon: "😔", correctOrder: 3 }, { id: 4, text: "Marcos pediu perdão sinceramente várias vezes", icon: "🙏", correctOrder: 4 }, { id: 5, text: "Paulo lutou internamente entre perdoar ou não", icon: "💭", correctOrder: 5 }, { id: 6, text: "Escolheu perdoar porque valorizava a amizade", icon: "💚", correctOrder: 6 }, { id: 7, text: "A amizade renasceu mais forte e madura", icon: "🌱", correctOrder: 7 } ], completionMessage: "Nobre! Perdoar liberta e fortalece relações!", hint: "Mágoa → raiva → tempo → arrependimento → conflito interno → perdão → renovação", skills: ["Perdão", "Maturidade Emocional", "Compaixão", "Valorização de Relações"] },
  { id: 'cultural_1', title: 'Festival das Culturas', category: 'Narrativas Culturais', narrator: 'Leo', complexity: 'cultural', elements: [ { id: 1, text: "A escola anunciou o Festival Multicultural", icon: "🌍", correctOrder: 1 }, { id: 2, text: "Cada aluno pesquisou sobre suas origens familiares", icon: "🔍", correctOrder: 2 }, { id: 3, text: "Prepararam apresentações com roupas tradicionais", icon: "👘", correctOrder: 3 }, { id: 4, text: "Ensaiaram danças e músicas de cada cultura", icon: "💃", correctOrder: 4 }, { id: 5, text: "Vestiram trajes coloridos no dia do festival", icon: "🎭", correctOrder: 5 }, { id: 6, text: "Apresentaram com orgulho suas heranças culturais", icon: "🎤", correctOrder: 6 }, { id: 7, text: "Aprenderam a valorizar a diversidade humana", icon: "🤝", correctOrder: 7 } ], completionMessage: "Magnífico! Diversidade cultural enriquece a todos!", hint: "Anúncio → pesquisa → preparação → ensaio → apresentação → orgulho → aprendizado", skills: ["Consciência Cultural", "Respeito à Diversidade", "Orgulho das Origens", "Aprendizado Intercultural"] },
  { id: 'cultural_2', title: 'Ação Voluntária', category: 'Narrativas Culturais', narrator: 'Mila', complexity: 'social', elements: [ { id: 1, text: "As crianças viram pessoas necessitadas na comunidade", icon: "👨‍👩‍👧", correctOrder: 1 }, { id: 2, text: "Sentiram vontade genuína de ajudar", icon: "💗", correctOrder: 2 }, { id: 3, text: "Organizaram uma campanha de arrecadação", icon: "📦", correctOrder: 3 }, { id: 4, text: "Mobilizaram toda a escola para participar", icon: "🏫", correctOrder: 4 }, { id: 5, text: "Coletaram alimentos, roupas e brinquedos", icon: "🎁", correctOrder: 5 }, { id: 6, text: "Entregaram pessoalmente com carinho", icon: "🤲", correctOrder: 6 }, { id: 7, text: "Sentiram a felicidade de fazer a diferença", icon: "✨", correctOrder: 7 } ], completionMessage: "Inspirador! Solidariedade transforma o mundo!", hint: "Observação → empatia → planejamento → mobilização → coleta → entrega → realização", skills: ["Solidariedade", "Liderança Social", "Empatia Ativa", "Responsabilidade Social"] },
  { id: 'cultural_3', title: 'Descoberta Científica', category: 'Narrativas Culturais', narrator: 'Leo', complexity: 'cultural', elements: [ { id: 1, text: "Nina observou formigas carregando folhas", icon: "🐜", correctOrder: 1 }, { id: 2, text: "Fez perguntas sobre o comportamento delas", icon: "❓", correctOrder: 2 }, { id: 3, text: "Criou hipótese sobre trabalho em equipe", icon: "💡", correctOrder: 3 }, { id: 4, text: "Montou experimento com diferentes obstáculos", icon: "🔬", correctOrder: 4 }, { id: 5, text: "Anotou observações por vários dias", icon: "📝", correctOrder: 5 }, { id: 6, text: "Tirou conclusões sobre cooperação", icon: "📊", correctOrder: 6 }, { id: 7, text: "Compartilhou descoberta na feira de ciências", icon: "🏆", correctOrder: 7 } ], completionMessage: "Científico! Curiosidade leva a grandes descobertas!", hint: "Observação → questionamento → hipótese → experimento → registro → conclusão → compartilhamento", skills: ["Método Científico", "Observação", "Pensamento Crítico", "Comunicação Científica"] },
  { id: 'cultural_4', title: 'Dilema da Honestidade', category: 'Narrativas Culturais', narrator: 'Mila', complexity: 'ethical', elements: [ { id: 1, text: "Felipe encontrou uma carteira com muito dinheiro", icon: "💰", correctOrder: 1 }, { id: 2, text: "Pensou por um momento em ficar com ela", icon: "🤔", correctOrder: 2 }, { id: 3, text: "Lembrou dos valores que aprendeu em casa", icon: "🏠", correctOrder: 3 }, { id: 4, text: "Procurou identificação do dono na carteira", icon: "🔍", correctOrder: 4 }, { id: 5, text: "Encontrou o dono que estava desesperado", icon: "😰", correctOrder: 5 }, { id: 6, text: "Devolveu tudo e recebeu gratidão sincera", icon: "🙏", correctOrder: 6 }, { id: 7, text: "Sentiu-se íntegro e em paz consigo", icon: "😇", correctOrder: 7 } ], completionMessage: "Íntegro! Honestidade é a base do caráter!", hint: "Descoberta → tentação → reflexão → investigação → encontro → devolução → paz interior", skills: ["Honestidade", "Integridade", "Valores Éticos", "Consciência Moral"] },
  { id: 'cultural_5', title: 'Intercâmbio Cultural', category: 'Narrativas Culturais', narrator: 'Leo', complexity: 'cultural', elements: [ { id: 1, text: "A escola recebeu um estudante do Japão", icon: "🇯🇵", correctOrder: 1 }, { id: 2, text: "As crianças sentiram curiosidade sobre sua cultura", icon: "🤓", correctOrder: 2 }, { id: 3, text: "Mostraram a cultura brasileira com alegria", icon: "🇧🇷", correctOrder: 3 }, { id: 4, text: "Aprenderam palavras em japonês", icon: "🗾", correctOrder: 4 }, { id: 5, text: "Criaram laços através de jogos e brincadeiras", icon: "🎮", correctOrder: 5 }, { id: 6, text: "Choraram juntos na despedida emocionante", icon: "😢", correctOrder: 6 }, { id: 7, text: "Prometeram manter contato para sempre", icon: "💌", correctOrder: 7 } ], completionMessage: "Global! Amizades transcendem fronteiras!", hint: "Chegada → curiosidade → troca → aprendizado → conexão → despedida → continuidade", skills: ["Interculturalidade", "Comunicação Global", "Abertura Cultural", "Amizade Internacional"] },
  { id: 'cultural_6', title: 'Pequeno Empreendedor', category: 'Narrativas Culturais', narrator: 'Mila', complexity: 'social', elements: [ { id: 1, text: "Tomás teve ideia de vender limonada", icon: "🍋", correctOrder: 1 }, { id: 2, text: "Planejou custos e preços cuidadosamente", icon: "📈", correctOrder: 2 }, { id: 3, text: "Pediu permissão aos pais e apoio", icon: "👨‍👩‍👦", correctOrder: 3 }, { id: 4, text: "Preparou limonada fresca e saborosa", icon: "🥤", correctOrder: 4 }, { id: 5, text: "Montou barraquinha colorida na calçada", icon: "🏪", correctOrder: 5 }, { id: 6, text: "Atendeu clientes com simpatia", icon: "😊", correctOrder: 6 }, { id: 7, text: "Contou lucro orgulhoso do trabalho", icon: "💵", correctOrder: 7 } ], completionMessage: "Empreendedor! Iniciativa e trabalho geram resultados!", hint: "Ideia → planejamento → autorização → produção → montagem → vendas → resultado", skills: ["Empreendedorismo", "Planejamento", "Responsabilidade Financeira", "Atendimento"] },
  { id: 'cultural_7', title: 'Proteção Ambiental', category: 'Narrativas Culturais', narrator: 'Leo', complexity: 'social', elements: [ { id: 1, text: "As crianças notaram lixo no parque", icon: "🗑️", correctOrder: 1 }, { id: 2, text: "Ficaram indignadas com a poluição", icon: "😤", correctOrder: 2 }, { id: 3, text: "Reuniram amigos para limpar juntos", icon: "👥", correctOrder: 3 }, { id: 4, text: "Criaram campanha de conscientização", icon: "📢", correctOrder: 4 }, { id: 5, text: "Limparam toda área com determinação", icon: "🧹", correctOrder: 5 }, { id: 6, text: "Viram a diferença no ambiente limpo", icon: "🌳", correctOrder: 6 }, { id: 7, text: "Inspiraram toda comunidade a cuidar", icon: "🌍", correctOrder: 7 } ], completionMessage: "Ecológico! Pequenas ações salvam o planeta!", hint: "Problema → indignação → mobilização → campanha → ação → resultado → inspiração", skills: ["Consciência Ambiental", "Ativismo", "Trabalho Comunitário", "Liderança Verde"] },
  { id: 'cultural_8', title: 'Inclusão na Prática', category: 'Narrativas Culturais', narrator: 'Mila', complexity: 'social', elements: [ { id: 1, text: "Conheceram um colega com necessidades especiais", icon: "♿", correctOrder: 1 }, { id: 2, text: "Notaram suas dificuldades em participar", icon: "🤔", correctOrder: 2 }, { id: 3, text: "Pensaram em formas de incluir nas atividades", icon: "💭", correctOrder: 3 }, { id: 4, text: "Adaptaram brincadeiras para todos jogarem", icon: "🎯", correctOrder: 4 }, { id: 5, text: "Incluíram o colega em todas atividades", icon: "🤝", correctOrder: 5 }, { id: 6, text: "Viram sua alegria em participar", icon: "😊", correctOrder: 6 }, { id: 7, text: "Aprenderam que diferenças enriquecem", icon: "🌈", correctOrder: 7 } ], completionMessage: "Inclusivo! Todos merecem pertencer!", hint: "Encontro → observação → reflexão → adaptação → inclusão → alegria → aprendizado", skills: ["Inclusão", "Empatia", "Criatividade Social", "Respeito às Diferenças"] },
  { id: 'cultural_9', title: 'Tradição Familiar', category: 'Narrativas Culturais', narrator: 'Leo', complexity: 'cultural', elements: [ { id: 1, text: "Vovó contou história antiga da família", icon: "👵", correctOrder: 1 }, { id: 2, text: "As crianças ficaram fascinadas com o passado", icon: "✨", correctOrder: 2 }, { id: 3, text: "Pediram para aprender a receita secreta", icon: "📖", correctOrder: 3 }, { id: 4, text: "Praticaram com vovó várias vezes", icon: "👩‍🍳", correctOrder: 4 }, { id: 5, text: "Erraram algumas tentativas rindo juntos", icon: "😄", correctOrder: 5 }, { id: 6, text: "Dominaram a técnica especial da família", icon: "🎯", correctOrder: 6 }, { id: 7, text: "Prometeram passar tradição adiante", icon: "🔄", correctOrder: 7 } ], completionMessage: "Tradicional! Memórias familiares são tesouros!", hint: "História → fascínio → pedido → prática → erros → domínio → continuidade", skills: ["Valorização Familiar", "Preservação Cultural", "Paciência", "Transmissão de Saberes"] },
  { id: 'cultural_10', title: 'Justiça Restaurativa', category: 'Narrativas Culturais', narrator: 'Mila', complexity: 'ethical', elements: [ { id: 1, text: "Rafael presenciou uma injustiça na escola", icon: "⚖️", correctOrder: 1 }, { id: 2, text: "Sentiu indignação com a situação", icon: "😠", correctOrder: 2 }, { id: 3, text: "Reuniu evidências do que aconteceu", icon: "📸", correctOrder: 3 }, { id: 4, text: "Falou com a direção da escola", icon: "🏫", correctOrder: 4 }, { id: 5, text: "Mediou conversa entre os envolvidos", icon: "🗣️", correctOrder: 5 }, { id: 6, text: "Viu a reparação do erro acontecer", icon: "🤝", correctOrder: 6 }, { id: 7, text: "Aprendeu sobre justiça e perdão", icon: "⚖️", correctOrder: 7 } ], completionMessage: "Justo! Coragem para fazer o certo transforma!", hint: "Testemunho → indignação → documentação → denúncia → mediação → reparação → aprendizado", skills: ["Senso de Justiça", "Coragem Moral", "Mediação", "Ética"] }
];

export default function AdvancedLevel() {
  const router = useRouter();
  
  // Estados para gerenciar o jogo
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [shuffledElements, setShuffledElements] = useState<StoryElement[]>([]);
  const [userSequence, setUserSequence] = useState<StoryElement[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [stars, setStars] = useState(0);

  const currentStory = advancedStories[currentStoryIndex];

  useEffect(() => {
    resetActivity();
  }, [currentStoryIndex]);

  const handleSelectElement = (elementToMove: StoryElement) => {
    setShuffledElements(prev => prev.filter(element => element.id !== elementToMove.id));
    setUserSequence(prev => [...prev, elementToMove]);
  };
  
  const handleDeselectElement = (elementToMove: StoryElement) => {
    setUserSequence(prev => prev.filter(element => element.id !== elementToMove.id));
    setShuffledElements(prev => [...prev, elementToMove].sort((a, b) => a.id - b.id));
  };

  const checkSequence = () => {
    if (userSequence.length !== currentStory.elements.length) return;
    const isCorrect = userSequence.every((element, index) => element.correctOrder === index + 1);
    setShowFeedback(true);
    if (isCorrect) {
      setStars(3);
      setTotalScore(prev => prev + 200); // Pontuação máxima
      if (!completedStories.includes(currentStory.id)) {
        setCompletedStories(prev => [...prev, currentStory.id]);
      }
    } else {
      setStars(0);
    }
  };

  const resetActivity = () => {
    setUserSequence([]);
    setShuffledElements([...currentStory.elements].sort(() => Math.random() - 0.5));
    setShowFeedback(false);
    setStars(0);
  };
  
  const nextStory = () => {
    if (currentStoryIndex < advancedStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    }
  };

  const progressPercentage = (completedStories.length / advancedStories.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                  <button onClick={() => router.push('/sequential-narrative')} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"><Home className="w-5 h-5 mr-2" /> Menu</button>
                  <div className="text-center flex-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Nível Avançado</h1>
                      <p className="text-sm text-gray-600 mt-1">História {currentStoryIndex + 1} de {advancedStories.length}</p>
                  </div>
                  <div className="flex items-center gap-1"><Trophy className="w-5 h-5 text-yellow-500" /> <span className="font-bold text-lg">{totalScore}</span></div>
              </div>
              <div className="mt-4"><div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"><div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🧩 Partes da História</h3>
                  <div className="space-y-3">
                      {shuffledElements.map(element => (<button key={element.id} onClick={() => handleSelectElement(element)} className="w-full text-left bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-3 shadow hover:shadow-md hover:scale-[1.03] transition-all transform"><div className="flex items-center"><span className="text-3xl mx-2">{element.icon}</span><p className="text-gray-800 flex-1">{element.text}</p></div></button>))}
                      {shuffledElements.length === 0 && (<div className="text-center py-16 text-gray-400"><p className="text-lg">Todas as partes foram movidas!</p></div>)}
                  </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📖 Monte a História na Ordem</h3>
                  <div className="min-h-[250px] border-3 border-dashed border-purple-300 rounded-lg p-4 space-y-3 bg-purple-50/30">
                       {userSequence.map((element, index) => (<button key={element.id} onClick={() => handleDeselectElement(element)} className="w-full text-left bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-lg p-3 shadow hover:shadow-md hover:scale-[1.03] transition-all transform"><div className="flex items-center"><div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mr-3 text-md font-bold shadow-md">{index + 1}°</div><span className="text-3xl mx-2">{element.icon}</span><p className="text-gray-800 flex-1 font-medium">{element.text}</p></div></button>))}
                      {userSequence.length === 0 && (<div className="text-center flex items-center justify-center h-full text-gray-400"><p className="text-lg">Clique nas partes para adicioná-las aqui na ordem certa.</p></div>)}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-6">
                      <button onClick={checkSequence} disabled={shuffledElements.length > 0 || showFeedback} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all transform ${shuffledElements.length === 0 && !showFeedback ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Verificar História</button>
                      <button onClick={resetActivity} className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Recomeçar</button>
                  </div>
              </div>
          </div>
          {showFeedback && (
              <div className={`mt-6 rounded-xl border-2 p-6 ${stars > 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center justify-between">
                      <div><h3 className={`text-2xl font-bold ${stars > 0 ? 'text-green-600' : 'text-red-600'}`}>{stars > 0 ? '🎉 Parabéns!' : '💪 Quase lá!'}</h3><p>{stars > 0 ? currentStory.completionMessage : 'A ordem não está certa. Tente de novo!'}</p></div>
                      {stars > 0 && currentStoryIndex < advancedStories.length - 1 && (<button onClick={nextStory} className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold shadow-lg hover:bg-green-600 flex items-center gap-2">Próxima História <ChevronRight/></button>)}
                      {stars > 0 && completedStories.length === advancedStories.length && (<button onClick={() => router.push('/sequential-narrative')} className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold shadow-lg hover:bg-blue-600 flex items-center gap-2">Voltar ao Menu Principal <Home/></button>)}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
