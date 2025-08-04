// components/layout/Header.tsx
import React from 'react';

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <header style={{ background: '#1976d2', color: '#fff', padding: 16 }}>
      <h1>{title}</h1>
    </header>
  );
}

