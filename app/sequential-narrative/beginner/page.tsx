'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Sparkles, ChevronRight, RotateCcw, Home, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// As interfaces não mudam
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

// COLE AQUI A SUA LISTA COMPLETA DE 50 HISTÓRIAS
const beginnerStories: Story[] = [
    { id: 'routine_1', title: 'Acordando para o Dia', category: 'Rotinas Diárias', narrator: 'Leo', elements: [ { id: 1, text: "O despertador tocou bem cedinho", icon: "⏰", correctOrder: 1 }, { id: 2, text: "João abriu os olhos e espreguiçou", icon: "👁️", correctOrder: 2 }, { id: 3, text: "Levantou da cama pronto para o dia", icon: "🛏️", correctOrder: 3 } ], completionMessage: "Muito bem! Você organizou a rotina de acordar!", hint: "Pense: o que acontece primeiro quando acordamos?" },
    { id: 'routine_2', title: 'Hora do Banho', category: 'Rotinas Diárias', narrator: 'Mila', elements: [ { id: 1, text: "Maria tirou a roupa suja", icon: "👕", correctOrder: 1 }, { id: 2, text: "Ensaboou o corpo todo com cuidado", icon: "🧼", correctOrder: 2 }, { id: 3, text: "Secou-se com a toalha macia", icon: "🏖️", correctOrder: 3 } ], completionMessage: "Parabéns! A sequência do banho está perfeita!", hint: "O que fazemos antes de entrar no chuveiro?" },
    { id: 'routine_3', title: 'Café da Manhã Gostoso', category: 'Rotinas Diárias', narrator: 'Leo', elements: [ { id: 1, text: "Pedro sentou à mesa da cozinha", icon: "🪑", correctOrder: 1 }, { id: 2, text: "Comeu cereal com frutas", icon: "🥣", correctOrder: 2 }, { id: 3, text: "Bebeu um copo de leite fresquinho", icon: "🥛", correctOrder: 3 } ], completionMessage: "Excelente! O café da manhã foi organizado!", hint: "Primeiro sentamos, depois comemos!" },
    { id: 'routine_4', title: 'Indo para a Escola', category: 'Rotinas Diárias', narrator: 'Mila', elements: [ { id: 1, text: "Ana vestiu o uniforme escolar", icon: "👔", correctOrder: 1 }, { id: 2, text: "Pegou a mochila com os livros", icon: "🎒", correctOrder: 2 }, { id: 3, text: "Entrou no ônibus amarelo", icon: "🚌", correctOrder: 3 } ], completionMessage: "Ótimo! Ana chegará na escola preparada!", hint: "O que vestimos antes de pegar a mochila?" },
    { id: 'routine_5', title: 'Hora do Lanche', category: 'Rotinas Diárias', narrator: 'Leo', elements: [ { id: 1, text: "Lucas abriu sua lancheira colorida", icon: "📦", correctOrder: 1 }, { id: 2, text: "Comeu a maçã vermelha", icon: "🍎", correctOrder: 2 }, { id: 3, text: "Jogou o lixo na lixeira", icon: "🗑️", correctOrder: 3 } ], completionMessage: "Muito bem! Lucas fez um lanche saudável!", hint: "Abrimos a lancheira antes de comer!" },
    { id: 'routine_6', title: 'Brincando no Parque', category: 'Rotinas Diárias', narrator: 'Mila', elements: [ { id: 1, text: "Sofia subiu a escada do escorregador", icon: "🪜", correctOrder: 1 }, { id: 2, text: "Desceu escorregando rapidinho", icon: "🛝", correctOrder: 2 }, { id: 3, text: "Riu muito feliz com a brincadeira", icon: "😄", correctOrder: 3 } ], completionMessage: "Parabéns! A diversão foi completa!", hint: "Subimos antes de descer no escorregador!" },
    { id: 'routine_7', title: 'Almoço em Família', category: 'Rotinas Diárias', narrator: 'Leo', elements: [ { id: 1, text: "Todos lavaram as mãos", icon: "🙌", correctOrder: 1 }, { id: 2, text: "Comeram a comida deliciosa", icon: "🍽️", correctOrder: 2 }, { id: 3, text: "Agradeceram pela refeição", icon: "🙏", correctOrder: 3 } ], completionMessage: "Excelente! Um almoço perfeito em família!", hint: "Sempre lavamos as mãos antes de comer!" },
    { id: 'routine_8', title: 'Fazendo Xixi', category: 'Rotinas Diárias', narrator: 'Mila', elements: [ { id: 1, text: "Carlos foi ao banheiro", icon: "🚪", correctOrder: 1 }, { id: 2, text: "Fez xixi no vaso sanitário", icon: "🚽", correctOrder: 2 }, { id: 3, text: "Lavou bem as mãozinhas", icon: "🧼", correctOrder: 3 } ], completionMessage: "Muito bem! Higiene é importante!", hint: "Depois de usar o banheiro, sempre lavamos as mãos!" },
    { id: 'routine_9', title: 'Vestindo o Pijama', category: 'Rotinas Diárias', narrator: 'Leo', elements: [ { id: 1, text: "Julia tirou a roupa do dia", icon: "👗", correctOrder: 1 }, { id: 2, text: "Vestiu o pijama quentinho", icon: "🩱", correctOrder: 2 }, { id: 3, text: "Deitou na cama fofinha", icon: "🛌", correctOrder: 3 } ], completionMessage: "Perfeito! Julia está pronta para dormir!", hint: "Tiramos a roupa antes de vestir o pijama!" },
    { id: 'routine_10', title: 'Penteando o Cabelo', category: 'Rotinas Diárias', narrator: 'Mila', elements: [ { id: 1, text: "Laura pegou a escova de cabelo", icon: "🪮", correctOrder: 1 }, { id: 2, text: "Penteou o cabelo com cuidado", icon: "💇‍♀️", correctOrder: 2 }, { id: 3, text: "Guardou a escova no lugar", icon: "🗄️", correctOrder: 3 } ], completionMessage: "Ótimo! O cabelo ficou lindinho!", hint: "Pegamos a escova antes de pentear!" },
    { id: 'routine_11', title: 'Bebendo Água', category: 'Rotinas Diárias', narrator: 'Leo', elements: [ { id: 1, text: "Marcos pegou o copo azul", icon: "🥤", correctOrder: 1 }, { id: 2, text: "Encheu com água geladinha", icon: "💧", correctOrder: 2 }, { id: 3, text: "Bebeu tudo para matar a sede", icon: "😊", correctOrder: 3 } ], completionMessage: "Muito bem! Hidratação é saúde!", hint: "Primeiro pegamos o copo, depois enchemos!" },
    { id: 'routine_12', title: 'Guardando Brinquedos', category: 'Rotinas Diárias', narrator: 'Mila', elements: [ { id: 1, text: "Nina pegou todos os brinquedos", icon: "🧸", correctOrder: 1 }, { id: 2, text: "Colocou tudo na caixa grande", icon: "📦", correctOrder: 2 }, { id: 3, text: "Fechou a tampa da caixa", icon: "🔒", correctOrder: 3 } ], completionMessage: "Parabéns! O quarto ficou organizado!", hint: "Pegamos os brinquedos antes de guardar!" },
    { id: 'routine_13', title: 'Lavando as Mãos', category: 'Rotinas Diárias', narrator: 'Leo', elements: [ { id: 1, text: "Paulo abriu a torneira", icon: "🚰", correctOrder: 1 }, { id: 2, text: "Ensaboou as mãos direitinho", icon: "🧼", correctOrder: 2 }, { id: 3, text: "Secou na toalha limpa", icon: "🤲", correctOrder: 3 } ], completionMessage: "Excelente! Mãos limpinhas!", hint: "Abrimos a torneira primeiro!" },
    { id: 'routine_14', title: 'Hora de Dormir', category: 'Rotinas Diárias', narrator: 'Mila', elements: [ { id: 1, text: "Mamãe apagou a luz do quarto", icon: "💡", correctOrder: 1 }, { id: 2, text: "Gabriel deitou na cama", icon: "🛏️", correctOrder: 2 }, { id: 3, text: "Fechou os olhinhos para sonhar", icon: "😴", correctOrder: 3 } ], completionMessage: "Perfeito! Bons sonhos, Gabriel!", hint: "A luz apaga antes de dormirmos!" },
    { id: 'routine_15', title: 'Acordando Cedo', category: 'Rotinas Diárias', narrator: 'Leo', elements: [ { id: 1, text: "O galo cantou no quintal", icon: "🐓", correctOrder: 1 }, { id: 2, text: "Bia espreguiçou na cama", icon: "🙆‍♀️", correctOrder: 2 }, { id: 3, text: "Levantou animada para brincar", icon: "🏃‍♀️", correctOrder: 3 } ], completionMessage: "Muito bem! Que dia animado!", hint: "O galo canta e depois acordamos!" },
    { id: 'school_1', title: 'Pintando um Desenho', category: 'Atividades Escolares', narrator: 'Mila', elements: [ { id: 1, text: "Rita pegou o pincel novo", icon: "🖌️", correctOrder: 1 }, { id: 2, text: "Molhou na tinta colorida", icon: "🎨", correctOrder: 2 }, { id: 3, text: "Pintou o papel todo bonito", icon: "🖼️", correctOrder: 3 } ], completionMessage: "Lindo! Uma obra de arte!", hint: "Pegamos o pincel antes de molhar na tinta!" },
    { id: 'school_2', title: 'Lendo um Livro', category: 'Atividades Escolares', narrator: 'Leo', elements: [ { id: 1, text: "Bruno escolheu um livro legal", icon: "📚", correctOrder: 1 }, { id: 2, text: "Abriu na primeira página", icon: "📖", correctOrder: 2 }, { id: 3, text: "Viu as figuras coloridas", icon: "🌈", correctOrder: 3 } ], completionMessage: "Ótimo! A leitura é uma aventura!", hint: "Escolhemos o livro antes de abrir!" },
    { id: 'school_3', title: 'Fazendo Fila', category: 'Atividades Escolares', narrator: 'Mila', elements: [ { id: 1, text: "A professora chamou todos", icon: "👩‍🏫", correctOrder: 1 }, { id: 2, text: "As crianças formaram uma fila", icon: "👥", correctOrder: 2 }, { id: 3, text: "Andaram juntos organizados", icon: "🚶‍♂️", correctOrder: 3 } ], completionMessage: "Parabéns! Que fila organizada!", hint: "A professora chama primeiro!" },
    { id: 'school_4', title: 'Hora do Recreio', category: 'Atividades Escolares', narrator: 'Leo', elements: [ { id: 1, text: "O sinal tocou alto", icon: "🔔", correctOrder: 1 }, { id: 2, text: "Todos correram para o pátio", icon: "🏃", correctOrder: 2 }, { id: 3, text: "Voltaram quando acabou", icon: "🚪", correctOrder: 3 } ], completionMessage: "Muito bem! Recreio organizado!", hint: "O sinal toca antes de sairmos!" },
    { id: 'school_5', title: 'Aula de Música', category: 'Atividades Escolares', narrator: 'Mila', elements: [ { id: 1, text: "Cada um pegou um instrumento", icon: "🎸", correctOrder: 1 }, { id: 2, text: "Tocaram uma música juntos", icon: "🎵", correctOrder: 2 }, { id: 3, text: "Guardaram tudo no armário", icon: "🗄️", correctOrder: 3 } ], completionMessage: "Excelente! Que linda melodia!", hint: "Pegamos o instrumento antes de tocar!" },
    { id: 'school_6', title: 'Colando Papel', category: 'Atividades Escolares', narrator: 'Leo', elements: [ { id: 1, text: "Diego passou cola no papel", icon: "🍯", correctOrder: 1 }, { id: 2, text: "Colou na folha grande", icon: "📄", correctOrder: 2 }, { id: 3, text: "Pressionou bem forte", icon: "✋", correctOrder: 3 } ], completionMessage: "Perfeito! Ficou bem colado!", hint: "Passamos cola antes de colar!" },
    { id: 'school_7', title: 'Educação Física', category: 'Atividades Escolares', narrator: 'Mila', elements: [ { id: 1, text: "Todos vestiram tênis", icon: "👟", correctOrder: 1 }, { id: 2, text: "Fizeram exercícios divertidos", icon: "🤸", correctOrder: 2 }, { id: 3, text: "Beberam água geladinha", icon: "💦", correctOrder: 3 } ], completionMessage: "Ótimo! Exercício faz bem!", hint: "Vestimos tênis antes do exercício!" },
    { id: 'school_8', title: 'Hora da História', category: 'Atividades Escolares', narrator: 'Leo', elements: [ { id: 1, text: "Todos sentaram em roda", icon: "⭕", correctOrder: 1 }, { id: 2, text: "Ouviram a professora contar", icon: "👂", correctOrder: 2 }, { id: 3, text: "Bateram palmas no final", icon: "👏", correctOrder: 3 } ], completionMessage: "Muito bem! Que história legal!", hint: "Sentamos antes de ouvir a história!" },
    { id: 'school_9', title: 'Fazendo Desenho', category: 'Atividades Escolares', narrator: 'Mila', elements: [ { id: 1, text: "Sara pegou lápis de cor", icon: "✏️", correctOrder: 1 }, { id: 2, text: "Fez um desenho lindo", icon: "🎨", correctOrder: 2 }, { id: 3, text: "Coloriu tudo bem bonito", icon: "🌈", correctOrder: 3 } ], completionMessage: "Parabéns! Que artista!", hint: "Pegamos o lápis antes de desenhar!" },
    { id: 'school_10', title: 'Montando Quebra-cabeça', category: 'Atividades Escolares', narrator: 'Leo', elements: [ { id: 1, text: "Tom espalhou as peças", icon: "🧩", correctOrder: 1 }, { id: 2, text: "Encaixou uma por uma", icon: "🔧", correctOrder: 2 }, { id: 3, text: "Viu a figura completa", icon: "🖼️", correctOrder: 3 } ], completionMessage: "Excelente! Quebra-cabeça montado!", hint: "Espalhamos as peças primeiro!" },
    { id: 'play_1', title: 'Bolhas de Sabão', category: 'Brincadeiras', narrator: 'Mila', elements: [ { id: 1, text: "Molhou a varinha no pote", icon: "🫧", correctOrder: 1 }, { id: 2, text: "Soprou bem devagarzinho", icon: "💨", correctOrder: 2 }, { id: 3, text: "As bolhas voaram alto", icon: "🎈", correctOrder: 3 } ], completionMessage: "Que lindo! Bolhas mágicas!", hint: "Molhamos antes de soprar!" },
    { id: 'play_2', title: 'Brincando com Massinha', category: 'Brincadeiras', narrator: 'Leo', elements: [ { id: 1, text: "Abriu o pote colorido", icon: "🥫", correctOrder: 1 }, { id: 2, text: "Modelou formas divertidas", icon: "🐍", correctOrder: 2 }, { id: 3, text: "Guardou a massinha depois", icon: "📦", correctOrder: 3 } ], completionMessage: "Muito bem! Que criativo!", hint: "Abrimos o pote primeiro!" },
    { id: 'play_3', title: 'Jogando Bola', category: 'Brincadeiras', narrator: 'Mila', elements: [ { id: 1, text: "João pegou a bola", icon: "⚽", correctOrder: 1 }, { id: 2, text: "Chutou bem forte", icon: "🦵", correctOrder: 2 }, { id: 3, text: "Correu atrás dela", icon: "🏃", correctOrder: 3 } ], completionMessage: "Gooool! Que jogada!", hint: "Pegamos a bola antes de chutar!" },
    { id: 'play_4', title: 'Brincando de Boneca', category: 'Brincadeiras', narrator: 'Leo', elements: [ { id: 1, text: "Lisa pegou sua boneca", icon: "👶", correctOrder: 1 }, { id: 2, text: "Deu comidinha de mentira", icon: "🍼", correctOrder: 2 }, { id: 3, text: "Ninou para dormir", icon: "💤", correctOrder: 3 } ], completionMessage: "Parabéns! Que mamãe carinhosa!", hint: "Pegamos a boneca primeiro!" },
    { id: 'play_5', title: 'Carrinho Veloz', category: 'Brincadeiras', narrator: 'Mila', elements: [ { id: 1, text: "Pedro empurrou o carrinho", icon: "🚗", correctOrder: 1 }, { id: 2, text: "Fez barulho de motor", icon: "🔊", correctOrder: 2 }, { id: 3, text: "Estacionou na garagem", icon: "🏠", correctOrder: 3 } ], completionMessage: "Vruum! Que piloto rápido!", hint: "Empurramos o carrinho primeiro!" },
    { id: 'play_6', title: 'Torre de Blocos', category: 'Brincadeiras', narrator: 'Leo', elements: [ { id: 1, text: "Miguel pegou os blocos", icon: "🧱", correctOrder: 1 }, { id: 2, text: "Empilhou bem alto", icon: "🏗️", correctOrder: 2 }, { id: 3, text: "A torre caiu toda", icon: "💥", correctOrder: 3 } ], completionMessage: "Ops! Vamos construir de novo!", hint: "Pegamos os blocos antes de empilhar!" },
    { id: 'play_7', title: 'Pulando Corda', category: 'Brincadeiras', narrator: 'Mila', elements: [ { id: 1, text: "Ana segurou a corda", icon: "🪢", correctOrder: 1 }, { id: 2, text: "Pulou bem alto", icon: "⬆️", correctOrder: 2 }, { id: 3, text: "Contou até dez", icon: "🔟", correctOrder: 3 } ], completionMessage: "Uau! Dez pulos seguidos!", hint: "Seguramos a corda antes de pular!" },
    { id: 'play_8', title: 'Esconde-esconde', category: 'Brincadeiras', narrator: 'Leo', elements: [ { id: 1, text: "Tiago contou até dez", icon: "🔢", correctOrder: 1 }, { id: 2, text: "Procurou os amigos", icon: "🔍", correctOrder: 2 }, { id: 3, text: "Achou todo mundo", icon: "🎉", correctOrder: 3 } ], completionMessage: "Achei! Todos encontrados!", hint: "Contamos antes de procurar!" },
    { id: 'play_9', title: 'Dançando', category: 'Brincadeiras', narrator: 'Mila', elements: [ { id: 1, text: "A música começou", icon: "🎵", correctOrder: 1 }, { id: 2, text: "Todos mexeram o corpo", icon: "💃", correctOrder: 2 }, { id: 3, text: "Giraram rodando felizes", icon: "🌀", correctOrder: 3 } ], completionMessage: "Que dança animada!", hint: "A música começa primeiro!" },
    { id: 'play_10', title: 'Super-herói', category: 'Brincadeiras', narrator: 'Leo', elements: [ { id: 1, text: "Davi vestiu a capa", icon: "🦸", correctOrder: 1 }, { id: 2, text: "Fingiu voar pelo quintal", icon: "✈️", correctOrder: 2 }, { id: 3, text: "Salvou o dia todo", icon: "🌟", correctOrder: 3 } ], completionMessage: "Super! O herói salvou todos!", hint: "Vestimos a capa antes de voar!" },
    { id: 'food_1', title: 'Fazendo Suco', category: 'Alimentação', narrator: 'Mila', elements: [ { id: 1, text: "Espremeu as laranjas", icon: "🍊", correctOrder: 1 }, { id: 2, text: "Coou o suco no copo", icon: "🥤", correctOrder: 2 }, { id: 3, text: "Bebeu bem geladinho", icon: "🧊", correctOrder: 3 } ], completionMessage: "Delícia! Suco natural!", hint: "Esprememos antes de coar!" },
    { id: 'food_2', title: 'Sanduíche Gostoso', category: 'Alimentação', narrator: 'Leo', elements: [ { id: 1, text: "Pegou duas fatias de pão", icon: "🍞", correctOrder: 1 }, { id: 2, text: "Passou manteiga cremosa", icon: "🧈", correctOrder: 2 }, { id: 3, text: "Comeu com vontade", icon: "😋", correctOrder: 3 } ], completionMessage: "Que sanduíche saboroso!", hint: "Pegamos o pão primeiro!" },
    { id: 'food_3', title: 'Pizza Quentinha', category: 'Alimentação', narrator: 'Mila', elements: [ { id: 1, text: "Pegou uma fatia grande", icon: "🍕", correctOrder: 1 }, { id: 2, text: "Soprou porque estava quente", icon: "💨", correctOrder: 2 }, { id: 3, text: "Mordeu devagarzinho", icon: "😊", correctOrder: 3 } ], completionMessage: "Hmm! Pizza deliciosa!", hint: "Pegamos a fatia antes de soprar!" },
    { id: 'food_4', title: 'Sorvete no Calor', category: 'Alimentação', narrator: 'Leo', elements: [ { id: 1, text: "Abriu o sorvete gelado", icon: "🍦", correctOrder: 1 }, { id: 2, text: "Lambeu bem rápido", icon: "👅", correctOrder: 2 }, { id: 3, text: "Limpou a boca suja", icon: "🧻", correctOrder: 3 } ], completionMessage: "Refrescante! Que sorvete bom!", hint: "Abrimos antes de lamber!" },
    { id: 'food_5', title: 'Maçã Crocante', category: 'Alimentação', narrator: 'Mila', elements: [ { id: 1, text: "Lavou a maçã vermelha", icon: "🍎", correctOrder: 1 }, { id: 2, text: "Mordeu fazendo croc", icon: "🦷", correctOrder: 2 }, { id: 3, text: "Jogou fora as sementes", icon: "🌱", correctOrder: 3 } ], completionMessage: "Saudável! Fruta fresquinha!", hint: "Lavamos a fruta antes de comer!" },
    { id: 'food_6', title: 'Biscoito Crocante', category: 'Alimentação', narrator: 'Leo', elements: [ { id: 1, text: "Abriu o pacote novo", icon: "📦", correctOrder: 1 }, { id: 2, text: "Pegou um biscoito", icon: "🍪", correctOrder: 2 }, { id: 3, text: "Comeu fazendo croc-croc", icon: "😋", correctOrder: 3 } ], completionMessage: "Crocante! Que biscoito gostoso!", hint: "Abrimos o pacote primeiro!" },
    { id: 'food_7', title: 'Pipoca de Cinema', category: 'Alimentação', narrator: 'Mila', elements: [ { id: 1, text: "O milho estourou na panela", icon: "🌽", correctOrder: 1 }, { id: 2, text: "Colocou sal na pipoca", icon: "🧂", correctOrder: 2 }, { id: 3, text: "Comeu assistindo filme", icon: "🎬", correctOrder: 3 } ], completionMessage: "Pop! Pipoca quentinha!", hint: "O milho estoura primeiro!" },
    { id: 'food_8', title: 'Bolo de Aniversário', category: 'Alimentação', narrator: 'Leo', elements: [ { id: 1, text: "Cortou um pedaço grande", icon: "🎂", correctOrder: 1 }, { id: 2, text: "Colocou no pratinho", icon: "🍽️", correctOrder: 2 }, { id: 3, text: "Comeu com alegria", icon: "🎉", correctOrder: 3 } ], completionMessage: "Festa! Bolo delicioso!", hint: "Cortamos antes de colocar no prato!" },
    { id: 'emotion_1', title: 'Presente Surpresa', category: 'Emoções', narrator: 'Mila', elements: [ { id: 1, text: "Ganhou um presente lindo", icon: "🎁", correctOrder: 1 }, { id: 2, text: "Abriu o embrulho colorido", icon: "📦", correctOrder: 2 }, { id: 3, text: "Sorriu muito feliz", icon: "😄", correctOrder: 3 } ], completionMessage: "Que alegria! Presente especial!", hint: "Ganhamos antes de abrir!" },
    { id: 'emotion_2', title: 'Consolando Amigo', category: 'Emoções', narrator: 'Leo', elements: [ { id: 1, text: "Viu o amigo chorando", icon: "😢", correctOrder: 1 }, { id: 2, text: "Deu um abraço apertado", icon: "🤗", correctOrder: 2 }, { id: 3, text: "O amigo ficou melhor", icon: "🙂", correctOrder: 3 } ], completionMessage: "Amizade! Que carinho bonito!", hint: "Vemos a tristeza antes de consolar!" },
    { id: 'emotion_3', title: 'Medo do Trovão', category: 'Emoções', narrator: 'Mila', elements: [ { id: 1, text: "Ouviu o trovão forte", icon: "⛈️", correctOrder: 1 }, { id: 2, text: "Abraçou o ursinho", icon: "🧸", correctOrder: 2 }, { id: 3, text: "Sentiu-se seguro", icon: "🛡️", correctOrder: 3 } ], completionMessage: "Coragem! O medo passou!", hint: "O trovão vem antes do abraço!" },
    { id: 'emotion_4', title: 'Raiva Passando', category: 'Emoções', narrator: 'Leo', elements: [ { id: 1, text: "Ficou muito bravo", icon: "😠", correctOrder: 1 }, { id: 2, text: "Respirou fundo três vezes", icon: "💨", correctOrder: 2 }, { id: 3, text: "O coração se acalmou", icon: "💚", correctOrder: 3 } ], completionMessage: "Calma! Respirar ajuda muito!", hint: "Ficamos bravos antes de respirar!" },
    { id: 'emotion_5', title: 'Visita da Vovó', category: 'Emoções', narrator: 'Mila', elements: [ { id: 1, text: "A porta se abriu", icon: "🚪", correctOrder: 1 }, { id: 2, text: "Viu a vovó querida", icon: "👵", correctOrder: 2 }, { id: 3, text: "Correu para abraçar", icon: "🏃‍♀️", correctOrder: 3 } ], completionMessage: "Amor! Vovó chegou!", hint: "A porta abre primeiro!" },
    { id: 'emotion_6', title: 'Desenho Especial', category: 'Emoções', narrator: 'Leo', elements: [ { id: 1, text: "Fez um desenho caprichado", icon: "✏️", correctOrder: 1 }, { id: 2, text: "Mostrou para a mamãe", icon: "👩", correctOrder: 2 }, { id: 3, text: "Recebeu muitos elogios", icon: "⭐", correctOrder: 3 } ], completionMessage: "Orgulho! Você é um artista!", hint: "Fazemos o desenho antes de mostrar!" },
    { id: 'emotion_7', title: 'Cachorro Amigo', category: 'Emoções', narrator: 'Mila', elements: [ { id: 1, text: "Viu o cachorro fofinho", icon: "🐕", correctOrder: 1 }, { id: 2, text: "Fez carinho na cabeça", icon: "✋", correctOrder: 2 }, { id: 3, text: "Ganhou uma lambida", icon: "💕", correctOrder: 3 } ], completionMessage: "Amizade! Que cachorro carinhoso!", hint: "Vemos o cachorro antes de fazer carinho!" }
];

