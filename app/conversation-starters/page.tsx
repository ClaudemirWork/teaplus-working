'use client';

import { useState } from 'react';

interface Option {
  text: string;
  correct: boolean;
  feedback: string;
}

interface Situation {
  situation: string;
  options: Option[];
}

interface LevelData {
  title: string;
  situations: Situation[];
}

const gameData: Record<number, LevelData> = {
  1: {
    title: "Conversas Básicas",
    situations: [
      {
        situation: "Você encontra um colega da escola no corredor durante o intervalo.",
        options: [
          { 
            text: "Oi! Como você está?", 
            correct: true, 
            feedback: "Perfeito! Um cumprimento simples e direto é sempre uma boa forma de iniciar uma conversa. Demonstra interesse genuíno pela pessoa." 
          },
          { 
            text: "Você pode me emprestar dinheiro?", 
            correct: false, 
            feedback: "Pedir favores logo no início pode ser desconfortável. É melhor começar com um cumprimento e construir a conversa gradualmente." 
          },
          { 
            text: "Não dizer nada e passar direto", 
            correct: false, 
            feedback: "Ignorar conhecidos pode parecer rude. Um simples 'oi' já demonstra educação e pode abrir oportunidades de interação positiva." 
          }
        ]
      },
      {
        situation: "Você está na fila do lanche e vê um colega que você conhece pouco.",
        options: [
          { 
            text: "Esta fila está bem grande hoje, né?", 
            correct: true, 
            feedback: "Excelente! Comentar sobre algo que vocês estão vivenciando juntos é uma estratégia eficaz para quebrar o gelo de forma natural." 
          },
          { 
            text: "Você sempre come lanche aqui?", 
            correct: false, 
            feedback: "Esta pergunta pode soar um pouco invasiva para alguém que você conhece pouco. É melhor começar com observações neutras." 
          },
          { 
            text: "Ficar em silêncio olhando para o celular", 
            correct: false, 
            feedback: "Perder a oportunidade de interagir pode limitar o desenvolvimento de novos relacionamentos. Pequenas interações ajudam a construir vínculos." 
          }
        ]
      },
      {
        situation: "Seu vizinho está regando as plantas no jardim quando você passa.",
        options: [
          { 
            text: "Bom dia! Suas plantas estão lindas!", 
            correct: true, 
            feedback: "Perfeito! Elogios sinceros sobre algo visível são uma forma calorosa de iniciar conversas com vizinhos e demonstram atenção positiva." 
          },
          { 
            text: "Quanto você gasta com água para regar isso?", 
            correct: false, 
            feedback: "Perguntas sobre custos podem ser consideradas indiscretas. É melhor focar em aspectos positivos e neutros." 
          },
          { 
            text: "Acenar rapidamente e seguir andando", 
            correct: false, 
            feedback: "Um aceno é educado, mas uma breve conversa pode fortalecer o relacionamento de vizinhança e criar um ambiente mais amigável." 
          }
        ]
      },
      {
        situation: "Você chega cedo na aula e há apenas mais um colega na sala.",
        options: [
          { 
            text: "Oi! Chegamos cedo hoje, né?", 
            correct: true, 
            feedback: "Ótimo! Observar uma situação compartilhada cria conexão imediata e é uma forma natural de iniciar uma conversa em ambientes escolares." 
          },
          { 
            text: "Você fez a lição de casa?", 
            correct: false, 
            feedback: "Embora relacionado ao contexto escolar, começar falando de obrigações pode criar pressão. É melhor estabelecer um clima amigável primeiro." 
          },
          { 
            text: "Sentar em silêncio mexendo no celular", 
            correct: false, 
            feedback: "Momentos sozinhos com colegas são oportunidades valiosas para fortalecer relacionamentos. Uma pequena interação pode fazer a diferença." 
          }
        ]
      },
      {
        situation: "Você está esperando o ônibus e reconhece alguém da sua idade.",
        options: [
          { 
            text: "Oi! Você também pega este ônibus?", 
            correct: true, 
            feedback: "Excelente! Identificar algo em comum (como pegar o mesmo ônibus) é uma estratégia eficaz para iniciar conversas com desconhecidos de forma segura." 
          },
          { 
            text: "Onde você mora?", 
            correct: false, 
            feedback: "Perguntas muito pessoais podem deixar desconhecidos desconfortáveis. É melhor começar com observações sobre a situação atual." 
          },
          { 
            text: "Olhar para o celular e evitar contato visual", 
            correct: false, 
            feedback: "Evitar interação pode fazer você perder oportunidades de conhecer pessoas interessantes. Um simples 'oi' pode abrir novas amizades." 
          }
        ]
      }
    ]
  },
  2: {
    title: "Situações Intermediárias",
    situations: [
      {
        situation: "Você está em uma festa de aniversário e conhece poucas pessoas. Há um grupo conversando sobre filmes.",
        options: [
          { 
            text: "Com licença, posso me juntar? Ouvi vocês falando de filmes.", 
            correct: true, 
            feedback: "Perfeito! Pedir permissão educadamente e mostrar interesse no tópico é a forma ideal de se juntar a conversas em grupo." 
          },
          { 
            text: "Interromper para contar sobre seu filme favorito", 
            correct: false, 
            feedback: "Interromper pode ser mal visto. É melhor aguardar uma pausa natural e pedir permissão para participar da conversa." 
          },
          { 
            text: "Ficar próximo ouvindo sem participar", 
            correct: false, 
            feedback: "Apenas ouvir pode parecer invasivo. É melhor se apresentar e pedir para participar da conversa de forma educada." 
          }
        ]
      },
      {
        situation: "No trabalho em grupo da escola, você foi colocado com pessoas que não conhece bem.",
        options: [
          { 
            text: "Oi pessoal! Eu sou [seu nome]. Como vocês acham que devemos começar?", 
            correct: true, 
            feedback: "Excelente! Apresentar-se e fazer uma pergunta aberta sobre o trabalho integra o grupo e demonstra proatividade colaborativa." 
          },
          { 
            text: "Esperar alguém tomar a iniciativa", 
            correct: false, 
            feedback: "Aguardar pode fazer o grupo perder tempo. Tomar iniciativa de forma respeitosa demonstra liderança e ajuda o grupo a progredir." 
          },
          { 
            text: "Começar a trabalhar sozinho no seu celular", 
            correct: false, 
            feedback: "Trabalhar isoladamente vai contra o propósito do trabalho em grupo e pode prejudicar tanto o resultado quanto os relacionamentos." 
          }
        ]
      },
      {
        situation: "Você está no intervalo e vê um grupo de colegas conversando animadamente sobre um assunto que você conhece.",
        options: [
          { 
            text: "Esperar uma pausa e dizer: 'Desculpem, ouvi vocês falando sobre [assunto]. Posso dar minha opinião?'", 
            correct: true, 
            feedback: "Perfeito! Aguardar o momento certo e pedir permissão demonstra respeito pelo grupo e interesse genuíno no assunto." 
          },
          { 
            text: "Chegar falando alto: 'Ei, eu sei tudo sobre isso!'", 
            correct: false, 
            feedback: "Ser muito assertivo pode intimidar o grupo. É melhor ser mais sutil e respeitoso ao se juntar a conversas em andamento." 
          },
          { 
            text: "Ficar próximo sinalizando que quer participar", 
            correct: false, 
            feedback: "Sinais não verbais podem ser mal interpretados. É mais eficaz comunicar verbalmente seu interesse em participar da conversa." 
          }
        ]
      },
      {
        situation: "Em uma reunião familiar, você precisa conversar com parentes que não vê há muito tempo.",
        options: [
          { 
            text: "Oi tia! Faz tempo que não nos vemos. Como você está?", 
            correct: true, 
            feedback: "Ótimo! Reconhecer o tempo que passou e demonstrar interesse genuíno são estratégias eficazes para reconectar com familiares." 
          },
          { 
            text: "Cumprimentar rapidamente e ir para outro canto", 
            correct: false, 
            feedback: "Evitar interação em reuniões familiares pode parecer rude e perder oportunidades de fortalecer vínculos familiares importantes." 
          },
          { 
            text: "Esperar que eles venham falar com você", 
            correct: false, 
            feedback: "Tomar iniciativa em contextos familiares demonstra carinho e pode facilitar conversas mais significativas com parentes queridos." 
          }
        ]
      },
      {
        situation: "Você está em uma atividade extracurricular nova e não conhece ninguém.",
        options: [
          { 
            text: "Olá! Eu sou novo aqui. Esta é a primeira vez de vocês também?", 
            correct: true, 
            feedback: "Excelente! Identificar-se como novo e fazer perguntas sobre a experiência dos outros cria conexão e pode encontrar outros iniciantes." 
          },
          { 
            text: "Sentar no canto e observar tudo em silêncio", 
            correct: false, 
            feedback: "Observar é natural, mas participar ativamente ajuda na integração. Pequenas interações facilitam a adaptação ao novo ambiente." 
          },
          { 
            text: "Tentar impressionar contando suas conquistas em outras atividades", 
            correct: false, 
            feedback: "Focar demais em si mesmo pode afastar pessoas. É melhor demonstrar interesse genuíno nos outros e na atividade atual." 
          }
        ]
      }
    ]
  },
  3: {
    title: "Interações Avançadas",
    situations: [
      {
        situation: "Em uma festa com muitas pessoas desconhecidas, você quer se integrar a uma conversa sobre um tópico complexo que você conhece bem.",
        options: [
          { 
            text: "Aguardar uma pausa natural e dizer: 'Desculpem interromper, mas achei interessante o que vocês estavam discutindo. Posso compartilhar uma perspectiva?'", 
            correct: true, 
            feedback: "Perfeito! Esta abordagem demonstra respeito pelo grupo, interesse genuíno e oferece valor à conversa de forma educada e não invasiva." 
          },
          { 
            text: "Interromper para corrigir uma informação incorreta que ouviu", 
            correct: false, 
            feedback: "Corrigir pessoas que você não conhece pode criar tensão. É melhor esperar o momento certo e oferecer sua perspectiva de forma construtiva." 
          },
          { 
            text: "Ficar próximo acenando com a cabeça concordando com tudo", 
            correct: false, 
            feedback: "Apenas concordar sem contribuir pode parecer superficial. É melhor se posicionar de forma respeitosa quando apropriado." 
          }
        ]
      },
      {
        situation: "Você está em um evento de networking profissional e precisa abordar pessoas influentes na sua área.",
        options: [
          { 
            text: "Aproximar-se durante uma pausa e dizer: 'Olá, eu sou [nome]. Admiro muito seu trabalho em [área específica]. Poderia me dar alguns minutos para uma conversa?'", 
            correct: true, 
            feedback: "Excelente! Esta abordagem é profissional, específica e demonstra preparação. Reconhecer o trabalho da pessoa e pedir permissão são estratégias eficazes." 
          },
          { 
            text: "Entregar seu cartão para várias pessoas sem conversar", 
            correct: false, 
            feedback: "Networking eficaz requer conversas genuínas. Simplesmente distribuir cartões sem conexão pessoal é menos eficaz para construir relacionamentos." 
          },
          { 
            text: "Aguardar que alguém venha falar com você", 
            correct: false, 
            feedback: "Em eventos de networking, a proatividade é essencial. Aguardar pode resultar em poucas conexões valiosas." 
          }
        ]
      },
      {
        situation: "Durante um debate acadêmico, você discorda de uma opinião popular mas quer expressar sua visão respeitosamente.",
        options: [
          { 
            text: "Esperar sua vez e dizer: 'Entendo esse ponto de vista, mas gostaria de apresentar uma perspectiva alternativa baseada em [evidência].'", 
            correct: true, 
            feedback: "Perfeito! Esta abordagem reconhece outras opiniões, é respeitosa e fundamentada. Essencial para debates construtivos e acadêmicos." 
          },
          { 
            text: "Interromper para dizer que todos estão errados", 
            correct: false, 
            feedback: "Ser confrontativo pode prejudicar o debate. É melhor apresentar argumentos de forma respeitosa e construtiva." 
          },
          { 
            text: "Ficar em silêncio para evitar conflito", 
            correct: false, 
            feedback: "Em contextos acadêmicos, diferentes perspectivas enriquecem o debate. Expressar opiniões fundamentadas é valioso quando feito respeitosamente." 
          }
        ]
      },
      {
        situation: "Você precisa mediar uma discussão entre dois amigos que estão discordando sobre algo importante.",
        options: [
          { 
            text: "'Pessoal, vocês dois têm pontos válidos. Que tal cada um explicar sua perspectiva sem interrupções?'", 
            correct: true, 
            feedback: "Excelente! Mediar conflitos requer neutralidade, reconhecimento de ambas as partes e estabelecimento de regras claras para comunicação respeitosa." 
          },
          { 
            text: "Tomar o lado de quem você acha que está certo", 
            correct: false, 
            feedback: "Tomar partido pode escalar o conflito. Um mediador eficaz mantém neutralidade e foca em facilitar o entendimento mútuo." 
          },
          { 
            text: "Mudar de assunto para evitar o conflito", 
            correct: false, 
            feedback: "Evitar o conflito pode deixar questões importantes sem resolução. É melhor facilitar uma discussão construtiva." 
          }
        ]
      },
      {
        situation: "Em uma apresentação pública, um membro da audiência faz uma pergunta desafiadora sobre seu tema.",
        options: [
          { 
            text: "'Obrigado pela pergunta. É um ponto importante que merece uma resposta cuidadosa. [responder] E você, qual sua experiência com isso?'", 
            correct: true, 
            feedback: "Perfeito! Agradecer, reconhecer a importância, responder com cuidado e devolver uma pergunta demonstra profissionalismo e engajamento genuíno." 
          },
          { 
            text: "Dar uma resposta rápida e passar para outra pergunta", 
            correct: false, 
            feedback: "Respostas superficiais podem prejudicar sua credibilidade. É melhor abordar perguntas desafiadoras com profundidade e respeito." 
          },
          { 
            text: "Dizer que a pergunta está fora do escopo da apresentação", 
            correct: false, 
            feedback: "Descartar perguntas pode parecer evasivo. É melhor tentar responder ou explicar construtivamente por que está fora do escopo." 
          }
        ]
      }
    ]
  }
};

