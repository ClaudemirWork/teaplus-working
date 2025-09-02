'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Sparkles, ChevronRight, RotateCcw, Home, Users, Compass, Lightbulb, PartyPopper } from 'lucide-react';

// Interfaces (incluindo a sua nova propriedade 'skills')
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

// SUAS 30 HISTÓRIAS COMPLETAS DO NÍVEL INTERMEDIÁRIO
const intermediateStories: Story[] = [
  { id: 'social_1', title: 'Pedindo Desculpas', category: 'Situações Sociais', narrator: 'Leo', elements: [ { id: 1, text: "João estava correndo no pátio da escola", icon: "🏃", correctOrder: 1 }, { id: 2, text: "Sem querer, esbarrou em Maria e ela caiu", icon: "💥", correctOrder: 2 }, { id: 3, text: "João parou e ajudou Maria a levantar", icon: "🤝", correctOrder: 3 }, { id: 4, text: "Ele pediu desculpas sinceramente", icon: "🙏", correctOrder: 4 }, { id: 5, text: "Maria sorriu e eles viraram amigos", icon: "😊", correctOrder: 5 } ], completionMessage: "Excelente! Você entendeu a importância de pedir desculpas!", hint: "Pense: acidente → perceber o erro → ajudar → pedir desculpas → reconciliação", skills: ["Empatia", "Responsabilidade", "Comunicação"] },
  { id: 'social_2', title: 'Compartilhando o Brinquedo', category: 'Situações Sociais', narrator: 'Mila', elements: [ { id: 1, text: "Lucas tinha um carrinho novo e brilhante", icon: "🚗", correctOrder: 1 }, { id: 2, text: "Pedro se aproximou e pediu emprestado", icon: "👦", correctOrder: 2 }, { id: 3, text: "Lucas pensou um pouco sobre compartilhar", icon: "🤔", correctOrder: 3 }, { id: 4, text: "Decidiu emprestar o carrinho ao amigo", icon: "🤲", correctOrder: 4 }, { id: 5, text: "Os dois brincaram juntos felizes", icon: "🎮", correctOrder: 5 } ], completionMessage: "Parabéns! Compartilhar torna a brincadeira mais divertida!", hint: "A sequência mostra: ter algo → pedido → reflexão → decisão → resultado positivo", skills: ["Generosidade", "Amizade", "Cooperação"] },
  { id: 'social_3', title: 'Esperando a Vez', category: 'Situações Sociais', narrator: 'Leo', elements: [ { id: 1, text: "Ana queria muito usar o balanço", icon: "🎠", correctOrder: 1 }, { id: 2, text: "Viu que havia uma fila de crianças", icon: "👥", correctOrder: 2 }, { id: 3, text: "Respirou fundo e esperou pacientemente", icon: "⏰", correctOrder: 3 }, { id: 4, text: "Finalmente chegou sua vez de brincar", icon: "✨", correctOrder: 4 }, { id: 5, text: "Ana balançou feliz sabendo que foi justa", icon: "😄", correctOrder: 5 } ], completionMessage: "Muito bem! Paciência e justiça são importantes!", hint: "Observe: desejo → obstáculo → paciência → recompensa → satisfação", skills: ["Paciência", "Justiça", "Autocontrole"] },
  { id: 'social_4', title: 'Fazendo um Novo Amigo', category: 'Situações Sociais', narrator: 'Mila', elements: [ { id: 1, text: "Sofia viu uma criança nova na escola", icon: "👧", correctOrder: 1 }, { id: 2, text: "Sentiu curiosidade e um pouco de timidez", icon: "🫣", correctOrder: 2 }, { id: 3, text: "Tomou coragem e se aproximou devagar", icon: "🚶‍♀️", correctOrder: 3 }, { id: 4, text: "Disse 'Oi, meu nome é Sofia!'", icon: "👋", correctOrder: 4 }, { id: 5, text: "A nova amiga sorriu e elas começaram a conversar", icon: "💬", correctOrder: 5 } ], completionMessage: "Incrível! Fazer novos amigos é uma aventura!", hint: "Veja: observação → sentimento → coragem → ação → novo começo", skills: ["Coragem", "Sociabilidade", "Iniciativa"] },
  { id: 'social_5', title: 'Resolvendo uma Briga', category: 'Situações Sociais', narrator: 'Leo', elements: [ { id: 1, text: "Dois amigos queriam o mesmo livro", icon: "📚", correctOrder: 1 }, { id: 2, text: "Começaram a discutir e puxar o livro", icon: "😤", correctOrder: 2 }, { id: 3, text: "A professora se aproximou calmamente", icon: "👩‍🏫", correctOrder: 3 }, { id: 4, text: "Conversaram sobre turnos e respeito", icon: "🗣️", correctOrder: 4 }, { id: 5, text: "Decidiram ler o livro juntos", icon: "📖", correctOrder: 5 } ], completionMessage: "Perfeito! Conflitos podem ter soluções criativas!", hint: "Sequência: conflito → escalada → mediação → diálogo → solução", skills: ["Mediação", "Resolução de Conflitos", "Colaboração"] },
  { id: 'social_6', title: 'Visita ao Médico', category: 'Situações Sociais', narrator: 'Mila', elements: [ { id: 1, text: "Bruno entrou nervoso no consultório", icon: "🏥", correctOrder: 1 }, { id: 2, text: "O médico sorriu e explicou tudo", icon: "👨‍⚕️", correctOrder: 2 }, { id: 3, text: "Bruno sentou na maca ainda preocupado", icon: "🪑", correctOrder: 3 }, { id: 4, text: "O exame foi rápido e não doeu", icon: "🩺", correctOrder: 4 }, { id: 5, text: "Saiu aliviado com um adesivo de herói", icon: "🦸‍♂️", correctOrder: 5 } ], completionMessage: "Ótimo! Enfrentar medos nos torna mais fortes!", hint: "Note: ansiedade → acolhimento → enfrentamento → experiência → alívio", skills: ["Coragem", "Confiança", "Superação"] },
  { id: 'social_7', title: 'Festa de Aniversário', category: 'Situações Sociais', narrator: 'Leo', elements: [ { id: 1, text: "Clara chegou na festa com o presente", icon: "🎁", correctOrder: 1 }, { id: 2, text: "Entregou para o aniversariante feliz", icon: "🎂", correctOrder: 2 }, { id: 3, text: "Todos cantaram parabéns animados", icon: "🎵", correctOrder: 3 }, { id: 4, text: "Comeram bolo de chocolate delicioso", icon: "🍰", correctOrder: 4 }, { id: 5, text: "Clara agradeceu e foi embora contente", icon: "🎈", correctOrder: 5 } ], completionMessage: "Maravilhoso! Celebrações unem as pessoas!", hint: "Siga: chegada → entrega → celebração → diversão → gratidão", skills: ["Gratidão", "Celebração", "Socialização"] },
  { id: 'social_8', title: 'Perdendo no Jogo', category: 'Situações Sociais', narrator: 'Mila', elements: [ { id: 1, text: "Daniel jogava concentrado com os amigos", icon: "🎯", correctOrder: 1 }, { id: 2, text: "Seu amigo marcou o ponto da vitória", icon: "🏆", correctOrder: 2 }, { id: 3, text: "Daniel sentiu frustração por perder", icon: "😞", correctOrder: 3 }, { id: 4, text: "Respirou fundo e controlou a emoção", icon: "💨", correctOrder: 4 }, { id: 5, text: "Parabenizou o vencedor com um sorriso", icon: "🤝", correctOrder: 5 } ], completionMessage: "Excelente! Saber perder é tão importante quanto ganhar!", hint: "Veja: competição → derrota → frustração → autocontrole → sportividade", skills: ["Esportividade", "Autocontrole", "Respeito"] },
  { id: 'social_9', title: 'Ajudando um Colega', category: 'Situações Sociais', narrator: 'Leo', elements: [ { id: 1, text: "Rita viu João chorando no canto", icon: "😢", correctOrder: 1 }, { id: 2, text: "Se aproximou e perguntou o que houve", icon: "❓", correctOrder: 2 }, { id: 3, text: "João contou que perdeu seu lanche", icon: "🥪", correctOrder: 3 }, { id: 4, text: "Rita ofereceu metade do seu lanche", icon: "🤲", correctOrder: 4 }, { id: 5, text: "Os dois lancharam juntos e felizes", icon: "😊", correctOrder: 5 } ], completionMessage: "Lindo! Ajudar os outros enche nosso coração!", hint: "Sequência: observação → aproximação → escuta → ação → amizade", skills: ["Empatia", "Generosidade", "Compaixão"] },
  { id: 'social_10', title: 'Primeiro Dia de Aula', category: 'Situações Sociais', narrator: 'Mila', elements: [ { id: 1, text: "Marcos acordou ansioso para a escola nova", icon: "😰", correctOrder: 1 }, { id: 2, text: "Vestiu o uniforme com as mãos tremendo", icon: "👕", correctOrder: 2 }, { id: 3, text: "Entrou na sala e todos olharam", icon: "👀", correctOrder: 3 }, { id: 4, text: "A professora o apresentou gentilmente", icon: "👩‍🏫", correctOrder: 4 }, { id: 5, text: "Logo fez amigos e se sentiu acolhido", icon: "🤗", correctOrder: 5 } ], completionMessage: "Parabéns! Novos começos trazem grandes amizades!", hint: "Note: ansiedade → preparação → exposição → acolhimento → integração", skills: ["Adaptação", "Coragem", "Abertura"] },
  { id: 'adventure_1', title: 'Plantando uma Árvore', category: 'Aventuras', narrator: 'Leo', elements: [ { id: 1, text: "As crianças fizeram um buraco na terra", icon: "🕳️", correctOrder: 1 }, { id: 2, text: "Colocaram a mudinha com cuidado", icon: "🌱", correctOrder: 2 }, { id: 3, text: "Cobriram as raízes com terra fofa", icon: "🪴", correctOrder: 3 }, { id: 4, text: "Regaram com água fresquinha", icon: "💧", correctOrder: 4 }, { id: 5, text: "Depois de dias, viram brotos novos", icon: "🌿", correctOrder: 5 } ], completionMessage: "Maravilhoso! Você plantou vida e esperança!", hint: "Processo: preparar → plantar → cobrir → regar → crescer", skills: ["Paciência", "Cuidado", "Responsabilidade Ambiental"] },
  { id: 'adventure_2', title: 'Dia na Praia', category: 'Aventuras', narrator: 'Mila', elements: [ { id: 1, text: "A família pisou na areia quentinha", icon: "🏖️", correctOrder: 1 }, { id: 2, text: "As crianças sentiram a água gelada", icon: "🌊", correctOrder: 2 }, { id: 3, text: "Construíram um castelo gigante", icon: "🏰", correctOrder: 3 }, { id: 4, text: "Uma onda grande derrubou tudo", icon: "🌊", correctOrder: 4 }, { id: 5, text: "Riram e começaram outro castelo", icon: "😄", correctOrder: 5 } ], completionMessage: "Incrível! A diversão continua mesmo com imprevistos!", hint: "Aventura: chegada → exploração → criação → surpresa → recomeço", skills: ["Resiliência", "Criatividade", "Adaptação"] },
  { id: 'adventure_3', title: 'Visita ao Zoológico', category: 'Aventuras', narrator: 'Leo', elements: [ { id: 1, text: "Compraram os ingressos na entrada", icon: "🎫", correctOrder: 1 }, { id: 2, text: "Viram o leão dormindo na sombra", icon: "🦁", correctOrder: 2 }, { id: 3, text: "Alimentaram a girafa com folhas", icon: "🦒", correctOrder: 3 }, { id: 4, text: "O macaco fez graça para a foto", icon: "🐵", correctOrder: 4 }, { id: 5, text: "Voltaram cansados mas muito felizes", icon: "🚗", correctOrder: 5 } ], completionMessage: "Fantástico! Que dia de descobertas incríveis!", hint: "Passeio: entrada → observação → interação → diversão → retorno", skills: ["Observação", "Aprendizado", "Apreciação da Natureza"] },
  { id: 'adventure_4', title: 'Acampamento nas Estrelas', category: 'Aventuras', narrator: 'Mila', elements: [ { id: 1, text: "Montaram a barraca antes de escurecer", icon: "⛺", correctOrder: 1 }, { id: 2, text: "Acenderam a fogueira com gravetos", icon: "🔥", correctOrder: 2 }, { id: 3, text: "Assaram marshmallows dourados", icon: "🍡", correctOrder: 3 }, { id: 4, text: "Contaram histórias assustadoras", icon: "👻", correctOrder: 4 }, { id: 5, text: "Dormiram sob milhares de estrelas", icon: "⭐", correctOrder: 5 } ], completionMessage: "Mágico! Uma noite inesquecível na natureza!", hint: "Noite especial: preparação → fogueira → comida → histórias → descanso", skills: ["Trabalho em Equipe", "Conexão com a Natureza", "Aventura"] },
  { id: 'adventure_5', title: 'Descobrindo a Biblioteca', category: 'Aventuras', narrator: 'Leo', elements: [ { id: 1, text: "Entraram silenciosos na biblioteca", icon: "🤫", correctOrder: 1 }, { id: 2, text: "Procuraram livros nas prateleiras altas", icon: "📚", correctOrder: 2 }, { id: 3, text: "Sentaram para ler histórias mágicas", icon: "📖", correctOrder: 3 }, { id: 4, text: "Fizeram a fichinha de empréstimo", icon: "📝", correctOrder: 4 }, { id: 5, text: "Levaram tesouros de papel para casa", icon: "🎒", correctOrder: 5 } ], completionMessage: "Excelente! Livros são portais para outros mundos!", hint: "Exploração: entrada → busca → leitura → empréstimo → levar para casa", skills: ["Curiosidade", "Amor pela Leitura", "Organização"] },
  { id: 'adventure_6', title: 'Cozinhando Juntos', category: 'Aventuras', narrator: 'Mila', elements: [ { id: 1, text: "Lavaram todos os ingredientes frescos", icon: "🥕", correctOrder: 1 }, { id: 2, text: "Misturaram a massa com carinho", icon: "🥣", correctOrder: 2 }, { id: 3, text: "Colocaram no forno bem quente", icon: "🔥", correctOrder: 3 }, { id: 4, text: "Esperaram sentindo o cheiro bom", icon: "⏰", correctOrder: 4 }, { id: 5, text: "Provaram o bolo ainda quentinho", icon: "🍰", correctOrder: 5 } ], completionMessage: "Delicioso! Cozinhar junto é puro amor!", hint: "Receita: preparação → mistura → cozimento → espera → degustação", skills: ["Paciência", "Trabalho em Equipe", "Criatividade Culinária"] },
  { id: 'adventure_7', title: 'Dia na Piscina', category: 'Aventuras', narrator: 'Leo', elements: [ { id: 1, text: "Vestiram roupa de banho colorida", icon: "🩱", correctOrder: 1 }, { id: 2, text: "Passaram protetor solar no corpo todo", icon: "🧴", correctOrder: 2 }, { id: 3, text: "Entraram devagar na água fria", icon: "🏊", correctOrder: 3 }, { id: 4, text: "Nadaram e brincaram de mergulho", icon: "🤿", correctOrder: 4 }, { id: 5, text: "Secaram no sol comendo picolé", icon: "🍦", correctOrder: 5 } ], completionMessage: "Refrescante! Que dia perfeito de verão!", hint: "Diversão aquática: preparação → proteção → entrada → brincadeira → relaxamento", skills: ["Cuidado Pessoal", "Diversão", "Segurança"] },
  { id: 'adventure_8', title: 'Cinema Especial', category: 'Aventuras', narrator: 'Mila', elements: [ { id: 1, text: "Compraram pipoca e refrigerante", icon: "🍿", correctOrder: 1 }, { id: 2, text: "Encontraram as cadeiras numeradas", icon: "💺", correctOrder: 2 }, { id: 3, text: "As luzes se apagaram devagar", icon: "🌑", correctOrder: 3 }, { id: 4, text: "Assistiram o filme emocionados", icon: "🎬", correctOrder: 4 }, { id: 5, text: "Aplaudiram quando acabou a história", icon: "👏", correctOrder: 5 } ], completionMessage: "Espetacular! Cinema é pura magia!", hint: "Experiência: preparação → acomodação → início → imersão → conclusão", skills: ["Apreciação Artística", "Comportamento Social", "Atenção"] },
  { id: 'problem_1', title: 'Brinquedo Quebrado', category: 'Resolução de Problemas', narrator: 'Leo', elements: [ { id: 1, text: "Pedro brincava com seu robô favorito", icon: "🤖", correctOrder: 1 }, { id: 2, text: "O braço do robô quebrou de repente", icon: "💔", correctOrder: 2 }, { id: 3, text: "Ficou triste mas não desistiu", icon: "😔", correctOrder: 3 }, { id: 4, text: "Pediu ajuda ao papai para consertar", icon: "🔧", correctOrder: 4 }, { id: 5, text: "Juntos consertaram e voltou a funcionar", icon: "✨", correctOrder: 5 } ], completionMessage: "Brilhante! Problemas têm solução quando pedimos ajuda!", hint: "Solução: uso → problema → sentimento → busca de ajuda → resolução", skills: ["Resiliência", "Busca de Ajuda", "Persistência"] },
  { id: 'problem_2', title: 'Perdido no Mercado', category: 'Resolução de Problemas', narrator: 'Mila', elements: [ { id: 1, text: "Nina soltou a mão da mamãe sem querer", icon: "🤚", correctOrder: 1 }, { id: 2, text: "Percebeu que estava sozinha", icon: "😱", correctOrder: 2 }, { id: 3, text: "Procurou um funcionário uniformizado", icon: "👮", correctOrder: 3 }, { id: 4, text: "Falaram o nome dela no alto-falante", icon: "📢", correctOrder: 4 }, { id: 5, text: "Mamãe apareceu e se abraçaram forte", icon: "🤱", correctOrder: 5 } ], completionMessage: "Inteligente! Você soube exatamente o que fazer!", hint: "Segurança: separação → percepção → ação correta → comunicação → reencontro", skills: ["Segurança", "Iniciativa", "Calma"] },
  { id: 'problem_3', title: 'Roupa Manchada', category: 'Resolução de Problemas', narrator: 'Leo', elements: [ { id: 1, text: "Tom derramou suco na camisa nova", icon: "🥤", correctOrder: 1 }, { id: 2, text: "A mancha ficou grande e vermelha", icon: "👕", correctOrder: 2 }, { id: 3, text: "Trocou de roupa rapidamente", icon: "👔", correctOrder: 3 }, { id: 4, text: "Colocou a camisa suja para lavar", icon: "🧺", correctOrder: 4 }, { id: 5, text: "Vestiu uma camisa limpa e cheirosa", icon: "✨", correctOrder: 5 } ], completionMessage: "Prático! Acidentes acontecem e têm solução!", hint: "Ação: acidente → avaliação → troca → limpeza → solução", skills: ["Autonomia", "Resolução Rápida", "Cuidado Pessoal"] },
  { id: 'problem_4', title: 'Chuva Surpresa', category: 'Resolução de Problemas', narrator: 'Mila', elements: [ { id: 1, text: "As crianças brincavam no pátio", icon: "⚽", correctOrder: 1 }, { id: 2, text: "A chuva começou forte de repente", icon: "🌧️", correctOrder: 2 }, { id: 3, text: "Todos correram para se abrigar", icon: "🏃", correctOrder: 3 }, { id: 4, text: "Secaram-se com toalhas macias", icon: "🏖️", correctOrder: 4 }, { id: 5, text: "Tomaram chocolate quente quentinho", icon: "☕", correctOrder: 5 } ], completionMessage: "Esperto! Transformaram um problema em momento gostoso!", hint: "Adaptação: brincadeira → mudança → reação → cuidado → conforto", skills: ["Adaptação", "Agilidade", "Transformação Positiva"] },
  { id: 'problem_5', title: 'Esqueceu o Lanche', category: 'Resolução de Problemas', narrator: 'Leo', elements: [ { id: 1, text: "Carlos abriu a mochila na escola", icon: "🎒", correctOrder: 1 }, { id: 2, text: "Não encontrou sua lancheira", icon: "❌", correctOrder: 2 }, { id: 3, text: "Ficou preocupado com a fome", icon: "😟", correctOrder: 3 }, { id: 4, text: "Seu amigo ofereceu dividir o lanche", icon: "🤝", correctOrder: 4 }, { id: 5, text: "Agradeceu a gentileza do amigo", icon: "🙏", correctOrder: 5 } ], completionMessage: "Lindo! A amizade resolve muitos problemas!", hint: "Apoio: descoberta → preocupação → problema → solidariedade → gratidão", skills: ["Gratidão", "Aceitação de Ajuda", "Amizade"] },
  { id: 'problem_6', title: 'Medo do Escuro', category: 'Resolução de Problemas', narrator: 'Mila', elements: [ { id: 1, text: "A luz do quarto apagou à noite", icon: "💡", correctOrder: 1 }, { id: 2, text: "Lia sentiu medo da escuridão", icon: "😨", correctOrder: 2 }, { id: 3, text: "Chamou a mamãe baixinho", icon: "🗣️", correctOrder: 3 }, { id: 4, text: "Mamãe acendeu o abajur suave", icon: "🕯️", correctOrder: 4 }, { id: 5, text: "Lia dormiu tranquila e segura", icon: "😴", correctOrder: 5 } ], completionMessage: "Corajoso! Pedir ajuda quando temos medo é força!", hint: "Superação: escuridão → medo → pedido → solução → tranquilidade", skills: ["Comunicação", "Superação do Medo", "Confiança"] },
  { id: 'problem_7', title: 'Joelho Machucado', category: 'Resolução de Problemas', narrator: 'Leo', elements: [ { id: 1, text: "João corria rápido no playground", icon: "🏃", correctOrder: 1 }, { id: 2, text: "Tropeçou e caiu no chão duro", icon: "🤕", correctOrder: 2 }, { id: 3, text: "O joelho começou a sangrar", icon: "🩸", correctOrder: 3 }, { id: 4, text: "A professora limpou com cuidado", icon: "🧑‍⚕️", correctOrder: 4 }, { id: 5, text: "Colocou um band-aid de super-herói", icon: "🩹", correctOrder: 5 } ], completionMessage: "Valente! Machucados saram e nos tornam mais fortes!", hint: "Cuidado: atividade → acidente → ferimento → tratamento → proteção", skills: ["Coragem", "Cuidado com Ferimentos", "Resiliência"] },
  { id: 'celebration_1', title: 'Natal Mágico', category: 'Celebrações', narrator: 'Mila', elements: [ { id: 1, text: "A família decorou a árvore verde", icon: "🎄", correctOrder: 1 }, { id: 2, text: "As crianças escreveram cartinhas", icon: "✉️", correctOrder: 2 }, { id: 3, text: "Dormiram ansiosas pela manhã", icon: "😴", correctOrder: 3 }, { id: 4, text: "Abriram presentes coloridos", icon: "🎁", correctOrder: 4 }, { id: 5, text: "Abraçaram todos com amor", icon: "🤗", correctOrder: 5 } ], completionMessage: "Mágico! O Natal une corações!", hint: "Celebração: preparação → expectativa → descanso → surpresa → gratidão", skills: ["Tradição", "Gratidão", "União Familiar"] },
  { id: 'celebration_2', title: 'Caça aos Ovos', category: 'Celebrações', narrator: 'Leo', elements: [ { id: 1, text: "Procuraram ovos pelo jardim", icon: "🔍", correctOrder: 1 }, { id: 2, text: "Acharam chocolates escondidos", icon: "🍫", correctOrder: 2 }, { id: 3, text: "Encheram as cestinhas coloridas", icon: "🧺", correctOrder: 3 }, { id: 4, text: "Contaram quantos ovos acharam", icon: "🔢", correctOrder: 4 }, { id: 5, text: "Dividiram os chocolates igualmente", icon: "🤝", correctOrder: 5 } ], completionMessage: "Divertido! Páscoa é alegria e partilha!", hint: "Busca: procura → descoberta → coleta → contagem → divisão", skills: ["Busca Ativa", "Matemática", "Compartilhamento"] },
  { id: 'celebration_3', title: 'Festa Junina', category: 'Celebrações', narrator: 'Mila', elements: [ { id: 1, text: "Vestiram roupas caipiras xadrez", icon: "👗", correctOrder: 1 }, { id: 2, text: "Dançaram quadrilha animados", icon: "💃", correctOrder: 2 }, { id: 3, text: "Pularam a fogueira pequena", icon: "🔥", correctOrder: 3 }, { id: 4, text: "Comeram quentão e pipoca", icon: "🌽", correctOrder: 4 }, { id: 5, text: "Soltaram balão de papel", icon: "🎈", correctOrder: 5 } ], completionMessage: "Animado! Festa junina é pura tradição!", hint: "Festa: caracterização → dança → ritual → comida → finalização", skills: ["Cultura", "Dança", "Tradição"] },
  { id: 'celebration_4', title: 'Dia das Mães', category: 'Celebrações', narrator: 'Leo', elements: [ { id: 1, text: "Fizeram um cartão com coração", icon: "💌", correctOrder: 1 }, { id: 2, text: "Acordaram cedo no domingo", icon: "⏰", correctOrder: 2 }, { id: 3, text: "Levaram café na cama", icon: "☕", correctOrder: 3 }, { id: 4, text: "Deram o presente especial", icon: "🎁", correctOrder: 4 }, { id: 5, text: "Viram mamãe chorar de alegria", icon: "😭", correctOrder: 5 } ], completionMessage: "Emocionante! Amor de mãe merece celebração!", hint: "Homenagem: preparação → acordar → surpresa → presente → emoção", skills: ["Amor", "Gratidão", "Planejamento"] },
  { id: 'celebration_5', title: 'Formatura da Escola', category: 'Celebrações', narrator: 'Mila', elements: [ { id: 1, text: "Vestiram a beca azul bonita", icon: "🎓", correctOrder: 1 }, { id: 2, text: "Ensaiaram a música de formatura", icon: "🎵", correctOrder: 2 }, { id: 3, text: "Subiram no palco emocionados", icon: "🎭", correctOrder: 3 }, { id: 4, text: "Receberam o diploma importante", icon: "📜", correctOrder: 4 }, { id: 5, text: "Tiraram foto com toda turma", icon: "📸", correctOrder: 5 } ], completionMessage: "Conquista! Cada etapa vencida é vitória!", hint: "Cerimônia: preparação → ensaio → apresentação → premiação → registro", skills: ["Conquista", "Celebração", "Memórias"] }
];

