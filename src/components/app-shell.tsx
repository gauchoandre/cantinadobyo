import Link from 'next/link';
import { ReactNode } from 'react';
import { signOut } from '@/lib/auth-actions';

const links = [
  { href: '/', label: 'Lançar' },
  { href: '/extratos', label: 'Extratos' },
  { href: '/alunos', label: 'Alunos' },
  { href: '/cardapio', label: 'Cardápio' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-white p-4 pb-20 shadow-sm">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-brand-600">Cantina do Byo</h1>
        <form action={signOut}>
          <button className="rounded-lg border px-3 py-1 text-sm">Sair</button>
        </form>
      </header>
      <nav className="fixed bottom-0 left-0 right-0 mx-auto grid w-full max-w-md grid-cols-4 border-t bg-white">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="px-2 py-3 text-center text-xs font-medium text-slate-700">
            {link.label}
          </Link>
        ))}
      </nav>
      {children}
    </main>
  );
}
