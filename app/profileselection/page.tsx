'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// =========================================
// TIPOS ESSENCIAIS
// =========================================
type ProfileType = 'child' | 'parent' | 'professional';
type Condition = 'TEA' | 'TDAH' | 'TEA_TDAH' | 'OTHER';
type Avatar = 'star' | 'rocket' | 'unicorn' | 'dragon' | 'robot' | 'cat' | 'dog' | 'lion';

// =========================================
// CONSTANTES (AVATARES, OBJETIVOS)
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
  
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('primary_condition, avatar')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar perfil:', error);
      }

      if (profile && profile.avatar) {
        // Se o perfil já está completo, vai direto para o dashboard unificado
        router.push('/dashboard');
        return;
      }

      setIsLoading(false);
    };
    checkUser();
  }, [router, supabase]);

  // ================================================================
  // MUDANÇA CRÍTICA AQUI
  // ================================================================
  // Esta função agora sempre aponta para o dashboard unificado.
  const getAppRoute = () => {
    return '/dashboard';
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const toggleObjective = (objectiveId: string) => {
    setSelectedObjectives(prev => 
      prev.includes(objectiveId)
        ? prev.filter(id => id !== objectiveId)
        : [...prev, objectiveId]
    );
  };

  const handleFinish = async () => {
    if (!profileType || !userName.trim() || !condition || selectedObjectives.length === 0 || !selectedAvatar) {
        setMessage('Por favor, preencha todas as etapas antes de finalizar.');
        return;
    }
    setIsSubmitting(true);
    setMessage('Salvando seu perfil...');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão não encontrada. Faça o login novamente.');

      const profileData = {
        user_id: session.user.id,
        profile_type: profileType,
        name: userName,
        primary_condition: condition,
        therapeutic_objectives: selectedObjectives,
        avatar: selectedAvatar,
      };

      const { error } = await supabase.from('user_profiles').upsert(profileData, { onConflict: 'user_id' });
      if (error) throw error;

      setMessage('Perfil salvo com sucesso! Redirecionando...');
      setTimeout(() => {
        const redirectTo = getAppRoute(); // Chama a função corrigida
        router.push(redirectTo);
      }, 1500);
      
    } catch (error: any) {
      console.error('Erro ao salvar o perfil:', error);
      setMessage(`Erro ao salvar: ${error.message}. Tente novamente.`);
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
        {/* O restante do seu código de interface (JSX) permanece o mesmo */}
        {/* ... cole o JSX das 5 etapas aqui ... */}
        <div className="flex justify-center mb-8">
         {[1, 2, 3, 4, 5].map((step) => (
           <div
             key={step}
             className={`w-3 h-3 rounded-full mx-1 transition-colors duration-300 ${
               step === currentStep ? 'bg-blue-600' : step < currentStep ? 'bg-teal-500' : 'bg-gray-300'
             }`}
           />
         ))}
       </div>

       {currentStep === 1 && (
         <div className="space-y-6 animate-fade-in">
           <h2 className="text-xl font-bold text-center text-gray-800">Quem está usando?</h2>
           <div className="space-y-4">
             {[
               { type: 'child' as ProfileType, icon: '👤', title: 'Criança/Adolescente', subtitle: 'Vou usar o app sozinho(a)' },
               { type: 'parent' as ProfileType, icon: '👨‍👩‍👧‍👦', title: 'Pai/Mãe/Responsável', subtitle: 'Vou acompanhar meu filho(a)' },
               { type: 'professional' as ProfileType, icon: '👩‍⚕️', title: 'Profissional', subtitle: 'Vou acompanhar pacientes' }
             ].map((option) => (
               <button key={option.type} onClick={() => setProfileType(option.type)} className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${profileType === option.type ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-400'}`}>
                 <div className="flex items-center"><div className="text-2xl mr-4">{option.icon}</div><div><div className="font-semibold text-gray-800">{option.title}</div><div className="text-sm text-gray-600">{option.subtitle}</div></div></div>
               </button>
             ))}
           </div>
           <div className="flex justify-end pt-4"><button onClick={nextStep} disabled={!profileType} className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${profileType ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}>Próximo →</button></div>
         </div>
       )}

       {currentStep === 2 && (
         <div className="space-y-6 animate-fade-in">
           <h2 className="text-xl font-bold text-center text-gray-800">Vamos nos conhecer!</h2>
           <div><label className="block text-sm font-medium text-gray-700 mb-2">Nome</label><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Como você gostaria de ser chamado?" className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 focus:outline-none transition"/></div>
           <div className="flex justify-between pt-4"><button onClick={prevStep} className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium">← Voltar</button><button onClick={nextStep} disabled={!userName.trim()} className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${userName.trim() ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}>Próximo →</button></div>
         </div>
       )}

       {currentStep === 3 && (
         <div className="space-y-6 animate-fade-in">
           <h2 className="text-xl font-bold text-center text-gray-800">Suas necessidades</h2>
           <div className="space-y-4">
             {[
               { type: 'TEA' as Condition, icon: '🧩', title: 'TEA (Transtorno do Espectro Autista)' },
               { type: 'TDAH' as Condition, icon: '⚡', title: 'TDAH (Transtorno do Déficit de Atenção)' },
               { type: 'TEA_TDAH' as Condition, icon: '🔄', title: 'TEA + TDAH' },
               { type: 'OTHER' as Condition, icon: '⭐', title: 'Outra condição' }
             ].map((option) => (
               <button key={option.type} onClick={() => setCondition(option.type)} className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${condition === option.type ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-400'}`}>
                 <div className="flex items-center"><div className="text-2xl mr-4">{option.icon}</div><div className="font-semibold text-gray-800">{option.title}</div></div>
               </button>
             ))}
           </div>
           <div className="flex justify-between pt-4"><button onClick={prevStep} className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium">← Voltar</button><button onClick={nextStep} disabled={!condition} className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${condition ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}>Próximo →</button></div>
         </div>
       )}

       {currentStep === 4 && (
         <div className="space-y-6 animate-fade-in">
           <h2 className="text-xl font-bold text-center text-gray-800">Objetivos iniciais</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto p-2">
             {THERAPEUTIC_OBJECTIVES.map((objective) => (
               <button key={objective.id} onClick={() => toggleObjective(objective.id)} className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${selectedObjectives.includes(objective.id) ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-400'}`}>
                 <div className="text-3xl mb-2">{objective.icon}</div><div className="text-sm font-medium text-gray-800">{objective.name}</div>
               </button>
             ))}
           </div>
           <div className="flex justify-between pt-4"><button onClick={prevStep} className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium">← Voltar</button><button onClick={nextStep} disabled={selectedObjectives.length === 0} className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${selectedObjectives.length > 0 ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}>Próximo →</button></div>
         </div>
       )}

       {currentStep === 5 && (
         <div className="space-y-6 animate-fade-in">
           <h2 className="text-xl font-bold text-center text-gray-800">Escolha seu avatar</h2>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             {AVATARS.map((avatar) => (
               <button key={avatar.id} onClick={() => setSelectedAvatar(avatar.id as Avatar)} className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${selectedAvatar === avatar.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-400'}`}>
                 <div className="text-4xl mb-2">{avatar.emoji}</div><div className="text-xs font-medium text-gray-800">{avatar.name}</div>
               </button>
             ))}
           </div>
           <div className="flex justify-between pt-4"><button onClick={prevStep} className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium">← Voltar</button><button onClick={handleFinish} disabled={!selectedAvatar || isSubmitting} className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 w-40 ${selectedAvatar && !isSubmitting ? 'bg-teal-600 hover:bg-teal-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}>{isSubmitting ? 'Salvando...' : 'Finalizar'}</button></div>
         </div>
       )}
      </div>
    </div>
  );
}
