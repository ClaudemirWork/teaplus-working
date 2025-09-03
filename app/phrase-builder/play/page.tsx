// Arquivo: app/phrase-builder/play/page.tsx (O NOVO ARQUIVO)

import { Suspense } from 'react';
import GameClient from './GameClient'; // Importa o nosso jogo que acabamos de renomear

// Este componente é o "embrulho" que o Next.js precisa.
export default function PlayPageWrapper() {
  return (
    // O Suspense mostra uma mensagem de "Carregando..." enquanto espera o jogo carregar no navegador.
    <Suspense fallback={<div>Carregando Jogo...</div>}>
      <GameClient />
    </Suspense>
  );
}