// Componente para o Jogo de Nível Iniciante
export default function BeginnerLevel() {
  const router = useRouter();
  
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [shuffledElements, setShuffledElements] = useState<StoryElement[]>([]);
  const [userSequence, setUserSequence] = useState<StoryElement[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [completedStories, setCompletedStories] = useState<string[]>([]);
  const [stars, setStars] = useState(0);

  const currentStory = beginnerStories[currentStoryIndex];

  useEffect(() => {
    resetActivity();
  }, [currentStoryIndex]);

  // Lógica de arrastar e soltar (ainda a versão antiga)
  const [draggedItem, setDraggedItem] = useState<StoryElement | null>(null);
  const handleDragStart = (element: StoryElement) => { setDraggedItem(element); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      setUserSequence(prev => [...prev, draggedItem]);
      setShuffledElements(prev => prev.filter(item => item.id !== draggedItem.id));
      setDraggedItem(null);
    }
  };

  const checkSequence = () => {
  };
  const resetActivity = () => {
    setUserSequence([]);
    setShuffledElements([...currentStory.elements].sort(() => Math.random() - 0.5));
    setShowFeedback(false);
    setStars(0);
  };
  const nextStory = () => {
    if (currentStoryIndex < beginnerStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    }
  };

  const progressPercentage = (completedStories.length / beginnerStories.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        
      </div>
    </div>
  );
}
