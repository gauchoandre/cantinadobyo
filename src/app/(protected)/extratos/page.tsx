'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { Aluno, Lancamento, PagamentoStatus } from '@/lib/types';

function brl(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ExtratosPage() {
  const supabase = useMemo(() => createClient(), []);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [alunoId, setAlunoId] = useState('');
  const [mes, setMes] = useState(String(new Date().getMonth() + 1));
  const [ano, setAno] = useState(String(new Date().getFullYear()));
  const [status, setStatus] = useState<PagamentoStatus>('PENDENTE');

  useEffect(() => {
    const carregarAlunos = async () => {
      const { data } = await supabase.from('alunos').select('*').order('nome');
      setAlunos((data ?? []) as Aluno[]);
    };
    carregarAlunos();
  }, [supabase]);

  const consultar = async () => {
    if (!alunoId) return;
    const month = Number(mes);
    const year = Number(ano);
    const start = new Date(year, month - 1, 1).toISOString();
    const end = new Date(year, month, 0, 23, 59, 59).toISOString();

    const [{ data: lancData }, { data: pagData }] = await Promise.all([
      supabase
        .from('lancamentos')
        .select('*')
        .eq('aluno_id', alunoId)
        .gte('data_hora', start)
        .lte('data_hora', end)
        .order('data_hora', { ascending: true }),
      supabase.from('pagamentos_mensais').select('*').eq('aluno_id', alunoId).eq('ano', year).eq('mes', month).maybeSingle(),
    ]);

    setLancamentos((lancData ?? []) as Lancamento[]);
    setStatus((pagData?.status as PagamentoStatus) ?? 'PENDENTE');
  };

  const agrupado = lancamentos.reduce<Record<string, Lancamento[]>>((acc, lanc) => {
    const key = new Date(lanc.data_hora).toLocaleDateString('pt-BR');
    acc[key] = [...(acc[key] ?? []), lanc];
    return acc;
  }, {});

  const totalMes = lancamentos.reduce((sum, l) => sum + Number(l.preco_unitario) * l.quantidade, 0);
  const aluno = alunos.find((a) => a.id === alunoId);

  const textoExtrato = [
    'Cantina do Byo | Extrato mensal',
    `Aluno: ${aluno?.nome ?? ''} | Série: ${aluno?.serie ?? ''} | Mês: ${String(mes).padStart(2, '0')}/${ano}`,
    '',
    ...Object.entries(agrupado).flatMap(([data, itens]) => {
      const subtotal = itens.reduce((sum, l) => sum + Number(l.preco_unitario) * l.quantidade, 0);
      return [
        data,
        ...itens.map((item) => `- ${item.nome_item_snapshot} x${item.quantidade} = ${brl(Number(item.preco_unitario) * item.quantidade)}`),
        `Subtotal do dia: ${brl(subtotal)}`,
        '',
      ];
    }),
    `Total do mês: ${brl(totalMes)}`,
  ].join('\n');

  const copiar = async () => navigator.clipboard.writeText(textoExtrato);

  const alternarStatus = async () => {
    if (!alunoId) return;
    const novoStatus: PagamentoStatus = status === 'PAGO' ? 'PENDENTE' : 'PAGO';
    await supabase.from('pagamentos_mensais').upsert({
      aluno_id: alunoId,
      ano: Number(ano),
      mes: Number(mes),
      status: novoStatus,
      data_pagamento: novoStatus === 'PAGO' ? new Date().toISOString().slice(0, 10) : null,
    });
    setStatus(novoStatus);
  };

  return (
    <section className="space-y-4 pb-4">
      <h2 className="text-base font-semibold">Extrato mensal</h2>
      <div className="space-y-2 rounded-xl border p-3">
        <select value={alunoId} onChange={(e) => setAlunoId(e.target.value)} className="w-full rounded-lg border px-3 py-2">
          <option value="">Selecione o aluno</option>
          {alunos.map((alunoItem) => (
            <option key={alunoItem.id} value={alunoItem.id}>{`${alunoItem.nome} (${alunoItem.serie})`}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input value={mes} onChange={(e) => setMes(e.target.value)} type="number" min={1} max={12} className="rounded-lg border px-3 py-2" />
          <input value={ano} onChange={(e) => setAno(e.target.value)} type="number" min={2020} className="rounded-lg border px-3 py-2" />
        </div>
        <button onClick={consultar} className="w-full rounded-lg bg-brand-600 px-3 py-2 font-medium text-white">Consultar extrato</button>
      </div>

      <div className="space-y-2 rounded-xl border p-3">
        <div className="flex gap-2">
          <button onClick={copiar} className="rounded-lg border px-3 py-2 text-sm">Copiar extrato</button>
          <button onClick={alternarStatus} className="rounded-lg border px-3 py-2 text-sm">Marcar como {status === 'PAGO' ? 'PENDENTE' : 'PAGO'}</button>
        </div>
        <p className="text-sm">
          Status do mês: <strong>{status}</strong>
        </p>
        {Object.entries(agrupado).map(([data, itens]) => {
          const subtotal = itens.reduce((sum, l) => sum + Number(l.preco_unitario) * l.quantidade, 0);
          return (
            <div key={data} className="rounded-lg bg-slate-50 p-2 text-sm">
              <p className="font-semibold">{data}</p>
              {itens.map((item) => (
                <p key={item.id}>{`${item.nome_item_snapshot} x${item.quantidade} = ${brl(Number(item.preco_unitario) * item.quantidade)}`}</p>
              ))}
              <p className="font-medium">Subtotal do dia: {brl(subtotal)}</p>
            </div>
          );
        })}
        <p className="text-base font-semibold">Total do mês: {brl(totalMes)}</p>
      </div>
    </section>
  );
}
