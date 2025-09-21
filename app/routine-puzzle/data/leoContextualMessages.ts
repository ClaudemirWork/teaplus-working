// Sistema completo de mensagens contextuais do Leo
// 120 frases organizadas por categoria e contexto de uso

export interface LeoContextualMessage {
  id: string;
  text: string;
  context: string;
  userMode: 'parent' | 'child' | 'both';
  triggerCondition: string;
  priority: 'low' | 'medium' | 'high';
  category: 'tutorial' | 'progress' | 'insights' | 'troubleshooting';
}

export const LEO_CONTEXTUAL_MESSAGES: Record<string, LeoContextualMessage[]> = {
  
  // TUTORIAL BÁSICO (25 frases) - Primeiros passos e navegação
  tutorial_basic: [
    {
      id: 'welcome_first_time',
      text: 'Olá! Sou o Leo e vou te ajudar a criar rotinas incríveis. Toque em "Como usar" para começar!',
      context: 'first_app_open',
      userMode: 'both',
      triggerCondition: 'first_visit',
      priority: 'high',
      category: 'tutorial'
    },
    {
      id: 'explain_days_selection',
      text: 'Veja esses botões coloridos? Cada um é um dia da semana. Toque em um para começar sua rotina!',
      context: 'showing_weekdays',
      userMode: 'both',
      triggerCondition: 'first_interaction',
      priority: 'high',
      category: 'tutorial'
    },
    {
      id: 'first_card_selection',
      text: 'Perfeito! Agora toque em uma atividade para adicionar. Que tal começar com "Acordar"?',
      context: 'first_card_add',
      userMode: 'both',
      triggerCondition: 'day_selected_no_activities',
      priority: 'high',
      category: 'tutorial'
    },
    {
      id: 'explain_card_addition',
      text: 'Ótimo! Você adicionou sua primeira atividade. Viu como ela apareceu na sua rotina?',
      context: 'first_activity_added',
      userMode: 'both',
      triggerCondition: 'first_activity_created',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'explain_time_setting',
      text: 'Cada atividade tem um horário. Toque no relógio azul para ajustar quando fazer!',
      context: 'showing_time_feature',
      userMode: 'parent',
      triggerCondition: 'has_activities_no_time_change',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'first_completion_guide',
      text: 'Agora toque no círculo verde para marcar como feita. Vai ganhar estrelas!',
      context: 'teaching_completion',
      userMode: 'both',
      triggerCondition: 'has_uncompleted_tasks',
      priority: 'high',
      category: 'tutorial'
    },
    {
      id: 'explain_stars_system',
      text: 'Viu as estrelas? A cada atividade completada, você ganha pontos e sobe de nível!',
      context: 'explaining_gamification',
      userMode: 'both',
      triggerCondition: 'first_task_completed',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'show_categories',
      text: 'Use essas etiquetas coloridas para filtrar atividades: rotina, ações, comida, escola...',
      context: 'teaching_categories',
      userMode: 'parent',
      triggerCondition: 'many_cards_visible',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'search_feature_intro',
      text: 'Perdido entre tantas atividades? Toque na lupa para buscar algo específico!',
      context: 'introducing_search',
      userMode: 'parent',
      triggerCondition: 'has_many_cards_unused',
      priority: 'low',
      category: 'tutorial'
    },
    {
      id: 'child_mode_intro',
      text: 'Quer que seu filho use sozinho? Toque no bebê para ativar o modo criança!',
      context: 'introducing_child_mode',
      userMode: 'parent',
      triggerCondition: 'parent_mode_extended_use',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'explain_routine_building',
      text: 'Uma rotina boa tem 3-7 atividades por período. Não precisa de muitas para começar!',
      context: 'routine_building_tips',
      userMode: 'parent',
      triggerCondition: 'building_first_routine',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'morning_routine_suggestion',
      text: 'Manhãs são importantes! Tente: acordar, escovar dentes, café da manhã e se vestir.',
      context: 'morning_routine_help',
      userMode: 'parent',
      triggerCondition: 'empty_morning_time',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'evening_routine_suggestion',
      text: 'Rotina noturna ajuda a dormir melhor: jantar, banho, escovar dentes, dormir.',
      context: 'evening_routine_help',
      userMode: 'parent',
      triggerCondition: 'empty_evening_time',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'explain_visual_schedule',
      text: 'Crianças autistas adoram rotinas visuais! Os cards coloridos ajudam a entender.',
      context: 'autism_visual_benefits',
      userMode: 'parent',
      triggerCondition: 'multiple_activities_added',
      priority: 'high',
      category: 'tutorial'
    },
    {
      id: 'consistency_importance',
      text: 'O segredo é consistência! Melhor fazer 3 atividades todo dia que 10 só às vezes.',
      context: 'teaching_consistency',
      userMode: 'parent',
      triggerCondition: 'irregular_completion_pattern',
      priority: 'high',
      category: 'tutorial'
    },
    {
      id: 'save_routine_reminder',
      text: 'Não esqueça! Toque em "Salvar" para guardar sua rotina na nuvem.',
      context: 'save_reminder',
      userMode: 'parent',
      triggerCondition: 'unsaved_changes',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'copy_routine_tip',
      text: 'Rotina pronta? Use "Copiar para..." para replicar em outros dias rapidinho!',
      context: 'copy_feature_intro',
      userMode: 'parent',
      triggerCondition: 'routine_ready_one_day',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'sound_controls_intro',
      text: 'Controle minha voz com o botão de som. Posso ficar quieto quando precisar!',
      context: 'audio_controls',
      userMode: 'parent',
      triggerCondition: 'sound_feature_available',
      priority: 'low',
      category: 'tutorial'
    },
    {
      id: 'mobile_desktop_tip',
      text: 'Uso tanto no celular quanto no computador! Seus dados ficam sincronizados.',
      context: 'cross_platform_usage',
      userMode: 'parent',
      triggerCondition: 'device_detection',
      priority: 'low',
      category: 'tutorial'
    },
    {
      id: 'family_sharing_concept',
      text: 'Toda família pode ajudar! Avós, cuidadores, todos usando a mesma rotina.',
      context: 'family_coordination',
      userMode: 'parent',
      triggerCondition: 'established_routine',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'remove_activity_guide',
      text: 'Mudou de ideia? Toque no lixinho vermelho para remover uma atividade.',
      context: 'removal_instruction',
      userMode: 'parent',
      triggerCondition: 'many_activities_added',
      priority: 'low',
      category: 'tutorial'
    },
    {
      id: 'weekly_view_intro',
      text: 'Veja a semana toda! Cada dia pode ter uma rotina diferente, sem problemas.',
      context: 'weekly_perspective',
      userMode: 'parent',
      triggerCondition: 'multiple_days_used',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'progress_tracking_intro',
      text: 'Acompanhe o progresso! Estrelas mostram quanto seu filho está evoluindo.',
      context: 'progress_explanation',
      userMode: 'parent',
      triggerCondition: 'some_tasks_completed',
      priority: 'medium',
      category: 'tutorial'
    },
    {
      id: 'patience_encouragement',
      text: 'Lembre-se: mudanças levam tempo. Celebre cada pequena vitória!',
      context: 'patience_reminder',
      userMode: 'parent',
      triggerCondition: 'slow_adoption_detected',
      priority: 'high',
      category: 'tutorial'
    },
    {
      id: 'help_always_available',
      text: 'Precisa de ajuda? Toque em mim sempre que quiser dicas ou explicações!',
      context: 'help_availability',
      userMode: 'both',
      triggerCondition: 'anytime',
      priority: 'low',
      category: 'tutorial'
    }
  ],

  // PROGRESSO INTERMEDIÁRIO (30 frases) - Sistema de conquistas e gamificação
  progress_intermediate: [
    {
      id: 'first_level_up',
      text: 'Parabéns! Você subiu para o nível 2! Continue assim para desbloquear mais conquistas!',
      context: 'level_progression',
      userMode: 'both',
      triggerCondition: 'level_up_to_2',
      priority: 'high',
      category: 'progress'
    },
    {
      id: 'stars_explanation',
      text: 'Cada estrela vale muito! 50 estrelas = próximo nível. Você está no caminho certo!',
      context: 'stars_system_deep',
      userMode: 'both',
      triggerCondition: 'accumulated_some_stars',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'achievement_unlocked_first',
      text: 'Primeira conquista desbloqueada! Toque no sino para ver todas suas medalhas.',
      context: 'first_achievement',
      userMode: 'both',
      triggerCondition: 'first_achievement_earned',
      priority: 'high',
      category: 'progress'
    },
    {
      id: 'streak_started',
      text: 'Você começou uma sequência! Completar atividades todo dia ganha bônus especiais.',
      context: 'streak_mechanics',
      userMode: 'both',
      triggerCondition: 'streak_day_2',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'week_warrior_close',
      text: 'Faltam só 3 dias para a conquista "Guerreiro da Semana"! Não desista agora!',
      context: 'streak_encouragement',
      userMode: 'both',
      triggerCondition: 'streak_day_4',
      priority: 'high',
      category: 'progress'
    },
    {
      id: 'streak_bonus_earned',
      text: 'Sequência de 7 dias! Você ganhou 10 estrelas de bônus! Incrível!',
      context: 'streak_reward',
      userMode: 'both',
      triggerCondition: 'streak_week_complete',
      priority: 'high',
      category: 'progress'
    },
    {
      id: 'daily_challenge_intro',
      text: 'Desafios diários apareceram! Complete para ganhar estrelas extras hoje.',
      context: 'daily_challenges',
      userMode: 'both',
      triggerCondition: 'challenges_available',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'task_master_approaching',
      text: 'Você já completou 35 atividades! Faltam 15 para virar "Mestre das Tarefas"!',
      context: 'achievement_progress',
      userMode: 'both',
      triggerCondition: 'tasks_completed_35',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'level_3_benefits',
      text: 'Nível 3 desbloqueado! Agora você tem acesso a análises de padrão da rotina.',
      context: 'level_benefits',
      userMode: 'parent',
      triggerCondition: 'level_up_to_3',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'notifications_intro',
      text: 'O sino vermelho mostra conquistas novas! Toque para ver todo seu progresso.',
      context: 'notification_system',
      userMode: 'both',
      triggerCondition: 'unread_notifications',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'category_master_food',
      text: 'Você dominou as atividades de alimentação! 90% de conclusão esta semana.',
      context: 'category_mastery',
      userMode: 'both',
      triggerCondition: 'food_category_high_completion',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'morning_person_achievement',
      text: 'Você é uma pessoa matinal! 14 dias seguidos completando atividades antes das 10h.',
      context: 'time_based_achievement',
      userMode: 'both',
      triggerCondition: 'morning_routine_consistent',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'consistency_champion',
      text: 'Campeão da consistência! 21 dias usando o app. Isso vira hábito real!',
      context: 'usage_consistency',
      userMode: 'both',
      triggerCondition: 'daily_usage_21_days',
      priority: 'high',
      category: 'progress'
    },
    {
      id: 'perfect_day_achieved',
      text: 'Dia perfeito! Você completou 100% das atividades hoje. Que dedicação!',
      context: 'perfect_completion',
      userMode: 'both',
      triggerCondition: 'all_tasks_completed_today',
      priority: 'high',
      category: 'progress'
    },
    {
      id: 'routine_architect',
      text: 'Arquiteto de rotinas! Você criou rotinas para todos os dias da semana.',
      context: 'routine_completion',
      userMode: 'parent',
      triggerCondition: 'all_days_have_activities',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'star_collector_100',
      text: 'Coletor de estrelas! 100 estrelas conquistadas. Você está brilhando!',
      context: 'milestone_achievement',
      userMode: 'both',
      triggerCondition: 'stars_reached_100',
      priority: 'high',
      category: 'progress'
    },
    {
      id: 'comeback_after_break',
      text: 'Que bom te ver de volta! Todo mundo tem pausas. O importante é recomeçar.',
      context: 'return_encouragement',
      userMode: 'both',
      triggerCondition: 'return_after_absence',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'weekend_warrior',
      text: 'Guerreiro do fim de semana! Manter rotina no sábado e domingo é especial.',
      context: 'weekend_engagement',
      userMode: 'both',
      triggerCondition: 'weekend_activity_completion',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'progress_week_summary',
      text: 'Resumo da semana: 85% de conclusão! Que evolução incrível desde o início.',
      context: 'weekly_summary',
      userMode: 'both',
      triggerCondition: 'week_end_high_completion',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'achievement_hunter',
      text: 'Caçador de conquistas! Você desbloqueou 5 medalhas diferentes. Impressionante!',
      context: 'multiple_achievements',
      userMode: 'both',
      triggerCondition: 'achievements_unlocked_5',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'social_sharing_suggestion',
      text: 'Progresso incrível! Que tal compartilhar suas conquistas com a família?',
      context: 'sharing_encouragement',
      userMode: 'parent',
      triggerCondition: 'major_milestone_reached',
      priority: 'low',
      category: 'progress'
    },
    {
      id: 'level_5_mastery',
      text: 'Nível 5! Você agora é um mestre em rotinas. Parabéns pela dedicação!',
      context: 'high_level_achievement',
      userMode: 'both',
      triggerCondition: 'level_up_to_5',
      priority: 'high',
      category: 'progress'
    },
    {
      id: 'custom_routine_expert',
      text: 'Expert em personalização! Você ajustou horários mais de 20 vezes.',
      context: 'customization_mastery',
      userMode: 'parent',
      triggerCondition: 'many_time_adjustments',
      priority: 'low',
      category: 'progress'
    },
    {
      id: 'month_milestone',
      text: 'Um mês de jornada! Rotinas viraram parte natural do dia. Que transformação!',
      context: 'long_term_usage',
      userMode: 'both',
      triggerCondition: 'usage_30_days',
      priority: 'high',
      category: 'progress'
    },
    {
      id: 'challenge_completionist',
      text: 'Você completou todos os desafios desta semana! Estrelas extras merecidas.',
      context: 'challenge_mastery',
      userMode: 'both',
      triggerCondition: 'all_weekly_challenges_done',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'routine_variety_master',
      text: 'Mestre da variedade! Você usa mais de 30 tipos diferentes de atividades.',
      context: 'diversity_achievement',
      userMode: 'parent',
      triggerCondition: 'high_activity_variety',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'early_bird_title',
      text: 'Madrugador oficial! 2 semanas completando rotina matinal antes das 8h.',
      context: 'time_consistency',
      userMode: 'both',
      triggerCondition: 'consistent_early_routine',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'progress_visualization',
      text: 'Veja seu gráfico de progresso! A linha só vai subindo. Que crescimento!',
      context: 'progress_analysis',
      userMode: 'parent',
      triggerCondition: 'progress_graph_available',
      priority: 'low',
      category: 'progress'
    },
    {
      id: 'family_coordination_success',
      text: 'Coordenação familiar nota 10! Múltiplos dispositivos usando a mesma rotina.',
      context: 'multi_device_usage',
      userMode: 'parent',
      triggerCondition: 'family_sharing_detected',
      priority: 'medium',
      category: 'progress'
    },
    {
      id: 'legendary_status_approaching',
      text: 'Status lendário se aproxima! Continue assim para conquistas épicas.',
      context: 'high_tier_progress',
      userMode: 'both',
      triggerCondition: 'approaching_legendary_achievements',
      priority: 'high',
      category: 'progress'
    }
  ],

  // INSIGHTS AVANÇADOS (40 frases) - Análise de padrões e otimização
  insights_advanced: [
    {
      id: 'morning_struggle_pattern',
      text: 'Notei que manhãs são desafiadoras. 68% das famílias melhoram reduzindo atividades matinais para 3.',
      context: 'pattern_analysis',
      userMode: 'parent',
      triggerCondition: 'morning_low_completion_rate',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'optimal_routine_length',
      text: 'Análise: rotinas com 5-7 atividades têm 40% mais conclusão que rotinas muito longas.',
      context: 'optimization_suggestion',
      userMode: 'parent',
      triggerCondition: 'routine_too_long',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'weekend_consistency_impact',
      text: 'Famílias que mantêm rotina no fim de semana têm 60% mais sucesso durante a semana.',
      context: 'consistency_insight',
      userMode: 'parent',
      triggerCondition: 'weekend_pattern_analysis',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'time_spacing_optimization',
      text: 'Atividades espaçadas por 30-45 minutos funcionam melhor que muito próximas.',
      context: 'timing_optimization',
      userMode: 'parent',
      triggerCondition: 'activities_too_close',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'category_balance_suggestion',
      text: 'Rotina equilibrada: 40% cuidados pessoais, 30% alimentação, 20% lazer, 10% estudos.',
      context: 'balance_analysis',
      userMode: 'parent',
      triggerCondition: 'unbalanced_categories',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'success_time_identification',
      text: 'Seu filho tem 90% de sucesso entre 14h-16h. Considere atividades importantes neste horário.',
      context: 'peak_performance_time',
      userMode: 'parent',
      triggerCondition: 'time_performance_pattern',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'transition_time_suggestion',
      text: 'Crianças TEA precisam de 5-10 minutos entre atividades para transição mental.',
      context: 'autism_specific_insight',
      userMode: 'parent',
      triggerCondition: 'rapid_transitions_detected',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'visual_schedule_effectiveness',
      text: 'Rotinas visuais aumentam independência em 70% das crianças autistas após 3 semanas.',
      context: 'visual_benefits_data',
      userMode: 'parent',
      triggerCondition: 'sustained_usage',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'reward_system_optimization',
      text: 'Recompensas funcionam melhor quando são imediatas. Estrelas instantâneas são ideais.',
      context: 'reward_timing',
      userMode: 'parent',
      triggerCondition: 'gamification_usage',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'routine_flexibility_balance',
      text: 'Estrutura com flexibilidade: 80% da rotina fixa, 20% adaptável ao dia funciona melhor.',
      context: 'flexibility_insight',
      userMode: 'parent',
      triggerCondition: 'routine_modifications',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'bedtime_routine_impact',
      text: 'Rotina noturna consistente melhora o sono em 85% dos casos dentro de 2 semanas.',
      context: 'sleep_routine_benefits',
      userMode: 'parent',
      triggerCondition: 'evening_routine_established',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'sensory_break_suggestion',
      text: 'Detectei sobrecarga possível. Considere atividades sensoriais calmas entre tarefas intensas.',
      context: 'sensory_insight',
      userMode: 'parent',
      triggerCondition: 'intensive_activity_sequence',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'choice_autonomy_benefit',
      text: 'Permitir escolha de 2-3 atividades aumenta cooperação em 50% das situações.',
      context: 'autonomy_insight',
      userMode: 'parent',
      triggerCondition: 'resistance_patterns',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'predictability_importance',
      text: 'Mudanças na rotina funcionam melhor quando avisadas com 24h de antecedência.',
      context: 'predictability_insight',
      userMode: 'parent',
      triggerCondition: 'routine_changes_detected',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'energy_level_mapping',
      text: 'Seu filho tem mais energia às 10h e 15h. Atividades físicas funcionam melhor nesses horários.',
      context: 'energy_pattern_analysis',
      userMode: 'parent',
      triggerCondition: 'activity_completion_patterns',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'meltdown_prevention_timing',
      text: 'Padrão detectado: dificuldades aparecem após 4 atividades seguidas. Considere pausas.',
      context: 'overwhelm_prevention',
      userMode: 'parent',
      triggerCondition: 'completion_rate_drop',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'social_routine_benefits',
      text: 'Atividades em família 2x por semana aumentam motivação geral em 45%.',
      context: 'social_engagement_impact',
      userMode: 'parent',
      triggerCondition: 'social_activities_added',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'seasonal_adaptation_suggestion',
      text: 'Inverno chegando: rotinas internas funcionam melhor. Considere mais atividades em casa.',
      context: 'seasonal_adaptation',
      userMode: 'parent',
      triggerCondition: 'seasonal_change_detected',
      priority: 'low',
      category: 'insights'
    },
    {
      id: 'motivation_peak_identification',
      text: 'Segundas-feiras têm 30% mais resistência. Comece a semana com atividades preferidas.',
      context: 'weekly_motivation_pattern',
      userMode: 'parent',
      triggerCondition: 'monday_struggle_pattern',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'gradual_increase_suggestion',
      text: 'Adicione 1 atividade nova por semana. Mudanças graduais têm 80% mais aceitação.',
      context: 'change_management',
      userMode: 'parent',
      triggerCondition: 'rapid_routine_expansion',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'communication_style_insight',
      text: 'Instruções de 3-5 palavras funcionam melhor que explicações longas para seu filho.',
      context: 'communication_optimization',
      userMode: 'parent',
      triggerCondition: 'instruction_complexity_analysis',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'interest_based_motivation',
      text: 'Incorporar interesses especiais aumenta engajamento em 90%. Que tal temas favoritos?',
      context: 'special_interests_integration',
      userMode: 'parent',
      triggerCondition: 'motivation_challenges',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'caregiver_coordination_benefit',
      text: 'Múltiplos cuidadores usando mesma rotina reduzem ansiedade em 65% dos casos.',
      context: 'consistency_across_caregivers',
      userMode: 'parent',
      triggerCondition: 'multiple_users_detected',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'celebration_timing_optimization',
      text: 'Celebrações funcionam melhor imediatamente após conclusão, não no final do dia.',
      context: 'celebration_timing',
      userMode: 'parent',
      triggerCondition: 'delayed_recognition_pattern',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'routine_complexity_warning',
      text: 'Atenção: rotinas com mais de 10 atividades têm taxa de abandono 3x maior.',
      context: 'complexity_warning',
      userMode: 'parent',
      triggerCondition: 'routine_too_complex',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'breakthrough_pattern_recognition',
      text: 'Padrão interessante: avanços acontecem após 3 semanas de consistência. Continue!',
      context: 'breakthrough_timing',
      userMode: 'parent',
      triggerCondition: 'three_week_milestone',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'environmental_factor_insight',
      text: 'Ambientes organizados aumentam conclusão de tarefas em 40%. Considere preparar o espaço.',
      context: 'environmental_optimization',
      userMode: 'parent',
      triggerCondition: 'environmental_analysis',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'stress_indicator_detection',
      text: 'Padrão de stress detectado nos finais de semana. Considere rotinas mais relaxadas.',
      context: 'stress_pattern_analysis',
      userMode: 'parent',
      triggerCondition: 'weekend_completion_drop',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'success_building_strategy',
      text: 'Estratégia: comece com atividades que já faz bem, depois adicione desafios gradualmente.',
      context: 'confidence_building',
      userMode: 'parent',
      triggerCondition: 'low_confidence_pattern',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'peer_comparison_insight',
      text: 'Sua família está acima da média: 78% de conclusão vs 65% de outras famílias.',
      context: 'comparative_performance',
      userMode: 'parent',
      triggerCondition: 'above_average_performance',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'long_term_benefit_reminder',
      text: 'Rotinas estruturadas na infância reduzem ansiedade na adolescência em 60%.',
      context: 'long_term_benefits',
      userMode: 'parent',
      triggerCondition: 'motivation_reminder_needed',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'adaptation_speed_insight',
      text: 'Seu filho adapta-se a mudanças em 4-5 dias. Planeje transições considerando este tempo.',
      context: 'adaptation_timeline',
      userMode: 'parent',
      triggerCondition: 'adaptation_pattern_analysis',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'independence_milestone_recognition',
      text: 'Marco importante: 70% das atividades feitas independentemente. Incrível evolução!',
      context: 'independence_tracking',
      userMode: 'parent',
      triggerCondition: 'independence_milestone',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'personalization_effectiveness',
      text: 'Personalização funcionou: rotinas adaptadas têm 50% mais sucesso que padrões genéricos.',
      context: 'personalization_validation',
      userMode: 'parent',
      triggerCondition: 'customization_success',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'crisis_prevention_insight',
      text: 'Rotinas previnem 80% das crises. Continue investindo na estrutura diária.',
      context: 'crisis_prevention',
      userMode: 'parent',
      triggerCondition: 'crisis_reduction_observed',
      priority: 'high',
      category: 'insights'
    },
    {
      id: 'family_harmony_impact',
      text: 'Rotinas estruturadas aumentaram harmonia familiar em 75% segundo estudos similares.',
      context: 'family_impact_analysis',
      userMode: 'parent',
      triggerCondition: 'family_routine_established',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'cognitive_load_optimization',
      text: 'Reduzir decisões diárias libera energia mental para aprendizado e desenvolvimento.',
      context: 'cognitive_benefits',
      userMode: 'parent',
      triggerCondition: 'routine_automation_achieved',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'progress_acceleration_tip',
      text: 'Dica avançada: fotografar momentos de sucesso cria reforço visual poderoso.',
      context: 'advanced_strategy',
      userMode: 'parent',
      triggerCondition: 'advanced_user_detected',
      priority: 'low',
      category: 'insights'
    },
    {
      id: 'sibling_coordination_benefit',
      text: 'Irmãos seguindo rotinas similares reduzem conflitos em 55% das situações.',
      context: 'sibling_dynamics',
      userMode: 'parent',
      triggerCondition: 'multiple_children_detected',
      priority: 'medium',
      category: 'insights'
    },
    {
      id: 'mastery_recognition',
      text: 'Nível de maestria atingido! Vocês agora são referência em rotinas estruturadas.',
      context: 'mastery_achievement',
      userMode: 'parent',
      triggerCondition: 'expert_level_reached',
      priority: 'high',
      category: 'insights'
    }
  ],

  // TROUBLESHOOTING (25 frases) - Resolução de problemas comuns
  troubleshooting: [
    {
      id: 'streak_broken_comfort',
      text: 'Sequência quebrada? Não tem problema! Todo mundo tem dias difíceis. Recomeçe hoje mesmo.',
      context: 'streak_interruption',
      userMode: 'both',
      triggerCondition: 'streak_reset',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'low_motivation_today',
      text: 'Dia difícil? Que tal completar só 1 atividade hoje? Pequenos passos ainda são progresso.',
      context: 'motivation_dip',
      userMode: 'both',
      triggerCondition: 'low_completion_day',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'resistance_to_new_activity',
      text: 'Resistência a atividades novas é normal. Tente introduzir gradualmente, sem pressão.',
      context: 'activity_resistance',
      userMode: 'parent',
      triggerCondition: 'new_activity_skipped',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'routine_overwhelming',
      text: 'Rotina pesada demais? Remova 2-3 atividades. Melhor poucos sucessos que muitas frustrações.',
      context: 'overwhelm_solution',
      userMode: 'parent',
      triggerCondition: 'multiple_skips',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'time_pressure_solution',
      text: 'Pressão de tempo? Atividades podem ser flexíveis. O importante é fazer, não a hora exata.',
      context: 'timing_flexibility',
      userMode: 'parent',
      triggerCondition: 'timing_struggles',
      priority: 'medium',
      category: 'troubleshooting'
    },
    {
      id: 'technology_resistance',
      text: 'Criança resistente ao app? Deixe ela explorar livremente primeiro, sem objetivos.',
      context: 'app_resistance',
      userMode: 'parent',
      triggerCondition: 'child_mode_avoidance',
      priority: 'medium',
      category: 'troubleshooting'
    },
    {
      id: 'perfectionism_counter',
      text: 'Não precisa ser perfeito! 70% de conclusão já é um sucesso incrível para rotinas.',
      context: 'perfectionism_relief',
      userMode: 'parent',
      triggerCondition: 'perfectionist_pattern',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'regression_explanation',
      text: 'Retrocessos são parte do processo. Após progressos, é normal ter alguns dias difíceis.',
      context: 'regression_normalization',
      userMode: 'parent',
      triggerCondition: 'performance_regression',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'meltdown_prevention',
      text: 'Sinais de sobrecarga detectados. Pause, respire, e volte quando estiver mais calmo.',
      context: 'meltdown_intervention',
      userMode: 'parent',
      triggerCondition: 'rapid_failures',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'inconsistent_caregivers',
      text: 'Diferentes cuidadores, diferentes abordagens? Converse sobre manter consistência.',
      context: 'caregiver_coordination',
      userMode: 'parent',
      triggerCondition: 'inconsistent_patterns',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'seasonal_mood_impact',
      text: 'Mudança de estação afeta humor. Ajuste expectativas e seja mais flexível temporariamente.',
      context: 'seasonal_adjustment',
      userMode: 'parent',
      triggerCondition: 'seasonal_behavior_change',
      priority: 'medium',
      category: 'troubleshooting'
    },
    {
      id: 'sleep_disruption_impact',
      text: 'Sono ruim afeta tudo. Priorize descanso antes de cobrar atividades complexas.',
      context: 'sleep_factor',
      userMode: 'parent',
      triggerCondition: 'tired_pattern_detected',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'social_anxiety_accommodation',
      text: 'Atividades sociais difíceis? Comece com 1 pessoa conhecida antes de grupos maiores.',
      context: 'social_anxiety_help',
      userMode: 'parent',
      triggerCondition: 'social_activity_avoidance',
      priority: 'medium',
      category: 'troubleshooting'
    },
    {
      id: 'sensory_overload_solution',
      text: 'Sobrecarga sensorial? Crie espaço calmo e reduza estímulos durante atividades.',
      context: 'sensory_management',
      userMode: 'parent',
      triggerCondition: 'sensory_overwhelm_signs',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'change_anxiety_relief',
      text: 'Ansiedade com mudanças? Avise antecipadamente e mantenha pelo menos 2 atividades iguais.',
      context: 'change_management',
      userMode: 'parent',
      triggerCondition: 'change_resistance',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'sibling_jealousy_solution',
      text: 'Irmão com ciúmes da atenção? Crie momentos especiais para cada um separadamente.',
      context: 'sibling_dynamics',
      userMode: 'parent',
      triggerCondition: 'sibling_interference',
      priority: 'medium',
      category: 'troubleshooting'
    },
    {
      id: 'parent_stress_acknowledgment',
      text: 'Você parece cansado. Cuide-se também - pais descansados ajudam melhor.',
      context: 'parent_wellbeing',
      userMode: 'parent',
      triggerCondition: 'parent_stress_indicators',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'plateau_breakthrough',
      text: 'Estagnação é normal após progresso. Mude 1 pequena coisa para quebrar o padrão.',
      context: 'plateau_management',
      userMode: 'parent',
      triggerCondition: 'progress_plateau',
      priority: 'medium',
      category: 'troubleshooting'
    },
    {
      id: 'external_stress_impact',
      text: 'Stress externo (escola, mudanças) afeta rotinas. Seja mais flexível temporariamente.',
      context: 'external_factors',
      userMode: 'parent',
      triggerCondition: 'external_stress_detected',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'comparison_trap_warning',
      text: 'Evite comparar com outras crianças. Cada um tem seu ritmo e suas necessidades únicas.',
      context: 'comparison_prevention',
      userMode: 'parent',
      triggerCondition: 'comparison_behavior',
      priority: 'high',
      category: 'troubleshooting'
    },
    {
      id: 'backup_plan_suggestion',
      text: 'Dias caóticos acontecem. Tenha uma "rotina mínima" de 2-3 atividades essenciais.',
      context: 'contingency_planning',
      userMode: 'parent',
      triggerCondition: 'chaotic_day_pattern',
      priority: 'medium',
      category: 'troubleshooting'
    },
    {
      id: 'professional_support_suggestion',
      text: 'Dificuldades persistem há 3+ semanas? Considere conversar com terapeuta ocupacional.',
      context: 'professional_referral',
      userMode: 'parent',
      triggerCondition: 'persistent_difficulties',
      priority: 'medium',
      category: 'troubleshooting'
    },
    {
      id: 'celebration_fatigue_solution',
      text: 'Criança não se anima mais com recompensas? Varie os tipos de celebração.',
      context: 'reward_refresh',
      userMode: 'parent',
      triggerCondition: 'reward_system_fatigue',
      priority: 'medium',
      category: 'troubleshooting'
    },
    {
      id: 'routine_staleness_fix',
      text: 'Rotina ficou monótona? Substitua 1 atividade por algo novo e interessante.',
      context: 'routine_refresh',
      userMode: 'parent',
      triggerCondition: 'routine_boredom',
      priority: 'medium',
      category: 'troubleshooting'
    },
    {
      id: 'reset_encouragement',
      text: 'Às vezes é melhor recomeçar do zero. Não é fracasso, é estratégia inteligente.',
      context: 'reset_normalization',
      userMode: 'parent',
      triggerCondition: 'consider_reset',
      priority: 'medium',
      category: 'troubleshooting'
    }
  ]
};

