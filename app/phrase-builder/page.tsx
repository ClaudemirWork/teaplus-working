// ARQUIVO COMPLETO E FINAL
// Local: app/phrase-builder/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Trophy, Gamepad2, Star, Sparkles, ChevronRight, Award, Lock, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function PhraseBuilderGame() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [unlockedLevels, setUnlockedLevels] = useState(['iniciante']);

  useEffect(() => {
    const inicianteCompleto = localStorage.getItem('phraseBuilderInicianteCompleto');
    if (inicianteCompleto === 'true') {
      setUnlockedLevels(['iniciante', 'intermediario']);
    }
  }, []);

  const LandingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-teal-400 to-green-300 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="relative bg-white/90 backdrop-blur-xl rounded-[40px] shadow-2xl p-6 text-center transition-transform duration-300 hover:scale-[1.03]">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 flex flex-col items-center gap-2 mb-4">
            <span className="bg-blue-200 px-4 py-1 rounded-xl shadow-md transform -rotate-2">Figuras</span>
            <span className="bg-green-200 px-4 py-1 rounded-xl shadow-md transform rotate-2">Trocadas</span>
          </h1>
          <div className="relative mb-4">
            <div className="relative bg-gradient-to-br from-blue-50 to-green-100 rounded-3xl p-3 shadow-inner z-10">
              <Image src="/images/mascotes/Leo-Mila-perdidos.png" alt="Leo e Mila confusos" width={400} height={400} className="w-full rounded-2xl" />
            </div>
          </div>
          <button onClick={() => setCurrentScreen('instructions')} className="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold text-2xl py-4 px-8 rounded-full shadow-xl transform hover:scale-105 active:scale-100 transition-all duration-300">
            <Sparkles className="h-7 w-7 transition-transform group-hover:rotate-12" />
            <span>Iniciar Aventura</span>
          </button>
        </div>
      </div>
    </div>
  );

  const InstructionsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-cyan-400 to-emerald-400 p-4 pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Como Jogar</h2>
          <p className="text-white/90 text-md md:text-lg">Organize as figuras para formar a sequência correta!</p>
        </div>
        <div className="space-y-4">
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="bg-sky-100 p-3 rounded-xl"><ImageIcon className="h-8 w-8 text-sky-600" /></div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Sua Missão</h3>
                        <p className="text-gray-600">Observe a imagem principal. Você receberá cartões com figuras. Sua missão é **clicar** nos cartões na ordem correta para descrever a imagem que você viu.</p>
                    </div>
                </div>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="bg-yellow-100 p-3 rounded-xl"><Trophy className="h-8 w-8 text-yellow-600" /></div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Níveis e Prêmios</h3>
                        <ul className="text-gray-600 space-y-2 list-disc list-inside">
                            <li>Comece na "Jornada das Figuras" com 2 figuras.</li>
                            <li>Complete fases para desbloquear a "Aventura das Frases" com 3 figuras.</li>
                            <li>Ganhe confetes e muitos pontos!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div className="text-center mt-8 pb-8">
            <button onClick={() => setCurrentScreen('levels')} className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl py-4 px-10 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300">
                <Gamepad2 className="h-7 w-7" />
                <span>Escolher Nível</span>
            </button>
        </div>
      </div>
    </div>
  );

  const LevelsScreen = () => {
    const levels = [
        { id: 'iniciante', name: 'Jornada das Figuras', icon: <Star className="h-12 w-12 text-yellow-400 fill-yellow-400" />, color: 'from-green-400 to-blue-400', details: '2 figuras • 112 fases', description: 'Associe a figura principal com sua cor ou característica.' },
        { id: 'intermediario', name: 'Aventura das Frases', icon: <Award className="h-12 w-12 text-white" />, color: 'from-yellow-400 to-orange-400', details: '3 figuras • 112 fases', description: 'Use os artigos \'O\' e \'A\' para formar a sequência completa.' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between p-4 mb-6">
               <button onClick={() => setCurrentScreen('instructions')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"><ArrowLeft className="h-5 w-5" /> <span className="font-semibold">Voltar</span></button>
               <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Escolha seu Nível</h2>
               <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1"><span className="text-lg font-bold text-yellow-700">0</span><Star className="h-5 w-5 text-yellow-600 fill-yellow-500" /></div>
            </div>
            <div className="space-y-6">
                {levels.map(level => {
                    const isUnlocked = unlockedLevels.includes(level.id);
                    return (
                        <div key={level.id} onClick={() => isUnlocked && router.push(`/phrase-builder/play?level=${level.id}`)} className={`rounded-2xl shadow-lg border-4 border-transparent transition-all duration-300 ${isUnlocked ? 'cursor-pointer hover:border-blue-500 hover:scale-105' : 'cursor-not-allowed opacity-60'}`}>
                            <div className={`flex flex-col md:flex-row items-center p-4 rounded-t-xl bg-gradient-to-r ${isUnlocked ? level.color : 'from-gray-300 to-gray-400'}`}>
                                <div className="mb-2 md:mb-0 md:mr-6">{isUnlocked ? level.icon : <Lock className="h-12 w-12 text-white/70" />}</div>
                                <div className="text-center md:text-left text-white">
                                    <h3 className="text-2xl font-bold">{level.name}</h3>
                                    <p className="text-sm opacity-90">{level.details}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-b-xl">
                                <p className="text-gray-700 font-medium">{level.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'landing' && <LandingScreen />}
      {currentScreen === 'instructions' && <InstructionsScreen />}
      {currentScreen === 'levels' && <LevelsScreen />}
    </div>
  );
}
