
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-context'
import { HOME_BY_ROLE } from '@/lib/types'

const GREETINGS = ['hablar.', 'aprender.', 'avanzar.', 'comunicarte.']

const LEVELS = [
  {
    code: 'A1',
    name: 'Principiante',
    text: 'Presentarte, hablar de tu familia y tu rutina. Verb to be, verb to have y vocabulario básico.',
  },
  {
    code: 'A2',
    name: 'Básico',
    text: 'Contar lo que hiciste, hacer planes y resolver situaciones del día a día.',
  },
  {
    code: 'B1',
    name: 'Intermedio',
    text: 'Dar tu opinión, explicar experiencias y mantener una conversación con soltura.',
  },
  {
    code: 'B2',
    name: 'Intermedio alto',
    text: 'Debatir, entender series y conversaciones reales, y prepararte para el trabajo o un examen.',
  },
  {
    code: 'C1',
    name: 'Avanzado',
    text: 'Expresarte con fluidez y utilizar el inglés en contextos académicos y profesionales.',
  },
]

const STEPS = [
  {
    number: '1.',
    title: 'Prepárate',
    text: 'Antes de clase entras a la plataforma y conoces el vocabulario del tema en pocos minutos.',
    icon: '▣',
  },
  {
    number: '2.',
    title: 'Vive la clase',
    text: 'En la academia, con tu profesor y tu grupo: hablas, juegas y participas desde el primer día.',
    icon: '♧',
  },
  {
    number: '3.',
    title: 'Repasa',
    text: 'Después de clase practicas el tema conversando en inglés y recibes correcciones.',
    icon: '◌',
  },
]

const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=85',
    alt: 'Estudiantes compartiendo una actividad educativa',
  },
  {
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85',
    alt: 'Estudiantes participando en una clase',
  },
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85',
    alt: 'Grupo de estudiantes aprendiendo juntos',
  },
]

function RotatingGreeting() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % GREETINGS.length)
    }, 2400)

    return () => window.clearInterval(id)
  }, [])

  return (
    <span
      key={index}
      className="inline-block text-blue-400 transition-all duration-300"
    >
      {GREETINGS[index]}
    </span>
  )
}