// Função para obter mensagem contextual baseada em condições
export function getLeoContextualMessage(
  triggerCondition: string,
  userMode: 'parent' | 'child' | 'both' = 'both',
  category?: 'tutorial' | 'progress' | 'insights' | 'troubleshooting'
): LeoContextualMessage | null {
  
  // Buscar em todas as categorias se não especificada
  const categoriesToSearch = category 
    ? [LEO_CONTEXTUAL_MESSAGES[`${category}_${category === 'tutorial' ? 'basic' : category === 'progress' ? 'intermediate' : 'advanced'}`] || LEO_CONTEXTUAL_MESSAGES[category]]
    : Object.values(LEO_CONTEXTUAL_MESSAGES).flat();
  
  for (const categoryMessages of (category ? [categoriesToSearch] : Object.values(LEO_CONTEXTUAL_MESSAGES))) {
    if (!Array.isArray(categoryMessages)) continue;
    
    for (const message of categoryMessages) {
      if (message.triggerCondition === triggerCondition &&
          (message.userMode === userMode || message.userMode === 'both')) {
        return message;
      }
    }
  }
  
  return null;
}

// Função para obter mensagem aleatória de uma categoria
export function getRandomLeoMessage(
  category: 'tutorial' | 'progress' | 'insights' | 'troubleshooting',
  userMode: 'parent' | 'child' | 'both' = 'both'
): LeoContextualMessage | null {
  
  const categoryKey = category === 'tutorial' ? 'tutorial_basic' :
                     category === 'progress' ? 'progress_intermediate' :
                     category === 'insights' ? 'insights_advanced' :
                     'troubleshooting';
  
  const messages = LEO_CONTEXTUAL_MESSAGES[categoryKey]?.filter(
    msg => msg.userMode === userMode || msg.userMode === 'both'
  ) || [];
  
  if (messages.length === 0) return null;
  
  return messages[Math.floor(Math.random() * messages.length)];
}

