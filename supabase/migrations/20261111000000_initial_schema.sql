-- =====================================================================
-- Jessy Idiomas · Plan Esencial · Esquema inicial
-- Refleja el modelo lógico (Jessy_Idiomas_Modelo_de_Datos.drawio).
-- =====================================================================

-- ---------- Tipos ----------
create type public.user_role as enum ('master', 'teacher', 'student');
create type public.doc_type as enum ('CC', 'TI');
create type public.session_status as enum ('draft', 'published', 'done', 'cancelled');
create type public.payment_method as enum ('efectivo', 'transferencia', 'nequi', 'otro');
create type public.exercise_type as enum ('multiple_choice', 'fill_blank', 'order_words');
create type public.practice_moment as enum ('pre', 'post');

-- ---------- Usuarios ----------
-- Un perfil por usuario de Supabase Auth. Director, profesor y estudiante
-- comparten tabla y se distinguen por `role`.
create table public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  doc_type         public.doc_type not null default 'CC',
  doc_number       varchar(15) not null unique,
  first_name       varchar(80) not null,
  last_name        varchar(80) not null,
  birth_date       date,
  phone            varchar(20),
  email            varchar(120),
  guardian_name    varchar(120),
  guardian_phone   varchar(20),
  role             public.user_role not null default 'student',
  is_activated     boolean not null default false,
  active           boolean not null default true,
  data_consent_at  timestamptz,
  created_at       timestamptz not null default now()
);

-- Códigos de activación (solo los lee la Edge Function con service_role).
create table public.account_activations (
  profile_id  uuid primary key references public.profiles (id) on delete cascade,
  code_hash   text not null,
  expires_at  timestamptz not null default now() + interval '14 days',
  attempts    smallint not null default 0
);

-- ---------- Currículo ----------
create table public.levels (
  id          smallint primary key,
  code        varchar(2) not null unique,
  name        varchar(40) not null,
  sort_order  smallint not null
);

create table public.modules (
  id        uuid primary key default gen_random_uuid(),
  level_id  smallint not null references public.levels (id),
  number    smallint not null,
  title     varchar(120) not null,
  unique (level_id, number)
);

create table public.lessons (
  id            uuid primary key default gen_random_uuid(),
  module_id     uuid not null references public.modules (id) on delete cascade,
  number        smallint not null,
  title         varchar(120) not null,
  topic         varchar(120) not null,
  vocabulary    text,
  objectives    text,
  material_url  text,
  is_exam       boolean not null default false,
  sort_order    integer not null,
  unique (module_id, number)
);

-- ---------- Grupos y planificación ----------
create table public.groups (
  id          uuid primary key default gen_random_uuid(),
  name        varchar(60) not null,
  level_id    smallint not null references public.levels (id),
  teacher_id  uuid references public.profiles (id),
  schedule    varchar(120),
  active      boolean not null default true
);

create table public.enrollments (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles (id) on delete cascade,
  group_id    uuid not null references public.groups (id) on delete cascade,
  start_date  date not null default current_date,
  end_date    date
);
-- Un estudiante solo puede tener una matrícula abierta por grupo.
create unique index enrollments_one_open_per_group
  on public.enrollments (student_id, group_id) where end_date is null;

-- La planificación semanal de Jessy: qué clase da cada grupo y cuándo.
create table public.class_sessions (
  id              uuid primary key default gen_random_uuid(),
  group_id        uuid not null references public.groups (id) on delete cascade,
  lesson_id       uuid not null references public.lessons (id),
  teacher_id      uuid references public.profiles (id),
  scheduled_date  date not null,
  status          public.session_status not null default 'draft',
  published_at    timestamptz
);
create index class_sessions_group_date on public.class_sessions (group_id, scheduled_date);

create table public.attendance (
  class_session_id  uuid not null references public.class_sessions (id) on delete cascade,
  student_id        uuid not null references public.profiles (id) on delete cascade,
  present           boolean not null,
  primary key (class_session_id, student_id)
);

-- ---------- Pagos y exámenes ----------
create table public.payments (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles (id) on delete cascade,
  amount      numeric(12, 2) not null check (amount > 0),
  paid_at     date not null default current_date,
  period      date not null, -- primer día del mes que cubre
  method      public.payment_method not null,
  notes       text
);
create index payments_student on public.payments (student_id, period);

create table public.exam_results (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles (id) on delete cascade,
  lesson_id   uuid not null references public.lessons (id),
  score       numeric(4, 2),
  passed      boolean,
  taken_at    date not null default current_date
);

-- ---------- Práctica ----------
create table public.exercises (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid not null references public.lessons (id) on delete cascade,
  type        public.exercise_type not null,
  prompt      text not null,
  options     jsonb,
  answer      jsonb not null,
  sort_order  smallint not null default 0
);

create table public.exercise_attempts (
  id                uuid primary key default gen_random_uuid(),
  student_id        uuid not null references public.profiles (id) on delete cascade,
  exercise_id       uuid not null references public.exercises (id) on delete cascade,
  class_session_id  uuid references public.class_sessions (id) on delete set null,
  moment            public.practice_moment not null,
  is_correct        boolean not null,
  answered_at       timestamptz not null default now()
);
create index exercise_attempts_student on public.exercise_attempts (student_id, answered_at);

