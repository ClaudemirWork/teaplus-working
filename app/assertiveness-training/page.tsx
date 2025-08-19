'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

// --- Tipagem e Dados dos Cenários ---
interface Scenario {
  id: number
  title: string
  context: string
  situation: string
  responses: {
    passive: string
    aggressive: string
    assertive: string
  }
  feedback: {
    passive: string
    aggressive: string
    assertive: string
  }
  tips: string[]
  category: 'dizer-nao' | 'expressar-opiniao' | 'pedir-ajuda' | 'estabelecer-limites' | 'receber-criticas'
  difficulty: 'iniciante' | 'intermediario' | 'avancado'
}

const scenarios: Scenario[] = [
  // --- NÍVEL INICIANTE (5 CENÁRIOS) ---
  {
    id: 1,
    title: "Dizendo não a um favor",
    context: "Você está ocupado com suas tarefas",
    situation: "Um colega pede para você terminar uma parte do trabalho dele. Você já tem muito o que fazer.",
    responses: {
      passive: "Tudo bem, eu faço. Não tem problema.",
      aggressive: "Você sempre empurra seu trabalho para os outros! Faça você mesmo!",
      assertive: "Eu gostaria de ajudar, mas estou focado em terminar minhas tarefas agora. Quem sabe em outra oportunidade?"
    },
    feedback: {
      passive: "Ao aceitar, você ignora suas próprias necessidades, o que pode levar ao esgotamento.",
      aggressive: "A agressividade pode danificar o relacionamento profissional e criar um ambiente hostil.",
      assertive: "Você foi claro, educado e estabeleceu seu limite sem atacar a outra pessoa. Perfeito!"
    },
    tips: ["Seja direto e honesto, mas sempre educado.", "Use a palavra 'não' de forma clara.", "Ofereça uma alternativa se for possível e se você quiser."],
    category: 'dizer-nao',
    difficulty: 'iniciante'
  },
  {
    id: 2,
    title: "Escolhendo o filme",
    context: "Em grupo, decidindo o que assistir",
    situation: "Seu grupo de amigos quer assistir a um filme de terror, mas você não gosta desse gênero e prefere comédia.",
    responses: {
      passive: "Ah, tudo bem. Pode ser terror mesmo.",
      aggressive: "Terror de novo? Vocês só escolhem filme ruim!",
      assertive: "Pessoal, eu realmente não curto filmes de terror. Que tal assistirmos a uma comédia hoje e deixamos o terror para a próxima?"
    },
    feedback: {
      passive: "Você não participará de uma atividade que te agrada por não expressar sua opinião.",
      aggressive: "Criticar o gosto dos amigos pode gerar um conflito desnecessário e magoá-los.",
      assertive: "Você expressou sua preferência de forma calma e propôs uma negociação justa. Ótimo!"
    },
    tips: ["Use frases como 'Eu prefiro...' ou 'Eu gostaria de sugerir...'.", "Reconheça a vontade do grupo antes de dar sua sugestão.", "Tente encontrar um meio-termo que agrade a todos."],
    category: 'expressar-opiniao',
    difficulty: 'iniciante'
  },
  {
    id: 3,
    title: "Dizendo não a um convite",
    context: "Amigos te convidam para sair, mas você quer descansar",
    situation: "Seus amigos te chamaram para uma festa no sábado, mas você está exausto da semana e só quer relaxar em casa.",
    responses: {
      passive: "Ah, tá bom... eu vou. Só fico um pouquinho.",
      aggressive: "Vocês não entendem que eu preciso descansar? Parem de me chamar!",
      assertive: "Agradeço muito o convite, pessoal! Mas estou precisando muito descansar neste fim de semana. Podemos marcar algo na próxima semana?"
    },
    feedback: {
      passive: "Você vai fazer algo que não quer, o que pode gerar cansaço e até ressentimento.",
      aggressive: "Sua resposta pode magoar seus amigos e fazer com que eles não te convidem mais.",
      assertive: "Você foi honesto sobre suas necessidades, agradeceu e propôs uma alternativa, mantendo a amizade. Perfeito!"
    },
    tips: ["Agradeça sempre o convite.", "Seja honesto sobre seus sentimentos e necessidades.", "Proponha uma alternativa para mostrar que você ainda quer estar com eles."],
    category: 'dizer-nao',
    difficulty: 'iniciante'
  },
  {
    id: 4,
    title: "Pedindo para baixar o volume",
    context: "Vizinho com som muito alto",
    situation: "Seu vizinho está ouvindo música em um volume muito alto e está te atrapalhando a estudar para uma prova importante.",
    responses: {
      passive: "Não dizer nada e tentar estudar com o barulho.",
      aggressive: "Bater na porta e gritar: 'Dá pra abaixar essa música insuportável?!'",
      assertive: "Bater na porta e dizer educadamente: 'Olá! Desculpe incomodar, sei que está se divertindo, mas será que você poderia baixar um pouco o volume? Preciso me concentrar nos estudos.'"
    },
    feedback: {
      passive: "Você não resolveu o problema e provavelmente não conseguiu estudar direito.",
      aggressive: "A agressividade pode iniciar uma briga com o vizinho e piorar a situação.",
      assertive: "Você foi educado, explicou sua necessidade e fez um pedido claro, o que aumenta a chance de cooperação."
    },
    tips: ["Comece de forma amigável.", "Explique o porquê do seu pedido.", "Faça um pedido claro e específico."],
    category: 'pedir-ajuda',
    difficulty: 'iniciante'
  },
  {
    id: 5,
    title: "Comida errada no restaurante",
    context: "O garçom trouxe seu pedido errado",
    situation: "Você pediu um prato sem pimenta, mas o prato que chegou está claramente apimentado e você não consegue comer.",
    responses: {
      passive: "Comer o prato mesmo assim, sem reclamar, e passar mal depois.",
      aggressive: "Chamar o garçom e dizer: 'Eu pedi sem pimenta! Vocês não prestam atenção?! Leva isso daqui!'",
      assertive: "Chamar o garçom calmamente e dizer: 'Com licença, acho que houve um engano. Eu pedi este prato sem pimenta, mas este está apimentado. Seria possível trocar, por favor?'"
    },
    feedback: {
      passive: "Você pagou por algo que não pediu e teve uma experiência ruim por não comunicar o erro.",
      aggressive: "Tratar o garçom com agressividade é injusto e cria uma situação desconfortável para todos.",
      assertive: "Você apontou o erro de forma educada e fez um pedido claro de correção, resolvendo o problema de forma eficaz."
    },
    tips: ["Mantenha a calma.", "Aponte o problema de forma objetiva.", "Faça um pedido claro de como gostaria que o problema fosse resolvido."],
    category: 'estabelecer-limites',
    difficulty: 'iniciante'
  },

  // --- NÍVEL INTERMEDIÁRIO (5 CENÁRIOS) ---
  {
    id: 6,
    title: "Discordando em reunião de família",
    context: "Discussão sobre planos para as férias",
    situation: "Sua família está decidindo o destino das férias. Todos querem praia, mas você prefere montanha. Sua opinião está sendo ignorada.",
    responses: {
      passive: "Tanto faz, vocês decidem. Praia está bom.",
      aggressive: "Vocês nunca me escutam! Sempre é o que vocês querem!",
      assertive: "Eu entendo que a maioria quer praia, mas gostaria que considerassem a montanha também. Posso explicar por que acho que seria uma boa opção para todos?"
    },
    feedback: {
        passive: "Você desistiu da sua opinião sem nem tentar expressá-la adequadamente.",
        aggressive: "Você atacou a família, criando conflito desnecessário.",
        assertive: "Você expressou sua opinião de forma respeitosa e pediu espaço para ser ouvido. Excelente!"
    },
    tips: ["Valide a opinião dos outros antes de expressar a sua", "Peça permissão para ser ouvido", "Ofereça explicações, não apenas exigências"],
    category: 'expressar-opiniao',
    difficulty: 'intermediario'
  },
  {
    id: 7,
    title: "Pedindo ajuda no trabalho",
    context: "Você está com dificuldade em uma tarefa complexa",
    situation: "Você está lutando com um projeto há dias e não está conseguindo avançar. Precisa de ajuda, mas tem medo de parecer incompetente.",
    responses: {
      passive: "Vou continuar tentando sozinho. Talvez eu consiga descobrir.",
      aggressive: "Esse projeto é impossível! Ninguém conseguiria fazer isso!",
      assertive: "Estou enfrentando alguns desafios neste projeto e gostaria de conversar com alguém para ter uma segunda opinião. Você teria um tempo para me orientar?"
    },
    feedback: {
        passive: "Você pode perder prazos e se estressar desnecessariamente por não pedir ajuda.",
        aggressive: "Você culpou o projeto ao invés de buscar soluções construtivas.",
        assertive: "Você reconheceu suas limitações e pediu ajuda de forma profissional. Ótimo!"
    },
    tips: ["Pedir ajuda demonstra maturidade, não incompetência", "Seja específico sobre que tipo de ajuda você precisa", "Mostre que você já tentou algumas abordagens"],
    category: 'pedir-ajuda',
    difficulty: 'intermediario'
  },
  {
    id: 8,
    title: "Devolvendo um item emprestado",
    context: "Um amigo te emprestou um livro e está pedindo de volta",
    situation: "Você ainda não terminou de ler um livro que seu amigo emprestou, mas ele está pedindo de volta para um trabalho da faculdade.",
    responses: {
        passive: "Claro, pode levar. (E fica sem terminar o livro).",
        aggressive: "Poxa, mas que pressa! Eu ainda não terminei, você vai ter que esperar.",
        assertive: "Eu ainda não terminei, mas entendo que você precisa dele. Posso ficar com ele só até amanhã à noite e te devolvo sem falta?"
    },
    feedback: {
        passive: "Você abriu mão da sua necessidade completamente.",
        aggressive: "Sua resposta foi egoísta e não considerou a necessidade do seu amigo.",
        assertive: "Você negociou um prazo que atende às duas necessidades, sendo honesto e compreensivo."
    },
    tips: ["Seja honesto sobre o seu status.", "Reconheça a necessidade do outro.", "Proponha uma solução que funcione para ambos."],
    category: 'estabelecer-limites',
    difficulty: 'intermediario'
  },
  {
    id: 9,
    title: "Recebendo um elogio",
    context: "Você recebe um elogio em público",
    situation: "Durante uma apresentação, seu chefe elogia seu trabalho na frente de todos. Você se sente um pouco envergonhado.",
    responses: {
        passive: "Não foi nada... qualquer um faria.",
        aggressive: "É, eu sei. Demorou para perceberem.",
        assertive: "Muito obrigado! Fico feliz que tenha gostado do resultado. A equipe toda contribuiu."
    },
    feedback: {
        passive: "Minimizar seus feitos pode passar uma imagem de baixa autoestima.",
        aggressive: "Sua resposta soou arrogante e pode ter criado um clima ruim.",
        assertive: "Você aceitou o elogio com gratidão e ainda aproveitou para reconhecer a equipe. Perfeito!"
    },
    tips: ["Apenas diga 'obrigado'.", "Evite se diminuir.", "Se for o caso, compartilhe o crédito com quem te ajudou."],
    category: 'receber-criticas',
    difficulty: 'intermediario'
  },
  {
    id: 10,
    title: "Interrompendo uma conversa",
    context: "Você precisa fazer uma pergunta urgente",
    situation: "Seu supervisor está em uma conversa com outro colega, mas você precisa de uma informação urgente para não perder um prazo.",
    responses: {
        passive: "Ficar esperando ao lado até a conversa terminar, correndo o risco de perder o prazo.",
        aggressive: "Interromper bruscamente e dizer: 'Preciso daquela informação AGORA!'",
        assertive: "Aproximar-se, esperar uma pequena pausa e dizer: 'Com licença, me desculpem a interrupção, mas preciso de uma informação rápida para não perder um prazo. É um bom momento?'"
    },
    feedback: {
        passive: "Sua passividade poderia ter custado caro para o projeto.",
        aggressive: "Agressividade gera estresse e pode ser vista como falta de profissionalismo.",
        assertive: "Você foi educado, justificou a urgência e ainda perguntou se era um bom momento, demonstrando respeito."
    },
    tips: ["Peça desculpas pela interrupção.", "Justifique a urgência de forma breve.", "Pergunte se é um bom momento para falar."],
    category: 'pedir-ajuda',
    difficulty: 'intermediario'
  },

  // --- NÍVEL AVANÇADO (5 CENÁRIOS) ---
  {
    id: 11,
    title: "Estabelecendo limites com amigo",
    context: "Amigo que sempre chega atrasado",
    situation: "Seu amigo sempre chega 30-45 minutos atrasado nos encontros, fazendo você esperar. Hoje ele chegou 1 hora atrasado novamente.",
    responses: {
        passive: "Não tem problema, eu estava com tempo mesmo.",
        aggressive: "Você é um desrespeitoso! Sempre atrasa e não liga para o meu tempo!",
        assertive: "Eu valorizo nossa amizade, mas preciso falar sobre os atrasos. Quando você chega muito atrasado, eu me sinto desrespeitado. Podemos combinar horários mais realistas ou você pode me avisar se vai se atrasar?"
    },
    feedback: {
        passive: "Você não comunicou seu desconforto, e o comportamento provavelmente continuará.",
        aggressive: "Você atacou o caráter da pessoa, o que pode prejudicar a amizade.",
        assertive: "Você expressou seus sentimentos e propôs soluções. Comunicação perfeita!"
    },
    tips: ["Use 'quando você... eu me sinto...' para expressar o impacto", "Proponha soluções específicas", "Reafirme o valor do relacionamento"],
    category: 'estabelecer-limites',
    difficulty: 'avancado'
  },
  {
    id: 12,
    title: "Recebendo crítica no trabalho",
    context: "Supervisor apontando erro em relatório",
    situation: "Seu supervisor disse que seu último relatório 'estava confuso e mal estruturado'. Você se sentiu atacado, mas sabe que pode haver pontos válidos.",
    responses: {
        passive: "Você está certo, eu sou péssimo com relatórios. Desculpa.",
        aggressive: "Meu relatório estava perfeito! Você que não entendeu!",
        assertive: "Obrigado pelo feedback. Posso entender melhor quais partes específicas ficaram confusas para eu melhorar nos próximos relatórios?"
    },
    feedback: {
        passive: "Você se diminuiu desnecessariamente ao invés de buscar aprender.",
        aggressive: "Você rejeitou totalmente o feedback, perdendo a chance de crescer.",
        assertive: "Você recebeu a crítica construtivamente e buscou informações específicas para melhorar. Excelente atitude!"
    },
    tips: ["Agradeça o feedback, mesmo que doa", "Peça exemplos específicos para entender melhor", "Foque no comportamento, não na sua identidade"],
    category: 'receber-criticas',
    difficulty: 'avancado'
  },
  {
    id: 13,
    title: "Negociando um prazo",
    context: "Você recebeu uma tarefa com um prazo irreal",
    situation: "Seu chefe te passa uma nova tarefa grande e pede para que seja entregue até o fim do dia. Você sabe que é impossível fazer um bom trabalho nesse tempo.",
    responses: {
        passive: "Ok, vou tentar. (E vira a noite trabalhando, entregando com baixa qualidade).",
        aggressive: "Isso é impossível! Você não tem noção do tempo que isso leva?",
        assertive: "Entendi a urgência. Para entregar com a qualidade necessária, eu estimo precisar de pelo menos dois dias. Podemos redefinir o prazo ou priorizar as partes mais importantes para hoje?"
    },
    feedback: {
        passive: "Você se comprometeu com algo irreal, o que pode levar a estresse e um resultado ruim.",
        aggressive: "Sua resposta foi desrespeitosa e fechou a porta para uma negociação.",
        assertive: "Você mostrou profissionalismo, explicou a situação com dados e propôs uma negociação, demonstrando comprometimento com a qualidade."
    },
    tips: ["Apresente uma contraproposta baseada em fatos.", "Mostre que você entende a importância da tarefa.", "Ofereça soluções, não apenas problemas."],
    category: 'dizer-nao',
    difficulty: 'avancado'
  },
  {
    id: 14,
    title: "Confrontando um boato",
    context: "Você ouviu que um colega está espalhando um boato sobre você",
    situation: "Você fica sabendo que um colega de trabalho está dizendo para outras pessoas que você não cumpre seus prazos, o que não é verdade.",
    responses: {
        passive: "Ficar chateado, mas não fazer nada a respeito, esperando que parem.",
        aggressive: "Ir até a pessoa e gritar: 'Quem você pensa que é para falar mentiras sobre mim?!'",
        assertive: "Chamar a pessoa para uma conversa particular e dizer: 'Ouvi dizer que você comentou que eu não cumpro meus prazos. Fiquei chateado com isso, pois me esforço para entregar tudo a tempo. Houve algum problema específico que eu deva saber?'"
    },
    feedback: {
        passive: "O boato pode continuar e prejudicar sua imagem profissional.",
        aggressive: "Agressividade confirma uma imagem negativa e pode escalar o conflito.",
        assertive: "Você abordou o problema de forma direta, privada e não acusatória, abrindo espaço para esclarecimento."
    },
    tips: ["Aborde a pessoa em particular.", "Use fatos e evite acusações diretas.", "Dê à pessoa a chance de se explicar."],
    category: 'estabelecer-limites',
    difficulty: 'avancado'
  },
  {
    id: 15,
    title: "Expressando uma opinião impopular",
    context: "Durante um projeto em grupo, todos concordam com uma ideia que você acha ruim",
    situation: "Sua equipe de projeto está entusiasmada com uma ideia que, na sua opinião, tem falhas sérias e pode comprometer o resultado final.",
    responses: {
        passive: "Ficar quieto e deixar a equipe seguir com a ideia ruim, mesmo sabendo dos riscos.",
        aggressive: "Dizer: 'Essa é a pior ideia que eu já ouvi! É óbvio que não vai dar certo!'",
        assertive: "Dizer: 'Pessoal, entendo o entusiasmo com essa ideia. Eu gosto dos pontos A e B, mas tenho algumas preocupações sobre o ponto C. Podemos discutir um pouco mais para garantir que estamos cobrindo todos os riscos?'"
    },
    feedback: {
        passive: "Sua omissão pode levar o projeto ao fracasso, prejudicando a todos.",
        aggressive: "Você desmotivou a equipe e fechou a porta para uma discussão construtiva.",
        assertive: "Você validou o esforço do grupo, apontou suas preocupações de forma específica e convidou para uma colaboração. Essa é a atitude de um líder."
    },
    tips: ["Comece apontando os pontos positivos da ideia.", "Seja específico sobre suas preocupações.", "Use um tom colaborativo, não de confronto."],
    category: 'expressar-opiniao',
    difficulty: 'avancado'
  }
]

