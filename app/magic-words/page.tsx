'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Interfaces (Tipos de Dados) ---
interface Card {
  id: string;
  label: string;
  image: string;
  category: string;
}

interface Phase {
  cards: number;
  rounds: number;
  name: string;
}

// --- BANCO DE DADOS COMPLETO DE CARDS ---
// Corrigido para corresponder exatamente aos nomes dos arquivos no repositório
const allCardsData: Card[] = [
  // Acoes
  { id: 'pensar', label: 'Pensar', image: '/images/cards/acoes/Pensar.webp', category: 'acoes' },
  { id: 'abracar', label: 'Abraçar', image: '/images/cards/acoes/abraçar.webp', category: 'acoes' },
  { id: 'abrir_a_macaneta', label: 'Abrir a Maçaneta', image: '/images/cards/acoes/abrir a maçaneta.webp', category: 'acoes' },
  { id: 'abrir_a_porta', label: 'Abrir a Porta', image: '/images/cards/acoes/abrir a porta.webp', category: 'acoes' },
  { id: 'abrir_fechadura', label: 'Abrir Fechadura', image: '/images/cards/acoes/abrir_fechadura.webp', category: 'acoes' },
  { id: 'acenar_com_a_cabeca', label: 'Acenar com a Cabeça', image: '/images/cards/acoes/acenar com a cabeça.webp', category: 'acoes' },
  { id: 'agachar', label: 'Agachar', image: '/images/cards/acoes/agachar.webp', category: 'acoes' },
  { id: 'andar_bicicleta', label: 'Andar de Bicicleta', image: '/images/cards/acoes/andar_bicicleta.webp', category: 'acoes' },
  { id: 'aplaudir', label: 'Aplaudir', image: '/images/cards/acoes/aplaudir.webp', category: 'acoes' },
  { id: 'assoando_o_nariz', label: 'Assoar o Nariz', image: '/images/cards/acoes/assoando o nariz.webp', category: 'acoes' },
  { id: 'beber', label: 'Beber', image: '/images/cards/acoes/beber.webp', category: 'acoes' },
  { id: 'beijo_no_ar', label: 'Beijo no Ar', image: '/images/cards/acoes/beijo no ar.webp', category: 'acoes' },
  { id: 'bocejar', label: 'Bocejar', image: '/images/cards/acoes/bocejar.webp', category: 'acoes' },
  { id: 'cair', label: 'Cair', image: '/images/cards/acoes/cair.webp', category: 'acoes' },
  { id: 'caminhar', label: 'Caminhar', image: '/images/cards/acoes/caminhar.webp', category: 'acoes' },
  { id: 'cantando', label: 'Cantando', image: '/images/cards/acoes/cantando.webp', category: 'acoes' },
  { id: 'carregando_livros', label: 'Carregar Livros', image: '/images/cards/acoes/carregando_livros.webp', category: 'acoes' },
  { id: 'chamar', label: 'Chamar', image: '/images/cards/acoes/chamar.webp', category: 'acoes' },
  { id: 'conversar', label: 'Conversar', image: '/images/cards/acoes/conversar.webp', category: 'acoes' },
  { id: 'cruzando_os_dedos', label: 'Cruzando os Dedos', image: '/images/cards/acoes/cruzando os deos.webp', category: 'acoes' },
  { id: 'curvar', label: 'Curvar', image: '/images/cards/acoes/curvar.webp', category: 'acoes' },
  { id: 'dancar_a_dois', label: 'Dançar a Dois', image: '/images/cards/acoes/dançar a dois.webp', category: 'acoes' },
  { id: 'dancar_sozinho', label: 'Dançar Sozinho', image: '/images/cards/acoes/dançar sozinho.webp', category: 'acoes' },
  { id: 'dar_maos', label: 'Dar as Mãos', image: '/images/cards/acoes/dar_maos.webp', category: 'acoes' },
  { id: 'descer_as_escadas', label: 'Descer Escadas', image: '/images/cards/acoes/descer as escadas.webp', category: 'acoes' },
  { id: 'desligar_a_luz', label: 'Desligar a Luz', image: '/images/cards/acoes/desligar a luz.webp', category: 'acoes' },
  { id: 'desligar', label: 'Desligar', image: '/images/cards/acoes/desligar.webp', category: 'acoes' },
  { id: 'dirigir_um_carro', label: 'Dirigir um Carro', image: '/images/cards/acoes/dirigir um carro.webp', category: 'acoes' },
  { id: 'dry_hands', label: 'Secar as Mãos', image: '/images/cards/acoes/dry_hands_2_,_to_resultado.webp', category: 'acoes' },
  { id: 'empurrar', label: 'Empurrar', image: '/images/cards/acoes/empurrar.webp', category: 'acoes' },
  { id: 'engasgar', label: 'Engasgar', image: '/images/cards/acoes/engasgar.webp', category: 'acoes' },
  { id: 'entrando_pela_porta', label: 'Entrar pela Porta', image: '/images/cards/acoes/entrando pela porta.webp', category: 'acoes' },
  { id: 'entregar', label: 'Entregar', image: '/images/cards/acoes/entregar.webp', category: 'acoes' },
  { id: 'escovar_o_gatinho', label: 'Escovar o Gatinho', image: '/images/cards/acoes/escovar o gatinho.webp', category: 'acoes' },
  { id: 'escovar_os_cabelos', label: 'Escovar os Cabelos', image: '/images/cards/acoes/escovar os cabelos.webp', category: 'acoes' },
  { id: 'escovar_os_dentes', label: 'Escovar os Dentes', image: '/images/cards/acoes/escovar os dentes.webp', category: 'acoes' },
  { id: 'escrever', label: 'Escrever', image: '/images/cards/acoes/escrever.webp', category: 'acoes' },
  { id: 'esperando', label: 'Esperando', image: '/images/cards/acoes/esperando.webp', category: 'acoes' },
  { id: 'falar_ao_telefone', label: 'Falar ao Telefone', image: '/images/cards/acoes/falar ao telefone.webp', category: 'acoes' },
  { id: 'falar', label: 'Falar', image: '/images/cards/acoes/falar.webp', category: 'acoes' },
  { id: 'fechar_a_porta', label: 'Fechar a Porta', image: '/images/cards/acoes/fechar a porta.webp', category: 'acoes' },
  { id: 'fumando', label: 'Fumando', image: '/images/cards/acoes/fumando.webp', category: 'acoes' },
  { id: 'gritar', label: 'Gritar', image: '/images/cards/acoes/gritar.webp', category: 'acoes' },
  { id: 'jogar_cartas', label: 'Jogar Cartas', image: '/images/cards/acoes/jogar cartas.webp', category: 'acoes' },
  { id: 'lavar_as_maos', label: 'Lavar as Mãos', image: '/images/cards/acoes/lavar as maos.webp', category: 'acoes' },
  { id: 'lavar_cabelos', label: 'Lavar Cabelos', image: '/images/cards/acoes/lavar cabelos.webp', category: 'acoes' },
  { id: 'lavar_o_rosto', label: 'Lavar o Rosto', image: '/images/cards/acoes/lavar o rosto.webp', category: 'acoes' },
  { id: 'ler_de_pe', label: 'Ler de Pé', image: '/images/cards/acoes/ler de pé.webp', category: 'acoes' },
  { id: 'ler_sentado', label: 'Ler Sentado', image: '/images/cards/acoes/ler sentado.webp', category: 'acoes' },
  { id: 'ler_livro', label: 'Ler Livro', image: '/images/cards/acoes/ler_livro.webp', category: 'acoes' },
  { id: 'levantar_cabeca', label: 'Levantar a Cabeça', image: '/images/cards/acoes/levantar_cabeça.webp', category: 'acoes' },
  { id: 'ligar_a_luz', label: 'Ligar a Luz', image: '/images/cards/acoes/ligar a luz.webp', category: 'acoes' },
  { id: 'ligar', label: 'Ligar', image: '/images/cards/acoes/ligar.webp', category: 'acoes' },
  { id: 'limpar_sapatos', label: 'Limpar Sapatos', image: '/images/cards/acoes/limpar sapatos.webp', category: 'acoes' },
  { id: 'martelando', label: 'Martelando', image: '/images/cards/acoes/martelando.webp', category: 'acoes' },
  { id: 'mastigar', label: 'Mastigar', image: '/images/cards/acoes/mastigar.webp', category: 'acoes' },
  { id: 'mudar_de_ideia', label: 'Mudar de Ideia', image: '/images/cards/acoes/mudar de idéia.webp', category: 'acoes' },
  { id: 'olhando', label: 'Olhando', image: '/images/cards/acoes/olhando.webp', category: 'acoes' },
  { id: 'olhando_espelho', label: 'Olhando no Espelho', image: '/images/cards/acoes/olhando_espelho.webp', category: 'acoes' },
  { id: 'olhar_para_baixo', label: 'Olhar para Baixo', image: '/images/cards/acoes/olhar para baixo.webp', category: 'acoes' },
  { id: 'orar', label: 'Orar', image: '/images/cards/acoes/orar.webp', category: 'acoes' },
  { id: 'ouvindo', label: 'Ouvindo', image: '/images/cards/acoes/ouvindo.webp', category: 'acoes' },
  { id: 'pegando_onibus', label: 'Pegando Ônibus', image: '/images/cards/acoes/pegando_onibus.webp', category: 'acoes' },
  { id: 'procurar', label: 'Procurar', image: '/images/cards/acoes/procurar.webp', category: 'acoes' },
  { id: 'puxar', label: 'Puxar', image: '/images/cards/acoes/puxar.webp', category: 'acoes' },
  { id: 'recebendo_bencao', label: 'Recebendo Benção', image: '/images/cards/acoes/recebendo bencao.webp', category: 'acoes' },
  { id: 'saindo_pela_porta', label: 'Saindo pela Porta', image: '/images/cards/acoes/saindo pela porta.webp', category: 'acoes' },
  { id: 'saltar', label: 'Saltar', image: '/images/cards/acoes/saltar.webp', category: 'acoes' },
  { id: 'secar_as_maos', label: 'Secar as Mãos', image: '/images/cards/acoes/secar as mãos.webp', category: 'acoes' },
  { id: 'secar_no_varal', label: 'Secar no Varal', image: '/images/cards/acoes/secar no varal.webp', category: 'acoes' },
  { id: 'secar_o_rosto', label: 'Secar o Rosto', image: '/images/cards/acoes/secar o rosto.webp', category: 'acoes' },
  { id: 'secar_os_cabelos', label: 'Secar os Cabelos', image: '/images/cards/acoes/secar os cabelos.webp', category: 'acoes' },
  { id: 'sentar', label: 'Sentar', image: '/images/cards/acoes/sentar.webp', category: 'acoes' },
  { id: 'sentar_chao', label: 'Sentar no Chão', image: '/images/cards/acoes/sentar_chao.webp', category: 'acoes' },
  { id: 'shampoo_animal', label: 'Shampoo Animal', image: '/images/cards/acoes/shampoo_animal_,_to_resultado.webp', category: 'acoes' },
  { id: 'sonhar_acordado', label: 'Sonhar Acordado', image: '/images/cards/acoes/sonhar_acordado.webp', category: 'acoes' },
  { id: 'suando', label: 'Suando', image: '/images/cards/acoes/suando.webp', category: 'acoes' },
  { id: 'subir_a_arvore', label: 'Subir a Árvore', image: '/images/cards/acoes/subir a árvore.webp', category: 'acoes' },
  { id: 'sussurrar', label: 'Sussurrar', image: '/images/cards/acoes/sussurrar.webp', category: 'acoes' },
  { id: 'teclando', label: 'Teclando', image: '/images/cards/acoes/teclando.webp', category: 'acoes' },
  { id: 'tirar_a_blusa', label: 'Tirar a Blusa', image: '/images/cards/acoes/tirar a blusa.webp', category: 'acoes' },
  { id: 'tocar', label: 'Tocar', image: '/images/cards/acoes/tocar.webp', category: 'acoes' },
  { id: 'tocar_campainha', label: 'Tocar Campainha', image: '/images/cards/acoes/tocar_campainha.webp', category: 'acoes' },
  { id: 'trocar_as_fraldas', label: 'Trocar as Fraldas', image: '/images/cards/acoes/trocar as fraldas.webp', category: 'acoes' },
  { id: 'venha', label: 'Venha', image: '/images/cards/acoes/venha.webp', category: 'acoes' },
  { id: 'vestindo_blusa', label: 'Vestindo Blusa', image: '/images/cards/acoes/vestindo_blusa.webp', category: 'acoes' },
  { id: 'voltar', label: 'Voltar', image: '/images/cards/acoes/voltar.webp', category: 'acoes' },

  // Alimentos
  { id: 'abacate', label: 'Abacate', image: '/images/cards/alimentos/abacate.webp', category: 'alimentos' },
  { id: 'abacaxi', label: 'Abacaxi', image: '/images/cards/alimentos/abacaxi.webp', category: 'alimentos' },
  { id: 'abobora', label: 'Abóbora', image: '/images/cards/alimentos/abobora.webp', category: 'alimentos' },
  { id: 'abobrinha', label: 'Abobrinha', image: '/images/cards/alimentos/abobrinha.webp', category: 'alimentos' },
  { id: 'alcachofra', label: 'Alcachofra', image: '/images/cards/alimentos/alcachofra.webp', category: 'alimentos' },
  { id: 'alface', label: 'Alface', image: '/images/cards/alimentos/alface.webp', category: 'alimentos' },
  { id: 'amendoim', label: 'Amendoim', image: '/images/cards/alimentos/amendoim.webp', category: 'alimentos' },
  { id: 'aspargo', label: 'Aspargo', image: '/images/cards/alimentos/aspago.webp', category: 'alimentos' },
  { id: 'azeitonas', label: 'Azeitonas', image: '/images/cards/alimentos/azeitonas.webp', category: 'alimentos' },
  { id: 'banana', label: 'Banana', image: '/images/cards/alimentos/banana.webp', category: 'alimentos' },
  { id: 'batata', label: 'Batata', image: '/images/cards/alimentos/batata.webp', category: 'alimentos' },
  { id: 'bebida_quente', label: 'Bebida Quente', image: '/images/cards/alimentos/bebida_quente.webp', category: 'alimentos' },
  { id: 'berinjela', label: 'Berinjela', image: '/images/cards/alimentos/berinjela.webp', category: 'alimentos' },
  { id: 'brocolis', label: 'Brócolis', image: '/images/cards/alimentos/brocolis.webp', category: 'alimentos' },
  { id: 'cachorro_quente', label: 'Cachorro Quente', image: '/images/cards/alimentos/cachorro_quente.webp', category: 'alimentos' },
  { id: 'cafe_manha_suco', label: 'Café da Manhã', image: '/images/cards/alimentos/cafe_manha_suco.webp', category: 'alimentos' },
  { id: 'cafe_quente', label: 'Café Quente', image: '/images/cards/alimentos/cafe_quente.webp', category: 'alimentos' },
  { id: 'cebola', label: 'Cebola', image: '/images/cards/alimentos/cebola.webp', category: 'alimentos' },
  { id: 'chuchu', label: 'Chuchu', image: '/images/cards/alimentos/chuchu.webp', category: 'alimentos' },
  { id: 'cogumelo', label: 'Cogumelo', image: '/images/cards/alimentos/cogumelo.webp', category: 'alimentos' },
  { id: 'copos_suco', label: 'Copos de Suco', image: '/images/cards/alimentos/copos_suco.webp', category: 'alimentos' },
  { id: 'couve_bruxelas', label: 'Couve de Bruxelas', image: '/images/cards/alimentos/couve_bruxelas.webp', category: 'alimentos' },
  { id: 'damasco', label: 'Damasco', image: '/images/cards/alimentos/damasco.webp', category: 'alimentos' },
  { id: 'ervilha', label: 'Ervilha', image: '/images/cards/alimentos/ervilha.webp', category: 'alimentos' },
  { id: 'fruta_amoras', label: 'Amoras', image: '/images/cards/alimentos/fruta_amoras.webp', category: 'alimentos' },
  { id: 'fruta_figo', label: 'Figo', image: '/images/cards/alimentos/fruta_figo.webp', category: 'alimentos' },
  { id: 'fruta_groselha', label: 'Groselha', image: '/images/cards/alimentos/fruta_groselha.webp', category: 'alimentos' },
  { id: 'fruta_kiwi', label: 'Kiwi', image: '/images/cards/alimentos/fruta_kiwi.webp', category: 'alimentos' },
  { id: 'fruta_laranja', label: 'Laranja', image: '/images/cards/alimentos/fruta_laranja.webp', category: 'alimentos' },
  { id: 'fruta_lima', label: 'Lima', image: '/images/cards/alimentos/fruta_lima.webp', category: 'alimentos' },
  { id: 'fruta_limao_siciliano', label: 'Limão Siciliano', image: '/images/cards/alimentos/fruta_limao_siciliano.webp', category: 'alimentos' },
  { id: 'fruta_pitaia', label: 'Pitaia', image: '/images/cards/alimentos/fruta_pitaia.webp', category: 'alimentos' },
  { id: 'frutal_limao', label: 'Limão', image: '/images/cards/alimentos/frutal_limao.webp', category: 'alimentos' },
  { id: 'frutas_amoras', label: 'Frutas Amoras', image: '/images/cards/alimentos/frutas_amoras.webp', category: 'alimentos' },
  { id: 'jantar_frio', label: 'Jantar Frio', image: '/images/cards/alimentos/jantar_frio.webp', category: 'alimentos' },
  { id: 'jantar_quente', label: 'Jantar Quente', image: '/images/cards/alimentos/jantar_quente.webp', category: 'alimentos' },
  { id: 'lunch_box', label: 'Marmita', image: '/images/cards/alimentos/lunch_box.webp', category: 'alimentos' },
  { id: 'maca', label: 'Maçã', image: '/images/cards/alimentos/maca.webp', category: 'alimentos' },
  { id: 'macarrao_bologhesa', label: 'Macarrão Bolonhesa', image: '/images/cards/alimentos/macarrao_bologhesa.webp', category: 'alimentos' },
  { id: 'manga', label: 'Manga', image: '/images/cards/alimentos/manga.webp', category: 'alimentos' },
  { id: 'melancia', label: 'Melancia', image: '/images/cards/alimentos/melancia.webp', category: 'alimentos' },
  { id: 'melao', label: 'Melão', image: '/images/cards/alimentos/melao.webp', category: 'alimentos' },
  { id: 'milkshake', label: 'Milkshake', image: '/images/cards/alimentos/milkshake.webp', category: 'alimentos' },
  { id: 'milkshake_chocolate', label: 'Milkshake de Chocolate', image: '/images/cards/alimentos/milkshake_chocolate.webp', category: 'alimentos' },
  { id: 'milkshake_morango', label: 'Milkshake de Morango', image: '/images/cards/alimentos/milkshake_morango.webp', category: 'alimentos' },
  { id: 'mix_frutas', label: 'Mix de Frutas', image: '/images/cards/alimentos/mix_frutas.webp', category: 'alimentos' },
  { id: 'molho_maca', label: 'Molho de Maçã', image: '/images/cards/alimentos/molho_maca.webp', category: 'alimentos' },
  { id: 'morango', label: 'Morango', image: '/images/cards/alimentos/morango.webp', category: 'alimentos' },
  { id: 'ovo_frito', label: 'Ovo Frito', image: '/images/cards/alimentos/ovo_frito.webp', category: 'alimentos' },
  { id: 'paes_forma', label: 'Pães de Forma', image: '/images/cards/alimentos/paes_forma.webp', category: 'alimentos' },
  { id: 'pao_alho', label: 'Pão de Alho', image: '/images/cards/alimentos/pao_alho.webp', category: 'alimentos' },
  { id: 'pao_crocante', label: 'Pão Crocante', image: '/images/cards/alimentos/pao_crocante.webp', category: 'alimentos' },
  { id: 'pao_forma', label: 'Pão de Forma', image: '/images/cards/alimentos/pao_forma.webp', category: 'alimentos' },
  { id: 'pao_recheado', label: 'Pão Recheado', image: '/images/cards/alimentos/pao_recheado.webp', category: 'alimentos' },
  { id: 'paozinho', label: 'Pãozinho', image: '/images/cards/alimentos/paozinho.webp', category: 'alimentos' },
  { id: 'paozinho_gergelim', label: 'Pãozinho de Gergelim', image: '/images/cards/alimentos/paozinho_gergelim.webp', category: 'alimentos' },
  { id: 'penca_bananas', label: 'Penca de Bananas', image: '/images/cards/alimentos/penca_bananas.webp', category: 'alimentos' },
  { id: 'pepino', label: 'Pepino', image: '/images/cards/alimentos/pepino.webp', category: 'alimentos' },
  { id: 'pera', label: 'Pera', image: '/images/cards/alimentos/pera.webp', category: 'alimentos' },
  { id: 'pessego', label: 'Pêssego', image: '/images/cards/alimentos/pessego.webp', category: 'alimentos' },
  { id: 'pizza', label: 'Pizza', image: '/images/cards/alimentos/pizza.webp', category: 'alimentos' },
  { id: 'rabanete', label: 'Rabanete', image: '/images/cards/alimentos/rabanete.webp', category: 'alimentos' },
  { id: 'repolho', label: 'Repolho', image: '/images/cards/alimentos/repolho.webp', category: 'alimentos' },
  { id: 'rocambole', label: 'Rocambole', image: '/images/cards/alimentos/rocambole.webp', category: 'alimentos' },
  { id: 'ruibarbo', label: 'Ruibarbo', image: '/images/cards/alimentos/ruibarbo.webp', category: 'alimentos' },
  { id: 'salada', label: 'Salada', image: '/images/cards/alimentos/salada.webp', category: 'alimentos' },
  { id: 'sanduiche', label: 'Sanduíche', image: '/images/cards/alimentos/sanduiche.webp', category: 'alimentos' },
  { id: 'sanduiche_suco_frutas', label: 'Sanduíche e Suco', image: '/images/cards/alimentos/sanduiche_suco_frutas.webp', category: 'alimentos' },
  { id: 'suco_abacaxi', label: 'Suco de Abacaxi', image: '/images/cards/alimentos/suco_abacaxi.webp', category: 'alimentos' },
  { id: 'suco_amoras', label: 'Suco de Amoras', image: '/images/cards/alimentos/suco_amoras.webp', category: 'alimentos' },
  { id: 'suco_groselha', label: 'Suco de Groselha', image: '/images/cards/alimentos/suco_groselha.webp', category: 'alimentos' },
  { id: 'suco_laranja', label: 'Suco de Laranja', image: '/images/cards/alimentos/suco_laranja.webp', category: 'alimentos' },
  { id: 'suco_lima', label: 'Suco de Lima', image: '/images/cards/alimentos/suco_lima.webp', category: 'alimentos' },
  { id: 'suco_maca', label: 'Suco de Maçã', image: '/images/cards/alimentos/suco_maca.webp', category: 'alimentos' },
  { id: 'suco_tomate', label: 'Suco de Tomate', image: '/images/cards/alimentos/suco_tomate.webp', category: 'alimentos' },
  { id: 'suco_uva', label: 'Suco de Uva', image: '/images/cards/alimentos/suco_uva.webp', category: 'alimentos' },
  { id: 'tomate', label: 'Tomate', image: '/images/cards/alimentos/tomate.webp', category: 'alimentos' },
  { id: 'torta_maca', label: 'Torta de Maçã', image: '/images/cards/alimentos/torta_maca.webp', category: 'alimentos' },
  { id: 'uvas_verdes', label: 'Uvas Verdes', image: '/images/cards/alimentos/uvas_verdes.webp', category: 'alimentos' },
  { id: 'vegetais', label: 'Vegetais', image: '/images/cards/alimentos/vegetais.webp', category: 'alimentos' },

  // Animais
  { id: 'vaca', label: 'Vaca', image: '/images/cards/animais/Vaca.webp', category: 'animais' },
  { id: 'abelha', label: 'Abelha', image: '/images/cards/animais/abelha.webp', category: 'animais' },
  { id: 'abutre', label: 'Abutre', image: '/images/cards/animais/abutre.webp', category: 'animais' },
  { id: 'antilope', label: 'Antílope', image: '/images/cards/animais/antilope.webp', category: 'animais' },
  { id: 'avestruz', label: 'Avestruz', image: '/images/cards/animais/avestruz.webp', category: 'animais' },
  { id: 'besouro', label: 'Besouro', image: '/images/cards/animais/besouro.webp', category: 'animais' },
  { id: 'bufalo', label: 'Búfalo', image: '/images/cards/animais/bufalo.webp', category: 'animais' },
  { id: 'cachorro', label: 'Cachorro', image: '/images/cards/animais/cachorro.webp', category: 'animais' },
  { id: 'calopsita', label: 'Calopsita', image: '/images/cards/animais/calopsita.webp', category: 'animais' },
  { id: 'camaleao', label: 'Camaleão', image: '/images/cards/animais/camaleão.webp', category: 'animais' },
  { id: 'camelo', label: 'Camelo', image: '/images/cards/animais/camelo.webp', category: 'animais' },
  { id: 'camundongo', label: 'Camundongo', image: '/images/cards/animais/camundongo.webp', category: 'animais' },
  { id: 'canguru', label: 'Canguru', image: '/images/cards/animais/canguru.webp', category: 'animais' },
  { id: 'carpa', label: 'Carpa', image: '/images/cards/animais/carpa.webp', category: 'animais' },
  { id: 'cascavel', label: 'Cascavel', image: '/images/cards/animais/cascavel.webp', category: 'animais' },
  { id: 'cavalo', label: 'Cavalo', image: '/images/cards/animais/cavalo.webp', category: 'animais' },
  { id: 'cavalo_marinho', label: 'Cavalo Marinho', image: '/images/cards/animais/cavalo_marinho.webp', category: 'animais' },
  { id: 'chimpanze', label: 'Chimpanzé', image: '/images/cards/animais/chimpanzé.webp', category: 'animais' },
  { id: 'cisne', label: 'Cisne', image: '/images/cards/animais/cisne.webp', category: 'animais' },
  { id: 'coelho', label: 'Coelho', image: '/images/cards/animais/coelho.webp', category: 'animais' },
  { id: 'cordeiro', label: 'Cordeiro', image: '/images/cards/animais/cordeiro.webp', category: 'animais' },
  { id: 'coruja', label: 'Coruja', image: '/images/cards/animais/coruja.webp', category: 'animais' },
  { id: 'corca', label: 'Corça', image: '/images/cards/animais/corça.webp', category: 'animais' },
  { id: 'dinossauro', label: 'Dinossauro', image: '/images/cards/animais/dinossauro.webp', category: 'animais' },
  { id: 'elefante', label: 'Elefante', image: '/images/cards/animais/elefante.webp', category: 'animais' },
  { id: 'esquilo', label: 'Esquilo', image: '/images/cards/animais/esquilo.webp', category: 'animais' },
  { id: 'flamingo', label: 'Flamingo', image: '/images/cards/animais/flamingo.webp', category: 'animais' },
  { id: 'furao', label: 'Furão', image: '/images/cards/animais/furão.webp', category: 'animais' },
  { id: 'gaivota', label: 'Gaivota', image: '/images/cards/animais/gaivota.webp', category: 'animais' },
  { id: 'galo', label: 'Galo', image: '/images/cards/animais/galo.webp', category: 'animais' },
  { id: 'ganso', label: 'Ganso', image: '/images/cards/animais/ganso.webp', category: 'animais' },
  { id: 'gato', label: 'Gato', image: '/images/cards/animais/gato.webp', category: 'animais' },
  { id: 'girafa', label: 'Girafa', image: '/images/cards/animais/girafa.webp', category: 'animais' },
  { id: 'gorila', label: 'Gorila', image: '/images/cards/animais/gorila.webp', category: 'animais' },
  { id: 'hipopotamo', label: 'Hipopótamo', image: '/images/cards/animais/hipopotámo.webp', category: 'animais' },
  { id: 'lagarto', label: 'Lagarto', image: '/images/cards/animais/lagarto.webp', category: 'animais' },
  { id: 'lebre', label: 'Lebre', image: '/images/cards/animais/lebre.webp', category: 'animais' },
  { id: 'leitoa', label: 'Leitoa', image: '/images/cards/animais/leitoa.webp', category: 'animais' },
  { id: 'leopardo', label: 'Leopardo', image: '/images/cards/animais/leopardo.webp', category: 'animais' },
  { id: 'leao', label: 'Leão', image: '/images/cards/animais/leão.webp', category: 'animais' },
  { id: 'leao_marinho', label: 'Leão Marinho', image: '/images/cards/animais/leão_marinho.webp', category: 'animais' },
  { id: 'lobo', label: 'Lobo', image: '/images/cards/animais/lobo.webp', category: 'animais' },
  { id: 'morcego', label: 'Morcego', image: '/images/cards/animais/morcego.webp', category: 'animais' },
  { id: 'ovelha', label: 'Ovelha', image: '/images/cards/animais/ovelha.webp', category: 'animais' },
  { id: 'paca', label: 'Paca', image: '/images/cards/animais/paca.webp', category: 'animais' },
  { id: 'papagaio', label: 'Papagaio', image: '/images/cards/animais/papagaio.webp', category: 'animais' },
  { id: 'pato', label: 'Pato', image: '/images/cards/animais/pato.webp', category: 'animais' },
  { id: 'peixe', label: 'Peixe', image: '/images/cards/animais/peixe.webp', category: 'animais' },
  { id: 'peixe_tropical', label: 'Peixe Tropical', image: '/images/cards/animais/peixe_tropical.webp', category: 'animais' },
  { id: 'peru', label: 'Peru', image: '/images/cards/animais/peru.webp', category: 'animais' },
  { id: 'pinguim', label: 'Pinguim', image: '/images/cards/animais/pinguim.webp', category: 'animais' },
  { id: 'pintinho', label: 'Pintinho', image: '/images/cards/animais/pintinho.webp', category: 'animais' },
  { id: 'porco_da_india', label: 'Porco da Índia', image: '/images/cards/animais/porco_da_india.webp', category: 'animais' },
  { id: 'porco_espinho', label: 'Porco Espinho', image: '/images/cards/animais/porco_espínho.webp', category: 'animais' },
  { id: 'rato', label: 'Rato', image: '/images/cards/animais/rato.webp', category: 'animais' },
  { id: 'rena', label: 'Rena', image: '/images/cards/animais/rena.webp', category: 'animais' },
  { id: 'rinoceronte', label: 'Rinoceronte', image: '/images/cards/animais/rinoceronte.webp', category: 'animais' },
  { id: 'sapo', label: 'Sapo', image: '/images/cards/animais/sapo.webp', category: 'animais' },
  { id: 'tamandua', label: 'Tamanduá', image: '/images/cards/animais/tamanduá.webp', category: 'animais' },
  { id: 'tartaruga', label: 'Tartaruga', image: '/images/cards/animais/tartaruga.webp', category: 'animais' },
  { id: 'tigre', label: 'Tigre', image: '/images/cards/animais/tigre.webp', category: 'animais' },
  { id: 'trena', label: 'Trena', image: '/images/cards/animais/trena.webp', category: 'animais' },
  { id: 'urso', label: 'Urso', image: '/images/cards/animais/urso.webp', category: 'animais' },
  { id: 'urso_coala', label: 'Urso Coala', image: '/images/cards/animais/urso_coala.webp', category: 'animais' },
  { id: 'urso_panda', label: 'Urso Panda', image: '/images/cards/animais/urso_panda.webp', category: 'animais' },
  { id: 'urso_polar', label: 'Urso Polar', image: '/images/cards/animais/urso_polar.webp', category: 'animais' },
  { id: 'zebra', label: 'Zebra', image: '/images/cards/animais/zebra.webp', category: 'animais' },

  // Casa
  { id: 'abajur', label: 'Abajur', image: '/images/cards/casa/abajur.webp', category: 'casa' },
  { id: 'acucareiro', label: 'Açucareiro', image: '/images/cards/casa/acucareiro.webp', category: 'casa' },
  { id: 'alicate', label: 'Alicate', image: '/images/cards/casa/alicate.webp', category: 'casa' },
  { id: 'aspirador_po', label: 'Aspirador de Pó', image: '/images/cards/casa/aspirador_po.webp', category: 'casa' },
  { id: 'aspirador_portatil', label: 'Aspirador Portátil', image: '/images/cards/casa/aspirador_portatil.webp', category: 'casa' },
  { id: 'banqueta', label: 'Banqueta', image: '/images/cards/casa/banqueta.webp', category: 'casa' },
  { id: 'batedeira', label: 'Batedeira', image: '/images/cards/casa/batedeira.webp', category: 'casa' },
  { id: 'cabide', label: 'Cabide', image: '/images/cards/casa/cabide.webp', category: 'casa' },
  { id: 'chave_fenda', label: 'Chave de Fenda', image: '/images/cards/casa/chave_fenda.webp', category: 'casa' },
  { id: 'cortador_pizza', label: 'Cortador de Pizza', image: '/images/cards/casa/cortador_pizza.webp', category: 'casa' },
  { id: 'espatula', label: 'Espátula', image: '/images/cards/casa/espatula.webp', category: 'casa' },
  { id: 'espatula_estreita', label: 'Espátula Estreita', image: '/images/cards/casa/espatula_estreita.webp', category: 'casa' },
  { id: 'espatula_larga', label: 'Espátula Larga', image: '/images/cards/casa/espatula_larga.webp', category: 'casa' },
  { id: 'filtro_cafe_papel', label: 'Filtro de Café', image: '/images/cards/casa/filtro_cafe_papel.webp', category: 'casa' },
  { id: 'frigideira', label: 'Frigideira', image: '/images/cards/casa/frigideira.webp', category: 'casa' },
  { id: 'funil', label: 'Funil', image: '/images/cards/casa/funil.webp', category: 'casa' },
  { id: 'galinheiro', label: 'Galinheiro', image: '/images/cards/casa/galinheiro.webp', category: 'casa' },
  { id: 'garrafa_leite', label: 'Garrafa de Leite', image: '/images/cards/casa/garrafa_leite.webp', category: 'casa' },
  { id: 'guarda_roupa', label: 'Guarda Roupa', image: '/images/cards/casa/guarda_roupa.webp', category: 'casa' },
  { id: 'instrumentos_musicais', label: 'Instrumentos Musicais', image: '/images/cards/casa/instrumentos_musicais.webp', category: 'casa' },
  { id: 'jardim', label: 'Jardim', image: '/images/cards/casa/jardim.webp', category: 'casa' },
  { id: 'lanterna', label: 'Lanterna', image: '/images/cards/casa/lanterna.webp', category: 'casa' },
  { id: 'leite_longa_vida', label: 'Leite Longa Vida', image: '/images/cards/casa/leite_longa_vida.webp', category: 'casa' },
  { id: 'lixeira_papel', label: 'Lixeira de Papel', image: '/images/cards/casa/lixeira_papel.webp', category: 'casa' },
  { id: 'maquina_lavar_roupa', label: 'Máquina de Lavar', image: '/images/cards/casa/maquina_lavar_roupa.webp', category: 'casa' },
  { id: 'mesa', label: 'Mesa', image: '/images/cards/casa/mesa.webp', category: 'casa' },
  { id: 'pa', label: 'Pá', image: '/images/cards/casa/pa.webp', category: 'casa' },
  { id: 'panela', label: 'Panela', image: '/images/cards/casa/panela.webp', category: 'casa' },
  { id: 'parafuso', label: 'Parafuso', image: '/images/cards/casa/parafuso.webp', category: 'casa' },
  { id: 'sofa_dois_lugares', label: 'Sofá de Dois Lugares', image: '/images/cards/casa/sofa_dois_lugares.webp', category: 'casa' },
  { id: 'sofa_tres_lugares', label: 'Sofá de Três Lugares', image: '/images/cards/casa/sofa_tres_lugares.webp', category: 'casa' },
  { id: 'sombinha', label: 'Sombinha', image: '/images/cards/casa/sombinha.webp', category: 'casa' },
  { id: 'telefone_antigo', label: 'Telefone Antigo', image: '/images/cards/casa/telefone_antigo.webp', category: 'casa' },
  { id: 'tesoura', label: 'Tesoura', image: '/images/cards/casa/tesoura.webp', category: 'casa' },
  { id: 'toalha_cha', label: 'Toalha de Chá', image: '/images/cards/casa/toalha_cha.webp', category: 'casa' },
  { id: 'toalha_mesa', label: 'Toalha de Mesa', image: '/images/cards/casa/toalha_mesa.webp', category: 'casa' },
  { id: 'toalha_praia', label: 'Toalha de Praia', image: '/images/cards/casa/toalha_praia.webp', category: 'casa' },
  { id: 'toalhas_papel', label: 'Toalhas de Papel', image: '/images/cards/casa/toalhas_papel.webp', category: 'casa' },
  { id: 'ursinho_teddy', label: 'Ursinho Teddy', image: '/images/cards/casa/ursinho_teddy.webp', category: 'casa' },
  { id: 'vaso', label: 'Vaso', image: '/images/cards/casa/vaso.webp', category: 'casa' },
  { id: 'vaso_planta', label: 'Vaso de Planta', image: '/images/cards/casa/vaso_planta.webp', category: 'casa' },
  { id: 'vaso_quebrado', label: 'Vaso Quebrado', image: '/images/cards/casa/vaso_quebrado.webp', category: 'casa' },
  { id: 'vassoura', label: 'Vassoura', image: '/images/cards/casa/vassoura.webp', category: 'casa' },
  { id: 'video_game_wii', label: 'Video Game Wii', image: '/images/cards/casa/video_game_wii.webp', category: 'casa' },

  // Core
  { id: 'basta', label: 'Basta', image: '/images/cards/core/Basta.webp', category: 'core' },
  { id: 'duvida', label: 'Dúvida', image: '/images/cards/core/Duvida.webp', category: 'core' },
  { id: 'espere', label: 'Espere', image: '/images/cards/core/Espere.webp', category: 'core' },
  { id: 'estou_doente', label: 'Estou Doente', image: '/images/cards/core/Estou_doente.webp', category: 'core' },
  { id: 'fim', label: 'Fim', image: '/images/cards/core/Fim.webp', category: 'core' },
  { id: 'o_que', label: 'O Quê?', image: '/images/cards/core/O_que.webp', category: 'core' },
  { id: 'ola', label: 'Olá', image: '/images/cards/core/Olá.webp', category: 'core' },
  { id: 'agora', label: 'Agora', image: '/images/cards/core/agora.webp', category: 'core' },
  { id: 'com_companhia', label: 'Com Companhia', image: '/images/cards/core/com_companhia.webp', category: 'core' },
  { id: 'correto', label: 'Correto', image: '/images/cards/core/correto.webp', category: 'core' },
  { id: 'ela', label: 'Ela', image: '/images/cards/core/ela.webp', category: 'core' },
  { id: 'estou_aqui', label: 'Estou Aqui', image: '/images/cards/core/estou_aqui.webp', category: 'core' },
  { id: 'eu', label: 'Eu', image: '/images/cards/core/eu.webp', category: 'core' },
  { id: 'mais', label: 'Mais', image: '/images/cards/core/mais.webp', category: 'core' },
  { id: 'me_ajude', label: 'Me Ajude', image: '/images/cards/core/me ajude.webp', category: 'core' },
  { id: 'me_mostre', label: 'Me Mostre', image: '/images/cards/core/me mostre.webp', category: 'core' },
  { id: 'muito_mais', label: 'Muito Mais', image: '/images/cards/core/muito_mais.webp', category: 'core' },
  { id: 'nao', label: 'Não', image: '/images/cards/core/não.webp', category: 'core' },
  { id: 'nao_quero_falar', label: 'Não Quero Falar', image: '/images/cards/core/não_quero_falar.webp', category: 'core' },
  { id: 'obrigado', label: 'Obrigado', image: '/images/cards/core/obrigado.webp', category: 'core' },
  { id: 'onde', label: 'Onde?', image: '/images/cards/core/onde.webp', category: 'core' },
  { id: 'pare', label: 'Pare', image: '/images/cards/core/pare.webp', category: 'core' },
  { id: 'perguntar', label: 'Perguntar', image: '/images/cards/core/perguntar.webp', category: 'core' },
  { id: 'por_favor', label: 'Por Favor', image: '/images/cards/core/por favor.webp', category: 'core' },
  { id: 'qual', label: 'Qual?', image: '/images/cards/core/qual.webp', category: 'core' },
  { id: 'quando', label: 'Quando?', image: '/images/cards/core/quando.webp', category: 'core' },
  { id: 'quero', label: 'Quero', image: '/images/cards/core/quero.webp', category: 'core' },
  { id: 'sim', label: 'Sim', image: '/images/cards/core/sim.webp', category: 'core' },
  { id: 'voce', label: 'Você', image: '/images/cards/core/voce.webp', category: 'core' },

  // Descritivo (apenas alguns para exemplo, os restantes seguem o mesmo padrão)
  { id: 'a_letra', label: 'A', image: '/images/cards/descritivo/A.webp', category: 'descritivo' },
  { id: 'b_letra', label: 'B', image: '/images/cards/descritivo/B.webp', category: 'descritivo' },
  { id: 'branco', label: 'Branco', image: '/images/cards/descritivo/branco.webp', category: 'descritivo' },
  { id: 'cor_azul', label: 'Cor Azul', image: '/images/cards/descritivo/cor_azul.webp', category: 'descritivo' },
  { id: 'dez', label: 'Dez', image: '/images/cards/descritivo/dez.webp', category: 'descritivo' },
  { id: 'escola', label: 'Escola', image: '/images/cards/descritivo/escola.webp', category: 'descritivo' },
  { id: 'silencio', label: 'Silêncio', image: '/images/cards/descritivo/silencio.webp', category: 'descritivo' },
  { id: 'vermelho', label: 'Vermelho', image: '/images/cards/descritivo/vermelho.webp', category: 'descritivo' },

  // Emoções
  { id: 'assustado', label: 'Assustado', image: '/images/cards/emocoes/assustado.webp', category: 'emocoes' },
  { id: 'homem_animado', label: 'Homem Animado', image: '/images/cards/emocoes/homem_animado.webp', category: 'emocoes' },
  { id: 'homem_calmo', label: 'Homem Calmo', image: '/images/cards/emocoes/homem_calmo.webp', category: 'emocoes' },
  { id: 'homem_ciumento', label: 'Homem Ciumento', image: '/images/cards/emocoes/homem_ciumento.webp', category: 'emocoes' },
  { id: 'homem_confuso', label: 'Homem Confuso', image: '/images/cards/emocoes/homem_confuso.webp', category: 'emocoes' },
  { id: 'homem_desgostoso', label: 'Homem Desgostoso', image: '/images/cards/emocoes/homem_desgostoso.webp', category: 'emocoes' },
  { id: 'homem_feliz', label: 'Homem Feliz', image: '/images/cards/emocoes/homem_feliz.webp', category: 'emocoes' },
  { id: 'homem_focado', label: 'Homem Focado', image: '/images/cards/emocoes/homem_focado.webp', category: 'emocoes' },
  { id: 'homem_furioso', label: 'Homem Furioso', image: '/images/cards/emocoes/homem_furioso.webp', category: 'emocoes' },
  { id: 'homem_gargalhando', label: 'Homem Gargalhando', image: '/images/cards/emocoes/homem_gargalhando.webp', category: 'emocoes' },
  { id: 'homem_medo', label: 'Homem com Medo', image: '/images/cards/emocoes/homem_medo.webp', category: 'emocoes' },
  { id: 'homem_preocupado', label: 'Homem Preocupado', image: '/images/cards/emocoes/homem_preocupado.webp', category: 'emocoes' },
  { id: 'homem_surpreso', label: 'Homem Surpreso', image: '/images/cards/emocoes/homem_surpreso.webp', category: 'emocoes' },
  { id: 'homem_triste', label: 'Homem Triste', image: '/images/cards/emocoes/homem_triste.webp', category: 'emocoes' },
  { id: 'mulher_animada', label: 'Mulher Animada', image: '/images/cards/emocoes/mulher_animada.webp', category: 'emocoes' },
  { id: 'mulher_calma', label: 'Mulher Calma', image: '/images/cards/emocoes/mulher_calma.webp', category: 'emocoes' },
  { id: 'mulher_ciumenta', label: 'Mulher Ciumenta', image: '/images/cards/emocoes/mulher_ciumenta.webp', category: 'emocoes' },
  { id: 'mulher_confusa', label: 'Mulher Confusa', image: '/images/cards/emocoes/mulher_confusa.webp', category: 'emocoes' },
  { id: 'mulher_feliz', label: 'Mulher Feliz', image: '/images/cards/emocoes/mulher_feliz.webp', category: 'emocoes' },
  { id: 'mulher_focada', label: 'Mulher Focada', image: '/images/cards/emocoes/mulher_focada.webp', category: 'emocoes' },
  { id: 'mulher_furiosa', label: 'Mulher Furiosa', image: '/images/cards/emocoes/mulher_furiosa.webp', category: 'emocoes' },
  { id: 'mulher_gargalhando', label: 'Mulher Gargalhando', image: '/images/cards/emocoes/mulher_gargalhando.webp', category: 'emocoes' },
  { id: 'mulher_medo', label: 'Mulher com Medo', image: '/images/cards/emocoes/mulher_medo.webp', category: 'emocoes' },
  { id: 'mulher_preocupada', label: 'Mulher Preocupada', image: '/images/cards/emocoes/mulher_preocupada.webp', category: 'emocoes' },
  { id: 'mulher_risada_engracada', label: 'Mulher Rindo', image: '/images/cards/emocoes/mulher_risada_engracada.webp', category: 'emocoes' },
  { id: 'mulher_surpresa', label: 'Mulher Surpresa', image: '/images/cards/emocoes/mulher_surpresa.webp', category: 'emocoes' },
  { id: 'mulher_triste', label: 'Mulher Triste', image: '/images/cards/emocoes/mulher_triste.webp', category: 'emocoes' },

  // Escola
  { id: 'apontador_lapis', label: 'Apontador', image: '/images/cards/escola/apontador_lapis.webp', category: 'escola' },
  { id: 'caderno', label: 'Caderno', image: '/images/cards/escola/caderno.webp', category: 'escola' },
  { id: 'lapis', label: 'Lápis', image: '/images/cards/escola/lapis.webp', category: 'escola' },
  { id: 'livro', label: 'Livro', image: '/images/cards/escola/livro.webp', category: 'escola' },
  { id: 'mochila_escola', label: 'Mochila', image: '/images/cards/rotinas/mochila_escola.webp', category: 'escola' }, // Este estava em rotinas, movi aqui
  { id: 'quebra_cabeca', label: 'Quebra-Cabeça', image: '/images/cards/escola/quebra_cabeça.webp', category: 'escola' },

  // Objetos
  { id: 'balao', label: 'Balão', image: '/images/cards/objetos/balao.webp', category: 'objetos' },
  { id: 'bola_basquete', label: 'Bola de Basquete', image: '/images/cards/objetos/bola_basquete.webp', category: 'objetos' },
  { id: 'bolsa', label: 'Bolsa', image: '/images/cards/objetos/bolsa.webp', category: 'objetos' },
  { id: 'relogio', label: 'Relógio', image: '/images/cards/objetos/relogio.webp', category: 'objetos' },
  { id: 'yo_yo', label: 'Ioiô', image: '/images/cards/objetos/yo-yo.webp', category: 'objetos' },

  // Pessoas
  { id: 'avo', label: 'Avó', image: '/images/cards/pessoas/avó.webp', category: 'pessoas' },
  { id: 'avo_masc', label: 'Avô', image: '/images/cards/pessoas/avô.webp', category: 'pessoas' },
  { id: 'bebe', label: 'Bebê', image: '/images/cards/pessoas/menino_japao_2.webp', category: 'pessoas' }, // Usando uma imagem temporária
  { id: 'familia', label: 'Família', image: '/images/cards/pessoas/familia.webp', category: 'pessoas' },
  { id: 'mae', label: 'Mãe', image: '/images/cards/pessoas/mãe.webp', category: 'pessoas' },
  { id: 'pai', label: 'Pai', image: '/images/cards/pessoas/pai.webp', category: 'pessoas' },
  { id: 'professor', label: 'Professor', image: '/images/cards/pessoas/professor.webp', category: 'pessoas' },

  // Rotinas
  { id: 'ir_para_casa', label: 'Ir para Casa', image: '/images/cards/rotinas/Ir para casa.webp', category: 'rotinas' },
  { id: 'ontem', label: 'Ontem', image: '/images/cards/rotinas/Ontem.webp', category: 'rotinas' },
  { id: 'tarde', label: 'Tarde', image: '/images/cards/rotinas/Tarde.webp', category: 'rotinas' },
  { id: 'almoco', label: 'Almoço', image: '/images/cards/rotinas/almoco.webp', category: 'rotinas' },
  { id: 'amanha', label: 'Amanhã', image: '/images/cards/rotinas/amanha.webp', category: 'rotinas' },
  { id: 'arco_iris', label: 'Arco-Íris', image: '/images/cards/rotinas/arco_iris.webp', category: 'rotinas' },
  { id: 'aula_algebra', label: 'Aula de Álgebra', image: '/images/cards/rotinas/aula_algebra_resultado.webp', category: 'rotinas' },
  { id: 'aula_ciencias', label: 'Aula de Ciências', image: '/images/cards/rotinas/aula_ciencias_resultado.webp', category: 'rotinas' },
  { id: 'aula_educacao_fisica', label: 'Aula de Educação Física', image: '/images/cards/rotinas/aula_educacao_fisica_resultado.webp', category: 'rotinas' },
  { id: 'aula_musica', label: 'Aula de Música', image: '/images/cards/rotinas/aula_musica_resultado.webp', category: 'rotinas' },
  { id: 'aula_natacao', label: 'Aula de Natação', image: '/images/cards/rotinas/aula_natacao_resultado.webp', category: 'rotinas' },
  { id: 'brincar', label: 'Brincar', image: '/images/cards/rotinas/brincar.webp', category: 'rotinas' },
  { id: 'cafe_manha', label: 'Café da Manhã', image: '/images/cards/rotinas/cafe_manha.webp', category: 'rotinas' },
  { id: 'cafe_tarde', label: 'Café da Tarde', image: '/images/cards/rotinas/cafe_tarde.webp', category: 'rotinas' },
  { id: 'chuva', label: 'Chuva', image: '/images/cards/rotinas/chuva.webp', category: 'rotinas' },
  { id: 'domingo', label: 'Domingo', image: '/images/cards/rotinas/domingo.webp', category: 'rotinas' },
  { id: 'ensolarado', label: 'Ensolarado', image: '/images/cards/rotinas/ensolarado.webp', category: 'rotinas' },
  { id: 'estudar', label: 'Estudar', image: '/images/cards/rotinas/estudar.webp', category: 'rotinas' },
  { id: 'estudar_computacao', label: 'Estudar Computação', image: '/images/cards/rotinas/estudar_computacao.webp', category: 'rotinas' },
  { id: 'estudar_computador_casa', label: 'Estudar no Computador', image: '/images/cards/rotinas/estudar_computador_casa.webp', category: 'rotinas' },
  { id: 'estudar_geografia', label: 'Estudar Geografia', image: '/images/cards/rotinas/estudar_geografia.webp', category: 'rotinas' },
  { id: 'estudar_historia', label: 'Estudar História', image: '/images/cards/rotinas/estudar_historia.webp', category: 'rotinas' },
  { id: 'estudar_ingles', label: 'Estudar Inglês', image: '/images/cards/rotinas/estudar_ingles.webp', category: 'rotinas' },
  { id: 'estudar_matematica', label: 'Estudar Matemática', image: '/images/cards/rotinas/estudar_matematica.webp', category: 'rotinas' },
  { id: 'hoje', label: 'Hoje', image: '/images/cards/rotinas/hoje.webp', category: 'rotinas' },
  { id: 'hora_acordar', label: 'Hora de Acordar', image: '/images/cards/rotinas/hora_acordar.webp', category: 'rotinas' },
  { id: 'hora_dormir', label: 'Hora de Dormir', image: '/images/cards/rotinas/hora_dormir.webp', category: 'rotinas' },
  { id: 'jantar', label: 'Jantar', image: '/images/cards/rotinas/jantar.webp', category: 'rotinas' },
  { id: 'licao_casa', label: 'Lição de Casa', image: '/images/cards/rotinas/licao_casa.webp', category: 'rotinas' },
  { id: 'manha', label: 'Manhã', image: '/images/cards/rotinas/manha.webp', category: 'rotinas' },
  { id: 'mudanca_tempo', label: 'Mudança de Tempo', image: '/images/cards/rotinas/mudanca_tempo.webp', category: 'rotinas' },
  { id: 'noite', label: 'Noite', image: '/images/cards/rotinas/noite.webp', category: 'rotinas' },
  { id: 'quarta_feira', label: 'Quarta-feira', image: '/images/cards/rotinas/quarta_feira.webp', category: 'rotinas' },
  { id: 'quinta_feira', label: 'Quinta-feira', image: '/images/cards/rotinas/quinta_feira.webp', category: 'rotinas' },
  { id: 'sabado', label: 'Sábado', image: '/images/cards/rotinas/sabado.webp', category: 'rotinas' },
  { id: 'segunda_feira', label: 'Segunda-feira', image: '/images/cards/rotinas/segunda_feira.webp', category: 'rotinas' },
  { id: 'sem_escola_hoje', label: 'Sem Escola Hoje', image: '/images/cards/rotinas/sem_escola_hoje_resultado.webp', category: 'rotinas' },
  { id: 'semana', label: 'Semana', image: '/images/cards/rotinas/semana.webp', category: 'rotinas' },
  { id: 'sexta_feira', label: 'Sexta-feira', image: '/images/cards/rotinas/sexta_feira.webp', category: 'rotinas' },
  { id: 'terca_feira', label: 'Terça-feira', image: '/images/cards/rotinas/terca_feira.webp', category: 'rotinas' },
  { id: 'tomar_banho_rotina', label: 'Tomar Banho (Rotina)', image: '/images/cards/rotinas/tomar_banho.webp', category: 'rotinas' },
  { id: 'ver_televisao', label: 'Ver Televisão', image: '/images/cards/rotinas/ver_televisao.webp', category: 'rotinas' },

  // Roupas
  { id: 'calcas', label: 'Calças', image: '/images/cards/roupas/calcas.webp', category: 'roupas' },
  { id: 'camisa', label: 'Camisa', image: '/images/cards/roupas/camisa.webp', category: 'roupas' },
  { id: 'camiseta', label: 'Camiseta', image: '/images/cards/roupas/camiseta.webp', category: 'roupas' },
  { id: 'capa_chuva', label: 'Capa de Chuva', image: '/images/cards/roupas/capa_chuva.webp', category: 'roupas' },
  { id: 'casaco', label: 'Casaco', image: '/images/cards/roupas/casaco.webp', category: 'roupas' },
  { id: 'colete', label: 'Colete', image: '/images/cards/roupas/colete.webp', category: 'roupas' },
  { id: 'gravata', label: 'Gravata', image: '/images/cards/roupas/gravata.webp', category: 'roupas' },
  { id: 'meia_cano_alto', label: 'Meia Cano Alto', image: '/images/cards/roupas/meia_cano_alto.webp', category: 'roupas' },
  { id: 'meias', label: 'Meias', image: '/images/cards/roupas/meias.webp', category: 'roupas' },
  { id: 'moletom', label: 'Moletom', image: '/images/cards/roupas/moletom.webp', category: 'roupas' },
  { id: 'sapato_feminino', label: 'Sapato Feminino', image: '/images/cards/roupas/sapato_feminino.webp', category: 'roupas' },
  { id: 'sapato_masculino', label: 'Sapato Masculino', image: '/images/cards/roupas/sapato_masculino.webp', category: 'roupas' },
  { id: 'vestido', label: 'Vestido', image: '/images/cards/roupas/vestido.webp', category: 'roupas' },

  // Transportes
  { id: 'aviao_comercial', label: 'Avião Comercial', image: '/images/cards/transportes/aviao_comercial.webp', category: 'transportes' },
  { id: 'aviao_jato', label: 'Avião a Jato', image: '/images/cards/transportes/aviao_jato.webp', category: 'transportes' },
  { id: 'carro_azul', label: 'Carro Azul', image: '/images/cards/transportes/carro_azul.webp', category: 'transportes' },
  { id: 'carro_vermelho', label: 'Carro Vermelho', image: '/images/cards/transportes/carro_vermelho.webp', category: 'transportes' },
  { id: 'guincho', label: 'Guincho', image: '/images/cards/transportes/guincho.webp', category: 'transportes' },
  { id: 'metro', label: 'Metrô', image: '/images/cards/transportes/metro.webp', category: 'transportes' },
  { id: 'micro_onibus', label: 'Micro Ônibus', image: '/images/cards/transportes/micro_onibus.webp', category: 'transportes' },
  { id: 'onibus_dois_andares', label: 'Ônibus de Dois Andares', image: '/images/cards/transportes/onibus_dois_andares.webp', category: 'transportes' },
  { id: 'trem', label: 'Trem', image: '/images/cards/transportes/trem.webp', category: 'transportes' },
  { id: 'viagem', label: 'Viagem', image: '/images/cards/transportes/viagem.webp', category: 'transportes' },
];


