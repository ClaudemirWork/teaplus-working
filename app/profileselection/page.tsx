'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';
import { useTherapeuticObjectives, TherapeuticObjective, UserProfile, UserCondition } from '../contexts/TherapeuticObjectives';

// =========================================
// TIPOS E INTERFACES
// =========================================

type ProfileType = 'patient' | 'parent' | 'therapist';
type OnboardingStep = 'profile_type' | 'name' | 'condition' | 'objectives' | 'avatar' | 'duration' | 'completed';

interface OnboardingData {
  profileType: ProfileType | null;
  name: string;
  condition: UserCondition | null;
  selectedObjectives: TherapeuticObjective[];
  avatar: string;
  therapyDuration: '4_weeks' | '8_weeks' | '12_weeks' | '24_weeks';
  intensityLevel: 'light' | 'moderate' | 'intensive';
}

// =========================================
// DADOS ESTÁTICOS BASEADOS EM EVIDÊNCIAS
// =========================================

const PROFILE_TYPES = [
  {
    id: 'patient' as ProfileType,
    title: 'Criança/Adolescente',
    description: 'Vou usar o app sozinho(a)',
    icon: '👤',
    color: '#4A90E2'
  },
  {
    id: 'parent' as ProfileType,
    title: 'Pai/Mãe/Responsável',
    description: 'Vou acompanhar meu filho(a)',
    icon: '👨‍👩‍👧‍👦',
    color: '#8E44AD'
  },
  {
    id: 'therapist' as ProfileType,
    title: 'Profissional',
    description: 'Vou acompanhar pacientes',
    icon: '🩺',
    color: '#1abc9c'
  }
];

const CONDITIONS = [
  {
    id: 'TEA' as UserCondition,
    title: 'TEA (Transtorno do Espectro Autista)',
    description: 'Focado em comunicação social e interação',
    icon: '🧩',
    color: '#4A90E2'
  },
  {
    id: 'TDAH' as UserCondition,
    title: 'TDAH (Transtorno do Déficit de Atenção)',
    description: 'Focado em atenção, memória e organização',
    icon: '⚡',
    color: '#F5A623'
  },
  {
    id: 'TEA_TDAH' as UserCondition,
    title: 'TEA + TDAH',
    description: 'Desenvolvimento geral integrado',
    icon: '🎯',
    color: '#8E44AD'
  },
  {
    id: 'OTHER' as UserCondition,
    title: 'Outra condição',
    description: 'Desenvolvimento personalizado',
    icon: '🌟',
    color: '#e74c3c'
  }
];

const THERAPEUTIC_OBJECTIVES = [
  {
    id: 'manter_rotina_diaria' as TherapeuticObjective,
    title: 'Manter rotina diária',
    description: 'Estruturar o dia a dia',
    icon: '📅',
    color: '#3498db',
    evidenceLevel: 'high'
  },
  {
    id: 'habilidades_sociais' as TherapeuticObjective,
    title: 'Melhorar habilidades sociais',
    description: 'Interagir melhor com outros',
    icon: '👥',
    color: '#9b59b6',
    evidenceLevel: 'high'
  },
  {
    id: 'foco_atencao' as TherapeuticObjective,
    title: 'Aumentar foco e atenção',
    description: 'Concentrar-se nas atividades',
    icon: '🎯',
    color: '#e67e22',
    evidenceLevel: 'high'
  },
  {
    id: 'regulacao_emocional' as TherapeuticObjective,
    title: 'Regular emoções',
    description: 'Gerenciar sentimentos',
    icon: '😊',
    color: '#f39c12',
    evidenceLevel: 'high'
  },
  {
    id: 'comunicacao' as TherapeuticObjective,
    title: 'Comunicação',
    description: 'Expressar necessidades',
    icon: '💬',
    color: '#1abc9c',
    evidenceLevel: 'high'
  },
  {
    id: 'independencia' as TherapeuticObjective,
    title: 'Independência',
    description: 'Autonomia no dia a dia',
    icon: '🦋',
    color: '#e74c3c',
    evidenceLevel: 'medium'
  }
];

