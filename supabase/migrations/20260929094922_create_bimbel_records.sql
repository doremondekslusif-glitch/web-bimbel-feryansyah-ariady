create table if not exists public.bimbel_records (
  record_type text not null,
  record_id text not null,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (record_type, record_id)
);

grant select, insert, update, delete on public.bimbel_records to anon;

alter table public.bimbel_records enable row level security;

drop policy if exists "bimbel anon read records" on public.bimbel_records;
drop policy if exists "bimbel anon insert records" on public.bimbel_records;
drop policy if exists "bimbel anon update records" on public.bimbel_records;
drop policy if exists "bimbel anon delete records" on public.bimbel_records;

create policy "bimbel anon read records"
on public.bimbel_records for select to anon using (true);

create policy "bimbel anon insert records"
on public.bimbel_records for insert to anon with check (true);

create policy "bimbel anon update records"
on public.bimbel_records for update to anon using (true) with check (true);

create policy "bimbel anon delete records"
on public.bimbel_records for delete to anon using (true);

create index if not exists bimbel_records_type_idx on public.bimbel_records(record_type);
