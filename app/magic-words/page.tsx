'use client';

import React, { useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

// Componente para renderização apenas no lado do cliente
const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <>{children}</>;
};

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

  // ANIMAIS (66 cards)
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

  // CASA (45 cards)
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

  // CORE (29 cards)
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

  // ROTINA (46 cards)
  { id: 'ir_para_casa', label: 'Ir para Casa', image: '/images/cards/rotina/Ir para casa.webp', category: 'rotina' },
  { id: 'ontem', label: 'Ontem', image: '/images/cards/rotina/Ontem.webp', category: 'rotina' },
  { id: 'tarde', label: 'Tarde', image: '/images/cards/rotina/Tarde.webp', category: 'rotina' },
  { id: 'almoco', label: 'Almoço', image: '/images/cards/rotina/almoco.webp', category: 'rotina' },
  { id: 'amanha', label: 'Amanhã', image: '/images/cards/rotina/amanha.webp', category: 'rotina' },
  { id: 'arco_iris', label: 'Arco-Íris', image: '/images/cards/rotina/arco_iris.webp', category: 'rotina' },
  { id: 'aula_algebra', label: 'Aula de Álgebra', image: '/images/cards/rotina/aula_algebra_resultado.webp', category: 'rotina' },
  { id: 'aula_ciencias', label: 'Aula de Ciências', image: '/images/cards/rotina/aula_ciencias_resultado.webp', category: 'rotina' },
  { id: 'aula_educacao_fisica', label: 'Aula de Educação Física', image: '/images/cards/rotina/aula_educacao_fisica_resultado.webp', category: 'rotina' },
  { id: 'aula_musica', label: 'Aula de Música', image: '/images/cards/rotina/aula_musica_resultado.webp', category: 'rotina' },
  { id: 'aula_natacao', label: 'Aula de Natação', image: '/images/cards/rotina/aula_natacao_resultado.webp', category: 'rotina' },
  { id: 'brincar', label: 'Brincar', image: '/images/cards/rotina/brincar.webp', category: 'rotina' },
  { id: 'cafe_manha', label: 'Café da Manhã', image: '/images/cards/rotina/cafe_manha.webp', category: 'rotina' },
  { id: 'cafe_tarde', label: 'Café da Tarde', image: '/images/cards/rotina/cafe_tarde.webp', category: 'rotina' },
  { id: 'chuva', label: 'Chuva', image: '/images/cards/rotina/chuva.webp', category: 'rotina' },
  { id: 'domingo', label: 'Domingo', image: '/images/cards/rotina/domingo.webp', category: 'rotina' },
  { id: 'ensolarado', label: 'Ensolarado', image: '/images/cards/rotina/ensolarado.webp', category: 'rotina' },
  { id: 'estudar', label: 'Estudar', image: '/images/cards/rotina/estudar.webp', category: 'rotina' },
  { id: 'estudar_computacao', label: 'Estudar Computação', image: '/images/cards/rotina/estudar_computacao.webp', category: 'rotina' },
  { id: 'estudar_computador_casa', label: 'Estudar no Computador', image: '/images/cards/rotina/estudar_computador_casa.webp', category: 'rotina' },
  { id: 'estudar_geografia', label: 'Estudar Geografia', image: '/images/cards/rotina/estudar_geografia.webp', category: 'rotina' },
  { id: 'estudar_historia', label: 'Estudar História', image: '/images/cards/rotina/estudar_historia.webp', category: 'rotina' },
  { id: 'estudar_ingles', label: 'Estudar Inglês', image: '/images/cards/rotina/estudar_ingles.webp', category: 'rotina' },
  { id: 'estudar_matematica', label: 'Estudar Matemática', image: '/images/cards/rotina/estudar_matematica.webp', category: 'rotina' },
  { id: 'hoje', label: 'Hoje', image: '/images/cards/rotina/hoje.webp', category: 'rotina' },
  { id: 'hora_acordar', label: 'Hora de Acordar', image: '/images/cards/rotina/hora_acordar.webp', category: 'rotina' },
  { id: 'hora_dormir', label: 'Hora de Dormir', image: '/images/cards/rotina/hora_dormir.webp', category: 'rotina' },
  { id: 'jantar', label: 'Jantar', image: '/images/cards/rotina/jantar.webp', category: 'rotina' },
  { id: 'licao_casa', label: 'Lição de Casa', image: '/images/cards/rotina/licao_casa.webp', category: 'rotina' },
  { id: 'manha', label: 'Manhã', image: '/images/cards/rotina/manha.webp', category: 'rotina' },
  { id: 'mochila_escola', label: 'Mochila Escolar', image: '/images/cards/rotina/mochila_escola.webp', category: 'rotina' },
  { id: 'mudanca_tempo', label: 'Mudança de Tempo', image: '/images/cards/rotina/mudanca_tempo.webp', category: 'rotina' },
  { id: 'noite', label: 'Noite', image: '/images/cards/rotina/noite.webp', category: 'rotina' },
  { id: 'quarta_feira', label: 'Quarta-feira', image: '/images/cards/rotina/quarta_feira.webp', category: 'rotina' },
  { id: 'quinta_feira', label: 'Quinta-feira', image: '/images/cards/rotina/quinta_feira.webp', category: 'rotina' },
  { id: 'sabado', label: 'Sábado', image: '/images/cards/rotina/sabado.webp', category: 'rotina' },
  { id: 'segunda_feira', label: 'Segunda-feira', image: '/images/cards/rotina/segundafeira.webp', category: 'rotina' },
  { id: 'sem_escola_hoje', label: 'Sem Escola Hoje', image: '/images/cards/rotina/sem_escola_hoje_resultado.webp', category: 'rotina' },
  { id: 'semana', label: 'Semana', image: '/images/cards/rotina/semana.webp', category: 'rotina' },
  { id: 'sexta_feira', label: 'Sexta-feira', image: '/images/cards/rotina/sexta_feira.webp', category: 'rotina' },
  { id: 'terca_feira', label: 'Terça-feira', image: '/images/cards/rotina/terca_feira.webp', category: 'rotina' },
  { id: 'tomar_banho', label: 'Tomar Banho', image: '/images/cards/rotina/tomar_banho.webp', category: 'rotina' },
  { id: 'ver_televisao', label: 'Ver Televisão', image: '/images/cards/rotina/ver_televisao.webp', category: 'rotina' },
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

