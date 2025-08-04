// components/Sidebar.tsx
import React from 'react';

type SidebarProps = {
  userData?: any;
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
  handleLogout?: () => void;
};

export default function Sidebar({ userData, currentPage, setCurrentPage, handleLogout }: SidebarProps) {
  return (
    <aside style={{ width: 220, background: '#f5f5f5', padding: 20 }}>
      <h2>Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <button onClick={() => setCurrentPage && setCurrentPage('dashboard')}>Dashboard</button>
        </li>
        <li>
          <button onClick={() => setCurrentPage && setCurrentPage('comunicacao')}>Comunicação</button>
        </li>
        <li>
          <button onClick={() => setCurrentPage && setCurrentPage('regulacao')}>Regulação</button>
        </li>
        <li>
          <button onClick={handleLogout}>Sair</button>
        </li>
      </ul>
      {userData && (
        <div style={{ marginTop: 20 }}>
          <strong>Usuário:</strong> {userData.name || 'Visitante'}
        </div>
      )}
    </aside>
  );
}

