'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { ItemCardapio } from '@/lib/types';

export default function CardapioPage() {
  const supabase = useMemo(() => createClient(), []);
  const [itens, setItens] = useState<ItemCardapio[]>([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');

  const carregar = async () => {
    const { data } = await supabase.from('itens_cardapio').select('*').order('nome');
    setItens((data ?? []) as ItemCardapio[]);
  };

  useEffect(() => {
    carregar();
  }, []);

  const criar = async (e: FormEvent) => {
    e.preventDefault();
    await supabase.from('itens_cardapio').insert({ nome, preco: Number(preco), ativo: true });
    setNome('');
    setPreco('');
    carregar();
  };

  const toggleAtivo = async (item: ItemCardapio) => {
    await supabase.from('itens_cardapio').update({ ativo: !item.ativo }).eq('id', item.id);
    carregar();
  };

  return (
    <section className="space-y-4 pb-4">
      <h2 className="text-base font-semibold">Cardápio</h2>
      <form onSubmit={criar} className="space-y-2 rounded-xl border p-3">
        <input required placeholder="Nome do item" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
        <input required type="number" step="0.01" min="0" placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
        <button className="w-full rounded-lg bg-brand-600 px-3 py-2 font-medium text-white">Salvar item</button>
      </form>
      <div className="space-y-2 rounded-xl border p-3">
        {itens.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-medium">{item.nome}</p>
              <p>{`R$ ${Number(item.preco).toFixed(2)}`}</p>
            </div>
            <button onClick={() => toggleAtivo(item)} className="rounded-lg border px-2 py-1">
              {item.ativo ? 'Ativo' : 'Inativo'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
