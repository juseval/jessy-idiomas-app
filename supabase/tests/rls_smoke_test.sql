-- Prueba rápida de las políticas RLS (seguridad por rol).
-- Ejecutar sobre una base LOCAL ya migrada (npx supabase db reset) con:
--   psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/tests/rls_smoke_test.sql
-- Todo corre dentro de una transacción que se deshace al final: no deja datos.
-- Las líneas "debe fallar" deben mostrar "violates row-level security policy".

begin;
insert into auth.users (id, instance_id, aud, role, email) values
 ('00000000-0000-0000-0000-00000000000a','00000000-0000-0000-0000-000000000000','authenticated','authenticated','t1@x.test'),
 ('00000000-0000-0000-0000-0000000000a1','00000000-0000-0000-0000-000000000000','authenticated','authenticated','t2@x.test'),
 ('00000000-0000-0000-0000-0000000000a2','00000000-0000-0000-0000-000000000000','authenticated','authenticated','t3@x.test'),
 ('00000000-0000-0000-0000-0000000000b1','00000000-0000-0000-0000-000000000000','authenticated','authenticated','t4@x.test'),
 ('00000000-0000-0000-0000-0000000000b2','00000000-0000-0000-0000-000000000000','authenticated','authenticated','t5@x.test');
insert into profiles (id,doc_number,first_name,last_name,role) values
 ('00000000-0000-0000-0000-00000000000a','100001','Jessy','D','master'),
 ('00000000-0000-0000-0000-0000000000a1','100011','Laura','P','teacher'),
 ('00000000-0000-0000-0000-0000000000a2','100012','Andres','P','teacher'),
 ('00000000-0000-0000-0000-0000000000b1','100021','Sara','E','student'),
 ('00000000-0000-0000-0000-0000000000b2','100022','Dani','E','student');
insert into modules (id,level_id,number,title) values ('10000000-0000-0000-0000-000000000001',1,99,'M');
insert into lessons (id,module_id,number,title,topic,sort_order) values ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001',1,'C1','verb to be',1);
insert into groups (id,name,level_id,teacher_id) values
 ('30000000-0000-0000-0000-000000000001','A1 M',1,'00000000-0000-0000-0000-0000000000a1'),
 ('30000000-0000-0000-0000-000000000002','A1 N',1,'00000000-0000-0000-0000-0000000000a2');
insert into enrollments (student_id,group_id) values
 ('00000000-0000-0000-0000-0000000000b1','30000000-0000-0000-0000-000000000001'),
 ('00000000-0000-0000-0000-0000000000b2','30000000-0000-0000-0000-000000000002');
insert into class_sessions (id,group_id,lesson_id,scheduled_date,status) values
 ('40000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','2026-11-16','published'),
 ('40000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','2026-11-18','draft'),
 ('40000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','2026-11-16','published');
insert into payments (student_id,amount,period,method) values
 ('00000000-0000-0000-0000-0000000000b1',200000,'2026-11-01','nequi'),
 ('00000000-0000-0000-0000-0000000000b2',200000,'2026-11-01','efectivo');

set local role authenticated;

\echo '--- Estudiante: espera perfiles=1, sesiones=1, pagos=1'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000b1',true);
select (select count(*) from profiles) perfiles, (select count(*) from class_sessions) sesiones, (select count(*) from payments) pagos;

\echo '--- Profesor: espera perfiles=2, sesiones=1, pagos=0'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-0000000000a1',true);
select (select count(*) from profiles) perfiles, (select count(*) from class_sessions) sesiones, (select count(*) from payments) pagos;

\echo '--- Director: espera perfiles>=5, sesiones>=3, pagos>=2'
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-00000000000a',true);
select (select count(*) from profiles) perfiles, (select count(*) from class_sessions) sesiones, (select count(*) from payments) pagos;

rollback;
