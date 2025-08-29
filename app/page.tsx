// Função para scroll suave
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href')?.slice(1);
    if (targetId) {
      const element = document.getElementById(targetId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="font-sans antialiased bg-slate-50 text-slate-700">
      <header className={`bg-white shadow-sm fixed top-0 w-full z-50 transition-all duration-300`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center transition-all duration-300 ${isScrolled ? 'py-0.5' : 'py-1.5'}`}>
          <a href="#hero-section" onClick={handleSmoothScroll} className="flex items-center">
            <Image
              src="/images/logo-luditea.png"
              alt="Logo LudiTEA"
              width={500}
              height={156}
              className={`transition-all duration-300 h-auto ${isScrolled ? 'w-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px]' : 'w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px]'}`}
              priority
            />
          </a>
        </div>
      </header>
