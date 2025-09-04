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
  operacao: 'contar' | 'contar_avancado' | 'somar' | 'subtrair' | 'grupos';
  descricao: string;
}

interface Problema {
  tipo: 'contar' | 'contar_avancado' | 'somar' | 'subtrair' | 'grupos';
  objetos: string[];
  objetosNomes: string[];
  quantidades: number[];
  resposta: number;
  opcoes: number[];
}

// Mapeamento de objetos com nomes corretos
const OBJETOS_MAP: { [key: string]: string } = {
  'maca_vermelho': 'Maçã',
  'maca_verde': 'Maçã Verde',
  'banana': 'Banana',
  'laranja': 'Laranja',
  'morango': 'Morango',
  'abacaxi': 'Abacaxi',
  'bola_vermelha': 'Bola',
  'bola_futebol': 'Bola de Futebol',
  'bola_basquete': 'Bola de Basquete',
  'gato_amarelo': 'Gato',
  'gato_branco': 'Gato Branco',
  'cachorro': 'Cachorro',
  'coelho_branco': 'Coelho',
  'coelho_marrom': 'Coelho Marrom',
  'pintinho_amarelo': 'Pintinho',
  'urso_marrom': 'Urso',
  'urso_branco': 'Urso Polar'
};

const OBJETOS = Object.keys(OBJETOS_MAP);

// Função para falar números
const falarNumero = (numero: number) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(numero.toString());
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  }
};

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
    id: 'contar_avancado',
    nome: 'Reino dos Grandes Números',
    icone: '🏗️',
    cor: 'from-indigo-400 to-indigo-600',
    operacao: 'contar_avancado',
    descricao: 'Conte de 5 a 10'
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
  },
  {
    id: 'grupos',
    nome: 'Reino dos Grupos',
    icone: '🎁',
    cor: 'from-orange-400 to-red-600',
    operacao: 'grupos',
    descricao: 'Conte grupos de objetos'
  }
];

// Componente de Confetes
const Confetti = () => {
  const [confettiElements, setConfettiElements] = useState<Array<{left: string, delay: string, color: string}>>([]);
  
  useEffect(() => {
    const elements = [...Array(50)].map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      color: ['#ff6b6b', '#4ecdc4', '#ffd93d', '#95e77e', '#a8e6cf', '#ff8cc8'][Math.floor(Math.random() * 6)]
    }));
    setConfettiElements(elements);
  }, []);

  return (
    <div className="confetti-container">
      {confettiElements.map((element, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: element.left,
            animationDelay: element.delay,
            backgroundColor: element.color
          }}
        />
      ))}
    </div>
  );
};

