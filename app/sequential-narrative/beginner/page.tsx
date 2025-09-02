'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Heart, Sparkles, ChevronRight, RotateCcw, Home } from 'lucide-react';

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
}

// 50 HISTÓRIAS DO NÍVEL INICIANTE
const beginnerStories: Story[] = [
  // ROTINAS DIÁRIAS (15 histórias)
  {
    id: 'routine_1',
    title: 'Acordando para o Dia',
    category: 'Rotinas Diárias',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "O despertador tocou bem cedinho", icon: "⏰", correctOrder: 1 },
      { id: 2, text: "João abriu os olhos e espreguiçou", icon: "👁️", correctOrder: 2 },
      { id: 3, text: "Levantou da cama pronto para o dia", icon: "🛏️", correctOrder: 3 }
    ],
    completionMessage: "Muito bem! Você organizou a rotina de acordar!",
    hint: "Pense: o que acontece primeiro quando acordamos?"
  },
  {
    id: 'routine_2',
    title: 'Hora do Banho',
    category: 'Rotinas Diárias',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Maria tirou a roupa suja", icon: "👕", correctOrder: 1 },
      { id: 2, text: "Ensaboou o corpo todo com cuidado", icon: "🧼", correctOrder: 2 },
      { id: 3, text: "Secou-se com a toalha macia", icon: "🏖️", correctOrder: 3 }
    ],
    completionMessage: "Parabéns! A sequência do banho está perfeita!",
    hint: "O que fazemos antes de entrar no chuveiro?"
  },
  {
    id: 'routine_3',
    title: 'Café da Manhã Gostoso',
    category: 'Rotinas Diárias',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Pedro sentou à mesa da cozinha", icon: "🪑", correctOrder: 1 },
      { id: 2, text: "Comeu cereal com frutas", icon: "🥣", correctOrder: 2 },
      { id: 3, text: "Bebeu um copo de leite fresquinho", icon: "🥛", correctOrder: 3 }
    ],
    completionMessage: "Excelente! O café da manhã foi organizado!",
    hint: "Primeiro sentamos, depois comemos!"
  },
  {
    id: 'routine_4',
    title: 'Indo para a Escola',
    category: 'Rotinas Diárias',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Ana vestiu o uniforme escolar", icon: "👔", correctOrder: 1 },
      { id: 2, text: "Pegou a mochila com os livros", icon: "🎒", correctOrder: 2 },
      { id: 3, text: "Entrou no ônibus amarelo", icon: "🚌", correctOrder: 3 }
    ],
    completionMessage: "Ótimo! Ana chegará na escola preparada!",
    hint: "O que vestimos antes de pegar a mochila?"
  },
  {
    id: 'routine_5',
    title: 'Hora do Lanche',
    category: 'Rotinas Diárias',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Lucas abriu sua lancheira colorida", icon: "📦", correctOrder: 1 },
      { id: 2, text: "Comeu a maçã vermelha", icon: "🍎", correctOrder: 2 },
      { id: 3, text: "Jogou o lixo na lixeira", icon: "🗑️", correctOrder: 3 }
    ],
    completionMessage: "Muito bem! Lucas fez um lanche saudável!",
    hint: "Abrimos a lancheira antes de comer!"
  },
  {
    id: 'routine_6',
    title: 'Brincando no Parque',
    category: 'Rotinas Diárias',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Sofia subiu a escada do escorregador", icon: "🪜", correctOrder: 1 },
      { id: 2, text: "Desceu escorregando rapidinho", icon: "🛝", correctOrder: 2 },
      { id: 3, text: "Riu muito feliz com a brincadeira", icon: "😄", correctOrder: 3 }
    ],
    completionMessage: "Parabéns! A diversão foi completa!",
    hint: "Subimos antes de descer no escorregador!"
  },
  {
    id: 'routine_7',
    title: 'Almoço em Família',
    category: 'Rotinas Diárias',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Todos lavaram as mãos", icon: "🙌", correctOrder: 1 },
      { id: 2, text: "Comeram a comida deliciosa", icon: "🍽️", correctOrder: 2 },
      { id: 3, text: "Agradeceram pela refeição", icon: "🙏", correctOrder: 3 }
    ],
    completionMessage: "Excelente! Um almoço perfeito em família!",
    hint: "Sempre lavamos as mãos antes de comer!"
  },
  {
    id: 'routine_8',
    title: 'Fazendo Xixi',
    category: 'Rotinas Diárias',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Carlos foi ao banheiro", icon: "🚪", correctOrder: 1 },
      { id: 2, text: "Fez xixi no vaso sanitário", icon: "🚽", correctOrder: 2 },
      { id: 3, text: "Lavou bem as mãozinhas", icon: "🧼", correctOrder: 3 }
    ],
    completionMessage: "Muito bem! Higiene é importante!",
    hint: "Depois de usar o banheiro, sempre lavamos as mãos!"
  },
  {
    id: 'routine_9',
    title: 'Vestindo o Pijama',
    category: 'Rotinas Diárias',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Julia tirou a roupa do dia", icon: "👗", correctOrder: 1 },
      { id: 2, text: "Vestiu o pijama quentinho", icon: "🩱", correctOrder: 2 },
      { id: 3, text: "Deitou na cama fofinha", icon: "🛌", correctOrder: 3 }
    ],
    completionMessage: "Perfeito! Julia está pronta para dormir!",
    hint: "Tiramos a roupa antes de vestir o pijama!"
  },
  {
    id: 'routine_10',
    title: 'Penteando o Cabelo',
    category: 'Rotinas Diárias',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Laura pegou a escova de cabelo", icon: "🪮", correctOrder: 1 },
      { id: 2, text: "Penteou o cabelo com cuidado", icon: "💇‍♀️", correctOrder: 2 },
      { id: 3, text: "Guardou a escova no lugar", icon: "🗄️", correctOrder: 3 }
    ],
    completionMessage: "Ótimo! O cabelo ficou lindinho!",
    hint: "Pegamos a escova antes de pentear!"
  },
  {
    id: 'routine_11',
    title: 'Bebendo Água',
    category: 'Rotinas Diárias',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Marcos pegou o copo azul", icon: "🥤", correctOrder: 1 },
      { id: 2, text: "Encheu com água geladinha", icon: "💧", correctOrder: 2 },
      { id: 3, text: "Bebeu tudo para matar a sede", icon: "😊", correctOrder: 3 }
    ],
    completionMessage: "Muito bem! Hidratação é saúde!",
    hint: "Primeiro pegamos o copo, depois enchemos!"
  },
  {
    id: 'routine_12',
    title: 'Guardando Brinquedos',
    category: 'Rotinas Diárias',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Nina pegou todos os brinquedos", icon: "🧸", correctOrder: 1 },
      { id: 2, text: "Colocou tudo na caixa grande", icon: "📦", correctOrder: 2 },
      { id: 3, text: "Fechou a tampa da caixa", icon: "🔒", correctOrder: 3 }
    ],
    completionMessage: "Parabéns! O quarto ficou organizado!",
    hint: "Pegamos os brinquedos antes de guardar!"
  },
  {
    id: 'routine_13',
    title: 'Lavando as Mãos',
    category: 'Rotinas Diárias',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Paulo abriu a torneira", icon: "🚰", correctOrder: 1 },
      { id: 2, text: "Ensaboou as mãos direitinho", icon: "🧼", correctOrder: 2 },
      { id: 3, text: "Secou na toalha limpa", icon: "🤲", correctOrder: 3 }
    ],
    completionMessage: "Excelente! Mãos limpinhas!",
    hint: "Abrimos a torneira primeiro!"
  },
  {
    id: 'routine_14',
    title: 'Hora de Dormir',
    category: 'Rotinas Diárias',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Mamãe apagou a luz do quarto", icon: "💡", correctOrder: 1 },
      { id: 2, text: "Gabriel deitou na cama", icon: "🛏️", correctOrder: 2 },
      { id: 3, text: "Fechou os olhinhos para sonhar", icon: "😴", correctOrder: 3 }
    ],
    completionMessage: "Perfeito! Bons sonhos, Gabriel!",
    hint: "A luz apaga antes de dormirmos!"
  },
  {
    id: 'routine_15',
    title: 'Acordando Cedo',
    category: 'Rotinas Diárias',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "O galo cantou no quintal", icon: "🐓", correctOrder: 1 },
      { id: 2, text: "Bia espreguiçou na cama", icon: "🙆‍♀️", correctOrder: 2 },
      { id: 3, text: "Levantou animada para brincar", icon: "🏃‍♀️", correctOrder: 3 }
    ],
    completionMessage: "Muito bem! Que dia animado!",
    hint: "O galo canta e depois acordamos!"
  },

  // ATIVIDADES ESCOLARES (10 histórias)
  {
    id: 'school_1',
    title: 'Pintando um Desenho',
    category: 'Atividades Escolares',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Rita pegou o pincel novo", icon: "🖌️", correctOrder: 1 },
      { id: 2, text: "Molhou na tinta colorida", icon: "🎨", correctOrder: 2 },
      { id: 3, text: "Pintou o papel todo bonito", icon: "🖼️", correctOrder: 3 }
    ],
    completionMessage: "Lindo! Uma obra de arte!",
    hint: "Pegamos o pincel antes de molhar na tinta!"
  },
  {
    id: 'school_2',
    title: 'Lendo um Livro',
    category: 'Atividades Escolares',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Bruno escolheu um livro legal", icon: "📚", correctOrder: 1 },
      { id: 2, text: "Abriu na primeira página", icon: "📖", correctOrder: 2 },
      { id: 3, text: "Viu as figuras coloridas", icon: "🌈", correctOrder: 3 }
    ],
    completionMessage: "Ótimo! A leitura é uma aventura!",
    hint: "Escolhemos o livro antes de abrir!"
  },
  {
    id: 'school_3',
    title: 'Fazendo Fila',
    category: 'Atividades Escolares',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "A professora chamou todos", icon: "👩‍🏫", correctOrder: 1 },
      { id: 2, text: "As crianças formaram uma fila", icon: "👥", correctOrder: 2 },
      { id: 3, text: "Andaram juntos organizados", icon: "🚶‍♂️", correctOrder: 3 }
    ],
    completionMessage: "Parabéns! Que fila organizada!",
    hint: "A professora chama primeiro!"
  },
  {
    id: 'school_4',
    title: 'Hora do Recreio',
    category: 'Atividades Escolares',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "O sinal tocou alto", icon: "🔔", correctOrder: 1 },
      { id: 2, text: "Todos correram para o pátio", icon: "🏃", correctOrder: 2 },
      { id: 3, text: "Voltaram quando acabou", icon: "🚪", correctOrder: 3 }
    ],
    completionMessage: "Muito bem! Recreio organizado!",
    hint: "O sinal toca antes de sairmos!"
  },
  {
    id: 'school_5',
    title: 'Aula de Música',
    category: 'Atividades Escolares',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Cada um pegou um instrumento", icon: "🎸", correctOrder: 1 },
      { id: 2, text: "Tocaram uma música juntos", icon: "🎵", correctOrder: 2 },
      { id: 3, text: "Guardaram tudo no armário", icon: "🗄️", correctOrder: 3 }
    ],
    completionMessage: "Excelente! Que linda melodia!",
    hint: "Pegamos o instrumento antes de tocar!"
  },
  {
    id: 'school_6',
    title: 'Colando Papel',
    category: 'Atividades Escolares',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Diego passou cola no papel", icon: "🍯", correctOrder: 1 },
      { id: 2, text: "Colou na folha grande", icon: "📄", correctOrder: 2 },
      { id: 3, text: "Pressionou bem forte", icon: "✋", correctOrder: 3 }
    ],
    completionMessage: "Perfeito! Ficou bem colado!",
    hint: "Passamos cola antes de colar!"
  },
  {
    id: 'school_7',
    title: 'Educação Física',
    category: 'Atividades Escolares',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Todos vestiram tênis", icon: "👟", correctOrder: 1 },
      { id: 2, text: "Fizeram exercícios divertidos", icon: "🤸", correctOrder: 2 },
      { id: 3, text: "Beberam água geladinha", icon: "💦", correctOrder: 3 }
    ],
    completionMessage: "Ótimo! Exercício faz bem!",
    hint: "Vestimos tênis antes do exercício!"
  },
  {
    id: 'school_8',
    title: 'Hora da História',
    category: 'Atividades Escolares',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Todos sentaram em roda", icon: "⭕", correctOrder: 1 },
      { id: 2, text: "Ouviram a professora contar", icon: "👂", correctOrder: 2 },
      { id: 3, text: "Bateram palmas no final", icon: "👏", correctOrder: 3 }
    ],
    completionMessage: "Muito bem! Que história legal!",
    hint: "Sentamos antes de ouvir a história!"
  },
  {
    id: 'school_9',
    title: 'Fazendo Desenho',
    category: 'Atividades Escolares',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Sara pegou lápis de cor", icon: "✏️", correctOrder: 1 },
      { id: 2, text: "Fez um desenho lindo", icon: "🎨", correctOrder: 2 },
      { id: 3, text: "Coloriu tudo bem bonito", icon: "🌈", correctOrder: 3 }
    ],
    completionMessage: "Parabéns! Que artista!",
    hint: "Pegamos o lápis antes de desenhar!"
  },
  {
    id: 'school_10',
    title: 'Montando Quebra-cabeça',
    category: 'Atividades Escolares',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Tom espalhou as peças", icon: "🧩", correctOrder: 1 },
      { id: 2, text: "Encaixou uma por uma", icon: "🔧", correctOrder: 2 },
      { id: 3, text: "Viu a figura completa", icon: "🖼️", correctOrder: 3 }
    ],
    completionMessage: "Excelente! Quebra-cabeça montado!",
    hint: "Espalhamos as peças primeiro!"
  },

  // BRINCADEIRAS (10 histórias)
  {
    id: 'play_1',
    title: 'Bolhas de Sabão',
    category: 'Brincadeiras',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Molhou a varinha no pote", icon: "🫧", correctOrder: 1 },
      { id: 2, text: "Soprou bem devagarzinho", icon: "💨", correctOrder: 2 },
      { id: 3, text: "As bolhas voaram alto", icon: "🎈", correctOrder: 3 }
    ],
    completionMessage: "Que lindo! Bolhas mágicas!",
    hint: "Molhamos antes de soprar!"
  },
  {
    id: 'play_2',
    title: 'Brincando com Massinha',
    category: 'Brincadeiras',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Abriu o pote colorido", icon: "🥫", correctOrder: 1 },
      { id: 2, text: "Modelou formas divertidas", icon: "🐍", correctOrder: 2 },
      { id: 3, text: "Guardou a massinha depois", icon: "📦", correctOrder: 3 }
    ],
    completionMessage: "Muito bem! Que criativo!",
    hint: "Abrimos o pote primeiro!"
  },
  {
    id: 'play_3',
    title: 'Jogando Bola',
    category: 'Brincadeiras',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "João pegou a bola", icon: "⚽", correctOrder: 1 },
      { id: 2, text: "Chutou bem forte", icon: "🦵", correctOrder: 2 },
      { id: 3, text: "Correu atrás dela", icon: "🏃", correctOrder: 3 }
    ],
    completionMessage: "Gooool! Que jogada!",
    hint: "Pegamos a bola antes de chutar!"
  },
  {
    id: 'play_4',
    title: 'Brincando de Boneca',
    category: 'Brincadeiras',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Lisa pegou sua boneca", icon: "👶", correctOrder: 1 },
      { id: 2, text: "Deu comidinha de mentira", icon: "🍼", correctOrder: 2 },
      { id: 3, text: "Ninou para dormir", icon: "💤", correctOrder: 3 }
    ],
    completionMessage: "Parabéns! Que mamãe carinhosa!",
    hint: "Pegamos a boneca primeiro!"
  },
  {
    id: 'play_5',
    title: 'Carrinho Veloz',
    category: 'Brincadeiras',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Pedro empurrou o carrinho", icon: "🚗", correctOrder: 1 },
      { id: 2, text: "Fez barulho de motor", icon: "🔊", correctOrder: 2 },
      { id: 3, text: "Estacionou na garagem", icon: "🏠", correctOrder: 3 }
    ],
    completionMessage: "Vruum! Que piloto rápido!",
    hint: "Empurramos o carrinho primeiro!"
  },
  {
    id: 'play_6',
    title: 'Torre de Blocos',
    category: 'Brincadeiras',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Miguel pegou os blocos", icon: "🧱", correctOrder: 1 },
      { id: 2, text: "Empilhou bem alto", icon: "🏗️", correctOrder: 2 },
      { id: 3, text: "A torre caiu toda", icon: "💥", correctOrder: 3 }
    ],
    completionMessage: "Ops! Vamos construir de novo!",
    hint: "Pegamos os blocos antes de empilhar!"
  },
  {
    id: 'play_7',
    title: 'Pulando Corda',
    category: 'Brincadeiras',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Ana segurou a corda", icon: "🪢", correctOrder: 1 },
      { id: 2, text: "Pulou bem alto", icon: "⬆️", correctOrder: 2 },
      { id: 3, text: "Contou até dez", icon: "🔟", correctOrder: 3 }
    ],
    completionMessage: "Uau! Dez pulos seguidos!",
    hint: "Seguramos a corda antes de pular!"
  },
  {
    id: 'play_8',
    title: 'Esconde-esconde',
    category: 'Brincadeiras',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Tiago contou até dez", icon: "🔢", correctOrder: 1 },
      { id: 2, text: "Procurou os amigos", icon: "🔍", correctOrder: 2 },
      { id: 3, text: "Achou todo mundo", icon: "🎉", correctOrder: 3 }
    ],
    completionMessage: "Achei! Todos encontrados!",
    hint: "Contamos antes de procurar!"
  },
  {
    id: 'play_9',
    title: 'Dançando',
    category: 'Brincadeiras',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "A música começou", icon: "🎵", correctOrder: 1 },
      { id: 2, text: "Todos mexeram o corpo", icon: "💃", correctOrder: 2 },
      { id: 3, text: "Giraram rodando felizes", icon: "🌀", correctOrder: 3 }
    ],
    completionMessage: "Que dança animada!",
    hint: "A música começa primeiro!"
  },
  {
    id: 'play_10',
    title: 'Super-herói',
    category: 'Brincadeiras',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Davi vestiu a capa", icon: "🦸", correctOrder: 1 },
      { id: 2, text: "Fingiu voar pelo quintal", icon: "✈️", correctOrder: 2 },
      { id: 3, text: "Salvou o dia todo", icon: "🌟", correctOrder: 3 }
    ],
    completionMessage: "Super! O herói salvou todos!",
    hint: "Vestimos a capa antes de voar!"
  },

  // ALIMENTAÇÃO (8 histórias)
  {
    id: 'food_1',
    title: 'Fazendo Suco',
    category: 'Alimentação',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Espremeu as laranjas", icon: "🍊", correctOrder: 1 },
      { id: 2, text: "Coou o suco no copo", icon: "🥤", correctOrder: 2 },
      { id: 3, text: "Bebeu bem geladinho", icon: "🧊", correctOrder: 3 }
    ],
    completionMessage: "Delícia! Suco natural!",
    hint: "Esprememos antes de coar!"
  },
  {
    id: 'food_2',
    title: 'Sanduíche Gostoso',
    category: 'Alimentação',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Pegou duas fatias de pão", icon: "🍞", correctOrder: 1 },
      { id: 2, text: "Passou manteiga cremosa", icon: "🧈", correctOrder: 2 },
      { id: 3, text: "Comeu com vontade", icon: "😋", correctOrder: 3 }
    ],
    completionMessage: "Que sanduíche saboroso!",
    hint: "Pegamos o pão primeiro!"
  },
  {
    id: 'food_3',
    title: 'Pizza Quentinha',
    category: 'Alimentação',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Pegou uma fatia grande", icon: "🍕", correctOrder: 1 },
      { id: 2, text: "Soprou porque estava quente", icon: "💨", correctOrder: 2 },
      { id: 3, text: "Mordeu devagarzinho", icon: "😊", correctOrder: 3 }
    ],
    completionMessage: "Hmm! Pizza deliciosa!",
    hint: "Pegamos a fatia antes de soprar!"
  },
  {
    id: 'food_4',
    title: 'Sorvete no Calor',
    category: 'Alimentação',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Abriu o sorvete gelado", icon: "🍦", correctOrder: 1 },
      { id: 2, text: "Lambeu bem rápido", icon: "👅", correctOrder: 2 },
      { id: 3, text: "Limpou a boca suja", icon: "🧻", correctOrder: 3 }
    ],
    completionMessage: "Refrescante! Que sorvete bom!",
    hint: "Abrimos antes de lamber!"
  },
  {
    id: 'food_5',
    title: 'Maçã Crocante',
    category: 'Alimentação',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Lavou a maçã vermelha", icon: "🍎", correctOrder: 1 },
      { id: 2, text: "Mordeu fazendo croc", icon: "🦷", correctOrder: 2 },
      { id: 3, text: "Jogou fora as sementes", icon: "🌱", correctOrder: 3 }
    ],
    completionMessage: "Saudável! Fruta fresquinha!",
    hint: "Lavamos a fruta antes de comer!"
  },
  {
    id: 'food_6',
    title: 'Biscoito Crocante',
    category: 'Alimentação',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Abriu o pacote novo", icon: "📦", correctOrder: 1 },
      { id: 2, text: "Pegou um biscoito", icon: "🍪", correctOrder: 2 },
      { id: 3, text: "Comeu fazendo croc-croc", icon: "😋", correctOrder: 3 }
    ],
    completionMessage: "Crocante! Que biscoito gostoso!",
    hint: "Abrimos o pacote primeiro!"
  },
  {
    id: 'food_7',
    title: 'Pipoca de Cinema',
    category: 'Alimentação',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "O milho estourou na panela", icon: "🌽", correctOrder: 1 },
      { id: 2, text: "Colocou sal na pipoca", icon: "🧂", correctOrder: 2 },
      { id: 3, text: "Comeu assistindo filme", icon: "🎬", correctOrder: 3 }
    ],
    completionMessage: "Pop! Pipoca quentinha!",
    hint: "O milho estoura primeiro!"
  },
  {
    id: 'food_8',
    title: 'Bolo de Aniversário',
    category: 'Alimentação',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Cortou um pedaço grande", icon: "🎂", correctOrder: 1 },
      { id: 2, text: "Colocou no pratinho", icon: "🍽️", correctOrder: 2 },
      { id: 3, text: "Comeu com alegria", icon: "🎉", correctOrder: 3 }
    ],
    completionMessage: "Festa! Bolo delicioso!",
    hint: "Cortamos antes de colocar no prato!"
  },

  // EMOÇÕES SIMPLES (7 histórias)
  {
    id: 'emotion_1',
    title: 'Presente Surpresa',
    category: 'Emoções',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Ganhou um presente lindo", icon: "🎁", correctOrder: 1 },
      { id: 2, text: "Abriu o embrulho colorido", icon: "📦", correctOrder: 2 },
      { id: 3, text: "Sorriu muito feliz", icon: "😄", correctOrder: 3 }
    ],
    completionMessage: "Que alegria! Presente especial!",
    hint: "Ganhamos antes de abrir!"
  },
  {
    id: 'emotion_2',
    title: 'Consolando Amigo',
    category: 'Emoções',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Viu o amigo chorando", icon: "😢", correctOrder: 1 },
      { id: 2, text: "Deu um abraço apertado", icon: "🤗", correctOrder: 2 },
      { id: 3, text: "O amigo ficou melhor", icon: "🙂", correctOrder: 3 }
    ],
    completionMessage: "Amizade! Que carinho bonito!",
    hint: "Vemos a tristeza antes de consolar!"
  },
  {
    id: 'emotion_3',
    title: 'Medo do Trovão',
    category: 'Emoções',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Ouviu o trovão forte", icon: "⛈️", correctOrder: 1 },
      { id: 2, text: "Abraçou o ursinho", icon: "🧸", correctOrder: 2 },
      { id: 3, text: "Sentiu-se seguro", icon: "🛡️", correctOrder: 3 }
    ],
    completionMessage: "Coragem! O medo passou!",
    hint: "O trovão vem antes do abraço!"
  },
  {
    id: 'emotion_4',
    title: 'Raiva Passando',
    category: 'Emoções',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Ficou muito bravo", icon: "😠", correctOrder: 1 },
      { id: 2, text: "Respirou fundo três vezes", icon: "💨", correctOrder: 2 },
      { id: 3, text: "O coração se acalmou", icon: "💚", correctOrder: 3 }
    ],
    completionMessage: "Calma! Respirar ajuda muito!",
    hint: "Ficamos bravos antes de respirar!"
  },
  {
    id: 'emotion_5',
    title: 'Visita da Vovó',
    category: 'Emoções',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "A porta se abriu", icon: "🚪", correctOrder: 1 },
      { id: 2, text: "Viu a vovó querida", icon: "👵", correctOrder: 2 },
      { id: 3, text: "Correu para abraçar", icon: "🏃‍♀️", correctOrder: 3 }
    ],
    completionMessage: "Amor! Vovó chegou!",
    hint: "A porta abre primeiro!"
  },
  {
    id: 'emotion_6',
    title: 'Desenho Especial',
    category: 'Emoções',
    narrator: 'Leo',
    elements: [
      { id: 1, text: "Fez um desenho caprichado", icon: "✏️", correctOrder: 1 },
      { id: 2, text: "Mostrou para a mamãe", icon: "👩", correctOrder: 2 },
      { id: 3, text: "Recebeu muitos elogios", icon: "⭐", correctOrder: 3 }
    ],
    completionMessage: "Orgulho! Você é um artista!",
    hint: "Fazemos o desenho antes de mostrar!"
  },
  {
    id: 'emotion_7',
    title: 'Cachorro Amigo',
    category: 'Emoções',
    narrator: 'Mila',
    elements: [
      { id: 1, text: "Viu o cachorro fofinho", icon: "🐕", correctOrder: 1 },
      { id: 2, text: "Fez carinho na cabeça", icon: "✋", correctOrder: 2 },
      { id: 3, text: "Ganhou uma lambida", icon: "💕", correctOrder: 3 }
    ],
    completionMessage: "Amizade! Que cachorro carinhoso!",
    hint: "Vemos o cachorro antes de fazer carinho!"
  }
];

