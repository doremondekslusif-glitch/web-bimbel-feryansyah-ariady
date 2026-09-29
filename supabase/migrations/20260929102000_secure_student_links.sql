create table if not exists public.bimbel_teacher_auth (
  id boolean primary key default true check (id=true),
  password_sha256 text not null,
  updated_at timestamptz not null default now()
);

insert into public.bimbel_teacher_auth(id,password_sha256)
values(true,'c93b931353a5b7317ea3ec3c194deb6c856cb63116e235539855494d90632b33')
on conflict(id) do nothing;

alter table public.bimbel_teacher_auth enable row level security;
revoke all on public.bimbel_teacher_auth from anon, authenticated;

revoke all on public.bimbel_student_links from anon, authenticated;
