-- Cole tudo no Supabase (menu SQL Editor) e carregue em RUN

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  price numeric not null default 0,
  category text not null default 'Outros',
  image_url text default '',
  stock int not null default 0,
  available boolean not null default true,
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text default '',
  notes text default '',
  items jsonb not null,
  total numeric not null,
  status text not null default 'pendente',
  created_at timestamptz default now()
);

-- Segurança: ninguém acede às tabelas diretamente; só o site (com a chave secreta)
alter table products enable row level security;
alter table orders enable row level security;

-- Pasta pública para as fotos dos produtos
insert into storage.buckets (id, name, public) values ('products', 'products', true);
