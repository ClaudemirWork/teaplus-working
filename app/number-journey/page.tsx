// app/number-journey/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Star, Trophy, Heart, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './number-journey.css';

// Tipos e Interfaces
interface Reino {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  operacao: 'contar' | 'somar' | 'subtrair';
  descricao: string;
}

interface Problema {
  tipo: 'contar' | 'somar' | 'subtrair';
  objetos: string[];
  quantidades: number[];
  resposta: number;
  opcoes: number[];
}

// Lista de objetos disponíveis
const OBJETOS = [
  'maca_vermelho', 'maca_verde', 'banana', 'laranja', 'morango', 'abacaxi',
  'bola_vermelha', 'bola_futebol', 'bola_basquete',
  'gato_amarelo', 'gato_branco', 'cachorro', 'coelho_branco', 'coelho_marrom',
  'pintinho_amarelo', 'urso_marrom', 'urso_branco'
];

// Reinos disponíveis
const REINOS: Reino[] = [
  {
    id: 'contar',
    nome: 'Reino da Contagem',
    icone: '🏰',
    cor: 'from-blue-400 to-blue-600',
    operacao: 'contar',
    descricao: 'Aprenda a contar de 1 a 5'
  },
  {
    id: 'somar',
    nome: 'Reino da Soma',
    icone: '🏯',
    cor: 'from-green-400 to-green-600',
    operacao: 'somar',
    descricao: 'Descubra o poder de somar'
  },
  {
    id: 'subtrair',
    nome: 'Reino da Subtração',
    icone: '🏛️',
    cor: 'from-purple-400 to-purple-600',
    operacao: 'subtrair',
    descricao: 'Explore a magia de tirar'
  }
];

