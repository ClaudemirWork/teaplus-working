'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Heart, Sparkles, ChevronRight, RotateCcw, Home, Users, Compass, Lightbulb, PartyPopper } from 'lucide-react';

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
}

// 30 HISTÓRIAS DO NÍVEL INTERMEDIÁRIO
const intermediateStories: Story[] = [
  // SITUAÇÕES SOCIAIS (10 histórias)
  {
    id: 'social_1',
    title: 'Pedindo Desculpas',
    category: 'Situações Sociais',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "João estava correndo no pátio da escola", icon: "🏃", correctOrder: 1 },
      { id: 2, text: "Sem querer, esbarrou em Maria e ela caiu", icon: "💥", correctOrder: 2 },
      { id: 3, text: "João parou e ajudou Maria a levantar", icon: "🤝", correctOrder: 3 },
      { id: 4, text: "Ele pediu desculpas sinceramente", icon: "🙏", correctOrder: 4 },
      { id: 5, text: "Maria sorriu e eles viraram amigos", icon: "😊", correctOrder: 5 }
    ],
    completionMessage: "Excelente! Você entendeu a importância de pedir desculpas!",
    hint: "Pense: acidente → perceber o erro → ajudar → pedir desculpas → reconciliação",
    skills: ["Empatia", "Responsabilidade", "Comunicação"]
  },
  {
    id: 'social_2',
    title: 'Compartilhando o Brinquedo',
    category: 'Situações Sociais',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Lucas tinha um carrinho novo e brilhante", icon: "🚗", correctOrder: 1 },
      { id: 2, text: "Pedro se aproximou e pediu emprestado", icon: "👦", correctOrder: 2 },
      { id: 3, text: "Lucas pensou um pouco sobre compartilhar", icon: "🤔", correctOrder: 3 },
      { id: 4, text: "Decidiu emprestar o carrinho ao amigo", icon: "🤲", correctOrder: 4 },
      { id: 5, text: "Os dois brincaram juntos felizes", icon: "🎮", correctOrder: 5 }
    ],
    completionMessage: "Parabéns! Compartilhar torna a brincadeira mais divertida!",
    hint: "A sequência mostra: ter algo → pedido → reflexão → decisão → resultado positivo",
    skills: ["Generosidade", "Amizade", "Cooperação"]
  },
  {
    id: 'social_3',
    title: 'Esperando a Vez',
    category: 'Situações Sociais',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Ana queria muito usar o balanço", icon: "🎠", correctOrder: 1 },
      { id: 2, text: "Viu que havia uma fila de crianças", icon: "👥", correctOrder: 2 },
      { id: 3, text: "Respirou fundo e esperou pacientemente", icon: "⏰", correctOrder: 3 },
      { id: 4, text: "Finalmente chegou sua vez de brincar", icon: "✨", correctOrder: 4 },
      { id: 5, text: "Ana balançou feliz sabendo que foi justa", icon: "😄", correctOrder: 5 }
    ],
    completionMessage: "Muito bem! Paciência e justiça são importantes!",
    hint: "Observe: desejo → obstáculo → paciência → recompensa → satisfação",
    skills: ["Paciência", "Justiça", "Autocontrole"]
  },
  {
    id: 'social_4',
    title: 'Fazendo um Novo Amigo',
    category: 'Situações Sociais',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Sofia viu uma criança nova na escola", icon: "👧", correctOrder: 1 },
      { id: 2, text: "Sentiu curiosidade e um pouco de timidez", icon: "🫣", correctOrder: 2 },
      { id: 3, text: "Tomou coragem e se aproximou devagar", icon: "🚶‍♀️", correctOrder: 3 },
      { id: 4, text: "Disse 'Oi, meu nome é Sofia!'", icon: "👋", correctOrder: 4 },
      { id: 5, text: "A nova amiga sorriu e elas começaram a conversar", icon: "💬", correctOrder: 5 }
    ],
    completionMessage: "Incrível! Fazer novos amigos é uma aventura!",
    hint: "Veja: observação → sentimento → coragem → ação → novo começo",
    skills: ["Coragem", "Sociabilidade", "Iniciativa"]
  },
  {
    id: 'social_5',
    title: 'Resolvendo uma Briga',
    category: 'Situações Sociais',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Dois amigos queriam o mesmo livro", icon: "📚", correctOrder: 1 },
      { id: 2, text: "Começaram a discutir e puxar o livro", icon: "😤", correctOrder: 2 },
      { id: 3, text: "A professora se aproximou calmamente", icon: "👩‍🏫", correctOrder: 3 },
      { id: 4, text: "Conversaram sobre turnos e respeito", icon: "🗣️", correctOrder: 4 },
      { id: 5, text: "Decidiram ler o livro juntos", icon: "📖", correctOrder: 5 }
    ],
    completionMessage: "Perfeito! Conflitos podem ter soluções criativas!",
    hint: "Sequência: conflito → escalada → mediação → diálogo → solução",
    skills: ["Mediação", "Resolução de Conflitos", "Colaboração"]
  },
  {
    id: 'social_6',
    title: 'Visita ao Médico',
    category: 'Situações Sociais',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Bruno entrou nervoso no consultório", icon: "🏥", correctOrder: 1 },
      { id: 2, text: "O médico sorriu e explicou tudo", icon: "👨‍⚕️", correctOrder: 2 },
      { id: 3, text: "Bruno sentou na maca ainda preocupado", icon: "🪑", correctOrder: 3 },
      { id: 4, text: "O exame foi rápido e não doeu", icon: "🩺", correctOrder: 4 },
      { id: 5, text: "Saiu aliviado com um adesivo de herói", icon: "🦸‍♂️", correctOrder: 5 }
    ],
    completionMessage: "Ótimo! Enfrentar medos nos torna mais fortes!",
    hint: "Note: ansiedade → acolhimento → enfrentamento → experiência → alívio",
    skills: ["Coragem", "Confiança", "Superação"]
  },
  {
    id: 'social_7',
    title: 'Festa de Aniversário',
    category: 'Situações Sociais',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Clara chegou na festa com o presente", icon: "🎁", correctOrder: 1 },
      { id: 2, text: "Entregou para o aniversariante feliz", icon: "🎂", correctOrder: 2 },
      { id: 3, text: "Todos cantaram parabéns animados", icon: "🎵", correctOrder: 3 },
      { id: 4, text: "Comeram bolo de chocolate delicioso", icon: "🍰", correctOrder: 4 },
      { id: 5, text: "Clara agradeceu e foi embora contente", icon: "🎈", correctOrder: 5 }
    ],
    completionMessage: "Maravilhoso! Celebrações unem as pessoas!",
    hint: "Siga: chegada → entrega → celebração → diversão → gratidão",
    skills: ["Gratidão", "Celebração", "Socialização"]
  },
  {
    id: 'social_8',
    title: 'Perdendo no Jogo',
    category: 'Situações Sociais',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Daniel jogava concentrado com os amigos", icon: "🎯", correctOrder: 1 },
      { id: 2, text: "Seu amigo marcou o ponto da vitória", icon: "🏆", correctOrder: 2 },
      { id: 3, text: "Daniel sentiu frustração por perder", icon: "😞", correctOrder: 3 },
      { id: 4, text: "Respirou fundo e controlou a emoção", icon: "💨", correctOrder: 4 },
      { id: 5, text: "Parabenizou o vencedor com um sorriso", icon: "🤝", correctOrder: 5 }
    ],
    completionMessage: "Excelente! Saber perder é tão importante quanto ganhar!",
    hint: "Veja: competição → derrota → frustração → autocontrole → sportividade",
    skills: ["Esportividade", "Autocontrole", "Respeito"]
  },
  {
    id: 'social_9',
    title: 'Ajudando um Colega',
    category: 'Situações Sociais',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Rita viu João chorando no canto", icon: "😢", correctOrder: 1 },
      { id: 2, text: "Se aproximou e perguntou o que houve", icon: "❓", correctOrder: 2 },
      { id: 3, text: "João contou que perdeu seu lanche", icon: "🥪", correctOrder: 3 },
      { id: 4, text: "Rita ofereceu metade do seu lanche", icon: "🤲", correctOrder: 4 },
      { id: 5, text: "Os dois lancharam juntos e felizes", icon: "😊", correctOrder: 5 }
    ],
    completionMessage: "Lindo! Ajudar os outros enche nosso coração!",
    hint: "Sequência: observação → aproximação → escuta → ação → amizade",
    skills: ["Empatia", "Generosidade", "Compaixão"]
  },
  {
    id: 'social_10',
    title: 'Primeiro Dia de Aula',
    category: 'Situações Sociais',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Marcos acordou ansioso para a escola nova", icon: "😰", correctOrder: 1 },
      { id: 2, text: "Vestiu o uniforme com as mãos tremendo", icon: "👕", correctOrder: 2 },
      { id: 3, text: "Entrou na sala e todos olharam", icon: "👀", correctOrder: 3 },
      { id: 4, text: "A professora o apresentou gentilmente", icon: "👩‍🏫", correctOrder: 4 },
      { id: 5, text: "Logo fez amigos e se sentiu acolhido", icon: "🤗", correctOrder: 5 }
    ],
    completionMessage: "Parabéns! Novos começos trazem grandes amizades!",
    hint: "Note: ansiedade → preparação → exposição → acolhimento → integração",
    skills: ["Adaptação", "Coragem", "Abertura"]
  },

  // AVENTURAS E DESCOBERTAS (8 histórias)
  {
    id: 'adventure_1',
    title: 'Plantando uma Árvore',
    category: 'Aventuras',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "As crianças fizeram um buraco na terra", icon: "🕳️", correctOrder: 1 },
      { id: 2, text: "Colocaram a mudinha com cuidado", icon: "🌱", correctOrder: 2 },
      { id: 3, text: "Cobriram as raízes com terra fofa", icon: "🪴", correctOrder: 3 },
      { id: 4, text: "Regaram com água fresquinha", icon: "💧", correctOrder: 4 },
      { id: 5, text: "Depois de dias, viram brotos novos", icon: "🌿", correctOrder: 5 }
    ],
    completionMessage: "Maravilhoso! Você plantou vida e esperança!",
    hint: "Processo: preparar → plantar → cobrir → regar → crescer",
    skills: ["Paciência", "Cuidado", "Responsabilidade Ambiental"]
  },
  {
    id: 'adventure_2',
    title: 'Dia na Praia',
    category: 'Aventuras',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "A família pisou na areia quentinha", icon: "🏖️", correctOrder: 1 },
      { id: 2, text: "As crianças sentiram a água gelada", icon: "🌊", correctOrder: 2 },
      { id: 3, text: "Construíram um castelo gigante", icon: "🏰", correctOrder: 3 },
      { id: 4, text: "Uma onda grande derrubou tudo", icon: "🌊", correctOrder: 4 },
      { id: 5, text: "Riram e começaram outro castelo", icon: "😄", correctOrder: 5 }
    ],
    completionMessage: "Incrível! A diversão continua mesmo com imprevistos!",
    hint: "Aventura: chegada → exploração → criação → surpresa → recomeço",
    skills: ["Resiliência", "Criatividade", "Adaptação"]
  },
  {
    id: 'adventure_3',
    title: 'Visita ao Zoológico',
    category: 'Aventuras',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Compraram os ingressos na entrada", icon: "🎫", correctOrder: 1 },
      { id: 2, text: "Viram o leão dormindo na sombra", icon: "🦁", correctOrder: 2 },
      { id: 3, text: "Alimentaram a girafa com folhas", icon: "🦒", correctOrder: 3 },
      { id: 4, text: "O macaco fez graça para a foto", icon: "🐵", correctOrder: 4 },
      { id: 5, text: "Voltaram cansados mas muito felizes", icon: "🚗", correctOrder: 5 }
    ],
    completionMessage: "Fantástico! Que dia de descobertas incríveis!",
    hint: "Passeio: entrada → observação → interação → diversão → retorno",
    skills: ["Observação", "Aprendizado", "Apreciação da Natureza"]
  },
  {
    id: 'adventure_4',
    title: 'Acampamento nas Estrelas',
    category: 'Aventuras',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Montaram a barraca antes de escurecer", icon: "⛺", correctOrder: 1 },
      { id: 2, text: "Acenderam a fogueira com gravetos", icon: "🔥", correctOrder: 2 },
      { id: 3, text: "Assaram marshmallows dourados", icon: "🍡", correctOrder: 3 },
      { id: 4, text: "Contaram histórias assustadoras", icon: "👻", correctOrder: 4 },
      { id: 5, text: "Dormiram sob milhares de estrelas", icon: "⭐", correctOrder: 5 }
    ],
    completionMessage: "Mágico! Uma noite inesquecível na natureza!",
    hint: "Noite especial: preparação → fogueira → comida → histórias → descanso",
    skills: ["Trabalho em Equipe", "Conexão com a Natureza", "Aventura"]
  },
  {
    id: 'adventure_5',
    title: 'Descobrindo a Biblioteca',
    category: 'Aventuras',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Entraram silenciosos na biblioteca", icon: "🤫", correctOrder: 1 },
      { id: 2, text: "Procuraram livros nas prateleiras altas", icon: "📚", correctOrder: 2 },
      { id: 3, text: "Sentaram para ler histórias mágicas", icon: "📖", correctOrder: 3 },
      { id: 4, text: "Fizeram a fichinha de empréstimo", icon: "📝", correctOrder: 4 },
      { id: 5, text: "Levaram tesouros de papel para casa", icon: "🎒", correctOrder: 5 }
    ],
    completionMessage: "Excelente! Livros são portais para outros mundos!",
    hint: "Exploração: entrada → busca → leitura → empréstimo → levar para casa",
    skills: ["Curiosidade", "Amor pela Leitura", "Organização"]
  },
  {
    id: 'adventure_6',
    title: 'Cozinhando Juntos',
    category: 'Aventuras',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Lavaram todos os ingredientes frescos", icon: "🥕", correctOrder: 1 },
      { id: 2, text: "Misturaram a massa com carinho", icon: "🥣", correctOrder: 2 },
      { id: 3, text: "Colocaram no forno bem quente", icon: "🔥", correctOrder: 3 },
      { id: 4, text: "Esperaram sentindo o cheiro bom", icon: "⏰", correctOrder: 4 },
      { id: 5, text: "Provaram o bolo ainda quentinho", icon: "🍰", correctOrder: 5 }
    ],
    completionMessage: "Delicioso! Cozinhar junto é puro amor!",
    hint: "Receita: preparação → mistura → cozimento → espera → degustação",
    skills: ["Paciência", "Trabalho em Equipe", "Criatividade Culinária"]
  },
  {
    id: 'adventure_7',
    title: 'Dia na Piscina',
    category: 'Aventuras',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Vestiram roupa de banho colorida", icon: "🩱", correctOrder: 1 },
      { id: 2, text: "Passaram protetor solar no corpo todo", icon: "🧴", correctOrder: 2 },
      { id: 3, text: "Entraram devagar na água fria", icon: "🏊", correctOrder: 3 },
      { id: 4, text: "Nadaram e brincaram de mergulho", icon: "🤿", correctOrder: 4 },
      { id: 5, text: "Secaram no sol comendo picolé", icon: "🍦", correctOrder: 5 }
    ],
    completionMessage: "Refrescante! Que dia perfeito de verão!",
    hint: "Diversão aquática: preparação → proteção → entrada → brincadeira → relaxamento",
    skills: ["Cuidado Pessoal", "Diversão", "Segurança"]
  },
  {
    id: 'adventure_8',
    title: 'Cinema Especial',
    category: 'Aventuras',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Compraram pipoca e refrigerante", icon: "🍿", correctOrder: 1 },
      { id: 2, text: "Encontraram as cadeiras numeradas", icon: "💺", correctOrder: 2 },
      { id: 3, text: "As luzes se apagaram devagar", icon: "🌑", correctOrder: 3 },
      { id: 4, text: "Assistiram o filme emocionados", icon: "🎬", correctOrder: 4 },
      { id: 5, text: "Aplaudiram quando acabou a história", icon: "👏", correctOrder: 5 }
    ],
    completionMessage: "Espetacular! Cinema é pura magia!",
    hint: "Experiência: preparação → acomodação → início → imersão → conclusão",
    skills: ["Apreciação Artística", "Comportamento Social", "Atenção"]
  },

  // RESOLUÇÃO DE PROBLEMAS (7 histórias)
  {
    id: 'problem_1',
    title: 'Brinquedo Quebrado',
    category: 'Resolução de Problemas',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Pedro brincava com seu robô favorito", icon: "🤖", correctOrder: 1 },
      { id: 2, text: "O braço do robô quebrou de repente", icon: "💔", correctOrder: 2 },
      { id: 3, text: "Ficou triste mas não desistiu", icon: "😔", correctOrder: 3 },
      { id: 4, text: "Pediu ajuda ao papai para consertar", icon: "🔧", correctOrder: 4 },
      { id: 5, text: "Juntos consertaram e voltou a funcionar", icon: "✨", correctOrder: 5 }
    ],
    completionMessage: "Brilhante! Problemas têm solução quando pedimos ajuda!",
    hint: "Solução: uso → problema → sentimento → busca de ajuda → resolução",
    skills: ["Resiliência", "Busca de Ajuda", "Persistência"]
  },
  {
    id: 'problem_2',
    title: 'Perdido no Mercado',
    category: 'Resolução de Problemas',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Nina soltou a mão da mamãe sem querer", icon: "🤚", correctOrder: 1 },
      { id: 2, text: "Percebeu que estava sozinha", icon: "😱", correctOrder: 2 },
      { id: 3, text: "Procurou um funcionário uniformizado", icon: "👮", correctOrder: 3 },
      { id: 4, text: "Falaram o nome dela no alto-falante", icon: "📢", correctOrder: 4 },
      { id: 5, text: "Mamãe apareceu e se abraçaram forte", icon: "🤱", correctOrder: 5 }
    ],
    completionMessage: "Inteligente! Você soube exatamente o que fazer!",
    hint: "Segurança: separação → percepção → ação correta → comunicação → reencontro",
    skills: ["Segurança", "Iniciativa", "Calma"]
  },
  {
    id: 'problem_3',
    title: 'Roupa Manchada',
    category: 'Resolução de Problemas',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Tom derramou suco na camisa nova", icon: "🥤", correctOrder: 1 },
      { id: 2, text: "A mancha ficou grande e vermelha", icon: "👕", correctOrder: 2 },
      { id: 3, text: "Trocou de roupa rapidamente", icon: "👔", correctOrder: 3 },
      { id: 4, text: "Colocou a camisa suja para lavar", icon: "🧺", correctOrder: 4 },
      { id: 5, text: "Vestiu uma camisa limpa e cheirosa", icon: "✨", correctOrder: 5 }
    ],
    completionMessage: "Prático! Acidentes acontecem e têm solução!",
    hint: "Ação: acidente → avaliação → troca → limpeza → solução",
    skills: ["Autonomia", "Resolução Rápida", "Cuidado Pessoal"]
  },
  {
    id: 'problem_4',
    title: 'Chuva Surpresa',
    category: 'Resolução de Problemas',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "As crianças brincavam no pátio", icon: "⚽", correctOrder: 1 },
      { id: 2, text: "A chuva começou forte de repente", icon: "🌧️", correctOrder: 2 },
      { id: 3, text: "Todos correram para se abrigar", icon: "🏃", correctOrder: 3 },
      { id: 4, text: "Secaram-se com toalhas macias", icon: "🏖️", correctOrder: 4 },
      { id: 5, text: "Tomaram chocolate quente quentinho", icon: "☕", correctOrder: 5 }
    ],
    completionMessage: "Esperto! Transformaram um problema em momento gostoso!",
    hint: "Adaptação: brincadeira → mudança → reação → cuidado → conforto",
    skills: ["Adaptação", "Agilidade", "Transformação Positiva"]
  },
  {
    id: 'problem_5',
    title: 'Esqueceu o Lanche',
    category: 'Resolução de Problemas',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Carlos abriu a mochila na escola", icon: "🎒", correctOrder: 1 },
      { id: 2, text: "Não encontrou sua lancheira", icon: "❌", correctOrder: 2 },
      { id: 3, text: "Ficou preocupado com a fome", icon: "😟", correctOrder: 3 },
      { id: 4, text: "Seu amigo ofereceu dividir o lanche", icon: "🤝", correctOrder: 4 },
      { id: 5, text: "Agradeceu a gentileza do amigo", icon: "🙏", correctOrder: 5 }
    ],
    completionMessage: "Lindo! A amizade resolve muitos problemas!",
    hint: "Apoio: descoberta → preocupação → problema → solidariedade → gratidão",
    skills: ["Gratidão", "Aceitação de Ajuda", "Amizade"]
  },
  {
    id: 'problem_6',
    title: 'Medo do Escuro',
    category: 'Resolução de Problemas',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "A luz do quarto apagou à noite", icon: "💡", correctOrder: 1 },
      { id: 2, text: "Lia sentiu medo da escuridão", icon: "😨", correctOrder: 2 },
      { id: 3, text: "Chamou a mamãe baixinho", icon: "🗣️", correctOrder: 3 },
      { id: 4, text: "Mamãe acendeu o abajur suave", icon: "🕯️", correctOrder: 4 },
      { id: 5, text: "Lia dormiu tranquila e segura", icon: "😴", correctOrder: 5 }
    ],
    completionMessage: "Corajoso! Pedir ajuda quando temos medo é força!",
    hint: "Superação: escuridão → medo → pedido → solução → tranquilidade",
    skills: ["Comunicação", "Superação do Medo", "Confiança"]
  },
  {
    id: 'problem_7',
    title: 'Joelho Machucado',
    category: 'Resolução de Problemas',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "João corria rápido no playground", icon: "🏃", correctOrder: 1 },
      { id: 2, text: "Tropeçou e caiu no chão duro", icon: "🤕", correctOrder: 2 },
      { id: 3, text: "O joelho começou a sangrar", icon: "🩸", correctOrder: 3 },
      { id: 4, text: "A professora limpou com cuidado", icon: "🧑‍⚕️", correctOrder: 4 },
      { id: 5, text: "Colocou um band-aid de super-herói", icon: "🩹", correctOrder: 5 }
    ],
    completionMessage: "Valente! Machucados saram e nos tornam mais fortes!",
    hint: "Cuidado: atividade → acidente → ferimento → tratamento → proteção",
    skills: ["Coragem", "Cuidado com Ferimentos", "Resiliência"]
  },

  // CELEBRAÇÕES (5 histórias)
  {
    id: 'celebration_1',
    title: 'Natal Mágico',
    category: 'Celebrações',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "A família decorou a árvore verde", icon: "🎄", correctOrder: 1 },
      { id: 2, text: "As crianças escreveram cartinhas", icon: "✉️", correctOrder: 2 },
      { id: 3, text: "Dormiram ansiosas pela manhã", icon: "😴", correctOrder: 3 },
      { id: 4, text: "Abriram presentes coloridos", icon: "🎁", correctOrder: 4 },
      { id: 5, text: "Abraçaram todos com amor", icon: "🤗", correctOrder: 5 }
    ],
    completionMessage: "Mágico! O Natal une corações!",
    hint: "Celebração: preparação → expectativa → descanso → surpresa → gratidão",
    skills: ["Tradição", "Gratidão", "União Familiar"]
  },
  {
    id: 'celebration_2',
    title: 'Caça aos Ovos',
    category: 'Celebrações',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Procuraram ovos pelo jardim", icon: "🔍", correctOrder: 1 },
      { id: 2, text: "Acharam chocolates escondidos", icon: "🍫", correctOrder: 2 },
      { id: 3, text: "Encheram as cestinhas coloridas", icon: "🧺", correctOrder: 3 },
      { id: 4, text: "Contaram quantos ovos acharam", icon: "🔢", correctOrder: 4 },
      { id: 5, text: "Dividiram os chocolates igualmente", icon: "🤝", correctOrder: 5 }
    ],
    completionMessage: "Divertido! Páscoa é alegria e partilha!",
    hint: "Busca: procura → descoberta → coleta → contagem → divisão",
    skills: ["Busca Ativa", "Matemática", "Compartilhamento"]
  },
  {
    id: 'celebration_3',
    title: 'Festa Junina',
    category: 'Celebrações',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Vestiram roupas caipiras xadrez", icon: "👗", correctOrder: 1 },
      { id: 2, text: "Dançaram quadrilha animados", icon: "💃", correctOrder: 2 },
      { id: 3, text: "Pularam a fogueira pequena", icon: "🔥", correctOrder: 3 },
      { id: 4, text: "Comeram quentão e pipoca", icon: "🌽", correctOrder: 4 },
      { id: 5, text: "Soltaram balão de papel", icon: "🎈", correctOrder: 5 }
    ],
    completionMessage: "Animado! Festa junina é pura tradição!",
    hint: "Festa: caracterização → dança → ritual → comida → finalização",
    skills: ["Cultura", "Dança", "Tradição"]
  },
  {
    id: 'celebration_4',
    title: 'Dia das Mães',
    category: 'Celebrações',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Fizeram um cartão com coração", icon: "💌", correctOrder: 1 },
      { id: 2, text: "Acordaram cedo no domingo", icon: "⏰", correctOrder: 2 },
      { id: 3, text: "Levaram café na cama", icon: "☕", correctOrder: 3 },
      { id: 4, text: "Deram o presente especial", icon: "🎁", correctOrder: 4 },
      { id: 5, text: "Viram mamãe chorar de alegria", icon: "😭", correctOrder: 5 }
    ],
    completionMessage: "Emocionante! Amor de mãe merece celebração!",
    hint: "Homenagem: preparação → acordar → surpresa → presente → emoção",
    skills: ["Amor", "Gratidão", "Planejamento"]
  },
  {
    id: 'celebration_5',
    title: 'Formatura da Escola',
    category: 'Celebrações',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Vestiram a beca azul bonita", icon: "🎓", correctOrder: 1 },
      { id: 2, text: "Ensaiaram a música de formatura", icon: "🎵", correctOrder: 2 },
      { id: 3, text: "Subiram no palco emocionados", icon: "🎭", correctOrder: 3 },
      { id: 4, text: "Receberam o diploma importante", icon: "📜", correctOrder: 4 },
      { id: 5, text: "Tiraram foto com toda turma", icon: "📸", correctOrder: 5 }
    ],
    completionMessage: "Conquista! Cada etapa vencida é vitória!",
    hint: "Cerimônia: preparação → ensaio → apresentação → premiação → registro",
    skills: ["Conquista", "Celebração", "Memórias"]
  }
];

