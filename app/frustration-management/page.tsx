"use client";

import React, { useState, useEffect } from 'react';

interface FrustrationExercise {
  id: number;
  title: string;
  type: 'breathing' | 'reframing' | 'reflection' | 'action-plan';
  description: string;
  instruction: string;
  duration?: number;
  steps?: string[];
  questions?: string[];
  examples?: string[];
}

interface UserResponse {
  exerciseId: number;
  responses: { [key: string]: string };
  completed: boolean;
  timestamp: Date;
}

// ARRAY COMPLETO DOS EXERCÍCIOS
const exercises: FrustrationExercise[] = [
  {
    id: 1,
    title: "Respiração 4-7-8",
    type: "breathing",
    description: "Técnica de respiração para acalmar o sistema nervoso",
    instruction: "Respire seguindo o ritmo 4-7-8 para ativar a resposta de relaxamento.",
    duration: 180,
    steps: [
      "Inspire pelo nariz contando até 4",
      "Segure a respiração contando até 7", 
      "Expire pela boca contando até 8",
      "Repita 4 ciclos completos"
    ]
  },
  {
    id: 2,
    title: "Identificando Pensamentos Distorcidos",
    type: "reframing",
    description: "Reconhecer padrões de pensamento que intensificam a frustração",
    instruction: "Quando estamos frustrados, nossos pensamentos podem ficar distorcidos. Vamos identificar esses padrões.",
    examples: [
      "💭 Pensamento Tudo ou Nada: 'Sempre dá errado comigo' → 'Às vezes as coisas não saem como planejado, mas já resolvi problemas antes'",
      "💭 Catastrofização: 'Isso vai arruinar tudo' → 'É um contratempo, mas posso encontrar uma solução'",
      "💭 Leitura Mental: 'Ele fez isso de propósito' → 'Não sei suas intenções, pode ter sido um mal-entendido'"
    ]
  },
  {
    id: 3,
    title: "Reescrevendo a Narrativa",
    type: "reflection",
    description: "Transformar pensamentos negativos em perspectivas mais equilibradas",
    instruction: "Agora vamos praticar como reescrever nossos pensamentos de forma mais realista e equilibrada.",
    questions: [
      "Qual situação te causou frustração recentemente?",
      "Qual foi seu primeiro pensamento sobre essa situação?",
      "Que evidências você tem de que esse pensamento é verdadeiro?",
      "Que evidências contradizem esse pensamento?",
      "Como um amigo querido veria essa situação?",
      "Qual seria uma forma mais equilibrada de pensar sobre isso?"
    ]
  },
  {
    id: 4,
    title: "Técnica STOP",
    type: "action-plan",
    description: "Estratégia prática para usar no momento da frustração",
    instruction: "Quando sentir raiva ou frustração crescendo, use esta técnica:",
    steps: [
      "S - PARE o que está fazendo",
      "T - RESPIRE fundo 3 vezes",
      "O - OBSERVE seus pensamentos e sentimentos",
      "P - PROSSIGA com uma ação mais consciente"
    ]
  }
];

// ARRAY COMPLETO DOS CENÁRIOS
const frustratingScenarios = [
  {
    situation: "Seu chefe criticou seu trabalho na frente dos colegas",
    distortedThought: "Ele me odeia e quer me demitir. Sou um fracasso.",
    reframedThought: "Ele pode estar estressado ou ter um estilo de comunicação direto. Posso aprender com o feedback e conversar em particular."
  },
  {
    situation: "Você perdeu uma oportunidade importante por 5 minutos de atraso",
    distortedThought: "Sempre acontece isso comigo. Nunca vou conseguir nada.",
    reframedThought: "Foi frustrante, mas imprevistos acontecem. Posso me preparar melhor para próximas oportunidades."
  },
  {
    situation: "Alguém cortou sua fila no supermercado",
    distortedThought: "As pessoas são sempre desrespeitosas comigo. Ninguém me respeita.",
    reframedThought: "Pode ter sido um mal-entendido ou a pessoa pode estar com pressa por alguma emergência."
  }
];

