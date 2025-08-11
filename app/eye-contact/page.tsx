'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, Save, Eye, Target, Timer, Star, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient' // IMPORT CORRETO para eye-contact/page.tsx

export default function ContatoVisualProgressivoPage() {
  /*
   * Atividade de Contato Visual Progressivo - TeaPlus
   * 
   * Métricas baseadas em literatura científica:
   * 1. Tempo de Reação - Gap-Overlap paradigm (Molecular Autism, 2021)
   * 2. Taxa de Acerto - TVPS (Test of Visual Perceptual Skills)
   * 3. Variabilidade de Resposta - RDI (Response Dispersion Index)
   * 4. Atenção Visual Direcionada - Go/NoGo com eye-tracking (Scientific Reports, 2021)
   * 
   * Referências:
   * - Frontiers in Psychology (2021) - Visual Perceptual Skills in ASD
   * - Molecular Autism (2020-2021) - Visual attention and inhibitory control
   * - Scientific Reports (2021) - Go/NoGo game CatChicken
   */
  
  const router = useRouter()
  const supabase = createClient()
  const [salvando, setSalvando] = useState(false)
  
  // Estados da atividade
  const [nivel, setNivel] = useState(1)
  const [pontuacao, setPontuacao] = useState(0)
  const [atividadeIniciada, setAtividadeIniciada] = useState(false)
  const [atividadeConcluida, setAtividadeConcluida] = useState(false)
  const [aguardandoClique, setAguardandoClique] = useState(false)
  const [tempoReacao, setTempoReacao] = useState([])
  const [acertos, setAcertos] = useState(0)
  const [erros, setErros] = useState(0)
  const [olhosVisiveis, setOlhosVisiveis] = useState(true)
  const [posicaoOlhos, setPosicaoOlhos] = useState({ x: 50, y: 30 })
  
  // Referências para tempo
  const tempoInicioRef = useRef(null)
  const timeoutRef = useRef(null)
  const intervaloRef = useRef(null)
  
  // Configurações por nível
  const configuracaoNivel = {
    1: { 
      nome: 'Básico', 
      tamanhoOlhos: 'w-10 h-10', 
      pontosPorAcerto: 10,
      tempoExibicao: 3000,
      tempoOculto: 1000,
      metaPontos: 50
    },
    2: { 
      nome: 'Intermediário', 
      tamanhoOlhos: 'w-7 h-7', 
      pontosPorAcerto: 15,
      tempoExibicao: 2000,
      tempoOculto: 1500,
      metaPontos: 75
    },
    3: { 
      nome: 'Avançado', 
      tamanhoOlhos: 'w-5 h-5', 
      pontosPorAcerto: 20,
      tempoExibicao: 1500,
      tempoOculto: 2000,
      metaPontos: 100
    }
  }
  
  // Função para iniciar atividade
  const iniciarAtividade = () => {
    setAtividadeIniciada(true)
    setAtividadeConcluida(false)
    setPontuacao(0)
    setNivel(1)
    setAcertos(0)
    setErros(0)
    setTempoReacao([])
    iniciarRodada()
  }
  
  // Função para iniciar uma rodada
  const iniciarRodada = () => {
    setOlhosVisiveis(false)
    setAguardandoClique(false)
    
    // Aguarda um tempo antes de mostrar os olhos
    timeoutRef.current = setTimeout(() => {
      // Define posição aleatória para os olhos com mais variação
      // Posições pré-definidas para simular diferentes direções do olhar
      const posicoes = [
        { x: 50, y: 20 }, // Olhando para cima
        { x: 50, y: 45 }, // Olhando para baixo
        { x: 25, y: 33 }, // Olhando para esquerda
        { x: 75, y: 33 }, // Olhando para direita
        { x: 30, y: 25 }, // Canto superior esquerdo
        { x: 70, y: 25 }, // Canto superior direito
        { x: 30, y: 40 }, // Canto inferior esquerdo
        { x: 70, y: 40 }, // Canto inferior direito
        { x: 50, y: 33 }, // Centro (contato direto)
      ]
      
      // Escolhe uma posição aleatória
      const posicaoEscolhida = posicoes[Math.floor(Math.random() * posicoes.length)]
      setPosicaoOlhos(posicaoEscolhida)
      
      setOlhosVisiveis(true)
      setAguardandoClique(true)
      tempoInicioRef.current = Date.now()
      
      // Esconde os olhos após o tempo de exibição
      timeoutRef.current = setTimeout(() => {
        if (aguardandoClique) {
          // Não clicou a tempo
          registrarErro()
        }
      }, configuracaoNivel[nivel].tempoExibicao)
    }, configuracaoNivel[nivel].tempoOculto)
  }
  
  // Função para registrar clique nos olhos
  const clicarNosOlhos = () => {
    if (!aguardandoClique || !olhosVisiveis) return
    
    // Calcula tempo de reação
    const tempo = Date.now() - tempoInicioRef.current
    setTempoReacao(prev => [...prev, tempo])
    
    // Registra acerto
    setAcertos(prev => prev + 1)
    const novosPontos = pontuacao + configuracaoNivel[nivel].pontosPorAcerto
    setPontuacao(novosPontos)
    
    // Feedback visual
    setOlhosVisiveis(false)
    setAguardandoClique(false)
    
    // Limpa timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Verifica progressão
    if (novosPontos >= configuracaoNivel[nivel].metaPontos) {
      if (nivel < 3) {
        // Avança de nível
        setNivel(prev => prev + 1)
        setPontuacao(0)
        setTimeout(() => iniciarRodada(), 1500)
      } else {
        // Completou todos os níveis
        finalizarAtividade()
      }
    } else {
      // Continua no mesmo nível
      setTimeout(() => iniciarRodada(), 500)
    }
  }
  
  // Função para registrar erro (não clicou a tempo)
  const registrarErro = () => {
    setErros(prev => prev + 1)
    setOlhosVisiveis(false)
    setAguardandoClique(false)
    
    // Continua o jogo
    setTimeout(() => iniciarRodada(), 500)
  }
  
  // Função para finalizar atividade
  const finalizarAtividade = () => {
    setAtividadeConcluida(true)
    setOlhosVisiveis(false)
    setAguardandoClique(false)
    
    // Limpa timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }
  
  // Calcular métricas
  const calcularTempoMedioReacao = () => {
    if (tempoReacao.length === 0) return 0
    const soma = tempoReacao.reduce((a, b) => a + b, 0)
    return Math.round(soma / tempoReacao.length)
  }
  
  const calcularTaxaAcerto = () => {
    const total = acertos + erros
    if (total === 0) return 0
    return Math.round((acertos / total) * 100)
  }
  
  // Função de salvamento
  const handleSaveSession = async () => {
    if (!atividadeConcluida) {
      alert('Complete a atividade antes de salvar.')
      return
    }
    
    setSalvando(true)
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        alert('Erro: Sessão expirada. Por favor, faça login novamente.')
        router.push('/login')
        return
      }
      
      // Calcula pontuação final
      const pontuacaoFinal = (acertos * 10) + (nivel * 50) - (erros * 5)
      
      // Salva sessão principal
      const { data: sessao, error: sessaoError } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Contato Visual Progressivo',
          pontuacao_final: Math.max(0, pontuacaoFinal),
          data_fim: new Date().toISOString()
        }])
        .select()
      
      if (sessaoError) {
        console.error('Erro ao salvar sessão:', sessaoError)
        alert(`Erro ao salvar: ${sessaoError.message}`)
        return
      }
      
      // Salva métricas detalhadas
      const { error: metricasError } = await supabase
        .from('metricas_contato_visual')
        .insert([{
          sessao_id: sessao[0].id,
          usuario_id: user.id,
          total_tentativas: acertos + erros,
          contatos_sucesso: acertos,
          tempo_medio_contato_ms: calcularTempoMedioReacao(),
          latencia_media_ms: calcularTempoMedioReacao(), // Usando tempo de reação como latência
          fases_completadas: nivel,
          avc_score: erros, // Erros como "vacancy" (perdeu o alvo)
          asc_score: acertos + erros, // Total de tentativas como "switches"
          fas_score: acertos, // Acertos como "favorable shifts"
          taxa_sucesso: calcularTaxaAcerto(),
          created_at: new Date().toISOString()
        }])
      
      if (metricasError) {
        console.error('Erro ao salvar métricas:', metricasError)
        // Continua mesmo se métricas falharem
      }
      
      alert(`Sessão salva com sucesso! 
        
📊 Resumo do Desempenho:
• Níveis Completados: ${nivel}/3
• Total de Acertos: ${acertos}
• Taxa de Acerto: ${calcularTaxaAcerto()}%
• Tempo Médio de Reação: ${calcularTempoMedioReacao()}ms
• Pontuação Final: ${Math.max(0, pontuacaoFinal)}`)
      
      router.push('/tea')
    } catch (error) {
      console.error('Erro inesperado:', error)
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setSalvando(false)
    }
  }
  
  // Limpar timeouts ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current)
      }
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* HEADER PADRÃO COM BOTÃO SALVAR */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <Link
            href="/tea"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
          >
            <ChevronLeft size={20} />
            <span className="text-sm sm:text-base">Voltar para TEA</span>
          </Link>
          
          {/* BOTÃO SALVAR - SEMPRE NO HEADER */}
          {atividadeConcluida && (
            <button
              onClick={handleSaveSession}
              disabled={salvando}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:bg-green-400"
            >
              <Save size={20} />
              <span>{salvando ? 'Salvando...' : 'Finalizar e Salvar'}</span>
            </button>
          )}
        </div>
      </header>
      
      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {/* Título Principal */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Contato Visual Progressivo
          </h1>
        </div>
        
        {/* Cards de Explicação - Padrão CAA */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Objetivo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="text-red-500" size={24} />
              <h2 className="text-lg font-bold text-gray-800">Objetivo:</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Praticar o direcionamento da atenção visual clicando nos olhos quando aparecerem. 
              Desenvolve foco, velocidade de resposta e coordenação olho-mão.
            </p>
            <p className="text-xs text-gray-500 mt-2 italic">
              Baseado em métricas validadas: TVPS, Gap-Overlap, RDI (Response Dispersion Index)
            </p>
          </div>
          
          {/* Como se Joga */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Eye className="text-blue-500" size={24} />
              <h2 className="text-lg font-bold text-gray-800">Como se Joga:</h2>
            </div>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Observe quando os olhos aparecem</li>
              <li>• Clique rapidamente nos olhos</li>
              <li>• Ganhe pontos por cada acerto</li>
              <li>• Complete a meta para avançar de nível</li>
            </ul>
          </div>
          
          {/* Níveis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Trophy className="text-yellow-500" size={24} />
              <h2 className="text-lg font-bold text-gray-800">Níveis:</h2>
            </div>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Nível 1: Olhos grandes (50 pontos)</li>
              <li>• Nível 2: Olhos médios (75 pontos)</li>
              <li>• Nível 3: Olhos pequenos (100 pontos)</li>
            </ul>
          </div>
        </div>
        
        {/* Progresso da Sessão - Padrão CAA */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            📊 Progresso da Sessão
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{nivel}</div>
              <div className="text-sm text-gray-600">Nível Atual</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{acertos}</div>
              <div className="text-sm text-gray-600">Acertos</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {calcularTaxaAcerto()}%
              </div>
              <div className="text-sm text-gray-600">Taxa de Acerto</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {calcularTempoMedioReacao()}ms
              </div>
              <div className="text-sm text-gray-600">Tempo Médio</div>
            </div>
          </div>
          
          {/* Barra de Progresso do Nível */}
          {atividadeIniciada && !atividadeConcluida && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progresso do Nível {nivel}</span>
                <span>{pontuacao}/{configuracaoNivel[nivel].metaPontos} pontos</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, (pontuacao / configuracaoNivel[nivel].metaPontos) * 100)}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Área Principal do Jogo */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="relative min-h-[400px] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center">
            
            {!atividadeIniciada && !atividadeConcluida && (
              <div className="text-center">
                <div className="mb-6">
                  <Eye className="text-blue-600 mx-auto" size={64} />
                </div>
                <button
                  onClick={iniciarAtividade}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 text-lg"
                >
                  Iniciar Atividade
                </button>
              </div>
            )}
            
            {atividadeIniciada && !atividadeConcluida && (
              <div className="relative w-full h-full">
                {/* Rosto Base */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48 bg-yellow-200 rounded-full">
                    {/* Olhos que aparecem e desaparecem */}
                    {olhosVisiveis && (
                      <div 
                        className="absolute flex space-x-4"
                        style={{
                          left: `${posicaoOlhos.x}%`,
                          top: `${posicaoOlhos.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <button
                          onClick={clicarNosOlhos}
                          className={`${configuracaoNivel[nivel].tamanhoOlhos} bg-blue-600 rounded-full hover:bg-blue-700 transition-all cursor-pointer animate-pulse`}
                        />
                        <button
                          onClick={clicarNosOlhos}
                          className={`${configuracaoNivel[nivel].tamanhoOlhos} bg-blue-600 rounded-full hover:bg-blue-700 transition-all cursor-pointer animate-pulse`}
                        />
                      </div>
                    )}
                    
                    {/* Boca fixa */}
                    <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-600 rounded-full" />
                  </div>
                </div>
                
                {/* Indicador de Estado */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`px-4 py-2 rounded-full text-white font-medium ${
                    aguardandoClique ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {aguardandoClique ? 'Clique nos olhos!' : 'Aguarde...'}
                  </div>
                </div>
                
                {/* Indicador de direção do olhar */}
                {olhosVisiveis && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                      {posicaoOlhos.y < 30 ? '👀 Olhando para cima' :
                       posicaoOlhos.y > 35 ? '👀 Olhando para baixo' :
                       posicaoOlhos.x < 40 ? '👀 Olhando para esquerda' :
                       posicaoOlhos.x > 60 ? '👀 Olhando para direita' :
                       '👀 Contato direto'}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {atividadeConcluida && (
              <div className="text-center">
                <Trophy className="text-yellow-500 mx-auto mb-4" size={64} />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Atividade Concluída!
                </h2>
                <p className="text-gray-600 mb-4">
                  Você completou todos os níveis com sucesso!
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-lg">
                    Total de Acertos: <span className="font-bold text-green-600">{acertos}</span>
                  </p>
                  <p className="text-lg">
                    Taxa de Sucesso: <span className="font-bold text-blue-600">{calcularTaxaAcerto()}%</span>
                  </p>
                </div>
                <button
                  onClick={iniciarAtividade}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Jogar Novamente
                </button>
              </div>
            )}
            
          </div>
        </div>
        
        {/* Dica no rodapé */}
        {atividadeIniciada && !atividadeConcluida && (
          <div className="mt-4 text-center text-sm text-gray-500">
            💡 Dica: Mantenha o foco na área do rosto e clique rapidamente quando os olhos aparecerem!
          </div>
        )}
      </main>
    </div>
  )
}
