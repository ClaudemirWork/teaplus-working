<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LudiTEA - Plataforma de Desenvolvimento Neurodivergente</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out;
        }
    </style>
</head>
<body class="font-sans antialiased bg-slate-50 text-slate-700">
    <!-- HEADER CORRIGIDO: Logo aumentado significativamente -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex justify-between items-center">
            <a href="/" class="flex items-center">
                <!-- Logo bem maior e proporcional -->
                <img src="/images/logo-luditea.png" 
                     alt="Logo LudiTEA" 
                     class="h-16 sm:h-20 md:h-24 w-auto object-contain">
            </a>
            <a href="/login" 
               class="bg-slate-900 text-white px-4 sm:px-6 py-2 md:py-2.5 rounded-full font-medium text-sm md:text-base hover:bg-slate-700 transition-colors shadow-lg whitespace-nowrap">
                Entrar
            </a>
        </div>
    </header>

    <main>
        <!-- HERO SECTION - Responsiva -->
        <section class="bg-gradient-to-br from-blue-100 to-white py-12 sm:py-16 md:py-20 animate-fade-in">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight drop-shadow-sm">
                    Uma jornada de <span class="text-blue-600">descobertas</span> e 
                    <span class="text-emerald-600">desenvolvimento</span>
                </h1>
                <p class="text-base sm:text-lg md:text-xl text-slate-600 mb-8 md:mb-10 max-w-3xl mx-auto px-2">
                    A primeira plataforma brasileira integrada para o desenvolvimento de habilidades em pessoas com TEA e TDAH, 
                    com foco na individualidade e no aprendizado divertido.
                </p>
                <div class="flex justify-center">
                    <a href="#features-section" 
                       class="bg-blue-600 text-white px-6 sm:px-8 py-3 md:py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-transform transform hover:-translate-y-1 text-sm sm:text-base">
                        Leia abaixo para conhecer mais
                        <i class="fas fa-chevron-right ml-2"></i>
                    </a>
                </div>
            </div>
        </section>

        <!-- FEATURES SECTION -->
        <section id="features-section" class="py-12 sm:py-16 md:py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-10 md:mb-16">
                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Por que escolher o LudiTEA?
                    </h2>
                    <p class="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-2">
                        Uma abordagem única e integrada para o desenvolvimento neurodivergente.
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                    <!-- Feature 1 -->
                    <div class="text-center p-6 md:p-8 bg-slate-50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <div class="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center bg-white shadow-inner">
                            <i class="fas fa-brain text-blue-500 text-2xl md:text-3xl"></i>
                        </div>
                        <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-2">Baseado em Ciência</h3>
                        <p class="text-sm sm:text-base md:text-lg text-slate-600">
                            Atividades fundamentadas em ABA, TEACCH e Neuropsicologia Cognitiva.
                        </p>
                    </div>
                    <!-- Feature 2 -->
                    <div class="text-center p-6 md:p-8 bg-slate-50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <div class="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center bg-white shadow-inner">
                            <i class="fas fa-hands-helping text-emerald-500 text-2xl md:text-3xl"></i>
                        </div>
                        <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-2">Integração TEA + TDAH</h3>
                        <p class="text-sm sm:text-base md:text-lg text-slate-600">
                            Primeira plataforma brasileira a trabalhar especificamente com ambos os transtornos.
                        </p>
                    </div>
                    <!-- Feature 3 -->
                    <div class="text-center p-6 md:p-8 bg-slate-50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <div class="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-4 md:mb-6 flex items-center justify-center bg-white shadow-inner">
                            <i class="fas fa-users text-orange-500 text-2xl md:text-3xl"></i>
                        </div>
                        <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-2">Para toda a família</h3>
                        <p class="text-sm sm:text-base md:text-lg text-slate-600">
                            Interface adaptada para crianças, adolescentes, pais e profissionais.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- MODULES SECTION -->
        <section class="py-12 sm:py-16 md:py-20 bg-slate-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-10 md:mb-16">
                    <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">Como funciona</h2>
                    <p class="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-2">
                        Três módulos integrados para um desenvolvimento completo, com atividades que se conectam.
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                    <!-- Module TEA -->
                    <div class="rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-blue-50">
                        <div class="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white rounded-full mx-auto mb-4 md:mb-6 shadow-md">
                            <i class="fas fa-check-circle text-blue-500 text-xl md:text-2xl"></i>
                        </div>
                        <div class="text-center">
                            <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-1">Módulo TEA</h3>
                            <p class="text-sm sm:text-base md:text-lg text-slate-600 mb-4">Habilidades sociais e comunicação</p>
                        </div>
                        <ul class="space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg text-slate-700">
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-emerald-500 mr-2 md:mr-3"></i>
                                Comunicação visual
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-emerald-500 mr-2 md:mr-3"></i>
                                Interação social
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-emerald-500 mr-2 md:mr-3"></i>
                                Rotinas estruturadas
                            </li>
                        </ul>
                    </div>
                    <!-- Module TDAH -->
                    <div class="rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-orange-50">
                        <div class="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white rounded-full mx-auto mb-4 md:mb-6 shadow-md">
                            <i class="fas fa-sparkles text-orange-500 text-xl md:text-2xl"></i>
                        </div>
                        <div class="text-center">
                            <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-1">Módulo TDAH</h3>
                            <p class="text-sm sm:text-base md:text-lg text-slate-600 mb-4">Funções executivas</p>
                        </div>
                        <ul class="space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg text-slate-700">
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-emerald-500 mr-2 md:mr-3"></i>
                                Atenção e foco
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-emerald-500 mr-2 md:mr-3"></i>
                                Memória de trabalho
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-emerald-500 mr-2 md:mr-3"></i>
                                Controle inibitório
                            </li>
                        </ul>
                    </div>
                    <!-- Module Interseção -->
                    <div class="rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-emerald-50">
                        <div class="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white rounded-full mx-auto mb-4 md:mb-6 shadow-md">
                            <i class="fas fa-brain text-emerald-500 text-xl md:text-2xl"></i>
                        </div>
                        <div class="text-center">
                            <h3 class="text-xl md:text-2xl font-bold text-slate-900 mb-1">Interseção</h3>
                            <p class="text-sm sm:text-base md:text-lg text-slate-600 mb-4">Atividades integradas</p>
                        </div>
                        <ul class="space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg text-slate-700">
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-emerald-500 mr-2 md:mr-3"></i>
                                Regulação emocional
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-emerald-500 mr-2 md:mr-3"></i>
                                Autoconhecimento
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-emerald-500 mr-2 md:mr-3"></i>
                                Tomada de decisão
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- STATS SECTION -->
        <section class="py-12 sm:py-16 md:py-20 bg-white">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-8 md:mb-12">
                    Dados que importam
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
                    <div class="p-6 md:p-8">
                        <div class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-blue-500">50-70%</div>
                        <p class="text-sm sm:text-base md:text-lg text-slate-600">
                            das crianças com TEA também apresentam TDAH
                        </p>
                    </div>
                    <div class="p-6 md:p-8">
                        <div class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-emerald-500">32+</div>
                        <p class="text-sm sm:text-base md:text-lg text-slate-600">
                            atividades cientificamente validadas
                        </p>
                    </div>
                    <div class="p-6 md:p-8">
                        <div class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-orange-500">100%</div>
                        <p class="text-sm sm:text-base md:text-lg text-slate-600">
                            segurança jurídica e conformidade
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA SECTION -->
        <section class="bg-gradient-to-r from-blue-600 to-blue-800 py-16 sm:py-20 md:py-24">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-sm">
                    Comece sua jornada hoje
                </h2>
                <p class="text-lg sm:text-xl mb-8 md:mb-10 max-w-2xl mx-auto">
                    Junte-se às famílias e profissionais que confiam no LudiTEA.
                </p>
                <a href="/login" 
                   class="inline-block bg-white text-blue-600 px-6 sm:px-8 py-3 md:py-4 rounded-full font-bold shadow-lg hover:bg-blue-50 transition-transform transform hover:-translate-y-1">
                    Testar Gratuitamente
                </a>
            </div>
        </section>
    </main>

    <!-- FOOTER -->
    <footer class="bg-slate-900 text-slate-400 py-12 md:py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
                <div class="sm:col-span-2 md:col-span-1">
                    <a href="/" class="mb-4 inline-block">
                        <img src="/images/logo-luditea.png" 
                             alt="Logo LudiTEA" 
                             class="h-14 md:h-16 w-auto object-contain">
                    </a>
                    <p class="text-sm">
                        Plataforma brasileira integrada para desenvolvimento neurodivergente, 
                        com foco em TEA e TDAH.
                    </p>
                </div>
                <div>
                    <h3 class="font-bold text-white mb-4">Produto</h3>
                    <ul class="text-sm space-y-2">
                        <li><a href="#" class="hover:text-white transition-colors">Como funciona</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Recursos</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Preços</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-white mb-4">Suporte</h3>
                    <ul class="text-sm space-y-2">
                        <li><a href="#" class="hover:text-white transition-colors">Central de ajuda</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Contato</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-white mb-4">Legal</h3>
                    <ul class="text-sm space-y-2">
                        <li><a href="#" class="hover:text-white transition-colors">Privacidade</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Termos</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">LGPD</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-slate-700 pt-8 text-center">
                <p class="text-sm text-slate-500">
                    © 2025 LudiTEA. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </footer>
</body>
</html>
