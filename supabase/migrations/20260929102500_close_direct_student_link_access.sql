revoke select on public.bimbel_student_links from anon;

create policy "student links no direct anon access"
on public.bimbel_student_links for select to anon using (false);

create policy "teacher auth no direct access"
on public.bimbel_teacher_auth for select to anon using (false);
