'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Heart, Sparkles, ChevronRight, RotateCcw, Home, Brain, Shield, Globe, Award } from 'lucide-react';

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

// 20 HISTÓRIAS DO NÍVEL AVANÇADO
const advancedStories: Story[] = [
  // JORNADAS EMOCIONAIS COMPLEXAS (10 histórias)
  {
    id: 'emotional_1',
    title: 'Mudança de Escola',
    category: 'Jornadas Emocionais',
    narrator: 'Leo',
    complexity: 'emotional',
    elements: [
      { id: 1, text: "Lucas recebeu a notícia de que mudaria de cidade", icon: "📦", correctOrder: 1 },
      { id: 2, text: "Sentiu tristeza profunda ao pensar em deixar os amigos", icon: "😢", correctOrder: 2 },
      { id: 3, text: "Despediu-se de cada amigo com um abraço especial", icon: "🤗", correctOrder: 3 },
      { id: 4, text: "Chegou na escola nova sentindo-se muito nervoso", icon: "😰", correctOrder: 4 },
      { id: 5, text: "Um colega sorriu e ofereceu ajuda com a escola", icon: "😊", correctOrder: 5 },
      { id: 6, text: "Lucas fez o primeiro amigo no novo lugar", icon: "🤝", correctOrder: 6 },
      { id: 7, text: "Percebeu que mudanças trazem novas oportunidades", icon: "🌟", correctOrder: 7 }
    ],
    completionMessage: "Incrível! Você compreendeu a jornada completa de adaptação!",
    hint: "Notícia → tristeza → despedida → chegada → nervosismo → acolhimento → aprendizado",
    skills: ["Resiliência Emocional", "Adaptação", "Abertura ao Novo", "Processamento de Perdas"]
  },
  {
    id: 'emotional_2',
    title: 'Competição Esportiva',
    category: 'Jornadas Emocionais',
    narrator: 'Mila',
    complexity: 'emotional',
    elements: [
      { id: 1, text: "Maria treinou natação todos os dias por meses", icon: "🏊", correctOrder: 1 },
      { id: 2, text: "Acordou no dia da competição com borboletas no estômago", icon: "🦋", correctOrder: 2 },
      { id: 3, text: "Fez aquecimento respirando fundo para se concentrar", icon: "💨", correctOrder: 3 },
      { id: 4, text: "Nadou com toda força ouvindo a torcida", icon: "💪", correctOrder: 4 },
      { id: 5, text: "Cruzou a linha em segundo lugar", icon: "🥈", correctOrder: 5 },
      { id: 6, text: "Sentiu orgulho por superar seu tempo pessoal", icon: "⏱️", correctOrder: 6 },
      { id: 7, text: "Celebrou com a equipe valorizando o esforço de todos", icon: "🎉", correctOrder: 7 }
    ],
    completionMessage: "Excelente! Você entendeu que vitória vai além do primeiro lugar!",
    hint: "Preparação → ansiedade → concentração → esforço → resultado → reflexão → celebração",
    skills: ["Disciplina", "Gestão de Ansiedade", "Autoconhecimento", "Espírito de Equipe"]
  },
  {
    id: 'emotional_3',
    title: 'Cuidando do Irmãozinho',
    category: 'Jornadas Emocionais',
    narrator: 'Leo',
    complexity: 'emotional',
    elements: [
      { id: 1, text: "O bebê chegou em casa e todos estavam felizes", icon: "👶", correctOrder: 1 },
      { id: 2, text: "Pedro sentiu ciúmes quando todos davam atenção ao bebê", icon: "😤", correctOrder: 2 },
      { id: 3, text: "Mamãe pediu ajuda para cuidar do irmãozinho", icon: "🤱", correctOrder: 3 },
      { id: 4, text: "Pedro segurou o bebê com muito cuidado", icon: "🤲", correctOrder: 4 },
      { id: 5, text: "O bebê sorriu pela primeira vez para Pedro", icon: "😄", correctOrder: 5 },
      { id: 6, text: "Sentiu amor crescer no coração", icon: "💕", correctOrder: 6 },
      { id: 7, text: "Virou o melhor irmão mais velho protetor", icon: "🦸", correctOrder: 7 }
    ],
    completionMessage: "Lindo! Você compreendeu a transformação do ciúme em amor!",
    hint: "Chegada → ciúme → responsabilidade → cuidado → conexão → amor → proteção",
    skills: ["Processamento de Emoções", "Responsabilidade", "Amor Fraternal", "Maturidade"]
  },
  {
    id: 'emotional_4',
    title: 'Projeto Escolar Desafiador',
    category: 'Jornadas Emocionais',
    narrator: 'Mila',
    complexity: 'emotional',
    elements: [
      { id: 1, text: "Ana recebeu um projeto de ciências muito difícil", icon: "🔬", correctOrder: 1 },
      { id: 2, text: "Pesquisou na biblioteca por horas sem entender", icon: "📚", correctOrder: 2 },
      { id: 3, text: "Encontrou problemas com o experimento inicial", icon: "⚠️", correctOrder: 3 },
      { id: 4, text: "Pediu ajuda ao professor que explicou pacientemente", icon: "👨‍🏫", correctOrder: 4 },
      { id: 5, text: "Trabalhou com dedicação refazendo tudo", icon: "✍️", correctOrder: 5 },
      { id: 6, text: "Apresentou o projeto para toda a turma", icon: "🎤", correctOrder: 6 },
      { id: 7, text: "Recebeu aplausos e aprendeu sobre perseverança", icon: "👏", correctOrder: 7 }
    ],
    completionMessage: "Brilhante! Perseverança transforma desafios em conquistas!",
    hint: "Desafio → confusão → erro → busca de ajuda → dedicação → apresentação → reconhecimento",
    skills: ["Perseverança", "Busca de Conhecimento", "Humildade", "Comunicação"]
  },
  {
    id: 'emotional_5',
    title: 'Salvando um Animal',
    category: 'Jornadas Emocionais',
    narrator: 'Leo',
    complexity: 'emotional',
    elements: [
      { id: 1, text: "João encontrou um passarinho caído do ninho", icon: "🐦", correctOrder: 1 },
      { id: 2, text: "Sentiu preocupação ao ver a asa machucada", icon: "😟", correctOrder: 2 },
      { id: 3, text: "Fez um ninho improvisado numa caixa de sapatos", icon: "📦", correctOrder: 3 },
      { id: 4, text: "Deu água e comida com muito cuidado", icon: "💧", correctOrder: 4 },
      { id: 5, text: "Cuidou do passarinho por vários dias", icon: "🗓️", correctOrder: 5 },
      { id: 6, text: "Viu o passarinho melhorar e bater as asas", icon: "🪶", correctOrder: 6 },
      { id: 7, text: "Soltou o pássaro que voou livre e feliz", icon: "🕊️", correctOrder: 7 }
    ],
    completionMessage: "Maravilhoso! Cuidar e libertar é o verdadeiro amor!",
    hint: "Encontro → preocupação → abrigo → cuidado → dedicação → recuperação → liberdade",
    skills: ["Compaixão", "Responsabilidade", "Paciência", "Desprendimento"]
  },
  {
    id: 'emotional_6',
    title: 'Superando o Bullying',
    category: 'Jornadas Emocionais',
    narrator: 'Mila',
    complexity: 'emotional',
    elements: [
      { id: 1, text: "Carlos sofria provocações diárias na escola", icon: "😔", correctOrder: 1 },
      { id: 2, text: "Sentiu-se cada vez mais triste e isolado", icon: "💔", correctOrder: 2 },
      { id: 3, text: "Conversou com um adulto de confiança", icon: "🗣️", correctOrder: 3 },
      { id: 4, text: "Aprendeu estratégias para se defender sem violência", icon: "🛡️", correctOrder: 4 },
      { id: 5, text: "Confrontou os agressores com calma e firmeza", icon: "💪", correctOrder: 5 },
      { id: 6, text: "Os provocadores pararam ao ver sua confiança", icon: "✋", correctOrder: 6 },
      { id: 7, text: "Carlos recuperou sua autoestima e fez novos amigos", icon: "🌈", correctOrder: 7 }
    ],
    completionMessage: "Corajoso! Força interior vence qualquer intimidação!",
    hint: "Sofrimento → isolamento → busca de apoio → aprendizado → confronto → mudança → recuperação",
    skills: ["Coragem", "Comunicação Assertiva", "Resiliência", "Autoestima"]
  },
  {
    id: 'emotional_7',
    title: 'Descobrindo um Talento',
    category: 'Jornadas Emocionais',
    narrator: 'Leo',
    complexity: 'emotional',
    elements: [
      { id: 1, text: "Sofia tentou tocar violão pela primeira vez", icon: "🎸", correctOrder: 1 },
      { id: 2, text: "Falhou muitas vezes e ficou frustrada", icon: "😫", correctOrder: 2 },
      { id: 3, text: "Quase desistiu pensando que não tinha talento", icon: "🚫", correctOrder: 3 },
      { id: 4, text: "O professor incentivou dizendo que todos começam assim", icon: "👨‍🏫", correctOrder: 4 },
      { id: 5, text: "Praticou todos os dias com determinação", icon: "📅", correctOrder: 5 },
      { id: 6, text: "Melhorou gradualmente dominando as notas", icon: "🎵", correctOrder: 6 },
      { id: 7, text: "Apresentou uma música no show da escola", icon: "🎤", correctOrder: 7 }
    ],
    completionMessage: "Inspirador! Talento nasce da prática e persistência!",
    hint: "Tentativa → fracasso → frustração → encorajamento → prática → progresso → realização",
    skills: ["Determinação", "Superação", "Disciplina", "Autoconfiança"]
  },
  {
    id: 'emotional_8',
    title: 'Amizade Testada',
    category: 'Jornadas Emocionais',
    narrator: 'Mila',
    complexity: 'emotional',
    elements: [
      { id: 1, text: "Júlia contou um segredo importante para Laura", icon: "🤫", correctOrder: 1 },
      { id: 2, text: "Outros colegas pediram insistentemente para Laura contar", icon: "👥", correctOrder: 2 },
      { id: 3, text: "Laura sentiu pressão enorme do grupo", icon: "😣", correctOrder: 3 },
      { id: 4, text: "Decidiu ser leal e não revelar o segredo", icon: "🤐", correctOrder: 4 },
      { id: 5, text: "Júlia descobriu sobre a pressão que Laura sofreu", icon: "👂", correctOrder: 5 },
      { id: 6, text: "Agradeceu emocionada pela lealdade da amiga", icon: "🙏", correctOrder: 6 },
      { id: 7, text: "A amizade delas ficou ainda mais forte", icon: "💝", correctOrder: 7 }
    ],
    completionMessage: "Admirável! Lealdade verdadeira constrói amizades eternas!",
    hint: "Confiança → pressão → dilema → decisão → descoberta → gratidão → fortalecimento",
    skills: ["Lealdade", "Integridade", "Resistência à Pressão", "Amizade Verdadeira"]
  },
  {
    id: 'emotional_9',
    title: 'Medo Superado',
    category: 'Jornadas Emocionais',
    narrator: 'Leo',
    complexity: 'emotional',
    elements: [
      { id: 1, text: "Daniel tinha pavor de altura desde pequeno", icon: "😨", correctOrder: 1 },
      { id: 2, text: "Evitou lugares altos por muitos anos", icon: "🚫", correctOrder: 2 },
      { id: 3, text: "Decidiu enfrentar o medo para ajudar o gatinho", icon: "🐱", correctOrder: 3 },
      { id: 4, text: "Preparou-se mentalmente respirando profundamente", icon: "🧘", correctOrder: 4 },
      { id: 5, text: "Subiu na árvore tremendo mas determinado", icon: "🌳", correctOrder: 5 },
      { id: 6, text: "Conseguiu resgatar o gatinho assustado", icon: "✨", correctOrder: 6 },
      { id: 7, text: "Celebrou a conquista sobre seu maior medo", icon: "🏆", correctOrder: 7 }
    ],
    completionMessage: "Heroico! Coragem é agir apesar do medo!",
    hint: "Medo → evitação → motivação → preparação → ação → sucesso → celebração",
    skills: ["Coragem", "Superação de Medos", "Altruísmo", "Força Mental"]
  },
  {
    id: 'emotional_10',
    title: 'Perdão Difícil',
    category: 'Jornadas Emocionais',
    narrator: 'Mila',
    complexity: 'emotional',
    elements: [
      { id: 1, text: "Marcos quebrou o brinquedo favorito de Paulo", icon: "💔", correctOrder: 1 },
      { id: 2, text: "Paulo ficou muito magoado e parou de falar com Marcos", icon: "😠", correctOrder: 2 },
      { id: 3, text: "Passou dias sentindo raiva e tristeza", icon: "😔", correctOrder: 3 },
      { id: 4, text: "Marcos pediu perdão sinceramente várias vezes", icon: "🙏", correctOrder: 4 },
      { id: 5, text: "Paulo lutou internamente entre perdoar ou não", icon: "💭", correctOrder: 5 },
      { id: 6, text: "Escolheu perdoar porque valorizava a amizade", icon: "💚", correctOrder: 6 },
      { id: 7, text: "A amizade renasceu mais forte e madura", icon: "🌱", correctOrder: 7 }
    ],
    completionMessage: "Nobre! Perdoar liberta e fortalece relações!",
    hint: "Mágoa → raiva → tempo → arrependimento → conflito interno → perdão → renovação",
    skills: ["Perdão", "Maturidade Emocional", "Compaixão", "Valorização de Relações"]
  },

  // NARRATIVAS CULTURAIS E VALORES (10 histórias)
  {
    id: 'cultural_1',
    title: 'Festival das Culturas',
    category: 'Narrativas Culturais',
    narrator: 'Leo',
    complexity: 'cultural',
    elements: [
      { id: 1, text: "A escola anunciou o Festival Multicultural", icon: "🌍", correctOrder: 1 },
      { id: 2, text: "Cada aluno pesquisou sobre suas origens familiares", icon: "🔍", correctOrder: 2 },
      { id: 3, text: "Prepararam apresentações com roupas tradicionais", icon: "👘", correctOrder: 3 },
      { id: 4, text: "Ensaiaram danças e músicas de cada cultura", icon: "💃", correctOrder: 4 },
      { id: 5, text: "Vestiram trajes coloridos no dia do festival", icon: "🎭", correctOrder: 5 },
      { id: 6, text: "Apresentaram com orgulho suas heranças culturais", icon: "🎤", correctOrder: 6 },
      { id: 7, text: "Aprenderam a valorizar a diversidade humana", icon: "🤝", correctOrder: 7 }
    ],
    completionMessage: "Magnífico! Diversidade cultural enriquece a todos!",
    hint: "Anúncio → pesquisa → preparação → ensaio → apresentação → orgulho → aprendizado",
    skills: ["Consciência Cultural", "Respeito à Diversidade", "Orgulho das Origens", "Aprendizado Intercultural"]
  },
  {
    id: 'cultural_2',
    title: 'Ação Voluntária',
    category: 'Narrativas Culturais',
    narrator: 'Mila',
    complexity: 'social',
    elements: [
      { id: 1, text: "As crianças viram pessoas necessitadas na comunidade", icon: "👨‍👩‍👧", correctOrder: 1 },
      { id: 2, text: "Sentiram vontade genuína de ajudar", icon: "💗", correctOrder: 2 },
      { id: 3, text: "Organizaram uma campanha de arrecadação", icon: "📦", correctOrder: 3 },
      { id: 4, text: "Mobilizaram toda a escola para participar", icon: "🏫", correctOrder: 4 },
      { id: 5, text: "Coletaram alimentos, roupas e brinquedos", icon: "🎁", correctOrder: 5 },
      { id: 6, text: "Entregaram pessoalmente com carinho", icon: "🤲", correctOrder: 6 },
      { id: 7, text: "Sentiram a felicidade de fazer a diferença", icon: "✨", correctOrder: 7 }
    ],
    completionMessage: "Inspirador! Solidariedade transforma o mundo!",
    hint: "Observação → empatia → planejamento → mobilização → coleta → entrega → realização",
    skills: ["Solidariedade", "Liderança Social", "Empatia Ativa", "Responsabilidade Social"]
  },
  {
    id: 'cultural_3',
    title: 'Descoberta Científica',
    category: 'Narrativas Culturais',
    narrator: 'Leo',
    complexity: 'cultural',
    elements: [
      { id: 1, text: "Nina observou formigas carregando folhas", icon: "🐜", correctOrder: 1 },
      { id: 2, text: "Fez perguntas sobre o comportamento delas", icon: "❓", correctOrder: 2 },
      { id: 3, text: "Criou hipótese sobre trabalho em equipe", icon: "💡", correctOrder: 3 },
      { id: 4, text: "Montou experimento com diferentes obstáculos", icon: "🔬", correctOrder: 4 },
      { id: 5, text: "Anotou observações por vários dias", icon: "📝", correctOrder: 5 },
      { id: 6, text: "Tirou conclusões sobre cooperação", icon: "📊", correctOrder: 6 },
      { id: 7, text: "Compartilhou descoberta na feira de ciências", icon: "🏆", correctOrder: 7 }
    ],
    completionMessage: "Científico! Curiosidade leva a grandes descobertas!",
    hint: "Observação → questionamento → hipótese → experimento → registro → conclusão → compartilhamento",
    skills: ["Método Científico", "Observação", "Pensamento Crítico", "Comunicação Científica"]
  },
  {
    id: 'cultural_4',
    title: 'Dilema da Honestidade',
    category: 'Narrativas Culturais',
    narrator: 'Mila',
    complexity: 'ethical',
    elements: [
      { id: 1, text: "Felipe encontrou uma carteira com muito dinheiro", icon: "💰", correctOrder: 1 },
      { id: 2, text: "Pensou por um momento em ficar com ela", icon: "🤔", correctOrder: 2 },
      { id: 3, text: "Lembrou dos valores que aprendeu em casa", icon: "🏠", correctOrder: 3 },
      { id: 4, text: "Procurou identificação do dono na carteira", icon: "🔍", correctOrder: 4 },
      { id: 5, text: "Encontrou o dono que estava desesperado", icon: "😰", correctOrder: 5 },
      { id: 6, text: "Devolveu tudo e recebeu gratidão sincera", icon: "🙏", correctOrder: 6 },
      { id: 7, text: "Sentiu-se íntegro e em paz consigo", icon: "😇", correctOrder: 7 }
    ],
    completionMessage: "Íntegro! Honestidade é a base do caráter!",
    hint: "Descoberta → tentação → reflexão → investigação → encontro → devolução → paz interior",
    skills: ["Honestidade", "Integridade", "Valores Éticos", "Consciência Moral"]
  },
  {
    id: 'cultural_5',
    title: 'Intercâmbio Cultural',
    category: 'Narrativas Culturais',
    narrator: 'Leo',
    complexity: 'cultural',
    elements: [
      { id: 1, text: "A escola recebeu um estudante do Japão", icon: "🇯🇵", correctOrder: 1 },
      { id: 2, text: "As crianças sentiram curiosidade sobre sua cultura", icon: "🤓", correctOrder: 2 },
      { id: 3, text: "Mostraram a cultura brasileira com alegria", icon: "🇧🇷", correctOrder: 3 },
      { id: 4, text: "Aprenderam palavras em japonês", icon: "🗾", correctOrder: 4 },
      { id: 5, text: "Criaram laços através de jogos e brincadeiras", icon: "🎮", correctOrder: 5 },
      { id: 6, text: "Choraram juntos na despedida emocionante", icon: "😢", correctOrder: 6 },
      { id: 7, text: "Prometeram manter contato para sempre", icon: "💌", correctOrder: 7 }
    ],
    completionMessage: "Global! Amizades transcendem fronteiras!",
    hint: "Chegada → curiosidade → troca → aprendizado → conexão → despedida → continuidade",
    skills: ["Interculturalidade", "Comunicação Global", "Abertura Cultural", "Amizade Internacional"]
  },
  {
    id: 'cultural_6',
    title: 'Pequeno Empreendedor',
    category: 'Narrativas Culturais',
    narrator: 'Mila',
    complexity: 'social',
    elements: [
      { id: 1, text: "Tomás teve ideia de vender limonada", icon: "🍋", correctOrder: 1 },
      { id: 2, text: "Planejou custos e preços cuidadosamente", icon: "📈", correctOrder: 2 },
      { id: 3, text: "Pediu permissão aos pais e apoio", icon: "👨‍👩‍👦", correctOrder: 3 },
      { id: 4, text: "Preparou limonada fresca e saborosa", icon: "🥤", correctOrder: 4 },
      { id: 5, text: "Montou barraquinha colorida na calçada", icon: "🏪", correctOrder: 5 },
      { id: 6, text: "Atendeu clientes com simpatia", icon: "😊", correctOrder: 6 },
      { id: 7, text: "Contou lucro orgulhoso do trabalho", icon: "💵", correctOrder: 7 }
    ],
    completionMessage: "Empreendedor! Iniciativa e trabalho geram resultados!",
    hint: "Ideia → planejamento → autorização → produção → montagem → vendas → resultado",
    skills: ["Empreendedorismo", "Planejamento", "Responsabilidade Financeira", "Atendimento"]
  },
  {
    id: 'cultural_7',
    title: 'Proteção Ambiental',
    category: 'Narrativas Culturais',
    narrator: 'Leo',
    complexity: 'social',
    elements: [
      { id: 1, text: "As crianças notaram lixo no parque", icon: "🗑️", correctOrder: 1 },
      { id: 2, text: "Ficaram indignadas com a poluição", icon: "😤", correctOrder: 2 },
      { id: 3, text: "Reuniram amigos para limpar juntos", icon: "👥", correctOrder: 3 },
      { id: 4, text: "Criaram campanha de conscientização", icon: "📢", correctOrder: 4 },
      { id: 5, text: "Limparam toda área com determinação", icon: "🧹", correctOrder: 5 },
      { id: 6, text: "Viram a diferença no ambiente limpo", icon: "🌳", correctOrder: 6 },
      { id: 7, text: "Inspiraram toda comunidade a cuidar", icon: "🌍", correctOrder: 7 }
    ],
    completionMessage: "Ecológico! Pequenas ações salvam o planeta!",
    hint: "Problema → indignação → mobilização → campanha → ação → resultado → inspiração",
    skills: ["Consciência Ambiental", "Ativismo", "Trabalho Comunitário", "Liderança Verde"]
  },
  {
    id: 'cultural_8',
    title: 'Inclusão na Prática',
    category: 'Narrativas Culturais',
    narrator: 'Mila',
    complexity: 'social',
    elements: [
      { id: 1, text: "Conheceram um colega com necessidades especiais", icon: "♿", correctOrder: 1 },
      { id: 2, text: "Notaram suas dificuldades em participar", icon: "🤔", correctOrder: 2 },
      { id: 3, text: "Pensaram em formas de incluir nas atividades", icon: "💭", correctOrder: 3 },
      { id: 4, text: "Adaptaram brincadeiras para todos jogarem", icon: "🎯", correctOrder: 4 },
      { id: 5, text: "Incluíram o colega em todas atividades", icon: "🤝", correctOrder: 5 },
      { id: 6, text: "Viram sua alegria em participar", icon: "😊", correctOrder: 6 },
      { id: 7, text: "Aprenderam que diferenças enriquecem", icon: "🌈", correctOrder: 7 }
    ],
    completionMessage: "Inclusivo! Todos merecem pertencer!",
    hint: "Encontro → observação → reflexão → adaptação → inclusão → alegria → aprendizado",
    skills: ["Inclusão", "Empatia", "Criatividade Social", "Respeito às Diferenças"]
  },
  {
    id: 'cultural_9',
    title: 'Tradição Familiar',
    category: 'Narrativas Culturais',
    narrator: 'Leo',
    complexity: 'cultural',
    elements: [
      { id: 1, text: "Vovó contou história antiga da família", icon: "👵", correctOrder: 1 },
      { id: 2, text: "As crianças ficaram fascinadas com o passado", icon: "✨", correctOrder: 2 },
      { id: 3, text: "Pediram para aprender a receita secreta", icon: "📖", correctOrder: 3 },
      { id: 4, text: "Praticaram com vovó várias vezes", icon: "👩‍🍳", correctOrder: 4 },
      { id: 5, text: "Erraram algumas tentativas rindo juntos", icon: "😄", correctOrder: 5 },
      { id: 6, text: "Dominaram a técnica especial da família", icon: "🎯", correctOrder: 6 },
      { id: 7, text: "Prometeram passar tradição adiante", icon: "🔄", correctOrder: 7 }
    ],
    completionMessage: "Tradicional! Memórias familiares são tesouros!",
    hint: "História → fascínio → pedido → prática → erros → domínio → continuidade",
    skills: ["Valorização Familiar", "Preservação Cultural", "Paciência", "Transmissão de Saberes"]
  },
  {
    id: 'cultural_10',
    title: 'Justiça Restaurativa',
    category: 'Narrativas Culturais',
    narrator: 'Mila',
    complexity: 'ethical',
    elements: [
      { id: 1, text: "Rafael presenciou uma injustiça na escola", icon: "⚖️", correctOrder: 1 },
      { id: 2, text: "Sentiu indignação com a situação", icon: "😠", correctOrder: 2 },
      { id: 3, text: "Reuniu evidências do que aconteceu", icon: "📸", correctOrder: 3 },
      { id: 4, text: "Falou com a direção da escola", icon: "🏫", correctOrder: 4 },
      { id: 5, text: "Mediou conversa entre os envolvidos", icon: "🗣️", correctOrder: 5 },
      { id: 6, text: "Viu a reparação do erro acontecer", icon: "🤝", correctOrder: 6 },
      { id: 7, text: "Aprendeu sobre justiça e perdão", icon: "⚖️", correctOrder: 7 }
    ],
    completionMessage: "Justo! Coragem para fazer o certo transforma!",
    hint: "Testemunho → indignação → documentação → denúncia → mediação → reparação → aprendizado",
    skills: ["Senso de Justiça", "Coragem Moral", "Mediação", "Ética"]
  }
];

