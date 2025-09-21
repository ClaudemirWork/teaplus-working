// Função para selecionar mensagem contextual baseada em trigger
export function getContextualMessage(
  trigger: string, 
  userContext: UserContext,
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

export default LEO_CONTEXTUAL_MESSAGES;
