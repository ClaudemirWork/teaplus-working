'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

// =========================================
// TIPOS ESSENCIAIS
// =========================================
type ProfileType = 'child' | 'parent' | 'professional';
type Condition = 'TEA' | 'TDAH' | 'TEA_TDAH' | 'OTHER';
type Avatar = 'star' | 'rocket' | 'unicorn' | 'dragon' | 'robot' | 'cat' | 'dog' | 'lion';

// =========================================
// 8 OBJETIVOS CIENTÍFICOS
// =========================================
const THERAPEUTIC_OBJECTIVES = [
  { id: 'regulacao_emocional', name: 'Regular emoções', icon: '😊' },
  { id: 'comunicacao', name: 'Comunicação', icon: '💬' },
  { id: 'foco_atencao', name: 'Aumentar foco e atenção', icon: '🎯' },
  { id: 'habilidades_sociais', name: 'Melhorar habilidades sociais', icon: '👥' },
  { id: 'rotina_diaria', name: 'Manter rotina diária', icon: '📅' },
  { id: 'independencia', name: 'Independência', icon: '🦋' },
  { id: 'gestao_ansiedade', name: 'Gestão de ansiedade', icon: '🧘' },
  { id: 'coordenacao_motora', name: 'Coordenação motora', icon: '🤸' }
];

const AVATARS = [
  { id: 'star', name: 'Estrela', emoji: '⭐' },
  { id: 'rocket', name: 'Foguete', emoji: '🚀' },
  { id: 'unicorn', name: 'Unicórnio', emoji: '🦄' },
  { id: 'dragon', name: 'Dragão', emoji: '🐉' },
  { id: 'robot', name: 'Robô', emoji: '🤖' },
  { id: 'cat', name: 'Gatinho', emoji: '🐱' },
  { id: 'dog', name: 'Cachorro', emoji: '🐶' },
  { id: 'lion', name: 'Leão', emoji: '🦁' }
];

