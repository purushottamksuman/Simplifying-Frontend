-- Assessment results storage
create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null,
  student_id uuid not null,
  version int2 not null,
  result_json jsonb not null,
  created_at timestamptz not null default now(),
  unique (submission_id)
);

alter table public.assessment_results enable row level security;

create policy "select_own_results" on public.assessment_results
  for select
  using (auth.uid() = student_id);

create policy "insert_own_results" on public.assessment_results
  for insert
  with check (auth.uid() = student_id);

create policy "update_own_results" on public.assessment_results
  for update
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);


