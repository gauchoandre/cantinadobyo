create extension if not exists "pgcrypto";

create table if not exists alunos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  serie text not null,
  mensalista boolean not null default true,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists itens_cardapio (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  preco numeric(10,2) not null,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists lancamentos (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references alunos(id),
  item_id uuid not null references itens_cardapio(id),
  data_hora timestamptz not null,
  quantidade int not null check (quantidade > 0),
  preco_unitario numeric(10,2) not null,
  nome_item_snapshot text not null,
  observacao text,
  created_at timestamptz not null default now()
);

create type pagamento_status as enum ('PENDENTE', 'PAGO');

create table if not exists pagamentos_mensais (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references alunos(id),
  ano int not null,
  mes int not null check (mes between 1 and 12),
  status pagamento_status not null default 'PENDENTE',
  data_pagamento date,
  unique (aluno_id, ano, mes)
);

create index if not exists idx_lancamentos_aluno_data on lancamentos (aluno_id, data_hora);