export default function ProfileSelection() {
  const router = useRouter();
  const supabase = createClient();
  
  // Estados
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  // Dados do perfil
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [userName, setUserName] = useState('');
  const [condition, setCondition] = useState<Condition | null>(null);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

  // Verificação inicial
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        // Verificar se já tem perfil
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profile && profile.avatar) {
          // Já tem perfil completo, redirecionar
          const redirectTo = getAppRoute(profile.primary_condition);
          router.push(redirectTo);
          return;
        }

        setMessage('Bem-vindo! Vamos configurar seu perfil.');
        setIsLoading(false);

      } catch (error) {
        console.error('Erro inicial:', error);
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router, supabase]);

  // Função para determinar rota baseada na condição
  const getAppRoute = (condition: string) => {
    switch (condition) {
      case 'TEA': return '/tea';
      case 'TDAH': return '/tdah';
      case 'TEA_TDAH': return '/combined';
      default: return '/tea';
    }
  };

  // Navegação entre etapas
  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Toggle objetivos
  const toggleObjective = (objectiveId: string) => {
    setSelectedObjectives(prev => 
      prev.includes(objectiveId)
        ? prev.filter(id => id !== objectiveId)
        : [...prev, objectiveId]
    );
  };

  // Finalizar cadastro
  const handleFinish = async () => {
    setIsSubmitting(true);
    setMessage('Salvando seu perfil...');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Não autenticado');
      }

      // Dados para salvar (estrutura simples)
      const profileData = {
        user_id: session.user.id,
        profile_type: profileType!,
        name: userName,
        primary_condition: condition!,
        therapeutic_objectives: selectedObjectives,
        avatar: selectedAvatar!
      };

      // Salvar no Supabase
      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) {
        throw error;
      }

      setMessage('Perfil salvo com sucesso! Redirecionando...');

      // Redirecionar após sucesso
      setTimeout(() => {
        const redirectTo = getAppRoute(condition!);
        router.push(redirectTo);
      }, 1500);
      
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      setMessage(`Erro: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Verificando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        
        {/* Mensagem de status */}
        {message && (
          <div className="mb-4 p-3 bg-blue-100 rounded-lg text-blue-800 text-sm text-center">
            {message}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">TeaPlus</h1>
          <p className="text-gray-600 text-sm">Aplicativo de apoio ao paciente com TEA, TDAH</p>
          <div className="text-xs text-gray-500 mt-1">
            Dr. <span className="font-medium">Claudemir Pereira</span>
          </div>
        </div>

        {/* Indicador de Progresso */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full mx-1 ${
                step === currentStep
                  ? 'bg-blue-600'
                  : step < currentStep
                  ? 'bg-blue-400'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* ETAPA 1: QUEM ESTÁ USANDO? */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Quem está usando?</h2>
              <p className="text-gray-600 text-sm">Para personalizar sua experiência</p>
            </div>

            <div className="space-y-4">
              {[
                { type: 'child' as ProfileType, icon: '👤', title: 'Criança/Adolescente', subtitle: 'Vou usar o app sozinho(a)' },
                { type: 'parent' as ProfileType, icon: '👨‍👩‍👧‍👦', title: 'Pai/Mãe/Responsável', subtitle: 'Vou acompanhar meu filho(a)' },
                { type: 'professional' as ProfileType, icon: '👩‍⚕️', title: 'Profissional', subtitle: 'Vou acompanhar pacientes' }
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => setProfileType(option.type)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    profileType === option.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{option.icon}</div>
                    <div>
                      <div className="font-semibold text-gray-800">{option.title}</div>
                      <div className="text-sm text-gray-600">{option.subtitle}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={handleLogout} className="px-6 py-2 text-gray-600 hover:text-gray-800">
                Sair do Aplicativo
              </button>
              <button
                onClick={nextStep}
                disabled={!profileType}
                className={`px-8 py-3 rounded-xl font-medium ${
                  profileType ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Próximo →
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: NOME */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Vamos nos conhecer!</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Como você gostaria de ser chamado?"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={prevStep} className="px-6 py-2 text-gray-600 hover:text-gray-800">
                ← Voltar
              </button>
              <button
                onClick={nextStep}
                disabled={!userName.trim()}
                className={`px-8 py-3 rounded-xl font-medium ${
                  userName.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Próximo →
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: CONDIÇÃO */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Suas necessidades</h2>
              <p className="text-gray-600 text-sm">Selecione sua condição principal para personalizarmos sua experiência:</p>
            </div>

            <div className="space-y-4">
              {[
                { type: 'TEA' as Condition, icon: '🧩', title: 'TEA (Transtorno do Espectro Autista)' },
                { type: 'TDAH' as Condition, icon: '⚡', title: 'TDAH (Transtorno do Déficit de Atenção)' },
                { type: 'TEA_TDAH' as Condition, icon: '🔄', title: 'TEA + TDAH' },
                { type: 'OTHER' as Condition, icon: '⭐', title: 'Outra condição' }
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => setCondition(option.type)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    condition === option.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{option.icon}</div>
                    <div className="font-semibold text-gray-800">{option.title}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={prevStep} className="px-6 py-2 text-gray-600 hover:text-gray-800">
                ← Voltar
              </button>
              <button
                onClick={nextStep}
                disabled={!condition}
                className={`px-8 py-3 rounded-xl font-medium ${
                  condition ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Próximo →
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 4: OBJETIVOS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Objetivos iniciais</h2>
              <p className="text-gray-600 text-sm">Quais objetivos você gostaria de trabalhar? (Selecione quantos quiser)</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
              {THERAPEUTIC_OBJECTIVES.map((objective) => (
                <button
                  key={objective.id}
                  onClick={() => toggleObjective(objective.id)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    selectedObjectives.includes(objective.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{objective.icon}</div>
                  <div className="text-sm font-medium text-gray-800">{objective.name}</div>
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-500 text-center">
              Sistema baseado em evidências científicas
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={prevStep} className="px-6 py-2 text-gray-600 hover:text-gray-800">
                ← Voltar
              </button>
              <button
                onClick={nextStep}
                disabled={selectedObjectives.length === 0}
                className={`px-8 py-3 rounded-xl font-medium ${
                  selectedObjectives.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Próximo →
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 5: AVATAR */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Escolha seu avatar</h2>
              <p className="text-gray-600 text-sm">Escolha seu avatar para a jornada!</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id as Avatar)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    selectedAvatar === avatar.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{avatar.emoji}</div>
                  <div className="text-xs font-medium text-gray-800">{avatar.name}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={prevStep} className="px-6 py-2 text-gray-600 hover:text-gray-800">
                ← Voltar
              </button>
              <button
                onClick={handleFinish}
                disabled={!selectedAvatar || isSubmitting}
                className={`px-8 py-3 rounded-xl font-medium ${
                  selectedAvatar && !isSubmitting ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Salvando...' : 'Finalizar →'}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="text-xs text-gray-500">Sistema baseado em evidências científicas</div>
          <button onClick={handleLogout} className="text-xs text-orange-500 hover:text-orange-600 mt-1">
            🚪 Sair do Aplicativo
          </button>
        </div>
      </div>
    </div>
  );
}