export default function IntermediateLevel() {
  const router = useRouter();
  
  // Estados principais
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [shuffledElements, setShuffledElements] = useState<StoryElement[]>([]);
  const [userSequence, setUserSequence] = useState<StoryElement[]>([]);
  const [draggedItem, setDraggedItem] = useState<StoryElement | null>(null);
  
  // Estados de gamificação
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [stars, setStars] = useState(0);

  // História atual
  const currentStory = intermediateStories[currentStoryIndex];

  // Ícone da categoria
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Situações Sociais': return <Users className="w-5 h-5" />;
      case 'Aventuras': return <Compass className="w-5 h-5" />;
      case 'Resolução de Problemas': return <Lightbulb className="w-5 h-5" />;
      case 'Celebrações': return <PartyPopper className="w-5 h-5" />;
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
    if (userSequence.length !== 5) {
      alert('Por favor, organize todos os 5 elementos da história!');
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
    } else {
      setScore(0);
      setCurrentStreak(0);
      setStars(0);
    }
    
    setShowFeedback(true);
  };

  const nextStory = () => {
    if (currentStoryIndex < intermediateStories.length - 1) {
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
  const progressPercentage = (completedStories.length / intermediateStories.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-4 sm:p-6">
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
                Nível Intermediário
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                História {currentStoryIndex + 1} de {intermediateStories.length}
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
                    <Sparkles className="w-5 h-5 text-orange-500" />
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
              <span>{completedStories.length}/{intermediateStories.length} histórias</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500 flex items-center justify-center"
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
                    {getCategoryIcon(currentStory.category)}
                    {currentStory.category} • Narrado por {currentStory.narrator}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors flex items-center gap-2"
            >
              💡 Dica
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
                className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full text-xs font-medium"
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
              Partes da História (5 elementos)
            </h3>
            
            <div className="space-y-3">
              {shuffledElements.map((element) => (
                <div
                  key={element.id}
                  draggable
                  onDragStart={() => handleDragStart(element)}
                  className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-4 cursor-move hover:shadow-md transition-all transform hover:scale-[1.02]"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{element.icon}</span>
                    <p className="text-gray-800 flex-1 text-sm">{element.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {shuffledElements.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-2 text-orange-400" />
                <p>Todas as partes foram organizadas!</p>
              </div>
            )}
          </div>

          {/* Área de Sequência */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📖</span>
              Monte a História Complexa
            </h3>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="min-h-[450px] border-3 border-dashed border-orange-300 rounded-lg p-4 space-y-2 bg-orange-50/30"
            >
              {userSequence.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-5xl mb-3">👆</div>
                  <p className="text-lg">Arraste os 5 elementos aqui</p>
                  <p className="text-sm mt-2">Ordem: início → desenvolvimento → clímax → resolução → conclusão</p>
                </div>
              )}

              {userSequence.map((element, index) => (
                <div
                  key={element.id}
                  className="bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300 rounded-lg p-3 relative transform transition-all hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold shadow-md">
                      {index + 1}°
                    </div>
                    <span className="text-2xl mr-3">{element.icon}</span>
                    <p className="text-gray-800 flex-1 text-sm font-medium">{element.text}</p>
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
                disabled={userSequence.length !== 5}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all transform ${
                  userSequence.length === 5
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Verificar Sequência
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

        {/* Feedback Gamificado */}
        {showFeedback && (
          <div className={`mt-6 rounded-xl border-2 p-6 ${
            score === 100 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
              : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={`text-2xl font-bold mb-2 ${
                  score === 100 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {score === 100 ? '🎉 Excelente Trabalho!' : '💪 Continue Tentando!'}
                </h3>
                <p className={`text-lg ${score === 100 ? 'text-green-700' : 'text-orange-700'}`}>
                  {score === 100 
                    ? currentStory.completionMessage
                    : 'Pense na progressão lógica dos eventos e emoções!'
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
                      <h4 className="font-semibold text-green-800 mb-2">💡 Habilidades Desenvolvidas:</h4>
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
              
              {score === 100 && currentStoryIndex < intermediateStories.length - 1 && (
                <button
                  onClick={nextStory}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  Próxima História
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
                ? 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            ← Anterior
          </button>
          
          <div className="flex items-center gap-2">
            {intermediateStories.map((story, index) => (
              <button
                key={story.id}
                onClick={() => setCurrentStoryIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStoryIndex
                    ? 'bg-orange-500 w-8'
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
            disabled={currentStoryIndex === intermediateStories.length - 1}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              currentStoryIndex < intermediateStories.length - 1
                ? 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Próxima →
          </button>
        </div>

        {/* Conquistas */}
        {completedStories.length === intermediateStories.length && (
          <div className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 text-center">
            <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              🎊 Nível Intermediário Completo! 🎊
            </h2>
            <p className="text-gray-700 mb-4">
              Você completou todas as {intermediateStories.length} histórias complexas!
            </p>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Habilidades Dominadas:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Resolução de Conflitos", "Empatia Social", "Pensamento Sequencial", "Inteligência Emocional"].map((skill) => (
                  <span key={skill} className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => router.push('/sequential-narrative/advanced')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Avançar para Nível Avançado →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
