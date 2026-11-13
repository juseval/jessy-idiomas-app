-- Datos base. Se cargan con `npx supabase db reset` en local.
insert into public.levels (id, code, name, sort_order) values
  (1, 'A1', 'Principiante', 1),
  (2, 'A2', 'Básico', 2),
  (3, 'B1', 'Intermedio', 3),
  (4, 'B2', 'Intermedio alto', 4),
  (5, 'C1', 'Avanzado', 5)
on conflict (id) do nothing;
