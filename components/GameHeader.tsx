'use client';

import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';
import { ReactNode } from 'react';

// Definindo os tipos para as propriedades do componente para mais segurança
type GameHeaderProps = {
  title: string;
  icon?: ReactNode;
  showSaveButton?: boolean;
  onSave?: () => void;
  isSaveDisabled?: boolean;
};

// Exportando o componente para que ele possa ser importado em outros arquivos
export const GameHeader = ({
  title,
  icon,
  showSaveButton = false,
  onSave,
  isSaveDisabled = false,
}: GameHeaderProps) => (
  <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        {/* 1. Botão Voltar (Esquerda) */}
        <Link
          href="/dashboard"
          className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar</span>
        </Link>

        {/* 2. Título Centralizado (Meio) - Usando posicionamento absoluto para evitar que o botão direito o desloque */}
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 text-center flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {icon}
          <span>{title}</span>
        </h1>

        {/* 3. Botão de Ação ou Espaçador (Direita) */}
        <div className="w-24 flex justify-end">
          {showSaveButton && onSave && (
            <button
              onClick={onSave}
              disabled={isSaveDisabled}
              className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg font-semibold transition-colors ${
                !isSaveDisabled
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save size={18} />
              <span className="hidden sm:inline">{isSaveDisabled ? 'Salvando...' : 'Salvar'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  </header>
);