export default function IntermediateLevel() {
  const router = useRouter();
  
  // Estados para gerenciar o jogo
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [shuffledElements, setShuffledElements] = useState<StoryElement[]>([]);
  const [userSequence, setUserSequence] = useState<StoryElement[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [stars, setStars] = useState(0);

  const currentStory = intermediateStories[currentStoryIndex];

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
      setTotalScore(prev => prev + 150); // Pontuação maior para nível mais difícil
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
    if (currentStoryIndex < intermediateStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    }
  };

  const progressPercentage = (completedStories.length / intermediateStories.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                  <button onClick={() => router.push('/sequential-narrative')} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"><Home className="w-5 h-5 mr-2" /> Menu</button>
                  <div className="text-center flex-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Nível Intermediário</h1>
                      <p className="text-sm text-gray-600 mt-1">História {currentStoryIndex + 1} de {intermediateStories.length}</p>
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
                      {stars > 0 && currentStoryIndex < intermediateStories.length - 1 && (<button onClick={nextStory} className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold shadow-lg hover:bg-green-600 flex items-center gap-2">Próxima História <ChevronRight/></button>)}
                      {/* Botão para o próximo nível */}
                      {stars > 0 && completedStories.length === intermediateStories.length && (<button onClick={() => router.push('/sequential-narrative/advanced')} className="px-6 py-3 bg-purple-500 text-white rounded-lg font-bold shadow-lg hover:bg-purple-600 flex items-center gap-2">Ir para o Nível Avançado <Trophy/></button>)}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
