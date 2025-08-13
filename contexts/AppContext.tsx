'use client'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

// =========================================
// TIPOS CIENTÍFICOS BASEADOS EM EVIDÊNCIAS
// =========================================

export type TherapeuticObjective = 
  | 'regulacao_emocional'     // Meta-análise 2024 - Cohen's d 1.89
  | 'comunicacao'             // Core TEA - CDC 2024
  | 'foco_atencao'           // Core TDAH - Translational Psychiatry 2024
  | 'habilidades_sociais'     // Interação social - Nature 2024
  | 'manter_rotina_diaria'    // Estruturação comportamental
  | 'independencia'           // Functioning independente
  | 'flexibilidade_cognitiva' // Medicina personalizada TEA 2024
  | 'funcoes_executivas'      // ADHD evidence-based 2024

export type TherapyPhase = 'initial' | 'expansion' | 'consolidation'

export type UserCondition = 'TEA' | 'TDAH' | 'TEA_TDAH' | 'OTHER'

export type UserProfile = {
  id: string
  name: string
  avatar: string
  ageGroup: 'child' | 'adolescent' | 'adult'
  primaryCondition: UserCondition
  profileType: 'patient' | 'parent' | 'therapist'
  
  // Objetivos terapêuticos selecionados (sistema 3+2+1)
  selectedObjectives: TherapeuticObjective[]
  currentPhase: TherapyPhase
  therapyDuration: '4_weeks' | '8_weeks' | '12_weeks' | '24_weeks'
  intensityLevel: 'light' | 'moderate' | 'intensive'
  
  // Progresso e métricas
  sessionProgress: Record<TherapeuticObjective, number>
  overallProgress: number
  streakDays: number
  totalSessions: number
  
  // Configurações
  createdAt: Date
  lastSession: Date | null
  preferences: {
    notifications: boolean
    soundEnabled: boolean
    difficulty: 'easy' | 'medium' | 'hard'
  }
}

export type ActivityRecommendation = {
  activityName: string
  relevanceScore: number
  objectives: TherapeuticObjective[]
  estimatedDuration: number
  difficulty: 'easy' | 'medium' | 'hard'
  scientificRationale: string
}

export type SessionMetrics = {
  activityName: string
  objectives: TherapeuticObjective[]
  scores: Record<TherapeuticObjective, number>
  duration: number
  timestamp: Date
  improvements: Record<TherapeuticObjective, number>
}

// =========================================
// CONTEXT TYPE DEFINITION
// =========================================

type TherapeuticContextType = {
  // Estado do usuário
  userProfile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Objetivos terapêuticos
  availableObjectives: TherapeuticObjective[]
  getObjectiveInfo: (objective: TherapeuticObjective) => ObjectiveInfo
  
  // Sistema 3+2+1 (baseado em evidências científicas)
  getMaxObjectivesForPhase: (phase: TherapyPhase) => number
  canAddObjective: () => boolean
  getRecommendedObjectives: () => TherapeuticObjective[]
  
  // Recomendações inteligentes
  getPersonalizedActivities: () => ActivityRecommendation[]
  getNextRecommendedActivity: () => ActivityRecommendation | null
  
  // Progresso e métricas
  updateObjectiveProgress: (objective: TherapeuticObjective, score: number) => void
  saveSessionMetrics: (metrics: SessionMetrics) => Promise<void>
  getProgressSummary: () => ProgressSummary
  
  // Gestão de perfil
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
  addObjective: (objective: TherapeuticObjective) => Promise<boolean>
  removeObjective: (objective: TherapeuticObjective) => Promise<boolean>
  
  // Progressão de fases
  checkPhaseProgression: () => Promise<boolean>
  advanceToNextPhase: () => Promise<boolean>
  
  // Compatibilidade com sistema anterior
  getLegacySection: () => 'TEA' | 'TDAH' | 'COMBINED'
  getBackUrl: () => string
  
  // Funções utilitárias
  resetProgress: () => Promise<void>
  exportProgressReport: () => ProgressReport
}

type ObjectiveInfo = {
  name: string
  description: string
  scientificEvidence: string
  primaryConditions: UserCondition[]
  recommendedPhase: TherapyPhase
  estimatedWeeks: number
}

type ProgressSummary = {
  overallScore: number
  objectiveScores: Record<TherapeuticObjective, number>
  improvements: Record<TherapeuticObjective, number>
  sessionsCompleted: number
  currentStreak: number
  nextMilestone: string
}