export default function ConversationStarters() {
  const [currentScreen, setCurrentScreen] = useState<'explanation' | 'level-selection' | 'game' | 'results'>('explanation');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentSituation, setCurrentSituation] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answered, setAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const showScreen = (screen: 'explanation' | 'level-selection' | 'game' | 'results') => {
    setCurrentScreen(screen);
  };

  const startLevel = (level: number) => {
    setCurrentLevel(level);
    setCurrentSituation(0);
    setScore(0);
    setAnswered(false);
    setSelectedOption(null);
    setShowFeedback(false);
    setCurrentScreen('game');
  };

  const selectOption = (index: number, option: Option) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedOption(index);
    setShowFeedback(true);
    
    if (option.correct) {
      setScore(score + 1);
    }
  };

  const nextSituation = () => {
    const levelData = gameData[currentLevel];
    
    if (currentSituation < levelData.situations.length - 1) {
      setCurrentSituation(currentSituation + 1);
      setAnswered(false);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setCurrentScreen('results');
    }
  };

  const restartLevel = () => {
    startLevel(currentLevel);
  };

  const currentLevelData = gameData[currentLevel];
  const currentSituationData = currentLevelData?.situations[currentSituation];
  const progress = currentLevelData ? ((currentSituation + 1) / currentLevelData.situations.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500">
      {/* Header Mobile */}
      {currentScreen !== 'explanation' && (
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <a 
                href="/tea" 
                className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors min-h-[44px] px-2 -ml-2"
              >
                <span className="text-xl mr-2">←</span>
                <span className="text-sm sm:text-base font-medium">Voltar para TEA</span>
              </a>
              
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex-1 mx-4 flex items-center justify-center gap-2">
                <span className="text-xl sm:text-2xl">💬</span>
                <span>Iniciando Conversas</span>
              </h1>
              
              <div className="w-20"></div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {currentScreen === 'explanation' && (
            <div className="p-4 sm:p-8">
              {/* Header com seta voltar */}
              <div className="flex items-center mb-6">
                <a 
                  href="/tea" 
                  className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors min-h-[44px] px-2 -ml-2 mr-4"
                >
                  <span className="text-xl mr-2">←</span>
                  <span className="text-sm sm:text-base font-medium">Voltar para TEA</span>
                </a>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2 sm:gap-4">
                  <span className="text-4xl sm:text-6xl">💬</span>
                  <span>Iniciando Conversas</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600">Desenvolvendo habilidades de comunicação social</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-8 rounded-2xl mb-6 sm:mb-8 border-l-4 border-blue-500">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                  🎯 Objetivo da Atividade
                </h2>
                <p className="text-blue-700 text-base sm:text-lg leading-relaxed mb-4">
                  Aprender estratégias eficazes para iniciar conversas em diferentes situações sociais, 
                  desenvolvendo scripts sociais estruturados e aumentando a confiança na comunicação interpessoal.
                </p>
                
                <div className="bg-white p-3 sm:p-4 rounded-xl border border-blue-200">
                  <p className="text-blue-800 font-semibold mb-2 text-sm sm:text-base">📚 O que você vai aprender:</p>
                  <div className="text-blue-700 space-y-1 text-xs sm:text-sm">
                    <p>• Como começar uma conversa de forma natural</p>
                    <p>• Frases e scripts sociais para diferentes contextos</p>
                    <p>• Leitura de sinais sociais e momento adequado</p>
                    <p>• Técnicas de manutenção do diálogo</p>
                    <p>• Estratégias para superar a ansiedade social</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-700 text-center mb-4 sm:mb-6">🎮 Níveis de Dificuldade</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl border-l-4 border-green-500 transform hover:scale-105 transition-transform">
                  <h3 className="text-lg sm:text-xl font-bold text-green-700 mb-3 flex items-center gap-2">
                    🟢 Nível 1: Básico
                  </h3>
                  <p className="text-green-600 text-sm">Situações simples do cotidiano com pessoas conhecidas. Foco em cumprimentos e frases de abertura básicas.</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6 rounded-xl border-l-4 border-orange-500 transform hover:scale-105 transition-transform">
                  <h3 className="text-lg sm:text-xl font-bold text-orange-700 mb-3 flex items-center gap-2">
                    🟡 Nível 2: Intermediário
                  </h3>
                  <p className="text-orange-600 text-sm">Conversas em grupos pequenos e situações semi-estruturadas. Introdução de tópicos e perguntas abertas.</p>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-xl border-l-4 border-red-500 transform hover:scale-105 transition-transform">
                  <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-3 flex items-center gap-2">
                    🔴 Nível 3: Avançado
                  </h3>
                  <p className="text-red-600 text-sm">Situações sociais complexas, grupos maiores e conversas espontâneas. Habilidades avançadas de interação.</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border-l-4 border-purple-500 mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-purple-700 mb-3 flex items-center gap-2">
                  🔬 Base Científica
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-3">
                  Esta atividade baseia-se em técnicas de <strong>Análise do Comportamento Aplicada (ABA)</strong> e 
                  <strong> Treino de Habilidades Sociais</strong>, métodos comprovados para desenvolvimento de competências 
                  comunicativas em pessoas com TEA.
                </p>
                <p className="text-gray-700 text-sm">
                  Utilizamos <strong>scripts sociais estruturados</strong>, progressão em níveis de dificuldade e 
                  sistema de reforçamento positivo, conforme as melhores práticas da literatura científica atual.
                </p>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => showScreen('level-selection')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-bold hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all shadow-lg flex items-center gap-2 min-h-[48px] touch-manipulation"
                >
                  Começar Atividade 🚀
                </button>
              </div>
            </div>
          )}

          {currentScreen === 'level-selection' && (
            <div className="p-4 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2 sm:gap-4">
                  <span className="text-3xl sm:text-5xl">💬</span>
                  <span>Escolha seu Nível</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600">Selecione o nível adequado para você</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-8">
                <button 
                  onClick={() => startLevel(1)}
                  className="bg-white border-4 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-green-400 hover:bg-green-50 transform hover:-translate-y-2 transition-all shadow-lg text-center group min-h-[48px] touch-manipulation"
                >
                  <div className="text-4xl sm:text-6xl mb-4 text-green-500">🟢</div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-3 group-hover:text-green-600">Nível 1 - Básico</h3>
                  <p className="text-gray-600 text-sm">Conversas simples com pessoas próximas</p>
                </button>

                <button 
                  onClick={() => startLevel(2)}
                  className="bg-white border-4 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-orange-400 hover:bg-orange-50 transform hover:-translate-y-2 transition-all shadow-lg text-center group min-h-[48px] touch-manipulation"
                >
                  <div className="text-4xl sm:text-6xl mb-4 text-orange-500">🟡</div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-3 group-hover:text-orange-600">Nível 2 - Intermediário</h3>
                  <p className="text-gray-600 text-sm">Situações sociais estruturadas</p>
                </button>

                <button 
                  onClick={() => startLevel(3)}
                  className="bg-white border-4 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-red-400 hover:bg-red-50 transform hover:-translate-y-2 transition-all shadow-lg text-center group min-h-[48px] touch-manipulation"
                >
                  <div className="text-4xl sm:text-6xl mb-4 text-red-500">🔴</div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-3 group-hover:text-red-600">Nível 3 - Avançado</h3>
                  <p className="text-gray-600 text-sm">Interações sociais complexas</p>
                </button>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => showScreen('explanation')}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-colors min-h-[48px] touch-manipulation"
                >
                  ← Voltar
                </button>
              </div>
            </div>
          )}

          {currentScreen === 'game' && currentSituationData && (
            <div className="p-4 sm:p-8">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <span className="text-base sm:text-lg font-semibold mb-2 sm:mb-0">Situação {currentSituation + 1} de {currentLevelData.situations.length}</span>
                  <span className="text-base sm:text-lg font-semibold">Nível {currentLevel}</span>
                </div>
                <div className="flex-1 mx-0 sm:mx-6 bg-white/30 h-2 sm:h-3 rounded-full overflow-hidden mb-4">
                  <div 
                    className="bg-green-400 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-center">{currentLevelData.title}</h2>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-100">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8 border-l-4 border-green-500">
                  <h3 className="text-lg sm:text-xl font-bold text-green-700 mb-3 flex items-center gap-2">
                    📍 Situação
                  </h3>
                  <p className="text-green-800 text-base sm:text-lg leading-relaxed">{currentSituationData.situation}</p>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-4 sm:mb-6 flex items-center gap-2">
                  💭 Como você iniciaria a conversa?
                </h3>
                
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {currentSituationData.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => selectOption(index, option)}
                      disabled={answered}
                      className={`w-full text-left p-4 sm:p-6 rounded-xl border-2 transition-all font-medium min-h-[48px] touch-manipulation ${
                        answered
                          ? option.correct
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : selectedOption === index
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                          : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 active:bg-indigo-100 active:transform active:translate-x-1'
                      }`}
                    >
                      <div className="text-sm sm:text-lg">{option.text}</div>
                    </button>
                  ))}
                </div>

                {showFeedback && selectedOption !== null && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4 sm:p-6 mb-6">
                    <h4 className="text-base sm:text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                      💡 Explicação
                    </h4>
                    <p className="text-blue-800 leading-relaxed text-sm sm:text-base">
                      {currentSituationData.options[selectedOption].feedback}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <button 
                    onClick={() => showScreen('level-selection')}
                    className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-colors min-h-[48px] touch-manipulation order-2 sm:order-1"
                  >
                    ← Níveis
                  </button>
                  
                  {answered && (
                    <button 
                      onClick={nextSituation}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:from-indigo-700 active:to-purple-800 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all min-h-[48px] touch-manipulation order-1 sm:order-2"
                    >
                      {currentSituation < currentLevelData.situations.length - 1 ? 'Próxima Situação →' : 'Ver Resultados 🎯'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentScreen === 'results' && (
            <div className="p-4 sm:p-8 text-center">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-green-600 mb-4">🎉 Parabéns!</h2>
                <p className="text-lg sm:text-xl text-gray-600">Você completou o nível!</p>
              </div>

              <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 sm:p-8 rounded-2xl mb-6 sm:mb-8 shadow-lg">
                <div className="text-4xl sm:text-5xl mb-4">⭐</div>
                <div className="text-2xl sm:text-3xl font-bold mb-2">
                  Sua pontuação: {score}/{currentLevelData.situations.length}
                </div>
                <div className="text-base sm:text-lg">
                  {score >= currentLevelData.situations.length * 0.8 ? 'Excelente trabalho!' : 
                   score >= currentLevelData.situations.length * 0.6 ? 'Muito bom! Continue praticando!' : 
                   'Bom trabalho! Pratique mais para melhorar!'}
                </div>
              </div>

              <div className="bg-gray-50 p-4 sm:p-8 rounded-2xl mb-6 sm:mb-8 text-left">
                <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                  📝 Dicas para Aplicar no Dia a Dia
                </h3>
                <ul className="text-gray-600 space-y-2 sm:space-y-3 text-sm sm:text-base">
                  {currentLevel === 1 && (
                    <>
                      <li className="flex items-start gap-2"><span>•</span> Pratique cumprimentos simples no dia a dia</li>
                      <li className="flex items-start gap-2"><span>•</span> Observe situações compartilhadas para iniciar conversas</li>
                      <li className="flex items-start gap-2"><span>•</span> Use elogios sinceros como abridores de conversa</li>
                      <li className="flex items-start gap-2"><span>•</span> Lembre-se: simplicidade é eficaz em conversas básicas</li>
                    </>
                  )}
                  {currentLevel === 2 && (
                    <>
                      <li className="flex items-start gap-2"><span>•</span> Desenvolva a habilidade de fazer perguntas abertas</li>
                      <li className="flex items-start gap-2"><span>•</span> Pratique se juntar a grupos de forma educada</li>
                      <li className="flex items-start gap-2"><span>•</span> Trabalhe na escuta ativa durante conversas</li>
                      <li className="flex items-start gap-2"><span>•</span> Aprenda a identificar momentos apropriados para falar</li>
                    </>
                  )}
                  {currentLevel === 3 && (
                    <>
                      <li className="flex items-start gap-2"><span>•</span> Refine suas habilidades de mediação de conflitos</li>
                      <li className="flex items-start gap-2"><span>•</span> Pratique networking profissional</li>
                      <li className="flex items-start gap-2"><span>•</span> Desenvolva argumentação respeitosa em debates</li>
                      <li className="flex items-start gap-2"><span>•</span> Trabalhe na adaptação a diferentes contextos sociais</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border-l-4 border-purple-500 mb-6 sm:mb-8 text-left">
                <h3 className="text-lg sm:text-xl font-bold text-purple-700 mb-3 flex items-center gap-2">
                  🧠 Você Aprendeu
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  Através desta atividade, você desenvolveu habilidades essenciais de comunicação social 
                  baseadas em evidências científicas. Continue praticando essas estratégias em diferentes 
                  contextos para fortalecer suas competências sociais!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 flex-wrap">
                <button 
                  onClick={() => showScreen('level-selection')}
                  className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-colors min-h-[48px] touch-manipulation"
                >
                  ← Outros Níveis
                </button>
                <button 
                  onClick={restartLevel}
                  className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-colors min-h-[48px] touch-manipulation"
                >
                  🔄 Tentar Novamente
                </button>
                <button 
                  onClick={() => showScreen('explanation')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:from-indigo-700 active:to-purple-800 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all min-h-[48px] touch-manipulation"
                >
                  🏠 Menu Principal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}