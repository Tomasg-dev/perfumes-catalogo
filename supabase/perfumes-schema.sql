-- Tabla de perfumes editable desde /admin/perfumes.
-- Las fotos siguen viviendo como archivos estáticos en public/perfumes/
-- (no hay Storage bucket aquí): imagen_url solo guarda la ruta, p.ej.
-- "/perfumes/212 MEN NYC PASTA (100ML).webp".

create table if not exists public.perfumes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  marca text not null,
  precio numeric,
  ml integer not null default 100,
  categoria text not null check (categoria in ('hombre', 'mujer', 'unisex')),
  notas_salida text[] not null default '{}',
  notas_corazon text[] not null default '{}',
  notas_fondo text[] not null default '{}',
  descripcion text not null default '',
  imagen_url text,
  destacado boolean not null default false,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.perfumes enable row level security;

-- Catálogo público (sin sesión): solo perfumes activos, igual que "tenis".
create policy perfumes_public_read
  on public.perfumes
  for select
  to anon
  using (activo = true);

-- Panel admin (sesión autenticada): ve y edita todo, activos e inactivos.
create policy perfumes_admin_all
  on public.perfumes
  for all
  to authenticated
  using (true)
  with check (true);
