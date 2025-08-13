'use client'
import { createContext, useContext, ReactNode } from 'react'

// ✅ Define tipos para organização
type AppContextType = {
  currentSection: 'TEA' | 'TDAH' | 'COMBINED'
  userProfile: any
  backUrl: string
}

// ✅ Cria o context (ainda não está sendo usado)
const AppContext = createContext<AppContextType | null>(null)

// ✅ Provider que vai "envolver" componentes no futuro
export function AppProvider({ 
  children, 
  section, 
  userProfile 
}: { 
  children: ReactNode
  section: 'TEA' | 'TDAH' | 'COMBINED'
  userProfile: any 
}) {
  const backUrl = `/${section.toLowerCase()}`
  
  return (
    <AppContext.Provider value={{ 
      currentSection: section, 
      userProfile, 
      backUrl 
    }}>
      {children}
    </AppContext.Provider>
  )
}

// ✅ Hook para usar o context nos componentes
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
