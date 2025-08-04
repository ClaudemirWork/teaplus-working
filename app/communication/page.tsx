'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CommunicationPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">☀️ TeaPlus</h1>
        </div>
        
        <nav className="mt-6">
          <Link href="/" className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50">
            <span className="text-xl mr-3">🏠</span>
            <span>Dashboard</span>
          </Link>
          
          <div className="flex items-center px-6 py-3 bg-blue-100 text-blue-800">
            <span className="text-xl mr-3">💬</span>
            <span>Comunicação Social</span>
          </div>
          
          <Link href="/interaction" className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50">
            <span className="text-xl mr-3">👥</span>
            <span>Interação Social</span>
          </Link>
          
          <Link href="/emotion-regulation" className="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50">
            <span className="text-xl mr-3">❤️</span>
            <span>Regulação Emocional</span>
          </Link>

          <Link href="/social-signals" className="flex items-center px-6 py-3 text-gray-700 hover:bg-yellow-50">
            <span className="text-xl mr-3">🎭</span>
            <span>Sinais Sociais</span>
          </Link>

          <Link href="/bibliography" className="flex items-center px-6 py-3 text-gray-700 hover:bg-orange-50">
            <span className="text-xl mr-3">📚</span>
            <span>Bibliografia</span>
          </Link>
        </nav>
      </div>

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            💬 Comunicação Social
          </h1>
          <p className="text-lg text-gray-600">
            Desenvolva habilidades essenciais de comunicação e interação social
          </p>
        </div>

        {/* Atividades Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          
          {/* Contato Visual */}
          <Link href="/eye-contact" className="group">
            <div className="rounded-3xl bg-white p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full">
              <div className="flex items-center mb-4">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-2xl text-white">
                  👀
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Contato Visual</h3>
                  <p className="text-gray-600">Exercícios de olhar direcionado</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Iniciar Conversas */}
          <Link href="/conversation-starters" className="group">
            <div className="rounded-3xl bg-white p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full">
              <div className="flex items-center mb-4">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-2xl text-white">
                  💬
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Iniciar Conversas</h3>
                  <p className="text-gray-600">Técnicas para começar diálogos</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Expressões Faciais */}
          <Link href="/facial-expressions" className="group">
            <div className="rounded-3xl bg-white p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full">
              <div className="flex items-center mb-4">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 text-2xl text-white">
                  😊
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Expressões Faciais</h3>
                  <p className="text-gray-600">Reconhecer e interpretar emoções</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Tom de Voz */}
          <Link href="/tone-of-voice" className="group">
            <div className="rounded-3xl bg-white p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full">
              <div className="flex items-center mb-4">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-2xl text-white">
                  🎵
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Tom de Voz</h3>
                  <p className="text-gray-600">Exercícios de entonação</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Diálogo em Cenas */}
          <Link href="/dialogue-scenes" className="group">
            <div className="rounded-3xl bg-white p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full">
              <div className="flex items-center mb-4">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-2xl text-white">
                  🎭
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Diálogo em Cenas</h3>
                  <p className="text-gray-600">Role-play digital interativo</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Escuta Ativa */}
          <Link href="/active-listening" className="group">
            <div className="rounded-3xl bg-white p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full">
              <div className="flex items-center mb-4">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-2xl text-white">
                  👂
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Escuta Ativa</h3>
                  <p className="text-gray-600">Exercícios de compreensão auditiva</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Botão Voltar */}
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}