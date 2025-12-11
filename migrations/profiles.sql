-- Perfil e status de assinatura para Radioluzzi PRO (plano único)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  especialidade text,
  plano text default 'none', -- none | pro
  status text default 'inactive', -- inactive | active | cancelled
  assinatura_expira_em timestamptz,
  created_at timestamptz default now()
);

-- Índice para consultas por status
create index if not exists idx_profiles_status on profiles(status);
