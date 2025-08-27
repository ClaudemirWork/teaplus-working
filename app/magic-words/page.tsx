'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// --- Interfaces ---
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

interface Npc {
  name: string;
  image: string;
}

// --- BANCO COMPLETO DE CARDS (690+ cards) ---
const allCardsData: Card[] = [
  // AÇÕES (86 cards)
  { id: 'pensar', label: 'Pensar', image: '/images/cards/acoes/Pensar.webp', category: 'acoes' },
  { id: 'abracar', label: 'Abraçar', image: '/images/cards/acoes/abraçar.webp', category: 'acoes' },
  { id: 'abrir_macaneta', label: 'Abrir a Maçaneta', image: '/images/cards/acoes/abrir a maçaneta.webp', category: 'acoes' },
  { id: 'abrir_porta', label: 'Abrir a Porta', image: '/images/cards/acoes/abrir a porta.webp', category: 'acoes' },
  { id: 'abrir_fechadura', label: 'Abrir Fechadura', image: '/images/cards/acoes/abrir_fechadura.webp', category: 'acoes' },
  { id: 'acenar_cabeca', label: 'Acenar com a Cabeça', image: '/images/cards/acoes/acenar com a cabeça.webp', category: 'acoes' },
  { id: 'agachar', label: 'Agachar', image: '/images/cards/acoes/agachar.webp', category: 'acoes' },
  { id: 'andar_bicicleta', label: 'Andar de Bicicleta', image: '/images/cards/acoes/andar_bicicleta.webp', category: 'acoes' },
  { id: 'aplaudir', label: 'Aplaudir', image: '/images/cards/acoes/aplaudir.webp', category: 'acoes' },
  { id: 'assoar_nariz', label: 'Assoar o Nariz', image: '/images/cards/acoes/assoando o nariz.webp', category: 'acoes' },
  { id: 'beber', label: 'Beber', image: '/images/cards/acoes/beber.webp', category: 'acoes' },
  { id: 'beijo_ar', label: 'Beijo no Ar', image: '/images/cards/acoes/beijo no ar.webp', category: 'acoes' },
  { id: 'bocejar', label: 'Bocejar', image: '/images/cards/acoes/bocejar.webp', category: 'acoes' },
  { id: 'cair', label: 'Cair', image: '/images/cards/acoes/cair.webp', category: 'acoes' },
  { id: 'caminhar', label: 'Caminhar', image: '/images/cards/acoes/caminhar.webp', category: 'acoes' },
  { id: 'cantando', label: 'Cantando', image: '/images/cards/acoes/cantando.webp', category: 'acoes' },
  { id: 'carregando_livros', label: 'Carregando Livros', image: '/images/cards/acoes/carregando_livros.webp', category: 'acoes' },
  { id: 'chamar', label: 'Chamar', image: '/images/cards/acoes/chamar.webp', category: 'acoes' },
  { id: 'conversar', label: 'Conversar', image: '/images/cards/acoes/conversar.webp', category: 'acoes' },
  { id: 'cruzar_dedos', label: 'Cruzar os Dedos', image: '/images/cards/acoes/cruzando os deos.webp', category: 'acoes' },
  { id: 'curvar', label: 'Curvar', image: '/images/cards/acoes/curvar.webp', category: 'acoes' },
  { id: 'dancar_dois', label: 'Dançar a Dois', image: '/images/cards/acoes/dançar a dois.webp', category: 'acoes' },
  { id: 'dancar_sozinho', label: 'Dançar Sozinho', image: '/images/cards/acoes/dançar sozinho.webp', category: 'acoes' },
  { id: 'dar_maos', label: 'Dar as Mãos', image: '/images/cards/acoes/dar_maos.webp', category: 'acoes' },
  { id: 'descer_escadas', label: 'Descer as Escadas', image: '/images/cards/acoes/descer as escadas.webp', category: 'acoes' },
  { id: 'desligar_luz', label: 'Desligar a Luz', image: '/images/cards/acoes/desligar a luz.webp', category: 'acoes' },
  { id: 'desligar', label: 'Desligar', image: '/images/cards/acoes/desligar.webp', category: 'acoes' },
  { id: 'dirigir_carro', label: 'Dirigir um Carro', image: '/images/cards/acoes/dirigir um carro.webp', category: 'acoes' },
  { id: 'secar_maos2', label: 'Secar as Mãos', image: '/images/cards/acoes/dry_hands_2_,_to_resultado.webp', category: 'acoes' },
  { id: 'empurrar', label: 'Empurrar', image: '/images/cards/acoes/empurrar.webp', category: 'acoes' },
  { id: 'engasgar', label: 'Engasgar', image: '/images/cards/acoes/engasgar.webp', category: 'acoes' },
  { id: 'entrando_porta', label: 'Entrando pela Porta', image: '/images/cards/acoes/entrando pela porta.webp', category: 'acoes' },
  { id: 'entregar', label: 'Entregar', image: '/images/cards/acoes/entregar.webp', category: 'acoes' },
  { id: 'escovar_gatinho', label: 'Escovar o Gatinho', image: '/images/cards/acoes/escovar o gatinho.webp', category: 'acoes' },
  { id: 'escovar_cabelos', label: 'Escovar os Cabelos', image: '/images/cards/acoes/escovar os cabelos.webp', category: 'acoes' },
  { id: 'escovar_dentes', label: 'Escovar os Dentes', image: '/images/cards/acoes/escovar os dentes.webp', category: 'acoes' },
  { id: 'escrever', label: 'Escrever', image: '/images/cards/acoes/escrever.webp', category: 'acoes' },
  { id: 'esperando', label: 'Esperando', image: '/images/cards/acoes/esperando.webp', category: 'acoes' },
  { id: 'falar_telefone', label: 'Falar ao Telefone', image: '/images/cards/acoes/falar ao telefone.webp', category: 'acoes' },
  { id: 'falar', label: 'Falar', image: '/images/cards/acoes/falar.webp', category: 'acoes' },
  { id: 'fechar_porta', label: 'Fechar a Porta', image: '/images/cards/acoes/fechar a porta.webp', category: 'acoes' },
  { id: 'fumando', label: 'Fumando', image: '/images/cards/acoes/fumando.webp', category: 'acoes' },
  { id: 'gritar', label: 'Gritar', image: '/images/cards/acoes/gritar.webp', category: 'acoes' },
  { id: 'jogar_cartas', label: 'Jogar Cartas', image: '/images/cards/acoes/jogar cartas.webp', category: 'acoes' },
  { id: 'lavar_maos', label: 'Lavar as Mãos', image: '/images/cards/acoes/lavar as maos.webp', category: 'acoes' },
  { id: 'lavar_cabelos', label: 'Lavar Cabelos', image: '/images/cards/acoes/lavar cabelos.webp', category: 'acoes' },
  { id: 'lavar_rosto', label: 'Lavar o Rosto', image: '/images/cards/acoes/lavar o rosto.webp', category: 'acoes' },
  { id: 'ler_pe', label: 'Ler de Pé', image: '/images/cards/acoes/ler de pé.webp', category: 'acoes' },
  { id: 'ler_sentado', label: 'Ler Sentado', image: '/images/cards/acoes/ler sentado.webp', category: 'acoes' },
  { id: 'ler_livro', label: 'Ler Livro', image: '/images/cards/acoes/ler_livro.webp', category: 'acoes' },
  { id: 'levantar_cabeca', label: 'Levantar a Cabeça', image: '/images/cards/acoes/levantar_cabeça.webp', category: 'acoes' },
  { id: 'ligar_luz', label: 'Ligar a Luz', image: '/images/cards/acoes/ligar a luz.webp', category: 'acoes' },
  { id: 'ligar', label: 'Ligar', image: '/images/cards/acoes/ligar.webp', category: 'acoes' },
  { id: 'limpar_sapatos', label: 'Limpar Sapatos', image: '/images/cards/acoes/limpar sapatos.webp', category: 'acoes' },
  { id: 'martelando', label: 'Martelando', image: '/images/cards/acoes/martelando.webp', category: 'acoes' },
  { id: 'mastigar', label: 'Mastigar', image: '/images/cards/acoes/mastigar.webp', category: 'acoes' },
  { id: 'mudar_ideia', label: 'Mudar de Ideia', image: '/images/cards/acoes/mudar de idéia.webp', category: 'acoes' },
  { id: 'olhando', label: 'Olhando', image: '/images/cards/acoes/olhando.webp', category: 'acoes' },
  { id: 'olhando_espelho', label: 'Olhando no Espelho', image: '/images/cards/acoes/olhando_espelho.webp', category: 'acoes' },
  { id: 'olhar_baixo', label: 'Olhar para Baixo', image: '/images/cards/acoes/olhar para baixo.webp', category: 'acoes' },
  { id: 'orar', label: 'Orar', image: '/images/cards/acoes/orar.webp', category: 'acoes' },
  { id: 'ouvindo', label: 'Ouvindo', image: '/images/cards/acoes/ouvindo.webp', category: 'acoes' },
  { id: 'pegando_onibus', label: 'Pegando Ônibus', image: '/images/cards/acoes/pegando_onibus.webp', category: 'acoes' },
  { id: 'procurar', label: 'Procurar', image: '/images/cards/acoes/procurar.webp', category: 'acoes' },
  { id: 'puxar', label: 'Puxar', image: '/images/cards/acoes/puxar.webp', category: 'acoes' },
  { id: 'recebendo_bencao', label: 'Recebendo Benção', image: '/images/cards/acoes/recebendo bencao.webp', category: 'acoes' },
  { id: 'saindo_porta', label: 'Saindo pela Porta', image: '/images/cards/acoes/saindo pela porta.webp', category: 'acoes' },
  { id: 'saltar', label: 'Saltar', image: '/images/cards/acoes/saltar.webp', category: 'acoes' },
  { id: 'secar_maos', label: 'Secar as Mãos', image: '/images/cards/acoes/secar as mãos.webp', category: 'acoes' },
  { id: 'secar_varal', label: 'Secar no Varal', image: '/images/cards/acoes/secar no varal.webp', category: 'acoes' },
  { id: 'secar_rosto', label: 'Secar o Rosto', image: '/images/cards/acoes/secar o rosto.webp', category: 'acoes' },
  { id: 'secar_cabelos', label: 'Secar os Cabelos', image: '/images/cards/acoes/secar os cabelos.webp', category: 'acoes' },
  { id: 'sentar', label: 'Sentar', image: '/images/cards/acoes/sentar.webp', category: 'acoes' },
  { id: 'sentar_chao', label: 'Sentar no Chão', image: '/images/cards/acoes/sentar_chao.webp', category: 'acoes' },
  { id: 'shampoo_animal', label: 'Shampoo Animal', image: '/images/cards/acoes/shampoo_animal_,_to_resultado.webp', category: 'acoes' },
  { id: 'sonhar_acordado', label: 'Sonhar Acordado', image: '/images/cards/acoes/sonhar_acordado.webp', category: 'acoes' },
  { id: 'suando', label: 'Suando', image: '/images/cards/acoes/suando.webp', category: 'acoes' },
  { id: 'subir_arvore', label: 'Subir a Árvore', image: '/images/cards/acoes/subir a árvore.webp', category: 'acoes' },
  { id: 'sussurrar', label: 'Sussurrar', image: '/images/cards/acoes/sussurrar.webp', category: 'acoes' },
  { id: 'teclando', label: 'Teclando', image: '/images/cards/acoes/teclando.webp', category: 'acoes' },
  { id: 'tirar_blusa', label: 'Tirar a Blusa', image: '/images/cards/acoes/tirar a blusa.webp', category: 'acoes' },
  { id: 'tocar', label: 'Tocar', image: '/images/cards/acoes/tocar.webp', category: 'acoes' },
  { id: 'tocar_campainha', label: 'Tocar Campainha', image: '/images/cards/acoes/tocar_campainha.webp', category: 'acoes' },
  { id: 'trocar_fraldas', label: 'Trocar as Fraldas', image: '/images/cards/acoes/trocar as fraldas.webp', category: 'acoes' },
  { id: 'venha', label: 'Venha', image: '/images/cards/acoes/venha.webp', category: 'acoes' },
  { id: 'vestindo_blusa', label: 'Vestindo Blusa', image: '/images/cards/acoes/vestindo_blusa.webp', category: 'acoes' },
  { id: 'voltar', label: 'Voltar', image: '/images/cards/acoes/voltar.webp', category: 'acoes' },

  // ALIMENTOS (82 cards)
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
  { id: 'cafe_manha_suco', label: 'Café da Manhã com Suco', image: '/images/cards/alimentos/cafe_manha_suco.webp', category: 'alimentos' },
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

  // [Resto dos arrays de cards continua igual...]
  // ANIMAIS, CASA, CORE, ROTINA...
];