export default function FrustrationManagement() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [breathingCount, setBreathingCount] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [userResponses, setUserResponses] = useState<{ [key: string]: string }>({});
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // useEffect para definir windowWidth apenas no cliente
  useEffect(() => {
    function handleResize() {
      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth);
      }
    }

    handleResize();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (exercises[currentExercise].type === 'breathing') {
        setCompletedExercises(prev => [...prev, exercises[currentExercise].id]);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, currentExercise]);

  // Breathing exercise timer logic
  useEffect(() => {
    let breathTimer: NodeJS.Timeout | null = null;

    if (isActive && exercises[currentExercise].type === 'breathing') {
      breathTimer = setInterval(() => {
        setBreathingCount(prev => {
          const newCount = prev + 1;

          if (breathingPhase === 'inhale' && newCount >= 4) {
            setBreathingPhase('hold');
            return 0;
          } else if (breathingPhase === 'hold' && newCount >= 7) {
            setBreathingPhase('exhale');
            return 0;
          } else if (breathingPhase === 'exhale' && newCount >= 8) {
            setCurrentCycle(cycle => {
              const newCycle = cycle + 1;
              if (newCycle >= 4) {
                setIsActive(false);
                setBreathingPhase('rest');
                setCompletedExercises(prev => [...prev, exercises[currentExercise].id]);
                return 0;
              }
              setBreathingPhase('inhale');
              return newCycle;
            });
            return 0;
          }

          return newCount;
        });
      }, 1000);
    }

    return () => {
      if (breathTimer) clearInterval(breathTimer);
    };
  }, [isActive, breathingPhase, currentExercise]);

  const startBreathing = () => {
    setIsActive(true);
    setTimeLeft(180); // 3 minutes
    setBreathingPhase('inhale');
    setBreathingCount(0);
    setCurrentCycle(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setTimeLeft(0);
    setBreathingPhase('rest');
    setBreathingCount(0);
    setCurrentCycle(0);
  };

  const handleInputChange = (questionIndex: number, value: string) => {
    setUserResponses(prev => ({
      ...prev,
      [`${currentExercise}-${questionIndex}`]: value
    }));
  };

  const completeCurrentExercise = () => {
    setCompletedExercises(prev => [...prev, exercises[currentExercise].id]);
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const handleBackToTEA = () => {
    // Verificação segura para window
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return `Inspire... ${breathingCount + 1}/4`;
      case 'hold': return `Segure... ${breathingCount + 1}/7`;
      case 'exhale': return `Expire... ${breathingCount + 1}/8`;
      default: return 'Pronto para começar';
    }
  };

  const getBreathingColor = () => {
    switch (breathingPhase) {
      case 'inhale': return '#3b82f6';
      case 'hold': return '#8b5cf6';
      case 'exhale': return '#06b6d4';
      default: return '#e5e7eb';
    }
  };

  // Estilos responsivos
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: windowWidth <= 768 ? '16px' : '24px',
    marginBottom: windowWidth <= 768 ? '16px' : '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb'
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: windowWidth <= 768 ? '10px 20px' : '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: windowWidth <= 768 ? '14px' : '16px',
    fontWeight: '600',
    transition: 'all 0.2s',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const progressStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '24px'
  };

  const progressBarStyle = {
    height: '100%',
    backgroundColor: '#14b8a6',
    width: `${((currentExercise + 1) / exercises.length) * 100}%`,
    transition: 'width 0.3s ease'
  };

  if (!gameStarted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
        padding: windowWidth <= 768 ? '16px' : '20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Back Button */}
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleBackToTEA}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#0d9488',
                fontSize: windowWidth <= 768 ? '14px' : '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: windowWidth <= 768 ? '8px' : '12px',
                borderRadius: '8px',
                transition: 'all 0.2s',
                minHeight: '44px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(13, 148, 136, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ← Voltar
            </button>
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap'
            }}>
              <div style={{
                width: windowWidth <= 768 ? '40px' : '48px',
                height: windowWidth <= 768 ? '40px' : '48px',
                background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: windowWidth <= 768 ? '20px' : '24px'
              }}>
                😤
              </div>
              <h1 style={{
                fontSize: windowWidth <= 768 ? '1.8rem' : '2.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                textAlign: 'center'
              }}>
                Lidando com Frustrações
              </h1>
            </div>
            <p style={{
              fontSize: windowWidth <= 768 ? '1rem' : '1.25rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              padding: windowWidth <= 768 ? '0 16px' : '0'
            }}>
              Aprenda técnicas para lidar com críticas e gerenciar raiva através de respiração e reframing cognitivo
            </p>
          </div>

          {/* Módulo Info */}
          <div style={{...cardStyle, borderLeft: '4px solid #0d9488' }}>
            <h3 style={{
              color: '#0f766e',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: windowWidth <= 768 ? '16px' : '18px',
              flexWrap: 'wrap'
            }}>
              ❤️ MÓDULO 3: REGULAÇÃO EMOCIONAL
            </h3>
            <p style={{
              color: '#6b7280',
              margin: 0,
              fontSize: windowWidth <= 768 ? '14px' : '16px'
            }}>
              Base: Controle de Impulsos + Assertividade | Técnicas de Respiração e Reframing
            </p>
          </div>

          {/* Botão Iniciar */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setGameStarted(true)}
              style={{
                ...buttonStyle,
                background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
                fontSize: windowWidth <= 768 ? '16px' : '18px',
                padding: windowWidth <= 768 ? '14px 28px' : '16px 32px'
              }}
            >
              😤 Começar Treinamento
            </button>
          </div>
        </div>
      </div>
    );
  }

  const exercise = exercises[currentExercise];
  const isCompleted = completedExercises.includes(exercise.id);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
      padding: windowWidth <= 768 ? '16px' : '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <div style={{
              width: windowWidth <= 768 ? '32px' : '40px',
              height: windowWidth <= 768 ? '32px' : '40px',
              background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: windowWidth <= 768 ? '16px' : '20px'
            }}>
              😤
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{
                fontSize: windowWidth <= 768 ? '1.2rem' : '1.5rem',
                fontWeight: 'bold',
                margin: 0,
                wordBreak: 'break-word'
              }}>
                Lidando com Frustrações
              </h1>
              <p style={{
                color: '#6b7280',
                margin: 0,
                fontSize: windowWidth <= 768 ? '12px' : '14px',
              }}>
                Exercício {currentExercise + 1} de {exercises.length}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={progressStyle}>
          <div style={progressBarStyle}></div>
        </div>

        {/* Exercise Content */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{
              width: windowWidth <= 768 ? '40px' : '48px',
              height: windowWidth <= 768 ? '40px' : '48px',
              backgroundColor: '#14b8a6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: windowWidth <= 768 ? '20px' : '24px'
            }}>
              {exercise.type === 'breathing' ? '🫁' :
                exercise.type === 'reframing' ? '🧠' :
                exercise.type === 'reflection' ? '🤔' : '⚡'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 style={{
                color: '#374151',
                margin: 0,
                fontSize: windowWidth <= 768 ? '1.2rem' : '1.5rem',
                wordBreak: 'break-word'
              }}>
                {exercise.title}
              </h2>
              <p style={{
                color: '#6b7280',
                margin: 0,
                fontSize: windowWidth <= 768 ? '12px' : '14px',
              }}>
                {exercise.description}
              </p>
            </div>
          </div>

          <p style={{
            color: '#374151',
            marginBottom: '24px',
            lineHeight: '1.6',
            fontSize: windowWidth <= 768 ? '14px' : '16px',
          }}>
            {exercise.instruction}
          </p>

          {/* Breathing Exercise */}
          {exercise.type === 'breathing' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: windowWidth <= 768 ? '150px' : '200px',
                height: windowWidth <= 768 ? '150px' : '200px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                backgroundColor: getBreathingColor(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: windowWidth <= 768 ? '14px' : '18px',
                fontWeight: '600',
                transition: 'all 1s ease',
                transform: breathingPhase === 'inhale' ? 'scale(1.2)' : breathingPhase === 'hold' ? 'scale(1.2)' : 'scale(1)',
                padding: '8px'
              }}>
                {getBreathingInstruction()}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {!isActive ? (
                  <button onClick={startBreathing} style={buttonStyle}>
                    🫁 Começar Respiração
                  </button>
                ) : (
                  <button
                    onClick={stopExercise}
                    style={{...buttonStyle, backgroundColor: '#ef4444' }}
                  >
                    ⏹️ Parar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Reframing Exercise */}
          {exercise.type === 'reframing' && (
            <div>
              <h4 style={{
                color: '#374151',
                marginBottom: '16px',
                fontSize: windowWidth <= 768 ? '14px' : '16px',
              }}>
                Exemplos de Reframing:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {exercise.examples?.map((example, index) => (
                  <div key={index} style={{
                    backgroundColor: '#f0f9ff',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #bae6fd'
                  }}>
                    <p style={{
                      color: '#0c4a6e',
                      margin: 0,
                      lineHeight: '1.5',
                      fontSize: windowWidth <= 768 ? '13px' : '14px',
                    }}>
                      {example}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button
                  onClick={completeCurrentExercise}
                  disabled={isCompleted}
                  style={{
                    ...buttonStyle,
                    backgroundColor: isCompleted ? '#10b981' : '#3b82f6'
                  }}
                >
                  {isCompleted ? '✅ Concluído' : 'Marcar como Lido'}
                </button>
              </div>
            </div>
          )}

          {/* Reflection Exercise */}
          {exercise.type === 'reflection' && (
            <div>
              {exercise.questions?.map((question, index) => (
                <div key={index} style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    color: '#374151',
                    marginBottom: '8px',
                    fontWeight: '500',
                    fontSize: windowWidth <= 768 ? '14px' : '16px',
                  }}>
                    {index + 1}. {question}
                  </label>
                  <textarea
                    value={userResponses[`${currentExercise}-${index}`] || ''}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Escreva sua reflexão aqui..."
                    style={{
                      width: '100%',
                      minHeight: windowWidth <= 768 ? '60px' : '80px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: windowWidth <= 768 ? '14px' : '16px',
                      lineHeight: '1.5',
                      resize: 'vertical',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#14b8a6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  />
                </div>
              ))}

              <div style={{
                backgroundColor: '#f0fdfa',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <h4 style={{
                  color: '#0f766e',
                  marginBottom: '12px',
                  fontSize: windowWidth <= 768 ? '14px' : '16px',
                }}>
                  💡 Exemplo Prático:
                </h4>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{
                    color: '#134e4a',
                    marginBottom: '8px',
                    fontSize: windowWidth <= 768 ? '12px' : '14px',
                  }}>
                    <strong>Situação:</strong> {frustratingScenarios[currentScenario].situation}
                  </p>
                  <p style={{
                    color: '#134e4a',
                    marginBottom: '8px',
                    fontSize: windowWidth <= 768 ? '12px' : '14px',
                  }}>
                    <strong>Pensamento Distorcido:</strong> "{frustratingScenarios[currentScenario].distortedThought}"
                  </p>
                  <p style={{
                    color: '#134e4a',
                    margin: 0,
                    fontSize: windowWidth <= 768 ? '12px' : '14px',
                  }}>
                    <strong>Pensamento Reframado:</strong> "{frustratingScenarios[currentScenario].reframedThought}"
                  </p>
                </div>
                <button
                  onClick={() => setCurrentScenario((prev) => (prev + 1) % frustratingScenarios.length)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#14b8a6',
                    fontSize: windowWidth <= 768 ? '12px' : '14px',
                    padding: windowWidth <= 768 ? '6px 12px' : '8px 16px',
                    minHeight: 'auto'
                  }}
                >
                  Ver Outro Exemplo
                </button>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={completeCurrentExercise}
                  disabled={isCompleted}
                  style={{
                    ...buttonStyle,
                    backgroundColor: isCompleted ? '#10b981' : '#3b82f6'
                  }}
                >
                  {isCompleted ? '✅ Concluído' : 'Finalizar Reflexão'}
                </button>
              </div>
            </div>
          )}

          {/* Action Plan Exercise */}
          {exercise.type === 'action-plan' && (
            <div>
              <div style={{
                backgroundColor: '#fefce8',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <h4 style={{
                  color: '#a16207',
                  marginBottom: '16px',
                  textAlign: 'center',
                  fontSize: windowWidth <= 768 ? '16px' : '18px',
                }}>
                  ⚡ Técnica STOP
                </h4>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {exercise.steps?.map((step, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: 'white',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '2px solid #fde047'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#eab308',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}>
                        {index + 1}
                      </div>
                      <p style={{
                        color: '#92400e',
                        margin: 0,
                        fontSize: windowWidth <= 768 ? '14px' : '16px',
                        fontWeight: '500'
                      }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={completeCurrentExercise}
                  disabled={isCompleted}
                  style={{
                    ...buttonStyle,
                    backgroundColor: isCompleted ? '#10b981' : '#3b82f6'
                  }}
                >
                  {isCompleted ? '✅ Concluído' : 'Técnica Aprendida'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={prevExercise}
            disabled={currentExercise === 0}
            style={{
              ...buttonStyle,
              backgroundColor: currentExercise === 0 ? '#9ca3af' : '#6b7280',
              cursor: currentExercise === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Anterior
          </button>

          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            flex: 1
          }}>
            {exercises.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: index === currentExercise ? '#14b8a6' : '#e5e7eb',
                  transition: 'background-color 0.2s'
                }}
              />
            ))}
          </div>

          <button
            onClick={nextExercise}
            disabled={currentExercise === exercises.length - 1}
            style={{
              ...buttonStyle,
              backgroundColor: currentExercise === exercises.length - 1 ? '#9ca3af' : '#14b8a6',
              cursor: currentExercise === exercises.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
}
