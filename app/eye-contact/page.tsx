'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, Save, Eye, Target, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '../utils/supabaseClient'

export default function ContatoVisualProgressivoPage() {
  const router = useRouter()
  const supabase = createClient()
  const [salvando, setSalvando] = useState(false)
  
  // Estados da atividade
  const [nivel, setNivel] = useState(1)
  const [pontuacao, setPontuacao] = useState(0)
  const [atividadeIniciada, setAtividadeIniciada] = useState(false)
  const [atividadeConcluida, setAtividadeConcluida] = useState(false)
  const [aguardandoClique, setAguardandoClique] = useState(false)
  const [tempoReacao, setTempoReacao] = useState<number[]>([])
  const [acertos, setAcertos] = useState(0)
  const [erros, setErros] = useState(0)
  const [olhosVisiveis, setOlhosVisiveis] = useState(true)
  const [posicaoOlhos, setPosicaoOlhos] = useState({ x: 50, y: 30 })
  
  // Referências para tempo
  const tempoInicioRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const configuracaoNivel: { [key: number]: any } = {
    1: { nome: 'Básico', tamanhoOlhos: 'w-10 h-10', pontosPorAcerto: 10, tempoExibicao: 3000, tempoOculto: 1000, metaPontos: 50 },
    2: { nome: 'Intermediário', tamanhoOlhos: 'w-7 h-7', pontosPorAcerto: 15, tempoExibicao: 2000, tempoOculto: 1500, metaPontos: 75 },
    3: { nome: 'Avançado', tamanhoOlhos: 'w-5 h-5', pontosPorAcerto: 20, tempoExibicao: 1500, tempoOculto: 2000, metaPontos: 100 }
  }
  
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
  
  const iniciarRodada = () => {
    setOlhosVisiveis(false)
    setAguardandoClique(false)
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const posicoes = [
        { x: 50, y: 20 }, { x: 50, y: 45 }, { x: 25, y: 33 }, { x: 75, y: 33 },
        { x: 30, y: 25 }, { x: 70, y: 25 }, { x: 30, y: 40 }, { x: 70, y: 40 },
        { x: 50, y: 33 },
      ]
      setPosicaoOlhos(posicoes[Math.floor(Math.random() * posicoes.length)])
      
      setOlhosVisiveis(true)
      setAguardandoClique(true)
      tempoInicioRef.current = Date.now()
      
      timeoutRef.current = setTimeout(() => {
        if (aguardandoClique) {
          registrarErro()
        }
      }, configuracaoNivel[nivel].tempoExibicao)
    }, configuracaoNivel[nivel].tempoOculto)
  }
  
  const clicarNosOlhos = () => {
    if (!aguardandoClique || !olhosVisiveis) return
    
    const tempo = Date.now() - (tempoInicioRef.current ?? 0)
    setTempoReacao(prev => [...prev, tempo])
    setAcertos(prev => prev + 1)
    const novosPontos = pontuacao + configuracaoNivel[nivel].pontosPorAcerto
    setPontuacao(novosPontos)
    
    setOlhosVisiveis(false)
    setAguardandoClique(false)
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (novosPontos >= configuracaoNivel[nivel].metaPontos) {
      if (nivel < 3) {
        setNivel(prev => prev + 1)
        setPontuacao(0)
        setTimeout(() => iniciarRodada(), 1500)
      } else {
        finalizarAtividade()
      }
    } else {
      setTimeout(() => iniciarRodada(), 500)
    }
  }
  
  const registrarErro = () => {
    setErros(prev => prev + 1)
    setOlhosVisiveis(false)
    setAguardandoClique(false)
    setTimeout(() => iniciarRodada(), 500)
  }
  
  const finalizarAtividade = () => {
    setAtividadeConcluida(true)
    setOlhosVisiveis(false)
    setAguardandoClique(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }
  
  const calcularTempoMedioReacao = () => {
    if (tempoReacao.length === 0) return 0
    return Math.round(tempoReacao.reduce((a, b) => a + b, 0) / tempoReacao.length)
  }
  
  const calcularTaxaAcerto = () => {
    const total = acertos + erros
    if (total === 0) return 0
    return Math.round((acertos / total) * 100)
  }
  
  const handleSaveSession = async () => {
    if (!atividadeConcluida) {
      alert('Complete a atividade antes de salvar.')
      return
    }
    setSalvando(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      const pontuacaoFinal = (acertos * 10) + (nivel * 50) - (erros * 5)
      
      const { error } = await supabase
        .from('sessoes')
        .insert([{
          usuario_id: user.id,
          atividade_nome: 'Contato Visual Progressivo',
          pontuacao_final: Math.max(0, pontuacaoFinal),
          data_fim: new Date().toISOString(),
          metricas: {
            nivelMaximo: nivel,
            totalAcertos: acertos,
            totalErros: erros,
            taxaAcerto: calcularTaxaAcerto(),
            tempoMedioReacaoMs: calcularTempoMedioReacao()
          }
        }])
      
      if (error) throw error;

      alert(`Sessão salva com sucesso!`)
      router.push('/dashboard')
    } catch (error: any) {
      alert(`Erro ao salvar: ${error.message}`)
    } finally {
      setSalvando(false)
    }
  }
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [])
  
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
            <Eye size={22} />
            <span>Contato Visual</span>
          </h1>
          <button
            onClick={handleSaveSession}
            disabled={salvando || !atividadeConcluida}
            className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${
              atividadeConcluida 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save size={18} />
            <span className="hidden sm:inline">{salvando ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <GameHeader />
      <main className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {/* Cards de Explicação */}
        {!atividadeIniciada && (
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center"><Target className="text-red-500 mr-2" /> Objetivo</h2>
                    <p className="text-gray-600 text-sm">Praticar o direcionamento da atenção visual clicando nos olhos que aparecem na tela.</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center"><Eye className="text-blue-500 mr-2" /> Como Jogar</h2>
                    <ul className="text-gray-600 text-sm list-disc list-inside space-y-1">
                        <li>Clique em "Iniciar"</li>
                        <li>Clique nos olhos rapidamente</li>
                        <li>Complete a meta de pontos</li>
                    </ul>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center"><Trophy className="text-yellow-500 mr-2" /> Níveis</h2>
                    <ul className="text-gray-600 text-sm list-disc list-inside space-y-1">
                        <li>Básico: Olhos grandes</li>
                        <li>Intermediário: Olhos médios</li>
                        <li>Avançado: Olhos pequenos</li>
                    </ul>
                </div>
            </div>
        )}
        
        {/* Progresso da Sessão */}
        {atividadeIniciada && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Progresso da Sessão</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg"><div className="text-2xl font-bold text-blue-600">{nivel}</div><div className="text-sm">Nível</div></div>
                <div className="text-center p-4 bg-green-50 rounded-lg"><div className="text-2xl font-bold text-green-600">{acertos}</div><div className="text-sm">Acertos</div></div>
                <div className="text-center p-4 bg-purple-50 rounded-lg"><div className="text-2xl font-bold text-purple-600">{calcularTaxaAcerto()}%</div><div className="text-sm">Taxa de Acerto</div></div>
                <div className="text-center p-4 bg-orange-50 rounded-lg"><div className="text-2xl font-bold text-orange-600">{calcularTempoMedioReacao()}ms</div><div className="text-sm">Tempo Médio</div></div>
            </div>
          </div>
        )}
        
        {/* Área Principal do Jogo */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="relative min-h-[400px] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center">
            {!atividadeIniciada && !atividadeConcluida && (
              <div className="text-center">
                <button onClick={iniciarAtividade} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl text-lg">
                  Iniciar Atividade
                </button>
              </div>
            )}
            
            {atividadeIniciada && !atividadeConcluida && (
              <div className="relative w-full h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48 bg-yellow-200 rounded-full">
                    {olhosVisiveis && (
                      <div className="absolute flex space-x-4" style={{ left: `${posicaoOlhos.x}%`, top: `${posicaoOlhos.y}%`, transform: 'translate(-50%, -50%)' }}>
                        <button onClick={clicarNosOlhos} className={`${configuracaoNivel[nivel].tamanhoOlhos} bg-blue-600 rounded-full cursor-pointer`} />
                        <button onClick={clicarNosOlhos} className={`${configuracaoNivel[nivel].tamanhoOlhos} bg-blue-600 rounded-full cursor-pointer`} />
                      </div>
                    )}
                    <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-600 rounded-full" />
                  </div>
                </div>
              </div>
            )}
            
            {atividadeConcluida && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Atividade Concluída!</h2>
                <button onClick={iniciarAtividade} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg">
                  Jogar Novamente
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