export default function AssertivenessTraining() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [selectedResponse, setSelectedResponse] = useState<'passive' | 'aggressive' | 'assertive' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState({ passive: 0, aggressive: 0, assertive: 0 })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState<'iniciante' | 'intermediario' | 'avancado'>('iniciante')
  
  const filteredScenarios = scenarios.filter(s => s.difficulty === currentDifficulty)

  const handleResponseSelect = (responseType: 'passive' | 'aggressive' | 'assertive') => {
    setSelectedResponse(responseType)
    setShowFeedback(true)
    setScore(prev => ({ ...prev, [responseType]: prev[responseType] + 1 }))
  }

  const nextScenario = () => {
    if (currentScenario < filteredScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
      setSelectedResponse(null)
      setShowFeedback(false)
    } else {
      setGameCompleted(true)
    }
  }

  const resetGame = () => {
    setCurrentScenario(0)
    setSelectedResponse(null)
    setShowFeedback(false)
    setScore({ passive: 0, aggressive: 0, assertive: 0 })
    setGameStarted(false)
    setGameCompleted(false)
  }

  const startGame = (difficulty: 'iniciante' | 'intermediario' | 'avancado') => {
    setCurrentDifficulty(difficulty);
    setCurrentScenario(0);
    setScore({ passive: 0, aggressive: 0, assertive: 0 });
    setGameCompleted(false);
    setShowFeedback(false);
    setSelectedResponse(null);
    setGameStarted(true);
  }

  const getScoreMessage = () => {
    const total = filteredScenarios.length
    if (total === 0) return "Continue praticando!";
    const assertivePercentage = (score.assertive / total) * 100
    
    if (assertivePercentage >= 80) return "🏆 Excelente! Você domina a comunicação assertiva!"
    if (assertivePercentage >= 50) return "👏 Muito bom! Você está no caminho certo!"
    return "💪 Continue praticando! A assertividade se desenvolve com o tempo!"
  }

  const scenario = filteredScenarios[currentScenario]

  const GameHeader = () => (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
                <Link 
                    href="/dashboard" 
                    className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
                </Link>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2">
                    💪 Treino de Assertividade
                </h1>
                <div className="w-24"></div>
            </div>
        </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <GameHeader />
      <main className="max-w-4xl mx-auto p-6">
        {!gameStarted ? (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-center mb-6">Como ser Assertivo?</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-center">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800">😔 Passivo</h4>
                <p className="text-sm text-yellow-700">Evita conflitos, mas não expressa necessidades.</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800">😡 Agressivo</h4>
                <p className="text-sm text-red-700">Expressa necessidades, mas desrespeita outros.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">💪 Assertivo</h4>
                <p className="text-sm text-green-700">Expressa necessidades com respeito.</p>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Escolha um nível para começar</h3>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button onClick={() => startGame('iniciante')} className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-transform transform hover:scale-105">Iniciante</button>
              <button onClick={() => startGame('intermediario')} className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-transform transform hover:scale-105">Intermediário</button>
              <button onClick={() => startGame('avancado')} className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-transform transform hover:scale-105">Avançado</button>
            </div>
          </div>
        ) : gameCompleted ? (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <h2 className="text-2xl font-bold mb-4">Resultado do Nível ({currentDifficulty})</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 p-4 rounded-lg"><div className="text-2xl font-bold text-yellow-700">{score.passive}</div><div className="text-sm">Passivas</div></div>
                <div className="bg-red-50 p-4 rounded-lg"><div className="text-2xl font-bold text-red-700">{score.aggressive}</div><div className="text-sm">Agressivas</div></div>
                <div className="bg-green-50 p-4 rounded-lg"><div className="text-2xl font-bold text-green-700">{score.assertive}</div><div className="text-sm">Assertivas</div></div>
            </div>
            <p className="text-lg mb-6">{getScoreMessage()}</p>
            <button onClick={resetGame} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Escolher Outro Nível
            </button>
          </div>
        ) : (
          <div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: `${((currentScenario + 1) / filteredScenarios.length) * 100}%` }} />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-2">{scenario.title}</h3>
              <p className="text-sm text-gray-600 mb-4"><strong>Contexto:</strong> {scenario.context}</p>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p>{scenario.situation}</p>
              </div>
            </div>
            <div className="space-y-3">
              {(['passive', 'aggressive', 'assertive'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => !showFeedback && handleResponseSelect(type)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${selectedResponse === type ? 'bg-blue-50 border-blue-500' : 'hover:border-gray-300'}`}
                >
                    <p>"{scenario.responses[type]}"</p>
                </button>
              ))}
            </div>
            {showFeedback && selectedResponse && (
                <div className={`mt-6 p-6 rounded-lg border-l-4 ${selectedResponse === 'assertive' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                    <h3 className="font-semibold mb-2">{selectedResponse === 'assertive' ? '🎉 Excelente escolha!' : '🤔 Vamos refletir'}</h3>
                    <p>{scenario.feedback[selectedResponse]}</p>
                    <button onClick={nextScenario} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        {currentScenario < filteredScenarios.length - 1 ? 'Próxima Situação →' : 'Ver Resultado'}
                    </button>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
