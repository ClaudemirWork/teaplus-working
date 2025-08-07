'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula uma autenticação bem-sucedida.
    // Em um ambiente de produção, esta lógica deve ser substituída por uma chamada de API.
    if (email && password) {
      const userData = { name: 'Usuário', email: email };
      localStorage.setItem('teaplus_user', JSON.stringify(userData));
      localStorage.setItem('teaplus_session', 'active');
      router.push('/profileselection');
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula a criação de uma conta.
    // Em um ambiente de produção, esta lógica deve ser substituída por uma chamada de API.
    if (name && email && password) {
      const userData = { name: name, email: email };
      localStorage.setItem('teaplus_user', JSON.stringify(userData));
      localStorage.setItem('teaplus_session', 'active');
      router.push('/profileselection');
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

        {/* Toggles de Entrar/Criar Conta */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`py-2 px-6 rounded-full font-medium transition-colors duration-200 ${isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'}`}
          >
            Entrar
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`py-2 px-6 rounded-full font-medium transition-colors duration-200 ${!isLogin ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'}`}
          >
            Criar Conta
          </button>
        </div>

        <form className="space-y-4" onSubmit={isLogin ? handleLogin : handleCreateAccount}>
          {!isLogin && (
            <div>
              <label htmlFor="name" className="sr-only">Nome</label>
              <input
                type="text"
                id="name"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