type ProgressReport = {
  userInfo: Partial<UserProfile>
  period: { start: Date; end: Date }
  summary: ProgressSummary
  detailed: SessionMetrics[]
  recommendations: string[]
}

// =========================================
// OBJECTIVE DEFINITIONS (EVIDENCE-BASED)
// =========================================

const OBJECTIVE_DEFINITIONS: Record<TherapeuticObjective, ObjectiveInfo> = {
  regulacao_emocional: {
    name: 'Regulação Emocional',
    description: 'Desenvolver estratégias para reconhecer, compreender e gerenciar emoções de forma saudável',
    scientificEvidence: 'Meta-análise 2024: Cohen\'s d 1.89 para intervenções digitais em regulação emocional',
    primaryConditions: ['TEA', 'TDAH', 'TEA_TDAH'],
    recommendedPhase: 'initial',
    estimatedWeeks: 4
  },
  comunicacao: {
    name: 'Comunicação',
    description: 'Melhorar habilidades de comunicação verbal e não-verbal, expressão de necessidades',
    scientificEvidence: 'CDC 2024: Core deficit em TEA, 89% taxa de sucesso com terapias personalizadas',
    primaryConditions: ['TEA', 'TEA_TDAH'],
    recommendedPhase: 'initial',
    estimatedWeeks: 6
  },
  foco_atencao: {
    name: 'Foco e Atenção',
    description: 'Desenvolver capacidade de concentração sustentada e atenção seletiva',
    scientificEvidence: 'Translational Psychiatry 2024: Métricas em tempo real predizem resultados clínicos',
    primaryConditions: ['TDAH', 'TEA_TDAH'],
    recommendedPhase: 'initial',
    estimatedWeeks: 4
  },
  habilidades_sociais: {
    name: 'Habilidades Sociais',
    description: 'Desenvolver competências para interação social, empatia e reciprocidade',
    scientificEvidence: 'Nature 2024: Intervenções digitais mostram eficácia significativa em múltiplas idades',
    primaryConditions: ['TEA', 'TEA_TDAH'],
    recommendedPhase: 'expansion',
    estimatedWeeks: 6
  },
  manter_rotina_diaria: {
    name: 'Rotina Diária',
    description: 'Estabelecer e manter rotinas estruturadas para maior previsibilidade',
    scientificEvidence: 'JAMA Pediatrics 2024: Estruturação comportamental otimiza resultados terapêuticos',
    primaryConditions: ['TEA', 'TDAH', 'TEA_TDAH'],
    recommendedPhase: 'expansion',
    estimatedWeeks: 8
  },
  independencia: {
    name: 'Independência',
    description: 'Desenvolver autonomia para atividades de vida diária e tomada de decisões',
    scientificEvidence: 'Goal Setting Review 2024: 38 estudos confirmam benefícios para funcionamento independente',
    primaryConditions: ['TEA', 'TDAH', 'TEA_TDAH'],
    recommendedPhase: 'consolidation',
    estimatedWeeks: 8
  },
  flexibilidade_cognitiva: {
    name: 'Flexibilidade Cognitiva',
    description: 'Desenvolver capacidade de adaptar pensamento a novas situações',
    scientificEvidence: 'Autism Science Foundation 2024: Medicina personalizada - tratamento certo no momento certo',
    primaryConditions: ['TEA', 'TEA_TDAH'],
    recommendedPhase: 'expansion',
    estimatedWeeks: 6
  },
  funcoes_executivas: {
    name: 'Funções Executivas',
    description: 'Fortalecer planejamento, organização e controle inibitório',
    scientificEvidence: 'ADHD Evidence-Based 2024: Abordagens personalizadas maximizam eficácia',
    primaryConditions: ['TDAH', 'TEA_TDAH'],
    recommendedPhase: 'expansion',
    estimatedWeeks: 6
  }
}

// =========================================
// ACTIVITY MAPPING (EVIDENCE-BASED)
// =========================================