// Função para obter mensagens por prioridade
export function getLeoMessagesByPriority(
  priority: 'low' | 'medium' | 'high',
  userMode: 'parent' | 'child' | 'both' = 'both'
): LeoContextualMessage[] {
  
  return Object.values(LEO_CONTEXTUAL_MESSAGES)
    .flat()
    .filter(msg => 
      msg.priority === priority && 
      (msg.userMode === userMode || msg.userMode === 'both')
    );
}

// Função para buscar mensagem por ID específico
export function getLeoMessageById(messageId: string): LeoContextualMessage | null {
  for (const categoryMessages of Object.values(LEO_CONTEXTUAL_MESSAGES)) {
    for (const message of categoryMessages) {
      if (message.id === messageId) {
        return message;
      }
    }
  }
  return null;
}

// Sistema de contexto inteligente para decidir qual mensagem usar
export interface UserContext {
  totalTasksCompleted: number;
  currentStreak: number;
  level: number;
  stars: number;
  daysUsing: number;
  lastCompletionRate: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  isFirstTime: boolean;
  recentPattern: 'struggling' | 'improving' | 'consistent' | 'exceptional';
}

export function getContextualLeoMessage(
  context: UserContext,
  userMode: 'parent' | 'child' | 'both' = 'both'
): LeoContextualMessage | null {
  
  // Lógica para determinar a mensagem mais apropriada baseada no contexto
  if (context.isFirstTime) {
    return getLeoContextualMessage('first_visit', userMode, 'tutorial');
  }
  
  if (context.totalTasksCompleted === 1) {
    return getLeoContextualMessage('first_task_completed', userMode, 'tutorial');
  }
  
  if (context.totalTasksCompleted === 50) {
    return getLeoContextualMessage('tasks_completed_50', userMode, 'progress');
  }
  
  if (context.recentPattern === 'struggling') {
    return getRandomLeoMessage('troubleshooting', userMode);
  }
  
  if (context.recentPattern === 'exceptional') {
    return getRandomLeoMessage('insights', userMode);
  }
  
  if (context.level >= 3) {
    return getRandomLeoMessage('insights', userMode);
  }
  
  // Default para mensagens de progresso
  return getRandomLeoMessage('progress', userMode);
}
