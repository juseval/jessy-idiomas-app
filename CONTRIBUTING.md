# Cómo trabajamos

## Ramas

| Rama                         | Para qué                                         | ¿Se puede subir directo?                                |
| ---------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| `main`                       | Producción: lo que ve la academia                | ❌ No. Solo llega desde `dev` por pull request          |
| `dev`                        | Integración: aquí se junta el trabajo de los dos | ❌ No. Solo llega desde ramas de tarea por pull request |
| `feature/<tarjeta>-<nombre>` | Una tarjeta de Trello                            | ✅ Sí, es tu rama                                       |

Ejemplo: la tarjeta **3.1 Estudiantes** → rama `feature/3.1-estudiantes`.
Para arreglos urgentes: `fix/<descripcion-corta>`.

## El flujo de cada tarea

```bash
# 1. Trae lo último de dev
git checkout dev
git pull

# 2. Crea tu rama para la tarjeta
git checkout -b feature/3.1-estudiantes

# 3. Trabaja y guarda con commits pequeños
git add .
git commit -m "feat(estudiantes): lista con búsqueda y filtros"

# 4. Sube tu rama
git push -u origin feature/3.1-estudiantes
```

5. En GitHub abre un **Pull Request de tu rama → `dev`**. Completa la plantilla y pide revisión al otro.
6. El otro revisa, comenta y aprueba. Se hace **Squash and merge**.
7. Mueve la tarjeta en Trello a **Finalizado** y borra tu rama.

Cuando `dev` está estable (fin de una fase), se abre un PR de **`dev` → `main`** para publicar.

## Mensajes de commit

Formato: `tipo(área): qué hiciste`, en español y en presente.

- `feat`: algo nuevo · `fix`: arreglo · `refactor`: cambio interno sin cambiar el comportamiento
- `style`: solo formato · `docs`: documentación · `chore`: configuración, dependencias · `test`: pruebas

Ejemplos: `feat(pagos): registrar pago manual` · `fix(login): mensaje cuando el documento no existe`

## Reglas para no pisarnos

- **Nunca** hagas push directo a `main` ni a `dev`.
- Antes de empezar una tarjeta, **asígnatela en Trello** para que el otro sepa que la tomaste.
- Haz `git pull` de `dev` seguido y, si tu rama se queda atrás: `git checkout dev && git pull && git checkout tu-rama && git merge dev`.
- **Base de datos:** nunca edites una migración que ya está en `dev`. Crea una nueva con `npx supabase migration new nombre-del-cambio`.
- **Nunca subas** `.env.local` ni ninguna clave. La `service_role` de Supabase jamás va en el frontend.
- Si dos personas necesitan tocar el mismo archivo, avísense primero.

## Antes de abrir un Pull Request

```bash
npm run lint
npm run typecheck
npm test
```

GitHub corre lo mismo automáticamente en cada PR (pestaña **Actions**). Si sale en rojo, no se hace merge.
