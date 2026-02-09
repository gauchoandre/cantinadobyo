'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { Aluno } from '@/lib/types';

export default function AlunosPage() {
  const supabase = useMemo(() => createClient(), []);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [nome, setNome] = useState('');
  const [serie, setSerie] = useState('');
  const [mensalista, setMensalista] = useState(true);

  const carregar = async () => {
    const { data } = await supabase.from('alunos').select('*').order('nome');
    setAlunos((data ?? []) as Aluno[]);
  };

  useEffect(() => {
    carregar();
  }, []);

  const criar = async (e: FormEvent) => {
    e.preventDefault();
    await supabase.from('alunos').insert({ nome, serie, mensalista, ativo: true });
    setNome('');
    setSerie('');
    setMensalista(true);
    carregar();
  };

  const toggleAtivo = async (aluno: Aluno) => {
    await supabase.from('alunos').update({ ativo: !aluno.ativo }).eq('id', aluno.id);
    carregar();
  };

  return (
    <section className="space-y-4 pb-4">
      <h2 className="text-base font-semibold">Alunos</h2>
      <form onSubmit={criar} className="space-y-2 rounded-xl border p-3">
        <input required placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
        <input required placeholder="Série" value={serie} onChange={(e) => setSerie(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={mensalista} onChange={(e) => setMensalista(e.target.checked)} />
          Mensalista
        </label>
        <button className="w-full rounded-lg bg-brand-600 px-3 py-2 font-medium text-white">Salvar aluno</button>
      </form>
      <div className="space-y-2 rounded-xl border p-3">
        {alunos.map((aluno) => (
          <div key={aluno.id} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium">{aluno.nome}</p>
              <p>{`${aluno.serie} • ${aluno.mensalista ? 'Mensalista' : 'Avulso'}`}</p>
            </div>
            <button onClick={() => toggleAtivo(aluno)} className="rounded-lg border px-2 py-1">
              {aluno.ativo ? 'Ativo' : 'Inativo'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
