'use client';
import React, { useState } from 'react';

export default function LoginPage() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNewUser) {
      // Criação de nova conta
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        alert('As senhas não coincidem.');
        return;
      }
      
      if (formData.password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
      
      // Preparar dados da conta
      const emailNormalizado = formData.email.trim().toLowerCase();
      const userData = {
        name: formData.name.trim(),
        email: emailNormalizado,
        password: formData.password,
        loginTime: new Date().toISOString(),
        created: new Date().toISOString()
      };
      
      console.log('=== CRIANDO NOVA CONTA ===');
      console.log('Dados a serem salvos:', userData);
      
      try {
        // Salvar conta permanente
        localStorage.setItem('teaplus_user', JSON.stringify(userData));
        
        // Criar sessão ativa
        localStorage.setItem('teaplus_session', 'active');
        
        // Verificar se foi salvo corretamente
        const verificacao = localStorage.getItem('teaplus_user');
        const sessao = localStorage.getItem('teaplus_session');
        
        console.log('Conta salva:', verificacao);
        console.log('Sessão criada:', sessao);
        
        if (verificacao && sessao) {
          alert(`Conta criada com sucesso para ${userData.name}!\nEmail: ${userData.email}`);
          window.location.href = '/';
        } else {
          alert('Erro ao salvar conta. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao criar conta:', error);
        alert('Erro ao criar conta. Tente novamente.');
      }
      
    } else {
      // Login existente
      if (!formData.email || !formData.password) {
        alert('Por favor, preencha email e senha.');
        return;
      }
      
      const emailDigitado = formData.email.trim().toLowerCase();
      const senhaDigitada = formData.password;
      
      console.log('=== TENTATIVA DE LOGIN ===');
      console.log('Email digitado:', emailDigitado);
      console.log('Senha digitada:', senhaDigitada);
      
      const savedUser = localStorage.getItem('teaplus_user');
      console.log('Dados da conta:', savedUser);
      
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          console.log('Dados parsados:', userData);
          console.log('Email salvo:', userData.email);
          console.log('Senha salva:', userData.password);
          
          console.log('=== COMPARAÇÃO ===');
          console.log('Email match:', userData.email === emailDigitado);
          console.log('Senha match:', userData.password === senhaDigitada);
          
          if (userData.email === emailDigitado && userData.password === senhaDigitada) {
            console.log('=== LOGIN SUCESSO ===');
            
            // Atualizar último login
            userData.loginTime = new Date().toISOString();
            localStorage.setItem('teaplus_user', JSON.stringify(userData));
            
            // Criar sessão ativa
            localStorage.setItem('teaplus_session', 'active');
            
            alert(`Bem-vindo de volta, ${userData.name}!`);
            window.location.href = '/';
          } else {
            console.log('=== LOGIN FALHOU ===');
            alert(`Dados incorretos!\n\nVerifique:\n• Email: ${emailDigitado}\n• Senha digitada\n\nTente novamente.`);
          }
        } catch (error) {
          console.error('Erro ao fazer parse dos dados:', error);
          alert('Dados corrompidos. Crie uma nova conta.');
        }
      } else {
        console.log('=== NENHUMA CONTA ENCONTRADA ===');
        alert('Nenhuma conta encontrada. Crie uma nova conta primeiro.');
      }
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      alert('Por favor, digite seu email.');
      return;
    }
    
    const emailDigitado = formData.email.trim().toLowerCase();
    const savedUser = localStorage.getItem('teaplus_user');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.email === emailDigitado) {
          const newPassword = prompt('Digite sua nova senha (mínimo 6 caracteres):');
          if (newPassword && newPassword.length >= 6) {
            userData.password = newPassword;
            localStorage.setItem('teaplus_user', JSON.stringify(userData));
            alert('Senha alterada com sucesso! Faça login com a nova senha.');
            setShowForgotPassword(false);
            setFormData({ name: '', email: formData.email, password: '', confirmPassword: '' });
          } else {
            alert('Senha deve ter pelo menos 6 caracteres.');
          }
        } else {
          alert(`Email "${emailDigitado}" não encontrado.`);
        }
      } catch (error) {
        alert('Erro ao processar solicitação.');
      }
    } else {
      alert('Nenhuma conta encontrada. Crie uma nova conta.');
    }
  };

  // Função para mostrar dados salvos (para debug)
  const showSavedData = () => {
    const savedUser = localStorage.getItem('teaplus_user');
    const session = localStorage.getItem('teaplus_session');
    
    console.log('=== DEBUG INFO ===');
    console.log('Conta salva:', savedUser);
    console.log('Sessão ativa:', session);
    
    if (savedUser || session) {
      alert(`Dados no storage:\n\nConta: ${savedUser ? 'EXISTE' : 'NÃO EXISTE'}\nSessão: ${session || 'INATIVA'}\n\nVeja console (F12) para detalhes.`);
    } else {
      alert('Nenhum dado encontrado no localStorage');
    }
  };

  if (showForgotPassword) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 8, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 80, height: 80, margin: '0 auto 16px', background: '#fff3cd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 40 }}>🔑</span>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: '#856404', marginBottom: 8 }}>Recuperar Senha</h1>
              <p style={{ color: '#555', fontSize: 14 }}>Digite seu email para redefinir a senha</p>
            </div>
            
            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>
              
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#ffc107',
                  color: '#000',
                  fontWeight: 600,
                  padding: 12,
                  border: 'none',
                  borderRadius: 6,
                  marginTop: 8,
                  cursor: 'pointer'
                }}
              >
                Redefinir Senha
              </button>
              
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#6c757d',
                  fontWeight: 500,
                  padding: 8,
                  border: '1px solid #dee2e6',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                ← Voltar ao Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 8, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 80, height: 80, margin: '0 auto 16px', background: '#e3f2fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 40 }}>🧠</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1976d2', marginBottom: 8 }}>TeaPlus Suite</h1>
            <p style={{ color: '#555', fontSize: 16 }}>Aplicativo de apoio ao paciente com TEA, TDAH</p>
          </div>
          
          {/* Botão de Debug */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <button
              type="button"
              onClick={showSavedData}
              style={{
                padding: '4px 8px',
                fontSize: 10,
                background: '#ffc107',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              🔍 Ver Status (Debug)
            </button>
          </div>
          
          {/* Toggle entre Login e Criar Conta */}
          <div style={{ display: 'flex', marginBottom: 20, background: '#f8f9fa', borderRadius: 6, padding: 4 }}>
            <button
              type="button"
              onClick={() => {
                setIsNewUser(false);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
              style={{
                flex: 1,
                padding: 8,
                border: 'none',
                borderRadius: 4,
                background: !isNewUser ? '#1976d2' : 'transparent',
                color: !isNewUser ? '#fff' : '#6c757d',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setIsNewUser(true);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
              style={{
                flex: 1,
                padding: 8,
                border: 'none',
                borderRadius: 4,
                background: isNewUser ? '#1976d2' : 'transparent',
                color: isNewUser ? '#fff' : '#6c757d',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Criar Conta
            </button>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {isNewUser && (
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Nome Completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
                  placeholder="Digite seu nome completo"
                  required={isNewUser}
                />
              </div>
            )}
            
            <div>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
                placeholder="Digite seu e-mail"
                required
              />
            </div>
            
            <div>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
                placeholder="Digite sua senha"
                required
              />
            </div>
            
            {isNewUser && (
              <div>
                <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Confirmar Senha</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
                  placeholder="Confirme sua senha"
                  required={isNewUser}
                />
              </div>
            )}
            
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#1976d2',
                color: '#fff',
                fontWeight: 600,
                padding: 12,
                border: 'none',
                borderRadius: 6,
                marginTop: 8,
                cursor: 'pointer'
              }}
            >
              {isNewUser ? 'Criar Conta' : 'Entrar'}
            </button>
            
            {!isNewUser && (
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#1976d2',
                  fontWeight: 500,
                  padding: 8,
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Esqueceu a senha?
              </button>
            )}
          </form>
          
          {/* Informação adicional */}
          <div style={{ marginTop: 20, padding: 12, background: '#f0f8ff', borderRadius: 6, border: '1px solid #e3f2fd' }}>
            <p style={{ fontSize: 12, color: '#1976d2', textAlign: 'center', margin: 0 }}>
              🔐 <strong>Acesso Seguro:</strong> Sua conta fica salva mesmo após logout
            </p>
          </div>
        </div>
      </div>
      <div style={{ background: '#f0f0f0', padding: 12, textAlign: 'center', fontSize: 12, color: '#888' }}>
        <strong>Disclaimer LGPD:</strong> Seus dados pessoais são coletados e tratados em conformidade com a Lei Geral de Proteção de Dados (LGPD). As informações fornecidas serão utilizadas exclusivamente para personalizar sua experiência no aplicativo e acompanhar seu progresso.
      </div>
    </div>
  );
}