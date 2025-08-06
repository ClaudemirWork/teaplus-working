// Principais correções para mobile:

// 1. BOTÕES DE OPÇÕES - substituir esta seção:
<div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
  {currentSituationData.options.map((option, index) => (
    <button
      key={index}
      onClick={() => selectOption(index, option)}
      disabled={answered}
      className={`
        w-full text-left 
        p-4 sm:p-6 
        rounded-xl border-2 
        transition-all duration-300
        font-medium 
        min-h-[60px] sm:min-h-[48px]
        flex items-center
        touch-manipulation
        active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${answered
          ? option.correct
            ? 'border-green-500 bg-green-50 text-green-800 shadow-lg'
            : selectedOption === index
            ? 'border-red-500 bg-red-50 text-red-800 shadow-lg'
            : 'border-gray-300 bg-gray-100 text-gray-600 opacity-60'
          : 'border-gray-300 bg-white text-gray-800 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md active:bg-indigo-100 shadow-sm'
        }
      `}
    >
      <div className="text-base sm:text-lg leading-relaxed w-full py-2">
        {option.text}
      </div>
    </button>
  ))}
</div>

// 2. BOTÕES DE NAVEGAÇÃO - melhorar responsividade:
<div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 sm:mt-8">
  <button 
    onClick={() => showScreen('level-selection')}
    className="
      bg-gray-500 hover:bg-gray-600 active:bg-gray-700 
      text-white px-6 py-4 rounded-xl 
      font-semibold transition-all duration-200
      min-h-[56px] touch-manipulation
      active:scale-[0.98]
      focus:outline-none focus:ring-2 focus:ring-gray-400
      shadow-lg hover:shadow-xl
      text-base sm:text-lg
      order-2 sm:order-1
    "
  >
    ← Níveis
  </button>
  
  {answered && (
    <button 
      onClick={nextSituation}
      className="
        bg-gradient-to-r from-indigo-500 to-purple-600 
        hover:from-indigo-600 hover:to-purple-700 
        active:from-indigo-700 active:to-purple-800 
        text-white px-6 py-4 rounded-xl 
        font-semibold transition-all duration-200
        min-h-[56px] touch-manipulation
        active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-indigo-400
        shadow-lg hover:shadow-xl
        text-base sm:text-lg
        order-1 sm:order-2
      "
    >
      {currentSituation < currentLevelData.situations.length - 1 ? 'Próxima Situação →' : 'Ver Resultados 🎯'}
    </button>
  )}
</div>

// 3. ADICIONAR ESTILO GLOBAL PARA MOBILE (no início do componente):
const mobileStyles = `
  @media (max-width: 640px) {
    .conversation-option {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      min-height: 60px !important;
      padding: 16px !important;
      margin-bottom: 12px !important;
    }
    
    .conversation-button {
      min-height: 56px !important;
      padding: 16px 24px !important;
      font-size: 16px !important;
    }
  }
`;

// 4. COMPONENTE CORRIGIDO COM STYLE TAG:
export default function ConversationStarters() {
  // ... código existente ...

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500">
        {/* resto do componente... */}
      </div>
    </>
  );
}
