"use client"

import React from 'react'
import Link from 'next/link'

export default function BibliographyPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">🌟 TeaPlus</h1>
        </div>
        <nav className="mt-6">
          <Link href="/" className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50">
            <span className="text-xl mr-3">🏠</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/mood-tracker" className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50">
            <span className="text-xl mr-3">😊</span>
            <span>Rastreador de Humor</span>
          </Link>
          <Link href="/eye-contact" className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50">
            <span className="text-xl mr-3">👁️</span>
            <span>Jogo de Contato Visual</span>
          </Link>
          <Link href="/communication" className="flex items-center px-6 py-3 text-gray-700 hover:bg-yellow-50">
            <span className="text-xl mr-3">🗣️</span>
            <span>Comunicação Social</span>
          </Link>
        </nav>
      </div>

      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">📚 Referências Científicas</h2>
        
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Comunicação Social em TEA</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>Baron-Cohen, S. (2020). The concept of neurodiversity is dividing the autism community. <em>Scientific American.</em></p>
              <p>Kim, A., Jones, W., & Schultz, R. (2003). The enactive mind, or from actions to cognition. <em>Philosophical Transactions.</em></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-purple-600 mb-4">Interação Social e TDAH</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>Barkley, R. A. (2019). Attention-deficit hyperactivity disorder: A handbook for diagnosis and treatment. <em>Guilford Publications.</em></p>
              <p>Mikami, A. Y. (2010). The importance of friendship for youth with attention-deficit/hyperactivity disorder. <em>Clinical Child.</em></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Regulação Emocional</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>Mazefsky, C. A., & White, S. W. (2014). Emotion regulation concepts & practice in autism spectrum disorder. <em>Child Development.</em></p>
              <p>Gross, J. J. (2002). Emotion regulation: Affective, cognitive, and social consequences. <em>Psychophysiology.</em></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-green-600 mb-4">Sinais Sociais e Teoria da Mente</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>Frith, C. & Frith, U. (2014). Annual research review: Towards a developmental neuroscience of autism spectrum disorder. <em>Journal of Child Psychology.</em></p>
              <p>Premack, D., & Woodruff, G. (1978). Does the chimpanzee have a theory of mind? <em>Behavioral and Brain Sciences.</em></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-orange-600 mb-4">Intervenções Baseadas em Evidências</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>National Autism Center. (2015). Findings and conclusions: National standards project, phase 2. <em>Randolph, MA.</em></p>
              <p>Wong, C., et al. (2015). Evidence-based practices for children, youth, and young adults with autism spectrum disorder. <em>Journal of Autism.</em></p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Esta seção será constantemente atualizada com as mais recentes pesquisas científicas sobre TEA e TDAH, garantindo que o aplicativo TeaPlus mantenha-se atualizado com as melhores práticas baseadas em evidências.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
