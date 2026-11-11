# Jessy Idiomas · Plataforma (Plan Esencial)

Plataforma de la academia **Jessy Idiomas**: el director organiza estudiantes, grupos, pagos y la planificación semanal; el profesor ve qué clase le toca y toma asistencia; el estudiante practica cada clase antes y después.

**Stack:** React 19 + TypeScript + Vite · Tailwind CSS 4 · React Router 7 · Supabase (PostgreSQL, Auth, Edge Functions) · Cloudflare Pages.

## Empezar en tu computador (VS Code)

Necesitas **Node.js 22** y **Git** instalados.

```bash
git clone https://github.com/juseval/jessy-idiomas-app.git
cd jessy-idiomas-app
git checkout dev          # se trabaja sobre dev, nunca directo en main
npm install
cp .env.example .env.local   # en Windows: copy .env.example .env.local
code .                    # abre el proyecto en VS Code
npm run dev               # http://localhost:5173
```

Al abrir el proyecto, VS Code sugiere instalar las extensiones recomendadas (ESLint, Prettier, Tailwind, Deno, Supabase): acepta.

## Scripts

| Comando             | Qué hace                       |
| ------------------- | ------------------------------ |
| `npm run dev`       | Servidor de desarrollo         |
| `npm run build`     | Compila para producción        |
| `npm run lint`      | Revisa el código con ESLint    |
| `npm run typecheck` | Revisa los tipos de TypeScript |
| `npm test`          | Corre las pruebas (Vitest)     |
| `npm run format`    | Formatea todo con Prettier     |

## Estructura

```
src/
  app/            router y layouts por rol (director, profesor, estudiante)
  components/ui/  componentes base (Button, TextInput, DocumentInput…)
  features/       una carpeta por funcionalidad (auth, students, planning…)
  lib/            supabase, utilidades y tipos compartidos
supabase/
  migrations/     cambios de la base de datos, en orden (nunca se editan, se agregan)
  functions/      Edge Functions (crear usuarios, activar cuentas)
  seed.sql        datos base (niveles A1–B2)
  tests/          prueba de las políticas de seguridad (RLS)
```

## Base de datos (Supabase)

El esquema está en `supabase/migrations/`. Refleja el modelo lógico del diagrama `Jessy_Idiomas_Modelo_de_Datos.drawio`.

### Local (recomendado para desarrollar)

Requiere Docker Desktop.

```bash
npx supabase start        # levanta Postgres, Auth y Studio locales
npx supabase db reset     # aplica migraciones + seed
npx supabase functions serve   # corre las Edge Functions
```

Copia la `API URL` y la `anon key` que imprime `supabase start` en tu `.env.local`. Studio queda en http://localhost:54323.

### Proyecto en la nube

1. Crea el proyecto en supabase.com (a nombre de la academia).
2. `npx supabase login` y `npx supabase link --project-ref <ref>`
3. `npx supabase db push` para aplicar las migraciones.
4. `npx supabase functions deploy admin-users` y `npx supabase functions deploy activate-account --no-verify-jwt`

### Cómo funciona el acceso

- **Nadie se registra solo.** El director crea cada cuenta (Edge Function `admin-users`) y la plataforma le da un **código de activación de 6 dígitos** para entregarle a la persona.
- La persona entra a **/activar** con su documento + código y crea su contraseña (Edge Function `activate-account`). El código vence a los 14 días y se bloquea tras 5 intentos.
- Supabase Auth usa correo, así que cada documento se convierte en un correo interno `documento@usuarios.jessyidiomas.app` (ver `src/lib/document.ts`). El usuario nunca lo ve.
- En pantalla el documento se muestra solo con los **últimos 4 dígitos**.
- La seguridad real está en las **políticas RLS** de la base de datos: un estudiante solo ve lo suyo, un profesor solo sus grupos, el director todo. Para probarlas: `supabase/tests/rls_smoke_test.sql`.

### Crear el primer director

Como `admin-users` exige ser director, el primero se crea a mano desde Studio:

1. Authentication → Add user → correo `<documento>@usuarios.jessyidiomas.app` y una contraseña.
2. SQL Editor:
   ```sql
   insert into profiles (id, doc_number, first_name, last_name, role, is_activated)
   values ('<id del usuario>', '<documento>', 'Jessy', '<apellido>', 'master', true);
   ```

## Reglas del producto (no negociables)

- La palabra **"IA"** no aparece en ninguna pantalla.
- El documento se muestra enmascarado (últimos 4 dígitos).
- Todo debe funcionar bien en el celular.

## Cómo trabajamos

Lee [CONTRIBUTING.md](./CONTRIBUTING.md): ramas, commits y pull requests. Las tareas están en el tablero de Trello **Plataforma Jessyidiomas**.
