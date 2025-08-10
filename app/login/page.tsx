'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    }, 8000); // Mais tempo para ler mensagens de email
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.email || !formData.password) {
      showMessage('error', 'Por favor, preencha email e senha.');
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          showMessage('error', 'Email ou senha incorretos. Verifique seus dados.');
        } else if (error.message.includes('Email not confirmed')) {
          showMessage('warning', 'Você precisa confirmar seu email antes de fazer login. Verifique sua caixa de entrada.');
        } else {
          showMessage('error', `Erro no login: ${error.message}`);
        }
      } else if (data.user) {
        // Verificar se o email foi confirmado
        if (!data.user.email_confirmed_at) {
          showMessage('warning', 'Você precisa confirmar seu email antes de continuar. Verifique sua caixa de entrada.');
        } else {
          showMessage('success', `Bem-vindo de volta, ${data.user.user_metadata?.name || data.user.email}!`);
          setTimeout(() => {
            router.replace('/profileselection');
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Erro no login:', error);
      showMessage('error', 'Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      showMessage('error', 'Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      showMessage('error', 'As senhas não coincidem.');
      setIsLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      showMessage('warning', 'A senha deve ter pelo menos 6 caracteres.');
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            name: formData.name.trim(),
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          showMessage('warning', 'Este email já está cadastrado. Tente fazer login ou use outro email.');
        } else {
          showMessage('error', `Erro no cadastro: ${error.message}`);
        }
      } else if (data.user) {
        showMessage('success', `Conta criada com sucesso! Enviamos um email de confirmação para ${formData.email}. Verifique sua caixa de entrada e spam.`);
        // Limpar formulário
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        // Trocar para tela de login
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      showMessage('error', 'Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
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
          <p className="text-xs text-green-600 mt-1">🔒 Autenticação Segura</p>
        </div>

        {message && (
          <div className={`p-4 mb-4 text-center rounded-lg text-sm ${
            messageType === 'success' 
              ? 'bg-emerald-100 text-emerald-800' 
              : messageType === 'error' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            {message}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <button
            onClick={() => { setIsLogin(true); setMessage(''); }}
            className={`py-2 px-6 rounded-full font-medium transition-colors duration-200 ${
              isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setIsLogin(false); setMessage(''); }}
            className={`py-2 px-6 rounded-full font-medium transition-colors duration-200 ${
              !isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'
            }`}
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
                disabled={isLoading}
                className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
              disabled={isLoading}
              className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
              disabled={isLoading}
              className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
                disabled={isLoading}
                className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white px-5 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading 
              ? (isLogin ? 'Entrando...' : 'Criando conta...') 
              : (isLogin ? 'Entrar' : 'Criar Conta')
            }
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