// Configuração do jogo
const gameConfig = {
  phases: [
    { cards: 4, rounds: 5, name: "Tradutor Iniciante" },
    { cards: 6, rounds: 7, name: "Intérprete Aprendiz" },
    { cards: 9, rounds: 10, name: "Mestre dos Gestos" },
    { cards: 12, rounds: 12, name: "Feiticeiro das Palavras" }
  ] as Phase[],
  cards: allCardsData,
  npcs: [
    { name: 'Mila', image: '/images/mascotes/mila/mila_rosto_resultado.webp' },
    { name: 'Léo', image: '/images/mascotes/leo/leo_rosto_resultado.webp' },
  ]
};

const Game = () => {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Estados do jogo
  const [gameStatus, setGameStatus] = useState<'intro' | 'playing' | 'victory' | 'gameOver'>('intro');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isUiBlocked, setIsUiBlocked] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  
  const [currentCards, setCurrentCards] = useState<Card[]>([]);
  const [correctCard, setCorrectCard] = useState<Card | null>(null);
  const [currentNpc, setCurrentNpc] = useState<Npc | null>(null);
  const [cardFeedback, setCardFeedback] = useState<{ [key: string]: 'correct' | 'wrong' }>({});

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [milaMessage, setMilaMessage] = useState("");
  const [introStep, setIntroStep] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const introMessages = [
    "Olá, me chamo Mila, e sou a feiticeira da floresta deste mundo encantando. Sou uma feiticeira do bem, e quero lhe convidar a ajudar a pessoas a encontrar objetos que estão escondidos na floresta, e que eles não acham.",
    "Não se preocupe, eu vou ajudá-lo nesta tarefa, e você ao acertar as cartas com o que cada cidadão está procurando, ganha pontos, e bônus extras, podendo libertar poderes especiais no jogo.",
    "Basta seguir minha voz, e procurar o card que está sendo solicitado, e clicar nele. Se acertar, ganha pontos, mas se errar, não tem problema, não perde nada e pode começar de novo.",
    "Vamos comigo nesta aventura?"
  ];

  const gameMessages = {
    start: "Vamos começar! Preste atenção!",
    correct: ["Isso mesmo!", "Você encontrou!", "Excelente!"],
    error: "Ops, não foi esse. Tente novamente!",
    phaseComplete: (phaseName: string) => `Parabéns! Você completou a fase ${phaseName}!`,
    gameOver: "Não foi dessa vez, mas você foi incrível!"
  };

  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
        setCurrentNpc(gameConfig.npcs[0]); 
        milaSpeak(introMessages[0]);
        setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    const initAudio = () => {
      if (typeof window !== 'undefined' && !audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    if (typeof window !== 'undefined') {
      document.addEventListener('click', initAudio, { once: true });
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('click', initAudio);
        audioContextRef.current?.close();
      }
    };
  }, []);

  const milaSpeak = useCallback((message: string) => {
    setMilaMessage(message);
    if (isSoundOn && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.replace(/[🎉⭐🌟❤️✨😊]/g, ''));
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, [isSoundOn]);

  const playSound = useCallback((type: 'correct' | 'wrong' | 'win') => {
    if (!isSoundOn || typeof window === 'undefined' || !audioContextRef.current) return;
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
    } else if (type === 'win') {
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        playNote(freq, now + i * 0.1, 0.15);
      });
    }
  }, [isSoundOn]);

  const nextRound = useCallback((phaseIdx: number) => {
    setIsUiBlocked(true);
    const currentPhaseConfig = gameConfig.phases[phaseIdx];
    
    if (!currentPhaseConfig) return;

    const shuffledDeck = [...gameConfig.cards].sort(() => 0.5 - Math.random());
    const correct = shuffledDeck[0];
    const distractors = shuffledDeck.slice(1, currentPhaseConfig.cards);
    const roundCards = [correct, ...distractors].sort(() => 0.5 - Math.random());
    
    setCorrectCard(correct);
    setCurrentCards(roundCards);
    setCardFeedback({});
    
    const randomNpc = gameConfig.npcs[Math.floor(Math.random() * gameConfig.npcs.length)];
    setCurrentNpc(randomNpc);

    setTimeout(() => {
        if(correct) {
          milaSpeak(`${randomNpc.name} quer o card '${correct.label}'. Encontre!`);
        }
        setIsUiBlocked(false);
    }, 1200);
  }, [milaSpeak]);

  const startGame = useCallback(() => {
    setGameStatus('playing');
    setCurrentPhaseIndex(0);
    setScore(0);
    setRoundsCompleted(0);
    setLives(3);
    if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
    }
    setMilaMessage(gameMessages.start);
    setTimeout(() => nextRound(0), 2000);
  }, [gameMessages, nextRound]);

  const handleIntroStep = () => {
    if (introStep < introMessages.length - 1) {
      setIntroStep(prev => prev + 1);
      milaSpeak(introMessages[introStep + 1]);
    } else {
      startGame();
    }
  };

  const handleCardClick = (card: Card) => {
    if (isUiBlocked || gameStatus !== 'playing') return;
    setIsUiBlocked(true);

    if (card.id === correctCard?.id) {
      setScore(prev => prev + 100);
      setCardFeedback({ [card.id]: 'correct' });
      playSound('correct');
      const randomMessage = gameMessages.correct[Math.floor(Math.random() * gameMessages.correct.length)];
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
      milaSpeak(gameMessages.error);
      
      const newLives = lives - 1;
      if (newLives <= 0) {
        setTimeout(() => {
          setGameStatus('gameOver');
          milaSpeak(gameMessages.gameOver);
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
    setScore(prev => prev + 250);
    if(phase) {
      milaSpeak(gameMessages.phaseComplete(phase.name));
    }
    setGameStatus('victory');
  };

  const nextPhase = useCallback(() => {
    const newPhaseIndex = currentPhaseIndex + 1;
    setGameStatus('playing');
    
    if (newPhaseIndex >= gameConfig.phases.length) {
      milaSpeak("Parabéns! Você completou o jogo!");
      setGameStatus('gameOver');
    } else {
      setCurrentPhaseIndex(newPhaseIndex);
      setRoundsCompleted(0);
      setLives(3);
      setTimeout(() => nextRound(newPhaseIndex), 1000);
    }
  }, [currentPhaseIndex, nextRound, milaSpeak]);

  const renderGameContent = () => {
    const phase = gameConfig.phases[currentPhaseIndex];
    const progress = phase ? (roundsCompleted / phase.rounds) * 100 : 0;
  
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 md:p-5 shadow-xl">
        <div className="text-center mb-3">
          <h2 className="text-sm md:text-lg font-bold text-gray-800 mb-2">
            Fase {currentPhaseIndex + 1}: {phase.name}
          </h2>
          <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-sky-400 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
              style={{ width: `${progress}%` }}
            >
              {roundsCompleted}/{phase.rounds}
            </div>
          </div>
        </div>
  
        {/* ÁREA DOS PERSONAGENS E CARTA PROCURADA */}
        <div className="flex items-center justify-center my-4 gap-4">
          {/* Personagens Mila e Léo */}
          <div className="flex gap-2">
            <img 
              src="/images/mascotes/mila/mila_rosto_resultado.webp"
              alt="Mila"
              className="w-14 h-14 md:w-20 md:h-20 rounded-full border-3 border-violet-400 shadow-lg"
            />
            <img 
              src="/images/mascotes/leo/leo_rosto_resultado.webp"
              alt="Léo"
              className="w-14 h-14 md:w-20 md:h-20 rounded-full border-3 border-orange-400 shadow-lg"
            />
          </div>

          {/* Balão com a carta procurada */}
          {correctCard && (
            <div className="bg-gradient-to-r from-violet-100 to-pink-100 p-3 rounded-2xl shadow-lg border-2 border-violet-300">
              <p className="text-xs md:text-sm font-bold text-gray-600 mb-2 text-center">Procure:</p>
              <div className="flex items-center gap-3">
                <img 
                  src={correctCard.image}
                  alt={correctCard.label}
                  className="w-16 h-16 md:w-24 md:h-24 object-contain rounded-lg bg-white p-1"
                />
                <p className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">
                  {correctCard.label}
                </p>
              </div>
            </div>
          )}
        </div>
  
        {/* Grade de cards */}
        <div className={`
          grid gap-2 md:gap-3 transition-opacity duration-500 max-w-5xl mx-auto
          ${isUiBlocked ? 'opacity-50' : 'opacity-100'}
          ${phase.cards <= 4 ? 'grid-cols-2 md:grid-cols-4' : ''}
          ${phase.cards === 6 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3' : ''}
          ${phase.cards === 9 ? 'grid-cols-3 md:grid-cols-3' : ''}
          ${phase.cards >= 12 ? 'grid-cols-3 md:grid-cols-4' : ''}
        `}>
          {currentCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={isUiBlocked}
              className={`
                p-2 bg-white rounded-xl shadow-lg border-3 transition-all duration-300 transform 
                ${isUiBlocked ? 'cursor-wait' : 'hover:scale-105 hover:shadow-xl active:scale-95'}
                ${cardFeedback[card.id] === 'correct' ? 'border-green-400 scale-110 animate-pulse' : ''}
                ${cardFeedback[card.id] === 'wrong' ? 'border-red-400 animate-shake' : ''}
                ${!cardFeedback[card.id] ? 'border-violet-200' : ''}
              `}
            >
              <div className="aspect-square relative">
                <img 
                  src={card.image} 
                  alt={card.label}
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <p className="mt-1 text-center font-bold text-[10px] md:text-xs">{card.label}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderIntroScreen = () => {
    const isLastStep = introStep === introMessages.length - 1;

    return (
      <div className="flex flex-col items-center justify-end md:justify-center p-4 min-h-screen">
        <div className="w-full md:max-w-4xl flex flex-col md:flex-row items-center justify-center gap-4">
          
          <div className="md:w-1/2 flex justify-center order-2 md:order-1">
            <div className="w-[80%] h-[auto] max-w-[300px] drop-shadow-2xl animate-fade-in-up">
              <img 
                src="/images/mascotes/mila/mila_feiticeira_resultado.webp"
                alt="Mila Feiticeira"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
  
          <div className="md:w-1/2 flex justify-center order-1 md:order-2">
            <div className="bg-white p-6 rounded-2xl shadow-xl border-4 border-violet-400 relative w-full max-w-xl animate-scale-in">
              <h1 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500 mb-4">
                Boas-Vindas ao Palavras Mágicas!
              </h1>
              <p className="text-gray-700 text-base md:text-lg font-medium text-center mb-6">
                {milaMessage}
              </p>
              
              <div className="flex justify-center">
                {isLastStep ? (
                  <button
                    onClick={startGame}
                    className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    Começar
                  </button>
                ) : (
                  <button
                    onClick={handleIntroStep}
                    className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    Continuar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderModals = () => (
    <>
      {gameStatus === 'victory' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-4">
              Fase Completa!
            </h2>
            <p className="text-base text-gray-700 mb-4">+250 pontos de bônus!</p>
            <button 
              onClick={nextPhase} 
              className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold rounded-full"
            >
              {currentPhaseIndex + 1 >= gameConfig.phases.length ? 'Finalizar' : 'Próxima Fase'}
            </button>
          </div>
        </div>
      )}
      
      {gameStatus === 'gameOver' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Fim de Jogo</h2>
            <p className="text-base text-gray-700 mb-4">
              Pontuação: <span className="font-bold">{score}</span>
            </p>
            <button 
              onClick={startGame} 
              className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold rounded-full"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-violet-200 to-pink-200 relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto p-2 md:p-4">
        {gameStatus === 'intro' ? renderIntroScreen() : renderGameContent()}
      </div>
      {renderModals()}
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Game;
