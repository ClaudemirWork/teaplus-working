'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSelection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  const profiles = [
    {
      key: 'tea',
      title: 'TEA (Transtorno do Espectro Autista)',
      description: 'Focado em comunicação social e interação',
      icon: '🧩',
      color: '#4A90E2',
      route: '/tea'
    },
    {
      key: 'tdah',
      title: 'TDAH (Transtorno do Déficit de Atenção)',
      description: 'Focado em atenção, memória e organização',
      icon: '⚡',
      color: '#F5A623',
      route: '/tdah'
    },
    {
      key: 'combined',
      title: 'TEA e TDAH',
      description: 'Desenvolvimento geral integrado',
      icon: '🎯',
      color: '#8E44AD',
      route: '/combined'
    }
  ];

  // Verificar login apenas UMA VEZ
  useEffect(() => {
    let isMounted = true;
    
    const checkLogin = () => {
      try {
        // Verificar se tem conta salva
        const userData = localStorage.getItem('teaplus_user');
        // Verificar se está logado (sessão ativa)
        const isLoggedIn = localStorage.getItem('teaplus_session');
        
        console.log('=== VERIFICAÇÃO DE ACESSO ===');
        console.log('Dados da conta:', userData);
        console.log('Sessão ativa:', isLoggedIn);
        
        if (isMounted) {
          if (userData && isLoggedIn === 'active') {
            const parsedData = JSON.parse(userData);
            console.log('Usuário logado:', parsedData);
            setUserInfo(parsedData);
            setIsLoading(false);
          } else {
            console.log('Redirecionando para login - Sessão inativa');
            window.location.replace('/login');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar login:', error);
        if (isMounted) {
          window.location.replace('/login');
        }
      }
    };

    // Pequeno delay para evitar conflitos
    const timeoutId = setTimeout(checkLogin, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const handleProfileSelect = (route: string) => {
    router.push(route);
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente sair do aplicativo?')) {
      console.log('=== FAZENDO LOGOUT ===');
      
      // Remove APENAS a sessão ativa, mantém os dados da conta
      localStorage.removeItem('teaplus_session');
      
      // Verifica se conta ainda existe após logout
      const userData = localStorage.getItem('teaplus_user');
      console.log('Dados da conta após logout:', userData ? 'Mantidos' : 'Removidos');
      
      alert('Logout realizado! Sua conta foi mantida para próximos acessos.');
      window.location.replace('/login');
    }
  };

  // Tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center w-full max-w-sm">
          <div className="text-4xl sm:text-6xl mb-4">☀️</div>
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
          <div className="text-4xl sm:text-6xl mb-4">☀️</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">TeaPlus</h1>
          <p className="text-sm sm:text-base text-gray-600">Aplicativo de apoio ao paciente com TEA, TDAH</p>
          <p className="text-sm text-gray-500 mt-2">
            Olá, <strong>{userInfo?.name || 'Usuário'}</strong>
          </p>
        </div>

        <div className="space-y-4 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-center text-gray-700 mb-4 sm:mb-6">
            O que você gostaria de acompanhar hoje?
          </h2>
          
          {profiles.map((profile) => (
            <button
              key={profile.key}
              onClick={() => handleProfileSelect(profile.route)}
              className="w-full p-5 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 touch-manipulation min-h-[80px] sm:min-h-[auto]"
              style={{ 
                borderColor: profile.color,
                background: `linear-gradient(135deg, ${profile.color}15, ${profile.color}05)`
              }}
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl sm:text-2xl flex-shrink-0">{profile.icon}</span>
                <div className="text-left flex-grow">
                  <div className="font-semibold text-sm sm:text-base" style={{ color: profile.color }}>
                    {profile.title}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    {profile.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400 mb-4">
            Selecione uma opção para começar
          </p>
          
          {/* LGPD Information */}
          <div className="border-t pt-4 mt-4 mb-6">
            <p className="text-xs text-gray-500 leading-relaxed">
              🔒 <strong>Seus dados estão protegidos</strong><br/>
              Este aplicativo segue a LGPD (Lei Geral de Proteção de Dados). 
              Todas as informações são criptografadas e utilizadas exclusivamente 
              para seu desenvolvimento terapêutico.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Versão 1.0 • Desenvolvido para fins terapêuticos
            </p>
          </div>

          {/* Botão Sair em Destaque */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-700 mb-2">
              👤 Sessão de <strong>{userInfo?.name || 'Usuário'}</strong>
            </p>
            <p className="text-xs text-blue-600 mb-3 break-all">
              📧 {userInfo?.email || 'email@exemplo.com'}
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-4 sm:py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 min-h-[48px] touch-manipulation"
            >
              <span>🚪</span>
              <span>Sair do Aplicativo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}