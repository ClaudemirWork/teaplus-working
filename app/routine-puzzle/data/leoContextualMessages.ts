// Sistema completo de mensagens contextuais do Leo
// 120+ mensagens organizadas por contexto, progresso e modo de usuário

export interface ContextualMessage {
  id: string;
  text: string;
  context: string[];
  userMode: 'parent' | 'child' | 'both';
  progressLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  trigger: string;
  category: 'tutorial' | 'guidance' | 'insight' | 'troubleshooting' | 'motivation';
  priority: 'low' | 'medium' | 'high';
  cooldown?: number; // minutos antes de poder aparecer novamente
}

export const LEO_CONTEXTUAL_MESSAGES: ContextualMessage[] = [
  
  // ===== TUTORIAL BÁSICO (25 mensagens) =====
  {
    id: 'welcome_first_time',
    text: 'Olá! Sou o Leo e vou te ajudar a criar rotinas incríveis. Vamos começar juntos?',
    context: ['first_visit'],
    userMode: 'both',
    progressLevel: 'beginner',
    trigger: 'app_start',
    category: 'tutorial',
    priority: 'high'
  },
  {
    id: 'select_day_tutorial',
    text: 'Primeiro passo: escolha um dia da semana. Sugestão: comece com segunda-feira!',
    context: ['no_day_selected'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'main_screen_load',
    category: 'tutorial',
    priority: 'high'
  },
  {
    id: 'add_first_activity',
    text: 'Agora toque em uma atividade para adicioná-la. Que tal começar com "Acordar"?',
    context: ['day_selected', 'no_activities'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'empty_day_view',
    category: 'tutorial',
    priority: 'high'
  },
  {
    id: 'first_activity_added',
    text: 'Perfeito! Sua primeira atividade foi adicionada. Viu como apareceu na rotina?',
    context: ['first_activity_added'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'activity_added',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'explain_time_slots',
    text: 'O horário é definido automaticamente, mas você pode alterar clicando no relógio azul.',
    context: ['has_activities', 'time_not_changed'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'view_schedule',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'how_to_complete_task',
    text: 'Para marcar como feita, toque no círculo ao lado da atividade. Vai ganhar estrelas!',
    context: ['has_activities', 'no_completed_tasks'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'schedule_view',
    category: 'tutorial',
    priority: 'high'
  },
  {
    id: 'first_task_completed',
    text: 'Incrível! Você completou sua primeira tarefa e ganhou 2 estrelas. Continue assim!',
    context: ['first_task_completed'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'task_completion',
    category: 'tutorial',
    priority: 'high'
  },
  {
    id: 'explain_stars_system',
    text: 'As estrelas ajudam a subir de nível. A cada 50 estrelas você avança um nível!',
    context: ['has_stars', 'level_1'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'star_gained',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'add_more_activities',
    text: 'Sua rotina está ganhando forma! Adicione mais 2-3 atividades para completar o dia.',
    context: ['has_few_activities'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'activity_count_check',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'explain_categories',
    text: 'Use as categorias para encontrar atividades específicas: rotina, ações, comida, escola.',
    context: ['using_all_category'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'category_selection',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'search_function_intro',
    text: 'Não encontra uma atividade? Use a lupa para buscar pelo nome!',
    context: ['many_activities_available'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'browsing_activities',
    category: 'tutorial',
    priority: 'low'
  },
  {
    id: 'child_mode_intro',
    text: 'Quer mostrar para a criança? Toque no ícone do bebê para ativar o Modo Criança!',
    context: ['has_complete_routine'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'routine_ready',
    category: 'tutorial',
    priority: 'high'
  },
  {
    id: 'child_welcome',
    text: 'Olá, pequeno! Estou aqui para te ajudar com sua rotina. Cada tarefa que você fizer me deixa muito feliz!',
    context: ['child_mode_first_time'],
    userMode: 'child',
    progressLevel: 'beginner',
    trigger: 'child_mode_start',
    category: 'tutorial',
    priority: 'high'
  },
  {
    id: 'child_explain_stars',
    text: 'Viu as estrelinhas? Cada atividade que você completa me dá estrelas! Quanto mais, melhor!',
    context: ['child_mode', 'has_stars'],
    userMode: 'child',
    progressLevel: 'beginner',
    trigger: 'stars_visible',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'remove_activity_help',
    text: 'Para remover uma atividade, toque no X vermelho ao lado dela na rotina.',
    context: ['too_many_activities'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'overwhelmed_routine',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'save_routine_reminder',
    text: 'Não esqueça de salvar sua rotina! Toque no botão verde "Salvar Rotina".',
    context: ['unsaved_changes'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'routine_modified',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'copy_routine_intro',
    text: 'Rotina pronta para um dia? Use "Copiar para..." para replicar em outros dias!',
    context: ['complete_day_routine'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'day_complete',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'volume_control_help',
    text: 'Se minha voz incomodar, use o botão do alto-falante para me silenciar temporariamente.',
    context: ['audio_playing'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'frequent_audio',
    category: 'tutorial',
    priority: 'low'
  },
  {
    id: 'notifications_intro',
    text: 'O sino mostra suas conquistas! Toque nele para ver todos os seus sucessos.',
    context: ['has_achievements'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'achievement_unlocked',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'morning_routine_suggestion',
    text: 'Dica: rotinas matinais funcionam melhor com 3-4 atividades simples.',
    context: ['morning_activities', 'many_morning_tasks'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'morning_overload',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'evening_routine_suggestion',
    text: 'Rotinas noturnas ajudam a relaxar. Inclua banho, escovação e uma atividade calma.',
    context: ['evening_activities', 'few_evening_tasks'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'incomplete_evening',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'weekend_different_routine',
    text: 'Fins de semana podem ter rotinas diferentes! Menos compromissos, mais diversão.',
    context: ['weekend_days'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'weekend_planning',
    category: 'tutorial',
    priority: 'low'
  },
  {
    id: 'routine_consistency_tip',
    text: 'Consistência é chave! Mantenha os mesmos horários todos os dias quando possível.',
    context: ['varying_times'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'time_inconsistency',
    category: 'tutorial',
    priority: 'medium'
  },
  {
    id: 'first_week_complete',
    text: 'Parabéns! Você criou rotinas para a semana toda. Isso é um grande avanço!',
    context: ['all_days_have_activities'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'week_complete',
    category: 'tutorial',
    priority: 'high'
  },
  {
    id: 'graduation_to_intermediate',
    text: 'Você dominou o básico! Agora posso te mostrar recursos mais avançados.',
    context: ['ready_for_intermediate'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'progress_milestone',
    category: 'tutorial',
    priority: 'high'
  },

  // ===== PROGRESSO INTERMEDIÁRIO (30 mensagens) =====
  {
    id: 'achievements_explanation',
    text: 'Conquistas são marcos especiais! Cada uma dá estrelas extras e títulos únicos.',
    context: ['level_2_reached'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'first_achievement',
    category: 'guidance',
    priority: 'high'
  },
  {
    id: 'streak_system_intro',
    text: 'Sequências são dias consecutivos usando o app. Quanto maior, mais bônus de estrelas!',
    context: ['has_streak'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'streak_milestone',
    category: 'guidance',
    priority: 'medium'
  },
  {
    id: 'level_benefits_explanation',
    text: 'Cada nível novo desbloqueará mais recursos e conquistas especiais para vocês.',
    context: ['level_up'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'level_gained',
    category: 'guidance',
    priority: 'medium'
  },
  {
    id: 'daily_challenges_intro',
    text: 'Desafios diários dão estrelas extras! Complete 5 tarefas hoje para o primeiro desafio.',
    context: ['challenges_available'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'daily_challenge_start',
    category: 'guidance',
    priority: 'medium'
  },
  {
    id: 'category_mastery_feedback',
    text: 'Você está dominando atividades de alimentação! 8 de 10 concluídas esta semana.',
    context: ['food_category_success'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'category_pattern',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'morning_struggle_identified',
    text: 'Percebo que manhãs são desafiadoras. 68% das famílias melhoram reduzindo para 3 atividades matinais.',
    context: ['morning_completion_low'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'pattern_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'weekend_vs_weekday_pattern',
    text: 'Fins de semana têm 20% mais conclusões que dias úteis. Considere rotinas mais flexíveis durante a semana.',
    context: ['weekend_better_performance'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'weekly_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'time_optimization_suggestion',
    text: 'Atividades entre 14h-16h têm melhor taxa de conclusão. Considere mover tarefas difíceis para este horário.',
    context: ['afternoon_success_pattern'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'timing_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'routine_density_feedback',
    text: 'Sua rotina tem densidade ideal: 6-8 atividades por dia. Perfeito para manter engajamento!',
    context: ['optimal_activity_count'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'routine_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'consistency_improvement_tip',
    text: 'Variação de horários reduziu 15% esta semana. Consistência temporal melhora formação de hábitos.',
    context: ['improved_time_consistency'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'consistency_check',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'child_engagement_positive',
    text: 'Sua criança está super engajada! 85% de conclusão é excelente para desenvolvimento de autonomia.',
    context: ['high_completion_rate'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'engagement_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'streak_break_recovery',
    text: 'Sequência quebrou ontem, mas você já voltou hoje! Resiliência é fundamental no desenvolvimento.',
    context: ['streak_recovered'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'streak_break',
    category: 'guidance',
    priority: 'medium'
  },
  {
    id: 'school_routine_adaptation',
    text: 'Rotina escolar se adapta automaticamente aos horários. Atividades matinais ficam mais cedo em dias letivos.',
    context: ['school_activities_present'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'school_day_planning',
    category: 'guidance',
    priority: 'medium'
  },
  {
    id: 'copy_routine_advanced',
    text: 'Copiar rotinas mantém horários proporcionais. Rotina de segunda vira base para outros dias.',
    context: ['routine_copying'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'copy_action',
    category: 'guidance',
    priority: 'low'
  },
  {
    id: 'search_efficiency_tip',
    text: 'Busca funciona com palavras parciais. Digite "ban" para encontrar "banho" mais rapidamente.',
    context: ['frequent_searches'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'search_usage',
    category: 'guidance',
    priority: 'low'
  },
  {
    id: 'notification_management_tip',
    text: 'Muitas notificações? Você pode marcar como lidas tocando nelas. Assim mantém o histórico limpo.',
    context: ['many_unread_notifications'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'notification_overload',
    category: 'guidance',
    priority: 'low'
  },
  {
    id: 'child_motivation_system',
    text: 'No modo criança, celebro automaticamente! Isso reforça comportamentos positivos através de feedback imediato.',
    context: ['child_mode_usage'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'child_mode_explanation',
    category: 'guidance',
    priority: 'medium'
  },
  {
    id: 'achievement_progress_update',
    text: 'Você está 80% perto da conquista "Mestre das Tarefas"! Mais 10 atividades para desbloquear.',
    context: ['achievement_near_completion'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'achievement_progress',
    category: 'guidance',
    priority: 'medium'
  },
  {
    id: 'weekly_performance_summary',
    text: 'Esta semana: 72% de conclusão, 3 conquistas novas, sequência de 5 dias. Evolução constante!',
    context: ['week_end_summary'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'weekly_review',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'difficulty_adjustment_suggestion',
    text: 'Taxa de conclusão baixa em atividades novas? Tente introduzir uma por vez para facilitar adaptação.',
    context: ['new_activities_low_completion'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'difficulty_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'routine_evolution_feedback',
    text: 'Sua rotina evoluiu 40% desde o início! Mais atividades, melhor distribuição temporal, maior consistência.',
    context: ['routine_maturity'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'evolution_milestone',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'child_independence_growth',
    text: 'Criança está marcando mais atividades sozinha! Sinais de crescimento da autonomia.',
    context: ['child_self_completion_increase'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'independence_growth',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'seasonal_routine_adaptation',
    text: 'Horários de luz natural afetam rotinas. Considere ajustar atividades matinais conforme estação.',
    context: ['seasonal_timing_impact'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'seasonal_analysis',
    category: 'insight',
    priority: 'low'
  },
  {
    id: 'social_routine_benefits',
    text: 'Atividades sociais na rotina aumentaram 30%! Interação social é fundamental para desenvolvimento.',
    context: ['social_activities_increase'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'social_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'routine_flexibility_balance',
    text: 'Equilíbrio perfeito: 70% atividades fixas, 30% flexíveis. Estrutura com adaptabilidade.',
    context: ['routine_flexibility_optimal'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'flexibility_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'milestone_50_tasks',
    text: 'Marco histórico: 50 tarefas completadas! Isso representa semanas de crescimento e desenvolvimento.',
    context: ['50_tasks_completed'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'milestone_achievement',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'parent_child_cooperation',
    text: 'Vocês são uma equipe incrível! Colaboração entre pai/mãe e criança está cada vez melhor.',
    context: ['good_cooperation_pattern'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'cooperation_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'ready_for_advanced_features',
    text: 'Você dominou os recursos intermediários! Pronto para funcionalidades avançadas de análise.',
    context: ['intermediate_mastery'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'advancement_ready',
    category: 'guidance',
    priority: 'high'
  },
  {
    id: 'child_celebration_level_up',
    text: 'Uau! Subimos de nível juntos! Você é incrível e cada dia fica melhor na sua rotina!',
    context: ['level_up'],
    userMode: 'child',
    progressLevel: 'intermediate',
    trigger: 'child_level_up',
    category: 'motivation',
    priority: 'high'
  },
  {
    id: 'child_streak_celebration',
    text: 'Você fez atividades 5 dias seguidos! Que campeão! Estou muito orgulhoso de você!',
    context: ['streak_milestone'],
    userMode: 'child',
    progressLevel: 'intermediate',
    trigger: 'child_streak',
    category: 'motivation',
    priority: 'high'
  },

  // ===== INSIGHTS AVANÇADOS (40 mensagens) =====
  {
    id: 'comprehensive_week_analysis',
    text: 'Análise semanal completa: picos de energia às 10h e 15h, quedas às 13h e 18h. Otimize tarefas difíceis nos picos.',
    context: ['advanced_analytics_available'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'deep_analysis_request',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'behavioral_pattern_recognition',
    text: 'Padrão identificado: resistência inicial diminui 60% após 3ª repetição da mesma atividade no mesmo horário.',
    context: ['habit_formation_visible'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'behavior_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'executive_function_development',
    text: 'Funções executivas melhorando: planejamento +25%, organização +40%, autocontrole +15% nas últimas 4 semanas.',
    context: ['executive_skills_tracking'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'cognitive_development_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'sensory_preference_analysis',
    text: 'Preferências sensoriais detectadas: atividades visuais 85% conclusão vs auditivas 65%. Adapte estratégias.',
    context: ['sensory_patterns_visible'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'sensory_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'transition_difficulty_insights',
    text: 'Transições mais difíceis: brincadeira→estudos (40% resistência) vs estudos→brincadeira (10% resistência).',
    context: ['transition_data_available'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'transition_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'optimal_routine_density',
    text: 'Densidade ótima identificada: 1 atividade a cada 90 minutos maximiza conclusão sem sobrecarga cognitiva.',
    context: ['density_optimization_data'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'optimization_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'motivation_cycle_patterns',
    text: 'Ciclos motivacionais: picos a cada 3-4 dias, vale no 7º dia. Planeje atividades desafiadoras nos picos.',
    context: ['motivation_tracking_available'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'motivation_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'environmental_factor_correlation',
    text: 'Correlação ambiente-performance: dias ensolarados +20% conclusão, chuva -15%. Ajuste expectativas.',
    context: ['environmental_correlation_visible'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'environmental_analysis',
    category: 'insight',
    priority: 'low'
  },
  {
    id: 'cognitive_load_optimization',
    text: 'Carga cognitiva otimizada: atividades complexas pela manhã (9-11h), simples à tarde (15-17h).',
    context: ['cognitive_load_data'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'cognitive_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'social_skills_progression',
    text: 'Habilidades sociais evoluindo: iniciativa +30%, cooperação +45%, comunicação +20% em atividades sociais.',
    context: ['social_skills_tracking'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'social_development_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'routine_personalization_success',
    text: 'Personalização 95% efetiva: rotina adaptada ao perfil sensorial e preferências comportamentais específicas.',
    context: ['high_personalization_success'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'personalization_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'independence_trajectory_positive',
    text: 'Trajetória de independência acelerada: autogestão +60% comparado a baseline de entrada no app.',
    context: ['independence_growth_significant'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'independence_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'stress_indicator_monitoring',
    text: 'Indicadores de stress baixos: 90% das atividades completadas sem sinais de sobrecarga emocional.',
    context: ['stress_monitoring_positive'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'stress_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'learning_velocity_acceleration',
    text: 'Velocidade de aprendizado aumentou 40%: novas atividades integradas 2x mais rápido que inicialmente.',
    context: ['learning_acceleration_visible'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'learning_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'routine_resilience_high',
    text: 'Resiliência da rotina alta: 85% de manutenção mesmo com mudanças imprevistas (feriados, doenças).',
    context: ['routine_resilience_demonstrated'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'resilience_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'family_dynamics_improvement',
    text: 'Dinâmica familiar otimizada: conflitos relacionados à rotina reduziram 70% desde implementação.',
    context: ['family_harmony_improved'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'family_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'predictive_behavior_modeling',
    text: 'Modelo preditivo sugere: nova atividade "arte" terá 80% aceitação se introduzida às 16h nas quartas.',
    context: ['predictive_model_available'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'prediction_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'sensory_integration_progress',
    text: 'Integração sensorial melhorada: tolerância a variações aumentou 50%, flexibilidade cognitiva +35%.',
    context: ['sensory_integration_improvement'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'sensory_development_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'executive_planning_mastery',
    text: 'Planejamento executivo quase dominado: antecipação de tarefas +80%, organização temporal +70%.',
    context: ['executive_planning_advanced'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'executive_mastery_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'routine_complexity_readiness',
    text: 'Pronto para maior complexidade: pode lidar com rotinas de 10-12 atividades sem perda de performance.',
    context: ['complexity_readiness_achieved'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'complexity_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'generalization_skills_emerging',
    text: 'Habilidades de generalização emergindo: aplicação de rotinas em novos contextos (escola, casa de familiares).',
    context: ['generalization_visible'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'generalization_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'self_advocacy_development',
    text: 'Auto-advocacia se desenvolvendo: criança expressa preferências e limites de forma mais clara.',
    context: ['self_advocacy_emerging'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'advocacy_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'routine_innovation_suggestions',
    text: 'Sugestões de inovação: introduzir "tempo livre estruturado" para fomentar criatividade dentro da previsibilidade.',
    context: ['innovation_opportunity'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'innovation_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'long_term_development_trajectory',
    text: 'Trajetória de longo prazo positiva: marcos de desenvolvimento atingidos 6 meses antes do esperado.',
    context: ['long_term_success_indicators'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'long_term_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'peer_comparison_positive',
    text: 'Comparação com pares TEA: 90th percentil em organização, 85th em independência, 80th em flexibilidade.',
    context: ['peer_comparison_available'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'peer_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'routine_mastery_achievement',
    text: 'Maestria em rotinas atingida: criança pode co-criar e modificar rotinas com mínima supervisão.',
    context: ['mastery_level_achieved'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'mastery_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'transition_to_adolescence_prep',
    text: 'Preparação para adolescência: habilidades de autogestão sólidas facilitarão transições futuras.',
    context: ['adolescence_prep_relevant'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'future_planning_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'family_system_optimization',
    text: 'Sistema familiar otimizado: todos os membros reportam redução de stress e aumento de previsibilidade.',
    context: ['family_system_improved'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'family_system_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'routine_art_form_achieved',
    text: 'Rotina como forma de arte: equilíbrio perfeito entre estrutura e flexibilidade, previsibilidade e novidade.',
    context: ['routine_artistry_achieved'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'artistry_analysis',
    category: 'insight',
    priority: 'low'
  },
  {
    id: 'expertise_level_recognition',
    text: 'Nível de expertise reconhecido: você poderia mentorear outras famílias no desenvolvimento de rotinas.',
    context: ['expertise_level_achieved'],
    userMode: 'parent',
    progressLevel: 'expert',
    trigger: 'expertise_recognition',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'predictive_success_high_confidence',
    text: 'Confiança preditiva alta: 95% de certeza que habilidades desenvolvidas persistirão longo prazo.',
    context: ['predictive_confidence_high'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'prediction_confidence_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'routine_legacy_building',
    text: 'Construindo legado: habilidades organizacionais se tornarão base para sucesso acadêmico e profissional futuro.',
    context: ['legacy_building_visible'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'legacy_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'neuroplasticity_evidence',
    text: 'Evidência de neuroplasticidade: padrões cerebrais se reorganizaram para maior eficiência executiva.',
    context: ['neuroplasticity_indicators'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'neuroplasticity_analysis',
    category: 'insight',
    priority: 'low'
  },
  {
    id: 'routine_ecosystem_mastery',
    text: 'Ecossistema de rotinas dominado: home, escola, terapias integradas em sistema coeso e flexível.',
    context: ['ecosystem_integration_complete'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'ecosystem_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'advanced_self_regulation',
    text: 'Autorregulação avançada: criança monitora próprio estado emocional e ajusta rotina autonomamente.',
    context: ['advanced_self_regulation_visible'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'self_regulation_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'innovation_in_routine_design',
    text: 'Inovação em design de rotinas: vocês criaram soluções únicas que outros poderiam beneficiar.',
    context: ['innovation_demonstrated'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'innovation_recognition',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'mastery_plateau_achieved',
    text: 'Platô de maestria atingido: performance consistentemente alta, pronta para novos desafios.',
    context: ['mastery_plateau_reached'],
    userMode: 'parent',
    progressLevel: 'expert',
    trigger: 'plateau_analysis',
    category: 'insight',
    priority: 'medium'
  },
  {
    id: 'routine_wisdom_development',
    text: 'Sabedoria em rotinas desenvolvida: intuição sobre o que funciona superou necessidade de orientação externa.',
    context: ['wisdom_level_achieved'],
    userMode: 'parent',
    progressLevel: 'expert',
    trigger: 'wisdom_analysis',
    category: 'insight',
    priority: 'high'
  },
  {
    id: 'child_expert_level_celebration',
    text: 'Você virou um expert em sua própria rotina! Agora você ensina o Leo sobre o que funciona melhor!',
    context: ['child_expertise_achieved'],
    userMode: 'child',
    progressLevel: 'advanced',
    trigger: 'child_expertise_recognition',
    category: 'motivation',
    priority: 'high'
  },
  {
    id: 'child_routine_artist',
    text: 'Você é um artista das rotinas! Cada dia você pinta sua rotina com cores diferentes e especiais!',
    context: ['child_routine_creativity'],
    userMode: 'child',
    progressLevel: 'advanced',
    trigger: 'child_creativity_recognition',
    category: 'motivation',
    priority: 'medium'
  },

  // ===== TROUBLESHOOTING (25 mensagens) =====
  {
    id: 'app_loading_slow',
    text: 'App carregando devagar? Tente fechar outros aplicativos ou reiniciar o navegador.',
    context: ['performance_issues'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'slow_loading_detected',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'sound_not_working',
    text: 'Não está ouvindo minha voz? Verifique se o volume está ligado e se não ativou o modo silencioso.',
    context: ['audio_issues'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'audio_problem_detected',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'data_not_saving',
    text: 'Rotina não está salvando? Verifique sua conexão com internet e tente salvar novamente.',
    context: ['save_issues'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'save_failure_detected',
    category: 'troubleshooting',
    priority: 'high'
  },
  {
    id: 'child_resistance_initial',
    text: 'Criança resistindo à rotina? É normal no início. Comece com 2-3 atividades favoritas.',
    context: ['child_resistance'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'resistance_pattern',
    category: 'troubleshooting',
    priority: 'high'
  },
  {
    id: 'routine_too_complex',
    text: 'Rotina muito complexa? Simplifique para 4-5 atividades essenciais e aumente gradualmente.',
    context: ['complexity_overwhelm'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'overwhelm_detected',
    category: 'troubleshooting',
    priority: 'high'
  },
  {
    id: 'time_management_issues',
    text: 'Horários não funcionando? Crianças TEA se beneficiam de intervalos de 15-30 minutos entre atividades.',
    context: ['timing_problems'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'timing_issues_detected',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'motivation_drop',
    text: 'Motivação em queda? Introduza uma atividade nova e prazerosa para renovar o interesse.',
    context: ['engagement_drop'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'motivation_decline',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'weekend_routine_disruption',
    text: 'Fins de semana bagunçam a rotina? Mantenha 2-3 atividades-âncora (refeições, sono) mesmo no weekend.',
    context: ['weekend_problems'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'weekend_disruption',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'school_routine_conflict',
    text: 'Conflito entre rotina escolar e doméstica? Sincronize horários de refeições e sono.',
    context: ['school_conflict'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'school_home_mismatch',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'seasonal_adjustment_needed',
    text: 'Mudança de estação afetando rotina? Ajuste horários gradualmente (15 min por dia).',
    context: ['seasonal_disruption'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'seasonal_impact',
    category: 'troubleshooting',
    priority: 'low'
  },
  {
    id: 'sibling_interference',
    text: 'Irmãos interferindo na rotina? Crie atividades paralelas ou momentos individuais.',
    context: ['sibling_issues'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'sibling_disruption',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'regression_after_progress',
    text: 'Regressão após progresso é normal. Volte ao nível anterior por alguns dias antes de avançar.',
    context: ['regression_detected'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'performance_regression',
    category: 'troubleshooting',
    priority: 'high'
  },
  {
    id: 'overstimulation_signs',
    text: 'Sinais de sobreestimulação? Reduza atividades simultâneas e aumente pausas sensoriais.',
    context: ['overstimulation_detected'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'sensory_overload',
    category: 'troubleshooting',
    priority: 'high'
  },
  {
    id: 'routine_rigidity_excessive',
    text: 'Rotina muito rígida? Introduza "flexibilidade planejada" - 1 elemento que pode mudar diariamente.',
    context: ['excessive_rigidity'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'rigidity_concern',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'transition_anxiety_management',
    text: 'Ansiedade nas transições? Use timer visual e avisos de 5-2-1 minutos antes da mudança.',
    context: ['transition_anxiety'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'transition_stress',
    category: 'troubleshooting',
    priority: 'high'
  },
  {
    id: 'perfectionism_paralysis',
    text: 'Perfeccionismo paralisando? Celebre "quase feito" e "tentativa" tanto quanto "perfeito".',
    context: ['perfectionism_detected'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'perfectionist_paralysis',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'routine_dependence_concern',
    text: 'Preocupado com dependência da rotina? Introduza micro-variações para manter flexibilidade cognitiva.',
    context: ['dependence_concern'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'dependence_worry',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'social_situation_adaptation',
    text: 'Dificuldade em adaptar rotina a situações sociais? Crie "rotina portátil" com 3 elementos essenciais.',
    context: ['social_adaptation_issues'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'social_challenge',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'technology_overwhelming',
    text: 'App muito complexo? Use modo simplificado: foque apenas em adicionar e completar atividades.',
    context: ['technology_overwhelm'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'tech_confusion',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'family_consistency_issues',
    text: 'Família inconsistente com rotina? Estabeleça 3 regras não-negociáveis que todos seguem.',
    context: ['family_inconsistency'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'consistency_problems',
    category: 'troubleshooting',
    priority: 'high'
  },
  {
    id: 'emergency_routine_disruption',
    text: 'Emergência disruptiva? Mantenha pelo menos horário de refeições e sono. Reconstrua gradualmente.',
    context: ['emergency_disruption'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'emergency_impact',
    category: 'troubleshooting',
    priority: 'high'
  },
  {
    id: 'plateau_in_progress',
    text: 'Estagnação no progresso? Normal após crescimento rápido. Mantenha estabilidade, crescimento virá.',
    context: ['progress_plateau'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'plateau_frustration',
    category: 'troubleshooting',
    priority: 'medium'
  },
  {
    id: 'burnout_prevention',
    text: 'Sinais de burnout familiar? Simplifique rotina por 1 semana, foque apenas no essencial.',
    context: ['burnout_risk'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'burnout_detection',
    category: 'troubleshooting',
    priority: 'high'
  },
  {
    id: 'app_reset_needed',
    text: 'Problemas persistentes? Às vezes um reset completo ajuda. Dados importantes ficarão salvos.',
    context: ['persistent_issues'],
    userMode: 'parent',
    progressLevel: 'beginner',
    trigger: 'multiple_problems',
    category: 'troubleshooting',
    priority: 'low'
  },
  {
    id: 'professional_consultation_suggestion',
    text: 'Desafios complexos persistindo? Considere consultar terapeuta ocupacional especializado em rotinas.',
    context: ['complex_challenges'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'professional_help_needed',
    category: 'troubleshooting',
    priority: 'medium'
  },
  
  // ===== MOTIVAÇÃO (10 mensagens adicionais) =====
  {
    id: 'child_motivation_morning',
    text: 'Bom dia! Um novo dia começa e você está pronto para mais aventuras na sua rotina!',
    context: ['morning_time', 'child_mode'],
    userMode: 'child',
    progressLevel: 'beginner',
    trigger: 'morning_greeting',
    category: 'motivation',
    priority: 'medium'
  },
  {
    id: 'child_motivation_afternoon',
    text: 'Tarde maravilhosa! Você está indo muito bem com suas atividades hoje!',
    context: ['afternoon_time', 'child_mode'],
    userMode: 'child',
    progressLevel: 'beginner',
    trigger: 'afternoon_check',
    category: 'motivation',
    priority: 'medium'
  },
  {
    id: 'child_motivation_evening',
    text: 'Noite chegando! Você foi incrível hoje completando suas tarefas. Hora de descansar!',
    context: ['evening_time', 'child_mode'],
    userMode: 'child',
    progressLevel: 'beginner',
    trigger: 'evening_completion',
    category: 'motivation',
    priority: 'medium'
  },
  {
    id: 'child_encouragement_stars',
    text: 'Quanto mais estrelas você ganha, mais forte fica nosso poder de amizade!',
    context: ['child_mode', 'stars_gained'],
    userMode: 'child',
    progressLevel: 'intermediate',
    trigger: 'star_collection',
    category: 'motivation',
    priority: 'medium'
  },
  {
    id: 'child_challenge_complete',
    text: 'Desafio completo! Você é um verdadeiro herói das rotinas!',
    context: ['child_mode', 'challenge_completed'],
    userMode: 'child',
    progressLevel: 'intermediate',
    trigger: 'challenge_success',
    category: 'motivation',
    priority: 'high'
  },
  {
    id: 'parent_motivation_streak',
    text: 'Uma semana de rotinas consistentes! Sua dedicação está fazendo uma diferença real no desenvolvimento.',
    context: ['week_streak'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'weekly_streak',
    category: 'motivation',
    priority: 'high'
  },
  {
    id: 'parent_motivation_resilience',
    text: 'Mesmo com os desafios, vocês continuam avançando. Resiliência é a chave do sucesso!',
    context: ['overcome_difficulty'],
    userMode: 'parent',
    progressLevel: 'intermediate',
    trigger: 'resilience_shown',
    category: 'motivation',
    priority: 'high'
  },
  {
    id: 'parent_motivation_child_progress',
    text: 'O progresso do seu filho é visível! Cada pequeno avanço constrói a base para o futuro.',
    context: ['child_development_jump'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'development_milestone',
    category: 'motivation',
    priority: 'high'
  },
  {
    id: 'parent_motivation_family_harmony',
    text: 'A harmonia familiar está aumentando! Rotinas consistentes criam um ambiente mais tranquilo para todos.',
    context: ['family_harmony_improving'],
    userMode: 'parent',
    progressLevel: 'advanced',
    trigger: 'harmony_detected',
    category: 'motivation',
    priority: 'medium'
  },
  {
    id: 'parent_motivation_expertise',
    text: 'Você se tornou um especialista em rotinas! Sua intuição sobre o que funciona é impressionante.',
    context: ['parent_expertise_evident'],
    userMode: 'parent',
    progressLevel: 'expert',
    trigger: 'expertise_recognition',
    category: 'motivation',
    priority: 'high'
  }
];

// Sistema de contexto para determinar qual mensagem usar
export interface UserContext {
  userMode: 'parent' | 'child';
  progressLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  totalTasks: number;
  completionRate: number;
  streakDays: number;
  level: number;
  stars: number;
  daysUsing: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  lastInteraction: Date;
  recentActions: string[];
  problemIndicators: string[];
  achievements: string[];
  currentScreen: string;
  hasCompletedTutorial: boolean;
}

// Função para selecionar mensagem contextual apropriada
export function selectContextualMessage(
  userContext: UserContext,
  trigger: string,
  availableMessages?: ContextualMessage[]
): ContextualMessage | null {
  
  const messages = availableMessages || LEO_CONTEXTUAL_MESSAGES;
  
  // Filtrar mensagens por contexto do usuário
  const relevantMessages = messages.filter(message => {
    // Verificar modo de usuário
    if (message.userMode !== 'both' && message.userMode !== userContext.userMode) {
      return false;
    }
    
    // Verificar nível de progresso
    if (message.progressLevel !== userContext.progressLevel) {
      return false;
    }
    
    // Verificar trigger
    if (message.trigger !== trigger) {
      return false;
    }
    
    return true;
  });
  
  if (relevantMessages.length === 0) {
    return null;
  }
  
  // Ordenar por prioridade e selecionar o melhor
  const sortedMessages = relevantMessages.sort((a, b) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
  
  return sortedMessages[0];
}

// Função para determinar nível de progresso baseado em métricas
export function calculateProgressLevel(userContext: UserContext): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  const {
    totalTasks,
    completionRate,
    streakDays,
    level,
    daysUsing
  } = userContext;
  
  // Lógica para determinar nível
  if (totalTasks < 10 || level < 2 || daysUsing < 7) {
    return 'beginner';
  }
  
  if (totalTasks < 50 || level < 5 || streakDays < 7 || completionRate < 70) {
    return 'intermediate';
  }
  
  if (totalTasks < 200 || level < 10 || streakDays < 30 || completionRate < 85) {
    return 'advanced';
  }
  
  return 'expert';
}

// Cooldown para evitar spam de mensagens
const messageCooldowns = new Map<string, number>();

export function isMessageOnCooldown(messageId: string): boolean {
  const cooldownTime = messageCooldowns.get(messageId);
  if (!cooldownTime) return false;
  
  return Date.now() - cooldownTime < (5 * 60 * 1000); // 5 minutos padrão
}

export function setMessageCooldown(messageId: string): void {
  messageCooldowns.set(messageId, Date.now());
}

// Implementação concreta da interface LeoContextualInterface
export class LeoContextualSystem implements LeoContextualInterface {
  private userContext: UserContext;
  private currentMessage: ContextualMessage | null = null;
  private messageHistory: ContextualMessage[] = [];
  private maxHistoryLength = 10;
  
  constructor(initialContext: UserContext) {
    this.userContext = { ...initialContext };
  }
  
  getCurrentMessage(): string {
    if (!this.currentMessage) {
      // Se não houver mensagem atual, tentar encontrar uma mensagem padrão
      const defaultMessage = selectContextualMessage(
        this.userContext,
        'app_start'
      );
      
      if (defaultMessage) {
        this.currentMessage = defaultMessage;
        this.addToHistory(defaultMessage);
        setMessageCooldown(defaultMessage.id);
      } else {
        return "Olá! Eu sou o Leo, seu assistente de rotinas!";
      }
    }
    
    return this.currentMessage.text;
  }
  
  getMenuOptions(): Array<{
    id: string;
    text: string;
    icon: string;
    action: () => void;
  }> {
    const baseOptions = [
      {
        id: 'help',
        text: 'Ajuda',
        icon: 'help_outline',
        action: () => this.showMessageForTrigger('help_requested')
      },
      {
        id: 'tips',
        text: 'Dicas',
        icon: 'lightbulb',
        action: () => this.showMessageForTrigger('tips_requested')
      },
      {
        id: 'progress',
        text: 'Meu Progresso',
        icon: 'trending_up',
        action: () => this.showMessageForTrigger('progress_requested')
      }
    ];
    
    // Adicionar opções específicas baseadas no contexto
    if (this.userContext.userMode === 'parent') {
      baseOptions.push({
        id: 'analytics',
        text: 'Análises',
        icon: 'analytics',
        action: () => this.showMessageForTrigger('analytics_requested')
      });
    }
    
    if (this.userContext.progressLevel === 'beginner') {
      baseOptions.push({
        id: 'tutorial',
        text: 'Tutorial',
        icon: 'school',
        action: () => this.showMessageForTrigger('tutorial_requested')
      });
    }
    
    return baseOptions;
  }
  
  handleUserClick(option: string): void {
    // Encontrar a opção correspondente e executar a ação
    const menuOption = this.getMenuOptions().find(opt => opt.id === option);
    if (menuOption) {
      menuOption.action();
    }
  }
  
  updateContext(newContext: Partial<UserContext>): void {
    this.userContext = { ...this.userContext, ...newContext };
    
    // Verificar se o nível de progresso mudou
    const newProgressLevel = calculateProgressLevel(this.userContext);
    if (newProgressLevel !== this.userContext.progressLevel) {
      this.userContext.progressLevel = newProgressLevel;
      this.showMessageForTrigger('level_changed');
    }
  }
  
  // Métodos auxiliares
  private showMessageForTrigger(trigger: string): void {
    const message = selectContextualMessage(this.userContext, trigger);
    if (message && !isMessageOnCooldown(message.id)) {
      this.currentMessage = message;
      this.addToHistory(message);
      setMessageCooldown(message.id);
    }
  }
  
  private addToHistory(message: ContextualMessage): void {
    this.messageHistory.unshift(message);
    if (this.messageHistory.length > this.maxHistoryLength) {
      this.messageHistory.pop();
    }
  }
  
  // Métodos públicos para interação avançada
  public triggerContextMessage(context: string[]): void {
    const matchingMessages = LEO_CONTEXTUAL_MESSAGES.filter(msg => {
      return (
        (msg.userMode === 'both' || msg.userMode === this.userContext.userMode) &&
        msg.progressLevel === this.userContext.progressLevel &&
        context.every(ctx => msg.context.includes(ctx))
      );
    });
    
    if (matchingMessages.length > 0) {
      // Ordenar por prioridade
      const sortedMessages = matchingMessages.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      
      const message = sortedMessages[0];
      if (!isMessageOnCooldown(message.id)) {
        this.currentMessage = message;
        this.addToHistory(message);
        setMessageCooldown(message.id);
      }
    }
  }
  
  public getMessageHistory(): ContextualMessage[] {
    return [...this.messageHistory];
  }
  
  public clearCurrentMessage(): void {
    this.currentMessage = null;
  }
  
  public resetCooldowns(): void {
    messageCooldowns.clear();
  }
}

// Função utilitária para criar um contexto inicial
export function createInitialContext(): UserContext {
  return {
    userMode: 'parent',
    progressLevel: 'beginner',
    totalTasks: 0,
    completionRate: 0,
    streakDays: 0,
    level: 1,
    stars: 0,
    daysUsing: 0,
    timeOfDay: 'morning',
    lastInteraction: new Date(),
    recentActions: [],
    problemIndicators: [],
    achievements: [],
    currentScreen: 'home',
    hasCompletedTutorial: false
  };
}

// Sistema de interface do Leo expandido
export interface LeoContextualInterface {
  getCurrentMessage(): string;
  getMenuOptions(): Array<{
    id: string;
    text: string;
    icon: string;
    action: () => void;
  }>;
  handleUserClick(option: string): void;
  updateContext(newContext: Partial<UserContext>): void;
}

export default LEO_CONTEXTUAL_MESSAGES;