export function HomePage() {
  const { session, profile } = useAuth()
  const panel = session && profile ? HOME_BY_ROLE[profile.role] : null

  const accessUrl = panel ?? '/login'
  const accessText = panel ? 'Ir a mi panel' : 'Ingresar a la plataforma'

  return (
    <main className="min-h-screen overflow-hidden bg-white text-ink">
      {/* Navegación */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src="/favicon.svg"
              alt="Jessy Idiomas"
              className="h-9 w-9 rounded-full"
            />
            <span className="font-display text-sm font-extrabold tracking-wide text-white">
              JESSY IDIOMAS
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-semibold text-white/80 md:flex">
            <a href="#niveles" className="transition hover:text-white">
              Niveles
            </a>
            <a href="#como-estudiamos" className="transition hover:text-white">
              Cómo estudiamos
            </a>
            <a href="#academia" className="transition hover:text-white">
              La academia
            </a>
            <a href="#contacto" className="transition hover:text-white">
              Contacto
            </a>
          </nav>

          <Link
            to={accessUrl}
            className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-500"
          >
            {accessText}
          </Link>
        </div>
      </header>

      {/* Portada principal */}
      <section
        className="relative flex min-h-[500px] items-center overflow-hidden border-b-4 border-accent bg-ink bg-cover bg-center text-white sm:min-h-[570px]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(18,22,28,.97) 0%, rgba(18,22,28,.88) 48%, rgba(18,22,28,.52) 100%), url('https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1800&q=90')",
        }}
      >
        <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full border border-white/15 sm:h-[430px] sm:w-[430px]" />
        <div className="pointer-events-none absolute -right-8 top-24 h-64 w-64 rounded-full border border-white/10 sm:h-[350px] sm:w-[350px]" />

        <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 md:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Academia de inglés · Niveles A1 a C1
            </div>

            <h1 className="font-display text-5xl font-black leading-[1.04] tracking-tight sm:text-6xl md:text-7xl">
              Aprende inglés
              <br />
              para <RotatingGreeting />
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
              Clases en grupo en la academia y práctica en la plataforma antes
              y después de cada clase, para que lo que aprendes se quede.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={panel ?? '/activar'}
                className="rounded-full bg-accent px-6 py-3 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-700"
              >
                {panel ? 'Ir a mi panel' : 'Quiero inscribirme'}
              </Link>

              <a
                href="#niveles"
                className="rounded-full border border-white/60 px-6 py-3 text-xs font-bold text-white transition hover:bg-white hover:text-ink"
              >
                Ver los niveles
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Franja de frases en inglés */}
      <div className="overflow-hidden bg-brand py-3.5 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-around gap-8 px-5 text-sm font-extrabold sm:text-base">
          <span className="whitespace-nowrap">Let's practice</span>
          <span className="text-white/50">✦</span>
          <span className="whitespace-nowrap">You can do it</span>
          <span className="text-white/50">✦</span>
          <span className="whitespace-nowrap">Hello!</span>
          <span className="text-white/50">✦</span>
          <span className="hidden whitespace-nowrap sm:inline">How are you?</span>
          <span className="hidden text-white/50 sm:inline">✦</span>
          <span className="hidden whitespace-nowrap md:inline">Nice to meet you</span>
        </div>
      </div>

      {/* Niveles */}
      <section id="niveles" className="scroll-mt-20 bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-accent">
            Niveles
          </p>

          <h2 className="mt-2 max-w-xl font-display text-3xl font-black leading-tight sm:text-4xl">
            Un camino claro, de tus primeras palabras a la conversación
          </h2>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {LEVELS.map((level, index) => (
              <article
                key={level.code}
                className={`rounded-xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                  index === 3
                    ? 'border-ink bg-ink text-white'
                    : 'border-line bg-white text-ink'
                }`}
              >
                <p
                  className={`font-display text-3xl font-black ${
                    index === 2
                      ? 'text-accent'
                      : index === 3
                        ? 'text-red-400'
                        : 'text-brand'
                  }`}
                >
                  {level.code}
                </p>

                <h3 className="mt-2 text-sm font-extrabold">{level.name}</h3>

                <p
                  className={`mt-2 text-xs leading-5 ${
                    index === 3 ? 'text-slate-300' : 'text-muted'
                  }`}
                >
                  {level.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo estudiamos */}
      <section
        id="como-estudiamos"
        className="scroll-mt-20 border-t border-line bg-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-accent">
            Cómo estudiamos
          </p>

          <h2 className="mt-2 max-w-xl font-display text-3xl font-black leading-tight sm:text-4xl">
            Tres momentos en cada tema. Así sí se aprende.
          </h2>

          <div className="relative mt-12 grid gap-9 md:grid-cols-3 md:gap-8">
            <div className="absolute left-[12%] right-[12%] top-6 hidden h-0.5 bg-brand md:block" />

            {STEPS.map((step, index) => (
              <article key={step.number} className="relative">
                <div
                  className={`relative z-10 grid h-12 w-12 place-items-center rounded-full border-2 border-brand bg-white text-xl font-bold ${
                    index === 1 ? 'bg-brand text-white' : 'text-brand'
                  }`}
                >
                  {step.icon}
                </div>

                <h3 className="mt-5 text-base font-extrabold">
                  {step.number} {step.title}
                </h3>

                <p className="mt-2 max-w-sm text-xs leading-6 text-muted">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Galería de la academia */}
      <section
        id="academia"
        className="scroll-mt-20 bg-surface py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-accent">
                La academia
              </p>

              <h2 className="mt-2 max-w-lg font-display text-3xl font-black leading-tight sm:text-4xl">
                Clases con energía, en grupos donde todos hablan
              </h2>
            </div>

            <a
              href="https://www.tiktok.com/@jessy_idiomas"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-brand underline underline-offset-4"
            >
              Míranos en TikTok: @jessy_idiomas
            </a>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((photo) => (
              <div
                key={photo.src}
                className="group h-56 overflow-hidden rounded-2xl bg-slate-200 sm:h-64"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Llamado a la acción */}
      <section id="contacto" className="scroll-mt-20 bg-accent py-14 text-white sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-9 px-5 sm:px-8 md:flex-row">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-black leading-tight sm:text-4xl">
              ¿Listo para tu
              <br />
              primera clase?
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/85">
              Escríbenos y te ayudamos a encontrar tu nivel y el horario que
              mejor te queda.
            </p>

            <a
              href="https://wa.me/?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20clases%20de%20Jessy%20Idiomas."
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-extrabold text-ink transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              <span aria-hidden="true">☎</span>
              Escríbenos por WhatsApp
            </a>
          </div>

          <img
            src="/favicon.svg"
            alt="Logo de Jessy Idiomas"
            className="h-32 w-32 rounded-full border-4 border-white/80 bg-white p-2 shadow-xl sm:h-40 sm:w-40"
          />
        </div>
      </section>

      {/* Pie de página */}
      <footer className="bg-ink py-9 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.svg"
              alt=""
              className="h-11 w-11 rounded-full"
            />
            <div>
              <p className="text-xs font-extrabold">JESSY IDIOMAS</p>
              <p className="mt-1 text-[10px] text-slate-400">
                Academia de inglés
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-extrabold">Visítanos</h3>
            <p className="mt-2 text-[10px] leading-5 text-slate-400">
              Medellín, Colombia
              <br />
              Consulta nuestros horarios de atención.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-extrabold">Contacto</h3>
            <a
              href="https://www.tiktok.com/@jessy_idiomas"
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-[10px] text-slate-400 transition hover:text-white"
            >
              TikTok · @jessy_idiomas
            </a>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-[10px] text-slate-400 transition hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 px-5 pt-5 text-[10px] text-slate-500 sm:px-8">
          © {new Date().getFullYear()} Jessy Idiomas · Medellín
        </div>
      </footer>
    </main>
  )
}
