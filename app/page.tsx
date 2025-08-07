import React, { useState } from 'react';
import {
  Brain,
  Target,
  Users,
  Puzzle,
  Bolt,
  Zap,
  CheckCircle,
  ChevronRight,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

// Tailwind CSS is assumed to be available.
// This is a self-contained React component for the landing page.

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: <Brain className="text-blue-500 w-8 h-8" />,
      title: "Baseado em Ciência",
      description: "Atividades fundamentadas em ABA, TEACCH e Neuropsicologia Cognitiva.",
    },
    {
      icon: <HeartHandshake className="text-emerald-500 w-8 h-8" />,
      title: "Integração TEA (Transtorno Espectro Autista) + TDAH (Transtorno Déficit de Atenção e Hiperatividade)",
      description: "Primeira plataforma brasileira a trabalhar especificamente com ambos os transtornos.",
    },
    {
      icon: <Users className="text-orange-500 w-8 h-8" />,
      title: "Para toda a família",
      description: "Interface adaptada para crianças, adolescentes, pais e profissionais.",
    },
  ];

  const modules = [
    {
      icon: <Puzzle className="text-blue-500 w-8 h-8" />,
      title: "Módulo TEA",
      subtitle: "Habilidades sociais e comunicação",
      items: ["Comunicação visual", "Interação social", "Rotinas estruturadas"],
      bgColor: "bg-blue-50",
      dotColor: "bg-blue-500"
    },
    {
      icon: <Zap className="text-orange-500 w-8 h-8" />,
      title: "Módulo TDAH",
      subtitle: "Funções executivas",
      items: ["Atenção e foco", "Memória de trabalho", "Controle inibitório"],
      bgColor: "bg-orange-50",
      dotColor: "bg-orange-500"
    },
    {
      icon: <Sparkles className="text-emerald-500 w-8 h-8" />,
      title: "Interseção",
      subtitle: "Atividades integradas",
      items: ["Regulação emocional", "Autoconhecimento", "Tomada de decisão"],
      bgColor: "bg-emerald-50",
      dotColor: "bg-emerald-500"
    },
  ];

  const stats = [
    { value: "50-70%", label: "das crianças com TEA também apresentam TDAH", color: "text-blue-500" },
    { value: "32+", label: "atividades cientificamente validadas", color: "text-emerald-500" },
    { value: "100%", label: "segurança jurídica e conformidade", color: "text-orange-500" },
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
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">T+</span>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800">TeaPlus</span>
              <div className="text-xs text-slate-500">TEA + TDAH</div>
            </div>
          </div>
          {/* O botão "Entrar" agora direciona para a seção de login nesta mesma página */}
          <a href="#login-section" className="bg-slate-900 text-white px-6 py-2 rounded-full font-medium hover:bg-slate-700 transition-colors shadow-lg">
            Entrar
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-100 to-white py-20 animate-fade-in">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 leading-tight drop-shadow-sm">
              Uma jornada de <span className="text-blue-600">descobertas</span> e <span className="text-emerald-600">desenvolvimento</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
              A primeira plataforma brasileira integrada para o desenvolvimento de habilidades em pessoas com TEA e TDAH, com foco na individualidade e no aprendizado divertido.
            </p>
            <div className="flex justify-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-transform transform hover:-translate-y-1">
                Leia abaixo para conhecer mais
                <ChevronRight className="inline-block ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Por que escolher o TeaPlus?</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">Uma abordagem única e integrada para o desenvolvimento neurodivergente.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-8 bg-slate-50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-white shadow-inner`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-lg text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Como funciona</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Três módulos integrados para um desenvolvimento completo, com atividades que se conectam.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {modules.map((module, index) => (
                <div key={index} className={`rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${module.bgColor}`}>
                  <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mx-auto mb-6 shadow-md">
                    {module.icon}
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{module.title}</h3>
                    <p className="text-lg text-slate-600 mb-4">{module.subtitle}</p>
                  </div>
                  <ul className="space-y-3 text-lg text-slate-700">
                    {module.items.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className={`w-6 h-6 mr-3 text-emerald-500`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-12">Dados que importam</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {stats.map((stat, index) => (
                <div key={index} className="p-8">
                  <div className={`text-5xl font-extrabold mb-2 ${stat.color}`}>{stat.value}</div>
                  <p className="text-lg text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Login/Signup Section */}
        {/* Adicionado o ID para que o botão "Entrar" no cabeçalho possa direcionar para cá */}
        <section id="login-section" className="bg-slate-50 py-24">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Brain className="text-blue-500 w-8 h-8" />
                </div>
              </div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">TeaPlus Suite</h2>
                <p className="text-slate-600 text-sm">Aplicativo de apoio ao paciente com TEA, TDAH</p>
              </div>

              {/* Login/Signup Toggles */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`py-2 px-6 rounded-full font-medium ${isLogin ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`py-2 px-6 rounded-full font-medium ${!isLogin ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
                >
                  Criar Conta
                </button>
              </div>

              <form className="space-y-4">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="sr-only">Nome</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Nome completo"
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
                    className="w-full px-5 py-3 rounded-full bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Senha</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Digite sua senha"
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
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">T+</span>
                </div>
                <span className="text-xl font-bold text-white">TeaPlus</span>
              </div>
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
            <ul className="text-sm space-y-2 text-slate-500 list-none">
              {bibliography.map((ref, index) => (
                <li key={index}>{ref}</li>
              ))}
            </ul>
            <p className="text-sm text-slate-500 mt-8">
              © 2025 TeaPlus. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