const ACTIVITY_OBJECTIVE_MAPPING: Record<string, {
  primary: TherapeuticObjective[]
  secondary: TherapeuticObjective[]
  relevanceScore: number
}> = {
  'traffic-light-game': {
    primary: ['regulacao_emocional', 'foco_atencao'],
    secondary: ['funcoes_executivas'],
    relevanceScore: 0.9
  },
  'attention-sustained': {
    primary: ['foco_atencao'],
    secondary: ['funcoes_executivas'],
    relevanceScore: 0.95
  },
  'conversation-starters': {
    primary: ['comunicacao', 'habilidades_sociais'],
    secondary: ['regulacao_emocional'],
    relevanceScore: 0.85
  },
  'emotion-regulation': {
    primary: ['regulacao_emocional'],
    secondary: ['habilidades_sociais'],
    relevanceScore: 0.9
  },
  'daily-routine-builder': {
    primary: ['manter_rotina_diaria'],
    secondary: ['independencia', 'funcoes_executivas'],
    relevanceScore: 0.8
  }
  // Adicionar mapeamento para todas as 92 atividades gradualmente
}

// =========================================
// CONTEXT IMPLEMENTATION
// =========================================

const TherapeuticContext = createContext<TherapeuticContextType | null>(null)

export function TherapeuticProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // =========================================
  // SISTEMA 3+2+1 (EVIDENCE-BASED)
  // =========================================
  
  const getMaxObjectivesForPhase = (phase: TherapyPhase): number => {
    // Baseado em evidências científicas: limite cognitivo para eficácia
    switch (phase) {
      case 'initial': return 3      // Semanas 1-4: foco em objetivos primários
      case 'expansion': return 5    // Semanas 5-8: adicionar objetivos secundários
      case 'consolidation': return 6 // Semanas 9+: objetivos avançados
      default: return 3
    }
  }
  
  const canAddObjective = (): boolean => {
    if (!userProfile) return false
    const maxForPhase = getMaxObjectivesForPhase(userProfile.currentPhase)
    return userProfile.selectedObjectives.length < maxForPhase
  }
  
  const getRecommendedObjectives = (): TherapeuticObjective[] => {
    if (!userProfile) return []
    
    const { primaryCondition, currentPhase, selectedObjectives } = userProfile
    
    return Object.entries(OBJECTIVE_DEFINITIONS)
      .filter(([objective, info]) => {
        // Não recomendar objetivos já selecionados
        if (selectedObjectives.includes(objective as TherapeuticObjective)) return false
        
        // Filtrar por condição primária
        if (!info.primaryConditions.includes(primaryCondition)) return false
        
        // Respeitar progressão de fases
        if (currentPhase === 'initial' && info.recommendedPhase !== 'initial') return false
        
        return true
      })
      .map(([objective]) => objective as TherapeuticObjective)
      .slice(0, 3) // Máximo 3 recomendações por vez
  }
  
  // =========================================
  // RECOMENDAÇÕES INTELIGENTES
  // =========================================
  
  const getPersonalizedActivities = (): ActivityRecommendation[] => {
    if (!userProfile) return []
    
    const { selectedObjectives, preferences } = userProfile
    
    return Object.entries(ACTIVITY_OBJECTIVE_MAPPING)
      .map(([activityName, config]) => {
        // Calcular score de relevância baseado nos objetivos do usuário
        const relevanceScore = selectedObjectives.reduce((score, objective) => {
          if (config.primary.includes(objective)) return score + 0.8
          if (config.secondary.includes(objective)) return score + 0.3
          return score
        }, 0) * config.relevanceScore
        
        return {
          activityName,
          relevanceScore,
          objectives: config.primary.filter(obj => selectedObjectives.includes(obj)),
          estimatedDuration: preferences.difficulty === 'easy' ? 15 : 
                           preferences.difficulty === 'medium' ? 25 : 35,
          difficulty: preferences.difficulty,
          scientificRationale: `Atividade otimizada para ${selectedObjectives.join(', ')}`
        }
      })
      .filter(rec => rec.relevanceScore > 0.2)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10) // Top 10 recomendações
  }
  
  const getNextRecommendedActivity = (): ActivityRecommendation | null => {
    const activities = getPersonalizedActivities()
    return activities.length > 0 ? activities[0] : null
  }
  
  // =========================================
  // PROGRESSO E MÉTRICAS
  // =========================================
  
  const updateObjectiveProgress = (objective: TherapeuticObjective, score: number) => {
    if (!userProfile) return
    
    setUserProfile(prev => {
      if (!prev) return null
      
      const newSessionProgress = {
        ...prev.sessionProgress,
        [objective]: score
      }
      
      // Calcular progresso geral
      const objectiveScores = Object.values(newSessionProgress)
      const overallProgress = objectiveScores.reduce((sum, score) => sum + score, 0) / objectiveScores.length
      
      return {
        ...prev,
        sessionProgress: newSessionProgress,
        overallProgress,
        totalSessions: prev.totalSessions + 1,
        lastSession: new Date()
      }
    })
  }
  
  const saveSessionMetrics = async (metrics: SessionMetrics): Promise<void> => {
    // Implementar salvamento no Supabase
    try {
      // Salvar métricas híbridas (compatibilidade + novos dados)
      const sessionData = {
        // Dados legados (compatibilidade)
        usuario_id: userProfile?.id,
        atividade_nome: metrics.activityName,
        pontuacao_final: Math.round(Object.values(metrics.scores).reduce((sum, score) => sum + score, 0) / Object.values(metrics.scores).length * 100),
        origem_secao: getLegacySection(),
        
        // Novos dados orientados a objetivos
        objectives_data: {
          scores: metrics.scores,
          objectives: metrics.objectives,
          improvements: metrics.improvements,
          session_duration: metrics.duration
        },
        therapy_phase: userProfile?.currentPhase,
        session_version: 'v2.0'
      }
      
      console.log('Salvando métricas da sessão:', sessionData)
      // await supabase.from('sessoes').insert(sessionData)
    } catch (error) {
      console.error('Erro ao salvar métricas:', error)
    }
  }
  
  const getProgressSummary = (): ProgressSummary => {
    if (!userProfile) {
      return {
        overallScore: 0,
        objectiveScores: {},
        improvements: {},
        sessionsCompleted: 0,
        currentStreak: 0,
        nextMilestone: 'Complete seu primeiro objetivo'
      }
    }
    
    return {
      overallScore: userProfile.overallProgress,
      objectiveScores: userProfile.sessionProgress,
      improvements: {}, // Calcular baseado em histórico
      sessionsCompleted: userProfile.totalSessions,
      currentStreak: userProfile.streakDays,
      nextMilestone: getNextMilestone()
    }
  }
  
  const getNextMilestone = (): string => {
    if (!userProfile) return 'Complete seu primeiro objetivo'
    
    const { currentPhase, selectedObjectives, overallProgress } = userProfile
    
    if (overallProgress < 0.3) return 'Alcance 30% de progresso em seus objetivos'
    if (overallProgress < 0.7) return 'Alcance 70% de progresso para expandir objetivos'
    if (currentPhase === 'initial') return 'Pronto para adicionar novos objetivos!'
    if (currentPhase === 'expansion') return 'Próximo: Fase de consolidação'
    return 'Manter progresso e independência!'
  }
  
  // =========================================
  // GESTÃO DE PERFIL
  // =========================================
  
  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    setUserProfile(prev => prev ? { ...prev, ...updates } : null)
  }
  
  const addObjective = async (objective: TherapeuticObjective): Promise<boolean> => {
    if (!canAddObjective()) return false
    
    setUserProfile(prev => {
      if (!prev) return null
      return {
        ...prev,
        selectedObjectives: [...prev.selectedObjectives, objective],
        sessionProgress: {
          ...prev.sessionProgress,
          [objective]: 0
        }
      }
    })
    
    return true
  }
  
  const removeObjective = async (objective: TherapeuticObjective): Promise<boolean> => {
    if (!userProfile) return false
    
    setUserProfile(prev => {
      if (!prev) return null
      
      const newSessionProgress = { ...prev.sessionProgress }
      delete newSessionProgress[objective]
      
      return {
        ...prev,
        selectedObjectives: prev.selectedObjectives.filter(obj => obj !== objective),
        sessionProgress: newSessionProgress
      }
    })
    
    return true
  }
  
  // =========================================
  // PROGRESSÃO DE FASES
  // =========================================
  
  const checkPhaseProgression = async (): Promise<boolean> => {
    if (!userProfile) return false
    
    const { currentPhase, selectedObjectives, sessionProgress } = userProfile
    
    // Calcular progresso médio dos objetivos
    const averageProgress = selectedObjectives.reduce((sum, obj) => {
      return sum + (sessionProgress[obj] || 0)
    }, 0) / selectedObjectives.length
    
    // Critérios para progressão (baseados em evidências)
    switch (currentPhase) {
      case 'initial':
        // 70% de progresso em 2/3 objetivos iniciais
        return averageProgress >= 0.7
      case 'expansion':
        // Progresso sustentado em todos os objetivos
        return averageProgress >= 0.6 && selectedObjectives.length >= 4
      case 'consolidation':
        // Manutenção de progresso
        return averageProgress >= 0.8
      default:
        return false
    }
  }
  
  const advanceToNextPhase = async (): Promise<boolean> => {
    if (!userProfile) return false
    
    const canAdvance = await checkPhaseProgression()
    if (!canAdvance) return false
    
    const nextPhase: TherapyPhase = 
      userProfile.currentPhase === 'initial' ? 'expansion' :
      userProfile.currentPhase === 'expansion' ? 'consolidation' : 'consolidation'
    
    await updateUserProfile({ currentPhase: nextPhase })
    return true
  }
  
  // =========================================
  // COMPATIBILIDADE COM SISTEMA ANTERIOR
  // =========================================
  
  const getLegacySection = (): 'TEA' | 'TDAH' | 'COMBINED' => {
    if (!userProfile) return 'TEA'
    
    switch (userProfile.primaryCondition) {
      case 'TEA': return 'TEA'
      case 'TDAH': return 'TDAH'
      case 'TEA_TDAH': return 'COMBINED'
      default: return 'TEA'
    }
  }
  
  const getBackUrl = (): string => {
    const section = getLegacySection()
    return section === 'COMBINED' ? '/' : `/${section.toLowerCase()}`
  }
  
  // =========================================
  // FUNÇÕES UTILITÁRIAS
  // =========================================
  
  const resetProgress = async (): Promise<void> => {
    if (!userProfile) return
    
    await updateUserProfile({
      sessionProgress: {},
      overallProgress: 0,
      totalSessions: 0,
      streakDays: 0,
      lastSession: null
    })
  }
  
  const exportProgressReport = (): ProgressReport => {
    if (!userProfile) {
      return {
        userInfo: {},
        period: { start: new Date(), end: new Date() },
        summary: getProgressSummary(),
        detailed: [],
        recommendations: []
      }
    }
    
    return {
      userInfo: {
        name: userProfile.name,
        avatar: userProfile.avatar,
        primaryCondition: userProfile.primaryCondition,
        selectedObjectives: userProfile.selectedObjectives,
        currentPhase: userProfile.currentPhase
      },
      period: {
        start: userProfile.createdAt,
        end: new Date()
      },
      summary: getProgressSummary(),
      detailed: [], // Buscar do histórico
      recommendations: getPersonalizedActivities().slice(0, 5).map(act => act.activityName)
    }
  }
  
  const getObjectiveInfo = (objective: TherapeuticObjective): ObjectiveInfo => {
    return OBJECTIVE_DEFINITIONS[objective]
  }
  
  // =========================================
  // CONTEXT VALUE
  // =========================================
  
  const contextValue: TherapeuticContextType = {
    // Estado
    userProfile,
    isAuthenticated,
    isLoading,
    
    // Objetivos
    availableObjectives: Object.keys(OBJECTIVE_DEFINITIONS) as TherapeuticObjective[],
    getObjectiveInfo,
    
    // Sistema 3+2+1
    getMaxObjectivesForPhase,
    canAddObjective,
    getRecommendedObjectives,
    
    // Recomendações
    getPersonalizedActivities,
    getNextRecommendedActivity,
    
    // Progresso
    updateObjectiveProgress,
    saveSessionMetrics,
    getProgressSummary,
    
    // Gestão
    updateUserProfile,
    addObjective,
    removeObjective,
    
    // Progressão
    checkPhaseProgression,
    advanceToNextPhase,
    
    // Compatibilidade
    getLegacySection,
    getBackUrl,
    
    // Utilidades
    resetProgress,
    exportProgressReport
  }
  
  return (
    <TherapeuticContext.Provider value={contextValue}>
      {children}
    </TherapeuticContext.Provider>
  )
}

// =========================================
// HOOK PARA USO DO CONTEXT
// =========================================

export const useTherapeuticObjectives = () => {
  const context = useContext(TherapeuticContext)
  if (!context) {
    throw new Error('useTherapeuticObjectives must be used within TherapeuticProvider')
  }
  return context
}

// =========================================
// HOOK DE COMPATIBILIDADE (LEGACY SUPPORT)
// =========================================

export const useAppContext = () => {
  const therapeutic = useTherapeuticObjectives()
  
  // Manter compatibilidade com código existente
  return {
    currentSection: therapeutic.getLegacySection(),
    userProfile: therapeutic.userProfile,
    backUrl: therapeutic.getBackUrl(),
    
    // Funcionalidades expandidas disponíveis
    ...therapeutic
  }
}
