# ZORVEXA — Loja de eletrónicos
Next.js + TypeScript + Tailwind + Supabase (base de dados online). Admin em `/admin` com palavra-passe.

## Variáveis necessárias (4)
SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_PASSWORD, NEXT_PUBLIC_WHATSAPP (ver `.env.example`).
Nunca publique a chave secreta no GitHub: coloque-a só no painel do Netlify.

## Correr no computador (opcional)
Copie `.env.example` para `.env.local`, preencha, depois `npm install` e `npm run dev`.
Esquema da base de dados: `supabase/schema.sql`.

## Publicar (resumo)
1. **Supabase** (supabase.com): novo projeto → SQL Editor → colar `supabase/schema.sql` → Run. Copiar Project URL e chave secreta (Project Settings → API).
2. **GitHub**: novo repositório e carregar o conteúdo desta pasta.
3. **Netlify** (netlify.com): Import from Git → escolher o repositório → adicionar as 4 variáveis de `.env.example` → Deploy.
4. Abrir `link-do-site/admin` e entrar com `ADMIN_PASSWORD`.
