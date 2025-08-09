'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // 🔧 SOLUÇÃO: Sistema de storage compatível com iOS
  const storage = {
    // Detecta se localStorage está disponível
    isLocalStorageAvailable: () => {
      try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    },

    // Detecta se é iOS
    isIOS: () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    },

    // Salva dados com fallback para cookies no iOS
    setItem: (key: string, value: string) => {
      try {
        if (storage.isLocalStorageAvailable()) {
          localStorage.setItem(key, value);
          console.log('✅ Salvo no localStorage');
        } else {
          // Fallback para cookies no iOS
          const expires = new Date();
          expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 dias
          document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
          console.log('✅ Salvo em cookies (iOS fallback)');
        }
        return true;
      } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        return false;
      }
    },

    // Lê dados com fallback para cookies no iOS
    getItem: (key: string) => {
      try {
        if (storage.isLocalStorageAvailable()) {
          return localStorage.getItem(key);
        } else {
          // Fallback para cookies no iOS
          const nameEQ = key + "=";
          const ca = document.cookie.split(';');
          for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
              return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
          }
          return null;
        }
      } catch (error) {
        console.error('❌ Erro ao ler:', error);
        return null;
      }
    },

    // Session storage com fallback
    setSession: (key: string, value: string) => {
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(key, value);
        }
        // Para iOS, também salva em localStorage como backup
        if (storage.isIOS()) {
          storage.setItem(`session_${key}`, value);
        }
        return true;
      } catch {
        return false;
      }
    },

    // Verifica session com fallback
    getSession: (key: string) => {
      try {
        if (typeof sessionStorage !== 'undefined') {
          const sessionValue = sessionStorage.getItem(key);
          if (sessionValue) return sessionValue;
        }
        // Fallback para iOS
        if (storage.isIOS()) {
          return storage.getItem(`session_${key}`);
        }
        return null;
      } catch {
        return null;
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showMessage = (type: string, text: string) => {
    setMessageType(type);
    setMessage(text);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      showMessage('error', 'Por favor, preencha email e senha.');
      return;
    }
    
    const emailDigitado = formData.email.trim().toLowerCase();
    const senhaDigitada = formData.password;
    
    // 🔧 CORREÇÃO: Usa o storage compatível com iOS
    const savedUser = storage.getItem('teaplus_user');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        
        if (userData.email === emailDigitado && userData.password === senhaDigitada) {
          userData.loginTime = new Date().toISOString();
          
          // 🔧 CORREÇÃO: Salva com fallback para iOS
          const saved = storage.setItem('teaplus_user', JSON.stringify(userData));
          const sessionSet = storage.setSession('teaplus_session', 'active');
          
          if (saved) {
            showMessage('success', `Bem-vindo de volta, ${userData.name}!`);
            setTimeout(() => {
              router.replace('/profileselection');
            }, 1000);
          } else {
            showMessage('error', 'Erro ao salvar sessão. Tente novamente.');
          }
        } else {
          showMessage('error', `Dados incorretos! Verifique seu email e senha.`);
        }
      } catch (error) {
        showMessage('error', 'Dados da conta corrompidos. Tente criar uma nova conta.');
        console.error('Erro ao processar dados:', error);
      }
    } else {
      showMessage('warning', 'Nenhuma conta encontrada. Crie uma nova conta primeiro.');
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      showMessage('error', 'Por favor, preencha todos os campos.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      showMessage('error', 'As senhas não coincidem.');
      return;
    }
    
    if (formData.password.length < 6) {
      showMessage('warning', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    const emailNormalizado = formData.email.trim().toLowerCase();
    const userData = {
      name: formData.name.trim(),
      email: emailNormalizado,
      password: formData.password,
      loginTime: new Date().toISOString(),
      created: new Date().toISOString(),
      platform: storage.isIOS() ? 'iOS' : 'other' // Identifica plataforma
    };
    
    // 🔧 CORREÇÃO: Usa o storage compatível com iOS
    const saved = storage.setItem('teaplus_user', JSON.stringify(userData));
    const sessionSet = storage.setSession('teaplus_session', 'active');
    
    if (saved) {
      showMessage('success', `Conta criada com sucesso para ${userData.name}!`);
      setTimeout(() => {
        router.replace('/profileselection');
      }, 1000);
    } else {
      showMessage('error', 'Erro ao salvar conta. Verifique se o navegador permite armazenamento.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (isLogin) {
      handleLogin(e);
    } else {
      handleCreateAccount(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 shadow-lg">
        <div className="flex justify-center mb-6">
            <img src="/images/Teaplus-logo.png" alt="TeaPlus Logo" className="w-40 h-40" />
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">TeaPlus Suite</h2>
          <p className="text-slate-600 text-sm">Aplicativo de apoio ao paciente com TEA, TDAH</p>
          {/* 🔧 ADIÇÃO: Indicador de plataforma para debug */}
          {storage.isIOS() && (
            <p className="text-xs text-blue-600 mt-1">📱 Otimizado para iOS</p>
          )}
        </div>

        {message && (
          <div className={`p-4 mb-4 text-center rounded-lg ${messageType === 'success' ? 'bg-emerald-100 text-emerald-800' : messageType === 'error' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
            {message}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <button
            onClick={() => { setIsLogin(true); setMessage(''); }}
            className={`py-2 px-6 rounded-full font-medium transition-colors duration-200 ${isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'}`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setIsLogin(false); setMessage(''); }}
            className={`py-2 px-6 rounded-full font-medium transition-colors duration-200 ${!isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'}`}
          >
            Criar Conta
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="name" className="sr-only">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Nome completo"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-5 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors transform hover:-translate-y-0.5"
          >
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        {isLogin && (
          <div className="text-center mt-4 text-sm">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Esqueceu a senha?</a>
          </div>
        )}
      </div>
    </div>
  );
}