-- =====================================================================
-- Funciones de apoyo para las políticas (security definer evita recursión RLS)
-- =====================================================================
create or replace function public.current_user_role()
returns public.user_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() and active $$;

create or replace function public.is_master()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce(public.current_user_role() = 'master', false) $$;

-- ¿El usuario actual es profesor del grupo?
create or replace function public.teaches_group(g uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.groups where id = g and teacher_id = auth.uid()
  ) or exists (
    select 1 from public.class_sessions where group_id = g and teacher_id = auth.uid()
  )
$$;

-- ¿El estudiante está (o estuvo) en algún grupo del profesor actual?
create or replace function public.teaches_student(s uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.enrollments e
    where e.student_id = s and public.teaches_group(e.group_id)
  )
$$;

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles            enable row level security;
alter table public.account_activations enable row level security; -- sin políticas: nadie la lee desde el navegador
alter table public.levels              enable row level security;
alter table public.modules             enable row level security;
alter table public.lessons             enable row level security;
alter table public.groups              enable row level security;
alter table public.enrollments         enable row level security;
alter table public.class_sessions      enable row level security;
alter table public.attendance          enable row level security;
alter table public.payments            enable row level security;
alter table public.exam_results        enable row level security;
alter table public.exercises           enable row level security;
alter table public.exercise_attempts   enable row level security;

-- El director puede todo en todas las tablas operativas.
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','levels','modules','lessons','groups','enrollments',
    'class_sessions','attendance','payments','exam_results','exercises','exercise_attempts'
  ] loop
    execute format(
      'create policy "master_all" on public.%I for all to authenticated using (public.is_master()) with check (public.is_master())',
      t);
  end loop;
end $$;

-- Perfiles: cada quien ve el suyo; el profesor ve a sus estudiantes.
create policy "self_read" on public.profiles for select to authenticated
  using (id = auth.uid());
create policy "teacher_reads_students" on public.profiles for select to authenticated
  using (public.current_user_role() = 'teacher' and public.teaches_student(id));

-- Currículo: lectura para cualquier usuario autenticado.
create policy "read_levels"  on public.levels  for select to authenticated using (true);
create policy "read_modules" on public.modules for select to authenticated using (true);
create policy "read_lessons" on public.lessons for select to authenticated using (true);

-- Ejercicios: lectura para autenticados (la respuesta se valida en el cliente en el MVP).
create policy "read_exercises" on public.exercises for select to authenticated using (true);

-- Grupos: el profesor ve los suyos; el estudiante los grupos donde está matriculado.
create policy "teacher_groups" on public.groups for select to authenticated
  using (public.teaches_group(id));
create policy "student_groups" on public.groups for select to authenticated
  using (exists (select 1 from public.enrollments e where e.group_id = groups.id and e.student_id = auth.uid()));

-- Matrículas
create policy "student_own_enrollments" on public.enrollments for select to authenticated
  using (student_id = auth.uid());
create policy "teacher_group_enrollments" on public.enrollments for select to authenticated
  using (public.teaches_group(group_id));

-- Sesiones: el profesor y los estudiantes solo ven las publicadas o dictadas.
create policy "teacher_sessions" on public.class_sessions for select to authenticated
  using (status in ('published', 'done') and public.teaches_group(group_id));
create policy "teacher_marks_done" on public.class_sessions for update to authenticated
  using (status in ('published', 'done') and public.teaches_group(group_id))
  with check (status in ('published', 'done') and public.teaches_group(group_id));
create policy "student_sessions" on public.class_sessions for select to authenticated
  using (
    status in ('published', 'done')
    and exists (select 1 from public.enrollments e where e.group_id = class_sessions.group_id and e.student_id = auth.uid())
  );

-- Asistencia: el profesor la toma en sus sesiones; el estudiante ve la suya.
create policy "teacher_attendance" on public.attendance for all to authenticated
  using (exists (select 1 from public.class_sessions cs where cs.id = class_session_id and public.teaches_group(cs.group_id)))
  with check (exists (select 1 from public.class_sessions cs where cs.id = class_session_id and public.teaches_group(cs.group_id)));
create policy "student_own_attendance" on public.attendance for select to authenticated
  using (student_id = auth.uid());

-- Pagos y exámenes: el estudiante ve los suyos.
create policy "student_own_payments" on public.payments for select to authenticated
  using (student_id = auth.uid());
create policy "student_own_exams" on public.exam_results for select to authenticated
  using (student_id = auth.uid());
create policy "teacher_exams" on public.exam_results for select to authenticated
  using (public.current_user_role() = 'teacher' and public.teaches_student(student_id));

-- Intentos de práctica: el estudiante registra y ve los suyos; el profesor ve los de sus estudiantes.
create policy "student_insert_attempts" on public.exercise_attempts for insert to authenticated
  with check (student_id = auth.uid() and public.current_user_role() = 'student');
create policy "student_read_attempts" on public.exercise_attempts for select to authenticated
  using (student_id = auth.uid());
create policy "teacher_read_attempts" on public.exercise_attempts for select to authenticated
  using (public.current_user_role() = 'teacher' and public.teaches_student(student_id));