export default function BeginnerLevel() {
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
  const currentStory = beginnerStories[currentStoryIndex];

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
    if (userSequence.length !== 3) {
      alert('Por favor, organize todos os 3 elementos da história!');
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
    if (currentStoryIndex < beginnerStories.length - 1) {
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
  const progressPercentage = (completedStories.length / beginnerStories.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
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
                Nível Iniciante
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                História {currentStoryIndex + 1} de {beginnerStories.length}
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
              <span>{completedStories.length}/{beginnerStories.length} histórias</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 flex items-center justify-center"
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
                  <p className="text-sm text-gray-600">
                    Narrado por {currentStory.narrator} • {currentStory.category}
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
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Elementos Disponíveis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🧩</span>
              Partes da História
            </h3>
            
            <div className="space-y-3">
              {shuffledElements.map((element) => (
                <div
                  key={element.id}
                  draggable
                  onDragStart={() => handleDragStart(element)}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4 cursor-move hover:shadow-md transition-all transform hover:scale-[1.02]"
                >
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{element.icon}</span>
                    <p className="text-gray-800 flex-1">{element.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {shuffledElements.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                <p>Todas as partes foram organizadas!</p>
              </div>
            )}
          </div>

          {/* Área de Sequência */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📖</span>
              Monte a História na Ordem
            </h3>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="min-h-[350px] border-3 border-dashed border-purple-300 rounded-lg p-4 space-y-3 bg-purple-50/30"
            >
              {userSequence.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-5xl mb-3">👆</div>
                  <p className="text-lg">Arraste as partes aqui</p>
                  <p className="text-sm mt-2">Coloque na ordem: início → meio → fim</p>
                </div>
              )}

              {userSequence.map((element, index) => (
                <div
                  key={element.id}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-lg p-4 relative transform transition-all hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mr-3 text-lg font-bold shadow-md">
                      {index + 1}°
                    </div>
                    <span className="text-3xl mr-3">{element.icon}</span>
                    <p className="text-gray-800 flex-1 font-medium">{element.text}</p>
                    <button
                      onClick={() => removeFromSequence(element)}
                      className="text-red-500 hover:text-red-700 text-2xl ml-2 transition-colors"
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
                disabled={userSequence.length !== 3}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all transform ${
                  userSequence.length === 3
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Verificar História
              </button>
              
              <button
                onClick={resetActivity}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Tentar Novamente
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
                  {score === 100 ? '🎉 Parabéns!' : '💪 Quase lá!'}
                </h3>
                <p className={`text-lg ${score === 100 ? 'text-green-700' : 'text-orange-700'}`}>
                  {score === 100 
                    ? currentStory.completionMessage
                    : 'Pense na ordem: o que aconteceu primeiro?'
                  }
                </p>
                
                {score === 100 && (
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
                )}
              </div>
              
              {score === 100 && currentStoryIndex < beginnerStories.length - 1 && (
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
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            ← História Anterior
          </button>
          
          <div className="flex items-center gap-2">
            {beginnerStories.map((story, index) => (
              <button
                key={story.id}
                onClick={() => setCurrentStoryIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStoryIndex
                    ? 'bg-purple-500 w-8'
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
            disabled={currentStoryIndex === beginnerStories.length - 1}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              currentStoryIndex < beginnerStories.length - 1
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Próxima História →
          </button>
        </div>

        {/* Conquistas */}
        {completedStories.length === beginnerStories.length && (
          <div className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 text-center">
            <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              🎊 Nível Iniciante Completo! 🎊
            </h2>
            <p className="text-gray-700 mb-4">
              Você completou todas as {beginnerStories.length} histórias!
            </p>
            <button
              onClick={() => router.push('/sequential-narrative/intermediate')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Avançar para Nível Intermediário →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
