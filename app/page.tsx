'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const App = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('teaplus_session');
      if (isLoggedIn === 'active') {
        router.replace('/profileselection');
      }
    }
  }, [router]);

  // SVG Icons as components (código dos ícones omitido para brevidade)...
  const BrainIcon = ({ className }: { className?: string }) => (/* ... */);
  const HeartHandshakeIcon = ({ className }: { className?: string }) => (/* ... */);
  const UsersIcon = ({ className }: { className?: string }) => (/* ... */);
  const CheckCircleIcon = ({ className }: { className?: string }) => (/* ... */);
  const SparklesIcon = ({ className }: { className?: string }) => (/* ... */);
  const ChevronRightIcon = ({ className }: { className?: string }) => (/* ... */);


  const features = [/* ... */];
  const modules = [/* ... */];
  const stats = [/* ... */];
  const bibliography = [/* ... */];

  return (
    <div className="font-sans antialiased bg-slate-50 text-slate-700">
      {/* ===== HEADER ALTERADO - Logo centralizado e maior ===== */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-center items-center">
          {/* ALTERAÇÃO 1: Logo centralizado e com novo tamanho responsivo */}
          <a href="/" className="flex items-center">
            <Image
              src="/images/logo-luditea.png"
              alt="Logo LudiTEA"
              width={500} // Mantém a proporção original para o Next.js
              height={156} // Mantém a proporção original para o Next.js
              className="w-48 sm:w-56 md:w-64 h-auto" // Controla o tamanho visual
              priority
            />
          </a>
          {/* O botão "Entrar" foi removido daqui */}
        </div>
      </header>

      <main>
        {/* ===== HERO SECTION - Botão alterado ===== */}
        <section className="bg-gradient-to-br from-blue-100 to-white py-12 sm:py-16 md:py-20 animate-fade-in">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight drop-shadow-sm">
              Uma jornada de <span className="text-blue-600">descobertas</span> e{' '}
              <span className="text-emerald-600">desenvolvimento</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 md:mb-10 max-w-3xl mx-auto px-2">
              A primeira plataforma brasileira integrada para o desenvolvimento de habilidades em pessoas com TEA e TDAH, 
              com foco na individualidade e no aprendizado divertido.
            </p>
            <div className="flex justify-center">
              {/* ALTERAÇÃO 2: Botão agora leva para o login */}
              <a
                href="/login" // Rota alterada para a página de login
                className="bg-blue-600 text-white px-8 sm:px-10 py-3 md:py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-transform transform hover:-translate-y-1 text-base sm:text-lg inline-flex items-center"
              >
                Clique para conhecer e entrar
              </a>
            </div>
          </div>
        </section>

        {/* O restante do seu código continua igual... */}
        {/* ===== FEATURES SECTION ===== */}
        <section id="features-section" className="py-12 sm:py-16 md:py-20 bg-white">
            {/* ... conteúdo da seção ... */}
        </section>

        {/* ===== MODULES SECTION ===== */}
        <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
            {/* ... conteúdo da seção ... */}
        </section>

        {/* ... etc ... */}

      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 md:py-16">
        {/* ... conteúdo do footer ... */}
      </footer>
    </div>
  );
};

export default App;
