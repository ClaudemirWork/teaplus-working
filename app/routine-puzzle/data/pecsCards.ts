// MAPEAMENTO COMPLETO DOS CARDS PECS
export const PECS_CARDS = {
  rotina: [
    // Rotina Básica de Despertar/Dormir
    { id: 'acordar', name: 'Acordar', image: '/images/cards/rotina/hora_acordar.webp', time: '07:00' },
    { id: 'dormir', name: 'Dormir', image: '/images/cards/rotina/hora_dormir.webp', time: '20:30' },
    
    // Refeições
    { id: 'cafe_manha', name: 'Café da Manhã', image: '/images/cards/rotina/cafe_manha.webp', time: '07:30' },
    { id: 'almoco', name: 'Almoço', image: '/images/cards/rotina/almoco.webp', time: '12:00' },
    { id: 'cafe_tarde', name: 'Café da Tarde', image: '/images/cards/rotina/cafe_tarde.webp', time: '16:00' },
    { id: 'jantar', name: 'Jantar', image: '/images/cards/rotina/jantar.webp', time: '19:00' },
    
    // Higiene
    { id: 'banho', name: 'Tomar Banho', image: '/images/cards/rotina/tomar_banho.webp', time: '08:00' },
    
    // Escola e Estudos
    { id: 'escola', name: 'Ir para Escola', image: '/images/cards/rotina/mochila_escola.webp', time: '08:30' },
    { id: 'estudar', name: 'Estudar', image: '/images/cards/rotina/estudar.webp', time: '14:00' },
    { id: 'licao_casa', name: 'Lição de Casa', image: '/images/cards/rotina/licao_casa.webp', time: '17:00' },
    { id: 'sem_escola', name: 'Sem Escola Hoje', image: '/images/cards/rotina/sem_escola_hoje_resultado.webp', time: '08:00' },
    
    // Estudos Específicos
    { id: 'estudar_matematica', name: 'Matemática', image: '/images/cards/rotina/estudar_matematica.webp', time: '14:30' },
    { id: 'estudar_ingles', name: 'Inglês', image: '/images/cards/rotina/estudar_ingles.webp', time: '15:00' },
    { id: 'estudar_historia', name: 'História', image: '/images/cards/rotina/estudar_historia.webp', time: '15:30' },
    { id: 'estudar_geografia', name: 'Geografia', image: '/images/cards/rotina/estudar_geografia.webp', time: '16:00' },
    { id: 'estudar_computacao', name: 'Computação', image: '/images/cards/rotina/estudar_computacao.webp', time: '16:30' },
    { id: 'estudar_computador', name: 'Computador', image: '/images/cards/rotina/estudar_computador_casa.webp', time: '17:00' },
    
    // Aulas Especiais
    { id: 'aula_musica', name: 'Aula de Música', image: '/images/cards/rotina/aula_musica_resultado.webp', time: '10:00' },
    { id: 'aula_natacao', name: 'Natação', image: '/images/cards/rotina/aula_natacao_resultado.webp', time: '09:00' },
    { id: 'educacao_fisica', name: 'Educação Física', image: '/images/cards/rotina/aula_educacao_fisica_resultado.webp', time: '10:00' },
    { id: 'aula_ciencias', name: 'Ciências', image: '/images/cards/rotina/aula_ciencias_resultado.webp', time: '11:00' },
    { id: 'aula_algebra', name: 'Álgebra', image: '/images/cards/rotina/aula_algebra_resultado.webp', time: '11:30' },
    
    // Lazer e Diversão
    { id: 'brincar', name: 'Brincar', image: '/images/cards/rotina/brincar.webp', time: '15:00' },
    { id: 'ver_tv', name: 'Ver TV', image: '/images/cards/rotina/ver_televisao.webp', time: '18:00' },
    
    // Locomoção
    { id: 'ir_casa', name: 'Ir para Casa', image: '/images/cards/rotina/Ir para casa.webp', time: '17:30' },
    
    // Dias da Semana
    { id: 'terca_dia', name: 'Terça-feira', image: '/images/cards/rotina/terca_feira.webp', time: '00:00' },
    { id: 'quarta_dia', name: 'Quarta-feira', image: '/images/cards/rotina/quarta_feira.webp', time: '00:00' },
    { id: 'quinta_dia', name: 'Quinta-feira', image: '/images/cards/rotina/quinta_feira.webp', time: '00:00' },
    { id: 'sexta_dia', name: 'Sexta-feira', image: '/images/cards/rotina/sexta_feira.webp', time: '00:00' },
    { id: 'sabado_dia', name: 'Sábado', image: '/images/cards/rotina/sabado.webp', time: '00:00' },
    { id: 'domingo_dia', name: 'Domingo', image: '/images/cards/rotina/domingo.webp', time: '00:00' },
    { id: 'semana', name: 'Semana', image: '/images/cards/rotina/semana.webp', time: '00:00' },
    
    // Tempo/Temporalidade
    { id: 'hoje', name: 'Hoje', image: '/images/cards/rotina/hoje.webp', time: '00:00' },
    { id: 'amanha', name: 'Amanhã', image: '/images/cards/rotina/amanha.webp', time: '00:00' },
    { id: 'ontem', name: 'Ontem', image: '/images/cards/rotina/Ontem.webp', time: '00:00' },
    
    // Períodos do Dia
    { id: 'manha', name: 'Manhã', image: '/images/cards/rotina/manha.webp', time: '06:00' },
    { id: 'tarde', name: 'Tarde', image: '/images/cards/rotina/Tarde.webp', time: '12:00' },
    { id: 'noite', name: 'Noite', image: '/images/cards/rotina/noite.webp', time: '18:00' },
    
    // Clima
    { id: 'ensolarado', name: 'Ensolarado', image: '/images/cards/rotina/ensolarado.webp', time: '00:00' },
    { id: 'chuva', name: 'Chuva', image: '/images/cards/rotina/chuva.webp', time: '00:00' },
    { id: 'mudanca_tempo', name: 'Mudança de Tempo', image: '/images/cards/rotina/mudanca_tempo.webp', time: '00:00' },
    { id: 'arco_iris', name: 'Arco-íris', image: '/images/cards/rotina/arco_iris.webp', time: '00:00' },
  ],
  
  acoes: [
    { id: 'escovar_dentes', name: 'Escovar Dentes', image: '/images/cards/acoes/escovar os dentes.webp', time: '07:15' },
    { id: 'lavar_maos', name: 'Lavar as Mãos', image: '/images/cards/acoes/lavar as maos.webp', time: '11:50' },
    { id: 'vestir', name: 'Vestir Roupa', image: '/images/cards/acoes/vestindo_blusa.webp', time: '07:45' },
    { id: 'abracar', name: 'Abraçar', image: '/images/cards/acoes/abraçar.webp', time: '20:00' },
    { id: 'ler', name: 'Ler Livro', image: '/images/cards/acoes/ler_livro.webp', time: '19:30' },
    { id: 'caminhar', name: 'Caminhar', image: '/images/cards/acoes/caminhar.webp', time: '08:00' },
    { id: 'sentar', name: 'Sentar', image: '/images/cards/acoes/sentar.webp', time: '12:00' },
    { id: 'conversar', name: 'Conversar', image: '/images/cards/acoes/conversar.webp', time: '18:00' },
    { id: 'beber', name: 'Beber', image: '/images/cards/acoes/beber.webp', time: '10:00' },
    { id: 'escrever', name: 'Escrever', image: '/images/cards/acoes/escrever.webp', time: '14:00' },
    { id: 'pensar', name: 'Pensar', image: '/images/cards/acoes/Pensar.webp', time: '09:00' },
    { id: 'falar', name: 'Falar', image: '/images/cards/acoes/falar.webp', time: '09:00' },
    { id: 'ouvindo', name: 'Ouvindo', image: '/images/cards/acoes/ouvindo.webp', time: '09:00' },
    { id: 'saltar', name: 'Saltar', image: '/images/cards/acoes/saltar.webp', time: '15:00' },
    { id: 'tocar', name: 'Tocar', image: '/images/cards/acoes/tocar.webp', time: '15:00' },
  ],
  
  alimentos: [
    { id: 'suco', name: 'Suco', image: '/images/cards/alimentos/suco_laranja.webp', time: '07:30' },
    { id: 'fruta', name: 'Fruta', image: '/images/cards/alimentos/banana.webp', time: '10:00' },
    { id: 'sanduiche', name: 'Sanduíche', image: '/images/cards/alimentos/sanduiche.webp', time: '16:00' },
    { id: 'salada', name: 'Salada', image: '/images/cards/alimentos/salada.webp', time: '12:00' },
    { id: 'pizza', name: 'Pizza', image: '/images/cards/alimentos/pizza.webp', time: '19:00' },
    { id: 'macarrao', name: 'Macarrão', image: '/images/cards/alimentos/macarrao_bologhesa.webp', time: '12:30' },
    { id: 'maca', name: 'Maçã', image: '/images/cards/alimentos/maca.webp', time: '10:00' },
  ],
  
  escola: [
    { id: 'caderno', name: 'Caderno', image: '/images/cards/escola/caderno.webp', time: '09:00' },
    { id: 'lapis', name: 'Lápis', image: '/images/cards/escola/lapis.webp', time: '09:00' },
    { id: 'livro', name: 'Livro', image: '/images/cards/escola/livro.webp', time: '14:00' },
  ],
  
  necessidades: [
    { id: 'beber_agua', name: 'Beber Água', image: '/images/cards/acoes/beber.webp', time: '10:30' },
    { id: 'descansar', name: 'Descansar', image: '/images/cards/acoes/sentar.webp', time: '13:00' },
  ],
  
  fimdesemana: [
    { id: 'passeio', name: 'Passear', image: '/images/cards/acoes/caminhar.webp', time: '10:00' },
    { id: 'parque', name: 'Ir ao Parque', image: '/images/cards/rotina/brincar.webp', time: '10:30' },
    { id: 'igreja', name: 'Igreja/Templo', image: '/images/cards/acoes/orar.webp', time: '09:00' },
    { id: 'visitar_familia', name: 'Visitar Família', image: '/images/cards/acoes/abraçar.webp', time: '15:00' },
    { id: 'cinema', name: 'Cinema', image: '/images/cards/rotina/ver_televisao.webp', time: '14:00' },
  ]
};
