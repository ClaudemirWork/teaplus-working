import React from 'react';

export default function MoodRegulationContent() {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 24, maxWidth: 600, margin: '40px auto' }}>
      <h2 style={{ color: '#d32f2f', fontWeight: 700, fontSize: 24, marginBottom: 16 }}>Regulação Emocional</h2>
      <p style={{ color: '#555', fontSize: 16, marginBottom: 24 }}>
        Aqui você pode registrar como está se sentindo hoje. Escolha uma emoção:
      </p>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button style={{ fontSize: 32, background: '#ffe0e0', border: 'none', borderRadius: 8, padding: 12, cursor: 'pointer' }}>😞</button>
        <button style={{ fontSize: 32, background: '#fff9c4', border: 'none', borderRadius: 8, padding: 12, cursor: 'pointer' }}>😐</button>
        <button style={{ fontSize: 32, background: '#c8e6c9', border: 'none', borderRadius: 8, padding: 12, cursor: 'pointer' }}>😊</button>
        <button style={{ fontSize: 32, background: '#bbdefb', border: 'none', borderRadius: 8, padding: 12, cursor: 'pointer' }}>🤩</button>
      </div>
      <p style={{ color: '#888', fontSize: 14 }}>
        (Funcionalidade simples: só mostra os botões. Se quiser registrar e salvar, me peça o próximo passo!)
      </p>
    </div>
  );
}