// --- Configuração Central do Jogo ---
const gameConfig = {
  phases: [
    { cards: 4, rounds: 5, name: "Tradutor Iniciante" },
    { cards: 6, rounds: 7, name: "Intérprete Aprendiz" },
    { cards: 8, rounds: 8, name: "Mestre dos Gestos" },
    { cards: 12, rounds: 10, name: "Feiticeiro das Palavras" }
  ] as Phase[],
  cards: allCardsData,
  npcNames: ['Maria', 'João', 'Ana', 'Lucas', 'Sofia', 'Pedro']
};

export default function MagicWordsGame() {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- Estados do Jogo ---
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUiBlocked, setIsUiBlocked] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const [correctCard, setCorrectCard] = useState<Card | null>(null);
  const [npcName, setNpcName] = useState('Maria');
  const [cardFeedback, setCardFeedback] = useState<{ [key: string]: 'correct' | 'wrong' }>({});

  const [milaMessage, setMilaMessage] = useState("");
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  // --- Mensagens da Mila ---
  const milaMessages = {
    intro: "Olá! Sou a Mila, a Feiticeira. Vamos descobrir o que as pessoas querem?",
    start: "Vamos começar! Preste atenção no que eu vou pedir.",
    nextRound: ["Observe com atenção!", "Qual card o(a) nosso(a) amigo(a) quer?", "Você consegue encontrar!"],
    correct: ["Isso mesmo! 🎉", "Você encontrou! ⭐", "Excelente! 🌟", "Continue assim! 💪"],
    error: "Ops, não foi esse. Mas não desista! ❤️",
    phaseComplete: (phaseName: string) => `Uau! Você completou a fase ${phaseName}! Ganhou uma Gema Mágica e mais pontos! ✨`,
    gameOver: "Não foi dessa vez, mas você foi incrível! Vamos tentar de novo? 😊"
  };

  useEffect(() => {
    if (!isPlaying && milaMessage === "") {
      milaSpeak(milaMessages.intro);
    }
  }, [isPlaying, milaMessage]);

  // --- Inicialização do Áudio ---
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    document.addEventListener('click', initAudio, { once: true });
    return () => {
      document.removeEventListener('click', initAudio);
      audioContextRef.current?.close();
    };
  }, []);
  
  // --- Funções de Som e Narração ---
  const milaSpeak = useCallback((message: string) => {
    setMilaMessage(message);
    if (isSoundOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.replace(/[🎉⭐🌟💪✨❤️😊🤔]/g, ''));
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, [isSoundOn]);

  const playSound = useCallback((type: 'correct' | 'wrong' | 'start' | 'win') => {
    if (!isSoundOn || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    
    const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    if (type === 'correct') {
      playNote(523.25, now, 0.15);
      playNote(659.25, now + 0.15, 0.2);
    } else if (type === 'wrong') {
      playNote(164.81, now, 0.2);
      playNote(155.56, now + 0.2, 0.2);
    } else if (type === 'win') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            playNote(freq, now + i * 0.1, 0.15);
        });
    }
  }, [isSoundOn]);
  
  // --- Lógica Principal do Jogo ---
  const startGame = useCallback(() => {
    setCurrentPhaseIndex(0);
    setScore(0);
    setRoundsCompleted(0);
    setLives(3);
    setIsPlaying(true);
    setShowGameOverModal(false);
    setShowVictoryModal(false);
    milaSpeak(milaMessages.start);
    setTimeout(() => nextRound(0), 2000);
  }, [milaSpeak]);

  const nextRound = useCallback((phaseIdx: number) => {
    setIsUiBlocked(true);
    const currentPhaseConfig = gameConfig.phases[phaseIdx];
    
    if (!currentPhaseConfig) return;

    if (gameConfig.cards.length < currentPhaseConfig.cards) {
        console.error("Não há cards suficientes para esta fase.");
        setIsPlaying(false);
        milaSpeak("Parece que faltam cards! Informe o criador do jogo.");
        return;
    }

    const shuffledDeck = [...gameConfig.cards].sort(() => 0.5 - Math.random());
    
    const correct = shuffledDeck[0];
    const distractors = shuffledDeck.slice(1, currentPhaseConfig.cards);
    
    const roundCards = [correct, ...distractors].sort(() => 0.5 - Math.random());
    
    setCorrectCard(correct);
    setCurrentCards(roundCards);
    setCardFeedback({});
    
    const randomNpcName = gameConfig.npcNames[Math.floor(Math.random() * gameConfig.npcNames.length)];
    setNpcName(randomNpcName);

    setTimeout(() => {
        if(correct) {
            milaSpeak(`${randomNpcName} quer o card que mostra... '${correct.label}'. Você consegue encontrar?`);
        }
        setIsUiBlocked(false);
    }, 1200);

  }, [milaSpeak]);

  const handleCardClick = (card: Card) => {
    if (isUiBlocked || !isPlaying) return;
    setIsUiBlocked(true);

    if (card.id === correctCard?.id) {
      setScore(prev => prev + 100);
      setCardFeedback({ [card.id]: 'correct' });
      playSound('correct');
      const randomMessage = milaMessages.correct[Math.floor(Math.random() * milaMessages.correct.length)];
      milaSpeak(randomMessage);
      
      const newRoundsCompleted = roundsCompleted + 1;
      setRoundsCompleted(newRoundsCompleted);

      setTimeout(() => {
        const phase = gameConfig.phases[currentPhaseIndex];
        if (phase && newRoundsCompleted >= phase.rounds) {
          handlePhaseComplete();
        } else {
          nextRound(currentPhaseIndex);
        }
      }, 2000);

    } else {
      setLives(prev => prev - 1);
      setCardFeedback({ [card.id]: 'wrong', [correctCard!.id]: 'correct' });
      playSound('wrong');
      milaSpeak(milaMessages.error);
      
      const newLives = lives - 1;
      if (newLives <= 0) {
        setTimeout(() => {
          setIsPlaying(false);
          setShowGameOverModal(true);
          milaSpeak(milaMessages.gameOver);
        }, 2000);
      } else {
        setTimeout(() => {
          nextRound(currentPhaseIndex);
        }, 2500);
      }
    }
  };

  const handlePhaseComplete = () => {
    const phase = gameConfig.phases[currentPhaseIndex];
    playSound('win');
    setScore(prev => prev + 250); // Bônus da Gema Mágica
    if(phase) {
        milaSpeak(milaMessages.phaseComplete(phase.name));
    }
    setShowVictoryModal(true);
  };
  
  const nextPhase = useCallback(() => {
    const newPhaseIndex = currentPhaseIndex + 1;
    setShowVictoryModal(false);
    
    if (newPhaseIndex >= gameConfig.phases.length) {
      milaSpeak("Parabéns, Mago(a) das Palavras! Você desvendou todos os segredos! 🎉");
      setIsPlaying(false);
      setMilaMessage("Parabéns, Mago(a) das Palavras! Você desvendou todos os segredos! 🎉");
    } else {
      setCurrentPhaseIndex(newPhaseIndex);
      setRoundsCompleted(0);
      setLives(3);
      setTimeout(() => nextRound(newPhaseIndex), 1000);
    }
  }, [currentPhaseIndex, nextRound, milaSpeak]);

  const phase = gameConfig.phases[currentPhaseIndex];
  const progress = phase ? (roundsCompleted / phase.rounds) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-200 via-violet-200 to-pink-200 text-gray-800">
      <header className="w-full max-w-4xl mx-auto p-2 md:p-4 z-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg border-2 border-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => router.push('/')} className="p-2 hover:bg-sky-100 rounded-xl transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">
                ✨ Palavras Mágicas ✨
              </h1>
            </div>
            <div className="flex gap-2 md:gap-3 items-center">
              <div className="bg-gradient-to-br from-red-400 to-pink-400 text-white px-3 py-1.5 rounded-xl shadow-md text-center">
                <div className="text-xs">Vidas</div>
                <div className="text-xl font-bold">{'❤️'.repeat(lives)}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white px-4 py-1.5 rounded-xl shadow-md text-center">
                <div className="text-xs">Pontos</div>
                <div className="text-xl font-bold">{score}</div>
              </div>
               <button onClick={() => setIsSoundOn(!isSoundOn)} className="p-2 hover:bg-sky-100 rounded-xl transition-colors">
                {isSoundOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow w-full max-w-4xl mx-auto p-2 md:p-4 pb-44"> {/* Padding inferior para não sobrepor o footer */}
        {isPlaying && phase ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-2 sm:p-4 md:p-6 shadow-xl border-2 border-violet-200">
          <div className="text-center mb-4">
            <h2 className="text-lg md:text-2xl font-bold mb-2">
             🌟 Fase {currentPhaseIndex + 1}: {phase.name} 🌟
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-6 border border-gray-300">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-sky-400 flex items-center justify-center text-white text-sm font-bold transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              >
                {roundsCompleted}/{phase.rounds}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center my-4 md:my-6">
              <div className="bg-white p-4 rounded-2xl shadow-md text-center border-2 border-pink-200 animate-fade-in">
                  <div className="text-6xl md:text-8xl animate-bounce">🤔</div>
                  <p className="font-bold mt-2 text-lg">{npcName}</p>
              </div>
          </div>

          <div className={`grid gap-2 sm:gap-3 md:gap-4 transition-opacity duration-500 ${isUiBlocked ? 'opacity-50' : 'opacity-100'} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`}>
            {currentCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={isUiBlocked}
                className={`
                  p-2 bg-white rounded-2xl shadow-lg border-4 transition-all duration-300 transform 
                  ${isUiBlocked ? 'cursor-wait' : 'hover:scale-105 hover:shadow-xl'}
                  ${cardFeedback[card.id] === 'correct' ? 'border-green-400 scale-110 animate-pulse' : ''}
                  ${cardFeedback[card.id] === 'wrong' ? 'border-red-400 animate-shake' : ''}
                  ${!cardFeedback[card.id] ? 'border-white' : ''}
                `}
              >
                <img src={card.image} alt={card.label} className="w-full h-auto object-contain aspect-square" />
                <p className="mt-2 text-center font-bold text-sm md:text-base">{card.label}</p>
              </button>
            ))}
          </div>
        </div>
        ) : (
        <div className="text-center p-8 bg-white/90 rounded-3xl mt-8 animate-fade-in">
             <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500 mb-4">
               Bem-vindo!
             </h2>
             <p className="text-lg mb-8">Ajude a Mila a entender o que as pessoas querem dizer.</p>
             <button
              onClick={startGame}
              className="px-12 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-2xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              🚀 Começar a Jogar
            </button>
        </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full h-40 md:h-48 pointer-events-none z-10">
        <div className="relative w-full h-full max-w-4xl mx-auto">
          <div className="absolute bottom-0 -left-4 w-40 md:w-64">
             <img src="/images/mascotes/mila/mila_feiticeira_resultado.webp" alt="Mila Feiticeira" className="w-full h-auto object-contain drop-shadow-2xl" />
          </div>
          {milaMessage && (
            <div className="absolute bottom-6 left-32 md:left-56 w-[calc(100%-9rem)] md:w-auto max-w-md pointer-events-auto">
              <div className="bg-white p-3 md:p-4 rounded-2xl rounded-bl-none shadow-2xl border-2 border-violet-400 relative">
                  <p className="text-center font-semibold text-sm md:text-lg">{milaMessage}</p>
                  <div className="absolute -bottom-3 left-0 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-white transform -translate-x-full"></div>
              </div>
            </div>
          )}
        </div>
      </footer>
      
      {showVictoryModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full transform animate-bounce border-4 border-yellow-400 text-center">
             <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-4">🎉 Fase Completa! 🎉</h2>
             <p className="text-xl text-gray-700 mb-4">Você é incrível! Ganhou uma Gema Mágica e +250 pontos bônus!</p>
             <button onClick={nextPhase} className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                {currentPhaseIndex + 1 >= gameConfig.phases.length ? '🏆 Aventura Concluída!' : '🚀 Próxima Fase Mágica'}
             </button>
           </div>
         </div>
      )}
      {showGameOverModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full transform animate-bounce border-4 border-red-400 text-center">
             <h2 className="text-4xl font-bold text-red-500 mb-4">😢 Fim de Jogo 😢</h2>
             <p className="text-xl text-gray-700 mb-2">Sua pontuação final foi: <span className="font-bold text-violet-600">{score}</span></p>
             <p className="text-gray-600 mb-6">Não desanime! A prática leva à perfeição.</p>
             <button onClick={startGame} className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                 Tentar Novamente
             </button>
           </div>
         </div>
      )}
    </div>
  );
}
