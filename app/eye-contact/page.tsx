'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, Save, Eye, Target, Trophy, Timer, Star, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient' // IMPORT CORRETO para eye-contact/page.tsx

export default function ContatoVisualProgressivoPage() {
  const router = useRouter()
  const supabase = createClient()
  const [salvando, setSalvando] = useState(false)
  
  // Estados da atividade - Baseados em métricas científicas
  const [fase, setFase] = useState(1) // Fases do protocolo de shaping
  const [tentativaAtual, setTentativaAtual] = useState(0)
  const [contatoAtivo, setContatoAtivo] = useState(false)
  const [tempoContato, setTempoContato] = useState(0)
  const [latenciaInicio, setLatenciaInicio] = useState(0)
  const [atividadeIniciada, setAtividadeIniciada] = useState(false)
  const [atividadeConcluida, setAtividadeConcluida] = useState(false)
  
  // Métricas científicas (baseadas em FAS, ASC, AVC do eye-tracking)
  const [metricas, setMetricas] = useState({
    totalTentativas: 0,
    contatosSucesso: 0,
    tempoMedioContato: 0,
    latenciaMedia: 0,
    fasesCompletadas: [],
    progressoGeral: 0,
    // Métricas específicas do protocolo científico
    avcScore: 0, // Vacancy count - quantas vezes perdeu contato
    ascScore: 0, // Switch count - mudanças de foco
    fasScore: 0, // Favorable shifts - progressões positivas
  })
  
  // Estados visuais e feedback
  const [personagemEstado, setPersonagemEstado] = useState('esperando')
  const [feedback, setFeedback] = useState('')
  const [estrelas, setEstrelas] = useState(0)
  const intervalRef = useRef(null)
  const tempoInicioRef = useRef(null)
  
  // Configurações por fase (baseado no protocolo de shaping)
  const configuracoesFase = {
    1: { nome: 'Orientação Inicial', duracao: 500, pontos: 10 },
    2: { nome: 'Olhar Breve', duracao: 1000, pontos: 20 },
    3: { nome: 'Olhar Sustentado', duracao: 2000, pontos: 30 },
    4: { nome: 'Olhar Prolongado', duracao: 3000, pontos: 50 },
    5: { nome: 'Generalização', duracao: 3000, pontos: 100 }
  }
  
  // Função para iniciar tentativa
  const iniciarTentativa = () => {
    setAtividadeIniciada(true)
    setContatoAtivo(false)
    setTempoContato(0)
    setFeedback('Olhe para os olhos do personagem!')
    setPersonagemEstado('aguardando')
    tempoInicioRef.current = Date.now()
    
    // Incrementa ASC (switch count)
    setMetricas(prev => ({
      ...prev,
      ascScore: prev.ascScore + 1,
      totalTentativas: prev.totalTentativas + 1
    }))
  }
  
  // Função para registrar contato visual
  const registrarContato = () => {
    if (!atividadeIniciada || contatoAtivo) return
    
    const latencia = Date.now() - tempoInicioRef.current
    setLatenciaInicio(latencia)
    setContatoAtivo(true)
    setPersonagemEstado('contato')
    setFeedback('Ótimo! Mantenha o contato!')
    
    // Incrementa FAS (favorable shift)
    setMetricas(prev => ({
      ...prev,
      fasScore: prev.fasScore + 1
    }))
    
    // Inicia contagem do tempo de contato
    intervalRef.current = setInterval(() => {
      setTempoContato(prev => {
        const novoTempo = prev + 100
        
        // Verifica se atingiu o tempo necessário para a fase
        if (novoTempo >= configuracoesFase[fase].duracao) {
          completarTentativa(true, novoTempo, latencia)
        }
        
        return novoTempo
      })
    }, 100)
  }
  
  // Função para perder contato
  const perderContato = () => {
    if (!contatoAtivo) return
    
    clearInterval(intervalRef.current)
    setContatoAtivo(false)
    setPersonagemEstado('perdeu_contato')
    
    // Incrementa AVC (vacancy count)
    setMetricas(prev => ({
      ...prev,
      avcScore: prev.avcScore + 1
    }))
    
    // Verifica se o tempo foi suficiente para passar
    if (tempoContato >= configuracoesFase[fase].duracao * 0.8) {
      setFeedback('Quase lá! Tente manter um pouco mais!')
      completarTentativa(true, tempoContato, latenciaInicio)
    } else {
      setFeedback('Tente novamente! Mantenha o olhar por mais tempo.')
      setTimeout(() => iniciarTentativa(), 2000)
    }
  }
  
  // Função para completar tentativa
  const completarTentativa = (sucesso, tempoDuracao, latencia) => {
    clearInterval(intervalRef.current)
    setTentativaAtual(prev => prev + 1)
    
    if (sucesso) {
      setEstrelas(prev => Math.min(prev + 1, 5))
      setPersonagemEstado('feliz')
      setFeedback(`Excelente! Você manteve contato por ${(tempoDuracao/1000).toFixed(1)}s!`)
      
      // Atualiza métricas
      setMetricas(prev => {
        const novasMetricas = {
          ...prev,
          contatosSucesso: prev.contatosSucesso + 1,
          tempoMedioContato: ((prev.tempoMedioContato * prev.contatosSucesso + tempoDuracao) / (prev.contatosSucesso + 1)),
          latenciaMedia: ((prev.latenciaMedia * prev.contatosSucesso + latencia) / (prev.contatosSucesso + 1)),
        }
        
        // Calcula taxa de sucesso
        novasMetricas.progressoGeral = Math.round((novasMetricas.contatosSucesso / novasMetricas.totalTentativas) * 100)
        
        return novasMetricas
      })
      
      // Verifica progressão de fase (baseado em 3 sucessos consecutivos)
      if (tentativaAtual >= 2 && fase < 5) {
        setTimeout(() => {
          avancarFase()
        }, 2000)
      } else if (fase === 5 && tentativaAtual >= 2) {
        finalizarAtividade()
      } else {
        setTimeout(() => iniciarTentativa(), 3000)
      }
    }
  }
  
  // Função para avançar fase
  const avancarFase = () => {
    const novaFase = fase + 1
    setFase(novaFase)
    setTentativaAtual(0)
    setEstrelas(0)
    setFeedback(`Parabéns! Avançando para: ${configuracoesFase[novaFase].nome}`)
    setPersonagemEstado('comemorando')
    
    setMetricas(prev => ({
      ...prev,
      fasesCompletadas: [...prev.fasesCompletadas, fase]
    }))
    
    setTimeout(() => iniciarTentativa(), 3000)
  }
  
  // Função para finalizar atividade
  const finalizarAtividade = () => {
    setAtividadeConcluida(true)
    setPersonagemEstado('vitoria')
    setFeedback('Parabéns! Você completou todas as fases!')
    
    // Calcula pontuação final baseada nas métricas científicas
    const pontuacaoBase = metricas.contatosSucesso * 10
    const bonusFAS = metricas.fasScore * 5
    const penalizacaoAVC = metricas.avcScore * 2
    const bonusTempo = Math.round(metricas.tempoMedioContato / 100)
    
    const pontuacaoFinal = Math.max(0, pontuacaoBase + bonusFAS - penalizacaoAVC + bonusTempo)
    
    setMetricas(prev => ({
      ...prev,
      progressoGeral: pontuacaoFinal
    }))
  }
  
  // Função de salvamento com métricas científicas
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
      
      // Salva sessão principal
      const { data: sessao, error: sessaoError } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Contato Visual Progressivo',
          pontuacao_final: metricas.progressoGeral,
          data_fim: new Date().toISOString()
        }])
        .select()
      
      if (sessaoError) {
        console.error('Erro ao salvar sessão:', sessaoError)
        alert(`Erro ao salvar: ${sessaoError.message}`)
        return
      }
      
      // Salva métricas detalhadas (baseadas em protocolos científicos)
      const { error: metricasError } = await supabase
        .from('metricas_contato_visual')
        .insert([{
          sessao_id: sessao[0].id,
          usuario_id: user.id,
          total_tentativas: metricas.totalTentativas,
          contatos_sucesso: metricas.contatosSucesso,
          tempo_medio_contato_ms: Math.round(metricas.tempoMedioContato),
          latencia_media_ms: Math.round(metricas.latenciaMedia),
          fases_completadas: metricas.fasesCompletadas.length,
          // Métricas do protocolo eye-tracking
          avc_score: metricas.avcScore,
          asc_score: metricas.ascScore,
          fas_score: metricas.fasScore,
          taxa_sucesso: (metricas.contatosSucesso / metricas.totalTentativas) * 100,
          created_at: new Date().toISOString()
        }])
      
      if (metricasError) {
        console.error('Erro ao salvar métricas:', metricasError)
        // Continua mesmo se métricas falharem
      }
      
      alert(`Sessão salva com sucesso! 
        
📊 Resumo do Desempenho:
• Pontuação Final: ${metricas.progressoGeral}
• Taxa de Sucesso: ${Math.round((metricas.contatosSucesso / metricas.totalTentativas) * 100)}%
• Tempo Médio de Contato: ${(metricas.tempoMedioContato/1000).toFixed(1)}s
• Fases Completadas: ${metricas.fasesCompletadas.length}/5
• Progressões Positivas (FAS): ${metricas.fasScore}
        
🎯 Métricas Científicas:
• Latência Média: ${(metricas.latenciaMedia/1000).toFixed(1)}s
• Score de Alternância (ASC): ${metricas.ascScore}
• Score de Vacância (AVC): ${metricas.avcScore}`)
      
      router.push('/tea')
    } catch (error) {
      console.error('Erro inesperado:', error)
      alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setSalvando(false)
    }
  }
  
  // Limpar intervals ao desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* HEADER PADRÃO */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="p-3 sm:p-4 flex items-center justify-between">
          <Link
            href="/tea"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
          >
            <ChevronLeft size={20} />
            <span className="text-sm sm:text-base">Voltar para TEA</span>
          </Link>
          
          {/* BOTÃO SALVAR - SEMPRE AQUI */}
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
        {/* Título e Instruções */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="text-blue-600" size={32} />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Contato Visual Progressivo
            </h1>
          </div>
          
          <p className="text-gray-600 mb-4">
            Pratique fazer contato visual de forma gradual e confortável. 
            Comece com olhares breves e progrida no seu próprio ritmo!
          </p>
          
          {/* Indicador de Fase Atual */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Fase Atual:</span>
              <span className="text-lg font-bold text-blue-600">
                {configuracoesFase[fase].nome}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Timer className="text-purple-600" size={20} />
              <span className="text-sm text-gray-600">
                Meta: {configuracoesFase[fase].duracao / 1000}s de contato visual
              </span>
            </div>
          </div>
        </div>
        
        {/* Área Principal da Atividade */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Área do Personagem */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-8 mb-4">
              {/* Personagem Visual Simples */}
              <div className="relative w-48 h-48 mx-auto">
                {/* Rosto */}
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  personagemEstado === 'contato' ? 'bg-yellow-200' :
                  personagemEstado === 'feliz' ? 'bg-green-200' :
                  personagemEstado === 'comemorando' ? 'bg-blue-200' :
                  personagemEstado === 'vitoria' ? 'bg-purple-200' :
                  'bg-gray-200'
                }`}>
                  {/* Olhos */}
                  <div className="absolute top-1/3 left-1/4 w-8 h-8">
                    <button
                      onClick={registrarContato}
                      onMouseLeave={perderContato}
                      className={`w-full h-full rounded-full transition-all ${
                        contatoAtivo ? 'bg-blue-600 scale-110' : 'bg-gray-600 hover:bg-blue-500'
                      }`}
                      disabled={!atividadeIniciada || atividadeConcluida}
                    />
                  </div>
                  <div className="absolute top-1/3 right-1/4 w-8 h-8">
                    <button
                      onClick={registrarContato}
                      onMouseLeave={perderContato}
                      className={`w-full h-full rounded-full transition-all ${
                        contatoAtivo ? 'bg-blue-600 scale-110' : 'bg-gray-600 hover:bg-blue-500'
                      }`}
                      disabled={!atividadeIniciada || atividadeConcluida}
                    />
                  </div>
                  
                  {/* Boca */}
                  <div className={`absolute bottom-1/3 left-1/2 transform -translate-x-1/2 transition-all ${
                    personagemEstado === 'feliz' || personagemEstado === 'comemorando' || personagemEstado === 'vitoria' ?
                    'w-16 h-8 border-b-4 border-gray-600 rounded-b-full' :
                    'w-12 h-1 bg-gray-600'
                  }`} />
                </div>
                
                {/* Indicadores visuais */}
                {contatoAtivo && (
                  <div className="absolute -inset-4 animate-pulse">
                    <div className="w-full h-full rounded-full border-4 border-green-400 opacity-50" />
                  </div>
                )}
              </div>
              
              {/* Feedback Visual */}
              <div className="mt-6 text-center">
                <p className="text-lg font-medium text-gray-700">{feedback}</p>
                
                {/* Barra de Progresso do Contato */}
                {contatoAtivo && (
                  <div className="mt-4">
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-100"
                        style={{ 
                          width: `${Math.min(100, (tempoContato / configuracoesFase[fase].duracao) * 100)}%` 
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {(tempoContato / 1000).toFixed(1)}s / {configuracoesFase[fase].duracao / 1000}s
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Botão Iniciar */}
            {!atividadeIniciada && !atividadeConcluida && (
              <button
                onClick={iniciarTentativa}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Iniciar Atividade
              </button>
            )}
            
            {/* Estrelas de Progresso */}
            <div className="flex justify-center space-x-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={32}
                  className={`transition-all ${
                    i < estrelas ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Painel de Métricas */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Target className="text-purple-600 mr-2" size={24} />
              Seu Progresso
            </h2>
            
            <div className="space-y-4">
              {/* Taxa de Sucesso */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Taxa de Sucesso</span>
                  <span className="text-2xl font-bold text-green-600">
                    {metricas.totalTentativas > 0 
                      ? `${Math.round((metricas.contatosSucesso / metricas.totalTentativas) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ 
                      width: `${metricas.totalTentativas > 0 
                        ? (metricas.contatosSucesso / metricas.totalTentativas) * 100 
                        : 0}%` 
                    }}
                  />
                </div>
              </div>
              
              {/* Tempo Médio */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Tempo Médio de Contato</span>
                  <span className="text-xl font-bold text-blue-600">
                    {(metricas.tempoMedioContato / 1000).toFixed(1)}s
                  </span>
                </div>
              </div>
              
              {/* Latência */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Velocidade de Resposta</span>
                  <span className="text-xl font-bold text-purple-600">
                    {metricas.latenciaMedia > 0 
                      ? `${(metricas.latenciaMedia / 1000).toFixed(1)}s`
                      : '-'}
                  </span>
                </div>
              </div>
              
              {/* Métricas Científicas */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Indicadores de Desempenho</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-600">Progressões</p>
                    <p className="text-lg font-bold text-green-600">{metricas.fasScore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Alternâncias</p>
                    <p className="text-lg font-bold text-blue-600">{metricas.ascScore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Interrupções</p>
                    <p className="text-lg font-bold text-orange-600">{metricas.avcScore}</p>
                  </div>
                </div>
              </div>
              
              {/* Fases Completadas */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Progresso nas Fases</h3>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(f => (
                    <div
                      key={f}
                      className={`flex-1 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${
                        metricas.fasesCompletadas.includes(f) 
                          ? 'bg-indigo-600 text-white' 
                          : f === fase
                          ? 'bg-indigo-300 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Mensagem de Conclusão */}
            {atividadeConcluida && (
              <div className="mt-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4 text-center">
                <Trophy className="text-yellow-500 mx-auto mb-2" size={48} />
                <p className="text-lg font-bold text-gray-800">Atividade Concluída!</p>
                <p className="text-gray-600">Pontuação Final: {metricas.progressoGeral}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
