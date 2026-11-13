import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-context'
import { HOME_BY_ROLE } from '@/lib/types'

// Página pública de la academia: es la puerta de entrada. Desde aquí se va al login.

const GREETINGS = ['Hello!', 'Nice to meet you', 'How are you?', 'Let’s practice!', 'See you in class']

const BUBBLES = [
  { text: 'verb to be', className: 'left-[6%] top-[18%]', delay: '0s' },
  { text: 'I have', className: 'right-[8%] top-[14%]', delay: '1.2s' },
  { text: 'present simple', className: 'left-[10%] bottom-[16%]', delay: '0.6s' },
  { text: 'Where are you from?', className: 'right-[6%] bottom-[20%]', delay: '1.8s' },
]

const LEVELS = [
  { code: 'A1', name: 'Principiante', text: 'Saludos, verb to be, rutinas y vocabulario del día a día.' },
  { code: 'A2', name: 'Básico', text: 'Pasado, planes y conversaciones cortas con seguridad.' },
  { code: 'B1', name: 'Intermedio', text: 'Opiniones, experiencias y textos más largos.' },
  { code: 'B2', name: 'Intermedio alto', text: 'Fluidez, matices y conversaciones naturales.' },
  { code: 'C1', name: 'Avanzado', text: 'Inglés con soltura para estudiar, trabajar y viajar.' },
]

const STEPS = [
  { tag: 'Antes', title: 'Llegas preparado', text: 'Practicas el tema de la clase con ejercicios cortos.' },
  {
    tag: 'En clase',
    title: 'Aprendes con tu grupo',
    text: 'Tu profesor sabe qué tema toca y con qué material.',
  },
  { tag: 'Después', title: 'Lo vuelves tuyo', text: 'Repasas lo visto y ves tu progreso semana a semana.' },
]

function RotatingGreeting() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % GREETINGS.length), 2200)
    return () => clearInterval(id)
  }, [])
  return (
    <span key={index} className="animate-word-in inline-block text-brand">
      {GREETINGS[index]}
    </span>
  )
}

export function HomePage() {
  const { session, profile } = useAuth()
  const panel = session && profile ? HOME_BY_ROLE[profile.role] : null

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="h-9 w-9" />
            <span className="font-display font-extrabold tracking-wide text-white">JESSY IDIOMAS</span>
          </Link>
          <Link
            to={panel ?? '/login'}
            className="rounded-xl bg-brand px-4 py-2 font-bold text-white transition hover:bg-brand-dark"
          >
            {panel ? 'Ir a mi panel' : 'Ingresar'}
          </Link>
        </div>
      </header>

      {/* Hero con movimiento */}
      <section className="relative overflow-hidden border-b-4 border-accent bg-ink text-white">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-blob rounded-full bg-brand/40 blur-3xl" />
        <div
          className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 animate-blob rounded-full bg-accent/30 blur-3xl"
          style={{ animationDelay: '3s' }}
        />
        {BUBBLES.map((b) => (
          <span
            key={b.text}
            className={`pointer-events-none absolute hidden animate-float rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 md:block ${b.className}`}
            style={{ animationDelay: b.delay }}
          >
            {b.text}
          </span>
        ))}

        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center md:py-28">
          <img src="/favicon.svg" alt="Jessy Idiomas" className="h-24 w-24 animate-pop" />
          <h1 className="font-display text-4xl font-black leading-tight md:text-6xl">
            Aprende inglés y di
            <br />
            <RotatingGreeting />
          </h1>
          <p className="max-w-xl text-lg text-slate-300">
            Clases en grupo con seguimiento real: practicas antes y después de cada clase, y ves cómo avanzas.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to={panel ?? '/login'}
              className="rounded-xl bg-brand px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              {panel ? 'Ir a mi panel' : 'Ingresar a la plataforma'}
            </Link>
            {!panel && (
              <Link
                to="/activar"
                className="rounded-xl border border-white/30 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Activar mi cuenta
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-display text-3xl font-extrabold">Cada clase, en tres momentos</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <article
              key={s.tag}
              className="animate-rise rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-dark">
                {s.tag}
              </span>
              <h3 className="mt-4 font-display text-xl font-extrabold">{s.title}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Ruta de niveles */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-3xl font-extrabold">Tu ruta, de A1 a C1</h2>
          <p className="mt-2 text-center text-muted">Avanzas tema por tema, en el orden que tiene sentido.</p>
          <ol className="relative mt-12 grid gap-6 md:grid-cols-5">
            <div className="absolute left-0 right-0 top-7 hidden h-1 overflow-hidden rounded bg-line md:block">
              <div className="h-full w-1/3 animate-path rounded bg-gradient-to-r from-brand to-accent" />
            </div>
            {LEVELS.map((l, i) => (
              <li key={l.code} className="relative flex flex-col items-center text-center">
                <span
                  className="z-10 grid h-14 w-14 animate-pop place-items-center rounded-full bg-ink font-display text-lg font-black text-white ring-4 ring-white"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {l.code}
                </span>
                <h3 className="mt-3 font-display text-lg font-extrabold">{l.name}</h3>
                <p className="mt-1 max-w-56 text-sm text-muted">{l.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Llamado final */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-brand px-6 py-12 text-center text-white">
          <h2 className="font-display text-3xl font-extrabold">¿Ya eres estudiante de la academia?</h2>
          <p className="max-w-lg text-blue-100">
            Entra con tu número de documento. Si es tu primera vez, activa tu cuenta con el código que te dio
            la academia.
          </p>
          <Link
            to={panel ?? '/login'}
            className="rounded-xl bg-white px-6 py-3 font-bold text-brand-dark transition hover:-translate-y-0.5"
          >
            {panel ? 'Ir a mi panel' : 'Ingresar'}
          </Link>
        </div>
      </section>

      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} Jessy Idiomas · Medellín
      </footer>
    </div>
  )
}
