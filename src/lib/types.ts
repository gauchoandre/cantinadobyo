export type PagamentoStatus = 'PENDENTE' | 'PAGO';

export interface Aluno {
  id: string;
  nome: string;
  serie: string;
  mensalista: boolean;
  ativo: boolean;
  created_at: string;
}

export interface ItemCardapio {
  id: string;
  nome: string;
  preco: number;
  ativo: boolean;
  created_at: string;
}

export interface Lancamento {
  id: string;
  aluno_id: string;
  item_id: string;
  data_hora: string;
  quantidade: number;
  preco_unitario: number;
  nome_item_snapshot: string;
  observacao: string | null;
  created_at: string;
  alunos?: Pick<Aluno, 'nome' | 'serie'>;
}

export interface PagamentoMensal {
  id: string;
  aluno_id: string;
  ano: number;
  mes: number;
  status: PagamentoStatus;
  data_pagamento: string | null;
}
