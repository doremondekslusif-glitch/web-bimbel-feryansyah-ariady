create table if not exists public.bimbel_student_links (
  id text primary key,
  token text not null unique,
  student_name text not null,
  class_id integer not null,
  subject_ids jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists bimbel_student_links_token_idx on public.bimbel_student_links(token);

grant insert, select, update, delete on public.bimbel_student_links to anon;

alter table public.bimbel_student_links enable row level security;

drop policy if exists "student links anon read" on public.bimbel_student_links;
drop policy if exists "student links anon insert" on public.bimbel_student_links;
drop policy if exists "student links anon update" on public.bimbel_student_links;
drop policy if exists "student links anon delete" on public.bimbel_student_links;

create policy "student links anon read"
on public.bimbel_student_links for select to anon using (true);

create policy "student links anon insert"
on public.bimbel_student_links for insert to anon with check (true);

create policy "student links anon update"
on public.bimbel_student_links for update to anon using (true) with check (true);

create policy "student links anon delete"
on public.bimbel_student_links for delete to anon using (true);
