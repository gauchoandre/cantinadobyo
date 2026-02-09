import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cantina do Byo',
  description: 'Lançamentos mensais de lanches',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