export default function NumberJourney() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
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
  const [mostrarConfetes, setMostrarConfetes] = useState(false);
  const [elementosBackground, setElementosBackground] = useState<Array<{left: string, delay: string, fontSize: string, content: string}>>([]);

  useEffect(() => {
    setMounted(true);
    
    // Gerar elementos do background após montar
    const elementos = [...Array(15)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      fontSize: `${Math.random() * 30 + 20}px`,
      content: i % 3 === 0 ? ['1', '2', '3', '4', '5'][Math.floor(Math.random() * 5)] 
               : i % 3 === 1 ? ['+', '-', '×', '÷'][Math.floor(Math.random() * 4)]
               : ['🔢', '🎯', '⭐', '🏆'][Math.floor(Math.random() * 4)]
    }));
    setElementosBackground(elementos);
  }, []);

  // Gerar problema baseado no reino
  const gerarProblema = (reino: Reino): Problema => {
    const objetoAleatorio = OBJETOS[Math.floor(Math.random() * OBJETOS.length)];
    const nomeObjeto = OBJETOS_MAP[objetoAleatorio];
    
    switch (reino.operacao) {
      case 'contar':
        const quantidade = Math.min(nivel + 1, 5);
        return {
          tipo: 'contar',
          objetos: [objetoAleatorio],
          objetosNomes: [nomeObjeto],
          quantidades: [quantidade],
          resposta: quantidade,
          opcoes: gerarOpcoes(quantidade, 1, 5)
        };
      
      case 'contar_avancado':
        const quantidadeAvancada = Math.min(nivel + 4, 10); // De 5 a 10
        return {
          tipo: 'contar_avancado',
          objetos: [objetoAleatorio],
          objetosNomes: [nomeObjeto],
          quantidades: [quantidadeAvancada],
          resposta: quantidadeAvancada,
          opcoes: gerarOpcoes(quantidadeAvancada, 5, 10)
        };
      
      case 'somar':
        const q1 = Math.min(Math.floor(Math.random() * 3) + 1, 3);
        const q2 = Math.min(Math.floor(Math.random() * 2) + 1, 2);
        return {
          tipo: 'somar',
          objetos: [objetoAleatorio, objetoAleatorio],
          objetosNomes: [nomeObjeto, nomeObjeto],
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
          objetosNomes: [nomeObjeto],
          quantidades: [total, tirar],
          resposta: total - tirar,
          opcoes: gerarOpcoes(total - tirar, 0, 5)
        };
      
      case 'grupos':
        const numGrupos = nivel === 1 ? 2 : Math.min(nivel, 3);
        const porGrupo = nivel === 1 ? 2 : Math.min(Math.floor(Math.random() * 2) + 2, 3);
        return {
          tipo: 'grupos',
          objetos: [objetoAleatorio],
          objetosNomes: [nomeObjeto],
          quantidades: [numGrupos, porGrupo],
          resposta: numGrupos * porGrupo,
          opcoes: gerarOpcoes(numGrupos * porGrupo, 2, 9)
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
      setMostrarConfetes(true);
      setPontos(pontos + (10 * nivel));
      
      if (somAtivo) {
        const audio = new Audio('/sounds/sucess.wav');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }
      
      setTimeout(() => {
        setAnimacaoAcerto(false);
        setMostrarConfetes(false);
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
      }, 2000);
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

  // Função para clicar no cartão de número
  const handleClickNumero = (numero: number) => {
    if (somAtivo) {
      falarNumero(numero);
    }
    verificarResposta(numero);
  };

  // Renderizar objetos duplicados
  const renderizarObjetos = () => {
    if (!problema) return null;
    
    if (problema.tipo === 'contar' || problema.tipo === 'contar_avancado') {
      return (
        <div className="objetos-container">
          <div className="nome-objeto">{problema.objetosNomes[0]}</div>
          <div className="grupo-objetos">
            {[...Array(problema.quantidades[0])].map((_, i) => {
              const nomeArquivo = problema.objetos[0] === 'bola_basquete' 
                ? 'bola basquete'
                : problema.objetos[0];
              
              return (
                <img
                  key={i}
                  src={`/objects/${nomeArquivo}.webp`}
                  alt={problema.objetosNomes[0]}
                  className="objeto-contavel"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              );
            })}
          </div>
        </div>
      );
    }
    
    if (problema.tipo === 'somar') {
      return (
        <div className="objetos-container soma">
          <div className="grupo-com-nome">
            <div className="nome-objeto">{problema.objetosNomes[0]}</div>
            <div className="grupo-objetos">
              {[...Array(problema.quantidades[0])].map((_, i) => {
                const nomeArquivo = problema.objetos[0] === 'bola_basquete' 
                  ? 'bola basquete'
                  : problema.objetos[0];
                
                return (
                  <img
                    key={`g1-${i}`}
                    src={`/objects/${nomeArquivo}.webp`}
                    alt={problema.objetosNomes[0]}
                    className="objeto-contavel"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                );
              })}
            </div>
          </div>
          <img src="/math_symbols/soma.webp" alt="+" className="simbolo-matematico" />
          <div className="grupo-com-nome">
            <div className="nome-objeto">{problema.objetosNomes[1]}</div>
            <div className="grupo-objetos">
              {[...Array(problema.quantidades[1])].map((_, i) => {
                const nomeArquivo = problema.objetos[1] === 'bola_basquete' 
                  ? 'bola basquete'
                  : problema.objetos[1];
                
                return (
                  <img
                    key={`g2-${i}`}
                    src={`/objects/${nomeArquivo}.webp`}
                    alt={problema.objetosNomes[1]}
                    className="objeto-contavel"
                    style={{ animationDelay: `${(problema.quantidades[0] + i) * 0.1}s` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    }
    
    if (problema.tipo === 'subtrair') {
      return (
        <div className="objetos-container subtracao">
          <div className="nome-objeto">{problema.objetosNomes[0]}</div>
          <div className="grupo-objetos">
            {[...Array(problema.quantidades[0])].map((_, i) => {
              const nomeArquivo = problema.objetos[0] === 'bola_basquete' 
                ? 'bola basquete'
                : problema.objetos[0];
              
              return (
                <img
                  key={i}
                  src={`/objects/${nomeArquivo}.webp`}
                  alt={problema.objetosNomes[0]}
                  className={`objeto-contavel ${i < problema.quantidades[1] ? 'objeto-removido' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              );
            })}
          </div>
          <div className="texto-subtracao">
            Tiramos {problema.quantidades[1]}
          </div>
        </div>
      );
    }
    
    if (problema.tipo === 'grupos') {
      return (
        <div className="objetos-container grupos">
          <div className="nome-objeto">{problema.objetosNomes[0]}</div>
          <div className="instrucao-grupos">
            {problema.quantidades[0]} grupos de {problema.quantidades[1]}
          </div>
          <div className="grupos-wrapper">
            {[...Array(problema.quantidades[0])].map((_, grupoIndex) => (
              <div key={grupoIndex} className="grupo-individual">
                {[...Array(problema.quantidades[1])].map((_, itemIndex) => {
                  const nomeArquivo = problema.objetos[0] === 'bola_basquete' 
                    ? 'bola basquete'
                    : problema.objetos[0];
                  
                  return (
                    <img
                      key={itemIndex}
                      src={`/objects/${nomeArquivo}.webp`}
                      alt={problema.objetosNomes[0]}
                      className="objeto-contavel"
                      style={{ 
                        animationDelay: `${(grupoIndex * problema.quantidades[1] + itemIndex) * 0.1}s` 
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  // Tela Splash
  if (estadoJogo === 'splash') {
    return (
      <div className="container-jogo tela-splash">
        {/* Background animado com números e símbolos */}
        {mounted && (
          <div className="background-animado">
            {elementosBackground.map((elemento, i) => (
              <div
                key={i}
                className="elemento-flutuante"
                style={{
                  left: elemento.left,
                  animationDelay: elemento.delay,
                  fontSize: elemento.fontSize
                }}
              >
                {elemento.content}
              </div>
            ))}
          </div>
        )}
        
        <div className="conteudo-splash">
          <h1 className="titulo-principal">
            <span className="icone-titulo">🌟</span>
            Jornada Matemática
            <span className="icone-titulo">🌟</span>
          </h1>
          
          <div className="mila-container-estatica">
            <Image
              src="/images/mascotes/mila/mila_forca_resultado.webp"
              alt="Mila"
              width={400}
              height={400}
              className="mila-imagem-grande"
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
        {mostrarConfetes && <Confetti />}
        
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
              {(problema.tipo === 'contar' || problema.tipo === 'contar_avancado') && 'Quantos você vê?'}
              {problema.tipo === 'somar' && 'Quanto dá a soma?'}
              {problema.tipo === 'subtrair' && 'Quantos sobraram?'}
              {problema.tipo === 'grupos' && 'Quantos ao todo?'}
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
                onClick={() => handleClickNumero(opcao)}
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
