'use client'
import { AppProvider, useAppContext } from '@/contexts/AppContext'

// ✅ Componente que usa o context
function TesteConteudo() {
  const { currentSection, backUrl } = useAppContext()
  
  return (
    <div className="p-8 max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        🧪 Teste do Context Provider
      </h1>
      
      <div className="space-y-4">
        <p className="text-gray-700">
          <strong>Seção Atual:</strong> {currentSection}
        </p>
        
        <p className="text-gray-700">
          <strong>URL de Volta:</strong> {backUrl}
        </p>
        
        <div className="p-4 bg-green-100 rounded">
          ✅ <strong>Context funcionando!</strong>
        </div>
      </div>
    </div>
  )
}

// ✅ Página principal com Provider
export default function TesteContextPage() {
  return (
    <AppProvider 
      section="TEA" 
      userProfile={{ id: 1, nome: 'Usuário Teste' }}
    >
      <TesteConteudo />
    </AppProvider>
  )
}