export default function NumberJourney() {
  const router = useRouter();
  const [estadoJogo, setEstadoJogo] = useState<'splash' | 'instrucoes' | 'selecao' | 'jogando' | 'vitoria'>('splash');
  const [reinoAtual, setReinoAtual] = useState<Reino | null>(null);
  const [problema, setProblema] = useState<Problema | null>(null);
  const [pontos, setPontos] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [nivel, setNivel] = useState(1);
  const [somAtivo, setSomAtivo] = useState(true);
  const [animacaoAcerto, setAnimacaoAcerto] = useState(false);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [mostrarDica, setMostrarDica] = useState(false);
  const [tentativas, setTentativas] = useState(0);

  // Gerar problema baseado no reino
  const gerarProblema = (reino: Reino): Problema => {
    const objetoAleatorio = OBJETOS[Math.floor(Math.random() * OBJETOS.length)];
    
    switch (reino.operacao) {
      case 'contar':
        const quantidade = Math.min(nivel + 1, 5);
        return {
          tipo: 'contar',
          objetos: [objetoAleatorio],
          quantidades: [quantidade],
          resposta: quantidade,
          opcoes: gerarOpcoes(quantidade, 1, 5)
        };
      
      case 'somar':
        const q1 = Math.min(Math.floor(Math.random() * 3) + 1, 3);
        const q2 = Math.min(Math.floor(Math.random() * 2) + 1, 2);
        return {
          tipo: 'somar',
          objetos: [objetoAleatorio, objetoAleatorio],
          quantidades: [q1, q2],
          resposta: q1 + q2,
          opcoes: gerarOpcoes(q1 + q2, 1, 6)
        };
      
      case 'subtrair':
        const total = Math.min(nivel + 2, 5);
        const tirar = Math.floor(Math.random() * (total - 1)) + 1;
        return {
          tipo: 'subtrair',
          objetos: [objetoAleatorio],
          quantidades: [total, tirar],
          resposta: total - tirar,
          opcoes: gerarOpcoes(total - tirar, 0, 5)
        };
      
      default:
        return gerarProblema(REINOS[0]);
    }
  };

  // Gerar opções de resposta
  const gerarOpcoes = (respostaCorreta: number, min: number, max: number): number[] => {
    const opcoes = [respostaCorreta];
    while (opcoes.length < 3) {
      const opcao = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!opcoes.includes(opcao)) {
        opcoes.push(opcao);
      }
    }
    return opcoes.sort(() => Math.random() - 0.5);
  };

  // Iniciar jogo com reino selecionado
  const iniciarJogo = (reino: Reino) => {
    setReinoAtual(reino);
    setProblema(gerarProblema(reino));
    setEstadoJogo('jogando');
    setPontos(0);
    setVidas(3);
    setNivel(1);
    setTentativas(0);
  };

  // Verificar resposta
  const verificarResposta = (resposta: number) => {
    setRespostaSelecionada(resposta);
    setTentativas(tentativas + 1);
    
    if (resposta === problema?.resposta) {
      // Acertou!
      setAnimacaoAcerto(true);
      setPontos(pontos + (10 * nivel));
      
      if (somAtivo) {
        const audio = new Audio('/sounds/sucess.wav');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
      
      setTimeout(() => {
        setAnimacaoAcerto(false);
        setRespostaSelecionada(null);
        setTentativas(0);
        setMostrarDica(false);
        
        // Próximo nível
        if (nivel < 10) {
          setNivel(nivel + 1);
          if (reinoAtual) {
            setProblema(gerarProblema(reinoAtual));
          }
        } else {
          setEstadoJogo('vitoria');
        }
      }, 1500);
    } else {
      // Errou
      if (tentativas >= 1) {
        setMostrarDica(true);
      }
      
      setTimeout(() => {
        setRespostaSelecionada(null);
      }, 800);
    }
  };

  // Renderizar objetos duplicados
  const renderizarObjetos = () => {
    if (!problema) return null;
    
    if (problema.tipo === 'contar') {
      return (
        <div className="objetos-container">
          <div className="grupo-objetos">
            {[...Array(problema.quantidades[0])].map((_, i) => (
              <img
                key={i}
                src={`/objects/${problema.objetos[0]}.webp`}
                alt="objeto"
                className="objeto-contavel"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      );
    }
    
    if (problema.tipo === 'somar') {
      return (
        <div className="objetos-container soma">
          <div className="grupo-objetos">
            {[...Array(problema.quantidades[0])].map((_, i) => (
              <img
                key={`g1-${i}`}
                src={`/objects/${problema.objetos[0]}.webp`}
                alt="objeto"
                className="objeto-contavel"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <img src="/math_symbols/soma.webp" alt="+" className="simbolo-matematico" />
          <div className="grupo-objetos">
            {[...Array(problema.quantidades[1])].map((_, i) => (
              <img
                key={`g2-${i}`}
                src={`/objects/${problema.objetos[1]}.webp`}
                alt="objeto"
                className="objeto-contavel"
                style={{ animationDelay: `${(problema.quantidades[0] + i) * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      );
    }
    
    if (problema.tipo === 'subtrair') {
      return (
        <div className="objetos-container subtracao">
          <div className="grupo-objetos">
            {[...Array(problema.quantidades[0])].map((_, i) => (
              <img
                key={i}
                src={`/objects/${problema.objetos[0]}.webp`}
                alt="objeto"
                className={`objeto-contavel ${i < problema.quantidades[1] ? 'objeto-removido' : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <div className="texto-subtracao">
            Tiramos {problema.quantidades[1]}
          </div>
        </div>
      );
    }
  };

  // Tela Splash
  if (estadoJogo === 'splash') {
    return (
      <div className="container-jogo tela-splash">
        <div className="conteudo-splash">
          <h1 className="titulo-principal">
            <span className="icone-titulo">🌟</span>
            Jornada Matemática
            <span className="icone-titulo">🌟</span>
          </h1>
          
          <div className="mila-container">
            <Image
              src="/images/mascotes/mila/mila_forca_resultado.webp"
              alt="Mila"
              width={300}
              height={300}
              className="mila-imagem"
              priority
            />
          </div>
          
          <button
            onClick={() => setEstadoJogo('instrucoes')}
            className="botao-iniciar"
          >
            <Sparkles className="icone-botao" />
            Iniciar Aventura
          </button>
        </div>
      </div>
    );
  }

  // Tela de Instruções
  if (estadoJogo === 'instrucoes') {
    return (
      <div className="container-jogo tela-instrucoes">
        <button onClick={() => setEstadoJogo('splash')} className="botao-voltar">
          <ChevronLeft /> Voltar
        </button>
        
        <div className="conteudo-instrucoes">
          <h2>Como Jogar</h2>
          <p>Explore reinos mágicos e aprenda matemática!</p>
          
          <div className="card-instrucao">
            <div className="icone-instrucao">🎯</div>
            <h3>Sua Missão</h3>
            <p>Conte os objetos e escolha o número correto. Quanto mais acertar, mais pontos você ganha!</p>
          </div>
          
          <div className="card-instrucao">
            <div className="icone-instrucao">🏆</div>
            <h3>Níveis e Prêmios</h3>
            <ul>
              <li>Comece contando até 3</li>
              <li>Avance para somas simples</li>
              <li>Desbloqueie novos reinos</li>
              <li>Ganhe estrelas e troféus!</li>
            </ul>
          </div>
          
          <button
            onClick={() => setEstadoJogo('selecao')}
            className="botao-escolher"
          >
            <Trophy className="icone-botao" />
            Escolher Reino
          </button>
        </div>
      </div>
    );
  }

  // Seleção de Reino
  if (estadoJogo === 'selecao') {
    return (
      <div className="container-jogo tela-selecao">
        <button onClick={() => setEstadoJogo('instrucoes')} className="botao-voltar">
          <ChevronLeft /> Voltar
        </button>
        
        <h2 className="titulo-selecao">Escolha seu Reino</h2>
        
        <div className="pontos-display">
          <Star className="icone-pontos" />
          <span>{pontos} pontos</span>
        </div>
        
        <div className="grid-reinos">
          {REINOS.map((reino) => (
            <button
              key={reino.id}
              onClick={() => iniciarJogo(reino)}
              className={`card-reino bg-gradient-to-br ${reino.cor}`}
            >
              <div className="icone-reino">{reino.icone}</div>
              <h3>{reino.nome}</h3>
              <p>{reino.descricao}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Tela de Jogo
  if (estadoJogo === 'jogando' && problema && reinoAtual) {
    return (
      <div className="container-jogo tela-jogo">
        <header className="header-jogo">
          <button onClick={() => setEstadoJogo('selecao')} className="botao-sair">
            <ChevronLeft /> Sair
          </button>
          
          <div className="info-jogo">
            <div className="info-item">
              <Heart className="icone-info" />
              <span>{vidas}</span>
            </div>
            <div className="info-item">
              <Star className="icone-info" />
              <span>{pontos}</span>
            </div>
            <div className="info-item">
              <span>Nível {nivel}</span>
            </div>
          </div>
          
          <button onClick={() => setSomAtivo(!somAtivo)} className="botao-som">
            {somAtivo ? <Volume2 /> : <VolumeX />}
          </button>
        </header>
        
        <main className="area-principal">
          <div className="pergunta-container">
            <h2 className="pergunta">
              {problema.tipo === 'contar' && 'Quantos você vê?'}
              {problema.tipo === 'somar' && 'Quanto dá a soma?'}
              {problema.tipo === 'subtrair' && 'Quantos sobraram?'}
            </h2>
            
            {renderizarObjetos()}
            
            {mostrarDica && (
              <div className="dica">
                💡 Dica: Conte com calma, um por um!
              </div>
            )}
          </div>
          
          <div className="opcoes-resposta">
            {problema.opcoes.map((opcao) => (
              <button
                key={opcao}
                onClick={() => verificarResposta(opcao)}
                className={`card-numero ${
                  respostaSelecionada === opcao
                    ? opcao === problema.resposta
                      ? 'correto'
                      : 'incorreto'
                    : ''
                }`}
                disabled={respostaSelecionada !== null}
              >
                <img
                  src={`/numbers/${
                    opcao === 0 ? 'zero' :
                    opcao === 1 ? 'um' :
                    opcao === 2 ? 'dois' :
                    opcao === 3 ? 'tres' :
                    opcao === 4 ? 'quatro' :
                    opcao === 5 ? 'cinco' :
                    opcao === 6 ? 'seis' :
                    opcao === 7 ? 'sete' :
                    opcao === 8 ? 'oito' :
                    opcao === 9 ? 'nove' :
                    'dez'
                  }.webp`}
                  alt={`${opcao}`}
                  className="imagem-numero"
                />
                <span className="texto-numero">{opcao}</span>
              </button>
            ))}
          </div>
          
          {animacaoAcerto && (
            <div className="celebracao">
              <div className="texto-celebracao">
                🎉 Parabéns! 🎉
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Tela de Vitória
  if (estadoJogo === 'vitoria') {
    return (
      <div className="container-jogo tela-vitoria">
        <div className="conteudo-vitoria">
          <div className="trofeu">🏆</div>
          <h1>Parabéns!</h1>
          <p>Você completou a Jornada Matemática!</p>
          
          <div className="pontuacao-final">
            <Star className="icone-grande" />
            <span className="pontos-finais">{pontos} pontos</span>
          </div>
          
          <div className="conquistas">
            <div className="conquista">
              <span className="badge">🌟</span>
              <span>Mestre dos Números</span>
            </div>
            <div className="conquista">
              <span className="badge">🎯</span>
              <span>Precisão Perfeita</span>
            </div>
            <div className="conquista">
              <span className="badge">🚀</span>
              <span>Velocidade Incrível</span>
            </div>
          </div>
          
          <button
            onClick={() => setEstadoJogo('selecao')}
            className="botao-jogar-novamente"
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  return null;
}