// Componente do Jogo propriamente dito
const Game = () => {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);

  // Inicialização atrasada dos estados para evitar erros no SSR
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

  const introMessages = [
    "Olá, me chamo Mila, e sou a feiticeira da floresta deste mundo encantando. Sou uma feiticeira do bem, e quero lhe convidar a ajudar a pessoas a encontrar objetos que estão escondidos na floresta, e que eles não acham.",
    "Não se preocupe, eu vou ajudá-lo nesta tarefa, e você ao acertar as cartas com o que cada cidadão está procurando, ganha pontos, e bônus extras, podendo libertar poderes especiais no jogo.",
    "Basta seguir minha voz, e procurar o card que está sendo solicitado, e clicar nele. Se acertar, ganha pontos, mas se errar, não tem problema, não perde nada e pode começar de novo.",
    "Vamos comigo nesta aventura?"
  ];

  const gameMessages = {
    start: "Vamos começar! Preste atenção!",
    correct: ["Isso mesmo! 🎉", "Você encontrou! ⭐", "Excelente! 🌟"],
    error: "Ops, não foi esse. Tente novamente! ❤️",
    phaseComplete: (phaseName: string) => `Parabéns! Você completou a fase ${phaseName}! ✨`,
    gameOver: "Não foi dessa vez, mas você foi incrível! 😊"
  };

  // A inicialização dos estados agora é feita de forma assíncrona,
  // dentro do useEffect. Isso garante que só ocorra no cliente.
  useEffect(() => {
    setCurrentNpc(gameConfig.npcs[0]); 
    milaSpeak(introMessages[0]);
  }, []);

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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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
      milaSpeak("Parabéns! Você completou o jogo! 🎉");
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
            🌟 Fase {currentPhaseIndex + 1}: {phase.name} 🌟
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
  
        <div className="flex flex-col md:flex-row items-center justify-center my-3 gap-3 md:gap-5">
          <div className="bg-white p-2 md:p-3 rounded-xl shadow-md text-center border-2 border-pink-200 flex items-center gap-2 md:gap-3">
            {currentNpc && (
              <img 
                src={currentNpc.image} 
                alt={currentNpc.name}
                className="w-16 h-16 md:w-20 md:h-20 object-contain animate-bounce" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.fallback-text')) {
                    const fallbackText = document.createElement('div');
                    fallbackText.className = 'fallback-text absolute inset-0 bg-gradient-to-br from-violet-100 to-pink-100 rounded flex items-center justify-center text-gray-700 font-semibold text-center text-sm';
                    fallbackText.textContent = currentNpc.name;
                    parent.appendChild(fallbackText);
                  }
                }}
              />
            )}
            <div className="flex flex-col items-start">
              <p className="font-bold text-sm md:text-base text-gray-800">{currentNpc?.name}</p>
              {correctCard && (
                <p className="text-lg md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">
                  {correctCard.label}
                </p>
              )}
            </div>
          </div>
        </div>
  
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
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-text')) {
                      const fallbackText = document.createElement('div');
                      fallbackText.className = 'fallback-text absolute inset-0 bg-gradient-to-br from-violet-100 to-pink-100 rounded flex items-center justify-center text-gray-700 font-semibold text-center text-xs md:text-sm p-1';
                      fallbackText.textContent = card.label;
                      parent.appendChild(fallbackText);
                    }
                  }}
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
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="w-full h-auto max-w-[300px] aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                      <span class="text-7xl">🧙‍♀️</span>
                    </div>
                  `;
                }}
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
                    🚀 Começar
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
              🎉 Fase Completa! 🎉
            </h2>
            <p className="text-base text-gray-700 mb-4">+250 pontos de bônus!</p>
            <button 
              onClick={nextPhase} 
              className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold rounded-full"
            >
              {currentPhaseIndex + 1 >= gameConfig.phases.length ? '🏆 Finalizar' : '🚀 Próxima Fase'}
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
    </div>
  );
};

export default function MagicWordsGameWrapper() {
  return (
    <ClientOnly>
      <Game />
    </ClientOnly>
  );
}
