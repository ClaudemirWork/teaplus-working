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

  // CORREÇÃO: Código SVG completo restaurado abaixo
  const BrainIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const HeartHandshakeIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  const UsersIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );

  const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );

  // O restante do código permanece o mesmo
  const features = [
    {
      icon: <BrainIcon className="text-blue-500 w-7 h-7 md:w-8 md:h-8" />,
      title: "Baseado em Ciência",
      description: "Atividades fundamentadas em ABA, TEACCH e Neuropsicologia Cognitiva.",
    },
    {
      icon: <HeartHandshakeIcon className="text-emerald-500 w-7 h-7 md:w-8 md:h-8" />,
      title: "Integração TEA + TDAH",
      description: "Primeira plataforma brasileira a trabalhar especificamente com ambos os transtornos.",
    },
    {
      icon: <UsersIcon className="text-orange-500 w-7 h-7 md:w-8 md:h-8" />,
      title: "Para toda a família",
      description: "Interface adaptada para crianças, adolescentes, pais e profissionais.",
    },
  ];

  const modules = [ /* ... */ ]; // Conteúdo omitido para brevidade
  const stats = [ /* ... */ ]; // Conteúdo omitido para brevidade
  const bibliography = [ /* ... */ ]; // Conteúdo omitido para brevidade

  return (
    <div className="font-sans antialiased bg-slate-50 text-slate-700">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-center items-center">
          <a href="/" className="flex items-center">
            <Image
              src="/images/logo-luditea.png"
              alt="Logo LudiTEA"
              width={500}
              height={156}
              className="w-48 sm:w-56 md:w-64 h-auto"
              priority
            />
          </a>
        </div>
      </header>

      <main>
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
              <a
                href="/login"
                className="bg-blue-600 text-white px-8 sm:px-10 py-3 md:py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-transform transform hover:-translate-y-1 text-base sm:text-lg inline-flex items-center"
              >
                Clique para conhecer e entrar
              </a>
            </div>
          </div>
        </section>
        
        {/* O restante do seu código continua aqui... */}
        {/* Por exemplo: <section id="features-section"> ... </section> */}

      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 md:py-16">
        {/* ... seu footer ... */}
      </footer>
    </div>
  );
};

export default App;
