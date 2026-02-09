# Cantina do Byo

Web app mobile-first para lançamentos de consumo e extratos mensais.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL

## Configuração local
1. Copie o `.env.example` para `.env.local` e preencha as chaves do Supabase.
2. Instale dependências:
   ```bash
   npm install
   ```
3. Rode o SQL em `supabase/schema.sql` no SQL Editor do Supabase.
4. Crie um usuário administrador no Auth do Supabase (email/senha).
5. Rode o projeto:
   ```bash
   npm run dev
   ```

## Deploy (Vercel)
1. Suba o repositório para GitHub.
2. Importe o projeto na Vercel.
3. Configure variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

## Funcionalidades
- Login com usuário administrador.
- CRUD de alunos e cardápio.
- Lançamento rápido no balcão (mantendo aluno selecionado).
- Lista do dia com exclusão para desfazer.
- Extrato mensal agrupado por data com subtotal diário e total mensal.
- Copiar extrato formatado para WhatsApp.
- Marcação de pagamento mensal (PENDENTE/PAGO).
