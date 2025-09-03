'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Trophy, Gamepad2, Star, Sparkles, ChevronRight, Award, Lock, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

// Este é o novo componente principal que gerencia as telas de introdução
export default function PhraseBuilderGame() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing', 'instructions', 'levels'

  // ==================================================================
  // TELA 1: ABERTURA (LANDING SCREEN)
  // ==================================================================
  const LandingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-teal-400 to-green-300 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="relative bg-white/90 backdrop-blur-xl rounded-[40px] shadow-2xl p-6 text-center transition-transform duration-300 hover:scale-[1.03]">
          <div className="mb-4 inline-block">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 flex flex-col items-center gap-2">
              <span className="bg-blue-200 px-4 py-1 rounded-xl shadow-md transform -rotate-2">
                Figuras
              </span>
              <span className="bg-green-200 px-4 py-1 rounded-xl shadow-md transform rotate-2">
                Trocadas
              </span>
            </h1>
          </div>
          <div className="flex justify-center gap-1.5 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <div className="relative mb-4">
            <div className="relative bg-gradient-to-br from-blue-50 to-green-100 rounded-3xl p-3 shadow-inner z-10">
              <Image
                src="/images/mascotes/Leo-Mila-perdidos.png"
                alt="Leo e Mila parecendo confusos"
                width={400}
                height={400}
                className="w-full rounded-2xl"
              />
            </div>
          </div>
          <button
            onClick={() => setCurrentScreen('instructions')}
            className="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold text-2xl py-4 px-8 rounded-full shadow-xl transform hover:scale-105 active:scale-100 transition-all duration-300"
          >
            <Sparkles className="h-7 w-7 transition-transform group-hover:rotate-12" />
            <span>Iniciar Aventura</span>
          </button>
        </div>
      </div>
    </div>
  );

  // ==================================================================
  // TELA 2: INSTRUÇÕES
  // ==================================================================
  const InstructionsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-400 to-emerald-400 p-4 pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Como Jogar</h2>
          <p className="text-white/90 text-md md:text-lg">Organize as figuras para formar a sequência correta!</p>
        </div>
        <div className="space-y-4">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-sky-100 p-3 rounded-xl"><ImageIcon className="h-8 w-8 text-sky-600" /></div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sua Missão</h3>
                <p className="text-gray-600">
                  Observe a imagem principal. Você receberá cartões com figuras. Sua missão é **clicar** nos cartões na ordem correta para descrever a imagem que você viu.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-3 rounded-xl"><Trophy className="h-8 w-8 text-yellow-600" /></div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Níveis e Prêmios</h3>
                <ul className="text-gray-600 space-y-2 list-disc list-inside">
                  <li>Comece no nível iniciante com 2 figuras.</li>
                  <li>Avance para o nível intermediário com 3 figuras.</li>
                  <li>Ganhe confetes e desbloqueie novos desafios!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 pb-8">
          <button
            onClick={() => setCurrentScreen('levels')}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl py-4 px-10 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
          >
            <Gamepad2 className="h-7 w-7" />
            <span>Vamos Jogar!</span>
          </button>
        </div>
      </div>
    </div>
  );

  // ==================================================================
  // TELA 3: SELEÇÃO DE NÍVEL
  // ==================================================================
  const LevelsScreen = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between p-4 mb-6">
           <button onClick={() => setCurrentScreen('instructions')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
             <ArrowLeft className="h-5 w-5" />
             <span className="font-semibold">Voltar</span>
           </button>
           <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Escolha seu Nível</h2>
           <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1">
             <span className="text-lg font-bold text-yellow-700">0</span>
             <Star className="h-5 w-5 text-yellow-600 fill-yellow-500" />
           </div>
        </div>
        <div className="space-y-6">
            {/* Nível Iniciante */}
            <div onClick={() => router.push('/phrase-builder/play?level=iniciante')} className="rounded-2xl shadow-lg border-4 border-blue-500 scale-105 cursor-pointer">
                <div className="flex flex-col md:flex-row items-center p-4 rounded-t-xl bg-gradient-to-r from-green-400 to-blue-400">
                    <div className="mb-2 md:mb-0 md:mr-6"><Star className="h-12 w-12 text-yellow-400 fill-yellow-400" /></div>
                    <div className="text-center md:text-left text-white">
                        <h3 className="text-2xl font-bold">Iniciante</h3>
                        <p className="text-sm opacity-90">2 figuras • 112 fases</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-b-xl">
                    <p className="text-gray-700 font-medium">Associe a figura principal com sua cor ou característica.</p>
                </div>
            </div>

            {/* Nível Intermediário */}
            <div onClick={() => router.push('/phrase-builder/play?level=intermediario')} className="rounded-2xl shadow-lg border-4 border-blue-500 scale-105 cursor-pointer">
                <div className="flex flex-col md:flex-row items-center p-4 rounded-t-xl bg-gradient-to-r from-yellow-400 to-orange-400">
                    <div className="mb-2 md:mb-0 md:mr-6"><Award className="h-12 w-12 text-white" /></div>
                    <div className="text-center md:text-left text-white">
                        <h3 className="text-2xl font-bold">Intermediário</h3>
                        <p className="text-sm opacity-90">3 figuras • 112 fases</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-b-xl">
                    <p className="text-gray-700 font-medium">Use os artigos 'O' e 'A' para formar a sequência completa.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  // ==================================================================
  // RENDERIZA A TELA ATUAL
  // ==================================================================
  return (
    <div className="min-h-screen">
      {currentScreen === 'landing' && <LandingScreen />}
      {currentScreen === 'instructions' && <InstructionsScreen />}
      {currentScreen === 'levels' && <LevelsScreen />}
    </div>
  );
}
