'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Componente para os ícones dos cards
const FeatureIcon = ({ icon, colorClass }: { icon: React.ReactNode, colorClass: string }) => (
    <div className={`rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 ${colorClass}`}>
        {icon}
    </div>
);

// Componente da Página Principal
export default function LandingPage() {
    const router = useRouter();

    // Lógica essencial: redireciona o usuário se já estiver logado
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isLoggedIn = localStorage.getItem('teaplus_session');
            if (isLoggedIn === 'active') {
                router.replace('/profileselection');
            }
        }
    }, [router]);

    return (
        <>
            {/* CSS otimizado para mobile */}
            <style jsx global>{`
                body {
                    font-family: 'Nunito', sans-serif;
                    overflow-x: hidden;
                }
                .hero-section {
                    background: linear-gradient(135deg, #F0F8FF 0%, #E6E6FA 100%);
                    min-height: 60vh;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 1s ease-out forwards;
                    opacity: 0;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .delay-1 { animation-delay: 0.2s; }
                .delay-2 { animation-delay: 0.4s; }
                .delay-3 { animation-delay: 0.6s; }
                
                /* Melhorias específicas para mobile */
                @media (max-width: 640px) {
                    .container {
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }
                }
            `}</style>
            
            <div className="bg-gray-50 text-gray-800 overflow-x-hidden">
                {/* Header Responsivo */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                    <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                             {/* Logo Responsivo */}
                            <Image 
                                src="/images/logo-luditea.png" 
                                alt="Logo LudiTEA" 
                                width={120} 
                                height={38} 
                                className="h-8 sm:h-10 md:h-12 w-auto" 
                            />
                        </div>
                        <Link 
                            href="/login" 
                            className="bg-indigo-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full hover:bg-indigo-700 transition-colors duration-300 text-sm sm:text-base"
                        >
                            Entrar
                        </Link>
                    </div>
                </header>

                {/* Seção Principal (Hero) - Completamente Responsiva */}
                <main className="hero-section">
                    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 text-center lg:text-left">
                            {/* Imagem dos Mascotes - Responsiva */}
                            <div className="w-full lg:w-1/2 flex justify-center animate-fade-in-up order-1 lg:order-1">
                                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                                    <Image 
                                        src="/images/Leo_Mila_e_LudiTEA.webp" 
                                        alt="Mascotes Leo e Mila com o logo do LudiTEA" 
                                        width={512} 
                                        height={350} 
                                        className="w-full h-auto rounded-lg shadow-lg" 
                                        priority 
                                        sizes="(max-width: 640px) 280px, (max-width: 768px) 400px, (max-width: 1024px) 500px, 600px"
                                    />
                                </div>
                            </div>
                            
                            {/* Texto da Seção Principal - Responsivo */}
                            <div className="w-full lg:w-1/2 order-2 lg:order-2">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-800 leading-tight animate-fade-in-up delay-1 mb-4">
                                    Uma jornada de{' '}
                                    <span className="text-indigo-600">descobertas</span>
                                    {' '}e{' '}
                                    <span className="text-green-500">desenvolvimento</span>
                                </h1>
                                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-2 mb-6 sm:mb-8 px-2 sm:px-0">
                                    A primeira plataforma brasileira integrada para o desenvolvimento de habilidades em pessoas com TEA e TDAH, com foco na individualidade e no aprendizado divertido.
                                </p>
                                <div className="animate-fade-in-up delay-3">
                                    <Link 
                                        href="#features" 
                                        className="bg-indigo-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-sm sm:text-base lg:text-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 inline-block shadow-lg"
                                    >
                                        Conheça mais
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Seção "Por que escolher o LudiTEA?" - Responsiva */}
                <section id="features" className="py-12 sm:py-16 md:py-20">
                    <div className="container mx-auto px-4 sm:px-6 text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mb-3 sm:mb-4">
                            Por que escolher o LudiTEA?
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-4 sm:px-0">
                            Uma abordagem única e integrada para o desenvolvimento neurodivergente, criada com o apoio de especialistas e o carinho que sua família merece.
                        </p>
                        
                        {/* Grid Responsivo dos Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                <FeatureIcon 
                                    colorClass="bg-indigo-100" 
                                    icon={
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>
                                    } 
                                />
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                                    Ferramentas Terapêuticas
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    Atividades e jogos desenvolvidos para trabalhar habilidades cognitivas, sociais e emocionais de forma lúdica.
                                </p>
                            </div>
                            
                            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                <FeatureIcon 
                                    colorClass="bg-green-100" 
                                    icon={
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                        </svg>
                                    } 
                                />
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                                    Acompanhamento de Progresso
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    Métricas detalhadas e relatórios visuais para que pais e terapeutas possam acompanhar a evolução da criança.
                                </p>
                            </div>
                            
                            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
                                <FeatureIcon 
                                    colorClass="bg-pink-100" 
                                    icon={
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                        </svg>
                                    } 
                                />
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                                    Ambiente Seguro e Divertido
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    Uma plataforma sem anúncios, com conteúdo cuidadosamente selecionado para garantir uma experiência positiva.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Responsivo */}
                <footer className="bg-gray-800 text-white py-6 sm:py-8">
                    <div className="container mx-auto px-4 sm:px-6 text-center">
                        <p className="text-sm sm:text-base">&copy; 2025 LudiTEA. Todos os direitos reservados.</p>
                        <p className="text-xs sm:text-sm text-gray-400 mt-2">Feito com carinho para a jornada do neuroaprendizado.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
