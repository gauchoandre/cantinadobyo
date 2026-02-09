'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { Aluno, ItemCardapio, Lancamento } from '@/lib/types';

const todayKey = new Date().toISOString().slice(0, 10);

export default function HomePage() {
  const supabase = useMemo(() => createClient(), []);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [itens, setItens] = useState<ItemCardapio[]>([]);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [alunoId, setAlunoId] = useState('');
  const [itemId, setItemId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState('');
  const [feedback, setFeedback] = useState('');

  const carregarDados = async () => {
    const [{ data: alunosData }, { data: itensData }, { data: lancData }] = await Promise.all([
      supabase.from('alunos').select('*').eq('ativo', true).order('nome'),
      supabase.from('itens_cardapio').select('*').eq('ativo', true).order('nome'),
      supabase
        .from('lancamentos')
        .select('*, alunos(nome, serie)')
        .gte('data_hora', `${todayKey}T00:00:00`)
        .lte('data_hora', `${todayKey}T23:59:59`)
        .order('data_hora', { ascending: false }),
    ]);

    setAlunos((alunosData ?? []) as Aluno[]);
    setItens((itensData ?? []) as ItemCardapio[]);
    setLancamentos((lancData ?? []) as Lancamento[]);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const salvar = async (event: FormEvent) => {
    event.preventDefault();
    const item = itens.find((it) => it.id === itemId);
    if (!alunoId || !item) return;

    const { error } = await supabase.from('lancamentos').insert({
      aluno_id: alunoId,
      item_id: item.id,
      quantidade,
      observacao: observacao || null,
      data_hora: new Date().toISOString(),
      preco_unitario: item.preco,
      nome_item_snapshot: item.nome,
    });

    if (error) {
      setFeedback('Erro ao salvar lançamento.');
      return;
    }

    setItemId('');
    setQuantidade(1);
    setObservacao('');
    setFeedback('Lançamento salvo.');
    setTimeout(() => setFeedback(''), 1800);
    carregarDados();
  };

  const excluir = async (id: string) => {
    await supabase.from('lancamentos').delete().eq('id', id);
    carregarDados();
  };

  return (
    <section className="space-y-4 pb-4">
      <h2 className="text-base font-semibold">Lançar lanche</h2>
      <form onSubmit={salvar} className="space-y-3 rounded-xl border p-3">
        <label className="block">
          <span className="mb-1 block text-sm">Aluno</span>
          <select required value={alunoId} onChange={(e) => setAlunoId(e.target.value)} className="w-full rounded-lg border px-3 py-2">
            <option value="">Selecione</option>
            {alunos.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>{`${aluno.nome} (${aluno.serie})`}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Item</span>
          <select required value={itemId} onChange={(e) => setItemId(e.target.value)} className="w-full rounded-lg border px-3 py-2">
            <option value="">Selecione</option>
            {itens.map((item) => (
              <option key={item.id} value={item.id}>{`${item.nome} (R$ ${Number(item.preco).toFixed(2)})`}</option>
            ))}
          </select>
        </label>
        <div>
          <span className="mb-1 block text-sm">Quantidade</span>
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-lg border px-3 py-2" onClick={() => setQuantidade((q) => Math.max(1, q - 1))}>-</button>
            <span className="min-w-10 text-center font-medium">{quantidade}</span>
            <button type="button" className="rounded-lg border px-3 py-2" onClick={() => setQuantidade((q) => q + 1)}>+</button>
          </div>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm">Observação</span>
          <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} className="w-full rounded-lg border px-3 py-2" rows={2} />
        </label>
        <button className="w-full rounded-lg bg-brand-600 px-3 py-2 font-medium text-white">Salvar lançamento</button>
        {feedback && <p className="text-sm text-emerald-600">{feedback}</p>}
      </form>

      <div className="space-y-2 rounded-xl border p-3">
        <h3 className="text-sm font-semibold">Lançamentos de hoje</h3>
        {lancamentos.length === 0 && <p className="text-sm text-slate-600">Nenhum lançamento hoje.</p>}
        {lancamentos.map((lanc) => (
          <div key={lanc.id} className="flex items-start justify-between border-b pb-2 text-sm last:border-b-0">
            <div>
              <p className="font-medium">{lanc.alunos?.nome}</p>
              <p>{`${lanc.nome_item_snapshot} x${lanc.quantidade} • R$ ${(lanc.quantidade * Number(lanc.preco_unitario)).toFixed(2)}`}</p>
            </div>
            <button onClick={() => excluir(lanc.id)} className="text-red-600">Excluir</button>
          </div>
        ))}
      </div>
    </section>
  );
}