export default function AdvancedLevel() {
  const router = useRouter();
  
  // Estados principais
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [shuffledElements, setShuffledElements] = useState<StoryElement[]>([]);
  const [userSequence, setUserSequence] = useState<StoryElement[]>([]);
  const [draggedItem, setDraggedItem] = useState<StoryElement | null>(null);
  
  // Estados de gamificação
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [stars, setStars] = useState(0);

  // História atual
  const currentStory = advancedStories[currentStoryIndex];

  // Ícone da complexidade
  const getComplexityIcon = (complexity: string) => {
    switch(complexity) {
      case 'emotional': return <Heart className="w-5 h-5 text-red-500" />;
      case 'social': return <Globe className="w-5 h-5 text-blue-500" />;
      case 'cultural': return <Brain className="w-5 h-5 text-purple-500" />;
      case 'ethical': return <Shield className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  useEffect(() => {
    // Embaralhar elementos da história atual
    const shuffled = [...currentStory.elements].sort(() => Math.random() - 0.5);
    setShuffledElements(shuffled);
    setUserSequence([]);
    setShowFeedback(false);
    setScore(0);
    setAttempts(0);
    setShowHint(false);
    setShowCompletionModal(false);
  }, [currentStoryIndex]);

  const handleDragStart = (element: StoryElement) => {
    setDraggedItem(element);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      const newSequence = [...userSequence, draggedItem];
      setUserSequence(newSequence);
      setShuffledElements(prev => prev.filter(item => item.id !== draggedItem.id));
      setDraggedItem(null);
    }
  };

  const removeFromSequence = (elementToRemove: StoryElement) => {
    setUserSequence(prev => prev.filter(item => item.id !== elementToRemove.id));
    setShuffledElements(prev => [...prev, elementToRemove]);
  };

  const checkSequence = () => {
    if (userSequence.length !== 7) {
      alert('Por favor, organize todos os 7 elementos da história!');
      return;
    }

    setAttempts(prev => prev + 1);
    
    // Verificar sequência
    const isCorrect = userSequence.every((element, index) => 
      element.correctOrder === index + 1
    );

    if (isCorrect) {
      // Cálculo de estrelas
      let earnedStars = 3;
      if (attempts > 0) earnedStars = 2;
      if (attempts > 1) earnedStars = 1;
      
      setStars(earnedStars);
      setScore(100);
      setCurrentStreak(prev => prev + 1);
      setTotalScore(prev => prev + (100 * earnedStars));
      
      // Adicionar à lista de completas
      if (!completedStories.includes(currentStory.id)) {
        setCompletedStories(prev => [...prev, currentStory.id]);
      }

      // Mostrar modal se completou todas as histórias
      if (completedStories.length === advancedStories.length - 1) {
        setTimeout(() => setShowCompletionModal(true), 2000);
      }
    } else {
      setScore(0);
      setCurrentStreak(0);
      setStars(0);
    }
    
    setShowFeedback(true);
  };

  const nextStory = () => {
    if (currentStoryIndex < advancedStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    }
  };

  const resetActivity = () => {
    const shuffled = [...currentStory.elements].sort(() => Math.random() - 0.5);
    setShuffledElements(shuffled);
    setUserSequence([]);
    setShowFeedback(false);
    setScore(0);
    setAttempts(0);
    setShowHint(false);
  };

  // Cálculo de progresso
  const progressPercentage = (completedStories.length / advancedStories.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com Progresso */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => router.push('/sequential-narrative')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Menu
            </button>
            
            <div className="text-center flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Nível Avançado
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                História {currentStoryIndex + 1} de {advancedStories.length}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-lg">{totalScore}</span>
                </div>
                <div className="text-xs text-gray-600">Pontos totais</div>
              </div>
              
              {currentStreak > 0 && (
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="font-bold text-lg">{currentStreak}</span>
                  </div>
                  <div className="text-xs text-gray-600">Sequência</div>
                </div>
              )}
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progresso Total</span>
              <span>{completedStories.length}/{advancedStories.length} histórias</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500 flex items-center justify-center"
                style={{ width: `${progressPercentage}%` }}
              >
                {progressPercentage > 10 && (
                  <span className="text-white text-xs font-bold">
                    {Math.round(progressPercentage)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info da História Atual */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                  ${currentStory.narrator === 'Leo' ? 'bg-blue-100' : 'bg-pink-100'}`}>
                  {currentStory.narrator === 'Leo' ? '🦁' : '🦄'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{currentStory.title}</h2>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    {getComplexityIcon(currentStory.complexity)}
                    {currentStory.category} • Narrado por {currentStory.narrator}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors flex items-center gap-2"
            >
              💡 Dica Avançada
            </button>
          </div>

          {showHint && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-yellow-800">{currentStory.hint}</p>
            </div>
          )}

          {/* Habilidades Desenvolvidas */}
          <div className="mt-4 flex flex-wrap gap-2">
            {currentStory.skills.map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Elementos Disponíveis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🧩</span>
              Elementos Complexos (7 partes)
            </h3>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {shuffledElements.map((element) => (
                <div
                  key={element.id}
                  draggable
                  onDragStart={() => handleDragStart(element)}
                  className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-3 cursor-move hover:shadow-md transition-all transform hover:scale-[1.02]"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{element.icon}</span>
                    <p className="text-gray-800 flex-1 text-xs sm:text-sm">{element.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {shuffledElements.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                <p>Todos elementos organizados!</p>
              </div>
            )}
          </div>

          {/* Área de Sequência */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📖</span>
              Narrativa Complexa (7 etapas)
            </h3>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="min-h-[500px] max-h-[500px] overflow-y-auto border-3 border-dashed border-purple-300 rounded-lg p-3 space-y-2 bg-purple-50/30"
            >
              {userSequence.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <div className="text-5xl mb-3">🎯</div>
                  <p className="text-lg">Arraste os 7 elementos aqui</p>
                  <p className="text-xs mt-2">Narrativa completa com múltiplas perspectivas</p>
                </div>
              )}

              {userSequence.map((element, index) => (
                <div
                  key={element.id}
                  className="bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 rounded-lg p-2 relative transform transition-all hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center mr-2 text-xs font-bold shadow-md">
                      {index + 1}
                    </div>
                    <span className="text-lg mr-2">{element.icon}</span>
                    <p className="text-gray-800 flex-1 text-xs sm:text-sm font-medium">{element.text}</p>
                    <button
                      onClick={() => removeFromSequence(element)}
                      className="text-red-500 hover:text-red-700 text-xl ml-2 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={checkSequence}
                disabled={userSequence.length !== 7}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all transform ${
                  userSequence.length === 7
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Verificar Narrativa
              </button>
              
              <button
                onClick={resetActivity}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Recomeçar
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Avançado */}
        {showFeedback && (
          <div className={`mt-6 rounded-xl border-2 p-6 ${
            score === 100 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
              : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={`text-2xl font-bold mb-2 ${
                  score === 100 ? 'text-green-600' : 'text-purple-600'
                }`}>
                  {score === 100 ? '🎉 Narrativa Perfeita!' : '💫 Continue Tentando!'}
                </h3>
                <p className={`text-lg ${score === 100 ? 'text-green-700' : 'text-purple-700'}`}>
                  {score === 100 
                    ? currentStory.completionMessage
                    : 'Narrativas complexas exigem atenção aos detalhes emocionais!'
                  }
                </p>
                
                {score === 100 && (
                  <>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-gray-600">Você ganhou:</span>
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`w-8 h-8 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white/50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">🎯 Habilidades Masterizadas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentStory.skills.map((skill, index) => (
                          <span key={index} className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {score === 100 && currentStoryIndex < advancedStories.length - 1 && (
                <button
                  onClick={nextStory}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  Próxima
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navegação entre histórias */}
        <div className="flex items-center justify-between mt-8 bg-white rounded-xl shadow-lg p-4">
          <button
            onClick={previousStory}
            disabled={currentStoryIndex === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              currentStoryIndex > 0
                ? 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            ← Anterior
          </button>
          
          <div className="flex items-center gap-1 overflow-x-auto">
            {advancedStories.map((story, index) => (
              <button
                key={story.id}
                onClick={() => setCurrentStoryIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStoryIndex
                    ? 'bg-purple-500 w-6'
                    : completedStories.includes(story.id)
                    ? 'bg-green-400'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={story.title}
              />
            ))}
          </div>
          
          <button
            onClick={nextStory}
            disabled={currentStoryIndex === advancedStories.length - 1}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              currentStoryIndex < advancedStories.length - 1
                ? 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Próxima →
          </button>
        </div>

        {/* Modal de Conclusão Final */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center max-h-[90vh] overflow-y-auto">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Parabéns! Jornada Completa!
              </h2>
              <p className="text-gray-600 mb-6">
                Você completou TODOS os níveis da <strong>Narrativa Sequencial</strong>! 
                Suas habilidades de organização narrativa e compreensão emocional foram totalmente desenvolvidas.
              </p>
              
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-purple-800 mb-3">🎉 Conquistas Finais:</h3>
                <div className="text-sm text-purple-700 space-y-2">
                  <div>🥉 <strong>50 Histórias Simples</strong> - Nível Iniciante</div>
                  <div>🥈 <strong>30 Histórias Complexas</strong> - Nível Intermediário</div>
                  <div>🥇 <strong>20 Narrativas Avançadas</strong> - Nível Avançado</div>
                  <div className="pt-2 border-t border-purple-300">
                    <strong>100 HISTÓRIAS COMPLETAS!</strong>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">Habilidades Dominadas:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Sequenciamento", "Empatia", "Resolução de Conflitos", "Pensamento Crítico", 
                    "Inteligência Emocional", "Consciência Social"].map((skill) => (
                    <span key={skill} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/combined')}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Voltar ao Menu
                </button>
                
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    router.push('/sequential-narrative');
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  Jogar Novamente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
