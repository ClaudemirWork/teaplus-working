'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfileSelection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  const profiles = [
    {
      key: 'tea',
      title: 'TEA (Transtorno do Espectro Autista)',
      description: 'Focado em comunicação social e interação',
      icon: ' 🧩 ',
      color: '#4A90E2',
      route: '/tea'
    },
    {
      key: 'tdah',
      title: 'TDAH (Transtorno do Déficit de Atenção)',
      description: 'Focado em atenção, memória e organização',
      icon: ' ⚡ ',
      color: '#F5A623',
      route: '/tdah'
    },
    {
      key: 'combined',
      title: 'TEA e TDAH',
      description: 'Desenvolvimento geral integrado',
      icon: ' 🎯 ',
      color: '#8E44AD',
      route: '/combined'
    },
    {
      key: 'progress',
      title: 'Progresso do Paciente',
      description: 'Acompanhe a evolução de habilidades e metas',
      icon: ' 📈 ',
      color: '#1abc9c',
      route: '/progress-dashboard'
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let isMounted = true;
      const checkLogin = () => {
        try {
          const userData = localStorage.getItem('teaplus_user');
          const isLoggedIn = sessionStorage.getItem('teaplus_session');
          
          if (isMounted) {
            if (userData && isLoggedIn === 'active') {
              const parsedData = JSON.parse(userData);
              setUserInfo(parsedData);
              setIsLoading(false);
            } else {
              router.replace('/login');
            }
          }
        } catch (error) {
          if (isMounted) {
            router.replace('/login');
          }
        }
      };

      const timeoutId = setTimeout(checkLogin, 100);

      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    }
  }, [router]);

  const handleProfileSelect = (route: string) => {
    router.push(route);
  };

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair do aplicativo?')) {
      sessionStorage.removeItem('teaplus_session');
      window.alert('Logout realizado! Sua conta foi mantida para próximos acessos.');
      router.replace('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center w-full max-w-sm">
          <img src="/images/Teaplus-logo.png" alt="TeaPlus Logo" className="w-40 h-40 mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">TeaPlus</h1>
          <p className="text-sm sm:text-base text-gray-600">Verificando acesso...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6 sm:mb-8">
            <img src="/images/Teaplus-logo.png" alt="TeaPlus Logo" className="w-40 h-40 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">TeaPlus</h1>
          <p className="text-sm sm:text-base text-gray-600">Aplicativo de apoio ao paciente com TEA, TDAH</p>
          <p className="text-sm text-slate-500 mt-2">
            Olá, <strong className="text-slate-800">{userInfo?.name || 'Usuário'}</strong>
          </p>
        </div>

        <div className="space-y-4 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-center text-gray-700 mb-4 sm:mb-6">
            O que você gostaria de acompanhar hoje?
          </h2>
          
          {profiles.map((profile) => (
          // AQUI ESTÁ A CORREÇÃO: Troquei <button> por <div> e adicionei role e tabIndex
            <div
              key={profile.key}
            role="button"
            tabIndex={0}
              onClick={() => router.push(profile.route)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push(profile.route); }} // Melhora a acessibilidade
              className="w-full p-5 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 touch-manipulation min-h-[80px] sm:min-h-[auto] cursor-pointer"
              style={{ 
                borderColor: profile.color,
                background: `linear-gradient(135deg, ${profile.color}15, ${profile.color}05)`
              }}
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl sm:text-2xl flex-shrink-0">{profile.icon}</span>
                <div className="text-left flex-grow">
                  <div className="font-semibold text-sm sm:text-base text-slate-900">
                    {profile.title}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 mt-1">
                    {profile.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-400 mb-4">
            Selecione uma opção para começar
          </p>
          
          <div className="border-t pt-4 mt-4 mb-6">
            <p className="text-xs text-slate-500 leading-relaxed">
               🔒  <strong className="text-slate-800">Seus dados estão protegidos</strong><br/>
              Este aplicativo segue a LGPD (Lei Geral de Proteção de Dados). 
              Todas as informações são criptografadas e utilizadas exclusivamente 
              para seu desenvolvimento terapêutico.
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Versão 1.0 • Desenvolvido para fins terapêuticos
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-700 mb-2">
               👤  Sessão de <strong className="text-slate-800">{userInfo?.name || 'Usuário'}</strong>
            </p>
            <p className="text-xs text-blue-600 mb-3 break-all">
               📧  {userInfo?.email || 'email@exemplo.com'}
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-4 sm:py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 min-h-[48px] touch-manipulation"
            >
              <span> 🚪 </span>
              <span>Sair do Aplicativo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
