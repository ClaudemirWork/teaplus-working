// components/layout/Sidebar.tsx
import React from 'react';

type SidebarProps = {
  userData?: any;
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
  handleLogout?: () => void;
};

export default function Sidebar({ userData, currentPage, setCurrentPage, handleLogout }: SidebarProps) {
  return (
    <aside style={{ width: 220, background: '#f5f5f5', padding: 20, minHeight: '100vh' }}>
      <h2>Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <button
            style={{ width: '100%', padding: 8, marginBottom: 8, background: currentPage === 'dashboard' ? '#1976d2' : '#fff', color: currentPage === 'dashboard' ? '#fff' : '#1976d2', border: '1px solid #1976d2', borderRadius: 4 }}
            onClick={() => setCurrentPage && setCurrentPage('dashboard')}
          >
            Dashboard
          </button>
        </li>
        <li>
          <button
            style={{ width: '100%', padding: 8, marginBottom: 8, background: currentPage === 'comunicacao' ? '#1976d2' : '#fff', color: currentPage === 'comunicacao' ? '#fff' : '#1976d2', border: '1px solid #1976d2', borderRadius: 4 }}
            onClick={() => setCurrentPage && setCurrentPage('comunicacao')}
          >
            Comunicação
          </button>
        </li>
        <li>
          <button
            style={{ width: '100%', padding: 8, marginBottom: 8, background: currentPage === 'regulacao' ? '#1976d2' : '#fff', color: currentPage === 'regulacao' ? '#fff' : '#1976d2', border: '1px solid #1976d2', borderRadius: 4 }}
            onClick={() => setCurrentPage && setCurrentPage('regulacao')}
          >
            Regulação
          </button>
        </li>
        <li>
          <button
            style={{ width: '100%', padding: 8, background: '#e53935', color: '#fff', border: 'none', borderRadius: 4 }}
            onClick={handleLogout}
          >
            Sair
          </button>
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