const AVATARS = [
  { id: 'estrela', name: 'Estrela', emoji: '⭐', color: '#FFD700' },
  { id: 'foguete', name: 'Foguete', emoji: '🚀', color: '#FF6B6B' },
  { id: 'unicornio', name: 'Unicórnio', emoji: '🦄', color: '#DDA0DD' },
  { id: 'dragao', name: 'Dragão', emoji: '🐲', color: '#32CD32' },
  { id: 'robo', name: 'Robô', emoji: '🤖', color: '#00CED1' },
  { id: 'gatinho', name: 'Gatinho', emoji: '🐱', color: '#FFB347' },
  { id: 'cachorro', name: 'Cachorro', emoji: '🐶', color: '#DEB887' },
  { id: 'leao', name: 'Leão', emoji: '🦁', color: '#CD853F' }
];

const THERAPY_DURATIONS = [
  { id: '4_weeks', title: '4 semanas', description: 'Experimentar o app', recommended: false },
  { id: '8_weeks', title: '8 semanas', description: 'Ciclo básico', recommended: false },
  { id: '12_weeks', title: '12 semanas', description: 'Recomendado', recommended: true },
  { id: '24_weeks', title: '24 semanas', description: 'Programa completo', recommended: false }
];

export default function ProfileSelection() {
  const router = useRouter();
  const supabase = createClient();
  const therapeuticContext = useTherapeuticObjectives();
  
  // Estados de autenticação (mantidos do código original)
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [authStatus, setAuthStatus] = useState('Verificando acesso...');
  
  // Estados do onboarding
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('profile_type');
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    profileType: null,
    name: '',
    condition: null,
    selectedObjectives: [],
    avatar: '',
    therapyDuration: '12_weeks',
    intensityLevel: 'moderate'
  });

  // =========================================
  // AUTENTICAÇÃO (MANTIDA DO CÓDIGO ORIGINAL)
  // =========================================
  
  useEffect(() => {
    const checkAuth = async () => {
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          setAuthStatus(`Verificando sessão... (${retryCount + 1}/${maxRetries})`);
          
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.log('Erro ao obter sessão:', sessionError);
            throw sessionError;
          }

          if (!session) {
            console.log('Nenhuma sessão ativa encontrada');
            setAuthStatus('Redirecionando para login...');
            router.replace('/login');
            return;
          }

          setAuthStatus('Sessão encontrada, verificando usuário...');
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.log('Erro ao obter usuário:', userError);
            throw userError;
          }

          if (!user) {
            console.log('Usuário não encontrado apesar de sessão ativa');
            setAuthStatus('Redirecionando para login...');
            router.replace('/login');
            return;
          }

          if (!user.email_confirmed_at) {
            console.log('Email não confirmado');
            setAuthStatus('Email não confirmado, redirecionando...');
            router.replace('/login');
            return;
          }

          console.log('Usuário autenticado com sucesso:', user.email);
          setAuthStatus('Acesso autorizado!');
          
          setUserInfo({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
            email: user.email
          });
          
          setIsLoading(false);
          return;

        } catch (error) {
          console.error(`Tentativa ${retryCount + 1} falhou:`, error);
          retryCount++;
          
          if (retryCount < maxRetries) {
            setAuthStatus(`Erro na verificação, tentando novamente... (${retryCount}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            console.error('Todas as tentativas de autenticação falharam:', error);
            setAuthStatus('Erro de autenticação, redirecionando...');
            router.replace('/login');
          }
        }
      }
    };

    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, [router, supabase]);

  // =========================================
  // FUNÇÕES DO ONBOARDING
  // =========================================

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  const goToNextStep = () => {
    const stepOrder: OnboardingStep[] = ['profile_type', 'name', 'condition', 'objectives', 'avatar', 'duration', 'completed'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const stepOrder: OnboardingStep[] = ['profile_type', 'name', 'condition', 'objectives', 'avatar', 'duration', 'completed'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const getRecommendedObjectives = (): TherapeuticObjective[] => {
    if (!onboardingData.condition) return [];
    
    const conditionMap: Record<UserCondition, TherapeuticObjective[]> = {
      'TEA': ['comunicacao', 'habilidades_sociais', 'regulacao_emocional'],
      'TDAH': ['foco_atencao', 'regulacao_emocional', 'manter_rotina_diaria'],
      'TEA_TDAH': ['regulacao_emocional', 'comunicacao', 'foco_atencao'],
      'OTHER': ['regulacao_emocional', 'independencia', 'habilidades_sociais']
    };
    
    return conditionMap[onboardingData.condition] || [];
  };

  const toggleObjective = (objective: TherapeuticObjective) => {
    const currentObjectives = onboardingData.selectedObjectives;
    const isSelected = currentObjectives.includes(objective);
    
    if (isSelected) {
      updateOnboardingData({
        selectedObjectives: currentObjectives.filter(obj => obj !== objective)
      });
    } else {
      // Permitir seleção ilimitada inicialmente (sistema 3+2+1 será aplicado no Context Provider)
      updateOnboardingData({
        selectedObjectives: [...currentObjectives, objective]
      });
    }
  };

  const canProceedFromObjectives = (): boolean => {
    return onboardingData.selectedObjectives.length >= 1;
  };

  const completeOnboarding = async () => {
    try {
      // Criar perfil completo para o Context Provider
      const userProfile: UserProfile = {
        id: userInfo.id,
        name: onboardingData.name || userInfo.name,
        avatar: onboardingData.avatar,
        ageGroup: onboardingData.profileType === 'patient' ? 'child' : 'adult',
        primaryCondition: onboardingData.condition!,
        profileType: onboardingData.profileType!,
        selectedObjectives: onboardingData.selectedObjectives,
        currentPhase: 'initial',
        therapyDuration: onboardingData.therapyDuration,
        intensityLevel: onboardingData.intensityLevel,
        sessionProgress: {},
        overallProgress: 0,
        streakDays: 0,
        totalSessions: 0,
        createdAt: new Date(),
        lastSession: null,
        preferences: {
          notifications: true,
          soundEnabled: true,
          difficulty: 'medium'
        }
      };

      // Atualizar Context Provider
      await therapeuticContext.updateUserProfile(userProfile);

      // Salvar no Supabase (opcional para persistência)
      await supabase.from('user_profiles').upsert({
        user_id: userInfo.id,
        profile_data: userProfile,
        updated_at: new Date().toISOString()
      });

      // Redirecionar baseado na condição (compatibilidade com sistema atual)
      const conditionRoutes: Record<UserCondition, string> = {
        'TEA': '/tea',
        'TDAH': '/tdah', 
        'TEA_TDAH': '/combined',
        'OTHER': '/dashboard'
      };

      router.push(conditionRoutes[onboardingData.condition!]);
      
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Deseja realmente sair do aplicativo?')) {
      try {
        await supabase.auth.signOut();
        window.alert('Logout realizado com sucesso!');
        router.replace('/login');
      } catch (error) {
        console.error('Erro no logout:', error);
        router.replace('/login');
      }
    }
  };

  // =========================================
  // COMPONENTES DAS ETAPAS
  // =========================================

  const renderProfileTypeStep = () => (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Quem está usando?</h2>
      <p className="text-gray-600 mb-6">Para personalizar sua experiência</p>
      
      <div className="space-y-4">
        {PROFILE_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              updateOnboardingData({ profileType: type.id });
              goToNextStep();
            }}
            className="w-full p-6 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-left"
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{type.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-800">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderNameStep = () => (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Vamos nos conhecer!</h2>
      <p className="text-gray-600 mb-6">Como você gostaria de ser chamado?</p>
      
      <div className="mb-8">
        <input
          type="text"
          placeholder="Como você gostaria de ser chamado?"
          value={onboardingData.name}
          onChange={(e) => updateOnboardingData({ name: e.target.value })}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none text-lg text-center"
          autoFocus
        />
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={goToPreviousStep}
          className="flex-1 py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={goToNextStep}
          disabled={!onboardingData.name.trim()}
          className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Próximo
        </button>
      </div>
    </div>
  );

  const renderConditionStep = () => (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Suas necessidades</h2>
      <p className="text-gray-600 mb-6">Selecione sua condição principal para personalizarmos sua experiência:</p>
      
      <div className="space-y-4 mb-8">
        {CONDITIONS.map((condition) => (
          <button
            key={condition.id}
            onClick={() => {
              updateOnboardingData({ condition: condition.id });
              goToNextStep();
            }}
            className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-left"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{condition.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-800">{condition.title}</h3>
                <p className="text-sm text-gray-600">{condition.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <button
        onClick={goToPreviousStep}
        className="w-full py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
      >
        Voltar
      </button>
    </div>
  );

  const renderObjectivesStep = () => {
    const recommended = getRecommendedObjectives();
    
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Objetivos iniciais</h2>
        <p className="text-gray-600 mb-6">Quais objetivos você gostaria de trabalhar? (Selecione quantos quiser)</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {THERAPEUTIC_OBJECTIVES.map((objective) => {
            const isSelected = onboardingData.selectedObjectives.includes(objective.id);
            const isRecommended = recommended.includes(objective.id);
            
            return (
              <button
                key={objective.id}
                onClick={() => toggleObjective(objective.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                } ${isRecommended ? 'ring-2 ring-green-200' : ''}`}
              >
                <div className="text-center">
                  <span className="text-3xl block mb-2">{objective.icon}</span>
                  <h3 className="font-semibold text-sm text-gray-800">{objective.title}</h3>
                  {isRecommended && (
                    <span className="text-xs text-green-600 font-medium">Recomendado</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={goToPreviousStep}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={goToNextStep}
            disabled={!canProceedFromObjectives()}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Próximo
          </button>
        </div>
      </div>
    );
  };

  const renderAvatarStep = () => (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Escolha seu avatar</h2>
      <p className="text-gray-600 mb-6">Escolha seu avatar para a jornada!</p>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        {AVATARS.map((avatar) => {
          const isSelected = onboardingData.avatar === avatar.id;
          
          return (
            <button
              key={avatar.id}
              onClick={() => updateOnboardingData({ avatar: avatar.id })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 scale-110' 
                  : 'border-gray-200 hover:border-blue-300 hover:scale-105'
              }`}
            >
              <div className="text-center">
                <span className="text-4xl block mb-2">{avatar.emoji}</span>
                <h3 className="font-medium text-xs text-gray-800">{avatar.name}</h3>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={goToPreviousStep}
          className="flex-1 py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={completeOnboarding}
          disabled={!onboardingData.avatar}
          className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Finalizar
        </button>
      </div>
    </div>
  );

  // =========================================
  // RENDERIZAÇÃO PRINCIPAL
  // =========================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center w-full max-w-sm">
          <img src="/images/Teaplus-logo.png" alt="TeaPlus Logo" className="w-40 h-40 mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">TeaPlus</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-2">{authStatus}</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
          <p className="text-xs text-green-600 mt-2">🔒 Autenticação Supabase</p>
          <p className="text-xs text-gray-400 mt-1">Aguarde alguns segundos...</p>
        </div>
      </div>
    );
  }

  const stepComponents = {
    'profile_type': renderProfileTypeStep,
    'name': renderNameStep, 
    'condition': renderConditionStep,
    'objectives': renderObjectivesStep,
    'avatar': renderAvatarStep,
    'duration': renderAvatarStep, // Por enquanto usa o mesmo
    'completed': renderAvatarStep // Por enquanto usa o mesmo
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <img src="/images/Teaplus-logo.png" alt="TeaPlus Logo" className="w-32 h-32 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">TeaPlus</h1>
          <p className="text-sm text-gray-600">Aplicativo de apoio ao paciente com TEA, TDAH</p>
          <p className="text-sm text-slate-500 mt-2">
            Olá, <strong className="text-slate-800">{userInfo?.name || 'Usuário'}</strong>
          </p>
        </div>

        {/* Conteúdo da Etapa Atual */}
        <div className="mb-6">
          {stepComponents[currentStep]()}
        </div>

        {/* Footer */}
        <div className="text-center border-t pt-4">
          <p className="text-xs text-slate-400 mb-2">
            Sistema baseado em evidências científicas
          </p>
          <button
            onClick={handleLogout}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            🚪 Sair do Aplicativo
          </button>
        </div>
      </div>
    </div>
  );
}
