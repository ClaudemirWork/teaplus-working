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

  // SVG Icons as components
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

  const modules = [
    {
      icon: <CheckCircleIcon className="text-blue-500 w-6 h-6 md:w-8 md:h-8" />,
      title: "Módulo TEA",
      subtitle: "Habilidades sociais e comunicação",
      items: ["Comunicação visual", "Interação social", "Rotinas estruturadas"],
      bgColor: "bg-blue-50",
      dotColor: "bg-blue-500"
    },
    {
      icon: <SparklesIcon className="text-orange-500 w-6 h-6 md:w-8 md:h-8" />,
      title: "Módulo TDAH",
      subtitle: "Funções executivas",
      items: ["Atenção e foco", "Memória de trabalho", "Controle inibitório"],
      bgColor: "bg-orange-50",
      dotColor: "bg-orange-500"
    },
    {
      icon: <BrainIcon className="text-emerald-500 w-6 h-6 md:w-8 md:h-8" />,
      title: "Interseção",
      subtitle: "Atividades integradas",
      items: ["Regulação emocional", "Autoconhecimento", "Tomada de decisão"],
      bgColor: "bg-emerald-50",
      dotColor: "bg-emerald-500"
    },
  ];

  const stats = [
    {
      value: "50-70%",
      label: "das crianças com TEA também apresentam TDAH",
      color: "text-blue-500"
    },
    {
      value: "32+",
      label: "atividades cientificamente validadas",
      color: "text-emerald-500"
    },
    {
      value: "100%",
      label: "segurança jurídica e conformidade",
      color: "text-orange-500"
    },
  ];

  const bibliography = [
    "Diamond, A. (2013). Executive Functions. Annual Review of Psychology",
    "ABA Intervention Strategies for Autism Spectrum Disorder",
    "TEACCH Structured Teaching Approaches",
    "CDC Guidelines for Autism Spectrum Disorder",
    "Neuropsychological Assessment for Developmental Disorders",
    "Social Scripts & Video Modeling Strategies",
    "DSM-5 Criteria for ADHD and Autism Spectrum",
    "Journal of Applied Behavior Analysis",
  ];

  return (
    <div className="font-sans antialiased bg-slate-50 text-slate-700">
      {/* ===== HEADER - Logo 2.5x MAIOR e centralizado ===== */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex justify-center items-center">
          <a href="/" className="flex items-center">
            <Image
              src="/images/logo-luditea.png"
              alt="Logo LudiTEA"
              width={500}
              height={156}
              className="w-full max-w-sm sm:max-w-md md:max-w-2xl h-auto"
              priority
            />
          </a>
        </div>
      </header>

      <main>
        {/* ===== HERO SECTION ===== */}
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

        {/* ===== FEATURES SECTION ===== */}
        <section id="features-section" className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Por que escolher o LudiTEA?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-2">
                Uma abordagem única e integrada para o desenvolvimento neurodivergente.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="text-center p-6 md:p-8 bg-slate-50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center bg-white shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base md:text-lg text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MODULES SECTION ===== */}
        <section className="py-12 sm:py-16 md:py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">Como funciona</h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-2">
                Três módulos integrados para um desenvolvimento completo, com atividades que se conectam.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {modules.map((module, index) => (
                <div 
                  key={index} 
                  className={`rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${module.bgColor}`}
                >
                  <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white rounded-full mx-auto mb-4 md:mb-6 shadow-md">
                    {module.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">{module.title}</h3>
                    <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-4">{module.subtitle}</p>
                  </div>
                  <ul className="space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg text-slate-700">
                    {module.items.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-emerald-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== STATS SECTION ===== */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-8 md:mb-12">
              Dados que importam
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
              {stats.map((stat, index) => (
                <div key={index} className="p-6 md:p-8">
                  <div className={`text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 sm:py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-sm">
              Comece sua jornada hoje
            </h2>
            <p className="text-lg sm:text-xl mb-8 md:mb-10 max-w-2xl mx-auto">
              Junte-se às famílias e profissionais que confiam no LudiTEA.
            </p>
            <a 
              href="/login" 
              className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-3 md:py-4 rounded-full font-bold shadow-lg hover:bg-blue-50 transition-transform transform hover:-translate-y-1"
            >
              Testar Gratuitamente
            </a>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-900 text-slate-400 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="sm:col-span-2 md:col-span-1">
              <a href="/" className="mb-4 inline-block">
                <Image
                  src="/images/logo-luditea.png"
                  alt="Logo LudiTEA"
                  width={320}
                  height={100}
                  className="h-20 md:h-24 w-auto object-contain"
                />
              </a>
              <p className="text-sm">
                Plataforma brasileira integrada para desenvolvimento neurodivergente, com foco em TEA e TDAH.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Produto</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Suporte</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Central de ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center">
            <h3 className="font-bold text-white mb-4">Bibliografia Completa</h3>
            <ul className="text-sm space-y-2 text-slate-500 list-none mb-8">
              {bibliography.map((ref, index) => (
                <li key={index}>{ref}</li>
              ))}
            </ul>
            <p className="text-sm text-slate-500">
              © 2025 LudiTEA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
