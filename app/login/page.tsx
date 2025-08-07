'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain } from 'lucide-react';

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
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'warning'

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
    
    const savedUser = localStorage.getItem('teaplus_user');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        
        if (userData.email === emailDigitado && userData.password === senhaDigitada) {
          userData.loginTime = new Date().toISOString();
          localStorage.setItem('teaplus_user', JSON.stringify(userData));
          
          localStorage.setItem('teaplus_session', 'active');
          
          showMessage('success', `Bem-vindo de volta, ${userData.name}!`);
          router.replace('/profileselection');
        } else {
          showMessage('error', `Dados incorretos! Verifique seu email e senha.`);
        }
      } catch (error) {
        showMessage('error', 'Dados da conta corrompidos. Tente criar uma nova conta.');
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
      created: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('teaplus_user', JSON.stringify(userData));
      localStorage.setItem('teaplus_session', 'active');
      
      showMessage('success', `Conta criada com sucesso para ${userData.name}!`);
      router.replace('/profileselection');
    } catch (error) {
      showMessage('error', 'Erro ao salvar conta. Tente novamente.');
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
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
            <Brain className="text-blue-500 w-8 h-8" />
          </div>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">TeaPlus Suite</h2>
          <p className="text-slate-600 text-sm">Aplicativo de apoio ao paciente com TEA, TDAH</p>
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
                className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
