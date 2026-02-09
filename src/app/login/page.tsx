'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErro('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setLoading(false);

    if (error) {
      setErro('Credenciais inválidas.');
      return;
    }

    router.replace('/');
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full rounded-xl border bg-white p-4 shadow-sm">
        <h1 className="mb-4 text-xl font-semibold">Cantina do Byo</h1>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm">Email</span>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm">Senha</span>
          <input required type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
        </label>
        {erro && <p className="mb-3 text-sm text-red-600">{erro}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-brand-600 px-3 py-2 font-medium text-white disabled:opacity-60">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
